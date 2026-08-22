// GET /.netlify/functions/ticket-lookup?id=SF26-GEN-ABCDEF
// GET /.netlify/functions/ticket-lookup?ref=paystack_reference
// Returns public ticket details (no email exposed)

import { ok, err, preflight } from './lib/cors.js'
import { rateLimit } from './lib/ratelimit.js'
import { get, Tickets } from './lib/storage.js'

const TICKET_ID_RE = /^SF26-[A-Z]{3}-[A-F0-9]{6}$/
// Paystack references are their own opaque strings; accept a conservative
// shape rather than passing arbitrary text into a storage key.
const REF_RE = /^[A-Za-z0-9_-]{6,64}$/

export const handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') return preflight()
  if (event.httpMethod !== 'GET') return err(405, 'Method not allowed')

  const id  = String(event.queryStringParameters?.id  || '').trim().toUpperCase()
  const ref = String(event.queryStringParameters?.ref || '').trim()

  if (!id && !ref) return err(400, 'Provide ?id=SF26-XXX-YYY or ?ref=paystack_ref')

  // A hit returns the holder's name, and the ID space is small enough to walk
  // given enough attempts, so this endpoint is an enumeration oracle for who
  // is coming. Every other public endpoint here is throttled; this one was
  // not. Generous enough that someone reloading their own pass never notices.
  const limited = await rateLimit(event, { name: 'lookup', limit: 30, windowSec: 600 })
  if (limited) return limited

  // Validate before touching storage. Anything that cannot be a ticket is a
  // miss by definition, and an unchecked value should not become a key.
  if (id && !TICKET_ID_RE.test(id)) return err(404, 'Ticket not found')
  if (!id && !REF_RE.test(ref))    return err(404, 'Ticket not found')

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
