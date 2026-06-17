import { useState, useEffect, useRef } from 'react'
import { B } from '../tokens'
import { GrainOverlay, ScanLines, SectionTag } from '../components/Shared'
import { addXP, XP_VALUES } from '../lib/passport'
import Egg from '../components/Egg'

const ICONS = ['👟', '🔥', '💎', '👑', '🎯', '⚡', '🌟', '🏆']
const PAIRS = ICONS.length
const PERFECT_MOVES = PAIRS + 2

function shuffle() {
  const deck = [...ICONS, ...ICONS].map((icon, i) => ({ id: i, icon, matched: false }))
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[deck[i], deck[j]] = [deck[j], deck[i]]
  }
  return deck
}

export default function MemoryMatch() {
  const [phase, setPhase] = useState('intro')
  const [cards, setCards] = useState(shuffle)
  const [flipped, setFlipped] = useState([])
  const [moves, setMoves] = useState(0)
  const [matched, setMatched] = useState(0)
  const [xpWon, setXpWon] = useState(0)
  const lockRef = useRef(false)

  function start() {
    setCards(shuffle())
    setFlipped([])
    setMoves(0)
    setMatched(0)
    setXpWon(0)
    setPhase('playing')
  }

  function flip(i) {
    if (lockRef.current || phase !== 'playing') return
    if (flipped.includes(i) || cards[i].matched) return
    const next = [...flipped, i]
    setFlipped(next)

    if (next.length === 2) {
      lockRef.current = true
      setMoves(m => m + 1)
      const [a, b] = next
      if (cards[a].icon === cards[b].icon) {
        setTimeout(() => {
          setCards(cs => cs.map((c, idx) => (idx === a || idx === b ? { ...c, matched: true } : c)))
          setFlipped([])
          lockRef.current = false
          setMatched(m => {
            const newMatched = m + 1
            if (newMatched === PAIRS) finish()
            return newMatched
          })
        }, 400)
      } else {
        setTimeout(() => {
          setFlipped([])
          lockRef.current = false
        }, 800)
      }
    }
  }

  function finish() {
    setTimeout(() => {
      setMoves(currentMoves => {
        const penalty = Math.max(0, currentMoves + 1 - PERFECT_MOVES) * 5
        const xp = Math.max(20, XP_VALUES.memoryMatch - penalty)
        addXP(xp, 'Memory Match', currentMoves + 1 <= PERFECT_MOVES ? 'memory-master' : undefined)
        setXpWon(xp)
        setPhase('done')
        return currentMoves
      })
    }, 450)
  }

  return (
    <section id="memory-match" style={{ background: B.charcoal, padding: '80px 20px', position: 'relative', overflow: 'hidden' }}>
      <GrainOverlay />
      <Egg id="egg-039" corner="top-right" />
      <Egg id="egg-040" corner="bottom-left" />
      <ScanLines />
      <div style={{ maxWidth: 560, margin: '0 auto', textAlign: 'center' }}>
        <SectionTag>SOLE MEMORY</SectionTag>
        <h2 style={{ fontFamily: "'Bebas Neue'", fontSize: 'clamp(2.5rem,6vw,4rem)', color: B.white, letterSpacing: '0.05em', marginBottom: 8 }}>
          MATCH THE PAIRS
        </h2>
        <p style={{ color: B.smoke, fontFamily: "'Space Mono'", fontSize: '0.78rem', marginBottom: 36 }}>
          {PAIRS} pairs · fewer moves = more XP
        </p>

        {phase === 'intro' && (
          <div style={{ padding: '30px 0' }}>
            <div style={{ fontSize: '3.5rem', marginBottom: 20 }}>🧠</div>
            <button onClick={start} style={{
              background: B.amber, color: B.black, border: 'none', padding: '14px 40px',
              fontFamily: "'Bebas Neue'", fontSize: '1.4rem', letterSpacing: '0.1em',
              cursor: 'pointer', borderRadius: 4, boxShadow: `0 0 24px ${B.amber}80`,
            }}>
              FLIP THE FIRST CARD
            </button>
          </div>
        )}

        {(phase === 'playing' || phase === 'done') && (
          <>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16, fontFamily: "'Space Mono'", fontSize: '0.7rem', color: '#888' }}>
              <span>MOVES: <strong style={{ color: B.white }}>{moves}</strong></span>
              <span>MATCHED: <strong style={{ color: B.neonCyan }}>{matched}/{PAIRS}</strong></span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 8, marginBottom: 24 }}>
              {cards.map((c, i) => {
                const isUp = c.matched || flipped.includes(i)
                return (
                  <button
                    key={c.id}
                    onClick={() => flip(i)}
                    disabled={phase === 'done' || c.matched}
                    style={{
                      aspectRatio: '1', borderRadius: 8, fontSize: '1.6rem',
                      background: c.matched ? `${B.neonLime}15` : isUp ? B.gunmetal : B.void,
                      border: `1px solid ${c.matched ? B.neonLime + '50' : B.gunmetal}`,
                      cursor: phase === 'done' || c.matched ? 'default' : 'pointer',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      transition: 'background 0.25s, transform 0.25s',
                      transform: isUp ? 'scale(1)' : 'scale(0.97)',
                    }}
                  >
                    {isUp ? c.icon : ''}
                  </button>
                )
              })}
            </div>
          </>
        )}

        {phase === 'done' && (
          <div style={{ background: 'rgba(255,255,255,0.03)', border: `1px solid ${B.neonLime}30`, borderRadius: 12, padding: '20px 24px' }}>
            <div style={{ fontSize: '2.4rem', marginBottom: 8 }}>{moves <= PERFECT_MOVES ? '🏆' : '✅'}</div>
            <div style={{ fontFamily: "'Bebas Neue'", fontSize: '1.6rem', color: B.white, marginBottom: 4 }}>
              CLEARED IN {moves} MOVES
            </div>
            <div style={{ fontFamily: "'Orbitron'", fontSize: '1.2rem', color: B.neonLime, fontWeight: 900, marginBottom: 16 }}>
              +{xpWon} XP
            </div>
            <button onClick={start} style={{
              background: 'transparent', color: B.amber, border: `1px solid ${B.amber}`, padding: '10px 28px',
              fontFamily: "'Bebas Neue'", fontSize: '1.1rem', letterSpacing: '0.1em', cursor: 'pointer', borderRadius: 4,
            }}>
              PLAY AGAIN
            </button>
          </div>
        )}
      </div>
    </section>
  )
}
