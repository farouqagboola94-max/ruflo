import { useState, useEffect } from 'react'
import { B } from '../tokens'
import { GrainOverlay, SectionTag } from '../components/Shared'
import { logReferralConversion } from '../lib/referral'
import Egg from '../components/Egg'

// ── raffles ───────────────────────────────────────────────────────────────────
const RAFFLES = [
  { id:'rfl1', name:'Air Jordan 4 Retro Bred',    edition:'Size 43 · Deadstock',  value:'₦120,000', color:B.amber,       seedCount:287, maxEntries:500 },
  { id:'rfl2', name:"SF '26 Exclusive Bundle",    edition:'Hoodie + Cap + Tote',   value:'₦28,000',  color:B.neonCyan,    seedCount:412, maxEntries:500 },
  { id:'rfl3', name:'Nike SB Dunk Low Pro',        edition:'Size 42 · Deadstock',  value:'₦95,000',  color:B.neonMagenta, seedCount:198, maxEntries:500 },
  { id:'rfl4', name:'VIP Ticket Upgrade',          edition:'General → VIP Access', value:'₦25,000',  color:B.neonLime,    seedCount:156, maxEntries:300 },
]

const SEED_POOL = [
  { name:'Tunde B.',   city:'Lagos'         },
  { name:'Chisom O.',  city:'Abuja'         },
  { name:'Adaeze N.',  city:'Port Harcourt' },
  { name:'Emeka C.',   city:'Enugu'         },
  { name:'Zara I.',    city:'Lagos'         },
  { name:'Femi A.',    city:'Ibadan'        },
  { name:'Ngozi E.',   city:'Benin City'    },
  { name:'Dayo M.',    city:'Kano'          },
  { name:'Kemi S.',    city:'Lagos'         },
  { name:'Bola T.',    city:'Abuja'         },
]

const sleep = ms => new Promise(r => setTimeout(r, ms))

const DRAW_DATE = new Date('2026-12-12T12:00:00')
function calcCountdown() {
  const diff = DRAW_DATE - Date.now()
  if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 }
  return {
    days:    Math.floor(diff / 86400000),
    hours:   Math.floor((diff % 86400000) / 3600000),
    minutes: Math.floor((diff % 3600000)  / 60000),
    seconds: Math.floor((diff % 60000)    / 1000),
  }
}

const CONFETTI_DOTS = Array.from({ length: 18 }, (_, i) => ({
  x:     5 + (i * 5.5),
  color: [B.amber, B.neonCyan, B.neonMagenta, B.neonLime][i % 4],
  size:  3 + (i % 5),
  dur:   1.2 + (i % 4) * 0.25,
  delay: (i % 6) * 0.08,
}))

const PACKS = [
  { id:'single',  label:'1 ENTRY',   count:1, badge:null        },
  { id:'triple',  label:'3 ENTRIES', count:3, badge:'POPULAR'   },
  { id:'maxout',  label:'5 ENTRIES', count:5, badge:'BEST ODDS' },
]

function loadEntries()  { try { return JSON.parse(localStorage.getItem('sf26_raffle_entries') || '{}') } catch { return {} } }
function loadWinners()  { try { return JSON.parse(localStorage.getItem('sf26_raffle_draws')   || '{}') } catch { return {} } }
function loadCounts()   { try { return JSON.parse(localStorage.getItem('sf26_raffle_counts')  || '{}') } catch { return {} } }

const entryNum = () => Math.floor(Math.random() * 899) + 100   // 3-digit, 100-998

