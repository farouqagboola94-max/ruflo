import Link from 'next/link'
import ModelCard from '@/components/ModelCard'
import NewsCard from '@/components/NewsCard'
import TestimonialsSection from '@/components/TestimonialsSection'
import ManifestoSection from '@/components/ManifestoSection'
import MarqueeTicker from '@/components/MarqueeTicker'
import EmailCapture from '@/components/EmailCapture'
import PromiseSection from '@/components/PromiseSection'
import ForTheTalent from '@/components/ForTheTalent'
import LagosDNA from '@/components/LagosDNA'
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

const stats = [
  { value: '4', label: 'Talent Divisions' },
  { value: 'Open', label: 'Registrations' },
  { value: 'Open', label: 'Brand Deals' },
  { value: 'Lagos', label: 'Founded Here' },
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
        style={{
          background:
            'linear-gradient(135deg, #000000 0%, #0a0a0a 40%, #0d0d07 70%, #0a0a0a 100%)',
        }}
      >
        {/* Aso-oke textile texture */}
        <div className="absolute inset-0 aso-oke-texture pointer-events-none" />
        {/* Subtle grid overlay */}
        <div className="absolute inset-0 hero-grid pointer-events-none" />
        {/* Pulsing glow orb */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
          <div
            className="w-[700px] h-[700px] rounded-full hero-glow-orb"
            style={{ background: 'radial-gradient(circle, #D4AF37 0%, transparent 65%)' }}
          />
        </div>
        <div className="relative z-10 text-center px-4 max-w-5xl mx-auto pt-20">
          <p className="hero-animate-1 text-[#D4AF37] text-[10px] tracking-[0.5em] uppercase mb-6">
            Believe · Standard · Catalyst
          </p>
          <h1 className="hero-animate-2 font-playfair text-5xl sm:text-7xl lg:text-8xl font-bold text-white leading-tight mb-6">
            Where Lagos
            <br />
            <span
              className="italic"
              style={{
                background:
                  'linear-gradient(135deg, #D4AF37 0%, #F0D060 50%, #D4AF37 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              Meets the World
            </span>
          </h1>
          <p className="hero-animate-3 text-white/50 text-lg sm:text-xl max-w-2xl mx-auto leading-relaxed mb-10">
            Born from Lagos. Built for the world. We believe Nigerian talent deserves an
            agency that treats you like the valuable person you are — not just a booking.
            Welfare first. Culture intact. Standard uncompromised.{' '}
            <a
              href="#join"
              className="text-[#D4AF37]/60 hover:text-[#D4AF37] transition-colors"
              style={{ textDecoration: 'underline', textUnderlineOffset: '3px' }}
            >
              This is your home.
            </a>
          </p>
          <div className="hero-animate-4 flex flex-col sm:flex-row gap-4 justify-center">
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
          <div className="hero-animate-5 mt-6">
            <a
              href="#join"
              className="text-white/20 text-[9px] tracking-[0.45em] uppercase hover:text-[#D4AF37]/40 transition-colors"
            >
              or join our inner circle ↓
            </a>
          </div>
          <div className="mt-14 flex flex-col items-center gap-2 text-white/15">
            <div className="w-px h-10 bg-[#D4AF37]/25" />
            <span className="text-[9px] tracking-widest uppercase">Scroll</span>
          </div>
        </div>
      </section>

      {/* ── TICKER ── */}
      <MarqueeTicker />

      {/* ── MANIFESTO ── */}
      <ManifestoSection />

      {/* ── THE CTL PROMISE ── */}
      <PromiseSection />

      {/* ── BRAND VISUAL ── */}
      <section style={{ background: '#050505' }}>
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2">
            <div className="relative overflow-hidden" style={{ minHeight: '480px' }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/catalyst-dragon.jpg"
                alt="The Catalyst — Catalyst Concepts, Lagos 2026"
                className="w-full h-full object-cover"
                style={{ minHeight: '480px', filter: 'brightness(0.88) contrast(1.05)' }}
              />
              <div
                className="absolute inset-x-0 bottom-0 p-6"
                style={{
                  background: 'linear-gradient(transparent, rgba(5,5,5,0.95))',
                }}
              >
                <p className="text-white/30 text-[9px] tracking-[0.4em] uppercase">
                  Catalyst Concepts · Lagos · March 2026
                </p>
              </div>
            </div>
            <div
              className="flex flex-col justify-center px-10 py-16 lg:px-16"
              style={{
                background: 'linear-gradient(135deg, #070705 0%, #0d0d0a 100%)',
              }}
            >
              <p className="text-[#D4AF37] text-[10px] tracking-[0.5em] uppercase mb-5">
                The Force Behind the Agency
              </p>
              <h2 className="font-playfair text-3xl sm:text-4xl font-bold text-white mb-6 leading-tight">
                Catalyst Concepts
                <span className="block italic text-[#D4AF37]/80 text-2xl sm:text-3xl mt-1">
                  Main Headquarters
                </span>
                <span className="block w-12 h-px bg-[#D4AF37] mt-5" />
              </h2>
              <p className="text-white/50 leading-relaxed mb-5 text-sm sm:text-base">
                Catalyst Talents Lagos is the talent &amp; modelling division of Catalyst Concepts
                — a creative company established in Lagos in 2026, built around a single belief:
                this city produces extraordinary people who deserve an extraordinary platform.
              </p>
              <p className="text-white/30 text-sm leading-relaxed">
                The dragon rises from Lagos. Powerful, purposeful, and facing the world.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── FOR THE TALENT ── */}
      <ForTheTalent />

      {/* ── STATS ── */}
      <section
        style={{
          background: '#0d0d0d',
          borderTop: '1px solid rgba(212,175,55,0.1)',
          borderBottom: '1px solid rgba(212,175,55,0.1)',
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 text-center">
            {stats.map(({ value, label }) => (
              <div key={label}>
                <div
                  className="font-playfair text-4xl sm:text-5xl font-bold mb-2"
                  style={{
                    background:
                      'linear-gradient(135deg, #D4AF37 0%, #F0D060 50%, #D4AF37 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                  }}
                >
                  {value}
                </div>
                <div className="text-white/30 text-[9px] tracking-[0.4em] uppercase">
                  {label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURED MODELS ── */}
      <section className="py-24 px-4 max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-14">
          <div>
            <p className="text-[#D4AF37] text-[10px] tracking-[0.4em] uppercase mb-3">Our Roster</p>
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
          <p className="text-[#D4AF37] text-[10px] tracking-[0.4em] uppercase mb-3">
            What We Represent
          </p>
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

      {/* ── LAGOS DNA ── */}
      <LagosDNA />

      {/* ── SERVICES TEASER ── */}
      <section
        className="py-24 px-4"
        style={{ background: 'linear-gradient(135deg, #0d0d0d 0%, #111108 100%)' }}
      >
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-14">
            <div>
              <p className="text-[#D4AF37] text-[10px] tracking-[0.4em] uppercase mb-3">
                For Brands & Clients
              </p>
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
          <p className="text-[#D4AF37] text-[10px] tracking-[0.4em] uppercase mb-6">Who We Are</p>
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
            Catalyst Talents Lagos is the talent &amp; modelling arm of Catalyst Concepts. We are a
            new agency — and we are transparent about that. We represent models, influencers,
            actors, and commercial talent, and we do it with a welfare-first approach built into
            everything from day one.
          </p>
          <p className="text-white/35 leading-relaxed mb-10">
            We don&apos;t have decades of bookings to show you. We have a clear mission, a genuine
            commitment to the people we represent, and a Lagos full of extraordinary talent that
            deserves a proper platform. We are open for applications and brand deals now.
          </p>
          <Link
            href="/about"
            className="inline-block px-10 py-4 border border-[#D4AF37]/35 text-[#D4AF37] text-xs tracking-widest uppercase hover:border-[#D4AF37] hover:bg-[#D4AF37]/10 transition-all"
          >
            Our Full Story
          </Link>
        </div>
      </section>

      {/* ── EMAIL CAPTURE ── */}
      <EmailCapture />

      {/* ── THE CTL STANDARD ── */}
      <TestimonialsSection />

      {/* ── NEWS PREVIEW ── */}
      <section className="py-24 px-4 max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-14">
          <div>
            <p className="text-[#D4AF37] text-[10px] tracking-[0.4em] uppercase mb-3">
              Latest from Catalyst
            </p>
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
            style={{
              backgroundImage:
                'radial-gradient(circle at 50% 50%, #D4AF37 0%, transparent 60%)',
            }}
          />
          <div className="relative z-10">
            <p className="text-[#D4AF37] text-[10px] tracking-[0.4em] uppercase mb-4">
              Join the Roster
            </p>
            <h2 className="font-playfair text-4xl sm:text-6xl font-bold text-white mb-6">
              You Were Made
              <br />
              <span
                className="italic"
                style={{
                  background:
                    'linear-gradient(135deg, #D4AF37 0%, #F0D060 50%, #D4AF37 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                for This.
              </span>
            </h2>
            <p className="text-white/45 max-w-xl mx-auto mb-10 leading-relaxed">
              Lagos is full of extraordinary talent the world hasn&apos;t discovered yet.
              If you&apos;ve been looking for a place that truly has your back — you found it.
              Submit your application. We&apos;re ready for you.
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

      {/* Hidden Netlify form declarations — statically rendered for deploy-time detection */}
      <div style={{ display: 'none' }} aria-hidden="true">
        <form name="newsletter-signup" data-netlify="true" data-netlify-honeypot="bot-field">
          <input name="bot-field" />
          <input name="name" type="text" />
          <input name="email" type="email" />
        </form>
        <form name="talent-application" data-netlify="true" data-netlify-honeypot="bot-field">
          <input name="bot-field" />
          <input name="name" type="text" />
          <input name="email" type="email" />
          <input name="phone" type="text" />
          <input name="category" type="text" />
          <textarea name="message" />
        </form>
        <form name="brand-inquiry" data-netlify="true" data-netlify-honeypot="bot-field">
          <input name="bot-field" />
          <input name="name" type="text" />
          <input name="email" type="email" />
          <input name="company" type="text" />
          <textarea name="message" />
        </form>
      </div>
    </>
  )
}
