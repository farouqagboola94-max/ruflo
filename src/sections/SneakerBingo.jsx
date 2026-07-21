import { useState, useEffect, useRef } from 'react'
import { B } from '../tokens'
import { GrainOverlay, ScanLines, SectionTag } from '../components/Shared'
import { addXP, subscribe, getPassport, hasBadge, XP_VALUES } from '../lib/passport'
import Egg from '../components/Egg'

function readJSON(key, fallback) {
  try { return JSON.parse(localStorage.getItem(key)) ?? fallback } catch { return fallback }
}

const SQUARES = [
  { emoji: '🧠', label: 'Trivia Ace',    check: state => state.badges.includes('trivia-ace') },
  { emoji: '🎡', label: 'Lucky Spin',    check: state => state.badges.includes('spin-winner') },
  { emoji: '🪪', label: 'Badge Maker',   check: state => state.badges.includes('badge-creator') },
  { emoji: '🎟', label: 'Raffle Entry',  check: () => Object.keys(readJSON('sf26_raffle_entries', {})).length > 0 },
  { emoji: '🃏', label: 'Free Space',    check: () => true },
  { emoji: '🖼', label: 'Gallery Post',  check: () => readJSON('sf26_gallery', []).length > 0 },
  { emoji: '👀', label: 'Mystery Peek',  check: state => state.badges.includes('mystery-peek') },
  { emoji: '🏛', label: 'Museum Bid',    check: () => Object.values(readJSON('sf26_museum_bids', {})).some(b => b > 0) },
  { emoji: '🤝', label: 'Outfit Match',  check: state => state.badges.includes('outfit-match') },
]

const WIN_LINES = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8],
  [0, 3, 6], [1, 4, 7], [2, 5, 8],
  [0, 4, 8], [2, 4, 6],
]

const ACTIONS_MAP = {
  0: 'Play Trivia & answer 5 correctly',
  1: 'Spin the wheel and win a prize',
  2: 'Create your badge in Badge Maker',
  3: 'Enter any raffle draw',
  5: 'Submit a photo to the Gallery',
  6: 'Spend 60s on the Mystery Drop page',
  7: 'Place a bid in the Culture Museum',
  8: 'Find your match in Outfit Matcher',
}

function Confetti({ count = 48 }) {
  const COLORS = [B.amber, B.neonCyan, B.neonMagenta, B.neonLime, '#fff']
  return (
    <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 9500 }}>
      {Array.from({ length: count }, (_, i) => (
        <div key={i} style={{
          position: 'absolute',
          left: `${Math.random() * 100}%`,
          top: -16,
          width: 6 + Math.random() * 7,
          height: 6 + Math.random() * 7,
          background: COLORS[i % COLORS.length],
          borderRadius: i % 3 === 0 ? '50%' : 2,
          animation: `confettiFall ${1.1 + Math.random() * 0.9}s ${Math.random() * 0.5}s ease-in forwards`,
        }} />
      ))}
    </div>
  )
}

