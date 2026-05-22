import { useState } from 'react'
import { B } from '../tokens'

const COLORS = [B.amber, B.neonCyan, B.neonMagenta, B.neonLime]

const SEED = [
  { name:'TUNDE B.', area:'LEKKI', vibe:'PURIST' },
  { name:'CHIOMA A.', area:'VICTORIA ISLAND', vibe:'CURATOR' },
  { name:'EMEKA O.', area:'ABUJA', vibe:'HEAT' },
  { name:'ADAEZE N.', area:'GRA IKEJA', vibe:'ICONIC' },
  { name:'KEHINDE F.', area:'SURULERE', vibe:'VINTAGE' },
  { name:'BLESSING U.', area:'PORT HARCOURT', vibe:'FIRE' },
  { name:'SEGUN A.', area:'YABA', vibe:'CREATIVE' },
  { name:'FATIMA M.', area:'KANO', vibe:'LEGACY' },
  { name:'DAVID O.', area:'BANANA ISLAND', vibe:'GRAIL' },
  { name:'NGOZI K.', area:'ENUGU', vibe:'COLLECTOR' },
  { name:'IBRAHIM Y.', area:'KADUNA', vibe:'HEAT' },
  { name:'AMARA C.', area:'IKOYI', vibe:'CURATOR' },
  { name:'FELIX O.', area:'OSHODI', vibe:'OG' },
  { name:'KEMI A.', area:'LEKKI PHASE 1', vibe:'ICONIC' },
  { name:'CHUKA N.', area:'ABA', vibe:'CUSTOM' },
  { name:'RASHIDA T.', area:'IBADAN', vibe:'VINTAGE' },
  { name:'OLUMIDE S.', area:'ONIKAN', vibe:'HERITAGE' },
  { name:'AMINA B.', area:'WUSE 2 ABUJA', vibe:'FIRE' },
  { name:'VICTOR E.', area:'GBAGADA', vibe:'PURIST' },
  { name:'PRECIOUS A.', area:'UNILAG', vibe:'HEAT' },
  { name:'BAYO K.', area:'LAGOS ISLAND', vibe:'OG' },
  { name:'DAMILOLA O.', area:'AJAH', vibe:'CURATOR' },
  { name:'NKECHI A.', area:'BENIN CITY', vibe:'LEGACY' },
  { name:'SULAIMON F.', area:'ILORIN', vibe:'GRAIL' },
]

function getStored() {
  try { return JSON.parse(localStorage.getItem('sf26_wall') || '[]') } catch { return [] }
}

function EntryChip({ entry, idx }) {
  const color = COLORS[idx % COLORS.length]
  return (
    <div
      style={{ padding:'12px 16px', background:'rgba(255,255,255,0.03)', border:`1px solid ${color}18`, borderRadius:10, marginBottom:10, backdropFilter:'blur(8px)', transition:'border-color 0.2s', cursor:'default' }}
      onMouseEnter={e => e.currentTarget.style.borderColor = color + '50'}
      onMouseLeave={e => e.currentTarget.style.borderColor = color + '18'}
    >
      <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:3 }}>
        <div style={{ width:6, height:6, borderRadius:'50%', background:color, boxShadow:`0 0 6px ${color}`, flexShrink:0 }} />
        <span style={{ fontFamily:'Bebas Neue, sans-serif', fontSize:15, color:B.white, letterSpacing:1 }}>{entry.name}</span>
      </div>
      <div style={{ paddingLeft:14 }}>
        <span style={{ fontFamily:'Bebas Neue, sans-serif', fontSize:11, color:B.smoke, letterSpacing:2 }}>{entry.area}</span>
        <span style={{ fontFamily:'Bebas Neue, sans-serif', fontSize:11, color, letterSpacing:2, marginLeft:8 }}>· {entry.vibe}</span>
      </div>
    </div>
  )
}

function ScrollCol({ entries, speed, dir }) {
  if (!entries.length) return null
  const doubled = [...entries, ...entries]
  return (
    <div style={{ flex:1, overflow:'hidden', maxHeight:500, position:'relative' }}>
      <div style={{ animation:`wallScroll${dir} ${speed} linear infinite`, willChange:'transform' }}>
        {doubled.map((e, i) => <EntryChip key={i} entry={e} idx={i} />)}
      </div>
    </div>
  )
}

