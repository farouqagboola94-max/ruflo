import { useState } from 'react'
import { B } from '../tokens'
import { GrainOverlay, ScanLines, SectionTag } from '../components/Shared'
import { claudeChat, useAiAvailable } from '../lib/catalystAI'
import AIComingSoon from '../components/AIComingSoon'

const PLATFORMS = [
  { label: 'INSTAGRAM', value: 'Instagram', icon: '📸', hint: 'carousel caption with hashtags, aesthetic, hook first line' },
  { label: 'X / TWITTER', value: 'X (Twitter)', icon: '𝕏', hint: 'punchy under 280 chars, no hashtag overload, real talk' },
  { label: 'WHATSAPP', value: 'WhatsApp Status', icon: '💬', hint: 'short, conversational, Lagos energy, no hashtags' },
  { label: 'TIKTOK', value: 'TikTok', icon: '🎵', hint: 'trendy, first line is the hook, emojis welcome, viral tone' },
]

const MOODS = [
  { label: 'FLEX', value: 'flexing', hint: 'show off — rare, exclusive, you ate and left no crumbs' },
  { label: 'HYPE', value: 'hype', hint: 'excited, event energy, everyone needs to be there' },
  { label: 'DEEP', value: 'thoughtful', hint: 'culture, history, story behind the shoe — real sneakerhead talk' },
  { label: 'CHILL', value: 'chill/casual', hint: 'relaxed, easy, just vibing with heat on' },
]

const TIERS = [
  { label: 'GENERAL', value: 'General Admission' },
  { label: 'VIP', value: 'VIP' },
  { label: 'VVIP', value: 'VVIP' },
  { label: 'PHALANX', value: 'Phalanx (ultra-exclusive)' },
]

const SYSTEM = `You are a social media copywriter for Lagos sneaker culture and Sneakers Fest '26 (Dec 12 2026, Muri Okunola Park, Victoria Island, Lagos).

Write ONE caption for the requested platform, mood, and ticket tier. The caption must:
- Sound authentically Lagos — not generic global sneaker content
- Match the platform format exactly (length, hashtags, emojis as appropriate)
- Reference Sneakers Fest '26 naturally
- Feel ready to post right now — no placeholders, no "[insert shoe name]"

Respond with ONLY the caption text. No intro, no explanation, no label, no quotes. Just the caption.`

