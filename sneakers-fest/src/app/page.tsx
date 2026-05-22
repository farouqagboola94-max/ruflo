import Link from 'next/link'
import SneakerCard from '@/components/SneakerCard'
import CountdownTimer from '@/components/CountdownTimer'
import VenueMap from '@/components/VenueMap'
import SponsorsSection from '@/components/SponsorsSection'
import { SNEAKERS } from '@/data/sneakers'
import { SCHEDULE } from '@/data/schedule'

const STATS = [
  { value: '1K–2.5K', label: 'Year 1 Target' },
  { value: '30–50', label: 'Vendors' },
  { value: '2', label: 'Days' },
  { value: '5K+', label: 'Community Goal' },
]

const FNP_WEEKS = [
  { week: 'Week 1', title: 'Drop Discussion', desc: 'Cop or pass. Community verdict every Friday.' },
  { week: 'Week 2', title: 'The Challenge', desc: 'Best cop. Worst decision. Most creative pair.' },
  { week: 'Week 3', title: 'The Conversation', desc: 'Lagos sneaker culture. No script, no filter.' },
  { week: 'Week 4', title: 'The Game', desc: 'Trivia. Paid entry. Real prizes.' },
]

export default function HomePage() {
  const featured = SNEAKERS.filter(s => s.featured)
  const highlights = SCHEDULE[0].events.filter(e => e.featured)

  return (
    <div>
      {/* Hero */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-brand-dark via-brand-gray to-black" />
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 25% 25%, #FF6B2C 0%, transparent 50%), radial-gradient(circle at 75% 75%, #FFA500 0%, transparent 50%)' }} />
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-orange/10 border border-brand-orange/30 text-brand-orange text-sm font-medium mb-8">
            <span className="w-2 h-2 rounded-full bg-brand-orange animate-pulse-slow" />
            June 14–15, 2026 · Lagos, Nigeria
          </div>
          <h1 className="font-display text-6xl sm:text-8xl lg:text-9xl tracking-tight mb-6 leading-none">
            <span className="text-white">SNEAKERS</span><br />
            <span className="text-gradient">FEST</span>
          </h1>
          <p className="text-gray-300 text-xl sm:text-2xl max-w-2xl mx-auto mb-10 leading-relaxed">
            Lagos' first dedicated sneaker festival. The culture already exists. This is where it gets a stage.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/tickets" className="px-8 py-4 rounded-full bg-gradient-to-r from-brand-orange to-brand-amber text-black font-bold text-lg hover:opacity-90 shadow-lg shadow-orange-500/30">
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
            <Link href="/catalog" className="text-brand-orange hover:text-brand-amber text-sm font-semibold">View All →</Link>
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
              <p className="text-brand-orange text-sm font-semibold uppercase tracking-wider mb-2">What's Happening</p>
              <h2 className="text-white font-display text-4xl sm:text-5xl">EVENT HIGHLIGHTS</h2>
            </div>
            <Link href="/schedule" className="text-brand-orange hover:text-brand-amber text-sm font-semibold">Full Schedule →</Link>
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
                {event.speaker && <p className="text-brand-amber text-xs">🎤 {event.speaker}</p>}
                <p className="text-gray-500 text-xs mt-2">📍 {event.location}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <VenueMap />

      {/* Friday Night Protocol */}
      <section className="py-20 bg-brand-gray">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-brand-neon text-sm font-semibold uppercase tracking-wider mb-2">Every Friday Night</p>
              <h2 className="text-white font-display text-4xl sm:text-5xl mb-6">FRIDAY NIGHT<br />PROTOCOL</h2>
              <p className="text-gray-300 text-lg leading-relaxed mb-6">
                The festival doesn't go dark between events. Every Friday, the Sneakers Fest community activates — drop discussions, challenges, live games, culture conversations.
              </p>
              <p className="text-gray-400 text-base leading-relaxed mb-8">
                By the time June arrives, you won't be meeting strangers. You'll be in a room with people you've been building with for months.
              </p>
              <div className="grid grid-cols-2 gap-4">
                {FNP_WEEKS.map(({ week, title, desc }) => (
                  <div key={week} className="bg-brand-dark rounded-xl p-4 border border-white/5">
                    <p className="text-brand-orange text-xs font-mono mb-1">{week}</p>
                    <p className="text-white font-semibold text-sm">{title}</p>
                    <p className="text-gray-500 text-xs mt-1">{desc}</p>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <div className="bg-brand-dark rounded-3xl p-8 border border-white/10">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-3 h-3 rounded-full bg-brand-neon animate-pulse" />
                  <span className="text-brand-neon text-sm font-mono uppercase tracking-wider">Live Every Friday</span>
                </div>
                <div className="space-y-4">
                  {[
                    { label: 'Community target by Q3 2026', value: '5,000+' },
                    { label: 'Weekly game entry', value: '₦500–₦2K' },
                    { label: 'FNP session types', value: '4 rotating' },
                    { label: 'Platforms', value: 'IG · X · TikTok · WA' },
                  ].map(({ label, value }) => (
                    <div key={label} className="flex items-center justify-between border-b border-white/5 pb-3">
                      <span className="text-gray-400 text-sm">{label}</span>
                      <span className="text-white font-bold text-sm">{value}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-6 p-4 rounded-xl bg-brand-neon/10 border border-brand-neon/20">
                  <p className="text-brand-neon text-sm font-medium">The ritual is the brand.</p>
                  <p className="text-gray-400 text-xs mt-1">FNP doesn't pause. It doesn't skip weeks.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Marketplace CTA */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-brand-orange to-brand-amber p-px">
            <div className="rounded-3xl bg-brand-dark p-12 text-center">
              <h2 className="font-display text-4xl sm:text-5xl text-white mb-4">LIST YOUR KICKS</h2>
              <p className="text-gray-300 max-w-xl mx-auto mb-8 text-lg">Got pairs to move? List in the marketplace. Connect with buyers before and at the event.</p>
              <Link href="/marketplace" className="inline-flex px-8 py-4 rounded-full bg-gradient-to-r from-brand-orange to-brand-amber text-black font-bold text-lg hover:opacity-90">
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
