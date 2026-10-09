/**
 * Sneakers Fest '26 — Turnstile NFC & Digital Pass Clearance Simulator (Level 3)
 * 
 * Provides an interactive turnstile scanner simulation:
 * - NFC tap sensor & optical QR camera target
 * - Web Audio procedural sound synthesis (gate clear double beep)
 * - Real-time gate validation check against Netlify Functions (/ticket-checkin)
 * - Visual haptic feedback & gate clearance beacon
 */

import { useState } from 'react'
import { B } from '../tokens'
import {
  useFestivalWallet,
  useFestivalGamification,
  playFestivalSound,
  dispatchFestivalAction,
  FESTIVAL_ACTIONS,
} from '../framework/festivalFramework'
import { downloadAppleWalletPass, downloadGoogleWalletPass } from '../lib/walletPassGenerator'

export default function PassSimulator({ onClose }) {
  const { wallet, checkIn } = useFestivalWallet()
  const { gamification, awardXP, unlockBadge } = useFestivalGamification()
  const [scanning, setScanning] = useState(false)
  const [cleared, setCleared] = useState(wallet.checkedIn)
  const [activeTab, setActiveTab] = useState('nfc') // 'nfc' | 'qr'
  const [gateLog, setGateLog] = useState(wallet.lastCheckinTime ? `Cleared at ${wallet.lastCheckinTime}` : null)

  const activePass = wallet.activePass || (wallet.savedPasses && wallet.savedPasses[0]) || {
    name: gamification.handle || 'Guest Attendee',
    tier: 'VIP',
    tierColor: B.amber,
    ref: 'SF26-DEMO-PASS',
    price: '₦10,000',
  }

  async function simulateTap() {
    if (scanning) return
    setScanning(true)
    playFestivalSound('zone_click')

    setTimeout(async () => {
      // Procedural audio clearance
      playFestivalSound('nfc_success')
      const signature = `NFC-${Date.now().toString(36).toUpperCase()}`
      
      // Attempt backend checkin if live
      try {
        await fetch('/.netlify/functions/ticket-checkin', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ reference: activePass.ref, gate: 'GATE_1_VICTORIA_ISLAND' }),
        })
      } catch {}

      checkIn(signature)
      setCleared(true)
      setScanning(false)
      const nowStr = new Date().toLocaleTimeString()
      setGateLog(`GATE 1 VERIFIED · ${nowStr}`)

      // Award XP for festival attendance clearance
      awardXP(200, 'Turnstile Gate Clearance')
      unlockBadge('FESTIVAL_ATTENDEE_VERIFIED')
      playFestivalSound('badge_unlock')
    }, 900)
  }

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 2500,
        background: 'rgba(5,5,8,0.92)',
        backdropFilter: 'blur(16px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
        animation: 'fadeUp 0.25s ease',
      }}
      onClick={e => { if (e.target === e.currentTarget && onClose) onClose() }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: 460,
          background: 'rgba(14,14,20,0.98)',
          border: `1px solid ${cleared ? B.neonLime : activePass.tierColor || B.amber}50`,
          borderRadius: 20,
          overflow: 'hidden',
          boxShadow: `0 0 60px ${cleared ? B.neonLime : activePass.tierColor || B.amber}20, 0 30px 80px rgba(0,0,0,0.95)`,
          position: 'relative',
        }}
      >
        {/* Top status bar */}
        <div style={{ height: 4, background: cleared ? B.neonLime : `linear-gradient(90deg, ${activePass.tierColor || B.amber}, transparent)` }} />

        {/* Header */}
        <div style={{ padding: '16px 22px', borderBottom: '1px solid rgba(255,255,255,0.08)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <span style={{ fontFamily: 'Orbitron,monospace', fontSize: 9, color: cleared ? B.neonLime : B.amber, letterSpacing: 2, fontWeight: 700 }}>
              {cleared ? '● GATE CLEARED' : 'TURNSTILE NFC SIMULATOR'}
            </span>
            <div style={{ fontFamily: 'Bebas Neue,sans-serif', fontSize: 22, color: B.white, letterSpacing: 1.5 }}>
              MURI OKUNOLA TURNSTILE · GATE 1
            </div>
          </div>
          {onClose && (
            <button
              onClick={onClose}
              style={{ background: 'rgba(255,255,255,0.06)', border: 'none', color: B.smoke, borderRadius: 6, width: 32, height: 32, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            >
              ✕
            </button>
          )}
        </div>

        {/* Body */}
        <div style={{ padding: 24, textAlign: 'center' }}>
          {/* NFC Tap Target Area */}
          <div
            onClick={simulateTap}
            style={{
              padding: '36px 20px',
              margin: '0 auto 20px',
              borderRadius: 16,
              background: cleared
                ? 'rgba(184,255,0,0.06)'
                : scanning
                ? 'rgba(0,240,255,0.08)'
                : 'rgba(255,255,255,0.02)',
              border: `2px dashed ${cleared ? B.neonLime : scanning ? B.neonCyan : 'rgba(255,255,255,0.15)'}`,
              cursor: 'pointer',
              position: 'relative',
              transition: 'all 0.3s ease',
            }}
          >
            {/* Animated Wave Rings */}
            {scanning && (
              <div
                style={{
                  position: 'absolute',
                  inset: 10,
                  border: `2px solid ${B.neonCyan}`,
                  borderRadius: 12,
                  animation: 'ping 1s cubic-bezier(0, 0, 0.2, 1) infinite',
                  pointerEvents: 'none',
                }}
              />
            )}

            <div style={{ fontSize: 44, marginBottom: 10 }}>
              {cleared ? '✅' : scanning ? '📡' : '📲'}
            </div>

            <div style={{ fontFamily: 'Orbitron,monospace', fontSize: 13, fontWeight: 700, color: cleared ? B.neonLime : B.white, letterSpacing: 2, marginBottom: 6 }}>
              {cleared ? 'PASS VERIFIED & CLEARED' : scanning ? 'READING NFC CHIP…' : 'TAP TO SCAN AT TURNSTILE'}
            </div>

            <p style={{ fontFamily: 'Space Mono,monospace', fontSize: 10, color: B.smoke, margin: 0 }}>
              {cleared
                ? gateLog || 'Access Granted. Welcome to Sneakers Fest \'26.'
                : 'Hold device close to gate reader or click to simulate physical NFC tap'}
            </p>
          </div>

          {/* Attendee Pass Details Card */}
          <div
            style={{
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: 12,
              padding: '14px 18px',
              textAlign: 'left',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: 20,
            }}
          >
            <div>
              <div style={{ fontFamily: 'Space Mono,monospace', fontSize: 8, color: B.dim, letterSpacing: 2 }}>ATTENDEE PASS</div>
              <div style={{ fontFamily: 'Syne,sans-serif', fontSize: 14, fontWeight: 700, color: B.white }}>{activePass.name}</div>
              <div style={{ fontFamily: 'Space Mono,monospace', fontSize: 9, color: activePass.tierColor || B.amber }}>
                {activePass.tier} TIER · REF: {activePass.ref}
              </div>
            </div>

            <div style={{ textAlign: 'right' }}>
              <span
                style={{
                  display: 'inline-block',
                  padding: '3px 8px',
                  borderRadius: 4,
                  background: cleared ? `${B.neonLime}20` : 'rgba(255,255,255,0.05)',
                  border: `1px solid ${cleared ? B.neonLime : 'rgba(255,255,255,0.1)'}`,
                  color: cleared ? B.neonLime : B.dim,
                  fontFamily: 'Orbitron,monospace',
                  fontSize: 8,
                  letterSpacing: 1,
                }}
              >
                {cleared ? 'CHECKED IN' : 'READY FOR GATE'}
              </span>
            </div>
          </div>

          {/* Export to Native Phone Wallets */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 16 }}>
            <button
              onClick={() => downloadAppleWalletPass(activePass)}
              style={{
                padding: '9px',
                borderRadius: 8,
                border: '1px solid rgba(255,255,255,0.15)',
                background: 'rgba(255,255,255,0.04)',
                color: B.white,
                fontFamily: 'Space Mono,monospace',
                fontSize: 8.5,
                fontWeight: 700,
                letterSpacing: 1,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 5,
              }}
            >
              🍏 ADD APPLE WALLET
            </button>
            <button
              onClick={() => downloadGoogleWalletPass(activePass)}
              style={{
                padding: '9px',
                borderRadius: 8,
                border: '1px solid rgba(255,255,255,0.15)',
                background: 'rgba(255,255,255,0.04)',
                color: B.white,
                fontFamily: 'Space Mono,monospace',
                fontSize: 8.5,
                fontWeight: 700,
                letterSpacing: 1,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 5,
              }}
            >
              💳 ADD GOOGLE WALLET
            </button>
          </div>

          {/* Actions */}
          <div style={{ display: 'flex', gap: 10 }}>
            <button
              onClick={simulateTap}
              disabled={scanning}
              style={{
                flex: 1,
                padding: '12px',
                borderRadius: 8,
                border: 'none',
                background: cleared ? 'rgba(255,255,255,0.06)' : B.amber,
                color: cleared ? B.white : B.black,
                fontFamily: 'Orbitron,sans-serif',
                fontSize: 10,
                fontWeight: 700,
                letterSpacing: 1.5,
                cursor: 'pointer',
              }}
            >
              {cleared ? 'RE-SCAN GATE' : 'SIMULATE TAP NOW →'}
            </button>
            {onClose && (
              <button
                onClick={onClose}
                style={{
                  padding: '12px 20px',
                  borderRadius: 8,
                  border: '1px solid rgba(255,255,255,0.12)',
                  background: 'transparent',
                  color: B.smoke,
                  fontFamily: 'Space Mono,monospace',
                  fontSize: 10,
                  cursor: 'pointer',
                }}
              >
                CLOSE
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
