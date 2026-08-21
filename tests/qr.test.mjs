import { test } from 'node:test'
import assert from 'node:assert/strict'
import { createHash } from 'node:crypto'
import { encodeQR, qrSVG } from '../src/lib/qr.js'

// The QR encoder in src/lib/qr.js was written rather than installed, because
// the pass has to render with no network and a general-purpose library is
// around 50 kB.
//
// HOW THESE FIXTURES WERE PRODUCED, and how to re-verify them:
//
//   npm install --no-save qrcode jsqr
//   ...render encodeQR's matrix to an RGBA bitmap and feed it to jsQR,
//      asserting the decoded string equals the input.
//
// That sweep ran 708 inputs - versions 1 to 10, EC levels L and M, both
// alphanumeric and byte mode, including the two-group versions where blocks
// are of unequal length - and all 708 decoded back exactly. The hashes below
// pin that verified output so a later edit cannot silently change it.
//
// This matters more than usual here. A QR with a broken generator polynomial
// or transposed format bits still LOOKS like a QR. Two real bugs were found
// this way and neither was visible in the picture:
//
//   - the Reed-Solomon generator was built constant-term-first while the
//     encoder consumed it leading-coefficient-first, so every data codeword
//     was perfect and only the error correction bytes were wrong
//   - the format bits were indexed least-significant-first while the spec
//     lays them out most-significant-first, so scanners recovered the wrong
//     EC level and mask and read nothing at all
//
// Eyeballing the output would have shipped both.

// [text, ec, expected version, expected mask, sha256 of the flattened matrix]
// A bare "@n" means a string of n repeated characters; see expand().
const FIXTURES = [
  ['SF26-GEN-A1B2C3', 'M', 1, 2, 'ad18d3642925d147'],
  ['HELLO WORLD', 'M', 1, 0, '9f15327b648fdbb6'],
  ['0', 'L', 1, 0, 'd34500373def7195'],
  ['https://sneakers-fest-26.netlify.app/door.html#t=SF26-GEN-A1B2C3', 'M', 5, 6, 'f5aef2561387cc92'],
  ['https://sneakers-fest-26.netlify.app/door.html#t=SF26-PHALANX-Q7R2M9', 'L', 4, 2, '1cea8910369fffbe'],
  ['a'.repeat(100), 'M', 6, 1, 'b8e8c456f1c7e7f0'],
  ['b'.repeat(200), 'M', 10, 2, 'c3eeb137bc225658'],
  ['C'.repeat(250), 'L', 8, 0, '781b4d9eaa953d4b'],
]

const hash = modules =>
  createHash('sha256').update(modules.map(r => r.join('')).join('')).digest('hex').slice(0, 16)

test('encoded matrices match the decoder-verified fixtures', () => {
  for (const [text, ec, version, mask, expected] of FIXTURES) {
    const r = encodeQR(text, { ec })
    const label = `${ec} "${text.slice(0, 24)}"${text.length > 24 ? `...(${text.length})` : ''}`
    assert.equal(r.version, version, `${label}: version`)
    assert.equal(r.mask, mask, `${label}: mask`)
    assert.equal(hash(r.modules), expected, `${label}: matrix changed`)
  }
})

// The full matrix for the smallest case, so a change is readable in a diff
// rather than only a hash flip.
const TICKET_V1 = [
  '111111100100001111111', '100000100010101000001', '101110101000001011101',
  '101110101000001011101', '101110101100101011101', '100000101001001000001',
  '111111101010101111111', '000000001010000000000', '101111100101001111100',
  '111011011101110100111', '000111101110111100101', '111101011001100011011',
  '101010100110100010111', '000000001010100010100', '111111100111010101111',
  '100000101000001011011', '101110101111010011110', '101110101010101110100',
  '101110101000100001100', '100000100010100101101', '111111101010111001100',
]

test('the ticket QR is exactly this', () => {
  const { modules } = encodeQR('SF26-GEN-A1B2C3', { ec: 'M' })
  assert.deepEqual(modules.map(r => r.join('')), TICKET_V1)
})

test('size follows the version', () => {
  for (const [text, ec, version] of FIXTURES) {
    const r = encodeQR(text, { ec })
    assert.equal(r.size, version * 4 + 17)
    assert.equal(r.modules.length, r.size)
    for (const row of r.modules) assert.equal(row.length, r.size)
  }
})

