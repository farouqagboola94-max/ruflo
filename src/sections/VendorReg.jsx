import { useState } from 'react'
import { B } from '../tokens'
import { GrainOverlay, SectionTag } from '../components/Shared'

const FORMSPREE = import.meta.env.VITE_FORMSPREE_ID || ''

const CATEGORIES = ['Sneakers', 'Apparel', 'Accessories', 'Vintage', 'Custom Art', 'Food & Beverage', 'Tech / Photography', 'Other']
const BOOTH_TYPES = ['Standard 3×3m — ₦150,000', 'Double 6×3m — ₦280,000', 'Premium Corner — ₦400,000', 'Exclusive Collab Tier — Contact directly']

const FAQ = [
  { q: 'Who attends?', a: 'Lagos sneakerheads, streetwear creatives, collectors, content creators, and brand enthusiasts. Year 1 target: 1,000 to 2,500 attendees.' },
  { q: 'Can I do an exclusive drop at the event?', a: 'Yes. Limited collab and exclusive drop opportunities are available — separate from the standard vendor package. Select “Exclusive Collab Tier” or contact directly.' },
  { q: 'How are vendors selected?', a: 'Year 1 is invitation-curated. We’re building a first cohort of 30 confirmed vendors before announcing publicly. Applications are reviewed within 3 business days.' },
  { q: 'What does the stall include?', a: 'Booth space, table, power connection, and setup time. Full spec sheet sent on confirmation. Specific inclusions depend on tier selected.' },
]

