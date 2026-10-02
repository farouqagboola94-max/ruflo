import Link from 'next/link'
import { EVENT_FACTS, TICKET_PRICE_BANDS } from '@/data/eventFacts'
import WaitlistForm from '@/components/WaitlistForm'

export default function TicketsPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="text-center mb-12">
        <p className="text-brand-orange text-sm font-semibold uppercase tracking-wider mb-2">{EVENT_FACTS.date} · Lagos</p>
        <h1 className="font-display text-5xl sm:text-6xl text-white mb-4">{EVENT_FACTS.ticketingStatus.toUpperCase()}</h1>
        <p className="text-gray-300 text-lg max-w-2xl mx-auto">
          {EVENT_FACTS.ticketingPlatform} is the selected ticketing platform. Sales are not open yet. We’ll share the official ticket link when it’s live.
        </p>
      </div>

      <section className="bg-brand-gray rounded-3xl p-7 sm:p-10 border border-white/5">
        <p className="text-brand-orange text-xs font-semibold uppercase tracking-wider mb-5">Current planning price bands</p>
        <div className="divide-y divide-white/10">
          {TICKET_PRICE_BANDS.map(tier => (
            <div key={tier.id} className="flex items-center justify-between gap-4 py-4">
              <h2 className="text-white font-semibold">{tier.name}</h2>
              <p className="text-brand-amber font-bold text-right">{tier.price}</p>
            </div>
          ))}
        </div>
        <p className="text-gray-500 text-sm mt-5">
          These are planning bands, not active offers. Final prices, pass benefits, and purchase terms will appear on the official {EVENT_FACTS.ticketingPlatform} listing.
        </p>
      </section>

      <section className="mt-10 text-center">
        <p className="text-brand-orange text-xs font-semibold uppercase tracking-wider mb-2">Launch alert</p>
        <h2 className="font-display text-3xl text-white mb-3">GET THE OFFICIAL TICKET LINK</h2>
        <p className="text-gray-400 mb-6">Join the waitlist and we’ll send the verified {EVENT_FACTS.ticketingPlatform} link when sales open.</p>
        <WaitlistForm source="tickets-page" initialInterest="Tickets" />
        <div className="mt-5">
          <Link href="/fnp" className="text-brand-orange text-sm hover:underline">Explore Friday Night Protocol →</Link>
        </div>
      </section>
    </div>
  )
}
