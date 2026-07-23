import { useState, useEffect, useRef } from 'react'
import { B } from '../tokens'
import { GrainOverlay, ScanLines, SectionTag } from '../components/Shared'

const INITIAL_LOTS = [
  { id: 1, name: "Air Jordan 1 Retro High OG 'Bred Toe'", condition: 'DS', size: 'UK 9', description: 'OG bred toe 2018 release. Perfect creases, original receipt. Lagos grail-tier.', startBid: 280000 },
  { id: 2, name: "Off-White × Nike Dunk Low 'Lot 1 of 50'", condition: 'VNDS', size: 'UK 10', description: 'Posthumous Virgil Abloh collab. Near deadstock, tried on twice indoors only.', startBid: 1200000 },
  { id: 3, name: "Travis Scott × AJ1 Low 'Olive'", condition: 'DS', size: 'UK 8', description: 'Brand new, never laced. Sought-after collab. Reverse swoosh intact.', startBid: 480000 },
  { id: 4, name: "Adidas Yeezy Boost 350 V2 'Zebra'", condition: 'DS', size: 'UK 10.5', description: '2022 OG restock. Sealed box, legit-checked by Legit Grails Lagos.', startBid: 195000 },
  { id: 5, name: "Sacai × Nike LDWaffle 'Blue Multi'", condition: 'DS', size: 'UK 9.5', description: 'Rare collab, not carried by many Lagos stockists. Full DS with receipt.', startBid: 320000 },
  { id: 6, name: "New Balance 992 'Made in USA Grey'", condition: 'DS', size: 'UK 9', description: 'Classic American-made NB. Extremely limited Lagos allocation — only 8 pairs.', startBid: 175000 },
]

const DURATION = 90

function formatNaira(n) {
  return '₦' + n.toLocaleString('en-NG')
}

function formatTime(s) {
  const m = Math.floor(s / 60)
  const sec = s % 60
  return `${m}:${String(sec).padStart(2, '0')}`
}

