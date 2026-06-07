'use client'

import { useState } from 'react'
import Link from 'next/link'

const BOOKING_TYPES = [
  'Editorial / Lookbook',
  'Campaign / Print Ad',
  'TV / Film Commercial',
  'Event / Live Appearance',
  'Brand Ambassador',
  'Runway / Fashion Show',
  'Digital / Social Content',
  'Other',
]

const TALENT_CATEGORIES = [
  'Fashion & Runway',
  'Commercial & Brand',
  'Influencer & Creator',
  'Acting & Presenting',
  'Open to Suggestions',
]

const BUDGET_RANGES = [
  'Under ₦500,000',
  '₦500,000 – ₦1,000,000',
  '₦1,000,000 – ₦3,000,000',
  '₦3,000,000 – ₦5,000,000',
  '₦5,000,000+',
  'To be discussed',
]

interface FormState {
  name: string
  company: string
  role: string
  email: string
  phone: string
  bookingType: string
  projectTitle: string
  startDate: string
  endDate: string
  location: string
  talentCategory: string
  talentCount: string
  talentPreferences: string
  budget: string
  brief: string
  referral: string
}

const EMPTY: FormState = {
  name: '', company: '', role: '', email: '', phone: '',
  bookingType: '', projectTitle: '', startDate: '', endDate: '', location: '',
  talentCategory: '', talentCount: '1', talentPreferences: '',
  budget: '', brief: '', referral: '',
}

const inputClass =
  'w-full bg-[#0d0d0d] border border-white/10 text-white text-sm px-4 py-3 focus:outline-none focus:border-[#D4AF37]/50 focus:bg-[#111] transition-colors placeholder:text-white/20'

const selectClass =
  'w-full bg-[#0d0d0d] border border-white/10 text-white text-sm px-4 py-3 focus:outline-none focus:border-[#D4AF37]/50 transition-colors appearance-none cursor-pointer'

const labelClass = 'block text-[10px] tracking-[0.3em] uppercase text-[#D4AF37]/60 mb-2'

