'use client'

import { useState } from 'react'
import Link from 'next/link'
import { SCHEDULE } from '@/data/schedule'

const PHASES = [
  {
    num: 1,
    label: 'Street Campaign',
    dates: 'Oct 9 – Dec 4',
    venue: 'Lagos Streets & Digital',
    activeClass: 'text-brand-neon border-brand-neon/30 bg-brand-neon/10',
    dotClass: 'bg-brand-neon border-brand-neon',
    desc: '10 weeks of Friday Night Protocol activations, community building, and the 5-a-side street football tournament across Lagos.',
  },
  {
    num: 2,
    label: 'Football Finals',
    dates: 'Dec 11, 2026',
    venue: 'Mobolaji Johnson Arena, Onikan',
    activeClass: 'text-blue-400 border-blue-400/30 bg-blue-400/10',
    dotClass: 'bg-blue-400 border-blue-400',
    desc: 'The 10-week street football campaign culminates. Finals at Mobolaji Johnson Arena. Lagos decides its champion.',
  },
  {
    num: 3,
    label: 'Midnight Logistics',
    dates: 'Dec 11–12 overnight',
    venue: 'Onikan → Muri Okunola Park',
    activeClass: 'text-purple-400 border-purple-400/30 bg-purple-400/10',
    dotClass: 'bg-purple-400 border-purple-400',
    desc: 'Za.allyErrands coordinates overnight setup and logistics. From Onikan to Victoria Island — the ground crew makes it happen by sunrise.',
  },
  {
    num: 4,
    label: 'Main Event',
    dates: 'Dec 12, 2026',
    venue: 'Muri Okunola Park, VI',
    activeClass: 'text-brand-orange border-brand-orange/30 bg-brand-orange/10',
    dotClass: 'bg-brand-orange border-brand-orange',
    desc: 'The festival. Vendors, vault showcase, panels, customization, raffle, and the closing set. Lagos sneaker culture — all in one place.',
  },
]

const TYPE_META: Record<string, { bg: string; text: string; border: string; icon: string; label: string }> = {
  panel:       { bg: 'bg-blue-500/15',   text: 'text-blue-400',   border: 'border-blue-500/30',   icon: '🎤', label: 'Panel' },
  showcase:    { bg: 'bg-purple-500/15', text: 'text-purple-400', border: 'border-purple-500/30', icon: '👟', label: 'Showcase' },
  raffle:      { bg: 'bg-yellow-500/15', text: 'text-yellow-400', border: 'border-yellow-500/30', icon: '🎟️', label: 'Raffle' },
  performance: { bg: 'bg-pink-500/15',   text: 'text-pink-400',   border: 'border-pink-500/30',   icon: '🎵', label: 'Live' },
  workshop:    { bg: 'bg-green-500/15',  text: 'text-green-400',  border: 'border-green-500/30',  icon: '🛠️', label: 'Workshop' },
  vendor:      { bg: 'bg-orange-500/15', text: 'text-orange-400', border: 'border-orange-500/30', icon: '🏪', label: 'Vendor' },
}

