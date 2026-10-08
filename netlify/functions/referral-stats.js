// GET /.netlify/functions/referral-stats?code=REFCODE
// Returns the number of waitlist signups attributed to a referral code.

import { ok, err, preflight } from './lib/cors.js'
import { listAll, Waitlist } from './lib/storage.js'

export const handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') return preflight()
  if (event.httpMethod !== 'GET') return err(405, 'Method not allowed')

  const code = (event.queryStringParameters?.code || '').trim()
  if (!code) return err(400, '?code= is required')

  const all       = await listAll(Waitlist)
  const referrals = all.filter(r => r.referredBy === code)

  return ok({ code, referralCount: referrals.length })
}
