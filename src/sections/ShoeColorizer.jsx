import { useState } from 'react'
import { B } from '../tokens'
import { GrainOverlay, ScanLines, SectionTag } from '../components/Shared'

const ZONES = [
  { id: 'upper',  label: 'UPPER',  default: '#1A1A2E' },
  { id: 'sole',   label: 'SOLE',   default: '#F0EDE6' },
  { id: 'laces',  label: 'LACES',  default: '#F0EDE6' },
  { id: 'logo',   label: 'LOGO',   default: '#F5A623' },
  { id: 'tongue', label: 'TONGUE', default: '#2A2A2A' },
]

const PALETTE = [
  '#F0EDE6', '#FFFFFF', '#F5A623', '#FFD080',
  '#00F0FF', '#FF2D7B', '#B8FF00', '#1A1A2E',
  '#0A0A0A', '#2A2A2A', '#FF6B35', '#7B2FBE',
  '#00C48C', '#FF4444', '#4A90D9', '#E91E8C',
]

export default function ShoeColorizer() {
  const [colors, setColors] = useState(Object.fromEntries(ZONES.map(z => [z.id, z.default])))
  const [activeZone, setActiveZone] = useState('upper')
  const [copied, setCopied] = useState(false)

  const c = colors

  function pickColor(color) {
    setColors(prev => ({ ...prev, [activeZone]: color }))
  }

  function shareColorway() {
    const code = ZONES.map(z => colors[z.id].replace('#', '')).join('-')
    navigator.clipboard.writeText(`My SF'26 colorway: ${code} | sneakersfest26.com`)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const zoneStyle = (id) => ({
    cursor: 'pointer',
    opacity: activeZone === id ? 1 : 0.92,
    transition: 'opacity 0.15s',
  })

  return (
    <section id="colorizer" style={{ background: B.black, padding: '80px 20px', position: 'relative', overflow: 'hidden' }}>
      <GrainOverlay />
      <ScanLines />
      <div style={{ maxWidth: 900, margin: '0 auto' }}>
        <SectionTag label="SHOE BUILDER" />
        <h2 style={{ fontFamily: "'Bebas Neue'", fontSize: 'clamp(2.5rem,6vw,4rem)', color: B.white, letterSpacing: '0.05em', marginBottom: 8 }}>
          BUILD YOUR COLORWAY
        </h2>
        <p style={{ color: B.smoke, fontFamily: "'Space Mono'", fontSize: '0.8rem', marginBottom: 48 }}>
          Select a zone · tap a color · own the look
        </p>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(0,1fr) 220px',
          gap: 32, alignItems: 'start',
        }}>
          {/* Shoe canvas */}
          <div style={{
            background: B.charcoal, borderRadius: 12, padding: '32px 24px',
            border: `1px solid ${B.gunmetal}`, display: 'flex',
            justifyContent: 'center', alignItems: 'center', minHeight: 220,
          }}>
            <svg viewBox="0 0 420 210" width="100%" style={{ maxWidth: 420, filter: 'drop-shadow(0 12px 40px rgba(0,0,0,0.7))' }}>
              {/* Outer sole */}
              <rect x="48" y="162" width="318" height="26" rx="10" fill={c.sole} onClick={() => setActiveZone('sole')} style={zoneStyle('sole')} />
              {/* Midsole stripe */}
              <rect x="52" y="156" width="310" height="10" rx="4" fill={c.sole} onClick={() => setActiveZone('sole')} style={zoneStyle('sole')} />

              {/* Main upper */}
              <path
                d="M 65 158 L 58 132 Q 52 110 74 94 L 138 72 Q 188 56 248 58 Q 318 58 346 78 L 362 100 Q 372 124 366 148 L 362 158 Z"
                fill={c.upper}
                onClick={() => setActiveZone('upper')}
                style={zoneStyle('upper')}
              />

              {/* Toe cap */}
              <path
                d="M 58 132 Q 52 110 74 94 L 105 80 Q 84 100 80 132 Z"
                fill={`${c.upper}DD`}
                onClick={() => setActiveZone('upper')}
                style={zoneStyle('upper')}
              />

              {/* Collar / heel */}
              <path
                d="M 178 72 Q 166 90 162 118 L 168 158 L 202 158 L 202 132 Q 218 112 222 84"
                fill={`${c.upper}BB`}
                onClick={() => setActiveZone('upper')}
                style={zoneStyle('upper')}
              />

              {/* Tongue */}
              <path
                d="M 178 72 Q 194 56 216 57 L 222 60 Q 225 62 224 68 L 221 88 Q 212 94 196 93 Z"
                fill={c.tongue}
                onClick={() => setActiveZone('tongue')}
                style={zoneStyle('tongue')}
              />

              {/* Lace eyestay line */}
              <path
                d="M 178 72 Q 187 102 190 134"
                stroke={c.laces}
                strokeWidth="2.5"
                fill="none"
                strokeDasharray="5,3"
                onClick={() => setActiveZone('laces')}
                style={zoneStyle('laces')}
              />

              {/* Lace bars */}
              {[86, 100, 114, 128].map((y, i) => (
                <rect
                  key={i}
                  x={182 + i * 1.5}
                  y={y}
                  width={32}
                  height={5}
                  rx={2.5}
                  fill={c.laces}
                  transform={`rotate(-8, ${182 + i * 1.5 + 16}, ${y + 2.5})`}
                  onClick={() => setActiveZone('laces')}
                  style={zoneStyle('laces')}
                />
              ))}

              {/* Logo swoosh */}
              <path
                d="M 268 132 Q 312 110 342 122 Q 318 140 272 145 Z"
                fill={c.logo}
                onClick={() => setActiveZone('logo')}
                style={zoneStyle('logo')}
              />

              {/* Active zone ring */}
              {activeZone === 'upper' && (
                <path d="M 65 158 L 58 132 Q 52 110 74 94 L 138 72 Q 188 56 248 58 Q 318 58 346 78 L 362 100 Q 372 124 366 148 L 362 158 Z" fill="none" stroke={B.amber} strokeWidth="2" strokeDasharray="6,4" />
              )}
              {activeZone === 'sole' && (
                <rect x="46" y="154" width="322" height="36" rx="10" fill="none" stroke={B.amber} strokeWidth="2" strokeDasharray="6,4" />
              )}
              {activeZone === 'tongue' && (
                <path d="M 176 70 Q 192 54 218 55 L 226 62 L 223 90 Q 210 96 194 95 Z" fill="none" stroke={B.amber} strokeWidth="2" strokeDasharray="4,3" />
              )}
              {activeZone === 'logo' && (
                <path d="M 266 130 Q 313 108 344 120 Q 316 142 270 147 Z" fill="none" stroke={B.amber} strokeWidth="2" strokeDasharray="4,3" />
              )}
              {activeZone === 'laces' && (
                <path d="M 176 70 Q 185 100 188 136" stroke={B.amber} strokeWidth="3" fill="none" strokeDasharray="5,3" />
              )}
            </svg>
          </div>

          {/* Controls */}
          <div>
            <p style={{ color: B.smoke, fontFamily: "'Space Mono'", fontSize: '0.62rem', letterSpacing: '0.15em', marginBottom: 10 }}>SELECT ZONE</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 24 }}>
              {ZONES.map(z => (
                <button
                  key={z.id}
                  onClick={() => setActiveZone(z.id)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 10, padding: '8px 12px',
                    background: activeZone === z.id ? `${B.amber}18` : 'transparent',
                    border: `1px solid ${activeZone === z.id ? B.amber : B.gunmetal}`,
                    borderRadius: 6, cursor: 'pointer', transition: 'all 0.2s',
                  }}
                >
                  <span style={{
                    width: 16, height: 16, borderRadius: 3,
                    background: colors[z.id], border: '1px solid rgba(255,255,255,0.18)',
                    flexShrink: 0,
                  }} />
                  <span style={{ fontFamily: "'Orbitron'", fontSize: '0.62rem', letterSpacing: '0.1em', color: activeZone === z.id ? B.amber : B.white }}>
                    {z.label}
                  </span>
                </button>
              ))}
            </div>

            <p style={{ color: B.smoke, fontFamily: "'Space Mono'", fontSize: '0.62rem', letterSpacing: '0.15em', marginBottom: 10 }}>COLOR</p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 6, marginBottom: 10 }}>
              {PALETTE.map(color => (
                <button
                  key={color}
                  onClick={() => pickColor(color)}
                  title={color}
                  style={{
                    width: '100%', aspectRatio: '1', background: color, border: 'none',
                    borderRadius: 4, cursor: 'pointer',
                    outline: colors[activeZone] === color ? `2.5px solid ${B.amber}` : '2.5px solid transparent',
                    outlineOffset: 2, transition: 'outline 0.12s',
                  }}
                />
              ))}
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
              <input
                type="color"
                value={colors[activeZone]}
                onChange={e => pickColor(e.target.value)}
                style={{ width: 34, height: 34, border: 'none', background: 'none', cursor: 'pointer', padding: 0 }}
              />
              <span style={{ fontFamily: "'Space Mono'", fontSize: '0.65rem', color: B.smoke }}>custom hex</span>
            </div>

            <button
              onClick={shareColorway}
              style={{
                width: '100%', padding: '10px', background: 'transparent',
                border: `1px solid ${copied ? B.neonLime : B.neonCyan}`,
                color: copied ? B.neonLime : B.neonCyan,
                fontFamily: "'Bebas Neue'", fontSize: '0.95rem', letterSpacing: '0.1em',
                cursor: 'pointer', borderRadius: 4, transition: 'all 0.2s',
              }}
            >
              {copied ? '✓ COLORWAY COPIED!' : '📋 SHARE COLORWAY'}
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
