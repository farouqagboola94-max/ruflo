import { useState, useEffect } from 'react'
import { B } from '../tokens'
import { GrainOverlay, ScanLines, SectionTag } from '../components/Shared'

const TOTAL_WALL = 200
const MAX_STORY  = 200
const BRANDS     = ['Nike','Jordan','Adidas','New Balance','Puma','Asics','Reebok','Vans','Converse','Other']
const CITIES     = ['Lagos','Abuja','Port Harcourt','Kano','Ibadan','Benin City','Enugu','Kaduna','Owerri','Warri','Uyo','Calabar','Jos','Abeokuta','Akure','Other']

const BRAND_ACCENT = {
  Nike:'#F0EDE6', Jordan:'#FF2D7B', Adidas:'#00F0FF', 'New Balance':'#F5A623',
  Puma:'#B8FF00', Asics:'#0099FF', Reebok:'#CF2027', Vans:'#EE3524',
  Converse:'#FF6B1A', Other:'#8A8A8A',
}

function loadHeat()  { try { return JSON.parse(localStorage.getItem('sf26_sole_heat')    || '{}') } catch { return {} } }
function loadLocal() { try { return JSON.parse(localStorage.getItem('sf26_sole_entries') || '[]') } catch { return [] } }

const INP = {
  width:'100%', background:B.charcoal, border:`1px solid ${B.gunmetal}`, borderRadius:6,
  padding:'10px 12px', color:B.white, fontFamily:"'Space Mono',monospace", fontSize:11,
  outline:'none', boxSizing:'border-box',
}
const SEL = { ...INP, appearance:'none', WebkitAppearance:'none', cursor:'pointer', paddingRight:28 }
const LBL = { fontFamily:"'Space Mono',monospace", fontSize:9, color:B.smoke, display:'block', marginBottom:5, letterSpacing:'1px', textTransform:'uppercase' }

/* ---------- Sole Pass Modal ------------------------------------------ */
function PassRow({ label, value, border }) {
  return (
    <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'9px 14px', borderTop: border ? `1px solid ${B.gunmetal}` : 'none' }}>
      <span style={{ fontFamily:"'Space Mono',monospace", fontSize:10, color:B.smoke }}>{label}</span>
      <span style={{ fontFamily:"'Space Mono',monospace", fontSize:11, fontWeight:700, color:B.white, textAlign:'right', maxWidth:'60%' }}>{value}</span>
    </div>
  )
}

function SolePassModal({ pass, onClose }) {
  if (!pass) return null
  return (
    <div
      style={{ position:'fixed', inset:0, background:'rgba(0,0,0,.88)', zIndex:9000, display:'flex', alignItems:'center', justifyContent:'center', padding:24 }}
      onClick={onClose}
    >
      <div
        style={{ background:B.void, border:`1px solid ${B.amber}40`, borderRadius:16, maxWidth:400, width:'100%', overflow:'hidden' }}
        onClick={e => e.stopPropagation()}
      >
        <div style={{ background:`linear-gradient(135deg,${B.amber},#E55C00)`, padding:'24px 20px', textAlign:'center' }}>
          <div style={{ fontSize:34, marginBottom:4 }}>&#x1F45F;</div>
          <div style={{ fontFamily:"'Orbitron',monospace", fontWeight:900, fontSize:13, color:B.black, letterSpacing:'3px' }}>SOLE PASS</div>
          <div style={{ fontFamily:"'Space Mono',monospace", fontSize:9, color:'rgba(0,0,0,.6)', letterSpacing:'2px', marginTop:2 }}>SNEAKERS FEST '26 &middot; SOLE REGISTRY</div>
        </div>

        <div style={{ padding:'24px 20px' }}>
          <div style={{ fontFamily:"'Space Mono',monospace", fontSize:22, color:B.amber, fontWeight:700, letterSpacing:'4px', marginBottom:4 }}>{pass.submissionId}</div>
          <div style={{ fontFamily:"'Space Mono',monospace", fontSize:9, color:B.smoke, letterSpacing:'2px', marginBottom:16 }}>WALL SLOT #{pass.slotNumber} OF {TOTAL_WALL}</div>

          <div style={{ background:B.charcoal, border:`1px solid ${B.amber}15`, borderRadius:8, overflow:'hidden', marginBottom:14 }}>
            <PassRow label="Grail" value={pass.shoe} />
            <PassRow label="Brand" value={pass.brand} border />
            <PassRow label="City"  value={pass.city}  border />
          </div>

          {pass.story && (
            <div style={{ fontFamily:"'Space Mono',monospace", fontSize:9, color:B.smoke, fontStyle:'italic', borderLeft:`3px solid ${B.amber}`, paddingLeft:12, marginBottom:16, lineHeight:1.7 }}>
              &ldquo;{pass.story}&rdquo;
            </div>
          )}

          <p style={{ fontFamily:"'Space Mono',monospace", fontSize:9, color:B.smoke, lineHeight:1.8, margin:0 }}>
            Show this pass at the event to claim your name on the physical Sole Registry wall. Dec 12, 2026 &middot; Muri Okunola Park, V/I Lagos.
          </p>
        </div>

        <div style={{ padding:'0 20px 20px' }}>
          <button
            onClick={onClose}
            style={{ width:'100%', padding:12, background:B.amber, border:'none', borderRadius:6, fontFamily:"'Orbitron',monospace", fontSize:9, fontWeight:700, letterSpacing:'3px', color:B.black, cursor:'pointer' }}
          >
            CLOSE PASS
          </button>
        </div>
      </div>
    </div>
  )
}

