import { useState, useEffect } from 'react'
import { B } from '../tokens'

const RSVP_SEED = 1247
const PASS      = 'SF26ADMIN'

const AW = {
  aw1: { title: 'LAGOS AT DAWN',     start: 180000 },
  aw2: { title: 'SOLE SUPREMACY',    start: 95000  },
  aw3: { title: 'NEON VOID I',       start: 320000 },
  aw4: { title: 'THE MOVEMENT',      start: 150000 },
  aw5: { title: 'ALTÉ ALTAR',        start: 500000 },
  aw6: { title: 'MARKET DAY',        start: 65000  },
  aw7: { title: 'DEC 12 PROPHESY',   start: 750000 },
  aw8: { title: 'GRAIL KEEPER',      start: 220000 },
}

const fmt = n => '₦' + Number(n).toLocaleString('en-NG')
const fmtDate = s => { try { return new Date(s).toLocaleString('en-GB', { dateStyle:'short', timeStyle:'short' }) } catch { return s } }

const row = (label, val) => (
  <div key={label}>
    <div style={{ fontFamily:'Space Mono,monospace', fontSize:8, color:'#444', letterSpacing:2 }}>{label}</div>
    <div style={{ fontFamily:'Syne,sans-serif', fontSize:12, color:'#aaa', marginTop:2 }}>{val || '—'}</div>
  </div>
)

// ── Stat card ─────────────────────────────────────────────────────────────────
function Stat({ label, value, sub, color }) {
  return (
    <div style={{ flex:'1 1 180px', background:'rgba(255,255,255,0.03)', border:`1px solid ${color}30`, borderRadius:12, padding:'22px 24px' }}>
      <div style={{ fontFamily:'Orbitron,monospace', fontSize:8, color, letterSpacing:3, marginBottom:10 }}>{label}</div>
      <div style={{ fontFamily:'Bebas Neue,sans-serif', fontSize:44, color:B.white, lineHeight:1 }}>{value}</div>
      {sub && <div style={{ fontFamily:'Space Mono,monospace', fontSize:9, color:'#555', marginTop:6 }}>{sub}</div>}
    </div>
  )
}

