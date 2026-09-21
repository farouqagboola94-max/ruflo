import Link from 'next/link'

export default function AdminPage() {
  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
      <p className="text-brand-orange text-sm font-semibold uppercase tracking-wider mb-3">Internal tools</p>
      <h1 className="font-display text-5xl text-white mb-5">DASHBOARD NOT CONNECTED</h1>
      <p className="text-gray-300 text-lg mb-8">
        The previous dashboard read sample records from this browser. It did not show verified ticket sales, payments, vendor bookings, or check-ins. Live reporting will be connected to the approved event systems before use.
      </p>
      <Link href="/contact" className="text-brand-orange text-sm hover:underline">Back to event information →</Link>
    </div>
  )
}
