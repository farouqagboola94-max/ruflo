import { useState, useEffect, useRef } from 'react'
import { B } from '../tokens'

const SEQ = ['ArrowUp','ArrowUp','ArrowDown','ArrowDown','ArrowLeft','ArrowRight','ArrowLeft','ArrowRight','b','a']
const CODE = 'KICKS2026'

export default function KonamiCode() {
  const [show, setShow] = useState(false)
  const [glitch, setGlitch] = useState(false)
  const [copied, setCopied] = useState(false)
  const posRef = useRef(0)

  useEffect(() => {
    function onKey(e) {
      const expected = SEQ[posRef.current]
      if (e.key === expected) {
        posRef.current += 1
        if (posRef.current === SEQ.length) {
          posRef.current = 0
          setGlitch(true)
          setTimeout(() => {
            setGlitch(false)
            setShow(true)
          }, 600)
        }
      } else {
        posRef.current = e.key === SEQ[0] ? 1 : 0
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  function copyCode() {
    navigator.clipboard.writeText(CODE)
    setCopied(true)
    setTimeout(() => setCopied(false), 2500)
  }

  return (
    <>
      <style>{`
        @keyframes glitchScreen {
          0%   { filter: none; transform: skewX(0); }
          15%  { filter: hue-rotate(90deg) brightness(2.5); transform: skewX(-5deg); }
          30%  { filter: invert(1) saturate(3); transform: skewX(4deg) scale(1.01); }
          45%  { filter: hue-rotate(200deg) brightness(0.3); }
          60%  { filter: brightness(3) hue-rotate(300deg); transform: skewX(-2deg); }
          80%  { filter: none; transform: skewX(0); }
          100% { filter: none; }
        }
        @keyframes konamiIn {
          from { opacity: 0; transform: scale(0.75) rotate(-4deg); }
          to   { opacity: 1; transform: scale(1) rotate(0deg); }
        }
      `}</style>

      {glitch && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 99998, pointerEvents: 'none',
          animation: 'glitchScreen 0.6s ease forwards',
          background: 'transparent',
        }} />
      )}

      {show && (
        <div
          onClick={e => { if (e.target === e.currentTarget) setShow(false) }}
          style={{
            position: 'fixed', inset: 0, zIndex: 99999,
            background: 'rgba(0,0,0,0.94)',
            backdropFilter: 'blur(6px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}
        >
          <div style={{
            background: B.charcoal, borderRadius: 14, padding: '48px 40px',
            maxWidth: 480, width: '90%', textAlign: 'center',
            border: `1px solid ${B.amber}60`,
            boxShadow: `0 0 80px ${B.amber}50, 0 0 200px ${B.amber}18`,
            animation: 'konamiIn 0.55s cubic-bezier(0.34,1.56,0.64,1)',
            position: 'relative', overflow: 'hidden',
          }}>
            <div style={{
              position: 'absolute', inset: 0, pointerEvents: 'none',
              background: `repeating-linear-gradient(0deg, transparent, transparent 2px, ${B.amber}06 2px, ${B.amber}06 4px)`,
            }} />

            <div style={{ fontSize: '3.5rem', marginBottom: 16 }}>🎮</div>
            <div style={{ fontFamily: "'Orbitron'", fontSize: '0.55rem', letterSpacing: '0.3em', color: B.amber, marginBottom: 8 }}>
              CHEAT CODE ACTIVATED
            </div>
            <h3 style={{ fontFamily: "'Bebas Neue'", fontSize: '2.2rem', color: B.white, letterSpacing: '0.05em', marginBottom: 8 }}>
              YOU FOUND THE SECRET
            </h3>
            <p style={{ color: B.smoke, fontFamily: "'Space Mono'", fontSize: '0.72rem', lineHeight: 1.75, marginBottom: 28 }}>
              The Konami Code. You clearly grew up right.\nHere's your reward — an exclusive discount on tickets.
            </p>

            <div
              onClick={copyCode}
              style={{
                background: B.black, border: `1px solid ${B.amber}`,
                borderRadius: 8, padding: '16px 24px',
                cursor: 'pointer', marginBottom: 20,
                transition: 'box-shadow 0.2s',
              }}
              onMouseEnter={e => e.currentTarget.style.boxShadow = `0 0 20px ${B.amber}50`}
              onMouseLeave={e => e.currentTarget.style.boxShadow = 'none'}
            >
              <div style={{ fontFamily: "'Orbitron'", fontSize: '0.55rem', letterSpacing: '0.25em', color: B.smoke, marginBottom: 8 }}>
                YOUR DISCOUNT CODE
              </div>
              <div style={{
                fontFamily: "'Bebas Neue'", fontSize: '2.6rem', letterSpacing: '0.25em',
                color: B.amberGlow,
                textShadow: `0 0 24px ${B.amber}`,
              }}>
                {CODE}
              </div>
              <div style={{ fontFamily: "'Space Mono'", fontSize: '0.6rem', color: copied ? B.neonLime : B.smoke, marginTop: 6, transition: 'color 0.2s' }}>
                {copied ? '✓ COPIED TO CLIPBOARD' : 'tap to copy'}
              </div>
            </div>

            <p style={{ color: B.smoke, fontFamily: "'Space Mono'", fontSize: '0.62rem', marginBottom: 24 }}>
              Use at checkout for ₦2,000 off any ticket tier.
            </p>

            <button
              onClick={() => setShow(false)}
              style={{
                background: 'transparent', border: `1px solid ${B.gunmetal}`,
                color: B.smoke, padding: '8px 28px',
                fontFamily: "'Space Mono'", fontSize: '0.7rem',
                cursor: 'pointer', borderRadius: 4,
              }}
            >
              close
            </button>
          </div>
        </div>
      )}
    </>
  )
}
