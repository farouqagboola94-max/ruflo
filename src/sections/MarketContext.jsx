import { useEffect, useRef, useState } from 'react'
import { B } from '../tokens'
import { GrainOverlay, SectionTag } from '../components/Shared'

const PROOF_POINTS = [
  {
    event: 'STREET SOUK',
    type: 'Lagos Streetwear Convention',
    color: B.neonCyan,
    data: [
      { year: '2018', n: '1,500', label: 'ATTENDEES AT LAUNCH' },
      { year: '2023', n: '10,000', label: 'ATTENDEES FIVE YEARS IN' },
    ],
    note: 'Sneakers play a supporting role. Not the lead.'
  },
  {
    event: 'OUR HOMECOMING',
    type: 'Lagos Culture Festival',
    color: B.neonMagenta,
    data: [
      { year: '2026', n: 'NIKE', label: 'AIR MAX PLUS COLLAB SECURED' },
    ],
    note: 'Brand validation for Lagos culture events. Sneakers adjacent.'
  },
]

const MARKET_STATS = [
  { stat: '70%+', label: 'OF NIGERIA UNDER 30', sub: 'One of Africa\'s largest young consumer markets' },
  { stat: '#1', label: 'SNEAKER MARKET IN WEST AFRICA', sub: 'Lagos is the epicentre' },
  { stat: 'ZERO', label: 'DEDICATED SNEAKER FESTIVALS', sub: 'Until now' },
]

function AnimatedStat({ stat, label, sub, color, delay = 0 }) {
  const ref = useRef(null)
  const [vis, setVis] = useState(false)
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVis(true) }, { threshold: 0.4 })
    if (ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [])
  return (
    <div ref={ref} style={{ textAlign: 'center', opacity: vis ? 1 : 0, transform: vis ? 'translateY(0)' : 'translateY(20px)', transition: `opacity 0.6s ${delay}s, transform 0.6s ${delay}s` }}>
      <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 'clamp(48px, 7vw, 72px)', color: color || B.amber, lineHeight: 1, textShadow: `0 0 30px ${(color || B.amber)}40` }}>{stat}</div>
      <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 8, color: B.white, letterSpacing: '0.18em', marginTop: 4, marginBottom: 4 }}>{label}</div>
      <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 11, color: B.smoke }}>{sub}</div>
    </div>
  )
}

