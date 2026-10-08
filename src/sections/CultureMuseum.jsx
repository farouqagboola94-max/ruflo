import { useState, useEffect, useRef } from 'react'
import { B } from '../tokens'
import Egg from '../components/Egg'

const ARTWORKS = [
  {
    id: 'aw1',
    title: 'LAGOS AT DAWN',
    artist: 'Catalyst Archive',
    edition: '1 of 1',
    medium: 'Digital Oil · 2026',
    startBid: 180000,
    art: {
      background: `radial-gradient(ellipse 80% 60% at 50% 100%, ${B.amber}CC 0%, #E8451A 30%, #8B1A1A 60%, #1A0A0A 100%)`,
      before: `linear-gradient(180deg, transparent 0%, #0A0A1A 40%)`,
      overlay: `repeating-linear-gradient(0deg, transparent, transparent 2px, ${B.amber}08 2px, ${B.amber}08 4px)`,
    },
    shapes: [
      { top:'55%', left:'10%', w:80, h:80, bg:`${B.amber}30`, shape:'circle', blur:20 },
      { top:'50%', left:'50%', w:4, h:'45%', bg:`${B.amber}80`, shape:'rect' },
      { top:'20%', left:'30%', w:40, h:40, bg:`${B.amber}20`, shape:'circle', blur:30 },
      { top:'30%', left:'65%', w:60, h:60, bg:'#E8451A30', shape:'circle', blur:25 },
    ],
  },
  {
    id: 'aw2',
    title: 'SOLE SUPREMACY',
    artist: 'Nnamdi Vis.',
    edition: '3 of 7',
    medium: 'Generative Print · 2026',
    startBid: 95000,
    art: {
      background: `linear-gradient(135deg, #0A0A1A 0%, #0D1A2E 50%, #0A0A0A 100%)`,
      overlay: `repeating-linear-gradient(45deg, ${B.neonCyan}08 0px, transparent 1px, transparent 20px, ${B.neonCyan}08 21px)`,
    },
    shapes: [
      { top:'50%', left:'50%', w:'80%', h:'60%', bg:'transparent', border:`2px solid ${B.neonCyan}40`, shape:'rect', transform:'translate(-50%,-50%) skewX(-8deg)' },
      { top:'50%', left:'50%', w:'65%', h:'40%', bg:`linear-gradient(135deg, ${B.neonCyan}20, transparent)`, shape:'rect', transform:'translate(-50%,-50%) skewX(-8deg)' },
      { top:'65%', left:'15%', w:60, h:12, bg:B.neonCyan, shape:'rect', borderRadius:0 },
      { top:'65%', left:'27%', w:45, h:12, bg:`${B.neonCyan}80`, shape:'rect', borderRadius:0 },
      { top:'75%', left:'20%', w:100, h:4, bg:`${B.neonCyan}40`, shape:'rect' },
      { top:'45%', left:'72%', w:30, h:30, bg:`${B.neonCyan}60`, shape:'circle', blur:15 },
    ],
  },
  {
    id: 'aw3',
    title: 'NEON VOID I',
    artist: 'Zara Lagos',
    edition: '1 of 3',
    medium: 'Digital Noir · 2025',
    startBid: 320000,
    art: {
      background: '#050508',
      overlay: `radial-gradient(ellipse at 30% 60%, ${B.neonMagenta}25 0%, transparent 60%), radial-gradient(ellipse at 75% 35%, ${B.neonCyan}20 0%, transparent 55%)`,
    },
    shapes: [
      { top:'30%', left:'28%', w:2, h:'40%', bg:`linear-gradient(180deg, transparent, ${B.neonMagenta}, transparent)`, shape:'rect' },
      { top:'30%', left:'55%', w:2, h:'40%', bg:`linear-gradient(180deg, transparent, ${B.neonCyan}, transparent)`, shape:'rect' },
      { top:'50%', left:'28%', w:'27%', h:2, bg:`linear-gradient(90deg, ${B.neonMagenta}, ${B.neonCyan})`, shape:'rect', transform:'translateY(-50%)' },
      { top:'50%', left:'38%', w:16, h:16, bg:B.neonMagenta, shape:'circle', blur:8 },
      { top:'35%', left:'52%', w:10, h:10, bg:B.neonCyan, shape:'circle', blur:6 },
      { top:'65%', left:'58%', w:8, h:8, bg:`${B.neonMagenta}CC`, shape:'circle', blur:4 },
    ],
  },
  {
    id: 'aw4',
    title: 'THE MOVEMENT',
    artist: 'Fola Ink',
    edition: '2 of 5',
    medium: 'Mixed Digital · 2026',
    startBid: 150000,
    art: {
      background: `linear-gradient(160deg, #0A120A 0%, #0A0A0A 100%)`,
      overlay: `linear-gradient(90deg, ${B.neonLime}10 1px, transparent 1px)`,
      overlaySize: '40px 100%',
    },
    shapes: [
      { top:'20%', left:'20%', w:12, h:12, bg:B.neonLime, shape:'circle' },
      { top:'35%', left:'35%', w:12, h:12, bg:B.neonLime, shape:'circle' },
      { top:'45%', left:'50%', w:12, h:12, bg:B.neonLime, shape:'circle' },
      { top:'55%', left:'62%', w:12, h:12, bg:B.neonLime, shape:'circle' },
      { top:'65%', left:'72%', w:12, h:12, bg:B.neonLime, shape:'circle' },
      { top:'20%', left:'20%', w:3, h:'60%', bg:`linear-gradient(180deg, ${B.neonLime}60, transparent)`, shape:'rect', transform:'translate(4px, 12px) rotate(30deg)', origin:'top' },
      { top:'10%', left:'55%', w:50, h:50, bg:`${B.neonLime}10`, shape:'circle', blur:30 },
      { top:'70%', left:'20%', w:60, h:60, bg:`${B.neonLime}08`, shape:'circle', blur:25 },
    ],
  },
  {
    id: 'aw5',
    title: 'ALTÉ ALTAR',
    artist: 'Seun Frames',
    edition: '1 of 1',
    medium: 'Digital Shrine · 2026',
    startBid: 500000,
    art: {
      background: `radial-gradient(circle at 50% 50%, #1A0A2E 0%, #0A050A 70%)`,
      overlay: `conic-gradient(from 0deg at 50% 50%, ${B.neonMagenta}10, ${B.amber}08, ${B.neonCyan}10, ${B.neonMagenta}10)`,
    },
    shapes: [
      { top:'50%', left:'50%', w:120, h:120, bg:'transparent', border:`1px solid ${B.amber}40`, shape:'circle', transform:'translate(-50%,-50%)' },
      { top:'50%', left:'50%', w:90, h:90, bg:'transparent', border:`1px solid ${B.neonMagenta}30`, shape:'circle', transform:'translate(-50%,-50%)' },
      { top:'50%', left:'50%', w:60, h:60, bg:`radial-gradient(circle, ${B.amber}50, ${B.neonMagenta}20, transparent)`, shape:'circle', transform:'translate(-50%,-50%)' },
      { top:'20%', left:'50%', w:2, h:'30%', bg:`${B.amber}60`, shape:'rect', transform:'translateX(-50%)' },
      { top:'50%', left:'50%', w:'30%', h:2, bg:`${B.amber}60`, shape:'rect', transform:'translate(-50%,-50%)' },
      { top:'70%', left:'50%', w:2, h:'10%', bg:`${B.amber}40`, shape:'rect', transform:'translateX(-50%)' },
    ],
  },
  {
    id: 'aw6',
    title: 'MARKET DAY',
    artist: 'Catalyst Archive',
    edition: '4 of 10',
    medium: 'Street Document · 2025',
    startBid: 65000,
    art: {
      background: `linear-gradient(180deg, #1A0F00 0%, #2E1A00 50%, #0A0800 100%)`,
      overlay: `repeating-linear-gradient(90deg, ${B.amber}08 0px, transparent 1px, transparent 18px, ${B.amber}08 19px), repeating-linear-gradient(0deg, ${B.amber}05 0px, transparent 1px, transparent 18px, ${B.amber}05 19px)`,
    },
    shapes: [
      { top:'60%', left:'10%', w:20, h:35, bg:B.amber, shape:'rect' },
      { top:'60%', left:'22%', w:25, h:45, bg:`${B.amber}CC`, shape:'rect' },
      { top:'60%', left:'38%', w:18, h:30, bg:`${B.amber}80`, shape:'rect' },
      { top:'60%', left:'55%', w:22, h:40, bg:`${B.amber}90`, shape:'rect' },
      { top:'60%', left:'70%', w:28, h:50, bg:`${B.amber}BB`, shape:'rect' },
      { top:'85%', left:'0%', w:'100%', h:12, bg:`${B.amber}30`, shape:'rect' },
      { top:'40%', left:'40%', w:60, h:60, bg:`${B.amber}20`, shape:'circle', blur:25 },
    ],
  },
  {
    id: 'aw7',
    title: 'DEC 12 PROPHESY',
    artist: 'Farouq C.',
    edition: '1 of 1',
    medium: 'Manifest Print · 2026',
    startBid: 750000,
    art: {
      background: '#000000',
      overlay: `linear-gradient(135deg, ${B.amber}15 0%, transparent 50%, ${B.neonCyan}10 100%)`,
    },
    shapes: [
      { top:'50%', left:'50%', w:'100%', h:'100%', bg:'transparent', shape:'rect', transform:'translate(-50%,-50%)',
        textContent: '12', fontSize:'140px', fontFamily:'Bebas Neue', color:`${B.amber}20`, fontWeight:700 },
      { top:'50%', left:'50%', w:150, h:2, bg:`linear-gradient(90deg, transparent, ${B.amber}, transparent)`, shape:'rect', transform:'translate(-50%,-50%)' },
      { top:'45%', left:'50%', w:100, h:2, bg:`linear-gradient(90deg, transparent, ${B.amber}60, transparent)`, shape:'rect', transform:'translate(-50%,-50%)' },
      { top:'55%', left:'50%', w:100, h:2, bg:`linear-gradient(90deg, transparent, ${B.amber}60, transparent)`, shape:'rect', transform:'translate(-50%,-50%)' },
      { top:'30%', left:'50%', w:20, h:20, bg:B.amber, shape:'circle', blur:10 },
      { top:'70%', left:'50%', w:20, h:20, bg:B.amber, shape:'circle', blur:10 },
    ],
  },
  {
    id: 'aw8',
    title: 'GRAIL KEEPER',
    artist: 'Nnamdi Vis.',
    edition: '2 of 3',
    medium: "Collector's Digital · 2026",
    startBid: 220000,
    art: {
      background: `linear-gradient(160deg, #0A0A1A 0%, #000510 100%)`,
      overlay: `radial-gradient(ellipse 50% 30% at 50% 70%, ${B.neonCyan}18 0%, transparent 100%)`,
    },
    shapes: [
      { top:'20%', left:'30%', w:90, h:90, bg:'transparent', border:`1px solid ${B.neonCyan}50`, shape:'rect', transform:'rotate(45deg)' },
      { top:'20%', left:'30%', w:68, h:68, bg:`linear-gradient(135deg, ${B.neonCyan}20, transparent)`, shape:'rect', transform:'rotate(45deg) translate(11px,11px)' },
      { top:'53%', left:'50%', w:4, h:4, bg:B.neonCyan, shape:'circle', blur:4 },
      { top:'50%', left:'20%', w:'60%', h:1, bg:`linear-gradient(90deg, transparent, ${B.neonCyan}50, transparent)`, shape:'rect', transform:'translateY(-50%)' },
      { top:'70%', left:'25%', w:20, h:20, bg:`${B.neonCyan}40`, shape:'circle', blur:12 },
      { top:'70%', left:'60%', w:15, h:15, bg:`${B.neonCyan}30`, shape:'circle', blur:8 },
    ],
  },
]

