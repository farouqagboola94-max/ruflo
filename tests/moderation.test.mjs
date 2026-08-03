// Confession moderation - the approval gate and the admin-only endpoint.
//
// Run: node tests/moderation.test.mjs
//
// The point of this suite is that nothing a stranger types reaches the public
// wall until an organiser clears it, and that clearing it requires the secret.

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

const dir = await mkdtemp(join(tmpdir(), 'sf26-mod-'))
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

for (const f of ['cors.js', 'auth.js']) {
  await copyFile(join(FN, 'lib', f), join(dir, 'lib', f))
}
await writeFile(join(dir, 'lib', 'ratelimit.js'), 'export async function rateLimit() { return null }\n')
await copyFile(join(FN, 'confess.js'), join(dir, 'confess.js'))
await copyFile(join(FN, 'moderate.js'), join(dir, 'moderate.js'))

const SECRET = 'admin_test_secret'
process.env.ADMIN_SECRET = SECRET

const confess = (await import(pathToFileURL(join(dir, 'confess.js')).href)).handler
const moderate = (await import(pathToFileURL(join(dir, 'moderate.js')).href)).handler

const json = r => JSON.parse(r.body)
const submit = b => confess({ httpMethod: 'POST', body: JSON.stringify(b), headers: {} })
const wall = () => confess({ httpMethod: 'GET', headers: {} })
const mod = (b, secret) => moderate({
  httpMethod: 'POST',
  body: JSON.stringify(b),
  headers: secret ? { authorization: `Bearer ${secret}` } : {},
})

console.log('submission:')
const sub = await submit({ confession: 'I have never cleaned my Air Forces.', city: 'Lagos' })
check('a confession can be submitted', sub.statusCode === 200)
const id = json(sub).submissionId
check('submission returns an id', /^SC26-\d{4}$/.test(id))

console.log('\nthe gate:')
check('a fresh submission is NOT on the public wall',
  json(await wall()).confessions.every(c => c.id !== id))
check('the public wall starts empty rather than leaking pending text',
  json(await wall()).confessions.length === 0)

console.log('\nauthorisation:')
check('moderating without a secret is refused', (await mod({ type: 'confession', id, action: 'approve' })).statusCode === 401)
check('moderating with a wrong secret is refused',
  (await mod({ type: 'confession', id, action: 'approve' }, 'not_the_secret')).statusCode === 401)
check('a wrong secret of matching length is still refused',
  (await mod({ type: 'confession', id, action: 'approve' }, 'x'.repeat(SECRET.length))).statusCode === 401)
check('the confession is still not public after failed attempts',
  json(await wall()).confessions.length === 0)

console.log('\napproval:')
const ok1 = await mod({ type: 'confession', id, action: 'approve' }, SECRET)
check('an organiser can approve', ok1.statusCode === 200 && json(ok1).approved === true)
check('approved text reaches the public wall',
  json(await wall()).confessions.some(c => c.id === id))
check('the public wall never exposes the submission timestamp',
  json(await wall()).confessions.every(c => c.submittedAt === undefined))

console.log('\nrejection:')
const rej = await mod({ type: 'confession', id, action: 'reject' }, SECRET)
check('an organiser can reject something already approved', rej.statusCode === 200 && json(rej).approved === false)
check('rejected text is pulled from the wall',
  json(await wall()).confessions.every(c => c.id !== id))

console.log('\nvalidation:')
check('an unknown id is 404',
  (await mod({ type: 'confession', id: 'SC26-9999', action: 'approve' }, SECRET)).statusCode === 404)
check('a malformed id is 400',
  (await mod({ type: 'confession', id: 'nope', action: 'approve' }, SECRET)).statusCode === 400)
check('an unknown action is 400',
  (await mod({ type: 'confession', id, action: 'delete' }, SECRET)).statusCode === 400)
check('an unknown type is 400',
  (await mod({ type: 'ticket', id, action: 'approve' }, SECRET)).statusCode === 400)
check('GET on the moderation endpoint is refused',
  (await moderate({ httpMethod: 'GET', headers: { authorization: `Bearer ${SECRET}` } })).statusCode === 405)

await rm(dir, { recursive: true, force: true })

console.log(`\nmoderation: ${pass} passed, ${fail} failed`)
process.exit(fail ? 1 : 0)
