import { useState, useEffect, useRef } from 'react'
import { B } from '../tokens'
import { GrainOverlay, ScanLines, SectionTag } from '../components/Shared'
import { addXP, XP_VALUES, triviaStreakMultiplier } from '../lib/passport'
import Egg from '../components/Egg'

const QUESTIONS = [
  {
    q: 'Which Nike shoe was Michael Jordan banned from wearing during his first NBA season?',
    options: ['Air Jordan 1', 'Air Force 1', 'Air Jordan 3', 'Nike Dunk'],
    a: 0,
  },
  {
    q: 'What does "DS" mean in sneaker culture?',
    options: ['Direct Sale', 'Designer Special', 'Double Sole', 'Deadstock'],
    a: 3,
  },
  {
    q: 'Which brand invented the "Boost" foam sole technology?',
    options: ['Nike', 'New Balance', 'Adidas', 'Puma'],
    a: 2,
  },
  {
    q: 'What year was the original Air Jordan 1 first released?',
    options: ['1982', '1985', '1988', '1991'],
    a: 1,
  },
  {
    q: 'The Nike Air Max 1 visible air unit was designed by which legend?',
    options: ['Bill Bowerman', 'Mark Parker', 'Steven Smith', 'Tinker Hatfield'],
    a: 3,
  },
  {
    q: 'Which hip-hop artist had the first non-athlete Nike signature sneaker?',
    options: ['Jay-Z', 'Drake', 'Kanye West', 'Travis Scott'],
    a: 2,
  },
  {
    q: 'What does "GR" stand for in sneaker terminology?',
    options: ['Gold Retail', 'General Release', 'Group Run', 'Grade Release'],
    a: 1,
  },
  {
    q: 'The iconic Adidas Superstar was first released in which year?',
    options: ['1975', '1983', '1969', '1991'],
    a: 2,
  },
  {
    q: 'Which colorway is generally considered the "Holy Grail" Air Jordan 1?',
    options: ['Royal Blue', 'Bred', 'Shadow', 'Chicago'],
    a: 3,
  },
  {
    q: 'A shoe with original box, never worn, never tried on is called what?',
    options: ['Quickstrike', 'Deadstock', 'Player Exclusive', 'Factory Error'],
    a: 1,
  },
]

const getMultiplier = triviaStreakMultiplier
const BASE_PTS = XP_VALUES.triviaPerCorrect

const TIMER_MAX = 25
const MAX_LIVES = 3

