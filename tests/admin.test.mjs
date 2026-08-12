// The organiser dashboard's data source, and the shared counters.
//
// Run: node tests/admin.test.mjs
//
// The dashboard used to read the admin's own browser localStorage behind a
// password compiled into the public JS bundle. A vendor applying from Lagos
// landed in Blobs; the organiser opened /admin and saw "None yet". These pin
// the endpoint it now reads, and the auth boundary in front of it.

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

const dir = await mkdtemp(join(tmpdir(), 'sf26-admin-'))
await mkdir(join(dir, 'lib'), { recursive: true })
await mkdir(join(dir, 'node_modules', '@netlify', 'blobs'), { recursive: true })

// Stores are keyed by name here so admin.js can read several at once.
await writeFile(join(dir, 'node_modules', '@netlify', 'blobs', 'index.js'), `
export const _stores = new Map()
function bucket(name) {
  if (!_stores.has(name)) _stores.set(name, new Map())
  return _stores.get(name)
}
export function getStore(opts) {
  const b = bucket(typeof opts === 'string' ? opts : opts.name)
  return {
    async get(k, opts) {
      if (!b.has(k)) return null
      const raw = b.get(k)
      return opts && opts.type === 'json' ? JSON.parse(raw) : raw
    },
    async set(k, v) { b.set(k, v) },
    async setJSON(k, v) { b.set(k, JSON.stringify(v)) },
    async delete(k) { b.delete(k) },
    async list() { return { blobs: [...b.keys()].map(k => ({ key: k })) } },
  }
}
`)
await writeFile(join(dir, 'node_modules', '@netlify', 'blobs', 'package.json'),
  JSON.stringify({ name: '@netlify/blobs', version: '0.0.0', type: 'module', main: 'index.js' }))
await writeFile(join(dir, 'package.json'), JSON.stringify({ type: 'module' }))

for (const f of ['cors.js', 'auth.js', 'storage.js', 'group-domain.js', 'ticket.js', 'text.js', 'crew-domain.js']) {
  await copyFile(join(FN, 'lib', f), join(dir, 'lib', f))
}
await writeFile(join(dir, 'lib', 'ratelimit.js'), 'export async function rateLimit() { return null }\n')
await copyFile(join(FN, 'admin.js'), join(dir, 'admin.js'))
await copyFile(join(FN, 'hype.js'), join(dir, 'hype.js'))

const { handler: admin } = await import(pathToFileURL(join(dir, 'admin.js')).href)
const { handler: hype }  = await import(pathToFileURL(join(dir, 'hype.js')).href)
const blobs = await import(pathToFileURL(join(dir, 'node_modules', '@netlify', 'blobs', 'index.js')).href)

const json = r => JSON.parse(r.body)
const SECRET = 'organiser-secret'

const get = (resource, secret = SECRET) => admin({
  httpMethod: 'GET',
  queryStringParameters: { resource },
  headers: { authorization: `Bearer ${secret}` },
})

console.log('\nthe auth boundary:')

delete process.env.ADMIN_SECRET
check('with no ADMIN_SECRET set, everything is refused', (await get('summary')).statusCode === 503)
check('an unconfigured endpoint does not leak data', !(await get('vendors')).body.includes('business'))

process.env.ADMIN_SECRET = SECRET
check('a wrong code is refused', (await get('summary', 'guess')).statusCode === 401)
check('a missing header is refused',
  (await admin({ httpMethod: 'GET', queryStringParameters: {}, headers: {} })).statusCode === 401)
check('a code that is a prefix of the real one is refused',
  (await get('summary', SECRET.slice(0, -1))).statusCode === 401)
check('a longer code containing the real one is refused',
  (await get('summary', SECRET + 'x')).statusCode === 401)
check('a multi-byte code of the same character length is refused, not a 500',
  (await get('summary', 'é'.repeat(SECRET.length))).statusCode === 401)
check('the correct code is accepted', (await get('summary')).statusCode === 200)
check('POST is refused even when authorised',
  (await admin({ httpMethod: 'POST', headers: { authorization: `Bearer ${SECRET}` } })).statusCode === 405)

console.log('\nan empty festival reports zero, never a seed:')

const empty = json(await get('summary')).summary
check('no tickets sold',   empty.ticketsSold === 0)
check('no revenue',        empty.revenueNGN === 0)
check('nobody waitlisted', empty.waitlistSize === 0)
check('no vendor apps',    empty.vendorApps === 0)
check('no RSVP seed of 1247 anywhere', !JSON.stringify(empty).includes('1247'))

console.log('\nreal submissions reach the organiser:')

const vendors = blobs._stores.get('sf26-vendors') || (blobs.getStore({ name: 'sf26-vendors' }), blobs._stores.get('sf26-vendors'))
vendors.set('lagos@example.com', JSON.stringify({
  applicationId: 'VN-001', business: 'Sole Provider', email: 'lagos@example.com',
  category: 'sneakers', booth: 'standard', status: 'pending', submittedAt: '2026-08-01T10:00:00.000Z',
}))

