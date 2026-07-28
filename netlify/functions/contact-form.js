// POST /.netlify/functions/contact-form
// Body: { name, email, phone?, message }
// Sends notification to organiser + auto-reply to sender.

import { ok, err, preflight, limitBody } from './lib/cors.js'
import { set, Contacts } from './lib/storage.js'
import { sendEmail, notifyOrg, contactAutoReply, esc } from './lib/email.js'

export const handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') return preflight()
  if (event.httpMethod !== 'POST') return err(405, 'Method not allowed')

  const bodyErr = limitBody(event)
  if (bodyErr) return bodyErr

  let body
  try { body = JSON.parse(event.body || '{}') } catch { return err(400, 'Invalid JSON') }

  const { name, email, phone, message } = body
  if (!name || !email || !message) return err(400, 'name, email, and message are required')
  if (typeof name !== 'string' || name.length > 120) return err(400, 'Name must be 120 characters or fewer')
  if (phone && (typeof phone !== 'string' || phone.length > 30)) return err(400, 'Phone number too long')
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return err(400, 'Invalid email address')
  if (message.length > 3000) return err(400, 'Message too long (max 3 000 chars)')

  const submittedAt = new Date().toISOString()
  const key = `${submittedAt.replace(/[:.]/g, '-')}-${email.toLowerCase().replace(/[^a-z0-9]/g, '')}`
  await set(Contacts, key, {
    name: name.trim(),
    email: email.toLowerCase().trim(),
    phone: (phone || '').trim(),
    message: message.trim(),
    submittedAt,
  })

  await Promise.all([
    notifyOrg(
      `Contact form: ${esc(name)}`,
      `<h3>New Contact Message</h3><ul>
        <li><strong>Name:</strong> ${esc(name)}</li>
        <li><strong>Email:</strong> ${esc(email)}</li>
        <li><strong>Phone:</strong> ${esc(phone || 'N/A')}</li>
      </ul>
      <p><strong>Message:</strong></p>
      <blockquote style="border-left:3px solid #F5A623;padding-left:14px;color:#ccc;">${esc(message).replace(/\n/g, '<br>')}</blockquote>`
    ),
    sendEmail({
      to: email,
      subject: "Sneakers Fest '26 — We got your message!",
      html: contactAutoReply({ name }),
    }),
  ])

  return ok({ success: true })
}
