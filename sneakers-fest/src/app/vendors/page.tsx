import { EVENT_FACTS, VENDOR_PRICE_BANDS } from '@/data/eventFacts'
import { VendorInterestForm } from '@/components/LeadCaptureForms'

export default function VendorsPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="text-center mb-12">
        <p className="text-brand-orange text-sm font-semibold uppercase tracking-wider mb-2">Vendor interest · {EVENT_FACTS.date}</p>
        <h1 className="font-display text-5xl sm:text-6xl text-white mb-4">SELL AT SNEAKERS FEST</h1>
        <p className="text-gray-300 text-lg max-w-2xl mx-auto">
          We’re planning a Lagos gathering supported by an online-first sneaker and youth-culture community. Venue and production details are still being confirmed.
        </p>
      </div>

      <section className="bg-brand-gray rounded-3xl p-7 sm:p-10 border border-white/5">
        <p className="text-brand-orange text-xs font-semibold uppercase tracking-wider mb-5">Current vendor price bands</p>
        <div className="divide-y divide-white/10">
          {VENDOR_PRICE_BANDS.map(tier => (
            <div key={tier.name} className="flex items-center justify-between gap-4 py-4">
              <h2 className="text-white font-semibold">{tier.name}</h2>
              <p className="text-brand-amber font-bold text-right">{tier.price}</p>
            </div>
          ))}
        </div>
        <p className="text-gray-500 text-sm mt-5">
          These are planning figures, not an active booking offer. Booth layouts, inclusions, application terms, and payment instructions will follow venue confirmation.
        </p>
      </section>

      <section className="mt-12">
        <div className="mb-6 text-center">
          <p className="text-brand-orange text-xs font-semibold uppercase tracking-wider mb-2">Vendor pipeline</p>
          <h2 className="font-display text-3xl sm:text-4xl text-white mb-3">REGISTER YOUR INTEREST</h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            This is an expression of interest, not a confirmed booking or payment request. The team will contact shortlisted vendors when the venue and application terms are ready.
          </p>
        </div>
        <VendorInterestForm />
      </section>
    </div>
  )
}
