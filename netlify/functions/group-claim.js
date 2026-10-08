// Group ticket claims - HTTP boundary over lib/group-domain.js
//
//   POST /.netlify/functions/group-claim { action:'open',  tier, size, organiserName, crewCode? }
//   POST /.netlify/functions/group-claim { action:'claim', code, name, email }
//   GET  /.netlify/functions/group-claim?code=AB123
//
// Claiming returns that member's own Paystack checkout URL. Money is never
// pooled: each person pays for their own ticket, so there is no refund path
// and nobody holds anyone else's cash.

import { ok, err, preflight, limitBody } from './lib/cors.js'
import { rateLimit } from './lib/ratelimit.js'
import { getStore } from '@netlify/blobs'
import { getTier } from './lib/ticket.js'
import { initTransaction } from './lib/paystack.js'
import {
  validateOpen, validateClaim, newGroup, addClaim, publicGroup,
  slotsLeft, generateCode, normaliseCode, CODE_RE,
} from './lib/group-domain.js'

const Store = () => getStore({ name: 'sf26-groups', consistency: 'strong' })
const key = code => `group:${code}`

async function allocateCode(store, attempts = 8) {
  for (let i = 0; i < attempts; i++) {
    const code = generateCode()
    if (!(await store.get(key(code), { type: 'json' }).catch(() => null))) return code
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

  if (body.action === 'open')  return open(event, body)
  if (body.action === 'claim') return claim(event, body)
  return err(400, "action must be 'open' or 'claim'")
}

async function open(event, body) {
  const limited = await rateLimit(event, { name: 'group-open', limit: 3, windowSec: 1800 })
  if (limited) return limited

  const v = validateOpen(body)
  if (!v.ok) return err(400, v.error)

  const store = Store()
  const code = await allocateCode(store)
  if (!code) return err(503, 'Could not allocate a group code. Try again.')

  const crewCode = body.crewCode ? normaliseCode(body.crewCode) : null
  const group = newGroup({
    ...v.value,
    code,
    crewCode: crewCode && CODE_RE.test(crewCode) ? crewCode : null,
    now: new Date().toISOString(),
  })
  await store.setJSON(key(code), group)

  return ok({ success: true, group: publicGroup(group, new Date().toISOString()) })
}

async function claim(event, body) {
  const limited = await rateLimit(event, { name: 'group-claim', limit: 8, windowSec: 600 })
  if (limited) return limited

  const v = validateClaim(body)
  if (!v.ok) return err(400, v.error)

  const store = Store()
  const group = await store.get(key(v.value.code), { type: 'json' }).catch(() => null)
  if (!group) return err(404, 'No group with that code')

  const now = new Date().toISOString()
  if (slotsLeft(group, now) <= 0) {
    const mine = (group.claims || []).find(c => c.email === v.value.email)
    if (!mine) return err(409, 'This group is full')
  }

  // Price comes from the tier table, never from the request.
  const tier = getTier(group.tier)
  if (!tier) return err(500, 'This group has an unknown ticket tier')

  const payment = await initTransaction({
    email: v.value.email,
    amountKobo: tier.priceNGN * 100,
    metadata: {
      name: v.value.name,
      tier: group.tier,
      qty: 1,
      groupCode: group.code,
      custom_fields: [
        { display_name: 'Group Code', variable_name: 'group_code', value: group.code },
        { display_name: 'Ticket Tier', variable_name: 'tier', value: tier.label },
      ],
    },
  })
  if (!payment.ok) return err(payment.status, payment.error)

  const result = addClaim(group, { ...v.value, reference: payment.reference }, now)
  if (!result.ok) return err(409, result.error)

  await store.setJSON(key(group.code), result.group)

  return ok({
    success: true,
    payment_url: payment.authorizationUrl,
    reference: payment.reference,
    group: publicGroup(result.group, now),
  })
}

async function read(event) {
  const code = normaliseCode((event.queryStringParameters || {}).code)
  if (!CODE_RE.test(code)) return err(400, 'Invalid group code')

  const group = await Store().get(key(code), { type: 'json' }).catch(() => null)
  if (!group) return err(404, 'No group with that code')

  return ok({ group: publicGroup(group, new Date().toISOString()) })
}
