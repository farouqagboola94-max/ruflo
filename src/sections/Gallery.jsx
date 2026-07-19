import { useState, useEffect, useRef } from 'react'
import { B } from '../tokens'
import { GrainOverlay, SectionTag } from '../components/Shared'
import Egg from '../components/Egg'

const STORE_KEY = 'sf26_gallery'
const HEAT_KEY  = 'sf26_gallery_heat'

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

// ── UploadModal ───────────────────────────────────────────────────────────────────────────────
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
      name:       name.trim(),
      caption:    caption.trim() || 'My Pair',
      city:       city.trim()    || 'Lagos',
      imageData:  preview,
      uploadedAt: new Date().toISOString(),
      heat:       0,
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
          <div style={{ fontFamily:'Bebas Neue,sans-serif', fontSize:22, color:B.white, letterSpacing:2 }}>ADD YOUR PHOTO</div>
          <button onClick={onClose} style={{ background:'none', border:'none', color:B.smoke, fontSize:20, cursor:'pointer', lineHeight:1, padding:4 }}>✕</button>
        </div>

        {/* Drop zone */}
        <div
          onDragOver={e => { e.preventDefault(); setDrag(true) }}
          onDragLeave={() => setDrag(false)}
          onDrop={onDrop}
          onClick={() => inputRef.current?.click()}
          style={{ border:`2px dashed ${drag ? B.neonMagenta : preview ? B.neonMagenta + '70' : '#2a2a2a'}`, borderRadius:10, marginBottom:16, cursor:'pointer', background: drag ? `${B.neonMagenta}08` : 'rgba(255,255,255,0.02)', transition:'all 0.2s', overflow:'hidden', minHeight: preview ? 'auto' : 130, display:'flex', alignItems:'center', justifyContent:'center' }}
        >
          {preview
            ? <img src={preview} alt="preview" style={{ width:'100%', maxHeight:260, objectFit:'cover', display:'block' }} />
            : (
              <div style={{ textAlign:'center', padding:'24px 16px' }}>
                <div style={{ fontSize:28, marginBottom:8 }}>📸</div>
                <div style={{ fontFamily:'Syne,sans-serif', fontSize:13, color:B.smoke }}>Drop your photo here or tap to browse</div>
                <div style={{ fontFamily:'Space Mono,monospace', fontSize:9, color:'#444', marginTop:4 }}>JPG · PNG · WEBP · Max 12 MB</div>
              </div>
            )
          }
        </div>
        <input ref={inputRef} type="file" accept="image/*" style={{ display:'none' }} onChange={e => { if (e.target.files?.[0]) handleFile(e.target.files[0]) }} />

        <div style={{ display:'flex', flexDirection:'column', gap:11, marginBottom:16 }}>
          {[
            { lbl:'YOUR NAME *',  val:name,    set:setName,    ph:'e.g. Farouq' },
            { lbl:'THE PAIR',     val:caption, set:setCaption, ph:'e.g. Jordan 1 High OG Chicago' },
            { lbl:'YOUR CITY',    val:city,    set:setCity,    ph:'e.g. Lagos' },
          ].map(({ lbl, val, set, ph }) => (
            <div key={lbl}>
              <label style={{ fontFamily:'Space Mono,monospace', fontSize:8, color:'#555', letterSpacing:2, display:'block', marginBottom:5 }}>{lbl}</label>
              <input value={val} onChange={e => set(e.target.value)} placeholder={ph} style={IS} />
            </div>
          ))}
        </div>

        {err && <div style={{ fontFamily:'Syne,sans-serif', fontSize:11, color:B.neonMagenta, marginBottom:10 }}>{err}</div>}

        <button onClick={submit} disabled={busy || !preview}
          style={{ width:'100%', padding:'14px 0', background: !preview ? '#1a1a1a' : B.neonMagenta, border:'none', borderRadius:8, color: !preview ? B.smoke : B.white, fontFamily:'Bebas Neue,sans-serif', fontSize:18, letterSpacing:3, cursor: !preview ? 'not-allowed' : 'pointer', transition:'all 0.2s' }}>
          {busy ? 'ADDING…' : 'ADD TO THE WALL →'}
        </button>
        <div style={{ fontFamily:'Space Mono,monospace', fontSize:9, color:'#2a2a2a', textAlign:'center', marginTop:8 }}>
          Stored locally on your device · Part of the movement
        </div>
      </div>
    </div>
  )
}

