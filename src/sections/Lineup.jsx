import { useState, useEffect, useRef } from 'react'
import { B } from '../tokens'
import { GrainOverlay, AmberGlow, SectionTag } from '../components/Shared'
import Egg from '../components/Egg'

const LINEUP = [
  { name: "DJ SPINALL", role: "HEADLINER", time: "8PM — 10PM", genre: "AFROBEATS / STREET POP", featured: true },
  { name: "SPECIAL GUEST — TBA", role: "SPECIAL GUEST", time: "6PM — 8PM", genre: "ALT-R&B / ELECTRONIC" },
  { name: "SARZ", role: "PRODUCER SET", time: "4PM — 6PM", genre: "STREET / TRAP / AFRO" },
  { name: "DJ NEPTUNE", role: "OPENING ACT", time: "2PM — 4PM", genre: "AFROBEATS / STREET POP" },
  { name: "SPECIAL GUEST — TBA", role: "SPECIAL GUEST", time: "12PM — 2PM", genre: "AFROBEATS / STREET POP" },
  { name: "+ MORE TBA", role: "SURPRISE GUESTS", time: "THROUGHOUT", genre: "CULTURE × SOUL × FUTURE" },
]

const BASE_VOTES    = [4821, 3192, 2356, 1688, 2103, 5740]
const BASE_WATCHERS = [89,   44,   31,   27,   52,   118 ]

function todayKey() { return new Date().toISOString().slice(0, 10) }

export default function Lineup() {
  const [votes,    setVotes]    = useState({})
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
        <div style={{ marginBottom: 56 }}>
          <SectionTag>MUSIC × CULTURE</SectionTag>
          <div className="reveal-3d text-3d" style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "clamp(40px, 6vw, 68px)", color: B.white, lineHeight: 0.9 }}>
            THE<br /><span style={{ color: B.neonMagenta }}>LINEUP</span>
          </div>
          <div style={{ marginTop: 14 }}>
            <div className="card-3d" style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              background: `${B.neonMagenta}10`, border: `1px solid ${B.neonMagenta}30`,
              borderRadius: 20, padding: '5px 14px',
            }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: B.neonMagenta, display: 'inline-block', animation: 'hypePulse 2.2s ease-in-out infinite' }} />
              <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 8, color: B.neonMagenta, letterSpacing: '0.15em' }}>
                {totalVotes.toLocaleString()} COMMUNITY HYPE VOTES
              </span>
            </div>
          </div>
        </div>

        <div className="reveal-3d" style={{ display: "flex", flexDirection: "column", gap: 3 }}>
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
                  borderRadius: 4, position: "relative", overflow: "hidden", transition: "all 0.3s",
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

                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 22, color: B.white, lineHeight: 1 }}>
                    {act.name}
                  </div>
                  <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 7, color: B.smoke, letterSpacing: "0.15em", marginTop: 3 }}>
                    {act.genre}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginTop: 7, flexWrap: 'wrap' }}>
                    <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 7, color: '#555' }}>
                      👁 {wc} watching
                    </span>
                    <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 7, color: B.neonMagenta + 'AA' }}>
                      🔥 {vc.toLocaleString()} hype
                    </span>
                  </div>
                </div>

                <div style={{ textAlign: "right", display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 6, flexShrink: 0 }}>
                  <div style={{
                    display: "inline-block", padding: "3px 10px", borderRadius: 2,
                    background: act.featured ? B.neonMagenta + "20" : "transparent",
                    border: `1px solid ${act.featured ? B.neonMagenta + "60" : B.gunmetal}`,
                    fontFamily: "'Space Mono', monospace", fontSize: 7,
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
                      fontFamily: "'Space Mono', monospace", fontSize: 7, cursor: isVoted ? 'default' : 'pointer',
                      letterSpacing: '0.1em', transition: 'all 0.2s', whiteSpace: 'nowrap',
                    }}
                    onMouseEnter={e => { if (!isVoted) { e.currentTarget.style.background = `${B.neonMagenta}20`; e.currentTarget.style.borderColor = B.neonMagenta + '70'; e.currentTarget.style.color = B.neonMagenta } }}
                    onMouseLeave={e => { if (!isVoted) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = B.neonMagenta + '40'; e.currentTarget.style.color = B.smoke } }}
                  >
                    {isVoted ? '✓ HYPED' : '+ HYPE'}
                  </button>
                </div>
              </div>
            )
          })}
        </div>

        <div style={{ marginTop: 28, textAlign: "center" }}>
          <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 9, color: B.smoke, letterSpacing: "0.3em", marginBottom: 20 }}>
            FULL LINEUP ANNOUNCED 60 DAYS BEFORE THE EVENT
          </div>
          <a href="#tickets" style={{ display: 'inline-flex', alignItems: 'center', gap: 10, padding: '14px 32px', background: B.amber, color: B.black, fontFamily: "'Space Mono', monospace", fontSize: 10, fontWeight: 700, letterSpacing: '0.15em', textDecoration: 'none', borderRadius: 4, boxShadow: `0 0 30px ${B.amber}25` }}>
            GET TICKETS — FROM ₦5,000 →
          </a>
        </div>
      </div>
    </section>
  )
}
