import Link from 'next/link'
import { EVENT_FACTS } from '@/data/eventFacts'

export default function VenueMap() {
  return (
    <section className="py-20 bg-brand-gray">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <p className="text-brand-orange text-sm font-semibold uppercase tracking-wider mb-2">Location update</p>
        <h2 className="font-display text-4xl sm:text-5xl text-white mb-5">LAGOS, WE&apos;LL SHARE THE SPOT SOON</h2>
        <p className="text-gray-300 text-lg">{EVENT_FACTS.date} · {EVENT_FACTS.venue}</p>
        <p className="text-gray-500 text-sm mt-3 max-w-xl mx-auto">
          The venue is still being confirmed. We&apos;ll publish the address and travel details after the booking is final.
        </p>
        <Link href="/waitlist" className="mt-6 inline-block rounded-full border border-brand-orange px-6 py-3 text-brand-orange">Get venue updates</Link>
      </div>
    </section>
  )
}
