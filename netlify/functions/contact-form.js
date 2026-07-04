// POST /.netlify/functions/contact-form
// Body: { name, email, phone?, message }
// Sends notification to organiser + auto-reply to sender.

import { ok, err, preflight } from './lib/cors.js'
import { sendEmail, notifyOrg, contactAutoReply } from './lib/email.js'

export const handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') return preflight()
  if (event.httpMethod !== 'POST') return err(405, 'Method not allowed')

  let body
  try { body = JSON.parse(event.body || '{}') } catch { return err(400, 'Invalid JSON') }

  const { name, email, phone, message } = body
  if (!name || !email || !message) return err(400, 'name, email, and message are required')
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return err(400, 'Invalid email address')
  if (message.length > 3000) return err(400, 'Message too long (max 3 000 chars)')

  await Promise.all([
    notifyOrg(
      `Contact form: ${name}`,
      `<h3>New Contact Message</h3><ul>
        <li><strong>Name:</strong> ${name}</li>
        <li><strong>Email:</strong> ${email}</li>
        <li><strong>Phone:</strong> ${phone || 'N/A'}</li>
      </ul>
      <p><strong>Message:</strong></p>
      <blockquote style="border-left:3px solid #F5A623;padding-left:14px;color:#ccc;">${message.replace(/\n/g, '<br>')}</blockquote>`
    ),
    sendEmail({
      to: email,
      subject: "Sneakers Fest '26 — We got your message!",
      html: contactAutoReply({ name }),
    }),
  ])

  return ok({ success: true })
}
