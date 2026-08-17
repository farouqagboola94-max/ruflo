import { useState, useEffect, useCallback } from 'react'
import { B } from '../tokens'
import { GrainOverlay, SectionTag } from '../components/Shared'

const API = '/.netlify/functions/group-claim'
const STORE_KEY = 'sf26_group'
const CREW_KEY = 'sf26_crew'

const TIERS = [
  { key: 'general', label: 'General Admission', price: 5000 },
  { key: 'vip',     label: 'VIP Access',        price: 10000 },
  { key: 'vvip',    label: 'VVIP Access',       price: 25000 },
  { key: 'phalanx', label: 'Phalanx Package',   price: 50000 },
]

const naira = n => `₦${Number(n).toLocaleString()}`

const readLS = k => { try { return JSON.parse(localStorage.getItem(k)) || null } catch { return null } }
const writeLS = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)) } catch {} }

const label = { fontFamily: "'Space Mono', monospace", fontSize: 9, letterSpacing: '0.22em', color: B.smoke }
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

function GroupPanel({ group, onReset, onClaim, claiming, error }) {
  const [copied, setCopied] = useState(false)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')

  const share = async () => {
    const text = `We are going to Sneakers Fest '26 together. Group code ${group.code} - ${group.tierLabel}, ${naira(group.priceNGN)} each. Claim your slot:`
    const url = `${window.location.origin}/#group-tickets`
    try {
      if (navigator.share) await navigator.share({ title: "Sneakers Fest '26", text, url })
      else {
        await navigator.clipboard.writeText(`${text}\n${url}`)
        setCopied(true); setTimeout(() => setCopied(false), 2200)
      }
    } catch { /* share sheet dismissed */ }
  }

  const filled = group.size - group.slotsLeft
  const pct = Math.round((group.paidCount / group.size) * 100)

  return (
    <div className="card-3d" style={{ background: B.charcoal, border: `1px solid ${B.amber}35`, borderRadius: 8, padding: '26px 24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 14 }}>
        <div>
          <div style={{ ...label, color: B.neonCyan, marginBottom: 6 }}>GROUP BOOKING</div>
          <div style={{ fontFamily: "'Orbitron', monospace", fontWeight: 900, fontSize: 20, color: B.white }}>
            {group.tierLabel}
          </div>
          <div style={{ ...label, marginTop: 6 }}>
            {naira(group.priceNGN)} EACH &middot; OPENED BY {group.organiserName.toUpperCase()}
          </div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ ...label, marginBottom: 6 }}>GROUP CODE</div>
          <div style={{
            fontFamily: "'Orbitron', monospace", fontWeight: 900, fontSize: 26, letterSpacing: '0.18em',
            color: B.amber, textShadow: `0 0 18px ${B.amber}45`,
          }}>{group.code}</div>
        </div>
      </div>

      {/* Progress */}
      <div style={{ margin: '22px 0 6px', display: 'flex', justifyContent: 'space-between', ...label }}>
        <span>{group.paidCount} OF {group.size} PAID</span>
        <span>{group.slotsLeft} {group.slotsLeft === 1 ? 'SLOT' : 'SLOTS'} LEFT</span>
      </div>
      <div style={{ height: 6, background: B.gunmetal, borderRadius: 3, overflow: 'hidden' }}>
        <div style={{ height: '100%', width: `${pct}%`, background: `linear-gradient(90deg, ${B.amber}80, ${B.amber})`, transition: 'width 0.6s ease' }} />
      </div>
      {filled > group.paidCount && (
        <div style={{ ...label, marginTop: 8, fontSize: 6.5, color: B.smoke + '90' }}>
          {filled - group.paidCount} HELD, AWAITING PAYMENT &middot; HOLDS EXPIRE AFTER {group.holdMinutes} MIN
        </div>
      )}

      {group.members.length > 0 && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7, margin: '18px 0' }}>
          {group.members.map(m => (
            <span key={m.name} style={{
              padding: '5px 11px', borderRadius: 3, background: B.black,
              border: `1px solid ${m.paid ? B.neonLime + '55' : B.gunmetal}`,
              fontFamily: "'Space Mono', monospace", fontSize: 8, letterSpacing: '0.1em',
              color: m.paid ? B.neonLime : B.smoke,
            }}>{m.name}{m.paid ? ' PAID' : ' HELD'}</span>
          ))}
        </div>
      )}

      {/* Claim your own slot */}
      {group.slotsLeft > 0 ? (
        <form onSubmit={e => { e.preventDefault(); onClaim(name, email) }}
          style={{ marginTop: 18, paddingTop: 18, borderTop: `1px solid ${B.gunmetal}`, display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div style={{ ...label, color: B.amber }}>CLAIM YOUR SLOT &mdash; YOU PAY FOR YOUR OWN TICKET</div>
          <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
            <Field label="YOUR NAME">
              <input aria-label="Your name" style={field} value={name} maxLength={28} onChange={e => setName(e.target.value)} placeholder="Bola" />
            </Field>
            <Field label="YOUR EMAIL">
              <input aria-label="Email address" style={field} type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@email.com" />
            </Field>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' }}>
            <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 8, letterSpacing: '0.14em', color: B.neonMagenta, minHeight: 14 }}>{error}</span>
            <button type="submit" disabled={claiming || name.trim().length < 2 || !email.includes('@')}
              style={{
                padding: '12px 28px', border: 'none', borderRadius: 3,
                background: name.trim().length >= 2 && email.includes('@') ? B.amber : B.gunmetal,
                color: name.trim().length >= 2 && email.includes('@') ? B.black : B.smoke,
                cursor: claiming ? 'default' : 'pointer', opacity: claiming ? 0.6 : 1,
                fontFamily: "'Space Mono', monospace", fontSize: 9, fontWeight: 700, letterSpacing: '0.2em',
              }}>{claiming ? 'OPENING CHECKOUT...' : `PAY ${naira(group.priceNGN)}`}</button>
          </div>
        </form>
      ) : (
        <div style={{ marginTop: 18, paddingTop: 18, borderTop: `1px solid ${B.gunmetal}`, ...label, color: B.neonMagenta }}>
          THIS GROUP IS FULL
        </div>
      )}

      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginTop: 18 }}>
        <button onClick={share} style={{
          padding: '11px 22px', border: `1px solid ${B.amber}55`, borderRadius: 3, cursor: 'pointer',
          background: 'transparent', color: B.amber,
          fontFamily: "'Space Mono', monospace", fontSize: 9, fontWeight: 700, letterSpacing: '0.18em',
        }}>{copied ? 'COPIED' : 'SHARE THE CODE'}</button>
        <button onClick={onReset} style={{
          padding: '11px 20px', borderRadius: 3, cursor: 'pointer', background: 'transparent',
          border: `1px solid ${B.gunmetal}`, color: B.smoke,
          fontFamily: "'Space Mono', monospace", fontSize: 9, letterSpacing: '0.16em',
        }}>ANOTHER GROUP</button>
      </div>
    </div>
  )
}

