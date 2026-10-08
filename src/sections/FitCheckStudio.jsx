import { useState } from 'react'
import { FONTS } from '../tokens'

const STREET_ARCHETYPES = [
  {
    id: 'alté',
    name: 'Alté Vanguard',
    tagline: 'Defying mainstream norms with oversized drape & vintage heat',
    recommendedKicks: ["Air Jordan 1 x Union LA", "Nike Dunk High Syracuse", "Salomon XT-6"],
    vibeColor: '#FF007A',
    palette: ['#0A0A0A', '#1F1F1F', '#FF007A', '#E2E8F0']
  },
  {
    id: 'yaba',
    name: 'Tech & Mainland Hustle',
    tagline: 'Clean minimal basics, high durability, ready for 14-hour code marathons',
    recommendedKicks: ["Nike Dunk Low 'Panda'", "Air Jordan 1 Shadow", "New Balance 550"],
    vibeColor: '#00E5FF',
    palette: ['#0D1117', '#161B22', '#00E5FF', '#F0F6FC']
  },
  {
    id: 'island',
    name: 'Lekki Phase 1 Luxury',
    tagline: 'Statement silhouettes, immaculate white leather, pristine drip for VIP tables',
    recommendedKicks: ["Air Jordan 1 x Dior High", "Nike Air Force 1 x Tiffany & Co.", "Air Jordan 4 Bred"],
    vibeColor: '#FFB800',
    palette: ['#121212', '#2A2000', '#FFB800', '#FFFFFF']
  },
  {
    id: 'afrobeat',
    name: 'Afro-Futurism Sonic',
    tagline: 'Electric neon tones, high performance runners, rave-ready accessories',
    recommendedKicks: ["Air Jordan 4 Travis Scott Purple", "Nike SB Chunky Dunky", "Air Jordan 6 Infrared"],
    vibeColor: '#10B981',
    palette: ['#0B130E', '#064E3B', '#10B981', '#E6FFFA']
  },
  {
    id: 'catalyst-alchemist',
    name: 'The Balogun Alchemist',
    tagline: 'Turns everyday Lagos street grit into uncompromising editorial gold (Catalyst OS Core)',
    recommendedKicks: ["Air Jordan 1 'Chicago'", "Nike Air Max 95 OG", "Travis Scott AJ1 Low"],
    vibeColor: '#C084FC',
    palette: ['#050508', '#1A1028', '#C084FC', '#E8C84A']
  }
]