// ── Password gate ─────────────────────────────────────────────────────────────
function LoginGate({ onAuth }) {
  const [pw,  setPw]  = useState('')
  const [err, setErr] = useState(false)

  function attempt() {
    if (pw === PASS) { sessionStorage.setItem('sf26_admin', '1'); onAuth() }
    else { setErr(true); setTimeout(() => setErr(false), 700) }
  }

  return (
    <div style={{ minHeight:'100vh', background:B.void, display:'flex', alignItems:'center', justifyContent:'center' }}>
      <div style={{
        background:'rgba(255,255,255,0.03)', border:`1px solid ${B.amber}30`, borderRadius:16,
        padding:'52px 44px', width:'100%', maxWidth:360, textAlign:'center',
        animation: err ? 'shake 0.4s' : 'none',
      }}>
        <style>{`@keyframes shake { 0%,100%{transform:translateX(0)} 20%,60%{transform:translateX(-8px)} 40%,80%{transform:translateX(8px)} }`}</style>
        <div style={{ fontFamily:'Orbitron,monospace', fontSize:10, color:B.amber, letterSpacing:4, marginBottom:8 }}>SNEAKERS FEST '26</div>
        <div style={{ fontFamily:'Bebas Neue,sans-serif', fontSize:38, color:B.white, letterSpacing:3, marginBottom:36 }}>ADMIN ACCESS</div>
        <input
          type="password" value={pw}
          onChange={e => setPw(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && attempt()}
          placeholder="Enter passphrase"
          autoFocus
          style={{ width:'100%', padding:'13px 16px', background:'rgba(255,255,255,0.05)', border:`1px solid ${err ? B.neonMagenta+'80' : B.amber+'40'}`, borderRadius:8, color:B.white, fontFamily:'Space Mono,monospace', fontSize:13, outline:'none', boxSizing:'border-box', marginBottom:14, transition:'border-color 0.2s' }}
        />
        <button onClick={attempt} style={{ width:'100%', padding:'14px', background:B.amber, border:'none', borderRadius:8, color:B.black, fontFamily:'Bebas Neue,sans-serif', fontSize:18, letterSpacing:3, cursor:'pointer' }}>
          ENTER
        </button>
        {err && <div style={{ fontFamily:'Space Mono,monospace', fontSize:10, color:B.neonMagenta, marginTop:12 }}>Incorrect passphrase</div>}
      </div>
    </div>
  )
}

// ── Header / nav ──────────────────────────────────────────────────────────────
function Topbar({ tab, setTab, onLogout, counts }) {
  const TABS = [
    { id:'OVERVIEW', badge: null },
    { id:'VENDORS',  badge: counts.vendors || null },
    { id:'MUSEUM',   badge: counts.bids || null },
    { id:'GALLERY',  badge: counts.gallery || null },
  ]
  return (
    <div style={{ background:'#050505', borderBottom:'1px solid rgba(255,255,255,0.07)', padding:'0 24px', position:'sticky', top:0, zIndex:100 }}>
      <div style={{ maxWidth:1100, margin:'0 auto', display:'flex', alignItems:'center', justifyContent:'space-between', height:54 }}>
        <div style={{ display:'flex', alignItems:'center', gap:24 }}>
          <div style={{ fontFamily:'Orbitron,monospace', fontSize:10, color:B.amber, letterSpacing:3 }}>SF26 · ADMIN</div>
          <div style={{ display:'flex', gap:2 }}>
            {TABS.map(({ id, badge }) => (
              <button key={id} onClick={() => setTab(id)} style={{
                padding:'6px 14px', cursor:'pointer', fontFamily:'Space Mono,monospace', fontSize:9, letterSpacing:2,
                background: tab===id ? `${B.amber}18` : 'transparent',
                border: tab===id ? `1px solid ${B.amber}40` : '1px solid transparent',
                borderRadius:6, color: tab===id ? B.amber : '#555', position:'relative',
              }}>
                {id}
                {badge && <span style={{ position:'absolute', top:2, right:2, background:B.neonCyan, color:B.black, fontFamily:'Orbitron,monospace', fontSize:7, borderRadius:99, padding:'1px 4px', fontWeight:700 }}>{badge}</span>}
              </button>
            ))}
          </div>
        </div>
        <button onClick={onLogout} style={{ padding:'6px 14px', background:'transparent', border:'1px solid #2a2a2a', borderRadius:6, color:'#555', fontFamily:'Space Mono,monospace', fontSize:9, cursor:'pointer' }}>LOGOUT</button>
      </div>
    </div>
  )
}

// ── Overview ──────────────────────────────────────────────────────────────────
function Overview({ vendors, bids, gallery }) {
  const rsvp     = RSVP_SEED + Number(localStorage.getItem('sf26_rsvp_count') || 0)
  const bidTotal = Object.values(bids).reduce((a, b) => a + b, 0)

  return (
    <div style={{ display:'flex', flexDirection:'column', gap:28 }}>
      <div style={{ display:'flex', gap:14, flexWrap:'wrap' }}>
        <Stat label="TOTAL RSVPs"      value={rsvp.toLocaleString()}      sub="as of today"              color={B.amber} />
        <Stat label="VENDOR APPS"      value={vendors.length}             sub={vendors.length === 1 ? '1 application' : `${vendors.length} received`} color={B.neonCyan} />
        <Stat label="MUSEUM BID VALUE" value={bidTotal ? fmt(bidTotal) : '—'} sub={`${Object.keys(bids).length} of 8 artworks bid on`} color={B.neonMagenta} />
        <Stat label="GALLERY PHOTOS"   value={gallery.length}             sub={`${gallery.reduce((a,p) => a+(p.heat||0), 0)} total heat`} color={B.neonLime} />
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(300px, 1fr))', gap:14 }}>
        {/* Recent vendor apps */}
        <div style={{ background:'rgba(255,255,255,0.02)', border:'1px solid rgba(255,255,255,0.07)', borderRadius:12, padding:24 }}>
          <div style={{ fontFamily:'Orbitron,monospace', fontSize:9, color:B.neonCyan, letterSpacing:3, marginBottom:16 }}>RECENT APPLICATIONS</div>
          {vendors.length === 0 && <div style={{ fontFamily:'Space Mono,monospace', fontSize:11, color:'#333' }}>None yet</div>}
          {[...vendors].reverse().slice(0, 5).map(v => (
            <div key={v.applicationId} style={{ padding:'10px 0', borderBottom:'1px solid rgba(255,255,255,0.04)' }}>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'baseline' }}>
                <span style={{ fontFamily:'Bebas Neue,sans-serif', fontSize:16, color:B.white }}>{v.business}</span>
                <span style={{ fontFamily:'Orbitron,monospace', fontSize:9, color:B.amber }}>{v.applicationId}</span>
              </div>
              <div style={{ fontFamily:'Space Mono,monospace', fontSize:9, color:'#444', marginTop:2 }}>{v.booth} · {fmtDate(v.submittedAt)}</div>
            </div>
          ))}
        </div>

        {/* Top bids */}
        <div style={{ background:'rgba(255,255,255,0.02)', border:'1px solid rgba(255,255,255,0.07)', borderRadius:12, padding:24 }}>
          <div style={{ fontFamily:'Orbitron,monospace', fontSize:9, color:B.neonMagenta, letterSpacing:3, marginBottom:16 }}>TOP MUSEUM BIDS</div>
          {Object.keys(bids).length === 0 && <div style={{ fontFamily:'Space Mono,monospace', fontSize:11, color:'#333' }}>No bids yet</div>}
          {Object.entries(bids).sort((a,b) => b[1]-a[1]).map(([id, amt]) => (
            <div key={id} style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'9px 0', borderBottom:'1px solid rgba(255,255,255,0.04)' }}>
              <span style={{ fontFamily:'Space Mono,monospace', fontSize:11, color:B.smoke }}>{AW[id]?.title || id}</span>
              <span style={{ fontFamily:'Orbitron,monospace', fontSize:11, color:B.amber }}>{fmt(amt)}</span>
            </div>
          ))}
        </div>

        {/* Hot gallery photos */}
        <div style={{ background:'rgba(255,255,255,0.02)', border:'1px solid rgba(255,255,255,0.07)', borderRadius:12, padding:24 }}>
          <div style={{ fontFamily:'Orbitron,monospace', fontSize:9, color:B.neonLime, letterSpacing:3, marginBottom:16 }}>HOTTEST PHOTOS</div>
          {gallery.length === 0 && <div style={{ fontFamily:'Space Mono,monospace', fontSize:11, color:'#333' }}>No photos yet</div>}
          {[...gallery].sort((a,b) => (b.heat||0)-(a.heat||0)).slice(0, 5).map(p => (
            <div key={p.id} style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'9px 0', borderBottom:'1px solid rgba(255,255,255,0.04)' }}>
              <span style={{ fontFamily:'Space Mono,monospace', fontSize:11, color:B.smoke }}>{p.name}{p.city ? ` · ${p.city}` : ''}</span>
              <span style={{ fontFamily:'Orbitron,monospace', fontSize:11, color:B.neonLime }}>🔥 {p.heat || 0}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ── Vendors ───────────────────────────────────────────────────────────────────
function Vendors({ vendors }) {
  function exportCSV() {
    if (!vendors.length) return
    const keys = ['applicationId','business','contact','email','phone','booth','category','bio','submittedAt']
    const head = keys.join(',')
    const rows = vendors.map(v => keys.map(k => `"${(v[k]||'').toString().replace(/"/g,'""')}"`).join(','))
    const blob = new Blob([[head, ...rows].join('\n')], { type:'text/csv' })
    const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = 'SF26-vendors.csv'; a.click()
  }

  return (
    <div>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:20 }}>
        <div style={{ fontFamily:'Space Mono,monospace', fontSize:11, color:'#444' }}>{vendors.length} application{vendors.length !== 1 ? 's' : ''}</div>
        <button onClick={exportCSV} disabled={!vendors.length} style={{ padding:'8px 18px', background: vendors.length ? `${B.amber}15` : 'transparent', border:`1px solid ${vendors.length ? B.amber+'40' : '#2a2a2a'}`, borderRadius:6, color: vendors.length ? B.amber : '#333', fontFamily:'Space Mono,monospace', fontSize:9, letterSpacing:2, cursor: vendors.length ? 'pointer' : 'default' }}>
          EXPORT CSV
        </button>
      </div>
      {vendors.length === 0 && <div style={{ fontFamily:'Space Mono,monospace', fontSize:13, color:'#333', textAlign:'center', padding:80 }}>No vendor applications yet</div>}
      <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
        {[...vendors].reverse().map(v => (
          <div key={v.applicationId} style={{ background:'rgba(255,255,255,0.02)', border:'1px solid rgba(255,255,255,0.07)', borderRadius:12, padding:'20px 24px' }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:14 }}>
              <div>
                <div style={{ fontFamily:'Bebas Neue,sans-serif', fontSize:22, color:B.white, letterSpacing:2 }}>{v.business}</div>
                <div style={{ fontFamily:'Space Mono,monospace', fontSize:9, color:'#444', marginTop:3 }}>{fmtDate(v.submittedAt)}</div>
              </div>
              <div style={{ fontFamily:'Orbitron,monospace', fontSize:12, color:B.amber, letterSpacing:2 }}>{v.applicationId}</div>
            </div>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(160px, 1fr))', gap:10, marginBottom: v.bio ? 14 : 0 }}>
              {row('CONTACT', v.contact)}
              {row('EMAIL', v.email)}
              {row('PHONE', v.phone)}
              {row('BOOTH', v.booth)}
              {row('CATEGORY', v.category)}
            </div>
            {v.bio && <div style={{ padding:'10px 14px', background:'rgba(255,255,255,0.02)', borderRadius:6, fontFamily:'Syne,sans-serif', fontSize:12, color:'#777', lineHeight:1.7 }}>{v.bio}</div>}
          </div>
        ))}
      </div>
    </div>
  )
}

