import { useState } from 'react'
import { B } from '../tokens'
import { GrainOverlay, ScanLines, SectionTag } from '../components/Shared'
import { claudeChat, getApiKey } from '../lib/catalystAI'

const EXAMPLES = [
  { shoe: 'Air Jordan 4 "Bred Reimagined"', asking: '185000', budget: '150000' },
  { shoe: 'Yeezy 350 V2 "Zebra" 2022', asking: '250000', budget: '195000' },
  { shoe: 'Travis Scott AJ1 Low "Olive"', asking: '600000', budget: '480000' },
  { shoe: 'New Balance 990v6 Grey', asking: '120000', budget: '95000' },
]

const SYSTEM = `You are a Lagos market haggling coach specialising in sneaker deals at Sneakers Fest '26. Help the buyer negotiate down from the vendor's asking price to their budget without burning the relationship.

Respond with ONLY this JSON:
{
  "opening_offer": "₦XXX,000 — the first number to say out loud",
  "opening_line": "The exact words to open with at the booth. Lagos tone, confident but respectful.",
  "tactics": ["2-3 specific psychological tactics to use in this negotiation — Lagos-market savvy"],
  "middle_ground": "₦XXX,000 — a realistic landing price",
  "script": "The full negotiation script: opening → response if vendor holds firm → counter → close. 5-8 exchanges. Natural Lagos dialogue.",
  "walk_away_line": "What to say if vendor won't come down — leaves door open to return"
}

Make tactics specific to the shoe and market. Be realistic — some shoes have very little room to move. Say so if needed.`

