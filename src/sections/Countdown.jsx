import { useState, useEffect, useRef } from 'react'
import { B } from '../tokens'
import { GrainOverlay, SectionTag } from '../components/Shared'
import Egg from '../components/Egg'

const EVENT_DATE = new Date('2026-12-12T12:00:00')
const RSVP_SEED  = 1247
const RSVP_KEY   = 'sf26_rsvp_count'
const JOINED_KEY = 'sf26_rsvp_joined'

const MILESTONES = [1500, 2000, 2500]

const JOIN_POOL = [
  { name: 'Tunde O.',  city: 'Lagos Island' },
  { name: 'Chisom A.', city: 'Lekki' },
  { name: 'Adaeze N.', city: 'Ikeja' },
  { name: 'Emeka K.',  city: 'Abuja' },
  { name: 'Seun B.',   city: 'VI' },
  { name: 'Ngozi F.',  city: 'Surulere' },
  { name: 'Dayo L.',   city: 'Yaba' },
  { name: 'Kemi R.',   city: 'Port Harcourt' },
  { name: 'Bola J.',   city: 'Ikoyi' },
  { name: 'Femi S.',   city: 'Festac' },
]

// ── countdown logic ──────────────────────────────────────────────────────────────────────────────
function useCountdown() {
  const [t, setT] = useState({ days:0, hours:0, minutes:0, seconds:0 })
  useEffect(() => {
    const tick = () => {
      const diff = EVENT_DATE - Date.now()
      if (diff <= 0) { setT({ days:0, hours:0, minutes:0, seconds:0 }); return }
      setT({
        days:    Math.floor(diff / 86400000),
        hours:   Math.floor((diff % 86400000) / 3600000),
        minutes: Math.floor((diff % 3600000)  / 60000),
        seconds: Math.floor((diff % 60000)    / 1000),
      })
    }
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [])
  return t
}

// ── flip digit card ──────────────────────────────────────────────────────────────────────────────────
function FlipUnit({ value, label, color }) {
  const padded  = String(value).padStart(2, '0')
  const [pop, setPop]       = useState(false)
  const [bright, setBright] = useState(false)
  const prev = useRef(padded)

  useEffect(() => {
    if (padded !== prev.current) {
      prev.current = padded
      setPop(true)
      setBright(true)
      const t1 = setTimeout(() => setPop(false),    350)
      const t2 = setTimeout(() => setBright(false), 600)
      return () => { clearTimeout(t1); clearTimeout(t2) }
    }
  }, [padded])

  return (
    <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:10 }}>
      <div style={{
        position:'relative',
        background:'linear-gradient(180deg, #0D0D18 0%, #080810 100%)',
        border:`1px solid ${bright ? color+'80' : color+'28'}`,
        borderRadius:10,
        padding:'clamp(14px,3vw,22px) clamp(18px,4vw,30px)',
        boxShadow:`0 0 0 1px ${color}10, 0 20px 60px rgba(0,0,0,0.85)${bright ? `, 0 0 40px ${color}20` : ''}`,
        transform: pop ? 'scale(1.06)' : 'scale(1)',
        transition:'transform 0.18s cubic-bezier(0.34,1.56,0.64,1), border-color 0.3s, box-shadow 0.3s',
      }}>
        <div style={{ position:'absolute', top:0, left:10, right:10, height:1, background:`linear-gradient(90deg, transparent, ${color}${bright ? 'AA' : '28'}, transparent)`, transition:'background 0.3s' }} />
        <div style={{ position:'absolute', left:0, right:0, top:'50%', height:'1px', background:'rgba(0,0,0,0.9)', zIndex:2 }} />
        <div style={{
          fontFamily:'Orbitron,monospace', fontWeight:900,
          fontSize:'clamp(48px,10vw,84px)', lineHeight:1,
          color: bright ? B.white : color,
          textShadow: bright ? `0 0 30px ${color}` : `0 0 18px ${color}40`,
          transition:'color 0.15s, text-shadow 0.15s',
          minWidth:'2ch', textAlign:'center',
        }}>{padded}</div>
      </div>
      <div style={{ fontFamily:'Orbitron,monospace', fontSize:8, color, letterSpacing:4 }}>{label}</div>
    </div>
  )
}

