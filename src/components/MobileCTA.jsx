import { useState, useEffect, useRef } from 'react'
import { B } from '../tokens'

const TABS = [
  {
    id: 'hero',
    label: 'HOME',
    icon: (active, color) => (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        <path d="M3 9.5L12 3l9 6.5V20a1 1 0 01-1 1H5a1 1 0 01-1-1V9.5z" stroke={color} strokeWidth={active ? 2 : 1.5} fill={active ? color + '25' : 'none'} strokeLinejoin="round"/>
        <path d="M9 21V12h6v9" stroke={color} strokeWidth={active ? 2 : 1.5} strokeLinejoin="round"/>
      </svg>
    ),
  },
  {
    id: 'lineup',
    label: 'LINEUP',
    icon: (active, color) => (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="9" stroke={color} strokeWidth={active ? 2 : 1.5}/>
        <circle cx="12" cy="12" r="3" fill={active ? color : 'none'} stroke={color} strokeWidth={active ? 2 : 1.5}/>
        <path d="M12 3v3M12 18v3M3 12h3M18 12h3" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    id: 'tickets',
    label: 'TICKETS',
    accent: true,
    icon: (active, color) => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <path d="M2 9a2 2 0 010-4h20a2 2 0 010 4v1a2 2 0 010 4v5a2 2 0 01-2 2H4a2 2 0 01-2-2v-5a2 2 0 010-4V9z" stroke={color} strokeWidth={active ? 2 : 1.5} fill={active ? color + '20' : 'none'}/>
        <line x1="9" y1="5" x2="9" y2="19" stroke={color} strokeWidth="1.5" strokeDasharray="2 2"/>
      </svg>
    ),
  },
  {
    id: 'gallery',
    label: 'GALLERY',
    icon: (active, color) => (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        <rect x="3" y="5" width="18" height="14" rx="2" stroke={color} strokeWidth={active ? 2 : 1.5} fill={active ? color + '20' : 'none'}/>
        <circle cx="8.5" cy="10" r="1.5" fill={color}/>
        <path d="M3 16l5-5 4 4 3-3 6 6" stroke={color} strokeWidth={active ? 2 : 1.5} strokeLinejoin="round" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    id: 'vendors',
    label: 'VENDORS',
    icon: (active, color) => (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        <path d="M3 6h18l-1.5 9a2 2 0 01-2 1.5H6.5A2 2 0 014.5 15L3 6z" stroke={color} strokeWidth={active ? 2 : 1.5} fill={active ? color + '20' : 'none'} strokeLinejoin="round"/>
        <path d="M3 6L2 3H1M9 3v3M15 3v3" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
        <circle cx="9" cy="20" r="1" fill={color}/>
        <circle cx="15" cy="20" r="1" fill={color}/>
      </svg>
    ),
  },
]

function scrollToSection(id) {
  if (id === 'hero') { window.scrollTo({ top: 0, behavior: 'smooth' }); return }
  const el = document.getElementById(id)
  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

export default function MobileCTA() {
  const [isMobile, setIsMobile] = useState(false)
  const [active, setActive]     = useState('hero')
  const [pressed, setPressed]   = useState(null)
  const ticking = useRef(false)

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  useEffect(() => {
    if (!isMobile) return

    const onScroll = () => {
      if (ticking.current) return
      ticking.current = true
      requestAnimationFrame(() => {
        const mid = window.innerHeight * 0.45
        let best = 'hero'
        let bestDist = Infinity
        for (const tab of TABS) {
          const el = tab.id === 'hero' ? null : document.getElementById(tab.id)
          if (tab.id === 'hero') {
            const dist = Math.abs(window.scrollY)
            if (dist < bestDist) { bestDist = dist; best = 'hero' }
            continue
          }
          if (!el) continue
          const rect = el.getBoundingClientRect()
          const center = rect.top + rect.height / 2
          const dist = Math.abs(center - mid)
          if (dist < bestDist) { bestDist = dist; best = tab.id }
        }
        setActive(best)
        ticking.current = false
      })
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [isMobile])

  if (!isMobile) return null

  return (
    <>
      <style>{`
        @keyframes dotPulse {
          0%, 100% { transform: scale(1); opacity: 1; box-shadow: 0 0 0 0 ${B.amber}80; }
          50% { transform: scale(1.15); opacity: 0.85; box-shadow: 0 0 0 4px ${B.amber}00; }
        }
      `}</style>
      <nav
        role="navigation"
        aria-label="Quick navigation"
        style={{
          position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 850,
          background: `${B.void}F0`,
          backdropFilter: 'blur(24px) saturate(180%)',
          WebkitBackdropFilter: 'blur(24px) saturate(180%)',
          borderTop: `1px solid rgba(255,255,255,0.07)`,
          display: 'flex', alignItems: 'stretch',
          height: 64,
          paddingBottom: 'env(safe-area-inset-bottom)',
        }}
      >
        {TABS.map(tab => {
          const isActive  = active === tab.id
          const isPressed = pressed === tab.id
          const color = tab.accent ? B.amber : isActive ? B.white : '#3a3a4a'
          const labelColor = tab.accent ? B.amber : isActive ? B.white : '#3a3a4a'
          const showDot = tab.accent && !isActive
          const showPriceHint = tab.accent

          return (
            <button
              key={tab.id}
              aria-label={tab.label}
              aria-current={isActive ? 'page' : undefined}
              onClick={() => scrollToSection(tab.id)}
              onTouchStart={() => setPressed(tab.id)}
              onTouchEnd={() => setPressed(null)}
              onTouchCancel={() => setPressed(null)}
              style={{
                flex: tab.accent ? 1.25 : 1,
                position: 'relative',
                background: tab.accent && isActive
                  ? `linear-gradient(180deg, ${B.amber}18 0%, transparent 100%)`
                  : isActive && !tab.accent
                  ? 'rgba(255,255,255,0.04)'
                  : 'none',
                border: 'none',
                borderTop: tab.accent
                  ? `2px solid ${isActive ? B.amber : B.amber + '50'}`
                  : `2px solid ${isActive ? B.white + '40' : 'transparent'}`,
                cursor: 'pointer',
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 2,
                padding: '6px 4px',
                transform: isPressed ? 'scale(0.88)' : 'scale(1)',
                transition: isPressed
                  ? 'transform 0.08s ease-in'
                  : 'transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1), background 0.2s, border-color 0.2s',
                WebkitTapHighlightColor: 'transparent',
                outline: 'none',
              }}
            >
              {/* Notification dot — amber pulse when not on tickets */}
              {showDot && (
                <div style={{
                  position: 'absolute',
                  top: 6, right: 'calc(50% - 14px)',
                  width: 7, height: 7,
                  borderRadius: '50%',
                  background: B.amber,
                  border: `1.5px solid ${B.void}`,
                  animation: 'dotPulse 1.8s ease-in-out infinite',
                  zIndex: 2,
                }} />
              )}

              <div style={{
                transform: isActive ? 'scale(1.08)' : 'scale(1)',
                transition: 'transform 0.25s cubic-bezier(0.34, 1.56, 0.64, 1)',
                filter: isActive && tab.accent ? `drop-shadow(0 0 6px ${B.amber}70)` : isActive ? `drop-shadow(0 0 4px rgba(255,255,255,0.3))` : 'none',
              }}>
                {tab.icon(isActive, color)}
              </div>

              <span style={{
                fontFamily: 'Space Mono, monospace',
                fontSize: tab.accent ? 7.5 : 7,
                fontWeight: tab.accent ? 700 : 400,
                color: labelColor,
                letterSpacing: '0.12em',
                lineHeight: 1,
                transition: 'color 0.2s',
              }}>{tab.label}</span>

              {/* Price hint below TICKETS label */}
              {showPriceHint && (
                <span style={{
                  fontFamily: 'Space Mono, monospace',
                  fontSize: 6.5,
                  color: isActive ? B.amber : B.amber + '80',
                  letterSpacing: '0.08em',
                  lineHeight: 1,
                  transition: 'color 0.2s',
                }}>₦5K+</span>
              )}
            </button>
          )
        })}
      </nav>
    </>
  )
}
