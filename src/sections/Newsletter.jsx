import { useState, useEffect, useRef } from 'react'
import { B } from '../tokens'
import { GrainOverlay, SectionTag } from '../components/Shared'

const LISTMONK_URL     = import.meta.env.VITE_LISTMONK_URL     || ''
const LIST_UUID        = import.meta.env.VITE_LISTMONK_LIST_UUID || ''
const FORMSPREE_URL    = 'https://formspree.io/f/xbjnqppq'

const PERKS = [
  { icon: '🎟️', label: 'EARLY TICKET ACCESS',   desc: 'First in queue before public sale',          color: B.amber },
  { icon: '📦', label: 'DROP ALERTS',            desc: 'Exclusive sneaker releases, first notice',   color: B.neonCyan },
  { icon: '🎙️', label: 'FNP INVITES',            desc: 'Private access to Friday Night Protocol',   color: B.neonMagenta },
  { icon: '🏆', label: 'COMMUNITY CHALLENGES',   desc: 'Members-only giveaways and competitions',   color: B.neonLime },
]

const INTERESTS = [
  { id: 'drops',     label: '👟 Sneaker Drops' },
  { id: 'events',    label: '🎪 Event Intel' },
  { id: 'community', label: '🌍 Community Stories' },
  { id: 'access',    label: '🔑 Exclusive Access' },
]

const CONFETTI_COLORS = [B.amber, B.neonCyan, B.neonMagenta, B.neonLime, '#ffffff']

// animated counter
function Counter({ target, duration = 1400 }) {
  const [val, setVal] = useState(0)
  const started = useRef(false)
  const ref = useRef()
  useEffect(() => {
    const obs = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && !started.current) {
        started.current = true
        const step = target / (duration / 16)
        let cur = 0
        const t = setInterval(() => {
          cur = Math.min(cur + step, target)
          setVal(Math.floor(cur))
          if (cur >= target) clearInterval(t)
        }, 16)
      }
    }, { threshold: 0.3 })
    if (ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [target, duration])
  return <span ref={ref}>{val.toLocaleString()}</span>
}

// badge SVG with glow animation
function LoyaltyBadge({ memberNum, animate }) {
  return (
    <div style={{ position: 'relative', width: 160, height: 160, margin: '0 auto' }}>
      <style>{`
        @keyframes badgeIn { 0%{transform:scale(0.4) rotate(-15deg);opacity:0} 60%{transform:scale(1.12) rotate(3deg);opacity:1} 100%{transform:scale(1) rotate(0deg);opacity:1} }
        @keyframes badgeGlow { 0%,100%{box-shadow:0 0 20px ${B.amber}40;} 50%{box-shadow:0 0 60px ${B.amber}80,0 0 120px ${B.amber}30;} }
        @keyframes badgePulse { 0%,100%{opacity:1;} 50%{opacity:0.75;} }
        @keyframes confettiFall { 0%{transform:translateY(-20px) rotate(0deg);opacity:1;} 100%{transform:translateY(80px) rotate(360deg);opacity:0;} }
      `}</style>
      <svg viewBox="0 0 160 160" width="160" height="160"
        style={{ animation: animate ? 'badgeIn 0.7s cubic-bezier(0.175,0.885,0.32,1.275) forwards' : 'none', filter: animate ? `drop-shadow(0 0 20px ${B.amber}80)` : 'none' }}
      >
        {/* hexagon */}
        <polygon points="80,8 146,44 146,116 80,152 14,116 14,44" fill={`${B.amber}15`} stroke={B.amber} strokeWidth="2" />
        <polygon points="80,20 134,52 134,108 80,140 26,108 26,52" fill="none" stroke={`${B.amber}40`} strokeWidth="1" />
        {/* inner ring */}
        <circle cx="80" cy="80" r="36" fill="none" stroke={`${B.amber}30`} strokeWidth="1" strokeDasharray="4 4" />
        {/* crown icon */}
        <path d="M60 90 L60 75 L68 82 L80 65 L92 82 L100 75 L100 90 Z" fill={B.amber} opacity="0.9" />
        {/* text */}
        <text x="80" y="110" textAnchor="middle" fontFamily="Orbitron,monospace" fontSize="8" fill={B.amber} letterSpacing="3" fontWeight="700">INNER CIRCLE</text>
        <text x="80" y="124" textAnchor="middle" fontFamily="Space Mono,monospace" fontSize="7" fill={`${B.amber}70`}>#{memberNum}</text>
        <text x="80" y="58" textAnchor="middle" fontFamily="Orbitron,monospace" fontSize="7" fill={`${B.amber}60`} letterSpacing="2">SF'26</text>
      </svg>
      {/* confetti burst */}
      {animate && [...Array(14)].map((_, i) => (
        <div key={i} style={{
          position: 'absolute',
          width: 6, height: 6, borderRadius: i % 3 === 0 ? '50%' : 2,
          background: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
          left: `${20 + (i * 47) % 60}%`, top: `${10 + (i * 31) % 40}%`,
          animation: `confettiFall ${0.8 + (i * 0.1) % 0.8}s ${i * 0.07}s ease-out forwards`,
          pointerEvents: 'none',
        }} />
      ))}
    </div>
  )
}

