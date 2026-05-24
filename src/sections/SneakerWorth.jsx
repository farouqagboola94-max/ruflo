import { useState } from 'react'
import { B } from '../tokens'
import { GrainOverlay, ScanLines, SectionTag } from '../components/Shared'

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
    multiplier: [1, 1, 1, 1],
    baseValue: 1,
  },
]

export default function SneakerWorth() {
  const [answers, setAnswers] = useState([])
  const [phase, setPhase] = useState('quiz') // quiz | result
  const [copied, setCopied] = useState(false)

  const current = answers.length
  const q = QUESTIONS[current]

  function answer(idx) {
    const next = [...answers, idx]
    setAnswers(next)
    if (next.length === QUESTIONS.length) setPhase('result')
  }

  function reset() {
    setAnswers([])
    setPhase('quiz')
  }

  function calcWorth() {
    const q0mult = QUESTIONS[0].multiplier[answers[0]]
    const q1mult = QUESTIONS[1].multiplier[answers[1]]
    const q2mult = QUESTIONS[2].multiplier[answers[2]]
    const raw = (q0mult * QUESTIONS[0].baseValue) + (q1mult * QUESTIONS[1].baseValue)
    const total = Math.round(raw * q2mult / 1000) * 1000
    return total
  }

  const worth = phase === 'result' ? calcWorth() : 0
  const archetype = phase === 'result' ? QUESTIONS[3].archetype[answers[3]] : ''
  const archetypeColor = phase === 'result' ? QUESTIONS[3].archetypeColor[answers[3]] : B.amber

  function formatNaira(n) {
    if (n >= 1000000) return `₦${(n / 1000000).toFixed(1)}M`
    return `₦${n.toLocaleString()}`
  }

  function shareResult() {
    const text = `My sneaker collection is worth ${formatNaira(worth)} (street value). I am "${archetype}" — see you at Sneakers Fest '26, Dec 12 Lagos! 👟`
    if (navigator.share) navigator.share({ text, url: window.location.href })
    else { navigator.clipboard.writeText(text); setCopied(true); setTimeout(() => setCopied(false), 2000) }
  }

  return (
    <section id="worth" style={{ background: B.charcoal, padding: '80px 20px', position: 'relative', overflow: 'hidden' }}>
      <GrainOverlay /><ScanLines />
      <div style={{ maxWidth: 620, margin: '0 auto' }}>
        <SectionTag>COLLECTION CALCULATOR</SectionTag>
        <h2 style={{ fontFamily: "'Bebas Neue'", fontSize: 'clamp(2.5rem,6vw,4rem)', color: B.white, letterSpacing: '0.05em', marginBottom: 8 }}>
          WHAT IS YOUR COLLECTION WORTH?
        </h2>
        <p style={{ color: B.smoke, fontFamily: "'Space Mono'", fontSize: '0.78rem', marginBottom: 40 }}>
          4 questions · instant street value estimate
        </p>

        {phase === 'quiz' && (
          <div>
            {/* Progress */}
            <div style={{ display: 'flex', gap: 6, marginBottom: 28 }}>
              {QUESTIONS.map((_, i) => (
                <div key={i} style={{
                  flex: 1, height: 3, borderRadius: 2,
                  background: i < current ? B.amber : B.gunmetal,
                  transition: 'background 0.3s',
                }} />
              ))}
            </div>

            <div style={{
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
                  onMouseEnter={e => { e.currentTarget.style.borderColor = B.amber; e.currentTarget.style.background = `${B.amber}10` }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = B.gunmetal; e.currentTarget.style.background = B.black }}
                >
                  {opt}
                </button>
              ))}
            </div>

            <p style={{ color: B.smoke, fontFamily: "'Space Mono'", fontSize: '0.65rem', marginTop: 20 }}>
              Question {current + 1} of {QUESTIONS.length}
            </p>
          </div>
        )}

        {phase === 'result' && (
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontFamily: "'Orbitron'", fontSize: '0.6rem', letterSpacing: '0.25em', color: B.smoke, marginBottom: 16 }}>
              ESTIMATED STREET VALUE
            </div>
            <div style={{
              fontFamily: "'Bebas Neue'", fontSize: 'clamp(3rem,10vw,5.5rem)',
              color: B.amber, lineHeight: 1,
              textShadow: `0 0 40px ${B.amber}80`,
              marginBottom: 8,
            }}>
              {formatNaira(worth)}
            </div>
            <div style={{ color: B.smoke, fontFamily: "'Space Mono'", fontSize: '0.68rem', marginBottom: 32 }}>
              based on your answers (approximate street value)
            </div>

            <div style={{
              background: B.black, border: `1px solid ${archetypeColor}40`,
              borderRadius: 8, padding: '20px 28px', marginBottom: 36, display: 'inline-block',
            }}>
              <div style={{ fontFamily: "'Space Mono'", fontSize: '0.6rem', letterSpacing: '0.2em', color: B.smoke, marginBottom: 8 }}>YOUR COLLECTOR TYPE</div>
              <div style={{ fontFamily: "'Bebas Neue'", fontSize: '1.8rem', letterSpacing: '0.08em', color: archetypeColor }}>
                {archetype}
              </div>
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
