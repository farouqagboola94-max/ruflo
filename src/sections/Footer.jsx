import { B } from '../tokens'
import { GrainOverlay } from '../components/Shared'
import { SOCIAL_LINKS } from '../config'

const SOCIALS = [
  { platform: 'TIKTOK',      handle: '@SNEAKERSFEST',  href: SOCIAL_LINKS.tiktok,             color: '#69C9D0',     icon: 'TK', tip: 'Challenges & Clips' },
  { platform: 'YOUTUBE',     handle: '@SNEAKERSFEST',  href: SOCIAL_LINKS.youtube,            color: B.neonMagenta, icon: 'YT', tip: 'Docs & Interviews' },
  { platform: 'TWITTER / X', handle: '@Catalyst188',   href: SOCIAL_LINKS.twitter,            color: B.neonCyan,    icon: 'X',  tip: 'Live Updates' },
  { platform: 'INSTAGRAM',   handle: '@Catalystggg',   href: SOCIAL_LINKS.instagramPersonal,  color: '#E1306C',     icon: 'IG', tip: 'The Catalyst' },
  { platform: 'SNAPCHAT',    handle: 'SNEAKERSFEST',   href: SOCIAL_LINKS.snapchat,           color: B.amber,       icon: 'SC', tip: 'Stories & BTS' },
  { platform: 'WHATSAPP',    handle: 'JOIN COMMUNITY', href: SOCIAL_LINKS.whatsapp,           color: B.neonLime,    icon: 'WA', tip: 'Inner Circle' },
  { platform: 'SUBSTACK',    handle: '@CATALYST00555', href: 'https://substack.com/@catalyst00555', color: '#FF6719', icon: 'SS', tip: 'Read the Culture' },
]

const NAV = [
  ['About',                '#about'],
  ['Friday Night Protocol','#fnp'],
  ['Community',            '#community'],
  ['Early Access',         '#waitlist'],
  ['Artists',              '#artists'],
  ['Comics',               '#comics'],
  ['Gallery',              '#gallery'],
  ['Lineup',               '#lineup'],
  ['Merch',                '#merch'],
  ['Tickets',              '#tickets'],
  ['Vendors',              '#vendors'],
  ['FAQ',                  '#faq'],
]

