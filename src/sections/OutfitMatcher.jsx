import { useState } from 'react'
import { B } from '../tokens'
import { GrainOverlay, ScanLines, SectionTag } from '../components/Shared'
import { addXP, hasBadge, XP_VALUES } from '../lib/passport'
import Egg from '../components/Egg'

const API = import.meta.env.VITE_BACKEND_URL || ''

const VIBES   = ['Streetwear', 'Smart Casual', 'Date Night', 'Festival', 'Gym']
const COLORS  = ['Black', 'White', 'Amber-Neutral', 'Bold-Neon']
const BUDGETS = ['Budget', 'Mid-Range', 'Splurge']

const CATALOG = [
  { id: 1,  shoe: 'Air Jordan 1 Chicago',        vibe: 'Streetwear',   color: 'Bold-Neon',     budget: 'Splurge',   outfit: ['Oversized graphic tee', 'Straight-leg denim', 'Bomber jacket', 'Bucket hat'], reason: 'Chicago colorway pops loudest against neutral streetwear pieces — let the shoe lead.' },
  { id: 2,  shoe: 'Nike Dunk Low Panda',          vibe: 'Smart Casual', color: 'Black',         budget: 'Mid-Range', outfit: ['Crew-neck sweater', 'Tapered chinos', 'Half-zip overshirt', 'Leather belt'], reason: 'Panda colorway is the ultimate neutral anchor for smart casual fits.' },
  { id: 3,  shoe: 'Adidas Samba',                 vibe: 'Smart Casual', color: 'White',         budget: 'Budget',    outfit: ['Linen shirt', 'Cropped trousers', 'Light cardigan', 'Crew socks'], reason: 'Sambas are built for understated, put-together looks on any budget.' },
  { id: 4,  shoe: 'Yeezy 350 Zebra',              vibe: 'Streetwear',   color: 'Bold-Neon',     budget: 'Splurge',   outfit: ['Oversized hoodie', 'Cargo joggers', 'Puffer vest', 'Beanie'], reason: 'High-contrast Zebra pattern wants room to breathe — keep the fit loose.' },
  { id: 5,  shoe: 'New Balance 550 White/Green',  vibe: 'Date Night',   color: 'White',         budget: 'Mid-Range', outfit: ['Knit polo', 'Pleated trousers', 'Suede jacket', 'Minimal watch'], reason: 'Retro silhouette dresses up easily for a relaxed date-night look.' },
  { id: 6,  shoe: 'Nike Air Max 97',              vibe: 'Festival',     color: 'Bold-Neon',     budget: 'Mid-Range', outfit: ['Tie-dye tee', 'Utility shorts', 'Fanny pack', 'Tinted sunglasses'], reason: 'Reflective panels catch the light — perfect for festival energy.' },
  { id: 7,  shoe: 'Adidas Ultraboost',            vibe: 'Gym',          color: 'Black',         budget: 'Mid-Range', outfit: ['Compression tee', 'Training shorts', 'Performance jacket', 'Crew socks'], reason: 'Boost cushioning is built for movement — pair with performance fabrics.' },
  { id: 8,  shoe: 'Converse Chuck 70',            vibe: 'Date Night',   color: 'Black',         budget: 'Budget',    outfit: ['Fitted black tee', 'Dark wash jeans', 'Leather jacket', 'Thin chain necklace'], reason: 'A timeless silhouette that always reads intentional, never try-hard.' },
  { id: 9,  shoe: 'Nike Air Force 1',             vibe: 'Streetwear',   color: 'White',         budget: 'Budget',    outfit: ['Plain white tee', 'Relaxed denim', 'Varsity jacket', 'Crossbody bag'], reason: 'The cleanest canvas in sneakers — works with almost anything.' },
  { id: 10, shoe: 'Salomon XT-6',                 vibe: 'Festival',     color: 'Amber-Neutral', budget: 'Splurge',   outfit: ['Technical vest', 'Cargo pants', 'Windbreaker', 'Trail cap'], reason: 'Gorpcore silhouette matches the outdoorsy, layered festival aesthetic.' },
]

function localMatch({ vibe, color, budget }) {
  const scored = CATALOG.map(item => {
    let score = 0
    if (item.vibe === vibe) score += 6
    if (item.color === color) score += 3
    if (item.budget === budget) score += 2
    return { ...item, score }
  })
  return scored.sort((a, b) => b.score - a.score).slice(0, 3)
}

