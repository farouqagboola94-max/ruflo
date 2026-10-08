import { useState, useEffect } from 'react'
import { B } from '../tokens'
import { GrainOverlay, SectionTag } from '../components/Shared'
import { SOCIAL_LINKS } from '../config'
import Egg from '../components/Egg'

const ITEMS = [
  { id:'tee',    name:'CLASSIC TEE',    priceNum:8500,  cat:'APPAREL',      tag:'BESTSELLER',  color:B.neonCyan,    desc:"SF '26 oversized graphic tee. 100% premium cotton. Lagos Noir screen print.", sizes:['S','M','L','XL','XXL'], badge:'NEW',     featured:false, stock:47 },
  { id:'hoodie', name:'PREMIUM HOODIE', priceNum:18000, cat:'APPAREL',      tag:'LIMITED RUN', color:B.amber,       desc:"Heavy-weight SF '26 hoodie. Embroidered badge on chest. Only 200 made.",       sizes:['S','M','L','XL'],      badge:'LIMITED', featured:true,  stock:23 },
  { id:'cap',    name:"SF '26 CAP",     priceNum:6500,  cat:'ACCESSORIES',  tag:'ACCESSORY',   color:B.neonMagenta, desc:'Six-panel structured cap. Embroidered SF26 logo. Adjustable strap.',           sizes:['ONE SIZE'],             badge:'DROP',    featured:false, stock:61 },
  { id:'tote',   name:'TOTE BAG',       priceNum:4500,  cat:'ACCESSORIES',  tag:'UTILITY',     color:B.neonLime,    desc:"Heavy canvas tote with SF '26 screen print. Holds your full haul.",            sizes:['STANDARD'],             badge:'CARRY',   featured:false, stock:80 },
  { id:'socks',  name:'CREW SOCKS',     priceNum:3500,  cat:'ACCESSORIES',  tag:'ESSENTIALS',  color:B.neonCyan,    desc:"SF '26 branded cushioned crew socks. Two-pack.",                               sizes:['S/M','L/XL'],           badge:'2-PACK',  featured:false, stock:120 },
  { id:'key',    name:'KEYCHAIN',       priceNum:2500,  cat:'COLLECTIBLES', tag:'COLLECTIBLE', color:B.neonLime,    desc:'Die-cast SF26 sneaker silhouette. Limited edition. Numbered.',                  sizes:['STANDARD'],             badge:'COLLECT', featured:false, stock:12 },
]

const CATS   = ['ALL', 'APPAREL', 'ACCESSORIES', 'COLLECTIBLES']
const PROMOS = {
  'LAGOS26':  { pct:10, label:'10% LAGOS DISCOUNT' },
  'SF26VIP':  { pct:15, label:'15% VIP DISCOUNT' },
  'FOUNDING': { pct:12, label:'12% FOUNDERS DISCOUNT' },
}

const fmt     = n => '₦' + Number(n).toLocaleString('en-NG')
const genId   = () => 'MRC26-' + Math.random().toString(36).slice(2,10).toUpperCase()
const persist = cart => { try { localStorage.setItem('sf26_cart', JSON.stringify(cart)) } catch {} }
function stockAlert(n) {
  if (n <= 5)  return { text:`ONLY ${n} LEFT!`, color:B.neonMagenta }
  if (n <= 20) return { text:`${n} REMAINING`,  color:B.amber }
  return null
}

