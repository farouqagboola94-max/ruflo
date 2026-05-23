'use client'

import { useState } from 'react'
import FaqAccordion from '@/components/FaqAccordion'
import Newsletter from '@/components/Newsletter'

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' })
  const [submitted, setSubmitted] = useState(false)

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="text-center mb-14">
        <p className="text-brand-orange text-sm font-semibold uppercase tracking-wider mb-2">Get in Touch</p>
        <h1 className="font-display text-5xl sm:text-6xl text-white mb-4">CONTACT & FAQ</h1>
        <p className="text-gray-400 text-lg max-w-xl mx-auto">Got questions? Drop us a message and we'll reply within 24 hours.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-20">
        <div className="bg-brand-gray rounded-3xl p-8 border border-white/5">
          <h2 className="font-display text-2xl text-white mb-6">SEND A MESSAGE</h2>
          {submitted ? (
            <div className="text-center py-10">
              <div className="text-5xl mb-4">✉️</div>
              <h3 className="text-white font-bold text-xl mb-2">Message Sent!</h3>
              <p className="text-gray-400">We'll get back to you at <span className="text-white">{form.email}</span> within 24 hours.</p>
              <button onClick={() => { setSubmitted(false); setForm({ name: '', email: '', subject: '', message: '' }) }} className="mt-6 text-brand-orange text-sm hover:underline">Send another</button>
            </div>
          ) : (
            <form onSubmit={e => { e.preventDefault(); setSubmitted(true) }} className="space-y-4">
              {([['Full Name','name','text','Your name'],['Email','email','email','you@example.com'],['Subject','subject','text','What is this about?']] as const).map(([label, field, type, ph]) => (
                <div key={field}>
                  <label className="block text-sm text-gray-400 mb-1.5">{label}</label>
                  <input type={type} required placeholder={ph} value={form[field as keyof typeof form]}
                    onChange={e => setForm(f => ({ ...f, [field]: e.target.value }))}
                    className="w-full px-4 py-3 bg-brand-dark border border-white/10 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-brand-orange text-sm" />
                </div>
              ))}
              <div>
                <label className="block text-sm text-gray-400 mb-1.5">Message</label>
                <textarea required rows={4} placeholder="Tell us more..." value={form.message}
                  onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                  className="w-full px-4 py-3 bg-brand-dark border border-white/10 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-brand-orange text-sm resize-none" />
              </div>
              <button type="submit" className="w-full py-3 rounded-xl bg-gradient-to-r from-brand-orange to-brand-amber text-black font-bold hover:opacity-90">Send Message</button>
            </form>
          )}
        </div>

        <div className="space-y-4">
          {[
            { icon: '📍', label: 'Location', value: 'Victoria Island, Lagos · Venue announcement coming soon' },
            { icon: '📧', label: 'Email', value: 'info@sneakersfest.com' },
            { icon: '🟢', label: 'Friday Night Protocol', value: 'Every Friday · IG · Twitter / X · TikTok · WhatsApp' },
            { icon: '🔐', label: 'Support Hours', value: 'Mon to Fri, 9am to 6pm WAT' },
          ].map(({ icon, label, value }) => (
            <div key={label} className="flex gap-4 p-5 bg-brand-gray rounded-2xl border border-white/5">
              <span className="text-2xl">{icon}</span>
              <div>
                <p className="text-gray-500 text-xs uppercase tracking-wider mb-1">{label}</p>
                <p className="text-white text-sm">{value}</p>
              </div>
            </div>
          ))}
          <Newsletter />
        </div>
      </div>

      <div>
        <div className="mb-8">
          <p className="text-brand-orange text-sm font-semibold uppercase tracking-wider mb-2">Answers</p>
          <h2 className="font-display text-4xl text-white">FREQUENTLY ASKED</h2>
        </div>
        <FaqAccordion />
      </div>
    </div>
  )
}