const AW_WATCHERS = [23, 41, 67, 18, 89, 12, 54, 31]

const BID_ACTIVITY = [
  "Anonymous raised NEON VOID I to ₦335,000",
  "Tunde B. placed ₦95,500 on SOLE SUPREMACY",
  "Kemi A. is watching DEC 12 PROPHESY",
  "New bid on ALTÉ ALTAR — ₦520,000",
  "Adaeze placed ₦170,000 on THE MOVEMENT",
  "Chidi C. watching GRAIL KEEPER",
  "LAGOS AT DAWN just received a bid — ₦195,000",
  "3 people watching MARKET DAY",
]

function editionUrgency(edition) {
  if (edition.includes('1 of 1')) return 'ONE OF A KIND'
  const m = edition.match(/of (\d+)/)
  if (m && parseInt(m[1]) <= 3) return 'LIMITED EDITION'
  return null
}

function fmt(n) {
  return '₦' + n.toLocaleString('en-NG')
}

function ArtCanvas({ art, shapes }) {
  return (
    <div style={{ position:'relative', width:'100%', paddingTop:'75%', overflow:'hidden', background: art.background }}>
      <div style={{ position:'absolute', inset:0, background: art.overlay, backgroundSize: art.overlaySize || '100% 100%' }} />
      {(shapes || []).map((s, i) => {
        if (s.textContent) {
          return (
            <div key={i} style={{
              position:'absolute', top:s.top, left:s.left,
              width:s.w, height:s.h,
              display:'flex', alignItems:'center', justifyContent:'center',
              transform:s.transform, pointerEvents:'none',
            }}>
              <span style={{ fontSize:s.fontSize, fontFamily:s.fontFamily, color:s.color, fontWeight:s.fontWeight, userSelect:'none', lineHeight:1 }}>
                {s.textContent}
              </span>
            </div>
          )
        }
        return (
          <div key={i} style={{
            position:'absolute',
            top: s.top, left: s.left,
            width: typeof s.w === 'number' ? s.w : s.w,
            height: typeof s.h === 'number' ? s.h : s.h,
            background: s.bg,
            border: s.border,
            borderRadius: s.shape === 'circle' ? '50%' : (s.borderRadius !== undefined ? s.borderRadius : 4),
            filter: s.blur ? `blur(${s.blur}px)` : undefined,
            transform: s.transform,
            transformOrigin: s.origin || 'center',
            pointerEvents: 'none',
          }} />
        )
      })}
    </div>
  )
}

