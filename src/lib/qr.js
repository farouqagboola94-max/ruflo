// A QR encoder, written here rather than installed.
//
// The pass has to render with no network at all, so its QR code cannot come
// from a service and the encoder has to sit inside the precached bundle. A
// general-purpose library is around 50 kB; this covers exactly what the pass
// needs - versions 1 to 10, error correction L and M, alphanumeric and byte
// modes - in a few kB.
//
// Every table and step below is from ISO/IEC 18004. The output is verified
// module-for-module against a reference implementation in tests/qr.test.mjs;
// a QR that is subtly wrong still looks like a QR, so eyeballing it proves
// nothing.

// [ec codewords per block, group1 blocks, group1 data codewords,
//  group2 blocks, group2 data codewords]
const BLOCKS = {
  '1L': [7, 1, 19, 0, 0],    '1M': [10, 1, 16, 0, 0],
  '2L': [10, 1, 34, 0, 0],   '2M': [16, 1, 28, 0, 0],
  '3L': [15, 1, 55, 0, 0],   '3M': [26, 1, 44, 0, 0],
  '4L': [20, 1, 80, 0, 0],   '4M': [18, 2, 32, 0, 0],
  '5L': [26, 1, 108, 0, 0],  '5M': [24, 2, 43, 0, 0],
  '6L': [18, 2, 68, 0, 0],   '6M': [16, 4, 27, 0, 0],
  '7L': [20, 2, 78, 0, 0],   '7M': [18, 4, 31, 0, 0],
  '8L': [24, 2, 97, 0, 0],   '8M': [22, 2, 38, 2, 39],
  '9L': [30, 2, 116, 0, 0],  '9M': [22, 3, 36, 2, 37],
  '10L': [18, 2, 68, 2, 69], '10M': [26, 4, 43, 1, 44],
}

const ALIGN = {
  1: [], 2: [6, 18], 3: [6, 22], 4: [6, 26], 5: [6, 30],
  6: [6, 34], 7: [6, 22, 38], 8: [6, 24, 42], 9: [6, 26, 46], 10: [6, 28, 50],
}

// Bits of zero padding after the interleaved codewords.
const REMAINDER = { 1: 0, 2: 7, 3: 7, 4: 7, 5: 7, 6: 7, 7: 0, 8: 0, 9: 0, 10: 0 }

const EC_BITS = { L: 1, M: 0, Q: 3, H: 2 }
const ALNUM = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ $%*+-./:'

const dataCodewords = key => {
  const [, g1b, g1c, g2b, g2c] = BLOCKS[key]
  return g1b * g1c + g2b * g2c
}

// ---- GF(256) for Reed-Solomon, generator polynomial x^8+x^4+x^3+x^2+1 ----
const EXP = new Uint8Array(512)
const LOG = new Uint8Array(256)
for (let i = 0, x = 1; i < 255; i++) {
  EXP[i] = x
  LOG[x] = i
  x <<= 1
  if (x & 0x100) x ^= 0x11d
}
for (let i = 255; i < 512; i++) EXP[i] = EXP[i - 255]

const mul = (a, b) => (a === 0 || b === 0 ? 0 : EXP[LOG[a] + LOG[b]])

function rsGenerator(degree) {
  // Built constant-term-first, because multiplying by (x + a^i) is easiest to
  // express that way. rsEncode wants the leading coefficient first, so it is
  // reversed on the way out. Skipping that reversal yields the right
  // polynomial read backwards - the data codewords still come out perfect and
  // only the error correction bytes are wrong, which is exactly the kind of
  // fault that survives a glance at the picture.
  let poly = [1]
  for (let i = 0; i < degree; i++) {
    const next = new Array(poly.length + 1).fill(0)
    for (let j = 0; j < poly.length; j++) {
      next[j] ^= mul(poly[j], EXP[i])
      next[j + 1] ^= poly[j]
    }
    poly = next
  }
  return poly.reverse()
}

