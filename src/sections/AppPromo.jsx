import { useState, useEffect } from 'react'
import { B } from '../tokens'
import { GrainOverlay, SectionTag, Divider } from '../components/Shared'

const FEATURES = [
  { icon: '|T|', label: 'Tickets', desc: 'Buy and store your tickets. Scan at the gate.' },
  { icon: '|S|', label: 'Schedule', desc: 'Full day-of schedule with live updates and reminders.' },
  { icon: '|R|', label: 'Trade Board', desc: 'Browse and list sneakers for trade directly from your phone.' },
  { icon: '|C|', label: 'Community', desc: 'Join the inner circle. Drops, news, and exclusive content.' },
  { icon: '|A|', label: 'AI Chat', desc: 'Your SF26 assistant — always on, even offline.' },
  { icon: '|B|', label: 'Badges', desc: 'Collect achievements and show your Sneaker Passport.' },
]

const STEPS = [
  { step: '01', label: 'Open in Safari or Chrome', desc: 'On your iPhone or Android browser' },
  { step: '02', label: 'Tap the Share icon', desc: 'The box with an arrow on iOS · three-dot menu on Android' },
  { step: '03', label: '"Add to Home Screen"', desc: 'SF\'26 installs like a native app — no App Store needed' },
]

export default function AppPromo() {
  const [installed, setInstalled] = useState(false)
  const [deferredPrompt, setDeferredPrompt] = useState(null)
  const [isIOS, setIsIOS] = useState(false)
  const [showIOSGuide, setShowIOSGuide] = useState(false)

  useEffect(() => {
    const iOS = /iphone|ipad|ipod/i.test(navigator.userAgent)
    setIsIOS(iOS)
    setInstalled(window.matchMedia('(display-mode: standalone)').matches)

    const handler = e => { e.preventDefault(); setDeferredPrompt(e) }
    window.addEventListener('beforeinstallprompt', handler)
    return () => window.removeEventListener('beforeinstallprompt', handler)
  }, [])

  function handleInstall() {
    if (isIOS) { setShowIOSGuide(true); return }
    if (deferredPrompt) {
      deferredPrompt.prompt()
      deferredPrompt.userChoice.then(result => {
        if (result.outcome === 'accepted') setInstalled(true)
        setDeferredPrompt(null)
      })
    }
  }

  return (
    <section id="app-promo" style={{ padding: '100px 0', background: B.black, position: 'relative', overflow: 'hidden' }}>
      <GrainOverlay />

      {/* background accent */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0, height: '60%',
        background: `linear-gradient(to top, ${B.neonCyan}06 0%, transparent 100%)`,
        pointerEvents: 'none',
      }} />

      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 24px', position: 'relative', zIndex: 1 }}>
        <SectionTag>MOBILE APP</SectionTag>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 64, alignItems: 'center' }}>

          {/* Left — copy */}
          <div>
            <h2 style={{
              fontFamily: 'Bebas Neue, sans-serif',
              fontSize: 'clamp(48px, 8vw, 88px)',
              letterSpacing: 3,
              color: B.white,
              lineHeight: 0.9,
              marginBottom: 20,
            }}>
              SF'26<br />
              <span style={{
                background: `linear-gradient(90deg, ${B.neonCyan}, ${B.electricPurple})`,
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
              }}>IN YOUR</span><br />
              POCKET
            </h2>

            <p style={{ fontSize: 15, color: B.smoke, lineHeight: 1.7, marginBottom: 36, maxWidth: 420 }}>
              Add Sneakers Fest '26 to your home screen and get instant access to your tickets, the schedule, trade board, and community — no app store required.
            </p>

            {/* Feature grid */}
            <div style={{
              display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 36,
            }}>
              {FEATURES.map(f => (
                <div key={f.label} style={{
                  display: 'flex', gap: 10, alignItems: 'flex-start',
                  background: B.charcoal, border: `1px solid ${B.gunmetal}`,
                  borderRadius: 10, padding: '12px 14px',
                }}>
                  <span style={{
                    fontFamily: 'Space Mono, monospace', fontSize: 13, color: B.neonCyan,
                    flexShrink: 0, marginTop: 1,
                  }}>{f.icon}</span>
                  <div>
                    <p style={{ fontSize: 12, fontWeight: 600, color: B.white, marginBottom: 2 }}>{f.label}</p>
                    <p style={{ fontSize: 11, color: B.smoke, lineHeight: 1.4 }}>{f.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* CTA */}
            {installed ? (
              <div style={{
                display: 'inline-flex', alignItems: 'center', gap: 10,
                background: `${B.neonLime}15`, border: `1px solid ${B.neonLime}40`,
                borderRadius: 12, padding: '14px 24px',
              }}>
                <span style={{ color: B.neonLime, fontSize: 18 }}>v</span>
                <div>
                  <p style={{ fontSize: 13, fontWeight: 600, color: B.neonLime }}>Already installed</p>
                  <p style={{ fontSize: 11, color: B.smoke }}>SF'26 is on your home screen.</p>
                </div>
              </div>
            ) : (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
                <button
                  onClick={handleInstall}
                  style={{
                    background: `linear-gradient(135deg, ${B.neonCyan}20, ${B.electricPurple}20)`,
                    border: `1px solid ${B.neonCyan}50`,
                    borderRadius: 12, padding: '14px 28px',
                    color: B.neonCyan, fontFamily: 'Bebas Neue, sans-serif',
                    fontSize: 18, letterSpacing: 2, cursor: 'pointer',
                    display: 'flex', alignItems: 'center', gap: 10,
                    transition: 'all .25s',
                  }}
                  onMouseOver={e => e.currentTarget.style.background = `linear-gradient(135deg, ${B.neonCyan}30, ${B.electricPurple}30)`}
                  onMouseOut={e => e.currentTarget.style.background = `linear-gradient(135deg, ${B.neonCyan}20, ${B.electricPurple}20)`}
                >
                  <span style={{ fontSize: 20 }}>+</span>
                  {isIOS ? 'ADD TO HOME SCREEN' : 'INSTALL APP'}
                </button>
                <div style={{ display: 'flex', gap: 8 }}>
                  {[
                    { label: 'iOS', sub: 'Safari' },
                    { label: 'Android', sub: 'Chrome' },
                  ].map(p => (
                    <div key={p.label} style={{
                      background: B.charcoal, border: `1px solid ${B.gunmetal}`,
                      borderRadius: 10, padding: '10px 16px', textAlign: 'center',
                    }}>
                      <p style={{ fontSize: 12, fontWeight: 600, color: B.white }}>{p.label}</p>
                      <p style={{ fontSize: 10, color: B.smoke }}>{p.sub}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* PWA badges */}
            <div style={{ display: 'flex', gap: 16, marginTop: 24, flexWrap: 'wrap' }}>
              {['No download', 'Works offline', 'Push updates', 'Instant load'].map(b => (
                <div key={b} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <div style={{ width: 4, height: 4, borderRadius: '50%', background: B.neonCyan }} />
                  <span style={{ fontSize: 11, color: B.smoke }}>{b}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right — mock phone + install guide */}
          <div>
            {/* Phone mockup */}
            <div style={{
              width: '100%', maxWidth: 280, margin: '0 auto',
              background: `linear-gradient(160deg, ${B.charcoal}, ${B.void})`,
              border: `1px solid ${B.gunmetal}`,
              borderRadius: 36, padding: 16, boxShadow: `0 40px 80px ${B.black}80`,
              position: 'relative',
            }}>
              {/* Notch */}
              <div style={{
                width: 80, height: 24, background: B.black,
                borderRadius: 12, margin: '0 auto 12px',
              }} />
              {/* Screen content */}
              <div style={{
                background: B.black, borderRadius: 24, padding: 20, minHeight: 480,
                position: 'relative', overflow: 'hidden',
              }}>
                <GrainOverlay />
                <div style={{
                  position: 'absolute', top: 0, left: 0, right: 0, height: 80,
                  background: `linear-gradient(180deg, ${B.amber}15 0%, transparent 100%)`,
                }} />

                {/* Status bar */}
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20, position: 'relative', zIndex: 1 }}>
                  <span style={{ fontSize: 9, color: B.smoke, fontFamily: 'Space Mono, monospace' }}>9:41</span>
                  <div style={{ display: 'flex', gap: 4 }}>
                    {['wifi', 'sig', 'bat'].map(i => (
                      <div key={i} style={{ width: 14, height: 8, background: B.smoke, borderRadius: 2, opacity: 0.5 }} />
                    ))}
                  </div>
                </div>

                {/* App header */}
                <div style={{ textAlign: 'center', marginBottom: 24, position: 'relative', zIndex: 1 }}>
                  <div style={{
                    width: 44, height: 44, borderRadius: 12, background: `${B.amber}20`,
                    border: `1px solid ${B.amber}40`, margin: '0 auto 8px',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontFamily: 'Bebas Neue, sans-serif', fontSize: 16, color: B.amber,
                  }}>SF</div>
                  <p style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: 18, letterSpacing: 2, color: B.white }}>SNEAKERS FEST</p>
                  <p style={{ fontSize: 9, color: B.amber, letterSpacing: 2, fontFamily: 'Orbitron, monospace' }}>DEC 12 · LAGOS</p>
                </div>

                {/* Quick tiles */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, position: 'relative', zIndex: 1 }}>
                  {[
                    { label: 'My Tickets', color: B.amber, val: '1 Active' },
                    { label: 'Schedule', color: B.neonCyan, val: 'Today' },
                    { label: 'Trade Board', color: B.electricPurple, val: '47 Live' },
                    { label: 'Community', color: B.neonMagenta, val: '2.1k' },
                  ].map(tile => (
                    <div key={tile.label} style={{
                      background: `${tile.color}10`, border: `1px solid ${tile.color}25`,
                      borderRadius: 12, padding: '12px 10px',
                    }}>
                      <p style={{ fontSize: 9, color: `${tile.color}90`, letterSpacing: 1, marginBottom: 4, fontFamily: 'Orbitron, monospace' }}>{tile.label}</p>
                      <p style={{ fontSize: 16, fontFamily: 'Bebas Neue, sans-serif', color: tile.color, letterSpacing: 1 }}>{tile.val}</p>
                    </div>
                  ))}
                </div>

                {/* Countdown mini */}
                <div style={{
                  marginTop: 12, background: `${B.amber}08`, border: `1px solid ${B.amber}20`,
                  borderRadius: 12, padding: '10px 14px', position: 'relative', zIndex: 1,
                }}>
                  <p style={{ fontSize: 9, color: B.smoke, marginBottom: 4, fontFamily: 'Orbitron, monospace', letterSpacing: 1 }}>COUNTDOWN</p>
                  <div style={{ display: 'flex', gap: 8 }}>
                    {[['137', 'DAYS'], ['12', 'HRS'], ['00', 'MIN']].map(([n, l]) => (
                      <div key={l} style={{ flex: 1, textAlign: 'center' }}>
                        <p style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: 22, color: B.amber, lineHeight: 1 }}>{n}</p>
                        <p style={{ fontSize: 7, color: B.smoke, letterSpacing: 1 }}>{l}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Home bar */}
                <div style={{
                  width: 60, height: 3, background: B.smoke, borderRadius: 2,
                  margin: '20px auto 0', opacity: 0.3,
                }} />
              </div>
            </div>

            {/* iOS install steps (below phone) */}
            {!installed && (
              <div style={{ marginTop: 32 }}>
                <p style={{ fontFamily: 'Orbitron, sans-serif', fontSize: 10, letterSpacing: 3, color: B.smoke, marginBottom: 16, textAlign: 'center' }}>
                  HOW TO INSTALL
                </p>
                {STEPS.map((s, i) => (
                  <div key={s.step} style={{ display: 'flex', gap: 16, marginBottom: 14 }}>
                    <div style={{
                      width: 32, height: 32, borderRadius: '50%', flexShrink: 0,
                      border: `1px solid ${B.neonCyan}40`, background: `${B.neonCyan}08`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontFamily: 'Bebas Neue, sans-serif', fontSize: 14, color: B.neonCyan,
                    }}>{s.step}</div>
                    <div>
                      <p style={{ fontSize: 13, fontWeight: 600, color: B.white, marginBottom: 2 }}>{s.label}</p>
                      <p style={{ fontSize: 11, color: B.smoke, lineHeight: 1.4 }}>{s.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* iOS modal */}
      {showIOSGuide && (
        <div style={{
          position: 'fixed', inset: 0, background: `${B.black}90`, zIndex: 9999,
          display: 'flex', alignItems: 'flex-end', justifyContent: 'center',
          backdropFilter: 'blur(8px)',
        }} onClick={() => setShowIOSGuide(false)}>
          <div style={{
            background: B.charcoal, border: `1px solid ${B.gunmetal}`,
            borderRadius: '24px 24px 0 0', padding: '32px 28px 48px',
            width: '100%', maxWidth: 480,
          }} onClick={e => e.stopPropagation()}>
            <div style={{ width: 40, height: 3, background: B.smoke, borderRadius: 2, margin: '0 auto 28px', opacity: 0.4 }} />
            <p style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: 24, letterSpacing: 2, color: B.white, marginBottom: 8 }}>
              INSTALL ON iOS
            </p>
            <p style={{ fontSize: 13, color: B.smoke, marginBottom: 28, lineHeight: 1.6 }}>
              Safari is required. Open sneakersfest26.com in Safari, then follow these steps:
            </p>
            {STEPS.map((s, i) => (
              <div key={s.step} style={{ display: 'flex', gap: 14, marginBottom: 18 }}>
                <div style={{
                  width: 28, height: 28, borderRadius: '50%', flexShrink: 0,
                  border: `1px solid ${B.neonCyan}40`, background: `${B.neonCyan}10`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontFamily: 'Bebas Neue, sans-serif', fontSize: 13, color: B.neonCyan,
                }}>{s.step}</div>
                <div>
                  <p style={{ fontSize: 14, fontWeight: 600, color: B.white, marginBottom: 2 }}>{s.label}</p>
                  <p style={{ fontSize: 12, color: B.smoke }}>{s.desc}</p>
                </div>
              </div>
            ))}
            <button onClick={() => setShowIOSGuide(false)} style={{
              width: '100%', marginTop: 8, padding: '14px', border: `1px solid ${B.smoke}30`,
              borderRadius: 12, background: 'none', color: B.smoke, fontSize: 14, cursor: 'pointer',
            }}>Close</button>
          </div>
        </div>
      )}
    </section>
  )
}
