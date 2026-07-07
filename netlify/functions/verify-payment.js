// POST /.netlify/functions/verify-payment (Paystack webhook)
// Configure in Paystack dashboard: webhook URL = https://your-site.netlify.app/.netlify/functions/verify-payment
// Required env: PAYSTACK_SECRET_KEY, RESEND_API_KEY, ORGANISER_EMAIL

import { createHmac } from 'crypto'
import { generateTicketId, getTier } from './lib/ticket.js'
import { ticketEmail } from './lib/email.js'
import { sendEmail, notifyOrg } from './lib/email.js'
import { get, set, del, Tickets } from './lib/storage.js'

export const handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method not allowed' }
  }

  const secret = process.env.PAYSTACK_SECRET_KEY
  if (!secret) {
    console.error('[verify-payment] PAYSTACK_SECRET_KEY not set')
    return { statusCode: 500, body: 'Webhook not configured' }
  }

  const sig = event.headers['x-paystack-signature']
  if (!sig) return { statusCode: 400, body: 'Missing x-paystack-signature' }

  const expected = createHmac('sha512', secret).update(event.body).digest('hex')
  if (sig !== expected) return { statusCode: 401, body: 'Invalid signature' }

  let payload
  try { payload = JSON.parse(event.body) } catch { return { statusCode: 400, body: 'Bad JSON' } }

  // Only act on successful charges
  if (payload.event !== 'charge.success') {
    return { statusCode: 200, body: 'Acknowledged' }
  }

  const data = payload.data
  const ref  = data.reference
  const meta = data.metadata || {}

  // Idempotency: skip if this payment was already processed
  const existing = await get(Tickets, `ticket:${ref}`)
  if (existing) {
    console.log('[verify-payment] already processed:', ref)
    return { statusCode: 200, body: 'Already processed' }
  }

  // Fall back to the pending record created by ticket-purchase for reliable buyer data
  const pending = await get(Tickets, `pending:${ref}`)

  const name  = meta.name  || pending?.name  || data.customer?.first_name || 'Guest'
  const email = data.customer?.email || pending?.email
  const tier  = meta.tier  || pending?.tier  || 'general'
  const qty   = parseInt(meta.qty || pending?.qty) || 1
  const tierData = getTier(tier)

  const ticketId = generateTicketId(tier, ref)

  const ticketRecord = {
    ticketId,
    paystackRef: ref,
    status: 'confirmed',
    name,
    email,
    tier,
    tierLabel: tierData?.label || tier,
    qty,
    amountNGN: data.amount / 100,
    currency: data.currency,
    checkedIn: false,
    checkedInAt: null,
    confirmedAt: new Date().toISOString(),
  }

  // Store confirmed ticket (two indexes for lookup by ID or by Paystack ref)
  await Promise.all([
    set(Tickets, `ticket:${ticketId}`, ticketRecord),
    set(Tickets, `ref:${ref}`, { ticketId }),
  ])
  await del(Tickets, `pending:${ref}`)

  // Send confirmation email to buyer
  if (email) {
    await sendEmail({
      to: email,
      subject: `Your Sneakers Fest '26 Ticket — ${ticketId}`,
      html: ticketEmail({ name, ticketId, tier, qty }),
    })
  }

  // Notify organiser
  await notifyOrg(
    `New ticket: ${ticketId} | ${(tierData?.label || tier).toUpperCase()} x${qty}`,
    `<h3>New Ticket Sold</h3><ul>
      <li><strong>Ticket ID:</strong> ${ticketId}</li>
      <li><strong>Buyer:</strong> ${name} (${email || 'no email'})</li>
      <li><strong>Tier:</strong> ${tierData?.label || tier} &times;${qty}</li>
      <li><strong>Amount:</strong> &#x20A6;${(data.amount / 100).toLocaleString()}</li>
      <li><strong>Paystack ref:</strong> ${ref}</li>
    </ul>`
  )

  console.log('[verify-payment] ticket created:', ticketId, 'for', email)
  return { statusCode: 200, body: 'OK' }
}
