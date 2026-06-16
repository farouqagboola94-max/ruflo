import { useState, useEffect } from 'react'
import { B } from '../tokens'
import { GrainOverlay, ScanLines, SectionTag, Divider } from '../components/Shared'
import { getPassport, getTier, nextTier, subscribe, XP_VALUES, TRIVIA_MAX_XP } from '../lib/passport'

const BADGE_INFO = {
  'trivia-ace':    { label: 'Sole Scholar',  emoji: '🧠', desc: 'Scored 7+ on Sneaker Trivia' },
  'spin-winner':   { label: 'Lucky Spin',    emoji: '🎡', desc: 'Won a real prize on Spin to Win' },
  'badge-creator': { label: 'Badge Maker',   emoji: '🪪', desc: 'Created your event badge' },
  'mystery-peek':  { label: 'Curious One',   emoji: '👀', desc: 'Peeked at the Mystery Drop' },
  'outfit-match':  { label: 'Style Matched', emoji: '🤥', desc: 'Got an AI outfit match' },
}

const EARN_WAYS = [
  { href: '#trivia',  label: 'Play Sneaker Trivia',   pts: `up to ${TRIVIA_MAX_XP.toLocaleString()} XP` },
  { href: '#spin',    label: 'Spin the Wheel',        pts: `${XP_VALUES.spinLose}-${XP_VALUES.spinWin} XP` },
  { href: '#badge',   label: 'Make your Badge',       pts: `${XP_VALUES.quickTask} XP` },
  { href: '#mystery', label: 'Peek the Mystery Drop',  pts: `${XP_VALUES.miniPeek} XP` },
  { href: '#outfit',  label: 'Get an Outfit Match',    pts: `${XP_VALUES.quickTask} XP` },
  { href: '#wall',    label: 'Post to the Wall',       pts: `${XP_VALUES.contribution} XP` },
  { href: '#museum',  label: 'Bid in the Museum',      pts: `${XP_VALUES.bigCommitment} XP` },
  { href: '#raffle',  label: 'Enter the Raffle',       pts: `${XP_VALUES.quickTask} XP` },
]

export default function Passport() {
  const [state, setState] = useState(() => getPassport())

  useEffect(() => {
    const unsub = subscribe(setState)
    return unsub
  }, [])

  const tier = getTier(state.xp)
  const next = nextTier(state.xp)
  const pct = next ? Math.min(100, ((state.xp - tier.min) / (next.min - tier.min)) * 100) : 100

  return (
    <section id="passport" style={{ background: B.void, padding: '80px 20px', position: 'relative', overflow: 'hidden' }}>
      <GrainOverlay /><ScanLines />
      <div style={{ maxWidth: 760, margin: '0 auto' }}>
        <SectionTag color={tier.color}>SNEAKER PASSPORT</SectionTag>
        <h2 style={{ fontFamily: "'Bebas Neue'", fontSize: 'clamp(2.5rem,6vw,4rem)', color: B.white, letterSpacing: '0.05em', marginBottom: 8 }}>
          YOUR STATUS, EVERYWHERE ON THE SITE
        </h2>
        <p style={{ color: B.smoke, fontFamily: "'Space Mono'", fontSize: '0.78rem', marginBottom: 40 }}>
          One XP total. Every game, raffle, and upload feeds it.
        </p>

        <div style={{
          background: B.charcoal, border: `1px solid ${tier.color}40`, borderRadius: 14,
          padding: '28px 32px', marginBottom: 32,
          boxShadow: `0 0 40px ${tier.color}15`,
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 16, marginBottom: 20 }}>
            <div>
              <div style={{ fontFamily: "'Space Mono'", fontSize: '0.6rem', letterSpacing: '0.25em', color: '#555', marginBottom: 6 }}>CURRENT TIER</div>
              <div style={{ fontFamily: "'Bebas Neue'", fontSize: '2.4rem', color: tier.color, letterSpacing: '0.04em' }}>{tier.name}</div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontFamily: "'Space Mono'", fontSize: '0.6rem', letterSpacing: '0.25em', color: '#555', marginBottom: 6 }}>TOTAL XP</div>
              <div style={{ fontFamily: "'Orbitron'", fontSize: '2rem', color: B.white, fontWeight: 900 }}>{state.xp.toLocaleString()}</div>
            </div>
          </div>

          <div style={{ height: 8, background: B.gunmetal, borderRadius: 4, overflow: 'hidden', marginBottom: 8 }}>
            <div style={{ height: '100%', width: `${pct}%`, background: tier.color, transition: 'width 0.6s ease', boxShadow: `0 0 10px ${tier.color}` }} />
          </div>
          <div style={{ fontFamily: "'Space Mono'", fontSize: '0.65rem', color: '#555' }}>
            {next ? `${next.min - state.xp} XP to ${next.name}` : 'Max tier reached — Catalyst Elite'}
          </div>
        </div>

        <Divider color={tier.color} />

        <div style={{ marginTop: 32, marginBottom: 32 }}>
          <div style={{ fontFamily: "'Space Mono'", fontSize: '0.65rem', letterSpacing: '0.2em', color: '#555', marginBottom: 16 }}>BADGES EARNED ({state.badges.length}/{Object.keys(BADGE_INFO).length})</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(140px,1fr))', gap: 12 }}>
            {Object.entries(BADGE_INFO).map(([key, b]) => {
              const earned = state.badges.includes(key)
              return (
                <div key={key} style={{
                  background: earned ? `${tier.color}10` : 'rgba(255,255,255,0.02)',
                  border: `1px solid ${earned ? tier.color + '50' : 'rgba(255,255,255,0.06)'}`,
                  borderRadius: 10, padding: '16px 14px', textAlign: 'center',
                  opacity: earned ? 1 : 0.4, filter: earned ? 'none' : 'grayscale(1)',
                }}>
                  <div style={{ fontSize: '1.6rem', marginBottom: 8 }}>{b.emoji}</div>
                  <div style={{ fontFamily: "'Bebas Neue'", fontSize: '0.85rem', color: B.white, marginBottom: 4 }}>{b.label}</div>
                  <div style={{ fontFamily: "'Space Mono'", fontSize: '0.55rem', color: '#555', lineHeight: 1.4 }}>{b.desc}</div>
                </div>
              )
            })}
          </div>
        </div>

        <div>
          <div style={{ fontFamily: "'Space Mono'", fontSize: '0.65rem', letterSpacing: '0.2em', color: '#555', marginBottom: 16 }}>WAYS TO EARN XP</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            {EARN_WAYS.map(w => (
              <a key={w.href} href={w.href} style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                background: B.charcoal, border: `1px solid ${B.gunmetal}`, borderRadius: 8,
                padding: '12px 16px', textDecoration: 'none', transition: 'border-color 0.2s',
              }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = tier.color }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = B.gunmetal }}
              >
                <span style={{ fontFamily: "'Syne'", fontSize: '0.78rem', color: B.white }}>{w.label}</span>
                <span style={{ fontFamily: "'Orbitron'", fontSize: '0.62rem', color: tier.color, fontWeight: 700, whiteSpace: 'nowrap', marginLeft: 10 }}>{w.pts}</span>
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