/* ---------- Wall Card ------------------------------------------------- */
function WallCard({ entry, voted, onHeat }) {
  const accent = BRAND_ACCENT[entry.brand] || B.smoke
  const preview = entry.story ? (entry.story.length > 70 ? entry.story.slice(0,70) + '...' : entry.story) : null
  return (
    <div className="card-3d" style={{ background:B.charcoal, border:`1px solid ${B.gunmetal}`, borderRadius:10, padding:16, position:'relative', overflow:'hidden' }}>
      <div style={{ position:'absolute', top:0, left:0, right:0, height:2, background:accent }} />
      <div style={{ fontFamily:"'Space Mono',monospace", fontSize:9, color:accent, fontWeight:700, letterSpacing:'2px', marginBottom:6 }}>{entry.brand.toUpperCase()}</div>
      <div style={{ fontFamily:"'Syne',sans-serif", fontSize:13, fontWeight:700, color:B.white, marginBottom:3, lineHeight:1.3 }}>{entry.shoe}</div>
      {entry.colorway && <div style={{ fontFamily:"'Space Mono',monospace", fontSize:8, color:B.smoke, marginBottom:8 }}>{entry.colorway}</div>}
      {preview && (
        <div style={{ fontFamily:"'Space Mono',monospace", fontSize:8, color:B.mist, fontStyle:'italic', borderLeft:`2px solid ${B.gunmetal}`, paddingLeft:8, marginBottom:10, lineHeight:1.6 }}>
          &ldquo;{preview}&rdquo;
        </div>
      )}
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', borderTop:`1px solid ${B.gunmetal}`, paddingTop:9, marginTop:'auto' }}>
        <div>
          <div style={{ fontFamily:"'Space Mono',monospace", fontSize:9, color:B.white }}>{entry.display || 'Anonymous'}</div>
          <div style={{ fontFamily:"'Space Mono',monospace", fontSize:8, color:B.smoke, marginTop:2 }}>{entry.city}</div>
        </div>
        <button
          onClick={() => onHeat(entry.id)}
          style={{ display:'flex', alignItems:'center', gap:4, background: voted ? `${B.amber}20` : 'transparent', border:`1px solid ${voted ? B.amber : B.gunmetal}`, borderRadius:6, padding:'4px 9px', cursor:'pointer', fontFamily:"'Space Mono',monospace", fontSize:9, color: voted ? B.amber : B.smoke, transition:'all .2s' }}
        >
          <span>&#x1F525;</span>
          <span>{(entry.heat || 0) + (voted ? 1 : 0)}</span>
        </button>
      </div>
    </div>
  )
}

