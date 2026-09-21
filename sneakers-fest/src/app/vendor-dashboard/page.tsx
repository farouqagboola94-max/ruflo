import Link from 'next/link'
import { EVENT_FACTS } from '@/data/eventFacts'

export default function VendorDashboardPage() {
  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
      <p className="text-brand-orange text-sm font-semibold uppercase tracking-wider mb-3">Vendor information</p>
      <h1 className="font-display text-5xl text-white mb-5">VENDOR PORTAL NOT ACTIVE</h1>
      <p className="text-gray-300 text-lg mb-6">
        Vendor applications and booking records aren’t connected to this site. Current price bands are planning figures; application terms and setup details will follow venue confirmation.
      </p>
      <p className="text-gray-500 text-sm mb-8">{EVENT_FACTS.date} · Lagos · venue to be announced</p>
      <a href={EVENT_FACTS.instagramUrl} target="_blank" rel="noopener noreferrer"
        className="inline-flex px-7 py-3 rounded-full bg-gradient-to-r from-brand-orange to-brand-yellow text-black font-bold">
        Follow {EVENT_FACTS.instagramHandle}
      </a>
      <p className="mt-6"><Link href="/vendors" className="text-brand-orange text-sm hover:underline">See planned vendor tiers →</Link></p>
    </div>
  )
}
