import Link from 'next/link'
import { EVENT_FACTS } from '@/data/eventFacts'

export default function WaitlistPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
      <p className="text-brand-orange text-sm font-semibold uppercase tracking-wider mb-3">Online-first · {EVENT_FACTS.date}</p>
      <h1 className="font-display text-5xl sm:text-6xl text-white mb-5">TICKET UPDATES</h1>
      <p className="text-gray-300 text-lg max-w-xl mx-auto mb-8">
        This page isn’t collecting sign-ups yet. Follow {EVENT_FACTS.instagramHandle} for ticket launch details from {EVENT_FACTS.ticketingPlatform}.
      </p>
      <a href={EVENT_FACTS.instagramUrl} target="_blank" rel="noopener noreferrer"
        className="inline-flex px-7 py-3 rounded-full bg-gradient-to-r from-brand-orange to-brand-yellow text-black font-bold">
        Follow {EVENT_FACTS.instagramHandle}
      </a>
      <p className="mt-6"><Link href="/fnp" className="text-brand-orange text-sm hover:underline">Join the online culture →</Link></p>
    </div>
  )
}
