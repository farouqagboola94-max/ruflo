// Waitlist queue position and the real list size.
//
// Run: node tests/waitlist.test.mjs
//
// The section used to start every count from a hardcoded seed of 1847 and, if
// the function did not answer, made up a position near that seed. A genuine
// third signup was told they were ~#1850, which put them in the WAITLIST tier
// instead of FOUNDING MEMBER - and the tiers carry real promises (name on the
// event wall, founding merch, direct WhatsApp access). These pin the truth:
// the position is whatever the store says, and the total is a real count.

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

const dir = await mkdtemp(join(tmpdir(), 'sf26-waitlist-'))
await mkdir(join(dir, 'lib'), { recursive: true })
await mkdir(join(dir, 'node_modules', '@netlify', 'blobs'), { recursive: true })

await writeFile(join(dir, 'node_modules', '@netlify', 'blobs', 'index.js'), `
export const _data = new Map()
export function getStore() {
  return {
    async get(k) { return _data.has(k) ? _data.get(k) : null },
    async set(k, v) { _data.set(k, v) },
    async delete(k) { _data.delete(k) },
    async list() { return { blobs: [..._data.keys()].map(k => ({ key: k })) } },
  }
}
`)
await writeFile(join(dir, 'node_modules', '@netlify', 'blobs', 'package.json'),
  JSON.stringify({ name: '@netlify/blobs', version: '0.0.0', type: 'module', main: 'index.js' }))
await writeFile(join(dir, 'package.json'), JSON.stringify({ type: 'module' }))

await copyFile(join(FN, 'lib', 'cors.js'), join(dir, 'lib', 'cors.js'))
await copyFile(join(FN, 'lib', 'storage.js'), join(dir, 'lib', 'storage.js'))
await writeFile(join(dir, 'lib', 'ratelimit.js'), 'export async function rateLimit() { return null }\n')
await writeFile(join(dir, 'lib', 'email.js'), `
export const sent = []
export async function sendEmail(m) { sent.push(m); return true }
export const waitlistEmail = ({ name, position }) => '<p>' + name + ' ' + position + '</p>'
`)
await copyFile(join(FN, 'waitlist-signup.js'), join(dir, 'waitlist-signup.js'))

const { handler } = await import(pathToFileURL(join(dir, 'waitlist-signup.js')).href)
const { sent } = await import(pathToFileURL(join(dir, 'lib', 'email.js')).href)

const json = r => JSON.parse(r.body)
const signup = b => handler({ httpMethod: 'POST', body: JSON.stringify(b), headers: {} })
const totals = () => handler({ httpMethod: 'GET', headers: {} })

console.log('\nqueue position:')

const empty = json(await totals())
check('an empty list reports a total of zero, not a seed', empty.total === 0)

const first = json(await signup({ name: 'Ada', email: 'ada@example.com' }))
check('the first person to join is #1', first.position === 1)
check('the first signup reports a total of 1', first.total === 1)

const second = json(await signup({ name: 'Bem', email: 'bem@example.com' }))
check('the second person to join is #2', second.position === 2)

const third = json(await signup({ name: 'Chi', email: 'chi@example.com' }))
check('the third person to join is #3, not ~1850', third.position === 3)
check('the position is low enough to earn the founding tier', third.position <= 100)

console.log('\nreal totals:')

const afterThree = json(await totals())
check('the total counts everyone who actually joined', afterThree.total === 3)
check('the total is never inflated by a seed', afterThree.total < 100)

console.log('\nrepeat signups:')

const repeat = json(await signup({ name: 'Ada', email: 'ada@example.com' }))
check('signing up twice is flagged, not counted twice', repeat.alreadyRegistered === true)
check('a repeat signup keeps the original position', repeat.position === 1)
check('a repeat signup still reports the real total', repeat.total === 3)

const unchanged = json(await totals())
check('a repeat signup does not grow the list', unchanged.total === 3)

const cased = json(await signup({ name: 'Ada', email: 'ADA@Example.com  ' }))
check('the same address in a different case is the same person', cased.alreadyRegistered === true)

console.log('\nvalidation:')

check('a missing email is refused',   (await signup({ name: 'X' })).statusCode === 400)
check('a malformed email is refused', (await signup({ email: 'not-an-email' })).statusCode === 400)
check('an over-long name is refused', (await signup({ email: 'z@e.com', name: 'z'.repeat(121) })).statusCode === 400)
check('malformed JSON is refused',
  (await handler({ httpMethod: 'POST', body: '{oops', headers: {} })).statusCode === 400)
check('DELETE is refused',
  (await handler({ httpMethod: 'DELETE', headers: {} })).statusCode === 405)

console.log('\nprivacy:')

const body = (await totals()).body
check('the public total never exposes entrant emails', !body.includes('ada@example.com'))
check('the public total never exposes entrant names',  !body.includes('Ada'))
check('the public total returns nothing but a count',
  Object.keys(json(await totals())).join(',') === 'total')

console.log('\nconfirmation email:')

check('every new signup is emailed', sent.length === 3)
check('the email carries the real position', sent[2].subject.includes('#3'))
check('the email goes to the address that signed up', sent[2].to === 'chi@example.com')

await rm(dir, { recursive: true, force: true })

console.log(`\nwaitlist: ${pass} passed, ${fail} failed\n`)
process.exit(fail ? 1 : 0)