// ── Museum ────────────────────────────────────────────────────────────────────
function Museum({ bids }) {
  const total = Object.values(bids).reduce((a, b) => a + b, 0)
  return (
    <div>
      <div style={{ fontFamily:'Space Mono,monospace', fontSize:11, color:'#444', marginBottom:20 }}>
        Total bid value: <span style={{ color:B.amber }}>{total ? fmt(total) : '—'}</span>
      </div>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(240px, 1fr))', gap:12 }}>
        {Object.entries(AW).map(([id, { title, start }]) => {
          const current = bids[id] || 0
          const hasBid  = current > 0
          return (
            <div key={id} style={{ background:'rgba(255,255,255,0.02)', border:`1px solid ${hasBid ? B.amber+'35' : 'rgba(255,255,255,0.06)'}`, borderRadius:12, padding:20 }}>
              <div style={{ fontFamily:'Space Mono,monospace', fontSize:8, color:hasBid ? B.amber : '#333', letterSpacing:2, marginBottom:6 }}>{id.toUpperCase()}</div>
              <div style={{ fontFamily:'Bebas Neue,sans-serif', fontSize:18, color:B.white, letterSpacing:2, marginBottom:12 }}>{title}</div>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-end' }}>
                <div>
                  <div style={{ fontFamily:'Space Mono,monospace', fontSize:8, color:'#444', letterSpacing:2 }}>{hasBid ? 'CURRENT BID' : 'NO BID YET'}</div>
                  <div style={{ fontFamily:'Orbitron,monospace', fontSize:18, color: hasBid ? B.amber : '#2a2a2a', marginTop:4 }}>{hasBid ? fmt(current) : fmt(start)}</div>
                </div>
                {hasBid && (
                  <div style={{ textAlign:'right' }}>
                    <div style={{ fontFamily:'Space Mono,monospace', fontSize:8, color:'#444', letterSpacing:2 }}>ABOVE FLOOR</div>
                    <div style={{ fontFamily:'Orbitron,monospace', fontSize:11, color:B.neonLime, marginTop:4 }}>+{fmt(current - start)}</div>
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ── Gallery ───────────────────────────────────────────────────────────────────
function Gallery({ gallery, setGallery }) {
  function remove(id) {
    const next = gallery.filter(p => p.id !== id)
    setGallery(next)
    try { localStorage.setItem('sf26_gallery', JSON.stringify(next)) } catch {}
    const heat = JSON.parse(localStorage.getItem('sf26_gallery_heat') || '{}')
    delete heat[id]
    try { localStorage.setItem('sf26_gallery_heat', JSON.stringify(heat)) } catch {}
  }

  const total = gallery.reduce((a, p) => a + (p.heat || 0), 0)

  return (
    <div>
      <div style={{ fontFamily:'Space Mono,monospace', fontSize:11, color:'#444', marginBottom:20 }}>
        {gallery.length} photo{gallery.length !== 1 ? 's' : ''} · <span style={{ color:B.neonLime }}>🔥 {total} total heat</span>
      </div>
      {gallery.length === 0 && <div style={{ fontFamily:'Space Mono,monospace', fontSize:13, color:'#333', textAlign:'center', padding:80 }}>No community photos yet</div>}
      <div style={{ columns:'auto 210px', columnGap:10 }}>
        {[...gallery].sort((a,b) => (b.heat||0)-(a.heat||0)).map(p => (
          <div key={p.id} style={{ breakInside:'avoid', marginBottom:10, borderRadius:10, overflow:'hidden', border:'1px solid rgba(255,255,255,0.07)', background:'#0a0a0a' }}>
            <img src={p.imageData} alt={p.name} loading="lazy" style={{ width:'100%', display:'block' }} />
            <div style={{ padding:'10px 12px', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
              <div>
                <div style={{ fontFamily:'Bebas Neue,sans-serif', fontSize:14, color:B.white }}>{p.name || 'Anonymous'}</div>
                <div style={{ fontFamily:'Space Mono,monospace', fontSize:8, color:'#444', marginTop:2 }}>
                  {p.city || ''}{p.city && ' · '}🔥 {p.heat || 0} · {fmtDate(p.uploadedAt)}
                </div>
              </div>
              <button onClick={() => remove(p.id)} style={{ padding:'5px 9px', background:`${B.neonMagenta}15`, border:`1px solid ${B.neonMagenta}40`, borderRadius:5, color:B.neonMagenta, fontFamily:'Space Mono,monospace', fontSize:8, cursor:'pointer' }}>
                ✕
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ── Root ──────────────────────────────────────────────────────────────────────
export default function Admin() {
  const [authed,  setAuthed]  = useState(sessionStorage.getItem('sf26_admin') === '1')
  const [tab,     setTab]     = useState('OVERVIEW')
  const [vendors, setVendors] = useState([])
  const [bids,    setBids]    = useState({})
  const [gallery, setGallery] = useState([])

  useEffect(() => {
    if (!authed) return
    try { setVendors(JSON.parse(localStorage.getItem('sf26_vendor_apps') || '[]')) } catch {}
    try { setBids(JSON.parse(localStorage.getItem('sf26_museum_bids') || '{}'))    } catch {}
    try { setGallery(JSON.parse(localStorage.getItem('sf26_gallery') || '[]'))     } catch {}
  }, [authed])

  function logout() { sessionStorage.removeItem('sf26_admin'); setAuthed(false) }

  if (!authed) return <LoginGate onAuth={() => setAuthed(true)} />

  const counts = { vendors: vendors.length, bids: Object.keys(bids).length, gallery: gallery.length }

  return (
    <div style={{ minHeight:'100vh', background:B.void, color:B.white }}>
      <style>{`* { margin:0; padding:0; box-sizing:border-box; } body { background:${B.void}; }`}</style>
      <Topbar tab={tab} setTab={setTab} onLogout={logout} counts={counts} />
      <div style={{ maxWidth:1100, margin:'0 auto', padding:'32px 24px 80px' }}>
        {tab === 'OVERVIEW' && <Overview vendors={vendors} bids={bids} gallery={gallery} />}
        {tab === 'VENDORS'  && <Vendors  vendors={vendors} />}
        {tab === 'MUSEUM'   && <Museum   bids={bids} />}
        {tab === 'GALLERY'  && <Gallery  gallery={gallery} setGallery={setGallery} />}
      </div>
    </div>
  )
}
