import { useState } from 'react'
import { B } from '../tokens'
import { GrainOverlay, ScanLines, SectionTag } from '../components/Shared'
import { claudeChat, getApiKey } from '../lib/catalystAI'

const VERDICT_CONFIG = {
  FAIR:      { color: B.neonLime, bg: '#0a1a00', label: 'FAIR TRADE' },
  UNDERPAY:  { color: '#ef4444', bg: '#2d0000', label: 'YOU\'RE LOSING' },
  OVERPAY:   { color: B.amber,   bg: '#1c1400', label: 'YOU\'RE WINNING' },
}

const SYSTEM = `You are a Lagos sneaker trade evaluator at Sneakers Fest '26. Analyse a proposed shoe trade and give a direct Lagos-market verdict.

Respond with ONLY this JSON:
{
  "verdict": "FAIR" | "UNDERPAY" | "OVERPAY",
  "your_value": "₦XXK–₦XXXK estimated Lagos market value of what they're offering you",
  "their_value": "₦XXK–₦XXXK estimated Lagos market value of what you're giving them",
  "analysis": "2-3 sentences. Straight talk on whether this trade makes sense in Lagos right now.",
  "negotiation_tip": "One concrete thing you can ask for or offer to balance the deal",
  "offer_message": "A ready-to-send WhatsApp/DM message to propose or counter the trade. Lagos tone, respectful but firm. 3-5 sentences."
}

Use real Lagos resale prices. Be direct. No fluff.`

