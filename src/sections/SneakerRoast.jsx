import { useState } from 'react'
import { B } from '../tokens'
import { GrainOverlay, ScanLines, SectionTag } from '../components/Shared'
import { claudeChat, useAiAvailable } from '../lib/catalystAI'
import AIComingSoon from '../components/AIComingSoon'

const INTENSITIES = [
  { label: 'MILD', value: 'mild — playful digs, still respectful, one or two solid jokes' },
  { label: 'MEDIUM', value: 'medium — real talk, no hiding behind politeness, Lagos street honesty' },
  { label: 'SAVAGE', value: 'savage — absolutely no mercy, the kind of roast that makes people laugh and cry simultaneously' },
]

const EXAMPLES = [
  'Air Force 1 White, Jordan 4 Military Blue, New Balance 990, Nike Dunk Low Panda',
  'Yeezy Boost 350 V2 in every colourway, off-white x everything, Travis Scott AJ1',
  'Only wore fakes from Alaba, just bought first authentic pair (Cortez), everything is Nike',
  'Air Max 97 Silver Bullet, Adidas Superstar, Vans Old Skool, Timberland 6-inch',
]

const SYSTEM = `You are a Lagos sneaker culture comedian. Your job is to deliver a devastatingly funny, culturally sharp roast of someone's sneaker rotation.

Rules:
- Write in second person ("you")
- Maximum 4 paragraphs (can be short sharp ones)
- Reference Lagos sneaker culture specifically — Alaba market, Victoria Island flex spots, Balogun, etc.
- Be specific to the ACTUAL shoes listed — no generic roasts
- Every punchline must land. No filler.
- End with one redemption line — find ONE thing to respect before closing
- Match the requested intensity level

Write ONLY the roast. No title, no intro. Just hit.`

