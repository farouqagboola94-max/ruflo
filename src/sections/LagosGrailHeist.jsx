import { useState, useEffect, useMemo, useCallback } from 'react'
import { B } from '../tokens'
import { GrainOverlay, SectionTag, Divider } from '../components/Shared'
import {
  useFestivalGamification,
  useFestivalTelemetry,
  playFestivalSound,
  dispatchFestivalAction,
  FESTIVAL_ACTIONS
} from '../framework/festivalFramework'

// Coordinates centered around Muri Okunola Park, Victoria Island, Lagos
const PARK_CENTER = { lat: 6.4312, lng: 3.4241 }

const CHECKPOINTS = [
  {
    id: 'CP-STAGE',
    name: 'Checkpoint Alpha · Main Stage',
    locationName: 'Zone A · DJ Turntable Pit',
    coords: { lat: 6.4314, lng: 3.4243 },
    clue: "Lagos pulse runs on sound. What year was the iconic Air Jordan 1 first released to change street culture forever?",
    acceptedAnswers: ['1985'],
    hint: "Think OG Chicago debut year (4 digits)",
    token: '⚡ SOUND TOKEN',
    rewardXP: 50,
  },
  {
    id: 'CP-LSX',
    name: 'Checkpoint Beta · LSX Pit',
    locationName: 'Zone B · Authentication Escrow Desk',
    coords: { lat: 6.4310, lng: 3.4239 },
    clue: "At the Lagos Sole Exchange, counterfeit kicks get crushed. What is the mandatory dual-authenticator light spectrum used?",
    acceptedAnswers: ['UV', 'BLACKLIGHT', 'ULTRAVIOLET'],
    hint: "Two letters or invisible black light",
    token: '🛡️ ESCROW TOKEN',
    rewardXP: 50,
  },
  {
    id: 'CP-GALLERY',
    name: 'Checkpoint Gamma · Art Gallery',
    locationName: 'Zone C · Danfo Custom Wall',
    coords: { lat: 6.4316, lng: 3.4245 },
    clue: "The heartbeat of Lagos transit painted across commercial buses. What primary color defines a Danfo?",
    acceptedAnswers: ['YELLOW', 'DANFO YELLOW'],
    hint: "The signature yellow of Lagos commercial hustle",
    token: '🎨 DANFO TOKEN',
    rewardXP: 50,
  },
  {
    id: 'CP-VIP',
    name: 'Checkpoint Delta · VIP Canopy',
    locationName: 'VIP Grail Crypt · Front Row',
    coords: { lat: 6.4312, lng: 3.4241 },
    clue: "Who is the visionary CEO & Convener spearheading Sneakers Fest '26?",
    acceptedAnswers: ['@CATALYSTGGG', 'CATALYSTGGG', 'CATALYST'],
    hint: "The executive behind @s_fest26 (handle starts with @)",
    token: '👑 CONVENER TOKEN',
    rewardXP: 100,
  },
]