export default function PriceNegotiator() {
  const [shoe, setShoe] = useState('')
  const [asking, setAsking] = useState('')
  const [budget, setBudget] = useState('')
  const [extra, setExtra] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')
  const [copied, setCopied] = useState(false)

  function loadExample(ex) {
    setShoe(ex.shoe)
    setAsking(ex.asking)
    setBudget(ex.budget)
    setResult(null)
  }

  async function generate() {
    if (!shoe.trim() || !asking.trim() || !budget.trim()) return
    if (!getApiKey()) {
      setError('Add your Anthropic API key in the AI Chat widget to unlock Price Negotiator.')
      return
    }
    setLoading(true)
    setResult(null)
    setError('')
    setCopied(false)
    try {
      const prompt = `Shoe: ${shoe}\nVendor asking price: ₦${Number(asking).toLocaleString()}\nMy budget: ₦${Number(budget).toLocaleString()}${extra ? `\nExtra context: ${extra}` : ''}\n\nCoach me through negotiating this at SF26.`
      const raw = await claudeChat([{ role: 'user', content: prompt }], { model: 'smart', system: SYSTEM, maxTokens: 900 })
      const match = raw.match(/\{[\s\S]*\}/)
      if (match) setResult(JSON.parse(match[0]))
      else setError('Could not parse script. Try again.')
    } catch (e) {
      setError(e.message || 'Something went wrong.')
    } finally {
      setLoading(false)
    }
  }

  function copy() {
    if (!result?.script) return
    navigator.clipboard.writeText(result.script).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2200)
    })
  }

  const gap = asking && budget ? Number(asking) - Number(budget) : 0
  const ready = shoe.trim() && asking.trim() && budget.trim() && Number(budget) < Number(asking)

  return (
    <section id="price-negotiator" style={{ background: '#040404', padding: '80px 20px', position: 'relative', overflow: 'hidden' }}>
      <GrainOverlay />
      <ScanLines />
      <style>{`@keyframes pnSlide { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:translateY(0)} }`}</style>

      <div style={{ maxWidth: 760, margin: '0 auto' }}>
        <SectionTag>HAGGLE COACH</SectionTag>
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12, marginBottom: 8 }}>
          <h2 style={{ fontFamily: "'Bebas Neue'", fontSize: 'clamp(2rem,5vw,3.5rem)', color: B.white, letterSpacing: '0.05em', margin: 0 }}>
            PRICE NEGOTIATOR
          </h2>
          <div style={{ fontFamily: "'Space Mono'", fontSize: 9, color: '#444', letterSpacing: '0.15em' }}>SF26 VENDOR PLAYBOOK</div>
        </div>
        <p style={{ color: B.smoke, fontFamily: "'Space Mono'", fontSize: '0.72rem', marginBottom: 36, letterSpacing: '0.04em' }}>
          Enter the shoe + asking price + your budget · Get the full haggle script for SF26 vendors
        </p>

        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 20, alignItems: 'center' }}>
          <span style={{ fontFamily: "'Space Mono'", fontSize: 8, color: '#333', letterSpacing: '0.1em' }}>EXAMPLES →</span>
          {EXAMPLES.map((ex, i) => (
            <button key={i} onClick={() => loadExample(ex)} style={{ background: '#0d0d0d', border: '1px solid #1a1a1a', color: '#444', fontFamily: "'Space Mono'", fontSize: 8, padding: '5px 12px', cursor: 'pointer' }}>
              EX {i + 1}
            </button>
          ))}
        </div>

        <div style={{ marginBottom: 14 }}>
          <div style={{ fontFamily: "'Space Mono'", fontSize: 8, color: '#333', letterSpacing: '0.2em', marginBottom: 8 }}>SHOE / COLOURWAY</div>
          <input
            value={shoe}
            onChange={e => { setShoe(e.target.value); setResult(null) }}
            placeholder="e.g. Air Jordan 1 Retro High OG 'Bred Toe'"
            style={{ width: '100%', background: '#0d0d0d', border: '1px solid #1a1a1a', color: B.white, padding: '12px 14px', fontFamily: "'Space Mono'", fontSize: 11, outline: 'none' }}
          />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 14 }}>
          <div>
            <div style={{ fontFamily: "'Space Mono'", fontSize: 8, color: '#ef4444', letterSpacing: '0.2em', marginBottom: 8 }}>VENDOR ASKING (₦)</div>
            <input
              type="number"
              value={asking}
              onChange={e => { setAsking(e.target.value); setResult(null) }}
              placeholder="e.g. 185000"
              style={{ width: '100%', background: '#0d0d0d', border: '1px solid #1a1a1a', color: B.white, padding: '12px 14px', fontFamily: "'Space Mono'", fontSize: 11, outline: 'none' }}
            />
          </div>
          <div>
            <div style={{ fontFamily: "'Space Mono'", fontSize: 8, color: B.neonLime, letterSpacing: '0.2em', marginBottom: 8 }}>MY BUDGET (₦)</div>
            <input
              type="number"
              value={budget}
              onChange={e => { setBudget(e.target.value); setResult(null) }}
              placeholder="e.g. 150000"
              style={{ width: '100%', background: '#0d0d0d', border: '1px solid #1a1a1a', color: B.white, padding: '12px 14px', fontFamily: "'Space Mono'", fontSize: 11, outline: 'none' }}
            />
          </div>
        </div>

        {gap > 0 && <div style={{ fontFamily: "'Space Mono'", fontSize: 9, color: '#444', marginBottom: 14 }}>GAP TO CLOSE → <span style={{ color: B.amber }}>₦{gap.toLocaleString()}</span></div>}

        <input
          value={extra}
          onChange={e => setExtra(e.target.value)}
          placeholder="Optional: any context (DS pair, vendor has multiples, end of day, you have cash, etc.)"
          style={{ width: '100%', background: '#0d0d0d', border: '1px solid #1a1a1a', color: B.white, padding: '11px 14px', fontFamily: "'Space Mono'", fontSize: 10, outline: 'none', marginBottom: 16 }}
        />

        <button onClick={generate} disabled={!ready || loading} style={{ width: '100%', padding: '14px', background: ready && !loading ? B.amber : '#111', color: ready && !loading ? B.black : '#333', border: 'none', fontFamily: "'Space Mono'", fontSize: 11, letterSpacing: '0.2em', fontWeight: 700, cursor: ready && !loading ? 'pointer' : 'default', marginBottom: 24, transition: 'all 0.2s' }}>
          {loading ? '⟳ WRITING YOUR SCRIPT...' : ready ? 'GET HAGGLE SCRIPT →' : 'FILL IN SHOE + PRICES'}
        </button>

        {error && <div style={{ background: '#1a0000', border: '1px solid #ff444422', padding: 12, marginBottom: 16, fontFamily: "'Space Mono'", fontSize: 10, color: '#ff6666' }}>{error}</div>}

        {result && (
          <div style={{ animation: 'pnSlide 0.35s ease' }}>
            <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap', background: '#0a0a0a', border: `1px solid ${B.amber}22`, padding: '18px 24px', marginBottom: 16 }}>
              {[
                { label: 'OPEN WITH', value: result.opening_offer, color: B.neonLime },
                { label: 'AIM FOR', value: result.middle_ground, color: B.amber },
              ].map(item => (
                <div key={item.label}>
                  <div style={{ fontFamily: "'Space Mono'", fontSize: 7, color: '#444', letterSpacing: '0.2em', marginBottom: 4 }}>{item.label}</div>
                  <div style={{ fontFamily: "'Orbitron'", fontSize: 20, color: item.color, fontWeight: 900 }}>{item.value}</div>
                </div>
              ))}
            </div>

            <div style={{ background: '#0a0a0a', border: `1px solid ${B.neonCyan}15`, padding: '14px 16px', marginBottom: 12 }}>
              <div style={{ fontFamily: "'Space Mono'", fontSize: 8, color: B.neonCyan, letterSpacing: '0.15em', marginBottom: 6 }}>OPENING LINE</div>
              <div style={{ fontFamily: "'Space Mono'", fontSize: 10, color: B.smoke, lineHeight: 1.7, fontStyle: 'italic' }}>"{result.opening_line}"</div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 10, marginBottom: 14 }}>
              {(result.tactics || []).map((t, i) => (
                <div key={i} style={{ background: '#0a0a0a', border: '1px solid #1a1a1a', padding: '10px 14px' }}>
                  <div style={{ fontFamily: "'Space Mono'", fontSize: 8, color: B.amber, letterSpacing: '0.1em', marginBottom: 4 }}>TACTIC {i + 1}</div>
                  <div style={{ fontFamily: "'Space Mono'", fontSize: 9, color: B.smoke, lineHeight: 1.7 }}>{t}</div>
                </div>
              ))}
            </div>

            <div style={{ background: '#0a0a0a', border: '1px solid #1a1a1a', padding: '16px 20px', marginBottom: 12 }}>
              <div style={{ fontFamily: "'Space Mono'", fontSize: 8, color: '#333', letterSpacing: '0.2em', marginBottom: 10 }}>FULL HAGGLE SCRIPT</div>
              <div style={{ fontFamily: "'Space Mono'", fontSize: 10, color: B.smoke, lineHeight: 2, whiteSpace: 'pre-wrap', marginBottom: 14 }}>{result.script}</div>
              <button onClick={copy} style={{ background: copied ? '#052e16' : B.amber, border: 'none', color: copied ? '#22c55e' : B.black, fontFamily: "'Space Mono'", fontSize: 9, letterSpacing: '0.15em', fontWeight: 700, padding: '9px 20px', cursor: 'pointer', transition: 'all 0.2s' }}>
                {copied ? '✓ COPIED' : 'COPY SCRIPT →'}
              </button>
            </div>

            {result.walk_away_line && (
              <div style={{ background: '#0a0a0a', border: '1px solid #ef444418', padding: '12px 16px', marginBottom: 14 }}>
                <div style={{ fontFamily: "'Space Mono'", fontSize: 8, color: '#ef4444', letterSpacing: '0.15em', marginBottom: 4 }}>IF THEY WON'T MOVE</div>
                <div style={{ fontFamily: "'Space Mono'", fontSize: 10, color: B.smoke, fontStyle: 'italic' }}>"{result.walk_away_line}"</div>
              </div>
            )}

            <button onClick={() => { setResult(null); setShoe(''); setAsking(''); setBudget(''); setExtra('') }} style={{ width: '100%', background: 'transparent', border: '1px solid #1a1a1a', color: '#333', fontFamily: "'Space Mono'", fontSize: 9, letterSpacing: '0.15em', padding: '10px', cursor: 'pointer' }}>
              NEGOTIATE ANOTHER SHOE
            </button>
          </div>
        )}
      </div>
    </section>
  )
}