function rsEncode(data, ecLen) {
  const gen = rsGenerator(ecLen)
  const res = new Array(ecLen).fill(0)
  for (const byte of data) {
    const factor = byte ^ res[0]
    res.shift()
    res.push(0)
    for (let i = 0; i < ecLen; i++) res[i] ^= mul(gen[i + 1], factor)
  }
  return res
}

// ---- Bit stream ----
class Bits {
  constructor() { this.bits = [] }
  push(value, length) {
    for (let i = length - 1; i >= 0; i--) this.bits.push((value >> i) & 1)
  }
  get length() { return this.bits.length }
}

const isAlnum = text => [...text].every(c => ALNUM.includes(c))

function encodeSegment(text, version) {
  const bits = new Bits()
  if (isAlnum(text)) {
    bits.push(0b0010, 4)
    bits.push(text.length, version < 10 ? 9 : 11)
    for (let i = 0; i < text.length; i += 2) {
      if (i + 1 < text.length) {
        bits.push(ALNUM.indexOf(text[i]) * 45 + ALNUM.indexOf(text[i + 1]), 11)
      } else {
        bits.push(ALNUM.indexOf(text[i]), 6)
      }
    }
  } else {
    const bytes = new TextEncoder().encode(text)
    bits.push(0b0100, 4)
    bits.push(bytes.length, version < 10 ? 8 : 16)
    for (const b of bytes) bits.push(b, 8)
  }
  return bits
}

function pickVersion(text, ec) {
  for (let v = 1; v <= 10; v++) {
    const key = `${v}${ec}`
    if (encodeSegment(text, v).length <= dataCodewords(key) * 8) return v
  }
  throw new Error('payload too long for version 10; shorten the encoded text')
}

function buildCodewords(text, version, ec) {
  const key = `${version}${ec}`
  const capacity = dataCodewords(key) * 8
  const bits = encodeSegment(text, version)

  bits.push(0, Math.min(4, capacity - bits.length))       // terminator
  while (bits.length % 8) bits.bits.push(0)               // pad to a byte
  const pad = [0xec, 0x11]
  for (let i = 0; bits.length < capacity; i++) bits.push(pad[i % 2], 8)

  const data = []
  for (let i = 0; i < bits.length; i += 8) {
    let byte = 0
    for (let j = 0; j < 8; j++) byte = (byte << 1) | bits.bits[i + j]
    data.push(byte)
  }

  // Split into blocks, compute EC per block, then interleave. Interleaving is
  // what makes a scratch across the code survivable: consecutive codewords
  // land in different blocks.
  const [ecLen, g1b, g1c, g2b, g2c] = BLOCKS[key]
  const blocks = []
  let at = 0
  for (let i = 0; i < g1b; i++) { blocks.push(data.slice(at, at + g1c)); at += g1c }
  for (let i = 0; i < g2b; i++) { blocks.push(data.slice(at, at + g2c)); at += g2c }
  const ecBlocks = blocks.map(b => rsEncode(b, ecLen))

  const out = []
  const maxData = Math.max(...blocks.map(b => b.length))
  for (let i = 0; i < maxData; i++) for (const b of blocks) if (i < b.length) out.push(b[i])
  for (let i = 0; i < ecLen; i++) for (const b of ecBlocks) out.push(b[i])
  return out
}

// ---- Module placement ----
function emptyGrid(size) {
  return Array.from({ length: size }, () => new Array(size).fill(null))
}

