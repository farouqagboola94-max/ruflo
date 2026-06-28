import { useState } from 'react'
import { B } from '../tokens'

export default function Marquee({ items = [], speed = 38, separator = '✦' }) {
  const [paused, setPaused] = useState(false)
  // Triple for seamless -33.333% keyframe loop
  const tripled = [...items, ...items, ...items]

  return (
    <div
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      style={{ overflow: 'hidden', position: 'relative', userSelect: 'none' }}
    >
      {/* Edge fades */}
      <div style={{
        position: 'absolute', left: 0, top: 0, bottom: 0, width: 100,
        background: `linear-gradient(90deg, ${B.void}, transparent)`,
        zIndex: 2, pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute', right: 0, top: 0, bottom: 0, width: 100,
        background: `linear-gradient(-90deg, ${B.void}, transparent)`,
        zIndex: 2, pointerEvents: 'none',
      }} />

      <div style={{
        display: 'inline-flex', whiteSpace: 'nowrap',
        animation: `marqueeScroll ${speed}s linear infinite`,
        animationPlayState: paused ? 'paused' : 'running',
      }}>
        {tripled.map((item, i) => (
          <span key={i} style={{
            display: 'inline-flex', alignItems: 'center', padding: '0 18px',
          }}>
            <span style={{
              fontFamily: "'Syne', sans-serif", fontWeight: 700,
              fontSize: 11, letterSpacing: '0.22em',
              color: i % 3 === 0 ? B.mist : B.smoke,
              textTransform: 'uppercase',
            }}>{item}</span>
            <span style={{ color: B.amber, fontSize: 9, marginLeft: 18, opacity: 0.7 }}>{separator}</span>
          </span>
        ))}
      </div>
    </div>
  )
}
