'use client'

import { useState } from 'react'
import Link from 'next/link'
import { SPONSORS, TIER_LABELS } from '@/data/sponsors'

const TIERS = [
  {
    id: 'presenting',
    label: 'Presenting Sponsor',
    price: '₦2,000,000+',
    tag: 'EXCLUSIVE',
    color: '#FF6B2C',
    glow: 'rgba(255,107,44,0.15)',
    border: 'rgba(255,107,44,0.4)',
    perks: [
      'Exclusive naming rights — “Sneakers Fest 2026 presented by [Brand]”',
      'Logo on all event collateral: tickets, wristbands, stage banners, print',
      '100sqm branded activation zone (prime entrance placement)',
      'Product sampling & distribution rights across full event',
      '10 VIP tickets + backstage hospitality access',
      '10 dedicated posts across all Sneakers Fest social channels',
      'Speaking slot at opening ceremony (main stage)',
      'Logo on countdown timer page & website hero',
      'Post-event recap content prominently featuring brand',
      'First right of refusal for Sneakers Fest 2027',
    ],
  },
  {
    id: 'gold',
    label: 'Gold Partner',
    price: '₦800K – ₦1.5M',
    tag: 'PREMIUM',
    color: '#FFA500',
    glow: 'rgba(255,165,0,0.1)',
    border: 'rgba(255,165,0,0.3)',
    perks: [
      'Logo on event website, program, and main banners',
      '50sqm branded activation zone (main hall, high traffic)',
      'Product sampling & demonstration rights',
      '6 VIP tickets + access to partner lounge',
      '3 dedicated social media posts across all channels',
      'Brand mention at opening & closing ceremony',
      'Logo on digital ticket confirmations',
      'Inclusion in all post-event press coverage',
    ],
  },
  {
    id: 'silver',
    label: 'Silver Partner',
    price: '₦300K – ₦700K',
    tag: 'STANDARD',
    color: '#CBD5E1',
    glow: 'rgba(203,213,225,0.06)',
    border: 'rgba(203,213,225,0.2)',
    perks: [
      'Logo on event website and event program',
      '25sqm activation zone',
      '4 general admission tickets',
      '1 dedicated social media post',
      'Brand listing in event program & schedule',
      'Inclusion in partner acknowledgment on-stage',
    ],
  },
  {
    id: 'media',
    label: 'Media / Community Partner',
    price: 'In-kind',
    tag: 'EXCHANGE',
    color: '#94A3B8',
    glow: 'rgba(148,163,184,0.06)',
    border: 'rgba(148,163,184,0.15)',
    perks: [
      'Logo on event website',
      '2 standard tickets',
      '1 social media mention',
      'Cross-promotion on respective channels',
      'Press access & event coverage rights',
      'Co-branded content opportunity',
    ],
  },
]

const AUDIENCE = [
  { icon: '💟', label: 'Sneaker Collectors', desc: 'Serious buyers with significant disposable income spent on kicks.' },
  { icon: '🎨', label: 'Fashion & Streetwear', desc: 'Style-conscious youth at the intersection of fashion and culture.' },
  { icon: '📱', label: 'Content Creators', desc: 'Influencers and creators actively making sneaker & lifestyle content.' },
  { icon: '🌟', label: 'Tastemakers 18–35', desc: 'Lagos’ next generation of cultural and commercial decision-makers.' },
]

const REACH = [
  { value: '1K–2.5K', label: 'Event Attendees' },
  { value: '5,000+', label: 'FNP Community' },
  { value: '30–50', label: 'Vendors & Brands' },
  { value: 'Year-round', label: 'Online Platform' },
]

const INDUSTRIES = [
  'Sneaker / Footwear Brand',
  'Fashion & Apparel',
  'Technology / Fintech',
  'Food & Beverage',
  'Media & Entertainment',
  'Financial Services',
  'Beauty & Lifestyle',
  'Automotive',
  'Other',
]

interface FormState {
  brand: string
  website: string
  contact: string
  email: string
  phone: string
  industry: string
  tier: string
  goals: string
  ideas: string
}

const EMPTY: FormState = {
  brand: '', website: '', contact: '', email: '', phone: '',
  industry: '', tier: '', goals: '', ideas: '',
}

