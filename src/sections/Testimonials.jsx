import { B } from '../tokens'
import { GrainOverlay, SectionTag } from '../components/Shared'

const QUOTES = [
  {
    quote: "The best sneaker event I've ever attended on the continent. The energy was electric from doors open to close. Already counting down to '26.",
    name: 'CHIOMA A.',
    role: 'Collector · Lagos Island',
    accent: B.amber,
  },
  {
    quote: "Got a grail I'd been hunting for two years at the vendor floor. Didn't expect to find a clean pair at all. Sneakers Fest delivered.",
    name: 'EMEKA O.',
    role: 'Reseller · Abuja',
    accent: B.neonCyan,
  },
  {
    quote: "The custom art section was next level. Walked in with plain AF1s, walked out with a one-of-one piece. The artist was insane.",
    name: 'TUNDE B.',
    role: 'Sneakerhead · Port Harcourt',
    accent: B.neonMagenta,
  },
  {
    quote: "DJ Spinall closed the night perfectly. The community that shows up to this event — Lagos at its finest. Nothing else like it.",
    name: 'ADAEZE N.',
    role: 'Content Creator · Lekki',
    accent: B.neonLime,
  },
]

export default function Testimonials() {
  return (
    <section id="testimonials" style={{ position: 'relative', overflow: 'hidden', background: B.void, padding: '100px 24px' }}>
      <GrainOverlay />
      <div style={{ position: 'absolute', top: '30%', right: '-5%', width: 350, height: 350, background: `radial-gradient(circle, ${B.amber}08 0%, transparent 70%)`, filter: 'blur(70px)', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', bottom: '20%', left: '-5%', width: 300, height: 300, background: `radial-gradient(circle, ${B.neonCyan}07 0%, transparent 70%)`, filter: 'blur(70px)', pointerEvents: 'none' }} />

      <div style={{ position: 'relative', zIndex: 10, maxWidth: 1100, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 60 }}>
          <SectionTag>COMMUNITY VOICES</SectionTag>
          <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 'clamp(40px, 6vw, 68px)', color: B.white, lineHeight: 0.9 }}>
            THEY WERE<br /><span style={{ color: B.amber }}>THERE</span>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20 }}>
          {QUOTES.map((q, i) => (
            <div
              key={i}
              style={{ padding: 28, background: 'rgba(255,255,255,0.04)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)', border: `1px solid rgba(255,255,255,0.08)`, borderRadius: 14, position: 'relative', overflow: 'hidden', transition: 'all 0.3s' }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = q.accent + '50'; e.currentTarget.style.background = `rgba(255,255,255,0.07)`; e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = `0 16px 48px rgba(0,0,0,0.4), 0 0 0 1px ${q.accent}18` }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'; e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none' }}
            >
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 1, background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent)' }} />
              <div style={{ position: 'absolute', top: 0, left: 0, bottom: 0, width: 3, background: `linear-gradient(${q.accent}, ${q.accent}30)`, borderRadius: '14px 0 0 14px' }} />

              <div style={{ fontFamily: "'Orbitron', monospace", fontSize: 52, color: q.accent, opacity: 0.12, lineHeight: 0.8, marginBottom: 12, marginLeft: 8 }}>&quot;</div>

              <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 14, color: B.white, lineHeight: 1.75, marginBottom: 20, marginLeft: 8 }}>
                {q.quote}
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginLeft: 8 }}>
                <div style={{ width: 38, height: 38, borderRadius: '50%', background: q.accent + '20', border: `1.5px solid ${q.accent}50`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <span style={{ fontFamily: "'Orbitron', monospace", fontSize: 11, fontWeight: 900, color: q.accent }}>{q.name[0]}</span>
                </div>
                <div>
                  <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 9, color: q.accent, letterSpacing: '0.12em', fontWeight: 700 }}>{q.name}</div>
                  <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 11, color: B.smoke }}>{q.role}</div>
                </div>
                <div style={{ marginLeft: 'auto', padding: '3px 8px', background: q.accent + '12', border: `1px solid ${q.accent}30`, borderRadius: 20 }}>
                  <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 7, color: q.accent, letterSpacing: '0.1em' }}>VERIFIED</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div style={{ marginTop: 44, textAlign: 'center' }}>
          <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 14, color: B.smoke, lineHeight: 1.7 }}>
            Building toward 5,000+ community members by the time the doors open December 12.
          </div>
          <a href="#waitlist" style={{ display: 'inline-block', marginTop: 16, padding: '11px 28px', border: `1px solid ${B.amber}50`, color: B.amber, fontFamily: "'Space Mono', monospace", fontSize: 9, letterSpacing: '0.2em', textDecoration: 'none', borderRadius: 4, transition: 'all 0.25s' }}
            onMouseEnter={e => { e.currentTarget.style.background = B.amber + '15'; e.currentTarget.style.borderColor = B.amber }}
            onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = B.amber + '50' }}
          >GET EARLY ACCESS →</a>
        </div>
      </div>
    </section>
  )
}