export default function FitCheckStudio() {
  const [selectedArchetype, setSelectedArchetype] = useState(STREET_ARCHETYPES[0])
  const [userFitDescription, setUserFitDescription] = useState('')
  const [fitRating, setFitRating] = useState(null)
  const [analyzing, setAnalyzing] = useState(false)
  const [virtualTryOnKick, setVirtualTryOnKick] = useState(STREET_ARCHETYPES[0].recommendedKicks[0])

  const runFitAnalysis = () => {
    if (!userFitDescription.trim()) return
    setAnalyzing(true)
    setFitRating(null)

    setTimeout(() => {
      setAnalyzing(false)
      const score = Math.floor(Math.random() * 12) + 88 // 88 - 99
      setFitRating({
        score,
        verdict: score >= 94 ? "LAGOS STREETWEAR GOD TIER" : "HIGH-GRADE MAINLAND HEAT",
        aiFeedback: `Flawless color coordination. The silhouetted cuts complement the ${virtualTryOnKick} proportions without drowning the sole profile.`,
        suggestedAccessory: score >= 94 ? "Chunky Silver Cuban Link + Dark Tint Matrix Shades" : "Lagos Danfo Custom Crossbody Bag"
      })
    }, 1500)
  }

  return (
    <section id="fitcheck-studio" style={{
      background: '#090B0E',
      color: '#fff',
      padding: '80px 20px',
      borderBottom: '1px solid rgba(255, 184, 0, 0.15)',
      fontFamily: FONTS?.body || 'sans-serif',
      position: 'relative'
    }}>
      <div style={{ maxWidth: '1240px', margin: '0 auto' }}>
        {/* Section Header */}
        <div style={{ textAlign: 'center', marginBottom: '50px' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            background: 'rgba(0, 229, 255, 0.12)',
            border: '1px solid rgba(0, 229, 255, 0.35)',
            borderRadius: '999px',
            padding: '6px 16px',
            fontSize: '12px',
            fontWeight: '700',
            letterSpacing: '1.5px',
            color: '#00E5FF',
            textTransform: 'uppercase',
            marginBottom: '16px'
          }}>
            <span>✨</span> Next-Gen AI Streetwear Stylist & Virtual Try-On
          </div>
          
          <h2 style={{
            fontSize: 'clamp(28px, 4vw, 44px)',
            fontWeight: '900',
            letterSpacing: '-0.5px',
            margin: '0 0 14px 0',
            textTransform: 'uppercase'
          }}>
            FitCheck <span style={{ color: '#00E5FF' }}>Studio</span> AI
          </h2>
          
          <p style={{
            maxWidth: '660px',
            margin: '0 auto',
            fontSize: '15px',
            color: '#9CA3AF',
            lineHeight: '1.6'
          }}>
            Coordinate your festival drip before hitting Muri Okunola Park. Select your Lagos archetype, test virtual silhouette matching, and receive an instant AI Drip Scorecard.
          </p>
        </div>

        {/* Studio Workspace */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '30px',
          alignItems: 'start'
        }}>
          {/* Left Column: Archetype Selector & Drip Input */}
          <div style={{
            background: '#12151B',
            borderRadius: '20px',
            border: '1px solid rgba(255,255,255,0.08)',
            padding: '24px',
            boxShadow: '0 10px 30px rgba(0,0,0,0.5)'
          }}>
            <h3 style={{ fontSize: '18px', fontWeight: '800', margin: '0 0 16px 0', color: '#fff' }}>
              1. Select Lagos Style Archetype
            </h3>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '24px' }}>
              {STREET_ARCHETYPES.map(arc => {
                const isSelected = selectedArchetype.id === arc.id
                return (
                  <button
                    key={arc.id}
                    onClick={() => {
                      setSelectedArchetype(arc)
                      setVirtualTryOnKick(arc.recommendedKicks[0])
                    }}
                    style={{
                      background: isSelected ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.02)',
                      border: isSelected ? `2px solid ${arc.vibeColor}` : '1px solid rgba(255,255,255,0.08)',
                      borderRadius: '12px',
                      padding: '14px',
                      textAlign: 'left',
                      cursor: 'pointer',
                      transition: 'all 0.2s'
                    }}
                  >
                    <div style={{ fontSize: '14px', fontWeight: '800', color: arc.vibeColor, marginBottom: '4px' }}>
                      {arc.name}
                    </div>
                    <div style={{ fontSize: '11px', color: '#718096', lineHeight: '1.3' }}>
                      {arc.tagline.slice(0, 48)}...
                    </div>
                  </button>
                )
              })}
            </div>

            <h3 style={{ fontSize: '18px', fontWeight: '800', margin: '0 0 12px 0', color: '#fff' }}>
              2. Describe or Paste Your Festival Fit
            </h3>
            
            <textarea
              placeholder="e.g. Baggy black parachute pants, oversized washed vintage graphic tee, distressed silver bucket hat, chunky chain..."
              value={userFitDescription}
              onChange={(e) => setUserFitDescription(e.target.value)}
              rows={4}
              style={{
                width: '100%',
                background: '#090B0E',
                border: '1px solid rgba(255,255,255,0.12)',
                borderRadius: '12px',
                padding: '12px',
                color: '#fff',
                fontSize: '13px',
                resize: 'none',
                outline: 'none',
                boxSizing: 'border-box',
                marginBottom: '16px'
              }}
            />

            <button
              onClick={runFitAnalysis}
              disabled={analyzing || !userFitDescription.trim()}
              style={{
                width: '100%',
                background: userFitDescription.trim() ? 'linear-gradient(135deg, #00E5FF 0%, #0088CC 100%)' : '#2D3748',
                color: userFitDescription.trim() ? '#000' : '#718096',
                border: 'none',
                padding: '14px',
                borderRadius: '10px',
                fontWeight: '800',
                fontSize: '14px',
                cursor: userFitDescription.trim() ? 'pointer' : 'not-allowed',
                boxShadow: userFitDescription.trim() ? '0 4px 20px rgba(0,229,255,0.3)' : 'none',
                transition: 'all 0.2s'
              }}
            >
              {analyzing ? '⚡ Analyzing Drip Proportions...' : '⚡ Generate AI Fit Scorecard'}
            </button>
          </div>

          {/* Right Column: Virtual Try-On Canvas & Scorecard */}
          <div style={{
            background: '#12151B',
            borderRadius: '20px',
            border: '1px solid rgba(255,255,255,0.08)',
            padding: '24px',
            boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
            display: 'flex',
            flexDirection: 'column'
          }}>
            <h3 style={{ fontSize: '18px', fontWeight: '800', margin: '0 0 16px 0', color: '#fff' }}>
              Virtual Kick Silhouette Pairing
            </h3>

            {/* Kick Selector for Fitting */}
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '20px' }}>
              {selectedArchetype.recommendedKicks.map(kick => (
                <button
                  key={kick}
                  onClick={() => setVirtualTryOnKick(kick)}
                  style={{
                    padding: '8px 14px',
                    borderRadius: '8px',
                    fontSize: '12px',
                    fontWeight: '700',
                    border: virtualTryOnKick === kick ? '1px solid #FFB800' : '1px solid rgba(255,255,255,0.1)',
                    background: virtualTryOnKick === kick ? 'rgba(255,184,0,0.15)' : 'rgba(255,255,255,0.02)',
                    color: virtualTryOnKick === kick ? '#FFB800' : '#A0AEC0',
                    cursor: 'pointer'
                  }}
                >
                  {kick}
                </button>
              ))}
            </div>

            {/* Virtual Mannequin Visualization */}
            <div style={{
              background: 'radial-gradient(circle at 50% 50%, #1A202C 0%, #0D1117 100%)',
              borderRadius: '16px',
              border: `1px solid ${selectedArchetype.vibeColor}40`,
              padding: '30px 20px',
              textAlign: 'center',
              position: 'relative',
              marginBottom: '20px'
            }}>
              <div style={{ fontSize: '64px', marginBottom: '10px' }}>👟</div>
              <div style={{ fontSize: '16px', fontWeight: '800', color: '#fff', marginBottom: '4px' }}>
                {virtualTryOnKick}
              </div>
              <div style={{ fontSize: '12px', color: selectedArchetype.vibeColor, fontWeight: '700' }}>
                PAIRED WITH: {selectedArchetype.name.toUpperCase()}
              </div>

              {/* Archetype Mood Palette */}
              <div style={{ display: 'flex', justifyContent: 'center', gap: '6px', marginTop: '16px' }}>
                {selectedArchetype.palette.map((color, idx) => (
                  <div
                    key={idx}
                    style={{
                      width: '24px',
                      height: '24px',
                      borderRadius: '50%',
                      background: color,
                      border: '2px solid rgba(255,255,255,0.2)'
                    }}
                  />
                ))}
              </div>
            </div>

            {/* AI Fit Rating Outcome */}
            {fitRating && (
              <div style={{
                background: 'rgba(0, 229, 255, 0.05)',
                border: '1px solid rgba(0, 229, 255, 0.25)',
                borderRadius: '14px',
                padding: '16px',
                animation: 'fadeIn 0.3s'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <span style={{ fontSize: '12px', fontWeight: '800', color: '#00E5FF' }}>
                    {fitRating.verdict}
                  </span>
                  <span style={{
                    fontSize: '18px',
                    fontWeight: '900',
                    color: '#FFB800',
                    background: 'rgba(255,184,0,0.15)',
                    padding: '2px 8px',
                    borderRadius: '6px'
                  }}>
                    {fitRating.score}/100
                  </span>
                </div>
                <p style={{ fontSize: '13px', color: '#CBD5E0', lineHeight: '1.4', margin: '0 0 10px 0' }}>
                  {fitRating.aiFeedback}
                </p>
                <div style={{ fontSize: '12px', color: '#A0AEC0' }}>
                  💡 <strong>Suggested Accent:</strong> {fitRating.suggestedAccessory}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
