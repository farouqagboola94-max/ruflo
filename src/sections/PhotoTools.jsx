import { useState, useRef, useEffect, useCallback } from 'react'
import { B } from '../tokens'
import { GrainOverlay, SectionTag } from '../components/Shared'
import Egg from '../components/Egg'

// ── filter presets ────────────────────────────────────────────────────────────
const PRESETS = [
  { name:'ORIGINAL',   vals:{ brightness:100, contrast:100, saturation:100, hue:0,   blur:0 } },
  { name:'NOIR',       vals:{ brightness:85,  contrast:135, saturation:0,   hue:0,   blur:0 } },
  { name:'LAGOS GLOW', vals:{ brightness:110, contrast:108, saturation:165, hue:10,  blur:0 } },
  { name:'VIVID',      vals:{ brightness:105, contrast:120, saturation:185, hue:0,   blur:0 } },
  { name:'FADE',       vals:{ brightness:118, contrast:82,  saturation:68,  hue:0,   blur:0 } },
  { name:'WARM',       vals:{ brightness:108, contrast:103, saturation:145, hue:18,  blur:0 } },
  { name:'COOL',       vals:{ brightness:105, contrast:100, saturation:85,  hue:195, blur:0 } },
  { name:'NEON',       vals:{ brightness:100, contrast:130, saturation:255, hue:280, blur:0 } },
  { name:'SEPIA',      vals:{ brightness:105, contrast:90,  saturation:30,  hue:30,  blur:0 } },
  { name:'CHROME',     vals:{ brightness:115, contrast:150, saturation:20,  hue:0,   blur:0 } },
  { name:'DUOTONE',    vals:{ brightness:95,  contrast:140, saturation:0,   hue:0,   blur:0 } },
  { name:'CYBERPUNK',  vals:{ brightness:100, contrast:145, saturation:230, hue:260, blur:0 } },
  { name:'BLEACH',     vals:{ brightness:130, contrast:75,  saturation:45,  hue:0,   blur:0 } },
  { name:'POLAROID',   vals:{ brightness:112, contrast:90,  saturation:80,  hue:-8,  blur:0 } },
]

const TABS = ['FILTERS', 'ADJUST', 'TEXT', 'STICKERS']

const SLIDERS = [
  { key:'brightness', label:'BRIGHTNESS', min:50,   max:160, def:100, unit:'%',  color:B.amber },
  { key:'contrast',   label:'CONTRAST',   min:50,   max:200, def:100, unit:'%',  color:B.neonCyan },
  { key:'saturation', label:'SATURATION', min:0,    max:255, def:100, unit:'%',  color:B.neonMagenta },
  { key:'hue',        label:'HUE SHIFT',  min:-180, max:180, def:0,   unit:'°',  color:B.neonLime },
  { key:'blur',       label:'BLUR',       min:0,    max:10,  def:0,   unit:'px', color:'#a78bfa' },
]

const STICKERS = [
  '👟','🔥','💯','⚡','🏆','✨','💎','🎯','🌟','👑',
  '🎪','🌀','💥','🎨','🦋','🌙','🔮','🎸','🕶️','🧿',
  '🫡','🤌','🦅','🌍','🎭','🏅','💫','🪄','🎬','🔑',
]

const FONTS = [
  { label:'BEBAS',  stack:"'Bebas Neue', Impact, sans-serif",  preview:'Aa' },
  { label:'MONO',   stack:"'Space Mono', monospace",            preview:'Aa' },
  { label:'SYNE',   stack:"'Syne', sans-serif",                 preview:'Aa' },
]

const QUICK_STAMPS = ["SF'26", 'LAGOS', 'THE GRAIL', 'SOLE ❤', 'ON GOD', 'DEC 12']

const DEFAULT_ADJUSTS = { brightness:100, contrast:100, saturation:100, hue:0, blur:0 }

function buildFilter(a) {
  return [
    `brightness(${a.brightness}%)`,
    `contrast(${a.contrast}%)`,
    `saturate(${a.saturation}%)`,
    `hue-rotate(${a.hue}deg)`,
    a.blur > 0 ? `blur(${a.blur}px)` : '',
  ].filter(Boolean).join(' ')
}