export default function GroupTickets() {
  const [group,    setGroup]    = useState(null)
  const [mode,     setMode]     = useState('find')
  const [busy,     setBusy]     = useState(false)
  const [claiming, setClaiming] = useState(false)
  const [error,    setError]    = useState('')
  const [form,     setForm]     = useState({ tier: 'general', size: 4, organiserName: '', code: '' })

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const refresh = useCallback(async (code) => {
    try {
      const r = await fetch(`${API}?code=${encodeURIComponent(code)}`)
      if (!r.ok) return
      const d = await r.json()
      setGroup(d.group); writeLS(STORE_KEY, d.group)
    } catch { /* keep whatever is on screen */ }
  }, [])

  useEffect(() => {
    const stored = readLS(STORE_KEY)
    if (stored?.code) { setGroup(stored); refresh(stored.code) }
  }, [refresh])

  async function submit(e) {
    e.preventDefault()
    setBusy(true); setError('')
    try {
      if (mode === 'find') {
        const r = await fetch(`${API}?code=${encodeURIComponent(form.code)}`)
        const d = await r.json().catch(() => ({}))
        if (!r.ok) { setError(d.error || 'Could not find that group'); return }
        setGroup(d.group); writeLS(STORE_KEY, d.group)
      } else {
        const crew = readLS(CREW_KEY)
        const r = await fetch(API, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action: 'open',
            tier: form.tier,
            size: Number(form.size),
            organiserName: form.organiserName,
            crewCode: crew?.code || undefined,
          }),
        })
        const d = await r.json().catch(() => ({}))
        if (!r.ok) { setError(d.error || 'Could not open the group'); return }
        setGroup(d.group); writeLS(STORE_KEY, d.group)
      }
    } catch {
      setError('Network error. Check your connection.')
    } finally { setBusy(false) }
  }

  async function claim(name, email) {
    setClaiming(true); setError('')
    try {
      const r = await fetch(API, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'claim', code: group.code, name, email }),
      })
      const d = await r.json().catch(() => ({}))
      if (!r.ok) { setError(d.error || 'Could not claim a slot'); return }
      setGroup(d.group); writeLS(STORE_KEY, d.group)
      // Hand off to Paystack for this person's own ticket.
      window.location.href = d.payment_url
    } catch {
      setError('Network error. Check your connection.')
    } finally { setClaiming(false) }
  }

  const tier = TIERS.find(t => t.key === form.tier)

  return (
    <section id="group-tickets" style={{ position: 'relative', overflow: 'hidden', background: B.black, padding: '80px 24px' }}>
      <GrainOverlay />
      <div style={{ position: 'relative', zIndex: 10, maxWidth: 1100, margin: '0 auto' }}>
        <SectionTag>COME AS A GROUP</SectionTag>

        <div style={{ marginBottom: 44, maxWidth: 580 }}>
          <h2 className="reveal-3d" style={{ fontFamily: "'Orbitron', monospace", fontWeight: 900, fontSize: 'clamp(22px, 4vw, 38px)', color: B.white, lineHeight: 1.1 }}>
            GROUP<span style={{ color: B.amber }}> TICKETS</span>
          </h2>
          <p style={{ fontFamily: "'Syne', sans-serif", fontSize: 14, color: B.smoke, marginTop: 10, lineHeight: 1.7 }}>
            Open a group, share the code, and everyone claims their own slot. Nobody fronts the money for
            the whole crew &mdash; each person pays for their own ticket and gets their own pass.
          </p>
        </div>

        {group ? (
          <GroupPanel
            group={group}
            claiming={claiming}
            error={error}
            onClaim={claim}
            onReset={() => { setGroup(null); writeLS(STORE_KEY, null); setError('') }}
          />
        ) : (
          <div className="reveal-3d" style={{ background: B.charcoal, border: `1px solid ${B.gunmetal}`, borderRadius: 8, padding: '26px 24px' }}>
            <div style={{ display: 'flex', gap: 8, marginBottom: 22 }}>
              {[['find', 'I HAVE A CODE'], ['open', 'OPEN A GROUP']].map(([m, text]) => (
                <button key={m} onClick={() => { setMode(m); setError('') }} style={{
                  padding: '9px 18px', borderRadius: 3, cursor: 'pointer',
                  background: mode === m ? B.amber : 'transparent',
                  border: `1px solid ${mode === m ? B.amber : B.gunmetal}`,
                  color: mode === m ? B.black : B.smoke,
                  fontFamily: "'Space Mono', monospace", fontSize: 9, fontWeight: 700, letterSpacing: '0.16em',
                }}>{text}</button>
              ))}
            </div>

            <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {mode === 'find' ? (
                <Field label="GROUP CODE">
                  <input aria-label="Group code"
                    style={{ ...field, fontFamily: "'Orbitron', monospace", fontSize: 18, letterSpacing: '0.18em', textTransform: 'uppercase' }}
                    value={form.code} maxLength={7} placeholder="AC234"
                    onChange={e => set('code', e.target.value.toUpperCase())} />
                </Field>
              ) : (
                <>
                  <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
                    <Field label="TICKET TIER">
                      <select aria-label="Ticket tier" style={{ ...field, fontFamily: "'Space Mono', monospace", fontSize: 12 }}
                        value={form.tier} onChange={e => set('tier', e.target.value)}>
                        {TIERS.map(t => <option key={t.key} value={t.key}>{t.label} — {naira(t.price)}</option>)}
                      </select>
                    </Field>
                    <Field label="HOW MANY OF YOU">
                      <select aria-label="How many of you" style={{ ...field, fontFamily: "'Space Mono', monospace", fontSize: 12 }}
                        value={form.size} onChange={e => set('size', e.target.value)}>
                        {Array.from({ length: 9 }, (_, i) => i + 2).map(n => <option key={n} value={n}>{n} people</option>)}
                      </select>
                    </Field>
                  </div>
                  <Field label="YOUR NAME">
                    <input aria-label="Your name" style={field} value={form.organiserName} maxLength={28}
                      onChange={e => set('organiserName', e.target.value)} placeholder="Ade" />
                  </Field>
                  <div style={{ ...label, fontSize: 6.5, color: B.smoke + '90' }}>
                    TOTAL IF EVERYONE PAYS: {naira(tier.price * Number(form.size))} &middot; {naira(tier.price)} EACH
                  </div>
                </>
              )}

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' }}>
                <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 8, letterSpacing: '0.14em', color: B.neonMagenta, minHeight: 14 }}>{error}</span>
                <button type="submit" disabled={busy || (mode === 'find' ? form.code.length < 4 : form.organiserName.trim().length < 2)}
                  style={{
                    padding: '12px 30px', border: 'none', borderRadius: 3, cursor: busy ? 'default' : 'pointer',
                    background: B.amber, color: B.black, opacity: busy ? 0.6 : 1,
                    fontFamily: "'Space Mono', monospace", fontSize: 9, fontWeight: 700, letterSpacing: '0.2em',
                  }}>{busy ? 'WORKING...' : mode === 'find' ? 'FIND GROUP' : 'OPEN GROUP'}</button>
              </div>
            </form>
          </div>
        )}
      </div>
    </section>
  )
}
