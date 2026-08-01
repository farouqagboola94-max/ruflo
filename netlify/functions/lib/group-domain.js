// Group ticket claims - pure domain rules. No I/O, no HTTP, no storage.
//
// A group is a coordination shell, not a pooled wallet. Each member pays for
// their own ticket through their own Paystack transaction, so there is no
// refund path, no partial-payment state and no one holding another person's
// money.

import { getTier } from './ticket.js'
import { CODE_RE, generateCode, normaliseCode } from './crew-domain.js'
import { cleanName } from './text.js'

export { CODE_RE, generateCode, normaliseCode }

export const MIN_SIZE = 2
// Matches the per-transaction quantity cap in ticket-purchase.js.
export const MAX_SIZE = 10
// How long an unpaid claim holds a slot before it returns to the pool.
export const HOLD_MINUTES = 30
export const MAX_NAME = 28

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

/** Validate opening a group. */
export function validateOpen({ tier, size, organiserName }) {
  const name = cleanName(organiserName, MAX_NAME)
  const n = parseInt(size, 10)

  if (!getTier(tier))                 return { ok: false, error: 'Unknown ticket tier' }
  if (!Number.isInteger(n))           return { ok: false, error: 'Group size must be a number' }
  if (n < MIN_SIZE || n > MAX_SIZE)   return { ok: false, error: `Group size must be between ${MIN_SIZE} and ${MAX_SIZE}` }
  if (name.length < 2)                return { ok: false, error: 'Your name must be at least 2 characters' }

  return { ok: true, value: { tier: String(tier).toLowerCase(), size: n, organiserName: name } }
}

/** Validate a member claiming a slot. */
export function validateClaim({ code, name, email }) {
  const c = normaliseCode(code)
  const n = cleanName(name, MAX_NAME)
  const e = String(email || '').trim().toLowerCase()

  if (!CODE_RE.test(c))    return { ok: false, error: 'Invalid group code' }
  if (n.length < 2)        return { ok: false, error: 'Your name must be at least 2 characters' }
  if (!EMAIL_RE.test(e))   return { ok: false, error: 'Invalid email address' }

  return { ok: true, value: { code: c, name: n, email: e } }
}

export function newGroup({ code, tier, size, organiserName, crewCode, now }) {
  return { code, tier, size, organiserName, crewCode: crewCode || null, createdAt: now, claims: [] }
}

/**
 * A claim holds a slot until it is paid or the hold window passes.
 * Expiry is derived at read time rather than written as a state change, so
 * there is no scheduled job to run and no way for storage to disagree with
 * the clock.
 */
export function isExpired(claim, now) {
  if (claim.paid) return false
  const age = new Date(now) - new Date(claim.claimedAt)
  return age > HOLD_MINUTES * 60 * 1000
}

/** Claims that still occupy a slot: paid, or held and not yet expired. */
export function activeClaims(group, now) {
  return (group.claims || []).filter(c => !isExpired(c, now))
}

export function slotsLeft(group, now) {
  return Math.max(0, group.size - activeClaims(group, now).length)
}

/**
 * Record a claim.
 *
 * Re-claiming with an email that already holds an UNPAID slot replaces that
 * claim rather than consuming a second slot — someone who abandoned checkout
 * and came back should not be locked out of the group they were invited to.
 * An already-PAID email is refused; they have their ticket.
 */
export function addClaim(group, { name, email, reference }, now) {
  const claims = group.claims || []
  const mine = claims.find(c => c.email === email)

  if (mine?.paid) return { ok: false, error: 'That email already has a ticket in this group' }

  if (slotsLeft(group, now) <= 0 && !(mine && !isExpired(mine, now))) {
    return { ok: false, error: 'This group is full' }
  }

  const claim = { name, email, reference, claimedAt: now, paid: false, paidAt: null }
  const next = mine
    ? claims.map(c => (c.email === email ? claim : c))
    : [...claims, claim]

  return { ok: true, group: { ...group, claims: next }, replaced: Boolean(mine) }
}

/** Flip a claim to paid when its Paystack reference confirms. */
export function markPaid(group, reference, now) {
  const claims = group.claims || []
  if (!claims.some(c => c.reference === reference)) return { ok: false, group }
  return {
    ok: true,
    group: {
      ...group,
      claims: claims.map(c =>
        c.reference === reference ? { ...c, paid: true, paidAt: now } : c
      ),
    },
  }
}

/**
 * Public projection. Anyone with the code can read this, so member emails and
 * Paystack references never appear — only who is in and whether they paid.
 */
export function publicGroup(group, now) {
  const tier = getTier(group.tier)
  const active = activeClaims(group, now)
  return {
    code: group.code,
    tier: group.tier,
    tierLabel: tier?.label || group.tier,
    priceNGN: tier?.priceNGN ?? null,
    size: group.size,
    organiserName: group.organiserName,
    crewCode: group.crewCode,
    slotsLeft: slotsLeft(group, now),
    paidCount: active.filter(c => c.paid).length,
    holdMinutes: HOLD_MINUTES,
    members: active.map(c => ({ name: c.name, paid: Boolean(c.paid) })),
    createdAt: group.createdAt,
  }
}
