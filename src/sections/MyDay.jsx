import { useState, useEffect, useMemo } from 'react'
import { B } from '../tokens'
import { GrainOverlay, ScanLines, SectionTag } from '../components/Shared'
import Egg from '../components/Egg'
import { DAY2 } from '../data/schedule'
import { toMinutes, downloadICS } from '../lib/ics'
import { safeStorage } from '../lib/safeStorage.js'
import {
  useFestivalGamification,
  dispatchFestivalAction,
  playFestivalSound
} from '../framework/festivalFramework'

const KEY = 'sf26_my_day'
const MONO = "'Space Mono', monospace"

const STAGE_ZONE_MAP = {
  'MAIN STAGE': 'zone-a',
  'VIP DECK': 'zone-a',
  'ARENA': 'zone-b',
  '1V1 ARENA': 'zone-b',
  'GRAIL ALLEY': 'zone-c',
  'MARKET': 'zone-c',
  'LSX PIT': 'zone-c',
  'YOUTH LOUNGE': 'zone-d',
  'FOOD COURT': 'zone-d',
  'MAIN GATES': 'gate-1',
}

const slotId = s => `${s.time}${s.period}-${s.title}`

export default function MyDay() {
  const { awardXP, unlockBadge } = useFestivalGamification()
  const [picks, setPicks] = useState(() => safeStorage.getJSON(KEY, []))
  const [saved, setSaved] = useState(false)
  const [xpAwarded, setXpAwarded] = useState(false)

  useEffect(() => {
    safeStorage.setItem(KEY, picks)
  }, [picks])

  function toggle(s) {
    playFestivalSound('tap')
    const id = slotId(s)
    setPicks(prev => {
      const next = prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
      
      // Award XP when attendee picks 3 or more items
      if (next.length >= 3 && !xpAwarded) {
        awardXP(75)
        unlockBadge('MASTER_STRATEGIST')
        playFestivalSound('badge_unlock')
        setXpAwarded(true)
      }
      return next
    })
    setSaved(false)
  }

  const chosen = useMemo(
    () => DAY2.filter(s => picks.includes(slotId(s)))
              .sort((a, b) => toMinutes(a.time, a.period) - toMinutes(b.time, b.period)),
    [picks],
  )

  // Clash Detection Engine: Check if two chosen events occur at the exact same time
  const clashes = useMemo(() => {
    const conflicts = []
    for (let i = 0; i < chosen.length; i++) {
      for (let j = i + 1; j < chosen.length; j++) {
        const itemA = chosen[i]
        const itemB = chosen[j]
        const timeA = toMinutes(itemA.time, itemA.period)
        const timeB = toMinutes(itemB.time, itemB.period)

        // Events starting at the same time or within 30 mins on different stages
        if (Math.abs(timeA - timeB) < 30) {
          conflicts.push({
            idA: slotId(itemA),
            idB: slotId(itemB),
            titleA: itemA.title,
            titleB: itemB.title,
            time: `${itemA.time}${itemA.period.toLowerCase()}`,
            stageA: itemA.stage || 'Stage A',
            stageB: itemB.stage || 'Stage B',
          })
        }
      }
    }
    return conflicts
  }, [chosen])

  // How long attendee is actually on site
  const window_ = useMemo(() => {
    if (chosen.length < 1) return null
    const first = chosen[0]
    const last = chosen[chosen.length - 1]
    return `${first.time}${first.period.toLowerCase()} to ${last.time}${last.period.toLowerCase()}`
  }, [chosen])

  function addToCalendar() {
    if (!chosen.length) return
    playFestivalSound('xp_gain')
    downloadICS(chosen)
    setSaved(true)
  }

  function shareToWhatsApp() {
    if (!chosen.length) return
    playFestivalSound('tap')
    
    let text = `👟 *MY SNEAKERS FEST '26 ITINERARY* 🇳🇬\n`
    text += `📍 *Muri Okunola Park, Victoria Island*\n`
    text += `🗓️ *Saturday, Dec 12, 2026* | ${window_ || 'Full Day'}\n\n`
    
    chosen.forEach(item => {
      text += `⏱️ *${item.time}${item.period.toLowerCase()}* — ${item.title}`
      if (item.stage) text += ` (${item.stage})`
      text += `\n`
    })

    text += `\n🔥 Catch me on the festival floor! Plan your day at: https://sneakers-fest-55.netlify.app#my-day`

    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank')
  }

  function focusVenueZone(stage) {
    playFestivalSound('tap')
    const upper = (stage || '').toUpperCase()
    const matchedZone = Object.keys(STAGE_ZONE_MAP).find(k => upper.includes(k))
    const zoneId = matchedZone ? STAGE_ZONE_MAP[matchedZone] : 'zone-a'

    dispatchFestivalAction('TELEMETRY_ZONE_FOCUS', zoneId)
    const venueEl = document.getElementById('venue')
    if (venueEl) venueEl.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section id="my-day" style={{
      background: `linear-gradient(180deg, ${B.void} 0%, ${B.black} 100%)`,
      padding: '80px 20px', position: 'relative', overflow: 'hidden',
    }}>
      <GrainOverlay /><ScanLines />
      <Egg id="egg-091" corner="top-right" />

      <div style={{ maxWidth: 740, margin: '0 auto', position: 'relative', zIndex: 2 }}>
        <SectionTag>INTERACTIVE FESTIVAL ITINERARY</SectionTag>

        <h2 className="reveal-3d text-3d" style={{
          fontFamily: "'Bebas Neue'", fontSize: 'clamp(2.2rem,6vw,4rem)',
          color: B.white, letterSpacing: '0.05em', margin: '10px 0 8px',
        }}>BUILD YOUR DAY & CLASH DETECTOR</h2>

        <p style={{ fontFamily: "'Syne'", fontSize: '0.88rem', color: B.smoke, lineHeight: 1.7, marginBottom: 8 }}>
          Ten hours, sixteen acts and activations. Tap your must-see moments — our clash detector flags simultaneous timetable collisions so you can coordinate with your crew.
        </p>
        <p style={{ fontFamily: MONO, fontSize: 9, color: B.dim, letterSpacing: 1, marginBottom: 24 }}>
          SAVED LOCALLY · CLASH DETECTION · 1-TAP WHATSAPP EXPORT · .ICS CALENDAR WITH ALARMS
        </p>

        {/* TIMETABLE RUNNING ORDER */}
        <div style={{ marginBottom: 24 }}>
          {DAY2.map(s => {
            const sid = slotId(s)
            const on = picks.includes(sid)
            const color = s.color || B.smoke
            const hasClash = clashes.some(c => c.idA === sid || c.idB === sid)

            return (
              <div
                key={sid}
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  padding: '12px 14px', marginBottom: 6, borderRadius: 8,
                  background: on ? `${color}14` : 'rgba(255,255,255,0.02)',
                  border: `1px solid ${hasClash ? '#ef4444' : on ? `${color}55` : 'rgba(255,255,255,0.06)'}`,
                  transition: 'all 0.15s',
                  gap: 12
                }}
              >
                <button
                  type="button"
                  onClick={() => toggle(s)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 12, flex: 1,
                    background: 'transparent', border: 'none', cursor: 'pointer',
                    textAlign: 'left', padding: 0
                  }}
                >
                  <span style={{
                    flexShrink: 0, width: 20, height: 20, borderRadius: 4,
                    border: `1px solid ${on ? color : B.dim}`,
                    background: on ? color : 'transparent',
                    color: B.black, fontSize: 13, fontWeight: 900, lineHeight: '18px', textAlign: 'center',
                  }}>{on ? '✓' : ''}</span>

                  <span style={{ flexShrink: 0, width: 68, fontFamily: MONO, fontSize: 10, color: on ? color : B.smoke }}>
                    {s.time}{s.period.toLowerCase()}
                  </span>

                  <span style={{ flex: 1, minWidth: 0 }}>
                    <span style={{
                      display: 'block', fontFamily: "'Bebas Neue'", fontSize: '1.1rem',
                      letterSpacing: '0.04em', color: on ? B.white : B.mist, lineHeight: 1.25,
                    }}>
                      {s.title}
                    </span>
                    {s.stage && (
                      <span style={{ display: 'inline-block', fontFamily: MONO, fontSize: 8, color: B.dim, letterSpacing: 1.2, marginTop: 2 }}>
                        {s.stage}
                      </span>
                    )}
                  </span>
                </button>

                {/* Micro Action: Zone Focus or Clash Indicator */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>
                  {hasClash && (
                    <span style={{
                      fontFamily: MONO, fontSize: 8, color: '#ef4444',
                      background: 'rgba(239,68,68,0.15)', border: '1px solid #ef444455',
                      padding: '3px 6px', borderRadius: 4, fontWeight: 700
                    }}>
                      ⚠️ CLASH
                    </span>
                  )}
                  {s.stage && (
                    <button
                      type="button"
                      onClick={() => focusVenueZone(s.stage)}
                      title={`Jump to ${s.stage} on Venue Map`}
                      style={{
                        background: 'rgba(255,255,255,0.05)',
                        border: '1px solid rgba(255,255,255,0.12)',
                        borderRadius: 4,
                        color: B.mist,
                        fontFamily: MONO,
                        fontSize: 8,
                        padding: '4px 8px',
                        cursor: 'pointer'
                      }}
                    >
                      MAP ↗
                    </button>
                  )}
                </div>
              </div>
            )
          })}
        </div>

        {/* YOUR DAY PLANNER SUMMARY CARD */}
        <div className="card-3d" style={{
          background: 'rgba(255,255,255,0.02)',
          border: `1px solid ${chosen.length ? `${B.amber}40` : 'rgba(255,255,255,0.07)'}`,
          borderRadius: 12, padding: '22px 24px',
        }}>
          {chosen.length === 0 ? (
            <p style={{ fontFamily: MONO, fontSize: 11, color: B.dim, lineHeight: 1.7, margin: 0 }}>
              Nothing picked yet. Tap any event above to calculate your day, detect timetable clashes, and export to WhatsApp.
            </p>
          ) : (
            <>
              <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap', marginBottom: 14 }}>
                <div style={{ fontFamily: MONO, fontSize: 9, color: B.amber, letterSpacing: 3, fontWeight: 700 }}>
                  YOUR ITINERARY — {chosen.length} {chosen.length === 1 ? 'EVENT' : 'EVENTS'} SELECTED
                </div>
                <div style={{ fontFamily: MONO, fontSize: 10, color: B.smoke }}>{window_}</div>
              </div>

              {/* CLASH WARNING BANNER */}
              {clashes.length > 0 && (
                <div style={{
                  background: 'rgba(239,68,68,0.12)',
                  border: '1px solid #ef4444',
                  borderRadius: 8,
                  padding: '12px 16px',
                  marginBottom: 16
                }}>
                  <div style={{ fontFamily: MONO, fontSize: 9, color: '#ef4444', fontWeight: 700, letterSpacing: '0.1em', marginBottom: 4 }}>
                    ⚠️ {clashes.length} TIMETABLE CLASH{clashes.length !== 1 ? 'ES' : ''} DETECTED:
                  </div>
                  {clashes.map((c, i) => (
                    <div key={i} style={{ fontFamily: MONO, fontSize: 8, color: B.mist, lineHeight: 1.6 }}>
                      • At <strong style={{ color: B.white }}>{c.time}</strong>: "{c.titleA}" ({c.stageA}) clashes with "{c.titleB}" ({c.stageB}).
                    </div>
                  ))}
                </div>
              )}

              {/* ACTION BUTTONS: CALENDAR + WHATSAPP */}
              <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 12 }}>
                <button
                  type="button"
                  onClick={addToCalendar}
                  style={{
                    flex: '1 1 200px', padding: '14px', cursor: 'pointer',
                    background: B.amber, color: B.black, border: 'none', borderRadius: 8,
                    fontFamily: MONO, fontSize: 10, fontWeight: 700, letterSpacing: 1.5,
                  }}
                >
                  📥 ADD TO MY CALENDAR (.ICS)
                </button>

                <button
                  type="button"
                  onClick={shareToWhatsApp}
                  style={{
                    flex: '1 1 200px', padding: '14px', cursor: 'pointer',
                    background: '#25D366', color: '#fff', border: 'none', borderRadius: 8,
                    fontFamily: MONO, fontSize: 10, fontWeight: 700, letterSpacing: 1.5,
                  }}
                >
                  📲 SHARE SCHEDULE TO WHATSAPP
                </button>
              </div>

              <p style={{ fontFamily: MONO, fontSize: 8, color: B.dim, lineHeight: 1.8, margin: 0 }}>
                {saved
                  ? 'DOWNLOADED. OPEN THE FILE AND YOUR CALENDAR WILL TAKE IT WITH 30-MIN ALARMS.'
                  : 'DOWNLOADS A NATIVE CALENDAR FILE WITH REMINDER ALARMS + WHATSAPP CREW EXPORT.'}
              </p>
            </>
          )}
        </div>

        <p style={{ fontFamily: MONO, fontSize: 8, color: B.dim, marginTop: 18, lineHeight: 1.8 }}>
          Times are West Africa Time (WAT) on December 12 at Muri Okunola Park. Unlocks +75 XP and the Master Strategist badge when you construct your itinerary.
        </p>
      </div>
    </section>
  )
}
