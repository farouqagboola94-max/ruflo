import { useState, useEffect, useRef } from 'react'
import { B } from '../tokens'
import { GrainOverlay, ScanLines, SectionTag } from '../components/Shared'
import { addXP, XP_VALUES } from '../lib/passport'
import Egg from '../components/Egg'

const TALLY_KEY = 'sf26_voteoff_tally'
const DAILY_KEY = 'sf26_voteoff_daily'

const MATCHUPS = [
  { a: 'Air Jordan 1', b: 'Air Force 1' },
  { a: 'Yeezy Boost 350', b: 'Air Max 90' },
  { a: 'Nike Dunk Low', b: 'Adidas Superstar' },
  { a: 'New Balance 550', b: 'Air Jordan 4' },
  { a: 'Vans Old Skool', b: 'Converse Chuck Taylor' },
  { a: 'Air Jordan 11', b: 'Air Jordan 3' },
  { a: 'Nike Cortez', b: 'Adidas Samba' },
  { a: 'Air Max 1', b: 'Air Max 95' },
  { a: 'Reebok Classic', b: 'Puma Suede' },
  { a: 'Travis Scott AJ1', b: 'Off-White AF1' },
]

const SOCIAL_PROOF = [
  'Tunde voted Air Jordan 1 🔥',
  'Chisom picked Off-White AF1',
  'Emeka went with Yeezy 350',
  'Adaeze is voting Travis Scott',
  'Seun chose Nike Dunk Low',
  'Kemi just cast a vote 👟',
  'Babajide voted New Balance',
  'Funmilayo picked Adidas Samba',
  'Chukwuemeka went with Jordan 4',
  'Ngozi is voting right now 👀',
  'Oluwasegun took a hot take ⚡',
  'Ifeoma chose Air Max 95',
  'Uchenna said Converse over Vans',
  'Amaka went against the majority 🔥',
]

function readJSON(key, fallback) {
  try { return JSON.parse(localStorage.getItem(key)) ?? fallback } catch { return fallback }
}

function seedTally() {
  const saved = readJSON(TALLY_KEY, null)
  if (saved) return saved
  const fresh = {}
  MATCHUPS.forEach((_, i) => {
    const a = 40 + Math.floor(Math.random() * 200)
    const b = 40 + Math.floor(Math.random() * 200)
    fresh[i] = { a, b, voted: null }
  })
  return fresh
}

