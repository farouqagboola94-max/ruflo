// Friday Night Protocol - HTTP boundary over lib/fnp-domain.js
//
//   GET  /.netlify/functions/fnp
//   POST /.netlify/functions/fnp { action:'checkin', name, crewCode?, attended?: [] }
//
// The client sends the session ids it believes it has attended and gets back
// the authoritative list plus its streak. All date reasoning stays server-side
// so the browser never has to work out what "Friday" means.

import { ok, err, preflight, limitBody } from './lib/cors.js'
import { rateLimit } from './lib/ratelimit.js'
import { getStore } from '@netlify/blobs'
import { cleanName } from './lib/text.js'
import { CODE_RE, normaliseCode } from './lib/crew-domain.js'
import {
  sessionIdFor, newSession, addAttendance, publicSession,
  computeStreak, normaliseAttended, nextSessionAt, MAX_NAME,
} from './lib/fnp-domain.js'

const Store = () => getStore({ name: 'sf26-fnp', consistency: 'strong' })
const key = id => `session:${id}`

export const handler = async (event) => runHandler(event, new Date().toISOString())

/**
 * The handler with its clock injected.
 *
 * Whether a request is valid depends entirely on the day of the week, so
 * without a seam the Friday path would only be exercised on Fridays. Exported
 * for tests only - nothing routes to it over HTTP.
 */
export const runHandler = async (event, now) => {
  if (event.httpMethod === 'OPTIONS') return preflight()
  if (event.httpMethod === 'GET')  return read(now)
  if (event.httpMethod !== 'POST') return err(405, 'Method not allowed')

  const bodyErr = limitBody(event, 4096)
  if (bodyErr) return bodyErr

  let body
  try { body = JSON.parse(event.body || '{}') } catch { return err(400, 'Invalid JSON') }
  if (body.action !== 'checkin') return err(400, "action must be 'checkin'")

  return checkin(event, body, now)
}

async function checkin(event, body, now) {
  const limited = await rateLimit(event, { name: 'fnp-checkin', limit: 6, windowSec: 600 })
  if (limited) return limited

  const sessionId = sessionIdFor(now)

  // Check-in only exists on a Friday. Saying so plainly beats accepting it
  // and quietly filing it against the wrong week.
  if (!sessionId) {
    return err(409, 'The protocol runs on Fridays. Come back then.')
  }

  const name = cleanName(body.name, MAX_NAME)
  if (name.length < 2) return err(400, 'Your name must be at least 2 characters')

  const raw = body.crewCode ? normaliseCode(body.crewCode) : null
  const crewCode = raw && CODE_RE.test(raw) ? raw : null

  const store = Store()
  const existing = await store.get(key(sessionId), { type: 'json' }).catch(() => null)
  const session = existing || newSession(sessionId)

  const result = addAttendance(session, { name, crewCode }, now)
  if (!result.already) await store.setJSON(key(sessionId), result.session)

  const attended = normaliseAttended([...(body.attended || []), sessionId])

  return ok({
    success: true,
    already: result.already,
    attended,
    streak: computeStreak(attended, sessionId),
    session: publicSession(result.session, now),
  })
}

async function read(now) {
  const sessionId = sessionIdFor(now)

  if (!sessionId) {
    // Not a Friday: report the shape of the next one without inventing a
    // session record for it.
    return ok({ session: publicSession(null, now), nextSessionAt: nextSessionAt(now) })
  }

  const session = await Store().get(key(sessionId), { type: 'json' }).catch(() => null)
  return ok({ session: publicSession(session || newSession(sessionId), now) })
}
