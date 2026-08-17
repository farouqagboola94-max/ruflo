import { useState } from 'react'
import { B } from '../tokens'
import { GrainOverlay, ScanLines, SectionTag } from '../components/Shared'
import { claudeChat, useAiAvailable } from '../lib/catalystAI'
import AIComingSoon from '../components/AIComingSoon'

const SYSTEM = `You are the official Lagos Sneaker Culture registry. Based on someone's rotation, issue their collector profile.

Respond with ONLY this JSON:
{
  "collector_title": "Their official title — 3–5 words, e.g. 'The Grail Keeper of Lekki' or 'Island Flex God' or 'Alaba Market Prophet'",
  "rank": "LEGENDARY" | "ELITE" | "CERTIFIED" | "RISING" | "CASUAL",
  "rep_score": 87,
  "tagline": "One line that sums up their collector identity. Lagos voice.",
  "specialty": "What they clearly specialise in — e.g. retro Jordan heat, German engineering, rare colourways",
  "longest_flex": "Their most impressive shoe in the rotation — explain why it's a flex in Lagos context",
  "weakest_link": "The shoe holding back their rep — be specific but not cruel",
  "signature_move": "How this collector moves — what's their buying style, their flex method, their trade approach",
  "sf26_predicted_behavior": "What this collector will do at Sneakers Fest '26 — specific, funny, true",
  "share_line": "A one-line identity statement for them to post. Under 20 words. Quotable."
}

Rep score is 1–100. LEGENDARY is 90+, ELITE 75–89, CERTIFIED 60–74, RISING 45–59, CASUAL under 45.
Be specific and insightful, not generic. The title and share_line must feel earned.`

const RANK_CONFIG = {
  LEGENDARY: { color: B.amber, bg: '#1c1400' },
  ELITE:     { color: B.neonCyan, bg: '#001a1a' },
  CERTIFIED: { color: B.neonLime, bg: '#0a1a00' },
  RISING:    { color: '#A855F7', bg: '#0d0014' },
  CASUAL:    { color: B.smoke, bg: '#0a0a0a' },
}

const ACCENT = [B.amber, B.neonCyan, '#A855F7', B.neonLime, '#f97316']

