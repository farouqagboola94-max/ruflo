'use client'

import { FormEvent, useState } from 'react'
import { NetlifyFormState, submitNetlifyForm } from '@/lib/netlifyForms'

const interestOptions = [
  'Tickets',
  'Vendor updates',
  'Sponsor updates',
  'Community Cup',
]

export default function WaitlistForm({ source = 'waitlist-page' }: { source?: string }) {
  const [status, setStatus] = useState<NetlifyFormState>('idle')
  const [message, setMessage] = useState('')
  const [form, setForm] = useState({
    name: '',
    email: '',
    interest: 'Tickets',
    refCode: '',
  })

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setStatus('submitting')
    setMessage('')

    try {
      await submitNetlifyForm('waitlist', {
        ...form,
        source,
      })
      setStatus('success')
      setMessage('You are on the Sneakers Fest waitlist. Ticket and community updates will go here first.')
      setForm({ name: '', email: '', interest: 'Tickets', refCode: '' })
    } catch {
      setStatus('error')
      setMessage('The form did not send. Try again in a moment or use the official Instagram link below.')
    }
  }

  return (
    <form
      name="waitlist"
      method="POST"
      data-netlify="true"
      data-netlify-honeypot="bot-field"
      onSubmit={handleSubmit}
      className="mx-auto max-w-xl rounded-2xl border border-brand-orange/25 bg-brand-gray/80 p-5 text-left sm:p-7"
    >
      <input type="hidden" name="form-name" value="waitlist" />
      <p className="hidden">
        <label>
          Do not fill this out: <input name="bot-field" />
        </label>
      </p>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="mb-2 block text-xs font-semibold uppercase tracking-wider text-gray-400">Name</span>
          <input
            name="name"
            required
            value={form.name}
            onChange={event => setForm(current => ({ ...current, name: event.target.value }))}
            className="w-full rounded-xl border border-white/10 bg-brand-dark px-4 py-3 text-white outline-none transition-colors placeholder:text-gray-600 focus:border-brand-orange"
            placeholder="Your name"
          />
        </label>

        <label className="block">
          <span className="mb-2 block text-xs font-semibold uppercase tracking-wider text-gray-400">Email</span>
          <input
            name="email"
            type="email"
            required
            value={form.email}
            onChange={event => setForm(current => ({ ...current, email: event.target.value }))}
            className="w-full rounded-xl border border-white/10 bg-brand-dark px-4 py-3 text-white outline-none transition-colors placeholder:text-gray-600 focus:border-brand-orange"
            placeholder="you@example.com"
          />
        </label>
      </div>

      <div className="mt-4 grid gap-4 sm:grid-cols-[1fr_0.8fr]">
        <label className="block">
          <span className="mb-2 block text-xs font-semibold uppercase tracking-wider text-gray-400">Main interest</span>
          <select
            name="interest"
            value={form.interest}
            onChange={event => setForm(current => ({ ...current, interest: event.target.value }))}
            className="w-full rounded-xl border border-white/10 bg-brand-dark px-4 py-3 text-white outline-none transition-colors focus:border-brand-orange"
          >
            {interestOptions.map(option => (
              <option key={option}>{option}</option>
            ))}
          </select>
        </label>

        <label className="block">
          <span className="mb-2 block text-xs font-semibold uppercase tracking-wider text-gray-400">Referral code</span>
          <input
            name="refCode"
            value={form.refCode}
            onChange={event => setForm(current => ({ ...current, refCode: event.target.value }))}
            className="w-full rounded-xl border border-white/10 bg-brand-dark px-4 py-3 text-white outline-none transition-colors placeholder:text-gray-600 focus:border-brand-orange"
            placeholder="Optional"
          />
        </label>
      </div>

      <button
        type="submit"
        disabled={status === 'submitting'}
        className="mt-5 w-full rounded-xl bg-gradient-to-r from-brand-orange to-brand-yellow px-5 py-4 text-sm font-bold text-black transition-opacity hover:opacity-90 disabled:opacity-60"
      >
        {status === 'submitting' ? 'Joining waitlist...' : 'Join the waitlist'}
      </button>

      {message && (
        <p
          role="status"
          className={`mt-4 rounded-xl border px-4 py-3 text-sm ${
            status === 'success'
              ? 'border-brand-neon/30 bg-brand-neon/10 text-brand-neon'
              : 'border-brand-orange/30 bg-brand-orange/10 text-brand-orange'
          }`}
        >
          {message}
        </p>
      )}
    </form>
  )
}
