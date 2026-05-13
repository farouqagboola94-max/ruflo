import { B } from '../tokens'
import { GrainOverlay, AmberGlow, SectionTag } from '../components/Shared'

const FEATURES = [
  { icon: "👟", title: "RARE KICKS", desc: "200+ exclusive pairs from collectors across Africa and beyond. Find your grails here.", color: B.amber },
  { icon: "🏪", title: "50+ VENDORS", desc: "Curated vendors bringing heat, vintage, customs, and everything in between.", color: B.neonCyan },
  { icon: "🎵", title: "LIVE DJs", desc: "The best DJs in Lagos keep energy alive from doors open to the very last drop.", color: B.neonMagenta },
  { icon: "🎨", title: "CUSTOM ART", desc: "On-site artists transforming your kicks into one-of-a-kind masterpieces.", color: B.neonLime },
  { icon: "🍜", title: "STREET FOOD", desc: "Lagos' finest street food vendors. Eat well, stay long, vibe harder.", color: B.amber },
  { icon: "⚡", title: "EXCLUSIVE DROPS", desc: "Limited edition releases you won't find anywhere else. Be there or miss out forever.", color: B.neonCyan },
]

export default function Highlights() {
  return (
    <section id="highlights" style={{
      position: "relative", overflow: "hidden",
      background: B.black, padding: "100px 24px",
    }}>
      <GrainOverlay />
      <AmberGlow top="30%" left="8%" size={380} />

      <div style={{
        position: "absolute", inset: 0, opacity: 0.02,
        backgroundImage: `linear-gradient(${B.white} 1px, transparent 1px), linear-gradient(90deg, ${B.white} 1px, transparent 1px)`,
        backgroundSize: "50px 50px",
      }} />

      <div style={{ position: "relative", zIndex: 10, maxWidth: 1100, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 64 }}>
          <SectionTag>WHAT TO EXPECT</SectionTag>
          <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "clamp(40px, 6vw, 68px)", color: B.white, lineHeight: 0.9 }}>
            THE FULL<br /><span style={{ color: B.amber }}>EXPERIENCE</span>
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 14 }}>
          {FEATURES.map((f, i) => (
            <div
              key={i}
              style={{
                padding: 28, background: B.charcoal,
                border: `1px solid ${B.gunmetal}`, borderRadius: 6,
                position: "relative", overflow: "hidden", transition: "border-color 0.3s",
              }}
              onMouseEnter={e => e.currentTarget.style.borderColor = f.color + "70"}
              onMouseLeave={e => e.currentTarget.style.borderColor = B.gunmetal}
            >
              <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg, ${f.color}, transparent)`, opacity: 0.5 }} />
              <div style={{ fontSize: 34, marginBottom: 14 }}>{f.icon}</div>
              <div style={{ fontFamily: "'Orbitron', monospace", fontWeight: 700, fontSize: 12, color: f.color, letterSpacing: "0.1em", marginBottom: 10 }}>
                {f.title}
              </div>
              <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 13, color: B.smoke, lineHeight: 1.7 }}>
                {f.desc}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