export default function OutfitMatcher() {
  const [vibe, setVibe] = useState(VIBES[0])
  const [color, setColor] = useState(COLORS[0])
  const [budget, setBudget] = useState(BUDGETS[1])
  const [results, setResults] = useState(null)
  const [loading, setLoading] = useState(false)

  async function match() {
    setLoading(true)
    let matches = null
    if (API) {
      try {
        const res = await fetch(`${API}/api/outfit-match`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ vibe, color, budget }),
        })
        if (res.ok) {
          const data = await res.json()
          if (Array.isArray(data?.matches)) matches = data.matches
        }
      } catch { /* fall through to local */ }
    }
    if (!matches) matches = localMatch({ vibe, color, budget })
    setResults(matches)
    setLoading(false)
    if (!hasBadge('outfit-match')) addXP(XP_VALUES.quickTask, 'Outfit Matcher', 'outfit-match')
  }

  return (
    <section id="outfit" style={{ background: B.charcoal, padding: '80px 20px', position: 'relative', overflow: 'hidden' }}>
      <GrainOverlay /><ScanLines />
      <Egg id="egg-045" corner="top-right" />
      <Egg id="egg-046" corner="bottom-left" />
      <div style={{ maxWidth: 760, margin: '0 auto' }}>
        <SectionTag color={B.neonCyan}>AI OUTFIT MATCHER</SectionTag>
        <h2 style={{ fontFamily: "'Bebas Neue'", fontSize: 'clamp(2.5rem,6vw,4rem)', color: B.white, letterSpacing: '0.05em', marginBottom: 8 }}>
          BUILD THE FIT AROUND THE SHOE
        </h2>
        <p style={{ color: B.smoke, fontFamily: "'Space Mono'", fontSize: '0.78rem', marginBottom: 40 }}>
          Pick your vibe, color lane, and budget — get matched sneaker + outfit combos.
        </p>

        {[['VIBE', VIBES, vibe, setVibe], ['COLOR LANE', COLORS, color, setColor], ['BUDGET', BUDGETS, budget, setBudget]].map(([label, opts, val, setter]) => (
          <div key={label} style={{ marginBottom: 24 }}>
            <div style={{ fontFamily: "'Space Mono'", fontSize: '0.6rem', letterSpacing: '0.2em', color: '#555', marginBottom: 10 }}>{label}</div>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {opts.map(o => {
                const active = val === o
                return (
                  <button key={o} onClick={() => setter(o)} style={{
                    padding: '9px 18px', borderRadius: 20,
                    background: active ? B.neonCyan : 'transparent',
                    color: active ? B.black : B.smoke,
                    border: `1px solid ${active ? B.neonCyan : B.gunmetal}`,
                    fontFamily: "'Space Mono'", fontSize: '0.72rem', cursor: 'pointer', transition: 'all 0.2s',
                  }}>{o}</button>
                )
              })}
            </div>
          </div>
        ))}

        <button
          onClick={match}
          disabled={loading}
          style={{
            background: loading ? B.gunmetal : B.neonCyan, color: B.black, border: 'none',
            padding: '14px 40px', fontFamily: "'Bebas Neue'", fontSize: '1.3rem', letterSpacing: '0.1em',
            cursor: loading ? 'default' : 'pointer', borderRadius: 4, marginBottom: 32,
            boxShadow: loading ? 'none' : `0 0 24px ${B.neonCyan}50`,
          }}
        >
          {loading ? 'MATCHING...' : 'GET MY MATCH'}
        </button>

        {results && (
          <div style={{ display: 'grid', gap: 16 }}>
            {results.map((r, i) => (
              <div key={r.id} style={{
                background: B.void, border: `1px solid ${i === 0 ? B.neonCyan + '60' : B.gunmetal}`,
                borderRadius: 10, padding: '20px 24px', position: 'relative',
              }}>
                {i === 0 && (
                  <div style={{
                    position: 'absolute', top: -10, left: 20, background: B.neonCyan, color: B.black,
                    fontFamily: "'Orbitron'", fontSize: '0.55rem', fontWeight: 700, letterSpacing: '0.15em',
                    padding: '3px 10px', borderRadius: 4,
                  }}>BEST MATCH</div>
                )}
                <div style={{ fontFamily: "'Bebas Neue'", fontSize: '1.4rem', color: B.white, marginTop: i === 0 ? 6 : 0, marginBottom: 8 }}>{r.shoe}</div>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 12 }}>
                  {r.outfit.map(piece => (
                    <span key={piece} style={{
                      fontFamily: "'Space Mono'", fontSize: '0.65rem', color: B.smoke,
                      background: B.charcoal, border: `1px solid ${B.gunmetal}`, borderRadius: 14, padding: '4px 12px',
                    }}>{piece}</span>
                  ))}
                </div>
                <p style={{ fontFamily: "'Syne'", fontSize: '0.78rem', color: B.smoke, lineHeight: 1.6 }}>{r.reason}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
