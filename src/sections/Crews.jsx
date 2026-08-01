import { useState, useEffect, useCallback } from 'react'
import { B } from '../tokens'
import { GrainOverlay, SectionTag } from '../components/Shared'

const CITIES = ['Lagos', 'Abuja', 'Port Harcourt', 'Kano', 'Ibadan', 'Benin City',
  'Enugu', 'Kaduna', 'Owerri', 'Warri', 'Uyo', 'Calabar', 'Jos', 'Abeokuta', 'Akure', 'Other']

const STORE_KEY = 'sf26_crew'
const API = '/.netlify/functions/crew'

function readStored() {
  try { return JSON.parse(localStorage.getItem(STORE_KEY)) || null } catch { return null }
}
function writeStored(v) {
  try { localStorage.setItem(STORE_KEY, JSON.stringify(v)) } catch {}
}

const label = { fontFamily: "'Space Mono', monospace", fontSize: 7, letterSpacing: '0.22em', color: B.smoke }
const field = {
  width: '100%', background: B.black, border: `1px solid ${B.gunmetal}`, borderRadius: 4,
  padding: '10px 13px', color: B.white, outline: 'none', fontFamily: "'Syne', sans-serif", fontSize: 14,
}

function Field({ label: text, children }) {
  return (
    <label style={{ display: 'block', flex: '1 1 150px' }}>
      <span style={{ ...label, display: 'block', marginBottom: 6 }}>{text}</span>
      {children}
    </label>
  )
}

function CrewCard({ crew, onLeave }) {
  const [copied, setCopied] = useState(false)

  const share = async () => {
    const text = `Join my crew "${crew.crewName}" for Sneakers Fest '26 — code ${crew.code}`
    const url = `${window.location.origin}/#crews`
    try {
      if (navigator.share) await navigator.share({ title: "Sneakers Fest '26", text, url })
      else {
        await navigator.clipboard.writeText(`${text}\n${url}`)
        setCopied(true); setTimeout(() => setCopied(false), 2200)
      }
    } catch { /* user dismissed the share sheet */ }
  }

  return (
    <div className="card-3d" style={{ background: B.charcoal, border: `1px solid ${B.amber}35`, borderRadius: 8, padding: '26px 24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 14 }}>
        <div style={{ minWidth: 0 }}>
          <div style={{ ...label, color: B.neonCyan, marginBottom: 6 }}>YOUR CREW</div>
          <div style={{ fontFamily: "'Orbitron', monospace", fontWeight: 900, fontSize: 22, color: B.white, wordBreak: 'break-word' }}>
            {crew.crewName}
          </div>
          <div style={{ ...label, marginTop: 6 }}>
            {crew.city.toUpperCase()} &middot; {crew.memberCount} {crew.memberCount === 1 ? 'MEMBER' : 'MEMBERS'}
          </div>
        </div>
        <div style={{ textAlign: 'right', flexShrink: 0 }}>
          <div style={{ ...label, marginBottom: 6 }}>CREW CODE</div>
          <div style={{
            fontFamily: "'Orbitron', monospace", fontWeight: 900, fontSize: 26, letterSpacing: '0.18em',
            color: B.amber, textShadow: `0 0 18px ${B.amber}45`,
          }}>{crew.code}</div>
        </div>
      </div>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7, margin: '20px 0' }}>
        {crew.members.map(m => (
          <span key={m.name} style={{
            padding: '5px 11px', borderRadius: 3, background: B.black,
            border: `1px solid ${m.founder ? B.amber + '55' : B.gunmetal}`,
            fontFamily: "'Space Mono', monospace", fontSize: 8, letterSpacing: '0.1em',
            color: m.founder ? B.amber : B.mist,
          }}>{m.name}{m.founder ? ' *' : ''}</span>
        ))}
      </div>

      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
        <button onClick={share} style={{
          padding: '11px 22px', border: 'none', borderRadius: 3, cursor: 'pointer',
          background: B.amber, color: B.black,
          fontFamily: "'Space Mono', monospace", fontSize: 9, fontWeight: 700, letterSpacing: '0.18em',
        }}>{copied ? 'COPIED' : 'INVITE YOUR CREW'}</button>
        <button onClick={onLeave} style={{
          padding: '11px 20px', borderRadius: 3, cursor: 'pointer', background: 'transparent',
          border: `1px solid ${B.gunmetal}`, color: B.smoke,
          fontFamily: "'Space Mono', monospace", fontSize: 9, letterSpacing: '0.16em',
        }}>SWITCH CREW</button>
      </div>
      <div style={{ ...label, marginTop: 14, fontSize: 6.5, color: B.smoke + '70' }}>
        * FOUNDER &middot; SHARE THE CODE, NOT A LINK &mdash; IT WORKS OVER WHATSAPP AND IN PERSON
      </div>
    </div>
  )
}

