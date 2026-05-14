import { B } from '../tokens'
import { GrainOverlay, ScanLines, AmberGlow, SectionTag } from '../components/Shared'

// ─── REPLACE WITH YOUR REAL LINKS ─────────────────────────────────────────
const LINKS = {
  tiktok:   "https://tiktok.com/@sneakersfest",
  youtube:  "https://youtube.com/@sneakersfest",
  twitter:  "https://twitter.com/sneakersfest",
  snapchat: "https://snapchat.com/add/sneakersfest",
  whatsapp: "https://chat.whatsapp.com/YOUR_GROUP_LINK_HERE",
}
// ──────────────────────────────────────────────────────────────────────────

const PLATFORMS = [
  {
    name: "TIKTOK",
    handle: "@SNEAKERSFEST",
    color: "#69C9D0",
    href: LINKS.tiktok,
    icon: "TK",
    headline: "CHALLENGES & VIRAL CLIPS",
    desc: "Short-form culture. Daily challenges, sneaker reveals, community games, and viral moments you won’t see anywhere else.",
    tags: ["CHALLENGES", "GAMES", "VIRAL CLIPS", "COMMUNITY"],
    cta: "FOLLOW ON TIKTOK",
  },
  {
    name: "YOUTUBE",
    handle: "@SNEAKERSFEST",
    color: B.neonMagenta,
    href: LINKS.youtube,
    icon: "YT",
    headline: "DOCUMENTARIES & INTERVIEWS",
    desc: "Long-form content. Collector interviews, event documentaries, behind-the-scenes series, and exclusive deep dives into sneaker culture.",
    tags: ["DOCUMENTARIES", "INTERVIEWS", "EVENT RECAPS", "SERIES"],
    cta: "SUBSCRIBE",
    featured: true,
  },
  {
    name: "TWITTER / X",
    handle: "@SNEAKERSFEST",
    color: B.neonCyan,
    href: LINKS.twitter,
    icon: "X",
    headline: "LIVE UPDATES & DEBATES",
    desc: "Real-time culture. First-look announcements, community debates, giveaways, live event coverage, and Q&As with collectors.",
    tags: ["GIVEAWAYS", "LIVE UPDATES", "Q&A", "DEBATES"],
    cta: "FOLLOW ON X",
  },
  {
    name: "SNAPCHAT",
    handle: "SNEAKERSFEST",
    color: B.amber,
    href: LINKS.snapchat,
    icon: "SC",
    headline: "RAW STORIES & BTS",
    desc: "Unfiltered access. 24-hour stories from the ground, exclusive behind-the-scenes moments, and raw culture you won’t see on the feed.",
    tags: ["STORIES", "BEHIND THE SCENES", "EXCLUSIVE", "RAW"],
    cta: "ADD ON SNAPCHAT",
  },
  {
    name: "WHATSAPP COMMUNITY",
    handle: "JOIN THE INNER CIRCLE",
    color: B.neonLime,
    href: LINKS.whatsapp,
    icon: "WA",
    headline: "COMMUNITY GAMES & EARLY ACCESS",
    desc: "The inner circle. Direct drops, early alerts, community polls, exclusive games, group challenges, and conversations that don’t happen anywhere else.",
    tags: ["EARLY ACCESS", "COMMUNITY GAMES", "DIRECT DROPS", "INNER CIRCLE"],
    cta: "JOIN COMMUNITY",
    featured: true,
  },
]

