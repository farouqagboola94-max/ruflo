import { useState } from 'react'
import { B } from '../tokens'
import { GrainOverlay, ScanLines, SectionTag } from '../components/Shared'
import PaymentModal from '../components/PaymentModal'

const TIERS = [
  {
    name: 'GENERAL',
    price: '₦15,000',
    tag: 'ENTRY',
    color: B.neonCyan,
    perks: [
      'Full event floor access',
      'Vendor floor entry',
      'Live DJ sets all day',
      'Street food zone',
    ],
    cta: 'BUY NOW',
    featured: false,
  },
  {
    name: 'VIP',
    price: '₦35,000',
    tag: 'MOST POPULAR',
    color: B.amber,
    perks: [
      'Everything in General',
      'VIP lounge access',
      'Exclusive drop previews',
      'Meet & greet access',
      "SF '26 merch bag",
    ],
    cta: 'GET VIP',
    featured: true,
  },
  {
    name: 'ULTRA VIP',
    price: '₦75,000',
    tag: 'EXCLUSIVE',
    color: B.neonMagenta,
    perks: [
      'Everything in VIP',
      'Private collector room',
      'Artist studio access',
      'Signed memorabilia',
      'Exclusive ultra badge',
      'Priority entry & exit',
    ],
    cta: 'GO ULTRA',
    featured: false,
  },
]

