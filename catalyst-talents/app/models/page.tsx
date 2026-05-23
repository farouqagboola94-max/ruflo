'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import ModelCard from '@/components/ModelCard'
import { models } from '@/data/models'

type Category = 'All' | 'Fashion' | 'Commercial' | 'Influencer' | 'Acting'

const tabs: Category[] = ['All', 'Fashion', 'Commercial', 'Influencer', 'Acting']

export default function ModelsPage() {
  const [active, setActive] = useState<Category>('All')
  const [search, setSearch] = useState('')

  const filtered = useMemo(() => {
    let result = active === 'All' ? models : models.filter((m) => m.category === active)
    if (search.trim()) {
      const q = search.toLowerCase()
      result = result.filter(
        (m) =>
          m.name.toLowerCase().includes(q) ||
          m.tagline.toLowerCase().includes(q) ||
          (m.skills ?? []).some((s) => s.toLowerCase().includes(q)),
      )
    }
    return result
  }, [active, search])

  return (
    <>
      {/* PAGE HEADER */}
      <section
        className="pt-40 pb-16 px-4"
        style={{ background: 'linear-gradient(180deg, #050505 0%, #0d0d0d 100%)' }}
      >
        <div className="max-w-7xl mx-auto">
          <p className="text-[#D4AF37] text-[10px] tracking-[0.5em] uppercase mb-4">
            Catalyst Talents Lagos
          </p>
          <h1 className="font-playfair text-5xl sm:text-7xl font-bold text-white">Our Models</h1>
          <p className="text-white/40 mt-4 max-w-lg">
            A curated roster of Lagos&apos; finest — models, influencers, and performing talent
            ready to elevate your brand.
          </p>
        </div>
      </section>

      {/* FILTER + SEARCH */}
      <section className="sticky top-20 z-40 bg-[#0d0d0d]/95 backdrop-blur-md border-b border-white/5 px-4">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-0">
          {/* Category tabs */}
          <div className="flex gap-0 overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActive(tab)}
                className={`px-5 py-5 text-[10px] tracking-widest uppercase whitespace-nowrap transition-all duration-300 border-b-2 ${
                  active === tab
                    ? 'text-[#D4AF37] border-[#D4AF37]'
                    : 'text-white/35 border-transparent hover:text-white/60'
                }`}
              >
                {tab}
                {tab !== 'All' && (
                  <span className="ml-1.5 text-white/15">
                    ({models.filter((m) => m.category === tab).length})
                  </span>
                )}
              </button>
            ))}
          </div>
          {/* Search */}
          <div className="hidden sm:block py-3">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name or skill…"
              className="bg-white/5 border border-white/10 focus:border-[#D4AF37]/40 text-white placeholder-white/20 px-4 py-2 text-xs outline-none w-56 transition-colors"
            />
          </div>
        </div>
        {/* Mobile search */}
        <div className="sm:hidden pb-3">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name or skill…"
            className="w-full bg-white/5 border border-white/10 focus:border-[#D4AF37]/40 text-white placeholder-white/20 px-4 py-2.5 text-xs outline-none transition-colors"
          />
        </div>
      </section>

      {/* MODEL GRID */}
      <section className="py-14 px-4 max-w-7xl mx-auto">
        {filtered.length === 0 ? (
          <div className="text-center py-24 text-white/30">
            <p className="font-playfair text-2xl">No results found.</p>
            <p className="text-sm mt-2">
              {search ? `No models match "${search}"` : 'Check back soon — we\'re always signing new talent.'}
            </p>
            {search && (
              <button
                onClick={() => setSearch('')}
                className="mt-6 text-[10px] tracking-widest uppercase text-[#D4AF37]/50 hover:text-[#D4AF37] border-b border-[#D4AF37]/20 hover:border-[#D4AF37] pb-0.5 transition-all"
              >
                Clear search
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {filtered.map((model) => (
              <Link key={model.id} href={`/models/${model.id}`}>
                <ModelCard model={model} />
              </Link>
            ))}
          </div>
        )}
      </section>
    </>
  )
}
