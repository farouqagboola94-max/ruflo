// GET  /.netlify/functions/ai   -> { available }
// POST /.netlify/functions/ai   Body: { feature, messages, maxTokens? } -> { text }
//
// Server-side home for the AI sections. The key belongs to the organiser and
// never leaves this function. Every cap that keeps a public, billable endpoint
// safe lives in lib/ai-domain.js and is enforced here.

import { ok, err, preflight, limitBody } from './lib/cors.js'
import { rateLimit } from './lib/ratelimit.js'
import { getStore } from '@netlify/blobs'
import {
  validate, withinDailyCap, nextDailyCount, buildRequest, extractText, LIMITS,
} from './lib/ai-domain.js'

const Budget = () => getStore({ name: 'sf26-ai-budget', consistency: 'strong' })
const BUDGET_KEY = 'daily'

const ANTHROPIC_URL = 'https://api.anthropic.com/v1/messages'

const keyIsSet = () => Boolean((process.env.ANTHROPIC_API_KEY || '').trim())

export const handler = async (event, _ctx, deps = {}) => {
  const now = deps.now || Date.now()
  const fetchImpl = deps.fetch || globalThis.fetch

  if (event.httpMethod === 'OPTIONS') return preflight()

  // Sections ask this before rendering, so they can say "coming soon" up front
  // instead of failing after someone has filled in a form.
  if (event.httpMethod === 'GET') return ok({ available: keyIsSet() })

  if (event.httpMethod !== 'POST') return err(405, 'Method not allowed')

  if (!keyIsSet()) {
    return err(503, 'The AI features are not switched on yet')
  }

  const limited = await rateLimit(event, { name: 'ai', limit: 12, windowSec: 600 })
  if (limited) return limited

  const bodyErr = limitBody(event)
  if (bodyErr) return bodyErr

  let body
  try { body = JSON.parse(event.body || '{}') } catch { return err(400, 'Invalid JSON') }

  const parsed = validate(body)
  if (!parsed.ok) return err(parsed.status, parsed.message)

  // Whole-site daily ceiling. Per-IP limits stop one visitor; this stops a
  // crowd, and it is the thing standing between a public endpoint and a
  // surprise bill.
  const store = Budget()
  let record = null
  try { record = await store.get(BUDGET_KEY, { type: 'json' }) } catch {}

  if (!withinDailyCap(record, now)) {
    return err(429, 'The AI features have hit their limit for today. Try again tomorrow.')
  }

  try { await store.setJSON(BUDGET_KEY, nextDailyCount(record, now)) } catch {}

  let res
  try {
    res = await fetchImpl(ANTHROPIC_URL, {
      method: 'POST',
      headers: {
        'Content-Type':      'application/json',
        'x-api-key':         process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify(buildRequest(parsed.value)),
    })
  } catch {
    return err(502, 'Could not reach the AI service')
  }

  if (!res.ok) {
    // Upstream messages can carry request detail, so they are logged rather
    // than returned. 429 is worth passing through - it is actionable.
    let detail = ''
    try { detail = JSON.stringify(await res.json()).slice(0, 400) } catch {}
    console.error(`[ai] upstream ${res.status} for "${parsed.value.feature}": ${detail}`)
    if (res.status === 429) return err(429, 'The AI service is busy. Try again in a moment.')
    return err(502, 'The AI service could not answer that')
  }

  let payload
  try { payload = await res.json() } catch { return err(502, 'The AI service sent an unreadable reply') }

  const text = extractText(payload)
  if (!text) return err(502, 'The AI service sent an empty reply')

  return ok({ text })
}

export { LIMITS }