export default function CaptionGenerator() {
  const aiReady = useAiAvailable()
  const [platform, setPlatform] = useState(null)
  const [mood, setMood] = useState(null)
  const [tier, setTier] = useState(null)
  const [shoe, setShoe] = useState('')
  const [loading, setLoading] = useState(false)
  const [caption, setCaption] = useState('')
  const [error, setError] = useState('')
  const [copied, setCopied] = useState(false)

  async function generate() {
    if (!platform || !mood || !tier) return
    if (!aiReady) {
      setError('Caption Generator is not live yet. It will be ready before December 12.')
      return
    }
    setLoading(true)
    setCaption('')
    setError('')
    setCopied(false)
    try {
      const shoeContext = shoe.trim() ? `\nShoe / fit: ${shoe.trim()}` : ''
      const platformObj = PLATFORMS.find(p => p.value === platform)
      const moodObj = MOODS.find(m => m.value === mood)
      const prompt = `Platform: ${platform} (${platformObj?.hint})
Mood: ${mood} — ${moodObj?.hint}
Ticket tier: ${tier}${shoeContext}

Write the perfect Sneakers Fest '26 caption.`
      const raw = await claudeChat([{ role: 'user', content: prompt }], { feature: 'CaptionGenerator', model: 'balanced', system: SYSTEM, maxTokens: 300 })
      setCaption(raw.trim())
    } catch (e) {
      setError(e.message || 'Something went wrong.')
    } finally {
      setLoading(false)
    }
  }

  function copy() {
    if (!caption) return
    navigator.clipboard.writeText(caption).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2200)
    })
  }

  const ready = platform && mood && tier

  return (
    <section id="caption-gen" style={{ background: '#060606', padding: '80px 20px', position: 'relative', overflow: 'hidden' }}>
      <GrainOverlay />
      <ScanLines />
      <style>{`
        @keyframes cgSlide { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:translateY(0)} }
        .cg-btn:hover { opacity:0.85; }
      `}</style>

      <div style={{ maxWidth: 820, margin: '0 auto' }}>
        <SectionTag>AI CAPTION STUDIO</SectionTag>
        {!aiReady && <AIComingSoon feature="Caption Studio" />}
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12, marginBottom: 8 }}>
          <h2 style={{ fontFamily: "'Bebas Neue'", fontSize: 'clamp(2rem,5vw,3.5rem)', color: B.white, letterSpacing: '0.05em', margin: 0 }}>
            SF26 CAPTION GENERATOR
          </h2>
          <div style={{ fontFamily: "'Space Mono'", fontSize: 9, color: B.dim, letterSpacing: '0.15em' }}>POWERED BY CLAUDE</div>
        </div>
        <p style={{ color: B.smoke, fontFamily: "'Space Mono'", fontSize: '0.72rem', marginBottom: 40, letterSpacing: '0.04em' }}>
          Pick your platform + vibe · Claude writes the caption · Copy and post instantly
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 20, marginBottom: 28 }}>
          {[
            { label: '01 · PLATFORM', items: PLATFORMS, val: platform, set: (v) => { setPlatform(v); setCaption('') }, color: '#A855F7', icon: true },
            { label: '02 · MOOD', items: MOODS, val: mood, set: (v) => { setMood(v); setCaption('') }, color: B.neonCyan },
            { label: '03 · YOUR TICKET', items: TIERS, val: tier, set: (v) => { setTier(v); setCaption('') }, color: B.amber },
          ].map(({ label, items, val, set, color, icon }) => (
            <div key={label}>
              <div style={{ fontFamily: "'Space Mono'", fontSize: 9, color: B.dim, letterSpacing: '0.2em', marginBottom: 10 }}>{label}</div>
              {items.map(item => (
                <button key={item.label} className="cg-btn" onClick={() => set(item.value)} style={{ display: 'block', width: '100%', textAlign: 'left', padding: '10px 14px', marginBottom: 6, background: val === item.value ? `${color}14` : '#0d0d0d', border: `1px solid ${val === item.value ? color : '#1a1a1a'}`, color: val === item.value ? color : B.smoke, fontFamily: "'Space Mono'", fontSize: 10, letterSpacing: '0.08em', cursor: 'pointer', transition: 'all 0.15s' }}>
                  {icon ? `${item.icon} ` : ''}{item.label}
                </button>
              ))}
            </div>
          ))}
        </div>

        <div style={{ marginBottom: 16 }}>
          <div style={{ fontFamily: "'Space Mono'", fontSize: 8, color: B.dim, letterSpacing: '0.2em', marginBottom: 8 }}>OPTIONAL · SHOE OR FIT</div>
          <input aria-label="Shoe or fit (optional)"
            value={shoe}
            onChange={e => { setShoe(e.target.value); setCaption('') }}
            placeholder="e.g. Air Jordan 4 'Military Blue' + Lagos designer set"
            style={{ width: '100%', background: '#0d0d0d', border: '1px solid #1a1a1a', color: B.white, padding: '11px 14px', fontFamily: "'Space Mono'", fontSize: 10, outline: 'none', letterSpacing: '0.02em' }}
          />
        </div>

        <button onClick={generate} disabled={!ready || loading} style={{ width: '100%', padding: '14px', background: ready && !loading ? B.amber : '#111', color: ready && !loading ? B.black : B.dim, border: 'none', fontFamily: "'Space Mono'", fontSize: 11, letterSpacing: '0.2em', fontWeight: 700, cursor: ready && !loading ? 'pointer' : 'default', marginBottom: 24, transition: 'all 0.2s' }}>
          {loading ? '⟳ WRITING YOUR CAPTION...' : ready ? 'GENERATE CAPTION →' : 'SELECT PLATFORM · MOOD · TIER'}
        </button>

        {error && <div style={{ background: '#1a0000', border: '1px solid #ff444422', padding: 12, marginBottom: 16, fontFamily: "'Space Mono'", fontSize: 10, color: '#ff6666' }}>{error}</div>}

        {caption && (
          <div style={{ animation: 'cgSlide 0.3s ease' }}>
            <div style={{ background: '#0a0a0a', border: `1px solid ${B.amber}22`, padding: '20px 24px', marginBottom: 14 }}>
              <div style={{ fontFamily: "'Space Mono'", fontSize: 8, color: B.dim, letterSpacing: '0.2em', marginBottom: 12 }}>
                {PLATFORMS.find(p => p.value === platform)?.icon} {platform} · {mood?.toUpperCase()} · {tier?.toUpperCase()}
              </div>
              <div style={{ fontFamily: "'Space Mono'", fontSize: 11, color: B.white, lineHeight: 1.9, whiteSpace: 'pre-wrap' }}>{caption}</div>
            </div>

            <div style={{ display: 'flex', gap: 10 }}>
              <button onClick={copy} style={{ flex: 1, padding: '12px', background: copied ? '#052e16' : B.amber, color: copied ? '#22c55e' : B.black, border: 'none', fontFamily: "'Space Mono'", fontSize: 10, letterSpacing: '0.15em', fontWeight: 700, cursor: 'pointer', transition: 'all 0.2s' }}>
                {copied ? '✓ COPIED' : 'COPY CAPTION →'}
              </button>
              <button onClick={generate} style={{ flex: 1, padding: '12px', background: 'transparent', border: `1px solid ${B.amber}44`, color: B.amber, fontFamily: "'Space Mono'", fontSize: 10, letterSpacing: '0.15em', fontWeight: 700, cursor: 'pointer' }}>
                REGENERATE ↺
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
