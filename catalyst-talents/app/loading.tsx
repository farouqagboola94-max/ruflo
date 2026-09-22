export default function Loading() {
  return (
    <section className="min-h-screen flex items-center justify-center">
      <div className="flex flex-col items-center gap-6">
        <div className="relative w-12 h-12">
          <div
            className="absolute inset-0 rounded-full border-2 border-transparent animate-spin"
            style={{ borderTopColor: '#D4AF37' }}
          />
          <div
            className="absolute inset-2 rounded-full border border-[#D4AF37]/20"
          />
        </div>
        <div className="text-center">
          <p className="font-playfair text-lg text-white/50">CATALYST</p>
          <p className="text-[10px] tracking-[0.4em] uppercase text-[#D4AF37]/40 mt-0.5">Talents Lagos</p>
        </div>
      </div>
    </section>
  )
}
