// GET /.netlify/functions/member-profile?code=REFCODE
// Public endpoint — returns unified member profile for a given refCode.
// Email is intentionally excluded from the response.

import { ok, err, preflight } from './lib/cors.js'
import { listAll, Tickets, Waitlist, Newsletter } from './lib/storage.js'

const TIERS = [
  { max: 100,      label: 'FOUNDING MEMBER', icon: '👑', rank: 2, color: '#F5A623' },
  { max: 500,      label: 'INNER CIRCLE',    icon: '💎', rank: 3, color: '#00F0FF' },
  { max: 1000,     label: 'EARLY ACCESS',    icon: '⚡', rank: 4, color: '#B8FF00' },
  { max: Infinity, label: 'WAITLIST',        icon: '🎯', rank: 5, color: '#888888' },
]

function getTier(pos) {
  return TIERS.find(t => pos <= t.max) || TIERS[TIERS.length - 1]
}

export const handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') return preflight()
  if (event.httpMethod !== 'GET') return err(405, 'Method not allowed')

  const code = (event.queryStringParameters?.code || '').trim()
  if (!code) return err(400, '?code= is required')

  const all = await listAll(Waitlist)
  const member = all.find(m => m.refCode === code)
  if (!member) return err(404, 'Member not found')

  const referralCount = all.filter(m => m.referredBy === code).length

  const [newsletterAll, ticketsAll] = await Promise.all([
    listAll(Newsletter),
    listAll(Tickets, 'ticket:'),
  ])

  const subscribed = newsletterAll.some(n => n.email === member.email)
  const ticket     = ticketsAll.find(t => t.email === member.email)
  const tier       = getTier(member.position)

  return ok({
    profile: {
      name:          member.name || member.email.split('@')[0],
      refCode:       member.refCode,
      position:      member.position,
      tier:          tier.label,
      tierIcon:      tier.icon,
      tierRank:      tier.rank,
      tierColor:     tier.color,
      referralCount,
      joinedAt:      member.joinedAt,
      subscribed,
      ticket: ticket ? {
        tier:      ticket.tier,
        checkedIn: ticket.checkedIn || false,
      } : null,
    },
  })
}
