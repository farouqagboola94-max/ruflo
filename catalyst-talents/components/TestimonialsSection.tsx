import { testimonials } from '@/data/testimonials'

export default function TestimonialsSection() {
  return (
    <section
      className="py-24 px-4"
      style={{ background: 'linear-gradient(180deg, #0a0a0a 0%, #111108 100%)' }}
    >
      <div className="max-w-7xl mx-auto">
        <div className="mb-16">
          <p className="text-[#D4AF37] text-[10px] tracking-[0.4em] uppercase mb-3">What People Say</p>
          <h2 className="font-playfair text-4xl sm:text-5xl font-bold text-white">
            Testimonials
            <span className="block w-14 h-px bg-[#D4AF37] mt-4" />
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((t) => (
            <div
              key={t.id}
              className="p-8 border border-white/5 hover:border-[#D4AF37]/20 transition-all duration-500 flex flex-col"
              style={{ background: 'rgba(255,255,255,0.02)' }}
            >
              <div className="font-playfair text-4xl text-[#D4AF37] leading-none mb-4">&ldquo;</div>
              <p className="text-white/60 text-sm leading-relaxed flex-1 mb-6">{t.quote}</p>
              <div className="border-t border-white/5 pt-5">
                <p className="text-white font-semibold text-sm">{t.author}</p>
                <p className="text-white/40 text-xs mt-1">{t.role}</p>
                <p className="text-[#D4AF37]/60 text-xs mt-0.5">{t.company}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
