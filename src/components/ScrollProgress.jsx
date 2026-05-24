import { useState, useEffect } from 'react'
import { B } from '../tokens'

export default function ScrollProgress() {
  const [pct, setPct] = useState(0)

  useEffect(() => {
    const onScroll = () => {
      const el = document.documentElement
      const total = el.scrollHeight - el.clientHeight
      setPct(total > 0 ? (window.scrollY / total) * 100 : 0)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        height: 3,
        width: `${pct}%`,
        background: `linear-gradient(90deg, ${B.amber}, ${B.neonMagenta})`,
        zIndex: 2001,
        boxShadow: `0 0 10px ${B.amber}90`,
        pointerEvents: 'none',
        transition: 'width 0.08s linear',
      }}
    />
  )
}
