// POST /.netlify/functions/ticket-checkin
// Body: { ticketId }
// Header: Authorization: Bearer <ADMIN_SECRET>
// Used at the event entrance to mark a ticket as used.

import { timingSafeEqual } from 'crypto'
import { ok, err, preflight, limitBody } from './lib/cors.js'
import { get, set, Tickets } from './lib/storage.js'

const TICKET_ID_RE = /^SF26-[A-Z]{3}-[A-F0-9]{6}$/

export const handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') return preflight()
  if (event.httpMethod !== 'POST') return err(405, 'Method not allowed')

  const bodyErr = limitBody(event, 512)
  if (bodyErr) return bodyErr

  const adminSecret = process.env.ADMIN_SECRET
  const authHeader  = event.headers.authorization || ''
  const expected    = `Bearer ${adminSecret}`
  const authorized  = adminSecret &&
    authHeader.length === expected.length &&
    timingSafeEqual(Buffer.from(authHeader, 'utf8'), Buffer.from(expected, 'utf8'))
  if (!authorized) {
    return err(401, 'Unauthorized')
  }

  let body
  try { body = JSON.parse(event.body || '{}') } catch { return err(400, 'Invalid JSON') }

  const { ticketId } = body
  if (!ticketId) return err(400, 'ticketId is required')
  if (!TICKET_ID_RE.test(String(ticketId))) return err(400, 'Invalid ticket ID format')

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
