import Link from 'next/link'
import { SPONSORS, TIER_LABELS } from '@/data/sponsors'

const TIER_ORDER = ['title', 'gold', 'silver', 'media'] as const

const TIER_STYLES: Record<string, string> = {
  title: 'text-brand-orange border-brand-orange/40 bg-brand-orange/5 text-2xl font-display',
  gold: 'text-yellow-400 border-yellow-400/30 bg-yellow-400/5 text-xl font-display',
  silver: 'text-gray-300 border-gray-300/20 bg-gray-300/5 text-lg font-semibold',
  media: 'text-gray-400 border-gray-400/20 bg-gray-400/5 text-base font-medium',
}

const hasSponsors = SPONSORS.length > 0

export default function SponsorsSection() {
  return (
    <section className="py-20 border-t border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <p className="text-brand-orange text-sm font-semibold uppercase tracking-wider mb-2">
            {hasSponsors ? 'Presented by' : 'Partnerships'}
          </p>
          <h2 className="font-display text-4xl sm:text-5xl text-white">SPONSORS &amp; PARTNERS</h2>
          {!hasSponsors && (
            <p className="text-gray-500 text-base mt-4 max-w-xl mx-auto">
              Sneakers Fest 2026 is open for brand partnerships. Be part of West Africa&apos;s first dedicated sneaker festival.
            </p>
          )}
        </div>
        {hasSponsors && TIER_ORDER.map(tier => {
          const items = SPONSORS.filter(s => s.tier === tier)
          if (!items.length) return null
          return (
            <div key={tier} className="mb-10">
              <p className="text-gray-500 text-xs uppercase tracking-widest text-center mb-5">{TIER_LABELS[tier]}</p>
              <div className="flex flex-wrap justify-center gap-4">
                {items.map(s => (
                  <div key={s.name} className={`px-6 py-3 rounded-xl border card-hover tracking-wide ${TIER_STYLES[tier]}`}>
                    {s.name}
                  </div>
                ))}
              </div>
            </div>
          )
        })}
        <div className="mt-12 text-center">
          <p className="text-gray-500 text-sm mb-4">Want your brand at Lagos&apos; first sneaker festival?</p>
          <Link
            href="/sponsors"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-brand-orange/30 text-brand-orange text-sm font-semibold hover:bg-brand-orange/10 transition-colors"
          >
            Become a Partner &rarr;
          </Link>
        </div>
      </div>
    </section>
  )
}
