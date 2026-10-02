import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { SNEAKERS } from '@/data/sneakers'
export function generateStaticParams() { return SNEAKERS.map(s => ({ id: s.id })) }
export default async function SneakerDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const sneaker = SNEAKERS.find(s => s.id === id)
  if (!sneaker) notFound()
  return <section className="mx-auto max-w-5xl px-5 py-16">
    <Link href="/catalog" className="text-brand-orange">← Back to catalog</Link>
    <div className="mt-8 grid gap-8 md:grid-cols-2">
      <div className="relative aspect-square overflow-hidden rounded-2xl bg-brand-gray"><Image src={sneaker.image} alt="Illustrative sneaker photograph" fill className="object-cover" /></div>
      <div><p className="text-brand-orange">{sneaker.brand} · {sneaker.category}</p><h1 className="my-4 font-display text-4xl">{sneaker.name}</h1><p className="text-xl text-gray-300">{sneaker.colorway}</p>
        <p className="mt-6 text-gray-400">This is a reference profile from our sample catalog. Photos are illustrative; prices, condition and sizes are examples, not a seller offer or confirmed event inventory.</p>
        <dl className="my-6 space-y-3"><dt className="text-gray-400">Reference price</dt><dd>₦{sneaker.price.toLocaleString()}</dd><dt className="text-gray-400">Sample sizes (US)</dt><dd>{sneaker.size.join(', ')}</dd></dl>
        <div className="flex flex-wrap gap-3"><Link href="/marketplace" className="rounded-full bg-brand-orange px-5 py-3 font-bold text-black">Register listing interest</Link><Link href="/profile" className="rounded-full border border-white/20 px-5 py-3">My saved sneakers</Link></div>
      </div>
    </div>
  </section>
}
