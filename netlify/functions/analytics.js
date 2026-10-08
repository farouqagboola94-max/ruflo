// GET /.netlify/functions/analytics
// Returns { waitlistTotal, newsletterTotal, raffleTotal, cachedAt }
// 60-second Blob cache to avoid hammering storage on every page load.

import { ok, err, preflight } from './lib/cors.js'
import { getStore } from '@netlify/blobs'

const Cache      = () => getStore({ name: 'sf26-analytics-cache', consistency: 'strong' })
const Waitlist   = () => getStore({ name: 'sf26-waitlist',        consistency: 'strong' })
const Newsletter = () => getStore({ name: 'sf26-newsletter',      consistency: 'strong' })
const Raffles    = () => getStore({ name: 'sf26-raffles',         consistency: 'strong' })

const RAFFLE_IDS = ['rfl1', 'rfl2', 'rfl3', 'rfl4']
const CACHE_TTL  = 60_000 // ms

async function countEntries(store) {
  let count = 0
  let cursor
  do {
    const res = await store.list({ cursor })
    // exclude internal _count / _position keys
    count += res.blobs.filter(b => !b.key.includes(':_') && !b.key.startsWith('_')).length
    cursor = res.cursor
  } while (cursor)
  return count
}

export const handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') return preflight()
  if (event.httpMethod !== 'GET')  return err(405, 'Method not allowed')

  // Serve from cache when fresh
  try {
    const cached = await Cache().get('stats', { type: 'json' }).catch(() => null)
    if (cached && (Date.now() - cached.cachedAt) < CACHE_TTL) return ok(cached)
  } catch {}

  // Aggregate live counts in parallel
  const [waitlistTotal, newsletterTotal, ...raffleCounts] = await Promise.all([
    countEntries(Waitlist()).catch(() => 0),
    countEntries(Newsletter()).catch(() => 0),
    ...RAFFLE_IDS.map(id =>
      Raffles().get(`${id}:_count`, { type: 'json' })
        .then(d => d?.count ?? 0)
        .catch(() => 0)
    ),
  ])

  const raffleTotal = raffleCounts.reduce((a, b) => a + b, 0)
  const data = { waitlistTotal, newsletterTotal, raffleTotal, cachedAt: Date.now() }

  try { await Cache().setJSON('stats', data) } catch {}

  return ok(data)
}
