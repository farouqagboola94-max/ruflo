import { useState, useMemo } from 'react'
import { SNEAKERS } from '../data/sneakers'
import { B, FONTS } from '../tokens'
import {
  useFestivalGamification,
  useFestivalTelemetry,
  playFestivalSound,
  dispatchFestivalAction,
  FESTIVAL_ACTIONS,
} from '../framework/festivalFramework'

export const TRADE_PAIRS_CATALOG = [
  { id: 'TP-1', name: "Air Jordan 1 High OG 'Chicago' 2022", value: 2850000, hype: 98, tier: 'GRAIL' },
  { id: 'TP-2', name: "Travis Scott x AJ1 Low 'Cactus Jack'", value: 1450000, hype: 94, tier: 'HEAT' },
  { id: 'TP-3', name: "Nike Air Force 1 Low x Tiffany & Co.", value: 1800000, hype: 96, tier: 'GRAIL' },
  { id: 'TP-4', name: "Nike Dunk Low 'Panda' OG", value: 265000, hype: 88, tier: 'STAPLE' },
  { id: 'TP-5', name: "Air Jordan 4 Retro 'Bred' Reimagined", value: 920000, hype: 92, tier: 'HEAT' },
  { id: 'TP-6', name: "Air Jordan 1 x Off-White 'The Ten' Chicago", value: 8500000, hype: 100, tier: 'HOLY GRAIL' },
  { id: 'TP-7', name: "Nike SB Dunk Low x Ben & Jerry's Chunky Dunky", value: 3200000, hype: 97, tier: 'GRAIL' },
  { id: 'TP-8', name: "New Balance 9060 'Rain Cloud'", value: 290000, hype: 89, tier: 'STAPLE' },
  { id: 'TP-9', name: "Travis Scott x AJ1 Low 'Reverse Mocha'", value: 1950000, hype: 97, tier: 'GRAIL' },
  { id: 'TP-10', name: "Custom AF1 'Eyo Festival Edition' 1-of-1", value: 250000, hype: 91, tier: 'CUSTOM' },
]