export default function SneakerRoast() {
  const aiReady = useAiAvailable()
  const [rotation, setRotation] = useState('')
  const [intensity, setIntensity] = useState(null)
  const [loading, setLoading] = useState(false)
  const [roast, setRoast] = useState('')
  const [error, setError] = useState('')
  const [copied, setCopied] = useState(false)

  async function generate() {
    if (!rotation.trim()) return
    if (!aiReady) {
      setError('Sneaker Roast is not live yet. It will be ready before December 12.')
      return
    }
    setLoading(true)
    setRoast('')
    setError('')
    setCopied(false)
    try {
      const intensityContext = intensity ? `\nRoast intensity: ${intensity}` : '\nRoast intensity: medium — real talk, no hiding behind politeness'
      const prompt = `My sneaker rotation: ${rotation}${intensityContext}\n\nRoast me.`
      const raw = await claudeChat([{ role: 'user', content: prompt }], { feature: 'SneakerRoast', model: 'balanced', system: SYSTEM, maxTokens: 450 })
      setRoast(raw.trim())
    } catch (e) {
      setError(e.message || 'Something went wrong.')
    } finally {
      setLoading(false)
    }
  }

  function copy() {
    if (!roast) return
    navigator.clipboard.writeText(roast).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2200)
    })
  }

  return (
    <section id="sneaker-roast" style={{ background: '#050505', padding: '80px 20px', position: 'relative', overflow: 'hidden' }}>
      <GrainOverlay />
      <ScanLines />
      <style>{`@keyframes roastSlide { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:translateY(0)} }`}</style>

      <div style={{ maxWidth: 700, margin: '0 auto' }}>
        <SectionTag>COMEDY ROAST</SectionTag>
        {!aiReady && <AIComingSoon feature="Sneaker Roast" />}
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12, marginBottom: 8 }}>
          <h2 style={{ fontFamily: "'Bebas Neue'", fontSize: 'clamp(2rem,5vw,3.5rem)', color: B.white, letterSpacing: '0.05em', margin: 0 }}>
            SNEAKER ROAST
          </h2>
          <div style={{ fontFamily: "'Space Mono'", fontSize: 9, color: B.dim, letterSpacing: '0.15em' }}>POWERED BY CLAUDE</div>
        </div>
        <p style={{ color: B.smoke, fontFamily: "'Space Mono'", fontSize: '0.72rem', marginBottom: 36, letterSpacing: '0.04em' }}>
          Describe your rotation · Claude roasts you like a Lagos elder · Screenshot and post
        </p>

        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 16, alignItems: 'center' }}>
          <span style={{ fontFamily: "'Space Mono'", fontSize: 8, color: B.dim, letterSpacing: '0.1em' }}>EXAMPLES →</span>
          {EXAMPLES.map((ex, i) => (
            <button key={i} onClick={() => { setRotation(ex); setRoast('') }} style={{ background: '#0d0d0d', border: '1px solid #1a1a1a', color: B.dim, fontFamily: "'Space Mono'", fontSize: 8, padding: '5px 12px', cursor: 'pointer' }}>
              EX {i + 1}
            </button>
          ))}
        </div>

        <div style={{ marginBottom: 18 }}>
          <div style={{ fontFamily: "'Space Mono'", fontSize: 8, color: B.dim, letterSpacing: '0.2em', marginBottom: 8 }}>YOUR ROTATION</div>
          <textarea aria-label="Your rotation"
            value={rotation}
            onChange={e => { setRotation(e.target.value); setRoast('') }}
            placeholder="List 2–5 shoes you own or rotate. Be honest. Claude will be."
            rows={3}
            style={{ width: '100%', background: '#0d0d0d', border: '1px solid #1a1a1a', color: B.white, padding: '12px 14px', fontFamily: "'Space Mono'", fontSize: 11, lineHeight: 1.7, resize: 'vertical', outline: 'none' }}
          />
        </div>

        <div style={{ marginBottom: 24 }}>
          <div style={{ fontFamily: "'Space Mono'", fontSize: 8, color: B.dim, letterSpacing: '0.2em', marginBottom: 10 }}>INTENSITY</div>
          <div style={{ display: 'flex', gap: 8 }}>
            {INTENSITIES.map(v => (
              <button key={v.label} onClick={() => { setIntensity(vibe => vibe === v.value ? null : v.value); setRoast('') }} style={{ flex: 1, padding: '9px 8px', background: intensity === v.value ? `${B.amber}14` : '#0d0d0d', border: `1px solid ${intensity === v.value ? B.amber : '#1a1a1a'}`, color: intensity === v.value ? B.amber : B.dim, fontFamily: "'Space Mono'", fontSize: 8, letterSpacing: '0.08em', cursor: 'pointer', transition: 'all 0.15s' }}>
                {v.label}
              </button>
            ))}
          </div>
        </div>

        <button onClick={generate} disabled={!rotation.trim() || loading} style={{ width: '100%', padding: '14px', background: rotation.trim() && !loading ? '#ef4444' : '#111', color: rotation.trim() && !loading ? B.white : B.dim, border: 'none', fontFamily: "'Space Mono'", fontSize: 11, letterSpacing: '0.2em', fontWeight: 700, cursor: rotation.trim() && !loading ? 'pointer' : 'default', marginBottom: 24, transition: 'all 0.2s' }}>
          {loading ? '⟳ LOADING THE BARS...' : 'ROAST ME →'}
        </button>

        {error && <div style={{ background: '#1a0000', border: '1px solid #ff444422', padding: 12, marginBottom: 16, fontFamily: "'Space Mono'", fontSize: 10, color: '#ff6666' }}>{error}</div>}

        {roast && (
          <div style={{ animation: 'roastSlide 0.35s ease' }}>
            <div style={{ background: '#0a0a0a', border: '2px solid #ef444433', padding: '24px 28px', marginBottom: 14 }}>
              <div style={{ fontFamily: "'Space Mono'", fontSize: 8, color: '#ef4444', letterSpacing: '0.2em', marginBottom: 16 }}>THE ROAST</div>
              <div style={{ fontFamily: "'Space Mono'", fontSize: 11, color: B.white, lineHeight: 2.0, whiteSpace: 'pre-wrap' }}>{roast}</div>
            </div>
            <div style={{ display: 'flex', gap: 10 }}>
              <button onClick={copy} style={{ flex: 1, padding: '12px', background: copied ? '#052e16' : B.amber, color: copied ? '#22c55e' : B.black, border: 'none', fontFamily: "'Space Mono'", fontSize: 10, letterSpacing: '0.15em', fontWeight: 700, cursor: 'pointer', transition: 'all 0.2s' }}>
                {copied ? '✓ COPIED' : 'COPY → POST IT'}
              </button>
              <button onClick={generate} style={{ flex: 1, padding: '12px', background: 'transparent', border: '1px solid #ef444444', color: '#ef4444', fontFamily: "'Space Mono'", fontSize: 10, letterSpacing: '0.15em', fontWeight: 700, cursor: 'pointer' }}>
                ANOTHER ONE ↺
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