// ── main component ─────────────────────────────────────────────────────────────
export default function PhotoTools() {
  const [img,       setImg]       = useState(null)
  const [imgSrc,    setImgSrc]    = useState(null)
  const [preset,    setPreset]    = useState(0)
  const [adjusts,   setAdjusts]   = useState(DEFAULT_ADJUSTS)
  const [texts,     setTexts]     = useState([])
  const [tab,       setTab]       = useState('FILTERS')
  const [textIn,    setTextIn]    = useState('')
  const [textCol,   setTextCol]   = useState('#FFFFFF')
  const [textSz,    setTextSz]    = useState(36)
  const [textFont,  setTextFont]  = useState(0)
  const [textOutline, setTextOutline] = useState(false)
  const [dragging,  setDragging]  = useState(null)
  const [shared,    setShared]    = useState(false)
  const [showStamp, setShowStamp] = useState(false)

  const canvasRef = useRef()
  const fileRef   = useRef()
  const cssFilter = buildFilter(adjusts)

  // ── draw canvas ──────────────────────────────────────────────────────────────
  const redraw = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas || !img) return
    const ctx = canvas.getContext('2d')
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    ctx.filter = cssFilter
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
    ctx.filter = 'none'

    texts.forEach(t => {
      ctx.font        = `bold ${t.size}px ${t.fontStack || FONTS[0].stack}`
      ctx.shadowColor = 'rgba(0,0,0,0.75)'
      ctx.shadowBlur  = 8
      if (t.outline) {
        ctx.strokeStyle = 'rgba(0,0,0,0.9)'
        ctx.lineWidth   = Math.max(2, t.size * 0.08)
        ctx.strokeText(t.text, t.x, t.y)
      }
      ctx.fillStyle = t.color
      ctx.fillText(t.text, t.x, t.y)
      ctx.shadowBlur = 0
    })

    if (showStamp) {
      const sw = canvas.width, sh = canvas.height
      const barH = Math.round(sh * 0.12)
      ctx.fillStyle = 'rgba(0,0,0,0.72)'
      ctx.fillRect(0, sh - barH, sw, barH)
      ctx.shadowBlur = 0
      const sz1 = Math.round(barH * 0.38)
      ctx.font      = `bold ${sz1}px 'Bebas Neue', Impact, sans-serif`
      ctx.fillStyle = '#F5A623'
      ctx.fillText("SNEAKERS FEST '26 · DEC 12 · LAGOS", 14, sh - barH + sz1 + 4)
      const sz2 = Math.round(barH * 0.27)
      ctx.font      = `${sz2}px 'Space Mono', monospace`
      ctx.fillStyle = 'rgba(255,255,255,0.55)'
      ctx.fillText('@sneakersfest5555  ·  @sneakersfest', 14, sh - 10)
    }
  }, [img, cssFilter, texts, showStamp])

  useEffect(() => { redraw() }, [redraw])

  // ── load image file ──────────────────────────────────────────────────────────
  function loadFile(file) {
    if (!file || !file.type.startsWith('image/')) return
    const reader = new FileReader()
    reader.onload = e => {
      const image = new Image()
      image.onload = () => {
        const maxW = 800, maxH = 560
        let w = image.width, h = image.height
        if (w > maxW) { h = Math.round(h * maxW / w); w = maxW }
        if (h > maxH) { w = Math.round(w * maxH / h); h = maxH }
        const canvas = canvasRef.current
        if (canvas) { canvas.width = w; canvas.height = h }
        setImg(image); setImgSrc(e.target.result)
        setTexts([]); setPreset(0); setAdjusts(DEFAULT_ADJUSTS); setShowStamp(false)
      }
      image.src = e.target.result
    }
    reader.readAsDataURL(file)
  }

  function applyPreset(i) { setPreset(i); setAdjusts(PRESETS[i].vals) }

  function addText(str) {
    const t = str || textIn.trim()
    if (!t) return
    setTexts(prev => [...prev, { id:Date.now(), text:t, x:30, y:70, color:textCol, size:textSz, fontStack:FONTS[textFont].stack, outline:textOutline }])
    if (!str) setTextIn('')
  }

  function removeText(id) { setTexts(prev => prev.filter(t => t.id !== id)) }

  function getCanvasPos(e) {
    const canvas = canvasRef.current
    const rect   = canvas.getBoundingClientRect()
    const sx = canvas.width / rect.width, sy = canvas.height / rect.height
    const clientX = e.touches ? e.touches[0].clientX : e.clientX
    const clientY = e.touches ? e.touches[0].clientY : e.clientY
    return [(clientX - rect.left) * sx, (clientY - rect.top) * sy]
  }

  function onDown(e) {
    if (tab !== 'TEXT' && tab !== 'STICKERS') return
    const [mx, my] = getCanvasPos(e)
    for (let i = texts.length - 1; i >= 0; i--) {
      const t  = texts[i]
      const tw = t.size * t.text.length * 0.55
      if (mx >= t.x - 10 && mx <= t.x + tw && my >= t.y - t.size && my <= t.y + 10) {
        setDragging({ idx:i, ox:mx - t.x, oy:my - t.y }); return
      }
    }
  }
  function onMove(e) {
    if (dragging === null) return
    e.preventDefault()
    const [mx, my] = getCanvasPos(e)
    setTexts(prev => prev.map((t, i) => i === dragging.idx ? { ...t, x:mx - dragging.ox, y:my - dragging.oy } : t))
  }
  function onUp() { setDragging(null) }

  function downloadJpg() { redraw(); const a = document.createElement('a'); a.href = canvasRef.current.toDataURL('image/jpeg', 0.93); a.download = 'sf26-edit.jpg'; a.click() }
  function downloadPng() { redraw(); const a = document.createElement('a'); a.href = canvasRef.current.toDataURL('image/png'); a.download = 'sf26-edit.png'; a.click() }

  function shareToGallery() {
    redraw()
    const dataUrl = canvasRef.current.toDataURL('image/jpeg', 0.80)
    const gallery = JSON.parse(localStorage.getItem('sf26_gallery') || '[]')
    gallery.unshift({ id:Date.now(), imageData:dataUrl, name:'Photo Studio', city:'Lagos', heat:0, uploadedAt:new Date().toISOString() })
    localStorage.setItem('sf26_gallery', JSON.stringify(gallery.slice(0, 60)))
    setShared(true); setTimeout(() => setShared(false), 3500)
  }

  const panel = { background:'rgba(255,255,255,0.025)', border:'1px solid rgba(255,255,255,0.06)', borderRadius:16, overflow:'hidden' }

  return (
    <section id="photo-tools" style={{ padding:'clamp(60px,8vw,100px) 24px', background:`linear-gradient(180deg, ${B.void} 0%, ${B.black} 100%)`, position:'relative', overflow:'hidden' }}>
      <GrainOverlay />
      <Egg id="egg-075" corner="top-right" />
      <Egg id="egg-076" corner="bottom-left" />
      <div style={{ position:'absolute', top:'20%', right:'5%', width:500, height:500, background:`radial-gradient(ellipse, ${B.neonMagenta}06 0%, transparent 70%)`, filter:'blur(80px)', pointerEvents:'none' }} />
      <div style={{ position:'absolute', bottom:'10%', left:0, width:400, height:400, background:`radial-gradient(ellipse, ${B.amber}05 0%, transparent 70%)`, filter:'blur(60px)', pointerEvents:'none' }} />

      <div style={{ maxWidth:1080, margin:'0 auto', position:'relative', zIndex:1 }}>

        <div style={{ textAlign:'center', marginBottom:48 }}>
          <SectionTag>CREATOR STUDIO</SectionTag>
          <div style={{ fontFamily:"'Bebas Neue', sans-serif", fontSize:'clamp(44px,8vw,80px)', color:B.white, lineHeight:0.88, marginBottom:12 }}>
            SHOE<br /><span style={{ color:B.neonMagenta }}>PHOTO STUDIO</span>
          </div>
          <p style={{ color:'#666', fontFamily:'Space Mono,monospace', fontSize:12, maxWidth:480, margin:'0 auto', lineHeight:1.8 }}>
            Drop a photo, apply filters, add text and stickers, stamp the event brand — then download or share to the community gallery.
          </p>
        </div>

        {/* upload zone */}
        {!img && (
          <div onClick={() => fileRef.current?.click()} onDragOver={e => e.preventDefault()} onDrop={e => { e.preventDefault(); loadFile(e.dataTransfer.files[0]) }}
            style={{ border:`2px dashed rgba(255,45,123,0.35)`, borderRadius:20, padding:'90px 40px', textAlign:'center', cursor:'pointer', background:'rgba(255,45,123,0.025)', maxWidth:640, margin:'0 auto' }}>
            <input ref={fileRef} type="file" accept="image/*" style={{ display:'none' }} onChange={e => loadFile(e.target.files[0])} />
            <div style={{ fontSize:56, marginBottom:18 }}>👟</div>
            <div style={{ fontFamily:'Bebas Neue,sans-serif', fontSize:32, color:B.neonMagenta, letterSpacing:3, marginBottom:10 }}>DROP YOUR PHOTO HERE</div>
            <div style={{ fontFamily:'Space Mono,monospace', fontSize:11, color:'#444' }}>or click to browse · JPG, PNG, WEBP</div>
          </div>
        )}

        {/* editor layout */}
        {img && (
          <div style={{ display:'grid', gridTemplateColumns:'1fr 340px', gap:24, alignItems:'start' }}>

            {/* ── canvas column ── */}
            <div>
              <div style={{ borderRadius:14, overflow:'hidden', border:'1px solid rgba(255,255,255,0.07)', background:'#000', lineHeight:0 }}>
                <canvas ref={canvasRef} style={{ width:'100%', display:'block', cursor:(tab==='TEXT'||tab==='STICKERS')?'crosshair':'default', touchAction:'none', userSelect:'none' }}
                  onMouseDown={onDown} onMouseMove={onMove} onMouseUp={onUp} onMouseLeave={onUp}
                  onTouchStart={onDown} onTouchMove={onMove} onTouchEnd={onUp} />
              </div>

              {/* event stamp toggle */}
              <button onClick={() => setShowStamp(v => !v)}
                style={{ width:'100%', marginTop:10, padding:'10px', background:showStamp ? `${B.amber}18` : 'rgba(255,255,255,0.02)', border:`1px solid ${showStamp ? B.amber+'50' : 'rgba(255,255,255,0.07)'}`, borderRadius:8, color:showStamp ? B.amber : '#555', fontFamily:'Orbitron,monospace', fontSize:9, cursor:'pointer', letterSpacing:1.5, transition:'all 0.2s', display:'flex', alignItems:'center', justifyContent:'center', gap:8 }}>
                <span style={{ fontSize:14 }}>🏷️</span>
                {showStamp ? 'EVENT STAMP ON ✓' : 'ADD EVENT STAMP'}
              </button>

              {/* action bar */}
              <div style={{ display:'flex', gap:8, marginTop:10, flexWrap:'wrap' }}>
                <button onClick={downloadJpg} style={{ flex:'1 1 100px', padding:'12px 8px', background:`${B.neonLime}12`, border:`1px solid ${B.neonLime}50`, borderRadius:10, color:B.neonLime, fontFamily:'Orbitron,monospace', fontSize:9, fontWeight:700, cursor:'pointer', letterSpacing:1 }}>↓ JPG</button>
                <button onClick={downloadPng} style={{ flex:'1 1 100px', padding:'12px 8px', background:`${B.neonLime}08`, border:`1px solid ${B.neonLime}30`, borderRadius:10, color:`${B.neonLime}90`, fontFamily:'Orbitron,monospace', fontSize:9, fontWeight:700, cursor:'pointer', letterSpacing:1 }}>↓ PNG</button>
                <button onClick={shareToGallery} style={{ flex:'2 1 140px', padding:'12px 8px', background:shared ? `${B.neonCyan}18` : `${B.neonCyan}10`, border:`1px solid ${shared ? B.neonCyan : B.neonCyan+'40'}`, borderRadius:10, color:B.neonCyan, fontFamily:'Orbitron,monospace', fontSize:9, fontWeight:700, cursor:'pointer', letterSpacing:1, transition:'all 0.2s' }}>
                  {shared ? '✓ SHARED!' : '↑ GALLERY'}
                </button>
                <button onClick={() => { setImg(null); setImgSrc(null); if (fileRef.current) fileRef.current.value = '' }}
                  style={{ padding:'12px 14px', background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.08)', borderRadius:10, color:'#555', fontFamily:'Orbitron,monospace', fontSize:9, cursor:'pointer' }}>
                  NEW
                </button>
              </div>
              {shared && <div style={{ marginTop:8, textAlign:'center', fontFamily:'Space Mono,monospace', fontSize:10, color:B.neonCyan }}>Added to gallery — check the Gallery section!</div>}
              {(tab==='TEXT'||tab==='STICKERS') && texts.length > 0 && (
                <div style={{ marginTop:8, textAlign:'center', fontFamily:'Space Mono,monospace', fontSize:9, color:'#444' }}>Drag text/stickers on the canvas to reposition</div>
              )}
            </div>

            {/* ── controls column ── */}
            <div style={panel}>
              <div style={{ display:'flex', borderBottom:'1px solid rgba(255,255,255,0.06)' }}>
                {TABS.map(t => (
                  <button key={t} onClick={() => setTab(t)} style={{ flex:1, padding:'12px 2px', background:tab===t ? 'rgba(255,45,123,0.1)' : 'transparent', border:'none', color:tab===t ? B.neonMagenta : '#444', fontFamily:'Orbitron,monospace', fontSize:6, fontWeight:700, cursor:'pointer', letterSpacing:0.5, borderBottom:tab===t ? `2px solid ${B.neonMagenta}` : '2px solid transparent', transition:'all 0.2s' }}>
                    {t}
                  </button>
                ))}
              </div>

              <div style={{ padding:18, maxHeight:560, overflowY:'auto' }}>

                {/* FILTERS */}
                {tab==='FILTERS' && (
                  <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:8 }}>
                    {PRESETS.map((p, i) => (
                      <button key={p.name} onClick={() => applyPreset(i)} style={{ padding:0, background:preset===i ? 'rgba(255,45,123,0.12)' : 'rgba(255,255,255,0.02)', border:`1px solid ${preset===i ? B.neonMagenta+'60' : 'rgba(255,255,255,0.06)'}`, borderRadius:8, cursor:'pointer', overflow:'hidden', textAlign:'left' }}>
                        <div style={{ height:52, overflow:'hidden' }}>
                          {imgSrc && <img src={imgSrc} alt="" style={{ width:'100%', height:'100%', objectFit:'cover', display:'block', filter:buildFilter(p.vals) }} />}
                        </div>
                        <div style={{ padding:'5px 7px', fontFamily:'Orbitron,monospace', fontSize:6.5, color:preset===i ? B.neonMagenta : '#666', letterSpacing:0.8, fontWeight:700 }}>{p.name}</div>
                      </button>
                    ))}
                  </div>
                )}

                {/* ADJUST */}
                {tab==='ADJUST' && (
                  <div style={{ display:'flex', flexDirection:'column', gap:18 }}>
                    {SLIDERS.map(s => (
                      <div key={s.key}>
                        <div style={{ display:'flex', justifyContent:'space-between', marginBottom:5 }}>
                          <span style={{ fontFamily:'Orbitron,monospace', fontSize:7, color:s.color, letterSpacing:2, fontWeight:700 }}>{s.label}</span>
                          <span style={{ fontFamily:'Space Mono,monospace', fontSize:9, color:'#555' }}>{adjusts[s.key]}{s.unit}</span>
                        </div>
                        <input type="range" min={s.min} max={s.max} value={adjusts[s.key]}
                          onChange={e => { setPreset(-1); setAdjusts(a => ({ ...a, [s.key]:Number(e.target.value) })) }}
                          style={{ width:'100%', accentColor:s.color, cursor:'pointer', height:4 }} />
                        {adjusts[s.key] !== s.def && (
                          <button onClick={() => { setPreset(-1); setAdjusts(a => ({ ...a, [s.key]:s.def })) }}
                            style={{ fontSize:9, color:'#444', background:'none', border:'none', cursor:'pointer', fontFamily:'Space Mono,monospace', padding:'1px 0' }}>reset</button>
                        )}
                      </div>
                    ))}
                    <button onClick={() => { setPreset(0); setAdjusts(DEFAULT_ADJUSTS) }}
                      style={{ padding:'10px', background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.07)', borderRadius:8, color:'#555', fontFamily:'Orbitron,monospace', fontSize:8, cursor:'pointer', letterSpacing:1 }}>
                      RESET ALL
                    </button>
                  </div>
                )}

                {/* TEXT */}
                {tab==='TEXT' && (
                  <div>
                    <input value={textIn} onChange={e => setTextIn(e.target.value)} onKeyDown={e => e.key === 'Enter' && addText()}
                      placeholder="Your text here..."
                      style={{ width:'100%', padding:'10px 12px', background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.1)', borderRadius:8, color:B.white, fontFamily:'Space Mono,monospace', fontSize:12, outline:'none', boxSizing:'border-box', marginBottom:12 }} />

                    {/* font selector */}
                    <div style={{ marginBottom:12 }}>
                      <div style={{ fontFamily:'Orbitron,monospace', fontSize:7, color:'#555', letterSpacing:1, marginBottom:6 }}>FONT</div>
                      <div style={{ display:'flex', gap:6 }}>
                        {FONTS.map((f, i) => (
                          <button key={f.label} onClick={() => setTextFont(i)}
                            style={{ flex:1, padding:'8px 4px', background:textFont===i ? 'rgba(255,45,123,0.12)' : 'rgba(255,255,255,0.03)', border:`1px solid ${textFont===i ? B.neonMagenta+'60' : 'rgba(255,255,255,0.07)'}`, borderRadius:6, cursor:'pointer', fontFamily:f.stack, fontSize:13, color:textFont===i ? B.neonMagenta : '#666' }}>
                            {f.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div style={{ display:'flex', gap:12, marginBottom:12, alignItems:'flex-end' }}>
                      <div>
                        <div style={{ fontFamily:'Orbitron,monospace', fontSize:7, color:'#555', marginBottom:5, letterSpacing:1 }}>COLOR</div>
                        <input type="color" value={textCol} onChange={e => setTextCol(e.target.value)}
                          style={{ width:44, height:34, border:'1px solid rgba(255,255,255,0.1)', borderRadius:6, background:'transparent', cursor:'pointer', padding:2 }} />
                      </div>
                      <div style={{ flex:1 }}>
                        <div style={{ display:'flex', justifyContent:'space-between', marginBottom:5 }}>
                          <span style={{ fontFamily:'Orbitron,monospace', fontSize:7, color:'#555', letterSpacing:1 }}>SIZE</span>
                          <span style={{ fontFamily:'Space Mono,monospace', fontSize:9, color:'#555' }}>{textSz}px</span>
                        </div>
                        <input type="range" min={14} max={90} value={textSz} onChange={e => setTextSz(Number(e.target.value))} style={{ width:'100%', accentColor:B.neonMagenta }} />
                      </div>
                    </div>

                    {/* outline toggle */}
                    <button onClick={() => setTextOutline(v => !v)}
                      style={{ width:'100%', marginBottom:12, padding:'8px', background:textOutline ? `${B.neonCyan}14` : 'rgba(255,255,255,0.03)', border:`1px solid ${textOutline ? B.neonCyan+'50' : 'rgba(255,255,255,0.07)'}`, borderRadius:6, color:textOutline ? B.neonCyan : '#555', fontFamily:'Orbitron,monospace', fontSize:8, cursor:'pointer', letterSpacing:1, transition:'all 0.15s' }}>
                      {textOutline ? '✓ OUTLINE ON' : 'ADD OUTLINE'}
                    </button>

                    <button onClick={() => addText()}
                      style={{ width:'100%', padding:'11px', background:`${B.neonMagenta}14`, border:`1px solid ${B.neonMagenta}50`, borderRadius:9, color:B.neonMagenta, fontFamily:'Orbitron,monospace', fontSize:10, fontWeight:700, cursor:'pointer', letterSpacing:1 }}>
                      + ADD TEXT
                    </button>

                    <div style={{ marginTop:14 }}>
                      <div style={{ fontFamily:'Orbitron,monospace', fontSize:7, color:'#444', letterSpacing:2, marginBottom:8 }}>QUICK STAMPS</div>
                      <div style={{ display:'flex', flexWrap:'wrap', gap:6 }}>
                        {QUICK_STAMPS.map(q => (
                          <button key={q} onClick={() => addText(q)}
                            style={{ padding:'5px 10px', background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.08)', borderRadius:6, color:'#888', fontFamily:'Space Mono,monospace', fontSize:9, cursor:'pointer' }}>
                            {q}
                          </button>
                        ))}
                      </div>
                    </div>

                    {texts.length > 0 && (
                      <div style={{ marginTop:16 }}>
                        <div style={{ fontFamily:'Orbitron,monospace', fontSize:7, color:'#444', letterSpacing:2, marginBottom:8 }}>LAYERS ({texts.length})</div>
                        {texts.map(t => (
                          <div key={t.id} style={{ display:'flex', alignItems:'center', gap:8, padding:'7px 0', borderBottom:'1px solid rgba(255,255,255,0.04)' }}>
                            <div style={{ width:10, height:10, borderRadius:2, background:t.color, flexShrink:0, border:'1px solid rgba(255,255,255,0.12)' }} />
                            <span style={{ flex:1, fontFamily:'Space Mono,monospace', fontSize:9, color:'#777', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{t.text}</span>
                            <button onClick={() => removeText(t.id)} style={{ background:'none', border:'none', color:'#444', cursor:'pointer', fontSize:16, lineHeight:1, padding:'0 4px' }}>×</button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* STICKERS */}
                {tab==='STICKERS' && (
                  <div>
                    <p style={{ fontFamily:'Space Mono,monospace', fontSize:9, color:'#555', marginBottom:14, lineHeight:1.7 }}>Tap to add. Drag on canvas to reposition.</p>
                    <div style={{ display:'grid', gridTemplateColumns:'repeat(5,1fr)', gap:8 }}>
                      {STICKERS.map(s => (
                        <button key={s} onClick={() => setTexts(prev => [...prev, { id:Date.now(), text:s, x:30 + Math.random()*60, y:70 + Math.random()*40, color:'#fff', size:42, fontStack:FONTS[0].stack, outline:false }])}
                          style={{ fontSize:22, padding:8, background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.07)', borderRadius:8, cursor:'pointer', transition:'all 0.15s', userSelect:'none' }}>
                          {s}
                        </button>
                      ))}
                    </div>
                    {texts.filter(t => STICKERS.includes(t.text)).length > 0 && (
                      <div style={{ marginTop:14 }}>
                        <div style={{ fontFamily:'Orbitron,monospace', fontSize:7, color:'#444', letterSpacing:2, marginBottom:8 }}>ON CANVAS</div>
                        <div style={{ display:'flex', flexWrap:'wrap', gap:6 }}>
                          {texts.filter(t => STICKERS.includes(t.text)).map(t => (
                            <div key={t.id} style={{ display:'flex', alignItems:'center', gap:4, padding:'4px 8px', background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.07)', borderRadius:6 }}>
                              <span style={{ fontSize:14 }}>{t.text}</span>
                              <button onClick={() => removeText(t.id)} style={{ background:'none', border:'none', color:'#444', cursor:'pointer', fontSize:13, lineHeight:1, padding:0 }}>×</button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

              </div>
            </div>

          </div>
        )}

        <div style={{ textAlign:'center', marginTop:40, fontFamily:'Space Mono,monospace', fontSize:8, color:'#2a2a2a', letterSpacing:2 }}>
          ALL EDITING RUNS IN YOUR BROWSER — NO UPLOAD, NO SERVER
        </div>
      </div>
    </section>
  )
}
