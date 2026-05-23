import Link from 'next/link'
import ModelCard from '@/components/ModelCard'
import { models } from '@/data/models'

const categories = [
  {
    id: 'fashion',
    label: 'Fashion & Runway',
    description: 'Editorial, couture, and runway models who command every stage.',
    icon: '✦',
    gradient: 'linear-gradient(135deg, #1a0a2e 0%, #2d1b4e 100%)',
  },
  {
    id: 'commercial',
    label: 'Commercial & Brand',
    description: 'Versatile faces for campaigns, print, and brand ambassadorships.',
    icon: '◈',
    gradient: 'linear-gradient(135deg, #0d1b0d 0%, #1a3320 100%)',
  },
  {
    id: 'influencer',
    label: 'Influencers & Creators',
    description: 'Digital-native talents reshaping culture across social platforms.',
    icon: '◉',
    gradient: 'linear-gradient(135deg, #1a0a0a 0%, #3d1515 100%)',
  },
  {
    id: 'acting',
    label: 'Acting & Presenting',
    description: 'Compelling performers for film, television, and live events.',
    icon: '◆',
    gradient: 'linear-gradient(135deg, #0a1a1a 0%, #153d3d 100%)',
  },
]

export default function HomePage() {
  const featured = models.filter((m) => m.featured)

  return (
    <>
      {/* HERO */}
      <section
        className="relative min-h-screen flex items-center justify-center overflow-hidden"
        style={{
          background:
            'linear-gradient(135deg, #000000 0%, #0a0a0a 40%, #111008 70%, #0a0a0a 100%)',
        }}
      >
        {/* Decorative grid lines */}
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage:
              'linear-gradient(#D4AF37 1px, transparent 1px), linear-gradient(90deg, #D4AF37 1px, transparent 1px)',
            backgroundSize: '80px 80px',
          }}
        />

        {/* Gold orb */}
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full opacity-5"
          style={{
            background:
              'radial-gradient(circle, #D4AF37 0%, transparent 70%)',
          }}
        />

        <div className="relative z-10 text-center px-4 max-w-5xl mx-auto pt-20">
          <p className="text-gold text-xs tracking-[0.5em] uppercase mb-6 font-inter">
            A Catalyst Concepts Extension
          </p>

          <h1 className="font-playfair text-5xl sm:text-7xl lg:text-8xl font-bold text-white leading-tight mb-6">
            Where Lagos
            <br />
            <span className="gold-text italic">Meets the World</span>
          </h1>

          <p className="text-white/50 text-lg sm:text-xl max-w-2xl mx-auto leading-relaxed mb-10">
            Catalyst Talents Lagos illuminates extraordinary models and talents —
            from the streets of Lagos to international runways, screens, and campaigns.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/models"
              className="px-10 py-4 bg-gold text-black font-semibold text-sm tracking-widest uppercase hover:bg-gold-light transition-colors duration-300"
            >
              View Models
            </Link>
            <Link
              href="/apply"
              className="px-10 py-4 border border-gold/40 text-gold text-sm tracking-widest uppercase hover:border-gold hover:bg-gold/10 transition-all duration-300"
            >
              Apply to Join
            </Link>
          </div>

          {/* Scroll indicator */}
          <div className="mt-20 flex flex-col items-center gap-2 text-white/20">
            <div className="w-px h-12 bg-gold/30" />
            <span className="text-xs tracking-widest uppercase">Scroll</span>
          </div>
        </div>
      </section>

      {/* FEATURED MODELS */}
      <section className="py-24 px-4 max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-16">
          <div>
            <p className="text-gold text-xs tracking-[0.4em] uppercase mb-3">Signed Talents</p>
            <h2 className="font-playfair text-4xl sm:text-5xl font-bold text-white section-line">
              Featured Models
            </h2>
          </div>
          <Link
            href="/models"
            className="mt-8 sm:mt-0 text-xs tracking-widest uppercase text-gold/60 hover:text-gold transition-colors border-b border-gold/20 hover:border-gold pb-1"
          >
            View All Models →
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {featured.map((model) => (
            <ModelCard key={model.id} model={model} />
          ))}
        </div>
      </section>

      {/* DIVIDER */}
      <div className="mx-auto max-w-7xl px-4">
        <div className="h-px bg-gradient-to-r from-transparent via-gold/20 to-transparent" />
      </div>

      {/* CATEGORIES */}
      <section className="py-24 px-4 max-w-7xl mx-auto">
        <div className="mb-16">
          <p className="text-gold text-xs tracking-[0.4em] uppercase mb-3">What We Represent</p>
          <h2 className="font-playfair text-4xl sm:text-5xl font-bold text-white section-line">
            Our Divisions
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={`/models?category=${cat.id}`}
              className="group p-8 border border-white/5 hover:border-gold/30 transition-all duration-500 relative overflow-hidden"
              style={{ background: cat.gradient }}
            >
              <div className="absolute inset-0 bg-gold/0 group-hover:bg-gold/5 transition-colors duration-500" />
              <div className="relative z-10">
                <span className="text-gold text-2xl mb-4 block">{cat.icon}</span>
                <h3 className="font-playfair text-lg font-bold text-white mb-3">{cat.label}</h3>
                <p className="text-white/40 text-sm leading-relaxed">{cat.description}</p>
                <span className="block mt-6 text-xs tracking-widest uppercase text-gold/40 group-hover:text-gold transition-colors">
                  Explore →
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ABOUT SNIPPET */}
      <section
        className="py-24 px-4"
        style={{ background: 'linear-gradient(135deg, #0d0d0d 0%, #111108 100%)' }}
      >
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-gold text-xs tracking-[0.4em] uppercase mb-6">Our Story</p>
          <h2 className="font-playfair text-4xl sm:text-5xl font-bold text-white mb-8">
            Born in Lagos.
            <br />
            <span className="italic text-gold/80">Built for the World.</span>
          </h2>
          <p className="text-white/50 text-lg leading-relaxed mb-6">
            Catalyst Talents Lagos is the talent & modelling arm of Catalyst Concepts — a creative
            powerhouse rooted in Lagos, Nigeria. We believe the continent's most extraordinary
            faces, bodies, and personalities deserve a platform that matches their potential.
          </p>
          <p className="text-white/40 leading-relaxed mb-10">
            We don't just manage talent — we develop careers, build narratives, and connect Lagos
            to the global fashion and entertainment industry.
          </p>
          <Link
            href="/about"
            className="inline-block px-10 py-4 border border-gold/40 text-gold text-sm tracking-widest uppercase hover:border-gold hover:bg-gold/10 transition-all duration-300"
          >
            Our Full Story
          </Link>
        </div>
      </section>

      {/* CTA BANNER */}
      <section className="py-24 px-4 max-w-7xl mx-auto">
        <div
          className="relative overflow-hidden p-12 sm:p-20 text-center"
          style={{
            background: 'linear-gradient(135deg, #1a1208 0%, #2a1e0a 50%, #1a1208 100%)',
            border: '1px solid rgba(212, 175, 55, 0.2)',
          }}
        >
          <div
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage:
                'radial-gradient(circle at 50% 50%, #D4AF37 0%, transparent 60%)',
            }}
          />
          <div className="relative z-10">
            <p className="text-gold text-xs tracking-[0.4em] uppercase mb-4">Join the Roster</p>
            <h2 className="font-playfair text-4xl sm:text-6xl font-bold text-white mb-6">
              Ready to Be
              <br />
              <span className="gold-text italic">Discovered?</span>
            </h2>
            <p className="text-white/50 max-w-xl mx-auto mb-10 leading-relaxed">
              We are actively scouting models, influencers, actors, and commercial talent across
              Lagos and Nigeria. Submit your application today.
            </p>
            <Link
              href="/apply"
              className="inline-block px-14 py-5 bg-gold text-black font-bold text-sm tracking-widest uppercase hover:bg-gold-light transition-colors duration-300"
            >
              Apply Now
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
