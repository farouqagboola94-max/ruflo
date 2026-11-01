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
  { id: 'af1', name: 'Air Force 1 Low (Lagos Classic)', code: 'AF1-01', baseColor: '#FFFFFF', tag: 'MOST POPULAR' },
  { id: 'dunk', name: 'Nike Dunk Low SB (Street Staple)', code: 'DNK-02', baseColor: '#F5A623', tag: 'SKATE READY' },
  { id: 'aj1', name: 'Air Jordan 1 Retro High OG', code: 'AJ1-03', baseColor: '#1A1A1A', tag: 'GRAIL CANVAS' },
  { id: 'nb9060', name: 'New Balance 9060 (Chunky Mesh)', code: 'NB9-04', baseColor: '#E0DDD5', tag: 'SUEDE & MESH' },
  { id: 'samba', name: 'Adidas Samba OG (Terrace Classic)', code: 'SMB-05', baseColor: '#F4F1EA', tag: 'TERRACE ICON' }
]

const TEXTURES = [
  { id: 'adire-indigo', name: 'Abeokuta Hand-Dyed Adire Indigo', pattern: 'Resin & Batik Dye', hex: '#3B82F6', accent: '#93C5FD' },
  { id: 'danfo-yellow', name: 'Lagos Transit Yellow & Matte Black', pattern: 'Airbrush Stencil', hex: '#FFCC00', accent: '#0A0A0A' },
  { id: 'eyo-white', name: 'Eyo Masquerade Pristine Linen', pattern: 'Triple-White Leather & Cord', hex: '#F8FAFC', accent: '#E11D48' },
  { id: 'lagos-asphalt', name: 'Third Mainland Asphalt Camo', pattern: ' Acid Wash & Splatter', hex: '#64748B', accent: '#FF5722' },
  { id: 'lekki-chrome', name: 'Lekki Toll Gate Liquid Chrome', pattern: 'Metallic Foil Leafing', hex: '#D4AF37', accent: '#FFFFFF' },
  { id: 'vintage-patina', name: 'Alaba 1985 Neo-Vintage Patina', pattern: 'Coffee-Aged Midsole & Suede', hex: '#D97706', accent: '#FEF3C7' }
]

const HARDWARE_ADDONS = [
  { id: 'rope-laces', name: 'Heavyweight 10mm Rope Laces', included: true },
  { id: 'brass-dubrae', name: 'Engraved Brass "SF\'26" Lace Dubrae', included: true },
  { id: 'uv-coat', name: 'Hydrophobic Lagos Rain & Dust Shield', included: true }
]

const ARTISAN_BENCHES = [
  {
    id: 'BENCH-01',
    name: 'Kola "BrushKing" Adeleke',
    specialty: 'Precision Airbrush, Graphic Stencils & Color Blocking',
    slot: 'Dec 12 · 13:00 - 15:00',
    booth: 'Sole Craft Bench 01 (Freedom Park Pergola)',
    fee: '₦45,000',
    spots: '4 Slots Left'
  },
  {
    id: 'BENCH-02',
    name: 'Chioma "AdireSneaks" Eze',
    specialty: 'Hand-Stitched Adire Panels, Sashiko & Laser Etching',
    slot: 'Dec 12 · 15:30 - 17:30',
    booth: 'Sole Craft Bench 02 (Freedom Park Pergola)',
    fee: '₦55,000',
    spots: '3 Slots Left'
  },
  {
    id: 'BENCH-03',
    name: 'Tunde "Patina" Bello',
    specialty: '1985 Coffee-Aging, Distressed Edges & Rope Lace Drilling',
    slot: 'Dec 12 · 18:00 - 20:00',
    booth: 'Sole Craft Bench 03 (Freedom Park Pergola)',
    fee: '₦40,000',
    spots: '5 Slots Left'
  }
]