/* ---------- Main Section --------------------------------------------- */
export default function SoleRegistry() {
  const [form,      setForm]    = useState({ displayName:'', city:'', shoe:'', brand:'Nike', colorway:'', size:'', story:'', email:'' })
  const [heat,      setHeat]    = useState({})
  const [localWall, setLocal]   = useState([])
  const [pass,      setPass]    = useState(null)
  const [loading,   setLoading] = useState(false)
  const [error,     setError]   = useState('')
  const [count,     setCount]   = useState(null)
  const [wall,      setWall]    = useState([])
  const [done,      setDone]    = useState(false)

  useEffect(() => {
    setHeat(loadHeat())
    setLocal(loadLocal())

    // The real wall. Entries appear once the organiser has read them.
    fetch('/.netlify/functions/sole-submit')
      .then(r => r.ok ? r.json() : null)
      .then(d => {
        if (!d) return
        setWall(Array.isArray(d.wall) ? d.wall : [])
        if (Number.isFinite(d.total)) setCount(d.total)
      })
      .catch(() => {})
  }, [])

  const up = k => e => setForm(f => ({ ...f, [k]: e.target.value }))

  async function handleSubmit(e) {
    e.preventDefault()
    if (!form.shoe.trim() || !form.city || !form.story.trim()) {
      setError('Please fill in shoe name, city, and your story.')
      return
    }
    setLoading(true)
    setError('')
    try {
      const res  = await fetch('/.netlify/functions/sole-submit', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ ...form, displayName: form.displayName || 'Anonymous' }),
      })
      const data = await res.json()
      if (!res.ok) { setError(data.error || 'Submission failed. Please try again.'); return }

      const newEntry = { id:data.submissionId, display:form.displayName || 'Anonymous', city:form.city, shoe:form.shoe, brand:form.brand, colorway:form.colorway, story:form.story, heat:0 }
      const updated  = [newEntry, ...localWall]
      setLocal(updated)
      localStorage.setItem('sf26_sole_entries', JSON.stringify(updated))

      setPass({ ...data, shoe:form.shoe, brand:form.brand, city:form.city, story:form.story })
      setForm({ displayName:'', city:'', shoe:'', brand:'Nike', colorway:'', size:'', story:'', email:'' })
      setDone(true)
    } catch {
      setError('Network error. Please check your connection and try again.')
    } finally {
      setLoading(false)
    }
  }

  function toggleHeat(id) {
    const next = { ...heat, [id]: !heat[id] }
    setHeat(next)
    localStorage.setItem('sf26_sole_heat', JSON.stringify(next))
  }

  // Your own entry shows to you straight away; everyone else sees it after review.
  const wallIds     = new Set(wall.map(e => e.id))
  const allWall     = [...localWall.filter(e => !wallIds.has(e.id)), ...wall]
  const claimedPct  = count === null ? 0 : Math.min(100, (count / TOTAL_WALL) * 100).toFixed(1)
  const remaining   = count === null ? null : TOTAL_WALL - count

  return (
    <section id="sole-registry" style={{ background:B.black, padding:'96px 24px', position:'relative', overflow:'hidden' }}>
      <GrainOverlay />
      <ScanLines />

      {/* decorative glow */}
      <div style={{ position:'absolute', top:'20%', right:'-8%', width:400, height:400, background:`radial-gradient(circle, ${B.amber}08 0%, transparent 70%)`, pointerEvents:'none' }} />
      <div style={{ position:'absolute', bottom:'10%', left:'-5%', width:300, height:300, background:`radial-gradient(circle, ${B.neonMagenta}06 0%, transparent 70%)`, pointerEvents:'none' }} />

      <div style={{ position:'relative', zIndex:10, maxWidth:1100, margin:'0 auto' }}>
        <SectionTag label="THE SOLE REGISTRY" />

        {/* Header */}
        <div className="reveal-3d" style={{ textAlign:'center', marginBottom:52 }}>
          <h2 style={{ fontFamily:"'Orbitron',monospace", fontWeight:900, fontSize:'clamp(26px,4.5vw,50px)', color:B.white, letterSpacing:'4px', margin:'0 0 12px', textTransform:'uppercase', lineHeight:1.1 }}>
            YOUR <span style={{ color:B.amber, textShadow:`0 0 30px ${B.amber}50` }}>GRAIL</span> ON THE WALL
          </h2>
          <p style={{ fontFamily:"'Space Mono',monospace", fontSize:12, color:B.smoke, lineHeight:1.8, maxWidth:540, margin:'0 auto 32px' }}>
            {TOTAL_WALL} physical spots on the official wall at Muri Okunola Park. Register your grail now &mdash; claim your name at the event on Dec 12.
          </p>

          {/* Scarcity bar */}
          <div style={{ maxWidth:460, margin:'0 auto' }}>
            <div style={{ display:'flex', justifyContent:'space-between', marginBottom:8 }}>
              <span style={{ fontFamily:"'Space Mono',monospace", fontSize:9, color:B.amber, fontWeight:700, letterSpacing:'2px' }}>{count === null ? '—' : count} CLAIMED</span>
              <span style={{ fontFamily:"'Space Mono',monospace", fontSize:9, color: remaining !== null && remaining < 30 ? B.neonMagenta : B.smoke, letterSpacing:'2px' }}>{remaining === null ? '—' : remaining} REMAINING</span>
            </div>
            <div style={{ height:6, background:B.gunmetal, borderRadius:3, overflow:'hidden', position:'relative' }}>
              <div style={{ height:'100%', width:`${claimedPct}%`, background:`linear-gradient(90deg,${B.amber},#E55C00)`, borderRadius:3, transition:'width .8s ease', boxShadow:`0 0 12px ${B.amber}60` }} />
            </div>
            <div style={{ fontFamily:"'Space Mono',monospace", fontSize:9, color:B.smoke, textAlign:'center', marginTop:7, letterSpacing:'1px' }}>{count === null ? '—' : count} / {TOTAL_WALL} WALL SPOTS</div>
          </div>
        </div>

        {/* Two-column: form + wall */}
        <div style={{ display:'flex', flexWrap:'wrap', gap:40, alignItems:'flex-start' }}>

          {/* ---- FORM ------------------------------------------------- */}
          <div style={{ flex:'1 1 340px', background:B.void, border:`1px solid ${B.gunmetal}`, borderRadius:12, padding:28 }}>
            <div style={{ fontFamily:"'Orbitron',monospace", fontSize:11, fontWeight:700, color:B.amber, letterSpacing:'3px', marginBottom:20 }}>REGISTER YOUR GRAIL</div>

            {done && !pass && (
              <div style={{ fontFamily:"'Space Mono',monospace", fontSize:10, color:B.neonLime, background:`${B.neonLime}10`, border:`1px solid ${B.neonLime}30`, borderRadius:6, padding:'12px 16px', marginBottom:16 }}>
                Your spot is claimed! Submit another grail below.
              </div>
            )}

            <form onSubmit={handleSubmit} style={{ display:'flex', flexDirection:'column', gap:14 }}>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
                <div>
                  <label style={LBL}>Name (optional)</label>
                  <input value={form.displayName} onChange={up('displayName')} maxLength={40} placeholder="Anonymous" style={INP} />
                </div>
                <div>
                  <label style={LBL}>Your City *</label>
                  <div style={{ position:'relative' }}>
                    <select value={form.city} onChange={up('city')} required style={SEL}>
                      <option value="">Select city</option>
                      {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                    <span style={{ position:'absolute', right:10, top:'50%', transform:'translateY(-50%)', pointerEvents:'none', color:B.smoke, fontSize:10 }}>&#9660;</span>
                  </div>
                </div>
              </div>

              <div>
                <label style={LBL}>Shoe Name / Grail *</label>
                <input value={form.shoe} onChange={up('shoe')} maxLength={80} required placeholder="e.g. Air Jordan 4 Retro Bred" style={INP} />
              </div>

              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
                <div>
                  <label style={LBL}>Brand *</label>
                  <div style={{ position:'relative' }}>
                    <select value={form.brand} onChange={up('brand')} required style={SEL}>
                      {BRANDS.map(b => <option key={b} value={b}>{b}</option>)}
                    </select>
                    <span style={{ position:'absolute', right:10, top:'50%', transform:'translateY(-50%)', pointerEvents:'none', color:B.smoke, fontSize:10 }}>&#9660;</span>
                  </div>
                </div>
                <div>
                  <label style={LBL}>Size (optional)</label>
                  <input value={form.size} onChange={up('size')} maxLength={10} placeholder="e.g. 42 EU" style={INP} />
                </div>
              </div>

              <div>
                <label style={LBL}>Colorway (optional)</label>
                <input value={form.colorway} onChange={up('colorway')} maxLength={60} placeholder="e.g. Black / Red / White" style={INP} />
              </div>

              <div>
                <div style={{ display:'flex', justifyContent:'space-between', marginBottom:5, alignItems:'center' }}>
                  <label style={{ ...LBL, marginBottom:0 }}>Your Story *</label>
                  <span style={{ fontFamily:"'Space Mono',monospace", fontSize:9, color: form.story.length > 170 ? B.neonMagenta : B.smoke }}>{form.story.length}/{MAX_STORY}</span>
                </div>
                <textarea
                  value={form.story} onChange={up('story')} maxLength={MAX_STORY} required rows={3}
                  placeholder="Why is this your grail?"
                  style={{ ...INP, resize:'vertical', lineHeight:1.6 }}
                />
              </div>

              <div>
                <label style={LBL}>Email (optional &mdash; get your Sole Pass)</label>
                <input value={form.email} onChange={up('email')} type="email" placeholder="you@example.com" style={INP} />
              </div>

              {error && (
                <div style={{ fontFamily:"'Space Mono',monospace", fontSize:9, color:B.neonMagenta, padding:'8px 12px', background:`${B.neonMagenta}10`, border:`1px solid ${B.neonMagenta}30`, borderRadius:4, lineHeight:1.6 }}>
                  {error}
                </div>
              )}

              <button
                type="submit" disabled={loading}
                style={{ padding:14, background: loading ? B.gunmetal : B.amber, border:'none', borderRadius:6, fontFamily:"'Orbitron',monospace", fontSize:9, fontWeight:700, letterSpacing:'3px', color: loading ? B.smoke : B.black, cursor: loading ? 'not-allowed' : 'pointer', transition:'all .2s', marginTop:2, boxShadow: loading ? 'none' : `0 0 20px ${B.amber}30` }}
              >
                {loading ? 'CLAIMING...' : 'CLAIM YOUR WALL SPOT'}
              </button>

              <p style={{ fontFamily:"'Space Mono',monospace", fontSize:9, color:B.smoke, margin:0, lineHeight:1.7, textAlign:'center' }}>
                Your name will appear on the physical wall at the event. One submission per grail.
              </p>
            </form>
          </div>

          {/* ---- COMMUNITY WALL --------------------------------------- */}
          <div style={{ flex:'1 1 340px' }}>
            <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:16 }}>
              <div style={{ fontFamily:"'Orbitron',monospace", fontSize:11, fontWeight:700, color:B.amber, letterSpacing:'3px' }}>COMMUNITY WALL</div>
              <div style={{ fontFamily:"'Space Mono',monospace", fontSize:9, color:B.smoke }}>{allWall.length} OF {TOTAL_WALL} SHOWN</div>
            </div>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(190px,1fr))', gap:12, maxHeight:600, overflowY:'auto', paddingRight:4 }}>
              {allWall.map(entry => (
                <WallCard key={entry.id} entry={entry} voted={!!heat[entry.id]} onHeat={toggleHeat} />
              ))}
            </div>
            <p style={{ fontFamily:"'Space Mono',monospace", fontSize:9, color:B.smoke, textAlign:'center', marginTop:16, lineHeight:1.6 }}>
              &#x1F525; tap to add heat &mdash; top entries displayed on the main event screen
            </p>
          </div>
        </div>
      </div>

      <SolePassModal pass={pass} onClose={() => setPass(null)} />
    </section>
  )
}
