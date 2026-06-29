import { useState, useEffect } from 'react'
import { B } from '../tokens'
import { GrainOverlay, ScanLines } from '../components/Shared'
import Egg from '../components/Egg'
import BackgroundSnake from '../components/BackgroundSnake'

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
  <div style={{ textAlign: 'center' }}>
    <div style={{
      width: 88, height: 100,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'linear-gradient(135deg, rgba(255,255,255,0.09) 0%, rgba(255,255,255,0.03) 100%)',
      backdropFilter: 'blur(28px) saturate(200%)',
      WebkitBackdropFilter: 'blur(28px) saturate(200%)',
      border: '1px solid rgba(255,255,255,0.10)',
      borderRadius: 10, position: 'relative', overflow: 'hidden',
      boxShadow: [
        '0 8px 40px rgba(0,0,0,0.65)',
        'inset 0 1px 0 rgba(255,255,255,0.16)',
        'inset 0 -1px 0 rgba(0,0,0,0.3)',
        'inset 0 0 30px rgba(245,166,35,0.04)',
      ].join(','),
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

export default function Hero() {
  const time = useCountdown(EVENT_DATE)
  const [h1, setH1] = useState(false)
  const [h2, setH2] = useState(false)

  return (
    <section id="hero" style={{
      minHeight: '100vh', position: 'relative', overflow: 'hidden',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      padding: '120px 24px 80px',
      background: [
        `radial-gradient(ellipse 120% 60% at 50% -5%, ${B.amber}07 0%, transparent 55%)`,
        `radial-gradient(ellipse 80% 60% at 82% 40%, ${B.amber}09 0%, transparent 52%)`,
        `radial-gradient(ellipse 60% 70% at 14% 72%, ${B.neonCyan}07 0%, transparent 55%)`,
        `radial-gradient(ellipse 50% 50% at 50% 50%, rgba(8,5,25,0.45) 0%, transparent 70%)`,
        `linear-gradient(180deg, #04040A 0%, ${B.void} 45%, ${B.black} 100%)`,
      ].join(','),
    }}>
      <BackgroundSnake />
      <GrainOverlay />
      <ScanLines opacity={0.04} />
      <Egg id="egg-001" corner="top-right" />
      <Egg id="egg-002" corner="bottom-left" />

      {/* Atmospheric orbs */}
      <div style={{ position:'absolute', top:'-12%', left:'50%', transform:'translateX(-50%)', width:900, height:550, background:`radial-gradient(ellipse, ${B.amber}09 0%, transparent 65%)`, filter:'blur(70px)', pointerEvents:'none' }} />
      <div style={{ position:'absolute', top:'22%', right:'-6%', width:420, height:420, background:`radial-gradient(circle, ${B.amber}0D 0%, transparent 60%)`, filter:'blur(45px)', pointerEvents:'none' }} />
      <div style={{ position:'absolute', bottom:'18%', left:'-6%', width:370, height:370, background:`radial-gradient(circle, ${B.neonCyan}0B 0%, transparent 60%)`, filter:'blur(55px)', pointerEvents:'none' }} />
      <div style={{ position:'absolute', bottom:'-4%', right:'22%', width:280, height:280, background:`radial-gradient(circle, ${B.neonMagenta}08 0%, transparent 60%)`, filter:'blur(40px)', pointerEvents:'none' }} />

      {/* Subtle grid */}
      <div style={{ position:'absolute', inset:0, opacity:0.018, backgroundImage:`linear-gradient(${B.neonCyan} 1px,transparent 1px),linear-gradient(90deg,${B.neonCyan} 1px,transparent 1px)`, backgroundSize:'80px 80px', pointerEvents:'none' }} />

      {/* Diagonal light streaks */}
      <div style={{ position:'absolute', top:'-8%', left:'-4%', width:'68%', height:1, background:`linear-gradient(90deg,transparent,${B.neonCyan}45,${B.neonMagenta}28,transparent)`, transform:'rotate(-18deg)', filter:'blur(1px)', pointerEvents:'none' }} />
      <div style={{ position:'absolute', top:'28%', right:'-4%', width:'42%', height:1, background:`linear-gradient(90deg,transparent,${B.amber}38,transparent)`, transform:'rotate(-7deg)', pointerEvents:'none' }} />
      <div style={{ position:'absolute', bottom:'18%', left:'12%', width:'48%', height:1, background:`linear-gradient(90deg,transparent,${B.neonCyan}28,transparent)`, transform:'rotate(4deg)', pointerEvents:'none' }} />

      {/* All 4 corner marks */}
      <div style={{ position:'absolute', top:80, left:24, width:40, height:40, borderTop:`1.5px solid ${B.neonCyan}38`, borderLeft:`1.5px solid ${B.neonCyan}38`, pointerEvents:'none' }} />
      <div style={{ position:'absolute', top:80, right:24, width:40, height:40, borderTop:`1.5px solid ${B.neonCyan}38`, borderRight:`1.5px solid ${B.neonCyan}38`, pointerEvents:'none' }} />
      <div style={{ position:'absolute', bottom:80, left:24, width:40, height:40, borderBottom:`1.5px solid ${B.neonCyan}38`, borderLeft:`1.5px solid ${B.neonCyan}38`, pointerEvents:'none' }} />
      <div style={{ position:'absolute', bottom:80, right:24, width:40, height:40, borderBottom:`1.5px solid ${B.neonCyan}38`, borderRight:`1.5px solid ${B.neonCyan}38`, pointerEvents:'none' }} />

      {/* Left side editorial text */}
      <div style={{
        position:'absolute', left:18, top:'50%',
        transform:'translateX(-50%) rotate(-90deg)',
        fontFamily:"'Space Mono', monospace", fontSize:7,
        letterSpacing:'0.42em', color:B.smoke, opacity:0.35,
        whiteSpace:'nowrap', pointerEvents:'none',
      }}>
        WEST AFRICA’S PREMIER SNEAKER CULTURE EVENT
      </div>

      {/* Right side editorial text */}
      <div style={{
        position:'absolute', right:18, top:'50%',
        transform:'translateX(50%) rotate(90deg)',
        fontFamily:"'Space Mono', monospace", fontSize:7,
        letterSpacing:'0.42em', color:B.smoke, opacity:0.35,
        whiteSpace:'nowrap', pointerEvents:'none',
      }}>
        LAGOS · DECEMBER 12 · 2026 · SF26
      </div>

      {/* Main content */}
      <div style={{
        position:'relative', zIndex:10, textAlign:'center', maxWidth:980,
        animation:'fadeUp 0.9s ease both',
      }}>
        {/* Live badge */}
        <div style={{
          display:'inline-flex', alignItems:'center', gap:8, marginBottom:32,
          padding:'6px 18px',
          background:'rgba(255,255,255,0.04)',
          backdropFilter:'blur(14px)', WebkitBackdropFilter:'blur(14px)',
          border:`1px solid ${B.neonCyan}32`, borderRadius:100,
        }}>
          <div style={{ width:5, height:5, borderRadius:'50%', background:B.neonLime, animation:'pulse 2s infinite', boxShadow:`0 0 8px ${B.neonLime}` }} />
          <span style={{ fontFamily:"'Space Mono', monospace", fontSize:8, color:B.neonCyan, letterSpacing:'0.45em' }}>
            DECEMBER 12 · LAGOS, NIGERIA
          </span>
        </div>

        {/* SNEAKERS — metallic shimmer gradient text */}
        <div style={{
          fontFamily:"'Bebas Neue', sans-serif",
          fontSize:'clamp(78px, 16vw, 164px)',
          lineHeight:0.85, letterSpacing:'0.02em',
          background:`linear-gradient(135deg, ${B.white} 0%, ${B.amberGlow} 22%, ${B.white} 42%, ${B.amber} 62%, ${B.white} 100%)`,
          backgroundSize:'220% auto',
          WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent',
          backgroundClip:'text',
          animation:'shimmer 6s linear infinite',
          filter:`drop-shadow(0 0 80px ${B.amber}14)`,
        }}>
          SNEAKERS
        </div>

        {/* FEST '26 — amber fire glow */}
        <div style={{
          fontFamily:"'Orbitron', monospace", fontWeight:900,
          fontSize:'clamp(56px, 11.5vw, 120px)',
          color:B.amber, lineHeight:1, letterSpacing:'0.08em',
          textShadow:[
            `0 0 20px ${B.amber}90`,
            `0 0 60px ${B.amber}50`,
            `0 0 120px ${B.amber}20`,
            `0 2px 0 rgba(0,0,0,0.8)`,
          ].join(','),
        }}>
          FEST '26
        </div>

        {/* Divider */}
        <div style={{ width:'100%', height:1, margin:'26px 0', background:`linear-gradient(90deg,transparent,${B.neonCyan}70,${B.amber}50,transparent)` }} />

        {/* Sub-label */}
        <div style={{ fontFamily:"'Space Mono', monospace", fontSize:'clamp(8px,1.1vw,12px)', color:B.smoke, letterSpacing:'0.6em', marginBottom:10, textTransform:'uppercase' }}>
          The Sole Exhibition
        </div>

        {/* Description */}
        <div style={{
          fontFamily:"'Inter', 'Syne', sans-serif",
          fontSize:'clamp(13px,1.6vw,17px)',
          color:'rgba(240,237,230,0.6)', lineHeight:1.75,
          maxWidth:520, margin:'0 auto 50px',
          fontWeight:300,
        }}>
          Rare kicks · 30–50 curated vendors · Live DJs · Custom art · Street food<br />
          <span style={{ color:B.amber, fontWeight:500 }}>
            West Africa’s first dedicated sneaker culture festival.
          </span>
        </div>

        {/* Countdown */}
        <div style={{ marginBottom:50 }}>
          <div style={{ fontFamily:"'Space Mono', monospace", fontSize:8, color:B.neonMagenta, letterSpacing:'0.45em', marginBottom:22, textShadow:`0 0 12px ${B.neonMagenta}55` }}>
            EVENT DROPS IN
          </div>
          <div style={{ display:'flex', gap:12, justifyContent:'center', alignItems:'flex-start' }}>
            <CountBox value={time.days}    label="DAYS" />
            <div style={{ fontFamily:"'Orbitron', monospace", fontSize:30, color:B.amber, opacity:0.32, marginTop:28 }}>:</div>
            <CountBox value={time.hours}   label="HRS" />
            <div style={{ fontFamily:"'Orbitron', monospace", fontSize:30, color:B.amber, opacity:0.32, marginTop:28 }}>:</div>
            <CountBox value={time.minutes} label="MIN" />
            <div style={{ fontFamily:"'Orbitron', monospace", fontSize:30, color:B.amber, opacity:0.32, marginTop:28 }}>:</div>
            <CountBox value={time.seconds} label="SEC" />
          </div>
          <div style={{ fontFamily:"'Space Mono', monospace", fontSize:8, color:B.smoke, marginTop:18, letterSpacing:'0.25em' }}>
            DECEMBER 12, 2026 — DOORS OPEN 12:00 PM
          </div>
        </div>

        {/* CTAs with hover lift */}
        <div style={{ display:'flex', gap:14, justifyContent:'center', flexWrap:'wrap' }}>
          <a
            href="#tickets"
            onMouseEnter={() => setH1(true)}
            onMouseLeave={() => setH1(false)}
            style={{
              padding:'16px 46px',
              background:`linear-gradient(135deg, ${B.amber} 0%, ${B.amberGlow} 50%, ${B.amber} 100%)`,
              backgroundSize:'220% auto',
              animation: h1 ? 'shimmer 1.5s linear infinite' : 'none',
              color:B.black,
              fontFamily:"'Space Mono', monospace", fontSize:10, fontWeight:700,
              letterSpacing:'0.2em', textDecoration:'none', borderRadius:4,
              display:'inline-block',
              transform: h1 ? 'scale(1.05) translateY(-2px)' : 'scale(1)',
              boxShadow: h1
                ? `0 0 60px ${B.amber}55, 0 8px 32px rgba(0,0,0,0.55)`
                : `0 0 40px ${B.amber}35, 0 4px 20px rgba(0,0,0,0.45)`,
              transition:'transform 0.22s ease, box-shadow 0.22s ease, background-position 0.22s',
            }}
          >
            GET YOUR TICKET →
          </a>
          <a
            href="#lineup"
            onMouseEnter={() => setH2(true)}
            onMouseLeave={() => setH2(false)}
            style={{
              padding:'16px 46px',
              background: h2 ? 'rgba(255,255,255,0.09)' : 'rgba(255,255,255,0.05)',
              backdropFilter:'blur(14px)', WebkitBackdropFilter:'blur(14px)',
              color:B.white,
              fontFamily:"'Space Mono', monospace", fontSize:10,
              letterSpacing:'0.2em', textDecoration:'none', borderRadius:4,
              border:`1px solid ${h2 ? 'rgba(255,255,255,0.28)' : 'rgba(255,255,255,0.14)'}`,
              display:'inline-block',
              transform: h2 ? 'scale(1.05) translateY(-2px)' : 'scale(1)',
              boxShadow: h2
                ? 'inset 0 1px 0 rgba(255,255,255,0.18), 0 8px 28px rgba(0,0,0,0.45)'
                : 'inset 0 1px 0 rgba(255,255,255,0.1), 0 4px 16px rgba(0,0,0,0.35)',
              transition:'all 0.22s ease',
            }}
          >
            EXPLORE LINEUP
          </a>
        </div>
      </div>

      {/* Scroll indicator */}
      <div style={{
        position:'absolute', bottom:32, left:'50%', transform:'translateX(-50%)',
        display:'flex', flexDirection:'column', alignItems:'center', gap:8,
        animation:'pulse 2.5s infinite',
      }}>
        <div style={{ fontFamily:"'Space Mono', monospace", fontSize:7, color:B.smoke, letterSpacing:'0.4em' }}>SCROLL</div>
        <div style={{ width:1, height:40, background:`linear-gradient(${B.amber}, transparent)` }} />
      </div>
    </section>
  )
}
