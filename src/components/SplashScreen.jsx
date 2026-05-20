import { useState, useEffect } from 'react'
import { B } from '../tokens'
import { EVENT } from '../config'

const TARGET = new Date(EVENT.dateISO)

function useCountdown(target) {
  const [t, setT] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 })
  useEffect(() => {
    const tick = () => {
      const diff = target - Date.now()
      if (diff <= 0) { setT({ days: 0, hours: 0, minutes: 0, seconds: 0 }); return }
      setT({
        days: Math.floor(diff / 86400000),
        hours: Math.floor((diff % 86400000) / 3600000),
        minutes: Math.floor((diff % 3600000) / 60000),
        seconds: Math.floor((diff % 60000) / 1000),
      })
    }
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [target])
  return t
}

export default function SplashScreen() {
  const [show, setShow] = useState(false)
  const t = useCountdown(TARGET)

  useEffect(() => {
    if (!sessionStorage.getItem('sf26_entered')) setShow(true)
  }, [])

  const enter = () => {
    sessionStorage.setItem('sf26_entered', '1')
    setShow(false)
  }

  if (!show) return null

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 9999,
      background: `
        radial-gradient(ellipse 80% 60% at 50% 40%, ${B.amber}12 0%, transparent 60%),
        linear-gradient(180deg, #030305 0%, ${B.void} 60%, ${B.black} 100%)
      `,
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      padding: 24, textAlign: 'center',
    }}>
      {/* Grid bg */}
      <div style={{ position: 'absolute', inset: 0, opacity: 0.025, backgroundImage: `linear-gradient(${B.neonCyan} 1px, transparent 1px), linear-gradient(90deg, ${B.neonCyan} 1px, transparent 1px)`, backgroundSize: '60px 60px' }} />
      {/* Glow */}
      <div style={{ position: 'absolute', top: '35%', left: '50%', transform: 'translate(-50%,-50%)', width: 700, height: 500, background: `radial-gradient(circle, ${B.amber}12 0%, transparent 60%)`, filter: 'blur(70px)', pointerEvents: 'none' }} />
      {/* Corner brackets */}
      {[['top:40px','left:40px','borderTop','borderLeft'],['top:40px','right:40px','borderTop','borderRight'],['bottom:40px','left:40px','borderBottom','borderLeft'],['bottom:40px','right:40px','borderBottom','borderRight']].map((b, i) => (
        <div key={i} style={{ position: 'absolute', [b[0].split(':')[0]]: b[0].split(':')[1], [b[1].split(':')[0]]: b[1].split(':')[1], width: 40, height: 40, [b[2]]: `2px solid ${B.amber}35`, [b[3]]: `2px solid ${B.amber}35` }} />
      ))}

      <div style={{ position: 'relative', zIndex: 10 }}>
        {/* Location pill */}
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, marginBottom: 32, padding: '5px 16px', background: 'rgba(255,255,255,0.04)', backdropFilter: 'blur(10px)', border: `1px solid ${B.neonCyan}30`, borderRadius: 20 }}>
          <div style={{ width: 5, height: 5, borderRadius: '50%', background: B.neonLime, animation: 'pulse 2s infinite', boxShadow: `0 0 6px ${B.neonLime}` }} />
          <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 8, color: B.neonCyan, letterSpacing: '0.4em' }}>LAGOS, NIGERIA — EKO ATLANTIC</span>
        </div>

        {/* Title */}
        <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 'clamp(56px, 14vw, 120px)', color: B.white, lineHeight: 0.85 }}>SNEAKERS</div>
        <div style={{ fontFamily: "'Orbitron', monospace", fontWeight: 900, fontSize: 'clamp(36px, 9vw, 80px)', color: B.amber, lineHeight: 1, letterSpacing: '0.08em', textShadow: `0 0 30px ${B.amber}50, 0 0 80px ${B.amber}20` }}>FEST '26</div>

        <div style={{ width: '100%', maxWidth: 400, height: 1, margin: '20px auto', background: `linear-gradient(90deg, transparent, ${B.amber}50, transparent)` }} />

        {/* Countdown label */}
        <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 8, color: B.neonMagenta, letterSpacing: '0.5em', marginBottom: 20, textShadow: `0 0 10px ${B.neonMagenta}40` }}>DROPS IN</div>

        {/* Countdown boxes */}
        <div style={{ display: 'flex', gap: 14, justifyContent: 'center', marginBottom: 36 }}>
          {[{ v: t.days, l: 'DAYS' }, { v: t.hours, l: 'HRS' }, { v: t.minutes, l: 'MIN' }, { v: t.seconds, l: 'SEC' }].map(({ v, l }) => (
            <div key={l} style={{ textAlign: 'center' }}>
              <div style={{ width: 68, height: 78, background: 'rgba(255,255,255,0.05)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 24px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.1)' }}>
                <span style={{ fontFamily: "'Orbitron', monospace", fontSize: 26, fontWeight: 900, color: B.amber, textShadow: `0 0 20px ${B.amber}50` }}>{String(v).padStart(2, '0')}</span>
              </div>
              <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 7, color: B.smoke, marginTop: 6, letterSpacing: '0.35em' }}>{l}</div>
            </div>
          ))}
        </div>

        <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 15, color: B.smoke, lineHeight: 1.65, marginBottom: 36, maxWidth: 340, margin: '0 auto 36px' }}>
          West Africa's biggest sneaker event is coming.<br />
          <span style={{ color: B.amber }}>December 12, 2026 — Eko Atlantic, Lagos.</span>
        </div>

        {/* Enter button */}
        <button
          onClick={enter}
          style={{ padding: '15px 48px', background: B.amber, color: B.black, fontFamily: "'Space Mono', monospace", fontSize: 11, fontWeight: 700, letterSpacing: '0.25em', border: 'none', borderRadius: 4, cursor: 'pointer', boxShadow: `0 0 40px ${B.amber}30, 0 4px 20px rgba(0,0,0,0.5)`, transition: 'transform 0.2s, box-shadow 0.2s' }}
          onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.04)'; e.currentTarget.style.boxShadow = `0 0 60px ${B.amber}50` }}
          onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.boxShadow = `0 0 40px ${B.amber}30` }}
        >ENTER SITE →</button>

        <div style={{ marginTop: 16, fontFamily: "'Space Mono', monospace", fontSize: 8, color: '#333', letterSpacing: '0.2em' }}>THE SOLE EXHIBITION</div>
      </div>
    </div>
  )
}
