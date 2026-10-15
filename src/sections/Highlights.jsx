import { useState, useRef, useEffect } from 'react'
import { B } from '../tokens'
import { GrainOverlay, AmberGlow, SectionTag } from '../components/Shared'
import Egg from '../components/Egg'

const REELS = [
  {
    id: 'trailer-1080p',
    tag: 'OFFICIAL MARKETING FILM · 1080P MASTER CUT',
    title: 'SNEAKERS FEST LAGOS 2026 · THE MOVEMENT',
    desc: 'Edited for maximum cultural impact — rare grails, Lagos street energy, live customization, and 5,000+ sneakerheads converging at Muri Okunola Park, Victoria Island on Saturday, December 12, 2026.',
    src: '/media/video/fest_trailer_1080p.mp4',
    poster: '/media/gallery/flyer_01_hero.jpg',
    badge: 'FEATURED TRAILER',
    accent: B.amber,
  },
  {
    id: 'street-reel',
    tag: 'CAPCUT CULTURE REEL · ON-FEET & CROWD HEAT',
    title: 'LAGOS STREETWEAR & GRAIL CHECK REEL',
    desc: 'Inside the pit: deadstock heat, DJ soundclash vibrations, and the unmistakable drip of West Africa’s premier sneaker festival.',
    src: '/media/reel1.mp4',
    poster: '/media/gallery/flyer_03_main.jpg',
    badge: 'CULTURE CUT',
    accent: B.neonCyan,
  },
]

const FEATURES = [
  { label: '200+ GRAIL PAIRS', title: 'RARE KICKS', desc: 'Collectors from across Africa and beyond bring their grails. Cop, trade, or just soak in the heat — all at Muri Okunola Park.', color: B.amber, img: '/media/gallery/flyer_06_grail.jpg' },
  { label: '30+ CONFIRMED', title: 'CURATED VENDORS', desc: 'Invitation-only vendors: sneakers, apparel, customs, accessories, and food — handpicked for quality. No random stalls.', color: B.neonCyan, img: '/media/gallery/flyer_05_street.jpg' },
  { label: 'LIVE SETS', title: 'DJ CULTURE', desc: 'Headline DJs, hypemen, and live performers keep the energy peaking from the moment gates open at 11:00 AM until the closing rave.', color: B.neonMagenta, img: '/media/gallery/flyer_08_sound.jpg' },
  { label: 'ON-SITE', title: 'CUSTOM ART', desc: 'Bring your blank pair and watch artists turn them into one-of-a-kind masterpieces in real time. Walkable, watchable, wearable.', color: B.neonLime, img: '/media/gallery/flyer_13_culture.jpg' },
  { label: 'ALL DAY', title: 'STREET FOOD', desc: "Suya, jollof, small chops, and craft refreshments — Lagos' finest street food vendors run the food court all day.", color: B.amber, img: '/media/gallery/flyer_18_food.jpg' },
  { label: 'VIP PRIORITY', title: 'EXCLUSIVE DROPS', desc: 'Limited-run releases you cannot buy online. VIP, VVIP, and Table holders get priority access before general queue opens.', color: B.neonCyan, img: '/media/gallery/flyer_10_drop.jpg' },
]

