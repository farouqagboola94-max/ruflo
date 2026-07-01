import { useState, useEffect } from 'react'
import { B } from '../tokens'
import { GrainOverlay, ScanLines, SectionTag } from '../components/Shared'
import PaymentModal, { TicketCard, downloadTicketPNG } from '../components/PaymentModal'
import { logReferralConversion } from '../lib/referral'
import Egg from '../components/Egg'

const TIERS = [
  {
    name: 'GENERAL', price: '₤5,000', priceNum: 5000,
    tag: 'ENTRY', color: B.neonCyan,
    perks: ['Full event floor access','Vendor floor entry','Live DJ sets all day','Street food zone'],
    cta: 'BUY NOW', featured: false, avail: 820, total: 1500,
  },
  {
    name: 'VIP', price: '₤10,000', priceNum: 10000,
    tag: 'MOST POPULAR', color: B.amber,
    perks: ['Everything in General','VIP lounge access','Exclusive drop previews','Meet & greet access',"SF '26 merch bag"],
    cta: 'GET VIP', featured: true, avail: 143, total: 400,
  },
  {
    name: 'VVIP', price: '₤25,000', priceNum: 25000,
    tag: 'EXCLUSIVE', color: B.neonMagenta,
    perks: ['Everything in VIP','Private collector room','Artist studio access','Signed memorabilia','Exclusive VVIP badge','Priority entry & exit'],
    cta: 'GO VVIP', featured: false, avail: 38, total: 150,
  },
  {
    name: 'PHALANX', price: '₤50,000', priceNum: 50000,
    tag: 'TOP TIER', color: B.neonLime,
    perks: ['Everything in VVIP','Private Phalanx lounge','Dedicated concierge host','Early entry from 11:00 AM','Exclusive badge + collectible box','Founder-level floor access'],
    cta: 'JOIN PHALANX', featured: false, avail: 12, total: 50,
  },
]

const COMPARE_ROWS = [
  { feature:'Event floor access',        tiers:[true, true, true, true] },
  { feature:'Vendor floor entry',         tiers:[true, true, true, true] },
  { feature:'Live DJ sets all day',       tiers:[true, true, true, true] },
  { feature:'VIP lounge access',          tiers:[false,true, true, true] },
  { feature:"SF'26 merch bag",           tiers:[false,true, true, true] },
  { feature:'Exclusive drop previews',    tiers:[false,true, true, true] },
  { feature:'Meet & greet access',        tiers:[false,true, true, true] },
  { feature:'Private collector room',     tiers:[false,false,true, true] },
  { feature:'Artist studio access',       tiers:[false,false,true, true] },
  { feature:'Signed memorabilia',         tiers:[false,false,true, true] },
  { feature:'Private Phalanx lounge',     tiers:[false,false,false,true] },
  { feature:'Early entry 11:00 AM',       tiers:[false,false,false,true] },
  { feature:'Dedicated concierge',        tiers:[false,false,false,true] },
  { feature:'Exclusive collectible box',  tiers:[false,false,false,true] },
]

const TICKET_FAQ = [
  { q:'When does the event start?',             a:'Doors open at 12:00 PM on December 12, 2026. Phalanx ticket holders get early entry from 11:00 AM.' },
  { q:'Where is the venue?',                    a:'Muri Okunola Park, Victoria Island, Lagos. Full access and parking details will be sent via email 14 days before the event.' },
  { q:'Can I transfer or resell my ticket?',    a:'Tickets are non-transferable and non-refundable. All sales are final. Your ticket is linked to the name and email you register with.' },
  { q:'How do I get my ticket after purchase?', a:'An e-ticket is sent to your email immediately. You can also view and download it from the MY TICKETS section on this page.' },
  { q:"What's the age requirement?",            a:'Ages 16 and above. Under-18s must be accompanied by an adult with a valid ticket.' },
]

