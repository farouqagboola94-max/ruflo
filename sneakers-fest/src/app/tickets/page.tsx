'use client'

import { useState } from 'react'
import { TICKET_TIERS } from '@/data/tickets'

export default function TicketsPage() {
  const [selected, setSelected] = useState<string | null>(null)
  const [form, setForm] = useState({ name: '', email: '', phone: '', quantity: '1' })
  const [submitted, setSubmitted] = useState(false)

  const selectedTier = TICKET_TIERS.find(t => t.id === selected)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="text-center mb-14">
        <p className="text-brand-orange text-sm font-semibold uppercase tracking-wider mb-2">June 14–15, 2025</p>
        <h1 className="font-display text-5xl sm:text-6xl text-white mb-4">GET YOUR TICKETS</h1>
        <p className="text-gray-400 text-lg max-w-xl mx-auto">Choose your pass level. All tickets include 2-day access. Limited quantities available.</p>
      </div>

      {/* Tier Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-14">
        {TICKET_TIERS.map(tier => (
          <div
            key={tier.id}
            onClick={() => setSelected(tier.id)}
            className={`relative rounded-3xl p-px cursor-pointer transition-all ${
              selected === tier.id
                ? `bg-gradient-to-br ${tier.color} shadow-xl shadow-orange-500/20`
                : 'bg-white/5 hover:bg-white/10'
            }`}
          >
            {tier.badge && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-10">
                <span className="px-4 py-1 rounded-full bg-gradient-to-r from-brand-orange to-brand-yellow text-black text-xs font-bold">{tier.badge}</span>
              </div>
            )}
            <div className="rounded-3xl bg-brand-gray p-6 h-full flex flex-col">
              <h3 className="text-white font-display text-2xl mb-1">{tier.name.toUpperCase()}</h3>
              <div className="flex items-baseline gap-1 mb-3">
                <span className="text-4xl font-bold text-gradient">${tier.price}</span>
                <span className="text-gray-400 text-sm">/ person</span>
              </div>
              <p className="text-gray-400 text-sm mb-6 leading-relaxed">{tier.description}</p>
              <ul className="space-y-2.5 flex-1">
                {tier.perks.map(perk => (
                  <li key={perk} className="flex items-start gap-2 text-sm">
                    <span className="text-brand-orange mt-0.5 flex-shrink-0">✓</span>
                    <span className="text-gray-300">{perk}</span>
                  </li>
                ))}
              </ul>
              <button
                className={`mt-6 w-full py-3 rounded-xl font-bold text-sm transition-all ${
                  selected === tier.id
                    ? `bg-gradient-to-r ${tier.color} text-black`
                    : 'border border-white/20 text-white hover:border-brand-orange hover:text-brand-orange'
                }`}
              >
                {selected === tier.id ? 'Selected ✓' : 'Select This Pass'}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* RSVP Form */}
      <div className="max-w-xl mx-auto">
        {!submitted ? (
          <div className="bg-brand-gray rounded-3xl p-8 border border-white/5">
            <h2 className="font-display text-2xl text-white mb-2">COMPLETE YOUR RSVP</h2>
            {selectedTier && (
              <p className="text-brand-orange text-sm mb-6">{selectedTier.name} · ${selectedTier.price} per person</p>
            )}
            {!selectedTier && (
              <p className="text-gray-500 text-sm mb-6">Select a ticket tier above, then fill in your details.</p>
            )}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm text-gray-400 mb-1.5">Full Name</label>
                <input required value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="Your full name" className="w-full px-4 py-3 bg-brand-dark border border-white/10 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-brand-orange text-sm" />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1.5">Email Address</label>
                <input required type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} placeholder="you@example.com" className="w-full px-4 py-3 bg-brand-dark border border-white/10 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-brand-orange text-sm" />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1.5">Phone Number</label>
                <input required value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} placeholder="+234 000 0000" className="w-full px-4 py-3 bg-brand-dark border border-white/10 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-brand-orange text-sm" />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1.5">Number of Tickets</label>
                <select value={form.quantity} onChange={e => setForm(f => ({ ...f, quantity: e.target.value }))} className="w-full px-4 py-3 bg-brand-dark border border-white/10 rounded-xl text-white focus:outline-none focus:border-brand-orange text-sm">
                  {[1,2,3,4,5].map(n => <option key={n} value={n}>{n}</option>)}
                </select>
              </div>
              {selectedTier && (
                <div className="bg-brand-dark rounded-xl p-4 border border-white/10">
                  <div className="flex justify-between text-sm text-gray-400 mb-1">
                    <span>{selectedTier.name} × {form.quantity}</span>
                    <span>${(selectedTier.price * parseInt(form.quantity)).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between font-bold text-white">
                    <span>Total</span>
                    <span className="text-gradient text-lg">${(selectedTier.price * parseInt(form.quantity)).toLocaleString()}</span>
                  </div>
                </div>
              )}
              <button
                type="submit"
                disabled={!selectedTier}
                className="w-full py-4 rounded-xl bg-gradient-to-r from-brand-orange to-brand-yellow text-black font-bold text-lg hover:opacity-90 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {selectedTier ? `Reserve ${form.quantity} Ticket${parseInt(form.quantity) > 1 ? 's' : ''}` : 'Select a Ticket First'}
              </button>
            </form>
          </div>
        ) : (
          <div className="bg-brand-gray rounded-3xl p-12 border border-brand-orange/20 text-center">
            <div className="text-6xl mb-6">👟</div>
            <h3 className="font-display text-3xl text-white mb-3">YOU’RE IN!</h3>
            <p className="text-gray-400 mb-2">Confirmation sent to <span className="text-white">{form.email}</span></p>
            <p className="text-gray-500 text-sm mb-8">
              {form.quantity} × {selectedTier?.name} · ${((selectedTier?.price ?? 0) * parseInt(form.quantity)).toLocaleString()} total
            </p>
            <div className="bg-brand-dark rounded-2xl p-4 mb-6 border border-white/10">
              <p className="text-gray-400 text-sm">Lagos Convention Centre</p>
              <p className="text-white font-semibold">June 14–15, 2025 · Victoria Island</p>
            </div>
            <button
              onClick={() => { setSubmitted(false); setSelected(null); setForm({ name: '', email: '', phone: '', quantity: '1' }) }}
              className="text-brand-orange text-sm hover:underline"
            >
              Register another ticket
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
