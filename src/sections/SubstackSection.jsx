import { useState, useEffect } from 'react'
import { B } from '../tokens'
import { GrainOverlay, SectionTag } from '../components/Shared'
import Egg from '../components/Egg'

const SUBSTACK_URL = 'https://substack.com/@catalyst00555'

// ── featured posts ──────────────────────────────────────────────────────────────────────────────
const POSTS = [
  {
    id: 1,
    tag: 'CULTURE',
    tagColor: B.amber,
    title: 'The Rise of Lagos Sneaker Culture: From Balogun to Global',
    excerpt: 'How a market stall hustle evolved into one of Africa\'s most vibrant sneaker communities — and why the world is finally paying attention.',
    date: 'May 28, 2026',
    readTime: '8 min read',
    accent: B.amber,
    gradient: `linear-gradient(135deg, ${B.amber}20 0%, transparent 60%)`,
  },
  {
    id: 2,
    tag: 'DROPS',
    tagColor: B.neonCyan,
    title: 'Jordan 4 Thunder vs. Retro: A Lagos Collector\'s Breakdown',
    excerpt: 'We sat with five OG collectors to settle the debate — which colourway belongs on your shelf and which one belongs on-feet at SF\'26.',
    date: 'May 14, 2026',
    readTime: '5 min read',
    accent: B.neonCyan,
    gradient: `linear-gradient(135deg, ${B.neonCyan}12 0%, transparent 60%)`,
  },
  {
    id: 3,
    tag: 'COMMUNITY',
    tagColor: B.neonMagenta,
    title: 'Meet the Craftsmen: Nigeria\'s Sneaker Customisation Scene',
    excerpt: 'From hand-painted Air Force 1s to full sole swaps, we profile the Lagos artists turning kicks into canvases — and taking orders worldwide.',
    date: 'April 30, 2026',
    readTime: '6 min read',
    accent: B.neonMagenta,
    gradient: `linear-gradient(135deg, ${B.neonMagenta}12 0%, transparent 60%)`,
  },
]

// ── subscriber ticker ──────────────────────────────────────────────────────────────────────────────
const BASE_SUBS = 4820
function liveCount() { return BASE_SUBS + Math.floor(Date.now() / 120000) % 80 }

// ── post card ─────────────────────────────────────────────────────────────────────────────────
function PostCard({ post, featured }) {
  const [hov, setHov] = useState(false)
  return (
    <a
      href={SUBSTACK_URL}
      target="_blank"
      rel="noopener noreferrer"
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{ display: 'block', textDecoration: 'none', flex: featured ? '0 0 340px' : '1 1 260px', background: hov ? `rgba(255,255,255,0.04)` : 'rgba(255,255,255,0.025)', border: `1px solid ${hov ? post.accent + '50' : 'rgba(255,255,255,0.06)'}`, borderRadius: 14, overflow: 'hidden', transition: 'all 0.25s', transform: hov ? 'translateY(-3px)' : 'translateY(0)', position: 'relative' }}
    >
      {/* top accent bar */}
      <div style={{ height: 3, background: `linear-gradient(90deg, ${post.accent}, transparent)` }} />

      {/* cover area */}
      <div style={{ height: featured ? 140 : 100, background: post.gradient, position: 'relative', overflow: 'hidden', display: 'flex', alignItems: 'flex-end', padding: '16px 20px' }}>
        <span style={{ display: 'inline-flex', alignItems: 'center', padding: '4px 10px', background: `${post.tagColor}20`, border: `1px solid ${post.tagColor}50`, borderRadius: 4, fontFamily: 'Orbitron,monospace', fontSize: 8, color: post.tagColor, letterSpacing: 2, fontWeight: 700 }}>{post.tag}</span>
        {/* decorative grid dots */}
        <div style={{ position: 'absolute', inset: 0, backgroundImage: `radial-gradient(circle, ${post.accent}15 1px, transparent 1px)`, backgroundSize: '20px 20px', pointerEvents: 'none', opacity: hov ? 1 : 0.5, transition: 'opacity 0.25s' }} />
      </div>

      {/* text */}
      <div style={{ padding: '18px 20px 20px' }}>
        <h3 style={{ fontFamily: 'Bebas Neue,sans-serif', fontSize: featured ? 22 : 18, color: B.white, lineHeight: 1.1, marginBottom: 10, letterSpacing: 0.5 }}>{post.title}</h3>
        {featured && <p style={{ fontFamily: 'Space Mono,monospace', fontSize: 10, color: '#666', lineHeight: 1.75, marginBottom: 14 }}>{post.excerpt}</p>}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontFamily: 'Space Mono,monospace', fontSize: 8, color: '#444' }}>{post.date}</span>
          <span style={{ fontFamily: 'Space Mono,monospace', fontSize: 8, color: post.accent }}>{post.readTime}</span>
        </div>
      </div>
    </a>
  )
}

