// Raffle entries and counts.
//
// Run: node tests/raffle.test.mjs
//
// The section previously kept entries in localStorage and started each count
// from a hardcoded seed, so nothing a visitor submitted ever reached the
// organiser and the totals on screen had never been true. These pin the real
// behaviour.

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

const dir = await mkdtemp(join(tmpdir(), 'sf26-raffle-'))
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

await copyFile(join(FN, 'lib', 'cors.js'), join(dir, 'lib', 'cors.js'))
await writeFile(join(dir, 'lib', 'ratelimit.js'), 'export async function rateLimit() { return null }\n')
await writeFile(join(dir, 'lib', 'email.js'), `
export const sent = []
export async function sendEmail(m) { sent.push(m); return true }
export const raffleEmail = ({ name, entryNum }) => '<p>' + name + ' ' + entryNum + '</p>'
`)
await copyFile(join(FN, 'raffle-enter.js'), join(dir, 'raffle-enter.js'))

const { handler } = await import(pathToFileURL(join(dir, 'raffle-enter.js')).href)
const { sent } = await import(pathToFileURL(join(dir, 'lib', 'email.js')).href)

const json = r => JSON.parse(r.body)
const enter = b => handler({ httpMethod: 'POST', body: JSON.stringify(b), headers: {} })
const counts = () => handler({ httpMethod: 'GET', headers: {} })

console.log('counts before anyone enters:')
const empty = await counts()
check('GET returns 200', empty.statusCode === 200)
check('every raffle starts at zero, not a seed',
  Object.values(json(empty).counts).every(c => c === 0))
check('the total starts at zero', json(empty).total === 0)

console.log('\nentering:')
const first = await enter({ raffleId: 'rfl1', email: 'Ade@Example.com', name: 'Ade' })
check('an entry is accepted', first.statusCode === 200)
check('the server assigns entry number 1', json(first).entryNum === 1)
check('a confirmation email is sent when a name is given', sent.length === 1)

check('the count reflects the real entry', json(await counts()).counts.rfl1 === 1)
check('other raffles are unaffected', json(await counts()).counts.rfl2 === 0)

const dup = await enter({ raffleId: 'rfl1', email: 'ade@example.com', name: 'Ade' })
check('re-entering the same raffle is reported, not double-counted',
  json(dup).alreadyEntered === true)
check('the count does not move on a duplicate', json(await counts()).counts.rfl1 === 1)
check('email casing does not create a second entry', json(await counts()).total === 1)

await enter({ raffleId: 'rfl1', email: 'bola@example.com', name: 'Bola' })
check('a different person increments the count', json(await counts()).counts.rfl1 === 2)
check('entry numbers are sequential, not random',
  json(await enter({ raffleId: 'rfl1', email: 'chi@example.com', name: 'Chi' })).entryNum === 3)

await enter({ raffleId: 'rfl2', email: 'ade@example.com', name: 'Ade' })
check('the same person can enter a different raffle', json(await counts()).counts.rfl2 === 1)
check('the total spans all raffles', json(await counts()).total === 4)

console.log('\nvalidation:')
check('a missing email is refused', (await enter({ raffleId: 'rfl1' })).statusCode === 400)
check('a malformed email is refused',
  (await enter({ raffleId: 'rfl1', email: 'nope' })).statusCode === 400)
check('an unknown raffle id is refused',
  (await enter({ raffleId: 'rfl99', email: 'a@b.com' })).statusCode === 400)
check('a missing raffle id is refused',
  (await enter({ email: 'a@b.com' })).statusCode === 400)
check('malformed JSON is refused',
  (await handler({ httpMethod: 'POST', body: '{oops', headers: {} })).statusCode === 400)
check('DELETE is refused',
  (await handler({ httpMethod: 'DELETE', headers: {} })).statusCode === 405)

console.log('\nprivacy:')
const body = JSON.stringify(json(await counts()))
check('the public counts never expose entrant emails', !body.includes('example.com'))
check('the public counts never expose entrant names',
  !body.includes('Ade') && !body.includes('Bola'))

await rm(dir, { recursive: true, force: true })

console.log(`\nraffle: ${pass} passed, ${fail} failed`)
process.exit(fail ? 1 : 0)
