import Link from 'next/link'
import { EVENT_FACTS } from '@/data/eventFacts'

export default function MyTicketsPage() {
  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
      <p className="text-brand-orange text-sm font-semibold uppercase tracking-wider mb-3">{EVENT_FACTS.date}</p>
      <h1 className="font-display text-5xl sm:text-6xl text-white mb-5">TICKET LOOKUP</h1>
      <p className="text-gray-300 text-lg mb-8">
        Ticket sales and lookup aren’t active on this site. Use the official Tix Africa listing and its ticket tools when sales open.
      </p>
      <a href={EVENT_FACTS.instagramUrl} target="_blank" rel="noopener noreferrer"
        className="inline-flex px-7 py-3 rounded-full bg-gradient-to-r from-brand-orange to-brand-yellow text-black font-bold">
        Follow {EVENT_FACTS.instagramHandle}
      </a>
      <p className="mt-6"><Link href="/tickets" className="text-brand-orange text-sm hover:underline">See planned ticket price bands →</Link></p>
    </div>
  )
}
