import { useState, useEffect } from 'react'
import { B } from '../tokens'
import { useAuth } from '../lib/auth.jsx'

const DESKTOP_LINKS = [
  { label: 'ABOUT',    href: '#about' },
  { label: 'LINEUP',   href: '#lineup' },
  { label: 'SCHEDULE', href: '#schedule' },
  { label: 'VENUE',    href: '#venue' },
  { label: 'MERCH',    href: '#merch' },
  { label: 'VENDORS',  href: '#vendors' },
  { label: 'FAQ',      href: '#faq' },
  { label: 'CONTACT',  href: '#contact' },
  { label: 'APP',      href: '#app-promo' },
]

const MOBILE_LINKS = [
  { label: 'ABOUT',           href: '#about',     num: '01' },
  { label: 'ORIGIN STORY',    href: '#origin',    num: '02' },
  { label: 'FRIDAY PROTOCOL', href: '#fnp',       num: '03' },
  { label: 'GALLERY',         href: '#gallery',   num: '04' },
  { label: 'LINEUP',          href: '#lineup',    num: '05' },
  { label: 'ARTISTS',         href: '#artists',   num: '06' },
  { label: 'DROPS TIMELINE',  href: '#timeline',  num: '07' },
  { label: 'SCHEDULE',        href: '#schedule',  num: '08' },
  { label: 'VENUE',           href: '#venue',     num: '09' },
  { label: 'MERCH',           href: '#merch',     num: '10' },
  { label: 'COMMUNITY',       href: '#community', num: '11' },
  { label: 'EARLY ACCESS',    href: '#waitlist',  num: '12' },
  { label: 'ARCHITECT VAULT', href: '#vault-200', num: '13' },
  { label: 'SOLE REGISTRY',   href: '#sole-registry', num: '14' },
  { label: 'VENDORS',         href: '#vendors',   num: '15' },
  { label: 'VENDOR PORTAL',  href: '#vendor-dashboard', num: '16' },
  { label: 'SF\'26 APP',     href: '#app-promo', num: '17' },
  { label: 'FAQ',             href: '#faq',       num: '18' },
  { label: 'CONTACT',         href: '#contact',   num: '19' },
  { label: 'CATALYST: THE AWAKENING ↗', href: 'https://catalyst-awakening.netlify.app/', num: '20', external: true },
]

