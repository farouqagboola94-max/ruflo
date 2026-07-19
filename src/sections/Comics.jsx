import { B } from '../tokens'
import { GrainOverlay, SectionTag } from '../components/Shared'
import Egg from '../components/Egg'

const ISSUES = [
  {
    num: '002',
    title: 'THE DROP',
    sub: 'When the streets get heat',
    desc: 'A limited release. A city on edge. Everyone wants the same pair — and only one person can have them.',
    tag: 'AVAILABLE NOW',
    color: B.neonMagenta,
    img: '/comics/issue-02-drop.png',
  },
  {
    num: '003',
    title: 'GRAIL HUNTERS',
    sub: 'The hunt begins',
    desc: 'Across three continents and six markets, a crew chases the rarest pair ever made. Some obsessions are worth it.',
    tag: 'AVAILABLE NOW',
    color: B.neonCyan,
    img: '/comics/issue-03-grail.png',
  },
  {
    num: '004',
    title: 'CATALYST',
    sub: 'The next chapter',
    desc: 'The universe expands. New characters. New cities. The culture shifts — and nothing will ever be the same.',
    tag: 'COMING SOON',
    color: B.neonLime,
    img: '/comics/issue-04-catalyst.png',
    upcoming: true,
  },
]

const VESSELS = [
  {
    name: 'THE ORACLE',
    subtitle: 'VESSEL OF SIGHT',
    desc: 'She sees the lines between Lagos past and future — the convergence point of all sneaker mythology. Her visions don\'t come in sleep. They come in drops.',
    img: '/comics/oracle.png',
    color: B.amber,
  },
  {
    name: 'THE CATALYST',
    subtitle: 'VESSEL OF CHANGE',
    desc: 'The one who walks between worlds. Every limited drop, every cobblestone grail hunt — he triggers the shift. Lagos chose him before he chose Lagos.',
    img: '/comics/the-catalyst-portrait.png',
    color: B.neonCyan,
  },
]

