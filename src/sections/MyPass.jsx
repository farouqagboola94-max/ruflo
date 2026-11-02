import { useState, useEffect, useCallback, useMemo } from 'react'
import { B } from '../tokens'
import { GrainOverlay, SectionTag } from '../components/Shared'
import { qrSVG } from '../lib/qr'
import { downloadTicketPNG } from '../components/PaymentModal'
import { SOCIAL_LINKS, buildWhatsAppLink } from '../config'
import { dispatchFestivalAction, FESTIVAL_ACTIONS, playFestivalSound } from '../framework/festivalFramework'

const API = '/.netlify/functions/ticket-lookup'
const STORE_KEY = 'sf26_pass'
const ORDERS_KEY = 'sf26_orders'

// Supports both server-issued IDs (SF26-GEN-A1B2C3) and Dual-Rail / Crew / Vault IDs (SF26-XXXXXX, SF26-CRW..., GOLD-VAULT-...)
const TICKET_RE = /^(SF26-[A-Z0-9-]{4,24}|GOLD-VAULT-[A-Z0-9-]{3,16})$/

const ORGANIZER_TIERS = [
  { id: 'GEN', label: 'General Admission', price: '₦5,000', color: B.amber },
  { id: 'VIP', label: 'VIP Access', price: '₦10,000', color: B.neonCyan },
  { id: 'VVP', label: 'VVIP Access', price: '₦25,000', color: B.neonMagenta },
  { id: 'CRW', label: 'Phalanx VIP Table (4-Pack)', price: '₦50,000', color: B.neonLime },
  { id: 'VND', label: 'Grail Cell Booth (50% Deposit)', price: '₦125,000', color: B.amber },
  { id: 'PRG', label: 'Pergola Bay Booth (50% Deposit)', price: '₦75,000', color: B.neonCyan },
]

const readLS = () => { try { return JSON.parse(localStorage.getItem(STORE_KEY)) || null } catch { return null } }
const writeLS = v => { try { localStorage.setItem(STORE_KEY, JSON.stringify(v)) } catch {} }
const readOrdersLS = () => { try { return JSON.parse(localStorage.getItem(ORDERS_KEY) || '[]') } catch { return [] } }
const saveOrderLS = (order) => {
  try {
    const existing = readOrdersLS().filter(o => o.ref !== order.ref)
    existing.unshift(order)
    localStorage.setItem(ORDERS_KEY, JSON.stringify(existing.slice(0, 50)))
  } catch {}
}

const label = { fontFamily: "'Space Mono', monospace", fontSize: 9, letterSpacing: '0.22em', color: B.smoke }

const normalise = raw => String(raw || '').toUpperCase().replace(/\s/g, '')

function generateOfficialTicketId(tierCode = 'VIP') {
  const hex = 'ABCDEF0123456789'
  let suffix = ''
  for (let i = 0; i < 6; i++) suffix += hex[Math.floor(Math.random() * hex.length)]
  return `SF26-${tierCode.slice(0, 3).toUpperCase()}-${suffix}`
}