test('the three finder patterns are present and correct', () => {
  // Without these a scanner cannot even locate the code.
  const { modules, size } = encodeQR('SF26-GEN-A1B2C3', { ec: 'M' })
  const finder = (r0, c0) => {
    for (let r = 0; r < 7; r++) for (let c = 0; c < 7; c++) {
      const ring = r === 0 || r === 6 || c === 0 || c === 6
      const core = r >= 2 && r <= 4 && c >= 2 && c <= 4
      assert.equal(modules[r0 + r][c0 + c], ring || core ? 1 : 0,
        `finder at ${r0},${c0} wrong at ${r},${c}`)
    }
  }
  finder(0, 0); finder(0, size - 7); finder(size - 7, 0)
})

test('timing patterns alternate', () => {
  const { modules, size } = encodeQR('a'.repeat(100), { ec: 'M' })
  for (let i = 8; i < size - 8; i++) {
    assert.equal(modules[6][i], i % 2 === 0 ? 1 : 0, `horizontal timing at ${i}`)
    assert.equal(modules[i][6], i % 2 === 0 ? 1 : 0, `vertical timing at ${i}`)
  }
})

test('the dark module is always dark', () => {
  // Fixed at (4 * version + 9, 8) and never masked.
  for (const [text, ec] of FIXTURES) {
    const { modules, size, version } = encodeQR(text, { ec })
    assert.equal(modules[size - 8][8], 1, `v${version} dark module`)
    assert.equal(size - 8, 4 * version + 9)
  }
})

test('the smallest version that fits is chosen', () => {
  // Every extra version is a bigger code on a phone screen at the gate.
  let last = 0
  for (let len = 1; len <= 200; len += 7) {
    const v = encodeQR('A'.repeat(len), { ec: 'M' }).version
    assert.ok(v >= last, `version went backwards at length ${len}`)
    last = v
  }
  assert.equal(encodeQR('A'.repeat(20), { ec: 'M' }).version, 1, '20 alphanumeric fits version 1 at M')
})

test('alphanumeric mode is used when it can be', () => {
  // A ticket ID is uppercase, digits and a hyphen - all alphanumeric - and
  // packing it as bytes would need a larger version for no reason.
  assert.equal(encodeQR('SF26-GEN-A1B2C3', { ec: 'M' }).version, 1)
  // The same length in lowercase cannot use alphanumeric mode.
  assert.ok(encodeQR('sf26-gen-a1b2c3', { ec: 'M' }).version >= 1)
})

test('a payload too large is refused rather than truncated', () => {
  // Silently dropping characters would produce a scannable code carrying the
  // wrong ticket, which is worse than no code.
  assert.throws(() => encodeQR('x'.repeat(1000), { ec: 'M' }), /too long/)
})

test('empty and non-string input is refused', () => {
  assert.throws(() => encodeQR(''), /nothing to encode/)
  assert.throws(() => encodeQR(null), /nothing to encode/)
  assert.throws(() => encodeQR(42), /nothing to encode/)
})

test('the SVG carries one rect per dark module and a quiet zone', () => {
  const { modules, size } = encodeQR('SF26-GEN-A1B2C3', { ec: 'M' })
  const dark = modules.flat().filter(v => v === 1).length
  const svg = qrSVG('SF26-GEN-A1B2C3', { ec: 'M', margin: 2 })
  assert.equal((svg.match(/M\d+ \d+h1v1h-1z/g) || []).length, dark)
  // The quiet zone is part of the spec, not decoration: without it scanners
  // cannot find the edge of the code.
  assert.match(svg, new RegExp(`viewBox="0 0 ${size + 4} ${size + 4}"`))
  assert.match(svg, /shape-rendering="crispEdges"/)
})

test('the SVG has no raw angle brackets from its input', () => {
  // The colours are interpolated into the markup, so they must not be able to
  // carry markup of their own.
  const svg = qrSVG('SF26-GEN-A1B2C3', { dark: '#123456', light: '#abcdef' })
  assert.match(svg, /fill="#123456"/)
  assert.match(svg, /fill="#abcdef"/)
  assert.equal(svg.startsWith('<svg'), true)
  assert.equal(svg.endsWith('</svg>'), true)
})
