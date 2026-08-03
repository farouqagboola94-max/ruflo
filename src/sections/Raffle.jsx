import { useState, useEffect, useCallback } from 'react'
import { B } from '../tokens'
import { GrainOverlay, SectionTag } from '../components/Shared'
import { logReferralConversion } from '../lib/referral'
import Egg from '../components/Egg'

const RAFFLES = [
  { id:'rfl1', name:'Air Jordan 4 Retro Bred',    edition:'Size 43 · Deadstock',  value:'₦120,000', color:B.amber, maxEntries:500 },
  { id:'rfl2', name:"SF '26 Exclusive Bundle",    edition:'Hoodie + Cap + Tote',   value:'₦28,000',  color:B.neonCyan, maxEntries:500 },
  { id:'rfl3', name:'Nike SB Dunk Low Pro',        edition:'Size 42 · Deadstock',  value:'₦95,000',  color:B.neonMagenta, maxEntries:500 },
  { id:'rfl4', name:'VIP Ticket Upgrade',          edition:'General → VIP Access', value:'₦25,000',  color:B.neonLime, maxEntries:300 },
]

const DRAW_DATE = new Date('2026-12-12T12:00:00')
function calcCountdown() {
  const diff = DRAW_DATE - Date.now()
  if (diff <= 0) return { days:0, hours:0, minutes:0, seconds:0 }
  return {
    days:    Math.floor(diff / 86400000),
    hours:   Math.floor((diff % 86400000) / 3600000),
    minutes: Math.floor((diff % 3600000)  / 60000),
    seconds: Math.floor((diff % 60000)    / 1000),
  }
}

const CONFETTI_DOTS = Array.from({ length:18 }, (_, i) => ({
  x: 5 + (i * 5.5), color:[B.amber,B.neonCyan,B.neonMagenta,B.neonLime][i%4],
  size:3+(i%5), dur:1.2+(i%4)*0.25, delay:(i%6)*0.08,
}))

function loadEntries()  { try { return JSON.parse(localStorage.getItem('sf26_raffle_entries') || '{}') } catch { return {} } }

