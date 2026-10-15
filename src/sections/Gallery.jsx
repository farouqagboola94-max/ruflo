import { useState, useEffect, useRef } from 'react'
import { B } from '../tokens'
import { GrainOverlay, SectionTag } from '../components/Shared'
import Egg from '../components/Egg'
import { safeStorage } from '../lib/safeStorage'
import { EVENT } from '../config'

const STORE_KEY = 'sf26_gallery'
const HEAT_KEY  = 'sf26_gallery_heat'

// ── 20 Curated Official Artworks & Flyers from Sneakers Fest Archive ──────────
export const OFFICIAL_GALLERY = [
  {
    id: 'sf_art_01',
    title: 'SNEAKERS FEST 26 · OFFICIAL KEY VISUAL',
    subtitle: 'Canva Pro Master Poster · Muri Okunola Park Edition',
    category: 'OFFICIAL FLYERS',
    badge: 'KEY ARTWORK',
    city: 'Victoria Island, Lagos',
    creator: '@s_fest26',
    imageData: '/media/gallery/flyer_01_hero.jpg',
    accent: B.amber,
    baseHeat: 428,
  },
  {
    id: 'sf_art_02',
    title: 'VVIP & TABLE RESERVATION PROTOCOL',
    subtitle: 'Executive Lounge & Fast-Track Access Flyer',
    category: 'OFFICIAL FLYERS',
    badge: 'VIP EDITION',
    city: 'Lagos',
    creator: '@catalystggg',
    imageData: '/media/gallery/flyer_02_vip.jpg',
    accent: B.neonCyan,
    baseHeat: 319,
  },
  {
    id: 'sf_art_03',
    title: 'DECEMBER 12 MAIN ARENA SHOWCASE',
    subtitle: 'Official Festival Lineup & Experience Poster',
    category: 'OFFICIAL FLYERS',
    badge: 'DEC 12 · 2026',
    city: 'Muri Okunola Park',
    creator: '@s_fest26',
    imageData: '/media/gallery/flyer_03_main.jpg',
    accent: B.neonMagenta,
    baseHeat: 385,
  },
  {
    id: 'sf_art_04',
    title: 'RETRO ARCHIVE · OG GRAIL SERIES',
    subtitle: 'Heritage Silhouettes & Collector Showcase Art',
    category: 'GRAIL ARTWORKS',
    badge: 'GRAIL VAULT',
    city: 'Lagos',
    creator: 'SF26 Design Lab',
    imageData: '/media/gallery/flyer_04_retro.jpg',
    accent: B.amber,
    baseHeat: 294,
  },
  {
    id: 'sf_art_05',
    title: 'WEST AFRICAN STREETWEAR RENAISSANCE',
    subtitle: '30+ Curated Brands & Independent Labels',
    category: 'STREET LABELS',
    badge: 'STREETWEAR',
    city: 'Lagos · Accra',
    creator: '@s_fest26',
    imageData: '/media/gallery/flyer_05_street.jpg',
    accent: B.neonLime,
    baseHeat: 267,
  },
  {
    id: 'sf_art_06',
    title: 'DEADSTOCK LEGENDS · LEGIT CHECK LAB',
    subtitle: 'UV Authentication & Rare Pair Exhibition',
    category: 'GRAIL ARTWORKS',
    badge: '100% VERIFIED',
    city: 'Victoria Island',
    creator: 'Authentication Desk',
    imageData: '/media/gallery/flyer_06_grail.jpg',
    accent: B.neonCyan,
    baseHeat: 352,
  },
  {
    id: 'sf_art_07',
    title: 'DANFO METROPOLIS · LAGOS ENERGY',
    subtitle: 'Afro-Futurist Street Culture & Transit Aesthetics',
    category: 'CULTURE & DRIP',
    badge: 'LAGOS SPIRIT',
    city: 'Lagos Island',
    creator: 'Canva Studio Cut',
    imageData: '/media/gallery/flyer_07_danfo.jpg',
    accent: B.amber,
    baseHeat: 411,
  },
  {
    id: 'sf_art_08',
    title: 'MAIN STAGE SOUNDCLASH & DJ CYPHER',
    subtitle: 'Afrobeats · Amapiano · Alté · Grime Sets',
    category: 'CULTURE & DRIP',
    badge: 'LIVE SOUND',
    city: 'Muri Okunola Park',
    creator: '@s_fest26',
    imageData: '/media/gallery/flyer_08_sound.jpg',
    accent: B.neonMagenta,
    baseHeat: 248,
  },
  {
    id: 'sf_art_09',
    title: 'ARENA GATES · 5,000 SNEAKERHEADS',
    subtitle: 'Full Grounds Activation & Experience Zones',
    category: 'OFFICIAL FLYERS',
    badge: 'MAIN GROUNDS',
    city: 'Victoria Island',
    creator: '@catalystggg',
    imageData: '/media/gallery/flyer_09_arena.jpg',
    accent: B.neonLime,
    baseHeat: 289,
  },
  {
    id: 'sf_art_10',
    title: 'EXCLUSIVE FESTIVAL DROP SERIES',
    subtitle: 'Limited-Run Collabs & Priority Release Queue',
    category: 'GRAIL ARTWORKS',
    badge: 'LIMITED DROP',
    city: 'Lagos',
    creator: 'Drop Vault',
    imageData: '/media/gallery/flyer_10_drop.jpg',
    accent: B.neonCyan,
    baseHeat: 376,
  },
  {
    id: 'sf_art_11',
    title: 'THE TRADING PIT · BUY · SELL · SWAP',
    subtitle: 'Live Sneaker Exchange & Collector Negotiation Floor',
    category: 'GRAIL ARTWORKS',
    badge: 'LSX PIT',
    city: 'Victoria Island',
    creator: '@s_fest26',
    imageData: '/media/gallery/flyer_11_trade.jpg',
    accent: B.amber,
    baseHeat: 312,
  },
  {
    id: 'sf_art_12',
    title: 'AFTER-DARK PROTOCOL · NIGHTFALL RAVE',
    subtitle: 'Neon Cybernetic Stage & Headline Closing Energy',
    category: 'CULTURE & DRIP',
    badge: 'NIGHT PROTOCOL',
    city: 'Lagos',
    creator: 'CapCut Visual Lab',
    imageData: '/media/gallery/flyer_12_fnp.jpg',
    accent: B.neonMagenta,
    baseHeat: 334,
  },
  {
    id: 'sf_art_13',
    title: 'SOLE ARTISTRY · LIVE CUSTOMIZATION BAY',
    subtitle: 'Airbrush, Hydro-Dip & Hand-Painted 1-of-1 Customs',
    category: 'CULTURE & DRIP',
    badge: 'CUSTOM LAB',
    city: 'Lagos',
    creator: 'Custom Collective',
    imageData: '/media/gallery/flyer_13_culture.jpg',
    accent: B.neonLime,
    baseHeat: 274,
  },
  {
    id: 'sf_art_14',
    title: 'THE TRIBE · COMMUNITY DRIP CHECK',
    subtitle: 'Fit Battle & Best On-Feet Lookbook Showcase',
    category: 'CULTURE & DRIP',
    badge: 'DRIP CHECK',
    city: 'Lagos',
    creator: '@s_fest26',
    imageData: '/media/gallery/flyer_14_community.jpg',
    accent: B.neonCyan,
    baseHeat: 298,
  },
  {
    id: 'sf_art_15',
    title: 'SNEAKER CARE & RESTORATION CLINIC',
    subtitle: 'Deep Clean, Suede Revival & Sole De-Yellowing',
    category: 'STREET LABELS',
    badge: 'CARE CLINIC',
    city: 'Victoria Island',
    creator: 'SF26 Care Lab',
    imageData: '/media/gallery/flyer_15_care.jpg',
    accent: B.amber,
    baseHeat: 215,
  },
  {
    id: 'sf_art_16',
    title: 'ALL-ACCESS PASS · TICKET TIER ARTWORK',
    subtitle: 'Regular · VIP · VVIP & Corporate Table Credentials',
    category: 'OFFICIAL FLYERS',
    badge: 'TICKETS LIVE',
    city: 'Lagos',
    creator: '@s_fest26',
    imageData: '/media/gallery/flyer_16_pass.jpg',
    accent: B.neonMagenta,
    baseHeat: 341,
  },
  {
    id: 'sf_art_17',
    title: 'VINTAGE & THRIFT ARCHIVE CORRIDOR',
    subtitle: '90s Sportswear, Heavyweight Tees & Rare Streetwear',
    category: 'STREET LABELS',
    badge: 'ARCHIVE LANE',
    city: 'Lagos',
    creator: 'Vendor Village',
    imageData: '/media/gallery/flyer_17_vintage.jpg',
    accent: B.neonLime,
    baseHeat: 256,
  },
  {
    id: 'sf_art_18',
    title: 'SUYA, SMOKE & STREET FOOD COURT',
    subtitle: 'All-Day Lagos Culinary Fuel & Craft Refreshments',
    category: 'CULTURE & DRIP',
    badge: 'FOOD ZONE',
    city: 'Muri Okunola Park',
    creator: '@s_fest26',
    imageData: '/media/gallery/flyer_18_food.jpg',
    accent: B.amber,
    baseHeat: 229,
  },
  {
    id: 'sf_art_19',
    title: 'OFFICIAL MERCHANDISE & CAPSULE LOOKBOOK',
    subtitle: 'Heavyweight Hoodies, Graphic Tees & Festival Totes',
    category: 'STREET LABELS',
    badge: 'CAPSULE 2026',
    city: 'Lagos',
    creator: '@s_fest26',
    imageData: '/media/gallery/flyer_19_merch.jpg',
    accent: B.neonCyan,
    baseHeat: 304,
  },
  {
    id: 'sf_art_20',
    title: 'THE MOVEMENT · SNEAKERS FEST LAGOS',
    subtitle: 'Collector Edition Commemorative Festival Print',
    category: 'OFFICIAL FLYERS',
    badge: 'COLLECTOR PRINT',
    city: 'Victoria Island, Lagos',
    creator: '@catalystggg',
    imageData: '/media/gallery/flyer_20_poster.jpg',
    accent: B.neonMagenta,
    baseHeat: 462,
  },
]

