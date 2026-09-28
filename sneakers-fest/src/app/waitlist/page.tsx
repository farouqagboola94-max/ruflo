import Link from 'next/link'
import WaitlistForm from '@/components/WaitlistForm'
import { EVENT_FACTS } from '@/data/eventFacts'

export default function WaitlistPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
      <p className="text-brand-orange text-sm font-semibold uppercase tracking-wider mb-3">Online-first · {EVENT_FACTS.date}</p>
      <h1 className="font-display text-5xl sm:text-6xl text-white mb-5">TICKET UPDATES</h1>
      <p className="text-gray-300 text-lg max-w-xl mx-auto mb-8">
        Join the official waitlist for ticket launch details, vendor drops, Community Cup updates, and sponsor announcements from {EVENT_FACTS.ticketingPlatform} and the Sneakers Fest team.
      </p>
      <WaitlistForm source="waitlist-page" />
      <a href={EVENT_FACTS.instagramUrl} target="_blank" rel="noopener noreferrer"
        className="mt-6 inline-flex px-7 py-3 rounded-full border border-white/15 text-white font-bold hover:bg-white/5">
        Follow {EVENT_FACTS.instagramHandle}
      </a>
      <p className="mt-6"><Link href="/fnp" className="text-brand-orange text-sm hover:underline">Join the online culture →</Link></p>
    </div>
  )
}
