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

// Single source of truth for every XP reward on the site. Sections import
// from here instead of hardcoding numbers so the economy stays consistent
// and the Passport's "Ways to Earn" list never drifts out of sync.
export const XP_VALUES = {
  miniPeek: 20,          // Mystery Drop hover/peek
  quickTask: 50,          // Badge Maker, Outfit Matcher, Raffle entry
  spinLose: 15,           // Spin to Win — "try again" consolation
  spinWin: 150,           // Spin to Win — real prize
  contribution: 100,      // Community Wall post, Gallery upload
  bigCommitment: 200,     // Museum bid
  triviaPerCorrect: 100,  // Sneaker Trivia — base XP per correct answer
  triviaQuestions: 10,    // Sneaker Trivia — total questions per run
  engagementBonus: 75,    // Daily combo bonus — playing multiple different games in one day
  engagementTarget: 3,    // Distinct activities needed in a day to trigger the combo bonus
  memoryMatch: 80,        // Sole Memory — base reward for clearing the board (scales down with extra moves)
  soledleWin: 120,        // Soledle — base reward for solving the daily puzzle (scales down with guesses used)
  vote: 10,               // Crew Vote-Off — XP per vote, capped per day
  voteDailyCap: 10,       // Crew Vote-Off — max XP-earning votes per day
  bingoLine: 60,          // Sneaker Bingo — XP per completed row/column/diagonal
  bingoFull: 300,         // Sneaker Bingo — bonus for completing the full card
}

// Sneaker Trivia awards a streak multiplier on top of the per-question base.
export function triviaStreakMultiplier(streak) {
  return streak >= 5 ? 3 : streak >= 3 ? 2 : 1
}

// Max XP obtainable from a single perfect Sneaker Trivia run (all correct, streak maxed).
export const TRIVIA_MAX_XP = (() => {
  let total = 0, streak = 0
  for (let i = 0; i < XP_VALUES.triviaQuestions; i++) {
    streak += 1
    total += XP_VALUES.triviaPerCorrect * triviaStreakMultiplier(streak)
  }
  return total
})()

// ── Card leveling — a granular, game-style progression layered on top of tiers.
// Tiers are the "rank category" (Rookie → Catalyst Elite); Levels are the
// number that climbs every LEVEL_XP_STEP XP, giving constant forward motion.
export const LEVEL_XP_STEP = 150
export const MAX_LEVEL = 50

export function getLevel(xp) {
  const level = Math.min(MAX_LEVEL, 1 + Math.floor(xp / LEVEL_XP_STEP))
  const floor = (level - 1) * LEVEL_XP_STEP
  const ceil = level * LEVEL_XP_STEP
  const pct = level >= MAX_LEVEL ? 100 : ((xp - floor) / (ceil - floor)) * 100
  return { level, pct, xpToNext: level >= MAX_LEVEL ? 0 : ceil - xp }
}

// The top N collectors by total XP win grand prizes at the event.
export const GRAND_PRIZE_RANK = 5

function read() {
  try { return JSON.parse(localStorage.getItem(KEY)) || { xp: 0, badges: [], log: [] } }
  catch { return { xp: 0, badges: [], log: [] } }
}

function write(state, meta = {}) {
  localStorage.setItem(KEY, JSON.stringify(state))
  window.dispatchEvent(new CustomEvent(EVENT, { detail: { ...state, ...meta } }))
}

// Pulls in XP from features that pre-date the passport so no history is lost.
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

  // Daily engagement combo — reward variety (different games/activities), not just grinding one.
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
