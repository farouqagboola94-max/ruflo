import { useState, useRef, useEffect } from 'react'
import { B } from '../tokens'

const API_URL = import.meta.env.VITE_OLLAMA_URL || ''
const MODEL = import.meta.env.VITE_OLLAMA_MODEL || 'llama3.2'

const SYSTEM = `You are the Sneakers Fest AI assistant — Lagos, Nigeria's premier sneaker culture event and community. Be knowledgeable, enthusiastic, and speak in a friendly urban tone. Key facts: Event date July 18 2026, Lagos Nigeria. Tickets: General ₦15,000 · VIP ₦35,000 · Ultra VIP ₦75,000. Headliner: DJ Spinall. Community: 10,000+ members across TikTok, YouTube, Twitter, Instagram, Snapchat, WhatsApp.`

export default function AIChat() {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState([
    { role: 'assistant', content: "Yo! I'm the Sneakers Fest AI. Ask me anything about the event, kicks, lineup, or tickets." }
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const endRef = useRef(null)

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [messages, loading])

  async function send() {
    if (!input.trim() || loading) return
    const text = input.trim()
    setInput('')
    setMessages(prev => [...prev, { role: 'user', content: text }])
    setLoading(true)

    if (!API_URL) {
      setMessages(prev => [...prev, { role: 'assistant', content: 'AI chat needs Ollama running. Set VITE_OLLAMA_URL in your environment and run: docker compose up ollama && docker exec sneakers-ollama ollama pull llama3.2' }])
      setLoading(false)
      return
    }

    try {
      const res = await fetch(`${API_URL}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: MODEL,
          messages: [
            { role: 'system', content: SYSTEM },
            ...messages.map(m => ({ role: m.role, content: m.content })),
            { role: 'user', content: text }
          ],
          stream: false
        })
      })
      const data = await res.json()
      setMessages(prev => [...prev, { role: 'assistant', content: data.message?.content || 'No response received.' }])
    } catch {
      setMessages(prev => [...prev, { role: 'assistant', content: 'AI offline — make sure Ollama is running and VITE_OLLAMA_URL is set in Netlify environment variables.' }])
    }
    setLoading(false)
  }

  return (
    <>
      {/* Trigger button */}
      <button
        onClick={() => setOpen(o => !o)}
        aria-label={open ? 'Close AI chat' : 'Open AI chat'}
        style={{
          position: 'fixed', bottom: 28, left: 28, zIndex: 1001,
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
          position: 'fixed', bottom: 94, left: 28, zIndex: 1000,
          width: 340, height: 490,
          borderRadius: 18,
          background: 'rgba(8,8,12,0.94)',
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
            <div style={{ width: 7, height: 7, borderRadius: '50%', background: API_URL ? B.neonLime : B.smoke, boxShadow: API_URL ? `0 0 8px ${B.neonLime}` : 'none', animation: API_URL ? 'pulse 2s infinite' : 'none' }} />
            <span style={{ color: B.amber, fontFamily: 'Orbitron,sans-serif', fontSize: 10, fontWeight: 700, letterSpacing: 2 }}>SNEAKERS FEST AI</span>
            <span style={{ color: '#444', fontSize: 9, fontFamily: 'Space Mono,monospace', marginLeft: 'auto' }}>{API_URL ? `Ollama · ${MODEL}` : 'offline'}</span>
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
                color: B.white, fontSize: 12.5, lineHeight: 1.55,
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