const CATEGORIES = [
  'ALL',
  'OFFICIAL FLYERS',
  'GRAIL ARTWORKS',
  'CULTURE & DRIP',
  'STREET LABELS',
  'COMMUNITY UPLOADS',
]

function compressImage(file) {
  return new Promise((res, rej) => {
    const reader = new FileReader()
    reader.onerror = rej
    reader.onload = e => {
      const img = new Image()
      img.onerror = rej
      img.onload = () => {
        const maxW = 700
        const scale = Math.min(1, maxW / img.width)
        const w = Math.round(img.width * scale)
        const h = Math.round(img.height * scale)
        const c = document.createElement('canvas')
        c.width = w; c.height = h
        c.getContext('2d').drawImage(img, 0, 0, w, h)
        res(c.toDataURL('image/jpeg', 0.78))
      }
      img.src = e.target.result
    }
    reader.readAsDataURL(file)
  })
}

function genId() {
  return 'gal_' + Date.now() + '_' + Math.random().toString(36).slice(2, 7)
}

// ── UploadModal ───────────────────────────────────────────────────────────────
function UploadModal({ onUpload, onClose }) {
  const [preview, setPreview] = useState(null)
  const [name,    setName]    = useState('')
  const [caption, setCaption] = useState('')
  const [city,    setCity]    = useState('')
  const [drag,    setDrag]    = useState(false)
  const [busy,    setBusy]    = useState(false)
  const [err,     setErr]     = useState('')
  const inputRef = useRef()

  async function handleFile(f) {
    if (!f) return
    if (!f.type.startsWith('image/')) { setErr('Please upload an image file (JPG, PNG, WEBP).'); return }
    if (f.size > 12 * 1024 * 1024) { setErr('File is too large. Max 12 MB.'); return }
    setErr('')
    try {
      const data = await compressImage(f)
      setPreview(data)
    } catch { setErr('Could not read image. Try another file.') }
  }

  async function submit() {
    if (!preview) { setErr('Please select a photo first.'); return }
    if (!name.trim()) { setErr('Please enter your name.'); return }
    setBusy(true)
    const photo = {
      id:         genId(),
      title:      caption.trim() || 'Community Grail Pair',
      subtitle:   `Uploaded by ${name.trim()}`,
      category:   'COMMUNITY UPLOADS',
      badge:      'COMMUNITY',
      creator:    name.trim(),
      caption:    caption.trim() || 'My Pair',
      city:       city.trim()    || 'Lagos',
      imageData:  preview,
      accent:     B.neonMagenta,
      uploadedAt: new Date().toISOString(),
      baseHeat:   1,
    }
    onUpload(photo)
    onClose()
  }

  const onDrop = e => {
    e.preventDefault(); setDrag(false)
    const f = e.dataTransfer.files?.[0]
    if (f) handleFile(f)
  }

  const IS = { width:'100%', padding:'10px 13px', background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.1)', borderRadius:6, color:B.white, fontFamily:'Syne,sans-serif', fontSize:13, outline:'none', boxSizing:'border-box' }

  return (
    <div style={{ position:'fixed', inset:0, zIndex:9999, display:'flex', alignItems:'flex-end', justifyContent:'center' }}
      onClick={e => { if (e.target === e.currentTarget) onClose() }}>
      <div style={{ position:'absolute', inset:0, background:'rgba(0,0,0,0.85)', backdropFilter:'blur(8px)' }} onClick={onClose} />
      <div style={{ position:'relative', width:'100%', maxWidth:500, background:B.void, border:`1px solid ${B.neonMagenta}40`, borderBottom:'none', borderRadius:'16px 16px 0 0', padding:'28px 28px 36px', animation:'modalUp 0.3s ease' }}>
        <style>{`@keyframes modalUp{from{transform:translateY(100%);opacity:0}to{transform:translateY(0);opacity:1}}`}</style>

        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:20 }}>
          <div style={{ fontFamily:'Bebas Neue,sans-serif', fontSize:22, color:B.white, letterSpacing:2 }}>ADD YOUR PHOTO TO THE WALL</div>
          <button onClick={onClose} style={{ background:'none', border:'none', color:B.smoke, fontSize:20, cursor:'pointer', lineHeight:1, padding:4 }}>✕</button>
        </div>

        <div
          onDragOver={e => { e.preventDefault(); setDrag(true) }}
          onDragLeave={() => setDrag(false)}
          onDrop={onDrop}
          onClick={() => inputRef.current?.click()}
          style={{ border:`2px dashed ${drag ? B.neonMagenta : preview ? B.neonMagenta + '70' : B.dim}`, borderRadius:10, marginBottom:16, cursor:'pointer', background: drag ? `${B.neonMagenta}08` : 'rgba(255,255,255,0.02)', transition:'all 0.2s', overflow:'hidden', minHeight: preview ? 'auto' : 130, display:'flex', alignItems:'center', justifyContent:'center' }}
        >
          {preview
            ? <img src={preview} alt="preview" style={{ width:'100%', maxHeight:260, objectFit:'cover', display:'block' }} />
            : (
              <div style={{ textAlign:'center', padding:'24px 16px' }}>
                <div style={{ fontSize:28, marginBottom:8 }}>📸</div>
                <div style={{ fontFamily:'Syne,sans-serif', fontSize:13, color:B.smoke }}>Drop your sneaker/fit photo here or tap to browse</div>
                <div style={{ fontFamily:'Space Mono,monospace', fontSize:9, color: B.dim, marginTop:4 }}>JPG · PNG · WEBP · Max 12 MB</div>
              </div>
            )
          }
        </div>
        <input aria-label="Choose a photo to upload" ref={inputRef} type="file" accept="image/*" style={{ display:'none' }} onChange={e => { if (e.target.files?.[0]) handleFile(e.target.files[0]) }} />

        <div style={{ display:'flex', flexDirection:'column', gap:11, marginBottom:16 }}>
          {[
            { lbl:'YOUR NAME / HANDLE *', val:name,    set:setName,    ph:'e.g. @farouq_kicks' },
            { lbl:'THE PAIR / FIT',       val:caption, set:setCaption, ph:'e.g. Jordan 1 High OG Chicago' },
            { lbl:'YOUR CITY',            val:city,    set:setCity,    ph:'e.g. Victoria Island, Lagos' },
          ].map(({ lbl, val, set, ph }) => (
            <div key={lbl}>
              <label style={{ fontFamily:'Space Mono,monospace', fontSize:8, color: B.smoke, letterSpacing:2, display:'block', marginBottom:5 }}>{lbl}</label>
              <input aria-label={lbl} value={val} onChange={e => set(e.target.value)} placeholder={ph} style={IS} />
            </div>
          ))}
        </div>

        {err && <div style={{ fontFamily:'Syne,sans-serif', fontSize:11, color:B.neonMagenta, marginBottom:10 }}>{err}</div>}

        <button onClick={submit} disabled={busy || !preview}
          style={{ width:'100%', padding:'14px 0', background: !preview ? '#1a1a1a' : B.neonMagenta, border:'none', borderRadius:8, color: !preview ? B.smoke : B.white, fontFamily:'Bebas Neue,sans-serif', fontSize:18, letterSpacing:3, cursor: !preview ? 'not-allowed' : 'pointer', transition:'all 0.2s' }}>
          {busy ? 'ADDING…' : 'ADD TO THE WALL →'}
        </button>
      </div>
    </div>
  )
}

