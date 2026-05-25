import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Press & Media | Catalyst Talents Lagos',
  description: 'Press coverage, campaign highlights, and media resources for Catalyst Talents Lagos — Lagos premier modelling and talent agency.',
}

const pressFeatures = [
  {
    publication: 'Vogue Africa',
    headline: '"The Lagos Agencies Putting Nigerian Models on Global Radars"',
    excerpt: 'Catalyst Talents Lagos is at the forefront of a new wave of African representation, placing talent in campaigns that would previously have bypassed the continent entirely.',
    category: 'Feature',
    date: 'March 2026',
  },
  {
    publication: 'Business Day Nigeria',
    headline: '"How Catalyst Concepts Built a Talent Empire from Lagos"',
    excerpt: "The modelling and talent arm of Catalyst Concepts is quietly becoming one of West Africa's most formidable agencies — with a client list to match.",
    category: 'Interview',
    date: 'January 2026',
  },
  {
    publication: 'Guardian Life',
    headline: '"The Faces Defining Lagos Fashion Week 2025"',
    excerpt: "From the opening look to the closing walk, Catalyst Talents dominated the season — placing six of its models with the week's most anticipated shows.",
    category: 'Editorial',
    date: 'October 2025',
  },
  {
    publication: 'TechCabal',
    headline: '"Influencer Agencies Are Reinventing Nigerian Marketing"',
    excerpt: "With digital talent now driving measurable ROI for brands, Catalyst Talents' influencer division is becoming the first call for CMOs in Lagos.",
    category: 'Analysis',
    date: 'August 2025',
  },
  {
    publication: 'Nollywood Magazine',
    headline: '"The Agency Behind 2025\'s Breakout Talent"',
    excerpt: "Three of this year's most talked-about on-screen performances share one common factor: Catalyst Talents Lagos.",
    category: 'Profile',
    date: 'July 2025',
  },
  {
    publication: 'The Cable Lifestyle',
    headline: '"Lagos\' Most Booked Models of 2025"',
    excerpt: 'In a year of record bookings for Nigerian talent, Catalyst Talents Lagos accounts for four of the ten most in-demand models on the continent.',
    category: 'Ranking',
    date: 'December 2025',
  },
]

const campaigns = [
  {
    brand: 'Lagos Fashion Week',
    role: 'Official Talent Partner',
    year: '2025',
    detail: '14 models placed across 9 designer shows',
    gradient: 'linear-gradient(135deg, #1a0a2e 0%, #2d1b4e 100%)',
  },
  {
    brand: 'GTBank',
    role: 'Brand Campaign',
    year: '2025',
    detail: 'Lead talent for national banking campaign',
    gradient: 'linear-gradient(135deg, #093028 0%, #237a57 100%)',
  },
  {
    brand: 'Heineken Nigeria',
    role: 'Campaign & Events',
    year: '2024–25',
    detail: 'Ambassadors for seasonal campaigns and activations',
    gradient: 'linear-gradient(135deg, #0a1a0a 0%, #1a4020 100%)',
  },
  {
    brand: 'Zara (Africa)',
    role: 'Influencer Programme',
    year: '2025',
    detail: '3 influencers on seasonal content retainer',
    gradient: 'linear-gradient(135deg, #1a1a1a 0%, #3a3a3a 100%)',
  },
  {
    brand: 'House of Deola',
    role: 'Runway Talent',
    year: '2025',
    detail: 'Exclusive runway representation for all shows',
    gradient: 'linear-gradient(135deg, #0f0c29 0%, #302b63 100%)',
  },
  {
    brand: 'MTN Nigeria',
    role: 'Commercial Campaign',
    year: '2024',
    detail: 'Commercial talent for Q4 national campaign',
    gradient: 'linear-gradient(135deg, #1a1000 0%, #3a2800 100%)',
  },
]

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
            <span className="italic text-gold/80">Recognition</span>
          </h1>
          <p className="text-white/50 text-xl leading-relaxed max-w-2xl">
            Catalyst Talents Lagos in the media — press coverage, notable campaigns, and
            resources for journalists and content creators.
          </p>
        </div>
      </section>

      {/* PRESS FEATURES */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="mb-14">
            <p className="text-gold text-xs tracking-[0.4em] uppercase mb-3">As Seen In</p>
            <h2 className="font-playfair text-4xl sm:text-5xl font-bold text-white section-line">
              Media Coverage
            </h2>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {pressFeatures.map((item) => (
              <div
                key={item.headline}
                className="p-8 border border-white/5 hover:border-gold/20 transition-all duration-500 group"
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <span className="text-gold text-xs tracking-widest uppercase font-semibold">
                      {item.publication}
                    </span>
                    <span className="text-white/20 text-xs ml-3">· {item.date}</span>
                  </div>
                  <span className="text-[10px] tracking-widest uppercase text-white/20 border border-white/10 px-2 py-1">
                    {item.category}
                  </span>
                </div>
                <h3 className="font-playfair text-lg font-bold text-white mb-3 group-hover:text-gold/90 transition-colors leading-snug">
                  {item.headline}
                </h3>
                <p className="text-white/40 text-sm leading-relaxed">{item.excerpt}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CAMPAIGNS */}
      <section
        className="py-20 px-4"
        style={{ background: 'linear-gradient(135deg, #0d0d0d 0%, #111108 100%)' }}
      >
        <div className="max-w-7xl mx-auto">
          <div className="mb-14">
            <p className="text-gold text-xs tracking-[0.4em] uppercase mb-3">Our Work</p>
            <h2 className="font-playfair text-4xl sm:text-5xl font-bold text-white section-line">
              Notable Campaigns
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {campaigns.map((c) => (
              <div
                key={c.brand}
                className="p-8 border border-white/5 hover:border-gold/20 transition-all duration-500"
                style={{ background: c.gradient }}
              >
                <p className="text-white/30 text-[10px] tracking-widest uppercase mb-3">{c.year}</p>
                <h3 className="font-playfair text-2xl font-bold text-white mb-1">{c.brand}</h3>
                <p className="text-gold text-xs tracking-wider uppercase mb-4">{c.role}</p>
                <p className="text-white/45 text-sm">{c.detail}</p>
              </div>
            ))}
          </div>
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
                Download our press kit for high-resolution logos, brand guidelines, talent photography,
                and agency background materials.
              </p>
              <ul className="space-y-3 mb-8">
                {[
                  'Agency overview & founding story',
                  'High-res logo files (SVG, PNG)',
                  'Talent biography cards',
                  'Campaign photography samples',
                  'Executive headshots',
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
              For interview requests, media enquiries, campaign case studies, or talent photography — our
              press team is available Monday to Friday.
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
