import { useState, useEffect } from 'react'
import { B } from '../tokens'

const ROLES = {
  WORDSMITH: { color: B.neonCyan,    symbol: '✦', desc: 'Writer · Poet · Storyteller' },
  VISIONARY: { color: B.neonMagenta, symbol: '◉', desc: 'Designer · Artist · Dreamer' },
  CREATOR:   { color: B.amber,       symbol: '⚡', desc: 'Maker · Builder · Founder'  },
  CATALYST:  { color: B.neonLime,    symbol: '◈', desc: 'Innovator · Leader · Pioneer' },
}

const SEED = [
  { id:'s1',  name:'TUNDE B.',     city:'LEKKI',            role:'WORDSMITH', rot:-3, date:"APR '26",
    msg:"Lagos has been waiting for this moment. We are not just wearing shoes — we are wearing culture." },
  { id:'s2',  name:'CHIOMA A.',    city:'VICTORIA ISLAND',  role:'VISIONARY', rot:2,  date:"APR '26",
    msg:"Every silhouette I sketch starts with the streets I walk. Lagos is my design studio." },
  { id:'s3',  name:'EMEKA O.',     city:'ABUJA',            role:'CREATOR',   rot:-1, date:"MAR '26",
    msg:"I build things that outlast the season. Sneakers Fest is where the next era starts." },
  { id:'s4',  name:'ADAEZE N.',    city:'GRA IKEJA',        role:'CATALYST',  rot:4,  date:"MAY '26",
    msg:"The revolution is always in the details. December 12 is a statement, not a date." },
  { id:'s5',  name:'KEHINDE F.',   city:'SURULERE',         role:'WORDSMITH', rot:-2, date:"MAR '26",
    msg:"We write the stories they'll teach in classrooms one day. This wall is chapter one." },
  { id:'s6',  name:'SEGUN A.',     city:'YABA',             role:'CREATOR',   rot:3,  date:"APR '26",
    msg:"Custom work is a love language. Every pair I touch carries a piece of Lagos in it." },
  { id:'s7',  name:'FATIMA M.',    city:'KANO',             role:'VISIONARY', rot:-4, date:"FEB '26",
    msg:"Representation matters. When I design, I design for all of us. No exceptions." },
  { id:'s8',  name:'DAVID O.',     city:'BANANA ISLAND',    role:'CATALYST',  rot:1,  date:"MAY '26",
    msg:"Culture is the only currency that multiplies when you share it freely." },
  { id:'s9',  name:'NGOZI K.',     city:'ENUGU',            role:'WORDSMITH', rot:-3, date:"APR '26",
    msg:"Poetry and sneakers share the same thing — both speak without speaking a word." },
  { id:'s10', name:'IBRAHIM Y.',   city:'KADUNA',           role:'CREATOR',   rot:2,  date:"MAR '26",
    msg:"I came to build something that lasts past the hype cycle. Real craft outlives trends." },
  { id:'s11', name:'AMARA C.',     city:'IKOYI',            role:'VISIONARY', rot:-1, date:"APR '26",
    msg:"Good design doesn't whisper — it announces. December 12, I announce myself." },
  { id:'s12', name:'FELIX O.',     city:'OSHODI',           role:'CATALYST',  rot:4,  date:"FEB '26",
    msg:"The streets built me. Now I'm building the streets back. That's the whole assignment." },
  { id:'s13', name:'KEMI A.',      city:'LEKKI PHASE 1',   role:'WORDSMITH', rot:-2, date:"MAY '26",
    msg:"I'm writing the Lagos chapter they forgot to include. The wall remembers everything." },
  { id:'s14', name:'OLUMIDE S.',   city:'ONIKAN',           role:'CREATOR',   rot:3,  date:"APR '26",
    msg:"Heritage is not a museum exhibit. It's alive. It breathes. It walks with us." },
  { id:'s15', name:'PRECIOUS A.',  city:'UNILAG',           role:'CATALYST',  rot:-4, date:"MAY '26",
    msg:"We don't wait for permission to be great. Sneakers Fest is proof of what's possible." },
  { id:'s16', name:'RASHIDA T.',   city:'IBADAN',           role:'VISIONARY', rot:1,  date:"MAR '26",
    msg:"Color theory. Culture theory. Same discipline if you know where to look." },
  { id:'s17', name:'VICTOR E.',    city:'GBAGADA',          role:'CREATOR',   rot:-3, date:"APR '26",
    msg:"Every stitch is intentional. Every drop means something. December 12, we drop together." },
  { id:'s18', name:'BLESSING U.',  city:'PORT HARCOURT',   role:'WORDSMITH', rot:2,  date:"MAY '26",
    msg:"The south has stories. I'm here to make sure the wall hears them." },
  { id:'s19', name:'SULAIMON F.',  city:'ILORIN',           role:'CATALYST',  rot:-1, date:"APR '26",
    msg:"Grail culture isn't about rarity — it's about meaning. That's what this movement is." },
  { id:'s20', name:'NKECHI A.',    city:'BENIN CITY',       role:'VISIONARY', rot:3,  date:"MAR '26",
    msg:"My art is my geography. Lagos to Benin, the canvas is the entire south." },
]

