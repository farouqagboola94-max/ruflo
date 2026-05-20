import { useState } from 'react'
import { B } from '../tokens'

const PAYSTACK_KEY = import.meta.env.VITE_PAYSTACK_PUBLIC_KEY || ''
const FLW_KEY = import.meta.env.VITE_FLUTTERWAVE_PUBLIC_KEY || ''

const parseNaira = (str) => parseInt(str.replace(/[₦,\s]/g, ''))

function payWithPaystack({ name, email, amount, tier, onSuccess, onError }) {
  if (!PAYSTACK_KEY) {
    onError('Paystack not configured. Add VITE_PAYSTACK_PUBLIC_KEY in Netlify → Environment Variables.')
    return
  }
  if (!window.PaystackPop) {
    onError('Paystack SDK failed to load. Check your internet connection.')
    return
  }
  const handler = window.PaystackPop.setup({
    key: PAYSTACK_KEY,
    email,
    amount: amount * 100,
    currency: 'NGN',
    ref: `SF26_PS_${Date.now()}`,
    metadata: {
      custom_fields: [
        { display_name: 'Name', variable_name: 'name', value: name },
        { display_name: 'Ticket Tier', variable_name: 'tier', value: tier },
      ],
    },
    callback: (res) => onSuccess('Paystack', res.reference),
    onClose: () => {},
  })
  handler.openIframe()
}

function payWithFlutterwave({ name, email, amount, tier, onSuccess, onError }) {
  if (!FLW_KEY) {
    onError('Flutterwave not configured. Add VITE_FLUTTERWAVE_PUBLIC_KEY in Netlify → Environment Variables.')
    return
  }
  if (!window.FlutterwaveCheckout) {
    onError('Flutterwave SDK failed to load. Check your internet connection.')
    return
  }
  window.FlutterwaveCheckout({
    public_key: FLW_KEY,
    tx_ref: `SF26_FLW_${Date.now()}`,
    amount,
    currency: 'NGN',
    payment_options: 'card,banktransfer,ussd,mobilemoney',
    customer: { email, name, phone_number: '' },
    customizations: {
      title: "Sneakers Fest '26",
      description: `${tier} Ticket — The Sole Exhibition`,
      logo: window.location.origin + '/favicon.svg',
    },
    callback: (res) => {
      if (res.status === 'successful' || res.status === 'completed') {
        onSuccess('Flutterwave', String(res.transaction_id || res.tx_ref))
      }
      res.modal?.close()
    },
    onclose: () => {},
  })
}

