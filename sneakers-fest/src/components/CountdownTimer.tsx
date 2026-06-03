'use client'

import { useState, useEffect } from 'react'

// WAT = UTC+1; event runs Dec 12 09:00 – Dec 13 23:59:59
const EVENT_START = new Date('2026-12-12T09:00:00+01:00')
const EVENT_END   = new Date('2026-12-14T00:00:00+01:00')

type TimeLeft = { days: number; hours: number; minutes: number; seconds: number }

function getTimeLeft(): TimeLeft | null {
  const diff = EVENT_START.getTime() - Date.now()
  if (diff <= 0) return null
  return {
    days:    Math.floor(diff / 86400000),
    hours:   Math.floor((diff % 86400000) / 3600000),
    minutes: Math.floor((diff % 3600000) / 60000),
    seconds: Math.floor((diff % 60000) / 1000),
  }
}

export default function CountdownTimer() {
  const [time, setTime]       = useState<TimeLeft | null>(null)
  const [phase, setPhase]     = useState<'pre' | 'live' | 'over'>('pre')
  const [mounted, setMounted] = useState(false)
  const [copied, setCopied]   = useState(false)

  useEffect(() => {
    setMounted(true)
    const tick = () => {
      const now  = Date.now()
      if (now >= EVENT_END.getTime())   { setPhase('over');  setTime(null); return }
      if (now >= EVENT_START.getTime()) { setPhase('live');  setTime(null); return }
      setPhase('pre')
      setTime(getTimeLeft())
    }
    tick()
    const t = setInterval(tick, 1000)
    return () => clearInterval(t)
  }, [])

  const share = async () => {
    const url  = typeof window !== 'undefined' ? window.location.origin : ''
    const text = `Lagos' first sneaker festival is happening Dec 12–13, 2026! Get your tickets:`
    try {
      if (navigator.share) {
        await navigator.share({ title: 'Sneakers Fest 2026 — Lagos', text, url })
      } else {
        await navigator.clipboard.writeText(`${text} ${url}`)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
      }
    } catch {}
  }

  if (!mounted) return null

  // ── Event is live ─────────────────────────────────────────────────────────
  if (phase === 'live') return (
    <div className="mt-10 text-center">
      <div className="inline-flex items-center gap-3 px-6 py-3.5 rounded-2xl bg-brand-orange/10 border border-brand-orange/40 shadow-lg shadow-orange-500/20">
        <span className="w-2.5 h-2.5 rounded-full bg-brand-orange animate-pulse" />
        <span className="font-display text-xl sm:text-2xl text-gradient tracking-wide">EVENT IS LIVE</span>
        <span className="w-2.5 h-2.5 rounded-full bg-brand-orange animate-pulse" />
      </div>
      <p className="text-gray-400 text-sm mt-3">Dec 12–13 · Lagos, Nigeria · It&apos;s happening right now!</p>
      <button onClick={share}
        className="mt-5 inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-white/15 text-gray-400 text-sm hover:text-white hover:border-white/30 transition-all">
        {copied ? (
          <>✓ Link copied!</>
        ) : (
          <>
            <ShareIcon /> Share this event
          </>
        )}
      </button>
    </div>
  )

  // ── Event over ────────────────────────────────────────────────────────────
  if (phase === 'over') return (
    <div className="mt-10 text-center">
      <div className="inline-flex items-center gap-3 px-6 py-3 rounded-2xl bg-white/5 border border-white/10">
        <span className="text-xl">👟</span>
        <span className="text-gray-300 font-semibold">See you at the next one.</span>
      </div>
    </div>
  )

  // ── Counting down ──────────────────────────────────────────────────────────
  const units = time ? [
    { value: time.days,    label: 'Days' },
    { value: time.hours,   label: 'Hours' },
    { value: time.minutes, label: 'Mins' },
    { value: time.seconds, label: 'Secs' },
  ] : []

  return (
    <>
      {/* Scoped animation — namespaced to avoid conflicts */}
      <style>{`
        @keyframes sf-digit-in {
          from { transform: translateY(5px); opacity: 0.3; }
          to   { transform: translateY(0);   opacity: 1;   }
        }
        .sf-digit { animation: sf-digit-in 0.18s ease-out both; }
      `}</style>

      <div className="mt-10">
        <p className="text-gray-500 text-xs uppercase tracking-widest mb-5 text-center">Event starts in</p>

        <div className="flex justify-center items-end gap-1.5 sm:gap-3">
          {units.map(({ value, label }, i) => (
            <div key={label} className="flex items-end gap-1.5 sm:gap-3">
              <div className="text-center">
                <div className="relative bg-brand-gray border border-white/10 rounded-2xl w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center overflow-hidden hover:border-brand-orange/30 transition-colors duration-300">
                  {label === 'Secs' && (
                    <div className="absolute inset-0 bg-gradient-to-b from-brand-orange/5 to-transparent" />
                  )}
                  <span
                    key={`${label}-${value}`}
                    className="sf-digit font-display text-2xl sm:text-3xl text-gradient tabular-nums relative z-10"
                  >
                    {String(value).padStart(2, '0')}
                  </span>
                </div>
                <p className="text-gray-500 text-xs uppercase tracking-wider mt-2">{label}</p>
              </div>
              {i < 3 && (
                <span className="text-brand-orange/50 font-display text-2xl pb-5 select-none">:</span>
              )}
            </div>
          ))}
        </div>

        {/* Share */}
        <div className="mt-8 flex justify-center">
          <button
            onClick={share}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-white/15 text-gray-400 text-sm hover:text-white hover:border-brand-orange/40 transition-all duration-200">
            {copied ? (
              <><span className="text-brand-neon">✓</span> Link copied!</>
            ) : (
              <><ShareIcon /> Share this event</>
            )}
          </button>
        </div>
      </div>
    </>
  )
}

function ShareIcon() {
  return (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
        d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
    </svg>
  )
}
