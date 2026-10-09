/**
 * Sneakers Fest '26 — Unified Architectural Framework (Level 1 Foundation)
 * 
 * Provides the shared state engine, typed event bus, cross-tab synchronization,
 * offline-first persistence, and real-time audio/telemetry synthesis for all
 * festival modules.
 * 
 * Acts as the baseline contract and foundation for:
 * - Level 2: Interactive Operational Intelligence Engine
 * - Level 3: Autonomous Hyper-Experience & Festival Command HUD Ecosystem
 */

import { useState, useEffect, useCallback } from 'react'

// ==========================================
// 1. TYPED EVENT CONSTANTS & ACTION PROTOCOL
// ==========================================
export const FESTIVAL_ACTIONS = {
  // Wallet & Ticketing
  WALLET_SET_ACTIVE_PASS: 'FESTIVAL:WALLET_SET_ACTIVE_PASS',
  WALLET_TICKET_PURCHASED: 'FESTIVAL:WALLET_TICKET_PURCHASED',
  WALLET_TICKET_CHECKIN: 'FESTIVAL:WALLET_TICKET_CHECKIN',
  WALLET_TOGGLE_SANDBOX: 'FESTIVAL:WALLET_TOGGLE_SANDBOX',

  // Telemetry & Venue
  TELEMETRY_ZONE_FOCUS: 'FESTIVAL:TELEMETRY_ZONE_FOCUS',
  TELEMETRY_SOUND_UPDATE: 'FESTIVAL:TELEMETRY_SOUND_UPDATE',
  TELEMETRY_TRIGGER_DROP: 'FESTIVAL:TELEMETRY_TRIGGER_DROP',

  // Gamification & Quests
  GAMIFICATION_XP_EARNED: 'FESTIVAL:GAMIFICATION_XP_EARNED',
  GAMIFICATION_BADGE_UNLOCKED: 'FESTIVAL:GAMIFICATION_BADGE_UNLOCKED',
  GAMIFICATION_SET_HANDLE: 'FESTIVAL:GAMIFICATION_SET_HANDLE',

  // Vendor Operations
  VENDOR_SET_ACTIVE: 'FESTIVAL:VENDOR_SET_ACTIVE',
  VENDOR_STATUS_TRANSITION: 'FESTIVAL:VENDOR_STATUS_TRANSITION',
  VENDOR_BOOTH_ASSIGNED: 'FESTIVAL:VENDOR_BOOTH_ASSIGNED',

  // HUD & Autonomous AI Concierge
  HUD_TOGGLE: 'FESTIVAL:HUD_TOGGLE',
  HUD_SET_TAB: 'FESTIVAL:HUD_SET_TAB',
  AI_CONCIERGE_OPEN: 'FESTIVAL:AI_CONCIERGE_OPEN',
  AI_CONCIERGE_ACTION: 'FESTIVAL:AI_CONCIERGE_ACTION',

  // Level 5 Integrations: LSI, FitCheck, Customizer & Heist
  LSI_ASSET_TRACKED: 'FESTIVAL:LSI_ASSET_TRACKED',
  FITCHECK_VOTE_CAST: 'FESTIVAL:FITCHECK_VOTE_CAST',
  CUSTOM_SHOE_MINTED: 'FESTIVAL:CUSTOM_SHOE_MINTED',
  GRAIL_HEIST_CHECKPOINT: 'FESTIVAL:GRAIL_HEIST_CHECKPOINT',
}

// Storage Keys
const STORAGE_PREFIX = 'sf26:framework:'
const STATE_STORAGE_KEY = `${STORAGE_PREFIX}global_state`
const CHANNEL_NAME = 'sf26_festival_channel'