// ── hype card canvas ──────────────────────────────────────────────────────────────────────────────
async function downloadHypeCard({ name, daysLeft }) {
  const W = 1080, H = 1080
  const cv = document.createElement('canvas')
  cv.width = W; cv.height = H
  const c = cv.getContext('2d')

  c.fillStyle = '#000000'
  c.fillRect(0, 0, W, H)

  const glow = c.createRadialGradient(W/2, H*0.45, 0, W/2, H*0.45, 520)
  glow.addColorStop(0, 'rgba(245,166,35,0.18)')
  glow.addColorStop(1, 'transparent')
  c.fillStyle = glow; c.fillRect(0, 0, W, H)

  const topBar = c.createLinearGradient(0, 0, W, 0)
  topBar.addColorStop(0, 'transparent'); topBar.addColorStop(0.5, '#F5A623'); topBar.addColorStop(1, 'transparent')
  c.fillStyle = topBar; c.fillRect(0, 0, W, 5)

  c.textAlign = 'center'
  c.fillStyle = '#F5A623'; c.font = '700 30px monospace'
  c.fillText("SNEAKERS FEST '26  ·  DECEMBER 12, 2026", W/2, 80)

  c.fillStyle = 'rgba(255,255,255,0.05)'
  c.font = '900 380px sans-serif'
  c.fillText('SF', W/2, 500)

  c.fillStyle = '#FFFFFF'; c.font = '900 160px sans-serif'
  c.fillText("I'M", W/2, 340)
  c.fillStyle = '#F5A623'; c.font = '900 200px sans-serif'
  c.fillText('GOING', W/2, 540)

  c.strokeStyle = '#F5A623'; c.lineWidth = 2
  c.beginPath(); c.moveTo(220, 590); c.lineTo(W - 220, 590); c.stroke()

  c.fillStyle = '#FFFFFF'; c.font = '700 34px monospace'
  c.fillText('MURI OKUNOLA PARK, VICTORIA ISLAND', W/2, 650)
  c.fillStyle = '#888'; c.font = '700 22px monospace'
  c.fillText('LAGOS, NIGERIA', W/2, 688)

  c.fillStyle = '#F5A623'; c.font = '900 110px monospace'
  c.fillText(String(daysLeft), W/2, 810)
  c.fillStyle = '#666'; c.font = '700 26px monospace'
  c.fillText('DAYS AWAY', W/2, 855)

  if (name && name.trim()) {
    c.fillStyle = '#FFFFFF'; c.font = '700 38px sans-serif'
    c.fillText(name.trim().toUpperCase(), W/2, 960)
  }

  c.fillStyle = '#111'; c.fillRect(0, H - 50, W, 50)
  c.fillStyle = '#333'; c.font = '20px monospace'
  c.fillText('sneakersfest.com  ·  @sneakersfest', W/2, H - 20)

  c.fillStyle = topBar; c.fillRect(0, H - 5, W, 5)

  cv.toBlob(blob => {
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url; a.download = 'SF26-hype-card.png'
    document.body.appendChild(a); a.click()
    document.body.removeChild(a); URL.revokeObjectURL(url)
  }, 'image/png')
}

