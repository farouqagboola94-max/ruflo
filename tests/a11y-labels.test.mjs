import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readdirSync, readFileSync, statSync } from 'node:fs'
import { join, relative } from 'node:path'
import { fileURLToPath } from 'node:url'

// Every form control needs an accessible name. A placeholder is not one: it
// vanishes the moment the field is typed into, is not reliably exposed as the
// name, and gives voice-control users nothing to say. This test walks the JSX
// and fails on any input, textarea or select that has neither a label nor an
// aria-label, so the 141 names added by hand cannot quietly rot away.

const ROOT = fileURLToPath(new URL('../src/', import.meta.url))
const TAGS = ['<input', '<textarea', '<select']

function jsxFiles(dir) {
  const out = []
  for (const name of readdirSync(dir)) {
    const p = join(dir, name)
    if (statSync(p).isDirectory()) out.push(...jsxFiles(p))
    else if (name.endsWith('.jsx')) out.push(p)
  }
  return out
}

// Find the '>' that closes a JSX opening tag, skipping any '>' that sits
// inside a quoted string or a braced expression such as style={{ ... }}.
function tagEnd(src, i) {
  let depth = 0, quote = null
  for (; i < src.length; i++) {
    const c = src[i]
    if (quote) { if (c === quote && src[i - 1] !== '\\') quote = null; continue }
    if (c === '"' || c === "'" || c === '`') { quote = c; continue }
    if (c === '{') depth++
    else if (c === '}') depth--
    else if (c === '>' && depth === 0) return i
  }
  return -1
}

function controls(file) {
  const src = readFileSync(file, 'utf8')
  const found = []
  for (let i = 0; i < src.length; i++) {
    const tag = TAGS.find(t => src.startsWith(t, i))
    if (!tag) continue
    // Guard against matching <inputSomething /> or a longer tag name.
    const after = src[i + tag.length]
    if (after && !/[\s/>]/.test(after)) continue
    const end = tagEnd(src, i)
    if (end < 0) continue
    found.push({
      tag,
      body: src.slice(i, end),
      line: src.slice(0, i).split('\n').length,
    })
    i = end
  }
  return found
}

const FILES = jsxFiles(ROOT)

test('the source actually contains form controls to check', () => {
  const total = FILES.reduce((n, f) => n + controls(f).length, 0)
  // If a refactor moves the forms elsewhere this test would silently pass on
  // an empty set, so assert there is a real population being checked.
  assert.ok(total > 100, `expected 100+ form controls, found ${total}`)
})

test('every form control has an accessible name', () => {
  const naked = []
  for (const file of FILES) {
    for (const c of controls(file)) {
      if (/\btype\s*=\s*"hidden"/.test(c.body)) continue
      if (/\baria-label(?:ledby)?\s*=/.test(c.body)) continue
      naked.push(`${relative(ROOT, file)}:${c.line} ${c.tag}>`)
    }
  }
  assert.deepEqual(naked, [], `form controls with no accessible name:\n  ${naked.join('\n  ')}`)
})

test('no accessible name is left empty', () => {
  const empty = []
  for (const file of FILES) {
    for (const c of controls(file)) {
      const m = c.body.match(/\baria-label\s*=\s*"([^"]*)"/)
      if (m && !m[1].trim()) empty.push(`${relative(ROOT, file)}:${c.line}`)
    }
  }
  assert.deepEqual(empty, [], `empty aria-label:\n  ${empty.join('\n  ')}`)
})

test('no accessible name is just an example value', () => {
  // "08012345678" or "e.g. Air Jordan 4" describe what to type, not what the
  // field is. Screen reader users hear the name, not the example.
  const bad = []
  for (const file of FILES) {
    for (const c of controls(file)) {
      const m = c.body.match(/\baria-label\s*=\s*"([^"]*)"/)
      if (!m) continue
      const name = m[1].trim()
      if (/^e\.?g\.?\b/i.test(name) || /^[\d+\s()-]+$/.test(name) || /^@?\w+@[\w.]+$/.test(name) || /^https?:/i.test(name)) {
        bad.push(`${relative(ROOT, file)}:${c.line} "${name}"`)
      }
    }
  }
  assert.deepEqual(bad, [], `accessible name is an example value, not a name:\n  ${bad.join('\n  ')}`)
})
