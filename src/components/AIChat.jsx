import { useState, useRef, useEffect, useCallback } from 'react'
import { B } from '../tokens'
import { claudeChat, aiAvailable } from '../lib/catalystAI'
import {
  useFestivalState,
  dispatchFestivalAction,
  FESTIVAL_ACTIONS,
  playFestivalSound,
} from '../framework/festivalFramework'

const API = import.meta.env.VITE_BACKEND_URL || ''

const SNEAKER_SYSTEM = `You are the official Sneakers Fest '26 AI — a Lagos sneaker culture expert and event concierge powered by the Catalyst OS Neural Skills Engine. You know everything about:
- Sneakers Fest '26: December 12, 2026, Muri Okunola Park, Victoria Island, Lagos Nigeria. Tickets: General ₦5K, VIP ₦10K, VVIP ₦25K, Phalanx ₦50K.
- Live Fit-Check Arena (#fitcheck-arena): 1v1 head-to-head on-foot street drip battles between Mainland and Island contenders. Crowd voting awards +50 XP; submitting your fit awards +150 XP & BEST_DRESSED_STREET badge.
- Lagos Sole Index (LSI) (#lagos-sole-index): West Africa's real-time sneaker aftermarket terminal & streaming ticker. Tracks NGN prices for TS1-Mocha, OW-AJ4-Sail, Chicago '85, Panda Dunks, and Virgil LV AF1.
- Lagos Grail Heist (#grail-heist): Interactive satellite radar quest across 4 encrypted beacons at Muri Okunola Park. Unlocks +250 XP and the Golden Vault Pass for the deadstock giveaway.
- Danfo Custom Sneaker Lab (#colorizer): 1-of-1 design lab featuring Danfo Hazard stripes, Adire Batik patterns, and official mint certificate serials.
- Lagos Sole Exchange (LSX) (#lsx): Authenticated P2P sneaker trading pit with physical escrow desks.
- Turnstile Door Scanner (/door.html): On-site gate scanner with camera QR detection and instant audio buzzers.
- Leadership & Identity: Directed by Oluwatobiloba — The Catalyst (@catalystggg) and official brand @s_fest26.
Be direct, culturally aware, and helpful. Reference Lagos culture naturally. Keep responses concise.`

// ── keyword fallback ──────────────────────────────────────────────────────────
const QA = [
  { keys: ['lsi','index','price','stock','ticker','market','worth'], answer: "The Lagos Sole Index (LSI) tracks real-time aftermarket prices in Naira (NGN). Currently, TS1 'Reverse Mocha' sits at ₦1,850,000 (+14.2%) and Virgil's Off-White AJ4 'Sail' at ₦2,450,000. Check the #lagos-sole-index terminal to view live charts and bid depth." },
  { keys: ['fit check','arena','battle','1v1','vote','drip','outfit'], answer: "The Live Fit-Check Arena (#fitcheck-arena) is where Lagos street legends clash 1v1 on foot! Vote on active battles to earn +50 XP or hit 'ENTER YOUR FIT' (+150 XP & BEST_DRESSED_STREET badge) to challenge the reigning champions." },
  { keys: ['heist','radar','quest','beacon','golden pass'], answer: "The Lagos Grail Heist (#grail-heist) has 4 encrypted beacons across Muri Okunola Park (Alpha at Main Stage, Beta at LSX Desk, Gamma at Danfo Wall, Delta at VIP Crypt). Solve all 4 to earn +250 XP and unlock the Golden Vault Pass!" },
  { keys: ['custom','colorizer','danfo lab','mint','shoe builder'], answer: "The Danfo Custom Sneaker Lab (#colorizer) lets you craft 1-of-1 kicks with Danfo Hazard transit stripes, Adire Batik geometry, and industrial quote branding. Mint your pair to earn +150 XP and enter the on-site custom battle." },
  { keys: ['door','scanner','turnstile','gate','checkin'], answer: "Door crews and security scan attendee QR and NFC passes at /door.html with real-time camera detection and dual acoustic buzzers. You can also test your pass in the HUD My Pass simulator." },
  { keys: ['ticket','price','cost','how much','buy','purchase'], answer: 'Tickets: General ₦5,000 · VIP ₦10,000 · VVIP ₦25,000 · Phalanx ₦50,000. Head to the Tickets section to grab yours.' },
  { keys: ['date','when','time','december'], answer: 'December 12, 2026. Doors open 12 PM; Phalanx holders from 11 AM at Muri Okunola Park, Victoria Island, Lagos.' },
  { keys: ['venue','location','where','address'], answer: 'Muri Okunola Park, Victoria Island, Lagos (6.4312° N, 3.4241° E). Full access details sent 14 days before the event.' },
  { keys: ['vip','vvip','phalanx'], answer: 'VIP (₦10K): Lounge access + merch bag + LSI live terminal pass. VVIP (₦25K): Collector room + Danfo custom lab fast-track + Golden Pass eligibility. Phalanx (₦50K): Dedicated concierge + collectible box + 11 AM entry.' },
  { keys: ['vendor','sell','stall','booth','apply'], answer: '30+ vendor spaces across The Floor. Apply in the Vendors section — applications are reviewed within 3 business days.' },
  { keys: ['trade','swap','lsx','exchange'], answer: 'Lagos Sole Exchange (LSX) offers authenticated P2P trades with physical escrow desks at SF26. Browse the Trade Board or LSX section to match swaps.' },
  { keys: ['catalyst','founder','ceo','who','about'], answer: "Founded and convened by Oluwatobiloba — The Catalyst (@catalystggg), principal of Catalyst Concepts & Abegbe Agboola Chambers AI Consulting. Official brand: @s_fest26." },
]

