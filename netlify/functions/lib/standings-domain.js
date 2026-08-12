// Pure logic for The Standings. No I/O, so every rule below is testable
// directly.
//
// The site already had a full XP system - tiers, 50 levels, 100 easter eggs -
// but it lived entirely in localStorage. Nobody could see anyone else's, and
// clearing your browser wiped it. This is what makes it shared.
//
// HONESTY NOTE, and it matters: XP is calculated in the visitor's browser, so
// a determined person can post a number they did not earn. That is bounded
// here (MAX_XP, monotonic updates, rate limits) but not eliminated. This
// board is for bragging rights. Do not settle a real prize on it without
// checking the winner's activity by hand.

export const MAX_HANDLE = 18
export const MIN_HANDLE = 3

// Well above what an honest player reaches, low enough that a forged score
// cannot sit at an absurd number forever.
export const MAX_XP = 50000

export const TOP_N = 10
export const NEAR_SPAN = 3   // how many rungs either side of you to show

const HANDLE_OK = /^[a-z0-9_]+$/

/**
 * Handles are lowercased so "Tunde" and "tunde" are the same person and
 * cannot both sit on the board.
 */
export function normaliseHandle(raw) {
  return String(raw || '').trim().toLowerCase().replace(/^@+/, '')
}

export function validateSubmit(body) {
  if (!body || typeof body !== 'object') {
    return { ok: false, status: 400, message: 'A JSON body is required' }
  }

  const handle = normaliseHandle(body.handle)
  if (!handle) return { ok: false, status: 400, message: 'Pick a handle' }
  if (handle.length < MIN_HANDLE) {
    return { ok: false, status: 400, message: `Handles are at least ${MIN_HANDLE} characters` }
  }
  if (handle.length > MAX_HANDLE) {
    return { ok: false, status: 400, message: `Handles are at most ${MAX_HANDLE} characters` }
  }
  if (!HANDLE_OK.test(handle)) {
    return { ok: false, status: 400, message: 'Handles use letters, numbers and underscores only' }
  }

  const xp = Number(body.xp)
  if (!Number.isInteger(xp) || xp < 0) {
    return { ok: false, status: 400, message: 'xp must be a whole number of zero or more' }
  }
  if (xp > MAX_XP) {
    return { ok: false, status: 400, message: `xp above ${MAX_XP} is not accepted` }
  }

  return { ok: true, value: { handle, xp } }
}

/**
 * XP only ever goes up for a given handle. Someone opening the site on a
 * second device with a fresh passport should not wipe out their real score,
 * and it removes the obvious way to grief a handle you do not own.
 */
export function mergeEntry(existing, { handle, xp }, now) {
  const best = Math.max(Number(existing?.xp) || 0, xp)
  return {
    handle,
    xp: best,
    firstSeen: existing?.firstSeen || now,
    updatedAt: now,
  }
}

/** Highest XP first; ties broken by who got there first. */
export function rankAll(entries) {
  return [...entries]
    .filter(e => e && typeof e.handle === 'string')
    .sort((a, b) => (b.xp - a.xp) || String(a.firstSeen).localeCompare(String(b.firstSeen)))
    .map((e, i) => ({ ...e, rank: i + 1 }))
}

/** Nothing private is stored, but keep the projection explicit anyway. */
export function publicEntry(e) {
  return e && { handle: e.handle, xp: e.xp, rank: e.rank }
}

/**
 * The rungs either side of you. This is the whole point of the feature:
 * "180 XP behind @seun" is a reason to come back, where a bare number is not.
 */
export function neighbours(ranked, handle, span = NEAR_SPAN) {
  const i = ranked.findIndex(e => e.handle === handle)
  if (i === -1) return { you: null, near: [], chasing: null, chasedBy: null }

  const near = ranked.slice(Math.max(0, i - span), i + span + 1).map(publicEntry)
  const above = ranked[i - 1]
  const below = ranked[i + 1]

  return {
    you: publicEntry(ranked[i]),
    near,
    // How far off the person directly ahead, and how close the one behind.
    chasing:  above ? { handle: above.handle, gap: Math.max(0, above.xp - ranked[i].xp) } : null,
    chasedBy: below ? { handle: below.handle, gap: Math.max(0, ranked[i].xp - below.xp) } : null,
  }
}

export function board(entries, handle) {
  const ranked = rankAll(entries)
  return {
    top: ranked.slice(0, TOP_N).map(publicEntry),
    total: ranked.length,
    ...(handle ? neighbours(ranked, handle) : { you: null, near: [], chasing: null, chasedBy: null }),
  }
}
