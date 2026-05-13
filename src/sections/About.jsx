import { B } from '../tokens'
import { GrainOverlay, AmberGlow, SectionTag, Divider } from '../components/Shared'

const STATS = [
  { num: "200+", label: "RARE KICKS", accent: true },
  { num: "50+", label: "VENDORS" },
  { num: "10K+", label: "COMMUNITY" },
  { num: "5", label: "PLATFORMS" },
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
            <SectionTag>WHO WE ARE</SectionTag>
            <div style={{
              fontFamily: "'Bebas Neue', sans-serif",
              fontSize: "clamp(40px, 6vw, 68px)",
              color: B.white, lineHeight: 0.9, marginBottom: 24,
            }}>
              ONLINE COMMUNITY.<br />
              <span style={{ color: B.amber }}>PHYSICAL PRESENCE.</span>
            </div>
            <Divider />
            <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 15, color: B.smoke, lineHeight: 1.8, marginBottom: 18 }}>
              Sneakers Fest started as a conversation online and grew into West Africa's premier sneaker culture event.
              We are an online community first — the physical event is where the community comes alive.
            </div>
            <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 15, color: B.smoke, lineHeight: 1.8, marginBottom: 18 }}>
              We create content daily across Instagram, Twitter, YouTube, Snapchat, and WhatsApp.
              The community grows 365 days a year. July 18 is just the day we all meet in person.
            </div>
            <div style={{
              fontFamily: "'Space Mono', monospace", fontSize: 9, color: B.neonCyan,
              letterSpacing: "0.3em", marginBottom: 32, lineHeight: 1.8,
            }}>
              COLLECTORS · CREATORS · CULTURE MAKERS
            </div>
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
              <a
                href="#community"
                style={{
                  display: "inline-block", padding: "12px 28px",
                  background: B.amber, color: B.black,
                  fontFamily: "'Space Mono', monospace", fontSize: 9, fontWeight: 700, letterSpacing: "0.2em",
                  textDecoration: "none", borderRadius: 2,
                }}
              >
                JOIN THE COMMUNITY →
              </a>
              <a
                href="#tickets"
                style={{
                  display: "inline-block", padding: "12px 28px",
                  border: `1px solid ${B.gunmetal}`, color: B.smoke,
                  fontFamily: "'Space Mono', monospace", fontSize: 9, letterSpacing: "0.2em",
                  textDecoration: "none", borderRadius: 2,
                }}
              >
                GET EVENT TICKETS
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
                  background: s.accent
                    ? `linear-gradient(90deg, ${B.amber}, transparent)`
                    : `linear-gradient(90deg, ${B.neonCyan}30, transparent)`,
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
