import { useState, useEffect, useRef } from 'react'
import { B } from '../tokens'
import { GrainOverlay, ScanLines, SectionTag } from '../components/Shared'
import { addXP, XP_VALUES } from '../lib/passport'
import Egg from '../components/Egg'

const EVENT = new Date('2026-12-12T12:00:00')

const CLUES = [
  { icon: '🌍', text: "It starts in Africa. Specifically Lagos.", delay: 0 },
  { icon: '🤝', text: "Two brands. Two worlds. One silhouette.", delay: 45000 },
  { icon: '🎨', text: "The colorway has never been seen on a production shoe.", delay: 90000 },
  { icon: '🔢', text: "Fewer than 300 pairs exist worldwide.", delay: 135000 },
  { icon: '👑', text: "Founding Members get first access. No exceptions.", delay: 180000 },
  { icon: '💰', text: "Retail price will not reflect resale value.", delay: 225000 },
  { icon: '📍', text: "The drop happens only at the venue. You must be present.", delay: 270000 },
]

function useCountdown() {
  const [t, setT] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 })
  useEffect(() => {
    function tick() {
      const diff = EVENT - Date.now()
      if (diff <= 0) { setT({ days: 0, hours: 0, minutes: 0, seconds: 0 }); return }
      setT({
        days:    Math.floor(diff / 86400000),
        hours:   Math.floor((diff % 86400000) / 3600000),
        minutes: Math.floor((diff % 3600000) / 60000),
        seconds: Math.floor((diff % 60000) / 1000),
      })
    }
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [])
  return t
}

const WATCHER_BASE = 7843
const WATCHER_KEY  = 'sf26_mystery_watchers'
const FOUNDER_KEY  = 'sf26_mystery_founders'

function getWatchers() {
  try {
    const s = JSON.parse(localStorage.getItem(WATCHER_KEY) || '{}')
    if (s.date === new Date().toISOString().slice(0, 10)) return s.count
  } catch {}
  const c = WATCHER_BASE + Math.floor(Math.random() * 400)
  localStorage.setItem(WATCHER_KEY, JSON.stringify({ date: new Date().toISOString().slice(0, 10), count: c }))
  return c
}

function getFounderCount() {
  try {
    const s = JSON.parse(localStorage.getItem(FOUNDER_KEY) || '{}')
    if (s.date === new Date().toISOString().slice(0, 10)) return s.count
  } catch {}
  const c = 47 + Math.floor(Math.random() * 28)
  localStorage.setItem(FOUNDER_KEY, JSON.stringify({ date: new Date().toISOString().slice(0, 10), count: c }))
  return c
}

