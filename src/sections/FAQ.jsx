import { useState, useEffect } from 'react'
import { B } from '../tokens'
import { SectionTag } from '../components/Shared'
import Egg from '../components/Egg'

const HELPFUL_KEY   = 'sf26_faq_helpful'
const HELPFUL_SEEDS = [89, 47, 62, 38, 55, 71]

const FAQS = [
  { q: "When and where is Sneakers Fest 2026?",   popular: true,
    a: "December 12, 2026 at Eko Atlantic, Lagos, Nigeria. Doors open at 12:00 PM and the event runs until 10:00 PM." },
  { q: "What is the minimum age for entry?",
    a: "Sneakers Fest is open to attendees aged 16 and above. Under-18s must be accompanied by a responsible adult." },
  { q: "Can I bring sneakers to sell?",
    a: "Yes! Register as a vendor. Limited booths are available on a first-come first-served basis. DM @SNEAKERSFEST or email info@sneakersfest.com to apply." },
  { q: "Is there parking on-site?",
    a: "Yes. Eko Atlantic has extensive parking facilities. Shuttle services will also run from key drop-off points on Lagos Island and Victoria Island." },
  { q: "Are refunds available?",
    a: "Tickets are non-refundable. However, you may transfer your ticket to another person up to 48 hours before the event by contacting us directly." },
  { q: "What payment methods are accepted?",
    a: "We accept debit/credit cards, bank transfer, and USSD payments via Paystack and Flutterwave. International cards are fully supported." },
]