// ── product card ──────────────────────────────────────────────────────────────
function ProductCard({ item, selSize, onPickSize, onAdd, cartQty, onOpen }) {
  const ready = !!selSize
  const sa    = stockAlert(item.stock)
  return (
    <div
      style={{ background: item.featured ? `${B.amber}09` : 'rgba(255,255,255,0.04)', border:`1px solid ${item.featured ? item.color+'50' : 'rgba(255,255,255,0.08)'}`, borderRadius:12, overflow:'hidden', display:'flex', flexDirection:'column', transition:'border-color 0.2s, transform 0.2s', transform: item.featured ? 'scale(1.03)' : 'scale(1)' }}
      onMouseEnter={e => { e.currentTarget.style.borderColor = item.color+'70'; e.currentTarget.style.transform = item.featured ? 'scale(1.05)' : 'scale(1.02)' }}
      onMouseLeave={e => { e.currentTarget.style.borderColor = item.featured ? item.color+'50' : 'rgba(255,255,255,0.08)'; e.currentTarget.style.transform = item.featured ? 'scale(1.03)' : 'scale(1)' }}
    >
      <div style={{ height:3, background:`linear-gradient(90deg, ${item.color}, ${item.color}20)` }} />

      {/* visual — click to open modal */}
      <div onClick={() => onOpen(item)} style={{ height:150, background:`radial-gradient(ellipse at 50% 70%, ${item.color}14 0%, transparent 70%)`, display:'flex', alignItems:'center', justifyContent:'center', position:'relative', cursor:'pointer' }}>
        <div style={{ position:'absolute', top:12, right:12 }}>
          <span style={{ padding:'3px 8px', background:`${item.color}20`, border:`1px solid ${item.color}50`, borderRadius:2, fontFamily:'Space Mono,monospace', fontSize: 9, color:item.color, letterSpacing:2 }}>{item.badge}</span>
        </div>
        {sa && (
          <div style={{ position:'absolute', top:12, left:12 }}>
            <span style={{ padding:'3px 7px', background:`${sa.color}15`, border:`1px solid ${sa.color}50`, borderRadius:2, fontFamily:'Space Mono,monospace', fontSize: 9, color:sa.color, letterSpacing:1 }}>⚡ {sa.text}</span>
          </div>
        )}
        <div style={{ textAlign:'center', opacity:0.75, pointerEvents:'none' }}>
          <div style={{ fontFamily:'Bebas Neue,sans-serif', fontSize:48, color:item.color, lineHeight:1, textShadow:`0 0 28px ${item.color}30` }}>SF</div>
          <div style={{ fontFamily:'Orbitron,monospace', fontSize:10, color:item.color, letterSpacing:4 }}>'26</div>
        </div>
        {cartQty > 0 && (
          <div style={{ position:'absolute', bottom:10, right:10, background:B.neonLime, borderRadius:99, padding:'2px 8px', fontFamily:'Space Mono,monospace', fontSize:8, color:B.black, fontWeight:700 }}>✓ {cartQty}</div>
        )}
        <div style={{ position:'absolute', bottom:10, left:'50%', transform:'translateX(-50%)', fontFamily:'Space Mono,monospace', fontSize: 9, color:item.color+'60', letterSpacing:2, whiteSpace:'nowrap' }}>TAP FOR DETAILS</div>
      </div>

      {/* info */}
      <div style={{ padding:'18px 20px 22px', display:'flex', flexDirection:'column', flex:1 }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:6 }}>
          <div>
            <div style={{ fontFamily:'Space Mono,monospace', fontSize: 9, color:item.color, letterSpacing:3, marginBottom:3 }}>{item.tag}</div>
            <div style={{ fontFamily:'Bebas Neue,sans-serif', fontSize:22, color:B.white }}>{item.name}</div>
          </div>
          <div style={{ fontFamily:'Orbitron,monospace', fontWeight:900, fontSize:16, color:item.color }}>{fmt(item.priceNum)}</div>
        </div>
        <div style={{ fontFamily:'Syne,sans-serif', fontSize:12, color:B.smoke, lineHeight:1.65, marginBottom:14, flex:1 }}>{item.desc}</div>

        <div style={{ display:'flex', gap:5, flexWrap:'wrap', marginBottom:14 }}>
          {item.sizes.map(sz => (
            <button key={sz} onClick={() => onPickSize(item.id, selSize===sz ? null : sz)} style={{ padding:'4px 9px', background: selSize===sz ? item.color : 'rgba(255,255,255,0.04)', border:`1px solid ${selSize===sz ? item.color : 'rgba(255,255,255,0.1)'}`, borderRadius:3, cursor:'pointer', fontFamily:'Space Mono,monospace', fontSize:8, color: selSize===sz ? B.black : B.smoke, transition:'all 0.15s' }}>{sz}</button>
          ))}
        </div>

        <button onClick={() => ready && onAdd(item, selSize)}
          style={{ padding:'12px', background: ready ? (item.featured ? item.color : `${item.color}18`) : 'transparent', border:`1px solid ${ready ? item.color : 'rgba(255,255,255,0.1)'}`, borderRadius:6, cursor: ready ? 'pointer' : 'default', fontFamily:'Space Mono,monospace', fontSize:9, fontWeight:700, color: ready ? (item.featured ? B.black : item.color) : B.dim, letterSpacing:2, transition:'all 0.2s' }}
          onMouseEnter={e => { if (ready) { e.currentTarget.style.background = item.color; e.currentTarget.style.color = B.black } }}
          onMouseLeave={e => { if (ready) { e.currentTarget.style.background = item.featured ? item.color : `${item.color}18`; e.currentTarget.style.color = item.featured ? B.black : item.color } }}
        >{ready ? 'ADD TO CART →' : 'SELECT A SIZE'}</button>
      </div>
    </div>
  )
}