export default function Crews() {
  const [crew,   setCrew]   = useState(null)
  const [mode,   setMode]   = useState('join')
  const [status, setStatus] = useState({ state: 'idle', message: '' })
  const [top,    setTop]    = useState([])
  const [form,   setForm]   = useState({ crewName: '', city: '', founderName: '', code: '', memberName: '' })

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const loadTop = useCallback(async () => {
    try {
      const r = await fetch(`${API}?top=1`)
      if (r.ok) setTop((await r.json()).crews || [])
    } catch { /* leaderboard is decorative; failing quietly is fine */ }
  }, [])

  useEffect(() => {
    const stored = readStored()
    if (stored) setCrew(stored)
    loadTop()
  }, [loadTop])

  async function submit(e) {
    e.preventDefault()
    setStatus({ state: 'busy', message: '' })

    const payload = mode === 'create'
      ? { action: 'create', crewName: form.crewName, city: form.city, founderName: form.founderName }
      : { action: 'join', code: form.code, memberName: form.memberName }

    try {
      const r = await fetch(API, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      const data = await r.json().catch(() => ({}))
      if (!r.ok) {
        setStatus({ state: 'error', message: data.error || 'Something went wrong. Try again.' })
        return
      }
      setCrew(data.crew)
      writeStored(data.crew)
      setStatus({
        state: 'ok',
        message: data.alreadyMember ? 'You were already in this crew.' : 'You are in.',
      })
      loadTop()
    } catch {
      setStatus({ state: 'error', message: 'Network error. Check your connection.' })
    }
  }

  const busy = status.state === 'busy'
  const canSubmit = mode === 'create'
    ? form.crewName.trim().length >= 2 && form.founderName.trim().length >= 2 && form.city
    : form.code.trim().length >= 4 && form.memberName.trim().length >= 2

  return (
    <section id="crews" style={{ position: 'relative', overflow: 'hidden', background: B.black, padding: '80px 24px' }}>
      <GrainOverlay />
      <div style={{ position: 'relative', zIndex: 10, maxWidth: 1100, margin: '0 auto' }}>
        <SectionTag>ROLL TOGETHER</SectionTag>

        <div style={{ marginBottom: 44, maxWidth: 560 }}>
          <h2 className="reveal-3d" style={{ fontFamily: "'Orbitron', monospace", fontWeight: 900, fontSize: 'clamp(22px, 4vw, 38px)', color: B.white, lineHeight: 1.1 }}>
            CREW<span style={{ color: B.amber }}> CODES</span>
          </h2>
          <p style={{ fontFamily: "'Syne', sans-serif", fontSize: 14, color: B.smoke, marginTop: 10, lineHeight: 1.7 }}>
            Nobody comes to this alone. Start a crew, get a five-character code, and pass it to the people
            you actually roll with. Your crew shows up together on the wall and on the rankings.
          </p>
        </div>

        {crew ? (
          <CrewCard crew={crew} onLeave={() => { setCrew(null); writeStored(null); setStatus({ state: 'idle', message: '' }) }} />
        ) : (
          <div className="reveal-3d" style={{ background: B.charcoal, border: `1px solid ${B.gunmetal}`, borderRadius: 8, padding: '26px 24px' }}>
            <div style={{ display: 'flex', gap: 8, marginBottom: 22 }}>
              {[['join', 'JOIN A CREW'], ['create', 'START ONE']].map(([m, text]) => (
                <button key={m} onClick={() => { setMode(m); setStatus({ state: 'idle', message: '' }) }}
                  style={{
                    padding: '9px 18px', borderRadius: 3, cursor: 'pointer',
                    background: mode === m ? B.amber : 'transparent',
                    border: `1px solid ${mode === m ? B.amber : B.gunmetal}`,
                    color: mode === m ? B.black : B.smoke,
                    fontFamily: "'Space Mono', monospace", fontSize: 9, fontWeight: 700, letterSpacing: '0.16em',
                  }}>{text}</button>
              ))}
            </div>

            <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {mode === 'create' ? (
                <>
                  <Field label="CREW NAME">
                    <input style={field} value={form.crewName} maxLength={32}
                      onChange={e => set('crewName', e.target.value)} placeholder="Sole Battalion" />
                  </Field>
                  <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
                    <Field label="YOUR NAME">
                      <input style={field} value={form.founderName} maxLength={28}
                        onChange={e => set('founderName', e.target.value)} placeholder="Ade" />
                    </Field>
                    <Field label="CITY">
                      <select style={{ ...field, fontFamily: "'Space Mono', monospace", fontSize: 12 }}
                        value={form.city} onChange={e => set('city', e.target.value)}>
                        <option value="">Select city</option>
                        {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
                      </select>
                    </Field>
                  </div>
                </>
              ) : (
                <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
                  <Field label="CREW CODE">
                    <input
                      style={{ ...field, fontFamily: "'Orbitron', monospace", fontSize: 18, letterSpacing: '0.18em', textTransform: 'uppercase' }}
                      value={form.code} maxLength={7} placeholder="AC234"
                      onChange={e => set('code', e.target.value.toUpperCase())} />
                  </Field>
                  <Field label="YOUR NAME">
                    <input style={field} value={form.memberName} maxLength={28}
                      onChange={e => set('memberName', e.target.value)} placeholder="Bola" />
                  </Field>
                </div>
              )}

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' }}>
                <span style={{
                  fontFamily: "'Space Mono', monospace", fontSize: 8, letterSpacing: '0.14em', minHeight: 14,
                  color: status.state === 'error' ? B.neonMagenta : B.neonLime,
                }}>{status.message}</span>
                <button type="submit" disabled={!canSubmit || busy} style={{
                  padding: '12px 30px', border: 'none', borderRadius: 3,
                  background: canSubmit ? B.amber : B.gunmetal,
                  color: canSubmit ? B.black : B.smoke,
                  cursor: canSubmit && !busy ? 'pointer' : 'default', opacity: busy ? 0.6 : 1,
                  fontFamily: "'Space Mono', monospace", fontSize: 9, fontWeight: 700, letterSpacing: '0.2em',
                }}>{busy ? 'WORKING...' : mode === 'create' ? 'CREATE CREW' : 'JOIN CREW'}</button>
              </div>
            </form>
          </div>
        )}

        {top.length > 0 && (
          <div style={{ marginTop: 34 }}>
            <div style={{ ...label, color: B.neonCyan, letterSpacing: '0.3em', marginBottom: 16 }}>BIGGEST CREWS</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(230px, 1fr))', gap: 12 }}>
              {top.map((c, i) => (
                <div key={c.code} className="card-3d" style={{
                  display: 'flex', alignItems: 'center', gap: 12, padding: '13px 15px',
                  background: B.charcoal, border: `1px solid ${i === 0 ? B.amber + '50' : B.gunmetal}`, borderRadius: 6,
                }}>
                  <span style={{
                    fontFamily: "'Orbitron', monospace", fontWeight: 900, fontSize: 11,
                    color: i === 0 ? B.amber : B.smoke, minWidth: 22,
                  }}>#{i + 1}</span>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 13, color: B.white, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{c.crewName}</div>
                    <div style={{ ...label, fontSize: 6.5 }}>{c.city.toUpperCase()}</div>
                  </div>
                  <span style={{ fontFamily: "'Orbitron', monospace", fontWeight: 900, fontSize: 14, color: B.neonLime }}>{c.memberCount}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
