// POST /.netlify/functions/raffle-enter
// Body: { email, raffleId, name? }
// Returns: { success, alreadyEntered?, entryNum, totalEntries }

import { ok, err, preflight } from './lib/cors.js'
import { rateLimit } from './lib/ratelimit.js'
import { sendEmail, raffleEmail } from './lib/email.js'
import { getStore } from '@netlify/blobs'

const Raffles = () => getStore({ name: 'sf26-raffles', consistency: 'strong' })

const VALID_RAFFLE_IDS = ['rfl1', 'rfl2', 'rfl3', 'rfl4']

export const handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') return preflight()
  if (event.httpMethod !== 'POST') return err(405, 'Method not allowed')

  const limited = await rateLimit(event, { name: 'raffle-enter', limit: 5, windowSec: 600 })
  if (limited) return limited

  let body
  try { body = JSON.parse(event.body || '{}') } catch { return err(400, 'Invalid JSON') }

  const { email, raffleId, name } = body
  if (!email) return err(400, 'email is required')
  if (!raffleId) return err(400, 'raffleId is required')
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return err(400, 'Invalid email address')
  if (!VALID_RAFFLE_IDS.includes(raffleId)) return err(400, 'Invalid raffle ID')

  const store    = Raffles()
  const entryKey = `${raffleId}:${email.toLowerCase().trim()}`
  const listKey  = `${raffleId}:_count`

  const existing = await store.get(entryKey, { type: 'json' }).catch(() => null)
  if (existing) {
    return ok({ success: true, alreadyEntered: true, entryNum: existing.entryNum, totalEntries: existing.entryNum })
  }

  const countData = await store.get(listKey, { type: 'json' }).catch(() => null)
  const current   = countData?.count ?? 0
  const entryNum  = current + 1

  const record = {
    email:     email.toLowerCase().trim(),
    name:      (name || '').trim(),
    raffleId,
    entryNum,
    enteredAt: new Date().toISOString(),
  }

  await store.setJSON(entryKey, record)
  await store.setJSON(listKey, { count: entryNum, updatedAt: new Date().toISOString() })

  // Send confirmation email when a name is provided
  if (record.name) {
    sendEmail({
      to: record.email,
      subject: `Raffle Entry #${String(entryNum).padStart(4, '0')} — Sneakers Fest '26`,
      html: raffleEmail({ name: record.name, raffleId, entryNum }),
    }).catch(e => console.error('[raffle] email error', e))
  }

  return ok({ success: true, entryNum, totalEntries: entryNum })
}