function Pass({ pass, onForget }) {
  const [downloading, setDownloading] = useState(false)
  const used = pass.checkedIn
  const accent = used ? B.smoke : (pass.tierColor || B.amber)

  // The QR carries a link into the staff door app with the ticket already in
  // it, not the bare ID. That means a staff member can use the camera app
  // their phone already has - point, tap the notification, the door app opens
  // filled in. Encoding just the ID would leave them reading it off a screen
  // and typing it, which is the queue this is meant to remove.
  //
  // Built here rather than fetched: the encoder is in the bundle, so this
  // renders with no network, which is the state of every phone at a gate with
  // a few thousand people on one tower.
  const qr = useMemo(() => {
    if (!pass.ticketId) return null
    const origin = typeof window === 'undefined' ? '' : window.location.origin
    try { return qrSVG(`${origin}/door.html#t=${pass.ticketId}`, { ec: 'M', margin: 2 }) }
    catch { return null }
  }, [pass.ticketId])

  async function handleDownloadPNG() {
    setDownloading(true)
    await downloadTicketPNG({
      name: pass.name || 'Festival Guest',
      email: pass.email || 'verified@sneakersfest.com',
      tier: pass.tierLabel || pass.tier || 'General Admission',
      tierColor: pass.tierColor || B.amber,
      ref: pass.ticketId,
      price: pass.price || 'CONFIRMED',
    })
    setDownloading(false)
  }

  const buyerWhatsAppMsg = `OFFICIAL SNEAKERS FEST ’26 PASS CONFIRMED ✅\n\n• Attendee: ${pass.name}\n• Tier: ${(pass.tierLabel || pass.tier || 'PASS').toUpperCase()}\n• Pass Reference: ${pass.ticketId}\n• Date: Sat, Dec 12, 2026 (12:00 PM)\n• Venue: Freedom Park (Old Prison Ground), 1 Hospital Rd / Broad St, CMS, Lagos\n\nRetrieve your live QR pass anytime at: ${typeof window !== 'undefined' ? window.location.origin : 'https://sneakers-fest-official-55.netlify.app'}/#my-pass using code ${pass.ticketId}`

  return (
    <div className="card-3d" style={{
      background: B.charcoal, border: `1px solid ${accent}45`, borderRadius: 10, overflow: 'hidden',
    }}>
      <div style={{ height: 4, background: used ? B.gunmetal : `linear-gradient(90deg, ${accent}, ${B.neonMagenta})` }} />

      <div style={{ padding: '26px 24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: 14, flexWrap: 'wrap' }}>
          <div>
            <div style={{ ...label, color: used ? B.smoke : B.neonCyan }}>
              {used ? 'ALREADY SCANNED' : 'YOUR OFFICIAL PASS · VERIFIED'}
            </div>
            <div style={{ fontFamily: "'Orbitron', monospace", fontWeight: 900, fontSize: 22, color: B.white, marginTop: 6 }}>
              {pass.name}
            </div>
            <div style={{ ...label, marginTop: 6, color: accent }}>
              {(pass.tierLabel || pass.tier || '').toUpperCase()}
              {pass.qty > 1 ? ` - ${pass.qty} TICKETS` : ''}
              {pass.price ? ` · ${pass.price}` : ''}
            </div>
          </div>
          <div style={{ ...label, textAlign: 'right', lineHeight: 1.9 }}>
            DEC 12, 2026<br />
            12:00 - 22:00<br />
            FREEDOM PARK, CMS
          </div>
        </div>

        {/* Dark modules on white, always. A QR rendered light-on-dark is
            inverted, and while some scanners cope, plenty do not - and this
            one has to work first time with a queue behind it. */}
        {qr && (
          <div style={{ display: 'flex', justifyContent: 'center', marginTop: 24 }}>
            <div style={{
              background: '#fff', padding: 10, borderRadius: 8, lineHeight: 0,
              width: 'min(216px, 58vw)', opacity: used ? 0.45 : 1,
            }}>
              <div
                role="img"
                aria-label={`QR code for ticket ${pass.ticketId}. Staff can scan it, or read the code printed below it.`}
                style={{ width: '100%' }}
                dangerouslySetInnerHTML={{ __html: qr }}
              />
            </div>
          </div>
        )}

        {/* The code the gate types. Kept as large and legible as it will go,
            because the QR is a shortcut and not a single point of failure -
            a cracked screen or a dead camera still has to get someone in. */}
        <div style={{
          margin: '24px 0 6px', padding: '20px 12px', borderRadius: 8, textAlign: 'center',
          background: B.black, border: `1px dashed ${accent}55`,
        }}>
          <div style={{
            fontFamily: "'Orbitron', monospace", fontWeight: 900,
            fontSize: 'clamp(19px, 6vw, 30px)', letterSpacing: '0.14em',
            color: accent, textShadow: used ? 'none' : `0 0 22px ${accent}40`,
            wordBreak: 'break-all',
          }}>{pass.ticketId}</div>
          <div style={{ ...label, marginTop: 10, fontSize: 9 }}>
            {qr ? 'SHOW THE CODE ABOVE - OR READ THIS OUT AT HOSPITAL RD GATE' : 'SHOW THIS AT THE GATE'}
          </div>
        </div>

        {used && (
          <div style={{ ...label, color: B.amber, marginTop: 14, lineHeight: 1.7 }}>
            SCANNED {pass.checkedInAt ? new Date(pass.checkedInAt).toLocaleString() : ''}
            <br />IF THAT WAS NOT YOU, FIND A STAFF MEMBER.
          </div>
        )}

        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginTop: 20 }}>
          <button onClick={handleDownloadPNG} disabled={downloading} style={{
            padding: '11px 20px', borderRadius: 4, cursor: downloading ? 'wait' : 'pointer',
            background: accent, border: 'none', color: B.black,
            fontFamily: "'Orbitron', monospace", fontWeight: 700, fontSize: 10, letterSpacing: '0.16em',
          }}>
            {downloading ? 'SAVING PNG...' : '⬇ DOWNLOAD HIGH-RES PNG PASS'}
          </button>

          <a
            href={buildWhatsAppLink('https://wa.me/', buyerWhatsAppMsg)}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              padding: '11px 18px', borderRadius: 4, textDecoration: 'none',
              background: `${B.neonLime}18`, border: `1px solid ${B.neonLime}60`, color: B.neonLime,
              fontFamily: "'Orbitron', monospace", fontWeight: 700, fontSize: 9.5, letterSpacing: '0.14em',
              display: 'inline-flex', alignItems: 'center',
            }}
          >
            📲 SHARE / FORWARD ON WHATSAPP →
          </a>

          <button onClick={onForget} style={{
            padding: '10px 18px', borderRadius: 4, cursor: 'pointer', background: 'transparent',
            border: `1px solid ${B.gunmetal}`, color: B.smoke,
            fontFamily: "'Space Mono', monospace", fontSize: 9, letterSpacing: '0.16em',
          }}>LOOK UP ANOTHER</button>
        </div>
      </div>
    </div>
  )
}

