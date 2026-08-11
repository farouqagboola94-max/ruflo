import { useState, useEffect, useRef } from 'react'
import { B } from '../tokens'
import { GrainOverlay, ScanLines, SectionTag } from '../components/Shared'
import Egg from '../components/Egg'

const DAILY_KEY = 'sf26_hype_daily'
const MILESTONE = 1000
const FLUSH_MS  = 2000

const MILESTONE_COPY = [
  'THE CULTURE IS ALIVE',
  'LAGOS IS HYPED',
  'THE SOLE COMMUNITY GROWS',
  'THIS IS HISTORY IN THE MAKING',
]

function TODAY() { return new Date().toISOString().slice(0, 10) }

function getDailyTaps() {
  try {
    const d = JSON.parse(localStorage.getItem(DAILY_KEY) || 'null')
    if (d?.date === TODAY()) return d.taps
  } catch {}
  return 0
}

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

function Confetti({ count = 60 }) {
  const COLORS = [B.amber, B.neonCyan, B.neonMagenta, B.neonLime, '#ffffff']
  return (
    <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 9000 }}>
      {Array.from({ length: count }, (_, i) => (
        <div key={i} style={{
          position: 'absolute',
          left: `${Math.random() * 100}%`,
          top: -16,
          width: 6 + Math.random() * 8,
          height: 6 + Math.random() * 8,
          background: COLORS[i % COLORS.length],
          borderRadius: i % 3 === 0 ? '50%' : 2,
          animation: `confettiFall ${1.2 + Math.random() * 0.8}s ${Math.random() * 0.5}s ease-in forwards`,
        }} />
      ))}
    </div>
  )
}

