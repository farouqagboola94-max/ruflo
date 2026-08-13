// The Sole Registry wall.
//
// Run: node tests/sole.test.mjs
//
// The section POSTed real entries to this endpoint and then rendered eight
// invented collectors plus whatever this browser had submitted. So a genuine
// entry from Lagos went into the store and was never seen by anyone, while the
// wall showed people who do not exist. These pin the public read, and the
// moderation gate in front of it - this is free text published under the
// festival's name.

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

const dir = await mkdtemp(join(tmpdir(), 'sf26-sole-'))
await mkdir(join(dir, 'lib'), { recursive: true })
await mkdir(join(dir, 'node_modules', '@netlify', 'blobs'), { recursive: true })

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
    async list() { return { blobs: [...b.keys()].map(k => ({ key: k })) } },
  }
}
`)
await writeFile(join(dir, 'node_modules', '@netlify', 'blobs', 'package.json'),
  JSON.stringify({ name: '@netlify/blobs', version: '0.0.0', type: 'module', main: 'index.js' }))
await writeFile(join(dir, 'package.json'), JSON.stringify({ type: 'module' }))

await copyFile(join(FN, 'lib', 'cors.js'), join(dir, 'lib', 'cors.js'))
await copyFile(join(FN, 'lib', 'auth.js'), join(dir, 'lib', 'auth.js'))
await writeFile(join(dir, 'lib', 'ratelimit.js'), 'export async function rateLimit() { return null }\n')
await writeFile(join(dir, 'lib', 'email.js'), `
export const sent = []
export const esc = s => String(s)
export async function sendEmail(m) { sent.push(m); return true }
`)
await copyFile(join(FN, 'sole-submit.js'), join(dir, 'sole-submit.js'))
await copyFile(join(FN, 'moderate.js'), join(dir, 'moderate.js'))

const { handler: sole }     = await import(pathToFileURL(join(dir, 'sole-submit.js')).href)
const { handler: moderate } = await import(pathToFileURL(join(dir, 'moderate.js')).href)

const json = r => JSON.parse(r.body)
const SECRET = 'organiser-secret'
process.env.ADMIN_SECRET = SECRET

const submit = b => sole({ httpMethod: 'POST', body: JSON.stringify(b), headers: {} })
const wall   = () => sole({ httpMethod: 'GET', headers: {} })
const act    = (type, id, action, secret = SECRET) => moderate({
  httpMethod: 'POST',
  body: JSON.stringify({ type, id, action }),
  headers: { authorization: `Bearer ${secret}` },
})

const entry = (over = {}) => ({
  displayName: 'Tunde B.', city: 'Lagos', shoe: 'Air Force 1',
  brand: 'Nike', story: 'First pair that felt like mine.', ...over,
})

console.log('\nan empty wall:')

const empty = json(await wall())
check('shows nobody rather than invented collectors', empty.wall.length === 0)
check('and counts zero', empty.total === 0)

console.log('\nsubmitting:')

const first = json(await submit(entry()))
check('a submission is accepted', first.success === true)
check('it gets a registry id', /^SR26-\d{4}$/.test(first.submissionId))
check('it takes the next slot', first.slotNumber === 1)

check('it does NOT appear on the wall yet', json(await wall()).total === 0)

console.log('\nmoderation is what publishes it:')

const approved = json(await act('sole', first.submissionId, 'approve'))
check('an entry can be approved', approved.approved === true)

const afterApprove = json(await wall())
check('now it is on the wall', afterApprove.total === 1)
check('the real grail shows', afterApprove.wall[0].shoe === 'Air Force 1')
check('the real story shows', afterApprove.wall[0].story === 'First pair that felt like mine.')

const second = json(await submit(entry({ shoe: 'Jordan 1', displayName: 'Ada' })))
await act('sole', second.submissionId, 'reject')
check('a rejected entry stays off the wall', json(await wall()).total === 1)

console.log('\nmoderation is guarded:')

check('an unauthorised approval is refused',
  (await act('sole', first.submissionId, 'approve', 'guess')).statusCode === 401)
check('a confession id cannot reach the registry store',
  (await act('sole', 'SC26-0001', 'approve')).statusCode === 400)
check('a registry id cannot reach the confessions store',
  (await act('confession', 'SR26-0001', 'approve')).statusCode === 400)
check('an unknown id is a 404, not a crash',
  (await act('sole', 'SR26-9999', 'approve')).statusCode === 404)
check('an unknown wall type is refused',
  (await act('gallery', 'SR26-0001', 'approve')).statusCode === 400)

console.log('\nthe wall only shows what it should:')

await submit(entry({ shoe: 'Dunk Low', email: 'private@example.com' }))
const listing = await wall()
check('emails never reach the wall', !listing.body.includes('private@example.com'))
check('an entry carries no timestamps',
  !listing.body.includes('registeredAt'))
check('and no moderation state', !listing.body.includes('approved'))

console.log('\nvalidation still holds:')

check('a missing shoe is refused',  (await submit(entry({ shoe: undefined }))).statusCode === 400)
check('a missing story is refused', (await submit(entry({ story: undefined }))).statusCode === 400)
check('an unknown brand is refused', (await submit(entry({ brand: 'Fake Co' }))).statusCode === 400)
check('an over-long story is refused', (await submit(entry({ story: 'x'.repeat(201) }))).statusCode === 400)
check('a bad email is refused', (await submit(entry({ email: 'nope' }))).statusCode === 400)
check('DELETE is refused', (await sole({ httpMethod: 'DELETE', headers: {} })).statusCode === 405)

await rm(dir, { recursive: true, force: true })
delete process.env.ADMIN_SECRET

console.log(`\nsole: ${pass} passed, ${fail} failed\n`)
process.exit(fail ? 1 : 0)
