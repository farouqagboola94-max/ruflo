import { useState, useEffect, useCallback } from 'react'
import { B } from '../tokens'
import { GrainOverlay, SectionTag } from '../components/Shared'

const API = '/.netlify/functions/ticket-lookup'
const STORE_KEY = 'sf26_pass'

// Same shape the door app validates against, so a typo is caught here rather
// than at the gate with a queue behind you.
const TICKET_RE = /^SF26-[A-Z]{3}-[A-F0-9]{6}$/

const readLS = () => { try { return JSON.parse(localStorage.getItem(STORE_KEY)) || null } catch { return null } }
const writeLS = v => { try { localStorage.setItem(STORE_KEY, JSON.stringify(v)) } catch {} }

const label = { fontFamily: "'Space Mono', monospace", fontSize: 7, letterSpacing: '0.22em', color: B.smoke }

const normalise = raw => String(raw || '').toUpperCase().replace(/\s/g, '')

function Pass({ pass, onForget }) {
  const used = pass.checkedIn
  const accent = used ? B.smoke : B.amber

  return (
    <div className="card-3d" style={{
      background: B.charcoal, border: `1px solid ${accent}45`, borderRadius: 10, overflow: 'hidden',
    }}>
      <div style={{ height: 4, background: used ? B.gunmetal : `linear-gradient(90deg, ${B.amber}, ${B.neonMagenta})` }} />

      <div style={{ padding: '26px 24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: 14, flexWrap: 'wrap' }}>
          <div>
            <div style={{ ...label, color: used ? B.smoke : B.neonCyan }}>
              {used ? 'ALREADY SCANNED' : 'YOUR PASS'}
            </div>
            <div style={{ fontFamily: "'Orbitron', monospace", fontWeight: 900, fontSize: 22, color: B.white, marginTop: 6 }}>
              {pass.name}
            </div>
            <div style={{ ...label, marginTop: 6 }}>
              {(pass.tierLabel || pass.tier || '').toUpperCase()}
              {pass.qty > 1 ? ` - ${pass.qty} TICKETS` : ''}
            </div>
          </div>
          <div style={{ ...label, textAlign: 'right', lineHeight: 1.9 }}>
            DEC 12, 2026<br />
            12:00 - 22:00<br />
            MURI OKUNOLA PARK
          </div>
        </div>

        {/* The code the gate types. Kept as large and legible as it will go. */}
        <div style={{
          margin: '24px 0 6px', padding: '20px 12px', borderRadius: 8, textAlign: 'center',
          background: B.black, border: `1px dashed ${accent}55`,
        }}>
          <div style={{
            fontFamily: "'Orbitron', monospace", fontWeight: 900,
            fontSize: 'clamp(19px, 6vw, 30px)', letterSpacing: '0.14em',
            color: accent, textShadow: used ? 'none' : `0 0 22px ${B.amber}40`,
            wordBreak: 'break-all',
          }}>{pass.ticketId}</div>
          <div style={{ ...label, marginTop: 10, fontSize: 6.5 }}>SHOW THIS AT THE GATE</div>
        </div>

        {used && (
          <div style={{ ...label, color: B.amber, marginTop: 14, lineHeight: 1.7 }}>
            SCANNED {pass.checkedInAt ? new Date(pass.checkedInAt).toLocaleString() : ''}
            <br />IF THAT WAS NOT YOU, FIND A STAFF MEMBER.
          </div>
        )}

        <button onClick={onForget} style={{
          marginTop: 20, padding: '10px 18px', borderRadius: 3, cursor: 'pointer', background: 'transparent',
          border: `1px solid ${B.gunmetal}`, color: B.smoke,
          fontFamily: "'Space Mono', monospace", fontSize: 9, letterSpacing: '0.16em',
        }}>LOOK UP ANOTHER</button>
      </div>
    </div>
  )
}

export default function MyPass() {
  const [pass, setPass] = useState(readLS)
  const [code, setCode] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  const lookup = useCallback(async (raw, { quiet = false } = {}) => {
    const id = normalise(raw)
    if (!TICKET_RE.test(id)) {
      if (!quiet) setError('That does not look like a Sneakers Fest ticket ID')
      return
    }
    setBusy(true); if (!quiet) setError('')
    try {
      const r = await fetch(`${API}?id=${encodeURIComponent(id)}`)
      if (r.status === 404) { if (!quiet) setError('No ticket with that ID'); return }
      if (!r.ok) { if (!quiet) setError('Could not reach the box office'); return }
      const data = await r.json()
      setPass(data); writeLS(data)
    } catch {
      // A stored pass is still shown offline; only a fresh lookup can fail.
      if (!quiet) setError('Network error. Check your connection.')
    } finally { setBusy(false) }
  }, [])

  // Refresh a stored pass so the scanned state is current, quietly.
  useEffect(() => {
    const stored = readLS()
    if (stored?.ticketId) lookup(stored.ticketId, { quiet: true })
  }, [lookup])

  return (
    <section id="my-pass" style={{ position: 'relative', overflow: 'hidden', background: B.black, padding: '80px 24px' }}>
      <GrainOverlay />
      <div style={{ position: 'relative', zIndex: 10, maxWidth: 1100, margin: '0 auto' }}>
        <SectionTag>YOUR TICKET</SectionTag>

        <div style={{ marginBottom: 40, maxWidth: 540 }}>
          <h2 className="reveal-3d" style={{ fontFamily: "'Orbitron', monospace", fontWeight: 900, fontSize: 'clamp(22px, 4vw, 38px)', color: B.white, lineHeight: 1.1 }}>
            MY<span style={{ color: B.amber }}> PASS</span>
          </h2>
          <p style={{ fontFamily: "'Syne', sans-serif", fontSize: 14, color: B.smoke, marginTop: 10, lineHeight: 1.7 }}>
            Lost the email? Put in your ticket ID and your pass comes back. It stays on this phone,
            so you can pull it up at the gate without signal.
          </p>
        </div>

        {pass ? (
          <Pass pass={pass} onForget={() => { setPass(null); writeLS(null); setCode('') }} />
        ) : (
          <form
            onSubmit={e => { e.preventDefault(); lookup(code) }}
            className="reveal-3d"
            style={{ background: B.charcoal, border: `1px solid ${B.gunmetal}`, borderRadius: 8, padding: '26px 24px', maxWidth: 520 }}
          >
            <label htmlFor="pass-ticket-id" style={{ ...label, display: 'block', marginBottom: 8 }}>
              TICKET ID
            </label>
            <input
              id="pass-ticket-id"
              value={code}
              onChange={e => setCode(e.target.value.toUpperCase())}
              placeholder="SF26-GEN-A1B2C3"
              autoCapitalize="characters"
              autoCorrect="off"
              spellCheck="false"
              style={{
                width: '100%', boxSizing: 'border-box', padding: '14px',
                background: B.black, border: `1px solid ${B.gunmetal}`, borderRadius: 6, color: B.white, outline: 'none',
                fontFamily: "'Orbitron', monospace", fontSize: 17, letterSpacing: '0.1em', textAlign: 'center',
              }} />
            <div style={{ ...label, fontSize: 6.5, marginTop: 8, lineHeight: 1.7 }}>
              IT IS IN YOUR CONFIRMATION EMAIL, IN THE FORM SF26-XXX-XXXXXX
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap', marginTop: 18 }}>
              <span role="alert" style={{ fontFamily: "'Space Mono', monospace", fontSize: 8, letterSpacing: '0.14em', color: B.neonMagenta, minHeight: 14 }}>
                {error}
              </span>
              <button type="submit" disabled={busy || code.trim().length < 8} style={{
                padding: '12px 30px', border: 'none', borderRadius: 3,
                background: code.trim().length >= 8 ? B.amber : B.gunmetal,
                color: code.trim().length >= 8 ? B.black : B.smoke,
                cursor: busy ? 'default' : 'pointer', opacity: busy ? 0.6 : 1,
                fontFamily: "'Space Mono', monospace", fontSize: 9, fontWeight: 700, letterSpacing: '0.2em',
              }}>{busy ? 'LOOKING...' : 'FIND MY PASS'}</button>
            </div>
          </form>
        )}
      </div>
    </section>
  )
}
