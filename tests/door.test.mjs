// Door List - offline queue and ticket handling.
//
// Run: node tests/door.test.mjs
//
// The rule that matters: a scan that could not reach the server is HELD, and
// is never counted as admitted. Getting that wrong lets someone through the
// gate on a dead connection.

import { pathToFileURL } from 'url'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')

// doorQueue talks to localStorage; give it one.
const store = new Map()
globalThis.localStorage = {
  getItem: k => (store.has(k) ? store.get(k) : null),
  setItem: (k, v) => store.set(k, String(v)),
  removeItem: k => store.delete(k),
  clear: () => store.clear(),
}

const Q = await import(pathToFileURL(join(root, 'src', 'door', 'doorQueue.js')).href)

let pass = 0, fail = 0
const check = (name, cond) => {
  if (cond) { pass++; console.log('  PASS  ' + name) }
  else      { fail++; console.error('  FAIL  ' + name) }
}

console.log('ticket format:')
check('a well-formed ticket is accepted', Q.isValidTicket('SF26-GEN-A1B2C3'))
check('lowercase is accepted after normalising', Q.isValidTicket('sf26-gen-a1b2c3'))
check('surrounding spaces are tolerated', Q.isValidTicket('  SF26-VIP-FFFFFF  '))
check('a wrong prefix is rejected', !Q.isValidTicket('SF25-GEN-A1B2C3'))
check('a short code is rejected', !Q.isValidTicket('SF26-GEN-A1B2'))
check('non-hex characters are rejected', !Q.isValidTicket('SF26-GEN-Z1B2C3'))
check('empty input is rejected', !Q.isValidTicket(''))
check('normalising strips junk', Q.normaliseTicket('sf26 gen a1b2c3!') === 'SF26GENA1B2C3')

console.log('\nqueue:')
store.clear()
check('the queue starts empty', Q.readQueue().length === 0)

Q.enqueue('SF26-GEN-AAAAAA', 't1')
check('a failed scan is held', Q.readQueue().length === 1)

Q.enqueue('SF26-GEN-AAAAAA', 't2')
check('tapping a dead connection twice does not queue twice', Q.readQueue().length === 1)

Q.enqueue('SF26-VIP-BBBBBB', 't3')
check('a different ticket queues separately', Q.readQueue().length === 2)

Q.dequeue('SF26-GEN-AAAAAA')
check('a synced scan leaves the queue', Q.readQueue().length === 1)
check('the right one was removed', Q.readQueue()[0].ticketId === 'SF26-VIP-BBBBBB')

console.log('\nthe counting rule:')
store.clear()
Q.logScan({ ticketId: 'SF26-GEN-111111', outcome: 'admitted', at: 't' })
Q.logScan({ ticketId: 'SF26-GEN-222222', outcome: 'duplicate', at: 't' })
Q.logScan({ ticketId: 'SF26-GEN-333333', outcome: 'rejected', at: 't' })
Q.logScan({ ticketId: 'SF26-GEN-444444', outcome: 'pending', at: 't' })

let t = Q.tallies(Q.readLog())
check('admitted counts only confirmed admissions', t.admitted === 1)
check('a held scan is NOT counted as admitted', t.admitted === 1 && t.pending === 1)
check('duplicates are counted separately', t.duplicate === 1)
check('rejections are counted separately', t.rejected === 1)

console.log('\nresolving a held scan:')
Q.resolveLogged('SF26-GEN-444444', 'admitted', { name: 'Ade' })
t = Q.tallies(Q.readLog())
check('once synced it becomes admitted', t.admitted === 2)
check('and is no longer pending', t.pending === 0)
check('detail from the server is attached',
  Q.readLog().find(e => e.ticketId === 'SF26-GEN-444444').name === 'Ade')

Q.logScan({ ticketId: 'SF26-GEN-555555', outcome: 'admitted', at: 't' })
Q.resolveLogged('SF26-GEN-555555', 'rejected')
check('resolving never rewrites an already-settled entry',
  Q.readLog().find(e => e.ticketId === 'SF26-GEN-555555').outcome === 'admitted')

console.log('\nlog bounds:')
store.clear()
for (let i = 0; i < Q.MAX_LOG + 50; i++) {
  Q.logScan({ ticketId: 'SF26-GEN-' + String(i).padStart(6, '0'), outcome: 'admitted', at: 't' })
}
check('the log is capped so a long night cannot fill storage', Q.readLog().length === Q.MAX_LOG)
check('the newest scan is first', Q.readLog()[0].ticketId.endsWith(String(Q.MAX_LOG + 49).padStart(6, '0')))

console.log('\nstorage failure:')
globalThis.localStorage = {
  getItem: () => { throw new Error('denied') },
  setItem: () => { throw new Error('denied') },
  removeItem: () => {},
}
check('a blocked localStorage does not throw on read', Array.isArray(Q.readQueue()))
check('a blocked localStorage does not throw on write', Array.isArray(Q.enqueue('SF26-GEN-AAAAAA', 't')))

console.log(`\ndoor: ${pass} passed, ${fail} failed`)
process.exit(fail ? 1 : 0)
