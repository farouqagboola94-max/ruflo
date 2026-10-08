import { useEffect, useState } from 'react'

// The AI sections used to call api.anthropic.com straight from the browser
// with a key the visitor pasted into localStorage. No ordinary visitor has
// one, so all seventeen of them were dead on the public site.
//
// The call now goes to /.netlify/functions/ai, which holds the organiser's
// key and enforces the spend caps. Nothing here needs a key, and there is no
// longer anywhere for a visitor to put one.

const ENDPOINT = '/.netlify/functions/ai'

// Availability is asked for during render by every AI section, so it is cached
// module-side and probed once. Subscribers re-render when the answer lands.
let available = null          // null = not yet known
let probe = null
const listeners = new Set()

function publish(value) {
  available = value
  for (const fn of listeners) fn(value)
}

function checkAvailability() {
  if (probe) return probe
  probe = fetch(ENDPOINT)
    .then(r => (r.ok ? r.json() : null))
    .then(d => { publish(Boolean(d?.available)); return available })
    .catch(() => { publish(false); return false })
  return probe
}

/**
 * Whether the AI features can actually run right now.
 *
 * `null` means the answer has not arrived yet - sections should treat that as
 * "not yet", which is honest: until we hear back we cannot promise anything.
 */
export function aiEnabled() {
  if (available === null) checkAvailability()
  return available === true
}

/**
 * Await the availability answer. For callers outside render - the chat asks
 * this the moment someone sends a message, which can be before the probe that
 * `aiEnabled()` kicked off has landed.
 */
export function aiAvailable() {
  if (available !== null) return Promise.resolve(available)
  return checkAvailability().then(() => available === true)
}

/**
 * Subscribe to the availability answer so a section re-renders once it lands.
 */
export function useAiAvailable() {
  const [state, setState] = useState(available)
  useEffect(() => {
    listeners.add(setState)
    checkAvailability()
    return () => listeners.delete(setState)
  }, [])
  return state === true
}

// `model` is accepted and ignored: the server pins one model so a caller
// cannot ask for an expensive one. Sections still pass it, so it is destructured
// here rather than forwarded.
export async function claudeChat(messages, { feature = 'sf26', maxTokens, system, model } = {}) {
  void model
  const res = await fetch(ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ feature, messages, maxTokens, system }),
  })

  if (!res.ok) {
    if (res.status === 503) publish(false)
    let message = `The AI service could not answer that (${res.status})`
    try {
      const data = await res.json()
      if (data?.error) message = data.error
    } catch {}
    throw new Error(message)
  }

  const data = await res.json()
  return data.text || ''
}

// Kept so the sections that import it keep compiling. There is no visitor-held
// key any more, and nothing should ask for one.
export function getApiKey() { return '' }
export function setApiKey() {}

export function routeModel() { return 'fast' }
