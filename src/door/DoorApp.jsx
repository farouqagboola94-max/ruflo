import { useState, useEffect, useRef, useCallback } from 'react'
import { B } from '../tokens'
import {
  normaliseTicket, isValidTicket, readQueue, readLog,
  enqueue, dequeue, logScan, resolveLogged, tallies, ticketFromHash,
} from './doorQueue'

const CHECKIN = '/.netlify/functions/ticket-checkin'
const ADMIN = '/.netlify/functions/admin'
const MODERATE = '/.netlify/functions/moderate'
const SECRET_KEY = 'sf26_door_secret'

const mono = { fontFamily: "'Space Mono', monospace" }

const OUTCOME = {
  admitted:  { label: 'ADMITTED',   colour: B.neonLime },
  duplicate: { label: 'ALREADY IN', colour: B.amber },
  rejected:  { label: 'NOT VALID',  colour: B.neonMagenta },
  pending:   { label: 'QUEUED',     colour: B.neonCyan },
}

function Result({ result }) {
  if (!result) return null
  const o = OUTCOME[result.outcome]
  return (
    <div style={{
      padding: '22px 20px', borderRadius: 10, marginBottom: 18,
      background: `${o.colour}18`, border: `2px solid ${o.colour}`,
    }}>
      <div style={{ ...mono, fontSize: 11, letterSpacing: '0.24em', color: o.colour, fontWeight: 700 }}>
        {o.label}
      </div>
      {result.name && (
        <div style={{ fontFamily: "'Orbitron', monospace", fontWeight: 900, fontSize: 22, color: B.white, marginTop: 8 }}>
          {result.name}
        </div>
      )}
      <div style={{ ...mono, fontSize: 9, color: B.mist, marginTop: 6, letterSpacing: '0.1em' }}>
        {result.ticketId}
        {result.tier ? ` - ${String(result.tier).toUpperCase()}` : ''}
        {result.qty ? ` x${result.qty}` : ''}
      </div>
      {/* The whole point of a door list: when was this scanned before? */}
      {result.outcome === 'duplicate' && result.checkedInAt && (
        <div style={{ ...mono, fontSize: 10, color: B.amber, marginTop: 10, letterSpacing: '0.08em' }}>
          FIRST SCANNED {new Date(result.checkedInAt).toLocaleString()}
        </div>
      )}
      {result.outcome === 'pending' && (
        <div style={{ ...mono, fontSize: 9, color: B.neonCyan, marginTop: 10, letterSpacing: '0.08em' }}>
          NO SIGNAL - HELD AND WILL SYNC. NOT YET CONFIRMED.
        </div>
      )}
      {result.error && (
        <div style={{ ...mono, fontSize: 9, color: B.neonMagenta, marginTop: 10 }}>{result.error}</div>
      )}
    </div>
  )
}

