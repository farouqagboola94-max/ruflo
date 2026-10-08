import { useState, useMemo } from 'react'
import { SNEAKERS } from '../data/sneakers'
import { B, FONTS } from '../tokens'

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
  }
]

export default function LagosSoleExchange() {
  const [filter, setFilter] = useState('ALL')
  const [search, setSearch] = useState('')
  const [selectedListing, setSelectedListing] = useState(null)
  const [escrowModal, setEscrowModal] = useState(null)
  const [escrowStep, setEscrowStep] = useState(1)
  const [orderConfirmed, setOrderConfirmed] = useState(false)
  const [userOffer, setUserOffer] = useState('')

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
