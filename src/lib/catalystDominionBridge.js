// src/lib/catalystDominionBridge.js
// Cross-domain state & SSO synchronization bridge between:
// 1. https://sneakers-fest-official-55.netlify.app (Sneakers Fest '26)
// 2. https://catalyst-awakening.netlify.app (Catalyst Awakening Comic)
// 3. https://catalyst-world.netlify.app (Catalyst World Master Portal)

const TRUSTED_DOMINIONS = [
  'https://sneakers-fest-official-55.netlify.app',
  'https://catalyst-awakening.netlify.app',
  'https://catalyst-world.netlify.app',
  'http://localhost:5173',
  'http://localhost:3000',
  'http://localhost:8080'
]

const STORAGE_KEY = 'catalyst_dominion_state'

export const CatalystDominionBridge = {
  getState() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (raw) return JSON.parse(raw)
    } catch {}
    // Default guest passport
    return {
      passportId: 'CAT-' + Math.random().toString(36).substring(2, 8).toUpperCase(),
      xp: parseInt(localStorage.getItem('eko_fest_xp') || '250', 10),
      rank: 'Street Pioneer',
      comicCollector: localStorage.getItem('cat_awk_issue1_owned') === 'true',
      ticketTier: localStorage.getItem('sf26_pass_tier') || 'General Admission',
      venue: 'Freedom Park, CMS, Lagos Island',
      badges: ['Pioneer Dec 12'],
      lastSync: Date.now()
    }
  },

  saveState(state) {
    try {
      const merged = { ...this.getState(), ...state, lastSync: Date.now() }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(merged))
      if (merged.xp) localStorage.setItem('eko_fest_xp', String(merged.xp))
      return merged
    } catch (e) {
      console.warn('[DominionBridge] save failed:', e)
      return state
    }
  },

  claimComicCollectorPass() {
    const current = this.getState()
    const updated = this.saveState({
      comicCollector: true,
      xp: (current.xp || 250) + 500,
      badges: Array.from(new Set([...(current.badges || []), 'Awakened Collector', 'Voltage Surge']))
    })
    this.broadcast(updated)
    return updated
  },

  broadcast(state) {
    const payload = {
      type: 'CATALYST_DOMINION_SYNC',
      payload: state || this.getState()
    }
    // Post to all active windows / parent if embedded
    if (window.parent && window.parent !== window) {
      window.parent.postMessage(payload, '*')
    }
    // Also post to opener if launched from master portal
    if (window.opener) {
      window.opener.postMessage(payload, '*')
    }
  },

  initListener(onUpdate) {
    window.addEventListener('message', (event) => {
      // Validate origin against trusted mesh
      const isTrusted = TRUSTED_DOMINIONS.some(origin => event.origin.startsWith(origin)) || event.origin === window.location.origin
      if (!isTrusted) return

      if (event.data && event.data.type === 'CATALYST_DOMINION_SYNC') {
        const incoming = event.data.payload
        if (incoming && incoming.passportId) {
          const merged = CatalystDominionBridge.saveState(incoming)
          if (typeof onUpdate === 'function') onUpdate(merged)
        }
      }
    })
    // Announce presence
    this.broadcast()
  }
}

// Auto-initialize when loaded
if (typeof window !== 'undefined') {
  window.CatalystDominionBridge = CatalystDominionBridge
}
