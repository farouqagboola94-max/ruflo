import { useState, useEffect } from 'react'
import { B } from '../tokens'
import { GrainOverlay, ScanLines, SectionTag } from '../components/Shared'
import { addXP, XP_VALUES } from '../lib/passport'

const KEY = 'sf26_soledle'
const MAX_GUESSES = 5

const SNEAKERS = [
  { name: 'Air Jordan 1', clues: ['Released by a brand founded in Beaverton, Oregon.', 'First worn in the 1984-85 NBA season and famously banned.', 'Its "Bred" colorway is considered a holy grail.', 'Designed for a Chicago Bulls rookie.'] },
  { name: 'Air Force 1', clues: ['Named after a presidential aircraft.', 'Released in 1982 as a basketball shoe.', 'Harlem street culture made it an icon in the 80s.', 'Comes in the famous "Triple White" colorway.'] },
  { name: 'Yeezy Boost 350', clues: ['Born from a partnership between a rapper and a German brand.', 'Known for its Primeknit upper and side stripe.', 'First released in a "Turtle Dove" colorway.', 'Designed by Kanye West.'] },
  { name: 'Adidas Superstar', clues: ['Has a rubber shell toe nicknamed for a sea creature.', 'Adopted by a famous hip-hop trio from Queens.', 'Released in 1969 as a basketball shoe.', 'Known as the "Shell Toe".'] },
  { name: 'Nike Dunk Low', clues: ['Originally a college basketball shoe from the 80s.', 'Shares its sole unit with the Air Jordan 1.', 'Blew up again in 2020 thanks to "Panda" colorway.', 'Popular in skateboarding circles.'] },
  { name: 'New Balance 550', clues: ['Made by a brand based in Boston.', 'Originally a basketball shoe from 1989.', 'Got a big pop-culture boost from a Bad Bunny collab.', 'Known for its retro low-top silhouette.'] },
  { name: 'Air Max 1', clues: ['Introduced visible air cushioning to the world.', 'Designed by Tinker Hatfield, inspired by the Pompidou Centre.', 'Released in 1987.', 'Has a celebrated "Day" named after it every March 26.'] },
  { name: 'Air Jordan 4', clues: ['Famous for its visible mesh wings on the side panels.', 'Worn in a iconic Spike Lee film.', 'Has a "Bred" and a "White Cement" colorway.', 'Fourth signature shoe of a Chicago Bulls legend.'] },
  { name: 'Vans Old Skool', clues: ['Known for its iconic side stripe.', 'Born out of Southern California skate culture.', 'Released in 1977 as Style #36.', 'The side stripe is nicknamed the "jazz stripe".'] },
  { name: 'Converse Chuck Taylor', clues: ['Named after a basketball player from the 1920s.', 'Made of canvas with a rubber sole.', 'Nicknamed "Chucks" or "All Stars".', 'One of the oldest sneaker silhouettes still in production.'] },
  { name: 'Air Jordan 11', clues: ['Famous for its patent leather mudguard.', 'Worn during a championship-winning 1996 season.', 'Has a "Concord" and "Bred" colorway.', 'Considered by many the greatest Jordan ever made.'] },
  { name: 'Nike Cortez', clues: ['Designed by Bill Bowerman, the brand co-founder.', 'Famously worn by Forrest Gump.', 'Released in 1972, one of the brand\'s first models.', 'Popular in Chicano and running culture.'] },
]

function todayIndex() {
  const dayMs = 86400000
  return Math.floor(Date.now() / dayMs) % SNEAKERS.length
}

function readState() {
  try { return JSON.parse(localStorage.getItem(KEY)) } catch { return null }
}

