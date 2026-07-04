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
