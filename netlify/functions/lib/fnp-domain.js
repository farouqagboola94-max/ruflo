// Friday Night Protocol - pure domain rules. No I/O, no HTTP, no storage.
//
// All date reasoning lives here so the client never has to decide what
// "Friday" means. The server returns the session, the streak and the next
// start time; the browser only stores what it is told. Splitting that logic
// across both sides is how the two ends drift apart.
//
// Nigeria is UTC+1 (WAT) all year and observes no daylight saving, so a fixed
// offset is correct here rather than a simplification.

const WAT_OFFSET_MS = 60 * 60 * 1000
const DAY_MS = 24 * 60 * 60 * 1000
const FRIDAY = 5

// The session runs Friday evening, but check-in stays open all Friday so
// people on different routines are not shut out.
export const LIVE_FROM_HOUR = 18
export const LIVE_TO_HOUR = 24
export const MAX_NAME = 28
export const MAX_RECENT = 12

/** Wall-clock fields in Lagos for an instant. */
export function watParts(iso) {
  const d = new Date(new Date(iso).getTime() + WAT_OFFSET_MS)
  return {
    y: d.getUTCFullYear(),
    m: d.getUTCMonth() + 1,
    d: d.getUTCDate(),
    weekday: d.getUTCDay(),
    hour: d.getUTCHours(),
  }
}

const pad = n => String(n).padStart(2, '0')
export const dateKey = ({ y, m, d }) => `${y}-${pad(m)}-${pad(d)}`

export function isFriday(iso) {
  return watParts(iso).weekday === FRIDAY
}

/** The session identifier for this instant, or null when it is not Friday. */
export function sessionIdFor(iso) {
  const p = watParts(iso)
  return p.weekday === FRIDAY ? dateKey(p) : null
}

/** True during the evening window the protocol actually runs. */
export function isLive(iso) {
  const p = watParts(iso)
  return p.weekday === FRIDAY && p.hour >= LIVE_FROM_HOUR && p.hour < LIVE_TO_HOUR
}

/**
 * Start of the next session as an instant. Called on a Friday before the
 * window opens this returns today's opening, not next week's.
 */
export function nextSessionAt(iso) {
  const p = watParts(iso)

  let daysAhead = (FRIDAY - p.weekday + 7) % 7
  if (daysAhead === 0 && p.hour >= LIVE_FROM_HOUR) daysAhead = 7

  const watMidnight = Date.UTC(p.y, p.m - 1, p.d) + daysAhead * DAY_MS
  return new Date(watMidnight + LIVE_FROM_HOUR * 60 * 60 * 1000 - WAT_OFFSET_MS).toISOString()
}

/** Session ids sorted, de-duplicated, and limited to well-formed keys. */
export function normaliseAttended(list) {
  const seen = new Set()
  for (const v of Array.isArray(list) ? list : []) {
    if (typeof v === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(v)) seen.add(v)
  }
  return [...seen].sort()
}

/**
 * Consecutive Fridays ending at `latest`. Counts back one week at a time and
 * stops at the first gap, so a missed Friday resets the run.
 */
export function computeStreak(attended, latest) {
  const set = new Set(normaliseAttended(attended))
  if (!latest || !set.has(latest)) return 0

  let streak = 0
  let cursor = Date.parse(`${latest}T00:00:00Z`)
  while (set.has(new Date(cursor).toISOString().slice(0, 10))) {
    streak++
    cursor -= 7 * DAY_MS
  }
  return streak
}

/** Shape a fresh session record. */
export function newSession(sessionId) {
  return { sessionId, count: 0, recent: [], crews: {} }
}

/**
 * Record an attendance against a session.
 *
 * Checking in twice under the same name is a no-op: people reload the page,
 * and inflating the count or showing an error both misrepresent what happened.
 */
export function addAttendance(session, { name, crewCode }, nowIso) {
  const recent = session.recent || []
  if (recent.some(r => r.name.toLowerCase() === name.toLowerCase())) {
    return { session, already: true }
  }

  const crews = { ...(session.crews || {}) }
  if (crewCode) crews[crewCode] = (crews[crewCode] || 0) + 1

  return {
    already: false,
    session: {
      ...session,
      count: (session.count || 0) + 1,
      recent: [{ name, crewCode: crewCode || null, at: nowIso }, ...recent].slice(0, MAX_RECENT),
      crews,
    },
  }
}

/** Public projection - check-in timestamps stay on the server. */
export function publicSession(session, iso) {
  return {
    sessionId: session?.sessionId ?? null,
    count: session?.count || 0,
    recent: (session?.recent || []).map(r => ({ name: r.name, crewCode: r.crewCode })),
    topCrews: Object.entries(session?.crews || {})
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([code, n]) => ({ code, count: n })),
    live: isLive(iso),
    isFriday: isFriday(iso),
    nextSessionAt: nextSessionAt(iso),
    liveFromHour: LIVE_FROM_HOUR,
  }
}
