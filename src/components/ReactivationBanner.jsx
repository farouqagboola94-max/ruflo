import { useState, useEffect } from 'react'
import { B } from '../tokens'

const LAST_VISIT_KEY = 'sf26_last_visit'
const MEMORY_KEY     = 'sf26_interaction_memory'
const DISMISS_KEY    = 'sf26_banner_dismissed_ts'
const REGCODE_KEY    = 'sf26_refcode'
const ORDERS_KEY     = 'sf26_orders'
const WR_KEY         = 'sf26_wheel_reg_used'
const WT_KEY         = 'sf26_wheel_tkt_used'

const EVENT_MS = new Date('2026-12-12T00:00:00').getTime()

const SECTION_LABELS = {
  spin:          'Spin to Win',
  gallery:       'Gallery',
  lineup:        'Lineup',
  merch:         'Merch',
  tickets:       'Get Tickets',
  trivia:        'Sneaker Trivia',
  'memory-match':'Sole Memory',
  waitlist:      'Early Access',
  fnp:           'Friday Protocol',
  artists:       'Artists',
  museum:        'The Museum',
  'vault-200':   'Architect Vault',
  comics:        'Catalyst Universe',
  trades:        'Trade Board',
  hype:          'Hype Counter',
  outfit:        'Outfit Matcher',
  soledle:       'Soledle',
  bingo:         'Sneaker Bingo',
  worth:         'Collection Worth',
}

