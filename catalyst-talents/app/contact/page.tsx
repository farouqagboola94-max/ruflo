'use client'

import { useState } from 'react'

const inputClass = 'w-full bg-[#0d0d0d] border border-white/10 focus:border-[#D4AF37]/50 text-white placeholder-white/20 px-4 py-3.5 text-sm outline-none transition-colors duration-300'
const labelClass = 'block text-[10px] tracking-widest uppercase text-white/40 mb-2'

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false)
  const [sending, setSending] = useState(false)
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSending(true)
    try {
      const body = new URLSearchParams({ 'form-name': 'contact', ...form })
      await fetch('/', { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body: body.toString() })
    } catch (_) {}
    setSending(false)
    setSubmitted(true)
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
          <p className="text-[#D4AF37] text-[10px] tracking-[0.5em] uppercase mb-5 hero-animate-1">Get in Touch</p>
          <h1 className="font-playfair text-5xl sm:text-6xl lg:text-7xl font-bold text-white leading-tight mb-6 hero-animate-2">
            We&apos;re<br />
            <span className="italic" style={{
              background: 'linear-gradient(135deg, #D4AF37 0%, #F0D060 50%, #D4AF37 100%)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
            }}>Listening.</span>
          </h1>
          <p className="text-white/45 text-lg leading-relaxed hero-animate-3">
            For bookings, press enquiries, brand partnerships, or general questions —
            reach out and we will get back to you personally.
          </p>
        </div>
      </section>

      {/* CONTACT CARDS */}
      <section className="py-12 px-4" style={{ background: '#0a0a08' }}>
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-[1px]" style={{ background: 'rgba(212,175,55,0.08)' }}>
            {[
              { icon: '◈', label: 'Office', lines: ['Lagos Island', 'Lagos, Nigeria'] },
              { icon: '✦', label: 'Email', lines: ['info@catalysttalentslagos.com', 'farouqagboola94@gmail.com'] },
              { icon: '◆', label: 'Phone', lines: ['+234 708 411 1516', 'Mon–Fri, 9am–6pm WAT'] },
            ].map((card) => (
              <div key={card.label} className="p-8" style={{ background: '#0a0a08' }}>
                <span className="text-[#D4AF37] text-xl block mb-3">{card.icon}</span>
                <p className="text-[9px] tracking-[0.4em] uppercase text-[#D4AF37]/50 mb-4">{card.label}</p>
                {card.lines.map((line) => (
                  <p key={line} className="text-white/55 text-sm leading-relaxed">{line}</p>
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* WHATSAPP CTA */}
      <section className="py-6 px-4" style={{ background: '#0a0a08' }}>
        <div className="max-w-5xl mx-auto">
          <a
            href="https://wa.me/2349052685799"
            target="_blank"
            rel="noreferrer"
            className="flex flex-col sm:flex-row items-start sm:items-center gap-5 p-8 border border-[#1a4a1a] hover:border-[#2d6e2d] transition-colors duration-500"
            style={{ background: 'linear-gradient(135deg, #040d04 0%, #071307 100%)' }}
          >
            <div className="flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center"
              style={{ background: 'rgba(37,211,102,0.12)', border: '1px solid rgba(37,211,102,0.25)' }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="#25d366">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
            </div>
            <div className="flex-1">
              <p className="text-[9px] tracking-[0.4em] uppercase mb-1" style={{ color: '#25d366' }}>WhatsApp Direct</p>
              <p className="text-white/70 text-sm font-medium">+234 905 268 5799</p>
              <p className="text-white/30 text-xs mt-0.5">Usually replies within 2 hours</p>
            </div>
            <div className="text-white/20 text-sm">→</div>
          </a>
        </div>
      </section>

      {/* FORM + SIDEBAR */}
      <section className="py-16 px-4" style={{ background: 'linear-gradient(180deg, #0a0a08 0%, #0d0d0a 100%)' }}>
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-5 gap-16">

          {/* Sidebar */}
          <div className="lg:col-span-2 space-y-10">
            <div className="p-6 border border-[#D4AF37]/15" style={{ background: 'rgba(212,175,55,0.03)' }}>
              <p className="text-[#D4AF37] text-[9px] tracking-[0.4em] uppercase mb-3">Our Promise</p>
              <p className="text-white/45 text-sm leading-relaxed">
                Every message is read by a real person. We respond to all serious enquiries
                within 24–48 hours. No auto-replies, no runarounds.
              </p>
            </div>

            <div>
              <h4 className="text-[9px] tracking-[0.3em] uppercase text-[#D4AF37] mb-4">Office Hours</h4>
              <div className="space-y-2 text-sm text-white/35">
                <p>Monday – Friday: 9am – 6pm WAT</p>
                <p>Saturday: 10am – 2pm WAT</p>
                <p>Sunday: Closed</p>
              </div>
            </div>

            <div>
              <h4 className="text-[9px] tracking-[0.3em] uppercase text-[#D4AF37] mb-4">Follow Us</h4>
              <div className="flex flex-col gap-3">
                <a href="https://instagram.com/catalystggg" target="_blank" rel="noreferrer"
                  className="text-sm text-white/40 hover:text-[#D4AF37] transition-colors flex items-center gap-2">
                  <span className="text-[#D4AF37] text-xs">→</span> Instagram (@catalystggg)
                </a>
                <a href="https://twitter.com/Catalyst188" target="_blank" rel="noreferrer"
                  className="text-sm text-white/40 hover:text-[#D4AF37] transition-colors flex items-center gap-2">
                  <span className="text-[#D4AF37] text-xs">→</span> Twitter (@Catalyst188)
                </a>
                <a href="#"
                  className="text-sm text-white/40 hover:text-[#D4AF37] transition-colors flex items-center gap-2">
                  <span className="text-[#D4AF37] text-xs">→</span> TikTok
                </a>
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="lg:col-span-3">
            {submitted ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-16">
                <div className="w-16 h-16 border border-[#D4AF37]/30 flex items-center justify-center mb-6"
                  style={{ background: 'rgba(212,175,55,0.06)' }}>
                  <span className="text-[#D4AF37] text-2xl">✦</span>
                </div>
                <p className="text-[#D4AF37] text-[10px] tracking-[0.5em] uppercase mb-3">Received</p>
                <h3 className="font-playfair text-2xl font-bold text-white mb-3">Message Sent</h3>
                <p className="text-white/40 text-sm leading-relaxed max-w-xs">
                  Thank you for reaching out. We&apos;ll be in touch within 24–48 hours.
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="mt-8 text-[10px] tracking-widest uppercase text-[#D4AF37]/40 hover:text-[#D4AF37] border-b border-[#D4AF37]/15 hover:border-[#D4AF37] pb-1 transition-colors"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form name="contact" data-netlify="true" onSubmit={handleSubmit} className="space-y-5">
                <input type="hidden" name="form-name" value="contact" />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className={labelClass}>Full Name *</label>
                    <input type="text" name="name" required value={form.name}
                      onChange={handleChange} placeholder="Your name" className={inputClass} />
                  </div>
                  <div>
                    <label className={labelClass}>Email Address *</label>
                    <input type="email" name="email" required value={form.email}
                      onChange={handleChange} placeholder="you@example.com" className={inputClass} />
                  </div>
                </div>
                <div>
                  <label className={labelClass}>Subject *</label>
                  <select name="subject" required value={form.subject} onChange={handleChange}
                    className={inputClass + ' cursor-pointer'}>
                    <option value="" disabled>Select a subject</option>
                    <option className="bg-[#0d0d0d]" value="booking">Book a Model / Talent</option>
                    <option className="bg-[#0d0d0d]" value="partnership">Brand Partnership</option>
                    <option className="bg-[#0d0d0d]" value="press">Press &amp; Media</option>
                    <option className="bg-[#0d0d0d]" value="general">General Enquiry</option>
                  </select>
                </div>
                <div>
                  <label className={labelClass}>Message *</label>
                  <textarea name="message" required rows={7} value={form.message}
                    onChange={handleChange} placeholder="Tell us what you need..."
                    className={inputClass + ' resize-none'} />
                </div>
                <button type="submit" disabled={sending}
                  className="w-full py-4 bg-[#D4AF37] text-black font-bold text-sm tracking-widest uppercase hover:bg-[#F0D060] transition-colors duration-300 disabled:opacity-60">
                  {sending ? 'Sending...' : 'Send Message'}
                </button>
              </form>
            )}
          </div>
        </div>
      </section>
    </>
  )
}
