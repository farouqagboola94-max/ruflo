import { useState, useEffect } from 'react'
import { B } from '../tokens'
import { GrainOverlay, SectionTag } from '../components/Shared'

const FORMSPREE   = import.meta.env.VITE_FORMSPREE_ID   || ''
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL     || ''

const CATEGORIES = ['Sneakers', 'Apparel', 'Accessories', 'Vintage', 'Custom Art', 'Food & Beverage', 'Tech / Photography', 'Other']

const BOOTHS = [
  { id: 'standard',  label: 'Standard',  size: '3 × 3 m', price: 150000, capacity: 20, features: ['Table + 2 chairs', 'Power outlet', 'Booth ID signage'] },
  { id: 'double',    label: 'Double',    size: '6 × 3 m', price: 280000, capacity: 10, features: ['2 Tables + 4 chairs', '2 Power outlets', 'Corner visibility option'] },
  { id: 'premium',   label: 'Premium Corner', size: '4 × 4 m', price: 400000, capacity: 6, features: ['High-traffic corner', 'LED spotlight', 'Social media feature', 'Extra storage'] },
  { id: 'collab',    label: 'Exclusive Collab', size: 'Custom', price: null, capacity: 3, features: ['Exclusive drop opportunity', 'Co-branded marketing', 'Custom build-out', 'Direct negotiation'] },
]

const FAQ = [
  { q: 'Who attends?', a: 'Lagos sneakerheads, streetwear creatives, collectors, content creators, and brand enthusiasts. Year 1 target: 1,000 to 2,500 attendees.' },
  { q: 'Can I do an exclusive drop at the event?', a: 'Yes. Limited collab and exclusive drop opportunities are available — separate from the standard vendor package. Select "Exclusive Collab Tier" or contact directly.' },
  { q: 'How are vendors selected?', a: 'Year 1 is invitation-curated. We\'re building a first cohort of 30 confirmed vendors before announcing publicly. Applications are reviewed within 3 business days.' },
  { q: 'What does the stall include?', a: 'Booth space, table, power connection, and setup time. Full spec sheet sent on confirmation. Specific inclusions depend on tier selected.' },
]

function genAppId() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  let id = 'VSF26-'
  for (let i = 0; i < 6; i++) id += chars[Math.floor(Math.random() * chars.length)]
  return id
}

function BoothCard({ booth, selected, onSelect, taken }) {
  const pct = taken / booth.capacity
  const statusColor = pct >= 1 ? B.neonMagenta : pct >= 0.7 ? B.amber : B.neonLime
  const statusText  = pct >= 1 ? 'FULL' : pct >= 0.7 ? 'FILLING FAST' : 'AVAILABLE'
  const isFull = pct >= 1

  return (
    <div
      onClick={() => !isFull && onSelect(booth.id)}
      style={{
        padding: 16, borderRadius: 8, cursor: isFull ? 'not-allowed' : 'pointer',
        border: `1px solid ${selected ? B.neonCyan : isFull ? '#333' : 'rgba(255,255,255,0.09)'}`,
        background: selected ? `${B.neonCyan}08` : isFull ? 'rgba(255,255,255,0.02)' : 'rgba(255,255,255,0.03)',
        transition: 'all 0.2s', opacity: isFull ? 0.5 : 1,
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
        <div>
          <div style={{ fontFamily: 'Bebas Neue,sans-serif', fontSize: 16, color: selected ? B.neonCyan : B.white, letterSpacing: 1 }}>{booth.label}</div>
          <div style={{ fontFamily: 'Space Mono,monospace', fontSize: 9, color: B.smoke, marginTop: 2 }}>{booth.size}</div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontFamily: 'Bebas Neue,sans-serif', fontSize: 18, color: B.amber }}>
            {booth.price ? `₦${booth.price.toLocaleString('en-NG')}` : 'CONTACT'}
          </div>
          <div style={{ fontFamily: 'Space Mono,monospace', fontSize: 8, color: statusColor, letterSpacing: 1, marginTop: 2 }}>{statusText}</div>
        </div>
      </div>

      {/* capacity bar */}
      <div style={{ height: 3, background: '#1a1a1a', borderRadius: 2, marginBottom: 10, overflow: 'hidden' }}>
        <div style={{ height: '100%', width: `${Math.min(pct * 100, 100)}%`, background: statusColor, borderRadius: 2, transition: 'width 0.5s' }} />
      </div>
      <div style={{ fontFamily: 'Space Mono,monospace', fontSize: 8, color: B.smoke, marginBottom: 8 }}>
        {booth.capacity - taken} of {booth.capacity} spots remaining
      </div>

      <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 4 }}>
        {booth.features.map(f => (
          <li key={f} style={{ fontFamily: 'Syne,sans-serif', fontSize: 11, color: selected ? B.white : B.smoke, display: 'flex', gap: 6, alignItems: 'center' }}>
            <span style={{ color: selected ? B.neonCyan : '#444', flexShrink: 0 }}>◆</span>{f}
          </li>
        ))}
      </ul>
    </div>
  )
}