function getStored() {
  try { return JSON.parse(localStorage.getItem('sf26_sacred_wall') || '[]') } catch { return [] }
}

function WallCard({ entry, isNew }) {
  const cfg = ROLES[entry.role] || ROLES.CREATOR
  const [hov, setHov] = useState(false)
  return (
    <div
      style={{
        transform: `rotate(${entry.rot || 0}deg) ${hov ? 'scale(1.05) translateY(-8px)' : 'scale(1)'}`,
        transition: 'transform 0.32s cubic-bezier(.34,1.56,.64,1), box-shadow 0.32s ease',
        background: 'linear-gradient(145deg, #131313, #0d0d0d)',
        border: `1px solid ${cfg.color}28`,
        borderRadius: 6,
        padding: '22px 18px 18px',
        position: 'relative',
        boxShadow: hov
          ? `0 20px 60px rgba(0,0,0,0.9), 0 0 40px ${cfg.color}18`
          : `0 6px 28px rgba(0,0,0,0.7), inset 0 1px 0 rgba(255,255,255,0.03)`,
        cursor: 'default',
        breakInside: 'avoid',
        marginBottom: 16,
        animation: isNew ? 'cardIn 0.45s cubic-bezier(.34,1.56,.64,1) forwards' : 'none',
        willChange: 'transform',
      }}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
    >
      {/* Pin */}
      <div style={{
        position: 'absolute', top: -8, left: '50%', transform: 'translateX(-50%)',
        width: 14, height: 14, borderRadius: '50%',
        background: `radial-gradient(circle at 35% 35%, ${cfg.color}cc, ${cfg.color}66)`,
        boxShadow: `0 0 12px ${cfg.color}80, 0 2px 4px rgba(0,0,0,0.8)`,
        border: '1px solid rgba(255,255,255,0.2)',
        zIndex: 1,
      }} />

      {/* Top accent */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: 2, borderRadius: '6px 6px 0 0',
        background: `linear-gradient(90deg, transparent, ${cfg.color}50, transparent)`,
      }} />

      {/* Role badge */}
      <div style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '3px 9px 3px 7px',
        background: cfg.color + '12', border: `1px solid ${cfg.color}35`, borderRadius: 3, marginBottom: 13 }}>
        <span style={{ fontSize: 9 }}>{cfg.symbol}</span>
        <span style={{ fontFamily: "'Orbitron',monospace", fontSize: 8, fontWeight: 700, color: cfg.color, letterSpacing: 2 }}>
          {entry.role}
        </span>
      </div>

      {/* Message */}
      <p style={{ fontFamily: "'Syne',sans-serif", fontSize: 13, color: 'rgba(255,255,255,0.88)',
        lineHeight: 1.75, marginBottom: 16, fontStyle: 'italic', minHeight: 40 }}>
        "{entry.msg}"
      </p>

      {/* Footer */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end',
        borderTop: `1px solid rgba(255,255,255,0.05)`, paddingTop: 11 }}>
        <div>
          <div style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: 14, color: B.white, letterSpacing: 1.5 }}>
            {entry.name}
          </div>
          {entry.city && (
            <div style={{ fontFamily: "'Space Mono',monospace", fontSize: 8, color: B.smoke, marginTop: 1, letterSpacing: 1 }}>
              {entry.city}
            </div>
          )}
        </div>
        <div style={{ fontFamily: "'Space Mono',monospace", fontSize: 8, color: cfg.color + '70', letterSpacing: 1 }}>
          {entry.date}
        </div>
      </div>
    </div>
  )
}

