'use client'
import { useEffect, useState, FormEvent } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
export default function ResetPasswordPage() {
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [ready, setReady] = useState(false)
  const [busy, setBusy] = useState(false)
  const [done, setDone] = useState(false)
  const [error, setError] = useState('')
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => setReady(Boolean(session)))
    return () => subscription.unsubscribe()
  }, [])
  async function submit(e: FormEvent) {
    e.preventDefault(); setError('')
    if (password !== confirm) { setError('Passwords do not match.'); return }
    setBusy(true)
    try {
      const { error } = await supabase.auth.updateUser({ password })
      if (error) throw error
      setDone(true); setPassword(''); setConfirm('')
    } catch (err) { setError(err instanceof Error ? err.message : 'Try again.') }
    finally { setBusy(false) }
  }
  return <section className="mx-auto max-w-lg px-5 py-16"><h1 className="mb-6 font-display text-4xl">RESET PASSWORD</h1>
    {done ? <p role="status">Password updated. <Link href="/profile" className="text-brand-orange underline">Open your profile</Link></p> : ready ? <form onSubmit={submit} className="space-y-5">
      <label className="block">New password<input required type="password" autoComplete="new-password" minLength={8} value={password} onChange={e => setPassword(e.target.value)} className="mt-2 w-full rounded-xl bg-brand-gray p-3" /></label>
      <label className="block">Confirm password<input required type="password" autoComplete="new-password" minLength={8} value={confirm} onChange={e => setConfirm(e.target.value)} className="mt-2 w-full rounded-xl bg-brand-gray p-3" /></label>
      {error && <p role="alert" className="text-red-400">{error}</p>}<button disabled={busy} className="rounded-xl bg-brand-orange px-6 py-3 font-bold text-black">{busy ? 'Updating…' : 'Update password'}</button>
    </form> : <p>Open the latest reset link from your email. If it has expired, <Link href="/profile" className="text-brand-orange underline">request another from sign in</Link>.</p>}
  </section>
}
