const standards = [
  {
    number: '01',
    title: 'Talent First. Always.',
    description:
      'Every decision — from contracts to campaigns — starts with one question: is this right for the talent? Welfare is not optional here. It is the operating system.',
  },
  {
    number: '02',
    title: 'Transparent in Every Deal.',
    description:
      'No hidden cuts. No buried clauses. Every contract we negotiate is explained, line by line, to the person signing it. You deserve to understand exactly what you are walking into.',
  },
  {
    number: '03',
    title: 'Lagos Culture is Non-Negotiable.',
    description:
      'We represent from Lagos, not despite it. Our talent\'s identity — their look, their energy, their culture — is their power. We never ask anyone to water that down for any room.',
  },
  {
    number: '04',
    title: 'Careers, Not Just Bookings.',
    description:
      'One job is not the goal. We think long-term — building portfolios, developing presence, and positioning talent for a career that outlasts any single campaign or season.',
  },
  {
    number: '05',
    title: 'Open Doors. Real Opportunity.',
    description:
      'You do not need industry connections or prior experience to register with us. Talent and commitment are the only criteria that matter. The door is genuinely, fully open.',
  },
  {
    number: '06',
    title: 'Global Reach. Lagos Soul.',
    description:
      'We are building routes to international markets and platforms — but we never forget where we come from. Lagos is not a stepping stone. It is the foundation. Always.',
  },
]

export default function TestimonialsSection() {
  return (
    <section
      className="relative py-28 px-4 overflow-hidden"
      style={{
        background:
          'linear-gradient(160deg, #030904 0%, #060d06 60%, #030904 100%)',
      }}
    >
      {/* Aso-oke textile overlay */}
      <div className="absolute inset-0 aso-oke-texture pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="mb-16">
          <p className="text-[#D4AF37] text-[10px] tracking-[0.5em] uppercase mb-3">
            Our Non-Negotiables
          </p>
          <h2 className="font-playfair text-4xl sm:text-5xl font-bold text-white">
            The CTL Standard
            <span className="block w-14 h-px bg-[#D4AF37] mt-4" />
          </h2>
          <p className="text-white/22 text-sm mt-5 max-w-lg leading-relaxed">
            These are not aspirations. They are commitments — what we hold ourselves to from day one.
          </p>
        </div>

        <div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px"
          style={{ background: 'rgba(212,175,55,0.06)' }}
        >
          {standards.map((s) => (
            <div
              key={s.number}
              className="p-10 group transition-colors duration-500"
              style={{
                background:
                  'linear-gradient(135deg, rgba(3,9,4,0.97) 0%, rgba(5,13,5,0.97) 100%)',
              }}
            >
              <p
                className="font-playfair text-6xl font-bold mb-6 leading-none"
                style={{ color: 'rgba(212,175,55,0.09)' }}
              >
                {s.number}
              </p>
              <h3 className="font-playfair text-lg font-bold text-white mb-3 group-hover:text-[#D4AF37] transition-colors duration-500">
                {s.title}
              </h3>
              <p className="text-white/38 text-sm leading-relaxed">{s.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