// ==========================================
// 2. CANONICAL INITIAL STATE
// ==========================================
export const INITIAL_FRAMEWORK_STATE = {
  telemetry: {
    activeZone: 'STAGE',
    decibels: 94,
    crowdDensity: 'OPTIMAL (78%)',
    stagePerformer: 'DJ Obi — Live Amapiano & Afro-House Set',
    nextDrop: 'Travis Scott Jumpman Jack "Mocha" · Zone A',
    dropSecondsLeft: 1845,
    selectedRoute: null,
  },
  wallet: {
    isSandbox: true,
    activePass: null,
    savedPasses: [],
    checkedIn: false,
    nfcSignature: null,
    lastCheckinTime: null,
  },
  gamification: {
    handle: '@catalyst_sole',
    xp: 680,
    level: 5,
    streak: 3,
    badges: ['MAINLAND_ORIGIN', 'GRAIL_HUNTER', 'LAGOS_PASSPORT'],
    activeQuest: 'Locate 3 Secret Zones on 3D Venue Map',
    recentReward: null,
  },
  vendor: {
    activeVendorId: 'SF26-001',
    status: 'approved',
    assignedBooth: 'B-04',
    tier: 'Platinum Grail Vault',
    recentAction: null,
  },
  hud: {
    isOpen: true,
    activeTab: 'status', // 'status' | 'pass' | 'radar' | 'ai'
    soundActive: true,
  },
}

// ==========================================
// 3. PERSISTENCE & BROADCAST EVENT BUS
// ==========================================
let cachedState = null

function loadPersistedState() {
  if (cachedState) return cachedState
  try {
    const raw = localStorage.getItem(STATE_STORAGE_KEY)
    if (raw) {
      const parsed = JSON.parse(raw)
      cachedState = {
        ...INITIAL_FRAMEWORK_STATE,
        ...parsed,
        telemetry: { ...INITIAL_FRAMEWORK_STATE.telemetry, ...(parsed.telemetry || {}) },
        wallet: { ...INITIAL_FRAMEWORK_STATE.wallet, ...(parsed.wallet || {}) },
        gamification: { ...INITIAL_FRAMEWORK_STATE.gamification, ...(parsed.gamification || {}) },
        vendor: { ...INITIAL_FRAMEWORK_STATE.vendor, ...(parsed.vendor || {}) },
        hud: { ...INITIAL_FRAMEWORK_STATE.hud, ...(parsed.hud || {}) },
      }
      return cachedState
    }
  } catch {
    // Ignore storage parse error
  }
  cachedState = { ...INITIAL_FRAMEWORK_STATE }
  return cachedState
}

function saveState(state) {
  cachedState = state
  try {
    localStorage.setItem(STATE_STORAGE_KEY, JSON.stringify(state))
  } catch {
    // Storage full or sandboxed
  }
}

// Setup Broadcast Channel with Window CustomEvent fallback
let broadcastChannel = null
if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
  try {
    broadcastChannel = new BroadcastChannel(CHANNEL_NAME)
  } catch {
    broadcastChannel = null
  }
}

