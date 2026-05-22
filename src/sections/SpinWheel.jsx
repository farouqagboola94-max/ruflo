import { useState, useRef } from 'react'
import { B } from '../tokens'
import { GrainOverlay, ScanLines, SectionTag } from '../components/Shared'

const PRIZES = [
  { label: '₦2,000 OFF',   sub: 'ticket discount',   color: '#F5A623', emoji: '💰' },
  { label: 'MERCH RAFFLE',      sub: 'free entry to draw', color: '#00F0FF', emoji: '👕' },
  { label: 'VIP UPGRADE',       sub: 'from GA to VIP',     color: '#FF2D7B', emoji: '⭐' },
  { label: 'MEET & GREET',      sub: 'backstage pass',     color: '#B8FF00', emoji: '🤝' },
  { label: 'EARLY ACCESS',      sub: '1hr before doors',   color: '#7B2FBE', emoji: '🚀' },
  { label: 'MYSTERY DROP',      sub: 'revealed at event',  color: '#FF6B35', emoji: '\ud83c�' },
  { label: 'TRY AGAIN',         sub: 'better luck next time', color: '#3A3A3A', emoji: '\ud83d�' },
  { label: '₦5,000 OFF',   sub: 'any ticket tier',    color: '#FFD080', emoji: '\ud83c�' },
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

function textTransform(i) {
  const mid = (i * EACH + EACH / 2 - 90)
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

    const targetMod = ((360 - (winner * EACH + EACH / 2)) % 360 + 360) % 360
    const prevMod = rotation % 360
    let extra = targetMod - prevMod
    if (extra < 0) extra += 360
    const totalAdditional = extra + 360 * (5 + Math.floor(Math.random() * 3))
    const newRotation = rotation + totalAdditional
    setRotation(newRotation)

    setTimeout(() => {
      setSpinning(false)
      setResult(winnerRef.current)
    }, 5200)
  }

  const prize = result !== null ? PRIZES[result] : null

  return (
    <section id="spin" style={{ background: B.charcoal, padding: '80px 20px', position: 'relative', overflow: 'hidden', textAlign: 'center' }}>
      <GrainOverlay /><ScanLines />

      <style>{`
        @keyframes wheelGlow { 0%,100% { box-shadow: 0 0 40px ${B.amber}40; } 50% { box-shadow: 0 0 80px ${B.amber}70; } }
        @keyframes winnerPop { from { opacity:0; transform:scale(0.7) rotate(-5deg); } to { opacity:1; transform:scale(1) rotate(0deg); } }
      `}</style>

      <div style={{ maxWidth: 600, margin: '0 auto' }}>
        <SectionTag>SPIN TO WIN</SectionTag>
        <h2 style={{ fontFamily: "'Bebas Neue'", fontSize: 'clamp(2.5rem,6vw,4rem)', color: B.white, letterSpacing: '0.05em', marginBottom: 8 }}>
          TEST YOUR LUCK
        </h2>
        <p style={{ color: B.smoke, fontFamily: "'Space Mono'", fontSize: '0.78rem', marginBottom: 40 }}>
          one spin per visit · prizes unlock at the event
        </p>

        {/* Pointer */}
        <div style={{ position: 'relative', display: 'inline-block' }}>
          <div style={{
            position: 'absolute', top: -18, left: '50%', transform: 'translateX(-50%)',
            width: 0, height: 0, zIndex: 20,
            borderLeft: '12px solid transparent',
            borderRight: '12px solid transparent',
            borderTop: `28px solid ${B.amber}`,
            filter: `drop-shadow(0 0 8px ${B.amber})`,
          }} />

          {/* Wheel */}
          <div style={{
            width: 300, height: 300, borderRadius: '50%',
            border: `4px solid ${B.amber}60`,
            boxShadow: spinning ? `0 0 80px ${B.amber}50` : `0 0 40px ${B.amber}20`,
            overflow: 'hidden', position: 'relative',
            transition: 'box-shadow 0.3s',
          }}>
            <svg
              viewBox="0 0 300 300"
              width="300"
              height="300"
              style={{
                transform: `rotate(${rotation}deg)`,
                transition: spinning ? 'transform 5s cubic-bezier(0.05,0.75,0.18,1)' : 'none',
                display: 'block',
              }}
            >
              {PRIZES.map((p, i) => (
                <g key={i}>
                  <path d={segPath(i)} fill={p.color} stroke="#0A0A0A" strokeWidth="1.5" />
                  <text
                    transform={textTransform(i)}
                    fill="rgba(0,0,0,0.85)"
                    fontSize="18"
                    textAnchor="middle"
                    dominantBaseline="middle"
                    style={{ fontFamily: 'system-ui', userSelect: 'none' }}
                  >
                    {p.emoji}
                  </text>
                </g>
              ))}
              <circle cx={CX} cy={CY} r="22" fill="#0A0A0A" stroke={B.amber} strokeWidth="2" />
              <text x={CX} y={CY} textAnchor="middle" dominantBaseline="middle" fontSize="10" fill={B.amber} style={{ fontFamily: 'monospace', fontWeight: 'bold' }}>SF</text>
            </svg>
          </div>
        </div>

        <div style={{ marginTop: 36 }}>
          {!spun || !spinning ? (
            <button
              onClick={spin}
              disabled={spinning}
              style={{
                background: spinning ? B.gunmetal : B.amber,
                color: spinning ? B.smoke : B.black,
                border: 'none', padding: '14px 48px',
                fontFamily: "'Bebas Neue'", fontSize: '1.5rem', letterSpacing: '0.1em',
                cursor: spinning ? 'default' : 'pointer', borderRadius: 4,
                boxShadow: spinning ? 'none' : `0 0 24px ${B.amber}60`,
                transition: 'all 0.3s',
              }}
            >
              {spinning ? 'SPINNING...' : spun ? 'SPIN AGAIN' : 'SPIN THE WHEEL'}
            </button>
          ) : null}
        </div>

        <p style={{ color: B.smoke, fontFamily: "'Space Mono'", fontSize: '0.62rem', marginTop: 16 }}>
          Prizes are redeemable at the event gate on Dec 12
        </p>
      </div>

      {/* Result modal */}
      {prize && (
        <div
          onClick={() => setResult(null)}
          style={{
            position: 'fixed', inset: 0, zIndex: 9999,
            background: 'rgba(0,0,0,0.92)', backdropFilter: 'blur(6px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}
        >
          <div
            onClick={e => e.stopPropagation()}
            style={{
              background: B.charcoal, borderRadius: 12, padding: '48px 40px',
              maxWidth: 420, width: '90%', textAlign: 'center',
              border: `2px solid ${prize.color}`,
              boxShadow: `0 0 80px ${prize.color}50`,
              animation: 'winnerPop 0.5s cubic-bezier(0.34,1.56,0.64,1)',
            }}
          >
            <div style={{ fontSize: '4rem', marginBottom: 16 }}>{prize.emoji}</div>
            <div style={{ fontFamily: "'Space Mono'", fontSize: '0.6rem', letterSpacing: '0.25em', color: prize.color, marginBottom: 12 }}>YOU WON</div>
            <h3 style={{ fontFamily: "'Bebas Neue'", fontSize: '2.2rem', color: B.white, letterSpacing: '0.05em', marginBottom: 8 }}>
              {prize.label}
            </h3>
            <p style={{ color: B.smoke, fontFamily: "'Space Mono'", fontSize: '0.75rem', marginBottom: 28 }}>
              {prize.sub}
            </p>
            {prize.label !== 'TRY AGAIN' && (
              <div style={{
                background: B.black, border: `1px solid ${prize.color}60`,
                borderRadius: 6, padding: '10px 20px', marginBottom: 24,
                fontFamily: "'Space Mono'", fontSize: '0.65rem', color: prize.color,
              }}>
                Show this screen at the event gate to claim
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
