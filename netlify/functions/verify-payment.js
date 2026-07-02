const crypto = require('crypto')

// Paystack webhook handler.
// Netlify calls this at /.netlify/functions/verify-payment.
// Set PAYSTACK_SECRET_KEY in Netlify environment variables (never in client code).
exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: JSON.stringify({ error: 'Method not allowed' }) }
  }

  const secret = process.env.PAYSTACK_SECRET_KEY
  if (!secret) {
    console.error('PAYSTACK_SECRET_KEY is not set')
    return { statusCode: 500, body: JSON.stringify({ error: 'Payment verification not configured' }) }
  }

  const signature = event.headers['x-paystack-signature']
  if (!signature) {
    return { statusCode: 400, body: JSON.stringify({ error: 'Missing x-paystack-signature header' }) }
  }

  const hash = crypto
    .createHmac('sha512', secret)
    .update(event.body)
    .digest('hex')

  if (hash !== signature) {
    return { statusCode: 400, body: JSON.stringify({ error: 'Invalid signature' }) }
  }

  let payload
  try {
    payload = JSON.parse(event.body)
  } catch {
    return { statusCode: 400, body: JSON.stringify({ error: 'Invalid JSON body' }) }
  }

  if (payload.event === 'charge.success') {
    const { reference, amount, currency, customer } = payload.data || {}
    // Logs appear in Netlify Functions log dashboard
    console.log(JSON.stringify({
      event: 'payment_verified',
      reference,
      amount: amount / 100,
      currency,
      email: customer?.email,
      name: customer?.first_name
        ? `${customer.first_name} ${customer.last_name || ''}`.trim()
        : customer?.email,
    }))
    // TODO: persist to a database or trigger a confirmation email here
  }

  return { statusCode: 200, body: JSON.stringify({ received: true }) }
}
