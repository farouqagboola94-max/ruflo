// The gate: looking a ticket up, and checking it in.
//
// Run: node tests/gate.test.mjs
//
// These two functions are the whole entry path. Unlike the other function
// tests, this one does NOT stub @netlify/blobs. It runs the real client
// against an in-memory stand-in for the Netlify Blobs edge that speaks the
// actual wire protocol, including HTTP preconditions.
//
// That matters because check-in now depends on a conditional write to admit a
// ticket exactly once. A stubbed store would happily pretend the condition
// held and the test would prove nothing about the thing it exists to prove.

import { mkdtemp, mkdir, writeFile, copyFile } from 'fs/promises'
import { tmpdir } from 'os'
import { join, dirname } from 'path'
import { fileURLToPath, pathToFileURL } from 'url'
import { createBlobEdge } from './helpers/blob-edge.mjs'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const FN = join(root, 'netlify', 'functions')
const REAL_BLOBS = pathToFileURL(join(root, 'node_modules', '@netlify', 'blobs', 'dist', 'main.js')).href
const HELPER = pathToFileURL(join(root, 'tests', 'helpers', 'blob-edge.mjs')).href

const dir = await mkdtemp(join(tmpdir(), 'sf26-gate-'))
await mkdir(join(dir, 'lib'))
await mkdir(join(dir, 'node_modules', '@netlify', 'blobs'), { recursive: true })

// The functions call getStore({ name, consistency }) with no credentials,
// because on Netlify those come from the runtime. This shim keeps the real
// client and only supplies the missing connection details plus our fetch.
await writeFile(join(dir, 'node_modules', '@netlify', 'blobs', 'index.js'), `
import { getStore as realGetStore } from ${JSON.stringify(REAL_BLOBS)}
import { createBlobEdge } from ${JSON.stringify(HELPER)}
export const edge = createBlobEdge()
export function getStore(opts) {
  const o = typeof opts === 'string' ? { name: opts } : opts
  return realGetStore({ ...o, ...edge.options(o.name) })
}
export * from ${JSON.stringify(REAL_BLOBS)}
`)
await writeFile(join(dir, 'node_modules', '@netlify', 'blobs', 'package.json'),
  JSON.stringify({ name: '@netlify/blobs', version: '0.0.0', type: 'module', main: 'index.js' }))
await writeFile(join(dir, 'package.json'), JSON.stringify({ type: 'module' }))

// Real lib files throughout - nothing in the path under test is a stub.
for (const f of ['cors.js', 'auth.js', 'ratelimit.js', 'storage.js']) {
  await copyFile(join(FN, 'lib', f), join(dir, 'lib', f))
}
await copyFile(join(FN, 'ticket-lookup.js'), join(dir, 'ticket-lookup.js'))
await copyFile(join(FN, 'ticket-checkin.js'), join(dir, 'ticket-checkin.js'))

process.env.DOOR_SECRET = 'door_test_secret'
process.env.ADMIN_SECRET = 'admin_test_secret'

const lookup  = (await import(pathToFileURL(join(dir, 'ticket-lookup.js')).href)).handler
const checkin = (await import(pathToFileURL(join(dir, 'ticket-checkin.js')).href)).handler
const storage = await import(pathToFileURL(join(dir, 'lib', 'storage.js')).href)
const { edge } = await import(pathToFileURL(join(dir, 'node_modules', '@netlify', 'blobs', 'index.js')).href)

let pass = 0, fail = 0
const check = (name, cond) => {
  if (cond) { pass++; console.log('  PASS  ' + name) }
  else      { fail++; console.error('  FAIL  ' + name) }
}

const TICKET = 'SF26-VIP-A1B2C3'
const readTicket = () => storage.get(storage.Tickets, `ticket:${TICKET}`)
const seed = async (over = {}) => {
  edge.reset()
  await storage.set(storage.Tickets, `ticket:${TICKET}`, {
    ticketId: TICKET, name: 'Ade Balogun', email: 'ade@example.com',
    tier: 'vip', tierLabel: 'VIP', qty: 1, status: 'confirmed',
    checkedIn: false, confirmedAt: '2026-11-01T10:00:00.000Z', ...over,
  })
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

await seed()
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
  await seed()
  await storage.set(storage.Tickets, 'ref:PSK_REF_9', { ticketId: TICKET })
  const r = await lookup(getEv({ ref: 'PSK_REF_9' }))
  check('lookup resolves a payment reference to the ticket', r.statusCode === 200 && json(r).ticketId === TICKET)
}

