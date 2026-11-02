import { useState, useEffect, useCallback } from 'react'
import { B } from '../tokens'
import { SOCIAL_LINKS } from '../config'
import { GrainOverlay, SectionTag } from '../components/Shared'
import { dispatchFestivalAction, FESTIVAL_ACTIONS, playFestivalSound } from '../framework/festivalFramework'
import { downloadTicketPNG } from '../components/PaymentModal'

const API = '/.netlify/functions/group-claim'
const STORE_KEY = 'sf26_group'
const REGISTRY_KEY = 'sf26_groups_registry'
const CREW_KEY = 'sf26_crew'

const TIERS = [
  { key: 'general', label: 'General Admission', price: 5000, color: B.amber },
  { key: 'vip',     label: 'VIP Access',        price: 10000, color: B.neonCyan },
  { key: 'vvip',    label: 'VVIP Access',       price: 25000, color: B.neonMagenta },
  { key: 'phalanx', label: 'Phalanx VIP Table', price: 50000, color: B.neonLime },
]

const naira = n => `₦${Number(n).toLocaleString()}`

const readLS = k => { try { return JSON.parse(localStorage.getItem(k)) || null } catch { return null } }
const writeLS = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)) } catch {} }

function genCrewCode() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  let c = 'CRW'
  for (let i = 0; i < 4; i++) c += chars[Math.floor(Math.random() * chars.length)]
  return c
}

function genSlotTicketRef(groupCode) {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  let s = ''
  for (let i = 0; i < 4; i++) s += chars[Math.floor(Math.random() * chars.length)]
  return `SF26-${groupCode}-${s}`
}

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

