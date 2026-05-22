'use client'

import { useState } from 'react'

export default function Newsletter() {
  const [email, setEmail] = useState('')
  const [done, setDone] = useState(false)

  return (
    <div className="bg-gradient-to-r from-brand-orange/10 to-brand-yellow/10 border border-brand-orange/20 rounded-2xl p-8 text-center">
      <h3 className="font-display text-2xl text-white mb-2">STAY IN THE LOOP</h3>
      <p className="text-gray-400 text-sm mb-6">Get early-access drops, vendor announcements, and event updates.</p>
      {done ? (
        <p className="text-brand-orange font-semibold">🔥 You&apos;re on the list!</p>
      ) : (
        <form onSubmit={e => { e.preventDefault(); setDone(true) }} className="flex gap-3 max-w-sm mx-auto">
          <input type="email" required placeholder="your@email.com" value={email}
            onChange={e => setEmail(e.target.value)}
            className="flex-1 px-4 py-3 bg-brand-dark border border-white/10 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-brand-orange text-sm" />
          <button type="submit" className="px-5 py-3 rounded-xl bg-gradient-to-r from-brand-orange to-brand-yellow text-black font-bold text-sm hover:opacity-90 transition-opacity whitespace-nowrap">
            Subscribe
          </button>
        </form>
      )}
    </div>
  )
}
