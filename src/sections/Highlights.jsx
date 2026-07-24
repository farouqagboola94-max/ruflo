import { B } from '../tokens'
import { GrainOverlay, AmberGlow, SectionTag } from '../components/Shared'
import Egg from '../components/Egg'

const FEATURES = [
  { label: '200+ GRAIL PAIRS', title: 'RARE KICKS', desc: 'Collectors from across Africa and beyond bring their grails. Cop, trade, or just soak in the heat — all under one roof.', color: B.amber },
  { label: '30+ CONFIRMED', title: 'CURATED VENDORS', desc: 'Invitation-only vendors: sneakers, apparel, customs, accessories, and food — handpicked for quality. No random stalls.', color: B.neonCyan },
  { label: 'LIVE SETS', title: 'DJ CULTURE', desc: 'Classified headliners and producer sets keep energy peaking from the moment doors open to the last drop of the night.', color: B.neonMagenta },
  { label: 'ON-SITE', title: 'CUSTOM ART', desc: 'Bring your blank pair and watch artists turn them into one-of-a-kind masterpieces in real time. Walkable, watchable, wearable.', color: B.neonLime },
  { label: 'ALL DAY', title: 'STREET FOOD', desc: "Suya, jollof, small chops, and more — Lagos' finest street food vendors run the food zone so you never have to leave.", color: B.amber },
  { label: 'VIP PRIORITY', title: 'EXCLUSIVE DROPS', desc: 'Limited-run releases you cannot buy online. VIP and VVIP holders get priority access. General tickets join the queue.', color: B.neonCyan },
]

export default function Highlights() {
  return (
    <section id="highlights" style={{
      position: "relative", overflow: "hidden",
      background: B.black, padding: "100px 24px",
    }}>
      <GrainOverlay />
      <Egg id="egg-017" corner="top-right" />
      <Egg id="egg-018" corner="bottom-left" />
      <AmberGlow top="30%" left="8%" size={380} />

      <div style={{
        position: "absolute", inset: 0, opacity: 0.02,
        backgroundImage: `linear-gradient(${B.white} 1px, transparent 1px), linear-gradient(90deg, ${B.white} 1px, transparent 1px)`,
        backgroundSize: "50px 50px",
      }} />

      <div style={{ position: "relative", zIndex: 10, maxWidth: 1100, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 64 }}>
          <SectionTag>WHAT TO EXPECT</SectionTag>
          <div className="reveal-3d text-3d" style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "clamp(40px, 6vw, 68px)", color: B.white, lineHeight: 0.9 }}>
            THE FULL<br /><span style={{ color: B.amber }}>EXPERIENCE</span>
          </div>
        </div>

        <div className="reveal-3d" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 14 }}>
          {FEATURES.map((f, i) => (
            <div
              key={i}
              className="reveal-3d"
              style={{
                padding: 28, background: B.charcoal,
                border: `1px solid ${B.gunmetal}`, borderRadius: 6,
                position: "relative", overflow: "hidden", transition: "border-color 0.3s, transform 0.3s",
              }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = f.color + "70"; e.currentTarget.style.transform = "translateY(-3px)" }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = B.gunmetal; e.currentTarget.style.transform = "translateY(0)" }}
            >
              <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg, ${f.color}, transparent)`, opacity: 0.5 }} />
              <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 7, color: f.color, letterSpacing: "0.2em", marginBottom: 10 }}>{f.label}</div>
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
