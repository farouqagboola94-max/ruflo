import { notFound } from 'next/navigation'
import Link from 'next/link'
import { models } from '@/data/models'
import ModelCard from '@/components/ModelCard'
import BookingCTA from '@/components/BookingCTA'

export function generateStaticParams() {
  return models.map((m) => ({ id: m.id }))
}

export function generateMetadata({ params }: { params: { id: string } }) {
  const model = models.find((m) => m.id === params.id)
  if (!model) return { title: 'Model Not Found' }
  return {
    title: `${model.name} | Catalyst Talents Lagos`,
    description: model.bio ?? `${model.name} — ${model.tagline}. Book via Catalyst Talents Lagos.`,
  }
}

const categoryColors: Record<string, string> = {
  Fashion: '#f87171',
  Commercial: '#60a5fa',
  Influencer: '#c084fc',
  Acting: '#fbbf24',
}

export default function ModelProfilePage({ params }: { params: { id: string } }) {
  const model = models.find((m) => m.id === params.id)
  if (!model) notFound()

  const similar = models
    .filter((m) => m.category === model.category && m.id !== model.id)
    .slice(0, 3)

  const measurements = [
    { label: 'Height', value: model.height },
    { label: 'Bust / Chest', value: model.bust },
    { label: 'Waist', value: model.waist },
    { label: 'Hips', value: model.hips },
    { label: 'Shoes (EU)', value: model.shoes },
    { label: 'Eyes', value: model.eyes },
    { label: 'Hair', value: model.hair },
  ].filter((m) => m.value)

  return (
    <>
      {/* HERO */}
      <section className="relative min-h-[70vh] flex items-end overflow-hidden">
        <div className="absolute inset-0" style={{ background: model.gradient }} />
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              'linear-gradient(#ffffff08 1px, transparent 1px), linear-gradient(90deg, #ffffff08 1px, transparent 1px)',
            backgroundSize: '40px 40px',
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(to top, rgba(10,10,10,0.97) 0%, rgba(10,10,10,0.5) 50%, rgba(10,10,10,0.2) 100%)',
          }}
        />
        <div className="relative z-10 w-full max-w-7xl mx-auto px-4 pb-16 pt-40">
          <Link
            href="/models"
            className="inline-flex items-center gap-2 text-[10px] tracking-widest uppercase text-white/40 hover:text-[#D4AF37] transition-colors mb-8"
          >
            <span>←</span> All Models
          </Link>
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
            <div>
              <span
                className="text-[10px] tracking-widest uppercase font-semibold block mb-2"
                style={{ color: categoryColors[model.category] }}
              >
                {model.category}
              </span>
              <h1 className="font-playfair text-5xl sm:text-7xl font-bold text-white">
                {model.name}
              </h1>
              <p className="text-white/50 mt-2 tracking-wider">{model.tagline}</p>
            </div>
            {model.instagram && (
              <a
                href={`https://instagram.com/${model.instagram.replace('@', '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs tracking-widest uppercase text-[#D4AF37]/60 hover:text-[#D4AF37] border border-[#D4AF37]/20 hover:border-[#D4AF37]/50 px-5 py-2.5 transition-all self-start sm:self-auto"
              >
                {model.instagram}
              </a>
            )}
          </div>
        </div>
      </section>

      {/* PROFILE BODY */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-12">

          {/* Left: portrait placeholder */}
          <div className="lg:col-span-1">
            <div
              className="aspect-[2/3] relative border border-white/5"
              style={{ background: model.gradient }}
            >
              <div
                className="absolute inset-0 opacity-15"
                style={{
                  backgroundImage:
                    'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
                  backgroundSize: '30px 30px',
                }}
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="font-playfair text-white/10 text-8xl font-bold">
                  {model.name.charAt(0)}
                </span>
              </div>
            </div>
          </div>

          {/* Right: info */}
          <div className="lg:col-span-2 space-y-10">
            {/* Bio */}
            {model.bio && (
              <div>
                <h2 className="font-playfair text-2xl font-bold text-white mb-4">About</h2>
                <p className="text-white/60 leading-relaxed">{model.bio}</p>
              </div>
            )}

            {/* Measurements */}
            {measurements.length > 0 && (
              <div>
                <h2 className="font-playfair text-2xl font-bold text-white mb-6">Measurements</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {measurements.map((m) => (
                    <div key={m.label} className="p-4 border border-white/5 bg-white/2">
                      <p className="text-[10px] tracking-widest uppercase text-white/30 mb-1">
                        {m.label}
                      </p>
                      <p className="text-white font-semibold">{m.value}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Skills */}
            {model.skills && model.skills.length > 0 && (
              <div>
                <h2 className="font-playfair text-2xl font-bold text-white mb-4">Specialities</h2>
                <div className="flex flex-wrap gap-2">
                  {model.skills.map((skill) => (
                    <span
                      key={skill}
                      className="px-4 py-2 text-xs tracking-widest uppercase border border-[#D4AF37]/20 text-[#D4AF37]/70"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* PORTFOLIO GRID PLACEHOLDER */}
      <section className="py-8 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="font-playfair text-3xl font-bold text-white mb-8">Portfolio</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="aspect-square border border-white/5 relative overflow-hidden"
                style={{
                  background: `${model.gradient}`,
                  filter: `brightness(${0.6 + i * 0.05})`,
                }}
              >
                <div
                  className="absolute inset-0 opacity-20"
                  style={{
                    backgroundImage:
                      'linear-gradient(rgba(255,255,255,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.08) 1px, transparent 1px)',
                    backgroundSize: '20px 20px',
                  }}
                />
              </div>
            ))}
          </div>
          <p className="text-white/20 text-xs text-center mt-4 tracking-wider">
            Portfolio images added upon signing
          </p>
        </div>
      </section>

      {/* BOOKING CTA */}
      <section className="py-16 px-4">
        <div className="max-w-3xl mx-auto">
          <BookingCTA
            title={`Book ${model.name.split(' ')[0]}`}
            subtitle={`Enquire about ${model.name}'s availability for campaigns, editorials, events, and brand partnerships.`}
            primaryLabel="Send Booking Enquiry"
            primaryHref="/contact"
            secondaryLabel="View Full Roster"
            secondaryHref="/models"
          />
        </div>
      </section>

      {/* SIMILAR MODELS */}
      {similar.length > 0 && (
        <section className="py-16 px-4 pb-24">
          <div className="max-w-7xl mx-auto">
            <h2 className="font-playfair text-3xl font-bold text-white mb-8">
              More {model.category} Talent
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {similar.map((m) => (
                <Link key={m.id} href={`/models/${m.id}`}>
                  <ModelCard model={m} />
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  )
}
