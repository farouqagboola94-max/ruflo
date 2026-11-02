import { useState, useEffect, useRef } from 'react'
import { B } from '../tokens'
import { GrainOverlay, AmberGlow, SectionTag } from '../components/Shared'
import { dispatchFestivalAction, FESTIVAL_ACTIONS, playFestivalSound } from '../framework/festivalFramework'
import Egg from '../components/Egg'

const LINEUP = [
  {
    name: "THE YEAR OF FREEDOM HEADLINE SET & ALL-STAR CYPHER",
    role: "HEADLINE SHOWCASE",
    time: "8:00 PM — 9:30 PM",
    stage: "MAIN AMPHITHEATRE",
    genre: "AFROBEATS × STREET POP × LAGOS HIP-HOP CYPHER",
    desc: "High-voltage live headline showcase & surprise Lagos guest cypher under the historic brick Amphitheatre night lights.",
    featured: true,
  },
  {
    name: "THE 4-WAY AMPHITHEATRE DJ SOUNDCLASH",
    role: "4-DECK SOUNDCLASH",
    time: "7:00 PM — 8:00 PM",
    stage: "MAIN AMPHITHEATRE",
    genre: "AFROBEATS VS. ALTÉ VS. UK DRILL/GRIME VS. AMAPIANO",
    desc: "Four deck generals go head-to-head across four 15-minute rounds. Live crowd decibel meter crowns the Sound of Freedom.",
    featured: true,
  },
  {
    name: "COBBLESTONE 1V1 FIT-CHECK ARENA RINGMASTERS",
    role: "ARENA HOSTS & MCS",
    time: "3:00 PM & 6:00 PM",
    stage: "COBBLESTONE FIT ARENA",
    genre: "MAINLAND VS. ISLAND DRIP BATTLES · ₦500K GRAIL POOL",
    desc: "Lagos's sharpest cultural hosts referee 32 head-to-head on-foot battles on the colonial cobblestones.",
    featured: true,
  },
  {
    name: "LIVE GRAIL AUCTION & LSX ESCROW DROP #1",
    role: "THE GRAIL CELLS",
    time: "5:00 PM — 6:00 PM",
    stage: "CELL BLOCK A VAULT",
    genre: "AUTHENTICATED DEADSTOCK · 1-OF-1 LOTS · LIVE GAVEL",
    desc: "Physical UV & stitch-verified grails go under the gavel inside the former colonial prison cells.",
  },
  {
    name: "CULTURAL LIBERATION PANEL: THE YEAR OF FREEDOM",
    role: "SPEAKER SESSIONS",
    time: "2:00 PM — 3:00 PM",
    stage: "MAIN AMPHITHEATRE",
    genre: "WEST AFRICAN STREETWEAR · DESIGN SOVEREIGNTY · COMMERCE",
    desc: "Boutique founders, customs artisans, and archivist collectors unpack the future of African footwear.",
  },
  {
    name: "RESIDENT SOLE DJS & SOLE CRAFT PERGOLA SESSIONS",
    role: "ALL-DAY SOUNDSCAPE",
    time: "12:30 PM — 5:00 PM",
    stage: "COURTYARD & PERGOLA",
    genre: "CULTURE × SOUL × FUTURE BEATS",
    desc: "Continuous daytime vinyl & digital sets powering the 30-booth marketplace and Sole Craft Customization Benches.",
  },
]

const SOUNDCLASH_FACTIONS = [
  { id: 'afrobeats', name: 'AFROBEATS VANGUARD', tag: 'DECK 01 · LAGOS ANTHEMS', color: B.amber, baseScore: 1420 },
  { id: 'alte',      name: 'ALTÉ SYNDICATE',     tag: 'DECK 02 · NEW WAVE & SYNTH', color: B.neonCyan, baseScore: 1290 },
  { id: 'drill',     name: 'LAGOS DRILL / GRIME', tag: 'DECK 03 · 140 BPM ENERGY', color: B.neonMagenta, baseScore: 1185 },
  { id: 'amapiano',  name: 'AMAPIANO LOG DRUM',  tag: 'DECK 04 · PRETORIA TO CMS', color: B.neonLime, baseScore: 1365 },
]

