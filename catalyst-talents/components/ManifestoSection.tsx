export default function ManifestoSection() {
  return (
    <section
      className="relative py-28 px-4 overflow-hidden"
      style={{ background: '#010201' }}
    >
      {/* Aso-oke textile overlay */}
      <div className="absolute inset-0 aso-oke-texture pointer-events-none" />

      {/* Gold left accent line */}
      <div
        className="absolute left-0 inset-y-0 w-[2px]"
        style={{
          background:
            'linear-gradient(to bottom, transparent 0%, #D4AF37 25%, #D4AF37 75%, transparent 100%)',
        }}
      />

      {/* Watermark */}
      <div
        className="absolute right-4 top-1/2 -translate-y-1/2 font-playfair font-bold select-none pointer-events-none leading-none"
        style={{
          fontSize: 'clamp(72px, 16vw, 180px)',
          color: 'rgba(212,175,55,0.04)',
          writingMode: 'vertical-rl',
          textOrientation: 'mixed',
          transform: 'translateY(-50%) rotate(180deg)',
        }}
        aria-hidden="true"
      >
        CTL
      </div>

      <div className="max-w-5xl mx-auto relative z-10">
        <p className="text-[#D4AF37] text-[10px] tracking-[0.6em] uppercase mb-14">
          The Catalyst Manifesto
        </p>

        <div className="space-y-8">
          {/* Big statement */}
          <h2
            className="font-playfair font-bold text-white leading-[1.05]"
            style={{ fontSize: 'clamp(2.4rem, 7.5vw, 5.5rem)' }}
          >
            Lagos has always been
            <br />
            <span
              style={{
                background:
                  'linear-gradient(135deg, #D4AF37 0%, #F0D060 50%, #D4AF37 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                fontStyle: 'italic',
              }}
            >
              world-class.
            </span>
          </h2>

          {/* Sub-statement */}
          <p className="font-playfair text-2xl sm:text-3xl text-white/38 italic leading-relaxed">
            The talent was never the problem.
            <br />
            The platform was.
          </p>

          {/* Divider */}
          <div
            className="w-20 h-px"
            style={{
              background: 'linear-gradient(to right, #D4AF37, transparent)',
            }}
          />

          {/* Body */}
          <p className="text-white/32 text-base sm:text-lg leading-relaxed max-w-2xl">
            We are not here to copy what other agencies do and apply a Lagos label to it.
            We are here to build something that belongs to this city — that moves at its
            speed, reflects its culture, and carries its talent to wherever they deserve to be.
          </p>

          {/* Three-line closer */}
          <div className="pt-10 flex flex-col gap-3">
            <p
              className="font-playfair text-3xl sm:text-4xl font-bold italic"
              style={{ color: '#D4AF37' }}
            >
              We Believe.
            </p>
            <p className="font-playfair text-3xl sm:text-4xl font-bold text-white italic">
              We Set the Standard.
            </p>
            <p
              className="font-playfair text-3xl sm:text-4xl font-bold italic"
              style={{ color: 'rgba(255,255,255,0.14)' }}
            >
              We are Catalyst.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
