import { useState } from 'react'
import { B } from '../tokens'
import { GrainOverlay, SectionTag } from '../components/Shared'
import {
  useFestivalGamification,
  playFestivalSound,
  dispatchFestivalAction,
  FESTIVAL_ACTIONS
} from '../framework/festivalFramework'

const SILHOUETTES = [
  { id: 'af1', name: 'Air Force 1 Low (Lagos Classic)', baseColor: '#FFFFFF' },
  { id: 'aj1', name: 'Air Jordan 1 Retro High', baseColor: '#1A1A1A' },
  { id: 'dunk', name: 'Nike Dunk Low SB', baseColor: '#F5A623' },
  { id: 'nb9060', name: 'New Balance 9060 Chunky', baseColor: '#E0DDD5' }
]

const TEXTURES = [
  { id: 'danfo-yellow', name: 'Danfo Yellow & Black Stripes', pattern: 'stripes', hex: '#FFCC00', accent: '#0A0A0A' },
  { id: 'eyo-white', name: 'Eyo Masquerade Pristine Linen', pattern: 'clean', hex: '#FFFFFF', accent: '#C41E3A' },
  { id: 'adire-indigo', name: 'Abeokuta Hand-Dyed Adire Indigo', pattern: 'tie-dye', hex: '#1C2D5A', accent: '#64B5F6' },
  { id: 'lagos-asphalt', name: 'Third Mainland Asphalt Camo', pattern: 'splatter', hex: '#2A2D34', accent: '#FF5722' },
  { id: 'lekki-chrome', name: 'Lekki Toll Gate Liquid Chrome', pattern: 'metallic', hex: '#D4AF37', accent: '#E0E0E0' }
]

const ARTISTS = [
  { name: 'Kola "DanfoKing" Adeleke', slot: 'Dec 12 · 13:00 - 15:00', booth: 'Custom Lab Bay 01', fee: '₦45,000' },
  { name: 'Chioma "AdireSneaks" Eze', slot: 'Dec 12 · 15:30 - 17:30', booth: 'Custom Lab Bay 02', fee: '₦55,000' },
  { name: 'Tunde "Distressed" Bello', slot: 'Dec 12 · 18:00 - 20:00', booth: 'Custom Lab Bay 03', fee: '₦40,000' }
]

