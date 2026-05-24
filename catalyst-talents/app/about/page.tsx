import Link from 'next/link'

const values = [
  {
    icon: '◈',
    title: 'Authenticity',
    description:
      'We champion real stories, diverse bodies, and genuine personalities — no cookie-cutter beauty standards.',
  },
  {
    icon: '◉',
    title: 'Excellence',
    description:
      'We hold our talent and our service to the highest standard, from portfolio shoots to contract negotiations.',
  },
  {
    icon: '✦',
    title: 'Community',
    description:
      "Lagos is not just a location — it's an identity. We are proudly rooted in its culture, energy, and spirit.",
  },
  {
    icon: '◆',
    title: 'Opportunity',
    description:
      'We open doors — locally, continentally, and globally — for talent that would otherwise go undiscovered.',
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
  'Industry networking events',
]

export default function AboutPage() {
  return (
    <>
      {/* HEADER */}
      <section
        className="pt-40 pb-20 px-4 relative overflow-hidden"
        style={{ background: 'linear-gradient(180deg, #050505 0%, #0d0d0d 100%)' }}
      >
        <div
          className="absolute top-0 right-0 w-96 h-96 rounded-full opacity-5"
          style={{ background: 'radial-gradient(circle, #D4AF37, transparent 70%)' }}
        />
        <div className="max-w-4xl mx-auto relative z-10">
          <p className="text-gold text-xs tracking-[0.5em] uppercase mb-4">Our Story</p>
          <h1 className="font-playfair text-5xl sm:text-7xl font-bold text-white mb-8">
            About Catalyst
            <br />
            <span className="italic text-gold/80">Talents Lagos</span>
          </h1>
          <p className="text-white/50 text-xl leading-relaxed max-w-2xl">
            We are the talent & modelling division of Catalyst Concepts — a creative agency
            built in Lagos to amplify African excellence on the world stage.
          </p>
        </div>
      </section>

      {/* STORY */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div
            className="aspect-[4/3] relative"
            style={{
              background: 'linear-gradient(135deg, #1a1208 0%, #2a1e0a 40%, #0d0d07 100%)',
              border: '1px solid rgba(212, 175, 55, 0.15)',
            }}
          >
            <div
              className="absolute inset-0 opacity-20"
              style={{
                backgroundImage:
                  'linear-gradient(#D4AF37 1px, transparent 1px), linear-gradient(90deg, #D4AF37 1px, transparent 1px)',
                backgroundSize: '40px 40px',
              }}
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <span className="font-playfair text-6xl font-bold gold-text block">CTL</span>
                <span className="text-white/20 text-xs tracking-[0.5em] uppercase mt-2 block">
                  Est. Lagos
                </span>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <h2 className="font-playfair text-3xl sm:text-4xl font-bold text-white">
              From Concept to Catalyst
            </h2>
            <p className="text-white/50 leading-relaxed">
              Catalyst Concepts was founded with a singular vision: to create, connect, and
              amplify creative talent from Nigeria to the world. Through events, campaigns, and
              brand partnerships, we built a reputation for excellence in Lagos' creative scene.
            </p>
            <p className="text-white/50 leading-relaxed">
              As our network of extraordinary individuals grew, we recognised a gap: Lagos had
              world-class models, actors, and influencers who lacked structured representation
              and the infrastructure to compete on a global stage.
            </p>
            <p className="text-white/50 leading-relaxed">
              Catalyst Talents Lagos was born to fill that gap — a full-service talent division
              dedicated to discovering, developing, and deploying Lagos' finest on the world's
              biggest stages.
            </p>
            <div className="pt-4">
              <div className="h-px w-16 bg-gold mb-4" />
              <p className="text-gold font-playfair italic text-lg">
                "Lagos has always had the talent. Now it has the platform."
              </p>
            </div>
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
            <p className="text-gold text-xs tracking-[0.4em] uppercase mb-3">What Drives Us</p>
            <h2 className="font-playfair text-4xl sm:text-5xl font-bold text-white section-line">
              Our Values
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((v) => (
              <div
                key={v.title}
                className="p-8 border border-white/5 hover:border-gold/20 transition-colors duration-500"
              >
                <span className="text-gold text-2xl block mb-4">{v.icon}</span>
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
              <p className="text-gold text-xs tracking-[0.4em] uppercase mb-3">What We Provide</p>
              <h2 className="font-playfair text-4xl sm:text-5xl font-bold text-white mb-8 section-line">
                What We Offer
                <br />
                Our Talent
              </h2>
              <p className="text-white/50 leading-relaxed mb-6">
                Signing with Catalyst Talents Lagos means joining a team that is as invested in
                your success as you are. We provide end-to-end support:
              </p>
              <ul className="space-y-3">
                {offerings.map((item) => (
                  <li key={item} className="flex items-start gap-3 text-sm text-white/60">
                    <span className="text-gold mt-0.5 flex-shrink-0">—</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex flex-col justify-center space-y-8">
              {[
                { number: '50+', label: 'Signed Talents' },
                { number: '200+', label: 'Bookings Secured' },
                { number: '30+', label: 'Brand Partners' },
                { number: '4', label: 'Talent Divisions' },
              ].map((stat) => (
                <div key={stat.label} className="flex items-end gap-4">
                  <span className="font-playfair text-5xl font-bold gold-text">{stat.number}</span>
                  <span className="text-white/40 text-sm tracking-wider uppercase pb-2">{stat.label}</span>
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
            Be Part of the Story
          </h2>
          <p className="text-white/40 mb-8">
            Whether you're a brand looking to book talent or a model ready to be represented —
            Catalyst Talents Lagos is your home.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/apply"
              className="px-10 py-4 bg-gold text-black font-semibold text-sm tracking-widest uppercase hover:bg-gold-light transition-colors"
            >
              Apply to Join
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
