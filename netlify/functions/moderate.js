// POST /.netlify/functions/moderate
// Header: Authorization: Bearer <ADMIN_SECRET>
// Body:   { type: 'confession', id: 'SC26-0001', action: 'approve' | 'reject' }
//
// Kept separate from admin.js so that endpoint stays read-only: reading the
// event's data and changing what the public sees are different privileges,
// even when they currently share one secret.

import { ok, err, preflight, limitBody } from './lib/cors.js'
import { requireAdmin } from './lib/auth.js'
import { getStore } from '@netlify/blobs'

const Confessions = () => getStore({ name: 'sf26-confessions', consistency: 'strong' })

const ID_RE = /^SC26-\d{4}$/
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
  if (type !== 'confession')      return err(400, "type must be 'confession'")
  if (!ID_RE.test(String(id)))    return err(400, 'Invalid confession id')
  if (!ACTIONS.includes(action))  return err(400, "action must be 'approve' or 'reject'")

  const store = Confessions()
  const record = await store.get(id, { type: 'json' }).catch(() => null)
  if (!record) return err(404, 'No confession with that id')

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
