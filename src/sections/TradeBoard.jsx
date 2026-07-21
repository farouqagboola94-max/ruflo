import { useState, useEffect, useRef } from 'react'
import { B } from '../tokens'
import { GrainOverlay, SectionTag } from '../components/Shared'
import Egg from '../components/Egg'
import { tradesApi } from '../lib/api'

// ── seed listings so the board has content on first visit ─────────────────────
const SEEDS = [
  { id:'seed1', name:'Air Jordan 1 Retro High OG', brand:'Nike', size:'44', condition:'VNDS', asking:'Air Max 90 or similar · ₦45,000', price:45000, notes:'Got as a gift, not my colourway. Very clean, box included.', contact:'', instagram:'@kicks_leke', postedAt:'2026-05-20T09:00:00Z', wants:14, photo:'' },
  { id:'seed2', name:'Yeezy Boost 350 V2 Zebra', brand:'Adidas', size:'42', condition:'DS', asking:'Jordan 4 Bred or ₦85,000', price:85000, notes:'Bought from authorised retailer. All accessories, receipt included.', contact:'08023456789', instagram:'', postedAt:'2026-05-28T15:00:00Z', wants:32, photo:'' },
  { id:'seed3', name:'New Balance 550 White Green', brand:'New Balance', size:'43', condition:'USED', asking:'NB 574 or NB 1906R in 43', price:0, notes:'Worn twice, very clean. Original laces and box.', contact:'08034567890', instagram:'@nb_collector', postedAt:'2026-06-01T11:00:00Z', wants:8, photo:'' },
  { id:'seed4', name:'Puma Suede Classic Black', brand:'Puma', size:'41', condition:'VNDS', asking:'₦15,000 firm or swap for any classic silhouette in 41', price:15000, notes:'Classic colourway. Box slightly dented but pair is clean.', contact:'08045678901', instagram:'', postedAt:'2026-06-02T14:00:00Z', wants:5, photo:'' },
  { id:'seed5', name:'Nike Dunk Low Panda', brand:'Nike', size:'45', condition:'DS', asking:'Jordan 3 Retro or ₦60,000', price:60000, notes:'Copped two pairs. Selling the extra. Deadstock, perfect box.', contact:'', instagram:'@dunks_ng', postedAt:'2026-06-02T18:00:00Z', wants:21, photo:'' },
]

const CONDITIONS = ['DS', 'VNDS', 'USED']
const COND_COLOR  = { DS: B.neonLime, VNDS: B.neonCyan, USED: B.amber }
const COND_LABEL  = { DS: 'Deadstock', VNDS: 'Near DS', USED: 'Used' }

const fmt   = n => n ? '₦' + Number(n).toLocaleString('en-NG') : ''
const genId = () => 'tr_' + Date.now() + '_' + Math.random().toString(36).slice(2, 7)

async function compressPhoto(file) {
  return new Promise(resolve => {
    const img = new Image()
    img.onload = () => {
      const MAX = 700
      const scale = Math.min(MAX / img.width, MAX / img.height, 1)
      const cv = document.createElement('canvas')
      cv.width = img.width * scale; cv.height = img.height * scale
      cv.getContext('2d').drawImage(img, 0, 0, cv.width, cv.height)
      resolve(cv.toDataURL('image/jpeg', 0.78))
    }
    img.src = URL.createObjectURL(file)
  })
}

function load()       { try { return JSON.parse(localStorage.getItem('sf26_trades') || 'null') } catch { return null } }
function loadWants()  { try { return JSON.parse(localStorage.getItem('sf26_trade_wants') || '{}') } catch { return {} } }
function loadMine()   { try { return JSON.parse(localStorage.getItem('sf26_my_trades') || '[]') } catch { return [] } }

