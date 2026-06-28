'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import ModelCard from '@/components/ModelCard'
import { models } from '@/data/models'

type Category = 'All' | 'Fashion' | 'Commercial' | 'Influencer' | 'Acting'

const tabs: Category[] = ['All', 'Fashion', 'Commercial', 'Influencer', 'Acting']

const divisionInfo: Record<string, { icon: string; desc: string }> = {
  Fashion: { icon: '✦', desc: 'Editorial, couture, and runway models who command every stage from Lagos to Milan.' },
  Commercial: { icon: '◈', desc: 'Versatile faces for brand campaigns, print, and ambassador partnerships.' },
  Influencer: { icon: '◉', desc: 'Digital-native creators reshaping culture and commerce across social platforms.' },
  Acting: { icon: '◆', desc: 'Compelling performers for film, television, presenting, and live events.' },
}

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
      {/* HERO */}
      <section
        className="relative pt-40 pb-16 px-4 overflow-hidden"
        style={{ background: 'linear-gradient(180deg, #050505 0%, #0a0a08 100%)' }}
      >
        <div className="absolute inset-0 opacity-[0.025]" style={{
          backgroundImage: 'repeating-linear-gradient(0deg, #D4AF37 0px, #D4AF37 1px, transparent 1px, transparent 8px), repeating-linear-gradient(90deg, #D4AF37 0px, #D4AF37 0.5px, transparent 0.5px, transparent 40px)',
        }} />
        <div className="relative z-10 max-w-7xl mx-auto">
          <p className="text-[#D4AF37] text-[10px] tracking-[0.5em] uppercase mb-4 hero-animate-1">Catalyst Talents Lagos</p>
          <h1 className="font-playfair text-5xl sm:text-7xl font-bold text-white mb-5 hero-animate-2">Our Models</h1>
          <p className="text-white/40 max-w-xl leading-relaxed hero-animate-3">
            A curated roster of Lagos&apos; finest — models, influencers, and performing talent
            ready to elevate your brand.
          </p>
          <div className="mt-12 grid grid-cols-2 sm:grid-cols-4 gap-[1px] hero-animate-4"
            style={{ background: 'rgba(212,175,55,0.08)', maxWidth: '640px' }}>
            {[
              { value: models.length, label: 'Signed Talents' },
              { value: models.filter(m => m.category === 'Fashion').length, label: 'Fashion' },
              { value: models.filter(m => m.category === 'Commercial').length, label: 'Commercial' },
              { value: 'Open', label: 'Applications' },
            ].map((stat) => (
              <div key={stat.label} className="px-5 py-4" style={{ background: '#0a0a08' }}>
                <p className="font-playfair text-2xl font-bold text-[#D4AF37]">{stat.value}</p>
                <p className="text-[9px] tracking-[0.3em] uppercase text-white/30 mt-0.5">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FILTER + SEARCH */}
      <section className="sticky top-20 z-40 bg-[#0d0d0d]/95 backdrop-blur-md border-b border-white/5 px-4">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-0">
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

      {/* DIVISION DESCRIPTION */}
      {active !== 'All' && !search && divisionInfo[active] && (
        <div className="px-4 py-8 border-b border-white/5" style={{ background: '#090907' }}>
          <div className="max-w-7xl mx-auto flex items-center gap-5">
            <span className="text-[#D4AF37] text-xl">{divisionInfo[active].icon}</span>
            <p className="text-white/40 text-sm leading-relaxed max-w-xl">{divisionInfo[active].desc}</p>
          </div>
        </div>
      )}

      {/* MODEL GRID */}
      <section className="py-14 px-4 max-w-7xl mx-auto">
        {filtered.length === 0 ? (
          <div className="text-center py-24">
            <p className="font-playfair text-2xl text-white/25">No results found.</p>
            <p className="text-sm mt-2 text-white/20">
              {search ? `No models match "${search}"` : 'Check back soon — we\'re always signing new talent.'}
            </p>
            {search ? (
              <button
                onClick={() => setSearch('')}
                className="mt-6 text-[10px] tracking-widest uppercase text-[#D4AF37]/50 hover:text-[#D4AF37] border-b border-[#D4AF37]/20 hover:border-[#D4AF37] pb-0.5 transition-all"
              >
                Clear search
              </button>
            ) : (
              <Link
                href="/apply"
                className="mt-8 inline-block px-8 py-3 border border-[#D4AF37]/30 text-[#D4AF37] text-[10px] tracking-widest uppercase hover:border-[#D4AF37] hover:bg-[#D4AF37]/10 transition-all"
              >
                Apply to Join
              </Link>
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

      {/* JOIN CTA */}
      <section className="py-20 px-4 border-t border-white/5" style={{ background: '#080806' }}>
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-[#D4AF37] text-[10px] tracking-[0.5em] uppercase mb-5">Join the Roster</p>
          <h2 className="font-playfair text-4xl sm:text-5xl font-bold text-white mb-6">
            Think You<br />
            <span className="italic" style={{
              background: 'linear-gradient(135deg, #D4AF37, #F0D060)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
            }}>Belong Here?</span>
          </h2>
          <div className="h-px w-12 bg-[#D4AF37] mx-auto mb-8" />
          <p className="text-white/40 leading-relaxed mb-10 max-w-lg mx-auto">
            We are actively scouting fashion models, commercial talent, influencers, and
            performers across Lagos and Nigeria. Applications are open.
          </p>
          <Link
            href="/apply"
            className="inline-block px-12 py-4 bg-[#D4AF37] text-black font-bold text-xs tracking-widest uppercase hover:bg-[#F0D060] transition-colors"
          >
            Apply Now
          </Link>
        </div>
      </section>
    </>
  )
}
