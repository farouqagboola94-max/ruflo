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