// ── entry modal ────────────────────────────────────────────────────────────────
function EntryModal({ raffle, onEnter, onClose }) {
  const [form,      setForm]      = useState({ name:'', email:'', phone:'', city:'' })
  const [submitted, setSubmitted] = useState(null)
  const [pack,      setPack]      = useState(PACKS[0])
  const inp  = k => e => setForm(f => ({ ...f, [k]: e.target.value }))
  const ok   = form.name.trim() && form.email.includes('@') && form.phone.trim() && form.city.trim()
  const is   = { width:'100%', padding:'11px 14px', background:'rgba(255,255,255,0.05)', border:'1px solid rgba(255,255,255,0.1)', borderRadius:7, color:B.white, fontFamily:'Space Mono,monospace', fontSize:12, outline:'none', boxSizing:'border-box', transition:'border-color 0.2s' }
  const lbl  = { fontFamily:'Space Mono,monospace', fontSize:8, color:'#555', letterSpacing:2, display:'block', marginBottom:6 }
  const foc  = e => e.target.style.borderColor = `${raffle.color}60`
  const blur = e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'

  function handleSubmit() {
    if (!ok) return
    const num   = Math.floor(Math.random() * 899) + 100
    const entry = { name: form.name.trim(), city: form.city.trim(), email: form.email, phone: form.phone, entryNum: num, packCount: pack.count, enteredAt: new Date().toISOString() }
    setSubmitted(entry)
    onEnter(entry)
  }

  return (
    <>
      <div onClick={submitted ? undefined : onClose} style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.82)', zIndex:200, backdropFilter:'blur(6px)' }} />

      {/* confetti — only when submitted */}
      {submitted && (
        <div style={{ position:'fixed', inset:0, zIndex:201, pointerEvents:'none', overflow:'hidden' }}>
          {CONFETTI_DOTS.map((d, i) => (
            <div key={i} style={{ position:'absolute', left:`${d.x}%`, top:'-10px', width:d.size, height:d.size, background:d.color, borderRadius:'50%', animation:`confettiFall ${d.dur}s ${d.delay}s ease-in forwards` }} />
          ))}
        </div>
      )}

      <div style={{ position:'fixed', top:'50%', left:'50%', transform:'translate(-50%,-50%)', width:'min(440px,94vw)', background:'#0A0A10', border:`1px solid ${raffle.color}${submitted ? '80' : '30'}`, borderRadius:16, zIndex:202, overflow:'hidden', transition:'border-color 0.4s' }}>
        <div style={{ height:3, background:`linear-gradient(90deg, ${raffle.color}, ${raffle.color}40)` }} />

        {submitted ? (
          /* ── success ── */
          <div style={{ padding:'32px 28px', textAlign:'center', animation:'fadeUp 0.3s ease' }}>
            <div style={{ width:52, height:52, borderRadius:'50%', background:`${B.neonLime}12`, border:`2px solid ${B.neonLime}`, display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 16px' }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M5 13l4 4L19 7" stroke={B.neonLime} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </div>
            <div style={{ fontFamily:'Orbitron,monospace', fontSize:9, color:B.neonLime, letterSpacing:3, marginBottom:4 }}>YOU'RE IN</div>
            <div style={{ fontFamily:'Bebas Neue,sans-serif', fontSize:28, color:B.white, marginBottom:20 }}>ENTRY CONFIRMED</div>

            {/* ticket stub */}
            <div style={{ background:`${raffle.color}08`, border:`1px solid ${raffle.color}40`, borderRadius:10, overflow:'hidden', marginBottom:20, textAlign:'left', animation:'ticketIn 0.4s 0.15s ease both' }}>
              <div style={{ height:2, background:`linear-gradient(90deg, ${raffle.color}, ${raffle.color}40)` }} />
              <div style={{ padding:'14px 18px', display:'flex', justifyContent:'space-between', alignItems:'center', gap:12 }}>
                <div>
                  <div style={{ fontFamily:'Space Mono,monospace', fontSize:7, color:raffle.color, letterSpacing:2, marginBottom:4 }}>YOUR ENTRY</div>
                  <div style={{ fontFamily:'Orbitron,monospace', fontSize:26, color:raffle.color, fontWeight:900, letterSpacing:3 }}>#{String(submitted.entryNum).padStart(4,'0')}</div>
                  {submitted.packCount > 1 && <div style={{ fontFamily:'Orbitron,monospace', fontSize:8, color:raffle.color, letterSpacing:2, marginTop:3 }}>{submitted.packCount}× ENTRIES</div>}
                  <div style={{ fontFamily:'Space Mono,monospace', fontSize:8, color:'#555', marginTop:5 }}>{submitted.name} · {submitted.city}</div>
                </div>
                <div style={{ borderLeft:'1px dashed rgba(255,255,255,0.08)', paddingLeft:16, display:'flex', flexDirection:'column', alignItems:'center', gap:1 }}>
                  <div style={{ fontFamily:'Space Mono,monospace', fontSize:7, color:'#444' }}>DEC</div>
                  <div style={{ fontFamily:'Bebas Neue,sans-serif', fontSize:24, color:raffle.color, lineHeight:1 }}>12</div>
                  <div style={{ fontFamily:'Space Mono,monospace', fontSize:7, color:'#444' }}>2026</div>
                </div>
              </div>
              <div style={{ borderTop:'1px dashed rgba(255,255,255,0.06)', padding:'7px 18px' }}>
                <div style={{ fontFamily:'Space Mono,monospace', fontSize:7, color:'#333', letterSpacing:1 }}>DRAW LIVE AT EVENT · WINNERS EMAILED</div>
              </div>
            </div>

            <button onClick={onClose} style={{ width:'100%', padding:'13px', background:raffle.color, border:'none', borderRadius:8, color:B.black, fontFamily:'Orbitron,monospace', fontSize:11, fontWeight:700, letterSpacing:2, cursor:'pointer', boxShadow:`0 0 24px ${raffle.color}40` }}>
              GOT IT →
            </button>
          </div>
        ) : (
          /* ── form ── */
          <div style={{ padding:'28px 28px 32px' }}>
            <div style={{ fontFamily:'Orbitron,monospace', fontSize:9, color:raffle.color, letterSpacing:3, marginBottom:6 }}>ENTER RAFFLE</div>
            <div style={{ fontFamily:'Bebas Neue,sans-serif', fontSize:24, color:B.white, letterSpacing:2, marginBottom:4 }}>{raffle.name}</div>
            <div style={{ fontFamily:'Space Mono,monospace', fontSize:9, color:'#555', marginBottom:16 }}>{raffle.edition} · {raffle.value}</div>

            {/* pack selector */}
            <div style={{ marginBottom:20 }}>
              <div style={{ fontFamily:'Space Mono,monospace', fontSize:8, color:'#444', letterSpacing:2, marginBottom:8 }}>SELECT ENTRY PACK</div>
              <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:6 }}>
                {PACKS.map(p => (
                  <button key={p.id} onClick={() => setPack(p)} style={{ position:'relative', padding:'10px 6px', background: pack.id === p.id ? `${raffle.color}18` : 'rgba(255,255,255,0.03)', border:`1px solid ${pack.id === p.id ? raffle.color : 'rgba(255,255,255,0.08)'}`, borderRadius:8, cursor:'pointer', textAlign:'center', transition:'all 0.15s' }}>
                    {p.badge && <div style={{ position:'absolute', top:-7, right:4, background:raffle.color, color:B.black, fontFamily:'Orbitron,monospace', fontSize:6, fontWeight:700, padding:'2px 5px', borderRadius:3, letterSpacing:1 }}>{p.badge}</div>}
                    <div style={{ fontFamily:'Orbitron,monospace', fontSize:11, color: pack.id === p.id ? raffle.color : '#555', fontWeight:700, letterSpacing:1 }}>{p.label}</div>
                    <div style={{ fontFamily:'Space Mono,monospace', fontSize:7, color: pack.id === p.id ? `${raffle.color}80` : '#333', marginTop:3 }}>{p.count}× odds</div>
                  </button>
                ))}
              </div>
            </div>

            <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10 }}>
                <div><label style={lbl}>FULL NAME</label><input value={form.name}  onChange={inp('name')}  placeholder="Your name" style={is} onFocus={foc} onBlur={blur} /></div>
                <div><label style={lbl}>CITY</label>     <input value={form.city}  onChange={inp('city')}  placeholder="Lagos…"    style={is} onFocus={foc} onBlur={blur} /></div>
              </div>
              <div><label style={lbl}>EMAIL ADDRESS</label><input value={form.email} onChange={inp('email')} type="email" placeholder="you@email.com" style={is} onFocus={foc} onBlur={blur} /></div>
              <div><label style={lbl}>PHONE NUMBER</label> <input value={form.phone} onChange={inp('phone')} type="tel"   placeholder="+234 …"        style={is} onFocus={foc} onBlur={blur} /></div>
            </div>

            <button onClick={handleSubmit} style={{ width:'100%', marginTop:18, padding:'14px', background: ok ? `linear-gradient(90deg, ${raffle.color}, ${raffle.color}BB)` : '#1a1a1a', border:'none', borderRadius:8, color: ok ? B.black : '#444', fontFamily:'Bebas Neue,sans-serif', fontSize:20, letterSpacing:3, cursor: ok ? 'pointer' : 'default', transition:'all 0.2s', boxShadow: ok ? `0 0 28px ${raffle.color}30` : 'none' }}>
              ENTER WITH {pack.count} {pack.count === 1 ? 'ENTRY' : 'ENTRIES'} →
            </button>
            <div style={{ fontFamily:'Space Mono,monospace', fontSize:8, color:'#333', textAlign:'center', marginTop:10, letterSpacing:1 }}>One pack per person · Draw live Dec 12</div>
          </div>
        )}
      </div>
    </>
  )
}