// Extracted as top-level component to comply with Rules of Hooks
function TicketFAQ({ items }) {
  const [openIdx, setOpenIdx] = useState(null)
  return (
    <div>
      {items.map((f, i) => (
        <div key={i} style={{ borderBottom:'1px solid rgba(255,255,255,0.07)', overflow:'hidden' }}>
          <button
            onClick={() => setOpenIdx(openIdx === i ? null : i)}
            style={{ width:'100%', textAlign:'left', padding:'13px 0', background:'none', border:'none', cursor:'pointer', display:'flex', justifyContent:'space-between', alignItems:'center' }}
          >
            <span style={{ fontFamily:"'Syne', sans-serif", fontSize:'0.85rem', color:B.white }}>{f.q}</span>
            <span style={{ color:B.amber, fontSize:'1.1rem', flexShrink:0, marginLeft:12 }}>{openIdx === i ? '−' : '+'}</span>
          </button>
          {openIdx === i && (
            <div style={{ paddingBottom:14 }}>
              <p style={{ fontFamily:"'Syne', sans-serif", fontSize:'0.82rem', color:B.smoke, lineHeight:1.7 }}>{f.a}</p>
            </div>
          )}
        </div>
      ))}
    </div>
  )
}

function QtySelector({ name, value, color, onChange }) {
  return (
    <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'9px 14px', background:'rgba(255,255,255,0.04)', borderRadius:8, border:'1px solid rgba(255,255,255,0.08)', marginBottom:16 }}>
      <span style={{ fontFamily:"'Space Mono', monospace", fontSize:8, color:B.smoke, letterSpacing:'0.15em' }}>QTY</span>
      <div style={{ display:'flex', alignItems:'center', gap:14 }}>
        <button
          onClick={() => onChange(Math.max(1, value - 1))}
          style={{ width:28, height:28, borderRadius:4, background:'rgba(255,255,255,0.06)', border:'1px solid rgba(255,255,255,0.12)', color:B.white, cursor:'pointer', fontSize:18, lineHeight:1, display:'flex', alignItems:'center', justifyContent:'center', transition:'all 0.15s' }}
          onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.12)'; e.currentTarget.style.borderColor = color + '60' }}
          onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)' }}
        >−</button>
        <span style={{ fontFamily:"'Orbitron', monospace", fontSize:15, fontWeight:700, color:B.white, minWidth:20, textAlign:'center' }}>{value}</span>
        <button
          onClick={() => onChange(Math.min(4, value + 1))}
          style={{ width:28, height:28, borderRadius:4, background:'rgba(255,255,255,0.06)', border:'1px solid rgba(255,255,255,0.12)', color:B.white, cursor:'pointer', fontSize:18, lineHeight:1, display:'flex', alignItems:'center', justifyContent:'center', transition:'all 0.15s' }}
          onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.12)'; e.currentTarget.style.borderColor = color + '60' }}
          onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)' }}
        >+</button>
      </div>
      <span style={{ fontFamily:"'Space Mono', monospace", fontSize:8, color: value > 1 ? color : 'transparent', letterSpacing:'0.1em', minWidth:56, textAlign:'right', transition:'color 0.2s' }}>
        {value > 1 ? 'MAX 4' : ''}
      </span>
    </div>
  )
}

function downloadCalendar() {
  const lines = [
    'BEGIN:VCALENDAR', 'VERSION:2.0',
    "PRODID:-//Sneakers Fest '26//SF26//EN",
    'CALSCALE:GREGORIAN', 'METHOD:PUBLISH', 'BEGIN:VEVENT',
    'UID:sneakers-fest-26-dec12@sneakersfest.com',
    'DTSTAMP:20260101T000000Z', 'DTSTART:20261212T120000', 'DTEND:20261212T220000',
    "SUMMARY:Sneakers Fest '26 — The Sole Exhibition",
    "DESCRIPTION:West Africa's premier sneaker culture event. 200+ rare kicks\\, 30-50 curated vendors\\, live DJs\\, custom art and street food.",
    'LOCATION:Muri Okunola Park\\, Victoria Island\\, Lagos\\, Nigeria',
    'URL:https://sneakers-fest-26.netlify.app',
    'STATUS:CONFIRMED', 'END:VEVENT', 'END:VCALENDAR',
  ]
  const blob = new Blob([lines.join('\r\n')], { type: 'text/calendar;charset=utf-8' })
  const url  = URL.createObjectURL(blob)
  const a    = document.createElement('a')
  a.href = url; a.download = "sneakers-fest-26.ics"
  document.body.appendChild(a); a.click()
  document.body.removeChild(a); URL.revokeObjectURL(url)
}

