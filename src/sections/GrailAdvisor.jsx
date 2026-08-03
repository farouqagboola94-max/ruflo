import { useState } from 'react'
import { B } from '../tokens'
import { GrainOverlay, ScanLines, SectionTag } from '../components/Shared'
import { claudeChat, getApiKey, aiEnabled } from '../lib/catalystAI'
import AIComingSoon from '../components/AIComingSoon'

const BUDGETS = [
  { label: '₦25K – ₦75K', value: '25,000–75,000 Nigerian Naira (budget tier — accessible drops)' },
  { label: '₦75K – ₦200K', value: '75,000–200,000 Nigerian Naira (mid-range — solid heat)' },
  { label: '₦200K – ₦500K', value: '200,000–500,000 Nigerian Naira (premium — real collector territory)' },
  { label: '₦500K+', value: '500,000+ Nigerian Naira (grail tier — no ceiling, only the best)' },
]

const STYLES = [
  { label: 'STREETWEAR', value: 'streetwear — oversized silhouettes, bold colourways, Lagos street energy' },
  { label: 'ATHLETIC', value: 'athletic/performance — sport-first, functional, clean and technical' },
  { label: 'LUXURY', value: 'luxury/high-fashion — elevated, designer collabs, statement pieces' },
  { label: 'VINTAGE', value: 'vintage/retro — OG colourways, classic silhouettes, nostalgia-coded' },
]

const VIBES = [
  { label: 'FLEX HARD', value: 'maximum flex — rare, conversation-starting, people will know' },
  { label: 'COLLECTOR', value: 'collector mindset — historical significance, DS condition matters most' },
  { label: 'DAILY DRIVER', value: 'wearable daily — comfort, versatility, looks clean on anything' },
  { label: 'INVESTMENT', value: 'investment/resale — pieces likely to appreciate in the Lagos market' },
]

const SYSTEM = `You are a Lagos sneaker market expert and grail advisor at Sneakers Fest '26 (December 12, 2026, Muri Okunola Park, Victoria Island). Help attendees find the perfect sneakers based on their budget, style, and vibe.

Recommend exactly 3 specific sneakers. For each, respond with this JSON array:
[
  {
    "name": "Full sneaker name and colourway e.g. Nike Air Jordan 1 Retro High OG 'Bred'",
    "why": "2-3 sentences on why this fits their exact style and vibe",
    "price": "₦XXK–₦XXXK estimated Lagos market price",
    "at_sf26": "Where/how to find it at SF26 — vendor type, collector room, or strategy",
    "lagos_intel": "One insider Lagos market or culture fact about this shoe"
  }
]

Be specific. Be Lagos-aware. Give real current prices. No generic advice.`

