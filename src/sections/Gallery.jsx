import { B } from '../tokens'
import { GrainOverlay, SectionTag } from '../components/Shared'

const SneakerSVG = ({ color }) => (
  <svg width="110" height="58" viewBox="0 0 140 72" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M10 56 C10 56 30 52 60 48 C85 44 108 42 124 44 C134 46 136 50 134 54 C132 58 118 60 96 62 C74 64 44 64 22 62 C12 60 8 58 10 56Z" fill={color + '20'} stroke={color} strokeWidth="1.5"/>
    <path d="M22 56 L32 36 Q42 22 62 20 L94 18 Q112 18 122 30 L124 44" fill={color + '10'} stroke={color} strokeWidth="1.5" strokeLinejoin="round"/>
    <path d="M62 20 L64 38 M74 19 L76 37 M86 18 L88 36" stroke={color} strokeWidth="1.2" opacity="0.5" strokeLinecap="round"/>
    <path d="M10 56 Q6 55 6 51 Q8 45 22 54" fill={color + '15'} stroke={color} strokeWidth="1.2"/>
  </svg>
)

const SLOTS = [
  { cat: 'AIR MAX 95', label: 'RUNNING CULTURE', accent: B.neonCyan },
  { cat: 'JORDAN 1', label: 'COLLECTOR PIECE', accent: B.neonMagenta },
  { cat: 'YEEZY 350', label: 'FUTURE WAVE', accent: B.amber },
  { cat: 'AIR FORCE 1', label: 'CLASSIC SILHOUETTE', accent: B.neonLime },
  { cat: 'NEW BALANCE 550', label: 'HERITAGE RUNNER', accent: '#69C9D0' },
  { cat: 'DUNK LOW', label: 'STREET ESSENTIAL', accent: '#E1306C' },
  { cat: 'ULTRA BOOST', label: 'PERFORMANCE ICON', accent: B.neonCyan },
  { cat: 'TRAVIS SCOTT', label: 'COLLAB CULTURE', accent: B.amber },
  { cat: '+ YOUR KICKS', label: 'SUBMIT TO JOIN', accent: B.neonMagenta, cta: true },
]

export default function Gallery() {
  return (
    <section id="gallery" style={{ position: 'relative', overflow: 'hidden', background: B.black, padding: '100px 24px' }}>
      <GrainOverlay />
      <div style={{ position: 'absolute', top: '40%', left: '50%', transform: 'translate(-50%,-50%)', width: 600, height: 400, background: `radial-gradient(ellipse, ${B.neonMagenta}07 0%, transparent 70%)`, filter: 'blur(60px)', pointerEvents: 'none' }} />

      <div style={{ position: 'relative', zIndex: 10, maxWidth: 1100, margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: 20, marginBottom: 48 }}>
          <div>
            <SectionTag>COMMUNITY GALLERY</SectionTag>
            <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 'clamp(40px, 6vw, 68px)', color: B.white, lineHeight: 0.9 }}>
              THE<br /><span style={{ color: B.neonMagenta }}>COLLECTION</span>
            </div>
          </div>
          <a
            href="mailto:info@sneakersfest.com?subject=Gallery Submission"
            style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '12px 24px', background: `rgba(255,45,123,0.08)`, border: `1px solid ${B.neonMagenta}50`, borderRadius: 4, textDecoration: 'none', fontFamily: "'Space Mono', monospace", fontSize: 9, color: B.neonMagenta, letterSpacing: '0.15em', transition: 'all 0.25s' }}
            onMouseEnter={e => { e.currentTarget.style.background = `rgba(255,45,123,0.15)`; e.currentTarget.style.borderColor = B.neonMagenta }}
            onMouseLeave={e => { e.currentTarget.style.background = `rgba(255,45,123,0.08)`; e.currentTarget.style.borderColor = `${B.neonMagenta}50` }}
          >SUBMIT YOUR KICKS →</a>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(270px, 1fr))', gap: 16 }}>
          {SLOTS.map((s, i) => (
            <div
              key={i}
              style={{ height: i === 0 || i === 4 ? 280 : 220, background: B.charcoal, backgroundImage: `linear-gradient(135deg, ${s.accent}14, transparent)`, border: `1px solid ${s.accent}22`, borderRadius: 10, overflow: 'hidden', position: 'relative', transition: 'all 0.3s', cursor: s.cta ? 'pointer' : 'default' }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = s.accent + '55'; e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = `0 12px 40px rgba(0,0,0,0.5), 0 0 0 1px ${s.accent}18` }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = s.accent + '22'; e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none' }}
              onClick={s.cta ? () => window.location.href = 'mailto:info@sneakersfest.com?subject=Gallery Submission' : undefined}
            >
              <div style={{ height: 2, background: `linear-gradient(90deg, ${s.accent}, transparent)` }} />
              <div style={{ position: 'absolute', inset: 0, backgroundImage: 'repeating-linear-gradient(0deg, rgba(0,0,0,0.05) 0px, rgba(0,0,0,0.05) 1px, transparent 1px, transparent 4px)', pointerEvents: 'none' }} />
              <div style={{ position: 'absolute', top: 14, left: 14 }}>
                <span style={{ padding: '3px 8px', background: s.accent + '18', border: `1px solid ${s.accent}40`, borderRadius: 2, fontFamily: "'Space Mono', monospace", fontSize: 7, color: s.accent, letterSpacing: '0.15em' }}>{s.cat}</span>
              </div>
              <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {s.cta ? (
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ width: 52, height: 52, borderRadius: '50%', border: `2px dashed ${s.accent}60`, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px' }}>
                      <span style={{ color: s.accent, fontSize: 22, lineHeight: 1 }}>+</span>
                    </div>
                    <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 9, color: s.accent, letterSpacing: '0.2em' }}>YOUR PHOTO</div>
                    <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 11, color: B.smoke, marginTop: 4 }}>Email to join the gallery</div>
                  </div>
                ) : (
                  <div style={{ opacity: 0.65 }}><SneakerSVG color={s.accent} /></div>
                )}
              </div>
              <div style={{ position: 'absolute', bottom: 14, left: 14 }}>
                <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 7, color: s.accent + 'aa', letterSpacing: '0.2em' }}>{s.label}</div>
              </div>
            </div>
          ))}
        </div>

        <div style={{ marginTop: 32, textAlign: 'center', fontFamily: "'Syne', sans-serif", fontSize: 14, color: B.smoke, lineHeight: 1.75 }}>
          Email your best photos to{' '}
          <a href="mailto:info@sneakersfest.com?subject=Gallery Submission" style={{ color: B.neonMagenta, textDecoration: 'none' }}>info@sneakersfest.com</a>
          {' '}or tag{' '}
          <a href="https://instagram.com/sneakersfest" target="_blank" rel="noopener noreferrer" style={{ color: B.amber, textDecoration: 'none' }}>@sneakersfest</a>
          {' '}on Instagram
        </div>
      </div>
    </section>
  )
}
