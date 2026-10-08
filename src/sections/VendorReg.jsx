import { useState, useEffect, useCallback, useMemo } from 'react'
import { B } from '../tokens'
import { GrainOverlay, SectionTag } from '../components/Shared'
import { SOCIAL_LINKS } from '../config'
import { logReferralConversion } from '../lib/referral'
import Egg from '../components/Egg'
import { claudeChat, useAiAvailable } from '../lib/catalystAI'

const FORMSPREE = import.meta.env.VITE_FORMSPREE_ID || ''

const CATEGORIES = [
  'Sneakers & Deadstock',
  'Streetwear Apparel',
  'Accessories & Jewelry',
  'Vintage & Archive',
  'Custom Sneaker Art',
  'Restoration & Care',
  'Food & Gourmet Street Bites',
  'Tech & Creative Media',
  'Other',
]

const BOOTHS = [
  {
    id: 'standard',
    label: 'Standard Booth',
    tag: 'MOST POPULAR',
    size: '3 × 3 m (9 sqm)',
    basePrice: 150000,
    capacity: 20,
    recommendedFor: 'Emerging streetwear labels, single-table sellers & customizers',
    features: [
      '1 Heavy-duty display table + 2 chairs',
      'Standard 220V power connection',
      'Official SF26 engraved booth plaque',
      '2 All-day vendor crew wristbands',
      'Inclusion in the digital SF26 Vendor Guide',
    ],
  },
  {
    id: 'double',
    label: 'Double Retail Wing',
    tag: 'HIGH VOLUME',
    size: '6 × 3 m (18 sqm)',
    basePrice: 280000,
    capacity: 10,
    recommendedFor: 'Established footwear resellers, multibrand curators & apparel brands',
    features: [
      '2 Heavy display tables + 4 chairs',
      '2 Dedicated 15A high-load power feeds',
      'Double aisle frontage for high customer throughput',
      '4 All-day vendor crew wristbands',
      'Guaranteed high-traffic primary walkway placement',
      'Social media feature across @s_fest26 channels',
    ],
  },
  {
    id: 'premium',
    label: 'Premium Corner Pavilion',
    tag: 'PRIME JUNCTION',
    size: '4 × 4 m (16 sqm)',
    basePrice: 420000,
    capacity: 6,
    recommendedFor: 'Flagship sneaker boutiques, grail vaults & premier designers',
    features: [
      'High-traffic crossway corner with 270° visibility',
      'Dual customer walk-by display frontage',
      'Dedicated 32A power feed + overhead LED spotlight',
      'Lockable on-site overnight storage box',
      '6 All-day vendor crew wristbands',
      'Dedicated SF26 story & reel spotlight',
      'Priority product drop announcement on schedule',
    ],
  },
  {
    id: 'collab',
    label: 'Brand Experiential Activation',
    tag: 'BESPOKE',
    size: '8 × 8 m (64 sqm)',
    basePrice: 750000,
    capacity: 3,
    recommendedFor: 'Major consumer brands, headline sponsors & experiential activations',
    features: [
      'Custom activation footprint with structural build rights',
      'Main-stage MC live drop hype announcement',
      'Video wall commercial rotation during peak hours',
      'Exclusive festival drop collaboration rights',
      '10 All-access VIP crew credentials + VIP lounge',
      'Dedicated security detail & private concierge',
    ],
  },
]

const ADD_ONS = [
  {
    id: 'wifi',
    name: 'Starlink Low-Latency POS WiFi Node',
    price: 30000,
    desc: 'Dedicated low-latency WiFi link for seamless POS swipes and instant mobile bank transfers without cellular network congestion.',
  },
  {
    id: 'showcase',
    name: 'Lockable Acrylic Grail Display Case',
    price: 45000,
    desc: 'Tamper-resistant clear acrylic showcase with integrated halo LED illumination for high-value collector pairs.',
  },
  {
    id: 'extra_tables',
    name: 'Extra Display Table & 2 Chairs + Garment Rack',
    price: 20000,
    desc: 'Additional heavy-duty setup to maximize retail square footage.',
  },
  {
    id: 'mc_hype',
    name: 'Main-Stage MC Hype Announcement',
    price: 60000,
    desc: 'Live microphone drop and digital stage screen shoutout during peak traffic afternoon hours.',
  },
  {
    id: 'escrow_fast',
    name: 'Physical Legit-Check Fast Lane',
    price: 35000,
    desc: 'Priority on-site physical authentication passes with SF26 verified holographic tags for all your customer sales.',
  },
]

const FAQ = [
  {
    q: 'Who attends Sneakers Fest Lagos?',
    a: 'West Africa’s top sneakerheads, streetwear creators, archivist collectors, lifestyle photographers, musicians, and young urban professionals. Target Year 1 cohort: 1,000 to 2,500 qualified attendees ready to spend.',
  },
  {
    q: 'What is the selection and curation criteria?',
    a: 'Year 1 is strictly invitation-curated to guarantee authenticity and prevent bootlegs or poor-quality replicas. Applications are reviewed by our curatorial committee within 3 business days of submission.',
  },
  {
    q: 'Can I do an exclusive sneaker drop or collaborative release at SF26?',
    a: 'Absolutely. We actively encourage vendors to bring limited-run colorways, exclusive capsule apparel, or 1-of-1 customs. Select "Yes — I want a drop" during registration so our stage directors can schedule your launch.',
  },
  {
    q: 'What are the payment terms and installment options?',
    a: 'You can choose between Full Upfront Settlement (which earns a 5% instant discount) or a Flexible 2-Stage Split (50% commitment deposit upon acceptance to lock your booth number, with the remaining 50% due by Nov 25, 2026).',
  },
  {
    q: 'What utilities are provided at each stall?',
    a: 'Each booth comes with dedicated table fixtures, chairs, official booth plaque, certified 220V power outlets, and load-in assistance starting from 8:00 AM on event day.',
  },
]

const CONFIRMED_VENDORS = [
  { name: 'Sole Lagos', cat: 'Sneakers & Deadstock', city: 'Lagos', ig: '@solelagos', color: B.amber, booth: 'Premium Corner Pavilion', bringing: 'Deadstock Air Jordan collection + exclusive Lagos colourways' },
  { name: 'Kicksurge NG', cat: 'Sneakers & Deadstock', city: 'Abuja', ig: '@kicksurgeng', color: B.neonCyan, booth: 'Double Retail Wing', bringing: 'Rare Adidas and Nike imports and limited edition runners' },
  { name: 'Stitch and Sole', cat: 'Custom Sneaker Art', city: 'Lagos', ig: '@stitchedsole', color: B.neonMagenta, booth: 'Standard Booth', bringing: 'Live customisation station — bring your blank canvas pair' },
  { name: 'Lagos Drip Haus', cat: 'Streetwear Apparel', city: 'Lagos', ig: '@lagosdrip', color: B.neonLime, booth: 'Double Retail Wing', bringing: 'Lagos-made streetwear capsule and unreleased collab pieces' },
  { name: 'The Sneaker Lab', cat: 'Restoration & Care', city: 'Lagos', ig: '@sneakerlab.ng', color: B.amber, booth: 'Double Retail Wing', bringing: 'Authentication service + curated grail collection for sale' },
  { name: 'Afro Threads', cat: 'Streetwear Apparel', city: 'Port Harcourt', ig: '@afrothreads', color: B.neonCyan, booth: 'Standard Booth', bringing: 'Pan-African streetwear brand debut — first Lagos pop-up ever' },
  { name: 'Lagos Kicks Clinic', cat: 'Accessories & Jewelry', city: 'Lagos', ig: '@kicksclinic', color: B.neonLime, booth: 'Standard Booth', bringing: 'Sneaker restoration, deep cleaning, and custom lace bar' },
  { name: 'NoFilter Lagos', cat: 'Tech & Creative Media', city: 'Lagos', ig: '@nofilter.lag', color: B.amber, booth: 'Standard Booth', bringing: 'Event editorial photography + instant print gallery for buyers' },
  { name: 'Street Eats Lagos', cat: 'Food & Gourmet Street Bites', city: 'Lagos', ig: '@streeteats.lag', color: B.neonLime, booth: 'Standard Booth', bringing: 'Artisan suya, gourmet jollof cones, and craft cocktails' },
  { name: 'Chike Creatives', cat: 'Custom Sneaker Art', city: 'Lagos', ig: '@chikecreates', color: B.neonMagenta, booth: 'Standard Booth', bringing: 'Limited edition SF26 metallic prints and collector canvases' },
]

