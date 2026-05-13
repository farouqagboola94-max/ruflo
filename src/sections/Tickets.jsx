import { B } from '../tokens'
import { GrainOverlay, AmberGlow, SectionTag } from '../components/Shared'

const TIERS = [
  {
    name: "GENERAL",
    price: "₦15,000",
    tag: "ENTRY",
    color: B.neonCyan,
    perks: [
      "Full event floor access",
      "Vendor floor entry",
      "Live DJ sets all day",
      "Street food zone",
    ],
    cta: "BUY NOW",
    featured: false,
  },
  {
    name: "VIP",
    price: "₦35,000",
    tag: "MOST POPULAR",
    color: B.amber,
    perks: [
      "Everything in General",
      "VIP lounge access",
      "Exclusive drop previews",
      "Meet & greet access",
      "SF '26 merch bag",
    ],
    cta: "GET VIP",
    featured: true,
  },
  {
    name: "ULTRA VIP",
    price: "₦75,000",
    tag: "EXCLUSIVE",
    color: B.neonMagenta,
    perks: [
      "Everything in VIP",
      "Private collector room",
      "Artist studio access",
      "Signed memorabilia",
      "Exclusive ultra badge",
      "Priority entry & exit",
    ],
    cta: "GO ULTRA",
    featured: false,
  },
]

export default function Tickets() {
  return (
    <section id="tickets" style={{
      position: "relative", overflow: "hidden",
      background: B.black, padding: "100px 24px",
    }}>
      <GrainOverlay />
      <AmberGlow top="40%" left="50%" size={550} />

      <div style={{ position: "relative", zIndex: 10, maxWidth: 1100, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 64 }}>
          <SectionTag>SECURE YOUR SPOT</SectionTag>
          <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "clamp(40px, 6vw, 68px)", color: B.white, lineHeight: 0.9 }}>
            GET YOUR<br /><span style={{ color: B.amber }}>TICKETS</span>
          </div>
          <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 14, color: B.smoke, marginTop: 16 }}>
            Early bird pricing active now. Prices increase as the event approaches.
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 16, alignItems: "center" }}>
          {TIERS.map((tier, i) => (
            <div
              key={i}
              style={{
                background: tier.featured ? `linear-gradient(160deg, ${B.charcoal}, ${B.gunmetal})` : B.charcoal,
                border: `1px solid ${tier.featured ? tier.color + "80" : B.gunmetal}`,
                borderRadius: 8, overflow: "hidden", position: "relative",
                transform: tier.featured ? "scale(1.04)" : "scale(1)",
                boxShadow: tier.featured ? `0 0 50px ${tier.color}18` : "none",
              }}
            >
              <div style={{ height: 3, background: `linear-gradient(90deg, ${tier.color}, ${tier.color}40)` }} />
              <div style={{ padding: 28 }}>
                <div style={{ marginBottom: 14 }}>
                  <span style={{
                    padding: "3px 10px", borderRadius: 2,
                    background: tier.color + "18", border: `1px solid ${tier.color}50`,
                    fontFamily: "'Space Mono', monospace", fontSize: 7, color: tier.color, letterSpacing: "0.2em",
                  }}>
                    {tier.tag}
                  </span>
                </div>
                <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 28, color: B.white, letterSpacing: "0.05em" }}>
                  {tier.name}
                </div>
                <div style={{
                  fontFamily: "'Orbitron', monospace", fontWeight: 900, fontSize: 36, color: tier.color,
                  marginTop: 4, marginBottom: 20, textShadow: `0 0 20px ${tier.color}30`,
                }}>
                  {tier.price}
                </div>
                <div style={{ width: "100%", height: 1, background: B.gunmetal, marginBottom: 20 }} />
                <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 28 }}>
                  {tier.perks.map((perk, j) => (
                    <div key={j} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <div style={{ width: 6, height: 6, borderRadius: "50%", background: tier.color, flexShrink: 0 }} />
                      <span style={{ fontFamily: "'Syne', sans-serif", fontSize: 13, color: B.smoke }}>{perk}</span>
                    </div>
                  ))}
                </div>
                <button
                  style={{
                    width: "100%", padding: "14px 0",
                    background: tier.featured ? tier.color : "transparent",
                    border: `1px solid ${tier.color}`,
                    borderRadius: 4, cursor: "pointer",
                    fontFamily: "'Space Mono', monospace", fontSize: 10, fontWeight: 700,
                    color: tier.featured ? B.black : tier.color,
                    letterSpacing: "0.2em", transition: "all 0.25s",
                  }}
                  onMouseEnter={e => { e.currentTarget.style.background = tier.color; e.currentTarget.style.color = B.black }}
                  onMouseLeave={e => { e.currentTarget.style.background = tier.featured ? tier.color : "transparent"; e.currentTarget.style.color = tier.featured ? B.black : tier.color }}
                >
                  {tier.cta}
                </button>
              </div>
            </div>
          ))}
        </div>

        <div style={{ textAlign: "center", marginTop: 32, fontFamily: "'Space Mono', monospace", fontSize: 8, color: B.smoke, letterSpacing: "0.2em" }}>
          ALL SALES FINAL · AGES 16+ · SECURE CHECKOUT VIA PAYSTACK
        </div>
      </div>
    </section>
  )
}
