import { test } from 'node:test'
import assert from 'node:assert/strict'
import { liveState, untilLabel, watParts, slotStart, DAYS } from '../src/lib/liveSchedule.js'

// What is on right now.
//
// The clock is injected rather than read, so every boundary can be tested at
// the exact minute instead of waited for: the minute before doors, the minute
// the headline starts, the gap between the two days, and the minute after it
// is all over.

// A Lagos wall-clock instant. WAT is UTC+1 with no daylight saving, so the
// hour goes in one less in UTC.
const wat = (day, hour, min = 0) => Date.UTC(2026, 11, day, hour - 1, min)

test('Lagos wall time is read the same wherever the phone thinks it is', () => {
  // A visitor whose device is still on London time must see the Lagos running
  // order, because that is the one they are standing in.
  const p = watParts(Date.UTC(2026, 11, 12, 12, 30))
  assert.equal(p.date, '2026-12-12')
  assert.equal(p.minutes, 13 * 60 + 30)
})

test('midnight in Lagos rolls the date, not just the hour', () => {
  const p = watParts(Date.UTC(2026, 11, 11, 23, 30))
  assert.equal(p.date, '2026-12-12')
  assert.equal(p.minutes, 30)
})

test('long before the event it counts down to the first day', () => {
  const s = liveState(wat(1, 12))
  assert.equal(s.state, 'before')
  assert.equal(s.day.date, '2026-12-11')
  assert.equal(s.current, null)
  assert.ok(s.msToNext > 0)
})

test('the minute before doors is still "before"', () => {
  const s = liveState(wat(12, 11, 59))
  assert.equal(s.state, 'before')
  assert.equal(s.current, null)
  assert.equal(s.next.title, 'DOORS OPEN')
  assert.equal(untilLabel(s.msToNext), 'in 1 min')
})

test('the minute doors open it goes live', () => {
  const s = liveState(wat(12, 12, 0))
  assert.equal(s.state, 'live')
  assert.equal(s.current.title, 'DOORS OPEN')
})

test('mid-afternoon reports the slot that has started, not the next one', () => {
  // The commonest way to get this wrong is an off-by-one showing the upcoming
  // slot as if it were already happening.
  const s = liveState(wat(12, 13, 15))
  assert.equal(s.state, 'live')
  assert.equal(s.current.startsAt <= 13 * 60 + 15, true)
  assert.equal(s.next.startsAt > 13 * 60 + 15, true)
})

test('the last slot of the day has no next', () => {
  // "Next up: doors open tomorrow" would be a lie about the next hour.
  // 22:30 is inside DOORS CLOSE, which starts at 22:00 - a day now ends an
  // hour after its last slot begins, so that slot is actually reachable.
  const s = liveState(wat(12, 22, 30))
  assert.equal(s.state, 'live')
  assert.equal(s.current.title, 'DOORS CLOSE')
  assert.equal(s.next, null)
  assert.equal(s.msToNext, null)
  assert.equal(untilLabel(s.msToNext), null)
})

test('after the last day ends it is over', () => {
  const s = liveState(wat(12, 23, 1))
  assert.equal(s.state, 'after')
  assert.equal(s.current, null)
  assert.equal(s.next, null)
})

test('between the two days it points at the second', () => {
  const s = liveState(wat(11, 23, 30))
  assert.equal(s.state, 'between')
  assert.equal(s.current, null)
  assert.equal(s.next.date, '2026-12-12')
})

test('finals night runs on its own schedule', () => {
  const s = liveState(wat(11, 19, 30))
  assert.equal(s.state, 'live')
  assert.equal(s.day.date, '2026-12-11')
  assert.equal(s.current.title, 'THE FINAL MATCH')
})