export default function DanfoCustomizerLab() {
  const [selectedSilhouette, setSelectedSilhouette] = useState(SILHOUETTES[0])
  const [selectedTexture, setSelectedTexture] = useState(TEXTURES[0])
  const [selectedHardware, setSelectedHardware] = useState(['rope-laces', 'brass-dubrae'])
  const [customText, setCustomText] = useState('LAGOS 26')
  const [selectedArtist, setSelectedArtist] = useState(ARTISAN_BENCHES[0])
  const [bookingConfirmed, setBookingConfirmed] = useState(false)
  const [voucherCode, setVoucherCode] = useState(null)

  const { awardXP, unlockBadge } = useFestivalGamification()

  const toggleHardware = (id) => {
    playFestivalSound('zone_click')
    setSelectedHardware(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    )
  }

  const handleConfirmSlot = (e) => {
    e.preventDefault()
    const code = `CRAFT-LAB-${Math.floor(1000 + Math.random() * 9000)}`
    setVoucherCode(code)
    setBookingConfirmed(true)

    awardXP(150, 'Sole Craft Customization Workshop Reserved')
    unlockBadge('SOLE_CRAFT_ARTISAN')
    playFestivalSound('badge_unlock')
    dispatchFestivalAction(FESTIVAL_ACTIONS.ADD_NOTIFICATION, {
      title: 'Sole Craft Workshop Reserved!',
      message: `${selectedArtist.name} at ${selectedArtist.booth}. Pass: ${code}`
    })
  }

  return (
    <section id="custom-workshop" style={{
      position: 'relative',
      overflow: 'hidden',
      background: 'radial-gradient(circle at 50% 0%, #1c1808 0%, #05070f 100%)',
      color: '#fff',
      padding: '90px 24px',
      borderTop: `1px solid ${B.amber}40`,
      borderBottom: `1px solid ${B.amber}40`
    }}>
      {/* Backward compatibility deep-link anchors */}
      <div id="danfo-lab" style={{ position: 'absolute', top: 0, left: 0, width: '1px', height: '1px', visibility: 'hidden' }} />
      <div id="hype" style={{ position: 'absolute', top: 0, left: 0, width: '1px', height: '1px', visibility: 'hidden' }} />
      <GrainOverlay />

      <div style={{ maxWidth: 1200, margin: '0 auto', position: 'relative', zIndex: 10 }}>
        <SectionTag>FREEDOM PARK ARTISAN PERGOLA · 1-OF-1 CRAFTSMANSHIP</SectionTag>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: 20, marginBottom: 40 }}>
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: `${B.amber}15`, border: `1px solid ${B.amber}50`, borderRadius: 999, padding: '4px 14px', marginBottom: 12 }}>
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: B.amber, boxShadow: `0 0 10px ${B.amber}` }} />
              <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 10, color: B.amber, letterSpacing: '0.15em', fontWeight: 700 }}>
                LIVE ARTISAN CUSTOMIZATION BENCHES · 1-OF-1 CRAFTSMANSHIP · FREEDOM PARK, CMS
              </span>
            </div>
            <h2 style={{ fontFamily: "'Orbitron', monospace", fontWeight: 900, fontSize: 'clamp(28px, 4.5vw, 48px)', color: B.white, lineHeight: 1.1 }}>
              SOLE CRAFT <span style={{ color: B.amber, textShadow: `0 0 25px ${B.amber}50` }}>CUSTOMIZATION WORKSHOP</span>
            </h2>
            <p style={{ fontFamily: "'Space Mono', monospace", fontSize: 'clamp(11px, 1.4vw, 13px)', color: B.mist, marginTop: 10, maxWidth: 680, lineHeight: 1.6 }}>
              Step into our heritage brick pergola workshop at Freedom Park, CMS. Configure your 1-of-1 specification with Lagos textile paneling, airbrush stencils, brass dubraes, and coffee-dyed patinas—and lock your bench appointment for December 12.
            </p>
          </div>

          <div style={{
            background: 'rgba(15, 19, 28, 0.85)',
            border: `1px solid ${B.amber}40`,
            borderRadius: 8,
            padding: '10px 16px',
            fontFamily: "'Space Mono', monospace",
            fontSize: 10,
            color: B.smoke
          }}>
            <div style={{ color: B.amber, fontWeight: 700, marginBottom: 3 }}>YEAR OF FREEDOM EDITION</div>
            <div>3 Modular Artisan Benches · Brick Courtyard Pavilion</div>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: 32 }}>
          {/* Left Column: Virtual Sneaker Spec Configurator */}
          <div style={{
            background: 'rgba(16, 20, 28, 0.82)',
            border: `1px solid ${B.gunmetal}`,
            borderRadius: 12,
            padding: 24,
            backdropFilter: 'blur(12px)',
            boxShadow: '0 12px 40px rgba(0,0,0,0.55)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 11, color: B.amber, fontWeight: 700, letterSpacing: '0.1em' }}>
                LIVE 1-OF-1 BLUEPRINT SPEC
              </span>
              <span style={{ background: `${B.neonLime}20`, border: `1px solid ${B.neonLime}60`, color: B.neonLime, padding: '3px 10px', borderRadius: 999, fontSize: 10, fontFamily: "'Space Mono', monospace" }}>
                {selectedSilhouette.code} · {selectedSilhouette.tag}
              </span>
            </div>

            {/* Interactive Blueprint Preview Box */}
            <div style={{
              height: 230,
              background: `radial-gradient(circle at center, ${selectedTexture.hex}28 0%, #090c12 82%)`,
              border: `1px solid ${selectedTexture.hex}65`,
              borderRadius: 10,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative',
              overflow: 'hidden',
              marginBottom: 24
            }}>
              <div style={{
                position: 'absolute',
                top: 12,
                left: 14,
                right: 14,
                display: 'flex',
                justifyContent: 'space-between',
                fontFamily: "'Space Mono', monospace",
                fontSize: 9,
                color: B.smoke
              }}>
                <span>FINISH: {selectedTexture.pattern.toUpperCase()}</span>
                <span style={{ color: B.amber }}>HARDWARE: {selectedHardware.length} ADD-ONS</span>
              </div>

              <div style={{
                fontSize: 68,
                filter: `drop-shadow(0 15px 28px ${selectedTexture.hex}75)`,
                transform: 'rotate(-8deg) scale(1.1)',
                transition: 'all 0.3s ease'
              }}>
                👟
              </div>

              <div style={{
                marginTop: 10,
                padding: '4px 12px',
                borderRadius: 4,
                background: 'rgba(0,0,0,0.65)',
                border: `1px solid ${selectedTexture.hex}50`,
                fontFamily: "'Orbitron', monospace",
                fontSize: 11,
                color: B.white,
                letterSpacing: '0.12em'
              }}>
                {selectedTexture.name.toUpperCase()}
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
                <span>MODEL: {selectedSilhouette.name.split(' (')[0]}</span>
                <span style={{ color: selectedTexture.hex, fontWeight: 700 }}>HEEL TAG: &ldquo;{customText || 'SF 26'}&rdquo;</span>
              </div>
            </div>

            {/* Silhouette Selector (5 Silhouettes) */}
            <div style={{ marginBottom: 20 }}>
              <label style={{ display: 'block', fontFamily: "'Space Mono', monospace", fontSize: 11, color: B.smoke, marginBottom: 8 }}>
                1. SELECT BASE SILHOUETTE (BRING YOUR OWN OR BUY BLANK AT FEST)
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(145px, 1fr))', gap: 8 }}>
                {SILHOUETTES.map(s => (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => { setSelectedSilhouette(s); playFestivalSound('zone_click') }}
                    style={{
                      background: selectedSilhouette.id === s.id ? `${B.amber}25` : B.charcoal,
                      border: selectedSilhouette.id === s.id ? `1px solid ${B.amber}` : `1px solid ${B.gunmetal}`,
                      borderRadius: 6,
                      padding: '9px 11px',
                      color: selectedSilhouette.id === s.id ? B.amberGlow : B.white,
                      fontFamily: "'Space Mono', monospace",
                      fontSize: 10,
                      textAlign: 'left',
                      cursor: 'pointer',
                      transition: 'all 0.18s ease'
                    }}
                  >
                    <div style={{ fontWeight: 700 }}>{s.name.split(' (')[0]}</div>
                    <div style={{ fontSize: 8.5, color: B.smoke, marginTop: 2 }}>{s.tag}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Cultural Finish & Motif Selector (6 Finishes) */}
            <div style={{ marginBottom: 20 }}>
              <label style={{ display: 'block', fontFamily: "'Space Mono', monospace", fontSize: 11, color: B.smoke, marginBottom: 8 }}>
                2. SELECT LAGOS ARTISAN FINISH & TEXTILE TREATMENT
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                {TEXTURES.map(t => (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => { setSelectedTexture(t); playFestivalSound('zone_click') }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 9,
                      background: selectedTexture.id === t.id ? `${t.hex}22` : B.charcoal,
                      border: selectedTexture.id === t.id ? `1px solid ${t.hex}` : `1px solid ${B.gunmetal}`,
                      borderRadius: 6,
                      padding: '9px 10px',
                      color: B.white,
                      fontFamily: "'Space Mono', monospace",
                      fontSize: 9.5,
                      textAlign: 'left',
                      cursor: 'pointer'
                    }}
                  >
                    <span style={{ width: 13, height: 13, borderRadius: 3, background: t.hex, border: '1px solid #fff', flexShrink: 0 }} />
                    <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{t.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Hardware & Lace Swaps */}
            <div style={{ marginBottom: 20 }}>
              <label style={{ display: 'block', fontFamily: "'Space Mono', monospace", fontSize: 11, color: B.smoke, marginBottom: 8 }}>
                3. WORKSHOP HARDWARE & PROTECTION PACK (INCLUDED)
              </label>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {HARDWARE_ADDONS.map(hw => {
                  const active = selectedHardware.includes(hw.id)
                  return (
                    <button
                      key={hw.id}
                      type="button"
                      onClick={() => toggleHardware(hw.id)}
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        background: active ? 'rgba(0, 240, 255, 0.1)' : B.charcoal,
                        border: active ? `1px solid ${B.neonCyan}60` : `1px solid ${B.gunmetal}`,
                        borderRadius: 6,
                        padding: '8px 12px',
                        color: active ? B.white : B.smoke,
                        fontFamily: "'Space Mono', monospace",
                        fontSize: 10,
                        cursor: 'pointer'
                      }}
                    >
                      <span>{hw.name}</span>
                      <span style={{ color: active ? B.neonCyan : B.smoke, fontWeight: 700 }}>
                        {active ? '✓ EQUIPPED' : '+ ADD'}
                      </span>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Custom Tag / Heel Inscription */}
            <div>
              <label style={{ display: 'block', fontFamily: "'Space Mono', monospace", fontSize: 11, color: B.smoke, marginBottom: 8 }}>
                4. LASER HEEL TAB INSCRIPTION (MAX 12 CHARS)
              </label>
              <input
                type="text"
                maxLength={12}
                value={customText}
                onChange={e => setCustomText(e.target.value.toUpperCase())}
                placeholder="E.G. LAGOS 26"
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

          {/* Right Column: On-Site Artisan Bench Reservation */}
          <div style={{
            background: 'rgba(16, 20, 28, 0.82)',
            border: `1px solid ${B.gunmetal}`,
            borderRadius: 12,
            padding: 24,
            backdropFilter: 'blur(12px)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            boxShadow: '0 12px 40px rgba(0,0,0,0.55)'
          }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 11, color: B.amber, fontWeight: 700, letterSpacing: '0.1em' }}>
                  RESERVE ARTISAN WORKBENCH
                </span>
                <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 10, color: B.neonCyan }}>
                  DEC 12 · FREEDOM PARK, CMS
                </span>
              </div>

              <p style={{ fontFamily: "'Space Mono', monospace", fontSize: 11, color: B.smoke, lineHeight: 1.6, marginBottom: 20 }}>
                Select one of our three dedicated artisan benches inside the Sole Craft Marquee. Drop off your pair during your reserved window and pick it up cured, sealed, and authenticated before the main stage headliners begin.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 24 }}>
                {ARTISAN_BENCHES.map(a => {
                  const isSelected = selectedArtist.id === a.id
                  return (
                    <div
                      key={a.id}
                      onClick={() => { setSelectedArtist(a); playFestivalSound('zone_click') }}
                      style={{
                        background: isSelected ? `${B.amber}16` : B.charcoal,
                        border: isSelected ? `1px solid ${B.amber}` : `1px solid ${B.gunmetal}`,
                        borderRadius: 8,
                        padding: 15,
                        cursor: 'pointer',
                        transition: 'all 0.2s'
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                        <span style={{ fontFamily: "'Orbitron', monospace", fontSize: 13, color: B.white, fontWeight: 700 }}>
                          {a.name}
                        </span>
                        <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 11, color: B.neonLime, fontWeight: 700 }}>
                          {a.fee}
                        </span>
                      </div>
                      <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 11.5, color: B.mist, marginBottom: 8 }}>
                        {a.specialty}
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontFamily: "'Space Mono', monospace", fontSize: 9.5, color: B.smoke }}>
                        <span>📍 {a.booth}</span>
                        <span style={{ color: B.amber }}>{a.slot} ({a.spots})</span>
                      </div>
                    </div>
                  )
                })}
              </div>

              {/* Spec Summary Card */}
              <div style={{
                background: 'rgba(8, 10, 15, 0.9)',
                border: `1px solid ${B.gunmetal}`,
                borderRadius: 8,
                padding: 14,
                marginBottom: 20,
                fontFamily: "'Space Mono', monospace",
                fontSize: 10
              }}>
                <div style={{ color: B.amber, fontWeight: 700, marginBottom: 6, letterSpacing: '0.08em' }}>
                  WORKSHOP ORDER SUMMARY
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: B.smoke, marginBottom: 4 }}>
                  <span>SILHOUETTE:</span>
                  <span style={{ color: B.white }}>{selectedSilhouette.name}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: B.smoke, marginBottom: 4 }}>
                  <span>TREATMENT:</span>
                  <span style={{ color: B.white }}>{selectedTexture.name}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: B.smoke, marginBottom: 4 }}>
                  <span>ARTISAN BAY:</span>
                  <span style={{ color: B.neonCyan }}>{selectedArtist.name}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: B.smoke }}>
                  <span>ESTIMATED TURNAROUND:</span>
                  <span style={{ color: B.neonLime }}>90 Mins (Express UV Cure)</span>
                </div>
              </div>
            </div>

            {/* Booking Confirmation */}
            <div>
              {bookingConfirmed ? (
                <div style={{
                  background: `${B.neonLime}15`,
                  border: `1px solid ${B.neonLime}`,
                  borderRadius: 8,
                  padding: 18,
                  textAlign: 'center'
                }}>
                  <div style={{ fontSize: 28, marginBottom: 6 }}>🛠️</div>
                  <div style={{ fontFamily: "'Orbitron', monospace", fontSize: 14, color: B.neonLime, fontWeight: 800, marginBottom: 4 }}>
                    SOLE CRAFT BENCH RESERVATION LOCKED
                  </div>
                  <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 12, color: B.white, marginBottom: 8 }}>
                    WORKSHOP VOUCHER: <span style={{ color: B.amber, fontWeight: 700 }}>{voucherCode}</span>
                  </div>
                  <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 10, color: B.smoke, marginBottom: 12 }}>
                    Present this voucher at {selectedArtist.booth} on Dec 12 ({selectedArtist.slot}). +150 XP &amp; Sole Craft Artisan badge unlocked!
                  </div>
                  <button
                    type="button"
                    onClick={() => setBookingConfirmed(false)}
                    style={{
                      background: 'transparent',
                      border: `1px solid ${B.neonLime}80`,
                      color: B.neonLime,
                      borderRadius: 4,
                      padding: '6px 14px',
                      fontFamily: "'Space Mono', monospace",
                      fontSize: 9.5,
                      cursor: 'pointer'
                    }}
                  >
                    CONFIGURE ANOTHER PAIR
                  </button>
                </div>
              ) : (
                <button
                  type="button"
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
                  RESERVE SOLE CRAFT WORKBENCH (+150 XP)
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
