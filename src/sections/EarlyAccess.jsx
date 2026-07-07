import { useState, useEffect, useRef } from 'react'
import { B } from '../tokens'
import { GrainOverlay, ScanLines, SectionTag } from '../components/Shared'
import Egg from '../components/Egg'

const SEED_COUNT = 1847
const GOAL       = 2500
const KEY        = 'sf26_waitlist'
const REF_KEY    = 'sf26_refcode'

const TIERS = [
  {
    max:100, label:'FOUNDING MEMBER', icon:'👑', color:B.amber,
    perks:['First window for Phalanx + VVIP tickets','Name on the event wall','Exclusive founding merch bag','Direct WhatsApp access to The Catalyst'],
  },
  {
    max:500, label:'INNER CIRCLE', icon:'💎', color:B.neonCyan,
    perks:['48-hour early ticket window','₦2,000 discount on any tier','Priority vendor application slot','Insider drop intel before public'],
  },
  {
    max:1000, label:'EARLY ACCESS', icon:'⚡', color:B.neonLime,
    perks:['24-hour early ticket window','Priority newsletter drops','First shot at raffle entries','FNP community access'],
  },
  {
    max:Infinity, label:'WAITLIST', icon:'🎯', color:'#888',
    perks:['Access before public sale opens','Community newsletter updates','FNP community access'],
  },
]

function getTier(pos) {
  return TIERS.find(t => pos <= t.max) || TIERS[TIERS.length - 1]
}

function genRefCode(name) {
  const prefix = (name || 'SF').replace(/[^a-zA-Z]/g, '').slice(0, 2).toUpperCase() || 'SF'
  const rand = Math.random().toString(36).slice(2, 6).toUpperCase()
  return `${prefix}${rand}`
}

function useCountUp(target, active) {
  const [val, setVal] = useState(0)
  const raf = useRef()
  useEffect(() => {
    if (!active || !target) return
    const start = Date.now()
    const dur   = 1400
    const tick  = () => {
      const p = Math.min(1, (Date.now() - start) / dur)
      const ease = 1 - Math.pow(1 - p, 3)
      setVal(Math.round(ease * target))
      if (p < 1) raf.current = requestAnimationFrame(tick)
    }
    raf.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf.current)
  }, [target, active])
  return val
}

