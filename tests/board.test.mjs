// The Community Wall and the Trade Board.
//
// Run: node tests/board.test.mjs
//
// Both sections wrote through src/lib/api.js to a VITE_BACKEND_URL that was
// never set, so both silently fell back to localStorage: you posted, and
// nobody else ever saw it. The Trade Board told posters "Visible to everyone"
// while doing that, and shipped five fabricated listings carrying invented
// Nigerian phone numbers and Instagram handles.
//
// Trade listings carry real phone numbers, so the moderation gate here is
// load-bearing, not decoration.

import { mkdtemp, mkdir, writeFile, copyFile, rm } from 'fs/promises'
import { readFileSync } from 'fs'
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

const dir = await mkdtemp(join(tmpdir(), 'sf26-board-'))
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

for (const f of ['cors.js', 'auth.js', 'text.js', 'board-domain.js']) {
  await copyFile(join(FN, 'lib', f), join(dir, 'lib', f))
}
await writeFile(join(dir, 'lib', 'ratelimit.js'), 'export async function rateLimit() { return null }\n')
await copyFile(join(FN, 'board.js'), join(dir, 'board.js'))
await copyFile(join(FN, 'moderate.js'), join(dir, 'moderate.js'))

const { handler: board }    = await import(pathToFileURL(join(dir, 'board.js')).href)
const { handler: moderate } = await import(pathToFileURL(join(dir, 'moderate.js')).href)
const D = await import(pathToFileURL(join(dir, 'lib', 'board-domain.js')).href)

const json = r => JSON.parse(r.body)
const SECRET = 'organiser-secret'
process.env.ADMIN_SECRET = SECRET

const post = (b, body) => board({
  httpMethod: 'POST', queryStringParameters: { board: b },
  body: JSON.stringify(body), headers: {},
})
const read = b => board({ httpMethod: 'GET', queryStringParameters: { board: b }, headers: {} })
const act = (type, id, action, secret = SECRET) => moderate({
  httpMethod: 'POST',
  body: JSON.stringify({ type, id, action }),
  headers: { authorization: `Bearer ${secret}` },
})

const wallPost  = (o = {}) => ({ name: 'Ada N.', city: 'Lagos', role: 'CREATOR', msg: 'Lagos is ready.', ...o })
const tradePost = (o = {}) => ({
  name: 'Air Jordan 1', brand: 'Nike', size: '44', condition: 'DS',
  asking: 'Swap for AM90', notes: 'Clean pair', contact: '08011122233', ...o,
})

console.log('\nempty boards:')

check('the wall starts with nobody on it', json(await read('wall')).total === 0)
check('the trade board starts empty', json(await read('trades')).total === 0)
check('an unknown board is refused', (await read('gallery')).statusCode === 400)
check('posting to an unknown board is refused', (await post('gallery', wallPost())).statusCode === 400)

console.log('\nposting waits for review:')

const w1 = json(await post('wall', wallPost()))
check('a wall post is accepted', w1.success === true)
check('it gets an id', /^CW26-\d{4}$/.test(w1.id))
check('but it is NOT live yet', json(await read('wall')).total === 0)

const t1 = json(await post('trades', tradePost()))
check('a listing is accepted', /^TB26-\d{4}$/.test(t1.id))
check('and it is not live yet either', json(await read('trades')).total === 0)

console.log('\nmoderation publishes it:')

await act('wall', w1.id, 'approve')
const wall = json(await read('wall'))
check('the wall post is now live', wall.total === 1)
check('the real message shows', wall.posts[0].msg === 'Lagos is ready.')

await act('trade', t1.id, 'approve')
const trades = json(await read('trades'))
check('the listing is now live', trades.total === 1)
check('the phone number is published only after review', trades.posts[0].contact === '08011122233')

const t2 = json(await post('trades', tradePost({ name: 'Yeezy 350' })))
await act('trade', t2.id, 'reject')
check('a rejected listing stays off the board', json(await read('trades')).total === 1)

console.log('\nthe boards cannot reach into each other:')

check('a wall id cannot moderate a trade', (await act('trade', w1.id, 'approve')).statusCode === 400)
check('a trade id cannot moderate a wall post', (await act('wall', t1.id, 'approve')).statusCode === 400)
check('an unauthorised approval is refused', (await act('wall', w1.id, 'approve', 'guess')).statusCode === 401)
check('an unknown id is a 404', (await act('wall', 'CW26-9999', 'approve')).statusCode === 404)
check('the two boards keep separate id runs',
  json(await read('wall')).posts[0].id.startsWith('CW26') &&
  json(await read('trades')).posts[0].id.startsWith('TB26'))

console.log('\nvalidation:')

check('a wall post needs a message', (await post('wall', wallPost({ msg: '' }))).statusCode === 400)
check('a wall post needs a name',    (await post('wall', wallPost({ name: '   ' }))).statusCode === 400)
check('an over-long message is refused', (await post('wall', wallPost({ msg: 'x'.repeat(241) }))).statusCode === 400)
check('a listing needs a size', (await post('trades', tradePost({ size: '' }))).statusCode === 400)
check('an unknown condition is refused', (await post('trades', tradePost({ condition: 'MINT' }))).statusCode === 400)
check('a non-string field is refused', (await post('wall', wallPost({ msg: 42 }))).statusCode === 400)
check('malformed JSON is refused',
  (await board({ httpMethod: 'POST', queryStringParameters: { board: 'wall' }, body: '{oops', headers: {} })).statusCode === 400)
check('DELETE is refused',
  (await board({ httpMethod: 'DELETE', queryStringParameters: { board: 'wall' }, headers: {} })).statusCode === 405)

console.log('\nphotos:')

const png = 'data:image/png;base64,' + 'A'.repeat(100)
check('a real image data URL is accepted', (await post('trades', tradePost({ photo: png }))).statusCode === 200)
check('a script disguised as a photo is refused',
  (await post('trades', tradePost({ photo: 'javascript:alert(1)' }))).statusCode === 400)
check('an SVG is refused, since it can carry script',
  (await post('trades', tradePost({ photo: 'data:image/svg+xml;base64,AAAA' }))).statusCode === 400)
check('an oversized photo is refused',
  (await post('trades', tradePost({ photo: 'data:image/png;base64,' + 'A'.repeat(D.MAX_PHOTO_BYTES) }))).statusCode === 413)

console.log('\nsanitising:')

const messy = D.validatePost('wall', {
  name: '  Ada   N.  ',
  city: 'Lagos',
  // NUL and a vertical tab, written as escapes on purpose.
  msg: 'line\u0000one\u000Btwo',
})
check('internal spaces in a name survive', messy.value.name === 'Ada N.')
check('control characters are stripped', messy.value.msg === 'lineonetwo')

const domainSrc = readFileSync(join(FN, 'lib', 'board-domain.js'), 'utf8')
check('the domain module carries no literal control characters',
  !/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/.test(domainSrc))

console.log('\nthe public view is an allow-list:')

const shown = json(await read('wall')).posts[0]
check('a wall post shows only its declared fields',
  Object.keys(shown).sort().join(',') === 'city,id,msg,name,postedAt,role')
check('moderation state is never published', shown.approved === undefined)
check('the internal board tag is never published', shown.board === undefined)

await rm(dir, { recursive: true, force: true })
delete process.env.ADMIN_SECRET

console.log(`\nboard: ${pass} passed, ${fail} failed\n`)
process.exit(fail ? 1 : 0)
