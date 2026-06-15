import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Brand Partnerships | Catalyst Talents Lagos',
  description:
    'Partner with Catalyst Talents Lagos. Access Lagos-based models, influencers, and commercial talent for campaigns, brand ambassadorships, events, and content creation.',
}

const packages = [
  {
    id: 'campaign',
    icon: '◈',
    title: 'Campaign Partner',
    summary: 'One-off shoots, lookbooks, and print campaigns.',
    includes: [
      'Talent casting from our roster',
      'Contract negotiation and execution',
      'Shoot-day coordination and support',
      'Rights management and usage terms',
    ],
    ideal: 'Brands running seasonal campaigns, editorial shoots, or one-time productions.',
  },
  {
    id: 'ambassador',
    icon: '◉',
    title: 'Brand Ambassador',
    summary: 'Long-term talent representation for your brand.',
    includes: [
      'Exclusive or semi-exclusive placement',
      'Social media presence and content',
      'Event and activation appearances',
      'Full contract and ongoing management',
    ],
    ideal: 'Brands that want a consistent face representing them over months or a full year.',
  },
  {
    id: 'event',
    icon: '✦',
    title: 'Event & Activation',
    summary: 'Talent for live events, runway, and brand activations.',
    includes: [
      'Models and presenters for live events',
      'Runway talent for fashion shows',
      'Brand activations and product launches',
      'On-site coordination and management',
    ],
    ideal: 'Fashion shows, product launches, corporate events, and experiential activations.',
  },
  {
    id: 'content',
    icon: '◆',
    title: 'Content & Creator',
    summary: 'Digital-first influencer and content collaborations.',
    includes: [
      'Influencer and creator matching',
      'Social media content production',
      'Audience-aligned talent selection',
      'Campaign brief and delivery management',
    ],
    ideal: 'Brands building social media presence or launching digital-first campaigns.',
  },
]

const whys = [
  {
    title: 'Lagos-Rooted Talent',
    body: 'Our talent lives and works in Lagos. They bring authentic local identity to every campaign — something a stock image or imported talent simply cannot replicate.',
  },
  {
    title: 'Fully Managed',
    body: 'We handle contracts, availability, rates, briefing, and on-set coordination. You brief us once and focus on your creative vision.',
  },
  {
    title: 'Welfare-First Talent',
    body: 'Our talent is signed under fair contracts and properly represented. They show up prepared, professional, and ready to deliver.',
  },
  {
    title: 'Transparent & Honest',
    body: 'We are a new agency. What we guarantee is professional execution on every booking we accept — and we only accept what we can deliver.',
  },
]

const steps = [
  { step: '01', title: 'Submit Your Brief', body: 'Tell us the project, timeline, budget, and the type of talent you need. We respond within 48 hours.' },
  { step: '02', title: 'We Curate a Shortlist', body: 'We handpick talent from the roster that matches your brief, aesthetic, and target audience.' },
  { step: '03', title: 'You Choose', body: 'We send you full profiles and rates for your shortlist. You select. We handle the paperwork.' },
  { step: '04', title: 'We Deliver', body: 'Contracts, scheduling, briefing, and coordination handled end to end. Your vision, our execution.' },
]

