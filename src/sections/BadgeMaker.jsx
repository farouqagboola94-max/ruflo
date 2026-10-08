import { useState, useRef } from 'react'
import { B } from '../tokens'
import { useCounter } from '../lib/counter'
import { GrainOverlay, ScanLines, SectionTag } from '../components/Shared'
import { addXP, XP_VALUES } from '../lib/passport'
import Egg from '../components/Egg'

const TIERS = ['ATTENDEE', 'VIP', 'VENDOR', 'PRESS', 'SPEAKER']

const TIER_XP = { ATTENDEE: XP_VALUES.quickTask, VIP: 100, VENDOR: 60, PRESS: 70, SPEAKER: 80 }
const TIER_DESC = {
  ATTENDEE: 'General Access',
  VIP: 'Premium Experience',
  VENDOR: 'Official Exhibitor',
  PRESS: 'Media Credential',
  SPEAKER: 'Stage Access',
}

export default function BadgeMaker() {
  const [name, setName] = useState('')
  const [city, setCity] = useState('')
  const [tier, setTier] = useState('ATTENDEE')
  const [downloaded, setDownloaded] = useState(false)
  const [celebrating, setCelebrating] = useState(false)
  const [badgeCount, bumpBadges] = useCounter('badge')
  const [shared, setShared] = useState(false)
  const [badgeId] = useState(() => `SF26-${Math.random().toString(36).slice(2, 7).toUpperCase()}`)
  const svgRef = useRef(null)

  const displayName = (name || 'YOUR NAME').toUpperCase()
  const displayCity = (city || 'LAGOS').toUpperCase()
  const tierColor = tier === 'VIP' ? B.amber : tier === 'PRESS' ? B.neonCyan : tier === 'SPEAKER' ? B.neonMagenta : tier === 'VENDOR' ? B.neonLime : B.white
  const fontSize = displayName.length > 18 ? 30 : displayName.length > 12 ? 38 : 48

  function download() {
    const svg = svgRef.current
    if (!svg) return
    const xml = new XMLSerializer().serializeToString(svg)
    const blob = new Blob([xml], { type: 'image/svg+xml' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `sf26-badge-${(name || 'attendee').toLowerCase().replace(/\s+/g, '-')}.svg`
    a.click()
    URL.revokeObjectURL(url)

    const xp = TIER_XP[tier]
    addXP(xp, 'Badge Maker', 'badge-creator')
    bumpBadges()
    setDownloaded(true)
    setCelebrating(true)
    setTimeout(() => { setCelebrating(false); setDownloaded(false) }, 3200)
  }

  function share() {
    const text = `Just claimed my official ${tier} badge for Sneakers Fest '26 🎟 Dec 12 · Muri Okunola Park, VI · Lagos. The sole community is real — see you there 👟`
    if (navigator.share) navigator.share({ text }).catch(() => {})
    else { navigator.clipboard.writeText(text).catch(() => {}); setShared(true); setTimeout(() => setShared(false), 2500) }
  }

  return (
    <section id="badge" style={{ background: B.void, padding: '80px 20px', position: 'relative', overflow: 'hidden' }}>
      <GrainOverlay /><ScanLines />
      <Egg id="egg-053" corner="top-right" />
      <Egg id="egg-054" corner="bottom-left" />

      <style>{`
        @keyframes stampIn {
          0%   { opacity: 0; transform: scale(1.3) rotate(-4deg); }
          60%  { transform: scale(0.96) rotate(1deg); }
          100% { opacity: 1; transform: scale(1) rotate(0deg); }
        }
        @keyframes badgeFadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes tierGlow {
          0%,100% { opacity: 0.6; }
          50%     { opacity: 1; }
        }
      `}</style>

      {/* Celebration overlay */}
      {celebrating && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 9900,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: 'rgba(0,0,0,0.88)', padding: 20,
          animation: 'badgeFadeIn 0.3s ease',
        }}>
          <div className="card-3d" style={{
            background: B.charcoal, border: `2px solid ${tierColor}`,
            borderRadius: 16, padding: '44px 52px', textAlign: 'center',
            boxShadow: `0 0 60px ${tierColor}30`,
            animation: 'stampIn 0.55s cubic-bezier(0.34,1.56,0.64,1)',
          }}>
            <div style={{ fontSize: '3rem', marginBottom: 14 }}>🎟</div>
            <div style={{ fontFamily: "'Bebas Neue'", fontSize: 'clamp(1.5rem,5vw,2rem)', color: tierColor, letterSpacing: '0.18em', marginBottom: 6 }}>
              BADGE ISSUED
            </div>
            <div style={{ fontFamily: "'Space Mono'", fontSize: '0.65rem', color: B.smoke, marginBottom: 14 }}>
              {tier} · {TIER_DESC[tier].toUpperCase()} · {displayName}
            </div>
            <div style={{ fontFamily: "'Orbitron'", fontSize: '1rem', fontWeight: 900, color: B.neonLime }}>
              +{TIER_XP[tier]} XP EARNED
            </div>
          </div>
        </div>
      )}

      <div style={{ maxWidth: 720, margin: '0 auto' }}>
        <SectionTag>BADGE MAKER</SectionTag>
        <h2 className="reveal-3d text-3d" style={{ fontFamily: "'Bebas Neue'", fontSize: 'clamp(2.5rem,6vw,4rem)', color: B.white, letterSpacing: '0.05em', marginBottom: 8 }}>
          CREATE YOUR EVENT BADGE
        </h2>
        <p style={{ color: B.smoke, fontFamily: "'Space Mono'", fontSize: '0.78rem', marginBottom: 6 }}>
          Your official digital pass for Sneakers Fest '26
        </p>

        {/* Social proof */}
        <div className="reveal-3d" style={{
          fontFamily: "'Space Mono'", fontSize: '0.58rem', color: B.smoke, marginBottom: 30,
          animation: 'tierGlow 3.5s ease-in-out infinite',
        }}>
          <span style={{ color: B.amber }}>{badgeCount === null ? '—' : badgeCount.toLocaleString()}</span> badges created
        </div>

        {/* Inputs */}
        <div style={{ display: 'flex', gap: 12, marginBottom: 24, flexWrap: 'wrap' }}>
          <input aria-label="Your name"
            value={name}
            onChange={e => setName(e.target.value)}
            maxLength={24}
            placeholder="Your name"
            style={{
              flex: '1 1 180px', background: B.charcoal, border: `1px solid ${B.gunmetal}`,
              borderRadius: 6, padding: '10px 14px', color: B.white,
              fontFamily: "'Space Mono'", fontSize: '0.85rem', outline: 'none',
            }}
            onFocus={e => { e.currentTarget.style.borderColor = B.amber }}
            onBlur={e => { e.currentTarget.style.borderColor = B.gunmetal }}
          />
          <input aria-label="Your city"
            value={city}
            onChange={e => setCity(e.target.value)}
            maxLength={20}
            placeholder="Your city"
            style={{
              flex: '1 1 140px', background: B.charcoal, border: `1px solid ${B.gunmetal}`,
              borderRadius: 6, padding: '10px 14px', color: B.white,
              fontFamily: "'Space Mono'", fontSize: '0.85rem', outline: 'none',
            }}
            onFocus={e => { e.currentTarget.style.borderColor = B.amber }}
            onBlur={e => { e.currentTarget.style.borderColor = B.gunmetal }}
          />
          <select aria-label="Badge style"
            value={tier}
            onChange={e => setTier(e.target.value)}
            style={{
              flex: '1 1 120px', background: B.charcoal, border: `1px solid ${B.gunmetal}`,
              borderRadius: 6, padding: '10px 14px', color: B.white,
              fontFamily: "'Space Mono'", fontSize: '0.8rem', cursor: 'pointer',
            }}
          >
            {TIERS.map(t => <option key={t} value={t}>{t} — +{TIER_XP[t]} XP</option>)}
          </select>
        </div>

        {/* Tier XP hint */}
        <div style={{
          fontFamily: "'Space Mono'", fontSize: '0.55rem', color: tierColor,
          marginBottom: 20, opacity: 0.75, letterSpacing: '0.06em',
        }}>
          {TIER_DESC[tier].toUpperCase()} · DOWNLOAD EARNS +{TIER_XP[tier]} XP
        </div>

        {/* Live Badge Preview */}
        <div className="card-3d" style={{ display: 'flex', justifyContent: 'center', marginBottom: 28 }}>
          <svg
            ref={svgRef}
            viewBox="0 0 620 310"
            width="100%"
            style={{ maxWidth: 620, display: 'block' }}
            xmlns="http://www.w3.org/2000/svg"
          >
            <rect width="620" height="310" fill="#0A0A0A" rx="12" />
            <rect x="3" y="3" width="614" height="304" rx="10" fill="none" stroke="#F5A623" strokeWidth="1.5" />
            <rect x="9" y="9" width="602" height="292" rx="8" fill="none" stroke="#F5A62318" strokeWidth="1" />
            <rect x="0" y="0" width="7" height="310" rx="12" fill="#F5A623" />
            <text x="24" y="44" fontFamily="'Courier New', monospace" fontSize="10" fill="#F5A623" letterSpacing="4" fontWeight="bold">SNEAKERS FEST '26</text>
            <text x="24" y="60" fontFamily="'Courier New', monospace" fontSize="7" fill="#8A8A8A" letterSpacing="3">THE SOLE EXHIBITION · MURI OKUNOLA PARK, V/I</text>
            <line x1="24" y1="74" x2="596" y2="74" stroke="#2A2A2A" strokeWidth="1" />
            <g transform="translate(510,30) scale(0.22)" opacity="0.25">
              <path d="M 65 158 L 58 132 Q 52 110 74 94 L 138 72 Q 188 56 248 58 Q 318 58 346 78 L 362 100 Q 372 124 366 148 L 362 158 Z" fill="#F5A623" />
              <rect x="48" y="158" width="318" height="24" rx="8" fill="#F5A623" />
            </g>
            <text x="24" y={132} fontFamily="Georgia, 'Times New Roman', serif" fontSize={fontSize} fill="#F0EDE6" fontWeight="bold">{displayName}</text>
            <text x="24" y="160" fontFamily="'Courier New', monospace" fontSize="12" fill="#8A8A8A" letterSpacing="3">{displayCity}</text>
            <line x1="24" y1="176" x2="596" y2="176" stroke="#2A2A2A" strokeWidth="1" />
            <rect x="24" y="192" width={tier.length * 10 + 28} height="26" rx="4" fill="#F5A62318" stroke="#F5A623" strokeWidth="1" />
            <text x={24 + (tier.length * 10 + 28) / 2} y="209" fontFamily="'Courier New', monospace" fontSize="10" fill="#F5A623" letterSpacing="3" textAnchor="middle" dominantBaseline="middle">{tier}</text>
            <text x="596" y="209" fontFamily="'Courier New', monospace" fontSize="11" fill="#F0EDE6" textAnchor="end" letterSpacing="1">DEC 12 · 2026</text>
            {Array.from({ length: 24 }, (_, i) => (
              <rect key={i} x={24 + i * 5} y="240" width={i % 4 === 0 ? 3 : 2} height={i % 5 === 0 ? 22 : 14} fill="#2A2A2A" />
            ))}
            <text x="596" y="270" fontFamily="'Courier New', monospace" fontSize="8" fill="#3A3A3A" textAnchor="end" letterSpacing="2">{badgeId}</text>
            <text x="24" y="298" fontFamily="'Courier New', monospace" fontSize="7" fill="#2A2A2A" letterSpacing="2">MURI OKUNOLA PARK · VICTORIA ISLAND · LAGOS, NIGERIA</text>
            <text x="596" y="298" fontFamily="'Courier New', monospace" fontSize="7" fill="#2A2A2A" textAnchor="end">sneakersfest26.com</text>
          </svg>
        </div>

        <div className="reveal-3d" style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
          <button
            onClick={download}
            style={{
              background: downloaded ? B.neonLime : B.amber, color: B.black, border: 'none',
              padding: '12px 36px', fontFamily: "'Bebas Neue'", fontSize: '1.2rem',
              letterSpacing: '0.1em', cursor: 'pointer', borderRadius: 4,
              transition: 'all 0.2s',
            }}
          >
            {downloaded ? '✓ BADGE SAVED!' : 'DOWNLOAD BADGE (SVG)'}
          </button>
          <button
            onClick={share}
            style={{
              background: 'transparent', border: `1px solid ${B.neonCyan}60`,
              color: B.neonCyan, padding: '12px 24px',
              fontFamily: "'Bebas Neue'", fontSize: '1.2rem', letterSpacing: '0.1em',
              cursor: 'pointer', borderRadius: 4,
            }}
          >
            {shared ? '✓ COPIED' : 'SHARE IT'}
          </button>
        </div>
        <p style={{ textAlign: 'center', color: B.smoke, fontFamily: "'Space Mono'", fontSize: '0.58rem', marginTop: 10 }}>
          Opens in any browser · shareable on WhatsApp, IG Stories, and Twitter
        </p>
      </div>
    </section>
  )
}
