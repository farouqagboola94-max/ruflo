'use client'

import { useState } from 'react'

const categories = ['Fashion & Runway', 'Commercial & Brand', 'Influencer & Content Creator', 'Acting & Presenting']
const genders = ['Female', 'Male', 'Non-binary', 'Prefer not to say']

const inputClass = 'w-full bg-[#0d0d0d] border border-white/10 focus:border-[#D4AF37]/50 text-white placeholder-white/20 px-4 py-3.5 text-sm outline-none transition-colors duration-300'
const labelClass = 'block text-[10px] tracking-widest uppercase text-white/40 mb-2'

export default function ApplyPage() {
  const [submitted, setSubmitted] = useState(false)
  const [sending, setSending] = useState(false)
  const [form, setForm] = useState({
    firstName: '', lastName: '', email: '', phone: '',
    age: '', gender: '', category: '',
    height: '', bust: '', waist: '', hips: '',
    instagram: '', portfolio: '', experience: '', message: '',
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSending(true)
    try {
      const body = new URLSearchParams({ 'form-name': 'talent-application', ...form })
      await fetch('/', { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body: body.toString() })
    } catch (_) {}
    setSending(false)
    setSubmitted(true)
  }

  if (submitted) {
    return (
      <section className="min-h-screen flex items-center justify-center px-4 pt-20"
        style={{ background: 'linear-gradient(180deg, #050505 0%, #0a0a08 100%)' }}>
        <div className="text-center max-w-lg">
          <div className="w-20 h-20 border border-[#D4AF37]/30 flex items-center justify-center mx-auto mb-8"
            style={{ background: 'rgba(212,175,55,0.06)' }}>
            <span className="text-[#D4AF37] text-3xl">✦</span>
          </div>
          <p className="text-[#D4AF37] text-[10px] tracking-[0.5em] uppercase mb-4">Application Received</p>
          <h2 className="font-playfair text-4xl sm:text-5xl font-bold text-white mb-6">
            Welcome to the Family,<br />
            <span className="italic" style={{
              background: 'linear-gradient(135deg, #D4AF37, #F0D060)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
            }}>{form.firstName}.</span>
          </h2>
          <p className="text-white/45 leading-relaxed mb-4">
            Your application is with our team. We review every submission personally — you&apos;ll hear from us within 5–7 business days.
          </p>
          <p className="text-white/25 text-sm">Check your inbox at <span className="text-white/45">{form.email}</span></p>
          <button
            onClick={() => setSubmitted(false)}
            className="mt-10 text-[10px] tracking-widest uppercase text-[#D4AF37]/40 hover:text-[#D4AF37] border-b border-[#D4AF37]/15 hover:border-[#D4AF37] pb-1 transition-colors"
          >
            Submit another application
          </button>
        </div>
      </section>
    )
  }

  return (
    <>
      {/* HERO */}
      <section
        className="relative pt-40 pb-20 px-4 overflow-hidden"
        style={{ background: 'linear-gradient(180deg, #050505 0%, #0a0a08 100%)' }}
      >
        <div className="absolute inset-0 opacity-[0.025]" style={{
          backgroundImage: 'repeating-linear-gradient(0deg, #D4AF37 0px, #D4AF37 1px, transparent 1px, transparent 8px), repeating-linear-gradient(90deg, #D4AF37 0px, #D4AF37 0.5px, transparent 0.5px, transparent 40px)',
        }} />
        <div className="relative z-10 max-w-3xl mx-auto">
          <p className="text-[#D4AF37] text-[10px] tracking-[0.5em] uppercase mb-5 hero-animate-1">Join the Roster</p>
          <h1 className="font-playfair text-5xl sm:text-6xl lg:text-7xl font-bold text-white leading-tight mb-6 hero-animate-2">
            Apply to<br />
            <span className="italic" style={{
              background: 'linear-gradient(135deg, #D4AF37 0%, #F0D060 50%, #D4AF37 100%)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
            }}>Join Us.</span>
          </h1>
          <p className="text-white/45 text-lg leading-relaxed mb-10 hero-animate-3">
            Our scouting team reviews every application personally. Selected candidates are
            contacted for a portfolio review and conversation — no cold rejections, ever.
          </p>
          <div className="flex flex-wrap gap-3 hero-animate-4">
            {[
              { icon: '◈', label: 'Fair Pay — Always' },
              { icon: '◆', label: 'Contract Protection' },
              { icon: '✦', label: 'Your Career Matters' },
            ].map((b) => (
              <div key={b.label} className="flex items-center gap-2 px-4 py-2 border border-[#D4AF37]/15"
                style={{ background: 'rgba(212,175,55,0.04)' }}>
                <span className="text-[#D4AF37] text-xs">{b.icon}</span>
                <span className="text-[9px] tracking-[0.3em] uppercase text-white/50">{b.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* WHAT HAPPENS NEXT */}
      <section className="py-16 px-4 border-y border-white/5" style={{ background: '#0a0a08' }}>
        <div className="max-w-3xl mx-auto">
          <p className="text-[#D4AF37] text-[10px] tracking-[0.5em] uppercase mb-10 text-center">The Process</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-[1px]"
            style={{ border: '1px solid rgba(212,175,55,0.08)', background: 'rgba(212,175,55,0.06)' }}>
            {[
              { num: '01', title: 'You Apply', desc: 'Complete this form honestly. Tell us your story — that\'s what we want to hear.' },
              { num: '02', title: 'We Review', desc: 'Every application is read by a real person. We look for potential, not just portfolios.' },
              { num: '03', title: 'Welcome Home', desc: 'Selected talents are invited for a conversation. If it\'s a fit — you\'re with us.' },
            ].map((step, i) => (
              <div key={step.num} className="p-8 relative"
                style={{ background: '#0a0a08', borderRight: i < 2 ? '1px solid rgba(212,175,55,0.08)' : 'none' }}>
                <span className="font-playfair text-5xl font-bold block mb-4 leading-none select-none"
                  style={{ color: 'rgba(212,175,55,0.1)' }}>{step.num}</span>
                <h3 className="font-playfair text-lg font-bold text-white mb-2">{step.title}</h3>
                <p className="text-white/35 text-sm leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FORM */}
      <section className="py-20 px-4" style={{ background: 'linear-gradient(180deg, #0a0a08 0%, #0d0d0a 100%)' }}>
        <form
          name="talent-application"
          data-netlify="true"
          onSubmit={handleSubmit}
          className="max-w-3xl mx-auto space-y-16"
        >
          <input type="hidden" name="form-name" value="talent-application" />

          {/* 01 Personal */}
          <div>
            <div className="flex items-end gap-5 mb-10 pb-5 border-b border-white/5">
              <span className="font-playfair text-5xl font-bold leading-none select-none"
                style={{ color: 'rgba(212,175,55,0.12)' }}>01</span>
              <h2 className="font-playfair text-2xl font-bold text-white">Personal Information</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className={labelClass}>First Name *</label>
                <input type="text" name="firstName" required value={form.firstName}
                  onChange={handleChange} placeholder="Adaeze" className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Last Name *</label>
                <input type="text" name="lastName" required value={form.lastName}
                  onChange={handleChange} placeholder="Okafor" className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Email Address *</label>
                <input type="email" name="email" required value={form.email}
                  onChange={handleChange} placeholder="you@example.com" className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Phone Number *</label>
                <input type="tel" name="phone" required value={form.phone}
                  onChange={handleChange} placeholder="+234 800 000 0000" className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Age *</label>
                <input type="number" name="age" required min="16" max="60" value={form.age}
                  onChange={handleChange} placeholder="e.g. 22" className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Gender</label>
                <select name="gender" value={form.gender} onChange={handleChange}
                  className={inputClass + ' cursor-pointer'}>
                  <option value="" disabled>Select gender</option>
                  {genders.map((g) => (
                    <option key={g} value={g} className="bg-[#0d0d0d]">{g}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* 02 Category */}
          <div>
            <div className="flex items-end gap-5 mb-10 pb-5 border-b border-white/5">
              <span className="font-playfair text-5xl font-bold leading-none select-none"
                style={{ color: 'rgba(212,175,55,0.12)' }}>02</span>
              <h2 className="font-playfair text-2xl font-bold text-white">Talent Category</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {categories.map((cat) => (
                <label key={cat} className="flex items-center gap-4 p-5 border cursor-pointer transition-all duration-300"
                  style={{
                    borderColor: form.category === cat ? 'rgba(212,175,55,0.5)' : 'rgba(255,255,255,0.05)',
                    background: form.category === cat ? 'rgba(212,175,55,0.05)' : 'transparent',
                  }}>
                  <input type="radio" name="category" value={cat} checked={form.category === cat}
                    onChange={handleChange} className="hidden" />
                  <div className="w-3.5 h-3.5 border-2 flex-shrink-0 flex items-center justify-center"
                    style={{ borderColor: form.category === cat ? '#D4AF37' : 'rgba(255,255,255,0.2)' }}>
                    {form.category === cat && <div className="w-1.5 h-1.5 bg-[#D4AF37]" />}
                  </div>
                  <span className="text-sm text-white/65">{cat}</span>
                </label>
              ))}
            </div>
          </div>

          {/* 03 Measurements */}
          <div>
            <div className="flex items-end gap-5 mb-3 pb-5 border-b border-white/5">
              <span className="font-playfair text-5xl font-bold leading-none select-none"
                style={{ color: 'rgba(212,175,55,0.12)' }}>03</span>
              <h2 className="font-playfair text-2xl font-bold text-white">Measurements</h2>
            </div>
            <p className="text-white/25 text-xs mb-8">All measurements in inches unless otherwise stated.</p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-5">
              <div>
                <label className={labelClass}>Height</label>
                <input type="text" name="height" value={form.height} onChange={handleChange}
                  placeholder="5' 9&quot;" className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Bust / Chest</label>
                <input type="text" name="bust" value={form.bust} onChange={handleChange}
                  placeholder='34"' className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Waist</label>
                <input type="text" name="waist" value={form.waist} onChange={handleChange}
                  placeholder='26"' className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Hips</label>
                <input type="text" name="hips" value={form.hips} onChange={handleChange}
                  placeholder='36"' className={inputClass} />
              </div>
            </div>
          </div>

          {/* 04 Portfolio */}
          <div>
            <div className="flex items-end gap-5 mb-10 pb-5 border-b border-white/5">
              <span className="font-playfair text-5xl font-bold leading-none select-none"
                style={{ color: 'rgba(212,175,55,0.12)' }}>04</span>
              <h2 className="font-playfair text-2xl font-bold text-white">Portfolio &amp; Experience</h2>
            </div>
            <div className="space-y-5">
              <div>
                <label className={labelClass}>Instagram Handle</label>
                <input type="text" name="instagram" value={form.instagram} onChange={handleChange}
                  placeholder="@yourhandle" className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Portfolio / Linktree URL</label>
                <input type="url" name="portfolio" value={form.portfolio} onChange={handleChange}
                  placeholder="https://" className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Years of Experience</label>
                <select name="experience" value={form.experience} onChange={handleChange}
                  className={inputClass + ' cursor-pointer'}>
                  <option value="" disabled>Select experience level</option>
                  <option className="bg-[#0d0d0d]" value="none">No experience — I&apos;m just starting out</option>
                  <option className="bg-[#0d0d0d]" value="1">Less than 1 year</option>
                  <option className="bg-[#0d0d0d]" value="1-3">1 – 3 years</option>
                  <option className="bg-[#0d0d0d]" value="3-5">3 – 5 years</option>
                  <option className="bg-[#0d0d0d]" value="5+">5+ years</option>
                </select>
              </div>
              <div>
                <label className={labelClass}>Tell us about yourself *</label>
                <textarea name="message" required rows={6} value={form.message} onChange={handleChange}
                  placeholder="Share your story, what drives you, and why CTL is the right home for your career..."
                  className={inputClass + ' resize-none'} />
              </div>
            </div>
          </div>

          {/* CTL Commitment */}
          <div className="p-6 border border-[#D4AF37]/15" style={{ background: 'rgba(212,175,55,0.03)' }}>
            <p className="text-[#D4AF37] text-[9px] tracking-[0.4em] uppercase mb-3">The CTL Commitment</p>
            <p className="text-white/45 text-sm leading-relaxed">
              When you apply to CTL, you are applying to an agency that puts your welfare first. We
              guarantee fair pay on every booking, contract transparency before you sign anything, and
              a team that is in your corner — always. Lagos talent deserves nothing less.
            </p>
          </div>

          <div className="pt-2">
            <p className="text-white/20 text-xs mb-6">
              By submitting you agree to our{' '}
              <a href="/privacy" className="text-[#D4AF37]/40 hover:text-[#D4AF37] underline underline-offset-2 transition-colors">
                privacy policy
              </a>{' '}
              and consent to CTL storing your data for scouting purposes.
            </p>
            <button
              type="submit"
              disabled={sending}
              className="w-full sm:w-auto px-16 py-5 bg-[#D4AF37] text-black font-bold text-xs tracking-widest uppercase hover:bg-[#F0D060] transition-colors duration-300 disabled:opacity-60"
            >
              {sending ? 'Submitting...' : 'Submit Application'}
            </button>
          </div>
        </form>
      </section>
    </>
  )
}
