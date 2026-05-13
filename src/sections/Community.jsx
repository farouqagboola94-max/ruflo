import { B } from '../tokens'
import { GrainOverlay, ScanLines, AmberGlow, SectionTag } from '../components/Shared'

// ─── REPLACE THESE WITH YOUR REAL LINKS ───────────────────────────────────
const LINKS = {
  instagram: "https://instagram.com/sneakersfest",
  twitter:   "https://twitter.com/sneakersfest",
  youtube:   "https://youtube.com/@sneakersfest",
  snapchat:  "https://snapchat.com/add/sneakersfest",
  whatsapp:  "https://chat.whatsapp.com/YOUR_GROUP_LINK_HERE",
}
// ──────────────────────────────────────────────────────────────────────────

const PLATFORMS = [
  {
    name: "INSTAGRAM",
    handle: "@SNEAKERSFEST",
    icon: "📸",
    color: B.neonMagenta,
    desc: "Daily drops, vendor spotlights, event BTS, and culture content. The visual bible of the movement.",
    cta: "FOLLOW",
    href: LINKS.instagram,
  },
  {
    name: "TWITTER / X",
    handle: "@SNEAKERSFEST",
    icon: "✖",
    color: B.neonCyan,
    desc: "Hot takes, real-time updates, community debates, and first-look announcements.",
    cta: "FOLLOW",
    href: LINKS.twitter,
  },
  {
    name: "YOUTUBE",
    handle: "@SNEAKERSFEST",
    icon: "▶",
    color: B.neonMagenta,
    desc: "Long-form content, event recaps, collector interviews, and exclusive behind-the-scenes reveals.",
    cta: "SUBSCRIBE",
    href: LINKS.youtube,
  },
  {
    name: "SNAPCHAT",
    handle: "SNEAKERSFEST",
    icon: "👻",
    color: B.amber,
    desc: "Raw, unfiltered moments. 24-hour stories. The side of the culture the feed won't show you.",
    cta: "ADD US",
    href: LINKS.snapchat,
  },
  {
    name: "WHATSAPP COMMUNITY",
    handle: "JOIN THE INNER CIRCLE",
    icon: "💬",
    color: B.neonLime,
    desc: "Direct access. Early drop alerts. Exclusive deals. The inner circle of Sneakers Fest — no filter, no delay.",
    cta: "JOIN NOW",
    href: LINKS.whatsapp,
    featured: true,
  },
]

