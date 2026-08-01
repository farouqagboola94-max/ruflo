// Group ticket claims - domain rules and handler behaviour.
//
// Run: node tests/group-claim.test.mjs

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

const G = await import(pathToFileURL(join(FN, 'lib', 'group-domain.js')).href)

const T0 = '2026-01-01T12:00:00.000Z'
const plus = mins => new Date(Date.parse(T0) + mins * 60000).toISOString()
const mk = (size = 3) => G.newGroup({ code: 'AC234', tier: 'vip', size, organiserName: 'Ade', now: T0 })

console.log('domain:')
check('tier must be known', G.validateOpen({ tier: 'platinum', size: 3, organiserName: 'Ade' }).ok === false)
check('size below minimum is rejected', G.validateOpen({ tier: 'vip', size: 1, organiserName: 'Ade' }).ok === false)
check('size above maximum is rejected', G.validateOpen({ tier: 'vip', size: 99, organiserName: 'Ade' }).ok === false)
check('non-numeric size is rejected', G.validateOpen({ tier: 'vip', size: 'lots', organiserName: 'Ade' }).ok === false)
check('valid open is accepted', G.validateOpen({ tier: 'VIP', size: '4', organiserName: 'Ade' }).ok === true)
check('tier is lowercased', G.validateOpen({ tier: 'VIP', size: 4, organiserName: 'Ade' }).value.tier === 'vip')
check('bad email is rejected', G.validateClaim({ code: 'AC234', name: 'Bola', email: 'nope' }).ok === false)
check('email is lowercased', G.validateClaim({ code: 'AC234', name: 'Bola', email: 'B@X.COM' }).value.email === 'b@x.com')

let g = mk(3)
check('a new group has all slots free', G.slotsLeft(g, T0) === 3)

g = G.addClaim(g, { name: 'Bola', email: 'b@x.com', reference: 'r1' }, T0).group
check('claiming consumes a slot', G.slotsLeft(g, T0) === 2)

// Expiry is derived from the clock, not stored.
check('an unpaid claim still holds its slot inside the window',
  G.slotsLeft(g, plus(G.HOLD_MINUTES - 1)) === 2)
check('an unpaid claim releases its slot after the window',
  G.slotsLeft(g, plus(G.HOLD_MINUTES + 1)) === 3)

const paid = G.markPaid(g, 'r1', T0)
check('markPaid flips the matching claim', paid.ok && paid.group.claims[0].paid === true)
check('a paid claim never expires', G.slotsLeft(paid.group, plus(9999)) === 2)
check('markPaid on an unknown reference is a no-op', G.markPaid(g, 'nope', T0).ok === false)

const again = G.addClaim(g, { name: 'Bola', email: 'b@x.com', reference: 'r2' }, plus(1))
check('re-claiming an unpaid slot replaces it rather than taking a second',
  again.ok && again.replaced && G.slotsLeft(again.group, plus(1)) === 2)
check('re-claiming after paying is refused',
  G.addClaim(paid.group, { name: 'Bola', email: 'b@x.com', reference: 'r3' }, T0).ok === false)

let full = mk(2)
full = G.addClaim(full, { name: 'A', email: 'a@x.com', reference: 'ra' }, T0).group
full = G.addClaim(full, { name: 'B', email: 'b@x.com', reference: 'rb' }, T0).group
check('a full group refuses a new claimant',
  G.addClaim(full, { name: 'C', email: 'c@x.com', reference: 'rc' }, T0).ok === false)
check('slots free up once holds expire',
  G.addClaim(full, { name: 'C', email: 'c@x.com', reference: 'rc' }, plus(G.HOLD_MINUTES + 1)).ok === true)

const pub = G.publicGroup(g, T0)
check('public projection hides member emails', JSON.stringify(pub).includes('b@x.com') === false)
check('public projection hides paystack references', JSON.stringify(pub).includes('r1') === false)
check('public projection exposes price from the tier table', pub.priceNGN === 10000)

// ── Handler ───────────────────────────────────────────────────────────
const dir = await mkdtemp(join(tmpdir(), 'sf26-group-'))
await mkdir(join(dir, 'lib'), { recursive: true })
await mkdir(join(dir, 'node_modules', '@netlify', 'blobs'), { recursive: true })

