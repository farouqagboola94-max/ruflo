'use client'
import { createContext, useContext, useState, useEffect, useRef, ReactNode } from 'react'
import { supabase } from '@/lib/supabase'
export interface User { id: string; name: string; email: string; favorites: string[] }
interface AuthContextType {
  user: User | null
  loading: boolean
  syncError: string
  isAuthOpen: boolean
  openAuth: () => void
  closeAuth: () => void
  login: (email: string, password: string) => Promise<void>
  register: (name: string, email: string, password: string) => Promise<boolean>
  logout: () => Promise<void>
  toggleFavorite: (id: string) => Promise<void>
  refreshFavorites: () => Promise<void>
}
const AuthContext = createContext<AuthContextType | null>(null)
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [syncError, setSyncError] = useState('')
  const [isAuthOpen, setIsAuthOpen] = useState(false)
  const identity = useRef<string | null>(null)
  async function refreshFavorites() {
    const id = identity.current
    if (!id) return
    const { data, error } = await supabase.from('saved_sneakers').select('sneaker_id').eq('user_id', id)
    if (identity.current !== id) return
    setSyncError(error ? 'Saved sneakers could not sync. Please retry.' : '')
    if (!error) setUser(current => current?.id === id ? { ...current, favorites: data.map(row => row.sneaker_id) } : current)
  }
  useEffect(() => {
    try {
      Object.keys(localStorage).filter(key => key === 'sf_user' || key.startsWith('sf_acct_')).forEach(key => localStorage.removeItem(key))
    } catch {}
    let mounted = true
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!mounted) return
      const authUser = session?.user
      const changed = identity.current !== (authUser?.id ?? null)
      identity.current = authUser?.id ?? null
      setUser(current => authUser ? {
        id: authUser.id,
        name: String(authUser.user_metadata.name || authUser.email?.split('@')[0] || 'Sneaker fan'),
        email: authUser.email || '',
        favorites: changed ? [] : current?.favorites || [],
      } : null)
      setLoading(false)
      // Never await database calls inside the auth callback.
      if (authUser) window.setTimeout(() => { if (mounted) void refreshFavorites() }, 0)
    })
    const onFocus = () => { void refreshFavorites() }
    window.addEventListener('focus', onFocus)
    return () => { mounted = false; subscription.unsubscribe(); window.removeEventListener('focus', onFocus) }
  }, [])
  async function login(email: string, password: string) {
    const { error } = await supabase.auth.signInWithPassword({ email: email.trim(), password })
    if (error) throw error
    setIsAuthOpen(false)
  }
  async function register(name: string, email: string, password: string) {
    const { data, error } = await supabase.auth.signUp({ email: email.trim(), password, options: {
      data: { name: name.trim() }, emailRedirectTo: window.location.origin + '/profile/',
    } })
    if (error) throw error
    if (data.session) setIsAuthOpen(false)
    return Boolean(data.session)
  }
  async function logout() {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
    identity.current = null; setUser(null); setSyncError('')
  }
  async function toggleFavorite(id: string) {
    if (!user) { setIsAuthOpen(true); return }
    const owner = user.id
    const { error } = user.favorites.includes(id)
      ? await supabase.from('saved_sneakers').delete().eq('user_id', owner).eq('sneaker_id', id)
      : await supabase.from('saved_sneakers').upsert({ user_id: owner, sneaker_id: id }, { onConflict: 'user_id,sneaker_id', ignoreDuplicates: true })
    if (error) throw error
    await refreshFavorites()
  }
  return <AuthContext.Provider value={{ user, loading, syncError, isAuthOpen, openAuth: () => setIsAuthOpen(true), closeAuth: () => setIsAuthOpen(false), login, register, logout, toggleFavorite, refreshFavorites }}>{children}</AuthContext.Provider>
}
export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
