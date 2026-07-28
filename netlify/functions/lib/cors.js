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

// Reject oversized request bodies before parsing (default 64 KB)
export const limitBody = (event, maxBytes = 65536) => {
  const len = Buffer.byteLength(event.body || '', 'utf8')
  if (len > maxBytes) return err(413, 'Request body too large')
  return null
}
