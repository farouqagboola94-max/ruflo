import Link from 'next/link'

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="bg-[#111111] border-t border-[#D4AF37]/10 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="mb-5">
              <span className="font-playfair text-2xl font-bold text-[#D4AF37] block">CATALYST</span>
              <span className="font-playfair text-xs text-[#D4AF37]/50 tracking-[0.3em] uppercase">
                Talents Lagos
              </span>
            </div>
            <p className="text-white/40 text-sm leading-relaxed max-w-xs">
              Illuminating models and talents from Lagos to the world. An extension of Catalyst
              Concepts — shaping the future of African fashion and entertainment.
            </p>
            <div className="flex gap-5 mt-6">
              {['Instagram', 'TikTok', 'Twitter'].map((s) => (
                <a
                  key={s}
                  href="#"
                  className="text-[10px] tracking-wider text-white/30 hover:text-[#D4AF37] transition-colors uppercase"
                >
                  {s}
                </a>
              ))}
            </div>
          </div>

          {/* Nav */}
          <div>
            <h4 className="text-[10px] tracking-[0.35em] uppercase text-[#D4AF37] mb-6">Navigate</h4>
            <ul className="space-y-3">
              {[
                { href: '/', label: 'Home' },
                { href: '/models', label: 'Our Models' },
                { href: '/about', label: 'About' },
                { href: '/apply', label: 'Apply' },
                { href: '/contact', label: 'Contact' },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-white/40 hover:text-[#D4AF37] transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-[10px] tracking-[0.35em] uppercase text-[#D4AF37] mb-6">Contact</h4>
            <ul className="space-y-3 text-sm text-white/40">
              <li>Lagos Island, Lagos</li>
              <li>Nigeria</li>
              <li className="pt-2">
                <a
                  href="mailto:info@catalysttalentslagos.com"
                  className="hover:text-[#D4AF37] transition-colors"
                >
                  info@catalysttalentslagos.com
                </a>
              </li>
              <li>
                <a href="tel:+2348000000000" className="hover:text-[#D4AF37] transition-colors">
                  +234 800 000 0000
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/5 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-xs text-white/20">
            © {year} Catalyst Talents Lagos. An extension of Catalyst Concepts.
          </p>
          <p className="text-xs text-white/20">Lagos, Nigeria</p>
        </div>
      </div>
    </footer>
  )
}
