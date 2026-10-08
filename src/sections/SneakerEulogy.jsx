import { useState } from 'react'
import { B } from '../tokens'
import { GrainOverlay, ScanLines, SectionTag } from '../components/Shared'
import { claudeChat, useAiAvailable } from '../lib/catalystAI'
import AIComingSoon from '../components/AIComingSoon'

const REASONS = [
  { label: 'SELLING', value: 'selling — letting go for the money but it still hurts' },
  { label: 'RETIRING', value: 'retiring — too beat up to wear but too loved to throw away' },
  { label: 'GIFTED', value: 'gifted — gave them to someone who needed them more' },
  { label: 'LOST / STOLEN', value: 'lost or stolen — gone before they should have been' },
]

const SYSTEM = `You are a Lagos sneaker elegist. Write a cinematic, emotionally devastating farewell to a pair of sneakers.

Rules:
- Write in second person ("you"), addressed to the person saying goodbye
- Exactly 3 paragraphs — opening (the history), middle (the moment of parting), closing (the legacy)
- Infuse Lagos feeling — real streets, real love, real loss
- Be specific to the shoe and the memories given
- Match the reason they're leaving
- The final line must be the kind of sentence that gets shared

Write ONLY the eulogy. No title, no intro, no label. Three paragraphs.`

const EXAMPLES = [
  { shoe: 'Air Jordan 1 Bred Toe (2018)', duration: '4 years', reason: 'SELLING', memory: 'Wore them to every major moment. First job interview. First Lagos night out. First time my side hustle paid off.' },
  { shoe: 'Nike Air Max 95 OG', duration: '7 years', reason: 'RETIRING', memory: 'Bought them from a plug in Alaba for half price. One sole is coming off. I tried to glue it. Twice. Time to rest.' },
]