export default function HypeCounter() {
  // null until the shared counter answers. It is one real total in the store now,
  // not a seed plus whatever this browser had tapped.
  const [count, setCount] = useState(null)
  const [burst, setBurst] = useState(false)
  const [floats, setFloats] = useState([])
  const [dailyTaps, setDailyTaps] = useState(() => getDailyTaps())
  const [milestone, setMilestone] = useState(null)
  const [confetti, setConfetti] = useState(false)
  const prevMilestoneRef = useRef(null)
  const pendingRef = useRef(0)

  useEffect(() => {
    fetch('/.netlify/functions/hype')
      .then(r => r.ok ? r.json() : null)
      .then(d => {
        if (!Number.isFinite(d?.total)) return
        setCount(d.total)
        prevMilestoneRef.current = Math.floor(d.total / MILESTONE)
      })
      .catch(() => {})
  }, [])

  // Taps are batched so a fast tapper does not fire a request per press.
  useEffect(() => {
    const flush = () => {
      const taps = pendingRef.current
      if (!taps) return
      pendingRef.current = 0
      fetch('/.netlify/functions/hype', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ taps: Math.min(50, taps) }),
      })
        .then(r => r.ok ? r.json() : null)
        .then(d => { if (Number.isFinite(d?.total)) setCount(d.total) })
        .catch(() => {})
    }
    const id = setInterval(flush, FLUSH_MS)
    window.addEventListener('pagehide', flush)
    return () => { clearInterval(id); window.removeEventListener('pagehide', flush); flush() }
  }, [])

  function tap() {
    const add = 1
    pendingRef.current += add

    setCount(c => {
      if (c === null) return c
      const next = c + add

      const curMilestone = Math.floor(next / MILESTONE)
      if (prevMilestoneRef.current === null) {
        prevMilestoneRef.current = curMilestone
      } else if (curMilestone > prevMilestoneRef.current) {
        prevMilestoneRef.current = curMilestone
        const msg = MILESTONE_COPY[(curMilestone - 1) % MILESTONE_COPY.length]
        setMilestone({ count: curMilestone * MILESTONE, message: msg })
        setConfetti(true)
        setTimeout(() => setConfetti(false), 3500)
        setTimeout(() => setMilestone(null), 9000)
      }

      return next
    })

    setDailyTaps(prev => {
      const next = prev + add
      try { localStorage.setItem(DAILY_KEY, JSON.stringify({ date: TODAY(), taps: next })) } catch {}
      return next
    })

    setBurst(true)
    setTimeout(() => setBurst(false), 200)

    const EMOJIS = ['👟','🔥','💥','⚡','✨','🤙']
    const id = Date.now()
    setFloats(f => [...f, { id, emoji: EMOJIS[Math.floor(Math.random() * EMOJIS.length)], x: 30 + Math.random() * 40 }])
    setTimeout(() => setFloats(f => f.filter(p => p.id !== id)), 1000)
  }

  function share() {
    const num = count === null ? null : (Math.floor(count / MILESTONE) * MILESTONE).toLocaleString()
    const text = num
      ? `I helped push Sneakers Fest '26 hype past ${num}! The sole community is alive 🔥👟`
      : `I'm hyping Sneakers Fest '26. The sole community is alive 🔥👟`
    if (navigator.share) { navigator.share({ text }).catch(() => {}) }
    else if (navigator.clipboard) { navigator.clipboard.writeText(text).catch(() => {}) }
  }

  const known = count !== null
  const nextMilestone = known ? (Math.floor(count / MILESTONE) + 1) * MILESTONE : MILESTONE
  const progressPct = known ? ((count % MILESTONE) / MILESTONE) * 100 : 0

  return (
    <section id="hype" style={{
      background: `linear-gradient(180deg, ${B.void} 0%, ${B.black} 100%)`,
      padding: '80px 20px', textAlign: 'center', position: 'relative', overflow: 'hidden',
    }}>
      {confetti && <Confetti count={60} />}
      <GrainOverlay /><ScanLines />
      <Egg id="egg-047" corner="top-right" />
      <Egg id="egg-048" corner="bottom-left" />

      <style>{`
        @keyframes milestoneGlow {
          0%,100% { box-shadow: 0 0 30px ${B.amber}60, 0 0 60px ${B.amber}30; }
          50%      { box-shadow: 0 0 70px ${B.amber}, 0 0 140px ${B.amber}50; }
        }
        @keyframes tapperPulse { 0%,100%{opacity:1} 50%{opacity:0.4} }
        @keyframes milestoneSlide { from{opacity:0;transform:scale(0.85)} to{opacity:1;transform:scale(1)} }
      `}</style>

      {/* Milestone celebration overlay */}
      {milestone && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 9500,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: 'rgba(0,0,0,0.88)', padding: 20,
        }}>
          <div className="card-3d" style={{
            background: B.charcoal, border: `2px solid ${B.amber}`,
            borderRadius: 16, padding: '36px 40px', textAlign: 'center',
            animation: 'milestoneGlow 2s ease-in-out infinite, milestoneSlide 0.5s cubic-bezier(0.34,1.56,0.64,1)',
            maxWidth: 360, width: '100%',
          }}>
            <div style={{ fontSize: '3rem', marginBottom: 10 }}>🎊</div>
            <div style={{
              fontFamily: "'Orbitron'", fontSize: 'clamp(2rem,8vw,3rem)', fontWeight: 900,
              color: B.amber, letterSpacing: '0.04em', lineHeight: 1, marginBottom: 8,
            }}>
              {milestone.count.toLocaleString()}
            </div>
            <div style={{
              fontFamily: "'Bebas Neue'", fontSize: '1.7rem', letterSpacing: '0.12em',
              color: B.white, marginBottom: 24,
            }}>
              {milestone.message}
            </div>
            <div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap' }}>
              <button onClick={share} style={{
                background: B.amber, color: B.black, border: 'none',
                padding: '12px 28px', fontFamily: "'Bebas Neue'", fontSize: '1.1rem',
                letterSpacing: '0.1em', cursor: 'pointer', borderRadius: 6,
              }}>SHARE THIS</button>
              <button onClick={() => setMilestone(null)} style={{
                background: 'transparent', color: B.smoke, border: `1px solid #444`,
                padding: '12px 20px', fontFamily: "'Bebas Neue'", fontSize: '1rem',
                cursor: 'pointer', borderRadius: 6,
              }}>CLOSE</button>
            </div>
          </div>
        </div>
      )}

      <div style={{ maxWidth: 540, margin: '0 auto' }}>
        <SectionTag>COMMUNITY HYPE</SectionTag>
        <h2 className="reveal-3d text-3d" style={{ fontFamily: "'Bebas Neue'", fontSize: 'clamp(2.5rem,6vw,4rem)', color: B.white, letterSpacing: '0.05em', marginBottom: 12 }}>
          THE CULTURE IS COUNTING
        </h2>

        {/* Live stats */}
        <div className="reveal-3d" style={{ display: 'flex', justifyContent: 'center', gap: 20, marginBottom: 24, flexWrap: 'wrap' }}>
          <div style={{ fontFamily: "'Space Mono'", fontSize: '0.62rem', color: B.smoke }}>
            <span style={{
              display: 'inline-block', width: 6, height: 6, borderRadius: '50%',
              background: '#22ff44', marginRight: 6, verticalAlign: 'middle',
              animation: 'tapperPulse 1.4s ease-in-out infinite',
            }} />
            EVERY TAP HERE IS SOMEONE REAL
          </div>
          <div style={{ fontFamily: "'Space Mono'", fontSize: '0.62rem', color: B.smoke }}>
            YOUR HYPE TODAY: <strong style={{ color: B.amber }}>{dailyTaps.toLocaleString()}</strong>
          </div>
        </div>

        {/* Main counter */}
        <div style={{ position: 'relative', marginBottom: 14 }}>
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
            {known ? count.toLocaleString() : '—'}
          </div>
        </div>

        {/* Progress to next milestone */}
        <div className="reveal-3d" style={{ marginBottom: 32 }}>
          <div style={{ fontFamily: "'Space Mono'", fontSize: '0.58rem', color: '#444', marginBottom: 6 }}>
            NEXT MILESTONE: {nextMilestone.toLocaleString()}
          </div>
          <div style={{ background: 'rgba(255,255,255,0.06)', borderRadius: 4, height: 3, overflow: 'hidden', maxWidth: 220, margin: '0 auto' }}>
            <div style={{
              width: `${progressPct}%`, height: '100%',
              background: `linear-gradient(90deg, ${B.amber}, ${B.neonCyan})`,
              transition: 'width 0.3s ease',
            }} />
          </div>
        </div>

        <p style={{ color: B.smoke, fontFamily: "'Space Mono'", fontSize: '0.78rem', letterSpacing: '0.1em', marginBottom: 44 }}>
          HEADS HYPED FOR SNEAKERS FEST '26
        </p>

        {/* Tap button */}
        <div style={{ position: 'relative', display: 'inline-block' }}>
          <div style={{
            position: 'absolute', inset: -20, borderRadius: '50%',
            background: `radial-gradient(circle, ${B.amber}${burst ? '55' : '38'} 0%, transparent 70%)`,
            filter: 'blur(20px)', animation: 'pulse 2s ease-in-out infinite',
            transition: 'all 0.15s',
          }} />
          <button onClick={tap} style={{
            width: 150, height: 150, borderRadius: '50%',
            background: burst ? B.amberGlow : B.amber,
            color: B.black, border: 'none', cursor: 'pointer',
            fontFamily: "'Bebas Neue'", fontSize: '1.5rem', letterSpacing: '0.1em',
            boxShadow: `0 0 50px ${B.amber}60, 0 0 100px ${B.amber}28`,
            transform: burst ? 'scale(0.91)' : 'scale(1)',
            transition: 'transform 0.1s ease, background 0.15s',
            lineHeight: 1.35, position: 'relative', zIndex: 2,
          }}>TAP<br />TO<br />HYPE</button>
        </div>

        <p style={{ color: B.smoke, fontFamily: "'Space Mono'", fontSize: '0.58rem', marginTop: 20 }}>
          every tap is permanent · your hype lives forever
        </p>
        <p style={{ color: '#444', fontFamily: "'Space Mono'", fontSize: '0.55rem', marginTop: 4 }}>
          next milestone celebration at {nextMilestone.toLocaleString()}
        </p>
      </div>
    </section>
  )
}
