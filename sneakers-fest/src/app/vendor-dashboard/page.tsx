'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

type VendorRecord = {
  ref:          string
  email:        string
  businessName: string
  contactName:  string
  phone:        string
  instagram:    string
  category:     string
  description:  string
  tier:         string
  tierId:       string
  size:         string
  price:        number
  registeredAt: string
}

const CHECKLIST = [
  { id: 'save-page',   group: 'Before Event',         label: 'Bookmark this vendor dashboard' },
  { id: 'inventory',   group: 'Before Event',         label: 'Confirm product inventory is ready' },
  { id: 'display',     group: 'Before Event',         label: 'Prepare branded display materials' },
  { id: 'float',       group: 'Before Event',         label: 'Arrange float / change for cash sales' },
  { id: 'power',       group: 'Before Event',         label: 'Pack power extension if needed' },
  { id: 'arrive-11',   group: 'Setup Day (Dec 11)',   label: 'Arrive between 8 AM – 8 PM' },
  { id: 'id-ref',      group: 'Setup Day (Dec 11)',   label: 'Bring ID + booking reference' },
  { id: 'wristbands',  group: 'Setup Day (Dec 11)',   label: 'Collect wristbands at vendor check-in' },
  { id: 'setup-done',  group: 'Setup Day (Dec 11)',   label: 'Booth fully set up before 8 PM' },
  { id: 'arrive-12',   group: 'Event Days (Dec 12–13)', label: 'Arrive by 8:30 AM (doors open 10 AM)' },
  { id: 'tablecloth',  group: 'Event Days (Dec 12–13)', label: 'Branded tablecloth / setup in place' },
  { id: 'staff-bands', group: 'Event Days (Dec 12–13)', label: 'All staff wearing wristbands' },
  { id: 'contact-coord', group: 'Event Days (Dec 12–13)', label: 'Coordinator number saved on your phone' },
]

const TIMELINE = [
  { date: 'Dec 11',  day: 'Setup Day',  time: '8 AM – 8 PM',    note: 'Vendor arrival, booth setup, wristband collection', active: false },
  { date: 'Dec 12',  day: 'Day One',    time: '10 AM – 8 PM',   note: 'Vendor floor open · Main stage · Sneaker showcase',  active: true },
  { date: 'Dec 13',  day: 'Day Two',    time: '10 AM – 7 PM',   note: 'Vendor floor · Panel sessions · Closing ceremony',   active: true },
]

