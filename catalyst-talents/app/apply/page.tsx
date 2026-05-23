'use client'

import { useState } from 'react'

const categories = ['Fashion & Runway', 'Commercial & Brand', 'Influencer & Content Creator', 'Acting & Presenting']
const genders = ['Female', 'Male', 'Non-binary', 'Prefer not to say']

export default function ApplyPage() {
  const [submitted, setSubmitted] = useState(false)
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    age: '',
    gender: '',
    category: '',
    height: '',
    bust: '',
    waist: '',
    hips: '',
    instagram: '',
    portfolio: '',
    experience: '',
    message: '',
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
  }

  if (submitted) {
    return (
      <section className="min-h-screen flex items-center justify-center px-4 pt-20">
        <div className="text-center max-w-lg">
          <div className="w-20 h-20 rounded-full bg-gold/10 border border-gold/30 flex items-center justify-center mx-auto mb-8">
            <span className="text-gold text-3xl">✓</span>
          </div>
          <h2 className="font-playfair text-4xl font-bold text-white mb-4">
            Application Received
          </h2>
          <p className="text-white/50 leading-relaxed">
            Thank you, <span className="text-gold">{form.firstName}</span>. We've received your application
            and our team will review it within 5–7 business days. Keep an eye on your inbox.
          </p>
          <button
            onClick={() => setSubmitted(false)}
            className="mt-10 text-xs tracking-widest uppercase text-gold/50 hover:text-gold border-b border-gold/20 hover:border-gold pb-1 transition-colors"
          >
            Submit another application
          </button>
        </div>
      </section>
    )
  }

  const inputClass =
    'w-full bg-dark-200 border border-white/10 focus:border-gold/50 text-white placeholder-white/25 px-4 py-3 text-sm outline-none transition-colors duration-300'
  const labelClass = 'block text-xs tracking-widest uppercase text-white/40 mb-2'

  return (
    <>
      {/* HEADER */}
      <section
        className="pt-40 pb-16 px-4"
        style={{ background: 'linear-gradient(180deg, #050505 0%, #0d0d0d 100%)' }}
      >
        <div className="max-w-3xl mx-auto">
          <p className="text-gold text-xs tracking-[0.5em] uppercase mb-4">Join the Roster</p>
          <h1 className="font-playfair text-5xl sm:text-6xl font-bold text-white mb-4">
            Apply to Join
          </h1>
          <p className="text-white/40 leading-relaxed">
            Fill in the form below. Our scouting team reviews every application personally.
            Selected candidates will be contacted for a portfolio review and interview.
          </p>
        </div>
      </section>

      {/* FORM */}
      <section className="py-16 px-4">
        <form onSubmit={handleSubmit} className="max-w-3xl mx-auto space-y-12">

          {/* Personal Info */}
          <div>
            <h2 className="font-playfair text-2xl font-bold text-white mb-8 pb-4 border-b border-white/5">
              Personal Information
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className={labelClass}>First Name *</label>
                <input
                  type="text"
                  name="firstName"
                  required
                  value={form.firstName}
                  onChange={handleChange}
                  placeholder="Adaeze"
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass}>Last Name *</label>
                <input
                  type="text"
                  name="lastName"
                  required
                  value={form.lastName}
                  onChange={handleChange}
                  placeholder="Okafor"
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass}>Email Address *</label>
                <input
                  type="email"
                  name="email"
                  required
                  value={form.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass}>Phone Number *</label>
                <input
                  type="tel"
                  name="phone"
                  required
                  value={form.phone}
                  onChange={handleChange}
                  placeholder="+234 800 000 0000"
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass}>Age *</label>
                <input
                  type="number"
                  name="age"
                  required
                  min="16"
                  max="60"
                  value={form.age}
                  onChange={handleChange}
                  placeholder="e.g. 22"
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass}>Gender</label>
                <select
                  name="gender"
                  value={form.gender}
                  onChange={handleChange}
                  className={inputClass + ' cursor-pointer'}
                >
                  <option value="" disabled>Select gender</option>
                  {genders.map((g) => (
                    <option key={g} value={g} className="bg-dark-200">{g}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Category */}
          <div>
            <h2 className="font-playfair text-2xl font-bold text-white mb-8 pb-4 border-b border-white/5">
              Talent Category
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {categories.map((cat) => (
                <label
                  key={cat}
                  className={`flex items-center gap-4 p-4 border cursor-pointer transition-all duration-300 ${
                    form.category === cat
                      ? 'border-gold/50 bg-gold/5'
                      : 'border-white/5 hover:border-white/20'
                  }`}
                >
                  <input
                    type="radio"
                    name="category"
                    value={cat}
                    checked={form.category === cat}
                    onChange={handleChange}
                    className="hidden"
                  />
                  <div
                    className={`w-4 h-4 rounded-full border-2 flex-shrink-0 ${
                      form.category === cat ? 'border-gold bg-gold' : 'border-white/20'
                    }`}
                  />
                  <span className="text-sm text-white/70">{cat}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Measurements */}
          <div>
            <h2 className="font-playfair text-2xl font-bold text-white mb-2 pb-4 border-b border-white/5">
              Measurements
            </h2>
            <p className="text-white/30 text-xs mb-8">All measurements in inches unless otherwise stated.</p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
              <div>
                <label className={labelClass}>Height</label>
                <input
                  type="text"
                  name="height"
                  value={form.height}
                  onChange={handleChange}
                  placeholder='5\' 9"'
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass}>Bust / Chest</label>
                <input
                  type="text"
                  name="bust"
                  value={form.bust}
                  onChange={handleChange}
                  placeholder='34"'
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass}>Waist</label>
                <input
                  type="text"
                  name="waist"
                  value={form.waist}
                  onChange={handleChange}
                  placeholder='26"'
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass}>Hips</label>
                <input
                  type="text"
                  name="hips"
                  value={form.hips}
                  onChange={handleChange}
                  placeholder='36"'
                  className={inputClass}
                />
              </div>
            </div>
          </div>

          {/* Portfolio */}
          <div>
            <h2 className="font-playfair text-2xl font-bold text-white mb-8 pb-4 border-b border-white/5">
              Portfolio & Experience
            </h2>
            <div className="space-y-6">
              <div>
                <label className={labelClass}>Instagram Handle</label>
                <input
                  type="text"
                  name="instagram"
                  value={form.instagram}
                  onChange={handleChange}
                  placeholder="@yourhandle"
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass}>Portfolio / Linktree URL</label>
                <input
                  type="url"
                  name="portfolio"
                  value={form.portfolio}
                  onChange={handleChange}
                  placeholder="https://"
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass}>Years of Experience</label>
                <select
                  name="experience"
                  value={form.experience}
                  onChange={handleChange}
                  className={inputClass + ' cursor-pointer'}
                >
                  <option value="" disabled>Select experience level</option>
                  <option className="bg-dark-200" value="none">No experience — I'm just starting out</option>
                  <option className="bg-dark-200" value="1">Less than 1 year</option>
                  <option className="bg-dark-200" value="1-3">1 – 3 years</option>
                  <option className="bg-dark-200" value="3-5">3 – 5 years</option>
                  <option className="bg-dark-200" value="5+">5+ years</option>
                </select>
              </div>
              <div>
                <label className={labelClass}>Tell us about yourself *</label>
                <textarea
                  name="message"
                  required
                  rows={5}
                  value={form.message}
                  onChange={handleChange}
                  placeholder="Share your story, what drives you, and why Catalyst Talents Lagos is the right home for your career..."
                  className={inputClass + ' resize-none'}
                />
              </div>
            </div>
          </div>

          <div className="pt-4">
            <p className="text-white/25 text-xs mb-6">
              By submitting this form you agree to our privacy policy and consent to Catalyst Talents Lagos
              storing and processing your data for scouting purposes.
            </p>
            <button
              type="submit"
              className="w-full sm:w-auto px-16 py-5 bg-gold text-black font-bold text-sm tracking-widest uppercase hover:bg-gold-light transition-colors duration-300"
            >
              Submit Application
            </button>
          </div>
        </form>
      </section>
    </>
  )
}
