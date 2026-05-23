'use client'

import { useState, useMemo } from 'react'
import SneakerCard from '@/components/SneakerCard'
import { SNEAKERS, BRANDS, CATEGORIES, CONDITIONS } from '@/data/sneakers'

export default function CatalogPage() {
  const [search, setSearch] = useState('')
  const [brand, setBrand] = useState('All')
  const [category, setCategory] = useState('All')
  const [condition, setCondition] = useState('All')
  const [sort, setSort] = useState('featured')

  const filtered = useMemo(() => {
    let items = [...SNEAKERS]
    if (search) items = items.filter(s => `${s.name} ${s.brand} ${s.colorway}`.toLowerCase().includes(search.toLowerCase()))
    if (brand !== 'All') items = items.filter(s => s.brand === brand)
    if (category !== 'All') items = items.filter(s => s.category === category)
    if (condition !== 'All') items = items.filter(s => s.condition === condition)
    if (sort === 'price-asc') items.sort((a, b) => a.price - b.price)
    else if (sort === 'price-desc') items.sort((a, b) => b.price - a.price)
    else if (sort === 'featured') items.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0))
    return items
  }, [search, brand, category, condition, sort])

  const FilterChips = ({ label, options, value, onChange }: { label: string; options: string[]; value: string; onChange: (v: string) => void }) => (
    <div>
      <p className="text-xs text-gray-500 uppercase tracking-wider mb-2">{label}</p>
      <div className="flex flex-wrap gap-2">
        {options.map(opt => (
          <button
            key={opt}
            onClick={() => onChange(opt)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
              value === opt ? 'bg-brand-orange text-black' : 'bg-brand-muted text-gray-300 hover:bg-brand-gray'
            }`}
          >
            {opt}
          </button>
        ))}
      </div>
    </div>
  )

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="mb-10">
        <p className="text-brand-orange text-sm font-semibold uppercase tracking-wider mb-2">Browse</p>
        <h1 className="font-display text-5xl sm:text-6xl text-white mb-4">SNEAKER CATALOG</h1>
        <p className="text-gray-400">Explore all sneakers available at the fest. Filter by brand, category, or condition.</p>
      </div>

      <div className="bg-brand-gray rounded-2xl p-6 mb-8 border border-white/5 space-y-5">
        <div className="relative">
          <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder="Search sneakers..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-11 pr-4 py-3 bg-brand-dark border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-brand-orange text-sm"
          />
        </div>
        <FilterChips label="Brand" options={BRANDS} value={brand} onChange={setBrand} />
        <FilterChips label="Category" options={CATEGORIES} value={category} onChange={setCategory} />
        <FilterChips label="Condition" options={CONDITIONS} value={condition} onChange={setCondition} />
        <div className="flex items-center gap-3">
          <p className="text-xs text-gray-500 uppercase tracking-wider">Sort</p>
          <select
            value={sort}
            onChange={e => setSort(e.target.value)}
            className="bg-brand-muted text-white text-sm px-3 py-1.5 rounded-lg border border-white/10 focus:outline-none focus:border-brand-orange"
          >
            <option value="featured">Featured First</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
          </select>
        </div>
      </div>

      <div className="flex items-center justify-between mb-6">
        <p className="text-gray-400 text-sm">{filtered.length} {filtered.length === 1 ? 'pair' : 'pairs'} found</p>
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-20 text-gray-500">
          <div className="text-5xl mb-4">👟</div>
          <p className="text-lg">No sneakers match your filters.</p>
          <button onClick={() => { setSearch(''); setBrand('All'); setCategory('All'); setCondition('All') }} className="mt-4 text-brand-orange text-sm hover:underline">Clear filters</button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filtered.map(s => <SneakerCard key={s.id} sneaker={s} />)}
        </div>
      )}
    </div>
  )
}
