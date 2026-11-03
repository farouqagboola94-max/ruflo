// src/components/RadioFreedomPlayer.jsx
// Floating retro-cybernetic soundclash radio player for Sneakers Fest '26 (Freedom Park, CMS)

import { useState, useEffect, useRef } from 'react'
import { B } from '../tokens'
import { playFestivalSound, dispatchFestivalAction, FESTIVAL_ACTIONS } from '../framework/festivalFramework'

const CHANNELS = [
  { id: 'afrobeats', name: 'AFROBEATS VANGUARD', freq: '89.9 FM', bpm: 120, desc: 'Lagos Island Street Anthems & High-Voltage Horns', color: B.amber },
  { id: 'alte',      name: 'ALTÉ SYNDICATE',     freq: '94.3 FM', bpm: 110, desc: 'Late Night Synthesizers & Low-Slung Alté Grooves', color: B.neonCyan },
  { id: 'drill',     name: 'LAGOS DRILL / GRIME', freq: '98.1 FM', bpm: 140, desc: '140 BPM High-Energy Broad Street Cyphers', color: B.neonMagenta },
  { id: 'amapiano',  name: 'AMAPIANO LOG DRUM',  freq: '104.5 FM', bpm: 115, desc: 'Heavy Deep Basslines & Shakers from Pretoria to CMS', color: B.neonLime },
]