// ── winner overlay ─────────────────────────────────────────────────────────────────
function WinnerOverlay({ raffle, winner, onClose }) {
  const dots = Array.from({ length: 24 }, (_, i) => ({
    x: Math.random() * 100, y: Math.random() * 100,
    color: [B.amber, B.neonCyan, B.neonMagenta, B.neonLime][i % 4],
    size: 4 + Math.random() * 8,
    dur: 1.5 + Math.random() * 2,
  }))

  return (
    <>
      <div onClick={onClose} style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.88)', zIndex:300, backdropFilter:'blur(8px)' }} />
      <div style={{ position:'fixed', inset:0, zIndex:301, pointerEvents:'none', overflow:'hidden' }}>
        {dots.map((d, i) => (
          <div key={i} style={{ position:'absolute', left:`${d.x}%`, top:`${d.y}%`, width:d.size, height:d.size, background:d.color, borderRadius:'50%', opacity:0.7, animation:`confettiFall ${d.dur}s ease-in infinite`, animationDelay:`${Math.random() * 2}s` }} />
        ))}
      </div>

      <div style={{ position:'fixed', top:'50%', left:'50%', transform:'translate(-50%,-50%)', width:'min(480px,94vw)', background:'#080810', border:`2px solid ${raffle.color}80`, borderRadius:20, zIndex:302, textAlign:'center', padding:'44px 36px', overflow:'hidden' }}>
        <div style={{ position:'absolute', top:0, left:0, right:0, height:3, background:`linear-gradient(90deg, transparent, ${raffle.color}, transparent)` }} />
        <div style={{ fontFamily:'Orbitron,monospace', fontSize:10, color:raffle.color, letterSpacing:4, marginBottom:12 }}>🎉 WE HAVE A WINNER</div>
        <div style={{ fontFamily:'Bebas Neue,sans-serif', fontSize:'clamp(42px,10vw,72px)', color:B.white, lineHeight:0.9, marginBottom:4 }}>{winner.name}</div>
        <div style={{ fontFamily:'Space Mono,monospace', fontSize:11, color:'#666', marginBottom:24 }}>{winner.city}</div>
        <div style={{ background:`${raffle.color}12`, border:`1px solid ${raffle.color}40`, borderRadius:12, padding:'20px', marginBottom:24 }}>
          <div style={{ fontFamily:'Space Mono,monospace', fontSize:8, color:'#444', letterSpacing:3, marginBottom:6 }}>WINNING ENTRY</div>
          <div style={{ fontFamily:'Orbitron,monospace', fontSize:36, color:raffle.color, fontWeight:900 }}>#{String(winner.entryNum).padStart(4,'0')}</div>
        </div>
        <div style={{ fontFamily:'Bebas Neue,sans-serif', fontSize:16, color:'#777', letterSpacing:2, marginBottom:4 }}>{raffle.name}</div>
        <div style={{ fontFamily:'Space Mono,monospace', fontSize:9, color:'#444', marginBottom:28 }}>{raffle.edition}</div>
        <button onClick={onClose} style={{ padding:'12px 32px', background:'transparent', border:`1px solid ${raffle.color}40`, borderRadius:8, color:raffle.color, fontFamily:'Space Mono,monospace', fontSize:10, cursor:'pointer', letterSpacing:2 }}>CLOSE</button>
      </div>
    </>
  )
}