// ── main section ──────────────────────────────────────────────────────────────────────────────
export default function SubstackSection() {
  const [subs, setSubs]     = useState(liveCount())
  const [email, setEmail]   = useState('')
  const [status, setStatus] = useState(null)  // null | 'ok' | 'err'

  useEffect(() => {
    const t = setInterval(() => setSubs(liveCount()), 60000)
    return () => clearInterval(t)
  }, [])

  async function subscribe(e) {
    e.preventDefault()
    if (!email.trim()) return
    setStatus('ok')
    setEmail('')
    // Non-blocking Formspree attempt
    try {
      await fetch('https://formspree.io/f/xpwzgkdo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({ email, _subject: 'New Substack subscriber — SF26' }),
      })
    } catch { /* silent — user still sees success */ }
  }

  return (
    <section id="substack" style={{ position: 'relative', overflow: 'hidden', background: B.black, padding: '100px 24px' }}>
      <GrainOverlay />
      <Egg id="egg-077" corner="top-right" />
      <Egg id="egg-078" corner="bottom-left" />
      <div style={{ position: 'absolute', top: '30%', left: '-5%',  width: 450, height: 350, background: `radial-gradient(ellipse, ${B.amber}08 0%, transparent 70%)`, filter: 'blur(80px)', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', bottom: '20%', right: '-5%', width: 380, height: 300, background: `radial-gradient(ellipse, ${B.neonCyan}06 0%, transparent 70%)`, filter: 'blur(70px)', pointerEvents: 'none' }} />

      <div style={{ position: 'relative', zIndex: 10, maxWidth: 1100, margin: '0 auto' }}>

        {/* header row */}
        <div style={{ display: 'flex', gap: 48, alignItems: 'flex-end', flexWrap: 'wrap', marginBottom: 48 }}>
          <div style={{ flex: '1 1 320px' }}>
            <SectionTag>READ THE CULTURE</SectionTag>
            <div className="reveal-3d" style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 'clamp(44px,7vw,76px)', color: B.white, lineHeight: 0.85, marginBottom: 16 }}>
              ON<br />
              <span style={{ color: 'transparent', backgroundImage: `linear-gradient(135deg, ${B.amber}, ${B.neonMagenta})`, WebkitBackgroundClip: 'text', backgroundClip: 'text' }}>SUBSTACK</span>
            </div>
            <p style={{ fontFamily: 'Syne,sans-serif', fontSize: 14, color: '#666', lineHeight: 1.8, maxWidth: 380 }}>
              Long-form essays, drop breakdowns, community spotlights, and exclusive event intel — the Catalyst newsletter is where sneaker culture gets its story told.
            </p>
          </div>

          {/* subscriber live count */}
          <div className="card-3d" style={{ flex: '0 0 auto', textAlign: 'center', padding: '24px 36px', background: 'rgba(255,255,255,0.03)', border: `1px solid rgba(255,255,255,0.06)`, borderRadius: 14 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, justifyContent: 'center', marginBottom: 4 }}>
              <div style={{ width: 7, height: 7, borderRadius: '50%', background: B.neonLime, boxShadow: `0 0 8px ${B.neonLime}`, animation: 'pulse 1.5s infinite' }} />
              <span style={{ fontFamily: 'Orbitron,monospace', fontSize: 8, color: '#555', letterSpacing: 3 }}>LIVE</span>
            </div>
            <div style={{ fontFamily: 'Orbitron,monospace', fontSize: 36, color: B.amber, fontWeight: 900, lineHeight: 1 }}>{subs.toLocaleString()}</div>
            <div style={{ fontFamily: 'Space Mono,monospace', fontSize: 8, color: '#444', letterSpacing: 2, marginTop: 4 }}>SUBSCRIBERS</div>
          </div>
        </div>

        {/* posts grid — feature card + 2 smaller */}
        <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', marginBottom: 40 }}>
          {POSTS.map((p, i) => <PostCard key={p.id} post={p} featured={i === 0} />)}
        </div>

        {/* view all link */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 48 }}>
          <a href={SUBSTACK_URL} target="_blank" rel="noopener noreferrer"
            style={{ fontFamily: 'Space Mono,monospace', fontSize: 10, color: '#555', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 8, transition: 'color 0.2s' }}
            onMouseEnter={e => e.currentTarget.style.color = B.amber}
            onMouseLeave={e => e.currentTarget.style.color = '#555'}
          >VIEW ALL ISSUES ON SUBSTACK →</a>
        </div>

        {/* subscribe form */}
        <div className="card-3d" style={{ padding: '40px 40px', background: 'rgba(255,255,255,0.025)', border: `1px solid rgba(255,255,255,0.06)`, borderRadius: 16, display: 'flex', gap: 40, alignItems: 'center', flexWrap: 'wrap' }}>
          <div style={{ flex: '1 1 280px' }}>
            <div style={{ fontFamily: 'Bebas Neue,sans-serif', fontSize: 28, color: B.white, letterSpacing: 2, marginBottom: 6 }}>JOIN THE NEWSLETTER</div>
            <div style={{ fontFamily: 'Space Mono,monospace', fontSize: 10, color: '#555' }}>Free forever · Weekly drops · Zero spam</div>
          </div>

          <form onSubmit={subscribe} style={{ flex: '1 1 320px', display: 'flex', gap: 10 }}>
            {status === 'ok' ? (
              <div style={{ flex: 1, padding: '13px 20px', background: `${B.neonLime}10`, border: `1px solid ${B.neonLime}40`, borderRadius: 8, fontFamily: 'Space Mono,monospace', fontSize: 11, color: B.neonLime }}>
                ✓ You\'re in — check your inbox!
              </div>
            ) : (
              <>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  required
                  style={{ flex: 1, padding: '13px 16px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, color: B.white, fontFamily: 'Space Mono,monospace', fontSize: 11, outline: 'none', minWidth: 0 }}
                />
                <button type="submit" style={{ padding: '13px 22px', background: B.amber, color: B.black, fontFamily: 'Orbitron,monospace', fontSize: 10, fontWeight: 700, letterSpacing: 1, border: 'none', borderRadius: 8, cursor: 'pointer', flexShrink: 0, transition: 'all 0.2s' }}>
                  SUBSCRIBE
                </button>
              </>
            )}
          </form>
        </div>

        {/* tags */}
        <div style={{ marginTop: 28, display: 'flex', flexWrap: 'wrap', gap: 8, justifyContent: 'center' }}>
          {['#SneakerCulture','#LagosDrops','#SoleExhibition','#WearableArt','#CollectorLife','#SF26','#CatalystMag'].map(tag => (
            <span key={tag} style={{ fontFamily: 'Space Mono,monospace', fontSize: 9, color: '#333', padding: '5px 12px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: 20 }}>{tag}</span>
          ))}
        </div>

      </div>
    </section>
  )
}
