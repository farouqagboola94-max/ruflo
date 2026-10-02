'use client'

import { useState } from 'react'
import { FAQ, FAQ_CATEGORIES } from '@/data/faq'

export default function FaqAccordion() {
  const [cat, setCat] = useState('All')
  const [open, setOpen] = useState<number | null>(null)

  const items = cat === 'All' ? FAQ : FAQ.filter(f => f.category === cat)

  return (
    <div>
      <div className="flex flex-wrap gap-2 mb-8">
        {FAQ_CATEGORIES.map(c => (
          <button key={c} onClick={() => { setCat(c); setOpen(null) }}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              cat === c ? 'bg-brand-orange text-black' : 'bg-brand-muted text-gray-300 hover:bg-brand-gray'
            }`}>{c}</button>
        ))}
      </div>
      <div className="space-y-3">
        {items.map((item, i) => (
          <div key={i} className="bg-brand-gray rounded-xl border border-white/5 overflow-hidden">
            <button onClick={() => setOpen(open === i ? null : i)}
              className="w-full flex items-center justify-between px-6 py-4 text-left">
              <span className="text-white font-medium pr-4">{item.q}</span>
              <svg className={`w-5 h-5 text-brand-orange flex-shrink-0 transition-transform ${open === i ? 'rotate-180' : ''}`}
                fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {open === i && (
              <div className="px-6 pb-5 pt-4 text-gray-400 text-sm leading-relaxed border-t border-white/5">
                {item.a}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
