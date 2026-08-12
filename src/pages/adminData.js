// Talking to /.netlify/functions/admin.
//
// The dashboard used to read the *admin's own browser localStorage* and open
// with a password compiled into the public JS bundle. So a vendor applying
// from Lagos landed in Netlify Blobs, and the organiser opened /admin and saw
// "None yet". Everything real now comes through here.

const ENDPOINT = '/.netlify/functions/admin'
const KEY = 'sf26_admin_secret'

// sessionStorage, not localStorage: the secret dies with the tab.
export function getSecret() {
  try { return sessionStorage.getItem(KEY) || '' } catch { return '' }
}
export function setSecret(s) {
  try { sessionStorage.setItem(KEY, s) } catch {}
}
export function clearSecret() {
  try { sessionStorage.removeItem(KEY) } catch {}
}

export class AdminError extends Error {
  constructor(status, message) { super(message); this.status = status }
}

export async function fetchResource(resource, secret = getSecret()) {
  const res = await fetch(`${ENDPOINT}?resource=${encodeURIComponent(resource)}`, {
    headers: { Authorization: `Bearer ${secret}` },
  })

  if (!res.ok) {
    let message = `Request failed (${res.status})`
    if (res.status === 401) message = 'That access code was not accepted.'
    if (res.status === 503) message = 'Admin access is not configured. Set ADMIN_SECRET in Netlify.'
    else {
      try {
        const body = await res.json()
        if (body?.error) message = body.error
      } catch {}
    }
    throw new AdminError(res.status, message)
  }

  return res.json()
}

/** Used by the sign-in gate: a cheap call that either authorises or does not. */
export async function verify(secret) {
  await fetchResource('summary', secret)
  return true
}

/**
 * CSV from whatever rows we were handed. Columns come from the union of the
 * rows' own keys, so a resource gaining a field does not silently drop it.
 */
export function toCSV(rows) {
  if (!rows?.length) return ''
  const cols = [...rows.reduce((set, r) => {
    Object.keys(r || {}).forEach(k => set.add(k))
    return set
  }, new Set())]

  const cell = v => {
    if (v === null || v === undefined) return ''
    const s = typeof v === 'object' ? JSON.stringify(v) : String(v)
    return `"${s.replace(/"/g, '""')}"`
  }

  return [cols.join(','), ...rows.map(r => cols.map(c => cell(r[c])).join(','))].join('\n')
}

export function downloadCSV(name, rows) {
  const csv = toCSV(rows)
  if (!csv) return false
  const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv' }))
  const a = document.createElement('a')
  a.href = url
  a.download = `${name}.csv`
  a.click()
  URL.revokeObjectURL(url)
  return true
}
