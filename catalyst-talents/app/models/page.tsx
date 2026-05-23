'use client'

import { useState } from 'react'
import ModelCard from '@/components/ModelCard'
import { models } from '@/data/models'

type Category = 'All' | 'Fashion' | 'Commercial' | 'Influencer' | 'Acting'

const tabs: Category[] = ['All', 'Fashion', 'Commercial', 'Influencer', 'Acting']

export default function ModelsPage() {
  const [active, setActive] = useState<Category>('All')

  const filtered = active === 'All' ? models : models.filter((m) => m.category === active)

  return (
    <>
      {/* PAGE HEADER */}
      <section
        className="pt-40 pb-20 px-4"
        style={{
          background:
            'linear-gradient(180deg, #050505 0%, #0d0d0d 100%)',
        }}
      >
        <div className="max-w-7xl mx-auto">
          <p className="text-gold text-xs tracking-[0.5em] uppercase mb-4">Catalyst Talents Lagos</p>
          <h1 className="font-playfair text-5xl sm:text-7xl font-bold text-white">Our Models</h1>
          <p className="text-white/40 mt-4 max-w-lg">
            A curated roster of Lagos' finest — models, influencers, and performing talent ready
            to elevate your brand.
          </p>
        </div>
      </section>

      {/* FILTER TABS */}
      <section className="sticky top-20 z-40 bg-dark-100/95 backdrop-blur-md border-b border-white/5 px-4">
        <div className="max-w-7xl mx-auto flex gap-0 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActive(tab)}
              className={`px-6 py-5 text-xs tracking-widest uppercase whitespace-nowrap transition-all duration-300 border-b-2 ${
                active === tab
                  ? 'text-gold border-gold'
                  : 'text-white/40 border-transparent hover:text-white/70'
              }`}
            >
              {tab}
              {tab !== 'All' && (
                <span className="ml-2 text-white/20">
                  ({models.filter((m) => m.category === tab).length})
                </span>
              )}
            </button>
          ))}
        </div>
      </section>

      {/* MODEL GRID */}
      <section className="py-16 px-4 max-w-7xl mx-auto">
        {filtered.length === 0 ? (
          <div className="text-center py-24 text-white/30">
            <p className="font-playfair text-2xl">No models in this category yet.</p>
            <p className="text-sm mt-2">Check back soon — we're always signing new talent.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {filtered.map((model) => (
              <ModelCard key={model.id} model={model} />
            ))}
          </div>
        )}
      </section>
    </>
  )
}
