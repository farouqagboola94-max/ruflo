// Friday Night Protocol - domain rules and handler behaviour.
//
// Run: node tests/fnp.test.mjs
//
// Date logic is the risky part here, so instants are pinned against known
// calendar dates rather than derived from the clock.

import { mkdtemp, mkdir, writeFile, copyFile, rm } from 'fs/promises'
import { tmpdir } from 'os'
import { join, dirname } from 'path'
import { fileURLToPath, pathToFileURL } from 'url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const FN = join(root, 'netlify', 'functions')

let pass = 0, fail = 0
const check = (name, cond) => {
  if (cond) { pass++; console.log('  PASS  ' + name) }
  else      { fail++; console.error('  FAIL  ' + name) }
}

const F = await import(pathToFileURL(join(FN, 'lib', 'fnp-domain.js')).href)

// 2026-08-07 is a Friday. 2026-08-08 is a Saturday.
const FRI_NOON   = '2026-08-07T11:00:00.000Z' // 12:00 WAT Friday
const FRI_EVE    = '2026-08-07T19:00:00.000Z' // 20:00 WAT Friday
const FRI_LATE   = '2026-08-07T23:30:00.000Z' // 00:30 WAT Saturday
const SAT        = '2026-08-08T11:00:00.000Z'
const THU        = '2026-08-06T11:00:00.000Z'
// 23:30 UTC Thursday is already 00:30 WAT Friday.
const THU_LATE_UTC = '2026-08-06T23:30:00.000Z'

console.log('domain:')
check('a Friday midday is a Friday in Lagos', F.isFriday(FRI_NOON) === true)
check('a Saturday is not a Friday', F.isFriday(SAT) === false)
check('a Thursday is not a Friday', F.isFriday(THU) === false)

// The WAT offset is the whole point of doing this server-side.
check('late Thursday UTC is already Friday in Lagos', F.isFriday(THU_LATE_UTC) === true)
check('late Friday UTC has rolled into Saturday in Lagos', F.isFriday(FRI_LATE) === false)

check('session id is the Lagos date', F.sessionIdFor(FRI_NOON) === '2026-08-07')
check('session id follows the Lagos date across the UTC boundary',
  F.sessionIdFor(THU_LATE_UTC) === '2026-08-07')
check('there is no session on a Saturday', F.sessionIdFor(SAT) === null)

check('midday Friday is not yet live', F.isLive(FRI_NOON) === false)
check('Friday evening is live', F.isLive(FRI_EVE) === true)
check('Saturday is not live', F.isLive(SAT) === false)

check('next session from Thursday is that Friday',
  F.nextSessionAt(THU).startsWith('2026-08-07'))
check('next session from Friday morning is the same evening',
  F.nextSessionAt(FRI_NOON).startsWith('2026-08-07'))
check('next session from Friday evening is the following week',
  F.nextSessionAt(FRI_EVE).startsWith('2026-08-14'))
check('next session from Saturday is the following Friday',
  F.nextSessionAt(SAT).startsWith('2026-08-14'))
check('next session opens at the live hour in Lagos',
  F.watParts(F.nextSessionAt(THU)).hour === F.LIVE_FROM_HOUR)

check('attended list is sorted and de-duplicated',
  JSON.stringify(F.normaliseAttended(['2026-08-14', '2026-08-07', '2026-08-07']))
    === JSON.stringify(['2026-08-07', '2026-08-14']))
check('malformed session ids are discarded',
  F.normaliseAttended(['nonsense', 42, null, '2026-08-07']).length === 1)

check('three consecutive Fridays is a streak of 3',
  F.computeStreak(['2026-07-24', '2026-07-31', '2026-08-07'], '2026-08-07') === 3)
check('a missed Friday resets the run',
  F.computeStreak(['2026-07-17', '2026-07-31', '2026-08-07'], '2026-08-07') === 2)
check('streak is zero when the latest session is not attended',
  F.computeStreak(['2026-07-31'], '2026-08-07') === 0)
check('a single attendance is a streak of 1',
  F.computeStreak(['2026-08-07'], '2026-08-07') === 1)

let s = F.newSession('2026-08-07')
s = F.addAttendance(s, { name: 'Ade', crewCode: 'AC234' }, FRI_EVE).session
check('checking in raises the count', s.count === 1)
check('crew attendance is tallied', s.crews.AC234 === 1)

const dup = F.addAttendance(s, { name: 'ade' }, FRI_EVE)
check('checking in twice under the same name is a no-op',
  dup.already === true && dup.session.count === 1)

s = F.addAttendance(s, { name: 'Bola', crewCode: 'AC234' }, FRI_EVE).session
check('a second person raises the count', s.count === 2)
check('crew tally accumulates', s.crews.AC234 === 2)

const pubSession = F.publicSession(s, FRI_EVE)
check('public projection hides check-in timestamps',
  pubSession.recent.every(r => r.at === undefined))
