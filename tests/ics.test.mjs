// The calendar file behind Build Your Day.
//
// Run: node tests/ics.test.mjs
//
// Getting the day into someone's phone with an alarm is the strongest thing
// the site can do about attendance, so a file a calendar app silently refuses
// is a real failure. These pin the time arithmetic, the escaping, and the line
// folding - the three things that make calendar apps reject a file.

import { join, dirname } from 'path'
import { fileURLToPath, pathToFileURL } from 'url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')

let pass = 0, fail = 0
const check = (name, cond) => {
  if (cond) { pass++; console.log('  PASS  ' + name) }
  else      { fail++; console.error('  FAIL  ' + name) }
}

const I = await import(pathToFileURL(join(root, 'src', 'lib', 'ics.js')).href)
const { DAY2 } = await import(pathToFileURL(join(root, 'src', 'data', 'schedule.js')).href)

console.log('\nreading the clock:')

check('midnight-ish morning', I.toMinutes('12:00', 'AM') === 0)
check('noon is not midnight', I.toMinutes('12:00', 'PM') === 720)
check('an afternoon time', I.toMinutes('1:00', 'PM') === 780)
check('an evening headline slot', I.toMinutes('8:00', 'PM') === 1200)
check('doors close at ten', I.toMinutes('10:00', 'PM') === 1320)
check('minutes are kept', I.toMinutes('12:30', 'PM') === 750)
check('nonsense yields nothing', I.toMinutes('later', 'PM') === null)

console.log('\nLagos time to UTC:')

// Nigeria is UTC+1 with no daylight saving, so noon in Lagos is 11:00 UTC.
check('noon in Lagos is 11:00 UTC', I.stampUTC('2026-12-12', 720) === '20261212T110000Z')
check('the 8pm headline is 19:00 UTC', I.stampUTC('2026-12-12', 1200) === '20261212T190000Z')
check('an early slot rolls back to the previous day',
  I.stampUTC('2026-12-12', 30) === '20261211T233000Z')

console.log('\nescaping:')

check('commas are escaped', I.escapeICS('Lagos, Nigeria') === 'Lagos\\, Nigeria')
check('semicolons are escaped', I.escapeICS('a;b') === 'a\\;b')
check('newlines become the literal sequence', I.escapeICS('one\ntwo') === 'one\\ntwo')
check('a backslash is escaped once, not twice over',
  I.escapeICS('a\\b') === 'a\\\\b')
check('backslash is handled before the others, so a comma is not double-escaped',
  I.escapeICS('a\\,b') === 'a\\\\\\,b')

console.log('\nline folding:')

const long = 'SUMMARY:' + 'x'.repeat(300)
const folded = I.foldLine(long)
check('a long line is broken up', folded.includes('\r\n'))
check('every physical line stays within the limit',
  folded.split('\r\n').every(l => l.length <= 75))
check('continuation lines start with a space',
  folded.split('\r\n').slice(1).every(l => l.startsWith(' ')))
check('unfolding restores the original',
  folded.split('\r\n').map((l, i) => i ? l.slice(1) : l).join('') === long)
check('a short line is left alone', I.foldLine('SUMMARY:Doors open') === 'SUMMARY:Doors open')

console.log('\nbuilding the file:')

const picks = DAY2.filter(s => ['12:00', '1:00', '8:00'].includes(s.time)).slice(0, 3)
const ics = I.buildICS(picks, { stamp: '20260101T000000Z' })

check('it opens and closes as a calendar',
  ics.startsWith('BEGIN:VCALENDAR') && ics.trimEnd().endsWith('END:VCALENDAR'))
check('it declares a version', ics.includes('VERSION:2.0'))
check('one event per pick', (ics.match(/BEGIN:VEVENT/g) || []).length === picks.length)
check('every event is closed', (ics.match(/END:VEVENT/g) || []).length === picks.length)
check('lines end CRLF, which Outlook requires', ics.includes('\r\n') && !/[^\r]\n/.test(ics))
check('every event carries a start', (ics.match(/DTSTART:/g) || []).length === picks.length)
check('every event carries an end', (ics.match(/DTEND:/g) || []).length === picks.length)
check('every event has a unique id',
  new Set(ics.match(/^UID:.*$/gm)).size === picks.length)
check('the venue is on the events', ics.includes('Muri Okunola Park'))
check('a reminder is attached', ics.includes('BEGIN:VALARM') && ics.includes('TRIGGER:-PT30M'))

console.log('\nevents run to the next thing you picked:')

const two = I.buildICS([
  { time: '12:00', period: 'PM', title: 'Doors' },
  { time: '2:00',  period: 'PM', title: 'Set' },
], { stamp: '20260101T000000Z' })

// 12:00 Lagos is 11:00 UTC, 2:00pm Lagos is 13:00 UTC. The first event should
// run right up to the second, so both stamps appear - one as an end, one as a
// start.
check('the first event ends exactly when the second starts',
  two.includes('DTEND:20261212T130000Z') && two.includes('DTSTART:20261212T130000Z'))
check('and the first one starts at noon Lagos time',
  two.includes('DTSTART:20261212T110000Z'))
check('the last event gets the default length',
  two.includes('DTEND:20261212T140000Z'))

const one = I.buildICS([{ time: '8:00', period: 'PM', title: 'Headline' }], { stamp: '20260101T000000Z' })
check('a single pick runs an hour by default',
  one.includes('DTSTART:20261212T190000Z') && one.includes('DTEND:20261212T200000Z'))

console.log('\nordering and odd input:')

const backwards = I.buildICS([
  { time: '8:00', period: 'PM', title: 'Late' },
  { time: '12:00', period: 'PM', title: 'Early' },
], { stamp: '20260101T000000Z' })
check('picks are sorted by time regardless of tap order',
  backwards.indexOf('SUMMARY:Early') < backwards.indexOf('SUMMARY:Late'))

check('an empty plan still produces a valid, empty calendar',
  I.buildICS([]).includes('BEGIN:VCALENDAR') && !I.buildICS([]).includes('BEGIN:VEVENT'))
check('an unparseable time is dropped rather than breaking the file',
  !I.buildICS([{ time: 'soon', period: 'PM', title: 'Mystery' }]).includes('BEGIN:VEVENT'))

console.log('\nclassified acts survive the trip:')

const classified = DAY2.filter(s => s.title.includes('CLASSIFIED'))
check('the running order still has classified acts', classified.length > 0)
const withHidden = I.buildICS(classified, { stamp: '20260101T000000Z' })
check('a classified act can still be planned', withHidden.includes('BEGIN:VEVENT'))
check('and no artist name leaks into the calendar', withHidden.includes('CLASSIFIED'))

console.log(`\nics: ${pass} passed, ${fail} failed\n`)
process.exit(fail ? 1 : 0)
