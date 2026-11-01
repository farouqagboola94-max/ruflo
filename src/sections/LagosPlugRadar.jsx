import { useState } from 'react'
import { B } from '../tokens'
import { GrainOverlay, SectionTag } from '../components/Shared'
import {
  useFestivalGamification,
  playFestivalSound,
  dispatchFestivalAction,
  FESTIVAL_ACTIONS
} from '../framework/festivalFramework'

const DISTRICTS = ['ALL', 'VICTORIA ISLAND', 'LEKKI', 'YABA & SURULERE', 'IKEJA']

const VERIFIED_PLUGS = [
  {
    id: 'PLUG-01',
    name: 'The Grail Vault VI',
    district: 'VICTORIA ISLAND',
    address: 'Adeola Odeku St, Victoria Island, Lagos',
    specialty: 'Rare SB Dunks, Off-White & Trophy Room Grails',
    status: 'OFFICIAL BOOTH CONFIRMED',
    booth: 'Grail Cell A-01 (VIP Wing)',
    rating: '5.0 ★ (140+ Authenticated Trades)',
    contact: '@grailvault_vi',
    distance: '5 mins from Freedom Park via Falomo/Marina'
  },
  {
    id: 'PLUG-02',
    name: 'Kicks of Lekki',
    district: 'LEKKI',
    address: 'Admiralty Way, Lekki Phase 1, Lagos',
    specialty: 'Jordan 1 Highs, Travis Scott Lows & Yeezy Archive',
    status: 'OFFICIAL BOOTH CONFIRMED',
    booth: 'Grail Cell A-02',
    rating: '4.9 ★ (210+ Verified Trades)',
    contact: '@kicksoflekki_ng',
    distance: '12 mins from Freedom Park, CMS'
  },
  {
    id: 'PLUG-03',
    name: 'Lagos Deadstock Boutique',
    district: 'VICTORIA ISLAND',
    address: 'Akin Adesola St, Victoria Island, Lagos',
    specialty: 'Travis Scott, Tiffany AF1 & Vintage 1985 AJ1s',
    status: 'OFFICIAL BOOTH CONFIRMED',
    booth: 'Grail Cell A-03',
    rating: '5.0 ★ (115+ Grails Sold)',
    contact: '@lagosdeadstock',
    distance: '5 mins from Freedom Park, CMS'
  },
  {
    id: 'PLUG-04',
    name: 'Sole House Lagos',
    district: 'LEKKI',
    address: 'Fola Osibo Rd, Lekki Phase 1, Lagos',
    specialty: 'Jordan 4s, Kobe Protros & Luxury Streetwear',
    status: 'OFFICIAL BOOTH CONFIRMED',
    booth: 'Grail Cell A-04',
    rating: '4.9 ★ (180+ Verified Sales)',
    contact: '@solehouselagos',
    distance: '14 mins from Freedom Park, CMS'
  },
  {
    id: 'PLUG-05',
    name: 'Mainland Sole Lab',
    district: 'YABA & SURULERE',
    address: 'Herbert Macaulay Way, Yaba, Lagos',
    specialty: 'Deep Ultrasonic Cleaning, Sole Unyellowing & Suede Revival',
    status: 'OFFICIAL BOOTH CONFIRMED',
    booth: 'Clinic 01 (Freedom Courtyard)',
    rating: '4.9 ★ (320+ Restorations)',
    contact: '@mainlandsolelab',
    distance: '15 mins via Carter / 3MB to CMS'
  },
  {
    id: 'PLUG-06',
    name: 'Sneaker Spa Lagos',
    district: 'VICTORIA ISLAND',
    address: 'Karimu Kotun St, Victoria Island, Lagos',
    specialty: 'Express Steam Clean, Midsole Repaint & Crease Removal',
    status: 'OFFICIAL BOOTH CONFIRMED',
    booth: 'Clinic 02 (Freedom Courtyard)',
    rating: '5.0 ★ (290+ Pairs Restored)',
    contact: '@sneakerspalagos',
    distance: '6 mins from Freedom Park, CMS'
  },
  {
    id: 'PLUG-07',
    name: 'Ikeja Kicks Collective',
    district: 'IKEJA',
    address: 'Allen Avenue, Ikeja, Lagos',
    specialty: 'New Balance 9060/1906R, Asics Gel-Kayano & Daily Runners',
    status: 'OFFICIAL BOOTH CONFIRMED',
    booth: 'Pergola B-01',
    rating: '4.8 ★ (160+ Verified Trades)',
    contact: '@ikeja_kickscollective',
    distance: 'Direct BRT / 3MB access to CMS'
  },
  {
    id: 'PLUG-08',
    name: 'Drip Station Lagos',
    district: 'LEKKI',
    address: 'Freedom Way, Ikate Lekki, Lagos',
    specialty: 'Corteiz, Bape, Supreme & Limited Collab Footwear',
    status: 'OFFICIAL BOOTH CONFIRMED',
    booth: 'Pergola B-02',
    rating: '4.9 ★ (150+ Drops Fulfilled)',
    contact: '@dripstation_lagos',
    distance: '18 mins from Freedom Park, CMS'
  },
  {
    id: 'PLUG-09',
    name: 'Surulere Sole Supply',
    district: 'YABA & SURULERE',
    address: 'Bode Thomas St, Surulere, Lagos',
    specialty: 'Classic Air Max, Nike TN, Basketball Performance & Retros',
    status: 'OFFICIAL BOOTH CONFIRMED',
    booth: 'Pergola B-03',
    rating: '4.8 ★ (205+ Community Sales)',
    contact: '@suruleresolesupply',
    distance: '12 mins via Blue Line Rail to CMS'
  },
  {
    id: 'PLUG-10',
    name: 'Yaba Thrift & Vintage Archive',
    district: 'YABA & SURULERE',
    address: 'Tejuosho Market Annex, Yaba, Lagos',
    specialty: 'Curated 90s Archive Sportswear, Samba OG & Rare Samples',
    status: 'OFFICIAL BOOTH CONFIRMED',
    booth: 'Pergola B-04',
    rating: '4.9 ★ (340+ Curated Finds)',
    contact: '@yabavintage_archive',
    distance: '14 mins via Carter / 3MB to CMS'
  }
]

