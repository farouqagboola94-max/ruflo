import { useState } from 'react'
import { B } from '../tokens'
import { GrainOverlay, ScanLines, SectionTag } from '../components/Shared'
import { claudeChat, getApiKey } from '../lib/catalystAI'

const SYSTEM = `You are a Lagos sneaker culture psychologist. Based on a person's sneaker choices, reveal their true sneaker archetype.

Respond with ONLY this JSON:
{
  "archetype": "The [Name] — 2-3 words max, e.g. 'The Lagos Prophet' or 'The Grail Keeper' or 'The Daily Warrior' or 'The Culture Shifter' or 'The Flex God' or 'The Silent Legend' — be creative, make it feel earned",
  "tagline": "One Lagos-flavoured sentence that perfectly captures this archetype. Should feel like a title card.",
  "traits": ["3 defining traits of this archetype — specific to the shoes chosen"],
  "what_you_value": "What this person really values in sneaker culture (2 sentences)",
  "spirit_shoe": "The one shoe that perfectly embodies this person's essence — with brief explanation",
  "sf26_move": "What this archetype does at Sneakers Fest '26 — how they move through the event",
  "share_line": "A single quotable line the person can screenshot and post. Should feel like their sneaker identity statement. Max 25 words."
}

Be insightful and specific — don't be generic. The archetype should feel earned from the actual shoes listed.`

