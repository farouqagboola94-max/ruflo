import { B } from '../tokens'
import { GrainOverlay, AmberGlow, SectionTag, Divider } from '../components/Shared'

const STATS = [
  { num: '1K–2.5K', label: 'YEAR 1 ATTENDEES',    accent: true },
  { num: '30–50',   label: 'VENDOR SPOTS',         accent: false },
  { num: '5,000+', label: 'ONLINE COMMUNITY TARGET', accent: false },
  { num: '3D',     label: 'BRAND DIMENSIONS',       accent: true },
]

const DIMENSIONS = [
  {
    n: '01',
    title: 'PHYSICAL EXHIBITION',
    body: 'The event. Eko Atlantic City, December 12. Vendors, drops, DJ sets, community — everything in one space.',
    color: B.amber,
  },
  {
    n: '02',
    title: 'ONLINE PLATFORM',
    body: 'The website you’re on right now. Year-round content, tools, and community infrastructure that never sleeps.',
    color: B.neonCyan,
  },
  {
    n: '03',
    title: 'COMMUNITY ENGINE',
    body: 'The Friday Night Protocol. Weekly sessions, challenges, drops, and conversations that keep the community active every single week.',
    color: B.neonMagenta,
  },
]

export default function About() {
  return (
    <section id="about" style={{
      position: 'relative', overflow: 'hidden',
      background: B.void, padding: '100px 24px',
    }}>
      <GrainOverlay />
      <AmberGlow top="50%" left="90%" size={400} />

      <div style={{ position: 'relative', zIndex: 10, maxWidth: 1100, margin: '0 auto' }}>
        <div style={{ display: 'flex', gap: 80, alignItems: 'flex-start', flexWrap: 'wrap', marginBottom: 72 }}>

          {/* Left: Text */}
          <div style={{ flex: '1 1 400px' }}>
            <SectionTag>WHO WE ARE</SectionTag>
            <div style={{
              fontFamily: "'Bebas Neue', sans-serif",
              fontSize: 'clamp(40px, 6vw, 68px)',
              color: B.white, lineHeight: 0.9, marginBottom: 24,
            }}>
              THREE DIMENSIONS.<br />
              <span style={{ color: B.amber }}>ONE BRAND.</span>
            </div>
            <Divider />
            <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 15, color: B.smoke, lineHeight: 1.8, marginBottom: 18 }}>
              Sneakers Fest 2026 is Lagos’ first dedicated sneaker cultural festival — not a one-day market, not a pop-up. A three-dimensional brand combining a physical exhibition, a year-round online platform, and a community participation engine that runs every single week.
            </div>
            <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 15, color: B.smoke, lineHeight: 1.8, marginBottom: 18 }}>
              Founded by <span style={{ color: B.white, fontWeight: 700 }}>Oluwatobiloba — The Catalyst</span>, principal of Catalyst Concepts, Lagos. Sneakers Fest is built to compound over years, not disappear after one day.
            </div>
            <div style={{
              fontFamily: "'Space Mono', monospace", fontSize: 9, color: B.neonCyan,
              letterSpacing: '0.3em', marginBottom: 32, lineHeight: 1.8,
            }}>
              COLLECTORS · CREATORS · CULTURE MAKERS
            </div>
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              <a
                href="#waitlist"
                style={{
                  display: 'inline-block', padding: '12px 28px',
                  background: B.amber, color: B.black,
                  fontFamily: "'Space Mono', monospace", fontSize: 9, fontWeight: 700, letterSpacing: '0.2em',
                  textDecoration: 'none', borderRadius: 2,
                  boxShadow: `0 0 20px ${B.amber}50`,
                }}
              >
                GET EARLY ACCESS →
              </a>
              <a
                href="#tickets"
                style={{
                  display: 'inline-block', padding: '12px 28px',
                  border: `1px solid ${B.gunmetal}`, color: B.smoke,
                  fontFamily: "'Space Mono', monospace", fontSize: 9, letterSpacing: '0.2em',
                  textDecoration: 'none', borderRadius: 2,
                }}
              >
                GET EVENT TICKETS
              </a>
            </div>
          </div>

          {/* Right: Stats */}
          <div style={{ flex: '1 1 300px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            {STATS.map((s, i) => (
              <div key={i} style={{
                padding: '24px 20px',
                background: B.charcoal,
                border: `1px solid ${s.accent ? B.amber + '50' : B.gunmetal}`,
                borderRadius: 4, position: 'relative', overflow: 'hidden',
              }}>
                <div style={{
                  position: 'absolute', top: 0, left: 0, right: 0, height: 2,
                  background: s.accent
                    ? `linear-gradient(90deg, ${B.amber}, transparent)`
                    : `linear-gradient(90deg, ${B.neonCyan}30, transparent)`,
                }} />
                <div style={{
                  fontFamily: "'Orbitron', monospace", fontWeight: 900,
                  fontSize: s.num.length > 5 ? 24 : 32, color: s.accent ? B.amber : B.white, lineHeight: 1,
                  textShadow: s.accent ? `0 0 20px ${B.amber}30` : 'none',
                }}>
                  {s.num}
                </div>
                <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 7, color: B.smoke, letterSpacing: '0.15em', marginTop: 8, lineHeight: 1.5 }}>
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Three dimensions */}
        <div>
          <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 8, color: B.smoke, letterSpacing: '0.4em', marginBottom: 20 }}>THE THREE DIMENSIONS</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 16 }}>
            {DIMENSIONS.map((d, i) => (
              <div key={i} style={{
                padding: '24px 22px', background: B.charcoal,
                borderRadius: 8, border: `1px solid ${B.gunmetal}`,
                borderTop: `2px solid ${d.color}`,
              }}>
                <div style={{ fontFamily: "'Orbitron', monospace", fontSize: '0.65rem', color: d.color, marginBottom: 8 }}>{d.n}</div>
                <div style={{ fontFamily: "'Bebas Neue'", fontSize: '1.1rem', color: B.white, letterSpacing: '0.05em', marginBottom: 10 }}>{d.title}</div>
                <div style={{ fontFamily: "'Syne'", fontSize: '0.82rem', color: B.smoke, lineHeight: 1.7 }}>{d.body}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