// ── Lightbox Modal ────────────────────────────────────────────────────────────
function LightboxModal({ item, items, onSelect, onClose, onHeat, liked, heatCount }) {
  useEffect(() => {
    const onKey = e => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowRight') {
        const idx = items.findIndex(x => x.id === item.id)
        if (idx >= 0) onSelect(items[(idx + 1) % items.length])
      }
      if (e.key === 'ArrowLeft') {
        const idx = items.findIndex(x => x.id === item.id)
        if (idx >= 0) onSelect(items[(idx - 1 + items.length) % items.length])
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [item, items, onSelect, onClose])

  if (!item) return null
  const idx = items.findIndex(x => x.id === item.id)
  const accent = item.accent || B.amber

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={item.title}
      onClick={e => { if (e.target === e.currentTarget) onClose() }}
      style={{
        position:'fixed', inset:0, zIndex:10000,
        background:'rgba(4,4,8,0.92)', backdropFilter:'blur(16px)',
        display:'flex', alignItems:'center', justifyContent:'center',
        padding:'20px',
      }}
    >
      <div style={{
        position:'relative', width:'100%', maxWidth:980,
        background:B.charcoal, border:`1px solid ${accent}45`,
        borderRadius:14, overflow:'hidden',
        boxShadow:`0 28px 90px rgba(0,0,0,0.85), 0 0 40px ${accent}20`,
        display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(300px, 1fr))',
      }}>
        {/* Image viewer */}
        <div style={{ position:'relative', background:'#050507', display:'flex', alignItems:'center', justifyContent:'center', minHeight:360, maxHeight:'78vh' }}>
          <img
            src={item.imageData}
            alt={item.title}
            decoding="async"
            style={{ width:'100%', height:'100%', maxHeight:'78vh', objectFit:'contain', display:'block' }}
          />
          {items.length > 1 && (
            <>
              <button
                aria-label="Previous artwork"
                onClick={() => onSelect(items[(idx - 1 + items.length) % items.length])}
                style={{ position:'absolute', left:12, top:'50%', transform:'translateY(-50%)', width:38, height:38, borderRadius:'50%', background:'rgba(0,0,0,0.72)', border:`1px solid ${B.gunmetal}`, color:B.white, cursor:'pointer', fontSize:16 }}
              >
                ←
              </button>
              <button
                aria-label="Next artwork"
                onClick={() => onSelect(items[(idx + 1) % items.length])}
                style={{ position:'absolute', right:12, top:'50%', transform:'translateY(-50%)', width:38, height:38, borderRadius:'50%', background:'rgba(0,0,0,0.72)', border:`1px solid ${B.gunmetal}`, color:B.white, cursor:'pointer', fontSize:16 }}
              >
                →
              </button>
            </>
          )}
        </div>

        {/* Details sidebar */}
        <div style={{ padding:'28px 26px', display:'flex', flexDirection:'column', justifyContent:'space-between', gap:20 }}>
          <div>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:16 }}>
              <span style={{ fontFamily:'Space Mono,monospace', fontSize:9, letterSpacing:2, color:accent, padding:'4px 10px', borderRadius:4, background:`${accent}15`, border:`1px solid ${accent}40` }}>
                {item.badge || item.category}
              </span>
              <button onClick={onClose} aria-label="Close preview" style={{ background:'none', border:'none', color:B.smoke, fontSize:20, cursor:'pointer' }}>✕</button>
            </div>

            <div style={{ fontFamily:'Bebas Neue,sans-serif', fontSize:30, color:B.white, letterSpacing:1.5, lineHeight:1.05, marginBottom:8 }}>
              {item.title}
            </div>
            <div style={{ fontFamily:'Syne,sans-serif', fontSize:13, color:B.smoke, lineHeight:1.6, marginBottom:18 }}>
              {item.subtitle}
            </div>

            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10, padding:'14px', background:'rgba(255,255,255,0.02)', border:`1px solid ${B.gunmetal}`, borderRadius:8, marginBottom:18 }}>
              <div>
                <div style={{ fontFamily:'Space Mono,monospace', fontSize:8, color:B.dim, letterSpacing:1.5 }}>ARCHIVE SERIES</div>
                <div style={{ fontFamily:'Space Mono,monospace', fontSize:11, color:B.white, marginTop:3 }}>{item.category}</div>
              </div>
              <div>
                <div style={{ fontFamily:'Space Mono,monospace', fontSize:8, color:B.dim, letterSpacing:1.5 }}>LOCATION</div>
                <div style={{ fontFamily:'Space Mono,monospace', fontSize:11, color:B.white, marginTop:3 }}>{item.city || 'Lagos'}</div>
              </div>
              <div>
                <div style={{ fontFamily:'Space Mono,monospace', fontSize:8, color:B.dim, letterSpacing:1.5 }}>CURATED BY</div>
                <div style={{ fontFamily:'Space Mono,monospace', fontSize:11, color:accent, marginTop:3 }}>{item.creator || '@s_fest26'}</div>
              </div>
              <div>
                <div style={{ fontFamily:'Space Mono,monospace', fontSize:8, color:B.dim, letterSpacing:1.5 }}>EDITION</div>
                <div style={{ fontFamily:'Space Mono,monospace', fontSize:11, color:B.white, marginTop:3 }}>DEC 12 · 2026</div>
              </div>
            </div>
          </div>

          <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
            <div style={{ display:'flex', gap:10 }}>
              <button
                onClick={() => onHeat(item.id)}
                style={{
                  flex:1, padding:'12px 16px',
                  background: liked ? B.neonMagenta : 'rgba(255,255,255,0.05)',
                  border:`1px solid ${liked ? B.neonMagenta : B.gunmetal}`,
                  borderRadius:8, color:B.white, cursor:'pointer',
                  fontFamily:'Space Mono,monospace', fontSize:11, fontWeight:700,
                }}
              >
                🔥 {liked ? ' SALUTED' : ' SALUTE ARTWORK'} · {heatCount}
              </button>
              <a
                href={item.imageData}
                download={`${item.id}.jpg`}
                style={{
                  padding:'12px 16px', background:`${accent}18`,
                  border:`1px solid ${accent}55`, borderRadius:8,
                  color:accent, textDecoration:'none',
                  fontFamily:'Space Mono,monospace', fontSize:11, fontWeight:700,
                  display:'inline-flex', alignItems:'center', justifyContent:'center',
                }}
              >
                ⬇ SAVE FLYER
              </a>
            </div>
            <div style={{ fontFamily:'Space Mono,monospace', fontSize:9, color:B.dim, textAlign:'center' }}>
              ITEM {idx + 1} OF {items.length} · USE ← → ARROW KEYS TO BROWSE
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// ── GalleryCard ───────────────────────────────────────────────────────────────
function GalleryCard({ item, onHeat, liked, heatCount, onOpen }) {
  const [hov, setHov] = useState(false)
  const accent = item.accent || B.neonMagenta

  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      onClick={() => onOpen(item)}
      style={{
        position:'relative', borderRadius:10, overflow:'hidden', cursor:'pointer',
        background:B.charcoal,
        border:`1px solid ${hov ? accent + '75' : 'rgba(255,255,255,0.08)'}`,
        transition:'transform 0.28s cubic-bezier(0.16,1,0.3,1), box-shadow 0.28s ease, border-color 0.25s ease',
        transform: hov ? 'translateY(-5px)' : 'none',
        boxShadow: hov ? `0 16px 42px rgba(0,0,0,0.72), 0 0 24px ${accent}22` : '0 6px 20px rgba(0,0,0,0.4)',
      }}
    >
      {/* Top neon accent bar */}
      <div style={{ height:2, background:`linear-gradient(90deg, ${accent}, transparent)` }} />

      <div style={{ position:'relative', overflow:'hidden', background:'#08080c', aspectRatio:'4/5' }}>
        <img
          src={item.imageData}
          alt={item.title}
          loading="lazy"
          decoding="async"
          width="400"
          height="500"
          style={{
            width:'100%', height:'100%', display:'block', objectFit:'cover',
            transition:'transform 0.45s cubic-bezier(0.16,1,0.3,1)',
            transform: hov ? 'scale(1.04)' : 'scale(1)',
          }}
        />
        {/* Gradient overlay */}
        <div style={{
          position:'absolute', inset:0,
          background:'linear-gradient(0deg, rgba(5,5,9,0.92) 0%, rgba(5,5,9,0.28) 48%, rgba(5,5,9,0.1) 100%)',
          opacity: hov ? 1 : 0.82, transition:'opacity 0.25s',
        }} />

        {/* Category badge */}
        <div style={{
          position:'absolute', top:10, left:10,
          background:'rgba(5,5,9,0.78)', border:`1px solid ${accent}55`,
          borderRadius:4, padding:'3px 8px',
          fontFamily:'Space Mono,monospace', fontSize:8, color:accent,
          letterSpacing:1.5, backdropFilter:'blur(6px)',
        }}>
          {item.badge || item.category}
        </div>

        {/* Heat button */}
        <button
          onClick={e => { e.stopPropagation(); onHeat(item.id) }}
          aria-label={`Give heat to ${item.title}`}
          style={{
            position:'absolute', top:10, right:10,
            background: liked ? 'rgba(255,45,123,0.9)' : 'rgba(5,5,9,0.75)',
            border:`1px solid ${liked ? B.neonMagenta : 'rgba(255,255,255,0.2)'}`,
            borderRadius:20, padding:'4px 10px', cursor:'pointer',
            fontFamily:'Space Mono,monospace', fontSize:9,
            color: liked ? B.white : B.smoke,
            display:'flex', alignItems:'center', gap:5,
            transition:'all 0.2s', backdropFilter:'blur(6px)',
          }}
        >
          🔥 {heatCount}
        </button>

        {/* Bottom caption */}
        <div style={{ position:'absolute', bottom:0, left:0, right:0, padding:'14px 14px 12px' }}>
          <div style={{ fontFamily:'Bebas Neue,sans-serif', fontSize:18, color:B.white, letterSpacing:1, lineHeight:1.1 }}>
            {item.title}
          </div>
          <div style={{ fontFamily:'Syne,sans-serif', fontSize:11, color:B.smoke, marginTop:3, lineHeight:1.35 }}>
            {item.subtitle}
          </div>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginTop:8, paddingTop:6, borderTop:'1px solid rgba(255,255,255,0.08)' }}>
            <span style={{ fontFamily:'Space Mono,monospace', fontSize:8, color:accent, letterSpacing:1 }}>
              {item.creator} · {item.city}
            </span>
            <span style={{ fontFamily:'Space Mono,monospace', fontSize:8, color:B.white, opacity: hov ? 1 : 0.6 }}>
              VIEW HD ↗
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

