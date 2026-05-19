import { useState, useRef } from 'react'
import { B } from '../tokens'

const API = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

function DropZone({ label, sub, accept, file, onFile, color, icon }) {
  const ref = useRef()
  return (
    <div
      onClick={() => ref.current?.click()}
      onDragOver={e => e.preventDefault()}
      onDrop={e => { e.preventDefault(); onFile(e.dataTransfer.files[0]) }}
      style={{
        border: `2px dashed ${file ? color : 'rgba(255,255,255,0.12)'}`,
        borderRadius: 12, padding: '28px 20px', textAlign: 'center',
        cursor: 'pointer', background: file ? `${color}08` : 'rgba(255,255,255,0.02)',
        backdropFilter: 'blur(8px)', transition: 'all 0.2s',
      }}
    >
      <input ref={ref} type="file" accept={accept} style={{ display:'none' }} onChange={e => onFile(e.target.files[0])} />
      {file ? (
        <p style={{ color, fontFamily:'Space Mono,monospace', fontSize:12, wordBreak:'break-all' }}>{file.name}</p>
      ) : (
        <>
          <div style={{ color:'rgba(255,255,255,0.25)', marginBottom:10 }}>{icon}</div>
          <p style={{ color:B.smoke, fontFamily:'Space Mono,monospace', fontSize:12 }}>{label}</p>
          <p style={{ color:'#444', fontFamily:'Space Mono,monospace', fontSize:10, marginTop:4 }}>{sub}</p>
        </>
      )}
    </div>
  )
}