// ==========================================
// 4. ACTION DISPATCHER & STATE REDUCER
// ==========================================
export function dispatchFestivalAction(type, payload = {}) {
  const currentState = loadPersistedState()
  let nextState = { ...currentState }

  switch (type) {
    case FESTIVAL_ACTIONS.TELEMETRY_ZONE_FOCUS:
      nextState.telemetry = {
        ...nextState.telemetry,
        activeZone: payload.zone || nextState.telemetry.activeZone,
        selectedRoute: payload.route !== undefined ? payload.route : nextState.telemetry.selectedRoute,
        decibels: payload.decibels || nextState.telemetry.decibels,
      }
      break

    case FESTIVAL_ACTIONS.TELEMETRY_SOUND_UPDATE:
      nextState.telemetry = {
        ...nextState.telemetry,
        decibels: payload.decibels || nextState.telemetry.decibels,
      }
      break

    case FESTIVAL_ACTIONS.WALLET_SET_ACTIVE_PASS:
      nextState.wallet = {
        ...nextState.wallet,
        activePass: payload.pass,
      }
      break

    case FESTIVAL_ACTIONS.WALLET_TICKET_PURCHASED: {
      const newPasses = [payload.pass, ...(nextState.wallet.savedPasses || [])]
      nextState.wallet = {
        ...nextState.wallet,
        activePass: payload.pass,
        savedPasses: newPasses,
      }
      // Award XP for ticket purchase
      nextState.gamification = {
        ...nextState.gamification,
        xp: (nextState.gamification.xp || 0) + 300,
        recentReward: '+300 XP (Ticket Secured)',
      }
      break
    }

    case FESTIVAL_ACTIONS.WALLET_TICKET_CHECKIN:
      nextState.wallet = {
        ...nextState.wallet,
        checkedIn: true,
        nfcSignature: payload.signature || `NFC-${Date.now().toString(36).toUpperCase()}`,
        lastCheckinTime: new Date().toLocaleTimeString(),
      }
      break

    case FESTIVAL_ACTIONS.WALLET_TOGGLE_SANDBOX:
      nextState.wallet = {
        ...nextState.wallet,
        isSandbox: payload.isSandbox !== undefined ? payload.isSandbox : !nextState.wallet.isSandbox,
      }
      break

    case FESTIVAL_ACTIONS.GAMIFICATION_XP_EARNED: {
      const gained = payload.xp || 50
      const newXp = (nextState.gamification.xp || 0) + gained
      const newLevel = Math.max(1, Math.floor(newXp / 150) + 1)
      nextState.gamification = {
        ...nextState.gamification,
        xp: newXp,
        level: newLevel,
        recentReward: `+${gained} XP (${payload.reason || 'Festival Action'})`,
      }
      // Dual-sync with classic passport storage for instant cross-widget reactivity
      if (typeof window !== 'undefined') {
        try {
          const pass = JSON.parse(localStorage.getItem('sf26_passport') || '{"xp":0,"badges":[],"log":[]}')
          pass.xp = (pass.xp || 0) + gained
          pass.log = [...(pass.log || []), { amount: gained, source: payload.reason || 'Festival Action', at: Date.now() }].slice(-50)
          localStorage.setItem('sf26_passport', JSON.stringify(pass))
          window.dispatchEvent(new CustomEvent('sf26:xp', { detail: { ...pass, leveledUp: newLevel > (nextState.gamification.level || 1) } }))
        } catch {}
      }
      break
    }

    case FESTIVAL_ACTIONS.GAMIFICATION_BADGE_UNLOCKED: {
      const currentBadges = nextState.gamification.badges || []
      if (!currentBadges.includes(payload.badge)) {
        nextState.gamification = {
          ...nextState.gamification,
          badges: [...currentBadges, payload.badge],
          recentReward: `UNLOCKED: ${payload.badge}`,
        }
        if (typeof window !== 'undefined') {
          try {
            const pass = JSON.parse(localStorage.getItem('sf26_passport') || '{"xp":0,"badges":[],"log":[]}')
            if (!pass.badges.includes(payload.badge)) {
              pass.badges = [...pass.badges, payload.badge]
              localStorage.setItem('sf26_passport', JSON.stringify(pass))
              window.dispatchEvent(new CustomEvent('sf26:xp', { detail: pass }))
            }
          } catch {}
        }
      }
      break
    }

    case FESTIVAL_ACTIONS.LSI_ASSET_TRACKED:
      nextState.gamification = {
        ...nextState.gamification,
        recentReward: `Tracked ${payload.symbol || 'Grail'} on LSI`,
      }
      break

    case FESTIVAL_ACTIONS.FITCHECK_VOTE_CAST:
      nextState.gamification = {
        ...nextState.gamification,
        recentReward: `Voted in 1v1 Street Clash`,
      }
      break

    case FESTIVAL_ACTIONS.CUSTOM_SHOE_MINTED:
      nextState.gamification = {
        ...nextState.gamification,
        recentReward: `Minted 1-of-1 ${payload.model || 'Danfo Custom'}`,
      }
      break

    case FESTIVAL_ACTIONS.GRAIL_HEIST_CHECKPOINT:
      nextState.gamification = {
        ...nextState.gamification,
        recentReward: `Checkpoint Reached: ${payload.checkpoint || 'Beacon'}`,
      }
      break

    case FESTIVAL_ACTIONS.GAMIFICATION_SET_HANDLE:
      nextState.gamification = {
        ...nextState.gamification,
        handle: payload.handle || nextState.gamification.handle,
      }
      break

    case FESTIVAL_ACTIONS.VENDOR_STATUS_TRANSITION:
      nextState.vendor = {
        ...nextState.vendor,
        status: payload.status || nextState.vendor.status,
        recentAction: payload.action || 'Status Transition',
      }
      break

    case FESTIVAL_ACTIONS.VENDOR_BOOTH_ASSIGNED:
      nextState.vendor = {
        ...nextState.vendor,
        assignedBooth: payload.booth || nextState.vendor.assignedBooth,
        recentAction: `Assigned Booth ${payload.booth}`,
      }
      break

    case FESTIVAL_ACTIONS.HUD_TOGGLE:
      nextState.hud = {
        ...nextState.hud,
        isOpen: payload.isOpen !== undefined ? payload.isOpen : !nextState.hud.isOpen,
      }
      break

    case FESTIVAL_ACTIONS.HUD_SET_TAB:
      nextState.hud = {
        ...nextState.hud,
        activeTab: payload.tab || 'status',
        isOpen: true,
      }
      break

    default:
      break
  }

  // Persist updated state
  saveState(nextState)

  // Broadcast to current window and other tabs
  if (typeof window !== 'undefined') {
    const eventDetail = { type, payload, state: nextState }
    window.dispatchEvent(new CustomEvent('sf26:framework:change', { detail: eventDetail }))

    if (broadcastChannel) {
      try {
        broadcastChannel.postMessage(eventDetail)
      } catch {
        // Broadcast failed
      }
    }
  }

  return nextState
}

