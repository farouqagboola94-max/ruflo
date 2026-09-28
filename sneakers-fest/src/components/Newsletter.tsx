'use client'

import { FormEvent, useState } from 'react'
import { NetlifyFormState, submitNetlifyForm } from '@/lib/netlifyForms'

export default function Newsletter() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<NetlifyFormState>('idle')

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setStatus('submitting')

    try {
      await submitNetlifyForm('newsletter', {
        email,
        interests: 'Drops, vendors, event updates',
        source: 'newsletter-component',
      })
      setEmail('')
      setStatus('success')
    } catch {
      setStatus('error')
    }
  }

  return (
    <div className="bg-gradient-to-r from-brand-orange/10 to-brand-yellow/10 border border-brand-orange/20 rounded-2xl p-8 text-center">
      <h3 className="font-display text-2xl text-white mb-2">STAY IN THE LOOP</h3>
      <p className="text-gray-400 text-sm mb-6">Get early-access drops, vendor announcements, and event updates.</p>
      {status === 'success' ? (
        <p className="text-brand-orange font-semibold">You&apos;re on the list.</p>
      ) : (
        <form
          name="newsletter"
          method="POST"
          data-netlify="true"
          data-netlify-honeypot="bot-field"
          onSubmit={handleSubmit}
          className="flex gap-3 max-w-sm mx-auto"
        >
          <input type="hidden" name="form-name" value="newsletter" />
          <p className="hidden">
            <label>
              Do not fill this out: <input name="bot-field" />
            </label>
          </p>
          <input type="email" required placeholder="your@email.com" value={email}
            onChange={e => setEmail(e.target.value)}
            name="email"
            className="flex-1 px-4 py-3 bg-brand-dark border border-white/10 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-brand-orange text-sm" />
          <button type="submit" disabled={status === 'submitting'} className="px-5 py-3 rounded-xl bg-gradient-to-r from-brand-orange to-brand-yellow text-black font-bold text-sm hover:opacity-90 transition-opacity whitespace-nowrap disabled:opacity-60">
            {status === 'submitting' ? 'Sending...' : 'Subscribe'}
          </button>
        </form>
      )}
      {status === 'error' && <p role="status" className="mt-4 text-sm font-semibold text-brand-orange">Could not subscribe. Try again shortly.</p>}
    </div>
  )
}
