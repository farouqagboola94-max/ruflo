import { useState } from 'react'
import { B } from '../tokens'
import { GrainOverlay, ScanLines, SectionTag } from '../components/Shared'
import { claudeChat, useAiAvailable } from '../lib/catalystAI'
import AIComingSoon from '../components/AIComingSoon'

const VERDICT_CONFIG = {
  COP:  { color: '#22c55e', bg: '#052e16', label: 'COP IT' },
  SKIP: { color: '#ef4444', bg: '#2d0000', label: 'SKIP IT' },
  WAIT: { color: B.amber,   bg: '#1c1400', label: 'WAIT FOR DIP' },
}

const EXAMPLES = [
  'Nike Air Jordan 4 Retro "Bred Reimagined" — dropping Dec 14, retail ₦120K, general release SNKRS + footlocker',
  'Adidas Yeezy Boost 350 V2 "Onyx" — limited Lagos stockist drop, 200 pairs, ₦85K retail',
  'Off-White x Nike Dunk Low "Lot 1 of 50" — posthumous Virgil collab, 50 pairs worldwide raffle only',
  'New Balance 990v6 Made in USA "Grey" — global general release, no Lagos exclusive, retail ₦95K',
]

const SYSTEM = `You are a Lagos sneaker market analyst. When given a drop description, give a direct cop/skip/wait verdict with Lagos-specific reasoning.

Respond with this exact JSON:
{
  "verdict": "COP" | "SKIP" | "WAIT",
  "confidence": 72,
  "headline": "One punchy sentence — the verdict in plain talk",
  "lagos_market": "What this shoe does in the Lagos resale market — demand, culture relevance, likely buyers",
  "resale_upside": "₦X–Y estimated resale premium, or 'breaks even', or 'likely loss'",
  "cop_strategy": "Exactly how to cop if verdict is COP or WAIT — platform, timing, how to beat bots",
  "red_flags": "Any risks, concerns, or reasons this could flop",
  "culture_score": "6/10 — brief Lagos culture relevance reason"
}

Be direct, specific, and Lagos-aware. Real talk, no fluff.`

