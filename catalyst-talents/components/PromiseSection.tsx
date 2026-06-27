const pillars = [
  {
    num: '01',
    symbol: '◈',
    title: 'Welfare First.',
    body: 'Fair pay. Safe conditions. Your rights protected on every booking. We never sacrifice your wellbeing for a deal — not once, not ever.',
  },
  {
    num: '02',
    symbol: '◆',
    title: 'Culture Intact.',
    body: 'Lagos made you. Your identity, your accent, your story — these are not obstacles. They are your power. We protect that always.',
  },
  {
    num: '03',
    symbol: '✦',
    title: 'Standard Elevated.',
    body: 'Not just bookings — careers. We represent you with the same professionalism that global agencies reserve for their biggest stars.',
  },
]

export default function PromiseSection() {
  return (
    <section
      style={{ background: 'linear-gradient(180deg, #050505 0%, #080806 100%)' }}
      className="py-28 px-4"
    >
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <p className="text-[#D4AF37] text-[10px] tracking-[0.5em] uppercase mb-4">
            What You Can Always Expect
          </p>
          <h2 className="font-playfair text-4xl sm:text-5xl lg:text-6xl font-bold text-white">
            The CTL Promise
          </h2>
          <div className="w-14 h-px bg-[#D4AF37] mx-auto mt-5" />
        </div>
        <div
          className="grid grid-cols-1 md:grid-cols-3"
          style={{ background: 'rgba(212,175,55,0.06)', gap: '1px' }}
        >
          {pillars.map((p) => (
            <div
              key={p.num}
              className="promise-pillar relative px-10 py-14 overflow-hidden"
              style={{ background: '#080806' }}
            >
              <div className="flex items-start gap-4 mb-6">
                <span
                  className="font-playfair text-5xl"
                  style={{ color: 'rgba(212,175,55,0.12)', lineHeight: 1 }}
                >
                  {p.symbol}
                </span>
                <span
                  className="text-[10px] tracking-[0.45em] uppercase mt-1"
                  style={{ color: 'rgba(212,175,55,0.35)' }}
                >
                  {p.num}
                </span>
              </div>
              <h3 className="font-playfair text-2xl font-bold text-white mb-4">{p.title}</h3>
              <p className="text-white/40 text-sm leading-relaxed">{p.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
