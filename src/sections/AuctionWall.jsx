import { useState, useEffect, useRef } from 'react'
import { B } from '../tokens'
import { GrainOverlay, ScanLines, SectionTag } from '../components/Shared'
import {
  useFestivalGamification,
  dispatchFestivalAction,
  FESTIVAL_ACTIONS,
  playFestivalSound
} from '../framework/festivalFramework'
import { safeStorage } from '../lib/safeStorage.js'
import { copyToClipboard } from '../lib/clipboard.js'

const INITIAL_LOTS = [
  { id: 1, name: "Air Jordan 1 Retro High OG 'Bred Toe'", condition: 'DS', size: 'UK 9', description: 'OG bred toe 2018 release. Perfect creases, original receipt. Lagos grail-tier.', startBid: 280000, highBidder: 'KicksLord_VI' },
  { id: 2, name: "Off-White × Nike Dunk Low 'Lot 1 of 50'", condition: 'VNDS', size: 'UK 10', description: 'Posthumous Virgil Abloh collab. Near deadstock, tried on twice indoors only.', startBid: 1200000, highBidder: 'MainlandSole' },
  { id: 3, name: "Travis Scott × AJ1 Low 'Olive'", condition: 'DS', size: 'UK 8', description: 'Brand new, never laced. Sought-after collab. Reverse swoosh intact.', startBid: 480000, highBidder: 'LekkiSniper' },
  { id: 4, name: "Adidas Yeezy Boost 350 V2 'Zebra'", condition: 'DS', size: 'UK 10.5', description: '2022 OG restock. Sealed box, legit-checked by Legit Grails Lagos.', startBid: 195000, highBidder: 'AlabaGrail' },
  { id: 5, name: "Sacai × Nike LDWaffle 'Blue Multi'", condition: 'DS', size: 'UK 9.5', description: 'Rare collab, not carried by many Lagos stockists. Full DS with receipt.', startBid: 320000, highBidder: 'YabaSoleClub' },
  { id: 6, name: "New Balance 992 'Made in USA Grey'", condition: 'DS', size: 'UK 9', description: 'Classic American-made NB. Extremely limited Lagos allocation — only 8 pairs.', startBid: 175000, highBidder: 'IkoyiVault' },
]

const DURATION = 90
const MY_BIDS_KEY = 'sf26_auction_my_bids'

function formatNaira(n) {
  return '₦' + n.toLocaleString('en-NG')
}

function formatTime(s) {
  const m = Math.floor(s / 60)
  const sec = s % 60
  return `${m}:${String(sec).padStart(2, '0')}`
}

function playGavelSound() {
  if (typeof window === 'undefined') return
  try {
    const AudioCtx = window.AudioContext || window.webkitAudioContext
    if (!AudioCtx) return
    const ctx = new AudioCtx()
    const now = ctx.currentTime

    // Heavy wooden block resonance
    const osc1 = ctx.createOscillator()
    const gain1 = ctx.createGain()
    osc1.type = 'triangle'
    osc1.frequency.setValueAtTime(140, now)
    osc1.frequency.exponentialRampToValueAtTime(40, now + 0.12)
    gain1.gain.setValueAtTime(0.4, now)
    gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.15)
    osc1.connect(gain1)
    gain1.connect(ctx.destination)
    osc1.start(now)
    osc1.stop(now + 0.15)

    // Wood snap transient
    const osc2 = ctx.createOscillator()
    const gain2 = ctx.createGain()
    osc2.type = 'square'
    osc2.frequency.setValueAtTime(800, now)
    osc2.frequency.exponentialRampToValueAtTime(120, now + 0.05)
    gain2.gain.setValueAtTime(0.2, now)
    gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.06)
    osc2.connect(gain2)
    gain2.connect(ctx.destination)
    osc2.start(now)
    osc2.stop(now + 0.06)
  } catch {}
}

