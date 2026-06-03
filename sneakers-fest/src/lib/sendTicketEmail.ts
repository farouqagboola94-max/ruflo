import emailjs from '@emailjs/browser'

const SERVICE_ID  = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID  || ''
const TEMPLATE_ID = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID || ''
const PUBLIC_KEY  = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY  || ''

export interface TicketEmailParams {
  to_name:     string
  to_email:    string
  ticket_tier: string
  quantity:    number
  total:       number
  ref:         string
  qr_code:     string  // base64 data URL
}

/**
 * Sends a ticket confirmation email via EmailJS.
 * Silently no-ops if env vars are not configured.
 *
 * Required EmailJS template variables:
 *   {{to_name}}, {{to_email}}, {{ticket_tier}},
 *   {{quantity}}, {{total}}, {{ref}}, {{qr_code}}
 */
export async function sendTicketEmail(params: TicketEmailParams): Promise<void> {
  if (!SERVICE_ID || !TEMPLATE_ID || !PUBLIC_KEY) return

  await emailjs.send(
    SERVICE_ID,
    TEMPLATE_ID,
    {
      to_name:     params.to_name,
      to_email:    params.to_email,
      ticket_tier: params.ticket_tier,
      quantity:    params.quantity.toString(),
      total:       `₦${params.total.toLocaleString()}`,
      ref:         params.ref,
      qr_code:     params.qr_code,
      event_name:  "Sneakers Fest 2026",
      event_date:  "December 12–13, 2026",
      event_city:  "Lagos, Nigeria",
    },
    PUBLIC_KEY,
  )
}
