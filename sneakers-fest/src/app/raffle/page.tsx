'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { RAFFLE_ITEMS, RAFFLE_ENTRIES_PER_TIER, RaffleSubmission } from '@/data/raffle'

interface StoredTicket {
  id: string
  name: string
  tierId: string
  tierName: string
  quantity: number
}

const STORAGE_KEY = 'sf_raffle_entries'

function genId() {
  return 'RF-' + Math.random().toString(36).slice(2, 8).toUpperCase()
}

type Step = 'verify' | 'allocate' | 'success'

export default function RafflePage() {
  const [step, setStep] = useState<Step>('verify')
  const [ticketInput, setTicketInput] = useState('')
  const [ticket, setTicket] = useState<StoredTicket | null>(null)
  const [ticketError, setTicketError] = useState('')
  const [allocation, setAllocation] = useState<Record<string, number>>({})
  const [submission, setSubmission] = useState<RaffleSubmission | null>(null)
  const [alreadyEntered, setAlreadyEntered] = useState(false)

  const totalEntries = ticket
    ? (RAFFLE_ENTRIES_PER_TIER[ticket.tierId] ?? 1) * ticket.quantity
    : 0

  const allocated = useMemo(
    () => Object.values(allocation).reduce((sum, v) => sum + v, 0),
    [allocation]
  )
  const remaining = totalEntries - allocated

  function handleVerify(e: React.FormEvent) {
    e.preventDefault()
    setTicketError('')
    const tickets: StoredTicket[] = JSON.parse(localStorage.getItem('sf_tickets') ?? '[]')
    const found = tickets.find(t => t.id.toUpperCase() === ticketInput.trim().toUpperCase())
    if (!found) {
      setTicketError('Ticket not found. Double-check your ID or view your tickets at /my-tickets.')
      return
    }
    const entries: RaffleSubmission[] = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]')
    const existing = entries.find(e => e.ticketId === found.id)
    if (existing) {
      setTicket(found)
      setSubmission(existing)
      setAlreadyEntered(true)
      setStep('success')
      return
    }
    setTicket(found)
    setStep('allocate')
  }

  function adjust(itemId: string, delta: number) {
    setAllocation(prev => {
      const current = prev[itemId] ?? 0
      const next = Math.max(0, current + delta)
      const otherAllocated = Object.entries(prev)
        .filter(([id]) => id !== itemId)
        .reduce((sum, [, v]) => sum + v, 0)
      const capped = Math.min(next, totalEntries - otherAllocated)
      return { ...prev, [itemId]: capped }
    })
  }

  function handleSubmit() {
    const sub: RaffleSubmission = {
      id: genId(),
      ticketId: ticket!.id,
      ticketHolder: ticket!.name ?? '',
      tierId: ticket!.tierId,
      allocation,
      totalEntries,
      submittedAt: new Date().toISOString(),
    }
    const existing: RaffleSubmission[] = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]')
    localStorage.setItem(STORAGE_KEY, JSON.stringify([...existing, sub]))
    setSubmission(sub)
    setStep('success')
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      {/* Header */}
      <div className="text-center mb-12">
        <p className="text-brand-orange text-sm font-semibold uppercase tracking-wider mb-2">
          Live Draw · December 12 · 4:00 PM Stage
        </p>
        <h1 className="font-display text-5xl sm:text-6xl text-white mb-4">RAFFLE</h1>
        <p className="text-gray-400 max-w-xl mx-auto">
          Register your entries for a chance to win limited-edition drops.
          Verify your ticket to get started.
        </p>
      </div>

      {/* Step 1 — Verify */}
      {step === 'verify' && (
        <div className="max-w-md mx-auto">
          <div className="bg-brand-gray rounded-2xl p-8 border border-white/5">
            <h2 className="font-display text-2xl text-white mb-2">VERIFY YOUR TICKET</h2>
            <p className="text-gray-400 text-sm mb-6">
              Enter your Ticket ID from your purchase confirmation.
            </p>
            <form onSubmit={handleVerify} className="space-y-4">
              <div>
                <label className="block text-sm text-gray-400 mb-1.5">Ticket ID</label>
                <input
                  required
                  value={ticketInput}
                  onChange={e => { setTicketInput(e.target.value.toUpperCase()); setTicketError('') }}
                  placeholder="TK-XXXXXX"
                  className="w-full px-4 py-3 bg-brand-dark border border-white/10 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-brand-orange text-sm font-mono tracking-widest"
                />
                {ticketError && (
                  <p className="mt-2 text-red-400 text-xs">{ticketError}</p>
                )}
              </div>
              <button
                type="submit"
                className="w-full py-4 rounded-xl bg-gradient-to-r from-brand-orange to-brand-yellow text-black font-bold text-lg hover:opacity-90 transition-opacity"
              >
                Verify Ticket
              </button>
            </form>
            <p className="mt-5 text-center text-gray-500 text-xs">
              No ticket?{' '}
              <Link href="/tickets" className="text-brand-orange hover:underline">Get one here</Link>
              {' · '}
              <Link href="/my-tickets" className="text-brand-orange hover:underline">View my tickets</Link>
            </p>
          </div>
        </div>
      )}

      {/* Step 2 — Allocate */}
      {step === 'allocate' && ticket && (
        <div>
          <div className="bg-brand-gray rounded-2xl p-5 border border-brand-orange/20 mb-8 flex items-center justify-between flex-wrap gap-4">
            <div>
              <p className="text-gray-400 text-sm">
                Verified: <span className="text-white font-semibold">{ticket.tierName}</span>
              </p>
              <p className="text-gray-500 text-xs font-mono">{ticket.id}</p>
            </div>
            <div className="text-right">
              <p className="text-3xl font-bold text-gradient">{remaining}</p>
              <p className="text-gray-400 text-xs uppercase tracking-wider">
                {remaining === 1 ? 'entry' : 'entries'} remaining
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-8">
            {RAFFLE_ITEMS.map(item => {
              const count = allocation[item.id] ?? 0
              return (
                <div
                  key={item.id}
                  className={`bg-brand-gray rounded-2xl overflow-hidden border transition-colors ${
                    count > 0 ? 'border-brand-orange/40' : 'border-white/5'
                  }`}
                >
                  <div className="aspect-square overflow-hidden bg-brand-dark">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="p-4">
                    <p className="text-gray-500 text-xs mb-0.5">{item.brand}</p>
                    <p className="text-white font-semibold text-sm leading-tight">{item.name}</p>
                    <p className="text-gray-400 text-xs mb-3">{item.colorway}</p>
                    <div className="flex items-center justify-between text-xs mb-4">
                      <span className="text-brand-orange">{item.pairs} pairs up for grabs</span>
                      <span className="text-gray-500">Retail ₦{item.retailValue.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => adjust(item.id, -1)}
                        disabled={count === 0}
                        className="w-9 h-9 rounded-lg bg-brand-dark border border-white/10 text-white font-bold flex items-center justify-center hover:border-brand-orange transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                      >
                        −
                      </button>
                      <span className={`flex-1 text-center font-bold text-xl ${
                        count > 0 ? 'text-brand-orange' : 'text-gray-600'
                      }`}>
                        {count}
                      </span>
                      <button
                        onClick={() => adjust(item.id, 1)}
                        disabled={remaining === 0}
                        className="w-9 h-9 rounded-lg bg-brand-dark border border-white/10 text-white font-bold flex items-center justify-center hover:border-brand-orange transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                      >
                        +
                      </button>
                    </div>
                    {count > 0 && (
                      <p className="text-brand-orange text-xs text-center mt-2">
                        {count} {count === 1 ? 'entry' : 'entries'} placed
                      </p>
                    )}
                  </div>
                </div>
              )
            })}
          </div>

          <div className="max-w-md mx-auto">
            <div className="bg-brand-dark rounded-xl p-4 border border-white/10 mb-4 space-y-1.5">
              <div className="flex justify-between text-sm text-gray-400">
                <span>Total entries</span><span>{totalEntries}</span>
              </div>
              <div className="flex justify-between text-sm text-gray-400">
                <span>Allocated</span><span>{allocated}</span>
              </div>
              <div className="flex justify-between text-sm font-bold text-white pt-1 border-t border-white/10">
                <span>Remaining</span>
                <span className={remaining > 0 ? 'text-brand-orange' : 'text-gray-400'}>{remaining}</span>
              </div>
            </div>
            <button
              onClick={handleSubmit}
              disabled={allocated === 0}
              className="w-full py-4 rounded-xl bg-gradient-to-r from-brand-orange to-brand-yellow text-black font-bold text-lg hover:opacity-90 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {allocated > 0
                ? `Submit ${allocated} ${allocated === 1 ? 'Entry' : 'Entries'}`
                : 'Allocate at Least 1 Entry'}
            </button>
            {remaining > 0 && allocated > 0 && (
              <p className="text-gray-500 text-xs text-center mt-2">
                {remaining} unallocated {remaining === 1 ? 'entry' : 'entries'} will not be used
              </p>
            )}
          </div>
        </div>
      )}

      {/* Step 3 — Success */}
      {step === 'success' && submission && (
        <div className="max-w-md mx-auto">
          <div className="bg-brand-gray rounded-3xl p-10 border border-brand-orange/20 text-center">
            <div className="text-6xl mb-5">🎟️</div>
            <h3 className="font-display text-3xl text-white mb-2">
              {alreadyEntered ? "ALREADY ENTERED!" : "YOU'RE IN THE DRAW!"}
            </h3>
            <p className="text-gray-400 text-sm mb-6">
              {alreadyEntered
                ? 'Entries for this ticket have already been submitted.'
                : `${submission.totalEntries} ${submission.totalEntries === 1 ? 'entry' : 'entries'} registered successfully.`}
            </p>
            <div className="bg-brand-dark rounded-xl p-4 border border-white/10 text-left mb-6 space-y-2">
              {Object.entries(submission.allocation)
                .filter(([, count]) => count > 0)
                .map(([itemId, count]) => {
                  const item = RAFFLE_ITEMS.find(i => i.id === itemId)
                  if (!item) return null
                  return (
                    <div key={itemId} className="flex justify-between text-sm">
                      <span className="text-gray-300 truncate mr-2">
                        {item.name}{' '}
                        <span className="text-gray-500">{item.colorway}</span>
                      </span>
                      <span className="text-brand-orange font-medium flex-shrink-0">
                        {count} {count === 1 ? 'entry' : 'entries'}
                      </span>
                    </div>
                  )
                })}
            </div>
            <p className="text-gray-500 text-xs mb-8">
              Draw is live on stage at 4:00 PM · December 12
              <br />Winners are contacted on the day
            </p>
            <div className="flex gap-4 justify-center flex-wrap">
              <Link href="/schedule" className="text-brand-orange text-sm hover:underline">
                View schedule →
              </Link>
              <Link href="/my-tickets" className="text-brand-orange text-sm hover:underline">
                My tickets →
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
