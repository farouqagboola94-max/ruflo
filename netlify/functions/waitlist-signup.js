// POST /.netlify/functions/waitlist-signup
// Body: { name, email, refCode? }
// Returns: { success, position, total, alreadyRegistered? }
//
// GET /.netlify/functions/waitlist-signup
// Returns: { total } - how many people have actually joined. Count only:
// names and emails never leave this function.

import { ok, err, preflight, limitBody } from './lib/cors.js'
import { rateLimit } from './lib/ratelimit.js'
import { get, set, listAll, Waitlist } from './lib/storage.js'
import { sendEmail, waitlistEmail } from './lib/email.js'

async function total() {
  const all = await listAll(Waitlist)
  return ok({ total: all.length })
}

export const handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') return preflight()
  if (event.httpMethod === 'GET')  return total()
  if (event.httpMethod !== 'POST') return err(405, 'Method not allowed')

  const limited = await rateLimit(event, { name: 'waitlist-signup', limit: 5, windowSec: 600 })
  if (limited) return limited

  const bodyErr = limitBody(event)
  if (bodyErr) return bodyErr

  let body
  try { body = JSON.parse(event.body || '{}') } catch { return err(400, 'Invalid JSON') }

  const { name, email, refCode, referredBy } = body
  if (!email || typeof email !== 'string') return err(400, 'email is required')
  if (name && (typeof name !== 'string' || name.length > 120)) return err(400, 'Name must be 120 characters or fewer')

  // Normalise before validating - phone keyboards and autofill routinely append a
  // trailing space, and rejecting that as "invalid" turned people away at the form.
  const key = email.toLowerCase().trim()
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(key)) return err(400, 'Invalid email address')

  const cleanName = (name || '').trim() || key.split('@')[0]

  const all = await listAll(Waitlist)

  const existing = await get(Waitlist, key)
  if (existing) {
    return ok({ success: true, alreadyRegistered: true, position: existing.position, total: all.length })
  }

  const position = all.length + 1

  const record = {
    name:     cleanName,
    email:    key,
    refCode:  (refCode || '').trim(),
    position,
    joinedAt: new Date().toISOString(),
  }
  if (referredBy) record.referredBy = referredBy.trim()

  await set(Waitlist, key, record)

  await sendEmail({
    to: key,
    subject: `Sneakers Fest '26 — You're on the waitlist! (#${position})`,
    html: waitlistEmail({ name: cleanName, position }),
  })

  return ok({ success: true, position, total: position })
}
