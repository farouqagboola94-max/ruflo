import { EVENT_FACTS } from '@/data/eventFacts'

export default function TournamentPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
      <p className="text-brand-neon text-sm font-semibold uppercase tracking-wider mb-3">Community programming</p>
      <h1 className="font-display text-5xl sm:text-6xl text-white mb-5">SNEAKERS FEST COMMUNITY CUP</h1>
      <p className="text-gray-300 text-lg max-w-2xl mx-auto mb-8">
        A street-football activation is under consideration. Format, dates, venue, registration, and prizes will be announced only after they’re confirmed.
      </p>
      <p className="text-gray-500 text-sm mb-6">The confirmed festival date is {EVENT_FACTS.date}. The venue is to be announced.</p>
      <a href={EVENT_FACTS.instagramUrl} target="_blank" rel="noopener noreferrer"
        className="inline-flex px-7 py-3 rounded-full bg-gradient-to-r from-brand-orange to-brand-yellow text-black font-bold">
        Follow {EVENT_FACTS.instagramHandle}
      </a>
    </div>
  )
}
