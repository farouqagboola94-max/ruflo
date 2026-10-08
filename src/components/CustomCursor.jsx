import { useEffect, useRef } from 'react'
import { B } from '../tokens'

export default function CustomCursor() {
  const dotRef  = useRef(null)
  const ringRef = useRef(null)
  const mouse   = useRef({ x: -200, y: -200 })
  const rPos    = useRef({ x: -200, y: -200 })
  const hover   = useRef(false)
  const raf     = useRef(null)

  useEffect(() => {
    // Skip on touch-only devices
    if (window.matchMedia('(hover: none)').matches) return

    const onMove = e => {
      mouse.current = { x: e.clientX, y: e.clientY }
      if (dotRef.current) {
        dotRef.current.style.left    = e.clientX + 'px'
        dotRef.current.style.top     = e.clientY + 'px'
        dotRef.current.style.opacity = '1'
      }
    }
    const onOver = e => {
      hover.current = !!e.target.closest('a,button,[role=button],input,select,textarea,[data-cursor-hover]')
    }
    const onLeave = () => {
      if (dotRef.current)  dotRef.current.style.opacity  = '0'
      if (ringRef.current) ringRef.current.style.opacity = '0'
    }
    const onEnter = () => {
      if (dotRef.current)  dotRef.current.style.opacity  = '1'
      if (ringRef.current) ringRef.current.style.opacity = '1'
    }

    const loop = () => {
      rPos.current.x += (mouse.current.x - rPos.current.x) * 0.09
      rPos.current.y += (mouse.current.y - rPos.current.y) * 0.09
      if (ringRef.current) {
        const s = hover.current ? 52 : 30
        ringRef.current.style.left        = rPos.current.x + 'px'
        ringRef.current.style.top         = rPos.current.y + 'px'
        ringRef.current.style.width       = s + 'px'
        ringRef.current.style.height      = s + 'px'
        ringRef.current.style.borderColor = hover.current ? B.amber : B.neonCyan + '70'
        ringRef.current.style.boxShadow   = hover.current
          ? `0 0 20px ${B.amber}40`
          : `0 0 8px ${B.neonCyan}20`
      }
      raf.current = requestAnimationFrame(loop)
    }
    raf.current = requestAnimationFrame(loop)

    document.addEventListener('mousemove',  onMove)
    document.addEventListener('mouseover',  onOver)
    document.addEventListener('mouseleave', onLeave)
    document.addEventListener('mouseenter', onEnter)

    return () => {
      document.removeEventListener('mousemove',  onMove)
      document.removeEventListener('mouseover',  onOver)
      document.removeEventListener('mouseleave', onLeave)
      document.removeEventListener('mouseenter', onEnter)
      cancelAnimationFrame(raf.current)
    }
  }, [])

  return (
    <>
      {/* Dot — snaps exactly to pointer */}
      <div ref={dotRef} style={{
        position: 'fixed', top: 0, left: 0, zIndex: 99999, pointerEvents: 'none',
        width: 7, height: 7, borderRadius: '50%',
        background: B.amber,
        transform: 'translate(-50%, -50%)',
        boxShadow: `0 0 8px ${B.amber}, 0 0 18px ${B.amber}70`,
        opacity: 0, transition: 'opacity 0.3s',
      }} />
      {/* Ring — follows with spring lag */}
      <div ref={ringRef} style={{
        position: 'fixed', top: 0, left: 0, zIndex: 99998, pointerEvents: 'none',
        width: 30, height: 30, borderRadius: '50%',
        border: `1.5px solid ${B.neonCyan}70`,
        transform: 'translate(-50%, -50%)',
        transition: [
          'width 0.35s cubic-bezier(0.34,1.56,0.64,1)',
          'height 0.35s cubic-bezier(0.34,1.56,0.64,1)',
          'border-color 0.2s',
          'box-shadow 0.2s',
          'opacity 0.3s',
        ].join(','),
      }} />
    </>
  )
}