function Gate({ secret, onLoseAuth }) {
  const [ticket, setTicket] = useState('')
  const [result, setResult] = useState(null)
  const [busy, setBusy] = useState(false)
  const [queue, setQueue] = useState(readQueue)
  const [log, setLog] = useState(readLog)
  const [online, setOnline] = useState(() => navigator.onLine)
  const inputRef = useRef(null)

  const t = tallies(log)

  const send = useCallback(async (ticketId) => {
    const res = await fetch(CHECKIN, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${secret}` },
      body: JSON.stringify({ ticketId }),
    })
    if (res.status === 401) { onLoseAuth(); throw new Error('AUTH') }
    return { status: res.status, data: await res.json().catch(() => ({})) }
  }, [secret, onLoseAuth])

  /** Push everything held offline, oldest first. */
  const flush = useCallback(async () => {
    for (const entry of readQueue()) {
      try {
        const { status, data } = await send(entry.ticketId)
        const outcome = status === 404 ? 'rejected' : data.alreadyUsed ? 'duplicate' : 'admitted'
        setLog(resolveLogged(entry.ticketId, outcome, {
          name: data.name, tier: data.tier, checkedInAt: data.checkedInAt,
        }))
        setQueue(dequeue(entry.ticketId))
      } catch {
        break // still offline, or auth gone; leave the rest queued
      }
    }
  }, [send])

  // A pass carries a QR pointing at /door.html#t=TICKETID, so a staff member
  // can use the camera app their phone already has - point, tap, land here
  // with the ticket filled in. That removes the typing that makes the queue.
  //
  // Prefilled, never auto-submitted: an accidental scan of a pass in someone's
  // hand must not silently burn their ticket. Staff still press the button.
  useEffect(() => {
    const fromHash = () => {
      const id = ticketFromHash(window.location.hash)
      if (!id) return
      setTicket(id)
      inputRef.current?.focus()
      // Clear it so a reload does not re-arm the same ticket, and so the ID is
      // not left sitting in the address bar of a shared staff phone.
      history.replaceState(null, '', window.location.pathname)
    }
    fromHash()
    window.addEventListener('hashchange', fromHash)
    return () => window.removeEventListener('hashchange', fromHash)
  }, [])

  useEffect(() => {
    const up = () => { setOnline(true); flush() }
    const down = () => setOnline(false)
    window.addEventListener('online', up)
    window.addEventListener('offline', down)
    if (navigator.onLine) flush()
    return () => { window.removeEventListener('online', up); window.removeEventListener('offline', down) }
  }, [flush])

  async function scan(e) {
    e.preventDefault()
    const id = normaliseTicket(ticket)

    if (!isValidTicket(id)) {
      setResult({ outcome: 'rejected', ticketId: id || '(empty)', error: 'Not a Sneakers Fest ticket format' })
      setLog(logScan({ ticketId: id, outcome: 'rejected', at: new Date().toISOString() }))
      setTicket(''); inputRef.current?.focus()
      return
    }

    setBusy(true)
    try {
      const { status, data } = await send(id)
      const outcome = status === 404 ? 'rejected' : data.alreadyUsed ? 'duplicate' : 'admitted'
      const entry = {
        ticketId: id, outcome, at: new Date().toISOString(),
        name: data.name, tier: data.tier, qty: data.qty, checkedInAt: data.checkedInAt,
        error: status === 404 ? 'No such ticket' : undefined,
      }
      setResult(entry)
      setLog(logScan(entry))
    } catch (err) {
      if (err.message === 'AUTH') return
      // Held rather than guessed. Pending is never shown as admitted.
      const entry = { ticketId: id, outcome: 'pending', at: new Date().toISOString() }
      setQueue(enqueue(id, entry.at))
      setResult(entry)
      setLog(logScan(entry))
    } finally {
      setBusy(false)
      setTicket('')
      inputRef.current?.focus()
    }
  }

  return (
    <>
      <div style={{ display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap' }}>
        {[['IN', t.admitted, B.neonLime], ['DUPES', t.duplicate, B.amber],
          ['NO', t.rejected, B.neonMagenta], ['QUEUED', queue.length, B.neonCyan]].map(([l, v, c]) => (
          <div key={l} style={{ flex: '1 1 70px', padding: '10px 8px', background: B.charcoal, border: `1px solid ${c}40`, borderRadius: 6, textAlign: 'center' }}>
            <div style={{ fontFamily: "'Orbitron', monospace", fontWeight: 900, fontSize: 20, color: c }}>{v}</div>
            <div style={{ ...mono, fontSize: 6.5, color: B.smoke, letterSpacing: '0.2em', marginTop: 2 }}>{l}</div>
          </div>
        ))}
      </div>

      {!online && (
        <div style={{ ...mono, fontSize: 9, letterSpacing: '0.14em', color: B.neonCyan, background: `${B.neonCyan}14`, border: `1px solid ${B.neonCyan}44`, borderRadius: 6, padding: '10px 12px', marginBottom: 14 }}>
          OFFLINE - SCANS ARE BEING HELD AND WILL SYNC
        </div>
      )}

      <Result result={result} />

      <form onSubmit={scan} style={{ marginBottom: 20 }}>
        <input aria-label="Ticket ID"
          ref={inputRef}
          value={ticket}
          onChange={e => setTicket(e.target.value.toUpperCase())}
          placeholder="SF26-GEN-A1B2C3"
          autoFocus
          autoCapitalize="characters"
          autoCorrect="off"
          spellCheck="false"
          style={{
            width: '100%', padding: '16px 14px', boxSizing: 'border-box',
            background: B.black, border: `1px solid ${B.gunmetal}`, borderRadius: 8,
            color: B.white, outline: 'none',
            fontFamily: "'Orbitron', monospace", fontSize: 20, letterSpacing: '0.12em', textAlign: 'center',
          }} />
        <button type="submit" disabled={busy} style={{
          width: '100%', marginTop: 10, padding: '16px', border: 'none', borderRadius: 8,
          background: B.amber, color: B.black, cursor: busy ? 'default' : 'pointer', opacity: busy ? 0.6 : 1,
          ...mono, fontSize: 12, fontWeight: 700, letterSpacing: '0.22em',
        }}>{busy ? 'CHECKING...' : 'CHECK IN'}</button>
      </form>

      <div style={{ ...mono, fontSize: 9, color: B.smoke, letterSpacing: '0.24em', marginBottom: 10 }}>RECENT</div>
      {log.slice(0, 25).map((e, i) => (
        <div key={`${e.ticketId}-${e.at}-${i}`} style={{
          display: 'flex', justifyContent: 'space-between', gap: 10,
          padding: '9px 0', borderBottom: `1px solid ${B.gunmetal}60`,
        }}>
          <span style={{ ...mono, fontSize: 9, color: B.mist, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {e.name || e.ticketId}
          </span>
          <span style={{ ...mono, fontSize: 8, letterSpacing: '0.12em', color: OUTCOME[e.outcome].colour, flexShrink: 0 }}>
            {OUTCOME[e.outcome].label}
          </span>
        </div>
      ))}
    </>
  )
}

function Moderation({ secret, onLoseAuth }) {
  const [pending, setPending] = useState([])
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  const load = useCallback(async () => {
    setError('')
    try {
      const r = await fetch(`${ADMIN}?resource=confessions`, { headers: { Authorization: `Bearer ${secret}` } })
      if (r.status === 401) return onLoseAuth()
      if (!r.ok) return setError('Could not load the queue')
      setPending((await r.json()).pending || [])
    } catch { setError('Network error') }
  }, [secret, onLoseAuth])

  useEffect(() => { load() }, [load])

  async function act(id, action) {
    setBusy(true)
    try {
      const r = await fetch(MODERATE, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${secret}` },
        body: JSON.stringify({ type: 'confession', id, action }),
      })
      if (r.status === 401) return onLoseAuth()
      if (r.ok) setPending(p => p.filter(c => c.submissionId !== id))
      else setError('That did not go through')
    } catch { setError('Network error') } finally { setBusy(false) }
  }

  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
        <span style={{ ...mono, fontSize: 8, letterSpacing: '0.24em', color: B.smoke }}>
          {pending.length} WAITING
        </span>
        <button onClick={load} style={{
          ...mono, fontSize: 8, letterSpacing: '0.16em', color: B.neonCyan,
          background: 'transparent', border: `1px solid ${B.gunmetal}`, borderRadius: 4, padding: '6px 12px', cursor: 'pointer',
        }}>REFRESH</button>
      </div>

      {error && <div style={{ ...mono, fontSize: 9, color: B.neonMagenta, marginBottom: 12 }}>{error}</div>}
      {pending.length === 0 && !error && (
        <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 14, color: B.smoke }}>Nothing waiting.</div>
      )}

      {pending.map(c => (
        <div key={c.submissionId} style={{ background: B.charcoal, border: `1px solid ${B.gunmetal}`, borderRadius: 8, padding: '16px 15px', marginBottom: 12 }}>
          <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 14, color: B.white, lineHeight: 1.6 }}>{c.confession}</div>
          <div style={{ ...mono, fontSize: 9, color: B.neonCyan, letterSpacing: '0.12em', margin: '10px 0 14px' }}>
            {String(c.displayName || '').toUpperCase()} - {String(c.city || '').toUpperCase()} - {c.submissionId}
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button disabled={busy} onClick={() => act(c.submissionId, 'approve')} style={{
              flex: 1, padding: '11px', border: 'none', borderRadius: 4, cursor: 'pointer',
              background: B.neonLime, color: B.black, ...mono, fontSize: 9, fontWeight: 700, letterSpacing: '0.18em',
            }}>APPROVE</button>
            <button disabled={busy} onClick={() => act(c.submissionId, 'reject')} style={{
              flex: 1, padding: '11px', borderRadius: 4, cursor: 'pointer', background: 'transparent',
              border: `1px solid ${B.neonMagenta}66`, color: B.neonMagenta, ...mono, fontSize: 9, fontWeight: 700, letterSpacing: '0.18em',
            }}>REJECT</button>
          </div>
        </div>
      ))}
    </>
  )
}