export default function Highlights() {
  const [activeReelIdx, setActiveReelIdx] = useState(0)
  const [isPlaying, setIsPlaying] = useState(true)
  const [isMuted, setIsMuted] = useState(true)
  const [dataSaver, setDataSaver] = useState(false)
  const videoRef = useRef(null)

  const currentReel = REELS[activeReelIdx]

  useEffect(() => {
    // Detect cellular / metered connection or browser Save-Data mode
    if (typeof navigator !== 'undefined') {
      const conn = navigator.connection || navigator.mozConnection || navigator.webkitConnection
      if (conn && (conn.saveData || /^(slow-)?2g$/.test(conn.effectiveType || '') || conn.effectiveType === '3g')) {
        setDataSaver(true)
        setIsPlaying(false)
        if (videoRef.current) {
          videoRef.current.pause()
        }
      }
    }
  }, [])

  function switchReel(idx) {
    setActiveReelIdx(idx)
    setIsPlaying(true)
    setTimeout(() => {
      if (videoRef.current) {
        videoRef.current.load()
        videoRef.current.play().catch(() => setIsPlaying(false))
      }
    }, 40)
  }

  function togglePlay() {
    const v = videoRef.current
    if (!v) return
    if (v.paused) {
      v.play().then(() => setIsPlaying(true)).catch(() => {})
    } else {
      v.pause()
      setIsPlaying(false)
    }
  }

  function toggleMute() {
    const v = videoRef.current
    if (!v) return
    v.muted = !v.muted
    setIsMuted(v.muted)
  }

  function requestFullScreen() {
    const v = videoRef.current
    if (!v) return
    if (v.requestFullscreen) v.requestFullscreen()
    else if (v.webkitRequestFullscreen) v.webkitRequestFullscreen()
  }

  return (
    <section id="highlights" style={{
      position: "relative", overflow: "hidden",
      background: B.black, padding: "100px 24px",
    }}>
      <GrainOverlay />
      <Egg id="egg-017" corner="top-right" />
      <Egg id="egg-018" corner="bottom-left" />
      <AmberGlow top="25%" left="8%" size={420} />

      <div style={{
        position: "absolute", inset: 0, opacity: 0.02,
        backgroundImage: `linear-gradient(${B.white} 1px, transparent 1px), linear-gradient(90deg, ${B.white} 1px, transparent 1px)`,
        backgroundSize: "50px 50px",
      }} />

      <div style={{ position: "relative", zIndex: 10, maxWidth: 1120, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 48 }}>
          <SectionTag>OFFICIAL MARKETING FILM &amp; FESTIVAL HIGHLIGHTS</SectionTag>
          <div className="reveal-3d text-3d" style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "clamp(40px, 6vw, 68px)", color: B.white, lineHeight: 0.9 }}>
            THE FULL<br /><span style={{ color: B.amber }}>EXPERIENCE</span>
          </div>
        </div>

        {/* ── OFFICIAL MARKETING VIDEO SHOWCASE (CAPCUT / FIGMA CINEMA DECK) ── */}
        <div className="reveal-3d" style={{
          marginBottom: 64,
          background: `linear-gradient(145deg, ${B.charcoal} 0%, #07070c 100%)`,
          border: `1px solid ${currentReel.accent}45`,
          borderRadius: 14,
          overflow: 'hidden',
          boxShadow: `0 28px 80px rgba(0,0,0,0.75), 0 0 40px ${currentReel.accent}15`,
        }}>
          {/* Top Cinema Telemetry Bar */}
          <div style={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12,
            padding: '12px 20px',
            background: 'rgba(255,255,255,0.02)',
            borderBottom: `1px solid ${B.gunmetal}`,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{
                width: 8, height: 8, borderRadius: '50%',
                background: isPlaying ? B.neonLime : B.amber,
                boxShadow: `0 0 10px ${isPlaying ? B.neonLime : B.amber}`,
              }} />
              <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 10, color: currentReel.accent, letterSpacing: '0.15em', fontWeight: 700 }}>
                {currentReel.tag}
              </span>
            </div>

            {/* Reel Switcher Tabs */}
            <div style={{ display: 'flex', gap: 8 }}>
              {REELS.map((r, idx) => {
                const active = idx === activeReelIdx
                return (
                  <button
                    key={r.id}
                    onClick={() => switchReel(idx)}
                    style={{
                      padding: '6px 12px',
                      borderRadius: 6,
                      cursor: 'pointer',
                      fontFamily: "'Space Mono', monospace",
                      fontSize: 9,
                      letterSpacing: '0.12em',
                      background: active ? r.accent : 'rgba(255,255,255,0.04)',
                      color: active ? B.black : B.smoke,
                      fontWeight: active ? 700 : 400,
                      border: `1px solid ${active ? r.accent : B.gunmetal}`,
                      transition: 'all 0.2s',
                    }}
                  >
                    {idx === 0 ? '🎬 01 · OFFICIAL TRAILER (1080P)' : '🔥 02 · CULTURE REEL'}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Main Video Viewport + Info Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))' }}>
            {/* Video Player Column */}
            <div style={{ position: 'relative', background: '#040407', minHeight: 340, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <video
                ref={videoRef}
                key={currentReel.src}
                src={currentReel.src}
                poster={currentReel.poster}
                preload="metadata"
                autoPlay={!dataSaver}
                loop
                muted={isMuted}
                playsInline
                aria-label={`Official Sneaker Fest video: ${currentReel.title}`}
                onClick={togglePlay}
                style={{ width: '100%', maxHeight: 480, objectFit: 'cover', display: 'block', cursor: 'pointer', aspectRatio: '16/9' }}
              />

              {/* Data Saver Indicator for metered cellular bandwidth */}
              {dataSaver && !isPlaying && (
                <div style={{
                  position: 'absolute', top: 14, left: 14,
                  background: 'rgba(5,5,10,0.85)', backdropFilter: 'blur(8px)',
                  border: `1px solid ${B.amber}`, borderRadius: 6,
                  padding: '5px 10px', display: 'flex', alignItems: 'center', gap: 6,
                  fontFamily: "'Space Mono', monospace", fontSize: 9, color: B.amber,
                  zIndex: 2,
                }}>
                  <span>⚡ DATA SAVER ACTIVE</span>
                  <span style={{ color: B.smoke }}>· Tap Play to Stream</span>
                </div>
              )}

              {/* Floating Controls Bar */}
              <div style={{
                position: 'absolute', bottom: 14, left: 14, right: 14,
                display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 8,
                padding: '8px 12px',
                background: 'rgba(5,5,10,0.82)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255,255,255,0.12)',
                borderRadius: 8,
              }}>
                <div style={{ display: 'flex', gap: 8 }}>
                  <button
                    onClick={togglePlay}
                    aria-label={isPlaying ? 'Pause marketing video' : 'Play marketing video'}
                    style={{
                      padding: '6px 12px', borderRadius: 5, cursor: 'pointer',
                      background: currentReel.accent, border: 'none',
                      color: B.black, fontFamily: "'Space Mono', monospace", fontSize: 10, fontWeight: 700,
                    }}
                  >
                    {isPlaying ? '⏸ PAUSE' : '▶ PLAY'}
                  </button>
                  <button
                    onClick={toggleMute}
                    aria-label={isMuted ? 'Unmute video audio' : 'Mute video audio'}
                    style={{
                      padding: '6px 12px', borderRadius: 5, cursor: 'pointer',
                      background: isMuted ? 'rgba(255,255,255,0.08)' : B.neonMagenta,
                      border: `1px solid ${isMuted ? 'rgba(255,255,255,0.2)' : B.neonMagenta}`,
                      color: B.white, fontFamily: "'Space Mono', monospace", fontSize: 10, fontWeight: 700,
                    }}
                  >
                    {isMuted ? '🔇 UNMUTE AUDIO' : '🔊 AUDIO LIVE'}
                  </button>
                </div>

                <button
                  onClick={requestFullScreen}
                  aria-label="View video in fullscreen mode"
                  style={{
                    padding: '6px 10px', borderRadius: 5, cursor: 'pointer',
                    background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.15)',
                    color: B.white, fontFamily: "'Space Mono', monospace", fontSize: 9,
                  }}
                >
                  ⛶ FULLSCREEN
                </button>
              </div>
            </div>

            {/* Editorial Copy & Callouts Column */}
            <div style={{ padding: '32px 28px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: 22 }}>
              <div>
                <div style={{
                  display: 'inline-block', padding: '4px 10px', borderRadius: 4,
                  background: `${currentReel.accent}18`, border: `1px solid ${currentReel.accent}50`,
                  fontFamily: "'Space Mono', monospace", fontSize: 9, color: currentReel.accent,
                  letterSpacing: '0.18em', marginBottom: 14,
                }}>
                  {currentReel.badge}
                </div>

                <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 'clamp(28px, 3.5vw, 40px)', color: B.white, lineHeight: 1, letterSpacing: 1.5, marginBottom: 12 }}>
                  {currentReel.title}
                </div>

                <p style={{ fontFamily: "'Syne', sans-serif", fontSize: 13.5, color: B.smoke, lineHeight: 1.7, margin: '0 0 20px' }}>
                  {currentReel.desc}
                </p>

                {/* Verified Event Facts Strip */}
                <div style={{
                  display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10,
                  padding: 14, background: 'rgba(255,255,255,0.02)',
                  border: `1px solid ${B.gunmetal}`, borderRadius: 8,
                }}>
                  <div>
                    <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 8, color: B.dim, letterSpacing: 1.5 }}>OFFICIAL DATE</div>
                    <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 11, color: B.amber, fontWeight: 700, marginTop: 3 }}>SAT · DEC 12, 2026</div>
                  </div>
                  <div>
                    <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 8, color: B.dim, letterSpacing: 1.5 }}>OFFICIAL VENUE</div>
                    <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 11, color: B.white, fontWeight: 700, marginTop: 3 }}>MURI OKUNOLA PARK, VI</div>
                  </div>
                  <div>
                    <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 8, color: B.dim, letterSpacing: 1.5 }}>OFFICIAL X HANDLE</div>
                    <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 11, color: B.neonCyan, marginTop: 3 }}>@s_fest26</div>
                  </div>
                  <div>
                    <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 8, color: B.dim, letterSpacing: 1.5 }}>CONVENER</div>
                    <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 11, color: B.neonMagenta, marginTop: 3 }}>@catalystggg</div>
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
                <a
                  href="#tickets"
                  style={{
                    flex: 1, minWidth: 160, textAlign: 'center',
                    padding: '13px 18px', borderRadius: 8,
                    background: B.amber, color: B.black, textDecoration: 'none',
                    fontFamily: "'Bebas Neue', sans-serif", fontSize: 17, letterSpacing: 2,
                  }}
                >
                  GET OFFICIAL TICKETS →
                </a>
                <a
                  href="#gallery"
                  style={{
                    flex: 1, minWidth: 160, textAlign: 'center',
                    padding: '13px 18px', borderRadius: 8,
                    background: 'rgba(255,255,255,0.04)', border: `1px solid ${B.gunmetal}`,
                    color: B.white, textDecoration: 'none',
                    fontFamily: "'Bebas Neue', sans-serif", fontSize: 17, letterSpacing: 2,
                  }}
                >
                  VIEW 20+ ARTWORKS ↓
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* ── 6 PILLARS WITH REAL ARTWORK THUMBNAILS ── */}
        <div className="reveal-3d" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 16 }}>
          {FEATURES.map((f, i) => (
            <div
              key={i}
              className="reveal-3d"
              style={{
                background: B.charcoal,
                border: `1px solid ${B.gunmetal}`, borderRadius: 8,
                position: "relative", overflow: "hidden", transition: "border-color 0.3s, transform 0.3s",
              }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = f.color + "70"; e.currentTarget.style.transform = "translateY(-4px)" }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = B.gunmetal; e.currentTarget.style.transform = "translateY(0)" }}
            >
              <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg, ${f.color}, transparent)`, zIndex: 2 }} />
              <div style={{ height: 140, overflow: 'hidden', position: 'relative', background: '#06060a' }}>
                <img src={f.img} alt={f.title} loading="lazy" style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.72, display: 'block' }} />
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(0deg, rgba(14,14,20,1) 0%, rgba(14,14,20,0.2) 100%)' }} />
                <div style={{ position: 'absolute', bottom: 10, left: 20, fontFamily: "'Space Mono', monospace", fontSize: 9, color: f.color, letterSpacing: "0.2em" }}>
                  {f.label}
                </div>
              </div>
              <div style={{ padding: '14px 22px 24px' }}>
                <div style={{ fontFamily: "'Orbitron', monospace", fontWeight: 700, fontSize: 13, color: f.color, letterSpacing: "0.1em", marginBottom: 8 }}>
                  {f.title}
                </div>
                <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 13, color: B.smoke, lineHeight: 1.65 }}>
                  {f.desc}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
