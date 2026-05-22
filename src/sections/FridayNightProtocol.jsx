import { useState } from 'react'
import { B } from '../tokens'
import { GrainOverlay, ScanLines, SectionTag } from '../components/Shared'

const WEEKS = [
  {
    week: 'WEEK 1',
    name: 'THE DROP DISCUSSION',
    color: B.amber,
    desc: 'A recent or upcoming sneaker drop goes up for debate. The community votes, reacts, and delivers a verdict: cop or pass.',
    platforms: ['Instagram', 'Twitter/X', 'WhatsApp'],
    revenue: 'Engagement unlocks early access info and exclusive festival content.',
    output: 'Community verdict graphic · published Saturday',
  },
  {
    week: 'WEEK 2',
    name: 'THE CHALLENGE',
    color: B.neonCyan,
    desc: 'Sneaker challenge of the week. Best recent cop, most creative lace swap, oldest pair in your rotation, worst resale decision ever made.',
    platforms: ['Instagram', 'TikTok', 'Reels'],
    revenue: '₦500–₦1,000 paid entry for prize pool weeks. Free with sponsor-funded prize.',
    output: 'Submission roundup · winner announced Sunday',
  },
  {
    week: 'WEEK 3',
    name: 'THE CONVERSATION',
    color: B.neonMagenta,
    desc: 'A real topic from Lagos sneaker culture. Who set the culture here. Why certain brands dominate. The ethics of resale. The import hustle.',
    platforms: ['Twitter Space', 'Instagram Live'],
    revenue: '₦1,000 guaranteed question slot for paid listeners.',
    output: 'Audio clip highlights · quote graphics · Substack writeup',
  },
  {
    week: 'WEEK 4',
    name: 'THE GAME',
    color: B.neonLime,
    desc: 'Sneaker trivia. Rapid-fire. Knowledge test. Themed rounds: Air Max history, Nigerian streetwear brands, collab guessing.',
    platforms: ['Twitter/X', 'Telegram'],
    revenue: '₦1,000–₦2,000 paid entry with cash or exclusive access prize.',
    output: 'Leaderboard post · winner highlight',
  },
]

