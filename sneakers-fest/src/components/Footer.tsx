import Link from 'next/link'

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
              The premier sneaker culture event. Two days of trading, showcasing, and celebrating everything kicks.
            </p>
            <p className="text-gray-500 text-sm mt-3">June 14–15, 2025 · Lagos Convention Centre</p>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Navigate</h4>
            <ul className="space-y-2">
              {[['/', 'Home'], ['/schedule', 'Schedule'], ['/catalog', 'Catalog'], ['/marketplace', 'Marketplace'], ['/tickets', 'Tickets']].map(([href, label]) => (
                <li key={href}>
                  <Link href={href} className="text-gray-400 hover:text-brand-orange text-sm transition-colors">{label}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Contact</h4>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li>info@sneakersfest.com</li>
              <li>+234 800 KICKS</li>
              <li className="pt-2">Lagos Convention Centre<br />Victoria Island, Lagos</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-gray-500 text-xs">© 2025 SneakersFest. All rights reserved.</p>
          <div className="flex gap-4">
            {['Twitter', 'Instagram', 'TikTok'].map(s => (
              <span key={s} className="text-gray-500 hover:text-brand-orange text-xs cursor-pointer transition-colors">{s}</span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
