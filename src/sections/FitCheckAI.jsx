import { useState } from 'react'
import { B } from '../tokens'
import { GrainOverlay, ScanLines, SectionTag } from '../components/Shared'
import { claudeChat, useAiAvailable } from '../lib/catalystAI'
import AIComingSoon from '../components/AIComingSoon'

const CONTEXTS = [
  { label: 'SF26 DAY 1', value: 'Sneakers Fest Day 1 main event — needs to hold up all day' },
  { label: 'AFTER PARTY', value: 'SF26 after-party — night energy, club/lounge vibes' },
  { label: 'VENDOR BOOTH', value: 'Working a vendor booth — standing for hours, needs to be clean and professional' },
  { label: 'GENERAL FLEX', value: 'General Lagos street flexing — anywhere, anytime heat' },
]

const SYSTEM = `You are Lagos's most honest sneaker fashion critic. Rate an SF26 fit brutally but fairly.

Respond with ONLY this JSON:
{
  "score": 8,
  "headline": "One punchy sentence — the verdict",
  "positives": ["What's actually hard about this fit (2-3 specific points)"],
  "fixes": ["Concrete things to change or swap (1-3 — only what's genuinely wrong)"],
  "verdict_line": "A single quotable Lagos-energy line the person can screenshot and post. Max 20 words. Real talk.",
  "Lagos_context": "One sentence on how this fit reads specifically in Lagos sneaker culture"
}

Be direct. Be specific. Score honestly — don't inflate. A 10 should be rare. Lagos streetwear standards are elite.`

