import { useState, useEffect } from 'react'
import { B } from '../tokens'
import { GrainOverlay, SectionTag } from '../components/Shared'
import Egg from '../components/Egg'

const READER_KEY  = 'sf26_review_readers'
const HELPFUL_KEY = 'sf26_review_helpful'
const SEEDS       = [34, 21, 47, 29]

const QUOTES = [
  {
    quote: "The best sneaker event I've ever attended on the continent. The energy was electric from doors open to close. Already counting down to '26.",
    name: 'CHIOMA A.', role: 'Collector · Lagos Island', accent: B.amber, stars: 5,
  },
  {
    quote: "Got a grail I'd been hunting for two years at the vendor floor. Didn't expect to find a clean pair at all. Sneakers Fest delivered.",
    name: 'EMEKA O.', role: 'Reseller · Abuja', accent: B.neonCyan, stars: 5,
  },
  {
    quote: "The custom art section was next level. Walked in with plain AF1s, walked out with a one-of-one piece. The artist was insane.",
    name: 'TUNDE B.', role: 'Sneakerhead · Port Harcourt', accent: B.neonMagenta, stars: 5,
  },
  {
    quote: "DJ Spinall closed the night perfectly. The community that shows up to this event — Lagos at its finest. Nothing else like it.",
    name: 'ADAEZE N.', role: 'Content Creator · Lekki', accent: B.neonLime, stars: 5,
  },
]

