import { B } from '../tokens'
import { GrainOverlay, AmberGlow, SectionTag } from '../components/Shared'

const LINEUP = [
  { name: "DJ SPINALL", role: "HEADLINER", time: "8PM — 10PM", genre: "AFROBEATS / HIP-HOP", featured: true },
  { name: "ODUNSI (THE ENGINE)", role: "SPECIAL GUEST", time: "6PM — 8PM", genre: "ALT-R&B / ELECTRONIC" },
  { name: "SARZ", role: "PRODUCER SET", time: "4PM — 6PM", genre: "STREET / TRAP / AFRO" },
  { name: "DJ CONSEQUENCE", role: "OPENING ACT", time: "2PM — 4PM", genre: "AFRO HOUSE / ELECTRONIC" },
  { name: "DJ NEPTUNE", role: "SPECIAL GUEST", time: "12PM — 2PM", genre: "AFROBEATS / STREET POP" },
  { name: "+ MORE TBA", role: "SURPRISE GUESTS", time: "THROUGHOUT", genre: "CULTURE × SOUL × FUTURE" },
]

export default function Lineup() {
  return (
    <section id="lineup" style={{
      position: "relative", overflow: "hidden",
      background: B.void, padding: "100px 24px",
    }}>
      <GrainOverlay />
      <AmberGlow top="20%" left="85%" size={350} />

      <div style={{
        position: "absolute", top: "30%", left: "-5%", width: "110%", height: 1,
        background: `linear-gradient(90deg, transparent, ${B.neonMagenta}25, transparent)`,
        transform: "rotate(-2deg)",
      }} />

      <div style={{ position: "relative", zIndex: 10, maxWidth: 1100, margin: "0 auto" }}>
        <div style={{ marginBottom: 56 }}>
          <SectionTag>MUSIC × CULTURE</SectionTag>
          <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "clamp(40px, 6vw, 68px)", color: B.white, lineHeight: 0.9 }}>
            THE<br /><span style={{ color: B.neonMagenta }}>LINEUP</span>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
          {LINEUP.map((act, i) => (
            <div
              key={i}
              style={{
                display: "flex", alignItems: "center", gap: 20, padding: "20px 24px",
                background: act.featured ? `${B.neonMagenta}08` : i % 2 === 0 ? B.charcoal : "transparent",
                border: `1px solid ${act.featured ? B.neonMagenta + "50" : B.gunmetal}`,
                borderRadius: 4, position: "relative", overflow: "hidden", transition: "all 0.3s",
              }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = B.neonMagenta + "60"; e.currentTarget.style.background = `${B.neonMagenta}10` }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = act.featured ? B.neonMagenta + "50" : B.gunmetal; e.currentTarget.style.background = act.featured ? `${B.neonMagenta}08` : i % 2 === 0 ? B.charcoal : "transparent" }}
            >
              {act.featured && <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 3, background: B.neonMagenta }} />}
              <div style={{
                width: 42, height: 42, borderRadius: "50%",
                border: `1px solid ${act.featured ? B.neonMagenta + "60" : B.gunmetal}`,
                background: B.void, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
              }}>
                <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 10, color: act.featured ? B.neonMagenta : B.smoke }}>
                  {String(i + 1).padStart(2, '0')}
                </span>
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 22, color: B.white, lineHeight: 1 }}>
                  {act.name}
                </div>
                <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 7, color: B.smoke, letterSpacing: "0.15em", marginTop: 3 }}>
                  {act.genre}
                </div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{
                  display: "inline-block", padding: "3px 10px", borderRadius: 2, marginBottom: 5,
                  background: act.featured ? B.neonMagenta + "20" : "transparent",
                  border: `1px solid ${act.featured ? B.neonMagenta + "60" : B.gunmetal}`,
                  fontFamily: "'Space Mono', monospace", fontSize: 7,
                  color: act.featured ? B.neonMagenta : B.smoke, letterSpacing: "0.1em",
                }}>
                  {act.role}
                </div>
                <div style={{ fontFamily: "'Orbitron', monospace", fontSize: 11, fontWeight: 700, color: B.amber, display: "block" }}>
                  {act.time}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div style={{ marginTop: 28, textAlign: "center", fontFamily: "'Space Mono', monospace", fontSize: 9, color: B.smoke, letterSpacing: "0.3em" }}>
          FULL SCHEDULE ANNOUNCED 60 DAYS BEFORE THE EVENT
        </div>
      </div>
    </section>
  )
}