function placeFunction(grid, version) {
  const size = grid.length
  const set = (r, c, v) => { if (r >= 0 && c >= 0 && r < size && c < size) grid[r][c] = v }

  const finder = (r0, c0) => {
    for (let r = -1; r <= 7; r++) for (let c = -1; c <= 7; c++) {
      const inner = r >= 0 && r <= 6 && c >= 0 && c <= 6
      const ring = r === 0 || r === 6 || c === 0 || c === 6
      const core = r >= 2 && r <= 4 && c >= 2 && c <= 4
      set(r0 + r, c0 + c, inner && (ring || core) ? 1 : 0)
    }
  }
  finder(0, 0); finder(0, size - 7); finder(size - 7, 0)

  for (let i = 8; i < size - 8; i++) {
    grid[6][i] = grid[i][6] = i % 2 === 0 ? 1 : 0        // timing
  }

  for (const r of ALIGN[version]) for (const c of ALIGN[version]) {
    // Alignment patterns never overlap a finder.
    if ((r <= 8 && c <= 8) || (r <= 8 && c >= size - 9) || (r >= size - 9 && c <= 8)) continue
    for (let dr = -2; dr <= 2; dr++) for (let dc = -2; dc <= 2; dc++) {
      const edge = Math.abs(dr) === 2 || Math.abs(dc) === 2
      grid[r + dr][c + dc] = edge || (dr === 0 && dc === 0) ? 1 : 0
    }
  }

  grid[size - 8][8] = 1                                   // the always-dark module

  // Reserve format areas so data never lands there.
  for (let i = 0; i < 9; i++) {
    if (grid[8][i] === null) grid[8][i] = 0
    if (grid[i][8] === null) grid[i][8] = 0
  }
  for (let i = 0; i < 8; i++) {
    if (grid[8][size - 1 - i] === null) grid[8][size - 1 - i] = 0
    if (grid[size - 1 - i][8] === null) grid[size - 1 - i][8] = 0
  }

  if (version >= 7) {
    let bch = version << 12
    for (let i = 0; i < 12; i++) {
      if (bch >> (17 - i) & 1) bch ^= 0x1f25 << (5 - i)
    }
    const info = (version << 12) | (bch & 0xfff)
    for (let i = 0; i < 18; i++) {
      const bit = (info >> i) & 1
      grid[Math.floor(i / 3)][size - 11 + (i % 3)] = bit
      grid[size - 11 + (i % 3)][Math.floor(i / 3)] = bit
    }
  }
}

function placeData(grid, codewords, reserved) {
  const size = grid.length
  const bits = []
  for (const cw of codewords) for (let i = 7; i >= 0; i--) bits.push((cw >> i) & 1)

  let bit = 0, upward = true
  for (let right = size - 1; right >= 1; right -= 2) {
    if (right === 6) right = 5                            // column 6 is timing
    for (let step = 0; step < size; step++) {
      const row = upward ? size - 1 - step : step
      for (const col of [right, right - 1]) {
        if (reserved[row][col]) continue
        grid[row][col] = bit < bits.length ? bits[bit] : 0
        bit++
      }
    }
    upward = !upward
  }
}

const MASKS = [
  (r, c) => (r + c) % 2 === 0,
  r => r % 2 === 0,
  (r, c) => c % 3 === 0,
  (r, c) => (r + c) % 3 === 0,
  (r, c) => (Math.floor(r / 2) + Math.floor(c / 3)) % 2 === 0,
  (r, c) => (r * c) % 2 + (r * c) % 3 === 0,
  (r, c) => ((r * c) % 2 + (r * c) % 3) % 2 === 0,
  (r, c) => ((r + c) % 2 + (r * c) % 3) % 2 === 0,
]

function penalty(grid) {
  const size = grid.length
  let score = 0

  // Rule 1: runs of five or more of the same colour.
  for (let i = 0; i < size; i++) {
    for (const line of [grid[i], grid.map(row => row[i])]) {
      let run = 1
      for (let j = 1; j < size; j++) {
        if (line[j] === line[j - 1]) { run++; if (run === 5) score += 3; else if (run > 5) score += 1 }
        else run = 1
      }
    }
  }

  // Rule 2: 2x2 blocks of one colour.
  for (let r = 0; r < size - 1; r++) for (let c = 0; c < size - 1; c++) {
    const v = grid[r][c]
    if (v === grid[r][c + 1] && v === grid[r + 1][c] && v === grid[r + 1][c + 1]) score += 3
  }

  // Rule 3: finder-like 1011101 patterns with four light modules beside them.
  const A = [1, 0, 1, 1, 1, 0, 1, 0, 0, 0, 0]
  const B = [0, 0, 0, 0, 1, 0, 1, 1, 1, 0, 1]
  for (let i = 0; i < size; i++) {
    for (const line of [grid[i], grid.map(row => row[i])]) {
      for (let j = 0; j + 11 <= size; j++) {
        const win = line.slice(j, j + 11)
        if (A.every((v, k) => v === win[k]) || B.every((v, k) => v === win[k])) score += 40
      }
    }
  }

  // Rule 4: deviation from an even balance of dark and light.
  const dark = grid.flat().filter(v => v === 1).length
  score += Math.floor(Math.abs(dark * 100 / (size * size) - 50) / 5) * 10
  return score
}

