import { useState, useRef, useEffect } from 'react'
import { B } from '../tokens'

const QA = [
  {
    keys: ['ticket', 'price', 'cost', 'how much', 'buy', 'get ticket', 'purchase'],
    answer: 'Tickets: General ₦5,000 · VIP ₦10,000 · VVIP ₦25,000 · Phalanx ₦50,000. Head to the Tickets section to secure yours. Early access members get first dibs.'
  },
  {
    keys: ['date', 'when', 'time', 'december', 'day'],
    answer: 'December 12, 2026. Doors open 12:00 PM. Mark your calendar.'
  },
  {
    keys: ['venue', 'location', 'where', 'address'],
    answer: "The exact venue will be announced soon — the city is Lagos, Nigeria, and the date is locked: December 12, 2026. Join the WhatsApp channel to be first to know when the venue drops."
  },
  {
    keys: ['lineup', 'dj', 'artist', 'spinall', 'music', 'perform', 'headliner'],
    answer: 'DJ Spinall is headlining. Full lineup details are in the Lineup section — scroll down or tap the nav.'
  },
  {
    keys: ['vip', 'vvip', 'phalanx', 'ultra', 'experience', 'lounge', 'meet'],
    answer: 'VIP (₦10K): Priority entry + exclusive lounge + merch bag. VVIP (₦25K): Everything VIP plus private collector room, artist access & signed merch. Phalanx (₦50K): Top tier — private lounge, dedicated concierge, exclusive badge + collectible box, early entry from 11 AM.'
  },
  {
    keys: ['vendor', 'sell', 'stall', 'booth', 'apply', 'brand'],
    answer: 'Vendor spots are invitation-curated — 30 to 50 stalls, Year 1 first cohort. Fill the application in the Vendors section. We review within 3 business days.'
  },
  {
    keys: ['sponsor', 'partner', 'sponsorship'],
    answer: 'Packages from ₦250K (Community) to ₦5M+ (Headline). FNP session sponsorships also available from ₦100K. Email sponsors@sneakersfest.com or check the Sponsors section.'
  },
  {
    keys: ['fnp', 'friday', 'protocol', 'weekly', 'challenge', 'game', 'conversation'],
    answer: 'The Friday Night Protocol runs every Friday — a weekly community session with drop discussions, challenges, live conversations, and games. Join via WhatsApp to get alerts.'
  },
  {
    keys: ['drop', 'exclusive', 'release', 'cop', 'pair', 'kicks', 'sneaker', 'grail'],
    answer: 'Exclusive drops get announced first in the Friday Night Protocol community. Follow on WhatsApp and Twitter (@Catalyst188) — those are the first to know.'
  },
  {
    keys: ['early access', 'waitlist', 'queue', 'first'],
    answer: 'Sign up for early access in the Early Access section. You get a queue position and first shot at tickets, vendor spots, and exclusive drop announcements.'
  },
  {
    keys: ['interview', 'documentary', 'video', 'youtube', 'watch'],
    answer: 'Event docs and collector interviews drop on the YouTube channel. Subscribe @catalyst00555 on YouTube to get notified.'
  },
  {
    keys: ['whatsapp', 'community', 'join', 'inner circle', 'group'],
    answer: 'Join the community via the WhatsApp button on the site. Inner circle members get early access, FNP alerts, and direct drop announcements.'
  },
  {
    keys: ['contact', 'reach', 'email', 'talk', 'message', 'hello', 'hi'],
    answer: 'Tap the WhatsApp button (bottom right) for fastest response. For press: press@sneakersfest.com. For sponsors: sponsors@sneakersfest.com.'
  },
  {
    keys: ['catalyst', 'founder', 'oluwatobiloba', 'who', 'about'],
    answer: 'Sneakers Fest is built by Oluwatobiloba — The Catalyst, principal of Catalyst Concepts, Lagos. Read the full origin story in the Origin Story section.'
  },
  {
    keys: ['merch', 'shirt', 'hoodie', 'clothing', 'wear', 'apparel'],
    answer: 'Merch is in the Merch section. Lagos Noir aesthetic — the same visual language as the festival itself.'
  },
  {
    keys: ['substack', 'newsletter', 'read', 'essay', 'culture'],
    answer: 'The Catalyst Substack (@catalyst00555) covers sneaker culture, Lagos streetwear, event docs, and community stories. Subscribe free — check the Substack section.'
  },
]

function getReply(text) {
  const q = text.toLowerCase()
  for (const qa of QA) {
    if (qa.keys.some(k => q.includes(k))) return qa.answer
  }
  return null
}

