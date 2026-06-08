'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'

const NAV_LINKS = [
  { href: '/', label: 'Home' },
  { href: '/schedule', label: 'Schedule' },
  { href: '/raffle', label: 'Raffle' },
  { href: '/catalog', label: 'Catalog' },
  { href: '/marketplace', label: 'Market' },
  { href: '/vendors', label: 'Vendors' },
  { href: '/bible', label: 'Bible' },
  { href: '/tournament', label: 'Cup' },
  { href: '/fnp', label: 'FNP', neon: true },
  { href: '/tickets', label: 'Tickets' },
]

export default function Navbar() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  return (
    <>
      {/* Announcement bar */}
      <div
        className="fixed top-0 left-0 right-0 z-[60] h-9 flex items-center justify-center px-4"
        style={{ background: 'linear-gradient(90deg, #FF6B2C, #FFA500)' }}
      >
        <p className="text-black text-[9px] sm:text-[10px] font-semibold tracking-[0.3em] uppercase text-center leading-none">
          🔥 Early Bird Tickets Now Live &middot; December 12, 2026 &middot;{' '}
          <Link href="/tickets" className="underline underline-offset-2 hover:opacity-70 transition-opacity">
            Get Yours &rarr;
          </Link>
        </p>
      </div>

      {/* Main navbar */}
      <header className="fixed top-9 left-0 right-0 z-50 bg-brand-dark/90 backdrop-blur-md border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center gap-2">
              <span className="text-2xl">👟</span>
              <span className="font-display text-xl tracking-wider text-gradient">
                SNEAKERS<span className="text-white">FEST</span>
              </span>
            </Link>

            <nav className="hidden xl:flex items-center gap-1">
              {NAV_LINKS.map(({ href, label, neon }) => (
                <Link
                  key={href}
                  href={href}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    pathname === href
                      ? neon
                        ? 'text-brand-neon bg-brand-neon/10'
                        : 'text-brand-orange bg-brand-orange/10'
                      : neon
                      ? 'text-brand-neon hover:bg-brand-neon/10'
                      : 'text-gray-300 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {label}
                </Link>
              ))}
              <Link
                href="/sponsors"
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors border ${
                  pathname === '/sponsors'
                    ? 'text-brand-amber bg-brand-amber/10 border-brand-amber/40'
                    : 'text-brand-amber/70 hover:text-brand-amber hover:bg-brand-amber/5 border-brand-amber/20'
                }`}
              >
                Partner
              </Link>
            </nav>

            <Link
              href="/tickets"
              className="hidden xl:inline-flex items-center px-5 py-2 rounded-full bg-gradient-to-r from-brand-orange to-brand-yellow text-black text-sm font-bold hover:opacity-90 transition-opacity"
            >
              Get Tickets
            </Link>

            <button
              onClick={() => setOpen(!open)}
              className="xl:hidden p-2 rounded-lg text-gray-300 hover:text-white"
              aria-label="Toggle menu"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {open
                  ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                }
              </svg>
            </button>
          </div>
        </div>

        {open && (
          <div className="xl:hidden border-t border-white/10 bg-brand-dark/95 px-4 py-3 space-y-1">
            {NAV_LINKS.map(({ href, label, neon }) => (
              <Link
                key={href}
                href={href}
                onClick={() => setOpen(false)}
                className={`block px-4 py-3 rounded-lg text-sm font-medium ${
                  pathname === href
                    ? neon ? 'text-brand-neon bg-brand-neon/10' : 'text-brand-orange bg-brand-orange/10'
                    : neon ? 'text-brand-neon' : 'text-gray-300'
                }`}
              >
                {label}
              </Link>
            ))}
            <Link
              href="/sponsors"
              onClick={() => setOpen(false)}
              className={`block px-4 py-3 rounded-lg text-sm font-medium border ${
                pathname === '/sponsors'
                  ? 'text-brand-amber bg-brand-amber/10 border-brand-amber/40'
                  : 'text-brand-amber/70 border-brand-amber/15'
              }`}
            >
              Partner with Us
            </Link>
            <Link
              href="/tickets"
              onClick={() => setOpen(false)}
              className="block mt-2 px-4 py-3 rounded-full bg-gradient-to-r from-brand-orange to-brand-yellow text-black text-sm font-bold text-center"
            >
              Get Tickets
            </Link>
          </div>
        )}
      </header>
    </>
  )
}
