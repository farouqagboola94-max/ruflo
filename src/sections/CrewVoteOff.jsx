import { useState, useEffect } from 'react'
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

  useEffect(() => { localStorage.setItem(TALLY_KEY, JSON.stringify(tally)) }, [tally])
  useEffect(() => { localStorage.setItem(DAILY_KEY, JSON.stringify(daily)) }, [daily])

  const matchupIdx = order[cursor]
  const matchup = matchupIdx !== undefined ? MATCHUPS[matchupIdx] : null
  const row = matchupIdx !== undefined ? tally[matchupIdx] : null
  const capReached = daily.count >= XP_VALUES.voteDailyCap

  function vote(side) {
    if (!matchup || row.voted) return
    setTally(t => ({ ...t, [matchupIdx]: { ...t[matchupIdx], [side]: t[matchupIdx][side] + 1, voted: side } }))

    if (!capReached) {
      const newCount = daily.count + 1
      addXP(XP_VALUES.vote, 'Crew Vote-Off', newCount >= XP_VALUES.voteDailyCap ? 'crew-critic' : undefined)
      setDaily({ date: today, count: newCount })
    }
  }

  const total = row ? row.a + row.b : 0
  const pctA = total ? Math.round((row.a / total) * 100) : 50
  const pctB = 100 - pctA

  return (
    <section id="vote-off" style={{ background: B.charcoal, padding: '80px 20px', position: 'relative', overflow: 'hidden', textAlign: 'center' }}>
      <GrainOverlay /><ScanLines />
      <Egg id="egg-051" corner="top-right" />
      <Egg id="egg-052" corner="bottom-left" />
      <div style={{ maxWidth: 600, margin: '0 auto' }}>
        <SectionTag color={B.neonCyan}>CREW VOTE-OFF</SectionTag>
        <h2 style={{ fontFamily: "'Bebas Neue'", fontSize: 'clamp(2.5rem,6vw,4rem)', color: B.white, letterSpacing: '0.05em', marginBottom: 8 }}>
          THIS OR THAT
        </h2>
        <p style={{ color: B.smoke, fontFamily: "'Space Mono'", fontSize: '0.78rem', marginBottom: 40 }}>
          Settle the debate — pick a side, see what the crew thinks
        </p>

        {matchup ? (
          <>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
              {['a', 'b'].map(side => {
                const label = matchup[side]
                const voted = row.voted === side
                const disabled = !!row.voted
                return (
                  <button
                    key={side}
                    onClick={() => vote(side)}
                    disabled={disabled}
                    style={{
                      background: voted ? `${B.neonCyan}15` : B.void,
                      border: `1px solid ${voted ? B.neonCyan : B.gunmetal}`,
                      borderRadius: 10, padding: '28px 16px', cursor: disabled ? 'default' : 'pointer',
                      transition: 'border-color 0.2s',
                    }}
                    onMouseEnter={e => { if (!disabled) e.currentTarget.style.borderColor = B.amber }}
                    onMouseLeave={e => { if (!disabled) e.currentTarget.style.borderColor = B.gunmetal }}
                  >
                    <div style={{ fontFamily: "'Bebas Neue'", fontSize: '1.3rem', color: B.white, marginBottom: row.voted ? 10 : 0 }}>{label}</div>
                    {row.voted && (
                      <>
                        <div style={{ height: 6, background: B.gunmetal, borderRadius: 3, overflow: 'hidden', marginBottom: 6 }}>
                          <div style={{ height: '100%', width: `${side === 'a' ? pctA : pctB}%`, background: B.neonCyan, transition: 'width 0.5s ease' }} />
                        </div>
                        <div style={{ fontFamily: "'Orbitron'", fontSize: '0.85rem', color: B.neonCyan, fontWeight: 900 }}>{side === 'a' ? pctA : pctB}%</div>
                      </>
                    )}
                  </button>
                )
              })}
            </div>

            <div style={{ fontFamily: "'Space Mono'", fontSize: '0.65rem', color: '#555', marginBottom: 24 }}>
              {row.voted
                ? capReached && row.voted ? 'Today\'s vote XP cap reached — keep voting for fun' : `+${XP_VALUES.vote} XP earned`
                : `${XP_VALUES.vote} XP per vote · ${Math.max(0, XP_VALUES.voteDailyCap - daily.count)} bonus votes left today`}
            </div>

            <button
              onClick={() => setCursor(c => c + 1)}
              disabled={cursor >= order.length - 1}
              style={{
                background: cursor >= order.length - 1 ? B.gunmetal : 'transparent',
                color: cursor >= order.length - 1 ? B.smoke : B.amber,
                border: `1px solid ${cursor >= order.length - 1 ? B.gunmetal : B.amber}`,
                padding: '12px 32px', fontFamily: "'Bebas Neue'", fontSize: '1.1rem', letterSpacing: '0.1em',
                cursor: cursor >= order.length - 1 ? 'default' : 'pointer', borderRadius: 4,
              }}
            >
              NEXT MATCHUP
            </button>
          </>
        ) : (
          <p style={{ color: B.smoke, fontFamily: "'Space Mono'", fontSize: '0.8rem' }}>
            You've judged every matchup — check back for new ones soon.
          </p>
        )}
      </div>
    </section>
  )
}
