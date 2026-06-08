export default function VenueMap() {
  return (
    <section className="py-20 bg-brand-gray">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <p className="text-brand-orange text-sm font-semibold uppercase tracking-wider mb-2">Location</p>
          <h2 className="font-display text-4xl sm:text-5xl text-white">FIND US</h2>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
          <div className="bg-brand-dark rounded-2xl p-6 border border-white/5 flex flex-col gap-5">
            <div>
              <p className="text-brand-orange text-xs font-semibold uppercase tracking-wider mb-1">Venue</p>
              <p className="text-white font-bold text-lg">Muri Okunola Park</p>
              <p className="text-gray-400 text-sm mt-1">Victoria Island<br />Lagos, Nigeria</p>
            </div>
            <div>
              <p className="text-brand-orange text-xs font-semibold uppercase tracking-wider mb-1">Date &amp; Time</p>
              <p className="text-white font-bold">December 12, 2026</p>
              <p className="text-gray-400 text-sm">9:00 AM &ndash; 8:00 PM</p>
            </div>
            <div>
              <p className="text-brand-orange text-xs font-semibold uppercase tracking-wider mb-2">Getting There</p>
              <ul className="space-y-1.5 text-sm text-gray-400">
                <li>🚌 BRT &mdash; VI Bus Stop</li>
                <li>🚗 Bolt / Uber to Muri Okunola Park</li>
                <li>🅿️ Parking available nearby</li>
              </ul>
            </div>
          </div>
          <div className="lg:col-span-2 rounded-2xl overflow-hidden border border-white/5" style={{ minHeight: '320px' }}>
            <iframe
              title="Muri Okunola Park, Victoria Island Lagos"
              src="https://www.openstreetmap.org/export/embed.html?bbox=3.4020%2C6.4250%2C3.4320%2C6.4420&layer=mapnik&marker=6.4310%2C3.4172"
              className="w-full h-full"
              style={{ minHeight: '320px', filter: 'invert(90%) hue-rotate(180deg)' }}
              loading="lazy"
            />
          </div>
        </div>
      </div>
    </section>
  )
}