function AddModal({ onClose, onAdd }) {
  const [name, setName]   = useState('')
  const [city, setCity]   = useState('')
  const [role, setRole]   = useState('WORDSMITH')
  const [msg, setMsg]     = useState('')
  const [done, setDone]   = useState(false)

  const submit = (e) => {
    e.preventDefault()
    if (!name.trim() || !msg.trim()) return
    const rots = [-4, -3, -2, -1, 1, 2, 3, 4]
    const entry = {
      id: 'u' + Date.now(),
      name: name.trim().toUpperCase(),
      city: city.trim().toUpperCase() || 'NIGERIA',
      role,
      msg: msg.trim(),
      rot: rots[Math.floor(Math.random() * rots.length)],
      date: new Date().toLocaleString('en-US', { month: 'short', year: '2-digit' }).toUpperCase().replace(' ', " '"),
      isNew: true,
    }
    onAdd(entry)
    setDone(true)
    setTimeout(() => { onClose() }, 2800)
  }

  const inputStyle = {
    width: '100%', padding: '13px 15px',
    background: 'rgba(255,255,255,0.04)',
    border: '1px solid rgba(255,255,255,0.10)',
    borderRadius: 8, color: B.white,
    fontFamily: "'Syne',sans-serif", fontSize: 14,
    outline: 'none', transition: 'border-color 0.2s',
  }

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 3000, display: 'flex', alignItems: 'flex-end',
      justifyContent: 'center', background: 'rgba(0,0,0,0.88)', backdropFilter: 'blur(16px)' }}
      onClick={e => { if (e.target === e.currentTarget) onClose() }}>

      <div style={{ width: '100%', maxWidth: 640, background: '#0d0d0d',
        border: `1px solid ${B.amber}25`, borderRadius: '20px 20px 0 0',
        padding: '36px 32px 40px', position: 'relative',
        animation: 'modalUp 0.4s cubic-bezier(.34,1.56,.64,1) forwards',
        boxShadow: `0 -24px 80px rgba(0,0,0,0.9), 0 0 60px ${B.amber}08`,
      }}>
        {/* Handle */}
        <div style={{ width: 44, height: 4, borderRadius: 2, background: 'rgba(255,255,255,0.12)',
          margin: '0 auto 28px' }} />

        {/* Top bar */}
        <div style={{ position: 'absolute', top: 0, left: 32, right: 32, height: 2,
          background: `linear-gradient(90deg, transparent, ${B.amber}60, ${B.neonMagenta}60, transparent)` }} />

        {done ? (
          <div style={{ textAlign: 'center', padding: '36px 0' }}>
            <div style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: 'clamp(36px,7vw,56px)',
              color: B.neonLime, letterSpacing: 3, textShadow: `0 0 40px ${B.neonLime}60`, marginBottom: 12 }}>
              ✓ YOUR MARK IS SET
            </div>
            <p style={{ fontFamily: "'Syne',sans-serif", color: B.smoke, fontSize: 14 }}>
              You are now part of the movement. Forever.
            </p>
          </div>
        ) : (
          <form onSubmit={submit}>
            <div style={{ textAlign: 'center', marginBottom: 28 }}>
              <h3 style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: 'clamp(26px,4vw,36px)',
                color: B.white, letterSpacing: 3, marginBottom: 6 }}>LEAVE YOUR MARK</h3>
              <p style={{ fontFamily: "'Syne',sans-serif", fontSize: 12, color: B.smoke }}>
                This wall is sacred. Your words stay. The movement remembers.
              </p>
            </div>

            {/* Role selector */}
            <div style={{ marginBottom: 22 }}>
              <label style={{ fontFamily: "'Space Mono',monospace", fontSize: 10, color: B.smoke,
                letterSpacing: 3, display: 'block', marginBottom: 10 }}>YOUR ROLE *</label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 8 }}>
                {Object.entries(ROLES).map(([r, cfg]) => (
                  <button key={r} type="button" onClick={() => setRole(r)}
                    style={{
                      padding: '11px 14px', borderRadius: 8, border: `1px solid ${role === r ? cfg.color + '80' : 'rgba(255,255,255,0.08)'}`,
                      background: role === r ? cfg.color + '15' : 'rgba(255,255,255,0.02)',
                      cursor: 'pointer', textAlign: 'left', transition: 'all 0.18s',
                    }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 3 }}>
                      <span style={{ fontSize: 11 }}>{cfg.symbol}</span>
                      <span style={{ fontFamily: "'Orbitron',monospace", fontSize: 8, fontWeight: 700,
                        color: role === r ? cfg.color : B.smoke, letterSpacing: 2 }}>{r}</span>
                    </div>
                    <div style={{ fontFamily: "'Syne',sans-serif", fontSize: 10, color: 'rgba(255,255,255,0.35)' }}>
                      {cfg.desc}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Name + City row */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 16 }}>
              <div>
                <label style={{ fontFamily: "'Space Mono',monospace", fontSize: 10, color: B.smoke,
                  letterSpacing: 3, display: 'block', marginBottom: 7 }}>YOUR NAME *</label>
                <input value={name} onChange={e => setName(e.target.value)} placeholder="e.g. TUNDE B."
                  maxLength={28} required style={inputStyle}
                  onFocus={e => e.target.style.borderColor = B.amber + '60'}
                  onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.10)'} />
              </div>
              <div>
                <label style={{ fontFamily: "'Space Mono',monospace", fontSize: 10, color: B.smoke,
                  letterSpacing: 3, display: 'block', marginBottom: 7 }}>CITY / AREA</label>
                <input value={city} onChange={e => setCity(e.target.value)} placeholder="e.g. LEKKI"
                  maxLength={28} style={inputStyle}
                  onFocus={e => e.target.style.borderColor = B.amber + '60'}
                  onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.10)'} />
              </div>
            </div>

            {/* Message */}
            <div style={{ marginBottom: 24 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 7 }}>
                <label style={{ fontFamily: "'Space Mono',monospace", fontSize: 10, color: B.smoke, letterSpacing: 3 }}>
                  YOUR DECLARATION *
                </label>
                <span style={{ fontFamily: "'Space Mono',monospace", fontSize: 9,
                  color: msg.length > 120 ? B.neonMagenta : B.smoke }}>
                  {msg.length}/140
                </span>
              </div>
              <textarea value={msg} onChange={e => setMsg(e.target.value.slice(0, 140))}
                placeholder="Write your truth. What does this movement mean to you? What are you creating? What do you stand for?"
                required rows={4}
                style={{ ...inputStyle, resize: 'none', lineHeight: 1.6, fontStyle: 'italic' }}
                onFocus={e => e.target.style.borderColor = ROLES[role].color + '60'}
                onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.10)'} />
            </div>

            <button type="submit"
              style={{ width: '100%', padding: '16px', background: B.amber, color: B.black,
                fontFamily: "'Bebas Neue',sans-serif", fontSize: 20, letterSpacing: 4, border: 'none',
                borderRadius: 10, cursor: 'pointer', transition: 'all 0.2s',
                boxShadow: `0 0 36px ${B.amber}40` }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.02)'; e.currentTarget.style.boxShadow = `0 0 60px ${B.amber}60` }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.boxShadow = `0 0 36px ${B.amber}40` }}>
              PIN MY MARK TO THE WALL →
            </button>
          </form>
        )}
      </div>
    </div>
  )
}