export default function StyleArchetype() {
  const [shoes, setShoes] = useState(['', ''])
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')
  const [copied, setCopied] = useState(false)

  function updateShoe(i, val) {
    const next = [...shoes]
    next[i] = val
    setShoes(next)
    setResult(null)
  }

  function addShoe() {
    if (shoes.length < 5) setShoes([...shoes, ''])
  }

  function removeShoe(i) {
    if (shoes.length <= 2) return
    setShoes(shoes.filter((_, idx) => idx !== i))
    setResult(null)
  }

  async function discover() {
    const filled = shoes.filter(s => s.trim())
    if (filled.length < 2) return
    if (!getApiKey()) {
      setError('Add your Anthropic API key in the AI Chat widget to unlock Style Archetype.')
      return
    }
    setLoading(true)
    setResult(null)
    setError('')
    setCopied(false)
    try {
      const list = filled.map((s, i) => `${i + 1}. ${s}`).join('\n')
      const prompt = `My sneakers:\n${list}\n\nReveal my sneaker archetype.`
      const raw = await claudeChat([{ role: 'user', content: prompt }], { model: 'smart', system: SYSTEM, maxTokens: 700 })
      const match = raw.match(/\{[\s\S]*\}/)
      if (match) setResult(JSON.parse(match[0]))
      else setError('Could not parse archetype. Try again.')
    } catch (e) {
      setError(e.message || 'Something went wrong.')
    } finally {
      setLoading(false)
    }
  }

  function copy() {
    if (!result?.share_line) return
    navigator.clipboard.writeText(result.share_line).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2200)
    })
  }

  const filled = shoes.filter(s => s.trim())
  const ACCENT = [B.amber, B.neonCyan, '#A855F7', B.neonLime, '#f97316']

  return (
    <section id="style-archetype" style={{ background: '#050505', padding: '80px 20px', position: 'relative', overflow: 'hidden' }}>
      <GrainOverlay />
      <ScanLines />
      <style>{`@keyframes saSlide { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:translateY(0)} }`}</style>

      <div style={{ maxWidth: 680, margin: '0 auto' }}>
        <SectionTag>IDENTITY ENGINE</SectionTag>
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12, marginBottom: 8 }}>
          <h2 style={{ fontFamily: "'Bebas Neue'", fontSize: 'clamp(2rem,5vw,3.5rem)', color: B.white, letterSpacing: '0.05em', margin: 0 }}>
            YOUR STYLE ARCHETYPE
          </h2>
          <div style={{ fontFamily: "'Space Mono'", fontSize: 9, color: '#444', letterSpacing: '0.15em' }}>POWERED BY CLAUDE</div>
        </div>
        <p style={{ color: B.smoke, fontFamily: "'Space Mono'", fontSize: '0.72rem', marginBottom: 36, letterSpacing: '0.04em' }}>
          List 2–5 shoes you own or love · Claude reads your taste · Reveals who you really are
        </p>

        <div style={{ marginBottom: 20 }}>
          <div style={{ fontFamily: "'Space Mono'", fontSize: 8, color: '#333', letterSpacing: '0.2em', marginBottom: 12 }}>YOUR SHOES (2–5)</div>
          {shoes.map((s, i) => (
            <div key={i} style={{ display: 'flex', gap: 8, marginBottom: 8, alignItems: 'center' }}>
              <div style={{ fontFamily: "'Orbitron'", fontSize: 11, color: ACCENT[i % ACCENT.length], fontWeight: 900, width: 20, flexShrink: 0 }}>0{i + 1}</div>
              <input
                value={s}
                onChange={e => updateShoe(i, e.target.value)}
                placeholder={`Shoe ${i + 1} — name, colourway, or just the vibe`}
                style={{ flex: 1, background: '#0d0d0d', border: `1px solid ${s.trim() ? ACCENT[i % ACCENT.length] + '44' : '#1a1a1a'}`, color: B.white, padding: '11px 14px', fontFamily: "'Space Mono'", fontSize: 10, outline: 'none', transition: 'border-color 0.15s' }}
              />
              {shoes.length > 2 && (
                <button onClick={() => removeShoe(i)} style={{ background: 'none', border: '1px solid #1a1a1a', color: '#333', padding: '11px 12px', cursor: 'pointer', fontFamily: "'Space Mono'", fontSize: 10 }}>✕</button>
              )}
            </div>
          ))}
          {shoes.length < 5 && (
            <button onClick={addShoe} style={{ background: 'transparent', border: '1px dashed #2a2a2a', color: '#333', fontFamily: "'Space Mono'", fontSize: 8, letterSpacing: '0.15em', padding: '9px 16px', cursor: 'pointer', marginTop: 4, transition: 'border-color 0.15s' }}>
              + ADD ANOTHER SHOE
            </button>
          )}
        </div>

        <button onClick={discover} disabled={filled.length < 2 || loading} style={{ width: '100%', padding: '14px', background: filled.length >= 2 && !loading ? B.amber : '#111', color: filled.length >= 2 && !loading ? B.black : '#333', border: 'none', fontFamily: "'Space Mono'", fontSize: 11, letterSpacing: '0.2em', fontWeight: 700, cursor: filled.length >= 2 && !loading ? 'pointer' : 'default', marginBottom: 24, transition: 'all 0.2s' }}>
          {loading ? '⟳ READING YOUR DNA...' : filled.length < 2 ? 'ADD AT LEAST 2 SHOES' : 'DISCOVER MY ARCHETYPE →'}
        </button>

        {error && <div style={{ background: '#1a0000', border: '1px solid #ff444422', padding: 12, marginBottom: 16, fontFamily: "'Space Mono'", fontSize: 10, color: '#ff6666' }}>{error}</div>}

        {result && (
          <div style={{ animation: 'saSlide 0.4s ease' }}>
            <div style={{ background: '#0a0a0a', border: `2px solid ${B.amber}33`, padding: '28px 28px', marginBottom: 20, textAlign: 'center' }}>
              <div style={{ fontFamily: "'Space Mono'", fontSize: 8, color: '#333', letterSpacing: '0.25em', marginBottom: 12 }}>YOUR ARCHETYPE</div>
              <div style={{ fontFamily: "'Bebas Neue'", fontSize: 'clamp(1.6rem,4vw,2.8rem)', color: B.amber, letterSpacing: '0.05em', marginBottom: 10 }}>{result.archetype}</div>
              <div style={{ fontFamily: "'Space Mono'", fontSize: 11, color: B.white, lineHeight: 1.7, maxWidth: 480, margin: '0 auto' }}>{result.tagline}</div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 10, marginBottom: 16 }}>
              {(result.traits || []).map((t, i) => (
                <div key={i} style={{ background: '#0a0a0a', border: `1px solid ${ACCENT[i]}22`, padding: '12px 14px' }}>
                  <div style={{ fontFamily: "'Space Mono'", fontSize: 8, color: ACCENT[i], letterSpacing: '0.1em', marginBottom: 4 }}>TRAIT {i + 1}</div>
                  <div style={{ fontFamily: "'Space Mono'", fontSize: 9, color: B.smoke, lineHeight: 1.6 }}>{t}</div>
                </div>
              ))}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 14 }}>
              <div style={{ background: '#0a0a0a', border: `1px solid ${B.neonCyan}15`, padding: '14px 16px' }}>
                <div style={{ fontFamily: "'Space Mono'", fontSize: 8, color: B.neonCyan, letterSpacing: '0.15em', marginBottom: 6 }}>WHAT YOU VALUE</div>
                <div style={{ fontFamily: "'Space Mono'", fontSize: 9, color: B.smoke, lineHeight: 1.7 }}>{result.what_you_value}</div>
              </div>
              <div style={{ background: '#0a0a0a', border: `1px solid ${'#A855F7'}15`, padding: '14px 16px' }}>
                <div style={{ fontFamily: "'Space Mono'", fontSize: 8, color: '#A855F7', letterSpacing: '0.15em', marginBottom: 6 }}>SPIRIT SHOE</div>
                <div style={{ fontFamily: "'Space Mono'", fontSize: 9, color: B.smoke, lineHeight: 1.7 }}>{result.spirit_shoe}</div>
              </div>
            </div>

            <div style={{ background: '#0a0a0a', border: `1px solid ${B.amber}15`, padding: '12px 16px', marginBottom: 14 }}>
              <div style={{ fontFamily: "'Space Mono'", fontSize: 8, color: B.amber, letterSpacing: '0.15em', marginBottom: 4 }}>AT SNEAKERS FEST '26</div>
              <div style={{ fontFamily: "'Space Mono'", fontSize: 10, color: B.smoke, lineHeight: 1.7 }}>{result.sf26_move}</div>
            </div>

            <div style={{ background: '#0a0a0a', border: `2px solid ${B.amber}33`, padding: '16px 20px', marginBottom: 14 }}>
              <div style={{ fontFamily: "'Space Mono'", fontSize: 8, color: '#333', letterSpacing: '0.2em', marginBottom: 8 }}>YOUR IDENTITY STATEMENT</div>
              <div style={{ fontFamily: "'Bebas Neue'", fontSize: 18, color: B.white, letterSpacing: '0.04em', marginBottom: 14, lineHeight: 1.4 }}>{result.share_line}</div>
              <button onClick={copy} style={{ background: copied ? '#052e16' : B.amber, border: 'none', color: copied ? '#22c55e' : B.black, fontFamily: "'Space Mono'", fontSize: 9, letterSpacing: '0.15em', fontWeight: 700, padding: '9px 20px', cursor: 'pointer', transition: 'all 0.2s' }}>
                {copied ? '✓ COPIED' : 'COPY → POST IT'}
              </button>
            </div>

            <button onClick={() => { setResult(null); setShoes(['', '']) }} style={{ width: '100%', background: 'transparent', border: '1px solid #1a1a1a', color: '#333', fontFamily: "'Space Mono'", fontSize: 9, letterSpacing: '0.15em', padding: '10px', cursor: 'pointer' }}>
              RESET — TRY DIFFERENT SHOES
            </button>
          </div>
        )}
      </div>
    </section>
  )
}