// ── post modal ─────────────────────────────────────────────────────────────────
function PostModal({ onPost, onClose }) {
  const [form, setForm] = useState({ name:'', brand:'', size:'', condition:'', asking:'', price:'', contact:'', instagram:'', notes:'' })
  const [photo, setPhoto]   = useState('')
  const [busy,  setBusy]    = useState(false)
  const fileRef = useRef()

  const inp = k => e => setForm(f => ({ ...f, [k]: e.target.value }))
  const valid = form.name.trim() && form.brand.trim() && form.size.trim() && form.condition && form.asking.trim()

  async function handleFile(e) {
    const f = e.target.files[0]; if (!f) return
    setBusy(true)
    setPhoto(await compressPhoto(f))
    setBusy(false)
  }

  function submit() {
    if (!valid) return
    const listing = { id: genId(), ...form, price: Number(form.price) || 0, photo, postedAt: new Date().toISOString(), wants: 0 }
    onPost(listing)
  }

  const is = { width:'100%', padding:'10px 13px', background:'rgba(255,255,255,0.05)', border:'1px solid rgba(255,255,255,0.1)', borderRadius:7, color:B.white, fontFamily:'Space Mono,monospace', fontSize:12, outline:'none', boxSizing:'border-box', transition:'border-color 0.2s' }
  const lbl = { fontFamily:'Space Mono,monospace', fontSize:8, color:'#555', letterSpacing:2, display:'block', marginBottom:5 }
  const focus = e => e.target.style.borderColor = `${B.amber}60`
  const blur  = e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'

  return (
    <>
      <div onClick={onClose} style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.75)', zIndex:200, backdropFilter:'blur(4px)' }} />
      <div style={{ position:'fixed', top:0, right:0, bottom:0, width:'min(460px,100vw)', background:'#0A0A10', borderLeft:'1px solid rgba(255,255,255,0.1)', zIndex:201, overflowY:'auto' }}>
        <div style={{ padding:'18px 24px', borderBottom:'1px solid rgba(255,255,255,0.08)', display:'flex', justifyContent:'space-between', alignItems:'center', position:'sticky', top:0, background:'#0A0A10', zIndex:1 }}>
          <div style={{ fontFamily:'Orbitron,monospace', fontSize:11, color:B.white, letterSpacing:3 }}>POST A LISTING</div>
          <button onClick={onClose} style={{ background:'transparent', border:'none', color:'#555', fontSize:20, cursor:'pointer' }}>✕</button>
        </div>

        <div style={{ padding:'24px', display:'flex', flexDirection:'column', gap:14 }}>
          {/* photo */}
          <div>
            <label style={lbl}>PHOTO (OPTIONAL)</label>
            <div onClick={() => fileRef.current.click()} style={{ height:120, background: photo ? 'transparent' : 'rgba(255,255,255,0.03)', border:`1px dashed ${B.amber}40`, borderRadius:8, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', overflow:'hidden' }}>
              {photo ? <img src={photo} alt="" style={{ width:'100%', height:'100%', objectFit:'cover' }} /> : <span style={{ fontFamily:'Space Mono,monospace', fontSize:10, color:'#444' }}>TAP TO ADD PHOTO</span>}
            </div>
            <input ref={fileRef} type="file" accept="image/*" onChange={handleFile} style={{ display:'none' }} />
          </div>

          <div>
            <label style={lbl}>SNEAKER NAME *</label>
            <input value={form.name} onChange={inp('name')} placeholder="e.g. Air Jordan 1 Retro High Chicago" style={is} onFocus={focus} onBlur={blur} />
          </div>

          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10 }}>
            <div>
              <label style={lbl}>BRAND *</label>
              <input value={form.brand} onChange={inp('brand')} placeholder="Nike, Adidas…" style={is} onFocus={focus} onBlur={blur} />
            </div>
            <div>
              <label style={lbl}>SIZE (EU) *</label>
              <input value={form.size} onChange={inp('size')} placeholder="43" style={is} onFocus={focus} onBlur={blur} />
            </div>
          </div>

          <div>
            <label style={lbl}>CONDITION *</label>
            <div style={{ display:'flex', gap:6 }}>
              {CONDITIONS.map(c => (
                <button key={c} onClick={() => setForm(f => ({ ...f, condition: f.condition===c ? '' : c }))} style={{ flex:1, padding:'9px 4px', background: form.condition===c ? `${COND_COLOR[c]}22` : 'rgba(255,255,255,0.03)', border:`1px solid ${form.condition===c ? COND_COLOR[c]+'80' : 'rgba(255,255,255,0.1)'}`, borderRadius:6, cursor:'pointer', fontFamily:'Space Mono,monospace', fontSize:9, color: form.condition===c ? COND_COLOR[c] : '#555', transition:'all 0.15s' }}>
                  {c}
                  <div style={{ fontSize:7, opacity:0.6, marginTop:2 }}>{COND_LABEL[c]}</div>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label style={lbl}>LOOKING FOR *</label>
            <input value={form.asking} onChange={inp('asking')} placeholder="Trade target or price — e.g. Jordan 4 or ₦60,000" style={is} onFocus={focus} onBlur={blur} />
          </div>

          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10 }}>
            <div>
              <label style={lbl}>WHATSAPP NUMBER</label>
              <input value={form.contact} onChange={inp('contact')} placeholder="08012345678" style={is} onFocus={focus} onBlur={blur} />
            </div>
            <div>
              <label style={lbl}>INSTAGRAM</label>
              <input value={form.instagram} onChange={inp('instagram')} placeholder="@handle" style={is} onFocus={focus} onBlur={blur} />
            </div>
          </div>

          <div>
            <label style={lbl}>NOTES</label>
            <textarea value={form.notes} onChange={inp('notes')} placeholder="Condition details, what's included, etc." rows={3} style={{ ...is, resize:'none' }} onFocus={focus} onBlur={blur} />
          </div>

          <button onClick={submit} disabled={!valid || busy} style={{ padding:'15px', background: valid && !busy ? `linear-gradient(90deg, ${B.amber}, #D48000)` : '#1a1a1a', border:'none', borderRadius:8, color: valid && !busy ? B.black : '#444', fontFamily:'Bebas Neue,sans-serif', fontSize:20, letterSpacing:3, cursor: valid && !busy ? 'pointer' : 'default', transition:'all 0.2s', marginTop:4 }}>
            {busy ? 'PROCESSING…' : 'POST TO THE WALL →'}
          </button>
          <div style={{ fontFamily:'Space Mono,monospace', fontSize:8, color:'#333', textAlign:'center', letterSpacing:1 }}>Visible to everyone · You can remove your listing later</div>
        </div>
      </div>
    </>
  )
}

