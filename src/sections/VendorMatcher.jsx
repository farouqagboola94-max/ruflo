import { useState } from 'react'
import { B } from '../tokens'
import { GrainOverlay, ScanLines, SectionTag } from '../components/Shared'
import { claudeChat, useAiAvailable } from '../lib/catalystAI'
import AIComingSoon from '../components/AIComingSoon'

const BUDGETS = [
  { label: '₦25K–₦100K', value: '25,000–100,000 Nigerian Naira' },
  { label: '₦100K–₦300K', value: '100,000–300,000 Nigerian Naira' },
  { label: '₦300K–₦700K', value: '300,000–700,000 Nigerian Naira' },
  { label: '₦700K+', value: '700,000+ Nigerian Naira, no real ceiling' },
]

const TIERS = [
  { label: 'GENERAL', value: 'General Admission' },
  { label: 'VIP', value: 'VIP' },
  { label: 'VVIP', value: 'VVIP' },
  { label: 'PHALANX', value: 'Phalanx (earliest access)' },
]

const SYSTEM = `You are the SF26 (Sneakers Fest '26, Muri Okunola Park, Victoria Island, Lagos) vendor intelligence officer. Match a buyer's wishlist to the right vendor strategy.

Respond with ONLY this JSON:
{
  "overall_strategy": "2-3 sentences on the buyer's overall approach — which section of SF26 to hit first, general gameplan",
  "items": [
    {
      "shoe": "Shoe name from the list",
      "vendor_type": "Which type of vendor to find — collector booth, reseller, brand stockist, trade table, etc.",
      "timing": "Best time of day to seek this at SF26 — and why",
      "cash_or_card": "Cash recommended or card? And why (Lagos vendors often prefer cash for negotiation)",
      "tip": "One specific insider tip for finding or negotiating this particular shoe at SF26"
    }
  ],
  "first_move": "The very first thing to do when you walk through the SF26 doors, based on this wishlist",
  "bring_list": ["Cash split suggestion", "What ID/proof to bring for authenticating", "Any other practical items"],
  "ticket_advantage": "How the buyer's ticket tier helps them get these shoes (access timing, exclusive areas, etc.)"
}

Be specific to SF26 Lagos context. Reference real Lagos sneaker buying culture.`

