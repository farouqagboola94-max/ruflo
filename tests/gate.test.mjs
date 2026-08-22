// The gate: looking a ticket up, and checking it in.
//
// Run: node tests/gate.test.mjs
//
// These two functions are the whole entry path and neither had a test. The
// pass now carries a QR, which makes scanning fast, which makes two scans of
// the same ticket landing at the same moment far more likely than when a
// staff member had to type sixteen characters.
//
// Same pattern as the other function tests: a throwaway module tree with a
// stubbed storage layer beside copies of the handlers, so this runs on plain
// node with no test runner and no dependencies.

import { mkdtemp, mkdir, writeFile, copyFile } from 'fs/promises'
import { tmpdir } from 'os'
import { join, dirname } from 'path'
import { fileURLToPath, pathToFileURL } from 'url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const FN = join(root, 'netlify', 'functions')

// Every await yields, so two handlers running under Promise.all interleave at
// exactly the points a real pair of concurrent requests would.
const STORAGE_STUB = `
export const store = new Map()
export const calls = { get: 0, set: 0 }
export const Tickets = () => 'tickets'
export async function get(_s, key) {
  calls.get++
  await Promise.resolve()
  return store.has(key) ? JSON.parse(store.get(key)) : null
}
export async function set(_s, key, data) {
  calls.set++
  await Promise.resolve()
  store.set(key, JSON.stringify(data))
}
export async function del(_s, key) { store.delete(key) }
`

const dir = await mkdtemp(join(tmpdir(), 'sf26-gate-'))
await mkdir(join(dir, 'lib'))
await mkdir(join(dir, 'node_modules', '@netlify', 'blobs'), { recursive: true })

// ratelimit.js talks to blobs directly, and it is part of what is under test
// here, so it gets a real store rather than being stubbed out.
await writeFile(join(dir, 'node_modules', '@netlify', 'blobs', 'index.js'), `
export const _data = new Map()
export function getStore() {
  return {
    async get(k, opts) {
      if (!_data.has(k)) return null
      const raw = _data.get(k)
      return opts && opts.type === 'json' ? JSON.parse(raw) : raw
    },
    async set(k, v) { _data.set(k, v) },
    async setJSON(k, v) { _data.set(k, JSON.stringify(v)) },
    async delete(k) { _data.delete(k) },
    async list() { return { blobs: [..._data.keys()].map(k => ({ key: k })) } },
  }
}
`)
await writeFile(join(dir, 'node_modules', '@netlify', 'blobs', 'package.json'),
  JSON.stringify({ name: '@netlify/blobs', version: '0.0.0', type: 'module', main: 'index.js' }))
await writeFile(join(dir, 'package.json'), JSON.stringify({ type: 'module' }))

for (const f of ['cors.js', 'auth.js', 'ratelimit.js']) {
  await copyFile(join(FN, 'lib', f), join(dir, 'lib', f))
}
await writeFile(join(dir, 'lib', 'storage.js'), STORAGE_STUB)
await copyFile(join(FN, 'ticket-lookup.js'), join(dir, 'ticket-lookup.js'))
await copyFile(join(FN, 'ticket-checkin.js'), join(dir, 'ticket-checkin.js'))

process.env.DOOR_SECRET = 'door_test_secret'
process.env.ADMIN_SECRET = 'admin_test_secret'

const lookup  = (await import(pathToFileURL(join(dir, 'ticket-lookup.js')).href)).handler
const checkin = (await import(pathToFileURL(join(dir, 'ticket-checkin.js')).href)).handler
const { store } = await import(pathToFileURL(join(dir, 'lib', 'storage.js')).href)
const blobs = await import(pathToFileURL(join(dir, 'node_modules', '@netlify', 'blobs', 'index.js')).href)

let pass = 0, fail = 0
const check = (name, cond) => {
  if (cond) { pass++; console.log('  PASS  ' + name) }
  else      { fail++; console.error('  FAIL  ' + name) }
}

const TICKET = 'SF26-VIP-A1B2C3'
const seed = (over = {}) => {
  store.clear()
  store.set(`ticket:${TICKET}`, JSON.stringify({
    ticketId: TICKET, name: 'Ade Balogun', email: 'ade@example.com',
    tier: 'vip', tierLabel: 'VIP', qty: 1, status: 'confirmed',
    checkedIn: false, confirmedAt: '2026-11-01T10:00:00.000Z', ...over,
  }))
}
// Each test gets a fresh IP so the shared limiter does not leak between them.
let ipSeq = 0
const getEv = (qs, ip) => ({
  httpMethod: 'GET', queryStringParameters: qs,
  headers: { 'x-nf-client-connection-ip': ip || `10.0.0.${++ipSeq}` },
})
const postEv = (body, auth = `Bearer ${process.env.DOOR_SECRET}`) => ({
  httpMethod: 'POST', body: JSON.stringify(body),
  headers: { authorization: auth, 'x-nf-client-connection-ip': `10.1.0.${++ipSeq}` },
})
const json = r => JSON.parse(r.body)

// --- lookup ---------------------------------------------------------------

seed()
{
  const r = await lookup(getEv({ id: TICKET }))
  const b = json(r)
  check('lookup finds a ticket', r.statusCode === 200 && b.ticketId === TICKET)
  check('lookup returns what the pass renders', b.name === 'Ade Balogun' && b.tierLabel === 'VIP')
  // The endpoint is public. The buyer's email must never come back from it.
  check('lookup never returns the email', !('email' in b) && !r.body.includes('ade@example.com'))
}

{
  const r = await lookup(getEv({ id: 'sf26-vip-a1b2c3' }))
  check('lookup accepts a lowercased id', r.statusCode === 200)
}