export default function AIChat() {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState([
    { role: 'assistant', content: "What's good. I'm the Sneakers Fest AI. Ask me anything — tickets, lineup, vendors, the Friday Protocol, drops, or what this whole thing is about." }
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [isMobile, setIsMobile] = useState(() => window.innerWidth < 768)
  const endRef = useRef(null)

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [messages, loading])
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768)
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  function send() {
    if (!input.trim() || loading) return
    const text = input.trim()
    setInput('')
    setMessages(prev => [...prev, { role: 'user', content: text }])
    setLoading(true)

    setTimeout(() => {
      const reply = getReply(text)
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: reply || "That one's better answered by the team directly. Tap the WhatsApp button (bottom right) and they'll get back to you fast."
      }])
      setLoading(false)
    }, 620)
  }

  return (
    <>
      {/* Trigger button */}
      <button
        onClick={() => setOpen(o => !o)}
        aria-label={open ? 'Close chat' : 'Open chat'}
        style={{
          position: 'fixed', bottom: isMobile ? 90 : 28, left: 28, zIndex: 1001,
          width: 54, height: 54, borderRadius: '50%',
          background: `linear-gradient(135deg, ${B.amber}, ${B.neonCyan})`,
          border: 'none', cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: `0 0 24px ${B.amber}50, 0 4px 20px rgba(0,0,0,0.6)`,
          transition: 'transform 0.2s, box-shadow 0.2s',
        }}
        onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.08)' }}
        onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)' }}
      >
        {open
          ? <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M18 6L6 18M6 6l12 12" stroke={B.black} strokeWidth="2.5" strokeLinecap="round"/></svg>
          : <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" stroke={B.black} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
        }
      </button>

      {/* Chat panel */}
      {open && (
        <div style={{
          position: 'fixed', bottom: isMobile ? 156 : 94, left: 28, zIndex: 1000,
          width: 340, height: 490,
          borderRadius: 18,
          background: 'rgba(8,8,12,0.96)',
          backdropFilter: 'blur(24px) saturate(180%)',
          border: `1px solid rgba(245,166,35,0.25)`,
          boxShadow: `0 0 60px rgba(245,166,35,0.08), 0 24px 80px rgba(0,0,0,0.9)`,
          display: 'flex', flexDirection: 'column', overflow: 'hidden',
          animation: 'chatSlideIn 0.25s ease',
        }}>
          {/* Header */}
          <div style={{
            padding: '13px 16px',
            borderBottom: `1px solid rgba(255,255,255,0.07)`,
            background: `linear-gradient(90deg, rgba(245,166,35,0.08), rgba(0,240,255,0.04))`,
            display: 'flex', alignItems: 'center', gap: 8,
          }}>
            <div style={{ width: 7, height: 7, borderRadius: '50%', background: B.neonLime, boxShadow: `0 0 8px ${B.neonLime}`, animation: 'pulse 2s infinite' }} />
            <span style={{ color: B.amber, fontFamily: 'Orbitron,sans-serif', fontSize: 10, fontWeight: 700, letterSpacing: 2 }}>SNEAKERS FEST AI</span>
            <span style={{ color: '#555', fontSize: 9, fontFamily: 'Space Mono,monospace', marginLeft: 'auto' }}>online</span>
          </div>

          {/* Messages */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '12px 12px 8px', display: 'flex', flexDirection: 'column', gap: 10 }}>
            {messages.map((m, i) => (
              <div key={i} style={{
                alignSelf: m.role === 'user' ? 'flex-end' : 'flex-start',
                maxWidth: '82%',
                padding: '9px 13px',
                borderRadius: m.role === 'user' ? '14px 14px 3px 14px' : '14px 14px 14px 3px',
                background: m.role === 'user' ? `rgba(245,166,35,0.18)` : 'rgba(255,255,255,0.05)',
                border: `1px solid ${m.role === 'user' ? 'rgba(245,166,35,0.28)' : 'rgba(255,255,255,0.07)'}`,
                color: B.white, fontSize: 12.5, lineHeight: 1.6,
                fontFamily: 'Space Mono,monospace',
              }}>{m.content}</div>
            ))}
            {loading && (
              <div style={{ alignSelf: 'flex-start', display: 'flex', gap: 5, padding: '10px 14px', background: 'rgba(255,255,255,0.04)', borderRadius: 14, border: '1px solid rgba(255,255,255,0.07)' }}>
                {[0,1,2].map(i => <div key={i} style={{ width: 6, height: 6, borderRadius: '50%', background: B.amber, animation: `pulse 1.2s ${i*0.2}s infinite` }} />)}
              </div>
            )}
            <div ref={endRef} />
          </div>

          {/* Suggested prompts (shown when only greeting visible) */}
          {messages.length === 1 && (
            <div style={{ padding: '0 12px 10px', display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {['Ticket prices', 'Vendor spots', 'What is FNP?', 'Date & venue'].map(q => (
                <button key={q} onClick={() => { setInput(q); setTimeout(send, 0) }}
                  style={{ padding: '5px 10px', background: `${B.amber}14`, border: `1px solid ${B.amber}30`, borderRadius: 20, color: B.amber, fontSize: 9, fontFamily: 'Space Mono,monospace', cursor: 'pointer', letterSpacing: '0.08em' }}
                  onMouseEnter={e => e.currentTarget.style.background = `${B.amber}25`}
                  onMouseLeave={e => e.currentTarget.style.background = `${B.amber}14`}
                >{q}</button>
              ))}
            </div>
          )}

          {/* Input */}
          <div style={{ padding: '10px 12px 14px', borderTop: `1px solid rgba(255,255,255,0.07)`, display: 'flex', gap: 8 }}>
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && !e.shiftKey && send()}
              placeholder="Ask about Sneakers Fest..."
              style={{
                flex: 1, background: 'rgba(255,255,255,0.04)',
                border: `1px solid rgba(245,166,35,0.18)`, borderRadius: 10,
                color: B.white, padding: '9px 12px', fontSize: 12,
                fontFamily: 'Space Mono,monospace', outline: 'none',
              }}
            />
            <button
              onClick={send} disabled={loading || !input.trim()}
              style={{
                background: loading || !input.trim() ? B.gunmetal : B.amber,
                border: 'none', borderRadius: 10, padding: '9px 13px',
                cursor: loading || !input.trim() ? 'not-allowed' : 'pointer',
                color: B.black, fontFamily: 'Orbitron,sans-serif',
                fontSize: 10, fontWeight: 700, letterSpacing: 1,
                transition: 'background 0.2s',
              }}
            >GO</button>
          </div>
        </div>
      )}
    </>
  )
}
