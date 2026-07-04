// POST /.netlify/functions/ticket-checkin
// Body: { ticketId }
// Header: Authorization: Bearer <ADMIN_SECRET>
// Used at the event entrance to mark a ticket as used.

import { ok, err, preflight } from './lib/cors.js'
import { get, set, Tickets } from './lib/storage.js'

export const handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') return preflight()
  if (event.httpMethod !== 'POST') return err(405, 'Method not allowed')

  const adminSecret = process.env.ADMIN_SECRET
  if (!adminSecret || event.headers.authorization !== `Bearer ${adminSecret}`) {
    return err(401, 'Unauthorized')
  }

  let body
  try { body = JSON.parse(event.body || '{}') } catch { return err(400, 'Invalid JSON') }

  const { ticketId } = body
  if (!ticketId) return err(400, 'ticketId is required')

  const ticket = await get(Tickets, `ticket:${ticketId}`)
  if (!ticket) return err(404, 'Ticket not found')

  if (ticket.checkedIn) {
    return ok({ success: false, alreadyUsed: true, checkedInAt: ticket.checkedInAt,
      name: ticket.name, tier: ticket.tier, qty: ticket.qty })
  }

  ticket.checkedIn   = true
  ticket.checkedInAt = new Date().toISOString()
  await set(Tickets, `ticket:${ticketId}`, ticket)

  return ok({
    success: true, alreadyUsed: false,
    name: ticket.name, tier: ticket.tier, qty: ticket.qty,
    checkedInAt: ticket.checkedInAt,
  })
}