// ==========================================
// 5. REACT HOOKS FOR LEVEL 2 & LEVEL 3
// ==========================================

/**
 * Universal Festival State Hook
 */
export function useFestivalState() {
  const [state, setState] = useState(() => loadPersistedState())

  useEffect(() => {
    const handleLocal = (e) => {
      if (e?.detail?.state) {
        setState(e.detail.state)
      }
    }

    const handleRemote = (e) => {
      if (e?.data?.state) {
        cachedState = e.data.state
        setState(e.data.state)
      }
    }

    window.addEventListener('sf26:framework:change', handleLocal)
    if (broadcastChannel) {
      broadcastChannel.addEventListener('message', handleRemote)
    }

    return () => {
      window.removeEventListener('sf26:framework:change', handleLocal)
      if (broadcastChannel) {
        broadcastChannel.removeEventListener('message', handleRemote)
      }
    }
  }, [])

  return [state, dispatchFestivalAction]
}

/**
 * Live Telemetry & Venue Hook
 */
export function useFestivalTelemetry() {
  const [state, dispatch] = useFestivalState()
  
  const setZone = useCallback((zone, route = null, decibels = null) => {
    dispatch(FESTIVAL_ACTIONS.TELEMETRY_ZONE_FOCUS, { zone, route, decibels })
  }, [dispatch])

  return {
    telemetry: state.telemetry,
    setZone,
    dispatch,
  }
}

/**
 * Digital Wallet & Tickets Hook
 */
export function useFestivalWallet() {
  const [state, dispatch] = useFestivalState()

  const setActivePass = useCallback((pass) => {
    dispatch(FESTIVAL_ACTIONS.WALLET_SET_ACTIVE_PASS, { pass })
  }, [dispatch])

  const checkIn = useCallback((signature = null) => {
    dispatch(FESTIVAL_ACTIONS.WALLET_TICKET_CHECKIN, { signature })
  }, [dispatch])

  const toggleSandbox = useCallback((val) => {
    dispatch(FESTIVAL_ACTIONS.WALLET_TOGGLE_SANDBOX, { isSandbox: val })
  }, [dispatch])

  return {
    wallet: state.wallet,
    setActivePass,
    checkIn,
    toggleSandbox,
    dispatch,
  }
}

