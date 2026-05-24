import { B } from '../tokens'
import { GrainOverlay, SectionTag } from '../components/Shared'

const TIMELINE = [
  { time: '12:00', period: 'PM', title: 'DOORS OPEN', desc: 'Gates open. Vendor floor live. Early bird exclusive access begins.', tag: 'OPEN', color: B.neonLime },
  { time: '12:30', period: 'PM', title: 'VENDOR FLOOR', desc: 'Full access to all 50+ vendor booths. Rare kicks, customs, and drops.', tag: 'ALL ACCESS', color: B.neonCyan },
  { time: '2:00', period: 'PM', title: 'DJ NEPTUNE', desc: 'Opening set — Afrobeats & Street Pop to warm the crowd.', tag: 'MUSIC', color: B.amber },
  { time: '3:00', period: 'PM', title: 'CUSTOM ART SHOWCASE', desc: 'On-site artists customise your kicks in real time. Bring your canvas.', tag: 'ART', color: B.neonMagenta },
  { time: '4:00', period: 'PM', title: 'SARZ — PRODUCER SET', desc: 'Live production showcase. Beats made in real time, right in front of you.', tag: 'MUSIC', color: B.amber },
  { time: '5:00', period: 'PM', title: 'EXCLUSIVE DROP #1', desc: 'First limited release of the day. VIP ticket holders get priority access.', tag: 'DROP', color: B.neonLime },
  { time: '6:00', period: 'PM', title: 'ODUNSI THE ENGINE', desc: 'Alt-R&B and Electronic set — the vibe shifts, energy peaks.', tag: 'MUSIC', color: B.amber },
  { time: '7:00', period: 'PM', title: 'VIP COLLECTOR ROOM', desc: 'Private viewing of ultra-rare pieces. VIP & Ultra VIP ticket holders only.', tag: 'VIP ONLY', color: '#FFD700' },
  { time: '8:00', period: 'PM', title: 'DJ SPINALL — HEADLINE', desc: "The main event. Lagos' biggest DJ closes the night with the performance of the year.", tag: 'HEADLINE', color: B.neonMagenta, featured: true },
  { time: '10:00', period: 'PM', title: 'DOORS CLOSE', desc: 'Final vendor rounds. Collect your purchases. See you next year.', tag: 'CLOSE', color: B.smoke },
]

export default function Schedule() {
  return (
    <section id="schedule" style={{ position: 'relative', overflow: 'hidden', background: B.void, padding: '100px 24px' }}>
      <GrainOverlay />
      <div style={{ position: 'absolute', top: '20%', right: '-5%', width: 360, height: 360, background: `radial-gradient(circle, ${B.neonMagenta}07 0%, transparent 70%)`, filter: 'blur(70px)', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', bottom: '20%', left: '-5%', width: 320, height: 320, background: `radial-gradient(circle, ${B.amber}07 0%, transparent 70%)`, filter: 'blur(70px)', pointerEvents: 'none' }} />

      <div style={{ position: 'relative', zIndex: 10, maxWidth: 820, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 64 }}>
          <SectionTag>DECEMBER 12, 2026</SectionTag>
          <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 'clamp(40px, 6vw, 68px)', color: B.white, lineHeight: 0.9 }}>
            EVENT<br /><span style={{ color: B.amber }}>SCHEDULE</span>
          </div>
          <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 14, color: B.smoke, marginTop: 14 }}>Eko Atlantic, Lagos · Doors open 12:00 PM</div>
        </div>

        <div style={{ position: 'relative' }}>
          {/* Vertical line */}
          <div style={{ position: 'absolute', left: 86, top: 0, bottom: 0, width: 1, background: `linear-gradient(${B.amber}00, ${B.gunmetal}80, ${B.amber}40, ${B.gunmetal}80, ${B.amber}00)` }} />

          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {TIMELINE.map((item, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'flex-start', marginBottom: i < TIMELINE.length - 1 ? 8 : 0 }}>
                {/* Time column */}
                <div style={{ width: 86, flexShrink: 0, paddingTop: 18, paddingRight: 18, textAlign: 'right' }}>
                  <div style={{ fontFamily: "'Orbitron', monospace", fontSize: 11, fontWeight: 700, color: item.featured ? item.color : item.tag === 'CLOSE' ? '#333' : B.smoke, lineHeight: 1.2, textShadow: item.featured ? `0 0 12px ${item.color}50` : 'none' }}>
                    {item.time}
                  </div>
                  <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 7, color: '#333', letterSpacing: '0.1em' }}>{item.period}</div>
                </div>

                {/* Node */}
                <div style={{ flexShrink: 0, paddingTop: 22, display: 'flex', alignItems: 'center', justifyContent: 'center', width: 12 }}>
                  <div style={{ width: 11, height: 11, borderRadius: '50%', background: item.featured ? item.color : item.tag === 'CLOSE' ? B.gunmetal : B.charcoal, border: `2px solid ${item.featured ? item.color : item.tag === 'CLOSE' ? B.gunmetal : item.color + '60'}`, boxShadow: item.featured ? `0 0 18px ${item.color}80` : 'none', flexShrink: 0, transition: 'all 0.3s' }} />
                </div>

                {/* Card */}
                <div
                  style={{ flex: 1, marginLeft: 16, padding: '14px 18px', background: item.featured ? `${item.color}08` : 'rgba(255,255,255,0.025)', border: `1px solid ${item.featured ? item.color + '45' : B.gunmetal}`, borderRadius: 8, transition: 'all 0.25s', position: 'relative', overflow: 'hidden' }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = item.color + '70'; e.currentTarget.style.background = `${item.color}0e` }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = item.featured ? item.color + '45' : B.gunmetal; e.currentTarget.style.background = item.featured ? `${item.color}08` : 'rgba(255,255,255,0.025)' }}
                >
                  {item.featured && <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 3, background: item.color, boxShadow: `0 0 12px ${item.color}` }} />}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 5, flexWrap: 'wrap' }}>
                    <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 18, color: item.tag === 'CLOSE' ? B.smoke : B.white, letterSpacing: '0.04em', lineHeight: 1 }}>{item.title}</div>
                    <span style={{ padding: '2px 7px', background: item.color + '18', border: `1px solid ${item.color}40`, borderRadius: 2, fontFamily: "'Space Mono', monospace", fontSize: 7, color: item.color, letterSpacing: '0.12em', whiteSpace: 'nowrap' }}>{item.tag}</span>
                  </div>
                  <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 12, color: B.smoke, lineHeight: 1.6 }}>{item.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ marginTop: 36, padding: '20px 24px', background: B.charcoal, border: `1px solid ${B.gunmetal}`, borderRadius: 8, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
          <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 8, color: B.smoke, letterSpacing: '0.15em', lineHeight: 1.7 }}>
            SCHEDULE SUBJECT TO CHANGE<br />
            <span style={{ color: '#333' }}>FOLLOW @SNEAKERSFEST FOR LIVE UPDATES</span>
          </div>
          <a href="#tickets" style={{ padding: '10px 20px', background: B.amber, color: B.black, fontFamily: "'Space Mono', monospace", fontSize: 8, fontWeight: 700, letterSpacing: '0.15em', textDecoration: 'none', borderRadius: 2, whiteSpace: 'nowrap' }}>SECURE YOUR SPOT →</a>
        </div>
      </div>
    </section>
  )
}
