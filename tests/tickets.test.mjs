// The ticket lifecycle: taking money, and letting people in.
//
// Run: node tests/tickets.test.mjs
//
// These two endpoints had no tests at all. verify-payment had fifteen, but the
// endpoint that INITIATES the transaction and mints the reference those tests
// depend on had none, and neither did the one the gate runs on.
//
// They are the two places a bug is expensive rather than annoying: one takes
// money, the other decides who gets through the door on December 12.
//
// The real lib/paystack.js runs here - only the network is stubbed - so the
// amount actually sent upstream is what gets asserted.

import { mkdtemp, mkdir, writeFile, copyFile, rm } from 'fs/promises'
import { tmpdir } from 'os'
import { join, dirname } from 'path'
import { fileURLToPath, pathToFileURL } from 'url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const FN = join(root, 'netlify', 'functions')

let pass = 0, fail = 0
const check = (name, cond) => {
  if (cond) { pass++; console.log('  PASS  ' + name) }
  else      { fail++; console.error('  FAIL  ' + name) }
}

const dir = await mkdtemp(join(tmpdir(), 'sf26-tickets-'))
await mkdir(join(dir, 'lib'), { recursive: true })
await mkdir(join(dir, 'node_modules', '@netlify', 'blobs'), { recursive: true })

