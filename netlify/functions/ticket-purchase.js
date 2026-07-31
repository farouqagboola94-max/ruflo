// POST /.netlify/functions/ticket-purchase
// Body: { name, email, phone?, tier, qty? }
// Returns: { payment_url, reference }
//
// Required env: PAYSTACK_SECRET_KEY

import { ok, err, preflight, limitBody } from './lib/cors.js'
import { getTier } from './lib/ticket.js'
import { set, Tickets } from './lib/storage.js'

export const handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') return preflight()
  if (event.httpMethod !== 'POST') return err(405, 'Method not allowed')

  const bodyErr = limitBody(event)
  if (bodyErr) return bodyErr

  let body
  try { body = JSON.parse(event.body || '{}') } catch { return err(400, 'Invalid JSON') }

  // Accept both `quantity` (frontend) and `qty` (direct API callers)
  const { name, email, phone, tier } = body
  const qty = body.quantity ?? body.qty ?? 1

  if (!name || !email || !tier) return err(400, 'name, email, and tier are required')
  if (typeof name !== 'string' || name.length > 120) return err(400, 'Name must be 120 characters or fewer')
  if (phone && (typeof phone !== 'string' || phone.length > 30)) return err(400, 'Phone number too long')
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return err(400, 'Invalid email address')

  const tierData = getTier(tier)
  if (!tierData) return err(400, `Unknown tier "${tier}". Valid options: general, vip, vvip, phalanx`)

  const quantity = Math.min(Math.max(parseInt(qty) || 1, 1), 10)
  const amountKobo = tierData.priceNGN * quantity * 100

  const secret = process.env.PAYSTACK_SECRET_KEY
  if (!secret) return err(500, 'Payment service not configured')

  // Netlify sets URL in production; the fallback only matters locally.
  const baseUrl = process.env.URL || 'https://sneakers-fest-26.netlify.app'

  const res = await fetch('https://api.paystack.co/transaction/initialize', {
    method: 'POST',
    headers: { Authorization: `Bearer ${secret}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email,
      amount: amountKobo,
      callback_url: `${baseUrl}/#tickets`,
      metadata: {
        name,
        phone: phone || '',
        tier,
        qty: quantity,
        cancel_action: `${baseUrl}/#tickets`,
        custom_fields: [
          { display_name: 'Buyer Name',  variable_name: 'name',  value: name },
          { display_name: 'Ticket Tier', variable_name: 'tier',  value: tierData.label },
          { display_name: 'Quantity',    variable_name: 'qty',   value: String(quantity) },
        ],
      },
    }),
  })

  const json = await res.json()
  if (!json.status) return err(502, json.message || 'Payment initialization failed')

  // Store pending record for reconciliation
  await set(Tickets, `pending:${json.data.reference}`, {
    status: 'pending',
    paystackRef: json.data.reference,
    name, email, phone: phone || '', tier, qty: quantity,
    createdAt: new Date().toISOString(),
  })

  return ok({ payment_url: json.data.authorization_url, reference: json.data.reference })
}
