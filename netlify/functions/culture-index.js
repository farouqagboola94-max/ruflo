// GET /.netlify/functions/culture-index
// Returns aggregated community stats for the Culture Index dashboard

import { ok, err, preflight } from './lib/cors.js'
import { getStore }           from '@netlify/blobs'

const SoleStore     = () => getStore({ name: 'sf26-sole-registry', consistency: 'strong' })
const WaitlistStore = () => getStore({ name: 'sf26-waitlist',      consistency: 'strong' })

export const handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') return preflight()
  if (event.httpMethod !== 'GET') return err(405, 'Method not allowed')

  const [stats, wList] = await Promise.all([
    SoleStore().get('_stats', { type: 'json' }).catch(() => null),
    WaitlistStore().list().catch(() => ({ blobs: [] })),
  ])

  const waitlistCount = (wList.blobs || []).filter(b => !b.key.startsWith('_')).length

  if (!stats) {
    return ok({ soleCount: 0, waitlistCount, brands: [], topShoes: [], cities: [], recent: [], lastUpdated: null })
  }

  const sort = obj => Object.entries(obj || {}).sort((a, b) => b[1] - a[1])

  return ok({
    soleCount:    stats.count        || 0,
    waitlistCount,
    brands:       sort(stats.brands).slice(0, 8),
    topShoes:     sort(stats.topShoes).slice(0, 5),
    cities:       sort(stats.cities).slice(0, 6),
    recent:       stats.recent       || [],
    lastUpdated:  stats.lastUpdated  || null,
  })
}