function EntryModal({ raffle, onEnter, onClose }) {
  const [form,      setForm]      = useState({ name:'', email:'', phone:'', city:'' })
  const [submitted, setSubmitted] = useState(null)
  const [busy,      setBusy]      = useState(false)
  const [error,     setError]     = useState('')
  const inp  = k => e => setForm(f => ({ ...f, [k]:e.target.value }))
  const ok   = form.name.trim() && form.email.includes('@') && form.phone.trim() && form.city.trim()
  const is   = { width:'100%', padding:'11px 14px', background:'rgba(255,255,255,0.05)', border:'1px solid rgba(255,255,255,0.1)', borderRadius:7, color:B.white, fontFamily:'Space Mono,monospace', fontSize:12, outline:'none', boxSizing:'border-box', transition:'border-color 0.2s' }
  const lbl  = { fontFamily:'Space Mono,monospace', fontSize:8, color:'#555', letterSpacing:2, display:'block', marginBottom:6 }
  const foc  = e => e.target.style.borderColor = `${raffle.color}60`
  const blur = e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'

  async function handleSubmit() {
    if (!ok || busy) return
    setBusy(true); setError('')
    try {
      const r = await fetch('/.netlify/functions/raffle-enter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ raffleId: raffle.id, email: form.email.trim(), name: form.name.trim() }),
      })
      const data = await r.json().catch(() => ({}))
      if (!r.ok) { setError(data.error || 'Could not record your entry'); return }

      // The entry number is the server's, so the stub matches the record.
      const entry = {
        name: form.name.trim(), city: form.city.trim(), email: form.email.trim(),
        phone: form.phone.trim(), entryNum: data.entryNum,
        alreadyEntered: Boolean(data.alreadyEntered),
        enteredAt: new Date().toISOString(),
      }
      setSubmitted(entry)
      onEnter(entry)
    } catch {
      setError('Network error. Check your connection.')
    } finally { setBusy(false) }
  }

  return (
    <>
      <div onClick={submitted ? undefined : onClose} style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.82)', zIndex:200, backdropFilter:'blur(6px)' }} />
      {submitted && (
        <div style={{ position:'fixed', inset:0, zIndex:201, pointerEvents:'none', overflow:'hidden' }}>
          {CONFETTI_DOTS.map((d, i) => (
            <div key={i} style={{ position:'absolute', left:`${d.x}%`, top:'-10px', width:d.size, height:d.size, background:d.color, borderRadius:'50%', animation:`confettiFall ${d.dur}s ${d.delay}s ease-in forwards` }} />
          ))}
        </div>
      )}
      <div style={{ position:'fixed', top:'50%', left:'50%', transform:'translate(-50%,-50%)', width:'min(440px,94vw)', background:'#0A0A10', border:`1px solid ${raffle.color}${submitted?'80':'30'}`, borderRadius:16, zIndex:202, overflow:'hidden', transition:'border-color 0.4s' }}>
        <div style={{ height:3, background:`linear-gradient(90deg,${raffle.color},${raffle.color}40)` }} />
        {submitted ? (
          <div style={{ padding:'32px 28px', textAlign:'center', animation:'fadeUp 0.3s ease' }}>
            <div style={{ width:52, height:52, borderRadius:'50%', background:`${B.neonLime}12`, border:`2px solid ${B.neonLime}`, display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 16px' }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M5 13l4 4L19 7" stroke={B.neonLime} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </div>
            <div style={{ fontFamily:'Orbitron,monospace', fontSize:9, color:B.neonLime, letterSpacing:3, marginBottom:4 }}>YOU'RE IN</div>
            <div style={{ fontFamily:'Bebas Neue,sans-serif', fontSize:28, color:B.white, marginBottom:20 }}>ENTRY CONFIRMED</div>
            <div style={{ background:`${raffle.color}08`, border:`1px solid ${raffle.color}40`, borderRadius:10, overflow:'hidden', marginBottom:20, textAlign:'left', animation:'ticketIn 0.4s 0.15s ease both' }}>
              <div style={{ height:2, background:`linear-gradient(90deg,${raffle.color},${raffle.color}40)` }} />
              <div style={{ padding:'14px 18px', display:'flex', justifyContent:'space-between', alignItems:'center', gap:12 }}>
                <div>
                  <div style={{ fontFamily:'Space Mono,monospace', fontSize:7, color:raffle.color, letterSpacing:2, marginBottom:4 }}>YOUR ENTRY</div>
                  <div style={{ fontFamily:'Orbitron,monospace', fontSize:26, color:raffle.color, fontWeight:900, letterSpacing:3 }}>#{String(submitted.entryNum).padStart(4,'0')}</div>
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
            <button onClick={onClose} style={{ width:'100%', padding:'13px', background:raffle.color, border:'none', borderRadius:8, color:B.black, fontFamily:'Orbitron,monospace', fontSize:11, fontWeight:700, letterSpacing:2, cursor:'pointer', boxShadow:`0 0 24px ${raffle.color}40` }}>GOT IT →</button>
          </div>
        ) : (
          <div style={{ padding:'28px 28px 32px' }}>
            <div style={{ fontFamily:'Orbitron,monospace', fontSize:9, color:raffle.color, letterSpacing:3, marginBottom:6 }}>ENTER RAFFLE</div>
            <div style={{ fontFamily:'Bebas Neue,sans-serif', fontSize:24, color:B.white, letterSpacing:2, marginBottom:4 }}>{raffle.name}</div>
            <div style={{ fontFamily:'Space Mono,monospace', fontSize:9, color:'#555', marginBottom:16 }}>{raffle.edition} · {raffle.value}</div>
            <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10 }}>
                <div><label style={lbl}>FULL NAME</label><input value={form.name}  onChange={inp('name')}  placeholder="Your name" style={is} onFocus={foc} onBlur={blur} /></div>
                <div><label style={lbl}>CITY</label>     <input value={form.city}  onChange={inp('city')}  placeholder="Lagos…"    style={is} onFocus={foc} onBlur={blur} /></div>
              </div>
              <div><label style={lbl}>EMAIL ADDRESS</label><input value={form.email} onChange={inp('email')} type="email" placeholder="you@email.com" style={is} onFocus={foc} onBlur={blur} /></div>
              <div><label style={lbl}>PHONE NUMBER</label> <input value={form.phone} onChange={inp('phone')} type="tel"   placeholder="+234 …"        style={is} onFocus={foc} onBlur={blur} /></div>
            </div>
            {error && <div style={{ marginTop:14, fontFamily:'Space Mono,monospace', fontSize:9, color:B.neonMagenta }}>{error}</div>}
            <button onClick={handleSubmit} disabled={busy} style={{ width:'100%', marginTop:18, padding:'14px', background:ok?`linear-gradient(90deg,${raffle.color},${raffle.color}BB)`:'#1a1a1a', border:'none', borderRadius:8, color:ok?B.black:'#444', fontFamily:'Bebas Neue,sans-serif', fontSize:20, letterSpacing:3, cursor:ok?'pointer':'default', transition:'all 0.2s', boxShadow:ok?`0 0 28px ${raffle.color}30`:'none' }}>
              {busy ? 'ENTERING…' : 'ENTER THE DRAW →'}
            </button>
            <div style={{ fontFamily:'Space Mono,monospace', fontSize:8, color:'#333', textAlign:'center', marginTop:10, letterSpacing:1 }}>One entry per person · Draw live Dec 12</div>
          </div>
        )}
      </div>
    </>
  )
}

