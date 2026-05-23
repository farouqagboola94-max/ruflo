import Link from 'next/link'

interface BookingCTAProps {
  title?: string
  subtitle?: string
  primaryLabel?: string
  primaryHref?: string
  secondaryLabel?: string
  secondaryHref?: string
}

export default function BookingCTA({
  title = 'Book This Talent',
  subtitle = 'Get in touch with our booking team for availability, rates, and casting packages.',
  primaryLabel = 'Send Booking Enquiry',
  primaryHref = '/contact',
  secondaryLabel = 'View All Models',
  secondaryHref = '/models',
}: BookingCTAProps) {
  return (
    <div
      className="p-10 sm:p-16 text-center"
      style={{
        background: 'linear-gradient(135deg, #1a1208 0%, #2a1e0a 100%)',
        border: '1px solid rgba(212,175,55,0.2)',
      }}
    >
      <p className="text-[#D4AF37] text-[10px] tracking-[0.4em] uppercase mb-3">Catalyst Talents Lagos</p>
      <h3 className="font-playfair text-3xl font-bold text-white mb-3">{title}</h3>
      <p className="text-white/50 text-sm max-w-sm mx-auto mb-8 leading-relaxed">{subtitle}</p>
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Link
          href={primaryHref}
          className="px-8 py-3.5 bg-[#D4AF37] text-black text-xs font-bold tracking-widest uppercase hover:bg-[#F0D060] transition-colors duration-300"
        >
          {primaryLabel}
        </Link>
        <Link
          href={secondaryHref}
          className="px-8 py-3.5 border border-[#D4AF37]/30 text-[#D4AF37] text-xs tracking-widest uppercase hover:border-[#D4AF37] hover:bg-[#D4AF37]/10 transition-all duration-300"
        >
          {secondaryLabel}
        </Link>
      </div>
    </div>
  )
}
