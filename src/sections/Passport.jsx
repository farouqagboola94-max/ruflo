import { useState, useEffect } from 'react'
import { B } from '../tokens'
import { GrainOverlay, ScanLines, SectionTag, Divider } from '../components/Shared'
import { getPassport, getTier, nextTier, subscribe, getLevel, XP_VALUES, TRIVIA_MAX_XP, GRAND_PRIZE_RANK } from '../lib/passport'
import { getReferralLink } from '../lib/referral'
import { eggCount, TOTAL_EGGS } from '../lib/easterEggs'
import Egg from '../components/Egg'
import { useAuth } from '../lib/auth.jsx'
import AuthGate from '../components/AuthGate'

const BADGE_INFO = {
  'trivia-ace':    { label: 'Sole Scholar',  emoji: '🧠', desc: 'Scored 7+ on Sneaker Trivia' },
  'spin-winner':   { label: 'Lucky Spin',    emoji: '🎡', desc: 'Won a real prize on Spin to Win' },
  'badge-creator': { label: 'Badge Maker',   emoji: '🪪', desc: 'Created your event badge' },
  'mystery-peek':  { label: 'Curious One',   emoji: '👀', desc: 'Peeked at the Mystery Drop' },
  'outfit-match':  { label: 'Style Matched', emoji: '🤥', desc: 'Got an AI outfit match' },
  'memory-master': { label: 'Sharp Memory',  emoji: '🧩', desc: 'Cleared Sole Memory in near-minimum moves' },
  'soledle-ace':   { label: 'Soledle Ace',   emoji: '🗓', desc: 'Solved Soledle in 2 guesses or fewer' },
  'crew-critic':   { label: 'Crew Critic',   emoji: '🗳', desc: 'Hit the daily Crew Vote-Off bonus cap' },
  'bingo-full':    { label: 'Full House',    emoji: '🎊', desc: 'Completed the entire Sneaker Bingo card' },
  'egg-hunt-complete': { label: 'Egg Hunter', emoji: '🥚', desc: 'Found all 100 hidden eggs on the site' },
}

const EARN_WAYS = [
  { href: '#trivia',       label: 'Play Sneaker Trivia',   pts: `up to ${TRIVIA_MAX_XP.toLocaleString()} XP` },
  { href: '#memory-match',  label: 'Play Sole Memory',      pts: `up to ${XP_VALUES.memoryMatch} XP` },
  { href: '#soledle',       label: 'Solve Soledle',         pts: `up to ${XP_VALUES.soledleWin} XP` },
  { href: '#spin',          label: 'Spin the Wheel',        pts: `${XP_VALUES.spinLose}-${XP_VALUES.spinWin} XP` },
  { href: '#vote-off',      label: 'Judge a Vote-Off',      pts: `${XP_VALUES.vote} XP` },
  { href: '#badge',         label: 'Make your Badge',       pts: `${XP_VALUES.quickTask} XP` },
  { href: '#mystery',       label: 'Peek the Mystery Drop', pts: `${XP_VALUES.miniPeek} XP` },
  { href: '#outfit',        label: 'Get an Outfit Match',   pts: `${XP_VALUES.quickTask} XP` },
  { href: '#bingo',         label: 'Complete a Bingo line', pts: `${XP_VALUES.bingoLine} XP` },
  { href: '#wall',          label: 'Post to the Wall',      pts: `${XP_VALUES.contribution} XP` },
  { href: '#museum',        label: 'Bid in the Museum',     pts: `${XP_VALUES.bigCommitment} XP` },
  { href: '#raffle',        label: 'Enter the Raffle',      pts: `${XP_VALUES.quickTask} XP` },
  { href: '#egg-hunt',      label: 'Find a hidden egg',     pts: `${XP_VALUES.easterEgg} XP` },
]

