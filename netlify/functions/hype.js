// GET  /.netlify/functions/hype  -> { total }
// POST /.netlify/functions/hype  Body: { taps }  -> { total }
//
// The community hype counter. It used to open at a hardcoded 8,423 and add the
// visitor's own taps on top, so the number on screen had never been true and no
// two visitors ever saw the same total. This keeps one real count in the store.
//
// Taps arrive batched - the section flushes every couple of seconds rather than
// posting per tap - so the per-request cap is a batch cap, not a tap cap.

import { ok, err, preflight, limitBody } from './lib/cors.js'
import { rateLimit } from './lib/ratelimit.js'
import { getStore } from '@netlify/blobs'

const Hype = () => getStore({ name: 'sf26-hype', consistency: 'strong' })

const TOTAL_KEY = 'total'
const MAX_BATCH = 50

async function readTotal() {
  try {
    const data = await Hype().get(TOTAL_KEY, { type: 'json' })
    return Number.isFinite(data?.total) ? data.total : 0
  } catch { return 0 }
}

export const handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') return preflight()
  if (event.httpMethod === 'GET')  return ok({ total: await readTotal() })
  if (event.httpMethod !== 'POST') return err(405, 'Method not allowed')

  const limited = await rateLimit(event, { name: 'hype', limit: 60, windowSec: 600 })
  if (limited) return limited

  const bodyErr = limitBody(event)
  if (bodyErr) return bodyErr

  let body
  try { body = JSON.parse(event.body || '{}') } catch { return err(400, 'Invalid JSON') }

  const taps = Number(body.taps)
  if (!Number.isInteger(taps) || taps < 1) return err(400, 'taps must be a positive whole number')
  if (taps > MAX_BATCH) return err(400, `taps must be ${MAX_BATCH} or fewer per request`)

  const total = await readTotal() + taps
  await Hype().setJSON(TOTAL_KEY, { total })

  return ok({ total })
}
