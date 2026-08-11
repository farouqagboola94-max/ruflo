import { useState } from 'react'
import { B } from '../tokens'
import { GrainOverlay, ScanLines, SectionTag } from '../components/Shared'
import { claudeChat, useAiAvailable } from '../lib/catalystAI'
import AIComingSoon from '../components/AIComingSoon'

const POPULAR = [
  'Air Jordan 1 Retro High OG', 'Air Jordan 4 Retro', 'Yeezy Boost 350 V2',
  'Nike Dunk Low', 'Travis Scott AJ1', 'Off-White x Nike',
]

const SYSTEM = `You are a Lagos sneaker authentication expert. Generate a model-specific authentication checklist for spotting fake sneakers.

Respond with ONLY this JSON:
{
  "risk_level": "HIGH" | "MEDIUM" | "LOW",
  "risk_note": "One sentence on why this model is a high/medium/low fake risk in Lagos",
  "checklist": [
    {
      "area": "Area name (e.g. Sole, Box, Tongue, Stitching)",
      "what_to_check": "Exactly what to look at",
      "real_vs_fake": "How to tell real from fake — specific, visual",
      "lagos_tip": "Lagos-specific advice (where fakes come from, what Alaba market fakes get wrong, etc.)"
    }
  ],
  "red_flags": ["Instant red flags — if you see any of these, walk away"],
  "buy_safe_tip": "One practical tip for buying this model safely at SF26 or in Lagos"
}

Give 5-8 checklist items. Be specific to the exact model. Reference actual fake tells, not generic advice.`

const RISK_CONFIG = {
  HIGH:   { color: '#ef4444', bg: '#2d0000', label: 'HIGH FAKE RISK' },
  MEDIUM: { color: B.amber,   bg: '#1c1400', label: 'MEDIUM RISK' },
  LOW:    { color: B.neonLime,bg: '#0a1a00', label: 'LOW RISK' },
}

