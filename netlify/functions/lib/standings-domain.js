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
export const TOP_CREWS = 8

const HANDLE_OK = /^[a-z0-9_]+$/

// Same alphabet the crew codes are minted from - 0/O, 1/I/L, 5/S and 8/B are
// all absent, so a code read aloud in a noisy room cannot be mistyped.
const CREW_OK = /^[234679ACDEFGHJKMNPQRTUVWXYZ]{5}$/

/** Crew codes are uppercased; an empty or malformed one simply means no crew. */
export function normaliseCrew(raw) {
  const c = String(raw || '').trim().toUpperCase()
  return CREW_OK.test(c) ? c : null
}

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

  return {
    ok: true,
    // A crew is optional. Flying a malformed code is not worth refusing a
    // score over - it just means you are riding solo.
    value: { handle, xp, crew: normaliseCrew(body.crew) },
  }
}

/**
 * XP only ever goes up for a given handle. Someone opening the site on a
 * second device with a fresh passport should not wipe out their real score,
 * and it removes the obvious way to grief a handle you do not own.
 */
export function mergeEntry(existing, { handle, xp, crew }, now) {
  const best = Math.max(Number(existing?.xp) || 0, xp)
  return {
    handle,
    xp: best,
    // Switching crews is allowed; clearing one keeps whatever you last flew,
    // so a device without the code does not silently drop you from your crew.
    crew: crew || existing?.crew || null,
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
  return e && { handle: e.handle, xp: e.xp, rank: e.rank, crew: e.crew || null }
}

/**
 * Crew Wars. A crew's score is the sum of what its members actually earned,
 * so one strong player cannot carry a crew past a larger one on their own -
 * and recruiting is worth as much as grinding.
 */
export function rankCrews(entries) {
  const byCrew = new Map()

  for (const e of entries) {
    if (!e?.crew) continue
    const c = byCrew.get(e.crew) || { code: e.crew, xp: 0, members: 0, firstSeen: e.firstSeen }
    c.xp += Number(e.xp) || 0
    c.members += 1
    if (String(e.firstSeen) < String(c.firstSeen)) c.firstSeen = e.firstSeen
    byCrew.set(e.crew, c)
  }

  return [...byCrew.values()]
    .sort((a, b) =>
      (b.xp - a.xp) ||
      (b.members - a.members) ||
      String(a.firstSeen).localeCompare(String(b.firstSeen)))
    .map((c, i) => ({ code: c.code, xp: c.xp, members: c.members, rank: i + 1 }))
}

/** Your crew's standing, and the gap to the one above it. */
export function crewStanding(ranked, code) {
  if (!code) return { yourCrew: null, crewChasing: null }
  const i = ranked.findIndex(c => c.code === code)
  if (i === -1) return { yourCrew: null, crewChasing: null }
  const above = ranked[i - 1]
  return {
    yourCrew: ranked[i],
    crewChasing: above ? { code: above.code, gap: Math.max(0, above.xp - ranked[i].xp) } : null,
  }
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
  const crews = rankCrews(ranked)
  const mine = handle ? ranked.find(e => e.handle === handle) : null

  return {
    top: ranked.slice(0, TOP_N).map(publicEntry),
    total: ranked.length,
    crews: crews.slice(0, TOP_CREWS),
    crewCount: crews.length,
    ...(handle ? neighbours(ranked, handle) : { you: null, near: [], chasing: null, chasedBy: null }),
    ...crewStanding(crews, mine?.crew || null),
  }
}
