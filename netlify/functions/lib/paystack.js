// Single place that talks to Paystack's transaction API.
//
// Shared by ticket-purchase.js (individual sale) and group-claim.js (a
// member claiming their slot). Amounts are always computed server-side by
// the caller from lib/ticket.js — never taken from a request body.

const INIT_URL = 'https://api.paystack.co/transaction/initialize'

/** Netlify sets URL in production; the fallback only matters locally. */
export const siteUrl = () => process.env.URL || 'https://sneakers-fest-26.netlify.app'

/**
 * Initialise a Paystack transaction.
 * Returns { ok: true, reference, authorizationUrl } or { ok: false, status, error }.
 */
export async function initTransaction({ email, amountKobo, metadata, callbackPath = '/#tickets' }) {
  const secret = process.env.PAYSTACK_SECRET_KEY
  if (!secret) return { ok: false, status: 500, error: 'Payment service not configured' }

  const base = siteUrl()

  let json
  try {
    const res = await fetch(INIT_URL, {
      method: 'POST',
      headers: { Authorization: `Bearer ${secret}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email,
        amount: amountKobo,
        callback_url: `${base}${callbackPath}`,
        metadata: { ...metadata, cancel_action: `${base}${callbackPath}` },
      }),
    })
    json = await res.json()
  } catch (e) {
    console.error('[paystack] init failed:', e.message)
    return { ok: false, status: 502, error: 'Could not reach the payment provider' }
  }

  if (!json?.status) {
    return { ok: false, status: 502, error: json?.message || 'Payment initialization failed' }
  }

  return { ok: true, reference: json.data.reference, authorizationUrl: json.data.authorization_url }
}
