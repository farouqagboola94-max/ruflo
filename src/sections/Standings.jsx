import { useState, useEffect, useCallback, useRef } from 'react'
import { B } from '../tokens'
import { GrainOverlay, ScanLines, SectionTag } from '../components/Shared'
import { getPassport, getTier, getLevel, subscribe } from '../lib/passport'

// The XP system already existed - tiers, fifty levels, a hundred easter eggs -
// but it lived in localStorage where nobody could see it. A number only you
// can read is not a reason to come back. This puts you on a board next to
// everyone else and, more to the point, tells you exactly how far you are off
// the person one rung up.

const ENDPOINT = '/.netlify/functions/standings'
const HANDLE_KEY = 'sf26_standings_handle'
const MONO = "'Space Mono', monospace"

const clean = s => String(s || '').trim().toLowerCase().replace(/^@+/, '')

function storedHandle() {
  try { return localStorage.getItem(HANDLE_KEY) || '' } catch { return '' }
}

function Row({ entry, mine }) {
  const medal = entry.rank <= 3 ? ['🥇', '🥈', '🥉'][entry.rank - 1] : null
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 12, padding: '11px 14px',
      background: mine ? `${B.amber}12` : 'transparent',
      border: `1px solid ${mine ? `${B.amber}40` : 'transparent'}`,
      borderRadius: 8,
      borderBottom: mine ? `1px solid ${B.amber}40` : '1px solid rgba(255,255,255,0.05)',
    }}>
      <span style={{
        fontFamily: "'Orbitron'", fontSize: 11, fontWeight: 900, minWidth: 38,
        color: mine ? B.amber : entry.rank <= 3 ? B.neonCyan : '#555',
      }}>{medal || `#${entry.rank}`}</span>
      <span style={{
        flex: 1, fontFamily: MONO, fontSize: 11, letterSpacing: 1,
        color: mine ? B.white : '#999', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
      }}>@{entry.handle}{mine && <span style={{ color: B.amber, marginLeft: 8, fontSize: 8 }}>YOU</span>}</span>
      <span style={{ fontFamily: "'Orbitron'", fontSize: 12, fontWeight: 900, color: mine ? B.amber : B.smoke }}>
        {entry.xp.toLocaleString()}
      </span>
    </div>
  )
}

