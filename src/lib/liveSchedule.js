import { toMinutes } from './ics.js'
import { DAY1, DAY2 } from '../data/schedule.js'

// What is on right now.
//
// The site could tell you the whole running order months ahead and nothing at
// all on the day itself, which is the one day it matters. This works out where
// the clock is against the schedule.
//
// Kept pure and clock-injected so every boundary - the minute before doors, the
// minute the headline starts, the gap between the two days - can be tested
// directly rather than waited for. It reads only static data, so it works with
// no network, which is the state of most phones in that park.

// Nigeria has no daylight saving, so Lagos wall time is a fixed offset from UTC
// and needs no timezone database.
const WAT_OFFSET_MIN = 60

// A day ends an hour after its last slot starts, rather than at a hand-written
// time. Setting day two to end at 22:00 when DOORS CLOSE also starts at 22:00
// made that final slot unreachable - it could never be the current one, so the
// hour when people are collecting purchases showed nothing at all.
const LAST_SLOT_MINUTES = 60

const dayEnd = items => {
  const last = items.reduce((max, i) => Math.max(max, toMinutes(i.time, i.period)), 0)
  return last + LAST_SLOT_MINUTES
}

export const DAYS = [
  { date: '2026-12-11', label: 'FINALS NIGHT', venue: 'Mobolaji Johnson Arena, Onikan', items: DAY1, endsAt: dayEnd(DAY1) },
  { date: '2026-12-12', label: 'THE SOLE EXHIBITION', venue: 'Muri Okunola Park, Victoria Island', items: DAY2, endsAt: dayEnd(DAY2) },
]

/**
 * Lagos wall-clock reading of an instant, as a date and minutes past midnight.
 *
 * Shifting the epoch by the offset and then reading UTC fields gives the same
 * answer wherever the phone thinks it is - a visitor whose device is still on
 * London time sees the Lagos running order, which is the one they are standing
 * in.
 */
export function watParts(now = Date.now()) {
  const t = new Date(Number(now) + WAT_OFFSET_MIN * 60_000)
  const date = `${t.getUTCFullYear()}-${String(t.getUTCMonth() + 1).padStart(2, '0')}-${String(t.getUTCDate()).padStart(2, '0')}`
  return { date, minutes: t.getUTCHours() * 60 + t.getUTCMinutes() }
}

/** The instant a day's slot starts, in epoch milliseconds. */
export function slotStart(dateISO, item) {
  const [y, mo, d] = dateISO.split('-').map(Number)
  return Date.UTC(y, mo - 1, d, 0, toMinutes(item.time, item.period) - WAT_OFFSET_MIN, 0)
}

const withStart = day =>
  day.items
    .map(item => ({ ...item, startsAt: toMinutes(item.time, item.period) }))
    .sort((a, b) => a.startsAt - b.startsAt)

/**
 * Where the clock sits against the running order.
 *
 * state is one of:
 *   before  - the first day has not started
 *   live    - a day is running; `current` is on now
 *   between - day one is over and day two has not begun
 *   after   - it is all finished
 *
 * `next` is the following slot, which on the last slot of a day is null rather
 * than the first slot of the next day: "next up, doors open tomorrow" would be
 * a lie about the next hour.
 */
export function liveState(now = Date.now()) {
  const { date, minutes } = watParts(now)

  const dayIndex = DAYS.findIndex(d => d.date === date)
  if (dayIndex >= 0) {
    const day = DAYS[dayIndex]
    const items = withStart(day)
    const first = items[0]

    if (minutes < first.startsAt) {
      return {
        state: 'before', day, current: null, next: first,
        msToNext: (first.startsAt - minutes) * 60_000,
      }
    }
    if (minutes >= day.endsAt) {
      const done = dayIndex === DAYS.length - 1
      return { state: done ? 'after' : 'between', day, current: null, next: done ? null : DAYS[dayIndex + 1] }
    }

    let at = 0
    for (let i = 0; i < items.length; i++) if (minutes >= items[i].startsAt) at = i
    const current = items[at]
    const next = items[at + 1] || null
    const endsAt = next ? next.startsAt : day.endsAt

    return {
      state: 'live', day, current, next,
      msToNext: next ? (next.startsAt - minutes) * 60_000 : null,
      // How far through the current slot we are, for a progress bar.
      progress: Math.min(1, Math.max(0, (minutes - current.startsAt) / Math.max(1, endsAt - current.startsAt))),
    }
  }

  const upcoming = DAYS.find(d => d.date > date)
  if (upcoming) {
    const first = withStart(upcoming)[0]
    return { state: 'before', day: upcoming, current: null, next: first, msToNext: slotStart(upcoming.date, first) - Number(now) }
  }
  return { state: 'after', day: DAYS[DAYS.length - 1], current: null, next: null }
}

/** "in 25 min", "in 2 hr 10 min". Null when there is nothing to count to. */
export function untilLabel(ms) {
  if (ms == null || !Number.isFinite(ms) || ms < 0) return null
  const mins = Math.round(ms / 60_000)
  if (mins < 1) return 'any minute now'
  if (mins < 60) return `in ${mins} min`
  const h = Math.floor(mins / 60)
  const m = mins % 60
  return m ? `in ${h} hr ${m} min` : `in ${h} hr`
}