export default function SneakerEulogy() {
  const aiReady = useAiAvailable()
  const [shoe, setShoe] = useState('')
  const [duration, setDuration] = useState('')
  const [memory, setMemory] = useState('')
  const [reason, setReason] = useState(null)
  const [loading, setLoading] = useState(false)
  const [eulogy, setEulogy] = useState('')
  const [error, setError] = useState('')
  const [copied, setCopied] = useState(false)

  function loadExample(ex) {
    setShoe(ex.shoe)
    setDuration(ex.duration)
    setMemory(ex.memory)
    setReason(REASONS.find(r => r.label === ex.reason)?.value || null)
    setEulogy('')
  }

  async function generate() {
    if (!shoe.trim() || !memory.trim()) return
    if (!aiReady) {
      setError('Sneaker Eulogy is not live yet. It will be ready before December 12.')
      return
    }
    setLoading(true)
    setEulogy('')
    setError('')
    setCopied(false)
    try {
      const durationContext = duration.trim() ? `\nTime owned: ${duration}` : ''
      const reasonContext = reason ? `\nReason for leaving: ${reason}` : ''
      const prompt = `Shoe: ${shoe}${durationContext}\nMemories: ${memory}${reasonContext}\n\nWrite my sneaker eulogy.`
      const raw = await claudeChat([{ role: 'user', content: prompt }], { feature: 'SneakerEulogy', model: 'balanced', system: SYSTEM, maxTokens: 450 })
      setEulogy(raw.trim())
    } catch (e) {
      setError(e.message || 'Something went wrong.')
    } finally {
      setLoading(false)
    }
  }

  function copy() {
    if (!eulogy) return
    navigator.clipboard.writeText(eulogy).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2200)
    })
  }

  const ready = shoe.trim() && memory.trim()

  return (
    <section id="sneaker-eulogy" style={{ background: '#050505', padding: '80px 20px', position: 'relative', overflow: 'hidden' }}>
      <GrainOverlay />
      <ScanLines />
      <style>{`@keyframes euSlide { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:translateY(0)} }`}</style>

      <div style={{ maxWidth: 700, margin: '0 auto' }}>
        <SectionTag>FAREWELL</SectionTag>
        {!aiReady && <AIComingSoon feature="Sneaker Eulogy" />}
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12, marginBottom: 8 }}>
          <h2 style={{ fontFamily: "'Bebas Neue'", fontSize: 'clamp(2rem,5vw,3.5rem)', color: B.white, letterSpacing: '0.05em', margin: 0 }}>
            SNEAKER EULOGY
          </h2>
          <div style={{ fontFamily: "'Space Mono'", fontSize: 9, color: B.dim, letterSpacing: '0.15em' }}>POWERED BY CLAUDE</div>
        </div>
        <p style={{ color: B.smoke, fontFamily: "'Space Mono'", fontSize: '0.72rem', marginBottom: 36, letterSpacing: '0.04em' }}>
          A pair + the memories · Claude writes the farewell · Ready to post when you let them go
        </p>

        <div style={{ display: 'flex', gap: 8, marginBottom: 16, alignItems: 'center' }}>
          <span style={{ fontFamily: "'Space Mono'", fontSize: 8, color: B.dim, letterSpacing: '0.1em' }}>EXAMPLES →</span>
          {EXAMPLES.map((ex, i) => (
            <button key={i} onClick={() => loadExample(ex)} style={{ background: '#0d0d0d', border: '1px solid #1a1a1a', color: B.dim, fontFamily: "'Space Mono'", fontSize: 8, padding: '5px 12px', cursor: 'pointer' }}>
              EX {i + 1}
            </button>
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 12, marginBottom: 14 }}>
          <div>
            <div style={{ fontFamily: "'Space Mono'", fontSize: 8, color: B.dim, letterSpacing: '0.2em', marginBottom: 8 }}>THE SHOE</div>
            <input aria-label="The shoe"
              value={shoe}
              onChange={e => { setShoe(e.target.value); setEulogy('') }}
              placeholder="e.g. Nike Air Max 97 Silver Bullet, Yeezy 350 Cream"
              style={{ width: '100%', background: '#0d0d0d', border: '1px solid #1a1a1a', color: B.white, padding: '11px 14px', fontFamily: "'Space Mono'", fontSize: 10, outline: 'none' }}
            />
          </div>
          <div>
            <div style={{ fontFamily: "'Space Mono'", fontSize: 8, color: B.dim, letterSpacing: '0.2em', marginBottom: 8 }}>HOW LONG</div>
            <input aria-label="How long you had them"
              value={duration}
              onChange={e => { setDuration(e.target.value); setEulogy('') }}
              placeholder="e.g. 3 years"
              style={{ width: '100%', background: '#0d0d0d', border: '1px solid #1a1a1a', color: B.white, padding: '11px 14px', fontFamily: "'Space Mono'", fontSize: 10, outline: 'none' }}
            />
          </div>
        </div>

        <div style={{ marginBottom: 18 }}>
          <div style={{ fontFamily: "'Space Mono'", fontSize: 8, color: B.dim, letterSpacing: '0.2em', marginBottom: 8 }}>THE MEMORIES</div>
          <textarea aria-label="The memories"
            value={memory}
            onChange={e => { setMemory(e.target.value); setEulogy('') }}
            placeholder="What happened in these shoes? Where did they take you? What do they mean?"
            rows={4}
            style={{ width: '100%', background: '#0d0d0d', border: '1px solid #1a1a1a', color: B.white, padding: '12px 14px', fontFamily: "'Space Mono'", fontSize: 11, lineHeight: 1.7, resize: 'vertical', outline: 'none' }}
          />
        </div>

        <div style={{ marginBottom: 22 }}>
          <div style={{ fontFamily: "'Space Mono'", fontSize: 8, color: B.dim, letterSpacing: '0.2em', marginBottom: 10 }}>WHY THEY'RE LEAVING</div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {REASONS.map(r => (
              <button key={r.label} onClick={() => { setReason(reason === r.value ? null : r.value); setEulogy('') }} style={{ padding: '7px 14px', background: reason === r.value ? `${B.neonCyan}14` : '#0d0d0d', border: `1px solid ${reason === r.value ? B.neonCyan : '#1a1a1a'}`, color: reason === r.value ? B.neonCyan : B.dim, fontFamily: "'Space Mono'", fontSize: 8, letterSpacing: '0.1em', cursor: 'pointer', transition: 'all 0.15s' }}>
                {r.label}
              </button>
            ))}
          </div>
        </div>

        <button onClick={generate} disabled={!ready || loading} style={{ width: '100%', padding: '14px', background: ready && !loading ? B.amber : '#111', color: ready && !loading ? B.black : B.dim, border: 'none', fontFamily: "'Space Mono'", fontSize: 11, letterSpacing: '0.2em', fontWeight: 700, cursor: ready && !loading ? 'pointer' : 'default', marginBottom: 24, transition: 'all 0.2s' }}>
          {loading ? '⟳ WRITING THE FAREWELL...' : 'WRITE MY EULOGY →'}
        </button>

        {error && <div style={{ background: '#1a0000', border: '1px solid #ff444422', padding: 12, marginBottom: 16, fontFamily: "'Space Mono'", fontSize: 10, color: '#ff6666' }}>{error}</div>}

        {eulogy && (
          <div style={{ animation: 'euSlide 0.35s ease' }}>
            <div style={{ background: '#0a0a0a', border: `1px solid ${B.neonCyan}22`, padding: '28px 28px', marginBottom: 14 }}>
              <div style={{ fontFamily: "'Space Mono'", fontSize: 8, color: B.dim, letterSpacing: '0.25em', marginBottom: 18 }}>
                {shoe.toUpperCase()} · FAREWELL
              </div>
              <div style={{ fontFamily: "'Space Mono'", fontSize: 11, color: B.white, lineHeight: 2.1, whiteSpace: 'pre-wrap' }}>{eulogy}</div>
            </div>
            <div style={{ display: 'flex', gap: 10 }}>
              <button onClick={copy} style={{ flex: 1, padding: '12px', background: copied ? '#052e16' : B.amber, color: copied ? '#22c55e' : B.black, border: 'none', fontFamily: "'Space Mono'", fontSize: 10, letterSpacing: '0.15em', fontWeight: 700, cursor: 'pointer', transition: 'all 0.2s' }}>
                {copied ? '✓ COPIED' : 'COPY EULOGY →'}
              </button>
              <button onClick={generate} style={{ flex: 1, padding: '12px', background: 'transparent', border: `1px solid ${B.amber}44`, color: B.amber, fontFamily: "'Space Mono'", fontSize: 10, letterSpacing: '0.15em', fontWeight: 700, cursor: 'pointer' }}>
                REWRITE ↺
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
