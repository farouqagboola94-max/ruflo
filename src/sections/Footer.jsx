import { B } from '../tokens'
import { GrainOverlay } from '../components/Shared'

// ─── REPLACE WITH YOUR REAL LINKS ─────────────────────────────────────────
const SOCIAL_LINKS = {
  tiktok:    "https://tiktok.com/@sneakersfest",
  youtube:   "https://youtube.com/@sneakersfest",
  twitter:   "https://twitter.com/sneakersfest",
  instagram: "https://instagram.com/sneakersfest",
  snapchat:  "https://snapchat.com/add/sneakersfest",
  whatsapp:  "https://chat.whatsapp.com/YOUR_GROUP_LINK_HERE",
}
// ──────────────────────────────────────────────────────────────────────────

const SOCIALS = [
  { platform: "TIKTOK",      handle: "@SNEAKERSFEST",   href: SOCIAL_LINKS.tiktok,     color: "#69C9D0",     icon: "TK", tip: "Challenges & Clips" },
  { platform: "YOUTUBE",     handle: "@SNEAKERSFEST",   href: SOCIAL_LINKS.youtube,    color: B.neonMagenta, icon: "YT", tip: "Docs & Interviews" },
  { platform: "TWITTER / X", handle: "@SNEAKERSFEST",   href: SOCIAL_LINKS.twitter,    color: B.neonCyan,    icon: "X",  tip: "Live Updates" },
  { platform: "INSTAGRAM",   handle: "@SNEAKERSFEST",   href: SOCIAL_LINKS.instagram,  color: "#E1306C",     icon: "IG", tip: "Drops & Culture" },
  { platform: "SNAPCHAT",    handle: "SNEAKERSFEST",    href: SOCIAL_LINKS.snapchat,   color: B.amber,       icon: "SC", tip: "Stories & BTS" },
  { platform: "WHATSAPP",    handle: "JOIN COMMUNITY",  href: SOCIAL_LINKS.whatsapp,   color: B.neonLime,    icon: "WA", tip: "Inner Circle" },
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

      <div style={{
        position: "absolute", top: 0, left: 0, right: 0, height: 3,
        background: `linear-gradient(90deg, ${'#69C9D0'}, ${B.neonMagenta}, ${'#E1306C'}, ${B.neonCyan}, ${B.amber}, ${B.neonLime})`,
      }} />

      <div style={{ position: "relative", zIndex: 10, maxWidth: 1100, margin: "0 auto" }}>
        <div style={{ display: "flex", gap: 60, flexWrap: "wrap", marginBottom: 52 }}>

          {/* Brand */}
          <div style={{ flex: "1 1 260px" }}>
            <div style={{
              fontFamily: "'Orbitron', monospace", fontWeight: 900, fontSize: 20, color: B.amber,
              textShadow: `0 0 15px ${B.amber}30`, marginBottom: 6,
            }}>SNEAKERS FEST '26</div>
            <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 8, color: B.smoke, letterSpacing: "0.3em", marginBottom: 6 }}>
              THE SOLE EXHIBITION — LAGOS, NIGERIA
            </div>
            <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 7, color: B.neonCyan, letterSpacing: "0.25em", marginBottom: 18 }}>
              ONLINE COMMUNITY. PHYSICAL PRESENCE.
            </div>
            <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 13, color: B.smoke, lineHeight: 1.75, maxWidth: 280 }}>
              West Africa's premier sneaker culture community. Online every day. In person July 18, 2026.
            </div>
          </div>

          {/* Navigate */}
          <div style={{ flex: "0 1 140px" }}>
            <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 8, color: B.neonCyan, letterSpacing: "0.3em", marginBottom: 18 }}>
              NAVIGATE
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {NAV.map(([label, href]) => (
                <a key={label} href={href}
                  style={{ fontFamily: "'Syne', sans-serif", fontSize: 13, color: B.smoke, textDecoration: "none", transition: "color 0.2s" }}
                  onMouseEnter={e => e.target.style.color = B.amber}
                  onMouseLeave={e => e.target.style.color = B.smoke}
                >{label}</a>
              ))}
            </div>
          </div>

          {/* Social platforms */}
          <div style={{ flex: "1 1 280px" }}>
            <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 8, color: B.neonCyan, letterSpacing: "0.3em", marginBottom: 18 }}>
              CONNECT ON EVERY PLATFORM
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {SOCIALS.map(s => (
                <a
                  key={s.platform}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: "flex", alignItems: "center", gap: 12,
                    padding: "10px 14px",
                    background: B.charcoal,
                    border: `1px solid ${B.gunmetal}`,
                    borderRadius: 4, textDecoration: "none",
                    transition: "all 0.25s",
                  }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = s.color + "70"; e.currentTarget.style.background = s.color + "12" }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = B.gunmetal; e.currentTarget.style.background = B.charcoal }}
                >
                  <div style={{
                    width: 32, height: 32, display: "flex", alignItems: "center", justifyContent: "center",
                    border: `1px solid ${s.color}40`, borderRadius: 3, background: s.color + "12", flexShrink: 0,
                  }}>
                    <span style={{ fontFamily: "'Orbitron', monospace", fontSize: s.icon === "X" ? 11 : 8, fontWeight: 900, color: s.color }}>
                      {s.icon}
                    </span>
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 7, color: s.color, letterSpacing: "0.12em" }}>
                      {s.platform}
                    </div>
                    <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 11, color: B.smoke }}>
                      {s.handle} · {s.tip}
                    </div>
                  </div>
                  <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 10, color: s.color + "80" }}>→</span>
                </a>
              ))}
            </div>
          </div>

          {/* CTA */}
          <div style={{ flex: "0 1 190px" }}>
            <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 8, color: B.neonCyan, letterSpacing: "0.3em", marginBottom: 18 }}>
              JOIN NOW
            </div>
            <a href="#tickets" style={{
              display: "block", padding: "14px 20px", background: B.amber, color: B.black,
              fontFamily: "'Space Mono', monospace", fontSize: 9, fontWeight: 700, letterSpacing: "0.15em",
              textDecoration: "none", borderRadius: 2, textAlign: "center",
              boxShadow: `0 0 25px ${B.amber}20`, marginBottom: 8,
            }}>GET TICKETS</a>
            <a href="#community" style={{
              display: "block", padding: "11px 20px",
              border: `1px solid ${B.neonLime}50`, color: B.neonLime,
              fontFamily: "'Space Mono', monospace", fontSize: 9, fontWeight: 700, letterSpacing: "0.15em",
              textDecoration: "none", borderRadius: 2, textAlign: "center", marginBottom: 16,
            }}>JOIN COMMUNITY</a>
            <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 11, color: B.smoke, lineHeight: 1.7 }}>
              Online first. Lagos July 18. Six platforms. One community.
            </div>
          </div>
        </div>

        <div style={{
          borderTop: `1px solid ${B.gunmetal}`, paddingTop: 20,
          display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 8,
          fontFamily: "'Space Mono', monospace", fontSize: 7, color: B.smoke, letterSpacing: "0.18em",
        }}>
          <span>© 2026 SNEAKERS FEST. ALL RIGHTS RESERVED.</span>
          <span>ONLINE COMMUNITY. PHYSICAL PRESENCE. LAGOS NOIR.</span>
        </div>
      </div>
    </footer>
  )
}