export default function SchedulePage() {
  const [activePhase, setActivePhase] = useState(4)
  const events = SCHEDULE[0].events

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="text-center mb-12">
        <p className="text-brand-orange text-sm font-semibold uppercase tracking-wider mb-2">Oct 9 – Dec 12, 2026</p>
        <h1 className="font-display text-5xl sm:text-6xl text-white mb-4">THE TIMELINE</h1>
        <p className="text-gray-400 text-lg max-w-xl mx-auto">4 phases. 10 weeks. One night that makes it all real.</p>
      </div>

      {/* Phase selector cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
        {PHASES.map(p => (
          <button
            key={p.num}
            onClick={() => setActivePhase(p.num)}
            className={`text-left rounded-2xl p-5 border transition-all ${
              activePhase === p.num
                ? p.activeClass
                : 'bg-brand-dark border-white/5 hover:border-white/15'
            }`}
          >
            <div className="flex items-center gap-3 mb-2">
              <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                activePhase === p.num ? 'bg-white/20 text-white' : 'bg-white/10 text-gray-500'
              }`}>
                {p.num}
              </span>
              <span className={`text-xs font-semibold uppercase tracking-wider ${
                activePhase === p.num ? '' : 'text-gray-600'
              }`}>{p.dates}</span>
            </div>
            <h3 className={`font-display text-xl mb-1 ${
              activePhase === p.num ? '' : 'text-gray-300'
            }`}>{p.label}</h3>
            <p className="text-xs text-gray-500">📍 {p.venue}</p>
            {activePhase === p.num && (
              <p className="text-sm text-gray-300 leading-relaxed mt-3">{p.desc}</p>
            )}
          </button>
        ))}
      </div>

      {/* Phase 1 detail */}
      {activePhase === 1 && (
        <div className="bg-brand-dark rounded-2xl border border-brand-neon/20 p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-2 h-2 rounded-full bg-brand-neon animate-pulse" />
            <span className="text-brand-neon text-sm font-mono uppercase tracking-wider">10-Week Activation</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            {[
              { week: 'Weeks 1–2', title: 'Kickoff & Drop Discussion', desc: 'Community activates. Drop verdicts, culture debate, first look at who is who.' },
              { week: 'Weeks 3–4', title: 'Street Football Heats', desc: '5-a-side tournaments begin across Lagos. Teams register. Stakes are set.' },
              { week: 'Weeks 5–6', title: 'The Challenge', desc: 'Best cop. Worst decision. Most creative pair. Community votes.' },
              { week: 'Weeks 7–8', title: 'Quarter & Semi Finals', desc: 'Football tournament narrows down. Tension builds. The conversation gets louder.' },
              { week: 'Week 9',     title: 'FNP: The Game', desc: 'Trivia. Paid entry. Real prizes. Last activation before finals week.' },
              { week: 'Week 10',   title: 'Finals Countdown', desc: 'Final community push. Last chance for raffle entry. Vendors finalized.' },
            ].map(({ week, title, desc }) => (
              <div key={week} className="bg-brand-gray rounded-xl p-4 border border-white/5">
                <p className="text-brand-neon text-xs font-mono mb-1">{week}</p>
                <p className="text-white font-semibold text-sm">{title}</p>
                <p className="text-gray-500 text-xs mt-1">{desc}</p>
              </div>
            ))}
          </div>
          <Link href="/tournament"
            className="inline-flex px-6 py-3 rounded-full bg-brand-neon/10 border border-brand-neon/30 text-brand-neon text-sm font-semibold hover:bg-brand-neon/20 transition-colors">
            View Street Football Cup &rarr;
          </Link>
        </div>
      )}

      {/* Phase 2 detail */}
      {activePhase === 2 && (
        <div className="bg-brand-dark rounded-2xl border border-blue-400/20 p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-2 h-2 rounded-full bg-blue-400" />
            <span className="text-blue-400 text-sm font-mono uppercase tracking-wider">December 11, 2026</span>
          </div>
          <div className="space-y-4 mb-6">
            {[
              { time: '12:00 PM', title: 'Venue Opens',      desc: 'Mobolaji Johnson Arena gates open. Community pours in.' },
              { time: '1:00 PM',  title: '3rd Place Match',  desc: 'The final two eliminated teams battle for bronze. Last chance for glory.' },
              { time: '3:00 PM',  title: 'Grand Final',      desc: 'Lagos street football champion decided. 10 weeks. One match.' },
              { time: '5:00 PM',  title: 'Trophy Ceremony', desc: 'Champions crowned. Community celebrates. The energy carries into the night.' },
              { time: '6:00 PM',  title: 'Pre-Event Mixer', desc: 'Early birds link up before Dec 12. Buy, trade, hype builds.' },
            ].map(({ time, title, desc }) => (
              <div key={time} className="flex gap-4 items-start">
                <span className="font-mono text-xs text-blue-400 w-20 shrink-0 pt-0.5">{time}</span>
                <div>
                  <p className="text-white font-semibold text-sm">{title}</p>
                  <p className="text-gray-500 text-xs mt-0.5">{desc}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="p-4 rounded-xl bg-blue-400/5 border border-blue-400/15">
            <p className="text-blue-400 text-xs font-semibold uppercase tracking-wider mb-1">Venue</p>
            <p className="text-white text-sm font-bold">Mobolaji Johnson Arena</p>
            <p className="text-gray-400 text-xs">Onikan, Lagos Island</p>
          </div>
        </div>
      )}

      {/* Phase 3 detail */}
      {activePhase === 3 && (
        <div className="bg-brand-dark rounded-2xl border border-purple-400/20 p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-2 h-2 rounded-full bg-purple-400 animate-pulse" />
            <span className="text-purple-400 text-sm font-mono uppercase tracking-wider">Dec 11 Midnight → Dec 12 Dawn</span>
          </div>
          <p className="text-gray-300 text-sm leading-relaxed mb-6">
            While Lagos sleeps, the crew moves. Za.allyErrands handles overnight logistics — routing vendors, deliveries, and setup equipment from Onikan to Muri Okunola Park. By sunrise, the venue is ready.
          </p>
          <div className="space-y-4 mb-6">
            {[
              { time: '11:00 PM', title: 'Logistics Brief',    desc: 'Za.allyErrands team assembles. Routes confirmed. Vendor contacts on standby.' },
              { time: '12:00 AM', title: 'Convoy Departs',     desc: 'Onikan → Victoria Island. First load of equipment and vendor stock moves.' },
              { time: '2:00 AM',  title: 'Park Setup Begins', desc: 'Muri Okunola Park receives first installations. Stage rigging, vendor tables, lighting.' },
              { time: '5:00 AM',  title: 'Vendor Check-in',   desc: 'Early vendor arrivals. Booth assignments confirmed. Stock inspection.' },
              { time: '7:00 AM',  title: 'Final Walkthrough', desc: 'Event team sweeps the venue. Everything locked before doors open at 9 AM.' },
            ].map(({ time, title, desc }) => (
              <div key={time} className="flex gap-4 items-start">
                <span className="font-mono text-xs text-purple-400 w-20 shrink-0 pt-0.5">{time}</span>
                <div>
                  <p className="text-white font-semibold text-sm">{title}</p>
                  <p className="text-gray-500 text-xs mt-0.5">{desc}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="p-4 rounded-xl bg-purple-400/5 border border-purple-400/15">
            <p className="text-purple-400 text-xs font-semibold uppercase tracking-wider mb-1">Logistics Partner</p>
            <p className="text-white text-sm font-bold">Za.allyErrands</p>
            <p className="text-gray-400 text-xs">Overnight coordination, Onikan to Victoria Island</p>
          </div>
        </div>
      )}

      {/* Phase 4 detail — main event hour-by-hour */}
      {activePhase === 4 && (
        <div className="bg-brand-dark rounded-2xl border border-brand-orange/20 p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-2 h-2 rounded-full bg-brand-orange animate-pulse" />
            <span className="text-brand-orange text-sm font-mono uppercase tracking-wider">December 12, 2026 · Muri Okunola Park</span>
          </div>
          <div className="relative">
            <div className="absolute left-[7px] top-2 bottom-2 w-px bg-white/10" />
            <div className="space-y-3">
              {events.map(event => {
                const meta = TYPE_META[event.type]
                return (
                  <div key={event.id} className="relative pl-8">
                    <div className={`absolute left-0 top-5 w-3.5 h-3.5 rounded-full border-2 ${
                      event.featured
                        ? 'bg-brand-orange border-brand-orange'
                        : 'bg-brand-dark border-white/20'
                    }`} />
                    <div className={`rounded-xl p-4 border ${
                      event.featured
                        ? 'bg-brand-gray border-white/10'
                        : 'bg-brand-dark/60 border-white/5'
                    }`}>
                      <div className="flex items-center gap-3 flex-wrap mb-1">
                        <span className="font-mono text-xs text-brand-orange">{event.time}</span>
                        <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${meta.bg} ${meta.text} border ${meta.border}`}>
                          {meta.icon} {meta.label}
                        </span>
                      </div>
                      <p className="text-white font-semibold text-sm">{event.title}</p>
                      <p className="text-gray-400 text-xs mt-0.5 leading-relaxed">{event.description}</p>
                      <div className="flex gap-3 mt-1.5 text-xs text-gray-500 flex-wrap">
                        <span>📍 {event.location}</span>
                        {event.speaker && <span>🎤 {event.speaker}</span>}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
          <div className="mt-6 text-center">
            <Link href="/tickets"
              className="inline-flex px-8 py-3 rounded-full bg-gradient-to-r from-brand-orange to-brand-amber text-black font-bold hover:opacity-90 transition-opacity">
              Get Your Ticket &rarr;
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}
