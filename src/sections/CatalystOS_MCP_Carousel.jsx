import { useState, useEffect, useCallback } from "react";

const ORANGE = "#f97316";
const DARK_BG = "#0a0a0a";
const CARD_BG = "#111111";
const CARD_BORDER = "#1a1a1a";
const FEATURE_BG = "#0d0d0d";

const mcpData = [
  {
    id: 0,
    type: "cover",
    title: "5 MCPs",
    subtitle: "7 FIGURE BUSINESSES",
    highlight: "CAN'T LIVE WITHOUT",
    description: "These tools automate work, save hours, and help businesses scale faster using Claude.",
    tools: [
      { name: "Shopify MCP", icon: "🛍️", color: "#95bf47" },
      { name: "Higgsfield MCP", icon: "✦", color: "#c8ff00" },
      { name: "AdAdvisor MCP", icon: "◆", color: ORANGE },
      { name: "Google Drive MCP", icon: "△", color: "#4285f4" },
      { name: "Google Analytics MCP", icon: "▐", color: ORANGE },
    ],
    footer: ["Automate Repetitive Tasks", "Save Hours Every Week", "Make Smarter Decisions", "Scale With Confidence"],
  },
  {
    id: 1,
    number: "01",
    label: "SHOPIFY MCP",
    title: "Turn Claude Into",
    titleHighlight: "Your Shopify",
    titleEnd: "Operator",
    description: "Connect your Shopify store to Claude and manage your entire business using plain English.",
    brandColor: "#95bf47",
    brandName: "shopify",
    features: [
      { icon: "📦", title: "Check Inventory", desc: "Check low stock, track inventory and get alerts." },
      { icon: "📊", title: "Analyze Sales", desc: "Analyze sales data, trends and performance instantly." },
      { icon: "🛒", title: "Manage Orders", desc: "Search orders, check fulfillment status and customer details." },
      { icon: "🏷️", title: "Optimize Products", desc: "Find top products, update details and improve descriptions." },
    ],
    cta: "Run your store smarter.",
    ctaSub: "Automate the busy work and focus on growth.",
  },
  {
    id: 2,
    number: "02",
    label: "HIGGSFIELD MCP",
    title: "Create Stunning",
    titleHighlight: "AI Visuals",
    titleEnd: "With Claude",
    description: "Connect Higgsfield to Claude and generate professional AI images, videos, and creative content in seconds.",
    brandColor: "#c8ff00",
    brandName: "Higgsfield",
    features: [
      { icon: "🖼️", title: "Generate AI Images", desc: "Create high quality, realistic or stylized images instantly." },
      { icon: "🎬", title: "Create AI Videos", desc: "Turn ideas into cinematic videos with stunning AI powered scenes." },
      { icon: "✨", title: "Enhance & Edit", desc: "Enhance visuals, upscale quality, and modify content with simple commands." },
      { icon: "⚡", title: "Speed Up Creation", desc: "Produce more content, faster and at scale without compromising quality." },
    ],
    cta: "Create more. 10x faster.",
    ctaSub: "Bring your ideas to life and scale your content creation effortlessly.",
  },
  {
    id: 3,
    number: "03",
    label: "ADADVISOR MCP",
    title: "Run Meta Ads",
    titleHighlight: "Using Claude",
    titleEnd: "Like a Pro",
    description: "Analyze campaigns, optimize performance, and manage your Meta ads without opening Ads Manager.",
    brandColor: ORANGE,
    brandName: "AdAdvisor",
    features: [
      { icon: "✕", title: "Pause Bad Ads", desc: "Automatically find and pause underperforming ads that waste budget." },
      { icon: "📈", title: "Scale Winners", desc: "Identify winning campaigns and scale them with confidence." },
      { icon: "💡", title: "Find Opportunities", desc: "Discover new angles, audiences, and optimization opportunities." },
      { icon: "⚙️", title: "Build & Manage", desc: "Create campaigns, ad sets, and ads using plain English commands." },
    ],
    cta: "Better decisions. More profit.",
    ctaSub: "Turn data into actions that grow your business.",
  },
  {
    id: 4,
    number: "04",
    label: "GOOGLE DRIVE MCP",
    title: "Access And",
    titleHighlight: "Summarize Files",
    titleEnd: "With Claude",
    description: "Connect Google Drive to Claude and find, summarize, and work with your files across documents, sheets, slides, and more instantly.",
    brandColor: "#4285f4",
    brandName: "Google Drive",
    features: [
      { icon: "🔍", title: "Find Any File", desc: "Search across all your Drive files and folders in seconds." },
      { icon: "📄", title: "Summarize Documents", desc: "Get instant summaries of long documents, PDFs, and reports." },
      { icon: "📊", title: "Analyze Spreadsheets", desc: "Analyze data, create insights, and build reports from your Sheets." },
      { icon: "📁", title: "Organize & Manage", desc: "Move, rename, and organize files and folders with plain English." },
    ],
    cta: "Less time searching. More time doing.",
    ctaSub: "Claude + Google Drive keeps your files organized and your workflow moving.",
  },
  {
    id: 5,
    number: "05",
    label: "GOOGLE ANALYTICS MCP",
    title: "Get Powerful",
    titleHighlight: "Insights",
    titleEnd: "With Claude",
    description: "Connect Google Analytics to Claude and unlock deep insights, track performance, and make data driven decisions faster.",
    brandColor: ORANGE,
    brandName: "Google Analytics",
    features: [
      { icon: "📉", title: "Track Performance", desc: "Monitor website and campaign performance in real time." },
      { icon: "🔮", title: "Discover Insights", desc: "Uncover trends, patterns, and opportunities hidden in your data." },
      { icon: "👥", title: "Understand Your Users", desc: "Analyze user behavior, traffic sources, and audience engagement." },
      { icon: "🎯", title: "Optimize & Grow", desc: "Make smarter decisions, improve ROI, and scale your business." },
    ],
    cta: "Want the full MCP setup guide + links to all 5 tools?",
    ctaSub: 'Comment "CLAUDE" and I\'ll send it over!',
    finalSlide: true,
    footerItems: ["Save Hours Every Week", "Automate Repetitive Work", "Make Smarter Decisions", "Scale Your Business Faster"],
  },
];