check('public projection reports top crews', pubSession.topCrews[0].code === 'AC234')
check('public projection reports live during the window', pubSession.live === true)

// ── Handler ───────────────────────────────────────────────────────────
const dir = await mkdtemp(join(tmpdir(), 'sf26-fnp-'))
await mkdir(join(dir, 'lib'), { recursive: true })
await mkdir(join(dir, 'node_modules', '@netlify', 'blobs'), { recursive: true })

await writeFile(join(dir, 'node_modules', '@netlify', 'blobs', 'index.js'), `
export const _data = new Map()
export function getStore() {
  return {
    async get(k) { return _data.has(k) ? JSON.parse(_data.get(k)) : null },
    async setJSON(k, v) { _data.set(k, JSON.stringify(v)) },
    async list() { return { blobs: [..._data.keys()].map(k => ({ key: k })) } },
  }
}
`)
await writeFile(join(dir, 'node_modules', '@netlify', 'blobs', 'package.json'),
  JSON.stringify({ name: '@netlify/blobs', version: '0.0.0', type: 'module', main: 'index.js' }))
await writeFile(join(dir, 'package.json'), JSON.stringify({ type: 'module' }))

for (const f of ['cors.js', 'text.js', 'crew-domain.js', 'fnp-domain.js']) {
  await copyFile(join(FN, 'lib', f), join(dir, 'lib', f))
}
await writeFile(join(dir, 'lib', 'ratelimit.js'), 'export async function rateLimit() { return null }\n')
await copyFile(join(FN, 'fnp.js'), join(dir, 'fnp.js'))

const { runHandler } = await import(pathToFileURL(join(dir, 'fnp.js')).href)

// Clock injected, so both the Friday and non-Friday paths are exercised on
// every run rather than one of them only on Fridays.
const post = (b, now) => runHandler({ httpMethod: 'POST', body: JSON.stringify(b), headers: {} }, now)
const get  = now => runHandler({ httpMethod: 'GET', headers: {} }, now)
const json = r => JSON.parse(r.body)

console.log('\nhandler (Friday):')
const res = await post({ action: 'checkin', name: 'Ade', crewCode: 'AC234' }, FRI_EVE)
check('check-in succeeds on a Friday', res.statusCode === 200)
check('check-in returns a streak of 1 for a first attendance', json(res).streak === 1)
check('the session id is recorded in attended',
  json(res).attended.includes('2026-08-07'))
check('the crew is tallied', json(res).session.topCrews[0].code === 'AC234')

const again = await post({ action: 'checkin', name: 'ade' }, FRI_EVE)
check('checking in twice reports already without inflating the count',
  json(again).already === true && json(again).session.count === 1)

check('a prior Friday extends the streak',
  json(await post({ action: 'checkin', name: 'Chi', attended: ['2026-07-31'] }, FRI_EVE)).streak === 2)
check('a gap in attendance resets the streak',
  json(await post({ action: 'checkin', name: 'Dele', attended: ['2026-07-17'] }, FRI_EVE)).streak === 1)
check('a bogus attended list is ignored rather than trusted',
  json(await post({ action: 'checkin', name: 'Efe', attended: ['not-a-date', 99] }, FRI_EVE)).streak === 1)

check('a short name is rejected',
  (await post({ action: 'checkin', name: 'A' }, FRI_EVE)).statusCode === 400)
check('an unknown crew code is dropped rather than stored',
  json(await post({ action: 'checkin', name: 'Femi', crewCode: 'bad!!' }, FRI_EVE))
    .session.topCrews.every(c => c.code !== 'bad!!'))

console.log('\nhandler (not Friday):')
const sat = await post({ action: 'checkin', name: 'Ade' }, SAT)
check('check-in outside Friday is refused with 409', sat.statusCode === 409)
check('the refusal explains when to come back', /Friday/i.test(json(sat).error))

console.log('\nhandler (shared):')
check('unknown action is 400', (await post({ action: 'shout' }, FRI_EVE)).statusCode === 400)
check('malformed JSON is 400',
  (await runHandler({ httpMethod: 'POST', body: '{oops', headers: {} }, FRI_EVE)).statusCode === 400)

const friRead = await get(FRI_EVE)
check('GET on a Friday reports the session live', json(friRead).session.live === true)
check('GET never leaks check-in timestamps',
  (json(friRead).session.recent || []).every(r => r.at === undefined))

const satRead = await get(SAT)
check('GET off-Friday returns 200', satRead.statusCode === 200)
check('GET off-Friday reports not live', json(satRead).session.live === false)
check('GET off-Friday points at the next Friday',
  json(satRead).session.nextSessionAt.startsWith('2026-08-14'))

await rm(dir, { recursive: true, force: true })

console.log(`\nfnp: ${pass} passed, ${fail} failed`)
process.exit(fail ? 1 : 0)
