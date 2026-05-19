import { useState } from 'react'
import { B } from '../tokens'

const LISTMONK_URL = import.meta.env.VITE_LISTMONK_URL || 'http://localhost:9000'
const LIST_UUID = import.meta.env.VITE_LISTMONK_LIST_UUID || ''

export default function Newsletter() {
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [status, setStatus] = useState(null)
  const [err, setErr] = useState('')

  async function subscribe(e) {
    e.preventDefault()
    if (!email) return
    setStatus('loading')
    setErr('')
    try {
      const res = await fetch(`${LISTMONK_URL}/api/public/subscription`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          name: name || email.split('@')[0],
          list_uuids: LIST_UUID ? [LIST_UUID] : [],
          status: 'enabled',
        })
      })
      if (res.ok || res.status === 409) {
        setStatus('success')
        setEmail('')
        setName('')
      } else {
        throw new Error(await res.text())
      }
    } catch (e) {
      setStatus('error')
      setErr('Start Listmonk: docker compose up listmonk')
    }
  }

  return (
    <section id="newsletter" style={{
      padding: 'clamp(60px,8vw,100px) 24px',
      background: `linear-gradient(180deg, ${B.void} 0%, ${B.black} 100%)`,
      position: 'relative', overflow: 'hidden',
    }}>
      {/* Blobs */}
      <div style={{ position:'absolute', top:'15%', left:'5%', width:500, height:500, borderRadius:'50%', background:`radial-gradient(circle, rgba(245,166,35,0.07), transparent 70%)`, filter:'blur(70px)', pointerEvents:'none' }} />
      <div style={{ position:'absolute', bottom:'5%', right:'5%', width:350, height:350, borderRadius:'50%', background:`radial-gradient(circle, rgba(0,240,255,0.06), transparent 70%)`, filter:'blur(60px)', pointerEvents:'none' }} />

      <div style={{ maxWidth: 620, margin: '0 auto', textAlign: 'center', position: 'relative', zIndex: 1 }}>
        {/* Badge */}
        <div style={{ display:'inline-flex', alignItems:'center', gap:8, padding:'6px 18px', borderRadius:20, border:`1px solid rgba(184,255,0,0.3)`, background:'rgba(184,255,0,0.05)', marginBottom:28 }}>
          <div style={{ width:7, height:7, borderRadius:'50%', background:B.neonLime, boxShadow:`0 0 10px ${B.neonLime}`, animation:'pulse 2s infinite' }} />
          <span style={{ color:B.neonLime, fontFamily:'Orbitron,sans-serif', fontSize:10, letterSpacing:3, fontWeight:700 }}>COMMUNITY NEWSLETTER</span>
        </div>

        <h2 style={{ fontFamily:'Bebas Neue,sans-serif', fontSize:'clamp(42px,7vw,80px)', color:B.white, lineHeight:1, marginBottom:16, letterSpacing:2 }}>
          JOIN THE{' '}
          <span style={{ color:B.amber, textShadow:`0 0 40px ${B.amber}70` }}>INNER CIRCLE</span>
        </h2>

        <p style={{ color:B.smoke, fontFamily:'Space Mono,monospace', fontSize:13, lineHeight:1.9, marginBottom:44, maxWidth:500, margin:'0 auto 44px' }}>
          Exclusive drops, early ticket access, community challenges, and event updates. 10,000+ sneakerheads already in.
        </p>

        {status === 'success' ? (
          <div style={{ padding:'36px 32px', borderRadius:18, background:'rgba(184,255,0,0.04)', border:`1px solid rgba(184,255,0,0.25)`, backdropFilter:'blur(20px)' }}>
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" style={{ margin:'0 auto 16px', display:'block' }}>
              <circle cx="12" cy="12" r="11" stroke={B.neonLime} strokeWidth="1.5"/>
              <path d="M7 12l3.5 3.5L17 8.5" stroke={B.neonLime} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <p style={{ color:B.neonLime, fontFamily:'Orbitron,sans-serif', fontSize:13, letterSpacing:3, marginBottom:8 }}>YOU'RE IN THE CIRCLE</p>
            <p style={{ color:B.smoke, fontFamily:'Space Mono,monospace', fontSize:12 }}>Check your inbox to confirm. See you July 18.</p>
          </div>
        ) : (
          <form onSubmit={subscribe} style={{ display:'flex', flexDirection:'column', gap:12 }}>
            <div style={{ display:'flex', gap:12, flexWrap:'wrap' }}>
              <input
                type="text" value={name} onChange={e => setName(e.target.value)}
                placeholder="Your name"
                style={{
                  flex:1, minWidth:140, padding:'14px 18px',
                  background:'rgba(255,255,255,0.04)', backdropFilter:'blur(10px)',
                  border:`1px solid rgba(255,255,255,0.1)`, borderRadius:12,
                  color:B.white, fontFamily:'Space Mono,monospace', fontSize:13, outline:'none',
                }}
              />
              <input
                type="email" value={email} onChange={e => setEmail(e.target.value)}
                placeholder="your@email.com" required
                style={{
                  flex:2, minWidth:200, padding:'14px 18px',
                  background:'rgba(255,255,255,0.04)', backdropFilter:'blur(10px)',
                  border:`1px solid rgba(245,166,35,0.25)`, borderRadius:12,
                  color:B.white, fontFamily:'Space Mono,monospace', fontSize:13, outline:'none',
                }}
              />
            </div>

            <button
              type="submit" disabled={status === 'loading'}
              style={{
                padding:'16px', borderRadius:12, border:'none',
                background: status === 'loading' ? B.gunmetal : B.amber,
                color: B.black, fontFamily:'Orbitron,sans-serif', fontSize:13,
                fontWeight:700, letterSpacing:2, cursor: status === 'loading' ? 'not-allowed' : 'pointer',
                boxShadow: status === 'loading' ? 'none' : `0 0 30px ${B.amber}35`,
                transition:'all 0.2s',
              }}
            >
              {status === 'loading' ? 'SUBSCRIBING...' : 'JOIN THE COMMUNITY →'}
            </button>

            {status === 'error' && (
              <p style={{ color:B.neonMagenta, fontFamily:'Space Mono,monospace', fontSize:11 }}>{err}</p>
            )}

            <p style={{ color:'#555', fontFamily:'Space Mono,monospace', fontSize:11 }}>No spam. Unsubscribe anytime. Powered by Listmonk.</p>
          </form>
        )}

        {/* Stats */}
        <div style={{ display:'flex', justifyContent:'center', gap:40, marginTop:56, flexWrap:'wrap' }}>
          {[['10K+','Subscribers'],['6','Platforms'],['Weekly','Drops'],['Free','Forever']].map(([num,label]) => (
            <div key={label} style={{ textAlign:'center' }}>
              <p style={{ fontFamily:'Orbitron,sans-serif', fontSize:20, fontWeight:900, color:B.amber, marginBottom:4 }}>{num}</p>
              <p style={{ fontFamily:'Space Mono,monospace', fontSize:10, color:B.smoke, letterSpacing:2 }}>{label.toUpperCase()}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