export default function LagosPlugRadar() {
  const [filter, setFilter] = useState('ALL')
  const [search, setSearch] = useState('')
  const [selectedPlug, setSelectedPlug] = useState(null)
  const [discountSaved, setDiscountSaved] = useState(false)
  const [discountCode, setDiscountCode] = useState(null)

  const { awardXP, unlockBadge } = useFestivalGamification()

  const filteredPlugs = VERIFIED_PLUGS.filter(p => {
    const matchesFilter = filter === 'ALL' || p.district === filter
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase()) ||
                          p.specialty.toLowerCase().includes(search.toLowerCase()) ||
                          p.address.toLowerCase().includes(search.toLowerCase()) ||
                          p.booth.toLowerCase().includes(search.toLowerCase())
    return matchesFilter && matchesSearch
  })

  const handleClaimVoucher = (plug) => {
    const code = `RADAR-${plug.id.split('-')[1]}-${Math.floor(1000 + Math.random() * 9000)}`
    setDiscountCode(code)
    setSelectedPlug(plug)
    setDiscountSaved(true)

    awardXP(80, 'Claimed Verified Plug Festival Pass')
    unlockBadge('VERIFIED_PLUG_NAVIGATOR')
    playFestivalSound('badge_unlock')
    dispatchFestivalAction(FESTIVAL_ACTIONS.ADD_NOTIFICATION, {
      title: 'Festival Partner Voucher Claimed!',
      message: `10% Festival Discount at ${plug.name} (${plug.booth}). Voucher: ${code}`
    })
  }

  return (
    <section id="plug-radar" style={{
      position: 'relative',
      overflow: 'hidden',
      background: 'radial-gradient(circle at 50% 0%, #0c181f 0%, #05070f 100%)',
      color: '#fff',
      padding: '90px 24px',
      borderTop: `1px solid ${B.neonCyan}30`,
      borderBottom: `1px solid ${B.neonCyan}30`
    }}>
      <div id="sneaker-eulogy" style={{ position: 'absolute', top: 0, left: 0, width: '1px', height: '1px', visibility: 'hidden' }} />
      <GrainOverlay />

      <div style={{ maxWidth: 1200, margin: '0 auto', position: 'relative', zIndex: 10 }}>
        <SectionTag color={B.neonCyan}>COMMERCIAL DIRECTORY · 10 VERIFIED LAGOS BOUTIQUES &amp; SPAS</SectionTag>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: 20, marginBottom: 36 }}>
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: `${B.neonCyan}15`, border: `1px solid ${B.neonCyan}40`, borderRadius: 999, padding: '4px 14px', marginBottom: 12 }}>
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: B.neonCyan, boxShadow: `0 0 10px ${B.neonCyan}` }} />
              <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 10, color: B.neonCyan, letterSpacing: '0.15em', fontWeight: 700 }}>
                LAGOS VERIFIED INVENTORY NETWORK · 10 CONFIRMED BOOTHS
              </span>
            </div>
            <h2 style={{ fontFamily: "'Orbitron', monospace", fontWeight: 900, fontSize: 'clamp(28px, 4.5vw, 48px)', color: B.white, lineHeight: 1.1 }}>
              VERIFIED PLUG <span style={{ color: B.neonCyan, textShadow: `0 0 25px ${B.neonCyan}50` }}>RADAR</span>
            </h2>
            <p style={{ fontFamily: "'Space Mono', monospace", fontSize: 'clamp(11px, 1.4vw, 13px)', color: B.mist, marginTop: 10, maxWidth: 660, lineHeight: 1.6 }}>
              The master roster of 10 pre-vetted sneaker boutiques, restoration spas, and authenticated resellers across Victoria Island, Lekki, Yaba, Surulere, and Ikeja—each confirmed with an official Grail Cell or Pergola booth at Freedom Park, CMS on December 12.
            </p>
          </div>

          {/* Search bar */}
          <div style={{ minWidth: 280 }}>
            <input
              type="text"
              placeholder="Search boutique, booth, brand, or area..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{
                width: '100%',
                background: B.charcoal,
                border: `1px solid ${B.gunmetal}`,
                borderRadius: 6,
                padding: '12px 16px',
                color: B.white,
                fontFamily: "'Space Mono', monospace",
                fontSize: 11
              }}
            />
          </div>
        </div>

        {/* District Filter Tabs */}
        <div style={{ display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 12, marginBottom: 28 }}>
          {DISTRICTS.map(d => (
            <button
              key={d}
              type="button"
              onClick={() => { setFilter(d); playFestivalSound('zone_click') }}
              style={{
                background: filter === d ? `${B.neonCyan}20` : B.charcoal,
                border: filter === d ? `1px solid ${B.neonCyan}` : `1px solid ${B.gunmetal}`,
                borderRadius: 6,
                padding: '8px 16px',
                color: filter === d ? B.neonCyan : B.smoke,
                fontFamily: "'Space Mono', monospace",
                fontSize: 10,
                fontWeight: 700,
                letterSpacing: '0.1em',
                cursor: 'pointer',
                whiteSpace: 'nowrap'
              }}
            >
              {d} ({d === 'ALL' ? VERIFIED_PLUGS.length : VERIFIED_PLUGS.filter(p => p.district === d).length})
            </button>
          ))}
        </div>

        {/* Plugs Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 20 }}>
          {filteredPlugs.map(plug => (
            <div
              key={plug.id}
              style={{
                background: 'rgba(16, 20, 28, 0.85)',
                border: `1px solid ${B.gunmetal}`,
                borderRadius: 10,
                padding: 20,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                transition: 'transform 0.2s ease, border-color 0.2s ease'
              }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = `${B.neonCyan}80`; e.currentTarget.style.transform = 'translateY(-3px)' }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = B.gunmetal; e.currentTarget.style.transform = 'translateY(0)' }}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10, gap: 8, flexWrap: 'wrap' }}>
                  <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 9, color: B.neonCyan, letterSpacing: '0.12em', fontWeight: 700 }}>
                    {plug.district}
                  </span>
                  <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                    <span style={{ background: `${B.amber}18`, border: `1px solid ${B.amber}50`, color: B.amber, padding: '2px 7px', borderRadius: 4, fontSize: 8.5, fontFamily: "'Space Mono', monospace", fontWeight: 700 }}>
                      {plug.status}
                    </span>
                    <span style={{ background: `${B.neonLime}15`, border: `1px solid ${B.neonLime}40`, color: B.neonLime, padding: '2px 8px', borderRadius: 4, fontSize: 9, fontFamily: "'Space Mono', monospace" }}>
                      {plug.booth}
                    </span>
                  </div>
                </div>

                <h3 style={{ fontFamily: "'Orbitron', monospace", fontSize: 16, color: B.white, fontWeight: 700, marginBottom: 6 }}>
                  {plug.name}
                </h3>

                <p style={{ fontFamily: "'Space Mono', monospace", fontSize: 10, color: B.mist, marginBottom: 12 }}>
                  📍 {plug.address} · <span style={{ color: B.neonCyan }}>{plug.distance}</span>
                </p>

                <div style={{ background: B.charcoal, borderRadius: 6, padding: '10px 12px', marginBottom: 14 }}>
                  <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 9, color: B.smoke, marginBottom: 2 }}>CORE INVENTORY &amp; SPECIALTY</div>
                  <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 12, color: B.white, fontWeight: 600 }}>{plug.specialty}</div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: "'Space Mono', monospace", fontSize: 10, color: B.smoke, marginBottom: 14 }}>
                  <span>{plug.rating}</span>
                  <span style={{ color: B.neonCyan }}>{plug.contact}</span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => handleClaimVoucher(plug)}
                style={{
                  background: `${B.neonCyan}15`,
                  border: `1px solid ${B.neonCyan}`,
                  color: B.neonCyan,
                  padding: '10px',
                  borderRadius: 6,
                  fontFamily: "'Space Mono', monospace",
                  fontSize: 10,
                  fontWeight: 700,
                  letterSpacing: '0.1em',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 8
                }}
              >
                <span>🏷️</span> CLAIM FESTIVAL 10% VOUCHER (+80 XP)
              </button>
            </div>
          ))}
        </div>

        {/* Claimed Modal / Toast Feedback */}
        {discountSaved && selectedPlug && (
          <div style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.85)',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 20
          }}>
            <div style={{
              background: '#0d1318',
              border: `1px solid ${B.neonCyan}`,
              borderRadius: 12,
              padding: 28,
              maxWidth: 440,
              width: '100%',
              textAlign: 'center',
              boxShadow: `0 0 50px ${B.neonCyan}40`
            }}>
              <div style={{ fontSize: 36, marginBottom: 12 }}>🎫</div>
              <h3 style={{ fontFamily: "'Orbitron', monospace", fontSize: 18, color: B.neonCyan, fontWeight: 800, marginBottom: 8 }}>
                PARTNER VOUCHER ACTIVATED
              </h3>
              <p style={{ fontFamily: "'Space Mono', monospace", fontSize: 11, color: B.mist, marginBottom: 16, lineHeight: 1.5 }}>
                Present this pass at <strong style={{ color: B.white }}>{selectedPlug.name}</strong> ({selectedPlug.booth}) on December 12 at Freedom Park, CMS for 10% off grails, cleanings, and apparel.
              </p>
              <div style={{
                background: B.charcoal,
                border: `1px dashed ${B.neonCyan}`,
                borderRadius: 8,
                padding: '12px',
                fontFamily: "'Space Mono', monospace",
                fontSize: 16,
                fontWeight: 800,
                color: B.white,
                letterSpacing: '0.15em',
                marginBottom: 20
              }}>
                {discountCode}
              </div>
              <button
                type="button"
                onClick={() => setDiscountSaved(false)}
                style={{
                  background: B.neonCyan,
                  color: B.black,
                  border: 'none',
                  borderRadius: 6,
                  padding: '12px 24px',
                  fontFamily: "'Space Mono', monospace",
                  fontSize: 11,
                  fontWeight: 800,
                  cursor: 'pointer'
                }}
              >
                CLOSE &amp; RETURN TO FESTIVAL
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