function keywordReply(text) {
  const q = text.toLowerCase()
  for (const qa of QA) {
    if (qa.keys.some(k => q.includes(k))) return qa.answer
  }
  return null
}

const SUGGESTIONS = [
  ['LSI Market Ticker', 'Fit Battle Ring', 'Grail Heist Clues', 'Ticket prices'],
  ['Danfo Sneaker Lab', 'LSX Trade Pit', 'Digital Pass / NFC', 'VIP perks'],
]

// ── component ─────────────────────────────────────────────────────────────────
export default function AIChat() {
  const [state, dispatch] = useFestivalState()
  const [open,       setOpen]      = useState(false)
  const [messages,   setMessages]  = useState([
    { role: 'assistant', content: "What's good! I'm the Sneakers Fest Street AI Concierge. I have live telemetry on Muri Okunola Park, your ticket status, and today's schedule. Ask me anything!" }
  ])
  const [input,      setInput]     = useState('')
  const [loading,    setLoading]   = useState(false)
  const [streaming,  setStreaming] = useState(false)
  const [streamText, setStreamText]= useState('')
  const [claude,     setClaude]    = useState(false)
  const [suggSet,    setSuggSet]   = useState(0)
  const [mobile,     setMobile]    = useState(() => window.innerWidth < 768)
  const endRef  = useRef(null)
  const msgsRef = useRef(messages)
  msgsRef.current = messages

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [messages, loading, streamText])
  useEffect(() => {
    const fn = () => setMobile(window.innerWidth < 768)
    window.addEventListener('resize', fn)
    return () => window.removeEventListener('resize', fn)
  }, [])

  // Listen to remote HUD open requests
  useEffect(() => {
    const handleRemoteOpen = (e) => {
      setOpen(true)
      if (e?.detail?.prompt) {
        setTimeout(() => sendText(e.detail.prompt), 100)
      }
    }
    window.addEventListener('sf26:open_ai_chat', handleRemoteOpen)
    return () => window.removeEventListener('sf26:open_ai_chat', handleRemoteOpen)
  }, [])

  const sendText = useCallback(async (text) => {
    if (!text.trim() || loading || streaming) return
    const history = [...msgsRef.current, { role: 'user', content: text }]
    setMessages(history)
    setLoading(true)

    // ── 1. Try SSE streaming endpoint
    if (API) {
      try {
        const res = await fetch(`${API}/api/chat/stream`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ messages: history.map(m => ({ role: m.role, content: m.content })) }),
        })
        if (res.ok && res.body) {
          setLoading(false)
          setStreaming(true)
          setStreamText('')
          setClaude(true)
          let accumulated = ''
          const reader  = res.body.getReader()
          const decoder = new TextDecoder()
          let done = false
          while (!done) {
            const { value, done: d } = await reader.read()
            done = d
            if (value) {
              const chunk = decoder.decode(value, { stream: true })
              for (const line of chunk.split('\n')) {
                const trimmed = line.trim()
                if (!trimmed.startsWith('data:')) continue
                const payload = trimmed.slice(5).trim()
                if (payload === '[DONE]') { done = true; break }
                try {
                  const parsed = JSON.parse(payload)
                  if (parsed.delta) { accumulated += parsed.delta; setStreamText(accumulated) }
                } catch {}
              }
            }
          }
          const final = accumulated || "Sorry, I couldn't get a response."
          setMessages(prev => [...prev, { role: 'assistant', content: final }])
          setStreamText('')
          setStreaming(false)
          if (history.length >= 3) setSuggSet(1)
          return
        }
      } catch { /* fall through to non-streaming */ }
    }

    // ── 2. Non-streaming /api/chat fallback
    let reply = null
    if (API) {
      try {
        const res = await fetch(`${API}/api/chat`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ messages: history.map(m => ({ role: m.role, content: m.content })) }),
        })
        if (res.ok) { reply = (await res.json()).reply; setClaude(true) }
      } catch {}
    }

    // 3. Claude, via the site's own function. No visitor key involved.
    if (!reply && await aiAvailable()) {
      try {
        const apiMessages = history.map(m => ({ role: m.role, content: m.content }))
        reply = await claudeChat(apiMessages, { feature: 'AIChat', system: SNEAKER_SYSTEM })
        if (reply) setClaude(true)
      } catch {}
    }

    // ── 4. Keyword fallback
    if (!reply) {
      await new Promise(r => setTimeout(r, 480))
      reply = keywordReply(text) || "That's best answered directly by the team — tap the WhatsApp button (bottom right) for a fast reply."
    }

    setMessages(prev => [...prev, { role: 'assistant', content: reply }])
    setLoading(false)
    if (history.length >= 3) setSuggSet(1)
  }, [loading, streaming])

  function send() { sendText(input.trim()); setInput('') }
  function clearChat() {
    setMessages([{ role: 'assistant', content: "What's good. I'm the Sneakers Fest AI — ask me anything about tickets, lineup, vendors, the Friday Protocol, drops, or the event." }])
    setSuggSet(0); setClaude(false); setStreamText(''); setStreaming(false)
  }

  const accent   = claude ? B.neonCyan : B.amber
  const isActive = loading || streaming
  const showSuggs = !isActive && (messages.length <= 2 || (suggSet === 1 && messages.length === 3))

  return (
    <>
      <style>{`
        @keyframes chatSlideIn { from{ opacity:0; transform:translateY(12px) } to{ opacity:1; transform:translateY(0) } }
        @keyframes pulse { 0%,100%{ opacity:1 } 50%{ opacity:0.35 } }
        @keyframes cursorBlink { 0%,100%{ opacity:1 } 50%{ opacity:0 } }
      `}</style>

      {/* ── trigger button ─────────────────────────────────────────────── */}
      <button
        onClick={() => setOpen(o => !o)}
        aria-label={open ? 'Close chat' : 'Open chat'}
        style={{ position: 'fixed', bottom: mobile ? 78 : 28, left: 28, zIndex: 1001, width: 54, height: 54, borderRadius: '50%', background: `linear-gradient(135deg, ${B.amber}, ${B.neonCyan})`, border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: `0 0 24px ${B.amber}50, 0 4px 20px rgba(0,0,0,0.6)`, transition: 'transform 0.2s' }}
        onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.08)'}
        onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
      >
        {open
          ? <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M18 6L6 18M6 6l12 12" stroke={B.black} strokeWidth="2.5" strokeLinecap="round"/></svg>
          : <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" stroke={B.black} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
        }
      </button>

      {/* ── panel ──────────────────────────────────────────────────────── */}
      {open && (
        <div style={{ position: 'fixed', bottom: mobile ? 148 : 94, left: 28, zIndex: 1000, width: mobile ? 'calc(100vw - 56px)' : 358, height: 502, borderRadius: 18, background: 'rgba(8,8,12,0.97)', backdropFilter: 'blur(28px) saturate(180%)', border: `1px solid ${accent}30`, boxShadow: `0 0 60px ${accent}08, 0 24px 80px rgba(0,0,0,0.9)`, display: 'flex', flexDirection: 'column', overflow: 'hidden', animation: 'chatSlideIn 0.25s ease', transition: 'border-color 0.4s' }}>

          {/* header */}
          <div style={{ padding: '11px 14px', borderBottom: '1px solid rgba(255,255,255,0.07)', background: `linear-gradient(90deg, ${accent}10, transparent)`, display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ width: 7, height: 7, borderRadius: '50%', background: isActive ? B.amber : accent, boxShadow: `0 0 8px ${isActive ? B.amber : accent}`, animation: 'pulse 2s infinite', flexShrink: 0 }} />
            <span style={{ color: accent, fontFamily: 'Orbitron,sans-serif', fontSize: 9, fontWeight: 700, letterSpacing: 2 }}>
              {claude ? 'CLAUDE AI' : 'SNEAKERS FEST AI'}
            </span>
            {claude && <span style={{ fontFamily: 'Space Mono,monospace', fontSize: 9, color: `${B.neonCyan}55` }}>
              {streaming ? 'streaming…' : 'claude-haiku'}
            </span>}
            <button onClick={clearChat} title="Clear chat" style={{ marginLeft: 'auto', background: 'none', border: 'none', color: B.dim, cursor: 'pointer', fontSize: 14, padding: '1px 4px', transition: 'color 0.2s' }} onMouseEnter={e => e.currentTarget.style.color = '#888'} onMouseLeave={e => e.currentTarget.style.color = '#333'}>↺</button>
          </div>

          {/* messages */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '12px 12px 8px', display: 'flex', flexDirection: 'column', gap: 10 }}>
            {messages.map((m, i) => (
              <div key={i} style={{ alignSelf: m.role === 'user' ? 'flex-end' : 'flex-start', maxWidth: '84%', padding: '9px 13px', borderRadius: m.role === 'user' ? '14px 14px 3px 14px' : '14px 14px 14px 3px', background: m.role === 'user' ? `rgba(245,166,35,0.15)` : 'rgba(255,255,255,0.05)', border: `1px solid ${m.role === 'user' ? 'rgba(245,166,35,0.25)' : 'rgba(255,255,255,0.07)'}`, color: B.white, fontSize: 12, lineHeight: 1.65, fontFamily: 'Space Mono,monospace' }}>
                {m.content}
              </div>
            ))}

            {/* streaming bubble */}
            {streaming && (
              <div style={{ alignSelf: 'flex-start', maxWidth: '84%', padding: '9px 13px', borderRadius: '14px 14px 14px 3px', background: 'rgba(255,255,255,0.05)', border: `1px solid rgba(0,240,255,0.15)`, color: B.white, fontSize: 12, lineHeight: 1.65, fontFamily: 'Space Mono,monospace' }}>
                {streamText || ' '}
                <span style={{ display: 'inline-block', width: 8, height: 13, background: B.neonCyan, marginLeft: 2, verticalAlign: 'middle', animation: 'cursorBlink 0.9s ease-in-out infinite' }} />
              </div>
            )}

            {/* loading dots (pre-stream) */}
            {loading && (
              <div style={{ alignSelf: 'flex-start', display: 'flex', gap: 5, padding: '10px 14px', background: 'rgba(255,255,255,0.04)', borderRadius: 14, border: '1px solid rgba(255,255,255,0.07)' }}>
                {[0,1,2].map(i => <div key={i} style={{ width: 6, height: 6, borderRadius: '50%', background: accent, animation: `pulse 1.2s ${i*0.2}s infinite` }} />)}
              </div>
            )}
            <div ref={endRef} />
          </div>

          {/* suggestions */}
          {showSuggs && (
            <div style={{ padding: '0 12px 8px', display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {SUGGESTIONS[suggSet].map(q => (
                <button key={q} onClick={() => sendText(q)}
                  style={{ padding: '5px 10px', background: `${B.amber}12`, border: `1px solid ${B.amber}28`, borderRadius: 20, color: B.amber, fontSize: 9, fontFamily: 'Space Mono,monospace', cursor: 'pointer', letterSpacing: '0.06em', transition: 'background 0.15s' }}
                  onMouseEnter={e => e.currentTarget.style.background = `${B.amber}22`}
                  onMouseLeave={e => e.currentTarget.style.background = `${B.amber}12`}
                >{q}</button>
              ))}
            </div>
          )}

          {/* Quick Festival Action Chips (Level 3 Integration) */}
          <div style={{ padding: '0 12px 8px', display: 'flex', gap: 6, overflowX: 'auto' }}>
            <button
              onClick={() => {
                dispatch(FESTIVAL_ACTIONS.TELEMETRY_ZONE_FOCUS, { zone: 'stage' })
                setOpen(false)
                const el = document.getElementById('venue')
                if (el) el.scrollIntoView({ behavior: 'smooth' })
              }}
              style={{ padding: '4px 8px', borderRadius: 6, background: 'rgba(245,166,35,0.1)', border: `1px solid ${B.amber}40`, color: B.amber, fontSize: 8, fontFamily: 'Space Mono,monospace', cursor: 'pointer', whiteSpace: 'nowrap' }}
            >
              📍 3D STAGE FOCUS
            </button>
            <button
              onClick={() => {
                dispatch(FESTIVAL_ACTIONS.HUD_SET_TAB, { tab: 'pass' })
                setOpen(false)
              }}
              style={{ padding: '4px 8px', borderRadius: 6, background: 'rgba(184,255,0,0.1)', border: `1px solid ${B.neonLime}40`, color: B.neonLime, fontSize: 8, fontFamily: 'Space Mono,monospace', cursor: 'pointer', whiteSpace: 'nowrap' }}
            >
              📱 TURNSTILE NFC PASS
            </button>
            <button
              onClick={() => {
                setOpen(false)
                const el = document.getElementById('soledle')
                if (el) el.scrollIntoView({ behavior: 'smooth' })
              }}
              style={{ padding: '4px 8px', borderRadius: 6, background: 'rgba(0,240,255,0.1)', border: `1px solid ${B.neonCyan}40`, color: B.neonCyan, fontSize: 8, fontFamily: 'Space Mono,monospace', cursor: 'pointer', whiteSpace: 'nowrap' }}
            >
              👟 SOLEDLE QUEST (+120 XP)
            </button>
          </div>

          {/* input */}
          <div style={{ padding: '10px 12px 14px', borderTop: '1px solid rgba(255,255,255,0.07)', display: 'flex', gap: 8 }}>
            <input aria-label="Ask about Sneakers Fest"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && !e.shiftKey && send()}
              placeholder="Ask about Sneakers Fest..."
              disabled={isActive}
              style={{ flex: 1, background: 'rgba(255,255,255,0.04)', border: `1px solid rgba(245,166,35,0.18)`, borderRadius: 10, color: B.white, padding: '9px 12px', fontSize: 12, fontFamily: 'Space Mono,monospace', outline: 'none', opacity: isActive ? 0.5 : 1 }}
            />
            <button onClick={send} disabled={isActive || !input.trim()}
              style={{ background: isActive || !input.trim() ? 'rgba(255,255,255,0.05)' : accent, border: 'none', borderRadius: 10, padding: '9px 14px', cursor: isActive || !input.trim() ? 'not-allowed' : 'pointer', color: isActive || !input.trim() ? B.dim : B.black, fontFamily: 'Orbitron,sans-serif', fontSize: 10, fontWeight: 700, letterSpacing: 1, transition: 'all 0.2s' }}
            >GO</button>
          </div>

        </div>
      )}
    </>
  )
}
