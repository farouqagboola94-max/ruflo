import { useState, useEffect, useRef } from 'react'
import { B } from '../tokens'

const POOL = [
  { msg: "Tunde just won VIP UPGRADE on the wheel",       icon: '🎰', color: B.neonMagenta },
  { msg: "Adaeze just reached FOUNDING MEMBER status",    icon: '👑', color: B.amber },
  { msg: "Chisom scored 10/10 in Sole Knowledge",         icon: '🧠', color: B.neonCyan },
  { msg: "Emeka just unlocked INNER CIRCLE",              icon: '💎', color: B.neonCyan },
  { msg: "12 people are playing Sole Memory right now",   icon: '👥', color: B.neonLime },
  { msg: "Zara just joined the Early Access list",        icon: '⚡', color: B.neonLime },
  { msg: "Femi won ₦5,000 OFF on the wheel",             icon: '💸', color: B.amber },
  { msg: "Only 38 VVIP tickets left",                    icon: '🔥', color: B.neonMagenta },
  { msg: "Ngozi is on a 7-day streak",                   icon: '🔥', color: B.amber },
  { msg: "Dayo just solved today's Soledle in 2 guesses", icon: '🕵️', color: B.neonCyan },
  { msg: "17 people are reading the Artist Vault",        icon: '👥', color: '#888' },
  { msg: "Bola just reached Sole Legend tier",            icon: '🏆', color: B.neonMagenta },
  { msg: "Kemi referred 5 friends to the movement",       icon: '🔗', color: B.neonLime },
  { msg: "Ife just went FLAWLESS in Trivia",              icon: '⚡', color: B.amber },
  { msg: "3 Phalanx tickets claimed in the last hour",    icon: '🎟️', color: B.neonLime },
  { msg: "Seun just entered all 4 raffles",               icon: '🎯', color: B.neonCyan },
  { msg: "General tickets are 73% sold out",              icon: '⏳', color: B.neonMagenta },
  { msg: "Lola just unlocked the Architect Vault",        icon: '🔓', color: B.amber },
]

let lastIdx = -1
function pickActivity() {
  let idx
  do { idx = Math.floor(Math.random() * POOL.length) } while (idx === lastIdx)
  lastIdx = idx
  return POOL[idx]
}

export default function LiveActivity() {
  const [visible, setVisible]   = useState(false)
  const [item,    setItem]      = useState(null)
  const timerRef = useRef(null)
  const showRef  = useRef(null)
  const hideRef  = useRef(null)

  function schedule(delay) {
    timerRef.current = setTimeout(() => {
      const next = pickActivity()
      setItem(next)
      setVisible(true)
      hideRef.current = setTimeout(() => {
        setVisible(false)
        schedule(22000 + Math.random() * 18000)
      }, 4800)
    }, delay)
  }

  useEffect(() => {
    schedule(8000 + Math.random() * 6000)
    return () => {
      clearTimeout(timerRef.current)
      clearTimeout(showRef.current)
      clearTimeout(hideRef.current)
    }
  }, [])

  if (!item) return null

  return (
    <div style={{
      position: 'fixed',
      bottom: 88,
      left: 20,
      zIndex: 1800,
      maxWidth: 300,
      transform: visible ? 'translateX(0) translateY(0)' : 'translateX(-110%)',
      opacity: visible ? 1 : 0,
      transition: 'transform 0.45s cubic-bezier(0.34,1.56,0.64,1), opacity 0.3s ease',
      pointerEvents: 'none',
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        background: 'rgba(10,10,14,0.97)',
        backdropFilter: 'blur(20px)',
        border: `1px solid ${item.color}35`,
        borderLeft: `3px solid ${item.color}`,
        borderRadius: 10,
        padding: '10px 14px',
        boxShadow: `0 4px 24px rgba(0,0,0,0.7), 0 0 0 1px rgba(255,255,255,0.03)`,
      }}>
        <span style={{ fontSize: 16, flexShrink: 0 }}>{item.icon}</span>
        <div>
          <div style={{
            fontFamily: "'Space Mono', monospace",
            fontSize: 9,
            color: item.color,
            letterSpacing: 2,
            marginBottom: 2,
            fontWeight: 700,
          }}>LIVE</div>
          <div style={{
            fontFamily: "'Syne', sans-serif",
            fontSize: 11,
            color: B.mist,
            lineHeight: 1.4,
          }}>{item.msg}</div>
        </div>
        {/* Pulse dot */}
        <div style={{
          width: 6,
          height: 6,
          borderRadius: '50%',
          background: item.color,
          flexShrink: 0,
          boxShadow: `0 0 8px ${item.color}`,
          animation: 'pulse 1.5s ease-in-out infinite',
        }} />
      </div>
    </div>
  )
}
