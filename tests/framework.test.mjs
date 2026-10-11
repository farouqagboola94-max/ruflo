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

console.log('🎉 ALL TESTS PASSED SUCCESSFULLY! 0 ERRORS.')
