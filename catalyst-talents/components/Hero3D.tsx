'use client'

import { useEffect, useRef } from 'react'
import Link from 'next/link'

const PARTICLES = [
  { anim: 'particle-float-a', top: '18%',  left: '11%', size: 4, dur: '7.2s',  delay: '0s'    },
  { anim: 'particle-float-b', top: '26%',  left: '83%', size: 3, dur: '9.8s',  delay: '-2.1s' },
  { anim: 'particle-float-c', top: '63%',  left: '7%',  size: 5, dur: '11.4s', delay: '-4.3s' },
  { anim: 'particle-float-a', top: '71%',  left: '89%', size: 3, dur: '8.5s',  delay: '-1.6s' },
  { anim: 'particle-float-b', top: '44%',  left: '4%',  size: 2, dur: '6.9s',  delay: '-3.2s' },
  { anim: 'particle-float-c', top: '38%',  left: '93%', size: 4, dur: '10.2s', delay: '-5.1s' },
  { anim: 'particle-float-a', top: '84%',  left: '46%', size: 3, dur: '7.8s',  delay: '-2.7s' },
  { anim: 'particle-float-b', top: '11%',  left: '61%', size: 2, dur: '9.1s',  delay: '-0.9s' },
  { anim: 'particle-float-c', top: '53%',  left: '26%', size: 6, dur: '8.7s',  delay: '-3.9s' },
  { anim: 'particle-float-a', top: '29%',  left: '72%', size: 2, dur: '6.5s',  delay: '-1.3s' },
  { anim: 'particle-float-b', top: '77%',  left: '18%', size: 4, dur: '11.3s', delay: '-6.2s' },
  { anim: 'particle-float-c', top: '19%',  left: '37%', size: 3, dur: '7.5s',  delay: '-4.6s' },
]

export default function Hero3D() {
  const contentRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = contentRef.current
    if (!el) return

    let raf = 0
    el.style.transition = 'transform 0.1s linear'

    const onMove = (e: MouseEvent) => {
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(() => {
        const cx = window.innerWidth  / 2
        const cy = window.innerHeight / 2
        const dx = (e.clientX - cx) / cx
        const dy = (e.clientY - cy) / cy
        el.style.transform = `perspective(1200px) rotateX(${dy * -3}deg) rotateY(${dx * 4}deg)`
      })
    }

    window.addEventListener('mousemove', onMove, { passive: true })
    return () => {
      window.removeEventListener('mousemove', onMove)
      cancelAnimationFrame(raf)
    }
  }, [])

  return (
    <section
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
      style={{ background: 'linear-gradient(150deg, #000000 0%, #050505 40%, #0a0906 70%, #030303 100%)' }}
    >
      {/* Layer 0 — perspective grid plane */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ perspective: '700px', perspectiveOrigin: '50% 85%' }}
      >
        <div
          className="hero-grid absolute left-0 right-0 bottom-0"
          style={{ top: '30%', transformOrigin: '50% 100%', opacity: 0.38 }}
        />
      </div>

      {/* Layer 1 — ambient gold orb */}
      <div
        className="ambient-orb absolute rounded-full pointer-events-none"
        style={{
          top: '50%', left: '50%',
          width: '680px', height: '680px',
          transform: 'translate(-50%, -50%)',
          background: 'radial-gradient(circle, rgba(212,175,55,1) 0%, transparent 65%)',
        }}
      />

      {/* Layer 2 — floating gold particles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {PARTICLES.map((p, i) => (
          <div
            key={i}
            className="absolute rounded-full"
            style={{
              top:    p.top,
              left:   p.left,
              width:  `${p.size}px`,
              height: `${p.size}px`,
              animation: `${p.anim} ${p.dur} ease-in-out ${p.delay} infinite`,
              background:  'radial-gradient(circle, #FFEC80 0%, #D4AF37 55%, transparent 100%)',
              boxShadow:   '0 0 10px rgba(212,175,55,0.9), 0 0 26px rgba(212,175,55,0.4)',
              willChange:  'transform, opacity',
            }}
          />
        ))}
      </div>

      {/* Layer 3 — content with mouse tilt */}
      <div
        ref={contentRef}
        className="relative z-10 text-center px-4 max-w-5xl mx-auto pt-24"
        style={{ transformStyle: 'preserve-3d' }}
      >
        <p
          className="text-[#D4AF37] text-[10px] tracking-[0.55em] uppercase mb-7 hero-animate-1"
          style={{ transform: 'translateZ(20px)' }}
        >
          A Catalyst Concepts Extension
        </p>

        <h1
          className="font-playfair font-bold leading-[0.92] mb-8 hero-animate-2"
          style={{
            fontSize: 'clamp(52px, 10vw, 118px)',
            transform: 'translateZ(48px)',
            filter: 'drop-shadow(3px 4px 0px rgba(212,175,55,0.28)) drop-shadow(0px 2px 14px rgba(0,0,0,0.9))',
          }}
        >
          <span className="block text-white">Where Lagos</span>
          <span
            className="block italic"
            style={{
              background: 'linear-gradient(135deg, #C8A020 0%, #F0D060 35%, #FFEC80 55%, #D4AF37 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor:  'transparent',
              backgroundClip:       'text',
            }}
          >
            Meets the World
          </span>
        </h1>

        <p
          className="text-lg sm:text-xl max-w-xl mx-auto leading-relaxed mb-11 hero-animate-3"
          style={{ color: 'rgba(255,255,255,0.48)', transform: 'translateZ(16px)' }}
        >
          Catalyst Talents Lagos illuminates extraordinary models and talents — from the streets of
          Lagos to international runways, screens, and campaigns.
        </p>

        <div
          className="flex flex-col sm:flex-row gap-4 justify-center hero-animate-4"
          style={{ transform: 'translateZ(32px)' }}
        >
          <Link
            href="/models"
            className="shimmer-btn px-12 py-4 bg-[#D4AF37] text-black font-bold text-[11px] tracking-[0.3em] uppercase hover:bg-[#F0D060] transition-colors duration-300"
          >
            View Models
          </Link>
          <Link
            href="/apply"
            className="px-12 py-4 border border-[#D4AF37]/35 text-[#D4AF37] text-[11px] tracking-[0.3em] uppercase hover:border-[#D4AF37] hover:bg-[#D4AF37]/10 transition-all duration-300"
          >
            Apply to Join
          </Link>
        </div>

        <div
          className="mt-20 flex flex-col items-center gap-2.5 hero-animate-5 scroll-indicator"
          style={{ color: 'rgba(255,255,255,0.15)', transform: 'translateZ(10px)' }}
        >
          <div
            className="w-px h-14"
            style={{ background: 'linear-gradient(to bottom, rgba(212,175,55,0.45), transparent)' }}
          />
          <span className="text-[9px] tracking-[0.5em] uppercase">Scroll</span>
        </div>
      </div>

      {/* Edge vignette */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse 90% 90% at 50% 50%, transparent 55%, rgba(0,0,0,0.85) 100%)' }}
      />

      {/* Bottom fade */}
      <div
        className="absolute bottom-0 left-0 right-0 h-32 pointer-events-none"
        style={{ background: 'linear-gradient(to bottom, transparent, #0A0A0A)' }}
      />
    </section>
  )
}