export default function CrewVoteOff() {
  const today = new Date().toISOString().slice(0, 10)
  const [tally, setTally] = useState(seedTally)
  const [order] = useState(() => [...MATCHUPS.keys()].sort(() => Math.random() - 0.5))
  const [cursor, setCursor] = useState(0)
  const [daily, setDaily] = useState(() => {
    const saved = readJSON(DAILY_KEY, null)
    return saved?.date === today ? saved : { date: today, count: 0 }
  })
  const [revealBars, setRevealBars] = useState(false)
  const [voteStreak, setVoteStreak] = useState(0)
  const [streakMsg, setStreakMsg] = useState(null)
  const [proofIdx, setProofIdx] = useState(0)
  const streakMsgRef = useRef(null)

  useEffect(() => { localStorage.setItem(TALLY_KEY, JSON.stringify(tally)) }, [tally])
  useEffect(() => { localStorage.setItem(DAILY_KEY, JSON.stringify(daily)) }, [daily])
  useEffect(() => { setRevealBars(false) }, [cursor])

  useEffect(() => {
    const t = setInterval(() => setProofIdx(i => (i + 1) % SOCIAL_PROOF.length), 2800)
    return () => clearInterval(t)
  }, [])

  const matchupIdx = order[cursor]
  const matchup = matchupIdx !== undefined ? MATCHUPS[matchupIdx] : null
  const row = matchupIdx !== undefined ? tally[matchupIdx] : null
  const capReached = daily.count >= XP_VALUES.voteDailyCap

  const total = row ? row.a + row.b : 0
  const pctA = total ? Math.round((row.a / total) * 100) : 50
  const pctB = 100 - pctA

  const hotTake = row?.voted && ((row.voted === 'a' && pctA < 35) || (row.voted === 'b' && pctB < 35))
  const controversial = row?.voted && Math.abs(pctA - pctB) < 7

  function vote(side) {
    if (!matchup || row.voted) return
    setTally(t => ({ ...t, [matchupIdx]: { ...t[matchupIdx], [side]: t[matchupIdx][side] + 1, voted: side } }))

    if (!capReached) {
      const newCount = daily.count + 1
      addXP(XP_VALUES.vote, 'Crew Vote-Off', newCount >= XP_VALUES.voteDailyCap ? 'crew-critic' : undefined)
      setDaily({ date: today, count: newCount })
    }

    const newStreak = voteStreak + 1
    setVoteStreak(newStreak)

    clearTimeout(streakMsgRef.current)
    if (newStreak === 3) {
      addXP(15, 'Vote Streak', 'vote-streak-3')
      setStreakMsg('🔥 TRIPLE VOTE STREAK — +15 BONUS XP')
      streakMsgRef.current = setTimeout(() => setStreakMsg(null), 3200)
    } else if (newStreak === 5) {
      addXP(25, 'Vote Streak', 'vote-streak-5')
      setStreakMsg('👑 FIVE IN A ROW — +25 BONUS XP')
      streakMsgRef.current = setTimeout(() => setStreakMsg(null), 3200)
    } else if (newStreak === MATCHUPS.length) {
      addXP(50, 'Vote Sweep', 'vote-sweep')
      setStreakMsg('💎 FULL SWEEP — +50 XP · YOU SAW EVERYTHING')
      streakMsgRef.current = setTimeout(() => setStreakMsg(null), 4000)
    }

    setTimeout(() => setRevealBars(true), 850)
  }

  return (
    <section id="vote-off" style={{ background: B.charcoal, padding: '80px 20px', position: 'relative', overflow: 'hidden', textAlign: 'center' }}>
      <GrainOverlay /><ScanLines />
      <Egg id="egg-051" corner="top-right" />
      <Egg id="egg-052" corner="bottom-left" />

      <style>{`
        @keyframes resultSlide {
          from { opacity: 0; transform: translateY(6px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes streakPop {
          0%   { transform: scale(0.8); opacity: 0; }
          60%  { transform: scale(1.05); opacity: 1; }
          100% { transform: scale(1); }
        }
        @keyframes proofScroll {
          0%,100% { opacity: 0.55; }
          50%     { opacity: 1; }
        }
      `}</style>

      <div style={{ maxWidth: 600, margin: '0 auto' }}>
        <SectionTag color={B.neonCyan}>CREW VOTE-OFF</SectionTag>
        <h2 className="reveal-3d text-3d" style={{ fontFamily: "'Bebas Neue'", fontSize: 'clamp(2.5rem,6vw,4rem)', color: B.white, letterSpacing: '0.05em', marginBottom: 8 }}>
          THIS OR THAT
        </h2>

        {/* Live social proof */}
        <div style={{
          fontFamily: "'Space Mono'", fontSize: '0.58rem', color: B.smoke, marginBottom: 28,
          animation: 'proofScroll 2.8s ease-in-out infinite',
        }}>
          <span style={{ color: '#22ff44', marginRight: 6 }}>●</span>
          {SOCIAL_PROOF[proofIdx]}
        </div>

        {/* Streak notification */}
        {streakMsg && (
          <div style={{
            background: `${B.amber}15`, border: `1px solid ${B.amber}50`,
            borderRadius: 8, padding: '10px 20px', marginBottom: 20,
            fontFamily: "'Orbitron'", fontSize: '0.62rem', color: B.amber, letterSpacing: '0.1em',
            animation: 'streakPop 0.4s cubic-bezier(0.34,1.56,0.64,1)',
          }}>
            {streakMsg}
          </div>
        )}

        {matchup ? (
          <>
            {/* Matchup counter */}
            <div style={{ fontFamily: "'Space Mono'", fontSize: '0.58rem', color: '#444', marginBottom: 12 }}>
              MATCHUP {cursor + 1} OF {order.length} · {voteStreak > 0 ? `${voteStreak}-VOTE STREAK` : 'SETTLE THE DEBATE'}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 12 }}>
              {['a', 'b'].map(side => {
                const label = matchup[side]
                const voted = row.voted === side
                const disabled = !!row.voted
                const sidePct = side === 'a' ? pctA : pctB
                return (
                  <button
                    key={side}
                    onClick={() => vote(side)}
                    disabled={disabled}
                    style={{
                      background: voted ? `${B.neonCyan}15` : B.void,
                      border: `1px solid ${voted ? B.neonCyan : B.gunmetal}`,
                      borderRadius: 10, padding: '28px 16px', cursor: disabled ? 'default' : 'pointer',
                      transition: 'border-color 0.2s, background 0.2s',
                      position: 'relative',
                    }}
                    onMouseEnter={e => { if (!disabled) e.currentTarget.style.borderColor = B.amber }}
                    onMouseLeave={e => { if (!disabled) e.currentTarget.style.borderColor = B.gunmetal }}
                  >
                    <div style={{ fontFamily: "'Bebas Neue'", fontSize: '1.3rem', color: B.white, marginBottom: row.voted && revealBars ? 12 : 0 }}>
                      {label}
                    </div>
                    {row.voted && revealBars && (
                      <div style={{ animation: 'resultSlide 0.4s ease' }}>
                        <div style={{ height: 6, background: B.gunmetal, borderRadius: 3, overflow: 'hidden', marginBottom: 6 }}>
                          <div style={{ height: '100%', width: `${sidePct}%`, background: voted ? B.neonCyan : '#555', transition: 'width 0.7s cubic-bezier(0.4,0,0.2,1)' }} />
                        </div>
                        <div style={{ fontFamily: "'Orbitron'", fontSize: '0.85rem', color: voted ? B.neonCyan : '#555', fontWeight: 900 }}>
                          {sidePct}%
                        </div>
                      </div>
                    )}
                    {row.voted && !revealBars && (
                      <div style={{ fontFamily: "'Space Mono'", fontSize: '0.55rem', color: '#555', marginTop: 8 }}>
                        counting votes…
                      </div>
                    )}
                  </button>
                )
              })}
            </div>

            {/* HOT TAKE / CONTROVERSIAL badges */}
            {revealBars && (hotTake || controversial) && (
              <div style={{
                display: 'inline-flex', gap: 8, marginBottom: 12, flexWrap: 'wrap', justifyContent: 'center',
              }}>
                {hotTake && (
                  <span style={{
                    background: `${B.neonMagenta}15`, border: `1px solid ${B.neonMagenta}50`,
                    borderRadius: 20, padding: '4px 14px',
                    fontFamily: "'Orbitron'", fontSize: '0.55rem', color: B.neonMagenta, letterSpacing: '0.1em',
                  }}>
                    ⚡ HOT TAKE
                  </span>
                )}
                {controversial && !hotTake && (
                  <span style={{
                    background: `${B.amber}12`, border: `1px solid ${B.amber}40`,
                    borderRadius: 20, padding: '4px 14px',
                    fontFamily: "'Orbitron'", fontSize: '0.55rem', color: B.amber, letterSpacing: '0.1em',
                  }}>
                    🔥 CONTROVERSIAL MATCHUP
                  </span>
                )}
              </div>
            )}

            <div style={{ fontFamily: "'Space Mono'", fontSize: '0.62rem', color: '#555', marginBottom: 24 }}>
              {row.voted
                ? (capReached ? 'XP cap reached — keep voting for the culture' : `+${XP_VALUES.vote} XP earned`)
                : `${XP_VALUES.vote} XP per vote · ${Math.max(0, XP_VALUES.voteDailyCap - daily.count)} bonus votes left today`}
            </div>

            <button
              onClick={() => setCursor(c => c + 1)}
              disabled={cursor >= order.length - 1}
              style={{
                background: cursor >= order.length - 1 ? B.gunmetal : 'transparent',
                color: cursor >= order.length - 1 ? B.smoke : B.amber,
                border: `1px solid ${cursor >= order.length - 1 ? B.gunmetal : B.amber}`,
                padding: '12px 36px', fontFamily: "'Bebas Neue'", fontSize: '1.1rem', letterSpacing: '0.1em',
                cursor: cursor >= order.length - 1 ? 'default' : 'pointer', borderRadius: 4,
              }}
            >
              {cursor >= order.length - 1 ? 'ALL MATCHUPS JUDGED' : 'NEXT MATCHUP →'}
            </button>
          </>
        ) : (
          <div className="card-3d" style={{ background: `${B.neonLime}08`, border: `1px solid ${B.neonLime}25`, borderRadius: 12, padding: '28px 24px' }}>
            <div style={{ fontSize: '2rem', marginBottom: 10 }}>👑</div>
            <div style={{ fontFamily: "'Bebas Neue'", fontSize: '1.4rem', color: B.neonLime, letterSpacing: '0.1em', marginBottom: 6 }}>
              FULL SWEEP — YOU JUDGED EVERYTHING
            </div>
            <div style={{ fontFamily: "'Space Mono'", fontSize: '0.65rem', color: B.smoke }}>
              Come back tomorrow — new matchups drop daily.
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