// ── PhotoCard ─────────────────────────────────────────────────────────────────────────────────
function PhotoCard({ photo, onHeat, liked }) {
  const [hov, setHov] = useState(false)

  return (
    <div onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{ position:'relative', borderRadius:8, overflow:'hidden', transition:'transform 0.25s, box-shadow 0.25s', transform: hov ? 'translateY(-3px)' : 'none', boxShadow: hov ? `0 12px 36px rgba(0,0,0,0.6), 0 0 0 1px ${B.neonMagenta}20` : 'none' }}>

      <img src={photo.imageData} alt={photo.caption}
        style={{ width:'100%', display:'block', objectFit:'cover' }} loading="lazy" />

      {/* Gradient overlay */}
      <div style={{ position:'absolute', inset:0, background:'linear-gradient(0deg, rgba(0,0,0,0.82) 0%, rgba(0,0,0,0.2) 45%, transparent 100%)', opacity: hov ? 1 : 0.6, transition:'opacity 0.25s' }} />

      {/* Info */}
      <div style={{ position:'absolute', bottom:0, left:0, right:0, padding:'12px 14px' }}>
        <div style={{ fontFamily:'Syne,sans-serif', fontSize:13, color:B.white, fontWeight:700, lineHeight:1.3 }}>{photo.caption}</div>
        <div style={{ fontFamily:'Space Mono,monospace', fontSize:9, color:B.smoke, marginTop:3 }}>{photo.name} · {photo.city}</div>
      </div>

      {/* Heat button */}
      <button onClick={() => onHeat(photo.id)}
        style={{ position:'absolute', top:10, right:10, background: liked ? `rgba(255,45,123,0.85)` : 'rgba(0,0,0,0.65)', border:`1px solid ${liked ? B.neonMagenta : 'rgba(255,255,255,0.2)'}`, borderRadius:20, padding:'4px 10px', cursor:'pointer', fontFamily:'Space Mono,monospace', fontSize:9, color: liked ? B.white : B.smoke, display:'flex', alignItems:'center', gap:5, transition:'all 0.2s', backdropFilter:'blur(6px)' }}>
        🔥 {photo.heat}
      </button>
    </div>
  )
}

// ── Placeholder card ───────────────────────────────────────────────────────────────────────────────
const SneakerSVG = ({ color }) => (
  <svg width="90" height="50" viewBox="0 0 140 72" fill="none">
    <path d="M10 56C10 56 30 52 60 48C85 44 108 42 124 44C134 46 136 50 134 54C132 58 118 60 96 62C74 64 44 64 22 62C12 60 8 58 10 56Z" fill={color+'20'} stroke={color} strokeWidth="1.5"/>
    <path d="M22 56L32 36Q42 22 62 20L94 18Q112 18 122 30L124 44" fill={color+'10'} stroke={color} strokeWidth="1.5" strokeLinejoin="round"/>
    <path d="M62 20L64 38M74 19L76 37M86 18L88 36" stroke={color} strokeWidth="1.2" opacity="0.5" strokeLinecap="round"/>
    <path d="M10 56Q6 55 6 51Q8 45 22 54" fill={color+'15'} stroke={color} strokeWidth="1.2"/>
  </svg>
)

const PLACEHOLDERS = [
  { cat:'AIR MAX 95',      accent:B.neonCyan,    h:220 },
  { cat:'JORDAN 1',        accent:B.neonMagenta, h:180 },
  { cat:'YEEZY 350',       accent:B.amber,       h:200 },
  { cat:'AIR FORCE 1',     accent:B.neonLime,    h:190 },
  { cat:'NEW BALANCE 550', accent:'#69C9D0',     h:175 },
]

