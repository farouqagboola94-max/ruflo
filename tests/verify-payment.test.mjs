// Regression tests for the Paystack webhook handler.
//
// Run: node tests/verify-payment.test.mjs
//
// verify-payment.js imports its storage and email layers directly, so this
// builds a throwaway module tree with stubbed lib/* next to a copy of the
// handler. That keeps the test dependency-free — plain node, no runner.

import { createHmac } from 'crypto'
import { mkdtemp, mkdir, writeFile, copyFile, rm } from 'fs/promises'
import { tmpdir } from 'os'
import { join } from 'path'
import { fileURLToPath, pathToFileURL } from 'url'
import { dirname } from 'path'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const FN = join(root, 'netlify', 'functions')

const STORAGE_STUB = `
export const store = new Map()
export const Tickets = () => 'tickets'
export async function get(_s, key) { return store.has(key) ? JSON.parse(store.get(key)) : null }
export async function set(_s, key, data) { store.set(key, JSON.stringify(data)) }
export async function del(_s, key) { store.delete(key) }
`

const EMAIL_STUB = `
export const sent = []
export const esc = (s) => String(s || '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;')
export async function sendEmail({ to, subject, html }) { sent.push({ kind: 'buyer', to, subject, html }); return true }
export const notifyOrg = async (subject, html) => { sent.push({ kind: 'org', subject, html }); return true }
export const ticketEmail = ({ name, ticketId }) => \`<p>\${esc(name)} \${esc(ticketId)}</p>\`
`

const dir = await mkdtemp(join(tmpdir(), 'sf26-webhook-'))
await mkdir(join(dir, 'lib'))
await writeFile(join(dir, 'lib', 'storage.js'), STORAGE_STUB)
await writeFile(join(dir, 'lib', 'email.js'), EMAIL_STUB)
await copyFile(join(FN, 'lib', 'ticket.js'), join(dir, 'lib', 'ticket.js'))
await copyFile(join(FN, 'verify-payment.js'), join(dir, 'verify-payment.js'))

const SECRET = 'test_secret'
process.env.PAYSTACK_SECRET_KEY = SECRET

const { handler } = await import(pathToFileURL(join(dir, 'verify-payment.js')).href)
const { sent }    = await import(pathToFileURL(join(dir, 'lib', 'email.js')).href)
const { store }   = await import(pathToFileURL(join(dir, 'lib', 'storage.js')).href)

const body = JSON.stringify({
  event: 'charge.success',
  data: {
    reference: 'PSK_REF_12345',
    amount: 1000000,
    currency: 'NGN',
    customer: { email: 'buyer@example.com', first_name: 'Ade' },
    // `name` is buyer-controlled and round-trips through Paystack metadata.
    metadata: { name: '<img src=x onerror=alert(1)>Ade', tier: 'vip', qty: 2 },
  },
})
const sig = createHmac('sha512', SECRET).update(body).digest('hex')
const ev = (b, s) => ({ httpMethod: 'POST', body: b, headers: { 'x-paystack-signature': s } })

let pass = 0, fail = 0
const check = (name, cond) => {
  if (cond) { pass++; console.log('  PASS  ' + name) }
  else      { fail++; console.error('  FAIL  ' + name) }
}

const r1 = await handler(ev(body, sig))
check('first delivery returns 200', r1.statusCode === 200)
check('first delivery creates the ticket', [...store.keys()].some(k => k.startsWith('ticket:SF26-VIP-')))
check('first delivery emails the buyer once', sent.filter(s => s.kind === 'buyer').length === 1)
check('first delivery notifies the organiser once', sent.filter(s => s.kind === 'org').length === 1)

const org = sent.find(s => s.kind === 'org')
check('organiser email escapes the buyer name',
  !org.html.includes('<img src=x') && org.html.includes('&lt;img'))

// The regression: Paystack retries deliveries. The idempotency guard used to
// read a key that was never written, so every retry re-sent both emails.
const r2 = await handler(ev(body, sig))
check('retry returns 200', r2.statusCode === 200)
check('retry short-circuits as already processed', r2.body === 'Already processed')
check('retry does not re-email the buyer', sent.filter(s => s.kind === 'buyer').length === 1)
check('retry does not re-notify the organiser', sent.filter(s => s.kind === 'org').length === 1)

check('bad signature is rejected', (await handler(ev(body, 'deadbeef'))).statusCode === 401)
check('wrong-length signature is rejected without throwing',
  (await handler(ev(body, 'a'.repeat(7)))).statusCode === 401)
check('non-charge events are acknowledged and ignored',
  (await (async () => {
    const b = JSON.stringify({ event: 'charge.failed', data: {} })
    return handler(ev(b, createHmac('sha512', SECRET).update(b).digest('hex')))
  })()).statusCode === 200)

await rm(dir, { recursive: true, force: true })

console.log(`\nverify-payment: ${pass} passed, ${fail} failed`)
process.exit(fail ? 1 : 0)
