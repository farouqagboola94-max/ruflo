import { useState, useEffect } from 'react'
import { B } from '../tokens'

export default function ShareButton() {
  const [visible, setVisible] = useState(false)
  const [hovered, setHovered] = useState(false)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 600)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const handleShare = async () => {
    const data = {
      title: "Sneakers Fest '26 — The Sole Exhibition",
      text: "West Africa's premier sneaker culture event. December 12, 2026 · Eko Atlantic, Lagos.",
      url: window.location.href,
    }
    if (navigator.share && navigator.canShare && navigator.canShare(data)) {
      try { await navigator.share(data) } catch {}
    } else {
      try {
        await navigator.clipboard.writeText(window.location.href)
        setCopied(true)
        setTimeout(() => setCopied(false), 2500)
      } catch {}
    }
  }

  return (
    <div
      style={{
        position: 'fixed',
        bottom: 160,
        left: 24,
        zIndex: 900,
        opacity: visible ? 1 : 0,
        transform: visible ? 'scale(1)' : 'scale(0.85)',
        transition: 'opacity 0.3s ease, transform 0.3s ease',
        pointerEvents: visible ? 'auto' : 'none',
      }}
    >
      {(hovered || copied) && (
        <div
          style={{
            position: 'absolute',
            left: '100%',
            top: '50%',
            transform: 'translateY(-50%)',
            marginLeft: 12,
            background: copied ? B.neonLime : '#1a1a1a',
            color: copied ? B.black : B.white,
            fontFamily: 'Bebas Neue, sans-serif',
            fontSize: 12,
            letterSpacing: 1.5,
            padding: '7px 13px',
            borderRadius: 8,
            whiteSpace: 'nowrap',
            boxShadow: '0 4px 16px rgba(0,0,0,0.5)',
            border: `1px solid ${copied ? B.neonLime : B.amber}35`,
          }}
        >
          {copied ? '✓ LINK COPIED!' : 'SHARE SITE'}
          <div
            style={{
              position: 'absolute',
              right: '100%',
              top: '50%',
              transform: 'translateY(-50%)',
              width: 0,
              height: 0,
              borderTop: '5px solid transparent',
              borderBottom: '5px solid transparent',
              borderRight: `5px solid ${copied ? B.neonLime : '#1a1a1a'}`,
            }}
          />
        </div>
      )}
      <button
        onClick={handleShare}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        aria-label="Share this site"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: 52,
          height: 52,
          background: copied ? B.neonLime : 'rgba(255,255,255,0.07)',
          border: `1px solid ${copied ? B.neonLime : B.amber}45`,
          backdropFilter: 'blur(12px)',
          borderRadius: '50%',
          cursor: 'pointer',
          boxShadow: hovered ? `0 8px 24px ${B.amber}30` : '0 4px 12px rgba(0,0,0,0.4)',
          transform: hovered ? 'scale(1.1)' : 'scale(1)',
          transition: 'all 0.2s ease',
        }}
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={copied ? B.black : B.amber} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="18" cy="5" r="3"/>
          <circle cx="6" cy="12" r="3"/>
          <circle cx="18" cy="19" r="3"/>
          <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/>
          <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
        </svg>
      </button>
    </div>
  )
}