function PlatformCard({ p }) {
  return (
    <a
      href={p.href}
      target="_blank"
      rel="noopener noreferrer"
      style={{ textDecoration: "none", display: "flex" }}
    >
      <div
        style={{
          flex: 1,
          padding: "28px 24px",
          background: p.featured
            ? `linear-gradient(145deg, ${p.color}10, ${B.charcoal})`
            : B.charcoal,
          border: `1px solid ${p.featured ? p.color + "60" : B.gunmetal}`,
          borderRadius: 6,
          position: "relative",
          overflow: "hidden",
          transition: "all 0.3s",
          display: "flex",
          flexDirection: "column",
          boxShadow: p.featured ? `0 0 40px ${p.color}10` : "none",
        }}
        onMouseEnter={e => {
          e.currentTarget.style.borderColor = p.color + "90"
          e.currentTarget.style.transform = "translateY(-4px)"
          e.currentTarget.style.boxShadow = `0 16px 48px ${p.color}18`
        }}
        onMouseLeave={e => {
          e.currentTarget.style.borderColor = p.featured ? p.color + "60" : B.gunmetal
          e.currentTarget.style.transform = "translateY(0)"
          e.currentTarget.style.boxShadow = p.featured ? `0 0 40px ${p.color}10` : "none"
        }}
      >
        {/* Top accent */}
        <div style={{
          position: "absolute", top: 0, left: 0, right: 0, height: 3,
          background: `linear-gradient(90deg, ${p.color}, ${p.color}20)`,
        }} />

        {/* Platform header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 18 }}>
          <div>
            <div style={{
              fontFamily: "'Orbitron', monospace", fontWeight: 900,
              fontSize: 12, color: p.color, letterSpacing: "0.12em", marginBottom: 3,
            }}>
              {p.name}
            </div>
            <div style={{
              fontFamily: "'Space Mono', monospace",
              fontSize: 8, color: B.smoke, letterSpacing: "0.15em",
            }}>
              {p.handle}
            </div>
          </div>
          <div style={{
            width: 38, height: 38,
            display: "flex", alignItems: "center", justifyContent: "center",
            border: `1px solid ${p.color}40`,
            borderRadius: 4,
            background: p.color + "12",
          }}>
            <span style={{
              fontFamily: "'Orbitron', monospace",
              fontSize: p.icon === "X" ? 13 : 9,
              fontWeight: 900, color: p.color,
            }}>{p.icon}</span>
          </div>
        </div>

        {/* Content type headline */}
        <div style={{
          fontFamily: "'Bebas Neue', sans-serif",
          fontSize: 18, color: B.white, lineHeight: 1, marginBottom: 10,
        }}>
          {p.headline}
        </div>

        {/* Description */}
        <div style={{
          fontFamily: "'Syne', sans-serif",
          fontSize: 12, color: B.smoke, lineHeight: 1.75, marginBottom: 18, flex: 1,
        }}>
          {p.desc}
        </div>

        {/* Content tags */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: 5, marginBottom: 18 }}>
          {p.tags.map((tag, i) => (
            <span key={i} style={{
              padding: "3px 8px",
              border: `1px solid ${p.color}35`,
              borderRadius: 2,
              fontFamily: "'Space Mono', monospace",
              fontSize: 6, color: p.color, letterSpacing: "0.12em",
            }}>
              {tag}
            </span>
          ))}
        </div>

        {/* CTA */}
        <div style={{
          display: "inline-flex", alignItems: "center", gap: 6,
          padding: "9px 18px",
          background: p.featured ? p.color : "transparent",
          border: `1px solid ${p.color}`,
          borderRadius: 2,
          fontFamily: "'Space Mono', monospace",
          fontSize: 8, fontWeight: 700,
          color: p.featured ? B.black : p.color,
          letterSpacing: "0.15em",
        }}>
          {p.cta} →
        </div>
      </div>
    </a>
  )
}

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

      <div style={{
        position: "absolute", top: 0, left: 44, bottom: 0, width: 1,
        background: `linear-gradient(${B.neonMagenta}00, ${B.neonMagenta}35, ${B.amber}25, ${B.neonCyan}00)`,
      }} />

      <div style={{ position: "relative", zIndex: 10, maxWidth: 1200, margin: "0 auto" }}>

        {/* Header */}
        <div style={{ marginBottom: 16 }}>
          <SectionTag>CONNECT EVERYWHERE</SectionTag>
          <div style={{
            fontFamily: "'Bebas Neue', sans-serif",
            fontSize: "clamp(40px, 6vw, 72px)",
            color: B.white, lineHeight: 0.88,
          }}>
            THE COMMUNITY<br />
            <span style={{ color: B.amber }}>LIVES ON EVERY PLATFORM</span>
          </div>
        </div>
        <div style={{
          fontFamily: "'Syne', sans-serif", fontSize: 15,
          color: B.smoke, lineHeight: 1.8, maxWidth: 640, marginBottom: 16,
        }}>
          One community, five platforms. Click any card to connect directly and become part of the movement —
          games, interviews, challenges, stories, and documentaries are waiting.
        </div>
        <div style={{
          fontFamily: "'Space Mono', monospace", fontSize: 9, color: B.neonCyan,
          letterSpacing: "0.35em", marginBottom: 52,
        }}>
          CLICK TO CONNECT · OPEN IN APP · JOIN THE MOVEMENT
        </div>

        {/* Platform grid: 3 top + 2 bottom centered */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 14, marginBottom: 14 }}>
          {PLATFORMS.slice(0, 3).map((p, i) => <PlatformCard key={i} p={p} />)}
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 14, marginBottom: 48 }}>
          {PLATFORMS.slice(3).map((p, i) => <PlatformCard key={i} p={p} />)}
        </div>

        {/* Manifesto banner */}
        <div style={{
          padding: "30px 32px",
          background: B.charcoal,
          border: `1px solid ${B.gunmetal}`,
          borderRadius: 6, position: "relative", overflow: "hidden",
        }}>
          <div style={{
            position: "absolute", bottom: 0, left: 0, right: 0, height: 2,
            background: `linear-gradient(90deg, ${'#69C9D0'}, ${B.neonMagenta}, ${B.neonCyan}, ${B.amber}, ${B.neonLime})`,
          }} />
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 20 }}>
            <div>
              <div style={{
                fontFamily: "'Bebas Neue', sans-serif", fontSize: 30,
                color: B.white, lineHeight: 1, marginBottom: 6,
              }}>
                CONTENT IS THE CULTURE.
              </div>
              <div style={{
                fontFamily: "'Space Mono', monospace", fontSize: 8,
                color: B.smoke, letterSpacing: "0.22em",
              }}>
                GAMES · INTERVIEWS · CHALLENGES · STORIES · DOCUMENTARIES · COMMUNITY
              </div>
            </div>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {[
                { label: "DAILY CONTENT", color: "#69C9D0" },
                { label: "5 PLATFORMS", color: B.amber },
                { label: "ONLINE FIRST", color: B.neonMagenta },
                { label: "YOUR IP", color: B.neonLime },
              ].map((tag, i) => (
                <span key={i} style={{
                  padding: "5px 12px",
                  border: `1px solid ${tag.color}40`,
                  borderRadius: 2,
                  fontFamily: "'Space Mono', monospace",
                  fontSize: 7, color: tag.color, letterSpacing: "0.15em",
                }}>
                  {tag.label}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
