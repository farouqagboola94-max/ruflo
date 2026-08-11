import { useState } from 'react'
import { B } from '../tokens'
import { GrainOverlay, ScanLines, SectionTag } from '../components/Shared'
import { claudeChat, useAiAvailable } from '../lib/catalystAI'
import AIComingSoon from '../components/AIComingSoon'

const POPULAR = [
  'Air Jordan 4 Military Blue', 'Nike Air Max 95 Neon Yellow', 'Adidas Samba OG',
  'New Balance 1906R', 'Nike Dunk Low Panda', 'Yeezy Boost 350 V2 Zebra',
]

const SYSTEM = `You are a Lagos sneaker market analyst. Predict the resale trajectory of a sneaker model over the next 6–12 months.

Respond with ONLY this JSON:
{
  "signal": "BUY" | "HOLD" | "SELL",
  "confidence": 65,
  "current_lagos_price": "What this shoe currently trades for in Lagos (₦)",
  "global_trend": "What's happening globally — brief (1 sentence)",
  "6_month_outlook": "Where you expect the market to be in 6 months and why (2 sentences)",
  "12_month_outlook": "12-month forecast (2 sentences)",
  "key_factors": ["3–4 factors driving this prediction"],
  "risk": "The main risk that could invalidate this prediction",
  "lagos_tip": "One Lagos-specific tip for playing this shoe right now"
}

Confidence is a number 1-100. Be specific about prices in Nigerian Naira. Be analytical, not generic.`

const SIGNAL_CONFIG = {
  BUY:  { color: B.neonLime, bg: '#0a1a00', label: 'BUY SIGNAL' },
  HOLD: { color: B.amber,    bg: '#1c1400', label: 'HOLD SIGNAL' },
  SELL: { color: '#ef4444',  bg: '#2d0000', label: 'SELL SIGNAL' },
}