test('progress runs from 0 to 1 across a slot and never past it', () => {
  assert.equal(liveState(wat(12, 12, 0)).progress, 0)
  const late = liveState(wat(12, 22, 59))
  assert.ok(late.progress > 0.9 && late.progress <= 1, `got ${late.progress}`)
  for (let h = 12; h < 23; h++) {
    const p = liveState(wat(12, h, 30)).progress
    assert.ok(p >= 0 && p <= 1, `progress out of range at ${h}:30: ${p}`)
  }
})

test('every minute of both days resolves to a sane state', () => {
  // A crash or an undefined slot on the day itself is the worst possible time
  // for one, so walk every minute rather than sampling.
  const seen = new Set()
  for (const day of [11, 12]) {
    for (let m = 0; m < 24 * 60; m++) {
      const s = liveState(wat(day, Math.floor(m / 60), m % 60))
      assert.ok(['before', 'live', 'between', 'after'].includes(s.state), `bad state at ${day} ${m}`)
      if (s.state === 'live') {
        assert.ok(s.current && s.current.title, `live with no current at ${day} ${m}`)
        assert.ok(s.progress >= 0 && s.progress <= 1)
      } else {
        assert.equal(s.current, null, `not live but has current at ${day} ${m}`)
      }
      seen.add(s.state)
    }
  }
  // All four states really are reachable, so none of the above is vacuous.
  assert.deepEqual([...seen].sort(), ['after', 'before', 'between', 'live'])
})

test('slots are listed in time order', () => {
  // liveState sorts defensively, but the schedule section renders the raw
  // array, so an out-of-order entry would show correctly here and wrongly
  // there.
  for (const day of DAYS) {
    const mins = day.items.map(i => {
      const [h, m] = i.time.split(':').map(Number)
      return ((h % 12) + (i.period === 'PM' ? 12 : 0)) * 60 + m
    })
    assert.deepEqual(mins, [...mins].sort((a, b) => a - b), `${day.date} is not in time order`)
  }
})

test('every slot in the running order can actually be reached', () => {
  // A day that ended exactly when its last slot began made that slot
  // impossible to display. Walk each day and confirm every slot is current at
  // some point.
  for (const [d, day] of [[11, DAYS[0]], [12, DAYS[1]]]) {
    const reached = new Set()
    for (let m = 0; m < 24 * 60; m++) {
      const s = liveState(wat(d, Math.floor(m / 60), m % 60))
      if (s.state === 'live') reached.add(s.current.title)
    }
    for (const item of day.items) {
      assert.ok(reached.has(item.title), `${day.date}: "${item.title}" is never shown as on now`)
    }
  }
})

test('slotStart converts a Lagos slot to the right instant', () => {
  assert.equal(slotStart('2026-12-12', { time: '12:00', period: 'PM' }), Date.UTC(2026, 11, 12, 11, 0))
  assert.equal(slotStart('2026-12-12', { time: '8:00', period: 'PM' }), Date.UTC(2026, 11, 12, 19, 0))
})

test('the countdown reads in plain words', () => {
  assert.equal(untilLabel(0), 'any minute now')
  assert.equal(untilLabel(29_000), 'any minute now')
  assert.equal(untilLabel(60_000), 'in 1 min')
  assert.equal(untilLabel(45 * 60_000), 'in 45 min')
  assert.equal(untilLabel(60 * 60_000), 'in 1 hr')
  assert.equal(untilLabel(90 * 60_000), 'in 1 hr 30 min')
  assert.equal(untilLabel(null), null)
  assert.equal(untilLabel(-1), null)
  assert.equal(untilLabel(NaN), null)
})

test('no performer name is exposed through this section', () => {
  // Names stay classified until the reveal, and a live "what is on" panel is
  // exactly where a leak would surface first.
  for (const day of DAYS) {
    for (const item of day.items) {
      if (/DJ SET|LIVE ACT|HEADLINE ACT/i.test(item.title)) {
        assert.match(item.title, /CLASSIFIED/, `${item.title} names a performer before the reveal`)
      }
    }
  }
})
