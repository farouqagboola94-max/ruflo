import { notFound } from 'next/navigation'
import Link from 'next/link'
import { news } from '@/data/news'
import NewsCard from '@/components/NewsCard'

export function generateStaticParams() {
  return news.map((a) => ({ slug: a.slug }))
}

export function generateMetadata({ params }: { params: { slug: string } }) {
  const article = news.find((a) => a.slug === params.slug)
  if (!article) return { title: 'Article Not Found' }
  return {
    title: `${article.title} | Catalyst Talents Lagos`,
    description: article.excerpt,
  }
}

const categoryColors: Record<string, string> = {
  Industry: '#60a5fa',
  'Model Feature': '#f87171',
  Events: '#D4AF37',
  Campaign: '#c084fc',
  News: '#34d399',
}

export default function ArticlePage({ params }: { params: { slug: string } }) {
  const article = news.find((a) => a.slug === params.slug)
  if (!article) notFound()

  const related = news.filter((a) => a.id !== article.id).slice(0, 3)

  const formattedDate = new Date(article.date).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })

  return (
    <>
      {/* HERO */}
      <section className="relative pt-40 pb-20 overflow-hidden">
        <div
          className="absolute inset-0"
          style={{ background: article.gradient }}
        />
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
              'linear-gradient(to bottom, rgba(10,10,10,0.6) 0%, rgba(10,10,10,0.85) 100%)',
          }}
        />
        <div className="relative z-10 max-w-3xl mx-auto px-4">
          <Link
            href="/news"
            className="inline-flex items-center gap-2 text-[10px] tracking-widest uppercase text-white/40 hover:text-[#D4AF37] transition-colors mb-8"
          >
            <span>←</span> All Stories
          </Link>
          <div className="flex items-center gap-3 mb-6">
            <span
              className="text-[10px] tracking-widest uppercase font-semibold"
              style={{ color: categoryColors[article.category] || '#D4AF37' }}
            >
              {article.category}
            </span>
            <span className="text-white/20">·</span>
            <span className="text-[10px] text-white/40 tracking-wider">{formattedDate}</span>
            <span className="text-white/20">·</span>
            <span className="text-[10px] text-white/40 tracking-wider">{article.readTime}</span>
          </div>
          <h1 className="font-playfair text-4xl sm:text-6xl font-bold text-white leading-tight">
            {article.title}
          </h1>
          <p className="text-white/50 text-lg mt-6 leading-relaxed">{article.excerpt}</p>
        </div>
      </section>

      {/* ARTICLE BODY */}
      <section className="py-16 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="h-px w-16 bg-[#D4AF37] mb-12" />
          <div className="space-y-6">
            {article.content.split('\n\n').map((para, i) => (
              <p key={i} className="text-white/60 leading-relaxed text-lg">
                {para}
              </p>
            ))}
          </div>

          {/* Share / back */}
          <div className="mt-16 pt-8 border-t border-white/5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
            <Link
              href="/news"
              className="text-[10px] tracking-widest uppercase text-[#D4AF37]/50 hover:text-[#D4AF37] border-b border-[#D4AF37]/20 hover:border-[#D4AF37] pb-1 transition-all"
            >
              ← Back to all stories
            </Link>
            <div className="flex gap-4">
              <Link
                href="/contact"
                className="text-[10px] tracking-widest uppercase text-white/30 hover:text-[#D4AF37] transition-colors"
              >
                Book Talent
              </Link>
              <Link
                href="/apply"
                className="text-[10px] tracking-widest uppercase text-white/30 hover:text-[#D4AF37] transition-colors"
              >
                Apply to Join
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* RELATED */}
      {related.length > 0 && (
        <section className="py-16 px-4 pb-24" style={{ background: '#111111' }}>
          <div className="max-w-7xl mx-auto">
            <h2 className="font-playfair text-3xl font-bold text-white mb-8">More Stories</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {related.map((a) => (
                <NewsCard key={a.id} article={a} />
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  )
}
