'use client'

import { useState } from 'react'
import Link from 'next/link'
import { TICKET_TIERS } from '@/data/tickets'

interface SavedTicket {
  id: string
  name: string
  email: string
  phone: string
  tierId: string
  tierName: string
  quantity: number
  amount: number
  ref: string
  purchasedAt: string
}

const RAFFLE_ENTRIES: Record<string, number> = {
  general: 1,
  vip: 3,
  collector: 5,
}

export default function MyTicketsPage() {
  const [email, setEmail] = useState('')
  const [searched, setSearched] = useState(false)
  const [tickets, setTickets] = useState<SavedTicket[]>([])

  function handleLookup(e: React.FormEvent) {
    e.preventDefault()
    const all: SavedTicket[] = JSON.parse(localStorage.getItem('sf_tickets') ?? '[]')
    const found = all.filter(t => t.email.toLowerCase() === email.toLowerCase())
    setTickets(found)
    setSearched(true)
  }

  function qrUrl(ticketId: string) {
    return `https://api.qrserver.com/v1/create-qr-code/?size=140x140&bgcolor=111827&color=ffffff&data=${encodeURIComponent(ticketId)}`
  }

  function tierColor(tierId: string) {
    return TICKET_TIERS.find(t => t.id === tierId)?.color ?? 'from-gray-700 to-gray-800'
  }

  function raffleCount(ticket: SavedTicket) {
    return (RAFFLE_ENTRIES[ticket.tierId] ?? 1) * ticket.quantity
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      {/* Header */}
      <div className="text-center mb-12">
        <p className="text-brand-orange text-sm font-semibold uppercase tracking-wider mb-2">December 12, 2026</p>
        <h1 className="font-display text-5xl sm:text-6xl text-white mb-4">MY TICKETS</h1>
        <p className="text-gray-400">Enter the email you used when purchasing to view your tickets.</p>
      </div>

      {/* Lookup form */}
      <div className="bg-brand-gray rounded-2xl p-6 border border-white/5 mb-10">
        <form onSubmit={handleLookup} className="flex gap-3">
          <input
            type="email"
            required
            value={email}
            onChange={e => { setEmail(e.target.value); setSearched(false) }}
            placeholder="your@email.com"
            className="flex-1 px-4 py-3 bg-brand-dark border border-white/10 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-brand-orange text-sm"
          />
          <button
            type="submit"
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-brand-orange to-brand-yellow text-black font-bold text-sm hover:opacity-90 transition-opacity whitespace-nowrap"
          >
            Find Tickets
          </button>
        </form>
      </div>

      {/* Empty state */}
      {searched && tickets.length === 0 && (
        <div className="text-center py-12">
          <p className="text-5xl mb-4">🔍</p>
          <p className="text-white font-semibold mb-2">No tickets found</p>
          <p className="text-gray-400 text-sm mb-6">
            No purchases found for <span className="text-white">{email}</span>.
          </p>
          <Link href="/tickets" className="inline-flex px-6 py-3 rounded-xl bg-gradient-to-r from-brand-orange to-brand-yellow text-black font-bold text-sm hover:opacity-90 transition-opacity">
            Get Tickets
          </Link>
        </div>
      )}

      {/* Ticket cards */}
      {tickets.length > 0 && (
        <div className="space-y-6">
          <p className="text-gray-400 text-sm">
            {tickets.length} order{tickets.length !== 1 ? 's' : ''} found for{' '}
            <span className="text-white">{email}</span>
          </p>

          {tickets.map(ticket => {
            const entries = raffleCount(ticket)
            const color = tierColor(ticket.tierId)

            return (
              <div key={ticket.id} className="rounded-2xl overflow-hidden border border-white/10">
                {/* Colored header */}
                <div className={`bg-gradient-to-r ${color} px-6 py-4 flex items-center justify-between`}>
                  <div>
                    <p className="font-display text-black text-lg leading-none">SNEAKERS FEST 2026</p>
                    <p className="text-black/60 text-xs mt-0.5">December 12 · Lagos Convention Centre</p>
                  </div>
                  <span className="text-2xl">👟</span>
                </div>

                {/* Body */}
                <div className="bg-brand-gray p-6 flex gap-5">
                  {/* QR code */}
                  <div className="flex-shrink-0">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={qrUrl(ticket.id)}
                      alt={`QR code for ${ticket.id}`}
                      width={140}
                      height={140}
                      className="rounded-xl"
                    />
                  </div>

                  {/* Details */}
                  <div className="flex-1 space-y-3 min-w-0">
                    <div>
                      <p className="text-gray-500 text-xs uppercase tracking-wider mb-0.5">Ticket Holder</p>
                      <p className="text-white font-semibold truncate">{ticket.name}</p>
                    </div>
                    <div>
                      <p className="text-gray-500 text-xs uppercase tracking-wider mb-0.5">Pass Type</p>
                      <p className="text-white">{ticket.tierName}</p>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <p className="text-gray-500 text-xs uppercase tracking-wider mb-0.5">Qty</p>
                        <p className="text-white">{ticket.quantity}</p>
                      </div>
                      <div>
                        <p className="text-gray-500 text-xs uppercase tracking-wider mb-0.5">Paid</p>
                        <p className="text-white">${ticket.amount.toLocaleString()}</p>
                      </div>
                    </div>
                    <div>
                      <p className="text-gray-500 text-xs uppercase tracking-wider mb-0.5">Raffle Entries</p>
                      <p className="text-brand-orange font-semibold">
                        {entries} {entries === 1 ? 'entry' : 'entries'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Footer */}
                <div className="bg-brand-gray border-t border-dashed border-white/10 px-6 py-3 flex items-center justify-between">
                  <div>
                    <p className="text-gray-500 text-xs uppercase tracking-wider">Ticket ID</p>
                    <p className="font-mono text-white text-sm">{ticket.id}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-gray-500 text-xs uppercase tracking-wider">Purchased</p>
                    <p className="text-gray-300 text-xs">
                      {new Date(ticket.purchasedAt).toLocaleDateString('en-US', {
                        month: 'short', day: 'numeric', year: 'numeric',
                      })}
                    </p>
                  </div>
                </div>
              </div>
            )
          })}

          <div className="text-center pt-4 flex justify-center gap-6">
            <Link href="/schedule" className="text-brand-orange text-sm hover:underline">View schedule →</Link>
            <Link href="/tickets" className="text-brand-orange text-sm hover:underline">Buy more tickets →</Link>
          </div>
        </div>
      )}
    </div>
  )
}
