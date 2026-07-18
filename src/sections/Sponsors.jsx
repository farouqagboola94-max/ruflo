import { useState } from 'react'
import { B } from '../tokens'
import { GrainOverlay, ScanLines, SectionTag } from '../components/Shared'
import Egg from '../components/Egg'

const STATS = [
  { value: '2K–3.5K',   label: 'EVENT ATTENDEES' },
  { value: '5,000+',    label: 'FNP COMMUNITY' },
  { value: '30–50',     label: 'VENDOR SLOTS' },
  { value: 'Year-Round', label: 'PLATFORM REACH' },
]

const AUDIENCE = [
  { icon: '👟', title: 'Sneaker Collectors', desc: 'Deep enthusiasts. They buy, they trade, they flex. Brand loyalty is earned and absolute.', color: B.amber },
  { icon: '🧥', title: 'Fashion & Streetwear', desc: 'Lagos tastemakers who drive what gets adopted. Early adopters of collabs and capsule drops.', color: B.neonCyan },
  { icon: '📱', title: 'Content Creators', desc: 'Reels, reviews, haul videos. If they photograph it, the culture follows. High distribution multiplier.', color: B.neonMagenta },
  { icon: '🔥', title: 'Tastemakers 18–35', desc: 'The target demo of every brand operating in the Lagos market. Disposable income. Very online. Tribal.', color: B.neonLime },
]

const PARTNER_LEVELS = [
  {
    tier: 'PRESENTING SPONSOR',
    color: B.amber,
    featured: true,
    badge: 'FLAGSHIP',
    perks: [
      'Naming rights — "Sneakers Fest 2026 presented by [Brand]"',
      'Prime activation zone on the floor',
      'VIP tickets + private lounge access',
      'Speaking slot on main stage',
      'Dedicated social posts across all platforms',
      'Logo on all event materials, signage and wristbands',
      'Custom brand moment during DJ headline set',
      'Post-event full media recap package',
      'Founding Partner recognition — all future events',
    ],
  },
  {
    tier: 'GOLD PARTNER',
    color: '#FFD700',
    featured: false,
    perks: [
      'Branded activation zone',
      'VIP tickets',
      'Dedicated social posts (branded + tagged)',
      'Logo on main stage backdrop',
      'Brand mention in MC segments',
      'Post-event email blast feature',
    ],
  },
  {
    tier: 'SILVER PARTNER',
    color: B.smoke,
    featured: false,
    perks: [
      'Branded space on the floor',
      'General admission tickets',
      'Dedicated social post',
      'Logo on event website and programme',
      'Brand tagged in event roundup post',
    ],
  },
  {
    tier: 'MEDIA / COMMUNITY PARTNER',
    color: B.neonCyan,
    featured: false,
    perks: [
      'Cross-promotion across your platform',
      'Event coverage rights (media partners)',
      'Branded presence on community pages',
      'Joint content opportunities with @sneakersfest5555',
      'Negotiated by activation value — open to proposals',
    ],
  },
]

function encode(data) {
  return Object.entries(data).map(([k, v]) => encodeURIComponent(k) + '=' + encodeURIComponent(v)).join('&')
}

