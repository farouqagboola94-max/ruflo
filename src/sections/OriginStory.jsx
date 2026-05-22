import { useRef, useEffect, useState } from 'react'
import { B } from '../tokens'
import { GrainOverlay, SectionTag } from '../components/Shared'

const CHAPTERS = [
  {
    id: 'void',
    label: 'THE VOID YEAR',
    year: '2024',
    color: B.neonCyan,
    headline: 'In 2024 I went quiet.',
    body: [
      'Not publicly quiet — I kept working, kept billing, kept my clients. But internally something had already collapsed. 2023 had been the fire. Betrayal, business failure, the kind of year where you stop trusting your own judgment because your judgment had gotten you into it.',
      'I spent 2024 in what I now call the Void. Not depression — I was too functional for that word. More like deliberate numbness. Antisocial by design. Watching how people work, how industries move, how culture gets manufactured and sold, from a removed position.',
      'I noticed things in the Void that you can\'t notice when you\'re inside the noise. One of those things was sneakers.',
    ],
  },
  {
    id: 'saw',
    label: 'WHAT I SAW',
    year: '2024–2025',
    color: B.amber,
    headline: 'Lagos has a sneaker problem.',
    body: [
      'Not a bad one. The good kind. The kind where the demand is violent and the infrastructure hasn\'t caught up.',
      'I watched someone pay twice resale for a pair of Jordans because the only alternative was waiting six more months for a restock that might not come to Nigeria at all. I watched a creative from Surulere drive to Lekki, wait three hours, and leave empty handed because the limited run was already gone.',
      'And there was no event. No dedicated space. No festival that said: this culture, specifically this culture, is what we\'re celebrating today. Nobody who had the event management skill, the brand sensibility, and the cultural fluency to do it right had built it yet.',
    ],
  },
  {
    id: 'fire',
    label: 'THE FIRE MADE THE METAL STRONGER',
    year: '2026',
    color: B.neonMagenta,
    headline: '2023 was my fire. 2024 was the tempering.',
    body: [
      'There\'s a metallurgy concept I keep coming back to. When you heat metal to the right temperature and then cool it correctly, you don\'t weaken it. You change its crystalline structure. The metal becomes harder, more resilient, better able to hold an edge. The process is called tempering.',
      '2026 is what comes out of the forge.',
      'I sat in the Void long enough to understand what I actually wanted to build. Not what looked impressive, not what other people thought I should be doing, not what made sense on paper. What I actually wanted. The thing that, if I were honest about it, I\'d been circling for years without committing to. A Lagos institution. Something with roots. Something that grew.',
    ],
  },
]

