import { useState, useEffect } from 'react'
import { B } from '../tokens'
import { GrainOverlay, ScanLines, SectionTag } from '../components/Shared'

const SEED = 8423
const KEY = 'sf26_hype'

function Float({ emoji, x }) {
  const [gone, setGone] = useState(false)
  useEffect(() => { const t = setTimeout(() => setGone(true), 50); return () => clearTimeout(t) }, [])
  return (
    <div style={{
      position: 'absolute', left: `${x}%`, bottom: '50%', fontSize: '2rem',
      pointerEvents: 'none', zIndex: 10,
      opacity: gone ? 0 : 1,
      transform: gone ? 'translateY(-90px)' : 'translateY(0)',
      transition: 'opacity 0.9s ease-out, transform 0.9s cubic-bezier(0.22,1,0.36,1)',
    }}>{emoji}</div>
  )
}

export default function HypeCounter() {
  const [count, setCount] = useState(SEED)
  const [burst, setBurst] = useState(false)
  const [floats, setFloats] = useState([])

  useEffect(() => {
    try {
      const extra = Number(JSON.parse(localStorage.getItem(KEY) || '0'))
      setCount(SEED + extra)
    } catch {}
  }, [])

  function tap() {
    const add = 1 + Math.floor(Math.random() * 2)
    setCount(c => {
      const next = c + add
      try { localStorage.setItem(KEY, JSON.stringify(next - SEED)) } catch {}
      return next
    })
    setBurst(true)
    setTimeout(() => setBurst(false), 200)
    const EMOJIS = ['👟','🔥','💥','⚡','✨','🤙']
    const id = Date.now()
    const newFloat = {
      id,
      emoji: EMOJIS[Math.floor(Math.random() * EMOJIS.length)],
      x: 30 + Math.random() * 40,
    }
    setFloats(f => [...f, newFloat])
    setTimeout(() => setFloats(f => f.filter(p => p.id !== id)), 1000)
  }

  return (
    <section id="hype" style={{
      background: `linear-gradient(180deg, ${B.void} 0%, ${B.black} 100%)`,
      padding: '80px 20px', textAlign: 'center', position: 'relative', overflow: 'hidden',
    }}>
      <GrainOverlay /><ScanLines />
      <div style={{ maxWidth: 540, margin: '0 auto' }}>
        <SectionTag>COMMUNITY HYPE</SectionTag>
        <h2 style={{ fontFamily: "'Bebas Neue'", fontSize: 'clamp(2.5rem,6vw,4rem)', color: B.white, letterSpacing: '0.05em', marginBottom: 40 }}>
          ADD YOUR HYPE
        </h2>

        <div style={{ position: 'relative', marginBottom: 24 }}>
          {floats.map(f => <Float key={f.id} emoji={f.emoji} x={f.x} />)}
          <div style={{
            fontFamily: "'Orbitron'", fontWeight: 900,
            fontSize: 'clamp(3.5rem,12vw,6.5rem)',
            color: B.amber,
            textShadow: `0 0 40px ${B.amber}80, 0 0 80px ${B.amber}40`,
            transform: burst ? 'scale(1.08)' : 'scale(1)',
            transition: 'transform 0.15s cubic-bezier(0.34,1.56,0.64,1)',
            letterSpacing: '0.04em', lineHeight: 1,
          }}>
            {count.toLocaleString()}
          </div>
        </div>

        <p style={{ color: B.smoke, fontFamily: "'Space Mono'", fontSize: '0.8rem', letterSpacing: '0.12em', marginBottom: 44 }}>
          HEADS HYPED FOR SNEAKERS FEST '26
        </p>

        <div style={{ position: 'relative', display: 'inline-block' }}>
          <div style={{
            position: 'absolute', inset: -20, borderRadius: '50%',
            background: `radial-gradient(circle, ${B.amber}40 0%, transparent 70%)`,
            filter: 'blur(20px)', animation: 'pulse 2s ease-in-out infinite',
          }} />
          <button
            onClick={tap}
            style={{
              width: 150, height: 150, borderRadius: '50%',
              background: burst ? B.amberGlow : B.amber,
              color: B.black, border: 'none', cursor: 'pointer',
              fontFamily: "'Bebas Neue'", fontSize: '1.5rem', letterSpacing: '0.1em',
              boxShadow: `0 0 50px ${B.amber}60, 0 0 100px ${B.amber}28`,
              transform: burst ? 'scale(0.91)' : 'scale(1)',
              transition: 'transform 0.1s ease, background 0.15s',
              lineHeight: 1.35, position: 'relative', zIndex: 2,
            }}
          >TAP<br />TO<br />HYPE</button>
        </div>

        <p style={{ color: B.smoke, fontFamily: "'Space Mono'", fontSize: '0.62rem', marginTop: 24 }}>
          every tap is permanent · your hype lives forever
        </p>
      </div>
    </section>
  )
}
