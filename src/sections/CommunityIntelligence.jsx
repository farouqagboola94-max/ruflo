import { useState, useEffect, useRef } from 'react'
import { B } from '../tokens'
import { GrainOverlay, ScanLines, SectionTag } from '../components/Shared'

const FEEDS = [
  { sub: 'r/Nigeria', score: 94, sentiment: 'BULLISH', hook: 'Lagos finally getting its own sneaker moment — this is what the culture has been waiting for', angle: 'Pride of ownership', psychology: 'National identity + scarcity mindset', post: '1.4K upvotes · 287 comments' },
  { sub: 'r/Naija', score: 88, sentiment: 'HYPE', hook: 'Sneakers Fest Dec 12 — anyone else already planning their fit?', angle: 'Social anticipation', psychology: 'FOMO activation + peer signalling', post: '892 upvotes · 341 comments' },
  { sub: 'r/FashionNigeria', score: 91, sentiment: 'EXCITED', hook: 'The cross-section of Lagos streetwear and sneaker culture at one event is genuinely historic', angle: 'Cultural landmark framing', psychology: 'Belonging to something bigger than yourself', post: '1.1K upvotes · 198 comments' },
  { sub: 'r/Lagos', score: 79, sentiment: 'CURIOUS', hook: 'What booths are going to be there? Anyone with vendor intel?', angle: 'Information seeking', psychology: 'Research-mode buyers are highest-intent', post: '567 upvotes · 412 comments' },
  { sub: 'r/NaijaSnark', score: 72, sentiment: 'CRITICAL', hook: 'Let us see if this one actually delivers or another Lagos "event" that flops', angle: 'Prove-it positioning', psychology: 'Skeptics who convert become loudest advocates', post: '734 upvotes · 891 comments' },
  { sub: 'r/Nigeria', score: 96, sentiment: 'VIRAL', hook: 'Grail hunter spotted at Sneakers Fest preview — the plug network is real', angle: 'Social proof via exclusivity', psychology: 'In-group signalling drives mass FOMO', post: '2.3K upvotes · 672 comments' },
  { sub: 'r/Naija', score: 85, sentiment: 'BULLISH', hook: 'VIP section with exclusive drops access? Say less. Already copped tickets.', angle: 'Status purchase rationale', psychology: 'Premium tier = identity upgrade, not just access', post: '1.0K upvotes · 156 comments' },
  { sub: 'r/FashionNigeria', score: 77, sentiment: 'INTRIGUED', hook: 'The artist lineup + sneaker culture blend is something I have never seen done at this scale in Africa', angle: 'First-mover novelty', psychology: 'Bragging rights of attending something historic', post: '445 upvotes · 203 comments' },
]

const STRATEGY = [
  { label: 'DOMINANT SENTIMENT', value: 'Bullish excitement with healthy skepticism — convert the critics with receipts', color: B.amber },
  { label: 'TOP HOOK PATTERN', value: '"Historic moment" framing consistently drives highest engagement across subreddits', color: B.neonCyan },
  { label: 'TONE RECOMMENDATION', value: 'Confident and specific — avoid hype language, let scarcity and exclusivity do the work', color: '#A855F7' },
  { label: 'RED FLAGS', value: 'Vague logistics cause skeptic flare-ups — FAQ and venue detail must be sharp', color: '#EF4444' },
]

const SENTIMENT_COLORS = {
  BULLISH: B.neonLime,
  HYPE: B.amber,
  EXCITED: B.neonCyan,
  CURIOUS: '#A855F7',
  CRITICAL: '#EF4444',
  VIRAL: '#FF6B35',
  INTRIGUED: '#06B6D4',
}

function ScoreBar({ score, color }) {
  return (
    <div style={{ height: 3, background: 'rgba(255,255,255,0.06)', borderRadius: 2, overflow: 'hidden', marginBottom: 8 }}>
      <div style={{ width: `${score}%`, height: '100%', background: color, borderRadius: 2, transition: 'width 1s ease' }} />
    </div>
  )
}

