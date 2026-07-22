import { useState, useCallback } from 'react'
import { B } from '../tokens'
import { GrainOverlay, ScanLines, SectionTag } from '../components/Shared'
import { claudeChat, getApiKey } from '../lib/catalystAI'

const CATEGORIES = [
  { id: 'history',  label: 'HISTORY',       icon: '📖', desc: 'Jordan era, Nike origins, iconic moments' },
  { id: 'lagos',   label: 'LAGOS DROPS',    icon: '🇳🇬', desc: 'Nigerian market, local culture, SF26' },
  { id: 'culture', label: 'SNEAKER CULTURE',icon: '🔥', desc: 'Collabs, hype, resale, celebrities' },
  { id: 'tech',    label: 'TECH & DESIGN',  icon: '⚙️', desc: 'Air units, materials, silhouettes' },
]

const SYSTEM = `You are a sneaker trivia host for Sneakers Fest '26 Lagos. Generate one challenging multiple-choice trivia question.

Respond with ONLY this JSON — nothing else:
{
  "question": "The question text",
  "options": ["A) first option", "B) second option", "C) third option", "D) fourth option"],
  "correct": "A",
  "fact": "A fascinating follow-up fact (1-2 sentences, Lagos-relevant when possible)"
}

Make questions genuinely interesting — surprising history, contested facts, Lagos market insights. Perfect difficulty for a Lagos sneakerhead who follows the culture. Vary the correct answer — don't always make A correct.`