// ── Main Gallery Section ──────────────────────────────────────────────────────
export default function Gallery() {
  const [userPhotos, setUserPhotos] = useState([])
  const [heat,       setHeat]       = useState({})
  const [modal,      setModal]      = useState(false)
  const [activeCat,  setActiveCat]  = useState('ALL')
  const [lightbox,   setLightbox]   = useState(null)

  useEffect(() => {
    try { setUserPhotos(JSON.parse(safeStorage.getItem(STORE_KEY) || '[]')) } catch {}
    try { setHeat(JSON.parse(safeStorage.getItem(HEAT_KEY)  || '{}')) } catch {}
  }, [])

  function addPhoto(photo) {
    const next = [photo, ...userPhotos]
    setUserPhotos(next)
    try { safeStorage.setItem(STORE_KEY, JSON.stringify(next)) } catch {}
    setActiveCat('ALL')
  }

  function toggleHeat(id) {
    const nextHeat = { ...heat }
    if (nextHeat[id]) delete nextHeat[id]
    else nextHeat[id] = true
    setHeat(nextHeat)
    try { safeStorage.setItem(HEAT_KEY, JSON.stringify(nextHeat)) } catch {}
  }

  const allItems = [...userPhotos, ...OFFICIAL_GALLERY]
  const filteredItems = activeCat === 'ALL'
    ? allItems
    : allItems.filter(item => item.category === activeCat)

  const getHeatCount = item => (item.baseHeat || item.heat || 1) + (heat[item.id] ? 1 : 0)
  const totalHeat = allItems.reduce((sum, item) => sum + getHeatCount(item), 0)

  return (
    <section id="gallery" style={{ position:'relative', overflow:'hidden', background:B.black, padding:'100px 24px' }}>
      <GrainOverlay />
      <Egg id="egg-069" corner="top-right" />
      <Egg id="egg-070" corner="bottom-left" />
      <div style={{ position:'absolute', top:'40%', left:'50%', transform:'translate(-50%,-50%)', width:680, height:440, background:`radial-gradient(ellipse, ${B.neonMagenta}08 0%, transparent 70%)`, filter:'blur(60px)', pointerEvents:'none' }} />

      <div style={{ position:'relative', zIndex:10, maxWidth:1160, margin:'0 auto' }}>

        {/* Header row */}
        <div className="reveal-3d" style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-end', flexWrap:'wrap', gap:20, marginBottom:32 }}>
          <div>
            <SectionTag>OFFICIAL ARTWORK & FLYER SHOWCASE · CANVA & STUDIO ARCHIVE</SectionTag>
            <div className="reveal-3d text-3d" style={{ fontFamily:"'Bebas Neue', sans-serif", fontSize:'clamp(40px, 6vw, 68px)', color:B.white, lineHeight:0.9 }}>
              THE VISUAL<br /><span style={{ color:B.neonMagenta }}>ARCHIVE</span>
            </div>
            <div style={{ fontFamily:'Syne,sans-serif', fontSize:14, color:B.smoke, maxWidth:560, marginTop:12, lineHeight:1.6 }}>
              Explore {OFFICIAL_GALLERY.length} official Sneakers Fest 2026 posters, grail showcases, and street culture artworks curated from the official studio drive — plus live community uploads.
            </div>
            <div style={{ display:'flex', flexWrap:'wrap', gap:18, marginTop:14 }}>
              <div style={{ fontFamily:'Space Mono,monospace', fontSize:10, color:B.smoke }}>
                🎨 <span style={{ color:B.neonMagenta, fontWeight:700 }}>{allItems.length}</span> OFFICIAL & COMMUNITY ARTWORKS
              </div>
              <div style={{ fontFamily:'Space Mono,monospace', fontSize:10, color:B.smoke }}>
                🔥 <span style={{ color:B.amber, fontWeight:700 }}>{totalHeat.toLocaleString()}</span> TOTAL CULTURE HEAT
              </div>
              <div style={{ fontFamily:'Space Mono,monospace', fontSize:10, color:B.neonCyan }}>
                📍 MURI OKUNOLA PARK · DEC 12, 2026
              </div>
            </div>
          </div>

          <button onClick={() => setModal(true)}
            style={{ display:'inline-flex', alignItems:'center', gap:8, padding:'13px 22px', background:`${B.neonMagenta}18`, border:`1px solid ${B.neonMagenta}65`, borderRadius:6, cursor:'pointer', fontFamily:'Bebas Neue,sans-serif', fontSize:15, color:B.neonMagenta, letterSpacing:2, transition:'all 0.2s' }}
            onMouseEnter={e => { e.currentTarget.style.background=`${B.neonMagenta}30`; e.currentTarget.style.boxShadow=`0 0 24px ${B.neonMagenta}25` }}
            onMouseLeave={e => { e.currentTarget.style.background=`${B.neonMagenta}18`; e.currentTarget.style.boxShadow='none' }}>
            + UPLOAD YOUR GRAIL PHOTO
          </button>
        </div>

        {/* Category Filter Bar */}
        <div className="reveal-3d" style={{ display:'flex', flexWrap:'wrap', gap:8, marginBottom:32 }}>
          {CATEGORIES.map(cat => {
            const active = activeCat === cat
            const count = cat === 'ALL' ? allItems.length : allItems.filter(i => i.category === cat).length
            return (
              <button
                key={cat}
                onClick={() => setActiveCat(cat)}
                style={{
                  padding:'8px 14px',
                  borderRadius:20,
                  cursor:'pointer',
                  fontFamily:'Space Mono,monospace',
                  fontSize:10,
                  letterSpacing:1.5,
                  background: active ? B.neonMagenta : 'rgba(255,255,255,0.03)',
                  color: active ? B.white : B.smoke,
                  border: `1px solid ${active ? B.neonMagenta : 'rgba(255,255,255,0.1)'}`,
                  transition:'all 0.2s',
                }}
              >
                {cat} ({count})
              </button>
            )
          })}
        </div>

        {/* Masonry Wall of 20+ Real Artworks */}
        <div className="reveal-3d" style={{ columns:'auto 265px', columnGap:16, orphans:1, widows:1 }}>
          {filteredItems.map(item => (
            <div key={item.id} style={{ breakInside:'avoid', marginBottom:16 }}>
              <GalleryCard
                item={item}
                onHeat={toggleHeat}
                liked={!!heat[item.id]}
                heatCount={getHeatCount(item)}
                onOpen={setLightbox}
              />
            </div>
          ))}

          {/* CTA add card */}
          <div style={{ breakInside:'avoid', marginBottom:16 }}>
            <div onClick={() => setModal(true)}
              className="card-3d"
              style={{ height:210, background:'rgba(255,255,255,0.02)', border:`2px dashed ${B.neonMagenta}40`, borderRadius:10, display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer', transition:'all 0.2s' }}
              onMouseEnter={e => { e.currentTarget.style.borderColor=`${B.neonMagenta}80`; e.currentTarget.style.background=`${B.neonMagenta}08` }}
              onMouseLeave={e => { e.currentTarget.style.borderColor=`${B.neonMagenta}40`; e.currentTarget.style.background='rgba(255,255,255,0.02)' }}>
              <div style={{ textAlign:'center', padding:16 }}>
                <div style={{ width:46, height:46, borderRadius:'50%', border:`2px dashed ${B.neonMagenta}65`, display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 10px' }}>
                  <span style={{ color:B.neonMagenta, fontSize:20, lineHeight:1 }}>+</span>
                </div>
                <div style={{ fontFamily:'Space Mono,monospace', fontSize:9, color:B.neonMagenta, letterSpacing:2 }}>ADD YOUR PAIR</div>
                <div style={{ fontFamily:'Syne,sans-serif', fontSize:11, color:B.smoke, marginTop:4 }}>Join the official Sneakers Fest wall</div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div style={{ marginTop:32, textAlign:'center', fontFamily:'Syne,sans-serif', fontSize:13, color:B.smoke, lineHeight:1.75 }}>
          Tag <a href={EVENT.twitter} target="_blank" rel="noopener noreferrer" style={{ color:B.amber, textDecoration:'none', fontWeight:700 }}>@s_fest26</a> &amp; <a href={EVENT.twitterConvener || 'https://x.com/catalystggg'} target="_blank" rel="noopener noreferrer" style={{ color:B.neonCyan, textDecoration:'none', fontWeight:700 }}>@catalystggg</a> to be featured in the official lookbook.
        </div>
      </div>

      {modal && <UploadModal onUpload={addPhoto} onClose={() => setModal(false)} />}
      {lightbox && (
        <LightboxModal
          item={lightbox}
          items={filteredItems}
          onSelect={setLightbox}
          onClose={() => setLightbox(null)}
          onHeat={toggleHeat}
          liked={!!heat[lightbox.id]}
          heatCount={getHeatCount(lightbox)}
        />
      )}
    </section>
  )
}