export default function PaymentModal({ tier, onClose }) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [method, setMethod] = useState('paystack')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(null)

  const amount = parseNaira(tier.price)

  function handlePay() {
    if (!name.trim()) { setError('Please enter your full name.'); return }
    if (!email.trim() || !email.includes('@')) { setError('Please enter a valid email address.'); return }
    setError('')
    setLoading(true)

    const opts = {
      name: name.trim(),
      email: email.trim().toLowerCase(),
      amount,
      tier: tier.name,
      onSuccess: (gateway, ref) => {
        setLoading(false)
        setSuccess({ gateway, ref })
      },
      onError: (msg) => {
        setLoading(false)
        setError(msg)
      },
    }

    if (method === 'paystack') {
      payWithPaystack(opts)
      setTimeout(() => setLoading(false), 800)
    } else {
      payWithFlutterwave(opts)
      setTimeout(() => setLoading(false), 800)
    }
  }

  const inputStyle = (accent) => ({
    width: '100%',
    padding: '12px 14px',
    background: 'rgba(255,255,255,0.04)',
    border: `1px solid ${accent || 'rgba(255,255,255,0.1)'}`,
    borderRadius: 10,
    color: B.white,
    fontFamily: 'Space Mono,monospace',
    fontSize: 13,
    outline: 'none',
    boxSizing: 'border-box',
    transition: 'border-color 0.2s',
  })

  const label = (text) => (
    <label style={{ color: '#555', fontFamily: 'Space Mono,monospace', fontSize: 9, letterSpacing: 2, display: 'block', marginBottom: 6 }}>
      {text}
    </label>
  )

  return (
    <div
      style={{
        position: 'fixed', inset: 0, zIndex: 2000,
        background: 'rgba(0,0,0,0.88)',
        backdropFilter: 'blur(10px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: 24,
        animation: 'fadeUp 0.2s ease',
      }}
      onClick={e => { if (e.target === e.currentTarget) onClose() }}
    >
      <div style={{
        width: '100%', maxWidth: 460,
        background: 'rgba(10,10,15,0.97)',
        backdropFilter: 'blur(24px) saturate(180%)',
        border: `1px solid ${tier.color}30`,
        borderRadius: 20,
        overflow: 'hidden',
        boxShadow: `0 0 80px ${tier.color}10, 0 40px 100px rgba(0,0,0,0.95)`,
        animation: 'chatSlideIn 0.25s ease',
      }}>
        {/* Top accent */}
        <div style={{ height: 3, background: `linear-gradient(90deg, ${tier.color}, ${tier.color}30)` }} />

        {/* Header */}
        <div style={{
          padding: '18px 24px',
          borderBottom: '1px solid rgba(255,255,255,0.07)',
          background: `linear-gradient(90deg, ${tier.color}08, transparent)`,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <div>
            <p style={{ color: tier.color, fontFamily: 'Orbitron,sans-serif', fontSize: 9, letterSpacing: 3, fontWeight: 700, marginBottom: 4 }}>SECURE CHECKOUT</p>
            <p style={{ color: B.white, fontFamily: 'Bebas Neue,sans-serif', fontSize: 22, letterSpacing: 2 }}>{tier.name} TICKET</p>
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, cursor: 'pointer', color: B.smoke, width: 34, height: 34, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
          </button>
        </div>

        {success ? (
          /* —— SUCCESS STATE —— */
          <div style={{ padding: '40px 32px', textAlign: 'center' }}>
            <div style={{ width: 68, height: 68, borderRadius: '50%', background: 'rgba(184,255,0,0.08)', border: `2px solid ${B.neonLime}`, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
              <svg width="30" height="30" viewBox="0 0 24 24" fill="none"><path d="M5 13l4 4L19 7" stroke={B.neonLime} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </div>
            <p style={{ color: B.neonLime, fontFamily: 'Orbitron,sans-serif', fontSize: 11, letterSpacing: 3, marginBottom: 10, fontWeight: 700 }}>PAYMENT CONFIRMED</p>
            <p style={{ color: B.white, fontFamily: 'Bebas Neue,sans-serif', fontSize: 32, letterSpacing: 2, lineHeight: 1, marginBottom: 20 }}>SEE YOU JULY 18!</p>
            <div style={{ padding: '14px 20px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 10, marginBottom: 20 }}>
              <p style={{ color: '#555', fontFamily: 'Space Mono,monospace', fontSize: 9, letterSpacing: 2, marginBottom: 6 }}>BOOKING REFERENCE</p>
              <p style={{ color: tier.color, fontFamily: 'Space Mono,monospace', fontSize: 12, wordBreak: 'break-all' }}>{success.ref}</p>
            </div>
            <p style={{ color: '#555', fontFamily: 'Space Mono,monospace', fontSize: 10, marginBottom: 4 }}>Confirmation sent to <span style={{ color: B.smoke }}>{email}</span></p>
            <p style={{ color: '#333', fontFamily: 'Space Mono,monospace', fontSize: 9, marginBottom: 28 }}>Powered by {success.gateway}</p>
            <button
              onClick={onClose}
              style={{ padding: '13px 40px', background: tier.color, border: 'none', borderRadius: 10, color: B.black, fontFamily: 'Orbitron,sans-serif', fontSize: 11, fontWeight: 700, cursor: 'pointer', letterSpacing: 2, boxShadow: `0 0 24px ${tier.color}40` }}
            >DONE →</button>
          </div>
        ) : (
          /* —— PAYMENT FORM —— */
          <div style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 16 }}>

            {/* Price summary */}
            <div style={{ padding: '12px 16px', background: `${tier.color}08`, border: `1px solid ${tier.color}20`, borderRadius: 10, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <p style={{ color: '#555', fontFamily: 'Space Mono,monospace', fontSize: 9, letterSpacing: 1, marginBottom: 2 }}>1 × {tier.name} TICKET</p>
                <p style={{ color: B.smoke, fontFamily: 'Space Mono,monospace', fontSize: 10 }}>The Sole Exhibition · July 18 2026</p>
              </div>
              <p style={{ color: tier.color, fontFamily: 'Orbitron,sans-serif', fontSize: 20, fontWeight: 900, textShadow: `0 0 16px ${tier.color}60` }}>{tier.price}</p>
            </div>

            {/* Name */}
            <div>
              {label('FULL NAME')}
              <input
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="Your full name"
                style={inputStyle()}
              />
            </div>

            {/* Email */}
            <div>
              {label('EMAIL ADDRESS')}
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handlePay()}
                placeholder="your@email.com"
                style={inputStyle(`${tier.color}30`)}
              />
            </div>

            {/* Payment method */}
            <div>
              {label('PAYMENT METHOD')}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                {[
                  { id: 'paystack', label: 'Paystack', sub: 'Card · Bank Transfer · USSD', color: '#00C3F7', configured: !!PAYSTACK_KEY },
                  { id: 'flutterwave', label: 'Flutterwave', sub: 'Card · Mobile Money', color: '#F5A623', configured: !!FLW_KEY },
                ].map(m => (
                  <button
                    key={m.id}
                    onClick={() => setMethod(m.id)}
                    style={{
                      padding: '13px 10px',
                      borderRadius: 10,
                      cursor: 'pointer',
                      background: method === m.id ? `${m.color}12` : 'rgba(255,255,255,0.03)',
                      border: `1.5px solid ${method === m.id ? m.color : 'rgba(255,255,255,0.08)'}`,
                      textAlign: 'center',
                      transition: 'all 0.2s',
                    }}
                  >
                    <p style={{ color: method === m.id ? m.color : B.smoke, fontFamily: 'Orbitron,sans-serif', fontSize: 10, fontWeight: 700, marginBottom: 3 }}>{m.label}</p>
                    <p style={{ color: '#555', fontFamily: 'Space Mono,monospace', fontSize: 9 }}>{m.sub}</p>
                    {!m.configured && <p style={{ color: '#333', fontFamily: 'Space Mono,monospace', fontSize: 8, marginTop: 3 }}>key not set</p>}
                  </button>
                ))}
              </div>
            </div>

            {/* Error */}
            {error && (
              <div style={{ padding: '10px 14px', background: 'rgba(255,45,123,0.08)', border: '1px solid rgba(255,45,123,0.2)', borderRadius: 8 }}>
                <p style={{ color: B.neonMagenta, fontFamily: 'Space Mono,monospace', fontSize: 11 }}>{error}</p>
              </div>
            )}

            {/* Pay button */}
            <button
              onClick={handlePay}
              disabled={loading}
              style={{
                padding: '15px',
                borderRadius: 10,
                border: `1px solid ${loading ? 'transparent' : tier.color}`,
                background: loading ? B.gunmetal : tier.color,
                color: loading ? B.smoke : B.black,
                fontFamily: 'Orbitron,sans-serif',
                fontSize: 12,
                fontWeight: 700,
                letterSpacing: 2,
                cursor: loading ? 'not-allowed' : 'pointer',
                boxShadow: loading ? 'none' : `0 0 32px ${tier.color}30`,
                transition: 'all 0.2s',
              }}
            >
              {loading
                ? <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10 }}>
                    <span style={{ width: 12, height: 12, border: `2px solid ${B.smoke}`, borderTopColor: 'transparent', borderRadius: '50%', display: 'inline-block', animation: 'spin 0.8s linear infinite' }} />
                    OPENING PAYMENT...
                  </span>
                : `PAY ${tier.price} →`
              }
            </button>

            <p style={{ color: '#333', fontFamily: 'Space Mono,monospace', fontSize: 9, textAlign: 'center', letterSpacing: 1 }}>
              SECURED BY {method === 'paystack' ? 'PAYSTACK' : 'FLUTTERWAVE'} · 256-BIT SSL
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
