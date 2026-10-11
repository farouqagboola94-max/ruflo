import { useState, useEffect } from 'react'
import { B } from '../tokens'
import { GrainOverlay, ScanLines, SectionTag } from '../components/Shared'
import {
  useFestivalGamification,
  useFestivalTelemetry,
  dispatchFestivalAction,
  FESTIVAL_ACTIONS,
  playFestivalSound
} from '../framework/festivalFramework'
import { safeStorage } from '../lib/safeStorage.js'
import { copyToClipboard } from '../lib/clipboard.js'

const ZONES = [
  { id: 'zone-a', name: 'Zone A — Main Stage & VIP Deck' },
  { id: 'zone-b', name: 'Zone B — 1v1 FitCheck Arena' },
  { id: 'zone-c', name: 'Zone C — Grail Alley & LSX Market' },
  { id: 'zone-d', name: 'Zone D — Youth Lounge & Food Court' },
  { id: 'gate-1', name: 'Gate 1 — Victoria Island Main Turnstiles' },
  { id: 'gate-2', name: 'Gate 2 — VIP & Media Fast-Lane' },
]

const INITIAL_LOST_ITEMS = [
  { id: 'lf-1', type: 'LOST', item: 'Jordan 4 Military Black (Right shoe only in box)', zone: 'Zone C — Grail Alley', time: '14:20 WAT', contact: '@lagos_kicks_dan', reward: '₦25,000 Reward', status: 'ACTIVE' },
  { id: 'lf-2', type: 'FOUND', item: 'Car Key Fob with Nike Keychain', zone: 'Zone D — Youth Lounge', time: '13:45 WAT', contact: 'Security Desk B', reward: 'Claim at Booth S-1', status: 'HELD_AT_DESK' },
  { id: 'lf-3', type: 'LOST', item: 'Black Supreme Shoulder Bag with VIP Golden Pass', zone: 'Zone A — Main Stage', time: '15:10 WAT', contact: '@tobi_sneakers', reward: '₦50,000 Reward', status: 'ACTIVE' },
]

const STORAGE_KEY = 'sf26_lost_found_reports'