function GlowOrb({ color, size = 120, top, left, right, bottom, opacity = 0.15 }) {
  return (
    <div
      style={{
        position: "absolute",
        width: size,
        height: size,
        borderRadius: "50%",
        background: `radial-gradient(circle, ${color} 0%, transparent 70%)`,
        opacity,
        top, left, right, bottom,
        pointerEvents: "none",
        filter: "blur(40px)",
      }}
    />
  );
}

function DotPattern({ top, right }) {
  return (
    <div style={{ position: "absolute", top, right, opacity: 0.3, pointerEvents: "none" }}>
      {Array.from({ length: 5 }).map((_, row) => (
        <div key={row} style={{ display: "flex", gap: 6, marginBottom: 6 }}>
          {Array.from({ length: 5 }).map((_, col) => (
            <div
              key={col}
              style={{
                width: 3,
                height: 3,
                borderRadius: "50%",
                background: ORANGE,
                opacity: 0.4 + Math.random() * 0.4,
              }}
            />
          ))}
        </div>
      ))}
    </div>
  );
}

function FeatureCard({ icon, title, desc }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: FEATURE_BG,
        border: `1px solid ${hovered ? ORANGE + "66" : CARD_BORDER}`,
        borderRadius: 12,
        padding: "20px 14px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        textAlign: "center",
        gap: 8,
        transition: "all 0.3s ease",
        transform: hovered ? "translateY(-2px)" : "none",
        boxShadow: hovered ? `0 8px 24px ${ORANGE}15` : "none",
        flex: 1,
        minWidth: 0,
      }}
    >
      <div style={{ fontSize: 28, marginBottom: 4, filter: hovered ? "brightness(1.3)" : "none", transition: "filter 0.3s" }}>{icon}</div>
      <div style={{ color: "#fff", fontWeight: 700, fontSize: 13, fontFamily: "'Space Grotesk', sans-serif", letterSpacing: "0.02em" }}>{title}</div>
      <div style={{ color: "#888", fontSize: 11.5, lineHeight: 1.5, fontFamily: "'DM Sans', sans-serif" }}>{desc}</div>
    </div>
  );
}

function SlideIndicator({ total, current, onSelect }) {
  return (
    <div style={{ display: "flex", gap: 8, justifyContent: "center", padding: "16px 0" }}>
      {Array.from({ length: total }).map((_, i) => (
        <button
          key={i}
          onClick={() => onSelect(i)}
          style={{
            width: current === i ? 28 : 10,
            height: 10,
            borderRadius: 5,
            background: current === i ? ORANGE : "#333",
            border: "none",
            cursor: "pointer",
            transition: "all 0.3s ease",
            padding: 0,
          }}
        />
      ))}
    </div>
  );
}

