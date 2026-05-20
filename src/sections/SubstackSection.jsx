import { B } from '../tokens'
import { GrainOverlay, SectionTag } from '../components/Shared'

const SUBSTACK_URL = 'https://substack.com/@catalyst00555'

const PILLARS = [
  { icon: '👟', label: 'SNEAKER CULTURE', desc: 'Deep dives on drops, collabs, and the stories behind the silhouettes.', color: B.amber },
  { icon: '🏢', label: 'EVENT COVERAGE', desc: 'Behind-the-scenes from Sneakers Fest and the global sneaker circuit.', color: B.neonCyan },
  { icon: '🌍', label: 'COMMUNITY STORIES', desc: 'Real people. Real collections. The human side of sneaker culture.', color: B.neonMagenta },
  { icon: '💬', label: 'EXCLUSIVE DROPS', desc: 'First-access intel on limited releases before they hit the feeds.', color: B.neonLime },
]

export default function SubstackSection() {
  return (
    <section id="substack" style={{ position: 'relative', overflow: 'hidden', background: B.black, padding: '100px 24px' }}>
      <GrainOverlay />

      {/* Ambient glows */}
      <div style={{ position: 'absolute', top: '40%', left: '-5%', width: 400, height: 300, background: `radial-gradient(ellipse, ${B.amber}09 0%, transparent 70%)`, filter: 'blur(70px)', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', bottom: '30%', right: '-5%', width: 350, height: 250, background: `radial-gradient(ellipse, ${B.neonCyan}07 0%, transparent 70%)`, filter: 'blur(70px)', pointerEvents: 'none' }} />

      <div style={{ position: 'relative', zIndex: 10, maxWidth: 1100, margin: '0 auto' }}>

        {/* Two-col layout */}
        <div style={{ display: 'flex', gap: 80, alignItems: 'center', flexWrap: 'wrap' }}>

          {/* Left */}
          <div style={{ flex: '1 1 380px' }}>
            <SectionTag>READ THE CULTURE</SectionTag>
            <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 'clamp(44px, 7vw, 76px)', color: B.white, lineHeight: 0.85, marginBottom: 20 }}>
              ON<br />
              <span style={{
                color: 'transparent',
                backgroundImage: `linear-gradient(135deg, ${B.amber}, ${B.neonMagenta})`,
                WebkitBackgroundClip: 'text',
                backgroundClip: 'text',
              }}>SUBSTACK</span>
            </div>
            <div style={{ width: 60, height: 2, background: `linear-gradient(90deg, ${B.amber}, transparent)`, marginBottom: 20 }} />
            <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 15, color: B.smoke, lineHeight: 1.8, marginBottom: 28 }}>
              The Catalyst newsletter is where sneaker culture meets storytelling. Long-form essays, exclusive event coverage, community spotlights, and drop intel — delivered straight to your inbox.
            </div>
            <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 9, color: B.neonCyan, letterSpacing: '0.25em', marginBottom: 28 }}>@CATALYST00555 ON SUBSTACK</div>

            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              <a
                href={SUBSTACK_URL}
                target="_blank"
                rel="noopener noreferrer"
                style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '14px 30px', background: B.amber, color: B.black, fontFamily: "'Space Mono', monospace", fontSize: 10, fontWeight: 700, letterSpacing: '0.18em', textDecoration: 'none', borderRadius: 4, boxShadow: `0 0 30px ${B.amber}25`, transition: 'all 0.2s' }}
                onMouseEnter={e => e.currentTarget.style.boxShadow = `0 0 50px ${B.amber}45`}
                onMouseLeave={e => e.currentTarget.style.boxShadow = `0 0 30px ${B.amber}25`}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M22 6H2v2h20V6zm0 4H2v2h20v-2zm0 4H2v8l10-4 10 4v-8z" fill="currentColor"/></svg>
                SUBSCRIBE FREE
              </a>
              <a
                href={SUBSTACK_URL}
                target="_blank"
                rel="noopener noreferrer"
                style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '14px 24px', background: 'transparent', color: B.smoke, fontFamily: "'Space Mono', monospace", fontSize: 10, letterSpacing: '0.15em', textDecoration: 'none', borderRadius: 4, border: `1px solid ${B.gunmetal}`, transition: 'all 0.2s' }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = B.amber + '60'; e.currentTarget.style.color = B.amber }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = B.gunmetal; e.currentTarget.style.color = B.smoke }}
              >READ ARCHIVES →</a>
            </div>
          </div>

          {/* Right — pillar cards */}
          <div style={{ flex: '1 1 340px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            {PILLARS.map((p, i) => (
              <div
                key={i}
                style={{ padding: '20px 18px', background: 'rgba(255,255,255,0.04)', backdropFilter: 'blur(20px)', border: `1px solid rgba(255,255,255,0.07)`, borderRadius: 10, position: 'relative', overflow: 'hidden', transition: 'all 0.3s' }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = p.color + '50'; e.currentTarget.style.background = `${p.color}0a`; e.currentTarget.style.transform = 'translateY(-2px)' }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)'; e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; e.currentTarget.style.transform = 'translateY(0)' }}
              >
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg, ${p.color}60, transparent)` }} />
                <div style={{ fontSize: 22, marginBottom: 10 }}>{p.icon}</div>
                <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 8, color: p.color, letterSpacing: '0.12em', marginBottom: 6 }}>{p.label}</div>
                <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 11, color: B.smoke, lineHeight: 1.6 }}>{p.desc}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Social proof bar */}
        <div style={{ marginTop: 52, padding: '18px 28px', background: 'rgba(255,255,255,0.03)', border: `1px solid rgba(255,255,255,0.06)`, borderRadius: 10, display: 'flex', gap: 40, flexWrap: 'wrap', alignItems: 'center', justifyContent: 'center' }}>
          {[
            { n: 'FREE', l: 'SUBSCRIPTION' },
            { n: 'WEEKLY', l: 'DROPS' },
            { n: '0', l: 'SPAM EVER' },
            { n: 'EXCLUSIVE', l: 'READER ACCESS' },
          ].map((s, i) => (
            <div key={i} style={{ textAlign: 'center' }}>
              <div style={{ fontFamily: "'Orbitron', monospace", fontWeight: 900, fontSize: 16, color: B.amber, lineHeight: 1 }}>{s.n}</div>
              <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 7, color: B.smoke, letterSpacing: '0.2em', marginTop: 4 }}>{s.l}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
