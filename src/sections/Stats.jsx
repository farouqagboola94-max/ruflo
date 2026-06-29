import { B } from '../tokens'
import CountUp from '../components/CountUp'
import Marquee from '../components/Marquee'

const STATS = [
  { to: 1000, suffix: '+', label: 'EXPECTED ATTENDEES',    color: B.amber },
  { to: 50,   suffix: '+', label: 'CURATED VENDORS',       color: B.neonCyan },
  { to: 200,  suffix: '+', label: 'RARE SNEAKERS ON SHOW', color: B.amber },
  { to: 12,   suffix: 'H', label: 'OF LIVE CULTURE',       color: B.neonCyan },
]

const BRANDS = [
  'Nike', 'Adidas', 'Jordan Brand', 'New Balance', 'Puma', 'Reebok',
  'Asics', 'Converse', 'Vans', 'Balenciaga', 'Off-White', 'Dior',
  'Travis Scott', 'A Bathing Ape', 'Yeezy', 'Fear Of God', 'Palm Angels', 'Supreme',
]

export default function Stats() {
  return (
    <section id="stats" style={{
      background: B.void,
      borderTop:    '1px solid rgba(255,255,255,0.04)',
      borderBottom: '1px solid rgba(255,255,255,0.04)',
    }}>
      {/* Animated counters */}
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '72px 24px 56px' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        }}>
          {STATS.map((s, i) => (
            <div key={i} style={{
              padding: '28px 20px',
              textAlign: 'center',
              borderRight: i < STATS.length - 1
                ? '1px solid rgba(255,255,255,0.06)' : 'none',
              position: 'relative',
            }}>
              <div style={{
                position: 'absolute', bottom: 0, left: '50%',
                transform: 'translateX(-50%)',
                width: 28, height: 2,
                background: s.color, opacity: 0.35, borderRadius: 1,
              }} />
              <div style={{
                fontFamily: "'Orbitron', monospace", fontWeight: 900,
                fontSize: 'clamp(42px, 6vw, 66px)',
                color: s.color,
                textShadow: `0 0 40px ${s.color}30`,
                lineHeight: 1,
              }}>
                <CountUp to={s.to} suffix={s.suffix} duration={2000} />
              </div>
              <div style={{
                fontFamily: "'Space Mono', monospace",
                fontSize: 9, letterSpacing: '0.45em',
                color: B.smoke, marginTop: 12,
              }}>
                {s.label}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Brand marquee */}
      <div style={{ borderTop: '1px solid rgba(255,255,255,0.04)', padding: '18px 0' }}>
        <Marquee items={BRANDS} speed={42} />
      </div>
    </section>
  )
}
