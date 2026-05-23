import Link from 'next/link'

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="bg-[#0d0d0d] border-t border-[#D4AF37]/10 pt-20 pb-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-12 mb-16">
          {/* Brand */}
          <div className="lg:col-span-2">
            <div className="mb-5">
              <span className="font-playfair text-2xl font-bold text-[#D4AF37] block leading-none">
                CATALYST
              </span>
              <span className="font-playfair text-[10px] text-[#D4AF37]/50 tracking-[0.3em] uppercase mt-1 block">
                Talents Lagos
              </span>
            </div>
            <p className="text-white/35 text-sm leading-relaxed max-w-xs mb-6">
              Illuminating models and talents from Lagos to the world. An extension of Catalyst
              Concepts — shaping the future of African fashion and entertainment.
            </p>
            <div className="flex flex-wrap gap-5">
              {['Instagram', 'TikTok', 'Twitter', 'LinkedIn'].map((s) => (
                <a
                  key={s}
                  href="#"
                  className="text-[10px] tracking-wider text-white/25 hover:text-[#D4AF37] transition-colors uppercase"
                >
                  {s}
                </a>
              ))}
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
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-white/35 hover:text-[#D4AF37] transition-colors"
                  >
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
                  <Link
                    href={link.href}
                    className="text-sm text-white/35 hover:text-[#D4AF37] transition-colors"
                  >
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
                <a
                  href="mailto:info@catalysttalentslagos.com"
                  className="hover:text-[#D4AF37] transition-colors break-all"
                >
                  info@catalysttalentslagos.com
                </a>
              </li>
              <li>
                <a href="tel:+2348000000000" className="hover:text-[#D4AF37] transition-colors">
                  +234 800 000 0000
                </a>
              </li>
              <li className="pt-2">
                <Link
                  href="/contact"
                  className="text-[#D4AF37]/50 hover:text-[#D4AF37] transition-colors text-[10px] tracking-widest uppercase"
                >
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
          <p className="text-[10px] text-white/20">Lagos, Nigeria</p>
        </div>
      </div>
    </footer>
  )
}
