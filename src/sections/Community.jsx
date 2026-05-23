import { B } from '../tokens'
import { GrainOverlay, ScanLines, SectionTag } from '../components/Shared'
import { SOCIAL_LINKS } from '../config'

const LINKS = {
  tiktok:    SOCIAL_LINKS.tiktok,
  youtube:   SOCIAL_LINKS.youtube,
  twitter:   SOCIAL_LINKS.twitter,
  instagram: SOCIAL_LINKS.instagram,
  snapchat:  SOCIAL_LINKS.snapchat,
  whatsapp:  SOCIAL_LINKS.whatsapp,
}

const COMMUNITY_STATS = [
  { value: "5,000+", label: "COMMUNITY TARGET" },
  { value: "6",     label: "ACTIVE PLATFORMS" },
  { value: "365",   label: "DAYS A YEAR" },
  { value: "LIVE",  label: "RIGHT NOW", pulse: true },
]

const PLATFORMS = [
  {
    name: "TIKTOK",
    handle: "@SNEAKERSFEST",
    color: "#69C9D0",
    href: LINKS.tiktok,
    icon: "TK",
    headline: "CHALLENGES & VIRAL CLIPS",
    desc: "Daily challenges, sneaker reveals, community games, and viral moments.",
    tags: ["CHALLENGES", "GAMES", "VIRAL", "COMMUNITY"],
    cta: "FOLLOW",
    activity: "2-3x per week",
  },
  {
    name: "YOUTUBE",
    handle: "@SNEAKERSFEST",
    color: B.neonMagenta,
    href: LINKS.youtube,
    icon: "YT",
    headline: "DOCUMENTARIES & INTERVIEWS",
    desc: "Collector interviews, event documentaries, behind-the-scenes series.",
    tags: ["DOCS", "INTERVIEWS", "SERIES"],
    cta: "SUBSCRIBE",
    featured: true,
    activity: "Monthly drops",
  },
  {
    name: "TWITTER / X",
    handle: "@Catalyst188",
    color: B.neonCyan,
    href: LINKS.twitter,
    icon: "X",
    headline: "LIVE UPDATES & DEBATES",
    desc: "First-look announcements, community debates, giveaways, FNP live sessions.",
    tags: ["LIVE", "GIVEAWAYS", "Q&A", "FNP"],
    cta: "FOLLOW",
    activity: "Daily posts",
  },
  {
    name: "INSTAGRAM",
    handle: "@SNEAKERSFEST",
    color: "#E1306C",
    href: LINKS.instagram,
    icon: "IG",
    headline: "DROPS, REELS & CULTURE",
    desc: "Daily drops, vendor spotlights, event reels, FNP polls and challenge submissions.",
    tags: ["REELS", "DROPS", "CULTURE", "FNP"],
    cta: "FOLLOW",
    activity: "3-4x per week",
  },
  {
    name: "SNAPCHAT",
    handle: "SNEAKERSFEST",
    color: B.amber,
    href: LINKS.snapchat,
    icon: "SC",
    headline: "RAW STORIES & BTS",
    desc: "24-hour stories, exclusive behind-the-scenes, unfiltered culture.",
    tags: ["STORIES", "BTS", "RAW"],
    cta: "ADD US",
    activity: "24hr stories",
  },
  {
    name: "WHATSAPP",
    handle: "JOIN THE INNER CIRCLE",
    color: B.neonLime,
    href: LINKS.whatsapp,
    icon: "WA",
    headline: "FNP ALERTS & EARLY ACCESS",
    desc: "Friday Night Protocol reminders, drop alerts, exclusive info, community polls for the inner circle.",
    tags: ["EARLY ACCESS", "FNP", "ALERTS", "DIRECT"],
    cta: "JOIN NOW",
    featured: true,
    activity: "Active now",
    pulse: true,
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
          background: p.featured
            ? `rgba(255,255,255,0.08)`
            : `rgba(255,255,255,0.04)`,
          backdropFilter: "blur(16px) saturate(160%)",
          WebkitBackdropFilter: "blur(16px) saturate(160%)",
          border: `1px solid ${p.featured ? p.color + "60" : "rgba(255,255,255,0.09)"}`,
          borderRadius: 10,
          position: "relative", overflow: "hidden",
          transition: "all 0.3s", display: "flex", flexDirection: "column",
          boxShadow: p.featured
            ? `0 8px 32px rgba(0,0,0,0.5), 0 0 0 1px ${p.color}15, inset 0 1px 0 rgba(255,255,255,0.10)`
            : `0 4px 24px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.06)`,
        }}
        onMouseEnter={e => {
          e.currentTarget.style.background = `rgba(255,255,255,0.10)`
          e.currentTarget.style.borderColor = p.color + "80"
          e.currentTarget.style.transform = "translateY(-5px)"
          e.currentTarget.style.boxShadow = `0 20px 48px rgba(0,0,0,0.55), 0 0 30px ${p.color}15, inset 0 1px 0 rgba(255,255,255,0.14)`
        }}
        onMouseLeave={e => {
          e.currentTarget.style.background = p.featured ? `rgba(255,255,255,0.08)` : `rgba(255,255,255,0.04)`
          e.currentTarget.style.borderColor = p.featured ? p.color + "60" : "rgba(255,255,255,0.09)"
          e.currentTarget.style.transform = "translateY(0)"
          e.currentTarget.style.boxShadow = p.featured
            ? `0 8px 32px rgba(0,0,0,0.5), 0 0 0 1px ${p.color}15, inset 0 1px 0 rgba(255,255,255,0.10)`
            : `0 4px 24px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.06)`
        }}
      >
        <div style={{
          position: "absolute", top: 0, left: 0, right: 0, height: 1,
          background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)",
        }} />
        <div style={{ height: 3, background: `linear-gradient(90deg, ${p.color}, ${p.color}20)` }} />

        <div style={{ padding: "22px 20px", display: "flex", flexDirection: "column", flex: 1 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14 }}>
            <div>
              <div style={{ fontFamily: "'Orbitron', monospace", fontWeight: 900, fontSize: 11, color: p.color, letterSpacing: "0.12em", marginBottom: 3 }}>
                {p.name}
              </div>
              <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 7, color: B.smoke, letterSpacing: "0.15em" }}>
                {p.handle}
              </div>
            </div>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 6 }}>
              <div style={{
                width: 34, height: 34, display: "flex", alignItems: "center", justifyContent: "center",
                background: p.color + "15",
                border: `1px solid ${p.color}35`, borderRadius: 4,
              }}>
                <span style={{ fontFamily: "'Orbitron', monospace", fontSize: p.icon === "X" ? 12 : 8, fontWeight: 900, color: p.color }}>
                  {p.icon}
                </span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                <div style={{
                  width: 5, height: 5, borderRadius: "50%",
                  background: p.pulse ? B.neonLime : p.color,
                  boxShadow: p.pulse ? `0 0 6px ${B.neonLime}` : "none",
                  animation: p.pulse ? "pulse 1.5s infinite" : "none",
                }} />
                <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 6, color: B.smoke, letterSpacing: "0.1em" }}>
                  {p.activity}
                </span>
              </div>
            </div>
          </div>

          <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 17, color: B.white, lineHeight: 1, marginBottom: 8 }}>
            {p.headline}
          </div>
          <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 12, color: B.smoke, lineHeight: 1.7, marginBottom: 16, flex: 1 }}>
            {p.desc}
          </div>

          <div style={{ display: "flex", flexWrap: "wrap", gap: 4, marginBottom: 16 }}>
            {p.tags.map((tag, i) => (
              <span key={i} style={{
                padding: "2px 7px",
                background: p.color + "12",
                border: `1px solid ${p.color}30`,
                borderRadius: 2,
                fontFamily: "'Space Mono', monospace", fontSize: 6, color: p.color, letterSpacing: "0.12em",
              }}>{tag}</span>
            ))}
          </div>

          <div style={{
            display: "inline-flex", alignItems: "center", gap: 6,
            padding: "8px 16px",
            background: p.featured ? p.color : "rgba(255,255,255,0.06)",
            backdropFilter: p.featured ? "none" : "blur(8px)",
            WebkitBackdropFilter: p.featured ? "none" : "blur(8px)",
            border: `1px solid ${p.featured ? "transparent" : p.color + "50"}`,
            borderRadius: 4,
            fontFamily: "'Space Mono', monospace", fontSize: 8, fontWeight: 700,
            color: p.featured ? B.black : p.color,
            letterSpacing: "0.15em",
            boxShadow: p.featured ? `0 0 20px ${p.color}30` : "none",
          }}>
            {p.cta} →
          </div>
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

      <div style={{
        position: "absolute", top: "20%", left: "5%", width: 300, height: 300,
        background: `radial-gradient(circle, ${B.neonMagenta}08, transparent 70%)`,
        filter: "blur(60px)", pointerEvents: "none",
      }} />
      <div style={{
        position: "absolute", bottom: "20%", right: "5%", width: 350, height: 350,
        background: `radial-gradient(circle, ${B.amber}08, transparent 70%)`,
        filter: "blur(60px)", pointerEvents: "none",
      }} />

      <div style={{ position: "relative", zIndex: 10, maxWidth: 1200, margin: "0 auto" }}>

        <div style={{ marginBottom: 16 }}>
          <SectionTag>CONNECT EVERYWHERE</SectionTag>
          <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "clamp(40px, 6vw, 72px)", color: B.white, lineHeight: 0.88 }}>
            THE COMMUNITY<br />
            <span style={{ color: B.amber }}>LIVES ON EVERY PLATFORM</span>
          </div>
        </div>

        <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 15, color: B.smoke, lineHeight: 1.8, maxWidth: 600, marginBottom: 36 }}>
          One community, six platforms. Every Friday night the community activates via the Friday Night Protocol.
          Join whichever platform fits your flow — games, drops, culture debates, and early access are waiting.
        </div>

        <div style={{
          display: "flex", gap: 2, flexWrap: "wrap", marginBottom: 52,
          background: "rgba(255,255,255,0.04)",
          backdropFilter: "blur(16px)",
          WebkitBackdropFilter: "blur(16px)",
          border: "1px solid rgba(255,255,255,0.08)",
          borderRadius: 8, overflow: "hidden",
          boxShadow: "inset 0 1px 0 rgba(255,255,255,0.08)",
        }}>
          {COMMUNITY_STATS.map((s, i) => (
            <div key={i} style={{
              flex: "1 1 120px", padding: "16px 20px",
              borderRight: i < COMMUNITY_STATS.length - 1 ? "1px solid rgba(255,255,255,0.06)" : "none",
              display: "flex", flexDirection: "column", alignItems: "center",
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                {s.pulse && <div style={{ width: 6, height: 6, borderRadius: "50%", background: B.neonLime, boxShadow: `0 0 8px ${B.neonLime}`, animation: "pulse 1.5s infinite" }} />}
                <div style={{ fontFamily: "'Orbitron', monospace", fontWeight: 900, fontSize: 22, color: s.pulse ? B.neonLime : B.amber,
                  textShadow: `0 0 15px ${s.pulse ? B.neonLime : B.amber}40`,
                }}>{s.value}</div>
              </div>
              <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 7, color: B.smoke, letterSpacing: "0.15em", marginTop: 4 }}>
                {s.label}
              </div>
            </div>
          ))}
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 14, marginBottom: 40 }}>
          {PLATFORMS.map((p, i) => <PlatformCard key={i} p={p} />)}
        </div>

        <div style={{
          padding: "28px 32px",
          background: "rgba(255,255,255,0.04)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          border: "1px solid rgba(255,255,255,0.08)",
          borderRadius: 8, position: "relative", overflow: "hidden",
          boxShadow: "inset 0 1px 0 rgba(255,255,255,0.08)",
        }}>
          <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 1, background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent)" }} />
          <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg, ${'#69C9D0'}, ${B.neonMagenta}, ${'#E1306C'}, ${B.neonCyan}, ${B.amber}, ${B.neonLime})` }} />
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 20 }}>
            <div>
              <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 30, color: B.white, lineHeight: 1, marginBottom: 6 }}>
                THE RITUAL RUNS EVERY FRIDAY.
              </div>
              <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 8, color: B.smoke, letterSpacing: "0.22em" }}>
                DROP DISCUSSION · CHALLENGE · CONVERSATION · GAME
              </div>
            </div>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {[
                { label: "EVERY FRIDAY", color: "#69C9D0" },
                { label: "6 PLATFORMS", color: B.amber },
                { label: "ONLINE FIRST", color: "#E1306C" },
                { label: "FNP YEAR-ROUND", color: B.neonLime },
              ].map((tag, i) => (
                <span key={i} style={{
                  padding: "5px 12px",
                  background: tag.color + "10",
                  backdropFilter: "blur(8px)",
                  border: `1px solid ${tag.color}40`,
                  borderRadius: 2,
                  fontFamily: "'Space Mono', monospace", fontSize: 7, color: tag.color, letterSpacing: "0.15em",
                }}>{tag.label}</span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
