// The live picture at the gate.
//
// The organiser could see one number: how many tickets had ever been scanned.
// On the day the questions are different and more urgent - how many people are
// inside right now, how fast are they arriving, is another lane needed, are we
// near capacity. Those are operational, and the first of them is a safety
// question.
//
// Every arrival is recorded as its own key, and the key carries everything the
// dashboard needs:
//
//     gate:2026-12-12T13:47:SF26-VIP-A1B2C3
//
// That shape is deliberate. Reading the existing ticket records to answer this
// costs one network round trip PER TICKET - two thousand of them for a
// dashboard someone wants to refresh every thirty seconds. Listing a prefix is
// a single request, and if the timestamp and tier are in the key then the
// listing alone answers the question, with no blob fetched at all.
//
// Distinct keys also mean arrivals never contend with each other, which is
// what lets recording one be best-effort and never able to fail a check-in.
//
// Everything here is pure. It takes a list of keys and a clock, and returns
// the picture - so every boundary can be tested at the exact minute.

const KEY_PREFIX = 'gate:'
// gate:<ISO minute>:<ticket id>, where the tier is the middle field of the id.
const KEY_RE = /^gate:(\d{4}-\d{2}-\d{2}T\d{2}:\d{2}):(SF26-([A-Z]{3})-[A-F0-9]{6})$/

export const GATE_PREFIX = KEY_PREFIX

/** The key recording that this ticket came through at this moment. */
export function arrivalKey(ticketId, at) {
  const minute = new Date(at).toISOString().slice(0, 16)
  return `${KEY_PREFIX}${minute}:${ticketId}`
}

/**
 * Read an arrival back out of its key.
 *
 * Returns null for anything that does not parse. Keys are written by us, but a
 * malformed one must not be able to poison an arithmetic mean or crash the
 * dashboard on the one day it is needed.
 */
export function parseArrival(key) {
  const m = KEY_RE.exec(String(key || ''))
  if (!m) return null
  const at = Date.parse(`${m[1]}:00Z`)
  if (!Number.isFinite(at)) return null
  return { at, ticketId: m[2], tier: m[3].toLowerCase() }
}

const BUCKET_MIN = 15
const bucketStart = (t, minutes) => Math.floor(t / (minutes * 60_000)) * minutes * 60_000

/**
 * Turn a list of arrival keys into the picture the gate needs.
 *
 * `windowMin` is how far back "arriving now" looks. Fifteen minutes is short
 * enough to notice a queue forming and long enough not to swing wildly on a
 * quiet minute.
 */
export function gatePicture(keys, { now = Date.now(), capacity = 0, windowMin = 15, bucketCount = 12 } = {}) {
  const arrivals = []
  let unreadable = 0
  for (const k of keys || []) {
    const a = parseArrival(k)
    if (a) arrivals.push(a)
    else unreadable++
  }
  arrivals.sort((a, b) => a.at - b.at)

  const byTier = {}
  for (const a of arrivals) byTier[a.tier] = (byTier[a.tier] || 0) + 1

  // Buckets run to the end of the current one, so the newest arrival always
  // lands in the last column rather than falling off the end.
  const end = bucketStart(now, BUCKET_MIN) + BUCKET_MIN * 60_000
  const start = end - bucketCount * BUCKET_MIN * 60_000
  const timeline = Array.from({ length: bucketCount }, (_, i) => {
    const from = start + i * BUCKET_MIN * 60_000
    return { from, to: from + BUCKET_MIN * 60_000, count: 0 }
  })
  for (const a of arrivals) {
    const i = Math.floor((a.at - start) / (BUCKET_MIN * 60_000))
    if (i >= 0 && i < timeline.length) timeline[i].count++
  }

  const since = now - windowMin * 60_000
  const recent = arrivals.filter(a => a.at >= since).length
  const perHour = Math.round((recent / windowMin) * 60)

  // Compare the last window against the one before it, so the dashboard can
  // say whether a queue is building or clearing rather than only how big it is.
  const previous = arrivals.filter(a => a.at >= since - windowMin * 60_000 && a.at < since).length
  let trend = 'steady'
  if (recent > previous * 1.25 && recent - previous >= 3) trend = 'rising'
  else if (previous > recent * 1.25 && previous - recent >= 3) trend = 'falling'

  const busiest = timeline.reduce((best, b) => (b.count > (best?.count ?? -1) ? b : best), null)

  return {
    inside: arrivals.length,
    capacity: capacity || null,
    // Null rather than zero when no capacity is configured: "0% full" would be
    // a claim, and an unset capacity is an absence of one.
    percentFull: capacity ? Math.min(100, Math.round((arrivals.length / capacity) * 100)) : null,
    remaining: capacity ? Math.max(0, capacity - arrivals.length) : null,
    recent, windowMin, perHour, trend,
    byTier,
    timeline,
    busiest: busiest && busiest.count > 0 ? busiest : null,
    firstArrival: arrivals.length ? arrivals[0].at : null,
    lastArrival: arrivals.length ? arrivals[arrivals.length - 1].at : null,
    unreadable,
  }
}
