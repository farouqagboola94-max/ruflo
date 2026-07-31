import { getStore } from '@netlify/blobs'
import { err } from './cors.js'

const Store = () => getStore({ name: 'sf26-ratelimit', consistency: 'strong' })

/**
 * Best-effort per-IP rate limiting backed by Netlify Blobs.
 *
 * This is a read-modify-write against shared storage, so it is approximate:
 * concurrent requests from one IP can interleave and let a few extra through.
 * It is a speed bump against scripted abuse of the public form endpoints —
 * several of which send mail to a caller-supplied address, so an unthrottled
 * loop burns the Resend quota and puts the sending domain's reputation at
 * risk — not a hard guarantee or a DDoS defence.
 *
 * One key per (name, ip), reused and reset in place, so nothing accumulates
 * per time-window. Growth is bounded by distinct client IPs.
 *
 * Fails OPEN: if the store is unreachable the request proceeds. Losing a
 * signup because the limiter is down is worse than missing a limit.
 */
export async function rateLimit(event, { name, limit = 5, windowSec = 600 }) {
  const ip = clientIp(event)
  const key = `${name}:${ip}`
  const now = Date.now()

  try {
    const store = Store()
    const rec = await store.get(key, { type: 'json' }).catch(() => null)

    if (!rec || typeof rec.resetAt !== 'number' || now >= rec.resetAt) {
      await store.setJSON(key, { count: 1, resetAt: now + windowSec * 1000 })
      return null
    }

    if (rec.count >= limit) {
      const retryAfter = Math.max(1, Math.ceil((rec.resetAt - now) / 1000))
      const res = err(429, `Too many requests. Try again in ${retryAfter}s.`)
      res.headers = { ...res.headers, 'Retry-After': String(retryAfter) }
      return res
    }

    await store.setJSON(key, { count: rec.count + 1, resetAt: rec.resetAt })
    return null
  } catch (e) {
    console.error('[ratelimit] store unavailable, allowing request:', e.message)
    return null
  }
}

/**
 * Netlify sets x-nf-client-connection-ip. x-forwarded-for is a fallback and
 * is client-spoofable, so treat only the FIRST entry as meaningful and accept
 * that a determined attacker can rotate it.
 */
function clientIp(event) {
  const h = event.headers || {}
  const direct = h['x-nf-client-connection-ip']
  if (direct) return direct
  const fwd = h['x-forwarded-for']
  if (fwd) return String(fwd).split(',')[0].trim()
  return 'unknown'
}