export default function VendorReg() {
  const [form, setForm] = useState({ business: '', contact: '', email: '', phone: '', booth: '', category: '', bio: '' })
  const [status, setStatus] = useState('idle')
  const [openFaq, setOpenFaq] = useState(null)
  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }))

  async function submit(e) {
    e.preventDefault()
    if (!FORMSPREE) { setStatus('unconfigured'); return }
    setStatus('loading')
    try {
      const res = await fetch(`https://formspree.io/f/${FORMSPREE}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ ...form, _subject: `Vendor Application — ${form.business}` }),
      })
      setStatus(res.ok ? 'success' : 'error')
    } catch { setStatus('error') }
  }

  const inputStyle = { width: '100%', padding: '12px 14px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.09)', borderRadius: 8, color: B.white, fontFamily: 'Space Mono,monospace', fontSize: 13, outline: 'none', boxSizing: 'border-box', transition: 'border-color 0.2s' }
  const lbl = text => <label style={{ fontFamily: 'Space Mono,monospace', fontSize: 8, color: '#555', letterSpacing: '0.25em', display: 'block', marginBottom: 7 }}>{text}</label>
  const onFocus = e => e.target.style.borderColor = B.amber + '60'
  const onBlur  = e => e.target.style.borderColor = 'rgba(255,255,255,0.09)'

  return (
    <section id="vendors" style={{ position: 'relative', overflow: 'hidden', background: B.black, padding: '100px 24px' }}>
      <GrainOverlay />
      <div style={{ position: 'absolute', bottom: '20%', left: '-5%', width: 400, height: 400, background: `radial-gradient(circle, ${B.neonCyan}07 0%, transparent 70%)`, filter: 'blur(80px)', pointerEvents: 'none' }} />

      <div style={{ position: 'relative', zIndex: 10, maxWidth: 860, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 44 }}>
          <SectionTag>VENDOR APPLICATIONS</SectionTag>
          <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 'clamp(40px, 6vw, 68px)', color: B.white, lineHeight: 0.9, marginBottom: 16 }}>CLAIM YOUR<br /><span style={{ color: B.neonCyan }}>BOOTH</span></div>
          <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 14, color: B.smoke, lineHeight: 1.7, maxWidth: 520, margin: '0 auto' }}>
            Year 1 is invitation-curated. We’re confirming the first cohort of 30 vendors before announcing publicly. If you sell in the sneaker culture ecosystem — kicks, apparel, art, customs — this is your room.
          </div>
        </div>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 44 }}>
          {[
            { n: '1K–2.5K', l: 'YEAR 1 ATTENDEES',     c: B.neonCyan },
            { n: '30–50',   l: 'VENDOR SPOTS (YEAR 1)', c: B.amber },
            { n: 'DEC 12',  l: '2026 · EKO ATLANTIC',   c: B.neonMagenta },
          ].map((s, i) => (
            <div key={i} style={{ padding: '18px 16px', background: B.charcoal, border: `1px solid ${s.c}28`, borderRadius: 8, textAlign: 'center' }}>
              <div style={{ fontFamily: "'Orbitron', monospace", fontWeight: 900, fontSize: 22, color: s.c, textShadow: `0 0 16px ${s.c}30` }}>{s.n}</div>
              <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 7, color: B.smoke, letterSpacing: '0.15em', marginTop: 6 }}>{s.l}</div>
            </div>
          ))}
        </div>

        {/* FAQ accordion */}
        <div style={{ marginBottom: 40 }}>
          <div style={{ fontFamily: "'Space Mono'", fontSize: 8, letterSpacing: '0.4em', color: B.smoke, marginBottom: 16 }}>VENDOR FAQ</div>
          {FAQ.map((f, i) => (
            <div key={i} style={{
              borderBottom: `1px solid ${B.gunmetal}`,
              overflow: 'hidden',
            }}>
              <button
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                style={{
                  width: '100%', textAlign: 'left',
                  padding: '14px 0', background: 'none', border: 'none',
                  cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                }}
              >
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
          <div style={{ padding: '52px 40px', background: `rgba(0,240,255,0.03)`, border: `1px solid ${B.neonCyan}25`, borderRadius: 16, textAlign: 'center' }}>
            <div style={{ width: 60, height: 60, borderRadius: '50%', border: `2px solid ${B.neonLime}`, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none"><path d="M5 13l4 4L19 7" stroke={B.neonLime} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </div>
            <div style={{ fontFamily: "'Orbitron', monospace", fontSize: 11, color: B.neonLime, letterSpacing: 3, marginBottom: 10, fontWeight: 700 }}>APPLICATION SENT</div>
            <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 36, color: B.white, marginBottom: 16 }}>WE'LL BE IN TOUCH</div>
            <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 14, color: B.smoke, lineHeight: 1.7 }}>Thanks, <span style={{ color: B.white }}>{form.business}</span>. Our team reviews every application. We’ll contact <span style={{ color: B.amber }}>{form.email}</span> within 3 business days.</div>
          </div>
        ) : (
          <form onSubmit={submit} style={{ background: 'rgba(255,255,255,0.03)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 16, overflow: 'hidden' }}>
            <div style={{ height: 3, background: `linear-gradient(90deg, ${B.neonCyan}, ${B.amber}, ${B.neonMagenta})` }} />
            <div style={{ padding: 32, display: 'flex', flexDirection: 'column', gap: 20 }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <div>{lbl('BUSINESS / BRAND NAME')}<input value={form.business} onChange={set('business')} placeholder="e.g. Lagos Kicks Co." required style={inputStyle} onFocus={onFocus} onBlur={onBlur} /></div>
                <div>{lbl('CONTACT PERSON')}<input value={form.contact} onChange={set('contact')} placeholder="Your full name" required style={inputStyle} onFocus={onFocus} onBlur={onBlur} /></div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <div>{lbl('EMAIL ADDRESS')}<input type="email" value={form.email} onChange={set('email')} placeholder="your@email.com" required style={inputStyle} onFocus={onFocus} onBlur={onBlur} /></div>
                <div>{lbl('PHONE NUMBER')}<input type="tel" value={form.phone} onChange={set('phone')} placeholder="+234 800 000 0000" required style={inputStyle} onFocus={onFocus} onBlur={onBlur} /></div>
              </div>
              <div>{lbl('BOOTH TYPE')}<select value={form.booth} onChange={set('booth')} required style={{ ...inputStyle, appearance: 'none' }}><option value="">Select booth size...</option>{BOOTH_TYPES.map(b => <option key={b} value={b}>{b}</option>)}</select></div>
              <div>
                {lbl('PRODUCT CATEGORY')}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                  {CATEGORIES.map(c => (
                    <button key={c} type="button" onClick={() => setForm(f => ({ ...f, category: c }))} style={{ padding: '6px 14px', background: form.category === c ? `${B.neonCyan}18` : 'rgba(255,255,255,0.04)', border: `1px solid ${form.category === c ? B.neonCyan : 'rgba(255,255,255,0.1)'}`, borderRadius: 4, cursor: 'pointer', fontFamily: 'Space Mono,monospace', fontSize: 9, color: form.category === c ? B.neonCyan : B.smoke, letterSpacing: '0.1em', transition: 'all 0.2s' }}>{c}</button>
                  ))}
                </div>
              </div>
              <div>{lbl('TELL US ABOUT YOUR BRAND')}<textarea value={form.bio} onChange={set('bio')} placeholder="Describe what you sell, your experience, and why you want to be at Sneakers Fest '26..." rows={4} required style={{ ...inputStyle, resize: 'vertical', lineHeight: 1.6 }} onFocus={e => e.target.style.borderColor = B.neonCyan + '50'} onBlur={onBlur} /></div>

              {status === 'unconfigured' && <div style={{ padding: '12px 16px', background: `rgba(245,166,35,0.08)`, border: `1px solid ${B.amber}30`, borderRadius: 8 }}><div style={{ fontFamily: 'Space Mono,monospace', fontSize: 10, color: B.amber }}>Add VITE_FORMSPREE_ID in Netlify → Environment Variables. Get a free form ID at formspree.io</div></div>}
              {status === 'error' && <div style={{ padding: '12px 16px', background: `rgba(255,45,123,0.08)`, border: `1px solid ${B.neonMagenta}30`, borderRadius: 8 }}><div style={{ fontFamily: 'Space Mono,monospace', fontSize: 10, color: B.neonMagenta }}>Submission failed. Email your application to vendors@sneakersfest.com</div></div>}

              <button type="submit" disabled={status === 'loading'} style={{ padding: '15px', borderRadius: 8, border: 'none', cursor: status === 'loading' ? 'not-allowed' : 'pointer', background: status === 'loading' ? B.gunmetal : B.neonCyan, color: B.black, fontFamily: 'Orbitron,monospace', fontSize: 12, fontWeight: 700, letterSpacing: 2, boxShadow: status === 'loading' ? 'none' : `0 0 30px ${B.neonCyan}30`, transition: 'all 0.2s' }}>
                {status === 'loading' ? 'SENDING...' : 'APPLY FOR A BOOTH →'}
              </button>
              <div style={{ fontFamily: 'Space Mono,monospace', fontSize: 8, color: '#333', textAlign: 'center', letterSpacing: '0.15em' }}>INVITATION-CURATED · YEAR 1 FIRST COHORT · REVIEWED WITHIN 3 BUSINESS DAYS</div>
            </div>
          </form>
        )}
      </div>
    </section>
  )
}