export default function Navbar() {
  const [scrolled,  setScrolled]  = useState(false)
  const [menuOpen,  setMenuOpen]  = useState(false)
  const [closing,   setClosing]   = useState(false)
  const [isMobile,  setIsMobile]  = useState(typeof window !== 'undefined' && window.innerWidth < 900)
  const { user, login, logout } = useAuth()

  const displayName = user
    ? (user.user_metadata?.full_name?.split(' ')[0] || user.email?.split('@')[0] || '').toUpperCase().slice(0, 10)
    : null

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    const onResize = () => setIsMobile(window.innerWidth < 900)
    window.addEventListener('scroll', onScroll)
    window.addEventListener('resize', onResize)
    return () => { window.removeEventListener('scroll', onScroll); window.removeEventListener('resize', onResize) }
  }, [])

  useEffect(() => {
    document.body.style.overflow = menuOpen && !closing ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [menuOpen, closing])

  const close = () => {
    setClosing(true)
    setTimeout(() => { setMenuOpen(false); setClosing(false) }, 260)
  }

  return (
    <>
      <style>{`
        @keyframes navMenuIn  { from { opacity:0; transform:translateY(-8px) } to { opacity:1; transform:translateY(0) } }
        @keyframes navMenuOut { from { opacity:1; transform:translateY(0)    } to { opacity:0; transform:translateY(-8px) } }
        @keyframes navLinkIn  { from { opacity:0; transform:translateX(-22px) } to { opacity:1; transform:translateX(0) } }
      `}</style>

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
        <a href="#" onClick={() => menuOpen && close()} style={{ textDecoration: 'none', flex: 1 }}>
          <div style={{ fontFamily: "'Orbitron', monospace", fontWeight: 900, fontSize: 14, color: B.amber, textShadow: `0 0 10px ${B.amber}40`, letterSpacing: '0.08em' }}>SNEAKERS FEST</div>
          <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 6, color: B.smoke, letterSpacing: '0.3em' }}>LAGOS '26</div>
        </a>

        {!isMobile && (
          <div style={{ display: 'flex', gap: 18, alignItems: 'center' }}>
            {DESKTOP_LINKS.map(link => (
              <a key={link.label} href={link.href}
                style={{ fontFamily: "'Space Mono', monospace", fontSize: 7.5, color: B.smoke, textDecoration: 'none', letterSpacing: '0.18em', transition: 'color 0.2s' }}
                onMouseEnter={e => e.target.style.color = B.amber}
                onMouseLeave={e => e.target.style.color = B.smoke}
              >{link.label}</a>
            ))}
            <a
              href="https://catalyst-awakening.netlify.app/"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                fontFamily: "'Space Mono', monospace", fontSize: 7.5, letterSpacing: '0.15em',
                textDecoration: 'none', color: '#9B59FF',
                border: '1px solid #9B59FF40', borderRadius: 3, padding: '5px 10px',
                transition: 'border-color 0.2s, box-shadow 0.2s',
              }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = '#9B59FF'; e.currentTarget.style.boxShadow = '0 0 12px #9B59FF40' }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = '#9B59FF40'; e.currentTarget.style.boxShadow = 'none' }}
            >⚡ CATALYST</a>
            <a href="#vault-200"
              style={{
                fontFamily: "'Space Mono', monospace", fontSize: 7.5, letterSpacing: '0.15em',
                textDecoration: 'none', color: B.amber,
                border: `1px solid ${B.amber}40`, borderRadius: 3, padding: '5px 10px',
                transition: 'border-color 0.2s, box-shadow 0.2s',
              }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = B.amber; e.currentTarget.style.boxShadow = `0 0 12px ${B.amber}30` }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = `${B.amber}40`; e.currentTarget.style.boxShadow = 'none' }}
            >🔐 VAULT</a>
            <a href="#tickets"
              style={{ padding: '8px 16px', background: B.amber, color: B.black, fontFamily: "'Space Mono', monospace", fontSize: 7.5, fontWeight: 700, letterSpacing: '0.15em', textDecoration: 'none', borderRadius: 2, boxShadow: `0 0 15px ${B.amber}20`, transition: 'box-shadow 0.2s' }}
              onMouseEnter={e => e.currentTarget.style.boxShadow = `0 0 30px ${B.amber}50`}
              onMouseLeave={e => e.currentTarget.style.boxShadow = `0 0 15px ${B.amber}20`}
            >GET TICKETS</a>
            {user ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 7, color: B.smoke, maxWidth: 72, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{displayName}</span>
                <button
                  onClick={logout}
                  style={{ background: 'transparent', border: `1px solid ${B.gunmetal}`, borderRadius: 3, padding: '5px 10px', cursor: 'pointer', fontFamily: "'Space Mono', monospace", fontSize: 7, color: B.smoke, letterSpacing: '0.12em', transition: 'border-color 0.2s, color 0.2s' }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = '#FF2D7B'; e.currentTarget.style.color = '#FF2D7B' }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = B.gunmetal; e.currentTarget.style.color = B.smoke }}
                >EXIT</button>
              </div>
            ) : (
              <button
                onClick={login}
                style={{ background: 'transparent', border: `1px solid ${B.gunmetal}`, borderRadius: 3, padding: '5px 12px', cursor: 'pointer', fontFamily: "'Space Mono', monospace", fontSize: 7.5, color: B.white, letterSpacing: '0.12em', transition: 'border-color 0.2s, color 0.2s' }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = B.amber; e.currentTarget.style.color = B.amber }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = B.gunmetal; e.currentTarget.style.color = B.white }}
              >SIGN IN</button>
            )}
          </div>
        )}

        {isMobile && (
          <button
            onClick={() => menuOpen ? close() : setMenuOpen(true)}
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

      {isMobile && menuOpen && (
        <div style={{
          position: 'fixed', top: 60, left: 0, right: 0, bottom: 0, zIndex: 999,
          background: `${B.void}FC`,
          backdropFilter: 'blur(32px)',
          WebkitBackdropFilter: 'blur(32px)',
          display: 'flex', flexDirection: 'column',
          padding: '28px 28px 40px',
          overflowY: 'auto',
          animation: closing ? 'navMenuOut 0.26s ease forwards' : 'navMenuIn 0.3s ease',
        }}>
          <div style={{ position: 'absolute', top: '30%', left: '50%', transform: 'translate(-50%,-50%)', width: 480, height: 360, background: `radial-gradient(ellipse, ${B.amber}06, transparent 70%)`, filter: 'blur(50px)', pointerEvents: 'none' }} />

          <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 8, color: '#252525', letterSpacing: '0.3em', marginBottom: 22, position: 'relative' }}>
            NAVIGATE — {MOBILE_LINKS.length - 1} SECTIONS + CATALYST
          </div>

          <div style={{ flex: 1, position: 'relative' }}>
            {MOBILE_LINKS.map((link, i) => (
              <a
                key={link.label}
                href={link.href}
                onClick={link.external ? undefined : close}
                target={link.external ? '_blank' : undefined}
                rel={link.external ? 'noopener noreferrer' : undefined}
                style={{
                  display: 'flex', alignItems: 'center', gap: 14,
                  padding: '12px 0',
                  color: link.external ? '#9B59FF' : link.href === '#vault-200' ? B.amber : B.white,
                  textDecoration: 'none',
                  borderBottom: `1px solid rgba(255,255,255,0.055)`,
                  animation: `navLinkIn 0.35s ease both`,
                  animationDelay: `${i * 28}ms`,
                  transition: 'color 0.15s, padding-left 0.18s',
                }}
                onMouseEnter={e => { e.currentTarget.style.color = link.external ? '#c084fc' : B.amber; e.currentTarget.style.paddingLeft = '8px' }}
                onMouseLeave={e => { e.currentTarget.style.color = link.external ? '#9B59FF' : link.href === '#vault-200' ? B.amber : B.white; e.currentTarget.style.paddingLeft = '0' }}
              >
                <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 8, color: 'inherit', opacity: 0.22, letterSpacing: '0.1em', minWidth: 24 }}>{link.num}</span>
                <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 24, color: 'inherit', letterSpacing: '0.04em', flex: 1 }}>{link.label}</span>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" style={{ opacity: 0.12 }}><path d="M7 17L17 7M17 7H7M17 7v10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </a>
            ))}
          </div>

          <div style={{
            marginTop: 28,
            animation: `navLinkIn 0.35s ease both`,
            animationDelay: `${MOBILE_LINKS.length * 28 + 60}ms`,
            display: 'flex', flexDirection: 'column', gap: 10,
          }}>
            <a
              href="#tickets"
              onClick={close}
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '17px 22px',
                background: B.amber, color: B.black,
                fontFamily: "'Space Mono', monospace", fontSize: 11, fontWeight: 700,
                letterSpacing: '0.18em', textDecoration: 'none', borderRadius: 6,
                boxShadow: `0 0 35px ${B.amber}28`,
              }}
            >
              <span>GET TICKETS</span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M5 12h14M12 5l7 7-7 7" stroke={B.black} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </a>
            {user ? (
              <button
                onClick={() => { logout(); close() }}
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                  padding: '14px 22px',
                  background: 'transparent',
                  border: '1px solid rgba(255,45,123,0.4)',
                  borderRadius: 6,
                  color: '#FF2D7B',
                  fontFamily: "'Space Mono', monospace", fontSize: 10, fontWeight: 700,
                  letterSpacing: '0.18em', cursor: 'pointer',
                }}
              >SIGN OUT ({displayName})</button>
            ) : (
              <button
                onClick={() => { login(); close() }}
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                  padding: '14px 22px',
                  background: 'transparent',
                  border: `1px solid ${B.amber}50`,
                  borderRadius: 6,
                  color: B.amber,
                  fontFamily: "'Space Mono', monospace", fontSize: 10, fontWeight: 700,
                  letterSpacing: '0.18em', cursor: 'pointer',
                }}
              >SIGN IN / REGISTER</button>
            )}
            <div style={{ marginTop: 4, fontFamily: "'Space Mono', monospace", fontSize: 7, color: '#1e1e1e', letterSpacing: '0.22em', textAlign: 'center' }}>
              DEC 12, 2026 · MURI OKUNOLA PARK · LAGOS
            </div>
          </div>
        </div>
      )}
    </>
  )
}