export default function AITrivia() {
  const [category, setCategory] = useState(null)
  const [question, setQuestion] = useState(null)
  const [selected, setSelected] = useState(null)
  const [loading, setLoading] = useState(false)
  const [score, setScore] = useState(0)
  const [streak, setStreak] = useState(0)
  const [total, setTotal] = useState(0)
  const [showFact, setShowFact] = useState(false)
  const [noKey, setNoKey] = useState(false)

  const loadQuestion = useCallback(async (cat) => {
    if (!getApiKey()) { setNoKey(true); return }
    setNoKey(false)
    setLoading(true)
    setQuestion(null)
    setSelected(null)
    setShowFact(false)
    try {
      const prompt = `Generate a ${cat.label} sneaker trivia question for Lagos sneakerheads at Sneakers Fest '26. Focus: ${cat.desc}`
      const raw = await claudeChat([{ role: 'user', content: prompt }], { model: 'balanced', system: SYSTEM, maxTokens: 400 })
      const match = raw.match(/\{[\s\S]*\}/)
      if (match) setQuestion(JSON.parse(match[0]))
    } catch {}
    setLoading(false)
  }, [])

  function pickCategory(cat) {
    setCategory(cat)
    loadQuestion(cat)
  }

  function answer(opt) {
    if (selected || !question) return
    setSelected(opt)
    setTotal(t => t + 1)
    setShowFact(true)
    if (opt[0] === question.correct) {
      setScore(s => s + 1)
      setStreak(s => s + 1)
    } else {
      setStreak(0)
    }
  }

  const isCorrect = selected && selected[0] === question?.correct

  return (
    <section id="ai-trivia" style={{ background: '#040404', padding: '80px 20px', position: 'relative', overflow: 'hidden' }}>
      <GrainOverlay />
      <ScanLines />
      <style>{`
        @keyframes atSlide { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:translateY(0)} }
        @keyframes atPop { 0%{transform:scale(0.97)} 60%{transform:scale(1.02)} 100%{transform:scale(1)} }
      `}</style>

      <div style={{ maxWidth: 640, margin: '0 auto' }}>
        <SectionTag>AI TRIVIA</SectionTag>
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12, marginBottom: 8 }}>
          <h2 style={{ fontFamily: "'Bebas Neue'", fontSize: 'clamp(2rem,5vw,3.5rem)', color: B.white, letterSpacing: '0.05em', margin: 0 }}>
            INFINITE SNEAKER TRIVIA
          </h2>
          {total > 0 && (
            <div style={{ display: 'flex', gap: 16 }}>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontFamily: "'Orbitron'", fontSize: 18, color: B.amber, fontWeight: 900 }}>{score}/{total}</div>
                <div style={{ fontFamily: "'Space Mono'", fontSize: 8, color: '#444', letterSpacing: '0.1em' }}>SCORE</div>
              </div>
              {streak > 1 && (
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontFamily: "'Orbitron'", fontSize: 18, color: B.neonLime, fontWeight: 900 }}>{streak} 🔥</div>
                  <div style={{ fontFamily: "'Space Mono'", fontSize: 8, color: '#444', letterSpacing: '0.1em' }}>STREAK</div>
                </div>
              )}
            </div>
          )}
        </div>
        <p style={{ color: B.smoke, fontFamily: "'Space Mono'", fontSize: '0.72rem', marginBottom: 32, letterSpacing: '0.04em' }}>
          Claude generates a fresh question every round · No two games the same
        </p>

        {noKey && (
          <div style={{ background: '#0d0d0d', border: `1px solid ${B.amber}44`, padding: 16, marginBottom: 24, fontFamily: "'Space Mono'", fontSize: 10, color: B.amber }}>
            ⚠ Add your Anthropic API key in the AI Chat widget to play infinite AI-generated trivia.
          </div>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 10, marginBottom: 28 }}>
          {CATEGORIES.map(cat => (
            <button key={cat.id} onClick={() => pickCategory(cat)} style={{ background: category?.id === cat.id ? `${B.amber}10` : '#0d0d0d', border: `1px solid ${category?.id === cat.id ? B.amber : '#1a1a1a'}`, padding: '14px 16px', cursor: 'pointer', textAlign: 'left', transition: 'all 0.15s' }}>
              <div style={{ fontSize: 20, marginBottom: 4 }}>{cat.icon}</div>
              <div style={{ fontFamily: "'Space Mono'", fontSize: 10, color: category?.id === cat.id ? B.amber : '#555', letterSpacing: '0.1em', fontWeight: 700 }}>{cat.label}</div>
              <div style={{ fontFamily: "'Space Mono'", fontSize: 8, color: '#333', marginTop: 2 }}>{cat.desc}</div>
            </button>
          ))}
        </div>

        {loading && (
          <div style={{ textAlign: 'center', padding: 40, fontFamily: "'Space Mono'", fontSize: 10, color: '#444', letterSpacing: '0.15em' }}>
            ⟳ CLAUDE IS GENERATING YOUR QUESTION...
          </div>
        )}

        {!loading && !category && (
          <div style={{ textAlign: 'center', padding: 40, fontFamily: "'Space Mono'", fontSize: 10, color: '#2a2a2a', letterSpacing: '0.15em' }}>
            SELECT A CATEGORY TO START
          </div>
        )}

        {question && !loading && (
          <div style={{ animation: 'atSlide 0.3s ease' }}>
            <div style={{ background: '#0a0a0a', border: '1px solid #1a1a1a', padding: '20px 24px', marginBottom: 14 }}>
              <div style={{ fontFamily: "'Space Mono'", fontSize: 8, color: '#333', letterSpacing: '0.2em', marginBottom: 12 }}>
                {category?.icon} {category?.label}
              </div>
              <div style={{ fontFamily: "'Space Mono'", fontSize: 13, color: B.white, lineHeight: 1.8 }}>{question.question}</div>
            </div>

            <div style={{ display: 'grid', gap: 8, marginBottom: 16 }}>
              {question.options.map(opt => {
                const letter = opt[0]
                const isRight = letter === question.correct
                let bg = '#0d0d0d', border = '#1a1a1a', color = '#666'
                if (selected) {
                  if (opt === selected && isRight)  { bg = '#052e16'; border = '#22c55e'; color = '#22c55e' }
                  else if (opt === selected)         { bg = '#2d0000'; border = '#ef4444'; color = '#ef4444' }
                  else if (isRight)                  { bg = '#052e1644'; border = '#22c55e44'; color = '#22c55e' }
                }
                return (
                  <button key={opt} onClick={() => answer(opt)} disabled={!!selected} style={{ textAlign: 'left', padding: '12px 16px', background: bg, border: `1px solid ${border}`, color, fontFamily: "'Space Mono'", fontSize: 10, letterSpacing: '0.05em', cursor: selected ? 'default' : 'pointer', transition: 'all 0.2s', lineHeight: 1.6 }}>
                    {opt}
                  </button>
                )
              })}
            </div>

            {showFact && (
              <div style={{ background: isCorrect ? '#052e1640' : '#0d0d0d', border: `1px solid ${isCorrect ? '#22c55e30' : '#1a1a1a'}`, padding: '14px 18px', marginBottom: 16, animation: 'atPop 0.25s ease' }}>
                <div style={{ fontFamily: "'Space Mono'", fontSize: 8, color: isCorrect ? '#22c55e' : '#ef4444', letterSpacing: '0.15em', marginBottom: 6 }}>
                  {isCorrect ? '✓ CORRECT' : `✗ WRONG — CORRECT ANSWER: ${question.correct}`}
                </div>
                <div style={{ fontFamily: "'Space Mono'", fontSize: 10, color: B.smoke, lineHeight: 1.7 }}>💡 {question.fact}</div>
              </div>
            )}

            {selected && (
              <button onClick={() => loadQuestion(category)} style={{ width: '100%', padding: '13px', background: B.amber, color: B.black, border: 'none', fontFamily: "'Space Mono'", fontSize: 10, letterSpacing: '0.2em', fontWeight: 700, cursor: 'pointer' }}>
                NEXT QUESTION →
              </button>
            )}
          </div>
        )}
      </div>
    </section>
  )
}
