'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { SCHEDULE } from '@/data/schedule'

const TYPE_META: Record<string, { bg: string; text: string; border: string; icon: string; label: string }> = {
  panel:       { bg: 'bg-blue-500/15',   text: 'text-blue-400',   border: 'border-blue-500/30',   icon: '🎤', label: 'Panel' },
  showcase:    { bg: 'bg-purple-500/15', text: 'text-purple-400', border: 'border-purple-500/30', icon: '👟', label: 'Showcase' },
  raffle:      { bg: 'bg-yellow-500/15', text: 'text-yellow-400', border: 'border-yellow-500/30', icon: '🎟️', label: 'Raffle' },
  performance: { bg: 'bg-pink-500/15',   text: 'text-pink-400',   border: 'border-pink-500/30',   icon: '🎵', label: 'Live' },
  workshop:    { bg: 'bg-green-500/15',  text: 'text-green-400',  border: 'border-green-500/30',  icon: '🛠️', label: 'Workshop' },
  vendor:      { bg: 'bg-orange-500/15', text: 'text-orange-400', border: 'border-orange-500/30', icon: '🏪', label: 'Vendor' },
}

type FilterType = 'all' | 'panel' | 'showcase' | 'raffle' | 'performance' | 'workshop' | 'vendor'

function timeToMins(t: string) {
  const [time, period] = t.split(' ')
  let [h, m] = time.split(':').map(Number)
  if (period === 'PM' && h !== 12) h += 12
  if (period === 'AM' && h === 12) h = 0
  return h * 60 + m
}

