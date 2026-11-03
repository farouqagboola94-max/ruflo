import os

file_path = r"C:\Users\USER\.gemini\antigravity\scratch\sneakers-fest-official-working\src\sections\Tickets.jsx"

with open(file_path, "r", encoding="utf-8") as f:
    content = f.read()

# 1. Update TIERS
old_tiers = """const TIERS = [
  {
    name: 'GENERAL', price: '₦5,000', priceNum: 5000,
    tag: 'ENTRY', color: B.neonCyan,
    perks: ['Full event floor access','Vendor floor entry','Live DJ sets all day','Fit-Check Arena crowd voting pass','Street food zone'],
    cta: 'BUY NOW', featured: false, avail: 820, total: 1500,
  },
  {
    name: 'VIP', price: '₦10,000', priceNum: 10000,
    tag: 'MOST POPULAR', color: B.amber,
    perks: ['Everything in General','VIP lounge access','LSI Market Terminal pass','Exclusive drop previews','Meet & greet access',"SF '26 merch bag"],
    cta: 'GET VIP', featured: true, avail: 143, total: 400,
  },
  {
    name: 'VVIP', price: '₦25,000', priceNum: 25000,
    tag: 'EXCLUSIVE', color: B.neonMagenta,
    perks: ['Everything in VIP','Private collector room','Sole Craft Custom Workshop fast-track','Grail Heist Golden Pass eligibility','Signed memorabilia','Priority entry & exit'],
    cta: 'GO VVIP', featured: false, avail: 38, total: 150,
  },
  {
    name: 'PHALANX', price: '₦50,000', priceNum: 50000,
    tag: 'TOP TIER', color: B.neonLime,
    perks: ['Everything in VVIP','Private Phalanx lounge','LSX Escrow priority desk','Early entry from 11:00 AM','Dedicated concierge host','Founder collectible box'],
    cta: 'JOIN PHALANX', featured: false, avail: 12, total: 50,
  },
]"""

new_tiers = """const TIERS = [
  {
    name: 'GENERAL', price: '₦5,000', priceNum: 5000,
    tag: 'ENTRY', color: B.neonCyan,
    perks: ['Full event floor access','Vendor floor entry','Live DJ sets all day','Fit-Check Arena crowd voting pass','Street food zone'],
    cta: 'BUY NOW', featured: false, avail: 280, total: 1700,
  },
  {
    name: 'VIP', price: '₦10,000', priceNum: 10000,
    tag: 'MOST POPULAR', color: B.amber,
    perks: ['Everything in General','VIP lounge access','LSI Market Terminal pass','Exclusive drop previews','Meet & greet access',"SF '26 merch bag"],
    cta: 'GET VIP', featured: true, avail: 42, total: 200,
  },
  {
    name: 'VVIP', price: '₦25,000', priceNum: 25000,
    tag: 'EXCLUSIVE', color: B.neonMagenta,
    perks: ['Everything in VIP','Private collector room','Sole Craft Custom Workshop fast-track','Grail Heist Golden Pass eligibility','Signed memorabilia','Priority entry & exit'],
    cta: 'GO VVIP', featured: false, avail: 14, total: 80,
  },
  {
    name: 'PHALANX', price: '₦50,000', priceNum: 50000,
    tag: 'TOP TIER', color: B.neonLime,
    perks: ['Everything in VVIP','Private Phalanx lounge','LSX Escrow priority desk','Early entry from 11:00 AM','Dedicated concierge host','Founder collectible box'],
    cta: 'JOIN PHALANX', featured: false, avail: 4, total: 20,
  },
]"""

if old_tiers in content:
    content = content.replace(old_tiers, new_tiers)
    print("TIERS updated with strict 2,000 capacity numbers!")
else:
    print("TIERS target not matched directly, checking normalized...")
    content_norm = content.replace("\\r\\n", "\\n")
    old_norm = old_tiers.replace("\\r\\n", "\\n")
    if old_norm in content_norm:
        content = content_norm.replace(old_norm, new_tiers)
        print("TIERS updated with normalized line endings!")