// The real client against an in-memory edge, rather than a hand-written
// stand-in for the store.
//
// The stand-in that used to live here had no getWithMetadata and ignored write
// conditions, so once check-in began using a conditional write every scan
// "lost" and eleven assertions failed against perfectly correct code. A stub
// that does not implement what the code under test relies on does not test it.
const REAL_BLOBS = pathToFileURL(join(root, 'node_modules', '@netlify', 'blobs', 'dist', 'main.js')).href
const EDGE_HELPER = pathToFileURL(join(root, 'tests', 'helpers', 'blob-edge.mjs')).href
await writeFile(join(dir, 'node_modules', '@netlify', 'blobs', 'index.js'), `
import { getStore as realGetStore } from ${JSON.stringify(REAL_BLOBS)}
import { createBlobEdge } from ${JSON.stringify(EDGE_HELPER)}
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

for (const f of ['cors.js', 'auth.js', 'storage.js', 'ticket.js', 'paystack.js']) {
  await copyFile(join(FN, 'lib', f), join(dir, 'lib', f))
}
await writeFile(join(dir, 'lib', 'ratelimit.js'), 'export async function rateLimit() { return null }\n')
await copyFile(join(FN, 'ticket-purchase.js'), join(dir, 'ticket-purchase.js'))
await copyFile(join(FN, 'ticket-checkin.js'), join(dir, 'ticket-checkin.js'))

const { handler: purchase } = await import(pathToFileURL(join(dir, 'ticket-purchase.js')).href)
const { handler: checkin }  = await import(pathToFileURL(join(dir, 'ticket-checkin.js')).href)
const { generateTicketId, TIERS } = await import(pathToFileURL(join(dir, 'lib', 'ticket.js')).href)
const { edge } = await import(pathToFileURL(join(dir, 'node_modules', '@netlify', 'blobs', 'index.js')).href)
const storage = await import(pathToFileURL(join(dir, 'lib', 'storage.js')).href)

// The suite used to poke the store's backing map directly and synchronously.
// It now goes through the same storage layer the functions use - which is both
// closer to reality and the only way to reach a store behind a real client.
const resetStore = () => edge.reset()
const putRecord = (key, value) => storage.set(storage.Tickets, key, value)
const readRecord = (key) => storage.get(storage.Tickets, key)

const json = r => JSON.parse(r.body)

// Stand in for Paystack and record exactly what it was asked to charge.
let upstream = []
let upstreamReply = () => ({
  ok: true,
  json: async () => ({ status: true, data: { reference: 'ps_ref_001', authorization_url: 'https://pay.test/xyz' } }),
})
globalThis.fetch = async (url, opts) => {
  upstream.push({ url, body: JSON.parse(opts.body), headers: opts.headers })
  return upstreamReply()
}

const buy = body => purchase({ httpMethod: 'POST', body: JSON.stringify(body), headers: {} })
const order = (o = {}) => ({ name: 'Ada Okoye', email: 'ada@example.com', tier: 'vip', ...o })

console.log('\nwithout a payment key configured:')

delete process.env.PAYSTACK_SECRET_KEY
const unconfigured = await buy(order())
check('a purchase is refused rather than half-completed', unconfigured.statusCode === 500)
check('and nothing was sent upstream', upstream.length === 0)

process.env.PAYSTACK_SECRET_KEY = 'sk_test_secret'

console.log('\na normal purchase:')

upstream = []
const bought = await buy(order())
check('it succeeds', bought.statusCode === 200)
check('it returns somewhere to pay', json(bought).payment_url === 'https://pay.test/xyz')
check('it returns the reference verify-payment will look for', json(bought).reference === 'ps_ref_001')
check('exactly one upstream call is made', upstream.length === 1)
check('the secret key is sent as a bearer token',
  upstream[0].headers.Authorization === 'Bearer sk_test_secret')
check('the secret never comes back to the caller', !bought.body.includes('sk_test_secret'))

console.log('\nthe price is decided by the server, not the buyer:')

// This is the assertion that matters most in this file. VIP is 10,000 naira,
// which is 1,000,000 kobo.
check('a VIP ticket is charged at the tier price',
  upstream[0].body.amount === TIERS.vip.priceNGN * 100)

upstream = []
await buy(order({ amount: 1, amountKobo: 1, price: 1, priceNGN: 1, total: 1 }))
check('an amount in the request body is ignored entirely',
  upstream[0].body.amount === TIERS.vip.priceNGN * 100)

upstream = []
await buy(order({ tier: 'phalanx' }))
check('the most expensive tier is charged correctly',
  upstream[0].body.amount === TIERS.phalanx.priceNGN * 100)

upstream = []
await buy(order({ tier: 'GENERAL' }))
check('the tier name is case-insensitive',
  upstream[0].body.amount === TIERS.general.priceNGN * 100)

console.log('\nquantity:')

upstream = []
await buy(order({ quantity: 3 }))
check('three tickets cost three times one', upstream[0].body.amount === TIERS.vip.priceNGN * 3 * 100)

upstream = []
await buy(order({ qty: 2 }))
check('the API spelling of the field also works', upstream[0].body.amount === TIERS.vip.priceNGN * 2 * 100)

upstream = []
await buy(order({ quantity: 999 }))
check('an absurd quantity is capped at ten', upstream[0].body.amount === TIERS.vip.priceNGN * 10 * 100)

upstream = []
await buy(order({ quantity: 0 }))
check('a quantity of zero still charges for one, never zero',
  upstream[0].body.amount === TIERS.vip.priceNGN * 100)

upstream = []
await buy(order({ quantity: -5 }))
check('a negative quantity cannot produce a negative charge',
  upstream[0].body.amount === TIERS.vip.priceNGN * 100)

upstream = []
await buy(order({ quantity: 2.7 }))
check('a fractional quantity is floored to whole tickets',
  upstream[0].body.amount === TIERS.vip.priceNGN * 2 * 100)

upstream = []
await buy(order({ quantity: 'lots' }))
check('a non-numeric quantity falls back to one',
  upstream[0].body.amount === TIERS.vip.priceNGN * 100)

console.log('\nrefusals:')

check('an unknown tier is refused', (await buy(order({ tier: 'diamond' }))).statusCode === 400)
check('and the refusal names the valid tiers',
  (await buy(order({ tier: 'diamond' }))).body.includes('phalanx'))
check('a missing tier is refused',  (await buy({ name: 'A', email: 'a@e.com' })).statusCode === 400)
check('a missing name is refused',  (await buy({ email: 'a@e.com', tier: 'vip' })).statusCode === 400)
check('a missing email is refused', (await buy({ name: 'A', tier: 'vip' })).statusCode === 400)
check('a malformed email is refused', (await buy(order({ email: 'not-an-email' }))).statusCode === 400)
check('an over-long name is refused', (await buy(order({ name: 'x'.repeat(121) }))).statusCode === 400)
check('an over-long phone is refused', (await buy(order({ phone: '0'.repeat(31) }))).statusCode === 400)
check('malformed JSON is refused',
  (await purchase({ httpMethod: 'POST', body: '{oops', headers: {} })).statusCode === 400)
check('GET is refused', (await purchase({ httpMethod: 'GET', headers: {} })).statusCode === 405)

upstream = []
await buy(order({ tier: 'diamond' }))
check('a refused order never reaches the payment provider', upstream.length === 0)

console.log('\nthe pending record verify-payment reconciles against:')

resetStore()
upstream = []
upstreamReply = () => ({
  ok: true,
  json: async () => ({ status: true, data: { reference: 'ps_ref_pending', authorization_url: 'https://pay.test/p' } }),
})
await buy(order({ name: 'Bem Tor', email: 'bem@example.com', tier: 'vvip', quantity: 2 }))

const pending = await readRecord('pending:ps_ref_pending')
check('a pending record is written under the reference', Boolean(pending))
check('it records the buyer', pending.name === 'Bem Tor' && pending.email === 'bem@example.com')
check('it records the tier and quantity', pending.tier === 'vvip' && pending.qty === 2)
check('it is marked pending, not paid', pending.status === 'pending')
check('it carries a timestamp', Boolean(pending.createdAt))

console.log('\nwhen the payment provider fails:')

upstreamReply = () => ({ ok: true, json: async () => ({ status: false, message: 'Invalid key' }) })
const rejected = await buy(order())
check('a refusal upstream becomes a 502, not a success', rejected.statusCode === 502)

upstreamReply = () => { throw new Error('network down') }
const unreachable = await buy(order())
check('an unreachable provider is a 502, not a crash', unreachable.statusCode === 502)
check('and says so in plain terms', /payment provider/i.test(unreachable.body))

// ─────────────────────────────────────────────────────────────────────────────

console.log('\nthe gate - who gets in:')

const DOOR = 'door-code'
const ADMIN = 'admin-code'
process.env.ADMIN_SECRET = ADMIN
delete process.env.DOOR_SECRET

const scan = (ticketId, secret = ADMIN) => checkin({
  httpMethod: 'POST',
  body: JSON.stringify({ ticketId }),
  headers: { authorization: `Bearer ${secret}` },
})

resetStore()
const ticketId = generateTicketId('vip', 'ps_ref_001')
await putRecord(`ticket:${ticketId}`, ({
  ticketId, name: 'Ada Okoye', email: 'ada@example.com', tier: 'vip', qty: 2,
  confirmedAt: '2026-12-01T10:00:00.000Z',
}))

const first = await scan(ticketId)
check('a valid ticket is admitted', json(first).success === true)
check('it is not flagged as already used', json(first).alreadyUsed === false)
check('the gate is told who it is', json(first).name === 'Ada Okoye')
check('and how many people the ticket covers', json(first).qty === 2)
check('and the tier, for wristband colour', json(first).tier === 'vip')
check('a check-in time is recorded', Boolean(json(first).checkedInAt))

console.log('\nre-scanning the same ticket:')

const firstTime = json(first).checkedInAt
const second = await scan(ticketId)
check('a second scan does NOT admit again', json(second).success === false)
check('it says the ticket is already used', json(second).alreadyUsed === true)
// If a re-scan overwrote the timestamp, the record of when someone actually
// entered would be lost - and a passed-back ticket would look freshly used.
check('the original entry time is preserved, not overwritten',
  json(second).checkedInAt === firstTime)
check('the gate still sees the name, to talk to the person holding it',
  json(second).name === 'Ada Okoye')

const stored = await readRecord(`ticket:${ticketId}`)
check('the stored ticket kept its first check-in time', stored.checkedInAt === firstTime)

console.log('\nbad scans:')

check('an unknown ticket is a 404', (await scan('SF26-VIP-ABCDEF')).statusCode === 404)
check('a malformed id is refused before any lookup', (await scan('NOT-A-TICKET')).statusCode === 400)
check('a lowercase id is refused', (await scan(ticketId.toLowerCase())).statusCode === 400)
check('an empty id is refused', (await scan('')).statusCode === 400)
check('an id with the wrong tier code length is refused',
  (await scan('SF26-VIPP-ABCDEF')).statusCode === 400)
check('GET is refused', (await checkin({ httpMethod: 'GET', headers: { authorization: `Bearer ${ADMIN}` } })).statusCode === 405)

console.log('\nwho may work the gate:')

check('an unauthenticated scan is refused', (await scan(ticketId, 'guess')).statusCode === 401)
check('a missing header is refused',
  (await checkin({ httpMethod: 'POST', body: '{}', headers: {} })).statusCode === 401)

// With DOOR_SECRET set, gate staff get a code that admits people but cannot
// read the ticket, vendor or contact lists through admin.js.
process.env.DOOR_SECRET = DOOR
await putRecord(`ticket:${ticketId}`, ({ ticketId, name: 'Ada', tier: 'vip', qty: 1 }))
check('the door code works once it is set', json(await scan(ticketId, DOOR)).success === true)

await putRecord(`ticket:${ticketId}`, ({ ticketId, name: 'Ada', tier: 'vip', qty: 1 }))
check('the admin code still works at the gate too',
  json(await scan(ticketId, ADMIN)).success === true)
check('an old or guessed code does not', (await scan(ticketId, 'stale')).statusCode === 401)

console.log('\nthe gate sees no more than it needs:')

await putRecord(`ticket:${ticketId}`, ({
  ticketId, name: 'Ada', tier: 'vip', qty: 1,
  email: 'private@example.com', paystackRef: 'ps_secret_ref', amountNGN: 10000,
}))
const scanned = await scan(ticketId, DOOR)
check('the buyer email is not handed to door staff', !scanned.body.includes('private@example.com'))
check('the payment reference is not either', !scanned.body.includes('ps_secret_ref'))

await rm(dir, { recursive: true, force: true })
delete process.env.PAYSTACK_SECRET_KEY
delete process.env.ADMIN_SECRET
delete process.env.DOOR_SECRET

console.log(`\ntickets: ${pass} passed, ${fail} failed\n`)
process.exit(fail ? 1 : 0)
