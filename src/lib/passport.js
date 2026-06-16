// Sneaker Passport — unified XP/tier system shared across all interactive sections
const KEY = 'sf26_passport'
const EVENT = 'sf26:xp'

export const TIERS = [
  { name: 'Rookie',         min: 0,    color: '#8A8A8A' },
  { name: 'Hypebeast',      min: 200,  color: '#00F0FF' },
  { name: 'Collector',      min: 600,  color: '#F5A623' },
  { name: 'Sole Legend',    min: 1500, color: '#FF2D7B' },
  { name: 'Catalyst Elite', min: 3000, color: '#B8FF00' },
]

function read() {
  try { return JSON.parse(localStorage.getItem(KEY)) || { xp: 0, badges: [], log: [] } }
  catch { return { xp: 0, badges: [], log: [] } }
}

function write(state) {
  localStorage.setItem(KEY, JSON.stringify(state))
  window.dispatchEvent(new CustomEvent(EVENT, { detail: state }))
}

// Pulls in XP from features that pre-date the passport so no history is lost.
function backfill(state) {
  if (state.backfilled) return state
  try {
    const entries = JSON.parse(localStorage.getItem('sf26_raffle_entries') || '{}')
    const rafflePts = Object.values(entries).reduce((s, e) => s + (e.packCount || 1) * 50, 0)
    const gallery = JSON.parse(localStorage.getItem('sf26_gallery') || '[]')
    const galPts = gallery.length * 100
    const bids = JSON.parse(localStorage.getItem('sf26_museum_bids') || '{}')
    const bidPts = Object.values(bids).filter(b => b > 0).length * 200
    state.xp += rafflePts + galPts + bidPts
    state.backfilled = true
  } catch { /* ignore */ }
  return state
}

export function getPassport() { return backfill(read()) }

export function getTier(xp) {
  let tier = TIERS[0]
  for (const t of TIERS) if (xp >= t.min) tier = t
  return tier
}

export function nextTier(xp) {
  return TIERS.find(t => t.min > xp) || null
}

export function addXP(amount, source, badge) {
  const state = getPassport()
  state.xp += amount
  state.log = [...(state.log || []), { amount, source, at: Date.now() }].slice(-50)
  if (badge && !state.badges.includes(badge)) state.badges = [...state.badges, badge]
  write(state)
  return state
}

export function hasBadge(badge) { return getPassport().badges.includes(badge) }

export function subscribe(cb) {
  const fn = e => cb(e.detail)
  window.addEventListener(EVENT, fn)
  return () => window.removeEventListener(EVENT, fn)
}
