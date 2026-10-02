import Link from 'next/link'
import { FaInstagram, FaTiktok } from 'react-icons/fa6'
import { EVENT_FACTS } from '@/data/eventFacts'

const SOCIAL_LINKS = [
  { label: 'Instagram', href: EVENT_FACTS.instagramUrl, Icon: FaInstagram },
  { label: 'TikTok', href: EVENT_FACTS.tiktokUrl, Icon: FaTiktok },
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
              Online-first sneaker and youth culture platform, building toward a physical gathering in Lagos.
            </p>
            <p className="text-gray-500 text-sm mt-3">December 12, 2026 &middot; Lagos, venue to be announced</p>
            <div className="mt-4 text-xs text-gray-600 leading-relaxed">
              Founded by{' '}
              <a
                href="https://instagram.com/Catalystggg"
                target="_blank"
                rel="noopener noreferrer"
                className="text-brand-steel hover:text-white transition-colors"
              >
                Oluwatobiloba &mdash; The Catalyst
              </a>
              <br />
              Catalyst Concepts &middot; Lagos, Nigeria
            </div>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Navigate</h4>
            <ul className="space-y-2">
              {[['/', 'Home'], ['/schedule', 'Schedule'], ['/catalog', 'Catalog'], ['/marketplace', 'Marketplace'], ['/fnp', 'FNP'], ['/vendors', 'Vendors'], ['/tickets', 'Tickets'], ['/sponsors', 'Partners'], ['/contact', 'Contact'], ['/profile', 'My account'], ['/privacy', 'Privacy'], ['/terms', 'Terms']].map(([href, label]) => (
                <li key={href}>
                  <Link href={href} className="text-gray-400 hover:text-brand-orange text-sm transition-colors">{label}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Find Us</h4>
            <ul className="space-y-3">
              {SOCIAL_LINKS.map(({ label, href, Icon }) => (
                <li key={label}>
                  <a href={href} target="_blank" rel="noopener noreferrer"
                    className="text-gray-400 hover:text-brand-orange text-sm transition-colors">
                    <Icon aria-hidden="true" className="mr-2 inline-block" />{label}
                  </a>
                </li>
              ))}
            </ul>
            <div className="mt-6 pt-5 border-t border-white/5">
              <p className="text-gray-600 text-xs uppercase tracking-wider mb-2">Talent & Models</p>
              <a
                href="https://catalyst-talents-agnecy.netlify.app"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-brand-orange text-sm transition-colors block"
              >
                Catalyst Talents Lagos &rarr;
              </a>
              <p className="text-gray-600 text-xs mt-1">Official talent platform</p>
            </div>
            <div className="mt-4 pt-4 border-t border-white/5">
              <p className="text-gray-600 text-xs uppercase tracking-wider mb-1">Friday Night Protocol</p>
              <p className="text-gray-500 text-xs">Follow the official Instagram and TikTok pages for Friday sessions.</p>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-gray-500 text-xs">&copy; 2026 Sneakers Fest &middot; Catalyst Concepts &middot; All rights reserved.</p>
          <div className="flex gap-4">
            {SOCIAL_LINKS.map(({ label, href, Icon }) => (
              <a key={label} href={href} target="_blank" rel="noopener noreferrer"
                className="text-gray-500 hover:text-brand-orange text-xs transition-colors">
                <Icon aria-hidden="true" className="mr-2 inline-block" />{label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