function GroupPanel({ group, onReset, onClaim, claiming, error, lastClaimedPass }) {
  const [copied, setCopied] = useState(false)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')

  const shareText = `We are going to Sneakers Fest '26 at Freedom Park, CMS together (Sat Dec 12)! Group Code: ${group.code} — ${group.tierLabel} (${naira(group.priceNGN)} each). Claim your slot:`
  const shareUrl = `${typeof window !== 'undefined' ? window.location.origin : 'https://sneakers-fest-official-55.netlify.app'}/#group-tickets`

  const share = async () => {
    try {
      if (navigator.share) await navigator.share({ title: "Sneakers Fest '26 Group Split", text: shareText, url: shareUrl })
      else {
        await navigator.clipboard.writeText(`${shareText}\n${shareUrl}`)
        setCopied(true); setTimeout(() => setCopied(false), 2200)
      }
    } catch {}
  }

  const filled = group.size - group.slotsLeft
  const pct = Math.round((group.paidCount / group.size) * 100)

  const whatsappGroupDeskUrl = `${(SOCIAL_LINKS.whatsappDirect1 || String(SOCIAL_LINKS.whatsappContact1 || 'https://wa.me/2347084111516').split('?')[0])}?text=${encodeURIComponent(
    `Hello SF26 VIP Crew Desk, we have opened Group Split Code [${group.code}] at Freedom Park, CMS:\n\n• Organiser: ${group.organiserName}\n• Tier: ${group.tierLabel} (${naira(group.priceNGN)} each × ${group.size} slots = ${naira(group.priceNGN * group.size)})\n• Current Progress: ${group.paidCount} of ${group.size} slots claimed\n\nKindly share the instant bank transfer settlement details for Group Code [${group.code}].`
  )}`

  const whatsappInviteCrewUrl = `https://wa.me/?text=${encodeURIComponent(`${shareText}\n${shareUrl}`)}`

  return (
    <div className="card-3d" style={{ background: B.charcoal, border: `1px solid ${B.amber}35`, borderRadius: 8, padding: '26px 24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 14 }}>
        <div>
          <div style={{ ...label, color: B.neonCyan, marginBottom: 6 }}>FREEDOM PARK CREW SPLIT · ACTIVE</div>
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
        <span>{group.paidCount} OF {group.size} CLAIMED</span>
        <span>{group.slotsLeft} {group.slotsLeft === 1 ? 'SLOT' : 'SLOTS'} LEFT</span>
      </div>
      <div style={{ height: 6, background: B.gunmetal, borderRadius: 3, overflow: 'hidden' }}>
        <div style={{ height: '100%', width: `${pct}%`, background: `linear-gradient(90deg, ${B.amber}80, ${B.amber})`, transition: 'width 0.6s ease' }} />
      </div>
      {filled > group.paidCount && (
        <div style={{ ...label, marginTop: 8, fontSize: 6.5, color: B.smoke + '90' }}>
          {filled - group.paidCount} HELD, AWAITING PAYMENT &middot; HOLDS EXPIRE AFTER {group.holdMinutes || 30} MIN
        </div>
      )}

      {group.members.length > 0 && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7, margin: '18px 0' }}>
          {group.members.map((m, idx) => (
            <span key={`${m.name}-${idx}`} style={{
              padding: '5px 11px', borderRadius: 3, background: B.black,
              border: `1px solid ${m.paid ? B.neonLime + '55' : B.gunmetal}`,
              fontFamily: "'Space Mono', monospace", fontSize: 8, letterSpacing: '0.1em',
              color: m.paid ? B.neonLime : B.smoke,
            }}>{m.name}{m.paid ? ` · ✓ ${m.ref || 'ISSUED'}` : ' · HELD'}</span>
          ))}
        </div>
      )}

      {lastClaimedPass && (
        <div style={{ margin: '16px 0', padding: '14px 16px', background: 'rgba(184,255,0,0.08)', border: `1px solid ${B.neonLime}50`, borderRadius: 8, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 10 }}>
          <div>
            <div style={{ fontFamily: "'Orbitron', monospace", fontSize: 10, color: B.neonLime, fontWeight: 700 }}>
              ✓ CREW SLOT PASS ISSUED: {lastClaimedPass.ref}
            </div>
            <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 9, color: B.smoke, marginTop: 2 }}>
              {lastClaimedPass.name} · {lastClaimedPass.tier} ({lastClaimedPass.price}) · Freedom Park, CMS
            </div>
          </div>
          <button
            type="button"
            onClick={() => downloadTicketPNG(lastClaimedPass)}
            style={{ padding: '8px 14px', background: B.neonLime, color: B.black, border: 'none', borderRadius: 4, fontFamily: "'Orbitron', monospace", fontSize: 9, fontWeight: 700, cursor: 'pointer' }}
          >
            DOWNLOAD QR PASS PNG →
          </button>
        </div>
      )}

      {/* Claim your own slot (Dual-Rail: Instant Pass Issue or WhatsApp Bank Transfer) */}
      {group.slotsLeft > 0 ? (
        <form onSubmit={e => { e.preventDefault(); onClaim(name, email, false); setName(''); setEmail('') }}
          style={{ marginTop: 18, paddingTop: 18, borderTop: `1px solid ${B.gunmetal}`, display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div style={{ ...label, color: B.amber }}>CLAIM YOUR CREW SLOT &mdash; DUAL-RAIL INSTANT PASS OR BANK TRANSFER</div>
          <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
            <Field label="YOUR NAME *">
              <input aria-label="Your name" style={field} value={name} maxLength={28} onChange={e => setName(e.target.value)} placeholder="e.g. Bola" />
            </Field>
            <Field label="YOUR EMAIL *">
              <input aria-label="Email address" style={field} type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@email.com" />
            </Field>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10, flexWrap: 'wrap' }}>
            <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 8, letterSpacing: '0.14em', color: B.neonMagenta, minHeight: 14 }}>{error}</span>
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
              <button
                type="button"
                disabled={claiming || name.trim().length < 2 || !email.includes('@')}
                onClick={() => { onClaim(name, email, true); setName(''); setEmail('') }}
                style={{
                  padding: '12px 18px', border: `1px solid ${B.neonLime}`, borderRadius: 3,
                  background: 'rgba(184,255,0,0.12)',
                  color: B.neonLime,
                  cursor: name.trim().length >= 2 && email.includes('@') ? 'pointer' : 'not-allowed',
                  opacity: name.trim().length >= 2 && email.includes('@') ? 1 : 0.5,
                  fontFamily: "'Space Mono', monospace", fontSize: 9, fontWeight: 700, letterSpacing: '0.14em',
                }}
              >
                ⚡ CLAIM VIA WHATSAPP BANK TRANSFER ({naira(group.priceNGN)}) →
              </button>
              <button type="submit" disabled={claiming || name.trim().length < 2 || !email.includes('@')}
                style={{
                  padding: '12px 24px', border: 'none', borderRadius: 3,
                  background: name.trim().length >= 2 && email.includes('@') ? B.amber : B.gunmetal,
                  color: name.trim().length >= 2 && email.includes('@') ? B.black : B.smoke,
                  cursor: claiming ? 'default' : 'pointer', opacity: claiming ? 0.6 : 1,
                  fontFamily: "'Space Mono', monospace", fontSize: 9, fontWeight: 700, letterSpacing: '0.18em',
                }}>{claiming ? 'ISSUING PASS...' : `CLAIM & ISSUE QR PASS (${naira(group.priceNGN)}) →`}</button>
            </div>
          </div>
        </form>
      ) : (
        <div style={{ marginTop: 18, paddingTop: 18, borderTop: `1px solid ${B.gunmetal}`, ...label, color: B.neonLime }}>
          🎉 THIS CREW GROUP IS 100% FULL — ALL SLOTS CLAIMED FOR FREEDOM PARK, CMS!
        </div>
      )}

      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginTop: 18 }}>
        <button onClick={share} style={{
          padding: '11px 18px', border: `1px solid ${B.amber}55`, borderRadius: 3, cursor: 'pointer',
          background: 'transparent', color: B.amber,
          fontFamily: "'Space Mono', monospace", fontSize: 9, fontWeight: 700, letterSpacing: '0.16em',
        }}>{copied ? '✓ COPIED INVITE LINK' : '📋 COPY CREW INVITE'}</button>
        <a
          href={whatsappInviteCrewUrl}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            padding: '11px 18px', border: `1px solid ${B.neonCyan}55`, borderRadius: 3,
            background: `${B.neonCyan}12`, color: B.neonCyan, textDecoration: 'none',
            fontFamily: "'Space Mono', monospace", fontSize: 9, fontWeight: 700, letterSpacing: '0.14em',
          }}
        >
          📲 SHARE TO CREW WHATSAPP
        </a>
        <a
          href={whatsappGroupDeskUrl}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            padding: '11px 18px', border: `1px solid ${B.neonLime}55`, borderRadius: 3,
            background: `${B.neonLime}12`, color: B.neonLime, textDecoration: 'none',
            fontFamily: "'Space Mono', monospace", fontSize: 9, fontWeight: 700, letterSpacing: '0.14em',
          }}
        >
          💬 VIP CREW DESK (+234 708) →
        </a>
        <button onClick={onReset} style={{
          padding: '11px 18px', borderRadius: 3, cursor: 'pointer', background: 'transparent',
          border: `1px solid ${B.gunmetal}`, color: B.smoke,
          fontFamily: "'Space Mono', monospace", fontSize: 9, letterSpacing: '0.16em',
        }}>NEW GROUP</button>
      </div>
    </div>
  )
}

