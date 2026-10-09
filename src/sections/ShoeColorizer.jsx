import { useState } from 'react'
import { B } from '../tokens'
import { GrainOverlay, ScanLines, SectionTag } from '../components/Shared'
import Egg from '../components/Egg'
import {
  useFestivalGamification,
  playFestivalSound,
  dispatchFestivalAction,
  FESTIVAL_ACTIONS,
} from '../framework/festivalFramework'

const ZONES = [
  { id: 'upper',  label: 'UPPER',  default: '#FFCC00' },
  { id: 'sole',   label: 'SOLE',   default: '#F8F9FA' },
  { id: 'laces',  label: 'LACES',  default: '#0F1115' },
  { id: 'logo',   label: 'SWOOSH', default: '#B8FF00' },
  { id: 'tongue', label: 'TONGUE', default: '#1A1A2E' },
]

const PALETTE = [
  { name: 'Danfo Yellow', hex: '#FFCC00' },
  { name: 'Eyo White', hex: '#FFFFFF' },
  { name: 'Lagos Cyan', hex: '#00F0FF' },
  { name: 'Afrobeat Lime', hex: '#B8FF00' },
  { name: 'Mainland Orange', hex: '#FF6B35' },
  { name: 'Lekki Black', hex: '#0A0A0A' },
  { name: 'Sunset Magenta', hex: '#FF2D7B' },
  { name: 'Royal Purple', hex: '#7B2FBE' },
  { name: 'Vintage Cream', hex: '#F0EDE6' },
  { name: 'Charcoal Grey', hex: '#2A2A2A' },
  { name: 'Eko Blue', hex: '#4A90D9' },
  { name: 'Crimson Red', hex: '#FF4444' },
]

const LAGOS_PRESETS = [
  {
    name: '🚕 DANFO 1-OF-1',
    theme: 'danfo-stripes',
    colors: { upper: '#FFCC00', sole: '#FFFFFF', laces: '#0A0A0A', logo: '#B8FF00', tongue: '#1A1A1A' }
  },
  {
    name: '🌊 LAGOS LAGOON',
    theme: 'clean',
    colors: { upper: '#00F0FF', sole: '#0A0A0A', laces: '#FFFFFF', logo: '#7B2FBE', tongue: '#1A1A2E' }
  },
  {
    name: '🕊️ EYO MASQUERADE',
    theme: 'adire',
    colors: { upper: '#FFFFFF', sole: '#F0EDE6', laces: '#FF4444', logo: '#F5A623', tongue: '#FFFFFF' }
  },
  {
    name: '👑 CATALYST GRAIL',
    theme: 'off-white',
    colors: { upper: '#0A0A0A', sole: '#FFCC00', laces: '#B8FF00', logo: '#FFFFFF', tongue: '#2A2A2A' }
  },
]

