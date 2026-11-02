import { useState, useEffect, useCallback } from 'react'
import { B } from '../tokens'
import { GrainOverlay, SectionTag } from '../components/Shared'
import { SOCIAL_LINKS, buildWhatsAppLink } from '../config'
import { dispatchFestivalAction, FESTIVAL_ACTIONS, playFestivalSound } from '../framework/festivalFramework'

const API = '/.netlify/functions/fnp'
const STORE_KEY = 'sf26_fnp'
const CREW_KEY = 'sf26_crew'

const SIX_FRIDAYS_CURRICULUM = [
  { week: 'WEEK 01', date: 'FRI, NOV 6 · 20:00 WAT',  title: 'GRAIL CELL REVEAL & CULTURE TRIVIA', perk: 'Early-Bird VIP Flash Drop', accent: B.amber },
  { week: 'WEEK 02', date: 'FRI, NOV 13 · 20:00 WAT', title: '4-WAY DJ SOUNDCLASH FACTION DRAFT', perk: '+50 XP Soundclash Badge', accent: B.neonCyan },
  { week: 'WEEK 03', date: 'FRI, NOV 20 · 20:00 WAT', title: 'MAINLAND VS ISLAND FIT-CHECK SEEDING', perk: '32-Seed Bracket Priority', accent: B.neonMagenta },
  { week: 'WEEK 04', date: 'FRI, NOV 27 · 20:00 WAT', title: 'PAYDAY CREW SPLIT BLITZ (4-PACKS)', perk: '20% Off Squad & Phalanx Tables', accent: B.neonLime },
  { week: 'WEEK 05', date: 'FRI, DEC 4 · 20:00 WAT',  title: 'LSX CELL BLOCK AUCTION PREVIEW', perk: 'First Look at ₦10,000 Reserve Grails', accent: B.amber },
  { week: 'WEEK 06', date: 'FRI, DEC 11 · 20:00 WAT', title: 'EVE OF FREEDOM FINAL ROLL CALL', perk: 'Hospital Rd Gate Fast-Track Briefing', accent: B.neonCyan },
]

function getNextFridayIso() {
  const now = new Date()
  const day = now.getDay() // 5 = Friday
  const daysUntilFri = (5 - day + 7) % 7
  const target = new Date(now)
  target.setDate(now.getDate() + (daysUntilFri === 0 && now.getHours() >= 22 ? 7 : daysUntilFri))
  target.setHours(20, 0, 0, 0)
  return target.toISOString()
}

function getCurrentWeekSessionId() {
  const d = new Date()
  return `FNP-${d.getFullYear()}-W${Math.ceil((d.getDate() + 6 - d.getDay()) / 7)}-${d.getMonth() + 1}`
}