/**
 * Gamification & XP Hook
 */
export function useFestivalGamification() {
  const [state, dispatch] = useFestivalState()

  const awardXP = useCallback((xp, reason = 'Festival Quest') => {
    dispatch(FESTIVAL_ACTIONS.GAMIFICATION_XP_EARNED, { xp, reason })
  }, [dispatch])

  const unlockBadge = useCallback((badge) => {
    dispatch(FESTIVAL_ACTIONS.GAMIFICATION_BADGE_UNLOCKED, { badge })
  }, [dispatch])

  const setHandle = useCallback((handle) => {
    dispatch(FESTIVAL_ACTIONS.GAMIFICATION_SET_HANDLE, { handle })
  }, [dispatch])

  return {
    gamification: state.gamification,
    awardXP,
    unlockBadge,
    setHandle,
    dispatch,
  }
}

/**
 * Vendor Logistics Hook
 */
export function useFestivalVendor() {
  const [state, dispatch] = useFestivalState()

  const transitionStatus = useCallback((status, action = null) => {
    dispatch(FESTIVAL_ACTIONS.VENDOR_STATUS_TRANSITION, { status, action })
  }, [dispatch])

  const assignBooth = useCallback((booth) => {
    dispatch(FESTIVAL_ACTIONS.VENDOR_BOOTH_ASSIGNED, { booth })
  }, [dispatch])

  return {
    vendor: state.vendor,
    transitionStatus,
    assignBooth,
    dispatch,
  }
}

// ==========================================
// 6. PROCEDURAL WEB AUDIO SYNTHESIZER
// ==========================================
/**
 * Zero-asset real-time sound effects engine for micro-interactions,
 * turnstile clearance, NFC haptics, level-up chimes, and grail alerts.
 */
export function playFestivalSound(type = 'chime') {
  if (typeof window === 'undefined' || !window.AudioContext && !window.webkitAudioContext) return

  try {
    const AudioCtx = window.AudioContext || window.webkitAudioContext
    const ctx = new AudioCtx()

    const now = ctx.currentTime
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()

    osc.connect(gain)
    gain.connect(ctx.destination)

    switch (type) {
      case 'nfc_success':
        // High crisp double beep
        osc.type = 'sine'
        osc.frequency.setValueAtTime(880, now)
        osc.frequency.setValueAtTime(1320, now + 0.08)
        gain.gain.setValueAtTime(0.18, now)
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25)
        osc.start(now)
        osc.stop(now + 0.25)
        break

      case 'xp_gain':
        // Ascending harmonic sweep
        osc.type = 'triangle'
        osc.frequency.setValueAtTime(440, now)
        osc.frequency.exponentialRampToValueAtTime(880, now + 0.15)
        gain.gain.setValueAtTime(0.15, now)
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2)
        osc.start(now)
        osc.stop(now + 0.2)
        break

      case 'badge_unlock':
        // Tri-tone celebratory chord
        osc.type = 'sine'
        osc.frequency.setValueAtTime(523.25, now) // C5
        osc.frequency.setValueAtTime(659.25, now + 0.08) // E5
        osc.frequency.setValueAtTime(783.99, now + 0.16) // G5
        gain.gain.setValueAtTime(0.2, now)
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4)
        osc.start(now)
        osc.stop(now + 0.4)
        break

      case 'zone_click':
        // Low subtle futuristic tick
        osc.type = 'sine'
        osc.frequency.setValueAtTime(220, now)
        gain.gain.setValueAtTime(0.1, now)
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05)
        osc.start(now)
        osc.stop(now + 0.05)
        break

      default:
        // Soft chime
        osc.type = 'sine'
        osc.frequency.setValueAtTime(600, now)
        gain.gain.setValueAtTime(0.1, now)
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15)
        osc.start(now)
        osc.stop(now + 0.15)
    }
  } catch {
    // Audio context prevented or blocked by browser gesture policies
  }
}