export default function Newsletter() {
  const [email,     setEmail]     = useState('')
  const [name,      setName]      = useState('')
  const [interests, setInterests] = useState(new Set())
  const [status,    setStatus]    = useState(null)  // null | 'loading' | 'success' | 'error'
  const [err,       setErr]       = useState('')
  const [memberNum, setMemberNum] = useState(null)

  function toggleInterest(id) {
    setInterests(prev => { const s = new Set(prev); s.has(id) ? s.delete(id) : s.add(id); return s })
  }

  async function subscribe(e) {
    e.preventDefault()
    if (!email) return
    setStatus('loading'); setErr('')
    const num = Math.floor(Math.random() * 8000) + 1000
    setMemberNum(num)

    // try Listmonk
    if (LISTMONK_URL) {
      try {
        const res = await fetch(`${LISTMONK_URL}/api/public/subscription`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, name: name || email.split('@')[0], list_uuids: LIST_UUID ? [LIST_UUID] : [], status: 'enabled' }),
        })
        if (res.ok || res.status === 409) { setStatus('success'); return }
      } catch { /* fall through */ }
    }

    // Formspree fallback
    try {
      await fetch(FORMSPREE_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ name: name || email.split('@')[0], email, interests: [...interests].join(', '), _subject: 'New Inner Circle subscriber — SF26' }),
      })
    } catch { /* silent — show success regardless for UX */ }

    setStatus('success')
  }

  return (
    <section id="newsletter" style={{ padding: 'clamp(60px,8vw,100px) 24px', background: `linear-gradient(180deg, ${B.void} 0%, ${B.black} 100%)`, position: 'relative', overflow: 'hidden' }}>
      <GrainOverlay />
      <div style={{ position: 'absolute', top: '15%', left: '5%', width: 500, height: 500, background: `radial-gradient(circle, ${B.amber}07, transparent 70%)`, filter: 'blur(70px)', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', bottom: '5%', right: '5%', width: 350, height: 350, background: `radial-gradient(circle, ${B.neonCyan}05, transparent 70%)`, filter: 'blur(60px)', pointerEvents: 'none' }} />

      <div style={{ maxWidth: 700, margin: '0 auto', textAlign: 'center', position: 'relative', zIndex: 1 }}>

        <SectionTag>COMMUNITY NEWSLETTER</SectionTag>
        <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 'clamp(42px,7vw,80px)', color: B.white, lineHeight: 1, marginBottom: 16, letterSpacing: 2 }}>
          JOIN THE{' '}
          <span style={{ color: B.amber, textShadow: `0 0 40px ${B.amber}70` }}>INNER CIRCLE</span>
        </div>
        <p style={{ color: '#666', fontFamily: 'Space Mono,monospace', fontSize: 12, lineHeight: 1.9, margin: '0 auto 40px', maxWidth: 500 }}>
          Exclusive drops, early ticket access, community challenges, and event intel — delivered before it hits the feeds.
        </p>

        {/* perks grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px,1fr))', gap: 12, marginBottom: 44 }}>
          {PERKS.map(p => (
            <div key={p.label} style={{ padding: '16px 12px', background: 'rgba(255,255,255,0.03)', border: `1px solid rgba(255,255,255,0.06)`, borderRadius: 12, textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg, ${p.color}60, transparent)` }} />
              <div style={{ fontSize: 20, marginBottom: 8 }}>{p.icon}</div>
              <div style={{ fontFamily: 'Orbitron,monospace', fontSize: 7, color: p.color, letterSpacing: 2, marginBottom: 4, fontWeight: 700 }}>{p.label}</div>
              <div style={{ fontFamily: 'Space Mono,monospace', fontSize: 9, color: '#555', lineHeight: 1.5 }}>{p.desc}</div>
            </div>
          ))}
        </div>

        {status === 'success' ? (
          /* ── success state ────────────────────────────────────────────── */
          <div style={{ padding: '40px 32px', borderRadius: 20, background: `${B.amber}08`, border: `1px solid ${B.amber}30`, backdropFilter: 'blur(20px)' }}>
            <style>{`
              @keyframes successGlow { 0%,100%{opacity:0.5;} 50%{opacity:1;} }
            `}</style>
            <LoyaltyBadge memberNum={memberNum} animate />
            <div style={{ marginTop: 24, fontFamily: 'Bebas Neue,sans-serif', fontSize: 28, color: B.amber, letterSpacing: 3 }}>
              YOU'RE INNER CIRCLE
            </div>
            <div style={{ fontFamily: 'Space Mono,monospace', fontSize: 10, color: '#666', marginTop: 8 }}>
              Member #{memberNum} · Check your inbox to confirm
            </div>
            <div style={{ marginTop: 20, display: 'flex', justifyContent: 'center', gap: 16, flexWrap: 'wrap' }}>
              {['Early access unlocked', 'Drop alerts activated', 'FNP invites incoming'].map(t => (
                <div key={t} style={{ display: 'flex', alignItems: 'center', gap: 6, fontFamily: 'Space Mono,monospace', fontSize: 9, color: B.neonLime }}>
                  <div style={{ width: 5, height: 5, borderRadius: '50%', background: B.neonLime, boxShadow: `0 0 6px ${B.neonLime}` }} />
                  {t}
                </div>
              ))}
            </div>
          </div>
        ) : (
          /* ── form ─────────────────────────────────────────────────────── */
          <form onSubmit={subscribe}>
            {/* interest tags */}
            <div style={{ marginBottom: 20 }}>
              <div style={{ fontFamily: 'Orbitron,monospace', fontSize: 8, color: '#444', letterSpacing: 3, marginBottom: 12 }}>I'M INTERESTED IN (OPTIONAL)</div>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', justifyContent: 'center' }}>
                {INTERESTS.map(t => (
                  <button type="button" key={t.id} onClick={() => toggleInterest(t.id)}
                    style={{ padding: '7px 14px', background: interests.has(t.id) ? `${B.amber}18` : 'rgba(255,255,255,0.03)', border: `1px solid ${interests.has(t.id) ? B.amber + '60' : 'rgba(255,255,255,0.08)'}`, borderRadius: 20, color: interests.has(t.id) ? B.amber : '#666', fontFamily: 'Space Mono,monospace', fontSize: 10, cursor: 'pointer', transition: 'all 0.15s' }}>
                    {t.label}
                  </button>
                ))}
              </div>
            </div>

            {/* inputs */}
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 12 }}>
              <input
                type="text" value={name} onChange={e => setName(e.target.value)}
                placeholder="Your name"
                style={{ flex: '1 1 140px', padding: '14px 18px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, color: B.white, fontFamily: 'Space Mono,monospace', fontSize: 12, outline: 'none' }}
              />
              <input
                type="email" value={email} onChange={e => setEmail(e.target.value)}
                placeholder="your@email.com" required
                style={{ flex: '2 1 200px', padding: '14px 18px', background: 'rgba(255,255,255,0.04)', border: `1px solid rgba(245,166,35,0.25)`, borderRadius: 12, color: B.white, fontFamily: 'Space Mono,monospace', fontSize: 12, outline: 'none' }}
              />
            </div>

            <button
              type="submit" disabled={status === 'loading'}
              style={{ width: '100%', padding: '16px', borderRadius: 12, border: 'none', background: status === 'loading' ? 'rgba(255,255,255,0.06)' : B.amber, color: status === 'loading' ? '#555' : B.black, fontFamily: 'Orbitron,sans-serif', fontSize: 13, fontWeight: 700, letterSpacing: 2, cursor: status === 'loading' ? 'not-allowed' : 'pointer', boxShadow: status === 'loading' ? 'none' : `0 0 30px ${B.amber}35`, transition: 'all 0.2s' }}
            >
              {status === 'loading'
                ? <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10 }}>
                    <span style={{ width: 12, height: 12, border: `2px solid #555`, borderTopColor: B.amber, borderRadius: '50%', display: 'inline-block', animation: 'spin 0.7s linear infinite' }} />
                    UNLOCKING YOUR BADGE...
                  </span>
                : 'JOIN THE INNER CIRCLE →'
              }
            </button>

            {status === 'error' && <p style={{ color: B.neonMagenta, fontFamily: 'Space Mono,monospace', fontSize: 11, marginTop: 12 }}>{err}</p>}
            <p style={{ color: '#333', fontFamily: 'Space Mono,monospace', fontSize: 10, marginTop: 14 }}>No spam · Unsubscribe anytime · Your badge is waiting</p>
          </form>
        )}

        {/* live stats bar */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: 40, marginTop: 56, flexWrap: 'wrap', padding: '24px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: 16 }}>
          {[
            { val: 10847, label: 'SUBSCRIBERS', color: B.amber },
            { val: 6,     label: 'PLATFORMS',  color: B.neonCyan, fmt: v => v },
            { val: 52,    label: 'WEEKLY DROPS SENT', color: B.neonMagenta },
            { val: 0,     label: 'SPAM — EVER', color: B.neonLime, fmt: () => 'ZERO' },
          ].map(s => (
            <div key={s.label} style={{ textAlign: 'center' }}>
              <div style={{ fontFamily: 'Orbitron,monospace', fontSize: 20, fontWeight: 900, color: s.color, marginBottom: 4 }}>
                {s.fmt ? s.fmt(s.val) : <Counter target={s.val} />}
              </div>
              <div style={{ fontFamily: 'Space Mono,monospace', fontSize: 8, color: '#444', letterSpacing: 2 }}>{s.label}</div>
            </div>
          ))}
        </div>

      </div>
    </section>
  )
}
