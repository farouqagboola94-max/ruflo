import CommunityCupGame from '@/components/CommunityCupGame'
import { EVENT_FACTS } from '@/data/eventFacts'

export default function TournamentPage() {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="mx-auto max-w-3xl text-center mb-12">
        <p className="text-brand-neon text-sm font-semibold uppercase tracking-wider mb-3">Community programming</p>
        <h1 className="font-display text-5xl sm:text-6xl text-white mb-5">SNEAKERS FEST COMMUNITY CUP</h1>
        <p className="text-gray-300 text-lg max-w-2xl mx-auto mb-8">
          A street-football activation is in planning. The page now supports interest collection and a playable fan mechanic while format, date, venue, and prizes are confirmed.
        </p>
        <p className="text-gray-500 text-sm mb-6">The confirmed festival date is {EVENT_FACTS.date}. The venue is to be announced.</p>
      </div>

      <CommunityCupGame />
    </div>
  )
}