export default function SafetySOS() {
  const { awardXP, unlockBadge } = useFestivalGamification()
  const { setZone } = useFestivalTelemetry()
  
  const [reports, setReports] = useState(() => {
    return safeStorage.getJSON(STORAGE_KEY, INITIAL_LOST_ITEMS)
  })

  const [activeTab, setActiveTab] = useState('sos') // 'sos' | 'lostfound' | 'medical'
  const [selectedZone, setSelectedZone] = useState('zone-a')
  const [emergencyType, setEmergencyType] = useState('SECURITY')
  const [sosSent, setSosSent] = useState(false)
  const [dispatchDetails, setDispatchDetails] = useState(null)

  // Report Modal State
  const [showModal, setShowModal] = useState(false)
  const [reportType, setReportType] = useState('LOST')
  const [itemTitle, setItemTitle] = useState('')
  const [itemZone, setItemZone] = useState('Zone C — Grail Alley')
  const [itemContact, setItemContact] = useState('')
  const [itemReward, setItemReward] = useState('')
  const [copiedId, setCopiedId] = useState(null)

  useEffect(() => {
    safeStorage.setItem(STORAGE_KEY, reports)
  }, [reports])

  const handleSendSOS = () => {
    playFestivalSound('badge_unlock')
    const zObj = ZONES.find(z => z.id === selectedZone) || ZONES[0]
    const beaconId = `SOS-${Math.floor(1000 + Math.random() * 9000)}`
    
    setDispatchDetails({
      id: beaconId,
      zone: zObj.name,
      type: emergencyType,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    })
    setSosSent(true)

    awardXP(50, 'Emergency Protocol Dispatched')
    unlockBadge('WATCHFUL_GUARDIAN')
    setZone(selectedZone.replace('zone-', ''))
    
    dispatchFestivalAction(FESTIVAL_ACTIONS.ADD_NOTIFICATION, {
      title: `🚨 EMERGENCY BEACON [${beaconId}]`,
      message: `${emergencyType} team dispatched to ${zObj.name}. Security ETA: 2 mins.`
    })
  }

  const handleCreateReport = (e) => {
    e.preventDefault()
    if (!itemTitle.trim() || !itemContact.trim()) return

    const newReport = {
      id: `lf-${Date.now()}`,
      type: reportType,
      item: itemTitle.trim(),
      zone: itemZone,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ' WAT',
      contact: itemContact.trim(),
      reward: itemReward.trim() || (reportType === 'LOST' ? 'Gratitude & Good Karma' : 'Safe at Staff Desk'),
      status: 'ACTIVE',
    }

    setReports([newReport, ...reports])
    setShowModal(false)
    setItemTitle('')
    setItemContact('')
    setItemReward('')
    
    playFestivalSound('nfc_success')
    awardXP(35, `Logged ${reportType} Item Report`)
    unlockBadge('WATCHFUL_GUARDIAN')
  }

  const handleCopyContact = async (id, contact) => {
    const ok = await copyToClipboard(contact)
    if (ok) {
      setCopiedId(id)
      playFestivalSound('zone_click')
      setTimeout(() => setCopiedId(null), 2000)
    }
  }

  return (
    <section id="safety-sos" style={{ background: '#050508', padding: '80px 20px', position: 'relative', overflow: 'hidden' }}>
      <GrainOverlay />
      <ScanLines />

      <div style={{ maxWidth: 960, margin: '0 auto', position: 'relative', zIndex: 2 }}>
        <SectionTag>VENUE OPERATIONS & SAFETY</SectionTag>
        
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12, marginBottom: 8 }}>
          <h2 style={{ fontFamily: "'Bebas Neue'", fontSize: 'clamp(2.2rem,6vw,3.8rem)', color: B.white, letterSpacing: '0.05em', margin: 0 }}>
            SAFETY SOS & LOST GRAILS
          </h2>
          <div style={{ fontFamily: "'Space Mono'", fontSize: 9, color: '#ef4444', letterSpacing: '0.2em', fontWeight: 700 }}>
            ● LIVE DESK MONITORED 24/7
          </div>
        </div>
        
        <p style={{ color: B.smoke, fontFamily: "'Space Mono'", fontSize: '0.75rem', marginBottom: 28, letterSpacing: '0.04em' }}>
          Real-time security beacon · Lost & Found property ledger · First Aid & Paramedic emergency dispatch at Muri Okunola Park.
        </p>

        {/* Tab Selector */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 24, flexWrap: 'wrap' }}>
          {[
            { id: 'sos', label: '🚨 EMERGENCY SOS BEACON' },
            { id: 'lostfound', label: '📦 LOST & FOUND REGISTRY' },
            { id: 'medical', label: '🩺 FIRST AID & EMERGENCY CONTACTS' },
          ].map(t => (
            <button
              key={t.id}
              onClick={() => { setActiveTab(t.id); playFestivalSound('zone_click') }}
              style={{
                background: activeTab === t.id ? (t.id === 'sos' ? '#ef4444' : B.amber) : 'rgba(255,255,255,0.04)',
                color: activeTab === t.id ? B.black : B.smoke,
                border: `1px solid ${activeTab === t.id ? 'transparent' : 'rgba(255,255,255,0.1)'}`,
                fontFamily: "'Space Mono'",
                fontSize: 9,
                fontWeight: 700,
                letterSpacing: '0.12em',
                padding: '10px 16px',
                borderRadius: 6,
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* TAB 1: SOS BEACON */}
        {activeTab === 'sos' && (
          <div style={{
            background: 'linear-gradient(135deg, rgba(239,68,68,0.1) 0%, rgba(10,10,15,0.9) 100%)',
            border: '2px solid rgba(239,68,68,0.4)',
            borderRadius: 12,
            padding: '24px',
            marginBottom: 20
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
              <span style={{ fontSize: 24 }}>🚨</span>
              <div>
                <div style={{ fontFamily: "'Space Mono'", fontSize: 10, color: '#ef4444', letterSpacing: '0.15em', fontWeight: 700 }}>
                  ONE-TAP INCIDENT DISPATCHER
                </div>
                <div style={{ fontFamily: "'Syne'", fontSize: '0.85rem', color: B.white }}>
                  Transmit your exact festival zone to the on-site Rapid Response and Paramedic Security Desk.
                </div>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 16, marginBottom: 20 }}>
              <div>
                <label style={{ display: 'block', fontFamily: "'Space Mono'", fontSize: 8, color: B.dim, letterSpacing: '0.15em', marginBottom: 8 }}>
                  SELECT YOUR IMMEDIATE ZONE
                </label>
                <select
                  value={selectedZone}
                  onChange={e => setSelectedZone(e.target.value)}
                  style={{
                    width: '100%',
                    background: '#0d0d12',
                    border: '1px solid rgba(255,255,255,0.15)',
                    color: B.white,
                    padding: '12px 14px',
                    fontFamily: "'Space Mono'",
                    fontSize: 10,
                    borderRadius: 6,
                    outline: 'none'
                  }}
                >
                  {ZONES.map(z => (
                    <option key={z.id} value={z.id}>{z.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontFamily: "'Space Mono'", fontSize: 8, color: B.dim, letterSpacing: '0.15em', marginBottom: 8 }}>
                  TYPE OF EMERGENCY
                </label>
                <div style={{ display: 'flex', gap: 8 }}>
                  {['SECURITY', 'FIRST AID', 'CROWD DENSITY'].map(type => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setEmergencyType(type)}
                      style={{
                        flex: 1,
                        background: emergencyType === type ? '#ef444433' : '#0d0d12',
                        border: `1px solid ${emergencyType === type ? '#ef4444' : 'rgba(255,255,255,0.1)'}`,
                        color: emergencyType === type ? '#ef4444' : B.smoke,
                        fontFamily: "'Space Mono'",
                        fontSize: 9,
                        padding: '10px 4px',
                        borderRadius: 6,
                        cursor: 'pointer',
                        fontWeight: 700
                      }}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {sosSent && dispatchDetails ? (
              <div style={{
                background: 'rgba(34,197,94,0.15)',
                border: '1px solid #22c55e',
                borderRadius: 8,
                padding: '16px',
                textAlign: 'center',
                animation: 'pulse 1.5s infinite'
              }}>
                <div style={{ fontFamily: "'Space Mono'", fontSize: 11, color: '#4ade80', fontWeight: 700, letterSpacing: '0.15em', marginBottom: 6 }}>
                  ✅ BEACON TRANSMITTED: {dispatchDetails.id}
                </div>
                <div style={{ fontFamily: "'Space Mono'", fontSize: 10, color: B.white, marginBottom: 8 }}>
                  {dispatchDetails.type} Response Squad dispatched to <strong>{dispatchDetails.zone}</strong> at {dispatchDetails.time}.
                </div>
                <div style={{ fontFamily: "'Space Mono'", fontSize: 9, color: B.smoke }}>
                  Remain stationary in a well-lit area. Officers wearing fluorescent SF26 badges are approaching.
                </div>
              </div>
            ) : (
              <button
                onClick={handleSendSOS}
                style={{
                  width: '100%',
                  background: 'linear-gradient(90deg, #ef4444, #b91c1c)',
                  border: 'none',
                  color: B.white,
                  fontFamily: "'Space Mono'",
                  fontSize: 11,
                  fontWeight: 900,
                  letterSpacing: '0.2em',
                  padding: '16px',
                  borderRadius: 8,
                  cursor: 'pointer',
                  boxShadow: '0 8px 24px rgba(239,68,68,0.4)',
                  transition: 'all 0.2s ease'
                }}
              >
                📡 TRANSMIT IMMEDIATE SOS BEACON →
              </button>
            )}
          </div>
        )}

        {/* TAB 2: LOST & FOUND */}
        {activeTab === 'lostfound' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, flexWrap: 'wrap', gap: 10 }}>
              <div style={{ fontFamily: "'Space Mono'", fontSize: 9, color: B.dim, letterSpacing: '0.15em' }}>
                SHOWING {reports.length} ACTIVE INCIDENT TICKETS
              </div>
              <button
                onClick={() => setShowModal(true)}
                style={{
                  background: B.amber,
                  color: B.black,
                  border: 'none',
                  fontFamily: "'Space Mono'",
                  fontSize: 9,
                  fontWeight: 700,
                  letterSpacing: '0.12em',
                  padding: '8px 16px',
                  borderRadius: 6,
                  cursor: 'pointer'
                }}
              >
                + LOG NEW LOST/FOUND ITEM
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 12 }}>
              {reports.map((r) => (
                <div
                  key={r.id}
                  style={{
                    background: '#0a0a0f',
                    border: `1px solid ${r.type === 'LOST' ? 'rgba(239,68,68,0.3)' : 'rgba(34,197,94,0.3)'}`,
                    borderRadius: 8,
                    padding: '16px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between'
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                      <span style={{
                        background: r.type === 'LOST' ? 'rgba(239,68,68,0.2)' : 'rgba(34,197,94,0.2)',
                        color: r.type === 'LOST' ? '#f87171' : '#4ade80',
                        fontFamily: "'Space Mono'",
                        fontSize: 8,
                        fontWeight: 700,
                        padding: '3px 8px',
                        borderRadius: 4
                      }}>
                        {r.type === 'LOST' ? '⚠️ MISSING PROPERTY' : '✅ SECURED AT DESK'}
                      </span>
                      <span style={{ fontFamily: "'Space Mono'", fontSize: 8, color: B.dim }}>
                        {r.time}
                      </span>
                    </div>

                    <div style={{ fontFamily: "'Syne'", fontWeight: 700, fontSize: '0.95rem', color: B.white, marginBottom: 6 }}>
                      {r.item}
                    </div>

                    <div style={{ fontFamily: "'Space Mono'", fontSize: 9, color: B.dim, marginBottom: 8 }}>
                      📍 Location: {r.zone}
                    </div>

                    <div style={{ fontFamily: "'Space Mono'", fontSize: 9, color: B.amber, fontWeight: 700, marginBottom: 12 }}>
                      🎁 {r.reward}
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: 8, alignItems: 'center', borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: 10 }}>
                    <button
                      onClick={() => handleCopyContact(r.id, r.contact)}
                      style={{
                        flex: 1,
                        background: copiedId === r.id ? 'rgba(34,197,94,0.2)' : 'rgba(255,255,255,0.05)',
                        border: `1px solid ${copiedId === r.id ? '#22c55e' : 'rgba(255,255,255,0.1)'}`,
                        color: copiedId === r.id ? '#4ade80' : B.smoke,
                        fontFamily: "'Space Mono'",
                        fontSize: 8,
                        fontWeight: 700,
                        padding: '8px',
                        borderRadius: 4,
                        cursor: 'pointer'
                      }}
                    >
                      {copiedId === r.id ? '✓ CONTACT COPIED' : `📞 CONTACT: ${r.contact}`}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: FIRST AID & EMERGENCY CONTACTS */}
        {activeTab === 'medical' && (
          <div style={{ background: '#0a0a0f', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, padding: '24px' }}>
            <h3 style={{ fontFamily: "'Bebas Neue'", fontSize: '1.6rem', color: B.white, marginBottom: 16 }}>
              ON-SITE MEDICAL & COMMAND POST DIRECTORY
            </h3>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 14 }}>
              {[
                { title: 'CENTRAL RED CROSS MEDICAL TENT', loc: 'Adjacent to Zone B (Arena Entrance)', status: 'Full Triage, Defibrillators & Hydration', badge: 'MEDICAL' },
                { title: 'LAGOS STATE AMBULANCE SERVICE (LASAMBUS)', loc: 'Dedicated Exit Lane, Gate 1', status: '2 Mobile ICU Units On Standby', badge: 'PARAMEDIC' },
                { title: 'SF26 FESTIVAL SECURITY COMMAND', loc: 'Control Booth 01, Muri Okunola Pavilion', status: 'Radios: Channel 4 (Security Main)', badge: 'COMMAND' },
              ].map((m, idx) => (
                <div key={idx} style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 8, padding: '16px' }}>
                  <div style={{ display: 'inline-block', fontFamily: "'Space Mono'", fontSize: 8, fontWeight: 700, color: B.neonCyan, background: 'rgba(0,245,255,0.1)', padding: '2px 8px', borderRadius: 4, marginBottom: 8 }}>
                    {m.badge}
                  </div>
                  <div style={{ fontFamily: "'Syne'", fontSize: '0.9rem', color: B.white, fontWeight: 700, marginBottom: 6 }}>
                    {m.title}
                  </div>
                  <div style={{ fontFamily: "'Space Mono'", fontSize: 9, color: B.smoke, marginBottom: 4 }}>
                    📍 {m.loc}
                  </div>
                  <div style={{ fontFamily: "'Space Mono'", fontSize: 8, color: B.dim }}>
                    ● {m.status}
                  </div>
                </div>
              ))}
            </div>

            <div style={{ marginTop: 24, paddingTop: 16, borderTop: '1px solid rgba(255,255,255,0.08)', display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              <a
                href="https://wa.me/2348000000000?text=SNEAKERS%20FEST%2026%20SECURITY%20ASSISTANCE"
                target="_blank"
                rel="noreferrer"
                style={{
                  textDecoration: 'none',
                  background: '#25D366',
                  color: B.black,
                  fontFamily: "'Space Mono'",
                  fontSize: 9,
                  fontWeight: 700,
                  letterSpacing: '0.1em',
                  padding: '12px 18px',
                  borderRadius: 6,
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 6
                }}
              >
                💬 WHATSAPP SAFETY DESK DIRECT
              </a>
              <button
                onClick={() => {
                  copyToClipboard('+234-112-SF26-HOTLINE')
                  playFestivalSound('zone_click')
                }}
                style={{
                  background: 'transparent',
                  border: '1px solid rgba(255,255,255,0.2)',
                  color: B.white,
                  fontFamily: "'Space Mono'",
                  fontSize: 9,
                  fontWeight: 700,
                  padding: '12px 18px',
                  borderRadius: 6,
                  cursor: 'pointer'
                }}
              >
                📋 COPY HOTLINE PHONE NUMBER
              </button>
            </div>
          </div>
        )}

        {/* MODAL: LOG NEW REPORT */}
        {showModal && (
          <div style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.85)',
            backdropFilter: 'blur(8px)',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 20
          }}>
            <div style={{
              background: '#0d0d12',
              border: `2px solid ${B.amber}`,
              borderRadius: 12,
              padding: '24px',
              maxWidth: 480,
              width: '100%',
              boxShadow: '0 20px 60px rgba(0,0,0,0.9)'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <h3 style={{ fontFamily: "'Bebas Neue'", fontSize: '1.8rem', color: B.white, margin: 0 }}>
                  LOG PROPERTY REPORT
                </h3>
                <button
                  onClick={() => setShowModal(false)}
                  style={{ background: 'none', border: 'none', color: B.dim, fontSize: 16, cursor: 'pointer' }}
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleCreateReport}>
                <div style={{ marginBottom: 14 }}>
                  <label style={{ display: 'block', fontFamily: "'Space Mono'", fontSize: 8, color: B.dim, letterSpacing: '0.15em', marginBottom: 6 }}>
                    INCIDENT CLASSIFICATION
                  </label>
                  <div style={{ display: 'flex', gap: 8 }}>
                    {['LOST', 'FOUND'].map(t => (
                      <button
                        key={t}
                        type="button"
                        onClick={() => setReportType(t)}
                        style={{
                          flex: 1,
                          background: reportType === t ? (t === 'LOST' ? '#ef444433' : '#22c55e33') : '#16161f',
                          border: `1px solid ${reportType === t ? (t === 'LOST' ? '#ef4444' : '#22c55e') : 'rgba(255,255,255,0.1)'}`,
                          color: reportType === t ? (t === 'LOST' ? '#ef4444' : '#22c55e') : B.smoke,
                          fontFamily: "'Space Mono'",
                          fontSize: 9,
                          fontWeight: 700,
                          padding: '8px',
                          borderRadius: 4,
                          cursor: 'pointer'
                        }}
                      >
                        {t === 'LOST' ? 'I LOST AN ITEM' : 'I FOUND AN ITEM'}
                      </button>
                    ))}
                  </div>
                </div>

                <div style={{ marginBottom: 12 }}>
                  <label style={{ display: 'block', fontFamily: "'Space Mono'", fontSize: 8, color: B.dim, letterSpacing: '0.15em', marginBottom: 6 }}>
                    ITEM NAME & DETAILED DESCRIPTION
                  </label>
                  <input
                    value={itemTitle}
                    onChange={e => setItemTitle(e.target.value)}
                    placeholder="e.g. Travis Scott Jordan 1 Low (Size UK 9) in black tote"
                    required
                    style={{ width: '100%', boxSizing: 'border-box', background: '#16161f', border: '1px solid rgba(255,255,255,0.15)', color: B.white, padding: '10px 12px', fontFamily: "'Space Mono'", fontSize: 10, borderRadius: 4, outline: 'none' }}
                  />
                </div>

                <div style={{ marginBottom: 12 }}>
                  <label style={{ display: 'block', fontFamily: "'Space Mono'", fontSize: 8, color: B.dim, letterSpacing: '0.15em', marginBottom: 6 }}>
                    APPROXIMATE ZONE
                  </label>
                  <select
                    value={itemZone}
                    onChange={e => setItemZone(e.target.value)}
                    style={{ width: '100%', boxSizing: 'border-box', background: '#16161f', border: '1px solid rgba(255,255,255,0.15)', color: B.white, padding: '10px 12px', fontFamily: "'Space Mono'", fontSize: 10, borderRadius: 4, outline: 'none' }}
                  >
                    {ZONES.map(z => (
                      <option key={z.id} value={z.name}>{z.name}</option>
                    ))}
                  </select>
                </div>

                <div style={{ marginBottom: 12 }}>
                  <label style={{ display: 'block', fontFamily: "'Space Mono'", fontSize: 8, color: B.dim, letterSpacing: '0.15em', marginBottom: 6 }}>
                    YOUR SOCIAL HANDLE / PHONE NUMBER
                  </label>
                  <input
                    value={itemContact}
                    onChange={e => setItemContact(e.target.value)}
                    placeholder="@yourhandle or 08012345678"
                    required
                    style={{ width: '100%', boxSizing: 'border-box', background: '#16161f', border: '1px solid rgba(255,255,255,0.15)', color: B.white, padding: '10px 12px', fontFamily: "'Space Mono'", fontSize: 10, borderRadius: 4, outline: 'none' }}
                  />
                </div>

                <div style={{ marginBottom: 18 }}>
                  <label style={{ display: 'block', fontFamily: "'Space Mono'", fontSize: 8, color: B.dim, letterSpacing: '0.15em', marginBottom: 6 }}>
                    REWARD OFFERED (OPTIONAL)
                  </label>
                  <input
                    value={itemReward}
                    onChange={e => setItemReward(e.target.value)}
                    placeholder="e.g. ₦30,000 Cash Reward or Free Grail Swap"
                    style={{ width: '100%', boxSizing: 'border-box', background: '#16161f', border: '1px solid rgba(255,255,255,0.15)', color: B.white, padding: '10px 12px', fontFamily: "'Space Mono'", fontSize: 10, borderRadius: 4, outline: 'none' }}
                  />
                </div>

                <div style={{ display: 'flex', gap: 10 }}>
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    style={{ flex: 1, background: 'transparent', border: '1px solid rgba(255,255,255,0.2)', color: B.dim, fontFamily: "'Space Mono'", fontSize: 9, padding: '12px', borderRadius: 6, cursor: 'pointer' }}
                  >
                    CANCEL
                  </button>
                  <button
                    type="submit"
                    style={{ flex: 2, background: B.amber, border: 'none', color: B.black, fontFamily: "'Space Mono'", fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', padding: '12px', borderRadius: 6, cursor: 'pointer' }}
                  >
                    CONFIRM & POST REPORT →
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