export default function FakeDetector() {
  const aiReady = useAiAvailable()
  const [shoe, setShoe] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')

  async function check() {
    if (!shoe.trim()) return
    if (!aiReady) {
      setError('Fake Detector is not live yet. It will be ready before December 12.')
      return
    }
    setLoading(true)
    setResult(null)
    setError('')
    try {
      const raw = await claudeChat(
        [{ role: 'user', content: `Generate an authentication checklist for: ${shoe}` }],
        { feature: 'FakeDetector', model: 'smart', system: SYSTEM, maxTokens: 1000 }
      )
      const match = raw.match(/\{[\s\S]*\}/)
      if (match) setResult(JSON.parse(match[0]))
      else setError('Could not parse checklist. Try again.')
    } catch (e) {
      setError(e.message || 'Something went wrong.')
    } finally {
      setLoading(false)
    }
  }

  const rc = result ? RISK_CONFIG[result.risk_level] : null

  return (
    <section id="fake-detector" style={{ background: '#060606', padding: '80px 20px', position: 'relative', overflow: 'hidden' }}>
      <GrainOverlay />
      <ScanLines />
      <style>{`@keyframes fdSlide { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:translateY(0)} }`}</style>

      <div style={{ maxWidth: 760, margin: '0 auto' }}>
        <SectionTag>AUTHENTICATION</SectionTag>
        {!aiReady && <AIComingSoon feature="Fake Detector" />}
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12, marginBottom: 8 }}>
          <h2 style={{ fontFamily: "'Bebas Neue'", fontSize: 'clamp(2rem,5vw,3.5rem)', color: B.white, letterSpacing: '0.05em', margin: 0 }}>
            FAKE DETECTOR
          </h2>
          <div style={{ fontFamily: "'Space Mono'", fontSize: 9, color: '#444', letterSpacing: '0.15em' }}>LEGIT CHECK ENGINE</div>
        </div>
        <p style={{ color: B.smoke, fontFamily: "'Space Mono'", fontSize: '0.72rem', marginBottom: 36, letterSpacing: '0.04em' }}>
          Enter any sneaker model · Get a model-specific authentication checklist · Never buy fakes at SF26
        </p>

        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 16, alignItems: 'center' }}>
          <span style={{ fontFamily: "'Space Mono'", fontSize: 8, color: '#333', letterSpacing: '0.1em' }}>QUICK SELECT →</span>
          {POPULAR.map(s => (
            <button key={s} onClick={() => { setShoe(s); setResult(null) }} style={{ background: shoe === s ? `${B.amber}15` : '#0d0d0d', border: `1px solid ${shoe === s ? B.amber : '#1a1a1a'}`, color: shoe === s ? B.amber : '#444', fontFamily: "'Space Mono'", fontSize: 8, padding: '5px 12px', cursor: 'pointer', transition: 'all 0.15s' }}>
              {s.length > 22 ? s.slice(0, 22) + '…' : s}
            </button>
          ))}
        </div>

        <div style={{ display: 'flex', gap: 10, marginBottom: 24 }}>
          <input
            value={shoe}
            onChange={e => { setShoe(e.target.value); setResult(null) }}
            placeholder="e.g. Yeezy Boost 350 V2 'Zebra' or Nike Dunk Low 'Panda'"
            style={{ flex: 1, background: '#0d0d0d', border: '1px solid #1a1a1a', color: B.white, padding: '12px 14px', fontFamily: "'Space Mono'", fontSize: 11, outline: 'none' }}
          />
          <button onClick={check} disabled={!shoe.trim() || loading} style={{ padding: '12px 24px', background: shoe.trim() && !loading ? B.amber : '#111', color: shoe.trim() && !loading ? B.black : '#333', border: 'none', fontFamily: "'Space Mono'", fontSize: 10, letterSpacing: '0.15em', fontWeight: 700, cursor: shoe.trim() && !loading ? 'pointer' : 'default', whiteSpace: 'nowrap', transition: 'all 0.2s' }}>
            {loading ? '⟳ CHECKING...' : 'LEGIT CHECK →'}
          </button>
        </div>

        {error && <div style={{ background: '#1a0000', border: '1px solid #ff444422', padding: 12, marginBottom: 16, fontFamily: "'Space Mono'", fontSize: 10, color: '#ff6666' }}>{error}</div>}

        {result && rc && (
          <div style={{ animation: 'fdSlide 0.35s ease' }}>
            <div style={{ background: rc.bg, border: `2px solid ${rc.color}44`, padding: '16px 24px', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 20, flexWrap: 'wrap' }}>
              <div style={{ fontFamily: "'Orbitron'", fontSize: 22, fontWeight: 900, color: rc.color }}>{rc.label}</div>
              <div style={{ fontFamily: "'Space Mono'", fontSize: 10, color: B.smoke, lineHeight: 1.6, flex: 1 }}>{result.risk_note}</div>
            </div>

            <div style={{ display: 'grid', gap: 10, marginBottom: 16 }}>
              {(result.checklist || []).map((item, i) => (
                <div key={i} style={{ background: '#0a0a0a', border: '1px solid #1a1a1a', padding: '14px 18px' }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14, marginBottom: 8 }}>
                    <div style={{ fontFamily: "'Orbitron'", fontSize: 12, color: B.amber, fontWeight: 900, flexShrink: 0, lineHeight: 1.4 }}>0{i + 1}</div>
                    <div style={{ fontFamily: "'Space Mono'", fontSize: 9, color: B.amber, letterSpacing: '0.1em', fontWeight: 700 }}>{item.area?.toUpperCase()}</div>
                  </div>
                  <div style={{ fontFamily: "'Space Mono'", fontSize: 9, color: B.white, lineHeight: 1.7, marginBottom: 6 }}>{item.what_to_check}</div>
                  <div style={{ fontFamily: "'Space Mono'", fontSize: 9, color: '#555', lineHeight: 1.7, marginBottom: 6 }}>{item.real_vs_fake}</div>
                  {item.lagos_tip && <div style={{ fontFamily: "'Space Mono'", fontSize: 8, color: B.neonCyan, lineHeight: 1.6, borderTop: '1px solid #1a1a1a', paddingTop: 8, marginTop: 4 }}>🇳🇬 {item.lagos_tip}</div>}
                </div>
              ))}
            </div>

            {result.red_flags?.length > 0 && (
              <div style={{ background: '#1a0000', border: '1px solid #ef444422', padding: '14px 18px', marginBottom: 14 }}>
                <div style={{ fontFamily: "'Space Mono'", fontSize: 8, color: '#ef4444', letterSpacing: '0.15em', marginBottom: 8 }}>INSTANT RED FLAGS — WALK AWAY</div>
                {result.red_flags.map((f, i) => (
                  <div key={i} style={{ fontFamily: "'Space Mono'", fontSize: 9, color: '#ff8888', lineHeight: 1.7, marginBottom: 4 }}>⚠ {f}</div>
                ))}
              </div>
            )}

            <div style={{ background: '#0a0a0a', border: `1px solid ${B.neonLime}18`, padding: '12px 16px', marginBottom: 14 }}>
              <div style={{ fontFamily: "'Space Mono'", fontSize: 8, color: B.neonLime, letterSpacing: '0.15em', marginBottom: 4 }}>SF26 SAFE BUY TIP</div>
              <div style={{ fontFamily: "'Space Mono'", fontSize: 10, color: B.smoke, lineHeight: 1.7 }}>{result.buy_safe_tip}</div>
            </div>

            <button onClick={() => { setResult(null); setShoe('') }} style={{ width: '100%', background: 'transparent', border: '1px solid #1a1a1a', color: '#333', fontFamily: "'Space Mono'", fontSize: 9, letterSpacing: '0.15em', padding: '10px', cursor: 'pointer' }}>
              CHECK ANOTHER SHOE
            </button>
          </div>
        )}
      </div>
    </section>
  )
}
