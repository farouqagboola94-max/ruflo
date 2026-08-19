import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync, readdirSync, statSync } from 'node:fs'
import { join, relative } from 'node:path'
import { fileURLToPath } from 'node:url'

// Sections below the fold are held out of the DOM until the reader nears
// them. That is what keeps first paint at 5 files instead of 61 - but it also
// means anything that jumps to a section by id has to put the page back
// first, and that two sections must never share an id. Both of those were
// real bugs; these tests keep them fixed.

const SRC = fileURLToPath(new URL('../src/', import.meta.url))
const read = p => readFileSync(join(SRC, p), 'utf8')

function walk(dir) {
  const out = []
  for (const name of readdirSync(dir)) {
    const p = join(dir, name)
    if (statSync(p).isDirectory()) out.push(...walk(p))
    else if (name.endsWith('.jsx')) out.push(p)
  }
  return out
}

test('every lazy section group is wrapped in Defer', () => {
  const app = read('App.jsx')
  const groups = (app.match(/<SectionBoundary><Suspense/g) || []).length
  const defers = (app.match(/<Defer sections=\{\d+\}>/g) || []).length
  assert.ok(groups > 5, `expected several lazy groups, found ${groups}`)
  assert.equal(defers, groups, `${groups} lazy groups but only ${defers} wrapped in Defer`)
})

test('no two sections claim the same id', () => {
  // getElementById returns the first match, so a duplicate id silently sends
  // every anchor and palette entry to whichever section happens to render
  // earlier. SneakerBible and ArchitectVault both used to answer to
  // "vault-200", and the navbar link landed on the wrong one.
  const seen = new Map()
  const dupes = []
  for (const file of walk(SRC)) {
    const src = readFileSync(file, 'utf8')
    for (const m of src.matchAll(/<section\s+id="([^"]+)"/g)) {
      const id = m[1]
      if (seen.has(id)) dupes.push(`"${id}" in ${seen.get(id)} and ${relative(SRC, file)}`)
      else seen.set(id, relative(SRC, file))
    }
  }
  assert.deepEqual(dupes, [], `duplicate section ids:\n  ${dupes.join('\n  ')}`)
})

test('every id the site index advertises exists as a section', () => {
  const index = read('lib/siteIndex.js')
  // Only the SECTIONS array names scrollable sections. ACTIONS in the same
  // file carry ids like 'act-whatsapp' that are commands, not places.
  const block = index.slice(index.indexOf('SECTIONS'), index.indexOf('ACTIONS'))
  const advertised = [...block.matchAll(/\{\s*id:\s*'([^']+)'/g)].map(m => m[1])
  assert.ok(advertised.length > 20, `expected a populated index, found ${advertised.length}`)

  const real = new Set()
  for (const file of walk(SRC)) {
    for (const m of readFileSync(file, 'utf8').matchAll(/<section\s+id="([^"]+)"/g)) real.add(m[1])
  }
  // 'hero' is handled as a scroll-to-top rather than a section lookup.
  const missing = advertised.filter(id => id !== 'hero' && !real.has(id))
  assert.deepEqual(missing, [], `index points at sections that do not exist: ${missing.join(', ')}`)
})

test('id-based navigation always mounts the page first', () => {
  // A section that has not mounted cannot be found, so scrolling to one by id
  // without calling mountAll first is a silent no-op.
  const defer = read('components/Defer.jsx')
  assert.match(defer, /export function mountAll/)
  assert.match(defer, /export function goToSection/)
  // Check the order INSIDE goToSection's body. Searching the whole file finds
  // mountAll's own definition, which sits above goToSection and made an
  // earlier version of this assertion pass for the wrong reason.
  const body = defer.slice(defer.indexOf('export function goToSection'))
  const called = body.indexOf('mountAll()')
  const lookup = body.indexOf('getElementById')
  assert.ok(called > 0, 'goToSection must call mountAll')
  assert.ok(lookup > 0, 'goToSection must look the section up')
  assert.ok(called < lookup, 'goToSection must call mountAll before looking the element up')

  for (const [file, why] of [
    ['components/CommandPalette.jsx', 'the command palette'],
    ['components/MobileCTA.jsx', 'the mobile dock'],
    ['App.jsx', 'the delegated anchor handler'],
  ]) {
    assert.match(read(file), /goToSection/, `${why} must navigate through goToSection`)
  }

  // Reading a section's position is fine - MobileCTA does it to highlight the
  // active tab, and skips the ones that are not mounted. What must not happen
  // is SCROLLING to a section found that way, because an unmounted section is
  // simply absent and the scroll silently does nothing.
  for (const file of ['components/CommandPalette.jsx', 'components/MobileCTA.jsx', 'App.jsx']) {
    assert.doesNotMatch(
      read(file), /getElementById\([^)]*\)[\s\S]{0,120}?scrollIntoView/,
      `${file} scrolls to a section it looked up directly; use goToSection so the page mounts first`,
    )
  }
})

test('goToSection keeps re-aiming rather than firing once', () => {
  // Sections landing above the target push it down mid-scroll. A single
  // scrollIntoView used to overshoot a deep link by 2242px.
  const defer = read('components/Defer.jsx')
  assert.match(defer, /window\.scrollY/, 'must track document position, not viewport position')
  assert.match(defer, /setTimeout\(tick/, 'must keep retrying while chunks arrive')
})