export default function HeatPredictor() {
  const aiReady = useAiAvailable()
  const [shoe, setShoe] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')

  async function predict() {
    if (!shoe.trim()) return
    if (!aiReady) {
      setError('Heat Predictor is not live yet. It will be ready before December 12.')
      return
    }
    setLoading(true)
    setResult(null)
    setError('')
    try {
      const raw = await claudeChat(
        [{ role: 'user', content: `Predict resale trajectory for: ${shoe}` }],
        { feature: 'HeatPredictor', model: 'smart', system: SYSTEM, maxTokens: 700 }
      )
      const match = raw.match(/\{[\s\S]*\}/)
      if (match) setResult(JSON.parse(match[0]))
      else setError('Could not parse prediction. Try again.')
    } catch (e) {
      setError(e.message || 'Something went wrong.')
    } finally {
      setLoading(false)
    }
  }

  const sc = result ? SIGNAL_CONFIG[result.signal] : null

  return (
    <section id="heat-predictor" style={{ background: '#040404', padding: '80px 20px', position: 'relative', overflow: 'hidden' }}>
      <GrainOverlay />
      <ScanLines />
      <style>{`@keyframes hpSlide { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:translateY(0)} }`}</style>

      <div style={{ maxWidth: 760, margin: '0 auto' }}>
        <SectionTag>MARKET INTELLIGENCE</SectionTag>
        {!aiReady && <AIComingSoon feature="Heat Predictor" />}
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12, marginBottom: 8 }}>
          <h2 style={{ fontFamily: "'Bebas Neue'", fontSize: 'clamp(2rem,5vw,3.5rem)', color: B.white, letterSpacing: '0.05em', margin: 0 }}>
            HEAT PREDICTOR
          </h2>
          <div style={{ fontFamily: "'Space Mono'", fontSize: 9, color: '#444', letterSpacing: '0.15em' }}>LAGOS MARKET INTEL</div>
        </div>
        <p style={{ color: B.smoke, fontFamily: "'Space Mono'", fontSize: '0.72rem', marginBottom: 36, letterSpacing: '0.04em' }}>
          Enter any sneaker · Claude forecasts the Lagos resale trajectory · Buy, hold, or sell
        </p>

        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 16, alignItems: 'center' }}>
          <span style={{ fontFamily: "'Space Mono'", fontSize: 8, color: '#333', letterSpacing: '0.1em' }}>QUICK SELECT →</span>
          {POPULAR.map(s => (
            <button key={s} onClick={() => { setShoe(s); setResult(null) }} style={{ background: shoe === s ? `${B.neonCyan}15` : '#0d0d0d', border: `1px solid ${shoe === s ? B.neonCyan : '#1a1a1a'}`, color: shoe === s ? B.neonCyan : '#444', fontFamily: "'Space Mono'", fontSize: 8, padding: '5px 12px', cursor: 'pointer', transition: 'all 0.15s' }}>
              {s.length > 20 ? s.slice(0, 20) + '…' : s}
            </button>
          ))}
        </div>

        <div style={{ display: 'flex', gap: 10, marginBottom: 24 }}>
          <input
            value={shoe}
            onChange={e => { setShoe(e.target.value); setResult(null) }}
            placeholder="e.g. Air Jordan 1 Chicago, Adidas Samba OG, New Balance 992"
            style={{ flex: 1, background: '#0d0d0d', border: '1px solid #1a1a1a', color: B.white, padding: '12px 14px', fontFamily: "'Space Mono'", fontSize: 11, outline: 'none' }}
          />
          <button onClick={predict} disabled={!shoe.trim() || loading} style={{ padding: '12px 22px', background: shoe.trim() && !loading ? B.neonCyan : '#111', color: shoe.trim() && !loading ? B.black : '#333', border: 'none', fontFamily: "'Space Mono'", fontSize: 10, letterSpacing: '0.12em', fontWeight: 700, cursor: shoe.trim() && !loading ? 'pointer' : 'default', whiteSpace: 'nowrap', transition: 'all 0.2s' }}>
            {loading ? '⟳ READING...' : 'PREDICT →'}
          </button>
        </div>

        {error && <div style={{ background: '#1a0000', border: '1px solid #ff444422', padding: 12, marginBottom: 16, fontFamily: "'Space Mono'", fontSize: 10, color: '#ff6666' }}>{error}</div>}

        {result && sc && (
          <div style={{ animation: 'hpSlide 0.35s ease' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 16, marginBottom: 16 }}>
              <div style={{ background: sc.bg, border: `2px solid ${sc.color}55`, padding: '24px 20px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
                <div style={{ fontFamily: "'Orbitron'", fontSize: 28, fontWeight: 900, color: sc.color, marginBottom: 6 }}>{sc.label}</div>
                <div style={{ fontFamily: "'Space Mono'", fontSize: 9, color: '#444', letterSpacing: '0.1em', marginBottom: 12 }}>CONFIDENCE</div>
                <div style={{ fontFamily: "'Orbitron'", fontSize: 38, fontWeight: 900, color: sc.color, lineHeight: 1 }}>{result.confidence}</div>
                <div style={{ fontFamily: "'Space Mono'", fontSize: 8, color: '#444' }}>/ 100</div>
              </div>
              <div>
                <div style={{ background: '#0a0a0a', border: '1px solid #1a1a1a', padding: '12px 16px', marginBottom: 8 }}>
                  <div style={{ fontFamily: "'Space Mono'", fontSize: 7, color: '#333', letterSpacing: '0.15em', marginBottom: 4 }}>CURRENT LAGOS PRICE</div>
                  <div style={{ fontFamily: "'Space Mono'", fontSize: 11, color: B.amber }}>{result.current_lagos_price}</div>
                </div>
                <div style={{ background: '#0a0a0a', border: '1px solid #1a1a1a', padding: '12px 16px' }}>
                  <div style={{ fontFamily: "'Space Mono'", fontSize: 7, color: '#333', letterSpacing: '0.15em', marginBottom: 4 }}>GLOBAL TREND</div>
                  <div style={{ fontFamily: "'Space Mono'", fontSize: 10, color: B.smoke, lineHeight: 1.6 }}>{result.global_trend}</div>
                </div>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
              <div style={{ background: '#0a0a0a', border: `1px solid ${B.amber}22`, padding: '14px 16px' }}>
                <div style={{ fontFamily: "'Space Mono'", fontSize: 7, color: B.amber, letterSpacing: '0.15em', marginBottom: 6 }}>6-MONTH OUTLOOK</div>
                <div style={{ fontFamily: "'Space Mono'", fontSize: 10, color: B.smoke, lineHeight: 1.7 }}>{result['6_month_outlook']}</div>
              </div>
              <div style={{ background: '#0a0a0a', border: `1px solid ${B.neonCyan}22`, padding: '14px 16px' }}>
                <div style={{ fontFamily: "'Space Mono'", fontSize: 7, color: B.neonCyan, letterSpacing: '0.15em', marginBottom: 6 }}>12-MONTH OUTLOOK</div>
                <div style={{ fontFamily: "'Space Mono'", fontSize: 10, color: B.smoke, lineHeight: 1.7 }}>{result['12_month_outlook']}</div>
              </div>
            </div>

            <div style={{ background: '#0a0a0a', border: '1px solid #1a1a1a', padding: '14px 18px', marginBottom: 12 }}>
              <div style={{ fontFamily: "'Space Mono'", fontSize: 7, color: '#333', letterSpacing: '0.15em', marginBottom: 8 }}>KEY FACTORS</div>
              {(result.key_factors || []).map((f, i) => (
                <div key={i} style={{ fontFamily: "'Space Mono'", fontSize: 9, color: B.smoke, lineHeight: 1.7, marginBottom: 3 }}>· {f}</div>
              ))}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 14 }}>
              <div style={{ background: '#1a0000', border: '1px solid #ef444422', padding: '12px 14px' }}>
                <div style={{ fontFamily: "'Space Mono'", fontSize: 7, color: '#ef4444', letterSpacing: '0.15em', marginBottom: 4 }}>MAIN RISK</div>
                <div style={{ fontFamily: "'Space Mono'", fontSize: 9, color: '#ff8888', lineHeight: 1.6 }}>{result.risk}</div>
              </div>
              <div style={{ background: '#0a0a0a', border: `1px solid ${B.neonLime}18`, padding: '12px 14px' }}>
                <div style={{ fontFamily: "'Space Mono'", fontSize: 7, color: B.neonLime, letterSpacing: '0.15em', marginBottom: 4 }}>🇳🇬 LAGOS TIP</div>
                <div style={{ fontFamily: "'Space Mono'", fontSize: 9, color: B.smoke, lineHeight: 1.6 }}>{result.lagos_tip}</div>
              </div>
            </div>

            <button onClick={() => { setResult(null); setShoe('') }} style={{ width: '100%', background: 'transparent', border: '1px solid #1a1a1a', color: '#333', fontFamily: "'Space Mono'", fontSize: 9, letterSpacing: '0.15em', padding: '10px', cursor: 'pointer' }}>
              PREDICT ANOTHER SHOE
            </button>
          </div>
        )}
      </div>
    </section>
  )
}