export default function BookingPage() {
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
    if (!form.name || !form.email || !form.company || !form.bookingType || !form.brief) {
      setError('Please fill in all required fields.')
      return
    }
    setError('')
    setLoading(true)
    try {
      const body = new URLSearchParams({
        'form-name': 'booking-inquiry',
        ...Object.fromEntries(Object.entries(form)),
      })
      await fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: body.toString(),
      })
      setSubmitted(true)
    } catch {
      setError('Submission failed. Please try emailing us directly.')
      setLoading(false)
    }
  }

  if (submitted) {
    return (
      <div
        className="min-h-screen flex items-center justify-center px-4"
        style={{ background: 'linear-gradient(135deg, #000 0%, #0a0a0a 100%)' }}
      >
        <div className="max-w-lg text-center">
          <div
            className="w-16 h-16 mx-auto mb-8 flex items-center justify-center"
            style={{ border: '1px solid rgba(212,175,55,0.4)', background: 'rgba(212,175,55,0.06)' }}
          >
            <span
              style={{
                background: 'linear-gradient(135deg, #D4AF37, #F0D060)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                fontSize: '1.75rem',
              }}
            >
              ✦
            </span>
          </div>
          <p className="text-[#D4AF37] text-[10px] tracking-[0.4em] uppercase mb-4">Inquiry Received</p>
          <h2 className="font-playfair text-4xl font-bold text-white mb-6">
            Thank You,<br />
            <span
              className="italic"
              style={{
                background: 'linear-gradient(135deg, #D4AF37, #F0D060)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              {form.name.split(' ')[0]}
            </span>
          </h2>
          <p className="text-white/50 leading-relaxed mb-4">
            We&apos;ve received your booking inquiry for{' '}
            <span className="text-white/80">{form.company}</span>. Our team reviews every request personally and will be in touch within 48 hours.
          </p>
          <p className="text-white/30 text-sm mb-10">
            Confirmation sent to <span className="text-[#D4AF37]/60">{form.email}</span>
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/models"
              className="px-8 py-3.5 bg-[#D4AF37] text-black text-xs font-bold tracking-widest uppercase hover:bg-[#F0D060] transition-colors"
            >
              Browse Our Talent
            </Link>
            <Link
              href="/"
              className="px-8 py-3.5 border border-[#D4AF37]/25 text-[#D4AF37] text-xs tracking-widest uppercase hover:border-[#D4AF37] transition-all"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div
      className="min-h-screen"
      style={{ background: 'linear-gradient(135deg, #000 0%, #0a0a0a 40%, #0d0d07 100%)' }}
    >
      {/* Netlify form detection */}
      <form name="booking-inquiry" data-netlify="true" hidden>
        <input name="name" />
        <input name="company" />
        <input name="role" />
        <input name="email" />
        <input name="phone" />
        <input name="bookingType" />
        <input name="projectTitle" />
        <input name="startDate" />
        <input name="endDate" />
        <input name="location" />
        <input name="talentCategory" />
        <input name="talentCount" />
        <textarea name="talentPreferences" />
        <input name="budget" />
        <textarea name="brief" />
        <input name="referral" />
      </form>

      {/* Header */}
      <div className="pt-[120px] pb-16 px-4 text-center border-b border-[#D4AF37]/8">
        <div className="max-w-3xl mx-auto">
          <p className="text-[#D4AF37] text-[10px] tracking-[0.5em] uppercase mb-4">Catalyst Talents Lagos</p>
          <h1 className="font-playfair text-5xl sm:text-6xl font-bold text-white mb-6">
            Book Talent
            <span className="block w-14 h-px bg-[#D4AF37] mx-auto mt-5" />
          </h1>
          <p className="text-white/45 text-lg leading-relaxed max-w-2xl mx-auto">
            Submit your project brief and we&apos;ll match you with the right talent from our Lagos roster. Every inquiry is reviewed personally by our booking team.
          </p>
        </div>
      </div>

      {/* Process strip */}
      <div
        className="border-b border-[#D4AF37]/8 py-8 px-4"
        style={{ background: 'rgba(212,175,55,0.02)' }}
      >
        <div className="max-w-3xl mx-auto grid grid-cols-3 gap-6 text-center">
          {[
            { step: '01', label: 'Submit Brief' },
            { step: '02', label: 'We Match Talent' },
            { step: '03', label: 'Confirm & Contract' },
          ].map(({ step, label }) => (
            <div key={step}>
              <span
                className="font-playfair text-2xl font-bold"
                style={{
                  background: 'linear-gradient(135deg, #D4AF37, #F0D060)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                {step}
              </span>
              <p className="text-white/35 text-xs tracking-widest uppercase mt-1">{label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Form */}
      <div className="max-w-3xl mx-auto px-4 py-16">
        <form onSubmit={handleSubmit} noValidate>

          {/* Section 1: Your Details */}
          <fieldset className="mb-12">
            <legend className="font-playfair text-xl font-bold text-white mb-8 flex items-center gap-4">
              <span
                style={{
                  background: 'linear-gradient(135deg, #D4AF37, #F0D060)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                01
              </span>
              Your Details
              <span className="flex-1 h-px bg-[#D4AF37]/10" />
            </legend>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className={labelClass}>Full Name <span className="text-[#D4AF37]">*</span></label>
                <input type="text" className={inputClass} placeholder="Your full name" value={form.name} onChange={set('name')} required />
              </div>
              <div>
                <label className={labelClass}>Company / Brand <span className="text-[#D4AF37]">*</span></label>
                <input type="text" className={inputClass} placeholder="Company or brand name" value={form.company} onChange={set('company')} required />
              </div>
              <div>
                <label className={labelClass}>Your Role</label>
                <input type="text" className={inputClass} placeholder="e.g. Creative Director, Marketing Manager" value={form.role} onChange={set('role')} />
              </div>
              <div>
                <label className={labelClass}>Email Address <span className="text-[#D4AF37]">*</span></label>
                <input type="email" className={inputClass} placeholder="your@email.com" value={form.email} onChange={set('email')} required />
              </div>
              <div className="sm:col-span-2">
                <label className={labelClass}>Phone Number</label>
                <input type="tel" className={inputClass} placeholder="+234..." value={form.phone} onChange={set('phone')} />
              </div>
            </div>
          </fieldset>

          {/* Section 2: Project Details */}
          <fieldset className="mb-12">
            <legend className="font-playfair text-xl font-bold text-white mb-8 flex items-center gap-4">
              <span
                style={{
                  background: 'linear-gradient(135deg, #D4AF37, #F0D060)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                02
              </span>
              Project Details
              <span className="flex-1 h-px bg-[#D4AF37]/10" />
            </legend>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="sm:col-span-2 relative">
                <label className={labelClass}>Type of Booking <span className="text-[#D4AF37]">*</span></label>
                <div className="relative">
                  <select className={selectClass} value={form.bookingType} onChange={set('bookingType')} required>
                    <option value="" disabled>Select booking type</option>
                    {BOOKING_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-[#D4AF37]/40 text-xs">&#9660;</div>
                </div>
              </div>
              <div className="sm:col-span-2">
                <label className={labelClass}>Project / Campaign Title</label>
                <input type="text" className={inputClass} placeholder="What is this project called?" value={form.projectTitle} onChange={set('projectTitle')} />
              </div>
              <div>
                <label className={labelClass}>Start Date</label>
                <input type="date" className={inputClass} value={form.startDate} onChange={set('startDate')} />
              </div>
              <div>
                <label className={labelClass}>End Date</label>
                <input type="date" className={inputClass} value={form.endDate} onChange={set('endDate')} />
              </div>
              <div className="sm:col-span-2">
                <label className={labelClass}>Shoot / Event Location</label>
                <input type="text" className={inputClass} placeholder="Lagos, Abuja, or international" value={form.location} onChange={set('location')} />
              </div>
            </div>
          </fieldset>

          {/* Section 3: Talent Requirements */}
          <fieldset className="mb-12">
            <legend className="font-playfair text-xl font-bold text-white mb-8 flex items-center gap-4">
              <span
                style={{
                  background: 'linear-gradient(135deg, #D4AF37, #F0D060)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                03
              </span>
              Talent Requirements
              <span className="flex-1 h-px bg-[#D4AF37]/10" />
            </legend>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="relative">
                <label className={labelClass}>Talent Category</label>
                <div className="relative">
                  <select className={selectClass} value={form.talentCategory} onChange={set('talentCategory')}>
                    <option value="">Select category</option>
                    {TALENT_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-[#D4AF37]/40 text-xs">&#9660;</div>
                </div>
              </div>
              <div>
                <label className={labelClass}>Number of Talents Needed</label>
                <input
                  type="number"
                  min="1"
                  max="50"
                  className={inputClass}
                  placeholder="e.g. 2"
                  value={form.talentCount}
                  onChange={set('talentCount')}
                />
              </div>
              <div className="sm:col-span-2">
                <label className={labelClass}>Specific Preferences</label>
                <textarea
                  className={`${inputClass} resize-none`}
                  rows={3}
                  placeholder="Height, look, style, skin tone, age range, specific talents in mind..."
                  value={form.talentPreferences}
                  onChange={set('talentPreferences')}
                />
              </div>
            </div>
          </fieldset>

          {/* Section 4: Budget & Brief */}
          <fieldset className="mb-12">
            <legend className="font-playfair text-xl font-bold text-white mb-8 flex items-center gap-4">
              <span
                style={{
                  background: 'linear-gradient(135deg, #D4AF37, #F0D060)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                04
              </span>
              Budget &amp; Brief
              <span className="flex-1 h-px bg-[#D4AF37]/10" />
            </legend>

            <div className="grid grid-cols-1 gap-5">
              <div className="relative">
                <label className={labelClass}>Budget Range</label>
                <div className="relative">
                  <select className={selectClass} value={form.budget} onChange={set('budget')}>
                    <option value="">Select budget range</option>
                    {BUDGET_RANGES.map(b => <option key={b} value={b}>{b}</option>)}
                  </select>
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-[#D4AF37]/40 text-xs">&#9660;</div>
                </div>
              </div>
              <div>
                <label className={labelClass}>Project Brief <span className="text-[#D4AF37]">*</span></label>
                <textarea
                  className={`${inputClass} resize-none`}
                  rows={6}
                  placeholder="Describe your project — mood, vision, deliverables, any references. The more detail, the faster we can match you."
                  value={form.brief}
                  onChange={set('brief')}
                  required
                />
              </div>
              <div>
                <label className={labelClass}>How Did You Hear About Us?</label>
                <input type="text" className={inputClass} placeholder="Referral, Instagram, event, etc." value={form.referral} onChange={set('referral')} />
              </div>
            </div>
          </fieldset>

          {/* Privacy note */}
          <p className="text-white/20 text-xs leading-relaxed mb-8">
            Your information is kept strictly confidential and used only to process your booking inquiry. We do not share client details with third parties.
          </p>

          {error && (
            <p className="text-red-400 text-sm mb-6 px-4 py-3 border border-red-400/20 bg-red-400/5">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-5 bg-[#D4AF37] text-black text-xs font-bold tracking-[0.3em] uppercase hover:bg-[#F0D060] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Sending…' : 'Submit Booking Inquiry'}
          </button>
        </form>

        {/* Alternate contact */}
        <div className="mt-12 pt-10 border-t border-white/5 text-center">
          <p className="text-white/25 text-xs uppercase tracking-widest mb-4">Prefer to talk first?</p>
          <Link
            href="/contact"
            className="text-[#D4AF37]/50 hover:text-[#D4AF37] text-sm transition-colors border-b border-[#D4AF37]/15 hover:border-[#D4AF37] pb-0.5"
          >
            Send us a message via our contact page &rarr;
          </Link>
        </div>
      </div>
    </div>
  )
}