{
  const r = await lookup(getEv({}))
  check('lookup with no arguments explains itself', r.statusCode === 400)
}

{
  // Anything that cannot be a ticket is a miss, and must not reach storage as
  // a key. Reporting 404 rather than 400 also avoids telling a prober which
  // of their guesses were well-formed.
  const shapes = ['../../secret', 'SF26-VIP-ZZZZZZ', 'SF26-VIPP-A1B2C3', 'x'.repeat(500), '{}', 'SF26-VIP-A1B2C']
  let allRejected = true
  for (const bad of shapes) {
    const r = await lookup(getEv({ id: bad }))
    if (r.statusCode !== 404) allRejected = false
  }
  check('lookup rejects every malformed id as a plain miss', allRejected)
}

{
  const r = await lookup(getEv({ ref: 'a b/../c' }))
  check('lookup rejects a malformed payment reference', r.statusCode === 404)
}

{
  seed()
  store.set('ref:PSK_REF_9', JSON.stringify({ ticketId: TICKET }))
  const r = await lookup(getEv({ ref: 'PSK_REF_9' }))
  check('lookup resolves a payment reference to the ticket', r.statusCode === 200 && json(r).ticketId === TICKET)
}

{
  // A hit returns the holder's name, so an unthrottled endpoint is an oracle
  // for who is coming. Every other public endpoint here is limited; this one
  // was not.
  blobs._data.clear()
  const ip = '203.0.113.9'
  let limited = 0
  for (let i = 0; i < 40; i++) {
    const r = await lookup(getEv({ id: TICKET }, ip))
    if (r.statusCode === 429) limited++
  }
  check('lookup throttles a caller walking the id space', limited > 0)
  check('lookup lets a normal number of reloads through', limited < 15)
}

{
  const r = await lookup({ httpMethod: 'POST', queryStringParameters: {}, headers: {} })
  check('lookup refuses a non-GET', r.statusCode === 405)
}

// --- check-in -------------------------------------------------------------

seed()
{
  const r = await checkin(postEv({ ticketId: TICKET }))
  const b = json(r)
  check('check-in admits an unused ticket', r.statusCode === 200 && b.success === true && b.alreadyUsed === false)
  check('check-in records who it was', b.name === 'Ade Balogun' && b.tier === 'vip')
  check('check-in marks the ticket used', JSON.parse(store.get(`ticket:${TICKET}`)).checkedIn === true)
}

{
  const r = await checkin(postEv({ ticketId: TICKET }))
  const b = json(r)
  check('a second scan is a duplicate, not an admission', b.success === false && b.alreadyUsed === true)
  check('a duplicate says when it was first used', typeof b.checkedInAt === 'string')
}

{
  seed()
  const r = await checkin(postEv({ ticketId: TICKET }, 'Bearer wrong'))
  check('check-in refuses a wrong door code', r.statusCode === 401)
  check('a refused scan does not mark the ticket', JSON.parse(store.get(`ticket:${TICKET}`)).checkedIn === false)
}

{
  seed()
  const r = await checkin(postEv({ ticketId: TICKET }, `Bearer ${process.env.ADMIN_SECRET}`))
  check('the organiser secret also opens the door', r.statusCode === 200)
}

{
  seed()
  const r = await checkin(postEv({ ticketId: 'SF26-VIP-ZZZZZZ' }))
  check('check-in rejects a malformed ticket id', r.statusCode === 400)
}

{
  seed()
  const r = await checkin(postEv({ ticketId: 'SF26-GEN-FFFFFF' }))
  check('check-in 404s an id that does not exist', r.statusCode === 404)
}

{
  seed()
  const r = await checkin({ httpMethod: 'POST', body: '{not json',
    headers: { authorization: `Bearer ${process.env.DOOR_SECRET}` } })
  check('check-in rejects malformed JSON', r.statusCode === 400)
}

// --- the race -------------------------------------------------------------
//
// Two scans of the same ticket at the same moment. This is the fraud the gate
// exists to stop - one screenshotted pass presented at two lanes - and it is
// the case a plain read-modify-write gets wrong.

{
  // First, show the shape of the bug, so the fix below means something. This
  // is the old logic, run against the same interleaving.
  const s = new Map([['t', JSON.stringify({ checkedIn: false })]])
  const oldCheckin = async () => {
    await Promise.resolve()
    const t = JSON.parse(s.get('t'))
    if (t.checkedIn) return { admitted: false }
    await Promise.resolve()
    s.set('t', JSON.stringify({ ...t, checkedIn: true }))
    return { admitted: true }
  }
  const [a, b] = await Promise.all([oldCheckin(), oldCheckin()])
  check('a plain read-modify-write really does admit twice', a.admitted && b.admitted)
}

{
  seed()
  const [a, b] = await Promise.all([
    checkin(postEv({ ticketId: TICKET })),
    checkin(postEv({ ticketId: TICKET })),
  ])
  const admitted = [json(a), json(b)].filter(x => x.success === true)
  check('two simultaneous scans admit exactly once', admitted.length === 1)
  check('the loser is reported as a duplicate',
    [json(a), json(b)].filter(x => x.alreadyUsed === true).length === 1)
  check('the ticket ends up used', JSON.parse(store.get(`ticket:${TICKET}`)).checkedIn === true)
}

{
  seed()
  const results = await Promise.all(
    Array.from({ length: 6 }, () => checkin(postEv({ ticketId: TICKET }))),
  )
  const admitted = results.map(json).filter(x => x.success === true)
  check('six simultaneous scans still admit at most once', admitted.length <= 1)
  check('six simultaneous scans admit at least once', admitted.length >= 1)
}

console.log(`\ngate: ${pass} passed, ${fail} failed`)
process.exit(fail ? 1 : 0)