const inp = 'w-full bg-[#0d1010] border border-white/10 text-white text-sm px-4 py-3 focus:outline-none focus:border-brand-orange/50 transition-colors placeholder:text-white/20 rounded-none'
const sel = 'w-full bg-[#0d1010] border border-white/10 text-white text-sm px-4 py-3 focus:outline-none focus:border-brand-orange/50 transition-colors appearance-none cursor-pointer rounded-none'
const lbl = 'block text-[10px] tracking-[0.3em] uppercase text-brand-orange/60 mb-2'

export default function SponsorsPage() {
  const [form, setForm] = useState<FormState>(EMPTY)
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const set =
    (k: keyof FormState) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
      setForm(f => ({ ...f, [k]: e.target.value }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.brand || !form.email || !form.contact || !form.tier) {
      setError('Please fill in all required fields.')
      return
    }
    setError('')
    setLoading(true)
    try {
      const body = new URLSearchParams({ 'form-name': 'sponsor-inquiry', ...Object.fromEntries(Object.entries(form)) })
      await fetch('/', { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body: body.toString() })
      setSubmitted(true)
    } catch {
      setError('Submission failed. Please email us directly.')
      setLoading(false)
    }
  }

  const existingByTier = (tier: string) => SPONSORS.filter(s => s.tier === tier)

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 bg-brand-dark">
        <div className="max-w-lg text-center">
          <div className="w-16 h-16 mx-auto mb-8 rounded-2xl bg-brand-orange/10 border border-brand-orange/30 flex items-center justify-center">
            <span className="text-brand-orange text-2xl">★</span>
          </div>
          <p className="text-brand-orange text-xs tracking-widest uppercase mb-3">Partnership Inquiry Received</p>
          <h2 className="font-display text-4xl text-white mb-6">
            LET&apos;S BUILD<br />
            <span className="text-gradient">THIS TOGETHER</span>
          </h2>
          <p className="text-gray-400 leading-relaxed mb-4">
            We’ve received your partnership inquiry for{' '}
            <span className="text-white">{form.brand}</span>. Our team will review your submission and be in touch within 48 hours.
          </p>
          <p className="text-gray-600 text-sm mb-10">
            Confirmation sent to{' '}
            <span className="text-brand-orange/70">{form.email}</span>
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/" className="px-8 py-4 rounded-full bg-gradient-to-r from-brand-orange to-brand-amber text-black font-bold text-sm hover:opacity-90">
              Back to Home
            </Link>
            <Link href="/tickets" className="px-8 py-4 rounded-full border border-white/20 text-white text-sm hover:bg-white/5 transition-colors">
              Get Tickets
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-brand-dark min-h-screen">

      {/* Netlify form bot detection */}
      <form name="sponsor-inquiry" data-netlify="true" hidden>
        <input name="brand" /><input name="website" /><input name="contact" />
        <input name="email" /><input name="phone" /><input name="industry" />
        <input name="tier" /><textarea name="goals" /><textarea name="ideas" />
      </form>

      {/* ── HERO ── */}
      <section className="relative min-h-[60vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-brand-dark via-[#0d0d0d] to-black" />
        <div
          className="absolute inset-0 opacity-10"
          style={{ backgroundImage: 'radial-gradient(circle at 20% 50%, #FF6B2C 0%, transparent 55%), radial-gradient(circle at 80% 30%, #FFA500 0%, transparent 50%)' }}
        />
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{ backgroundImage: 'linear-gradient(#FF6B2C 1px, transparent 1px), linear-gradient(90deg, #FF6B2C 1px, transparent 1px)', backgroundSize: '80px 80px' }}
        />
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto pt-32 pb-20">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-orange/10 border border-brand-orange/30 text-brand-orange text-sm font-medium mb-8">
            <span className="w-2 h-2 rounded-full bg-brand-orange animate-pulse" />
            December 12, 2026 &middot; Lagos, Nigeria
          </div>
          <h1 className="font-display text-5xl sm:text-7xl lg:text-8xl tracking-tight mb-6 leading-none">
            <span className="text-white">PARTNER WITH</span><br />
            <span className="text-gradient">SNEAKERS FEST</span>
          </h1>
          <p className="text-gray-300 text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
            Lagos’ first dedicated sneaker festival. Put your brand in front of the city’s most culturally engaged audience on December 12, 2026.
          </p>
          <a href="#apply" className="inline-flex px-8 py-4 rounded-full bg-gradient-to-r from-brand-orange to-brand-amber text-black font-bold text-lg hover:opacity-90 shadow-lg shadow-orange-500/20">
            Apply to Partner
          </a>
        </div>
      </section>

      {/* ── REACH STATS ── */}
      <section className="py-14 border-y border-white/5 bg-[#0d0d0d]">
        <div className="max-w-5xl mx-auto px-4">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
            {REACH.map(({ value, label }) => (
              <div key={label}>
                <div className="font-display text-4xl sm:text-5xl text-gradient mb-1">{value}</div>
                <div className="text-gray-500 text-xs uppercase tracking-widest">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── AUDIENCE ── */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="mb-12">
            <p className="text-brand-orange text-sm font-semibold uppercase tracking-wider mb-2">Your Audience</p>
            <h2 className="font-display text-4xl sm:text-5xl text-white">WHO SHOWS UP</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {AUDIENCE.map(({ icon, label, desc }) => (
              <div key={label} className="bg-brand-gray rounded-2xl p-6 border border-white/5 card-hover">
                <div className="text-3xl mb-4">{icon}</div>
                <h3 className="text-white font-bold mb-2">{label}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
          <div className="mt-8 p-6 rounded-2xl bg-brand-orange/5 border border-brand-orange/15">
            <p className="text-gray-300 text-base leading-relaxed">
              Sneakers Fest isn’t just an event &mdash; it’s a year-round community engine. Through Friday Night Protocol (FNP), we build an engaged audience of 5,000+ before the event even opens its doors. Your brand doesn’t just appear on December 12. It’s woven into months of weekly community content.
            </p>
          </div>
        </div>
      </section>

      {/* ── TIER CARDS ── */}
      <section className="py-20 px-4 bg-[#0d0d0d]">
        <div className="max-w-6xl mx-auto">
          <div className="mb-14 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
            <div>
              <p className="text-brand-orange text-sm font-semibold uppercase tracking-wider mb-2">Partnership Options</p>
              <h2 className="font-display text-4xl sm:text-5xl text-white">SPONSORSHIP TIERS</h2>
            </div>
            <a href="#apply" className="text-brand-orange hover:text-brand-amber text-sm font-semibold transition-colors">Skip to Application &darr;</a>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {TIERS.map(tier => (
              <div
                key={tier.id}
                className="rounded-2xl p-8 border"
                style={{ background: tier.glow, borderColor: tier.border }}
              >
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <span
                      className="text-[10px] tracking-widest uppercase font-bold px-3 py-1 rounded-full mb-3 inline-block"
                      style={{ color: tier.color, background: `${tier.color}15`, border: `1px solid ${tier.color}30` }}
                    >
                      {tier.tag}
                    </span>
                    <h3 className="font-display text-2xl text-white">{tier.label.toUpperCase()}</h3>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-gray-500 text-xs uppercase tracking-wider mb-1">Investment</p>
                    <p className="font-display text-xl" style={{ color: tier.color }}>{tier.price}</p>
                  </div>
                </div>
                <ul className="space-y-2.5">
                  {tier.perks.map(perk => (
                    <li key={perk} className="flex items-start gap-3">
                      <span className="flex-shrink-0 mt-0.5" style={{ color: tier.color }}>✔</span>
                      <span className="text-gray-300 text-sm leading-relaxed">{perk}</span>
                    </li>
                  ))}
                </ul>
                {existingByTier(tier.id === 'presenting' ? 'title' : tier.id).length > 0 && (
                  <div className="mt-6 pt-5 border-t border-white/5">
                    <p className="text-gray-600 text-xs uppercase tracking-wider mb-2">Current partners</p>
                    <div className="flex flex-wrap gap-2">
                      {existingByTier(tier.id === 'presenting' ? 'title' : tier.id).map(s => (
                        <span key={s.name} className="text-sm font-medium" style={{ color: tier.color }}>{s.name}</span>
                      ))}
                    </div>
                  </div>
                )}
                <a
                  href="#apply"
                  className="mt-6 block text-center py-3 rounded-xl text-sm font-bold tracking-wider uppercase transition-all hover:opacity-80"
                  style={{ background: `${tier.color}18`, border: `1px solid ${tier.color}35`, color: tier.color }}
                >
                  Apply for This Tier
                </a>
              </div>
            ))}
          </div>

          <div className="mt-8 p-5 rounded-xl border border-white/5 text-center">
            <p className="text-gray-400 text-sm">
              Need a custom package? <a href="#apply" className="text-brand-orange hover:text-brand-amber transition-colors">Contact us</a> to discuss bespoke activations tailored to your brand.
            </p>
          </div>
        </div>
      </section>

      {/* ── APPLICATION FORM ── */}
      <section id="apply" className="py-20 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="mb-12">
            <p className="text-brand-orange text-sm font-semibold uppercase tracking-wider mb-2">Get Involved</p>
            <h2 className="font-display text-4xl sm:text-5xl text-white mb-4">APPLY TO PARTNER</h2>
            <p className="text-gray-400 leading-relaxed">
              Complete the form below. Our partnerships team reviews every inquiry personally and responds within 48 business hours.
            </p>
          </div>

          <form onSubmit={handleSubmit} noValidate className="space-y-5">

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className={lbl}>Brand / Company Name <span className="text-brand-orange">*</span></label>
                <input type="text" className={inp} placeholder="Your brand name" value={form.brand} onChange={set('brand')} required />
              </div>
              <div>
                <label className={lbl}>Website</label>
                <input type="url" className={inp} placeholder="https://" value={form.website} onChange={set('website')} />
              </div>
              <div>
                <label className={lbl}>Contact Name <span className="text-brand-orange">*</span></label>
                <input type="text" className={inp} placeholder="Your full name" value={form.contact} onChange={set('contact')} required />
              </div>
              <div>
                <label className={lbl}>Email Address <span className="text-brand-orange">*</span></label>
                <input type="email" className={inp} placeholder="you@brand.com" value={form.email} onChange={set('email')} required />
              </div>
              <div>
                <label className={lbl}>Phone</label>
                <input type="tel" className={inp} placeholder="+234..." value={form.phone} onChange={set('phone')} />
              </div>
              <div className="relative">
                <label className={lbl}>Industry / Category</label>
                <div className="relative">
                  <select className={sel} value={form.industry} onChange={set('industry')}>
                    <option value="">Select your industry</option>
                    {INDUSTRIES.map(i => <option key={i} value={i}>{i}</option>)}
                  </select>
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-brand-orange/40 text-xs">▼</div>
                </div>
              </div>
            </div>

            <div className="relative">
              <label className={lbl}>Preferred Partnership Tier <span className="text-brand-orange">*</span></label>
              <div className="relative">
                <select className={sel} value={form.tier} onChange={set('tier')} required>
                  <option value="" disabled>Select a tier</option>
                  <option value="presenting">Presenting Sponsor (₦2,000,000+)</option>
                  <option value="gold">Gold Partner (₦800K–₦1.5M)</option>
                  <option value="silver">Silver Partner (₦300K–₦700K)</option>
                  <option value="media">Media / Community Partner (In-kind)</option>
                  <option value="custom">Custom / Let’s Discuss</option>
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-brand-orange/40 text-xs">▼</div>
              </div>
            </div>

            <div>
              <label className={lbl}>Partnership Goals <span className="text-brand-orange">*</span></label>
              <textarea
                className={`${inp} resize-none`}
                rows={4}
                placeholder="What are you hoping to achieve? Brand awareness, product trials, community engagement, direct sales..."
                value={form.goals}
                onChange={set('goals')}
                required
              />
            </div>

            <div>
              <label className={lbl}>Activation Ideas</label>
              <textarea
                className={`${inp} resize-none`}
                rows={4}
                placeholder="Any specific activation concepts, experiences, or integration ideas you have in mind..."
                value={form.ideas}
                onChange={set('ideas')}
              />
            </div>

            <p className="text-gray-600 text-xs leading-relaxed">
              Your submission is confidential. Information is used solely to process your partnership inquiry.
            </p>

            {error && (
              <p className="text-red-400 text-sm px-4 py-3 border border-red-400/20 bg-red-400/5">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-5 rounded-xl bg-gradient-to-r from-brand-orange to-brand-amber text-black font-bold text-sm tracking-widest uppercase hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-orange-500/20"
            >
              {loading ? 'Sending…' : 'Submit Partnership Inquiry'}
            </button>
          </form>

          <div className="mt-10 pt-8 border-t border-white/5 text-center">
            <p className="text-gray-600 text-xs uppercase tracking-widest mb-3">Prefer to talk first?</p>
            <Link href="/contact" className="text-brand-orange/60 hover:text-brand-orange text-sm transition-colors">
              Reach us via the contact page &rarr;
            </Link>
          </div>
        </div>
      </section>

    </div>
  )
}