export default function TradeNegotiator() {
  const [offering, setOffering] = useState('')
  const [getting, setGetting] = useState('')
  const [context, setContext] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')
  const [copied, setCopied] = useState(false)

  async function analyze() {
    if (!offering.trim() || !getting.trim()) return
    if (!getApiKey()) {
      setError('Add your Anthropic API key in the AI Chat widget to unlock Trade Negotiator.')
      return
    }
    setLoading(true)
    setResult(null)
    setError('')
    setCopied(false)
    try {
      const prompt = `TRADE PROPOSAL:\nI am giving: ${offering}\nI am getting: ${getting}${context ? `\nExtra context: ${context}` : ''}\n\nIs this trade fair for Lagos market?`
      const raw = await claudeChat([{ role: 'user', content: prompt }], { model: 'smart', system: SYSTEM, maxTokens: 700 })
      const match = raw.match(/\{[\s\S]*\}/)
      if (match) setResult(JSON.parse(match[0]))
      else setError('Could not parse analysis. Try again.')
    } catch (e) {
      setError(e.message || 'Something went wrong.')
    } finally {
      setLoading(false)
    }
  }

  function copyOffer() {
    if (!result?.offer_message) return
    navigator.clipboard.writeText(result.offer_message).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2200)
    })
  }

  const vc = result ? VERDICT_CONFIG[result.verdict] : null
  const ready = offering.trim() && getting.trim()

  return (
    <section id="trade-negotiator" style={{ background: '#050505', padding: '80px 20px', position: 'relative', overflow: 'hidden' }}>
      <GrainOverlay />
      <ScanLines />
      <style>{`@keyframes tnSlide { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:translateY(0)} }`}</style>

      <div style={{ maxWidth: 760, margin: '0 auto' }}>
        <SectionTag>AI TRADE DESK</SectionTag>
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12, marginBottom: 8 }}>
          <h2 style={{ fontFamily: "'Bebas Neue'", fontSize: 'clamp(2rem,5vw,3.5rem)', color: B.white, letterSpacing: '0.05em', margin: 0 }}>
            TRADE NEGOTIATOR
          </h2>
          <div style={{ fontFamily: "'Space Mono'", fontSize: 9, color: '#444', letterSpacing: '0.15em' }}>LAGOS FAIR-DEAL ENGINE</div>
        </div>
        <p style={{ color: B.smoke, fontFamily: "'Space Mono'", fontSize: '0.72rem', marginBottom: 36, letterSpacing: '0.04em' }}>
          Describe the trade · Claude reads the Lagos market · Get a verdict + ready-to-send offer
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 14 }}>
          <div>
            <div style={{ fontFamily: "'Space Mono'", fontSize: 8, color: B.amber, letterSpacing: '0.2em', marginBottom: 8 }}>YOU'RE GIVING →</div>
            <textarea
              value={offering}
              onChange={e => { setOffering(e.target.value); setResult(null) }}
              placeholder="e.g. Jordan 1 Bred Toe 2019, DS, size 10 UK"
              rows={3}
              style={{ width: '100%', background: '#0d0d0d', border: `1px solid ${B.amber}33`, color: B.white, padding: '12px 14px', fontFamily: "'Space Mono'", fontSize: 10, lineHeight: 1.7, resize: 'vertical', outline: 'none' }}
            />
          </div>
          <div>
            <div style={{ fontFamily: "'Space Mono'", fontSize: 8, color: B.neonCyan, letterSpacing: '0.2em', marginBottom: 8 }}>← YOU'RE GETTING</div>
            <textarea
              value={getting}
              onChange={e => { setGetting(e.target.value); setResult(null) }}
              placeholder="e.g. Yeezy 350 V2 Zebra 2022, VNDS, size 10 UK + ₦30K cash"
              rows={3}
              style={{ width: '100%', background: '#0d0d0d', border: `1px solid ${B.neonCyan}33`, color: B.white, padding: '12px 14px', fontFamily: "'Space Mono'", fontSize: 10, lineHeight: 1.7, resize: 'vertical', outline: 'none' }}
            />
          </div>
        </div>

        <textarea
          value={context}
          onChange={e => setContext(e.target.value)}
          placeholder="Optional: any extra context (urgency, relationship, condition notes...)"
          rows={2}
          style={{ width: '100%', background: '#0d0d0d', border: '1px solid #1a1a1a', color: B.white, padding: '12px 14px', fontFamily: "'Space Mono'", fontSize: 10, lineHeight: 1.7, marginBottom: 14, resize: 'vertical', outline: 'none' }}
        />

        <button onClick={analyze} disabled={!ready || loading} style={{ width: '100%', padding: '14px', background: ready && !loading ? B.amber : '#111', color: ready && !loading ? B.black : '#333', border: 'none', fontFamily: "'Space Mono'", fontSize: 11, letterSpacing: '0.2em', fontWeight: 700, cursor: ready && !loading ? 'pointer' : 'default', marginBottom: 24, transition: 'all 0.2s' }}>
          {loading ? '⟳ EVALUATING THE TRADE...' : 'ANALYSE THIS TRADE →'}
        </button>

        {error && <div style={{ background: '#1a0000', border: '1px solid #ff444422', padding: 12, marginBottom: 16, fontFamily: "'Space Mono'", fontSize: 10, color: '#ff6666' }}>{error}</div>}

        {result && vc && (
          <div style={{ animation: 'tnSlide 0.35s ease' }}>
            <div style={{ background: vc.bg, border: `2px solid ${vc.color}44`, padding: '18px 24px', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 20, flexWrap: 'wrap' }}>
              <div style={{ fontFamily: "'Orbitron'", fontSize: 28, fontWeight: 900, color: vc.color, lineHeight: 1 }}>{vc.label}</div>
              <div style={{ display: 'flex', gap: 24 }}>
                <div>
                  <div style={{ fontFamily: "'Space Mono'", fontSize: 8, color: '#444', letterSpacing: '0.15em', marginBottom: 2 }}>YOU GIVE</div>
                  <div style={{ fontFamily: "'Orbitron'", fontSize: 13, color: B.amber, fontWeight: 700 }}>{result.your_value}</div>
                </div>
                <div style={{ fontFamily: "'Space Mono'", fontSize: 18, color: '#333', alignSelf: 'center' }}>⇄</div>
                <div>
                  <div style={{ fontFamily: "'Space Mono'", fontSize: 8, color: '#444', letterSpacing: '0.15em', marginBottom: 2 }}>YOU GET</div>
                  <div style={{ fontFamily: "'Orbitron'", fontSize: 13, color: B.neonCyan, fontWeight: 700 }}>{result.their_value}</div>
                </div>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 14 }}>
              <div style={{ background: '#0a0a0a', border: `1px solid ${B.neonCyan}15`, padding: '14px 16px' }}>
                <div style={{ fontFamily: "'Space Mono'", fontSize: 8, color: B.neonCyan, letterSpacing: '0.15em', marginBottom: 6 }}>MARKET ANALYSIS</div>
                <div style={{ fontFamily: "'Space Mono'", fontSize: 10, color: B.smoke, lineHeight: 1.7 }}>{result.analysis}</div>
              </div>
              <div style={{ background: '#0a0a0a', border: `1px solid ${B.amber}15`, padding: '14px 16px' }}>
                <div style={{ fontFamily: "'Space Mono'", fontSize: 8, color: B.amber, letterSpacing: '0.15em', marginBottom: 6 }}>NEGOTIATION TIP</div>
                <div style={{ fontFamily: "'Space Mono'", fontSize: 10, color: B.smoke, lineHeight: 1.7 }}>{result.negotiation_tip}</div>
              </div>
            </div>

            <div style={{ background: '#0a0a0a', border: '1px solid #1a1a1a', padding: '16px 20px', marginBottom: 14 }}>
              <div style={{ fontFamily: "'Space Mono'", fontSize: 8, color: '#333', letterSpacing: '0.2em', marginBottom: 8 }}>READY-TO-SEND OFFER MESSAGE</div>
              <div style={{ fontFamily: "'Space Mono'", fontSize: 10, color: B.smoke, lineHeight: 1.8, marginBottom: 14 }}>{result.offer_message}</div>
              <button onClick={copyOffer} style={{ background: copied ? '#052e16' : B.amber, border: 'none', color: copied ? '#22c55e' : B.black, fontFamily: "'Space Mono'", fontSize: 9, letterSpacing: '0.15em', fontWeight: 700, padding: '9px 20px', cursor: 'pointer', transition: 'all 0.2s' }}>
                {copied ? '✓ COPIED' : 'COPY MESSAGE →'}
              </button>
            </div>

            <button onClick={() => { setResult(null); setOffering(''); setGetting(''); setContext('') }} style={{ width: '100%', background: 'transparent', border: '1px solid #1a1a1a', color: '#333', fontFamily: "'Space Mono'", fontSize: 9, letterSpacing: '0.15em', padding: '10px', cursor: 'pointer' }}>
              ANALYSE ANOTHER TRADE
            </button>
          </div>
        )}
      </div>
    </section>
  )
}
