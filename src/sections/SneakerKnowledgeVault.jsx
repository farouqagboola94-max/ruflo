import { useState, useCallback } from 'react'
import { B } from '../tokens'
import { GrainOverlay, SectionTag } from '../components/Shared'
import { claudeChat, useAiAvailable } from '../lib/catalystAI'
import AIComingSoon from '../components/AIComingSoon'

const API_KEY_STORAGE = 'catalyst-vault-api-key'

const SEED_NOTES = [
  { id: 1, title: 'Air Jordan 1 — Origin Lore', body: 'Nike paid the $5,000 NBA fine every game so MJ could wear the Bred colorway. The banned shoe became the most mythologised sneaker in history.', tags: ['history', 'jordan', 'nike'], date: '2026-07-10' },
  { id: 2, title: 'Lagos Sneaker Grail List', body: 'Top grails circulating in the Lagos market: Yeezy 2 Red October, Off-White Jordan 1 Chicago, Travis AJ1 Low, NOCTA Glide. Price ceiling keeps rising.', tags: ['lagos', 'grails', 'market'], date: '2026-07-14' },
  { id: 3, title: 'Sneakers Fest \'26 Prep', body: 'Dec 12 at Muri Okunola Park, VI. VIP access from 11AM. Collector room has limited drop access. Phalanx tier gets concierge + badge box.', tags: ['sf26', 'event', 'tickets'], date: '2026-07-18' },
  { id: 4, title: 'Resale Psychology', body: 'Scarcity drives 80% of resale premium. But the strongest resale holds are culture-attached shoes — MJ era, Virgil designs, artist collabs — not just limited quantities.', tags: ['resale', 'strategy', 'culture'], date: '2026-07-20' },
]

const SYSTEM = `You are a sneaker culture expert embedded in the Sneakers Fest '26 knowledge vault. You help Lagos sneakerheads understand drops, history, culture, resale strategy, and event logistics. Keep answers sharp, specific, and grounded in actual sneaker culture. Reference Lagos and Nigeria where relevant. Max 3 paragraphs.`

const TAG_COLORS = {
  history: B.amber, jordan: '#EF4444', nike: '#22C55E', lagos: B.neonCyan,
  grails: '#A855F7', market: '#F97316', sf26: B.amber, event: B.neonCyan,
  tickets: '#22C55E', resale: '#EF4444', strategy: '#A855F7', culture: '#EC4899',
  adidas: '#06B6D4', yeezy: '#84CC16', custom: B.smoke,
}

