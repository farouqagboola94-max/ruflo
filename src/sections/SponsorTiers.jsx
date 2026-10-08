import { useState } from 'react'
import { B } from '../tokens'
import { GrainOverlay, SectionTag } from '../components/Shared'
import { SOCIAL_LINKS } from '../config'
import Egg from '../components/Egg'

const TIERS = [
  {
    id: 'bronze',
    name: 'BRONZE',
    color: '#CD7F32',
    tag: 'ENTRY PARTNER',
    capacity: 10,
    taken: 4,
    perks: [
      'Logo on event website (footer)',
      'Brand mention in 2 social posts',
      'Logo on event signage',
      '2 complimentary General tickets',
      'Post-event recap mention',
    ],
  },
  {
    id: 'silver',
    name: 'SILVER',
    color: '#C0C0C0',
    tag: 'BRAND PARTNER',
    capacity: 6,
    taken: 3,
    perks: [
      'Everything in Bronze',
      'Branded 3×3m booth space on floor',
      '5 complimentary VIP tickets',
      'Dedicated social post (IG + X)',
      'Logo on stage backdrop',
      'Brand rep in press kit',
    ],
  },
  {
    id: 'gold',
    name: 'GOLD',
    color: B.amber,
    tag: 'STAGE PARTNER',
    featured: true,
    capacity: 3,
    taken: 1,
    perks: [
      'Everything in Silver',
      'Named stage sponsorship',
      'MC brand mentions throughout event',
      '10 complimentary VVIP tickets',
      'Exclusive product placement zone',
      '3 dedicated social posts + reel',
      'Co-branded event content',
      'Logo on all printed materials',
    ],
  },
  {
    id: 'platinum',
    name: 'PLATINUM',
    color: B.neonCyan,
    tag: 'TITLE SPONSOR',
    capacity: 1,
    taken: 0,
    perks: [
      'Everything in Gold',
      'Title rights: "[Brand] presents Sneakers Fest \'26"',
      'Full custom brand experience zone',
      'Unlimited Phalanx tickets',
      'Exclusive drop collaboration rights',
      '3-month pre-event campaign inclusion',
      'Opening ceremony presence',
      'Priority press & media access',
      'Post-event brand impact report',
    ],
  },
]

const STATS = [
  { value: '2,500+', label: 'TARGET ATTENDEES' },
  { value: '18–35',  label: 'AGE RANGE' },
  { value: '70%+',   label: 'LAGOS MARKET' },
  { value: '₦50M+',  label: 'COMBINED REACH' },
]

const CONTACT_EMAIL = 'sneakersfest088@gmail.com'