export default function CommunityWall() {
  const [stored, setStored] = useState(getStored)
  const [name, setName] = useState('')
  const [area, setArea] = useState('')
  const [vibe, setVibe] = useState('')
  const [done, setDone] = useState(false)

  const all = [...SEED, ...stored]
  const col1 = all.filter((_, i) => i % 3 === 0)
  const col2 = all.filter((_, i) => i % 3 === 1)
  const col3 = all.filter((_, i) => i % 3 === 2)

  const submit = (e) => {
    e.preventDefault()
    if (!name.trim()) return
    const entry = {
      name: name.trim().toUpperCase(),
      area: area.trim().toUpperCase() || 'NIGERIA',
      vibe: vibe.trim().toUpperCase() || 'SOLE CARRIER',
    }
    const updated = [...stored, entry]
    try { localStorage.setItem('sf26_wall', JSON.stringify(updated)) } catch {}
    setStored(updated)
    setName(''); setArea(''); setVibe('')
    setDone(true)
    setTimeout(() => setDone(false), 3500)
  }

  const inputStyle = {
    width: '100%',
    padding: '14px 16px',
    background: 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(255,255,255,0.12)',
    borderRadius: 8,
    color: B.white,
    fontFamily: 'Bebas Neue, sans-serif',
    fontSize: 16,
    letterSpacing: 1,
    outline: 'none',
    transition: 'border-color 0.2s',
  }

  return (
    <section id="wall" style={{ background:B.black, padding:'100px 0', position:'relative', overflow:'hidden' }}>
      <style>{`
        @keyframes wallScrollup { 0% { transform:translateY(0); } 100% { transform:translateY(-50%); } }
        @keyframes wallScrolldown { 0% { transform:translateY(-50%); } 100% { transform:translateY(0); } }
      `}</style>

      <div style={{ position:'absolute', top:'20%', right:'-5%', width:400, height:400, background:B.neonCyan+'07', borderRadius:'50%', filter:'blur(80px)', pointerEvents:'none' }} />
      <div style={{ position:'absolute', bottom:'20%', left:'-5%', width:400, height:400, background:B.neonMagenta+'07', borderRadius:'50%', filter:'blur(80px)', pointerEvents:'none' }} />

      <div style={{ maxWidth:1100, margin:'0 auto', padding:'0 24px' }}>

        {/* Header */}
        <div style={{ textAlign:'center', marginBottom:64 }}>
          <p style={{ fontFamily:'Bebas Neue, sans-serif', color:B.amber, fontSize:13, letterSpacing:6, marginBottom:12 }}>SOLE CARRIERS</p>
          <h2 style={{ fontFamily:'Bebas Neue, sans-serif', fontSize:'clamp(48px, 8vw, 80px)', color:B.white, lineHeight:1, letterSpacing:2, marginBottom:16 }}>THE WALL</h2>
          <p style={{ color:B.smoke, fontSize:15, maxWidth:460, margin:'0 auto', lineHeight:1.7 }}>
            {all.length} sole carriers from across Nigeria and West Africa, ready for December 12.
          </p>
        </div>

        {/* Scrolling columns */}
        <div style={{ display:'flex', gap:16, marginBottom:64 }}>
          <ScrollCol entries={col1} speed="28s" dir="up" />
          <ScrollCol entries={col2} speed="38s" dir="down" />
          <ScrollCol entries={col3} speed="33s" dir="up" />
        </div>

        {/* Leave Your Mark form */}
        <div style={{ background:`linear-gradient(135deg, ${B.amber}10, transparent)`, border:`1px solid ${B.amber}25`, borderRadius:20, padding:'48px', position:'relative', overflow:'hidden' }}>
          <div style={{ position:'absolute', top:0, left:0, right:0, height:3, background:`linear-gradient(90deg, ${B.amber}, ${B.neonMagenta}, transparent)` }} />

          <div style={{ textAlign:'center', marginBottom:36 }}>
            <h3 style={{ fontFamily:'Bebas Neue, sans-serif', fontSize:'clamp(28px, 4vw, 42px)', color:B.white, letterSpacing:2, marginBottom:8 }}>LEAVE YOUR MARK</h3>
            <p style={{ color:B.smoke, fontSize:14, letterSpacing:1 }}>Add yourself to the wall. The city needs to know you're coming.</p>
          </div>

          {done ? (
            <div style={{ textAlign:'center', padding:'28px 0' }}>
              <div style={{ fontFamily:'Bebas Neue, sans-serif', fontSize:'clamp(32px, 5vw, 52px)', color:B.neonLime, marginBottom:10, textShadow:`0 0 30px ${B.neonLime}50` }}>
                ✓ YOU'RE ON THE WALL
              </div>
              <p style={{ color:B.smoke, fontSize:14 }}>See you December 12, Sole Carrier.</p>
            </div>
          ) : (
            <form onSubmit={submit}>
              <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(200px, 1fr))', gap:16, marginBottom:24 }}>
                {[
                  { label:'YOUR NAME *', val:name, set:setName, ph:"e.g. TUNDE B." },
                  { label:'CITY / AREA', val:area, set:setArea, ph:'e.g. LEKKI' },
                  { label:'YOUR VIBE (ONE WORD)', val:vibe, set:setVibe, ph:'e.g. CURATOR' },
                ].map(({ label, val, set, ph }) => (
                  <div key={label}>
                    <label style={{ display:'block', fontFamily:'Bebas Neue, sans-serif', fontSize:11, color:B.smoke, letterSpacing:3, marginBottom:8 }}>{label}</label>
                    <input
                      type="text"
                      value={val}
                      onChange={e => set(e.target.value)}
                      placeholder={ph}
                      maxLength={28}
                      style={inputStyle}
                      onFocus={e => e.target.style.borderColor = B.amber + '60'}
                      onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.12)'}
                    />
                  </div>
                ))}
              </div>
              <div style={{ textAlign:'center' }}>
                <button
                  type="submit"
                  style={{ padding:'15px 44px', background:B.amber, color:B.black, fontFamily:'Bebas Neue, sans-serif', fontSize:18, letterSpacing:3, borderRadius:8, border:'none', cursor:'pointer', boxShadow:`0 0 32px ${B.amber}40`, transition:'transform 0.2s, box-shadow 0.2s' }}
                  onMouseEnter={e => { e.currentTarget.style.transform='scale(1.04)'; e.currentTarget.style.boxShadow=`0 0 48px ${B.amber}60` }}
                  onMouseLeave={e => { e.currentTarget.style.transform='scale(1)'; e.currentTarget.style.boxShadow=`0 0 32px ${B.amber}40` }}
                >
                  ADD ME TO THE WALL →
                </button>
              </div>
            </form>
          )}
        </div>

      </div>
    </section>
  )
}
