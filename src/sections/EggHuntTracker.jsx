import { useEffect, useState } from 'react'
import { B } from '../tokens'
import { GrainOverlay, SectionTag, Divider } from '../components/Shared'
import { EGGS, TOTAL_EGGS, EGG_XP, eggCount, getFoundEggs, subscribeEggs } from '../lib/easterEggs'

export default function EggHuntTracker() {
  const [found, setFound] = useState(() => getFoundEggs())

  useEffect(() => subscribeEggs(() => setFound(getFoundEggs())), [])

  const count = found.length
  const pct = Math.round((count / TOTAL_EGGS) * 100)
  const complete = count === TOTAL_EGGS

  return (
    <section id="egg-hunt" style={{ position: 'relative', padding: '100px 24px', background: B.void, overflow: 'hidden' }}>
      <GrainOverlay />
      <div style={{ maxWidth: 900, margin: '0 auto', position: 'relative', zIndex: 2 }}>
        <SectionTag label="THE GREAT SOLE HUNT" />
        <h2 className="reveal-3d text-3d" style={{ fontFamily: "'Anton', sans-serif", fontSize: 'clamp(28px,5vw,52px)', color: B.white, lineHeight: 1.05 }}>
          100 EGGS. 100 WINNERS.<br />ARE YOU ONE OF THEM?
        </h2>
        <Divider />
        <p style={{ color: `${B.white}99`, fontSize: 15, lineHeight: 1.7, maxWidth: 640, marginBottom: 32 }}>
          We've hidden 100 tiny eggs across every single section of this site — from the
          hero up top to the footer down below. Each one is small, easy to miss, and worth{' '}
          {EGG_XP} XP the moment you click it. Only one person can claim each egg, so there
          are exactly 100 winners across the whole hunt. Scroll slowly, read the clues, and
          watch for anything that doesn't quite belong.
        </p>

        <div style={{ marginBottom: 28 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: "'Space Mono', monospace", fontSize: 12, color: B.amber, marginBottom: 8 }}>
            <span>{count}/{TOTAL_EGGS} FOUND</span>
            <span>{pct}%</span>
          </div>
          <div style={{ height: 8, background: `${B.white}10`, borderRadius: 4, overflow: 'hidden' }}>
            <div style={{ height: '100%', width: `${pct}%`, background: `linear-gradient(90deg, ${B.amber}, ${B.neonCyan})`, transition: 'width 0.4s' }} />
          </div>
        </div>

        {complete && (
          <div className="card-3d" style={{
            background: `${B.amber}15`, border: `1px solid ${B.amber}`, borderRadius: 8,
            padding: '16px 20px', marginBottom: 28, color: B.amber, fontFamily: "'Space Mono', monospace", fontSize: 13,
          }}>
            🥚 ALL 100 EGGS FOUND — you completed The Great Sole Hunt. Show this screen at the
            event check-in desk to claim your hunt completion prize.
          </div>
        )}

        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(28px, 1fr))', gap: 6,
        }}>
          {EGGS.map((egg, i) => {
            const isFound = found.includes(egg.id)
            return (
              <div
                key={egg.id}
                title={isFound ? egg.clue : 'Not found yet'}
                className="card-3d"
                style={{
                  aspectRatio: '1', borderRadius: 4,
                  background: isFound ? `${B.amber}30` : `${B.white}08`,
                  border: `1px solid ${isFound ? B.amber : `${B.white}15`}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontFamily: "'Space Mono', monospace", fontSize: 9,
                  color: isFound ? B.amber : `${B.white}30`,
                }}
              >
                {isFound ? '✓' : i + 1}
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