export default function VendorMatcher() {
  const aiReady = useAiAvailable()
  const [wishlist, setWishlist] = useState(['', ''])
  const [budget, setBudget] = useState(null)
  const [tier, setTier] = useState(null)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')

  function updateShoe(i, val) {
    const next = [...wishlist]
    next[i] = val
    setWishlist(next)
    setResult(null)
  }

  function addShoe() {
    if (wishlist.length < 5) setWishlist([...wishlist, ''])
  }

  function removeShoe(i) {
    if (wishlist.length <= 1) return
    setWishlist(wishlist.filter((_, idx) => idx !== i))
    setResult(null)
  }

  async function match() {
    const filled = wishlist.filter(s => s.trim())
    if (!filled.length || !budget || !tier) return
    if (!aiReady) {
      setError('Vendor Matcher is not live yet. It will be ready before December 12.')
      return
    }
    setLoading(true)
    setResult(null)
    setError('')
    try {
      const list = filled.map((s, i) => `${i + 1}. ${s}`).join('\n')
      const prompt = `Wishlist:\n${list}\n\nBudget: ${budget}\nTicket tier: ${tier}\n\nMatch me to the right SF26 vendors.`
      const raw = await claudeChat([{ role: 'user', content: prompt }], { feature: 'VendorMatcher', model: 'smart', system: SYSTEM, maxTokens: 1000 })
      const match = raw.match(/\{[\s\S]*\}/)
      if (match) setResult(JSON.parse(match[0]))
      else setError('Could not parse strategy. Try again.')
    } catch (e) {
      setError(e.message || 'Something went wrong.')
    } finally {
      setLoading(false)
    }
  }

  const filled = wishlist.filter(s => s.trim())
  const ready = filled.length && budget && tier
  const ACCENT = [B.amber, B.neonCyan, '#A855F7', B.neonLime, '#f97316']

  return (
    <section id="vendor-matcher" style={{ background: '#040404', padding: '80px 20px', position: 'relative', overflow: 'hidden' }}>
      <GrainOverlay />
      <ScanLines />
      <style>{`@keyframes vmSlide { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:translateY(0)} }`}</style>

      <div style={{ maxWidth: 820, margin: '0 auto' }}>
        <SectionTag>VENDOR INTELLIGENCE</SectionTag>
        {!aiReady && <AIComingSoon feature="Vendor Matcher" />}
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12, marginBottom: 8 }}>
          <h2 style={{ fontFamily: "'Bebas Neue'", fontSize: 'clamp(2rem,5vw,3.5rem)', color: B.white, letterSpacing: '0.05em', margin: 0 }}>
            VENDOR MATCHER
          </h2>
          <div style={{ fontFamily: "'Space Mono'", fontSize: 9, color: '#444', letterSpacing: '0.15em' }}>SF26 WISHLIST STRATEGY</div>
        </div>
        <p style={{ color: B.smoke, fontFamily: "'Space Mono'", fontSize: '0.72rem', marginBottom: 36, letterSpacing: '0.04em' }}>
          Enter your SF26 wishlist · Claude maps the vendor strategy · Know where to go before you arrive
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 24, marginBottom: 28 }}>
          <div>
            <div style={{ fontFamily: "'Space Mono'", fontSize: 8, color: '#333', letterSpacing: '0.2em', marginBottom: 12 }}>YOUR WISHLIST (UP TO 5)</div>
            {wishlist.map((s, i) => (
              <div key={i} style={{ display: 'flex', gap: 8, marginBottom: 8, alignItems: 'center' }}>
                <div style={{ fontFamily: "'Orbitron'", fontSize: 11, color: ACCENT[i % ACCENT.length], fontWeight: 900, width: 20, flexShrink: 0 }}>0{i + 1}</div>
                <input
                  value={s}
                  onChange={e => updateShoe(i, e.target.value)}
                  placeholder={`Shoe ${i + 1}`}
                  style={{ flex: 1, background: '#0d0d0d', border: `1px solid ${s.trim() ? ACCENT[i % ACCENT.length] + '44' : '#1a1a1a'}`, color: B.white, padding: '10px 13px', fontFamily: "'Space Mono'", fontSize: 10, outline: 'none', transition: 'border-color 0.15s' }}
                />
                {wishlist.length > 1 && (
                  <button onClick={() => removeShoe(i)} style={{ background: 'none', border: '1px solid #1a1a1a', color: '#333', padding: '10px 11px', cursor: 'pointer', fontFamily: "'Space Mono'", fontSize: 10 }}>✕</button>
                )}
              </div>
            ))}
            {wishlist.length < 5 && (
              <button onClick={addShoe} style={{ background: 'transparent', border: '1px dashed #2a2a2a', color: '#333', fontFamily: "'Space Mono'", fontSize: 8, letterSpacing: '0.15em', padding: '8px 14px', cursor: 'pointer', marginTop: 4 }}>
                + ADD SHOE
              </button>
            )}
          </div>

          <div>
            <div style={{ marginBottom: 20 }}>
              <div style={{ fontFamily: "'Space Mono'", fontSize: 8, color: '#333', letterSpacing: '0.2em', marginBottom: 10 }}>BUDGET</div>
              {BUDGETS.map(b => (
                <button key={b.label} onClick={() => { setBudget(b.value); setResult(null) }} style={{ display: 'block', width: '100%', textAlign: 'left', padding: '9px 12px', marginBottom: 6, background: budget === b.value ? `${B.amber}14` : '#0d0d0d', border: `1px solid ${budget === b.value ? B.amber : '#1a1a1a'}`, color: budget === b.value ? B.amber : '#555', fontFamily: "'Space Mono'", fontSize: 9, letterSpacing: '0.05em', cursor: 'pointer', transition: 'all 0.15s' }}>
                  {b.label}
                </button>
              ))}
            </div>
            <div>
              <div style={{ fontFamily: "'Space Mono'", fontSize: 8, color: '#333', letterSpacing: '0.2em', marginBottom: 10 }}>TICKET TIER</div>
              {TIERS.map(t => (
                <button key={t.label} onClick={() => { setTier(t.value); setResult(null) }} style={{ display: 'block', width: '100%', textAlign: 'left', padding: '9px 12px', marginBottom: 6, background: tier === t.value ? `${B.neonCyan}12` : '#0d0d0d', border: `1px solid ${tier === t.value ? B.neonCyan : '#1a1a1a'}`, color: tier === t.value ? B.neonCyan : '#555', fontFamily: "'Space Mono'", fontSize: 9, letterSpacing: '0.05em', cursor: 'pointer', transition: 'all 0.15s' }}>
                  {t.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <button onClick={match} disabled={!ready || loading} style={{ width: '100%', padding: '14px', background: ready && !loading ? B.amber : '#111', color: ready && !loading ? B.black : '#333', border: 'none', fontFamily: "'Space Mono'", fontSize: 11, letterSpacing: '0.2em', fontWeight: 700, cursor: ready && !loading ? 'pointer' : 'default', marginBottom: 24, transition: 'all 0.2s' }}>
          {loading ? '⟳ MAPPING YOUR STRATEGY...' : ready ? 'GET VENDOR STRATEGY →' : 'FILL WISHLIST + BUDGET + TIER'}
        </button>

        {error && <div style={{ background: '#1a0000', border: '1px solid #ff444422', padding: 12, marginBottom: 16, fontFamily: "'Space Mono'", fontSize: 10, color: '#ff6666' }}>{error}</div>}

        {result && (
          <div style={{ animation: 'vmSlide 0.4s ease' }}>
            <div style={{ background: '#0a0a0a', border: `2px solid ${B.amber}22`, padding: '18px 24px', marginBottom: 16 }}>
              <div style={{ fontFamily: "'Space Mono'", fontSize: 8, color: '#333', letterSpacing: '0.2em', marginBottom: 6 }}>OVERALL STRATEGY</div>
              <div style={{ fontFamily: "'Space Mono'", fontSize: 11, color: B.white, lineHeight: 1.8 }}>{result.overall_strategy}</div>
            </div>

            <div style={{ background: `${B.amber}10`, border: `1px solid ${B.amber}33`, padding: '12px 18px', marginBottom: 16 }}>
              <div style={{ fontFamily: "'Space Mono'", fontSize: 8, color: B.amber, letterSpacing: '0.15em', marginBottom: 4 }}>FIRST MOVE WHEN YOU WALK IN</div>
              <div style={{ fontFamily: "'Space Mono'", fontSize: 11, color: B.white, lineHeight: 1.7 }}>{result.first_move}</div>
            </div>

            <div style={{ display: 'grid', gap: 12, marginBottom: 16 }}>
              {(result.items || []).map((item, i) => (
                <div key={i} style={{ background: '#0a0a0a', border: `1px solid ${ACCENT[i % ACCENT.length]}22`, padding: '16px 20px' }}>
                  <div style={{ display: 'flex', gap: 14, alignItems: 'flex-start', marginBottom: 10 }}>
                    <div style={{ fontFamily: "'Orbitron'", fontSize: 18, fontWeight: 900, color: ACCENT[i % ACCENT.length], lineHeight: 1, flexShrink: 0 }}>0{i + 1}</div>
                    <div>
                      <div style={{ fontFamily: "'Bebas Neue'", fontSize: 15, color: B.white, letterSpacing: '0.04em', marginBottom: 2 }}>{item.shoe}</div>
                      <div style={{ fontFamily: "'Space Mono'", fontSize: 8, color: ACCENT[i % ACCENT.length], letterSpacing: '0.1em' }}>{item.vendor_type?.toUpperCase()}</div>
                    </div>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                    {[
                      { label: 'TIMING', val: item.timing },
                      { label: 'PAYMENT', val: item.cash_or_card },
                    ].map(col => (
                      <div key={col.label} style={{ background: 'rgba(255,255,255,0.02)', padding: '8px 10px' }}>
                        <div style={{ fontFamily: "'Space Mono'", fontSize: 7, color: '#444', letterSpacing: '0.15em', marginBottom: 3 }}>{col.label}</div>
                        <div style={{ fontFamily: "'Space Mono'", fontSize: 9, color: '#888', lineHeight: 1.6 }}>{col.val}</div>
                      </div>
                    ))}
                  </div>
                  <div style={{ marginTop: 8, fontFamily: "'Space Mono'", fontSize: 9, color: B.neonCyan, lineHeight: 1.6 }}>💡 {item.tip}</div>
                </div>
              ))}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 14 }}>
              <div style={{ background: '#0a0a0a', border: '1px solid #1a1a1a', padding: '14px 16px' }}>
                <div style={{ fontFamily: "'Space Mono'", fontSize: 8, color: '#333', letterSpacing: '0.15em', marginBottom: 8 }}>WHAT TO BRING</div>
                {(result.bring_list || []).map((b, i) => (
                  <div key={i} style={{ fontFamily: "'Space Mono'", fontSize: 9, color: B.smoke, lineHeight: 1.7, marginBottom: 4 }}>· {b}</div>
                ))}
              </div>
              <div style={{ background: '#0a0a0a', border: `1px solid ${B.neonCyan}18`, padding: '14px 16px' }}>
                <div style={{ fontFamily: "'Space Mono'", fontSize: 8, color: B.neonCyan, letterSpacing: '0.15em', marginBottom: 6 }}>YOUR TICKET ADVANTAGE</div>
                <div style={{ fontFamily: "'Space Mono'", fontSize: 9, color: B.smoke, lineHeight: 1.7 }}>{result.ticket_advantage}</div>
              </div>
            </div>

            <button onClick={() => { setResult(null); setWishlist(['', '']); setBudget(null); setTier(null) }} style={{ width: '100%', background: 'transparent', border: '1px solid #1a1a1a', color: '#333', fontFamily: "'Space Mono'", fontSize: 9, letterSpacing: '0.15em', padding: '10px', cursor: 'pointer' }}>
              NEW WISHLIST
            </button>
          </div>
        )}
      </div>
    </section>
  )
}