function CoverSlide({ data }) {
  return (
    <div style={{ padding: "32px 24px 20px", position: "relative", overflow: "hidden", minHeight: 520 }}>
      <GlowOrb color={ORANGE} size={200} top={-60} right={-40} opacity={0.1} />
      <DotPattern top={20} right={20} />

      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
        <div style={{
          background: "#1a1a1a",
          border: `1px solid ${CARD_BORDER}`,
          borderRadius: 8,
          padding: "6px 14px",
          display: "flex",
          alignItems: "center",
          gap: 8,
        }}>
          <span style={{ color: ORANGE, fontSize: 18 }}>✦</span>
          <span style={{ color: "#fff", fontSize: 12, fontWeight: 600, fontFamily: "'Space Grotesk', sans-serif", letterSpacing: "0.05em" }}>AI + MCPs</span>
        </div>
        <div style={{ marginLeft: "auto", color: "#666", fontSize: 13, fontFamily: "'DM Mono', monospace" }}>01 / 06</div>
      </div>

      <div style={{ marginTop: 24 }}>
        <h1 style={{
          fontFamily: "'Clash Display', 'Space Grotesk', sans-serif",
          fontSize: 56,
          fontWeight: 800,
          color: "#fff",
          lineHeight: 0.95,
          margin: 0,
        }}>
          {data.title}
        </h1>
        <h2 style={{
          fontFamily: "'Clash Display', 'Space Grotesk', sans-serif",
          fontSize: 32,
          fontWeight: 700,
          color: "#fff",
          margin: "4px 0",
          lineHeight: 1.1,
        }}>
          {data.subtitle}
        </h2>
        <h2 style={{
          fontFamily: "'Clash Display', 'Space Grotesk', sans-serif",
          fontSize: 36,
          fontWeight: 800,
          color: ORANGE,
          margin: 0,
          lineHeight: 1.1,
        }}>
          {data.highlight}
        </h2>
      </div>

      <div style={{
        background: FEATURE_BG,
        border: `1px solid ${CARD_BORDER}`,
        borderRadius: 12,
        padding: "14px 20px",
        marginTop: 20,
        display: "flex",
        alignItems: "center",
        gap: 10,
      }}>
        <span style={{ color: ORANGE, fontSize: 16 }}>✦</span>
        <span style={{ color: "#ccc", fontSize: 13, fontFamily: "'DM Sans', sans-serif", lineHeight: 1.5 }}>
          {data.description}
        </span>
      </div>

      <div style={{ display: "flex", gap: 10, marginTop: 20, flexWrap: "wrap" }}>
        {data.tools.map((tool, i) => (
          <div
            key={i}
            style={{
              flex: 1,
              minWidth: 90,
              background: FEATURE_BG,
              border: `1px solid ${i === 2 ? ORANGE + "55" : CARD_BORDER}`,
              borderRadius: 12,
              padding: "16px 10px",
              textAlign: "center",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 8,
            }}
          >
            <div style={{
              width: 36,
              height: 36,
              borderRadius: 10,
              background: tool.color + "22",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 18,
              color: tool.color,
              fontWeight: 700,
            }}>
              {tool.icon}
            </div>
            <div style={{
              color: "#ddd",
              fontSize: 11,
              fontWeight: 600,
              fontFamily: "'Space Grotesk', sans-serif",
            }}>
              {tool.name}
            </div>
          </div>
        ))}
      </div>

      <div style={{
        display: "flex",
        gap: 12,
        marginTop: 20,
        flexWrap: "wrap",
      }}>
        {data.footer.map((item, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <span style={{ color: ORANGE, fontSize: 14 }}>{["⚡", "🕐", "📊", "⚙️"][i]}</span>
            <span style={{ color: "#aaa", fontSize: 11, fontFamily: "'DM Sans', sans-serif", fontWeight: 500 }}>{item}</span>
          </div>
        ))}
      </div>

      <div style={{
        marginTop: 16,
        background: FEATURE_BG,
        border: `1px solid ${CARD_BORDER}`,
        borderRadius: 10,
        padding: "12px 18px",
        display: "flex",
        alignItems: "center",
        gap: 10,
      }}>
        <span style={{ color: ORANGE, fontSize: 16 }}>🔖</span>
        <span style={{ color: ORANGE, fontWeight: 700, fontSize: 13, fontFamily: "'Space Grotesk', sans-serif" }}>
          Save this guide
        </span>
        <span style={{ color: "#888", fontSize: 13, fontFamily: "'DM Sans', sans-serif" }}> you'll use it again.</span>
      </div>
    </div>
  );
}

