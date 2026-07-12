// GET /.netlify/functions/leaderboard?limit=10
// Public endpoint — top waitlist members ranked by referral count.

import { ok, err, preflight } from './lib/cors.js'
import { listAll, Waitlist } from './lib/storage.js'

const TIERS = [
  { max: 100,      label: 'FOUNDING MEMBER', icon: '👑' },
  { max: 500,      label: 'INNER CIRCLE',    icon: '💎' },
  { max: 1000,     label: 'EARLY ACCESS',    icon: '⚡' },
  { max: Infinity, label: 'WAITLIST',        icon: '🎯' },
]

function getTier(pos) {
  return TIERS.find(t => pos <= t.max) || TIERS[TIERS.length - 1]
}

export const handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') return preflight()
  if (event.httpMethod !== 'GET') return err(405, 'Method not allowed')

  const limit = Math.min(50, Math.max(1, Number(event.queryStringParameters?.limit) || 10))

  const all = await listAll(Waitlist)

  const refCounts = {}
  all.forEach(m => {
    if (m.referredBy) refCounts[m.referredBy] = (refCounts[m.referredBy] || 0) + 1
  })

  const leaderboard = all
    .filter(m => m.refCode)
    .map(m => {
      const t = getTier(m.position)
      return {
        name:          m.name || m.email.split('@')[0],
        refCode:       m.refCode,
        position:      m.position,
        tier:          t.label,
        tierIcon:      t.icon,
        referralCount: refCounts[m.refCode] || 0,
      }
    })
    .sort((a, b) => b.referralCount - a.referralCount || a.position - b.position)
    .slice(0, limit)

  return ok({ leaderboard, total: all.length })
}
