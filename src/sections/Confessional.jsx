import { useState } from 'react'
import { B } from '../tokens'
import { GrainOverlay, SectionTag } from '../components/Shared'

const CITIES = ['Lagos','Abuja','Port Harcourt','Kano','Ibadan','Benin City','Enugu',
  'Kaduna','Owerri','Warri','Uyo','Calabar','Jos','Abeokuta','Akure','Other']

const SEEDS = [
  { id: 'SC-SEED-01', confession: "I've had my Jordan 1 Chicagos boxed for 2 years. I'm too scared to crease them.",        displayName: 'Anonymous',   city: 'Lagos',         relates: 47  },
  { id: 'SC-SEED-02', confession: "Honestly, Nike Dunks are overrated. I said what I said and I stand by every word.",       displayName: 'SoleMaven',   city: 'Abuja',         relates: 31  },
  { id: 'SC-SEED-03', confession: "I spent my rent money on a pair of Yeezys. Absolutely zero regrets.",                     displayName: 'Anonymous',   city: 'Port Harcourt', relates: 88  },
  { id: 'SC-SEED-04', confession: "I've faked knowing a shoe's release date in conversation at least 10 times.",             displayName: 'Anonymous',   city: 'Lagos',         relates: 55  },
  { id: 'SC-SEED-05', confession: "My most expensive pair has never left the house. It lives in a glass case.",              displayName: 'CrateDigger', city: 'Kano',          relates: 22  },
  { id: 'SC-SEED-06', confession: "I judge people by their shoes before I even learn their name. I am not sorry.",           displayName: 'Anonymous',   city: 'Lagos',         relates: 103 },
  { id: 'SC-SEED-07', confession: "I bought 3 pairs of the same brand because my ex wore them. Petty. Still worth it.",     displayName: 'HeadSpaceG', city: 'Ibadan',         relates: 19  },
  { id: 'SC-SEED-08', confession: "I've worn reps to a sneaker event and nobody clocked it. Not once.",                     displayName: 'Anonymous',   city: 'Lagos',         relates: 67  },
  { id: 'SC-SEED-09', confession: "I cancelled a date because they showed up in Crocs. This is not a drill.",               displayName: 'SoleSister',  city: 'Lagos',         relates: 44  },
  { id: 'SC-SEED-10', confession: "My girlfriend thinks I own 10 pairs. I own 47. The rest live at my cousin's place.",     displayName: 'Anonymous',   city: 'Warri',         relates: 119 },
  { id: 'SC-SEED-11', confession: "I've cried over a failed SNKRS drop. More than once. It still hurts.",                   displayName: 'Anonymous',   city: 'Lagos',         relates: 76  },
  { id: 'SC-SEED-12', confession: "I have a spreadsheet of every grail I want. It has 200 rows. I checked it today.",       displayName: 'DataSneaker', city: 'Calabar',       relates: 38  },
]

const LOCAL_KEY   = 'sf26_local_confessions'
const RELATES_KEY = 'sf26_confessional_relates'
const MAX         = 220

function readLS(key, def) {
  try { return JSON.parse(localStorage.getItem(key)) ?? def } catch { return def }
}

function ConfessCard({ item, voted, onRelate }) {
  const count = item.relates + (voted ? 1 : 0)
  return (
    <div className="card-3d" style={{
      background: B.charcoal, border: `1px solid ${voted ? B.neonMagenta + '40' : B.gunmetal}`,
      borderRadius: 6, padding: '20px 18px', display: 'flex', flexDirection: 'column', gap: 12,
      transition: 'border-color 0.25s',
    }}>
      <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 14, color: B.white, lineHeight: 1.65, flex: 1 }}>
        <span style={{ color: B.amber, fontSize: 18, marginRight: 3, fontFamily: "'Orbitron', monospace", lineHeight: 1 }}>"</span>
        {item.confession}
        <span style={{ color: B.amber, fontSize: 18, marginLeft: 3, fontFamily: "'Orbitron', monospace", lineHeight: 1 }}>"</span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8, flexWrap: 'wrap' }}>
        <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 7, color: B.neonCyan, letterSpacing: '0.12em' }}>
          {item.displayName.toUpperCase()} &middot; {item.city.toUpperCase()}
        </div>
        <button
          onClick={() => onRelate(item.id)}
          style={{
            display: 'flex', alignItems: 'center', gap: 5, background: 'none', cursor: 'pointer',
            border: `1px solid ${voted ? B.neonMagenta : B.gunmetal}`, borderRadius: 3,
            padding: '4px 10px', color: voted ? B.neonMagenta : B.smoke, transition: 'all 0.2s',
          }}
          onMouseEnter={e => { if (!voted) e.currentTarget.style.borderColor = B.neonMagenta + '60' }}
          onMouseLeave={e => { if (!voted) e.currentTarget.style.borderColor = B.gunmetal }}
        >
          <span style={{ fontSize: 13, lineHeight: 1 }}>{voted ? '♥' : '♡'}</span>
          <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 7, letterSpacing: '0.1em' }}>
            {count} RELATE
          </span>
        </button>
      </div>
    </div>
  )
}