// ── ticket stub (shown in card when entered) ─────────────────────────────────────────────
function TicketStub({ raffle, entry }) {
  return (
    <div style={{ background:`${raffle.color}08`, border:`1px solid ${raffle.color}35`, borderRadius:8, overflow:'hidden', animation:'ticketIn 0.35s ease' }}>
      <div style={{ height:2, background:`linear-gradient(90deg, ${raffle.color}, ${raffle.color}30)` }} />
      <div style={{ padding:'10px 14px', display:'flex', justifyContent:'space-between', alignItems:'center', gap:10 }}>
        <div>
          <div style={{ fontFamily:'Space Mono,monospace', fontSize:7, color:raffle.color, letterSpacing:2, marginBottom:3 }}>YOUR ENTRY</div>
          <div style={{ fontFamily:'Orbitron,monospace', fontSize:20, color:raffle.color, fontWeight:900, letterSpacing:2 }}>#{String(entry.entryNum).padStart(4,'0')}</div>
          {(entry.packCount || 1) > 1 && <div style={{ display:'inline-block', background:`${raffle.color}20`, borderRadius:4, padding:'2px 7px', fontFamily:'Orbitron,monospace', fontSize:7, color:raffle.color, marginTop:3, letterSpacing:1 }}>{entry.packCount}× ENTRIES</div>}
          <div style={{ fontFamily:'Space Mono,monospace', fontSize:7.5, color:'#444', marginTop:3 }}>{entry.name}</div>
        </div>
        <div style={{ borderLeft:'1px dashed rgba(255,255,255,0.07)', paddingLeft:12, display:'flex', flexDirection:'column', alignItems:'center', gap:0 }}>
          <div style={{ fontFamily:'Space Mono,monospace', fontSize:6, color:'#333' }}>DEC</div>
          <div style={{ fontFamily:'Bebas Neue,sans-serif', fontSize:20, color:raffle.color, lineHeight:1 }}>12</div>
          <div style={{ fontFamily:'Space Mono,monospace', fontSize:6, color:'#333' }}>2026</div>
        </div>
      </div>
      <div style={{ borderTop:'1px dashed rgba(255,255,255,0.05)', padding:'5px 14px' }}>
        <div style={{ fontFamily:'Space Mono,monospace', fontSize:6.5, color:'#2a2a2a', letterSpacing:1 }}>✓ CONFIRMED · DRAW LIVE AT EVENT</div>
      </div>
    </div>
  )
}

