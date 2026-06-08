import { notFound } from 'next/navigation'
import Link from 'next/link'
import { news } from '@/data/news'
import type { Metadata } from 'next'

export function generateStaticParams() {
  return news.map((a) => ({ slug: a.slug }))
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const article = news.find((a) => a.slug === params.slug)
  if (!article) return { title: 'Article Not Found' }
  return {
    title: `${article.title} | Catalyst Talents Lagos`,
    description: article.excerpt,
  }
}

export default function NewsArticlePage({ params }: { params: { slug: string } }) {
  const article = news.find((a) => a.slug === params.slug)
  if (!article) notFound()

  const related = news.filter((a) => a.id !== article.id).slice(0, 3)

  return (
    <>
      {/* HERO */}
      <section
        className="pt-40 pb-20 px-4 relative overflow-hidden"
        style={{ background: article.gradient }}
      >
        <div className="absolute inset-0 bg-black/60" />
        <div className="max-w-4xl mx-auto relative z-10">
          <Link
            href="/news"
            className="inline-flex items-center gap-2 text-[10px] tracking-widest uppercase text-white/40 hover:text-[#D4AF37] transition-colors mb-8"
          >
            &larr; News &amp; Stories
          </Link>
          <div className="flex flex-wrap items-center gap-4 mb-6">
            <span className="text-[10px] tracking-[0.4em] uppercase text-[#D4AF37]">
              {article.category}
            </span>
            <span className="text-white/25 text-xs">·</span>
            <span className="text-white/30 text-xs">{article.readTime}</span>
            <span className="text-white/25 text-xs">·</span>
            <span className="text-white/30 text-xs">
              {new Date(article.date).toLocaleDateString('en-NG', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
              })}
            </span>
          </div>
          <h1 className="font-playfair text-4xl sm:text-6xl font-bold text-white mb-6 leading-tight">
            {article.title}
          </h1>
          <p className="text-white/60 text-xl leading-relaxed">{article.excerpt}</p>
        </div>
      </section>

      {/* ARTICLE BODY */}
      <section className="py-20 px-4">
        <div className="max-w-3xl mx-auto">
          {article.content.split('\n\n').map((para, i) => (
            <p key={i} className="text-white/60 leading-relaxed mb-6 text-base">
              {para}
            </p>
          ))}
        </div>
      </section>

      {/* DIVIDER */}
      <div className="max-w-3xl mx-auto px-4">
        <div className="h-px bg-gradient-to-r from-transparent via-[#D4AF37]/15 to-transparent" />
      </div>

      {/* CTA */}
      <section className="py-16 px-4">
        <div className="max-w-3xl mx-auto">
          <p className="text-white/30 text-xs tracking-widest uppercase mb-6">Catalyst Talents Lagos</p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              href="/apply"
              className="px-10 py-4 bg-[#D4AF37] text-black font-bold text-xs tracking-widest uppercase hover:bg-[#F0D060] transition-colors"
            >
              Apply to Join
            </Link>
            <Link
              href="/contact"
              className="px-10 py-4 border border-[#D4AF37]/30 text-[#D4AF37] text-xs tracking-widest uppercase hover:border-[#D4AF37] hover:bg-[#D4AF37]/10 transition-all"
            >
              Get in Touch
            </Link>
          </div>
        </div>
      </section>

      {/* MORE READS */}
      {related.length > 0 && (
        <section className="py-16 px-4 pb-28">
          <div className="max-w-7xl mx-auto">
            <h2 className="font-playfair text-3xl font-bold text-white mb-8">More Reads</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {related.map((a) => (
                <Link key={a.id} href={`/news/${a.slug}`} className="group block">
                  <div
                    className="p-8 border border-white/5 hover:border-[#D4AF37]/20 transition-colors duration-300 relative overflow-hidden"
                    style={{ background: a.gradient }}
                  >
                    <div className="absolute inset-0 bg-black/55" />
                    <div className="relative z-10">
                      <span className="text-[10px] tracking-widest uppercase text-[#D4AF37]/70 mb-3 block">
                        {a.category}
                      </span>
                      <h3 className="font-playfair text-lg font-bold text-white group-hover:text-[#D4AF37]/90 transition-colors mb-3 leading-snug">
                        {a.title}
                      </h3>
                      <span className="text-[#D4AF37]/50 text-xs tracking-widest uppercase group-hover:text-[#D4AF37] transition-colors mt-2 block">
                        Read &rarr;
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  )
}
