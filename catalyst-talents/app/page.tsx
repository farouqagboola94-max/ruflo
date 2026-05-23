import Link from 'next/link'
import ModelCard from '@/components/ModelCard'
import NewsCard from '@/components/NewsCard'
import TestimonialsSection from '@/components/TestimonialsSection'
import { models } from '@/data/models'
import { news } from '@/data/news'
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
  const latestNews = news.slice(0, 3)
  const brandServices = services.filter((s) => s.forWho === 'brands').slice(0, 3)

  return (
    <>
      {/* ── HERO ── */}
      <section
        className="relative min-h-screen flex items-center justify-center overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #000000 0%, #0a0a0a 40%, #0d0d07 70%, #0a0a0a 100%)' }}
      >
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              'linear-gradient(#D4AF37 1px, transparent 1px), linear-gradient(90deg, #D4AF37 1px, transparent 1px)',
            backgroundSize: '80px 80px',
          }}
        />
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full"
          style={{ background: 'radial-gradient(circle, #D4AF37 0%, transparent 65%)', opacity: 0.04 }}
        />
        <div className="relative z-10 text-center px-4 max-w-5xl mx-auto pt-20">
          <p className="text-[#D4AF37] text-[10px] tracking-[0.5em] uppercase mb-6">
            A Catalyst Concepts Extension
          </p>
          <h1 className="font-playfair text-5xl sm:text-7xl lg:text-8xl font-bold text-white leading-tight mb-6">
            Where Lagos
            <br />
            <span
              className="italic"
              style={{
                background: 'linear-gradient(135deg, #D4AF37 0%, #F0D060 50%, #D4AF37 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              Meets the World
            </span>
          </h1>
          <p className="text-white/50 text-lg sm:text-xl max-w-2xl mx-auto leading-relaxed mb-10">
            Catalyst Talents Lagos illuminates extraordinary models and talents — from the streets
            of Lagos to international runways, screens, and campaigns.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/models"
              className="px-10 py-4 bg-[#D4AF37] text-black font-bold text-xs tracking-widest uppercase hover:bg-[#F0D060] transition-colors"
            >
              View Models
            </Link>
            <Link
              href="/apply"
              className="px-10 py-4 border border-[#D4AF37]/35 text-[#D4AF37] text-xs tracking-widest uppercase hover:border-[#D4AF37] hover:bg-[#D4AF37]/10 transition-all"
            >
              Apply to Join
            </Link>
          </div>
          <div className="mt-20 flex flex-col items-center gap-2 text-white/15">
            <div className="w-px h-12 bg-[#D4AF37]/25" />
            <span className="text-[9px] tracking-widest uppercase">Scroll</span>
          </div>
        </div>
      </section>

      {/* ── FEATURED MODELS ── */}
      <section className="py-24 px-4 max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-14">
          <div>
            <p className="text-[#D4AF37] text-[10px] tracking-[0.4em] uppercase mb-3">Signed Talents</p>
            <h2 className="font-playfair text-4xl sm:text-5xl font-bold text-white">
              Featured Models
              <span className="block w-14 h-px bg-[#D4AF37] mt-4" />
            </h2>
          </div>
          <Link
            href="/models"
            className="mt-8 sm:mt-0 text-[10px] tracking-widest uppercase text-[#D4AF37]/50 hover:text-[#D4AF37] transition-colors border-b border-[#D4AF37]/15 hover:border-[#D4AF37] pb-1"
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
        <div className="h-px bg-gradient-to-r from-transparent via-[#D4AF37]/15 to-transparent" />
      </div>

      {/* ── DIVISIONS ── */}
      <section className="py-24 px-4 max-w-7xl mx-auto">
        <div className="mb-14">
          <p className="text-[#D4AF37] text-[10px] tracking-[0.4em] uppercase mb-3">What We Represent</p>
          <h2 className="font-playfair text-4xl sm:text-5xl font-bold text-white">
            Our Divisions
            <span className="block w-14 h-px bg-[#D4AF37] mt-4" />
          </h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={`/models?category=${cat.id}`}
              className="group p-8 border border-white/5 hover:border-[#D4AF37]/30 transition-all duration-500 relative overflow-hidden"
              style={{ background: cat.gradient }}
            >
              <div className="absolute inset-0 bg-[#D4AF37]/0 group-hover:bg-[#D4AF37]/5 transition-colors duration-500" />
              <div className="relative z-10">
                <span className="text-[#D4AF37] text-2xl mb-4 block">{cat.icon}</span>
                <h3 className="font-playfair text-lg font-bold text-white mb-3">{cat.label}</h3>
                <p className="text-white/40 text-sm leading-relaxed">{cat.description}</p>
                <span className="block mt-6 text-[10px] tracking-widest uppercase text-[#D4AF37]/35 group-hover:text-[#D4AF37] transition-colors">
                  Explore →
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ── SERVICES TEASER ── */}
      <section
        className="py-24 px-4"
        style={{ background: 'linear-gradient(135deg, #0d0d0d 0%, #111108 100%)' }}
      >
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-14">
            <div>
              <p className="text-[#D4AF37] text-[10px] tracking-[0.4em] uppercase mb-3">For Brands & Clients</p>
              <h2 className="font-playfair text-4xl sm:text-5xl font-bold text-white">
                What We Offer
                <span className="block w-14 h-px bg-[#D4AF37] mt-4" />
              </h2>
            </div>
            <Link
              href="/services"
              className="mt-8 sm:mt-0 text-[10px] tracking-widest uppercase text-[#D4AF37]/50 hover:text-[#D4AF37] transition-colors border-b border-[#D4AF37]/15 hover:border-[#D4AF37] pb-1"
            >
              All Services →
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {brandServices.map((s) => (
              <div
                key={s.id}
                className="p-8 border border-white/5 hover:border-[#D4AF37]/25 transition-all duration-500"
              >
                <span className="text-[#D4AF37] text-xl block mb-3">{s.icon}</span>
                <h3 className="font-playfair text-lg font-bold text-white mb-2">{s.title}</h3>
                <p className="text-white/40 text-sm leading-relaxed">{s.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── ABOUT SNIPPET ── */}
      <section className="py-24 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-[#D4AF37] text-[10px] tracking-[0.4em] uppercase mb-6">Our Story</p>
          <h2 className="font-playfair text-4xl sm:text-5xl font-bold text-white mb-8">
            Born in Lagos.
            <br />
            <span
              className="italic"
              style={{
                background: 'linear-gradient(135deg, #D4AF37, #F0D060)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              Built for the World.
            </span>
          </h2>
          <p className="text-white/50 text-lg leading-relaxed mb-6">
            Catalyst Talents Lagos is the talent & modelling arm of Catalyst Concepts — a creative
            powerhouse rooted in Lagos, Nigeria. We believe the continent&apos;s most extraordinary
            faces, bodies, and personalities deserve a platform that matches their potential.
          </p>
          <p className="text-white/35 leading-relaxed mb-10">
            We don&apos;t just manage talent — we develop careers, build narratives, and connect
            Lagos to the global fashion and entertainment industry.
          </p>
          <Link
            href="/about"
            className="inline-block px-10 py-4 border border-[#D4AF37]/35 text-[#D4AF37] text-xs tracking-widest uppercase hover:border-[#D4AF37] hover:bg-[#D4AF37]/10 transition-all"
          >
            Our Full Story
          </Link>
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <TestimonialsSection />

      {/* ── NEWS PREVIEW ── */}
      <section className="py-24 px-4 max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-14">
          <div>
            <p className="text-[#D4AF37] text-[10px] tracking-[0.4em] uppercase mb-3">Latest from Catalyst</p>
            <h2 className="font-playfair text-4xl sm:text-5xl font-bold text-white">
              News & Stories
              <span className="block w-14 h-px bg-[#D4AF37] mt-4" />
            </h2>
          </div>
          <Link
            href="/news"
            className="mt-8 sm:mt-0 text-[10px] tracking-widest uppercase text-[#D4AF37]/50 hover:text-[#D4AF37] transition-colors border-b border-[#D4AF37]/15 hover:border-[#D4AF37] pb-1"
          >
            All Stories →
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {latestNews.map((article) => (
            <NewsCard key={article.id} article={article} />
          ))}
        </div>
      </section>

      {/* ── APPLY CTA BANNER ── */}
      <section className="py-24 px-4 max-w-7xl mx-auto">
        <div
          className="relative overflow-hidden p-12 sm:p-20 text-center"
          style={{
            background: 'linear-gradient(135deg, #1a1208 0%, #2a1e0a 50%, #1a1208 100%)',
            border: '1px solid rgba(212, 175, 55, 0.18)',
          }}
        >
          <div
            className="absolute inset-0 opacity-10"
            style={{ backgroundImage: 'radial-gradient(circle at 50% 50%, #D4AF37 0%, transparent 60%)' }}
          />
          <div className="relative z-10">
            <p className="text-[#D4AF37] text-[10px] tracking-[0.4em] uppercase mb-4">Join the Roster</p>
            <h2 className="font-playfair text-4xl sm:text-6xl font-bold text-white mb-6">
              Ready to Be
              <br />
              <span
                className="italic"
                style={{
                  background: 'linear-gradient(135deg, #D4AF37 0%, #F0D060 50%, #D4AF37 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                Discovered?
              </span>
            </h2>
            <p className="text-white/45 max-w-xl mx-auto mb-10 leading-relaxed">
              We are actively scouting models, influencers, actors, and commercial talent across
              Lagos and Nigeria. Submit your application today.
            </p>
            <Link
              href="/apply"
              className="inline-block px-14 py-5 bg-[#D4AF37] text-black font-bold text-xs tracking-widest uppercase hover:bg-[#F0D060] transition-colors"
            >
              Apply Now
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
