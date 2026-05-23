import Link from 'next/link'

const SOCIAL_LINKS = [
  { label: 'Twitter / X', href: 'https://x.com/Catalyst188' },
  { label: 'Instagram', href: 'https://instagram.com/sneakersfest' },
  { label: 'TikTok', href: 'https://tiktok.com/@sneakersfest' },
]

export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-brand-dark mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-2xl">👟</span>
              <span className="font-display text-xl tracking-wider text-gradient">SNEAKERS<span className="text-white">FEST</span></span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed max-w-xs">
              Lagos' first dedicated sneaker festival. Physical exhibition, year-round online platform, community engine.
            </p>
            <p className="text-gray-500 text-sm mt-3">June 14–15, 2026 · Lagos, Nigeria</p>
            <div className="mt-4 text-xs text-gray-600 leading-relaxed">
              Founded by{' '}
              <a
                href="https://instagram.com/Catalystggg"
                target="_blank"
                rel="noopener noreferrer"
                className="text-brand-steel hover:text-white transition-colors"
              >
                Oluwatobiloba — The Catalyst
              </a>
              <br />
              Catalyst Concepts · Lagos, Nigeria
            </div>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Navigate</h4>
            <ul className="space-y-2">
              {[['/', 'Home'], ['/schedule', 'Schedule'], ['/catalog', 'Catalog'], ['/marketplace', 'Marketplace'], ['/fnp', 'FNP'], ['/tickets', 'Tickets'], ['/contact', 'Contact']].map(([href, label]) => (
                <li key={href}>
                  <Link href={href} className="text-gray-400 hover:text-brand-orange text-sm transition-colors">{label}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Find Us</h4>
            <ul className="space-y-3">
              {SOCIAL_LINKS.map(({ label, href }) => (
                <li key={label}>
                  <a href={href} target="_blank" rel="noopener noreferrer"
                    className="text-gray-400 hover:text-brand-orange text-sm transition-colors">
                    {label}
                  </a>
                </li>
              ))}
            </ul>
            <div className="mt-4 pt-4 border-t border-white/5">
              <p className="text-gray-600 text-xs uppercase tracking-wider mb-1">Friday Night Protocol</p>
              <p className="text-gray-500 text-xs">Every Friday · IG · X · TikTok · WA</p>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-gray-500 text-xs">© 2026 Sneakers Fest · Catalyst Concepts · All rights reserved.</p>
          <div className="flex gap-4">
            {SOCIAL_LINKS.map(({ label, href }) => (
              <a key={label} href={href} target="_blank" rel="noopener noreferrer"
                className="text-gray-500 hover:text-brand-orange text-xs transition-colors">
                {label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
