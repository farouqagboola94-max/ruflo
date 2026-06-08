import Link from 'next/link'
import type { Metadata } from 'next'
import { news } from '@/data/news'

export const metadata: Metadata = {
  title: 'News & Stories | Catalyst Talents Lagos',
  description:
    'Industry insights, perspectives on talent, and everything happening at Catalyst Talents Lagos.',
}

export default function NewsPage() {
  const featured = news.find((a) => a.featured)
  const rest = news.filter((a) => !a.featured)

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
          <h1 className="font-playfair text-5xl sm:text-7xl font-bold text-white">News &amp; Stories</h1>
          <p className="text-white/40 mt-4 max-w-lg">
            Industry insights, perspectives on talent, and everything happening at Catalyst Talents
            Lagos.
          </p>
        </div>
      </section>

      {/* FEATURED ARTICLE */}
      {featured && (
        <section className="py-12 px-4">
          <div className="max-w-7xl mx-auto">
            <Link href={`/news/${featured.slug}`} className="group block">
              <div
                className="relative p-12 sm:p-16 border border-[#D4AF37]/15 overflow-hidden"
                style={{ background: featured.gradient }}
              >
                <div className="absolute inset-0 bg-black/55" />
                <div className="relative z-10 max-w-2xl">
                  <div className="flex items-center gap-4 mb-6">
                    <span className="text-[10px] tracking-[0.4em] uppercase text-[#D4AF37]">
                      {featured.category}
                    </span>
                    <span className="text-white/25 text-xs">·</span>
                    <span className="text-white/30 text-xs">{featured.readTime}</span>
                  </div>
                  <h2 className="font-playfair text-3xl sm:text-4xl font-bold text-white mb-4 group-hover:text-[#D4AF37]/90 transition-colors leading-snug">
                    {featured.title}
                  </h2>
                  <p className="text-white/50 leading-relaxed mb-8">{featured.excerpt}</p>
                  <span className="text-[#D4AF37] text-xs tracking-widest uppercase border-b border-[#D4AF37]/30 group-hover:border-[#D4AF37] pb-0.5 transition-colors">
                    Read Article &rarr;
                  </span>
                </div>
              </div>
            </Link>
          </div>
        </section>
      )}

      {/* ARTICLES GRID */}
      <section className="py-12 px-4 pb-28">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {rest.map((article) => (
              <Link key={article.id} href={`/news/${article.slug}`} className="group block h-full">
                <div
                  className="h-full p-8 border border-white/5 hover:border-[#D4AF37]/20 transition-colors duration-300 relative overflow-hidden flex flex-col"
                  style={{ background: article.gradient }}
                >
                  <div className="absolute inset-0 bg-black/55" />
                  <div className="relative z-10 flex flex-col h-full">
                    <div className="flex items-center gap-3 mb-4">
                      <span className="text-[10px] tracking-widest uppercase text-[#D4AF37]/70">
                        {article.category}
                      </span>
                      <span className="text-white/20 text-xs">·</span>
                      <span className="text-white/25 text-xs">{article.readTime}</span>
                    </div>
                    <h3 className="font-playfair text-xl font-bold text-white mb-3 group-hover:text-[#D4AF37]/90 transition-colors leading-snug">
                      {article.title}
                    </h3>
                    <p className="text-white/40 text-sm leading-relaxed flex-1">
                      {article.excerpt}
                    </p>
                    <div className="mt-6 pt-6 border-t border-white/5 flex items-center justify-between">
                      <span className="text-white/25 text-xs">
                        {new Date(article.date).toLocaleDateString('en-NG', {
                          month: 'long',
                          year: 'numeric',
                        })}
                      </span>
                      <span className="text-[#D4AF37]/50 text-xs tracking-widest uppercase group-hover:text-[#D4AF37] transition-colors">
                        Read &rarr;
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