export default function DanfoCustomizerLab() {
  const [selectedSilhouette, setSelectedSilhouette] = useState(SILHOUETTES[0])
  const [selectedTexture, setSelectedTexture] = useState(TEXTURES[0])
  const [customText, setCustomText] = useState('LAGOS 26')
  const [selectedArtist, setSelectedArtist] = useState(ARTISTS[0])
  const [bookingConfirmed, setBookingConfirmed] = useState(false)
  const [voucherCode, setVoucherCode] = useState(null)

  const { awardXP, unlockBadge } = useFestivalGamification()

  const handleConfirmSlot = (e) => {
    e.preventDefault()
    const code = `DANFO-LAB-${Math.floor(1000 + Math.random() * 9000)}`
    setVoucherCode(code)
    setBookingConfirmed(true)

    awardXP(120, 'Danfo Custom Lab Slot Reserved')
    unlockBadge('DANFO_CUSTOM_CREATOR')
    playFestivalSound('badge_unlock')
    dispatchFestivalAction(FESTIVAL_ACTIONS.ADD_NOTIFICATION, {
      title: 'Danfo Custom Slot Reserved!',
      message: `${selectedArtist.name} at ${selectedArtist.booth}. Pass: ${code}`
    })
  }

  return (
    <section id="danfo-lab" style={{
      position: 'relative',
      overflow: 'hidden',
      background: 'radial-gradient(circle at 50% 0%, #1c1808 0%, #08090b 100%)',
      color: '#fff',
      padding: '90px 24px',
      borderTop: `1px solid ${B.amber}40`,
      borderBottom: `1px solid ${B.amber}40`
    }}>
      <div id="hype" style={{ position: 'absolute', top: 0, left: 0, width: '1px', height: '1px', visibility: 'hidden' }} />
      <GrainOverlay />

      <div style={{ maxWidth: 1200, margin: '0 auto', position: 'relative', zIndex: 10 }}>
        <SectionTag>INTERACTIVE WORKSHOP · 1-OF-1 ARTISTRY</SectionTag>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: 20, marginBottom: 40 }}>
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: `${B.amber}15`, border: `1px solid ${B.amber}50`, borderRadius: 999, padding: '4px 14px', marginBottom: 12 }}>
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: B.amber, boxShadow: `0 0 10px ${B.amber}` }} />
              <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 10, color: B.amber, letterSpacing: '0.15em', fontWeight: 700 }}>
                MURI OKUNOLA PARK · LIVE CUSTOMIZER BAY
              </span>
            </div>
            <h2 style={{ fontFamily: "'Orbitron', monospace", fontWeight: 900, fontSize: 'clamp(28px, 4.5vw, 48px)', color: B.white, lineHeight: 1.1 }}>
              DANFO CUSTOMIZER <span style={{ color: B.amber, textShadow: `0 0 25px ${B.amber}50` }}>LAB</span>
            </h2>
            <p style={{ fontFamily: "'Space Mono', monospace", fontSize: 'clamp(11px, 1.4vw, 13px)', color: B.mist, marginTop: 10, maxWidth: 640, lineHeight: 1.6 }}>
              Design a 1-of-1 silhouette inspired by Lagos transit, street art, and textile culture. Lock your physical customizer session with premier sneaker artists for December 12.
            </p>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 32 }}>
          {/* Virtual Sneaker Canvas & Spec */}
          <div style={{
            background: 'rgba(20, 22, 28, 0.75)',
            border: `1px solid ${B.gunmetal}`,
            borderRadius: 12,
            padding: 24,
            backdropFilter: 'blur(10px)',
            boxShadow: `0 10px 40px rgba(0,0,0,0.5)`
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 11, color: B.amber, fontWeight: 700, letterSpacing: '0.1em' }}>
                LIVE SILHOUETTE PREVIEW
              </span>
              <span style={{ background: `${B.neonLime}20`, border: `1px solid ${B.neonLime}60`, color: B.neonLime, padding: '3px 10px', borderRadius: 999, fontSize: 10, fontFamily: "'Space Mono', monospace" }}>
                1-OF-1 READY
              </span>
            </div>

            {/* Visual Canvas Representation */}
            <div style={{
              height: 240,
              background: `radial-gradient(circle at center, ${selectedTexture.hex}25 0%, #0d0f14 80%)`,
              border: `1px solid ${selectedTexture.hex}50`,
              borderRadius: 8,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative',
              overflow: 'hidden',
              marginBottom: 24
            }}>
              <div style={{
                fontSize: 70,
                filter: `drop-shadow(0 15px 25px ${selectedTexture.hex}60)`,
                transform: 'rotate(-10deg) scale(1.1)',
                transition: 'all 0.3s ease'
              }}>
                👟
              </div>
              <div style={{
                position: 'absolute',
                bottom: 12,
                left: 16,
                right: 16,
                display: 'flex',
                justifyContent: 'space-between',
                fontFamily: "'Space Mono', monospace",
                fontSize: 10,
                color: B.white
              }}>
                <span>STYLE: {selectedSilhouette.name.split(' ')[0]}</span>
                <span style={{ color: selectedTexture.hex }}>{customText}</span>
              </div>
            </div>

            {/* Silhouette Selector */}
            <div style={{ marginBottom: 20 }}>
              <label style={{ display: 'block', fontFamily: "'Space Mono', monospace", fontSize: 11, color: B.smoke, marginBottom: 8 }}>
                BASE SILHOUETTE
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                {SILHOUETTES.map(s => (
                  <button
                    key={s.id}
                    onClick={() => { setSelectedSilhouette(s); playFestivalSound('zone_click') }}
                    style={{
                      background: selectedSilhouette.id === s.id ? `${B.amber}25` : B.charcoal,
                      border: selectedSilhouette.id === s.id ? `1px solid ${B.amber}` : `1px solid ${B.gunmetal}`,
                      borderRadius: 6,
                      padding: '10px 12px',
                      color: selectedSilhouette.id === s.id ? B.amberGlow : B.white,
                      fontFamily: "'Space Mono', monospace",
                      fontSize: 10,
                      textAlign: 'left',
                      cursor: 'pointer'
                    }}
                  >
                    {s.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Texture / Finish Selector */}
            <div style={{ marginBottom: 20 }}>
              <label style={{ display: 'block', fontFamily: "'Space Mono', monospace", fontSize: 11, color: B.smoke, marginBottom: 8 }}>
                LAGOS CULTURE TEXTURE & MOTIF
              </label>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {TEXTURES.map(t => (
                  <button
                    key={t.id}
                    onClick={() => { setSelectedTexture(t); playFestivalSound('zone_click') }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      background: selectedTexture.id === t.id ? `${t.hex}20` : B.charcoal,
                      border: selectedTexture.id === t.id ? `1px solid ${t.hex}` : `1px solid ${B.gunmetal}`,
                      borderRadius: 6,
                      padding: '10px 14px',
                      color: B.white,
                      fontFamily: "'Space Mono', monospace",
                      fontSize: 10,
                      cursor: 'pointer'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <span style={{ width: 14, height: 14, borderRadius: 3, background: t.hex, border: `1px solid #fff` }} />
                      <span>{t.name}</span>
                    </div>
                    {selectedTexture.id === t.id && <span style={{ color: t.hex }}>SELECTED</span>}
                  </button>
                ))}
              </div>
            </div>

            {/* Custom Tag / Heel Inscription */}
            <div>
              <label style={{ display: 'block', fontFamily: "'Space Mono', monospace", fontSize: 11, color: B.smoke, marginBottom: 8 }}>
                CUSTOM HEEL INSCRIPTION (MAX 12 CHARS)
              </label>
              <input
                type="text"
                maxLength={12}
                value={customText}
                onChange={e => setCustomText(e.target.value.toUpperCase())}
                style={{
                  width: '100%',
                  background: B.charcoal,
                  border: `1px solid ${B.gunmetal}`,
                  borderRadius: 6,
                  padding: '10px 14px',
                  color: B.white,
                  fontFamily: "'Space Mono', monospace",
                  fontSize: 12,
                  textTransform: 'uppercase'
                }}
              />
            </div>
          </div>

          {/* On-Site Artist Reservation & Schedule */}
          <div style={{
            background: 'rgba(20, 22, 28, 0.75)',
            border: `1px solid ${B.gunmetal}`,
            borderRadius: 12,
            padding: 24,
            backdropFilter: 'blur(10px)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between'
          }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 11, color: B.amber, fontWeight: 700, letterSpacing: '0.1em' }}>
                  RESERVE FESTIVAL ARTIST SESSION
                </span>
                <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 10, color: B.smoke }}>
                  DEC 12 · MURI OKUNOLA
                </span>
              </div>

              <p style={{ fontFamily: "'Space Mono', monospace", fontSize: 11, color: B.smoke, lineHeight: 1.6, marginBottom: 20 }}>
                Bring your personal sneaker or buy a factory base at the fest. Our resident artisans hand-paint, laser etch, and sew custom panels live on the festival floor.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 24 }}>
                {ARTISTS.map(a => (
                  <div
                    key={a.name}
                    onClick={() => { setSelectedArtist(a); playFestivalSound('zone_click') }}
                    style={{
                      background: selectedArtist.name === a.name ? `${B.amber}15` : B.charcoal,
                      border: selectedArtist.name === a.name ? `1px solid ${B.amber}` : `1px solid ${B.gunmetal}`,
                      borderRadius: 8,
                      padding: 14,
                      cursor: 'pointer',
                      transition: 'all 0.2s'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                      <span style={{ fontFamily: "'Orbitron', monospace", fontSize: 12, color: B.white, fontWeight: 700 }}>
                        {a.name}
                      </span>
                      <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 11, color: B.neonLime, fontWeight: 700 }}>
                        {a.fee}
                      </span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: "'Space Mono', monospace", fontSize: 10, color: B.smoke }}>
                      <span>{a.booth}</span>
                      <span>{a.slot}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Booking Form & Result */}
            <div>
              {bookingConfirmed ? (
                <div style={{
                  background: `${B.neonLime}15`,
                  border: `1px solid ${B.neonLime}`,
                  borderRadius: 8,
                  padding: 18,
                  textAlign: 'center'
                }}>
                  <div style={{ fontSize: 28, marginBottom: 8 }}>✅</div>
                  <div style={{ fontFamily: "'Orbitron', monospace", fontSize: 14, color: B.neonLime, fontWeight: 800, marginBottom: 4 }}>
                    CUSTOM LAB RESERVATION SECURED
                  </div>
                  <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 12, color: B.white, marginBottom: 8 }}>
                    PASS CODE: <span style={{ color: B.amber, fontWeight: 700 }}>{voucherCode}</span>
                  </div>
                  <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 10, color: B.smoke }}>
                    Present this code at {selectedArtist.booth} on Dec 12. +120 XP added to your Sneaker Passport.
                  </div>
                </div>
              ) : (
                <button
                  onClick={handleConfirmSlot}
                  style={{
                    width: '100%',
                    background: `linear-gradient(135deg, ${B.amber}, ${B.amberDeep})`,
                    color: B.black,
                    border: 'none',
                    borderRadius: 6,
                    padding: '16px',
                    fontFamily: "'Space Mono', monospace",
                    fontSize: 12,
                    fontWeight: 800,
                    letterSpacing: '0.12em',
                    cursor: 'pointer',
                    boxShadow: `0 0 25px ${B.amber}50`
                  }}
                >
                  LOCK 1-OF-1 CUSTOM APPOINTMENT (+120 XP)
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
