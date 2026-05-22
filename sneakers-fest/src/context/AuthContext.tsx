'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

export interface User {
  name: string
  email: string
  favorites: string[]
  tickets: Array<{ tier: string; quantity: number; ref: string; date: string; total: number }>
}

interface AuthContextType {
  user: User | null
  isAuthOpen: boolean
  openAuth: () => void
  closeAuth: () => void
  login: (email: string, password: string) => Promise<boolean>
  register: (name: string, email: string, password: string) => Promise<void>
  logout: () => void
  toggleFavorite: (sneakerId: string) => void
  addTicket: (ticket: User['tickets'][0]) => void
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isAuthOpen, setIsAuthOpen] = useState(false)

  useEffect(() => {
    try {
      const s = localStorage.getItem('sf_user')
      if (s) setUser(JSON.parse(s))
    } catch {}
  }, [])

  const save = (u: User) => {
    setUser(u)
    localStorage.setItem('sf_user', JSON.stringify(u))
  }

  const login = async (email: string, password: string) => {
    try {
      const s = localStorage.getItem(`sf_acct_${email}`)
      if (!s) return false
      const acct = JSON.parse(s)
      if (acct.password !== password) return false
      save({ name: acct.name, email, favorites: acct.favorites || [], tickets: acct.tickets || [] })
      setIsAuthOpen(false)
      return true
    } catch { return false }
  }

  const register = async (name: string, email: string, password: string) => {
    localStorage.setItem(`sf_acct_${email}`, JSON.stringify({ name, email, password, favorites: [], tickets: [] }))
    save({ name, email, favorites: [], tickets: [] })
    setIsAuthOpen(false)
  }

  const logout = () => { setUser(null); localStorage.removeItem('sf_user') }

  const toggleFavorite = (id: string) => {
    if (!user) return
    const favorites = user.favorites.includes(id) ? user.favorites.filter(f => f !== id) : [...user.favorites, id]
    const updated = { ...user, favorites }
    save(updated)
    try {
      const acct = JSON.parse(localStorage.getItem(`sf_acct_${user.email}`) || '{}')
      localStorage.setItem(`sf_acct_${user.email}`, JSON.stringify({ ...acct, favorites }))
    } catch {}
  }

  const addTicket = (ticket: User['tickets'][0]) => {
    if (!user) return
    const tickets = [...user.tickets, ticket]
    const updated = { ...user, tickets }
    save(updated)
    try {
      const acct = JSON.parse(localStorage.getItem(`sf_acct_${user.email}`) || '{}')
      localStorage.setItem(`sf_acct_${user.email}`, JSON.stringify({ ...acct, tickets }))
    } catch {}
  }

  return (
    <AuthContext.Provider value={{ user, isAuthOpen, openAuth: () => setIsAuthOpen(true), closeAuth: () => setIsAuthOpen(false), login, register, logout, toggleFavorite, addTicket }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
