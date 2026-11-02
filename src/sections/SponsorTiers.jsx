import { useState } from 'react'
import { B } from '../tokens'
import { GrainOverlay, SectionTag } from '../components/Shared'
import { SOCIAL_LINKS } from '../config'
import { dispatchFestivalAction, FESTIVAL_ACTIONS, playFestivalSound } from '../framework/festivalFramework'
import Egg from '../components/Egg'

const TIERS = [
  {
    id: 'bronze',
    codePrefix: 'GATEHOUSE',
    name: 'GATEHOUSE',
    price: '₦3,500,000',
    numericPrice: 3500000,
    color: '#CD7F32',
    tag: 'MOBILITY & GATE PARTNER',
    landmark: 'Hospital Rd / Broad St Turnstile Gatehouse',
    capacity: 4,
    taken: 1,
    perks: [
      'Naming rights to the Broad St / Hospital Rd Fast-Track Gatehouse',
      'Branded Ride-Hailing Drop-Off Loop & QR Turnstile Lane',
      'Branded 3×3m Brick Pergola activation bay',
      '5 complimentary VIP Passes + 2 social spotlight posts',
      'Logo on digital wallet passes & post-event impact report',
    ],
  },
  {
    id: 'silver',
    codePrefix: 'PERGOLA',
    name: 'PERGOLA',
    price: '₦4,500,000',
    numericPrice: 4500000,
    color: B.neonLime,
    tag: 'SOLE CRAFT WORKSHOP PARTNER',
    landmark: 'Sole Craft Brick Pergola Pavilion',
    capacity: 3,
    taken: 1,
    perks: [
      'Naming rights to the Sole Craft Customization Workshop Pergola',
      'Co-branded 1-of-1 Artisan Benches & custom lace/dubrae bar',
      '8 complimentary VIP Passes + dedicated IG/TikTok reel',
      'Brand integration inside the interactive 3D Venue Navigator',
      'Logo on Amphitheatre LED backdrop & festival merch tags',
    ],
  },
  {
    id: 'gold',
    codePrefix: 'CELLS',
    name: 'GRAIL CELLS',
    price: '₦8,500,000',
    numericPrice: 8500000,
    color: B.amber,
    tag: 'ARCHITECTURAL WING PARTNER',
    landmark: 'Historic Cell Block A OR Watchtower VIP Deck',
    featured: true,
    capacity: 2,
    taken: 1,
    perks: [
      'Exclusive naming rights to "The Grail Cells" (LSX Escrow Wing) OR Watchtower VIP Deck',
      'Custom-branded Historic Brick Cell Vault for product drops',
      'Live brand ticker integration on the Lagos Sole Index (LSI)',
      '10 complimentary VVIP Passes + 1 Phalanx VIP Table',
      'Main Amphitheatre MC shoutouts + 3 co-branded campaign reels',
    ],
  },
  {
    id: 'platinum',
    codePrefix: 'AMPHI',
    name: 'AMPHITHEATRE',
    price: '₦15,000,000',
    numericPrice: 15000000,
    color: B.neonCyan,
    tag: 'HEADLINE TITLE SPONSOR',
    landmark: 'Freedom Park Main Amphitheatre & Festival Title',
    capacity: 1,
    taken: 0,
    perks: [
      'Headline Title Rights: "[Brand] Presents Sneakers Fest \'26: The Year of Freedom"',
      'Full architectural takeover of the Freedom Park Main Amphitheatre Stage',
      'Co-headline branding on the 1v1 Cobblestone Fit-Check Arena',
      'Unlimited VVIP & Phalanx Watchtower hospitality access',
      'Exclusive 1-of-1 festival sneaker collaboration & 90-day media rollout',
    ],
  },
]

const STATS = [
  { value: '5,000',   label: 'FESTIVAL CAPACITY' },
  { value: '7 ZONES', label: 'HERITAGE LANDMARKS' },
  { value: '18–35',   label: 'CORE DEMOGRAPHIC' },
  { value: '₦150M+',  label: 'PROJECTED GMV & REACH' },
]

