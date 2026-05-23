import { useState, useEffect } from 'react'
import { B } from '../tokens'
import { GrainOverlay, ScanLines } from '../components/Shared'

const EVENT_DATE = new Date('2026-12-12T12:00:00')

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
      width: 78, height: 90,
      display: "flex", alignItems: "center", justifyContent: "center",
      background: "rgba(255,255,255,0.06)",
      backdropFilter: "blur(20px) saturate(180%)",
      WebkitBackdropFilter: "blur(20px) saturate(180%)",
      border: `1px solid rgba(255,255,255,0.12)`,
      borderRadius: 8,
      position: "relative", overflow: "hidden",
      boxShadow: `0 8px 32px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.12)`,
    }}>
      <div style={{
        position: "absolute", top: 0, left: 0, right: 0, height: 1,
        background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)",
      }} />
      <div style={{
        position: "absolute", top: "50%", left: 0, right: 0, height: 1,
        background: "rgba(0,0,0,0.4)",
      }} />
      <div style={{
        position: "absolute", top: 0, left: 0, right: 0, height: "50%",
        background: "rgba(255,255,255,0.03)",
      }} />
      <span style={{
        fontFamily: "'Orbitron', monospace", fontSize: 36, fontWeight: 900,
        color: B.amber,
        textShadow: `0 0 20px ${B.amber}60, 0 0 40px ${B.amber}20`,
        position: "relative", zIndex: 1,
      }}>
        {String(value).padStart(2, '0')}
      </span>
    </div>
    <div style={{
      fontFamily: "'Space Mono', monospace", fontSize: 7,
      color: B.smoke, marginTop: 8, letterSpacing: "0.35em",
    }}>{label}</div>
  </div>
)