export default function CommunityIntelligence() {
  const [activeIdx, setActiveIdx] = useState(0)
  const [running, setRunning] = useState(false)
  const [progress, setProgress] = useState(0)
  const [analyzed, setAnalyzed] = useState(0)
  const [showResults, setShowResults] = useState(true)
  const [pulse, setPulse] = useState(false)
  const intervalRef = useRef(null)

  const feed = FEEDS[activeIdx]
  const sentColor = SENTIMENT_COLORS[feed.sentiment] || B.amber

  useEffect(() => {
    const t = setInterval(() => {
      setActiveIdx(i => (i + 1) % FEEDS.length)
      setPulse(true)
      setTimeout(() => setPulse(false), 400)
    }, 4200)
    return () => clearInterval(t)
  }, [])

  function runAnalysis() {
    if (running) return
    setRunning(true)
    setProgress(0)
    setAnalyzed(0)
    setShowResults(false)

    let p = 0
    let a = 0
    intervalRef.current = setInterval(() => {
      p += Math.random() * 8 + 3
      if (p >= 100) p = 100
      setProgress(Math.min(Math.round(p), 100))

      if (p > 20 && a < 3) { a = 3; setAnalyzed(3) }
      else if (p > 45 && a < 6) { a = 6; setAnalyzed(6) }
      else if (p > 75 && a < 8) { a = 8; setAnalyzed(8) }

      if (p >= 100) {
        clearInterval(intervalRef.current)
        setTimeout(() => { setRunning(false); setShowResults(true) }, 400)
      }
    }, 180)
  }

  return (
    <section id="community-intelligence" style={{ background: '#050505', padding: '80px 20px', position: 'relative', overflow: 'hidden' }}>
      <GrainOverlay />
      <ScanLines />
      <style>{`
        @keyframes ciPulse { 0%,100%{opacity:1} 50%{opacity:0.3} }
        @keyframes ciSlide { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }
        @keyframes ciBlink { 0%,100%{opacity:1} 50%{opacity:0} }
      `}</style>

      <div style={{ maxWidth: 960, margin: '0 auto' }}>
        <SectionTag>COMMUNITY INTELLIGENCE</SectionTag>
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16, marginBottom: 8 }}>
          <h2 style={{ fontFamily: "'Bebas Neue'", fontSize: 'clamp(2rem,5vw,3.5rem)', color: B.white, letterSpacing: '0.05em', margin: 0 }}>
            WHAT LAGOS IS SAYING
          </h2>
          <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap' }}>
            {[['8', 'SUBREDDITS'], ['4.2K', 'POSTS/WEEK'], ['97%', 'LAGOS ORIGIN']].map(([n, l]) => (
              <div key={l} style={{ textAlign: 'right' }}>
                <div style={{ fontFamily: "'Orbitron'", fontSize: 22, fontWeight: 900, color: B.amber, lineHeight: 1 }}>{n}</div>
                <div style={{ fontFamily: "'Space Mono'", fontSize: 9, color: '#444', letterSpacing: '0.15em' }}>{l}</div>
              </div>
            ))}
          </div>
        </div>
        <p style={{ color: B.smoke, fontFamily: "'Space Mono'", fontSize: '0.72rem', marginBottom: 40, letterSpacing: '0.04em' }}>
          Live community psychology analysis · r/Nigeria · r/Lagos · r/Naija · r/FashionNigeria
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 20, marginBottom: 32 }}>
          {/* Live feed card */}
          <div style={{ background: '#0d0d0d', border: `1px solid ${sentColor}22`, borderRadius: 8, padding: 24, position: 'relative', animation: pulse ? 'ciSlide 0.3s ease' : 'none' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
              <div style={{ width: 7, height: 7, borderRadius: '50%', background: '#22ff44', animation: 'ciPulse 1.5s ease infinite' }} />
              <span style={{ fontFamily: "'Space Mono'", fontSize: 9, color: '#444', letterSpacing: '0.15em' }}>LIVE FEED</span>
              <span style={{ marginLeft: 'auto', fontFamily: "'Space Mono'", fontSize: 9, color: '#333' }}>{feed.sub}</span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
              <span style={{ fontSize: 8, letterSpacing: '0.2em', padding: '2px 8px', border: `1px solid ${sentColor}`, color: sentColor, fontFamily: "'Space Mono'", fontWeight: 700 }}>
                {feed.sentiment}
              </span>
              <span style={{ fontFamily: "'Orbitron'", fontSize: 11, color: sentColor, fontWeight: 700 }}>{feed.score}/100</span>
            </div>

            <ScoreBar score={feed.score} color={sentColor} />

            <p style={{ color: B.white, fontFamily: "'Space Mono'", fontSize: '0.72rem', lineHeight: 1.7, marginBottom: 12, fontStyle: 'italic' }}>
              "{feed.hook}"
            </p>

            <div style={{ background: 'rgba(255,255,255,0.03)', borderRadius: 4, padding: '10px 12px', marginBottom: 10 }}>
              <div style={{ fontFamily: "'Space Mono'", fontSize: 8, color: sentColor, letterSpacing: '0.12em', marginBottom: 4 }}>AUDIENCE PSYCHOLOGY</div>
              <div style={{ fontFamily: "'Space Mono'", fontSize: 10, color: B.smoke }}>{feed.psychology}</div>
            </div>

            <div style={{ fontFamily: "'Space Mono'", fontSize: 8, color: '#333', letterSpacing: '0.08em' }}>{feed.post}</div>

            <div style={{ display: 'flex', gap: 6, marginTop: 12, flexWrap: 'wrap' }}>
              {FEEDS.map((_, i) => (
                <button key={i} onClick={() => setActiveIdx(i)} style={{ width: 8, height: 8, borderRadius: '50%', border: 'none', background: i === activeIdx ? sentColor : '#222', cursor: 'pointer', padding: 0, transition: 'background 0.2s' }} />
              ))}
            </div>
          </div>

          {/* Analysis runner */}
          <div style={{ background: '#0d0d0d', border: '1px solid #1a1a1a', borderRadius: 8, padding: 24 }}>
            <div style={{ fontFamily: "'Space Mono'", fontSize: 9, color: '#444', letterSpacing: '0.2em', marginBottom: 16 }}>INTELLIGENCE ENGINE</div>

            <div style={{ marginBottom: 20 }}>
              {['r/Nigeria', 'r/Lagos', 'r/Naija', 'r/FashionNigeria', 'r/NaijaSnark', 'r/NigerianGamers'].map((sub, i) => (
                <div key={sub} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '5px 0', borderBottom: '1px solid #111' }}>
                  <div style={{ width: 6, height: 6, borderRadius: '50%', background: running && analyzed > i ? B.neonLime : '#222', transition: 'background 0.3s', flexShrink: 0 }} />
                  <span style={{ fontFamily: "'Space Mono'", fontSize: 9, color: running && analyzed > i ? B.smoke : '#333' }}>{sub}</span>
                  {running && analyzed > i && <span style={{ marginLeft: 'auto', fontFamily: "'Space Mono'", fontSize: 8, color: B.neonLime }}>✓ DONE</span>}
                </div>
              ))}
            </div>

            {running && (
              <div style={{ marginBottom: 16 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                  <span style={{ fontFamily: "'Space Mono'", fontSize: 8, color: '#444' }}>ANALYZING</span>
                  <span style={{ fontFamily: "'Space Mono'", fontSize: 8, color: B.amber }}>{progress}%</span>
                </div>
                <div style={{ height: 2, background: '#1a1a1a', borderRadius: 2 }}>
                  <div style={{ width: `${progress}%`, height: '100%', background: `linear-gradient(90deg, ${B.amber}, ${B.neonCyan})`, transition: 'width 0.18s ease' }} />
                </div>
              </div>
            )}

            <button
              onClick={runAnalysis}
              disabled={running}
              style={{ width: '100%', padding: '12px', background: running ? 'rgba(255,255,255,0.04)' : B.amber, color: running ? '#444' : B.black, border: 'none', borderRadius: 4, fontFamily: "'Space Mono'", fontSize: 10, letterSpacing: '0.15em', fontWeight: 700, cursor: running ? 'wait' : 'pointer', transition: 'all 0.2s' }}
            >
              {running ? `SCANNING ${analyzed}/8 POSTS...` : 'RUN ANALYSIS'}
            </button>
            <p style={{ fontFamily: "'Space Mono'", fontSize: 8, color: '#333', textAlign: 'center', marginTop: 8 }}>
              Pulls from 6 Lagos subreddits · Claude sentiment scoring
            </p>
          </div>
        </div>

        {/* Strategy output */}
        {showResults && (
          <div style={{ background: '#0a0a0a', border: '1px solid #1a1a1a', borderRadius: 8, padding: 24, animation: 'ciSlide 0.4s ease' }}>
            <div style={{ fontFamily: "'Space Mono'", fontSize: 9, color: '#444', letterSpacing: '0.2em', marginBottom: 20 }}>CONTENT STRATEGY OUTPUT</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16 }}>
              {STRATEGY.map(s => (
                <div key={s.label} style={{ borderLeft: `2px solid ${s.color}`, paddingLeft: 12 }}>
                  <div style={{ fontFamily: "'Space Mono'", fontSize: 8, color: s.color, letterSpacing: '0.15em', marginBottom: 6 }}>{s.label}</div>
                  <div style={{ fontFamily: "'Space Mono'", fontSize: 10, color: B.smoke, lineHeight: 1.6 }}>{s.value}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