export default function VendorReg() {
  const [form, setForm]     = useState({ business: '', contact: '', email: '', phone: '', booth: '', category: '', bio: '' })
  const [status, setStatus] = useState('idle')
  const [openFaq, setOpenFaq] = useState(null)
  const [appId, setAppId]   = useState('')
  const [taken, setTaken]   = useState({ standard: 8, double: 5, premium: 3, collab: 1 })

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem('sf26_vendor_taken') || '{}')
      if (Object.keys(saved).length) setTaken(t => ({ ...t, ...saved }))
    } catch {}
  }, [])

  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }))

  async function submit(e) {
    e.preventDefault()
    if (!form.category) { alert('Please select a product category.'); return }
    const id = genAppId()
    setStatus('loading')

    const payload = { ...form, applicationId: id, _subject: `Vendor Application [${id}] — ${form.business}` }

    let ok = false

    // 1. Try dedicated backend if configured
    if (BACKEND_URL) {
      try {
        const r = await fetch(`${BACKEND_URL}/api/vendor-applications`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        })
        ok = r.ok
      } catch {}
    }

    // 2. Fall back to Formspree
    if (!ok && FORMSPREE) {
      try {
        const r = await fetch(`https://formspree.io/f/${FORMSPREE}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
          body: JSON.stringify(payload),
        })
        ok = r.ok
      } catch {}
    }

    if (ok || (!BACKEND_URL && !FORMSPREE)) {
      // increment local booth taken count
      const boothKey = form.booth.split(' ')[0].toLowerCase()
      const matched = BOOTHS.find(b => form.booth.toLowerCase().includes(b.id))
      if (matched) {
        const next = { ...taken, [matched.id]: (taken[matched.id] || 0) + 1 }
        setTaken(next)
        try { localStorage.setItem('sf26_vendor_taken', JSON.stringify(next)) } catch {}
      }
      // store application
      try {
        const apps = JSON.parse(localStorage.getItem('sf26_vendor_apps') || '[]')
        apps.push({ ...payload, submittedAt: new Date().toISOString() })
        localStorage.setItem('sf26_vendor_apps', JSON.stringify(apps))
      } catch {}
      setAppId(id)
      setStatus('success')
    } else {
      setStatus('error')
    }
  }

  const inputStyle = {
    width: '100%', padding: '12px 14px',
    background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.09)',
    borderRadius: 8, color: B.white, fontFamily: 'Space Mono,monospace', fontSize: 13,
    outline: 'none', boxSizing: 'border-box', transition: 'border-color 0.2s',
  }
  const lbl = text => (
    <label style={{ fontFamily: 'Space Mono,monospace', fontSize: 8, color: '#555', letterSpacing: '0.25em', display: 'block', marginBottom: 7 }}>
      {text}
    </label>
  )
  const onFocus = e => e.target.style.borderColor = B.neonCyan + '60'
  const onBlur  = e => e.target.style.borderColor = 'rgba(255,255,255,0.09)'

  return (
    <section id="vendors" style={{ position: 'relative', overflow: 'hidden', background: B.black, padding: '100px 24px' }}>
      <GrainOverlay />
      <div style={{ position: 'absolute', bottom: '20%', left: '-5%', width: 400, height: 400, background: `radial-gradient(circle, ${B.neonCyan}07 0%, transparent 70%)`, filter: 'blur(80px)', pointerEvents: 'none' }} />

      <div style={{ position: 'relative', zIndex: 10, maxWidth: 900, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 44 }}>
          <SectionTag>VENDOR APPLICATIONS</SectionTag>
          <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 'clamp(40px, 6vw, 68px)', color: B.white, lineHeight: 0.9, marginBottom: 16 }}>
            CLAIM YOUR<br /><span style={{ color: B.neonCyan }}>BOOTH</span>
          </div>
          <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 14, color: B.smoke, lineHeight: 1.7, maxWidth: 520, margin: '0 auto' }}>
            Year 1 is invitation-curated. We're confirming the first cohort of 30 vendors before announcing publicly. If you sell in the sneaker culture ecosystem — kicks, apparel, art, customs — this is your room.
          </div>
        </div>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 44 }}>
          {[
            { n: '1K–2.5K', l: 'YEAR 1 ATTENDEES',      c: B.neonCyan },
            { n: '30–50',   l: 'VENDOR SPOTS (YEAR 1)',  c: B.amber },
            { n: 'DEC 12',  l: '2026 · LAGOS, NIGERIA',  c: B.neonMagenta },
          ].map((s, i) => (
            <div key={i} style={{ padding: '18px 16px', background: B.charcoal, border: `1px solid ${s.c}28`, borderRadius: 8, textAlign: 'center' }}>
              <div style={{ fontFamily: "'Orbitron', monospace", fontWeight: 900, fontSize: 22, color: s.c, textShadow: `0 0 16px ${s.c}30` }}>{s.n}</div>
              <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 7, color: B.smoke, letterSpacing: '0.15em', marginTop: 6 }}>{s.l}</div>
            </div>
          ))}
        </div>

        {/* FAQ */}
        <div style={{ marginBottom: 40 }}>
          <div style={{ fontFamily: "'Space Mono'", fontSize: 8, letterSpacing: '0.4em', color: B.smoke, marginBottom: 16 }}>VENDOR FAQ</div>
          {FAQ.map((f, i) => (
            <div key={i} style={{ borderBottom: `1px solid ${B.charcoal}`, overflow: 'hidden' }}>
              <button onClick={() => setOpenFaq(openFaq === i ? null : i)}
                style={{ width: '100%', textAlign: 'left', padding: '14px 0', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontFamily: "'Syne'", fontSize: '0.85rem', color: B.white }}>{f.q}</span>
                <span style={{ color: B.amber, fontSize: '1.1rem', flexShrink: 0, marginLeft: 12 }}>{openFaq === i ? '−' : '+'}</span>
              </button>
              {openFaq === i && (
                <div style={{ paddingBottom: 14 }}>
                  <p style={{ fontFamily: "'Syne'", fontSize: '0.82rem', color: B.smoke, lineHeight: 1.7 }}>{f.a}</p>
                </div>
              )}
            </div>
          ))}
        </div>

        {status === 'success' ? (
          <div style={{ padding: '44px 36px', background: `rgba(0,240,255,0.03)`, border: `1px solid ${B.neonCyan}25`, borderRadius: 16 }}>
            <div style={{ textAlign: 'center', marginBottom: 32 }}>
              <div style={{ width: 60, height: 60, borderRadius: '50%', border: `2px solid ${B.neonLime}`, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                <svg width="26" height="26" viewBox="0 0 24 24" fill="none"><path d="M5 13l4 4L19 7" stroke={B.neonLime} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </div>
              <div style={{ fontFamily: "'Orbitron', monospace", fontSize: 10, color: B.neonLime, letterSpacing: 3, marginBottom: 8 }}>APPLICATION RECEIVED</div>
              <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 36, color: B.white, marginBottom: 6 }}>WE'LL BE IN TOUCH</div>
              <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 13, color: B.smoke }}>
                Thanks, <span style={{ color: B.white }}>{form.business}</span>. Confirmation sent to <span style={{ color: B.amber }}>{form.email}</span>.
              </div>
            </div>

            {/* Application ID */}
            <div style={{ background: `${B.amber}08`, border: `1px solid ${B.amber}30`, borderRadius: 8, padding: '16px 20px', textAlign: 'center', marginBottom: 28 }}>
              <div style={{ fontFamily: 'Space Mono,monospace', fontSize: 10, color: B.smoke, letterSpacing: 2, marginBottom: 6 }}>YOUR APPLICATION ID</div>
              <div style={{ fontFamily: 'Orbitron,monospace', fontSize: 24, color: B.amber, letterSpacing: 4, fontWeight: 700 }}>{appId}</div>
              <div style={{ fontFamily: 'Space Mono,monospace', fontSize: 9, color: B.smoke, marginTop: 6 }}>Save this. Reference it in any follow-up communication.</div>
            </div>

            {/* Next steps */}
            <div>
              <div style={{ fontFamily: 'Space Mono,monospace', fontSize: 9, color: B.smoke, letterSpacing: 2, marginBottom: 14 }}>WHAT HAPPENS NEXT</div>
              {[
                { step: '01', title: 'APPLICATION REVIEWED', desc: 'Our team reviews every application within 3 business days.', color: B.neonCyan },
                { step: '02', title: 'SELECTION CONFIRMED', desc: 'Accepted vendors receive a detailed brief and invoice by email.', color: B.amber },
                { step: '03', title: 'BOOTH DEPOSIT', desc: 'Secure your spot with a 50% deposit. Balance due 30 days before event.', color: B.neonLime },
                { step: '04', title: 'EVENT DAY · DEC 12', desc: 'Setup begins at 8am. Doors open at 12pm. Lagos, Nigeria.', color: B.neonMagenta },
              ].map(s => (
                <div key={s.step} style={{ display: 'flex', gap: 16, marginBottom: 14, alignItems: 'flex-start' }}>
                  <div style={{ fontFamily: 'Orbitron,monospace', fontSize: 11, color: s.color, minWidth: 28, marginTop: 2 }}>{s.step}</div>
                  <div>
                    <div style={{ fontFamily: 'Space Mono,monospace', fontSize: 10, color: s.color, letterSpacing: 1, marginBottom: 2 }}>{s.title}</div>
                    <div style={{ fontFamily: 'Syne,sans-serif', fontSize: 12, color: B.smoke, lineHeight: 1.5 }}>{s.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <form onSubmit={submit} style={{ background: 'rgba(255,255,255,0.03)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 16, overflow: 'hidden' }}>
            <div style={{ height: 3, background: `linear-gradient(90deg, ${B.neonCyan}, ${B.amber}, ${B.neonMagenta})` }} />
            <div style={{ padding: 32, display: 'flex', flexDirection: 'column', gap: 24 }}>

              {/* Booth selector */}
              <div>
                {lbl('SELECT BOOTH TYPE *')}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 12 }}>
                  {BOOTHS.map(b => (
                    <BoothCard key={b.id} booth={b} selected={form.booth === b.id} taken={taken[b.id] || 0}
                      onSelect={id => setForm(f => ({ ...f, booth: id }))} />
                  ))}
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <div>{lbl('BUSINESS / BRAND NAME *')}<input value={form.business} onChange={set('business')} placeholder="e.g. Lagos Kicks Co." required style={inputStyle} onFocus={onFocus} onBlur={onBlur} /></div>
                <div>{lbl('CONTACT PERSON *')}<input value={form.contact} onChange={set('contact')} placeholder="Your full name" required style={inputStyle} onFocus={onFocus} onBlur={onBlur} /></div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <div>{lbl('EMAIL ADDRESS *')}<input type="email" value={form.email} onChange={set('email')} placeholder="your@email.com" required style={inputStyle} onFocus={onFocus} onBlur={onBlur} /></div>
                <div>{lbl('PHONE NUMBER *')}<input type="tel" value={form.phone} onChange={set('phone')} placeholder="+234 800 000 0000" required style={inputStyle} onFocus={onFocus} onBlur={onBlur} /></div>
              </div>

              <div>
                {lbl('PRODUCT CATEGORY *')}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                  {CATEGORIES.map(c => (
                    <button key={c} type="button" onClick={() => setForm(f => ({ ...f, category: c }))}
                      style={{ padding: '6px 14px', background: form.category === c ? `${B.neonCyan}18` : 'rgba(255,255,255,0.04)', border: `1px solid ${form.category === c ? B.neonCyan : 'rgba(255,255,255,0.1)'}`, borderRadius: 4, cursor: 'pointer', fontFamily: 'Space Mono,monospace', fontSize: 9, color: form.category === c ? B.neonCyan : B.smoke, letterSpacing: '0.1em', transition: 'all 0.2s' }}>
                      {c}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                {lbl(`TELL US ABOUT YOUR BRAND * (${form.bio.length}/300)`)}
                <textarea value={form.bio} onChange={set('bio')} maxLength={300}
                  placeholder="Describe what you sell, your experience, and why you want to be at Sneakers Fest '26..."
                  rows={4} required
                  style={{ ...inputStyle, resize: 'vertical', lineHeight: 1.6 }}
                  onFocus={e => e.target.style.borderColor = B.neonCyan + '50'} onBlur={onBlur} />
              </div>

              {status === 'error' && (
                <div style={{ padding: '12px 16px', background: `rgba(255,45,123,0.08)`, border: `1px solid ${B.neonMagenta}30`, borderRadius: 8 }}>
                  <div style={{ fontFamily: 'Space Mono,monospace', fontSize: 10, color: B.neonMagenta }}>
                    Submission failed. Email your application to <span style={{ color: B.white }}>vendors@sneakersfest.com</span> with subject line "Vendor Application — {form.business}"
                  </div>
                </div>
              )}

              <button type="submit" disabled={status === 'loading' || !form.booth}
                style={{ padding: '15px', borderRadius: 8, border: 'none', cursor: (status === 'loading' || !form.booth) ? 'not-allowed' : 'pointer', background: (status === 'loading' || !form.booth) ? B.charcoal : B.neonCyan, color: B.black, fontFamily: 'Orbitron,monospace', fontSize: 12, fontWeight: 700, letterSpacing: 2, boxShadow: (status === 'loading' || !form.booth) ? 'none' : `0 0 30px ${B.neonCyan}30`, transition: 'all 0.2s' }}>
                {status === 'loading' ? 'SUBMITTING...' : 'APPLY FOR A BOOTH →'}
              </button>
              <div style={{ fontFamily: 'Space Mono,monospace', fontSize: 8, color: '#333', textAlign: 'center', letterSpacing: '0.15em' }}>
                INVITATION-CURATED · YEAR 1 FIRST COHORT · REVIEWED WITHIN 3 BUSINESS DAYS
              </div>
            </div>
          </form>
        )}
      </div>
    </section>
  )
}
