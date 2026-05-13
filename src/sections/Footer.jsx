import { B } from '../tokens'
import { GrainOverlay } from '../components/Shared'

const SOCIALS = [
  { platform: "INSTAGRAM", handle: "@SNEAKERSFEST" },
  { platform: "TWITTER / X", handle: "@SNEAKERSFEST" },
  { platform: "TIKTOK", handle: "@SNEAKERSFEST" },
]

const NAV = [
  ["About", "#about"],
  ["Highlights", "#highlights"],
  ["Lineup", "#lineup"],
  ["Tickets", "#tickets"],
  ["FAQ", "#faq"],
]

export default function Footer() {
  return (
    <footer style={{
      position: "relative", overflow: "hidden",
      background: B.black, borderTop: `1px solid ${B.gunmetal}`,
      padding: "64px 24px 28px",
    }}>
      <GrainOverlay />

      {/* Top gradient line */}
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg, ${B.neonMagenta}, ${B.amber}, ${B.neonCyan})` }} />

      <div style={{ position: "relative", zIndex: 10, maxWidth: 1100, margin: "0 auto" }}>
        <div style={{ display: "flex", gap: 60, flexWrap: "wrap", marginBottom: 52 }}>
          {/* Brand block */}
          <div style={{ flex: "1 1 280px" }}>
            <div style={{
              fontFamily: "'Orbitron', monospace", fontWeight: 900, fontSize: 20, color: B.amber,
              textShadow: `0 0 15px ${B.amber}30`, marginBottom: 6,
            }}>
              SNEAKERS FEST '26
            </div>
            <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 8, color: B.smoke, letterSpacing: "0.3em", marginBottom: 18 }}>
              THE SOLE EXHIBITION — LAGOS, NIGERIA
            </div>
            <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 13, color: B.smoke, lineHeight: 1.75, maxWidth: 300 }}>
              West Africa's premier sneaker culture event. Where sole meets soul. Eko Atlantic, Lagos — July 18, 2026.
            </div>
          </div>

          {/* Quick links */}
          <div style={{ flex: "0 1 160px" }}>
            <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 8, color: B.neonCyan, letterSpacing: "0.3em", marginBottom: 18 }}>
              NAVIGATE
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {NAV.map(([label, href]) => (
                <a
                  key={label}
                  href={href}
                  style={{ fontFamily: "'Syne', sans-serif", fontSize: 13, color: B.smoke, textDecoration: "none", transition: "color 0.2s" }}
                  onMouseEnter={e => e.target.style.color = B.amber}
                  onMouseLeave={e => e.target.style.color = B.smoke}
                >
                  {label}
                </a>
              ))}
            </div>
          </div>

          {/* Socials */}
          <div style={{ flex: "0 1 200px" }}>
            <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 8, color: B.neonCyan, letterSpacing: "0.3em", marginBottom: 18 }}>
              FOLLOW US
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {SOCIALS.map(s => (
                <div key={s.platform}>
                  <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 7, color: B.gunmetal, letterSpacing: "0.15em", marginBottom: 2 }}>
                    {s.platform}
                  </div>
                  <a
                    href="#"
                    style={{ fontFamily: "'Syne', sans-serif", fontSize: 14, color: B.smoke, textDecoration: "none", fontWeight: 700, transition: "color 0.2s" }}
                    onMouseEnter={e => e.target.style.color = B.amber}
                    onMouseLeave={e => e.target.style.color = B.smoke}
                  >
                    {s.handle}
                  </a>
                </div>
              ))}
            </div>
          </div>

          {/* CTA block */}
          <div style={{ flex: "0 1 220px" }}>
            <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 8, color: B.neonCyan, letterSpacing: "0.3em", marginBottom: 18 }}>
              READY TO JOIN?
            </div>
            <a
              href="#tickets"
              style={{
                display: "block", padding: "15px 20px", background: B.amber, color: B.black,
                fontFamily: "'Space Mono', monospace", fontSize: 10, fontWeight: 700, letterSpacing: "0.15em",
                textDecoration: "none", borderRadius: 2, textAlign: "center",
                boxShadow: `0 0 25px ${B.amber}20`,
              }}
            >
              GET TICKETS
            </a>
            <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 12, color: B.smoke, marginTop: 14, lineHeight: 1.65 }}>
              Early bird prices end soon. Join 10,000+ attendees at the biggest sneaker event in West Africa.
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div style={{
          borderTop: `1px solid ${B.gunmetal}`, paddingTop: 20,
          display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 8,
          fontFamily: "'Space Mono', monospace", fontSize: 7, color: B.smoke, letterSpacing: "0.2em",
        }}>
          <span>© 2026 SNEAKERS FEST. ALL RIGHTS RESERVED.</span>
          <span>AESTHETIC: LAGOS NOIR — CULTURE × SOLE × FUTURE</span>
        </div>
      </div>
    </footer>
  )
}
