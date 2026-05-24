import { useState, useRef } from 'react'
import { B } from '../tokens'
import { GrainOverlay, ScanLines, SectionTag } from '../components/Shared'

const PRIZES = [
  { label: '₦2,000 OFF',  sub: 'off any ticket tier',      color: '#F5A623', icon: '₦2K'  },
  { label: 'MERCH RAFFLE',      sub: 'free draw entry',           color: '#00F0FF', icon: 'MERCH'   },
  { label: 'VIP UPGRADE',       sub: 'GA ticket upgraded to VIP', color: '#FF2D7B', icon: 'VIP'    },
  { label: 'MEET & GREET',      sub: 'backstage access pass',     color: '#B8FF00', icon: 'M&G'    },
  { label: 'EARLY ACCESS',      sub: '1hr before doors open',     color: '#7B2FBE', icon: 'EARLY'  },
  { label: 'MYSTERY DROP',      sub: 'secret collab at the event',color: '#FF6B35', icon: 'DROP'   },
  { label: 'TRY AGAIN',         sub: 'better luck next time',     color: '#3A3A3A', icon: 'AGAIN'  },
  { label: '₦5,000 OFF',  sub: 'off any ticket tier',       color: '#FFD080', icon: '₦5K'  },
]

const N = PRIZES.length
const EACH = 360 / N
const CX = 150, CY = 150, R = 138

function segPath(i) {
  const a1 = (i * EACH - 90) * Math.PI / 180
  const a2 = ((i + 1) * EACH - 90) * Math.PI / 180
  const x1 = (CX + R * Math.cos(a1)).toFixed(2)
  const y1 = (CY + R * Math.sin(a1)).toFixed(2)
  const x2 = (CX + R * Math.cos(a2)).toFixed(2)
  const y2 = (CY + R * Math.sin(a2)).toFixed(2)
  return `M${CX} ${CY} L${x1} ${y1} A${R} ${R} 0 0 1 ${x2} ${y2}Z`
}

function labelTransform(i) {
  const mid = i * EACH + EACH / 2 - 90
  const rad = mid * Math.PI / 180
  const tx = (CX + R * 0.62 * Math.cos(rad)).toFixed(1)
  const ty = (CY + R * 0.62 * Math.sin(rad)).toFixed(1)
  return `translate(${tx},${ty}) rotate(${mid + 90})`
}

