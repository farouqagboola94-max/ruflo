// POST /.netlify/functions/ticket-checkin
// Body: { ticketId }
// Header: Authorization: Bearer <ADMIN_SECRET>
// Used at the event entrance to mark a ticket as used.

import { ok, err, preflight, limitBody } from './lib/cors.js'
import { requireDoor } from './lib/auth.js'
import { getVersioned, setIfUnchanged, Tickets } from './lib/storage.js'

const TICKET_ID_RE = /^SF26-[A-Z]{3}-[A-F0-9]{6}$/

/**
 * Claiming a ticket, exactly once.
 *
 * Reading the ticket, seeing checkedIn:false, and writing checkedIn:true is a
 * read-modify-write. Two scans of the same ticket that overlap both read
 * false, both write true, and both answer ADMITTED - one ticket, two people
 * through the gate. That is precisely the fraud this check exists to stop: a
 * screenshotted pass presented at two lanes at once. It also got more likely
 * when the pass gained a QR code, because scanning does not serialise the
 * staff the way typing sixteen characters did.
 *
 * The write is now conditional on the version read a moment earlier, so of two
 * overlapping scans exactly one write can land and the other is told, by the
 * store itself, that it lost. No interleaving admits twice.
 *
 * A conditional write can also fail because the ticket was legitimately
 * updated by something else between the read and the write, so a loss is
 * re-read rather than assumed to be a duplicate: if the record now says
 * checked in, this was a duplicate; if it does not, the scan is retried.
 */
const MAX_ATTEMPTS = 3

async function claim(ticketId) {
  for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt++) {
    const { value: ticket, version } = await getVersioned(Tickets, `ticket:${ticketId}`)

    if (!ticket) return { outcome: 'missing' }
    if (ticket.checkedIn) return { outcome: 'duplicate', ticket }

    const at = new Date().toISOString()
    const won = await setIfUnchanged(
      Tickets, `ticket:${ticketId}`,
      { ...ticket, checkedIn: true, checkedInAt: at },
      version,
    )
    if (won) return { outcome: 'admitted', ticket, checkedInAt: at }
    // Lost, or the record moved under us. Look again and decide from what is
    // actually there now.
  }

  // Three losses in a row against one ticket is not a queue, it is something
  // wrong. Refusing is the safe answer: a person turned away can be checked in
  // by hand, a person wrongly admitted cannot be un-admitted.
  return { outcome: 'contended' }
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

  const result = await claim(ticketId)

  if (result.outcome === 'missing') return err(404, 'Ticket not found')

  if (result.outcome === 'contended') {
    return err(409, 'Could not confirm this ticket. Scan it again.')
  }

  const { ticket } = result

  if (result.outcome === 'duplicate') {
    return ok({
      success: false, alreadyUsed: true, checkedInAt: ticket.checkedInAt,
      name: ticket.name, tier: ticket.tier, qty: ticket.qty,
    })
  }

  return ok({
    success: true, alreadyUsed: false,
    name: ticket.name, tier: ticket.tier, qty: ticket.qty,
    checkedInAt: result.checkedInAt,
  })
}