function PassportContent({ state, tier }) {
  const [copied, setCopied] = useState(false)
  const [eggsFound, setEggsFound] = useState(() => eggCount())

  useEffect(() => {
    const onEgg = () => setEggsFound(eggCount())
    window.addEventListener('sf26:egg', onEgg)
    return () => window.removeEventListener('sf26:egg', onEgg)
  }, [])

  const next = nextTier(state.xp)
  const pct = next ? Math.min(100, ((state.xp - tier.min) / (next.min - tier.min)) * 100) : 100
  const level = getLevel(state.xp)
  const comboCount = state.dailyEngagement?.date === new Date().toISOString().slice(0, 10)
    ? state.dailyEngagement.sources.length
    : 0
  const comboDone = comboCount >= XP_VALUES.engagementTarget

  function copyLink() {
    const link = getReferralLink()
    try { navigator.clipboard.writeText(link) } catch { /* ignore */ }
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div>
      <a href="#leaderboard" style={{
        display: 'block', textDecoration: 'none', marginBottom: 16,
        background: `${B.amber}10`, border: `1px solid ${B.amber}40`, borderRadius: 10,
        padding: '14px 18px', fontFamily: "'Space Mono'", fontSize: '0.72rem', color: B.amber,
        letterSpacing: '0.04em', transition: 'border-color 0.2s',
      }}
        onMouseEnter={e => { e.currentTarget.style.borderColor = B.amber }}
        onMouseLeave={e => { e.currentTarget.style.borderColor = `${B.amber}40` }}
      >
        🏆 TOP {GRAND_PRIZE_RANK} HIGHEST-XP COLLECTORS WIN GRAND PRIZES AT THE EVENT — CLIMB THE LEADERBOARD →
      </a>

      <a href="#egg-hunt" style={{
        display: 'block', textDecoration: 'none', marginBottom: 24,
        background: `${B.neonLime}10`, border: `1px solid ${B.neonLime}40`, borderRadius: 10,
        padding: '14px 18px', fontFamily: "'Space Mono'", fontSize: '0.72rem', color: B.neonLime,
        letterSpacing: '0.04em', transition: 'border-color 0.2s',
      }}
        onMouseEnter={e => { e.currentTarget.style.borderColor = B.neonLime }}
        onMouseLeave={e => { e.currentTarget.style.borderColor = `${B.neonLime}40` }}
      >
        🥚 {eggsFound}/{TOTAL_EGGS} HIDDEN EGGS FOUND — 100 EGGS, 100 WINNERS, SCATTERED ACROSS THE WHOLE SITE →
      </a>

      <div style={{
        background: B.charcoal, border: `1px solid ${B.gunmetal}`, borderRadius: 12,
        padding: '20px 24px', marginBottom: 24,
      }}>
        <div style={{ fontFamily: "'Space Mono'", fontSize: '0.6rem', letterSpacing: '0.2em', color: '#555', marginBottom: 10 }}>INVITE & EARN</div>
        <p style={{ fontFamily: "'Syne'", fontSize: '0.78rem', color: B.white, marginBottom: 14, lineHeight: 1.5 }}>
          Share your link. When someone you invite signs up, enters a raffle, or registers, you
          earn +{XP_VALUES.referralXP} XP. If they buy a ticket, you get a +{XP_VALUES.referralPurchaseBonus} XP bonus.
        </p>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <input
            readOnly
            value={getReferralLink()}
            onFocus={e => e.target.select()}
            style={{
              flex: '1 1 220px', minWidth: 0, background: B.gunmetal, border: `1px solid ${B.gunmetal}`,
              borderRadius: 6, padding: '10px 12px', color: B.white, fontFamily: "'Space Mono'", fontSize: '0.68rem',
            }}
          />
          <button onClick={copyLink} style={{
            background: copied ? B.neonLime : B.amber, border: 'none', borderRadius: 6,
            padding: '10px 18px', color: B.black, fontFamily: "'Orbitron'", fontWeight: 700,
            fontSize: '0.65rem', cursor: 'pointer', whiteSpace: 'nowrap',
          }}>
            {copied ? 'COPIED!' : 'COPY LINK'}
          </button>
        </div>
      </div>

      <div style={{
        background: B.charcoal, border: `1px solid ${tier.color}40`, borderRadius: 14,
        padding: '28px 32px', marginBottom: 24,
        boxShadow: `0 0 40px ${tier.color}15`,
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 16, marginBottom: 20 }}>
          <div>
            <div style={{ fontFamily: "'Space Mono'", fontSize: '0.6rem', letterSpacing: '0.25em', color: '#555', marginBottom: 6 }}>CURRENT TIER</div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 10 }}>
              <div style={{ fontFamily: "'Bebas Neue'", fontSize: '2.4rem', color: tier.color, letterSpacing: '0.04em' }}>{tier.name}</div>
              <div style={{
                fontFamily: "'Orbitron'", fontSize: '0.65rem', fontWeight: 900, color: B.white,
                background: `${tier.color}25`, border: `1px solid ${tier.color}60`, borderRadius: 20,
                padding: '4px 10px', whiteSpace: 'nowrap',
              }}>LV {level.level}</div>
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontFamily: "'Space Mono'", fontSize: '0.6rem', letterSpacing: '0.25em', color: '#555', marginBottom: 6 }}>TOTAL XP</div>
            <div style={{ fontFamily: "'Orbitron'", fontSize: '2rem', color: B.white, fontWeight: 900 }}>{state.xp.toLocaleString()}</div>
          </div>
        </div>

        <div style={{ height: 8, background: B.gunmetal, borderRadius: 4, overflow: 'hidden', marginBottom: 8 }}>
          <div style={{ height: '100%', width: `${pct}%`, background: tier.color, transition: 'width 0.6s ease', boxShadow: `0 0 10px ${tier.color}` }} />
        </div>
        <div style={{ fontFamily: "'Space Mono'", fontSize: '0.65rem', color: '#555', marginBottom: 18 }}>
          {next ? `${next.min - state.xp} XP to ${next.name}` : 'Max tier reached — Catalyst Elite'}
        </div>

        <div style={{ height: 5, background: B.gunmetal, borderRadius: 3, overflow: 'hidden', marginBottom: 6 }}>
          <div style={{ height: '100%', width: `${level.pct}%`, background: B.neonLime, transition: 'width 0.6s ease', boxShadow: `0 0 8px ${B.neonLime}` }} />
        </div>
        <div style={{ fontFamily: "'Space Mono'", fontSize: '0.6rem', color: '#555' }}>
          {level.level >= 50 ? 'Max card level reached' : `${level.xpToNext} XP to Level ${level.level + 1}`}
        </div>
      </div>

      <div style={{
        background: comboDone ? `${B.amber}10` : B.charcoal, border: `1px solid ${comboDone ? B.amber + '60' : B.gunmetal}`,
        borderRadius: 12, padding: '16px 20px', marginBottom: 32, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap',
      }}>
        <div>
          <div style={{ fontFamily: "'Space Mono'", fontSize: '0.6rem', letterSpacing: '0.2em', color: comboDone ? B.amber : '#555', marginBottom: 4 }}>
            {comboDone ? '✓ DAILY COMBO BONUS CLAIMED' : "TODAY'S COMBO BONUS"}
          </div>
          <div style={{ fontFamily: "'Syne'", fontSize: '0.78rem', color: B.white }}>
            Play {XP_VALUES.engagementTarget} different games today for +{XP_VALUES.engagementBonus} bonus XP
          </div>
        </div>
        <div style={{ display: 'flex', gap: 6 }}>
          {Array.from({ length: XP_VALUES.engagementTarget }).map((_, i) => (
            <div key={i} style={{
              width: 26, height: 26, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
              background: i < comboCount ? B.amber : 'rgba(255,255,255,0.05)',
              border: `1px solid ${i < comboCount ? B.amber : 'rgba(255,255,255,0.1)'}`,
              fontSize: '0.7rem',
            }}>{i < comboCount ? '🔥' : ''}</div>
          ))}
        </div>
      </div>

      <Divider color={tier.color} />

      <div style={{ marginTop: 32, marginBottom: 32 }}>
        <div style={{ fontFamily: "'Space Mono'", fontSize: '0.65rem', letterSpacing: '0.2em', color: '#555', marginBottom: 16 }}>BADGES EARNED ({state.badges.filter(b => BADGE_INFO[b]).length}/{Object.keys(BADGE_INFO).length})</div>
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
  )
}

