import { useState } from 'react'
import { B } from '../tokens'
import { GrainOverlay, ScanLines, SectionTag } from '../components/Shared'

const SEED_COUNT = 1847
const KEY = 'sf26_waitlist'

export default function EarlyAccess() {
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [phase, setPhase] = useState('form') // form | loading | done
  const [position, setPosition] = useState(null)
  const [error, setError] = useState('')
  const [copied, setCopied] = useState(false)

  function getTotal() {
    try { return SEED_COUNT + Number(JSON.parse(localStorage.getItem(KEY) || '0')) } catch { return SEED_COUNT }
  }

  function submit(e) {
    e.preventDefault()
    if (!email.includes('@')) { setError('Enter a valid email address.'); return }
    setError('')
    setPhase('loading')
    setTimeout(() => {
      const pos = getTotal() + Math.floor(Math.random() * 8) + 1
      try { localStorage.setItem(KEY, JSON.stringify(pos - SEED_COUNT)) } catch {}
      setPosition(pos)
      setPhase('done')
    }, 1800)
  }

  function share() {
    const text = `I\'m #${position?.toLocaleString()} on the Sneakers Fest \'26 early access list. Lagos, Dec 12. Grab your spot: sneakersfest26.com`
    if (navigator.share) navigator.share({ text, url: window.location.href })
    else { navigator.clipboard.writeText(text); setCopied(true); setTimeout(() => setCopied(false), 2000) }
  }

  const total = getTotal()

  return (
    <section id="waitlist" style={{
      background: `linear-gradient(135deg, ${B.void} 0%, ${B.black} 50%, ${B.charcoal} 100%)`,
      padding: '80px 20px', position: 'relative', overflow: 'hidden',
    }}>
      <GrainOverlay /><ScanLines />

      {/* Decorative glow */}
      <div style={{
        position: 'absolute', bottom: -80, left: '50%', transform: 'translateX(-50%)',
        width: 500, height: 300, borderRadius: '50%',
        background: `radial-gradient(ellipse, ${B.amber}15 0%, transparent 70%)`,
        filter: 'blur(40px)', pointerEvents: 'none',
      }} />

      <div style={{ maxWidth: 580, margin: '0 auto', position: 'relative', zIndex: 2 }}>
        <SectionTag color={B.amber}>EARLY ACCESS</SectionTag>
        <h2 style={{ fontFamily: "'Bebas Neue'", fontSize: 'clamp(2.5rem,7vw,5rem)', color: B.white, letterSpacing: '0.05em', marginBottom: 8 }}>
          JOIN THE INNER CIRCLE
        </h2>
        <p style={{ color: B.smoke, fontFamily: "'Space Mono'", fontSize: '0.8rem', marginBottom: 16, lineHeight: 1.7 }}>
          First access to VIP ticket releases · exclusive drops · insider updates before anyone else
        </p>

        {/* Live counter */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 40, flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', gap: 4 }}>
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} style={{
                width: 8, height: 8, borderRadius: '50%',
                background: i < 4 ? B.amber : B.gunmetal,
                boxShadow: i < 4 ? `0 0 6px ${B.amber}` : 'none',
                animation: i < 4 ? `pulse ${0.8 + i * 0.2}s ease-in-out infinite` : 'none',
              }} />
            ))}
          </div>
          <span style={{ fontFamily: "'Space Mono'", fontSize: '0.7rem', color: B.amber }}>
            {total.toLocaleString()} people already on the list
          </span>
        </div>

        {phase === 'form' && (
          <form onSubmit={submit}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 16 }}>
              <input
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="Your name"
                style={{
                  background: B.charcoal, border: `1px solid ${B.gunmetal}`,
                  borderRadius: 6, padding: '12px 16px', color: B.white,
                  fontFamily: "'Space Mono'", fontSize: '0.85rem', outline: 'none',
                  transition: 'border-color 0.2s',
                }}
                onFocus={e => e.target.style.borderColor = B.amber}
                onBlur={e => e.target.style.borderColor = B.gunmetal}
              />
              <div style={{ display: 'flex', gap: 12 }}>
                <input
                  type="email"
                  value={email}
                  onChange={e => { setEmail(e.target.value); setError('') }}
                  placeholder="your@email.com"
                  required
                  style={{
                    flex: 1, background: B.charcoal, border: `1px solid ${error ? B.neonMagenta : B.gunmetal}`,
                    borderRadius: 6, padding: '12px 16px', color: B.white,
                    fontFamily: "'Space Mono'", fontSize: '0.85rem', outline: 'none',
                    transition: 'border-color 0.2s',
                  }}
                  onFocus={e => { if (!error) e.target.style.borderColor = B.amber }}
                  onBlur={e => { if (!error) e.target.style.borderColor = B.gunmetal }}
                />
                <button
                  type="submit"
                  style={{
                    background: B.amber, color: B.black, border: 'none',
                    padding: '12px 28px', fontFamily: "'Bebas Neue'",
                    fontSize: '1.1rem', letterSpacing: '0.1em', cursor: 'pointer',
                    borderRadius: 6, whiteSpace: 'nowrap',
                    boxShadow: `0 0 20px ${B.amber}50`,
                  }}
                >
                  JOIN
                </button>
              </div>
            </div>
            {error && (
              <p style={{ color: B.neonMagenta, fontFamily: "'Space Mono'", fontSize: '0.65rem', marginBottom: 8 }}>{error}</p>
            )}
            <p style={{ color: B.smoke, fontFamily: "'Space Mono'", fontSize: '0.62rem' }}>
              No spam · unsubscribe anytime · your email stays private
            </p>
          </form>
        )}

        {phase === 'loading' && (
          <div style={{ textAlign: 'center', padding: '40px 0' }}>
            <div style={{
              width: 48, height: 48, borderRadius: '50%',
              border: `3px solid ${B.gunmetal}`,
              borderTop: `3px solid ${B.amber}`,
              margin: '0 auto 16px',
              animation: 'spin 0.8s linear infinite',
            }} />
            <p style={{ color: B.smoke, fontFamily: "'Space Mono'", fontSize: '0.75rem' }}>
              Securing your spot...
            </p>
          </div>
        )}

        {phase === 'done' && (
          <div style={{ textAlign: 'center' }}>
            <div style={{
              fontFamily: "'Space Mono'", fontSize: '0.6rem',
              letterSpacing: '0.25em', color: B.amber, marginBottom: 12,
            }}>YOUR POSITION</div>
            <div style={{
              fontFamily: "'Orbitron'", fontSize: 'clamp(3rem,10vw,5rem)',
              fontWeight: 900, color: B.amberGlow, lineHeight: 1,
              textShadow: `0 0 40px ${B.amber}80`, marginBottom: 8,
            }}>
              #{position?.toLocaleString()}
            </div>
            <p style={{ color: B.smoke, fontFamily: "'Space Mono'", fontSize: '0.72rem', marginBottom: 8, lineHeight: 1.7 }}>
              {name ? `${name}, you're` : "You're"} on the list.{' '}
              Check your email for confirmation — early access tickets drop first to you.
            </p>
            <p style={{ color: B.smoke, fontFamily: "'Space Mono'", fontSize: '0.65rem', marginBottom: 32 }}>
              Move up the list by sharing with friends.
            </p>
            <button
              onClick={share}
              style={{
                background: B.amber, color: B.black, border: 'none',
                padding: '12px 36px', fontFamily: "'Bebas Neue'",
                fontSize: '1.2rem', letterSpacing: '0.1em',
                cursor: 'pointer', borderRadius: 4,
                boxShadow: `0 0 24px ${B.amber}50`,
              }}
            >
              {copied ? '✓ COPIED LINK!' : 'SHARE & MOVE UP'}
            </button>
          </div>
        )}
      </div>
    </section>
  )
}
