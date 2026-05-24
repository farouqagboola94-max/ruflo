import { useState, useEffect } from 'react'
import { B } from '../tokens'
import { GrainOverlay, ScanLines, SectionTag } from '../components/Shared'

const EVENT = new Date('2026-12-12T12:00:00')

function useCountdown() {
  const [t, setT] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 })
  useEffect(() => {
    function tick() {
      const diff = EVENT - Date.now()
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
  }, [])
  return t
}

export default function MysteryDrop() {
  const [hovered, setHovered] = useState(false)
  const countdown = useCountdown()

  const pad = n => String(n).padStart(2, '0')

  return (
    <section id="mystery" style={{
      background: B.black,
      padding: '80px 20px',
      textAlign: 'center',
      position: 'relative',
      overflow: 'hidden',
    }}>
      <GrainOverlay /><ScanLines />

      {/* Ambient glow */}
      <div style={{
        position: 'absolute', top: '50%', left: '50%',
        transform: 'translate(-50%,-50%)',
        width: 400, height: 400, borderRadius: '50%',
        background: `radial-gradient(circle, ${B.neonMagenta}18 0%, transparent 70%)`,
        filter: 'blur(40px)', pointerEvents: 'none',
        opacity: hovered ? 1 : 0.4, transition: 'opacity 1s ease',
      }} />

      <div style={{ maxWidth: 640, margin: '0 auto', position: 'relative', zIndex: 2 }}>
        <SectionTag color={B.neonMagenta}>MYSTERY DROP</SectionTag>
        <h2 style={{
          fontFamily: "'Bebas Neue'", fontSize: 'clamp(2.5rem,7vw,5rem)',
          color: B.white, letterSpacing: '0.05em', marginBottom: 8,
        }}>
          SOMETHING DROPS DEC 12
        </h2>
        <p style={{ color: B.smoke, fontFamily: "'Space Mono'", fontSize: '0.78rem', marginBottom: 48 }}>
          A limited collaboration. A silhouette you've never seen. Revealed only at the event.
        </p>

        {/* Blurred shoe silhouette */}
        <div
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          onTouchStart={() => setHovered(h => !h)}
          style={{ cursor: 'pointer', marginBottom: 48, position: 'relative', display: 'inline-block' }}
        >
          <svg
            viewBox="0 0 420 210"
            width="380"
            style={{
              maxWidth: '100%',
              filter: hovered
                ? 'blur(6px) brightness(0.5) saturate(0)'
                : 'blur(18px) brightness(0.2) saturate(0)',
              transition: 'filter 1.2s cubic-bezier(0.22,1,0.36,1)',
              transform: hovered ? 'scale(1.04)' : 'scale(1)',
            }}
          >
            <path d="M 65 158 L 58 132 Q 52 110 74 94 L 138 72 Q 188 56 248 58 Q 318 58 346 78 L 362 100 Q 372 124 366 148 L 362 158 Z" fill={B.white} />
            <rect x="48" y="155" width="318" height="28" rx="9" fill={B.white} />
            <path d="M 178 72 Q 194 56 216 57 L 222 60 L 221 88 Q 212 94 196 93 Z" fill={B.smoke} />
            <path d="M 268 132 Q 312 110 342 122 Q 318 140 272 145 Z" fill={B.smoke} />
          </svg>

          {!hovered && (
            <div style={{
              position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexDirection: 'column', gap: 8,
            }}>
              <div style={{ fontFamily: "'Orbitron'", fontSize: '0.65rem', letterSpacing: '0.3em', color: B.neonMagenta }}>HOVER TO PEEK</div>
            </div>
          )}
          {hovered && (
            <div style={{
              position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <div style={{ fontFamily: "'Orbitron'", fontSize: '0.65rem', letterSpacing: '0.25em', color: B.neonMagenta }}>STILL A MYSTERY</div>
            </div>
          )}
        </div>

        {/* Countdown */}
        <div style={{ marginBottom: 40 }}>
          <p style={{ color: B.smoke, fontFamily: "'Space Mono'", fontSize: '0.65rem', letterSpacing: '0.2em', marginBottom: 16 }}>REVEALS IN</p>
          <div style={{ display: 'flex', gap: 20, justifyContent: 'center', flexWrap: 'wrap' }}>
            {[['days', countdown.days], ['hours', countdown.hours], ['mins', countdown.minutes], ['secs', countdown.seconds]].map(([label, val]) => (
              <div key={label} style={{ textAlign: 'center' }}>
                <div style={{
                  fontFamily: "'Orbitron'", fontSize: 'clamp(2rem,6vw,3rem)', fontWeight: 700,
                  color: B.neonMagenta, lineHeight: 1,
                  textShadow: `0 0 20px ${B.neonMagenta}80`,
                }}>{pad(val)}</div>
                <div style={{ fontFamily: "'Space Mono'", fontSize: '0.6rem', color: B.smoke, letterSpacing: '0.2em', marginTop: 4 }}>{label}</div>
              </div>
            ))}
          </div>
        </div>

        <p style={{ color: B.smoke, fontFamily: "'Space Mono'", fontSize: '0.68rem', letterSpacing: '0.1em' }}>
          Be there or miss history
        </p>
      </div>
    </section>
  )
}
