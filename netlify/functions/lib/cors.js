export const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Content-Type': 'application/json',
}

export const ok = (data) => ({
  statusCode: 200,
  headers: CORS,
  body: JSON.stringify(data),
})

export const err = (code, message) => ({
  statusCode: code,
  headers: CORS,
  body: JSON.stringify({ error: message }),
})

export const preflight = () => ({ statusCode: 204, headers: CORS, body: '' })

// Guard against oversized bodies before JSON.parse — prevents memory-based DoS.
// maxBytes defaults to 8 KB (generous for all our forms).
export const limitBody = (event, maxBytes = 8192) => {
  const declared = parseInt(event.headers?.['content-length'] || '0', 10)
  if (declared > maxBytes) return err(413, 'Request body too large')
  const raw = event.body || ''
  if (raw.length > maxBytes) return err(413, 'Request body too large')
  return null
}