export default function FAQ() {
  const [open,    setOpen]    = useState(null)
  const [search,  setSearch]  = useState('')
  const [helpful, setHelpful] = useState(HELPFUL_SEEDS.slice())
  const [voted,   setVoted]   = useState(new Set())

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(HELPFUL_KEY) || 'null')
      if (Array.isArray(saved) && saved.length === FAQS.length) setHelpful(saved)
    } catch {}
  }, [])

  function voteHelpful(i, e) {
    e.stopPropagation()
    if (voted.has(i)) return
    setVoted(prev => new Set([...prev, i]))
    setHelpful(prev => {
      const next = [...prev]
      next[i] += 1
      try { localStorage.setItem(HELPFUL_KEY, JSON.stringify(next)) } catch {}
      return next
    })
  }

  const q      = search.trim().toLowerCase()
  const visible = q
    ? FAQS.filter(f => f.q.toLowerCase().includes(q) || f.a.toLowerCase().includes(q))
    : FAQS

  return (
    <section id="faq" style={{ background: B.void, padding: "100px 24px", position: "relative" }}>
      <style>{`
        @keyframes faqIn { from{ opacity:0; transform:translateY(5px) } to{ opacity:1; transform:translateY(0) } }
        @keyframes onlineDot { 0%,100%{ opacity:1 } 50%{ opacity:0.45 } }
      `}</style>
      <Egg id="egg-097" corner="top-right" />
      <Egg id="egg-098" corner="bottom-left" />
      <div style={{ position: "relative", zIndex: 10, maxWidth: 820, margin: "0 auto" }}>
        <div style={{ marginBottom: 40 }}>
          <SectionTag>GOT QUESTIONS?</SectionTag>
          <div className="reveal-3d text-3d" style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "clamp(36px, 5vw, 60px)", color: B.white, lineHeight: 0.9 }}>
            FREQUENTLY<br /><span style={{ color: B.amber }}>ASKED</span>
          </div>
        </div>

        {/* Search */}
        <div style={{ marginBottom: 28, position: 'relative' }}>
          <span style={{ position: 'absolute', left: 13, top: '50%', transform: 'translateY(-50%)', color: '#555', fontSize: 13, pointerEvents: 'none' }}>🔍</span>
          <input
            value={search} onChange={e => { setSearch(e.target.value); setOpen(null) }}
            placeholder="Search questions…"
            style={{ width: '100%', padding: '12px 40px 12px 38px', background: 'rgba(255,255,255,0.04)', border: `1px solid rgba(255,255,255,0.1)`, borderRadius: 6, color: B.white, fontFamily: 'Syne,sans-serif', fontSize: 13, outline: 'none', boxSizing: 'border-box', transition: 'border-color 0.2s' }}
            onFocus={e => { e.target.style.borderColor = B.amber + '60' }}
            onBlur={e => { e.target.style.borderColor = 'rgba(255,255,255,0.1)' }}
          />
          {search && (
            <button onClick={() => { setSearch(''); setOpen(null) }}
              style={{ position: 'absolute', right: 11, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#555', cursor: 'pointer', fontSize: 16, lineHeight: 1, padding: '2px 5px' }}>×</button>
          )}
        </div>

        {visible.length === 0 && (
          <div style={{ textAlign: 'center', padding: '40px 20px', color: B.smoke, fontFamily: 'Space Mono,monospace', fontSize: 11 }}>
            No match — try different words or{' '}
            <a href="mailto:info@sneakersfest.com" style={{ color: B.amber, textDecoration: 'none' }}>email us</a>.
          </div>
        )}

        <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
          {visible.map(item => {
            const i = FAQS.indexOf(item)
            return (
              <div key={i} className="card-3d" style={{ border: `1px solid ${open === i ? B.amber + "50" : B.gunmetal}`, borderRadius: 4, overflow: "hidden", transition: "border-color 0.3s", animation: search ? 'faqIn 0.22s ease' : 'none' }}>
                <button
                  onClick={() => setOpen(open === i ? null : i)}
                  style={{ width: "100%", padding: "18px 20px", background: open === i ? B.charcoal : "transparent", display: "flex", justifyContent: "space-between", alignItems: "center", cursor: "pointer", border: "none", textAlign: "left", transition: "background 0.3s", gap: 12 }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, flex: 1, flexWrap: 'wrap' }}>
                    {item.popular && (
                      <div style={{ flexShrink: 0, padding: '2px 7px', background: `${B.amber}18`, border: `1px solid ${B.amber}40`, borderRadius: 10 }}>
                        <span style={{ fontFamily: 'Space Mono,monospace', fontSize: 7, color: B.amber, letterSpacing: 1 }}>🔥 POPULAR</span>
                      </div>
                    )}
                    <span style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 14, color: B.white }}>{item.q}</span>
                  </div>
                  <span style={{ fontFamily: "'Orbitron', monospace", fontSize: 18, color: B.amber, flexShrink: 0 }}>{open === i ? "−" : "+"}</span>
                </button>

                {open === i && (
                  <div style={{ padding: "4px 20px 20px", background: B.charcoal }}>
                    <div style={{ width: "100%", height: 1, background: B.gunmetal, marginBottom: 14 }} />
                    <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 13, color: B.smoke, lineHeight: 1.85, marginBottom: 14 }}>
                      {item.a}
                    </div>
                    <button
                      onClick={e => voteHelpful(i, e)}
                      disabled={voted.has(i)}
                      style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '4px 12px', background: voted.has(i) ? `${B.amber}12` : 'rgba(255,255,255,0.04)', border: `1px solid ${voted.has(i) ? B.amber + '40' : 'rgba(255,255,255,0.08)'}`, borderRadius: 12, cursor: voted.has(i) ? 'default' : 'pointer', transition: 'all 0.2s' }}
                      onMouseEnter={e => { if (!voted.has(i)) e.currentTarget.style.borderColor = B.amber + '35' }}
                      onMouseLeave={e => { if (!voted.has(i)) e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)' }}
                    >
                      <span style={{ fontSize: 11 }}>{voted.has(i) ? '✓' : '👍'}</span>
                      <span style={{ fontFamily: 'Space Mono,monospace', fontSize: 8, color: voted.has(i) ? B.amber : B.smoke, letterSpacing: 1 }}>
                        {helpful[i]} found this helpful
                      </span>
                    </button>
                  </div>
                )}
              </div>
            )
          })}
        </div>

        <div className="card-3d" style={{ marginTop: 44, padding: "22px 28px", background: B.charcoal, border: `1px solid ${B.gunmetal}`, borderRadius: 4, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
          <div>
            <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 8, color: B.smoke, letterSpacing: "0.2em", marginBottom: 8 }}>STILL HAVE QUESTIONS?</div>
            <a href="mailto:info@sneakersfest.com" style={{ fontFamily: "'Syne', sans-serif", fontSize: 15, color: B.amber, textDecoration: "none", fontWeight: 700 }}>
              info@sneakersfest.com
            </a>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '7px 14px', background: `${B.neonLime}07`, border: `1px solid ${B.neonLime}20`, borderRadius: 12 }}>
            <div style={{ width: 6, height: 6, borderRadius: '50%', background: B.neonLime, boxShadow: `0 0 6px ${B.neonLime}`, animation: 'onlineDot 2s ease-in-out infinite' }} />
            <span style={{ fontFamily: 'Space Mono,monospace', fontSize: 8, color: B.neonLime, letterSpacing: 1 }}>Team online · Usually &lt; 2 hours</span>
          </div>
        </div>
      </div>
    </section>
  )
}