export default function ShoeColorizer() {
  const [colors, setColors] = useState(Object.fromEntries(ZONES.map(z => [z.id, z.default])))
  const [activeZone, setActiveZone] = useState('upper')
  const [activeTexture, setActiveTexture] = useState('danfo-stripes')
  const [modelName, setModelName] = useState("Air Danfo 1 'Eyo Special'")
  const [creatorName, setCreatorName] = useState('@kicks_of_lagos')
  const [mintedPass, setMintedPass] = useState(null)
  const [copied, setCopied] = useState(false)

  const { awardXP, unlockBadge } = useFestivalGamification()
  const c = colors

  function pickColor(color) {
    setColors(prev => ({ ...prev, [activeZone]: color }))
    playFestivalSound('zone_click')
  }

  function applyPreset(preset) {
    setColors(preset.colors)
    setActiveTexture(preset.theme)
    setModelName(preset.name.replace(/[^a-zA-Z0-9 ]/g, '').trim())
    playFestivalSound('zone_click')
  }

  function handleMintCustom() {
    const serial = `MINT-DF-${Math.floor(1000 + Math.random() * 9000)}`
    const pass = {
      serial,
      name: modelName || 'Custom 1-of-1',
      creator: creatorName || 'Anonymous Sneakerhead',
      theme: activeTexture,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    }
    setMintedPass(pass)

    try {
      const existing = JSON.parse(localStorage.getItem('sf26_minted_customs') || '[]')
      localStorage.setItem('sf26_minted_customs', JSON.stringify([...existing, pass]))
    } catch {}

    awardXP(150, `Minted Custom: ${pass.name}`)
    unlockBadge('MASTER_CUSTOMIZER')
    playFestivalSound('badge_unlock')
    dispatchFestivalAction(FESTIVAL_ACTIONS.ADD_NOTIFICATION, {
      title: '🎨 1-OF-1 CUSTOM SNEAKER MINTED (+150 XP)',
      message: `${pass.name} entered into Muri Okunola Park Custom Battle! Serial: ${serial}`
    })
  }

  function shareColorway() {
    const code = ZONES.map(z => colors[z.id].replace('#', '')).join('-')
    navigator.clipboard.writeText(`My Lagos 1-of-1 Custom: ${modelName} [${code}] · https://sneakers-fest-55.netlify.app/`)
    setCopied(true)
    playFestivalSound('xp_gain')
    setTimeout(() => setCopied(false), 2500)
  }

  const zoneStyle = (id) => ({
    cursor: 'pointer',
    opacity: activeZone === id ? 1 : 0.94,
    transition: 'all 0.15s ease',
  })

  return (
    <section id="danfo-custom-lab" style={{ background: '#080A0E', padding: '90px 20px', position: 'relative', overflow: 'hidden' }}>
      <GrainOverlay />
      <Egg id="egg-043" corner="top-right" />
      <Egg id="egg-044" corner="bottom-left" />
      <ScanLines />

      <div style={{ maxWidth: 960, margin: '0 auto', position: 'relative', zIndex: 5 }}>
        <SectionTag>INTERACTIVE WORKSHOP</SectionTag>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: 14, marginBottom: 28 }}>
          <div>
            <h2 className="reveal-3d" style={{ fontFamily: "'Orbitron', monospace", fontWeight: 900, fontSize: 'clamp(24px, 4.5vw, 40px)', color: B.white, lineHeight: 1.1 }}>
              DANFO CUSTOM <span style={{ color: B.amber }}>SNEAKER LAB</span>
            </h2>
            <p style={{ color: B.smoke, fontFamily: "'Syne', sans-serif", fontSize: 14, marginTop: 8, maxWidth: 580, lineHeight: 1.6 }}>
              Design your bespoke 1-of-1 Lagos custom shoe. Apply transit stencils, Adire indigo patterns, and industrial quotation typography, then mint your creation to battle on festival day.
            </p>
          </div>

          {/* Quick Culture Preset Buttons */}
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {LAGOS_PRESETS.map(p => (
              <button
                key={p.name}
                onClick={() => applyPreset(p)}
                style={{
                  padding: '7px 12px',
                  background: 'rgba(255,255,255,0.04)',
                  border: `1px solid ${B.gunmetal}`,
                  borderRadius: 6,
                  color: B.mist,
                  fontFamily: "'Space Mono', monospace",
                  fontSize: 8.5,
                  fontWeight: 700,
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
              >
                {p.name}
              </button>
            ))}
          </div>
        </div>

        {/* Main Work Area */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(0, 1.4fr) minmax(280px, 1fr)',
          gap: 24,
          alignItems: 'start',
        }}>
          {/* Shoe Canvas Box */}
          <div className="card-3d" style={{
            background: 'radial-gradient(circle at 50% 50%, #151922 0%, #0c0e14 100%)',
            borderRadius: 16,
            padding: '36px 20px',
            border: `1px solid ${B.amber}44`,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: 340,
            boxShadow: '0 16px 50px rgba(0,0,0,0.7)',
            position: 'relative'
          }}>
            {/* Model Badge Overlay */}
            <div style={{ position: 'absolute', top: 16, left: 20, display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontFamily: "'Orbitron', monospace", fontSize: 13, fontWeight: 800, color: B.white }}>
                {modelName}
              </span>
              <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 8, color: B.amber, background: 'rgba(255,184,0,0.1)', padding: '2px 6px', borderRadius: 4 }}>
                1-OF-1 EDITION
              </span>
            </div>

            {/* Industrial Quotation Typography */}
            <div style={{ position: 'absolute', top: 16, right: 20, fontFamily: "'Space Mono', monospace", fontSize: 9, color: B.neonCyan, letterSpacing: '0.15em' }}>
              "LAGOS '26"
            </div>

            <svg viewBox="0 0 420 210" width="100%" style={{ maxWidth: 420, filter: 'drop-shadow(0 16px 45px rgba(0,0,0,0.85))' }}>
              <defs>
                {/* Danfo transit hazard stripe pattern */}
                <pattern id="danfo-stripes" width="16" height="16" patternTransform="rotate(45 0 0)" patternUnits="userSpaceOnUse">
                  <line x1="0" y1="0" x2="0" y2="16" stroke="#000000" strokeWidth="6" />
                  <line x1="8" y1="0" x2="8" y2="16" stroke="#FFCC00" strokeWidth="6" />
                </pattern>
                {/* Adire batik geometric dot pattern */}
                <pattern id="adire-batik" width="12" height="12" patternUnits="userSpaceOnUse">
                  <circle cx="2" cy="2" r="1.5" fill="#3B82F6" opacity="0.6" />
                  <circle cx="8" cy="8" r="1.5" fill="#1D4ED8" opacity="0.6" />
                </pattern>
              </defs>

              {/* Outer sole */}
              <rect x="48" y="162" width="318" height="26" rx="10" fill={c.sole} onClick={() => setActiveZone('sole')} style={zoneStyle('sole')} />
              {/* Midsole stripe */}
              <rect x="52" y="156" width="310" height="10" rx="4" fill={c.sole} onClick={() => setActiveZone('sole')} style={zoneStyle('sole')} />

              {/* Midsole text stamp */}
              <text x="90" y="178" fill="#000" opacity="0.35" fontFamily="'Space Mono', monospace" fontSize="8" fontWeight="bold">
                "AIR FESTIVAL LAGOS"
              </text>

              {/* Main upper */}
              <path
                d="M 65 158 L 58 132 Q 52 110 74 94 L 138 72 Q 188 56 248 58 Q 318 58 346 78 L 362 100 Q 372 124 366 148 L 362 158 Z"
                fill={c.upper}
                onClick={() => setActiveZone('upper')}
                style={zoneStyle('upper')}
              />

              {/* Texture stencil overlay on upper */}
              {activeTexture === 'danfo-stripes' && (
                <path
                  d="M 65 158 L 58 132 Q 52 110 74 94 L 138 72 Q 188 56 248 58 Q 318 58 346 78 L 362 100 Q 372 124 366 148 L 362 158 Z"
                  fill="url(#danfo-stripes)"
                  opacity="0.35"
                  style={{ pointerEvents: 'none' }}
                />
              )}
              {activeTexture === 'adire' && (
                <path
                  d="M 65 158 L 58 132 Q 52 110 74 94 L 138 72 Q 188 56 248 58 Q 318 58 346 78 L 362 100 Q 372 124 366 148 L 362 158 Z"
                  fill="url(#adire-batik)"
                  opacity="0.45"
                  style={{ pointerEvents: 'none' }}
                />
              )}

              {/* Toe cap */}
              <path
                d="M 58 132 Q 52 110 74 94 L 105 80 Q 84 100 80 132 Z"
                fill={`${c.upper}EE`}
                onClick={() => setActiveZone('upper')}
                style={zoneStyle('upper')}
              />

              {/* Collar / heel */}
              <path
                d="M 178 72 Q 166 90 162 118 L 168 158 L 202 158 L 202 132 Q 218 112 222 84"
                fill={`${c.upper}CC`}
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

              {/* Swoosh / Logo */}
              <path
                d="M 268 132 Q 312 110 342 122 Q 318 140 272 145 Z"
                fill={c.logo}
                onClick={() => setActiveZone('logo')}
                style={zoneStyle('logo')}
              />

              {/* Active zone indicator rings */}
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

            {/* Minted Certificate Overlay */}
            {mintedPass && (
              <div style={{
                marginTop: 18,
                padding: '12px 18px',
                background: 'rgba(184, 255, 0, 0.08)',
                border: `1px solid ${B.neonLime}`,
                borderRadius: 8,
                width: '100%',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <div>
                  <div style={{ fontFamily: "'Orbitron', monospace", fontSize: 10, color: B.neonLime, fontWeight: 700 }}>
                    ✓ MINTED SERIAL: {mintedPass.serial}
                  </div>
                  <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 9, color: B.smoke, marginTop: 2 }}>
                    By {mintedPass.creator} · Registered for Muri Okunola Park Custom Battle
                  </div>
                </div>
                <span style={{ fontSize: 16 }}>🏆</span>
              </div>
            )}
          </div>

          {/* Controls & Customizer Deck */}
          <div style={{ background: '#0D0F14', borderRadius: 16, border: `1px solid ${B.gunmetal}`, padding: 20 }}>
            {/* Zone Selection */}
            <p style={{ color: B.smoke, fontFamily: "'Space Mono', monospace", fontSize: 9, letterSpacing: '0.15em', marginBottom: 8 }}>
              SELECT COMPONENT ZONE
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(80px, 1fr))', gap: 6, marginBottom: 18 }}>
              {ZONES.map(z => (
                <button
                  key={z.id}
                  onClick={() => {
                    setActiveZone(z.id)
                    playFestivalSound('zone_click')
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                    padding: '8px 10px',
                    background: activeZone === z.id ? `${B.amber}22` : 'rgba(255,255,255,0.02)',
                    border: `1px solid ${activeZone === z.id ? B.amber : B.gunmetal}`,
                    borderRadius: 6,
                    cursor: 'pointer',
                    transition: 'all 0.15s'
                  }}
                >
                  <span style={{
                    width: 12, height: 12, borderRadius: 2,
                    background: colors[z.id], border: '1px solid rgba(255,255,255,0.2)',
                    flexShrink: 0
                  }} />
                  <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 8.5, color: activeZone === z.id ? B.amber : B.white, fontWeight: 700 }}>
                    {z.label}
                  </span>
                </button>
              ))}
            </div>

            {/* Cultural Stencil Selector */}
            <p style={{ color: B.smoke, fontFamily: "'Space Mono', monospace", fontSize: 9, letterSpacing: '0.15em', marginBottom: 8 }}>
              SIGNATURE LAGOS STENCIL
            </p>
            <div style={{ display: 'flex', gap: 6, marginBottom: 18, flexWrap: 'wrap' }}>
              {[
                { id: 'danfo-stripes', label: '🚕 DANFO HAZARD' },
                { id: 'adire', label: '🎨 ADIRE BATIK' },
                { id: 'clean', label: '✨ FACTORY CLEAN' }
              ].map(st => (
                <button
                  key={st.id}
                  onClick={() => {
                    setActiveTexture(st.id)
                    playFestivalSound('zone_click')
                  }}
                  style={{
                    flex: '1 1 80px',
                    padding: '7px 10px',
                    borderRadius: 6,
                    background: activeTexture === st.id ? 'rgba(0, 229, 255, 0.15)' : 'rgba(255,255,255,0.02)',
                    border: `1px solid ${activeTexture === st.id ? B.neonCyan : B.gunmetal}`,
                    color: activeTexture === st.id ? B.neonCyan : B.smoke,
                    fontFamily: "'Space Mono', monospace",
                    fontSize: 8,
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}
                >
                  {st.label}
                </button>
              ))}
            </div>

            {/* Color Palette Swatches */}
            <p style={{ color: B.smoke, fontFamily: "'Space Mono', monospace", fontSize: 9, letterSpacing: '0.15em', marginBottom: 8 }}>
              LAGOS STREET PALETTE ({colors[activeZone]})
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 6, marginBottom: 18 }}>
              {PALETTE.map(item => (
                <button
                  key={item.hex}
                  onClick={() => pickColor(item.hex)}
                  title={item.name}
                  style={{
                    width: '100%',
                    aspectRatio: '1',
                    background: item.hex,
                    border: 'none',
                    borderRadius: 5,
                    cursor: 'pointer',
                    outline: colors[activeZone] === item.hex ? `2px solid ${B.amber}` : 'none',
                    outlineOffset: 2,
                    transition: 'all 0.12s'
                  }}
                />
              ))}
            </div>

            {/* Customizer Branding Form */}
            <div style={{ borderTop: `1px dashed ${B.gunmetal}`, paddingTop: 14, marginBottom: 16 }}>
              <label style={{ display: 'block', fontFamily: "'Space Mono', monospace", fontSize: 8.5, color: B.smoke, marginBottom: 4 }}>
                SNEAKER MODEL NAME
              </label>
              <input
                type="text"
                value={modelName}
                onChange={(e) => setModelName(e.target.value)}
                style={{
                  width: '100%',
                  padding: '9px 12px',
                  borderRadius: 6,
                  background: '#141822',
                  border: `1px solid ${B.gunmetal}`,
                  color: B.white,
                  fontFamily: "'Space Mono', monospace",
                  fontSize: 11,
                  outline: 'none',
                  marginBottom: 10
                }}
              />

              <label style={{ display: 'block', fontFamily: "'Space Mono', monospace", fontSize: 8.5, color: B.smoke, marginBottom: 4 }}>
                CREATOR HANDLE / ALIAS
              </label>
              <input
                type="text"
                value={creatorName}
                onChange={(e) => setCreatorName(e.target.value)}
                style={{
                  width: '100%',
                  padding: '9px 12px',
                  borderRadius: 6,
                  background: '#141822',
                  border: `1px solid ${B.gunmetal}`,
                  color: B.white,
                  fontFamily: "'Space Mono', monospace",
                  fontSize: 11,
                  outline: 'none',
                  marginBottom: 14
                }}
              />

              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <button
                  onClick={handleMintCustom}
                  style={{
                    width: '100%',
                    padding: '13px',
                    background: `linear-gradient(90deg, ${B.amber}, #FFA000)`,
                    border: 'none',
                    borderRadius: 8,
                    color: B.black,
                    fontFamily: "'Space Mono', monospace",
                    fontSize: 11,
                    fontWeight: 900,
                    letterSpacing: '0.12em',
                    cursor: 'pointer',
                    boxShadow: '0 6px 20px rgba(255, 184, 0, 0.35)'
                  }}
                >
                  🎨 MINT 1-OF-1 CUSTOM (+150 XP)
                </button>

                <button
                  onClick={shareColorway}
                  style={{
                    width: '100%',
                    padding: '10px',
                    background: 'transparent',
                    border: `1px solid ${copied ? B.neonLime : B.neonCyan}`,
                    borderRadius: 8,
                    color: copied ? B.neonLime : B.neonCyan,
                    fontFamily: "'Space Mono', monospace",
                    fontSize: 9.5,
                    fontWeight: 700,
                    cursor: 'pointer',
                    letterSpacing: '0.1em'
                  }}
                >
                  {copied ? '✓ COLORWAY COPIED!' : '📋 COPY COLORWAY SPEC'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
