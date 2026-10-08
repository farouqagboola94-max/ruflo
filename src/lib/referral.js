// src/lib/referral.js
//
// Site-wide referral program: share your link, earn XP when the person you
// invited engages (signup/entry/registration), plus a bigger bonus if they
// buy a ticket. See src/lib/integrations.js for how crediting is kept in
// sync across browsers without any secrets in client code.

import { addXP, XP_VALUES } from './passport'
import { getVisitorId, submitFormRow, fetchLedgerRows, isConfigured } from './integrations'

const MY_REF_KEY = 'sf26_my_ref'
const REFERRED_BY_KEY = 'sf26_referred_by'
const SEEN_ROWS_KEY = 'sf26_referral_seen_rows'

export function getMyRefCode() {
  try {
    let code = localStorage.getItem(MY_REF_KEY)
    if (!code) {
      code = getVisitorId().replace(/^v_/, 'SF').toUpperCase().slice(0, 8)
      localStorage.setItem(MY_REF_KEY, code)
    }
    return code
  } catch {
    return 'SFGUEST'
  }
}

export function getReferralLink() {
  const code = getMyRefCode()
  const base = typeof window !== 'undefined' ? window.location.origin + window.location.pathname : 'https://sneakersfest26.com'
  return `${base}?ref=${code}`
}

export function captureReferral() {
  try {
    const params = new URLSearchParams(window.location.search)
    const ref = params.get('ref')
    if (!ref) return
    if (ref === getMyRefCode()) return // ignore self-referrals
    if (!localStorage.getItem(REFERRED_BY_KEY)) {
      localStorage.setItem(REFERRED_BY_KEY, ref)
    }
  } catch {
    // ignore
  }
}

export function getReferredBy() {
  try {
    return localStorage.getItem(REFERRED_BY_KEY) || null
  } catch {
    return null
  }
}

const LOGGED_ACTIONS_KEY = 'sf26_referral_logged_actions'

function alreadyLogged(action) {
  try {
    const list = JSON.parse(localStorage.getItem(LOGGED_ACTIONS_KEY) || '[]')
    return list.includes(action)
  } catch {
    return false
  }
}

function markLogged(action) {
  try {
    const list = JSON.parse(localStorage.getItem(LOGGED_ACTIONS_KEY) || '[]')
    if (!list.includes(action)) {
      list.push(action)
      localStorage.setItem(LOGGED_ACTIONS_KEY, JSON.stringify(list))
    }
  } catch {
    // ignore
  }
}

// Call this whenever the *referred* visitor completes a qualifying action
// (newsletter signup, raffle entry, vendor application, ticket purchase).
// `action` should be a stable key so we never log the same conversion twice
// from this browser (e.g. 'newsletter', 'raffle:Holiday Pack', 'purchase').
export async function logReferralConversion(type, meta = {}) {
  const refCode = getReferredBy()
  if (!refCode) return
  const actionKey = `${type}:${meta.tier || meta.raffle || meta.booth || ''}`
  if (alreadyLogged(actionKey)) return
  markLogged(actionKey)
  await submitFormRow({
    type: 'referral',
    refCode,
    meta: type + (meta.tier ? `:${meta.tier}` : meta.raffle ? `:${meta.raffle}` : meta.booth ? `:${meta.booth}` : ''),
  })
}

function getSeenRows() {
  try {
    return new Set(JSON.parse(localStorage.getItem(SEEN_ROWS_KEY) || '[]'))
  } catch {
    return new Set()
  }
}

function saveSeenRows(set) {
  try {
    localStorage.setItem(SEEN_ROWS_KEY, JSON.stringify([...set]))
  } catch {
    // ignore
  }
}

// Polls the published Sheet CSV for referral rows crediting *my* code that
// I haven't already been paid for, and awards XP locally. Safe to call on
// every page load — it's a no-op until a real Form/Sheet is configured.
export async function reconcileReferralCredits() {
  if (!isConfigured()) return { credited: 0 }
  const myCode = getMyRefCode()
  const rows = await fetchLedgerRows()
  const seen = getSeenRows()
  let credited = 0
  rows.forEach((row, i) => {
    if (row.type !== 'referral' || row.refCode !== myCode) return
    const rowId = `${row.visitorId}|${row.meta}|${row.ts || i}`
    if (seen.has(rowId)) return
    seen.add(rowId)
    const isPurchase = (row.meta || '').startsWith('purchase')
    const gained = isPurchase ? XP_VALUES.referralPurchaseBonus : XP_VALUES.referralXP
    addXP(gained, isPurchase ? 'Referral Purchase Bonus' : 'Referral Reward')
    credited += 1
  })
  if (credited > 0) saveSeenRows(seen)
  return { credited }
}
