import { useState, useEffect } from 'react'
import { B } from '../tokens'
import { GrainOverlay, ScanLines, SectionTag } from '../components/Shared'
import { addXP, subscribe, getPassport, hasBadge, XP_VALUES } from '../lib/passport'

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

export default function SneakerBingo() {
  const [state, setState] = useState(() => getPassport())

  useEffect(() => subscribe(setState), [])

  const filled = SQUARES.map(s => s.check(state))
  const filledCount = filled.filter(Boolean).length
  const fullCard = filled.every(Boolean)

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filled.join(',')])

  const completedLines = WIN_LINES.filter(line => line.every(idx => filled[idx])).length

  return (
    <section id="bingo" style={{ background: B.void, padding: '80px 20px', position: 'relative', overflow: 'hidden', textAlign: 'center' }}>
      <GrainOverlay /><ScanLines />
      <div style={{ maxWidth: 460, margin: '0 auto' }}>
        <SectionTag color={B.amber}>SNEAKER BINGO</SectionTag>
        <h2 style={{ fontFamily: "'Bebas Neue'", fontSize: 'clamp(2.5rem,6vw,4rem)', color: B.white, letterSpacing: '0.05em', marginBottom: 8 }}>
          PLAY EVERYTHING, WIN THE CARD
        </h2>
        <p style={{ color: B.smoke, fontFamily: "'Space Mono'", fontSize: '0.78rem', marginBottom: 32 }}>
          Complete a row, column, or diagonal for bonus XP · full card = jackpot
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 8, marginBottom: 24 }}>
          {SQUARES.map((sq, i) => (
            <div key={i} style={{
              aspectRatio: '1', borderRadius: 10, display: 'flex', flexDirection: 'column',
              alignItems: 'center', justifyContent: 'center', gap: 4, padding: 6,
              background: filled[i] ? `${B.amber}15` : 'rgba(255,255,255,0.02)',
              border: `1px solid ${filled[i] ? B.amber + '60' : 'rgba(255,255,255,0.08)'}`,
              opacity: filled[i] ? 1 : 0.55,
            }}>
              <div style={{ fontSize: '1.5rem' }}>{sq.emoji}</div>
              <div style={{ fontFamily: "'Space Mono'", fontSize: '0.5rem', color: filled[i] ? B.amber : '#666', letterSpacing: '0.05em', textAlign: 'center', lineHeight: 1.3 }}>
                {sq.label}
              </div>
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', justifyContent: 'center', gap: 24, fontFamily: "'Space Mono'", fontSize: '0.65rem', color: '#555' }}>
          <span>SQUARES: <strong style={{ color: B.white }}>{filledCount}/9</strong></span>
          <span>LINES: <strong style={{ color: B.amber }}>{completedLines}/8</strong></span>
        </div>

        {fullCard && (
          <div style={{ marginTop: 24, background: `${B.neonLime}10`, border: `1px solid ${B.neonLime}50`, borderRadius: 12, padding: '16px 20px' }}>
            <div style={{ fontSize: '1.8rem', marginBottom: 6 }}>🎊</div>
            <div style={{ fontFamily: "'Bebas Neue'", fontSize: '1.3rem', color: B.neonLime }}>FULL CARD — JACKPOT CLAIMED</div>
          </div>
        )}
      </div>
    </section>
  )
}
