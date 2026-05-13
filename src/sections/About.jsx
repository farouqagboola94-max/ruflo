import { B } from '../tokens'
import { GrainOverlay, AmberGlow, SectionTag, Divider } from '../components/Shared'

const STATS = [
  { num: "200+", label: "RARE KICKS", accent: true },
  { num: "50+", label: "VENDORS" },
  { num: "10K+", label: "ATTENDEES" },
  { num: "1", label: "CULTURE" },
]

export default function About() {
  return (
    <section id="about" style={{
      position: "relative", overflow: "hidden",
      background: B.void, padding: "100px 24px",
    }}>
      <GrainOverlay />
      <AmberGlow top="50%" left="90%" size={400} />

      <div style={{ position: "relative", zIndex: 10, maxWidth: 1100, margin: "0 auto" }}>
        <div style={{ display: "flex", gap: 80, alignItems: "flex-start", flexWrap: "wrap" }}>
          {/* Left: Text */}
          <div style={{ flex: "1 1 400px" }}>
            <SectionTag>ABOUT THE EVENT</SectionTag>
            <div style={{
              fontFamily: "'Bebas Neue', sans-serif",
              fontSize: "clamp(40px, 6vw, 68px)",
              color: B.white, lineHeight: 0.9, marginBottom: 24,
            }}>
              MORE THAN<br />SNEAKERS.<br />
              <span style={{ color: B.amber }}>IT'S THE CULTURE.</span>
            </div>
            <Divider />
            <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 15, color: B.smoke, lineHeight: 1.8, marginBottom: 18 }}>
              Sneakers Fest is West Africa's premier sneaker culture event — a convergence of collectors, creators, DJs, and street culture tastemakers. Born from the streets of Lagos, built for the world.
            </div>
            <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 15, color: B.smoke, lineHeight: 1.8, marginBottom: 36 }}>
              Every pair tells a story. Every vendor is a pillar. Every visitor becomes part of the movement. This is where sole meets soul.
            </div>
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
              <a
                href="#tickets"
                style={{
                  display: "inline-block", padding: "12px 28px",
                  background: B.amber, color: B.black,
                  fontFamily: "'Space Mono', monospace", fontSize: 9, fontWeight: 700, letterSpacing: "0.2em",
                  textDecoration: "none", borderRadius: 2,
                }}
              >
                SECURE YOUR SPOT →
              </a>
              <a
                href="#highlights"
                style={{
                  display: "inline-block", padding: "12px 28px",
                  border: `1px solid ${B.gunmetal}`, color: B.smoke,
                  fontFamily: "'Space Mono', monospace", fontSize: 9, letterSpacing: "0.2em",
                  textDecoration: "none", borderRadius: 2,
                }}
              >
                WHAT'S INSIDE
              </a>
            </div>
          </div>

          {/* Right: Stats */}
          <div style={{ flex: "1 1 300px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            {STATS.map((s, i) => (
              <div key={i} style={{
                padding: "24px 20px",
                background: B.charcoal,
                border: `1px solid ${s.accent ? B.amber + "50" : B.gunmetal}`,
                borderRadius: 4, position: "relative", overflow: "hidden",
              }}>
                <div style={{
                  position: "absolute", top: 0, left: 0, right: 0, height: 2,
                  background: s.accent ? `linear-gradient(90deg, ${B.amber}, transparent)` : `linear-gradient(90deg, ${B.neonCyan}30, transparent)`,
                }} />
                <div style={{
                  fontFamily: "'Orbitron', monospace", fontWeight: 900,
                  fontSize: 38, color: s.accent ? B.amber : B.white, lineHeight: 1,
                  textShadow: s.accent ? `0 0 20px ${B.amber}30` : "none",
                }}>
                  {s.num}
                </div>
                <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 8, color: B.smoke, letterSpacing: "0.2em", marginTop: 8 }}>
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
