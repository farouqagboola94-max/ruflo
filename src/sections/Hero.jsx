import { useState, useEffect } from 'react'
import { B } from '../tokens'
import { GrainOverlay, ScanLines, AmberGlow } from '../components/Shared'

const EVENT_DATE = new Date('2026-07-18T12:00:00')

function useCountdown(target) {
  const [time, setTime] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 })
  useEffect(() => {
    const update = () => {
      const diff = target - Date.now()
      if (diff <= 0) { setTime({ days: 0, hours: 0, minutes: 0, seconds: 0 }); return }
      setTime({
        days: Math.floor(diff / 86400000),
        hours: Math.floor((diff % 86400000) / 3600000),
        minutes: Math.floor((diff % 3600000) / 60000),
        seconds: Math.floor((diff % 60000) / 1000),
      })
    }
    update()
    const id = setInterval(update, 1000)
    return () => clearInterval(id)
  }, [target])
  return time
}

const CountBox = ({ value, label }) => (
  <div style={{ textAlign: "center" }}>
    <div style={{
      width: 72, height: 84, display: "flex", alignItems: "center", justifyContent: "center",
      background: B.charcoal, border: `1px solid ${B.amber}30`, borderRadius: 4,
      position: "relative", overflow: "hidden",
    }}>
      <div style={{
        position: "absolute", top: 0, left: 0, right: 0, height: "50%",
        background: "rgba(255,255,255,0.02)", borderBottom: `1px solid ${B.gunmetal}`,
      }} />
      <span style={{
        fontFamily: "'Orbitron', monospace", fontSize: 34, fontWeight: 900, color: B.amber,
        textShadow: `0 0 15px ${B.amber}50`, position: "relative", zIndex: 1,
      }}>
        {String(value).padStart(2, '0')}
      </span>
    </div>
    <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 7, color: B.smoke, marginTop: 8, letterSpacing: "0.3em" }}>
      {label}
    </div>
  </div>
)

