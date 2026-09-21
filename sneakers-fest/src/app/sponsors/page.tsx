import { EVENT_FACTS, SPONSOR_PRICE_BANDS } from '@/data/eventFacts'

export default function SponsorsPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="text-center mb-12">
        <p className="text-brand-orange text-sm font-semibold uppercase tracking-wider mb-2">Partnerships · Lagos 2026</p>
        <h1 className="font-display text-5xl sm:text-6xl text-white mb-5">BUILD WITH THE CULTURE</h1>
        <p className="text-gray-300 text-lg max-w-3xl mx-auto">
          Sneakers Fest is an online-first youth-culture platform building community and media around sneakers, streetwear, creators, and Lagos. The physical gathering is one moment in a year-round conversation.
        </p>
      </div>

      <section className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {SPONSOR_PRICE_BANDS.map((tier) => (
          <article key={tier.name} className="bg-brand-gray rounded-2xl p-7 border border-white/5">
            <p className="text-brand-orange text-xs font-semibold uppercase tracking-wider mb-2">Target investment</p>
            <h2 className="font-display text-2xl text-white mb-2">{tier.name}</h2>
            <p className="text-brand-amber text-xl font-bold">{tier.price}</p>
          </article>
        ))}
      </section>

      <p className="text-gray-500 text-sm text-center max-w-2xl mx-auto mt-6">
        These are current planning bands. Activation scope, audience deliverables, rights, and final commercial terms will be agreed in a written proposal. Venue-dependent benefits aren’t being offered before venue confirmation.
      </p>

      <section className="mt-12 bg-brand-dark rounded-3xl p-8 text-center border border-white/10">
        <p className="text-white font-semibold text-lg mb-2">Want to discuss a partnership?</p>
        <p className="text-gray-400 text-sm mb-6">{EVENT_FACTS.date} · Lagos, venue to be announced</p>
        <a href={EVENT_FACTS.instagramUrl} target="_blank" rel="noopener noreferrer"
          className="inline-flex px-7 py-3 rounded-full bg-gradient-to-r from-brand-orange to-brand-yellow text-black font-bold">
          Message {EVENT_FACTS.instagramHandle}
        </a>
      </section>
    </div>
  )
}
