import Link from 'next/link'
import ModelCard from '@/components/ModelCard'
import Hero3D from '@/components/Hero3D'
import { models } from '@/data/models'
import { services } from '@/data/services'

const categories = [
  {
    id: 'Fashion',
    label: 'Fashion & Runway',
    description: 'Editorial, couture, and runway models who command every stage.',
    icon: '✦',
    gradient: 'linear-gradient(135deg, #1a0a2e 0%, #2d1b4e 100%)',
  },
  {
    id: 'Commercial',
    label: 'Commercial & Brand',
    description: 'Versatile faces for campaigns, print, and brand ambassadorships.',
    icon: '◈',
    gradient: 'linear-gradient(135deg, #0d1b0d 0%, #1a3320 100%)',
  },
  {
    id: 'Influencer',
    label: 'Influencers & Creators',
    description: 'Digital-native talents reshaping culture across social platforms.',
    icon: '◉',
    gradient: 'linear-gradient(135deg, #1a0a0a 0%, #3d1515 100%)',
  },
  {
    id: 'Acting',
    label: 'Acting & Presenting',
    description: 'Compelling performers for film, television, and live events.',
    icon: '◆',
    gradient: 'linear-gradient(135deg, #0a1a1a 0%, #153d3d 100%)',
  },
]

