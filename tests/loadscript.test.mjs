// Loading third-party SDKs on demand.
//
// Run: node tests/loadscript.test.mjs
//
// index.html used to pull three SDKs on every page view - the Netlify Identity
// widget render-blocking, plus Paystack and Flutterwave - for features most
// visitors never touch. Moving them here means checkout now depends on a
// script arriving at the moment someone pays, so the failure paths matter:
// a flaky connection must not permanently break the buy button.

import { join, dirname } from 'path'
import { fileURLToPath, pathToFileURL } from 'url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')

let pass = 0, fail = 0
const check = (name, cond) => {
  if (cond) { pass++; console.log('  PASS  ' + name) }
  else      { fail++; console.error('  FAIL  ' + name) }
}

// A document stand-in that records every tag appended and lets a test decide
// whether each one loads, fails, or hangs.
function makeDoc() {
  const created = []
  return {
    created,
    head: { appendChild(el) { created.push(el); el._appended = true } },
    createElement() {
      const el = { onload: null, onerror: null, src: '', async: false }
      return el
    },
  }
}

const L = await import(pathToFileURL(join(root, 'src', 'lib', 'loadScript.js')).href)

console.log('\nloading once:')

L._resetScriptCache()
let doc = makeDoc()
const p1 = L.loadScript('https://example.test/a.js', { doc })
check('a script tag is appended', doc.created.length === 1)
check('it points at the url', doc.created[0].src === 'https://example.test/a.js')
check('it is async, so it never blocks parsing', doc.created[0].async === true)

const p2 = L.loadScript('https://example.test/a.js', { doc })
check('a second request does not append a second tag', doc.created.length === 1)
check('and shares the same promise', p1 === p2)

doc.created[0].onload()
check('it resolves once the script loads', (await p1) === true)

const p3 = L.loadScript('https://example.test/a.js', { doc })
check('a later request resolves from cache without a new tag',
  doc.created.length === 1 && (await p3) === true)

console.log('\nfailure is not permanent:')

L._resetScriptCache()
doc = makeDoc()
const bad = L.loadScript('https://example.test/b.js', { doc })
doc.created[0].onerror()

let err = null
try { await bad } catch (e) { err = e }
check('a failed load rejects', err !== null)
check('the message names the script', err.message.includes('b.js'))

// This is the point: a checkout that failed on a bad connection has to be
// retryable, so the failure must be evicted from the cache.
const retry = L.loadScript('https://example.test/b.js', { doc })
check('retrying appends a fresh tag', doc.created.length === 2)
doc.created[1].onload()
check('and can succeed the second time', (await retry) === true)

console.log('\na script that never answers:')

L._resetScriptCache()
doc = makeDoc()
let timedOut = null
const slow = L.loadScript('https://example.test/c.js', { doc, timeoutMs: 10 })
try { await slow } catch (e) { timedOut = e }
check('it gives up rather than hanging forever', timedOut !== null)
check('and says so', /timed out/i.test(timedOut.message))

const afterTimeout = L.loadScript('https://example.test/c.js', { doc, timeoutMs: 50 })
check('a timeout is also retryable', doc.created.length === 2)
doc.created[1].onload()
await afterTimeout

console.log('\nSDK globals:')

check('the known SDKs are the three that used to be in index.html',
  Object.keys(L.SDK).sort().join(',') === 'flutterwave,identity,paystack')
check('paystack points at its inline script', L.SDK.paystack.includes('js.paystack.co'))
check('flutterwave points at v3', L.SDK.flutterwave.includes('checkout.flutterwave.com'))
check('identity points at the netlify widget', L.SDK.identity.includes('identity.netlify.com'))

L._resetScriptCache()
let unknown = null
try { await L.loadSDK('stripe', 'Stripe') } catch (e) { unknown = e }
check('an unknown SDK is refused rather than fetched', unknown !== null)

L._resetScriptCache()
doc = makeDoc()
const scope = { PaystackPop: { setup() {} } }
const already = await L.loadSDK('paystack', 'PaystackPop', { doc, scope })
check('an SDK already on the page is returned without a request',
  doc.created.length === 0 && already === scope.PaystackPop)

// A script can load from a captive portal or a stale cache and define nothing.
L._resetScriptCache()
doc = makeDoc()
const emptyScope = {}
const silent = L.loadSDK('paystack', 'PaystackPop', { doc, scope: emptyScope })
doc.created[0].onload()
let missing = null
try { await silent } catch (e) { missing = e }
check('a script that loads but defines nothing is an error, not undefined',
  missing !== null && missing.message.includes('PaystackPop'))

const secondTry = L.loadSDK('paystack', 'PaystackPop', { doc, scope: emptyScope })
check('and that case is retryable too', doc.created.length === 2)
doc.created[1].onload()
emptyScope.PaystackPop = { setup() {} }
check('once the global appears, it resolves to it', (await secondTry) === emptyScope.PaystackPop)

console.log('\nthe critical path is clear:')

const html = (await import('fs')).readFileSync(join(root, 'index.html'), 'utf8')
check('no third-party script tag remains in the head',
  !/<script[^>]+src="https:\/\//.test(html))
check('the identity widget in particular is gone',
  !html.includes('identity.netlify.com/v1'))
check('paystack is preconnected instead, for the people who do check out',
  html.includes('preconnect') && html.includes('js.paystack.co'))

console.log(`\nloadscript: ${pass} passed, ${fail} failed\n`)
process.exit(fail ? 1 : 0)
