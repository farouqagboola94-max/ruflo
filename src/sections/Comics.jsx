import { B } from '../tokens'
import { GrainOverlay, SectionTag } from '../components/Shared'

const ISSUES = [
  {
    num: '001',
    title: 'SOLE SURVIVOR',
    sub: 'The Origin Story',
    desc: 'One pair. One city. One collector who refused to let the culture die. The story that started it all.',
    tag: 'AVAILABLE NOW',
    color: B.amber,
    palette: [`${B.amber}22`, `${B.amber}06`],
  },
  {
    num: '002',
    title: 'THE DROP',
    sub: 'When the streets get heat',
    desc: 'A limited release. A city on edge. Everyone wants the same pair — and only one person can have them.',
    tag: 'AVAILABLE NOW',
    color: B.neonMagenta,
    palette: [`${B.neonMagenta}20`, `${B.neonMagenta}06`],
  },
  {
    num: '003',
    title: 'GRAIL HUNTERS',
    sub: 'The hunt begins',
    desc: 'Across three continents and six markets, a crew chases the rarest pair ever made. Some obsessions are worth it.',
    tag: 'AVAILABLE NOW',
    color: B.neonCyan,
    palette: [`${B.neonCyan}20`, `${B.neonCyan}06`],
  },
  {
    num: '004',
    title: 'CATALYST',
    sub: 'The next chapter',
    desc: 'The universe expands. New characters. New cities. The culture shifts — and nothing will ever be the same.',
    tag: 'COMING SOON',
    color: B.neonLime,
    palette: [`${B.neonLime}18`, `${B.neonLime}04`],
    upcoming: true,
  },
]

const HalftoneBg = ({ color }) => (
  <div style={{
    position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden',
    backgroundImage: `radial-gradient(circle, ${color} 1px, transparent 1px)`,
    backgroundSize: '12px 12px',
    opacity: 0.18,
  }} />
)