function Chapter({ c, i }) {
  const ref = useRef(null)
  const [vis, setVis] = useState(false)
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVis(true) }, { threshold: 0.15 })
    if (ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [])
  return (
    <div
      ref={ref}
      style={{
        display: 'flex', gap: 36, alignItems: 'flex-start', flexWrap: 'wrap',
        opacity: vis ? 1 : 0, transform: vis ? 'translateY(0)' : 'translateY(24px)',
        transition: `opacity 0.7s ${i * 0.15}s, transform 0.7s ${i * 0.15}s`,
      }}
    >
      {/* Timeline marker */}
      <div style={{ flexShrink: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', width: 48, paddingTop: 4 }}>
        <div style={{ width: 12, height: 12, borderRadius: '50%', background: c.color, boxShadow: `0 0 12px ${c.color}80`, flexShrink: 0 }} />
        <div style={{ width: 1, flex: 1, minHeight: 80, background: `linear-gradient(${c.color}40, transparent)`, marginTop: 8 }} />
      </div>
      {/* Content */}
      <div style={{ flex: '1 1 320px', paddingBottom: 52 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
          <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 7, color: c.color, letterSpacing: '0.3em' }}>{c.label}</div>
          <div style={{ padding: '2px 8px', background: c.color + '15', border: `1px solid ${c.color}30`, borderRadius: 20 }}>
            <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 6, color: c.color, letterSpacing: '0.2em' }}>{c.year}</span>
          </div>
        </div>
        <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 'clamp(24px, 3.5vw, 36px)', color: B.white, lineHeight: 1.05, marginBottom: 20 }}>
          {c.headline}
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {c.body.map((para, pi) => (
            <div key={pi} style={{ fontFamily: "'Syne', sans-serif", fontSize: 14, color: pi === 0 ? '#c8c5be' : B.smoke, lineHeight: 1.9 }}>
              {para}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default function OriginStory() {
  return (
    <section id="origin" style={{ position: 'relative', overflow: 'hidden', background: B.black, padding: '100px 24px' }}>
      <GrainOverlay />
      <div style={{ position: 'absolute', top: '20%', right: '-5%', width: 450, height: 450, background: `radial-gradient(ellipse, ${B.amber}07 0%, transparent 70%)`, filter: 'blur(90px)', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', bottom: '15%', left: '-5%', width: 350, height: 350, background: `radial-gradient(ellipse, ${B.neonCyan}06 0%, transparent 70%)`, filter: 'blur(80px)', pointerEvents: 'none' }} />

      <div style={{ position: 'relative', zIndex: 10, maxWidth: 1100, margin: '0 auto' }}>

        {/* Header */}
        <div style={{ maxWidth: 760, marginBottom: 72 }}>
          <SectionTag label="THE ORIGIN STORY" />
          <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 'clamp(48px, 8vw, 88px)', color: B.white, lineHeight: 0.88, marginBottom: 24 }}>
            WHY I'M BUILDING THE<br />
            <span style={{ color: B.amber }}>FESTIVAL LAGOS NEVER HAD</span>
          </div>
          <div style={{ width: 60, height: 2, background: `linear-gradient(90deg, ${B.amber}, transparent)`, marginBottom: 20 }} />

          {/* Pull quote */}
          <div style={{ borderLeft: `3px solid ${B.amber}`, paddingLeft: 24, marginBottom: 0 }}>
            <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 16, color: B.white, lineHeight: 1.8, fontStyle: 'italic' }}>
              "There's a specific feeling you get when you're holding a pair of sneakers you weren't supposed to have. Not stolen. I mean the ones that sold out in six minutes. You hold the box. You put them on the floor and look at them before you open them. There's a ritual to it. That ritual is what this is about."
            </div>
            <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 8, color: B.smoke, letterSpacing: '0.2em', marginTop: 12 }}>
              — OLUWATOBILOBA, THE CATALYST
            </div>
          </div>
        </div>

        {/* Timeline chapters */}
        <div style={{ paddingLeft: 0 }}>
          {CHAPTERS.map((c, i) => <Chapter key={c.id} c={c} i={i} />)}
        </div>

        {/* Why Sneakers */}
        <div style={{ padding: '44px 40px', background: 'rgba(255,255,255,0.03)', border: `1px solid ${B.gunmetal}`, borderRadius: 10, marginBottom: 28, position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg, ${B.amber}, ${B.neonLime}, transparent)` }} />
          <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 8, color: B.neonLime, letterSpacing: '0.3em', marginBottom: 16 }}>WHY SNEAKERS</div>
          <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 'clamp(28px, 4vw, 44px)', color: B.white, lineHeight: 1.05, marginBottom: 20 }}>SNEAKERS ARE HONEST.</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14, maxWidth: 700 }}>
            <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 14, color: '#c8c5be', lineHeight: 1.9 }}>
              You can tell everything about a person from their relationship to their footwear. How they carry their collection. Whether they're a daily wearer or a shelf collector. Whether they buy for resale or buy because something spoke to them.
            </div>
            <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 14, color: B.smoke, lineHeight: 1.9 }}>
              Sneakers are honest the way food is honest. The way music is honest. They tell you who someone actually is, not who they perform to be. And in Lagos, where everything is performance, sneakers are one of the few spaces where people are genuinely themselves.
            </div>
            <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 14, color: B.smoke, lineHeight: 1.9 }}>
              Where the guy from Ikeja and the guy from Ikoyi are having the same conversation, on the same level, because they both understand what it means to cop a pair that matters. That equalizing function. That's what I want to create space for.
            </div>
          </div>
        </div>

        {/* Lagos Deserves This */}
        <div style={{ padding: '44px 40px', background: `linear-gradient(135deg, ${B.amber}0d, ${B.neonMagenta}06)`, border: `1px solid ${B.amber}35`, borderRadius: 10, marginBottom: 28, position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg, ${B.amber}, ${B.neonMagenta}, transparent)` }} />
          <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 8, color: B.amber, letterSpacing: '0.3em', marginBottom: 16 }}>LAGOS DESERVES THIS</div>
          <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 'clamp(22px, 3.5vw, 36px)', color: B.white, lineHeight: 1.1, marginBottom: 20 }}>THIS ISN'T ABOUT ME.</div>
          <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 14, color: '#c8c5be', lineHeight: 1.9, maxWidth: 700, marginBottom: 24 }}>
            Lagos deserves a sneaker festival that reflects the actual cultural weight that sneaker culture carries in this city.
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 12, marginBottom: 24 }}>
            {[
              { who: 'The sneakerhead in Surulere', what: 'who tracks every drop but can\'t easily access them.' },
              { who: 'The young designer in Yaba', what: 'who wants to show their collab but has nowhere to debut it properly.' },
              { who: 'The collector in Lekki', what: 'who has built a serious archive but has never been in a room with others who understand what that means.' },
              { who: 'The content creator', what: 'who is documenting all of this and needs a flagship event to anchor their work around.' },
            ].map((p, i) => (
              <div key={i} style={{ padding: '16px 18px', background: `${B.amber}08`, border: `1px solid ${B.amber}20`, borderRadius: 6 }}>
                <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 9, color: B.amber, letterSpacing: '0.1em', marginBottom: 6 }}>{p.who}</div>
                <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 12, color: B.smoke, lineHeight: 1.7 }}>{p.what}</div>
              </div>
            ))}
          </div>
          <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 15, color: B.white, lineHeight: 1.8, fontStyle: 'italic' }}>
            These people exist. Their culture is real. It deserves a real home. Sneakers Fest is that home.
          </div>
        </div>

        {/* Closing forge line */}
        <div style={{ textAlign: 'center', padding: '52px 24px 0' }}>
          <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 'clamp(28px, 5vw, 56px)', color: B.white, lineHeight: 1.1, marginBottom: 16 }}>
            THE FIRE HAPPENED.<br />
            THE TEMPERING IS DONE.<br />
            <span style={{ color: B.amber }}>THE METAL IS READY.</span>
          </div>
          <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 8, color: B.smoke, letterSpacing: '0.25em', marginBottom: 32 }}>DECEMBER 12, 2026 · EKO ATLANTIC, LAGOS</div>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <a href="#fnp" style={{ padding: '12px 28px', background: B.amber, color: B.black, fontFamily: "'Space Mono', monospace", fontSize: 9, fontWeight: 700, letterSpacing: '0.18em', textDecoration: 'none', borderRadius: 4 }}>JOIN THE COMMUNITY →</a>
            <a href="https://substack.com/@catalyst00555" target="_blank" rel="noopener noreferrer" style={{ padding: '12px 24px', border: `1px solid #FF671950`, color: '#FF6719', fontFamily: "'Space Mono', monospace", fontSize: 9, letterSpacing: '0.18em', textDecoration: 'none', borderRadius: 4 }}>READ ON SUBSTACK →</a>
          </div>
          <div style={{ marginTop: 28, fontFamily: "'Space Mono', monospace", fontSize: 8, color: B.smoke, letterSpacing: '0.2em' }}>
            OLUWATOBILOBA — THE CATALYST · CATALYST CONCEPTS · LAGOS
          </div>
        </div>

      </div>
    </section>
  )
}
