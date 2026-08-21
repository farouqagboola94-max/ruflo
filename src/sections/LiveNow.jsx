import { useState, useEffect, useMemo } from 'react'
import { B } from '../tokens'
import { GrainOverlay, ScanLines, SectionTag } from '../components/Shared'
import { liveState, untilLabel, DAYS } from '../lib/liveSchedule'

// What is on right now.
//
// The site knew the whole running order months ahead and nothing at all on the
// day itself, which is the one day it matters. Standing in the park you do not
// want a timetable, you want two facts: what is on, and what is next.
//
// Runs entirely off static data and the device clock, so it works with no
// signal - which is the state of most phones in a park holding thousands of
// people on one cell tower.

const MONO = "'Space Mono', monospace"
const PICKS_KEY = 'sf26_my_day'
const slotId = s => `${s.time}${s.period}`

function readPicks() {
  try {
    const v = JSON.parse(localStorage.getItem(PICKS_KEY) || '[]')
    return Array.isArray(v) ? v : []
  } catch { return [] }
}

function Slot({ item, kind, accent, mine, until, progress }) {
  return (
    <div style={{
      background: 'rgba(255,255,255,0.02)',
      border: `1px solid ${accent}${kind === 'now' ? '55' : '22'}`,
      borderRadius: 12, padding: '18px 20px', position: 'relative', overflow: 'hidden',
    }}>
      {progress != null && (
        <div aria-hidden="true" style={{
          position: 'absolute', left: 0, bottom: 0, height: 2,
          width: `${Math.round(progress * 100)}%`, background: accent, opacity: 0.6,
        }} />
      )}
      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 10, flexWrap: 'wrap' }}>
        <span style={{ fontFamily: MONO, fontSize: 9, letterSpacing: 3, color: accent }}>
          {kind === 'now' ? 'ON NOW' : 'NEXT'}
        </span>
        <span style={{ fontFamily: MONO, fontSize: 9, color: B.smoke }}>
          {item.time}{item.period.toLowerCase()}{until ? ` · ${until}` : ''}
        </span>
      </div>

      <div style={{
        fontFamily: "'Bebas Neue'", fontSize: kind === 'now' ? 'clamp(1.5rem,5vw,2.3rem)' : '1.25rem',
        letterSpacing: '0.04em', color: B.white, lineHeight: 1.15, marginTop: 8,
      }}>{item.title}</div>

      {item.stage && (
        <div style={{ fontFamily: MONO, fontSize: 9, color: B.dim, letterSpacing: 1.5, marginTop: 6 }}>
          {item.stage}
        </div>
      )}

      {kind === 'now' && item.desc && (
        <p style={{ fontFamily: "'Syne'", fontSize: '0.85rem', color: B.smoke, lineHeight: 1.7, marginTop: 10, marginBottom: 0 }}>
          {item.desc}
        </p>
      )}

      {mine && (
        <div style={{ fontFamily: MONO, fontSize: 9, color: B.amber, letterSpacing: 2, marginTop: 12 }}>
          ★ ONE OF YOURS
        </div>
      )}
    </div>
  )
}

export default function LiveNow() {
  // A clock in state rather than read at render, so the card moves on its own
  // while the phone sits in someone's hand.
  const [now, setNow] = useState(() => Date.now())
  const [picks, setPicks] = useState(readPicks)

  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 30_000)
    const onFocus = () => { setNow(Date.now()); setPicks(readPicks()) }
    window.addEventListener('focus', onFocus)
    return () => { clearInterval(t); window.removeEventListener('focus', onFocus) }
  }, [])

  const s = useMemo(() => liveState(now), [now])
  const accent = s.current?.color || s.next?.color || B.amber
  const until = untilLabel(s.msToNext)
  const isMine = item => item && picks.includes(slotId(item))

  return (
    <section id="live-now" style={{
      background: `linear-gradient(180deg, ${B.black} 0%, ${B.void} 100%)`,
      padding: '80px 20px', position: 'relative', overflow: 'hidden',
    }}>
      <GrainOverlay /><ScanLines />

      <div style={{ maxWidth: 700, margin: '0 auto', position: 'relative', zIndex: 2 }}>
        <SectionTag>{s.state === 'live' ? 'HAPPENING NOW' : 'THE RUNNING ORDER'}</SectionTag>

        <h2 className="reveal-3d text-3d" style={{
          fontFamily: "'Bebas Neue'", fontSize: 'clamp(2.2rem,6vw,4rem)',
          color: B.white, letterSpacing: '0.05em', margin: '10px 0 8px',
        }}>{s.state === 'live' ? 'WHAT IS ON' : 'HOW THE DAY RUNS'}</h2>

        <p style={{ fontFamily: "'Syne'", fontSize: '0.88rem', color: B.smoke, lineHeight: 1.7, marginBottom: 24 }}>
          {s.state === 'live' && `${s.day.label} — ${s.day.venue}.`}
          {s.state === 'before' && `${s.day.label} at ${s.day.venue}. ${until ? `Doors ${until}.` : ''}`}
          {s.state === 'between' && 'Finals night is done. The main event is tomorrow at Muri Okunola Park.'}
          {s.state === 'after' && 'That was it. Both days are done. See you next year.'}
        </p>

        {(s.current || s.next?.time) ? (
          <div style={{ display: 'grid', gap: 12 }}>
            {s.current && (
              <Slot item={s.current} kind="now" accent={accent} mine={isMine(s.current)} progress={s.progress} />
            )}
            {s.next?.time && (
              <Slot item={s.next} kind="next" accent={s.next.color || accent} mine={isMine(s.next)} until={until} />
            )}
          </div>
        ) : (
          // Nothing is running, so show the shape of each day instead of an
          // empty panel pretending to be live.
          <div style={{ display: 'grid', gap: 10 }}>
            {DAYS.map(d => (
              <div key={d.date} style={{
                background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.07)',
                borderRadius: 10, padding: '15px 18px',
              }}>
                <div style={{ fontFamily: MONO, fontSize: 9, letterSpacing: 3, color: B.amber }}>{d.label}</div>
                <div style={{ fontFamily: MONO, fontSize: 10, color: B.smoke, marginTop: 8, lineHeight: 1.9 }}>
                  {d.items[0].time}{d.items[0].period.toLowerCase()} {d.items[0].title}
                  <br />
                  {d.items[d.items.length - 1].time}{d.items[d.items.length - 1].period.toLowerCase()}{' '}
                  {d.items[d.items.length - 1].title}
                </div>
              </div>
            ))}
          </div>
        )}

        <p style={{ fontFamily: MONO, fontSize: 9, color: B.dim, marginTop: 18, lineHeight: 1.8 }}>
          LAGOS TIME, FROM YOUR PHONE'S CLOCK. WORKS WITH NO SIGNAL.
          {picks.length > 0 && ` ${picks.length} PICKED IN BUILD YOUR DAY.`}
        </p>
      </div>
    </section>
  )
}
