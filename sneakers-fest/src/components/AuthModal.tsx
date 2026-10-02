'use client'
import { useEffect, useRef, useState, FormEvent } from 'react'
import Link from 'next/link'
import { useAuth } from '@/context/AuthContext'
import { supabase } from '@/lib/supabase'
export default function AuthModal() {
  const { isAuthOpen, closeAuth, login, register } = useAuth()
  const dialog = useRef<HTMLDialogElement>(null)
  const [tab, setTab] = useState<'login' | 'register' | 'reset'>('login')
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' })
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')
  const [loading, setLoading] = useState(false)
  useEffect(() => {
    if (isAuthOpen) { dialog.current?.showModal(); setError(''); setNotice('') }
    else { dialog.current?.close(); setForm(current => ({ ...current, password: '', confirm: '' })) }
  }, [isAuthOpen])
  async function submit(event: FormEvent) {
    event.preventDefault(); setError(''); setNotice(''); setLoading(true)
    try {
      if (tab === 'login') await login(form.email, form.password)
      if (tab === 'register') {
        if (form.password !== form.confirm) throw new Error('Passwords do not match.')
        const signedIn = await register(form.name, form.email, form.password)
        if (!signedIn) setNotice('Check your email to confirm your account, then sign in here.')
      }
      if (tab === 'reset') {
        const { error } = await supabase.auth.resetPasswordForEmail(form.email.trim(), { redirectTo: window.location.origin + '/reset-password/' })
        if (error) throw error
        setNotice('If this email has an account, a password reset link will arrive shortly.')
      }
    } catch (err) { setError(err instanceof Error ? err.message : 'Could not connect. Please try again.') }
    finally { setLoading(false) }
  }
  return (
    <dialog ref={dialog} onCancel={closeAuth} onClose={closeAuth} aria-labelledby="auth-title" className="w-[calc(100%_-_2rem)] max-w-md rounded-3xl border border-white/10 bg-brand-gray p-6 text-white backdrop:bg-black/80">
      <div className="mb-6 flex justify-between gap-3">
        <h2 id="auth-title" className="font-display text-2xl">{tab === 'login' ? 'SIGN IN' : tab === 'register' ? 'CREATE ACCOUNT' : 'RESET PASSWORD'}</h2>
        <button aria-label="Close sign in" onClick={closeAuth} className="px-2 text-xl">×</button>
      </div>
      <div className="mb-5 flex gap-3">
        {(['login', 'register'] as const).map(value => <button key={value} onClick={() => { setTab(value); setError(''); setNotice('') }} className={tab === value ? 'rounded-lg bg-brand-orange px-4 py-2 text-black' : 'rounded-lg bg-brand-dark px-4 py-2'}>{value === 'login' ? 'Sign in' : 'Register'}</button>)}
      </div>
      <form onSubmit={submit} className="space-y-4">
        {(tab === 'register' ? ['name', 'email', 'password', 'confirm'] : tab === 'reset' ? ['email'] : ['email', 'password']).map(key => (
          <label key={key} className="block text-sm text-gray-300">
            {{ name: 'Full name', email: 'Email', password: 'Password', confirm: 'Confirm password' }[key]}
            <input name={key} required maxLength={key === 'name' ? 100 : 254} minLength={tab === 'register' && ['password', 'confirm'].includes(key) ? 8 : undefined}
              type={['password', 'confirm'].includes(key) ? 'password' : key === 'email' ? 'email' : 'text'}
              autoComplete={key === 'email' ? 'email' : key === 'name' ? 'name' : tab === 'login' ? 'current-password' : 'new-password'}
              value={form[key as keyof typeof form]} onChange={e => setForm(current => ({ ...current, [key]: e.target.value }))}
              className="mt-2 w-full rounded-xl border border-white/20 bg-brand-dark px-4 py-3 text-white" />
          </label>
        ))}
        {error && <p role="alert" className="text-sm text-red-400">{error}</p>}
        {notice && <p role="status" className="text-sm text-brand-neon">{notice}</p>}
        <button disabled={loading} className="w-full rounded-xl bg-brand-orange py-3 font-bold text-black disabled:opacity-50">{loading ? 'Please wait…' : tab === 'login' ? 'Sign in' : tab === 'register' ? 'Create account' : 'Send reset link'}</button>
        {tab === 'login' && <button type="button" onClick={() => { setTab('reset'); setError(''); setNotice('') }} className="text-sm text-brand-orange">Forgot password?</button>}
      </form>
      <p className="mt-5 text-xs text-gray-400">Your account saves your favourites across devices. <Link href="/privacy" onClick={closeAuth} className="underline">Privacy</Link> · <Link href="/terms" onClick={closeAuth} className="underline">Terms</Link></p>
    </dialog>
  )
}