export default function SneakerBingo() {
  const [state, setState] = useState(() => getPassport())
  const [confetti, setConfetti] = useState(false)
  const prevLinesRef = useRef(0)

  useEffect(() => subscribe(setState), [])

  const filled = SQUARES.map(s => s.check(state))
  const filledCount = filled.filter(Boolean).length
  const fullCard = filled.every(Boolean)

  const completedLines = WIN_LINES.filter(line => line.every(idx => filled[idx])).length

  const winningSquares = new Set()
  WIN_LINES.forEach(line => {
    if (line.every(idx => filled[idx])) line.forEach(i => winningSquares.add(i))
  })

  // Find minimum squares needed to complete any incomplete line
  const incompleteLinesData = WIN_LINES.filter(line => !line.every(idx => filled[idx]))
  const minToNext = incompleteLinesData.length > 0
    ? Math.min(...incompleteLinesData.map(line => line.filter(idx => !filled[idx]).length))
    : 0
  const closestLine = incompleteLinesData.find(line =>
    line.filter(idx => !filled[idx]).length === minToNext
  ) || []
  const closestSquareIdx = closestLine.find(idx => !filled[idx])

  useEffect(() => {
    WIN_LINES.forEach((line, i) => {
      const badge = `bingo-line-${i}`
      if (line.every(idx => filled[idx]) && !hasBadge(badge)) {
        addXP(XP_VALUES.bingoLine, 'Sneaker Bingo', badge)
      }
    })
    if (fullCard && !hasBadge('bingo-full')) {
      addXP(XP_VALUES.bingoFull, 'Sneaker Bingo', 'bingo-full')
    }

    if (completedLines > prevLinesRef.current) {
      setConfetti(true)
      setTimeout(() => setConfetti(false), 3000)
    }
    prevLinesRef.current = completedLines
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filled.join(',')])

  return (
    <section id="bingo" style={{ background: B.void, padding: '80px 20px', position: 'relative', overflow: 'hidden', textAlign: 'center' }}>
      {confetti && <Confetti count={48} />}
      <GrainOverlay /><ScanLines />
      <Egg id="egg-059" corner="top-right" />
      <Egg id="egg-060" corner="bottom-left" />

      <style>{`
        @keyframes bingoSquarePop {
          0%   { transform: scale(1); }
          45%  { transform: scale(1.1); }
          100% { transform: scale(1); }
        }
        @keyframes jackpotPulse {
          0%,100% { box-shadow: 0 0 20px ${B.neonLime}40; }
          50%     { box-shadow: 0 0 50px ${B.neonLime}80, 0 0 100px ${B.neonLime}30; }
        }
        @keyframes hintPulse {
          0%,100% { opacity: 0.7; }
          50%     { opacity: 1; }
        }
      `}</style>

      <div style={{ maxWidth: 460, margin: '0 auto' }}>
        <SectionTag color={B.amber}>SNEAKER BINGO</SectionTag>
        <h2 className="reveal-3d text-3d" style={{ fontFamily: "'Bebas Neue'", fontSize: 'clamp(2.5rem,6vw,4rem)', color: B.white, letterSpacing: '0.05em', marginBottom: 8 }}>
          PLAY EVERYTHING, WIN THE CARD
        </h2>
        <p style={{ color: B.smoke, fontFamily: "'Space Mono'", fontSize: '0.75rem', marginBottom: 16 }}>
          Complete a row, column, or diagonal for bonus XP · full card = jackpot
        </p>

        {/* Urgency hint */}
        {!fullCard && completedLines === 0 && minToNext <= 2 && closestSquareIdx !== undefined && (
          <div className="card-3d" style={{
            background: `${B.amber}12`, border: `1px solid ${B.amber}30`,
            borderRadius: 8, padding: '8px 16px', marginBottom: 20,
            fontFamily: "'Space Mono'", fontSize: '0.62rem', color: B.amber,
            animation: 'hintPulse 2.2s ease-in-out infinite',
          }}>
            {minToNext === 1
              ? `⚡ ONE SQUARE FROM BINGO — ${ACTIONS_MAP[closestSquareIdx] || 'Complete the next action'}`
              : `🎯 ${minToNext} SQUARES FROM YOUR FIRST BINGO`}
          </div>
        )}

        {/* Bingo grid */}
        <div className="reveal-3d" style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 8, marginBottom: 20 }}>
          {SQUARES.map((sq, i) => {
            const isWinning = winningSquares.has(i)
            const isFree = i === 4
            return (
              <div key={i} style={{
                aspectRatio: '1', borderRadius: 10,
                display: 'flex', flexDirection: 'column',
                alignItems: 'center', justifyContent: 'center', gap: 4, padding: 6,
                background: isWinning
                  ? `${B.neonLime}18`
                  : filled[i] ? `${B.amber}12` : 'rgba(255,255,255,0.02)',
                border: `1px solid ${isWinning ? B.neonLime + '70' : filled[i] ? B.amber + '50' : 'rgba(255,255,255,0.08)'}`,
                opacity: filled[i] ? 1 : 0.52,
                boxShadow: isWinning ? `0 0 16px ${B.neonLime}30` : 'none',
                animation: filled[i] && !isFree ? 'bingoSquarePop 0.4s ease' : 'none',
                transition: 'background 0.3s, border-color 0.3s, box-shadow 0.3s',
              }}>
                <div style={{ fontSize: '1.5rem' }}>{sq.emoji}</div>
                <div style={{
                  fontFamily: "'Space Mono'", fontSize: '0.48rem',
                  color: isWinning ? B.neonLime : filled[i] ? B.amber : '#555',
                  letterSpacing: '0.04em', textAlign: 'center', lineHeight: 1.3,
                }}>
                  {sq.label}
                </div>
              </div>
            )
          })}
        </div>

        {/* Stats row */}
        <div className="reveal-3d" style={{ display: 'flex', justifyContent: 'center', gap: 20, fontFamily: "'Space Mono'", fontSize: '0.65rem', color: '#555', marginBottom: 16 }}>
          <span>SQUARES: <strong style={{ color: B.white }}>{filledCount}/9</strong></span>
          <span>LINES: <strong style={{ color: B.amber }}>{completedLines}/8</strong></span>
          {completedLines > 0 && (
            <span>BONUS: <strong style={{ color: B.neonLime }}>+{completedLines * XP_VALUES.bingoLine} XP</strong></span>
          )}
        </div>

        {/* Progress bar */}
        <div style={{ background: 'rgba(255,255,255,0.06)', borderRadius: 4, height: 3, overflow: 'hidden', maxWidth: 280, margin: '0 auto 20px' }}>
          <div style={{
            width: `${(filledCount / 9) * 100}%`, height: '100%',
            background: `linear-gradient(90deg, ${B.amber}, ${B.neonLime})`,
            transition: 'width 0.5s cubic-bezier(0.34,1.56,0.64,1)',
          }} />
        </div>

        {/* Full card celebration */}
        {fullCard && (
          <div className="card-3d" style={{
            background: `${B.neonLime}10`, border: `1px solid ${B.neonLime}60`,
            borderRadius: 12, padding: '20px 24px',
            animation: 'jackpotPulse 2s ease-in-out infinite',
          }}>
            <div style={{ fontSize: '2rem', marginBottom: 8 }}>🎊</div>
            <div style={{ fontFamily: "'Bebas Neue'", fontSize: '1.4rem', color: B.neonLime, letterSpacing: '0.1em' }}>
              FULL CARD — JACKPOT CLAIMED
            </div>
            <div style={{ fontFamily: "'Orbitron'", fontSize: '1rem', fontWeight: 900, color: B.amber, marginTop: 6 }}>
              +{XP_VALUES.bingoFull} XP EARNED
            </div>
          </div>
        )}

        {/* Next action hint when no full card */}
        {!fullCard && minToNext > 0 && completedLines === 0 && (
          <div style={{ fontFamily: "'Space Mono'", fontSize: '0.6rem', color: '#444', marginTop: 4 }}>
            HINT: {ACTIONS_MAP[closestSquareIdx] || 'Complete more activities across the site'}
          </div>
        )}
      </div>
    </section>
  )
}
