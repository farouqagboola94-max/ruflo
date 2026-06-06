import { Model } from '@/data/models'

const categoryColors: Record<string, string> = {
  Fashion: '#f87171',
  Commercial: '#60a5fa',
  Influencer: '#c084fc',
  Acting: '#fbbf24',
}

export default function ModelCard({ model }: { model: Model }) {
  return (
    <div className="group relative overflow-hidden border border-white/5 hover:border-[#D4AF37]/40 transition-all duration-500 cursor-pointer">
      <div className="relative aspect-[3/4] overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0" style={{ background: model.gradient }} />

        {/* Grid texture */}
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage:
              'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
            backgroundSize: '30px 30px',
          }}
        />

        {/* Gradient overlay */}
        <div
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(to top, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.35) 55%, transparent 100%)',
          }}
        />

        {/* Category badge */}
        <div className="absolute top-4 left-4">
          <span
            className="text-[10px] tracking-widest uppercase font-semibold"
            style={{ color: categoryColors[model.category] }}
          >
            {model.category}
          </span>
        </div>

        {/* Hover gold shimmer */}
        <div className="absolute inset-0 bg-[#D4AF37]/0 group-hover:bg-[#D4AF37]/6 transition-colors duration-500" />

        {/* Info — lifts on hover to reveal CTA */}
        <div className="absolute bottom-0 left-0 right-0 p-5 transition-transform duration-300 ease-out group-hover:-translate-y-11">
          <h3 className="font-playfair text-xl font-bold text-white mb-1">{model.name}</h3>
          <p className="text-white/50 text-xs tracking-wider mb-3">{model.tagline}</p>
          <div className="flex gap-4 text-xs text-white/30">
            {model.height && <span>H: {model.height}</span>}
            {model.bust && <span>B: {model.bust}</span>}
            {model.waist && <span>W: {model.waist}</span>}
          </div>
        </div>

        {/* Slide-up CTA */}
        <div className="absolute bottom-0 inset-x-0 h-11 bg-[#D4AF37] flex items-center justify-center gap-2 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out">
          <span className="text-black text-[10px] font-bold tracking-[0.35em] uppercase">View Profile</span>
          <span className="text-black text-[10px] font-bold">→</span>
        </div>
      </div>
    </div>
  )
}