export default function Testimonials() {
  const [readers,  setReaders]  = useState(23)
  const [spotlight, setSpot]    = useState(0)
  const [helpful,  setHelpful]  = useState(SEEDS.slice())
  const [voted,    setVoted]    = useState(new Set())

  useEffect(() => {
    try {
      const s = JSON.parse(localStorage.getItem(READER_KEY) || 'null')
      const today = new Date().toISOString().slice(0, 10)
      if (s?.date === today) {
        setReaders(s.count)
      } else {
        const v = 16 + Math.floor(Math.random() * 26)
        localStorage.setItem(READER_KEY, JSON.stringify({ date: today, count: v }))
        setReaders(v)
      }
      const saved = JSON.parse(localStorage.getItem(HELPFUL_KEY) || 'null')
      if (Array.isArray(saved) && saved.length === QUOTES.length) setHelpful(saved)
    } catch {}

    const rId = setInterval(() => {
      setReaders(r => Math.max(10, Math.min(60, r + (Math.random() > 0.5 ? 1 : -1))))
    }, 5800)
    const sId = setInterval(() => {
      setSpot(s => (s + 1) % QUOTES.length)
    }, 4500)

    return () => { clearInterval(rId); clearInterval(sId) }
  }, [])

  function vote(i) {
    if (voted.has(i)) return
    setVoted(prev => new Set([...prev, i]))
    setHelpful(prev => {
      const next = [...prev]
      next[i] += 1
      try { localStorage.setItem(HELPFUL_KEY, JSON.stringify(next)) } catch {}
      return next
    })
  }

  return (
    <section id="testimonials" style={{ position: 'relative', overflow: 'hidden', background: B.void, padding: '100px 24px' }}>
      <style>{`@keyframes dotPulse { 0%,100%{ opacity:1 } 50%{ opacity:0.45 } }`}</style>
      <GrainOverlay />
      <Egg id="egg-021" corner="top-right" />
      <Egg id="egg-022" corner="bottom-left" />
      <div style={{ position: 'absolute', top: '30%', right: '-5%', width: 350, height: 350, background: `radial-gradient(circle, ${B.amber}08 0%, transparent 70%)`, filter: 'blur(70px)', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', bottom: '20%', left: '-5%', width: 300, height: 300, background: `radial-gradient(circle, ${B.neonCyan}07 0%, transparent 70%)`, filter: 'blur(70px)', pointerEvents: 'none' }} />

      <div style={{ position: 'relative', zIndex: 10, maxWidth: 1100, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 60 }}>
          <SectionTag>COMMUNITY VOICES</SectionTag>
          <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 'clamp(40px, 6vw, 68px)', color: B.white, lineHeight: 0.9 }}>
            THEY WERE<br /><span style={{ color: B.amber }}>THERE</span>
          </div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 7, marginTop: 20, padding: '6px 14px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 20 }}>
            <div style={{ width: 6, height: 6, borderRadius: '50%', background: B.neonLime, boxShadow: `0 0 6px ${B.neonLime}`, animation: 'dotPulse 2s ease-in-out infinite' }} />
            <span style={{ fontFamily: 'Space Mono,monospace', fontSize: 9, color: B.smoke, letterSpacing: 1 }}>{readers} people reading reviews right now</span>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20 }}>
          {QUOTES.map((q, i) => {
            const isSpot = spotlight === i
            return (
              <div
                key={i}
                style={{
                  padding: 28,
                  background: isSpot ? 'rgba(255,255,255,0.07)' : 'rgba(255,255,255,0.04)',
                  backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)',
                  border: `1px solid ${isSpot ? q.accent + '55' : 'rgba(255,255,255,0.08)'}`,
                  borderRadius: 14, position: 'relative', overflow: 'hidden',
                  boxShadow: isSpot ? `0 0 28px ${q.accent}14, 0 16px 48px rgba(0,0,0,0.4)` : 'none',
                  transition: 'all 0.5s ease',
                }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = q.accent + '50'; e.currentTarget.style.background = 'rgba(255,255,255,0.07)'; e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = `0 16px 48px rgba(0,0,0,0.4), 0 0 0 1px ${q.accent}18` }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = isSpot ? q.accent + '55' : 'rgba(255,255,255,0.08)'; e.currentTarget.style.background = isSpot ? 'rgba(255,255,255,0.07)' : 'rgba(255,255,255,0.04)'; e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = isSpot ? `0 0 28px ${q.accent}14` : 'none' }}
              >
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 1, background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent)' }} />
                <div style={{ position: 'absolute', top: 0, left: 0, bottom: 0, width: 3, background: `linear-gradient(${q.accent}, ${q.accent}30)`, borderRadius: '14px 0 0 14px' }} />

                {/* Stars */}
                <div style={{ display: 'flex', gap: 2, marginBottom: 10, marginLeft: 8 }}>
                  {Array.from({ length: q.stars }).map((_, si) => (
                    <span key={si} style={{ color: B.amber, fontSize: 12, textShadow: `0 0 8px ${B.amber}60` }}>★</span>
                  ))}
                </div>

                <div style={{ fontFamily: "'Orbitron', monospace", fontSize: 52, color: q.accent, opacity: 0.12, lineHeight: 0.8, marginBottom: 12, marginLeft: 8 }}>&quot;</div>

                <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 14, color: B.white, lineHeight: 1.75, marginBottom: 20, marginLeft: 8 }}>
                  {q.quote}
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginLeft: 8 }}>
                  <div style={{ width: 38, height: 38, borderRadius: '50%', background: q.accent + '20', border: `1.5px solid ${q.accent}50`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <span style={{ fontFamily: "'Orbitron', monospace", fontSize: 11, fontWeight: 900, color: q.accent }}>{q.name[0]}</span>
                  </div>
                  <div>
                    <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 9, color: q.accent, letterSpacing: '0.12em', fontWeight: 700 }}>{q.name}</div>
                    <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 11, color: B.smoke }}>{q.role}</div>
                  </div>
                  <div style={{ marginLeft: 'auto', padding: '3px 8px', background: q.accent + '12', border: `1px solid ${q.accent}30`, borderRadius: 20 }}>
                    <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 7, color: q.accent, letterSpacing: '0.1em' }}>VERIFIED</span>
                  </div>
                </div>

                {/* Helpful vote */}
                <div style={{ marginTop: 16, marginLeft: 8, paddingTop: 12, borderTop: '1px solid rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', gap: 8 }}>
                  <button
                    onClick={() => vote(i)}
                    disabled={voted.has(i)}
                    style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '4px 11px', background: voted.has(i) ? `${q.accent}15` : 'rgba(255,255,255,0.04)', border: `1px solid ${voted.has(i) ? q.accent + '40' : 'rgba(255,255,255,0.08)'}`, borderRadius: 12, cursor: voted.has(i) ? 'default' : 'pointer', transition: 'all 0.2s' }}
                    onMouseEnter={e => { if (!voted.has(i)) e.currentTarget.style.borderColor = q.accent + '40' }}
                    onMouseLeave={e => { if (!voted.has(i)) e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)' }}
                  >
                    <span style={{ fontSize: 11 }}>{voted.has(i) ? '✓' : '👍'}</span>
                    <span style={{ fontFamily: 'Space Mono,monospace', fontSize: 8, color: voted.has(i) ? q.accent : B.smoke, letterSpacing: 1 }}>{helpful[i]} helpful</span>
                  </button>
                </div>
              </div>
            )
          })}
        </div>

        <div style={{ marginTop: 44, textAlign: 'center' }}>
          <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 14, color: B.smoke, lineHeight: 1.7 }}>
            Building toward 5,000+ community members by the time the doors open December 12.
          </div>
          <a href="#waitlist" style={{ display: 'inline-block', marginTop: 16, padding: '11px 28px', border: `1px solid ${B.amber}50`, color: B.amber, fontFamily: "'Space Mono', monospace", fontSize: 9, letterSpacing: '0.2em', textDecoration: 'none', borderRadius: 4, transition: 'all 0.25s' }}
            onMouseEnter={e => { e.currentTarget.style.background = B.amber + '15'; e.currentTarget.style.borderColor = B.amber }}
            onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = B.amber + '50' }}
          >GET EARLY ACCESS →</a>
        </div>
      </div>
    </section>
  )
}