export default function AuctionWall() {
  const [lots, setLots] = useState(() =>
    INITIAL_LOTS.map(l => ({ ...l, currentBid: l.startBid, bidCount: 0, timeLeft: DURATION, locked: false, flash: false }))
  )

  const lotsRef = useRef(lots)
  lotsRef.current = lots

  useEffect(() => {
    const tickId = setInterval(() => {
      setLots(prev => prev.map(lot => {
        if (lot.locked) return lot
        const t = lot.timeLeft - 1
        return t <= 0 ? { ...lot, timeLeft: 0, locked: true } : { ...lot, timeLeft: t }
      }))
    }, 1000)

    const bidId = setInterval(() => {
      setLots(prev => {
        const active = prev.filter(l => !l.locked)
        if (!active.length) return prev
        const target = active[Math.floor(Math.random() * active.length)]
        return prev.map(lot => {
          if (lot.id !== target.id || lot.locked) return lot
          return {
            ...lot,
            currentBid: Math.round(lot.currentBid * 1.03),
            bidCount: lot.bidCount + 1,
            timeLeft: Math.min(lot.timeLeft + 8, DURATION),
            flash: true,
          }
        })
      })
      setTimeout(() => {
        setLots(prev => prev.map(l => ({ ...l, flash: false })))
      }, 400)
    }, 3800)

    return () => { clearInterval(tickId); clearInterval(bidId) }
  }, [])

  function placeBid(id) {
    setLots(prev => prev.map(lot => {
      if (lot.id !== id || lot.locked) return lot
      return {
        ...lot,
        currentBid: Math.round(lot.currentBid * 1.05),
        bidCount: lot.bidCount + 1,
        timeLeft: Math.min(lot.timeLeft + 10, DURATION),
        flash: true,
      }
    }))
    setTimeout(() => setLots(prev => prev.map(l => l.id === id ? { ...l, flash: false } : l)), 500)
  }

  const activeLots = lots.filter(l => !l.locked)
  const closedLots = lots.filter(l => l.locked)

  return (
    <section id="auction-wall" style={{ background: '#040404', padding: '80px 20px', position: 'relative', overflow: 'hidden' }}>
      <GrainOverlay />
      <ScanLines />
      <style>{`
        @keyframes awFlash { 0%{background:#1c1400} 40%{background:#2a1f00} 100%{background:#0a0a0a} }
        @keyframes awPop { 0%{transform:scale(1)} 30%{transform:scale(1.025)} 100%{transform:scale(1)} }
      `}</style>

      <div style={{ maxWidth: 960, margin: '0 auto' }}>
        <SectionTag>LIVE AUCTION</SectionTag>
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12, marginBottom: 8 }}>
          <h2 style={{ fontFamily: "'Bebas Neue'", fontSize: 'clamp(2rem,5vw,3.5rem)', color: B.white, letterSpacing: '0.05em', margin: 0 }}>
            GRAIL AUCTION WALL
          </h2>
          <div style={{ display: 'flex', gap: 20 }}>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontFamily: "'Orbitron'", fontSize: 16, color: B.neonLime, fontWeight: 900 }}>{activeLots.length}</div>
              <div style={{ fontFamily: "'Space Mono'", fontSize: 7, color: '#444', letterSpacing: '0.1em' }}>LIVE</div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontFamily: "'Orbitron'", fontSize: 16, color: '#555', fontWeight: 900 }}>{closedLots.length}</div>
              <div style={{ fontFamily: "'Space Mono'", fontSize: 7, color: '#444', letterSpacing: '0.1em' }}>CLOSED</div>
            </div>
          </div>
        </div>
        <p style={{ color: B.smoke, fontFamily: "'Space Mono'", fontSize: '0.72rem', marginBottom: 36, letterSpacing: '0.04em' }}>
          Live bids · Competing buyers auto-bid every few seconds · Place yours before time runs out
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 14 }}>
          {lots.map(lot => {
            const urgent = !lot.locked && lot.timeLeft <= 20
            const borderColor = lot.locked ? '#1a1a1a' : urgent ? '#ef4444' : lot.flash ? B.amber : '#2a2a2a'
            return (
              <div key={lot.id} style={{ background: lot.flash ? undefined : '#0a0a0a', border: `1px solid ${borderColor}`, padding: '18px 20px', transition: 'border-color 0.2s', animation: lot.flash ? 'awFlash 0.4s ease' : undefined, position: 'relative', opacity: lot.locked ? 0.55 : 1 }}>
                {lot.locked && (
                  <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(4,4,4,0.65)', zIndex: 2 }}>
                    <div style={{ fontFamily: "'Orbitron'", fontSize: 14, color: '#555', letterSpacing: '0.15em' }}>AUCTION CLOSED</div>
                  </div>
                )}

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
                  <div style={{ fontFamily: "'Space Mono'", fontSize: 7, color: '#333', letterSpacing: '0.2em' }}>LOT {String(lot.id).padStart(2, '0')}</div>
                  <div style={{ fontFamily: "'Orbitron'", fontSize: 12, color: urgent ? '#ef4444' : lot.locked ? '#333' : '#555', fontWeight: 900, letterSpacing: '0.05em' }}>
                    {lot.locked ? '00:00' : formatTime(lot.timeLeft)}
                  </div>
                </div>

                <div style={{ fontFamily: "'Bebas Neue'", fontSize: 14, color: B.white, letterSpacing: '0.04em', marginBottom: 4, lineHeight: 1.3 }}>{lot.name}</div>
                <div style={{ fontFamily: "'Space Mono'", fontSize: 8, color: B.amber, letterSpacing: '0.1em', marginBottom: 8 }}>{lot.condition} · SZ {lot.size}</div>
                <div style={{ fontFamily: "'Space Mono'", fontSize: 9, color: '#444', lineHeight: 1.6, marginBottom: 14 }}>{lot.description}</div>

                <div style={{ marginBottom: 14 }}>
                  <div style={{ fontFamily: "'Space Mono'", fontSize: 7, color: '#333', letterSpacing: '0.15em', marginBottom: 3 }}>CURRENT BID · {lot.bidCount} BID{lot.bidCount !== 1 ? 'S' : ''}</div>
                  <div style={{ fontFamily: "'Orbitron'", fontSize: 20, color: B.amber, fontWeight: 900, animation: lot.flash ? 'awPop 0.3s ease' : undefined }}>
                    {formatNaira(lot.currentBid)}
                  </div>
                </div>

                <button
                  onClick={() => placeBid(lot.id)}
                  disabled={lot.locked}
                  style={{ width: '100%', padding: '10px', background: lot.locked ? '#111' : B.amber, color: lot.locked ? '#333' : B.black, border: 'none', fontFamily: "'Space Mono'", fontSize: 9, letterSpacing: '0.15em', fontWeight: 700, cursor: lot.locked ? 'default' : 'pointer', transition: 'all 0.2s' }}
                >
                  {lot.locked ? 'CLOSED' : `BID ${formatNaira(Math.round(lot.currentBid * 1.05))} →`}
                </button>
              </div>
            )
          })}
        </div>

        <div style={{ marginTop: 20, padding: '12px 16px', background: '#0a0a0a', border: '1px solid #1a1a1a', fontFamily: "'Space Mono'", fontSize: 8, color: '#333', letterSpacing: '0.1em', textAlign: 'center' }}>
          SF26 DEMO · BIDS ARE SIMULATED · SNEAKERS FEST '26 · MURI OKUNOLA PARK, V/I · DEC 12 2026
        </div>
      </div>
    </section>
  )
}