export default function MysteryDrop() {
  const [hovered,       setHovered]       = useState(false)
  const [watchers,      setWatchers]      = useState(WATCHER_BASE)
  const [unlockedClues, setUnlockedClues] = useState([0])
  const [newClue,       setNewClue]       = useState(null)
  const [elapsedMs,     setElapsedMs]     = useState(0)
  const [founderGate,   setFounderGate]   = useState(false)
  const [founderCount,  setFounderCount]  = useState(0)
  const [newClueToast,  setNewClueToast]  = useState(null)
  const countdown    = useCountdown()
  const peekedRef    = useRef(false)
  const startRef     = useRef(Date.now())
  const watcherRef   = useRef(null)
  const clueRef      = useRef(null)
  const elapsedRef   = useRef(null)

  const pad = n => String(n).padStart(2, '0')

  useEffect(() => {
    setWatchers(getWatchers())
    setFounderCount(getFounderCount())

    watcherRef.current = setInterval(() => {
      setWatchers(w => {
        const delta = Math.floor(Math.random() * 3) - 1
        return Math.max(WATCHER_BASE - 50, w + delta)
      })
    }, 3000 + Math.random() * 4000)

    elapsedRef.current = setInterval(() => {
      const ms = Date.now() - startRef.current
      setElapsedMs(ms)

      const unlocked = CLUES.reduce((acc, clue, idx) => {
        if (ms >= clue.delay) acc.push(idx)
        return acc
      }, [])

      setUnlockedClues(prev => {
        const added = unlocked.filter(i => !prev.includes(i))
        if (added.length > 0) {
          const latestIdx = added[added.length - 1]
          setNewClue(latestIdx)
          setNewClueToast(CLUES[latestIdx].text.slice(0, 40) + '…')
          setTimeout(() => setNewClue(null), 5000)
          setTimeout(() => setNewClueToast(null), 4500)
        }
        return unlocked
      })
    }, 1000)

    return () => {
      clearInterval(watcherRef.current)
      clearInterval(elapsedRef.current)
    }
  }, [])

  function peek() {
    setHovered(true)
    if (!peekedRef.current) {
      peekedRef.current = true
      addXP(XP_VALUES.miniPeek, 'Mystery Drop Peek', 'mystery-peek')
    }
  }

  const nextClueIdx   = CLUES.findIndex((_, i) => !unlockedClues.includes(i))
  const nextClueDelay = nextClueIdx >= 0 ? CLUES[nextClueIdx].delay - elapsedMs : null

  return (
    <section id="mystery" style={{
      background: B.black, padding: '80px 20px',
      textAlign: 'center', position: 'relative', overflow: 'hidden',
    }}>
      <GrainOverlay /><ScanLines />
      <Egg id="egg-055" corner="top-right" />
      <Egg id="egg-056" corner="bottom-left" />

      <style>{`
        @keyframes glowPulse { 0%,100%{opacity:0.35} 50%{opacity:0.75} }
        @keyframes clueSlide { 0%{transform:translateX(-12px);opacity:0} 100%{transform:translateX(0);opacity:1} }
        @keyframes watcherPop { 0%{transform:scale(1)} 50%{transform:scale(1.15)} 100%{transform:scale(1)} }
        @keyframes founderBadge { 0%{opacity:0;transform:scale(0.8)} 100%{opacity:1;transform:scale(1)} }
        @keyframes intelToast {
          0%  { opacity:0; transform:translateY(-12px); }
          15% { opacity:1; transform:translateY(0); }
          80% { opacity:1; }
          100%{ opacity:0; }
        }
        @keyframes scarPulse {
          0%,100%{ box-shadow: 0 0 6px ${B.neonMagenta}40; }
          50%    { box-shadow: 0 0 20px ${B.neonMagenta}80; }
        }
      `}</style>

      {/* New intel toast */}
      {newClueToast && (
        <div style={{
          position: 'fixed', top: 80, left: '50%', transform: 'translateX(-50%)',
          zIndex: 9800, background: 'rgba(10,10,15,0.97)',
          border: `1px solid ${B.neonMagenta}60`, borderRadius: 10,
          padding: '10px 20px',
          display: 'flex', alignItems: 'center', gap: 10,
          animation: 'intelToast 4.5s ease forwards',
          pointerEvents: 'none', maxWidth: '90vw',
        }}>
          <span style={{ fontSize: 14 }}>🔓</span>
          <span style={{ fontFamily: "'Space Mono'", fontSize: 9, color: B.neonMagenta, letterSpacing: 2 }}>
            NEW INTEL UNLOCKED
          </span>
          <span style={{ fontFamily: "'Syne'", fontSize: 11, color: B.white }}>
            {newClueToast}
          </span>
        </div>
      )}

      {/* Ambient glow */}
      <div style={{
        position: 'absolute', top: '50%', left: '50%',
        transform: 'translate(-50%,-50%)',
        width: 500, height: 500, borderRadius: '50%',
        background: `radial-gradient(circle, ${B.neonMagenta}18 0%, transparent 70%)`,
        filter: 'blur(50px)', pointerEvents: 'none',
        animation: 'glowPulse 4s ease-in-out infinite',
      }} />

      <div style={{ maxWidth: 680, margin: '0 auto', position: 'relative', zIndex: 2 }}>
        <SectionTag color={B.neonMagenta}>MYSTERY DROP</SectionTag>

        {/* Live watchers badge */}
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 8,
          background: 'rgba(255,45,123,0.1)', border: `1px solid ${B.neonMagenta}35`,
          borderRadius: 20, padding: '6px 14px', marginBottom: 16,
        }}>
          <div style={{ width: 7, height: 7, borderRadius: '50%', background: B.neonMagenta, boxShadow: `0 0 8px ${B.neonMagenta}`, animation: 'glowPulse 1.5s ease-in-out infinite' }} />
          <span style={{ fontFamily: "'Space Mono'", fontSize: '0.65rem', color: B.neonMagenta, letterSpacing: 2, fontWeight: 700 }}>
            {watchers.toLocaleString()} WATCHING NOW
          </span>
        </div>

        <h2 className="reveal-3d text-3d" style={{
          fontFamily: "'Bebas Neue'", fontSize: 'clamp(2.5rem,7vw,5rem)',
          color: B.white, letterSpacing: '0.05em', marginBottom: 8,
        }}>SOMETHING DROPS DEC 12</h2>
        <p style={{ color: B.smoke, fontFamily: "'Space Mono'", fontSize: '0.78rem', marginBottom: 40, lineHeight: 1.8 }}>
          A limited collaboration. A silhouette you've never seen.<br />
          <strong style={{ color: B.neonMagenta }}>Revealed only at the event. No online release.</strong>
        </p>

        {/* Shoe silhouette */}
        <div
          onMouseEnter={peek}
          onMouseLeave={() => setHovered(false)}
          onTouchStart={() => { setHovered(h => !h); peek() }}
          style={{ cursor: 'pointer', marginBottom: 16, position: 'relative', display: 'inline-block' }}
        >
          <svg viewBox="0 0 420 210" width="380" style={{
            maxWidth: '100%',
            filter: hovered
              ? 'blur(6px) brightness(0.45) saturate(0)'
              : 'blur(20px) brightness(0.15) saturate(0)',
            transition: 'filter 1.4s cubic-bezier(0.22,1,0.36,1)',
            transform: hovered ? 'scale(1.06)' : 'scale(1)',
          }}>
            <path d="M 65 158 L 58 132 Q 52 110 74 94 L 138 72 Q 188 56 248 58 Q 318 58 346 78 L 362 100 Q 372 124 366 148 L 362 158 Z" fill={B.white} />
            <rect x="48" y="155" width="318" height="28" rx="9" fill={B.white} />
            <path d="M 178 72 Q 194 56 216 57 L 222 60 L 221 88 Q 212 94 196 93 Z" fill={B.smoke} />
            <path d="M 268 132 Q 312 110 342 122 Q 318 140 272 145 Z" fill={B.smoke} />
          </svg>

          {!hovered && (
            <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 8 }}>
              <div style={{ fontFamily: "'Orbitron'", fontSize: '0.65rem', letterSpacing: '0.3em', color: B.neonMagenta }}>HOVER TO PEEK</div>
            </div>
          )}
          {hovered && (
            <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <div style={{ fontFamily: "'Orbitron'", fontSize: '0.65rem', letterSpacing: '0.25em', color: B.neonMagenta }}>STILL A MYSTERY</div>
            </div>
          )}
        </div>

        {/* Scarcity bar — urgent styling */}
        <div style={{ marginBottom: 32, padding: '12px 0' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
            <span style={{ fontFamily: "'Space Mono'", fontSize: '0.6rem', color: B.smoke, letterSpacing: 2 }}>PAIRS REMAINING</span>
            <span style={{ fontFamily: "'Orbitron'", fontSize: '0.6rem', color: B.neonMagenta, fontWeight: 700 }}>{'< 300 WORLDWIDE'}</span>
          </div>
          <div style={{ height: 4, background: B.charcoal, borderRadius: 2, overflow: 'hidden' }}>
            <div style={{
              height: '100%', width: '23%',
              background: `linear-gradient(90deg, ${B.neonMagenta}, ${B.amber})`,
              borderRadius: 2,
              animation: 'scarPulse 2s ease-in-out infinite',
            }} />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6 }}>
            <span style={{ fontFamily: "'Space Mono'", fontSize: '0.58rem', color: B.neonMagenta, letterSpacing: 1, fontWeight: 700 }}>
              77% ALREADY SPOKEN FOR
            </span>
            <span style={{ fontFamily: "'Space Mono'", fontSize: '0.55rem', color: '#444', letterSpacing: 1 }}>
              ONLY {23}% AVAILABLE
            </span>
          </div>
        </div>

        {/* Countdown */}
        <div style={{ marginBottom: 40 }}>
          <p style={{ color: B.smoke, fontFamily: "'Space Mono'", fontSize: '0.65rem', letterSpacing: '0.2em', marginBottom: 16 }}>REVEALS IN</p>
          <div style={{ display: 'flex', gap: 20, justifyContent: 'center', flexWrap: 'wrap' }}>
            {[['days', countdown.days], ['hours', countdown.hours], ['mins', countdown.minutes], ['secs', countdown.seconds]].map(([label, val]) => (
              <div key={label} style={{ textAlign: 'center', minWidth: 60 }}>
                <div style={{
                  fontFamily: "'Orbitron'", fontSize: 'clamp(2rem,6vw,3rem)', fontWeight: 700,
                  color: B.neonMagenta, lineHeight: 1, textShadow: `0 0 20px ${B.neonMagenta}80`,
                }}>{pad(val)}</div>
                <div style={{ fontFamily: "'Space Mono'", fontSize: '0.6rem', color: B.smoke, letterSpacing: '0.2em', marginTop: 4 }}>{label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Progressive clue system */}
        <div style={{ textAlign: 'left', marginBottom: 32 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
            <div style={{ fontFamily: "'Space Mono'", fontSize: '0.65rem', color: '#444', letterSpacing: 3 }}>
              INTEL DROPS — {unlockedClues.length}/{CLUES.length} UNLOCKED
            </div>
            {nextClueDelay !== null && nextClueDelay > 0 && (
              <div style={{ fontFamily: "'Space Mono'", fontSize: '0.55rem', color: '#333', letterSpacing: 2 }}>
                NEXT IN {Math.ceil(nextClueDelay / 1000)}s
              </div>
            )}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {CLUES.map((clue, i) => {
              const unlocked = unlockedClues.includes(i)
              const isNew    = newClue === i
              return (
                <div key={i} style={{
                  display: 'flex', alignItems: 'flex-start', gap: 12,
                  padding: '12px 16px',
                  background: unlocked ? `rgba(255,45,123,0.06)` : 'rgba(255,255,255,0.02)',
                  border: `1px solid ${unlocked ? B.neonMagenta + '30' : 'rgba(255,255,255,0.04)'}`,
                  borderLeft: `3px solid ${unlocked ? B.neonMagenta : '#1a1a1a'}`,
                  borderRadius: 8,
                  transition: 'all 0.5s ease',
                  animation: isNew ? 'clueSlide 0.5s ease' : 'none',
                }}>
                  <span style={{ fontSize: 16, flexShrink: 0, opacity: unlocked ? 1 : 0.15 }}>{clue.icon}</span>
                  <div>
                    {unlocked ? (
                      <div style={{ fontFamily: "'Syne'", fontSize: '0.85rem', color: B.white, lineHeight: 1.5 }}>
                        {clue.text}
                        {isNew && <span style={{ marginLeft: 8, fontFamily: "'Space Mono'", fontSize: '0.55rem', color: B.neonMagenta, letterSpacing: 2, animation: 'glowPulse 1s ease-in-out 3' }}>NEW</span>}
                      </div>
                    ) : (
                      <div style={{ fontFamily: "'Space Mono'", fontSize: '0.7rem', color: '#333', letterSpacing: 2 }}>
                        {'▓'.repeat(Math.floor(clue.text.length * 0.5))} [CLASSIFIED]
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
          {unlockedClues.length < CLUES.length && (
            <p style={{ fontFamily: "'Space Mono'", fontSize: '0.6rem', color: '#333', letterSpacing: 2, marginTop: 12, textAlign: 'center' }}>
              STAY ON THIS PAGE — MORE INTEL UNLOCKS OVER TIME
            </p>
          )}
        </div>

        {/* Founding Member gate — with founder count */}
        <div className="card-3d" style={{
          padding: '20px 24px',
          background: `linear-gradient(135deg, ${B.amber}10 0%, ${B.amber}05 100%)`,
          border: `1px solid ${B.amber}30`, borderRadius: 12, marginBottom: 24,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 10 }}>
            <span style={{ fontSize: 20 }}>👑</span>
            <div style={{ fontFamily: "'Bebas Neue'", fontSize: '1.1rem', color: B.amber, letterSpacing: 3 }}>FOUNDING MEMBERS ONLY</div>
          </div>
          <p style={{ fontFamily: "'Space Mono'", fontSize: '0.65rem', color: B.smoke, lineHeight: 1.7, marginBottom: 10 }}>
            Founding Members receive early access intel 48 hours before general announcement. If you're not on the list, you're behind.
          </p>
          {founderCount > 0 && (
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              background: `rgba(245,166,35,0.1)`, border: `1px solid ${B.amber}30`,
              borderRadius: 20, padding: '4px 12px', marginBottom: 14,
            }}>
              <div style={{ width: 5, height: 5, borderRadius: '50%', background: B.neonLime, boxShadow: `0 0 6px ${B.neonLime}` }} />
              <span style={{ fontFamily: "'Space Mono'", fontSize: '0.58rem', color: B.amber, letterSpacing: 1 }}>
                <strong>{founderCount}</strong> founding members joined today
              </span>
            </div>
          )}
          <div style={{ display: 'block' }}>
            <button
              onClick={() => { setFounderGate(true); document.getElementById('waitlist')?.scrollIntoView({ behavior: 'smooth' }) }}
              style={{
                background: `linear-gradient(135deg, ${B.amber} 0%, #e8960f 100%)`,
                color: B.black, border: 'none', padding: '10px 28px',
                fontFamily: "'Bebas Neue'", fontSize: '1rem', letterSpacing: '0.15em',
                cursor: 'pointer', borderRadius: 4,
                boxShadow: `0 0 20px ${B.amber}40`,
              }}
            >SECURE YOUR STATUS →</button>
          </div>
        </div>

        <p style={{ color: '#555', fontFamily: "'Space Mono'", fontSize: '0.65rem', letterSpacing: '0.1em' }}>
          Every hour that passes is a pair you won't get. Be there or miss history.
        </p>
      </div>
    </section>
  )
}
