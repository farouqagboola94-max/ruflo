import { useState, useEffect, useCallback } from 'react'
import { B } from '../tokens'
import {
  fetchResource, verify, getSecret, setSecret, clearSecret, downloadCSV,
  moderate, moderateMany, moderationKind,
} from './adminData'

// The organiser's view of everything the site collects. It used to read this
// browser's localStorage behind a password compiled into the public bundle,
// which meant it showed nothing anyone had actually submitted. Every number
// here now comes from the admin function.

const fmtDate = s => {
  try { return new Date(s).toLocaleString('en-GB', { dateStyle: 'short', timeStyle: 'short' }) }
  catch { return s || '—' }
}

// resource -> how to read it. `rows` pulls the list, `cols` picks the columns,
// `stats` is the strip above the table.
const TABS = [
  {
    id: 'OVERVIEW', resource: 'summary',
    stats: d => {
      const s = d.summary || {}
      return [
        ['TICKETS SOLD',   s.ticketsSold,                 `${s.checkedIn || 0} checked in`],
        ['REVENUE',        s.revenueFormatted || '₦0',    `${s.pendingPayments || 0} awaiting payment`],
        ['WAITLIST',       s.waitlistSize,                 'people queued'],
        ['VENDOR APPS',    s.vendorApps,                  `${s.pendingVendors || 0} to review`],
        ['CREWS',          s.crews,                       `${s.crewMembers || 0} members`],
        ['GROUP SEATS',    s.groupSeatsPaid,              `across ${s.groups || 0} groups`],
        ['FNP CHECK-INS',  s.fnpCheckIns,                 `${s.fnpSessions || 0} sessions`],
        ['TO MODERATE',    (s.confessionsPending || 0) + (s.solePending || 0) + (s.boardsPending || 0),
                           'confessions, registry, boards'],
        ['SUBSCRIBERS',    s.subscribers,                 `${s.contactMessages || 0} messages`],
      ]
    },
  },
  {
    id: 'TICKETS', resource: 'tickets', rows: d => d.tickets,
    cols: [['ticketId', 'TICKET'], ['name', 'NAME'], ['email', 'EMAIL'], ['tier', 'TIER'],
           ['amountNGN', 'PAID'], ['checkedIn', 'IN'], ['confirmedAt', 'WHEN']],
    stats: d => [['SOLD', d.total, `${d.checkedIn || 0} checked in`]],
  },
  {
    id: 'VENDORS', resource: 'vendors', rows: d => d.vendors,
    cols: [['applicationId', 'REF'], ['business', 'BUSINESS'], ['email', 'EMAIL'],
           ['category', 'CATEGORY'], ['booth', 'BOOTH'], ['status', 'STATUS'], ['submittedAt', 'WHEN']],
    stats: d => [['APPLICATIONS', d.total, `${d.pending || 0} pending`]],
  },
  {
    id: 'WAITLIST', resource: 'waitlist', rows: d => d.waitlist,
    cols: [['position', '#'], ['name', 'NAME'], ['email', 'EMAIL'],
           ['refCode', 'REF'], ['referredBy', 'VIA'], ['joinedAt', 'WHEN']],
    stats: d => [['ON THE LIST', d.total, 'real signups']],
  },
  {
    id: 'CREWS', resource: 'crews', rows: d => d.crews,
    cols: [['code', 'CODE'], ['name', 'CREW'], ['memberCount', 'MEMBERS'], ['createdAt', 'WHEN']],
    stats: d => [['CREWS', d.total, `${d.members || 0} members total`]],
  },
  {
    id: 'GROUPS', resource: 'groups', rows: d => d.groups,
    cols: [['code', 'CODE'], ['tier', 'TIER'], ['size', 'SEATS'],
           ['claimed', 'CLAIMED'], ['paidCount', 'PAID'], ['createdAt', 'WHEN']],
    stats: d => [['GROUPS', d.total, `${d.seatsPaid || 0} seats paid`]],
  },
  {
    id: 'RAFFLE', resource: 'raffle', rows: d => d.entries,
    cols: [['raffleId', 'RAFFLE'], ['name', 'NAME'], ['email', 'EMAIL'],
           ['entryNum', 'ENTRY'], ['enteredAt', 'WHEN']],
    stats: d => [['ENTRIES', d.total, Object.entries(d.byRaffle || {}).map(([k, v]) => `${k}:${v}`).join('  ') || 'none yet']],
  },
  {
    id: 'FNP', resource: 'fnp', rows: d => d.sessions,
    cols: [['sessionId', 'SESSION'], ['count', 'CHECK-INS']],
    stats: d => [['SESSIONS', d.total, `${d.totalCheckIns || 0} check-ins`]],
  },
  {
    id: 'MODERATE', resource: 'confessions', rows: d => d.pending,
    cols: [['id', 'ID'], ['text', 'CONFESSION'], ['submittedAt', 'WHEN']],
    stats: d => [['PENDING', (d.pending || []).length,
                  `${(d.approved || []).length} approved · ${(d.rejected || []).length} rejected`]],
  },
  {
    id: 'REGISTRY', resource: 'sole', rows: d => d.pending,
    cols: [['id', 'REF'], ['display', 'NAME'], ['city', 'CITY'], ['shoe', 'GRAIL'],
           ['brand', 'BRAND'], ['story', 'STORY'], ['registeredAt', 'WHEN']],
    stats: d => [['AWAITING REVIEW', (d.pending || []).length,
                  `${(d.approved || []).length} on the wall · ${(d.rejected || []).length} rejected`]],
  },
  {
    id: 'WALL', resource: 'wall', rows: d => d.pending,
    cols: [['id', 'REF'], ['name', 'NAME'], ['city', 'CITY'], ['msg', 'MESSAGE'], ['postedAt', 'WHEN']],
    stats: d => [['AWAITING REVIEW', (d.pending || []).length,
                  `${(d.approved || []).length} live · ${(d.rejected || []).length} rejected`]],
  },
  {
    id: 'TRADES', resource: 'trades', rows: d => d.pending,
    cols: [['id', 'REF'], ['name', 'PAIR'], ['brand', 'BRAND'], ['size', 'SIZE'],
           ['condition', 'COND'], ['asking', 'ASKING'], ['contact', 'PHONE'], ['postedAt', 'WHEN']],
    stats: d => [['AWAITING REVIEW', (d.pending || []).length,
                  `${(d.approved || []).length} live · ${(d.rejected || []).length} rejected`]],
  },
  {
    id: 'INBOX', resource: 'contacts', rows: d => d.contacts,
    cols: [['name', 'NAME'], ['email', 'EMAIL'], ['subject', 'SUBJECT'], ['submittedAt', 'WHEN']],
    stats: d => [['MESSAGES', d.total, 'from the contact form']],
  },
]

