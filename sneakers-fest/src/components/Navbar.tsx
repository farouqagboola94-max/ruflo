'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { useAuth } from '@/context/AuthContext'

const NAV_LINKS = [
  { href: '/', label: 'Home' },
  { href: '/schedule', label: 'Schedule' },
  { href: '/catalog', label: 'Catalog' },
  { href: '/marketplace', label: 'Marketplace' },
  { href: '/fnp', label: 'FNP' },
  { href: '/contact', label: 'Contact' },
]

export default function Navbar() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const { user, openAuth } = useAuth()
  const initials = user?.name.split(' ').map((w: string) => w[0]).join('').toUpperCase().slice(0, 2) || ''

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-brand-dark/90 backdrop-blur-md border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-2xl">👟</span>
            <span className="font-display text-xl tracking-wider text-gradient">SNEAKERS<span className="text-white">FEST</span></span>
          </Link>

          <nav className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map(({ href, label }) => (
              <Link key={href} href={href}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  label === 'FNP'
                    ? pathname === href
                      ? 'text-brand-neon bg-brand-neon/10'
                      : 'text-brand-neon/70 hover:text-brand-neon hover:bg-brand-neon/10'
                    : pathname === href
                      ? 'text-brand-orange bg-brand-orange/10'
                      : 'text-gray-300 hover:text-white hover:bg-white/5'
                }`}>{label}</Link>
            ))}
          </nav>

          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <Link href="/profile" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-brand-orange to-brand-amber flex items-center justify-center text-black text-xs font-bold">{initials}</div>
                <span className="text-sm text-gray-300">{user.name.split(' ')[0]}</span>
              </Link>
            ) : (
              <button onClick={openAuth} className="text-sm text-gray-300 hover:text-white transition-colors">Sign In</button>
            )}
            <Link href="/tickets" className="inline-flex items-center px-5 py-2 rounded-full bg-gradient-to-r from-brand-orange to-brand-amber text-black text-sm font-bold hover:opacity-90 transition-opacity">
              Get Tickets
            </Link>
          </div>

          <button onClick={() => setOpen(!open)} className="md:hidden p-2 rounded-lg text-gray-300 hover:text-white" aria-label="Toggle menu">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {open ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />}
            </svg>
          </button>
        </div>
      </div>

      {open && (
        <div className="md:hidden border-t border-white/10 bg-brand-dark/95 px-4 py-3 space-y-1">
          {NAV_LINKS.map(({ href, label }) => (
            <Link key={href} href={href} onClick={() => setOpen(false)}
              className={`block px-4 py-3 rounded-lg text-sm font-medium ${
                label === 'FNP'
                  ? 'text-brand-neon'
                  : pathname === href ? 'text-brand-orange bg-brand-orange/10' : 'text-gray-300'
              }`}>
              {label}
            </Link>
          ))}
          {user ? (
            <Link href="/profile" onClick={() => setOpen(false)} className="block px-4 py-3 rounded-lg text-sm text-gray-300">Profile ({user.name.split(' ')[0]})</Link>
          ) : (
            <button onClick={() => { openAuth(); setOpen(false) }} className="block w-full text-left px-4 py-3 rounded-lg text-sm text-gray-300">Sign In</button>
          )}
          <Link href="/tickets" onClick={() => setOpen(false)} className="block mt-2 px-4 py-3 rounded-full bg-gradient-to-r from-brand-orange to-brand-amber text-black text-sm font-bold text-center">Get Tickets</Link>
        </div>
      )}
    </header>
  )
}