export default function FitCheckAI() {
  const aiReady = useAiAvailable()
  const [fit, setFit] = useState('')
  const [context, setContext] = useState(null)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')
  const [copied, setCopied] = useState(false)

  async function check() {
    if (!fit.trim()) return
    if (!aiReady) {
      setError('Fit Check is not live yet. It will be ready before December 12.')
      return
    }
    setLoading(true)
    setResult(null)
    setError('')
    setCopied(false)
    try {
      const ctx = context ? `\nContext: ${context}` : ''
      const prompt = `Rate this fit for SF26:\n\n${fit}${ctx}`
      const raw = await claudeChat([{ role: 'user', content: prompt }], { feature: 'FitCheckAI', model: 'smart', system: SYSTEM, maxTokens: 600 })
      const match = raw.match(/\{[\s\S]*\}/)
      if (match) setResult(JSON.parse(match[0]))
      else setError('Could not parse rating. Try again.')
    } catch (e) {
      setError(e.message || 'Something went wrong.')
    } finally {
      setLoading(false)
    }
  }

  function copy() {
    if (!result?.verdict_line) return
    navigator.clipboard.writeText(result.verdict_line).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2200)
    })
  }

  const scoreColor = result ? (result.score >= 8 ? B.neonLime : result.score >= 6 ? B.amber : '#ef4444') : B.amber

  return (
    <section id="fit-check" style={{ background: '#050505', padding: '80px 20px', position: 'relative', overflow: 'hidden' }}>
      <GrainOverlay />
      <ScanLines />
      <style>{`@keyframes fcSlide { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:translateY(0)} }`}</style>

      <div style={{ maxWidth: 720, margin: '0 auto' }}>
        <SectionTag>AI FIT JUDGE</SectionTag>
        {!aiReady && <AIComingSoon feature="Fit Check AI" />}
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12, marginBottom: 8 }}>
          <h2 style={{ fontFamily: "'Bebas Neue'", fontSize: 'clamp(2rem,5vw,3.5rem)', color: B.white, letterSpacing: '0.05em', margin: 0 }}>
            FIT CHECK AI
          </h2>
          <div style={{ fontFamily: "'Space Mono'", fontSize: 9, color: B.dim, letterSpacing: '0.15em' }}>LAGOS STYLE CRITIC</div>
        </div>
        <p style={{ color: B.smoke, fontFamily: "'Space Mono'", fontSize: '0.72rem', marginBottom: 36, letterSpacing: '0.04em' }}>
          Describe your SF26 fit · Claude rates it 1–10 · Get the honest Lagos verdict
        </p>

        <textarea
          value={fit}
          onChange={e => { setFit(e.target.value); setResult(null) }}
          placeholder="Describe every detail — shoes, pants, top, accessories, colours, brand. The more you give, the sharper the read."
          rows={5}
          style={{ width: '100%', background: '#0d0d0d', border: '1px solid #1a1a1a', color: B.white, padding: '14px 16px', fontFamily: "'Space Mono'", fontSize: 11, lineHeight: 1.7, marginBottom: 14, resize: 'vertical', outline: 'none' }}
        />

        <div style={{ marginBottom: 20 }}>
          <div style={{ fontFamily: "'Space Mono'", fontSize: 8, color: B.dim, letterSpacing: '0.2em', marginBottom: 10 }}>CONTEXT (OPTIONAL)</div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {CONTEXTS.map(c => (
              <button key={c.label} onClick={() => { setContext(c.value === context ? null : c.value); setResult(null) }} style={{ padding: '7px 14px', background: context === c.value ? `${B.amber}18` : '#0d0d0d', border: `1px solid ${context === c.value ? B.amber : '#1a1a1a'}`, color: context === c.value ? B.amber : B.dim, fontFamily: "'Space Mono'", fontSize: 8, letterSpacing: '0.1em', cursor: 'pointer', transition: 'all 0.15s' }}>
                {c.label}
              </button>
            ))}
          </div>
        </div>

        <button onClick={check} disabled={!fit.trim() || loading} style={{ width: '100%', padding: '14px', background: fit.trim() && !loading ? B.amber : '#111', color: fit.trim() && !loading ? B.black : B.dim, border: 'none', fontFamily: "'Space Mono'", fontSize: 11, letterSpacing: '0.2em', fontWeight: 700, cursor: fit.trim() && !loading ? 'pointer' : 'default', marginBottom: 24, transition: 'all 0.2s' }}>
          {loading ? '⟳ READING THE FIT...' : 'CHECK MY FIT →'}
        </button>

        {error && <div style={{ background: '#1a0000', border: '1px solid #ff444422', padding: 12, marginBottom: 16, fontFamily: "'Space Mono'", fontSize: 10, color: '#ff6666' }}>{error}</div>}

        {result && (
          <div style={{ animation: 'fcSlide 0.35s ease' }}>
            <div style={{ display: 'flex', gap: 20, alignItems: 'center', background: '#0a0a0a', border: `2px solid ${scoreColor}44`, padding: '20px 24px', marginBottom: 16, flexWrap: 'wrap' }}>
              <div style={{ fontFamily: "'Orbitron'", fontSize: 56, fontWeight: 900, color: scoreColor, lineHeight: 1, flexShrink: 0 }}>
                {result.score}<span style={{ fontSize: 20, color: B.dim }}>/10</span>
              </div>
              <div>
                <div style={{ fontFamily: "'Bebas Neue'", fontSize: 18, color: B.white, letterSpacing: '0.05em', marginBottom: 4 }}>{result.headline}</div>
                <div style={{ fontFamily: "'Space Mono'", fontSize: 9, color: B.smoke, lineHeight: 1.6 }}>{result.Lagos_context}</div>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 16 }}>
              <div style={{ background: '#0a0a0a', border: `1px solid ${B.neonLime}15`, padding: '14px 16px' }}>
                <div style={{ fontFamily: "'Space Mono'", fontSize: 8, color: B.neonLime, letterSpacing: '0.15em', marginBottom: 8 }}>WHAT'S HARD ✓</div>
                {(result.positives || []).map((p, i) => (
                  <div key={i} style={{ fontFamily: "'Space Mono'", fontSize: 9, color: B.smoke, lineHeight: 1.7, marginBottom: 6 }}>· {p}</div>
                ))}
              </div>
              <div style={{ background: '#0a0a0a', border: '1px solid #ef444415', padding: '14px 16px' }}>
                <div style={{ fontFamily: "'Space Mono'", fontSize: 8, color: '#ef4444', letterSpacing: '0.15em', marginBottom: 8 }}>WHAT TO FIX ✗</div>
                {(result.fixes || []).length ? (result.fixes || []).map((f, i) => (
                  <div key={i} style={{ fontFamily: "'Space Mono'", fontSize: 9, color: B.smoke, lineHeight: 1.7, marginBottom: 6 }}>· {f}</div>
                )) : <div style={{ fontFamily: "'Space Mono'", fontSize: 9, color: B.dim }}>Nothing major to fix.</div>}
              </div>
            </div>

            <div style={{ background: '#0a0a0a', border: `1px solid ${scoreColor}22`, padding: '16px 20px', marginBottom: 14 }}>
              <div style={{ fontFamily: "'Space Mono'", fontSize: 8, color: B.dim, letterSpacing: '0.2em', marginBottom: 8 }}>SCREENSHOT THIS</div>
              <div style={{ fontFamily: "'Bebas Neue'", fontSize: 18, color: scoreColor, letterSpacing: '0.04em', marginBottom: 14 }}>{result.verdict_line}</div>
              <button onClick={copy} style={{ background: copied ? '#052e16' : B.amber, border: 'none', color: copied ? '#22c55e' : B.black, fontFamily: "'Space Mono'", fontSize: 9, letterSpacing: '0.15em', fontWeight: 700, padding: '9px 20px', cursor: 'pointer', transition: 'all 0.2s' }}>
                {copied ? '✓ COPIED' : 'COPY LINE →'}
              </button>
            </div>

            <button onClick={() => { setResult(null); setFit('') }} style={{ width: '100%', background: 'transparent', border: '1px solid #1a1a1a', color: B.dim, fontFamily: "'Space Mono'", fontSize: 9, letterSpacing: '0.15em', padding: '10px', cursor: 'pointer' }}>
              CHECK ANOTHER FIT
            </button>
          </div>
        )}
      </div>
    </section>
  )
}
