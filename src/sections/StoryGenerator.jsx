import { useState } from 'react'
import { B } from '../tokens'
import { GrainOverlay, ScanLines, SectionTag } from '../components/Shared'
import { claudeChat, useAiAvailable } from '../lib/catalystAI'
import AIComingSoon from '../components/AIComingSoon'

const VIBES = [
  { label: 'NOSTALGIC', value: 'nostalgic — bittersweet, takes you back, time-capsule feeling' },
  { label: 'HYPE', value: 'hype — electric, the day was everything, pure adrenaline' },
  { label: 'LOVE STORY', value: 'love story — these shoes matter deeply, almost sentimental' },
  { label: 'GRIND', value: 'grind — these shoes represent work, sacrifice, earned not given' },
]

const EXAMPLES = [
  { shoe: 'Air Jordan 1 Bred 2013', memory: 'I saved three months of allowance to cop these. The day they arrived I wore them to school and nobody could tell me anything.' },
  { shoe: 'Adidas Yeezy 350 Cream', memory: 'Lost the raffle five times. Finally won on my birthday. My mum thought I was crying about something bad.' },
  { shoe: 'Nike Air Max 95 Neon', memory: 'My uncle brought a pair from London when I was 9. I would just stare at them on the shelf. They were a size too big and I wore them anyway.' },
]

const SYSTEM = `You are a Lagos sneaker storyteller. Write a cinematic, emotionally resonant 3-paragraph story about someone's connection to a specific pair of sneakers.

The story must:
- Be written in second person ("you") — make it feel personal and immersive
- Have a Lagos flavour — specific cultural references, Lagos street energy, local context where relevant
- Feel like premium longform content — vivid, specific, not generic
- Match the emotional vibe requested
- End on a line that would make someone stop scrolling

Write ONLY the story. Three paragraphs. No title, no intro, no label. Just the story.`