function BidModal({ artwork, bids, onBid, onClose }) {
  const [amount, setAmount] = useState('')
  const [err, setErr] = useState('')
  const current = bids[artwork.id] || artwork.startBid
  const min = current + 5000

  function submit() {
    const val = parseInt(amount.replace(/[^0-9]/g, ''), 10)
    if (!val || val < min) { setErr(`Minimum bid is ${fmt(min)}`); return }
    onBid(artwork.id, val)
    onClose()
  }

  return (
    <div style={{ position:'fixed', inset:0, zIndex:9999, display:'flex', alignItems:'flex-end', justifyContent:'center' }}
      onClick={e => { if (e.target === e.currentTarget) onClose() }}>
      <div style={{ position:'absolute', inset:0, background:'rgba(0,0,0,0.8)' }} />
      <div className="card-3d" style={{
        position:'relative', width:'100%', maxWidth:480, background:B.void,
        border:`1px solid ${B.amber}50`, borderBottom:'none',
        borderRadius:'16px 16px 0 0', padding:28,
        animation:'modalUp 0.3s ease',
      }}>
        <style>{`@keyframes modalUp { from { transform:translateY(100%); opacity:0; } to { transform:translateY(0); opacity:1; } }`}</style>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:20 }}>
          <div>
            <div style={{ fontFamily:'Bebas Neue', fontSize:22, color:B.white, letterSpacing:2 }}>{artwork.title}</div>
            <div style={{ fontFamily:'Space Mono', fontSize:11, color:B.smoke, marginTop:3 }}>{artwork.artist} · {artwork.edition}</div>
          </div>
          <button onClick={onClose} style={{ background:'none', border:'none', color:B.smoke, fontSize:22, cursor:'pointer', lineHeight:1 }}>✕</button>
        </div>

        <div style={{ background:`${B.amber}10`, border:`1px solid ${B.amber}30`, borderRadius:8, padding:12, marginBottom:20 }}>
          <div style={{ fontFamily:'Space Mono', fontSize:10, color:B.amber, letterSpacing:1 }}>CURRENT BID</div>
          <div style={{ fontFamily:'Bebas Neue', fontSize:28, color:B.amber, letterSpacing:2, marginTop:2 }}>{fmt(current)}</div>
          <div style={{ fontFamily:'Space Mono', fontSize:10, color:B.smoke, marginTop:2 }}>Minimum next bid: {fmt(min)}</div>
        </div>

        <div style={{ marginBottom:16 }}>
          <label style={{ fontFamily:'Syne', fontSize:12, color:B.smoke, display:'block', marginBottom:6 }}>YOUR BID (₦)</label>
          <input aria-label="Your bid in naira"
            type="text" value={amount} placeholder={min.toLocaleString()}
            onChange={e => { setAmount(e.target.value); setErr('') }}
            onKeyDown={e => e.key === 'Enter' && submit()}
            style={{ width:'100%', background:`${B.white}08`, border:`1px solid ${B.amber}40`, borderRadius:6, padding:'10px 14px', color:B.white, fontFamily:'Space Mono', fontSize:14, outline:'none' }}
          />
          {err && <div style={{ fontFamily:'Syne', fontSize:11, color:B.neonMagenta, marginTop:5 }}>{err}</div>}
        </div>

        <button onClick={submit} style={{
          width:'100%', padding:'14px 0', background:`linear-gradient(90deg, ${B.amber}, #D48000)`,
          border:'none', borderRadius:6, color:B.black, fontFamily:'Bebas Neue', fontSize:18, letterSpacing:3, cursor:'pointer',
        }}>PLACE BID</button>
        <div style={{ fontFamily:'Space Mono', fontSize:10, color:B.smoke, textAlign:'center', marginTop:10 }}>
          Bids are recorded on the Sacred Wall. Winning bid claimed at event.
        </div>
      </div>
    </div>
  )
}

