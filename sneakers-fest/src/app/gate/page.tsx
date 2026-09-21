import Link from 'next/link'
import { EVENT_FACTS } from '@/data/eventFacts'

export default function GatePage() {
  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
      <p className="text-brand-orange text-sm font-semibold uppercase tracking-wider mb-3">Staff operations</p>
      <h1 className="font-display text-5xl text-white mb-5">CHECK-IN NOT ACTIVE</h1>
      <p className="text-gray-300 text-lg mb-8">
        This site isn’t connected to Tix Africa ticket validation. Don’t use it to admit attendees. Official check-in instructions will be issued through the ticketing and event operations teams.
      </p>
      <p className="text-gray-500 text-sm mb-6">{EVENT_FACTS.date} · {EVENT_FACTS.venue}</p>
      <Link href="/contact" className="text-brand-orange text-sm hover:underline">Contact the event team →</Link>
    </div>
  )
}