export default function Footer() {
  return (
    <footer style={{ position: 'relative', overflow: 'hidden', background: B.black, borderTop: `1px solid ${B.gunmetal}`, padding: '64px 24px 28px' }}>
      <GrainOverlay />
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: `linear-gradient(90deg, #69C9D0, ${B.neonMagenta}, #E1306C, ${B.neonCyan}, ${B.amber}, ${B.neonLime}, #FF6719)` }} />

      <div style={{ position: 'relative', zIndex: 10, maxWidth: 1100, margin: '0 auto' }}>
        <div style={{ display: 'flex', gap: 60, flexWrap: 'wrap', marginBottom: 52 }}>

          {/* Brand */}
          <div style={{ flex: '1 1 240px' }}>
            <div style={{ fontFamily: "'Orbitron', monospace", fontWeight: 900, fontSize: 20, color: B.amber, textShadow: `0 0 15px ${B.amber}30`, marginBottom: 6 }}>SNEAKERS FEST '26</div>
            <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 8, color: B.smoke, letterSpacing: '0.3em', marginBottom: 6 }}>THE SOLE EXHIBITION — LAGOS, NIGERIA</div>
            <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 7, color: B.neonCyan, letterSpacing: '0.25em', marginBottom: 4 }}>ONLINE COMMUNITY. PHYSICAL PRESENCE.</div>
            <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 7, color: '#FF6719', letterSpacing: '0.2em', marginBottom: 16 }}>A CATALYST CONCEPTS PROPERTY</div>
            <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 13, color: B.smoke, lineHeight: 1.75, maxWidth: 260, marginBottom: 16 }}>West Africa's premier sneaker culture festival. Online every Friday. In person December 12, 2026.</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 7, color: B.smoke, letterSpacing: '0.15em' }}>FOUNDED BY <span style={{ color: B.amberGlow }}>OLUWATOBILOBA</span></div>
              <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 7, color: B.smoke, letterSpacing: '0.15em' }}>PRINCIPAL, CATALYST CONCEPTS</div>
              <a href="mailto:press@sneakersfest.com" style={{ fontFamily: "'Space Mono', monospace", fontSize: 7, color: B.neonCyan, letterSpacing: '0.12em', textDecoration: 'none' }}
                onMouseEnter={e => e.target.style.textDecoration = 'underline'}
                onMouseLeave={e => e.target.style.textDecoration = 'none'}
              >PRESS: press@sneakersfest.com</a>
            </div>
          </div>

          {/* Navigate */}
          <div style={{ flex: '0 1 160px' }}>
            <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 8, color: B.neonCyan, letterSpacing: '0.3em', marginBottom: 18 }}>NAVIGATE</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {NAV.map(([label, href]) => (
                <a key={label} href={href} style={{ fontFamily: "'Syne', sans-serif", fontSize: 13, color: B.smoke, textDecoration: 'none', transition: 'color 0.2s' }}
                  onMouseEnter={e => e.target.style.color = B.amber}
                  onMouseLeave={e => e.target.style.color = B.smoke}
                >{label}</a>
              ))}
            </div>
          </div>

          {/* Social */}
          <div style={{ flex: '1 1 280px' }}>
            <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 8, color: B.neonCyan, letterSpacing: '0.3em', marginBottom: 18 }}>CONNECT ON EVERY PLATFORM</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {SOCIALS.map(s => (
                <a key={s.platform} href={s.href} target="_blank" rel="noopener noreferrer"
                  style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 14px', background: B.charcoal, border: `1px solid ${B.gunmetal}`, borderRadius: 4, textDecoration: 'none', transition: 'all 0.25s' }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = s.color + '70'; e.currentTarget.style.background = s.color + '12' }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = B.gunmetal; e.currentTarget.style.background = B.charcoal }}
                >
                  <div style={{ width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', border: `1px solid ${s.color}40`, borderRadius: 3, background: s.color + '12', flexShrink: 0 }}>
                    <span style={{ fontFamily: "'Orbitron', monospace", fontSize: s.icon === 'X' ? 11 : 8, fontWeight: 900, color: s.color }}>{s.icon}</span>
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 7, color: s.color, letterSpacing: '0.12em' }}>{s.platform}</div>
                    <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 11, color: B.smoke }}>{s.handle} · {s.tip}</div>
                  </div>
                  <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 10, color: s.color + '80' }}>→</span>
                </a>
              ))}
            </div>
          </div>

          {/* CTA */}
          <div style={{ flex: '0 1 180px' }}>
            <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 8, color: B.neonCyan, letterSpacing: '0.3em', marginBottom: 18 }}>JOIN NOW</div>
            <a href="#tickets" style={{ display: 'block', padding: '14px 20px', background: B.amber, color: B.black, fontFamily: "'Space Mono', monospace", fontSize: 9, fontWeight: 700, letterSpacing: '0.15em', textDecoration: 'none', borderRadius: 2, textAlign: 'center', boxShadow: `0 0 25px ${B.amber}20`, marginBottom: 8 }}>GET TICKETS</a>
            <a href="#waitlist" style={{ display: 'block', padding: '11px 20px', border: `1px solid ${B.neonMagenta}50`, color: B.neonMagenta, fontFamily: "'Space Mono', monospace", fontSize: 9, fontWeight: 700, letterSpacing: '0.15em', textDecoration: 'none', borderRadius: 2, textAlign: 'center', marginBottom: 8 }}>EARLY ACCESS</a>
            <a href="https://substack.com/@catalyst00555" target="_blank" rel="noopener noreferrer" style={{ display: 'block', padding: '11px 20px', border: `1px solid #FF671950`, color: '#FF6719', fontFamily: "'Space Mono', monospace", fontSize: 9, fontWeight: 700, letterSpacing: '0.15em', textDecoration: 'none', borderRadius: 2, textAlign: 'center', marginBottom: 8 }}>READ SUBSTACK</a>
            <a href="#vendors" style={{ display: 'block', padding: '11px 20px', border: `1px solid ${B.neonCyan}50`, color: B.neonCyan, fontFamily: "'Space Mono', monospace", fontSize: 9, fontWeight: 700, letterSpacing: '0.15em', textDecoration: 'none', borderRadius: 2, textAlign: 'center', marginBottom: 8 }}>VENDOR APPLY</a>
            <a href="#fnp" style={{ display: 'block', padding: '11px 20px', border: `1px solid ${B.neonLime}50`, color: B.neonLime, fontFamily: "'Space Mono', monospace", fontSize: 9, fontWeight: 700, letterSpacing: '0.15em', textDecoration: 'none', borderRadius: 2, textAlign: 'center', marginBottom: 16 }}>FRIDAY PROTOCOL</a>
            <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 11, color: B.smoke, lineHeight: 1.7 }}>Online first. Lagos December 12. Six platforms. One community.</div>
          </div>
        </div>

        <div style={{ borderTop: `1px solid ${B.gunmetal}`, paddingTop: 20, display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8, fontFamily: "'Space Mono', monospace", fontSize: 7, color: B.smoke, letterSpacing: '0.18em' }}>
          <span>© 2026 SNEAKERS FEST · CATALYST CONCEPTS. ALL RIGHTS RESERVED.</span>
          <span>ONLINE COMMUNITY. PHYSICAL PRESENCE. LAGOS NOIR.</span>
        </div>
      </div>
    </footer>
  )
}