function ArtCard({ artwork, bids, onBid, watchers }) {
  const [hovered, setHovered] = useState(false)
  const [bidOpen, setBidOpen] = useState(false)
  const current = bids[artwork.id] || artwork.startBid
  const hasBid = !!bids[artwork.id]

  return (
    <>
      <div
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          background: B.void, border:`2px solid ${hovered ? B.amber : B.charcoal}`,
          borderRadius:8, overflow:'hidden', transition:'all 0.3s ease',
          transform: hovered ? 'translateY(-4px)' : 'none',
          boxShadow: hovered ? `0 12px 40px ${B.amber}25` : '0 2px 12px rgba(0,0,0,0.5)',
          position:'relative',
        }}
      >
        {hasBid && (
          <div style={{
            position:'absolute', top:12, right:12, zIndex:2, background:B.neonLime, color:B.black,
            fontFamily:'Bebas Neue', fontSize:11, letterSpacing:2, padding:'3px 8px', borderRadius:2,
          }}>BID PLACED</div>
        )}

        {watchers > 0 && (
          <div style={{ position:'absolute', top:12, left:12, zIndex:2, background:'rgba(0,0,0,0.75)', border:'1px solid rgba(255,255,255,0.06)', borderRadius:3, padding:'3px 9px', fontFamily:'Space Mono', fontSize:8, color: B.smoke, whiteSpace:'nowrap' }}>
            👁 {watchers}
          </div>
        )}

        <div style={{ height:3, background:`linear-gradient(90deg, transparent, ${B.amber}, transparent)` }} />

        <ArtCanvas art={artwork.art} shapes={artwork.shapes} />

        {hovered && (
          <div style={{ position:'absolute', top:0, left:0, right:0, paddingTop:'75%',
            background:`radial-gradient(ellipse at 50% 50%, ${B.amber}08 0%, transparent 70%)`,
            pointerEvents:'none' }} />
        )}

        <div style={{ padding:'16px 18px 18px' }}>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:6 }}>
            <div>
              <div style={{ fontFamily:'Bebas Neue', fontSize:18, color:B.white, letterSpacing:2, lineHeight:1 }}>{artwork.title}</div>
              <div style={{ fontFamily:'Space Mono', fontSize:10, color:B.smoke, marginTop:3 }}>{artwork.artist}</div>
            </div>
            <div style={{ textAlign:'right' }}>
              <div style={{ fontFamily:'Space Mono', fontSize:9, color:B.amber, letterSpacing:1 }}>{artwork.edition}</div>
              {editionUrgency(artwork.edition) && (
                <div style={{ fontFamily:'Space Mono', fontSize: 9, color:B.neonMagenta, letterSpacing:1, marginTop:2 }}>
                  ⚡ {editionUrgency(artwork.edition)}
                </div>
              )}
              <div style={{ fontFamily:'Space Mono', fontSize:9, color:B.smoke, marginTop:1 }}>{artwork.medium}</div>
            </div>
          </div>

          <div style={{ height:1, background:`${B.amber}20`, margin:'10px 0' }} />

          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-end' }}>
            <div>
              <div style={{ fontFamily:'Space Mono', fontSize:9, color:B.smoke, letterSpacing:1, marginBottom:2 }}>
                {hasBid ? 'HIGHEST BID' : 'OPENING BID'}
              </div>
              <div style={{ fontFamily:'Bebas Neue', fontSize:22, color:hasBid ? B.neonLime : B.amber, letterSpacing:1 }}>
                {fmt(current)}
              </div>
            </div>
            <button onClick={() => setBidOpen(true)} style={{
              padding:'8px 16px', background:'transparent',
              border:`1px solid ${B.amber}`, borderRadius:4,
              color:B.amber, fontFamily:'Bebas Neue', fontSize:13, letterSpacing:2, cursor:'pointer',
              transition:'all 0.2s',
            }}
              onMouseEnter={e => { e.currentTarget.style.background = B.amber; e.currentTarget.style.color = B.black }}
              onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = B.amber }}
            >
              BID NOW
            </button>
          </div>
        </div>

        <div style={{ height:3, background:`linear-gradient(90deg, transparent, ${B.amber}, transparent)` }} />
      </div>

      {bidOpen && <BidModal artwork={artwork} bids={bids} onBid={onBid} onClose={() => setBidOpen(false)} />}
    </>
  )
}