export default function Hero() {
  const time = useCountdown(EVENT_DATE)

  return (
    <section style={{
      minHeight: "100vh", position: "relative", overflow: "hidden",
      background: `linear-gradient(180deg, ${B.void} 0%, ${B.black} 60%, ${B.charcoal}30 100%)`,
      display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
      padding: "100px 24px 80px",
    }}>
      <GrainOverlay />
      <ScanLines opacity={0.05} />
      <AmberGlow top="20%" left="75%" size={450} />
      <AmberGlow top="70%" left="15%" size={300} />

      {/* Subtle grid */}
      <div style={{
        position: "absolute", inset: 0, opacity: 0.025,
        backgroundImage: `linear-gradient(${B.amber} 1px, transparent 1px), linear-gradient(90deg, ${B.amber} 1px, transparent 1px)`,
        backgroundSize: "60px 60px",
      }} />

      {/* Diagonal neon streak */}
      <div style={{
        position: "absolute", top: "-5%", left: "-5%", width: "65%", height: 1,
        background: `linear-gradient(90deg, transparent, ${B.neonCyan}50, transparent)`,
        transform: "rotate(-18deg)", filter: "blur(1px)",
      }} />

      {/* Corner brackets */}
      <div style={{ position: "absolute", top: 80, left: 24, width: 44, height: 44, borderTop: `2px solid ${B.neonCyan}40`, borderLeft: `2px solid ${B.neonCyan}40` }} />
      <div style={{ position: "absolute", top: 80, right: 24, width: 44, height: 44, borderTop: `2px solid ${B.neonCyan}40`, borderRight: `2px solid ${B.neonCyan}40` }} />

      <div style={{ position: "relative", zIndex: 10, textAlign: "center", maxWidth: 900, animation: "fadeUp 0.8s ease both" }}>
        {/* Location pill */}
        <div style={{
          display: "inline-flex", alignItems: "center", gap: 8, marginBottom: 28,
          padding: "5px 16px", border: `1px solid ${B.neonCyan}40`, borderRadius: 2,
        }}>
          <div style={{ width: 5, height: 5, borderRadius: "50%", background: B.neonLime, animation: "pulse 2s infinite" }} />
          <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 8, color: B.neonCyan, letterSpacing: "0.4em" }}>
            LAGOS, NIGERIA — EKO ATLANTIC
          </span>
        </div>

        {/* Hero title */}
        <div style={{
          fontFamily: "'Bebas Neue', sans-serif",
          fontSize: "clamp(72px, 15vw, 150px)",
          color: B.white, lineHeight: 0.85, letterSpacing: "0.02em",
          animation: "flicker 10s infinite",
        }}>
          SNEAKERS
        </div>
        <div style={{
          fontFamily: "'Orbitron', monospace", fontWeight: 900,
          fontSize: "clamp(54px, 11vw, 116px)",
          color: B.amber, lineHeight: 1, letterSpacing: "0.08em",
          textShadow: `0 0 40px ${B.amber}50, 0 0 100px ${B.amber}20`,
        }}>
          FEST '26
        </div>

        <div style={{
          width: "100%", height: 1, margin: "22px 0",
          background: `linear-gradient(90deg, transparent, ${B.neonCyan}80, transparent)`,
        }} />

        <div style={{ fontFamily: "'Space Mono', monospace", fontSize: "clamp(9px, 1.2vw, 13px)", color: B.smoke, letterSpacing: "0.55em", marginBottom: 10 }}>
          THE SOLE EXHIBITION
        </div>
        <div style={{
          fontFamily: "'Syne', sans-serif", fontSize: "clamp(14px, 1.8vw, 18px)",
          color: B.white, lineHeight: 1.65, maxWidth: 540, margin: "0 auto 44px",
        }}>
          200+ rare kicks. 50+ vendors. Live DJs. Custom art. Street food.<br />
          <span style={{ color: B.amber }}>Lagos has never seen anything like this.</span>
        </div>

        {/* Countdown */}
        <div style={{ marginBottom: 44 }}>
          <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 8, color: B.neonMagenta, letterSpacing: "0.45em", marginBottom: 18 }}>
            DROPS IN
          </div>
          <div style={{ display: "flex", gap: 10, justifyContent: "center", alignItems: "flex-start" }}>
            <CountBox value={time.days} label="DAYS" />
            <div style={{ fontFamily: "'Orbitron', monospace", fontSize: 30, color: B.amber, opacity: 0.5, marginTop: 18 }}>:</div>
            <CountBox value={time.hours} label="HRS" />
            <div style={{ fontFamily: "'Orbitron', monospace", fontSize: 30, color: B.amber, opacity: 0.5, marginTop: 18 }}>:</div>
            <CountBox value={time.minutes} label="MIN" />
            <div style={{ fontFamily: "'Orbitron', monospace", fontSize: 30, color: B.amber, opacity: 0.5, marginTop: 18 }}>:</div>
            <CountBox value={time.seconds} label="SEC" />
          </div>
          <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 8, color: B.smoke, marginTop: 14, letterSpacing: "0.25em" }}>
            JULY 18, 2026 — DOORS 12:00 PM
          </div>
        </div>

        {/* CTAs */}
        <div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap" }}>
          <a
            href="#tickets"
            style={{
              padding: "15px 38px", background: B.amber, color: B.black,
              fontFamily: "'Space Mono', monospace", fontSize: 10, fontWeight: 700, letterSpacing: "0.2em",
              textDecoration: "none", borderRadius: 2,
              boxShadow: `0 0 30px ${B.amber}30`,
            }}
          >
            GET TICKETS →
          </a>
          <a
            href="#about"
            style={{
              padding: "15px 38px", background: "transparent", color: B.white,
              fontFamily: "'Space Mono', monospace", fontSize: 10, letterSpacing: "0.2em",
              textDecoration: "none", borderRadius: 2, border: `1px solid ${B.gunmetal}`,
            }}
          >
            LEARN MORE
          </a>
        </div>
      </div>

      {/* Scroll indicator */}
      <div style={{
        position: "absolute", bottom: 28, left: "50%", transform: "translateX(-50%)",
        display: "flex", flexDirection: "column", alignItems: "center", gap: 6,
        animation: "pulse 2.5s infinite",
      }}>
        <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 7, color: B.smoke, letterSpacing: "0.35em" }}>SCROLL</div>
        <div style={{ width: 1, height: 32, background: `linear-gradient(${B.amber}, transparent)` }} />
      </div>
    </section>
  )
}
