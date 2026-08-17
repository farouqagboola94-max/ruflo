import { useState, useEffect, useRef } from 'react'
import { B } from '../tokens'
import { GrainOverlay, ScanLines, SectionTag } from '../components/Shared'
import { SOCIAL_LINKS } from '../config'
import Egg from '../components/Egg'

// ── countdown to next Friday 8 PM Lagos (UTC+1) ────────────────────────────────────────────
function calcNextFriday() {
  const LAGOS = 60 * 60 * 1000
  const lagosMs = Date.now() + LAGOS
  const d = new Date(lagosMs)
  const day  = d.getUTCDay()
  const secsToday = d.getUTCHours() * 3600 + d.getUTCMinutes() * 60 + d.getUTCSeconds()
  let daysUntil = (5 - day + 7) % 7
  if (daysUntil === 0 && secsToday >= 20 * 3600) daysUntil = 7
  const targetMs = lagosMs - secsToday * 1000 + daysUntil * 86400000 + 20 * 3600000
  const diff = Math.max(0, targetMs - lagosMs)
  return {
    days:    Math.floor(diff / 86400000),
    hours:   Math.floor((diff % 86400000) / 3600000),
    minutes: Math.floor((diff % 3600000)  / 60000),
    seconds: Math.floor((diff % 60000)    / 1000),
  }
}

const pad = n => String(n).padStart(2, '0')

// ── weekly sessions ────────────────────────────────────────────────────────────────────────────────
const WEEKS = [
  {
    week: 'WEEK 1', name: 'THE DROP DISCUSSION', color: B.amber,
    desc: 'A recent or upcoming sneaker drop goes up for debate. The community votes, reacts, and delivers a verdict: cop or pass.',
    platforms: ['Instagram', 'Twitter/X', 'WhatsApp'],
    revenue: 'Engagement unlocks early access info and exclusive festival content.',
    output: 'Community verdict graphic · published Saturday',
  },
  {
    week: 'WEEK 2', name: 'THE CHALLENGE', color: B.neonCyan,
    desc: 'Sneaker challenge of the week. Best recent cop, most creative lace swap, oldest pair in rotation, worst resale decision ever made.',
    platforms: ['Instagram', 'TikTok', 'Reels', 'Snapchat'],
    revenue: '₦500–₦1,000 paid entry for prize pool weeks. Free with sponsor-funded prize.',
    output: 'Submission roundup · winner announced Sunday',
  },
  {
    week: 'WEEK 3', name: 'THE CONVERSATION', color: B.neonMagenta,
    desc: 'A real topic from Lagos sneaker culture. Who set the culture here. Why certain brands dominate. The ethics of resale.',
    platforms: ['Twitter Space', 'Instagram Live'],
    revenue: '₦1,000 guaranteed question slot for paid listeners.',
    output: 'Audio clip highlights · quote graphics · Substack writeup',
  },
  {
    week: 'WEEK 4', name: 'THE GAME', color: B.neonLime,
    desc: 'Sneaker trivia. Rapid-fire. Knowledge test. Themed rounds: Air Max history, Nigerian streetwear brands, collab guessing.',
    platforms: ['Twitter/X', 'Telegram'],
    revenue: '₦1,000–₦2,000 paid entry with cash or exclusive access prize.',
    output: 'Leaderboard post · winner highlight',
  },
]

// ── past session archive ───────────────────────────────────────────────────────────────────────────────────
const PAST = [
  { date:'MAY 30', week:'WEEK 2 · CHALLENGE', topic:'Cleanest cop of the month',       stat:'47 entries',   winner:'@sole.lagos',         color:B.neonCyan    },
  { date:'MAY 23', week:'WEEK 1 · DROP DISC', topic:'Nike Air Max DN — Cop or Pass?',  stat:'134 votes',    winner:'PASS · 71%',          color:B.amber       },
  { date:'MAY 16', week:'WEEK 4 · THE GAME',  topic:'Jordan Brand History Trivia',     stat:'29 players',   winner:'@grailseeker_abj',    color:B.neonLime    },
  { date:'MAY 9',  week:'WEEK 3 · CONVO',     topic:'Why Lagos sets the African agenda',stat:'203 engaged', winner:'Full thread live',    color:B.neonMagenta },
  { date:'MAY 2',  week:'WEEK 2 · CHALLENGE', topic:'Worst resale decision you made',  stat:'88 confessions',winner:'@kicks.confessions', color:B.neonCyan    },
]