const v = json(await get('vendors'))
check('a vendor who applied is listed', v.total === 1)
check('their business name comes through', v.vendors[0].business === 'Sole Provider')
check('pending applications are counted', v.pending === 1)
check('the summary sees them too', json(await get('summary')).summary.vendorApps === 1)

const tickets = blobs.getStore({ name: 'sf26-tickets' })
await tickets.set('ticket:A1', JSON.stringify({ ticketId: 'A1', tier: 'VIP', amountNGN: 10000, checkedIn: true, confirmedAt: '2026-08-02T10:00:00.000Z' }))
await tickets.set('ticket:A2', JSON.stringify({ ticketId: 'A2', tier: 'GENERAL', amountNGN: 5000, confirmedAt: '2026-08-03T10:00:00.000Z' }))

const t = json(await get('tickets'))
check('sold tickets are listed', t.total === 2)
check('check-ins are counted', t.checkedIn === 1)

const s = json(await get('summary')).summary
check('revenue is the sum of what was actually paid', s.revenueNGN === 15000)
check('revenue is formatted in naira', s.revenueFormatted === '₦15,000')
check('the tier breakdown splits by tier', s.tierBreakdown.VIP.count === 1 && s.tierBreakdown.GENERAL.count === 1)

console.log('\nraffle and hype reach the organiser:')

const raffles = blobs.getStore({ name: 'sf26-raffles' })
await raffles.set('rfl1:a@e.com', JSON.stringify({ email: 'a@e.com', name: 'A', entryNum: 1, enteredAt: '2026-08-01T00:00:00.000Z' }))
await raffles.set('rfl1:b@e.com', JSON.stringify({ email: 'b@e.com', name: 'B', entryNum: 2, enteredAt: '2026-08-02T00:00:00.000Z' }))
await raffles.set('rfl2:c@e.com', JSON.stringify({ email: 'c@e.com', name: 'C', entryNum: 1, enteredAt: '2026-08-03T00:00:00.000Z' }))
await raffles.set('rfl1:_count', JSON.stringify({ count: 2 }))

const r = json(await get('raffle'))
check('every entry is listed', r.total === 3)
check('the internal counter key is not mistaken for an entry',
  r.entries.every(e => typeof e.email === 'string' && e.email.includes('@')))
check('entries are grouped by raffle', r.byRaffle.rfl1 === 2 && r.byRaffle.rfl2 === 1)
check('each entry carries its raffle id', r.entries.every(e => e.raffleId))

await blobs.getStore({ name: 'sf26-hype' }).setJSON('total', { total: 41 })
check('the hype total is readable', json(await get('hype')).total === 41)
check('an unwritten counter reads as zero, not a seed', json(await get('summary')).summary.ticketsSold === 2)

console.log('\nthe shared counters:')

const bump = (body) => hype({ httpMethod: 'POST', body: JSON.stringify(body), headers: {} })
const read = (counter) => hype({ httpMethod: 'GET', queryStringParameters: counter ? { counter } : {}, headers: {} })

check('hype starts from what is stored, not a seed', json(await read('hype')).total === 41)
check('rsvp starts at zero', json(await read('rsvp')).total === 0)

check('an rsvp increments its own counter', json(await bump({ counter: 'rsvp', taps: 1 })).total === 1)
check('the rsvp counter did not touch hype', json(await read('hype')).total === 41)
check('a tap increments hype', json(await bump({ counter: 'hype', taps: 1 })).total === 42)
check('omitting the counter defaults to hype', json(await bump({ taps: 1 })).total === 43)

check('an unknown counter is refused', (await bump({ counter: 'wallet', taps: 1 })).statusCode === 400)
check('an unknown counter cannot be read', (await read('wallet')).statusCode === 400)
check('a batch over the cap is refused', (await bump({ counter: 'hype', taps: 51 })).statusCode === 400)
check('a negative batch is refused', (await bump({ counter: 'hype', taps: -5 })).statusCode === 400)
check('a fractional batch is refused', (await bump({ counter: 'hype', taps: 1.5 })).statusCode === 400)
check('the refused batches changed nothing', json(await read('hype')).total === 43)

console.log('\nprivacy:')

const groups = blobs.getStore({ name: 'sf26-groups' })
await groups.set('group:GRP1', JSON.stringify({
  code: 'GRP1', tier: 'VIP', size: 4, createdAt: '2026-08-01T00:00:00.000Z',
  claims: [{ email: 'buyer@example.com', paid: true, paystackRef: 'ref_secret_123' }],
}))
const g = await get('groups')
check('group emails are not exposed even to the organiser view', !g.body.includes('buyer@example.com'))
check('payment references are not exposed', !g.body.includes('ref_secret_123'))
check('paid seats are still counted', json(g).seatsPaid === 1)

await rm(dir, { recursive: true, force: true })
delete process.env.ADMIN_SECRET

console.log(`\nadmin: ${pass} passed, ${fail} failed\n`)
process.exit(fail ? 1 : 0)
