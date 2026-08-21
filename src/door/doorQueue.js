// Door List - pure offline-queue rules. No I/O, no DOM.
//
// Muri Okunola Park with a couple of thousand people on it will not have
// reliable data. A scan that cannot reach the server must never be lost and
// must never be silently counted as admitted.

const QUEUE_KEY = 'sf26_door_queue'
const LOG_KEY = 'sf26_door_log'
export const MAX_LOG = 200

export const TICKET_RE = /^SF26-[A-Z]{3}-[A-F0-9]{6}$/

/** Codes get typed on a phone in the dark; be forgiving about shape. */
export function normaliseTicket(raw) {
  return String(raw || '').toUpperCase().replace(/\s/g, '').replace(/[^A-Z0-9-]/g, '')
}

export function isValidTicket(raw) {
  return TICKET_RE.test(normaliseTicket(raw))
}

/**
 * Pull a ticket ID out of a door URL fragment.
 *
 * A pass carries a QR pointing at /door.html#t=TICKETID, so a staff member can
 * use the camera app their phone already has instead of typing sixteen
 * characters per person - which is the queue this exists to remove.
 *
 * Returns null for anything that is not a well-formed ticket. That matters:
 * the fragment is attacker-controlled, anyone can hand a staff member a QR
 * pointing anywhere, and a value that reached the input unchecked would be
 * sent to the check-in endpoint and shown back on the screen.
 */
export function ticketFromHash(hash) {
  const m = /[#&]t=([^&]*)/.exec(String(hash || ''))
  if (!m) return null
  let raw
  // A malformed percent-escape throws rather than returning anything useful.
  try { raw = decodeURIComponent(m[1]) } catch { return null }
  const id = normaliseTicket(raw)
  return isValidTicket(id) ? id : null
}

const read = (key, fallback) => {
  try { return JSON.parse(localStorage.getItem(key)) ?? fallback } catch { return fallback }
}
const write = (key, value) => {
  try { localStorage.setItem(key, JSON.stringify(value)) } catch {}
}

export const readQueue = () => read(QUEUE_KEY, [])
export const readLog = () => read(LOG_KEY, [])

/**
 * Park a scan that could not reach the server.
 * De-duplicated by ticket so repeatedly tapping a dead connection does not
 * build a queue of the same person.
 */
export function enqueue(ticketId, at) {
  const q = readQueue()
  if (q.some(e => e.ticketId === ticketId)) return q
  const next = [...q, { ticketId, at }]
  write(QUEUE_KEY, next)
  return next
}

export function dequeue(ticketId) {
  const next = readQueue().filter(e => e.ticketId !== ticketId)
  write(QUEUE_KEY, next)
  return next
}

/**
 * Record an outcome for the running list.
 *
 * `pending` is its own outcome on purpose: staff must be able to see that a
 * scan has not been confirmed yet, rather than it looking like an admission.
 */
export function logScan(entry) {
  const next = [entry, ...readLog()].slice(0, MAX_LOG)
  write(LOG_KEY, next)
  return next
}

/** Replace a queued scan's log entry once the server has answered. */
export function resolveLogged(ticketId, outcome, detail = {}) {
  const next = readLog().map(e =>
    e.ticketId === ticketId && e.outcome === 'pending'
      ? { ...e, outcome, ...detail }
      : e
  )
  write(LOG_KEY, next)
  return next
}

/** Counts for the gate display. Pending is never counted as admitted. */
export function tallies(log) {
  return {
    admitted: log.filter(e => e.outcome === 'admitted').length,
    duplicate: log.filter(e => e.outcome === 'duplicate').length,
    rejected: log.filter(e => e.outcome === 'rejected').length,
    pending: log.filter(e => e.outcome === 'pending').length,
  }
}