const CONTACT_EMAIL = 'sneakersfest088@gmail.com'

function genSponsorHoldRef(prefix = 'LANDMARK') {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  let suffix = ''
  for (let i = 0; i < 4; i++) suffix += chars[Math.floor(Math.random() * chars.length)]
  return `SFS26-${prefix}-${suffix}`
}

export default function SponsorTiers() {
  const [submitted, setSubmitted] = useState(false)
  const [holdRef, setHoldRef]     = useState('')
  const [form, setForm]           = useState({ brand: '', contact: '', email: '', phone: '', tier: 'GRAIL CELLS', note: '' })
  const [loading, setLoading]     = useState(false)

  const FORMSPREE   = import.meta.env.VITE_FORMSPREE_ID || ''
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL  || ''

  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }))
  const selectedTierObj = TIERS.find(t => t.name === form.tier) || TIERS[2]

  function buildSponsorWhatsAppUrl(refCode, tierObj = selectedTierObj, deskUrl = SOCIAL_LINKS.whatsappContact1 || SOCIAL_LINKS.whatsapp) {
    const msg = `Hello SF26 Executive Sponsorship Desk, we have generated Landmark Hold Reference [${refCode}] for Sneakers Fest '26 at Freedom Park, CMS:\n\n• Brand / Company: ${form.brand || 'Corporate Partner'}\n• Contact: ${form.contact || 'Brand Lead'} (${form.email || 'N/A'}${form.phone ? ` | ${form.phone}` : ''})\n• Landmark Tier: ${tierObj.name} (${tierObj.price})\n• Monument: ${tierObj.landmark}\n${form.note ? `• Objectives: ${form.note}\n` : ''}\nKindly confirm our 72-hour category exclusivity hold under Ref [${refCode}] and share the corporate settlement & walkthrough schedule.`
    const base = String(deskUrl || 'https://wa.me/2347084111516').split('?')[0]
    return `${base}?text=${encodeURIComponent(msg)}`
  }

  function downloadSponsorTermSheetTxt(refCode, tierObj = selectedTierObj) {
    const lines = [
      "====================================================================",
      "SNEAKERS FEST '26 — THE YEAR OF FREEDOM",
      "PROVISIONAL ARCHITECTURAL SPONSORSHIP TERM SHEET & EXCLUSIVITY HOLD",
      "Venue: Freedom Park (Old Prison Ground), Broad St / CMS, Lagos Island",
      "Date : Saturday, December 12, 2026 (12:00 PM - 10:00 PM WAT)",
      "====================================================================",
      `HOLD REFERENCE   : ${refCode}`,
      `BRAND / PARTNER  : ${form.brand || 'Prospective Brand Partner'}`,
      `PRIMARY CONTACT  : ${form.contact || 'N/A'} (${form.email || 'N/A'} | ${form.phone || 'N/A'})`,
      `LANDMARK TIER    : ${tierObj.name} — ${tierObj.tag}`,
      `HERITAGE MONUMENT: ${tierObj.landmark}`,
      `INVESTMENT       : ${tierObj.price} (70% Upon Signing / 30% Pre-Load-In)`,
      "--------------------------------------------------------------------",
      "CORE ARCHITECTURAL & COMMERCIAL DELIVERABLES:",
      ...tierObj.perks.map((p, idx) => `  0${idx + 1}. ${p}`),
      "--------------------------------------------------------------------",
      `NOTES / OBJECTIVES: ${form.note || 'Category Exclusivity & On-Site Freedom Park Takeover'}`,
      "====================================================================",
      "EXECUTIVE SPONSORSHIP DESK (WHATSAPP): +234 708 411 1516",
      "SECONDARY DESK: +234 905 268 5799 | EMAIL: sneakersfest088@gmail.com",
      "====================================================================",
    ].join('\n')
    const blob = new Blob([lines], { type: 'text/plain;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `SF26-Landmark-TermSheet-${refCode}.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  async function processSubmission(autoOpenWhatsApp = false) {
    if (!form.brand.trim() || !form.email.includes('@') || !form.tier) return
    setLoading(true)
    const ref = genSponsorHoldRef(selectedTierObj.codePrefix)
    const payload = { ...form, holdRef: ref, _subject: `Sponsor Landmark Hold [${ref}] — ${form.brand} (${form.tier})` }
    let ok = false
    if (BACKEND_URL) {
      try { const r = await fetch(`${BACKEND_URL}/api/sponsor-enquiry`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) }); ok = r.ok } catch {}
    }
    if (!ok && FORMSPREE) {
      try { const r = await fetch(`https://formspree.io/f/${FORMSPREE}`, { method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json' }, body: JSON.stringify(payload) }); ok = r.ok } catch {}
    }
    try {
      const holds = JSON.parse(localStorage.getItem('sf26_sponsor_holds') || '[]')
      holds.unshift({ ...payload, createdAt: new Date().toISOString() })
      localStorage.setItem('sf26_sponsor_holds', JSON.stringify(holds.slice(0, 20)))
    } catch {}
    dispatchFestivalAction(FESTIVAL_ACTIONS.XP_AWARD, { amount: 100, reason: 'Corporate Landmark Hold Generated' })
    playFestivalSound('badge_unlock')
    setHoldRef(ref)
    setLoading(false)
    setSubmitted(true)

    if (autoOpenWhatsApp && typeof window !== 'undefined') {
      window.open(buildSponsorWhatsAppUrl(ref, selectedTierObj), '_blank', 'noopener,noreferrer')
    }
  }

  function handleSelectTierFromCard(tierObj, instantWhatsApp = false) {
    setForm(f => ({ ...f, tier: tierObj.name }))
    if (instantWhatsApp) {
      const quickRef = genSponsorHoldRef(tierObj.codePrefix)
      const msg = `Hello SF26 Executive Sponsorship Desk, we want to request a 72-Hour Landmark Hold [${quickRef}] for the ${tierObj.name} Tier (${tierObj.price} — ${tierObj.landmark}) at Freedom Park, CMS on Dec 12, 2026.`
      window.open(`${SOCIAL_LINKS.whatsappContact1 || SOCIAL_LINKS.whatsapp}?text=${encodeURIComponent(msg)}`, '_blank', 'noopener,noreferrer')
      return
    }
    const el = document.getElementById('sponsor-brief-form')
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' })
  }

  const IS = { width: '100%', padding: '11px 14px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.09)', borderRadius: 8, color: B.white, fontFamily: 'Space Mono,monospace', fontSize: 13, outline: 'none', boxSizing: 'border-box', transition: 'border-color 0.2s' }
  const lbl = t => <label style={{ fontFamily: 'Space Mono,monospace', fontSize: 8, color: B.smoke, letterSpacing: '0.25em', display: 'block', marginBottom: 7 }}>{t}</label>
  const onFocus = e => e.target.style.borderColor = B.amber + '60'
  const onBlur  = e => e.target.style.borderColor = 'rgba(255,255,255,0.09)'

  return (
    <section id="sponsor-tiers" style={{ position: 'relative', overflow: 'hidden', background: '#07070C', padding: '100px 24px' }}>
      <GrainOverlay />
      <Egg id="egg-101" corner="top-right" />
      <Egg id="egg-102" corner="bottom-left" />

      <div style={{ position: 'absolute', top: '10%', right: '-5%', width: 500, height: 500, background: `radial-gradient(circle, ${B.amber}08 0%, transparent 70%)`, filter: 'blur(100px)', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', bottom: '15%', left: '-5%', width: 400, height: 400, background: `radial-gradient(circle, ${B.neonCyan}07 0%, transparent 70%)`, filter: 'blur(80px)', pointerEvents: 'none' }} />

      <div style={{ position: 'relative', zIndex: 10, maxWidth: 1100, margin: '0 auto' }}>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 64 }}>
          <SectionTag>ARCHITECTURAL SPONSORSHIP · FREEDOM PARK, CMS</SectionTag>
          <div className="reveal-3d text-3d" style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 'clamp(40px,6vw,72px)', color: B.white, lineHeight: 0.9, marginBottom: 16 }}>
            OWN A <span style={{ color: B.amber }}>LANDMARK</span>
          </div>
          <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 14, color: B.smoke, lineHeight: 1.8, maxWidth: 620, margin: '0 auto' }}>
            Instead of generic field tents, claim exclusive naming rights to Freedom Park’s permanent historic monuments—the Main Amphitheatre, The Grail Cells, the Watchtower VIP Deck, the Sole Craft Pergola, or the Broad Street Gatehouse.
          </div>
        </div>

        {/* Audience stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 12, marginBottom: 64 }}>
          {STATS.map((s, i) => (
            <div key={i} className="card-3d" style={{ padding: '20px 16px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 10, textAlign: 'center' }}>
              <div style={{ fontFamily: "'Orbitron', monospace", fontWeight: 900, fontSize: 22, color: B.amber, marginBottom: 6 }}>{s.value}</div>
              <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 9, color: B.smoke, letterSpacing: '0.2em' }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Tier cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(245px, 1fr))', gap: 20, marginBottom: 72, alignItems: 'start' }}>
          {TIERS.map((tier) => {
            const pct  = tier.taken / tier.capacity
            const left = tier.capacity - tier.taken
            const urgColor = pct >= 1 ? B.neonMagenta : pct >= 0.6 ? B.amber : tier.color
            return (
              <div
                key={tier.id}
                style={{
                  position: 'relative',
                  background: tier.featured ? `rgba(245,166,35,0.06)` : 'rgba(255,255,255,0.03)',
                  border: `1px solid ${tier.featured ? tier.color + '50' : 'rgba(255,255,255,0.08)'}`,
                  borderRadius: 14,
                  overflow: 'hidden',
                  transform: tier.featured ? 'scale(1.03)' : 'scale(1)',
                  boxShadow: tier.featured ? `0 8px 40px rgba(0,0,0,0.5), 0 0 0 1px ${tier.color}15` : '0 4px 24px rgba(0,0,0,0.4)',
                }}
              >
                <div style={{ height: 3, background: `linear-gradient(90deg, ${tier.color}, ${tier.color}30)` }} />
                {tier.featured && (
                  <div style={{ position: 'absolute', top: 14, right: 14, padding: '3px 10px', background: `${tier.color}20`, border: `1px solid ${tier.color}50`, borderRadius: 3, fontFamily: 'Space Mono,monospace', fontSize: 9, color: tier.color, letterSpacing: '0.2em' }}>MOST POPULAR</div>
                )}
                <div style={{ padding: 28 }}>
                  <div style={{ marginBottom: 10 }}>
                    <span style={{ padding: '3px 10px', borderRadius: 2, background: tier.color + '18', border: `1px solid ${tier.color}40`, fontFamily: 'Space Mono,monospace', fontSize: 9, color: tier.color, letterSpacing: '0.18em' }}>{tier.tag}</span>
                  </div>
                  <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 34, color: B.white, letterSpacing: '0.06em', marginBottom: 4 }}>{tier.name}</div>
                  <div style={{ fontFamily: "'Orbitron', monospace", fontSize: 18, fontWeight: 800, color: tier.color, marginBottom: 6 }}>{tier.price}</div>
                  <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 10, color: B.mist, marginBottom: 16 }}>🏛️ {tier.landmark}</div>

                  {/* availability bar */}
                  <div style={{ marginBottom: 20 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
                      <span style={{ fontFamily: 'Space Mono,monospace', fontSize: 9, color: urgColor, letterSpacing: 1 }}>
                        {pct >= 1 ? 'SOLD OUT' : pct >= 0.6 ? 'FILLING FAST' : 'AVAILABLE'}
                      </span>
                      <span style={{ fontFamily: 'Space Mono,monospace', fontSize: 9, color: B.dim }}>{left} of {tier.capacity} left</span>
                    </div>
                    <div style={{ height: 3, background: 'rgba(255,255,255,0.06)', borderRadius: 2, overflow: 'hidden' }}>
                      <div style={{ height: '100%', width: `${Math.min(pct * 100, 100)}%`, background: urgColor, borderRadius: 2 }} />
                    </div>
                  </div>

                  <div style={{ width: '100%', height: 1, background: 'rgba(255,255,255,0.07)', marginBottom: 20 }} />

                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 24 }}>
                    {tier.perks.map((perk, i) => (
                      <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                        <div style={{ width: 6, height: 6, borderRadius: '50%', background: tier.color, boxShadow: `0 0 8px ${tier.color}`, flexShrink: 0, marginTop: 5 }} />
                        <span style={{ fontFamily: "'Syne', sans-serif", fontSize: 13, color: B.smoke, lineHeight: 1.5 }}>{perk}</span>
                      </div>
                    ))}
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    <button
                      type="button"
                      onClick={() => handleSelectTierFromCard(tier, false)}
                      style={{
                        display: 'block', width: '100%', padding: '12px 0', textAlign: 'center',
                        background: tier.featured ? tier.color : 'transparent',
                        border: `1px solid ${tier.color}`,
                        borderRadius: 6,
                        fontFamily: 'Space Mono,monospace', fontSize: 9.5, fontWeight: 700,
                        color: tier.featured ? B.black : tier.color,
                        letterSpacing: '0.14em',
                        cursor: 'pointer',
                        boxShadow: tier.featured ? `0 0 24px ${tier.color}35` : 'none',
                        transition: 'all 0.2s',
                      }}
                    >
                      {pct >= 1 ? 'JOIN WAITLIST →' : 'GENERATE TERM SHEET & HOLD →'}
                    </button>
                    <button
                      type="button"
                      onClick={() => handleSelectTierFromCard(tier, true)}
                      style={{
                        display: 'block', width: '100%', padding: '9px 0', textAlign: 'center',
                        background: 'rgba(184,255,0,0.08)',
                        border: `1px dashed ${B.neonLime}60`,
                        borderRadius: 6,
                        fontFamily: 'Space Mono,monospace', fontSize: 8.5, fontWeight: 700,
                        color: B.neonLime,
                        letterSpacing: '0.12em',
                        cursor: 'pointer',
                      }}
                    >
                      ⚡ 1-CLICK WHATSAPP EXECUTIVE HOLD →
                    </button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Dual-Rail Landmark Hold & Term Sheet Generator */}
        <div id="sponsor-brief-form" style={{ maxWidth: 680, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 36 }}>
            <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 8, color: B.amber, letterSpacing: '0.3em', marginBottom: 10 }}>
              DUAL-RAIL CORPORATE CLOSING DESK
            </div>
            <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 38, color: B.white }}>
              GENERATE LANDMARK TERM SHEET & 72-HR HOLD
            </div>
            <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 13, color: B.smoke, marginTop: 8 }}>
              Lock your category exclusivity code (`SFS26-XXXX`), download a procurement-ready Corporate Term Sheet, or connect directly with our Executive Desk on WhatsApp.
            </div>
          </div>

          {submitted ? (
            <div className="card-3d" style={{ padding: '36px 28px', background: `rgba(0,240,255,0.03)`, border: `1px solid ${B.neonCyan}35`, borderRadius: 16 }}>
              <div style={{ textAlign: 'center', marginBottom: 24 }}>
                <div style={{ width: 52, height: 52, borderRadius: '50%', border: `2px solid ${B.neonLime}`, background: `${B.neonLime}12`, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 14px' }}>
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M5 13l4 4L19 7" stroke={B.neonLime} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </div>
                <div style={{ fontFamily: "'Orbitron', monospace", fontSize: 10, color: B.neonLime, letterSpacing: 3, marginBottom: 6 }}>72-HOUR LANDMARK HOLD ISSUED</div>
                <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 32, color: B.white }}>{form.brand} × {selectedTierObj.name}</div>
                <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 13, color: B.smoke, marginTop: 4 }}>
                  Monument: <strong style={{ color: B.white }}>{selectedTierObj.landmark}</strong> ({selectedTierObj.price})
                </div>
              </div>

              <div style={{ background: B.charcoal, border: `1px solid ${B.amber}50`, borderRadius: 10, padding: '18px', textAlign: 'center', marginBottom: 20 }}>
                <div style={{ fontFamily: 'Space Mono,monospace', fontSize: 9, color: B.smoke, letterSpacing: 2, marginBottom: 4 }}>OFFICIAL EXCLUSIVITY HOLD REFERENCE</div>
                <div style={{ fontFamily: 'Orbitron,monospace', fontSize: 22, color: B.amber, fontWeight: 900, letterSpacing: 3 }}>{holdRef}</div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 10, marginBottom: 12 }}>
                <a
                  href={buildSponsorWhatsAppUrl(holdRef, selectedTierObj, SOCIAL_LINKS.whatsappContact1)}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ padding: '14px 12px', background: B.neonLime, color: B.black, borderRadius: 8, fontFamily: 'Orbitron,monospace', fontSize: 10, fontWeight: 700, textAlign: 'center', textDecoration: 'none', letterSpacing: 1 }}
                >
                  💬 EXECUTIVE DESK 1 (+234 708) →
                </a>
                <a
                  href={buildSponsorWhatsAppUrl(holdRef, selectedTierObj, SOCIAL_LINKS.whatsappContact2)}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ padding: '14px 12px', background: 'rgba(184,255,0,0.14)', border: `1px solid ${B.neonLime}60`, color: B.neonLime, borderRadius: 8, fontFamily: 'Orbitron,monospace', fontSize: 10, fontWeight: 700, textAlign: 'center', textDecoration: 'none', letterSpacing: 1 }}
                >
                  💬 EXECUTIVE DESK 2 (+234 905) →
                </a>
              </div>

              <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                <button
                  type="button"
                  onClick={() => downloadSponsorTermSheetTxt(holdRef, selectedTierObj)}
                  style={{ flex: 1, minWidth: 220, padding: '13px', background: `${B.amber}18`, border: `1px solid ${B.amber}60`, borderRadius: 8, color: B.amber, fontFamily: 'Orbitron,monospace', fontSize: 10, fontWeight: 700, letterSpacing: 1.5, cursor: 'pointer' }}
                >
                  📄 DOWNLOAD CORPORATE TERM SHEET (.TXT) →
                </button>
                <button
                  type="button"
                  onClick={() => setSubmitted(false)}
                  style={{ padding: '13px 18px', background: 'transparent', border: '1px solid rgba(255,255,255,0.15)', borderRadius: 8, color: B.smoke, fontFamily: 'Space Mono,monospace', fontSize: 10, cursor: 'pointer' }}
                >
                  NEW HOLD
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={e => { e.preventDefault(); processSubmission(false) }} className="card-3d" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 16, overflow: 'hidden' }}>
              <div style={{ height: 3, background: `linear-gradient(90deg, ${B.amber}, ${B.neonCyan}, ${B.neonMagenta})` }} />
              <div style={{ padding: 32, display: 'flex', flexDirection: 'column', gap: 18 }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 14 }}>
                  <div>{lbl('BRAND / COMPANY *')}<input aria-label="Brand name" required value={form.brand} onChange={set('brand')} placeholder="e.g. Monster Energy / Martell" style={IS} onFocus={onFocus} onBlur={onBlur} /></div>
                  <div>{lbl('CONTACT PERSON & ROLE *')}<input aria-label="Your name" required value={form.contact} onChange={set('contact')} placeholder="e.g. Chuka Obi — Brand Manager" style={IS} onFocus={onFocus} onBlur={onBlur} /></div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 14 }}>
                  <div>{lbl('CORPORATE EMAIL *')}<input aria-label="Email address" required type="email" value={form.email} onChange={set('email')} placeholder="name@brand.com" style={IS} onFocus={onFocus} onBlur={onBlur} /></div>
                  <div>{lbl('DIRECT WHATSAPP / PHONE')}<input aria-label="Phone number" type="tel" value={form.phone} onChange={set('phone')} placeholder="+234 80..." style={IS} onFocus={onFocus} onBlur={onBlur} /></div>
                </div>
                <div>
                  {lbl('SELECT FREEDOM PARK LANDMARK TIER *')}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: 8 }}>
                    {TIERS.map(t => (
                      <button key={t.id} type="button" onClick={() => setForm(f => ({ ...f, tier: t.name }))}
                        style={{ padding: '10px 8px', background: form.tier === t.name ? `${t.color}18` : 'rgba(255,255,255,0.03)', border: `1px solid ${form.tier === t.name ? t.color : 'rgba(255,255,255,0.09)'}`, borderRadius: 6, cursor: 'pointer', fontFamily: 'Space Mono,monospace', fontSize: 9, color: form.tier === t.name ? t.color : B.smoke, letterSpacing: 1, transition: 'all 0.2s' }}>
                        <div>{t.name}</div>
                        <div style={{ fontSize: 8, opacity: 0.8, marginTop: 2 }}>{t.price}</div>
                      </button>
                    ))}
                  </div>
                </div>
                <div>{lbl('CAMPAIGN OBJECTIVES / CUSTOM ACTIVATION NOTES (optional)')}<textarea aria-label="What you want from this partnership" value={form.note} onChange={set('note')} placeholder="e.g. Category exclusivity for Energy Drinks + Main Amphitheatre 4-Way DJ Soundclash branding..." rows={3} style={{ ...IS, resize: 'vertical', lineHeight: 1.6 }} onFocus={onFocus} onBlur={onBlur} /></div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 10 }}>
                  <button
                    type="button"
                    disabled={loading || !form.brand.trim() || !form.email.includes('@')}
                    onClick={() => processSubmission(true)}
                    style={{ padding: '14px', background: 'rgba(184,255,0,0.14)', border: `1.5px solid ${B.neonLime}`, borderRadius: 8, color: B.neonLime, fontFamily: 'Orbitron,monospace', fontSize: 10.5, fontWeight: 700, letterSpacing: 1.5, cursor: 'pointer', transition: 'all 0.2s' }}
                  >
                    ⚡ LOCK HOLD VIA WHATSAPP EXECUTIVE DESK →
                  </button>
                  <button type="submit" disabled={loading}
                    style={{ padding: '14px', background: loading ? 'rgba(255,255,255,0.04)' : B.amber, border: 'none', borderRadius: 8, color: loading ? B.dim : B.black, fontFamily: 'Orbitron,monospace', fontSize: 11, fontWeight: 700, letterSpacing: 1.5, cursor: loading ? 'not-allowed' : 'pointer', boxShadow: loading ? 'none' : `0 0 28px ${B.amber}35`, transition: 'all 0.2s' }}>
                    {loading ? 'GENERATING HOLD…' : 'ISSUE HOLD REF & TERM SHEET →'}
                  </button>
                </div>
              </div>
            </form>
          )}

          <div style={{ textAlign: 'center', marginTop: 28, display: 'flex', flexDirection: 'column', gap: 8 }}>
            <div style={{ fontFamily: 'Space Mono,monospace', fontSize: 9, color: B.dim }}>Direct Executive Lines · Freedom Park Walkthroughs Available Daily</div>
            <div style={{ display: 'flex', justifyContent: 'center', gap: 20, flexWrap: 'wrap' }}>
              <a href={`mailto:${CONTACT_EMAIL}`} style={{ fontFamily: 'Space Mono,monospace', fontSize: 10, color: B.amber, textDecoration: 'none', letterSpacing: 1 }}>{CONTACT_EMAIL}</a>
              <a href={SOCIAL_LINKS.whatsappContact1 || SOCIAL_LINKS.whatsapp} target="_blank" rel="noopener noreferrer" style={{ fontFamily: 'Space Mono,monospace', fontSize: 10, color: B.neonLime, textDecoration: 'none', letterSpacing: 1 }}>WhatsApp Desk 1 (+234 708 411 1516) →</a>
              <a href={SOCIAL_LINKS.whatsappContact2 || SOCIAL_LINKS.whatsapp} target="_blank" rel="noopener noreferrer" style={{ fontFamily: 'Space Mono,monospace', fontSize: 10, color: B.neonCyan, textDecoration: 'none', letterSpacing: 1 }}>WhatsApp Desk 2 (+234 905 268 5799) →</a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
