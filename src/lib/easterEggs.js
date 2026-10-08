// src/lib/easterEggs.js
//
// The Great Sole Hunt — 100 hidden eggs, two tucked into every single
// section of the site (50 sections x 2 = 100), so finding them all means
// exploring literally everything from the Hero to the Footer. Each egg is
// worth XP, and — because there are exactly 100 eggs and only the first
// person to verify-claim each one counts — there are, by construction,
// only 100 possible winners across the whole hunt.
//
// Real-world prize fulfillment for the "100 winners" needs a human to
// reconcile claims (see src/lib/integrations.js) since this is a static
// site with no central authority; locally, every found egg still pays out
// real XP immediately so the hunt is fun and rewarding regardless.

import { addXP, hasBadge, XP_VALUES } from './passport'
import { submitFormRow } from './integrations'

export const EGG_XP = XP_VALUES.easterEgg

// 50 hosts in the exact order they appear on the page (Hero through Footer).
const HOSTS = [
  ['hero', 'the Hero intro'],
  ['ticker', 'the scrolling event ticker'],
  ['about', 'the About section'],
  ['origin', 'the Origin Story'],
  ['market', 'the Market Context section'],
  ['fnp', 'Friday Night Protocol'],
  ['press', 'the Press section'],
  ['sponsors', 'the Sponsors wall'],
  ['highlights', 'the Highlights reel'],
  ['community', 'the Community section'],
  ['testimonials', 'the Testimonials'],
  ['passport', 'the Sneaker Passport'],
  ['dna', 'Sneaker DNA'],
  ['sole-of-lagos', 'The Sole of Lagos'],
  ['culture-history', 'Art & Culture'],
  ['museum', 'The Museum'],
  ['vault-200', 'The Vault 200'],
  ['wall', 'The Wall'],
  ['trivia', 'Sneaker Trivia'],
  ['memory-match', 'Sole Memory'],
  ['soledle', 'Soledle'],
  ['colorizer', 'the Shoe Builder'],
  ['outfit', 'the Outfit Matcher'],
  ['hype', 'the Hype Counter'],
  ['spin', 'Spin to Win'],
  ['vote-off', 'Crew Vote-Off'],
  ['badge', 'Badge Maker'],
  ['mystery', 'Mystery Drop'],
  ['worth', 'Collection Worth'],
  ['bingo', 'Sneaker Bingo'],
  ['artists', 'Artist Spotlight'],
  ['timeline', 'the Drops Timeline'],
  ['waitlist', 'Early Access'],
  ['comics', 'Catalyst Universe'],
  ['gallery', 'the Gallery'],
  ['trades', 'the Trade Board'],
  ['leaderboard', 'the Rankings'],
  ['photo-tools', 'the Photo Studio'],
  ['substack', 'the Substack section'],
  ['newsletter', 'the Newsletter'],
  ['lineup', 'the Lineup'],
  ['schedule', 'the Schedule'],
  ['venue', 'the Venue'],
  ['merch', 'the Merch shelf'],
  ['raffle', 'the Raffle'],
  ['countdown', 'the Countdown'],
  ['tickets', 'the Tickets section'],
  ['vendors', 'Vendor Registration'],
  ['faq', 'the FAQ'],
  ['footer', 'the Footer'],
]

// Two clue templates per host so the pair of eggs in a section read
// differently. %s is replaced with the host's human label.
const TEMPLATE_A = (label) => `Look closely where %s lives — something small doesn't belong.`.replace('%s', label)
const TEMPLATE_B = (label) => `Half-hidden near %s, a faint glow gives it away.`.replace('%s', label)

export const EGGS = HOSTS.flatMap(([host, label], i) => {
  const n = i * 2
  return [
    { id: `egg-${String(n + 1).padStart(3, '0')}`, host, clue: TEMPLATE_A(label) },
    { id: `egg-${String(n + 2).padStart(3, '0')}`, host, clue: TEMPLATE_B(label) },
  ]
})

export const TOTAL_EGGS = EGGS.length // 100

const FOUND_KEY = 'sf26_eggs_found'
const EVENT = 'sf26:egg'

export function getFoundEggs() {
  try {
    return JSON.parse(localStorage.getItem(FOUND_KEY) || '[]')
  } catch {
    return []
  }
}

export function eggCount() {
  return getFoundEggs().length
}

export function hasFoundEgg(id) {
  return getFoundEggs().includes(id)
}

export function claimEgg(id) {
  if (hasFoundEgg(id)) return getFoundEggs()
  const egg = EGGS.find((e) => e.id === id)
  if (!egg) return getFoundEggs()

  const found = [...getFoundEggs(), id]
  try {
    localStorage.setItem(FOUND_KEY, JSON.stringify(found))
  } catch {
    // ignore
  }

  const completedHunt = found.length === TOTAL_EGGS
  const badge = completedHunt ? 'egg-hunt-complete' : undefined
  if (!completedHunt || !hasBadge('egg-hunt-complete')) {
    addXP(EGG_XP, 'Easter Egg Hunt', badge)
  }

  submitFormRow({ type: 'egg', eggId: id, meta: egg.host })

  window.dispatchEvent(new CustomEvent(EVENT, { detail: { id, count: found.length } }))
  return found
}

export function subscribeEggs(cb) {
  const fn = (e) => cb(e.detail)
  window.addEventListener(EVENT, fn)
  return () => window.removeEventListener(EVENT, fn)
}
