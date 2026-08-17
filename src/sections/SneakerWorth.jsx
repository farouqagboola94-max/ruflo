import { useState, useEffect, useRef } from 'react'
import { B } from '../tokens'
import { useCounter } from '../lib/counter'
import { GrainOverlay, ScanLines, SectionTag } from '../components/Shared'
import { addXP, XP_VALUES } from '../lib/passport'
import Egg from '../components/Egg'

const QUESTIONS = [
  {
    q: 'How many pairs do you own?',
    options: ['1 – 4', '5 – 20', '21 – 50', '50+'],
    multiplier: [1, 3, 7, 14],
    baseValue: 45000,
  },
  {
    q: 'What is your most expensive pair worth?',
    options: ['Under ₦50k', '₦50k – 200k', '₦200k – 1M', '₦1M+'],
    multiplier: [1, 4, 10, 25],
    baseValue: 40000,
  },
  {
    q: 'How do you source your sneakers?',
    options: ['Online drops', 'Local resellers', 'Overseas travel', 'All three'],
    multiplier: [1.0, 1.3, 1.6, 2.0],
    baseValue: 1,
  },
  {
    q: "What's your primary sneaker motivation?",
    options: ['Daily wear', 'Collecting', 'Resale profit', 'Pure flex'],
    archetype: ['THE EVERYDAY WARRIOR', 'THE CURATOR', 'THE FLIP ARTIST', 'THE FLEX GOD'],
    archetypeColor: [B.neonCyan, B.amber, B.neonLime, B.neonMagenta],
    archetypeDesc: [
      'You wear what you love, every single day. The culture lives through you.',
      'Your collection is a museum. Every piece tells a story only you can narrate.',
      'You see opportunity where others see sneakers. The market is your playground.',
      'Your collection is a statement the whole city reads without asking.',
    ],
    multiplier: [1, 1, 1, 1],
    baseValue: 1,
  },
]

const TODAY = () => new Date().toISOString().slice(0, 10)

const PROOF_MSGS = [
  'collectors revealed their worth',
  'sneakerheads completed this quiz',
  'Lagos collectors checked their value',
  'people discovered their archetype',
]

function percentile(worth) {
  if (worth >= 5000000) return 3
  if (worth >= 1500000) return 8
  if (worth >= 500000) return 18
  if (worth >= 150000) return 35
  return 62
}

function Confetti({ count = 52 }) {
  const COLORS = [B.amber, B.neonCyan, B.neonMagenta, B.neonLime, '#fff']
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
          animation: `confettiFall ${1.0 + Math.random() * 1.0}s ${Math.random() * 0.5}s ease-in forwards`,
        }} />
      ))}
    </div>
  )
}

