import { SCHEDULE, ScheduleEvent } from '@/data/schedule'

const TYPE_STYLES: Record<string, { bg: string; text: string; icon: string }> = {
  panel:       { bg: 'bg-blue-500/20',   text: 'text-blue-400',   icon: '🎤' },
  showcase:    { bg: 'bg-purple-500/20', text: 'text-purple-400', icon: '👟' },
  raffle:      { bg: 'bg-yellow-500/20', text: 'text-yellow-400', icon: '🎟️' },
  performance: { bg: 'bg-pink-500/20',   text: 'text-pink-400',   icon: '🎵' },
  workshop:    { bg: 'bg-green-500/20',  text: 'text-green-400',  icon: '🛠️' },
  vendor:      { bg: 'bg-orange-500/20', text: 'text-orange-400', icon: '🏪' },
}

function EventRow({ event }: { event: ScheduleEvent }) {
  const style = TYPE_STYLES[event.type]
  return (
    <div className={`relative flex gap-6 pb-8 ${event.featured ? 'opacity-100' : 'opacity-80'}`}>
      <div className="flex flex-col items-center">
        <div className={`w-3 h-3 rounded-full mt-1 flex-shrink-0 ${event.featured ? 'bg-brand-orange' : 'bg-gray-600'}`} />
        <div className="w-px flex-1 bg-white/10 mt-2" />
      </div>
      <div className={`flex-1 rounded-2xl p-5 border ${
        event.featured ? 'bg-brand-gray border-brand-orange/30 shadow-lg shadow-orange-500/5' : 'bg-brand-gray/50 border-white/5'
      }`}>
        <div className="flex flex-wrap items-center gap-3 mb-3">
          <span className="text-brand-orange font-mono text-sm font-bold">{event.time}</span>
          <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${style.bg} ${style.text}`}>
            {style.icon} {event.type}
          </span>
          {event.featured && (
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-brand-orange/20 text-brand-orange">Featured</span>
          )}
        </div>
        <h3 className="text-white font-bold text-lg mb-1">{event.title}</h3>
        <p className="text-gray-400 text-sm leading-relaxed">{event.description}</p>
        <div className="flex flex-wrap gap-4 mt-3 text-sm">
          <span className="text-gray-500">📍 {event.location}</span>
          {event.speaker && <span className="text-brand-amber">🎤 {event.speaker}</span>}
        </div>
      </div>
    </div>
  )
}

export default function SchedulePage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="mb-12">
        <p className="text-brand-orange text-sm font-semibold uppercase tracking-wider mb-2">December 12–13, 2026</p>
        <h1 className="font-display text-5xl sm:text-6xl text-white mb-4">EVENT SCHEDULE</h1>
        <p className="text-gray-400 text-lg">Two days of panels, showcases, raffles, and vendor floors. Don't miss a moment.</p>
      </div>

      <div className="flex flex-wrap gap-3 mb-12">
        {Object.entries(TYPE_STYLES).map(([type, { bg, text, icon }]) => (
          <span key={type} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold ${bg} ${text}`}>
            {icon} {type}
          </span>
        ))}
      </div>

      {SCHEDULE.map(day => (
        <div key={day.day} className="mb-16">
          <div className="flex items-center gap-4 mb-8">
            <div className="bg-gradient-to-r from-brand-orange to-brand-amber p-px rounded-xl">
              <div className="bg-brand-dark px-5 py-2 rounded-xl">
                <p className="font-display text-brand-orange text-sm">{day.day}</p>
                <p className="text-white font-bold">{day.date}</p>
              </div>
            </div>
            <div className="h-px flex-1 bg-white/10" />
          </div>

          <div>
            {day.events.map(event => <EventRow key={event.id} event={event} />)}
          </div>
        </div>
      ))}
    </div>
  )
}
