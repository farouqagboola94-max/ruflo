import { test } from 'node:test'
import assert from 'node:assert/strict'
import { arrivalKey, parseArrival, gatePicture, GATE_PREFIX } from '../netlify/functions/lib/gate-domain.js'

// The live gate view.
//
// The organiser could see one number - how many tickets had ever been scanned.
// On the day the questions are how many are inside now, how fast they are
// arriving, and whether to open another lane. The first of those is a safety
// question, so the arithmetic underneath it is worth pinning down properly.
//
// The clock is injected, so every boundary is tested at the exact minute.

const wat = (day, hour, min = 0) => Date.UTC(2026, 11, day, hour - 1, min)
const keysFor = (spec) => spec.flatMap(([tier, at, n = 1]) =>
  Array.from({ length: n }, (_, i) => arrivalKey(`SF26-${tier}-A1B2C${i % 10}`, at + i * 1000)))

test('an arrival round-trips through its key', () => {
  const at = wat(12, 13, 47)
  const key = arrivalKey('SF26-VIP-A1B2C3', at)
  assert.equal(key, 'gate:2026-12-12T12:47:SF26-VIP-A1B2C3')
  const back = parseArrival(key)
  assert.equal(back.ticketId, 'SF26-VIP-A1B2C3')
  assert.equal(back.tier, 'vip')
  // Truncated to the minute, which is the resolution the view works in.
  assert.equal(back.at, Date.UTC(2026, 11, 12, 12, 47))
})

test('the key starts with the prefix the listing uses', () => {
  // If these drift apart the dashboard lists nothing and quietly reports an
  // empty park while people are streaming through the gate.
  assert.ok(arrivalKey('SF26-GEN-000000', Date.now()).startsWith(GATE_PREFIX))
})

test('anything that is not an arrival key parses to null', () => {
  for (const k of ['', null, undefined, 'gate:', 'ticket:SF26-GEN-A1B2C3',
                   'gate:2026-12-12T12:47:NOTATICKET', 'gate:not-a-time:SF26-GEN-A1B2C3',
                   'gate:2026-12-12T12:47:SF26-GEN-ZZZZZZ']) {
    assert.equal(parseArrival(k), null, `expected null for ${JSON.stringify(k)}`)
  }
})

test('an empty gate reports an empty gate', () => {
  const g = gatePicture([], { now: wat(12, 13) })
  assert.equal(g.inside, 0)
  assert.equal(g.recent, 0)
  assert.equal(g.perHour, 0)
  assert.equal(g.firstArrival, null)
  assert.equal(g.busiest, null)
  assert.deepEqual(g.byTier, {})
})

test('arrivals are counted and split by tier', () => {
  const g = gatePicture(keysFor([['GEN', wat(12, 12, 5), 30], ['VIP', wat(12, 12, 20), 8]]),
    { now: wat(12, 13) })
  assert.equal(g.inside, 38)
  assert.equal(g.byTier.gen, 30)
  assert.equal(g.byTier.vip, 8)
})

test('unreadable records are reported, not silently dropped', () => {
  // A number that is quietly wrong is worse than one that admits its gap.
  const g = gatePicture([...keysFor([['GEN', wat(12, 12), 5]]), 'gate:rubbish', 'nonsense'],
    { now: wat(12, 13) })
  assert.equal(g.inside, 5)
  assert.equal(g.unreadable, 2)
})

test('capacity is a percentage only when it is configured', () => {
  const keys = keysFor([['GEN', wat(12, 12), 500]])
  const withCap = gatePicture(keys, { now: wat(12, 13), capacity: 2000 })
  assert.equal(withCap.percentFull, 25)
  assert.equal(withCap.remaining, 1500)

  // Without a capacity, "0% full" would be a claim rather than an absence.
  const without = gatePicture(keys, { now: wat(12, 13) })
  assert.equal(without.percentFull, null)
  assert.equal(without.remaining, null)
})

test('a full park does not report more than full, or negative headroom', () => {
  const g = gatePicture(keysFor([['GEN', wat(12, 12), 120]]), { now: wat(12, 13), capacity: 100 })
  assert.equal(g.percentFull, 100)
  assert.equal(g.remaining, 0)
})

test('the arrival rate reflects the recent window, not the whole day', () => {
  // A thousand people this morning must not read as a queue this minute.
  const g = gatePicture(
    keysFor([['GEN', wat(12, 12), 1000], ['GEN', wat(12, 16, 50), 10]]),
    { now: wat(12, 17), windowMin: 15 },
  )
  assert.equal(g.inside, 1010)
  assert.equal(g.recent, 10)
  assert.equal(g.perHour, 40)          // 10 in 15 minutes
})