function placeFormat(grid, ec, mask) {
  const size = grid.length
  const data = (EC_BITS[ec] << 3) | mask
  let bch = data << 10
  for (let i = 0; i < 5; i++) if (bch >> (14 - i) & 1) bch ^= 0x537 << (4 - i)
  const info = ((data << 10) | (bch & 0x3ff)) ^ 0x5412

  // Bit i here is the i-th LEAST significant, but the spec lays the 15 bits
  // out most-significant first. So the MSB (i=14) belongs at (8,0) and the LSB
  // (i=0) at (0,8) - reading the indexing the other way round produces a QR
  // that looks perfectly normal and decodes to nothing at all, because the
  // scanner recovers the wrong EC level and mask from it.
  for (let i = 0; i < 15; i++) {
    const bit = (info >> i) & 1

    // Copy one, wrapped around the top-left finder, skipping the timing line.
    if (i >= 9) grid[8][14 - i] = bit
    else if (i === 8) grid[8][7] = bit
    else if (i === 7) grid[8][8] = bit
    else if (i === 6) grid[7][8] = bit
    else grid[i][8] = bit

    // Copy two: high bits up the bottom-left column, low bits along the
    // top-right row.
    if (i >= 8) grid[size - 15 + i][8] = bit
    else grid[8][size - 1 - i] = bit
  }
}

/**
 * Encode text as a QR matrix of 0/1 rows.
 *
 * Returns the smallest version from 1 to 10 that fits, with the mask chosen by
 * the penalty rules in the spec rather than fixed - a bad mask can leave a
 * pattern a scanner mistakes for a finder.
 */
export function encodeQR(text, { ec = 'M' } = {}) {
  if (typeof text !== 'string' || !text) throw new Error('nothing to encode')
  const version = pickVersion(text, ec)
  const size = version * 4 + 17
  const codewords = buildCodewords(text, version, ec)

  const base = emptyGrid(size)
  placeFunction(base, version)
  const reserved = base.map(row => row.map(v => v !== null))

  const grid = base.map(row => row.map(v => (v === null ? 0 : v)))
  placeData(grid, codewords, reserved)

  let best = null
  for (let m = 0; m < 8; m++) {
    const candidate = grid.map((row, r) =>
      row.map((v, c) => (!reserved[r][c] && MASKS[m](r, c) ? v ^ 1 : v)))
    placeFormat(candidate, ec, m)
    const score = penalty(candidate)
    if (!best || score < best.score) best = { score, grid: candidate, mask: m }
  }
  return { modules: best.grid, version, mask: best.mask, size }
}

/**
 * Render the matrix as an SVG string.
 *
 * SVG rather than canvas so it stays crisp on any screen at any size, costs
 * almost nothing, and needs no drawing surface - it is a single path.
 */
export function qrSVG(text, { ec = 'M', margin = 2, dark = '#000', light = '#fff' } = {}) {
  const { modules, size } = encodeQR(text, { ec })
  const total = size + margin * 2
  let path = ''
  for (let r = 0; r < size; r++) for (let c = 0; c < size; c++) {
    if (modules[r][c]) path += `M${c + margin} ${r + margin}h1v1h-1z`
  }
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${total} ${total}" shape-rendering="crispEdges">` +
    `<rect width="${total}" height="${total}" fill="${light}"/>` +
    `<path d="${path}" fill="${dark}"/></svg>`
}
