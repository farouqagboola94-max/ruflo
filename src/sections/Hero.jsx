import { useState, useEffect, useRef } from 'react'
import { B } from '../tokens'
import { GrainOverlay, ScanLines } from '../components/Shared'
import Egg from '../components/Egg'
import LagosNoirCanvas from '../components/LagosNoirCanvas'

const EVENT_DATE = new Date('2026-12-12T12:00:00')

function useCountdown(target) {
  const [time, setTime] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 })
  useEffect(() => {
    const update = () => {
      const diff = target - Date.now()
      if (diff <= 0) { setTime({ days: 0, hours: 0, minutes: 0, seconds: 0 }); return }
      setTime({
        days:    Math.floor(diff / 86400000),
        hours:   Math.floor((diff % 86400000) / 3600000),
        minutes: Math.floor((diff % 3600000)  / 60000),
        seconds: Math.floor((diff % 60000)    / 1000),
      })
    }
    update()
    const id = setInterval(update, 1000)
    return () => clearInterval(id)
  }, [target])
  return time
}

const CountBox = ({ value, label }) => (
  <div className="card-3d" style={{ textAlign: 'center' }}>
    <div className="glass-noir" style={{
      width: 88, height: 100,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      borderRadius: 10, position: 'relative', overflow: 'hidden',
    }}>
      <div style={{ position:'absolute', top:0, left:0, right:0, height:1, background:'linear-gradient(90deg,transparent,rgba(255,255,255,0.45),transparent)' }} />
      <div style={{ position:'absolute', top:'50%', left:0, right:0, height:1, background:'rgba(0,0,0,0.5)' }} />
      <div style={{ position:'absolute', top:0, left:0, right:0, height:'50%', background:'rgba(255,255,255,0.04)' }} />
      <span style={{
        fontFamily: "'Orbitron', monospace", fontSize: 40, fontWeight: 900,
        color: B.amber,
        textShadow: `0 0 20px ${B.amber}90, 0 0 60px ${B.amber}35`,
        position: 'relative', zIndex: 1, letterSpacing: '-0.02em',
      }}>
        {String(value).padStart(2, '0')}
      </span>
    </div>
    <div style={{
      fontFamily: "'Space Mono', monospace", fontSize: 7,
      color: B.smoke, marginTop: 10, letterSpacing: '0.42em',
    }}>{label}</div>
  </div>
)

const PRICE_TIERS = [
  { t: 'GENERAL', p: '₦5,000',  c: B.neonCyan    },
  { t: 'VIP',     p: '₦10,000', c: B.amber        },
  { t: 'VVIP',    p: '₦25,000', c: B.neonMagenta  },
  { t: 'PHALANX', p: '₦50,000', c: B.neonLime     },
]

// Rotating strip under the CTAs. This used to cycle eight invented people
// "just securing" tickets - names, cities and tiers that were never real
// purchases. These are facts about the festival that we can stand behind.
const HERO_FACTS = [
  { text: 'Muri Okunola Park, Victoria Island',  color: B.neonCyan    },
  { text: '12:00 to 22:00 - ten hours',           color: B.amber       },
  { text: '30+ vendors on the floor',             color: B.neonLime    },
  { text: 'Four tiers, from 5,000 naira',         color: B.neonMagenta },
]

