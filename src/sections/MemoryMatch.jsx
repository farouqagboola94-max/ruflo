import { useState, useEffect, useRef } from 'react'
import { B } from '../tokens'
import { GrainOverlay, ScanLines, SectionTag } from '../components/Shared'
import { addXP, XP_VALUES } from '../lib/passport'
import Egg from '../components/Egg'

const ICONS_EASY   = ['👟','🔥','💎','👑','🎯','⚡','🌟','🏆']
const ICONS_EXPERT = ['👟','🔥','💎','👑','🎯','⚡','🌟','🏆','🎪','💫','🌊','🎭']
const DAILY_KEY = 'sf26_memory_daily'
const MAX_DAILY = 3

const PROOF = [
  "Emeka cleared 8 pairs in 10 moves 🔥",
  "Funmi just earned SOLE MEMORY MASTER 👑",
  "Chidi beat it with a PERFECT score ⚡",
  "Toyin completed Expert mode in 20 moves 💎",
  "Bello cleared 3 games today already 🏆",
  "Amaka just unlocked Expert mode 🌟",
  "Kunle hit a 3-game streak this morning 🎯",
]

function TODAY() { return new Date().toISOString().slice(0, 10) }

function getDailyData() {
  try {
    const d = JSON.parse(localStorage.getItem(DAILY_KEY) || 'null')
    if (d?.date === TODAY()) return d
  } catch {}
  return { date: TODAY(), count: 0, unlocked: false }
}

function makeDeck(icons) {
  const deck = [...icons, ...icons].map((icon, i) => ({ id: i, icon, matched: false }))
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[deck[i], deck[j]] = [deck[j], deck[i]]
  }
  return deck
}

function Confetti({ count = 64 }) {
  const COLORS = [B.amber, B.neonCyan, B.neonMagenta, B.neonLime, '#ffffff']
  return (
    <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 9500 }}>
      {Array.from({ length: count }, (_, i) => (
        <div key={i} style={{
          position: 'absolute',
          left: `${Math.random() * 100}%`,
          top: -16,
          width: 6 + Math.random() * 8,
          height: 6 + Math.random() * 8,
          background: COLORS[i % COLORS.length],
          borderRadius: i % 3 === 0 ? '50%' : 2,
          animation: `confettiFall ${1.2 + Math.random() * 0.8}s ${Math.random() * 0.6}s ease-in forwards`,
        }} />
      ))}
    </div>
  )
}

