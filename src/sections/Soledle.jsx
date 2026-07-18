import { useState, useEffect } from 'react'
import { B } from '../tokens'
import { GrainOverlay, ScanLines, SectionTag } from '../components/Shared'
import { addXP, XP_VALUES } from '../lib/passport'
import Egg from '../components/Egg'

const KEY = 'sf26_soledle'
const PROOF_KEY = 'sf26_soledle_proof'
const MAX_GUESSES = 5
const PROOF_SEED = 1432

const SNEAKERS = [
  { name: 'Air Jordan 1', clues: ['Released by a brand founded in Beaverton, Oregon.', 'First worn in the 1984-85 NBA season and famously banned.', 'Its "Bred" colorway is considered a holy grail.', 'Designed for a Chicago Bulls rookie.'] },
  { name: 'Air Force 1', clues: ['Named after a presidential aircraft.', 'Released in 1982 as a basketball shoe.', 'Harlem street culture made it an icon in the 80s.', 'Comes in the famous "Triple White" colorway.'] },
  { name: 'Yeezy Boost 350', clues: ['Born from a partnership between a rapper and a German brand.', 'Known for its Primeknit upper and side stripe.', 'First released in a "Turtle Dove" colorway.', 'Designed by Kanye West.'] },
  { name: 'Adidas Superstar', clues: ['Has a rubber shell toe nicknamed for a sea creature.', 'Adopted by a famous hip-hop trio from Queens.', 'Released in 1969 as a basketball shoe.', 'Known as the "Shell Toe".'] },
  { name: 'Nike Dunk Low', clues: ['Originally a college basketball shoe from the 80s.', 'Shares its sole unit with the Air Jordan 1.', 'Blew up again in 2020 thanks to "Panda" colorway.', 'Popular in skateboarding circles.'] },
  { name: 'New Balance 550', clues: ['Made by a brand based in Boston.', 'Originally a basketball shoe from 1989.', 'Got a big pop-culture boost from a Bad Bunny collab.', 'Known for its retro low-top silhouette.'] },
  { name: 'Air Max 1', clues: ['Introduced visible air cushioning to the world.', 'Designed by Tinker Hatfield, inspired by the Pompidou Centre.', 'Released in 1987.', 'Has a celebrated "Day" named after it every March 26.'] },
  { name: 'Air Jordan 4', clues: ['Famous for its visible mesh wings on the side panels.', 'Worn in an iconic Spike Lee film.', 'Has a "Bred" and a "White Cement" colorway.', 'Fourth signature shoe of a Chicago Bulls legend.'] },
  { name: 'Vans Old Skool', clues: ['Known for its iconic side stripe.', 'Born out of Southern California skate culture.', 'Released in 1977 as Style #36.', 'The side stripe is nicknamed the "jazz stripe".'] },
  { name: 'Converse Chuck Taylor', clues: ['Named after a basketball player from the 1920s.', 'Made of canvas with a rubber sole.', 'Nicknamed "Chucks" or "All Stars".', 'One of the oldest sneaker silhouettes still in production.'] },
  { name: 'Air Jordan 11', clues: ['Famous for its patent leather mudguard.', 'Worn during a championship-winning 1996 season.', 'Has a "Concord" and "Bred" colorway.', 'Considered by many the greatest Jordan ever made.'] },
  { name: 'Nike Cortez', clues: ['Designed by Bill Bowerman, the brand co-founder.', 'Famously worn by Forrest Gump.', 'Released in 1972, one of the brand\'s first models.', 'Popular in Chicano and running culture.'] },
]

const TAUNTS = {
  1: 'Not even close. The clues are right there — read them again.',
  2: 'Hmm. Real sneakerheads would know this by now.',
  3: 'Are you actually thinking or just guessing? Focus.',
  4: '⚡ Last guess. Don\'t leave here without knowing this.',
}

const WIN_LINES = [
  'You already knew. The clues were just formalities.',
  'That\'s culture, not luck. See you Dec 12 in Lagos.',
  'Took you a moment, but real heads always get there.',
  'Every guess was a clue you needed. Now you know.',
  'You got there in the end. Close, but that still counts.',
]

function todayIndex() {
  return Math.floor(Date.now() / 86400000) % SNEAKERS.length
}