export default function StoryGenerator() {
  const aiReady = useAiAvailable()
  const [shoe, setShoe] = useState('')
  const [memory, setMemory] = useState('')
  const [vibe, setVibe] = useState(null)
  const [loading, setLoading] = useState(false)
  const [story, setStory] = useState('')
  const [error, setError] = useState('')
  const [copied, setCopied] = useState(false)

  function loadExample(ex) {
    setShoe(ex.shoe)
    setMemory(ex.memory)
    setStory('')
  }

  async function generate() {
    if (!shoe.trim() || !memory.trim()) return
    if (!aiReady) {
      setError('Story Generator is not live yet. It will be ready before December 12.')
      return
    }
    setLoading(true)
    setStory('')
    setError('')
    setCopied(false)
    try {
      const vibeContext = vibe ? `\nEmotional vibe: ${vibe}` : ''
      const prompt = `Shoe: ${shoe}\nMy memory: ${memory}${vibeContext}\n\nWrite my sneaker story.`
      const raw = await claudeChat([{ role: 'user', content: prompt }], { feature: 'StoryGenerator', model: 'balanced', system: SYSTEM, maxTokens: 500 })
      setStory(raw.trim())
    } catch (e) {
      setError(e.message || 'Something went wrong.')
    } finally {
      setLoading(false)
    }
  }

  function copy() {
    if (!story) return
    navigator.clipboard.writeText(story).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2200)
    })
  }

  const ready = shoe.trim() && memory.trim()

  return (
    <section id="story-gen" style={{ background: '#060606', padding: '80px 20px', position: 'relative', overflow: 'hidden' }}>
      <GrainOverlay />
      <ScanLines />
      <style>{`@keyframes sgSlide { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:translateY(0)} }`}</style>

      <div style={{ maxWidth: 720, margin: '0 auto' }}>
        <SectionTag>SNEAKER STORIES</SectionTag>
        {!aiReady && <AIComingSoon feature="Sneaker Stories" />}
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12, marginBottom: 8 }}>
          <h2 style={{ fontFamily: "'Bebas Neue'", fontSize: 'clamp(2rem,5vw,3.5rem)', color: B.white, letterSpacing: '0.05em', margin: 0 }}>
            STORY GENERATOR
          </h2>
          <div style={{ fontFamily: "'Space Mono'", fontSize: 9, color: B.dim, letterSpacing: '0.15em' }}>POWERED BY CLAUDE</div>
        </div>
        <p style={{ color: B.smoke, fontFamily: "'Space Mono'", fontSize: '0.72rem', marginBottom: 36, letterSpacing: '0.04em' }}>
          A shoe + a memory · Claude writes the cinematic Lagos story · Ready to post
        </p>

        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 16, alignItems: 'center' }}>
          <span style={{ fontFamily: "'Space Mono'", fontSize: 8, color: B.dim, letterSpacing: '0.1em' }}>EXAMPLES →</span>
          {EXAMPLES.map((ex, i) => (
            <button key={i} onClick={() => loadExample(ex)} style={{ background: '#0d0d0d', border: '1px solid #1a1a1a', color: B.dim, fontFamily: "'Space Mono'", fontSize: 8, padding: '5px 12px', cursor: 'pointer' }}>
              EX {i + 1}
            </button>
          ))}
        </div>

        <div style={{ marginBottom: 14 }}>
          <div style={{ fontFamily: "'Space Mono'", fontSize: 8, color: B.dim, letterSpacing: '0.2em', marginBottom: 8 }}>THE SHOE</div>
          <input aria-label="The shoe"
            value={shoe}
            onChange={e => { setShoe(e.target.value); setStory('') }}
            placeholder="e.g. Air Jordan 1 Bred 2013, Yeezy 700 Wave Runner, Nike Cortez 'Forrest Gump'"
            style={{ width: '100%', background: '#0d0d0d', border: '1px solid #1a1a1a', color: B.white, padding: '12px 14px', fontFamily: "'Space Mono'", fontSize: 11, outline: 'none', marginBottom: 2 }}
          />
        </div>

        <div style={{ marginBottom: 18 }}>
          <div style={{ fontFamily: "'Space Mono'", fontSize: 8, color: B.dim, letterSpacing: '0.2em', marginBottom: 8 }}>THE MEMORY</div>
          <textarea aria-label="The memory"
            value={memory}
            onChange={e => { setMemory(e.target.value); setStory('') }}
            placeholder="Tell Claude the moment — when you got them, what happened, what they mean to you. The more real, the better the story."
            rows={4}
            style={{ width: '100%', background: '#0d0d0d', border: '1px solid #1a1a1a', color: B.white, padding: '12px 14px', fontFamily: "'Space Mono'", fontSize: 11, lineHeight: 1.7, resize: 'vertical', outline: 'none' }}
          />
        </div>

        <div style={{ marginBottom: 20 }}>
          <div style={{ fontFamily: "'Space Mono'", fontSize: 8, color: B.dim, letterSpacing: '0.2em', marginBottom: 10 }}>VIBE (OPTIONAL)</div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {VIBES.map(v => (
              <button key={v.label} onClick={() => { setVibe(vibe === v.value ? null : v.value); setStory('') }} style={{ padding: '7px 14px', background: vibe === v.value ? `${B.neonCyan}14` : '#0d0d0d', border: `1px solid ${vibe === v.value ? B.neonCyan : '#1a1a1a'}`, color: vibe === v.value ? B.neonCyan : B.dim, fontFamily: "'Space Mono'", fontSize: 8, letterSpacing: '0.1em', cursor: 'pointer', transition: 'all 0.15s' }}>
                {v.label}
              </button>
            ))}
          </div>
        </div>

        <button onClick={generate} disabled={!ready || loading} style={{ width: '100%', padding: '14px', background: ready && !loading ? B.amber : '#111', color: ready && !loading ? B.black : B.dim, border: 'none', fontFamily: "'Space Mono'", fontSize: 11, letterSpacing: '0.2em', fontWeight: 700, cursor: ready && !loading ? 'pointer' : 'default', marginBottom: 24, transition: 'all 0.2s' }}>
          {loading ? '⟳ WRITING YOUR STORY...' : 'WRITE MY STORY →'}
        </button>

        {error && <div style={{ background: '#1a0000', border: '1px solid #ff444422', padding: 12, marginBottom: 16, fontFamily: "'Space Mono'", fontSize: 10, color: '#ff6666' }}>{error}</div>}

        {story && (
          <div style={{ animation: 'sgSlide 0.35s ease' }}>
            <div style={{ background: '#0a0a0a', border: `1px solid ${B.amber}22`, padding: '24px 28px', marginBottom: 14 }}>
              <div style={{ fontFamily: "'Space Mono'", fontSize: 8, color: B.dim, letterSpacing: '0.2em', marginBottom: 18 }}>
                {shoe.toUpperCase()} · YOUR STORY
              </div>
              <div style={{ fontFamily: "'Space Mono'", fontSize: 11, color: B.white, lineHeight: 2.1, whiteSpace: 'pre-wrap' }}>{story}</div>
            </div>

            <div style={{ display: 'flex', gap: 10 }}>
              <button onClick={copy} style={{ flex: 1, padding: '12px', background: copied ? '#052e16' : B.amber, color: copied ? '#22c55e' : B.black, border: 'none', fontFamily: "'Space Mono'", fontSize: 10, letterSpacing: '0.15em', fontWeight: 700, cursor: 'pointer', transition: 'all 0.2s' }}>
                {copied ? '✓ COPIED' : 'COPY STORY →'}
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
