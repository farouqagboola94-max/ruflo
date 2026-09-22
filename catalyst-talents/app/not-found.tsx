import Link from 'next/link'

export default function NotFound() {
  return (
    <section className="min-h-screen flex items-center justify-center px-4">
      <div className="text-center max-w-lg">
        <p className="font-playfair text-[120px] sm:text-[180px] font-bold leading-none"
          style={{
            background: 'linear-gradient(135deg, #D4AF37 0%, #F0D060 50%, #D4AF37 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            opacity: 0.15,
          }}
        >
          404
        </p>
        <div className="-mt-6 sm:-mt-10">
          <h1 className="font-playfair text-4xl font-bold text-white mb-4">
            Page Not Found
          </h1>
          <p className="text-white/40 leading-relaxed mb-10">
            The page you&apos;re looking for has moved, or never existed. Let&apos;s get you back
            to discovering extraordinary talent.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/"
              className="px-10 py-4 bg-[#D4AF37] text-black font-bold text-xs tracking-widest uppercase hover:bg-[#F0D060] transition-colors"
            >
              Go Home
            </Link>
            <Link
              href="/models"
              className="px-10 py-4 border border-[#D4AF37]/30 text-[#D4AF37] text-xs tracking-widest uppercase hover:border-[#D4AF37] hover:bg-[#D4AF37]/10 transition-all"
            >
              View Models
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
