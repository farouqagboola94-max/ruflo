import { useState, useEffect } from 'react'
import { B } from '../tokens'

const MESSAGES = {
  new:      { icon: '👟', title: 'WELCOME, SNEAKERHEAD',  body: "You've just discovered the illest sneaker event in Lagos. Grab your ticket before they're gone." },
  returning:{ icon: '🔥', title: 'BACK AGAIN!',            body: "You feel the hype. Tickets are moving fast — don't sleep on it." },
  streak3:  { icon: '🏆', title: '3-DAY STREAK',           body: "Officially culture. You keep coming back because you know what's up." },
  streak7:  { icon: '👑', title: 'LEGEND STATUS',          body: 'A whole week. You live and breathe this. See you December 12.' },
}

export default function StreakToast() {
  const [visible, setVisible] = useState(false)
  const [msg, setMsg] = useState(null)

  useEffect(() => {
    try {
      const KEY = 'sf26_streak'
      const stored = JSON.parse(localStorage.getItem(KEY) || 'null')
      const today = new Date().toDateString()

      let streak = 1
      let msgKey = 'new'

      if (stored) {
        if (stored.last === today) return
        const diff = Math.round((new Date(today) - new Date(stored.last)) / 86400000)
        streak = diff === 1 ? stored.streak + 1 : 1
        msgKey = streak >= 7 ? 'streak7' : streak >= 3 ? 'streak3' : 'returning'
      }

      localStorage.setItem(KEY, JSON.stringify({ last: today, streak }))

      const delay = setTimeout(() => {
        setMsg(MESSAGES[msgKey])
        setVisible(true)
      }, 2500)

      return () => clearTimeout(delay)
    } catch {
      // localStorage unavailable — skip silently
    }
  }, [])

  useEffect(() => {
    if (!visible) return
    const t = setTimeout(() => setVisible(false), 7000)
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
        @keyframes toastSlideOut {
          from { opacity: 1; transform: translateX(0); }
          to   { opacity: 0; transform: translateX(110%); }
        }
      `}</style>
      <div style={{
        position: 'fixed', top: 76, right: 16, zIndex: 9990,
        background: B.charcoal,
        border: `1px solid ${B.amber}50`,
        borderLeft: `3px solid ${B.amber}`,
        borderRadius: 8, padding: '14px 14px 14px 16px',
        maxWidth: 290, width: '90vw',
        boxShadow: `0 8px 32px rgba(0,0,0,0.7), 0 0 24px ${B.amber}18`,
        display: 'flex', gap: 12, alignItems: 'flex-start',
        animation: 'toastSlideIn 0.45s cubic-bezier(0.34,1.56,0.64,1)',
      }}>
        <span style={{ fontSize: '1.5rem', lineHeight: 1, flexShrink: 0 }}>{msg.icon}</span>
        <div style={{ flex: 1 }}>
          <div style={{ fontFamily: "'Orbitron'", fontSize: '0.58rem', letterSpacing: '0.18em', color: B.amber, marginBottom: 5 }}>
            {msg.title}
          </div>
          <div style={{ fontFamily: "'Syne'", fontSize: '0.78rem', color: B.white, lineHeight: 1.55 }}>
            {msg.body}
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