export default function SpinWheel() {
  const [rotation, setRotation] = useState(0)
  const [spinning, setSpinning] = useState(false)
  const [result, setResult] = useState(null)
  const [spun, setSpun] = useState(false)
  const winnerRef = useRef(null)

  function spin() {
    if (spinning) return
    setResult(null)
    setSpinning(true)
    setSpun(true)

    const winner = Math.floor(Math.random() * N)
    winnerRef.current = winner

    // bring winning segment to pointer (top)
    const targetMod = ((360 - (winner * EACH + EACH / 2)) % 360 + 360) % 360
    const prevMod = rotation % 360
    let extra = targetMod - prevMod
    if (extra < 0) extra += 360
    const newRotation = rotation + extra + 360 * (5 + Math.floor(Math.random() * 3))
    setRotation(newRotation)

    setTimeout(() => {
      setSpinning(false)
      setResult(winnerRef.current)
    }, 5200)
  }

  const prize = result !== null ? PRIZES[result] : null

  return (
    <section id="spin" style={{
      background: B.charcoal, padding: '80px 20px',
      position: 'relative', overflow: 'hidden', textAlign: 'center',
    }}>
      <GrainOverlay /><ScanLines />
      <style>{`
        @keyframes winnerPop {
          from { opacity: 0; transform: scale(0.7) rotate(-6deg); }
          to   { opacity: 1; transform: scale(1) rotate(0deg); }
        }
      `}</style>

      <div style={{ maxWidth: 600, margin: '0 auto' }}>
        <SectionTag>SPIN TO WIN</SectionTag>
        <h2 style={{ fontFamily: "'Bebas Neue'", fontSize: 'clamp(2.5rem,6vw,4rem)', color: B.white, letterSpacing: '0.05em', marginBottom: 8 }}>
          TEST YOUR LUCK
        </h2>
        <p style={{ color: B.smoke, fontFamily: "'Space Mono'", fontSize: '0.78rem', marginBottom: 44 }}>
          8 prizes · one spin · claim at the gate
        </p>

        {/* Pointer + Wheel */}
        <div style={{ position: 'relative', display: 'inline-block' }}>
          {/* Pointer triangle */}
          <div style={{
            position: 'absolute', top: -20, left: '50%',
            transform: 'translateX(-50%)',
            width: 0, height: 0, zIndex: 20,
            borderLeft: '13px solid transparent',
            borderRight: '13px solid transparent',
            borderTop: `32px solid ${B.amber}`,
            filter: `drop-shadow(0 0 10px ${B.amber})`,
          }} />

          {/* Wheel border glow */}
          <div style={{
            width: 304, height: 304, borderRadius: '50%',
            padding: 2,
            background: `conic-gradient(${B.amber}, ${B.neonMagenta}, ${B.neonCyan}, ${B.amber})`,
            boxShadow: spinning ? `0 0 60px ${B.amber}60` : `0 0 28px ${B.amber}20`,
            transition: 'box-shadow 0.4s',
          }}>
            <div style={{ width: '100%', height: '100%', borderRadius: '50%', overflow: 'hidden' }}>
              <svg
                viewBox="0 0 300 300"
                width="300" height="300"
                style={{
                  transform: `rotate(${rotation}deg)`,
                  transition: spinning ? 'transform 5s cubic-bezier(0.05,0.72,0.18,1)' : 'none',
                  display: 'block',
                }}
              >
                {PRIZES.map((p, i) => (
                  <g key={i}>
                    <path d={segPath(i)} fill={p.color} stroke="#0A0A0A" strokeWidth="1.5" />
                    <text
                      transform={labelTransform(i)}
                      fill="rgba(0,0,0,0.82)"
                      fontSize="8.5"
                      fontWeight="bold"
                      textAnchor="middle"
                      dominantBaseline="middle"
                      fontFamily="'Courier New', monospace"
                    >
                      {p.icon}
                    </text>
                  </g>
                ))}
                {/* Hub */}
                <circle cx={CX} cy={CY} r="22" fill="#0A0A0A" stroke={B.amber} strokeWidth="2.5" />
                <text
                  x={CX} y={CY}
                  textAnchor="middle" dominantBaseline="middle"
                  fontSize="9" fontWeight="bold" fontFamily="monospace" fill={B.amber}
                >SF26</text>
              </svg>
            </div>
          </div>
        </div>

        <div style={{ marginTop: 40 }}>
          <button
            onClick={spin}
            disabled={spinning}
            style={{
              background: spinning ? B.gunmetal : B.amber,
              color: spinning ? B.smoke : B.black,
              border: 'none', padding: '14px 52px',
              fontFamily: "'Bebas Neue'", fontSize: '1.5rem', letterSpacing: '0.1em',
              cursor: spinning ? 'default' : 'pointer', borderRadius: 4,
              boxShadow: spinning ? 'none' : `0 0 28px ${B.amber}60`,
              transition: 'all 0.3s', minWidth: 220,
            }}
          >
            {spinning ? 'SPINNING...' : spun ? 'SPIN AGAIN' : 'SPIN THE WHEEL'}
          </button>
        </div>

        <p style={{ color: B.smoke, fontFamily: "'Space Mono'", fontSize: '0.62rem', marginTop: 14 }}>
          Prizes redeemable at the event gate · Dec 12, Eko Atlantic
        </p>
      </div>

      {/* Result modal */}
      {prize && (
        <div
          onClick={() => setResult(null)}
          style={{
            position: 'fixed', inset: 0, zIndex: 9999,
            background: 'rgba(0,0,0,0.93)', backdropFilter: 'blur(8px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}
        >
          <div
            onClick={e => e.stopPropagation()}
            style={{
              background: B.charcoal, borderRadius: 14, padding: '48px 40px',
              maxWidth: 420, width: '90%', textAlign: 'center',
              border: `2px solid ${prize.color}`,
              boxShadow: `0 0 80px ${prize.color}50, 0 0 200px ${prize.color}20`,
              animation: 'winnerPop 0.55s cubic-bezier(0.34,1.56,0.64,1)',
            }}
          >
            {/* Prize icon circle */}
            <div style={{
              width: 88, height: 88, borderRadius: '50%',
              background: `${prize.color}25`, border: `2px solid ${prize.color}`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 24px',
              fontFamily: "'Orbitron'", fontSize: '1.1rem', fontWeight: 900,
              color: prize.color, letterSpacing: '0.05em',
            }}>
              {prize.icon}
            </div>

            <div style={{ fontFamily: "'Space Mono'", fontSize: '0.58rem', letterSpacing: '0.3em', color: prize.color, marginBottom: 10 }}>YOU WON</div>
            <h3 style={{ fontFamily: "'Bebas Neue'", fontSize: '2.4rem', color: B.white, letterSpacing: '0.05em', marginBottom: 8 }}>
              {prize.label}
            </h3>
            <p style={{ color: B.smoke, fontFamily: "'Space Mono'", fontSize: '0.72rem', marginBottom: 28 }}>
              {prize.sub}
            </p>

            {prize.label !== 'TRY AGAIN' && (
              <div style={{
                background: B.black, border: `1px solid ${prize.color}50`,
                borderRadius: 6, padding: '12px 20px', marginBottom: 24,
                fontFamily: "'Space Mono'", fontSize: '0.62rem', color: prize.color, lineHeight: 1.6,
              }}>
                Screenshot this · show at the event gate on Dec 12 to claim
              </div>
            )}

            <button
              onClick={() => setResult(null)}
              style={{
                background: 'transparent', border: `1px solid ${B.gunmetal}`,
                color: B.smoke, padding: '8px 28px',
                fontFamily: "'Space Mono'", fontSize: '0.7rem',
                cursor: 'pointer', borderRadius: 4,
              }}
            >close</button>
          </div>
        </div>
      )}
    </section>
  )
}