{
  // A hit returns the holder's name, so an unthrottled endpoint is an oracle
  // for who is coming. Every other public endpoint here is limited; this one
  // was not.
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

await seed()
{
  const r = await checkin(postEv({ ticketId: TICKET }))
  const b = json(r)
  check('check-in admits an unused ticket', r.statusCode === 200 && b.success === true && b.alreadyUsed === false)
  check('check-in records who it was', b.name === 'Ade Balogun' && b.tier === 'vip')
  check('check-in marks the ticket used', (await readTicket()).checkedIn === true)
}

{
  const r = await checkin(postEv({ ticketId: TICKET }))
  const b = json(r)
  check('a second scan is a duplicate, not an admission', b.success === false && b.alreadyUsed === true)
  check('a duplicate says when it was first used', typeof b.checkedInAt === 'string')
}

{
  await seed()
  const r = await checkin(postEv({ ticketId: TICKET }, 'Bearer wrong'))
  check('check-in refuses a wrong door code', r.statusCode === 401)
  check('a refused scan does not mark the ticket', (await readTicket()).checkedIn === false)
}

{
  await seed()
  const r = await checkin(postEv({ ticketId: TICKET }, `Bearer ${process.env.ADMIN_SECRET}`))
  check('the organiser secret also opens the door', r.statusCode === 200)
}

{
  await seed()
  const r = await checkin(postEv({ ticketId: 'SF26-VIP-ZZZZZZ' }))
  check('check-in rejects a malformed ticket id', r.statusCode === 400)
}

{
  await seed()
  const r = await checkin(postEv({ ticketId: 'SF26-GEN-FFFFFF' }))
  check('check-in 404s an id that does not exist', r.statusCode === 404)
}

{
  await seed()
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
  // Force the requests to genuinely overlap. Without this the edge answers
  // synchronously enough that the calls can serialise by accident, and the
  // test would pass without ever exercising the conditional write.
  edge.setDelay(() => new Promise(r => setTimeout(r, 5)))

  await seed()
  const [a, b] = await Promise.all([
    checkin(postEv({ ticketId: TICKET })),
    checkin(postEv({ ticketId: TICKET })),
  ])
  const bodies = [json(a), json(b)]
  check('two simultaneous scans admit exactly once',
    bodies.filter(x => x.success === true).length === 1)
  check('the loser is reported as a duplicate',
    bodies.filter(x => x.alreadyUsed === true).length === 1)
  check('the ticket ends up used', (await readTicket()).checkedIn === true)
  check('the store actually refused a write',
    edge.stats.preconditionFailed > 0)
}

{
  // Twenty at once. With a conditional write this is exactly one, not at most
  // one: the losers re-read, see the ticket is now used, and report a
  // duplicate rather than failing.
  await seed()
  const results = await Promise.all(
    Array.from({ length: 20 }, () => checkin(postEv({ ticketId: TICKET }))),
  )
  const bodies = results.map(json)
  const admitted = bodies.filter(x => x.success === true)
  const duplicates = bodies.filter(x => x.alreadyUsed === true)
  check('twenty simultaneous scans admit exactly once', admitted.length === 1)
  check('the other nineteen are all told it is a duplicate', duplicates.length === 19)
  check('none of the twenty is left without an answer',
    results.every(r => r.statusCode === 200))
}

{
  // A ticket already used stays used no matter how hard it is scanned.
  await seed({ checkedIn: true, checkedInAt: '2026-12-12T13:00:00.000Z' })
  const results = await Promise.all(
    Array.from({ length: 10 }, () => checkin(postEv({ ticketId: TICKET }))),
  )
  check('an already-used ticket never admits anyone',
    results.map(json).every(x => x.success === false && x.alreadyUsed === true))
  check('and its original check-in time is not overwritten',
    (await readTicket()).checkedInAt === '2026-12-12T13:00:00.000Z')

  edge.setDelay(() => Promise.resolve())
}

console.log(`\ngate: ${pass} passed, ${fail} failed`)
process.exit(fail ? 1 : 0)