export default function ReactivationBanner() {
  const [show,          setShow]          = useState(false)
  const [daysAway,      setDaysAway]      = useState(0)
  const [daysUntil,     setDaysUntil]     = useState(0)
  const [spinsLeft,     setSpinsLeft]     = useState(0)
  const [topSections,   setTopSections]   = useState([])
  const [exiting,       setExiting]       = useState(false)

  useEffect(() => {
    try {
      const now       = Date.now()
      const lastVisit = parseInt(localStorage.getItem(LAST_VISIT_KEY) || '0', 10)
      const dismissed = parseInt(localStorage.getItem(DISMISS_KEY) || '0', 10)

      // Always update last-visit timestamp
      localStorage.setItem(LAST_VISIT_KEY, String(now))

      // Dismissed within 24h — stay hidden
      if (now - dismissed < 86400000) return

      // First visit or too recent (< 24 h gap) — don't intrude
      if (!lastVisit || now - lastVisit < 86400000) return

      const hoursSince = (now - lastVisit) / 3600000
      const days       = Math.max(1, Math.round(hoursSince / 24))
      const dUntil     = Math.max(0, Math.round((EVENT_MS - now) / 86400000))

      // Spin pool state (mirrors SpinWheel logic)
      const isReg  = !!localStorage.getItem(REGCODE_KEY)
      const hasTkt = (() => { try { return JSON.parse(localStorage.getItem(ORDERS_KEY) || '[]').length > 0 } catch { return false } })()
      const regLeft = isReg  ? Math.max(0, 3 - parseInt(localStorage.getItem(WR_KEY) || '0', 10)) : 0
      const tktLeft = hasTkt ? Math.max(0, 3 - parseInt(localStorage.getItem(WT_KEY) || '0', 10)) : 0

      // RL: top 2 sections by accumulated dwell time
      const mem    = JSON.parse(localStorage.getItem(MEMORY_KEY) || '[]')
      const sorted = [...mem].sort((a, b) => b.duration - a.duration).slice(0, 2)

      setDaysAway(days)
      setDaysUntil(dUntil)
      setSpinsLeft(regLeft + tktLeft)
      setTopSections(sorted)
      // slight delay so the banner doesn't flash on initial paint
      setTimeout(() => setShow(true), 2200)
    } catch {}
  }, [])

  const dismiss = () => {
    try { localStorage.setItem(DISMISS_KEY, String(Date.now())) } catch {}
    setExiting(true)
    setTimeout(() => setShow(false), 380)
  }

  if (!show) return null

  return (
    <>
      <style>{`
        @keyframes reactivateIn {
          from { opacity:0; transform:translateX(28px) }
          to   { opacity:1; transform:translateX(0)    }
        }
      `}</style>
      <div style={{
        position: 'fixed', bottom: 88, right: 20, zIndex: 990,
        width: 296, maxWidth: 'calc(100vw - 40px)',
        background: '#111',
        border: `1px solid ${B.amber}45`,
        borderRadius: 8,
        boxShadow: `0 0 48px ${B.amber}12, 0 12px 36px rgba(0,0,0,0.7)`,
        animation: exiting ? 'none' : 'reactivateIn 0.38s cubic-bezier(0.16,1,0.3,1)',
        opacity: exiting ? 0 : 1,
        transform: exiting ? 'translateX(20px)' : 'translateX(0)',
        transition: exiting ? 'opacity 0.38s, transform 0.38s' : 'none',
        overflow: 'hidden',
      }}>
        {/* Spectrum bar */}
        <div style={{ height: 2, background: `linear-gradient(90deg, ${B.amber}, ${B.neonCyan}, ${B.neonMagenta}, #9B59FF)` }} />

        <div style={{ padding: '14px 16px 16px' }}>

          {/* Header row */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
            <div>
              <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 6.5, color: B.neonCyan, letterSpacing: '0.32em', marginBottom: 3 }}>
                SYSTEM REACTIVATION
              </div>
              <div style={{ fontFamily: "'Orbitron', monospace", fontWeight: 900, fontSize: 14, color: B.amber, textShadow: `0 0 12px ${B.amber}50`, letterSpacing: '0.04em' }}>
                WELCOME BACK
              </div>
            </div>
            <button onClick={dismiss} aria-label="Dismiss" style={{
              background: 'transparent', border: 'none', cursor: 'pointer',
              color: '#444', fontSize: 17, lineHeight: 1, padding: '0 2px',
              transition: 'color 0.2s',
            }}
              onMouseEnter={e => e.currentTarget.style.color = B.smoke}
              onMouseLeave={e => e.currentTarget.style.color = '#444'}
            >×</button>
          </div>

          {/* Time-away message */}
          <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 12, color: B.smoke, lineHeight: 1.65, marginBottom: 12 }}>
            You've been away <span style={{ color: B.amber, fontWeight: 700 }}>{daysAway} day{daysAway !== 1 ? 's' : ''}</span>.
            {daysUntil > 0 && (
              <> Only <span style={{ color: B.neonMagenta, fontWeight: 700 }}>{daysUntil} days</span> left until Dec 12, Lagos.</>
            )}
          </div>

          {/* Spin trials waiting */}
          {spinsLeft > 0 && (
            <a href="#spin" onClick={dismiss} style={{
              display: 'flex', alignItems: 'center', gap: 9,
              padding: '9px 11px', marginBottom: 8,
              background: `${B.amber}0E`, border: `1px solid ${B.amber}30`,
              borderRadius: 5, textDecoration: 'none',
              transition: 'border-color 0.2s, background 0.2s',
            }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = `${B.amber}70`; e.currentTarget.style.background = `${B.amber}18` }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = `${B.amber}30`; e.currentTarget.style.background = `${B.amber}0E` }}
            >
              <div style={{ fontSize: 18, lineHeight: 1 }}>🎰</div>
              <div>
                <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 6.5, color: B.amber, letterSpacing: '0.18em', marginBottom: 2 }}>
                  SPINS WAITING
                </div>
                <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 11, color: B.smoke }}>
                  {spinsLeft} free spin{spinsLeft !== 1 ? 's' : ''} ready to use
                </div>
              </div>
              <span style={{ marginLeft: 'auto', fontFamily: "'Space Mono', monospace", fontSize: 10, color: `${B.amber}70` }}>→</span>
            </a>
          )}

          {/* RL picks — top sections by dwell time */}
          {topSections.length > 0 && (
            <div>
              <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 6.5, color: B.neonCyan, letterSpacing: '0.28em', marginBottom: 6 }}>
                PICKED FOR YOU
              </div>
              {topSections.map(s => (
                <a key={s.section} href={`#${s.section}`} onClick={dismiss} style={{
                  display: 'flex', alignItems: 'center', gap: 9,
                  padding: '8px 10px', marginBottom: 5,
                  background: `${B.neonCyan}08`, border: `1px solid ${B.neonCyan}20`,
                  borderRadius: 4, textDecoration: 'none',
                  transition: 'border-color 0.2s, background 0.2s',
                }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = `${B.neonCyan}50`; e.currentTarget.style.background = `${B.neonCyan}12` }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = `${B.neonCyan}20`; e.currentTarget.style.background = `${B.neonCyan}08` }}
                >
                  <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 9, color: B.neonCyan, flexShrink: 0 }}>→</span>
                  <span style={{ fontFamily: "'Syne', sans-serif", fontSize: 12, color: B.smoke }}>
                    {SECTION_LABELS[s.section] || s.section}
                  </span>
                  <span style={{ marginLeft: 'auto', fontFamily: "'Space Mono', monospace", fontSize: 7, color: '#333', whiteSpace: 'nowrap' }}>
                    {Math.round(s.duration / 1000)}s
                  </span>
                </a>
              ))}
            </div>
          )}

          {/* Fallback CTA when no data yet */}
          {spinsLeft === 0 && topSections.length === 0 && (
            <a href="#tickets" onClick={dismiss} style={{
              display: 'block', textAlign: 'center',
              padding: '11px 14px',
              background: B.amber, color: B.black,
              fontFamily: "'Space Mono', monospace", fontSize: 8, fontWeight: 700, letterSpacing: '0.18em',
              textDecoration: 'none', borderRadius: 4,
            }}>GET YOUR TICKET →</a>
          )}

        </div>
      </div>
    </>
  )
}