const BASE_VOTES    = [4821, 4192, 3356, 2688, 2103, 5740]
const BASE_WATCHERS = [112,  94,   68,   51,   42,   128 ]

function todayKey() { return new Date().toISOString().slice(0, 10) }

export default function Lineup() {
  const [votes,    setVotes]    = useState({})
  const [revealedCiphers, setRevealedCiphers] = useState({})
  const [faction,  setFaction]  = useState(() => {
    try { return localStorage.getItem('sf26_soundclash_faction') || '' } catch { return '' }
  })
  const [watchers, setWatchers] = useState(() => Object.fromEntries(BASE_WATCHERS.map((b, i) => [i, b])))
  const tickRef = useRef(null)

  useEffect(() => {
    try { setVotes(JSON.parse(localStorage.getItem('sf26_lineup_votes') || '{}')) } catch {}
    tickRef.current = setInterval(() => {
      setWatchers(prev => {
        const next = { ...prev }
        BASE_WATCHERS.forEach((base, i) => {
          const delta = Math.floor(Math.random() * 7) - 3
          next[i] = Math.max(base - 10, (prev[i] || base) + delta)
        })
        return next
      })
    }, 8000)
    return () => clearInterval(tickRef.current)
  }, [])

  function voted(i)    { return !!votes[`${i}:${todayKey()}`] }

  function castVote(i) {
    if (voted(i)) return
    const next = { ...votes, [`${i}:${todayKey()}`]: true }
    setVotes(next)
    try { localStorage.setItem('sf26_lineup_votes', JSON.stringify(next)) } catch {}
    dispatchFestivalAction(FESTIVAL_ACTIONS.XP_AWARD, { amount: 25, reason: 'Lineup Hype Vote' })
    playFestivalSound('tap')
  }

  function selectFaction(id) {
    setFaction(id)
    try { localStorage.setItem('sf26_soundclash_faction', id) } catch {}
    dispatchFestivalAction(FESTIVAL_ACTIONS.XP_AWARD, { amount: 50, reason: '4-Way DJ Soundclash Faction Locked' })
    playFestivalSound('badge_unlock')
  }

  function voteCount(i) {
    const personal = Object.keys(votes).filter(k => k.startsWith(`${i}:`)).length
    return BASE_VOTES[i] + personal
  }

  const maxVotes   = Math.max(...LINEUP.map((_, i) => voteCount(i)))
  const totalVotes = LINEUP.reduce((s, _, i) => s + voteCount(i), 0)

  return (
    <section id="lineup" style={{
      position: "relative", overflow: "hidden",
      background: B.void, padding: "100px 24px",
    }}>
      <GrainOverlay />
      <Egg id="egg-081" corner="top-right" />
      <Egg id="egg-082" corner="bottom-left" />
      <AmberGlow top="20%" left="85%" size={350} />

      <div style={{
        position: "absolute", top: "30%", left: "-5%", width: "110%", height: 1,
        background: `linear-gradient(90deg, transparent, ${B.neonMagenta}25, transparent)`,
        transform: "rotate(-2deg)",
      }} />

      <style>{`@keyframes hypePulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:.5;transform:scale(1.4)} }`}</style>

      <div style={{ position: "relative", zIndex: 10, maxWidth: 1100, margin: "0 auto" }}>
        <div style={{ marginBottom: 40, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: 20 }}>
          <div>
            <SectionTag>FREEDOM PARK AMPHITHEATRE · PHASE 1 LOCKED</SectionTag>
            <div className="reveal-3d text-3d" style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "clamp(40px, 6vw, 68px)", color: B.white, lineHeight: 0.9 }}>
              AMPHITHEATRE<br /><span style={{ color: B.neonMagenta }}>LINEUP & SOUNDCLASH</span>
            </div>
            <p style={{ fontFamily: "'Syne', sans-serif", fontSize: 14, color: B.smoke, maxWidth: 620, marginTop: 12, lineHeight: 1.6 }}>
              From the 2:00 PM Cultural Liberation Panel to the 7:00 PM 4-Way DJ Soundclash and 8:00 PM Headline Cypher — experience live music and street culture inside the historic brick Amphitheatre at Freedom Park, CMS.
            </p>
          </div>
          <div>
            <div className="card-3d" style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              background: `${B.neonMagenta}10`, border: `1px solid ${B.neonMagenta}30`,
              borderRadius: 20, padding: '7px 16px',
            }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: B.neonMagenta, display: 'inline-block', animation: 'hypePulse 2.2s ease-in-out infinite' }} />
              <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 9, color: B.neonMagenta, letterSpacing: '0.15em', fontWeight: 700 }}>
                {totalVotes.toLocaleString()} COMMUNITY HYPE VOTES
              </span>
            </div>
          </div>
        </div>

        {/* 4-WAY DJ SOUNDCLASH INTERACTIVE FACTION SELECTOR */}
        <div className="reveal-3d" style={{
          marginBottom: 32, padding: '22px 24px',
          background: 'rgba(255,255,255,0.02)',
          border: `1px solid ${B.neonMagenta}35`,
          borderRadius: 12,
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 10, marginBottom: 14 }}>
            <div>
              <div style={{ fontFamily: "'Orbitron', monospace", fontSize: 10, color: B.neonMagenta, letterSpacing: '0.2em', fontWeight: 700 }}>
                ⚡ 7:00 PM MAIN AMPHITHEATRE · PICK YOUR SOUNDCLASH FACTION (+50 XP)
              </div>
              <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 10, color: B.smoke, marginTop: 3 }}>
                Four sound systems. Four genres. One brick amphitheatre. Vote for the deck corner you are backing on Dec 12:
              </div>
            </div>
            {faction && (
              <span style={{ padding: '4px 10px', background: `${B.neonLime}18`, border: `1px solid ${B.neonLime}50`, borderRadius: 4, fontFamily: "'Space Mono', monospace", fontSize: 9, color: B.neonLime }}>
                ✓ FACTION LOCKED (+50 XP)
              </span>
            )}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: 10 }}>
            {SOUNDCLASH_FACTIONS.map(f => {
              const active = faction === f.id
              const count = f.baseScore + (active ? 1 : 0)
              return (
                <button
                  key={f.id}
                  onClick={() => selectFaction(f.id)}
                  style={{
                    padding: '14px 16px',
                    textAlign: 'left',
                    background: active ? `${f.color}18` : 'rgba(0,0,0,0.45)',
                    border: `1.5px solid ${active ? f.color : 'rgba(255,255,255,0.08)'}`,
                    borderRadius: 8,
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                  }}
                >
                  <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 8, color: f.color, letterSpacing: '0.15em', marginBottom: 4 }}>
                    {f.tag}
                  </div>
                  <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 20, color: B.white, letterSpacing: '0.05em' }}>
                    {f.name}
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 8, fontFamily: "'Space Mono', monospace", fontSize: 9, color: active ? f.color : B.smoke }}>
                    <span>{count.toLocaleString()} BACKERS</span>
                    <span style={{ fontWeight: 700 }}>{active ? '● YOUR CORNER' : 'BACK THIS DECK →'}</span>
                  </div>
                </button>
              )
            })}
          </div>
        </div>

        <div className="reveal-3d" style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          {LINEUP.map((act, i) => {
            const isVoted = voted(i)
            const vc      = voteCount(i)
            const pct     = maxVotes > 0 ? (vc / maxVotes) * 100 : 0
            const wc      = watchers[i] ?? BASE_WATCHERS[i]

            return (
              <div
                key={i}
                className="card-3d"
                style={{
                  display: "flex", alignItems: "center", gap: 20, padding: "20px 24px",
                  background: act.featured ? `${B.neonMagenta}08` : i % 2 === 0 ? B.charcoal : "transparent",
                  border: `1px solid ${act.featured ? B.neonMagenta + "50" : B.gunmetal}`,
                  borderRadius: 6, position: "relative", overflow: "hidden", transition: "all 0.3s",
                  flexWrap: 'wrap',
                }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = B.neonMagenta + "60"; e.currentTarget.style.background = `${B.neonMagenta}10` }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = act.featured ? B.neonMagenta + "50" : B.gunmetal; e.currentTarget.style.background = act.featured ? `${B.neonMagenta}08` : i % 2 === 0 ? B.charcoal : "transparent" }}
              >
                {/* Anticipation bar */}
                <div style={{ position: "absolute", bottom: 0, left: 0, height: 2, width: `${pct}%`, background: `linear-gradient(90deg, ${B.neonMagenta}40, ${B.neonMagenta})`, transition: 'width 1.2s ease' }} />

                {act.featured && <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 3, background: B.neonMagenta }} />}

                <div style={{
                  width: 42, height: 42, borderRadius: "50%",
                  border: `1px solid ${act.featured ? B.neonMagenta + "60" : B.gunmetal}`,
                  background: B.void, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                }}>
                  <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 10, color: act.featured ? B.neonMagenta : B.smoke }}>
                    {String(i + 1).padStart(2, '0')}
                  </span>
                </div>

                <div style={{ flex: 1, minWidth: 240 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', marginBottom: 3 }}>
                    <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 8, color: B.amber, background: `${B.amber}15`, border: `1px solid ${B.amber}40`, padding: '2px 7px', borderRadius: 3, letterSpacing: '0.12em' }}>
                      📍 {act.stage}
                    </span>
                    <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 9, color: B.smoke, letterSpacing: "0.12em" }}>
                      {act.genre}
                    </span>
                  </div>
                  <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 24, color: B.white, lineHeight: 1.05, letterSpacing: '0.03em' }}>
                    {act.name}
                  </div>
                  {act.desc && (
                    <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 12, color: B.smoke, marginTop: 4, lineHeight: 1.5 }}>
                      {act.desc}
                    </div>
                  )}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginTop: 8, flexWrap: 'wrap' }}>
                    <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 9, color: B.smoke }}>
                      👁 {wc} watching
                    </span>
                    <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 9, color: B.neonMagenta + 'CC' }}>
                      🔥 {vc.toLocaleString()} hype
                    </span>
                  </div>
                </div>

                <div style={{ textAlign: "right", display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 6, flexShrink: 0, marginLeft: 'auto' }}>
                  <div style={{
                    display: "inline-block", padding: "3px 10px", borderRadius: 2,
                    background: act.featured ? B.neonMagenta + "20" : "transparent",
                    border: `1px solid ${act.featured ? B.neonMagenta + "60" : B.gunmetal}`,
                    fontFamily: "'Space Mono', monospace", fontSize: 9,
                    color: act.featured ? B.neonMagenta : B.smoke, letterSpacing: "0.1em",
                  }}>
                    {act.role}
                  </div>
                  <div style={{ fontFamily: "'Orbitron', monospace", fontSize: 11, fontWeight: 700, color: B.amber }}>
                    {act.time}
                  </div>
                  <button
                    onClick={() => castVote(i)}
                    disabled={isVoted}
                    style={{
                      padding: '5px 12px', borderRadius: 3,
                      background: isVoted ? `${B.neonMagenta}20` : 'transparent',
                      border: `1px solid ${isVoted ? B.neonMagenta + '70' : B.neonMagenta + '40'}`,
                      color: isVoted ? B.neonMagenta : B.smoke,
                      fontFamily: "'Space Mono', monospace", fontSize: 9, cursor: isVoted ? 'default' : 'pointer',
                      letterSpacing: '0.1em', transition: 'all 0.2s', whiteSpace: 'nowrap',
                    }}
                    onMouseEnter={e => { if (!isVoted) { e.currentTarget.style.background = `${B.neonMagenta}20`; e.currentTarget.style.borderColor = B.neonMagenta + '70'; e.currentTarget.style.color = B.neonMagenta } }}
                    onMouseLeave={e => { if (!isVoted) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = B.neonMagenta + '40'; e.currentTarget.style.color = B.smoke } }}
                  >
                    {isVoted ? '✓ HYPED' : '+ HYPE (+25 XP)'}
                  </button>
                </div>
              </div>
            )
          })}
        </div>

        {/* PHASE 1 MYSTERY HEADLINER CIPHER REVEAL */}
        <div style={{ marginTop: 40, padding: 24, background: 'rgba(184,255,0,0.03)', border: `1px solid ${B.neonLime}30`, borderRadius: 12 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 10, marginBottom: 16 }}>
            <div>
              <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 9, color: B.neonLime, letterSpacing: '0.2em', fontWeight: 700 }}>
                🔓 DECRYPT TO REVEAL CLUES · OFFICIAL PHASE 1 TEASER
              </span>
              <h4 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 24, color: B.white, margin: '4px 0 0', letterSpacing: 1 }}>
                SECRET HEADLINER & GUEST CIPHER VAULT
              </h4>
            </div>
            <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 9, color: B.smoke, background: 'rgba(255,255,255,0.05)', padding: '4px 10px', borderRadius: 4 }}>
              DEC 12 · FREEDOM PARK AMPHITHEATRE
            </span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 14 }}>
            {[
              {
                id: 'cipher1',
                role: 'SECRET AFROBEATS HEADLINER',
                stage: 'MAIN AMPHITHEATRE (9:00 PM)',
                clue: 'Lagos Island Roots · Multi-Platinum Street Anthems · Rare SB Dunk Collector',
                revealAt: 'Official announcement dropping on @s_fest26',
                color: B.amber,
              },
              {
                id: 'cipher2',
                role: 'ALTÉ & STREET SOUL QUEEN',
                stage: 'AMPHITHEATRE SUNSET SET (6:30 PM)',
                clue: 'London/Lagos Alté Pioneer · 1-of-1 Customizer Collaborator · Global Fashion Week Headliner',
                revealAt: 'Official reveal Phase 1 drop',
                color: B.neonMagenta,
              },
              {
                id: 'cipher3',
                role: 'AMPHITHEATRE SOUNDCLASH GENERAL',
                stage: '4-DECK LIVE ARENA (7:30 PM)',
                clue: 'Boiler Room Lagos Champion · 10,000+ Vinyl Vault · Master of Afrobeats-to-Amapiano transition',
                revealAt: 'Winner decided by crowd decibel meter',
                color: B.neonLime,
              },
            ].map(c => {
              const isRevealed = !!revealedCiphers[c.id]
              return (
                <div
                  key={c.id}
                  onClick={() => {
                    if (!isRevealed) {
                      setRevealedCiphers(prev => ({ ...prev, [c.id]: true }))
                      playFestivalSound('xp_gain')
                      dispatchFestivalAction(FESTIVAL_ACTIONS.XP_EARNED, { amount: 50, reason: 'Lineup Cipher Decrypted' })
                    }
                  }}
                  style={{
                    background: isRevealed ? `${c.color}10` : 'rgba(10,10,15,0.85)',
                    border: `1px solid ${isRevealed ? c.color : 'rgba(255,255,255,0.1)'}`,
                    borderRadius: 8,
                    padding: 18,
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                    <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 8, color: c.color, letterSpacing: '0.15em', fontWeight: 700 }}>
                      {c.role}
                    </span>
                    <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 8, color: isRevealed ? B.neonLime : B.dim }}>
                      {isRevealed ? '✓ DECRYPTED (+50 XP)' : '🔒 CLICK TO DECRYPT'}
                    </span>
                  </div>
                  <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 18, color: B.white, letterSpacing: 0.5, marginBottom: 4 }}>
                    {c.stage}
                  </div>
                  <p style={{
                    fontFamily: "'Syne', sans-serif", fontSize: 12,
                    color: isRevealed ? B.white : B.smoke,
                    lineHeight: 1.5, margin: 0,
                    filter: isRevealed ? 'none' : 'blur(4px)',
                    transition: 'filter 0.4s ease',
                    userSelect: isRevealed ? 'auto' : 'none',
                  }}>
                    {c.clue}
                  </p>
                  <div style={{ marginTop: 10, fontFamily: "'Space Mono', monospace", fontSize: 8, color: B.dim }}>
                    {c.revealAt}
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        <div style={{ marginTop: 28, textAlign: "center" }}>
          <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 9, color: B.smoke, letterSpacing: "0.22em", marginBottom: 20 }}>
            FREEDOM PARK AMPHITHEATRE · DOORS 12:00 PM — 10:00 PM WAT · CMS, LAGOS ISLAND
          </div>
          <a href="#tickets" style={{ display: 'inline-flex', alignItems: 'center', gap: 10, padding: '14px 32px', background: B.amber, color: B.black, fontFamily: "'Space Mono', monospace", fontSize: 10, fontWeight: 700, letterSpacing: '0.15em', textDecoration: 'none', borderRadius: 4, boxShadow: `0 0 30px ${B.amber}25` }}>
            SECURE AMPHITHEATRE ACCESS — FROM ₦5,000 →
          </a>
        </div>
      </div>
    </section>
  )
}
