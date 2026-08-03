const API_KEY_STORAGE = 'catalyst-vault-api-key'

const MODELS = {
  fast:     'claude-haiku-4-5-20251001',
  balanced: 'claude-sonnet-4-5-20241022',
  smart:    'claude-sonnet-4-5-20241022',
}

export function getApiKey() {
  try { return localStorage.getItem(API_KEY_STORAGE) || '' } catch { return '' }
}

/**
 * Whether the AI-backed features can actually run. Sections use this to say
 * so up front rather than failing after the visitor has filled in a form.
 */
export function aiEnabled() {
  return Boolean(getApiKey())
}

export function setApiKey(k) {
  try { localStorage.setItem(API_KEY_STORAGE, k) } catch {}
}

export async function claudeChat(messages, { model = 'fast', system = '', maxTokens = 1024 } = {}) {
  const apiKey = getApiKey()
  if (!apiKey) throw new Error('NO_KEY')

  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
      'anthropic-dangerous-direct-browser-access': 'true',
    },
    body: JSON.stringify({
      model: MODELS[model] || model,
      max_tokens: maxTokens,
      system: system || undefined,
      messages,
    }),
  })

  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err.error?.message || `API ${res.status}`)
  }

  const data = await res.json()
  return data.content?.[0]?.text || ''
}

export function routeModel(text) {
  const t = text.toLowerCase()
  if (t.length > 800 || t.includes('analyse') || t.includes('analyze') || t.includes('explain') || t.includes('compare')) return 'smart'
  if (t.includes('pitch') || t.includes('write') || t.includes('generate') || t.includes('create')) return 'balanced'
  return 'fast'
}