export default function Community() {
  return (
    <section id="community" style={{
      position: "relative", overflow: "hidden",
      background: B.void, padding: "100px 24px",
    }}>
      <GrainOverlay />
      <ScanLines opacity={0.04} />
      <AmberGlow top="65%" left="88%" size={420} />
      <AmberGlow top="15%" left="2%" size={300} />

      {/* Vertical neon strip */}
      <div style={{
        position: "absolute", top: 0, left: 40, bottom: 0, width: 1,
        background: `linear-gradient(${B.neonMagenta}00, ${B.neonMagenta}40, ${B.amber}30, ${B.neonCyan}00)`,
      }} />

      <div style={{ position: "relative", zIndex: 10, maxWidth: 1100, margin: "0 auto" }}>

        {/* Header */}
        <div style={{ marginBottom: 12 }}>
          <SectionTag>ONLINE COMMUNITY</SectionTag>
          <div style={{
            fontFamily: "'Bebas Neue', sans-serif",
            fontSize: "clamp(40px, 6vw, 72px)",
            color: B.white, lineHeight: 0.88,
          }}>
            THE MOVEMENT<br />
            <span style={{ color: B.amber }}>NEVER STOPS</span>
          </div>
        </div>

        <div style={{
          fontFamily: "'Syne', sans-serif", fontSize: 15, color: B.smoke,
          lineHeight: 1.8, maxWidth: 620, marginBottom: 16,
        }}>
          Sneakers Fest isn't just an event — it's a living, breathing online community
          with a physical heartbeat. We live on every platform, every day.
        </div>
        <div style={{
          fontFamily: "'Space Mono', monospace", fontSize: 9, color: B.neonCyan,
          letterSpacing: "0.35em", marginBottom: 52,
        }}>
          ONLINE COMMUNITY. PHYSICAL PRESENCE. DAILY CONTENT.
        </div>

        {/* Platform cards */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))", gap: 14, marginBottom: 48 }}>
          {PLATFORMS.map((p, i) => (
            <a
              key={i}
              href={p.href}
              target="_blank"
              rel="noopener noreferrer"
              style={{ textDecoration: "none", display: "flex" }}
            >
              <div
                style={{
                  flex: 1, padding: "24px 20px",
                  background: p.featured
                    ? `linear-gradient(160deg, ${p.color}12, ${B.charcoal})`
                    : B.charcoal,
                  border: `1px solid ${p.featured ? p.color + "60" : B.gunmetal}`,
                  borderRadius: 6, position: "relative", overflow: "hidden",
                  transition: "all 0.3s",
                  boxShadow: p.featured ? `0 0 35px ${p.color}12` : "none",
                  display: "flex", flexDirection: "column",
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.borderColor = p.color + "90"
                  e.currentTarget.style.transform = "translateY(-4px)"
                  e.currentTarget.style.boxShadow = `0 12px 40px ${p.color}18`
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.borderColor = p.featured ? p.color + "60" : B.gunmetal
                  e.currentTarget.style.transform = "translateY(0)"
                  e.currentTarget.style.boxShadow = p.featured ? `0 0 35px ${p.color}12` : "none"
                }}
              >
                {/* Top accent line */}
                <div style={{
                  position: "absolute", top: 0, left: 0, right: 0, height: 2,
                  background: `linear-gradient(90deg, ${p.color}, transparent)`,
                }} />

                <div style={{ fontSize: 30, marginBottom: 14 }}>{p.icon}</div>
                <div style={{
                  fontFamily: "'Orbitron', monospace", fontWeight: 700,
                  fontSize: 11, color: p.color, letterSpacing: "0.1em", marginBottom: 4,
                }}>
                  {p.name}
                </div>
                <div style={{
                  fontFamily: "'Space Mono', monospace", fontSize: 8,
                  color: B.smoke, letterSpacing: "0.15em", marginBottom: 14,
                }}>
                  {p.handle}
                </div>
                <div style={{
                  fontFamily: "'Syne', sans-serif", fontSize: 12,
                  color: B.smoke, lineHeight: 1.7, marginBottom: 20, flex: 1,
                }}>
                  {p.desc}
                </div>
                <div style={{
                  display: "inline-block", padding: "7px 16px",
                  background: p.featured ? p.color : "transparent",
                  border: `1px solid ${p.color}`,
                  borderRadius: 2,
                  fontFamily: "'Space Mono', monospace", fontSize: 8, fontWeight: 700,
                  color: p.featured ? B.black : p.color,
                  letterSpacing: "0.15em",
                }}>
                  {p.cta} →
                </div>
              </div>
            </a>
          ))}
        </div>

        {/* Bottom manifesto strip */}
        <div style={{
          padding: "28px 32px",
          background: B.charcoal,
          border: `1px solid ${B.gunmetal}`,
          borderRadius: 6,
          display: "flex", justifyContent: "space-between", alignItems: "center",
          flexWrap: "wrap", gap: 20,
        }}>
          <div>
            <div style={{
              fontFamily: "'Bebas Neue', sans-serif", fontSize: 30,
              color: B.white, lineHeight: 1,
            }}>
              CONTENT IS THE CULTURE.
            </div>
            <div style={{
              fontFamily: "'Space Mono', monospace", fontSize: 8,
              color: B.smoke, letterSpacing: "0.22em", marginTop: 8,
            }}>
              WE CREATE DAILY. FOLLOW EVERYWHERE. MISS NOTHING.
            </div>
          </div>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {[
              { label: "DAILY CONTENT", color: B.neonCyan },
              { label: "COMMUNITY FIRST", color: B.amber },
              { label: "PHYSICAL × DIGITAL", color: B.neonMagenta },
              { label: "YOUR IP", color: B.neonLime },
            ].map((tag, i) => (
              <span key={i} style={{
                padding: "5px 12px",
                border: `1px solid ${tag.color}40`,
                borderRadius: 2,
                fontFamily: "'Space Mono', monospace", fontSize: 7,
                color: tag.color, letterSpacing: "0.15em",
              }}>
                {tag.label}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
