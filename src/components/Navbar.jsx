import { useState, useEffect } from 'react'
import { B } from '../tokens'

const DESKTOP_LINKS = [
  { label: 'ABOUT',   href: '#about' },
  { label: 'FNP',     href: '#fnp' },
  { label: 'GALLERY', href: '#gallery' },
  { label: 'LINEUP',  href: '#lineup' },
  { label: 'MERCH',   href: '#merch' },
  { label: 'VENDORS', href: '#vendors' },
  { label: 'FAQ',     href: '#faq' },
]

const MOBILE_LINKS = [
  { label: 'ABOUT',           href: '#about' },
  { label: 'FRIDAY PROTOCOL', href: '#fnp' },
  { label: 'COMMUNITY',       href: '#community' },
  { label: 'GALLERY',         href: '#gallery' },
  { label: 'LINEUP',          href: '#lineup' },
  { label: 'ARTISTS',         href: '#artists' },
  { label: 'DROPS TIMELINE',  href: '#timeline' },
  { label: 'SCHEDULE',        href: '#schedule' },
  { label: 'MERCH',           href: '#merch' },
  { label: 'EARLY ACCESS',    href: '#waitlist' },
  { label: 'VENDORS',         href: '#vendors' },
  { label: 'FAQ',             href: '#faq' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(typeof window !== 'undefined' && window.innerWidth < 860)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    const onResize = () => setIsMobile(window.innerWidth < 860)
    window.addEventListener('scroll', onScroll)
    window.addEventListener('resize', onResize)
    return () => { window.removeEventListener('scroll', onScroll); window.removeEventListener('resize', onResize) }
  }, [])

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [menuOpen])

  const close = () => setMenuOpen(false)

  return (
    <>
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000,
        padding: '0 24px',
        background: scrolled || menuOpen ? `${B.black}F2` : 'transparent',
        backdropFilter: scrolled || menuOpen ? 'blur(20px)' : 'none',
        WebkitBackdropFilter: scrolled || menuOpen ? 'blur(20px)' : 'none',
        borderBottom: scrolled && !menuOpen ? `1px solid ${B.gunmetal}` : 'none',
        transition: 'background 0.3s, border-color 0.3s',
        height: 60, display: 'flex', alignItems: 'center',
      }}>
        {/* Logo */}
        <a href="#" onClick={close} style={{ textDecoration: 'none', flex: 1 }}>
          <div style={{ fontFamily: "'Orbitron', monospace", fontWeight: 900, fontSize: 14, color: B.amber, textShadow: `0 0 10px ${B.amber}40`, letterSpacing: '0.08em' }}>SNEAKERS FEST</div>
          <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 6, color: B.smoke, letterSpacing: '0.3em' }}>LAGOS '26</div>
        </a>

        {/* Desktop nav */}
        {!isMobile && (
          <div style={{ display: 'flex', gap: 20, alignItems: 'center' }}>
            {DESKTOP_LINKS.map(link => (
              <a
                key={link.label}
                href={link.href}
                style={{ fontFamily: "'Space Mono', monospace", fontSize: 8, color: B.smoke, textDecoration: 'none', letterSpacing: '0.2em', transition: 'color 0.2s' }}
                onMouseEnter={e => e.target.style.color = B.amber}
                onMouseLeave={e => e.target.style.color = B.smoke}
              >{link.label}</a>
            ))}
            <a href="#tickets" style={{ padding: '8px 18px', background: B.amber, color: B.black, fontFamily: "'Space Mono', monospace", fontSize: 8, fontWeight: 700, letterSpacing: '0.15em', textDecoration: 'none', borderRadius: 2, boxShadow: `0 0 15px ${B.amber}20`, transition: 'box-shadow 0.2s' }}
              onMouseEnter={e => e.currentTarget.style.boxShadow = `0 0 30px ${B.amber}50`}
              onMouseLeave={e => e.currentTarget.style.boxShadow = `0 0 15px ${B.amber}20`}
            >GET TICKETS</a>
          </div>
        )}

        {/* Mobile hamburger */}
        {isMobile && (
          <button
            onClick={() => setMenuOpen(o => !o)}
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            style={{ background: menuOpen ? `${B.amber}15` : 'transparent', border: `1px solid ${menuOpen ? B.amber + '60' : B.gunmetal}`, borderRadius: 4, padding: '9px 10px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s' }}
          >
            {menuOpen ? (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M18 6L6 18M6 6l12 12" stroke={B.amber} strokeWidth="2.2" strokeLinecap="round"/></svg>
            ) : (
              <svg width="18" height="14" viewBox="0 0 18 14" fill="none">
                <rect y="0" width="18" height="1.5" rx="1" fill={B.amber}/>
                <rect y="6" width="12" height="1.5" rx="1" fill={B.smoke}/>
                <rect y="12" width="18" height="1.5" rx="1" fill={B.smoke}/>
              </svg>
            )}
          </button>
        )}
      </nav>

      {/* Mobile full-screen drawer */}
      {isMobile && menuOpen && (
        <div style={{
          position: 'fixed', top: 60, left: 0, right: 0, bottom: 0, zIndex: 999,
          background: `${B.black}FA`,
          backdropFilter: 'blur(28px)',
          WebkitBackdropFilter: 'blur(28px)',
          display: 'flex', flexDirection: 'column',
          padding: '24px 32px 48px',
          overflowY: 'auto',
          animation: 'fadeUp 0.2s ease',
        }}>
          {/* Ambient glow */}
          <div style={{ position: 'absolute', top: '30%', left: '50%', transform: 'translate(-50%,-50%)', width: 400, height: 300, background: `radial-gradient(circle, ${B.amber}08 0%, transparent 70%)`, filter: 'blur(50px)', pointerEvents: 'none' }} />

          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 0, position: 'relative' }}>
            {MOBILE_LINKS.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={close}
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 0', fontFamily: "'Bebas Neue', sans-serif", fontSize: 32, color: B.white, textDecoration: 'none', borderBottom: `1px solid ${B.gunmetal}`, letterSpacing: '0.04em', transition: 'color 0.2s, padding-left 0.2s' }}
                onMouseEnter={e => { e.currentTarget.style.color = B.amber; e.currentTarget.style.paddingLeft = '8px' }}
                onMouseLeave={e => { e.currentTarget.style.color = B.white; e.currentTarget.style.paddingLeft = '0' }}
              >
                {link.label}
                <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 14, color: 'rgba(255,255,255,0.2)' }}>→</span>
              </a>
            ))}
          </div>

          <a
            href="#tickets"
            onClick={close}
            style={{ display: 'block', marginTop: 32, padding: '18px', background: B.amber, color: B.black, fontFamily: "'Space Mono', monospace", fontSize: 12, fontWeight: 700, letterSpacing: '0.2em', textDecoration: 'none', borderRadius: 4, textAlign: 'center', boxShadow: `0 0 40px ${B.amber}25` }}
          >GET TICKETS →</a>
          <div style={{ marginTop: 20, fontFamily: "'Space Mono', monospace", fontSize: 7, color: '#333', letterSpacing: '0.25em', textAlign: 'center' }}>DECEMBER 12, 2026 · EKO ATLANTIC, LAGOS</div>
        </div>
      )}
    </>
  )
}
