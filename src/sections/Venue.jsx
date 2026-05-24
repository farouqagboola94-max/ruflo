import { B } from '../tokens'
import { GrainOverlay, SectionTag } from '../components/Shared'
import { SOCIAL_LINKS } from '../config'

export default function Venue() {
  return (
    <section
      id="venue"
      style={{
        background: B.void,
        padding: '100px 0',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <div style={{ position: 'absolute', top: '10%', right: '-5%', width: 400, height: 400, background: B.neonCyan + '10', borderRadius: '50%', filter: 'blur(80px)', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', bottom: '10%', left: '-5%', width: 350, height: 350, background: B.amber + '10', borderRadius: '50%', filter: 'blur(80px)', pointerEvents: 'none' }} />
      <GrainOverlay />

      <div style={{ maxWidth: 900, margin: '0 auto', padding: '0 24px', textAlign: 'center', position: 'relative', zIndex: 10 }}>

        <SectionTag label="THE VENUE" />

        {/* Date confirmed badge */}
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 8, marginBottom: 28,
          padding: '6px 20px',
          background: `${B.amber}15`,
          border: `1px solid ${B.amber}50`,
          borderRadius: 24,
        }}>
          <div style={{ width: 5, height: 5, borderRadius: '50%', background: B.neonLime, boxShadow: `0 0 6px ${B.neonLime}`, animation: 'pulse 2s infinite' }} />
          <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 9, color: B.amber, letterSpacing: '0.3em' }}>DECEMBER 12, 2026 — DATE CONFIRMED</span>
        </div>

        <h2 style={{
          fontFamily: "'Bebas Neue', sans-serif",
          fontSize: 'clamp(60px, 10vw, 110px)',
          color: B.white, lineHeight: 0.88,
          marginBottom: 12, letterSpacing: '0.02em',
        }}>
          VENUE<br />
          <span style={{ color: B.amber }}>INCOMING.</span>
        </h2>

        <div style={{ width: 60, height: 2, background: `linear-gradient(90deg, transparent, ${B.amber}, transparent)`, margin: '24px auto 28px' }} />

        <div style={{
          fontFamily: "'Syne', sans-serif",
          fontSize: 'clamp(15px, 2vw, 18px)',
          color: '#c8c5be',
          lineHeight: 1.8,
          maxWidth: 560,
          margin: '0 auto 16px',
        }}>
          We've confirmed the date. The venue announcement is coming — and it will be worth the wait.
        </div>
        <div style={{
          fontFamily: "'Space Mono', monospace",
          fontSize: 11,
          color: B.smoke,
          letterSpacing: '0.2em',
          marginBottom: 52,
        }}>
          LAGOS, NIGERIA · DECEMBER 12, 2026
        </div>

        {/* Event details card */}
        <div style={{
          background: 'rgba(255,255,255,0.03)',
          border: `1px solid ${B.amber}30`,
          borderRadius: 16,
          padding: '44px 40px',
          marginBottom: 48,
          backdropFilter: 'blur(20px)',
          position: 'relative',
          overflow: 'hidden',
          textAlign: 'left',
        }}>
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg, ${B.amber}, ${B.neonCyan}, transparent)` }} />
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 32 }}>
            {[
              { label: 'DATE', value: 'Saturday, December 12', color: B.amber },
              { label: 'DOORS', value: '12:00 PM — 10:00 PM', color: B.neonCyan },
              { label: 'CITY', value: 'Lagos, Nigeria', color: B.neonLime },
              { label: 'VENUE', value: 'Announcement coming', color: B.smoke },
            ].map(({ label, value, color }) => (
              <div key={label}>
                <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 7.5, color: B.smoke, letterSpacing: '0.3em', marginBottom: 8 }}>{label}</div>
                <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 20, color, letterSpacing: '0.05em', lineHeight: 1.2 }}>{value}</div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA — get notified */}
        <div style={{ marginBottom: 20 }}>
          <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 8, color: B.smoke, letterSpacing: '0.25em', marginBottom: 20 }}>
            BE FIRST TO KNOW THE VENUE
          </div>
          <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
            <a
              href={SOCIAL_LINKS.whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                padding: '14px 32px',
                background: '#25D366',
                color: B.black,
                fontFamily: "'Space Mono', monospace",
                fontSize: 10, fontWeight: 700, letterSpacing: '0.15em',
                textDecoration: 'none', borderRadius: 4,
                boxShadow: '0 0 28px rgba(37,211,102,0.25)',
              }}
            >
              JOIN WHATSAPP →
            </a>
            <a
              href="#waitlist"
              style={{
                padding: '14px 32px',
                background: 'rgba(255,255,255,0.05)',
                backdropFilter: 'blur(10px)',
                color: B.amber,
                fontFamily: "'Space Mono', monospace",
                fontSize: 10, letterSpacing: '0.15em',
                textDecoration: 'none', borderRadius: 4,
                border: `1px solid ${B.amber}40`,
              }}
            >
              EARLY ACCESS →
            </a>
          </div>
        </div>

      </div>
    </section>
  )
}
