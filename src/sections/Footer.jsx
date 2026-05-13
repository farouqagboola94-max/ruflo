import { B } from '../tokens'
import { GrainOverlay } from '../components/Shared'

// ─── REPLACE WITH YOUR REAL LINKS ─────────────────────────────────────────
const SOCIAL_LINKS = {
  instagram: "https://instagram.com/sneakersfest",
  twitter:   "https://twitter.com/sneakersfest",
  youtube:   "https://youtube.com/@sneakersfest",
  snapchat:  "https://snapchat.com/add/sneakersfest",
  whatsapp:  "https://chat.whatsapp.com/YOUR_GROUP_LINK_HERE",
}
// ──────────────────────────────────────────────────────────────────────────

const SOCIALS = [
  { platform: "INSTAGRAM", handle: "@SNEAKERSFEST", href: SOCIAL_LINKS.instagram, color: B.neonMagenta, icon: "📸" },
  { platform: "TWITTER / X", handle: "@SNEAKERSFEST", href: SOCIAL_LINKS.twitter, color: B.neonCyan, icon: "✖" },
  { platform: "YOUTUBE", handle: "@SNEAKERSFEST", href: SOCIAL_LINKS.youtube, color: B.neonMagenta, icon: "▶" },
  { platform: "SNAPCHAT", handle: "SNEAKERSFEST", href: SOCIAL_LINKS.snapchat, color: B.amber, icon: "👻" },
  { platform: "WHATSAPP", handle: "JOIN COMMUNITY", href: SOCIAL_LINKS.whatsapp, color: B.neonLime, icon: "💬" },
]

const NAV = [
  ["About", "#about"],
  ["Community", "#community"],
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
      <div style={{
        position: "absolute", top: 0, left: 0, right: 0, height: 2,
        background: `linear-gradient(90deg, ${B.neonMagenta}, ${B.amber}, ${B.neonCyan}, ${B.neonLime})`,
      }} />

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
            <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 8, color: B.smoke, letterSpacing: "0.3em", marginBottom: 6 }}>
              THE SOLE EXHIBITION — LAGOS, NIGERIA
            </div>
            <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 7, color: B.neonCyan, letterSpacing: "0.25em", marginBottom: 18 }}>
              ONLINE COMMUNITY. PHYSICAL PRESENCE.
            </div>
            <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 13, color: B.smoke, lineHeight: 1.75, maxWidth: 300 }}>
              West Africa's premier sneaker culture community. We live online every day. We meet in Lagos on July 18, 2026.
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

          {/* Social platforms */}
          <div style={{ flex: "1 1 240px" }}>
            <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 8, color: B.neonCyan, letterSpacing: "0.3em", marginBottom: 18 }}>
              FOLLOW THE MOVEMENT
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {SOCIALS.map(s => (
                <a
                  key={s.platform}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: "flex", alignItems: "center", gap: 10,
                    padding: "8px 12px",
                    background: B.charcoal,
                    border: `1px solid ${B.gunmetal}`,
                    borderRadius: 3, textDecoration: "none",
                    transition: "all 0.25s",
                  }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = s.color + "70"; e.currentTarget.style.background = s.color + "10" }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = B.gunmetal; e.currentTarget.style.background = B.charcoal }}
                >
                  <span style={{ fontSize: 14 }}>{s.icon}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 7, color: s.color, letterSpacing: "0.15em" }}>
                      {s.platform}
                    </div>
                    <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 11, color: B.smoke, fontWeight: 700 }}>
                      {s.handle}
                    </div>
                  </div>
                  <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 9, color: s.color }}>→</span>
                </a>
              ))}
            </div>
          </div>

          {/* CTA block */}
          <div style={{ flex: "0 1 200px" }}>
            <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 8, color: B.neonCyan, letterSpacing: "0.3em", marginBottom: 18 }}>
              READY TO JOIN?
            </div>
            <a
              href="#tickets"
              style={{
                display: "block", padding: "15px 20px", background: B.amber, color: B.black,
                fontFamily: "'Space Mono', monospace", fontSize: 10, fontWeight: 700, letterSpacing: "0.15em",
                textDecoration: "none", borderRadius: 2, textAlign: "center",
                boxShadow: `0 0 25px ${B.amber}20`, marginBottom: 10,
              }}
            >
              GET TICKETS
            </a>
            <a
              href="#community"
              style={{
                display: "block", padding: "12px 20px",
                border: `1px solid ${B.neonLime}60`, color: B.neonLime,
                fontFamily: "'Space Mono', monospace", fontSize: 9, fontWeight: 700, letterSpacing: "0.15em",
                textDecoration: "none", borderRadius: 2, textAlign: "center",
              }}
            >
              JOIN COMMUNITY
            </a>
            <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 11, color: B.smoke, marginTop: 14, lineHeight: 1.65 }}>
              Online first. Lagos July 18. The community never sleeps.
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
          <span>ONLINE COMMUNITY. PHYSICAL PRESENCE. LAGOS NOIR.</span>
        </div>
      </div>
    </footer>
  )
}