# 2. Add Freedom Park Scarcity & Allocation HUD Bar
old_notice = """        {/* Verified Event Notice */}
        <div style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:10, marginBottom:20, minHeight:22 }}>
          <span style={{ width:6, height:6, borderRadius:'50%', background:B.neonLime, boxShadow:`0 0 8px ${B.neonLime}`, display:'inline-block', animation:'viewBlink 1.2s ease-in-out infinite', flexShrink:0 }} />
          <span style={{ fontFamily:"'Space Mono', monospace", fontSize:8.5, color: B.white, letterSpacing:2 }}>
            OFFICIAL NOTICE: VERIFIED TICKETS ARE ISSUED EXCLUSIVELY VIA PAYSTACK & FLUTTERWAVE
          </span>
        </div>"""

new_notice = """        {/* FREEDOM PARK 2,000 CAPACITY SCARCITY & ALLOCATION HUD */}
        <div style={{ marginBottom: 24, padding: '16px 20px', background: 'rgba(184,255,0,0.03)', border: `1px solid ${B.neonLime}30`, borderRadius: 12 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 10, marginBottom: 10 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: B.neonLime, boxShadow: `0 0 10px ${B.neonLime}`, animation: 'viewBlink 1.2s ease-in-out infinite' }} />
              <span style={{ fontFamily: "'Orbitron', monospace", fontSize: 10, color: B.white, fontWeight: 700, letterSpacing: 2 }}>
                FREEDOM PARK CAPACITY: 1,660 / 2,000 PASSES CLAIMED (83% ALLOCATED)
              </span>
            </div>
            <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 9, color: B.amber, fontWeight: 700 }}>
              ⚠️ ONLY 340 PASSES REMAINING FOR DEC 12
            </div>
          </div>

          {/* Segmented Capacity Progress Bar */}
          <div style={{ height: 6, background: 'rgba(255,255,255,0.08)', borderRadius: 3, overflow: 'hidden', display: 'flex', marginBottom: 10 }}>
            <div style={{ width: '83%', background: `linear-gradient(90deg, ${B.neonCyan}, ${B.amber}, ${B.neonLime})`, boxShadow: `0 0 12px ${B.neonLime}60` }} />
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 8, fontFamily: "'Space Mono', monospace", fontSize: 8.5, color: B.smoke }}>
            <span>📍 Broad Street Gates &bull; 1,700 General Admission + 300 VIP Total Footprint</span>
            <span style={{ color: B.neonCyan }}>✓ Zero Overcrowding Guarantee &bull; Turnstile Scanner Active</span>
          </div>
        </div>

        {/* Verified Event Notice */}
        <div style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:10, marginBottom:20, minHeight:22 }}>
          <span style={{ width:6, height:6, borderRadius:'50%', background:B.neonLime, boxShadow:`0 0 8px ${B.neonLime}`, display:'inline-block', animation:'viewBlink 1.2s ease-in-out infinite', flexShrink:0 }} />
          <span style={{ fontFamily:"'Space Mono', monospace", fontSize:8.5, color: B.white, letterSpacing:2 }}>
            OFFICIAL NOTICE: VERIFIED TICKETS ARE ISSUED EXCLUSIVELY VIA PAYSTACK & FLUTTERWAVE
          </span>
        </div>"""

if old_notice in content:
    content = content.replace(old_notice, new_notice)
    print("Freedom Park Scarcity HUD Bar added!")
else:
    print("Notice target not matched directly, checking normalized...")
    content_norm = content.replace("\\r\\n", "\\n")
    old_norm = old_notice.replace("\\r\\n", "\\n")
    if old_norm in content_norm:
        content = content_norm.replace(old_norm, new_notice)
        print("Freedom Park Scarcity HUD Bar added with normalized line endings!")

with open(file_path, "w", encoding="utf-8") as f:
    f.write(content)