export default function Sponsors() {
  const [form, setForm] = useState({ brand:'', contact:'', email:'', phone:'', website:'', tier:'PRESENTING SPONSOR', goals:'', ideas:'' })
  const [submitted, setSubmitted] = useState(false)
  const [sending, setSending] = useState(false)
  const [err, setErr] = useState('')
  const [hoveredTier, setHoveredTier] = useState(null)

  function handleSubmit(e) {
    e.preventDefault()
    if (!form.brand.trim() || !form.contact.trim() || !form.email.trim()) {
      setErr('Brand name, contact name, and email are required.')
      return
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      setErr('Enter a valid email address.')
      return
    }
    setErr('')
    setSending(true)
    fetch('/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: encode({ 'form-name': 'partner-application', ...form }),
    })
      .then(() => { setSending(false); setSubmitted(true) })
      .catch(() => { setSending(false); setErr('Submission failed. Email us directly: sponsors@sneakersfest.com') })
  }

  return (
    <section id="sponsors" style={{ background: B.black, position: 'relative', overflow: 'hidden' }}>
      <GrainOverlay />
      <Egg id="egg-015" corner="top-right" />
      <Egg id="egg-016" corner="bottom-left" />
      <ScanLines />

      {/* ── HERO ── */}
      <div style={{ background: 'linear-gradient(160deg, #0f0800 0%, #1a0c00 40%, #0a0a0a 100%)', padding: '100px 24px 80px', position: 'relative', textAlign: 'center', borderBottom: `1px solid ${B.amber}20` }}>
        <div style={{ position: 'absolute', top: '30%', left: '50%', transform: 'translateX(-50%)', width: 600, height: 400, background: `radial-gradient(ellipse, ${B.amber}18 0%, transparent 70%)`, filter: 'blur(80px)', pointerEvents: 'none' }} />
        <div style={{ position: 'relative', zIndex: 2, maxWidth: 760, margin: '0 auto' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 10, background: `${B.amber}18`, border: `1px solid ${B.amber}40`, borderRadius: 20, padding: '6px 16px', marginBottom: 28 }}>
            <span style={{ fontFamily: "'Space Mono',monospace", fontSize: 9, color: B.amber, letterSpacing: 3 }}>DECEMBER 12, 2026 · LAGOS</span>
          </div>
          <h2 className="reveal-3d text-3d" style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: 'clamp(48px,9vw,96px)', color: B.white, lineHeight: 0.88, letterSpacing: 2, marginBottom: 24 }}>
            PARTNER WITH<br /><span style={{ color: B.amber }}>SNEAKERS FEST 2026</span>
          </h2>
          <p style={{ fontFamily: "'Syne',sans-serif", fontSize: 17, color: '#aaa', maxWidth: 560, margin: '0 auto 36px', lineHeight: 1.75 }}>
            Place your brand at the centre of Lagos sneaker culture — on event day and across 52 weeks of year-round community activation.
          </p>
          <a href="#partner-form" style={{ display: 'inline-block', background: B.amber, color: B.black, padding: '16px 48px', fontFamily: "'Bebas Neue',sans-serif", fontSize: 20, letterSpacing: 3, borderRadius: 6, textDecoration: 'none', boxShadow: `0 0 40px ${B.amber}40`, transition: 'transform 0.2s' }}
            onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.04)'}
            onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}>
            APPLY TO PARTNER →
          </a>
        </div>
      </div>

      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 24px 100px' }}>

        {/* ── STATS BAR ── */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', background: 'rgba(255,255,255,0.02)', border: `1px solid ${B.amber}20`, borderRadius: 12, overflow: 'hidden', margin: '56px 0' }}>
          {STATS.map(({ value, label }, i) => (
            <div key={label} style={{ padding: '28px 20px', textAlign: 'center', borderRight: i < STATS.length - 1 ? `1px solid ${B.amber}12` : 'none' }}>
              <div style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: 38, color: B.amber, lineHeight: 1 }}>{value}</div>
              <div style={{ fontFamily: "'Space Mono',monospace", fontSize: 8, color: B.smoke, letterSpacing: 3, marginTop: 6 }}>{label}</div>
            </div>
          ))}
        </div>

        {/* ── AUDIENCE ── */}
        <div style={{ marginBottom: 72 }}>
          <SectionTag>WHO YOU REACH</SectionTag>
          <h3 className="reveal-3d" style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: 'clamp(32px,5vw,52px)', color: B.white, letterSpacing: 2, marginBottom: 32 }}>THE SNEAKERS FEST AUDIENCE</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16 }}>
            {AUDIENCE.map(({ icon, title, desc, color }) => (
              <div key={title} className="card-3d" style={{ background: 'rgba(255,255,255,0.025)', border: `1px solid ${color}25`, borderTop: `2px solid ${color}`, borderRadius: 10, padding: '24px 20px', transition: 'all 0.2s' }}
                onMouseEnter={e => { e.currentTarget.style.background = `${color}0a`; e.currentTarget.style.borderColor = `${color}50` }}
                onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.025)'; e.currentTarget.style.borderColor = `${color}25` }}>
                <div style={{ fontSize: 28, marginBottom: 12 }}>{icon}</div>
                <div style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: 18, color: B.white, letterSpacing: 1, marginBottom: 10 }}>{title}</div>
                <div style={{ fontFamily: "'Syne',sans-serif", fontSize: 13, color: B.smoke, lineHeight: 1.7 }}>{desc}</div>
              </div>
            ))}
          </div>
        </div>

        {/* ── PARTNER LEVELS ── */}
        <div style={{ marginBottom: 80 }}>
          <SectionTag>PARTNERSHIP LEVELS</SectionTag>
          <h3 className="reveal-3d" style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: 'clamp(32px,5vw,52px)', color: B.white, letterSpacing: 2, marginBottom: 32 }}>WAYS TO PARTNER</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 20 }}>
            {PARTNER_LEVELS.map(({ tier, color, featured, badge, perks }) => (
              <div key={tier}
                onMouseEnter={() => setHoveredTier(tier)}
                onMouseLeave={() => setHoveredTier(null)}
                style={{ position: 'relative', background: featured ? `linear-gradient(135deg, ${B.amber}14, ${B.amber}04)` : 'rgba(255,255,255,0.03)', border: `1px solid ${color}${hoveredTier === tier || featured ? '55' : '25'}`, borderRadius: 16, padding: '28px 22px', overflow: 'hidden', transition: 'transform 0.2s, box-shadow 0.2s', transform: hoveredTier === tier ? 'translateY(-5px)' : featured ? 'scale(1.02)' : 'none', boxShadow: hoveredTier === tier ? `0 16px 48px ${color}20` : featured ? `0 8px 28px ${color}15` : 'none' }}>
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: `linear-gradient(90deg, ${color}, transparent)` }} />
                {badge && <div style={{ position: 'absolute', top: 14, right: 14, background: B.amber, color: B.black, fontFamily: "'Bebas Neue',sans-serif", fontSize: 9, letterSpacing: 2, padding: '3px 8px', borderRadius: 4 }}>{badge}</div>}
                <div style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: 24, color: B.white, letterSpacing: 1, marginBottom: 24 }}>{tier}</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
                  {perks.map(p => (
                    <div key={p} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                      <span style={{ color, fontSize: 13, flexShrink: 0, marginTop: 1 }}>✓</span>
                      <span style={{ fontFamily: "'Syne',sans-serif", fontSize: 12.5, color: B.smoke, lineHeight: 1.5 }}>{p}</span>
                    </div>
                  ))}
                </div>
                <a href="#partner-form" style={{ display: 'block', marginTop: 22, textAlign: 'center', padding: '10px', background: `${color}18`, border: `1px solid ${color}40`, borderRadius: 6, fontFamily: "'Bebas Neue',sans-serif", fontSize: 13, letterSpacing: 2, color, textDecoration: 'none', transition: 'background 0.2s' }}
                  onMouseEnter={e => e.currentTarget.style.background = `${color}30`}
                  onMouseLeave={e => e.currentTarget.style.background = `${color}18`}>
                  APPLY FOR THIS LEVEL →
                </a>
              </div>
            ))}
          </div>
        </div>

        {/* ── FORM ── */}
        <div id="partner-form" style={{ background: 'rgba(255,255,255,0.02)', border: `1px solid ${B.amber}25`, borderRadius: 16, padding: '48px', scrollMarginTop: 80 }}>
          {submitted ? (
            <div style={{ textAlign: 'center', padding: '20px 0' }}>
              <div style={{ fontSize: 52, marginBottom: 20 }}>🤝</div>
              <div style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: 'clamp(28px,5vw,48px)', color: B.amber, letterSpacing: 2, marginBottom: 12 }}>
                APPLICATION RECEIVED
              </div>
              <div style={{ fontFamily: "'Syne',sans-serif", fontSize: 16, color: B.white, marginBottom: 8 }}>
                Thanks, <strong>{form.contact || form.brand}</strong>.
              </div>
              <div style={{ fontFamily: "'Syne',sans-serif", fontSize: 15, color: B.smoke, maxWidth: 480, margin: '0 auto 28px', lineHeight: 1.75 }}>
                Your <strong style={{ color: B.amber }}>{form.tier}</strong> application for <strong style={{ color: B.white }}>{form.brand}</strong> is in. We review all applications and come back within 3 business days with a tailored proposal.
              </div>
              <div style={{ fontFamily: "'Space Mono',monospace", fontSize: 10, color: '#444', letterSpacing: 2 }}>sponsors@sneakersfest.com · Sneakers Fest 2026</div>
            </div>
          ) : (
            <>
              <div style={{ marginBottom: 36 }}>
                <SectionTag>PARTNERSHIP APPLICATION</SectionTag>
                <h3 style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: 'clamp(28px,4vw,44px)', color: B.white, letterSpacing: 2, marginBottom: 8 }}>APPLY TO PARTNER</h3>
                <p style={{ fontFamily: "'Syne',sans-serif", fontSize: 14, color: B.smoke, lineHeight: 1.7, maxWidth: 580 }}>
                  Every partnership is tailored to the brand. Early sponsors get founding-partner recognition that scales with the event. Fill in what you know — we'll come back with a proposal built around your goals.
                </p>
              </div>
              <form name="partner-application" data-netlify="true" onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                <input type="hidden" name="form-name" value="partner-application" />
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                  {[
                    { field: 'brand',   label: 'BRAND / COMPANY NAME *', ph: 'Nike, Adidas, etc.' },
                    { field: 'contact', label: 'CONTACT NAME *',          ph: 'Your full name' },
                    { field: 'email',   label: 'EMAIL ADDRESS *',          ph: 'you@brand.com' },
                    { field: 'phone',   label: 'PHONE (OPTIONAL)',          ph: '+234 ...' },
                  ].map(({ field, label, ph }) => (
                    <div key={field}>
                      <div style={{ fontFamily: "'Space Mono',monospace", fontSize: 8, color: '#555', letterSpacing: 2, marginBottom: 7 }}>{label}</div>
                      <input
                        name={field} value={form[field]}
                        onChange={e => setForm(f => ({ ...f, [field]: e.target.value }))}
                        placeholder={ph}
                        style={{ width: '100%', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 6, color: B.white, padding: '11px 14px', fontFamily: "'Syne',sans-serif", fontSize: 14, outline: 'none', boxSizing: 'border-box' }}
                        onFocus={e => e.target.style.borderColor = `${B.amber}60`}
                        onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
                      />
                    </div>
                  ))}
                </div>
                <div>
                  <div style={{ fontFamily: "'Space Mono',monospace", fontSize: 8, color: '#555', letterSpacing: 2, marginBottom: 7 }}>WEBSITE (OPTIONAL)</div>
                  <input name="website" value={form.website} onChange={e => setForm(f => ({ ...f, website: e.target.value }))} placeholder="https://yourbrand.com"
                    style={{ width: '100%', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 6, color: B.white, padding: '11px 14px', fontFamily: "'Syne',sans-serif", fontSize: 14, outline: 'none', boxSizing: 'border-box' }}
                    onFocus={e => e.target.style.borderColor = `${B.amber}60`}
                    onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'} />
                </div>
                <div>
                  <div style={{ fontFamily: "'Space Mono',monospace", fontSize: 8, color: '#555', letterSpacing: 2, marginBottom: 7 }}>PARTNERSHIP LEVEL OF INTEREST *</div>
                  <select name="tier" value={form.tier} onChange={e => setForm(f => ({ ...f, tier: e.target.value }))}
                    style={{ width: '100%', background: '#111', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 6, color: B.white, padding: '11px 14px', fontFamily: "'Syne',sans-serif", fontSize: 14, outline: 'none', cursor: 'pointer', boxSizing: 'border-box' }}>
                    {PARTNER_LEVELS.map(t => <option key={t.tier} value={t.tier}>{t.tier}</option>)}
                  </select>
                </div>
                {[
                  { field: 'goals', label: 'MARKETING GOALS *', ph: 'What do you want to achieve? Brand awareness, product launch, community engagement...', rows: 3 },
                  { field: 'ideas', label: 'ACTIVATION IDEAS (OPTIONAL)', ph: 'Any specific ideas you bring? Giveaways, exclusive drops, live demos, challenges...', rows: 3 },
                ].map(({ field, label, ph, rows }) => (
                  <div key={field}>
                    <div style={{ fontFamily: "'Space Mono',monospace", fontSize: 8, color: '#555', letterSpacing: 2, marginBottom: 7 }}>{label}</div>
                    <textarea name={field} value={form[field]} onChange={e => setForm(f => ({ ...f, [field]: e.target.value }))} placeholder={ph} rows={rows}
                      style={{ width: '100%', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 6, color: B.white, padding: '11px 14px', fontFamily: "'Syne',sans-serif", fontSize: 14, outline: 'none', resize: 'vertical', boxSizing: 'border-box' }}
                      onFocus={e => e.target.style.borderColor = `${B.amber}60`}
                      onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'} />
                  </div>
                ))}
                {err && <div style={{ fontFamily: "'Space Mono',monospace", fontSize: 11, color: B.neonMagenta }}>{err}</div>}
                <div style={{ display: 'flex', alignItems: 'center', gap: 20, flexWrap: 'wrap' }}>
                  <button type="submit" disabled={sending}
                    style={{ background: sending ? B.gunmetal : B.amber, color: B.black, border: 'none', padding: '14px 44px', fontFamily: "'Bebas Neue',sans-serif", fontSize: 18, letterSpacing: 3, borderRadius: 6, cursor: sending ? 'not-allowed' : 'pointer', boxShadow: sending ? 'none' : `0 0 32px ${B.amber}40`, transition: 'all 0.2s' }}>
                    {sending ? 'SENDING...' : 'SUBMIT APPLICATION →'}
                  </button>
                  <span style={{ fontFamily: "'Space Mono',monospace", fontSize: 9, color: '#333', letterSpacing: 1 }}>We reply within 3 business days</span>
                </div>
              </form>
            </>
          )}
        </div>

      </div>
    </section>
  )
}