export default function VendorDashboardPage() {
  const [view, setView]         = useState<'login' | 'dashboard'>('login')
  const [vendor, setVendor]     = useState<VendorRecord | null>(null)
  const [loginEmail, setLoginEmail] = useState('')
  const [loginRef, setLoginRef]     = useState('')
  const [error, setError]           = useState('')
  const [checked, setChecked]       = useState<Record<string, boolean>>({})

  // Restore checklist state
  useEffect(() => {
    if (vendor) {
      try {
        const saved = JSON.parse(localStorage.getItem(`sf_checklist_${vendor.ref}`) || '{}')
        setChecked(saved)
      } catch {}
    }
  }, [vendor])

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    try {
      const vendors: VendorRecord[] = JSON.parse(localStorage.getItem('sf_vendors') || '[]')
      const match = vendors.find(
        v => v.email.toLowerCase() === loginEmail.toLowerCase().trim() &&
             v.ref.trim() === loginRef.trim()
      )
      if (match) {
        setVendor(match)
        setView('dashboard')
      } else {
        setError('No registration found for that email and reference. Make sure you registered on this device, or contact us to verify your booking.')
      }
    } catch {
      setError('Something went wrong. Please try again.')
    }
  }

  const toggleCheck = (id: string) => {
    if (!vendor) return
    const next = { ...checked, [id]: !checked[id] }
    setChecked(next)
    try {
      localStorage.setItem(`sf_checklist_${vendor.ref}`, JSON.stringify(next))
    } catch {}
  }

  const daysToEvent = Math.ceil(
    (new Date('2026-12-12').getTime() - Date.now()) / (1000 * 60 * 60 * 24)
  )

  const checkedCount = CHECKLIST.filter(item => checked[item.id]).length

  // Group checklist by group
  const groups = Array.from(new Set(CHECKLIST.map(i => i.group)))

  if (view === 'login') {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 py-16">
        <div className="w-full max-w-md">
          <div className="text-center mb-10">
            <div className="text-4xl mb-4">🏪</div>
            <h1 className="font-display text-4xl text-white mb-2">VENDOR PORTAL</h1>
            <p className="text-gray-400 text-sm">Access your booth details, event timeline, and pre-event checklist.</p>
          </div>

          <div className="bg-brand-gray rounded-3xl p-8 border border-white/5">
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-sm text-gray-400 mb-1.5">Registration Email</label>
                <input
                  type="email" required placeholder="you@brand.com"
                  value={loginEmail} onChange={e => setLoginEmail(e.target.value)}
                  className="w-full px-4 py-3 bg-brand-dark border border-white/10 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-brand-orange text-sm"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1.5">Booking Reference</label>
                <input
                  type="text" required placeholder="SF-VND-..."
                  value={loginRef} onChange={e => setLoginRef(e.target.value)}
                  className="w-full px-4 py-3 bg-brand-dark border border-white/10 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-brand-orange font-mono text-sm"
                />
                <p className="text-xs text-gray-600 mt-1">Found on your payment confirmation screen</p>
              </div>

              {error && (
                <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-3">
                  <p className="text-red-400 text-xs leading-relaxed">{error}</p>
                  <p className="text-gray-500 text-xs mt-1">
                    Need help? Email <span className="text-gray-300">vendors@sneakersfest.ng</span>
                  </p>
                </div>
              )}

              <button type="submit"
                className="w-full py-4 rounded-xl bg-gradient-to-r from-brand-orange to-brand-amber text-black font-bold text-lg hover:opacity-90 transition-opacity">
                Access Dashboard
              </button>
            </form>
          </div>

          <p className="text-center mt-6 text-gray-600 text-sm">
            Not registered yet?{' '}
            <Link href="/vendors" className="text-brand-orange hover:underline">Secure your booth →</Link>
          </p>
        </div>
      </div>
    )
  }

  // Dashboard view
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">

      {/* Welcome header */}
      <div className="mb-10">
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div>
            <p className="text-brand-orange text-sm font-semibold uppercase tracking-wider mb-1">Vendor Dashboard</p>
            <h1 className="font-display text-4xl sm:text-5xl text-white">{vendor!.businessName.toUpperCase()}</h1>
            <p className="text-gray-400 mt-1">{vendor!.contactName} · {vendor!.category}</p>
          </div>
          <div className="text-right">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-neon/10 border border-brand-neon/30 mb-2">
              <span className="w-2 h-2 rounded-full bg-brand-neon" />
              <span className="text-brand-neon text-xs font-semibold uppercase tracking-wider">Confirmed</span>
            </div>
            <p className="text-gray-500 text-sm">{daysToEvent > 0 ? `${daysToEvent} days to event` : 'Event is here!'}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">

        {/* Booth details */}
        <div className="lg:col-span-2 bg-brand-gray rounded-3xl p-6 border border-white/5">
          <h2 className="font-display text-xl text-white mb-5">BOOTH DETAILS</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {[
              { label: 'Booth Type',   value: vendor!.tier },
              { label: 'Size',         value: vendor!.size },
              { label: 'Category',     value: vendor!.category },
              { label: 'Amount Paid',  value: `₦${vendor!.price.toLocaleString()}` },
              { label: 'Zone',         value: 'TBD — Nov 2026' },
              { label: 'Wristbands',   value: vendor!.tierId === 'standard' ? '2 passes' : vendor!.tierId === 'double' ? '4 passes' : '6 passes' },
            ].map(({ label, value }) => (
              <div key={label} className="bg-brand-dark rounded-xl p-3 border border-white/5">
                <p className="text-xs text-gray-500 uppercase tracking-wider mb-0.5">{label}</p>
                <p className="text-white font-semibold text-sm">{value}</p>
              </div>
            ))}
          </div>
          <div className="mt-4 bg-brand-dark rounded-xl p-3 border border-white/5">
            <p className="text-xs text-gray-500 uppercase tracking-wider mb-0.5">Booking Reference</p>
            <p className="text-brand-orange font-mono font-semibold">{vendor!.ref}</p>
          </div>
          {vendor!.instagram && (
            <div className="mt-3 bg-brand-dark rounded-xl p-3 border border-white/5">
              <p className="text-xs text-gray-500 uppercase tracking-wider mb-0.5">Instagram</p>
              <p className="text-white text-sm">{vendor!.instagram}</p>
            </div>
          )}
        </div>

        {/* Checklist progress */}
        <div className="bg-brand-gray rounded-3xl p-6 border border-white/5">
          <h2 className="font-display text-xl text-white mb-2">CHECKLIST</h2>
          <div className="mb-4">
            <div className="flex justify-between text-sm mb-1">
              <span className="text-gray-400">{checkedCount} / {CHECKLIST.length} done</span>
              <span className="text-brand-orange font-semibold">{Math.round((checkedCount / CHECKLIST.length) * 100)}%</span>
            </div>
            <div className="h-1.5 rounded-full bg-brand-dark overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-brand-orange to-brand-amber transition-all duration-300"
                style={{ width: `${(checkedCount / CHECKLIST.length) * 100}%` }}
              />
            </div>
          </div>
          {checkedCount === CHECKLIST.length && (
            <div className="bg-brand-neon/10 border border-brand-neon/20 rounded-xl p-2 mb-3 text-center">
              <p className="text-brand-neon text-xs font-semibold">You're fully prepared! 🎉</p>
            </div>
          )}
          <p className="text-gray-500 text-xs">Scroll down to complete your checklist</p>
        </div>
      </div>

      {/* Event timeline */}
      <div className="bg-brand-gray rounded-3xl p-6 border border-white/5 mb-6">
        <h2 className="font-display text-xl text-white mb-6">EVENT TIMELINE</h2>
        <div className="space-y-4">
          {TIMELINE.map((item, i) => (
            <div key={i} className={`flex gap-4 p-4 rounded-2xl border ${
              item.active ? 'border-brand-orange/20 bg-brand-orange/5' : 'border-white/5 bg-brand-dark'
            }`}>
              <div className="text-center min-w-[52px]">
                <div className={`font-display text-lg leading-none ${
                  item.active ? 'text-brand-orange' : 'text-gray-400'
                }`}>{item.date}</div>
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="text-white font-semibold text-sm">{item.day}</span>
                  {item.active && <span className="text-xs px-2 py-0.5 rounded-full bg-brand-orange/20 text-brand-orange">Event Day</span>}
                </div>
                <p className="text-brand-amber text-xs font-mono mb-1">{item.time}</p>
                <p className="text-gray-400 text-xs">{item.note}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Full checklist */}
      <div className="bg-brand-gray rounded-3xl p-6 border border-white/5 mb-6">
        <h2 className="font-display text-xl text-white mb-6">PRE-EVENT CHECKLIST</h2>
        <div className="space-y-6">
          {groups.map(group => (
            <div key={group}>
              <p className="text-xs text-gray-500 uppercase tracking-wider mb-3">{group}</p>
              <div className="space-y-2">
                {CHECKLIST.filter(item => item.group === group).map(item => (
                  <button
                    key={item.id}
                    onClick={() => toggleCheck(item.id)}
                    className={`w-full flex items-center gap-3 p-3 rounded-xl border text-left transition-all ${
                      checked[item.id]
                        ? 'border-brand-orange/30 bg-brand-orange/5'
                        : 'border-white/5 bg-brand-dark hover:border-white/10'
                    }`}
                  >
                    <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center flex-shrink-0 transition-all ${
                      checked[item.id] ? 'border-brand-orange bg-brand-orange' : 'border-white/20'
                    }`}>
                      {checked[item.id] && (
                        <svg className="w-3 h-3 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </div>
                    <span className={`text-sm ${
                      checked[item.id] ? 'line-through text-gray-500' : 'text-gray-200'
                    }`}>{item.label}</span>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* What's provided + contacts */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
        <div className="bg-brand-gray rounded-3xl p-6 border border-white/5">
          <h2 className="font-display text-lg text-white mb-4">WHAT'S PROVIDED</h2>
          <ul className="space-y-2">
            {[
              vendor!.tierId === 'standard' ? 'One 6ft table + 2 chairs' : vendor!.tierId === 'double' ? 'Two 6ft tables + 4 chairs' : 'Custom booth structure options',
              `${vendor!.tierId === 'standard' ? 2 : vendor!.tierId === 'double' ? 4 : 6} vendor wristbands`,
              'Name on official vendor floor map',
              'Event WiFi access',
              '24-hour security coverage',
              'Shared vendor rest area',
            ].map(item => (
              <li key={item} className="flex items-center gap-2 text-sm">
                <span className="text-brand-neon text-xs">✓</span>
                <span className="text-gray-300">{item}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-brand-gray rounded-3xl p-6 border border-white/5">
          <h2 className="font-display text-lg text-white mb-4">KEY CONTACTS</h2>
          <div className="space-y-3">
            {[
              { role: 'Vendor Coordinator', contact: 'vendors@sneakersfest.ng' },
              { role: 'WhatsApp (Vendors)', contact: 'wa.me/2347084111516' },
              { role: 'Event Instagram',    contact: '@sneakersfest' },
            ].map(({ role, contact }) => (
              <div key={role} className="bg-brand-dark rounded-xl p-3 border border-white/5">
                <p className="text-xs text-gray-500 uppercase tracking-wider">{role}</p>
                <p className="text-white text-sm font-medium mt-0.5">{contact}</p>
              </div>
            ))}
          </div>
          <div className="mt-4 p-3 rounded-xl bg-brand-orange/5 border border-brand-orange/20">
            <p className="text-xs text-gray-400 leading-relaxed">
              All vendor communications go through the coordinator. Response within 24 hours.
            </p>
          </div>
        </div>
      </div>

      {/* Important rules */}
      <div className="bg-brand-gray rounded-3xl p-6 border border-white/5 mb-8">
        <h2 className="font-display text-lg text-white mb-4">IMPORTANT NOTICES</h2>
        <div className="space-y-2">
          {[
            'Booth payments are non-refundable. Transfers require written approval.',
            'Booth zone assignments released November 2026 via email and this dashboard.',
            'All vendors must be fully set up by 9 AM on December 12 — no exceptions.',
            'Electricity points are limited. Bring your own extension cable.',
            'You are responsible for your own cash handling and product security.',
            'Sneakers Fest is not liable for theft, damage, or unsold inventory.',
          ].map(notice => (
            <div key={notice} className="flex items-start gap-2 text-sm">
              <span className="text-brand-amber mt-0.5 flex-shrink-0">!</span>
              <span className="text-gray-400">{notice}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Footer actions */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <Link href="/contact" className="text-brand-orange text-sm hover:underline">Contact the team →</Link>
        <button
          onClick={() => { setView('login'); setVendor(null); setLoginEmail(''); setLoginRef('') }}
          className="text-gray-600 text-sm hover:text-gray-400 transition-colors"
        >
          Sign out
        </button>
      </div>
    </div>
  )
}
