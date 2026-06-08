'use client'

import { useState } from 'react'
import Link from 'next/link'

const WEEKS = [
  { num: 1,  dates: 'Oct 9–10',   title: 'Kickoff',          desc: 'Squads register. Opening matches across Lagos. The tournament is alive.' },
  { num: 2,  dates: 'Oct 16–17',  title: 'Group Stage I',    desc: 'First round group matches. Every squad fights for points.' },
  { num: 3,  dates: 'Oct 23–24',  title: 'Group Stage II',   desc: 'Second round. The table starts to shape. Early exits and surprise runs.' },
  { num: 4,  dates: 'Oct 30–31',  title: 'Group Stage III',  desc: 'Final group round. Top two from each group advance.' },
  { num: 5,  dates: 'Nov 6–7',    title: 'Round of 16',      desc: 'Knockout begins. One loss and you are watching from the sideline.' },
  { num: 6,  dates: 'Nov 13–14',  title: 'Quarter-Finals',   desc: 'Eight teams remain. Eight pairs on the line. Tension is real.' },
  { num: 7,  dates: 'Nov 20–21',  title: 'Semi-Finals',      desc: 'Four teams fight for two finals spots. The city is paying attention.' },
  { num: 8,  dates: 'Nov 27–28',  title: 'Finals Week Prep', desc: 'Third place and Finals confirmed. Media day. Lagos on notice.' },
  { num: 9,  dates: 'Dec 4',      title: 'Final FNP Week',   desc: 'Last community activation before finals. The last Friday Night Protocol of the campaign.' },
  { num: 10, dates: 'Dec 11',     title: 'FINALS DAY',       desc: 'Mobolaji Johnson Arena, Onikan. 3rd place match and Grand Final. Lagos decides.' },
]

const RULES = [
  { icon: '⚽', title: '5-a-side format', body: 'Five players per squad, rolling subs with no limit. No goalkeeper required.' },
  { icon: '🗺️', title: 'Lagos neighborhoods', body: 'Squads represent their area. VI, Surulere, Ikeja, Lekki, Yaba, Onikan — all territories.' },
  { icon: '🏙️', title: 'Street rules apply', body: 'Played on concrete or astroturf. Goals from anywhere. Gutter rules are gutter rules.' },
  { icon: '👟', title: 'Sneaker dress code', body: 'At least two squad members must wear notable kicks. The culture has to show up.' },
  { icon: '🏆', title: 'Style points', body: 'Judges award bonus points for best dressed squad at each match day. Flex counts.' },
  { icon: '📸', title: 'Social media counts', body: 'Best match-day content from squads earns community votes and adds to the leaderboard.' },
]

const PRIZES = [
  {
    place: '1st Place',
    value: 'Custom Trophy + ₦200,000 + 2× VVIP Festival Tickets + Limited Edition Sneakers',
    colorClass: 'text-brand-amber border-brand-amber/30 bg-brand-amber/10',
  },
  {
    place: '2nd Place',
    value: 'Runner-up Trophy + ₦100,000 + 2× VIP Festival Tickets',
    colorClass: 'text-gray-300 border-white/20 bg-white/5',
  },
  {
    place: '3rd Place',
    value: 'Trophy + ₦50,000 + 2× GA Festival Tickets',
    colorClass: 'text-brand-orange border-brand-orange/30 bg-brand-orange/10',
  },
  {
    place: 'Best Dressed Squad',
    value: 'Squad spotlight feature + exclusive Sneakers Fest merch pack',
    colorClass: 'text-brand-neon border-brand-neon/30 bg-brand-neon/10',
  },
]