export default function CommunityWall() {
  const [stored, setStored] = useState(getStored)
  const [modal, setModal]   = useState(false)
  const [newIds, setNewIds]  = useState([])

  const all = [...SEED, ...stored]

  const counts = Object.keys(ROLES).reduce((acc, r) => {
    acc[r] = all.filter(e => e.role === r).length
    return acc
  }, {})

  const handleAdd = (entry) => {
    const updated = [...stored, entry]
    try { localStorage.setItem('sf26_sacred_wall', JSON.stringify(updated)) } catch {}
    setStored(updated)
    setNewIds(ids => [...ids, entry.id])
  }

  return (
    <section id="wall" style={{ background: '#080808', padding: '110px 0 80px', position: 'relative', overflow: 'hidden' }}>
      <style>{`
        @keyframes cardIn { from { opacity:0; transform:translateY(24px) scale(0.92); } to { opacity:1; transform:translateY(0) scale(1); } }
        @keyframes modalUp { from { transform:translateY(100%); } to { transform:translateY(0); } }
        @keyframes sacredPulse { 0%,100% { opacity:0.4; transform:scale(1); } 50% { opacity:0.65; transform:scale(1.08); } }
        @keyframes flameDrift { 0%,100% { transform:scaleX(1) translateY(0); } 50% { transform:scaleX(0.92) translateY(-10px); } }
      `}</style>

      {/* Sacred ambient glows */}
      <div style={{ position:'absolute', top:'10%', left:'50%', transform:'translateX(-50%)', width:600, height:300,
        background:`radial-gradient(ellipse, ${B.amber}18 0%, transparent 70%)`,
        animation:'sacredPulse 6s ease-in-out infinite', pointerEvents:'none' }} />
      <div style={{ position:'absolute', bottom:'15%', right:'-10%', width:500, height:500,
        background:B.neonMagenta+'09', borderRadius:'50%', filter:'blur(100px)', pointerEvents:'none' }} />
      <div style={{ position:'absolute', top:'40%', left:'-8%', width:400, height:400,
        background:B.neonCyan+'07', borderRadius:'50%', filter:'blur(80px)', pointerEvents:'none' }} />

      {/* Subtle grid overlay */}
      <div style={{ position:'absolute', inset:0, pointerEvents:'none',
        backgroundImage:`linear-gradient(rgba(255,255,255,0.012) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.012) 1px, transparent 1px)`,
        backgroundSize:'48px 48px' }} />

      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px' }}>

        {/* Header */}
        <div style={{ textAlign:'center', marginBottom:72, position:'relative' }}>
          <p style={{ fontFamily:"'Space Mono',monospace", color:B.amber, fontSize:10, letterSpacing:6, marginBottom:14 }}>
            ◈ THE SACRED WALL ◈
          </p>
          <h2 style={{ fontFamily:"'Bebas Neue',sans-serif",
            fontSize:'clamp(52px,10vw,100px)', lineHeight:0.9, letterSpacing:4, marginBottom:0,
            background:`linear-gradient(180deg, #fff 40%, ${B.amber}80)`,
            WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent',
          }}>
            WHERE CREATIVES<br />LEAVE THEIR MARK
          </h2>
          <div style={{ width:80, height:2, background:`linear-gradient(90deg, transparent, ${B.amber}, transparent)`, margin:'24px auto' }} />
          <p style={{ fontFamily:"'Syne',sans-serif", color:B.smoke, fontSize:15, maxWidth:480, margin:'0 auto', lineHeight:1.8 }}>
            This is a sacred space. A living record. Every word pinned here is a declaration that you are part of the movement — forever.
          </p>

          {/* Role count badges */}
          <div style={{ display:'flex', flexWrap:'wrap', gap:10, justifyContent:'center', marginTop:28 }}>
            {Object.entries(ROLES).map(([r, cfg]) => (
              <div key={r} style={{ display:'flex', alignItems:'center', gap:6, padding:'5px 12px',
                background:cfg.color+'10', border:`1px solid ${cfg.color}30`, borderRadius:20 }}>
                <span style={{ fontSize:9 }}>{cfg.symbol}</span>
                <span style={{ fontFamily:"'Orbitron',monospace", fontSize:8, fontWeight:700,
                  color:cfg.color, letterSpacing:2 }}>{counts[r]}</span>
                <span style={{ fontFamily:"'Space Mono',monospace", fontSize:8, color:B.smoke, letterSpacing:1 }}>
                  {r}S
                </span>
              </div>
            ))}
            <div style={{ display:'flex', alignItems:'center', gap:6, padding:'5px 12px',
              background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.08)', borderRadius:20 }}>
              <span style={{ fontFamily:"'Orbitron',monospace", fontSize:8, fontWeight:700, color:B.white, letterSpacing:2 }}>
                {all.length}
              </span>
              <span style={{ fontFamily:"'Space Mono',monospace", fontSize:8, color:B.smoke, letterSpacing:1 }}>
                TOTAL MARKS
              </span>
            </div>
          </div>
        </div>

        {/* Masonry card wall */}
        <div style={{ columns: 'auto 280px', gap: 20, marginBottom: 64, position:'relative' }}>
          {all.map((entry, idx) => (
            <WallCard key={entry.id || idx} entry={entry} isNew={newIds.includes(entry.id)} />
          ))}
        </div>

        {/* CTA */}
        <div style={{ textAlign:'center' }}>
          <div style={{ marginBottom:16, fontFamily:"'Space Mono',monospace", fontSize:10,
            color:B.smoke, letterSpacing:4 }}>YOUR VOICE BELONGS HERE</div>
          <button
            onClick={() => setModal(true)}
            style={{ padding:'18px 52px', background:'transparent', color:B.white,
              fontFamily:"'Bebas Neue',sans-serif", fontSize:22, letterSpacing:5,
              border:`2px solid ${B.amber}`, borderRadius:10, cursor:'pointer',
              position:'relative', overflow:'hidden', transition:'all 0.25s',
              boxShadow:`0 0 40px ${B.amber}25, inset 0 0 60px ${B.amber}05` }}
            onMouseEnter={e => {
              e.currentTarget.style.background = B.amber
              e.currentTarget.style.color = B.black
              e.currentTarget.style.boxShadow = `0 0 60px ${B.amber}50`
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = 'transparent'
              e.currentTarget.style.color = B.white
              e.currentTarget.style.boxShadow = `0 0 40px ${B.amber}25, inset 0 0 60px ${B.amber}05`
            }}>
            ✦ LEAVE YOUR MARK ON THE WALL
          </button>
          <p style={{ fontFamily:"'Syne',sans-serif", fontSize:12, color:B.smoke+'80', marginTop:14, letterSpacing:1 }}>
            No account needed. No signup. Just your truth.
          </p>
        </div>

      </div>

      {modal && <AddModal onClose={() => setModal(false)} onAdd={handleAdd} />}
    </section>
  )
}