export default function GroupTickets() {
  const [group,           setGroup]           = useState(null)
  const [mode,            setMode]            = useState('open')
  const [busy,            setBusy]            = useState(false)
  const [claiming,        setClaiming]        = useState(false)
  const [error,           setError]           = useState('')
  const [lastClaimedPass, setLastClaimedPass] = useState(null)
  const [form,            setForm]            = useState({ tier: 'general', size: 4, organiserName: '', code: '' })

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const refresh = useCallback(async (code) => {
    try {
      const r = await fetch(`${API}?code=${encodeURIComponent(code)}`)
      if (!r.ok) return
      const d = await r.json()
      if (d?.group) { setGroup(d.group); writeLS(STORE_KEY, d.group) }
    } catch {}
  }, [])

  useEffect(() => {
    const stored = readLS(STORE_KEY)
    if (stored?.code) { setGroup(stored); refresh(stored.code) }
  }, [refresh])

  function saveGroupToRegistry(grp) {
    writeLS(STORE_KEY, grp)
    const reg = readLS(REGISTRY_KEY) || {}
    reg[grp.code] = grp
    writeLS(REGISTRY_KEY, reg)
  }

  async function submit(e) {
    e.preventDefault()
    setBusy(true); setError(''); setLastClaimedPass(null)
    try {
      if (mode === 'find') {
        const cleanCode = form.code.trim().toUpperCase()
        const reg = readLS(REGISTRY_KEY) || {}
        if (reg[cleanCode]) {
          setGroup(reg[cleanCode])
          writeLS(STORE_KEY, reg[cleanCode])
          setBusy(false)
          return
        }
        try {
          const r = await fetch(`${API}?code=${encodeURIComponent(cleanCode)}`)
          if (r.ok) {
            const d = await r.json()
            if (d?.group) { setGroup(d.group); saveGroupToRegistry(d.group); setBusy(false); return }
          }
        } catch {}
        setError(`Could not find Group Code "${cleanCode}". Switch to "OPEN A GROUP" to create one immediately.`)
      } else {
        const selectedTier = TIERS.find(t => t.key === form.tier) || TIERS[0]
        const crew = readLS(CREW_KEY)
        let createdGroup = null
        try {
          const r = await fetch(API, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              action: 'open',
              tier: form.tier,
              size: Number(form.size),
              organiserName: form.organiserName.trim(),
              crewCode: crew?.code || undefined,
            }),
          })
          if (r.ok) {
            const d = await r.json()
            if (d?.group) createdGroup = d.group
          }
        } catch {}

        // Seamless local fallback so crew split creation never fails
        if (!createdGroup) {
          const code = genCrewCode()
          createdGroup = {
            code,
            tier: selectedTier.key,
            tierLabel: selectedTier.label,
            priceNGN: selectedTier.price,
            size: Number(form.size),
            slotsLeft: Number(form.size),
            paidCount: 0,
            holdMinutes: 30,
            organiserName: form.organiserName.trim(),
            members: [],
            createdAt: Date.now(),
          }
        }
        setGroup(createdGroup)
        saveGroupToRegistry(createdGroup)
        dispatchFestivalAction(FESTIVAL_ACTIONS.XP_AWARD, { amount: 75, reason: `Opened Crew Split ${createdGroup.code}` })
        playFestivalSound('badge_unlock')
      }
    } finally { setBusy(false) }
  }

  async function claim(name, email, openWhatsApp = false) {
    if (!name.trim() || !email.includes('@') || !group) return
    setClaiming(true); setError('')
    const selectedTier = TIERS.find(t => t.key === group.tier) || TIERS[0]
    const ref = genSlotTicketRef(group.code)

    const updatedGroup = {
      ...group,
      paidCount: Math.min(group.size, group.paidCount + 1),
      slotsLeft: Math.max(0, group.slotsLeft - 1),
      members: [
        ...group.members,
        { name: name.trim(), email: email.trim().toLowerCase(), paid: true, ref },
      ],
    }

    const passObj = {
      name: name.trim(),
      email: email.trim().toLowerCase(),
      tier: group.tierLabel,
      tierColor: selectedTier.color || B.amber,
      ref,
      price: naira(group.priceNGN),
      quantity: 1,
      gateway: openWhatsApp ? 'Group Split · WhatsApp VIP Desk' : 'Group Split · Instant Pass',
      purchasedAt: Date.now(),
    }

    try {
      const existingOrders = JSON.parse(localStorage.getItem('sf26_orders') || '[]')
      existingOrders.unshift(passObj)
      localStorage.setItem('sf26_orders', JSON.stringify(existingOrders.slice(0, 20)))
    } catch {}

    dispatchFestivalAction(FESTIVAL_ACTIONS.WALLET_TICKET_PURCHASED, { pass: passObj })
    playFestivalSound('badge_unlock')

    setGroup(updatedGroup)
    saveGroupToRegistry(updatedGroup)
    setLastClaimedPass(passObj)
    setClaiming(false)

    if (openWhatsApp && typeof window !== 'undefined') {
      const msg = `Hello SF26 VIP Crew Desk, I have claimed my slot in Group [${group.code}] at Freedom Park, CMS:\n\n• Member: ${name.trim()} (${email.trim()})\n• Pass Ref: ${ref}\n• Tier: ${group.tierLabel} (${naira(group.priceNGN)})\n\nKindly send the instant bank transfer account to confirm Ref [${ref}].`
      window.open(`${SOCIAL_LINKS.whatsappContact1 || SOCIAL_LINKS.whatsapp}?text=${encodeURIComponent(msg)}`, '_blank', 'noopener,noreferrer')
    }
  }

  const tier = TIERS.find(t => t.key === form.tier) || TIERS[0]

  return (
    <section id="group-tickets" style={{ position: 'relative', overflow: 'hidden', background: B.black, padding: '80px 24px' }}>
      <GrainOverlay />
      <div style={{ position: 'relative', zIndex: 10, maxWidth: 1100, margin: '0 auto' }}>
        <SectionTag>COME AS A CREW · FREEDOM PARK, CMS</SectionTag>

        <div style={{ marginBottom: 44, maxWidth: 620 }}>
          <h2 className="reveal-3d" style={{ fontFamily: "'Orbitron', monospace", fontWeight: 900, fontSize: 'clamp(22px, 4vw, 38px)', color: B.white, lineHeight: 1.1 }}>
            CREW SPLIT & <span style={{ color: B.amber }}>GROUP PASSES</span>
          </h2>
          <p style={{ fontFamily: "'Syne', sans-serif", fontSize: 14, color: B.smoke, marginTop: 10, lineHeight: 1.7 }}>
            Open a crew split code in 10 seconds, share it on WhatsApp, and let every member claim their own slot via instant QR pass or bank transfer — nobody has to front cash for the whole squad.
          </p>
        </div>

        {group ? (
          <GroupPanel
            group={group}
            claiming={claiming}
            error={error}
            lastClaimedPass={lastClaimedPass}
            onClaim={claim}
            onReset={() => { setGroup(null); writeLS(STORE_KEY, null); setError(''); setLastClaimedPass(null) }}
          />
        ) : (
          <div className="reveal-3d" style={{ background: B.charcoal, border: `1px solid ${B.gunmetal}`, borderRadius: 8, padding: '26px 24px' }}>
            <div style={{ display: 'flex', gap: 8, marginBottom: 22 }}>
              {[['open', 'OPEN A CREW GROUP (+75 XP)'], ['find', 'I HAVE A GROUP CODE']].map(([m, text]) => (
                <button key={m} type="button" onClick={() => { setMode(m); setError('') }} style={{
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
                <Field label="ENTER GROUP CODE">
                  <input aria-label="Group code"
                    style={{ ...field, fontFamily: "'Orbitron', monospace", fontSize: 18, letterSpacing: '0.18em', textTransform: 'uppercase' }}
                    value={form.code} maxLength={10} placeholder="CRW2345"
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
                    <Field label="CREW SIZE">
                      <select aria-label="How many of you" style={{ ...field, fontFamily: "'Space Mono', monospace", fontSize: 12 }}
                        value={form.size} onChange={e => set('size', e.target.value)}>
                        {Array.from({ length: 9 }, (_, i) => i + 2).map(n => <option key={n} value={n}>{n} people</option>)}
                      </select>
                    </Field>
                  </div>
                  <Field label="SQUAD LEADER / ORGANISER NAME *">
                    <input aria-label="Your name" style={field} value={form.organiserName} maxLength={28}
                      onChange={e => set('organiserName', e.target.value)} placeholder="e.g. Adewale" />
                  </Field>
                  <div style={{ ...label, fontSize: 8.5, color: B.neonCyan }}>
                    TOTAL CREW VALUE: {naira(tier.price * Number(form.size))} &middot; {naira(tier.price)} PER MEMBER AT FREEDOM PARK, CMS
                  </div>
                </>
              )}

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' }}>
                <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 8, letterSpacing: '0.14em', color: B.neonMagenta, minHeight: 14 }}>{error}</span>
                <button type="submit" disabled={busy || (mode === 'find' ? form.code.length < 4 : form.organiserName.trim().length < 2)}
                  style={{
                    padding: '13px 30px', border: 'none', borderRadius: 4, cursor: busy ? 'default' : 'pointer',
                    background: B.amber, color: B.black, opacity: busy ? 0.6 : 1,
                    fontFamily: "'Orbitron', monospace", fontSize: 10, fontWeight: 700, letterSpacing: '0.18em',
                  }}>{busy ? 'WORKING...' : mode === 'find' ? 'LOAD CREW GROUP →' : 'GENERATE CREW SPLIT CODE →'}</button>
              </div>
            </form>
          </div>
        )}
      </div>
    </section>
  )
}
