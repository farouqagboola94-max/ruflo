import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'News & Stories | Catalyst Talents Lagos',
  description:
    'Industry news, model features, campaign stories, and behind-the-scenes from Catalyst Talents Lagos. Coming soon.',
}

export default function NewsPage() {
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

      {/* COMING SOON */}
      <section className="py-24 px-4 pb-32">
        <div className="max-w-xl mx-auto text-center">
          <div className="w-14 h-px bg-[#D4AF37] mx-auto mb-12" />
          <p className="text-[#D4AF37] text-[10px] tracking-[0.4em] uppercase mb-6">Coming Soon</p>
          <h2 className="font-playfair text-4xl font-bold text-white mb-6">
            Stories on the Way
          </h2>
          <p className="text-white/40 leading-relaxed mb-12">
            We&apos;re working on our first stories — model features, campaign breakdowns, and
            perspectives on the Lagos creative industry. Check back soon.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/models"
              className="px-10 py-4 bg-[#D4AF37] text-black font-bold text-xs tracking-widest uppercase hover:bg-[#F0D060] transition-colors"
            >
              Browse Models
            </Link>
            <Link
              href="/contact"
              className="px-10 py-4 border border-[#D4AF37]/35 text-[#D4AF37] text-xs tracking-widest uppercase hover:border-[#D4AF37] hover:bg-[#D4AF37]/10 transition-all"
            >
              Stay in Touch
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
