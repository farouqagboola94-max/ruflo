'use client'

import { useState } from 'react'
import Link from 'next/link'
import { TICKET_TIERS } from '@/data/tickets'

const STORAGE_KEY = 'sf_waitlist'

const SHOE_SIZES = ['UK 6', 'UK 7', 'UK 8', 'UK 9', 'UK 10', 'UK 11', 'UK 12', 'UK 13']

interface WaitlistEntry {
  id: string
  name: string
  email: string
  phone: string
  size: string
  tierId: string
  tierName: string
  joinedAt: string
  status: 'waiting' | 'notified'
}

function genId() {
  return 'WL-' + Math.random().toString(36).slice(2, 8).toUpperCase()
}

const inputCls =
  'w-full px-4 py-3 bg-brand-dark border border-white/10 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-brand-orange text-sm'

export default function WaitlistPage() {
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [submitted, setSubmitted] = useState(false)
  const [confirmedEntry, setConfirmedEntry] = useState<WaitlistEntry | null>(null)
  const [form, setForm] = useState({ name: '', email: '', phone: '', size: '' })
  const [showCheck, setShowCheck] = useState(false)
  const [checkEmail, setCheckEmail] = useState('')
  const [checkResults, setCheckResults] = useState<WaitlistEntry[] | 'not-found' | null>(null)

  const tier = TICKET_TIERS.find(t => t.id === selectedId)

  const field = (key: keyof typeof form) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
      setForm(f => ({ ...f, [key]: e.target.value }))

  function positionFor(entry: WaitlistEntry): number {
    const all: WaitlistEntry[] = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]')
    return all.filter(e => e.tierId === entry.tierId).findIndex(e => e.id === entry.id) + 1
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!tier) return
    const existing: WaitlistEntry[] = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]')
    const duplicate = existing.find(
      e => e.email.toLowerCase() === form.email.toLowerCase() && e.tierId === tier.id
    )
    if (duplicate) {
      setConfirmedEntry(duplicate)
      setSubmitted(true)
      return
    }
    const entry: WaitlistEntry = {
      id: genId(),
      name: form.name,
      email: form.email,
      phone: form.phone,
      size: form.size,
      tierId: tier.id,
      tierName: tier.name,
      joinedAt: new Date().toISOString(),
      status: 'waiting',
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify([...existing, entry]))
    setConfirmedEntry(entry)
    setSubmitted(true)
  }

  function handleCheck(e: React.FormEvent) {
    e.preventDefault()
    const all: WaitlistEntry[] = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]')
    const found = all.filter(entry => entry.email.toLowerCase() === checkEmail.toLowerCase())
    setCheckResults(found.length > 0 ? found : 'not-found')
  }

  function reset() {
    setSubmitted(false)
    setSelectedId(null)
    setConfirmedEntry(null)
    setForm({ name: '', email: '', phone: '', size: '' })
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      {/* Header */}
      <div className="text-center mb-14">
        <p className="text-brand-orange text-sm font-semibold uppercase tracking-wider mb-2">December 12, 2026</p>
        <h1 className="font-display text-5xl sm:text-6xl text-white mb-4">WAITLIST</h1>
        <p className="text-gray-400 text-lg max-w-xl mx-auto">
          Secure your priority spot. Be first to know about ticket releases and last-minute availability.
        </p>
        <Link href="/tickets" className="text-brand-orange text-sm hover:underline mt-3 inline-block">
          Tickets still available →
        </Link>
      </div>

      {/* Tier cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-14">
        {TICKET_TIERS.map(t => (
          <div
            key={t.id}
            onClick={() => { setSelectedId(t.id); setSubmitted(false); setConfirmedEntry(null) }}
            className={`relative rounded-3xl p-px cursor-pointer transition-all ${
              selectedId === t.id
                ? `bg-gradient-to-br ${t.color} shadow-xl shadow-orange-500/20`
                : 'bg-white/5 hover:bg-white/10'
            }`}
          >
            {t.badge && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-10">
                <span className="px-4 py-1 rounded-full bg-gradient-to-r from-brand-orange to-brand-yellow text-black text-xs font-bold">
                  {t.badge}
                </span>
              </div>
            )}
            <div className="rounded-3xl bg-brand-gray p-6 h-full flex flex-col">
              <h3 className="text-white font-display text-2xl mb-1">{t.name.toUpperCase()}</h3>
              <div className="flex items-baseline gap-1 mb-4">
                <span className="text-4xl font-bold text-gradient">${t.price}</span>
                <span className="text-gray-400 text-sm">/ person</span>
              </div>
              <ul className="space-y-2 flex-1 mb-6">
                {t.perks.slice(0, 4).map(perk => (
                  <li key={perk} className="flex items-start gap-2 text-sm">
                    <span className="text-brand-orange mt-0.5 flex-shrink-0">✓</span>
                    <span className="text-gray-300">{perk}</span>
                  </li>
                ))}
                {t.perks.length > 4 && (
                  <li className="text-gray-500 text-xs pl-4">+{t.perks.length - 4} more perks</li>
                )}
              </ul>
              <button
                className={`w-full py-3 rounded-xl font-bold text-sm transition-all ${
                  selectedId === t.id
                    ? `bg-gradient-to-r ${t.color} text-black`
                    : 'border border-white/20 text-white hover:border-brand-orange hover:text-brand-orange'
                }`}
              >
                {selectedId === t.id ? 'Selected ✓' : 'Join Waitlist for This Tier'}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Form / Success */}
      <div className="max-w-xl mx-auto">
        {!submitted ? (
          <div className="bg-brand-gray rounded-3xl p-8 border border-white/5">
            <h2 className="font-display text-2xl text-white mb-2">JOIN THE WAITLIST</h2>
            {tier ? (
              <p className="text-brand-orange text-sm mb-6">{tier.name} · ${tier.price} per person</p>
            ) : (
              <p className="text-gray-500 text-sm mb-6">Select a ticket tier above to join its priority waitlist.</p>
            )}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm text-gray-400 mb-1.5">Full Name</label>
                <input required value={form.name} onChange={field('name')} placeholder="Your full name" className={inputCls} />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1.5">Email Address</label>
                <input required type="email" value={form.email} onChange={field('email')} placeholder="you@example.com" className={inputCls} />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1.5">Phone Number</label>
                <input required value={form.phone} onChange={field('phone')} placeholder="+234 000 0000" className={inputCls} />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1.5">
                  Shoe Size <span className="text-gray-600">(optional)</span>
                </label>
                <select value={form.size} onChange={field('size')} className={inputCls + ' cursor-pointer'}>
                  <option value="">Select your size</option>
                  {SHOE_SIZES.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <button
                type="submit"
                disabled={!tier}
                className="w-full py-4 rounded-xl bg-gradient-to-r from-brand-orange to-brand-yellow text-black font-bold text-lg hover:opacity-90 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {tier ? `Join ${tier.name} Waitlist` : 'Select a Tier First'}
              </button>
            </form>
          </div>
        ) : confirmedEntry ? (
          <div className="bg-brand-gray rounded-3xl p-12 border border-brand-orange/20 text-center">
            <div className="text-6xl mb-6">📋</div>
            <h3 className="font-display text-3xl text-white mb-3">YOU'RE ON THE LIST!</h3>
            <p className="text-gray-400 mb-2">
              We'll notify <span className="text-white">{confirmedEntry.email}</span> when a spot opens.
            </p>
            <div className="bg-brand-dark rounded-2xl p-4 my-6 border border-white/10 space-y-2.5 text-left">
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Waitlist ID</span>
                <span className="text-white font-mono font-bold">{confirmedEntry.id}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Tier</span>
                <span className="text-white">{confirmedEntry.tierName}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Your Position</span>
                <span className="text-brand-orange font-bold text-lg">#{positionFor(confirmedEntry)}</span>
              </div>
            </div>
            <div className="flex gap-4 justify-center flex-wrap">
              <button onClick={reset} className="text-brand-orange text-sm hover:underline">
                Join another tier
              </button>
              <span className="text-gray-600">·</span>
              <Link href="/tickets" className="text-brand-orange text-sm hover:underline">
                Check ticket availability
              </Link>
            </div>
          </div>
        ) : null}
      </div>

      {/* Check position */}
      <div className="max-w-xl mx-auto mt-12">
        <div className="text-center">
          <button
            onClick={() => { setShowCheck(v => !v); setCheckResults(null); setCheckEmail('') }}
            className="text-gray-500 text-sm hover:text-gray-300 transition-colors"
          >
            Already on the list? Check your position {showCheck ? '↑' : '↓'}
          </button>
        </div>
        {showCheck && (
          <div className="mt-5 bg-brand-gray rounded-2xl p-6 border border-white/5">
            <form onSubmit={handleCheck} className="flex gap-3">
              <input
                type="email"
                required
                value={checkEmail}
                onChange={e => { setCheckEmail(e.target.value); setCheckResults(null) }}
                placeholder="Enter your email address"
                className="flex-1 px-4 py-3 bg-brand-dark border border-white/10 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-brand-orange text-sm"
              />
              <button
                type="submit"
                className="px-5 py-3 rounded-xl bg-brand-orange text-black font-bold text-sm hover:opacity-90 transition-opacity"
              >
                Check
              </button>
            </form>
            {checkResults && (
              <div className="mt-4">
                {checkResults === 'not-found' ? (
                  <p className="text-gray-400 text-sm">No waitlist entries found for that email.</p>
                ) : (
                  <div className="space-y-3">
                    {checkResults.map(entry => (
                      <div key={entry.id} className="bg-brand-dark rounded-xl p-4 border border-white/10 space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-400">Tier</span>
                          <span className="text-white">{entry.tierName}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-400">Position</span>
                          <span className="text-brand-orange font-bold">#{positionFor(entry)}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-400">Status</span>
                          <span className={entry.status === 'notified' ? 'text-green-400 font-medium' : 'text-yellow-400 font-medium'}>
                            {entry.status === 'notified' ? 'Notified ✓' : 'Waiting'}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
