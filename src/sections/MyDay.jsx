import { useState, useEffect, useMemo } from 'react'
import { B } from '../tokens'
import { GrainOverlay, ScanLines, SectionTag } from '../components/Shared'
import Egg from '../components/Egg'
import { DAY2 } from '../data/schedule'
import { toMinutes, downloadICS } from '../lib/ics'

// Ten hours, sixteen things happening, and no way to say which ones you are
// actually there for. Pick your day, then put it in your phone - a calendar
// entry with an alarm is the difference between meaning to come and coming.

const KEY = 'sf26_my_day'
const MONO = "'Space Mono', monospace"

function loadPicks() {
  try {
    const v = JSON.parse(localStorage.getItem(KEY) || '[]')
    return Array.isArray(v) ? v : []
  } catch { return [] }
}

const slotId = s => `${s.time}${s.period}`

export default function MyDay() {
  const [picks, setPicks] = useState(loadPicks)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    try { localStorage.setItem(KEY, JSON.stringify(picks)) } catch {}
  }, [picks])

  function toggle(s) {
    const id = slotId(s)
    setPicks(p => p.includes(id) ? p.filter(x => x !== id) : [...p, id])
    setSaved(false)
  }

  const chosen = useMemo(
    () => DAY2.filter(s => picks.includes(slotId(s)))
              .sort((a, b) => toMinutes(a.time, a.period) - toMinutes(b.time, b.period)),
    [picks],
  )

  // How long you are actually on site, from the first thing you picked to the
  // last. Useful for deciding when to leave the house.
  const window_ = useMemo(() => {
    if (chosen.length < 1) return null
    const first = chosen[0]
    const last = chosen[chosen.length - 1]
    return `${first.time}${first.period.toLowerCase()} to ${last.time}${last.period.toLowerCase()}`
  }, [chosen])

  function addToCalendar() {
    if (!chosen.length) return
    downloadICS(chosen)
    setSaved(true)
  }

  return (
    <section id="my-day" style={{
      background: `linear-gradient(180deg, ${B.void} 0%, ${B.black} 100%)`,
      padding: '80px 20px', position: 'relative', overflow: 'hidden',
    }}>
      <GrainOverlay /><ScanLines />
      <Egg id="egg-091" corner="top-right" />

      <div style={{ maxWidth: 700, margin: '0 auto', position: 'relative', zIndex: 2 }}>
        <SectionTag>BUILD YOUR DAY</SectionTag>

        <h2 className="reveal-3d text-3d" style={{
          fontFamily: "'Bebas Neue'", fontSize: 'clamp(2.2rem,6vw,4rem)',
          color: B.white, letterSpacing: '0.05em', margin: '10px 0 8px',
        }}>WHAT ARE YOU HERE FOR</h2>

        <p style={{ fontFamily: "'Syne'", fontSize: '0.88rem', color: B.smoke, lineHeight: 1.7, marginBottom: 8 }}>
          Ten hours, sixteen things happening. Tap what you are not missing, then
          put it in your phone.
        </p>
        <p style={{ fontFamily: MONO, fontSize: 9, color: B.dim, letterSpacing: 1, marginBottom: 24 }}>
          SAVED ON THIS DEVICE. NO SIGN-UP.
        </p>

        {/* The running order */}
        <div style={{ marginBottom: 24 }}>
          {DAY2.map(s => {
            const on = picks.includes(slotId(s))
            const color = s.color || B.smoke
            return (
              <button
                key={slotId(s)}
                onClick={() => toggle(s)}
                style={{
                  display: 'flex', alignItems: 'flex-start', gap: 14, width: '100%',
                  textAlign: 'left', cursor: 'pointer', padding: '13px 15px',
                  marginBottom: 6, borderRadius: 9,
                  background: on ? `${color}12` : 'rgba(255,255,255,0.02)',
                  border: `1px solid ${on ? `${color}55` : 'rgba(255,255,255,0.06)'}`,
                  transition: 'background 0.15s, border-color 0.15s',
                }}
              >
                <span style={{
                  flexShrink: 0, width: 18, height: 18, marginTop: 2, borderRadius: 4,
                  border: `1px solid ${on ? color : B.dim}`,
                  background: on ? color : 'transparent',
                  color: B.black, fontSize: 12, fontWeight: 900, lineHeight: '17px', textAlign: 'center',
                }}>{on ? '✓' : ''}</span>

                <span style={{ flexShrink: 0, width: 62, fontFamily: MONO, fontSize: 10, color: on ? color : B.smoke }}>
                  {s.time}{s.period.toLowerCase()}
                </span>

                <span style={{ flex: 1, minWidth: 0 }}>
                  <span style={{
                    display: 'block', fontFamily: "'Bebas Neue'", fontSize: '1.05rem',
                    letterSpacing: '0.04em', color: on ? B.white : B.mist, lineHeight: 1.25,
                  }}>{s.title}</span>
                  {s.stage && (
                    <span style={{ display: 'block', fontFamily: MONO, fontSize: 8, color: B.dim, letterSpacing: 1.5, marginTop: 3 }}>
                      {s.stage}
                    </span>
                  )}
                </span>
              </button>
            )
          })}
        </div>

        {/* Your day */}
        <div className="card-3d" style={{
          background: 'rgba(255,255,255,0.02)',
          border: `1px solid ${chosen.length ? `${B.amber}40` : 'rgba(255,255,255,0.07)'}`,
          borderRadius: 12, padding: '20px 22px',
        }}>
          {chosen.length === 0 ? (
            <p style={{ fontFamily: MONO, fontSize: 11, color: B.dim, lineHeight: 1.7, margin: 0 }}>
              Nothing picked yet. Tap anything above and it lands here.
            </p>
          ) : (
            <>
              <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap', marginBottom: 14 }}>
                <div style={{ fontFamily: MONO, fontSize: 8, color: B.amber, letterSpacing: 3 }}>
                  YOUR DAY — {chosen.length} {chosen.length === 1 ? 'THING' : 'THINGS'}
                </div>
                <div style={{ fontFamily: MONO, fontSize: 9, color: B.smoke }}>{window_}</div>
              </div>

              <button
                onClick={addToCalendar}
                style={{
                  width: '100%', padding: 13, marginBottom: 10, cursor: 'pointer',
                  background: B.amber, color: B.black, border: 'none', borderRadius: 8,
                  fontFamily: MONO, fontSize: 11, fontWeight: 700, letterSpacing: 2,
                }}
              >ADD TO MY CALENDAR</button>

              <p style={{ fontFamily: MONO, fontSize: 8, color: B.dim, lineHeight: 1.8, margin: 0 }}>
                {saved
                  ? 'DOWNLOADED. OPEN THE FILE AND YOUR CALENDAR WILL TAKE IT.'
                  : 'DOWNLOADS A CALENDAR FILE. EACH PICK GETS A 30-MINUTE REMINDER.'}
              </p>
            </>
          )}
        </div>

        <p style={{ fontFamily: MONO, fontSize: 8, color: B.dim, marginTop: 18, lineHeight: 1.8 }}>
          Times are Lagos time on December 12. Some acts are still classified —
          they will fill in on this page as they are announced, and your picks
          keep their place.
        </p>
      </div>
    </section>
  )
}
