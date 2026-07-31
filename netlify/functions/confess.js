// POST /.netlify/functions/confess
// Body: { confession, displayName?, city }
// Returns: { success, submissionId, slotNumber }

import { ok, err, preflight, limitBody } from './lib/cors.js'
import { rateLimit } from './lib/ratelimit.js'
import { getStore }                      from '@netlify/blobs'

const Store = () => getStore({ name: 'sf26-confessions', consistency: 'strong' })

const CITIES = ['Lagos','Abuja','Port Harcourt','Kano','Ibadan','Benin City','Enugu',
  'Kaduna','Owerri','Warri','Uyo','Calabar','Jos','Abeokuta','Akure','Other']

export const handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') return preflight()
  if (event.httpMethod !== 'POST') return err(405, 'Method not allowed')

  const limited = await rateLimit(event, { name: 'confess', limit: 5, windowSec: 600 })
  if (limited) return limited

  const bodyErr = limitBody(event, 2048)
  if (bodyErr) return bodyErr

  let body
  try { body = JSON.parse(event.body || '{}') } catch { return err(400, 'Invalid JSON') }

  const { confession, displayName, city } = body

  if (!confession || typeof confession !== 'string') return err(400, 'confession is required')
  if (!city       || typeof city       !== 'string') return err(400, 'city is required')

  if (confession.length > 220)                    return err(400, 'Confession too long (max 220)')
  if (displayName && displayName.length > 32)     return err(400, 'Name too long (max 32)')
  if (!CITIES.includes(city))                     return err(400, 'Invalid city')

  const store      = Store()
  const counterKey = '_count'
  const countData  = await store.get(counterKey, { type: 'json' }).catch(() => null)
  const slotNumber = (countData?.count ?? 0) + 1

  const submissionId = `SC26-${String(slotNumber).padStart(4, '0')}`

  const record = {
    submissionId,
    slotNumber,
    confession: confession.trim(),
    displayName: (displayName || 'Anonymous').trim(),
    city: city.trim(),
    submittedAt: new Date().toISOString(),
    relates: 0,
  }

  await store.setJSON(submissionId, record)
  await store.setJSON(counterKey, { count: slotNumber, updatedAt: new Date().toISOString() })

  return ok({ success: true, submissionId, slotNumber })
}