export default function MarketContext() {
  return (
    <section id="market" style={{ position: 'relative', overflow: 'hidden', background: B.void, padding: '100px 24px' }}>
      <GrainOverlay />
      <div style={{ position: 'absolute', top: '20%', right: '-8%', width: 500, height: 400, background: `radial-gradient(ellipse, ${B.neonCyan}07 0%, transparent 70%)`, filter: 'blur(80px)', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', bottom: '20%', left: '-5%', width: 400, height: 400, background: `radial-gradient(ellipse, ${B.amber}07 0%, transparent 70%)`, filter: 'blur(80px)', pointerEvents: 'none' }} />

      <div style={{ position: 'relative', zIndex: 10, maxWidth: 1100, margin: '0 auto' }}>

        {/* Header */}
        <div style={{ maxWidth: 720, marginBottom: 64 }}>
          <SectionTag label="THE MARKET" />
          <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 'clamp(42px, 7vw, 80px)', color: B.white, lineHeight: 0.88, marginBottom: 24 }}>
            WHY HASN'T LAGOS<br />
            <span style={{ color: B.amber }}>DONE THIS BEFORE?</span>
          </div>
          <div style={{ width: 60, height: 2, background: `linear-gradient(90deg, ${B.amber}, transparent)`, marginBottom: 20 }} />
          <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 15, color: B.smoke, lineHeight: 1.85, maxWidth: 600 }}>
            The Lagos sneaker economy is real. Limited releases sell out in minutes. Resale markets thrive.
            The community has been proven by adjacent events for years. Every major Lagos culture event touches sneakers.
            None of them lead with it.
          </div>
        </div>

        {/* Market stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 2, marginBottom: 72, background: `${B.gunmetal}`, border: `1px solid ${B.gunmetal}`, borderRadius: 8, overflow: 'hidden' }}>
          {MARKET_STATS.map((s, i) => (
            <div key={i} style={{ padding: '36px 28px', background: B.black, borderRight: i < MARKET_STATS.length - 1 ? `1px solid ${B.gunmetal}` : 'none' }}>
              <AnimatedStat
                stat={s.stat}
                label={s.label}
                sub={s.sub}
                color={i === 0 ? B.neonCyan : i === 1 ? B.amber : B.neonMagenta}
                delay={i * 0.15}
              />
            </div>
          ))}
        </div>

        {/* Proof points */}
        <div style={{ marginBottom: 64 }}>
          <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 8, color: B.smoke, letterSpacing: '0.3em', marginBottom: 28 }}>THE EVENTS THAT PROVED THE DEMAND</div>
          <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap' }}>
            {PROOF_POINTS.map((p, pi) => (
              <div key={pi} style={{ flex: '1 1 300px', padding: '28px 24px', background: B.charcoal, border: `1px solid ${B.gunmetal}`, borderRadius: 8, position: 'relative', overflow: 'hidden', transition: 'border-color 0.3s' }}
                onMouseEnter={e => e.currentTarget.style.borderColor = p.color + '60'}
                onMouseLeave={e => e.currentTarget.style.borderColor = B.gunmetal}
              >
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg, ${p.color}, transparent)` }} />
                <div style={{ fontFamily: "'Orbitron', monospace", fontWeight: 900, fontSize: 13, color: p.color, letterSpacing: '0.1em', marginBottom: 4 }}>{p.event}</div>
                <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 8, color: B.smoke, letterSpacing: '0.15em', marginBottom: 20 }}>{p.type}</div>
                <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 16 }}>
                  {p.data.map((d, di) => (
                    <div key={di} style={{ padding: '12px 16px', background: `${p.color}10`, border: `1px solid ${p.color}25`, borderRadius: 6 }}>
                      <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 7, color: p.color, letterSpacing: '0.2em', marginBottom: 4 }}>{d.year}</div>
                      <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 24, color: B.white, lineHeight: 1, marginBottom: 2 }}>{d.n}</div>
                      <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 6, color: B.smoke, letterSpacing: '0.1em' }}>{d.label}</div>
                    </div>
                  ))}
                </div>
                <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 12, color: B.smoke, fontStyle: 'italic' }}>{p.note}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Gap statement */}
        <div style={{ padding: '40px 44px', background: `linear-gradient(135deg, ${B.amber}10, ${B.neonCyan}06)`, border: `1px solid ${B.amber}30`, borderRadius: 10, position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: `linear-gradient(90deg, ${B.amber}, ${B.neonCyan}, transparent)` }} />
          <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 'clamp(22px, 3.5vw, 36px)', color: B.white, lineHeight: 1.1, marginBottom: 16 }}>
            EVERY LAGOS EVENT TOUCHES SNEAKERS.<br />
            <span style={{ color: B.amber }}>NONE OF THEM LEAD WITH IT.</span>
          </div>
          <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 14, color: B.smoke, lineHeight: 1.8, maxWidth: 640, marginBottom: 24 }}>
            Street Souk is a streetwear convention. Our Homecoming is a culture festival. Both have sneakers as a category within a broader programme.
            Sneakers Fest is the first Lagos event where sneaker culture is the architecture — not the supporting act.
          </div>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <a href="#about" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '11px 24px', background: B.amber, color: B.black, fontFamily: "'Space Mono', monospace", fontSize: 9, fontWeight: 700, letterSpacing: '0.18em', textDecoration: 'none', borderRadius: 4 }}>OUR MISSION →</a>
            <a href="#fnp" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '11px 24px', border: `1px solid ${B.neonCyan}50`, color: B.neonCyan, fontFamily: "'Space Mono', monospace", fontSize: 9, letterSpacing: '0.18em', textDecoration: 'none', borderRadius: 4 }}>FRIDAY PROTOCOL →</a>
          </div>
        </div>

      </div>
    </section>
  )
}