export default function Passport() {
  const { user } = useAuth()
  const [state, setState] = useState(() => getPassport())

  useEffect(() => {
    const unsub = subscribe(setState)
    return unsub
  }, [])

  const tier = getTier(state.xp)

  return (
    <section id="passport" style={{ background: B.void, padding: '80px 20px', position: 'relative', overflow: 'hidden' }}>
      <GrainOverlay />
      <Egg id="egg-023" corner="top-right" />
      <Egg id="egg-024" corner="bottom-left" />
      <ScanLines />
      <div style={{ maxWidth: 760, margin: '0 auto' }}>
        <SectionTag color={user ? tier.color : B.amber}>SNEAKER PASSPORT</SectionTag>
        <h2 style={{ fontFamily: "'Bebas Neue'", fontSize: 'clamp(2.5rem,6vw,4rem)', color: B.white, letterSpacing: '0.05em', marginBottom: 8 }}>
          YOUR STATUS, EVERYWHERE ON THE SITE
        </h2>
        <p style={{ color: B.smoke, fontFamily: "'Space Mono'", fontSize: '0.78rem', marginBottom: 40 }}>
          One XP total. Every game, raffle, and upload feeds it — and levels your card up.
        </p>
        <AuthGate
          title="UNLOCK YOUR PASSPORT"
          message="Sign in or create a free account to track your XP, earn badges, and unlock the referral programme — synced across devices."
        >
          <PassportContent state={state} tier={tier} />
        </AuthGate>
      </div>
    </section>
  )
}