// ── product modal ──────────────────────────────────────────────────────────────
function ProductModal({ item, selSize, onPickSize, onAdd, onClose }) {
  const sa = stockAlert(item.stock)
  return (
    <>
      <div onClick={onClose} style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.85)', zIndex:300, backdropFilter:'blur(6px)' }} />
      <div style={{ position:'fixed', top:'50%', left:'50%', transform:'translate(-50%,-50%)', width:'min(520px,95vw)', background:'#0A0A10', border:`1px solid ${item.color}50`, borderRadius:16, zIndex:301, overflow:'hidden', maxHeight:'90vh', overflowY:'auto' }}>
        <div style={{ height:4, background:`linear-gradient(90deg, ${item.color}, ${item.color}20)` }} />
        <div style={{ padding:'14px 20px', display:'flex', justifyContent:'space-between', alignItems:'center', borderBottom:'1px solid rgba(255,255,255,0.07)' }}>
          <div style={{ fontFamily:'Space Mono,monospace', fontSize:8, color:item.color, letterSpacing:3 }}>{item.tag}</div>
          <button onClick={onClose} style={{ background:'none', border:'none', color: B.smoke, fontSize:20, cursor:'pointer', lineHeight:1 }}>✕</button>
        </div>
        <div style={{ height:200, background:`radial-gradient(ellipse, ${item.color}22 0%, transparent 70%)`, display:'flex', alignItems:'center', justifyContent:'center' }}>
          <div style={{ textAlign:'center' }}>
            <div style={{ fontFamily:'Bebas Neue,sans-serif', fontSize:80, color:item.color, lineHeight:1, textShadow:`0 0 40px ${item.color}40` }}>SF</div>
            <div style={{ fontFamily:'Orbitron,monospace', fontSize:14, color:item.color, letterSpacing:6 }}>'26</div>
          </div>
        </div>
        <div style={{ padding:'22px 26px 30px' }}>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:10 }}>
            <div style={{ fontFamily:'Bebas Neue,sans-serif', fontSize:32, color:B.white, lineHeight:1 }}>{item.name}</div>
            <div style={{ fontFamily:'Orbitron,monospace', fontWeight:900, fontSize:22, color:item.color }}>{fmt(item.priceNum)}</div>
          </div>
          {sa && <div style={{ fontFamily:'Space Mono,monospace', fontSize:9, color:sa.color, letterSpacing:2, marginBottom:12 }}>⚡ {sa.text}</div>}
          <div style={{ fontFamily:'Syne,sans-serif', fontSize:14, color:B.smoke, lineHeight:1.75, marginBottom:22 }}>{item.desc}</div>
          <div style={{ fontFamily:'Space Mono,monospace', fontSize:8, color: B.smoke, letterSpacing:2, marginBottom:10 }}>SELECT SIZE</div>
          <div style={{ display:'flex', gap:8, flexWrap:'wrap', marginBottom:24 }}>
            {item.sizes.map(sz => (
              <button key={sz} onClick={() => onPickSize(item.id, selSize===sz ? null : sz)}
                style={{ padding:'9px 16px', background: selSize===sz ? item.color : 'rgba(255,255,255,0.05)', border:`1px solid ${selSize===sz ? item.color : 'rgba(255,255,255,0.12)'}`, borderRadius:5, cursor:'pointer', fontFamily:'Space Mono,monospace', fontSize:10, color: selSize===sz ? B.black : B.smoke, transition:'all 0.15s' }}>{sz}</button>
            ))}
          </div>
          <button onClick={() => { if (selSize) { onAdd(item, selSize); onClose() } }}
            style={{ width:'100%', padding:'15px', background: selSize ? item.color : '#1c1c1c', border:'none', borderRadius:8, cursor: selSize ? 'pointer' : 'default', fontFamily:'Bebas Neue,sans-serif', fontSize:20, letterSpacing:3, color: selSize ? B.black : B.dim, transition:'all 0.2s', boxShadow: selSize ? `0 0 24px ${item.color}30` : 'none' }}>
            {selSize ? 'ADD TO CART →' : 'SELECT A SIZE FIRST'}
          </button>
        </div>
      </div>
    </>
  )
}