export default function Tickets() {
  const [selectedTier, setSelectedTier] = useState(null)

  return (
    <section id="tickets" style={{
      position: 'relative', overflow: 'hidden',
      background: B.black,
      padding: '100px 24px',
    }}>
      <GrainOverlay />
      <ScanLines opacity={0.04} />

      {/* Glassmorphism colour blobs */}
      <div style={{ position:'absolute', top:'25%', left:'8%', width:320, height:320, background:`radial-gradient(circle, ${B.neonCyan}20, transparent 70%)`, filter:'blur(70px)', pointerEvents:'none' }} />
      <div style={{ position:'absolute', top:'15%', left:'42%', width:360, height:360, background:`radial-gradient(circle, ${B.amber}18, transparent 70%)`, filter:'blur(70px)', pointerEvents:'none' }} />
      <div style={{ position:'absolute', bottom:'20%', right:'8%', width:300, height:300, background:`radial-gradient(circle, ${B.neonMagenta}18, transparent 70%)`, filter:'blur(70px)', pointerEvents:'none' }} />
      <div style={{ position:'absolute', bottom:0, left:'50%', transform:'translateX(-50%)', width:600, height:2, background:`linear-gradient(90deg, transparent, ${B.amber}30, transparent)` }} />

      <div style={{ position:'relative', zIndex:10, maxWidth:1100, margin:'0 auto' }}>
        <div style={{ textAlign:'center', marginBottom:64 }}>
          <SectionTag>SECURE YOUR SPOT</SectionTag>
          <div style={{ fontFamily:"'Bebas Neue', sans-serif", fontSize:'clamp(40px, 6vw, 68px)', color:B.white, lineHeight:0.9 }}>
            GET YOUR<br /><span style={{ color:B.amber }}>TICKETS</span>
          </div>
          <div style={{ fontFamily:"'Syne', sans-serif", fontSize:14, color:B.smoke, marginTop:16 }}>
            Early bird pricing active now. Prices increase as the event approaches.
          </div>
        </div>

        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(280px, 1fr))', gap:20, alignItems:'center' }}>
          {TIERS.map((tier, i) => (
            <div
              key={i}
              style={{
                background: tier.featured ? `rgba(245,166,35,0.07)` : `rgba(255,255,255,0.05)`,
                backdropFilter: 'blur(20px) saturate(180%)',
                WebkitBackdropFilter: 'blur(20px) saturate(180%)',
                border: `1px solid ${tier.featured ? tier.color + '55' : 'rgba(255,255,255,0.10)'}`,
                borderRadius: 14, overflow:'hidden', position:'relative',
                transform: tier.featured ? 'scale(1.04)' : 'scale(1)',
                boxShadow: tier.featured
                  ? `0 8px 40px rgba(0,0,0,0.6), 0 0 0 1px ${tier.color}15, inset 0 1px 0 rgba(255,255,255,0.12)`
                  : `0 8px 32px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.07)`,
                transition: 'all 0.3s ease',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.background = tier.featured ? `rgba(245,166,35,0.12)` : `rgba(255,255,255,0.09)`
                e.currentTarget.style.transform = tier.featured ? 'scale(1.06)' : 'scale(1.02)'
                e.currentTarget.style.borderColor = tier.color + '70'
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = tier.featured ? `rgba(245,166,35,0.07)` : `rgba(255,255,255,0.05)`
                e.currentTarget.style.transform = tier.featured ? 'scale(1.04)' : 'scale(1)'
                e.currentTarget.style.borderColor = tier.featured ? tier.color + '55' : 'rgba(255,255,255,0.10)'
              }}
            >
              {/* Glass sheen */}
              <div style={{ position:'absolute', top:0, left:0, right:0, height:1, background:'linear-gradient(90deg, transparent, rgba(255,255,255,0.25), transparent)' }} />
              {/* Accent bar */}
              <div style={{ height:3, background:`linear-gradient(90deg, ${tier.color}, ${tier.color}30)` }} />

              <div style={{ padding:28 }}>
                <div style={{ marginBottom:14 }}>
                  <span style={{ padding:'3px 10px', borderRadius:2, background:tier.color+'18', border:`1px solid ${tier.color}50`, fontFamily:"'Space Mono', monospace", fontSize:7, color:tier.color, letterSpacing:'0.2em' }}>{tier.tag}</span>
                </div>

                <div style={{ fontFamily:"'Bebas Neue', sans-serif", fontSize:28, color:B.white, letterSpacing:'0.05em' }}>{tier.name}</div>

                {/* Glass price box */}
                <div style={{ margin:'14px 0 20px', padding:'12px 16px', background:'rgba(255,255,255,0.05)', backdropFilter:'blur(10px)', WebkitBackdropFilter:'blur(10px)', border:'1px solid rgba(255,255,255,0.08)', borderRadius:8, display:'inline-block' }}>
                  <div style={{ fontFamily:"'Orbitron', monospace", fontWeight:900, fontSize:32, color:tier.color, lineHeight:1, textShadow:`0 0 20px ${tier.color}50` }}>{tier.price}</div>
                  <div style={{ fontFamily:"'Space Mono', monospace", fontSize:7, color:B.smoke, letterSpacing:'0.2em', marginTop:4 }}>EARLY BIRD PRICE</div>
                </div>

                <div style={{ width:'100%', height:1, background:'rgba(255,255,255,0.08)', marginBottom:20 }} />

                <div style={{ display:'flex', flexDirection:'column', gap:10, marginBottom:28 }}>
                  {tier.perks.map((perk, j) => (
                    <div key={j} style={{ display:'flex', alignItems:'center', gap:10 }}>
                      <div style={{ width:6, height:6, borderRadius:'50%', background:tier.color, boxShadow:`0 0 8px ${tier.color}`, flexShrink:0 }} />
                      <span style={{ fontFamily:"'Syne', sans-serif", fontSize:13, color:B.smoke }}>{perk}</span>
                    </div>
                  ))}
                </div>

                <button
                  onClick={() => setSelectedTier(tier)}
                  style={{
                    width:'100%', padding:'14px 0',
                    background: tier.featured ? tier.color : 'rgba(255,255,255,0.07)',
                    backdropFilter: tier.featured ? 'none' : 'blur(10px)',
                    WebkitBackdropFilter: tier.featured ? 'none' : 'blur(10px)',
                    border:`1px solid ${tier.color}`,
                    borderRadius:6, cursor:'pointer',
                    fontFamily:"'Space Mono', monospace", fontSize:10, fontWeight:700,
                    color: tier.featured ? B.black : tier.color,
                    letterSpacing:'0.2em', transition:'all 0.25s',
                    boxShadow: tier.featured ? `0 0 24px ${tier.color}35` : 'none',
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.background = tier.color
                    e.currentTarget.style.color = B.black
                    e.currentTarget.style.boxShadow = `0 0 36px ${tier.color}55`
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.background = tier.featured ? tier.color : 'rgba(255,255,255,0.07)'
                    e.currentTarget.style.color = tier.featured ? B.black : tier.color
                    e.currentTarget.style.boxShadow = tier.featured ? `0 0 24px ${tier.color}35` : 'none'
                  }}
                >{tier.cta}</button>
              </div>
            </div>
          ))}
        </div>

        <div style={{ textAlign:'center', marginTop:32, fontFamily:"'Space Mono', monospace", fontSize:8, color:B.smoke, letterSpacing:'0.2em' }}>
          ALL SALES FINAL · AGES 16+ · SECURE CHECKOUT VIA PAYSTACK & FLUTTERWAVE
        </div>
      </div>

      {/* Payment modal */}
      {selectedTier && (
        <PaymentModal
          tier={selectedTier}
          onClose={() => setSelectedTier(null)}
        />
      )}
    </section>
  )
}
