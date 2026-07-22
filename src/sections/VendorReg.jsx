import { useState, useEffect, useCallback } from 'react'
import { B } from '../tokens'
import { GrainOverlay, SectionTag } from '../components/Shared'
import { SOCIAL_LINKS } from '../config'
import { logReferralConversion } from '../lib/referral'
import Egg from '../components/Egg'
import { claudeChat, getApiKey, setApiKey } from '../lib/catalystAI'

const FORMSPREE = import.meta.env.VITE_FORMSPREE_ID || ''

const CATEGORIES = ['Sneakers', 'Apparel', 'Accessories', 'Vintage', 'Custom Art', 'Food & Beverage', 'Tech / Photography', 'Other']

const BOOTHS = [
  { id:'standard', label:'Standard',       size:'3 × 3 m', price:150000, capacity:20, features:['Table + 2 chairs','Power outlet','Booth ID signage'] },
  { id:'double',   label:'Double',         size:'6 × 3 m', price:280000, capacity:10, features:['2 Tables + 4 chairs','2 Power outlets','Corner visibility option'] },
  { id:'premium',  label:'Premium Corner', size:'4 × 4 m', price:400000, capacity:6,  features:['High-traffic corner','LED spotlight','Social media feature','Extra storage'] },
  { id:'collab',   label:'Exclusive Collab', size:'Custom', price:null,  capacity:3,  features:['Exclusive drop opportunity','Co-branded marketing','Custom build-out','Direct negotiation'] },
]

const FAQ = [
  { q:'Who attends?',                                    a:"Lagos sneakerheads, streetwear creatives, collectors, content creators, and brand enthusiasts. Year 1 target: 1,000 to 2,500 attendees." },
  { q:'Can I do an exclusive drop at the event?',        a:"Yes. Limited collab and exclusive drop opportunities are available — separate from the standard vendor package. Select 'Exclusive Collab Tier' or contact directly." },
  { q:'How are vendors selected?',                       a:"Year 1 is invitation-curated. We're building a first cohort of 30 confirmed vendors before announcing publicly. Applications are reviewed within 3 business days." },
  { q:'What does the stall include?',                    a:"Booth space, table, power connection, and setup time. Full spec sheet sent on confirmation. Specific inclusions depend on tier selected." },
]

function genAppId() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  let id = 'VSF26-'
  for (let i = 0; i < 6; i++) id += chars[Math.floor(Math.random() * chars.length)]
  return id
}

function BoothCard({ booth, selected, onSelect, taken }) {
  const pct         = taken / booth.capacity
  const statusColor = pct >= 1 ? B.neonMagenta : pct >= 0.7 ? B.amber : B.neonLime
  const statusText  = pct >= 1 ? 'FULL' : pct >= 0.7 ? 'FILLING FAST' : 'AVAILABLE'
  const isFull      = pct >= 1
  return (
    <div onClick={() => !isFull && onSelect(booth.id)}
      style={{ padding:16, borderRadius:8, cursor:isFull ? 'not-allowed' : 'pointer', border:`1px solid ${selected ? B.neonCyan : isFull ? '#333' : 'rgba(255,255,255,0.09)'}`, background:selected ? `${B.neonCyan}08` : isFull ? 'rgba(255,255,255,0.02)' : 'rgba(255,255,255,0.03)', transition:'all 0.2s', opacity:isFull ? 0.5 : 1 }}
    >
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:8 }}>
        <div>
          <div style={{ fontFamily:'Bebas Neue,sans-serif', fontSize:16, color:selected ? B.neonCyan : B.white, letterSpacing:1 }}>{booth.label}</div>
          <div style={{ fontFamily:'Space Mono,monospace', fontSize:9, color:B.smoke, marginTop:2 }}>{booth.size}</div>
        </div>
        <div style={{ textAlign:'right' }}>
          <div style={{ fontFamily:'Bebas Neue,sans-serif', fontSize:18, color:B.amber }}>{booth.price ? `₦${booth.price.toLocaleString('en-NG')}` : 'CONTACT'}</div>
          <div style={{ fontFamily:'Space Mono,monospace', fontSize:8, color:statusColor, letterSpacing:1, marginTop:2 }}>{statusText}</div>
        </div>
      </div>
      <div style={{ height:3, background:'#1a1a1a', borderRadius:2, marginBottom:10, overflow:'hidden' }}>
        <div style={{ height:'100%', width:`${Math.min(pct*100,100)}%`, background:statusColor, borderRadius:2, transition:'width 0.5s' }} />
      </div>
      <div style={{ fontFamily:'Space Mono,monospace', fontSize:8, color:B.smoke, marginBottom:8 }}>
        {booth.capacity - taken} of {booth.capacity} spots remaining
      </div>
      <ul style={{ listStyle:'none', padding:0, margin:0, display:'flex', flexDirection:'column', gap:4 }}>
        {booth.features.map(f => (
          <li key={f} style={{ fontFamily:'Syne,sans-serif', fontSize:11, color:selected ? B.white : B.smoke, display:'flex', gap:6, alignItems:'center' }}>
            <span style={{ color:selected ? B.neonCyan : '#444', flexShrink:0 }}>◆</span>{f}
          </li>
        ))}
      </ul>
    </div>
  )
}

