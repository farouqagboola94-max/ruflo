'use client'

import { useState } from 'react'
import Script from 'next/script'
import { TICKET_TIERS } from '@/data/tickets'
import { useAuth } from '@/context/AuthContext'
import { sendTicketEmail } from '@/lib/sendTicketEmail'
import { generateTicketInvoicePDF } from '@/lib/generateInvoicePDF'

declare global {
  interface Window {
    PaystackPop: {
      setup: (config: {
        key: string; email: string; amount: number; currency: string; ref: string;
        metadata?: object;
        callback: (r: { reference: string }) => void;
        onClose: () => void;
      }) => { openIframe: () => void }
    }
  }
}

const PAYSTACK_KEY = process.env.NEXT_PUBLIC_PAYSTACK_KEY || 'pk_test_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx'

async function generateQR(data: string): Promise<string> {
  const QRCode = (await import('qrcode')).default
  return QRCode.toDataURL(data, { width: 300, margin: 2, color: { dark: '#0A0A0A', light: '#FFFFFF' } })
}

export default function TicketsPage() {
  const { user, openAuth, addTicket } = useAuth()
  const [selected, setSelected]     = useState<string | null>(null)
  const [form, setForm]             = useState({ name: user?.name || '', email: user?.email || '', phone: '', quantity: '1' })
  const [submitted, setSubmitted]   = useState(false)
  const [payRef, setPayRef]         = useState('')
  const [purchasedAt, setPurchasedAt] = useState('')
  const [processing, setProcessing] = useState(false)
  const [qrDataUrl, setQrDataUrl]   = useState('')
  const [emailSent, setEmailSent]   = useState<boolean | null>(null)
  const [invoiceLoading, setInvoiceLoading] = useState(false)

  const tier  = TICKET_TIERS.find(t => t.id === selected)
  const total = tier ? tier.price * parseInt(form.quantity) : 0

  const initiatePayment = (e: React.FormEvent) => {
    e.preventDefault()
    if (!tier) return
    if (typeof window === 'undefined' || !window.PaystackPop) {
      alert('Payment is loading, please try again in a moment.')
      return
    }
    setProcessing(true)
    const ref = `SF-${Date.now()}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`
    window.PaystackPop.setup({
      key: PAYSTACK_KEY,
      email: form.email,
      amount: total * 100,
      currency: 'NGN',
      ref,
      metadata: { custom_fields: [
        { display_name: 'Ticket Type', variable_name: 'ticket_type', value: tier.name },
        { display_name: 'Quantity',    variable_name: 'quantity',    value: form.quantity },
      ]},
      callback: async (response) => {
        setProcessing(false)
        const now = new Date().toISOString()
        setPayRef(response.reference)
        setPurchasedAt(now)
        addTicket({
          tier: tier.name,
          quantity: parseInt(form.quantity),
          ref: response.reference,
          date: new Date().toLocaleDateString('en-NG', { day: 'numeric', month: 'long', year: 'numeric' }),
          total,
        })

        try {
          const record = {
            ref:         response.reference,
            name:        form.name,
            email:       form.email,
            phone:       form.phone,
            tier:        tier.name,
            tierId:      tier.id,
            quantity:    parseInt(form.quantity),
            total,
            purchasedAt: now,
          }
          const existing = JSON.parse(localStorage.getItem('sf_tickets') || '[]')
          localStorage.setItem('sf_tickets', JSON.stringify([...existing, record]))
        } catch {}

        const qrPayload = JSON.stringify({
          event: 'Sneakers Fest 2026',
          ref:   response.reference,
          tier:  tier.name,
          qty:   parseInt(form.quantity),
          name:  form.name,
          date:  'Dec 12-13, 2026',
        })
        const qr = await generateQR(qrPayload)
        setQrDataUrl(qr)

        try {
          await sendTicketEmail({
            to_name:     form.name,
            to_email:    form.email,
            ticket_tier: tier.name,
            quantity:    parseInt(form.quantity),
            total,
            ref:         response.reference,
            qr_code:     qr,
          })
          setEmailSent(true)
        } catch {
          setEmailSent(false)
        }

        setSubmitted(true)
      },
      onClose: () => setProcessing(false),
    }).openIframe()
  }

  const downloadQR = () => {
    const a = document.createElement('a')
    a.href = qrDataUrl
    a.download = `sneakers-fest-${payRef}.png`
    a.click()
  }

  const downloadInvoice = async () => {
    if (!tier) return
    setInvoiceLoading(true)
    try {
      await generateTicketInvoicePDF({
        ref:         payRef,
        name:        form.name,
        email:       form.email,
        phone:       form.phone,
        tier:        tier.name,
        quantity:    parseInt(form.quantity),
        total,
        qrDataUrl:   qrDataUrl || undefined,
        purchasedAt: purchasedAt || new Date().toISOString(),
      })
    } finally {
      setInvoiceLoading(false)
    }
  }

  return (
    <>
      <Script src="https://js.paystack.co/v1/inline.js" strategy="lazyOnload" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-14">
          <p className="text-brand-orange text-sm font-semibold uppercase tracking-wider mb-2">December 12–13, 2026</p>
          <h1 className="font-display text-5xl sm:text-6xl text-white mb-4">GET YOUR TICKETS</h1>
          <p className="text-gray-400 text-lg max-w-xl mx-auto">Choose your pass. All tickets include 2-day access. Limited quantities available.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 mb-14">
          {TICKET_TIERS.map(t => (
            <div key={t.id} onClick={() => setSelected(t.id)}
              className={`relative rounded-3xl p-px cursor-pointer transition-all ${
                selected === t.id ? `bg-gradient-to-br ${t.color} shadow-xl shadow-orange-500/20` : 'bg-white/5 hover:bg-white/10'
              }`}>
              {t.badge && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-10">
                  <span className={`px-4 py-1 rounded-full text-black text-xs font-bold bg-gradient-to-r ${
                    t.id === 'phalanx' ? 'from-lime-400 to-green-500' : 'from-brand-orange to-brand-amber'
                  }`}>{t.badge}</span>
                </div>
              )}
              <div className="rounded-3xl bg-brand-gray p-6 h-full flex flex-col">
                <h3 className="text-white font-display text-2xl mb-1">{t.name.toUpperCase()}</h3>
                <div className="flex items-baseline gap-1 mb-3">
                  <span className="text-4xl font-bold text-gradient">₦{t.price.toLocaleString()}</span>
                  <span className="text-gray-400 text-sm">/ person</span>
                </div>
                <p className="text-gray-400 text-sm mb-6 leading-relaxed">{t.description}</p>
                <ul className="space-y-2.5 flex-1">
                  {t.perks.map(p => (
                    <li key={p} className="flex items-start gap-2 text-sm">
                      <span className={`mt-0.5 flex-shrink-0 ${
                        t.id === 'phalanx' ? 'text-lime-400' : 'text-brand-orange'
                      }`}>✓</span>
                      <span className="text-gray-300">{p}</span>
                    </li>
                  ))}
                </ul>
                <button className={`mt-6 w-full py-3 rounded-xl font-bold text-sm transition-all ${
                  selected === t.id ? `bg-gradient-to-r ${t.color} text-black` : 'border border-white/20 text-white hover:border-brand-orange hover:text-brand-orange'
                }`}>{selected === t.id ? 'Selected ✓' : 'Select This Pass'}</button>
              </div>
            </div>
          ))}
        </div>

        <div className="max-w-xl mx-auto">
          {!submitted ? (
            <div className="bg-brand-gray rounded-3xl p-8 border border-white/5">
              <h2 className="font-display text-2xl text-white mb-2">COMPLETE YOUR ORDER</h2>
              {tier  && <p className="text-brand-orange text-sm mb-6">{tier.name} · ₦{tier.price.toLocaleString()} per person</p>}
              {!tier && <p className="text-gray-500 text-sm mb-6">Select a ticket tier above, then fill in your details.</p>}
              {!user && (
                <div className="bg-brand-dark rounded-xl p-4 border border-brand-orange/20 mb-5 flex items-center justify-between gap-4">
                  <p className="text-gray-400 text-sm">Sign in to save tickets to your profile.</p>
                  <button onClick={openAuth} className="text-brand-orange text-sm font-semibold hover:underline whitespace-nowrap">Sign In</button>
                </div>
              )}
              <form onSubmit={initiatePayment} className="space-y-4">
                {([
                  ['Full Name',    'name',  'text',  'Your full name'],
                  ['Email',        'email', 'email', 'you@example.com'],
                  ['Phone Number', 'phone', 'tel',   '+234 800 0000 000'],
                ] as [string, keyof typeof form, string, string][]).map(([label, field, type, ph]) => (
                  <div key={field}>
                    <label className="block text-sm text-gray-400 mb-1.5">{label}</label>
                    <input type={type} required placeholder={ph} value={form[field]}
                      onChange={e => setForm(f => ({ ...f, [field]: e.target.value }))}
                      className="w-full px-4 py-3 bg-brand-dark border border-white/10 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-brand-orange text-sm" />
                  </div>
                ))}
                <div>
                  <label className="block text-sm text-gray-400 mb-1.5">Number of Tickets</label>
                  <select value={form.quantity} onChange={e => setForm(f => ({ ...f, quantity: e.target.value }))}
                    className="w-full px-4 py-3 bg-brand-dark border border-white/10 rounded-xl text-white focus:outline-none focus:border-brand-orange text-sm">
                    {[1,2,3,4,5].map(n => <option key={n} value={n}>{n}</option>)}
                  </select>
                </div>
                {tier && (
                  <div className="bg-brand-dark rounded-xl p-4 border border-white/10">
                    <div className="flex justify-between text-sm text-gray-400 mb-1">
                      <span>{tier.name} × {form.quantity}</span>
                      <span>₦{total.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between font-bold text-white">
                      <span>Total</span>
                      <span className="text-gradient text-lg">₦{total.toLocaleString()}</span>
                    </div>
                  </div>
                )}
                <button type="submit" disabled={!tier || processing}
                  className="w-full py-4 rounded-xl bg-gradient-to-r from-brand-orange to-brand-amber text-black font-bold text-lg hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed">
                  {processing ? 'Opening payment…' : tier ? `Pay ₦${total.toLocaleString()}` : 'Select a Ticket First'}
                </button>
                <p className="text-center text-gray-500 text-xs">Secured by Paystack · SSL encrypted</p>
              </form>
            </div>
          ) : (
            <div className="bg-brand-gray rounded-3xl p-10 border border-brand-orange/20 text-center">
              <div className="text-5xl mb-5">👟</div>
              <h3 className="font-display text-3xl text-white mb-1">YOU'RE IN!</h3>
              <p className="text-gray-400 text-sm mb-1">{form.quantity} × {tier?.name} · ₦{total.toLocaleString()}</p>
              <p className="text-gray-600 text-xs font-mono mb-6">Ref: {payRef}</p>

              {qrDataUrl && (
                <div className="mb-6">
                  <p className="text-xs text-gray-500 uppercase tracking-wider mb-3">Your Entry QR Code</p>
                  <div className="inline-block p-3 bg-white rounded-2xl">
                    <img src={qrDataUrl} alt="Ticket QR Code" width={200} height={200} className="block" />
                  </div>
                  <div className="mt-3 flex items-center justify-center gap-3 flex-wrap">
                    <button onClick={downloadQR}
                      className="inline-flex items-center gap-2 px-5 py-2 rounded-full border border-brand-orange/40 text-brand-orange text-sm font-semibold hover:bg-brand-orange/10 transition-colors">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                      </svg>
                      Download QR
                    </button>
                    <button onClick={downloadInvoice} disabled={invoiceLoading}
                      className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-brand-orange/10 border border-brand-orange/30 text-brand-orange text-sm font-semibold hover:bg-brand-orange/20 transition-colors disabled:opacity-50">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      {invoiceLoading ? 'Generating…' : 'Download Invoice PDF'}
                    </button>
                  </div>
                </div>
              )}

              <div className="bg-brand-dark rounded-2xl p-4 mb-6 border border-white/10 text-sm">
                {emailSent === true  && <p className="text-brand-neon">✓ Confirmation sent to <span className="text-white">{form.email}</span></p>}
                {emailSent === false && <p className="text-gray-400">Download your QR and invoice above — they are your entry and receipt.</p>}
                {emailSent === null  && <p className="text-gray-500">Sending confirmation to <span className="text-white">{form.email}</span>…</p>}
              </div>

              <div className="bg-brand-dark rounded-2xl p-4 mb-6 border border-white/10">
                <p className="text-gray-500 text-sm">Venue confirmation coming soon</p>
                <p className="text-white font-semibold">December 12–13, 2026 · Lagos, Nigeria</p>
              </div>

              {user && <p className="text-brand-orange text-sm mb-4">Saved to your profile ✓</p>}
              <button onClick={() => { setSubmitted(false); setSelected(null); setPayRef(''); setQrDataUrl(''); setEmailSent(null); setPurchasedAt('') }}
                className="text-gray-500 text-sm hover:text-gray-300">Buy another ticket</button>
            </div>
          )}
        </div>
      </div>
    </>
  )
}
