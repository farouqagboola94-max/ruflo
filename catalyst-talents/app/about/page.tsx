import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'About Us | Catalyst Talents Lagos',
  description:
    'Learn the story behind Catalyst Talents Lagos — the talent management division of Catalyst Concepts, built in Lagos for the world.',
}

const beliefs = [
  {
    statement: 'Lagos produces world-class talent.',
    detail:
      'This is not aspiration. It is fact. Our city has always had it — the looks, the presence, the range. We are here to make sure the world sees it on the right terms.',
  },
  {
    statement: 'Welfare is not a benefit. It is the foundation.',
    detail:
      'Every decision — every deal, every contract, every campaign — starts with one question: is this right for the person we represent? The human comes before the booking.',
  },
  {
    statement: 'Culture is competitive advantage.',
    detail:
      'The Nigerian identity — our look, our language, our energy — is not something to dilute for international rooms. It is our greatest export. We never ask our talent to be less.',
  },
  {
    statement: 'Honesty builds more than hype.',
    detail:
      'We are new. We say that clearly and without embarrassment. What we have is a genuine commitment, a welfare-first approach, and a city full of people who deserve better representation.',
  },
]

const values = [
  {
    icon: '◈',
    title: 'Authenticity',
    description:
      'We champion real stories, diverse looks, and genuine personalities — no cookie-cutter standards, no compromise of identity.',
  },
  {
    icon: '◉',
    title: 'Welfare First',
    description:
      'Talent wellbeing is not a side note. It is the foundation. Every decision we make puts the human before the booking.',
  },
  {
    icon: '✦',
    title: 'Community',
    description:
      'Lagos is not just a location — it is an identity. We are proudly rooted in its culture, energy, and creative force.',
  },
  {
    icon: '◆',
    title: 'Opportunity',
    description:
      'We open doors — locally, across Africa, and globally — for talent that deserves a platform that takes them seriously.',
  },
]

const offerings = [
  'Portfolio development & professional shoots',
  'Contract negotiation & legal support',
  'Brand partnership matching',
  'Career strategy & coaching',
  'Social media growth guidance',
  'International booking connections',
  'Runway & acting coaching referrals',
  'Industry networking & introductions',
]

