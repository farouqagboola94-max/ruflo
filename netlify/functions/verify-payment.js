// POST /.netlify/functions/verify-payment (Paystack webhook)
// Configure in Paystack dashboard: webhook URL = https://your-site.netlify.app/.netlify/functions/verify-payment
// Required env: PAYSTACK_SECRET_KEY, RESEND_API_KEY, ORGANISER_EMAIL

import { createHmac, timingSafeEqual } from 'crypto'
import { generateTicketId, getTier } from './lib/ticket.js'
import { ticketEmail } from './lib/email.js'
import { esc, sendEmail, notifyOrg } from './lib/email.js'
import { get, set, del, Tickets } from './lib/storage.js'
import { getStore } from '@netlify/blobs'
import { markPaid, normaliseCode, CODE_RE } from './lib/group-domain.js'

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
  const sigBuf = Buffer.from(String(sig), 'utf8')
  const expBuf = Buffer.from(expected, 'utf8')
  if (sigBuf.length !== expBuf.length || !timingSafeEqual(sigBuf, expBuf)) {
    return { statusCode: 401, body: 'Invalid signature' }
  }

  let payload
  try { payload = JSON.parse(event.body) } catch { return { statusCode: 400, body: 'Bad JSON' } }

  // Only act on successful charges
  if (payload.event !== 'charge.success') {
    return { statusCode: 200, body: 'Acknowledged' }
  }

  const data = payload.data
  const ref  = data.reference
  const meta = data.metadata || {}

  // Fall back to the pending record created by ticket-purchase for reliable buyer data
  const pending = await get(Tickets, `pending:${ref}`)

  const name  = meta.name  || pending?.name  || data.customer?.first_name || 'Guest'
  const email = data.customer?.email || pending?.email
  const tier  = meta.tier  || pending?.tier  || 'general'
  const qty   = parseInt(meta.qty || pending?.qty) || 1
  const tierData = getTier(tier)

  const ticketId = generateTicketId(tier, ref)

  // Idempotency. This has to read the key that is actually written below —
  // `ticket:${ticketId}`. It previously read `ticket:${ref}`, which is never
  // written, so the guard never fired. generateTicketId is deterministic on
  // (tier, ref), so a Paystack retry rewrote identical data — harmless for
  // storage, but it re-sent the buyer's confirmation and the organiser's
  // "ticket sold" notification on every retry.
  const existing = await get(Tickets, `ticket:${ticketId}`)
  if (existing) {
    console.log('[verify-payment] already processed:', ref, '->', ticketId)
    return { statusCode: 200, body: 'Already processed' }
  }

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
  // The buyer controls `name` (it is echoed back through Paystack metadata),
  // so everything interpolated here is escaped before it reaches the
  // organiser's inbox.
  await notifyOrg(
    `New ticket: ${ticketId} | ${(tierData?.label || tier).toUpperCase()} x${qty}`,
    `<h3>New Ticket Sold</h3><ul>
      <li><strong>Ticket ID:</strong> ${esc(ticketId)}</li>
      <li><strong>Buyer:</strong> ${esc(name)} (${esc(email) || 'no email'})</li>
      <li><strong>Tier:</strong> ${esc(tierData?.label || tier)} &times;${qty}</li>
      <li><strong>Amount:</strong> &#x20A6;${(data.amount / 100).toLocaleString()}</li>
      <li><strong>Paystack ref:</strong> ${esc(ref)}</li>
    </ul>`
  )

  // If this ticket was claimed against a group, mark that slot paid so the
  // organiser sees progress. Deliberately last and non-fatal: the ticket is
  // already issued and emailed, so a group bookkeeping failure must never
  // turn into a non-2xx that makes Paystack retry the whole delivery.
  if (meta.groupCode) {
    try {
      await markGroupSlotPaid(meta.groupCode, ref)
    } catch (e) {
      console.error('[verify-payment] group update failed for', meta.groupCode, e.message)
    }
  }

  console.log('[verify-payment] ticket created:', ticketId, 'for', email)
  return { statusCode: 200, body: 'OK' }
}

async function markGroupSlotPaid(groupCode, reference) {
  const code = normaliseCode(groupCode)
  if (!CODE_RE.test(code)) return

  const store = getStore({ name: 'sf26-groups', consistency: 'strong' })
  const group = await store.get(`group:${code}`, { type: 'json' }).catch(() => null)
  if (!group) return

  const result = markPaid(group, reference, new Date().toISOString())
  if (result.ok) await store.setJSON(`group:${code}`, result.group)
}