const MAP_ZONES = [
  { id: 'collab', label: 'STAGE / COLLAB ZONE', hint: '64 sqm Activation Footprint' },
  { id: 'premium', label: 'PREMIUM CORNERS', hint: '16 sqm 270° Crossways' },
  { id: 'double', label: 'DOUBLE RETAIL WINGS', hint: '18 sqm High-Traffic Corridor' },
  { id: 'standard', label: 'STANDARD FLOOR', hint: '9 sqm Curated Arcade' },
]

function genAppId() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  let id = 'VSF26-'
  for (let i = 0; i < 6; i++) id += chars[Math.floor(Math.random() * chars.length)]
  return id
}

export default function VendorReg() {
  const aiReady = useAiAvailable()
  const [step, setStep] = useState(0)
  const [form, setForm] = useState({
    booth: 'standard',
    business: '',
    contact: '',
    email: '',
    phone: '',
    category: 'Sneakers & Deadstock',
    instagram: '',
    twitter: '',
    website: '',
    deckUrl: '',
    exclusiveDrop: 'YES — I WANT A DROP',
    bio: '',
    paymentPlan: 'full', // 'full' or 'split'
    selectedAddOns: [],
    estimatedMargin: 25000,
  })

  const [status, setStatus] = useState('idle')
  const [openFaq, setOpenFaq] = useState(null)
  const [appId, setAppId] = useState('')
  const [taken, setTaken] = useState({ standard: 8, double: 5, premium: 3, collab: 1 })
  const [existingApp, setExistingApp] = useState(null)
  const [showPrevBanner, setShowPrevBanner] = useState(false)
  const [pitchLoading, setPitchLoading] = useState(false)
  const [pitchError, setPitchError] = useState('')
  const [vendorCatFilter, setVendorCatFilter] = useState('ALL')

  // Real-time Status Lookup Tool State
  const [trackerOpen, setTrackerOpen] = useState(false)
  const [lookupId, setLookupId] = useState('')
  const [lookupResult, setLookupResult] = useState(null)
  const [lookupLoading, setLookupLoading] = useState(false)
  const [lookupError, setLookupError] = useState('')

  // Load existing data
  useEffect(() => {
    try {
      const savedTaken = JSON.parse(localStorage.getItem('sf26_vendor_taken') || '{}')
      if (Object.keys(savedTaken).length) setTaken(t => ({ ...t, ...savedTaken }))
      const draft = JSON.parse(localStorage.getItem('sf26_vendor_draft') || 'null')
      if (draft) setForm(f => ({ ...f, ...draft }))
      const apps = JSON.parse(localStorage.getItem('sf26_vendor_apps') || '[]')
      if (apps.length) {
        setExistingApp(apps[apps.length - 1])
        setShowPrevBanner(true)
      }
    } catch {}
  }, [])

  // Auto-save draft
  useEffect(() => {
    if (status !== 'success') {
      try {
        localStorage.setItem('sf26_vendor_draft', JSON.stringify(form))
      } catch {}
    }
  }, [form, status])

  const setField = k => e => setForm(f => ({ ...f, [k]: e.target.value }))

  const toggleAddOn = id => {
    setForm(f => {
      const exists = f.selectedAddOns.includes(id)
      return {
        ...f,
        selectedAddOns: exists ? f.selectedAddOns.filter(x => x !== id) : [...f.selectedAddOns, id],
      }
    })
  }

  // Pricing calculations
  const selectedBooth = BOOTHS.find(b => b.id === form.booth) || BOOTHS[0]
  const basePrice = selectedBooth.basePrice || 0
  const isEarlyBird = true // Early bird active
  const earlyBirdDiscount = isEarlyBird ? Math.round(basePrice * 0.10) : 0
  const discountedBase = basePrice - earlyBirdDiscount

  const addOnsTotal = useMemo(() => {
    return form.selectedAddOns.reduce((sum, addOnId) => {
      const item = ADD_ONS.find(a => a.id === addOnId)
      return sum + (item ? item.price : 0)
    }, 0)
  }, [form.selectedAddOns])

  const upfrontDiscount = form.paymentPlan === 'full' ? Math.round((discountedBase + addOnsTotal) * 0.05) : 0
  const netTotal = discountedBase + addOnsTotal - upfrontDiscount
  const depositDueNow = form.paymentPlan === 'split' ? Math.round(netTotal * 0.50) : netTotal
  const secondInstallment = form.paymentPlan === 'split' ? netTotal - depositDueNow : 0

  // Break-even pair calculation
  const pairsToBreakEven = Math.max(1, Math.ceil(netTotal / (form.estimatedMargin || 25000)))
  const estimatedAttendees = 1750
  const conversionNeeded = ((pairsToBreakEven / estimatedAttendees) * 100).toFixed(1)

  // AI Pitch Generator
  const generatePitch = useCallback(async () => {
    if (!aiReady) {
      setPitchError('AI bio assistant is preparing. Feel free to type your brand bio below.')
      return
    }
    setPitchLoading(true)
    setPitchError('')
    try {
      const prompt = `Write a compelling 250-character vendor application bio for Sneakers Fest '26 at Muri Okunola Park, Victoria Island, Lagos.
Brand: ${form.business || 'Lagos Streetwear Collective'}
Product Line: ${form.category}
Booth Tier: ${selectedBooth.label}
Drop Intention: ${form.exclusiveDrop}
${form.instagram ? `Instagram: @${form.instagram}` : ''}

Tone: Culturally rooted in Lagos street energy, razor-sharp commercial appeal, confident and authentic. Keep it under 280 characters.`

      const result = await claudeChat([{ role: 'user', content: prompt }], {
        feature: 'VendorReg',
        model: 'balanced',
        system: 'You are the curatorial director for Sneakers Fest Lagos. Write punchy, high-impact vendor pitches.',
      })
      setForm(f => ({ ...f, bio: result.slice(0, 300) }))
    } catch (e) {
      setPitchError(e.message || 'Error generating pitch')
    }
    setPitchLoading(false)
  }, [aiReady, form.business, form.category, selectedBooth.label, form.exclusiveDrop, form.instagram])

  // Validation
  function canNext() {
    if (step === 0) return !!form.booth
    if (step === 1) return !!(form.business.trim() && form.contact.trim() && form.email.includes('@') && form.phone.trim() && form.category)
    if (step === 2) return form.bio.trim().length >= 20
    return true
  }

  // Application submission
  async function submit() {
    const id = genAppId()
    setStatus('loading')
    const payload = {
      ...form,
      applicationId: id,
      tierLabel: selectedBooth.label,
      totalQuoted: netTotal,
      depositDue: depositDueNow,
      _subject: `Vendor Application [${id}] — ${form.business} (${selectedBooth.label})`,
    }

    let ok = false

    // Netlify Forms
    try {
      const nlBody = new URLSearchParams({
        'form-name': 'vendor-registration',
        'bot-field': '',
        business: form.business,
        contact: form.contact,
        email: form.email,
        phone: form.phone,
        category: form.category,
        booth: form.booth,
        tierLabel: selectedBooth.label,
        paymentPlan: form.paymentPlan,
        totalQuoted: String(netTotal),
        depositDue: String(depositDueNow),
        instagram: form.instagram || '',
        twitter: form.twitter || '',
        website: form.website || '',
        bio: form.bio,
        applicationId: id,
      })
      const r = await fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: nlBody.toString(),
      })
      if (r.ok) ok = true
    } catch {}

    // Netlify Function
    try {
      const r = await fetch('/.netlify/functions/vendor-apply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.contact,
          email: form.email,
          phone: form.phone,
          businessName: form.business,
          boothType: form.booth,
          tierLabel: selectedBooth.label,
          category: form.category,
          instagram: form.instagram || '',
          twitter: form.twitter || '',
          website: form.website || '',
          deckUrl: form.deckUrl || '',
          exclusiveDrop: form.exclusiveDrop || '',
          bio: form.bio,
          paymentPlan: form.paymentPlan,
          totalQuoted: netTotal,
          depositDue: depositDueNow,
          applicationId: id,
        }),
      })
      if (r.ok) ok = true
    } catch {}

    // Formspree fallback
    if (!ok && FORMSPREE) {
      try {
        const r = await fetch(`https://formspree.io/f/${FORMSPREE}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
          body: JSON.stringify(payload),
        })
        if (r.ok) ok = true
      } catch {}
    }

    if (ok) {
      const nextTaken = { ...taken, [selectedBooth.id]: (taken[selectedBooth.id] || 0) + 1 }
      setTaken(nextTaken)
      try {
        localStorage.setItem('sf26_vendor_taken', JSON.stringify(nextTaken))
        const apps = JSON.parse(localStorage.getItem('sf26_vendor_apps') || '[]')
        apps.push({ ...payload, submittedAt: new Date().toISOString(), status: 'pending' })
        localStorage.setItem('sf26_vendor_apps', JSON.stringify(apps))
        localStorage.removeItem('sf26_vendor_draft')
      } catch {}
      logReferralConversion('vendor', { booth: form.booth, total: netTotal })
      setAppId(id)
      setStatus('success')
    } else {
      setStatus('error')
    }
  }

  // Status Lookup logic
  async function handleLookup(e) {
    e.preventDefault()
    const cleanId = lookupId.trim().toUpperCase()
    if (!cleanId) return
    setLookupLoading(true)
    setLookupError('')
    setLookupResult(null)

    // Check localStorage first
    try {
      const localApps = JSON.parse(localStorage.getItem('sf26_vendor_apps') || '[]')
      const localFound = localApps.find(a => a.applicationId === cleanId)
      if (localFound) {
        setLookupResult({
          applicationId: localFound.applicationId,
          business: localFound.business,
          booth: localFound.tierLabel || localFound.booth,
          category: localFound.category,
          status: localFound.status || 'pending',
          submittedAt: localFound.submittedAt,
        })
        setLookupLoading(false)
        return
      }
    } catch {}

    // Query backend
    try {
      const res = await fetch(`/.netlify/functions/vendor-status?applicationId=${encodeURIComponent(cleanId)}`)
      if (res.ok) {
        const data = await res.json()
        if (data.application) {
          setLookupResult(data.application)
          setLookupLoading(false)
          return
        }
      }
    } catch {}

    // Fallback mock for demo codes
    if (cleanId.startsWith('VSF') || cleanId.startsWith('VDR')) {
      setLookupResult({
        applicationId: cleanId,
        business: form.business || 'Registered Partner Brand',
        booth: selectedBooth.label,
        category: form.category,
        status: 'under_review',
        submittedAt: new Date().toISOString(),
      })
    } else {
      setLookupError(`No record found for Application ID: ${cleanId}. Please check the code sent to your email.`)
    }
    setLookupLoading(false)
  }

  const IS = {
    width: '100%',
    padding: '14px 16px',
    background: 'rgba(255,255,255,0.035)',
    border: '1px solid rgba(255,255,255,0.12)',
    borderRadius: 8,
    color: B.white,
    fontFamily: 'Space Mono, monospace',
    fontSize: 14,
    outline: 'none',
    boxSizing: 'border-box',
    transition: 'border-color 0.2s',
  }

  const lbl = text => (
    <label style={{ fontFamily: 'Space Mono, monospace', fontSize: 9, color: B.smoke, letterSpacing: '0.22em', display: 'block', marginBottom: 8 }}>
      {text}
    </label>
  )

  const onFocus = e => (e.target.style.borderColor = B.neonCyan + '80')
  const onBlur = e => (e.target.style.borderColor = 'rgba(255,255,255,0.12)')

  const STEPS = [
    { label: 'BOOTH TIER', subtitle: 'Capacity & Inclusions' },
    { label: 'BRAND PROFILE', subtitle: 'Identity & Contacts' },
    { label: 'PROPOSAL', subtitle: 'Drop & AI Pitch' },
    { label: 'PRICING BREAKDOWN', subtitle: 'ROI & Submission' },
  ]

  const STATUS_STAGES = [
    { num: '01', title: 'RECEIVED', desc: 'Logged in queue', color: B.neonCyan, stage: 'pending' },
    { num: '02', title: 'UNDER REVIEW', desc: 'Curatorial Board', color: B.amber, stage: 'under_review' },
    { num: '03', title: 'SHORTLISTED', desc: 'Booth Allocated', color: B.neonLime, stage: 'approved' },
    { num: '04', title: 'CONFIRMED', desc: 'Dec 12, Lagos', color: B.neonMagenta, stage: 'confirmed' },
  ]

  return (
    <section id="vendors" style={{ position: 'relative', overflow: 'hidden', background: B.black, padding: '100px 24px' }}>
      <GrainOverlay />
      <Egg id="egg-095" corner="top-right" />
      <Egg id="egg-096" corner="bottom-left" />

      {/* Ambient background glow */}
      <div style={{ position: 'absolute', top: '15%', right: '-10%', width: 500, height: 500, background: `radial-gradient(circle, ${B.amber}08 0%, transparent 70%)`, filter: 'blur(90px)', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', bottom: '15%', left: '-10%', width: 500, height: 500, background: `radial-gradient(circle, ${B.neonCyan}08 0%, transparent 70%)`, filter: 'blur(90px)', pointerEvents: 'none' }} />

      <div style={{ position: 'relative', zIndex: 10, maxWidth: 980, margin: '0 auto' }}>
        
        {/* Header Header & Actions */}
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
            <SectionTag>OFFICIAL VENDOR PORTAL</SectionTag>
            <span style={{ padding: '3px 8px', background: `${B.neonLime}18`, border: `1px solid ${B.neonLime}40`, borderRadius: 4, fontFamily: 'Space Mono, monospace', fontSize: 9, color: B.neonLime, letterSpacing: 1 }}>
              YEAR 1 COHORT
            </span>
          </div>

          <h2 className="reveal-3d text-3d" style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 'clamp(42px, 7vw, 76px)', color: B.white, lineHeight: 0.92, marginBottom: 16 }}>
            SECURE YOUR <span style={{ color: B.amber }}>RETAIL BOOTH</span>
          </h2>

          <p style={{ fontFamily: "'Syne', sans-serif", fontSize: 15, color: B.smoke, lineHeight: 1.7, maxWidth: 640, margin: '0 auto 24px' }}>
            Year 1 is strictly invitation-curated to showcase West Africa's finest sneaker boutiques, rare collectors, streetwear pioneers, and artisan customizers. 
            Claim your space at Muri Okunola Park, Victoria Island.
          </p>

          {/* Quick Action Pills */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: 12, flexWrap: 'wrap' }}>
            <button
              onClick={() => setTrackerOpen(true)}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 8,
                padding: '8px 16px', background: `${B.charcoal}`, border: `1px solid ${B.neonCyan}40`,
                borderRadius: 20, color: B.neonCyan, fontFamily: 'Space Mono, monospace', fontSize: 11,
                cursor: 'pointer', transition: 'all 0.2s',
              }}
              onMouseEnter={e => (e.currentTarget.style.borderColor = B.neonCyan)}
              onMouseLeave={e => (e.currentTarget.style.borderColor = `${B.neonCyan}40`)}
            >
              <span>🔍</span> TRACK APPLICATION STATUS
            </button>
            <a
              href="#confirmed-vendors"
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 8,
                padding: '8px 16px', background: 'transparent', border: `1px solid rgba(255,255,255,0.15)`,
                borderRadius: 20, color: B.smoke, fontFamily: 'Space Mono, monospace', fontSize: 11,
                textDecoration: 'none', transition: 'all 0.2s',
              }}
              onMouseEnter={e => { e.currentTarget.style.color = B.white; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.3)' }}
              onMouseLeave={e => { e.currentTarget.style.color = B.smoke; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)' }}
            >
              <span>📋</span> VIEW CONFIRMED ROSTER ({CONFIRMED_VENDORS.length})
            </a>
          </div>
        </div>

        {/* Top Metric Strip */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 12, marginBottom: 40 }}>
          {[
            { n: '1,000–2,500', l: 'QUALIFIED BUYERS', c: B.neonCyan, hint: 'High-intent foot traffic' },
            { n: '30 SPOTS', l: 'CURATED LIMIT', c: B.amber, hint: 'No bootlegs / replica filter' },
            { n: 'DEC 12', l: 'VICTORIA ISLAND', c: B.neonLime, hint: 'Muri Okunola Park' },
            { n: '10% OFF', l: 'EARLY BIRD TIER', c: B.neonMagenta, hint: 'First 15 confirmed brands' },
          ].map((s, i) => (
            <div key={i} className="card-3d" style={{ padding: '18px 16px', background: B.charcoal, border: `1px solid ${s.c}28`, borderRadius: 10, textAlign: 'center' }}>
              <div style={{ fontFamily: "'Orbitron', monospace", fontWeight: 900, fontSize: 20, color: s.c, textShadow: `0 0 16px ${s.c}30` }}>{s.n}</div>
              <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 9, color: B.white, letterSpacing: '0.15em', marginTop: 4 }}>{s.l}</div>
              <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 8, color: B.dim, marginTop: 4 }}>{s.hint}</div>
            </div>
          ))}
        </div>

        {/* Existing Application Banner */}
        {showPrevBanner && existingApp && (
          <div style={{ marginBottom: 28, background: `${B.amber}0C`, border: `1px solid ${B.amber}35`, borderRadius: 12, padding: '16px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
            <div>
              <div style={{ fontFamily: 'Space Mono, monospace', fontSize: 9, color: B.amber, letterSpacing: 2 }}>EXISTING SUBMISSION FOUND</div>
              <div style={{ fontFamily: 'Orbitron, monospace', fontSize: 15, color: B.white, letterSpacing: 2, marginTop: 2 }}>{existingApp.applicationId}</div>
              <div style={{ fontFamily: 'Space Mono, monospace', fontSize: 10, color: B.smoke, marginTop: 2 }}>
                {existingApp.business} · Tier: {existingApp.tierLabel || existingApp.booth}
              </div>
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <button
                onClick={() => {
                  setLookupId(existingApp.applicationId)
                  setTrackerOpen(true)
                  handleLookup({ preventDefault: () => {} })
                }}
                style={{ padding: '8px 14px', background: `${B.amber}20`, border: `1px solid ${B.amber}60`, borderRadius: 6, color: B.amber, fontFamily: 'Space Mono, monospace', fontSize: 10, cursor: 'pointer' }}
              >
                CHECK PROGRESS →
              </button>
              <button
                onClick={() => setShowPrevBanner(false)}
                style={{ padding: '8px 12px', background: 'transparent', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 6, color: B.smoke, fontFamily: 'Space Mono, monospace', fontSize: 10, cursor: 'pointer' }}
              >
                DISMISS
              </button>
            </div>
          </div>
        )}

        {/* SUCCESS SCREEN */}
        {status === 'success' ? (
          <div className="card-3d" style={{ padding: '44px 32px', background: `rgba(0,240,255,0.03)`, border: `1px solid ${B.neonCyan}30`, borderRadius: 16 }}>
            <div style={{ textAlign: 'center', marginBottom: 32 }}>
              <div style={{ width: 64, height: 64, borderRadius: '50%', border: `2px solid ${B.neonLime}`, background: `${B.neonLime}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none"><path d="M5 13l4 4L19 7" stroke={B.neonLime} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </div>
              <div style={{ fontFamily: "'Orbitron', monospace", fontSize: 11, color: B.neonLime, letterSpacing: 3, marginBottom: 8 }}>APPLICATION LOGGED</div>
              <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 40, color: B.white, marginBottom: 6 }}>PROVISIONAL QUOTE GENERATED</div>
              <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 14, color: B.smoke, maxWidth: 500, margin: '0 auto' }}>
                Thank you, <span style={{ color: B.white }}>{form.business}</span>. An invoice and intake package has been generated for <span style={{ color: B.amber }}>{form.email}</span>.
              </div>
            </div>

            {/* Application Voucher Box */}
            <div style={{ background: `${B.charcoal}`, border: `1px solid ${B.amber}40`, borderRadius: 12, padding: '24px 20px', textAlign: 'center', marginBottom: 28 }}>
              <div style={{ fontFamily: 'Space Mono, monospace', fontSize: 10, color: B.smoke, letterSpacing: 2, marginBottom: 6 }}>YOUR OFFICIAL VENDOR REFERENCE</div>
              <div style={{ fontFamily: 'Orbitron, monospace', fontSize: 26, color: B.amber, letterSpacing: 4, fontWeight: 700 }}>{appId}</div>
              <div style={{ marginTop: 14, display: 'flex', justifyContent: 'center', gap: 20, flexWrap: 'wrap', fontFamily: 'Space Mono, monospace', fontSize: 11, color: B.smoke }}>
                <span>Tier: <strong style={{ color: B.white }}>{selectedBooth.label}</strong></span>
                <span>Net Quote: <strong style={{ color: B.amber }}>₦{netTotal.toLocaleString('en-NG')}</strong></span>
                <span>Payment Plan: <strong style={{ color: B.neonCyan }}>{form.paymentPlan === 'full' ? 'Full Settlement (5% Saved)' : '2-Stage Split'}</strong></span>
              </div>
            </div>

            {/* 4-Stage Progress visualizer */}
            <div style={{ marginBottom: 32 }}>
              <div style={{ fontFamily: 'Space Mono, monospace', fontSize: 10, color: B.smoke, letterSpacing: 2, marginBottom: 18, textAlign: 'center' }}>
                ONBOARDING ROADMAP
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: 12 }}>
                {STATUS_STAGES.map((s, i) => (
                  <div key={i} style={{ padding: '12px 10px', background: i === 0 ? `${s.color}15` : 'rgba(255,255,255,0.03)', border: `1px solid ${i === 0 ? s.color : 'rgba(255,255,255,0.08)'}`, borderRadius: 8, textAlign: 'center' }}>
                    <div style={{ fontFamily: 'Orbitron, monospace', fontSize: 11, color: i === 0 ? s.color : B.dim, fontWeight: 700 }}>{s.num} {i === 0 ? '✓' : ''}</div>
                    <div style={{ fontFamily: 'Space Mono, monospace', fontSize: 10, color: i === 0 ? B.white : B.dim, marginTop: 4 }}>{s.title}</div>
                    <div style={{ fontFamily: 'Space Mono, monospace', fontSize: 8, color: B.dim, marginTop: 2 }}>{s.desc}</div>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              <a
                href={`${SOCIAL_LINKS.whatsapp}?text=${encodeURIComponent(`Hello SF26 Team, I just submitted Vendor Application [${appId}] for ${form.business} (${selectedBooth.label}). Kindly verify my allocation.`)}`}
                target="_blank"
                rel="noopener noreferrer"
                style={{ flex: 1, minWidth: 240, padding: '14px', background: B.neonLime, borderRadius: 8, color: B.black, fontFamily: 'Bebas Neue, sans-serif', fontSize: 18, letterSpacing: 3, textDecoration: 'none', textAlign: 'center', boxShadow: `0 0 24px ${B.neonLime}30` }}
              >
                FAST-TRACK ON WHATSAPP →
              </a>
              <button
                onClick={() => { setStatus('idle'); setStep(0) }}
                style={{ padding: '14px 20px', background: 'transparent', border: '1px solid rgba(255,255,255,0.15)', borderRadius: 8, color: B.smoke, fontFamily: 'Space Mono, monospace', fontSize: 11, cursor: 'pointer' }}
              >
                SUBMIT ANOTHER APPLICATION
              </button>
            </div>
          </div>
        ) : (
          /* REGISTRATION MULTI-STEP PORTAL */
          <div>
            {/* Step Progress Stepper */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8, marginBottom: 32 }}>
              {STEPS.map((s, i) => (
                <div
                  key={i}
                  onClick={() => i < step && setStep(i)}
                  style={{
                    padding: '12px 10px',
                    background: i === step ? `${B.amber}15` : i < step ? `${B.neonCyan}0E` : 'rgba(255,255,255,0.02)',
                    border: `1px solid ${i === step ? B.amber : i < step ? B.neonCyan + '50' : 'rgba(255,255,255,0.06)'}`,
                    borderRadius: 8,
                    cursor: i < step ? 'pointer' : 'default',
                    transition: 'all 0.25s',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                    <span style={{ fontFamily: 'Orbitron, monospace', fontSize: 11, fontWeight: 700, color: i === step ? B.amber : i < step ? B.neonCyan : B.dim }}>
                      0{i + 1}
                    </span>
                    <span style={{ fontFamily: 'Space Mono, monospace', fontSize: 9, color: i === step ? B.amber : i < step ? B.neonCyan : B.smoke, letterSpacing: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {s.label}
                    </span>
                  </div>
                  <div style={{ fontFamily: 'Space Mono, monospace', fontSize: 8, color: B.dim, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {s.subtitle}
                  </div>
                </div>
              ))}
            </div>

            {/* Step Card Container */}
            <div className="card-3d" style={{ background: 'rgba(255,255,255,0.03)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.09)', borderRadius: 16, overflow: 'hidden' }}>
              <div style={{ height: 3, background: `linear-gradient(90deg, ${B.neonCyan}, ${B.amber}, ${B.neonMagenta})` }} />

              <div style={{ padding: 'clamp(20px, 4vw, 36px)', display: 'flex', flexDirection: 'column', gap: 28 }}>
                
                {/* ── STEP 0: BOOTH TIER SELECTION & ADD-ONS ── */}
                {step === 0 && (
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 10, marginBottom: 14 }}>
                      {lbl('STEP 1 OF 4: SELECT BOOTH TIER & FOOTPRINT *')}
                      <span style={{ fontFamily: 'Space Mono, monospace', fontSize: 9, color: B.neonLime }}>
                        ★ 10% EARLY BIRD DISCOUNT ACTIVE
                      </span>
                    </div>

                    {/* Venue Floor Plan Visualizer */}
                    <div style={{ marginBottom: 20 }}>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 8 }}>
                        {MAP_ZONES.map(z => {
                          const booth = BOOTHS.find(b => b.id === z.id)
                          const isSel = form.booth === z.id
                          const spotsTaken = taken[z.id] || 0
                          const spotsLeft = (booth ? booth.capacity : 0) - spotsTaken
                          const isFull = spotsLeft <= 0
                          return (
                            <div
                              key={z.id}
                              onClick={() => !isFull && setForm(f => ({ ...f, booth: z.id }))}
                              style={{
                                padding: '12px 14px',
                                borderRadius: 8,
                                cursor: isFull ? 'not-allowed' : 'pointer',
                                background: isSel ? `${B.neonCyan}15` : 'rgba(255,255,255,0.02)',
                                border: `1px solid ${isSel ? B.neonCyan : 'rgba(255,255,255,0.08)'}`,
                                opacity: isFull ? 0.45 : 1,
                                transition: 'all 0.2s',
                              }}
                            >
                              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                                <span style={{ fontFamily: 'Orbitron, monospace', fontSize: 10, color: isSel ? B.neonCyan : B.white, fontWeight: 700 }}>
                                  {z.label}
                                </span>
                                <span style={{ fontFamily: 'Space Mono, monospace', fontSize: 8, color: isFull ? B.neonMagenta : isSel ? B.neonCyan : B.smoke }}>
                                  {isFull ? 'FULL' : `${spotsLeft} LEFT`}
                                </span>
                              </div>
                              <div style={{ fontFamily: 'Space Mono, monospace', fontSize: 9, color: B.dim }}>{z.hint}</div>
                            </div>
                          )
                        })}
                      </div>
                    </div>

                    {/* Tier Selection Cards */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(270px, 1fr))', gap: 16, marginBottom: 28 }}>
                      {BOOTHS.map(b => {
                        const isSel = form.booth === b.id
                        const spotsLeft = b.capacity - (taken[b.id] || 0)
                        const isFull = spotsLeft <= 0
                        const discPrice = Math.round(b.basePrice * 0.90)

                        return (
                          <div
                            key={b.id}
                            onClick={() => !isFull && setForm(f => ({ ...f, booth: b.id }))}
                            style={{
                              padding: 20,
                              borderRadius: 12,
                              cursor: isFull ? 'not-allowed' : 'pointer',
                              border: `1.5px solid ${isSel ? B.neonCyan : 'rgba(255,255,255,0.09)'}`,
                              background: isSel ? `${B.neonCyan}09` : isFull ? 'rgba(255,255,255,0.015)' : 'rgba(255,255,255,0.03)',
                              transition: 'all 0.25s',
                              position: 'relative',
                              display: 'flex',
                              flexDirection: 'column',
                              justifyContent: 'space-between',
                            }}
                          >
                            {b.tag && (
                              <div style={{ position: 'absolute', top: 12, right: 12, padding: '2px 8px', background: isSel ? B.neonCyan : `${B.amber}20`, border: `1px solid ${isSel ? B.neonCyan : B.amber + '60'}`, borderRadius: 4, fontFamily: 'Space Mono, monospace', fontSize: 8, color: isSel ? B.black : B.amber, fontWeight: 700 }}>
                                {b.tag}
                              </div>
                            )}

                            <div>
                              <div style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: 22, color: isSel ? B.neonCyan : B.white, letterSpacing: 1 }}>
                                {b.label}
                              </div>
                              <div style={{ fontFamily: 'Space Mono, monospace', fontSize: 10, color: B.smoke, marginTop: 2 }}>
                                {b.size}
                              </div>
                              <div style={{ fontFamily: 'Syne, sans-serif', fontSize: 11, color: B.dim, marginTop: 6, lineHeight: 1.5 }}>
                                {b.recommendedFor}
                              </div>

                              {/* Price Block */}
                              <div style={{ margin: '14px 0 16px', padding: '10px 12px', background: 'rgba(0,0,0,0.3)', borderRadius: 6, border: '1px solid rgba(255,255,255,0.05)' }}>
                                <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
                                  <span style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: 26, color: B.amber }}>
                                    ₦{discPrice.toLocaleString('en-NG')}
                                  </span>
                                  {b.basePrice && (
                                    <span style={{ fontFamily: 'Space Mono, monospace', fontSize: 10, color: B.dim, textDecoration: 'line-through' }}>
                                      ₦{b.basePrice.toLocaleString('en-NG')}
                                    </span>
                                  )}
                                </div>
                                <div style={{ fontFamily: 'Space Mono, monospace', fontSize: 8, color: B.neonLime, marginTop: 2 }}>
                                  Early bird rate applied · Saves ₦{(b.basePrice - discPrice).toLocaleString('en-NG')}
                                </div>
                              </div>

                              {/* Feature list */}
                              <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 16px', display: 'flex', flexDirection: 'column', gap: 6 }}>
                                {b.features.map(f => (
                                  <li key={f} style={{ fontFamily: 'Syne, sans-serif', fontSize: 11, color: isSel ? B.white : B.smoke, display: 'flex', gap: 8, alignItems: 'flex-start' }}>
                                    <span style={{ color: isSel ? B.neonCyan : B.amber, flexShrink: 0 }}>✓</span>
                                    <span>{f}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>

                            <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: 10, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                              <span style={{ fontFamily: 'Space Mono, monospace', fontSize: 9, color: B.smoke }}>
                                {spotsLeft} of {b.capacity} spaces left
                              </span>
                              <span style={{ fontFamily: 'Space Mono, monospace', fontSize: 9, color: isSel ? B.neonCyan : B.dim, fontWeight: 700 }}>
                                {isSel ? '● SELECTED' : 'TAP TO SELECT'}
                              </span>
                            </div>
                          </div>
                        )
                      })}
                    </div>

                    {/* Add-On Bundle Configurator */}
                    <div style={{ marginTop: 20, padding: 20, background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 10, marginBottom: 14 }}>
                        <span style={{ fontFamily: 'Orbitron, monospace', fontSize: 11, color: B.amber, letterSpacing: 2 }}>
                          OPTIONAL LOGISTICS & PROMOTIONAL ADD-ONS
                        </span>
                        <span style={{ fontFamily: 'Space Mono, monospace', fontSize: 9, color: B.smoke }}>
                          Total Add-ons: <strong style={{ color: B.white }}>₦{addOnsTotal.toLocaleString('en-NG')}</strong>
                        </span>
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 10 }}>
                        {ADD_ONS.map(item => {
                          const active = form.selectedAddOns.includes(item.id)
                          return (
                            <div
                              key={item.id}
                              onClick={() => toggleAddOn(item.id)}
                              style={{
                                padding: '12px 14px',
                                borderRadius: 8,
                                cursor: 'pointer',
                                background: active ? `${B.amber}14` : 'rgba(255,255,255,0.02)',
                                border: `1px solid ${active ? B.amber : 'rgba(255,255,255,0.06)'}`,
                                transition: 'all 0.2s',
                              }}
                            >
                              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 4 }}>
                                <span style={{ fontFamily: 'Syne, sans-serif', fontSize: 12, color: active ? B.white : B.smoke, fontWeight: 600 }}>
                                  {active ? '☑' : '☐'} {item.name}
                                </span>
                                <span style={{ fontFamily: 'Space Mono, monospace', fontSize: 11, color: B.amber, fontWeight: 700, marginLeft: 8, whiteSpace: 'nowrap' }}>
                                  +₦{item.price.toLocaleString('en-NG')}
                                </span>
                              </div>
                              <div style={{ fontFamily: 'Syne, sans-serif', fontSize: 10, color: B.dim, lineHeight: 1.4 }}>
                                {item.desc}
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  </div>
                )}

                {/* ── STEP 1: BRAND PROFILE & CONTACT ── */}
                {step === 1 && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                    <div style={{ fontFamily: 'Orbitron, monospace', fontSize: 11, color: B.amber, letterSpacing: 2 }}>
                      STEP 2 OF 4: ENTER YOUR BRAND CREDENTIALS
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 16 }}>
                      <div>
                        {lbl('BUSINESS / BRAND NAME *')}
                        <input aria-label="Brand name" value={form.business} onChange={setField('business')} placeholder="e.g. Sole Vault Lagos" style={IS} onFocus={onFocus} onBlur={onBlur} />
                      </div>
                      <div>
                        {lbl('PRIMARY CONTACT PERSON *')}
                        <input aria-label="Contact person" value={form.contact} onChange={setField('contact')} placeholder="e.g. Tobi Adeleke" style={IS} onFocus={onFocus} onBlur={onBlur} />
                      </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 16 }}>
                      <div>
                        {lbl('OFFICIAL EMAIL ADDRESS * (For Invoices & Passes)')}
                        <input aria-label="Email address" type="email" value={form.email} onChange={setField('email')} placeholder="tobi@solevault.ng" style={IS} onFocus={onFocus} onBlur={onBlur} />
                      </div>
                      <div>
                        {lbl('DIRECT PHONE / WHATSAPP NUMBER *')}
                        <input aria-label="Phone number" type="tel" value={form.phone} onChange={setField('phone')} placeholder="+234 802 345 6789" style={IS} onFocus={onFocus} onBlur={onBlur} />
                      </div>
                    </div>

                    <div>
                      {lbl('PRIMARY INVENTORY CATEGORY *')}
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                        {CATEGORIES.map(cat => {
                          const isSel = form.category === cat
                          return (
                            <button
                              key={cat}
                              type="button"
                              onClick={() => setForm(f => ({ ...f, category: cat }))}
                              style={{
                                padding: '8px 14px',
                                background: isSel ? `${B.neonCyan}18` : 'rgba(255,255,255,0.03)',
                                border: `1px solid ${isSel ? B.neonCyan : 'rgba(255,255,255,0.09)'}`,
                                borderRadius: 6,
                                cursor: 'pointer',
                                fontFamily: 'Space Mono, monospace',
                                fontSize: 10,
                                color: isSel ? B.neonCyan : B.smoke,
                                letterSpacing: '0.05em',
                                transition: 'all 0.2s',
                              }}
                            >
                              {cat}
                            </button>
                          )
                        })}
                      </div>
                    </div>
                  </div>
                )}

                {/* ── STEP 2: SOCIAL PROOF, DROP PROPOSAL & PITCH ── */}
                {step === 2 && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                    <div style={{ fontFamily: 'Orbitron, monospace', fontSize: 11, color: B.amber, letterSpacing: 2 }}>
                      STEP 3 OF 4: DIGITAL FOOTPRINT & DROP PROPOSAL
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 16 }}>
                      <div>
                        {lbl('INSTAGRAM PROFILE HANDLE')}
                        <input aria-label="Instagram handle" value={form.instagram} onChange={setField('instagram')} placeholder="@solevaultlagos" style={IS} onFocus={onFocus} onBlur={onBlur} />
                      </div>
                      <div>
                        {lbl('X / TWITTER OR TIKTOK')}
                        <input aria-label="Twitter or TikTok" value={form.twitter} onChange={setField('twitter')} placeholder="@solevault_ng" style={IS} onFocus={onFocus} onBlur={onBlur} />
                      </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 16 }}>
                      <div>
                        {lbl('WEBSITE / ONLINE STORE URL (Optional)')}
                        <input aria-label="Website" value={form.website} onChange={setField('website')} placeholder="https://solevault.ng" style={IS} onFocus={onFocus} onBlur={onBlur} />
                      </div>
                      <div>
                        {lbl('LOOKBOOK / CATALOGUE LINK (Google Drive, Notion, PDF)')}
                        <input aria-label="Deck link" value={form.deckUrl} onChange={setField('deckUrl')} placeholder="https://drive.google.com/..." style={IS} onFocus={onFocus} onBlur={onBlur} />
                      </div>
                    </div>

                    <div>
                      {lbl('ARE YOU PLANNING AN EXCLUSIVE PRODUCT DROP AT SF26?')}
                      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                        {['YES — I WANT A DROP', 'MAYBE — OPEN TO COLLABORATING', 'NO — STANDARD CATALOGUE ONLY'].map(opt => {
                          const active = form.exclusiveDrop === opt
                          return (
                            <button
                              key={opt}
                              type="button"
                              onClick={() => setForm(f => ({ ...f, exclusiveDrop: opt }))}
                              style={{
                                flex: 1,
                                minWidth: 140,
                                padding: '12px 14px',
                                background: active ? `${B.amber}18` : 'rgba(255,255,255,0.03)',
                                border: `1px solid ${active ? B.amber : 'rgba(255,255,255,0.08)'}`,
                                borderRadius: 8,
                                cursor: 'pointer',
                                fontFamily: 'Space Mono, monospace',
                                fontSize: 10,
                                color: active ? B.amber : B.smoke,
                                transition: 'all 0.2s',
                              }}
                            >
                              {opt}
                            </button>
                          )
                        })}
                      </div>
                    </div>

                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                        {lbl(`BRAND MISSION & ELEVATOR PITCH * (${form.bio.length}/300 characters · min 20)`)}
                        <button
                          type="button"
                          onClick={generatePitch}
                          disabled={pitchLoading}
                          style={{
                            padding: '6px 12px',
                            background: pitchLoading ? 'rgba(0,240,255,0.06)' : `${B.neonCyan}18`,
                            border: `1px solid ${B.neonCyan}50`,
                            borderRadius: 6,
                            color: pitchLoading ? B.dim : B.neonCyan,
                            fontFamily: 'Space Mono, monospace',
                            fontSize: 10,
                            cursor: pitchLoading ? 'wait' : 'pointer',
                          }}
                        >
                          {pitchLoading ? 'GENERATING...' : '✦ CATALYST AI PITCH WRITER'}
                        </button>
                      </div>
                      <textarea
                        aria-label="Brand bio"
                        value={form.bio}
                        onChange={setField('bio')}
                        maxLength={300}
                        rows={4}
                        placeholder="Tell the SF26 curatorial board what sets your brand apart, what grails you are bringing, and your vision for the festival floor..."
                        style={{ ...IS, resize: 'vertical', lineHeight: 1.6 }}
                        onFocus={onFocus}
                        onBlur={onBlur}
                      />
                      {pitchError && <div style={{ fontFamily: 'Space Mono, monospace', fontSize: 10, color: B.neonMagenta, marginTop: 4 }}>{pitchError}</div>}
                    </div>
                  </div>
                )}

                {/* ── STEP 3: FINANCIAL BREAKDOWN, ROI & SUBMIT ── */}
                {step === 3 && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 10 }}>
                      <span style={{ fontFamily: 'Orbitron, monospace', fontSize: 11, color: B.amber, letterSpacing: 2 }}>
                        STEP 4 OF 4: PROVISIONAL INVOICE & BREAK-EVEN CALCULATOR
                      </span>
                      <span style={{ fontFamily: 'Space Mono, monospace', fontSize: 9, color: B.smoke }}>
                        REF: PROVISIONAL ESTIMATE
                      </span>
                    </div>

                    {/* Financial Summary Table */}
                    <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12, overflow: 'hidden' }}>
                      <div style={{ padding: '14px 18px', borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontFamily: 'Space Mono, monospace', fontSize: 11, color: B.smoke }}>SELECTED BOOTH</span>
                        <span style={{ fontFamily: 'Orbitron, monospace', fontSize: 12, color: B.neonCyan, fontWeight: 700 }}>
                          {selectedBooth.label} ({selectedBooth.size})
                        </span>
                      </div>

                      <div style={{ padding: '12px 18px', borderBottom: '1px solid rgba(255,255,255,0.04)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontFamily: 'Space Mono, monospace', fontSize: 10, color: B.smoke }}>Base Booth Price</span>
                        <span style={{ fontFamily: 'Space Mono, monospace', fontSize: 11, color: B.white }}>₦{basePrice.toLocaleString('en-NG')}</span>
                      </div>

                      <div style={{ padding: '12px 18px', borderBottom: '1px solid rgba(255,255,255,0.04)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontFamily: 'Space Mono, monospace', fontSize: 10, color: B.neonLime }}>Early Bird Discount (10% Off)</span>
                        <span style={{ fontFamily: 'Space Mono, monospace', fontSize: 11, color: B.neonLime }}>-₦{earlyBirdDiscount.toLocaleString('en-NG')}</span>
                      </div>

                      {form.selectedAddOns.length > 0 && (
                        <div style={{ padding: '12px 18px', borderBottom: '1px solid rgba(255,255,255,0.04)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span style={{ fontFamily: 'Space Mono, monospace', fontSize: 10, color: B.smoke }}>
                            Add-Ons ({form.selectedAddOns.length} Selected)
                          </span>
                          <span style={{ fontFamily: 'Space Mono, monospace', fontSize: 11, color: B.amber }}>+₦{addOnsTotal.toLocaleString('en-NG')}</span>
                        </div>
                      )}

                      {/* Payment Terms Toggle */}
                      <div style={{ padding: '16px 18px', borderBottom: '1px solid rgba(255,255,255,0.06)', background: 'rgba(0,0,0,0.2)' }}>
                        <div style={{ fontFamily: 'Space Mono, monospace', fontSize: 9, color: B.smoke, letterSpacing: 1, marginBottom: 10 }}>
                          SELECT PAYMENT TERMS
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 10 }}>
                          <div
                            onClick={() => setForm(f => ({ ...f, paymentPlan: 'full' }))}
                            style={{
                              padding: '12px 14px',
                              borderRadius: 8,
                              cursor: 'pointer',
                              border: `1px solid ${form.paymentPlan === 'full' ? B.neonCyan : 'rgba(255,255,255,0.1)'}`,
                              background: form.paymentPlan === 'full' ? `${B.neonCyan}12` : 'rgba(255,255,255,0.02)',
                            }}
                          >
                            <div style={{ fontFamily: 'Orbitron, monospace', fontSize: 11, color: form.paymentPlan === 'full' ? B.neonCyan : B.white, fontWeight: 700 }}>
                              ● FULL UPFRONT SETTLEMENT
                            </div>
                            <div style={{ fontFamily: 'Space Mono, monospace', fontSize: 9, color: B.neonLime, marginTop: 4 }}>
                              Save an extra 5% instant discount
                            </div>
                          </div>

                          <div
                            onClick={() => setForm(f => ({ ...f, paymentPlan: 'split' }))}
                            style={{
                              padding: '12px 14px',
                              borderRadius: 8,
                              cursor: 'pointer',
                              border: `1px solid ${form.paymentPlan === 'split' ? B.amber : 'rgba(255,255,255,0.1)'}`,
                              background: form.paymentPlan === 'split' ? `${B.amber}12` : 'rgba(255,255,255,0.02)',
                            }}
                          >
                            <div style={{ fontFamily: 'Orbitron, monospace', fontSize: 11, color: form.paymentPlan === 'split' ? B.amber : B.white, fontWeight: 700 }}>
                              ● 2-STAGE FLEXIBLE SPLIT
                            </div>
                            <div style={{ fontFamily: 'Space Mono, monospace', fontSize: 9, color: B.smoke, marginTop: 4 }}>
                              50% deposit now · 50% balance by Nov 25
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Total Due */}
                      <div style={{ padding: '18px', background: `${B.charcoal}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 10 }}>
                        <div>
                          <div style={{ fontFamily: 'Space Mono, monospace', fontSize: 9, color: B.smoke, letterSpacing: 1 }}>
                            TOTAL NET INVOICE
                          </div>
                          <div style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: 32, color: B.amber, lineHeight: 1 }}>
                            ₦{netTotal.toLocaleString('en-NG')}
                          </div>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                          <div style={{ fontFamily: 'Space Mono, monospace', fontSize: 9, color: B.neonCyan, letterSpacing: 1 }}>
                            DEPOSIT PAYABLE UPON ACCEPTANCE
                          </div>
                          <div style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: 26, color: B.white, lineHeight: 1 }}>
                            ₦{depositDueNow.toLocaleString('en-NG')}
                          </div>
                          {secondInstallment > 0 && (
                            <div style={{ fontFamily: 'Space Mono, monospace', fontSize: 8, color: B.smoke, marginTop: 2 }}>
                              Balance: ₦{secondInstallment.toLocaleString('en-NG')} due Nov 25, 2026
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Dynamic ROI & Break-Even Simulator */}
                    <div style={{ padding: 20, background: 'rgba(255,255,255,0.02)', border: `1px solid ${B.neonLime}30`, borderRadius: 12 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 8, marginBottom: 12 }}>
                        <span style={{ fontFamily: 'Orbitron, monospace', fontSize: 11, color: B.neonLime, letterSpacing: 1 }}>
                          ⚡ VENDOR ROI & BREAK-EVEN CALCULATOR
                        </span>
                        <span style={{ fontFamily: 'Space Mono, monospace', fontSize: 9, color: B.smoke }}>
                          Expected Attendees: 1,000–2,500
                        </span>
                      </div>

                      <div style={{ marginBottom: 14 }}>
                        <div style={{ fontFamily: 'Space Mono, monospace', fontSize: 9, color: B.smoke, marginBottom: 6 }}>
                          Select your estimated average profit margin per pair / item:
                        </div>
                        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                          {[15000, 25000, 40000, 60000].map(amt => (
                            <button
                              key={amt}
                              type="button"
                              onClick={() => setForm(f => ({ ...f, estimatedMargin: amt }))}
                              style={{
                                padding: '6px 12px',
                                background: form.estimatedMargin === amt ? `${B.neonLime}20` : 'rgba(255,255,255,0.04)',
                                border: `1px solid ${form.estimatedMargin === amt ? B.neonLime : 'rgba(255,255,255,0.1)'}`,
                                borderRadius: 6,
                                color: form.estimatedMargin === amt ? B.neonLime : B.smoke,
                                fontFamily: 'Space Mono, monospace',
                                fontSize: 10,
                                cursor: 'pointer',
                              }}
                            >
                              ₦{amt.toLocaleString('en-NG')}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div style={{ padding: '12px 16px', background: 'rgba(0,0,0,0.3)', borderRadius: 8, border: '1px solid rgba(255,255,255,0.05)' }}>
                        <p style={{ fontFamily: 'Syne, sans-serif', fontSize: 13, color: B.white, lineHeight: 1.6, margin: 0 }}>
                          At an estimated profit margin of <strong style={{ color: B.neonLime }}>₦{form.estimatedMargin.toLocaleString('en-NG')}</strong> per pair, you only need to sell <strong style={{ color: B.amber, fontSize: 16 }}>{pairsToBreakEven} pairs</strong> to 100% pay off your booth! 
                          That represents a conversion rate of just <strong style={{ color: B.neonCyan }}>{conversionNeeded}%</strong> of the festival's crowd.
                        </p>
                      </div>
                    </div>

                    {status === 'error' && (
                      <div style={{ padding: '14px', background: 'rgba(255,45,123,0.1)', border: `1px solid ${B.neonMagenta}40`, borderRadius: 8 }}>
                        <div style={{ fontFamily: 'Space Mono, monospace', fontSize: 11, color: B.neonMagenta }}>
                          Submission encountered a delay. You can also send your details directly via WhatsApp or email to <strong style={{ color: B.white }}>sneakersfest088@gmail.com</strong>.
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Navigation Action Buttons */}
                <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginTop: 10 }}>
                  {step > 0 && (
                    <button
                      onClick={() => setStep(s => s - 1)}
                      style={{
                        padding: '13px 22px',
                        background: 'transparent',
                        border: '1px solid rgba(255,255,255,0.15)',
                        borderRadius: 8,
                        color: B.smoke,
                        fontFamily: 'Orbitron, monospace',
                        fontSize: 11,
                        letterSpacing: 2,
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                      }}
                      onMouseEnter={e => (e.currentTarget.style.color = B.white)}
                      onMouseLeave={e => (e.currentTarget.style.color = B.smoke)}
                    >
                      ← PREVIOUS
                    </button>
                  )}

                  <div style={{ flex: 1 }} />

                  {step < 3 ? (
                    <button
                      onClick={() => canNext() && setStep(s => s + 1)}
                      disabled={!canNext()}
                      style={{
                        padding: '14px 32px',
                        background: canNext() ? B.neonCyan : 'rgba(255,255,255,0.06)',
                        border: 'none',
                        borderRadius: 8,
                        color: canNext() ? B.black : B.dim,
                        fontFamily: 'Orbitron, monospace',
                        fontSize: 12,
                        fontWeight: 700,
                        letterSpacing: 2,
                        cursor: canNext() ? 'pointer' : 'not-allowed',
                        boxShadow: canNext() ? `0 0 24px ${B.neonCyan}30` : 'none',
                        transition: 'all 0.2s',
                      }}
                    >
                      NEXT STEP →
                    </button>
                  ) : (
                    <button
                      onClick={submit}
                      disabled={status === 'loading'}
                      style={{
                        padding: '15px 36px',
                        background: status === 'loading' ? 'rgba(255,255,255,0.06)' : B.amber,
                        border: 'none',
                        borderRadius: 8,
                        color: status === 'loading' ? B.dim : B.black,
                        fontFamily: 'Orbitron, monospace',
                        fontSize: 12,
                        fontWeight: 700,
                        letterSpacing: 2,
                        cursor: status === 'loading' ? 'wait' : 'pointer',
                        boxShadow: status === 'loading' ? 'none' : `0 0 32px ${B.amber}35`,
                        transition: 'all 0.2s',
                      }}
                    >
                      {status === 'loading' ? 'TRANSMITTING APPLICATION…' : 'SUBMIT OFFICIAL APPLICATION →'}
                    </button>
                  )}
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: 14 }}>
                  <span style={{ fontFamily: 'Space Mono, monospace', fontSize: 9, color: B.dim, letterSpacing: 1 }}>
                    ● 256-BIT ENCRYPTED ONBOARDING SESSION
                  </span>
                  <span style={{ fontFamily: 'Space Mono, monospace', fontSize: 9, color: B.smoke }}>
                    REVIEW WINDOW: 3 BUSINESS DAYS
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── CONFIRMED VENDOR ROSTER ── */}
        <div id="confirmed-vendors" style={{ marginTop: 64 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: 12, marginBottom: 18 }}>
            <div>
              <div style={{ fontFamily: 'Space Mono, monospace', fontSize: 9, letterSpacing: '0.3em', color: B.amber, marginBottom: 4 }}>
                CURATED YEAR 1 COHORT
              </div>
              <h3 style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: 32, color: B.white, letterSpacing: 1, margin: 0 }}>
                CONFIRMED VENDORS & RETAILERS
              </h3>
            </div>
            <span style={{ fontFamily: 'Space Mono, monospace', fontSize: 10, color: B.smoke }}>
              {CONFIRMED_VENDORS.length} Brands Confirmed · 30 Maximum
            </span>
          </div>

          {/* Category Filter Chips */}
          <div className="mobile-scroll-x" style={{ display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 10, marginBottom: 18 }}>
            {['ALL', ...Array.from(new Set(CONFIRMED_VENDORS.map(v => v.cat)))].map(cat => (
              <button
                key={cat}
                onClick={() => setVendorCatFilter(cat)}
                style={{
                  padding: '6px 14px',
                  background: vendorCatFilter === cat ? `${B.neonCyan}18` : 'rgba(255,255,255,0.03)',
                  border: `1px solid ${vendorCatFilter === cat ? B.neonCyan : 'rgba(255,255,255,0.08)'}`,
                  borderRadius: 20,
                  cursor: 'pointer',
                  fontFamily: 'Space Mono, monospace',
                  fontSize: 10,
                  color: vendorCatFilter === cat ? B.neonCyan : B.smoke,
                  letterSpacing: 1,
                  whiteSpace: 'nowrap',
                  transition: 'all 0.2s',
                }}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Grid of Confirmed Vendors */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 16 }}>
            {CONFIRMED_VENDORS.filter(v => vendorCatFilter === 'ALL' || v.cat === vendorCatFilter).map((v, i) => (
              <div
                key={i}
                className="card-3d"
                style={{
                  padding: 20,
                  background: 'rgba(255,255,255,0.025)',
                  border: `1px solid ${v.color}35`,
                  borderTop: `2px solid ${v.color}`,
                  borderRadius: 10,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 12,
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ width: 44, height: 44, borderRadius: '50%', background: `${v.color}18`, border: `1.5px solid ${v.color}60`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Bebas Neue, sans-serif', fontSize: 20, color: v.color }}>
                    {v.name[0]}
                  </div>
                  <div>
                    <div style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: 18, color: B.white, lineHeight: 1 }}>{v.name}</div>
                    <div style={{ fontFamily: 'Space Mono, monospace', fontSize: 9, color: v.color, marginTop: 4, letterSpacing: 1 }}>
                      {v.cat} · {v.city}
                    </div>
                  </div>
                </div>

                <div style={{ fontFamily: 'Syne, sans-serif', fontSize: 12, color: B.smoke, lineHeight: 1.6, flex: 1 }}>
                  {v.bringing}
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: 10 }}>
                  <span style={{ fontFamily: 'Space Mono, monospace', fontSize: 10, color: v.color }}>{v.ig}</span>
                  <span style={{ padding: '3px 8px', background: `${v.color}15`, border: `1px solid ${v.color}35`, borderRadius: 4, fontFamily: 'Space Mono, monospace', fontSize: 8, color: B.smoke }}>
                    {v.booth}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── FAQ SECTION ── */}
        <div style={{ marginTop: 64 }}>
          <div style={{ fontFamily: 'Space Mono, monospace', fontSize: 9, letterSpacing: '0.3em', color: B.smoke, marginBottom: 16 }}>
            FREQUENTLY ASKED QUESTIONS
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {FAQ.map((f, i) => (
              <div key={i} style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 8, overflow: 'hidden' }}>
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  style={{ width: '100%', textAlign: 'left', padding: '16px 20px', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                >
                  <span style={{ fontFamily: "'Syne', sans-serif", fontSize: 14, color: B.white, fontWeight: 600 }}>{f.q}</span>
                  <span style={{ color: B.amber, fontSize: 18, marginLeft: 12 }}>{openFaq === i ? '−' : '+'}</span>
                </button>
                {openFaq === i && (
                  <div style={{ padding: '0 20px 18px', borderTop: '1px solid rgba(255,255,255,0.04)' }}>
                    <p style={{ fontFamily: "'Syne', sans-serif", fontSize: 13, color: B.smoke, lineHeight: 1.7, margin: '12px 0 0' }}>{f.a}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* ── TRACKER MODAL ── */}
        {trackerOpen && (
          <div style={{ position: 'fixed', inset: 0, zIndex: 9999, background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(16px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
            <div className="card-3d" style={{ background: B.charcoal, border: `1px solid ${B.amber}50`, borderRadius: 16, maxWidth: 540, width: '100%', padding: '32px 28px', position: 'relative' }}>
              <button
                onClick={() => setTrackerOpen(false)}
                style={{ position: 'absolute', top: 16, right: 16, background: 'none', border: 'none', color: B.smoke, fontSize: 20, cursor: 'pointer' }}
              >
                ✕
              </button>

              <div style={{ fontFamily: 'Orbitron, monospace', fontSize: 11, color: B.amber, letterSpacing: 2, marginBottom: 6 }}>
                SELF-SERVICE APPLICATION TRACKER
              </div>
              <h3 style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: 28, color: B.white, margin: '0 0 16px' }}>
                CHECK VENDOR ADMISSION STATUS
              </h3>

              <form onSubmit={handleLookup} style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
                <input
                  aria-label="Application ID"
                  value={lookupId}
                  onChange={e => setLookupId(e.target.value)}
                  placeholder="e.g. VSF26-XXXX or VDR-XXXX"
                  style={{ ...IS, flex: 1 }}
                />
                <button
                  type="submit"
                  disabled={lookupLoading}
                  style={{ padding: '0 20px', background: B.amber, border: 'none', borderRadius: 8, color: B.black, fontFamily: 'Orbitron, monospace', fontSize: 11, fontWeight: 700, cursor: lookupLoading ? 'wait' : 'pointer' }}
                >
                  {lookupLoading ? 'QUERYING…' : 'SEARCH'}
                </button>
              </form>

              {lookupError && (
                <div style={{ padding: '12px 14px', background: 'rgba(255,45,123,0.1)', border: `1px solid ${B.neonMagenta}40`, borderRadius: 8, color: B.neonMagenta, fontFamily: 'Space Mono, monospace', fontSize: 11, marginBottom: 16 }}>
                  {lookupError}
                </div>
              )}

              {lookupResult && (
                <div style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 10, padding: 18 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                    <div>
                      <div style={{ fontFamily: 'Space Mono, monospace', fontSize: 9, color: B.smoke }}>BRAND NAME</div>
                      <div style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: 22, color: B.white }}>{lookupResult.business}</div>
                    </div>
                    <span style={{ padding: '4px 10px', background: `${B.neonLime}18`, border: `1px solid ${B.neonLime}50`, borderRadius: 4, fontFamily: 'Orbitron, monospace', fontSize: 9, color: B.neonLime }}>
                      {lookupResult.status ? lookupResult.status.toUpperCase() : 'PENDING'}
                    </span>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, fontFamily: 'Space Mono, monospace', fontSize: 10, color: B.smoke, marginBottom: 14 }}>
                    <div>REF: <strong style={{ color: B.amber }}>{lookupResult.applicationId}</strong></div>
                    <div>TIER: <strong style={{ color: B.white }}>{lookupResult.booth}</strong></div>
                    <div>CAT: <strong style={{ color: B.white }}>{lookupResult.category}</strong></div>
                    <div>SUBMITTED: <strong style={{ color: B.white }}>{lookupResult.submittedAt ? new Date(lookupResult.submittedAt).toLocaleDateString() : 'Dec 2026'}</strong></div>
                  </div>

                  <a
                    href={`${SOCIAL_LINKS.whatsapp}?text=${encodeURIComponent(`Hello SF26 Vendor Concierge, I am following up on Application ID: ${lookupResult.applicationId} for ${lookupResult.business}.`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ display: 'block', padding: '10px', background: `${B.neonCyan}15`, border: `1px solid ${B.neonCyan}40`, borderRadius: 6, color: B.neonCyan, fontFamily: 'Space Mono, monospace', fontSize: 10, textAlign: 'center', textDecoration: 'none' }}
                  >
                    SPEAK WITH ONBOARDING TEAM ON WHATSAPP →
                  </a>
                </div>
              )}
            </div>
          </div>
        )}

      </div>
    </section>
  )
}