export default function AuctionWall() {
  const { awardXP, unlockBadge } = useFestivalGamification()

  const [lots, setLots] = useState(() =>
    INITIAL_LOTS.map(l => ({
      ...l,
      currentBid: l.startBid,
      bidCount: 0,
      timeLeft: DURATION,
      locked: false,
      flash: false,
      antiSnipe: false
    }))
  )

  const [myBids, setMyBids] = useState(() => safeStorage.getJSON(MY_BIDS_KEY, {}))
  const [selectedVoucherLot, setSelectedVoucherLot] = useState(null)
  const [voucherCopied, setVoucherCopied] = useState(false)

  // Synchronize myBids changes to safeStorage
  useEffect(() => {
    safeStorage.setItem(MY_BIDS_KEY, myBids)
  }, [myBids])

  useEffect(() => {
    const tickId = setInterval(() => {
      setLots(prev => prev.map(lot => {
        if (lot.locked) return lot
        const t = lot.timeLeft - 1
        if (t <= 0) {
          // Check if user won this lot
          if (lot.highBidder === 'YOU (You are winning!)' || lot.highBidder === 'YOU') {
            awardXP(100)
            unlockBadge('AUCTION_SNIPER')
            playFestivalSound('badge_unlock')
          }
          return { ...lot, timeLeft: 0, locked: true, antiSnipe: false }
        }
        return { ...lot, timeLeft: t }
      }))
    }, 1000)

    const bidId = setInterval(() => {
      setLots(prev => {
        const active = prev.filter(l => !l.locked)
        if (!active.length) return prev
        const target = active[Math.floor(Math.random() * active.length)]
        const randomNames = ['LagosKicksGuru', 'EkoHypeBeast', 'GrailSniper_99', 'IslandSoleHunter', 'MainlandDon']
        const randomBidder = randomNames[Math.floor(Math.random() * randomNames.length)]

        return prev.map(lot => {
          if (lot.id !== target.id || lot.locked) return lot
          
          const willAntiSnipe = lot.timeLeft <= 18
          const newTime = willAntiSnipe ? Math.min(lot.timeLeft + 20, DURATION) : Math.min(lot.timeLeft + 8, DURATION)

          // If user had high bid, mark them outbid in myBids
          setMyBids(mb => {
            if (mb[lot.id]) {
              return {
                ...mb,
                [lot.id]: {
                  ...mb[lot.id],
                  status: 'OUTBID',
                  topBid: Math.round(lot.currentBid * 1.03)
                }
              }
            }
            return mb
          })

          return {
            ...lot,
            currentBid: Math.round(lot.currentBid * 1.03),
            bidCount: lot.bidCount + 1,
            timeLeft: newTime,
            highBidder: randomBidder,
            flash: true,
            antiSnipe: willAntiSnipe
          }
        })
      })

      setTimeout(() => {
        setLots(prev => prev.map(l => ({ ...l, flash: false })))
      }, 400)
    }, 3800)

    return () => { clearInterval(tickId); clearInterval(bidId) }
  }, [awardXP, unlockBadge])

  function placeBid(id) {
    playGavelSound()
    playFestivalSound('tap')

    let antiSnipeTriggered = false

    setLots(prev => prev.map(lot => {
      if (lot.id !== id || lot.locked) return lot

      const isLate = lot.timeLeft <= 18
      antiSnipeTriggered = isLate
      const nextBid = Math.round(lot.currentBid * 1.05)
      const extendedTime = isLate ? Math.min(lot.timeLeft + 20, DURATION) : Math.min(lot.timeLeft + 10, DURATION)

      // Record in attendee bids
      setMyBids(mb => ({
        ...mb,
        [lot.id]: {
          lotId: lot.id,
          lotName: lot.name,
          myBid: nextBid,
          timestamp: new Date().toLocaleTimeString('en-NG'),
          status: 'HIGH_BIDDER',
          size: lot.size,
          condition: lot.condition
        }
      }))

      // Award XP on bidding
      awardXP(50)
      unlockBadge('AUCTION_CONTENDER')

      return {
        ...lot,
        currentBid: nextBid,
        bidCount: lot.bidCount + 1,
        timeLeft: extendedTime,
        highBidder: 'YOU (You are winning!)',
        flash: true,
        antiSnipe: isLate
      }
    }))

    setTimeout(() => {
      setLots(prev => prev.map(l => l.id === id ? { ...l, flash: false, antiSnipe: false } : l))
    }, 1800)
  }

  const activeLots = lots.filter(l => !l.locked)
  const closedLots = lots.filter(l => l.locked)
  const myBidsArray = Object.values(myBids)

  const handleOpenVoucher = (lot) => {
    setSelectedVoucherLot(lot)
    setVoucherCopied(false)
    playFestivalSound('xp_gain')
  }

  const generateVoucherCode = (lotId) => {
    return `SF26-LSX-AUCTION-LOT0${lotId}-${Math.abs(lotId * 7919).toString(16).toUpperCase()}`
  }

  return (
    <section id="auction-wall" style={{ background: '#040404', padding: '80px 20px', position: 'relative', overflow: 'hidden' }}>
      <GrainOverlay />
      <ScanLines />
      <style>{`
        @keyframes awFlash { 0%{background:#1c1400} 40%{background:#2a1f00} 100%{background:#0a0a0a} }
        @keyframes awPop { 0%{transform:scale(1)} 30%{transform:scale(1.025)} 100%{transform:scale(1)} }
        @keyframes snipePulse { 0%{border-color:#ef4444;box-shadow:0 0 10px rgba(239,68,68,0.5)} 50%{border-color:#f59e0b;box-shadow:0 0 20px rgba(245,158,11,0.8)} 100%{border-color:#ef4444;box-shadow:0 0 10px rgba(239,68,68,0.5)} }
      `}</style>

      <div style={{ maxWidth: 960, margin: '0 auto', position: 'relative', zIndex: 2 }}>
        <SectionTag>LIVE GRAIL BIDDING & ESCROW</SectionTag>

        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12, marginBottom: 8 }}>
          <div>
            <h2 style={{ fontFamily: "'Bebas Neue'", fontSize: 'clamp(2rem,5vw,3.5rem)', color: B.white, letterSpacing: '0.05em', margin: 0 }}>
              GRAIL AUCTION WALL
            </h2>
            <div style={{ fontFamily: "'Space Mono'", fontSize: 9, color: B.amber, letterSpacing: '0.15em', marginTop: 4 }}>
              PHYSICAL ESCROW AT MURI OKUNOLA PARK · AUTHENTICATED BY LAGOS SOLE EXCHANGE (LSX)
            </div>
          </div>

          <div style={{ display: 'flex', gap: 20 }}>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontFamily: "'Orbitron'", fontSize: 16, color: B.neonLime, fontWeight: 900 }}>{activeLots.length}</div>
              <div style={{ fontFamily: "'Space Mono'", fontSize: 9, color: B.dim, letterSpacing: '0.1em' }}>LIVE</div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontFamily: "'Orbitron'", fontSize: 16, color: B.smoke, fontWeight: 900 }}>{closedLots.length}</div>
              <div style={{ fontFamily: "'Space Mono'", fontSize: 9, color: B.dim, letterSpacing: '0.1em' }}>CLOSED</div>
            </div>
          </div>
        </div>

        <p style={{ color: B.smoke, fontFamily: "'Space Mono'", fontSize: '0.72rem', marginBottom: 24, letterSpacing: '0.04em' }}>
          Real-time bidding engine with anti-sniping protection (+20s extension on final-second bids). Winning lots receive an encrypted Escrow Collection Voucher redeemable at Booth 14 on Dec 12.
        </p>

        {/* ATTENDEE ACTIVE BIDS DRAWER */}
        {myBidsArray.length > 0 && (
          <div style={{
            background: 'rgba(255,170,0,0.06)',
            border: `1px solid ${B.amber}60`,
            borderRadius: 8,
            padding: '16px 20px',
            marginBottom: 32
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <div style={{ fontFamily: "'Space Mono'", fontSize: 10, color: B.amber, fontWeight: 700, letterSpacing: '0.15em' }}>
                ⭐ YOUR ACTIVE BIDS & ESCROW VOUCHERS ({myBidsArray.length})
              </div>
              <div style={{ fontFamily: "'Space Mono'", fontSize: 8, color: B.mist }}>
                AUTOMATICALLY PERSISTED
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 10 }}>
              {myBidsArray.map(b => {
                const currentLot = lots.find(l => l.id === b.lotId)
                const isWon = currentLot?.locked && (b.status === 'HIGH_BIDDER' || currentLot?.highBidder?.includes('YOU'))
                const isOutbid = b.status === 'OUTBID' || (currentLot && !currentLot.highBidder?.includes('YOU'))

                return (
                  <div key={b.lotId} style={{
                    background: '#0d0d0d',
                    border: `1px solid ${isWon ? B.neonLime : isOutbid ? '#ef4444' : B.amber}`,
                    borderRadius: 6,
                    padding: '10px 14px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between'
                  }}>
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                        <span style={{ fontFamily: "'Space Mono'", fontSize: 8, color: B.dim }}>LOT #{b.lotId}</span>
                        <span style={{
                          fontFamily: "'Space Mono'",
                          fontSize: 8,
                          fontWeight: 700,
                          color: isWon ? B.neonLime : isOutbid ? '#ef4444' : B.neonCyan
                        }}>
                          {isWon ? '🏆 LOT WON' : isOutbid ? '⚠️ OUTBID' : '👑 HIGH BIDDER'}
                        </span>
                      </div>
                      <div style={{ fontFamily: "'Bebas Neue'", fontSize: 13, color: B.white, lineHeight: 1.2 }}>
                        {b.lotName}
                      </div>
                      <div style={{ fontFamily: "'Orbitron'", fontSize: 14, color: B.amber, fontWeight: 700, marginTop: 4 }}>
                        {formatNaira(b.myBid)}
                      </div>
                    </div>

                    <div style={{ marginTop: 10 }}>
                      {isWon ? (
                        <button
                          onClick={() => handleOpenVoucher(currentLot)}
                          style={{
                            width: '100%',
                            padding: '6px 10px',
                            background: B.neonLime,
                            color: B.black,
                            border: 'none',
                            borderRadius: 4,
                            fontFamily: "'Space Mono'",
                            fontSize: 8,
                            fontWeight: 700,
                            letterSpacing: '0.1em',
                            cursor: 'pointer'
                          }}
                        >
                          🎟️ CLAIM ESCROW VOUCHER
                        </button>
                      ) : isOutbid && currentLot && !currentLot.locked ? (
                        <button
                          onClick={() => placeBid(b.lotId)}
                          style={{
                            width: '100%',
                            padding: '6px 10px',
                            background: '#ef4444',
                            color: B.white,
                            border: 'none',
                            borderRadius: 4,
                            fontFamily: "'Space Mono'",
                            fontSize: 8,
                            fontWeight: 700,
                            letterSpacing: '0.1em',
                            cursor: 'pointer'
                          }}
                        >
                          RE-BID {formatNaira(Math.round(currentLot.currentBid * 1.05))} ↗
                        </button>
                      ) : (
                        <div style={{ fontFamily: "'Space Mono'", fontSize: 8, color: B.neonCyan, textAlign: 'center' }}>
                          Leading auction · Closes in {formatTime(currentLot?.timeLeft || 0)}
                        </div>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* LOTS GRID */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 14 }}>
          {lots.map(lot => {
            const urgent = !lot.locked && lot.timeLeft <= 20
            const isUserHigh = lot.highBidder?.includes('YOU')
            const borderColor = lot.antiSnipe
              ? '#f59e0b'
              : lot.locked
              ? '#1a1a1a'
              : urgent
              ? '#ef4444'
              : lot.flash
              ? B.amber
              : isUserHigh
              ? B.neonLime
              : B.dim

            return (
              <div
                key={lot.id}
                style={{
                  background: lot.flash ? undefined : '#0a0a0a',
                  border: `1px solid ${borderColor}`,
                  padding: '18px 20px',
                  borderRadius: 6,
                  transition: 'border-color 0.2s',
                  animation: lot.antiSnipe ? 'snipePulse 0.8s infinite' : lot.flash ? 'awFlash 0.4s ease' : undefined,
                  position: 'relative',
                  opacity: lot.locked ? 0.65 : 1
                }}
              >
                {lot.locked && (
                  <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'rgba(4,4,4,0.78)', zIndex: 2, borderRadius: 6, gap: 10 }}>
                    <div style={{ fontFamily: "'Orbitron'", fontSize: 15, color: isUserHigh ? B.neonLime : B.smoke, letterSpacing: '0.15em', fontWeight: 900 }}>
                      {isUserHigh ? '👑 YOU WON THIS LOT!' : 'AUCTION CONCLUDED'}
                    </div>
                    {isUserHigh && (
                      <button
                        onClick={() => handleOpenVoucher(lot)}
                        style={{
                          padding: '8px 16px',
                          background: B.neonLime,
                          color: B.black,
                          border: 'none',
                          borderRadius: 4,
                          fontFamily: "'Space Mono'",
                          fontSize: 9,
                          fontWeight: 700,
                          cursor: 'pointer'
                        }}
                      >
                        VIEW ESCROW VOUCHER 🎟️
                      </button>
                    )}
                  </div>
                )}

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
                  <div style={{ fontFamily: "'Space Mono'", fontSize: 9, color: B.dim, letterSpacing: '0.2em' }}>
                    LOT {String(lot.id).padStart(2, '0')}
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{
                      fontFamily: "'Orbitron'",
                      fontSize: 12,
                      color: urgent ? '#ef4444' : lot.locked ? B.dim : B.smoke,
                      fontWeight: 900,
                      letterSpacing: '0.05em'
                    }}>
                      {lot.locked ? '00:00' : formatTime(lot.timeLeft)}
                    </div>
                    {lot.antiSnipe && (
                      <div style={{ fontFamily: "'Space Mono'", fontSize: 7, color: B.amber, fontWeight: 700 }}>
                        +20S ANTI-SNIPE EXT
                      </div>
                    )}
                  </div>
                </div>

                <div style={{ fontFamily: "'Bebas Neue'", fontSize: 16, color: B.white, letterSpacing: '0.04em', marginBottom: 4, lineHeight: 1.3 }}>
                  {lot.name}
                </div>
                <div style={{ fontFamily: "'Space Mono'", fontSize: 8, color: B.amber, letterSpacing: '0.1em', marginBottom: 8 }}>
                  {lot.condition} · SZ {lot.size} · AUTHENTICATED
                </div>
                <div style={{ fontFamily: "'Space Mono'", fontSize: 9, color: B.dim, lineHeight: 1.6, marginBottom: 14 }}>
                  {lot.description}
                </div>

                <div style={{ marginBottom: 14, background: '#070707', padding: '8px 12px', borderRadius: 4, border: '1px solid #141414' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 3 }}>
                    <span style={{ fontFamily: "'Space Mono'", fontSize: 8, color: B.dim, letterSpacing: '0.15em' }}>
                      CURRENT BID · {lot.bidCount} BIDS
                    </span>
                    <span style={{ fontFamily: "'Space Mono'", fontSize: 7, color: isUserHigh ? B.neonLime : B.mist }}>
                      LEAD: {lot.highBidder}
                    </span>
                  </div>
                  <div style={{ fontFamily: "'Orbitron'", fontSize: 20, color: B.amber, fontWeight: 900, animation: lot.flash ? 'awPop 0.3s ease' : undefined }}>
                    {formatNaira(lot.currentBid)}
                  </div>
                </div>

                <button
                  onClick={() => placeBid(lot.id)}
                  disabled={lot.locked}
                  style={{
                    width: '100%',
                    padding: '12px',
                    background: lot.locked ? '#111' : isUserHigh ? B.neonLime : B.amber,
                    color: lot.locked ? B.dim : B.black,
                    border: 'none',
                    borderRadius: 4,
                    fontFamily: "'Space Mono'",
                    fontSize: 9,
                    letterSpacing: '0.15em',
                    fontWeight: 700,
                    cursor: lot.locked ? 'default' : 'pointer',
                    transition: 'all 0.2s'
                  }}
                >
                  {lot.locked ? 'CLOSED' : isUserHigh ? '👑 YOU ARE HIGH BIDDER' : `BID ${formatNaira(Math.round(lot.currentBid * 1.05))} →`}
                </button>
              </div>
            )
          })}
        </div>

        {/* ESCROW & VERIFICATION BADGE FOOTER */}
        <div style={{
          marginTop: 24,
          padding: '16px 20px',
          background: '#0a0a0a',
          border: '1px solid #1a1a1a',
          borderRadius: 8,
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: 12
        }}>
          <div>
            <div style={{ fontFamily: "'Space Mono'", fontSize: 9, color: B.white, fontWeight: 700, letterSpacing: '0.1em' }}>
              🔒 100% LSX PHYSICAL ESCROW GUARANTEE
            </div>
            <div style={{ fontFamily: "'Space Mono'", fontSize: 8, color: B.dim, marginTop: 4 }}>
              Funds held in escrow until in-person physical authentication at Muri Okunola Park on Dec 12.
            </div>
          </div>
          <div style={{ fontFamily: "'Space Mono'", fontSize: 8, color: B.amber, letterSpacing: '0.15em' }}>
            ZONE C · BOOTH 14 · VICTORIA ISLAND
          </div>
        </div>
      </div>

      {/* ESCROW COLLECTION VOUCHER MODAL */}
      {selectedVoucherLot && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0,0,0,0.85)',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 20,
          zIndex: 9999
        }}>
          <div style={{
            background: '#090909',
            border: `2px solid ${B.neonLime}`,
            borderRadius: 12,
            maxWidth: 500,
            width: '100%',
            padding: 24,
            boxShadow: `0 0 40px ${B.neonLime}33`,
            position: 'relative'
          }}>
            <button
              onClick={() => setSelectedVoucherLot(null)}
              style={{
                position: 'absolute',
                top: 16,
                right: 16,
                background: 'transparent',
                border: 'none',
                color: B.smoke,
                fontSize: 18,
                cursor: 'pointer'
              }}
            >
              ✕
            </button>

            <div style={{ fontFamily: "'Space Mono'", fontSize: 8, color: B.neonLime, letterSpacing: '0.25em', marginBottom: 4 }}>
              LAGOS SOLE EXCHANGE · OFFICIAL ESCROW VOUCHER
            </div>

            <h3 style={{ fontFamily: "'Bebas Neue'", fontSize: '1.8rem', color: B.white, letterSpacing: '0.05em', margin: '0 0 16px' }}>
              COLLECTION PASS: {selectedVoucherLot.name}
            </h3>

            <div style={{ background: '#111', padding: '16px', borderRadius: 8, border: '1px dashed #333', marginBottom: 16 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                <span style={{ fontFamily: "'Space Mono'", fontSize: 9, color: B.dim }}>VOUCHER TOKEN:</span>
                <span style={{ fontFamily: "'Orbitron'", fontSize: 10, color: B.amber, fontWeight: 700 }}>
                  {generateVoucherCode(selectedVoucherLot.id)}
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                <span style={{ fontFamily: "'Space Mono'", fontSize: 9, color: B.dim }}>FINAL ESCROW PRICE:</span>
                <span style={{ fontFamily: "'Orbitron'", fontSize: 12, color: B.neonLime, fontWeight: 900 }}>
                  {formatNaira(selectedVoucherLot.currentBid)}
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                <span style={{ fontFamily: "'Space Mono'", fontSize: 9, color: B.dim }}>SIZE & CONDITION:</span>
                <span style={{ fontFamily: "'Space Mono'", fontSize: 9, color: B.white }}>
                  {selectedVoucherLot.size} ({selectedVoucherLot.condition})
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontFamily: "'Space Mono'", fontSize: 9, color: B.dim }}>COLLECTION DESK:</span>
                <span style={{ fontFamily: "'Space Mono'", fontSize: 9, color: B.neonCyan }}>
                  Zone C, Booth 14 (Muri Okunola Park)
                </span>
              </div>
            </div>

            <div style={{ fontFamily: "'Space Mono'", fontSize: 8, color: B.mist, lineHeight: 1.7, marginBottom: 20 }}>
              📌 INSTRUCTIONS FOR DEC 12: Present this voucher code to the LSX Authenticator at Booth 14. You and the seller will both verify the authentication tag before final escrow release.
            </div>

            <div style={{ display: 'flex', gap: 10 }}>
              <button
                onClick={() => {
                  copyToClipboard(generateVoucherCode(selectedVoucherLot.id))
                  setVoucherCopied(true)
                  setTimeout(() => setVoucherCopied(false), 2500)
                }}
                style={{
                  flex: 1,
                  padding: '12px',
                  background: voucherCopied ? B.neonLime : '#1c1c1c',
                  color: voucherCopied ? B.black : B.white,
                  border: `1px solid ${B.gunmetal}`,
                  borderRadius: 6,
                  fontFamily: "'Space Mono'",
                  fontSize: 9,
                  fontWeight: 700,
                  cursor: 'pointer'
                }}
              >
                {voucherCopied ? '✓ TOKEN COPIED' : '📋 COPY TOKEN'}
              </button>

              <a
                href={`https://wa.me/2348000000000?text=${encodeURIComponent(`Hello LSX Escrow Desk, I have won Lot #${selectedVoucherLot.id} (${selectedVoucherLot.name}) at Sneakers Fest '26. Voucher Token: ${generateVoucherCode(selectedVoucherLot.id)}. Please confirm inspection time.`)}`}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  flex: 1,
                  padding: '12px',
                  background: '#25D366',
                  color: '#fff',
                  border: 'none',
                  borderRadius: 6,
                  fontFamily: "'Space Mono'",
                  fontSize: 9,
                  fontWeight: 700,
                  textAlign: 'center',
                  textDecoration: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer'
                }}
              >
                WHATSAPP DESK 📲
              </a>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}
