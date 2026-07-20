import { useState, useEffect, useRef, useCallback } from 'react'
import { B } from '../tokens'
import { GrainOverlay, ScanLines, SectionTag } from '../components/Shared'
import { addXP, XP_VALUES, triviaStreakMultiplier } from '../lib/passport'
import Egg from '../components/Egg'

const ALL_QUESTIONS = [
  { q: 'Which Nike shoe was Michael Jordan banned from wearing during his first NBA season?', options: ['Air Jordan 1', 'Air Force 1', 'Air Jordan 3', 'Nike Dunk'], a: 0 },
  { q: 'What does "DS" mean in sneaker culture?', options: ['Direct Sale', 'Designer Special', 'Double Sole', 'Deadstock'], a: 3 },
  { q: 'Which brand invented the "Boost" foam sole technology?', options: ['Nike', 'New Balance', 'Adidas', 'Puma'], a: 2 },
  { q: 'What year was the original Air Jordan 1 first released?', options: ['1982', '1985', '1988', '1991'], a: 1 },
  { q: 'The Nike Air Max 1 visible air unit was designed by which legend?', options: ['Bill Bowerman', 'Mark Parker', 'Steven Smith', 'Tinker Hatfield'], a: 3 },
  { q: 'Which hip-hop artist had the first non-athlete Nike signature sneaker?', options: ['Jay-Z', 'Drake', 'Kanye West', 'Travis Scott'], a: 2 },
  { q: 'What does "GR" stand for in sneaker terminology?', options: ['Gold Retail', 'General Release', 'Group Run', 'Grade Release'], a: 1 },
  { q: 'The iconic Adidas Superstar was first released in which year?', options: ['1975', '1983', '1969', '1991'], a: 2 },
  { q: 'Which colorway is the "Holy Grail" Air Jordan 1?', options: ['Royal Blue', 'Bred', 'Shadow', 'Chicago'], a: 3 },
  { q: 'A shoe never worn, with original box is called what?', options: ['Quickstrike', 'Deadstock', 'Player Exclusive', 'Factory Error'], a: 1 },
  { q: 'Which sneaker introduced the first Air cushioning unit?', options: ['Air Force 1', 'Air Max 1', 'Tailwind 79', 'Air Jordan 1'], a: 2 },
  { q: 'What does "PE" stand for in sneaker collecting?', options: ['Premium Edition', 'Player Exclusive', 'Private Edition', 'Pre-release Event'], a: 1 },
  { q: 'The Nike Air Force 1 was named after which aircraft?', options: ['Air Force One (presidential plane)', 'F-1 fighter jet', 'B-52 bomber', 'Concorde'], a: 0 },
  { q: 'Which brand makes the Ultraboost running shoe?', options: ['Nike', 'Puma', 'Adidas', 'Reebok'], a: 2 },
  { q: 'What does "collab" mean in sneaker culture?', options: ['A colorway', 'A collaboration between brands or artists', 'A collector\'s club', 'A resale platform'], a: 1 },
  { q: 'The Converse Chuck Taylor All-Star was originally designed for which sport?', options: ['Tennis', 'Baseball', 'Basketball', 'Volleyball'], a: 2 },
  { q: 'What is "hypebeast" in sneaker culture?', options: ['A sneaker authentication app', 'Someone who buys trends regardless of personal style', 'A rare limited edition', 'A Lagos sneaker market'], a: 1 },
  { q: 'Which Nigerian rapper is famous for his sneaker collection?', options: ['Burna Boy', 'Wizkid', 'Olamide', 'Falz'], a: 0 },
  { q: 'What does "OG" mean for sneakers?', options: ['Only Gold', 'Original Gangster', 'Original colorway from first release', 'Online Genuine'], a: 2 },
  { q: 'Which West African city is known as a major sneaker resale market?', options: ['Accra', 'Lagos', 'Abidjan', 'Dakar'], a: 1 },
  { q: 'The Yeezy line was a collaboration between Kanye West and which brand?', options: ['Nike', 'Puma', 'Adidas', 'New Balance'], a: 2 },
  { q: 'What is a "cop" in sneaker slang?', options: ['Selling a sneaker', 'Buying/acquiring a sneaker', 'Authenticating a sneaker', 'Cleaning a sneaker'], a: 1 },
  { q: 'Which sneaker has the "3M" reflective material as a popular feature?', options: ['Nike Cortez', 'Reebok Classic', 'New Balance 990', 'Nike Air Max 95'], a: 3 },
  { q: 'What does "fakes" or "reps" mean in sneaker culture?', options: ['Fake / counterfeit sneakers', 'Repeat colorways', 'Retail price sneakers', 'Representative stockists'], a: 0 },
  { q: 'Which Michael Jordan number retired jersey inspired the "23" Air Jordan line?', options: ['6', '23', '45', '9'], a: 1 },
  { q: 'Sole Supplier, SNKRS and Confirmed are all what type of platform?', options: ['Sneaker cleaning services', 'Sneaker release/raffle apps', 'Sneaker museums', 'Sneaker production factories'], a: 1 },
  { q: 'What material is commonly used for premium Air Jordan midsoles?', options: ['EVA foam', 'Phylon', 'Air Zoom units', 'Polyurethane'], a: 1 },
  { q: 'Which Lagos district is the most iconic for sneaker shopping?', options: ['Ikeja', 'Lekki', 'Yaba', 'Victoria Island'], a: 2 },
  { q: 'A "heat" sneaker is typically described as what?', options: ['A warm-weather silhouette', 'A highly desired, rare, exclusive sneaker', 'A shoe with breathable mesh', 'A discounted clearance shoe'], a: 1 },
  { q: 'Which rapper\'s Air Jordan 4 "Cactus Jack" collab resells for the most?', options: ['Drake', 'J. Cole', 'Travis Scott', 'Kendrick Lamar'], a: 2 },
]