export default function CollectorCard() {
  const aiReady = useAiAvailable()
  const [shoes, setShoes] = useState(['', '', ''])
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
    if (shoes.length <= 3) return
    setShoes(shoes.filter((_, idx) => idx !== i))
    setResult(null)
  }

  async function generate() {
    const filled = shoes.filter(s => s.trim())
    if (filled.length < 3) return
    if (!aiReady) {
      setError('Collector Card is not live yet. It will be ready before December 12.')
      return
    }
    setLoading(true)
    setResult(null)
    setError('')
    setCopied(false)
    try {
      const list = filled.map((s, i) => `${i + 1}. ${s}`).join('\n')
      const prompt = `My rotation:\n${list}\n\nIssue my collector card.`
      const raw = await claudeChat([{ role: 'user', content: prompt }], { feature: 'CollectorCard', model: 'smart', system: SYSTEM, maxTokens: 700 })
      const match = raw.match(/\{[\s\S]*\}/)
      if (match) setResult(JSON.parse(match[0]))
      else setError('Could not parse card. Try again.')
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
  const rc = result ? RANK_CONFIG[result.rank] : null

  return (
    <section id="collector-card" style={{ background: '#040404', padding: '80px 20px', position: 'relative', overflow: 'hidden' }}>
      <GrainOverlay />
      <ScanLines />
      <style>{`@keyframes ccSlide { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:translateY(0)} }`}</style>

      <div style={{ maxWidth: 700, margin: '0 auto' }}>
        <SectionTag>COLLECTOR REGISTRY</SectionTag>
        {!aiReady && <AIComingSoon feature="Collector Card" />}
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12, marginBottom: 8 }}>
          <h2 style={{ fontFamily: "'Bebas Neue'", fontSize: 'clamp(2rem,5vw,3.5rem)', color: B.white, letterSpacing: '0.05em', margin: 0 }}>
            COLLECTOR CARD
          </h2>
          <div style={{ fontFamily: "'Space Mono'", fontSize: 9, color: B.dim, letterSpacing: '0.15em' }}>LAGOS SNEAKER REGISTRY</div>
        </div>
        <p style={{ color: B.smoke, fontFamily: "'Space Mono'", fontSize: '0.72rem', marginBottom: 36, letterSpacing: '0.04em' }}>
          Enter 3–5 shoes from your rotation · Claude issues your official collector profile · Screenshot it
        </p>

        <div style={{ marginBottom: 20 }}>
          <div style={{ fontFamily: "'Space Mono'", fontSize: 8, color: B.dim, letterSpacing: '0.2em', marginBottom: 12 }}>YOUR ROTATION (3–5)</div>
          {shoes.map((s, i) => (
            <div key={i} style={{ display: 'flex', gap: 8, marginBottom: 8, alignItems: 'center' }}>
              <div style={{ fontFamily: "'Orbitron'", fontSize: 11, color: ACCENT[i % ACCENT.length], fontWeight: 900, width: 20, flexShrink: 0 }}>0{i + 1}</div>
              <input
                value={s}
                onChange={e => updateShoe(i, e.target.value)}
                placeholder={`Shoe ${i + 1}`}
                style={{ flex: 1, background: '#0d0d0d', border: `1px solid ${s.trim() ? ACCENT[i % ACCENT.length] + '44' : '#1a1a1a'}`, color: B.white, padding: '11px 14px', fontFamily: "'Space Mono'", fontSize: 10, outline: 'none', transition: 'border-color 0.15s' }}
              />
              {shoes.length > 3 && (
                <button onClick={() => removeShoe(i)} style={{ background: 'none', border: '1px solid #1a1a1a', color: B.dim, padding: '11px 12px', cursor: 'pointer', fontFamily: "'Space Mono'", fontSize: 10 }}>✕</button>
              )}
            </div>
          ))}
          {shoes.length < 5 && (
            <button onClick={addShoe} style={{ background: 'transparent', border: '1px dashed #2a2a2a', color: B.dim, fontFamily: "'Space Mono'", fontSize: 8, letterSpacing: '0.15em', padding: '8px 16px', cursor: 'pointer', marginTop: 4 }}>
              + ADD SHOE
            </button>
          )}
        </div>

        <button onClick={generate} disabled={filled.length < 3 || loading} style={{ width: '100%', padding: '14px', background: filled.length >= 3 && !loading ? B.amber : '#111', color: filled.length >= 3 && !loading ? B.black : B.dim, border: 'none', fontFamily: "'Space Mono'", fontSize: 11, letterSpacing: '0.2em', fontWeight: 700, cursor: filled.length >= 3 && !loading ? 'pointer' : 'default', marginBottom: 24, transition: 'all 0.2s' }}>
          {loading ? '⟳ ISSUING YOUR CARD...' : filled.length < 3 ? 'ADD AT LEAST 3 SHOES' : 'ISSUE MY COLLECTOR CARD →'}
        </button>

        {error && <div style={{ background: '#1a0000', border: '1px solid #ff444422', padding: 12, marginBottom: 16, fontFamily: "'Space Mono'", fontSize: 10, color: '#ff6666' }}>{error}</div>}

        {result && rc && (
          <div style={{ animation: 'ccSlide 0.4s ease' }}>
            <div style={{ background: rc.bg, border: `2px solid ${rc.color}44`, padding: '28px 28px', marginBottom: 16, textAlign: 'center' }}>
              <div style={{ fontFamily: "'Space Mono'", fontSize: 8, color: B.dim, letterSpacing: '0.25em', marginBottom: 10 }}>OFFICIAL COLLECTOR CARD</div>
              <div style={{ fontFamily: "'Bebas Neue'", fontSize: 'clamp(1.4rem,3.5vw,2.4rem)', color: rc.color, letterSpacing: '0.05em', marginBottom: 8 }}>{result.collector_title}</div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 20, marginBottom: 14 }}>
                <div style={{ fontFamily: "'Orbitron'", fontSize: 48, fontWeight: 900, color: rc.color, lineHeight: 1 }}>{result.rep_score}</div>
                <div>
                  <div style={{ fontFamily: "'Space Mono'", fontSize: 9, color: B.dim, letterSpacing: '0.15em' }}>REP SCORE</div>
                  <div style={{ fontFamily: "'Orbitron'", fontSize: 14, fontWeight: 900, color: rc.color }}>{result.rank}</div>
                </div>
              </div>
              <div style={{ fontFamily: "'Space Mono'", fontSize: 10, color: B.smoke, lineHeight: 1.6 }}>{result.tagline}</div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 12 }}>
              <div style={{ background: '#0a0a0a', border: `1px solid ${B.amber}20`, padding: '12px 14px' }}>
                <div style={{ fontFamily: "'Space Mono'", fontSize: 9, color: B.amber, letterSpacing: '0.15em', marginBottom: 5 }}>SPECIALTY</div>
                <div style={{ fontFamily: "'Space Mono'", fontSize: 9, color: B.smoke, lineHeight: 1.6 }}>{result.specialty}</div>
              </div>
              <div style={{ background: '#0a0a0a', border: `1px solid ${B.neonCyan}20`, padding: '12px 14px' }}>
                <div style={{ fontFamily: "'Space Mono'", fontSize: 9, color: B.neonCyan, letterSpacing: '0.15em', marginBottom: 5 }}>SIGNATURE MOVE</div>
                <div style={{ fontFamily: "'Space Mono'", fontSize: 9, color: B.smoke, lineHeight: 1.6 }}>{result.signature_move}</div>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 12 }}>
              <div style={{ background: '#0a0a0a', border: `1px solid ${B.neonLime}20`, padding: '12px 14px' }}>
                <div style={{ fontFamily: "'Space Mono'", fontSize: 9, color: B.neonLime, letterSpacing: '0.15em', marginBottom: 5 }}>LONGEST FLEX</div>
                <div style={{ fontFamily: "'Space Mono'", fontSize: 9, color: B.smoke, lineHeight: 1.6 }}>{result.longest_flex}</div>
              </div>
              <div style={{ background: '#1a0000', border: '1px solid #ef444418', padding: '12px 14px' }}>
                <div style={{ fontFamily: "'Space Mono'", fontSize: 9, color: '#ef4444', letterSpacing: '0.15em', marginBottom: 5 }}>WEAKEST LINK</div>
                <div style={{ fontFamily: "'Space Mono'", fontSize: 9, color: '#ff8888', lineHeight: 1.6 }}>{result.weakest_link}</div>
              </div>
            </div>

            <div style={{ background: '#0a0a0a', border: `1px solid ${'#A855F7'}20`, padding: '12px 16px', marginBottom: 12 }}>
              <div style={{ fontFamily: "'Space Mono'", fontSize: 9, color: '#A855F7', letterSpacing: '0.15em', marginBottom: 5 }}>AT SF26</div>
              <div style={{ fontFamily: "'Space Mono'", fontSize: 9, color: B.smoke, lineHeight: 1.6 }}>{result.sf26_predicted_behavior}</div>
            </div>

            <div style={{ background: '#0a0a0a', border: `2px solid ${rc.color}33`, padding: '16px 20px', marginBottom: 14 }}>
              <div style={{ fontFamily: "'Space Mono'", fontSize: 9, color: B.dim, letterSpacing: '0.2em', marginBottom: 8 }}>YOUR IDENTITY</div>
              <div style={{ fontFamily: "'Bebas Neue'", fontSize: 18, color: B.white, letterSpacing: '0.04em', marginBottom: 14, lineHeight: 1.4 }}>{result.share_line}</div>
              <button onClick={copy} style={{ background: copied ? '#052e16' : rc.color, border: 'none', color: copied ? '#22c55e' : B.black, fontFamily: "'Space Mono'", fontSize: 9, letterSpacing: '0.15em', fontWeight: 700, padding: '9px 20px', cursor: 'pointer', transition: 'all 0.2s' }}>
                {copied ? '✓ COPIED' : 'COPY → POST IT'}
              </button>
            </div>

            <button onClick={() => { setResult(null); setShoes(['', '', '']) }} style={{ width: '100%', background: 'transparent', border: '1px solid #1a1a1a', color: B.dim, fontFamily: "'Space Mono'", fontSize: 9, letterSpacing: '0.15em', padding: '10px', cursor: 'pointer' }}>
              RESET — TRY DIFFERENT SHOES
            </button>
          </div>
        )}
      </div>
    </section>
  )
}
