'use client'

import { useState } from 'react'

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false)
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
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
          <p className="text-gold text-xs tracking-[0.5em] uppercase mb-4">Get in Touch</p>
          <h1 className="font-playfair text-5xl sm:text-7xl font-bold text-white mb-4">Contact Us</h1>
          <p className="text-white/40 leading-relaxed">
            For bookings, press enquiries, partnerships, or general questions — we'd love to hear from you.
          </p>
        </div>
      </section>

      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-5 gap-16">

          {/* Info column */}
          <div className="lg:col-span-2 space-y-12">
            <div>
              <h3 className="font-playfair text-2xl font-bold text-white mb-6">Catalyst Talents Lagos</h3>
              <div className="space-y-4 text-sm">
                <div className="flex gap-4">
                  <span className="text-gold mt-0.5">◈</span>
                  <div>
                    <p className="text-white/70">Lagos Island</p>
                    <p className="text-white/40">Lagos, Nigeria</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <span className="text-gold mt-0.5">◉</span>
                  <div>
                    <a
                      href="mailto:info@catalysttalentslagos.com"
                      className="text-white/70 hover:text-gold transition-colors"
                    >
                      info@catalysttalentslagos.com
                    </a>
                  </div>
                </div>
                <div className="flex gap-4">
                  <span className="text-gold mt-0.5">✦</span>
                  <div>
                    <a href="tel:+2348000000000" className="text-white/70 hover:text-gold transition-colors">
                      +234 800 000 0000
                    </a>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h4 className="text-xs tracking-[0.3em] uppercase text-gold mb-4">Office Hours</h4>
              <div className="space-y-2 text-sm text-white/40">
                <p>Monday – Friday: 9am – 6pm WAT</p>
                <p>Saturday: 10am – 2pm WAT</p>
                <p>Sunday: Closed</p>
              </div>
            </div>

            <div>
              <h4 className="text-xs tracking-[0.3em] uppercase text-gold mb-4">Follow Us</h4>
              <div className="flex flex-col gap-3">
                {['Instagram', 'TikTok', 'Twitter / X', 'LinkedIn'].map((s) => (
                  <a
                    key={s}
                    href="#"
                    className="text-sm text-white/40 hover:text-gold transition-colors flex items-center gap-2"
                  >
                    <span className="text-gold text-xs">→</span> {s}
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Form column */}
          <div className="lg:col-span-3">
            {submitted ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-16">
                <div className="w-16 h-16 rounded-full bg-gold/10 border border-gold/30 flex items-center justify-center mb-6">
                  <span className="text-gold text-2xl">✓</span>
                </div>
                <h3 className="font-playfair text-2xl font-bold text-white mb-2">Message Sent</h3>
                <p className="text-white/40 text-sm">
                  Thank you for reaching out. We'll get back to you within 24–48 hours.
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="mt-8 text-xs tracking-widest uppercase text-gold/50 hover:text-gold border-b border-gold/20 hover:border-gold pb-1 transition-colors"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className={labelClass}>Full Name *</label>
                    <input
                      type="text"
                      name="name"
                      required
                      value={form.name}
                      onChange={handleChange}
                      placeholder="Your name"
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
                </div>
                <div>
                  <label className={labelClass}>Subject *</label>
                  <select
                    name="subject"
                    required
                    value={form.subject}
                    onChange={handleChange}
                    className={inputClass + ' cursor-pointer'}
                  >
                    <option value="" disabled>Select a subject</option>
                    <option className="bg-dark-200" value="booking">Book a Model / Talent</option>
                    <option className="bg-dark-200" value="partnership">Brand Partnership</option>
                    <option className="bg-dark-200" value="press">Press & Media</option>
                    <option className="bg-dark-200" value="general">General Enquiry</option>
                  </select>
                </div>
                <div>
                  <label className={labelClass}>Message *</label>
                  <textarea
                    name="message"
                    required
                    rows={7}
                    value={form.message}
                    onChange={handleChange}
                    placeholder="Tell us what you need..."
                    className={inputClass + ' resize-none'}
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-4 bg-gold text-black font-bold text-sm tracking-widest uppercase hover:bg-gold-light transition-colors duration-300"
                >
                  Send Message
                </button>
              </form>
            )}
          </div>
        </div>
      </section>
    </>
  )
}
