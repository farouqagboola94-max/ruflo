import Link from 'next/link'
import { news } from '@/data/news'
import NewsCard from '@/components/NewsCard'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'News & Stories | Catalyst Talents Lagos',
  description:
    'Industry news, model features, campaign stories, and behind-the-scenes from Catalyst Talents Lagos.',
}

export default function NewsPage() {
  const featured = news.find((a) => a.featured) ?? news[0]
  const rest = news.filter((a) => a.id !== featured.id)

  const formattedDate = new Date(featured.date).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })

  const categoryColors: Record<string, string> = {
    Industry: '#60a5fa',
    'Model Feature': '#f87171',
    Events: '#D4AF37',
    Campaign: '#c084fc',
    News: '#34d399',
  }

  return (
    <>
      {/* HEADER */}
      <section
        className="pt-40 pb-16 px-4"
        style={{ background: 'linear-gradient(180deg, #050505 0%, #0d0d0d 100%)' }}
      >
        <div className="max-w-7xl mx-auto">
          <p className="text-[#D4AF37] text-[10px] tracking-[0.5em] uppercase mb-4">
            Catalyst Talents Lagos
          </p>
          <h1 className="font-playfair text-5xl sm:text-7xl font-bold text-white">News & Stories</h1>
          <p className="text-white/40 mt-4 max-w-lg">
            Industry insights, model features, campaign stories, and everything happening at
            Catalyst Talents Lagos.
          </p>
        </div>
      </section>

      {/* FEATURED ARTICLE */}
      <section className="px-4 pb-6">
        <div className="max-w-7xl mx-auto">
          <Link href={`/news/${featured.slug}`} className="group block">
            <div className="relative overflow-hidden border border-white/5 group-hover:border-[#D4AF37]/25 transition-all duration-500">
              <div
                className="aspect-[16/6] sm:aspect-[16/5]"
                style={{ background: featured.gradient }}
              >
                <div
                  className="absolute inset-0"
                  style={{
                    backgroundImage:
                      'linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)',
                    backgroundSize: '60px 60px',
                  }}
                />
                <div
                  className="absolute inset-0"
                  style={{
                    background:
                      'linear-gradient(to right, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.4) 50%, transparent 100%)',
                  }}
                />
                <div className="absolute inset-0 flex items-end sm:items-center p-8 sm:p-12">
                  <div className="max-w-lg">
                    <div className="flex items-center gap-3 mb-4">
                      <span
                        className="text-[10px] tracking-widest uppercase font-semibold px-3 py-1 border"
                        style={{
                          color: categoryColors[featured.category] || '#D4AF37',
                          borderColor: `${categoryColors[featured.category] || '#D4AF37'}40`,
                        }}
                      >
                        {featured.category}
                      </span>
                      <span className="text-[10px] text-white/30 tracking-wider uppercase">
                        {formattedDate}
                      </span>
                    </div>
                    <h2 className="font-playfair text-2xl sm:text-4xl font-bold text-white mb-3 group-hover:text-[#D4AF37]/90 transition-colors">
                      {featured.title}
                    </h2>
                    <p className="text-white/50 text-sm leading-relaxed hidden sm:block">
                      {featured.excerpt}
                    </p>
                    <div className="mt-5 flex items-center gap-2 text-[10px] tracking-widest uppercase text-[#D4AF37]/50 group-hover:text-[#D4AF37] transition-colors">
                      <span>Read story</span>
                      <span>→</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Link>
        </div>
      </section>

      {/* ARTICLE GRID */}
      <section className="py-10 px-4 pb-24">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {rest.map((article) => (
              <NewsCard key={article.id} article={article} />
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