export default function TournamentPage() {
  const [expanded, setExpanded] = useState<number | null>(null)

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">

      {/* Header */}
      <div className="text-center mb-14">
        <p className="text-brand-neon text-sm font-semibold uppercase tracking-wider mb-2">Oct 9 &ndash; Dec 11, 2026</p>
        <h1 className="font-display text-5xl sm:text-6xl text-white mb-4">
          STREET FOOTBALL<br />CUP
        </h1>
        <p className="text-gray-400 text-lg max-w-xl mx-auto leading-relaxed">
          10 weeks. Lagos neighborhoods. 5-a-side. One final at Mobolaji Johnson Arena.
          The tournament that leads to the festival.
        </p>
        <div className="flex flex-wrap gap-3 justify-center mt-8">
          <Link
            href="/tickets"
            className="px-6 py-3 rounded-full bg-gradient-to-r from-brand-orange to-brand-amber text-black font-bold text-sm hover:opacity-90 transition-opacity"
          >
            Get Festival Tickets
          </Link>
          <Link
            href="/schedule"
            className="px-6 py-3 rounded-full border border-white/20 text-gray-300 text-sm font-semibold hover:border-white/40 hover:text-white transition-colors"
          >
            Full Event Timeline
          </Link>
        </div>
      </div>

      {/* How it works */}
      <section className="mb-14">
        <p className="text-brand-orange text-xs font-semibold uppercase tracking-wider mb-4">How It Works</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {RULES.map(({ icon, title, body }) => (
            <div key={title} className="bg-brand-gray rounded-2xl p-5 border border-white/5">
              <div className="text-2xl mb-3">{icon}</div>
              <p className="text-white font-semibold text-sm mb-1">{title}</p>
              <p className="text-gray-500 text-xs leading-relaxed">{body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Prizes */}
      <section className="mb-14">
        <p className="text-brand-orange text-xs font-semibold uppercase tracking-wider mb-4">What&apos;s at Stake</p>
        <div className="space-y-3">
          {PRIZES.map(({ place, value, colorClass }) => (
            <div
              key={place}
              className={`rounded-2xl p-4 border flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 ${colorClass}`}
            >
              <span className="font-display text-lg shrink-0">{place}</span>
              <span className="text-sm text-gray-300 leading-relaxed">{value}</span>
            </div>
          ))}
        </div>
      </section>

      {/* 10-Week Road */}
      <section className="mb-14">
        <p className="text-brand-orange text-xs font-semibold uppercase tracking-wider mb-4">The 10-Week Road</p>
        <div className="relative">
          <div className="absolute left-[7px] top-2 bottom-2 w-px bg-white/10" />
          <div className="space-y-2">
            {WEEKS.map(week => (
              <div key={week.num} className="relative pl-8">
                <div className={`absolute left-0 top-5 w-3.5 h-3.5 rounded-full border-2 transition-all ${
                  week.num === 10
                    ? 'bg-brand-amber border-brand-amber shadow-lg shadow-amber-500/40'
                    : week.num === 9
                    ? 'bg-brand-neon border-brand-neon'
                    : 'bg-brand-dark border-white/20'
                }`} />
                <button
                  onClick={() => setExpanded(expanded === week.num ? null : week.num)}
                  className="w-full text-left"
                >
                  <div className={`rounded-xl p-4 border transition-all ${
                    week.num === 10
                      ? 'bg-brand-amber/10 border-brand-amber/30 hover:border-brand-amber/50'
                      : expanded === week.num
                      ? 'bg-brand-gray border-white/10'
                      : 'bg-brand-dark/60 border-white/5 hover:border-white/10'
                  }`}>
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3 flex-wrap">
                        <span className={`font-mono text-xs ${
                          week.num === 10 ? 'text-brand-amber' : 'text-brand-orange'
                        }`}>
                          Wk {week.num}
                        </span>
                        <span className={`font-display text-base ${
                          week.num === 10 ? 'text-brand-amber' : 'text-white'
                        }`}>
                          {week.title}
                        </span>
                        {week.num === 10 && (
                          <span className="px-2 py-0.5 rounded-full bg-brand-amber text-black text-xs font-bold">
                            FINALS
                          </span>
                        )}
                      </div>
                      <span className="text-xs text-gray-600 shrink-0">{week.dates}</span>
                    </div>
                    {expanded === week.num && (
                      <p className="text-gray-400 text-sm mt-2 leading-relaxed">{week.desc}</p>
                    )}
                  </div>
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Finals callout */}
      <div className="rounded-3xl border border-brand-amber/20 bg-brand-amber/5 p-8 text-center">
        <p className="text-brand-amber text-xs font-semibold uppercase tracking-wider mb-2">Finals Venue</p>
        <h2 className="font-display text-3xl text-white mb-2">Mobolaji Johnson Arena</h2>
        <p className="text-gray-400 mb-1">Onikan, Lagos Island &middot; December 11, 2026</p>
        <p className="text-gray-500 text-sm mb-6">
          3rd place match and Grand Final. The night before the festival.
          Witness Lagos settle it on the pitch.
        </p>
        <Link
          href="/schedule"
          className="inline-flex px-6 py-3 rounded-full border border-brand-amber/30 text-brand-amber text-sm font-semibold hover:bg-brand-amber/10 transition-colors"
        >
          See Full Event Timeline &rarr;
        </Link>
      </div>

    </div>
  )
}
