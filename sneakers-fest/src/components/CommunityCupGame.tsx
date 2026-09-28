'use client'

import { FormEvent, useEffect, useMemo, useState } from 'react'
import { NetlifyFormState, submitNetlifyForm } from '@/lib/netlifyForms'

const lanes = [0, 1, 2]

function nextObstacle(round: number) {
  return {
    lane: (round * 2 + 1) % lanes.length,
    distance: 100,
  }
}

export default function CommunityCupGame() {
  const [lane, setLane] = useState(1)
  const [running, setRunning] = useState(false)
  const [score, setScore] = useState(0)
  const [best, setBest] = useState(0)
  const [round, setRound] = useState(0)
  const [obstacle, setObstacle] = useState(nextObstacle(0))
  const [status, setStatus] = useState<'ready' | 'playing' | 'hit'>('ready')
  const [formState, setFormState] = useState<NetlifyFormState>('idle')
  const [form, setForm] = useState({ name: '', email: '', team: '', role: 'Player' })

  const speed = useMemo(() => Math.min(14 + Math.floor(score / 4), 26), [score])

  useEffect(() => {
    if (!running) return

    const timer = window.setInterval(() => {
      setObstacle(current => {
        const distance = current.distance - speed

        if (distance <= 10 && distance >= 0 && current.lane === lane) {
          setRunning(false)
          setStatus('hit')
          setBest(currentBest => Math.max(currentBest, score))
          return current
        }

        if (distance <= 0) {
          setScore(currentScore => currentScore + 1)
          const nextRound = round + 1
          setRound(nextRound)
          return nextObstacle(nextRound)
        }

        return { ...current, distance }
      })
    }, 180)

    return () => window.clearInterval(timer)
  }, [lane, round, running, score, speed])

  useEffect(() => {
    function handleKeydown(event: KeyboardEvent) {
      if (event.key === 'ArrowLeft') move(-1)
      if (event.key === 'ArrowRight') move(1)
      if ((event.key === 'Enter' || event.key === ' ') && !running) startGame()
    }

    window.addEventListener('keydown', handleKeydown)
    return () => window.removeEventListener('keydown', handleKeydown)
  })

  function startGame() {
    setLane(1)
    setScore(0)
    setRound(0)
    setObstacle(nextObstacle(0))
    setStatus('playing')
    setRunning(true)
  }

  function move(direction: -1 | 1) {
    if (!running) return
    setLane(current => Math.max(0, Math.min(2, current + direction)))
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setFormState('submitting')

    try {
      await submitNetlifyForm('community-cup-interest', form)
      setFormState('success')
      setForm({ name: '', email: '', team: '', role: 'Player' })
    } catch {
      setFormState('error')
    }
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
      <section className="rounded-2xl border border-white/10 bg-brand-gray p-5 sm:p-6">
        <div className="mb-5 flex items-center justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-brand-neon">Playable community test</p>
            <h2 className="mt-1 font-display text-3xl text-white">Lagos Lane Run</h2>
          </div>
          <div className="text-right text-sm text-gray-400">
            <p>Score <span className="font-bold text-white">{score}</span></p>
            <p>Best <span className="font-bold text-brand-amber">{best}</span></p>
          </div>
        </div>

        <div className="relative h-72 overflow-hidden rounded-2xl border border-white/10 bg-black">
          <div className="absolute inset-0 game-road" />
          <div className="absolute inset-x-0 bottom-0 top-0 grid grid-cols-3">
            {lanes.map(item => (
              <div key={item} className="border-x border-white/10" />
            ))}
          </div>

          <div
            className="absolute bottom-5 flex h-14 w-14 items-center justify-center rounded-2xl border border-brand-orange/40 bg-brand-orange text-lg font-black text-black shadow-lg shadow-orange-500/30 transition-all duration-150"
            style={{ left: `calc(${lane * 33.333}% + 16.666% - 28px)` }}
            aria-label="Player marker"
          >
            SF
          </div>

          <div
            className="absolute flex h-12 w-12 items-center justify-center rounded-xl border border-white/20 bg-white text-xs font-black text-black shadow-lg transition-all duration-150"
            style={{
              left: `calc(${obstacle.lane * 33.333}% + 16.666% - 24px)`,
              top: `${obstacle.distance}%`,
            }}
            aria-label="Obstacle marker"
          >
            DEF
          </div>

          {!running && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/70 p-5 text-center backdrop-blur-sm">
              <div>
                <p className="text-sm font-semibold uppercase tracking-wider text-brand-orange">
                  {status === 'hit' ? 'Tackle landed' : 'Ready'}
                </p>
                <p className="mt-2 max-w-sm text-sm text-gray-300">
                  Dodge defenders, build score, and stress-test the tournament idea as an interactive fan mechanic.
                </p>
                <button
                  type="button"
                  onClick={startGame}
                  className="mt-5 rounded-full bg-gradient-to-r from-brand-orange to-brand-yellow px-6 py-3 text-sm font-bold text-black"
                >
                  {status === 'hit' ? 'Play again' : 'Start game'}
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="mt-5 grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => move(-1)}
            disabled={!running}
            className="rounded-xl border border-white/10 bg-brand-dark px-4 py-3 text-sm font-bold text-white disabled:opacity-40"
          >
            Move left
          </button>
          <button
            type="button"
            onClick={() => move(1)}
            disabled={!running}
            className="rounded-xl border border-white/10 bg-brand-dark px-4 py-3 text-sm font-bold text-white disabled:opacity-40"
          >
            Move right
          </button>
        </div>
      </section>

      <section className="rounded-2xl border border-white/10 bg-brand-gray p-5 sm:p-6">
        <p className="text-xs font-semibold uppercase tracking-wider text-brand-orange">Community Cup interest</p>
        <h2 className="mt-2 font-display text-3xl text-white">Register interest</h2>
        <p className="mt-3 text-sm leading-relaxed text-gray-400">
          This collects player, team, and volunteer interest while the full tournament format is still being confirmed.
        </p>

        <form
          name="community-cup-interest"
          method="POST"
          data-netlify="true"
          data-netlify-honeypot="bot-field"
          onSubmit={handleSubmit}
          className="mt-6 space-y-4"
        >
          <input type="hidden" name="form-name" value="community-cup-interest" />
          <p className="hidden">
            <label>
              Do not fill this out: <input name="bot-field" />
            </label>
          </p>
          {[
            ['name', 'Name', 'Your name'],
            ['email', 'Email', 'you@example.com'],
            ['team', 'Team or crew', 'Optional'],
          ].map(([key, label, placeholder]) => (
            <label key={key} className="block">
              <span className="mb-2 block text-xs font-semibold uppercase tracking-wider text-gray-400">{label}</span>
              <input
                name={key}
                type={key === 'email' ? 'email' : 'text'}
                required={key !== 'team'}
                value={form[key as keyof typeof form]}
                onChange={event => setForm(current => ({ ...current, [key]: event.target.value }))}
                placeholder={placeholder}
                className="w-full rounded-xl border border-white/10 bg-brand-dark px-4 py-3 text-white outline-none transition-colors placeholder:text-gray-600 focus:border-brand-orange"
              />
            </label>
          ))}
          <label className="block">
            <span className="mb-2 block text-xs font-semibold uppercase tracking-wider text-gray-400">Role</span>
            <select
              name="role"
              value={form.role}
              onChange={event => setForm(current => ({ ...current, role: event.target.value }))}
              className="w-full rounded-xl border border-white/10 bg-brand-dark px-4 py-3 text-white outline-none transition-colors focus:border-brand-orange"
            >
              <option>Player</option>
              <option>Team captain</option>
              <option>Volunteer</option>
              <option>Sponsor</option>
            </select>
          </label>
          <button
            type="submit"
            disabled={formState === 'submitting'}
            className="w-full rounded-xl bg-gradient-to-r from-brand-orange to-brand-yellow px-5 py-4 text-sm font-bold text-black transition-opacity hover:opacity-90 disabled:opacity-60"
          >
            {formState === 'submitting' ? 'Sending...' : 'Send interest'}
          </button>
          {formState === 'success' && <p role="status" className="text-sm font-semibold text-brand-neon">Interest received.</p>}
          {formState === 'error' && <p role="status" className="text-sm font-semibold text-brand-orange">Could not send. Try again shortly.</p>}
        </form>
      </section>
    </div>
  )
}