export default function MemoryMatch() {
  const [phase, setPhase] = useState('intro')
  const [mode, setMode] = useState('easy')
  const [cards, setCards] = useState(() => makeDeck(ICONS_EASY))
  const [flipped, setFlipped] = useState([])
  const [moves, setMoves] = useState(0)
  const [matched, setMatched] = useState(0)
  const [xpWon, setXpWon] = useState(0)
  const [perfect, setPerfect] = useState(false)
  const [confetti, setConfetti] = useState(false)
  const [proofIdx, setProofIdx] = useState(0)
  const [daily, setDaily] = useState(() => getDailyData())
  const [expertUnlocked, setExpertUnlocked] = useState(false)
  const [newlyUnlocked, setNewlyUnlocked] = useState(false)
  const lockRef = useRef(false)
  const movesRef = useRef(0)

  const icons = mode === 'expert' ? ICONS_EXPERT : ICONS_EASY
  const PAIRS = icons.length
  const PERFECT_MOVES = PAIRS + 2

  useEffect(() => {
    const d = getDailyData()
    setDaily(d)
    if (d.count >= MAX_DAILY) setPhase('locked')
    if (d.unlocked) setExpertUnlocked(true)
  }, [])

  useEffect(() => {
    const t = setInterval(() => setProofIdx(i => (i + 1) % PROOF.length), 4500)
    return () => clearInterval(t)
  }, [])

  function start() {
    const d = getDailyData()
    if (d.count >= MAX_DAILY) { setPhase('locked'); return }
    movesRef.current = 0
    setCards(makeDeck(icons))
    setFlipped([])
    setMoves(0)
    setMatched(0)
    setXpWon(0)
    setPerfect(false)
    setNewlyUnlocked(false)
    setPhase('playing')
  }

  function flip(i) {
    if (lockRef.current || phase !== 'playing') return
    if (flipped.includes(i) || cards[i].matched) return
    const next = [...flipped, i]
    setFlipped(next)

    if (next.length === 2) {
      lockRef.current = true
      movesRef.current += 1
      setMoves(movesRef.current)
      const [a, b] = next
      if (cards[a].icon === cards[b].icon) {
        setTimeout(() => {
          setCards(cs => cs.map((c, idx) => idx === a || idx === b ? { ...c, matched: true } : c))
          setFlipped([])
          lockRef.current = false
          setMatched(m => {
            const next2 = m + 1
            if (next2 === PAIRS) finish()
            return next2
          })
        }, 400)
      } else {
        setTimeout(() => { setFlipped([]); lockRef.current = false }, 800)
      }
    }
  }

  function finish() {
    setTimeout(() => {
      const cur = movesRef.current
      const isPerfect = cur <= PERFECT_MOVES
      const penalty = Math.max(0, cur - PERFECT_MOVES) * 5
      const base = mode === 'expert' ? Math.round(XP_VALUES.memoryMatch * 1.8) : XP_VALUES.memoryMatch
      const xp = Math.max(20, base - penalty)

      addXP(xp, 'Memory Match', isPerfect ? 'memory-master' : undefined)
      setXpWon(xp)
      setPerfect(isPerfect)

      if (isPerfect) {
        setConfetti(true)
        setTimeout(() => setConfetti(false), 3200)
      }

      const d = getDailyData()
      const newCount = d.count + 1
      const wasUnlocked = d.unlocked
      const nowUnlocked = wasUnlocked || isPerfect || newCount >= 2
      const updated = { date: TODAY(), count: newCount, unlocked: nowUnlocked }
      try { localStorage.setItem(DAILY_KEY, JSON.stringify(updated)) } catch {}
      setDaily(updated)
      if (nowUnlocked && !wasUnlocked) {
        setExpertUnlocked(true)
        setNewlyUnlocked(true)
      }
      setPhase('done')
    }, 450)
  }

  const gamesLeft = MAX_DAILY - daily.count

  return (
    <section id="memory-match" style={{ background: B.charcoal, padding: '80px 20px', position: 'relative', overflow: 'hidden' }}>
      {confetti && <Confetti count={64} />}
      <GrainOverlay />
      <Egg id="egg-039" corner="top-right" />
      <Egg id="egg-040" corner="bottom-left" />
      <ScanLines />

      <style>{`
        @keyframes masterGlow {
          0%,100% { text-shadow: 0 0 20px ${B.amber}90, 0 0 40px ${B.amber}50; }
          50%      { text-shadow: 0 0 40px ${B.amber}, 0 0 80px ${B.amber}70; }
        }
        @keyframes cardMatch {
          0%   { transform: scale(1); }
          45%  { transform: scale(1.12); }
          100% { transform: scale(1); }
        }
        @keyframes expertUnlock {
          0%   { transform: scale(1); opacity: 0; }
          20%  { transform: scale(1.06); opacity: 1; }
          100% { transform: scale(1); opacity: 1; }
        }
      `}</style>

      <div style={{ maxWidth: 560, margin: '0 auto', textAlign: 'center' }}>
        <SectionTag>SOLE MEMORY</SectionTag>
        <h2 className="reveal-3d text-3d" style={{ fontFamily: "'Bebas Neue'", fontSize: 'clamp(2.5rem,6vw,4rem)', color: B.white, letterSpacing: '0.05em', marginBottom: 6 }}>
          MATCH THE PAIRS
        </h2>

        {/* Social proof ticker */}
        <div className="reveal-3d" style={{
          display: 'inline-block', background: 'rgba(255,255,255,0.04)',
          borderRadius: 20, padding: '4px 14px', marginBottom: 20,
          fontFamily: "'Space Mono'", fontSize: '0.62rem', color: B.smoke,
        }}>
          🟢 {PROOF[proofIdx]}
        </div>

        {/* Daily limit + mode toggle */}
        <div className="reveal-3d" style={{ display: 'flex', justifyContent: 'center', gap: 10, marginBottom: 24, flexWrap: 'wrap', alignItems: 'center' }}>
          <div style={{
            fontFamily: "'Space Mono'", fontSize: '0.62rem', color: '#888',
            background: 'rgba(255,255,255,0.04)', borderRadius: 6, padding: '4px 12px',
          }}>
            TODAY: <strong style={{ color: gamesLeft > 0 ? B.amber : '#ff4444' }}>
              {Math.max(0, gamesLeft)}/{MAX_DAILY} GAMES LEFT
            </strong>
          </div>
          {expertUnlocked && (
            <div style={{ display: 'flex', gap: 6 }}>
              {['easy','expert'].map(m => (
                <button key={m}
                  onClick={() => { if (phase !== 'playing') { setMode(m); setPhase('intro') } }}
                  style={{
                    fontFamily: "'Bebas Neue'", fontSize: '0.7rem', letterSpacing: '0.06em',
                    padding: '4px 10px', borderRadius: 4,
                    cursor: phase === 'playing' ? 'default' : 'pointer',
                    background: mode === m ? B.amber : 'transparent',
                    color: mode === m ? B.black : B.smoke,
                    border: `1px solid ${mode === m ? B.amber : '#444'}`,
                  }}>
                  {m === 'easy' ? '8 PAIRS' : '12 PAIRS ⚡'}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* INTRO */}
        {phase === 'intro' && (
          <div style={{ padding: '20px 0' }}>
            <div style={{ fontSize: '3rem', marginBottom: 12 }}>🧠</div>
            <p style={{ color: B.smoke, fontFamily: "'Space Mono'", fontSize: '0.72rem', marginBottom: 6 }}>
              {PAIRS} pairs · fewer moves = more XP
            </p>
            <p style={{ color: '#555', fontFamily: "'Space Mono'", fontSize: '0.6rem', marginBottom: 24 }}>
              {mode === 'expert'
                ? 'EXPERT MODE ACTIVE · 1.8× XP MULTIPLIER'
                : 'GET PERFECT or PLAY 2× to unlock EXPERT MODE'}
            </p>
            <button onClick={start} style={{
              background: B.amber, color: B.black, border: 'none', padding: '14px 40px',
              fontFamily: "'Bebas Neue'", fontSize: '1.4rem', letterSpacing: '0.1em',
              cursor: 'pointer', borderRadius: 4, boxShadow: `0 0 24px ${B.amber}80`,
            }}>
              FLIP THE FIRST CARD
            </button>
          </div>
        )}

        {/* LOCKED */}
        {phase === 'locked' && (
          <div className="card-3d" style={{
            padding: '32px 20px', background: 'rgba(255,255,255,0.02)',
            borderRadius: 12, border: '1px solid #333',
          }}>
            <div style={{ fontSize: '2.5rem', marginBottom: 12 }}>🔒</div>
            <div style={{ fontFamily: "'Bebas Neue'", fontSize: '1.5rem', color: B.white, marginBottom: 8 }}>
              DAILY LIMIT REACHED
            </div>
            <div style={{ fontFamily: "'Space Mono'", fontSize: '0.7rem', color: B.smoke, marginBottom: 4 }}>
              You played {MAX_DAILY} games today. The greats know when to rest.
            </div>
            <div style={{ fontFamily: "'Space Mono'", fontSize: '0.62rem', color: '#444', marginTop: 14 }}>
              COME BACK TOMORROW FOR FRESH GAMES
            </div>
          </div>
        )}

        {/* GAME BOARD */}
        {(phase === 'playing' || phase === 'done') && (
          <>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12, fontFamily: "'Space Mono'", fontSize: '0.68rem', color: '#888' }}>
              <span>
                MOVES: <strong style={{ color: moves <= PERFECT_MOVES ? B.neonCyan : B.white }}>{moves}</strong>
                {moves > 0 && (
                  <span style={{ color: moves <= PERFECT_MOVES ? B.neonCyan : '#666', marginLeft: 6, fontSize: '0.56rem' }}>
                    {moves <= PERFECT_MOVES ? '✓ PERFECT PACE' : `+${moves - PERFECT_MOVES} over par`}
                  </span>
                )}
              </span>
              <span>MATCHED: <strong style={{ color: B.neonCyan }}>{matched}/{PAIRS}</strong></span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 8, marginBottom: 24 }}>
              {cards.map((c, i) => {
                const isUp = c.matched || flipped.includes(i)
                return (
                  <button key={c.id} onClick={() => flip(i)}
                    disabled={phase === 'done' || c.matched}
                    style={{
                      aspectRatio: '1', borderRadius: 8,
                      fontSize: mode === 'expert' ? '1.15rem' : '1.6rem',
                      background: c.matched ? `${B.neonLime}15` : isUp ? B.gunmetal : B.void,
                      border: `1px solid ${c.matched ? B.neonLime + '60' : isUp ? B.amber + '40' : B.gunmetal}`,
                      cursor: phase === 'done' || c.matched ? 'default' : 'pointer',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      transition: 'background 0.25s, border-color 0.2s',
                      animation: c.matched ? 'cardMatch 0.4s ease' : 'none',
                    }}>
                    {isUp ? c.icon : ''}
                  </button>
                )
              })}
            </div>
          </>
        )}

        {/* RESULT */}
        {phase === 'done' && (
          <div className="card-3d" style={{
            background: perfect ? `${B.amber}10` : 'rgba(255,255,255,0.03)',
            border: `1px solid ${perfect ? B.amber + '50' : B.neonLime + '30'}`,
            borderRadius: 12, padding: '24px',
          }}>
            {perfect ? (
              <>
                <div style={{ fontSize: '2.4rem', marginBottom: 6 }}>🏆</div>
                <div style={{
                  fontFamily: "'Bebas Neue'", fontSize: '1.8rem', letterSpacing: '0.1em',
                  color: B.amber, marginBottom: 4,
                  animation: 'masterGlow 2s ease-in-out infinite',
                }}>
                  SOLE MEMORY MASTER
                </div>
                <div style={{ fontFamily: "'Space Mono'", fontSize: '0.65rem', color: B.smoke, marginBottom: 12 }}>
                  PERFECT GAME · {movesRef.current} MOVES
                </div>
              </>
            ) : (
              <>
                <div style={{ fontSize: '2rem', marginBottom: 6 }}>✅</div>
                <div style={{ fontFamily: "'Bebas Neue'", fontSize: '1.6rem', color: B.white, marginBottom: 4 }}>
                  CLEARED IN {movesRef.current} MOVES
                </div>
              </>
            )}

            <div style={{ fontFamily: "'Orbitron'", fontSize: '1.4rem', color: B.neonLime, fontWeight: 900, marginBottom: 10 }}>
              +{xpWon} XP{mode === 'expert' ? ' · 1.8× EXPERT' : ''}
            </div>

            {newlyUnlocked && (
              <div style={{
                fontFamily: "'Space Mono'", fontSize: '0.62rem', color: B.neonCyan,
                marginBottom: 12, animation: 'expertUnlock 0.6s ease',
              }}>
                ⚡ EXPERT MODE UNLOCKED — 12 pairs · 1.8× XP
              </div>
            )}

            {gamesLeft > 1 && (
              <button onClick={start} style={{
                background: 'transparent', color: B.amber, border: `1px solid ${B.amber}`,
                padding: '10px 28px', fontFamily: "'Bebas Neue'", fontSize: '1.1rem',
                letterSpacing: '0.1em', cursor: 'pointer', borderRadius: 4,
              }}>
                PLAY AGAIN ({gamesLeft - 1} LEFT TODAY)
              </button>
            )}
            {gamesLeft === 1 && (
              <button onClick={start} style={{
                background: 'transparent', color: '#ff8c00', border: `1px solid #ff8c0080`,
                padding: '10px 28px', fontFamily: "'Bebas Neue'", fontSize: '1.1rem',
                letterSpacing: '0.1em', cursor: 'pointer', borderRadius: 4,
              }}>
                LAST GAME TODAY — MAKE IT COUNT
              </button>
            )}
            {gamesLeft <= 0 && (
              <div style={{ fontFamily: "'Space Mono'", fontSize: '0.65rem', color: '#555' }}>
                Daily limit reached — come back tomorrow
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  )
}
