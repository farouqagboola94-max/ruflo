// Crews — HTTP boundary over lib/crew-domain.js
//
//   POST /.netlify/functions/crew  { action: 'create', crewName, city, founderName }
//   POST /.netlify/functions/crew  { action: 'join',   code, memberName }
//   GET  /.netlify/functions/crew?code=AB123
//   GET  /.netlify/functions/crew?top=1
//
// All rules live in the domain module; this file only does transport,
// storage and abuse control.

import { ok, err, preflight, limitBody } from './lib/cors.js'
import { rateLimit } from './lib/ratelimit.js'
import { getStore } from '@netlify/blobs'
import {
  validateCreate, validateJoin, newCrew, addMember,
  publicCrew, rankCrews, generateCode, normaliseCode, CODE_RE,
} from './lib/crew-domain.js'

const Store = () => getStore({ name: 'sf26-crews', consistency: 'strong' })
const key = code => `crew:${code}`

/** Allocate a code that is not already taken. */
async function allocateCode(store, attempts = 8) {
  for (let i = 0; i < attempts; i++) {
    const code = generateCode()
    const taken = await store.get(key(code), { type: 'json' }).catch(() => null)
    if (!taken) return code
  }
  return null
}

export const handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') return preflight()
  if (event.httpMethod === 'GET')  return read(event)
  if (event.httpMethod !== 'POST') return err(405, 'Method not allowed')

  const bodyErr = limitBody(event, 2048)
  if (bodyErr) return bodyErr

  let body
  try { body = JSON.parse(event.body || '{}') } catch { return err(400, 'Invalid JSON') }

  if (body.action === 'create') return create(event, body)
  if (body.action === 'join')   return join(event, body)
  return err(400, "action must be 'create' or 'join'")
}

async function create(event, body) {
  const limited = await rateLimit(event, { name: 'crew-create', limit: 3, windowSec: 1800 })
  if (limited) return limited

  const v = validateCreate(body)
  if (!v.ok) return err(400, v.error)

  const store = Store()
  const code = await allocateCode(store)
  if (!code) return err(503, 'Could not allocate a crew code. Try again.')

  const crew = newCrew({ ...v.value, code, now: new Date().toISOString() })
  await store.setJSON(key(code), crew)

  return ok({ success: true, crew: publicCrew(crew) })
}

async function join(event, body) {
  const limited = await rateLimit(event, { name: 'crew-join', limit: 10, windowSec: 600 })
  if (limited) return limited

  const v = validateJoin(body)
  if (!v.ok) return err(400, v.error)

  const store = Store()
  const existing = await store.get(key(v.value.code), { type: 'json' }).catch(() => null)
  if (!existing) return err(404, 'No crew with that code')

  const result = addMember(existing, v.value.memberName, new Date().toISOString())
  if (!result.ok) return err(409, result.error)

  // Skip the write when nothing changed, so a repeated tap costs one read.
  if (!result.alreadyMember) await store.setJSON(key(v.value.code), result.crew)

  return ok({
    success: true,
    alreadyMember: result.alreadyMember,
    crew: publicCrew(result.crew),
  })
}

async function read(event) {
  const q = event.queryStringParameters || {}
  const store = Store()

  if (q.top) {
    const list = await store.list().catch(() => ({ blobs: [] }))
    const keys = (list.blobs || []).map(b => b.key).filter(k => k.startsWith('crew:')).slice(0, 200)
    const crews = (await Promise.all(
      keys.map(k => store.get(k, { type: 'json' }).catch(() => null))
    )).filter(Boolean)

    return ok({
      crews: rankCrews(crews).slice(0, 10).map(publicCrew),
      total: crews.length,
    })
  }

  const code = normaliseCode(q.code)
  if (!CODE_RE.test(code)) return err(400, 'Invalid crew code')

  const crew = await store.get(key(code), { type: 'json' }).catch(() => null)
  if (!crew) return err(404, 'No crew with that code')

  return ok({ crew: publicCrew(crew) })
}