export default function CultureMuseum() {
  const [bids, setBids]               = useState({})
  const [watcherMap, setWatcherMap]   = useState(() => Object.fromEntries(ARTWORKS.map((aw, i) => [aw.id, AW_WATCHERS[i]])))
  const [tickerIdx,  setTickerIdx]    = useState(0)
  const watchRef = useRef(null)
  const bidRef   = useRef(null)

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem('sf26_museum_bids') || '{}')
      setBids(saved)
    } catch {}
    watchRef.current = setInterval(() => {
      setWatcherMap(prev => {
        const next = { ...prev }
        ARTWORKS.forEach((aw, i) => {
          const base  = AW_WATCHERS[i]
          const delta = Math.floor(Math.random() * 5) - 2
          next[aw.id] = Math.max(base - 5, (prev[aw.id] || base) + delta)
        })
        return next
      })
    }, 9000)
    bidRef.current = setInterval(() => setTickerIdx(p => (p + 1) % BID_ACTIVITY.length), 4500)
    return () => { clearInterval(watchRef.current); clearInterval(bidRef.current) }
  }, [])

  function handleBid(id, amount) {
    const next = { ...bids, [id]: amount }
    setBids(next)
    try { localStorage.setItem('sf26_museum_bids', JSON.stringify(next)) } catch {}
  }

  const totalBid = Object.values(bids).reduce((a, b) => a + b, 0)

  return (
    <section id="museum" style={{ background:B.black, padding:'80px 0', position:'relative', overflow:'hidden' }}>
      <Egg id="egg-031" corner="top-right" />
      <Egg id="egg-032" corner="bottom-left" />
      <div style={{ maxWidth:1200, margin:'0 auto', padding:'0 24px' }}>

        <div style={{ textAlign:'center', marginBottom:56 }}>
          <div style={{ fontFamily:'Orbitron', fontSize:11, color:B.amber, letterSpacing:4, marginBottom:12 }}>
            SNEAKERS FEST '26 · THE GALLERY
          </div>
          <h2 className="reveal-3d text-3d" style={{ fontFamily:'Bebas Neue', fontSize:'clamp(42px,8vw,80px)', color:B.white, letterSpacing:4, lineHeight:1, margin:0 }}>
            THE CULTURE MUSEUM
          </h2>
          <div style={{ fontFamily:'Syne', fontSize:14, color:B.smoke, marginTop:16, maxWidth:540, margin:'16px auto 0', lineHeight:1.7 }}>
            Original digital works from Lagos creatives — each piece a piece of the movement.
            Bid, collect, and take a fragment of culture home. All winning bids claimed at the event.
          </div>

          {totalBid > 0 && (
            <div style={{ display:'inline-flex', alignItems:'center', gap:10, marginTop:20,
              background:`${B.amber}12`, border:`1px solid ${B.amber}40`, borderRadius:40, padding:'8px 20px' }}>
              <span style={{ fontFamily:'Space Mono', fontSize:10, color:B.amber, letterSpacing:1 }}>TOTAL BIDS PLACED</span>
              <span style={{ fontFamily:'Bebas Neue', fontSize:18, color:B.amber, letterSpacing:2 }}>{fmt(totalBid)}</span>
            </div>
          )}
          <style>{`@keyframes bidTick { 0%,100%{opacity:1} 50%{opacity:0.3} }`}</style>
          <div className="reveal-3d" style={{ marginTop:14, display:'flex', justifyContent:'center' }}>
            <div style={{ display:'inline-flex', alignItems:'center', gap:8, background:'rgba(255,255,255,0.025)', border:'1px solid rgba(255,255,255,0.06)', borderRadius:4, padding:'7px 14px', maxWidth:380, overflow:'hidden' }}>
              <span style={{ width:5, height:5, borderRadius:'50%', background:B.neonCyan, flexShrink:0, animation:'bidTick 3s ease infinite' }} />
              <span style={{ fontFamily:"'Space Mono',monospace", fontSize:8, color: B.smoke, whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>
                {BID_ACTIVITY[tickerIdx]}
              </span>
            </div>
          </div>
        </div>

        <div className="reveal-3d" style={{ columns:'auto 280px', columnGap:20, orphans:1, widows:1 }}>
          {ARTWORKS.map(aw => (
            <div key={aw.id} style={{ breakInside:'avoid', marginBottom:20 }}>
              <ArtCard artwork={aw} bids={bids} onBid={handleBid} watchers={watcherMap[aw.id] || 0} />
            </div>
          ))}
        </div>

        <div className="card-3d" style={{ marginTop:48, textAlign:'center', padding:'24px', border:`1px solid ${B.amber}20`, borderRadius:8, background:`${B.amber}05` }}>
          <div style={{ fontFamily:'Bebas Neue', fontSize:16, color:B.amber, letterSpacing:3, marginBottom:8 }}>ABOUT THE MUSEUM</div>
          <div style={{ fontFamily:'Syne', fontSize:13, color:B.smoke, maxWidth:600, margin:'0 auto', lineHeight:1.7 }}>
            The Culture Museum is an evolving archive. New works drop closer to December 12.
            All pieces are one-of-a-kind or limited edition digital prints by Lagos creatives.
            Winning bids are verified and claimed at the Sneakers Fest '26 venue.
          </div>
        </div>
      </div>
    </section>
  )
}
