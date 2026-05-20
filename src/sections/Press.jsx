import { B } from '../tokens'
import { GrainOverlay, SectionTag } from '../components/Shared'

const MEDIA = [
  { name: 'PULSE NIGERIA',     abbr: 'PULSE',   color: '#FF3366' },
  { name: 'TECHCABAL',         abbr: 'TC',      color: B.neonCyan },
  { name: 'THE GUARDIAN',      abbr: 'TGN',     color: B.smoke },
  { name: 'VANGUARD',          abbr: 'VGD',     color: '#00A859' },
  { name: 'CNN AFRICA',        abbr: 'CNN',     color: '#CC0000' },
  { name: 'BBC AFRICA',        abbr: 'BBC',     color: '#BB1919' },
]

const PARTNERS = [
  { name: 'NIKE',          color: B.white },
  { name: 'ADIDAS',        color: B.white },
  { name: 'JORDAN',        color: B.neonMagenta },
  { name: 'NEW BALANCE',   color: B.neonCyan },
  { name: 'PUMA',          color: B.amber },
  { name: 'REEBOK',        color: B.neonLime },
  { name: 'CONVERSE',      color: B.white },
  { name: 'VANS',          color: B.smoke },
]

export default function Press() {
  return (
    <section id="press" style={{ position: 'relative', overflow: 'hidden', background: B.black, padding: '80px 24px' }}>
      <GrainOverlay />
      <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: 600, height: 200, background: `radial-gradient(ellipse, ${B.amber}06 0%, transparent 70%)`, filter: 'blur(60px)', pointerEvents: 'none' }} />

      <div style={{ position: 'relative', zIndex: 10, maxWidth: 1100, margin: '0 auto' }}>

        {/* AS SEEN IN */}
        <div style={{ marginBottom: 64 }}>
          <div style={{ textAlign: 'center', marginBottom: 36 }}>
            <SectionTag>MEDIA COVERAGE</SectionTag>
            <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 8, color: B.smoke, letterSpacing: '0.5em' }}>AS SEEN IN</div>
          </div>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', justifyContent: 'center', alignItems: 'center' }}>
            {MEDIA.map((m, i) => (
              <div
                key={i}
                style={{ padding: '12px 22px', background: 'rgba(255,255,255,0.03)', border: `1px solid rgba(255,255,255,0.07)`, borderRadius: 6, transition: 'all 0.25s', cursor: 'default' }}
                onMouseEnter={e => { e.currentTarget.style.background = m.color + '10'; e.currentTarget.style.borderColor = m.color + '40' }}
                onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.03)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)' }}
              >
                <div style={{ fontFamily: "'Orbitron', monospace", fontWeight: 900, fontSize: 11, color: m.color, letterSpacing: '0.15em', opacity: 0.75 }}>{m.abbr}</div>
                <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 6, color: '#333', letterSpacing: '0.1em', marginTop: 3, whiteSpace: 'nowrap' }}>{m.name}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Divider */}
        <div style={{ width: '100%', height: 1, background: `linear-gradient(90deg, transparent, ${B.gunmetal}, transparent)`, marginBottom: 64 }} />

        {/* BRAND PARTNERS */}
        <div>
          <div style={{ textAlign: 'center', marginBottom: 36 }}>
            <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 8, color: B.smoke, letterSpacing: '0.5em' }}>OFFICIAL BRAND PARTNERS</div>
          </div>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', justifyContent: 'center' }}>
            {PARTNERS.map((p, i) => (
              <div
                key={i}
                style={{ padding: '14px 24px', background: 'rgba(255,255,255,0.025)', border: `1px solid rgba(255,255,255,0.06)`, borderRadius: 4, transition: 'all 0.25s', cursor: 'default' }}
                onMouseEnter={e => { e.currentTarget.style.background = p.color + '08'; e.currentTarget.style.borderColor = p.color + '35'; e.currentTarget.style.transform = 'translateY(-2px)' }}
                onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.025)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)'; e.currentTarget.style.transform = 'translateY(0)' }}
              >
                <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 16, color: p.color, letterSpacing: '0.1em', opacity: 0.6 }}>{p.name}</div>
              </div>
            ))}
          </div>
          <div style={{ textAlign: 'center', marginTop: 20, fontFamily: "'Space Mono', monospace", fontSize: 7, color: '#2a2a2a', letterSpacing: '0.25em' }}>PARTNERSHIP ENQUIRIES: INFO@SNEAKERSFEST.COM</div>
        </div>
      </div>
    </section>
  )
}