export default function Comics() {
  return (
    <section id="comics" style={{ position: 'relative', overflow: 'hidden', background: B.black, padding: '100px 24px' }}>
      <GrainOverlay />

      {/* Section atmosphere — Futuristic Lagos graphic novel art at low opacity */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        backgroundImage: 'url(/comics/futuristic-lagos.png)',
        backgroundSize: 'cover', backgroundPosition: 'center top',
        opacity: 0.07, filter: 'saturate(0.3)',
      }} />

      <Egg id="egg-067" corner="top-right" />
      <Egg id="egg-068" corner="bottom-left" />

      <div style={{ position: 'absolute', top: '10%', left: '-10%', width: '120%', height: 2, background: `linear-gradient(90deg, transparent, ${B.amber}20, ${B.neonMagenta}15, transparent)`, transform: 'rotate(-3deg)', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', bottom: '15%', left: '-10%', width: '120%', height: 1, background: `linear-gradient(90deg, transparent, ${B.neonCyan}15, transparent)`, transform: 'rotate(2deg)', pointerEvents: 'none' }} />

      <div style={{ position: 'relative', zIndex: 10, maxWidth: 1100, margin: '0 auto' }}>

        {/* ── Header ── */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: 24, marginBottom: 60 }}>
          <div>
            <SectionTag>CATALYST UNIVERSE</SectionTag>
            <div className="reveal-3d text-3d" style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 'clamp(44px, 7vw, 80px)', color: B.white, lineHeight: 0.85, letterSpacing: '0.02em' }}>
              THE<br />
              <span style={{ color: B.amber, textShadow: `0 0 40px ${B.amber}40` }}>COMICS</span>
            </div>
            <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 9, color: B.smoke, letterSpacing: '0.35em', marginTop: 10 }}>
              SNEAKER CULTURE · STREET MYTHOLOGY · LAGOS NOIR
            </div>
          </div>
          <a
            href="https://catalyst-awakening.netlify.app/"
            target="_blank" rel="noopener noreferrer"
            style={{ display: 'inline-flex', alignItems: 'center', gap: 10, padding: '12px 24px', background: `rgba(245,166,35,0.1)`, border: `1px solid ${B.amber}50`, borderRadius: 4, textDecoration: 'none', fontFamily: "'Space Mono', monospace", fontSize: 9, color: B.amber, letterSpacing: '0.15em', transition: 'all 0.25s' }}
            onMouseEnter={e => { e.currentTarget.style.background = `rgba(245,166,35,0.2)`; e.currentTarget.style.borderColor = B.amber }}
            onMouseLeave={e => { e.currentTarget.style.background = `rgba(245,166,35,0.1)`; e.currentTarget.style.borderColor = `${B.amber}50` }}
          >
            READ ALL ISSUES →
          </a>
        </div>

        {/* ── FEATURED: Catalyst — The Awakening (Issue #001 official cover) ── */}
        <div className="reveal-3d" style={{ marginBottom: 52, borderRadius: 16, overflow: 'hidden', border: `1px solid ${B.amber}40`, position: 'relative', background: B.charcoal, boxShadow: `0 0 80px ${B.amber}12, 0 32px 64px rgba(0,0,0,0.6)` }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', minHeight: 400 }}>

            {/* Video cover — left panel */}
            <div style={{ flex: '0 0 auto', width: 'clamp(240px, 40%, 400px)', position: 'relative', overflow: 'hidden', background: B.black }}>
              <video
                autoPlay muted loop playsInline
                src="/comics/catalyst-awakening.mp4"
                style={{ width: '100%', height: '100%', minHeight: 360, objectFit: 'cover', display: 'block' }}
              />
              <div style={{ position: 'absolute', top: 16, left: 16 }}>
                <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 8, color: B.black, background: B.amber, padding: '4px 10px', borderRadius: 2, letterSpacing: '0.15em', fontWeight: 700 }}>ISSUE #001</span>
              </div>
              <div style={{ position: 'absolute', top: 16, right: 16 }}>
                <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 7, color: B.amber, background: `${B.amber}18`, border: `1px solid ${B.amber}50`, padding: '3px 8px', borderRadius: 2, letterSpacing: '0.1em' }}>OFFICIAL COVER</span>
              </div>
              {/* Seamless blend into info panel */}
              <div style={{ position: 'absolute', top: 0, right: 0, bottom: 0, width: 60, background: `linear-gradient(90deg, transparent, ${B.charcoal})` }} />
            </div>

            {/* Info panel — right */}
            <div style={{ flex: '1 1 300px', padding: '48px 40px', display: 'flex', flexDirection: 'column', justifyContent: 'center', position: 'relative', background: `linear-gradient(135deg, ${B.charcoal}, ${B.black})` }}>
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: `linear-gradient(90deg, ${B.amber}, ${B.amber}60, transparent)` }} />
              <div style={{ position: 'absolute', top: 0, left: 0, bottom: 0, width: 1, background: `linear-gradient(180deg, ${B.amber}50, transparent)` }} />

              <div style={{ fontFamily: "'Orbitron', monospace", fontSize: '0.6rem', color: B.amber, letterSpacing: '0.3em', marginBottom: 16 }}>
                FIRST ISSUE · ORIGIN STORY
              </div>
              <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 'clamp(34px, 5vw, 60px)', color: B.white, lineHeight: 0.88, letterSpacing: '0.02em' }}>
                CATALYST:
              </div>
              <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 'clamp(34px, 5vw, 60px)', color: B.amber, lineHeight: 0.88, letterSpacing: '0.02em', marginBottom: 20, textShadow: `0 0 40px ${B.amber}50` }}>
                THE AWAKENING
              </div>
              <div style={{ width: 48, height: 2, background: `linear-gradient(90deg, ${B.amber}, transparent)`, marginBottom: 20 }} />
              <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 14, color: B.smoke, lineHeight: 1.8, marginBottom: 24, maxWidth: 440 }}>
                Lagos, 2026. A city where every sneaker drop carries an ancient signal. One collector begins to hear the frequency — and realizes the culture was never just about the kicks.
              </div>
              <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 8, color: B.smoke, letterSpacing: '0.2em', marginBottom: 32, lineHeight: 1.9 }}>
                COLLECTOR CULTURE · ANCIENT ECHOES · STREET MYTHOLOGY
              </div>
              <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                <a
                  href="https://catalyst-awakening.netlify.app/"
                  target="_blank" rel="noopener noreferrer"
                  style={{ display: 'inline-block', padding: '13px 28px', background: B.amber, color: B.black, fontFamily: "'Space Mono', monospace", fontSize: 9, fontWeight: 700, letterSpacing: '0.2em', textDecoration: 'none', borderRadius: 3, boxShadow: `0 0 24px ${B.amber}40` }}
                >
                  READ ISSUE #001 →
                </a>
                <a
                  href="https://catalyst-awakening.netlify.app/"
                  target="_blank" rel="noopener noreferrer"
                  style={{ display: 'inline-block', padding: '13px 28px', border: `1px solid ${B.amber}50`, color: B.amber, fontFamily: "'Space Mono', monospace", fontSize: 9, letterSpacing: '0.2em', textDecoration: 'none', borderRadius: 3 }}
                >
                  ALL ISSUES
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* ── Issues Grid: 002 – 004 ── */}
        <div style={{ marginBottom: 72 }}>
          <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 8, color: B.smoke, letterSpacing: '0.4em', marginBottom: 20 }}>MORE FROM THE UNIVERSE</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 18 }}>
            {ISSUES.map((issue, i) => (
              <a
                key={i}
                href="https://catalyst-awakening.netlify.app/"
                target="_blank" rel="noopener noreferrer"
                className="card-3d"
                style={{ textDecoration: 'none', display: 'block', borderRadius: 12, overflow: 'hidden', border: `1px solid ${issue.upcoming ? issue.color + '25' : issue.color + '35'}`, background: B.charcoal, transition: 'border-color 0.3s, box-shadow 0.3s', position: 'relative' }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = issue.color + '80'; e.currentTarget.style.boxShadow = `0 16px 48px rgba(0,0,0,0.5), 0 0 0 1px ${issue.color}20` }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = issue.upcoming ? issue.color + '25' : issue.color + '35'; e.currentTarget.style.boxShadow = 'none' }}
              >
                {/* Image cover */}
                <div style={{ height: 220, position: 'relative', overflow: 'hidden', background: B.black }}>
                  <img
                    src={issue.img}
                    alt={issue.title}
                    style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                  />
                  <div style={{ position: 'absolute', inset: 0, background: `linear-gradient(to top, ${B.charcoal} 0%, transparent 60%)` }} />
                  <div style={{ position: 'absolute', top: 12, left: 14 }}>
                    <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 7, color: issue.color, padding: '3px 8px', background: issue.color + '18', border: `1px solid ${issue.color}50`, borderRadius: 2, letterSpacing: '0.15em' }}>ISSUE #{issue.num}</span>
                  </div>
                  <div style={{ position: 'absolute', top: 12, right: 14 }}>
                    <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 7, color: issue.upcoming ? issue.color : B.black, padding: '3px 8px', background: issue.upcoming ? issue.color + '15' : issue.color, borderRadius: 2, border: `1px solid ${issue.color}${issue.upcoming ? '40' : ''}`, letterSpacing: '0.1em' }}>{issue.tag}</span>
                  </div>
                  <div style={{ position: 'absolute', bottom: 14, left: 14, right: 14 }}>
                    <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 26, color: B.white, lineHeight: 0.9, letterSpacing: '0.04em', textShadow: '0 2px 12px rgba(0,0,0,0.95)' }}>{issue.title}</div>
                  </div>
                </div>
                {/* Info */}
                <div style={{ padding: '16px 18px 20px' }}>
                  <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 8, color: issue.color, letterSpacing: '0.15em', marginBottom: 6 }}>{issue.sub.toUpperCase()}</div>
                  <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 12, color: B.smoke, lineHeight: 1.65, marginBottom: 14 }}>{issue.desc}</div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 9, color: issue.upcoming ? '#333' : issue.color }}>
                      {issue.upcoming ? 'COMING SOON' : 'READ NOW →'}
                    </span>
                    {!issue.upcoming && (
                      <div style={{ width: 24, height: 24, borderRadius: '50%', border: `1.5px solid ${issue.color}50`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <span style={{ color: issue.color, fontSize: 10 }}>→</span>
                      </div>
                    )}
                  </div>
                </div>
              </a>
            ))}
          </div>
        </div>

        {/* ── Vessels of Ancient Powers ── */}
        <div style={{ marginBottom: 64, padding: '60px 0', position: 'relative', borderTop: `1px solid ${B.gunmetal}`, borderBottom: `1px solid ${B.gunmetal}` }}>
          {/* Character art as section atmosphere */}
          <div style={{
            position: 'absolute', inset: 0, pointerEvents: 'none',
            backgroundImage: 'url(/comics/the-catalyst-portrait.png)',
            backgroundSize: 'cover', backgroundPosition: 'center',
            opacity: 0.055, filter: 'saturate(0.25)',
          }} />

          <div style={{ position: 'relative', zIndex: 2 }}>
            <div style={{ textAlign: 'center', marginBottom: 48 }}>
              <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 8, color: B.smoke, letterSpacing: '0.4em', marginBottom: 10 }}>
                CATALYST UNIVERSE — CHARACTER PROFILES
              </div>
              <div className="reveal-3d text-3d" style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 'clamp(32px, 5vw, 62px)', color: B.white, letterSpacing: '0.04em', lineHeight: 0.9 }}>
                VESSELS OF <span style={{ color: B.amber }}>ANCIENT POWERS</span>
              </div>
              <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 14, color: B.smoke, marginTop: 16, maxWidth: 500, margin: '16px auto 0', lineHeight: 1.7 }}>
                In Lagos, some bloodlines carry the echo of older worlds.<br />These are the ones the city chose.
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 28 }}>
              {VESSELS.map((v, i) => (
                <div
                  key={i}
                  className="card-3d"
                  style={{ borderRadius: 16, overflow: 'hidden', border: `1px solid ${v.color}30`, background: `linear-gradient(145deg, ${B.charcoal}, ${B.black})`, position: 'relative' }}
                >
                  <div style={{ height: 360, position: 'relative', overflow: 'hidden', background: B.black }}>
                    <img
                      src={v.img}
                      alt={v.name}
                      style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', filter: 'contrast(1.05) saturate(0.88)' }}
                    />
                    <div style={{ position: 'absolute', inset: 0, background: `linear-gradient(to top, ${B.black} 0%, ${v.color}08 55%, transparent 100%)` }} />
                    <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: `linear-gradient(90deg, ${v.color}, ${v.color}40, transparent)` }} />
                  </div>
                  <div style={{ padding: '24px 28px 32px' }}>
                    <div style={{ fontFamily: "'Orbitron', monospace", fontSize: '0.58rem', color: v.color, letterSpacing: '0.35em', marginBottom: 8 }}>{v.subtitle}</div>
                    <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 30, color: B.white, letterSpacing: '0.05em', marginBottom: 14 }}>{v.name}</div>
                    <div style={{ width: 32, height: 1.5, background: `linear-gradient(90deg, ${v.color}, transparent)`, marginBottom: 16 }} />
                    <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 13, color: B.smoke, lineHeight: 1.75 }}>{v.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── CTA strip ── */}
        <div style={{ marginTop: 44, padding: '24px 32px', background: `linear-gradient(90deg, ${B.amber}08, rgba(255,255,255,0.03), ${B.neonMagenta}06)`, border: `1px solid rgba(255,255,255,0.07)`, borderRadius: 12, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
          <div>
            <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 22, color: B.white, letterSpacing: '0.05em' }}>SUBSCRIBE TO CATALYST UNIVERSE</div>
            <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 13, color: B.smoke, marginTop: 4 }}>New issues, behind-the-scenes, and exclusive drops — straight to your inbox.</div>
          </div>
          <a
            href="https://substack.com/@catalyst00555"
            target="_blank" rel="noopener noreferrer"
            style={{ padding: '12px 28px', background: B.amber, color: B.black, fontFamily: "'Space Mono', monospace", fontSize: 9, fontWeight: 700, letterSpacing: '0.2em', textDecoration: 'none', borderRadius: 4, whiteSpace: 'nowrap', boxShadow: `0 0 24px ${B.amber}25`, transition: 'all 0.2s' }}
            onMouseEnter={e => e.currentTarget.style.boxShadow = `0 0 40px ${B.amber}45`}
            onMouseLeave={e => e.currentTarget.style.boxShadow = `0 0 24px ${B.amber}25`}
          >SUBSCRIBE FREE →</a>
        </div>

      </div>
    </section>
  )
}