export default function PartnershipsPage() {
  return (
    <>
      {/* HEADER */}
      <section
        className="pt-40 pb-20 px-4 relative overflow-hidden"
        style={{ background: 'linear-gradient(180deg, #050505 0%, #0d0d0d 100%)' }}
      >
        <div
          className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full opacity-[0.04]"
          style={{ background: 'radial-gradient(circle, #D4AF37, transparent 70%)' }}
        />
        <div className="max-w-4xl mx-auto relative z-10">
          <p className="text-[#D4AF37] text-[10px] tracking-[0.5em] uppercase mb-4">For Brands &amp; Clients</p>
          <h1 className="font-playfair text-5xl sm:text-7xl font-bold text-white mb-6 leading-tight">
            Partner With
            <br />
            <span className="italic text-[#D4AF37]/80">Lagos Talent</span>
          </h1>
          <p className="text-white/50 text-xl leading-relaxed max-w-2xl">
            Access professional models, influencers, and commercial talent from Lagos —
            fully managed and ready for campaigns, events, and brand partnerships.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 mt-10">
            <Link
              href="/booking"
              className="px-10 py-4 bg-[#D4AF37] text-black font-bold text-xs tracking-widest uppercase hover:bg-[#F0D060] transition-colors"
            >
              Submit a Brief
            </Link>
            <Link
              href="/models"
              className="px-10 py-4 border border-[#D4AF37]/30 text-[#D4AF37] text-xs tracking-widest uppercase hover:border-[#D4AF37] hover:bg-[#D4AF37]/10 transition-all"
            >
              Browse Talent
            </Link>
          </div>
        </div>
      </section>

      {/* WHY US */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="mb-14">
            <p className="text-[#D4AF37] text-[10px] tracking-[0.4em] uppercase mb-3">Why Catalyst Talents Lagos</p>
            <h2 className="font-playfair text-4xl sm:text-5xl font-bold text-white">
              What You Get When You Work With Us
              <span className="block w-14 h-px bg-[#D4AF37] mt-4" />
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {whys.map((w) => (
              <div
                key={w.title}
                className="p-8 border border-white/5 hover:border-[#D4AF37]/20 transition-colors duration-500"
              >
                <h3 className="font-playfair text-lg font-bold text-white mb-3">{w.title}</h3>
                <p className="text-white/40 text-sm leading-relaxed">{w.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PACKAGES */}
      <section
        className="py-20 px-4"
        style={{ background: 'linear-gradient(135deg, #0d0d0d 0%, #111108 100%)' }}
      >
        <div className="max-w-7xl mx-auto">
          <div className="mb-14">
            <p className="text-[#D4AF37] text-[10px] tracking-[0.4em] uppercase mb-3">Partnership Types</p>
            <h2 className="font-playfair text-4xl sm:text-5xl font-bold text-white">
              Ways to Work Together
              <span className="block w-14 h-px bg-[#D4AF37] mt-4" />
            </h2>
            <p className="text-white/40 mt-4 max-w-lg">
              Every partnership is tailored to your brief. These are the primary formats we work in —
              pricing is always discussed directly based on your scope.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {packages.map((pkg) => (
              <div
                key={pkg.id}
                className="p-10 border border-white/5 hover:border-[#D4AF37]/20 transition-colors duration-500"
              >
                <span className="text-[#D4AF37] text-2xl block mb-5">{pkg.icon}</span>
                <h3 className="font-playfair text-2xl font-bold text-white mb-2">{pkg.title}</h3>
                <p className="text-white/50 mb-6 leading-relaxed">{pkg.summary}</p>
                <ul className="space-y-2 mb-8">
                  {pkg.includes.map((item) => (
                    <li key={item} className="flex items-start gap-3 text-sm text-white/40">
                      <span className="text-[#D4AF37] mt-0.5 flex-shrink-0">&mdash;</span>
                      {item}
                    </li>
                  ))}
                </ul>
                <p className="text-white/25 text-xs italic mb-6">Ideal for: {pkg.ideal}</p>
                <Link
                  href="/booking"
                  className="text-xs tracking-widest uppercase text-[#D4AF37]/60 hover:text-[#D4AF37] border-b border-[#D4AF37]/20 hover:border-[#D4AF37] pb-0.5 transition-colors"
                >
                  Enquire about this &rarr;
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="mb-14">
            <p className="text-[#D4AF37] text-[10px] tracking-[0.4em] uppercase mb-3">The Process</p>
            <h2 className="font-playfair text-4xl sm:text-5xl font-bold text-white">
              From Brief to Booking
              <span className="block w-14 h-px bg-[#D4AF37] mt-4" />
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((s, i, arr) => (
              <div key={s.step} className="relative">
                {i < arr.length - 1 && (
                  <div className="hidden lg:block absolute top-6 left-full w-full h-px bg-[#D4AF37]/10 z-0" />
                )}
                <div className="relative z-10">
                  <span className="font-playfair text-5xl font-bold text-[#D4AF37]/15 block mb-4">
                    {s.step}
                  </span>
                  <h3 className="font-playfair text-lg font-bold text-white mb-3">{s.title}</h3>
                  <p className="text-white/40 text-sm leading-relaxed">{s.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* OPEN TO ALL DEALS */}
      <section
        className="py-20 px-4"
        style={{ background: 'linear-gradient(135deg, #1a1208 0%, #2a1e0a 100%)' }}
      >
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <p className="text-[#D4AF37] text-[10px] tracking-[0.4em] uppercase mb-4">Open to All Deals</p>
              <h2 className="font-playfair text-4xl sm:text-5xl font-bold text-white mb-6">
                Don&apos;t See What You Need?
              </h2>
              <p className="text-white/50 leading-relaxed mb-6">
                We are open to all forms of collaboration. If you have a project in mind that
                doesn&apos;t fit neatly into a category — a long-term partnership, a licensing
                arrangement, a co-production — reach out. We are at the beginning of building
                something, and we are open to building it together with the right partners.
              </p>
              <p className="text-white/30 text-sm leading-relaxed">
                Pricing is always discussed directly and tailored to the scope of the project.
                There are no fixed rate cards — every deal is bespoke.
              </p>
            </div>
            <div className="space-y-4">
              <Link
                href="/booking"
                className="w-full flex items-center justify-between px-8 py-5 bg-[#D4AF37] text-black font-bold text-xs tracking-widest uppercase hover:bg-[#F0D060] transition-colors group"
              >
                Submit a Project Brief
                <span className="group-hover:translate-x-1 transition-transform">&rarr;</span>
              </Link>
              <Link
                href="/contact"
                className="w-full flex items-center justify-between px-8 py-5 border border-[#D4AF37]/30 text-[#D4AF37] text-xs tracking-widest uppercase hover:border-[#D4AF37] hover:bg-[#D4AF37]/10 transition-all group"
              >
                Send Us a Message
                <span className="group-hover:translate-x-1 transition-transform">&rarr;</span>
              </Link>
              <a
                href="mailto:farouqagboola94@gmail.com"
                className="w-full flex items-center justify-between px-8 py-5 border border-white/5 text-white/40 text-xs tracking-widest uppercase hover:text-[#D4AF37] hover:border-white/10 transition-all group"
              >
                Direct to Founder &mdash; farouqagboola94@gmail.com
                <span className="group-hover:translate-x-1 transition-transform">&rarr;</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* BOTTOM CTA */}
      <section className="py-16 px-4 pb-28">
        <div className="max-w-xl mx-auto text-center">
          <div className="w-14 h-px bg-[#D4AF37] mx-auto mb-10" />
          <h2 className="font-playfair text-4xl font-bold text-white mb-4">
            Ready to Work With Lagos Talent?
          </h2>
          <p className="text-white/40 mb-8">
            Browse our current roster or send a brief. We respond personally within 48 hours.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/models"
              className="px-10 py-4 bg-[#D4AF37] text-black font-bold text-xs tracking-widest uppercase hover:bg-[#F0D060] transition-colors"
            >
              Browse Models
            </Link>
            <Link
              href="/booking"
              className="px-10 py-4 border border-[#D4AF37]/30 text-[#D4AF37] text-xs tracking-widest uppercase hover:border-[#D4AF37] hover:bg-[#D4AF37]/10 transition-all"
            >
              Book Talent
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
