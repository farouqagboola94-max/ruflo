import Link from 'next/link'
import { EVENT_FACTS } from '@/data/eventFacts'

export default function VendorDashboardPage() {
  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
      <p className="text-brand-orange text-sm font-semibold uppercase tracking-wider mb-3">Vendor information</p>
      <h1 className="font-display text-5xl text-white mb-5">VENDOR NEXT STEPS</h1>
      <p className="text-gray-300 text-lg mb-6">
        Submit vendor interest using our connected application form. The team will review it and contact you with terms and setup details. A submission does not confirm a booking; keep your written confirmation for event access.
      </p>
      <p className="text-gray-500 text-sm mb-8">{EVENT_FACTS.date} · Lagos · venue to be announced</p>
      <a href="/vendors" target="_blank" rel="noopener noreferrer"
        className="inline-flex px-7 py-3 rounded-full bg-gradient-to-r from-brand-orange to-brand-yellow text-black font-bold">
        Open vendor application
      </a>
      <p className="mt-6"><Link href="/vendors" className="text-brand-orange text-sm hover:underline">See planned vendor tiers →</Link></p>
    </div>
  )
}
