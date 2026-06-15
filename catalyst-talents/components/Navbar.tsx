'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

function LogoMark({ size = 32 }: { size?: number }) {
  return (
    <svg
      viewBox="0 0 36 36"
      width={size}
      height={size}
      fill="none"
      aria-hidden="true"
    >
      {/* Outer faint ring */}
      <circle cx="18" cy="18" r="15" stroke="#D4AF37" stroke-width="0.5" opacity="0.18"/>

      {/* Main C arc: radius 11, 270°, opening right */}
      {/* Start at 45°: (26, 10)  End at 315°: (26, 26) */}
      <path d="M 26,10 A 11,11 0 1,0 26,26"
            stroke="#D4AF37" stroke-width="1.75" stroke-linecap="round"/>

      {/* Endpoint dots */}
      <circle cx="26" cy="10" r="1.5" fill="#D4AF37"/>
      <circle cx="26" cy="26" r="1.5" fill="#D4AF37"/>

      {/* Center diamond */}
      <polygon points="18,15 21,18 18,21 15,18" fill="#D4AF37"/>

      {/* Small star above mark (top of arc at 90°: (18, 7)) */}
      <g transform="translate(18, 3)">
        <line x1="0" y1="-3" x2="0" y2="3" stroke="#D4AF37" stroke-width="0.6" opacity="0.7"/>
        <line x1="-3" y1="0" x2="3" y2="0" stroke="#D4AF37" stroke-width="0.6" opacity="0.7"/>
        <circle cx="0" cy="0" r="1" fill="#D4AF37" opacity="0.9"/>
      </g>
    </svg>
  )
}

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()

  const links = [
    { href: '/', label: 'Home' },
    { href: '/models', label: 'Models' },
    { href: '/services', label: 'Services' },
    { href: '/partnerships', label: 'Partnerships' },
    { href: '/news', label: 'News' },
    { href: '/press', label: 'Press' },
    { href: '/about', label: 'About' },
    { href: '/contact', label: 'Contact' },
  ]

  return (
    <>
      {/* Announcement bar */}
      <div className="fixed top-0 left-0 right-0 z-[60] bg-[#D4AF37] h-[34px] flex items-center justify-center px-4">
        <p className="text-black text-[9px] sm:text-[10px] tracking-[0.3em] uppercase font-semibold text-center leading-none">
          ✶ Now Accepting Applications &middot; 2025&#8211;2026 Intake Open &middot;{' '}
          <Link href="/apply" className="underline underline-offset-2 hover:opacity-70 transition-opacity">
            Apply Today &rarr;
          </Link>
        </p>
      </div>

      {/* Main nav */}
      <nav className="fixed top-[34px] left-0 right-0 z-50 bg-black/90 backdrop-blur-md border-b border-[#D4AF37]/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">

            {/* Brand mark + wordmark */}
            <Link href="/" className="flex items-center gap-3 flex-shrink-0" onClick={() => setIsOpen(false)}>
              <LogoMark size={32} />
              <div className="flex flex-col">
                <span className="font-playfair text-xl font-bold text-[#D4AF37] tracking-wider leading-none">
                  CATALYST
                </span>
                <span className="font-playfair text-[9px] text-[#D4AF37]/55 tracking-[0.3em] uppercase mt-0.5">
                  Talents Lagos
                </span>
              </div>
            </Link>

            {/* Desktop links */}
            <div className="hidden lg:flex items-center gap-6">
              {links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`text-[10px] tracking-widest uppercase transition-colors duration-300 ${
                    pathname === link.href
                      ? 'text-[#D4AF37]'
                      : 'text-white/55 hover:text-[#D4AF37]'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              <Link
                href="/booking"
                className={`text-[10px] tracking-widest uppercase transition-colors duration-300 ${
                  pathname === '/booking'
                    ? 'text-[#D4AF37]'
                    : 'text-white/55 hover:text-[#D4AF37]'
                }`}
              >
                Book Talent
              </Link>
              <Link
                href="/apply"
                className="px-5 py-2.5 bg-[#D4AF37] text-black text-[10px] font-bold tracking-widest uppercase hover:bg-[#F0D060] transition-colors duration-300 whitespace-nowrap"
              >
                Apply Now
              </Link>
            </div>

            {/* Mobile hamburger */}
            <button
              className="lg:hidden p-2 text-white flex flex-col gap-1.5"
              onClick={() => setIsOpen(!isOpen)}
              aria-label="Toggle navigation"
            >
              <span className={`block w-6 h-px bg-current transition-all duration-300 origin-center ${isOpen ? 'rotate-45 translate-y-[7px]' : ''}`} />
              <span className={`block w-6 h-px bg-current transition-all duration-300 ${isOpen ? 'opacity-0 scale-x-0' : ''}`} />
              <span className={`block w-6 h-px bg-current transition-all duration-300 origin-center ${isOpen ? '-rotate-45 -translate-y-[7px]' : ''}`} />
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        <div className={`lg:hidden overflow-hidden transition-all duration-300 ${isOpen ? 'max-h-[600px]' : 'max-h-0'}`}>
          <div className="bg-[#0d0d0d] border-t border-[#D4AF37]/10 px-4 py-6 space-y-5">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`block text-[10px] tracking-widest uppercase transition-colors ${
                  pathname === link.href ? 'text-[#D4AF37]' : 'text-white/55 hover:text-[#D4AF37]'
                }`}
                onClick={() => setIsOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/booking"
              className={`block text-[10px] tracking-widest uppercase transition-colors ${
                pathname === '/booking' ? 'text-[#D4AF37]' : 'text-white/55 hover:text-[#D4AF37]'
              }`}
              onClick={() => setIsOpen(false)}
            >
              Book Talent
            </Link>
            <Link
              href="/apply"
              className="block text-center w-full px-6 py-3 bg-[#D4AF37] text-black text-[10px] font-bold tracking-widest uppercase"
              onClick={() => setIsOpen(false)}
            >
              Apply Now
            </Link>
          </div>
        </div>
      </nav>
    </>
  )
}
