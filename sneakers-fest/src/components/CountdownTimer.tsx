'use client'

import { useState, useEffect } from 'react'

const EVENT_DATE = new Date('2026-06-14T09:00:00')

function getTimeLeft() {
  const diff = EVENT_DATE.getTime() - Date.now()
  if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 }
  return {
    days: Math.floor(diff / 86400000),
    hours: Math.floor((diff % 86400000) / 3600000),
    minutes: Math.floor((diff % 3600000) / 60000),
    seconds: Math.floor((diff % 60000) / 1000),
  }
}

export default function CountdownTimer() {
  const [time, setTime] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 })
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    setTime(getTimeLeft())
    const t = setInterval(() => setTime(getTimeLeft()), 1000)
    return () => clearInterval(t)
  }, [])

  if (!mounted) return null

  const units = [
    { value: time.days, label: 'Days' },
    { value: time.hours, label: 'Hours' },
    { value: time.minutes, label: 'Mins' },
    { value: time.seconds, label: 'Secs' },
  ]

  return (
    <div className="mt-10">
      <p className="text-gray-500 text-xs uppercase tracking-widest mb-4 text-center">Event starts in</p>
      <div className="flex justify-center items-end gap-2">
        {units.map(({ value, label }, i) => (
          <div key={label} className="flex items-end gap-2">
            <div className="text-center">
              <div className="bg-brand-gray border border-white/10 rounded-xl w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center">
                <span className="font-display text-2xl sm:text-3xl text-gradient">
                  {String(value).padStart(2, '0')}
                </span>
              </div>
              <p className="text-gray-500 text-xs uppercase tracking-wider mt-1.5">{label}</p>
            </div>
            {i < 3 && <span className="text-brand-orange font-display text-2xl pb-5">:</span>}
          </div>
        ))}
      </div>
    </div>
  )
}
