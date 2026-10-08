import { useState, useEffect } from 'react'
import { B } from '../tokens'

export default function BackToTop() {
  const [visible, setVisible] = useState(false)
  const [isMobile, setIsMobile] = useState(() => window.innerWidth < 768)

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 500)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768)
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      aria-label="Back to top"
      style={{
        position: 'fixed', bottom: 90, right: 28, zIndex: 990,
        width: 44, height: 44, borderRadius: '50%',
        background: B.charcoal,
        border: `1px solid ${B.amber}50`,
        cursor: 'pointer',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        boxShadow: `0 0 20px ${B.amber}15, 0 4px 16px rgba(0,0,0,0.6)`,
        transition: 'all 0.25s',
        opacity: visible ? 1 : 0,
        pointerEvents: visible ? 'auto' : 'none',
        transform: visible ? 'translateY(0)' : 'translateY(12px)',
      }}
      onMouseEnter={e => { e.currentTarget.style.background = B.amber + '20'; e.currentTarget.style.borderColor = B.amber; e.currentTarget.style.boxShadow = `0 0 28px ${B.amber}35` }}
      onMouseLeave={e => { e.currentTarget.style.background = B.charcoal; e.currentTarget.style.borderColor = B.amber + '50'; e.currentTarget.style.boxShadow = `0 0 20px ${B.amber}15` }}
    >
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
        <path d="M12 19V5M5 12l7-7 7 7" stroke={B.amber} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    </button>
  )
}