export default function SneakerKnowledgeVault() {
  const aiReady = useAiAvailable()
  const [notes, setNotes] = useState(SEED_NOTES)
  const [activeId, setActiveId] = useState(1)
  const [view, setView] = useState('vault')   // vault | analyze | add
  const [query, setQuery] = useState('')
  const [aiResult, setAiResult] = useState('')
  const [aiLoading, setAiLoading] = useState(false)
  const [aiError, setAiError] = useState('')
  const [newNote, setNewNote] = useState({ title: '', body: '', tags: '' })
  const [search, setSearch] = useState('')

  const hasKey = aiReady

  const activeNote = notes.find(n => n.id === activeId)

  const filtered = notes.filter(n => {
    const q = search.toLowerCase()
    return !q || n.title.toLowerCase().includes(q) || n.body.toLowerCase().includes(q) || n.tags.some(t => t.includes(q))
  })

  const analyzeNote = useCallback(async (note) => {
    if (!hasKey) { setAiError('AI analysis is not live yet. Your notes still work.'); return }
    setAiLoading(true)
    setAiResult('')
    setAiError('')
    setView('analyze')
    try {
      const prompt = `Analyze this sneaker note and expand on it with deeper cultural context, related drops, and actionable insight:\n\nTitle: ${note.title}\n\n${note.body}`
      const model = routeModel(prompt)
      const result = await claudeChat([{ role: 'user', content: prompt }], { feature: 'SneakerKnowledgeVault', model, system: SYSTEM })
      setAiResult(result)
    } catch (e) {
      setAiError(e.message === 'NO_KEY' ? 'AI analysis is not live yet.' : e.message)
    }
    setAiLoading(false)
  }, [hasKey])

  const askAI = useCallback(async () => {
    if (!query.trim()) return
    if (!hasKey) { setAiError('AI analysis is not live yet. Your notes still work.'); return }
    setAiLoading(true)
    setAiResult('')
    setAiError('')
    try {
      const model = routeModel(query)
      const result = await claudeChat([{ role: 'user', content: query }], { feature: 'SneakerKnowledgeVault', model, system: SYSTEM })
      setAiResult(result)
    } catch (e) {
      setAiError(e.message === 'NO_KEY' ? 'AI analysis is not live yet.' : e.message)
    }
    setAiLoading(false)
  }, [query, hasKey])

  function addNote() {
    if (!newNote.title.trim() || !newNote.body.trim()) return
    const tags = newNote.tags.split(',').map(t => t.trim().toLowerCase()).filter(Boolean)
    const note = { id: Date.now(), title: newNote.title, body: newNote.body, tags: tags.length ? tags : ['custom'], date: new Date().toISOString().slice(0, 10) }
    setNotes(prev => [note, ...prev])
    setActiveId(note.id)
    setNewNote({ title: '', body: '', tags: '' })
    setView('vault')
  }

  return (
    <section id="sneaker-vault" style={{ background: '#040404', padding: '80px 20px', position: 'relative', overflow: 'hidden', minHeight: '80vh' }}>
      <GrainOverlay />
      <style>{`
        @keyframes kvSlide { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:translateY(0)} }
        @keyframes kvPulse { 0%,100%{opacity:1} 50%{opacity:0.4} }
        .kv-note:hover { background: rgba(255,255,255,0.04) !important; }
      `}</style>


      <div style={{ maxWidth: 1000, margin: '0 auto' }}>
        <SectionTag>SNEAKER KNOWLEDGE VAULT</SectionTag>
        {!hasKey && <AIComingSoon feature="AI analysis in the Vault" />}
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12, marginBottom: 32 }}>
          <h2 style={{ fontFamily: "'Bebas Neue'", fontSize: 'clamp(2rem,5vw,3.5rem)', color: B.white, letterSpacing: '0.05em', margin: 0 }}>
            YOUR SOLE DATABASE
          </h2>
          <div style={{ display: 'flex', gap: 8 }}>
            {[['vault', 'VAULT'], ['analyze', 'AI SEARCH'], ['add', '+ NOTE']].map(([v, l]) => (
              <button key={v} onClick={() => setView(v)} style={{ padding: '7px 14px', background: view === v ? B.amber : 'transparent', color: view === v ? B.black : B.smoke, border: `1px solid ${view === v ? B.amber : '#222'}`, borderRadius: 4, fontFamily: "'Space Mono'", fontSize: 9, fontWeight: 700, letterSpacing: '0.1em', cursor: 'pointer', transition: 'all 0.15s' }}>
                {l}
              </button>
            ))}
          </div>
        </div>

        {/* VAULT VIEW */}
        {view === 'vault' && (
          <div style={{ display: 'grid', gridTemplateColumns: '260px 1fr', gap: 20, minHeight: 420 }}>
            <div>
              <input aria-label="Search notes" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search notes..." style={{ width: '100%', padding: '8px 12px', background: '#0d0d0d', border: '1px solid #1a1a1a', borderRadius: 4, color: B.white, fontFamily: "'Space Mono'", fontSize: 10, outline: 'none', boxSizing: 'border-box', marginBottom: 12 }} />
              <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {filtered.map(n => (
                  <div key={n.id} className="kv-note" onClick={() => setActiveId(n.id)} style={{ padding: '10px 12px', borderRadius: 4, background: activeId === n.id ? 'rgba(255,255,255,0.06)' : 'transparent', border: `1px solid ${activeId === n.id ? B.dim : 'transparent'}`, cursor: 'pointer', transition: 'background 0.15s' }}>
                    <div style={{ fontFamily: "'Space Mono'", fontSize: 10, color: activeId === n.id ? B.white : '#888', marginBottom: 3, lineHeight: 1.3 }}>{n.title}</div>
                    <div style={{ fontFamily: "'Space Mono'", fontSize: 8, color: B.dim }}>{n.date}</div>
                  </div>
                ))}
              </div>
            </div>

            {activeNote && (
              <div style={{ background: '#0d0d0d', border: '1px solid #1a1a1a', borderRadius: 8, padding: 24, animation: 'kvSlide 0.2s ease' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
                  <div>
                    <h3 style={{ fontFamily: "'Space Mono'", fontSize: 14, color: B.white, margin: '0 0 6px', fontWeight: 700 }}>{activeNote.title}</h3>
                    <div style={{ fontFamily: "'Space Mono'", fontSize: 8, color: B.dim }}>{activeNote.date}</div>
                  </div>
                  <button onClick={() => analyzeNote(activeNote)} style={{ padding: '7px 14px', background: `${B.neonCyan}15`, border: `1px solid ${B.neonCyan}44`, borderRadius: 4, color: B.neonCyan, fontFamily: "'Space Mono'", fontSize: 9, cursor: 'pointer', letterSpacing: '0.1em', whiteSpace: 'nowrap' }}>
                    AI EXPAND →
                  </button>
                </div>
                <p style={{ fontFamily: "'Space Mono'", fontSize: '0.72rem', color: B.smoke, lineHeight: 1.8, marginBottom: 16 }}>{activeNote.body}</p>
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                  {activeNote.tags.map(tag => (
                    <span key={tag} style={{ fontSize: 8, padding: '2px 8px', border: `1px solid ${(TAG_COLORS[tag] || '#444')}44`, color: TAG_COLORS[tag] || '#555', fontFamily: "'Space Mono'", borderRadius: 2, letterSpacing: '0.1em' }}>{tag}</span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* AI SEARCH VIEW */}
        {view === 'analyze' && (
          <div style={{ animation: 'kvSlide 0.25s ease' }}>
            <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
              <input aria-label="Ask about sneaker culture" value={query} onChange={e => setQuery(e.target.value)} onKeyDown={e => e.key === 'Enter' && askAI()} placeholder="Ask anything about sneaker culture, drops, Lagos market, resale..." style={{ flex: 1, padding: '12px 16px', background: '#0d0d0d', border: `1px solid ${B.amber}33`, borderRadius: 4, color: B.white, fontFamily: "'Space Mono'", fontSize: 11, outline: 'none' }} />
              <button onClick={askAI} disabled={aiLoading || !query.trim()} style={{ padding: '12px 20px', background: aiLoading ? '#111' : B.amber, color: aiLoading ? B.dim : B.black, border: 'none', borderRadius: 4, fontFamily: "'Space Mono'", fontSize: 10, fontWeight: 700, cursor: aiLoading ? 'wait' : 'pointer', transition: 'all 0.2s', whiteSpace: 'nowrap' }}>
                {aiLoading ? '···' : 'ASK'}
              </button>
            </div>


            {aiLoading && (
              <div style={{ display: 'flex', gap: 6, padding: 20 }}>
                {[0,1,2].map(i => <div key={i} style={{ width: 8, height: 8, borderRadius: '50%', background: B.amber, animation: `kvPulse 1.2s ${i*0.2}s infinite` }} />)}
              </div>
            )}

            {aiError && <div style={{ background: '#200', border: '1px solid #500', borderRadius: 4, padding: '10px 14px', fontFamily: "'Space Mono'", fontSize: 10, color: '#ff4444', marginBottom: 16 }}>{aiError}</div>}

            {aiResult && (
              <div style={{ background: '#0d0d0d', border: `1px solid ${B.neonCyan}22`, borderRadius: 8, padding: 24, animation: 'kvSlide 0.3s ease' }}>
                <div style={{ fontFamily: "'Space Mono'", fontSize: 8, color: B.neonCyan, letterSpacing: '0.2em', marginBottom: 16 }}>CLAUDE ANALYSIS</div>
                <div style={{ fontFamily: "'Space Mono'", fontSize: '0.72rem', color: B.smoke, lineHeight: 1.9, whiteSpace: 'pre-wrap' }}>{aiResult}</div>
              </div>
            )}

            {!aiResult && !aiLoading && !aiError && (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 8 }}>
                {['What grails are most likely to hold value?', 'Explain the Off-White x Nike collaboration', 'How does the Lagos sneaker resale market compare to London?', 'What makes a sneaker culturally important?'].map(q => (
                  <button key={q} onClick={() => { setQuery(q); askAI() }} style={{ padding: '12px 14px', background: 'rgba(255,255,255,0.02)', border: '1px solid #1a1a1a', borderRadius: 4, color: B.smoke, fontFamily: "'Space Mono'", fontSize: 9, cursor: 'pointer', textAlign: 'left', lineHeight: 1.5, transition: 'all 0.15s' }} onMouseEnter={e => { e.currentTarget.style.borderColor = `${B.amber}44`; e.currentTarget.style.color = B.smoke }} onMouseLeave={e => { e.currentTarget.style.borderColor = '#1a1a1a'; e.currentTarget.style.color = '#555' }}>
                    {q}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ADD NOTE VIEW */}
        {view === 'add' && (
          <div style={{ maxWidth: 560, animation: 'kvSlide 0.25s ease' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <input aria-label="Note title" value={newNote.title} onChange={e => setNewNote(p => ({ ...p, title: e.target.value }))} placeholder="Note title..." style={{ padding: '10px 14px', background: '#0d0d0d', border: '1px solid #1a1a1a', borderRadius: 4, color: B.white, fontFamily: "'Space Mono'", fontSize: 11, outline: 'none' }} />
              <textarea aria-label="Note body" value={newNote.body} onChange={e => setNewNote(p => ({ ...p, body: e.target.value }))} placeholder="Write your note..." rows={6} style={{ padding: '10px 14px', background: '#0d0d0d', border: '1px solid #1a1a1a', borderRadius: 4, color: B.white, fontFamily: "'Space Mono'", fontSize: 11, outline: 'none', resize: 'vertical', lineHeight: 1.7 }} />
              <input aria-label="Tags, comma separated" value={newNote.tags} onChange={e => setNewNote(p => ({ ...p, tags: e.target.value }))} placeholder="Tags (comma-separated): jordan, lagos, resale..." style={{ padding: '10px 14px', background: '#0d0d0d', border: '1px solid #1a1a1a', borderRadius: 4, color: B.white, fontFamily: "'Space Mono'", fontSize: 10, outline: 'none' }} />
              <button onClick={addNote} disabled={!newNote.title.trim() || !newNote.body.trim()} style={{ padding: 12, background: newNote.title && newNote.body ? B.amber : '#111', color: newNote.title && newNote.body ? B.black : B.dim, border: 'none', borderRadius: 4, fontFamily: "'Space Mono'", fontSize: 10, fontWeight: 700, cursor: newNote.title && newNote.body ? 'pointer' : 'not-allowed', letterSpacing: '0.1em', transition: 'all 0.2s' }}>
                SAVE TO VAULT
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
