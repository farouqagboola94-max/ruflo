import { useState } from 'react'
import { B } from '../tokens'

const TRANSPORT = [
  {
    icon: '🚌',
    method: 'BRT BUS',
    detail: 'Eko Atlantic Shuttle from CMS Bus Stop, Lagos Island',
    time: '~15 MIN',
    color: B.neonCyan,
  },
  {
    icon: '🚗',
    method: 'RIDE APP',
    detail: 'Uber / Bolt: search "Eko Atlantic City, Victoria Island"',
    time: '~20 MIN',
    color: B.amber,
  },
  {
    icon: '🅿️',
    method: 'PARKING',
    detail: 'Multi-level car park on Eko Boulevard — limited spots',
    time: 'FREE',
    color: B.neonLime,
  },
  {
    icon: '⛵',
    method: 'WATER BUS',
    detail: 'Five Cowrie Creek Terminal → Eko Atlantic Marina',
    time: '~10 MIN',
    color: B.neonMagenta,
  },
]

export default function Venue() {
  const [hovered, setHovered] = useState(null)

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

      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 24px' }}>

        {/* Header */}
        <div style={{ marginBottom: 60, textAlign: 'center' }}>
          <p style={{ fontFamily: 'Bebas Neue, sans-serif', color: B.amber, fontSize: 14, letterSpacing: 6, marginBottom: 12 }}>GETTING HERE</p>
          <h2 style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: 'clamp(48px, 8vw, 80px)', color: B.white, lineHeight: 1, letterSpacing: 2, marginBottom: 16 }}>FIND US</h2>
          <p style={{ color: B.smoke, fontSize: 16, maxWidth: 500, margin: '0 auto', lineHeight: 1.6 }}>
            We are on the edge of the Atlantic. Right where Lagos meets the ocean.
          </p>
        </div>

        {/* Main venue card */}
        <div style={{
          background: 'rgba(255,255,255,0.03)',
          border: `1px solid ${B.amber}30`,
          borderRadius: 20,
          padding: '48px',
          marginBottom: 40,
          backdropFilter: 'blur(20px) saturate(180%)',
          position: 'relative',
          overflow: 'hidden',
        }}>
          {/* Grid overlay */}
          <div style={{
            position: 'absolute', inset: 0, opacity: 0.04,
            backgroundImage: `linear-gradient(${B.smoke}40 1px, transparent 1px), linear-gradient(90deg, ${B.smoke}40 1px, transparent 1px)`,
            backgroundSize: '40px 40px',
            pointerEvents: 'none',
          }} />
          {/* Amber side accent */}
          <div style={{ position: 'absolute', top: 0, left: 0, width: 4, height: '100%', background: `linear-gradient(to bottom, ${B.amber}, transparent)`, borderRadius: '20px 0 0 20px' }} />

          <div style={{ display: 'flex', gap: 48, flexWrap: 'wrap', alignItems: 'flex-start', position: 'relative' }}>

            {/* Address info */}
            <div style={{ flex: '1 1 300px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
                <span style={{ fontSize: 32 }}>📍</span>
                <div>
                  <div style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: 28, color: B.amber, letterSpacing: 2 }}>EKO ATLANTIC CITY</div>
                  <div style={{ color: B.smoke, fontSize: 12, letterSpacing: 3, marginTop: 2 }}>VICTORIA ISLAND · LAGOS · NIGERIA</div>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginBottom: 32 }}>
                {[
                  { label: 'FULL ADDRESS', value: 'Eko Atlantic Event Centre, Ocean Drive, Eko Atlantic City, Lagos' },
                  { label: 'DATE', value: 'Saturday, December 12, 2026' },
                  { label: 'DOORS', value: '12:00 PM — 10:00 PM' },
                  { label: 'NEAREST LANDMARK', value: 'Bar Beach, Victoria Island' },
                  { label: 'COORDINATES', value: '6.4281° N, 3.4219° E' },
                ].map(({ label, value }) => (
                  <div key={label} style={{ display: 'flex', gap: 16 }}>
                    <span style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: 11, color: B.amber, letterSpacing: 2, minWidth: 130, paddingTop: 2, flexShrink: 0 }}>{label}</span>
                    <span style={{ color: B.white, fontSize: 14, lineHeight: 1.5 }}>{value}</span>
                  </div>
                ))}
              </div>

              <a
                href="https://maps.google.com/?q=Eko+Atlantic+City+Lagos+Nigeria"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'inline-block',
                  padding: '14px 28px',
                  background: B.amber,
                  color: B.black,
                  fontFamily: 'Bebas Neue, sans-serif',
                  fontSize: 16,
                  letterSpacing: 2,
                  borderRadius: 8,
                  textDecoration: 'none',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = `0 8px 24px ${B.amber}50` }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none' }}
              >
                OPEN IN GOOGLE MAPS →
              </a>
            </div>

            {/* Stylised map art */}
            <div style={{ flex: '0 1 280px' }}>
              <div style={{
                width: '100%',
                aspectRatio: '4/3',
                background: `radial-gradient(ellipse at 60% 60%, ${B.neonCyan}08, transparent 70%), ${B.charcoal}`,
                borderRadius: 16,
                border: `1px solid ${B.amber}20`,
                overflow: 'hidden',
                position: 'relative',
              }}>
                {/* Ocean */}
                <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '45%', background: `linear-gradient(to top, ${B.neonCyan}25, transparent)` }} />
                {/* Land mass */}
                <div style={{ position: 'absolute', top: 0, left: 0, right: '25%', bottom: '45%', background: B.gunmetal, borderRadius: '0 0 40px 0' }} />
                {/* Eko Atlantic peninsula */}
                <div style={{ position: 'absolute', bottom: '45%', left: '52%', width: 88, height: 55, background: `linear-gradient(135deg, ${B.charcoal}, ${B.gunmetal})`, border: `1px solid ${B.amber}40`, borderRadius: '10px 10px 0 0' }} />
                {/* Location pin */}
                <div style={{ position: 'absolute', bottom: 'calc(45% + 51px)', left: 'calc(52% + 36px)', transform: 'translateX(-50%)' }}>
                  <div style={{ width: 14, height: 14, background: B.amber, borderRadius: '50% 50% 50% 0', transform: 'rotate(-45deg)', boxShadow: `0 0 16px ${B.amber}` }} />
                </div>
                {/* Roads */}
                <div style={{ position: 'absolute', top: '35%', left: 0, right: '25%', height: 1, background: `${B.smoke}25` }} />
                <div style={{ position: 'absolute', top: 0, left: '38%', bottom: '45%', width: 1, background: `${B.smoke}25` }} />
                {/* Label chip */}
                <div style={{ position: 'absolute', bottom: '48%', left: '52%', background: B.amber, borderRadius: 4, padding: '3px 8px' }}>
                  <span style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: 9, color: B.black, letterSpacing: 1 }}>EKO ATLANTIC</span>
                </div>
                {/* Ocean label */}
                <div style={{ position: 'absolute', bottom: '12%', left: '10%', color: B.neonCyan + '60', fontFamily: 'Bebas Neue, sans-serif', fontSize: 11, letterSpacing: 3 }}>ATLANTIC OCEAN</div>
              </div>
              <div style={{ marginTop: 12, display: 'flex', gap: 16 }}>
                {[
                  { color: B.amber, label: 'VENUE' },
                  { color: B.neonCyan + '70', label: 'OCEAN' },
                  { color: B.gunmetal, label: 'LAND' },
                ].map(({ color, label }) => (
                  <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <div style={{ width: 10, height: 10, background: color, borderRadius: 2 }} />
                    <span style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: 10, color: B.smoke, letterSpacing: 1 }}>{label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Transport grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 20 }}>
          {TRANSPORT.map(({ icon, method, detail, time, color }) => (
            <div
              key={method}
              onMouseEnter={() => setHovered(method)}
              onMouseLeave={() => setHovered(null)}
              style={{
                background: 'rgba(255,255,255,0.03)',
                border: `1px solid ${color}${hovered === method ? '60' : '25'}`,
                borderRadius: 16,
                padding: '24px 20px',
                backdropFilter: 'blur(10px)',
                transition: 'transform 0.2s, border-color 0.2s, box-shadow 0.2s',
                transform: hovered === method ? 'translateY(-4px)' : 'none',
                boxShadow: hovered === method ? `0 12px 32px ${color}18` : 'none',
              }}
            >
              <div style={{ fontSize: 28, marginBottom: 12 }}>{icon}</div>
              <div style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: 18, color, letterSpacing: 2, marginBottom: 8 }}>{method}</div>
              <div style={{ color: B.smoke, fontSize: 13, lineHeight: 1.6, marginBottom: 14 }}>{detail}</div>
              <div style={{ display: 'inline-block', background: color + '18', border: `1px solid ${color}35`, borderRadius: 6, padding: '4px 12px' }}>
                <span style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: 13, color, letterSpacing: 2 }}>{time}</span>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  )
}