export default function LagosGrailHeist() {
  const [activeCheckpointIndex, setActiveCheckpointIndex] = useState(0)
  const [answerInput, setAnswerInput] = useState('')
  const [feedback, setFeedback] = useState(null)
  const [radarPinging, setRadarPinging] = useState(false)
  const [userCoords, setUserCoords] = useState(PARK_CENTER)
  const [simulatedOffset, setSimulatedOffset] = useState(0)

  const { awardXP, unlockBadge } = useFestivalGamification()
  const { setZone } = useFestivalTelemetry()

  // Track captured tokens in state and localStorage
  const [capturedTokens, setCapturedTokens] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('sf26_heist_tokens') || '[]')
    } catch {
      return []
    }
  })

  const [vaultPass, setVaultPass] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('sf26_heist_vault_pass') || 'null')
    } catch {
      return null
    }
  })

  const activeCheckpoint = CHECKPOINTS[activeCheckpointIndex]
  const isHeistComplete = capturedTokens.length === CHECKPOINTS.length

  // Calculate distance in meters using Haversine formula
  const distanceToActive = useMemo(() => {
    const R = 6371e3 // Earth radius in meters
    const phi1 = (userCoords.lat * Math.PI) / 180
    const phi2 = (activeCheckpoint.coords.lat * Math.PI) / 180
    const deltaPhi = ((activeCheckpoint.coords.lat - userCoords.lat) * Math.PI) / 180
    const deltaLambda = ((activeCheckpoint.coords.lng - userCoords.lng) * Math.PI) / 180

    const a =
      Math.sin(deltaPhi / 2) * Math.sin(deltaPhi / 2) +
      Math.cos(phi1) * Math.cos(phi2) * Math.sin(deltaLambda / 2) * Math.sin(deltaLambda / 2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
    const meters = Math.round(R * c)
    return Math.max(8, meters + simulatedOffset)
  }, [userCoords, activeCheckpoint, simulatedOffset])

  const handlePingRadar = () => {
    setRadarPinging(true)
    playFestivalSound('xp_gain')

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        pos => {
          setUserCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude })
          setRadarPinging(false)
          playFestivalSound('zone_click')
        },
        () => {
          // Fallback simulation inside Muri Okunola Park
          setSimulatedOffset(prev => (prev === 0 ? 12 : Math.max(4, prev - 8)))
          setRadarPinging(false)
          playFestivalSound('zone_click')
        },
        { timeout: 4000 }
      )
    } else {
      setSimulatedOffset(prev => (prev === 0 ? 15 : Math.max(6, prev - 5)))
      setRadarPinging(false)
    }
  }

  const handleSolveClue = (e) => {
    e.preventDefault()
    const clean = answerInput.trim().toUpperCase()
    if (!clean) return

    if (activeCheckpoint.acceptedAnswers.includes(clean)) {
      if (!capturedTokens.includes(activeCheckpoint.id)) {
        const nextTokens = [...capturedTokens, activeCheckpoint.id]
        setCapturedTokens(nextTokens)
        try {
          localStorage.setItem('sf26_heist_tokens', JSON.stringify(nextTokens))
        } catch {}

        awardXP(activeCheckpoint.rewardXP, `Captured ${activeCheckpoint.token}`)
        playFestivalSound('nfc_success')
        setFeedback({ success: true, text: `CORRECT! Secured ${activeCheckpoint.token} (+${activeCheckpoint.rewardXP} XP)` })

        // Check if all completed
        if (nextTokens.length === CHECKPOINTS.length) {
          const passCode = `HEIST-VAULT-${Math.floor(1000 + Math.random() * 9000)}`
          const pass = {
            code: passCode,
            tier: 'GRAIL HEIST MASTER',
            unlockedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            seat: 'Main Stage Front-Row Box',
            giveawaySlot: '20:00 WAT Deadstock Draw',
          }
          setVaultPass(pass)
          try {
            localStorage.setItem('sf26_heist_vault_pass', JSON.stringify(pass))
          } catch {}

          awardXP(250, 'Completed Lagos Grail Heist')
          unlockBadge('GRAIL_HEIST_MASTER')
          setZone('stage')
          playFestivalSound('badge_unlock')
          dispatchFestivalAction(FESTIVAL_ACTIONS.ADD_NOTIFICATION, {
            title: '🏆 GRAIL HEIST MASTER UNLOCKED!',
            message: `Secret Vault Pass ${passCode} secured. Present at Main Stage at 20:00 WAT!`
          })
        }
      } else {
        setFeedback({ success: true, text: `Token already captured!` })
      }
      setAnswerInput('')
    } else {
      playFestivalSound('zone_click')
      setFeedback({ success: false, text: `Incorrect! Hint: ${activeCheckpoint.hint}` })
    }
  }

  return (
    <section id="grail-heist" style={{ position: 'relative', padding: '90px 24px', background: '#07090C', color: B.white, overflow: 'hidden' }}>
      <GrainOverlay />

      <div style={{ maxWidth: 1040, margin: '0 auto', position: 'relative', zIndex: 10 }}>
        <SectionTag>IN-PARK AR QUEST</SectionTag>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: 16, marginBottom: 32 }}>
          <div>
            <h2 className="reveal-3d" style={{ fontFamily: "'Orbitron', monospace", fontWeight: 900, fontSize: 'clamp(26px, 4.5vw, 42px)', lineHeight: 1.1 }}>
              LAGOS GRAIL <span style={{ color: B.amber }}>HEIST</span>
            </h2>
            <p style={{ fontFamily: "'Syne', sans-serif", fontSize: 14.5, color: B.smoke, marginTop: 10, maxWidth: 620, lineHeight: 1.7 }}>
              Four encrypted satellite beacons hidden across Muri Okunola Park. Track the radar, solve the street clues, and unlock the secret Deadstock Crypt on the Main Stage.
            </p>
          </div>

          <div style={{ textAlign: 'right' }}>
            <div style={{ fontFamily: "'Orbitron', monospace", fontWeight: 900, fontSize: 26, color: B.neonLime }}>
              {capturedTokens.length} / {CHECKPOINTS.length}
            </div>
            <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 9, color: B.smoke, letterSpacing: '0.2em' }}>
              BEACONS DECRYPTED
            </div>
          </div>
        </div>

        {/* Tactical Radar Display */}
        <div style={{
          background: 'rgba(12, 15, 20, 0.95)',
          border: `1px solid ${isHeistComplete ? B.neonLime : B.amber + '55'}`,
          borderRadius: 18,
          padding: 'clamp(18px, 3.5vw, 32px)',
          boxShadow: isHeistComplete ? `0 0 35px ${B.neonLime}22` : '0 12px 40px rgba(0,0,0,0.6)',
          marginBottom: 32,
        }}>
          {/* Radar Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 10, marginBottom: 20 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ display: 'inline-block', width: 8, height: 8, borderRadius: '50%', background: B.neonLime, boxShadow: `0 0 10px ${B.neonLime}` }}></span>
              <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 10, letterSpacing: '0.15em', color: B.neonLime, fontWeight: 700 }}>
                SATELLITE RADAR · MURI OKUNOLA PARK
              </span>
            </div>
            <button
              onClick={handlePingRadar}
              disabled={radarPinging}
              style={{
                padding: '7px 16px',
                background: radarPinging ? 'rgba(255,255,255,0.05)' : 'rgba(255, 184, 0, 0.15)',
                border: `1px solid ${B.amber}`,
                borderRadius: 6,
                color: B.amber,
                fontFamily: "'Space Mono', monospace",
                fontSize: 9,
                fontWeight: 700,
                letterSpacing: '0.14em',
                cursor: radarPinging ? 'default' : 'pointer'
              }}
            >
              {radarPinging ? '📡 PINGING SENSORS...' : '📡 PING PARK RADAR'}
            </button>
          </div>

          {/* Checkpoint Navigation Tabs */}
          <div style={{ display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 10, marginBottom: 20 }}>
            {CHECKPOINTS.map((cp, idx) => {
              const isCaptured = capturedTokens.includes(cp.id)
              const isSelected = activeCheckpointIndex === idx
              return (
                <button
                  key={cp.id}
                  onClick={() => {
                    setActiveCheckpointIndex(idx)
                    setFeedback(null)
                    playFestivalSound('zone_click')
                  }}
                  style={{
                    flex: '1 1 180px',
                    minWidth: 150,
                    padding: '12px 14px',
                    borderRadius: 10,
                    textAlign: 'left',
                    background: isSelected ? 'rgba(255, 184, 0, 0.12)' : '#080a0f',
                    border: `1px solid ${isSelected ? B.amber : isCaptured ? B.neonLime + '66' : B.gunmetal}`,
                    color: isSelected ? B.white : B.smoke,
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                    <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 8.5, color: isCaptured ? B.neonLime : isSelected ? B.amber : B.smoke }}>
                      BEACON 0{idx + 1}
                    </span>
                    {isCaptured && <span style={{ fontSize: 10, color: B.neonLime }}>✓</span>}
                  </div>
                  <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 12, fontWeight: 700, color: B.white, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {cp.name.split('·')[1]?.trim() || cp.name}
                  </div>
                </button>
              )
            })}
          </div>

          {/* Active Checkpoint Radar Details */}
          <div style={{
            background: '#090B0F',
            borderRadius: 14,
            border: `1px solid ${B.gunmetal}`,
            padding: '22px',
            marginBottom: 24,
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: 20
          }}>
            <div>
              <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 9, color: B.smoke, letterSpacing: '0.15em' }}>
                CURRENT TARGET BEACON
              </div>
              <h3 style={{ fontFamily: "'Orbitron', monospace", fontSize: 18, color: B.white, margin: '6px 0 2px 0' }}>
                {activeCheckpoint.name}
              </h3>
              <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 12, color: B.neonCyan }}>
                📍 {activeCheckpoint.locationName}
              </div>

              <div style={{ marginTop: 16, padding: '12px', background: 'rgba(255,255,255,0.02)', borderRadius: 8, border: `1px solid ${B.gunmetal}88` }}>
                <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 8.5, color: B.amber, fontWeight: 700 }}>
                  DECRYPTION CLUE:
                </div>
                <p style={{ fontFamily: "'Syne', sans-serif", fontSize: 13, color: B.mist, marginTop: 4, lineHeight: 1.6 }}>
                  "{activeCheckpoint.clue}"
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 9, color: B.smoke, letterSpacing: '0.15em' }}>
                  PROXIMITY RADAR SENSOR
                </div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginTop: 6 }}>
                  <span style={{ fontFamily: "'Orbitron', monospace", fontSize: 32, fontWeight: 900, color: distanceToActive <= 15 ? B.neonLime : B.amber }}>
                    ~{distanceToActive}m
                  </span>
                  <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 9, color: distanceToActive <= 15 ? B.neonLime : B.smoke }}>
                    {distanceToActive <= 15 ? '● IN BEACON RANGE' : 'APPROACHING PARK ZONE'}
                  </span>
                </div>

                <div style={{ ...labelStyle, fontSize: 8.5, marginTop: 12, color: B.smoke }}>
                  REWARD ON CAPTURE: <strong style={{ color: B.neonLime }}>+{activeCheckpoint.rewardXP} XP</strong> · <span style={{ color: B.neonCyan }}>{activeCheckpoint.token}</span>
                </div>
              </div>

              {/* Clue Answer Form */}
              <form onSubmit={handleSolveClue} style={{ marginTop: 16 }}>
                <div style={{ display: 'flex', gap: 8 }}>
                  <input
                    type="text"
                    value={answerInput}
                    onChange={(e) => setAnswerInput(e.target.value)}
                    placeholder="ENTER DECRYPTION KEY..."
                    style={{
                      flex: 1,
                      padding: '12px 14px',
                      background: '#12161F',
                      border: `1px solid ${B.gunmetal}`,
                      borderRadius: 8,
                      color: B.white,
                      fontFamily: "'Space Mono', monospace",
                      fontSize: 12,
                      outline: 'none',
                      textTransform: 'uppercase'
                    }}
                  />
                  <button
                    type="submit"
                    style={{
                      padding: '12px 18px',
                      background: B.amber,
                      color: B.black,
                      border: 'none',
                      borderRadius: 8,
                      fontFamily: "'Space Mono', monospace",
                      fontSize: 10,
                      fontWeight: 800,
                      letterSpacing: '0.12em',
                      cursor: 'pointer'
                    }}
                  >
                    SUBMIT
                  </button>
                </div>
                {feedback && (
                  <div style={{
                    marginTop: 8,
                    fontFamily: "'Space Mono', monospace",
                    fontSize: 10,
                    color: feedback.success ? B.neonLime : '#EF4444'
                  }}>
                    {feedback.text}
                  </div>
                )}
              </form>
            </div>
          </div>

          {/* Master Vault Pass Unlocked State */}
          {vaultPass ? (
            <div style={{
              background: 'linear-gradient(135deg, rgba(184, 255, 0, 0.12) 0%, rgba(255, 184, 0, 0.08) 100%)',
              border: `2px solid ${B.neonLime}`,
              borderRadius: 14,
              padding: '24px',
              boxShadow: `0 0 35px ${B.neonLime}33`
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 10, marginBottom: 14 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontSize: 22 }}>🏆</span>
                  <div>
                    <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 9, color: B.neonLime, letterSpacing: '0.2em' }}>
                      ALL 4 BEACONS CAPTURED
                    </div>
                    <h4 style={{ fontFamily: "'Orbitron', monospace", fontSize: 18, color: B.white, margin: 0 }}>
                      GOLDEN VAULT PASS SECURED
                    </h4>
                  </div>
                </div>
                <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 12, fontWeight: 700, color: B.amber }}>
                  CODE: {vaultPass.code}
                </span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 12, marginBottom: 18 }}>
                <div style={{ background: '#07090C', padding: '10px 12px', borderRadius: 8, border: `1px solid ${B.gunmetal}` }}>
                  <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 8, color: B.smoke }}>ACCESS TIER</div>
                  <div style={{ color: B.white, fontWeight: 700, fontSize: 12, marginTop: 2 }}>{vaultPass.seat}</div>
                </div>
                <div style={{ background: '#07090C', padding: '10px 12px', borderRadius: 8, border: `1px solid ${B.gunmetal}` }}>
                  <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 8, color: B.smoke }}>DEADSTOCK DRAW</div>
                  <div style={{ color: B.neonLime, fontWeight: 700, fontSize: 12, marginTop: 2 }}>{vaultPass.giveawaySlot}</div>
                </div>
                <div style={{ background: '#07090C', padding: '10px 12px', borderRadius: 8, border: `1px solid ${B.gunmetal}` }}>
                  <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 8, color: B.smoke }}>VERIFIED AT</div>
                  <div style={{ color: B.amber, fontWeight: 700, fontSize: 12, marginTop: 2 }}>{vaultPass.unlockedAt}</div>
                </div>
              </div>

              <button
                onClick={() => {
                  alert(`Vault Pass ${vaultPass.code} saved! Show this screen at the Main Stage Sound Desk on festival day.`)
                  playFestivalSound('xp_gain')
                }}
                style={{
                  width: '100%',
                  padding: '12px',
                  background: B.neonLime,
                  color: B.black,
                  border: 'none',
                  borderRadius: 8,
                  fontFamily: "'Space Mono', monospace",
                  fontSize: 11,
                  fontWeight: 800,
                  cursor: 'pointer',
                  letterSpacing: '0.12em'
                }}
              >
                💾 SAVE DIGITAL VAULT PASS (+250 XP CLAIMED)
              </button>
            </div>
          ) : (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '14px 18px',
              background: '#090B0F',
              borderRadius: 10,
              border: `1px solid ${B.gunmetal}`
            }}>
              <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 9.5, color: B.smoke }}>
                CAPTURING ALL 4 BEACONS UNLOCKS: <strong style={{ color: B.amber }}>+250 XP</strong> & <span style={{ color: B.neonLime }}>MAIN STAGE DEADSTOCK VAULT DRAW</span>
              </span>
              <span style={{ fontFamily: "'Orbitron', monospace", fontSize: 12, color: B.amber, fontWeight: 700 }}>
                {Math.round((capturedTokens.length / CHECKPOINTS.length) * 100)}% COMPLETE
              </span>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

const labelStyle = { fontFamily: "'Space Mono', monospace", fontSize: 9, letterSpacing: '0.18em' }
