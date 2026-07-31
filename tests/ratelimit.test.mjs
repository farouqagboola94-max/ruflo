// Tests for the public-endpoint rate limiter.
//
// Run: node tests/ratelimit.test.mjs
//
// lib/ratelimit.js talks to @netlify/blobs, which is not available outside
// the Netlify runtime, so this stands up a stub of that module next to a copy
// of the limiter. Dependency-free — plain node, no runner.

import { mkdtemp, mkdir, writeFile, copyFile, rm } from 'fs/promises'
import { tmpdir } from 'os'
import { join, dirname } from 'path'
import { fileURLToPath, pathToFileURL } from 'url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const FN = join(root, 'netlify', 'functions')

const dir = await mkdtemp(join(tmpdir(), 'sf26-ratelimit-'))
await mkdir(join(dir, 'lib'))
await mkdir(join(dir, 'node_modules'))
await mkdir(join(dir, 'node_modules', '@netlify'))
await mkdir(join(dir, 'node_modules', '@netlify', 'blobs'))

// Stub @netlify/blobs with an in-memory store we can also force to fail.
await writeFile(join(dir, 'node_modules', '@netlify', 'blobs', 'index.js'), `
export const _data = new Map()
export const _state = { fail: false }
export function getStore() {
  return {
    async get(key) {
      if (_state.fail) throw new Error('store down')
      return _data.has(key) ? JSON.parse(_data.get(key)) : null
    },
    async setJSON(key, val) {
      if (_state.fail) throw new Error('store down')
      _data.set(key, JSON.stringify(val))
    },
  }
}
`)
await writeFile(join(dir, 'node_modules', '@netlify', 'blobs', 'package.json'),
  JSON.stringify({ name: '@netlify/blobs', version: '0.0.0', type: 'module', main: 'index.js' }))
await writeFile(join(dir, 'package.json'), JSON.stringify({ type: 'module' }))

await copyFile(join(FN, 'lib', 'cors.js'), join(dir, 'lib', 'cors.js'))
await copyFile(join(FN, 'lib', 'ratelimit.js'), join(dir, 'lib', 'ratelimit.js'))

const { rateLimit } = await import(pathToFileURL(join(dir, 'lib', 'ratelimit.js')).href)
const blobs = await import(pathToFileURL(join(dir, 'node_modules', '@netlify', 'blobs', 'index.js')).href)

let pass = 0, fail = 0
const check = (name, cond) => {
  if (cond) { pass++; console.log('  PASS  ' + name) }
  else      { fail++; console.error('  FAIL  ' + name) }
}

const ev = (ip, headerName = 'x-nf-client-connection-ip') => ({ headers: { [headerName]: ip } })
const cfg = { name: 'test', limit: 3, windowSec: 600 }

// Under the limit
const a1 = await rateLimit(ev('1.1.1.1'), cfg)
const a2 = await rateLimit(ev('1.1.1.1'), cfg)
const a3 = await rateLimit(ev('1.1.1.1'), cfg)
check('requests within the limit are allowed', [a1, a2, a3].every(r => r === null))

// Over the limit
const a4 = await rateLimit(ev('1.1.1.1'), cfg)
check('request over the limit is blocked', a4 !== null)
check('blocked request returns 429', a4?.statusCode === 429)
check('blocked request sets Retry-After', Boolean(a4?.headers?.['Retry-After']))

// Isolation between IPs
check('a different IP is unaffected', (await rateLimit(ev('2.2.2.2'), cfg)) === null)

// Window expiry — rewind resetAt into the past
const key = 'test:1.1.1.1'
const rec = JSON.parse(blobs._data.get(key))
blobs._data.set(key, JSON.stringify({ ...rec, resetAt: Date.now() - 1000 }))
check('counter resets once the window expires', (await rateLimit(ev('1.1.1.1'), cfg)) === null)

// Endpoint isolation — same IP, different limiter name
check('limits are per endpoint',
  (await rateLimit(ev('1.1.1.1'), { ...cfg, name: 'other' })) === null)

// x-forwarded-for fallback, first entry only
await rateLimit(ev('9.9.9.9, 10.0.0.1', 'x-forwarded-for'), { ...cfg, name: 'fwd' })
check('falls back to the first x-forwarded-for entry', blobs._data.has('fwd:9.9.9.9'))

// Fail open when the store is unreachable
blobs._state.fail = true
check('fails open when the store is unavailable',
  (await rateLimit(ev('1.1.1.1'), { ...cfg, name: 'test' })) === null)
blobs._state.fail = false

await rm(dir, { recursive: true, force: true })

console.log(`\nratelimit: ${pass} passed, ${fail} failed`)
process.exit(fail ? 1 : 0)
