import { useState, useEffect } from 'react'
import { B } from '../tokens'
import { processStreakXP, STREAK_XP } from '../lib/passport'

const MESSAGES = {
  new:   { icon: '👟', title: "WELCOME, SNEAKERHEAD",  body: "You've just found the illest sneaker event in Lagos. Grab your ticket before they're gone.", accent: B.amber },
  return:{ icon: '🔥', title: 'BACK AGAIN!',            body: "The hype is real. Tickets are moving fast — don't sleep on this.", accent: B.amber },
  day3:  { icon: '🏆', title: '3-DAY DEVOTEE',          body: "Three days straight. You're culture, not a tourist. Keep the streak alive.", accent: B.neonCyan },
  day7:  { icon: '👑', title: 'LEGEND STATUS',          body: "A full week. You live and breathe this. See you December 12, Lagos.", accent: B.neonMagenta },
  day14: { icon: '💎', title: 'SOLE ICON',              body: "Two weeks of devotion. You're not a fan — you're part of the story.", accent: '#9B59FF' },
}

function StreakFire({ count }) {
  const fires = Math.min(count, 7)
  return (
    <div style={{ display: 'flex', gap: 2, marginBottom: 5 }}>
      {Array.from({ length: fires }, (_, i) => (
        <span key={i} style={{ fontSize: '0.75rem' }}>🔥</span>
      ))}
    </div>
  )
}

export default function StreakToast() {
  const [visible, setVisible] = useState(false)
  const [msg, setMsg] = useState(null)
  const [streak, setStreak] = useState(1)
  const [xpEarned, setXpEarned] = useState(0)

  useEffect(() => {
    try {
      const KEY = 'sf26_streak'
      const stored = JSON.parse(localStorage.getItem(KEY) || 'null')
      const today = new Date().toDateString()

      if (stored?.last === today) return

      let newStreak = 1
      let msgKey = 'new'

      if (stored) {
        const diff = Math.round((new Date(today) - new Date(stored.last)) / 86400000)
        newStreak = diff === 1 ? stored.streak + 1 : 1
        if (newStreak >= 14) msgKey = 'day14'
        else if (newStreak >= 7) msgKey = 'day7'
        else if (newStreak >= 3) msgKey = 'day3'
        else msgKey = 'return'
      }

      localStorage.setItem(KEY, JSON.stringify({ last: today, streak: newStreak }))

      const xp = processStreakXP(newStreak)
      setStreak(newStreak)
      setXpEarned(xp)

      const delay = setTimeout(() => {
        setMsg(MESSAGES[msgKey])
        setVisible(true)
      }, 2500)

      return () => clearTimeout(delay)
    } catch {
      // localStorage unavailable
    }
  }, [])

  useEffect(() => {
    if (!visible) return
    const t = setTimeout(() => setVisible(false), 8000)
    return () => clearTimeout(t)
  }, [visible])

  if (!visible || !msg) return null

  return (
    <>
      <style>{`
        @keyframes toastSlideIn {
          from { opacity: 0; transform: translateX(110%); }
          to   { opacity: 1; transform: translateX(0); }
        }
      `}</style>
      <div style={{
        position: 'fixed', top: 76, right: 16, zIndex: 9990,
        background: B.charcoal,
        border: `1px solid ${msg.accent}45`,
        borderLeft: `3px solid ${msg.accent}`,
        borderRadius: 8, padding: '14px 14px 14px 16px',
        maxWidth: 300, width: '90vw',
        boxShadow: `0 8px 32px rgba(0,0,0,0.7), 0 0 28px ${msg.accent}15`,
        display: 'flex', gap: 12, alignItems: 'flex-start',
        animation: 'toastSlideIn 0.45s cubic-bezier(0.34,1.56,0.64,1)',
      }}>
        <span style={{ fontSize: '1.5rem', lineHeight: 1, flexShrink: 0 }}>{msg.icon}</span>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 4, gap: 8 }}>
            <div style={{ fontFamily: "'Orbitron'", fontSize: '0.56rem', letterSpacing: '0.16em', color: msg.accent }}>
              {msg.title}
            </div>
            <div style={{
              fontFamily: "'Orbitron'", fontSize: '0.58rem', fontWeight: 900,
              color: '#B8FF00', flexShrink: 0,
            }}>
              +{xpEarned} XP
            </div>
          </div>
          {streak > 1 && <StreakFire count={streak} />}
          <div style={{ fontFamily: "'Syne'", fontSize: '0.78rem', color: B.white, lineHeight: 1.5 }}>
            {msg.body}
          </div>
          <div style={{ fontFamily: "'Space Mono'", fontSize: '0.52rem', color: '#555', marginTop: 6 }}>
            {streak > 1 ? `${streak}-DAY STREAK` : 'START YOUR STREAK TODAY'} · {STREAK_XP.daily} XP/DAY BASE
          </div>
        </div>
        <button
          onClick={() => setVisible(false)}
          style={{
            background: 'none', border: 'none', color: B.smoke, cursor: 'pointer',
            fontSize: '1.1rem', padding: 0, lineHeight: 1, flexShrink: 0, marginTop: 2,
          }}
        >×</button>
      </div>
    </>
  )
}