export default function PhotoTools() {
  const [bgFile, setBgFile] = useState(null)
  const [bgResult, setBgResult] = useState(null)
  const [bgLoading, setBgLoading] = useState(false)
  const [audioFile, setAudioFile] = useState(null)
  const [transcript, setTranscript] = useState('')
  const [audioLoading, setAudioLoading] = useState(false)

  async function removeBg() {
    if (!bgFile) return
    setBgLoading(true); setBgResult(null)
    const fd = new FormData()
    fd.append('file', bgFile)
    try {
      const res = await fetch(`${API}/api/remove-bg`, { method:'POST', body:fd })
      if (!res.ok) throw new Error()
      setBgResult(URL.createObjectURL(await res.blob()))
    } catch { setBgResult('error') }
    setBgLoading(false)
  }

  async function transcribe() {
    if (!audioFile) return
    setAudioLoading(true); setTranscript('')
    const fd = new FormData()
    fd.append('file', audioFile)
    try {
      const res = await fetch(`${API}/api/transcribe`, { method:'POST', body:fd })
      const data = await res.json()
      setTranscript(data.text)
    } catch { setTranscript('Error: run docker compose up backend') }
    setAudioLoading(false)
  }

  const card = (accent) => ({
    background: 'rgba(255,255,255,0.025)',
    backdropFilter: 'blur(20px) saturate(150%)',
    border: `1px solid ${accent}18`,
    borderRadius: 20, padding: 28,
    boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.05)',
  })

  const btn = (color, disabled) => ({
    width:'100%', marginTop:12, padding:'13px',
    background: disabled ? B.gunmetal : `${color}18`,
    border: `1px solid ${disabled ? 'transparent' : color}`,
    borderRadius:10, color: disabled ? B.smoke : color,
    fontFamily:'Orbitron,sans-serif', fontSize:11, fontWeight:700,
    letterSpacing:1, cursor: disabled ? 'not-allowed' : 'pointer',
    transition:'all 0.2s',
  })

  return (
    <section id="creator-tools" style={{
      padding:'clamp(60px,8vw,100px) 24px',
      background: B.void, position:'relative', overflow:'hidden',
    }}>
      <div style={{ position:'absolute', top:'20%', right:'3%', width:450, height:450, borderRadius:'50%', background:`radial-gradient(circle, rgba(255,45,123,0.06), transparent 70%)`, filter:'blur(80px)', pointerEvents:'none' }} />
      <div style={{ position:'absolute', bottom:'10%', left:'0%', width:350, height:350, borderRadius:'50%', background:`radial-gradient(circle, rgba(0,240,255,0.05), transparent 70%)`, filter:'blur(60px)', pointerEvents:'none' }} />

      <div style={{ maxWidth:960, margin:'0 auto', position:'relative', zIndex:1 }}>
        {/* Header */}
        <div style={{ textAlign:'center', marginBottom:56 }}>
          <div style={{ display:'inline-flex', alignItems:'center', gap:8, padding:'6px 18px', borderRadius:20, border:`1px solid rgba(0,240,255,0.25)`, background:'rgba(0,240,255,0.04)', marginBottom:24 }}>
            <span style={{ color:B.neonCyan, fontFamily:'Orbitron,sans-serif', fontSize:10, letterSpacing:3, fontWeight:700 }}>AI CREATOR TOOLS</span>
          </div>
          <h2 style={{ fontFamily:'Bebas Neue,sans-serif', fontSize:'clamp(38px,6vw,72px)', color:B.white, lineHeight:1, letterSpacing:2, marginBottom:12 }}>
            COMMUNITY{' '}<span style={{ color:B.neonCyan, textShadow:`0 0 30px ${B.neonCyan}50` }}>CREATOR STUDIO</span>
          </h2>
          <p style={{ color:B.smoke, fontFamily:'Space Mono,monospace', fontSize:13, lineHeight:1.9, maxWidth:520, margin:'0 auto' }}>
            AI-powered tools for the Sneakers Fest content community. Drop photos, remove backgrounds, transcribe interviews — all in your browser.
          </p>
        </div>

        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(380px, 1fr))', gap:24 }}>
          {/* BG Remover */}
          <div style={card(B.neonCyan)}>
            <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:22 }}>
              <div style={{ width:40, height:40, borderRadius:10, background:`rgba(0,240,255,0.1)`, border:`1px solid rgba(0,240,255,0.2)`, display:'flex', alignItems:'center', justifyContent:'center' }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M4 4l4 4m8-4l-4 4m0 8l4 4m-8 0l-4-4" stroke={B.neonCyan} strokeWidth="1.5" strokeLinecap="round"/><rect x="7" y="7" width="10" height="10" rx="1" stroke={B.neonCyan} strokeWidth="1.5" strokeDasharray="3 2"/></svg>
              </div>
              <div>
                <p style={{ color:B.white, fontFamily:'Orbitron,sans-serif', fontSize:12, fontWeight:700, letterSpacing:1 }}>BG REMOVER</p>
                <p style={{ color:'#555', fontFamily:'Space Mono,monospace', fontSize:10 }}>Powered by rembg · Open Source</p>
              </div>
            </div>

            <DropZone
              label="Drop sneaker photo here" sub="PNG, JPG, WEBP"
              accept="image/*" file={bgFile} onFile={f => { setBgFile(f); setBgResult(null) }}
              color={B.neonCyan}
              icon={<svg width="32" height="32" viewBox="0 0 24 24" fill="none"><rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="1.5"/><circle cx="8.5" cy="8.5" r="1.5" stroke="currentColor" strokeWidth="1.5"/><path d="M21 15l-5-5L5 21" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>}
            />

            {bgFile && (
              <button onClick={removeBg} disabled={bgLoading} style={btn(B.neonCyan, bgLoading)}>
                {bgLoading ? (
                  <span style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:8 }}>
                    <span style={{ width:10, height:10, border:`2px solid ${B.neonCyan}`, borderTopColor:'transparent', borderRadius:'50%', display:'inline-block', animation:'spin 0.8s linear infinite' }} />
                    PROCESSING...
                  </span>
                ) : 'REMOVE BACKGROUND →'}
              </button>
            )}

            {bgResult && bgResult !== 'error' && (
              <div style={{ marginTop:16 }}>
                <div style={{ position:'relative', borderRadius:10, overflow:'hidden', border:`1px solid rgba(255,255,255,0.08)`, background:'repeating-conic-gradient(#1a1a1a 0% 25%, #111 0% 50%) 0 0/16px 16px' }}>
                  <img src={bgResult} alt="No background result" style={{ width:'100%', display:'block' }} />
                </div>
                <a
                  href={bgResult} download="sneaker-nobg.png"
                  style={{ display:'block', marginTop:10, textAlign:'center', color:B.amber, fontFamily:'Space Mono,monospace', fontSize:11, textDecoration:'none', padding:'10px', border:`1px solid rgba(245,166,35,0.25)`, borderRadius:8 }}
                >↓ DOWNLOAD PNG</a>
              </div>
            )}
            {bgResult === 'error' && <p style={{ color:B.neonMagenta, fontFamily:'Space Mono,monospace', fontSize:11, marginTop:10 }}>Error: run docker compose up backend</p>}
          </div>

          {/* Transcriber */}
          <div style={card(B.amber)}>
            <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:22 }}>
              <div style={{ width:40, height:40, borderRadius:10, background:`rgba(245,166,35,0.1)`, border:`1px solid rgba(245,166,35,0.2)`, display:'flex', alignItems:'center', justifyContent:'center' }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M12 1a3 3 0 00-3 3v8a3 3 0 006 0V4a3 3 0 00-3-3z" stroke={B.amber} strokeWidth="1.5"/><path d="M19 10v2a7 7 0 01-14 0v-2M12 19v4M8 23h8" stroke={B.amber} strokeWidth="1.5" strokeLinecap="round"/></svg>
              </div>
              <div>
                <p style={{ color:B.white, fontFamily:'Orbitron,sans-serif', fontSize:12, fontWeight:700, letterSpacing:1 }}>TRANSCRIBER</p>
                <p style={{ color:'#555', fontFamily:'Space Mono,monospace', fontSize:10 }}>Powered by Whisper · Open Source</p>
              </div>
            </div>

            <DropZone
              label="Drop interview audio or video" sub="MP3, MP4, WAV, M4A"
              accept="audio/*,video/*" file={audioFile} onFile={f => { setAudioFile(f); setTranscript('') }}
              color={B.amber}
              icon={<svg width="32" height="32" viewBox="0 0 24 24" fill="none"><path d="M9 18V5l12-2v13M9 18a3 3 0 01-3 3H4a2 2 0 01-2-2v-1a2 2 0 012-2h2a3 3 0 013 3zm12-3a3 3 0 01-3 3h-2a2 2 0 01-2-2v-1a2 2 0 012-2h2a3 3 0 013 3z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>}
            />

            {audioFile && (
              <button onClick={transcribe} disabled={audioLoading} style={btn(B.amber, audioLoading)}>
                {audioLoading ? (
                  <span style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:8 }}>
                    <span style={{ width:10, height:10, border:`2px solid ${B.amber}`, borderTopColor:'transparent', borderRadius:'50%', display:'inline-block', animation:'spin 0.8s linear infinite' }} />
                    TRANSCRIBING...
                  </span>
                ) : 'TRANSCRIBE AUDIO →'}
              </button>
            )}

            {transcript && (
              <div style={{ marginTop:16, padding:16, background:'rgba(255,255,255,0.03)', border:`1px solid rgba(255,255,255,0.07)`, borderRadius:10 }}>
                <p style={{ color:'#555', fontFamily:'Space Mono,monospace', fontSize:9, letterSpacing:3, marginBottom:10 }}>TRANSCRIPT</p>
                <p style={{ color:B.white, fontFamily:'Space Mono,monospace', fontSize:12, lineHeight:1.85, whiteSpace:'pre-wrap', maxHeight:180, overflowY:'auto' }}>{transcript}</p>
                <button
                  onClick={() => navigator.clipboard.writeText(transcript)}
                  style={{ marginTop:12, padding:'8px 16px', background:'transparent', border:`1px solid rgba(245,166,35,0.25)`, borderRadius:8, color:B.amber, fontFamily:'Space Mono,monospace', fontSize:10, cursor:'pointer' }}
                >COPY TEXT</button>
              </div>
            )}
          </div>
        </div>

        {/* Powered by strip */}
        <div style={{ marginTop:40, display:'flex', justifyContent:'center', gap:32, flexWrap:'wrap', alignItems:'center' }}>
          {[['rembg','BG Removal',B.neonCyan],['Whisper','Transcription',B.amber],['Ollama','AI Chat',B.neonMagenta],['Listmonk','Newsletter',B.neonLime],['Activepieces','Automation','#a78bfa']].map(([name,role,color]) => (
            <div key={name} style={{ display:'flex', alignItems:'center', gap:8 }}>
              <div style={{ width:6, height:6, borderRadius:'50%', background:color, boxShadow:`0 0 8px ${color}` }} />
              <span style={{ color:B.smoke, fontFamily:'Space Mono,monospace', fontSize:10 }}><span style={{ color }}>{name}</span> · {role}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