function shuffle(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

const TODAY = () => new Date().toISOString().slice(0, 10)
const DAILY_KEY = 'sf26_trivia_daily'
const TAUNTS = [
  "That's embarrassing. You sure you're at the right event?",
  "A true sneakerhead would've got that. Study up.",
  "Your sneaker IQ just took damage.",
  "Even my grandma knows that one.",
  "The culture demands better from you.",
  "Wrong. Your sneaker card is under review.",
  "That answer should be illegal in Lagos.",
  "Sole Knowledge: Level 0. For now.",
]
const PRAISES = [
  "That's elite knowledge right there.",
  "The culture recognizes you.",
  "Clean. You belong here.",
  "Don't let it go to your head. Keep it moving.",
  "Sole Scholar confirmed.",
  "You might actually be built for this movement.",
  "That's the answer of someone who eats, sleeps, sneakers.",
]

function getTaunt() { return TAUNTS[Math.floor(Math.random() * TAUNTS.length)] }
function getPraise() { return PRAISES[Math.floor(Math.random() * PRAISES.length)] }

const getMultiplier = triviaStreakMultiplier
const BASE_PTS = XP_VALUES.triviaPerCorrect
const TIMER_MAX = 25
const MAX_LIVES = 3
const Q_PER_GAME = 10

export default function SneakerTrivia() {
  const [phase,      setPhase]      = useState('intro')
  const [questions,  setQuestions]  = useState([])
  const [current,    setCurrent]    = useState(0)
  const [lives,      setLives]      = useState(MAX_LIVES)
  const [score,      setScore]      = useState(0)
  const [points,     setPoints]     = useState(0)
  const [streak,     setStreak]     = useState(0)
  const [maxStreak,  setMaxStreak]  = useState(0)
  const [timer,      setTimer]      = useState(TIMER_MAX)
  const [chosen,     setChosen]     = useState(null)
  const [feedback,   setFeedback]   = useState(null)
  const [commentary, setCommentary] = useState('')
  const [flawless,   setFlawless]   = useState(true)
  const [isDaily,    setIsDaily]    = useState(false)
  const [dailyDone,  setDailyDone]  = useState(false)
  const [confetti,   setConfetti]   = useState([])
  const timerRef  = useRef(null)
  const lockedRef = useRef(false)

  useEffect(() => {
    const d = JSON.parse(localStorage.getItem(DAILY_KEY) || '{}')
    if (d.date === TODAY()) setDailyDone(true)
  }, [])

  function pickQuestions(daily) {
    if (daily) {
      const seed = TODAY().replace(/-/g, '')
      const offset = parseInt(seed.slice(-2)) % (ALL_QUESTIONS.length - 5)
      return ALL_QUESTIONS.slice(offset, offset + 5)
    }
    return shuffle(ALL_QUESTIONS).slice(0, Q_PER_GAME)
  }

  function startGame(daily = false) {
    const qs = pickQuestions(daily)
    setQuestions(qs)
    setIsDaily(daily)
    lockedRef.current = false
    setCurrent(0); setLives(MAX_LIVES); setScore(0)
    setPoints(0); setStreak(0); setMaxStreak(0)
    setChosen(null); setFeedback(null); setCommentary('')
    setFlawless(true)
    setTimeout(() => setPhase('playing'), 50)
  }

  useEffect(() => {
    if (phase !== 'playing') return
    lockedRef.current = false
    setTimer(TIMER_MAX)
    timerRef.current = setInterval(() => {
      setTimer(t => {
        if (t <= 1) { clearInterval(timerRef.current); handleTimeout(); return TIMER_MAX }
        return t - 1
      })
    }, 1000)
    return () => clearInterval(timerRef.current)
  }, [phase, current])

  useEffect(() => {
    if (phase === 'result') {
      if (points > 0) addXP(points, 'Sneaker Trivia', score >= questions.length ? 'trivia-flawless' : score >= 7 ? 'trivia-ace' : undefined)
      if (flawless && score === questions.length) {
        const COLORS = [B.amber, B.neonCyan, B.neonMagenta, B.neonLime, '#fff', B.electricPurple]
        const pieces = Array.from({ length: 64 }, (_, i) => ({
          id: i, color: COLORS[i % COLORS.length],
          left: Math.random() * 100, delay: Math.random() * 0.8,
          dur: 1 + Math.random() * 0.8, size: 5 + Math.random() * 8,
          spin: Math.random() > 0.5 ? 1 : -1, shape: i % 3 === 0 ? 'circle' : 'rect',
        }))
        setConfetti(pieces)
        setTimeout(() => setConfetti([]), 3200)
      }
      if (isDaily) localStorage.setItem(DAILY_KEY, JSON.stringify({ date: TODAY(), score }))
    }
  }, [phase])

  const handleTimeout = useCallback(() => {
    if (lockedRef.current) return
    lockedRef.current = true
    setChosen(-1); setFeedback('timeout'); setCommentary(getTaunt())
    setFlawless(false); setStreak(0)
    setLives(l => {
      const next = l - 1
      scheduleNext(next, current)
      return next
    })
  }, [current])

  function handleAnswer(idx) {
    if (lockedRef.current) return
    lockedRef.current = true
    clearInterval(timerRef.current)
    setChosen(idx)
    const correct = idx === questions[current].a
    if (correct) {
      const newStreak = streak + 1
      const mult = getMultiplier(newStreak)
      setScore(s => s + 1)
      setStreak(newStreak)
      setMaxStreak(m => Math.max(m, newStreak))
      setPoints(p => p + BASE_PTS * mult)
      setFeedback('correct'); setCommentary(getPraise())
      scheduleNext(lives, current)
    } else {
      setFeedback('wrong'); setCommentary(getTaunt())
      setFlawless(false); setStreak(0)
      setLives(l => {
        const next = l - 1
        scheduleNext(next, current)
        return next
      })
    }
  }

  function scheduleNext(livesAfter, questionIdx) {
    setTimeout(() => {
      if (livesAfter <= 0 || questionIdx >= questions.length - 1) {
        setPhase('result')
      } else {
        setCurrent(c => c + 1); setChosen(null); setFeedback(null); setCommentary('')
      }
    }, 1500)
  }

  function restart() { setPhase('intro') }

  const pct = (timer / TIMER_MAX) * 100
  const timerColor = timer > 10 ? B.neonCyan : timer > 5 ? B.amber : B.neonMagenta
  const timerPulse = timer <= 5

  const getRank = s => {
    const total = questions.length || Q_PER_GAME
    if (s === total) return { title: 'FLAWLESS VICTORY', color: B.amber, icon: '👑' }
    if (s >= total * 0.8) return { title: 'SOLE SCHOLAR', color: B.amberGlow, icon: '🏆' }
    if (s >= total * 0.6) return { title: 'HEAD NERD', color: B.neonCyan, icon: '🧠' }
    if (s >= total * 0.4) return { title: 'CULTURE KID', color: B.neonLime, icon: '👟' }
    return { title: 'KEEP STUDYING', color: B.neonMagenta, icon: '💀' }
  }

  const rank = getRank(score)
  const qLen = questions.length || Q_PER_GAME

  return (
    <section id="trivia" style={{ background: B.void, padding: '80px 20px', position: 'relative', overflow: 'hidden' }}>
      <GrainOverlay />
      <Egg id="egg-037" corner="top-right" />
      <Egg id="egg-038" corner="bottom-left" />
      <ScanLines />

      <style>{`
        @keyframes timerPulse { 0%,100%{opacity:1} 50%{opacity:0.4} }
        @keyframes feedbackPop { 0%{transform:scale(0.7) translateY(8px);opacity:0} 60%{transform:scale(1.08)} 100%{transform:scale(1);opacity:1} }
        @keyframes confettiDrop { 0%{transform:translateY(-10px) rotate(0deg);opacity:1} 100%{transform:translateY(110vh) rotate(720deg);opacity:0} }
      `}</style>

      {/* Confetti */}
      {confetti.map(p => (
        <div key={p.id} style={{
          position: 'fixed', top: 0, left: `${p.left}%`, zIndex: 9999,
          width: p.shape === 'circle' ? p.size : p.size * 1.6,
          height: p.size,
          borderRadius: p.shape === 'circle' ? '50%' : 2,
          background: p.color,
          animation: `confettiDrop ${p.dur}s ${p.delay}s ease-in forwards`,
          pointerEvents: 'none',
        }} />
      ))}

      <div style={{ maxWidth: 680, margin: '0 auto' }}>
        <SectionTag>SNEAKER TRIVIA</SectionTag>
        <h2 className="reveal-3d text-3d" style={{ fontFamily: "'Bebas Neue'", fontSize: 'clamp(2.5rem,6vw,4rem)', color: B.white, letterSpacing: '0.05em', marginBottom: 8 }}>
          TEST YOUR SOLE KNOWLEDGE
        </h2>
        <p style={{ color: B.smoke, fontFamily: "'Space Mono'", fontSize: '0.8rem', marginBottom: 40 }}>
          {isDaily ? '5 daily questions · resets at midnight' : `${qLen} questions · 3 lives · 25 seconds each`}
        </p>

        {/* ── INTRO ── */}
        {phase === 'intro' && (
          <div style={{ textAlign: 'center', padding: '20px 0' }}>
            <div style={{ fontSize: '5rem', marginBottom: 20 }}>👟</div>
            <p style={{ color: B.white, fontFamily: "'Syne'", fontSize: '1.1rem', marginBottom: 32, lineHeight: 1.7 }}>
              Think you know sneakers? Prove it.<br />
              3 lives. Clock ticking. No looking it up.
            </p>
            <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 24 }}>
              <button onClick={() => startGame(false)} style={{
                background: B.amber, color: B.black, border: 'none', padding: '14px 40px',
                fontFamily: "'Bebas Neue'", fontSize: '1.4rem', letterSpacing: '0.1em',
                cursor: 'pointer', borderRadius: 4, boxShadow: `0 0 24px ${B.amber}80`,
              }}>START TRIVIA</button>
              <button onClick={() => startGame(true)} disabled={dailyDone} style={{
                background: dailyDone ? 'transparent' : `${B.neonCyan}15`,
                color: dailyDone ? '#444' : B.neonCyan,
                border: `1px solid ${dailyDone ? '#333' : B.neonCyan}55`,
                padding: '14px 40px', fontFamily: "'Bebas Neue'", fontSize: '1.4rem',
                letterSpacing: '0.1em', cursor: dailyDone ? 'not-allowed' : 'pointer', borderRadius: 4,
              }}>
                {dailyDone ? 'DAILY DONE ✓' : 'DAILY CHALLENGE'}
              </button>
            </div>
            {!dailyDone && (
              <p style={{ color: B.smoke, fontFamily: "'Space Mono'", fontSize: '0.65rem', letterSpacing: 2 }}>
                5 EXCLUSIVE QUESTIONS · RESETS MIDNIGHT
              </p>
            )}
          </div>
        )}

        {/* ── PLAYING ── */}
        {phase === 'playing' && questions.length > 0 && (
          <div>
            {/* HUD */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <div style={{ display: 'flex', gap: 6 }}>
                {Array.from({ length: MAX_LIVES }).map((_, i) => (
                  <span key={i} style={{ fontSize: '1.3rem', filter: i < lives ? 'none' : 'grayscale(1) opacity(0.25)', transition: 'filter 0.3s' }}>❤️</span>
                ))}
              </div>
              {streak > 1 && (
                <div className="card-3d" style={{ padding: '4px 10px', background: `${B.amber}20`, border: `1px solid ${B.amber}40`, borderRadius: 20 }}>
                  <span style={{ fontFamily: "'Orbitron'", fontSize: 8, color: B.amber, fontWeight: 700 }}>🔥 {streak}x STREAK · {getMultiplier(streak)}x PTS</span>
                </div>
              )}
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontFamily: "'Orbitron'", fontSize: 16, color: B.neonCyan, fontWeight: 900 }}>{points}</div>
                <div style={{ fontFamily: "'Space Mono'", fontSize: 7, color: '#555', letterSpacing: 1 }}>{current + 1}/{qLen}</div>
              </div>
            </div>

            {/* Timer bar */}
            <div style={{ height: 4, background: B.charcoal, borderRadius: 2, marginBottom: 6, overflow: 'hidden' }}>
              <div style={{
                height: '100%', width: `${pct}%`, background: timerColor,
                transition: 'width 1s linear, background 0.3s',
                boxShadow: `0 0 8px ${timerColor}`,
                animation: timerPulse ? 'timerPulse 0.5s ease-in-out infinite' : 'none',
              }} />
            </div>
            <div style={{ textAlign: 'right', marginBottom: 20 }}>
              <span style={{
                fontFamily: "'Orbitron'", fontSize: '0.7rem', color: timerColor,
                animation: timerPulse ? 'timerPulse 0.5s ease-in-out infinite' : 'none',
              }}>{timer}s</span>
            </div>

            {/* Question */}
            <div className="card-3d" style={{
              background: B.charcoal, borderRadius: 8, padding: '24px 28px', marginBottom: 16,
              border: `1px solid ${B.gunmetal}`, borderLeft: `3px solid ${B.amber}`,
            }}>
              <p style={{ color: B.white, fontFamily: "'Syne'", fontSize: '1.05rem', lineHeight: 1.65 }}>
                {questions[current].q}
              </p>
            </div>

            {/* Options */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 16 }}>
              {questions[current].options.map((opt, i) => {
                const isCorrect = i === questions[current].a
                const isChosen  = i === chosen
                let bg = B.charcoal, borderColor = B.gunmetal, col = B.white
                if (chosen !== null) {
                  if (isCorrect)             { bg = `${B.neonCyan}15`;    borderColor = B.neonCyan;    col = B.neonCyan }
                  if (isChosen && !isCorrect){ bg = `${B.neonMagenta}15`; borderColor = B.neonMagenta; col = B.neonMagenta }
                }
                return (
                  <button key={i} disabled={chosen !== null} onClick={() => handleAnswer(i)} style={{
                    background: bg, border: `1px solid ${borderColor}`, color: col,
                    borderRadius: 6, padding: '14px 16px', fontFamily: "'Syne'", fontSize: '0.9rem',
                    cursor: chosen !== null ? 'default' : 'pointer', textAlign: 'left', transition: 'all 0.2s',
                  }}
                  onMouseEnter={e => { if (!chosen) e.currentTarget.style.borderColor = B.amber }}
                  onMouseLeave={e => { if (!chosen) e.currentTarget.style.borderColor = B.gunmetal }}
                  >{opt}</button>
                )
              })}
            </div>

            {/* Feedback + commentary */}
            {feedback && (
              <div style={{ animation: 'feedbackPop 0.35s ease' }}>
                <div style={{
                  textAlign: 'center', fontFamily: "'Bebas Neue'", fontSize: '1.5rem',
                  letterSpacing: '0.1em', marginBottom: 6,
                  color: feedback === 'correct' ? B.neonCyan : B.neonMagenta,
                }}>
                  {feedback === 'correct'
                    ? `✓ +${BASE_PTS * getMultiplier(streak)} PTS${getMultiplier(streak) > 1 ? ' · ' + getMultiplier(streak) + 'x STREAK' : ''}`
                    : feedback === 'timeout' ? "⏱ TOO SLOW!" : '✗ WRONG!'}
                </div>
                {commentary && (
                  <div style={{
                    textAlign: 'center', fontFamily: "'Space Mono'", fontSize: '0.7rem',
                    color: feedback === 'correct' ? `${B.neonCyan}cc` : `${B.neonMagenta}cc`,
                    fontStyle: 'italic', letterSpacing: 1,
                  }}>{commentary}</div>
                )}
              </div>
            )}
          </div>
        )}

        {/* ── RESULT ── */}
        {phase === 'result' && (
          <div style={{ textAlign: 'center', padding: '20px 0' }}>
            <div style={{ fontSize: '4.5rem', marginBottom: 8 }}>{rank.icon}</div>
            {flawless && score === qLen && (
              <div style={{
                fontFamily: "'Bebas Neue'", fontSize: '2.2rem', color: B.amber,
                letterSpacing: '0.12em', marginBottom: 8,
                textShadow: `0 0 30px ${B.amber}`,
                animation: 'timerPulse 1.5s ease-in-out infinite',
              }}>FLAWLESS VICTORY</div>
            )}
            <div style={{ fontFamily: "'Orbitron'", fontSize: '0.65rem', letterSpacing: '0.2em', color: rank.color, marginBottom: 6 }}>
              {rank.title}
            </div>

            <div className="card-3d" style={{ background: 'rgba(255,255,255,0.03)', border: `1px solid ${rank.color}30`, borderRadius: 12, padding: '20px 24px', marginBottom: 20, textAlign: 'left' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: maxStreak > 0 ? 14 : 0 }}>
                <div>
                  <div style={{ fontFamily: "'Space Mono'", fontSize: 7, color: '#444', letterSpacing: 2, marginBottom: 4 }}>TOTAL POINTS</div>
                  <div style={{ fontFamily: "'Orbitron'", fontSize: 28, color: rank.color, fontWeight: 900, lineHeight: 1 }}>{points}</div>
                </div>
                <div>
                  <div style={{ fontFamily: "'Space Mono'", fontSize: 7, color: '#444', letterSpacing: 2, marginBottom: 4 }}>CORRECT</div>
                  <div style={{ fontFamily: "'Orbitron'", fontSize: 28, color: B.white, fontWeight: 900, lineHeight: 1 }}>{score}/{qLen}</div>
                </div>
              </div>
              {maxStreak > 0 && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px', background: `${B.amber}10`, border: `1px solid ${B.amber}20`, borderRadius: 8 }}>
                  <span style={{ fontSize: 18 }}>🔥</span>
                  <div>
                    <div style={{ fontFamily: "'Orbitron'", fontSize: 10, color: B.amber, fontWeight: 700 }}>BEST STREAK: {maxStreak}x</div>
                    <div style={{ fontFamily: "'Space Mono'", fontSize: 7, color: '#555' }}>
                      {maxStreak >= 5 ? '3x BONUS UNLOCKED' : maxStreak >= 3 ? '2x BONUS UNLOCKED' : 'STREAK 3+ = BONUS POINTS'}
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
              <button onClick={restart} style={{
                background: B.amber, color: B.black, border: 'none', padding: '12px 32px',
                fontFamily: "'Bebas Neue'", fontSize: '1.2rem', letterSpacing: '0.1em', cursor: 'pointer', borderRadius: 4,
              }}>PLAY AGAIN</button>
              <button
                onClick={() => {
                  const text = `👟 Sneakers Fest '26 Trivia\n\n${rank.title}\n${points} PTS — ${score}/${qLen} CORRECT${flawless && score === qLen ? ' — FLAWLESS 👑' : ''}${maxStreak >= 3 ? ` — 🔥${maxStreak}x STREAK` : ''}\n\nCan you beat me? sneakersfest26.com`
                  if (navigator.share) navigator.share({ text, url: window.location.href }).catch(() => {})
                  else navigator.clipboard.writeText(text).catch(() => {})
                }}
                style={{ background: 'transparent', color: B.neonCyan, border: `1px solid ${B.neonCyan}55`, padding: '12px 32px', fontFamily: "'Bebas Neue'", fontSize: '1.2rem', letterSpacing: '0.1em', cursor: 'pointer', borderRadius: 4 }}
              >SHARE SCORE</button>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
