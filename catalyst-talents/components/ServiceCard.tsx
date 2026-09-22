import { Service } from '@/data/services'

export default function ServiceCard({ service, minimal = false }: { service: Service; minimal?: boolean }) {
  return (
    <div className="group p-8 border border-white/5 hover:border-[#D4AF37]/30 transition-all duration-500">
      <span className="text-[#D4AF37] text-2xl block mb-4">{service.icon}</span>
      <h3 className="font-playfair text-xl font-bold text-white mb-3">{service.title}</h3>
      <p className="text-white/50 text-sm leading-relaxed mb-6">{service.description}</p>
      {!minimal && (
        <ul className="space-y-2">
          {service.features.slice(0, 4).map((f) => (
            <li key={f} className="flex items-start gap-2 text-xs text-white/30">
              <span className="text-[#D4AF37]/50 mt-0.5 flex-shrink-0">—</span>
              {f}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