export default function AboutPage() {
  return (
    <>
      {/* HEADER */}
      <section
        className="pt-40 pb-20 px-4 relative overflow-hidden"
        style={{
          background: 'linear-gradient(160deg, #020602 0%, #050505 100%)',
        }}
      >
        {/* Aso-oke texture overlay */}
        <div className="absolute inset-0 aso-oke-texture pointer-events-none" />
        {/* Gold left accent */}
        <div
          className="absolute left-0 inset-y-0 w-[2px]"
          style={{
            background:
              'linear-gradient(to bottom, transparent 0%, #D4AF37 35%, #D4AF37 65%, transparent 100%)',
          }}
        />
        <div
          className="absolute top-0 right-0 w-96 h-96 rounded-full opacity-5"
          style={{ background: 'radial-gradient(circle, #D4AF37, transparent 70%)' }}
        />
        <div className="max-w-4xl mx-auto relative z-10">
          <p className="text-[#D4AF37] text-xs tracking-[0.5em] uppercase mb-4">Our Story</p>
          <h1 className="font-playfair text-5xl sm:text-7xl font-bold text-white mb-8">
            About Catalyst
            <br />
            <span className="italic text-[#D4AF37]/80">Talents Lagos</span>
          </h1>
          <p className="text-white/45 text-xl leading-relaxed max-w-2xl">
            A new talent management agency. A Lagos-first creative platform. A division of Catalyst
            Concepts built around one truth: this city&apos;s talent has always deserved better
            representation — and now it has it.
          </p>
        </div>
      </section>

      {/* STORY */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="relative overflow-hidden aspect-[4/3]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/catalyst-dragon.jpg"
              alt="The Catalyst — Catalyst Concepts, Lagos 2026"
              className="w-full h-full object-cover"
              style={{ filter: 'brightness(0.88) contrast(1.05)' }}
            />
            <div
              className="absolute inset-x-0 bottom-0 p-5"
              style={{ background: 'linear-gradient(transparent, rgba(5,5,5,0.92))' }}
            >
              <p className="text-[#D4AF37]/50 text-[9px] tracking-[0.4em] uppercase">
                Catalyst Concepts · Main Headquarters · Lagos · 2026
              </p>
            </div>
          </div>

          <div className="space-y-6">
            <h2 className="font-playfair text-3xl sm:text-4xl font-bold text-white">
              We&apos;re Just Getting Started
            </h2>
            <p className="text-white/50 leading-relaxed">
              Catalyst Concepts was founded with a singular vision: to create, connect, and amplify
              creative talent from Nigeria to the world. Through events, campaigns, and brand work,
              we built relationships with extraordinary people — models, actors, influencers, and
              commercial talent who had everything it takes, but lacked structured professional
              representation.
            </p>
            <p className="text-white/50 leading-relaxed">
              Catalyst Talents Lagos was built to fill that gap. We are a new agency — and we say
              that honestly. We are not pointing you to decades of bookings or a roster of household
              names. What we have is a clear commitment: to represent talent with genuine care,
              professional rigour, and a welfare-first approach from day one.
            </p>
            <p className="text-white/50 leading-relaxed">
              We are open for talent registrations and brand partnerships. Everything we do from
              here is about building something that Lagos talent deserves — and has been waiting for.
            </p>
            <div className="pt-4">
              <div className="h-px w-16 bg-[#D4AF37] mb-4" />
              <p className="text-[#D4AF37] font-playfair italic text-lg">
                &ldquo;Lagos has always had the talent. Now it has the platform.&rdquo;
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* WHAT WE BELIEVE */}
      <section
        className="py-24 px-4 relative overflow-hidden"
        style={{ background: '#010301' }}
      >
        {/* Aso-oke texture overlay */}
        <div className="absolute inset-0 aso-oke-texture pointer-events-none" />
        {/* Gold left accent */}
        <div
          className="absolute left-0 inset-y-0 w-[2px]"
          style={{
            background:
              'linear-gradient(to bottom, transparent 0%, #D4AF37 30%, #D4AF37 70%, transparent 100%)',
          }}
        />
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="mb-16">
            <p className="text-[#D4AF37] text-[10px] tracking-[0.5em] uppercase mb-3">
              Our Principles
            </p>
            <h2 className="font-playfair text-4xl sm:text-5xl font-bold text-white">
              What We Believe
              <span className="block w-14 h-px bg-[#D4AF37] mt-4" />
            </h2>
          </div>
          <div
            className="grid grid-cols-1 lg:grid-cols-2 gap-px"
            style={{ background: 'rgba(212,175,55,0.07)' }}
          >
            {beliefs.map((b, i) => (
              <div
                key={i}
                className="p-10 lg:p-14 group"
                style={{ background: '#010301' }}
              >
                <p className="font-playfair text-xl sm:text-2xl font-bold text-white mb-4 leading-tight group-hover:text-[#D4AF37] transition-colors duration-500">
                  &ldquo;{b.statement}&rdquo;
                </p>
                <p className="text-white/35 text-sm leading-relaxed">{b.detail}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* VALUES */}
      <section
        className="py-20 px-4"
        style={{ background: 'linear-gradient(135deg, #0d0d0d 0%, #111108 100%)' }}
      >
        <div className="max-w-7xl mx-auto">
          <div className="mb-16">
            <p className="text-[#D4AF37] text-xs tracking-[0.4em] uppercase mb-3">What Drives Us</p>
            <h2 className="font-playfair text-4xl sm:text-5xl font-bold text-white section-line">
              Our Values
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((v) => (
              <div
                key={v.title}
                className="p-8 border border-white/5 hover:border-[#D4AF37]/20 transition-colors duration-500"
              >
                <span className="text-[#D4AF37] text-2xl block mb-4">{v.icon}</span>
                <h3 className="font-playfair text-xl font-bold text-white mb-3">{v.title}</h3>
                <p className="text-white/40 text-sm leading-relaxed">{v.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* WHAT WE OFFER */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            <div>
              <p className="text-[#D4AF37] text-xs tracking-[0.4em] uppercase mb-3">What We Provide</p>
              <h2 className="font-playfair text-4xl sm:text-5xl font-bold text-white mb-8 section-line">
                What We Offer
                <br />
                Our Talent
              </h2>
              <p className="text-white/50 leading-relaxed mb-6">
                Signing with Catalyst Talents Lagos means joining a team that is as invested in
                your success as you are. We provide end-to-end support from the moment you join:
              </p>
              <ul className="space-y-3">
                {offerings.map((item) => (
                  <li key={item} className="flex items-start gap-3 text-sm text-white/60">
                    <span className="text-[#D4AF37] mt-0.5 flex-shrink-0">&mdash;</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex flex-col justify-center space-y-8">
              {[
                { number: '4', label: 'Talent Divisions' },
                { number: 'Open', label: 'Registrations' },
                { number: 'Open', label: 'Brand Deals' },
                { number: 'Lagos', label: 'Our Home' },
              ].map((stat) => (
                <div key={stat.label} className="flex items-end gap-4">
                  <span className="font-playfair text-5xl font-bold gold-text">{stat.number}</span>
                  <span className="text-white/40 text-sm tracking-wider uppercase pb-2">
                    {stat.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-4 pb-24">
        <div className="max-w-xl mx-auto text-center">
          <h2 className="font-playfair text-4xl font-bold text-white mb-6">
            Be Part of What We&apos;re Building
          </h2>
          <p className="text-white/40 mb-8">
            Whether you&apos;re a brand looking to book talent or a model ready to be represented —
            Catalyst Talents Lagos is open. Now.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/apply"
              className="px-10 py-4 bg-[#D4AF37] text-black font-semibold text-sm tracking-widest uppercase hover:bg-[#F0D060] transition-colors"
            >
              Apply to Join
            </Link>
            <Link
              href="/booking"
              className="px-10 py-4 border border-[#D4AF37]/30 text-[#D4AF37] text-sm tracking-widest uppercase hover:border-[#D4AF37] hover:bg-[#D4AF37]/10 transition-all"
            >
              Book Talent
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
