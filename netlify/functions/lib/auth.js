import { timingSafeEqual } from 'crypto'
import { err } from './cors.js'

/**
 * Constant-time check of the Authorization header against ADMIN_SECRET.
 *
 * Returns an error response to hand straight back to the caller, or null
 * when the request is authorised.
 *
 * timingSafeEqual throws unless both buffers are the same byte length, so
 * the guard has to compare BYTE lengths. Comparing JS string lengths is not
 * the same thing: a header padded with multi-byte UTF-8 could match on
 * character count while differing in bytes, which threw and surfaced as a
 * 500 instead of a clean 401.
 */
export function requireAdmin(event) {
  const secret = process.env.ADMIN_SECRET
  if (!secret) {
    console.error('[auth] ADMIN_SECRET is not set — refusing all admin requests')
    return err(503, 'Admin access is not configured')
  }

  const provided = Buffer.from(event.headers?.authorization || '', 'utf8')
  const expected = Buffer.from(`Bearer ${secret}`, 'utf8')

  if (provided.length !== expected.length || !timingSafeEqual(provided, expected)) {
    return err(401, 'Unauthorized')
  }
  return null
}

/**
 * Door-staff authorisation for check-in.
 *
 * Gate staff need to admit people; they do not need to read ticket, vendor or
 * contact dumps. When DOOR_SECRET is set, that is the only thing accepted
 * here, so a code handed to casual staff cannot reach the admin endpoints.
 *
 * Falls back to ADMIN_SECRET when DOOR_SECRET is unset, so existing
 * deployments keep working until the organiser sets one.
 */
export function requireDoor(event) {
  const door = process.env.DOOR_SECRET
  if (!door) return requireAdmin(event)

  const provided = Buffer.from(event.headers?.authorization || '', 'utf8')

  for (const secret of [door, process.env.ADMIN_SECRET].filter(Boolean)) {
    const expected = Buffer.from(`Bearer ${secret}`, 'utf8')
    if (provided.length === expected.length && timingSafeEqual(provided, expected)) return null
  }
  return err(401, 'Unauthorized')
}