const CONFIRMED_VENDORS = [
  { name:'Sole Lagos',      cat:'Sneakers',   city:'Lagos', ig:'@solelagos',    color:B.amber },
  { name:'Kicksurge NG',    cat:'Sneakers',   city:'Abuja', ig:'@kicksurgeng',  color:B.neonCyan },
  { name:'Stitch and Sole', cat:'Custom Art', city:'Lagos', ig:'@stitchedsole', color:B.neonMagenta },
  { name:'Lagos Drip Haus', cat:'Apparel',    city:'Lagos', ig:'@lagosdrip',    color:B.neonLime },
]

const MAP_ZONES = [
  { id:'collab', label:'STAGE / COLLAB', hint:'Custom build' },
  { id:'premium', label:'PREMIUM CORNER', hint:'4x4m corners' },
  { id:'double', label:'DOUBLE BOOTH', hint:'6x3m wing' },
  { id:'standard', label:'STANDARD FLOOR', hint:'3x3m rows' },
]
function BoothMap({ taken, selected, onSelect }) {
  return (
    <div style={{ marginBottom:16 }}>
      <div style={{ fontFamily:'Space Mono,monospace', fontSize:7, color:'#444', letterSpacing:2, marginBottom:8 }}>VENUE FLOOR PLAN</div>
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gridTemplateRows:'70px 90px', gap:4 }}>
        {MAP_ZONES.map(z => {
          const booth = BOOTHS.find(b => b.id === z.id)
          const pct = (taken[z.id] || 0) / (booth ? booth.capacity : 1)
          const col = pct >= 1 ? B.neonMagenta : pct >= 0.7 ? B.amber : B.neonCyan
          const isSel = selected === z.id
          return (
            <div key={z.id} onClick={() => pct < 1 && onSelect(z.id)} style={{ padding:'8px 10px', borderRadius:6, cursor:pct >= 1 ? 'not-allowed' : 'pointer', background:isSel ? `${col}15` : 'rgba(255,255,255,0.02)', border:`1px solid ${isSel ? col : col + '35'}`, opacity:pct >= 1 ? 0.4 : 1, transition:'all 0.2s', display:'flex', flexDirection:'column', justifyContent:'space-between' }}>
              <div style={{ fontFamily:'Space Mono,monospace', fontSize:7, color:col, letterSpacing:1 }}>{z.label}</div>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-end' }}>
                <div style={{ fontFamily:'Space Mono,monospace', fontSize:6, color:'#444' }}>{z.hint}</div>
                <div style={{ fontFamily:'Orbitron,monospace', fontSize:8, color:isSel ? col : '#555' }}>{(booth ? booth.capacity : 0) - (taken[z.id] || 0)} LEFT</div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

const STEPS = [
  { label:'BOOTH',      subtitle:'Choose your space' },
  { label:'BRAND INFO', subtitle:'Who are you?' },
  { label:'SOCIAL',     subtitle:'Links & presence' },
  { label:'REVIEW',     subtitle:'Confirm & submit' },
]

const STATUS_STEPS = [
  { num:'01', title:'RECEIVED',     desc:'In queue',        color:B.neonCyan,    done:true  },
  { num:'02', title:'UNDER REVIEW', desc:'3 biz days',      color:B.amber,       done:false },
  { num:'03', title:'SHORTLISTED',  desc:'If selected',     color:B.neonLime,    done:false },
  { num:'04', title:'CONFIRMED',    desc:'Dec 12, Lagos',   color:B.neonMagenta, done:false },
]

export default function VendorReg() {
  const [step,         setStep]        = useState(0)
  const [form,         setForm]        = useState({ booth:'', business:'', contact:'', email:'', phone:'', category:'', instagram:'', twitter:'', website:'', deckUrl:'', exclusiveDrop:'', bio:'' })
  const [status,       setStatus]      = useState('idle')
  const [openFaq,      setOpenFaq]     = useState(null)
  const [appId,        setAppId]       = useState('')
  const [taken,        setTaken]       = useState({ standard:8, double:5, premium:3, collab:1 })
  const [existingApp,  setExistingApp] = useState(null)
  const [showPrevBanner, setShowPrevBanner] = useState(false)
  const [showStatus, setShowStatus] = useState(false)
  const [pitchLoading, setPitchLoading] = useState(false)
  const [pitchError,   setPitchError]   = useState('')
  const [showApiKey,   setShowApiKey]   = useState(false)
  const [keyInput,     setKeyInput]     = useState('')

  const generatePitch = useCallback(async () => {
    if (!getApiKey()) { setShowApiKey(true); return }
    setPitchLoading(true); setPitchError('')
    try {
      const prompt = `Write a compelling 200-word vendor application bio for Sneakers Fest '26 in Lagos.
Business: ${form.business || 'sneaker vendor'}
Category: ${form.category || 'sneakers'}
Booth type: ${form.booth || 'standard'}
Exclusive drop interest: ${form.exclusiveDrop || 'open to it'}
${form.instagram ? `Instagram: @${form.instagram}` : ''}

Write in first person, confident but not arrogant. Mention Lagos, the culture, why this event matters to the brand. End with a clear value proposition for event organisers. Max 280 characters.`
      const result = await claudeChat([{ role:'user', content:prompt }], { model:'balanced', system:'You write punchy vendor pitch bios for Lagos streetwear and sneaker events. Keep it real, culturally aware, and brand-confident.' })
      setForm(f => ({ ...f, bio: result.slice(0, 300) }))
    } catch(e) {
      setPitchError(e.message === 'NO_KEY' ? 'Add your Anthropic API key to use AI.' : e.message)
    }
    setPitchLoading(false)
  }, [form.business, form.category, form.booth, form.exclusiveDrop, form.instagram])

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem('sf26_vendor_taken') || '{}')
      if (Object.keys(saved).length) setTaken(t => ({ ...t, ...saved }))
      const draft = JSON.parse(localStorage.getItem('sf26_vendor_draft') || 'null')
      if (draft) setForm(f => ({ ...f, ...draft }))
      const apps = JSON.parse(localStorage.getItem('sf26_vendor_apps') || '[]')
      if (apps.length) { setExistingApp(apps[apps.length - 1]); setShowPrevBanner(true) }
    } catch {}
  }, [])

  useEffect(() => {
    if (status !== 'success') {
      try { localStorage.setItem('sf26_vendor_draft', JSON.stringify(form)) } catch {}
    }
  }, [form, status])

  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }))

  function canNext() {
    if (step === 0) return !!form.booth
    if (step === 1) return !!(form.business.trim() && form.contact.trim() && form.email.includes('@') && form.phone.trim() && form.category)
    if (step === 2) return form.bio.trim().length >= 20
    return true
  }

  async function submit() {
    const id = genAppId()
    setStatus('loading')
    const payload = { ...form, applicationId:id, _subject:`Vendor Application [${id}] — ${form.business}` }
    let ok = false

    // Netlify Forms — primary data capture; works on Netlify with no API key required
    try {
      const nlBody = new URLSearchParams({
        'form-name': 'vendor-registration',
        'bot-field': '',
        business: form.business,
        contact: form.contact,
        email: form.email,
        phone: form.phone,
        category: form.category,
        booth: form.booth,
        instagram: form.instagram || '',
        twitter: form.twitter || '',
        website: form.website || '',
        bio: form.bio,
        applicationId: id,
      })
      const r = await fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: nlBody.toString(),
      })
      if (r.ok) ok = true
    } catch {}

    // Netlify Function — stores in Blobs, sends confirmation email to vendor + org
    try {
      const r = await fetch('/.netlify/functions/vendor-apply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.contact,
          email: form.email,
          phone: form.phone,
          businessName: form.business,
          boothType: form.booth,
          category: form.category,
          instagram: form.instagram || '',
          twitter: form.twitter || '',
          website: form.website || '',
          deckUrl: form.deckUrl || '',
          exclusiveDrop: form.exclusiveDrop || '',
          bio: form.bio,
          applicationId: id,
        }),
      })
      if (r.ok) ok = true
    } catch {}

    // Formspree — last resort fallback
    if (!ok && FORMSPREE) {
      try { const r = await fetch(`https://formspree.io/f/${FORMSPREE}`, { method:'POST', headers:{'Content-Type':'application/json', Accept:'application/json'}, body:JSON.stringify(payload) }); if (r.ok) ok = true } catch {}
    }

    if (ok) {
      const matched = BOOTHS.find(b => form.booth === b.id)
      if (matched) {
        const next = { ...taken, [matched.id]: (taken[matched.id] || 0) + 1 }
        setTaken(next)
        try { localStorage.setItem('sf26_vendor_taken', JSON.stringify(next)) } catch {}
      }
      try {
        const apps = JSON.parse(localStorage.getItem('sf26_vendor_apps') || '[]')
        apps.push({ ...payload, submittedAt:new Date().toISOString() })
        localStorage.setItem('sf26_vendor_apps', JSON.stringify(apps))
        localStorage.removeItem('sf26_vendor_draft')
      } catch {}
      logReferralConversion('vendor', { booth: form.booth })
      setAppId(id); setStatus('success')
    } else {
      setStatus('error')
    }
  }

  const IS  = { width:'100%', padding:'12px 14px', background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.09)', borderRadius:8, color:B.white, fontFamily:'Space Mono,monospace', fontSize:13, outline:'none', boxSizing:'border-box', transition:'border-color 0.2s' }
  const lbl = text => <label style={{ fontFamily:'Space Mono,monospace', fontSize:8, color:'#555', letterSpacing:'0.25em', display:'block', marginBottom:7 }}>{text}</label>
  const onFocus = e => e.target.style.borderColor = B.neonCyan + '60'
  const onBlur  = e => e.target.style.borderColor = 'rgba(255,255,255,0.09)'

  const selectedBooth = BOOTHS.find(b => b.id === form.booth)

  return (
    <section id="vendors" style={{ position:'relative', overflow:'hidden', background:B.black, padding:'100px 24px' }}>
      <GrainOverlay />
      <Egg id="egg-095" corner="top-right" />
      <Egg id="egg-096" corner="bottom-left" />
      <div style={{ position:'absolute', bottom:'20%', left:'-5%', width:400, height:400, background:`radial-gradient(circle, ${B.neonCyan}07 0%, transparent 70%)`, filter:'blur(80px)', pointerEvents:'none' }} />

      <div style={{ position:'relative', zIndex:10, maxWidth:900, margin:'0 auto' }}>
        <div style={{ textAlign:'center', marginBottom:44 }}>
          <SectionTag>VENDOR APPLICATIONS</SectionTag>
          <div className="reveal-3d text-3d" style={{ fontFamily:"'Bebas Neue', sans-serif", fontSize:'clamp(40px,6vw,68px)', color:B.white, lineHeight:0.9, marginBottom:16 }}>
            CLAIM YOUR<br /><span style={{ color:B.neonCyan }}>BOOTH</span>
          </div>
          <div style={{ fontFamily:"'Syne', sans-serif", fontSize:14, color:B.smoke, lineHeight:1.7, maxWidth:520, margin:'0 auto' }}>
            Year 1 is invitation-curated. We're confirming the first cohort of 30 vendors before announcing publicly. If you sell in the sneaker culture ecosystem — kicks, apparel, art, customs — this is your room.
          </div>
        </div>

        <div style={{ display:'grid', gridTemplateColumns:'repeat(3, 1fr)', gap:12, marginBottom:44 }}>
          {[
            { n:'1K–2.5K', l:'YEAR 1 ATTENDEES',     c:B.neonCyan },
            { n:'30–50',   l:'VENDOR SPOTS (YEAR 1)', c:B.amber },
            { n:'DEC 12',  l:'2026 · LAGOS, NIGERIA', c:B.neonMagenta },
          ].map((s, i) => (
            <div key={i} className="card-3d" style={{ padding:'18px 16px', background:B.charcoal, border:`1px solid ${s.c}28`, borderRadius:8, textAlign:'center' }}>
              <div style={{ fontFamily:"'Orbitron', monospace", fontWeight:900, fontSize:22, color:s.c, textShadow:`0 0 16px ${s.c}30` }}>{s.n}</div>
              <div style={{ fontFamily:"'Space Mono', monospace", fontSize:7, color:B.smoke, letterSpacing:'0.15em', marginTop:6 }}>{s.l}</div>
            </div>
          ))}
        </div>

        {status === 'success' ? (
          <div className="card-3d" style={{ padding:'44px 36px', background:`rgba(0,240,255,0.03)`, border:`1px solid ${B.neonCyan}25`, borderRadius:16 }}>
            <div style={{ textAlign:'center', marginBottom:32 }}>
              <div style={{ width:60, height:60, borderRadius:'50%', border:`2px solid ${B.neonLime}`, display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 16px' }}>
                <svg width="26" height="26" viewBox="0 0 24 24" fill="none"><path d="M5 13l4 4L19 7" stroke={B.neonLime} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </div>
              <div style={{ fontFamily:"'Orbitron', monospace", fontSize:10, color:B.neonLime, letterSpacing:3, marginBottom:8 }}>APPLICATION RECEIVED</div>
              <div style={{ fontFamily:"'Bebas Neue', sans-serif", fontSize:36, color:B.white, marginBottom:6 }}>WE'LL BE IN TOUCH</div>
              <div style={{ fontFamily:"'Syne', sans-serif", fontSize:13, color:B.smoke }}>
                Thanks, <span style={{ color:B.white }}>{form.business}</span>. Confirmation sent to <span style={{ color:B.amber }}>{form.email}</span>.
              </div>
            </div>
            <div style={{ background:`${B.amber}08`, border:`1px solid ${B.amber}30`, borderRadius:8, padding:'16px 20px', textAlign:'center', marginBottom:28 }}>
              <div style={{ fontFamily:'Space Mono,monospace', fontSize:10, color:B.smoke, letterSpacing:2, marginBottom:6 }}>YOUR APPLICATION ID</div>
              <div style={{ fontFamily:'Orbitron,monospace', fontSize:24, color:B.amber, letterSpacing:4, fontWeight:700 }}>{appId}</div>
              <div style={{ fontFamily:'Space Mono,monospace', fontSize:9, color:B.smoke, marginTop:6 }}>Save this. Reference it in any follow-up communication.</div>
            </div>

            <div style={{ marginBottom:28 }}>
              <div style={{ fontFamily:'Space Mono,monospace', fontSize:9, color:'#555', letterSpacing:2, marginBottom:20 }}>APPLICATION STATUS</div>
              <div style={{ display:'flex', alignItems:'flex-start' }}>
                {STATUS_STEPS.map((s, i) => (
                  <div key={i} style={{ display:'flex', alignItems:'flex-start', flex: i < STATUS_STEPS.length-1 ? 1 : 0 }}>
                    <div style={{ display:'flex', flexDirection:'column', alignItems:'center', minWidth:56 }}>
                      <div style={{ width:36, height:36, borderRadius:'50%', background:s.done ? s.color : 'rgba(255,255,255,0.05)', border:`1.5px solid ${s.done ? s.color : 'rgba(255,255,255,0.1)'}`, display:'flex', alignItems:'center', justifyContent:'center', fontFamily:'Orbitron,monospace', fontSize:10, color:s.done ? B.black : '#555', marginBottom:8 }}>
                        {s.done ? '✓' : s.num}
                      </div>
                      <div style={{ fontFamily:'Space Mono,monospace', fontSize:7, color:s.done ? s.color : '#444', letterSpacing:1, textAlign:'center', lineHeight:1.4 }}>{s.title}</div>
                      <div style={{ fontFamily:'Space Mono,monospace', fontSize:6, color:'#333', textAlign:'center', marginTop:3, lineHeight:1.4 }}>{s.desc}</div>
                    </div>
                    {i < STATUS_STEPS.length-1 && (
                      <div style={{ flex:1, height:1, background:s.done ? `${s.color}50` : 'rgba(255,255,255,0.06)', marginTop:18, marginLeft:4, marginRight:4 }} />
                    )}
                  </div>
                ))}
              </div>
            </div>

            <a href={SOCIAL_LINKS.whatsapp} target="_blank" rel="noopener noreferrer"
              style={{ display:'block', width:'100%', padding:'13px', background:B.neonLime, borderRadius:8, color:B.black, fontFamily:'Bebas Neue,sans-serif', fontSize:18, letterSpacing:3, textDecoration:'none', textAlign:'center', boxShadow:`0 0 24px ${B.neonLime}30` }}>
              CONFIRM ON WHATSAPP →
            </a>
          </div>
        ) : (
          <div>
            {showPrevBanner && existingApp && (
              <div style={{ marginBottom:24, background:`${B.amber}08`, border:`1px solid ${B.amber}30`, borderRadius:12, overflow:'hidden' }}>
                <div style={{ padding:'14px 20px', display:'flex', justifyContent:'space-between', alignItems:'center', flexWrap:'wrap', gap:12 }}>
                  <div>
                    <div style={{ fontFamily:'Space Mono,monospace', fontSize:8, color:B.amber, letterSpacing:2, marginBottom:4 }}>APPLICATION ON FILE</div>
                    <div style={{ fontFamily:'Orbitron,monospace', fontSize:14, color:B.white, letterSpacing:2 }}>{existingApp.applicationId}</div>
                    <div style={{ fontFamily:'Space Mono,monospace', fontSize:8, color:'#555', marginTop:2 }}>{existingApp.business} / {existingApp.booth}</div>
                  </div>
                  <div style={{ display:'flex', gap:8 }}>
                    <button onClick={() => setShowStatus(s => !s)} style={{ padding:'7px 14px', background:showStatus ? `${B.amber}20` : 'transparent', border:`1px solid ${B.amber}40`, borderRadius:6, color:B.amber, fontFamily:'Space Mono,monospace', fontSize:8, cursor:'pointer', letterSpacing:1 }}>
                      {showStatus ? 'HIDE' : 'VIEW STATUS'}
                    </button>
                    <button onClick={() => setShowPrevBanner(false)} style={{ padding:'7px 14px', background:'transparent', border:'1px solid rgba(255,255,255,0.1)', borderRadius:6, color:'#666', fontFamily:'Space Mono,monospace', fontSize:8, cursor:'pointer', letterSpacing:1 }}>DISMISS</button>
                  </div>
                </div>
                {showStatus && (
                  <div style={{ borderTop:`1px solid ${B.amber}20`, padding:'16px 20px' }}>
                    <div style={{ fontFamily:'Space Mono,monospace', fontSize:9, color:'#555', letterSpacing:2, marginBottom:16 }}>APPLICATION STATUS</div>
                    <div style={{ display:'flex', alignItems:'flex-start' }}>
                      {STATUS_STEPS.map((s, i) => <div key={i} style={{ display:'flex', alignItems:'flex-start', flex: i < STATUS_STEPS.length-1 ? 1 : 0 }}>
                        <div style={{ display:'flex', flexDirection:'column', alignItems:'center', minWidth:52 }}>
                          <div style={{ width:30, height:30, borderRadius:'50%', background:s.done ? s.color : 'rgba(255,255,255,0.05)', border:`1.5px solid ${s.done ? s.color : 'rgba(255,255,255,0.1)'}`, display:'flex', alignItems:'center', justifyContent:'center', fontFamily:'Orbitron,monospace', fontSize:8, color:s.done ? B.black : '#555', marginBottom:6 }}>{s.done ? 'OK' : s.num}</div>
                          <div style={{ fontFamily:'Space Mono,monospace', fontSize:6, color:s.done ? s.color : '#444', letterSpacing:1, textAlign:'center', lineHeight:1.4 }}>{s.title}</div>
                        </div>
                        {i < STATUS_STEPS.length-1 && <div style={{ flex:1, height:1, background:s.done ? `${s.color}50` : 'rgba(255,255,255,0.06)', marginTop:15, marginLeft:4, marginRight:4 }} />}
                      </div>)}
                    </div>
                  </div>
                )}
              </div>
            )}

            <div style={{ display:'flex', alignItems:'center', gap:0, marginBottom:32 }}>
              {STEPS.map((s, i) => (
                <div key={i} style={{ display:'flex', alignItems:'center', flex: i < STEPS.length-1 ? 1 : 0 }}>
                  <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:5 }}>
                    <div style={{ width:34, height:34, borderRadius:'50%', background:i<step ? B.neonCyan : i===step ? B.amber : 'rgba(255,255,255,0.04)', border:`1.5px solid ${i<step ? B.neonCyan : i===step ? B.amber : 'rgba(255,255,255,0.1)'}`, display:'flex', alignItems:'center', justifyContent:'center', fontFamily:'Orbitron,monospace', fontSize:10, fontWeight:700, color:i<=step ? B.black : '#444', transition:'all 0.3s', flexShrink:0 }}>
                      {i < step ? '✓' : i+1}
                    </div>
                    <div style={{ fontFamily:'Space Mono,monospace', fontSize:7, color:i===step ? B.amber : i<step ? B.neonCyan : '#444', letterSpacing:1, whiteSpace:'nowrap', transition:'color 0.3s' }}>{s.label}</div>
                  </div>
                  {i < STEPS.length-1 && (
                    <div style={{ flex:1, height:1, background:i<step ? `${B.neonCyan}60` : 'rgba(255,255,255,0.07)', marginBottom:18, marginLeft:8, marginRight:8, transition:'background 0.3s' }} />
                  )}
                </div>
              ))}
            </div>

            <div className="card-3d" style={{ background:'rgba(255,255,255,0.03)', backdropFilter:'blur(20px)', border:'1px solid rgba(255,255,255,0.08)', borderRadius:16, overflow:'hidden' }}>
              <div style={{ height:3, background:`linear-gradient(90deg, ${B.neonCyan}, ${B.amber}, ${B.neonMagenta})` }} />
              <div style={{ padding:32, display:'flex', flexDirection:'column', gap:24 }}>

                {step === 0 && (
                  <div>
                    {lbl('SELECT BOOTH TYPE *')}
                    <BoothMap taken={taken} selected={form.booth} onSelect={id => setForm(f => ({ ...f, booth:id }))} />
                    <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(200px, 1fr))', gap:12 }}>
                      {BOOTHS.map(b => (
                        <BoothCard key={b.id} booth={b} selected={form.booth===b.id} taken={taken[b.id]||0}
                          onSelect={id => setForm(f => ({ ...f, booth:id }))} />
                      ))}
                    </div>
                  </div>
                )}

                {step === 1 && (
                  <>
                    <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:16 }}>
                      <div>{lbl('BUSINESS / BRAND NAME *')}<input value={form.business} onChange={set('business')} placeholder="e.g. Lagos Kicks Co." style={IS} onFocus={onFocus} onBlur={onBlur} /></div>
                      <div>{lbl('CONTACT PERSON *')}<input value={form.contact} onChange={set('contact')} placeholder="Your full name" style={IS} onFocus={onFocus} onBlur={onBlur} /></div>
                    </div>
                    <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:16 }}>
                      <div>{lbl('EMAIL ADDRESS *')}<input type="email" value={form.email} onChange={set('email')} placeholder="your@email.com" style={IS} onFocus={onFocus} onBlur={onBlur} /></div>
                      <div>{lbl('PHONE NUMBER *')}<input type="tel" value={form.phone} onChange={set('phone')} placeholder="+234 800 000 0000" style={IS} onFocus={onFocus} onBlur={onBlur} /></div>
                    </div>
                    <div>
                      {lbl('PRODUCT CATEGORY *')}
                      <div style={{ display:'flex', flexWrap:'wrap', gap:8 }}>
                        {CATEGORIES.map(c => (
                          <button key={c} type="button" onClick={() => setForm(f => ({...f, category:c}))}
                            style={{ padding:'6px 14px', background:form.category===c ? `${B.neonCyan}18` : 'rgba(255,255,255,0.04)', border:`1px solid ${form.category===c ? B.neonCyan : 'rgba(255,255,255,0.1)'}`, borderRadius:4, cursor:'pointer', fontFamily:'Space Mono,monospace', fontSize:9, color:form.category===c ? B.neonCyan : B.smoke, letterSpacing:'0.1em', transition:'all 0.2s' }}>
                            {c}
                          </button>
                        ))}
                      </div>
                    </div>
                  </>
                )}

                {step === 2 && (
                  <>
                    <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:16 }}>
                      <div>{lbl('INSTAGRAM (optional)')}<input value={form.instagram} onChange={set('instagram')} placeholder="@yourhandle" style={IS} onFocus={onFocus} onBlur={onBlur} /></div>
                      <div>{lbl('TWITTER / X (optional)')}<input value={form.twitter} onChange={set('twitter')} placeholder="@yourhandle" style={IS} onFocus={onFocus} onBlur={onBlur} /></div>
                    </div>
                    <div>{lbl('WEBSITE (optional)')}<input value={form.website} onChange={set('website')} placeholder="https://yourbrand.com" style={IS} onFocus={onFocus} onBlur={onBlur} /></div>
                    <div>{lbl('BRAND DECK / PORTFOLIO LINK (optional)')}<input value={form.deckUrl} onChange={set('deckUrl')} placeholder="Google Drive, Notion, Behance, PDF link..." style={IS} onFocus={onFocus} onBlur={onBlur} /></div>
                    <div>
                      {lbl('EXCLUSIVE DROP INTEREST')}
                      <div style={{ display:'flex', gap:8, flexWrap:'wrap' }}>
                        {['YES — I WANT A DROP', 'MAYBE — OPEN TO IT', 'NO — STANDARD ONLY'].map(opt => (
                          <button key={opt} type="button" onClick={() => setForm(f => ({...f, exclusiveDrop:opt}))}
                            style={{ flex:1, minWidth:100, padding:'9px 10px', background:form.exclusiveDrop===opt ? `${B.amber}18` : 'rgba(255,255,255,0.04)', border:`1px solid ${form.exclusiveDrop===opt ? B.amber+'60' : 'rgba(255,255,255,0.1)'}`, borderRadius:6, cursor:'pointer', fontFamily:'Space Mono,monospace', fontSize:8, color:form.exclusiveDrop===opt ? B.amber : '#666', letterSpacing:0, transition:'all 0.2s', textAlign:'center', lineHeight:1.5 }}>{opt}</button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:7 }}>
                        {lbl(`ABOUT YOUR BRAND * (${form.bio.length}/300 · min 20)`)}
                        <button type="button" onClick={generatePitch} disabled={pitchLoading} style={{ padding:'4px 10px', background:pitchLoading ? 'rgba(0,240,255,0.06)' : `${B.neonCyan}15`, border:`1px solid ${B.neonCyan}44`, borderRadius:4, color:pitchLoading ? '#444' : B.neonCyan, fontFamily:'Space Mono,monospace', fontSize:8, cursor:pitchLoading ? 'wait' : 'pointer', letterSpacing:'0.1em', whiteSpace:'nowrap', flexShrink:0 }}>
                          {pitchLoading ? 'WRITING...' : '✦ AI PITCH'}
                        </button>
                      </div>
                      <textarea value={form.bio} onChange={set('bio')} maxLength={300}
                        placeholder="Describe what you sell, your experience, and why you want to be at Sneakers Fest '26... or tap ✦ AI PITCH to generate one."
                        rows={5} style={{ ...IS, resize:'vertical', lineHeight:1.6 }}
                        onFocus={e => e.target.style.borderColor = B.neonCyan+'50'} onBlur={onBlur} />
                      {pitchError && <p style={{ fontFamily:'Space Mono,monospace', fontSize:9, color:'#ff4444', marginTop:6 }}>{pitchError}</p>}
                      {form.bio.length > 0 && form.bio.length < 20 && (
                        <p style={{ fontFamily:'Space Mono,monospace', fontSize:9, color:B.amber, marginTop:6 }}>{20-form.bio.length} more characters needed</p>
                      )}
                    </div>

                    {/* API key modal for AI pitch */}
                    {showApiKey && (
                      <div style={{ background:`${B.amber}08`, border:`1px solid ${B.amber}33`, borderRadius:8, padding:16 }}>
                        <div style={{ fontFamily:'Space Mono,monospace', fontSize:8, color:B.amber, letterSpacing:'0.2em', marginBottom:10 }}>ANTHROPIC API KEY REQUIRED</div>
                        <input type="password" value={keyInput} onChange={e => setKeyInput(e.target.value)} onKeyDown={e => { if(e.key==='Enter'){setApiKey(keyInput.trim());setShowApiKey(false);setKeyInput('')} }} placeholder="sk-ant-..." style={{ ...IS, marginBottom:8, fontSize:11 }} />
                        <div style={{ display:'flex', gap:8 }}>
                          <button type="button" onClick={() => { setApiKey(keyInput.trim()); setShowApiKey(false); setKeyInput('') }} style={{ flex:1, padding:'8px', background:B.amber, color:B.black, border:'none', borderRadius:4, fontFamily:'Space Mono,monospace', fontSize:9, fontWeight:700, cursor:'pointer' }}>SAVE & GENERATE</button>
                          <button type="button" onClick={() => setShowApiKey(false)} style={{ padding:'8px 12px', background:'transparent', color:'#555', border:'1px solid #222', borderRadius:4, fontFamily:'Space Mono,monospace', fontSize:9, cursor:'pointer' }}>SKIP</button>
                        </div>
                      </div>
                    )}
                  </>
                )}

                {step === 3 && (
                  <>
                    <div style={{ fontFamily:'Orbitron,monospace', fontSize:9, color:B.amber, letterSpacing:3 }}>REVIEW YOUR APPLICATION</div>
                    <div style={{ display:'flex', flexDirection:'column', gap:0, background:'rgba(255,255,255,0.02)', borderRadius:8, overflow:'hidden', border:'1px solid rgba(255,255,255,0.06)' }}>
                      {[
                        { label:'BOOTH',       value:selectedBooth?.label, color:B.neonCyan },
                        { label:'SIZE',        value:selectedBooth?.size },
                        { label:'PRICE',       value:selectedBooth?.price ? `₦${selectedBooth.price.toLocaleString('en-NG')}` : 'Custom — contact required', color:B.amber },
                        { label:'BUSINESS',    value:form.business },
                        { label:'CONTACT',     value:form.contact },
                        { label:'EMAIL',       value:form.email },
                        { label:'PHONE',       value:form.phone },
                        { label:'CATEGORY',    value:form.category },
                        form.instagram    ? { label:'INSTAGRAM',   value:`@${form.instagram.replace('@','')}` }  : null,
                        form.twitter      ? { label:'TWITTER',     value:`@${form.twitter.replace('@','')}` }    : null,
                        form.website      ? { label:'WEBSITE',     value:form.website }                          : null,
                        form.deckUrl      ? { label:'BRAND DECK',  value:form.deckUrl }                          : null,
                        form.exclusiveDrop ? { label:'EXCL. DROP', value:form.exclusiveDrop }                    : null,
                      ].filter(Boolean).map((item, i) => (
                        <div key={i} style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'10px 16px', borderBottom:'1px solid rgba(255,255,255,0.04)' }}>
                          <span style={{ fontFamily:'Space Mono,monospace', fontSize:8, color:'#555', letterSpacing:2 }}>{item.label}</span>
                          <span style={{ fontFamily:'Syne,sans-serif', fontSize:13, color:item.color||B.white, textAlign:'right', maxWidth:'65%', wordBreak:'break-all' }}>{item.value}</span>
                        </div>
                      ))}
                    </div>
                    <div style={{ padding:'14px 16px', background:'rgba(255,255,255,0.02)', borderRadius:8, border:'1px solid rgba(255,255,255,0.06)' }}>
                      <div style={{ fontFamily:'Space Mono,monospace', fontSize:8, color:'#555', letterSpacing:2, marginBottom:8 }}>BRAND BIO</div>
                      <div style={{ fontFamily:'Syne,sans-serif', fontSize:12, color:B.smoke, lineHeight:1.7 }}>{form.bio}</div>
                    </div>
                    <div style={{ padding:'10px 14px', background:`${B.neonCyan}08`, border:`1px solid ${B.neonCyan}20`, borderRadius:8 }}>
                      <p style={{ fontFamily:'Space Mono,monospace', fontSize:9, color:B.neonCyan }}>A confirmation email will be sent to <span style={{ color:B.white }}>{form.email}</span> after submission.</p>
                    </div>
                    {status === 'error' && (
                      <div style={{ padding:'12px 16px', background:`rgba(255,45,123,0.08)`, border:`1px solid ${B.neonMagenta}30`, borderRadius:8 }}>
                        <div style={{ fontFamily:'Space Mono,monospace', fontSize:10, color:B.neonMagenta }}>
                          Submission failed. Email <span style={{ color:B.white }}>sneakersfest088@gmail.com</span> with "Vendor Application — {form.business}"
                        </div>
                      </div>
                    )}
                  </>
                )}

                <div style={{ display:'flex', gap:12, alignItems:'center' }}>
                  {step > 0 && (
                    <button onClick={() => setStep(s => s-1)}
                      style={{ padding:'12px 22px', background:'transparent', border:'1px solid rgba(255,255,255,0.1)', borderRadius:8, color:B.smoke, fontFamily:'Orbitron,monospace', fontSize:10, letterSpacing:2, cursor:'pointer', transition:'all 0.2s' }}
                      onMouseEnter={e => { e.currentTarget.style.borderColor='rgba(255,255,255,0.25)'; e.currentTarget.style.color=B.white }}
                      onMouseLeave={e => { e.currentTarget.style.borderColor='rgba(255,255,255,0.1)'; e.currentTarget.style.color=B.smoke }}
                    >← BACK</button>
                  )}
                  <div style={{ flex:1 }} />
                  {step < 3 ? (
                    <button onClick={() => canNext() && setStep(s => s+1)} disabled={!canNext()}
                      style={{ padding:'13px 28px', background:canNext() ? B.neonCyan : 'rgba(255,255,255,0.04)', border:'none', borderRadius:8, color:canNext() ? B.black : '#444', fontFamily:'Orbitron,monospace', fontSize:11, fontWeight:700, letterSpacing:2, cursor:canNext() ? 'pointer' : 'not-allowed', boxShadow:canNext() ? `0 0 24px ${B.neonCyan}35` : 'none', transition:'all 0.2s' }}>
                      NEXT →
                    </button>
                  ) : (
                    <button onClick={submit} disabled={status === 'loading'}
                      style={{ padding:'14px 32px', background:status==='loading' ? 'rgba(255,255,255,0.04)' : B.neonCyan, border:'none', borderRadius:8, color:status==='loading' ? '#444' : B.black, fontFamily:'Orbitron,monospace', fontSize:12, fontWeight:700, letterSpacing:2, cursor:status==='loading' ? 'wait' : 'pointer', boxShadow:status==='loading' ? 'none' : `0 0 30px ${B.neonCyan}35`, transition:'all 0.2s' }}>
                      {status === 'loading'
                        ? <span style={{ display:'flex', alignItems:'center', gap:10 }}><span style={{ width:12, height:12, border:`2px solid #555`, borderTopColor:B.neonCyan, borderRadius:'50%', display:'inline-block', animation:'spin 0.8s linear infinite' }} />SUBMITTING…</span>
                        : 'SUBMIT APPLICATION →'}
                    </button>
                  )}
                </div>

                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                  <div style={{ fontFamily:'Space Mono,monospace', fontSize:7, color:'#2a2a2a', letterSpacing:1 }}>● DRAFT AUTO-SAVED</div>
                  <div style={{ fontFamily:'Space Mono,monospace', fontSize:8, color:'#333', letterSpacing:'0.15em' }}>INVITATION-CURATED / REVIEWED IN 3 DAYS</div>
                </div>
              </div>
            </div>
          </div>
        )}
        <div style={{ marginTop:48 }}>
          <div style={{ fontFamily:"'Space Mono'", fontSize:8, letterSpacing:'0.4em', color:B.smoke, marginBottom:16 }}>CONFIRMED VENDORS (PREVIEW)</div>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(180px, 1fr))', gap:12 }}>
            {CONFIRMED_VENDORS.map((v, i) => (
              <div key={i} className="card-3d" style={{ padding:'16px', background:'rgba(255,255,255,0.03)', border:`1px solid ${v.color}30`, borderRadius:8 }}>
                <div style={{ width:36, height:36, borderRadius:'50%', background:`${v.color}15`, border:`1.5px solid ${v.color}50`, marginBottom:10, display:'flex', alignItems:'center', justifyContent:'center', fontFamily:'Bebas Neue,sans-serif', fontSize:16, color:v.color }}>{v.name[0]}</div>
                <div style={{ fontFamily:'Bebas Neue,sans-serif', fontSize:15, color:B.white }}>{v.name}</div>
                <div style={{ fontFamily:'Space Mono,monospace', fontSize:7, color:v.color, marginTop:2 }}>{v.cat} / {v.city} / {v.ig}</div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ marginTop:48 }}>
          <div style={{ fontFamily:"'Space Mono'", fontSize:8, letterSpacing:'0.4em', color:B.smoke, marginBottom:16 }}>VENDOR FAQ</div>
          {FAQ.map((f, i) => (
            <div key={i} style={{ borderBottom:`1px solid ${B.charcoal}` }}>
              <button onClick={() => setOpenFaq(openFaq===i ? null : i)} style={{ width:'100%', textAlign:'left', padding:'14px 0', background:'none', border:'none', cursor:'pointer', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                <span style={{ fontFamily:"'Syne'", fontSize:'0.85rem', color:B.white }}>{f.q}</span>
                <span style={{ color:B.amber, fontSize:'1.1rem', marginLeft:12 }}>{openFaq===i ? '-' : '+'}</span>
              </button>
              {openFaq === i && <p style={{ fontFamily:"'Syne'", fontSize:'0.82rem', color:B.smoke, lineHeight:1.7, paddingBottom:14 }}>{f.a}</p>}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