export default function SneakerWorth() {
  const [answers, setAnswers] = useState([])
  const [phase, setPhase] = useState('quiz')
  const [copied, setCopied] = useState(false)
  const [displayWorth, setDisplayWorth] = useState(0)
  const [confetti, setConfetti] = useState(false)
  const [completions, bumpCompletions] = useCounter('worth')
  const [proofIdx, setProofIdx] = useState(0)
  const countRef = useRef(null)

  useEffect(() => {
    const t = setInterval(() => setProofIdx(i => (i + 1) % PROOF_MSGS.length), 4200)
    return () => clearInterval(t)
  }, [])

  useEffect(() => () => clearInterval(countRef.current), [])

  const current = answers.length
  const q = QUESTIONS[current]

  function calcWorth(ans) {
    const q0 = QUESTIONS[0].multiplier[ans[0]]
    const q1 = QUESTIONS[1].multiplier[ans[1]]
    const q2 = QUESTIONS[2].multiplier[ans[2]]
    return Math.round(((q0 * 45000) + (q1 * 40000)) * q2 / 1000) * 1000
  }

  function answer(idx) {
    const next = [...answers, idx]
    setAnswers(next)
    if (next.length < QUESTIONS.length) return

    setPhase('result')
    const final = calcWorth(next)

    let step = 0
    const steps = 45
    clearInterval(countRef.current)
    countRef.current = setInterval(() => {
      step++
      const eased = 1 - Math.pow(1 - step / steps, 3)
      setDisplayWorth(Math.round(final * eased))
      if (step >= steps) {
        clearInterval(countRef.current)
        setDisplayWorth(final)
        setConfetti(true)
        setTimeout(() => setConfetti(false), 3200)
      }
    }, 35)

    addXP(XP_VALUES.quickTask, 'Sneaker Worth', 'worth-revealed')
    bumpCompletions()
  }

  function reset() {
    setAnswers([])
    setPhase('quiz')
    setDisplayWorth(0)
    clearInterval(countRef.current)
  }

  const worth = phase === 'result' ? calcWorth(answers) : 0
  const archetype = phase === 'result' ? QUESTIONS[3].archetype[answers[3]] : ''
  const archetypeColor = phase === 'result' ? QUESTIONS[3].archetypeColor[answers[3]] : B.amber
  const archetypeDesc = phase === 'result' ? QUESTIONS[3].archetypeDesc[answers[3]] : ''
  const pct = phase === 'result' ? percentile(worth) : 0

  function formatNaira(n) {
    if (n >= 1000000) return `₦${(n / 1000000).toFixed(1)}M`
    return `₦${n.toLocaleString()}`
  }

  function shareResult() {
    const text = `My sneaker collection is worth ${formatNaira(worth)} (street value). I am "${archetype}" — top ${pct}% of Lagos collectors. See you at Sneakers Fest '26, Dec 12! 👟`
    if (navigator.share) navigator.share({ text, url: window.location.href }).catch(() => {})
    else { navigator.clipboard.writeText(text).catch(() => {}); setCopied(true); setTimeout(() => setCopied(false), 2500) }
  }

  return (
    <section id="worth" style={{ background: B.charcoal, padding: '80px 20px', position: 'relative', overflow: 'hidden' }}>
      {confetti && <Confetti />}
      <GrainOverlay /><ScanLines />
      <Egg id="egg-057" corner="top-right" />
      <Egg id="egg-058" corner="bottom-left" />

      <style>{`
        @keyframes worthReveal {
          from { opacity: 0; transform: scale(0.88) translateY(16px); }
          to   { opacity: 1; transform: scale(1) translateY(0); }
        }
        @keyframes archetypeIn {
          from { opacity: 0; transform: translateX(-24px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        @keyframes proofPulse {
          0%,100% { opacity: 0.65; }
          50%     { opacity: 1; }
        }
      `}</style>

      <div style={{ maxWidth: 620, margin: '0 auto' }}>
        <SectionTag>COLLECTION CALCULATOR</SectionTag>
        <h2 className="reveal-3d text-3d" style={{ fontFamily: "'Bebas Neue'", fontSize: 'clamp(2.5rem,6vw,4rem)', color: B.white, letterSpacing: '0.05em', marginBottom: 8 }}>
          WHAT IS YOUR COLLECTION WORTH?
        </h2>

        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 28, animation: 'proofPulse 4s ease-in-out infinite' }}>
          <span style={{ display: 'inline-block', width: 6, height: 6, borderRadius: '50%', background: '#22ff44', flexShrink: 0 }} />
          <span style={{ fontFamily: "'Space Mono'", fontSize: '0.6rem', color: B.smoke }}>
            <strong style={{ color: B.amber }}>{completions === null ? '—' : completions.toLocaleString()}</strong> {PROOF_MSGS[proofIdx]}
          </span>
        </div>

        {phase === 'quiz' && (
          <div>
            <div style={{ display: 'flex', gap: 6, marginBottom: 10 }}>
              {QUESTIONS.map((_, i) => (
                <div key={i} style={{
                  flex: 1, height: 3, borderRadius: 2,
                  background: i < current ? B.amber : B.gunmetal,
                  transition: 'background 0.3s',
                }} />
              ))}
            </div>
            <div style={{ fontFamily: "'Space Mono'", fontSize: '0.55rem', color: B.dim, marginBottom: 22 }}>
              QUESTION {current + 1} OF {QUESTIONS.length}
            </div>

            <div className="card-3d" style={{
              background: B.black, borderRadius: 8, padding: '24px 28px', marginBottom: 24,
              border: `1px solid ${B.gunmetal}`, borderLeft: `3px solid ${B.amber}`,
            }}>
              <p style={{ color: B.white, fontFamily: "'Syne'", fontSize: '1.05rem', lineHeight: 1.65 }}>
                {q.q}
              </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              {q.options.map((opt, i) => (
                <button
                  key={i}
                  onClick={() => answer(i)}
                  style={{
                    background: B.black, border: `1px solid ${B.gunmetal}`,
                    borderRadius: 6, padding: '16px', color: B.white,
                    fontFamily: "'Syne'", fontSize: '0.9rem', cursor: 'pointer',
                    textAlign: 'left', transition: 'all 0.2s',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = B.amber; e.currentTarget.style.background = `${B.amber}12` }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = B.gunmetal; e.currentTarget.style.background = B.black }}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>
        )}

        {phase === 'result' && (
          <div style={{ textAlign: 'center', animation: 'worthReveal 0.55s cubic-bezier(0.34,1.56,0.64,1)' }}>
            <div style={{ fontFamily: "'Orbitron'", fontSize: '0.6rem', letterSpacing: '0.25em', color: B.smoke, marginBottom: 10 }}>
              ESTIMATED STREET VALUE
            </div>
            <div style={{
              fontFamily: "'Bebas Neue'", fontSize: 'clamp(3rem,10vw,5.5rem)',
              color: B.amber, lineHeight: 1,
              textShadow: `0 0 40px ${B.amber}80, 0 0 80px ${B.amber}40`,
              marginBottom: 6,
            }}>
              {formatNaira(displayWorth)}
            </div>
            <div className="card-3d" style={{
              display: 'inline-block', background: `${B.neonLime}12`, border: `1px solid ${B.neonLime}40`,
              borderRadius: 20, padding: '4px 14px', marginBottom: 20,
              fontFamily: "'Space Mono'", fontSize: '0.6rem', color: B.neonLime, letterSpacing: '0.08em',
            }}>
              TOP {pct}% OF LAGOS COLLECTORS
            </div>

            <div className="card-3d" style={{
              background: B.black, border: `1px solid ${archetypeColor}35`,
              borderLeft: `4px solid ${archetypeColor}`,
              borderRadius: 8, padding: '20px 24px', marginBottom: 8,
              animation: 'archetypeIn 0.5s 0.35s both',
            }}>
              <div style={{ fontFamily: "'Space Mono'", fontSize: '0.6rem', letterSpacing: '0.2em', color: B.smoke, marginBottom: 8 }}>
                YOUR COLLECTOR TYPE
              </div>
              <div style={{ fontFamily: "'Bebas Neue'", fontSize: '1.8rem', letterSpacing: '0.08em', color: archetypeColor, marginBottom: 8 }}>
                {archetype}
              </div>
              <div style={{ fontFamily: "'Syne'", fontSize: '0.82rem', color: B.smoke, lineHeight: 1.55 }}>
                {archetypeDesc}
              </div>
            </div>

            <div style={{ fontFamily: "'Space Mono'", fontSize: '0.53rem', color: B.dim, marginBottom: 28 }}>
              +{XP_VALUES.quickTask} XP EARNED · approximate street value based on your answers
            </div>

            <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
              <button
                onClick={shareResult}
                style={{
                  background: B.amber, color: B.black, border: 'none', padding: '12px 32px',
                  fontFamily: "'Bebas Neue'", fontSize: '1.2rem', letterSpacing: '0.1em',
                  cursor: 'pointer', borderRadius: 4,
                }}
              >
                {copied ? '✓ COPIED!' : 'SHARE RESULT'}
              </button>
              <button
                onClick={reset}
                style={{
                  background: 'transparent', border: `1px solid ${B.gunmetal}`,
                  color: B.smoke, padding: '12px 32px',
                  fontFamily: "'Bebas Neue'", fontSize: '1.2rem', letterSpacing: '0.1em',
                  cursor: 'pointer', borderRadius: 4,
                }}
              >
                RETAKE
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