await writeFile(join(dir, 'node_modules', '@netlify', 'blobs', 'index.js'), `
export const _data = new Map()
export function getStore() {
  return {
    async get(k) { return _data.has(k) ? JSON.parse(_data.get(k)) : null },
    async setJSON(k, v) { _data.set(k, JSON.stringify(v)) },
    async list() { return { blobs: [..._data.keys()].map(k => ({ key: k })) } },
  }
}
`)
await writeFile(join(dir, 'node_modules', '@netlify', 'blobs', 'package.json'),
  JSON.stringify({ name: '@netlify/blobs', version: '0.0.0', type: 'module', main: 'index.js' }))
await writeFile(join(dir, 'package.json'), JSON.stringify({ type: 'module' }))

for (const f of ['cors.js', 'text.js', 'crew-domain.js', 'ticket.js', 'group-domain.js']) {
  await copyFile(join(FN, 'lib', f), join(dir, 'lib', f))
}
await writeFile(join(dir, 'lib', 'ratelimit.js'), 'export async function rateLimit() { return null }\n')
// Stub Paystack so no network call happens and references are predictable.
await writeFile(join(dir, 'lib', 'paystack.js'), `
export const calls = []
let n = 0
export const siteUrl = () => 'https://example.test'
export async function initTransaction(args) {
  calls.push(args)
  n++
  return { ok: true, reference: 'PSK_' + n, authorizationUrl: 'https://pay.test/' + n }
}
`)
await copyFile(join(FN, 'group-claim.js'), join(dir, 'group-claim.js'))

const { handler } = await import(pathToFileURL(join(dir, 'group-claim.js')).href)
const { calls } = await import(pathToFileURL(join(dir, 'lib', 'paystack.js')).href)
const post = b => handler({ httpMethod: 'POST', body: JSON.stringify(b), headers: {} })
const get = q => handler({ httpMethod: 'GET', queryStringParameters: q, headers: {} })
const json = r => JSON.parse(r.body)

console.log('\nhandler:')
const opened = await post({ action: 'open', tier: 'vip', size: 3, organiserName: 'Ade' })
check('open returns 200', opened.statusCode === 200)
const code = json(opened).group.code
check('open reports all slots free', json(opened).group.slotsLeft === 3)

const c1 = await post({ action: 'claim', code, name: 'Bola', email: 'bola@x.com' })
check('claim returns a payment url', c1.statusCode === 200 && json(c1).payment_url.startsWith('https://pay.test/'))
check('claim consumes a slot', json(c1).group.slotsLeft === 2)

check('claim charges the tier price server-side, not a client value',
  calls[0].amountKobo === 10000 * 100)
check('claim tags the transaction with the group code',
  calls[0].metadata.groupCode === code)
check('claim always buys exactly one ticket', calls[0].metadata.qty === 1)

check('claim against an unknown group is 404',
  (await post({ action: 'claim', code: 'ZZZZZ', name: 'Bola', email: 'b@x.com' })).statusCode === 404)
check('claim with a bad email is 400',
  (await post({ action: 'claim', code, name: 'Bola', email: 'bad' })).statusCode === 400)
check('open with an unknown tier is 400',
  (await post({ action: 'open', tier: 'platinum', size: 3, organiserName: 'Ade' })).statusCode === 400)
check('unknown action is 400', (await post({ action: 'cancel' })).statusCode === 400)

const view = await get({ code })
check('lookup returns the group', view.statusCode === 200 && json(view).group.code === code)
check('lookup never leaks emails', JSON.stringify(json(view)).includes('bola@x.com') === false)
check('lookup with a bad code is 400', (await get({ code: 'nope!' })).statusCode === 400)

// Fill the group and confirm the boundary refuses an extra person.
await post({ action: 'claim', code, name: 'Chi', email: 'chi@x.com' })
await post({ action: 'claim', code, name: 'Dele', email: 'dele@x.com' })
check('claiming a full group is 409',
  (await post({ action: 'claim', code, name: 'Late', email: 'late@x.com' })).statusCode === 409)

await rm(dir, { recursive: true, force: true })

console.log(`\ngroup-claim: ${pass} passed, ${fail} failed`)
process.exit(fail ? 1 : 0)