const PANEL = { background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 12 }
const MONO  = "'Space Mono', monospace"

function Stat({ label, value, sub, color }) {
  return (
    <div style={{ ...PANEL, flex: '1 1 170px', border: `1px solid ${color}30`, padding: '20px 22px' }}>
      <div style={{ fontFamily: "'Orbitron'", fontSize: 8, color, letterSpacing: 3, marginBottom: 10 }}>{label}</div>
      <div style={{ fontFamily: "'Bebas Neue'", fontSize: 40, color: B.white, lineHeight: 1 }}>
        {value === undefined || value === null ? '—' : Number.isFinite(value) ? value.toLocaleString() : value}
      </div>
      {sub && <div style={{ fontFamily: MONO, fontSize: 9, color: '#555', marginTop: 6 }}>{sub}</div>}
    </div>
  )
}

function Gate({ onAuth }) {
  const [code, setCode] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  async function attempt() {
    if (!code.trim() || busy) return
    setBusy(true); setError('')
    try {
      await verify(code.trim())
      setSecret(code.trim())
      onAuth()
    } catch (e) {
      setError(e.message)
    } finally {
      setBusy(false)
    }
  }

  return (
    <div style={{ minHeight: '100vh', background: B.void, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
      <div style={{ ...PANEL, border: `1px solid ${B.amber}30`, padding: '48px 40px', width: '100%', maxWidth: 380, textAlign: 'center' }}>
        <div style={{ fontFamily: "'Orbitron'", fontSize: 10, color: B.amber, letterSpacing: 4, marginBottom: 8 }}>SNEAKERS FEST '26</div>
        <div style={{ fontFamily: "'Bebas Neue'", fontSize: 36, color: B.white, letterSpacing: 3, marginBottom: 28 }}>ORGANISER ACCESS</div>
        <input
          type="password" value={code} autoFocus
          onChange={e => setCode(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && attempt()}
          placeholder="Access code"
          style={{
            width: '100%', padding: '13px 16px', background: '#0d0d0d', border: '1px solid #2a2a2a',
            borderRadius: 8, color: B.white, fontFamily: MONO, fontSize: 13, textAlign: 'center',
            outline: 'none', boxSizing: 'border-box', marginBottom: 14, letterSpacing: 2,
          }}
        />
        <button
          onClick={attempt} disabled={busy}
          style={{
            width: '100%', padding: 13, background: busy ? '#333' : B.amber, color: busy ? '#888' : B.black,
            border: 'none', borderRadius: 8, fontFamily: MONO, fontSize: 11, fontWeight: 700,
            letterSpacing: 2, cursor: busy ? 'default' : 'pointer',
          }}
        >{busy ? 'CHECKING…' : 'ENTER'}</button>
        {error && <p style={{ fontFamily: MONO, fontSize: 10, color: '#ff5555', marginTop: 14, lineHeight: 1.6 }}>{error}</p>}
        <p style={{ fontFamily: MONO, fontSize: 8, color: '#3a3a3a', marginTop: 22, lineHeight: 1.7 }}>
          This is the ADMIN_SECRET set in Netlify. It is checked on the server and
          never stored beyond this browser tab.
        </p>
      </div>
    </div>
  )
}

function Table({ cols, rows, onAct, cursor, busyId }) {
  if (!rows?.length) {
    return <div style={{ ...PANEL, padding: 28, fontFamily: MONO, fontSize: 11, color: '#3a3a3a' }}>Nothing here yet.</div>
  }
  return (
    <div style={{ ...PANEL, overflowX: 'auto' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 640 }}>
        <thead>
          <tr>
            {cols.map(([, label]) => (
              <th key={label} style={{
                textAlign: 'left', padding: '12px 14px', fontFamily: MONO, fontSize: 8,
                color: '#555', letterSpacing: 2, borderBottom: '1px solid rgba(255,255,255,0.07)', whiteSpace: 'nowrap',
              }}>{label}</th>
            ))}
            {onAct && <th style={{
              textAlign: 'right', padding: '12px 14px', fontFamily: MONO, fontSize: 8,
              color: '#555', letterSpacing: 2, borderBottom: '1px solid rgba(255,255,255,0.07)',
            }}>REVIEW</th>}
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={r.id || r.code || r.ticketId || r.email || i}
                style={onAct && i === cursor ? { background: 'rgba(245,166,35,0.07)' } : undefined}>
              {cols.map(([key]) => {
                let v = r[key]
                if (typeof v === 'boolean') v = v ? 'YES' : '—'
                else if (/At$/.test(key)) v = fmtDate(v)
                else if (key === 'amountNGN' && v != null) v = `₦${Number(v).toLocaleString()}`
                return (
                  <td key={key} style={{
                    padding: '11px 14px', fontFamily: MONO, fontSize: 10, color: '#aaa',
                    borderBottom: '1px solid rgba(255,255,255,0.04)',
                    maxWidth: 320, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                  }}>{v === undefined || v === null || v === '' ? '—' : String(v)}</td>
                )
              })}
              {onAct && (
                <td style={{
                  padding: '9px 14px', textAlign: 'right', whiteSpace: 'nowrap',
                  borderBottom: '1px solid rgba(255,255,255,0.04)',
                }}>
                  <button
                    onClick={() => onAct(r.id, 'approve')} disabled={busyId === r.id}
                    style={{
                      padding: '5px 11px', marginRight: 6, borderRadius: 5, cursor: 'pointer',
                      background: 'transparent', border: `1px solid ${B.neonLime}50`,
                      color: B.neonLime, fontFamily: MONO, fontSize: 9, letterSpacing: 1,
                      opacity: busyId === r.id ? 0.4 : 1,
                    }}
                  >APPROVE</button>
                  <button
                    onClick={() => onAct(r.id, 'reject')} disabled={busyId === r.id}
                    style={{
                      padding: '5px 11px', borderRadius: 5, cursor: 'pointer',
                      background: 'transparent', border: '1px solid #ff444450',
                      color: '#ff6666', fontFamily: MONO, fontSize: 9, letterSpacing: 1,
                      opacity: busyId === r.id ? 0.4 : 1,
                    }}
                  >REJECT</button>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default function Admin() {
  const [authed, setAuthed] = useState(() => Boolean(getSecret()))
  const [tabId, setTabId]   = useState('OVERVIEW')
  const [data, setData]     = useState(null)
  const [error, setError]   = useState('')
  const [loading, setLoading] = useState(false)
  const [busyId, setBusyId]   = useState(null)
  const [cursor, setCursor]   = useState(0)
  const [notice, setNotice]   = useState('')

  const tab = TABS.find(t => t.id === tabId) || TABS[0]
  const canModerate = Boolean(moderationKind(tab.id))

  const load = useCallback(async () => {
    setLoading(true); setError(''); setData(null)
    try {
      setData(await fetchResource(tab.resource))
    } catch (e) {
      setError(e.message)
      // A rejected secret means the session is over, not that this tab failed.
      if (e.status === 401) { clearSecret(); setAuthed(false) }
    } finally {
      setLoading(false)
    }
  }, [tab.resource])

  useEffect(() => { if (authed) load() }, [authed, load])
  useEffect(() => { setCursor(0); setNotice('') }, [tabId])

  const rowsNow = data && tab.rows ? (tab.rows(data) || []) : []

  const act = useCallback(async (id, action) => {
    if (!id || busyId) return
    setBusyId(id); setError(''); setNotice('')
    try {
      await moderate(tab.id, id, action)
      setNotice(`${id} ${action === 'approve' ? 'approved' : 'rejected'}.`)
      // Keep the cursor where it was: the row under it has just left the
      // queue, so the next item slides into the same position.
      await load()
    } catch (e) {
      setError(e.message)
      if (e.status === 401) { clearSecret(); setAuthed(false) }
    } finally {
      setBusyId(null)
    }
  }, [tab.id, busyId, load])

  async function actAllVisible(action) {
    const ids = rowsNow.map(r => r.id).filter(Boolean)
    if (!ids.length) return
    const verb = action === 'approve' ? 'Approve' : 'Reject'
    if (!window.confirm(`${verb} all ${ids.length} pending items on this tab?`)) return

    setBusyId('bulk'); setError(''); setNotice('')
    try {
      const { done, failed } = await moderateMany(tab.id, ids, action)
      setNotice(failed
        ? `${done} ${action}d, ${failed} failed. Reload and try the rest.`
        : `${done} ${action}d.`)
      await load()
    } finally {
      setBusyId(null)
    }
  }

  // Working a queue of two hundred posts with a mouse is the slow way.
  useEffect(() => {
    if (!authed || !canModerate) return
    function onKey(e) {
      if (e.metaKey || e.ctrlKey || e.altKey) return
      const tag = e.target?.tagName
      if (tag === 'INPUT' || tag === 'TEXTAREA') return

      const max = rowsNow.length - 1
      if (e.key === 'j' || e.key === 'ArrowDown') { e.preventDefault(); setCursor(c => Math.min(max, c + 1)) }
      else if (e.key === 'k' || e.key === 'ArrowUp') { e.preventDefault(); setCursor(c => Math.max(0, c - 1)) }
      else if (e.key === 'a') { e.preventDefault(); act(rowsNow[cursor]?.id, 'approve') }
      else if (e.key === 'r') { e.preventDefault(); act(rowsNow[cursor]?.id, 'reject') }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [authed, canModerate, rowsNow, cursor, act])

  function logout() { clearSecret(); setAuthed(false); setData(null) }

  if (!authed) return <Gate onAuth={() => setAuthed(true)} />

  const rows  = data && tab.rows ? (tab.rows(data) || []) : null
  const stats = data && tab.stats ? tab.stats(data) : []
  const COLORS = [B.amber, B.neonCyan, B.neonMagenta, B.neonLime]

  return (
    <div style={{ minHeight: '100vh', background: B.void, color: B.white }}>
      <div style={{ background: '#050505', borderBottom: '1px solid rgba(255,255,255,0.07)', padding: '0 20px', position: 'sticky', top: 0, zIndex: 100 }}>
        <div style={{ maxWidth: 1180, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, minHeight: 54, flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 18, flexWrap: 'wrap', padding: '8px 0' }}>
            <span style={{ fontFamily: "'Orbitron'", fontSize: 10, color: B.amber, letterSpacing: 3 }}>SF26 · ADMIN</span>
            <div style={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
              {TABS.map(t => (
                <button key={t.id} onClick={() => setTabId(t.id)} style={{
                  padding: '6px 12px', cursor: 'pointer', fontFamily: MONO, fontSize: 9, letterSpacing: 1.5,
                  background: tabId === t.id ? `${B.amber}18` : 'transparent',
                  border: `1px solid ${tabId === t.id ? `${B.amber}40` : 'transparent'}`,
                  borderRadius: 6, color: tabId === t.id ? B.amber : '#555',
                }}>{t.id}</button>
              ))}
            </div>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button onClick={load} disabled={loading} style={{
              padding: '6px 12px', background: 'transparent', border: '1px solid #2a2a2a',
              borderRadius: 6, color: '#666', fontFamily: MONO, fontSize: 9, cursor: 'pointer',
            }}>{loading ? '…' : 'REFRESH'}</button>
            {rows?.length > 0 && (
              <button onClick={() => downloadCSV(`SF26-${tab.id.toLowerCase()}`, rows)} style={{
                padding: '6px 12px', background: 'transparent', border: `1px solid ${B.neonCyan}40`,
                borderRadius: 6, color: B.neonCyan, fontFamily: MONO, fontSize: 9, cursor: 'pointer',
              }}>CSV</button>
            )}
            <button onClick={logout} style={{
              padding: '6px 12px', background: 'transparent', border: '1px solid #2a2a2a',
              borderRadius: 6, color: '#555', fontFamily: MONO, fontSize: 9, cursor: 'pointer',
            }}>LOG OUT</button>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 1180, margin: '0 auto', padding: '28px 20px 60px', display: 'flex', flexDirection: 'column', gap: 22 }}>
        {error && (
          <div style={{ ...PANEL, border: '1px solid #ff444440', padding: '14px 18px', fontFamily: MONO, fontSize: 11, color: '#ff6666' }}>
            {error}
          </div>
        )}

        {loading && !data && (
          <div style={{ ...PANEL, padding: 28, fontFamily: MONO, fontSize: 11, color: '#3a3a3a' }}>Loading…</div>
        )}

        {stats.length > 0 && (
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            {stats.map(([label, value, sub], i) => (
              <Stat key={label} label={label} value={value} sub={sub} color={COLORS[i % COLORS.length]} />
            ))}
          </div>
        )}

        {canModerate && rows?.length > 0 && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
            <button onClick={() => actAllVisible('approve')} disabled={busyId} style={{
              padding: '7px 14px', background: `${B.neonLime}15`, border: `1px solid ${B.neonLime}45`,
              borderRadius: 6, color: B.neonLime, fontFamily: MONO, fontSize: 9,
              letterSpacing: 1, cursor: busyId ? 'default' : 'pointer',
            }}>APPROVE ALL {rows.length}</button>
            <button onClick={() => actAllVisible('reject')} disabled={busyId} style={{
              padding: '7px 14px', background: 'transparent', border: '1px solid #ff444445',
              borderRadius: 6, color: '#ff6666', fontFamily: MONO, fontSize: 9,
              letterSpacing: 1, cursor: busyId ? 'default' : 'pointer',
            }}>REJECT ALL</button>
            <span style={{ fontFamily: MONO, fontSize: 8, color: '#444', letterSpacing: 1 }}>
              J / K to move · A to approve · R to reject
            </span>
          </div>
        )}

        {notice && (
          <div style={{ fontFamily: MONO, fontSize: 10, color: B.neonLime, letterSpacing: 1 }}>{notice}</div>
        )}

        {rows && (
          <Table
            cols={tab.cols} rows={rows}
            onAct={canModerate ? act : null}
            cursor={cursor} busyId={busyId}
          />
        )}
      </div>
    </div>
  )
}