// Curated live listings simulating Lagos verified peer drops & boutique dealers
const INITIAL_LISTINGS = [
  {
    id: 'LX-101',
    sneakerId: 1,
    title: "Air Jordan 1 High OG 'Chicago' 2022",
    size: "US 10.5",
    condition: "Deadstock (DS)",
    priceNgn: 2850000,
    seller: "KicksOfLekki_NG",
    sellerRep: 99.4,
    tradesCompleted: 48,
    location: "Lekki Phase 1, Lagos",
    verified: true,
    inspectionStatus: "Escrow Locked & Legit-Checked",
    image: "https://images.unsplash.com/photo-1552346154-21d32810aba3?auto=format&fit=crop&w=800&q=80",
    hypeIndex: 98,
    escrowTimeHrs: 24,
    tags: ["Grail", "Lagos Island Drop", "Original Box"]
  },
  {
    id: 'LX-102',
    sneakerId: 6,
    title: "Air Jordan 1 Low x Travis Scott 'Cactus Jack'",
    size: "US 9.0",
    condition: "VNDS (Worn Once for Shoot)",
    priceNgn: 1450000,
    seller: "Yaba_Grail_Hunters",
    sellerRep: 98.7,
    tradesCompleted: 82,
    location: "Yaba Tech Axis, Lagos",
    verified: true,
    inspectionStatus: "Vault Inspected & NFC Tagged",
    image: "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&w=800&q=80",
    hypeIndex: 94,
    escrowTimeHrs: 18,
    tags: ["Travis Collab", "Mainland Heat"]
  },
  {
    id: 'LX-103',
    sneakerId: 44,
    title: "Nike Air Force 1 Low x Tiffany & Co.",
    size: "US 8.5",
    condition: "Deadstock (DS)",
    priceNgn: 1800000,
    seller: "VictoriaIsland_Solestore",
    sellerRep: 100.0,
    tradesCompleted: 114,
    location: "Adeola Odeku, Victoria Island",
    verified: true,
    inspectionStatus: "Physical Authentication Guaranteed",
    image: "https://images.unsplash.com/photo-1600185365926-3a2ce3cdb9eb?auto=format&fit=crop&w=800&q=80",
    hypeIndex: 96,
    escrowTimeHrs: 12,
    tags: ["Silver Accents", "Boutique Stock"]
  },
  {
    id: 'LX-104',
    sneakerId: 45,
    title: "Nike Dunk Low 'Panda' OG",
    size: "US 11.0",
    condition: "Brand New In Box",
    priceNgn: 265000,
    seller: "Surulere_Streetwear",
    sellerRep: 97.5,
    tradesCompleted: 64,
    location: "Bode Thomas, Surulere",
    verified: true,
    inspectionStatus: "Instant Same-Day Dispatch",
    image: "https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?auto=format&fit=crop&w=800&q=80",
    hypeIndex: 88,
    escrowTimeHrs: 6,
    tags: ["Daily Heat", "Lagos Essential"]
  },
  {
    id: 'LX-105',
    sneakerId: 17,
    title: "Air Jordan 4 Retro 'Bred' 2019",
    size: "US 10.0",
    condition: "Deadstock (DS)",
    priceNgn: 920000,
    seller: "Ikeja_Plug_99",
    sellerRep: 99.1,
    tradesCompleted: 53,
    location: "Allen Avenue, Ikeja",
    verified: true,
    inspectionStatus: "Escrow Locked & Legit-Checked",
    image: "https://images.unsplash.com/photo-1579338559194-a162d19bf842?auto=format&fit=crop&w=800&q=80",
    hypeIndex: 92,
    escrowTimeHrs: 16,
    tags: ["OG Nike Air", "Never Tried On"]
  },
  {
    id: 'LX-106',
    sneakerId: 5,
    title: "Air Jordan 1 x Off-White 'The Ten' Chicago",
    size: "US 10.0",
    condition: "Museum Grade / Deadstock",
    priceNgn: 8500000,
    seller: "VaultOfIkoyi",
    sellerRep: 100.0,
    tradesCompleted: 39,
    location: "Banana Island / Ikoyi, Lagos",
    verified: true,
    inspectionStatus: "VIP Physical Escrow & Certificate",
    image: "https://images.unsplash.com/photo-1515955656352-a1fa3ffcd111?auto=format&fit=crop&w=800&q=80",
    hypeIndex: 100,
    escrowTimeHrs: 48,
    tags: ["Abloh Artifact", "Grail of Grails"]
  },
  {
    id: 'LX-107',
    sneakerId: 4,
    title: "Air Jordan 1 High x Dior Luxury Edition",
    size: "US 9.5",
    condition: "Deadstock with Metal Wings & Hangtags",
    priceNgn: 14500000,
    seller: "Catalyst_Private_Archive",
    sellerRep: 100.0,
    tradesCompleted: 15,
    location: "Victoria Island Private Vault",
    verified: true,
    inspectionStatus: "CEO Verified & Authenticated",
    image: "https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?auto=format&fit=crop&w=800&q=80",
    hypeIndex: 99,
    escrowTimeHrs: 24,
    tags: ["Dior Jacquard", "Hand Numbered"]
  },
  {
    id: 'LX-108',
    sneakerId: 21,
    title: "Air Jordan 4 Retro 'Lightning' Yellow",
    size: "US 11.0",
    condition: "Deadstock (DS)",
    priceNgn: 1100000,
    seller: "Maryland_Sneaker_Lounge",
    sellerRep: 98.4,
    tradesCompleted: 42,
    location: "Maryland Mall Axis, Lagos",
    verified: true,
    inspectionStatus: "Escrow Locked & Legit-Checked",
    image: "https://images.unsplash.com/photo-1552346154-21d32810aba3?auto=format&fit=crop&w=800&q=80",
    hypeIndex: 93,
    escrowTimeHrs: 14,
    tags: ["Tour Yellow", "Festival Ready"]
  },
  {
    id: 'LX-109',
    sneakerId: 49,
    title: "Nike SB Dunk Low 'Chunky Dunky' x Ben & Jerry's",
    size: "US 10.5",
    condition: "Deadstock (Special Box Tub)",
    priceNgn: 3200000,
    seller: "Alte_Grail_Dealer",
    sellerRep: 99.2,
    tradesCompleted: 31,
    location: "Lekki Phase 2, Lagos",
    verified: true,
    inspectionStatus: "Vault Inspected & NFC Tagged",
    image: "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&w=800&q=80",
    hypeIndex: 97,
    escrowTimeHrs: 20,
    tags: ["Cow Print Faux Fur", "Special Box"]
  },
  {
    id: 'LX-110',
    sneakerId: 41,
    title: "Nike Air Force 1 Low '07 'Lagos Uniform' Triple White",
    size: "US All Sizes (8 - 12)",
    condition: "Factory Fresh In Box",
    priceNgn: 185000,
    seller: "Lagos_Daily_Supply",
    sellerRep: 99.8,
    tradesCompleted: 210,
    location: "Surulere & Yaba Distribution Hub",
    verified: true,
    inspectionStatus: "Instant Same-Day Dispatch",
    image: "https://images.unsplash.com/photo-1600185365926-3a2ce3cdb9eb?auto=format&fit=crop&w=800&q=80",
    hypeIndex: 90,
    escrowTimeHrs: 4,
    tags: ["The Uniform", "Same Day Dispatch"]
  }
]

