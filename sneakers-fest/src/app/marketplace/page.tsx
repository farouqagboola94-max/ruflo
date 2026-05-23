'use client'

import { useState } from 'react'
import SneakerCard from '@/components/SneakerCard'
import { SNEAKERS } from '@/data/sneakers'

const LISTING_TYPES = ['All', 'Buy', 'Sell', 'Trade']

export default function MarketplacePage() {
  const [activeType, setActiveType] = useState('All')
  const [showListForm, setShowListForm] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [form, setForm] = useState({ name: '', brand: '', size: '', price: '', condition: 'New', type: 'Sell', contact: '' })

  const marketplaceItems = SNEAKERS.filter(s => s.marketplace)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-10">
        <div>
          <p className="text-brand-orange text-sm font-semibold uppercase tracking-wider mb-2">Buy · Sell · Trade</p>
          <h1 className="font-display text-5xl sm:text-6xl text-white mb-4">MARKETPLACE</h1>
          <p className="text-gray-400">Connect with sellers at the fest. Find your next grail or list your collection.</p>
        </div>
        <button
          onClick={() => { setShowListForm(true); setSubmitted(false) }}
          className="flex-shrink-0 px-6 py-3 rounded-full bg-gradient-to-r from-brand-orange to-brand-amber text-black font-bold hover:opacity-90 transition-opacity"
        >
          + List Your Sneakers
        </button>
      </div>

      <div className="flex gap-2 mb-8">
        {LISTING_TYPES.map(type => (
          <button
            key={type}
            onClick={() => setActiveType(type)}
            className={`px-5 py-2 rounded-full text-sm font-medium transition-colors ${
              activeType === type ? 'bg-brand-orange text-black' : 'bg-brand-gray text-gray-300 hover:bg-brand-muted'
            }`}
          >
            {type}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-16">
        {marketplaceItems.map(s => <SneakerCard key={s.id} sneaker={s} showSeller />)}
      </div>

      <div className="bg-brand-gray rounded-3xl p-8 mb-16 border border-white/5">
        <h2 className="font-display text-3xl text-white mb-8 text-center">HOW IT WORKS</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { step: '01', title: 'List Your Pair', desc: 'Fill out the quick listing form with your sneaker details, size, and asking price.' },
            { step: '02', title: 'Show at the Fest', desc: 'Bring your sneakers to the event. Your vendor slot will be confirmed via email.' },
            { step: '03', title: 'Make the Deal', desc: 'Meet buyers, negotiate, and complete transactions at the event. Cash or transfer.' },
          ].map(({ step, title, desc }) => (
            <div key={step} className="text-center p-6">
              <div className="font-display text-5xl text-gradient mb-4">{step}</div>
              <h3 className="text-white font-bold text-lg mb-2">{title}</h3>
              <p className="text-gray-400 text-sm leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </div>

      {showListForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-brand-gray rounded-3xl p-8 w-full max-w-lg border border-white/10 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-white font-display text-2xl">LIST YOUR PAIR</h3>
              <button onClick={() => setShowListForm(false)} className="text-gray-400 hover:text-white">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>

            {submitted ? (
              <div className="text-center py-8">
                <div className="text-5xl mb-4">✅</div>
                <h4 className="text-white font-bold text-xl mb-2">Listing Submitted!</h4>
                <p className="text-gray-400">We'll confirm your vendor slot via email before the event.</p>
                <button onClick={() => setShowListForm(false)} className="mt-6 px-6 py-3 rounded-full bg-brand-orange text-black font-bold">Close</button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                {[
                  { label: 'Sneaker Name', key: 'name', placeholder: 'e.g. Air Jordan 1 Chicago' },
                  { label: 'Brand', key: 'brand', placeholder: 'e.g. Nike, Jordan, Adidas' },
                  { label: 'Size (US)', key: 'size', placeholder: 'e.g. 10' },
                  { label: 'Asking Price (₦ NGN)', key: 'price', placeholder: 'e.g. 250,000' },
                  { label: 'Contact (Email or IG)', key: 'contact', placeholder: '@handle or email' },
                ].map(({ label, key, placeholder }) => (
                  <div key={key}>
                    <label className="block text-sm text-gray-400 mb-1.5">{label}</label>
                    <input
                      type="text"
                      placeholder={placeholder}
                      required
                      value={form[key as keyof typeof form]}
                      onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
                      className="w-full px-4 py-3 bg-brand-dark border border-white/10 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-brand-orange text-sm"
                    />
                  </div>
                ))}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-gray-400 mb-1.5">Condition</label>
                    <select value={form.condition} onChange={e => setForm(f => ({ ...f, condition: e.target.value }))} className="w-full px-4 py-3 bg-brand-dark border border-white/10 rounded-xl text-white focus:outline-none focus:border-brand-orange text-sm">
                      <option>New</option><option>Deadstock</option><option>Used</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-1.5">Listing Type</label>
                    <select value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value }))} className="w-full px-4 py-3 bg-brand-dark border border-white/10 rounded-xl text-white focus:outline-none focus:border-brand-orange text-sm">
                      <option>Sell</option><option>Trade</option><option>Buy</option>
                    </select>
                  </div>
                </div>
                <button type="submit" className="w-full py-4 rounded-xl bg-gradient-to-r from-brand-orange to-brand-amber text-black font-bold text-lg hover:opacity-90 transition-opacity mt-2">
                  Submit Listing
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