// ── Main ────────────────────────────────────────────────────────────────────────────────
export default function Gallery() {
  const [photos, setPhotos] = useState([])
  const [heat,   setHeat]   = useState({})
  const [modal,  setModal]  = useState(false)

  useEffect(() => {
    try { setPhotos(JSON.parse(localStorage.getItem(STORE_KEY) || '[]')) } catch {}
    try { setHeat(JSON.parse(localStorage.getItem(HEAT_KEY)  || '{}')) } catch {}
  }, [])

  function addPhoto(photo) {
    const next = [photo, ...photos]
    setPhotos(next)
    try { localStorage.setItem(STORE_KEY, JSON.stringify(next)) } catch { alert('Storage full — try deleting browser data to make room.') }
  }

  function toggleHeat(id) {
    const wasLiked = !!heat[id]
    const nextHeat = { ...heat }
    if (wasLiked) delete nextHeat[id]; else nextHeat[id] = true
    setHeat(nextHeat)
    try { localStorage.setItem(HEAT_KEY, JSON.stringify(nextHeat)) } catch {}
    setPhotos(prev => {
      const next = prev.map(p => p.id === id ? { ...p, heat: Math.max(0, p.heat + (wasLiked ? -1 : 1)) } : p)
      try { localStorage.setItem(STORE_KEY, JSON.stringify(next)) } catch {}
      return next
    })
  }

  const total = photos.length
  const totalHeat = photos.reduce((a, p) => a + p.heat, 0)

  return (
    <section id="gallery" style={{ position:'relative', overflow:'hidden', background:B.black, padding:'100px 24px' }}>
      <GrainOverlay />
      <Egg id="egg-069" corner="top-right" />
      <Egg id="egg-070" corner="bottom-left" />
      <div style={{ position:'absolute', top:'40%', left:'50%', transform:'translate(-50%,-50%)', width:600, height:400, background:`radial-gradient(ellipse, ${B.neonMagenta}07 0%, transparent 70%)`, filter:'blur(60px)', pointerEvents:'none' }} />

      <div style={{ position:'relative', zIndex:10, maxWidth:1100, margin:'0 auto' }}>

        {/* Header row */}
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-end', flexWrap:'wrap', gap:20, marginBottom:48 }}>
          <div>
            <SectionTag>COMMUNITY GALLERY</SectionTag>
            <div className="reveal-3d text-3d" style={{ fontFamily:"'Bebas Neue', sans-serif", fontSize:'clamp(40px, 6vw, 68px)', color:B.white, lineHeight:0.9 }}>
              THE<br /><span style={{ color:B.neonMagenta }}>COLLECTION</span>
            </div>
            {total > 0 && (
              <div style={{ display:'flex', gap:16, marginTop:10 }}>
                <div style={{ fontFamily:'Space Mono,monospace', fontSize:10, color:B.smoke }}>
                  <span style={{ color:B.neonMagenta, fontWeight:700 }}>{total}</span> photo{total !== 1 ? 's' : ''} on the wall
                </div>
                {totalHeat > 0 && (
                  <div style={{ fontFamily:'Space Mono,monospace', fontSize:10, color:B.smoke }}>
                    🔥 <span style={{ color:B.amber }}>{totalHeat}</span> heat
                  </div>
                )}
              </div>
            )}
          </div>
          <button onClick={() => setModal(true)}
            style={{ display:'inline-flex', alignItems:'center', gap:8, padding:'13px 22px', background:`${B.neonMagenta}15`, border:`1px solid ${B.neonMagenta}60`, borderRadius:6, cursor:'pointer', fontFamily:'Bebas Neue,sans-serif', fontSize:15, color:B.neonMagenta, letterSpacing:2, transition:'all 0.2s' }}
            onMouseEnter={e => { e.currentTarget.style.background=`${B.neonMagenta}28`; e.currentTarget.style.boxShadow=`0 0 24px ${B.neonMagenta}20` }}
            onMouseLeave={e => { e.currentTarget.style.background=`${B.neonMagenta}15`; e.currentTarget.style.boxShadow='none' }}>
            + ADD YOUR PHOTO
          </button>
        </div>

        {/* Masonry wall */}
        <div style={{ columns:'auto 260px', columnGap:14, orphans:1, widows:1 }}>

          {/* Uploaded photos */}
          {photos.map(photo => (
            <div key={photo.id} style={{ breakInside:'avoid', marginBottom:14 }}>
              <PhotoCard photo={photo} onHeat={toggleHeat} liked={!!heat[photo.id]} />
            </div>
          ))}

          {/* Placeholder slots */}
          {PLACEHOLDERS.map((s, i) => (
            <div key={i} style={{ breakInside:'avoid', marginBottom:14 }}>
              <div
                className="card-3d"
                style={{ height:s.h, background:B.charcoal, backgroundImage:`linear-gradient(135deg, ${s.accent}12, transparent)`, border:`1px solid ${s.accent}20`, borderRadius:8, overflow:'hidden', position:'relative', transition:'border-color 0.25s' }}
                onMouseEnter={e => e.currentTarget.style.borderColor = s.accent+'45'}
                onMouseLeave={e => e.currentTarget.style.borderColor = s.accent+'20'}
              >
                <div style={{ height:2, background:`linear-gradient(90deg, ${s.accent}, transparent)` }} />
                <div style={{ position:'absolute', inset:0, display:'flex', alignItems:'center', justifyContent:'center', opacity:0.45 }}>
                  <SneakerSVG color={s.accent} />
                </div>
                <div style={{ position:'absolute', bottom:12, left:14 }}>
                  <span style={{ fontFamily:'Space Mono,monospace', fontSize:7, color:s.accent+'80', letterSpacing:2 }}>{s.cat}</span>
                </div>
              </div>
            </div>
          ))}

          {/* CTA add card */}
          <div style={{ breakInside:'avoid', marginBottom:14 }}>
            <div onClick={() => setModal(true)}
              className="card-3d"
              style={{ height:190, background:'rgba(255,255,255,0.02)', border:`2px dashed ${B.neonMagenta}35`, borderRadius:8, display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer', transition:'all 0.2s' }}
              onMouseEnter={e => { e.currentTarget.style.borderColor=`${B.neonMagenta}70`; e.currentTarget.style.background=`${B.neonMagenta}05` }}
              onMouseLeave={e => { e.currentTarget.style.borderColor=`${B.neonMagenta}35`; e.currentTarget.style.background='rgba(255,255,255,0.02)' }}>
              <div style={{ textAlign:'center' }}>
                <div style={{ width:44, height:44, borderRadius:'50%', border:`2px dashed ${B.neonMagenta}55`, display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 10px' }}>
                  <span style={{ color:B.neonMagenta, fontSize:18, lineHeight:1 }}>+</span>
                </div>
                <div style={{ fontFamily:'Space Mono,monospace', fontSize:9, color:B.neonMagenta, letterSpacing:2 }}>YOUR PHOTO</div>
                <div style={{ fontFamily:'Syne,sans-serif', fontSize:11, color:B.smoke, marginTop:4 }}>Join the wall</div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div style={{ marginTop:24, textAlign:'center', fontFamily:'Syne,sans-serif', fontSize:13, color:B.smoke, lineHeight:1.75 }}>
          Tag <a href="https://instagram.com/sneakersfest" target="_blank" rel="noopener noreferrer" style={{ color:B.amber, textDecoration:'none' }}>@sneakersfest</a> on Instagram to be featured on the official wall
        </div>
      </div>

      {modal && <UploadModal onUpload={addPhoto} onClose={() => setModal(false)} />}
    </section>
  )
}