export default function SchedulePage() {
  const [dayIndex, setDayIndex] = useState(0)
  const [filter, setFilter]     = useState<FilterType>('all')
  const [nowId, setNowId]       = useState<string | null>(null)
  const [nextId, setNextId]     = useState<string | null>(null)

  const events = SCHEDULE[dayIndex].events

  useEffect(() => {
    setFilter('all')
    setNowId(null)
    setNextId(null)
  }, [dayIndex])

  useEffect(() => {
    const compute = () => {
      const now = new Date()
      const isEventDay =
        now.getFullYear() === 2026 &&
        now.getMonth() === 11 &&
        (now.getDate() === 12 || now.getDate() === 13)
      if (!isEventDay) return
      const eventDayIndex = now.getDate() === 12 ? 0 : 1
      if (eventDayIndex !== dayIndex) return
      const nowMins = now.getHours() * 60 + now.getMinutes()
      let currentId: string | null = null
      let nextVal: string | null   = null
      for (let i = 0; i < events.length; i++) {
        const start = timeToMins(events[i].time)
        const end   = i < events.length - 1 ? timeToMins(events[i + 1].time) : start + 90
        if (nowMins >= start && nowMins < end) { currentId = events[i].id; break }
      }
      if (currentId) {
        const idx = events.findIndex(e => e.id === currentId)
        if (idx < events.length - 1) nextVal = events[idx + 1].id
      } else {
        const upcoming = events.find(e => timeToMins(e.time) > nowMins)
        if (upcoming) nextVal = upcoming.id
      }
      setNowId(currentId)
      setNextId(nextVal)
    }
    compute()
    const t = setInterval(compute, 60000)
    return () => clearInterval(t)
  }, [events, dayIndex])

  const counts = events.reduce<Record<string, number>>((acc, e) => {
    acc[e.type] = (acc[e.type] || 0) + 1
    return acc
  }, {})

  const filtered = filter === 'all' ? events : events.filter(e => e.type === filter)

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="text-center mb-10">
        <p className="text-brand-orange text-sm font-semibold uppercase tracking-wider mb-2">December 12&#8211;13, 2026</p>
        <h1 className="font-display text-5xl sm:text-6xl text-white mb-4">EVENT SCHEDULE</h1>
        <p className="text-gray-400 text-lg max-w-xl mx-auto">Lagos &middot; Two days. Everything on the table.</p>
      </div>

      {/* Day selector */}
      <div className="flex gap-3 justify-center mb-8">
        {SCHEDULE.map((schedDay, i) => (
          <button
            key={schedDay.day}
            onClick={() => setDayIndex(i)}
            className={`px-6 py-3 rounded-full font-bold text-sm transition-all ${
              dayIndex === i
                ? 'bg-brand-orange text-black shadow-lg shadow-orange-500/25'
                : 'bg-brand-gray border border-white/10 text-gray-400 hover:text-white hover:border-white/20'
            }`}
          >
            {schedDay.day}
            <span className={`ml-2 text-xs font-normal ${
              dayIndex === i ? 'text-black/60' : 'text-gray-600'
            }`}>
              {i === 0 ? 'Dec 12' : 'Dec 13'}
            </span>
          </button>
        ))}
      </div>

      {/* Filter bar */}
      <div className="flex gap-2 flex-wrap justify-center mb-10">
        <button
          onClick={() => setFilter('all')}
          className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${
            filter === 'all'
              ? 'bg-brand-orange text-black'
              : 'bg-brand-gray border border-white/10 text-gray-400 hover:text-white hover:border-white/20'
          }`}>
          All ({events.length})
        </button>
        {(Object.keys(TYPE_META) as FilterType[]).filter(t => counts[t]).map(type => {
          const meta = TYPE_META[type]
          return (
            <button key={type}
              onClick={() => setFilter(type)}
              className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                filter === type
                  ? `${meta.bg} ${meta.text} border ${meta.border}`
                  : 'bg-brand-gray border border-white/10 text-gray-400 hover:text-white hover:border-white/20'
              }`}>
              {meta.icon} {meta.label} ({counts[type]})
            </button>
          )
        })}
      </div>

      {/* Timeline */}
      {filtered.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-gray-500 mb-4">No events in this category.</p>
          <button onClick={() => setFilter('all')}
            className="px-6 py-2.5 rounded-full border border-white/20 text-gray-300 text-sm hover:border-brand-orange hover:text-brand-orange transition-colors">
            Show all events
          </button>
        </div>
      ) : (
        <div className="relative">
          <div className="absolute left-[7px] top-2 bottom-2 w-px bg-white/10" />
          <div className="space-y-1">
            {filtered.map(event => {
              const meta   = TYPE_META[event.type]
              const isNow  = event.id === nowId
              const isNext = event.id === nextId
              const isFeat = event.featured
              return (
                <div key={event.id} className="relative pl-8">
                  <div className={`absolute left-0 top-6 w-3.5 h-3.5 rounded-full border-2 transition-all ${
                    isNow
                      ? 'bg-brand-orange border-brand-orange shadow-lg shadow-orange-500/50 animate-pulse'
                      : isNext
                      ? 'bg-brand-amber border-brand-amber'
                      : 'bg-brand-dark border-white/20'
                  }`} />
                  <div className={`mb-3 rounded-2xl p-5 border transition-all ${
                    isNow
                      ? 'bg-brand-orange/10 border-brand-orange/40 shadow-lg shadow-orange-500/10'
                      : isFeat
                      ? 'bg-brand-gray border-white/10 hover:border-white/20'
                      : 'bg-brand-dark/60 border-white/5 hover:border-white/10'
                  }`}>
                    <div className="flex items-start justify-between gap-3 flex-wrap mb-2">
                      <div className="flex items-center gap-3 flex-wrap">
                        <span className="font-mono text-sm text-brand-orange">{event.time}</span>
                        {isNow && (
                          <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-brand-orange text-black text-xs font-bold">
                            <span className="w-1.5 h-1.5 rounded-full bg-black animate-pulse" />
                            NOW
                          </span>
                        )}
                        {!isNow && isNext && (
                          <span className="px-2 py-0.5 rounded-full bg-brand-amber/20 border border-brand-amber/40 text-brand-amber text-xs font-bold">
                            NEXT UP
                          </span>
                        )}
                      </div>
                      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${meta.bg} ${meta.text} border ${meta.border}`}>
                        {meta.icon} {meta.label}
                      </span>
                    </div>
                    <h3 className={`font-display text-xl mb-1 ${isNow || isFeat ? 'text-white' : 'text-gray-200'}`}>
                      {event.title}
                    </h3>
                    <p className="text-gray-400 text-sm leading-relaxed mb-3">{event.description}</p>
                    <div className="flex items-center gap-4 flex-wrap text-xs text-gray-500">
                      <span>📍 {event.location}</span>
                      {event.speaker && <span>🎤 {event.speaker}</span>}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      <div className="mt-14 text-center">
        <p className="text-gray-500 text-sm mb-4">Want to experience all of this live?</p>
        <Link href="/tickets"
          className="inline-flex px-8 py-4 rounded-full bg-gradient-to-r from-brand-orange to-brand-amber text-black font-bold text-lg hover:opacity-90 shadow-lg shadow-orange-500/20 transition-opacity">
          Get Your Ticket &rarr;
        </Link>
      </div>
    </div>
  )
}
