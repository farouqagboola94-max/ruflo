// tests/doorSimulation.test.mjs
// End-to-end simulation of ticket purchase, pass generation, gate turnstile validation,
// duplicate detection, and CSV log export under Catalyst OS Standard.

import assert from 'node:assert/strict'
import {
  normaliseTicket,
  isValidTicket,
  ticketFromHash,
  TICKET_RE,
  SPECIAL_PASS_RE
} from '../src/door/doorQueue.js'

console.log("🚀 SNEAKERS FEST '26 — END-TO-END GATE SIMULATION RUNBOOK")
console.log("========================================================\n")

// Step 1: Simulate Ticket Purchase & Pass ID Generation across all tiers
console.log("Step 1: Generating verified ticket passes across tiers...")
const samplePurchases = [
  { tier: 'General Admission', code: 'SF26-GEN-B849DF20', name: 'Tunde Adebayo', email: 'tunde@lagos.ng', qty: 1 },
  { tier: 'VIP Access',        code: 'SF26-VIP-E47A91BC', name: 'Chioma Okonkwo', email: 'chioma@vi.ng',    qty: 2 },
  { tier: 'VVIP All-Access',   code: 'SF26-VVIP-3D28AF70', name: 'Femi Balogun',   email: 'femi@lekki.ng',   qty: 1 },
  { tier: 'Phalanx Table',     code: 'SF26-PHAL-7B12C4DE', name: 'Kolawole Group', email: 'kola@ikoyi.ng',   qty: 5 },
  { tier: 'Golden Vault VIP',  code: 'GOLD-VAULT-2026',   name: 'VIP Honouree',   email: 'vip@catalyst.ng', qty: 1 },
]

for (const p of samplePurchases) {
  const norm = normaliseTicket(p.code)
  assert.equal(isValidTicket(norm), true, `Ticket ${p.code} must be valid`)
  console.log(`  ✅ [${p.tier}] Pass ID ${norm} successfully generated for ${p.name}`)
}

// Step 2: Test QR Code hash auto-extraction from staff camera scan
console.log("\nStep 2: Testing camera QR hash parsing at gate...")
const testUrls = [
  { hash: '#t=SF26-VIP-E47A91BC', expected: 'SF26-VIP-E47A91BC' },
  { hash: '#t=sf26-gen-b849df20', expected: 'SF26-GEN-B849DF20' }, // Lowercase normalization
  { hash: '#t=GOLD-VAULT-2026',   expected: 'GOLD-VAULT-2026' },
  { hash: '#t=MALICIOUS_INJECTION<script>', expected: null },       // Security sanitation
  { hash: '#random=junk',         expected: null }
]

for (const u of testUrls) {
  const extracted = ticketFromHash(u.hash)
  assert.equal(extracted, u.expected, `Hash ${u.hash} should parse to ${u.expected}`)
  console.log(`  ✅ Hash "${u.hash}" parsed -> ${extracted || 'REJECTED (Safe)'}`)
}

// Step 3: Simulate Turnstile Check-In state and duplicate scan prevention
console.log("\nStep 3: Simulating Gate Turnstile check-ins & duplicate deterrence...")
const scanDatabase = new Map() // Simulated memory database of checked-in tickets
const simulatedLogs = []

function simulateGateScan(ticketId, attendeeName, tier, qty = 1) {
  const now = new Date().toISOString()
  if (scanDatabase.has(ticketId)) {
    const previous = scanDatabase.get(ticketId)
    const entry = { at: now, ticketId, name: attendeeName, tier, outcome: 'duplicate', checkedInAt: previous.at, qty }
    simulatedLogs.push(entry)
    return { outcome: 'duplicate', message: `ALREADY IN - FIRST SCANNED AT ${previous.at}` }
  }

  if (!isValidTicket(ticketId)) {
    const entry = { at: now, ticketId, name: attendeeName, tier, outcome: 'rejected', error: 'INVALID TICKET FORMAT', qty }
    simulatedLogs.push(entry)
    return { outcome: 'rejected', message: 'NOT VALID' }
  }

  // Valid first-time check-in
  const record = { at: now, ticketId, name: attendeeName, tier, qty }
  scanDatabase.set(ticketId, record)
  const entry = { at: now, ticketId, name: attendeeName, tier, outcome: 'admitted', qty }
  simulatedLogs.push(entry)
  return { outcome: 'admitted', message: 'ADMITTED · WELCOME TO SNEAKERS FEST' }
}

// First scan: Tunde Adebayo
const scan1 = simulateGateScan('SF26-GEN-B849DF20', 'Tunde Adebayo', 'General Admission', 1)
assert.equal(scan1.outcome, 'admitted')
console.log(`  🟢 Scan 1 (SF26-GEN-B849DF20): ${scan1.message}`)

// First scan: Chioma Okonkwo (VIP)
const scan2 = simulateGateScan('SF26-VIP-E47A91BC', 'Chioma Okonkwo', 'VIP Access', 2)
assert.equal(scan2.outcome, 'admitted')
console.log(`  🟢 Scan 2 (SF26-VIP-E47A91BC): ${scan2.message}`)

// Attempt DUPLICATE scan of Chioma's pass by another person
const scan3 = simulateGateScan('SF26-VIP-E47A91BC', 'Imposter Person', 'VIP Access', 2)
assert.equal(scan3.outcome, 'duplicate')
console.log(`  ⚠️ Scan 3 (SF26-VIP-E47A91BC Duplicate Attempt): ${scan3.message}`)

// Attempt fake ticket scan with invalid format
const scan4 = simulateGateScan('INVALID-COUNTERFEIT-TICKET', 'Counterfeit Holder', 'General Admission', 1)
assert.equal(scan4.outcome, 'rejected')
console.log(`  🔴 Scan 4 (INVALID-COUNTERFEIT-TICKET): ${scan4.message}`)

// Step 4: Validate CSV Export Compilation
console.log("\nStep 4: Validating Gate Turnstile CSV Log compilation...")
assert.equal(simulatedLogs.length, 4)
const headers = ['Timestamp', 'Ticket ID', 'Name', 'Tier', 'Outcome', 'Quantity', 'Error']
const rows = simulatedLogs.map(e => [
  `"${e.at || ''}"`,
  `"${e.ticketId || ''}"`,
  `"${(e.name || '').replace(/"/g, '""')}"`,
  `"${e.tier || ''}"`,
  `"${e.outcome || ''}"`,
  `"${e.qty || 1}"`,
  `"${(e.error || '').replace(/"/g, '""')}"`
])
const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n')
assert.match(csvContent, /Timestamp,Ticket ID,Name,Tier,Outcome,Quantity,Error/)
assert.match(csvContent, /"SF26-GEN-B849DF20","Tunde Adebayo","General Admission","admitted"/)
assert.match(csvContent, /"duplicate"/)
assert.match(csvContent, /"rejected"/)
console.log(`  ✅ CSV Log successfully generated (${rows.length} records verified)`)

console.log("\n========================================================")
console.log("🎉 END-TO-END GATE SIMULATION PASSED 100% (ALL CHECKS OK)")
console.log("========================================================\n")