// ── cart drawer ───────────────────────────────────────────────────────────────
function CartDrawer({ cart, setCart, onClose }) {
  const [view,    setView]    = useState('cart')
  const [form,    setForm]    = useState({ name:'', email:'', phone:'', delivery:'pickup', address:'' })
  const [orderId, setOrderId] = useState('')
  const [busy,    setBusy]    = useState(false)
  const [err,     setErr]     = useState('')
  const [promo,   setPromo]   = useState({ code:'', applied:null, err:'' })

  const subtotal    = cart.reduce((s, r) => s + r.qty * r.priceNum, 0)
  const count       = cart.reduce((s, r) => s + r.qty, 0)
  const discount    = promo.applied ? Math.round(subtotal * promo.applied.pct / 100) : 0
  const deliveryFee = form.delivery === 'delivery' ? 2500 : 0
  const total       = subtotal + deliveryFee - discount

  function changeQty(idx, delta) {
    const next = cart.map((r, i) => i===idx ? { ...r, qty:r.qty+delta } : r).filter(r => r.qty > 0)
    setCart(next); persist(next)
  }

  function applyPromo() {
    const def = PROMOS[promo.code.toUpperCase().trim()]
    if (def) setPromo(p => ({ ...p, applied:{ code:p.code.toUpperCase().trim(), ...def }, err:'' }))
    else     setPromo(p => ({ ...p, err:'Invalid promo code' }))
  }

  function inp(k) { return e => setForm(f => ({ ...f, [k]: e.target.value })) }
  const fValid = form.name.trim() && form.email.includes('@') && form.phone.trim() && (form.delivery==='pickup' || form.address.trim())

  async function placeOrder() {
    if (!fValid) return
    setBusy(true); setErr('')
    const id    = genId()
    const order = { ...form, orderId:id, items:cart.map(r => `${r.name} × ${r.qty} (${r.size})`), subtotal, discount, total, promo:promo.applied?.label||'', placedAt:new Date().toISOString(), _subject:`SF26 Merch Order [${id}]` }
    try {
      const orders = JSON.parse(localStorage.getItem('sf26_merch_orders') || '[]')
      localStorage.setItem('sf26_merch_orders', JSON.stringify([...orders, order]))
    } catch {}
    const BACKEND   = import.meta.env.VITE_BACKEND_URL
    const FORMSPREE = import.meta.env.VITE_FORMSPREE_ID
    let ok = false
    if (BACKEND)          { try { const r = await fetch(`${BACKEND}/api/merch-orders`, { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify(order) }); ok = r.ok } catch {} }
    if (!ok && FORMSPREE) { try { const r = await fetch(`https://formspree.io/f/${FORMSPREE}`, { method:'POST', headers:{'Content-Type':'application/json', Accept:'application/json'}, body:JSON.stringify(order) }); ok = r.ok } catch {} }
    setCart([]); persist([])
    setOrderId(id); setBusy(false); setView('done')
  }

  const IS = { width:'100%', padding:'11px 14px', background:'rgba(255,255,255,0.05)', border:'1px solid rgba(255,255,255,0.1)', borderRadius:8, color:B.white, fontFamily:'Space Mono,monospace', fontSize:12, outline:'none', boxSizing:'border-box', transition:'border-color 0.2s' }
  const LS = { fontFamily:'Space Mono,monospace', fontSize:8, color: B.smoke, letterSpacing:2, display:'block', marginBottom:6 }

  return (
    <>
      <div onClick={onClose} style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.7)', zIndex:200, backdropFilter:'blur(4px)' }} />
      <div style={{ position:'fixed', top:0, right:0, bottom:0, width:'min(440px,100vw)', background:'#0A0A10', borderLeft:'1px solid rgba(255,255,255,0.1)', zIndex:201, display:'flex', flexDirection:'column', overflowY:'auto' }}>
        <div style={{ padding:'18px 24px', borderBottom:'1px solid rgba(255,255,255,0.08)', display:'flex', justifyContent:'space-between', alignItems:'center', position:'sticky', top:0, background:'#0A0A10', zIndex:1 }}>
          <div style={{ fontFamily:'Orbitron,monospace', fontSize:11, color:B.white, letterSpacing:3 }}>
            {view==='cart' && `YOUR CART${count ? ` (${count})` : ''}`}
            {view==='form' && 'CHECKOUT'}
            {view==='done' && 'ORDER PLACED'}
          </div>
          <button onClick={onClose} style={{ background:'transparent', border:'none', color: B.smoke, fontSize:20, cursor:'pointer', lineHeight:1 }}>✕</button>
        </div>

        <div style={{ padding:'24px', flex:1 }}>
          {/* ── CART ── */}
          {view === 'cart' && (
            <>
              {cart.length === 0 && (
                <div style={{ textAlign:'center', padding:'60px 0', fontFamily:'Space Mono,monospace', fontSize:11, color: B.dim }}>Your cart is empty</div>
              )}
              {cart.map((row, i) => (
                <div key={i} style={{ display:'flex', gap:14, padding:'14px 0', borderBottom:'1px solid rgba(255,255,255,0.06)', alignItems:'center' }}>
                  <div style={{ width:44, height:44, background:`${row.color}18`, border:`1px solid ${row.color}40`, borderRadius:8, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                    <span style={{ fontFamily:'Bebas Neue,sans-serif', fontSize:14, color:row.color }}>SF</span>
                  </div>
                  <div style={{ flex:1, minWidth:0 }}>
                    <div style={{ fontFamily:'Bebas Neue,sans-serif', fontSize:16, color:B.white }}>{row.name}</div>
                    <div style={{ fontFamily:'Space Mono,monospace', fontSize:9, color: B.smoke }}>{row.size} · {fmt(row.priceNum)}</div>
                  </div>
                  <div style={{ display:'flex', alignItems:'center', gap:6 }}>
                    <button onClick={() => changeQty(i,-1)} style={{ width:26, height:26, background:'rgba(255,255,255,0.06)', border:'1px solid rgba(255,255,255,0.1)', borderRadius:4, color:B.white, cursor:'pointer', fontFamily:'monospace', fontSize:14, lineHeight:1 }}>−</button>
                    <span style={{ fontFamily:'Orbitron,monospace', fontSize:12, color:B.white, minWidth:16, textAlign:'center' }}>{row.qty}</span>
                    <button onClick={() => changeQty(i,+1)} style={{ width:26, height:26, background:'rgba(255,255,255,0.06)', border:'1px solid rgba(255,255,255,0.1)', borderRadius:4, color:B.white, cursor:'pointer', fontFamily:'monospace', fontSize:14, lineHeight:1 }}>+</button>
                  </div>
                  <div style={{ fontFamily:'Orbitron,monospace', fontSize:12, color:row.color, minWidth:72, textAlign:'right' }}>{fmt(row.qty * row.priceNum)}</div>
                </div>
              ))}
              {cart.length > 0 && (
                <>
                  {/* promo code */}
                  <div style={{ padding:'14px 0', borderBottom:'1px solid rgba(255,255,255,0.06)' }}>
                    {promo.applied ? (
                      <div style={{ display:'flex', justifyContent:'space-between', fontFamily:'Space Mono,monospace', fontSize:10 }}>
                        <span style={{ color:B.neonLime }}>✓ {promo.applied.label}</span>
                        <span style={{ color:B.neonLime }}>-{fmt(discount)}</span>
                      </div>
                    ) : (
                      <>
                        <div style={{ display:'flex', gap:8 }}>
                          <input aria-label="Promo code" value={promo.code} onChange={e => setPromo(p => ({...p, code:e.target.value, err:''}))} onKeyDown={e => e.key==='Enter' && applyPromo()} placeholder="PROMO CODE" style={{ flex:1, background:'rgba(255,255,255,0.04)', border:`1px solid ${promo.err ? B.neonMagenta : 'rgba(255,255,255,0.1)'}`, borderRadius:6, padding:'8px 12px', color:B.white, fontFamily:'Space Mono,monospace', fontSize:10, outline:'none', letterSpacing:1 }} />
                          <button onClick={applyPromo} style={{ padding:'8px 16px', background:'rgba(255,255,255,0.06)', border:'1px solid rgba(255,255,255,0.1)', borderRadius:6, color:'#888', fontFamily:'Space Mono,monospace', fontSize:9, cursor:'pointer', letterSpacing:1 }}>APPLY</button>
                        </div>
                        {promo.err && <div style={{ fontFamily:'Space Mono,monospace', fontSize:8, color:B.neonMagenta, marginTop:5 }}>{promo.err}</div>}
                      </>
                    )}
                  </div>
                  <div style={{ display:'flex', justifyContent:'space-between', padding:'18px 0 8px' }}>
                    <span style={{ fontFamily:'Space Mono,monospace', fontSize:10, color: B.smoke, letterSpacing:2 }}>SUBTOTAL</span>
                    <span style={{ fontFamily:'Orbitron,monospace', fontSize:18, color:B.amber, fontWeight:900 }}>{fmt(subtotal)}</span>
                  </div>
                  <div style={{ fontFamily:'Space Mono,monospace', fontSize:8, color: B.dim, textAlign:'center', padding:'10px 0 16px', letterSpacing:2 }}>FREE PICKUP AT EVENT · ₦2,500 LAGOS DELIVERY</div>
                  <button onClick={() => setView('form')} style={{ width:'100%', padding:'16px', background:`linear-gradient(90deg, ${B.amber}, #D48000)`, border:'none', borderRadius:8, color:B.black, fontFamily:'Bebas Neue,sans-serif', fontSize:20, letterSpacing:3, cursor:'pointer', boxShadow:`0 0 32px ${B.amber}30` }}>
                    PLACE ORDER →
                  </button>
                </>
              )}
            </>
          )}

          {/* ── CHECKOUT ── */}
          {view === 'form' && (
            <>
              <button onClick={() => setView('cart')} style={{ background:'transparent', border:'none', color: B.smoke, fontFamily:'Space Mono,monospace', fontSize:9, cursor:'pointer', marginBottom:20, padding:0, letterSpacing:2 }}>← BACK TO CART</button>
              <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
                <div><label style={LS}>FULL NAME</label><input aria-label="Full name" value={form.name} onChange={inp('name')} placeholder="Your name" style={IS} onFocus={e => e.target.style.borderColor=B.amber+'60'} onBlur={e => e.target.style.borderColor='rgba(255,255,255,0.1)'} /></div>
                <div><label style={LS}>EMAIL ADDRESS</label><input aria-label="Email address" value={form.email} onChange={inp('email')} type="email" placeholder="you@email.com" style={IS} onFocus={e => e.target.style.borderColor=B.amber+'60'} onBlur={e => e.target.style.borderColor='rgba(255,255,255,0.1)'} /></div>
                <div><label style={LS}>PHONE NUMBER</label><input aria-label="Phone number" value={form.phone} onChange={inp('phone')} type="tel" placeholder="+234 ..." style={IS} onFocus={e => e.target.style.borderColor=B.amber+'60'} onBlur={e => e.target.style.borderColor='rgba(255,255,255,0.1)'} /></div>
                <div>
                  <label style={LS}>DELIVERY</label>
                  <div style={{ display:'flex', gap:8 }}>
                    {['pickup','delivery'].map(opt => (
                      <button key={opt} onClick={() => setForm(f => ({...f, delivery:opt}))} style={{ flex:1, padding:'10px', background: form.delivery===opt ? `${B.amber}18` : 'rgba(255,255,255,0.04)', border:`1px solid ${form.delivery===opt ? B.amber+'60' : 'rgba(255,255,255,0.1)'}`, borderRadius:6, cursor:'pointer', fontFamily:'Space Mono,monospace', fontSize:9, color: form.delivery===opt ? B.amber : B.smoke, letterSpacing:1, textTransform:'uppercase' }}>{opt==='pickup' ? '📦 Event Pickup' : '🚚 Lagos Delivery'}</button>
                    ))}
                  </div>
                </div>
                {form.delivery === 'delivery' && (
                  <div><label style={LS}>DELIVERY ADDRESS</label><textarea aria-label="Delivery address" value={form.address} onChange={inp('address')} placeholder="Full delivery address in Lagos..." rows={3} style={{ ...IS, resize:'none' }} onFocus={e => e.target.style.borderColor=B.amber+'60'} onBlur={e => e.target.style.borderColor='rgba(255,255,255,0.1)'} /></div>
                )}
              </div>
              {/* order recap */}
              <div className="card-3d" style={{ margin:'20px 0', padding:'14px 16px', background:'rgba(255,255,255,0.03)', borderRadius:8, border:'1px solid rgba(255,255,255,0.07)' }}>
                {cart.map((r, i) => (
                  <div key={i} style={{ display:'flex', justifyContent:'space-between', padding:'5px 0', fontFamily:'Space Mono,monospace', fontSize:10 }}>
                    <span style={{ color:'#888' }}>{r.name} × {r.qty} <span style={{ color: B.smoke }}>({r.size})</span></span>
                    <span style={{ color:B.smoke }}>{fmt(r.qty * r.priceNum)}</span>
                  </div>
                ))}
                {discount > 0 && (
                  <div style={{ display:'flex', justifyContent:'space-between', padding:'5px 0', fontFamily:'Space Mono,monospace', fontSize:10, color:B.neonLime }}>
                    <span>PROMO DISCOUNT</span><span>-{fmt(discount)}</span>
                  </div>
                )}
                {form.delivery === 'delivery' && (
                  <div style={{ display:'flex', justifyContent:'space-between', padding:'5px 0', fontFamily:'Space Mono,monospace', fontSize:10, borderTop:'1px solid rgba(255,255,255,0.06)', marginTop:6, paddingTop:8 }}>
                    <span style={{ color: B.smoke }}>DELIVERY</span><span style={{ color:B.smoke }}>₦2,500</span>
                  </div>
                )}
                <div style={{ display:'flex', justifyContent:'space-between', padding:'8px 0 0', marginTop:4, borderTop:'1px solid rgba(255,255,255,0.08)', fontFamily:'Orbitron,monospace', fontSize:14 }}>
                  <span style={{ color:B.white }}>TOTAL</span>
                  <span style={{ color:B.amber }}>{fmt(total)}</span>
                </div>
              </div>
              {err && <div style={{ fontFamily:'Space Mono,monospace', fontSize:10, color:B.neonMagenta, marginBottom:12 }}>{err}</div>}
              <button onClick={placeOrder} disabled={!fValid || busy} style={{ width:'100%', padding:'16px', background: fValid && !busy ? `linear-gradient(90deg, ${B.amber}, #D48000)` : '#1a1a1a', border:'none', borderRadius:8, color: fValid && !busy ? B.black : B.dim, fontFamily:'Bebas Neue,sans-serif', fontSize:20, letterSpacing:3, cursor: fValid && !busy ? 'pointer' : 'default', transition:'all 0.2s', boxShadow: fValid && !busy ? `0 0 32px ${B.amber}25` : 'none' }}>
                {busy ? 'PLACING ORDER…' : 'CONFIRM ORDER →'}
              </button>
              <div style={{ fontFamily:'Space Mono,monospace', fontSize:8, color: B.dim, textAlign:'center', marginTop:12, letterSpacing:1 }}>Payment collected at pickup / on delivery</div>
            </>
          )}

          {/* ── SUCCESS ── */}
          {view === 'done' && (
            <div style={{ textAlign:'center', padding:'30px 0' }}>
              <div style={{ fontSize:48, marginBottom:16 }}>🎉</div>
              <div style={{ fontFamily:'Bebas Neue,sans-serif', fontSize:32, color:B.white, letterSpacing:3, marginBottom:8 }}>ORDER PLACED</div>
              <div style={{ fontFamily:'Syne,sans-serif', fontSize:13, color:'#888', lineHeight:1.7, marginBottom:24 }}>
                We'll confirm your order via email shortly. Payment is on collection.
              </div>
              <div className="card-3d" style={{ background:`${B.amber}12`, border:`1px solid ${B.amber}40`, borderRadius:12, padding:'20px', marginBottom:20 }}>
                <div style={{ fontFamily:'Space Mono,monospace', fontSize:8, color: B.smoke, letterSpacing:3, marginBottom:8 }}>ORDER ID</div>
                <div style={{ fontFamily:'Orbitron,monospace', fontSize:20, color:B.amber, letterSpacing:4, fontWeight:900 }}>{orderId}</div>
              </div>
              <div style={{ fontFamily:'Space Mono,monospace', fontSize:9, color: B.dim, letterSpacing:2, marginBottom:20 }}>SAVE YOUR ORDER ID FOR COLLECTION</div>
              <a href={SOCIAL_LINKS.whatsapp} target="_blank" rel="noopener noreferrer"
                style={{ display:'block', width:'100%', padding:'14px', background:B.neonLime, borderRadius:8, color:B.black, fontFamily:'Bebas Neue,sans-serif', fontSize:18, letterSpacing:3, textDecoration:'none', boxShadow:`0 0 24px ${B.neonLime}30` }}>
                CONFIRM ON WHATSAPP →
              </a>
            </div>
          )}
        </div>
      </div>
    </>
  )
}

// ── main section ──────────────────────────────────────────────────────────────
export default function Merch() {
  const [selectedSizes, setSelectedSizes] = useState({})
  const [cart,  setCart]  = useState(() => { try { return JSON.parse(localStorage.getItem('sf26_cart') || '[]') } catch { return [] } })
  const [open,  setOpen]  = useState(false)
  const [flash, setFlash] = useState(null)
  const [cat,   setCat]   = useState('ALL')
  const [modal, setModal] = useState(null)

  useEffect(() => { document.body.style.overflow = (open || modal) ? 'hidden' : '' }, [open, modal])

  function pickSize(id, size) { setSelectedSizes(s => ({ ...s, [id]: size })) }

  function addToCart(item, size) {
    setCart(prev => {
      const idx  = prev.findIndex(r => r.id===item.id && r.size===size)
      const next = idx >= 0
        ? prev.map((r, i) => i===idx ? { ...r, qty:r.qty+1 } : r)
        : [...prev, { id:item.id, name:item.name, size, qty:1, priceNum:item.priceNum, color:item.color }]
      persist(next); return next
    })
    setSelectedSizes(s => ({ ...s, [item.id]: null }))
    setFlash(item.id)
    setTimeout(() => setFlash(null), 900)
  }

  const totalItems   = cart.reduce((s, r) => s + r.qty, 0)
  const cartQtyFor   = id => cart.filter(r => r.id===id).reduce((s, r) => s + r.qty, 0)
  const visibleItems = cat === 'ALL' ? ITEMS : ITEMS.filter(i => i.cat === cat)

  return (
    <section id="merch" style={{ position:'relative', overflow:'hidden', background:B.void, padding:'100px 24px' }}>
      <GrainOverlay />
      <Egg id="egg-087" corner="top-right" />
      <Egg id="egg-088" corner="bottom-left" />
      <div style={{ position:'absolute', top:'50%', right:'-8%', width:400, height:400, background:`radial-gradient(circle, ${B.amber}09 0%, transparent 70%)`, filter:'blur(80px)', pointerEvents:'none' }} />

      <div style={{ position:'relative', zIndex:10, maxWidth:1100, margin:'0 auto' }}>
        <div className="reveal-3d" style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-end', flexWrap:'wrap', gap:20, marginBottom:28 }}>
          <div>
            <SectionTag>OFFICIAL MERCHANDISE</SectionTag>
            <div className="reveal-3d text-3d" style={{ fontFamily:"'Bebas Neue', sans-serif", fontSize:'clamp(40px,6vw,68px)', color:B.white, lineHeight:0.9 }}>THE<br /><span style={{ color:B.amber }}>DROP</span></div>
          </div>
          <div style={{ display:'flex', alignItems:'center', gap:20 }}>
            <div style={{ fontFamily:"'Syne', sans-serif", fontSize:13, color:B.smoke, maxWidth:220, textAlign:'right', lineHeight:1.65 }}>Limited edition SF '26 merch. Ships to Lagos and beyond.</div>
            <button onClick={() => setOpen(true)} style={{ position:'relative', padding:'12px 20px', background:`${B.amber}15`, border:`1px solid ${B.amber}40`, borderRadius:8, color:B.amber, fontFamily:'Orbitron,monospace', fontSize:12, letterSpacing:2, cursor:'pointer', display:'flex', alignItems:'center', gap:8, whiteSpace:'nowrap' }}>
              🛒 CART
              {totalItems > 0 && <span style={{ background:B.amber, color:B.black, borderRadius:99, padding:'1px 7px', fontFamily:'Space Mono,monospace', fontSize:10, fontWeight:700 }}>{totalItems}</span>}
            </button>
          </div>
        </div>

        {/* category filter */}
        <div className="reveal-3d" style={{ display:'flex', gap:8, flexWrap:'wrap', marginBottom:36 }}>
          {CATS.map(c => (
            <button key={c} onClick={() => setCat(c)}
              style={{ padding:'6px 16px', background: cat===c ? B.amber : 'rgba(255,255,255,0.04)', border:`1px solid ${cat===c ? B.amber : 'rgba(255,255,255,0.1)'}`, borderRadius:20, cursor:'pointer', fontFamily:'Space Mono,monospace', fontSize:8, color: cat===c ? B.black : B.smoke, letterSpacing:2, transition:'all 0.15s' }}>{c}</button>
          ))}
        </div>

        {/* product grid */}
        <div className="reveal-3d" style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(280px, 1fr))', gap:20 }}>
          {visibleItems.map(item => (
            <div key={item.id} style={{ transition:'transform 0.15s', transform: flash===item.id ? 'scale(0.98)' : 'scale(1)' }}>
              <ProductCard
                item={item}
                selSize={selectedSizes[item.id] || null}
                onPickSize={pickSize}
                onAdd={addToCart}
                cartQty={cartQtyFor(item.id)}
                onOpen={setModal}
              />
            </div>
          ))}
        </div>

        <div style={{ marginTop:32, textAlign:'center', fontFamily:"'Space Mono', monospace", fontSize:8, color:B.smoke, letterSpacing:3 }}>
          FREE PICKUP AT EVENT · ₦2,500 LAGOS DELIVERY · ALL SALES FINAL
        </div>
      </div>

      {open  && <CartDrawer cart={cart} setCart={setCart} onClose={() => setOpen(false)} />}
      {modal && <ProductModal item={modal} selSize={selectedSizes[modal.id] || null} onPickSize={pickSize} onAdd={addToCart} onClose={() => setModal(null)} />}
    </section>
  )
}