export default function Hero() {
  const time = useCountdown(EVENT_DATE)
  const [h1, setH1] = useState(false)
  const [h2, setH2] = useState(false)
  const [hoveredTier, setHoveredTier] = useState(null)
  const [factIdx, setFactIdx] = useState(0)
  const [factVisible, setFactVisible] = useState(true)
  const [tilt, setTilt] = useState({ rx: 0, ry: 0 })
  const sectionRef = useRef(null)

  useEffect(() => {
    const id = setInterval(() => {
      setFactVisible(false)
      setTimeout(() => { setFactIdx(i => (i + 1) % HERO_FACTS.length); setFactVisible(true) }, 350)
    }, 4800)
    return () => clearInterval(id)
  }, [])

  const handleMouseMove = (e) => {
    const el = sectionRef.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const dx = (e.clientX - (rect.left + rect.width / 2))  / (rect.width  / 2)
    const dy = (e.clientY - (rect.top  + rect.height / 2)) / (rect.height / 2)
    setTilt({ rx: -dy * 3.5, ry: dx * 4 })
  }
  const handleMouseLeave = () => setTilt({ rx: 0, ry: 0 })

  const fact = HERO_FACTS[factIdx]

  return (
    <section
      id="hero"
      ref={sectionRef}
      className="tilt-scene"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        minHeight: '100vh', position: 'relative', overflow: 'hidden',
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        padding: '120px 24px 80px',
        background: `linear-gradient(180deg, #04040A 0%, ${B.noirBlue} 45%, ${B.wetConcrete} 100%)`,
      }}
    >
      {/* Animated Lagos noir backdrop — rain, bokeh, skyline */}
      <LagosNoirCanvas />

      {/* Atmospheric colour grading overlay */}
      <div style={{
        position:'absolute', inset:0, zIndex:2, pointerEvents:'none',
        background:[
          `radial-gradient(ellipse 120% 60% at 50% -5%, ${B.lagosOcher}0A 0%, transparent 55%)`,
          `radial-gradient(ellipse 80% 60% at 82% 40%, ${B.amber}08 0%, transparent 52%)`,
          `radial-gradient(ellipse 60% 70% at 14% 72%, ${B.neonCyan}06 0%, transparent 55%)`,
          `linear-gradient(0deg, rgba(8,6,4,0.88) 0%, rgba(13,27,42,0.4) 50%, rgba(4,4,10,0.72) 100%)`,
        ].join(','),
      }} />

      <GrainOverlay />
      <ScanLines opacity={0.04} />
      <Egg id="egg-001" corner="top-right" />
      <Egg id="egg-002" corner="bottom-left" />

      <style>{`
        @keyframes buyerSlide {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes viewerBlink {
          0%,100% { opacity: 1; }
          50%     { opacity: 0.5; }
        }
        @keyframes ctaPulse {
          0%,100% { box-shadow: 0 0 40px ${B.amber}35, 0 4px 20px rgba(0,0,0,0.45); }
          50%     { box-shadow: 0 0 70px ${B.amber}70, 0 4px 20px rgba(0,0,0,0.45); }
        }
      `}</style>

      {/* Subtle perspective grid */}
      <div style={{ position:'absolute', inset:0, zIndex:2, opacity:0.014, pointerEvents:'none',
        backgroundImage:`linear-gradient(${B.neonCyan} 1px,transparent 1px),linear-gradient(90deg,${B.neonCyan} 1px,transparent 1px)`,
        backgroundSize:'80px 80px' }} />

      {/* UI corner marks */}
      <div style={{ position:'absolute', top:80,    left:24,  zIndex:3, width:40, height:40, borderTop:`1.5px solid ${B.neonCyan}38`,    borderLeft:`1.5px solid ${B.neonCyan}38`,   pointerEvents:'none' }} />
      <div style={{ position:'absolute', top:80,    right:24, zIndex:3, width:40, height:40, borderTop:`1.5px solid ${B.neonCyan}38`,    borderRight:`1.5px solid ${B.neonCyan}38`,  pointerEvents:'none' }} />
      <div style={{ position:'absolute', bottom:80, left:24,  zIndex:3, width:40, height:40, borderBottom:`1.5px solid ${B.neonCyan}38`, borderLeft:`1.5px solid ${B.neonCyan}38`,   pointerEvents:'none' }} />
      <div style={{ position:'absolute', bottom:80, right:24, zIndex:3, width:40, height:40, borderBottom:`1.5px solid ${B.neonCyan}38`, borderRight:`1.5px solid ${B.neonCyan}38`,  pointerEvents:'none' }} />

      {/* Vertical editorial labels */}
      <div style={{ position:'absolute', left:18, top:'50%', zIndex:3, transform:'translateX(-50%) rotate(-90deg)', fontFamily:"'Space Mono',monospace", fontSize:7, letterSpacing:'0.42em', color:B.smoke, opacity:0.32, whiteSpace:'nowrap', pointerEvents:'none' }}>
        WEST AFRICA'S PREMIER SNEAKER CULTURE EVENT
      </div>
      <div style={{ position:'absolute', right:18, top:'50%', zIndex:3, transform:'translateX(50%) rotate(90deg)', fontFamily:"'Space Mono',monospace", fontSize:7, letterSpacing:'0.42em', color:B.smoke, opacity:0.32, whiteSpace:'nowrap', pointerEvents:'none' }}>
        LAGOS · DECEMBER 12 · 2026 · SF26
      </div>

      {/* ── 3D tilt content card ─────────────────────────── */}
      <div
        className="tilt-card"
        style={{
          position:'relative', zIndex:10, textAlign:'center', maxWidth:980,
          '--rx': `${tilt.rx}deg`,
          '--ry': `${tilt.ry}deg`,
        }}
      >
        {/* Live badge row */}
        <div className="reveal-3d delay-1" style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:16, marginBottom:32, flexWrap:'wrap' }}>
          <div style={{ display:'inline-flex', alignItems:'center', gap:8, padding:'6px 18px', background:'rgba(255,255,255,0.04)', backdropFilter:'blur(14px)', WebkitBackdropFilter:'blur(14px)', border:`1px solid ${B.neonCyan}32`, borderRadius:100 }}>
            <div style={{ width:5, height:5, borderRadius:'50%', background:B.neonLime, animation:'pulse 2s infinite', boxShadow:`0 0 8px ${B.neonLime}` }} />
            <span style={{ fontFamily:"'Space Mono',monospace", fontSize:8, color:B.neonCyan, letterSpacing:'0.45em' }}>DECEMBER 12 · LAGOS, NIGERIA</span>
          </div>
          <div style={{ display:'inline-flex', alignItems:'center', gap:6, padding:'6px 14px', background:'rgba(255,255,255,0.04)', backdropFilter:'blur(14px)', WebkitBackdropFilter:'blur(14px)', border:`1px solid ${B.amber}28`, borderRadius:100 }}>
            <div style={{ width:5, height:5, borderRadius:'50%', background:B.amber, animation:'viewerBlink 1.8s ease-in-out infinite', boxShadow:`0 0 6px ${B.amber}` }} />
            <span style={{ fontFamily:"'Space Mono',monospace", fontSize:8, color:B.amber, letterSpacing:'0.3em' }}>
              {time.days > 0 ? `${time.days} DAYS TO GO` : 'HAPPENING TODAY'}
            </span>
          </div>
        </div>

        {/* SNEAKERS — extruded 3D shimmer */}
        <div
          className="text-3d reveal-3d delay-2"
          style={{
            fontFamily:"'Bebas Neue',sans-serif",
            fontSize:'clamp(78px,16vw,164px)',
            lineHeight:0.85, letterSpacing:'0.02em',
            background:`linear-gradient(135deg,${B.white} 0%,${B.amberGlow} 22%,${B.white} 42%,${B.lagosOcher} 62%,${B.danfoYellow} 80%,${B.white} 100%)`,
            backgroundSize:'220% auto',
            WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text',
            animation:'shimmer 6s linear infinite',
          }}
        >
          SNEAKERS
        </div>

        {/* FEST '26 */}
        <div className="reveal-3d delay-3" style={{
          fontFamily:"'Orbitron',monospace", fontWeight:900,
          fontSize:'clamp(56px,11.5vw,120px)',
          color:B.amber, lineHeight:1, letterSpacing:'0.08em',
          textShadow:`0 0 20px ${B.amber}90,0 0 60px ${B.amber}50,0 0 120px ${B.amber}20,0 2px 0 rgba(0,0,0,0.8)`,
        }}>
          FEST '26
        </div>

        {/* Lagos noir divider */}
        <div className="lagos-divider reveal-3d delay-3" style={{ margin:'26px 0' }} />

        <div className="reveal-3d delay-3" style={{ fontFamily:"'Space Mono',monospace", fontSize:'clamp(8px,1.1vw,12px)', color:B.smoke, letterSpacing:'0.6em', marginBottom:10, textTransform:'uppercase' }}>
          The Sole Exhibition
        </div>

        <div className="reveal-3d delay-4" style={{ fontFamily:"'Inter','Syne',sans-serif", fontSize:'clamp(13px,1.6vw,17px)', color:'rgba(240,237,230,0.6)', lineHeight:1.75, maxWidth:520, margin:'0 auto 50px', fontWeight:300 }}>
          Rare kicks · 30+ confirmed vendors · Live sets · Custom art · Street food<br />
          <span style={{ color:B.amber, fontWeight:500 }}>West Africa's first dedicated sneaker culture festival.</span>
        </div>

        {/* Countdown — floating in 3D space */}
        <div className="float-3d reveal-3d delay-4" style={{ marginBottom:50 }}>
          <div style={{ fontFamily:"'Space Mono',monospace", fontSize:8, color:B.neonMagenta, letterSpacing:'0.45em', marginBottom:22, textShadow:`0 0 12px ${B.neonMagenta}55` }}>
            EVENT DROPS IN
          </div>
          <div style={{ display:'flex', gap:12, justifyContent:'center', alignItems:'flex-start' }}>
            <CountBox value={time.days}    label="DAYS" />
            <div style={{ fontFamily:"'Orbitron',monospace", fontSize:30, color:B.amber, opacity:0.32, marginTop:28 }}>:</div>
            <CountBox value={time.hours}   label="HRS"  />
            <div style={{ fontFamily:"'Orbitron',monospace", fontSize:30, color:B.amber, opacity:0.32, marginTop:28 }}>:</div>
            <CountBox value={time.minutes} label="MIN"  />
            <div style={{ fontFamily:"'Orbitron',monospace", fontSize:30, color:B.amber, opacity:0.32, marginTop:28 }}>:</div>
            <CountBox value={time.seconds} label="SEC"  />
          </div>
          <div style={{ fontFamily:"'Space Mono',monospace", fontSize:8, color:B.smoke, marginTop:18, letterSpacing:'0.25em' }}>
            DECEMBER 12, 2026 — DOORS OPEN 12:00 PM
          </div>
        </div>

        {/* CTAs */}
        <div className="reveal-3d delay-5" style={{ display:'flex', gap:14, justifyContent:'center', flexWrap:'wrap' }}>
          <a
            href="#tickets"
            onMouseEnter={() => setH1(true)}
            onMouseLeave={() => setH1(false)}
            style={{
              padding:'16px 46px',
              background:`linear-gradient(135deg,${B.amber} 0%,${B.amberGlow} 50%,${B.amber} 100%)`,
              backgroundSize:'220% auto',
              animation: h1 ? 'shimmer 1.5s linear infinite' : 'ctaPulse 2.5s ease-in-out infinite',
              color:B.black, fontFamily:"'Space Mono',monospace", fontSize:10, fontWeight:700,
              letterSpacing:'0.2em', textDecoration:'none', borderRadius:4, display:'inline-block',
              transform: h1 ? 'scale(1.05) translateY(-2px)' : 'scale(1)',
              boxShadow: h1 ? `0 0 60px ${B.amber}55,0 8px 32px rgba(0,0,0,0.55)` : `0 0 40px ${B.amber}35,0 4px 20px rgba(0,0,0,0.45)`,
              transition:'transform 0.22s ease,box-shadow 0.22s ease',
            }}
          >
            GET YOUR TICKET →
          </a>
          <a
            href="#vendors"
            onMouseEnter={() => setH2(true)}
            onMouseLeave={() => setH2(false)}
            style={{
              padding:'16px 46px',
              background: h2 ? 'rgba(255,255,255,0.09)' : 'rgba(255,255,255,0.05)',
              backdropFilter:'blur(14px)', WebkitBackdropFilter:'blur(14px)',
              color:B.white, fontFamily:"'Space Mono',monospace", fontSize:10,
              letterSpacing:'0.2em', textDecoration:'none', borderRadius:4, display:'inline-block',
              border:`1px solid ${h2 ? 'rgba(255,255,255,0.28)' : 'rgba(255,255,255,0.14)'}`,
              transform: h2 ? 'scale(1.05) translateY(-2px)' : 'scale(1)',
              boxShadow: h2 ? 'inset 0 1px 0 rgba(255,255,255,0.18),0 8px 28px rgba(0,0,0,0.45)' : 'inset 0 1px 0 rgba(255,255,255,0.1),0 4px 16px rgba(0,0,0,0.35)',
              transition:'all 0.22s ease',
            }}
          >
            VENDOR INFO
          </a>
        </div>

        {/* WhatsApp community micro-CTA */}
        <div className="reveal-3d delay-5" style={{ marginTop:14, display:'flex', justifyContent:'center' }}>
          <a
            href="#community"
            style={{
              display:'inline-flex', alignItems:'center', gap:8,
              padding:'7px 18px', borderRadius:100,
              background:`${B.neonLime}10`,
              border:`1px solid ${B.neonLime}30`,
              textDecoration:'none', transition:'all .2s',
            }}
            onMouseEnter={e => { e.currentTarget.style.background=`${B.neonLime}18`; e.currentTarget.style.borderColor=`${B.neonLime}55` }}
            onMouseLeave={e => { e.currentTarget.style.background=`${B.neonLime}10`; e.currentTarget.style.borderColor=`${B.neonLime}30` }}
          >
            <div style={{ width:6, height:6, borderRadius:'50%', background:B.neonLime, boxShadow:`0 0 6px ${B.neonLime}` }} />
            <span style={{ fontFamily:"'Space Mono',monospace", fontSize:8, color:B.neonLime, letterSpacing:'0.2em' }}>JOIN THE WHATSAPP INNER CIRCLE</span>
          </a>
        </div>

        {/* Rotating festival facts */}
        <div style={{ marginTop:20, height:28, display:'flex', alignItems:'center', justifyContent:'center' }}>
          {factVisible && (
            <div style={{ display:'inline-flex', alignItems:'center', gap:8, animation:'buyerSlide 0.35s ease' }}>
              <div style={{ width:5, height:5, borderRadius:'50%', background:fact.color, boxShadow:`0 0 6px ${fact.color}`, flexShrink:0 }} />
              <span style={{ fontFamily:"'Space Mono',monospace", fontSize:8, color:fact.color, letterSpacing:'0.12em' }}>
                {fact.text}
              </span>
            </div>
          )}
        </div>

        {/* Ticket price anchor pills */}
        <div style={{ display:'flex', gap:8, justifyContent:'center', flexWrap:'wrap', marginTop:10 }}>
          {PRICE_TIERS.map(({ t, p, c }) => (
            <a
              key={t}
              href="#tickets"
              onMouseEnter={() => setHoveredTier(t)}
              onMouseLeave={() => setHoveredTier(null)}
              style={{
                display:'inline-flex', alignItems:'center', gap:6,
                padding:'5px 13px', borderRadius:100,
                background: hoveredTier === t ? `${c}18` : 'rgba(255,255,255,0.04)',
                border:`1px solid ${hoveredTier === t ? c + '60' : 'rgba(255,255,255,0.10)'}`,
                textDecoration:'none',
                transform: hoveredTier === t ? 'translateY(-2px) scale(1.06)' : 'none',
                boxShadow: hoveredTier === t ? `0 0 18px ${c}30` : 'none',
                transition:'background 0.18s,border-color 0.18s,transform 0.18s,box-shadow 0.18s',
              }}
            >
              <span style={{ fontFamily:'Space Mono,monospace', fontSize:7.5, color:'#666', letterSpacing:'0.12em' }}>{t}</span>
              <span style={{ fontFamily:'Space Mono,monospace', fontSize:8, fontWeight:700, color: hoveredTier === t ? c : '#888', letterSpacing:'0.08em', transition:'color 0.18s' }}>{p}</span>
            </a>
          ))}
        </div>

        <div style={{ marginTop:14, fontFamily:"'Space Mono',monospace", fontSize:8, letterSpacing:'0.1em' }}>
          <span style={{ color:B.neonLime }}>⚡ Only 12 PHALANX slots remain</span>
          <span style={{ color:'#555' }}> · Prices increase December 1</span>
        </div>
      </div>

      {/* Scroll indicator */}
      <div style={{ position:'absolute', bottom:32, left:'50%', transform:'translateX(-50%)', zIndex:10, display:'flex', flexDirection:'column', alignItems:'center', gap:8, animation:'pulse 2.5s infinite' }}>
        <div style={{ fontFamily:"'Space Mono',monospace", fontSize:7, color:B.smoke, letterSpacing:'0.4em' }}>SCROLL</div>
        <div style={{ width:1, height:40, background:`linear-gradient(${B.amber},transparent)` }} />
      </div>
    </section>
  )
}