// ── contact popup ──────────────────────────────────────────────────────────────
function ContactPop({ listing, onClose }) {
  const wa = listing.contact ? `https://wa.me/234${listing.contact.replace(/^0/, '')}?text=${encodeURIComponent(`Hi, I saw your ${listing.name} (Size ${listing.size}) listing on SF'26 Trade Board — still available?`)}` : null
  return (
    <>
      <div onClick={onClose} style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.6)', zIndex:300 }} />
      <div style={{ position:'fixed', top:'50%', left:'50%', transform:'translate(-50%,-50%)', background:'#0E0E18', border:`1px solid ${B.amber}40`, borderRadius:14, padding:'28px 32px', zIndex:301, width:'min(360px,90vw)', textAlign:'center' }}>
        <div style={{ fontFamily:'Bebas Neue,sans-serif', fontSize:22, color:B.white, letterSpacing:2, marginBottom:4 }}>{listing.name}</div>
        <div style={{ fontFamily:'Space Mono,monospace', fontSize:9, color:'#555', marginBottom:20 }}>Size {listing.size} · {listing.condition}</div>
        <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
          {wa && <a href={wa} target="_blank" rel="noopener noreferrer" style={{ padding:'13px', background:'#25D366', borderRadius:8, color:B.black, fontFamily:'Bebas Neue,sans-serif', fontSize:18, letterSpacing:2, textDecoration:'none', display:'block' }}>WHATSAPP →</a>}
          {listing.instagram && <div style={{ padding:'13px', background:`${B.neonMagenta}18`, border:`1px solid ${B.neonMagenta}40`, borderRadius:8, fontFamily:'Bebas Neue,sans-serif', fontSize:18, letterSpacing:2, color:B.neonMagenta }}>{listing.instagram}</div>}
          {!wa && !listing.instagram && <div style={{ fontFamily:'Space Mono,monospace', fontSize:11, color:'#555' }}>No contact info provided</div>}
        </div>
        <button onClick={onClose} style={{ marginTop:16, background:'transparent', border:'none', color:'#555', fontFamily:'Space Mono,monospace', fontSize:9, cursor:'pointer', letterSpacing:2 }}>CLOSE</button>
      </div>
    </>
  )
}

