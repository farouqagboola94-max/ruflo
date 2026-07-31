// POST /.netlify/functions/newsletter-subscribe
// Body: { email, name?, interests? }
// Returns: { success, alreadySubscribed?, memberNum? }

import { ok, err, preflight } from './lib/cors.js'
import { rateLimit } from './lib/ratelimit.js'
import { get, set, listAll, Newsletter } from './lib/storage.js'
import { sendEmail, newsletterEmail } from './lib/email.js'

export const handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') return preflight()
  if (event.httpMethod !== 'POST') return err(405, 'Method not allowed')

  const limited = await rateLimit(event, { name: 'newsletter-subscribe', limit: 5, windowSec: 600 })
  if (limited) return limited

  let body
  try { body = JSON.parse(event.body || '{}') } catch { return err(400, 'Invalid JSON') }

  const { email, name, interests, referredBy } = body
  if (!email) return err(400, 'email is required')
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return err(400, 'Invalid email address')

  const key            = email.toLowerCase().trim()
  const cleanName      = (name || '').trim()
  const cleanInterests = Array.isArray(interests) ? interests.slice(0, 10).map(String) : []
  const cleanRef       = (referredBy || '').trim().toUpperCase().slice(0, 12)

  const existing = await get(Newsletter, key)
  if (existing) return ok({ success: true, alreadySubscribed: true, memberNum: existing.memberNum })

  const all       = await listAll(Newsletter)
  const memberNum = all.length + 1

  const record = {
    name:         cleanName,
    email:        key,
    interests:    cleanInterests,
    memberNum,
    subscribedAt: new Date().toISOString(),
  }
  if (cleanRef) record.referredBy = cleanRef

  await set(Newsletter, key, record)

  await sendEmail({
    to: key,
    subject: "Sneakers Fest '26 — You're subscribed!",
    html: newsletterEmail({ name: cleanName, interests: cleanInterests }),
  })

  return ok({ success: true, memberNum })
}
