'use client'

import { useState, useRef, useCallback } from 'react'
import { Model } from '@/data/models'

const CATEGORY_COLORS: Record<string, string> = {
  Fashion:    '#f87171',
  Commercial: '#60a5fa',
  Influencer: '#c084fc',
  Acting:     '#fbbf24',
}

export default function ModelCard({ model }: { model: Model }) {
  const cardRef = useRef<HTMLDivElement>(null)
  const [hovered, setHovered] = useState(false)
  const [tilt,    setTilt]    = useState({ rx: 0, ry: 0 })
  const [spec,    setSpec]    = useState({ x: 50, y: 50 })

  const onMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const el = cardRef.current
    if (!el) return
    const { left, top, width, height } = el.getBoundingClientRect()
    const x = (e.clientX - left) / width
    const y = (e.clientY - top)  / height
    setTilt({ rx: -(y - 0.5) * 18, ry: (x - 0.5) * 24 })
    setSpec({ x: x * 100, y: y * 100 })
  }, [])

  const onMouseEnter = useCallback(() => setHovered(true),  [])
  const onMouseLeave = useCallback(() => {
    setHovered(false)
    setTilt({ rx: 0, ry: 0 })
  }, [])

  const color = CATEGORY_COLORS[model.category] ?? '#D4AF37'

  return (
    <div
      ref={cardRef}
      onMouseMove={onMouseMove}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      className="card-3d group relative overflow-hidden border border-white/5 hover:border-[#D4AF37]/40 cursor-pointer"
      style={{
        transform: hovered
          ? `perspective(800px) rotateX(${tilt.rx}deg) rotateY(${tilt.ry}deg) translateZ(14px) scale(1.025)`
          : 'perspective(800px) rotateX(0deg) rotateY(0deg) translateZ(0px) scale(1)',
        transition: hovered
          ? 'transform 0.08s linear, box-shadow 0.3s ease'
          : 'transform 0.65s cubic-bezier(0.23, 1, 0.32, 1), box-shadow 0.5s ease',
        boxShadow: hovered
          ? '0 24px 64px rgba(0,0,0,0.65), 0 0 48px rgba(212,175,55,0.12)'
          : '0 4px 16px rgba(0,0,0,0.4)',
      }}
    >
      {/* Specular highlight follows cursor */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          pointerEvents: 'none',
          zIndex: 20,
          mixBlendMode: 'screen',
          background: `radial-gradient(circle at ${spec.x}% ${spec.y}%, rgba(212,175,55,0.22) 0%, transparent 65%)`,
          opacity: hovered ? 1 : 0,
          transition: 'opacity 0.2s ease',
        }}
      />

      <div className="relative aspect-[3/4] overflow-hidden">
        {/* Base gradient */}
        <div className="absolute inset-0" style={{ background: model.gradient }} />

        {/* Fine grid texture */}
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage:
              'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
            backgroundSize: '28px 28px',
          }}
        />

        {/* Bottom vignette */}
        <div
          className="absolute inset-0"
          style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.2) 55%, transparent 100%)' }}
        />

        {/* Corner glow */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            right: 0,
            width: '130px',
            height: '130px',
            transform: 'translate(40%, -40%)',
            borderRadius: '50%',
            background: `radial-gradient(circle, ${color}60 0%, transparent 65%)`,
            opacity: hovered ? 0.75 : 0,
            transition: 'opacity 0.6s ease',
            pointerEvents: 'none',
          }}
        />

        {/* Top-edge gold line — slides in on hover */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            height: '2px',
            background: `linear-gradient(90deg, ${color}, #F0D060 50%, transparent)`,
            width: hovered ? '100%' : '0%',
            transition: 'width 0.6s ease',
            pointerEvents: 'none',
          }}
        />

        {/* Category chip */}
        <div className="absolute top-4 left-4 z-10">
          <span
            className="text-[9px] tracking-[0.3em] uppercase font-semibold px-2.5 py-1"
            style={{
              color,
              background: `${color}18`,
              border: `1px solid ${color}35`,
            }}
          >
            {model.category}
          </span>
        </div>

        {/* Info block */}
        <div className="absolute bottom-0 left-0 right-0 p-5 z-10">
          <h3
            className="font-playfair text-xl font-bold mb-1"
            style={{
              color: hovered ? '#F0D060' : '#FFFFFF',
              transition: 'color 0.3s ease',
            }}
          >
            {model.name}
          </h3>
          <p className="text-white/50 text-xs tracking-wider mb-3">{model.tagline}</p>

          <div className="flex gap-4 text-[10px] text-white/30 mb-2.5">
            {model.height && <span>H: {model.height}</span>}
            {model.bust   && <span>B: {model.bust}</span>}
            {model.waist  && <span>W: {model.waist}</span>}
          </div>

          {/* Slide-up view profile CTA */}
          <div
            style={{
              overflow: 'hidden',
              height: hovered ? '22px' : '0px',
              transition: 'height 0.5s cubic-bezier(0.23, 1, 0.32, 1)',
            }}
          >
            <span
              className="flex items-center gap-2 text-[9px] tracking-[0.4em] uppercase"
              style={{ color: 'rgba(212,175,55,0.7)' }}
            >
              View Profile <span style={{ fontSize: '11px' }}>→</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