// ── listing card ───────────────────────────────────────────────────────────────
function ListingCard({ listing, wanted, onWant, onContact, onRemove, isOwn }) {
  const c = COND_COLOR[listing.condition] || B.smoke
  return (
    <div className="card-3d" style={{ background:'rgba(255,255,255,0.03)', border:`1px solid rgba(255,255,255,0.08)`, borderRadius:12, overflow:'hidden', breakInside:'avoid', marginBottom:14, display:'flex', flexDirection:'column' }}>
      {listing.photo
        ? <img src={listing.photo} alt={listing.name} style={{ width:'100%', aspectRatio:'1', objectFit:'cover' }} />
        : (
          <div style={{ aspectRatio:'1', background:`radial-gradient(ellipse at 50% 60%, ${c}14 0%, transparent 70%)`, display:'flex', alignItems:'center', justifyContent:'center' }}>
            <span style={{ fontFamily:'Bebas Neue,sans-serif', fontSize:48, color:`${c}30` }}>SF</span>
          </div>
        )
      }
      <div style={{ padding:'14px 16px', display:'flex', flexDirection:'column', gap:8, flex:1 }}>
        <div style={{ display:'flex', gap:6, flexWrap:'wrap' }}>
          <span style={{ padding:'2px 7px', background:`${c}18`, border:`1px solid ${c}50`, borderRadius:3, fontFamily:'Space Mono,monospace', fontSize:7, color:c, letterSpacing:2 }}>{listing.condition}</span>
          <span style={{ padding:'2px 7px', background:'rgba(255,255,255,0.05)', border:'1px solid rgba(255,255,255,0.1)', borderRadius:3, fontFamily:'Space Mono,monospace', fontSize:7, color:'#777' }}>EU {listing.size}</span>
          {isOwn && <span style={{ padding:'2px 7px', background:`${B.neonLime}15`, border:`1px solid ${B.neonLime}40`, borderRadius:3, fontFamily:'Space Mono,monospace', fontSize:7, color:B.neonLime }}>YOURS</span>}
        </div>
        <div>
          <div style={{ fontFamily:'Bebas Neue,sans-serif', fontSize:18, color:B.white, lineHeight:1.1 }}>{listing.name}</div>
          <div style={{ fontFamily:'Space Mono,monospace', fontSize:9, color:'#555', marginTop:2 }}>{listing.brand}</div>
        </div>
        <div style={{ fontFamily:'Syne,sans-serif', fontSize:12, color:B.amber, lineHeight:1.5 }}>
          <span style={{ fontFamily:'Space Mono,monospace', fontSize:8, color:'#555' }}>WANTS: </span>{listing.asking}
        </div>
        {listing.notes && <div style={{ fontFamily:'Syne,sans-serif', fontSize:11, color:'#666', lineHeight:1.5, display:'-webkit-box', WebkitLineClamp:2, WebkitBoxOrient:'vertical', overflow:'hidden' }}>{listing.notes}</div>}
        <div style={{ display:'flex', gap:6, marginTop:4 }}>
          <button onClick={() => onWant(listing.id)} style={{ flex:1, padding:'9px 6px', background: wanted ? `${B.neonLime}18` : 'rgba(255,255,255,0.04)', border:`1px solid ${wanted ? B.neonLime+'50' : 'rgba(255,255,255,0.1)'}`, borderRadius:6, cursor:'pointer', fontFamily:'Space Mono,monospace', fontSize:9, color: wanted ? B.neonLime : '#666', letterSpacing:1 }}>
            🔥 {listing.wants} {wanted ? 'WANTED' : 'WANT'}
          </button>
          <button onClick={() => onContact(listing)} style={{ flex:1, padding:'9px 6px', background:`${B.amber}15`, border:`1px solid ${B.amber}40`, borderRadius:6, cursor:'pointer', fontFamily:'Space Mono,monospace', fontSize:9, color:B.amber, letterSpacing:1 }}>
            CONTACT →
          </button>
        </div>
        {isOwn && <button onClick={() => onRemove(listing.id)} style={{ padding:'6px', background:'transparent', border:'1px solid rgba(255,0,100,0.2)', borderRadius:6, cursor:'pointer', fontFamily:'Space Mono,monospace', fontSize:8, color:'rgba(255,0,100,0.5)', letterSpacing:1 }}>REMOVE LISTING</button>}
      </div>
    </div>
  )
}

