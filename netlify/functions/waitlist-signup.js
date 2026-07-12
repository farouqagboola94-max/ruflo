// POST /.netlify/functions/waitlist-signup
// Body: { name, email, refCode? }
// Returns: { success, position, alreadyRegistered? }

import { ok, err, preflight } from './lib/cors.js'
import { get, set, listAll, Waitlist } from './lib/storage.js'
import { sendEmail, waitlistEmail } from './lib/email.js'

export const handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') return preflight()
  if (event.httpMethod !== 'POST') return err(405, 'Method not allowed')

  let body
  try { body = JSON.parse(event.body || '{}') } catch { return err(400, 'Invalid JSON') }

  const { name, email, refCode, referredBy } = body
  if (!email) return err(400, 'email is required')
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return err(400, 'Invalid email address')

  const key       = email.toLowerCase().trim()
  const cleanName = (name || '').trim() || key.split('@')[0]

  const existing = await get(Waitlist, key)
  if (existing) return ok({ success: true, alreadyRegistered: true, position: existing.position })

  const all = await listAll(Waitlist)
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

  return ok({ success: true, position })
}
