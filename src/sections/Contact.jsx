import { useState } from 'react'
import { B } from '../tokens'
import { GrainOverlay } from '../components/Shared'
import Egg from '../components/Egg'
import { contactApi } from '../lib/api'

const FORMSPREE_URL = import.meta.env.VITE_FORMSPREE_ID
  ? `https://formspree.io/f/${import.meta.env.VITE_FORMSPREE_ID}`
  : null

export default function Contact() {
  const [form, setForm]   = useState({ name: '', email: '', phone: '', message: '' })
  const [status, setStatus] = useState('idle') // idle | sending | done
  const [errMsg, setErrMsg] = useState('')

  const update = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }))

  async function submit(e) {
    e.preventDefault()
    const { name, email, phone, message } = form
    if (!name.trim() || !email.trim() || !message.trim()) {
      setErrMsg('Name, email and message are required.')
      return
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setErrMsg('Please enter a valid email address.')
      return
    }
    setErrMsg('')
    setStatus('sending')

    const payload = {
      id: `contact_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
      name: name.trim(),
      email: email.trim().toLowerCase(),
      phone: phone.trim(),
      message: message.trim(),
      source: 'contact-form',
      timestamp: new Date().toISOString(),
    }

    // Netlify Forms — primary capture path; works on Netlify with no API key
    try {
      const nlBody = new URLSearchParams({
        'form-name': 'contact',
        'bot-field': '',
        name: payload.name,
        email: payload.email,
        phone: payload.phone,
        message: payload.message,
      })
      await fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: nlBody.toString(),
      })
    } catch {}

    // Backend + localStorage fallback
    try { await contactApi.submit(payload) } catch {}

    // Formspree fallback if VITE_FORMSPREE_ID is set
    if (FORMSPREE_URL) {
      try {
        await fetch(FORMSPREE_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
          body: JSON.stringify({ name: payload.name, email: payload.email, phone: payload.phone, message: payload.message }),
        })
      } catch {}
    }

    setStatus('done')
    setForm({ name: '', email: '', phone: '', message: '' })
  }

  const fieldStyle = {
    width: '100%',
    padding: '14px 18px',
    background: 'rgba(255,255,255,0.04)',
    border: '1px solid rgba(255,255,255,0.12)',
    borderRadius: 6,
    color: B.white,
    fontFamily: "'Syne', sans-serif",
    fontSize: 14,
    outline: 'none',
    transition: 'border-color 0.2s',
  }

  const labelStyle = {
    fontFamily: "'Space Mono', monospace",
    fontSize: 8,
    color: B.smoke,
    letterSpacing: '0.3em',
    display: 'block',
    marginBottom: 8,
  }

  return (
    <section id="contact" style={{
      padding: '100px 24px',
      background: `linear-gradient(180deg, ${B.black} 0%, #060610 100%)`,
      position: 'relative',
      overflow: 'hidden',
    }}>
      <GrainOverlay />
      <Egg id="egg-103" corner="top-right" />
      <Egg id="egg-104" corner="bottom-left" />

      <div style={{ position: 'absolute', top: '15%', left: '5%', width: 500, height: 500,
        background: `radial-gradient(circle, ${B.neonCyan}07 0%, transparent 70%)`,
        filter: 'blur(80px)', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', bottom: '10%', right: '5%', width: 400, height: 400,
        background: `radial-gradient(circle, ${B.amber}07 0%, transparent 70%)`,
        filter: 'blur(60px)', pointerEvents: 'none' }} />

      <div style={{ maxWidth: 700, margin: '0 auto', position: 'relative', zIndex: 5 }}>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 56 }}>
          <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 9, color: B.neonCyan,
            letterSpacing: '0.45em', marginBottom: 16 }}>GET IN TOUCH</div>
          <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 'clamp(44px, 8vw, 70px)',
            color: B.white, lineHeight: 1, marginBottom: 18 }}>CONTACT US</h2>
          <div style={{ width: 64, height: 2, margin: '0 auto 20px',
            background: `linear-gradient(90deg, ${B.neonCyan}, ${B.amber})` }} />
          <p style={{ fontFamily: "'Syne', sans-serif", fontSize: 15, color: B.smoke,
            lineHeight: 1.75, maxWidth: 480, margin: '0 auto' }}>
            Questions? Collaborations? Press enquiries?{' '}
            <span style={{ color: B.amber }}>We respond within 24 hours.</span>
          </p>
        </div>

        {/* Info chips */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: 12, flexWrap: 'wrap', marginBottom: 48 }}>
          {[
            { icon: '✉', label: 'hello@sneakersfest.ng' },
            { icon: '📞', label: '+234 800 SNEAKERS' },
            { icon: '📍', label: 'Lagos, Nigeria' },
          ].map(({ icon, label: l }) => (
            <div key={l} style={{
              display: 'flex', alignItems: 'center', gap: 8,
              padding: '8px 18px',
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.09)',
              borderRadius: 20,
              fontFamily: "'Space Mono', monospace", fontSize: 8,
              color: B.smoke, letterSpacing: '0.08em',
            }}>
              <span style={{ fontSize: 12 }}>{icon}</span>
              {l}
            </div>
          ))}
        </div>

        {/* Form / success */}
        {status === 'done' ? (
          <div style={{
            padding: '60px 32px', textAlign: 'center',
            background: 'rgba(0,255,120,0.03)',
            border: '1px solid rgba(0,255,120,0.18)',
            borderRadius: 12,
          }}>
            <div style={{ fontSize: 52, marginBottom: 16 }}>✓</div>
            <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 32,
              color: B.neonLime, marginBottom: 12 }}>MESSAGE SENT</div>
            <p style={{ fontFamily: "'Syne', sans-serif", color: B.smoke, fontSize: 14,
              marginBottom: 28, lineHeight: 1.7 }}>
              Thanks for reaching out! We'll get back to you soon.
            </p>
            <button onClick={() => setStatus('idle')} style={{
              padding: '10px 30px',
              background: 'transparent',
              border: `1px solid ${B.neonCyan}50`,
              color: B.neonCyan,
              fontFamily: "'Space Mono', monospace",
              fontSize: 9, letterSpacing: '0.25em',
              cursor: 'pointer', borderRadius: 4,
            }}>
              SEND ANOTHER →
            </button>
          </div>
        ) : (
          <form onSubmit={submit} style={{
            background: 'rgba(255,255,255,0.025)',
            border: '1px solid rgba(255,255,255,0.07)',
            borderRadius: 12,
            padding: '44px 40px',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
          }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 22, marginBottom: 22 }}>
              <div>
                <label style={labelStyle}>FULL NAME *</label>
                <input type="text" value={form.name} onChange={update('name')}
                  placeholder="Your name" required style={fieldStyle} />
              </div>
              <div>
                <label style={labelStyle}>EMAIL ADDRESS *</label>
                <input type="email" value={form.email} onChange={update('email')}
                  placeholder="you@example.com" required style={fieldStyle} />
              </div>
            </div>
            <div style={{ marginBottom: 22 }}>
              <label style={labelStyle}>PHONE NUMBER</label>
              <input type="tel" value={form.phone} onChange={update('phone')}
                placeholder="+234 xxx xxx xxxx" style={fieldStyle} />
            </div>
            <div style={{ marginBottom: 28 }}>
              <label style={labelStyle}>YOUR MESSAGE *</label>
              <textarea value={form.message} onChange={update('message')}
                placeholder="Tell us what's on your mind..." required rows={5}
                style={{ ...fieldStyle, resize: 'vertical', minHeight: 130, display: 'block' }} />
            </div>

            {errMsg && (
              <div style={{
                padding: '10px 16px', marginBottom: 22,
                background: 'rgba(255,60,60,0.08)',
                border: '1px solid rgba(255,60,60,0.22)',
                borderRadius: 6,
                fontFamily: "'Space Mono', monospace",
                fontSize: 9, color: '#ff9090', letterSpacing: '0.1em',
              }}>
                {errMsg}
              </div>
            )}

            <button type="submit" disabled={status === 'sending'} style={{
              width: '100%',
              padding: '17px 24px',
              background: status === 'sending' ? 'rgba(255,255,255,0.08)' : B.amber,
              color: status === 'sending' ? B.smoke : B.black,
              fontFamily: "'Space Mono', monospace",
              fontSize: 10, fontWeight: 700, letterSpacing: '0.25em',
              border: 'none', borderRadius: 6,
              cursor: status === 'sending' ? 'not-allowed' : 'pointer',
              boxShadow: status === 'sending' ? 'none' : `0 0 40px ${B.amber}25`,
              transition: 'all 0.2s',
            }}>
              {status === 'sending' ? 'SENDING...' : 'SEND MESSAGE →'}
            </button>

            <div style={{ marginTop: 24, textAlign: 'center', fontFamily: "'Space Mono', monospace",
              fontSize: 8, color: B.smoke, letterSpacing: '0.15em' }}>
              OR EMAIL DIRECTLY:{'  '}
              <a href="mailto:hello@sneakersfest.ng" style={{ color: B.neonCyan, textDecoration: 'none' }}>
                hello@sneakersfest.ng
              </a>
            </div>
          </form>
        )}
      </div>
    </section>
  )
}