export default function DropAnalyzer() {
  const aiReady = useAiAvailable()
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')

  async function analyze() {
    if (!input.trim()) return
    if (!aiReady) {
      setError('drop analysis is not live yet. It will be ready before December 12.')
      return
    }
    setLoading(true)
    setResult(null)
    setError('')
    try {
      const raw = await claudeChat([{ role: 'user', content: `Analyze this sneaker drop for the Lagos market:\n\n${input}` }], { feature: 'DropAnalyzer', model: 'smart', system: SYSTEM, maxTokens: 700 })
      const match = raw.match(/\{[\s\S]*\}/)
      if (match) setResult(JSON.parse(match[0]))
      else setError('Could not parse analysis. Try again.')
    } catch (e) {
      setError(e.message || 'Something went wrong.')
    } finally {
      setLoading(false)
    }
  }

  const vc = result ? VERDICT_CONFIG[result.verdict] : null

  return (
    <section id="drop-analyzer" style={{ background: '#060606', padding: '80px 20px', position: 'relative', overflow: 'hidden' }}>
      <GrainOverlay />
      <ScanLines />
      <style>{`@keyframes daSlide { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:translateY(0)} }`}</style>

      <div style={{ maxWidth: 720, margin: '0 auto' }}>
        <SectionTag>DROP INTELLIGENCE</SectionTag>
        {!aiReady && <AIComingSoon feature="Drop Analyzer" />}
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12, marginBottom: 8 }}>
          <h2 style={{ fontFamily: "'Bebas Neue'", fontSize: 'clamp(2rem,5vw,3.5rem)', color: B.white, letterSpacing: '0.05em', margin: 0 }}>
            COP · SKIP · WAIT
          </h2>
          <div style={{ fontFamily: "'Space Mono'", fontSize: 9, color: '#444', letterSpacing: '0.15em' }}>LAGOS MARKET INTEL</div>
        </div>
        <p style={{ color: B.smoke, fontFamily: "'Space Mono'", fontSize: '0.72rem', marginBottom: 32, letterSpacing: '0.04em' }}>
          Paste any sneaker drop · Claude reads the Lagos market · Instant verdict
        </p>

        <textarea
          value={input}
          onChange={e => { setInput(e.target.value); setResult(null) }}
          placeholder="Paste the drop — name, colourway, release date, retail price, limited or general release, where it's available..."
          rows={4}
          style={{ width: '100%', background: '#0d0d0d', border: '1px solid #1a1a1a', color: B.white, padding: '14px 16px', fontFamily: "'Space Mono'", fontSize: 11, lineHeight: 1.7, marginBottom: 12, resize: 'vertical', outline: 'none' }}
        />

        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 18, alignItems: 'center' }}>
          <span style={{ fontFamily: "'Space Mono'", fontSize: 8, color: '#333', letterSpacing: '0.15em' }}>EXAMPLES →</span>
          {EXAMPLES.map((ex, i) => (
            <button key={i} onClick={() => { setInput(ex); setResult(null) }} style={{ background: '#0d0d0d', border: '1px solid #1a1a1a', color: '#444', fontFamily: "'Space Mono'", fontSize: 8, padding: '5px 12px', cursor: 'pointer', letterSpacing: '0.05em' }}>
              EX {i + 1}
            </button>
          ))}
        </div>

        <button onClick={analyze} disabled={!input.trim() || loading} style={{ width: '100%', padding: '14px', background: input.trim() && !loading ? B.amber : '#111', color: input.trim() && !loading ? B.black : '#333', border: 'none', fontFamily: "'Space Mono'", fontSize: 11, letterSpacing: '0.2em', fontWeight: 700, cursor: input.trim() && !loading ? 'pointer' : 'default', marginBottom: 24, transition: 'all 0.2s' }}>
          {loading ? '⟳ READING THE MARKET...' : 'ANALYZE THIS DROP →'}
        </button>

        {error && <div style={{ background: '#1a0000', border: '1px solid #ff444422', padding: 12, marginBottom: 16, fontFamily: "'Space Mono'", fontSize: 10, color: '#ff6666' }}>{error}</div>}

        {result && vc && (
          <div style={{ animation: 'daSlide 0.4s ease' }}>
            <div style={{ background: vc.bg, border: `2px solid ${vc.color}44`, padding: '20px 24px', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 20, flexWrap: 'wrap' }}>
              <div style={{ fontFamily: "'Orbitron'", fontSize: 34, fontWeight: 900, color: vc.color, lineHeight: 1 }}>{vc.label}</div>
              <div>
                <div style={{ fontFamily: "'Space Mono'", fontSize: 11, color: vc.color, fontWeight: 700, marginBottom: 4 }}>{result.headline}</div>
                <div style={{ fontFamily: "'Space Mono'", fontSize: 8, color: '#444', letterSpacing: '0.15em' }}>{result.confidence}% CONFIDENCE</div>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 12, marginBottom: 14 }}>
              {[
                { label: 'LAGOS MARKET',   value: result.lagos_market,   color: B.neonCyan },
                { label: 'RESALE UPSIDE',  value: result.resale_upside,  color: B.amber },
                { label: 'COP STRATEGY',   value: result.cop_strategy,   color: '#A855F7' },
                { label: 'RED FLAGS',      value: result.red_flags,      color: '#ef4444' },
              ].map(item => (
                <div key={item.label} style={{ background: '#0a0a0a', border: `1px solid ${item.color}15`, padding: '14px 16px' }}>
                  <div style={{ fontFamily: "'Space Mono'", fontSize: 8, color: item.color, letterSpacing: '0.15em', marginBottom: 6 }}>{item.label}</div>
                  <div style={{ fontFamily: "'Space Mono'", fontSize: 10, color: B.smoke, lineHeight: 1.7 }}>{item.value}</div>
                </div>
              ))}
            </div>

            <div style={{ background: '#0a0a0a', border: '1px solid #1a1a1a', padding: '12px 18px', display: 'flex', alignItems: 'center', gap: 14, marginBottom: 14 }}>
              <div style={{ fontFamily: "'Orbitron'", fontSize: 20, fontWeight: 900, color: B.neonLime }}>{result.culture_score?.split('/')[0]}<span style={{ fontSize: 11, color: '#333' }}>/10</span></div>
              <div>
                <div style={{ fontFamily: "'Space Mono'", fontSize: 8, color: '#333', letterSpacing: '0.15em', marginBottom: 2 }}>LAGOS CULTURE SCORE</div>
                <div style={{ fontFamily: "'Space Mono'", fontSize: 9, color: '#555' }}>{result.culture_score?.split('—')[1]?.trim() || ''}</div>
              </div>
            </div>

            <button onClick={() => { setResult(null); setInput('') }} style={{ width: '100%', background: 'transparent', border: '1px solid #1a1a1a', color: '#333', fontFamily: "'Space Mono'", fontSize: 9, padding: '10px', cursor: 'pointer', letterSpacing: '0.15em' }}>
              ANALYZE ANOTHER DROP
            </button>
          </div>
        )}
      </div>
    </section>
  )
}
