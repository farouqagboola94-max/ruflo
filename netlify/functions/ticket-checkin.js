// POST /.netlify/functions/ticket-checkin
// Body: { ticketId }
// Header: Authorization: Bearer <ADMIN_SECRET>
// Used at the event entrance to mark a ticket as used.

import { randomUUID } from 'crypto'
import { ok, err, preflight, limitBody } from './lib/cors.js'
import { requireDoor } from './lib/auth.js'
import { get, set, Tickets } from './lib/storage.js'

const TICKET_ID_RE = /^SF26-[A-Z]{3}-[A-F0-9]{6}$/

/**
 * Claiming a ticket when the store has no compare-and-swap.
 *
 * Reading the ticket, seeing checkedIn:false, and writing checkedIn:true is a
 * read-modify-write against shared storage. Two scans of the same ticket that
 * overlap both read false, both write true, and both answer ADMITTED - one
 * ticket, two people through the gate. That is the exact fraud this check
 * exists to stop: a screenshotted pass presented at two lanes at once.
 *
 * It also got more likely, not less, when the pass gained a QR code. Typing
 * sixteen characters used to serialise the staff naturally; scanning does not.
 *
 * @netlify/blobs@8 has no conditional write - set() takes only { metadata } -
 * so mutual exclusion is not available. What is available: stamp the write
 * with a value only this request could have produced, then read it back.
 * Under strong consistency the last write wins, so a scan whose claim is not
 * the one that survived knows it lost and reports a duplicate instead of
 * admitting.
 *
 * This narrows the window rather than closing it. The interleaving
 * write-A / read-A / write-B / read-B still lets both through, because each
 * read-back happens before the other write lands. Closing it properly needs
 * a conditional write: @netlify/blobs@11 adds onlyIfMatch, which would turn
 * this into a real compare-and-swap.
 */
async function claim(ticketId, ticket) {
  const nonce = randomUUID()
  const at = new Date().toISOString()

  await set(Tickets, `ticket:${ticketId}`, {
    ...ticket, checkedIn: true, checkedInAt: at, claim: nonce,
  })

  const after = await get(Tickets, `ticket:${ticketId}`)

  // A read that fails is not evidence of winning. Treating it as a win is
  // how a lost update becomes an admitted duplicate, so an unreadable
  // read-back counts against us.
  if (!after || after.claim !== nonce) {
    return { won: false, checkedInAt: after?.checkedInAt || at }
  }
  return { won: true, checkedInAt: at }
}

export const handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') return preflight()
  if (event.httpMethod !== 'POST') return err(405, 'Method not allowed')

  const bodyErr = limitBody(event, 512)
  if (bodyErr) return bodyErr

  // Door staff, not full admin: check-in does not need read access to the
  // event's data.
  const denied = requireDoor(event)
  if (denied) return denied

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

  const result = await claim(ticketId, ticket)

  if (!result.won) {
    // Another scan claimed it in the same moment. Report it the same way as
    // any other duplicate - the staff member needs to stop the person, not
    // read about a race condition.
    return ok({
      success: false, alreadyUsed: true, checkedInAt: result.checkedInAt,
      name: ticket.name, tier: ticket.tier, qty: ticket.qty,
    })
  }

  return ok({
    success: true, alreadyUsed: false,
    name: ticket.name, tier: ticket.tier, qty: ticket.qty,
    checkedInAt: result.checkedInAt,
  })
}
