import { useState, useEffect, useMemo, useCallback } from 'react'
import { B } from '../tokens'
import { GrainOverlay, SectionTag } from '../components/Shared'
import {
  useFestivalGamification,
  useFestivalTelemetry,
  playFestivalSound,
  dispatchFestivalAction,
  FESTIVAL_ACTIONS
} from '../framework/festivalFramework'

// Top 8 Tracked Sneaker Assets on the Lagos Sole Index (LSI)
const LSI_ASSETS = [
  {
    symbol: 'TS1-MOCHA',
    name: 'Travis Scott x AJ1 Low "Reverse Mocha"',
    silhouette: 'Air Jordan 1 Low OG',
    priceNGN: 1850000,
    change24h: 14.2,
    direction: 'up',
    volume24h: 14800000,
    volumePairs: 8,
    high24h: 1920000,
    low24h: 1680000,
    tier: 'S-TIER GRAIL',
    bid: 1820000,
    ask: 1860000,
    sparkline: [1680, 1710, 1690, 1750, 1790, 1820, 1850],
    history: {
      '1D': [1680, 1710, 1690, 1750, 1790, 1820, 1850],
      '7D': [1520, 1580, 1620, 1650, 1700, 1780, 1850],
      '1M': [1350, 1420, 1490, 1550, 1620, 1750, 1850],
      '1Y': [980, 1100, 1250, 1400, 1550, 1700, 1850]
    },
    narrative: 'West Africa\'s highest-velocity liquid grail. Heavy institutional backing across Island collector clubs.'
  },
  {
    symbol: 'OW-AJ4-SAIL',
    name: 'Off-White x Air Jordan 4 "Sail"',
    silhouette: 'Air Jordan 4 Retro Virgil Abloh',
    priceNGN: 2450000,
    change24h: 8.5,
    direction: 'up',
    volume24h: 9800000,
    volumePairs: 4,
    high24h: 2550000,
    low24h: 2300000,
    tier: 'MYTHIC ARTIFACT',
    bid: 2400000,
    ask: 2470000,
    sparkline: [2300, 2320, 2380, 2350, 2400, 2420, 2450],
    history: {
      '1D': [2300, 2320, 2380, 2350, 2400, 2420, 2450],
      '7D': [2150, 2200, 2250, 2300, 2350, 2400, 2450],
      '1M': [1950, 2050, 2150, 2250, 2300, 2400, 2450],
      '1Y': [1500, 1700, 1900, 2100, 2250, 2380, 2450]
    },
    narrative: 'Virgil\'s magnum opus silhouette. Ultra-tight supply circulating in Lagos; zero retail re-releases.'
  },
  {
    symbol: 'AJ1-CHIC-85',
    name: 'Air Jordan 1 High OG "Chicago Lost & Found"',
    silhouette: 'Air Jordan 1 High OG 1985 Cut',
    priceNGN: 680000,
    change24h: 18.4,
    direction: 'up',
    volume24h: 8160000,
    volumePairs: 12,
    high24h: 710000,
    low24h: 590000,
    tier: 'HERITAGE CORNERSTONE',
    bid: 670000,
    ask: 690000,
    sparkline: [590, 610, 625, 640, 655, 670, 680],
    history: {
      '1D': [590, 610, 625, 640, 655, 670, 680],
      '7D': [540, 560, 580, 610, 630, 660, 680],
      '1M': [480, 510, 530, 570, 600, 640, 680],
      '1Y': [380, 420, 470, 520, 580, 630, 680]
    },
    narrative: 'Surging demand leading into festival weekend. Balogun alchemists aggressively hoarding DS pairs.'
  },
  {
    symbol: 'NK-DUNK-PND',
    name: 'Nike Dunk Low "Panda"',
    silhouette: 'Nike Dunk Low Retro',
    priceNGN: 145000,
    change24h: -3.2,
    direction: 'down',
    volume24h: 6525000,
    volumePairs: 45,
    high24h: 155000,
    low24h: 140000,
    tier: 'LAGOS DAILY COMMUTE',
    bid: 142000,
    ask: 147000,
    sparkline: [155, 153, 150, 148, 149, 146, 145],
    history: {
      '1D': [155, 153, 150, 148, 149, 146, 145],
      '7D': [160, 158, 155, 152, 150, 148, 145],
      '1M': [175, 170, 165, 160, 155, 150, 145],
      '1Y': [220, 205, 190, 175, 160, 150, 145]
    },
    narrative: 'High trade velocity benchmark. Constant turnover across mainland university campuses.'
  },
  {
    symbol: 'TIF-AF1-1837',
    name: 'Tiffany & Co. x Nike Air Force 1 Low',
    silhouette: 'Air Force 1 Low Bespoke Nubuck',
    priceNGN: 2100000,
    change24h: 4.2,
    direction: 'up',
    volume24h: 4200000,
    volumePairs: 2,
    high24h: 2180000,
    low24h: 2020000,
    tier: 'LUXURY COLLAB',
    bid: 2050000,
    ask: 2120000,
    sparkline: [2020, 2040, 2030, 2080, 2060, 2090, 2100],
    history: {
      '1D': [2020, 2040, 2030, 2080, 2060, 2090, 2100],
      '7D': [1980, 2000, 2020, 2040, 2060, 2080, 2100],
      '1M': [1850, 1900, 1950, 2000, 2040, 2080, 2100],
      '1Y': [1600, 1720, 1810, 1920, 2000, 2060, 2100]
    },
    narrative: 'Tiffany sterling silver heel badge commands immense status premium in Lekki and Banana Island.'
  },
  {
    symbol: 'NB-9060-RNC',
    name: 'New Balance 9060 "Rain Cloud / Sea Salt"',
    silhouette: 'New Balance 9060 Lifestyle',
    priceNGN: 210000,
    change24h: 9.4,
    direction: 'up',
    volume24h: 3990000,
    volumePairs: 19,
    high24h: 220000,
    low24h: 190000,
    tier: 'STREET ESSENTIAL',
    bid: 205000,
    ask: 212000,
    sparkline: [190, 192, 198, 200, 205, 208, 210],
    history: {
      '1D': [190, 192, 198, 200, 205, 208, 210],
      '7D': [182, 185, 190, 195, 200, 205, 210],
      '1M': [170, 175, 180, 188, 195, 202, 210],
      '1Y': [140, 150, 162, 175, 188, 200, 210]
    },
    narrative: 'Rapidly outpacing traditional dad-shoes in Lagos fashion forward creator rotations.'
  },
  {
    symbol: 'YZY-FR-ONYX',
    name: 'Adidas Yeezy Foam Runner "Onyx"',
    silhouette: 'Foam Runner Sculpted Slip-on',
    priceNGN: 175000,
    change24h: -1.8,
    direction: 'down',
    volume24h: 2800000,
    volumePairs: 16,
    high24h: 185000,
    low24h: 172000,
    tier: 'SLIDE ROTATION',
    bid: 172000,
    ask: 178000,
    sparkline: [185, 182, 180, 178, 179, 176, 175],
    history: {
      '1D': [185, 182, 180, 178, 179, 176, 175],
      '7D': [190, 188, 185, 182, 180, 178, 175],
      '1M': [205, 200, 195, 190, 185, 180, 175],
      '1Y': [260, 240, 220, 205, 190, 180, 175]
    },
    narrative: 'Essential airport and after-party recovery footwear across Lagos traffic corridors.'
  },
  {
    symbol: 'LV-AF1-VRGL',
    name: 'Louis Vuitton by Virgil Abloh AF1 Low',
    silhouette: 'Bespoke Haute Couture Sneaker',
    priceNGN: 9800000,
    change24h: 22.5,
    direction: 'up',
    volume24h: 9800000,
    volumePairs: 1,
    high24h: 10200000,
    low24h: 8000000,
    tier: 'UNATTAINABLE GRAIL',
    bid: 9500000,
    ask: 10000000,
    sparkline: [8000, 8200, 8500, 8900, 9200, 9500, 9800],
    history: {
      '1D': [8000, 8200, 8500, 8900, 9200, 9500, 9800],
      '7D': [7500, 7800, 8100, 8500, 8900, 9300, 9800],
      '1M': [6800, 7200, 7700, 8200, 8800, 9200, 9800],
      '1Y': [5200, 5800, 6500, 7400, 8200, 9000, 9800]
    },
    narrative: 'Crown jewel of Nigerian private collections. Single pair authenticated for live festival display.'
  }
]

