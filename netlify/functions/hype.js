// GET  /.netlify/functions/hype?counter=hype|rsvp  -> { total }
// POST /.netlify/functions/hype  Body: { taps, counter? }  -> { total }
//
// Shared, honest counters. Two sections used to open at a hardcoded number and
// add the visitor's own clicks on top - the hype meter at 8,423 and the
// countdown's RSVP tally at 1,247 - so the figure on screen had never been true
// and no two visitors ever saw the same one. Both now read one real count.
//
// Taps arrive batched - the section flushes every couple of seconds rather than
// posting per tap - so the per-request cap is a batch cap, not a tap cap.

import { ok, err, preflight, limitBody } from './lib/cors.js'
import { rateLimit } from './lib/ratelimit.js'
import { getStore } from '@netlify/blobs'

const Hype = () => getStore({ name: 'sf26-hype', consistency: 'strong' })

// Named so a caller cannot invent a key and scribble into the store.
const COUNTERS = { hype: 'total', rsvp: 'rsvp' }
const MAX_BATCH = 50

function keyFor(name) {
  return COUNTERS[String(name || 'hype')] || null
}

async function readTotal(key) {
  try {
    const data = await Hype().get(key, { type: 'json' })
    return Number.isFinite(data?.total) ? data.total : 0
  } catch { return 0 }
}

export const handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') return preflight()
  if (event.httpMethod === 'GET') {
    const key = keyFor(event.queryStringParameters?.counter)
    if (!key) return err(400, 'Unknown counter')
    return ok({ total: await readTotal(key) })
  }
  if (event.httpMethod !== 'POST') return err(405, 'Method not allowed')

  const limited = await rateLimit(event, { name: 'hype', limit: 60, windowSec: 600 })
  if (limited) return limited

  const bodyErr = limitBody(event)
  if (bodyErr) return bodyErr

  let body
  try { body = JSON.parse(event.body || '{}') } catch { return err(400, 'Invalid JSON') }

  const key = keyFor(body.counter)
  if (!key) return err(400, 'Unknown counter')

  const taps = Number(body.taps)
  if (!Number.isInteger(taps) || taps < 1) return err(400, 'taps must be a positive whole number')
  if (taps > MAX_BATCH) return err(400, `taps must be ${MAX_BATCH} or fewer per request`)

  const total = await readTotal(key) + taps
  await Hype().setJSON(key, { total })

  return ok({ total })
}
