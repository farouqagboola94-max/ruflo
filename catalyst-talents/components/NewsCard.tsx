import Link from 'next/link'
import { NewsArticle } from '@/data/news'

const categoryColors: Record<string, string> = {
  Industry: '#60a5fa',
  'Model Feature': '#f87171',
  Events: '#D4AF37',
  Campaign: '#c084fc',
  News: '#34d399',
}

export default function NewsCard({ article }: { article: NewsArticle }) {
  const formattedDate = new Date(article.date).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })

  return (
    <Link href={`/news/${article.slug}`} className="group block">
      <div className="border border-white/5 group-hover:border-[#D4AF37]/25 transition-all duration-500 overflow-hidden">
        <div className="aspect-video relative overflow-hidden">
          <div className="absolute inset-0" style={{ background: article.gradient }} />
          <div
            className="absolute inset-0"
            style={{
              background:
                'linear-gradient(to bottom right, transparent 60%, rgba(0,0,0,0.5))',
            }}
          />
          <div className="absolute top-4 left-4">
            <span
              className="text-[10px] tracking-widest uppercase font-semibold"
              style={{ color: categoryColors[article.category] || '#D4AF37' }}
            >
              {article.category}
            </span>
          </div>
        </div>

        <div className="p-6" style={{ background: '#1A1A1A' }}>
          <div className="flex items-center gap-3 mb-3 text-[10px] text-white/30 tracking-wider uppercase">
            <span>{formattedDate}</span>
            <span>·</span>
            <span>{article.readTime}</span>
          </div>
          <h3 className="font-playfair text-lg font-bold text-white mb-2 group-hover:text-[#D4AF37]/90 transition-colors leading-snug">
            {article.title}
          </h3>
          <p className="text-white/40 text-sm leading-relaxed line-clamp-2">{article.excerpt}</p>
          <div className="mt-4 flex items-center gap-2 text-[10px] tracking-widest uppercase text-[#D4AF37]/40 group-hover:text-[#D4AF37] transition-colors">
            <span>Read more</span>
            <span>→</span>
          </div>
        </div>
      </div>
    </Link>
  )
}