export default function Tickets() {
  const [selectedTier,  setSelectedTier]  = useState(null)
  const [showMyTickets, setShowMyTickets] = useState(false)
  const [orders,        setOrders]        = useState([])
  const [dlRef,         setDlRef]         = useState(null)
  const [qty,           setQty]           = useState({ GENERAL: 1, VIP: 1, VVIP: 1, PHALANX: 1 })

  const daysLeft = Math.max(0, Math.ceil((new Date('2026-12-01') - new Date()) / 86400000))

  function loadOrders() {
    try { setOrders(JSON.parse(localStorage.getItem('sf26_orders') || '[]')) } catch { setOrders([]) }
  }
  useEffect(() => { loadOrders() }, [])

  function closePaymentModal() {
    const before = orders.length
    loadOrders()
    try {
      const after = JSON.parse(localStorage.getItem('sf26_orders') || '[]')
      if (after.length > before && selectedTier) logReferralConversion('purchase', { tier: selectedTier.name })
    } catch {}
    setSelectedTier(null)
  }

  const setTierQty = (name, val) => setQty(q => ({ ...q, [name]: val }))

  return (
    <section id="tickets" style={{ position:'relative', overflow:'hidden', background:B.black, padding:'100px 24px' }}>
      <GrainOverlay />
      <Egg id="egg-093" corner="top-right" />
      <Egg id="egg-094" corner="bottom-left" />
      <ScanLines opacity={0.04} />

      <div style={{ position:'absolute', top:'25%', left:'8%',  width:320, height:320, background:`radial-gradient(circle, ${B.neonCyan}20, transparent 70%)`,    filter:'blur(70px)', pointerEvents:'none' }} />
      <div style={{ position:'absolute', top:'15%', left:'42%', width:360, height:360, background:`radial-gradient(circle, ${B.amber}18, transparent 70%)`,       filter:'blur(70px)', pointerEvents:'none' }} />
      <div style={{ position:'absolute', bottom:'20%', right:'8%', width:300, height:300, background:`radial-gradient(circle, ${B.neonMagenta}18, transparent 70%)`, filter:'blur(70px)', pointerEvents:'none' }} />
      <div style={{ position:'absolute', top:'5%', right:'15%', width:240, height:240, background:`radial-gradient(circle, ${B.neonLime}12, transparent 70%)`,    filter:'blur(60px)', pointerEvents:'none' }} />
      <div style={{ position:'absolute', bottom:0, left:'50%', transform:'translateX(-50%)', width:600, height:2, background:`linear-gradient(90deg, transparent, ${B.amber}30, transparent)` }} />

      <div style={{ position:'relative', zIndex:10, maxWidth:1200, margin:'0 auto' }}>

        {/* Header */}
        <div style={{ textAlign:'center', marginBottom:40 }}>
          <SectionTag>SECURE YOUR SPOT</SectionTag>
          <div style={{ fontFamily:"'Bebas Neue', sans-serif", fontSize:'clamp(40px,6vw,68px)', color:B.white, lineHeight:0.9 }}>
            GET YOUR<br /><span style={{ color:B.amber }}>TICKETS</span>
          </div>
          <div style={{ fontFamily:"'Syne', sans-serif", fontSize:14, color:B.smoke, marginTop:16 }}>
            Early bird pricing active now. Prices increase as the event approaches.
          </div>
        </div>

        {/* Early Bird Banner */}
        {daysLeft > 0 && (
          <div style={{
            marginBottom: 48,
            padding: '20px 28px',
            background: `linear-gradient(135deg, rgba(245,166,35,0.10), rgba(0,240,255,0.04))`,
            border: `1px solid ${B.amber}35`,
            borderRadius: 12,
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            flexWrap: 'wrap', gap: 16,
            backdropFilter: 'blur(12px)',
          }}>
            <div>
              <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:6 }}>
                <span style={{ fontSize:14 }}>⚡</span>
                <span style={{ fontFamily:"'Space Mono', monospace", fontSize:8, color:B.amber, letterSpacing:'0.2em' }}>EARLY BIRD ACTIVE</span>
              </div>
              <div style={{ fontFamily:"'Bebas Neue', sans-serif", fontSize:22, color:B.white, letterSpacing:'0.04em' }}>CURRENT PRICING INCREASES DECEMBER 1</div>
              <div style={{ fontFamily:"'Syne', sans-serif", fontSize:12, color:B.smoke, marginTop:4 }}>Lock in your tier now before prices go up</div>
            </div>
            <div style={{ textAlign:'center' }}>
              <div style={{ fontFamily:"'Orbitron', monospace", fontWeight:900, fontSize:42, color:B.amber, lineHeight:1, textShadow:`0 0 30px ${B.amber}50` }}>{daysLeft}</div>
              <div style={{ fontFamily:"'Space Mono', monospace", fontSize:8, color:B.smoke, letterSpacing:'0.2em', marginTop:4 }}>DAYS LEFT</div>
            </div>
          </div>
        )}

        {/* Tier Cards */}
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(260px, 1fr))', gap:20, alignItems:'center' }}>
          {TIERS.map((tier, i) => (
            <div
              key={i}
              style={{
                background: tier.featured ? `rgba(245,166,35,0.07)` : `rgba(255,255,255,0.05)`,
                backdropFilter:'blur(20px) saturate(180%)', WebkitBackdropFilter:'blur(20px) saturate(180%)',
                border:`1px solid ${tier.featured ? tier.color + '55' : 'rgba(255,255,255,0.10)'}`,
                borderRadius:14, overflow:'hidden', position:'relative',
                transform: tier.featured ? 'scale(1.04)' : 'scale(1)',
                boxShadow: tier.featured
                  ? `0 8px 40px rgba(0,0,0,0.6), 0 0 0 1px ${tier.color}15, inset 0 1px 0 rgba(255,255,255,0.12)`
                  : `0 8px 32px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.07)`,
                transition:'all 0.3s ease',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.background   = tier.featured ? `rgba(245,166,35,0.12)` : `rgba(255,255,255,0.09)`
                e.currentTarget.style.transform    = tier.featured ? 'scale(1.06)' : 'scale(1.02)'
                e.currentTarget.style.borderColor  = tier.color + '70'
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background   = tier.featured ? `rgba(245,166,35,0.07)` : `rgba(255,255,255,0.05)`
                e.currentTarget.style.transform    = tier.featured ? 'scale(1.04)' : 'scale(1)'
                e.currentTarget.style.borderColor  = tier.featured ? tier.color + '55' : 'rgba(255,255,255,0.10)'
              }}
            >
              <div style={{ position:'absolute', top:0, left:0, right:0, height:1, background:'linear-gradient(90deg, transparent, rgba(255,255,255,0.25), transparent)' }} />
              <div style={{ height:3, background:`linear-gradient(90deg, ${tier.color}, ${tier.color}30)` }} />

              <div style={{ padding:28 }}>
                <div style={{ marginBottom:14 }}>
                  <span style={{ padding:'3px 10px', borderRadius:2, background:tier.color+'18', border:`1px solid ${tier.color}50`, fontFamily:"'Space Mono', monospace", fontSize:7, color:tier.color, letterSpacing:'0.2em' }}>{tier.tag}</span>
                </div>

                <div style={{ fontFamily:"'Bebas Neue', sans-serif", fontSize:28, color:B.white, letterSpacing:'0.05em' }}>{tier.name}</div>

                <div style={{ margin:'14px 0 16px', padding:'12px 16px', background:'rgba(255,255,255,0.05)', border:'1px solid rgba(255,255,255,0.08)', borderRadius:8, display:'inline-block' }}>
                  <div style={{ fontFamily:"'Orbitron', monospace", fontWeight:900, fontSize:32, color:tier.color, lineHeight:1, textShadow:`0 0 20px ${tier.color}50` }}>{tier.price}</div>
                  <div style={{ fontFamily:"'Space Mono', monospace", fontSize:7, color:B.smoke, letterSpacing:'0.2em', marginTop:4 }}>EARLY BIRD PRICE</div>
                </div>

                {(() => {
                  const pct      = tier.avail / tier.total
                  const sold     = tier.total - tier.avail
                  const urgColor = pct < 0.15 ? B.neonMagenta : pct < 0.4 ? B.amber : tier.color
                  return (
                    <div style={{ marginBottom:16 }}>
                      <div style={{ display:'flex', justifyContent:'space-between', marginBottom:5 }}>
                        <span style={{ fontFamily:"'Space Mono', monospace", fontSize:7, color:urgColor, letterSpacing:1 }}>
                          {pct < 0.15 ? '⚡ ALMOST GONE' : pct < 0.4 ? 'SELLING FAST' : 'AVAILABLE'}
                        </span>
                        <span style={{ fontFamily:"'Space Mono', monospace", fontSize:7, color:'#555', letterSpacing:1 }}>{sold} / {tier.total} SOLD</span>
                      </div>
                      <div style={{ height:3, background:'rgba(255,255,255,0.06)', borderRadius:2, overflow:'hidden' }}>
                        <div style={{ height:'100%', width:`${(sold/tier.total)*100}%`, background:urgColor, borderRadius:2 }} />
                      </div>
                    </div>
                  )
                })()}

                <div style={{ width:'100%', height:1, background:'rgba(255,255,255,0.08)', marginBottom:20 }} />

                {/* Perks */}
                <div style={{ display:'flex', flexDirection:'column', gap:10, marginBottom:20 }}>
                  {tier.perks.map((perk, j) => (
                    <div key={j} style={{ display:'flex', alignItems:'center', gap:10 }}>
                      <div style={{ width:6, height:6, borderRadius:'50%', background:tier.color, boxShadow:`0 0 8px ${tier.color}`, flexShrink:0 }} />
                      <span style={{ fontFamily:"'Syne', sans-serif", fontSize:13, color:B.smoke }}>{perk}</span>
                    </div>
                  ))}
                </div>

                {/* Quantity Selector */}
                <QtySelector
                  name={tier.name}
                  value={qty[tier.name]}
                  color={tier.color}
                  onChange={val => setTierQty(tier.name, val)}
                />

                {/* CTA */}
                <button
                  onClick={() => setSelectedTier({ ...tier, quantity: qty[tier.name] })}
                  style={{
                    width:'100%', padding:'14px 0',
                    background: tier.featured ? tier.color : 'rgba(255,255,255,0.07)',
                    border:`1px solid ${tier.color}`,
                    borderRadius:6, cursor:'pointer',
                    fontFamily:"'Space Mono', monospace", fontSize:10, fontWeight:700,
                    color: tier.featured ? B.black : tier.color,
                    letterSpacing:'0.2em', transition:'all 0.25s',
                    boxShadow: tier.featured ? `0 0 24px ${tier.color}35` : 'none',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.background = tier.color; e.currentTarget.style.color = B.black; e.currentTarget.style.boxShadow = `0 0 36px ${tier.color}55` }}
                  onMouseLeave={e => { e.currentTarget.style.background = tier.featured ? tier.color : 'rgba(255,255,255,0.07)'; e.currentTarget.style.color = tier.featured ? B.black : tier.color; e.currentTarget.style.boxShadow = tier.featured ? `0 0 24px ${tier.color}35` : 'none' }}
                >
                  {tier.cta}{qty[tier.name] > 1 ? ` × ${qty[tier.name]} = ₤${(tier.priceNum * qty[tier.name]).toLocaleString()}` : ''}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Comparison Table */}
        <div style={{ marginTop:52, overflowX:'auto' }}>
          <div style={{ fontFamily:"'Space Mono', monospace", fontSize:8, color:'#555', letterSpacing:3, marginBottom:20, textAlign:'center' }}>FULL TIER COMPARISON</div>
          <table style={{ width:'100%', minWidth:520, borderCollapse:'collapse' }}>
            <thead>
              <tr>
                <th style={{ padding:'10px 16px', fontFamily:"'Space Mono', monospace", fontSize:8, color:'#444', letterSpacing:2, textAlign:'left', borderBottom:'1px solid rgba(255,255,255,0.07)', width:'40%' }}>FEATURE</th>
                {TIERS.map(t => (
                  <th key={t.name} style={{ padding:'10px 12px', fontFamily:"'Space Mono', monospace", fontSize:9, color:t.color, letterSpacing:2, textAlign:'center', borderBottom:'1px solid rgba(255,255,255,0.07)' }}>{t.name}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {COMPARE_ROWS.map((row, i) => (
                <tr key={i} style={{ background: i%2===0 ? 'rgba(255,255,255,0.015)' : 'transparent' }}>
                  <td style={{ padding:'9px 16px', fontFamily:"'Syne', sans-serif", fontSize:12, color:B.smoke, borderBottom:'1px solid rgba(255,255,255,0.04)' }}>{row.feature}</td>
                  {row.tiers.map((has, j) => (
                    <td key={j} style={{ padding:'9px 12px', textAlign:'center', borderBottom:'1px solid rgba(255,255,255,0.04)' }}>
                      {has
                        ? <span style={{ color:TIERS[j].color, fontSize:13 }}>✓</span>
                        : <span style={{ color:'#2a2a2a', fontSize:13 }}>&mdash;</span>}
                    </td>
                  ))}
                </tr>
              ))}
              <tr style={{ background:'rgba(255,255,255,0.02)' }}>
                <td style={{ padding:'12px 16px', fontFamily:"'Space Mono', monospace", fontSize:9, color:'#555', letterSpacing:2 }}>PRICE</td>
                {TIERS.map(t => (
                  <td key={t.name} style={{ padding:'12px 12px', textAlign:'center', fontFamily:"'Orbitron', monospace", fontSize:11, fontWeight:900, color:t.color }}>{t.price}</td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>

        {/* Ticket FAQ */}
        <div style={{ marginTop:48 }}>
          <div style={{ fontFamily:"'Space Mono', monospace", fontSize:8, color:'#555', letterSpacing:3, marginBottom:20, textAlign:'center' }}>TICKET FAQ</div>
          <TicketFAQ items={TICKET_FAQ} />
        </div>

        {/* Calendar + Actions */}
        <div style={{ textAlign:'center', marginTop:44, display:'flex', flexDirection:'column', alignItems:'center', gap:16 }}>
          <button
            onClick={downloadCalendar}
            style={{ display:'inline-flex', alignItems:'center', gap:10, padding:'13px 28px', background:'rgba(255,255,255,0.04)', border:`1px solid ${B.amber}40`, borderRadius:8, cursor:'pointer', fontFamily:"'Space Mono', monospace", fontSize:10, color:B.amber, letterSpacing:'0.18em', transition:'all 0.2s', backdropFilter:'blur(12px)' }}
            onMouseEnter={e => { e.currentTarget.style.background = `rgba(245,166,35,0.10)`; e.currentTarget.style.borderColor = `${B.amber}70`; e.currentTarget.style.boxShadow = `0 0 20px ${B.amber}20` }}
            onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; e.currentTarget.style.borderColor = `${B.amber}40`; e.currentTarget.style.boxShadow = 'none' }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={B.amber} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
            </svg>
            ADD TO CALENDAR
          </button>

          {orders.length > 0 && (
            <button
              onClick={() => { loadOrders(); setShowMyTickets(true) }}
              style={{ display:'inline-flex', alignItems:'center', gap:10, padding:'13px 28px', background:'rgba(255,255,255,0.04)', border:`1px solid rgba(255,255,255,0.12)`, borderRadius:8, cursor:'pointer', fontFamily:"'Space Mono', monospace", fontSize:10, color:B.smoke, letterSpacing:'0.18em', transition:'all 0.2s' }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = `rgba(255,255,255,0.25)`; e.currentTarget.style.color = B.white }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = `rgba(255,255,255,0.12)`; e.currentTarget.style.color = B.smoke }}
            >MY TICKETS ({orders.length})</button>
          )}

          <div style={{ fontFamily:"'Space Mono', monospace", fontSize:8, color:B.smoke, letterSpacing:'0.2em' }}>
            ALL SALES FINAL · AGES 16+ · SECURE CHECKOUT VIA PAYSTACK & FLUTTERWAVE
          </div>
        </div>
      </div>

      {selectedTier && <PaymentModal tier={selectedTier} onClose={closePaymentModal} />}

      {showMyTickets && (
        <div
          style={{ position:'fixed', inset:0, zIndex:2000, background:'rgba(0,0,0,0.88)', backdropFilter:'blur(10px)', display:'flex', justifyContent:'flex-end', animation:'fadeUp 0.2s ease' }}
          onClick={e => { if (e.target === e.currentTarget) setShowMyTickets(false) }}
        >
          <div style={{ width:'100%', maxWidth:480, background:'rgba(10,10,15,0.97)', borderLeft:'1px solid rgba(255,255,255,0.08)', overflowY:'auto', display:'flex', flexDirection:'column', animation:'slideFromRight 0.25s ease' }}>
            <div style={{ padding:'18px 24px', borderBottom:'1px solid rgba(255,255,255,0.07)', display:'flex', alignItems:'center', justifyContent:'space-between', position:'sticky', top:0, background:'rgba(10,10,15,0.97)', zIndex:1 }}>
              <div>
                <p style={{ color:B.amber, fontFamily:"'Orbitron', monospace", fontSize:9, letterSpacing:3, fontWeight:700, marginBottom:4 }}>ORDER HISTORY</p>
                <p style={{ color:B.white, fontFamily:"'Bebas Neue', sans-serif", fontSize:22, letterSpacing:2 }}>MY TICKETS</p>
              </div>
              <button onClick={() => setShowMyTickets(false)} style={{ background:'rgba(255,255,255,0.05)', border:'1px solid rgba(255,255,255,0.1)', borderRadius:8, cursor:'pointer', color:B.smoke, width:34, height:34, display:'flex', alignItems:'center', justifyContent:'center' }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
              </button>
            </div>
            <div style={{ padding:24, display:'flex', flexDirection:'column', gap:32 }}>
              {orders.map((order, i) => (
                <div key={i}>
                  <TicketCard
                    name={order.name} tier={order.tier} tierColor={order.tierColor}
                    ticketRef={order.ref} price={order.price}
                    qrData={`SF26|${order.tier}|${order.ref}|${order.name}|DEC-12-2026|LAGOS`}
                  />
                  <div style={{ marginTop:12, display:'flex', flexDirection:'column', gap:8 }}>
                    <button
                      onClick={async () => {
                        setDlRef(order.ref)
                        await downloadTicketPNG({ name:order.name, email:order.email, tier:order.tier, tierColor:order.tierColor, ref:order.ref, price:order.price })
                        setDlRef(null)
                      }}
                      disabled={dlRef === order.ref}
                      style={{ width:'100%', padding:'12px', borderRadius:10, border:`1px solid ${order.tierColor}`, background:`${order.tierColor}15`, color:order.tierColor, fontFamily:"'Orbitron', monospace", fontSize:10, fontWeight:700, letterSpacing:2, cursor:dlRef===order.ref ? 'wait' : 'pointer', transition:'all 0.2s' }}
                    >
                      {dlRef === order.ref ? 'SAVING…' : 'DOWNLOAD TICKET PNG →'}
                    </button>
                    <p style={{ fontFamily:"'Space Mono', monospace", fontSize:9, color:'#333', textAlign:'center' }}>
                      Purchased {new Date(order.purchasedAt).toLocaleDateString('en-NG')} via {order.gateway}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </section>
  )
}
