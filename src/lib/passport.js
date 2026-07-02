const ANON_KEY = 'sf26_passport'
const EVENT = 'sf26:xp'

let _userEmail = null

export function setPassportUser(email) {
  _userEmail = email || null
  if (_userEmail) {
    const userKey = `sf26_passport_${_userEmail}`
    try {
      if (!localStorage.getItem(userKey) && localStorage.getItem(ANON_KEY)) {
        localStorage.setItem(userKey, localStorage.getItem(ANON_KEY))
      }
    } catch { /* ignore */ }
  }
}

function getKey() {
  return _userEmail ? `sf26_passport_${_userEmail}` : ANON_KEY
}

export const TIERS = [
  { name: 'Rookie',         min: 0,    color: '#8A8A8A' },
  { name: 'Hypebeast',      min: 200,  color: '#00F0FF' },
  { name: 'Collector',      min: 600,  color: '#F5A623' },
  { name: 'Sole Legend',    min: 1500, color: '#FF2D7B' },
  { name: 'Catalyst Elite', min: 3000, color: '#B8FF00' },
]

export const XP_VALUES = {
  miniPeek: 20,
  quickTask: 50,
  spinLose: 15,
  spinWin: 150,
  contribution: 100,
  bigCommitment: 200,
  triviaPerCorrect: 100,
  triviaQuestions: 10,
  engagementBonus: 75,
  engagementTarget: 3,
  memoryMatch: 80,
  soledleWin: 120,
  vote: 10,
  voteDailyCap: 10,
  bingoLine: 60,
  bingoFull: 300,
  easterEgg: 40,
  referralXP: 100,
  referralPurchaseBonus: 250,
}

export function triviaStreakMultiplier(streak) {
  return streak >= 5 ? 3 : streak >= 3 ? 2 : 1
}

export const TRIVIA_MAX_XP = (() => {
  let total = 0, streak = 0
  for (let i = 0; i < XP_VALUES.triviaQuestions; i++) {
    streak += 1
    total += XP_VALUES.triviaPerCorrect * triviaStreakMultiplier(streak)
  }
  return total
})()

export const LEVEL_XP_STEP = 150
export const MAX_LEVEL = 50

export function getLevel(xp) {
  const level = Math.min(MAX_LEVEL, 1 + Math.floor(xp / LEVEL_XP_STEP))
  const floor = (level - 1) * LEVEL_XP_STEP
  const ceil = level * LEVEL_XP_STEP
  const pct = level >= MAX_LEVEL ? 100 : ((xp - floor) / (ceil - floor)) * 100
  return { level, pct, xpToNext: level >= MAX_LEVEL ? 0 : ceil - xp }
}

export const GRAND_PRIZE_RANK = 5

function read() {
  try { return JSON.parse(localStorage.getItem(getKey())) || { xp: 0, badges: [], log: [] } }
  catch { return { xp: 0, badges: [], log: [] } }
}

function write(state, meta = {}) {
  localStorage.setItem(getKey(), JSON.stringify(state))
  window.dispatchEvent(new CustomEvent(EVENT, { detail: { ...state, ...meta } }))
}

function backfill(state) {
  if (state.backfilled) return state
  try {
    const entries = JSON.parse(localStorage.getItem('sf26_raffle_entries') || '{}')
    const rafflePts = Object.values(entries).reduce((s, e) => s + (e.packCount || 1) * XP_VALUES.quickTask, 0)
    const gallery = JSON.parse(localStorage.getItem('sf26_gallery') || '[]')
    const galPts = gallery.length * XP_VALUES.contribution
    const bids = JSON.parse(localStorage.getItem('sf26_museum_bids') || '{}')
    const bidPts = Object.values(bids).filter(b => b > 0).length * XP_VALUES.bigCommitment
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
  const prevLevel = getLevel(state.xp).level

  state.xp += amount
  state.log = [...(state.log || []), { amount, source, at: Date.now() }].slice(-50)
  if (badge && !state.badges.includes(badge)) state.badges = [...state.badges, badge]

  const today = new Date().toISOString().slice(0, 10)
  if (state.dailyEngagement?.date !== today) {
    state.dailyEngagement = { date: today, sources: [] }
  }
  if (source && !state.dailyEngagement.sources.includes(source)) {
    state.dailyEngagement = { ...state.dailyEngagement, sources: [...state.dailyEngagement.sources, source] }
  }

  let bonusAwarded = false
  const comboBadge = `combo-${today}`
  if (state.dailyEngagement.sources.length >= XP_VALUES.engagementTarget && !state.badges.includes(comboBadge)) {
    state.xp += XP_VALUES.engagementBonus
    state.badges = [...state.badges, comboBadge]
    bonusAwarded = true
  }

  const newLevel = getLevel(state.xp).level
  const leveledUp = newLevel > prevLevel

  write(state, { leveledUp, newLevel, bonusAwarded })
  return state
}

export function hasBadge(badge) { return getPassport().badges.includes(badge) }

export function subscribe(cb) {
  const fn = e => cb(e.detail)
  window.addEventListener(EVENT, fn)
  return () => window.removeEventListener(EVENT, fn)
}
