import { useState } from 'react'
import { B } from '../tokens'
import { GrainOverlay, SectionTag } from '../components/Shared'
import PaymentModal from '../components/PaymentModal'

const ITEMS = [
  { name: 'CLASSIC TEE', price: '₦8,500', tag: 'BESTSELLER', color: B.neonCyan, desc: "SF '26 oversized graphic tee. 100% premium cotton. Lagos Noir print.", sizes: ['S', 'M', 'L', 'XL', 'XXL'], badge: 'NEW' },
  { name: 'PREMIUM HOODIE', price: '₦18,000', tag: 'LIMITED RUN', color: B.amber, desc: "Heavy-weight SF '26 hoodie. Embroidered badge. Only 200 made.", sizes: ['S', 'M', 'L', 'XL'], badge: 'LIMITED', featured: true },
  { name: "SF '26 CAP", price: '₦6,500', tag: 'ACCESSORY', color: B.neonMagenta, desc: 'Six-panel structured cap. Embroidered SF26 logo. One size fits all.', sizes: ['ONE SIZE'], badge: 'DROP' },
  { name: 'KEYCHAIN', price: '₦2,500', tag: 'COLLECTIBLE', color: B.neonLime, desc: 'Die-cast SF26 sneaker silhouette. Limited edition collectible.', sizes: ['STANDARD'], badge: 'COLLECT' },
]

export default function Merch() {
  const [selected, setSelected] = useState(null)

  return (
    <section id="merch" style={{ position: 'relative', overflow: 'hidden', background: B.void, padding: '100px 24px' }}>
      <GrainOverlay />
      <div style={{ position: 'absolute', top: '50%', right: '-8%', width: 400, height: 400, background: `radial-gradient(circle, ${B.amber}09 0%, transparent 70%)`, filter: 'blur(80px)', pointerEvents: 'none' }} />

      <div style={{ position: 'relative', zIndex: 10, maxWidth: 1100, margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: 20, marginBottom: 52 }}>
          <div>
            <SectionTag>OFFICIAL MERCHANDISE</SectionTag>
            <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 'clamp(40px, 6vw, 68px)', color: B.white, lineHeight: 0.9 }}>THE<br /><span style={{ color: B.amber }}>DROP</span></div>
          </div>
          <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 13, color: B.smoke, maxWidth: 260, textAlign: 'right', lineHeight: 1.65 }}>Limited edition SF '26 merch. Ships to Lagos and beyond.</div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 20 }}>
          {ITEMS.map((item, i) => (
            <div
              key={i}
              style={{ background: item.featured ? `rgba(245,166,35,0.06)` : 'rgba(255,255,255,0.04)', backdropFilter: 'blur(20px)', border: `1px solid ${item.featured ? item.color + '50' : 'rgba(255,255,255,0.08)'}`, borderRadius: 12, overflow: 'hidden', transform: item.featured ? 'scale(1.03)' : 'scale(1)', boxShadow: item.featured ? `0 0 40px ${item.color}12, 0 8px 32px rgba(0,0,0,0.5)` : '0 4px 20px rgba(0,0,0,0.4)', transition: 'all 0.3s' }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = item.color + '70'; e.currentTarget.style.transform = item.featured ? 'scale(1.05)' : 'scale(1.02)' }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = item.featured ? item.color + '50' : 'rgba(255,255,255,0.08)'; e.currentTarget.style.transform = item.featured ? 'scale(1.03)' : 'scale(1)' }}
            >
              <div style={{ height: 3, background: `linear-gradient(90deg, ${item.color}, ${item.color}20)` }} />
              {/* Product visual */}
              <div style={{ height: 160, background: `radial-gradient(ellipse at 50% 70%, ${item.color}14 0%, transparent 70%)`, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
                <div style={{ position: 'absolute', top: 12, right: 12 }}>
                  <span style={{ padding: '3px 8px', background: item.color + '20', border: `1px solid ${item.color}50`, borderRadius: 2, fontFamily: "'Space Mono', monospace", fontSize: 7, color: item.color, letterSpacing: '0.15em' }}>{item.badge}</span>
                </div>
                <div style={{ textAlign: 'center', opacity: 0.7 }}>
                  <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 52, color: item.color, lineHeight: 1, textShadow: `0 0 30px ${item.color}30` }}>SF</div>
                  <div style={{ fontFamily: "'Orbitron', monospace", fontSize: 10, color: item.color, letterSpacing: '0.3em' }}>'26</div>
                </div>
              </div>
              <div style={{ padding: '20px 20px 24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                  <div>
                    <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 7, color: item.color, letterSpacing: '0.2em', marginBottom: 4 }}>{item.tag}</div>
                    <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 22, color: B.white }}>{item.name}</div>
                  </div>
                  <div style={{ fontFamily: "'Orbitron', monospace", fontWeight: 900, fontSize: 17, color: item.color, textShadow: `0 0 16px ${item.color}40` }}>{item.price}</div>
                </div>
                <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 12, color: B.smoke, lineHeight: 1.65, marginBottom: 14 }}>{item.desc}</div>
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 18 }}>
                  {item.sizes.map(sz => <span key={sz} style={{ padding: '3px 8px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 3, fontFamily: "'Space Mono', monospace", fontSize: 8, color: B.smoke }}>{sz}</span>)}
                </div>
                <button
                  onClick={() => setSelected(item)}
                  style={{ width: '100%', padding: '12px 0', background: item.featured ? item.color : 'rgba(255,255,255,0.06)', border: `1px solid ${item.color}`, borderRadius: 6, cursor: 'pointer', fontFamily: "'Space Mono', monospace", fontSize: 9, fontWeight: 700, color: item.featured ? B.black : item.color, letterSpacing: '0.2em', boxShadow: item.featured ? `0 0 20px ${item.color}30` : 'none', transition: 'all 0.25s' }}
                  onMouseEnter={e => { e.currentTarget.style.background = item.color; e.currentTarget.style.color = B.black; e.currentTarget.style.boxShadow = `0 0 30px ${item.color}50` }}
                  onMouseLeave={e => { e.currentTarget.style.background = item.featured ? item.color : 'rgba(255,255,255,0.06)'; e.currentTarget.style.color = item.featured ? B.black : item.color; e.currentTarget.style.boxShadow = item.featured ? `0 0 20px ${item.color}30` : 'none' }}
                >BUY NOW →</button>
              </div>
            </div>
          ))}
        </div>
        <div style={{ marginTop: 32, textAlign: 'center', fontFamily: "'Space Mono', monospace", fontSize: 8, color: B.smoke, letterSpacing: '0.2em' }}>FREE DELIVERY WITHIN LAGOS · PICKUP AT THE EVENT · ALL SALES FINAL</div>
      </div>

      {selected && <PaymentModal tier={selected} onClose={() => setSelected(null)} />}
    </section>
  )
}