export default function SponsorTiers() {
  const [submitted, setSubmitted] = useState(false)
  const [form, setForm]           = useState({ brand: '', contact: '', email: '', tier: '', note: '' })
  const [loading, setLoading]     = useState(false)

  const FORMSPREE   = import.meta.env.VITE_FORMSPREE_ID || ''
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL  || ''

  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }))

  async function submit(e) {
    e.preventDefault()
    if (!form.brand.trim() || !form.email.includes('@') || !form.tier) return
    setLoading(true)
    const payload = { ...form, _subject: `Sponsor Enquiry [${form.tier}] — ${form.brand}` }
    let ok = false
    if (BACKEND_URL) {
      try { const r = await fetch(`${BACKEND_URL}/api/sponsor-enquiry`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) }); ok = r.ok } catch {}
    }
    if (!ok && FORMSPREE) {
      try { const r = await fetch(`https://formspree.io/f/${FORMSPREE}`, { method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json' }, body: JSON.stringify(payload) }); ok = r.ok } catch {}
    }
    setLoading(false)
    setSubmitted(true)
  }

  const IS = { width: '100%', padding: '11px 14px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.09)', borderRadius: 8, color: B.white, fontFamily: 'Space Mono,monospace', fontSize: 13, outline: 'none', boxSizing: 'border-box', transition: 'border-color 0.2s' }
  const lbl = t => <label style={{ fontFamily: 'Space Mono,monospace', fontSize: 8, color: B.smoke, letterSpacing: '0.25em', display: 'block', marginBottom: 7 }}>{t}</label>
  const onFocus = e => e.target.style.borderColor = B.amber + '60'
  const onBlur  = e => e.target.style.borderColor = 'rgba(255,255,255,0.09)'

  return (
    <section id="sponsor-tiers" style={{ position: 'relative', overflow: 'hidden', background: '#07070C', padding: '100px 24px' }}>
      <GrainOverlay />
      <Egg id="egg-101" corner="top-right" />
      <Egg id="egg-102" corner="bottom-left" />

      <div style={{ position: 'absolute', top: '10%', right: '-5%', width: 500, height: 500, background: `radial-gradient(circle, ${B.amber}08 0%, transparent 70%)`, filter: 'blur(100px)', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', bottom: '15%', left: '-5%', width: 400, height: 400, background: `radial-gradient(circle, ${B.neonCyan}07 0%, transparent 70%)`, filter: 'blur(80px)', pointerEvents: 'none' }} />

      <div style={{ position: 'relative', zIndex: 10, maxWidth: 1100, margin: '0 auto' }}>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 64 }}>
          <SectionTag>PARTNERSHIP OPPORTUNITIES</SectionTag>
          <div className="reveal-3d text-3d" style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 'clamp(40px,6vw,72px)', color: B.white, lineHeight: 0.9, marginBottom: 16 }}>
            PARTNER<br /><span style={{ color: B.amber }}>WITH US</span>
          </div>
          <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 14, color: B.smoke, lineHeight: 1.8, maxWidth: 560, margin: '0 auto' }}>
            Reach Lagos' most engaged sneaker and streetwear audience. Sneakers Fest '26 is the premier cultural drop event in West Africa — and we're building it with brands who get it.
          </div>
        </div>

        {/* Audience stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 64 }}>
          {STATS.map((s, i) => (
            <div key={i} className="card-3d" style={{ padding: '20px 16px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 10, textAlign: 'center' }}>
              <div style={{ fontFamily: "'Orbitron', monospace", fontWeight: 900, fontSize: 22, color: B.amber, marginBottom: 6 }}>{s.value}</div>
              <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 9, color: B.smoke, letterSpacing: '0.2em' }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Tier cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 20, marginBottom: 72, alignItems: 'start' }}>
          {TIERS.map((tier) => {
            const pct  = tier.taken / tier.capacity
            const left = tier.capacity - tier.taken
            const urgColor = pct >= 1 ? B.neonMagenta : pct >= 0.6 ? B.amber : tier.color
            return (
              <div
                key={tier.id}
                style={{
                  position: 'relative',
                  background: tier.featured ? `rgba(245,166,35,0.06)` : 'rgba(255,255,255,0.03)',
                  border: `1px solid ${tier.featured ? tier.color + '50' : 'rgba(255,255,255,0.08)'}`,
                  borderRadius: 14,
                  overflow: 'hidden',
                  transform: tier.featured ? 'scale(1.03)' : 'scale(1)',
                  boxShadow: tier.featured ? `0 8px 40px rgba(0,0,0,0.5), 0 0 0 1px ${tier.color}15` : '0 4px 24px rgba(0,0,0,0.4)',
                }}
              >
                <div style={{ height: 3, background: `linear-gradient(90deg, ${tier.color}, ${tier.color}30)` }} />
                {tier.featured && (
                  <div style={{ position: 'absolute', top: 14, right: 14, padding: '3px 10px', background: `${tier.color}20`, border: `1px solid ${tier.color}50`, borderRadius: 3, fontFamily: 'Space Mono,monospace', fontSize: 9, color: tier.color, letterSpacing: '0.2em' }}>MOST POPULAR</div>
                )}
                <div style={{ padding: 28 }}>
                  <div style={{ marginBottom: 10 }}>
                    <span style={{ padding: '3px 10px', borderRadius: 2, background: tier.color + '18', border: `1px solid ${tier.color}40`, fontFamily: 'Space Mono,monospace', fontSize: 9, color: tier.color, letterSpacing: '0.18em' }}>{tier.tag}</span>
                  </div>
                  <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 34, color: B.white, letterSpacing: '0.06em', marginBottom: 16 }}>{tier.name}</div>

                  {/* availability bar */}
                  <div style={{ marginBottom: 20 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
                      <span style={{ fontFamily: 'Space Mono,monospace', fontSize: 9, color: urgColor, letterSpacing: 1 }}>
                        {pct >= 1 ? 'SOLD OUT' : pct >= 0.6 ? 'FILLING FAST' : 'AVAILABLE'}
                      </span>
                      <span style={{ fontFamily: 'Space Mono,monospace', fontSize: 9, color: B.dim }}>{left} of {tier.capacity} left</span>
                    </div>
                    <div style={{ height: 3, background: 'rgba(255,255,255,0.06)', borderRadius: 2, overflow: 'hidden' }}>
                      <div style={{ height: '100%', width: `${Math.min(pct * 100, 100)}%`, background: urgColor, borderRadius: 2 }} />
                    </div>
                  </div>

                  <div style={{ width: '100%', height: 1, background: 'rgba(255,255,255,0.07)', marginBottom: 20 }} />

                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 28 }}>
                    {tier.perks.map((perk, i) => (
                      <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                        <div style={{ width: 6, height: 6, borderRadius: '50%', background: tier.color, boxShadow: `0 0 8px ${tier.color}`, flexShrink: 0, marginTop: 5 }} />
                        <span style={{ fontFamily: "'Syne', sans-serif", fontSize: 13, color: B.smoke, lineHeight: 1.5 }}>{perk}</span>
                      </div>
                    ))}
                  </div>

                  <a
                    href={`mailto:${CONTACT_EMAIL}?subject=Sponsor Enquiry [${tier.name}]&body=Hi, I'm interested in the ${tier.name} sponsorship package for Sneakers Fest '26.`}
                    style={{
                      display: 'block', width: '100%', padding: '13px 0', textAlign: 'center', textDecoration: 'none',
                      background: tier.featured ? tier.color : 'transparent',
                      border: `1px solid ${tier.color}`,
                      borderRadius: 6,
                      fontFamily: 'Space Mono,monospace', fontSize: 10, fontWeight: 700,
                      color: tier.featured ? B.black : tier.color,
                      letterSpacing: '0.15em',
                      boxShadow: tier.featured ? `0 0 24px ${tier.color}35` : 'none',
                      transition: 'all 0.2s',
                    }}
                  >
                    {pct >= 1 ? 'JOIN WAITLIST →' : 'ENQUIRE NOW →'}
                  </a>
                </div>
              </div>
            )
          })}
        </div>

        {/* Enquiry form */}
        <div style={{ maxWidth: 640, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 36 }}>
            <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 8, color: B.smoke, letterSpacing: '0.3em', marginBottom: 10 }}>SEND US A BRIEF</div>
            <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 36, color: B.white }}>GET THE FULL DECK</div>
            <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 13, color: B.smoke, marginTop: 8 }}>Drop your details and we'll send the official sponsorship deck within 24 hours.</div>
          </div>

          {submitted ? (
            <div className="card-3d" style={{ padding: '40px 32px', background: `rgba(0,240,255,0.03)`, border: `1px solid ${B.neonCyan}25`, borderRadius: 16, textAlign: 'center' }}>
              <div style={{ width: 52, height: 52, borderRadius: '50%', border: `2px solid ${B.neonLime}`, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M5 13l4 4L19 7" stroke={B.neonLime} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </div>
              <div style={{ fontFamily: "'Orbitron', monospace", fontSize: 10, color: B.neonLime, letterSpacing: 3, marginBottom: 8 }}>ENQUIRY RECEIVED</div>
              <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 28, color: B.white }}>WE'LL BE IN TOUCH</div>
              <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 13, color: B.smoke, marginTop: 8 }}>Sponsorship deck heading to <span style={{ color: B.amber }}>{form.email}</span> within 24 hours.</div>
            </div>
          ) : (
            <form onSubmit={submit} className="card-3d" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 16, overflow: 'hidden' }}>
              <div style={{ height: 3, background: `linear-gradient(90deg, ${B.amber}, ${B.neonCyan}, ${B.neonMagenta})` }} />
              <div style={{ padding: 32, display: 'flex', flexDirection: 'column', gap: 20 }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                  <div>{lbl('BRAND / COMPANY *')}<input aria-label="Brand name" required value={form.brand} onChange={set('brand')} placeholder="Your brand name" style={IS} onFocus={onFocus} onBlur={onBlur} /></div>
                  <div>{lbl('CONTACT PERSON *')}<input aria-label="Your name" required value={form.contact} onChange={set('contact')} placeholder="Your name" style={IS} onFocus={onFocus} onBlur={onBlur} /></div>
                </div>
                <div>{lbl('EMAIL ADDRESS *')}<input aria-label="Email address" required type="email" value={form.email} onChange={set('email')} placeholder="your@email.com" style={IS} onFocus={onFocus} onBlur={onBlur} /></div>
                <div>
                  {lbl('INTERESTED TIER *')}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 8 }}>
                    {TIERS.map(t => (
                      <button key={t.id} type="button" onClick={() => setForm(f => ({ ...f, tier: t.name }))}
                        style={{ padding: '9px 6px', background: form.tier === t.name ? `${t.color}18` : 'rgba(255,255,255,0.03)', border: `1px solid ${form.tier === t.name ? t.color : 'rgba(255,255,255,0.09)'}`, borderRadius: 6, cursor: 'pointer', fontFamily: 'Space Mono,monospace', fontSize: 9, color: form.tier === t.name ? t.color : B.smoke, letterSpacing: 1, transition: 'all 0.2s' }}>
                        {t.name}
                      </button>
                    ))}
                  </div>
                </div>
                <div>{lbl('NOTES / GOALS (optional)')}<textarea aria-label="What you want from this partnership" value={form.note} onChange={set('note')} placeholder="What do you want to achieve from this partnership?" rows={3} style={{ ...IS, resize: 'vertical', lineHeight: 1.6 }} onFocus={onFocus} onBlur={onBlur} /></div>
                <button type="submit" disabled={loading}
                  style={{ padding: '14px', background: loading ? 'rgba(255,255,255,0.04)' : B.amber, border: 'none', borderRadius: 8, color: loading ? B.dim : B.black, fontFamily: 'Orbitron,monospace', fontSize: 12, fontWeight: 700, letterSpacing: 2, cursor: loading ? 'not-allowed' : 'pointer', boxShadow: loading ? 'none' : `0 0 28px ${B.amber}35`, transition: 'all 0.2s' }}>
                  {loading ? 'SENDING…' : 'REQUEST SPONSORSHIP DECK →'}
                </button>
              </div>
            </form>
          )}

          <div style={{ textAlign: 'center', marginTop: 28, display: 'flex', flexDirection: 'column', gap: 8 }}>
            <div style={{ fontFamily: 'Space Mono,monospace', fontSize: 9, color: B.dim }}>Or reach us directly</div>
            <div style={{ display: 'flex', justifyContent: 'center', gap: 20, flexWrap: 'wrap' }}>
              <a href={`mailto:${CONTACT_EMAIL}`} style={{ fontFamily: 'Space Mono,monospace', fontSize: 10, color: B.amber, textDecoration: 'none', letterSpacing: 1 }}>{CONTACT_EMAIL}</a>
              <a href={SOCIAL_LINKS.whatsapp} target="_blank" rel="noopener noreferrer" style={{ fontFamily: 'Space Mono,monospace', fontSize: 10, color: B.neonLime, textDecoration: 'none', letterSpacing: 1 }}>WhatsApp →</a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
