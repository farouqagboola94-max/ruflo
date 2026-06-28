'use client'

import Link from 'next/link'
import { useState } from 'react'

export default function Footer() {
  const year = new Date().getFullYear()
  const [email, setEmail] = useState('')
  const [subscribed, setSubscribed] = useState(false)
  const [subscribing, setSubscribing] = useState(false)

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return
    setSubscribing(true)
    try {
      const body = new URLSearchParams({ 'form-name': 'newsletter', email })
      await fetch('/', { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body: body.toString() })
    } catch (_) {}
    setSubscribing(false)
    setSubscribed(true)
    setEmail('')
  }

  return (
    <footer className="border-t border-[#D4AF37]/10" style={{ background: '#080806' }}>
      {/* Newsletter Strip */}
      <div className="border-b border-white/5" style={{ background: 'linear-gradient(135deg, #0d0d0a 0%, #111109 100%)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
            <div>
              <p className="text-[#D4AF37] text-[9px] tracking-[0.5em] uppercase mb-2">Stay in the Loop</p>
              <p className="font-playfair text-xl font-bold text-white">The CTL Dispatch</p>
              <p className="text-white/35 text-sm mt-1">New signings, campaigns, and news from Lagos to the world.</p>
            </div>
            {subscribed ? (
              <div className="flex items-center gap-3">
                <span className="text-[#D4AF37] text-lg">✦</span>
                <p className="text-white/60 text-sm">You&apos;re on the list. Welcome.</p>
              </div>
            ) : (
              <form
                name="newsletter"
                data-netlify="true"
                onSubmit={handleSubscribe}
                className="flex w-full md:w-auto gap-0"
              >
                <input type="hidden" name="form-name" value="newsletter" />
                <input
                  type="email"
                  name="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  className="bg-white/5 border border-white/10 focus:border-[#D4AF37]/40 text-white placeholder-white/20 px-4 py-3 text-xs outline-none w-full md:w-64 transition-colors"
                />
                <button
                  type="submit"
                  disabled={subscribing}
                  className="px-6 py-3 bg-[#D4AF37] text-black font-bold text-[10px] tracking-widest uppercase hover:bg-[#F0D060] transition-colors whitespace-nowrap disabled:opacity-60"
                >
                  {subscribing ? '...' : 'Subscribe'}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>

      {/* Welfare Badges */}
      <div className="border-b border-white/4 py-5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-wrap gap-6 items-center justify-center md:justify-start">
          {[
            { icon: '◈', label: 'Welfare First' },
            { icon: '◆', label: 'Culture Intact' },
            { icon: '✦', label: 'Lagos Built' },
          ].map((b) => (
            <div key={b.label} className="flex items-center gap-2">
              <span className="text-[#D4AF37] text-xs">{b.icon}</span>
              <span className="text-[9px] tracking-[0.3em] uppercase text-white/30">{b.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Main links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-12 mb-16">
          {/* Brand */}
          <div className="lg:col-span-2">
            <div className="mb-5">
              <span className="font-playfair text-2xl font-bold text-[#D4AF37] block leading-none">CATALYST</span>
              <span className="font-playfair text-[10px] text-[#D4AF37]/50 tracking-[0.3em] uppercase mt-1 block">Talents Lagos</span>
            </div>
            <p className="text-white/35 text-sm leading-relaxed max-w-xs mb-6">
              Illuminating models and talents from Lagos to the world. An extension of Catalyst
              Concepts — shaping the future of African fashion and entertainment.
            </p>
            <div className="flex flex-wrap gap-5">
              <a href="https://instagram.com/catalystggg" target="_blank" rel="noreferrer" className="text-[10px] tracking-wider text-white/25 hover:text-[#D4AF37] transition-colors uppercase">Instagram</a>
              <a href="#" className="text-[10px] tracking-wider text-white/25 hover:text-[#D4AF37] transition-colors uppercase">TikTok</a>
              <a href="https://twitter.com/Catalyst188" target="_blank" rel="noreferrer" className="text-[10px] tracking-wider text-white/25 hover:text-[#D4AF37] transition-colors uppercase">Twitter</a>
              <a href="#" className="text-[10px] tracking-wider text-white/25 hover:text-[#D4AF37] transition-colors uppercase">LinkedIn</a>
            </div>
          </div>

          {/* Agency */}
          <div>
            <h4 className="text-[9px] tracking-[0.35em] uppercase text-[#D4AF37] mb-6">Agency</h4>
            <ul className="space-y-3">
              {[
                { href: '/models', label: 'Our Models' },
                { href: '/services', label: 'Services' },
                { href: '/about', label: 'About Us' },
                { href: '/news', label: 'News & Stories' },
                { href: '/press', label: 'Press & Media' },
              ].map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-white/35 hover:text-[#D4AF37] transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Talent */}
          <div>
            <h4 className="text-[9px] tracking-[0.35em] uppercase text-[#D4AF37] mb-6">Talent</h4>
            <ul className="space-y-3">
              {[
                { href: '/models?category=Fashion', label: 'Fashion & Runway' },
                { href: '/models?category=Commercial', label: 'Commercial' },
                { href: '/models?category=Influencer', label: 'Influencers' },
                { href: '/models?category=Acting', label: 'Acting' },
                { href: '/apply', label: 'Apply to Join' },
              ].map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-white/35 hover:text-[#D4AF37] transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-[9px] tracking-[0.35em] uppercase text-[#D4AF37] mb-6">Contact</h4>
            <ul className="space-y-3 text-sm text-white/35">
              <li>Lagos Island, Lagos</li>
              <li>Nigeria</li>
              <li className="pt-2">
                <a href="mailto:info@catalysttalentslagos.com" className="hover:text-[#D4AF37] transition-colors break-all">
                  info@catalysttalentslagos.com
                </a>
              </li>
              <li>
                <a href="tel:+2347084111516" className="hover:text-[#D4AF37] transition-colors">
                  +234 708 411 1516
                </a>
              </li>
              <li className="pt-2">
                <Link href="/contact" className="text-[#D4AF37]/50 hover:text-[#D4AF37] transition-colors text-[10px] tracking-widest uppercase">
                  Send a message →
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/5 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-[10px] text-white/20">
            &copy; {year} Catalyst Talents Lagos. An extension of Catalyst Concepts.
          </p>
          <div className="flex gap-6">
            <Link href="/privacy" className="text-[10px] text-white/20 hover:text-white/40 transition-colors">Privacy Policy</Link>
            <span className="text-[10px] text-white/20">Lagos, Nigeria</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
