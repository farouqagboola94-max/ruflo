'use client'

import { useState } from 'react'
import Link from 'next/link'
import Script from 'next/script'
import { BOOTH_TIERS, PRODUCT_CATEGORIES } from '@/data/vendors'
import { generateVendorInvoicePDF } from '@/lib/generateInvoicePDF'

declare global {
  interface Window {
    PaystackPop: {
      setup: (config: {
        key: string
        email: string
        amount: number
        currency: string
        ref: string
        metadata?: object
        callback: (r: { reference: string }) => void
        onClose: () => void
      }) => { openIframe: () => void }
    }
  }
}

const PAYSTACK_KEY = process.env.NEXT_PUBLIC_PAYSTACK_KEY || 'pk_test_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx'

type Form = {
  businessName: string
  contactName: string
  email: string
  phone: string
  instagram: string
  category: string
  description: string
}

const EMPTY_FORM: Form = {
  businessName: '',
  contactName: '',
  email: '',
  phone: '',
  instagram: '',
  category: '',
  description: '',
}

export default function VendorsPage() {
  const [selected, setSelected] = useState<string | null>(null)
  const [form, setForm] = useState<Form>(EMPTY_FORM)
  const [submitted, setSubmitted] = useState(false)
  const [payRef, setPayRef] = useState('')
  const [registeredAt, setRegisteredAt] = useState('')
  const [processing, setProcessing] = useState(false)
  const [invoiceLoading, setInvoiceLoading] = useState(false)

  const tier = BOOTH_TIERS.find(t => t.id === selected)

  const set = (field: keyof Form) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
      setForm(f => ({ ...f, [field]: e.target.value }))

  const initiatePayment = (e: React.FormEvent) => {
    e.preventDefault()
    if (!tier) return
    if (typeof window === 'undefined' || !window.PaystackPop) {
      alert('Payment is loading — please try again in a moment.')
      return
    }
    setProcessing(true)
    const ref = `SF-VND-${Date.now()}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`
    window.PaystackPop.setup({
      key: PAYSTACK_KEY,
      email: form.email,
      amount: tier.price * 100,
      currency: 'NGN',
      ref,
      metadata: {
        custom_fields: [
          { display_name: 'Business Name',    variable_name: 'business_name', value: form.businessName },
          { display_name: 'Booth Type',       variable_name: 'booth_type',    value: tier.name },
          { display_name: 'Product Category', variable_name: 'category',      value: form.category },
          { display_name: 'Instagram',        variable_name: 'instagram',     value: form.instagram || 'N/A' },
        ],
      },
      callback: (response) => {
        setProcessing(false)
        const now = new Date().toISOString()
        setPayRef(response.reference)
        setRegisteredAt(now)

        const record = {
          ref:          response.reference,
          email:        form.email,
          businessName: form.businessName,
          contactName:  form.contactName,
          phone:        form.phone,
          instagram:    form.instagram,
          category:     form.category,
          description:  form.description,
          tier:         tier.name,
          tierId:       tier.id,
          size:         tier.size,
          price:        tier.price,
          registeredAt: now,
        }
        try {
          const existing = JSON.parse(localStorage.getItem('sf_vendors') || '[]')
          localStorage.setItem('sf_vendors', JSON.stringify([...existing, record]))
        } catch {}

        setSubmitted(true)
      },
      onClose: () => setProcessing(false),
    }).openIframe()
  }

  const downloadInvoice = async () => {
    if (!tier) return
    setInvoiceLoading(true)
    try {
      await generateVendorInvoicePDF({
        ref:          payRef,
        businessName: form.businessName,
        contactName:  form.contactName,
        email:        form.email,
        phone:        form.phone,
        tier:         tier.name,
        size:         tier.size,
        price:        tier.price,
        registeredAt: registeredAt || new Date().toISOString(),
      })
    } finally {
      setInvoiceLoading(false)
    }
  }

  return (
    <>
      <Script src="https://js.paystack.co/v1/inline.js" strategy="lazyOnload" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-14">
          <p className="text-brand-orange text-sm font-semibold uppercase tracking-wider mb-2">December 12–13, 2026 · Lagos, Nigeria</p>
          <h1 className="font-display text-5xl sm:text-6xl text-white mb-4">VENDOR REGISTRATION</h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Secure your booth at Lagos’ first dedicated sneaker festival. 30–50 vendor spots. Limited floor.
          </p>
          <div className="mt-6 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-orange/10 border border-brand-orange/20">
            <span className="w-2 h-2 rounded-full bg-brand-orange animate-pulse" />
            <span className="text-brand-orange text-sm font-medium">Registration open — spots filling fast</span>
          </div>
        </div>

        {!submitted ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-14">
              {BOOTH_TIERS.map(t => (
                <div key={t.id} onClick={() => setSelected(t.id)}
                  className={`relative rounded-3xl p-px cursor-pointer transition-all ${
                    selected === t.id
                      ? `bg-gradient-to-br ${t.color} shadow-xl shadow-orange-500/20`
                      : 'bg-white/5 hover:bg-white/10'
                  }`}>
                  {t.badge && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-10">
                      <span className={`px-4 py-1 rounded-full text-black text-xs font-bold bg-gradient-to-r ${t.color}`}>
                        {t.badge}
                      </span>
                    </div>
                  )}
                  <div className="rounded-3xl bg-brand-gray p-6 h-full flex flex-col">
                    <div className="flex items-start justify-between mb-1">
                      <h3 className="text-white font-display text-2xl">{t.name.toUpperCase()}</h3>
                      <span className="text-xs text-gray-500 bg-white/5 px-2 py-1 rounded-lg">{t.size}</span>
                    </div>
                    <div className="flex items-baseline gap-1 mb-3">
                      <span className="text-4xl font-bold text-gradient">₦{t.price.toLocaleString()}</span>
                      <span className="text-gray-400 text-sm">/ booth</span>
                    </div>
                    <p className="text-gray-400 text-sm mb-6 leading-relaxed">{t.description}</p>
                    <ul className="space-y-2.5 flex-1">
                      {t.perks.map(p => (
                        <li key={p} className="flex items-start gap-2 text-sm">
                          <span className="mt-0.5 flex-shrink-0 text-brand-orange">✓</span>
                          <span className="text-gray-300">{p}</span>
                        </li>
                      ))}
                    </ul>
                    <button className={`mt-6 w-full py-3 rounded-xl font-bold text-sm transition-all ${
                      selected === t.id
                        ? `bg-gradient-to-r ${t.color} text-black`
                        : 'border border-white/20 text-white hover:border-brand-orange hover:text-brand-orange'
                    }`}>
                      {selected === t.id ? 'Selected ✓' : 'Select This Booth'}
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="max-w-2xl mx-auto">
              <div className="bg-brand-gray rounded-3xl p-8 border border-white/5">
                <h2 className="font-display text-2xl text-white mb-2">YOUR DETAILS</h2>
                {tier
                  ? <p className="text-brand-orange text-sm mb-6">{tier.name} Booth · {tier.size} · ₦{tier.price.toLocaleString()}</p>
                  : <p className="text-gray-500 text-sm mb-6">Select a booth above, then complete your registration.</p>
                }
                <form onSubmit={initiatePayment} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm text-gray-400 mb-1.5">Business / Brand Name *</label>
                      <input type="text" required placeholder="e.g. Lagos Kicks"
                        value={form.businessName} onChange={set('businessName')}
                        className="w-full px-4 py-3 bg-brand-dark border border-white/10 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-brand-orange text-sm" />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-400 mb-1.5">Contact Name *</label>
                      <input type="text" required placeholder="Your full name"
                        value={form.contactName} onChange={set('contactName')}
                        className="w-full px-4 py-3 bg-brand-dark border border-white/10 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-brand-orange text-sm" />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm text-gray-400 mb-1.5">Email Address *</label>
                      <input type="email" required placeholder="you@brand.com"
                        value={form.email} onChange={set('email')}
                        className="w-full px-4 py-3 bg-brand-dark border border-white/10 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-brand-orange text-sm" />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-400 mb-1.5">Phone Number *</label>
                      <input type="tel" required placeholder="+234 800 0000 000"
                        value={form.phone} onChange={set('phone')}
                        className="w-full px-4 py-3 bg-brand-dark border border-white/10 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-brand-orange text-sm" />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm text-gray-400 mb-1.5">Instagram Handle</label>
                      <input type="text" placeholder="@yourbrand"
                        value={form.instagram} onChange={set('instagram')}
                        className="w-full px-4 py-3 bg-brand-dark border border-white/10 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-brand-orange text-sm" />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-400 mb-1.5">Product Category *</label>
                      <select required value={form.category} onChange={set('category')}
                        className="w-full px-4 py-3 bg-brand-dark border border-white/10 rounded-xl text-white focus:outline-none focus:border-brand-orange text-sm">
                        <option value="" disabled>Select a category</option>
                        {PRODUCT_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-1.5">Tell us about your brand <span className="text-gray-600">(optional)</span></label>
                    <textarea rows={3} placeholder="What you sell, your vibe, any special setup needs..."
                      value={form.description} onChange={set('description')}
                      className="w-full px-4 py-3 bg-brand-dark border border-white/10 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-brand-orange text-sm resize-none" />
                  </div>
                  {tier && (
                    <div className="bg-brand-dark rounded-xl p-4 border border-white/10">
                      <div className="flex justify-between text-sm text-gray-400 mb-1">
                        <span>{tier.name} Booth · {tier.size}</span>
                        <span>₦{tier.price.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between font-bold text-white">
                        <span>Total Due Now</span>
                        <span className="text-gradient text-lg">₦{tier.price.toLocaleString()}</span>
                      </div>
                    </div>
                  )}
                  <button type="submit" disabled={!tier || processing}
                    className="w-full py-4 rounded-xl bg-gradient-to-r from-brand-orange to-brand-amber text-black font-bold text-lg hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed transition-opacity">
                    {processing ? 'Opening payment…' : tier ? `Pay ₦${tier.price.toLocaleString()} — Secure My Booth` : 'Select a Booth First'}
                  </button>
                  <p className="text-center text-gray-500 text-xs">Secured by Paystack · SSL encrypted · Full payment required to confirm spot</p>
                </form>
              </div>

              <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
                {[
                  { icon: '📅', label: 'Setup Day',        value: 'December 11, 2026' },
                  { icon: '📍', label: 'Location',         value: 'Lagos, Nigeria' },
                  { icon: '📞', label: 'Vendor Enquiries', value: 'Contact us' },
                ].map(({ icon, label, value }) => (
                  <div key={label} className="bg-brand-gray rounded-2xl p-4 border border-white/5">
                    <div className="text-2xl mb-1">{icon}</div>
                    <div className="text-xs text-gray-500 uppercase tracking-wider">{label}</div>
                    <div className="text-white text-sm font-semibold mt-0.5">{value}</div>
                  </div>
                ))}
              </div>
            </div>
          </>
        ) : (
          <div className="max-w-xl mx-auto">
            <div className="bg-brand-gray rounded-3xl p-10 border border-brand-orange/20 text-center">
              <div className="text-6xl mb-5">🏪</div>
              <h3 className="font-display text-3xl text-white mb-1">BOOTH SECURED!</h3>
              <p className="text-gray-400 text-sm mb-1">{form.businessName} · {tier?.name} Booth · ₦{tier?.price.toLocaleString()}</p>

              <div className="my-6 bg-brand-dark rounded-2xl p-4 border border-brand-orange/30">
                <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Your Booking Reference — Save This</p>
                <p className="text-brand-orange font-mono font-bold text-lg">{payRef}</p>
                <p className="text-gray-600 text-xs mt-1">You'll need this to access your Vendor Dashboard</p>
              </div>

              <div className="mb-6">
                <button onClick={downloadInvoice} disabled={invoiceLoading}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-brand-orange/10 border border-brand-orange/40 text-brand-orange text-sm font-semibold hover:bg-brand-orange/20 transition-colors disabled:opacity-50">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  {invoiceLoading ? 'Generating PDF…' : 'Download Invoice PDF'}
                </button>
                <p className="text-gray-600 text-xs mt-2">Official receipt for your records</p>
              </div>

              <div className="bg-brand-dark rounded-2xl p-5 mb-6 border border-white/10 text-left space-y-2">
                <p className="text-xs text-gray-500 uppercase tracking-wider mb-3">What happens next</p>
                {[
                  'Confirmation email sent to ' + form.email,
                  'Booth assignment and floor map released November 2026',
                  'Setup access from 8 AM on December 11, 2026',
                  'Vendor briefing pack shared 2 weeks before the event',
                ].map(step => (
                  <div key={step} className="flex items-start gap-2 text-sm">
                    <span className="text-brand-orange mt-0.5 flex-shrink-0">→</span>
                    <span className="text-gray-300">{step}</span>
                  </div>
                ))}
              </div>

              <Link href="/vendor-dashboard"
                className="block w-full py-3 rounded-xl bg-gradient-to-r from-brand-orange to-brand-amber text-black font-bold text-sm mb-4 hover:opacity-90 transition-opacity">
                Access Your Vendor Dashboard →
              </Link>
              <button onClick={() => { setSubmitted(false); setSelected(null); setPayRef(''); setForm(EMPTY_FORM); setRegisteredAt('') }}
                className="text-gray-500 text-sm hover:text-gray-300 transition-colors">
                Register another booth
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  )
}
