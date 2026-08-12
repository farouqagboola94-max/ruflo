// The Standings - the shared XP board.
//
// Run: node tests/standings.test.mjs
//
// The XP system already existed but lived in localStorage, so nobody could
// see anyone else's score and clearing the browser wiped it. These pin the
// shared board, and in particular the two things that could hurt someone:
// a score must never go down, and a handle you do not own must not be
// griefable.

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

const dir = await mkdtemp(join(tmpdir(), 'sf26-standings-'))
await mkdir(join(dir, 'lib'), { recursive: true })
await mkdir(join(dir, 'node_modules', '@netlify', 'blobs'), { recursive: true })

await writeFile(join(dir, 'node_modules', '@netlify', 'blobs', 'index.js'), `
export const _data = new Map()
export function getStore() {
  return {
    async get(k, opts) {
      if (!_data.has(k)) return null
      const raw = _data.get(k)
      return opts && opts.type === 'json' ? JSON.parse(raw) : raw
    },
    async setJSON(k, v) { _data.set(k, JSON.stringify(v)) },
    async list() { return { blobs: [..._data.keys()].map(k => ({ key: k })) } },
  }
}
`)
await writeFile(join(dir, 'node_modules', '@netlify', 'blobs', 'package.json'),
  JSON.stringify({ name: '@netlify/blobs', version: '0.0.0', type: 'module', main: 'index.js' }))
await writeFile(join(dir, 'package.json'), JSON.stringify({ type: 'module' }))

await copyFile(join(FN, 'lib', 'cors.js'), join(dir, 'lib', 'cors.js'))
await copyFile(join(FN, 'lib', 'standings-domain.js'), join(dir, 'lib', 'standings-domain.js'))
await writeFile(join(dir, 'lib', 'ratelimit.js'), 'export async function rateLimit() { return null }\n')
await copyFile(join(FN, 'standings.js'), join(dir, 'standings.js'))

const { handler } = await import(pathToFileURL(join(dir, 'standings.js')).href)
const D = await import(pathToFileURL(join(dir, 'lib', 'standings-domain.js')).href)

const json = r => JSON.parse(r.body)
const post = b => handler({ httpMethod: 'POST', body: JSON.stringify(b), headers: {} })
const get  = h => handler({ httpMethod: 'GET', queryStringParameters: h ? { handle: h } : {}, headers: {} })

console.log('\nan empty board:')

const empty = json(await get())
check('nobody is on it', empty.total === 0)
check('the top is empty rather than invented', empty.top.length === 0)
check('there is no "you" before you claim a handle', empty.you === null)

console.log('\nclaiming a handle:')

const first = json(await post({ handle: 'soleking', xp: 400 }))
check('the first player is ranked #1', first.you.rank === 1)
check('their score is what they posted', first.you.xp === 400)
check('the board counts one player', first.total === 1)

await post({ handle: 'ada', xp: 900 })
await post({ handle: 'bem', xp: 150 })

const board = json(await get('soleking'))
check('a higher score outranks a lower one', board.top[0].handle === 'ada')
check('ranks run 1, 2, 3 in score order',
  board.top.map(e => e.handle).join(',') === 'ada,soleking,bem')
check('you can find yourself', board.you.handle === 'soleking' && board.you.rank === 2)

console.log('\nthe gap that brings people back:')

check('you are told who is directly ahead', board.chasing.handle === 'ada')
check('and exactly how far off', board.chasing.gap === 500)
check('you are told who is closing on you', board.chasedBy.handle === 'bem')
check('and by how much', board.chasedBy.gap === 250)

const leader = json(await get('ada'))
check('the leader is chasing nobody', leader.chasing === null)
check('but is still being chased', leader.chasedBy.handle === 'soleking')

const last = json(await get('bem'))
check('the last player is chasing someone', last.chasing.handle === 'soleking')
check('and is chased by nobody', last.chasedBy === null)

console.log('\na score never goes down:')

const dropped = json(await post({ handle: 'ada', xp: 5 }))
check('posting a lower score keeps the best one', dropped.you.xp === 900)
check('so a second device cannot wipe your progress', dropped.you.rank === 1)

const raised = json(await post({ handle: 'ada', xp: 1200 }))
check('posting a higher score does update', raised.you.xp === 1200)

check('this is what stops a stranger griefing your handle',
  D.mergeEntry({ xp: 900, firstSeen: 'x' }, { handle: 'ada', xp: 0 }, 'now').xp === 900)

console.log('\nties:')

await post({ handle: 'early', xp: 700 })
await post({ handle: 'late', xp: 700 })
const tied = json(await get('early'))
const iE = tied.top.findIndex(e => e.handle === 'early')
const iL = tied.top.findIndex(e => e.handle === 'late')
check('a tie is broken by who got there first', iE < iL)

console.log('\nhandles:')

check('handles are case-insensitive', D.normaliseHandle('  @SoleKing ') === 'soleking')
check('claiming the same handle in caps is the same player',
  json(await post({ handle: 'SOLEKING', xp: 401 })).total === 5)
check('a short handle is refused',        (await post({ handle: 'ab', xp: 1 })).statusCode === 400)
check('an over-long handle is refused',   (await post({ handle: 'a'.repeat(19), xp: 1 })).statusCode === 400)
check('a missing handle is refused',      (await post({ xp: 1 })).statusCode === 400)
check('spaces are refused',               (await post({ handle: 'sole king', xp: 1 })).statusCode === 400)
check('markup in a handle is refused',    (await post({ handle: '<script>', xp: 1 })).statusCode === 400)
check('an emoji handle is refused',       (await post({ handle: 'sole👟', xp: 1 })).statusCode === 400)

console.log('\nscores:')

check('a negative score is refused',   (await post({ handle: 'cheat', xp: -50 })).statusCode === 400)
check('a fractional score is refused', (await post({ handle: 'cheat', xp: 1.5 })).statusCode === 400)
check('a non-numeric score is refused',(await post({ handle: 'cheat', xp: 'lots' })).statusCode === 400)
check('an absurd score is refused',    (await post({ handle: 'cheat', xp: D.MAX_XP + 1 })).statusCode === 400)
check('a score at the ceiling is allowed', (await post({ handle: 'grinder', xp: D.MAX_XP })).statusCode === 200)
check('the refused scores never joined the board',
  !json(await get()).top.some(e => e.handle === 'cheat'))

console.log('\nthe board only shows what it should:')

const shown = json(await get('soleking'))
check('an entry carries handle, xp and rank only',
  Object.keys(shown.top[0]).sort().join(',') === 'handle,rank,xp')
check('timestamps are not published', !shown.top[0].firstSeen && !shown.top[0].updatedAt)
check('the top is capped', shown.top.length <= D.TOP_N)

console.log('\nbad requests:')

check('malformed JSON is refused',
  (await handler({ httpMethod: 'POST', body: '{oops', headers: {} })).statusCode === 400)
check('DELETE is refused',
  (await handler({ httpMethod: 'DELETE', headers: {} })).statusCode === 405)
check('asking about a handle nobody claimed is not an error',
  json(await get('ghost')).you === null)

await rm(dir, { recursive: true, force: true })

console.log(`\nstandings: ${pass} passed, ${fail} failed\n`)
process.exit(fail ? 1 : 0)