export default function GrailAdvisor() {
  const [budget, setBudget] = useState(null)
  const [style, setStyle] = useState(null)
  const [vibe, setVibe] = useState(null)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')

  const ACCENT = [B.amber, B.neonCyan, '#A855F7']

  async function findGrails() {
    if (!budget || !style || !vibe) return
    if (!getApiKey()) {
      setError('Grail Advisor is not live yet. It will be ready before December 12.')
      return
    }
    setLoading(true)
    setResult(null)
    setError('')
    try {
      const prompt = `Budget: ${budget}\nStyle: ${style}\nVibe: ${vibe}\n\nFind my 3 perfect grails for Sneakers Fest '26.`
      const raw = await claudeChat([{ role: 'user', content: prompt }], { model: 'smart', system: SYSTEM, maxTokens: 1100 })
      const match = raw.match(/\[[\s\S]*\]/)
      if (match) setResult(JSON.parse(match[0]))
      else setError('Could not parse recommendations. Try again.')
    } catch (e) {
      setError(e.message || 'Something went wrong.')
    } finally {
      setLoading(false)
    }
  }

  const ready = budget && style && vibe

  return (
    <section id="grail-advisor" style={{ background: '#050505', padding: '80px 20px', position: 'relative', overflow: 'hidden' }}>
      <GrainOverlay />
      <ScanLines />
      <style>{`
        @keyframes gaSlide { from{opacity:0;transform:translateY(14px)} to{opacity:1;transform:translateY(0)} }
        .ga-btn:hover { opacity: 0.85; }
      `}</style>

      <div style={{ maxWidth: 820, margin: '0 auto' }}>
        <SectionTag>AI GRAIL FINDER</SectionTag>
        {!aiEnabled() && <AIComingSoon feature="Grail Advisor" />}
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12, marginBottom: 8 }}>
          <h2 style={{ fontFamily: "'Bebas Neue'", fontSize: 'clamp(2rem,5vw,3.5rem)', color: B.white, letterSpacing: '0.05em', margin: 0 }}>
            FIND YOUR SF26 GRAILS
          </h2>
          <div style={{ fontFamily: "'Space Mono'", fontSize: 9, color: '#444', letterSpacing: '0.15em' }}>POWERED BY CLAUDE</div>
        </div>
        <p style={{ color: B.smoke, fontFamily: "'Space Mono'", fontSize: '0.72rem', marginBottom: 40, letterSpacing: '0.04em' }}>
          Tell Claude your vibe · Get 3 personalised picks · Lagos market prices included
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 20, marginBottom: 28 }}>
          {[
            { label: '01 · BUDGET', items: BUDGETS, val: budget, set: setBudget, color: B.amber },
            { label: '02 · STYLE', items: STYLES, val: style, set: setStyle, color: B.neonCyan },
            { label: '03 · VIBE', items: VIBES, val: vibe, set: setVibe, color: '#A855F7' },
          ].map(({ label, items, val, set, color }) => (
            <div key={label}>
              <div style={{ fontFamily: "'Space Mono'", fontSize: 9, color: '#444', letterSpacing: '0.2em', marginBottom: 10 }}>{label}</div>
              {items.map(item => (
                <button key={item.label} className="ga-btn" onClick={() => { set(item.value); setResult(null) }} style={{ display: 'block', width: '100%', textAlign: 'left', padding: '10px 14px', marginBottom: 6, background: val === item.value ? `${color}14` : '#0d0d0d', border: `1px solid ${val === item.value ? color : '#1a1a1a'}`, color: val === item.value ? color : '#555', fontFamily: "'Space Mono'", fontSize: 10, letterSpacing: '0.08em', cursor: 'pointer', transition: 'all 0.15s' }}>
                  {item.label}
                </button>
              ))}
            </div>
          ))}
        </div>

        <button onClick={findGrails} disabled={!ready || loading} style={{ width: '100%', padding: '14px', background: ready && !loading ? B.amber : '#111', color: ready && !loading ? B.black : '#333', border: 'none', fontFamily: "'Space Mono'", fontSize: 11, letterSpacing: '0.2em', fontWeight: 700, cursor: ready && !loading ? 'pointer' : 'default', marginBottom: 24, transition: 'all 0.2s' }}>
          {loading ? '⟳ SCANNING LAGOS MARKET...' : ready ? 'FIND MY GRAILS →' : 'SELECT ALL THREE TO CONTINUE'}
        </button>

        {error && (
          <div style={{ background: '#1a0000', border: '1px solid #ff444422', padding: 12, marginBottom: 16, fontFamily: "'Space Mono'", fontSize: 10, color: '#ff6666' }}>{error}</div>
        )}

        {result && (
          <div style={{ display: 'grid', gap: 16, animation: 'gaSlide 0.4s ease' }}>
            {result.map((shoe, i) => (
              <div key={i} style={{ background: '#0a0a0a', border: `1px solid ${ACCENT[i]}22`, padding: '20px 24px' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16, marginBottom: 12 }}>
                  <div style={{ fontFamily: "'Orbitron'", fontSize: 28, fontWeight: 900, color: ACCENT[i], lineHeight: 1, flexShrink: 0 }}>0{i + 1}</div>
                  <div>
                    <div style={{ fontFamily: "'Bebas Neue'", fontSize: 17, color: B.white, letterSpacing: '0.04em' }}>{shoe.name}</div>
                    <div style={{ fontFamily: "'Orbitron'", fontSize: 11, color: ACCENT[i], fontWeight: 700 }}>{shoe.price}</div>
                  </div>
                </div>
                <div style={{ fontFamily: "'Space Mono'", fontSize: 10, color: B.smoke, lineHeight: 1.8, marginBottom: 12 }}>{shoe.why}</div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                  <div style={{ background: 'rgba(255,255,255,0.03)', padding: '10px 12px' }}>
                    <div style={{ fontFamily: "'Space Mono'", fontSize: 8, color: '#444', letterSpacing: '0.15em', marginBottom: 4 }}>WHERE TO FIND AT SF26</div>
                    <div style={{ fontFamily: "'Space Mono'", fontSize: 9, color: B.smoke, lineHeight: 1.7 }}>{shoe.at_sf26}</div>
                  </div>
                  <div style={{ background: 'rgba(255,255,255,0.03)', padding: '10px 12px' }}>
                    <div style={{ fontFamily: "'Space Mono'", fontSize: 8, color: '#444', letterSpacing: '0.15em', marginBottom: 4 }}>LAGOS INTEL</div>
                    <div style={{ fontFamily: "'Space Mono'", fontSize: 9, color: B.smoke, lineHeight: 1.7 }}>{shoe.lagos_intel}</div>
                  </div>
                </div>
              </div>
            ))}
            <button onClick={() => { setResult(null); setBudget(null); setStyle(null); setVibe(null) }} style={{ background: 'transparent', border: '1px solid #1a1a1a', color: '#333', fontFamily: "'Space Mono'", fontSize: 9, letterSpacing: '0.15em', padding: '10px', cursor: 'pointer', width: '100%' }}>
              RESET — TRY DIFFERENT PREFERENCES
            </button>
          </div>
        )}
      </div>
    </section>
  )
}
