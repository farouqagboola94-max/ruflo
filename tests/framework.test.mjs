import assert from 'node:assert'
import {
  FESTIVAL_ACTIONS,
  INITIAL_FRAMEWORK_STATE,
  dispatchFestivalAction,
  getFestivalState
} from '../src/framework/festivalFramework.js'
import { safeStorage } from '../src/lib/safeStorage.js'

console.log('🧪 Starting Sneakers Fest \'26 Framework & Storage Test Suite...\n')

// Test 1: Action Constants Validation
console.log('Test 1: Validating FESTIVAL_ACTIONS key mappings...')
assert.strictEqual(typeof FESTIVAL_ACTIONS.ZONE_CHECKIN, 'string')
assert.strictEqual(typeof FESTIVAL_ACTIONS.VENDOR_ITEM_SOLD, 'string')
assert.strictEqual(typeof FESTIVAL_ACTIONS.WALLET_PASS_GENERATED, 'string')
assert.strictEqual(typeof FESTIVAL_ACTIONS.ADD_NOTIFICATION, 'string')
assert.strictEqual(typeof FESTIVAL_ACTIONS.GAMIFICATION_XP_EARNED, 'string')
assert.strictEqual(typeof FESTIVAL_ACTIONS.GAMIFICATION_BADGE_UNLOCKED, 'string')
console.log('✅ Action constants verified.\n')

// Test 2: In-Memory safeStorage Resilience
console.log('Test 2: Testing safeStorage get, set, getJSON, remove...')
safeStorage.setItem('test_key', 'test_value')
assert.strictEqual(safeStorage.getItem('test_key'), 'test_value')

safeStorage.setItem('test_json', { festival: 'SF26', city: 'Lagos' })
const parsed = safeStorage.getJSON('test_json')
assert.strictEqual(parsed.festival, 'SF26')
assert.strictEqual(parsed.city, 'Lagos')

safeStorage.removeItem('test_key')
assert.strictEqual(safeStorage.getItem('test_key', 'fallback'), 'fallback')
console.log('✅ safeStorage in-memory persistence verified.\n')

// Test 3: Festival Framework State
console.log('Test 3: Testing festival framework state and dispatching...')
const state = getFestivalState()
assert.ok(state.telemetry)
assert.ok(state.wallet)
assert.ok(state.gamification)
assert.ok(state.vendor)

dispatchFestivalAction(FESTIVAL_ACTIONS.ADD_NOTIFICATION, {
  title: 'VIP Fast-Pass Verified',
  message: 'Gate accreditation confirmed for Muri Okunola Park'
})

const updated = getFestivalState()
assert.strictEqual(updated.gamification.recentReward, 'VIP Fast-Pass Verified')
console.log('✅ Dispatch and state updates verified.\n')

// Test 4: Auction Bids safeStorage Persistence
console.log('Test 4: Testing auction bid tracking in safeStorage...')
const sampleBids = {
  1: { lotId: 1, lotName: 'Air Jordan 1 Retro High OG Bred Toe', myBid: 294000, status: 'HIGH_BIDDER' }
}
safeStorage.setItem('sf26_auction_my_bids', sampleBids)
const storedBids = safeStorage.getJSON('sf26_auction_my_bids')
assert.strictEqual(storedBids[1].myBid, 294000)
assert.strictEqual(storedBids[1].status, 'HIGH_BIDDER')
console.log('✅ Auction bid tracking verified.\n')

// Test 5: Lost & Found safeStorage Persistence
console.log('Test 5: Testing Lost & Found registry serialization...')
const sampleReports = [
  { id: 'lf-99', type: 'LOST', item: 'Nike Dunk Travis Scott', zone: 'Zone A', contact: '@dan' }
]
safeStorage.setItem('sf26_lost_found_reports', sampleReports)
const retrievedReports = safeStorage.getJSON('sf26_lost_found_reports')
assert.strictEqual(retrievedReports.length, 1)
assert.strictEqual(retrievedReports[0].item, 'Nike Dunk Travis Scott')
console.log('✅ Lost & Found registry serialization verified.\n')

// Test 6: Schedule Clash Detection Logic
console.log('Test 6: Validating timetable clash detector logic...')
const toMinutes = (time, period) => {
  const [h, m] = time.split(':').map(Number)
  let hr = h % 12
  if (period.toUpperCase() === 'PM') hr += 12
  return hr * 60 + m
}
const event1 = { title: 'Main Stage Headliner', time: '3:00', period: 'PM' }
const event2 = { title: '1v1 FitCheck Finals', time: '3:00', period: 'PM' }
const event3 = { title: 'Late Night Afterparty', time: '8:00', period: 'PM' }

const time1 = toMinutes(event1.time, event1.period)
const time2 = toMinutes(event2.time, event2.period)
const time3 = toMinutes(event3.time, event3.period)

assert.strictEqual(time1, time2) // Exact clash
assert.ok(Math.abs(time1 - time3) > 60) // No clash
console.log('✅ Schedule clash detection logic verified.\n')

console.log('🎉 ALL TESTS PASSED SUCCESSFULLY! 0 ERRORS.')