// ── main section ───────────────────────────────────────────────────────────────
export default function TradeBoard() {
  const [listings,  setListings]  = useState(() => load() ?? SEEDS)
  const [wants,     setWants]     = useState(loadWants)
  const [mine,      setMine]      = useState(loadMine)
  const [posting,     setPosting]     = useState(false)
  const [contact,     setContact]     = useState(null)
  const [cond,        setCond]        = useState('ALL')
  const [brandFilter, setBrandFilter] = useState('')
  const [sizeFilter,  setSizeFilter]  = useState('')
  const [query,       setQuery]       = useState('')
  const [sort,        setSort]        = useState('NEWEST')

  // Persist to localStorage on every change
  useEffect(() => { try { localStorage.setItem('sf26_trades', JSON.stringify(listings)) } catch {} }, [listings])

  // Sync with server on mount — pulls any listings added from other devices/sessions
  useEffect(() => {
    tradesApi.getAll().then(serverListings => {
      if (!Array.isArray(serverListings) || serverListings.length === 0) return
      setListings(local => {
        const localIds = new Set(local.map(l => l.id))
        const seedIds  = new Set(SEEDS.map(s => s.id))
        const newFromServer = serverListings.filter(l => !localIds.has(l.id) && !seedIds.has(l.id))
        if (newFromServer.length === 0) return local
        return [...newFromServer, ...local]
      })
    }).catch(() => {})
  }, [])

  function handlePost(listing) {
    const next = [listing, ...listings]
    setListings(next)
    const nextMine = [...mine, listing.id]
    setMine(nextMine)
    try { localStorage.setItem('sf26_my_trades', JSON.stringify(nextMine)) } catch {}
    tradesApi.add(listing).catch(() => {})
    setPosting(false)
  }

  function handleWant(id) {
    const alreadyWanted = !!wants[id]
    const nextWants = { ...wants, [id]: !alreadyWanted || undefined }
    if (!alreadyWanted) nextWants[id] = true; else delete nextWants[id]
    setWants(nextWants)
    try { localStorage.setItem('sf26_trade_wants', JSON.stringify(nextWants)) } catch {}
    setListings(ls => ls.map(l => l.id === id ? { ...l, wants: l.wants + (alreadyWanted ? -1 : 1) } : l))
  }

  function handleRemove(id) {
    const next = listings.filter(l => l.id !== id)
    setListings(next)
    setMine(m => { const nm = m.filter(i => i !== id); try { localStorage.setItem('sf26_my_trades', JSON.stringify(nm)) } catch {}; return nm })
    tradesApi.remove(id).catch(() => {})
  }

  const allBrands = [...new Set(listings.map(l => l.brand).filter(Boolean))].sort()
  const allSizes  = [...new Set(listings.map(l => l.size).filter(Boolean))].sort((a, b) => Number(a) - Number(b))

  const filtered = listings
    .filter(l => cond === 'ALL' || l.condition === cond)
    .filter(l => !brandFilter || l.brand.toLowerCase() === brandFilter.toLowerCase())
    .filter(l => !sizeFilter  || l.size === sizeFilter)
    .filter(l => !query || l.name.toLowerCase().includes(query.toLowerCase()) || l.brand.toLowerCase().includes(query.toLowerCase()))
    .sort((a, b) => sort === 'NEWEST' ? new Date(b.postedAt) - new Date(a.postedAt) : b.wants - a.wants)

  const totalWants  = listings.reduce((s, l) => s + l.wants, 0)
  const activeFilters = [cond !== 'ALL', brandFilter, sizeFilter, query].filter(Boolean).length

  return (
    <section id="trades" style={{ position:'relative', background:`linear-gradient(180deg, ${B.black} 0%, ${B.void} 100%)`, padding:'100px 24px', overflow:'hidden' }}>
      <GrainOverlay />
      <Egg id="egg-071" corner="top-right" />
      <Egg id="egg-072" corner="bottom-left" />
      <div style={{ position:'absolute', top:'20%', left:'50%', transform:'translate(-50%,-50%)', width:600, height:400, background:`radial-gradient(ellipse, ${B.neonCyan}06 0%, transparent 70%)`, filter:'blur(80px)', pointerEvents:'none' }} />

      <div style={{ position:'relative', zIndex:10, maxWidth:1100, margin:'0 auto' }}>

        {/* header */}
        <div className="reveal-3d" style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-end', flexWrap:'wrap', gap:20, marginBottom:16 }}>
          <div>
            <SectionTag>COMMUNITY MARKET</SectionTag>
            <div className="reveal-3d text-3d" style={{ fontFamily:"'Bebas Neue', sans-serif", fontSize:'clamp(40px,7vw,72px)', color:B.white, lineHeight:0.88 }}>
              SWAP · SELL<br /><span style={{ color:B.neonCyan }}>· SCORE</span>
            </div>
          </div>
          <div style={{ display:'flex', flexDirection:'column', alignItems:'flex-end', gap:12 }}>
            <div style={{ fontFamily:'Space Mono,monospace', fontSize:9, color:'#444', letterSpacing:2 }}>
              {activeFilters > 0 ? `${filtered.length} of ` : ''}{listings.length} listings · 🔥 {totalWants} total interest
            </div>
            <button onClick={() => setPosting(true)} style={{ padding:'13px 24px', background:`linear-gradient(90deg, ${B.neonCyan}, #00B8CC)`, border:'none', borderRadius:8, color:B.black, fontFamily:'Bebas Neue,sans-serif', fontSize:18, letterSpacing:3, cursor:'pointer', boxShadow:`0 0 28px ${B.neonCyan}30` }}>
              + POST A LISTING
            </button>
          </div>
        </div>

        {/* filters */}
        <div className="card-3d" style={{ display:'flex', gap:10, flexWrap:'wrap', alignItems:'center', marginBottom:32, padding:'16px 20px', background:'rgba(255,255,255,0.02)', border:'1px solid rgba(255,255,255,0.07)', borderRadius:10 }}>
          <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search sneakers…" style={{ padding:'8px 13px', background:'rgba(255,255,255,0.05)', border:'1px solid rgba(255,255,255,0.1)', borderRadius:6, color:B.white, fontFamily:'Space Mono,monospace', fontSize:11, outline:'none', minWidth:160, flex:'1 1 140px' }} />

          <select value={brandFilter} onChange={e => setBrandFilter(e.target.value)}
            style={{ padding:'8px 12px', background:'rgba(255,255,255,0.05)', border:`1px solid ${brandFilter ? B.neonCyan+'50' : 'rgba(255,255,255,0.1)'}`, borderRadius:6, color: brandFilter ? B.neonCyan : '#666', fontFamily:'Space Mono,monospace', fontSize:9, outline:'none', cursor:'pointer', minWidth:110 }}>
            <option value="">ALL BRANDS</option>
            {allBrands.map(b => <option key={b} value={b}>{b}</option>)}
          </select>

          <select value={sizeFilter} onChange={e => setSizeFilter(e.target.value)}
            style={{ padding:'8px 12px', background:'rgba(255,255,255,0.05)', border:`1px solid ${sizeFilter ? B.neonCyan+'50' : 'rgba(255,255,255,0.1)'}`, borderRadius:6, color: sizeFilter ? B.neonCyan : '#666', fontFamily:'Space Mono,monospace', fontSize:9, outline:'none', cursor:'pointer', minWidth:100 }}>
            <option value="">ALL SIZES</option>
            {allSizes.map(s => <option key={s} value={s}>EU {s}</option>)}
          </select>

          <div style={{ display:'flex', gap:4 }}>
            {['ALL', ...CONDITIONS].map(c => (
              <button key={c} onClick={() => setCond(c)} style={{ padding:'7px 12px', background: cond===c ? `${(COND_COLOR[c]||B.white)}22` : 'transparent', border:`1px solid ${cond===c ? (COND_COLOR[c]||B.white)+'60' : 'rgba(255,255,255,0.08)'}`, borderRadius:5, cursor:'pointer', fontFamily:'Space Mono,monospace', fontSize:8, color: cond===c ? (COND_COLOR[c]||B.white) : '#555', letterSpacing:1 }}>{c}</button>
            ))}
          </div>

          <div style={{ display:'flex', gap:4, marginLeft:'auto', flexWrap:'wrap' }}>
            {activeFilters > 0 && (
              <button onClick={() => { setCond('ALL'); setBrandFilter(''); setSizeFilter(''); setQuery('') }}
                style={{ padding:'7px 12px', background:`rgba(255,45,123,0.1)`, border:`1px solid ${B.neonMagenta}30`, borderRadius:5, cursor:'pointer', fontFamily:'Space Mono,monospace', fontSize:8, color:B.neonMagenta, letterSpacing:1 }}>
                CLEAR ALL ×
              </button>
            )}
            {['NEWEST','MOST WANTED'].map(s => (
              <button key={s} onClick={() => setSort(s)} style={{ padding:'7px 12px', background: sort===s ? `${B.amber}15` : 'transparent', border:`1px solid ${sort===s ? B.amber+'40' : 'rgba(255,255,255,0.08)'}`, borderRadius:5, cursor:'pointer', fontFamily:'Space Mono,monospace', fontSize:8, color: sort===s ? B.amber : '#555', letterSpacing:1 }}>{s}</button>
            ))}
          </div>
        </div>

        {/* grid */}
        {filtered.length === 0
          ? <div style={{ textAlign:'center', padding:'80px 0' }}>
              <div style={{ fontFamily:'Space Mono,monospace', fontSize:11, color:'#333', letterSpacing:2, marginBottom:12 }}>NO LISTINGS MATCH YOUR FILTERS</div>
              {activeFilters > 0 && <button onClick={() => { setCond('ALL'); setBrandFilter(''); setSizeFilter(''); setQuery('') }} style={{ padding:'9px 18px', background:'transparent', border:`1px solid ${B.neonCyan}30`, borderRadius:6, color:B.neonCyan, fontFamily:'Space Mono,monospace', fontSize:9, cursor:'pointer', letterSpacing:2 }}>CLEAR FILTERS</button>}
            </div>
          : <div style={{ columns:'auto 280px', columnGap:14 }}>
              {filtered.map(l => (
                <ListingCard key={l.id} listing={l} wanted={!!wants[l.id]} isOwn={mine.includes(l.id)}
                  onWant={handleWant} onContact={setContact} onRemove={handleRemove} />
              ))}
            </div>
        }

      </div>

      {posting && <PostModal onPost={handlePost} onClose={() => setPosting(false)} />}
      {contact  && <ContactPop listing={contact} onClose={() => setContact(null)} />}
    </section>
  )
}
