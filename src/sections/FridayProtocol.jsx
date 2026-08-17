import { useState, useEffect, useCallback } from 'react'
import { B } from '../tokens'
import { GrainOverlay, SectionTag } from '../components/Shared'

const API = '/.netlify/functions/fnp'
const STORE_KEY = 'sf26_fnp'
const CREW_KEY = 'sf26_crew'

const readLS = k => { try { return JSON.parse(localStorage.getItem(k)) || null } catch { return null } }
const writeLS = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)) } catch {} }

const label = { fontFamily: "'Space Mono', monospace", fontSize: 9, letterSpacing: '0.22em', color: B.smoke }

/** Countdown to the next session, refreshed once a second. */
function useCountdown(targetIso) {
  const [left, setLeft] = useState(() => Math.max(0, new Date(targetIso) - Date.now()))
  useEffect(() => {
    if (!targetIso) return
    const tick = () => setLeft(Math.max(0, new Date(targetIso) - Date.now()))
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [targetIso])

  const s = Math.floor(left / 1000)
  return {
    days: Math.floor(s / 86400),
    hours: Math.floor((s % 86400) / 3600),
    minutes: Math.floor((s % 3600) / 60),
    seconds: s % 60,
  }
}

function Unit({ v, l }) {
  return (
    <div style={{ textAlign: 'center' }}>
      <div style={{
        minWidth: 58, padding: '12px 8px', background: B.black,
        border: `1px solid ${B.gunmetal}`, borderRadius: 6,
        fontFamily: "'Orbitron', monospace", fontWeight: 900, fontSize: 22, color: B.amber,
      }}>{String(v).padStart(2, '0')}</div>
      <div style={{ ...label, fontSize: 6.5, marginTop: 6 }}>{l}</div>
    </div>
  )
}

export default function FridayProtocol() {
  const [session, setSession] = useState(null)
  const [me,      setMe]      = useState(() => readLS(STORE_KEY) || { attended: [], streak: 0, name: '' })
  const [name,    setName]    = useState('')
  const [busy,    setBusy]    = useState(false)
  const [error,   setError]   = useState('')

  const t = useCountdown(session?.nextSessionAt)

  const load = useCallback(async () => {
    try {
      const r = await fetch(API)
      if (r.ok) setSession((await r.json()).session)
    } catch { /* the panel degrades to its stored state */ }
  }, [])

  useEffect(() => {
    load()
    setName(readLS(STORE_KEY)?.name || '')
    // While a session is live the count moves, so refresh it.
    const id = setInterval(load, 45000)
    return () => clearInterval(id)
  }, [load])

  const checkedInThisWeek = Boolean(
    session?.sessionId && me.attended?.includes(session.sessionId)
  )

  async function checkin(e) {
    e.preventDefault()
    setBusy(true); setError('')
    try {
      const crew = readLS(CREW_KEY)
      const r = await fetch(API, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'checkin',
          name: name.trim(),
          crewCode: crew?.code || undefined,
          attended: me.attended || [],
        }),
      })
      const d = await r.json().catch(() => ({}))
      if (!r.ok) { setError(d.error || 'Could not check in'); return }

      const next = { attended: d.attended, streak: d.streak, name: name.trim() }
      setMe(next); writeLS(STORE_KEY, next)
      setSession(d.session)
    } catch {
      setError('Network error. Check your connection.')
    } finally { setBusy(false) }
  }

  const live = session?.live
  const canCheckIn = session?.isFriday && !checkedInThisWeek

  return (
    <section id="fnp-checkin" style={{ position: 'relative', overflow: 'hidden', background: B.black, padding: '80px 24px' }}>
      <GrainOverlay />
      <div style={{ position: 'relative', zIndex: 10, maxWidth: 1100, margin: '0 auto' }}>
        <SectionTag>EVERY FRIDAY, ONLINE</SectionTag>

        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16, marginBottom: 40 }}>
          <div style={{ maxWidth: 520 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 9, marginBottom: 8 }}>
              <span style={{
                width: 8, height: 8, borderRadius: '50%',
                background: live ? B.neonLime : B.gunmetal,
                boxShadow: live ? `0 0 10px ${B.neonLime}` : 'none',
              }} />
              <span style={{ ...label, color: live ? B.neonLime : B.smoke, letterSpacing: '0.3em' }}>
                {live ? 'LIVE NOW' : session?.isFriday ? 'TODAY' : 'NEXT SESSION'}
              </span>
            </div>
            <h2 className="reveal-3d" style={{ fontFamily: "'Orbitron', monospace", fontWeight: 900, fontSize: 'clamp(22px, 4vw, 38px)', color: B.white, lineHeight: 1.1 }}>
              FRIDAY NIGHT<span style={{ color: B.amber }}> PROTOCOL</span>
            </h2>
            <p style={{ fontFamily: "'Syne', sans-serif", fontSize: 14, color: B.smoke, marginTop: 10, lineHeight: 1.7 }}>
              The community meets online every Friday from {session?.liveFromHour ?? 18}:00 WAT.
              Check in when you show up &mdash; miss a Friday and your run starts over.
            </p>
          </div>

          {me.streak > 0 && (
            <div className="card-3d" style={{
              padding: '16px 22px', background: B.charcoal,
              border: `1px solid ${B.amber}40`, borderRadius: 8, textAlign: 'center',
            }}>
              <div style={{ fontFamily: "'Orbitron', monospace", fontWeight: 900, fontSize: 30, color: B.amber, textShadow: `0 0 18px ${B.amber}40` }}>
                {me.streak}
              </div>
              <div style={{ ...label, marginTop: 4 }}>
                {me.streak === 1 ? 'FRIDAY' : 'FRIDAYS'} IN A ROW
              </div>
            </div>
          )}
        </div>

        <div className="reveal-3d" style={{ background: B.charcoal, border: `1px solid ${B.gunmetal}`, borderRadius: 8, padding: '26px 24px' }}>
          {/* Countdown when the room is not open */}
          {!live && session?.nextSessionAt && (
            <>
              <div style={{ ...label, color: B.neonCyan, marginBottom: 14 }}>DOORS OPEN IN</div>
              <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 24 }}>
                <Unit v={t.days} l="DAYS" />
                <Unit v={t.hours} l="HRS" />
                <Unit v={t.minutes} l="MIN" />
                <Unit v={t.seconds} l="SEC" />
              </div>
            </>
          )}

          {/* Attendance */}
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, flexWrap: 'wrap', marginBottom: 18 }}>
            <span style={{ fontFamily: "'Orbitron', monospace", fontWeight: 900, fontSize: 26, color: live ? B.neonLime : B.white }}>
              {session?.count ?? 0}
            </span>
            <span style={{ ...label }}>
              {session?.isFriday ? 'CHECKED IN TODAY' : 'CHECKED IN LAST SESSION'}
            </span>
          </div>

          {session?.recent?.length > 0 && (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7, marginBottom: 20 }}>
              {session.recent.map(r => (
                <span key={r.name} style={{
                  padding: '5px 11px', borderRadius: 3, background: B.black,
                  border: `1px solid ${B.gunmetal}`,
                  fontFamily: "'Space Mono', monospace", fontSize: 8, letterSpacing: '0.1em', color: B.mist,
                }}>{r.name}{r.crewCode ? ` · ${r.crewCode}` : ''}</span>
              ))}
            </div>
          )}

          {session?.topCrews?.length > 0 && (
            <div style={{ marginBottom: 20 }}>
              <div style={{ ...label, color: B.neonCyan, marginBottom: 10 }}>CREWS IN THE ROOM</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {session.topCrews.map((c, i) => (
                  <span key={c.code} style={{
                    padding: '5px 11px', borderRadius: 3, background: B.black,
                    border: `1px solid ${i === 0 ? B.amber + '55' : B.gunmetal}`,
                    fontFamily: "'Space Mono', monospace", fontSize: 8, letterSpacing: '0.1em',
                    color: i === 0 ? B.amber : B.smoke,
                  }}>{c.code} &times;{c.count}</span>
                ))}
              </div>
            </div>
          )}

          {/* Check-in */}
          {checkedInThisWeek ? (
            <div style={{ paddingTop: 18, borderTop: `1px solid ${B.gunmetal}`, ...label, color: B.neonLime }}>
              YOU ARE CHECKED IN THIS WEEK &mdash; SEE YOU IN THE ROOM
            </div>
          ) : canCheckIn ? (
            <form onSubmit={checkin} style={{ paddingTop: 18, borderTop: `1px solid ${B.gunmetal}`, display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
              <input
                value={name} onChange={e => setName(e.target.value)} maxLength={28} placeholder="Your name"
                style={{
                  flex: '1 1 180px', background: B.black, border: `1px solid ${B.gunmetal}`, borderRadius: 4,
                  padding: '10px 13px', color: B.white, outline: 'none',
                  fontFamily: "'Syne', sans-serif", fontSize: 14,
                }} />
              <button type="submit" disabled={busy || name.trim().length < 2} style={{
                padding: '12px 28px', border: 'none', borderRadius: 3,
                background: name.trim().length >= 2 ? B.amber : B.gunmetal,
                color: name.trim().length >= 2 ? B.black : B.smoke,
                cursor: busy ? 'default' : 'pointer', opacity: busy ? 0.6 : 1,
                fontFamily: "'Space Mono', monospace", fontSize: 9, fontWeight: 700, letterSpacing: '0.2em',
              }}>{busy ? 'CHECKING IN...' : 'CHECK IN'}</button>
              {error && (
                <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 8, letterSpacing: '0.14em', color: B.neonMagenta }}>{error}</span>
              )}
            </form>
          ) : (
            <div style={{ paddingTop: 18, borderTop: `1px solid ${B.gunmetal}`, ...label }}>
              CHECK-IN OPENS ON FRIDAY
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
