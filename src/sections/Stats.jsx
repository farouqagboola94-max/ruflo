import { B } from '../tokens'
import CountUp from '../components/CountUp'

const STATS = [
  { to: 1000, suffix: '+', label: 'EXPECTED ATTENDEES',    color: B.amber },
  { to: 30,   suffix: '+', label: 'CONFIRMED VENDORS',     color: B.neonCyan },
  { to: 200,  suffix: '+', label: 'RARE PAIRS ON DISPLAY', color: B.amber },
  { to: 4,    suffix: '',  label: 'TICKET TIERS',          color: B.neonMagenta },
  { to: 10,   suffix: 'H', label: 'OF LIVE CULTURE',       color: B.neonCyan },
]

export default function Stats() {
  return (
    <section id="stats" style={{
      background: B.void,
      borderTop:    '1px solid rgba(255,255,255,0.04)',
      borderBottom: '1px solid rgba(255,255,255,0.04)',
    }}>
      <style>{`
        @keyframes dotBlink { 0%,100%{ opacity:1 } 50%{ opacity:0.4 } }
      `}</style>

      {/* Event strip. This was a "142 EXPLORING THE EVENT NOW" counter seeded from
          a random number - there is no analytics feed behind it, so it said nothing
          true. The date and venue are the facts worth repeating here. */}
      <div style={{
        borderBottom: '1px solid rgba(255,255,255,0.04)',
        padding: '9px 24px',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ width: 7, height: 7, borderRadius: '50%', background: B.neonLime, boxShadow: `0 0 8px ${B.neonLime}`, animation: 'dotBlink 1.8s ease-in-out infinite' }} />
          <span style={{ fontFamily: 'Space Mono,monospace', fontSize: 9, color: B.smoke, letterSpacing: 2 }}>
            DECEMBER 12 · MURI OKUNOLA PARK, VICTORIA ISLAND
          </span>
        </div>
      </div>

      {/* Animated counters */}
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '72px 24px 48px' }}>
        <div className="reveal-3d" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))' }}>
          {STATS.map((s, i) => (
            <div key={i} className="card-3d" style={{
              padding: '28px 20px', textAlign: 'center',
              borderRight: i < STATS.length - 1 ? '1px solid rgba(255,255,255,0.06)' : 'none',
              position: 'relative',
            }}>
              <div style={{ position: 'absolute', bottom: 0, left: '50%', transform: 'translateX(-50%)', width: 28, height: 2, background: s.color, opacity: 0.35, borderRadius: 1 }} />
              <div style={{ fontFamily: "'Orbitron', monospace", fontWeight: 900, fontSize: 'clamp(42px, 6vw, 66px)', color: s.color, textShadow: `0 0 40px ${s.color}30`, lineHeight: 1 }}>
                <CountUp to={s.to} suffix={s.suffix} duration={2000} />
              </div>
              <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 9, letterSpacing: '0.45em', color: B.smoke, marginTop: 12 }}>
                {s.label}
              </div>
            </div>
          ))}
        </div>

        <div className="reveal-3d" style={{ display: 'flex', justifyContent: 'center', marginTop: 36 }}>
          <div className="card-3d" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '6px 18px', background: `${B.neonCyan}08`, border: `1px solid ${B.neonCyan}22`, borderRadius: 20 }}>
            <span style={{ fontFamily: 'Space Mono,monospace', fontSize: 9, color: B.neonCyan, letterSpacing: 1 }}>○</span>
            <span style={{ fontFamily: 'Space Mono,monospace', fontSize: 8, color: B.neonCyan, letterSpacing: 2 }}>PROJECTED TARGETS · DEC 12, 2026</span>
          </div>
        </div>
      </div>
    </section>
  )
}
