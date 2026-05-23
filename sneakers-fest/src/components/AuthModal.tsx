'use client'

import { useState } from 'react'
import { useAuth } from '@/context/AuthContext'

export default function AuthModal() {
  const { isAuthOpen, closeAuth, login, register } = useAuth()
  const [tab, setTab] = useState<'login' | 'register'>('login')
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  if (!isAuthOpen) return null

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault(); setError(''); setLoading(true)
    const ok = await login(form.email, form.password)
    setLoading(false)
    if (!ok) setError('Invalid email or password.')
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault(); setError('')
    if (form.password !== form.confirm) { setError('Passwords do not match.'); return }
    if (form.password.length < 6) { setError('Password must be at least 6 characters.'); return }
    setLoading(true)
    await register(form.name, form.email, form.password)
    setLoading(false)
  }

  const Field = ({ label, type, field, placeholder }: { label: string; type: string; field: keyof typeof form; placeholder: string }) => (
    <div>
      <label className="block text-sm text-gray-400 mb-1.5">{label}</label>
      <input type={type} placeholder={placeholder} required value={form[field]}
        onChange={e => setForm(f => ({ ...f, [field]: e.target.value }))}
        className="w-full px-4 py-3 bg-brand-dark border border-white/10 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-brand-orange text-sm" />
    </div>
  )

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="bg-brand-gray rounded-3xl p-8 w-full max-w-md border border-white/10">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-white font-display text-2xl">{tab === 'login' ? 'SIGN IN' : 'CREATE ACCOUNT'}</h3>
          <button onClick={() => { closeAuth(); setError('') }} className="text-gray-400 hover:text-white">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>
        <div className="flex gap-1 bg-brand-dark rounded-xl p-1 mb-6">
          {(['login', 'register'] as const).map(t => (
            <button key={t} onClick={() => { setTab(t); setError('') }}
              className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${tab === t ? 'bg-brand-gray text-white' : 'text-gray-500 hover:text-gray-300'}`}>
              {t === 'login' ? 'Sign In' : 'Register'}
            </button>
          ))}
        </div>
        {tab === 'login' ? (
          <form onSubmit={handleLogin} className="space-y-4">
            <Field label="Email" type="email" field="email" placeholder="you@example.com" />
            <Field label="Password" type="password" field="password" placeholder="••••••••" />
            {error && <p className="text-red-400 text-sm">{error}</p>}
            <button type="submit" disabled={loading} className="w-full py-3 rounded-xl bg-gradient-to-r from-brand-orange to-brand-yellow text-black font-bold hover:opacity-90 disabled:opacity-50">
              {loading ? 'Signing in…' : 'Sign In'}
            </button>
          </form>
        ) : (
          <form onSubmit={handleRegister} className="space-y-4">
            <Field label="Full Name" type="text" field="name" placeholder="Your name" />
            <Field label="Email" type="email" field="email" placeholder="you@example.com" />
            <Field label="Password" type="password" field="password" placeholder="••••••••" />
            <Field label="Confirm Password" type="password" field="confirm" placeholder="••••••••" />
            {error && <p className="text-red-400 text-sm">{error}</p>}
            <button type="submit" disabled={loading} className="w-full py-3 rounded-xl bg-gradient-to-r from-brand-orange to-brand-yellow text-black font-bold hover:opacity-90 disabled:opacity-50">
              {loading ? 'Creating account…' : 'Create Account'}
            </button>
          </form>
        )}
        <p className="text-center text-gray-600 text-xs mt-4">By continuing, you agree to our Terms & Privacy Policy.</p>
      </div>
    </div>
  )
}