export default function FridayNightProtocol() {
  const [active, setActive] = useState(0)
  const w = WEEKS[active]

  return (
    <section id="fnp" style={{
      background: B.black,
      padding: '80px 20px',
      position: 'relative',
      overflow: 'hidden',
    }}>
      <GrainOverlay /><ScanLines />

      {/* Ambient */}
      <div style={{
        position: 'absolute', bottom: -100, left: '50%', transform: 'translateX(-50%)',
        width: 600, height: 400, borderRadius: '50%',
        background: `radial-gradient(ellipse, ${B.amber}12 0%, transparent 70%)`,
        filter: 'blur(60px)', pointerEvents: 'none',
      }} />

      <div style={{ maxWidth: 960, margin: '0 auto', position: 'relative', zIndex: 2 }}>
        <SectionTag color={B.amber}>COMMUNITY ENGINE</SectionTag>
        <h2 style={{
          fontFamily: "'Bebas Neue'",
          fontSize: 'clamp(2.5rem,7vw,5rem)',
          color: B.white, letterSpacing: '0.04em', marginBottom: 8,
        }}>
          THE FRIDAY NIGHT PROTOCOL
        </h2>
        <p style={{ color: B.smoke, fontFamily: "'Space Mono'", fontSize: '0.78rem', marginBottom: 12, maxWidth: 560, lineHeight: 1.7 }}>
          Every Friday night, the Sneakers Fest community activates. Content goes out. Conversations start. Games run. Drops get announced. Culture gets discussed.
        </p>
        <p style={{ color: B.amber, fontFamily: "'Space Mono'", fontSize: '0.68rem', letterSpacing: '0.1em', marginBottom: 48 }}>
          It’s a ritual. Most Lagos events run for a day and go dark. FNP is why Sneakers Fest doesn’t.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32 }}>

          {/* Week selector */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {WEEKS.map((wk, i) => (
              <button
                key={i}
                onClick={() => setActive(i)}
                style={{
                  textAlign: 'left', padding: '16px 20px',
                  background: active === i ? `${wk.color}12` : B.charcoal,
                  border: `1px solid ${active === i ? wk.color : B.gunmetal}`,
                  borderLeft: `3px solid ${active === i ? wk.color : B.gunmetal}`,
                  borderRadius: 6, cursor: 'pointer', transition: 'all 0.2s',
                }}
              >
                <div style={{
                  fontFamily: "'Space Mono'", fontSize: '0.58rem',
                  letterSpacing: '0.2em',
                  color: active === i ? wk.color : B.smoke,
                  marginBottom: 4,
                }}>{wk.week}</div>
                <div style={{
                  fontFamily: "'Bebas Neue'", fontSize: '1.1rem',
                  letterSpacing: '0.06em',
                  color: active === i ? B.white : B.smoke,
                  transition: 'color 0.2s',
                }}>{wk.name}</div>
              </button>
            ))}
          </div>

          {/* Detail panel */}
          <div style={{
            background: B.charcoal, borderRadius: 10,
            padding: '28px 28px',
            border: `1px solid ${B.gunmetal}`,
            borderTop: `3px solid ${w.color}`,
          }}>
            <div style={{
              fontFamily: "'Space Mono'", fontSize: '0.58rem',
              letterSpacing: '0.2em', color: w.color, marginBottom: 6,
            }}>{w.week} · MONTHLY ROTATION</div>
            <h3 style={{
              fontFamily: "'Bebas Neue'", fontSize: '1.6rem',
              color: B.white, letterSpacing: '0.04em', marginBottom: 16,
            }}>{w.name}</h3>

            <p style={{
              color: B.smoke, fontFamily: "'Syne'",
              fontSize: '0.88rem', lineHeight: 1.75, marginBottom: 20,
            }}>{w.desc}</p>

            <div style={{ marginBottom: 16 }}>
              <div style={{ fontFamily: "'Space Mono'", fontSize: '0.58rem', letterSpacing: '0.2em', color: B.smoke, marginBottom: 8 }}>PLATFORMS</div>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {w.platforms.map(p => (
                  <span key={p} style={{
                    background: `${w.color}12`, border: `1px solid ${w.color}40`,
                    borderRadius: 20, padding: '3px 10px',
                    fontFamily: "'Space Mono'", fontSize: '0.6rem', color: w.color,
                  }}>{p}</span>
                ))}
              </div>
            </div>

            <div style={{
              background: B.black, borderRadius: 6,
              padding: '12px 14px', marginBottom: 16,
              borderLeft: `2px solid ${w.color}`,
            }}>
              <div style={{ fontFamily: "'Space Mono'", fontSize: '0.58rem', letterSpacing: '0.15em', color: B.smoke, marginBottom: 4 }}>REVENUE HOOK</div>
              <div style={{ fontFamily: "'Syne'", fontSize: '0.8rem', color: B.white }}>{w.revenue}</div>
            </div>

            <div style={{ fontFamily: "'Space Mono'", fontSize: '0.6rem', color: B.smoke }}>
              <span style={{ color: w.color, marginRight: 6 }}>&#x25BA;</span>{w.output}
            </div>
          </div>
        </div>

        {/* Revenue model */}
        <div style={{ marginTop: 48, padding: '28px 28px', background: B.charcoal, borderRadius: 10, border: `1px solid ${B.gunmetal}` }}>
          <div style={{ fontFamily: "'Space Mono'", fontSize: '0.62rem', letterSpacing: '0.25em', color: B.amber, marginBottom: 20 }}>THE MATH</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 20 }}>
            {[
              { label: 'Per participant, per paid session', value: '₦500–₦2,000' },
              { label: 'Target participants by Month 3',    value: '50+' },
              { label: 'Pre-event participation revenue',  value: '₦1M+' },
              { label: 'Sessions per year',                 value: '52 Fridays' },
            ].map((m, i) => (
              <div key={i}>
                <div style={{ fontFamily: "'Orbitron'", fontSize: i < 2 ? '1.4rem' : '1.1rem', color: B.amberGlow, fontWeight: 700 }}>{m.value}</div>
                <div style={{ fontFamily: "'Space Mono'", fontSize: '0.62rem', color: B.smoke, marginTop: 4, lineHeight: 1.5 }}>{m.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div style={{ marginTop: 36, display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
          <a
            href="https://chat.whatsapp.com/YOUR_WHATSAPP_GROUP_LINK"
            target="_blank" rel="noopener noreferrer"
            style={{
              display: 'inline-block', background: '#25D366', color: B.black,
              padding: '12px 32px', fontFamily: "'Bebas Neue'",
              fontSize: '1.1rem', letterSpacing: '0.1em',
              textDecoration: 'none', borderRadius: 4,
              boxShadow: '0 0 20px rgba(37,211,102,0.4)',
            }}
          >
            JOIN ON WHATSAPP
          </a>
          <p style={{ color: B.smoke, fontFamily: "'Space Mono'", fontSize: '0.65rem' }}>
            Every Friday · Lagos timezone · Free to follow, paid to compete
          </p>
        </div>
      </div>
    </section>
  )
}
