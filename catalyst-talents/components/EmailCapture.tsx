'use client'

import { useState } from 'react'

interface Props {
  formName?: string
  variant?: 'section' | 'compact'
}

export default function EmailCapture({
  formName = 'newsletter-signup',
  variant = 'section',
}: Props) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle')

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return
    setStatus('submitting')
    try {
      const res = await fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({ 'form-name': formName, name, email }).toString(),
      })
      setStatus(res.ok ? 'success' : 'error')
      if (res.ok) {
        setName('')
        setEmail('')
      }
    } catch {
      setStatus('error')
    }
  }

  // ── compact (footer / inline) ─────────────────────────────────────────
  if (variant === 'compact') {
    if (status === 'success') {
      return (
        <p className="text-[#D4AF37]/60 text-[9px] tracking-[0.5em] uppercase mt-3">
          Welcome to the family ✦
        </p>
      )
    }
    return (
      <form onSubmit={submit} className="flex mt-3">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Your email"
          required
          className="ctl-email-input"
        />
        <button
          type="submit"
          disabled={status === 'submitting'}
          className="ctl-email-btn"
        >
          {status === 'submitting' ? '·' : 'Join'}
        </button>
      </form>
    )
  }

  // ── section (full page section) ───────────────────────────────────────
  if (status === 'success') {
    return (
      <section
        id="join"
        className="py-28 px-4"
        style={{ background: 'linear-gradient(180deg, #040404 0%, #090907 100%)' }}
      >
        <div className="max-w-2xl mx-auto text-center">
          <div
            className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-8"
            style={{
              background: 'rgba(212,175,55,0.07)',
              border: '1px solid rgba(212,175,55,0.22)',
            }}
          >
            <span className="text-[#D4AF37] text-2xl">✦</span>
          </div>
          <h3 className="font-playfair text-3xl sm:text-4xl font-bold text-white mb-5">
            You&apos;re Home Now.
          </h3>
          <p className="text-white/35 text-base leading-relaxed max-w-md mx-auto">
            Welcome to the CTL family. We&apos;ll be in touch — castings, brand
            opportunities, and everything that moves your career forward. You belong here.
          </p>
        </div>
      </section>
    )
  }

  return (
    <section
      id="join"
      className="relative py-28 px-4 overflow-hidden"
      style={{ background: 'linear-gradient(180deg, #040404 0%, #090907 100%)' }}
    >
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 900px 400px at 50% 50%, rgba(212,175,55,0.05) 0%, transparent 70%)',
        }}
      />
      <div className="max-w-2xl mx-auto relative z-10 text-center">
        <div className="flex items-center justify-center gap-5 mb-12">
          <div className="h-px w-14" style={{ background: 'rgba(212,175,55,0.15)' }} />
          <span className="text-[#D4AF37]/30 text-[9px] tracking-[0.7em] uppercase">
            CTL Inner Circle
          </span>
          <div className="h-px w-14" style={{ background: 'rgba(212,175,55,0.15)' }} />
        </div>

        <h2 className="font-playfair text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
          Your Career
          <br />
          <span
            className="italic"
            style={{
              background: 'linear-gradient(135deg, #D4AF37 0%, #F0D060 50%, #D4AF37 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            Deserves a Home.
          </span>
        </h2>

        <p className="text-white/40 text-base sm:text-lg leading-relaxed mb-12 max-w-lg mx-auto">
          Join the CTL inner circle — first access to casting calls, brand deal
          opportunities, welfare resources, and the inside story of what we&apos;re building.
          Every email you share with us, we keep — and we use it to serve you better.
        </p>

        <form
          onSubmit={submit}
          className="flex flex-col sm:flex-row gap-2 max-w-xl mx-auto mb-6"
        >
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your name"
            className="ctl-email-input"
          />
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Your email address"
            required
            className="ctl-email-input"
          />
          <button
            type="submit"
            disabled={status === 'submitting'}
            className="ctl-email-btn-full"
          >
            {status === 'submitting' ? '· · ·' : 'Join the Family'}
          </button>
        </form>

        {status === 'error' && (
          <p className="text-red-400/60 text-xs tracking-wider mb-4">
            Something went wrong. Email us at info@catalysttalentslagos.com
          </p>
        )}

        <p className="text-white/12 text-[9px] tracking-[0.5em] uppercase">
          No spam. No noise. Just what moves you forward.
        </p>
      </div>
    </section>
  )
}
