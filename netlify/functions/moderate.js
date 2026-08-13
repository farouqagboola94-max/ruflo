// POST /.netlify/functions/moderate
// Header: Authorization: Bearer <ADMIN_SECRET>
// Body:   { type: 'confession' | 'sole', id, action: 'approve' | 'reject' }
//
// Two moderated walls now: the Confessional and the Sole Registry. Both take
// free text from the public, so neither is published until someone has read it.
//
// Kept separate from admin.js so that endpoint stays read-only: reading the
// event's data and changing what the public sees are different privileges,
// even when they currently share one secret.

import { ok, err, preflight, limitBody } from './lib/cors.js'
import { requireAdmin } from './lib/auth.js'
import { getStore } from '@netlify/blobs'

const Store = name => getStore({ name, consistency: 'strong' })

// Each wall knows its own store and its own id shape, so an id from one can
// never be used to reach a record in the other.
const KINDS = {
  confession: { store: 'sf26-confessions',   idRe: /^SC26-\d{4}$/, label: 'confession' },
  sole:       { store: 'sf26-sole-registry', idRe: /^SR26-\d{4}$/, label: 'registry entry' },
}

const ACTIONS = ['approve', 'reject']

export const handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') return preflight()
  if (event.httpMethod !== 'POST') return err(405, 'Method not allowed')

  const denied = requireAdmin(event)
  if (denied) return denied

  const bodyErr = limitBody(event, 512)
  if (bodyErr) return bodyErr

  let body
  try { body = JSON.parse(event.body || '{}') } catch { return err(400, 'Invalid JSON') }

  const { type, id, action } = body
  const kind = KINDS[type]
  if (!kind)                        return err(400, "type must be 'confession' or 'sole'")
  if (!kind.idRe.test(String(id)))  return err(400, `Invalid ${kind.label} id`)
  if (!ACTIONS.includes(action))    return err(400, "action must be 'approve' or 'reject'")

  const store = Store(kind.store)
  const record = await store.get(id, { type: 'json' }).catch(() => null)
  if (!record) return err(404, `No ${kind.label} with that id`)

  const updated = {
    ...record,
    approved: action === 'approve',
    moderatedAt: new Date().toISOString(),
  }
  await store.setJSON(id, updated)

  return ok({
    success: true,
    id,
    approved: updated.approved,
    moderatedAt: updated.moderatedAt,
  })
}