// ── challenge categories ───────────────────────────────────────────────────────────────────────────────────
const CATS = ['DROP DISCUSSION', 'CHALLENGE', 'CONVERSATION', 'TRIVIA / GAME']

export default function FridayNightProtocol() {
  const [active,    setActive]  = useState(0)
  const [cd,        setCd]      = useState(calcNextFriday)
  const [form,      setForm]    = useState({ handle:'', category:'DROP DISCUSSION', text:'' })
  const [submitted, setSubmitted] = useState(false)
  const [subCount,  setSubCount]  = useState(0)
  const [formErr,   setFormErr]   = useState('')
  const archiveRef = useRef(null)
  const w = WEEKS[active]

  // countdown tick
  useEffect(() => {
    const t = setInterval(() => setCd(calcNextFriday()), 1000)
    return () => clearInterval(t)
  }, [])

  // load existing submission count
  useEffect(() => {
    try {
      const subs = JSON.parse(localStorage.getItem('sf26_fnp_submissions') || '[]')
      setSubCount(subs.length)
    } catch {}
  }, [])

  function handleSubmit(e) {
    e.preventDefault()
    if (!form.handle.trim()) return setFormErr('Add your Instagram or Twitter handle.')
    if (form.text.trim().length < 10) return setFormErr('Write at least 10 characters.')
    setFormErr('')
    try {
      const subs = JSON.parse(localStorage.getItem('sf26_fnp_submissions') || '[]')
      subs.unshift({ ...form, submittedAt: Date.now() })
      localStorage.setItem('sf26_fnp_submissions', JSON.stringify(subs.slice(0, 50)))
      setSubCount(subs.length)
    } catch {}
    setSubmitted(true)
  }

  function resetForm() {
    setForm({ handle:'', category:'DROP DISCUSSION', text:'' })
    setSubmitted(false)
    setFormErr('')
  }

  return (
    <section id="fnp" style={{ background:B.black, padding:'80px 20px', position:'relative', overflow:'hidden' }}>
      <GrainOverlay />
      <Egg id="egg-011" corner="top-right" />
      <Egg id="egg-012" corner="bottom-left" />
      <ScanLines />
      <div style={{ position:'absolute', bottom:-100, left:'50%', transform:'translateX(-50%)', width:600, height:400, borderRadius:'50%', background:`radial-gradient(ellipse, ${B.amber}12 0%, transparent 70%)`, filter:'blur(60px)', pointerEvents:'none' }} />

      <div style={{ maxWidth:960, margin:'0 auto', position:'relative', zIndex:2 }}>

        {/* ── header ── */}
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', flexWrap:'wrap', gap:20, marginBottom:32 }}>
          <div>
            <SectionTag color={B.amber}>COMMUNITY ENGINE</SectionTag>
            <h2 className="reveal-3d text-3d" style={{ fontFamily:"'Bebas Neue'", fontSize:'clamp(2.5rem,7vw,5rem)', color:B.white, letterSpacing:'0.04em', marginBottom:8 }}>
              THE FRIDAY NIGHT PROTOCOL
            </h2>
            <p style={{ color:B.smoke, fontFamily:"'Space Mono'", fontSize:'0.78rem', marginBottom:10, maxWidth:520, lineHeight:1.7 }}>
              Every Friday night, the Sneakers Fest community activates. Content goes out. Conversations start. Games run. Drops get discussed.
            </p>
            <p style={{ color:B.amber, fontFamily:"'Space Mono'", fontSize:'0.68rem', letterSpacing:'0.1em' }}>
              It's a ritual. Most Lagos events run for a day and go dark. FNP is why Sneakers Fest doesn't.
            </p>
          </div>

          {/* countdown to next Friday */}
          <div className="card-3d" style={{ background:'rgba(255,255,255,0.02)', border:`1px solid ${B.amber}30`, borderRadius:10, padding:'18px 22px', textAlign:'center', flexShrink:0 }}>
            <div style={{ fontFamily:"'Space Mono'", fontSize:8, color: B.smoke, letterSpacing:3, marginBottom:8 }}>NEXT SESSION IN</div>
            <div style={{ display:'flex', gap:10, alignItems:'flex-start' }}>
              {[['days', cd.days], ['hrs', cd.hours], ['min', cd.minutes], ['sec', cd.seconds]].map(([lbl, val]) => (
                <div key={lbl} style={{ textAlign:'center' }}>
                  <div style={{ fontFamily:"'Orbitron',monospace", fontSize:28, fontWeight:900, color:B.amber, lineHeight:1, minWidth:40 }}>{pad(val)}</div>
                  <div style={{ fontFamily:"'Space Mono'", fontSize: 9, color: B.dim, letterSpacing:2, marginTop:3 }}>{lbl.toUpperCase()}</div>
                </div>
              ))}
            </div>
            <div style={{ fontFamily:"'Space Mono'", fontSize:8, color:B.amber, letterSpacing:2, marginTop:10 }}>EVERY FRIDAY 8 PM LAGOS</div>
          </div>
        </div>

        {/* ── week selector + detail ── */}
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:32, marginBottom:48 }}>
          <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
            {WEEKS.map((wk, i) => (
              <button key={i} onClick={() => setActive(i)} style={{ textAlign:'left', padding:'16px 20px', background:active===i ? `${wk.color}12` : B.charcoal, border:`1px solid ${active===i ? wk.color : B.gunmetal}`, borderLeft:`3px solid ${active===i ? wk.color : B.gunmetal}`, borderRadius:6, cursor:'pointer', transition:'all 0.2s' }}>
                <div style={{ fontFamily:"'Space Mono'", fontSize:'0.58rem', letterSpacing:'0.2em', color:active===i ? wk.color : B.smoke, marginBottom:4 }}>{wk.week}</div>
                <div style={{ fontFamily:"'Bebas Neue'", fontSize:'1.1rem', letterSpacing:'0.06em', color:active===i ? B.white : B.smoke, transition:'color 0.2s' }}>{wk.name}</div>
              </button>
            ))}
          </div>

          <div className="card-3d" style={{ background:B.charcoal, borderRadius:10, padding:'28px', border:`1px solid ${B.gunmetal}`, borderTop:`3px solid ${w.color}` }}>
            <div style={{ fontFamily:"'Space Mono'", fontSize:'0.58rem', letterSpacing:'0.2em', color:w.color, marginBottom:6 }}>{w.week} · MONTHLY ROTATION</div>
            <h3 style={{ fontFamily:"'Bebas Neue'", fontSize:'1.6rem', color:B.white, letterSpacing:'0.04em', marginBottom:16 }}>{w.name}</h3>
            <p style={{ color:B.smoke, fontFamily:"'Syne'", fontSize:'0.88rem', lineHeight:1.75, marginBottom:20 }}>{w.desc}</p>
            <div style={{ marginBottom:16 }}>
              <div style={{ fontFamily:"'Space Mono'", fontSize:'0.58rem', letterSpacing:'0.2em', color:B.smoke, marginBottom:8 }}>PLATFORMS</div>
              <div style={{ display:'flex', gap:8, flexWrap:'wrap' }}>
                {w.platforms.map(p => (
                  <span key={p} style={{ background:`${w.color}12`, border:`1px solid ${w.color}40`, borderRadius:20, padding:'3px 10px', fontFamily:"'Space Mono'", fontSize:'0.6rem', color:w.color }}>{p}</span>
                ))}
              </div>
            </div>
            <div style={{ background:B.black, borderRadius:6, padding:'12px 14px', marginBottom:16, borderLeft:`2px solid ${w.color}` }}>
              <div style={{ fontFamily:"'Space Mono'", fontSize:'0.58rem', letterSpacing:'0.15em', color:B.smoke, marginBottom:4 }}>REVENUE HOOK</div>
              <div style={{ fontFamily:"'Syne'", fontSize:'0.8rem', color:B.white }}>{w.revenue}</div>
            </div>
            <div style={{ fontFamily:"'Space Mono'", fontSize:'0.6rem', color:B.smoke }}>
              <span style={{ color:w.color, marginRight:6 }}>&#x25BA;</span>{w.output}
            </div>
          </div>
        </div>

        {/* ── past sessions archive ── */}
        <div style={{ marginBottom:48 }}>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:16 }}>
            <div style={{ fontFamily:"'Space Mono'", fontSize:'0.62rem', letterSpacing:'0.25em', color:B.smoke }}>PAST SESSIONS</div>
            <div style={{ fontFamily:"'Space Mono'", fontSize:'0.58rem', color: B.dim, letterSpacing:2 }}>scroll →</div>
          </div>
          <div ref={archiveRef} style={{ display:'flex', gap:12, overflowX:'auto', paddingBottom:8, scrollbarWidth:'none' }}>
            {PAST.map((s, i) => (
              <div key={i} className="card-3d" style={{ flexShrink:0, width:220, background:B.charcoal, border:`1px solid ${s.color}25`, borderTop:`2px solid ${s.color}`, borderRadius:8, padding:'14px 16px' }}>
                <div style={{ fontFamily:"'Space Mono'", fontSize:8, color:s.color, letterSpacing:2, marginBottom:4 }}>{s.date} · 2026</div>
                <div style={{ fontFamily:"'Space Mono'", fontSize: 9, color: B.dim, letterSpacing:1, marginBottom:8 }}>{s.week}</div>
                <div style={{ fontFamily:"'Bebas Neue'", fontSize:13, color:B.white, lineHeight:1.3, marginBottom:12 }}>{s.topic}</div>
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-end' }}>
                  <div style={{ fontFamily:"'Orbitron',monospace", fontSize:10, color:s.color, fontWeight:700 }}>{s.stat}</div>
                  <div style={{ fontFamily:"'Space Mono'", fontSize: 9, color: B.dim }}>{s.winner}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── challenge submission ── */}
        <div className="card-3d" style={{ background:B.charcoal, borderRadius:10, padding:'28px', border:`1px solid ${B.gunmetal}`, marginBottom:48 }}>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:20, flexWrap:'wrap', gap:8 }}>
            <div>
              <div style={{ fontFamily:"'Space Mono'", fontSize:'0.62rem', letterSpacing:'0.25em', color:B.amber, marginBottom:4 }}>THIS WEEK'S FNP</div>
              <div style={{ fontFamily:"'Bebas Neue'", fontSize:'1.4rem', color:B.white, letterSpacing:'0.04em' }}>DROP YOUR CHALLENGE SUBMISSION</div>
            </div>
            {subCount > 0 && (
              <div style={{ background:`${B.amber}15`, border:`1px solid ${B.amber}30`, borderRadius:20, padding:'6px 14px', fontFamily:"'Orbitron',monospace", fontSize:9, color:B.amber, fontWeight:700 }}>
                {subCount} SUBMITTED THIS WEEK
              </div>
            )}
          </div>

          {submitted ? (
            <div style={{ textAlign:'center', padding:'30px 0' }}>
              <div style={{ fontSize:32, marginBottom:12 }}>🔥</div>
              <div style={{ fontFamily:"'Bebas Neue'", fontSize:'1.8rem', color:B.amber, letterSpacing:'0.06em', marginBottom:8 }}>YOU'RE IN THE MIX</div>
              <div style={{ fontFamily:"'Space Mono'", fontSize:'0.7rem', color:B.smoke, marginBottom:20 }}>Your submission is noted. Winners get announced on Sunday — follow @sneakersfest5555 to catch it.</div>
              <button onClick={resetForm} style={{ background:'transparent', border:`1px solid ${B.amber}40`, borderRadius:20, padding:'8px 24px', fontFamily:"'Space Mono'", fontSize:'0.65rem', color:B.amber, cursor:'pointer', letterSpacing:1 }}>
                SUBMIT ANOTHER →
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} style={{ display:'flex', flexDirection:'column', gap:14 }}>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14 }}>
                <div>
                  <div style={{ fontFamily:"'Space Mono'", fontSize:'0.58rem', letterSpacing:'0.15em', color: B.smoke, marginBottom:6 }}>YOUR HANDLE</div>
                  <input aria-label="Your handle"
                    value={form.handle}
                    onChange={e => setForm(f => ({ ...f, handle:e.target.value }))}
                    placeholder="@yourhandle"
                    style={{ width:'100%', background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.1)', borderRadius:6, color:B.white, padding:'10px 14px', fontFamily:"'Space Mono'", fontSize:'0.72rem', outline:'none', boxSizing:'border-box' }}
                  />
                </div>
                <div>
                  <div style={{ fontFamily:"'Space Mono'", fontSize:'0.58rem', letterSpacing:'0.15em', color: B.smoke, marginBottom:6 }}>CATEGORY</div>
                  <select aria-label="Category"
                    value={form.category}
                    onChange={e => setForm(f => ({ ...f, category:e.target.value }))}
                    style={{ width:'100%', background:'#1a1a1a', border:'1px solid rgba(255,255,255,0.1)', borderRadius:6, color:B.white, padding:'10px 14px', fontFamily:"'Space Mono'", fontSize:'0.72rem', outline:'none', cursor:'pointer', boxSizing:'border-box' }}>
                    {CATS.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <div style={{ fontFamily:"'Space Mono'", fontSize:'0.58rem', letterSpacing:'0.15em', color: B.smoke, marginBottom:6 }}>YOUR SUBMISSION</div>
                <textarea aria-label="Your submission"
                  value={form.text}
                  onChange={e => setForm(f => ({ ...f, text:e.target.value }))}
                  placeholder="Drop your response, entry, or answer here..."
                  rows={3}
                  style={{ width:'100%', background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.1)', borderRadius:6, color:B.white, padding:'10px 14px', fontFamily:"'Space Mono'", fontSize:'0.72rem', outline:'none', resize:'vertical', boxSizing:'border-box' }}
                />
              </div>
              {formErr && <div style={{ fontFamily:"'Space Mono'", fontSize:'0.65rem', color:B.neonMagenta }}>{formErr}</div>}
              <button type="submit" style={{ alignSelf:'flex-start', background:B.amber, color:B.black, border:'none', borderRadius:6, padding:'12px 32px', fontFamily:"'Bebas Neue'", fontSize:'1rem', letterSpacing:'0.1em', cursor:'pointer', boxShadow:`0 0 20px ${B.amber}30`, transition:'transform 0.15s' }}
                onMouseEnter={e => e.currentTarget.style.transform='scale(1.03)'}
                onMouseLeave={e => e.currentTarget.style.transform='scale(1)'}>
                SUBMIT TO FNP →
              </button>
            </form>
          )}
        </div>

        {/* ── revenue math ── */}
        <div className="card-3d" style={{ marginBottom:36, padding:'28px', background:B.charcoal, borderRadius:10, border:`1px solid ${B.gunmetal}` }}>
          <div style={{ fontFamily:"'Space Mono'", fontSize:'0.62rem', letterSpacing:'0.25em', color:B.amber, marginBottom:20 }}>THE MATH</div>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(180px, 1fr))', gap:20 }}>
            {[
              { label:'Per participant, per paid session', value:'₦500–₦2,000' },
              { label:'Target participants by Month 3',    value:'50+' },
              { label:'Pre-event participation revenue',  value:'₦1M+' },
              { label:'Sessions per year',                 value:'52 Fridays' },
            ].map((m, i) => (
              <div key={i}>
                <div style={{ fontFamily:"'Orbitron'", fontSize:i < 2 ? '1.4rem' : '1.1rem', color:B.amber, fontWeight:700 }}>{m.value}</div>
                <div style={{ fontFamily:"'Space Mono'", fontSize:'0.62rem', color:B.smoke, marginTop:4, lineHeight:1.5 }}>{m.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* ── CTA ── */}
        <div style={{ display:'flex', gap:12, flexWrap:'wrap', alignItems:'center' }}>
          <a href={SOCIAL_LINKS.whatsapp} target="_blank" rel="noopener noreferrer"
            style={{ display:'inline-block', background:'#25D366', color:B.black, padding:'12px 32px', fontFamily:"'Bebas Neue'", fontSize:'1.1rem', letterSpacing:'0.1em', textDecoration:'none', borderRadius:4, boxShadow:'0 0 20px rgba(37,211,102,0.4)' }}>
            JOIN ON WHATSAPP
          </a>
          <a href={SOCIAL_LINKS.instagram} target="_blank" rel="noopener noreferrer"
            style={{ display:'inline-block', background:'transparent', color:'#E1306C', border:'1px solid #E1306C60', padding:'12px 28px', fontFamily:"'Bebas Neue'", fontSize:'1.1rem', letterSpacing:'0.1em', textDecoration:'none', borderRadius:4 }}>
            FOLLOW @SNEAKERSFEST5555
          </a>
          <a href={SOCIAL_LINKS.snapchat} target="_blank" rel="noopener noreferrer"
            style={{ display:'inline-block', background:'transparent', color:B.amber, border:`1px solid ${B.amber}60`, padding:'12px 28px', fontFamily:"'Bebas Neue'", fontSize:'1.1rem', letterSpacing:'0.1em', textDecoration:'none', borderRadius:4 }}>
            ADD ON SNAPCHAT
          </a>
          <p style={{ color:B.smoke, fontFamily:"'Space Mono'", fontSize:'0.65rem' }}>Every Friday · 8 PM Lagos · Free to follow, paid to compete</p>
        </div>
      </div>
    </section>
  )
}