export default function RadioFreedomPlayer() {
  const [isPlaying, setIsPlaying] = useState(false)
  const [activeChannel, setActiveChannel] = useState(CHANNELS[0])
  const [isMinimized, setIsMinimized] = useState(true)
  const [hasTunedIn, setHasTunedIn] = useState(false)
  const audioCtxRef = useRef(null)
  const timerRef = useRef(null)
  const [eqHeights, setEqHeights] = useState([40, 70, 95, 60, 80])

  // Synthesize rhythmic soundclash beats using Web Audio API (zero external assets needed)
  const playBeat = () => {
    try {
      if (!audioCtxRef.current) {
        audioCtxRef.current = new (window.AudioContext || window.webkitAudioContext)()
      }
      const ctx = audioCtxRef.current
      if (ctx.state === 'suspended') ctx.resume()

      // Bass Kick
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.type = activeChannel.id === 'amapiano' ? 'triangle' : 'sine'
      osc.frequency.setValueAtTime(activeChannel.id === 'drill' ? 140 : 110, ctx.currentTime)
      osc.frequency.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3)
      gain.gain.setValueAtTime(0.2, ctx.currentTime)
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3)
      osc.connect(gain)
      gain.connect(ctx.destination)
      osc.start()
      osc.stop(ctx.currentTime + 0.3)

      // Animate EQ bars
      setEqHeights([
        Math.floor(30 + Math.random() * 65),
        Math.floor(40 + Math.random() * 55),
        Math.floor(50 + Math.random() * 50),
        Math.floor(35 + Math.random() * 60),
        Math.floor(25 + Math.random() * 70),
      ])
    } catch {}
  }

  useEffect(() => {
    if (isPlaying) {
      const intervalMs = Math.round(60000 / activeChannel.bpm)
      timerRef.current = setInterval(playBeat, intervalMs)
    } else {
      if (timerRef.current) clearInterval(timerRef.current)
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current) }
  }, [isPlaying, activeChannel])

  const togglePlay = () => {
    if (!hasTunedIn) {
      setHasTunedIn(true)
      playFestivalSound('xp_gain')
      dispatchFestivalAction(FESTIVAL_ACTIONS.XP_EARNED, { amount: 25, reason: 'Radio Freedom 89.9 FM Tuned In' })
    }
    setIsPlaying(!isPlaying)
  }

  return (
    <div
      style={{
        position: 'fixed',
        bottom: 24,
        left: 24,
        zIndex: 1000,
        fontFamily: "'Space Mono', monospace",
      }}
    >
      {isMinimized ? (
        /* Compact Pill Button */
        <button
          onClick={() => setIsMinimized(false)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            padding: '8px 14px',
            background: 'rgba(10,10,15,0.92)',
            backdropFilter: 'blur(16px)',
            border: `1.5px solid ${activeChannel.color}60`,
            borderRadius: 100,
            color: B.white,
            cursor: 'pointer',
            boxShadow: `0 8px 32px rgba(0,0,0,0.8), 0 0 16px ${activeChannel.color}20`,
            transition: 'all 0.25s ease',
          }}
        >
          <span style={{ fontSize: 13 }}>📻</span>
          <span style={{ fontFamily: "'Orbitron', monospace", fontSize: 9, color: activeChannel.color, fontWeight: 700, letterSpacing: 1.5 }}>
            {activeChannel.freq} {isPlaying ? 'LIVE' : 'OFF AIR'}
          </span>
          {/* Animated EQ Bars */}
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 2, height: 12 }}>
            {eqHeights.slice(0, 3).map((h, i) => (
              <span
                key={i}
                style={{
                  width: 2,
                  height: isPlaying ? `${h}%` : '30%',
                  background: activeChannel.color,
                  borderRadius: 1,
                  transition: 'height 0.15s ease',
                }}
              />
            ))}
          </div>
        </button>
      ) : (
        /* Expanded Retro Cyberpunk Deck */
        <div
          style={{
            width: 310,
            background: 'rgba(12,12,18,0.96)',
            backdropFilter: 'blur(20px)',
            border: `1.5px solid ${activeChannel.color}50`,
            borderRadius: 14,
            padding: 16,
            boxShadow: `0 16px 48px rgba(0,0,0,0.9), 0 0 24px ${activeChannel.color}25`,
            animation: 'fadeIn 0.2s ease',
          }}
        >
          {/* Top Bar */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ fontSize: 14 }}>📻</span>
              <span style={{ fontFamily: "'Orbitron', monospace", fontSize: 10, color: activeChannel.color, fontWeight: 700, letterSpacing: 2 }}>
                RADIO FREEDOM
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ fontSize: 8, color: B.dim }}>BROAD ST CMS</span>
              <button
                onClick={() => setIsMinimized(true)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: B.smoke,
                  fontSize: 14,
                  cursor: 'pointer',
                  padding: '0 4px',
                }}
              >
                −
              </button>
            </div>
          </div>

          {/* Cassette / Frequency Window */}
          <div
            style={{
              padding: '10px 12px',
              background: '#07070a',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: 8,
              marginBottom: 12,
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
              <span style={{ fontFamily: "'Orbitron', monospace", fontSize: 11, color: activeChannel.color, fontWeight: 700 }}>
                {activeChannel.freq}
              </span>
              <span style={{ fontSize: 8, color: isPlaying ? B.neonLime : B.dim, fontWeight: 700 }}>
                {isPlaying ? '● ON AIR · SOUNDCLASH LIVE' : '○ STANDBY'}
              </span>
            </div>
            <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 18, color: B.white, letterSpacing: 1 }}>
              {activeChannel.name}
            </div>
            <div style={{ fontSize: 8, color: B.smoke, marginTop: 2, lineHeight: 1.4 }}>
              {activeChannel.desc}
            </div>

            {/* EQ Visualizer */}
            <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', height: 22, marginTop: 8, padding: '0 4px', background: 'rgba(255,255,255,0.02)', borderRadius: 4 }}>
              {eqHeights.map((h, i) => (
                <div
                  key={i}
                  style={{
                    width: 5,
                    height: isPlaying ? `${h}%` : '15%',
                    background: activeChannel.color,
                    borderRadius: 2,
                    transition: 'height 0.12s ease',
                  }}
                />
              ))}
            </div>
          </div>

          {/* Soundclash Channel Selector Pills */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 6, marginBottom: 14 }}>
            {CHANNELS.map(c => (
              <button
                key={c.id}
                onClick={() => {
                  setActiveChannel(c)
                  playFestivalSound('click')
                }}
                style={{
                  padding: '6px 8px',
                  borderRadius: 6,
                  border: `1px solid ${activeChannel.id === c.id ? c.color : 'rgba(255,255,255,0.08)'}`,
                  background: activeChannel.id === c.id ? `${c.color}20` : 'rgba(255,255,255,0.02)',
                  color: activeChannel.id === c.id ? c.color : B.smoke,
                  fontSize: 8,
                  fontWeight: 700,
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'all 0.2s',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}
              >
                {c.freq} {c.name.split(' ')[0]}
              </button>
            ))}
          </div>

          {/* Controls */}
          <div style={{ display: 'flex', gap: 8 }}>
            <button
              onClick={togglePlay}
              style={{
                flex: 1,
                padding: '9px',
                borderRadius: 8,
                border: 'none',
                background: isPlaying ? 'rgba(255,255,255,0.1)' : activeChannel.color,
                color: isPlaying ? B.white : B.black,
                fontFamily: "'Orbitron', monospace",
                fontSize: 10,
                fontWeight: 700,
                letterSpacing: 1.5,
                cursor: 'pointer',
                boxShadow: isPlaying ? 'none' : `0 0 16px ${activeChannel.color}40`,
                transition: 'all 0.2s',
              }}
            >
              {isPlaying ? '⏸ PAUSE BROADCAST' : '▶ TUNE IN (+25 XP)'}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