export default function Hero() {
  const time = useCountdown(EVENT_DATE)

  return (
    <section style={{
      minHeight: "100vh", position: "relative", overflow: "hidden",
      background: `
        radial-gradient(ellipse 80% 60% at 70% 30%, ${B.amber}08 0%, transparent 60%),
        radial-gradient(ellipse 60% 80% at 20% 70%, ${B.neonCyan}06 0%, transparent 60%),
        radial-gradient(ellipse 50% 50% at 50% 0%, #1a0a2e18 0%, transparent 60%),
        linear-gradient(180deg, #050508 0%, ${B.void} 40%, ${B.black} 100%)
      `,
      display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center",
      padding: "100px 24px 80px",
    }}>
      <GrainOverlay />
      <ScanLines opacity={0.05} />

      <div style={{
        position: "absolute", top: "15%", right: "12%",
        width: 500, height: 500,
        background: `radial-gradient(circle, ${B.amber}18 0%, ${B.amber}06 40%, transparent 70%)`,
        filter: "blur(40px)", pointerEvents: "none",
      }} />
      <div style={{
        position: "absolute", top: "20%", right: "18%",
        width: 280, height: 280,
        background: `radial-gradient(circle, ${B.amber}22 0%, transparent 60%)`,
        filter: "blur(20px)", pointerEvents: "none",
      }} />
      <div style={{
        position: "absolute", bottom: "30%", left: "8%",
        width: 350, height: 350,
        background: `radial-gradient(circle, ${B.neonCyan}10 0%, transparent 65%)`,
        filter: "blur(50px)", pointerEvents: "none",
      }} />

      <div style={{
        position: "absolute", inset: 0,
        opacity: 0.025,
        backgroundImage: `linear-gradient(${B.neonCyan} 1px, transparent 1px), linear-gradient(90deg, ${B.neonCyan} 1px, transparent 1px)`,
        backgroundSize: "60px 60px",
      }} />

      <div style={{
        position: "absolute", top: "-5%", left: "-5%", width: "65%", height: 1,
        background: `linear-gradient(90deg, transparent, ${B.neonCyan}60, ${B.neonMagenta}40, transparent)`,
        transform: "rotate(-18deg)", filter: "blur(1px)",
      }} />
      <div style={{
        position: "absolute", bottom: "20%", right: "-5%", width: "50%", height: 1,
        background: `linear-gradient(90deg, transparent, ${B.amber}40, transparent)`,
        transform: "rotate(-8deg)",
      }} />

      <div style={{ position: "absolute", top: 80, left: 24, width: 44, height: 44, borderTop: `2px solid ${B.neonCyan}50`, borderLeft: `2px solid ${B.neonCyan}50` }} />
      <div style={{ position: "absolute", top: 80, right: 24, width: 44, height: 44, borderTop: `2px solid ${B.neonCyan}50`, borderRight: `2px solid ${B.neonCyan}50` }} />

      <div style={{ position: "relative", zIndex: 10, textAlign: "center", maxWidth: 940, animation: "fadeUp 0.8s ease both" }}>
        <div style={{
          display: "inline-flex", alignItems: "center", gap: 8, marginBottom: 28,
          padding: "5px 16px",
          background: "rgba(255,255,255,0.05)",
          backdropFilter: "blur(10px)",
          WebkitBackdropFilter: "blur(10px)",
          border: `1px solid ${B.neonCyan}40`, borderRadius: 20,
        }}>
          <div style={{ width: 5, height: 5, borderRadius: "50%", background: B.neonLime, animation: "pulse 2s infinite", boxShadow: `0 0 6px ${B.neonLime}` }} />
          <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 8, color: B.neonCyan, letterSpacing: "0.4em" }}>
            DECEMBER 12 · LAGOS, NIGERIA
          </span>
        </div>

        <div style={{
          fontFamily: "'Bebas Neue', sans-serif",
          fontSize: "clamp(72px, 15vw, 150px)",
          color: B.white, lineHeight: 0.85,
          letterSpacing: "0.02em",
          textShadow: `0 0 80px rgba(240,237,230,0.08), 0 2px 0 rgba(0,0,0,0.8)`,
          animation: "flicker 10s infinite",
        }}>
          SNEAKERS
        </div>
        <div style={{
          fontFamily: "'Orbitron', monospace", fontWeight: 900,
          fontSize: "clamp(54px, 11vw, 116px)",
          color: B.amber, lineHeight: 1, letterSpacing: "0.08em",
          textShadow: `
            0 0 20px ${B.amber}80,
            0 0 50px ${B.amber}40,
            0 0 100px ${B.amber}20,
            0 2px 0 rgba(0,0,0,0.8)
          `,
        }}>
          FEST '26
        </div>

        <div style={{
          width: "100%", height: 1, margin: "22px 0",
          background: `linear-gradient(90deg, transparent, ${B.neonCyan}80, ${B.amber}60, transparent)`,
        }} />

        <div style={{ fontFamily: "'Space Mono', monospace", fontSize: "clamp(9px, 1.2vw, 13px)", color: B.smoke, letterSpacing: "0.55em", marginBottom: 10 }}>
          THE SOLE EXHIBITION
        </div>
        <div style={{
          fontFamily: "'Syne', sans-serif", fontSize: "clamp(14px, 1.8vw, 18px)",
          color: B.white, lineHeight: 1.65, maxWidth: 540, margin: "0 auto 44px",
        }}>
          Rare kicks. 30–50 curated vendors. Live DJs. Custom art. Street food.<br />
          <span style={{ color: B.amber }}>Lagos' first dedicated sneaker culture festival.</span>
        </div>

        <div style={{ marginBottom: 44 }}>
          <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 8, color: B.neonMagenta, letterSpacing: "0.45em", marginBottom: 18,
            textShadow: `0 0 10px ${B.neonMagenta}40`,
          }}>
            DROPS IN
          </div>
          <div style={{ display: "flex", gap: 10, justifyContent: "center", alignItems: "flex-start" }}>
            <CountBox value={time.days} label="DAYS" />
            <div style={{ fontFamily: "'Orbitron', monospace", fontSize: 28, color: B.amber, opacity: 0.4, marginTop: 22 }}>:</div>
            <CountBox value={time.hours} label="HRS" />
            <div style={{ fontFamily: "'Orbitron', monospace", fontSize: 28, color: B.amber, opacity: 0.4, marginTop: 22 }}>:</div>
            <CountBox value={time.minutes} label="MIN" />
            <div style={{ fontFamily: "'Orbitron', monospace", fontSize: 28, color: B.amber, opacity: 0.4, marginTop: 22 }}>:</div>
            <CountBox value={time.seconds} label="SEC" />
          </div>
          <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 8, color: B.smoke, marginTop: 14, letterSpacing: "0.25em" }}>
            DECEMBER 12, 2026 — DOORS 12:00 PM
          </div>
        </div>

        <div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap" }}>
          <a
            href="#tickets"
            style={{
              padding: "15px 38px", background: B.amber, color: B.black,
              fontFamily: "'Space Mono', monospace", fontSize: 10, fontWeight: 700, letterSpacing: "0.2em",
              textDecoration: "none", borderRadius: 4,
              boxShadow: `0 0 40px ${B.amber}35, 0 4px 16px rgba(0,0,0,0.5)`,
            }}
          >
            GET TICKETS →
          </a>
          <a
            href="#fnp"
            style={{
              padding: "15px 38px",
              background: "rgba(255,255,255,0.06)",
              backdropFilter: "blur(12px)",
              WebkitBackdropFilter: "blur(12px)",
              color: B.white,
              fontFamily: "'Space Mono', monospace", fontSize: 10, letterSpacing: "0.2em",
              textDecoration: "none", borderRadius: 4,
              border: `1px solid rgba(255,255,255,0.15)`,
              boxShadow: `inset 0 1px 0 rgba(255,255,255,0.1)`,
            }}
          >
            FRIDAY PROTOCOL
          </a>
        </div>
      </div>

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
