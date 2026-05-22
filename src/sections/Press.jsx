import { useState } from 'react'
import { B } from '../tokens'
import { GrainOverlay, SectionTag } from '../components/Shared'

const OUTLETS = [
  { name: 'THE NATIVE MAGAZINE', angle: 'Lagos culture · streetwear',      color: '#FF4500' },
  { name: 'CULTURE CUSTODIAN',   angle: 'Nigerian creative events',          color: B.neonCyan },
  { name: 'OKAYAFRICA',          angle: 'Pan-African culture',               color: '#00A859' },
  { name: 'MOREBRANCHES',        angle: 'Nigerian streetwear deep dives',    color: B.amber },
  { name: 'HIGHSNOBIETY',        angle: 'Global sneaker culture',            color: B.white },
  { name: 'HYPEBAE',             angle: 'Streetwear · cultural angle',       color: '#FF69B4' },
  { name: 'DAZED DIGITAL',       angle: 'Lagos creative scene',              color: B.neonMagenta },
  { name: 'VANGUARD NIGERIA',    angle: 'Mainstream Nigerian press',         color: '#009900' },
  { name: 'BUSINESSDAY',         angle: 'Event economics angle',             color: B.neonLime },
]

const ANGLES = [
  "Lagos’ first dedicated sneaker festival — what took so long?",
  "From Street Souk to Sneakers Fest: the evolution of Lagos sneaker culture events",
  "The Catalyst: building a three-dimensional festival brand in Lagos",
  "Lagos Noir: the design aesthetic powering Sneakers Fest",
  "Nigeria’s sneaker economy and the event trying to own it",
  "From the Void to the Festival: how a Lagos operator is building what Lagos sneakerheads need",
]

const FAST_FACTS = [
  { label: 'Event',        value: "Sneakers Fest 2026" },
  { label: 'Founded by',   value: 'Oluwatobiloba (The Catalyst)' },
  { label: 'Agency',       value: 'Catalyst Concepts, Lagos' },
  { label: 'Category',     value: 'Sneaker culture · streetwear · lifestyle' },
  { label: 'Format',       value: 'Three-dimensional brand (physical + online + community)' },
  { label: 'Location',     value: 'Eko Atlantic City, Lagos, Nigeria' },
  { label: 'Date',         value: 'December 12, 2026' },
  { label: 'Attendees',    value: '1,000 – 2,500 (Year 1 target)' },
  { label: 'Vendors',      value: '30 – 50 (Year 1)' },
  { label: 'Community',    value: '5,000+ by event month' },
  { label: 'Aesthetic',    value: 'Lagos Noir — crushed blacks, amber glows, neon accents, 35mm grain' },
]

