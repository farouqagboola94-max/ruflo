// GET /.netlify/functions/ticket-lookup?id=SF26-GEN-ABCDEF
// GET /.netlify/functions/ticket-lookup?ref=paystack_reference
// Returns public ticket details (no email exposed)

import { ok, err, preflight } from './lib/cors.js'
import { get, Tickets } from './lib/storage.js'

export const handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') return preflight()
  if (event.httpMethod !== 'GET') return err(405, 'Method not allowed')

  const id  = event.queryStringParameters?.id  || ''
  const ref = event.queryStringParameters?.ref || ''

  if (!id && !ref) return err(400, 'Provide ?id=SF26-XXX-YYY or ?ref=paystack_ref')

  let ticket = null

  if (id) {
    ticket = await get(Tickets, `ticket:${id}`)
  } else {
    const idx = await get(Tickets, `ref:${ref}`)
    if (idx?.ticketId) ticket = await get(Tickets, `ticket:${idx.ticketId}`)
  }

  if (!ticket) return err(404, 'Ticket not found')

  return ok({
    ticketId:    ticket.ticketId,
    name:        ticket.name,
    tier:        ticket.tier,
    tierLabel:   ticket.tierLabel,
    qty:         ticket.qty,
    status:      ticket.status,
    checkedIn:   ticket.checkedIn,
    checkedInAt: ticket.checkedInAt,
    confirmedAt: ticket.confirmedAt,
  })
}