// Simulated live on-site market orders at Muri Okunola Park
const LIVE_TICKER_ORDERS = [
  '₦1,850,000 TS1-MOCHA settled by @lekki_collector via Moniepoint',
  '₦680,000 AJ1-CHIC-85 authenticated at LSX Physical Pit Desk #2',
  '₦2,450,000 OW-AJ4-SAIL secured by @catalyst_sole with VIP Escrow',
  '₦145,000 NK-DUNK-PND swapped at Vendor Booth B-04',
  '₦210,000 NB-9060-RNC verified under dual UV spectrum',
  '₦9,800,000 LV-AF1-VRGL vault reserve confirmed for Exhibition Hall'
]

export default function LagosSoleIndex() {
  const { awardXP, unlockBadge } = useFestivalGamification()
  const { setZone } = useFestivalTelemetry()

  const [selectedAssetIndex, setSelectedAssetIndex] = useState(0)
  const [timeframe, setTimeframe] = useState('1D')
  const [watchlist, setWatchlist] = useState(() => {
    try {
      const saved = localStorage.getItem('sf26:lsi:watchlist')
      return saved ? JSON.parse(saved) : ['TS1-MOCHA', 'OW-AJ4-SAIL']
    } catch {
      return ['TS1-MOCHA', 'OW-AJ4-SAIL']
    }
  })
  const [liveOrderIndex, setLiveOrderIndex] = useState(0)

  const selectedAsset = LSI_ASSETS[selectedAssetIndex] || LSI_ASSETS[0]
  const isWatched = watchlist.includes(selectedAsset.symbol)

  // Rotate simulated live ticker order every 4 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setLiveOrderIndex(i => (i + 1) % LIVE_TICKER_ORDERS.length)
    }, 4000)
    return () => clearInterval(timer)
  }, [])

  // Toggle asset in personal watchlist
  const toggleWatchlist = useCallback((symbol) => {
    playFestivalSound('zone_click')
    let nextList
    if (watchlist.includes(symbol)) {
      nextList = watchlist.filter(s => s !== symbol)
    } else {
      nextList = [...watchlist, symbol]
      playFestivalSound('badge_unlock')
      awardXP(75, `Tracked ${symbol} on Lagos Sole Index`)
      unlockBadge('WALL_STREET_OF_SOLES')
      dispatchFestivalAction(FESTIVAL_ACTIONS.LSI_ASSET_TRACKED, { symbol })
    }
    setWatchlist(nextList)
    try {
      localStorage.setItem('sf26:lsi:watchlist', JSON.stringify(nextList))
    } catch {}
  }, [watchlist, awardXP, unlockBadge])

  // Teleport to LSX Physical Trade Pit
  const handleOpenLSXTrade = (asset) => {
    playFestivalSound('nfc_success')
    setZone('floor', '#lsx')
    const lsxElem = document.getElementById('lsx')
    if (lsxElem) {
      lsxElem.scrollIntoView({ behavior: 'smooth' })
    } else {
      window.location.hash = '#lsx'
    }
  }

  // Generate SVG path for sparkline
  const chartPoints = selectedAsset.history[timeframe] || selectedAsset.sparkline
  const svgPath = useMemo(() => {
    const min = Math.min(...chartPoints)
    const max = Math.max(...chartPoints)
    const range = max - min || 1
    const width = 460
    const height = 150
    const padding = 15

    const coords = chartPoints.map((val, idx) => {
      const x = padding + (idx / (chartPoints.length - 1)) * (width - 2 * padding)
      const y = height - padding - ((val - min) / range) * (height - 2 * padding)
      return `${x.toFixed(1)},${y.toFixed(1)}`
    })

    return `M ${coords.join(' L ')}`
  }, [chartPoints])

  // Area fill under sparkline
  const svgArea = useMemo(() => {
    const min = Math.min(...chartPoints)
    const max = Math.max(...chartPoints)
    const range = max - min || 1
    const width = 460
    const height = 150
    const padding = 15

    const coords = chartPoints.map((val, idx) => {
      const x = padding + (idx / (chartPoints.length - 1)) * (width - 2 * padding)
      const y = height - padding - ((val - min) / range) * (height - 2 * padding)
      return `${x.toFixed(1)},${y.toFixed(1)}`
    })

    const firstX = padding
    const lastX = width - padding
    const bottomY = height - padding

    return `M ${firstX},${bottomY} L ${coords.join(' L ')} L ${lastX},${bottomY} Z`
  }, [chartPoints])

  return (
    <section id="lagos-sole-index" style={{
      position: 'relative',
      overflow: 'hidden',
      background: B.black,
      padding: '80px 24px 90px',
      borderBottom: `1px solid ${B.gunmetal}`
    }}>
      <GrainOverlay />

      <style>{`
        @keyframes tickerTapeContinuous {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        @keyframes greenPulseGlow {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
      `}</style>

      {/* ============================================================== */}
      {/* HIGH-FREQUENCY STREAMING TICKER TAPE BANNER                   */}
      {/* ============================================================== */}
      <div style={{
        background: '#090B0E',
        borderTop: `1px solid ${B.amber}30`,
        borderBottom: `1px solid ${B.amber}30`,
        padding: '10px 0',
        marginBottom: 44,
        overflow: 'hidden',
        whiteSpace: 'nowrap',
        position: 'relative'
      }}>
        <div style={{
          display: 'inline-flex',
          gap: 36,
          animation: 'tickerTapeContinuous 32s linear infinite',
          paddingLeft: 20
        }}>
          {[...LSI_ASSETS, ...LSI_ASSETS].map((item, idx) => {
            const isUp = item.direction === 'up'
            return (
              <div
                key={idx}
                onClick={() => {
                  const targetIdx = LSI_ASSETS.findIndex(a => a.symbol === item.symbol)
                  if (targetIdx !== -1) setSelectedAssetIndex(targetIdx)
                  playFestivalSound('zone_click')
                }}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 10,
                  cursor: 'pointer'
                }}
              >
                <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 11, fontWeight: 700, color: B.white }}>
                  {item.symbol}
                </span>
                <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 11, color: B.mist }}>
                  ₦{(item.priceNGN).toLocaleString()}
                </span>
                <span style={{
                  fontFamily: "'Space Mono', monospace",
                  fontSize: 10,
                  fontWeight: 700,
                  color: isUp ? B.neonLime : B.neonMagenta,
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 2
                }}>
                  {isUp ? '▲' : '▼'} {Math.abs(item.change24h)}%
                </span>
                <span style={{ color: B.gunmetal, marginLeft: 8 }}>|</span>
              </div>
            )
          })}
        </div>
      </div>

      <div style={{ position: 'relative', zIndex: 10, maxWidth: 1240, margin: '0 auto' }}>
        <SectionTag>MARKET TERMINAL · PRICE DISCOVERY</SectionTag>

        {/* Section Header */}
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: 20, marginBottom: 36 }}>
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: `${B.neonCyan}15`, border: `1px solid ${B.neonCyan}40`, borderRadius: 999, padding: '4px 14px', marginBottom: 12 }}>
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: B.neonLime, boxShadow: `0 0 8px ${B.neonLime}`, animation: 'greenPulseGlow 1.2s infinite' }} />
              <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 10, color: B.neonCyan, letterSpacing: '0.15em', fontWeight: 700 }}>
                LSI LIVE MARKET PULSE · WAT REAL-TIME
              </span>
            </div>
            <h2 style={{ fontFamily: "'Orbitron', monospace", fontWeight: 900, fontSize: 'clamp(26px, 4.5vw, 44px)', color: B.white, lineHeight: 1.1 }}>
              LAGOS SOLE <span style={{ color: B.amber, textShadow: `0 0 25px ${B.amber}50` }}>INDEX</span>
            </h2>
            <p style={{ fontFamily: "'Space Mono', monospace", fontSize: 'clamp(11px, 1.4vw, 13px)', color: B.mist, marginTop: 10, maxWidth: 650, lineHeight: 1.6 }}>
              West Africa's definitive live sneaker aftermarket terminal. Real-time pricing in Naira, volatility tracking, and verified trade settlement directly linked to the physical pit.
            </p>
          </div>

          {/* Simulated On-Site Broadcast Alert */}
          <div style={{
            background: B.charcoal,
            border: `1px solid ${B.gunmetal}`,
            borderRadius: 8,
            padding: '12px 18px',
            maxWidth: 420,
            display: 'flex',
            alignItems: 'center',
            gap: 12
          }}>
            <span style={{ fontSize: 18 }}>📡</span>
            <div style={{ overflow: 'hidden' }}>
              <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 8, color: B.smoke, letterSpacing: '0.2em' }}>
                ON-SITE TRADE FEED (MURI OKUNOLA PARK)
              </div>
              <div style={{
                fontFamily: "'Space Mono', monospace",
                fontSize: 10,
                color: B.amberGlow,
                marginTop: 3,
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis'
              }}>
                {LIVE_TICKER_ORDERS[liveOrderIndex]}
              </div>
            </div>
          </div>
        </div>

        {/* ============================================================== */}
        {/* COMPOSITE MACRO METRICS CARDS                                  */}
        {/* ============================================================== */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: 16,
          marginBottom: 36
        }}>
          <div style={{ background: B.charcoal, border: `1px solid ${B.gunmetal}`, borderRadius: 8, padding: '20px 18px', textAlign: 'left' }}>
            <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 9, color: B.smoke, letterSpacing: '0.2em' }}>LSI-10 COMPOSITE</div>
            <div style={{ fontFamily: "'Orbitron', monospace", fontSize: 24, fontWeight: 900, color: B.amber, marginTop: 6 }}>
              4,892.40 <span style={{ fontSize: 12, color: B.neonLime }}>+5.8%</span>
            </div>
            <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 9, color: B.smoke, marginTop: 6 }}>
              Composite top 10 grails 24h
            </div>
          </div>

          <div style={{ background: B.charcoal, border: `1px solid ${B.gunmetal}`, borderRadius: 8, padding: '20px 18px', textAlign: 'left' }}>
            <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 9, color: B.smoke, letterSpacing: '0.2em' }}>24H PHYSICAL VOLUME</div>
            <div style={{ fontFamily: "'Orbitron', monospace", fontSize: 24, fontWeight: 900, color: B.white, marginTop: 6 }}>
              ₦48,650,000
            </div>
            <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 9, color: B.smoke, marginTop: 6 }}>
              98 authenticated transactions
            </div>
          </div>

          <div style={{ background: B.charcoal, border: `1px solid ${B.gunmetal}`, borderRadius: 8, padding: '20px 18px', textAlign: 'left' }}>
            <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 9, color: B.smoke, letterSpacing: '0.2em' }}>HYPE / SENTIMENT INDEX</div>
            <div style={{ fontFamily: "'Orbitron', monospace", fontSize: 24, fontWeight: 900, color: B.neonLime, marginTop: 6 }}>
              88 / 100
            </div>
            <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 9, color: B.smoke, marginTop: 6 }}>
              EXTREME GREED · ACCUMULATING
            </div>
          </div>

          <div style={{ background: B.charcoal, border: `1px solid ${B.gunmetal}`, borderRadius: 8, padding: '20px 18px', textAlign: 'left' }}>
            <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 9, color: B.smoke, letterSpacing: '0.2em' }}>VERIFIED VAULT RESERVE</div>
            <div style={{ fontFamily: "'Orbitron', monospace", fontSize: 24, fontWeight: 900, color: B.neonCyan, marginTop: 6 }}>
              ₦520,000,000+
            </div>
            <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 9, color: B.smoke, marginTop: 6 }}>
              Secured across physical booths
            </div>
          </div>
        </div>

        {/* ============================================================== */}
        {/* MAIN TERMINAL: ASSET SELECTOR + DETAILED CHART & ORDER BOOK     */}
        {/* ============================================================== */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: 24,
          alignItems: 'start'
        }}>
          {/* ASSET ROSTER (LEFT COLUMN) */}
          <div style={{
            background: B.charcoal,
            border: `1px solid ${B.gunmetal}`,
            borderRadius: 10,
            overflow: 'hidden'
          }}>
            <div style={{
              padding: '16px 20px',
              borderBottom: `1px solid ${B.gunmetal}`,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 10, fontWeight: 700, color: B.amber, letterSpacing: '0.15em' }}>
                TRACKED ASSETS ({LSI_ASSETS.length})
              </span>
              <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 9, color: B.smoke }}>
                SELECT TO INSPECT
              </span>
            </div>

            <div style={{ maxHeight: 520, overflowY: 'auto' }}>
              {LSI_ASSETS.map((asset, idx) => {
                const isSelected = idx === selectedAssetIndex
                const isUp = asset.direction === 'up'
                const isItemWatched = watchlist.includes(asset.symbol)

                return (
                  <div
                    key={asset.symbol}
                    onClick={() => {
                      setSelectedAssetIndex(idx)
                      playFestivalSound('zone_click')
                    }}
                    style={{
                      padding: '16px 20px',
                      borderBottom: `1px solid ${B.void}`,
                      background: isSelected ? 'rgba(245, 166, 35, 0.08)' : 'transparent',
                      borderLeft: isSelected ? `4px solid ${B.amber}` : '4px solid transparent',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      transition: 'background 0.2s'
                    }}
                  >
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 12, fontWeight: 700, color: B.white }}>
                          {asset.symbol}
                        </span>
                        {isItemWatched && (
                          <span style={{ fontSize: 10, color: B.amber }}>★</span>
                        )}
                        <span style={{
                          fontFamily: "'Space Mono', monospace",
                          fontSize: 8,
                          background: `${B.gunmetal}`,
                          color: B.smoke,
                          padding: '2px 6px',
                          borderRadius: 3
                        }}>
                          {asset.tier}
                        </span>
                      </div>
                      <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 11, color: B.mist, marginTop: 4, maxWidth: 190, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {asset.name}
                      </div>
                    </div>

                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontFamily: "'Orbitron', monospace", fontSize: 13, fontWeight: 700, color: B.white }}>
                        ₦{(asset.priceNGN).toLocaleString()}
                      </div>
                      <div style={{
                        fontFamily: "'Space Mono', monospace",
                        fontSize: 10,
                        fontWeight: 700,
                        color: isUp ? B.neonLime : B.neonMagenta,
                        marginTop: 2
                      }}>
                        {isUp ? '▲ +' : '▼ -'}{Math.abs(asset.change24h)}%
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* DETAILED CANDLESTICK/SPARKLINE CHART & TERMINAL ACTIONS (RIGHT COLUMN) */}
          <div style={{
            background: '#0D0E12',
            border: `1px solid ${B.gunmetal}`,
            borderRadius: 10,
            padding: '24px 20px',
            display: 'flex',
            flexDirection: 'column',
            gap: 20
          }}>
            {/* Asset Header Details */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 12 }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 10, color: B.amber, letterSpacing: '0.15em', fontWeight: 700 }}>
                    {selectedAsset.tier}
                  </span>
                  <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 9, color: B.smoke }}>
                    · {selectedAsset.silhouette}
                  </span>
                </div>
                <h3 style={{ fontFamily: "'Orbitron', monospace", fontSize: 22, fontWeight: 900, color: B.white, marginTop: 4 }}>
                  {selectedAsset.name}
                </h3>
                <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 11, color: B.smoke, marginTop: 2 }}>
                  TICKER: <span style={{ color: B.white, fontWeight: 700 }}>{selectedAsset.symbol}</span> · AUTHENTICATED PHYSICAL VAULT
                </div>
              </div>

              {/* Pin Watchlist Button */}
              <button
                onClick={() => toggleWatchlist(selectedAsset.symbol)}
                style={{
                  background: isWatched ? `${B.amber}20` : B.charcoal,
                  border: isWatched ? `1px solid ${B.amber}` : `1px solid ${B.gunmetal}`,
                  borderRadius: 6,
                  color: isWatched ? B.amberGlow : B.smoke,
                  fontFamily: "'Space Mono', monospace",
                  fontSize: 10,
                  padding: '8px 14px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6
                }}
              >
                <span>{isWatched ? '★ PINNED TO VAULT' : '☆ PIN ASSET (+75 XP)'}</span>
              </button>
            </div>

            {/* Current Valuation & Timeframe Selector */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: 12,
              background: B.charcoal,
              border: `1px solid ${B.gunmetal}`,
              borderRadius: 8,
              padding: '14px 18px'
            }}>
              <div>
                <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 9, color: B.smoke, letterSpacing: '0.15em' }}>
                  CURRENT VALUATION (NGN)
                </div>
                <div style={{ fontFamily: "'Orbitron', monospace", fontSize: 28, fontWeight: 900, color: B.white, marginTop: 4 }}>
                  ₦{(selectedAsset.priceNGN).toLocaleString()}
                </div>
                <div style={{
                  fontFamily: "'Space Mono', monospace",
                  fontSize: 11,
                  fontWeight: 700,
                  color: selectedAsset.direction === 'up' ? B.neonLime : B.neonMagenta,
                  marginTop: 2
                }}>
                  {selectedAsset.direction === 'up' ? '▲ +' : '▼ -'}{Math.abs(selectedAsset.change24h)}% (24H SPREAD)
                </div>
              </div>

              {/* Timeframe Toggle Buttons */}
              <div style={{ display: 'flex', gap: 6 }}>
                {['1D', '7D', '1M', '1Y'].map(tf => {
                  const active = tf === timeframe
                  return (
                    <button
                      key={tf}
                      onClick={() => {
                        setTimeframe(tf)
                        playFestivalSound('zone_click')
                      }}
                      style={{
                        background: active ? B.amber : B.void,
                        border: active ? `1px solid ${B.amber}` : `1px solid ${B.gunmetal}`,
                        color: active ? B.black : B.mist,
                        fontFamily: "'Space Mono', monospace",
                        fontSize: 9,
                        fontWeight: 700,
                        padding: '6px 10px',
                        borderRadius: 4,
                        cursor: 'pointer'
                      }}
                    >
                      {tf}
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Procedural Interactive SVG Trend Chart */}
            <div style={{
              position: 'relative',
              background: '#08090C',
              border: `1px solid ${B.gunmetal}`,
              borderRadius: 8,
              padding: '16px 10px',
              height: 180,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <svg width="100%" height="100%" viewBox="0 0 460 150" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={selectedAsset.direction === 'up' ? B.neonLime : B.neonMagenta} stopOpacity="0.35" />
                    <stop offset="100%" stopColor={selectedAsset.direction === 'up' ? B.neonLime : B.neonMagenta} stopOpacity="0.0" />
                  </linearGradient>
                </defs>

                {/* Grid guidelines */}
                <line x1="15" y1="35" x2="445" y2="35" stroke="rgba(255,255,255,0.05)" strokeDasharray="4 4" />
                <line x1="15" y1="75" x2="445" y2="75" stroke="rgba(255,255,255,0.05)" strokeDasharray="4 4" />
                <line x1="15" y1="115" x2="445" y2="115" stroke="rgba(255,255,255,0.05)" strokeDasharray="4 4" />

                {/* Shaded Area */}
                <path d={svgArea} fill="url(#chartGradient)" />

                {/* Stroke line */}
                <path
                  d={svgPath}
                  fill="none"
                  stroke={selectedAsset.direction === 'up' ? B.neonLime : B.neonMagenta}
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>

            {/* Market Depth & Order Execution Strip */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
              gap: 10,
              background: B.charcoal,
              border: `1px solid ${B.gunmetal}`,
              borderRadius: 6,
              padding: '14px'
            }}>
              <div>
                <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 8, color: B.smoke }}>BID DEPTH</div>
                <div style={{ fontFamily: "'Orbitron', monospace", fontSize: 13, fontWeight: 700, color: B.neonLime, marginTop: 4 }}>
                  ₦{(selectedAsset.bid).toLocaleString()}
                </div>
              </div>
              <div>
                <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 8, color: B.smoke }}>ASK DEPTH</div>
                <div style={{ fontFamily: "'Orbitron', monospace", fontSize: 13, fontWeight: 700, color: B.neonMagenta, marginTop: 4 }}>
                  ₦{(selectedAsset.ask).toLocaleString()}
                </div>
              </div>
              <div>
                <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 8, color: B.smoke }}>24H HIGH</div>
                <div style={{ fontFamily: "'Orbitron', monospace", fontSize: 13, fontWeight: 700, color: B.white, marginTop: 4 }}>
                  ₦{(selectedAsset.high24h).toLocaleString()}
                </div>
              </div>
              <div>
                <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 8, color: B.smoke }}>24H VOLUME</div>
                <div style={{ fontFamily: "'Orbitron', monospace", fontSize: 13, fontWeight: 700, color: B.amberGlow, marginTop: 4 }}>
                  ₦{(selectedAsset.volume24h / 1000000).toFixed(1)}M ({selectedAsset.volumePairs} PAIRS)
                </div>
              </div>
            </div>

            {/* Market Narrative Note */}
            <div style={{
              borderLeft: `3px solid ${B.amber}`,
              paddingLeft: 12,
              fontFamily: "'Inter', sans-serif",
              fontSize: 11,
              color: B.mist,
              lineHeight: 1.5
            }}>
              <strong style={{ color: B.amber }}>LSI ANALYST MEMO:</strong> {selectedAsset.narrative}
            </div>

            {/* Direct Order Execution Teleport Hook */}
            <button
              onClick={() => handleOpenLSXTrade(selectedAsset)}
              style={{
                width: '100%',
                background: `linear-gradient(135deg, ${B.amber}, ${B.amberDeep})`,
                color: B.black,
                fontFamily: "'Space Mono', monospace",
                fontSize: 12,
                fontWeight: 700,
                letterSpacing: '0.12em',
                padding: '16px',
                borderRadius: 6,
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                gap: 8,
                boxShadow: `0 0 25px ${B.amber}50`,
                transition: 'all 0.2s ease'
              }}
            >
              <span>⚡</span> PLACE BUY / TRADE OFFER IN LSX PIT
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