export default function LagosSoleExchange() {
  const [exchangeMode, setExchangeMode] = useState('browse') // 'browse' | 'matcher'
  const [filter, setFilter] = useState('ALL')
  const [search, setSearch] = useState('')
  const [selectedListing, setSelectedListing] = useState(null)
  const [escrowModal, setEscrowModal] = useState(null)
  const [escrowStep, setEscrowStep] = useState(1)
  const [orderConfirmed, setOrderConfirmed] = useState(false)
  const [userOffer, setUserOffer] = useState('')

  // Level 1-3 Framework Hooks
  const { awardXP, unlockBadge } = useFestivalGamification()
  const { setZone } = useFestivalTelemetry()

  // Matcher state
  const [haveShoeId, setHaveShoeId] = useState('TP-5')
  const [haveSize, setHaveSize] = useState('US 10.5')
  const [haveCondition, setHaveCondition] = useState('Deadstock (DS)')
  const [wantShoeId, setWantShoeId] = useState('TP-3')
  const [wantSize, setWantSize] = useState('US 10.0')
  const [rendezvousPass, setRendezvousPass] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('sf26_lsx_rendezvous') || 'null')
    } catch {
      return null
    }
  })

  const haveShoe = useMemo(() => TRADE_PAIRS_CATALOG.find(p => p.id === haveShoeId) || TRADE_PAIRS_CATALOG[0], [haveShoeId])
  const wantShoe = useMemo(() => TRADE_PAIRS_CATALOG.find(p => p.id === wantShoeId) || TRADE_PAIRS_CATALOG[1], [wantShoeId])
  const valueDelta = Math.abs(wantShoe.value - haveShoe.value)
  const isStraightTrade = valueDelta <= 150000
  const fairnessScore = Math.max(72, Math.min(99, Math.round(100 - (valueDelta / Math.max(haveShoe.value, wantShoe.value)) * 28)))

  const handleLockRendezvous = () => {
    const desks = ['DESK-ALPHA', 'DESK-BETA', 'DESK-03', 'DESK-04']
    const assignedDesk = desks[Math.floor(Math.random() * desks.length)]
    const code = `LSX-ZONE-B-${Math.floor(1000 + Math.random() * 9000)}`
    const pass = {
      code,
      desk: `Zone B (Floor Pit Authenticator ${assignedDesk})`,
      slot: 'Festival Day 1 — 15:00 WAT',
      have: `${haveShoe.name} (${haveSize}, ${haveCondition})`,
      want: `${wantShoe.name} (${wantSize})`,
      fairness: `${fairnessScore}% Fair Trade Index`,
      cashBalance: isStraightTrade
        ? 'Straight 1:1 Trade'
        : wantShoe.value > haveShoe.value
          ? `Top-Up From You: +₦${valueDelta.toLocaleString()}`
          : `Cash Payout To You: +₦${valueDelta.toLocaleString()}`,
      timeGenerated: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
    setRendezvousPass(pass)
    try {
      localStorage.setItem('sf26_lsx_rendezvous', JSON.stringify(pass))
    } catch {}

    awardXP(75, 'LSX Trade Rendezvous Scheduled')
    unlockBadge('LSX_TRADER_VERIFIED')
    setZone('floor')
    playFestivalSound('badge_unlock')
    dispatchFestivalAction(FESTIVAL_ACTIONS.ADD_NOTIFICATION, {
      title: 'LSX Trade Rendezvous Confirmed!',
      message: `Reserved ${assignedDesk} at Muri Okunola Park. Pass: ${code}`
    })
  }

  const filteredListings = useMemo(() => {
    return INITIAL_LISTINGS.filter(item => {
      const matchSearch = item.title.toLowerCase().includes(search.toLowerCase()) ||
                          item.seller.toLowerCase().includes(search.toLowerCase()) ||
                          item.location.toLowerCase().includes(search.toLowerCase())
      if (!matchSearch) return false
      if (filter === 'ALL') return true
      if (filter === 'GRAIL') return item.hypeIndex >= 95
      if (filter === 'VERIFIED') return item.verified
      if (filter === 'MAINLAND') return item.location.includes('Surulere') || item.location.includes('Yaba') || item.location.includes('Ikeja')
      if (filter === 'ISLAND') return item.location.includes('Lekki') || item.location.includes('Victoria Island')
      return true
    })
  }, [search, filter])

  const startEscrowBuy = (item) => {
    setEscrowModal(item)
    setEscrowStep(1)
    setOrderConfirmed(false)
  }

  const handleEscrowLock = () => {
    setEscrowStep(2)
    setTimeout(() => {
      setEscrowStep(3)
      setOrderConfirmed(true)
    }, 1800)
  }

  return (
    <section id="sole-exchange" style={{
      background: 'radial-gradient(circle at 50% 0%, #15181e 0%, #08090b 100%)',
      color: '#fff',
      padding: '80px 20px',
      borderTop: '1px solid rgba(255, 215, 0, 0.2)',
      borderBottom: '1px solid rgba(255, 215, 0, 0.2)',
      position: 'relative',
      fontFamily: FONTS?.body || 'sans-serif'
    }}>
      {/* Background Ambience */}
      <div style={{
        position: 'absolute',
        top: 0, left: '10%', right: '10%', height: '1px',
        background: 'linear-gradient(90deg, transparent, #FFB800, #00E5FF, transparent)',
        filter: 'blur(1px)'
      }} />

      <div style={{ maxWidth: '1240px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '50px' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            background: 'rgba(255, 184, 0, 0.12)',
            border: '1px solid rgba(255, 184, 0, 0.35)',
            borderRadius: '999px',
            padding: '6px 16px',
            fontSize: '12px',
            fontWeight: '700',
            letterSpacing: '1.5px',
            color: '#FFB800',
            textTransform: 'uppercase',
            marginBottom: '16px'
          }}>
            <span style={{ display: 'inline-block', width: '8px', height: '8px', borderRadius: '50%', background: '#00E5FF', boxShadow: '0 0 10px #00E5FF' }}></span>
            Lagos P2P Sneaker Escrow & Live Trading Terminal
          </div>
          
          <h2 style={{
            fontSize: 'clamp(28px, 4vw, 44px)',
            fontWeight: '900',
            letterSpacing: '-0.5px',
            margin: '0 0 14px 0',
            textTransform: 'uppercase',
            color: '#FFFFFF'
          }}>
            Lagos Sole <span style={{ color: '#FFB800' }}>Exchange</span> (LSX)
          </h2>
          
          <p style={{
            maxWidth: '680px',
            margin: '0 auto',
            fontSize: '15px',
            color: '#9CA3AF',
            lineHeight: '1.6'
          }}>
            The premier decentralized trading pit for West Africa’s sneaker capital. Instant peer-to-peer deals, locked funds protection via Sneakers Fest Physical Escrow, and direct door-to-door dispatched legit checking.
          </p>
        </div>

        {/* Mode Selector */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '12px',
          marginBottom: '32px',
          flexWrap: 'wrap'
        }}>
          <button
            onClick={() => {
              setExchangeMode('matcher')
              playFestivalSound('zone_click')
            }}
            style={{
              padding: '12px 22px',
              borderRadius: '10px',
              border: exchangeMode === 'matcher' ? `1px solid ${B.amber}` : `1px solid ${B.gunmetal}`,
              background: exchangeMode === 'matcher' ? 'rgba(255, 184, 0, 0.16)' : 'rgba(255, 255, 255, 0.03)',
              color: exchangeMode === 'matcher' ? B.amber : '#9CA3AF',
              fontFamily: "'Space Mono', monospace",
              fontSize: '11px',
              fontWeight: 700,
              letterSpacing: '0.12em',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              boxShadow: exchangeMode === 'matcher' ? '0 0 20px rgba(255, 184, 0, 0.25)' : 'none',
              transition: 'all 0.2s ease'
            }}
          >
            <span>⚡ P2P TRADE MATCHER & RENDEZVOUS</span>
            {rendezvousPass && <span style={{ padding: '2px 6px', background: B.neonLime, color: B.black, borderRadius: 3, fontSize: 8 }}>PASS BOOKED</span>}
          </button>

          <button
            onClick={() => {
              setExchangeMode('browse')
              playFestivalSound('zone_click')
            }}
            style={{
              padding: '12px 22px',
              borderRadius: '10px',
              border: exchangeMode === 'browse' ? `1px solid ${B.neonCyan}` : `1px solid ${B.gunmetal}`,
              background: exchangeMode === 'browse' ? 'rgba(0, 229, 255, 0.16)' : 'rgba(255, 255, 255, 0.03)',
              color: exchangeMode === 'browse' ? B.neonCyan : '#9CA3AF',
              fontFamily: "'Space Mono', monospace",
              fontSize: '11px',
              fontWeight: 700,
              letterSpacing: '0.12em',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              boxShadow: exchangeMode === 'browse' ? '0 0 20px rgba(0, 229, 255, 0.25)' : 'none',
              transition: 'all 0.2s ease'
            }}
          >
            <span>🛒 LIVE ESCROW DROPS ({filteredListings.length})</span>
          </button>
        </div>

        {/* P2P TRADE MATCHER & RENDEZVOUS ENGINE */}
        {exchangeMode === 'matcher' && (
          <div style={{
            background: 'rgba(15, 18, 24, 0.9)',
            border: `1px solid ${B.amber}44`,
            borderRadius: '20px',
            padding: 'clamp(20px, 4vw, 36px)',
            marginBottom: '40px',
            boxShadow: '0 12px 40px rgba(0,0,0,0.6)',
            position: 'relative'
          }}>
            {/* Header badge */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 10, marginBottom: 24 }}>
              <div>
                <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 10, color: B.amber, letterSpacing: '0.18em', textTransform: 'uppercase' }}>
                  AUTOMATED SNEAKER FAIRNESS ALGORITHM
                </div>
                <h3 style={{ fontFamily: "'Orbitron', monospace", fontSize: 'clamp(20px, 3vw, 28px)', color: B.white, margin: '6px 0 0 0' }}>
                  PEER-TO-PEER <span style={{ color: B.amber }}>TRADE CALCULATOR</span>
                </h3>
              </div>
              <div style={{
                padding: '6px 12px',
                borderRadius: '6px',
                background: 'rgba(255, 184, 0, 0.1)',
                border: `1px solid ${B.amber}55`,
                fontFamily: "'Space Mono', monospace",
                fontSize: 10,
                color: B.amber
              }}>
                ZONE B AUTHENTICATION ESCROW READY
              </div>
            </div>

            {/* Split Trade Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px', marginBottom: '28px' }}>
              {/* HAVE CARD */}
              <div style={{
                background: '#0D0F14',
                border: `1px solid ${B.gunmetal}`,
                borderRadius: '14px',
                padding: '20px',
                position: 'relative'
              }}>
                <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 10, color: B.neonCyan, letterSpacing: '0.15em', marginBottom: 12 }}>
                  YOUR GRAIL TO TRADE (HAVE)
                </div>
                
                <label style={{ display: 'block', fontSize: 11, color: '#9CA3AF', marginBottom: 6, fontFamily: "'Space Mono', monospace" }}>
                  SELECT SNEAKER
                </label>
                <select
                  value={haveShoeId}
                  onChange={(e) => setHaveShoeId(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '11px',
                    borderRadius: '8px',
                    background: '#151922',
                    border: '1px solid rgba(255,255,255,0.15)',
                    color: '#fff',
                    fontSize: '13px',
                    marginBottom: '16px',
                    outline: 'none'
                  }}
                >
                  {TRADE_PAIRS_CATALOG.map(p => (
                    <option key={p.id} value={p.id}>{p.name} — ₦{p.value.toLocaleString()}</option>
                  ))}
                </select>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 16 }}>
                  <div>
                    <label style={{ display: 'block', fontSize: 11, color: '#9CA3AF', marginBottom: 6, fontFamily: "'Space Mono', monospace" }}>
                      SIZE
                    </label>
                    <select
                      value={haveSize}
                      onChange={(e) => setHaveSize(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '10px',
                        borderRadius: '8px',
                        background: '#151922',
                        border: '1px solid rgba(255,255,255,0.15)',
                        color: '#fff',
                        fontSize: '13px',
                        outline: 'none'
                      }}
                    >
                      {['US 7.5', 'US 8.0', 'US 8.5', 'US 9.0', 'US 9.5', 'US 10.0', 'US 10.5', 'US 11.0', 'US 11.5', 'US 12.0', 'US 13.0'].map(s => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: 11, color: '#9CA3AF', marginBottom: 6, fontFamily: "'Space Mono', monospace" }}>
                      CONDITION
                    </label>
                    <select
                      value={haveCondition}
                      onChange={(e) => setHaveCondition(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '10px',
                        borderRadius: '8px',
                        background: '#151922',
                        border: '1px solid rgba(255,255,255,0.15)',
                        color: '#fff',
                        fontSize: '13px',
                        outline: 'none'
                      }}
                    >
                      <option value="Deadstock (DS)">Deadstock (DS)</option>
                      <option value="VNDS (Worn 1x)">VNDS (Worn 1x)</option>
                      <option value="9/10 OG All">9/10 OG All</option>
                      <option value="8.5/10 Clean">8.5/10 Clean</option>
                    </select>
                  </div>
                </div>

                <div style={{
                  padding: '12px',
                  background: 'rgba(0, 229, 255, 0.05)',
                  border: '1px solid rgba(0, 229, 255, 0.2)',
                  borderRadius: '8px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 10, color: '#9CA3AF' }}>EST. MARKET VALUE</span>
                  <span style={{ fontFamily: "'Orbitron', monospace", fontSize: 15, fontWeight: 700, color: B.neonCyan }}>
                    ₦{haveShoe.value.toLocaleString()}
                  </span>
                </div>
              </div>

              {/* WANT CARD */}
              <div style={{
                background: '#0D0F14',
                border: `1px solid ${B.gunmetal}`,
                borderRadius: '14px',
                padding: '20px',
                position: 'relative'
              }}>
                <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 10, color: B.amber, letterSpacing: '0.15em', marginBottom: 12 }}>
                  TARGET GRAIL HUNT (WANT)
                </div>

                <label style={{ display: 'block', fontSize: 11, color: '#9CA3AF', marginBottom: 6, fontFamily: "'Space Mono', monospace" }}>
                  DESIRED SNEAKER
                </label>
                <select
                  value={wantShoeId}
                  onChange={(e) => setWantShoeId(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '11px',
                    borderRadius: '8px',
                    background: '#151922',
                    border: '1px solid rgba(255,255,255,0.15)',
                    color: '#fff',
                    fontSize: '13px',
                    marginBottom: '16px',
                    outline: 'none'
                  }}
                >
                  {TRADE_PAIRS_CATALOG.map(p => (
                    <option key={p.id} value={p.id}>{p.name} — ₦{p.value.toLocaleString()}</option>
                  ))}
                </select>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 12, marginBottom: 16 }}>
                  <div>
                    <label style={{ display: 'block', fontSize: 11, color: '#9CA3AF', marginBottom: 6, fontFamily: "'Space Mono', monospace" }}>
                      DESIRED SIZE
                    </label>
                    <select
                      value={wantSize}
                      onChange={(e) => setWantSize(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '10px',
                        borderRadius: '8px',
                        background: '#151922',
                        border: '1px solid rgba(255,255,255,0.15)',
                        color: '#fff',
                        fontSize: '13px',
                        outline: 'none'
                      }}
                    >
                      {['US 7.5', 'US 8.0', 'US 8.5', 'US 9.0', 'US 9.5', 'US 10.0', 'US 10.5', 'US 11.0', 'US 11.5', 'US 12.0', 'US 13.0'].map(s => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div style={{
                  padding: '12px',
                  background: 'rgba(255, 184, 0, 0.05)',
                  border: '1px solid rgba(255, 184, 0, 0.2)',
                  borderRadius: '8px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 10, color: '#9CA3AF' }}>EST. MARKET VALUE</span>
                  <span style={{ fontFamily: "'Orbitron', monospace", fontSize: 15, fontWeight: 700, color: B.amber }}>
                    ₦{wantShoe.value.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            {/* Fair Trade Index Gauge */}
            <div style={{
              background: '#0D0F14',
              borderRadius: '14px',
              padding: '20px',
              border: `1px solid ${B.gunmetal}`,
              marginBottom: '24px'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8, flexWrap: 'wrap', gap: 8 }}>
                <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 11, color: B.white, fontWeight: 700 }}>
                  ⚖️ FAIR TRADE EQUIVALENCE SCORE
                </span>
                <span style={{ fontFamily: "'Orbitron', monospace", fontSize: 14, fontWeight: 900, color: fairnessScore >= 85 ? B.neonLime : B.amber }}>
                  {fairnessScore}% MATCH QUALITY
                </span>
              </div>

              {/* Progress bar */}
              <div style={{ height: 8, background: '#1c212d', borderRadius: 4, overflow: 'hidden', marginBottom: 14 }}>
                <div style={{
                  height: '100%',
                  width: `${fairnessScore}%`,
                  background: fairnessScore >= 85 ? `linear-gradient(90deg, ${B.amber}, ${B.neonLime})` : B.amber,
                  borderRadius: 4,
                  transition: 'width 0.4s ease'
                }} />
              </div>

              {/* Valuation Recommendation */}
              <div style={{
                padding: '12px 14px',
                borderRadius: '8px',
                background: isStraightTrade ? 'rgba(0, 255, 128, 0.08)' : 'rgba(255, 184, 0, 0.08)',
                border: `1px solid ${isStraightTrade ? B.neonLime + '44' : B.amber + '44'}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: 10
              }}>
                <div>
                  <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 11, fontWeight: 700, color: isStraightTrade ? B.neonLime : B.amber }}>
                    {isStraightTrade ? '🤝 RECOMMENDED: STRAIGHT 1:1 TRADE' : '⚖️ RECOMMENDED VALUE BALANCE ADJUSTMENT'}
                  </div>
                  <div style={{ fontSize: 13, color: '#D1D5DB', marginTop: 4, fontFamily: "'Syne', sans-serif" }}>
                    {isStraightTrade
                      ? 'Values are within fair parity margins. No additional cash needed between parties.'
                      : wantShoe.value > haveShoe.value
                        ? `Target grail carries higher market value. Recommend +₦${valueDelta.toLocaleString()} cash top-up from you.`
                        : `Your grail carries higher market value. Recommend +₦${valueDelta.toLocaleString()} cash payout to you.`
                    }
                  </div>
                </div>
              </div>

              <div style={{ marginTop: 12, fontSize: 12, color: '#9CA3AF', fontFamily: "'Syne', sans-serif", lineHeight: 1.5 }}>
                🛡️ <strong style={{ color: B.white }}>Sneakers Fest Authentication Pit Guarantee:</strong> Both sneakers undergo mandatory dual-authenticator inspection at Muri Okunola Park Zone B with ultraviolet spectroscopy, stitch-density check, and anti-swap tamper tags before handover.
              </div>
            </div>

            {/* Rendezvous Pass Display or Book Button */}
            {rendezvousPass ? (
              <div style={{
                background: 'linear-gradient(135deg, #131720 0%, #0a0d13 100%)',
                border: `2px solid ${B.neonLime}`,
                borderRadius: '16px',
                padding: '24px',
                boxShadow: `0 0 30px ${B.neonLime}22`
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 10, marginBottom: 16 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ fontSize: 18 }}>🎟️</span>
                    <span style={{ fontFamily: "'Orbitron', monospace", fontWeight: 900, fontSize: 16, color: B.neonLime }}>
                      LSX RENDEZVOUS PASS CONFIRMED
                    </span>
                  </div>
                  <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 11, color: B.neonCyan }}>
                    PASS #{rendezvousPass.code}
                  </span>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 14, marginBottom: 20 }}>
                  <div style={{ background: '#080a0f', padding: '12px', borderRadius: 8, border: `1px solid ${B.gunmetal}` }}>
                    <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 9, color: '#9CA3AF' }}>RENDEZVOUS LOCATION</div>
                    <div style={{ color: B.white, fontWeight: 700, fontSize: 13, marginTop: 4 }}>{rendezvousPass.desk}</div>
                    <div style={{ color: B.smoke, fontSize: 11, marginTop: 2 }}>Muri Okunola Park, VI</div>
                  </div>
                  <div style={{ background: '#080a0f', padding: '12px', borderRadius: 8, border: `1px solid ${B.gunmetal}` }}>
                    <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 9, color: '#9CA3AF' }}>AUTHENTICATION TIME SLOT</div>
                    <div style={{ color: B.amber, fontWeight: 700, fontSize: 13, marginTop: 4 }}>{rendezvousPass.slot}</div>
                    <div style={{ color: B.smoke, fontSize: 11, marginTop: 2 }}>Physical queue priority</div>
                  </div>
                  <div style={{ background: '#080a0f', padding: '12px', borderRadius: 8, border: `1px solid ${B.gunmetal}` }}>
                    <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 9, color: '#9CA3AF' }}>OFFICIAL TRADE TERMS</div>
                    <div style={{ color: B.neonLime, fontWeight: 700, fontSize: 13, marginTop: 4 }}>{rendezvousPass.cashBalance}</div>
                    <div style={{ color: B.smoke, fontSize: 11, marginTop: 2 }}>{rendezvousPass.fairness}</div>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                  <button
                    onClick={() => {
                      alert(`LSX Pass ${rendezvousPass.code} confirmed! Present at Zone B Authentication Desk on festival day.`)
                      playFestivalSound('xp_gain')
                    }}
                    style={{
                      flex: '1 1 200px',
                      padding: '12px 18px',
                      background: B.neonLime,
                      color: B.black,
                      border: 'none',
                      borderRadius: 8,
                      fontFamily: "'Space Mono', monospace",
                      fontSize: 11,
                      fontWeight: 800,
                      cursor: 'pointer'
                    }}
                  >
                    💾 SAVE DIGITAL RENDEZVOUS PASS
                  </button>
                  <button
                    onClick={() => {
                      setRendezvousPass(null)
                      try { localStorage.removeItem('sf26_lsx_rendezvous') } catch {}
                      playFestivalSound('zone_click')
                    }}
                    style={{
                      padding: '12px 18px',
                      background: 'transparent',
                      color: '#9CA3AF',
                      border: `1px solid ${B.gunmetal}`,
                      borderRadius: 8,
                      fontFamily: "'Space Mono', monospace",
                      fontSize: 11,
                      cursor: 'pointer'
                    }}
                  >
                    CHANGE PAIR / RESCHEDULE
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={handleLockRendezvous}
                style={{
                  width: '100%',
                  padding: '16px 24px',
                  background: `linear-gradient(90deg, ${B.amber}, #FFA000)`,
                  border: 'none',
                  borderRadius: '12px',
                  color: B.black,
                  fontFamily: "'Space Mono', monospace",
                  fontSize: '13px',
                  fontWeight: 900,
                  letterSpacing: '0.12em',
                  cursor: 'pointer',
                  boxShadow: '0 8px 30px rgba(255, 184, 0, 0.4)',
                  transition: 'transform 0.2s, box-shadow 0.2s'
                }}
              >
                🔒 LOCK FESTIVAL RENDEZVOUS & AUTHENTICATION DESK (+75 XP)
              </button>
            )}
          </div>
        )}

        {/* Live Marketplace Telemetry & Filters */}
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '16px',
          justifyContent: 'space-between',
          alignItems: 'center',
          background: 'rgba(255,255,255,0.03)',
          border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: '16px',
          padding: '16px 20px',
          marginBottom: '36px'
        }}>
          {/* Search Box */}
          <div style={{ flex: '1 1 280px', minWidth: '260px' }}>
            <input
              type="text"
              placeholder="Search grail, seller, or Lagos axis (e.g., Lekki, Yaba)..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{
                width: '100%',
                padding: '12px 18px',
                borderRadius: '10px',
                background: '#0D0F14',
                border: '1px solid rgba(255,255,255,0.15)',
                color: '#fff',
                fontSize: '14px',
                outline: 'none',
                boxSizing: 'border-box'
              }}
            />
          </div>

          {/* Quick Filters */}
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {[
              { id: 'ALL', label: 'All Drops' },
              { id: 'GRAIL', label: '🔥 Grail Tier (95+ Hype)' },
              { id: 'VERIFIED', label: '🛡️ Escrow Verified' },
              { id: 'ISLAND', label: '🏝️ Island Hub' },
              { id: 'MAINLAND', label: '⚡ Mainland Hub' }
            ].map(f => (
              <button
                key={f.id}
                onClick={() => setFilter(f.id)}
                style={{
                  padding: '9px 14px',
                  borderRadius: '8px',
                  border: filter === f.id ? '1px solid #FFB800' : '1px solid rgba(255,255,255,0.1)',
                  background: filter === f.id ? 'rgba(255, 184, 0, 0.15)' : 'rgba(255,255,255,0.02)',
                  color: filter === f.id ? '#FFB800' : '#A0AEC0',
                  fontSize: '13px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* Listings Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
          gap: '24px',
          marginBottom: '40px'
        }}>
          {filteredListings.map(item => (
            <div
              key={item.id}
              style={{
                background: '#0D0F14',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: '18px',
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
                transition: 'transform 0.2s, border-color 0.2s',
                boxShadow: '0 8px 30px rgba(0,0,0,0.4)',
                position: 'relative'
              }}
            >
              {/* Image & Hype Badge */}
              <div style={{ position: 'relative', height: '220px', overflow: 'hidden', background: '#171A21' }}>
                <img
                  src={item.image}
                  alt={item.title}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    filter: 'contrast(1.05)'
                  }}
                />
                <div style={{
                  position: 'absolute',
                  top: '12px',
                  left: '12px',
                  background: 'rgba(0,0,0,0.75)',
                  backdropFilter: 'blur(6px)',
                  padding: '4px 10px',
                  borderRadius: '6px',
                  fontSize: '11px',
                  fontWeight: '700',
                  color: '#FFB800',
                  border: '1px solid rgba(255,184,0,0.3)'
                }}>
                  {item.condition}
                </div>
                <div style={{
                  position: 'absolute',
                  top: '12px',
                  right: '12px',
                  background: '#00E5FF',
                  color: '#000',
                  padding: '4px 8px',
                  borderRadius: '6px',
                  fontSize: '11px',
                  fontWeight: '800'
                }}>
                  HYPE {item.hypeIndex}/100
                </div>
              </div>

              {/* Card Body */}
              <div style={{ padding: '20px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                  <span style={{ fontSize: '12px', color: '#718096', textTransform: 'uppercase', fontWeight: '700' }}>
                    SIZE: <strong style={{ color: '#fff' }}>{item.size}</strong>
                  </span>
                  <span style={{ fontSize: '11px', color: '#00E5FF', fontWeight: '600' }}>
                    📍 {item.location}
                  </span>
                </div>

                <h3 style={{
                  fontSize: '17px',
                  fontWeight: '800',
                  margin: '0 0 10px 0',
                  color: '#fff',
                  lineHeight: '1.3'
                }}>
                  {item.title}
                </h3>

                <div style={{
                  display: 'flex', alignItems: 'center', gap: '6px',
                  padding: '4px 8px', borderRadius: '4px',
                  background: 'rgba(192, 132, 252, 0.08)', border: '1px solid rgba(192, 132, 252, 0.25)',
                  marginBottom: '10px'
                }}>
                  <span style={{ fontSize: '10px' }}>⚡</span>
                  <span style={{ fontSize: '10px', color: '#C084FC', fontFamily: "'Space Mono', monospace", fontWeight: '700' }}>
                    CATALYST ARBITRAGE: +{(12 + (item.hypeIndex % 15)).toFixed(1)}% RESALE VELOCITY
                  </span>
                </div>

                <div style={{
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid rgba(255,255,255,0.06)',
                  borderRadius: '10px',
                  padding: '10px 12px',
                  marginBottom: '16px'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '4px' }}>
                    <span style={{ color: '#A0AEC0' }}>Seller:</span>
                    <span style={{ color: '#FFB800', fontWeight: '700' }}>@{item.seller} ({item.sellerRep}%)</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: '#718096' }}>
                    <span>Trades: {item.tradesCompleted} Completed</span>
                    <span style={{ color: '#38A169' }}>✔ SF Physical Escrow</span>
                  </div>
                </div>

                <div style={{ marginTop: 'auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontSize: '10px', color: '#718096', textTransform: 'uppercase' }}>Asking Price</div>
                    <div style={{ fontSize: '20px', fontWeight: '900', color: '#FFB800' }}>
                      ₦{item.priceNgn.toLocaleString()}
                    </div>
                  </div>

                  <button
                    onClick={() => startEscrowBuy(item)}
                    style={{
                      background: 'linear-gradient(135deg, #FFB800 0%, #D99B00 100%)',
                      color: '#000',
                      border: 'none',
                      padding: '10px 18px',
                      borderRadius: '8px',
                      fontWeight: '800',
                      fontSize: '13px',
                      cursor: 'pointer',
                      boxShadow: '0 4px 15px rgba(255,184,0,0.3)',
                      transition: 'transform 0.1s'
                    }}
                  >
                    Lock & Inspect
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Escrow Modal Interaction */}
        {escrowModal && (
          <div style={{
            position: 'fixed',
            top: 0, left: 0, right: 0, bottom: 0,
            background: 'rgba(0,0,0,0.85)',
            backdropFilter: 'blur(8px)',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px'
          }}>
            <div style={{
              background: '#0F1218',
              border: '1px solid rgba(255, 184, 0, 0.4)',
              borderRadius: '20px',
              maxWidth: '520px',
              width: '100%',
              padding: '28px',
              boxShadow: '0 20px 60px rgba(0,0,0,0.9)',
              position: 'relative'
            }}>
              <button
                onClick={() => setEscrowModal(null)}
                style={{
                  position: 'absolute',
                  top: '16px',
                  right: '16px',
                  background: 'none',
                  border: 'none',
                  color: '#A0AEC0',
                  fontSize: '20px',
                  cursor: 'pointer'
                }}
              >
                ✕
              </button>

              <div style={{ fontSize: '11px', color: '#FFB800', fontWeight: '800', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '8px' }}>
                Sneakers Fest Secure Settlement Protocol
              </div>

              <h3 style={{ fontSize: '22px', fontWeight: '900', margin: '0 0 16px 0', color: '#fff' }}>
                Lock In {escrowModal.title}
              </h3>

              <div style={{
                background: 'rgba(255,255,255,0.03)',
                borderRadius: '12px',
                padding: '14px',
                border: '1px solid rgba(255,255,255,0.08)',
                marginBottom: '20px'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', fontSize: '13px' }}>
                  <span style={{ color: '#A0AEC0' }}>Negotiated Price:</span>
                  <span style={{ fontWeight: '800', color: '#FFB800' }}>₦{escrowModal.priceNgn.toLocaleString()}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', fontSize: '13px' }}>
                  <span style={{ color: '#A0AEC0' }}>Escrow Protection Fee (2%):</span>
                  <span style={{ color: '#fff' }}>₦{(escrowModal.priceNgn * 0.02).toLocaleString()}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '6px' }}>
                  <span style={{ fontWeight: '700', color: '#fff' }}>Total Settlement Vault:</span>
                  <span style={{ fontWeight: '900', color: '#00E5FF' }}>₦{(escrowModal.priceNgn * 1.02).toLocaleString()}</span>
                </div>
              </div>

              {escrowStep === 1 && (
                <div>
                  <p style={{ fontSize: '13px', color: '#A0AEC0', lineHeight: '1.5', marginBottom: '20px' }}>
                    When you click "Initialize Escrow Lock", your funds are held safely in the Sneakers Fest Verification Vault. The seller (@{escrowModal.seller}) must hand deliver the pair to the Muri Okunola Park Festival Authentication Booth or Lagos Express Dispatch before funds are disbursed.
                  </p>
                  <button
                    onClick={handleEscrowLock}
                    style={{
                      width: '100%',
                      background: '#FFB800',
                      color: '#000',
                      border: 'none',
                      padding: '14px',
                      borderRadius: '10px',
                      fontSize: '15px',
                      fontWeight: '800',
                      cursor: 'pointer',
                      boxShadow: '0 4px 20px rgba(255,184,0,0.4)'
                    }}
                  >
                    🔒 Initialize Escrow Lock & Dispatch Courier
                  </button>
                </div>
              )}

              {escrowStep === 2 && (
                <div style={{ textAlign: 'center', padding: '30px 0' }}>
                  <div style={{
                    width: '40px',
                    height: '40px',
                    border: '3px solid #FFB800',
                    borderTopColor: 'transparent',
                    borderRadius: '50%',
                    margin: '0 auto 16px auto',
                    animation: 'spin 1s linear infinite'
                  }} />
                  <div style={{ color: '#FFB800', fontWeight: '800', fontSize: '16px' }}>
                    Contacting Lagos Escrow Smart Ledger...
                  </div>
                  <div style={{ color: '#718096', fontSize: '13px', marginTop: '6px' }}>
                    Generating QR Token for Muri Okunola physical check-in...
                  </div>
                </div>
              )}

              {escrowStep === 3 && (
                <div style={{ textAlign: 'center', padding: '20px 0' }}>
                  <div style={{ fontSize: '40px', marginBottom: '10px' }}>🎉</div>
                  <h4 style={{ fontSize: '18px', fontWeight: '800', color: '#38A169', margin: '0 0 8px 0' }}>
                    Escrow Vault Locked Successfully!
                  </h4>
                  <p style={{ fontSize: '13px', color: '#CBD5E0', lineHeight: '1.5', margin: '0 0 16px 0' }}>
                    Trade token <strong>#SF-LSX-{escrowModal.id}</strong> has been transmitted. Both you and <strong>@{escrowModal.seller}</strong> have received your festival authentication codes.
                  </p>
                  <button
                    onClick={() => setEscrowModal(null)}
                    style={{
                      background: '#2D3748',
                      color: '#fff',
                      border: 'none',
                      padding: '10px 24px',
                      borderRadius: '8px',
                      fontWeight: '700',
                      cursor: 'pointer'
                    }}
                  >
                    Close & Return to Pit
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