export default function HomePage() {
  const featured = models.filter((m) => m.featured)
  const brandServices = services.filter((s) => s.forWho === 'brands').slice(0, 3)

  return (
    <>
      <Hero3D />

      {/* FEATURED MODELS */}
      <section className="py-28 px-4 max-w-7xl mx-auto relative overflow-hidden">
        {/* Watermark count */}
        <div
          className="absolute -top-4 right-0 font-playfair font-bold select-none pointer-events-none hidden lg:block"
          style={{
            fontSize: 'clamp(120px, 18vw, 260px)',
            color: 'rgba(212,175,55,0.028)',
            lineHeight: 1,
          }}
        >
          {String(featured.length).padStart(2, '0')}
        </div>

        <div className="relative z-10 flex flex-col sm:flex-row justify-between items-start sm:items-end mb-16">
          <div>
            <p className="text-[#D4AF37] text-[10px] tracking-[0.45em] uppercase mb-3">Signed Talents</p>
            <h2 className="font-playfair text-4xl sm:text-5xl font-bold text-white">
              Featured Models
            </h2>
            <div className="mt-4 h-px w-14 bg-[#D4AF37]" />
          </div>
          <Link
            href="/models"
            className="mt-8 sm:mt-0 text-[10px] tracking-widest uppercase border-b border-[#D4AF37]/15 hover:border-[#D4AF37] pb-1 transition-all duration-300"
            style={{ color: 'rgba(212,175,55,0.55)' }}
          >
            View All Models →
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {featured.map((model) => (
            <Link key={model.id} href={`/models/${model.id}`}>
              <ModelCard model={model} />
            </Link>
          ))}
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4">
        <div className="h-px bg-gradient-to-r from-transparent via-[#D4AF37]/12 to-transparent" />
      </div>

      {/* DIVISIONS */}
      <section className="py-28 px-4 max-w-7xl mx-auto">
        <div className="mb-16">
          <p className="text-[#D4AF37] text-[10px] tracking-[0.45em] uppercase mb-3">What We Represent</p>
          <h2 className="font-playfair text-4xl sm:text-5xl font-bold text-white">
            Our Divisions
          </h2>
          <div className="mt-4 h-px w-14 bg-[#D4AF37]" />
        </div>
        <div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-[1px]"
          style={{ background: 'rgba(212,175,55,0.08)' }}
        >
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={`/models?category=${cat.id}`}
              className="group p-8 relative overflow-hidden transition-all duration-500 hover:-translate-y-px"
              style={{ background: cat.gradient }}
            >
              <div className="absolute inset-0 bg-[#D4AF37]/0 group-hover:bg-[#D4AF37]/6 transition-colors duration-500" />
              <div
                className="absolute top-0 left-0 h-[2px] w-0 group-hover:w-full transition-all duration-500"
                style={{ background: 'linear-gradient(90deg, #D4AF37, transparent)' }}
              />
              <div className="relative z-10">
                <span className="text-[#D4AF37] text-2xl mb-5 block">{cat.icon}</span>
                <h3 className="font-playfair text-lg font-bold text-white mb-3">{cat.label}</h3>
                <p className="text-white/40 text-sm leading-relaxed mb-5">{cat.description}</p>
                <span className="text-[10px] tracking-widest uppercase text-[#D4AF37]/35 group-hover:text-[#D4AF37] transition-colors duration-300">
                  Explore →
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* SERVICES */}
      <section
        className="py-28 px-4"
        style={{ background: 'linear-gradient(150deg, #0d0d0d 0%, #111109 100%)' }}
      >
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-16">
            <div>
              <p className="text-[#D4AF37] text-[10px] tracking-[0.45em] uppercase mb-3">For Brands &amp; Clients</p>
              <h2 className="font-playfair text-4xl sm:text-5xl font-bold text-white">
                What We Offer
              </h2>
              <div className="mt-4 h-px w-14 bg-[#D4AF37]" />
            </div>
            <Link
              href="/services"
              className="mt-8 sm:mt-0 text-[10px] tracking-widest uppercase border-b border-[#D4AF37]/15 hover:border-[#D4AF37] pb-1 transition-all duration-300"
              style={{ color: 'rgba(212,175,55,0.55)' }}
            >
              All Services →
            </Link>
          </div>
          <div
            className="grid grid-cols-1 sm:grid-cols-3 gap-[1px]"
            style={{ background: 'rgba(212,175,55,0.08)' }}
          >
            {brandServices.map((s) => (
              <div
                key={s.id}
                className="p-10 group transition-all duration-500 hover:bg-[#D4AF37]/5"
                style={{ background: '#0d0d0d' }}
              >
                <span className="text-[#D4AF37] text-2xl block mb-4 group-hover:scale-110 transition-transform duration-300 origin-left">
                  {s.icon}
                </span>
                <h3 className="font-playfair text-xl font-bold text-white mb-3">{s.title}</h3>
                <p className="text-white/40 text-sm leading-relaxed">{s.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ABOUT */}
      <section className="py-28 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-[#D4AF37] text-[10px] tracking-[0.45em] uppercase mb-7">Our Story</p>
          <h2 className="font-playfair text-4xl sm:text-6xl font-bold text-white mb-10 leading-tight">
            Born in Lagos.
            <br />
            <span
              className="italic"
              style={{
                background: 'linear-gradient(135deg, #D4AF37, #F0D060)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor:  'transparent',
                backgroundClip:       'text',
              }}
            >
              Built for the World.
            </span>
          </h2>
          <p className="text-white/50 text-lg leading-relaxed mb-6 max-w-2xl mx-auto">
            Catalyst Talents Lagos is the talent &amp; modelling arm of Catalyst Concepts — a creative
            powerhouse rooted in Lagos, Nigeria. We believe the continent&apos;s most extraordinary
            faces, bodies, and personalities deserve a platform that matches their potential.
          </p>
          <p className="text-white/30 leading-relaxed mb-12 max-w-xl mx-auto">
            We don&apos;t just manage talent — we develop careers, build narratives, and connect
            Lagos to the global fashion and entertainment industry.
          </p>
          <Link
            href="/about"
            className="inline-block px-12 py-4 border border-[#D4AF37]/35 text-[#D4AF37] text-xs tracking-widest uppercase hover:border-[#D4AF37] hover:bg-[#D4AF37]/10 transition-all duration-300"
          >
            Our Full Story
          </Link>
        </div>
      </section>

      {/* BE FIRST */}
      <section
        className="py-28 px-4"
        style={{ background: 'linear-gradient(180deg, #0a0a0a 0%, #111109 100%)' }}
      >
        <div className="max-w-2xl mx-auto text-center">
          <p className="text-[#D4AF37] text-[10px] tracking-[0.45em] uppercase mb-7">Work With Us</p>
          <h2 className="font-playfair text-4xl sm:text-5xl font-bold text-white mb-6 leading-tight">
            Be Among the First
          </h2>
          <div className="h-px w-14 bg-[#D4AF37] mx-auto mb-8" />
          <p className="text-white/45 text-lg leading-relaxed mb-12">
            We are building something remarkable in Lagos. Partner with us, sign with us, or book
            our talent — and be among the first to shape this story.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/contact"
              className="shimmer-btn px-12 py-4 bg-[#D4AF37] text-black font-bold text-xs tracking-widest uppercase hover:bg-[#F0D060] transition-colors duration-300"
            >
              Get in Touch
            </Link>
            <Link
              href="/apply"
              className="px-12 py-4 border border-[#D4AF37]/35 text-[#D4AF37] text-xs tracking-widest uppercase hover:border-[#D4AF37] hover:bg-[#D4AF37]/10 transition-all duration-300"
            >
              Apply to Join
            </Link>
          </div>
        </div>
      </section>

      {/* NEWS */}
      <section className="py-28 px-4 max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-16">
          <div>
            <p className="text-[#D4AF37] text-[10px] tracking-[0.45em] uppercase mb-3">Latest from Catalyst</p>
            <h2 className="font-playfair text-4xl sm:text-5xl font-bold text-white">
              News &amp; Stories
            </h2>
            <div className="mt-4 h-px w-14 bg-[#D4AF37]" />
          </div>
        </div>
        <div
          className="p-16 sm:p-24 border border-white/5 text-center"
          style={{ background: 'linear-gradient(135deg, #0d0d0d 0%, #111111 100%)' }}
        >
          <p className="font-playfair text-2xl mb-3" style={{ color: 'rgba(255,255,255,0.2)' }}>
            Stories Coming Soon
          </p>
          <p className="text-sm" style={{ color: 'rgba(255,255,255,0.15)' }}>
            Our first articles, model features, and campaign stories are on the way.
          </p>
        </div>
      </section>

      {/* APPLY CTA BANNER */}
      <section className="py-28 px-4 max-w-7xl mx-auto">
        <div
          className="relative overflow-hidden p-14 sm:p-24 text-center"
          style={{
            background: 'linear-gradient(135deg, #1a1208 0%, #2a1e0a 50%, #1a1208 100%)',
            border: '1px solid rgba(212, 175, 55, 0.18)',
          }}
        >
          <div
            className="ambient-orb absolute pointer-events-none"
            style={{
              top: '50%', left: '50%',
              width: '420px', height: '420px',
              transform: 'translate(-50%, -50%)',
              background: 'radial-gradient(circle, rgba(212,175,55,1) 0%, transparent 70%)',
            }}
          />
          <div className="relative z-10">
            <p className="text-[#D4AF37] text-[10px] tracking-[0.45em] uppercase mb-5">Join the Roster</p>
            <h2 className="font-playfair text-4xl sm:text-6xl font-bold text-white mb-7 leading-tight">
              Ready to Be
              <br />
              <span
                className="italic"
                style={{
                  background: 'linear-gradient(135deg, #D4AF37 0%, #F0D060 50%, #D4AF37 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor:  'transparent',
                  backgroundClip:       'text',
                }}
              >
                Discovered?
              </span>
            </h2>
            <p className="text-white/45 max-w-xl mx-auto mb-12 leading-relaxed">
              We are actively scouting models, influencers, actors, and commercial talent across
              Lagos and Nigeria. Submit your application today.
            </p>
            <Link
              href="/apply"
              className="shimmer-btn inline-block px-16 py-5 bg-[#D4AF37] text-black font-bold text-xs tracking-widest uppercase hover:bg-[#F0D060] transition-colors duration-300"
            >
              Apply Now
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