export default function Press() {
  const [copied, setCopied] = useState(false)

  function copyBoilerplate() {
    navigator.clipboard.writeText(
      "Sneakers Fest 2026 is a Lagos-based sneaker and culture festival founded by Oluwatobiloba (The Catalyst), principal of Catalyst Concepts. Built around the Lagos Noir aesthetic, Sneakers Fest is designed as a permanent property, not an annual event. The festival operates across three dimensions: a physical exhibition and marketplace, a year-round online community platform, and a recurring participation economy built around sneaker culture drops, challenges, and the Friday Night Protocol. Year 1 attendance target: 1,000 to 2,500."
    )
    setCopied(true)
    setTimeout(() => setCopied(false), 2500)
  }

  return (
    <section id="press" style={{ position: 'relative', overflow: 'hidden', background: B.black, padding: '80px 24px' }}>
      <GrainOverlay />
      <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: 600, height: 200, background: `radial-gradient(ellipse, ${B.amber}06 0%, transparent 70%)`, filter: 'blur(60px)', pointerEvents: 'none' }} />

      <div style={{ position: 'relative', zIndex: 10, maxWidth: 1000, margin: '0 auto' }}>

        {/* Target outlets */}
        <div style={{ marginBottom: 64 }}>
          <div style={{ textAlign: 'center', marginBottom: 36 }}>
            <SectionTag>PRESS & MEDIA</SectionTag>
            <div style={{ fontFamily: "'Space Mono'", fontSize: 8, color: B.smoke, letterSpacing: '0.5em' }}>TARGET PRESS OUTLETS</div>
          </div>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', justifyContent: 'center' }}>
            {OUTLETS.map((m, i) => (
              <div
                key={i}
                style={{
                  padding: '10px 18px', background: 'rgba(255,255,255,0.03)',
                  border: '1px solid rgba(255,255,255,0.07)', borderRadius: 6,
                  transition: 'all 0.25s', cursor: 'default', textAlign: 'center',
                }}
                onMouseEnter={e => { e.currentTarget.style.background = m.color + '12'; e.currentTarget.style.borderColor = m.color + '50' }}
                onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.03)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)' }}
              >
                <div style={{ fontFamily: "'Bebas Neue'", fontSize: 14, color: m.color, letterSpacing: '0.1em', opacity: 0.85 }}>{m.name}</div>
                <div style={{ fontFamily: "'Space Mono'", fontSize: 6, color: '#444', letterSpacing: '0.1em', marginTop: 3, whiteSpace: 'nowrap' }}>{m.angle}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Divider */}
        <div style={{ width: '100%', height: 1, background: `linear-gradient(90deg, transparent, ${B.gunmetal}, transparent)`, marginBottom: 64 }} />

        {/* Press kit section */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 40, alignItems: 'start' }}>

          {/* Fast Facts */}
          <div>
            <div style={{ fontFamily: "'Space Mono'", fontSize: 8, letterSpacing: '0.4em', color: B.smoke, marginBottom: 20 }}>FAST FACTS</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              {FAST_FACTS.map((f, i) => (
                <div key={i} style={{
                  display: 'grid', gridTemplateColumns: '120px 1fr',
                  gap: 12, padding: '10px 0',
                  borderBottom: `1px solid ${B.gunmetal}`,
                }}>
                  <div style={{ fontFamily: "'Space Mono'", fontSize: '0.6rem', color: B.smoke, letterSpacing: '0.1em' }}>{f.label}</div>
                  <div style={{ fontFamily: "'Syne'", fontSize: '0.8rem', color: B.white }}>{f.value}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Press angles + boilerplate */}
          <div>
            <div style={{ fontFamily: "'Space Mono'", fontSize: 8, letterSpacing: '0.4em', color: B.smoke, marginBottom: 20 }}>PRESS ANGLES</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 32 }}>
              {ANGLES.map((a, i) => (
                <div key={i} style={{
                  padding: '12px 16px',
                  background: B.charcoal,
                  borderRadius: 6,
                  borderLeft: `2px solid ${B.amber}`,
                }}>
                  <div style={{ fontFamily: "'Syne'", fontSize: '0.78rem', color: B.smoke, lineHeight: 1.6 }}>{a}</div>
                </div>
              ))}
            </div>

            {/* Boilerplate copy */}
            <div style={{ marginBottom: 20 }}>
              <div style={{ fontFamily: "'Space Mono'", fontSize: 8, letterSpacing: '0.4em', color: B.smoke, marginBottom: 12 }}>PRESS BOILERPLATE</div>
              <div style={{
                background: B.charcoal, borderRadius: 8,
                padding: '16px 18px',
                border: `1px solid ${B.gunmetal}`,
              }}>
                <div style={{ fontFamily: "'Syne'", fontSize: '0.78rem', color: B.smoke, lineHeight: 1.7, marginBottom: 12 }}>
                  Sneakers Fest 2026 is a Lagos-based sneaker and culture festival founded by Oluwatobiloba (The Catalyst), principal of Catalyst Concepts. Built around the Lagos Noir aesthetic, Sneakers Fest operates across three dimensions: a physical exhibition and marketplace, a year-round online platform, and a recurring participation economy built around the Friday Night Protocol.
                </div>
                <button
                  onClick={copyBoilerplate}
                  style={{
                    background: 'transparent',
                    border: `1px solid ${copied ? B.neonLime : B.gunmetal}`,
                    color: copied ? B.neonLime : B.smoke,
                    padding: '6px 16px', borderRadius: 4,
                    fontFamily: "'Space Mono'", fontSize: '0.6rem',
                    cursor: 'pointer', transition: 'all 0.2s',
                  }}
                >
                  {copied ? '✓ COPIED' : 'COPY TEXT'}
                </button>
              </div>
            </div>

            {/* Media inquiry */}
            <a
              href="mailto:press@sneakersfest.com?subject=Media%20Inquiry%20%E2%80%94%20Sneakers%20Fest%20%2726"
              style={{
                display: 'block', textAlign: 'center',
                background: B.amber, color: B.black,
                padding: '12px 24px', borderRadius: 4,
                fontFamily: "'Bebas Neue'", fontSize: '1.1rem', letterSpacing: '0.1em',
                textDecoration: 'none',
                boxShadow: `0 0 20px ${B.amber}40`,
              }}
            >
              MEDIA INQUIRY →
            </a>
            <div style={{ fontFamily: "'Space Mono'", fontSize: '0.58rem', color: B.smoke, textAlign: 'center', marginTop: 8 }}>
              press@sneakersfest.com · Oluwatobiloba / Catalyst Concepts
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
