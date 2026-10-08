import { useState, useRef, useEffect, useCallback } from 'react'
import { B } from '../tokens'
import { claudeChat, aiAvailable } from '../lib/catalystAI'

const API = import.meta.env.VITE_BACKEND_URL || ''

const SNEAKER_SYSTEM = `You are the official Sneakers Fest '26 AI — a Lagos sneaker culture expert and event concierge. You know everything about:
- Sneakers Fest '26: December 12, 2026, Lagos Nigeria. Tickets: General ₦5K, VIP ₦10K, VVIP ₦25K, Phalanx ₦50K.
- Lineup: Headliner details classified. 30+ vendor spaces. Collector room. Exclusive drops for VIP+.
- Grail culture, resale market, sneaker history, drop intel, outfit advice.
- The Lagos streetwear scene, Friday Night Protocol (weekly community sessions), and The Catalyst (@catalyst00555).
- Contact: WhatsApp button on the site, Instagram @sneakersfest5555, Snapchat sneakersfest, email sneakersfest088@gmail.com.
Be direct, culturally aware, and helpful. Reference Lagos culture naturally. Keep responses concise.`

// ── keyword fallback ──────────────────────────────────────────────────────────
const QA = [
  { keys: ['ticket','price','cost','how much','buy','purchase'], answer: 'Tickets: General ₦5,000 · VIP ₦10,000 · VVIP ₦25,000 · Phalanx ₦50,000. Head to the Tickets section to grab yours.' },
  { keys: ['date','when','time','december'], answer: 'December 12, 2026. Doors open 12 PM; Phalanx holders from 11 AM. Mark your calendar.' },
  { keys: ['venue','location','where','address'], answer: 'Muri Okunola Park, Victoria Island, Lagos. December 12, 2026 — doors at 12 PM, Phalanx holders from 11 AM.' },
  { keys: ['lineup','dj','artist','music','perform'], answer: 'Lineup details drop soon — follow @sneakersfest5555 on Instagram and join the WhatsApp inner circle to be first to know.' },
  { keys: ['vip','vvip','phalanx'], answer: 'VIP (₦10K): Priority entry + lounge + merch bag. VVIP (₦25K): + collector room + exclusive access. Phalanx (₦50K): private lounge, concierge, badge + collectible box, 11 AM entry.' },
  { keys: ['vendor','sell','stall','booth','apply'], answer: '30+ vendor spaces, invitation-curated first cohort. Apply in the Vendors section — reviewed in 3 business days.' },
  { keys: ['sponsor','partner','sponsorship'], answer: 'Packages from ₦250K to ₦5M+. FNP from ₦100K. Email sneakersfest088@gmail.com.' },
  { keys: ['fnp','friday','protocol','weekly'], answer: 'Friday Night Protocol is a weekly community session — drop discussions, challenges, games. Join WhatsApp for alerts.' },
  { keys: ['drop','exclusive','release','grail','kicks','sneaker'], answer: 'Exclusive drop intel hits the community first. Follow @sneakersfest5555 on Instagram, add sneakersfest on Snapchat, and join the WhatsApp inner circle for early alerts.' },
  { keys: ['early access','waitlist','queue'], answer: 'Sign up in the Early Access section — queue position + first shot at tickets, vendor spots, and drop intel.' },
  { keys: ['raffle','win','giveaway'], answer: 'Enter raffles in the Raffle section. Live draws at the event. Enter early.' },
  { keys: ['gallery','photo','upload'], answer: 'Upload in the Gallery section. Community votes with heat — top photos rank on the leaderboard.' },
  { keys: ['trade','swap'], answer: 'Browse and post on the Trade Board. WhatsApp deep-link makes reaching sellers easy.' },
  { keys: ['museum','art','bid','artwork'], answer: 'Eight artworks up for bid — Lagos at Dawn, Sole Supremacy, Grail Keeper, and more. Bid in the Museum section.' },
  { keys: ['whatsapp','community','join','group'], answer: 'Tap the WhatsApp button (bottom right). Also follow @sneakersfest5555 on Instagram and add sneakersfest on Snapchat. Inner circle gets early access, FNP alerts, and drop announcements.' },
  { keys: ['contact','reach','email','hello','hi'], answer: 'WhatsApp (bottom right) is fastest. Instagram @sneakersfest5555 · Snapchat: sneakersfest · sneakersfest088@gmail.com for media, partnerships & enquiries.' },
  { keys: ['instagram','snapchat','social','follow'], answer: 'Instagram: @sneakersfest5555 — Snapchat: sneakersfest — TikTok: @sneakersfest. All platforms are live. Follow for drops, culture, FNP highlights, and event updates.' },
  { keys: ['merch','shirt','hoodie','clothing'], answer: 'Merch in the Merch section. Lagos Noir aesthetic, limited runs.' },
  { keys: ['catalyst','founder','who','about'], answer: "Built by Oluwatobiloba — The Catalyst, principal of Catalyst Concepts, Lagos. Full story in Origin Story." },
  { keys: ['substack','newsletter','read'], answer: 'The Catalyst Substack (@catalyst00555) covers sneaker culture, Lagos drops, and event docs. Subscribe free.' },
]

function keywordReply(text) {
  const q = text.toLowerCase()
  for (const qa of QA) {
    if (qa.keys.some(k => q.includes(k))) return qa.answer
  }
  return null
}

const SUGGESTIONS = [
  ['Ticket prices', 'Vendor spots', 'What is FNP?', 'Date & venue'],
  ['VIP perks', 'How do raffles work?', 'Exclusive drops', 'Sponsorships'],
]

// ── component ─────────────────────────────────────────────────────────────────
export default function AIChat() {
  const [open,       setOpen]      = useState(false)
  const [messages,   setMessages]  = useState([
    { role: 'assistant', content: "What's good. I'm the Sneakers Fest AI — ask me anything about tickets, lineup, vendors, the Friday Protocol, drops, or the event." }
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
