'use client'

import { useState } from 'react'
import Link from 'next/link'
import { BOOTH_TIERS, VENDOR_CATEGORIES, VendorApplication } from '@/data/vendors'

const STORAGE_KEY = 'sf_vendors'

function genId() {
  return 'VD-' + Math.random().toString(36).slice(2, 8).toUpperCase()
}

const inputCls =
  'w-full px-4 py-3 bg-brand-dark border border-white/10 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-brand-orange text-sm'

export default function VendorsPage() {
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [submitted, setSubmitted] = useState(false)
  const [confirmedApp, setConfirmedApp] = useState<VendorApplication | null>(null)
  const [form, setForm] = useState({
    businessName: '', contactName: '', email: '', phone: '',
    website: '', instagram: '', category: '', description: '',
  })
  const [showCheck, setShowCheck] = useState(false)
  const [checkEmail, setCheckEmail] = useState('')
  const [checkResult, setCheckResult] = useState<VendorApplication | 'not-found' | null>(null)

  const booth = BOOTH_TIERS.find(b => b.id === selectedId)

  const field = (key: keyof typeof form) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
      setForm(f => ({ ...f, [key]: e.target.value }))

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const app: VendorApplication = {
      id: genId(),
      businessName: form.businessName,
      contactName: form.contactName,
      email: form.email,
      phone: form.phone,
      website: form.website || undefined,
      instagram: form.instagram || undefined,
      category: form.category,
      boothType: selectedId as VendorApplication['boothType'],
      description: form.description,
      status: 'pending',
      ref: `VD_${Date.now()}`,
      amount: booth!.price,
      createdAt: new Date().toISOString(),
    }
    const existing: VendorApplication[] = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]')
    localStorage.setItem(STORAGE_KEY, JSON.stringify([...existing, app]))
    setConfirmedApp(app)
    setSubmitted(true)
  }

  function handleCheck(e: React.FormEvent) {
    e.preventDefault()
    const apps: VendorApplication[] = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]')
    const found = apps.find(a => a.email.toLowerCase() === checkEmail.toLowerCase())
    setCheckResult(found ?? 'not-found')
  }

  function resetForm() {
    setSubmitted(false)
    setSelectedId(null)
    setConfirmedApp(null)
    setForm({ businessName: '', contactName: '', email: '', phone: '', website: '', instagram: '', category: '', description: '' })
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      {/* Header */}
      <div className="text-center mb-14">
        <p className="text-brand-orange text-sm font-semibold uppercase tracking-wider mb-2">December 12, 2026</p>
        <h1 className="font-display text-5xl sm:text-6xl text-white mb-4">VENDOR REGISTRATION</h1>
        <p className="text-gray-400 text-lg max-w-xl mx-auto">
          Secure your booth at West Africa&apos;s first dedicated sneaker event. Limited spots — first come, first served.
        </p>
      </div>

      {/* Booth Tiers */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-14">
        {BOOTH_TIERS.map(tier => (
          <div
            key={tier.id}
            onClick={() => { setSelectedId(tier.id); setSubmitted(false); setConfirmedApp(null) }}
            className={`relative rounded-3xl p-px cursor-pointer transition-all ${
              selectedId === tier.id
                ? `bg-gradient-to-br ${tier.color} shadow-xl shadow-orange-500/20`
                : 'bg-white/5 hover:bg-white/10'
            }`}
          >
            {tier.badge && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-10">
                <span className="px-4 py-1 rounded-full bg-gradient-to-r from-brand-orange to-brand-yellow text-black text-xs font-bold">
                  {tier.badge}
                </span>
              </div>
            )}
            <div className="rounded-3xl bg-brand-gray p-6 h-full flex flex-col">
              <div className="flex items-start justify-between mb-2">
                <h3 className="text-white font-display text-2xl">{tier.name.toUpperCase()}</h3>
                <span className="text-xs text-gray-500 bg-brand-dark px-2 py-1 rounded-lg mt-1">{tier.size}</span>
              </div>
              <div className="flex items-baseline gap-1 mb-3">
                <span className="text-4xl font-bold text-gradient">₦{tier.price.toLocaleString()}</span>
                <span className="text-gray-400 text-sm">one-time</span>
              </div>
              <p className="text-gray-400 text-sm mb-6 leading-relaxed">{tier.description}</p>
              <ul className="space-y-2.5 flex-1">
                {tier.perks.map(perk => (
                  <li key={perk} className="flex items-start gap-2 text-sm">
                    <span className="text-brand-orange mt-0.5 flex-shrink-0">✓</span>
                    <span className="text-gray-300">{perk}</span>
                  </li>
                ))}
              </ul>
              <p className="mt-4 text-xs text-gray-600">{tier.spots} spots available</p>
              <button
                className={`mt-4 w-full py-3 rounded-xl font-bold text-sm transition-all ${
                  selectedId === tier.id
                    ? `bg-gradient-to-r ${tier.color} text-black`
                    : 'border border-white/20 text-white hover:border-brand-orange hover:text-brand-orange'
                }`}
              >
                {selectedId === tier.id ? 'Selected ✓' : 'Select This Booth'}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Form / Success */}
      <div className="max-w-xl mx-auto">
        {!submitted ? (
          <div className="bg-brand-gray rounded-3xl p-8 border border-white/5">
            <h2 className="font-display text-2xl text-white mb-2">YOUR APPLICATION</h2>
            {booth ? (
              <p className="text-brand-orange text-sm mb-6">
                {booth.name} · {booth.size} · ₦{booth.price.toLocaleString()}
              </p>
            ) : (
              <p className="text-gray-500 text-sm mb-6">Select a booth tier above, then fill in your details.</p>
            )}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-1.5">Business Name</label>
                  <input required value={form.businessName} onChange={field('businessName')} placeholder="Sole Kings Lagos" className={inputCls} />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1.5">Contact Name</label>
                  <input required value={form.contactName} onChange={field('contactName')} placeholder="Your full name" className={inputCls} />
                </div>
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1.5">Email Address</label>
                <input required type="email" value={form.email} onChange={field('email')} placeholder="you@business.com" className={inputCls} />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1.5">Phone Number</label>
                <input required value={form.phone} onChange={field('phone')} placeholder="+234 000 0000" className={inputCls} />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1.5">Category</label>
                <select required value={form.category} onChange={field('category')} className={inputCls + ' cursor-pointer'}>
                  <option value="">What will you be selling?</option>
                  {VENDOR_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-1.5">
                    Instagram <span className="text-gray-600">(optional)</span>
                  </label>
                  <input value={form.instagram} onChange={field('instagram')} placeholder="@yourhandle" className={inputCls} />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1.5">
                    Website <span className="text-gray-600">(optional)</span>
                  </label>
                  <input value={form.website} onChange={field('website')} placeholder="yoursite.com" className={inputCls} />
                </div>
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1.5">
                  Brief Description{' '}
                  <span className="text-gray-600 text-xs">({200 - form.description.length} chars left)</span>
                </label>
                <textarea
                  required
                  maxLength={200}
                  rows={3}
                  value={form.description}
                  onChange={field('description')}
                  placeholder="Tell us about your business and what you'll be bringing to the fest..."
                  className={inputCls + ' resize-none'}
                />
              </div>
              {booth && (
                <div className="bg-brand-dark rounded-xl p-4 border border-white/10">
                  <div className="flex justify-between text-sm text-gray-400 mb-1">
                    <span>{booth.name}</span>
                    <span>₦{booth.price.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between font-bold text-white">
                    <span>Total Due</span>
                    <span className="text-gradient text-lg">₦{booth.price.toLocaleString()}</span>
                  </div>
                </div>
              )}
              <button
                type="submit"
                disabled={!booth}
                className="w-full py-4 rounded-xl bg-gradient-to-r from-brand-orange to-brand-yellow text-black font-bold text-lg hover:opacity-90 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {booth ? `Submit Application — ₦${booth.price.toLocaleString()}` : 'Select a Booth First'}
              </button>
            </form>
          </div>
        ) : confirmedApp ? (
          <div className="bg-brand-gray rounded-3xl p-12 border border-brand-orange/20 text-center">
            <div className="text-6xl mb-6">🏪</div>
            <h3 className="font-display text-3xl text-white mb-3">APPLICATION RECEIVED!</h3>
            <p className="text-gray-400 mb-2">
              Confirmation sent to <span className="text-white">{confirmedApp.email}</span>
            </p>
            <div className="bg-brand-dark rounded-2xl p-4 my-6 border border-white/10 text-left space-y-2.5">
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Application ID</span>
                <span className="text-white font-mono font-bold">{confirmedApp.id}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Booth Type</span>
                <span className="text-white">{BOOTH_TIERS.find(b => b.id === confirmedApp.boothType)?.name}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Booth Fee</span>
                <span className="text-white">₦{confirmedApp.amount.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Status</span>
                <span className="text-yellow-400 font-medium">Pending Review</span>
              </div>
            </div>
            <p className="text-gray-500 text-sm mb-8">
              We&apos;ll review your application and contact you within 3–5 business days.
            </p>
            <div className="flex gap-4 justify-center flex-wrap">
              <button onClick={resetForm} className="text-brand-orange text-sm hover:underline">
                Submit another application
              </button>
              <span className="text-gray-600">·</span>
              <Link href="/schedule" className="text-brand-orange text-sm hover:underline">
                View schedule
              </Link>
              <span className="text-gray-600">·</span>
              <Link href="/tickets" className="text-brand-orange text-sm hover:underline">
                Get attendee tickets
              </Link>
            </div>
          </div>
        ) : null}
      </div>

      {/* Check Status */}
      <div className="max-w-xl mx-auto mt-12">
        <div className="text-center">
          <button
            onClick={() => { setShowCheck(v => !v); setCheckResult(null); setCheckEmail('') }}
            className="text-gray-500 text-sm hover:text-gray-300 transition-colors"
          >
            Already applied? Check your application status {showCheck ? '↑' : '↓'}
          </button>
        </div>
        {showCheck && (
          <div className="mt-5 bg-brand-gray rounded-2xl p-6 border border-white/5">
            <form onSubmit={handleCheck} className="flex gap-3">
              <input
                type="email"
                required
                value={checkEmail}
                onChange={e => { setCheckEmail(e.target.value); setCheckResult(null) }}
                placeholder="Enter your application email"
                className="flex-1 px-4 py-3 bg-brand-dark border border-white/10 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-brand-orange text-sm"
              />
              <button type="submit" className="px-5 py-3 rounded-xl bg-brand-orange text-black font-bold text-sm hover:opacity-90 transition-opacity">
                Check
              </button>
            </form>
            {checkResult && (
              <div className="mt-4">
                {checkResult === 'not-found' ? (
                  <p className="text-gray-400 text-sm">No application found for that email address.</p>
                ) : (
                  <div className="bg-brand-dark rounded-xl p-4 border border-white/10 space-y-2.5">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Application ID</span>
                      <span className="text-white font-mono">{checkResult.id}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Business</span>
                      <span className="text-white">{checkResult.businessName}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Booth</span>
                      <span className="text-white">
                        {BOOTH_TIERS.find(b => b.id === checkResult.boothType)?.name}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Status</span>
                      <span className={`font-medium ${
                        checkResult.status === 'approved' ? 'text-green-400' :
                        checkResult.status === 'rejected' ? 'text-red-400' :
                        'text-yellow-400'
                      }`}>
                        {checkResult.status === 'approved' ? 'Approved ✓' :
                         checkResult.status === 'rejected' ? 'Not Selected' :
                         'Pending Review'}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Vendor Info */}
      <div className="max-w-4xl mx-auto mt-20">
        <div className="text-center mb-10">
          <p className="text-brand-orange text-sm font-semibold uppercase tracking-wider mb-2">Need to Know</p>
          <h2 className="font-display text-3xl text-white">VENDOR INFO</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              icon: '📦',
              title: 'Set-Up & Break-Down',
              body: 'Set-up begins at 6:00 AM on December 12. All vendors must be ready by 8:45 AM. Break-down starts at 7:30 PM.',
            },
            {
              icon: '🚚',
              title: 'Load-In Policy',
              body: 'Vendors with large stock can request a dedicated load-in slot. Contact us after your application is approved.',
            },
            {
              icon: '💳',
              title: 'Payment Policy',
              body: 'Booth fees are non-refundable after confirmation. We accept bank transfers and card payments via Paystack.',
            },
          ].map(({ icon, title, body }) => (
            <div key={title} className="bg-brand-gray rounded-2xl p-6 border border-white/5">
              <div className="text-3xl mb-4">{icon}</div>
              <h3 className="text-white font-semibold mb-2">{title}</h3>
              <p className="text-gray-400 text-sm leading-relaxed">{body}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