test('a building queue reads as rising, and a clearing one as falling', () => {
  const rising = gatePicture(
    keysFor([['GEN', wat(12, 15, 40), 4], ['GEN', wat(12, 16, 50), 30]]),
    { now: wat(12, 17), windowMin: 15 })
  assert.equal(rising.trend, 'rising')

  const falling = gatePicture(
    keysFor([['GEN', wat(12, 16, 35), 30], ['GEN', wat(12, 16, 50), 4]]),
    { now: wat(12, 17), windowMin: 15 })
  assert.equal(falling.trend, 'falling')
})

test('a small wobble is not a trend', () => {
  // Two extra people is noise. Calling it "rising" would send someone to open
  // a lane that is not needed, and make the signal worth ignoring.
  const g = gatePicture(
    keysFor([['GEN', wat(12, 16, 35), 8], ['GEN', wat(12, 16, 50), 10]]),
    { now: wat(12, 17), windowMin: 15 })
  assert.equal(g.trend, 'steady')
})

test('the newest arrivals are in the current column', () => {
  const g = gatePicture(keysFor([['GEN', wat(12, 16, 58), 3]]),
    { now: wat(12, 16, 59), bucketCount: 12 })
  const last = g.timeline[g.timeline.length - 1]
  assert.equal(last.count, 3, 'the most recent arrivals are not in the current bucket')
  assert.equal(g.timeline.slice(0, -1).every(b => b.count === 0), true)
})

test('an arrival is never lost off the right-hand edge, whatever the minute', () => {
  // The commonest way to get a bucketed chart wrong is an off-by-one that
  // drops whatever just happened - which is precisely what is being watched
  // for. Walk every minute of the day, including the boundaries where a bucket
  // has only just begun, and check the newest arrival is always somewhere on
  // the graph.
  for (let m = 0; m < 24 * 60; m++) {
    const now = wat(12, Math.floor(m / 60), m % 60)
    const g = gatePicture([arrivalKey('SF26-GEN-A1B2C3', now)], { now, bucketCount: 12 })
    const onGraph = g.timeline.reduce((n, b) => n + b.count, 0)
    assert.equal(onGraph, 1, `an arrival at minute ${m} is not on the timeline`)
    assert.equal(g.recent, 1, `an arrival at minute ${m} is not counted as recent`)
  }
})

test('the timeline covers exactly the window it claims to', () => {
  const g = gatePicture([], { now: wat(12, 17), bucketCount: 12 })
  assert.equal(g.timeline.length, 12)
  const span = g.timeline[11].to - g.timeline[0].from
  assert.equal(span, 12 * 15 * 60_000, 'twelve fifteen-minute buckets is three hours')
  assert.ok(g.timeline[11].to > wat(12, 17), 'the current bucket must not have ended already')
})

test('arrivals older than the timeline still count as inside', () => {
  // Someone who came at midday is in the park at eight in the evening. They
  // fall off the graph; they must not fall out of the total.
  const g = gatePicture(keysFor([['GEN', wat(12, 12), 40]]), { now: wat(12, 20) })
  assert.equal(g.inside, 40)
  assert.equal(g.timeline.every(b => b.count === 0), true)
  assert.equal(g.recent, 0)
})

test('the busiest window is the busiest window', () => {
  const g = gatePicture(
    keysFor([['GEN', wat(12, 15, 5), 6], ['GEN', wat(12, 16, 5), 25], ['GEN', wat(12, 16, 50), 9]]),
    { now: wat(12, 17) })
  assert.equal(g.busiest.count, 25)
  assert.ok(g.busiest.from <= wat(12, 16, 5) && g.busiest.to > wat(12, 16, 5))
})

test('first and last arrival bracket the day', () => {
  const g = gatePicture(keysFor([['GEN', wat(12, 12, 3), 2], ['VIP', wat(12, 20, 40), 2]]),
    { now: wat(12, 21) })
  assert.equal(g.firstArrival, Date.UTC(2026, 11, 12, 11, 3))
  assert.equal(g.lastArrival, Date.UTC(2026, 11, 12, 19, 40))
})

test('keys arriving out of order do not confuse the picture', () => {
  // A listing has no guaranteed order, so nothing here may assume one.
  const keys = keysFor([['GEN', wat(12, 12), 3], ['VIP', wat(12, 18), 3]]).reverse()
  const g = gatePicture(keys, { now: wat(12, 19) })
  assert.ok(g.firstArrival < g.lastArrival)
  assert.equal(g.inside, 6)
})

test('two thousand arrivals are handled without breaking a sweat', () => {
  // This is the scale that made reading every ticket record unusable, and the
  // reason the answer comes from key names instead.
  const keys = keysFor([['GEN', wat(12, 12), 2000]])
  const started = Date.now()
  const g = gatePicture(keys, { now: wat(12, 13), capacity: 2500 })
  assert.equal(g.inside, 2000)
  assert.ok(Date.now() - started < 500, 'aggregating a full house should be near-instant')
})