function MCPSlide({ data, slideIndex }) {
  return (
    <div style={{ padding: "24px 24px 20px", position: "relative", overflow: "hidden", minHeight: 520 }}>
      <GlowOrb color={data.brandColor || ORANGE} size={180} top={-40} right={-30} opacity={0.08} />
      <DotPattern top={80} right={16} />

      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ color: ORANGE, fontSize: 16 }}>✦</span>
          <span style={{ color: "#888", fontSize: 11, fontWeight: 600, fontFamily: "'Space Grotesk', sans-serif", letterSpacing: "0.06em" }}>
            TOP 5 MCPs
          </span>
          <span style={{ color: "#555", fontSize: 11, fontFamily: "'DM Sans', sans-serif" }}>7 FIGURE BUSINESSES</span>
          <span style={{ color: ORANGE, fontSize: 11, fontWeight: 700, fontFamily: "'Space Grotesk', sans-serif" }}>CAN'T LIVE WITHOUT</span>
        </div>
        <span style={{ color: "#555", fontSize: 12, fontFamily: "'DM Mono', monospace" }}>
          {String(slideIndex + 1).padStart(2, "0")} / 06
        </span>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16, marginTop: 12 }}>
        <div style={{
          background: ORANGE,
          color: "#000",
          fontWeight: 800,
          fontSize: 14,
          fontFamily: "'Space Grotesk', sans-serif",
          padding: "4px 10px",
          borderRadius: 6,
        }}>
          {data.number}
        </div>
        <span style={{
          color: ORANGE,
          fontSize: 14,
          fontWeight: 700,
          fontFamily: "'Space Grotesk', sans-serif",
          letterSpacing: "0.08em",
        }}>
          {data.label}
        </span>
        <div style={{ flex: 1, height: 2, background: ORANGE, borderRadius: 1, opacity: 0.4 }} />
      </div>

      <div style={{ marginBottom: 14 }}>
        <h1 style={{
          fontFamily: "'Clash Display', 'Space Grotesk', sans-serif",
          fontSize: 38,
          fontWeight: 800,
          color: "#fff",
          margin: 0,
          lineHeight: 1.05,
        }}>
          {data.title}
          <br />
          <span style={{ color: ORANGE }}>{data.titleHighlight}</span>
          <br />
          {data.titleEnd}
        </h1>
      </div>

      <p style={{
        color: "#999",
        fontSize: 13.5,
        lineHeight: 1.6,
        fontFamily: "'DM Sans', sans-serif",
        margin: "0 0 20px",
        maxWidth: 420,
      }}>
        {data.description}
      </p>

      <div style={{
        background: FEATURE_BG,
        border: `1px solid ${CARD_BORDER}`,
        borderRadius: 14,
        padding: "18px 16px",
        marginBottom: 16,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
          <span style={{ color: ORANGE, fontSize: 14 }}>✦</span>
          <span style={{
            color: "#fff",
            fontSize: 13,
            fontWeight: 700,
            fontFamily: "'Space Grotesk', sans-serif",
          }}>
            What you can do with {data.label.replace(" MCP", "")} MCP:
          </span>
          <div style={{ flex: 1, height: 2, background: ORANGE, borderRadius: 1, opacity: 0.5 }} />
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          {data.features.map((f, i) => (
            <FeatureCard key={i} icon={f.icon} title={f.title} desc={f.desc} />
          ))}
        </div>
      </div>

      <div style={{
        background: FEATURE_BG,
        border: `1px solid ${CARD_BORDER}`,
        borderRadius: 10,
        padding: "12px 16px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ fontSize: 16 }}>{data.finalSlide ? "💬" : "⚡"}</span>
          <div>
            <div style={{ color: "#fff", fontSize: 12.5, fontWeight: 700, fontFamily: "'Space Grotesk', sans-serif" }}>{data.cta}</div>
            <div style={{ color: "#777", fontSize: 11, fontFamily: "'DM Sans', sans-serif", marginTop: 2 }}>{data.ctaSub}</div>
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ color: ORANGE, fontSize: 14 }}>🔖</span>
          <div>
            <div style={{ color: ORANGE, fontSize: 11.5, fontWeight: 700, fontFamily: "'Space Grotesk', sans-serif" }}>Save this post</div>
            <div style={{ color: "#666", fontSize: 10, fontFamily: "'DM Sans', sans-serif" }}>You'll need it later.</div>
          </div>
        </div>
      </div>

      {data.finalSlide && data.footerItems && (
        <div style={{ display: "flex", gap: 12, marginTop: 12, flexWrap: "wrap" }}>
          {data.footerItems.map((item, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 5 }}>
              <span style={{ color: ORANGE, fontSize: 12 }}>{["🕐", "⚡", "📊", "⚙️"][i]}</span>
              <span style={{ color: "#888", fontSize: 10.5, fontFamily: "'DM Sans', sans-serif" }}>{item}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function MCPCarousel() {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(0);
  const [touchStart, setTouchStart] = useState(null);

  const navigate = useCallback((newIndex) => {
    if (newIndex < 0 || newIndex >= mcpData.length) return;
    setDirection(newIndex > current ? 1 : -1);
    setCurrent(newIndex);
  }, [current]);

  const handleKeyDown = useCallback((e) => {
    if (e.key === "ArrowRight" || e.key === "ArrowDown") navigate(current + 1);
    if (e.key === "ArrowLeft" || e.key === "ArrowUp") navigate(current - 1);
  }, [current, navigate]);

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  const slide = mcpData[current];

  return (
    <div style={{
      minHeight: "100vh",
      background: "#050505",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontFamily: "'DM Sans', sans-serif",
      padding: 16,
    }}>
      <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=DM+Sans:wght@400;500;600;700&family=DM+Mono:wght@400;500&display=swap" rel="stylesheet" />

      <div style={{
        width: "100%",
        maxWidth: 520,
        background: CARD_BG,
        borderRadius: 20,
        border: `1px solid ${CARD_BORDER}`,
        overflow: "hidden",
        boxShadow: `0 0 80px ${ORANGE}08, 0 24px 48px rgba(0,0,0,0.6)`,
        position: "relative",
      }}>
        <div
          onTouchStart={(e) => setTouchStart(e.touches[0].clientX)}
          onTouchEnd={(e) => {
            if (touchStart === null) return;
            const diff = touchStart - e.changedTouches[0].clientX;
            if (Math.abs(diff) > 50) {
              navigate(diff > 0 ? current + 1 : current - 1);
            }
            setTouchStart(null);
          }}
          style={{
            transition: "opacity 0.3s ease",
          }}
        >
          {slide.type === "cover" ? (
            <CoverSlide data={slide} />
          ) : (
            <MCPSlide data={slide} slideIndex={current} />
          )}
        </div>

        <div style={{
          padding: "0 24px 8px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}>
          <button
            onClick={() => navigate(current - 1)}
            disabled={current === 0}
            style={{
              background: current === 0 ? "#1a1a1a" : ORANGE + "22",
              border: `1px solid ${current === 0 ? "#222" : ORANGE + "44"}`,
              color: current === 0 ? "#444" : ORANGE,
              borderRadius: 10,
              padding: "8px 16px",
              cursor: current === 0 ? "default" : "pointer",
              fontSize: 13,
              fontWeight: 600,
              fontFamily: "'Space Grotesk', sans-serif",
              transition: "all 0.2s",
            }}
          >
            ← Prev
          </button>

          <SlideIndicator total={mcpData.length} current={current} onSelect={(i) => navigate(i)} />

          <button
            onClick={() => navigate(current + 1)}
            disabled={current === mcpData.length - 1}
            style={{
              background: current === mcpData.length - 1 ? "#1a1a1a" : ORANGE,
              border: `1px solid ${current === mcpData.length - 1 ? "#222" : ORANGE}`,
              color: current === mcpData.length - 1 ? "#444" : "#000",
              borderRadius: 10,
              padding: "8px 16px",
              cursor: current === mcpData.length - 1 ? "default" : "pointer",
              fontSize: 13,
              fontWeight: 700,
              fontFamily: "'Space Grotesk', sans-serif",
              transition: "all 0.2s",
            }}
          >
            Next →
          </button>
        </div>

        <div style={{
          padding: "8px 24px 16px",
          borderTop: `1px solid ${CARD_BORDER}`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 8,
        }}>
          <div style={{
            width: 8,
            height: 8,
            borderRadius: "50%",
            background: ORANGE,
            boxShadow: `0 0 8px ${ORANGE}`,
          }} />
          <span style={{
            color: "#666",
            fontSize: 10.5,
            fontFamily: "'DM Mono', monospace",
            letterSpacing: "0.1em",
          }}>
            CATALYST OS · MCP INTELLIGENCE MODULE · v1.0
          </span>
        </div>
      </div>
    </div>
  );
}
