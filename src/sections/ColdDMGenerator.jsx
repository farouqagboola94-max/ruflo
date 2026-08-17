import { useState } from 'react'
import { B } from '../tokens'
import { GrainOverlay, ScanLines, SectionTag } from '../components/Shared'
import { claudeChat, useAiAvailable } from '../lib/catalystAI'
import AIComingSoon from '../components/AIComingSoon'

const TARGETS = [
  { label: 'VENDOR', value: 'a sneaker vendor or stall holder at SF26' },
  { label: 'BRAND REP', value: 'a brand representative or official at SF26' },
  { label: 'COLLECTOR', value: 'a private sneaker collector at SF26' },
  { label: 'RESELLER', value: 'a reseller with inventory at SF26' },
]

const TIERS = [
  { label: 'GENERAL', value: 'General Admission' },
  { label: 'VIP', value: 'VIP' },
  { label: 'VVIP', value: 'VVIP' },
  { label: 'PHALANX', value: 'Phalanx (earliest access, most exclusive)' },
]

const SYSTEM = `You are a Lagos networking expert who writes cold DMs that actually get replies at sneaker events.

Respond with ONLY this JSON:
{
  "subject_line": "A short DM opener or subject — under 10 words, stops the scroll",
  "opening": "First sentence — acknowledge them or their collection, no generic openers",
  "body": "2–3 sentences making the ask — specific, direct, offers something (cash ready, trade, referral, etc.)",
  "ask": "The actual ask — one clear sentence",
  "closing": "Closing line — confident, not desperate, with a light Lagos touch",
  "tone_tip": "One tip on HOW to send this — timing, platform, approach"
}

Rules:
- Sound like a real person, not a bot
- Specific to what they want (the shoe) and what they offer
- Lagos street charm + professionalism
- Short. Every sentence earns its place.`

