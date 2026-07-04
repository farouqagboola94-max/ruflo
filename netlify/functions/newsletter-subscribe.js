// POST /.netlify/functions/newsletter-subscribe
// Body: { email, name? }
// Returns: { success, alreadySubscribed? }

import { ok, err, preflight } from './lib/cors.js'
import { get, set, Newsletter } from './lib/storage.js'
import { sendEmail, newsletterEmail } from './lib/email.js'

export const handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') return preflight()
  if (event.httpMethod !== 'POST') return err(405, 'Method not allowed')

  let body
  try { body = JSON.parse(event.body || '{}') } catch { return err(400, 'Invalid JSON') }

  const { email, name } = body
  if (!email) return err(400, 'email is required')
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return err(400, 'Invalid email address')

  const key = email.toLowerCase().trim()

  const existing = await get(Newsletter, key)
  if (existing) return ok({ success: true, alreadySubscribed: true })

  await set(Newsletter, key, {
    name:         (name || '').trim(),
    email:        key,
    subscribedAt: new Date().toISOString(),
  })

  await sendEmail({
    to: key,
    subject: "Sneakers Fest '26 — You're subscribed!",
    html: newsletterEmail({ name: (name || '').trim() }),
  })

  return ok({ success: true })
}