export default function Soledle() {
  const todayStr = new Date().toISOString().slice(0, 10)
  const idx = todayIndex()
  const answer = SNEAKERS[idx]

  const [game, setGame] = useState(() => {
    const saved = readState()
    if (saved?.date === todayStr) return saved
    return { date: todayStr, guesses: [], status: 'playing' }
  })
  const [pick, setPick] = useState('')

  useEffect(() => {
    localStorage.setItem(KEY, JSON.stringify(game))
  }, [game])

  function submitGuess() {
    if (!pick || game.status !== 'playing') return
    const guesses = [...game.guesses, pick]
    const correct = pick === answer.name

    if (correct) {
      const xp = Math.round(XP_VALUES.soledleWin * (MAX_GUESSES - guesses.length + 1) / MAX_GUESSES)
      addXP(xp, 'Soledle', guesses.length <= 2 ? 'soledle-ace' : undefined)
      setGame({ ...game, guesses, status: 'won', xpWon: xp })
    } else if (guesses.length >= MAX_GUESSES) {
      setGame({ ...game, guesses, status: 'lost' })
    } else {
      setGame({ ...game, guesses })
    }
    setPick('')
  }

  const cluesRevealed = Math.min(answer.clues.length, game.guesses.length + 1)
  const triesLeft = MAX_GUESSES - game.guesses.length

  return (
    <section id="soledle" style={{ background: B.void, padding: '80px 20px', position: 'relative', overflow: 'hidden' }}>
      <GrainOverlay /><ScanLines />
      <div style={{ maxWidth: 560, margin: '0 auto' }}>
        <SectionTag color={B.neonMagenta}>SOLEDLE · DAILY</SectionTag>
        <h2 style={{ fontFamily: "'Bebas Neue'", fontSize: 'clamp(2.5rem,6vw,4rem)', color: B.white, letterSpacing: '0.05em', marginBottom: 8 }}>
          GUESS TODAY'S SNEAKER
        </h2>
        <p style={{ color: B.smoke, fontFamily: "'Space Mono'", fontSize: '0.78rem', marginBottom: 32 }}>
          One puzzle a day · {MAX_GUESSES} guesses · resets at midnight
        </p>

        <div style={{ background: B.charcoal, border: `1px solid ${B.gunmetal}`, borderRadius: 10, padding: '20px 24px', marginBottom: 20 }}>
          {answer.clues.slice(0, cluesRevealed).map((clue, i) => (
            <div key={i} style={{
              display: 'flex', gap: 10, marginBottom: i < cluesRevealed - 1 ? 12 : 0,
              fontFamily: "'Syne'", fontSize: '0.85rem', color: B.white, lineHeight: 1.6,
            }}>
              <span style={{ color: B.neonMagenta, fontFamily: "'Orbitron'", fontSize: '0.7rem' }}>{i + 1}</span>
              <span>{clue}</span>
            </div>
          ))}
        </div>

        {game.status === 'playing' && (
          <>
            <div style={{ display: 'flex', gap: 10, marginBottom: 16 }}>
              <select
                value={pick}
                onChange={e => setPick(e.target.value)}
                style={{
                  flex: 1, background: B.charcoal, border: `1px solid ${B.gunmetal}`, color: B.white,
                  borderRadius: 6, padding: '12px 14px', fontFamily: "'Space Mono'", fontSize: '0.8rem',
                }}
              >
                <option value="">Pick a sneaker...</option>
                {SNEAKERS.map(s => (
                  <option key={s.name} value={s.name} disabled={game.guesses.includes(s.name)}>{s.name}</option>
                ))}
              </select>
              <button
                onClick={submitGuess}
                disabled={!pick}
                style={{
                  background: pick ? B.neonMagenta : B.gunmetal, color: B.black, border: 'none',
                  padding: '0 24px', fontFamily: "'Bebas Neue'", fontSize: '1rem', letterSpacing: '0.08em',
                  cursor: pick ? 'pointer' : 'default', borderRadius: 6,
                }}
              >
                GUESS
              </button>
            </div>
            <div style={{ fontFamily: "'Space Mono'", fontSize: '0.65rem', color: '#555', marginBottom: 16 }}>
              {triesLeft} {triesLeft === 1 ? 'try' : 'tries'} left
            </div>
          </>
        )}

        {game.guesses.length > 0 && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 20 }}>
            {game.guesses.map((g, i) => (
              <span key={i} style={{
                fontFamily: "'Space Mono'", fontSize: '0.68rem', padding: '6px 12px', borderRadius: 20,
                background: g === answer.name ? `${B.neonLime}15` : `${B.neonMagenta}10`,
                border: `1px solid ${g === answer.name ? B.neonLime : B.neonMagenta}40`,
                color: g === answer.name ? B.neonLime : B.neonMagenta,
                textDecoration: g === answer.name ? 'none' : 'line-through',
              }}>{g}</span>
            ))}
          </div>
        )}

        {game.status === 'won' && (
          <div style={{ textAlign: 'center', background: 'rgba(255,255,255,0.03)', border: `1px solid ${B.neonLime}30`, borderRadius: 12, padding: '20px 24px' }}>
            <div style={{ fontSize: '2.2rem', marginBottom: 8 }}>🎉</div>
            <div style={{ fontFamily: "'Bebas Neue'", fontSize: '1.4rem', color: B.white, marginBottom: 4 }}>SOLVED — {answer.name}</div>
            <div style={{ fontFamily: "'Orbitron'", fontSize: '1.1rem', color: B.neonLime, fontWeight: 900 }}>+{game.xpWon} XP</div>
          </div>
        )}

        {game.status === 'lost' && (
          <div style={{ textAlign: 'center', background: 'rgba(255,255,255,0.03)', border: `1px solid ${B.gunmetal}`, borderRadius: 12, padding: '20px 24px' }}>
            <div style={{ fontSize: '2.2rem', marginBottom: 8 }}>👟</div>
            <div style={{ fontFamily: "'Bebas Neue'", fontSize: '1.3rem', color: B.white, marginBottom: 4 }}>It was the {answer.name}</div>
            <div style={{ fontFamily: "'Space Mono'", fontSize: '0.7rem', color: '#555' }}>Come back tomorrow for a new one</div>
          </div>
        )}
      </div>
    </section>
  )
}
