// Moderating from the dashboard.
//
// Run: node tests/admin-moderation.test.mjs
//
// Four moderation queues shipped with no way to action any of them: the
// dashboard listed pending items and offered no approve or reject. Every
// board would have sat permanently empty unless the organiser hand-wrote
// authenticated curl requests.
//
// The mapping from dashboard tab to moderation kind is the risk surface here.
// Send a wall id under the wrong kind and moderate.js goes looking in the
// confessions store, so these pin it - including against a tab being renamed
// in the UI without the mapping following.

import { readFileSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath, pathToFileURL } from 'url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')

let pass = 0, fail = 0
const check = (name, cond) => {
  if (cond) { pass++; console.log('  PASS  ' + name) }
  else      { fail++; console.error('  FAIL  ' + name) }
}

// adminData.js touches sessionStorage only inside functions, so a stub is
// enough to import it under node.
const store = new Map()
globalThis.sessionStorage = {
  getItem: k => (store.has(k) ? store.get(k) : null),
  setItem: (k, v) => store.set(k, String(v)),
  removeItem: k => store.delete(k),
}

let calls = []
let nextResponse = { ok: true, status: 200, json: async () => ({ success: true }) }
globalThis.fetch = async (url, opts) => {
  calls.push({ url, opts })
  return nextResponse
}

const A = await import(pathToFileURL(join(root, 'src', 'pages', 'adminData.js')).href)

console.log('\ntab to moderation kind:')

check('the confessions tab moderates confessions', A.moderationKind('MODERATE') === 'confession')
check('the registry tab moderates registry entries', A.moderationKind('REGISTRY') === 'sole')
check('the wall tab moderates wall posts', A.moderationKind('WALL') === 'wall')
check('the trades tab moderates a trade, singular', A.moderationKind('TRADES') === 'trade')
check('a tab with nothing to moderate maps to nothing', A.moderationKind('TICKETS') === null)
check('an unknown tab maps to nothing', A.moderationKind('NOPE') === null)

console.log('\nthe mapping matches what the backend accepts:')

// The kinds moderate.js will actually honour.
const moderateSrc = readFileSync(join(root, 'netlify', 'functions', 'moderate.js'), 'utf8')
const backendKinds = [...moderateSrc.matchAll(/^\s{2}(\w+):\s*\{\s*store:/gm)].map(m => m[1])

check('the backend declares four kinds', backendKinds.length === 4)
for (const kind of Object.values(A.MODERATION_KIND)) {
  check(`the backend accepts "${kind}"`, backendKinds.includes(kind))
}

console.log('\nthe mapping matches the tabs the dashboard renders:')

const adminSrc = readFileSync(join(root, 'src', 'pages', 'Admin.jsx'), 'utf8')
const renderedTabs = [...adminSrc.matchAll(/id:\s*'([A-Z]+)',\s*resource:/g)].map(m => m[1])

check('the dashboard renders tabs', renderedTabs.length > 0)
for (const tabId of Object.keys(A.MODERATION_KIND)) {
  check(`the dashboard still has a "${tabId}" tab`, renderedTabs.includes(tabId))
}

console.log('\napproving one item:')

store.set('sf26_admin_secret', 'organiser-secret')
calls = []
await A.moderate('WALL', 'CW26-0001', 'approve')

check('one request is sent', calls.length === 1)
check('it goes to the moderation endpoint', calls[0].url === '/.netlify/functions/moderate')
check('it carries the secret', calls[0].opts.headers.Authorization === 'Bearer organiser-secret')

const sent = JSON.parse(calls[0].opts.body)
check('it sends the kind, not the tab name', sent.type === 'wall')
check('it sends the id it was given', sent.id === 'CW26-0001')
check('it sends the action', sent.action === 'approve')

calls = []
await A.moderate('TRADES', 'TB26-0007', 'reject')
check('a trade rejection sends the singular kind', JSON.parse(calls[0].opts.body).type === 'trade')

console.log('\nrefusals:')

let threw = null
try { await A.moderate('TICKETS', 'A1', 'approve') } catch (e) { threw = e }
check('a tab with nothing to moderate is refused before any request', threw !== null)
check('and no request was sent', calls.length === 1)

nextResponse = { ok: false, status: 401, json: async () => ({ error: 'Unauthorized' }) }
let unauth = null
try { await A.moderate('WALL', 'CW26-0001', 'approve') } catch (e) { unauth = e }
check('a rejected secret surfaces as 401', unauth?.status === 401)
check('and says the session expired rather than echoing the status',
  /session expired/i.test(unauth.message))

console.log('\nworking a whole queue:')

// One bad record in a batch must not strand the rest of the queue.
let n = 0
nextResponse = null
globalThis.fetch = async () => {
  n += 1
  return n === 2
    ? { ok: false, status: 500, json: async () => ({ error: 'boom' }) }
    : { ok: true, status: 200, json: async () => ({ success: true }) }
}

const result = await A.moderateMany('WALL', ['CW26-0001', 'CW26-0002', 'CW26-0003'], 'approve')
check('every item is attempted', n === 3)
check('the successes are counted', result.done === 2)
check('the failure is counted rather than thrown', result.failed === 1)

console.log(`\nadmin-moderation: ${pass} passed, ${fail} failed\n`)
process.exit(fail ? 1 : 0)
