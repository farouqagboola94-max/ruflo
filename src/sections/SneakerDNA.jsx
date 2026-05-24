import { useState } from 'react'
import { B } from '../tokens'

const QUESTIONS = [
  {
    q: 'DROP DAY. ALARM GOES OFF. FIRST MOVE?',
    options: [
      { text: "Check SNKRS before you're even awake.", type: 'HYPE' },
      { text: 'You already copped last night. Go back to sleep.', type: 'CURATOR' },
      { text: 'Sketch the colorway before you forget the dream.', type: 'CREATIVE' },
      { text: "You've known about this drop for 3 months.", type: 'PURIST' },
    ],
  },
  {
    q: 'YOUR GRAIL IS...',
    options: [
      { text: "Nike Air Max 1 OG '87. Undefeated.", type: 'PURIST' },
      { text: 'Jordan 4 Travis Scott. Secured.', type: 'HYPE' },
      { text: 'The pair that completes the timeline.', type: 'CURATOR' },
      { text: 'The custom that exists only in your head.', type: 'CREATIVE' },
    ],
  },
  {
    q: 'SOMEONE ASKS ABOUT YOUR FIT. YOU SAY...',
    options: [
      { text: "'These dropped in '85. First colorway ever.'", type: 'PURIST' },
      { text: "'W. SNKRS. Still can't believe it.'", type: 'HYPE' },
      { text: "'They sit next to my '01s and '09s.'", type: 'CURATOR' },
      { text: "'I painted these myself.'", type: 'CREATIVE' },
    ],
  },
  {
    q: 'SATURDAY MARKET IN LAGOS. YOU ARE HUNTING FOR...',
    options: [
      { text: 'Vintage OGs. Condition is irrelevant.', type: 'PURIST' },
      { text: 'Connects. Proxies. Access.', type: 'HYPE' },
      { text: 'The missing chapter in the collection.', type: 'CURATOR' },
      { text: 'Reference material for the next custom.', type: 'CREATIVE' },
    ],
  },
  {
    q: 'EKO ATLANTIC. DECEMBER 12. YOU WALK IN WEARING...',
    options: [
      { text: 'The OG. Nothing else makes sense.', type: 'PURIST' },
      { text: 'Whatever dropped last Friday.', type: 'HYPE' },
      { text: 'The pair that tells your whole story.', type: 'CURATOR' },
      { text: 'The custom. Obviously.', type: 'CREATIVE' },
    ],
  },
]

const ARCHETYPES = {
  PURIST: {
    title: 'THE PURIST',
    subtitle: 'Lagos Heritage Carrier',
    color: B.amber,
    badge: '\u{1F3DB}️',
    description:
      "You don't wear shoes — you carry history. Your collection is a museum nobody's been invited to yet. When December 12 comes, you'll be the one standing next to a pair that changed everything, explaining why the OG matters while everyone else chases hype. Lagos needs more of you.",
    pair: 'Nike Air Force 1 Low · 1982',
    frequency: 'HERITAGE',
    callout: 'The OGs will be there. Do not be late.',
  },
  HYPE: {
    title: 'THE W COLLECTOR',
    subtitle: 'Lagos Velocity Engine',
    color: B.neonMagenta,
    badge: '⚡',
    description:
      "The city respects the W. You've refreshed at 3AM and felt nothing but purpose. You move fast, cop faster, and you've never missed a drop that truly mattered. Everyone knows your name on release day. December 12 was built for your energy.",
    pair: 'Air Jordan 4 · Travis Scott',
    frequency: 'VELOCITY',
    callout: 'December 12. Be first ones in.',
  },
  CURATOR: {
    title: 'THE ARCHIVIST',
    subtitle: 'Lagos Storyteller',
    color: B.neonCyan,
    badge: '📚',
    description:
      "Every pair tells a chapter. You don't own shoes — you build archives. Your collection could silence an entire room. When people see your shelf, they read your autobiography. Eko Atlantic will feel your presence before you even speak.",
    pair: 'Nike Air Max 97 · Silver Bullet',
    frequency: 'LEGACY',
    callout: 'Your archive expands on December 12.',
  },
  CREATIVE: {
    title: 'THE ARCHITECT',
    subtitle: 'Lagos Culture Maker',
    color: B.neonLime,
    badge: '🎨',
    description:
      "You see blank canvas where others see a sole. Customs, colorways, content — you make culture instead of consuming it. The event does not end when the music stops. Your art will outlast the night. Lagos runs on people like you.",
    pair: 'Custom 1-of-1 · Unverifiable, Unbeatable',
    frequency: 'SIGNAL',
    callout: 'The canvas will be waiting for you.',
  },
}

