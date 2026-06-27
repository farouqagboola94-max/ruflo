export default function LagosDNA() {
  return (
    <section
      className="relative py-32 px-4 overflow-hidden"
      style={{ background: '#030303' }}
    >
      {/* Oversized LAGOS watermark */}
      <div
        className="absolute inset-0 flex items-center justify-center pointer-events-none select-none"
        aria-hidden="true"
      >
        <span
          className="font-playfair font-bold"
          style={{
            fontSize: 'clamp(96px, 24vw, 360px)',
            background: 'linear-gradient(135deg, #D4AF37 0%, #F0D060 50%, #D4AF37 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            opacity: 0.035,
            lineHeight: 1,
            userSelect: 'none',
            letterSpacing: '-0.02em',
          }}
        >
          LAGOS
        </span>
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-5xl mx-auto text-center">
        <p className="text-[#D4AF37] text-[10px] tracking-[0.5em] uppercase mb-8">
          ✦ &nbsp; The DNA of This Agency &nbsp; ✦
        </p>
        <h2 className="font-playfair text-4xl sm:text-5xl lg:text-7xl font-bold text-white leading-tight mb-8">
          This city doesn&apos;t
          <br />
          produce talent.
          <br />
          <span
            className="italic"
            style={{
              background: 'linear-gradient(135deg, #D4AF37 0%, #F0D060 50%, #D4AF37 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            It produces legends.
          </span>
        </h2>
        <div className="h-px w-14 bg-[#D4AF37] mx-auto mb-8" />
        <p className="text-white/40 text-lg max-w-2xl mx-auto leading-relaxed">
          Every great runway, every global campaign, every viral moment — somewhere behind it
          there is someone with the hunger, the nerve, and the soul of this city.
          We are here to give that person a name, a platform, and a future.
        </p>
        <p
          className="mt-12 text-[10px] tracking-[0.6em] uppercase"
          style={{ color: 'rgba(212,175,55,0.3)' }}
        >
          Lagos &nbsp;·&nbsp; Nigeria &nbsp;·&nbsp; The World
        </p>
      </div>
    </section>
  )
}