export default function DoorApp() {
  const [secret, setSecret] = useState(() => {
    try { return sessionStorage.getItem(SECRET_KEY) || '' } catch { return '' }
  })
  const [entry, setEntry] = useState('')
  const [tab, setTab] = useState('gate')

  // sessionStorage, not localStorage: the secret dies with the tab rather
  // than living on a borrowed phone.
  const saveSecret = v => {
    try { sessionStorage.setItem(SECRET_KEY, v) } catch {}
    setSecret(v)
  }
  const clearSecret = useCallback(() => {
    try { sessionStorage.removeItem(SECRET_KEY) } catch {}
    setSecret('')
  }, [])

  if (!secret) {
    return (
      <div style={{ minHeight: '100vh', background: B.black, color: B.white, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 22 }}>
        <form onSubmit={e => { e.preventDefault(); if (entry.trim()) saveSecret(entry.trim()) }} style={{ width: '100%', maxWidth: 360 }}>
          <div style={{ fontFamily: "'Orbitron', monospace", fontWeight: 900, fontSize: 20, color: B.amber, marginBottom: 6 }}>THE DOOR LIST</div>
          <div style={{ ...mono, fontSize: 8, color: B.smoke, letterSpacing: '0.22em', marginBottom: 22 }}>SNEAKERS FEST '26 - STAFF ONLY</div>
          <input aria-label="Door code"
            type="password" value={entry} onChange={e => setEntry(e.target.value)} placeholder="Door code"
            style={{ width: '100%', boxSizing: 'border-box', padding: '14px', background: B.charcoal, border: `1px solid ${B.gunmetal}`, borderRadius: 8, color: B.white, outline: 'none', ...mono, fontSize: 14 }} />
          <button type="submit" style={{ width: '100%', marginTop: 10, padding: '14px', border: 'none', borderRadius: 8, background: B.amber, color: B.black, cursor: 'pointer', ...mono, fontSize: 11, fontWeight: 700, letterSpacing: '0.2em' }}>UNLOCK</button>
          <div style={{ ...mono, fontSize: 9, color: B.smoke, letterSpacing: '0.14em', marginTop: 16, lineHeight: 1.8 }}>
            HELD FOR THIS TAB ONLY. CLOSING IT SIGNS YOU OUT.
          </div>
        </form>
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100vh', background: B.black, color: B.white, padding: '18px 16px 60px' }}>
      <div style={{ maxWidth: 520, margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
          <div>
            <div style={{ fontFamily: "'Orbitron', monospace", fontWeight: 900, fontSize: 16, color: B.amber }}>THE DOOR LIST</div>
            <div style={{ ...mono, fontSize: 6.5, color: B.smoke, letterSpacing: '0.24em' }}>MURI OKUNOLA PARK</div>
          </div>
          <button onClick={clearSecret} style={{ ...mono, fontSize: 8, letterSpacing: '0.14em', color: B.smoke, background: 'transparent', border: `1px solid ${B.gunmetal}`, borderRadius: 4, padding: '7px 11px', cursor: 'pointer' }}>LOCK</button>
        </div>

        <div style={{ display: 'flex', gap: 8, marginBottom: 18 }}>
          {[['gate', 'GATE'], ['mod', 'MODERATION']].map(([k, l]) => (
            <button key={k} onClick={() => setTab(k)} style={{
              flex: 1, padding: '10px', borderRadius: 6, cursor: 'pointer',
              background: tab === k ? B.amber : 'transparent',
              border: `1px solid ${tab === k ? B.amber : B.gunmetal}`,
              color: tab === k ? B.black : B.smoke,
              ...mono, fontSize: 9, fontWeight: 700, letterSpacing: '0.16em',
            }}>{l}</button>
          ))}
        </div>

        {tab === 'gate'
          ? <Gate secret={secret} onLoseAuth={clearSecret} />
          : <Moderation secret={secret} onLoseAuth={clearSecret} />}
      </div>
    </div>
  )
}
