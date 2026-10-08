// GET  /.netlify/functions/standings?handle=you  -> { top, total, you, near, chasing, chasedBy }
// POST /.netlify/functions/standings  Body: { handle, xp } -> same shape
//
// The shared XP board. See lib/standings-domain.js for the rules, including
// the note about client-computed XP being forgeable.

import { ok, err, preflight, limitBody } from './lib/cors.js'
import { rateLimit } from './lib/ratelimit.js'
import { getStore } from '@netlify/blobs'
import { validateSubmit, mergeEntry, board, normaliseHandle } from './lib/standings-domain.js'

const Standings = () => getStore({ name: 'sf26-standings', consistency: 'strong' })

async function readAll() {
  const store = Standings()
  const list = await store.list().catch(() => ({ blobs: [] }))
  const keys = (list.blobs || []).map(b => b.key)
  const rows = await Promise.all(keys.map(k => store.get(k, { type: 'json' }).catch(() => null)))
  return rows.filter(Boolean)
}

export const handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') return preflight()

  if (event.httpMethod === 'GET') {
    const handle = normaliseHandle(event.queryStringParameters?.handle)
    return ok(board(await readAll(), handle || null))
  }

  if (event.httpMethod !== 'POST') return err(405, 'Method not allowed')

  const limited = await rateLimit(event, { name: 'standings', limit: 20, windowSec: 600 })
  if (limited) return limited

  const bodyErr = limitBody(event)
  if (bodyErr) return bodyErr

  let body
  try { body = JSON.parse(event.body || '{}') } catch { return err(400, 'Invalid JSON') }

  const parsed = validateSubmit(body)
  if (!parsed.ok) return err(parsed.status, parsed.message)

  const { handle } = parsed.value
  const store = Standings()
  const key = `p:${handle}`

  const existing = await store.get(key, { type: 'json' }).catch(() => null)
  const merged = mergeEntry(existing, parsed.value, new Date().toISOString())
  await store.setJSON(key, merged)

  const all = await readAll()
  return ok(board(all, handle))
}