// ── raffle card ───────────────────────────────────────────────────────────────────
function RaffleCard({ raffle, entered, count, spinNum, isSpinning, winner, onEnter, onDraw }) {
  const pct = Math.min(100, (count / raffle.maxEntries) * 100)
  return (
    <div style={{ background:'rgba(255,255,255,0.03)', border:`1px solid ${winner ? raffle.color+'60' : 'rgba(255,255,255,0.08)'}`, borderRadius:14, overflow:'hidden', display:'flex', flexDirection:'column', transition:'border-color 0.3s' }}>
      <div style={{ height:3, background:`linear-gradient(90deg, ${raffle.color}, ${raffle.color}30)` }} />

      {/* visual */}
      <div style={{ height:160, background:`radial-gradient(ellipse at 50% 60%, ${raffle.color}18 0%, transparent 65%)`, display:'flex', alignItems:'center', justifyContent:'center', position:'relative', flexDirection:'column', gap:4 }}>
        <div style={{ fontFamily:'Bebas Neue,sans-serif', fontSize:56, color:`${raffle.color}25`, lineHeight:1, position:'absolute' }}>WIN</div>
        {isSpinning ? (
          <div style={{ textAlign:'center', zIndex:1 }}>
            <div style={{ fontFamily:'Orbitron,monospace', fontSize:9, color:raffle.color, letterSpacing:3, marginBottom:4 }}>DRAWING…</div>
            <div style={{ fontFamily:'Orbitron,monospace', fontSize:48, color:raffle.color, fontWeight:900, letterSpacing:4, filter:'blur(1px)', transition:'none' }}>
              #{String(spinNum).padStart(4,'0')}
            </div>
          </div>
        ) : winner ? (
          <div style={{ textAlign:'center', zIndex:1 }}>
            <div style={{ fontFamily:'Space Mono,monospace', fontSize:8, color:raffle.color, letterSpacing:3, marginBottom:4 }}>WINNER</div>
            <div style={{ fontFamily:'Bebas Neue,sans-serif', fontSize:22, color:B.white }}>{winner.name}</div>
            <div style={{ fontFamily:'Orbitron,monospace', fontSize:14, color:raffle.color }}>#{String(winner.entryNum).padStart(4,'0')}</div>
          </div>
        ) : (
          <div style={{ fontFamily:'Orbitron,monospace', fontSize:28, color:raffle.color, fontWeight:900, zIndex:1, opacity:0.6 }}>{raffle.value}</div>
        )}
      </div>

      <div style={{ padding:'18px 20px 22px', flex:1, display:'flex', flexDirection:'column', gap:10 }}>
        <div>
          <div style={{ fontFamily:'Bebas Neue,sans-serif', fontSize:20, color:B.white, letterSpacing:1, lineHeight:1.1 }}>{raffle.name}</div>
          <div style={{ fontFamily:'Space Mono,monospace', fontSize:8, color:'#555', marginTop:3 }}>{raffle.edition}</div>
        </div>

        {/* entry bar */}
        <div>
          <div style={{ display:'flex', justifyContent:'space-between', marginBottom:6 }}>
            <span style={{ fontFamily:'Space Mono,monospace', fontSize:8, color:'#555', letterSpacing:1 }}>{count} ENTERED</span>
            <span style={{ fontFamily:'Space Mono,monospace', fontSize:8, color:'#444' }}>{raffle.maxEntries} MAX</span>
          </div>
          <div style={{ height:3, background:'rgba(255,255,255,0.06)', borderRadius:2 }}>
            <div style={{ height:'100%', width:`${pct}%`, background:`linear-gradient(90deg, ${raffle.color}, ${raffle.color}80)`, borderRadius:2, transition:'width 0.4s' }} />
          </div>
        </div>

        {/* status + cta */}
        {winner ? (
          <button onClick={onDraw} style={{ padding:'11px', background:`${raffle.color}15`, border:`1px solid ${raffle.color}40`, borderRadius:8, cursor:'pointer', fontFamily:'Space Mono,monospace', fontSize:9, color:raffle.color, letterSpacing:2 }}>
            VIEW WINNER →
          </button>
        ) : entered ? (
          <div style={{ display:'flex', flexDirection:'column', gap:6 }}>
            <TicketStub raffle={raffle} entry={entered} />
            <button onClick={onDraw} style={{ padding:'9px', background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.1)', borderRadius:8, cursor: isSpinning ? 'wait' : 'pointer', fontFamily:'Space Mono,monospace', fontSize:8, color: isSpinning ? '#555' : '#888', letterSpacing:1 }} disabled={isSpinning}>
              {isSpinning ? 'DRAWING…' : 'PREVIEW DRAW'}
            </button>
          </div>
        ) : (
          <div style={{ display:'flex', flexDirection:'column', gap:6 }}>
            <button onClick={onEnter} style={{ padding:'12px', background:`linear-gradient(90deg, ${raffle.color}, ${raffle.color}BB)`, border:'none', borderRadius:8, cursor:'pointer', fontFamily:'Bebas Neue,sans-serif', fontSize:18, letterSpacing:3, color:B.black, boxShadow:`0 0 24px ${raffle.color}25`, transition:'all 0.2s' }}
              onMouseEnter={e => e.currentTarget.style.boxShadow=`0 0 40px ${raffle.color}50`}
              onMouseLeave={e => e.currentTarget.style.boxShadow=`0 0 24px ${raffle.color}25`}
            >ENTER RAFFLE →</button>
            <button onClick={onDraw} style={{ padding:'9px', background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.08)', borderRadius:8, cursor: isSpinning ? 'wait' : 'pointer', fontFamily:'Space Mono,monospace', fontSize:8, color:'#555', letterSpacing:1 }} disabled={isSpinning}>
              {isSpinning ? 'DRAWING…' : 'PREVIEW DRAW'}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

// ── main section ───────────────────────────────────────────────────────────────────
export default function Raffle() {
  const [entries,    setEntries]    = useState(loadEntries)
  const [winners,    setWinners]    = useState(loadWinners)
  const [counts,     setCounts]     = useState(() => {
    const saved = loadCounts()
    const init  = {}
    RAFFLES.forEach(r => { init[r.id] = saved[r.id] ?? r.seedCount })
    return init
  })
  const [spinNums,   setSpinNums]   = useState({})
  const [spinning,   setSpinning]   = useState({})
  const [entering,   setEntering]   = useState(null)
  const [viewing,    setViewing]    = useState(null)
  const [countdown,  setCountdown]  = useState(calcCountdown)

  useEffect(() => {
    const id = setInterval(() => setCountdown(calcCountdown()), 1000)
    return () => clearInterval(id)
  }, [])

  async function triggerDraw(raffleId) {
    if (spinning[raffleId]) return
    setSpinning(s => ({ ...s, [raffleId]: true }))

    for (let i = 0; i < 32; i++) {
      setSpinNums(s => ({ ...s, [raffleId]: Math.floor(Math.random() * 899) + 100 }))
      await sleep(28 + i * 9)
    }

    const localEntry = entries[raffleId]
    const pool = [...SEED_POOL.map((p, i) => ({ ...p, entryNum: 100 + i * 43 })), ...(localEntry ? [localEntry] : [])]
    const pick = pool[Math.floor(Math.random() * pool.length)]
    const win  = { name: pick.name, city: pick.city, entryNum: pick.entryNum }

    setSpinNums(s => ({ ...s, [raffleId]: win.entryNum }))
    await sleep(300)

    const next = { ...winners, [raffleId]: win }
    setWinners(next)
    setSpinning(s => ({ ...s, [raffleId]: false }))
    setViewing(RAFFLES.find(r => r.id === raffleId))
    try { localStorage.setItem('sf26_raffle_draws', JSON.stringify(next)) } catch {}
  }

  function handleEnter(raffle, entry) {
    const nextEntries = { ...entries, [raffle.id]: entry }
    setEntries(nextEntries)
    try { localStorage.setItem('sf26_raffle_entries', JSON.stringify(nextEntries)) } catch {}

    const nextCounts = { ...counts, [raffle.id]: counts[raffle.id] + (entry.packCount || 1) }
    setCounts(nextCounts)
    try { localStorage.setItem('sf26_raffle_counts', JSON.stringify(nextCounts)) } catch {}

    logReferralConversion('raffle', { raffle: raffle.name })
  }

  const totalEntries = Object.values(counts).reduce((a, b) => a + b, 0)

  return (
    <section id="raffle" style={{ position:'relative', background:`linear-gradient(180deg, ${B.void} 0%, ${B.black} 100%)`, padding:'100px 24px', overflow:'hidden' }}>
      <GrainOverlay />
      <Egg id="egg-089" corner="top-right" />
      <Egg id="egg-090" corner="bottom-left" />
      <div style={{ position:'absolute', top:'30%', left:'50%', transform:'translate(-50%,-50%)', width:700, height:500, background:`radial-gradient(ellipse, ${B.amber}07 0%, transparent 70%)`, filter:'blur(80px)', pointerEvents:'none' }} />

      <div style={{ position:'relative', zIndex:10, maxWidth:1000, margin:'0 auto' }}>

        {/* header */}
        <div style={{ textAlign:'center', marginBottom:52 }}>
          <SectionTag>EVENT DAY RAFFLES</SectionTag>
          <div style={{ fontFamily:"'Bebas Neue', sans-serif", fontSize:'clamp(44px,8vw,84px)', color:B.white, lineHeight:0.88, marginBottom:12 }}>
            ENTER.<br /><span style={{ color:B.amber }}>WIN. COLLECT.</span>
          </div>
          <p style={{ fontFamily:"'Syne', sans-serif", fontSize:14, color:'#777', maxWidth:440, margin:'0 auto 16px' }}>
            Four exclusive draws. One entry per person. Winners announced live at Sneakers Fest '26.
          </p>

          {/* countdown */}
          <div style={{ display:'inline-flex', gap:8, alignItems:'center', background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.07)', borderRadius:12, padding:'12px 20px', marginBottom:12 }}>
            {[
              { n: countdown.days,    l: 'DAYS' },
              { n: countdown.hours,   l: 'HRS'  },
              { n: countdown.minutes, l: 'MIN'  },
              { n: countdown.seconds, l: 'SEC'  },
            ].map(({ n, l }, i) => (
              <div key={l} style={{ display:'flex', alignItems:'center', gap: i < 3 ? 8 : 0 }}>
                <div style={{ textAlign:'center' }}>
                  <div style={{ fontFamily:'Orbitron,monospace', fontWeight:900, fontSize:'clamp(20px,4vw,28px)', color:B.amber, lineHeight:1, minWidth:38, textShadow:`0 0 16px ${B.amber}50` }}>
                    {String(n).padStart(2,'0')}
                  </div>
                  <div style={{ fontFamily:'Space Mono,monospace', fontSize:6.5, color:'#444', letterSpacing:2, marginTop:3 }}>{l}</div>
                </div>
                {i < 3 && <div style={{ fontFamily:'Orbitron,monospace', fontSize:18, color:`${B.amber}50`, marginBottom:16 }}>:</div>}
              </div>
            ))}
          </div>

          <div style={{ fontFamily:'Space Mono,monospace', fontSize:9, color:'#444', letterSpacing:2 }}>
            UNTIL THE DRAW · {totalEntries.toLocaleString()} total entries so far
          </div>
        </div>

        {/* grid */}
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(220px, 1fr))', gap:16 }}>
          {RAFFLES.map(raffle => (
            <RaffleCard
              key={raffle.id}
              raffle={raffle}
              entered={entries[raffle.id] || null}
              count={counts[raffle.id]}
              spinNum={spinNums[raffle.id] || 0}
              isSpinning={!!spinning[raffle.id]}
              winner={winners[raffle.id] || null}
              onEnter={() => setEntering(raffle)}
              onDraw={() => winners[raffle.id] ? setViewing(raffle) : triggerDraw(raffle.id)}
            />
          ))}
        </div>

        {Object.keys(entries).length > 0 && (
          <div style={{ marginTop:28, padding:'20px 24px', background:'rgba(255,255,255,0.02)', border:'1px solid rgba(255,255,255,0.06)', borderRadius:12 }}>
            <div style={{ fontFamily:'Orbitron,monospace', fontSize:8, color:'#444', letterSpacing:3, marginBottom:12 }}>MY ENTRIES</div>
            <div style={{ display:'flex', flexWrap:'wrap', gap:8, marginBottom:12 }}>
              {RAFFLES.filter(r => entries[r.id]).map(r => (
                <div key={r.id} style={{ background:`${r.color}10`, border:`1px solid ${r.color}30`, borderRadius:8, padding:'8px 14px', display:'flex', alignItems:'center', gap:8 }}>
                  <div style={{ fontFamily:'Orbitron,monospace', fontSize:9, color:r.color }}>#{String(entries[r.id].entryNum).padStart(4,'0')}</div>
                  <div style={{ width:1, height:12, background:'rgba(255,255,255,0.08)' }} />
                  <div style={{ fontFamily:'Space Mono,monospace', fontSize:7, color:'#555' }}>{r.name.split(' ').slice(0,3).join(' ')}</div>
                  {(entries[r.id].packCount || 1) > 1 && (
                    <div style={{ background:`${r.color}25`, borderRadius:4, padding:'2px 6px', fontFamily:'Orbitron,monospace', fontSize:6, color:r.color }}>{entries[r.id].packCount}×</div>
                  )}
                </div>
              ))}
            </div>
            <div style={{ fontFamily:'Space Mono,monospace', fontSize:8, color:'#333', letterSpacing:1 }}>
              {RAFFLES.filter(r => entries[r.id]).reduce((s,r) => s + (entries[r.id].packCount || 1), 0)} TOTAL ENTRIES · {Object.keys(entries).length} OF {RAFFLES.length} RAFFLES ENTERED
            </div>
          </div>
        )}

        <div style={{ textAlign:'center', marginTop:24, fontFamily:'Space Mono,monospace', fontSize:8, color:'#333', letterSpacing:2 }}>
          DRAWS CONDUCTED LIVE ON DEC 12 · WINNERS CONTACTED VIA EMAIL
        </div>
      </div>

      {entering && <EntryModal raffle={entering} onEnter={entry => handleEnter(entering, entry)} onClose={() => setEntering(null)} />}
      {viewing  && winners[viewing.id] && <WinnerOverlay raffle={viewing} winner={winners[viewing.id]} onClose={() => setViewing(null)} />}
    </section>
  )
}
