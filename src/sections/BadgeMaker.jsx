import { useState, useRef } from 'react'
import { B } from '../tokens'
import { GrainOverlay, ScanLines, SectionTag } from '../components/Shared'

const TIERS = ['ATTENDEE', 'VIP', 'VENDOR', 'PRESS', 'SPEAKER']

export default function BadgeMaker() {
  const [name, setName] = useState('')
  const [city, setCity] = useState('')
  const [tier, setTier] = useState('ATTENDEE')
  const [downloaded, setDownloaded] = useState(false)
  const [badgeId] = useState(() => `SF26-${Math.random().toString(36).slice(2,7).toUpperCase()}`)
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
    setDownloaded(true)
    setTimeout(() => setDownloaded(false), 2000)
  }

  return (
    <section id="badge" style={{ background: B.void, padding: '80px 20px', position: 'relative', overflow: 'hidden' }}>
      <GrainOverlay /><ScanLines />
      <div style={{ maxWidth: 720, margin: '0 auto' }}>
        <SectionTag>BADGE MAKER</SectionTag>
        <h2 style={{ fontFamily: "'Bebas Neue'", fontSize: 'clamp(2.5rem,6vw,4rem)', color: B.white, letterSpacing: '0.05em', marginBottom: 8 }}>
          CREATE YOUR EVENT BADGE
        </h2>
        <p style={{ color: B.smoke, fontFamily: "'Space Mono'", fontSize: '0.78rem', marginBottom: 36 }}>
          Your official digital pass for Sneakers Fest '26
        </p>

        {/* Inputs */}
        <div style={{ display: 'flex', gap: 12, marginBottom: 36, flexWrap: 'wrap' }}>
          <input
            value={name}
            onChange={e => setName(e.target.value)}
            maxLength={24}
            placeholder="Your name"
            style={{
              flex: '1 1 180px', background: B.charcoal, border: `1px solid ${B.gunmetal}`,
              borderRadius: 6, padding: '10px 14px', color: B.white,
              fontFamily: "'Space Mono'", fontSize: '0.85rem', outline: 'none',
            }}
          />
          <input
            value={city}
            onChange={e => setCity(e.target.value)}
            maxLength={20}
            placeholder="Your city"
            style={{
              flex: '1 1 140px', background: B.charcoal, border: `1px solid ${B.gunmetal}`,
              borderRadius: 6, padding: '10px 14px', color: B.white,
              fontFamily: "'Space Mono'", fontSize: '0.85rem', outline: 'none',
            }}
          />
          <select
            value={tier}
            onChange={e => setTier(e.target.value)}
            style={{
              flex: '1 1 120px', background: B.charcoal, border: `1px solid ${B.gunmetal}`,
              borderRadius: 6, padding: '10px 14px', color: B.white,
              fontFamily: "'Space Mono'", fontSize: '0.8rem', cursor: 'pointer',
            }}
          >
            {TIERS.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>

        {/* Live Badge Preview */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 28 }}>
          <svg
            ref={svgRef}
            viewBox="0 0 620 310"
            width="100%"
            style={{ maxWidth: 620, display: 'block' }}
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Background */}
            <rect width="620" height="310" fill="#0A0A0A" rx="12" />
            <rect x="3" y="3" width="614" height="304" rx="10" fill="none" stroke="#F5A623" strokeWidth="1.5" />
            <rect x="9" y="9" width="602" height="292" rx="8" fill="none" stroke="#F5A62318" strokeWidth="1" />

            {/* Left accent bar */}
            <rect x="0" y="0" width="7" height="310" rx="12" fill="#F5A623" />

            {/* Header */}
            <text x="24" y="44" fontFamily="'Courier New', monospace" fontSize="10" fill="#F5A623" letterSpacing="4" fontWeight="bold">SNEAKERS FEST '26</text>
            <text x="24" y="60" fontFamily="'Courier New', monospace" fontSize="7" fill="#8A8A8A" letterSpacing="3">THE SOLE EXHIBITION · EKO ATLANTIC CITY</text>

            {/* Divider */}
            <line x1="24" y1="74" x2="596" y2="74" stroke="#2A2A2A" strokeWidth="1" />

            {/* Shoe silhouette */}
            <g transform="translate(510,30) scale(0.22)" opacity="0.25">
              <path d="M 65 158 L 58 132 Q 52 110 74 94 L 138 72 Q 188 56 248 58 Q 318 58 346 78 L 362 100 Q 372 124 366 148 L 362 158 Z" fill="#F5A623" />
              <rect x="48" y="158" width="318" height="24" rx="8" fill="#F5A623" />
            </g>

            {/* Name */}
            <text x="24" y={132} fontFamily="Georgia, 'Times New Roman', serif" fontSize={fontSize} fill="#F0EDE6" fontWeight="bold">{displayName}</text>

            {/* City */}
            <text x="24" y="160" fontFamily="'Courier New', monospace" fontSize="12" fill="#8A8A8A" letterSpacing="3">{displayCity}</text>

            {/* Divider */}
            <line x1="24" y1="176" x2="596" y2="176" stroke="#2A2A2A" strokeWidth="1" />

            {/* Tier pill */}
            <rect x="24" y="192" width={tier.length * 10 + 28} height="26" rx="4" fill="#F5A62318" stroke="#F5A623" strokeWidth="1" />
            <text x={24 + (tier.length * 10 + 28) / 2} y="209" fontFamily="'Courier New', monospace" fontSize="10" fill="#F5A623" letterSpacing="3" textAnchor="middle" dominantBaseline="middle">{tier}</text>

            {/* Date */}
            <text x="596" y="209" fontFamily="'Courier New', monospace" fontSize="11" fill="#F0EDE6" textAnchor="end" letterSpacing="1">DEC 12 · 2026</text>

            {/* Barcode decoration */}
            {Array.from({ length: 24 }, (_, i) => (
              <rect key={i} x={24 + i * 5} y="240" width={i % 4 === 0 ? 3 : 2} height={i % 5 === 0 ? 22 : 14} fill="#2A2A2A" />
            ))}

            {/* Badge ID */}
            <text x="596" y="270" fontFamily="'Courier New', monospace" fontSize="8" fill="#3A3A3A" textAnchor="end" letterSpacing="2">{badgeId}</text>

            {/* Footer */}
            <text x="24" y="298" fontFamily="'Courier New', monospace" fontSize="7" fill="#2A2A2A" letterSpacing="2">EKO ATLANTIC CITY · VICTORIA ISLAND · LAGOS, NIGERIA</text>
            <text x="596" y="298" fontFamily="'Courier New', monospace" fontSize="7" fill="#2A2A2A" textAnchor="end">sneakersfest26.com</text>
          </svg>
        </div>

        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
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
          <p style={{ width: '100%', textAlign: 'center', color: B.smoke, fontFamily: "'Space Mono'", fontSize: '0.62rem', marginTop: 4 }}>
            Opens in any browser · shareable on WhatsApp, IG Stories, and Twitter
          </p>
        </div>
      </div>
    </section>
  )
}