function dayNumber() {
  return Math.floor(Date.now() / 86400000) - 20000
}

function readState() {
  try { return JSON.parse(localStorage.getItem(KEY)) } catch { return null }
}

function getProofCount() {
  try {
    const d = JSON.parse(localStorage.getItem(PROOF_KEY) || 'null')
    const today = new Date().toISOString().slice(0, 10)
    return d?.date === today ? PROOF_SEED + d.count : PROOF_SEED
  } catch { return PROOF_SEED }
}

function addProof() {
  try {
    const today = new Date().toISOString().slice(0, 10)
    const d = JSON.parse(localStorage.getItem(PROOF_KEY) || 'null')
    const count = d?.date === today ? d.count + 1 : 1
    localStorage.setItem(PROOF_KEY, JSON.stringify({ date: today, count }))
    return PROOF_SEED + count
  } catch { return PROOF_SEED }
}

function Confetti({ count = 52 }) {
  const COLORS = [B.neonMagenta, B.amber, B.neonLime, B.neonCyan, '#fff']
  return (
    <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 9500 }}>
      {Array.from({ length: count }, (_, i) => (
        <div key={i} style={{
          position: 'absolute',
          left: `${Math.random() * 100}%`,
          top: -16,
          width: 5 + Math.random() * 8,
          height: 5 + Math.random() * 8,
          background: COLORS[i % COLORS.length],
          borderRadius: i % 3 === 0 ? '50%' : 2,
          animation: `confettiFall ${1.0 + Math.random() * 1.0}s ${Math.random() * 0.4}s ease-in forwards`,
        }} />
      ))}
    </div>
  )
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
  const [confetti, setConfetti] = useState(false)
  const [solvers, setSolvers] = useState(getProofCount)
  const [copied, setCopied] = useState(false)

  useEffect(() => { localStorage.setItem(KEY, JSON.stringify(game)) }, [game])

  function submitGuess() {
    if (!pick || game.status !== 'playing') return
    const guesses = [...game.guesses, pick]
    const correct = pick === answer.name

    if (correct) {
      const isOracle = game.guesses.length === 0
      const badge = isOracle ? 'soledle-oracle' : guesses.length <= 2 ? 'soledle-ace' : undefined
      const xp = Math.round(XP_VALUES.soledleWin * (MAX_GUESSES - guesses.length + 1) / MAX_GUESSES)
      addXP(xp, 'Soledle', badge)
      setGame({ ...game, guesses, status: 'won', xpWon: xp, oracle: isOracle })
      setSolvers(addProof())
      setConfetti(true)
      setTimeout(() => setConfetti(false), 3500)
    } else if (guesses.length >= MAX_GUESSES) {
      setGame({ ...game, guesses, status: 'lost' })
    } else {
      setGame({ ...game, guesses })
    }
    setPick('')
  }

  function buildShareGrid() {
    const lines = game.guesses.map(g => g === answer.name ? '🟩' : '🟥')
    const result = game.status === 'won'
      ? `${game.guesses.length}/${MAX_GUESSES}`
      : 'X/5'
    return `Soledle #${dayNumber()}\n${lines.join('')} ${result}\n${game.xpWon ? `+${game.xpWon} XP · ` : ''}Sneakers Fest '26 · Dec 12 Lagos 👟`
  }

  function shareResult() {
    const text = buildShareGrid()
    if (navigator.share) navigator.share({ text }).catch(() => {})
    else { navigator.clipboard.writeText(text).catch(() => {}); setCopied(true); setTimeout(() => setCopied(false), 2500) }
  }

  const cluesRevealed = Math.min(answer.clues.length, game.guesses.length + 1)
  const triesLeft = MAX_GUESSES - game.guesses.length
  const lastGuessWrong = game.guesses.length > 0 && game.guesses[game.guesses.length - 1] !== answer.name
  const taunt = lastGuessWrong && game.status === 'playing' ? TAUNTS[game.guesses.length] : null
  const winLine = game.status === 'won' ? WIN_LINES[Math.min(game.guesses.length - 1, WIN_LINES.length - 1)] : ''

  return (
    <section id="soledle" style={{ background: B.void, padding: '80px 20px', position: 'relative', overflow: 'hidden' }}>
      {confetti && <Confetti />}
      <GrainOverlay /><ScanLines />
      <Egg id="egg-041" corner="top-right" />
      <Egg id="egg-042" corner="bottom-left" />

      <style>{`
        @keyframes tauntSlide {
          from { opacity: 0; transform: translateX(-8px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        @keyframes winPop {
          0%   { transform: scale(0.85); opacity: 0; }
          65%  { transform: scale(1.04); }
          100% { transform: scale(1); opacity: 1; }
        }
      `}</style>

      <div style={{ maxWidth: 560, margin: '0 auto' }}>
        <SectionTag color={B.neonMagenta}>SOLEDLE · DAILY</SectionTag>
        <h2 className="reveal-3d text-3d" style={{ fontFamily: "'Bebas Neue'", fontSize: 'clamp(2.5rem,6vw,4rem)', color: B.white, letterSpacing: '0.05em', marginBottom: 8 }}>
          GUESS TODAY'S SNEAKER
        </h2>

        {/* Social proof */}
        <div style={{ fontFamily: "'Space Mono'", fontSize: '0.6rem', color: B.smoke, marginBottom: 28 }}>
          <span style={{ color: '#22ff44', marginRight: 6 }}>●</span>
          <strong style={{ color: B.neonMagenta }}>{solvers.toLocaleString()}</strong> players solved today's puzzle ·{' '}
          <span style={{ color: '#444' }}>resets at midnight</span>
        </div>

        {/* Clue card */}
        <div className="card-3d" style={{ background: B.charcoal, border: `1px solid ${B.gunmetal}`, borderRadius: 10, padding: '20px 24px', marginBottom: 16 }}>
          <div style={{ fontFamily: "'Space Mono'", fontSize: '0.52rem', color: '#444', letterSpacing: '0.12em', marginBottom: 12 }}>
            PUZZLE #{dayNumber()} · {cluesRevealed} OF {answer.clues.length} CLUES REVEALED
          </div>
          {answer.clues.slice(0, cluesRevealed).map((clue, i) => (
            <div key={i} style={{
              display: 'flex', gap: 10, marginBottom: i < cluesRevealed - 1 ? 12 : 0,
              fontFamily: "'Syne'", fontSize: '0.85rem', color: B.white, lineHeight: 1.6,
            }}>
              <span style={{ color: B.neonMagenta, fontFamily: "'Orbitron'", fontSize: '0.7rem', flexShrink: 0, marginTop: 2 }}>{i + 1}</span>
              <span>{clue}</span>
            </div>
          ))}
        </div>

        {/* Taunt */}
        {taunt && (
          <div style={{
            background: `${B.neonMagenta}10`, border: `1px solid ${B.neonMagenta}30`,
            borderRadius: 6, padding: '8px 16px', marginBottom: 12,
            fontFamily: "'Space Mono'", fontSize: '0.6rem', color: B.neonMagenta,
            animation: 'tauntSlide 0.35s ease',
          }}>
            {taunt}
          </div>
        )}

        {/* Wrong guesses display */}
        {game.guesses.length > 0 && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 14 }}>
            {game.guesses.map((g, i) => (
              <span key={i} style={{
                fontFamily: "'Space Mono'", fontSize: '0.65rem', padding: '5px 12px', borderRadius: 20,
                background: g === answer.name ? `${B.neonLime}15` : `${B.neonMagenta}08`,
                border: `1px solid ${g === answer.name ? B.neonLime : B.neonMagenta}35`,
                color: g === answer.name ? B.neonLime : '#555',
                textDecoration: g === answer.name ? 'none' : 'line-through',
              }}>
                {g === answer.name ? '🟩' : '🟥'} {g}
              </span>
            ))}
          </div>
        )}

        {/* Playing state */}
        {game.status === 'playing' && (
          <>
            <div style={{ display: 'flex', gap: 10, marginBottom: 10 }}>
              <select
                value={pick}
                onChange={e => setPick(e.target.value)}
                style={{
                  flex: 1, background: B.charcoal, border: `1px solid ${B.gunmetal}`, color: B.white,
                  borderRadius: 6, padding: '12px 14px', fontFamily: "'Space Mono'", fontSize: '0.8rem',
                }}
              >
                <option value="">Pick a sneaker…</option>
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
            <div style={{ fontFamily: "'Space Mono'", fontSize: '0.62rem', color: triesLeft <= 1 ? B.neonMagenta : '#555', marginBottom: 12 }}>
              {triesLeft === 1 ? '⚡ FINAL GUESS' : `${triesLeft} guesses remaining`}
            </div>
          </>
        )}

        {/* Won */}
        {game.status === 'won' && (
          <div className="card-3d" style={{ textAlign: 'center', background: `${B.neonLime}08`, border: `1px solid ${B.neonLime}30`, borderRadius: 12, padding: '24px', animation: 'winPop 0.5s cubic-bezier(0.34,1.56,0.64,1)' }}>
            {game.oracle && (
              <div style={{
                display: 'inline-block', background: `${B.amber}15`, border: `1px solid ${B.amber}50`,
                borderRadius: 20, padding: '4px 16px', marginBottom: 12,
                fontFamily: "'Orbitron'", fontSize: '0.58rem', color: B.amber, letterSpacing: '0.12em',
              }}>
                🧠 ORACLE — FIRST GUESS
              </div>
            )}
            <div style={{ fontFamily: "'Bebas Neue'", fontSize: '1.5rem', color: B.white, marginBottom: 4 }}>
              {answer.name.toUpperCase()}
            </div>
            <div style={{ fontFamily: "'Space Mono'", fontSize: '0.65rem', color: B.smoke, marginBottom: 12, lineHeight: 1.5 }}>
              {winLine}
            </div>
            <div style={{ fontFamily: "'Orbitron'", fontSize: '1.1rem', color: B.neonLime, fontWeight: 900, marginBottom: 16 }}>
              +{game.xpWon} XP
            </div>
            {/* Emoji grid */}
            <div style={{
              fontFamily: "'Space Mono'", fontSize: '0.6rem', color: B.smoke,
              background: B.charcoal, borderRadius: 8, padding: '10px 16px', marginBottom: 16,
              letterSpacing: '0.05em', lineHeight: 1.8,
            }}>
              {game.guesses.map((g, i) => g === answer.name ? '🟩' : '🟥').join('')}&nbsp;
              {game.guesses.length}/{MAX_GUESSES}
            </div>
            <button
              onClick={shareResult}
              style={{
                background: B.neonMagenta, color: B.black, border: 'none',
                padding: '10px 28px', fontFamily: "'Bebas Neue'", fontSize: '1.1rem', letterSpacing: '0.1em',
                cursor: 'pointer', borderRadius: 4,
              }}
            >
              {copied ? '✓ COPIED' : 'SHARE RESULT'}
            </button>
          </div>
        )}

        {/* Lost */}
        {game.status === 'lost' && (
          <div style={{ textAlign: 'center', background: 'rgba(255,255,255,0.02)', border: `1px solid ${B.gunmetal}`, borderRadius: 12, padding: '24px' }}>
            <div style={{ fontSize: '2rem', marginBottom: 10 }}>👟</div>
            <div style={{ fontFamily: "'Bebas Neue'", fontSize: '1.3rem', color: B.smoke, marginBottom: 4 }}>
              IT WAS THE {answer.name.toUpperCase()}
            </div>
            <div style={{ fontFamily: "'Syne'", fontSize: '0.82rem', color: '#555', lineHeight: 1.5, marginBottom: 14 }}>
              Not everyone knows them all. Tomorrow's another chance to prove yourself.
            </div>
            <button
              onClick={shareResult}
              style={{
                background: 'transparent', border: `1px solid ${B.gunmetal}`,
                color: B.smoke, padding: '10px 24px', fontFamily: "'Bebas Neue'", fontSize: '1rem', letterSpacing: '0.08em',
                cursor: 'pointer', borderRadius: 4,
              }}
            >
              {copied ? '✓ COPIED' : 'SHARE RESULT'}
            </button>
          </div>
        )}

        <div style={{ fontFamily: "'Space Mono'", fontSize: '0.55rem', color: '#333', marginTop: 16, textAlign: 'center' }}>
          ONE PUZZLE PER DAY · NEW SNEAKER AT MIDNIGHT
        </div>
      </div>
    </section>
  )
}