export default function EarlyAccess() {
  const [email,       setEmail]       = useState('')
  const [name,        setName]        = useState('')
  const [phase,       setPhase]       = useState('form')
  const [position,    setPosition]    = useState(null)
  const [error,       setError]       = useState('')
  const [refCode,     setRefCode]     = useState('')
  const [refCopied,   setRefCopied]   = useState(false)
  const [shared,      setShared]      = useState(false)
  const [refCount,    setRefCount]    = useState(null)

  const animPos = useCountUp(position, phase === 'done')

  function getTotal() {
    try { return SEED_COUNT + Number(JSON.parse(localStorage.getItem(KEY) || '0')) } catch { return SEED_COUNT }
  }

  async function submit(e) {
    e.preventDefault()
    if (!email.includes('@')) { setError('Enter a valid email address.'); return }
    setError(''); setPhase('loading')

    const code = genRefCode(name)

    // Netlify Forms — organiser receives this in the Netlify dashboard
    try {
      const body = new URLSearchParams({
        'form-name': 'waitlist',
        'bot-field': '',
        name: name.trim() || 'Unknown',
        email: email.trim().toLowerCase(),
        refCode: code,
      })
      await fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: body.toString(),
      })
    } catch {}

    // Netlify Function — stores entry server-side, returns real queue position, sends confirmation email
    let pos = getTotal() + Math.floor(Math.random() * 8) + 1
    try {
      const res = await fetch('/.netlify/functions/waitlist-signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: name.trim() || 'Unknown', email: email.trim().toLowerCase(), refCode: code }),
      })
      if (res.ok) {
        const data = await res.json()
        if (data.position && typeof data.position === 'number') pos = data.position
      }
    } catch {}

    try {
      localStorage.setItem(KEY,     JSON.stringify(pos - SEED_COUNT))
      localStorage.setItem(REF_KEY, code)
    } catch {}
    setPosition(pos); setRefCode(code); setPhase('done')

    // Fetch live referral count for this code (fire-and-forget)
    fetch(`/.netlify/functions/referral-stats?code=${encodeURIComponent(code)}`)
      .then(r => r.ok ? r.json() : null)
      .then(d => { if (d?.referralCount != null) setRefCount(d.referralCount) })
      .catch(() => {})
  }

  function copyRef() {
    const url = `https://sneakersfest26.com?ref=${refCode}`
    navigator.clipboard.writeText(url).then(() => { setRefCopied(true); setTimeout(() => setRefCopied(false), 2200) }).catch(() => {})
  }

  function sharePos() {
    const text = `I'm #${position?.toLocaleString()} on the Sneakers Fest '26 early access list. Lagos, Dec 12. Grab your spot → sneakersfest26.com?ref=${refCode}`
    if (navigator.share) navigator.share({ text })
    else { navigator.clipboard.writeText(text); setShared(true); setTimeout(() => setShared(false), 2000) }
  }

  const total  = getTotal()
  const pct    = Math.min(100, Math.round((total / GOAL) * 100))
  const tier   = position ? getTier(position) : null
  const ahead  = position ? Math.max(0, total - position) : 0

  return (
    <section id="waitlist" style={{ background:`linear-gradient(135deg, ${B.void} 0%, ${B.black} 50%, ${B.charcoal} 100%)`, padding:'80px 20px', position:'relative', overflow:'hidden' }}>
      <GrainOverlay />
      <Egg id="egg-065" corner="top-right" />
      <Egg id="egg-066" corner="bottom-left" />
      <ScanLines />
      <div style={{ position:'absolute', bottom:-80, left:'50%', transform:'translateX(-50%)', width:500, height:300, borderRadius:'50%', background:`radial-gradient(ellipse, ${B.amber}15 0%, transparent 70%)`, filter:'blur(40px)', pointerEvents:'none' }} />

      <div style={{ maxWidth:600, margin:'0 auto', position:'relative', zIndex:2 }}>
        <SectionTag color={B.amber}>EARLY ACCESS</SectionTag>
        <h2 style={{ fontFamily:"'Bebas Neue'", fontSize:'clamp(2.5rem,7vw,5rem)', color:B.white, letterSpacing:'0.05em', marginBottom:8 }}>
          JOIN THE INNER CIRCLE
        </h2>
        <p style={{ color:B.smoke, fontFamily:"'Space Mono'", fontSize:'0.8rem', marginBottom:20, lineHeight:1.7 }}>
          First access to VIP ticket releases · exclusive drops · insider updates before anyone else
        </p>

        {/* progress bar */}
        <div style={{ marginBottom:28 }}>
          <div style={{ display:'flex', justifyContent:'space-between', marginBottom:6 }}>
            <span style={{ fontFamily:"'Space Mono'", fontSize:'0.6rem', color:B.amber, letterSpacing:2 }}>
              {total.toLocaleString()} LOCKED IN
            </span>
            <span style={{ fontFamily:"'Space Mono'", fontSize:'0.6rem', color:'#444', letterSpacing:2 }}>
              GOAL: {GOAL.toLocaleString()} · {pct}% FULL
            </span>
          </div>
          <div style={{ height:6, background:'rgba(255,255,255,0.05)', borderRadius:3, overflow:'hidden' }}>
            <div style={{ height:'100%', width:`${pct}%`, background:`linear-gradient(90deg, ${B.amber}, ${B.neonCyan})`, borderRadius:3, transition:'width 1s ease', boxShadow:`0 0 10px ${B.amber}50` }} />
          </div>
          <div style={{ display:'flex', gap:16, marginTop:10, flexWrap:'wrap' }}>
            {TIERS.slice(0,-1).map(t => (
              <span key={t.label} style={{ fontFamily:"'Space Mono'", fontSize:'0.58rem', color:t.color, letterSpacing:1 }}>
                {t.icon} #{t.max}: {t.label}
              </span>
            ))}
          </div>
        </div>

        {/* FORM */}
        {phase === 'form' && (
          <form onSubmit={submit}>
            <div style={{ display:'flex', flexDirection:'column', gap:12, marginBottom:16 }}>
              <input value={name} onChange={e => setName(e.target.value)} placeholder="Your name"
                style={{ background:B.charcoal, border:`1px solid ${B.gunmetal}`, borderRadius:6, padding:'12px 16px', color:B.white, fontFamily:"'Space Mono'", fontSize:'0.85rem', outline:'none', transition:'border-color 0.2s' }}
                onFocus={e => e.target.style.borderColor = B.amber}
                onBlur={e  => e.target.style.borderColor = B.gunmetal} />
              <div style={{ display:'flex', gap:12 }}>
                <input type="email" value={email} onChange={e => { setEmail(e.target.value); setError('') }} placeholder="your@email.com" required
                  style={{ flex:1, background:B.charcoal, border:`1px solid ${error ? B.neonMagenta : B.gunmetal}`, borderRadius:6, padding:'12px 16px', color:B.white, fontFamily:"'Space Mono'", fontSize:'0.85rem', outline:'none', transition:'border-color 0.2s' }}
                  onFocus={e => { if (!error) e.target.style.borderColor = B.amber }}
                  onBlur={e  => { if (!error) e.target.style.borderColor = B.gunmetal }} />
                <button type="submit" style={{ background:B.amber, color:B.black, border:'none', padding:'12px 28px', fontFamily:"'Bebas Neue'", fontSize:'1.1rem', letterSpacing:'0.1em', cursor:'pointer', borderRadius:6, whiteSpace:'nowrap', boxShadow:`0 0 20px ${B.amber}50` }}>
                  JOIN
                </button>
              </div>
            </div>
            {error && <p style={{ color:B.neonMagenta, fontFamily:"'Space Mono'", fontSize:'0.65rem', marginBottom:8 }}>{error}</p>}
            <p style={{ color:B.smoke, fontFamily:"'Space Mono'", fontSize:'0.62rem' }}>No spam · unsubscribe anytime · your email stays private</p>
          </form>
        )}

        {/* LOADING */}
        {phase === 'loading' && (
          <div style={{ textAlign:'center', padding:'40px 0' }}>
            <div style={{ width:48, height:48, borderRadius:'50%', border:`3px solid ${B.gunmetal}`, borderTop:`3px solid ${B.amber}`, margin:'0 auto 16px', animation:'spin 0.8s linear infinite' }} />
            <p style={{ color:B.smoke, fontFamily:"'Space Mono'", fontSize:'0.75rem' }}>Securing your spot...</p>
          </div>
        )}

        {/* DONE */}
        {phase === 'done' && tier && (
          <div>
            {/* tier badge */}
            <div style={{ display:'flex', alignItems:'center', gap:14, padding:'16px 20px', background:`${tier.color}12`, border:`1px solid ${tier.color}40`, borderRadius:10, marginBottom:24 }}>
              <span style={{ fontSize:32 }}>{tier.icon}</span>
              <div>
                <div style={{ fontFamily:"'Space Mono'", fontSize:'0.58rem', color:tier.color, letterSpacing:3, marginBottom:2 }}>YOUR STATUS</div>
                <div style={{ fontFamily:"'Bebas Neue'", fontSize:'1.6rem', color:B.white, letterSpacing:'0.06em' }}>{tier.label}</div>
              </div>
              <div style={{ marginLeft:'auto', textAlign:'right' }}>
                <div style={{ fontFamily:"'Space Mono'", fontSize:'0.58rem', color:'#555', letterSpacing:2, marginBottom:2 }}>QUEUE #</div>
                <div style={{ fontFamily:"'Orbitron'", fontSize:'1.5rem', fontWeight:900, color:tier.color, textShadow:`0 0 20px ${tier.color}60` }}>
                  {animPos.toLocaleString()}
                </div>
              </div>
            </div>

            {/* context stats */}
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:12, marginBottom:24 }}>
              {[
                { label:'AHEAD OF YOU', val:Math.max(0, position - 1).toLocaleString(), color:B.amber },
                { label:'BEHIND YOU',   val:ahead.toLocaleString(),                     color:B.neonCyan },
                { label:'QUEUE FILL',   val:`${pct}%`,                                  color:B.neonLime },
              ].map(s => (
                <div key={s.label} style={{ background:'rgba(255,255,255,0.02)', border:'1px solid rgba(255,255,255,0.06)', borderRadius:8, padding:'12px 14px', textAlign:'center' }}>
                  <div style={{ fontFamily:"'Orbitron'", fontSize:'1.2rem', fontWeight:900, color:s.color, marginBottom:4 }}>{s.val}</div>
                  <div style={{ fontFamily:"'Space Mono'", fontSize:'0.55rem', color:'#444', letterSpacing:2 }}>{s.label}</div>
                </div>
              ))}
            </div>

            {/* perks */}
            <div style={{ background:'rgba(255,255,255,0.02)', border:`1px solid ${tier.color}25`, borderRadius:10, padding:'16px 20px', marginBottom:24 }}>
              <div style={{ fontFamily:"'Space Mono'", fontSize:'0.58rem', color:tier.color, letterSpacing:3, marginBottom:12 }}>YOUR PERKS</div>
              <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
                {tier.perks.map((p, i) => (
                  <div key={i} style={{ display:'flex', gap:10, alignItems:'flex-start' }}>
                    <span style={{ color:tier.color, fontSize:12, marginTop:1, flexShrink:0 }}>✓</span>
                    <span style={{ fontFamily:"'Syne'", fontSize:'0.82rem', color:B.smoke, lineHeight:1.5 }}>{p}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* referral link */}
            <div style={{ background:'rgba(255,255,255,0.02)', border:'1px solid rgba(255,255,255,0.07)', borderRadius:10, padding:'16px 20px', marginBottom:24 }}>
              <div style={{ fontFamily:"'Space Mono'", fontSize:'0.58rem', color:'#555', letterSpacing:3, marginBottom:4 }}>YOUR REFERRAL LINK</div>
              <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:10 }}>
                <span style={{ fontFamily:"'Space Mono'", fontSize:'0.65rem', color:B.amber }}>Share to move up the queue</span>
                {refCount !== null && (
                  <span style={{ fontFamily:"'Orbitron'", fontSize:'0.7rem', color:B.neonLime, fontWeight:700 }}>
                    {refCount} referral{refCount !== 1 ? 's' : ''}
                  </span>
                )}
              </div>
              <div style={{ display:'flex', gap:8, alignItems:'center' }}>
                <div style={{ flex:1, background:B.charcoal, border:'1px solid rgba(255,255,255,0.08)', borderRadius:6, padding:'10px 14px', fontFamily:"'Space Mono'", fontSize:'0.7rem', color:'#888', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>
                  sneakersfest26.com?ref=<span style={{ color:B.amber }}>{refCode}</span>
                </div>
                <button onClick={copyRef}
                  style={{ padding:'10px 18px', background:refCopied ? `${B.amber}20` : 'rgba(255,255,255,0.05)', border:`1px solid ${refCopied ? B.amber+'50' : 'rgba(255,255,255,0.1)'}`, borderRadius:6, color:refCopied ? B.amber : '#666', fontFamily:"'Orbitron'", fontSize:9, cursor:'pointer', letterSpacing:1, whiteSpace:'nowrap', transition:'all 0.2s' }}>
                  {refCopied ? '✓ COPIED' : 'COPY'}
                </button>
              </div>
            </div>

            {/* share CTA */}
            <button onClick={sharePos}
              style={{ width:'100%', background:B.amber, color:B.black, border:'none', padding:'14px', fontFamily:"'Bebas Neue'", fontSize:'1.2rem', letterSpacing:'0.1em', cursor:'pointer', borderRadius:6, boxShadow:`0 0 24px ${B.amber}50` }}>
              {shared ? '✓ LINK COPIED!' : 'SHARE & MOVE UP THE QUEUE'}
            </button>
            <p style={{ color:'#444', fontFamily:"'Space Mono'", fontSize:'0.6rem', marginTop:10, textAlign:'center' }}>
              {name ? `${name}, check` : 'Check'} your email for confirmation · early access tickets drop to you first
            </p>
          </div>
        )}
      </div>
    </section>
  )
}