export default function SneakerTrivia() {
  const [phase,     setPhase]     = useState('intro')
  const [current,   setCurrent]   = useState(0)
  const [lives,     setLives]     = useState(MAX_LIVES)
  const [score,     setScore]     = useState(0)
  const [points,    setPoints]    = useState(0)
  const [streak,    setStreak]    = useState(0)
  const [maxStreak, setMaxStreak] = useState(0)
  const [timer,     setTimer]     = useState(TIMER_MAX)
  const [chosen,    setChosen]    = useState(null)
  const [feedback,  setFeedback]  = useState(null)
  const timerRef = useRef(null)
  const lockedRef = useRef(false)

  useEffect(() => {
    if (phase !== 'playing') return
    lockedRef.current = false
    setTimer(TIMER_MAX)
    timerRef.current = setInterval(() => {
      setTimer(t => {
        if (t <= 1) {
          clearInterval(timerRef.current)
          handleTimeout()
          return TIMER_MAX
        }
        return t - 1
      })
    }, 1000)
    return () => clearInterval(timerRef.current)
  }, [phase, current])

  useEffect(() => {
    if (phase === 'result' && points > 0) {
      addXP(points, 'Sneaker Trivia', score >= 7 ? 'trivia-ace' : undefined)
    }
  }, [phase])

  function handleTimeout() {
    if (lockedRef.current) return
    lockedRef.current = true
    setChosen(-1)
    setFeedback('timeout')
    setStreak(0)
    setLives(l => {
      const next = l - 1
      scheduleNext(next, current)
      return next
    })
  }

  function handleAnswer(idx) {
    if (lockedRef.current) return
    lockedRef.current = true
    clearInterval(timerRef.current)
    setChosen(idx)
    const correct = idx === QUESTIONS[current].a
    setFeedback(correct ? 'correct' : 'wrong')
    if (correct) {
      const newStreak = streak + 1
      const mult = getMultiplier(newStreak)
      setScore(s => s + 1)
      setStreak(newStreak)
      setMaxStreak(m => Math.max(m, newStreak))
      setPoints(p => p + BASE_PTS * mult)
      scheduleNext(lives, current)
    } else {
      setStreak(0)
      setLives(l => {
        const next = l - 1
        scheduleNext(next, current)
        return next
      })
    }
  }

  function scheduleNext(livesAfter, questionIdx) {
    setTimeout(() => {
      if (livesAfter <= 0 || questionIdx >= QUESTIONS.length - 1) {
        setPhase('result')
      } else {
        setCurrent(c => c + 1)
        setChosen(null)
        setFeedback(null)
      }
    }, 1200)
  }

  function restart() {
    lockedRef.current = false
    setCurrent(0)
    setLives(MAX_LIVES)
    setScore(0)
    setPoints(0)
    setStreak(0)
    setMaxStreak(0)
    setChosen(null)
    setFeedback(null)
    setPhase('intro')
    setTimeout(() => setPhase('playing'), 50)
  }

  const pct = (timer / TIMER_MAX) * 100
  const timerColor = timer > 10 ? B.neonCyan : timer > 5 ? B.amber : B.neonMagenta

  const getRank = s =>
    s >= 9 ? { title: 'SOLE SCHOLAR', color: B.amberGlow } :
    s >= 7 ? { title: 'HEAD NERD',    color: B.amber } :
    s >= 5 ? { title: 'CULTURE KID',  color: B.neonCyan } :
             { title: 'KEEP STUDYING', color: B.neonMagenta }

  const rank = getRank(score)

  return (
    <section id="trivia" style={{ background: B.void, padding: '80px 20px', position: 'relative', overflow: 'hidden' }}>
      <GrainOverlay />
      <Egg id="egg-037" corner="top-right" />
      <Egg id="egg-038" corner="bottom-left" />
      <ScanLines />
      <div style={{ maxWidth: 680, margin: '0 auto' }}>
        <SectionTag>SNEAKER TRIVIA</SectionTag>
        <h2 style={{ fontFamily: "'Bebas Neue'", fontSize: 'clamp(2.5rem,6vw,4rem)', color: B.white, letterSpacing: '0.05em', marginBottom: 8 }}>
          TEST YOUR SOLE KNOWLEDGE
        </h2>
        <p style={{ color: B.smoke, fontFamily: "'Space Mono'", fontSize: '0.8rem', marginBottom: 40 }}>
          10 questions / 3 lives / 25 seconds each
        </p>

        {phase === 'intro' && (
          <div style={{ textAlign: 'center', padding: '40px 0' }}>
            <div style={{ fontSize: '5rem', marginBottom: 24 }}>👟</div>
            <p style={{ color: B.white, fontFamily: "'Syne'", fontSize: '1.1rem', marginBottom: 32, lineHeight: 1.7 }}>
              Think you know sneakers? Prove it.<br />
              3 lives. Clock is ticking. No looking it up.
            </p>
            <button
              onClick={() => setPhase('playing')}
              style={{
                background: B.amber, color: B.black, border: 'none', padding: '14px 40px',
                fontFamily: "'Bebas Neue'", fontSize: '1.4rem', letterSpacing: '0.1em',
                cursor: 'pointer', borderRadius: 4,
                boxShadow: `0 0 24px ${B.amber}80`,
              }}
            >
              START THE QUIZ
            </button>
          </div>
        )}

        {phase === 'playing' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <div style={{ display: 'flex', gap: 6 }}>
                {Array.from({ length: MAX_LIVES }).map((_, i) => (
                  <span key={i} style={{ fontSize: '1.3rem', filter: i < lives ? 'none' : 'grayscale(1) opacity(0.3)' }}>❤️</span>
                ))}
              </div>
              {streak > 1 && (
                <div style={{ display:'flex', alignItems:'center', gap:4, padding:'4px 10px', background:`${B.amber}20`, border:`1px solid ${B.amber}40`, borderRadius:20 }}>
                  <span style={{ fontSize:12 }}>🔥</span>
                  <span style={{ fontFamily:"'Orbitron',monospace", fontSize:8, color:B.amber, fontWeight:700 }}>{streak}x STREAK {getMultiplier(streak)}x PTS</span>
                </div>
              )}
              <div style={{ textAlign:'right' }}>
                <div style={{ fontFamily:"'Orbitron',monospace", fontSize:16, color:B.neonCyan, fontWeight:900 }}>{points}</div>
                <div style={{ fontFamily:"'Space Mono',monospace", fontSize:7, color:'#555', letterSpacing:1 }}>{current + 1}/{QUESTIONS.length}</div>
              </div>
            </div>

            <div style={{ height: 4, background: B.charcoal, borderRadius: 2, marginBottom: 6, overflow: 'hidden' }}>
              <div style={{
                height: '100%', width: `${pct}%`, background: timerColor,
                transition: 'width 1s linear, background 0.3s',
                boxShadow: `0 0 8px ${timerColor}`,
              }} />
            </div>
            <div style={{ textAlign: 'right', marginBottom: 24 }}>
              <span style={{ fontFamily: "'Orbitron'", fontSize: '0.7rem', color: timerColor }}>{timer}s</span>
            </div>

            <div style={{
              background: B.charcoal, borderRadius: 8, padding: '24px 28px', marginBottom: 20,
              border: `1px solid ${B.gunmetal}`, borderLeft: `3px solid ${B.amber}`,
            }}>
              <p style={{ color: B.white, fontFamily: "'Syne'", fontSize: '1.05rem', lineHeight: 1.65 }}>
                {QUESTIONS[current].q}
              </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              {QUESTIONS[current].options.map((opt, i) => {
                const isCorrect = i === QUESTIONS[current].a
                const isChosen = i === chosen
                let bg = B.charcoal
                let borderColor = B.gunmetal
                let color = B.white
                if (chosen !== null) {
                  if (isCorrect) { bg = `${B.neonCyan}15`; borderColor = B.neonCyan; color = B.neonCyan }
                  if (isChosen && !isCorrect) { bg = `${B.neonMagenta}15`; borderColor = B.neonMagenta; color = B.neonMagenta }
                }
                return (
                  <button
                    key={i}
                    disabled={chosen !== null}
                    onClick={() => handleAnswer(i)}
                    style={{
                      background: bg, border: `1px solid ${borderColor}`, color, borderRadius: 6,
                      padding: '14px 16px', fontFamily: "'Syne'", fontSize: '0.9rem',
                      cursor: chosen !== null ? 'default' : 'pointer', textAlign: 'left', transition: 'all 0.2s',
                    }}
                    onMouseEnter={e => { if (!chosen) e.currentTarget.style.borderColor = B.amber }}
                    onMouseLeave={e => { if (!chosen) e.currentTarget.style.borderColor = B.gunmetal }}
                  >
                    {opt}
                  </button>
                )
              })}
            </div>

            {feedback && (
              <div style={{
                marginTop: 16, textAlign: 'center', fontFamily: "'Bebas Neue'",
                fontSize: '1.5rem', letterSpacing: '0.1em',
                color: feedback === 'correct' ? B.neonCyan : B.neonMagenta,
                animation: 'fadeUp 0.3s ease',
              }}>
                {feedback === 'correct'
                  ? '✓ +' + (BASE_PTS * getMultiplier(streak)) + ' PTS' + (getMultiplier(streak) > 1 ? ' - ' + getMultiplier(streak) + 'x STREAK' : '')
                  : feedback === 'timeout' ? "⏱ TIME'S UP!" : '✗ WRONG!'}
              </div>
            )}
          </div>
        )}

        {phase === 'result' && (
          <div style={{ textAlign: 'center', padding: '20px 0' }}>
            <div style={{ fontSize: '4rem', marginBottom: 12 }}>
              {score >= 7 ? '🏆' : score >= 5 ? '👟' : '💀'}
            </div>
            <div style={{ fontFamily:"'Orbitron',monospace", fontSize: '0.65rem', letterSpacing: '0.2em', color: rank.color, marginBottom: 6 }}>
              {rank.title}
            </div>

            <div style={{ background:'rgba(255,255,255,0.03)', border:`1px solid ${rank.color}30`, borderRadius:12, padding:'20px 24px', marginBottom:20, textAlign:'left' }}>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:16, marginBottom: maxStreak > 0 ? 14 : 0 }}>
                <div>
                  <div style={{ fontFamily:"'Space Mono',monospace", fontSize:7, color:'#444', letterSpacing:2, marginBottom:4 }}>TOTAL POINTS</div>
                  <div style={{ fontFamily:"'Orbitron',monospace", fontSize:28, color:rank.color, fontWeight:900, lineHeight:1 }}>{points}</div>
                </div>
                <div>
                  <div style={{ fontFamily:"'Space Mono',monospace", fontSize:7, color:'#444', letterSpacing:2, marginBottom:4 }}>CORRECT</div>
                  <div style={{ fontFamily:"'Orbitron',monospace", fontSize:28, color:B.white, fontWeight:900, lineHeight:1 }}>{score}/{QUESTIONS.length}</div>
                </div>
              </div>
              {maxStreak > 0 && (
                <div style={{ display:'flex', alignItems:'center', gap:10, padding:'10px 14px', background:`${B.amber}10`, border:`1px solid ${B.amber}20`, borderRadius:8 }}>
                  <span style={{ fontSize:18 }}>🔥</span>
                  <div>
                    <div style={{ fontFamily:"'Orbitron',monospace", fontSize:10, color:B.amber, fontWeight:700 }}>BEST STREAK: {maxStreak}</div>
                    <div style={{ fontFamily:"'Space Mono',monospace", fontSize:7, color:'#555' }}>{maxStreak >= 5 ? '3x BONUS UNLOCKED' : maxStreak >= 3 ? '2x BONUS UNLOCKED' : 'STREAK 3+ UNLOCKS BONUS POINTS'}</div>
                  </div>
                </div>
              )}
            </div>

            <p style={{ color: B.smoke, fontFamily: "'Space Mono'", fontSize: '0.75rem', marginBottom: 24 }}>
              {lives <= 0 ? 'Ran out of lives.' : 'All questions answered.'}
            </p>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
              <button onClick={restart} style={{ background: B.amber, color: B.black, border: 'none', padding: '12px 32px', fontFamily: "'Bebas Neue'", fontSize: '1.2rem', letterSpacing: '0.1em', cursor: 'pointer', borderRadius: 4 }}>
                PLAY AGAIN
              </button>
              <button
                onClick={() => {
                  const text = `👟 Sneakers Fest '26 Trivia\n\n${rank.title}\n${points} PTS - ${score}/${QUESTIONS.length} CORRECT${maxStreak >= 3 ? ` - 🔥 ${maxStreak}x STREAK` : ''}\n\nCan you beat me? sneakersfest.com`
                  if (navigator.share) navigator.share({ text, url: window.location.href })
                  else navigator.clipboard.writeText(text)
                }}
                style={{ background: 'transparent', color: B.neonCyan, border: `1px solid ${B.neonCyan}`, padding: '12px 32px', fontFamily: "'Bebas Neue'", fontSize: '1.2rem', letterSpacing: '0.1em', cursor: 'pointer', borderRadius: 4 }}
              >
                SHARE SCORE
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
