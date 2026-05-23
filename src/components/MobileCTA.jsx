import { useState, useEffect } from 'react'
import { B } from '../tokens'

export default function MobileCTA() {
  const [show, setShow] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768)
    checkMobile()
    window.addEventListener('resize', checkMobile)

    const onScroll = () => setShow(window.scrollY > window.innerHeight * 0.85)
    window.addEventListener('scroll', onScroll, { passive: true })

    return () => {
      window.removeEventListener('resize', checkMobile)
      window.removeEventListener('scroll', onScroll)
    }
  }, [])

  if (!isMobile) return null

  return (
    <div
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 800,
        opacity: show ? 1 : 0,
        transform: show ? 'translateY(0)' : 'translateY(100%)',
        transition: 'opacity 0.35s ease, transform 0.35s ease',
        pointerEvents: show ? 'auto' : 'none',
        background: `linear-gradient(to top, ${B.void}f5, ${B.void}d0)`,
        backdropFilter: 'blur(20px) saturate(180%)',
        borderTop: `1px solid ${B.amber}25`,
        padding: '12px 20px 16px',
        display: 'flex',
        gap: 14,
        alignItems: 'center',
      }}
    >
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: 11, color: B.smoke, letterSpacing: 2, lineHeight: 1 }}>
          SNEAKERS FEST '26
        </div>
        <div style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: 20, color: B.amber, letterSpacing: 1, lineHeight: 1.1, marginTop: 2 }}>
          DEC 12 · LAGOS, NIGERIA
        </div>
      </div>
      <a
        href="#tickets"
        style={{
          flexShrink: 0,
          padding: '13px 22px',
          background: B.amber,
          color: B.black,
          fontFamily: 'Bebas Neue, sans-serif',
          fontSize: 17,
          letterSpacing: 2,
          borderRadius: 8,
          textDecoration: 'none',
          boxShadow: `0 0 24px ${B.amber}50`,
          transition: 'transform 0.15s',
        }}
        onTouchStart={e => { e.currentTarget.style.transform = 'scale(0.96)' }}
        onTouchEnd={e => { e.currentTarget.style.transform = 'scale(1)' }}
      >
        GET TICKETS
      </a>
    </div>
  )
}