export default function MyPass() {
  const [pass, setPass] = useState(readLS)
  const [code, setCode] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  // Organizer Quick-Issue Terminal state
  const [showOrg, setShowOrg] = useState(false)
  const [pin, setPin] = useState('')
  const [orgUnlocked, setOrgUnlocked] = useState(false)
  const [orgForm, setOrgForm] = useState({
    name: '',
    contact: '',
    tierIdx: 0,
    qty: 1,
    customRef: '',
  })
  const [orgMsg, setOrgMsg] = useState('')

  const lookup = useCallback(async (raw, { quiet = false } = {}) => {
    const id = normalise(raw)
    if (!TICKET_RE.test(id)) {
      if (!quiet) setError('Enter a valid SF26 ticket ID (e.g. SF26-VIP-A1B2C3 or SF26-XXXXXX)')
      return
    }
    setBusy(true); if (!quiet) setError('')

    // 1. Check local orders first (PaymentModal, GroupTickets, Organizer Quick-Issue)
    const localMatch = readOrdersLS().find(o => normalise(o.ref) === id)
    if (localMatch) {
      const localPass = {
        ticketId: id,
        name: localMatch.name || 'Festival Guest',
        email: localMatch.email || '',
        tier: localMatch.tier || 'General Admission',
        tierLabel: localMatch.tier || 'General Admission',
        tierColor: localMatch.tierColor || B.amber,
        price: localMatch.price || '',
        qty: localMatch.quantity || 1,
        checkedIn: false,
      }
      setPass(localPass); writeLS(localPass)
    }

    // 2. Query backend to sync live check-in state if online
    try {
      const r = await fetch(`${API}?id=${encodeURIComponent(id)}`)
      if (r.ok) {
        const data = await r.json()
        setPass(data); writeLS(data)
        setBusy(false)
        return
      }
      if (!localMatch) {
        if (r.status === 404) { if (!quiet) setError('No ticket found with that ID yet. Use the Organizer Terminal below if issuing a new pass.'); return }
        if (!quiet) setError('Could not reach the box office')
      }
    } catch {
      if (!localMatch && !quiet) {
        setError('Offline mode: Ticket ID not found in local device wallet.')
      }
    } finally { setBusy(false) }
  }, [])

  // Refresh a stored pass so the scanned state is current, quietly.
  useEffect(() => {
    const stored = readLS()
    if (stored?.ticketId) lookup(stored.ticketId, { quiet: true })
  }, [lookup])

  async function handleOrganizerIssue(e, autoDownload = true) {
    e.preventDefault()
    if (!orgForm.name.trim()) return
    const selectedTier = ORGANIZER_TIERS[orgForm.tierIdx] || ORGANIZER_TIERS[0]
    const ref = orgForm.customRef.trim()
      ? normalise(orgForm.customRef.trim())
      : generateOfficialTicketId(selectedTier.id)

    const orderRecord = {
      name: orgForm.name.trim(),
      email: orgForm.contact.trim() || 'vip@sneakersfest.com',
      tier: selectedTier.label,
      tierColor: selectedTier.color,
      ref,
      price: selectedTier.price,
      quantity: Number(orgForm.qty) || 1,
      gateway: 'Organizer VIP Desk Verified',
      purchasedAt: Date.now(),
    }
    saveOrderLS(orderRecord)

    const issuedPass = {
      ticketId: ref,
      name: orderRecord.name,
      email: orderRecord.email,
      tier: selectedTier.label,
      tierLabel: selectedTier.label,
      tierColor: selectedTier.color,
      price: selectedTier.price,
      qty: orderRecord.quantity,
      checkedIn: false,
    }
    setPass(issuedPass)
    writeLS(issuedPass)
    dispatchFestivalAction(FESTIVAL_ACTIONS.WALLET_TICKET_PURCHASED, { pass: orderRecord })
    playFestivalSound('badge_unlock')
    setOrgMsg(`✓ Official Pass ${ref} issued for ${orderRecord.name} (${selectedTier.label})!`)

    if (autoDownload) {
      await downloadTicketPNG({
        name: orderRecord.name,
        email: orderRecord.email,
        tier: selectedTier.label,
        tierColor: selectedTier.color,
        ref,
        price: selectedTier.price,
      })
    }
  }

  return (
    <section id="my-pass" style={{ position: 'relative', overflow: 'hidden', background: B.black, padding: '80px 24px' }}>
      <GrainOverlay />
      <div style={{ position: 'relative', zIndex: 10, maxWidth: 1100, margin: '0 auto' }}>
        <SectionTag>YOUR TICKET & GATE WALLET</SectionTag>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: 16, marginBottom: 40 }}>
          <div style={{ maxWidth: 540 }}>
            <h2 className="reveal-3d" style={{ fontFamily: "'Orbitron', monospace", fontWeight: 900, fontSize: 'clamp(22px, 4vw, 38px)', color: B.white, lineHeight: 1.1 }}>
              MY<span style={{ color: B.amber }}> PASS</span>
            </h2>
            <p style={{ fontFamily: "'Syne', sans-serif", fontSize: 14, color: B.smoke, marginTop: 10, lineHeight: 1.7 }}>
              Enter any <strong style={{ color: B.white }}>SF26-XXXX</strong> ticket or crew reference to pull up your scannable QR pass and high-res PNG ticket. Stored passes work 100% offline at the Freedom Park Hospital Road Gate.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setShowOrg(!showOrg)}
            style={{
              padding: '9px 14px', borderRadius: 6, cursor: 'pointer',
              background: showOrg ? `${B.neonLime}18` : 'rgba(255,255,255,0.04)',
              border: `1px solid ${showOrg ? B.neonLime : 'rgba(255,255,255,0.12)'}`,
              color: showOrg ? B.neonLime : B.smoke,
              fontFamily: "'Space Mono', monospace", fontSize: 8.5, letterSpacing: '0.16em',
            }}
          >
            🔑 {showOrg ? 'HIDE ORGANIZER TERMINAL' : 'ORGANIZER QUICK-ISSUE TERMINAL'}
          </button>
        </div>

        {/* Collapsible 1-Click Organizer Quick-Issue Terminal */}
        {showOrg && (
          <div className="card-3d" style={{
            marginBottom: 32, padding: '22px 24px', background: '#0A0A10',
            border: `1px solid ${B.neonLime}50`, borderRadius: 10,
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 10, marginBottom: 14 }}>
              <div>
                <div style={{ fontFamily: "'Orbitron', monospace", fontSize: 10, fontWeight: 800, color: B.neonLime, letterSpacing: 2 }}>
                  🔑 1-CLICK ORGANIZER VIP PASS & BANK TRANSFER RECEIPT ISSUER
                </div>
                <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 12, color: B.smoke, marginTop: 3 }}>
                  Verify a buyer’s bank transfer on WhatsApp and immediately generate their official stamped PNG pass + QR code in 10 seconds.
                </div>
              </div>
              {orgUnlocked && (
                <span style={{ padding: '3px 9px', background: `${B.neonLime}20`, border: `1px solid ${B.neonLime}60`, borderRadius: 4, fontFamily: "'Space Mono', monospace", fontSize: 8, color: B.neonLime }}>
                  TERMINAL UNLOCKED
                </span>
              )}
            </div>

            {!orgUnlocked ? (
              <form
                onSubmit={e => {
                  e.preventDefault()
                  if (['SF26', '2026', 'CATALYST'].includes(pin.trim().toUpperCase())) {
                    setOrgUnlocked(true)
                  }
                }}
                style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center' }}
              >
                <input
                  aria-label="Organizer PIN"
                  value={pin}
                  onChange={e => setPin(e.target.value)}
                  placeholder="Enter Desk PIN (SF26 or 2026)"
                  style={{
                    padding: '10px 14px', background: B.black, border: `1px solid ${B.gunmetal}`,
                    borderRadius: 6, color: B.white, fontFamily: "'Space Mono', monospace", fontSize: 11, outline: 'none',
                  }}
                />
                <button type="submit" style={{
                  padding: '10px 20px', background: B.neonLime, color: B.black, border: 'none',
                  borderRadius: 6, fontFamily: "'Orbitron', monospace", fontSize: 9.5, fontWeight: 700, letterSpacing: 1.5, cursor: 'pointer',
                }}>
                  UNLOCK DESK →
                </button>
              </form>
            ) : (
              <form onSubmit={e => handleOrganizerIssue(e, true)}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(190px, 1fr))', gap: 12, marginBottom: 14 }}>
                  <div>
                    <label style={{ ...label, display: 'block', marginBottom: 6 }}>BUYER / BRAND NAME *</label>
                    <input
                      value={orgForm.name}
                      onChange={e => setOrgForm(f => ({ ...f, name: e.target.value }))}
                      placeholder="e.g. Chinedu Okafor"
                      style={{ width: '100%', boxSizing: 'border-box', padding: '10px 12px', background: B.black, border: `1px solid ${B.gunmetal}`, borderRadius: 6, color: B.white, fontFamily: "'Space Mono', monospace", fontSize: 11 }}
                    />
                  </div>
                  <div>
                    <label style={{ ...label, display: 'block', marginBottom: 6 }}>EMAIL OR WHATSAPP</label>
                    <input
                      value={orgForm.contact}
                      onChange={e => setOrgForm(f => ({ ...f, contact: e.target.value }))}
                      placeholder="+234 80... or email"
                      style={{ width: '100%', boxSizing: 'border-box', padding: '10px 12px', background: B.black, border: `1px solid ${B.gunmetal}`, borderRadius: 6, color: B.white, fontFamily: "'Space Mono', monospace", fontSize: 11 }}
                    />
                  </div>
                  <div>
                    <label style={{ ...label, display: 'block', marginBottom: 6 }}>PASS / BOOTH TIER</label>
                    <select
                      value={orgForm.tierIdx}
                      onChange={e => setOrgForm(f => ({ ...f, tierIdx: Number(e.target.value) }))}
                      style={{ width: '100%', boxSizing: 'border-box', padding: '10px 12px', background: B.black, border: `1px solid ${B.gunmetal}`, borderRadius: 6, color: B.white, fontFamily: "'Space Mono', monospace", fontSize: 11 }}
                    >
                      {ORGANIZER_TIERS.map((t, i) => (
                        <option key={t.id} value={i}>{t.label} ({t.price})</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label style={{ ...label, display: 'block', marginBottom: 6 }}>CUSTOM REF (OPTIONAL)</label>
                    <input
                      value={orgForm.customRef}
                      onChange={e => setOrgForm(f => ({ ...f, customRef: e.target.value.toUpperCase() }))}
                      placeholder="Auto: SF26-VIP-XXXXXX"
                      style={{ width: '100%', boxSizing: 'border-box', padding: '10px 12px', background: B.black, border: `1px solid ${B.gunmetal}`, borderRadius: 6, color: B.amber, fontFamily: "'Space Mono', monospace", fontSize: 11 }}
                    />
                  </div>
                </div>

                {orgMsg && (
                  <div style={{ marginBottom: 12, fontFamily: "'Space Mono', monospace", fontSize: 9.5, color: B.neonLime }}>
                    {orgMsg}
                  </div>
                )}

                <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                  <button
                    type="submit"
                    disabled={!orgForm.name.trim()}
                    style={{
                      padding: '12px 22px', background: orgForm.name.trim() ? B.neonLime : B.gunmetal,
                      color: orgForm.name.trim() ? B.black : B.smoke, border: 'none', borderRadius: 6,
                      fontFamily: "'Orbitron', monospace", fontSize: 10, fontWeight: 800, letterSpacing: 1.5, cursor: orgForm.name.trim() ? 'pointer' : 'default',
                    }}
                  >
                    ⚡ ISSUE STAMPED PNG PASS & ACTIVATE QR →
                  </button>
                  <button
                    type="button"
                    disabled={!orgForm.name.trim()}
                    onClick={e => handleOrganizerIssue(e, false)}
                    style={{
                      padding: '12px 18px', background: 'rgba(255,255,255,0.06)',
                      color: B.white, border: `1px solid ${B.gunmetal}`, borderRadius: 6,
                      fontFamily: "'Space Mono', monospace", fontSize: 9, letterSpacing: 1.2, cursor: orgForm.name.trim() ? 'pointer' : 'default',
                    }}
                  >
                    GENERATE QR ON SCREEN ONLY
                  </button>
                </div>
              </form>
            )}
          </div>
        )}

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
            <input aria-label="Ticket ID"
              id="pass-ticket-id"
              value={code}
              onChange={e => setCode(e.target.value.toUpperCase())}
              placeholder="SF26-GEN-A1B2C3 or SF26-XXXXXX"
              autoCapitalize="characters"
              autoCorrect="off"
              spellCheck="false"
              style={{
                width: '100%', boxSizing: 'border-box', padding: '14px',
                background: B.black, border: `1px solid ${B.gunmetal}`, borderRadius: 6, color: B.white, outline: 'none',
                fontFamily: "'Orbitron', monospace", fontSize: 17, letterSpacing: '0.1em', textAlign: 'center',
              }} />
            <div style={{ ...label, fontSize: 7.5, marginTop: 8, lineHeight: 1.7 }}>
              ENTER ANY SF26 REFERENCE FROM YOUR CHECKOUT, CREW BUNDLE, OR WHATSAPP VIP DESK
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap', marginTop: 18 }}>
              <span role="alert" style={{ fontFamily: "'Space Mono', monospace", fontSize: 8, letterSpacing: '0.14em', color: B.neonMagenta, minHeight: 14 }}>
                {error}
              </span>
              <button type="submit" disabled={busy || code.trim().length < 7} style={{
                padding: '12px 30px', border: 'none', borderRadius: 3,
                background: code.trim().length >= 7 ? B.amber : B.gunmetal,
                color: code.trim().length >= 7 ? B.black : B.smoke,
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
