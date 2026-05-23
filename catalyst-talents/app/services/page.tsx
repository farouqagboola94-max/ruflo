import Link from 'next/link'
import { services } from '@/data/services'
import ServiceCard from '@/components/ServiceCard'
import BookingCTA from '@/components/BookingCTA'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Services | Catalyst Talents Lagos',
  description:
    'Talent booking, brand ambassadorship, influencer campaigns, casting direction, and career management — Catalyst Talents Lagos.',
}

const steps = [
  {
    number: '01',
    title: 'Submit Your Brief',
    description:
      'Tell us about your project, timeline, budget, and the type of talent you need. The more detail the better.',
  },
  {
    number: '02',
    title: 'We Curate a Shortlist',
    description:
      'Our team handpicks models and talents from the roster that best match your brief, audience, and aesthetic.',
  },
  {
    number: '03',
    title: 'Review & Select',
    description:
      'We present full dossiers, portfolio images, and rates for your shortlist. You choose. We handle the rest.',
  },
  {
    number: '04',
    title: 'We Manage Everything',
    description:
      'Contracts, scheduling, on-set coordination, and post-production support. You focus on your vision.',
  },
]

export default function ServicesPage() {
  const brandServices = services.filter((s) => s.forWho === 'brands')
  const talentServices = services.filter((s) => s.forWho === 'talent')

  return (
    <>
      {/* HEADER */}
      <section
        className="pt-40 pb-20 px-4 relative overflow-hidden"
        style={{ background: 'linear-gradient(180deg, #050505 0%, #0d0d0d 100%)' }}
      >
        <div
          className="absolute bottom-0 right-0 w-96 h-96 opacity-5 rounded-full"
          style={{ background: 'radial-gradient(circle, #D4AF37, transparent 70%)' }}
        />
        <div className="max-w-4xl mx-auto relative z-10">
          <p className="text-[#D4AF37] text-[10px] tracking-[0.5em] uppercase mb-4">What We Do</p>
          <h1 className="font-playfair text-5xl sm:text-7xl font-bold text-white mb-6">
            Services
          </h1>
          <p className="text-white/50 text-xl leading-relaxed max-w-2xl">
            Whether you are a brand looking for the perfect face or a talent ready to build a
            serious career, Catalyst Talents Lagos has the infrastructure to deliver.
          </p>
        </div>
      </section>

      {/* FOR BRANDS */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="mb-14">
            <p className="text-[#D4AF37] text-[10px] tracking-[0.4em] uppercase mb-3">For Brands & Clients</p>
            <h2 className="font-playfair text-4xl sm:text-5xl font-bold text-white">
              Book & Partner
              <span className="block w-14 h-px bg-[#D4AF37] mt-4" />
            </h2>
            <p className="text-white/40 mt-4 max-w-lg">
              From one-day shoots to year-long ambassador contracts, we connect brands to talent
              that elevates their identity.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {brandServices.map((s) => (
              <ServiceCard key={s.id} service={s} />
            ))}
          </div>
        </div>
      </section>

      {/* DIVIDER */}
      <div className="max-w-7xl mx-auto px-4">
        <div className="h-px bg-gradient-to-r from-transparent via-[#D4AF37]/15 to-transparent" />
      </div>

      {/* FOR TALENT */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="mb-14">
            <p className="text-[#D4AF37] text-[10px] tracking-[0.4em] uppercase mb-3">For Our Signed Talent</p>
            <h2 className="font-playfair text-4xl sm:text-5xl font-bold text-white">
              Career Development
              <span className="block w-14 h-px bg-[#D4AF37] mt-4" />
            </h2>
            <p className="text-white/40 mt-4 max-w-lg">
              We don&apos;t just book you — we build you. Our signed talent receive end-to-end
              career support from day one.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {talentServices.map((s) => (
              <ServiceCard key={s.id} service={s} />
            ))}
          </div>
          <div className="mt-10">
            <Link
              href="/apply"
              className="inline-block px-10 py-4 bg-[#D4AF37] text-black font-bold text-xs tracking-widest uppercase hover:bg-[#F0D060] transition-colors"
            >
              Apply to Be Signed
            </Link>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section
        className="py-20 px-4"
        style={{ background: 'linear-gradient(135deg, #0d0d0d 0%, #111108 100%)' }}
      >
        <div className="max-w-7xl mx-auto">
          <div className="mb-14">
            <p className="text-[#D4AF37] text-[10px] tracking-[0.4em] uppercase mb-3">For Clients</p>
            <h2 className="font-playfair text-4xl sm:text-5xl font-bold text-white">
              How It Works
              <span className="block w-14 h-px bg-[#D4AF37] mt-4" />
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((step, i) => (
              <div key={step.number} className="relative">
                {i < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-6 left-full w-full h-px bg-[#D4AF37]/10 z-0" />
                )}
                <div className="relative z-10">
                  <span className="font-playfair text-5xl font-bold text-[#D4AF37]/15 block mb-4">
                    {step.number}
                  </span>
                  <h3 className="font-playfair text-lg font-bold text-white mb-3">{step.title}</h3>
                  <p className="text-white/40 text-sm leading-relaxed">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-4 pb-24">
        <div className="max-w-3xl mx-auto">
          <BookingCTA
            title="Ready to Work Together?"
            subtitle="Send us your brief and our team will respond within 24 hours with a curated talent shortlist."
            primaryLabel="Submit a Brief"
            primaryHref="/contact"
            secondaryLabel="Browse Talent"
            secondaryHref="/models"
          />
        </div>
      </section>
    </>
  )
}