function generateFlashCode() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  let s = ''
  for (let i = 0; i < 4; i++) s += chars[Math.floor(Math.random() * chars.length)]
  return `FNP26-${s}`
}

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
  const [me,      setMe]      = useState(() => readLS(STORE_KEY) || { attended: [], streak: 0, name: '', flashCode: '' })
  const [name,    setName]    = useState('')
  const [busy,    setBusy]    = useState(false)
  const [error,   setError]   = useState('')

  const fallbackIso = getNextFridayIso()
  const t = useCountdown(session?.nextSessionAt || fallbackIso)

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

  const activeSessionId = session?.sessionId || getCurrentWeekSessionId()
  const checkedInThisWeek = Boolean(
    activeSessionId && me.attended?.includes(activeSessionId)
  )

  async function checkin(e) {
    e.preventDefault()
    if (name.trim().length < 2) return
    setBusy(true); setError('')
    const crew = readLS(CREW_KEY)
    const flashCode = me.flashCode || generateFlashCode()

    try {
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
      if (r.ok && d.attended) {
        const next = { attended: d.attended, streak: d.streak || (me.streak || 0) + 1, name: name.trim(), flashCode }
        setMe(next); writeLS(STORE_KEY, next)
        if (d.session) setSession(d.session)
        dispatchFestivalAction(FESTIVAL_ACTIONS.ADD_XP, { amount: 50 })
        playFestivalSound('badge_unlock')
        setBusy(false)
        return
      }
    } catch {
      // Seamless local check-in / RSVP fallback
    }

    const updatedAttended = Array.from(new Set([...(me.attended || []), activeSessionId]))
    const next = {
      attended: updatedAttended,
      streak: (me.streak || 0) + 1,
      name: name.trim(),
      flashCode,
    }
    setMe(next); writeLS(STORE_KEY, next)
    dispatchFestivalAction(FESTIVAL_ACTIONS.ADD_XP, { amount: 50 })
    playFestivalSound('badge_unlock')
    setBusy(false)
  }

  const live = session?.live
  const isFridayToday = session?.isFriday ?? (new Date().getDay() === 5)
  const displayCount = (session?.count ?? 48) + (checkedInThisWeek ? 1 : 0)

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
          {!live && (
            <>
              <div style={{ ...label, color: B.neonCyan, marginBottom: 14 }}>NEXT FRIDAY PROTOCOL DOORS OPEN IN</div>
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
              {displayCount}
            </span>
            <span style={{ ...label }}>
              {isFridayToday ? 'CHECKED IN TODAY' : 'LOCKED IN FOR NEXT FRIDAY ROLL CALL'}
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

          {/* Check-in & RSVP */}
          {checkedInThisWeek ? (
            <div style={{ paddingTop: 18, borderTop: `1px solid ${B.gunmetal}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
              <div>
                <div style={{ ...label, color: B.neonLime, marginBottom: 4 }}>
                  ✓ YOU ARE LOCKED IN THIS WEEK (+50 XP) &mdash; FLASH CODE: <span style={{ color: B.amber }}>{me.flashCode || 'FNP26-VIP'}</span>
                </div>
                <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 12, color: B.smoke }}>
                  Use your Friday Flash Code to unlock the Weekend Crew Split Bundle or VIP Table perks on WhatsApp.
                </div>
              </div>
              <a
                href={buildWhatsAppLink(
                  SOCIAL_LINKS.whatsappDirect1,
                  `Hello SF26 VIP Desk! I checked in to Friday Night Protocol as [${me.name || name}] with Flash Code [${me.flashCode || 'FNP26-VIP'}]. I want to claim the Friday Weekend Crew Bundle / VIP perk for Freedom Park (Dec 12)!`
                )}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  padding: '11px 18px', borderRadius: 4, textDecoration: 'none',
                  background: B.neonLime, color: B.black,
                  fontFamily: "'Orbitron', monospace", fontSize: 9.5, fontWeight: 700, letterSpacing: '0.14em',
                }}
              >
                📲 CLAIM FRIDAY FLASH BUNDLE ON WHATSAPP →
              </a>
            </div>
          ) : (
            <form onSubmit={checkin} style={{ paddingTop: 18, borderTop: `1px solid ${B.gunmetal}`, display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
              <input aria-label="Your name"
                value={name} onChange={e => setName(e.target.value)} maxLength={28} placeholder="Your name or handle (e.g. @tunde_kicks)"
                style={{
                  flex: '1 1 200px', background: B.black, border: `1px solid ${B.gunmetal}`, borderRadius: 4,
                  padding: '11px 14px', color: B.white, outline: 'none',
                  fontFamily: "'Syne', sans-serif", fontSize: 14,
                }} />
              <button type="submit" disabled={busy || name.trim().length < 2} style={{
                padding: '12px 26px', border: 'none', borderRadius: 4,
                background: name.trim().length >= 2 ? B.amber : B.gunmetal,
                color: name.trim().length >= 2 ? B.black : B.smoke,
                cursor: busy ? 'default' : 'pointer', opacity: busy ? 0.6 : 1,
                fontFamily: "'Space Mono', monospace", fontSize: 9, fontWeight: 700, letterSpacing: '0.18em',
              }}>
                {busy ? 'LOCKING IN...' : isFridayToday ? '⚡ CHECK IN NOW (+50 XP)' : '⚡ LOCK FRIDAY RSVP & FLASH CODE (+50 XP)'}
              </button>
              {error && (
                <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 8, letterSpacing: '0.14em', color: B.neonMagenta }}>{error}</span>
              )}
            </form>
          )}
        </div>

        {/* 6-Friday Countdown Curriculum to Dec 12 */}
        <div style={{ marginTop: 28 }}>
          <div style={{ ...label, color: B.amber, marginBottom: 12 }}>
            THE FINAL 6 FRIDAYS TO FREEDOM PARK (NOV 6 – DEC 11, 2026)
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 12 }}>
            {SIX_FRIDAYS_CURRICULUM.map(item => (
              <div key={item.week} className="card-3d" style={{
                padding: '16px 18px', background: '#0A0A10',
                border: `1px solid ${item.accent}35`, borderRadius: 8,
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                  <span style={{ fontFamily: "'Orbitron', monospace", fontSize: 9, fontWeight: 800, color: item.accent, letterSpacing: 1.5 }}>{item.week}</span>
                  <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 7.5, color: B.smoke }}>{item.date}</span>
                </div>
                <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 19, color: B.white, letterSpacing: 1.5, marginBottom: 4 }}>
                  {item.title}
                </div>
                <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 8, color: B.neonLime }}>
                  🎁 PERK: {item.perk}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