export default function Standings() {
  const [handle, setHandle]   = useState(storedHandle)
  const [draft, setDraft]     = useState('')
  const [passport, setPass]   = useState(() => getPassport())
  const [data, setData]       = useState(null)
  const [error, setError]     = useState('')
  const [busy, setBusy]       = useState(false)
  const lastSent = useRef(null)

  useEffect(() => subscribe(() => setPass(getPassport())), [])

  const load = useCallback(async (h = handle) => {
    try {
      const res = await fetch(`${ENDPOINT}${h ? `?handle=${encodeURIComponent(h)}` : ''}`)
      if (res.ok) setData(await res.json())
    } catch {}
  }, [handle])

  useEffect(() => { load() }, [load])

  // Push the score whenever it actually changes. Sending the same number
  // again would just be noise against the rate limit.
  const sync = useCallback(async (h, xp) => {
    if (!h || lastSent.current === xp) return
    lastSent.current = xp
    try {
      const res = await fetch(ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ handle: h, xp }),
      })
      if (res.ok) setData(await res.json())
      else {
        const body = await res.json().catch(() => ({}))
        setError(body.error || 'Could not post your score.')
      }
    } catch {
      setError('Could not reach the board.')
    }
  }, [])

  useEffect(() => { if (handle) sync(handle, passport.xp) }, [handle, passport.xp, sync])

  async function claim() {
    const h = clean(draft)
    if (!h || busy) return
    setBusy(true); setError('')
    try {
      const res = await fetch(ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ handle: h, xp: passport.xp }),
      })
      const body = await res.json().catch(() => ({}))
      if (!res.ok) { setError(body.error || 'That handle was not accepted.'); return }
      try { localStorage.setItem(HANDLE_KEY, h) } catch {}
      lastSent.current = passport.xp
      setHandle(h)
      setData(body)
    } catch {
      setError('Could not reach the board.')
    } finally {
      setBusy(false)
    }
  }

  const tier  = getTier(passport.xp)
  const level = getLevel(passport.xp)
  const you   = data?.you

  return (
    <section id="standings" style={{
      background: `linear-gradient(180deg, ${B.black} 0%, ${B.void} 100%)`,
      padding: '80px 20px', position: 'relative', overflow: 'hidden',
    }}>
      <GrainOverlay /><ScanLines />

      <div style={{ maxWidth: 640, margin: '0 auto', position: 'relative', zIndex: 2 }}>
        <SectionTag>THE STANDINGS</SectionTag>

        <h2 className="reveal-3d text-3d" style={{
          fontFamily: "'Bebas Neue'", fontSize: 'clamp(2.2rem,6vw,4rem)',
          color: B.white, letterSpacing: '0.05em', margin: '10px 0 8px',
        }}>WHERE YOU RANK</h2>

        <p style={{ fontFamily: "'Syne'", fontSize: '0.88rem', color: B.smoke, lineHeight: 1.7, marginBottom: 26 }}>
          Every egg you find, every game you win, every Friday you show up — it all
          counts. Put a handle on it and see who is actually ahead of you.
        </p>

        {/* Your card */}
        <div className="card-3d" style={{
          background: 'rgba(255,255,255,0.02)', border: `1px solid ${tier.color}35`,
          borderRadius: 12, padding: '20px 22px', marginBottom: 20,
        }}>
          <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' }}>
            <div>
              <div style={{ fontFamily: MONO, fontSize: 8, color: tier.color, letterSpacing: 3, marginBottom: 4 }}>
                {tier.name.toUpperCase()} · LEVEL {level.level}
              </div>
              <div style={{ fontFamily: "'Bebas Neue'", fontSize: '2.2rem', color: B.white, letterSpacing: 2, lineHeight: 1 }}>
                {passport.xp.toLocaleString()} XP
              </div>
            </div>
            {you && (
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontFamily: MONO, fontSize: 8, color: '#555', letterSpacing: 2, marginBottom: 4 }}>YOUR RANK</div>
                <div style={{ fontFamily: "'Orbitron'", fontSize: '1.8rem', fontWeight: 900, color: B.amber }}>
                  #{you.rank}
                </div>
                <div style={{ fontFamily: MONO, fontSize: 8, color: '#444', marginTop: 2 }}>of {data.total}</div>
              </div>
            )}
          </div>

          {/* Level bar */}
          <div style={{ height: 5, background: 'rgba(255,255,255,0.05)', borderRadius: 3, overflow: 'hidden', margin: '14px 0 8px' }}>
            <div style={{ height: '100%', width: `${level.pct}%`, background: tier.color, borderRadius: 3, transition: 'width 0.6s ease' }} />
          </div>
          <div style={{ fontFamily: MONO, fontSize: 8, color: '#555', letterSpacing: 1 }}>
            {level.xpToNext > 0 ? `${level.xpToNext} XP TO LEVEL ${level.level + 1}` : 'MAX LEVEL'}
          </div>

          {/* The hook: the gap to the rung above */}
          {data?.chasing && (
            <div style={{
              marginTop: 14, padding: '11px 13px', background: `${B.neonCyan}0D`,
              border: `1px solid ${B.neonCyan}30`, borderRadius: 7,
              fontFamily: MONO, fontSize: 10, color: B.neonCyan, lineHeight: 1.6,
            }}>
              {data.chasing.gap === 0
                ? `You are level with @${data.chasing.handle}. One more find puts you ahead.`
                : `${data.chasing.gap.toLocaleString()} XP behind @${data.chasing.handle}.`}
            </div>
          )}
          {data?.chasedBy && (
            <div style={{ marginTop: 8, fontFamily: MONO, fontSize: 9, color: '#555', lineHeight: 1.6 }}>
              @{data.chasedBy.handle} is {data.chasedBy.gap.toLocaleString()} XP behind you.
            </div>
          )}
        </div>

        {/* Claim a handle */}
        {!handle && (
          <div className="card-3d" style={{
            background: 'rgba(255,255,255,0.02)', border: `1px solid ${B.amber}30`,
            borderRadius: 12, padding: '18px 20px', marginBottom: 20,
          }}>
            <div style={{ fontFamily: MONO, fontSize: 8, color: B.amber, letterSpacing: 3, marginBottom: 10 }}>CLAIM YOUR HANDLE</div>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              <input
                value={draft} onChange={e => setDraft(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && claim()}
                placeholder="soleking"
                maxLength={18}
                style={{
                  flex: '1 1 180px', padding: '11px 14px', background: '#0d0d0d',
                  border: '1px solid #2a2a2a', borderRadius: 7, color: B.white,
                  fontFamily: MONO, fontSize: 12, outline: 'none', letterSpacing: 1,
                }}
              />
              <button onClick={claim} disabled={busy} style={{
                padding: '11px 22px', background: busy ? '#333' : B.amber, color: busy ? '#888' : B.black,
                border: 'none', borderRadius: 7, fontFamily: MONO, fontSize: 10,
                fontWeight: 700, letterSpacing: 2, cursor: busy ? 'default' : 'pointer',
              }}>{busy ? '…' : 'CLAIM'}</button>
            </div>
            <p style={{ fontFamily: MONO, fontSize: 8, color: '#3a3a3a', marginTop: 10, lineHeight: 1.7 }}>
              Letters, numbers and underscores. No email needed — the handle is all
              anyone sees.
            </p>
          </div>
        )}

        {error && (
          <div style={{ fontFamily: MONO, fontSize: 10, color: '#ff5555', marginBottom: 16, lineHeight: 1.6 }}>{error}</div>
        )}

        {/* Your neighbourhood */}
        {handle && data?.near?.length > 1 && (
          <>
            <div style={{ fontFamily: MONO, fontSize: 8, color: '#555', letterSpacing: 3, margin: '4px 0 8px' }}>AROUND YOU</div>
            <div style={{ marginBottom: 24 }}>
              {data.near.map(e => <Row key={e.handle} entry={e} mine={e.handle === handle} />)}
            </div>
          </>
        )}

        {/* Top of the board */}
        <div style={{ fontFamily: MONO, fontSize: 8, color: '#555', letterSpacing: 3, marginBottom: 8 }}>TOP OF THE BOARD</div>
        {data?.top?.length
          ? data.top.map(e => <Row key={e.handle} entry={e} mine={e.handle === handle} />)
          : <div style={{ fontFamily: MONO, fontSize: 11, color: '#333', padding: '18px 0' }}>
              Nobody has claimed a handle yet. Be first.
            </div>}

        <p style={{ fontFamily: MONO, fontSize: 8, color: '#333', marginTop: 22, lineHeight: 1.8 }}>
          Scores are worked out in your browser, so treat this as bragging rights
          rather than a scoreboard we can certify. Prizes get checked by hand.
        </p>
      </div>
    </section>
  )
}
