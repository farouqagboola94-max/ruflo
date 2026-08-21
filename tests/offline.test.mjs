import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync, existsSync, readdirSync } from 'node:fs'
import { fileURLToPath } from 'node:url'

// What has to survive a dead network, and why each piece is here.
//
// Measured before this existed: a visitor who had been to the site once got a
// BLANK PAGE offline. The service worker registers on window.load, so every
// script had already been fetched around it and it cached nothing but its
// three install assets.
//
// These tests guard the build output, not the browser. The browser behaviour
// is verified separately by killing the server outright - navigator.onLine is
// not a usable proxy for it, which is itself one of the things asserted here.

const root = p => fileURLToPath(new URL('../' + p, import.meta.url))
const read = p => readFileSync(root(p), 'utf8')

// Assertions about what the code DOES must not read the comments explaining
// what it deliberately does not do. Both of the checks below first failed
// against their own explanatory comment.
const code = p => read(p)
  .replace(/\/\*[\s\S]*?\*\//g, '')
  .replace(/(^|[^:])\/\/.*$/gm, '$1')

const DIST_SW = root('dist/sw.js')
const built = existsSync(DIST_SW)
const sw = built ? readFileSync(DIST_SW, 'utf8') : ''

const listNamed = name => {
  const m = sw.match(new RegExp(`const ${name} = \\[([\\s\\S]*?)\\n\\]`))
  return m ? [...m[1].matchAll(/'([^']+)'/g)].map(x => x[1]) : []
}
const precache = () => listNamed('PRECACHE')
const warmList = () => listNamed('WARM')

test('the build rewrites the service worker with a real precache list', { skip: !built && 'run npm run build first' }, () => {
  const list = precache()
  assert.ok(list.length >= 8, `expected a generated precache list, found ${list.length} entries`)
  assert.doesNotMatch(sw, /const CACHE_NAME = 'sf26-dev'/,
    'dist/sw.js still carries the dev cache name; the precache plugin did not run')
  assert.match(sw, /const CACHE_NAME = 'sf26-[0-9a-f]{12}'/,
    'the cache name must be derived from the precache contents so a deploy invalidates it')
})

test('precache covers what the app needs to boot with no network', { skip: !built && 'run npm run build first' }, () => {
  const list = precache()
  const has = re => list.some(u => re.test(u))
  assert.ok(list.includes('/'), 'the shell itself must be cached')
  assert.ok(has(/^\/assets\/main-.*\.js$/), 'the entry chunk must be cached')
  assert.ok(has(/^\/assets\/core-.*\.js$/), 'the shared core must be cached')
  assert.ok(has(/^\/assets\/react-vendor-.*\.js$/), 'react must be cached')
  assert.ok(has(/^\/assets\/.*\.css$/), 'the stylesheet must be cached')
})

test('the pass and the door app survive a dead network', { skip: !built && 'run npm run build first' }, () => {
  const list = precache()
  // A ticket you cannot display is a ticket you do not have, and the door app
  // has an offline scan queue that is worthless if the app will not load.
  assert.ok(list.some(u => /^\/assets\/MyPass-.*\.js$/.test(u)), 'MyPass must be precached')
  assert.ok(list.some(u => /^\/assets\/door-.*\.js$/.test(u)), 'the door app must be precached')
  assert.ok(list.includes('/door.html'), 'the door entry document must be precached')
})

test('precaching does not quietly re-download the whole site', { skip: !built && 'run npm run build first' }, () => {
  // The point of deferring sections is that a visitor does not pay for 61
  // chunks to read the hero. Precaching all of them would undo that.
  const list = precache()
  assert.ok(list.length < 20, `precache has grown to ${list.length} files; it should stay near the boot set`)
})

test('every remaining chunk is warmed in the background', { skip: !built && 'run npm run build first' }, () => {
  // Ten section groups used to show "could not load" offline, because only the
  // boot set was cached. Everything else is now fetched once the page is idle,
  // so a later visit with no signal has the whole site.
  const warm = warmList()
  const boot = new Set(precache())
  assert.ok(warm.length > 40, `expected the deferred chunks to be warmed, found ${warm.length}`)
  const overlap = warm.filter(u => boot.has(u))
  assert.deepEqual(overlap, [], `these are in both lists and would be fetched twice: ${overlap.join(', ')}`)
})

test('warming is asked for after load, never during install', { skip: !built && 'run npm run build first' }, () => {
  // Warming inside the install handler would pull all 67 files down on first
  // paint, which is exactly what deferring sections exists to prevent.
  const install = sw.slice(sw.indexOf("addEventListener('install'"), sw.indexOf("addEventListener('activate'"))
  assert.doesNotMatch(install, /WARM|warmCache/, 'install must not touch the warm list')
  assert.match(sw, /addEventListener\('message'/, 'the page has to be able to ask for the warm')

  const html = read('index.html')
  assert.match(html, /requestIdleCallback/, 'the warm should be requested on idle, not immediately')
  assert.match(html, /saveData/, 'Data Saver users should not get a background download')
})

test('a failed warm fetch is never cached', { skip: !built && 'run npm run build first' }, () => {
  // Storing a 404 would make that section permanently broken offline rather
  // than merely missing, and the next warm would skip it as already cached.
  assert.match(sw, /res && res\.ok/, 'only a successful response may be put in the cache')
})

test('the core chunk does not depend on the data chunk', { skip: !built && 'run npm run build first' }, () => {
  // src/data imports tokens out of core, so anything in core that reaches back
  // into src/data makes the two chunks mutually dependent. Rollup emits that
  // happily and the browser then crashes on load with "Cannot access 'e'
  // before initialization" - measured: zero sections rendered, whole page
  // dead. It also drags the 79 kB dataset onto first paint.
  //
  // Putting liveSchedule.js in src/lib did exactly this, because it imports
  // the running order. The rule is: a module under src/lib that reads from
  // src/data must be excluded from core in vite.config.js.
  const files = readdirSync(root('dist/assets'))
  const core = files.find(f => /^core-.*\.js$/.test(f))
  const data = files.find(f => /^data-.*\.js$/.test(f))
  assert.ok(core, 'no core chunk in dist/assets')
  if (!data) return                                  // nothing to collide with
  const src = readFileSync(root('dist/assets/' + core), 'utf8')
  assert.ok(!src.includes(data), `core imports ${data}; that cycle crashes the page on load`)
})

test('MyPass is not grouped with sections that are not precached', () => {
  // A Suspense boundary fails as a unit. Grouped with GroupTickets, MyPass was
  // precached and STILL showed an error panel offline, because its neighbour
  // could not fetch its chunk.
  const app = read('src/App.jsx')
  const group = app.match(/<Suspense fallback=\{null\}>(?:(?!<\/Suspense>)[\s\S])*?<MyPass \/>[\s\S]*?<\/Suspense>/)
  assert.ok(group, 'could not find the Suspense boundary containing MyPass')
  const siblings = [...group[0].matchAll(/<([A-Z]\w+) \/>/g)].map(m => m[1])
  assert.deepEqual(siblings, ['MyPass'],
    `MyPass shares a Suspense boundary with ${siblings.filter(s => s !== 'MyPass').join(', ')}; one uncached sibling takes the pass down with it`)
})

test('the offline message is not driven by navigator.onLine alone', () => {
  // navigator.onLine reports whether a network interface exists, not whether
  // anything is reachable. With the server killed outright it still reported
  // online, and at a saturated festival tower it will do the same.
  const b = code('src/components/SectionBoundary.jsx')
  assert.match(b, /isChunkError/, 'the measured chunk failure must drive the message')
  const onlineUses = (b.match(/navigator\.onLine/g) || []).length
  assert.ok(onlineUses <= 1, 'navigator.onLine should only sharpen wording, never gate the behaviour')
  assert.match(b, /SHOW MY PASS/, 'a failed section should point a stranded visitor at their pass')
})

test('install failures cannot leave the cache empty', () => {
  // cache.addAll is all-or-nothing: one 404 rejects the whole install, the
  // worker never activates, and nothing at all is cached.
  const src = code('public/sw.js')
  assert.doesNotMatch(src, /addAll/, 'addAll makes one missing file cost every file; add entries individually')
})
