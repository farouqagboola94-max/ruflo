import Link from 'next/link'
import SneakerCard from '@/components/SneakerCard'
import CountdownTimer from '@/components/CountdownTimer'
import VenueMap from '@/components/VenueMap'
import SponsorsSection from '@/components/SponsorsSection'
import { SNEAKERS } from '@/data/sneakers'
import { SCHEDULE } from '@/data/schedule'

const STATS = [
  { value: '10K+', label: 'Attendees' },
  { value: '200+', label: 'Vendors' },
  { value: '2', label: 'Days' },
  { value: '5K+', label: 'Pairs on Sale' },
]

export default function HomePage() {
  const featured = SNEAKERS.filter(s => s.featured)
  const highlights = SCHEDULE[0].events.filter(e => e.featured)

  return (
    <div>
      {/* Hero */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-brand-dark via-brand-gray to-black" />
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 25% 25%, #FF5C00 0%, transparent 50%), radial-gradient(circle at 75% 75%, #FFD600 0%, transparent 50%)' }} />
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-orange/10 border border-brand-orange/30 text-brand-orange text-sm font-medium mb-8">
            <span className="w-2 h-2 rounded-full bg-brand-orange animate-pulse-slow" />
            June 14–15, 2026 · Lagos Convention Centre
          </div>
          <h1 className="font-display text-6xl sm:text-8xl lg:text-9xl tracking-tight mb-6 leading-none">
            <span className="text-white">SNEAKERS</span><br />
            <span className="text-gradient">FEST</span>
          </h1>
          <p className="text-gray-300 text-xl sm:text-2xl max-w-2xl mx-auto mb-10 leading-relaxed">
            Africa’s biggest sneaker culture event. Buy, sell, trade, and celebrate the culture.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/tickets" className="px-8 py-4 rounded-full bg-gradient-to-r from-brand-orange to-brand-yellow text-black font-bold text-lg hover:opacity-90 shadow-lg shadow-orange-500/30">
              Get Your Tickets
            </Link>
            <Link href="/catalog" className="px-8 py-4 rounded-full border border-white/20 text-white font-semibold text-lg hover:bg-white/5 transition-colors">
              Browse Catalog
            </Link>
          </div>
          <CountdownTimer />
        </div>
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 border-y border-white/5 bg-brand-gray">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {STATS.map(({ value, label }) => (
              <div key={label} className="text-center">
                <div className="font-display text-4xl sm:text-5xl text-gradient mb-2">{value}</div>
                <div className="text-gray-400 text-sm uppercase tracking-wider">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Sneakers */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-10">
            <div>
              <p className="text-brand-orange text-sm font-semibold uppercase tracking-wider mb-2">Catalog Highlights</p>
              <h2 className="text-white font-display text-4xl sm:text-5xl">FEATURED KICKS</h2>
            </div>
            <Link href="/catalog" className="text-brand-orange hover:text-brand-yellow text-sm font-semibold">View All →</Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featured.map(s => <SneakerCard key={s.id} sneaker={s} />)}
          </div>
        </div>
      </section>

      {/* Event Highlights */}
      <section className="py-20 bg-brand-gray">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-10">
            <div>
              <p className="text-brand-orange text-sm font-semibold uppercase tracking-wider mb-2">What’s Happening</p>
              <h2 className="text-white font-display text-4xl sm:text-5xl">EVENT HIGHLIGHTS</h2>
            </div>
            <Link href="/schedule" className="text-brand-orange hover:text-brand-yellow text-sm font-semibold">Full Schedule →</Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {highlights.map(event => (
              <div key={event.id} className="bg-brand-dark rounded-2xl p-6 border border-white/5 card-hover">
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-brand-orange text-sm font-mono">{event.time}</span>
                  <span className="h-px flex-1 bg-white/10" />
                  <span className="text-xs uppercase tracking-wider text-gray-500">{event.type}</span>
                </div>
                <h3 className="text-white font-bold text-lg mb-2">{event.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed mb-3">{event.description}</p>
                {event.speaker && <p className="text-brand-yellow text-xs">🎤 {event.speaker}</p>}
                <p className="text-gray-500 text-xs mt-2">📍 {event.location}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <VenueMap />

      {/* Marketplace CTA */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-brand-orange to-brand-yellow p-px">
            <div className="rounded-3xl bg-brand-dark p-12 text-center">
              <h2 className="font-display text-4xl sm:text-5xl text-white mb-4">LIST YOUR KICKS</h2>
              <p className="text-gray-300 max-w-xl mx-auto mb-8 text-lg">Join hundreds of sellers at the marketplace. List your sneakers, reach thousands of buyers, and make deals IRL.</p>
              <Link href="/marketplace" className="inline-flex px-8 py-4 rounded-full bg-gradient-to-r from-brand-orange to-brand-yellow text-black font-bold text-lg hover:opacity-90">
                Visit Marketplace
              </Link>
            </div>
          </div>
        </div>
      </section>

      <SponsorsSection />
    </div>
  )
}
