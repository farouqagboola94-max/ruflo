import { useState, useEffect, useRef } from 'react'
import { B } from '../tokens'
import { subscribe } from '../lib/passport'

export default function LevelUpToast() {
  const [toast, setToast] = useState(null)
  const [visible, setVisible] = useState(false)
  const hideRef = useRef(null)

  useEffect(() => {
    return subscribe(detail => {
      if (detail.leveledUp) setToast({ type: 'level', level: detail.newLevel })
      else if (detail.bonusAwarded) setToast({ type: 'bonus' })
      else return

      setVisible(false)
      requestAnimationFrame(() => setVisible(true))
      clearTimeout(hideRef.current)
      hideRef.current = setTimeout(() => setVisible(false), 4200)
    })
  }, [])

  if (!toast) return null

  const isLevel = toast.type === 'level'
  const accent = isLevel ? B.neonLime : B.amber

  return (
    <div style={{
      position: 'fixed', top: 140, right: 16, zIndex: 9991,
      background: B.charcoal, border: `1px solid ${accent}50`, borderLeft: `3px solid ${accent}`,
      borderRadius: 8, padding: '14px 18px', minWidth: 220, maxWidth: 280,
      boxShadow: `0 8px 32px rgba(0,0,0,0.7), 0 0 24px ${accent}20`,
      opacity: visible ? 1 : 0,
      transform: visible ? 'translateX(0)' : 'translateX(110%)',
      transition: 'opacity 0.35s ease, transform 0.35s cubic-bezier(0.34,1.56,0.64,1)',
      pointerEvents: visible ? 'auto' : 'none',
    }}>
      <div style={{ fontFamily: "'Orbitron'", fontSize: '0.58rem', letterSpacing: '0.2em', color: accent, marginBottom: 6 }}>
        {isLevel ? '⬆ LEVEL UP' : '🔥 DAILY COMBO BONUS'}
      </div>
      <div style={{ fontFamily: "'Bebas Neue'", fontSize: '1.3rem', color: B.white, letterSpacing: '0.03em' }}>
        {isLevel ? `CARD LEVEL ${toast.level}` : '+75 XP — VARIETY BONUS'}
      </div>
      <div style={{ fontFamily: "'Space Mono'", fontSize: '0.6rem', color: '#888', marginTop: 4 }}>
        {isLevel ? 'Your sneaker card just leveled up' : 'Played 3+ different games today'}
      </div>
    </div>
  )
}
