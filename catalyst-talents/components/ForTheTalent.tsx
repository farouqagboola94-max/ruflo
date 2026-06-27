const features = [
  'Personal booking manager — someone in your corner always',
  'Contract review and fair negotiation on every single deal',
  'Fair pay advocacy — you are never underpaid on our watch',
  'Direct access to brand deals, campaigns, and opportunities',
  'Career strategy sessions to map your long-term growth',
  'Welfare and emotional support throughout your career',
  'Professional portfolio development from day one',
  'Cultural representation — your Lagos identity is your asset',
]

export default function ForTheTalent() {
  return (
    <section
      className="py-28 px-4"
      style={{ background: 'linear-gradient(135deg, #060605 0%, #0a0a08 100%)' }}
    >
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          {/* Left */}
          <div>
            <p className="text-[#D4AF37] text-[10px] tracking-[0.5em] uppercase mb-5">
              For Every Talent We Sign
            </p>
            <h2 className="font-playfair text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight mb-8">
              Everything
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
                You Need.
              </span>
            </h2>
            <div className="h-px w-14 bg-[#D4AF37] mb-8" />
            <p className="text-white/45 text-lg leading-relaxed mb-4">
              This is different. This is CTL.
            </p>
            <p className="text-white/30 leading-relaxed">
              Most agencies take your face and leave. We take your career and build it. Every
              talent we sign gets a real support system — not just a listing on a roster.
            </p>
          </div>
          {/* Right */}
          <div
            className="grid grid-cols-1 sm:grid-cols-2 gap-px"
            style={{ background: 'rgba(212,175,55,0.08)' }}
          >
            {features.map((f, i) => (
              <div
                key={i}
                className="group px-6 py-5"
                style={{ background: '#080806' }}
              >
                <div className="flex items-start gap-3">
                  <span className="text-[#D4AF37] text-sm mt-0.5 flex-shrink-0 group-hover:scale-110 transition-transform">
                    ✦
                  </span>
                  <span className="text-white/40 text-sm leading-relaxed group-hover:text-white/65 transition-colors duration-300">
                    {f}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
