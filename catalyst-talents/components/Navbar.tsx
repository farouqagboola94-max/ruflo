'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()

  const links = [
    { href: '/', label: 'Home' },
    { href: '/models', label: 'Our Models' },
    { href: '/about', label: 'About' },
    { href: '/contact', label: 'Contact' },
  ]

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-black/90 backdrop-blur-md border-b border-gold/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="flex flex-col" onClick={() => setIsOpen(false)}>
            <span className="font-playfair text-xl font-bold text-[#D4AF37] tracking-wider">CATALYST</span>
            <span className="font-playfair text-[10px] text-[#D4AF37]/60 tracking-[0.3em] uppercase">
              Talents Lagos
            </span>
          </Link>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-8">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-xs tracking-widest uppercase transition-colors duration-300 ${
                  pathname === link.href
                    ? 'text-[#D4AF37]'
                    : 'text-white/60 hover:text-[#D4AF37]'
                }`}
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/apply"
              className="px-6 py-2.5 bg-[#D4AF37] text-black text-xs font-bold tracking-widest uppercase hover:bg-[#F0D060] transition-colors duration-300"
            >
              Apply Now
            </Link>
          </div>

          {/* Mobile burger */}
          <button
            className="md:hidden p-2 text-white"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle navigation"
          >
            <div
              className={`w-6 h-px bg-current transition-all duration-300 mb-1.5 ${
                isOpen ? 'rotate-45 translate-y-2' : ''
              }`}
            />
            <div
              className={`w-6 h-px bg-current transition-all duration-300 mb-1.5 ${
                isOpen ? 'opacity-0' : ''
              }`}
            />
            <div
              className={`w-6 h-px bg-current transition-all duration-300 ${
                isOpen ? '-rotate-45 -translate-y-2' : ''
              }`}
            />
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-300 ${
          isOpen ? 'max-h-96' : 'max-h-0'
        }`}
      >
        <div className="bg-[#111111] border-t border-[#D4AF37]/10 px-4 py-6 space-y-5">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`block text-xs tracking-widest uppercase transition-colors ${
                pathname === link.href ? 'text-[#D4AF37]' : 'text-white/60 hover:text-[#D4AF37]'
              }`}
              onClick={() => setIsOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/apply"
            className="block text-center w-full px-6 py-3 bg-[#D4AF37] text-black text-xs font-bold tracking-widest uppercase"
            onClick={() => setIsOpen(false)}
          >
            Apply Now
          </Link>
        </div>
      </div>
    </nav>
  )
}