export default function Comics() {
  return (
    <section id="comics" style={{ position: 'relative', overflow: 'hidden', background: B.black, padding: '100px 24px' }}>
      <GrainOverlay />

      {/* Wide diagonal streak */}
      <div style={{ position: 'absolute', top: '10%', left: '-10%', width: '120%', height: 2, background: `linear-gradient(90deg, transparent, ${B.amber}20, ${B.neonMagenta}15, transparent)`, transform: 'rotate(-3deg)', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', bottom: '15%', left: '-10%', width: '120%', height: 1, background: `linear-gradient(90deg, transparent, ${B.neonCyan}15, transparent)`, transform: 'rotate(2deg)', pointerEvents: 'none' }} />

      <div style={{ position: 'relative', zIndex: 10, maxWidth: 1100, margin: '0 auto' }}>

        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: 24, marginBottom: 60 }}>
          <div>
            <SectionTag>CATALYST UNIVERSE</SectionTag>
            <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 'clamp(44px, 7vw, 80px)', color: B.white, lineHeight: 0.85, letterSpacing: '0.02em' }}>
              THE<br />
              <span style={{ color: B.amber, textShadow: `0 0 40px ${B.amber}40` }}>COMICS</span>
            </div>
            <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 9, color: B.smoke, letterSpacing: '0.35em', marginTop: 10 }}>SNEAKER CULTURE · STREET MYTHOLOGY · LAGOS NOIR</div>
          </div>
          <a
            href="https://substack.com/@catalyst00555"
            target="_blank"
            rel="noopener noreferrer"
            style={{ display: 'inline-flex', alignItems: 'center', gap: 10, padding: '12px 24px', background: `rgba(245,166,35,0.1)`, border: `1px solid ${B.amber}50`, borderRadius: 4, textDecoration: 'none', fontFamily: "'Space Mono', monospace", fontSize: 9, color: B.amber, letterSpacing: '0.15em', transition: 'all 0.25s' }}
            onMouseEnter={e => { e.currentTarget.style.background = `rgba(245,166,35,0.2)`; e.currentTarget.style.borderColor = B.amber }}
            onMouseLeave={e => { e.currentTarget.style.background = `rgba(245,166,35,0.1)`; e.currentTarget.style.borderColor = `${B.amber}50` }}
          >
            READ ALL ISSUES →
          </a>
        </div>

        {/* Issue grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 18 }}>
          {ISSUES.map((issue, i) => (
            <a
              key={i}
              href="https://substack.com/@catalyst00555"
              target="_blank"
              rel="noopener noreferrer"
              style={{ textDecoration: 'none', display: 'block', borderRadius: 12, overflow: 'hidden', border: `1px solid ${issue.upcoming ? issue.color + '25' : issue.color + '35'}`, background: B.charcoal, transition: 'all 0.3s', position: 'relative' }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-5px)'; e.currentTarget.style.borderColor = issue.color + '80'; e.currentTarget.style.boxShadow = `0 16px 48px rgba(0,0,0,0.5), 0 0 0 1px ${issue.color}20` }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.borderColor = issue.upcoming ? issue.color + '25' : issue.color + '35'; e.currentTarget.style.boxShadow = 'none' }}
            >
              {/* Comic cover art area */}
              <div style={{ height: 200, position: 'relative', background: `linear-gradient(135deg, ${issue.palette[0]}, ${issue.palette[1]})`, overflow: 'hidden' }}>
                <HalftoneBg color={issue.color} />
                {/* Diagonal slice */}
                <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '40%', background: `linear-gradient(transparent, ${B.charcoal})` }} />
                {/* Issue number — large behind */}
                <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', fontFamily: "'Bebas Neue', sans-serif", fontSize: 110, color: issue.color, opacity: 0.07, lineHeight: 1, letterSpacing: '-0.05em', pointerEvents: 'none', whiteSpace: 'nowrap' }}>#{issue.num}</div>
                {/* Foreground issue number */}
                <div style={{ position: 'absolute', top: 16, left: 18 }}>
                  <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 8, color: issue.color, letterSpacing: '0.2em', padding: '3px 8px', background: issue.color + '18', border: `1px solid ${issue.color}50`, borderRadius: 2 }}>ISSUE #{issue.num}</span>
                </div>
                {/* Tag badge */}
                <div style={{ position: 'absolute', top: 16, right: 18 }}>
                  <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 7, color: issue.upcoming ? issue.color : B.black, letterSpacing: '0.1em', padding: '3px 8px', background: issue.upcoming ? issue.color + '15' : issue.color, borderRadius: 2, border: `1px solid ${issue.color}${issue.upcoming ? '40' : ''}` }}>{issue.tag}</span>
                </div>
                {/* Big title in cover */}
                <div style={{ position: 'absolute', bottom: 24, left: 18, right: 18 }}>
                  <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 28, color: B.white, lineHeight: 0.9, letterSpacing: '0.04em', textShadow: `0 2px 10px rgba(0,0,0,0.8)` }}>{issue.title}</div>
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
                  {!issue.upcoming && <div style={{ width: 24, height: 24, borderRadius: '50%', border: `1.5px solid ${issue.color}50`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <span style={{ color: issue.color, fontSize: 10 }}>→</span>
                  </div>}
                </div>
              </div>
            </a>
          ))}
        </div>

        {/* CTA strip */}
        <div style={{ marginTop: 44, padding: '24px 32px', background: `linear-gradient(90deg, ${B.amber}08, rgba(255,255,255,0.03), ${B.neonMagenta}06)`, border: `1px solid rgba(255,255,255,0.07)`, borderRadius: 12, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
          <div>
            <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 22, color: B.white, letterSpacing: '0.05em' }}>SUBSCRIBE TO CATALYST UNIVERSE</div>
            <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 13, color: B.smoke, marginTop: 4 }}>New issues, behind-the-scenes, and exclusive drops — straight to your inbox.</div>
          </div>
          <a
            href="https://substack.com/@catalyst00555"
            target="_blank"
            rel="noopener noreferrer"
            style={{ padding: '12px 28px', background: B.amber, color: B.black, fontFamily: "'Space Mono', monospace", fontSize: 9, fontWeight: 700, letterSpacing: '0.2em', textDecoration: 'none', borderRadius: 4, whiteSpace: 'nowrap', boxShadow: `0 0 24px ${B.amber}25`, transition: 'all 0.2s' }}
            onMouseEnter={e => e.currentTarget.style.boxShadow = `0 0 40px ${B.amber}45`}
            onMouseLeave={e => e.currentTarget.style.boxShadow = `0 0 24px ${B.amber}25`}
          >SUBSCRIBE FREE →</a>
        </div>
      </div>
    </section>
  )
}