// ── main section ──────────────────────────────────────────────────────────────────────────────
export default function Countdown() {
  const time = useCountdown()
  const [rsvp,       setRsvp]       = useState(RSVP_SEED)
  const [joined,     setJoined]     = useState(false)
  const [burst,      setBurst]      = useState(false)
  const [cardName,   setCardName]   = useState('')
  const [generating, setGenerating] = useState(false)
  const [joinPerson, setJoinPerson] = useState(null)
  const [joinVis,    setJoinVis]    = useState(false)
  const joinRef = useRef(null)
  const joinIdx = useRef(0)

  useEffect(() => {
    try {
      const extra = Number(localStorage.getItem(RSVP_KEY) || 0)
      setRsvp(RSVP_SEED + extra)
      setJoined(localStorage.getItem(JOINED_KEY) === '1')
    } catch {}

    function showJoin() {
      setJoinVis(false)
      joinRef.current = setTimeout(() => {
        joinIdx.current = (joinIdx.current + 1) % JOIN_POOL.length
        setJoinPerson(JOIN_POOL[joinIdx.current])
        setJoinVis(true)
        joinRef.current = setTimeout(showJoin, 5500 + Math.random() * 3000)
      }, 400)
    }
    joinRef.current = setTimeout(showJoin, 4000)
    return () => clearTimeout(joinRef.current)
  }, [])

  function joinCount() {
    if (joined) return
    setBurst(true)
    setTimeout(() => setBurst(false), 400)
    setRsvp(r => {
      const next = r + 1
      try { localStorage.setItem(RSVP_KEY, String(next - RSVP_SEED)) } catch {}
      return next
    })
    setJoined(true)
    try { localStorage.setItem(JOINED_KEY, '1') } catch {}
  }

  async function handleCard() {
    setGenerating(true)
    await downloadHypeCard({ name: cardName, daysLeft: time.days })
    setGenerating(false)
  }

  const UNITS = [
    { val: time.days,    label:'DAYS',    color: B.amber },
    { val: time.hours,   label:'HOURS',   color: B.neonCyan },
    { val: time.minutes, label:'MINUTES', color: B.neonMagenta },
    { val: time.seconds, label:'SECONDS', color: B.neonLime },
  ]

  return (
    <section id="countdown" style={{ position:'relative', overflow:'hidden', background:`linear-gradient(180deg, ${B.void} 0%, ${B.black} 100%)`, padding:'100px 24px' }}>
      <GrainOverlay />
      <Egg id="egg-091" corner="top-right" />
      <Egg id="egg-092" corner="bottom-left" />

      <div style={{ position:'absolute', top:'30%', left:'50%', transform:'translate(-50%,-50%)', width:700, height:500, background:`radial-gradient(ellipse, ${B.amber}08 0%, transparent 70%)`, filter:'blur(80px)', pointerEvents:'none' }} />
      <div style={{ position:'absolute', bottom:'10%', left:'10%', width:300, height:300, background:`radial-gradient(circle, ${B.neonCyan}06 0%, transparent 70%)`, filter:'blur(60px)', pointerEvents:'none' }} />
      <div style={{ position:'absolute', bottom:'10%', right:'10%', width:300, height:300, background:`radial-gradient(circle, ${B.neonMagenta}06 0%, transparent 70%)`, filter:'blur(60px)', pointerEvents:'none' }} />

      <div style={{ position:'relative', zIndex:10, maxWidth:900, margin:'0 auto' }}>

        <div style={{ textAlign:'center', marginBottom:56 }}>
          <SectionTag>DECEMBER 12, 2026 · MURI OKUNOLA PARK, V/I</SectionTag>
          <div className="reveal-3d text-3d" style={{ fontFamily:"'Bebas Neue', sans-serif", fontSize:'clamp(44px,9vw,88px)', color:B.white, lineHeight:0.88, letterSpacing:2 }}>
            THE CLOCK<br /><span style={{ color:B.amber }}>IS RUNNING</span>
          </div>
        </div>

        <div className="reveal-3d" style={{ display:'flex', justifyContent:'center', alignItems:'flex-start', gap:'clamp(10px,3vw,28px)', flexWrap:'wrap', marginBottom:56 }}>
          {UNITS.map((u, i) => (
            <div key={u.label} style={{ display:'flex', alignItems:'center', gap:'clamp(10px,3vw,28px)' }}>
              <FlipUnit value={u.val} label={u.label} color={u.color} />
              {i < UNITS.length - 1 && (
                <div style={{ fontFamily:'Orbitron,monospace', fontSize:'clamp(32px,6vw,56px)', color:'rgba(255,255,255,0.15)', fontWeight:900, marginBottom:28, alignSelf:'center', paddingBottom:28 }}>:</div>
              )}
            </div>
          ))}
        </div>

        <div style={{ textAlign:'center', marginBottom:60 }}>
          <style>{`
            @keyframes joinSlide { from{ opacity:0; transform:translateY(4px) } to{ opacity:1; transform:translateY(0) } }
            @keyframes dotBlink2 { 0%,100%{ opacity:1 } 50%{ opacity:0.4 } }
          `}</style>
          <div className="card-3d" style={{ display:'inline-flex', flexDirection:'column', alignItems:'center', gap:20, background:'rgba(255,255,255,0.03)', border:`1px solid rgba(255,255,255,0.08)`, borderRadius:16, padding:'32px 48px' }}>
            <div>
              <div style={{ fontFamily:'Orbitron,monospace', fontWeight:900, fontSize:'clamp(36px,7vw,64px)', color:B.white, lineHeight:1,
                transform: burst ? 'scale(1.1)' : 'scale(1)', transition:'transform 0.2s cubic-bezier(0.34,1.56,0.64,1)' }}>
                {rsvp.toLocaleString()}
              </div>
              <div style={{ fontFamily:'Space Mono,monospace', fontSize:10, color:B.smoke, letterSpacing:3, marginTop:6, textAlign:'center' }}>
                {joined ? 'HEADS ARE IN · INCLUDING YOU' : 'HEADS ALREADY IN'}
              </div>

              {/* Live join ticker */}
              <div style={{ height:20, marginTop:10, display:'flex', alignItems:'center', justifyContent:'center', gap:6, opacity: joinVis && joinPerson ? 1 : 0, transition:'opacity 0.4s' }}>
                {joinVis && joinPerson && (
                  <>
                    <div style={{ width:6, height:6, borderRadius:'50%', background:B.neonLime, boxShadow:`0 0 6px ${B.neonLime}`, animation:'dotBlink2 1.5s ease-in-out infinite' }} />
                    <span style={{ fontFamily:'Space Mono,monospace', fontSize:9, color:B.neonLime, letterSpacing:1, animation:'joinSlide 0.4s ease' }}>
                      {joinPerson.name} <span style={{ color:B.smoke }}>({joinPerson.city}) just joined</span>
                    </span>
                  </>
                )}
              </div>
            </div>

            {/* Milestone bar */}
            {(() => {
              const next = MILESTONES.find(m => m > rsvp) ?? MILESTONES[MILESTONES.length - 1]
              const prev = MILESTONES[MILESTONES.indexOf(next) - 1] ?? 0
              const pct  = Math.min(1, (rsvp - prev) / (next - prev))
              const left = next - rsvp
              return (
                <div style={{ width:'100%', maxWidth:280 }}>
                  <div style={{ display:'flex', justifyContent:'space-between', marginBottom:6 }}>
                    <span style={{ fontFamily:'Space Mono,monospace', fontSize:8, color:B.smoke, letterSpacing:1 }}>NEXT MILESTONE</span>
                    <span style={{ fontFamily:'Orbitron,monospace', fontSize:8, color:B.amber, letterSpacing:1 }}>{next.toLocaleString()}</span>
                  </div>
                  <div style={{ height:4, background:'rgba(255,255,255,0.08)', borderRadius:2, overflow:'hidden' }}>
                    <div style={{ height:'100%', width:`${pct*100}%`, background:`linear-gradient(90deg,${B.amber},${B.neonLime})`, borderRadius:2, transition:'width 0.6s ease' }} />
                  </div>
                  <div style={{ fontFamily:'Space Mono,monospace', fontSize:8, color:B.smoke, letterSpacing:1, marginTop:6, textAlign:'center' }}>
                    {left.toLocaleString()} heads to unlock next tier unlock
                  </div>
                </div>
              )
            })()}

            <button
              onClick={joinCount}
              disabled={joined}
              style={{
                padding:'14px 36px',
                background: joined ? `${B.neonLime}15` : `linear-gradient(90deg, ${B.amber}, #D48000)`,
                border:`1px solid ${joined ? B.neonLime : 'transparent'}`,
                borderRadius:8,
                color: joined ? B.neonLime : B.black,
                fontFamily:'Bebas Neue,sans-serif', fontSize:18, letterSpacing:3,
                cursor: joined ? 'default' : 'pointer',
                transition:'all 0.2s',
                boxShadow: joined ? 'none' : `0 0 32px ${B.amber}30`,
              }}
              onMouseEnter={e => { if (!joined) { e.currentTarget.style.boxShadow = `0 0 48px ${B.amber}50` } }}
              onMouseLeave={e => { e.currentTarget.style.boxShadow = joined ? 'none' : `0 0 32px ${B.amber}30` }}
            >
              {joined ? "✓ YOU'RE IN" : 'COUNT ME IN →'}
            </button>
          </div>
        </div>

        <div className="card-3d" style={{ background:'rgba(255,255,255,0.02)', border:`1px solid ${B.amber}20`, borderRadius:16, padding:'36px 32px' }}>
          <div style={{ textAlign:'center', marginBottom:24 }}>
            <div style={{ fontFamily:'Bebas Neue,sans-serif', fontSize:28, color:B.white, letterSpacing:3, marginBottom:6 }}>GENERATE YOUR HYPE CARD</div>
            <div style={{ fontFamily:'Syne,sans-serif', fontSize:13, color:B.smoke }}>1080×1080 · Instagram-ready · Download & share</div>
          </div>

          <div style={{ maxWidth:360, margin:'0 auto', display:'flex', flexDirection:'column', gap:14 }}>
            <div>
              <label style={{ fontFamily:'Space Mono,monospace', fontSize:8, color:'#555', letterSpacing:2, display:'block', marginBottom:6 }}>YOUR NAME (OPTIONAL)</label>
              <input
                value={cardName} onChange={e => setCardName(e.target.value)}
                placeholder="e.g. FAROUQ"
                style={{ width:'100%', padding:'11px 14px', background:'rgba(255,255,255,0.04)', border:`1px solid ${B.amber}30`, borderRadius:6, color:B.white, fontFamily:'Syne,sans-serif', fontSize:13, outline:'none', boxSizing:'border-box' }}
              />
            </div>

            <div style={{ background:'#000', border:`1px solid ${B.amber}30`, borderRadius:8, padding:'20px', textAlign:'center', aspectRatio:'1', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:6 }}>
              <div style={{ fontFamily:'Orbitron,monospace', fontSize:9, color:B.amber, letterSpacing:2 }}>SNEAKERS FEST '26</div>
              <div style={{ fontFamily:'Bebas Neue,sans-serif', fontSize:'clamp(28px,7vw,48px)', color:B.white, lineHeight:0.9 }}>I'M</div>
              <div style={{ fontFamily:'Bebas Neue,sans-serif', fontSize:'clamp(36px,9vw,64px)', color:B.amber, lineHeight:0.9 }}>GOING</div>
              <div style={{ fontFamily:'Space Mono,monospace', fontSize:8, color:'#555', letterSpacing:1, marginTop:4 }}>MURI OKUNOLA PARK, V/I</div>
              <div style={{ fontFamily:'Orbitron,monospace', fontSize:'clamp(20px,5vw,36px)', color:B.amber, fontWeight:900, marginTop:4 }}>{time.days}</div>
              <div style={{ fontFamily:'Space Mono,monospace', fontSize:8, color:'#555', letterSpacing:2 }}>DAYS AWAY</div>
              {cardName && <div style={{ fontFamily:'Space Mono,monospace', fontSize:9, color:B.smoke, marginTop:4 }}>{cardName.toUpperCase()}</div>}
            </div>

            <button onClick={handleCard} disabled={generating}
              style={{ padding:'14px', background: generating ? '#1a1a1a' : B.amber, border:'none', borderRadius:8, color:B.black, fontFamily:'Bebas Neue,sans-serif', fontSize:18, letterSpacing:3, cursor: generating ? 'wait' : 'pointer', transition:'all 0.2s', boxShadow: generating ? 'none' : `0 0 32px ${B.amber}30` }}>
              {generating ? 'GENERATING…' : 'DOWNLOAD HYPE CARD →'}
            </button>
          </div>
        </div>

      </div>
    </section>
  )
}