export default function SneakerDNA() {
  const [phase, setPhase] = useState('intro')
  const [step, setStep] = useState(0)
  const [answers, setAnswers] = useState([])
  const [selected, setSelected] = useState(null)
  const [result, setResult] = useState(null)
  const [shared, setShared] = useState(false)

  const start = () => {
    setPhase('quiz')
    setStep(0)
    setAnswers([])
    setSelected(null)
    setResult(null)
  }

  const pick = (type) => {
    if (selected !== null) return
    setSelected(type)
    setTimeout(() => {
      const next = [...answers, type]
      if (step < QUESTIONS.length - 1) {
        setAnswers(next)
        setStep(s => s + 1)
        setSelected(null)
      } else {
        const tally = next.reduce((acc, t) => ({ ...acc, [t]: (acc[t] || 0) + 1 }), {})
        const winner = Object.entries(tally).sort((a, b) => b[1] - a[1])[0][0]
        setResult(winner)
        setPhase('result')
      }
    }, 350)
  }

  const handleShare = async () => {
    const a = ARCHETYPES[result]
    const text = `My Sneaker DNA: ${a.title}\n\n"${a.description.slice(0, 100)}..."\n\nFind yours → sneakers-fest-26.netlify.app`
    if (navigator.share) {
      try { await navigator.share({ title: 'My Sneaker DNA', text, url: window.location.href }) } catch {}
    } else {
      try { await navigator.clipboard.writeText(text); setShared(true); setTimeout(() => setShared(false), 2500) } catch {}
    }
  }

  const q = QUESTIONS[step]
  const arch = result ? ARCHETYPES[result] : null

  return (
    <section
      id="dna"
      style={{
        background: B.void,
        padding: '100px 0',
        position: 'relative',
        overflow: 'hidden',
        minHeight: '92vh',
        display: 'flex',
        alignItems: 'center',
      }}
    >
      <div style={{ position:'absolute', top:'15%', right:'-8%', width:600, height:600, background:B.amber+'08', borderRadius:'50%', filter:'blur(120px)', pointerEvents:'none' }} />
      <div style={{ position:'absolute', bottom:'10%', left:'-8%', width:500, height:500, background:B.neonMagenta+'08', borderRadius:'50%', filter:'blur(100px)', pointerEvents:'none' }} />
      <div style={{ position:'absolute', top:'50%', left:'50%', transform:'translate(-50%,-50%)', width:700, height:700, background:B.neonCyan+'04', borderRadius:'50%', filter:'blur(140px)', pointerEvents:'none' }} />

      <div style={{ maxWidth:780, margin:'0 auto', padding:'0 24px', position:'relative', zIndex:10, width:'100%' }}>

        {/* INTRO */}
        {phase === 'intro' && (
          <div style={{ textAlign:'center', animation:'fadeUp 0.7s ease both' }}>
            <p style={{ fontFamily:'Bebas Neue, sans-serif', color:B.amber, fontSize:13, letterSpacing:6, marginBottom:16 }}>COMMUNITY EXPERIENCE</p>
            <h2 style={{ fontFamily:'Bebas Neue, sans-serif', fontSize:'clamp(54px, 11vw, 108px)', color:B.white, lineHeight:0.88, letterSpacing:2, marginBottom:16 }}>
              WHAT'S YOUR<br />
              <span style={{ color:B.amber, textShadow:`0 0 60px ${B.amber}55` }}>SNEAKER DNA?</span>
            </h2>
            <p style={{ fontFamily:'Syne, sans-serif', color:B.smoke, fontSize:17, maxWidth:420, margin:'20px auto 52px', lineHeight:1.7 }}>
              5 questions. The city will know exactly who you are.
            </p>
            <button
              onClick={start}
              style={{ padding:'18px 56px', background:B.amber, color:B.black, fontFamily:'Bebas Neue, sans-serif', fontSize:22, letterSpacing:3, borderRadius:8, border:'none', cursor:'pointer', boxShadow:`0 0 50px ${B.amber}45`, transition:'transform 0.2s, box-shadow 0.2s' }}
              onMouseEnter={e => { e.currentTarget.style.transform='scale(1.05)'; e.currentTarget.style.boxShadow=`0 0 70px ${B.amber}65` }}
              onMouseLeave={e => { e.currentTarget.style.transform='scale(1)'; e.currentTarget.style.boxShadow=`0 0 50px ${B.amber}45` }}
            >
              REVEAL YOURSELF →
            </button>
            <div style={{ display:'flex', gap:10, justifyContent:'center', marginTop:60, flexWrap:'wrap' }}>
              {Object.values(ARCHETYPES).map(a => (
                <div key={a.title} style={{ padding:'8px 16px', borderRadius:20, border:`1px solid ${a.color}30`, background:a.color+'0a' }}>
                  <span style={{ fontFamily:'Bebas Neue, sans-serif', fontSize:13, color:a.color, letterSpacing:2 }}>{a.badge} {a.title}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* QUIZ */}
        {phase === 'quiz' && (
          <div key={`q${step}`} style={{ animation:'fadeUp 0.4s ease both' }}>
            <div style={{ display:'flex', gap:8, justifyContent:'center', marginBottom:52 }}>
              {QUESTIONS.map((_, i) => (
                <div key={i} style={{ height:4, flex:1, maxWidth:64, borderRadius:2, background: i <= step ? B.amber : 'rgba(255,255,255,0.12)', boxShadow: i === step ? `0 0 10px ${B.amber}` : 'none', transition:'background 0.3s', opacity: i > step ? 0.35 : 1 }} />
              ))}
            </div>
            <p style={{ fontFamily:'Bebas Neue, sans-serif', color:B.amber, fontSize:12, letterSpacing:5, textAlign:'center', marginBottom:14 }}>QUESTION {step + 1} / {QUESTIONS.length}</p>
            <h2 style={{ fontFamily:'Bebas Neue, sans-serif', fontSize:'clamp(26px, 5vw, 50px)', color:B.white, lineHeight:1.05, letterSpacing:1, textAlign:'center', marginBottom:40 }}>{q.q}</h2>
            <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
              {q.options.map(({ text, type }) => {
                const a = ARCHETYPES[type]
                const isSel = selected === type
                return (
                  <button
                    key={text}
                    onClick={() => pick(type)}
                    disabled={selected !== null}
                    style={{ width:'100%', padding:'20px 24px', background: isSel ? a.color+'18' : 'rgba(255,255,255,0.03)', border:`1px solid ${isSel ? a.color+'70' : 'rgba(255,255,255,0.09)'}`, borderRadius:12, cursor: selected ? 'default' : 'pointer', textAlign:'left', backdropFilter:'blur(12px)', transform: isSel ? 'scale(1.01)' : 'scale(1)', boxShadow: isSel ? `0 0 28px ${a.color}20` : 'none', transition:'all 0.2s ease' }}
                    onMouseEnter={e => { if (!selected) { e.currentTarget.style.background=a.color+'10'; e.currentTarget.style.borderColor=a.color+'45' } }}
                    onMouseLeave={e => { if (!isSel) { e.currentTarget.style.background='rgba(255,255,255,0.03)'; e.currentTarget.style.borderColor='rgba(255,255,255,0.09)' } }}
                  >
                    <div style={{ display:'flex', alignItems:'center', gap:14 }}>
                      <div style={{ width:10, height:10, borderRadius:'50%', flexShrink:0, background: isSel ? a.color : 'transparent', border:`2px solid ${isSel ? a.color : 'rgba(255,255,255,0.22)'}`, boxShadow: isSel ? `0 0 12px ${a.color}` : 'none', transition:'all 0.2s' }} />
                      <span style={{ fontFamily:'Syne, sans-serif', fontSize:15, color: isSel ? B.white : B.smoke, lineHeight:1.45 }}>{text}</span>
                    </div>
                  </button>
                )
              })}
            </div>
          </div>
        )}

        {/* RESULT */}
        {phase === 'result' && arch && (
          <div style={{ textAlign:'center', animation:'fadeUp 0.7s ease both' }}>
            <p style={{ fontFamily:'Bebas Neue, sans-serif', color:arch.color, fontSize:12, letterSpacing:6, marginBottom:16 }}>YOUR SNEAKER DNA IS</p>
            <div style={{ fontSize:80, lineHeight:1, marginBottom:8 }}>{arch.badge}</div>
            <h2 style={{ fontFamily:'Bebas Neue, sans-serif', fontSize:'clamp(56px, 13vw, 116px)', color:arch.color, lineHeight:0.85, letterSpacing:2, marginBottom:6, textShadow:`0 0 80px ${arch.color}60, 0 0 160px ${arch.color}25` }}>
              {arch.title}
            </h2>
            <p style={{ fontFamily:'Bebas Neue, sans-serif', color:B.smoke, fontSize:15, letterSpacing:5, marginBottom:36 }}>{arch.subtitle}</p>
            <div style={{ background:`linear-gradient(135deg, ${arch.color}10, transparent)`, border:`1px solid ${arch.color}28`, borderRadius:16, padding:'32px', backdropFilter:'blur(20px)', textAlign:'left', position:'relative', overflow:'hidden', marginBottom:32 }}>
              <div style={{ position:'absolute', top:0, left:0, right:0, height:3, background:`linear-gradient(90deg, ${arch.color}, ${arch.color}30)` }} />
              <p style={{ fontFamily:'Syne, sans-serif', fontSize:16, color:B.white, lineHeight:1.8, marginBottom:28 }}>“{arch.description}”</p>
              <div style={{ display:'flex', gap:40, flexWrap:'wrap', marginBottom:20 }}>
                <div>
                  <div style={{ fontFamily:'Bebas Neue, sans-serif', fontSize:10, color:B.smoke, letterSpacing:3, marginBottom:4 }}>SIGNATURE PAIR</div>
                  <div style={{ fontFamily:'Bebas Neue, sans-serif', fontSize:17, color:arch.color, letterSpacing:1 }}>{arch.pair}</div>
                </div>
                <div>
                  <div style={{ fontFamily:'Bebas Neue, sans-serif', fontSize:10, color:B.smoke, letterSpacing:3, marginBottom:4 }}>LAGOS FREQUENCY</div>
                  <div style={{ fontFamily:'Bebas Neue, sans-serif', fontSize:17, color:arch.color, letterSpacing:4 }}>{arch.frequency}</div>
                </div>
              </div>
              <div style={{ padding:'14px 18px', background:arch.color+'12', border:`1px solid ${arch.color}25`, borderRadius:8 }}>
                <span style={{ fontFamily:'Bebas Neue, sans-serif', fontSize:14, color:arch.color, letterSpacing:2 }}>{arch.callout}</span>
              </div>
            </div>
            <div style={{ display:'flex', gap:12, justifyContent:'center', flexWrap:'wrap', marginBottom:20 }}>
              <button
                onClick={handleShare}
                style={{ padding:'14px 32px', background:arch.color, color:B.black, fontFamily:'Bebas Neue, sans-serif', fontSize:17, letterSpacing:2, borderRadius:8, border:'none', cursor:'pointer', boxShadow:`0 0 32px ${arch.color}45`, transition:'transform 0.2s, box-shadow 0.2s' }}
                onMouseEnter={e => { e.currentTarget.style.transform='scale(1.04)'; e.currentTarget.style.boxShadow=`0 0 48px ${arch.color}65` }}
                onMouseLeave={e => { e.currentTarget.style.transform='scale(1)'; e.currentTarget.style.boxShadow=`0 0 32px ${arch.color}45` }}
              >
                {shared ? '✓ COPIED!' : '↗ SHARE YOUR DNA'}
              </button>
              <button
                onClick={start}
                style={{ padding:'14px 28px', background:'transparent', color:B.smoke, fontFamily:'Bebas Neue, sans-serif', fontSize:17, letterSpacing:2, borderRadius:8, border:'1px solid rgba(255,255,255,0.14)', cursor:'pointer', transition:'color 0.2s, border-color 0.2s' }}
                onMouseEnter={e => { e.currentTarget.style.color=B.white; e.currentTarget.style.borderColor='rgba(255,255,255,0.30)' }}
                onMouseLeave={e => { e.currentTarget.style.color=B.smoke; e.currentTarget.style.borderColor='rgba(255,255,255,0.14)' }}
              >
                TAKE AGAIN
              </button>
            </div>
            <p style={{ fontFamily:'Bebas Neue, sans-serif', color:B.smoke+'60', fontSize:13, letterSpacing:3 }}>SEE YOU AT EKO ATLANTIC · DECEMBER 12, 2026</p>
          </div>
        )}

      </div>
    </section>
  )
}
