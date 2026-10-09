/**
 * Sneakers Fest '26 — Global Command HUD & Mini-Navigator (Level 3 Ecosystem)
 * 
 * Persistent high-tech Lagos Noir floating command bar docked at the bottom of
 * the screen. Coordinates real-time situational awareness:
 * - Live Muri Okunola acoustic decibels
 * - Live drop radar & countdown
 * - Real-time attendee XP & level progression
 * - Quick teleportation to active 3D zones
 * - 1-tap Turnstile Pass simulator launch
 * - Instant Street AI Concierge trigger
 */

import { useState, useEffect } from 'react'
import { B } from '../tokens'
import {
  useFestivalState,
  playFestivalSound,
  dispatchFestivalAction,
  FESTIVAL_ACTIONS,
} from '../framework/festivalFramework'
import PassSimulator from './PassSimulator'

export default function FestivalHUD() {
  const [state, dispatch] = useFestivalState()
  const [minimized, setMinimized] = useState(false)
  const [showTeleport, setShowTeleport] = useState(false)
  const [showPassModal, setShowPassModal] = useState(false)
  const [dropTimer, setDropTimer] = useState(state.telemetry?.dropSecondsLeft || 1845)

  // Decrement drop timer locally for live urgency
  useEffect(() => {
    const t = setInterval(() => {
      setDropTimer(prev => (prev > 0 ? prev - 1 : 3600))
    }, 1000)
    return () => clearInterval(t)
  }, [])

  // Check if HUD tab was asked to open pass modal
  useEffect(() => {
    if (state.hud?.activeTab === 'pass') {
      setShowPassModal(true)
    }
  }, [state.hud?.activeTab])

  const formatTimer = (sec) => {
    const m = Math.floor(sec / 60)
    const s = sec % 60
    return `${m}:${s < 10 ? '0' : ''}${s}`
  }

  const teleportToZone = (target) => {
    playFestivalSound('zone_click')
    const zoneId = typeof target === 'object' ? target.id : target
    const sectionId = typeof target === 'object' ? target.section : target
    dispatch(FESTIVAL_ACTIONS.TELEMETRY_ZONE_FOCUS, { zone: zoneId })
    setShowTeleport(false)
    const el = document.getElementById(sectionId) || document.getElementById('venue')
    if (el) el.scrollIntoView({ behavior: 'smooth' })
  }

  const openAIChat = () => {
    playFestivalSound('zone_click')
    window.dispatchEvent(new CustomEvent('sf26:open_ai_chat', { detail: { prompt: "What's the hottest drop right now at Muri Okunola Park?" } }))
  }

  return (
    <>
      {showPassModal && (
        <PassSimulator
          onClose={() => {
            setShowPassModal(false)
            dispatch(FESTIVAL_ACTIONS.HUD_SET_TAB, { tab: 'status' })
          }}
        />
      )}

      {/* Floating HUD Bar */}
      <aside
        aria-label="Festival Command HUD"
        style={{
          position: 'fixed',
          bottom: 16,
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 1500,
          width: 'calc(100% - 32px)',
          maxWidth: 960,
          background: 'rgba(10,10,16,0.92)',
          backdropFilter: 'blur(20px) saturate(180%)',
          border: '1px solid rgba(255,255,255,0.12)',
          borderRadius: 16,
          boxShadow: '0 16px 40px rgba(0,0,0,0.8), 0 0 20px rgba(245,166,35,0.08)',
          transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
          overflow: 'visible',
        }}
      >
        {/* Top laser accent strip */}
        <div style={{ height: 2, background: `linear-gradient(90deg, ${B.amber}, ${B.neonCyan}, ${B.neonLime})`, borderRadius: '16px 16px 0 0' }} />

        {/* Teleport popover menu */}
        {showTeleport && (
          <div
            style={{
              position: 'absolute',
              bottom: 'calc(100% + 12px)',
              left: 20,
              background: 'rgba(14,14,22,0.98)',
              border: `1px solid ${B.neonCyan}40`,
              borderRadius: 12,
              padding: 12,
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: 8,
              width: 340,
              boxShadow: '0 12px 30px rgba(0,0,0,0.9)',
              animation: 'fadeUp 0.2s ease',
            }}
          >
            {[
              { id: 'stage', section: 'venue', label: '🎤 Main Stage', color: B.amber },
              { id: 'arena', section: 'fitcheck-arena', label: '⚔️ Fit Battle Arena', color: B.neonMagenta },
              { id: 'lsi', section: 'lagos-sole-index', label: '📈 Lagos Sole Index', color: B.neonLime },
              { id: 'heist', section: 'grail-heist', label: '🏆 Grail Heist Quest', color: B.amberGlow },
              { id: 'custom', section: 'colorizer', label: '🎨 Danfo Custom Lab', color: B.danfoYellow },
              { id: 'lsx', section: 'lsx', label: '🤝 LSX Trade Pit', color: B.neonCyan },
              { id: 'vip', section: 'venue', label: '💎 VIP Lounge', color: B.neonMagenta },
              { id: 'entrance', section: 'my-pass', label: '🎟️ Gate Turnstile', color: B.amber },
            ].map(z => (
              <button
                key={z.id}
                onClick={() => teleportToZone(z)}
                style={{
                  padding: '8px 10px',
                  borderRadius: 6,
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  color: z.color,
                  fontFamily: 'Space Mono,monospace',
                  fontSize: 9,
                  cursor: 'pointer',
                  textAlign: 'left',
                }}
              >
                {z.label}
              </button>
            ))}
          </div>
        )}

        {/* Main HUD Row */}
        <div
          style={{
            padding: minimized ? '6px 16px' : '10px 18px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 12,
            flexWrap: 'wrap',
          }}
        >
          {/* Section 1: Live Status & Atmosphere */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: B.neonLime, boxShadow: `0 0 10px ${B.neonLime}`, animation: 'liveNow 1.8s infinite' }} />
              <span style={{ fontFamily: 'Orbitron,monospace', fontSize: 9, fontWeight: 700, color: B.white, letterSpacing: 1.5 }}>
                SF'26 RADAR
              </span>
            </div>

            {!minimized && (
              <>
                <div style={{ display: 'none', mdDisplay: 'flex', alignItems: 'center', gap: 6 }}>
                  <span style={{ fontSize: 11 }}>🔊</span>
                  <span style={{ fontFamily: 'Space Mono,monospace', fontSize: 9, color: B.smoke }}>
                    {state.telemetry?.decibels || 94} dB
                  </span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'rgba(245,166,35,0.1)', padding: '3px 8px', borderRadius: 4, border: `1px solid ${B.amber}30` }}>
                  <span style={{ fontSize: 10 }}>⚡ NEXT DROP:</span>
                  <span style={{ fontFamily: 'Orbitron,monospace', fontSize: 9, color: B.amber, fontWeight: 700 }}>
                    {formatTimer(dropTimer)}
                  </span>
                </div>

                <a
                  href="#lagos-sole-index"
                  onClick={() => playFestivalSound('zone_click')}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 5,
                    background: 'rgba(0,240,255,0.08)',
                    padding: '3px 8px',
                    borderRadius: 4,
                    border: `1px solid ${B.neonCyan}40`,
                    textDecoration: 'none',
                    fontFamily: 'Space Mono,monospace',
                    fontSize: 9,
                    color: B.neonCyan,
                    fontWeight: 700
                  }}
                  title="View Lagos Sole Index Live Ticker"
                >
                  <span>📈 LSI ₦4.8M</span>
                  <span style={{ color: B.neonLime, fontSize: 8 }}>▲ +5.8%</span>
                </a>
              </>
            )}
          </div>

          {/* Section 2: Attendee Passport XP Level */}
          {!minimized && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontFamily: 'Space Mono,monospace', fontSize: 8, color: B.dim }}>
                  {state.gamification?.handle || '@attendee'}
                </div>
                <div style={{ fontFamily: 'Orbitron,monospace', fontSize: 9, color: B.neonCyan, fontWeight: 700 }}>
                  LVL {state.gamification?.level || 1} · {state.gamification?.xp || 0} XP
                </div>
              </div>
              <div style={{ width: 44, height: 4, background: 'rgba(255,255,255,0.1)', borderRadius: 2, overflow: 'hidden' }}>
                <div
                  style={{
                    width: `${Math.min(100, ((state.gamification?.xp || 0) % 150) / 1.5)}%`,
                    height: '100%',
                    background: B.neonCyan,
                  }}
                />
              </div>
            </div>
          )}

          {/* Section 3: Quick Action Dials */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <button
              onClick={() => setShowTeleport(!showTeleport)}
              style={{
                padding: '6px 12px',
                borderRadius: 6,
                background: showTeleport ? 'rgba(0,240,255,0.2)' : 'rgba(255,255,255,0.05)',
                border: `1px solid ${showTeleport ? B.neonCyan : 'rgba(255,255,255,0.1)'}`,
                color: showTeleport ? B.neonCyan : B.white,
                fontFamily: 'Space Mono,monospace',
                fontSize: 9,
                cursor: 'pointer',
              }}
              title="Teleport to Venue Zones"
            >
              🗺️ MAP
            </button>

            <a
              href="#fitcheck-arena"
              onClick={() => playFestivalSound('zone_click')}
              style={{
                padding: '6px 10px',
                borderRadius: 6,
                background: 'rgba(255,45,123,0.15)',
                border: `1px solid ${B.neonMagenta}`,
                color: B.neonMagenta,
                fontFamily: 'Orbitron,monospace',
                fontSize: 9,
                fontWeight: 700,
                cursor: 'pointer',
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                gap: 4
              }}
              title="Jump into Live 1v1 Street Clash"
            >
              ⚔️ 1v1 FIT
            </a>

            <button
              onClick={() => {
                playFestivalSound('zone_click')
                setShowPassModal(true)
              }}
              style={{
                padding: '6px 12px',
                borderRadius: 6,
                background: state.wallet?.checkedIn ? 'rgba(184,255,0,0.12)' : 'rgba(245,166,35,0.15)',
                border: `1px solid ${state.wallet?.checkedIn ? B.neonLime : B.amber}`,
                color: state.wallet?.checkedIn ? B.neonLime : B.amber,
                fontFamily: 'Orbitron,monospace',
                fontSize: 9,
                fontWeight: 700,
                cursor: 'pointer',
              }}
              title="Open Digital Pass & NFC Turnstile Simulator"
            >
              {state.wallet?.checkedIn ? '✓ PASS ACTIVE' : '🎫 MY PASS'}
            </button>

            <button
              onClick={openAIChat}
              style={{
                padding: '6px 12px',
                borderRadius: 6,
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.12)',
                color: B.white,
                fontFamily: 'Space Mono,monospace',
                fontSize: 9,
                cursor: 'pointer',
              }}
              title="Open Street AI Concierge"
            >
              🤖 SOLE AI
            </button>

            <button
              onClick={() => setMinimized(!minimized)}
              style={{
                background: 'none',
                border: 'none',
                color: B.dim,
                fontFamily: 'Space Mono,monospace',
                fontSize: 10,
                cursor: 'pointer',
                padding: '4px 6px',
              }}
              title={minimized ? 'Expand HUD' : 'Minimize HUD'}
            >
              {minimized ? '▲' : '▼'}
            </button>
          </div>
        </div>
      </aside>
    </>
  )
}
