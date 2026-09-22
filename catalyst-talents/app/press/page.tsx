import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Press & Media | Catalyst Talents Lagos',
  description: 'Press resources, media enquiries, and contact information for Catalyst Talents Lagos.',
}

export default function PressPage() {
  return (
    <>
      {/* HEADER */}
      <section
        className="pt-40 pb-20 px-4 relative overflow-hidden"
        style={{ background: 'linear-gradient(180deg, #050505 0%, #0d0d0d 100%)' }}
      >
        <div
          className="absolute top-0 left-0 w-96 h-96 rounded-full opacity-5"
          style={{ background: 'radial-gradient(circle, #D4AF37, transparent 70%)' }}
        />
        <div className="max-w-4xl mx-auto relative z-10">
          <p className="text-gold text-xs tracking-[0.5em] uppercase mb-4">Media & Coverage</p>
          <h1 className="font-playfair text-5xl sm:text-7xl font-bold text-white mb-8">
            Press &
            <br />
            <span className="italic text-gold/80">Media</span>
          </h1>
          <p className="text-white/50 text-xl leading-relaxed max-w-2xl">
            Resources for journalists and content creators — press kit, media enquiries, and
            contact information for Catalyst Talents Lagos.
          </p>
        </div>
      </section>

      {/* PRESS KIT + CONTACT */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12">

          {/* Press Kit */}
          <div
            className="p-10 border border-gold/15 relative overflow-hidden"
            style={{ background: 'linear-gradient(135deg, #1a1208 0%, #2a1e0a 100%)' }}
          >
            <div
              className="absolute inset-0 opacity-10"
              style={{ backgroundImage: 'radial-gradient(circle at 80% 20%, #D4AF37 0%, transparent 50%)' }}
            />
            <div className="relative z-10">
              <p className="text-gold text-xs tracking-[0.4em] uppercase mb-4">Resources</p>
              <h2 className="font-playfair text-3xl font-bold text-white mb-4">Press Kit</h2>
              <p className="text-white/50 mb-8 leading-relaxed">
                Reach out to receive our press kit — including agency background, brand guidelines,
                talent profiles, and media-ready assets.
              </p>
              <ul className="space-y-3 mb-8">
                {[
                  'Agency overview & founding story',
                  'Brand guidelines & logo files',
                  'Talent biography cards',
                  'Agency photography & headshots',
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3 text-sm text-white/50">
                    <span className="text-gold mt-0.5 flex-shrink-0">—</span>
                    {item}
                  </li>
                ))}
              </ul>
              <Link
                href="/contact"
                className="inline-block px-8 py-4 bg-gold text-black font-bold text-xs tracking-widest uppercase hover:bg-gold-light transition-colors"
              >
                Request Press Kit
              </Link>
            </div>
          </div>

          {/* Press Contact */}
          <div className="p-10 border border-white/5">
            <p className="text-gold text-xs tracking-[0.4em] uppercase mb-4">Get in Touch</p>
            <h2 className="font-playfair text-3xl font-bold text-white mb-4">Press Contact</h2>
            <p className="text-white/50 mb-8 leading-relaxed">
              For interview requests, media enquiries, talent photography, or campaign case studies —
              our team is available Monday to Friday.
            </p>
            <div className="space-y-5 mb-10">
              <div>
                <p className="text-xs tracking-widest uppercase text-white/30 mb-1">Press & Media</p>
                <a href="mailto:press@catalysttalentslagos.com" className="text-white/70 hover:text-gold transition-colors text-sm">
                  press@catalysttalentslagos.com
                </a>
              </div>
              <div>
                <p className="text-xs tracking-widest uppercase text-white/30 mb-1">Bookings & Partnerships</p>
                <a href="mailto:bookings@catalysttalentslagos.com" className="text-white/70 hover:text-gold transition-colors text-sm">
                  bookings@catalysttalentslagos.com
                </a>
              </div>
              <div>
                <p className="text-xs tracking-widest uppercase text-white/30 mb-1">General</p>
                <a href="mailto:info@catalysttalentslagos.com" className="text-white/70 hover:text-gold transition-colors text-sm">
                  info@catalysttalentslagos.com
                </a>
              </div>
              <div>
                <p className="text-xs tracking-widest uppercase text-white/30 mb-1">Office Hours</p>
                <p className="text-white/50 text-sm">Monday – Friday, 9am – 6pm WAT</p>
              </div>
            </div>
            <Link
              href="/contact"
              className="inline-block px-8 py-4 border border-gold/30 text-gold text-xs tracking-widest uppercase hover:border-gold hover:bg-gold/10 transition-all"
            >
              Send a Message
            </Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-4 pb-24">
        <div className="max-w-xl mx-auto text-center">
          <h2 className="font-playfair text-4xl font-bold text-white mb-6">
            Work With Our Talent
          </h2>
          <p className="text-white/40 mb-8">
            Ready to book talent for your next campaign, editorial, or event?
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/models"
              className="px-10 py-4 bg-gold text-black font-semibold text-sm tracking-widest uppercase hover:bg-gold-light transition-colors"
            >
              Browse Models
            </Link>
            <Link
              href="/contact"
              className="px-10 py-4 border border-gold/30 text-gold text-sm tracking-widest uppercase hover:border-gold hover:bg-gold/10 transition-all"
            >
              Book Talent
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