export default function Confessional() {
  const [locals,  setLocals]  = useState(() => readLS(LOCAL_KEY, []))
  const [related, setRelated] = useState(() => new Set(readLS(RELATES_KEY, [])))
  const [form,    setForm]    = useState({ confession: '', displayName: '', city: '' })
  const [status,  setStatus]  = useState('idle')

  function toggleRelate(id) {
    setRelated(prev => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id); else next.add(id)
      try { localStorage.setItem(RELATES_KEY, JSON.stringify([...next])) } catch {}
      return next
    })
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!form.confession.trim() || !form.city) return
    setStatus('submitting')
    try {
      const r = await fetch('/.netlify/functions/confess', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          confession:  form.confession.trim(),
          displayName: form.displayName.trim() || undefined,
          city:        form.city,
        }),
      })
      if (!r.ok) throw new Error('Failed')
      const data = await r.json()
      const entry = {
        id:          data.submissionId,
        confession:  form.confession.trim(),
        displayName: form.displayName.trim() || 'Anonymous',
        city:        form.city,
        relates:     0,
      }
      const updated = [entry, ...locals]
      setLocals(updated)
      try { localStorage.setItem(LOCAL_KEY, JSON.stringify(updated.slice(0, 20))) } catch {}
      setForm({ confession: '', displayName: '', city: '' })
      setStatus('success')
      setTimeout(() => setStatus('idle'), 4000)
    } catch {
      setStatus('error')
      setTimeout(() => setStatus('idle'), 3000)
    }
  }

  const all = [...locals, ...SEEDS]

  return (
    <section id="confessional" style={{ position: 'relative', overflow: 'hidden', background: B.black, padding: '80px 24px' }}>
      <GrainOverlay />
      <div style={{ position: 'relative', zIndex: 10, maxWidth: 1100, margin: '0 auto' }}>
        <SectionTag>COMMUNITY CONFESSIONS</SectionTag>

        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12, marginBottom: 48 }}>
          <div>
            <h2 className="reveal-3d" style={{ fontFamily: "'Orbitron', monospace", fontWeight: 900, fontSize: 'clamp(22px, 4vw, 38px)', color: B.white, lineHeight: 1.1 }}>
              THE SF'26<br />
              <span style={{ color: B.amber }}>CONFESSIONAL</span>
            </h2>
            <p style={{ fontFamily: "'Syne', sans-serif", fontSize: 14, color: B.smoke, marginTop: 10, maxWidth: 460 }}>
              Anonymous hot takes. Unpopular opinions. Sneaker sins confessed in public. Drop yours — no judgment, just vibes.
            </p>
          </div>
          <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 7, color: B.smoke + '60', letterSpacing: '0.15em', textAlign: 'right' }}>
            {all.length} CONFESSIONS<br />ON THE WALL
          </div>
        </div>

        {/* Submit form */}
        <div className="reveal-3d" style={{ background: B.charcoal, border: `1px solid ${B.gunmetal}`, borderRadius: 8, padding: '28px 24px', marginBottom: 48 }}>
          <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 8, color: B.neonCyan, letterSpacing: '0.3em', marginBottom: 18 }}>DROP YOUR CONFESSION</div>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>

            <div>
              <textarea
                value={form.confession}
                onChange={e => setForm(f => ({ ...f, confession: e.target.value.slice(0, MAX) }))}
                placeholder="I've never actually cleaned my Air Forces..."
                rows={3}
                style={{
                  width: '100%', background: B.black, borderRadius: 4, resize: 'vertical',
                  border: `1px solid ${form.confession.length > MAX - 20 ? B.neonMagenta : B.gunmetal}`,
                  padding: '12px 14px', color: B.white, outline: 'none', transition: 'border-color 0.2s',
                  fontFamily: "'Syne', sans-serif", fontSize: 14, lineHeight: 1.6,
                }}
                onFocus={e => { if (form.confession.length <= MAX - 20) e.target.style.borderColor = B.neonCyan + '50' }}
                onBlur={e => { e.target.style.borderColor = form.confession.length > MAX - 20 ? B.neonMagenta : B.gunmetal }}
              />
              <div style={{
                fontFamily: "'Space Mono', monospace", fontSize: 7, letterSpacing: '0.1em',
                color: form.confession.length > MAX - 20 ? B.neonMagenta : B.smoke,
                marginTop: 4, textAlign: 'right',
              }}>
                {form.confession.length}/{MAX}
              </div>
            </div>

            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              <input
                type="text"
                value={form.displayName}
                onChange={e => setForm(f => ({ ...f, displayName: e.target.value.slice(0, 32) }))}
                placeholder="Name / Handle (optional)"
                style={{
                  flex: '1 1 160px', background: B.black, border: `1px solid ${B.gunmetal}`, borderRadius: 4,
                  padding: '10px 14px', color: B.white, fontFamily: "'Syne', sans-serif", fontSize: 13, outline: 'none',
                }}
                onFocus={e => { e.target.style.borderColor = B.neonCyan + '50' }}
                onBlur={e => { e.target.style.borderColor = B.gunmetal }}
              />
              <select
                value={form.city}
                onChange={e => setForm(f => ({ ...f, city: e.target.value }))}
                style={{
                  flex: '1 1 160px', background: B.black, borderRadius: 4,
                  border: `1px solid ${form.city ? B.neonCyan + '60' : B.gunmetal}`,
                  padding: '10px 14px', color: form.city ? B.white : B.smoke, outline: 'none',
                  fontFamily: "'Space Mono', monospace", fontSize: 11,
                }}
              >
                <option value="">Select city *</option>
                {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 10 }}>
              <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 8, letterSpacing: '0.15em', minHeight: 16 }}>
                {status === 'success' && <span style={{ color: B.neonLime }}>CONFESSION RECEIVED. THE WALL HEARD YOU.</span>}
                {status === 'error'   && <span style={{ color: B.neonMagenta }}>SOMETHING WENT WRONG. TRY AGAIN.</span>}
              </div>
              <button
                type="submit"
                disabled={!form.confession.trim() || !form.city || status === 'submitting'}
                style={{
                  padding: '12px 32px', borderRadius: 3, border: 'none', letterSpacing: '0.2em',
                  background: form.confession.trim() && form.city ? B.amber : B.gunmetal,
                  color: form.confession.trim() && form.city ? B.black : B.smoke,
                  cursor: form.confession.trim() && form.city ? 'pointer' : 'default',
                  fontFamily: "'Space Mono', monospace", fontSize: 9, fontWeight: 700,
                  transition: 'all 0.2s', opacity: status === 'submitting' ? 0.6 : 1,
                }}
              >
                {status === 'submitting' ? 'SENDING...' : 'CONFESS'}
              </button>
            </div>
          </form>
        </div>

        {/* Confession wall */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
          {all.map(item => (
            <ConfessCard
              key={item.id}
              item={item}
              voted={related.has(item.id)}
              onRelate={toggleRelate}
            />
          ))}
        </div>

        <div style={{ marginTop: 32, fontFamily: "'Space Mono', monospace", fontSize: 7, color: B.smoke + '50', letterSpacing: '0.15em', textAlign: 'center' }}>
          ALL CONFESSIONS ARE ANONYMOUS BY DEFAULT &middot; COMMUNITY VIBES ONLY &middot; SF'26
        </div>
      </div>
    </section>
  )
}
