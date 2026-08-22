// The storage layer, against the real @netlify/blobs client.
//
// Run: node tests/storage.test.mjs
//
// Seventeen functions reach the store, and all but the rate limiter go through
// this one module. Every other function test stubs @netlify/blobs, which means
// none of them would notice if the client itself changed underneath - and the
// client was just upgraded across three major versions.
//
// So this suite deliberately does not stub it. The real client runs; only the
// network beneath it is replaced by an in-memory edge that speaks the actual
// wire protocol. If this passes, the upgrade is safe for every caller.

import { pathToFileURL, fileURLToPath } from 'url'
import { join, dirname } from 'path'
import { mkdtemp, mkdir, writeFile, copyFile } from 'fs/promises'
import { tmpdir } from 'os'
import { createBlobEdge } from './helpers/blob-edge.mjs'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const REAL_BLOBS = pathToFileURL(join(root, 'node_modules', '@netlify', 'blobs', 'dist', 'main.js')).href
const HELPER = pathToFileURL(join(root, 'tests', 'helpers', 'blob-edge.mjs')).href

const dir = await mkdtemp(join(tmpdir(), 'sf26-storage-'))
await mkdir(join(dir, 'node_modules', '@netlify', 'blobs'), { recursive: true })
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
await copyFile(join(root, 'netlify', 'functions', 'lib', 'storage.js'), join(dir, 'storage.js'))

const S = await import(pathToFileURL(join(dir, 'storage.js')).href)
const { edge } = await import(pathToFileURL(join(dir, 'node_modules', '@netlify', 'blobs', 'index.js')).href)

let pass = 0, fail = 0
const check = (n, c) => { c ? (pass++, console.log('  PASS  ' + n)) : (fail++, console.error('  FAIL  ' + n)) }
const Store = S.Tickets

// --- the operations every function depends on ------------------------------

edge.reset()
check('reading a key that was never written gives null', await S.get(Store, 'nothing') === null)

await S.set(Store, 'k', { a: 1, nested: { b: [1, 2, 3] } })
{
  const v = await S.get(Store, 'k')
  check('a record round-trips intact', v.a === 1 && v.nested.b[2] === 3)
}

await S.set(Store, 'k', { a: 2 })
check('an unconditional write replaces', (await S.get(Store, 'k')).a === 2)

await S.del(Store, 'k')
check('delete removes the record', await S.get(Store, 'k') === null)
check('deleting something absent does not throw', await S.del(Store, 'gone') === undefined)

// --- listAll, which the admin queues and the vendor directory rely on ------

edge.reset()
for (const id of ['a', 'b', 'c']) await S.set(Store, `item:${id}`, { id })
await S.set(Store, 'other:z', { id: 'z' })
{
  const items = await S.listAll(Store, 'item:')
  check('listAll returns everything under a prefix', items.length === 3)
  check('listAll leaves other prefixes alone', !items.some(i => i.id === 'z'))
  check('listAll returns parsed records, not strings', items.every(i => typeof i === 'object'))
}
check('listAll on an empty prefix is an empty list', (await S.listAll(Store, 'nope:')).length === 0)

// --- versioned read and conditional write ---------------------------------

edge.reset()
{
  const { value, version } = await S.getVersioned(Store, 'absent')
  check('a versioned read of nothing has no value and no version', value === null && version === null)
}

await S.set(Store, 'doc', { n: 1 })
const first = await S.getVersioned(Store, 'doc')
check('a versioned read returns the record', first.value.n === 1)
check('a versioned read returns a version', typeof first.version === 'string' && first.version.length > 0)

check('a conditional write on the current version lands',
  await S.setIfUnchanged(Store, 'doc', { n: 2 }, first.version) === true)
check('and the record changed', (await S.get(Store, 'doc')).n === 2)

check('a conditional write on a stale version is refused',
  await S.setIfUnchanged(Store, 'doc', { n: 99 }, first.version) === false)
check('and the record did not change', (await S.get(Store, 'doc')).n === 2)

{
  const now = await S.getVersioned(Store, 'doc')
  check('the version moves when the record does', now.version !== first.version)
}

// A null version means "only if this does not exist yet".
check('a create-only write lands when nothing is there',
  await S.setIfUnchanged(Store, 'fresh', { n: 1 }, null) === true)
check('a create-only write is refused when something is',
  await S.setIfUnchanged(Store, 'fresh', { n: 2 }, null) === false)
check('and the original survives', (await S.get(Store, 'fresh')).n === 1)

// --- the guarantee the gate depends on ------------------------------------

{
  // Many writers, one winner. This is the property that makes a ticket admit
  // exactly one person; if it does not hold, nothing built on it does.
  edge.reset()
  edge.setDelay(() => new Promise(r => setTimeout(r, 3)))
  await S.set(Store, 'race', { winner: null })
  const { version } = await S.getVersioned(Store, 'race')

  const results = await Promise.all(
    Array.from({ length: 25 }, (_, i) =>
      S.setIfUnchanged(Store, 'race', { winner: i }, version)),
  )
  check('exactly one of twenty-five conditional writes wins',
    results.filter(Boolean).length === 1)
  check('the store refused the other twenty-four',
    edge.stats.preconditionFailed === 24)
  {
    const final = await S.get(Store, 'race')
    const winnerIndex = results.indexOf(true)
    check('the record holds precisely the winner\'s value', final.winner === winnerIndex)
  }
  edge.setDelay(() => Promise.resolve())
}

// --- failure behaviour ----------------------------------------------------

{
  // Reads fail soft, because a function that throws on a transient blip is
  // worse than one that treats it as a miss and moves on.
  const broken = () => ({ async get() { throw new Error('edge down') },
                          async getWithMetadata() { throw new Error('edge down') } })
  check('a read that throws is reported as a miss', await S.get(broken, 'k') === null)
  const v = await S.getVersioned(broken, 'k')
  check('a versioned read that throws has no value and no version',
    v.value === null && v.version === null)
}

{
  // A conditional write must never report success it did not achieve. This is
  // the one place where failing soft would be dangerous: a write that did not
  // land, reported as a win, is a second person through the gate.
  const broken = () => ({ async set() { throw new Error('edge down') } })
  check('a conditional write that throws reports a loss, not a win',
    await S.setIfUnchanged(broken, 'k', { a: 1 }, '"v1"') === false)
}

console.log(`\nstorage: ${pass} passed, ${fail} failed`)
process.exit(fail ? 1 : 0)