function TicketStub({ raffle, entry }) {
  return (
    <div style={{ background:`${raffle.color}08`, border:`1px solid ${raffle.color}35`, borderRadius:8, overflow:'hidden', animation:'ticketIn 0.35s ease' }}>
      <div style={{ height:2, background:`linear-gradient(90deg,${raffle.color},${raffle.color}30)` }} />
      <div style={{ padding:'10px 14px', display:'flex', justifyContent:'space-between', alignItems:'center', gap:10 }}>
        <div>
          <div style={{ fontFamily:'Space Mono,monospace', fontSize:7, color:raffle.color, letterSpacing:2, marginBottom:3 }}>YOUR ENTRY</div>
          <div style={{ fontFamily:'Orbitron,monospace', fontSize:20, color:raffle.color, fontWeight:900, letterSpacing:2 }}>#{String(entry.entryNum).padStart(4,'0')}</div>
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

function RaffleCard({ raffle, entered, count = 0, onEnter }) {
  const pct = Math.min(100, (count / raffle.maxEntries) * 100)
  // Only fires on real numbers now; the counts used to start from a seed.
  const isFilling = pct > 65
  const isNearFull = pct > 80

  return (
    <div className="card-3d" style={{ background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.08)', borderRadius:14, overflow:'hidden', display:'flex', flexDirection:'column', transition:'border-color 0.3s' }}>
      <div style={{ height:3, background:`linear-gradient(90deg,${raffle.color},${raffle.color}30)` }} />
      <div style={{ height:160, background:`radial-gradient(ellipse at 50% 60%,${raffle.color}18 0%,transparent 65%)`, display:'flex', alignItems:'center', justifyContent:'center', position:'relative', flexDirection:'column', gap:4 }}>
        <div style={{ fontFamily:'Bebas Neue,sans-serif', fontSize:56, color:`${raffle.color}25`, lineHeight:1, position:'absolute' }}>WIN</div>
        <div style={{ fontFamily:'Orbitron,monospace', fontSize:28, color:raffle.color, fontWeight:900, zIndex:1, opacity:0.6 }}>{raffle.value}</div>
      </div>

      <div style={{ padding:'18px 20px 22px', flex:1, display:'flex', flexDirection:'column', gap:10 }}>
        <div>
          <div style={{ fontFamily:'Bebas Neue,sans-serif', fontSize:20, color:B.white, letterSpacing:1, lineHeight:1.1 }}>{raffle.name}</div>
          <div style={{ fontFamily:'Space Mono,monospace', fontSize:8, color:'#555', marginTop:3 }}>{raffle.edition}</div>
        </div>

        <div>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:6 }}>
            <span style={{ fontFamily:'Space Mono,monospace', fontSize:8, color:'#555', letterSpacing:1 }}>{count} ENTERED</span>
            <div style={{ display:'flex', alignItems:'center', gap:6 }}>
              {isFilling && (
                <span style={{ background:`${raffle.color}20`, border:`1px solid ${raffle.color}50`, borderRadius:3, padding:'1px 6px', fontFamily:'Orbitron,monospace', fontSize:6, color:raffle.color, letterSpacing:1 }}>FILLING FAST</span>
              )}
              <span style={{ fontFamily:'Space Mono,monospace', fontSize:8, color:'#444' }}>{raffle.maxEntries} MAX</span>
            </div>
          </div>
          <div style={{ height:3, background:'rgba(255,255,255,0.06)', borderRadius:2 }}>
            <div style={{ height:'100%', width:`${pct}%`, background:`linear-gradient(90deg,${raffle.color},${raffle.color}80)`, borderRadius:2, transition:'width 0.4s', animation:isNearFull?'barPulse 1.3s ease-in-out infinite':undefined }} />
          </div>
        </div>

        {entered ? (
          <div style={{ display:'flex', flexDirection:'column', gap:6 }}>
            <TicketStub raffle={raffle} entry={entered} />
            {/* No draw button. The winner is the organiser's to announce. */}
            <div style={{ fontFamily:'Space Mono,monospace', fontSize:7, color:'#444', letterSpacing:1, textAlign:'center' }}>
              WINNER DRAWN LIVE ON DEC 12
            </div>
          </div>
        ) : (
          <button onClick={onEnter} style={{ padding:'12px', background:`linear-gradient(90deg,${raffle.color},${raffle.color}BB)`, border:'none', borderRadius:8, cursor:'pointer', fontFamily:'Bebas Neue,sans-serif', fontSize:18, letterSpacing:3, color:B.black, boxShadow:`0 0 24px ${raffle.color}25`, transition:'all 0.2s' }}
            onMouseEnter={e => e.currentTarget.style.boxShadow=`0 0 40px ${raffle.color}50`}
            onMouseLeave={e => e.currentTarget.style.boxShadow=`0 0 24px ${raffle.color}25`}
          >ENTER RAFFLE →</button>
        )}
      </div>
    </div>
  )
}

export default function Raffle() {
  const [entries,      setEntries]      = useState(loadEntries)
  const [counts,       setCounts]       = useState({})
  const [entering,     setEntering]     = useState(null)
  const [countdown,    setCountdown]    = useState(calcCountdown)

  useEffect(() => {
    const id = setInterval(() => setCountdown(calcCountdown()), 1000)
    return () => clearInterval(id)
  }, [])

  // Entry counts come from the server. They used to start from hardcoded
  // seeds, which meant the total shown had never been true.
  const loadCounts = useCallback(async () => {
    try {
      const r = await fetch('/.netlify/functions/raffle-enter')
      if (r.ok) setCounts((await r.json()).counts || {})
    } catch { /* the cards just show no count */ }
  }, [])

  useEffect(() => { loadCounts() }, [loadCounts])

  function handleEnter(raffle, entry) {
    const nextEntries = { ...entries, [raffle.id]: entry }
    setEntries(nextEntries)
    try { localStorage.setItem('sf26_raffle_entries', JSON.stringify(nextEntries)) } catch {}
    loadCounts()
    logReferralConversion('raffle', { raffle: raffle.name })
  }

  const totalEntries = Object.values(counts).reduce((a, b) => a + b, 0)

  return (
    <section id="raffle" style={{ position:'relative', background:`linear-gradient(180deg,${B.void} 0%,${B.black} 100%)`, padding:'100px 24px', overflow:'hidden' }}>
      <style>{`
        @keyframes barPulse  { 0%,100%{ opacity:1 } 50%{ opacity:0.55 } }
        @keyframes tickFade  { from{ opacity:0;transform:translateY(4px) } to{ opacity:1;transform:translateY(0) } }
      `}</style>
      <GrainOverlay />
      <Egg id="egg-089" corner="top-right" />
      <Egg id="egg-090" corner="bottom-left" />
      <div style={{ position:'absolute', top:'30%', left:'50%', transform:'translate(-50%,-50%)', width:700, height:500, background:`radial-gradient(ellipse,${B.amber}07 0%,transparent 70%)`, filter:'blur(80px)', pointerEvents:'none' }} />

      <div style={{ position:'relative', zIndex:10, maxWidth:1000, margin:'0 auto' }}>

        {/* header */}
        <div style={{ textAlign:'center', marginBottom:52 }}>
          <SectionTag>EVENT DAY RAFFLES</SectionTag>
          <div className="reveal-3d text-3d" style={{ fontFamily:"'Bebas Neue', sans-serif", fontSize:'clamp(44px,8vw,84px)', color:B.white, lineHeight:0.88, marginBottom:12 }}>
            ENTER.<br /><span style={{ color:B.amber }}>WIN. COLLECT.</span>
          </div>
          <p style={{ fontFamily:"'Syne', sans-serif", fontSize:14, color:'#777', maxWidth:440, margin:'0 auto 16px' }}>
            Four exclusive draws. One entry per person. Winners announced live at Sneakers Fest '26.
          </p>

          {/* countdown */}
          <div className="card-3d" style={{ display:'inline-flex', gap:8, alignItems:'center', background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.07)', borderRadius:12, padding:'12px 20px', marginBottom:12 }}>
            {[{n:countdown.days,l:'DAYS'},{n:countdown.hours,l:'HRS'},{n:countdown.minutes,l:'MIN'},{n:countdown.seconds,l:'SEC'}].map(({ n, l }, i) => (
              <div key={l} style={{ display:'flex', alignItems:'center', gap:i<3?8:0 }}>
                <div style={{ textAlign:'center' }}>
                  <div style={{ fontFamily:'Orbitron,monospace', fontWeight:900, fontSize:'clamp(20px,4vw,28px)', color:B.amber, lineHeight:1, minWidth:38, textShadow:`0 0 16px ${B.amber}50` }}>{String(n).padStart(2,'0')}</div>
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
              key={raffle.id} raffle={raffle}
              entered={entries[raffle.id]||null}
              count={counts[raffle.id]}
              onEnter={() => setEntering(raffle)}
            />
          ))}
        </div>

        {Object.keys(entries).length > 0 && (
          <div className="card-3d" style={{ marginTop:28, padding:'20px 24px', background:'rgba(255,255,255,0.02)', border:'1px solid rgba(255,255,255,0.06)', borderRadius:12 }}>
            <div style={{ fontFamily:'Orbitron,monospace', fontSize:8, color:'#444', letterSpacing:3, marginBottom:12 }}>MY ENTRIES</div>
            <div style={{ display:'flex', flexWrap:'wrap', gap:8, marginBottom:12 }}>
              {RAFFLES.filter(r => entries[r.id]).map(r => (
                <div key={r.id} style={{ background:`${r.color}10`, border:`1px solid ${r.color}30`, borderRadius:8, padding:'8px 14px', display:'flex', alignItems:'center', gap:8 }}>
                  <div style={{ fontFamily:'Orbitron,monospace', fontSize:9, color:r.color }}>#{String(entries[r.id].entryNum).padStart(4,'0')}</div>
                  <div style={{ width:1, height:12, background:'rgba(255,255,255,0.08)' }} />
                  <div style={{ fontFamily:'Space Mono,monospace', fontSize:7, color:'#555' }}>{r.name.split(' ').slice(0,3).join(' ')}</div>
                </div>
              ))}
            </div>
            <div style={{ fontFamily:'Space Mono,monospace', fontSize:8, color:'#333', letterSpacing:1 }}>
              {Object.keys(entries).length} OF {RAFFLES.length} RAFFLES ENTERED · ONE ENTRY EACH
            </div>
          </div>
        )}

        <div style={{ textAlign:'center', marginTop:24, fontFamily:'Space Mono,monospace', fontSize:8, color:'#333', letterSpacing:2 }}>
          DRAWS CONDUCTED LIVE ON DEC 12 · WINNERS CONTACTED VIA EMAIL
        </div>
      </div>

      {entering && <EntryModal raffle={entering} onEnter={entry => handleEnter(entering, entry)} onClose={() => setEntering(null)} />}
    </section>
  )
}
