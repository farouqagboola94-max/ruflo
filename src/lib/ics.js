// Turning a personal plan into a calendar file.
//
// Getting the day into someone's phone, with an alarm, is the strongest thing
// the site can do about actually showing up. Kept pure so the escaping and the
// time arithmetic can be tested directly.

// Lagos is UTC+1 all year - Nigeria has no daylight saving - so a local wall
// time converts with a fixed offset rather than a timezone database.
const WAT_OFFSET_MIN = 60

/** "8:00" + "PM" -> minutes past midnight. */
export function toMinutes(time, period) {
  const [h, m] = String(time).split(':').map(Number)
  if (!Number.isFinite(h) || !Number.isFinite(m)) return null
  let hour = h % 12
  if (String(period).toUpperCase() === 'PM') hour += 12
  return hour * 60 + m
}

function pad(n) { return String(n).padStart(2, '0') }

/**
 * A local Lagos wall time on the event date, as a UTC stamp in iCalendar's
 * basic format. Subtracting the offset is what converts WAT to UTC.
 */
export function stampUTC(dateISO, minutes) {
  const [y, mo, d] = dateISO.split('-').map(Number)
  const utc = Date.UTC(y, mo - 1, d, 0, minutes - WAT_OFFSET_MIN, 0)
  const t = new Date(utc)
  return `${t.getUTCFullYear()}${pad(t.getUTCMonth() + 1)}${pad(t.getUTCDate())}` +
         `T${pad(t.getUTCHours())}${pad(t.getUTCMinutes())}00Z`
}

/**
 * iCalendar escaping. Backslash first, or it would escape the escapes it just
 * added. Newlines become the literal two-character sequence the format wants.
 */
export function escapeICS(text) {
  return String(text ?? '')
    .replace(/\\/g, '\\\\')
    .replace(/;/g, '\\;')
    .replace(/,/g, '\\,')
    .replace(/\r?\n/g, '\\n')
}

/**
 * Lines longer than 75 octets must be folded, or strict parsers reject the
 * file. A continuation line starts with a single space.
 */
export function foldLine(line, limit = 74) {
  if (line.length <= limit) return line
  const out = [line.slice(0, limit)]
  let rest = line.slice(limit)
  while (rest.length > limit - 1) {
    out.push(' ' + rest.slice(0, limit - 1))
    rest = rest.slice(limit - 1)
  }
  if (rest) out.push(' ' + rest)
  return out.join('\r\n')
}

/**
 * Build the calendar. `items` are schedule slots; each becomes one event
 * running until the next slot the visitor picked, or `defaultMins` for the
 * last one.
 *
 * `stamp` is injected so a generated file is reproducible in tests.
 */
export function buildICS(items, {
  dateISO = '2026-12-12',
  location = 'Muri Okunola Park, Victoria Island, Lagos',
  defaultMins = 60,
  alarmMins = 30,
  stamp = '20260101T000000Z',
} = {}) {
  const slots = items
    .map(it => ({ ...it, start: toMinutes(it.time, it.period) }))
    .filter(it => it.start !== null)
    .sort((a, b) => a.start - b.start)

  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Sneakers Fest 26//Your Day//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    `X-WR-CALNAME:${escapeICS("Sneakers Fest '26 - your day")}`,
  ]

  slots.forEach((slot, i) => {
    const next = slots[i + 1]
    // Run to the next thing you picked, so the calendar reads as a day rather
    // than a pile of overlapping hour blocks.
    const end = next ? next.start : slot.start + defaultMins

    lines.push(
      'BEGIN:VEVENT',
      `UID:${escapeICS(`sf26-${dateISO}-${slot.start}@sneakersfest`)}`,
      `DTSTAMP:${stamp}`,
      `DTSTART:${stampUTC(dateISO, slot.start)}`,
      `DTEND:${stampUTC(dateISO, end)}`,
      `SUMMARY:${escapeICS(slot.title)}`,
      `LOCATION:${escapeICS(slot.stage ? `${slot.stage} - ${location}` : location)}`,
    )
    if (slot.desc) lines.push(`DESCRIPTION:${escapeICS(slot.desc)}`)
    if (alarmMins > 0) {
      lines.push(
        'BEGIN:VALARM',
        `TRIGGER:-PT${alarmMins}M`,
        'ACTION:DISPLAY',
        `DESCRIPTION:${escapeICS(slot.title)}`,
        'END:VALARM',
      )
    }
    lines.push('END:VEVENT')
  })

  lines.push('END:VCALENDAR')

  // CRLF is what the spec requires, and what Outlook insists on.
  return lines.map(l => foldLine(l)).join('\r\n') + '\r\n'
}

export function downloadICS(items, opts = {}) {
  const ics = buildICS(items, { ...opts, stamp: opts.stamp || icsStampNow() })
  const url = URL.createObjectURL(new Blob([ics], { type: 'text/calendar;charset=utf-8' }))
  const a = document.createElement('a')
  a.href = url
  a.download = 'sneakers-fest-26.ics'
  a.click()
  URL.revokeObjectURL(url)
}

export function icsStampNow(now = new Date()) {
  return `${now.getUTCFullYear()}${pad(now.getUTCMonth() + 1)}${pad(now.getUTCDate())}` +
         `T${pad(now.getUTCHours())}${pad(now.getUTCMinutes())}${pad(now.getUTCSeconds())}Z`
}