export default function ColdDMGenerator() {
  const aiReady = useAiAvailable()
  const [shoe, setShoe] = useState('')
  const [offer, setOffer] = useState('')
  const [target, setTarget] = useState(null)
  const [tier, setTier] = useState(null)
  const [context, setContext] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')
  const [copied, setCopied] = useState(false)

  async function generate() {
    if (!shoe.trim() || !target || !offer.trim()) return
    if (!aiReady) {
      setError('Cold DM Generator is not live yet. It will be ready before December 12.')
      return
    }
    setLoading(true)
    setResult(null)
    setError('')
    setCopied(false)
    try {
      const tierContext = tier ? ` I have a ${tier} ticket.` : ''
      const extraContext = context.trim() ? `\nExtra context: ${context}` : ''
      const prompt = `I want: ${shoe}\nI'm DMing: ${target}\nI'm offering: ${offer}${tierContext}${extraContext}\n\nWrite my cold DM.`
      const raw = await claudeChat([{ role: 'user', content: prompt }], { feature: 'ColdDMGenerator', model: 'balanced', system: SYSTEM, maxTokens: 600 })
      const match = raw.match(/\{[\s\S]*\}/)
      if (match) setResult(JSON.parse(match[0]))
      else setError('Could not parse DM. Try again.')
    } catch (e) {
      setError(e.message || 'Something went wrong.')
    } finally {
      setLoading(false)
    }
  }

  function fullDM() {
    if (!result) return ''
    return `${result.subject_line}\n\n${result.opening} ${result.body} ${result.ask}\n\n${result.closing}`
  }

  function copy() {
    const dm = fullDM()
    if (!dm) return
    navigator.clipboard.writeText(dm).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2200)
    })
  }

  const ready = shoe.trim() && offer.trim() && target

  return (
    <section id="cold-dm" style={{ background: '#060606', padding: '80px 20px', position: 'relative', overflow: 'hidden' }}>
      <GrainOverlay />
      <ScanLines />
      <style>{`@keyframes dmSlide { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:translateY(0)} }`}</style>

      <div style={{ maxWidth: 700, margin: '0 auto' }}>
        <SectionTag>NETWORKING</SectionTag>
        {!aiReady && <AIComingSoon feature="Cold DM Generator" />}
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12, marginBottom: 8 }}>
          <h2 style={{ fontFamily: "'Bebas Neue'", fontSize: 'clamp(2rem,5vw,3.5rem)', color: B.white, letterSpacing: '0.05em', margin: 0 }}>
            COLD DM GENERATOR
          </h2>
          <div style={{ fontFamily: "'Space Mono'", fontSize: 9, color: B.dim, letterSpacing: '0.15em' }}>SF26 NETWORK PLAYS</div>
        </div>
        <p style={{ color: B.smoke, fontFamily: "'Space Mono'", fontSize: '0.72rem', marginBottom: 36, letterSpacing: '0.04em' }}>
          Tell Claude what you want · Who you're hitting up · What you're offering · Get a cold DM that lands
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 16 }}>
          <div>
            <div style={{ fontFamily: "'Space Mono'", fontSize: 8, color: B.dim, letterSpacing: '0.2em', marginBottom: 8 }}>SHOE YOU WANT</div>
            <input
              value={shoe}
              onChange={e => { setShoe(e.target.value); setResult(null) }}
              placeholder="e.g. Travis Scott AJ1 Low, Yeezy 700 Mauve"
              style={{ width: '100%', background: '#0d0d0d', border: '1px solid #1a1a1a', color: B.white, padding: '11px 14px', fontFamily: "'Space Mono'", fontSize: 10, outline: 'none' }}
            />
          </div>
          <div>
            <div style={{ fontFamily: "'Space Mono'", fontSize: 8, color: B.dim, letterSpacing: '0.2em', marginBottom: 8 }}>WHAT YOU'RE OFFERING</div>
            <input
              value={offer}
              onChange={e => { setOffer(e.target.value); setResult(null) }}
              placeholder="e.g. ₦380K cash, trade + cash, trade for AJ4..."
              style={{ width: '100%', background: '#0d0d0d', border: '1px solid #1a1a1a', color: B.white, padding: '11px 14px', fontFamily: "'Space Mono'", fontSize: 10, outline: 'none' }}
            />
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 16 }}>
          <div>
            <div style={{ fontFamily: "'Space Mono'", fontSize: 8, color: B.dim, letterSpacing: '0.2em', marginBottom: 10 }}>WHO YOU'RE HITTING UP</div>
            {TARGETS.map(t => (
              <button key={t.label} onClick={() => { setTarget(target === t.value ? null : t.value); setResult(null) }} style={{ display: 'block', width: '100%', textAlign: 'left', padding: '8px 12px', marginBottom: 5, background: target === t.value ? `${B.amber}14` : '#0d0d0d', border: `1px solid ${target === t.value ? B.amber : '#1a1a1a'}`, color: target === t.value ? B.amber : B.smoke, fontFamily: "'Space Mono'", fontSize: 9, letterSpacing: '0.06em', cursor: 'pointer', transition: 'all 0.15s' }}>
                {t.label}
              </button>
            ))}
          </div>
          <div>
            <div style={{ fontFamily: "'Space Mono'", fontSize: 8, color: B.dim, letterSpacing: '0.2em', marginBottom: 10 }}>YOUR TICKET TIER</div>
            {TIERS.map(t => (
              <button key={t.label} onClick={() => { setTier(tier === t.value ? null : t.value); setResult(null) }} style={{ display: 'block', width: '100%', textAlign: 'left', padding: '8px 12px', marginBottom: 5, background: tier === t.value ? `${B.neonCyan}12` : '#0d0d0d', border: `1px solid ${tier === t.value ? B.neonCyan : '#1a1a1a'}`, color: tier === t.value ? B.neonCyan : B.smoke, fontFamily: "'Space Mono'", fontSize: 9, letterSpacing: '0.06em', cursor: 'pointer', transition: 'all 0.15s' }}>
                {t.label}
              </button>
            ))}
          </div>
        </div>

        <div style={{ marginBottom: 20 }}>
          <div style={{ fontFamily: "'Space Mono'", fontSize: 8, color: B.dim, letterSpacing: '0.2em', marginBottom: 8 }}>EXTRA CONTEXT (OPTIONAL)</div>
          <input
            value={context}
            onChange={e => { setContext(e.target.value); setResult(null) }}
            placeholder="e.g. I know their IG, I have 2 pairs to trade, we've spoken before..."
            style={{ width: '100%', background: '#0d0d0d', border: '1px solid #1a1a1a', color: B.white, padding: '11px 14px', fontFamily: "'Space Mono'", fontSize: 10, outline: 'none' }}
          />
        </div>

        <button onClick={generate} disabled={!ready || loading} style={{ width: '100%', padding: '14px', background: ready && !loading ? B.amber : '#111', color: ready && !loading ? B.black : B.dim, border: 'none', fontFamily: "'Space Mono'", fontSize: 11, letterSpacing: '0.2em', fontWeight: 700, cursor: ready && !loading ? 'pointer' : 'default', marginBottom: 24, transition: 'all 0.2s' }}>
          {loading ? '⟳ WRITING YOUR DM...' : ready ? 'GENERATE MY DM →' : 'FILL SHOE + OFFER + TARGET'}
        </button>

        {error && <div style={{ background: '#1a0000', border: '1px solid #ff444422', padding: 12, marginBottom: 16, fontFamily: "'Space Mono'", fontSize: 10, color: '#ff6666' }}>{error}</div>}

        {result && (
          <div style={{ animation: 'dmSlide 0.4s ease' }}>
            <div style={{ background: '#0a0a0a', border: `1px solid ${B.amber}33`, padding: '20px 24px', marginBottom: 12 }}>
              <div style={{ fontFamily: "'Space Mono'", fontSize: 8, color: B.amber, letterSpacing: '0.2em', marginBottom: 14 }}>OPENER</div>
              <div style={{ fontFamily: "'Bebas Neue'", fontSize: 20, color: B.white, letterSpacing: '0.04em', marginBottom: 16 }}>{result.subject_line}</div>
              <div style={{ fontFamily: "'Space Mono'", fontSize: 10, color: B.smoke, lineHeight: 1.8 }}>{result.opening}</div>
            </div>

            <div style={{ background: '#0a0a0a', border: '1px solid #1a1a1a', padding: '16px 24px', marginBottom: 12 }}>
              <div style={{ fontFamily: "'Space Mono'", fontSize: 8, color: B.dim, letterSpacing: '0.2em', marginBottom: 10 }}>THE BODY</div>
              <div style={{ fontFamily: "'Space Mono'", fontSize: 10, color: B.smoke, lineHeight: 1.8, marginBottom: 12 }}>{result.body}</div>
              <div style={{ fontFamily: "'Space Mono'", fontSize: 10, color: B.white, lineHeight: 1.8, borderTop: '1px solid #1a1a1a', paddingTop: 12 }}>{result.ask}</div>
            </div>

            <div style={{ background: '#0a0a0a', border: '1px solid #1a1a1a', padding: '14px 24px', marginBottom: 12 }}>
              <div style={{ fontFamily: "'Space Mono'", fontSize: 10, color: B.smoke, fontStyle: 'italic' }}>{result.closing}</div>
            </div>

            <div style={{ background: '#0a0a1a', border: `1px solid ${B.neonCyan}22`, padding: '12px 16px', marginBottom: 16 }}>
              <div style={{ fontFamily: "'Space Mono'", fontSize: 9, color: B.neonCyan, letterSpacing: '0.15em', marginBottom: 4 }}>HOW TO SEND IT</div>
              <div style={{ fontFamily: "'Space Mono'", fontSize: 9, color: B.smoke }}>{result.tone_tip}</div>
            </div>

            <div style={{ display: 'flex', gap: 10 }}>
              <button onClick={copy} style={{ flex: 1, padding: '12px', background: copied ? '#052e16' : B.amber, color: copied ? '#22c55e' : B.black, border: 'none', fontFamily: "'Space Mono'", fontSize: 10, letterSpacing: '0.15em', fontWeight: 700, cursor: 'pointer', transition: 'all 0.2s' }}>
                {copied ? '✓ COPIED' : 'COPY FULL DM →'}
              </button>
              <button onClick={() => { setResult(null); setShoe(''); setOffer(''); setTarget(null); setTier(null); setContext('') }} style={{ flex: 1, padding: '12px', background: 'transparent', border: `1px solid ${B.amber}44`, color: B.amber, fontFamily: "'Space Mono'", fontSize: 10, letterSpacing: '0.15em', fontWeight: 700, cursor: 'pointer' }}>
                NEW DM
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
