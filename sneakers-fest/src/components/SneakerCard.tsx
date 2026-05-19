import Image from 'next/image'
import { Sneaker } from '@/data/sneakers'

interface Props {
  sneaker: Sneaker
  showSeller?: boolean
}

const CONDITION_STYLES: Record<string, string> = {
  Deadstock: 'bg-yellow-500/20 text-yellow-400',
  New: 'bg-green-500/20 text-green-400',
  Used: 'bg-gray-500/20 text-gray-400',
}

export default function SneakerCard({ sneaker, showSeller }: Props) {
  return (
    <div className="bg-brand-gray rounded-2xl overflow-hidden card-hover border border-white/5 group">
      <div className="relative aspect-square bg-brand-muted overflow-hidden">
        <Image
          src={sneaker.image}
          alt={sneaker.name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <span className={`absolute top-3 right-3 text-xs font-semibold px-2 py-1 rounded-full ${CONDITION_STYLES[sneaker.condition]}`}>
          {sneaker.condition}
        </span>
      </div>

      <div className="p-4">
        <p className="text-xs text-brand-orange font-semibold uppercase tracking-wider mb-1">{sneaker.brand}</p>
        <h3 className="text-white font-bold text-sm leading-tight mb-1">{sneaker.name}</h3>
        <p className="text-gray-400 text-xs mb-3">{sneaker.colorway}</p>

        <div className="flex items-center justify-between">
          <div>
            <span className="text-white font-bold text-lg">${sneaker.price}</span>
            {sneaker.price > sneaker.retailPrice && (
              <span className="text-gray-500 text-xs line-through ml-2">${sneaker.retailPrice}</span>
            )}
          </div>
          <span className="text-xs text-gray-500">{sneaker.category}</span>
        </div>

        {showSeller && sneaker.seller && (
          <p className="text-xs text-gray-500 mt-2 pt-2 border-t border-white/5">Seller: <span className="text-gray-300">{sneaker.seller}</span></p>
        )}

        <div className="flex flex-wrap gap-1 mt-3">
          {sneaker.size.slice(0, 4).map(s => (
            <span key={s} className="text-xs px-2 py-0.5 bg-brand-muted rounded text-gray-400">{s}</span>
          ))}
          {sneaker.size.length > 4 && (
            <span className="text-xs px-2 py-0.5 bg-brand-muted rounded text-gray-500">+{sneaker.size.length - 4}</span>
          )}
        </div>

        <button className="mt-4 w-full py-2 rounded-lg bg-gradient-to-r from-brand-orange to-brand-yellow text-black text-sm font-bold hover:opacity-90 transition-opacity">
          View Deal
        </button>
      </div>
    </div>
  )
}
