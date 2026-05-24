import { useState } from 'react'
import { B } from '../tokens'
import { GrainOverlay, ScanLines, SectionTag } from '../components/Shared'

const DROPS = [
  { year: '1985', name: 'Air Jordan 1',           brand: 'Nike',   desc: 'The shoe that started everything. Nike paid the NBA fine so MJ could keep wearing it.' },
  { year: '1990', name: 'Nike Air Max 90',         brand: 'Nike',   desc: 'Visible air, infrared accents. The silhouette that never died.' },
  { year: '1992', name: 'Huarache',                brand: 'Nike',   desc: 'Tinker Hatfield’s neoprene masterpiece. So ahead of its time it still looks futuristic.' },
  { year: '1994', name: 'Air Max 95',              brand: 'Nike',   desc: 'Sergio Lozano designed the human spine into a sole. Anatomy as footwear.' },
  { year: '1999', name: 'Superstar Millennium',    brand: 'Adidas', desc: 'Shell-toe classics retold for a new century. Run-DMC had already written the lore.' },
  { year: '2003', name: 'Air Force 1 ‘25th',    brand: 'Nike',   desc: 'Twenty-five years of the most remixed shoe in history. The city edition series exploded.' },
  { year: '2013', name: 'Yeezy 2 “Red October”', brand: 'Nike',   desc: 'Kanye x Nike’s swan song. 9,000 pairs. Dropped unannounced. Resale still in six figures.' },
  { year: '2015', name: 'Yeezy Boost 350',         brand: 'Adidas', desc: 'Kanye brings Boost to the masses. The most copied silhouette of the 2010s.' },
  { year: '2017', name: 'The Ten Collection',      brand: 'Nike',   desc: 'Virgil Abloh’s Off-White x Nike. Ten silhouettes. Quotation marks changed sneakers forever.' },
  { year: '2021', name: 'Travis Scott AJ1 Low',    brand: 'Nike',   desc: 'Swoosh flipped. Rope laces. Hidden pocket. Cactus Jack made the Easter Egg a language.' },
  { year: '2024', name: 'NOCTA x Certified Lover', brand: 'Nike',   desc: 'Drake’s NOCTA hits an all-time cultural peak with the certified-lover colorways.' },
  { year: '2026', name: 'SNEAKERS FEST ’26',     brand: 'Lagos',  desc: 'The continent finally has its own stage. Eko Atlantic City. December 12. History in the making.' },
]

export default function DropsTimeline() {
  const [active, setActive] = useState(DROPS.length - 1)

  const drop = DROPS[active]
  const isLast = active === DROPS.length - 1

  return (
    <section id="timeline" style={{
      background: B.black,
      padding: '80px 20px',
      position: 'relative',
      overflow: 'hidden',
    }}>
      <GrainOverlay /><ScanLines />
      <div style={{ maxWidth: 900, margin: '0 auto' }}>
        <SectionTag>DROPS TIMELINE</SectionTag>
        <h2 style={{ fontFamily: "'Bebas Neue'", fontSize: 'clamp(2.5rem,6vw,4rem)', color: B.white, letterSpacing: '0.05em', marginBottom: 8 }}>
          40 YEARS OF CULTURE
        </h2>
        <p style={{ color: B.smoke, fontFamily: "'Space Mono'", fontSize: '0.78rem', marginBottom: 48 }}>
          The drops that changed the game · tap a year to read the lore
        </p>

        {/* Year selector strip */}
        <div style={{ overflowX: 'auto', marginBottom: 40, paddingBottom: 8 }}>
          <div style={{ display: 'flex', gap: 0, minWidth: 'max-content', position: 'relative' }}>
            {/* Connecting line */}
            <div style={{
              position: 'absolute', top: '50%', left: 0, right: 0, height: 1,
              background: B.gunmetal, transform: 'translateY(-50%)', zIndex: 0,
            }} />
            {DROPS.map((d, i) => (
              <button
                key={i}
                onClick={() => setActive(i)}
                style={{
                  position: 'relative', zIndex: 1,
                  display: 'flex', flexDirection: 'column', alignItems: 'center',
                  gap: 8, padding: '0 12px', background: 'none', border: 'none',
                  cursor: 'pointer',
                }}
              >
                <div style={{
                  width: active === i ? 16 : 10,
                  height: active === i ? 16 : 10,
                  borderRadius: '50%',
                  background: active === i
                    ? (i === DROPS.length - 1 ? B.amber : B.neonCyan)
                    : (i < active ? B.smoke : B.gunmetal),
                  border: active === i ? `2px solid ${B.black}` : 'none',
                  boxShadow: active === i ? `0 0 12px ${i === DROPS.length - 1 ? B.amber : B.neonCyan}` : 'none',
                  transition: 'all 0.25s',
                  flexShrink: 0,
                }} />
                <span style={{
                  fontFamily: "'Orbitron'",
                  fontSize: active === i ? '0.65rem' : '0.55rem',
                  color: active === i
                    ? (i === DROPS.length - 1 ? B.amber : B.white)
                    : B.smoke,
                  fontWeight: active === i ? 700 : 400,
                  transition: 'all 0.25s',
                  whiteSpace: 'nowrap',
                }}>{d.year}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Detail card */}
        <div style={{
          background: B.charcoal,
          borderRadius: 12, padding: '36px 32px',
          border: `1px solid ${B.gunmetal}`,
          borderLeft: `4px solid ${isLast ? B.amber : B.neonCyan}`,
          display: 'grid', gridTemplateColumns: 'auto 1fr', gap: 32,
          alignItems: 'start',
        }}>
          {/* Year block */}
          <div style={{ textAlign: 'center' }}>
            <div style={{
              fontFamily: "'Orbitron'", fontSize: '2.2rem', fontWeight: 900,
              color: isLast ? B.amber : B.neonCyan,
              textShadow: `0 0 24px ${isLast ? B.amber : B.neonCyan}80`,
              lineHeight: 1, marginBottom: 6,
            }}>{drop.year}</div>
            <div style={{
              background: `${(isLast ? B.amber : B.neonCyan)}20`,
              border: `1px solid ${(isLast ? B.amber : B.neonCyan)}40`,
              borderRadius: 20, padding: '3px 10px',
              fontFamily: "'Space Mono'", fontSize: '0.55rem',
              color: isLast ? B.amber : B.neonCyan,
              letterSpacing: '0.1em', whiteSpace: 'nowrap',
            }}>{drop.brand}</div>
          </div>

          {/* Info */}
          <div>
            <h3 style={{
              fontFamily: "'Bebas Neue'", fontSize: 'clamp(1.5rem,4vw,2.2rem)',
              color: B.white, letterSpacing: '0.04em', marginBottom: 12,
            }}>{drop.name}</h3>
            <p style={{
              color: B.smoke, fontFamily: "'Syne'",
              fontSize: '0.92rem', lineHeight: 1.75,
            }}>{drop.desc}</p>

            {/* Prev / Next nav */}
            <div style={{ display: 'flex', gap: 12, marginTop: 24 }}>
              <button
                onClick={() => setActive(a => Math.max(0, a - 1))}
                disabled={active === 0}
                style={{
                  background: 'transparent',
                  border: `1px solid ${active === 0 ? B.gunmetal : B.smoke}`,
                  color: active === 0 ? B.gunmetal : B.white,
                  padding: '8px 20px', fontFamily: "'Space Mono'",
                  fontSize: '0.7rem', cursor: active === 0 ? 'default' : 'pointer',
                  borderRadius: 4, transition: 'all 0.2s',
                }}
              >&larr; PREV</button>
              <button
                onClick={() => setActive(a => Math.min(DROPS.length - 1, a + 1))}
                disabled={active === DROPS.length - 1}
                style={{
                  background: 'transparent',
                  border: `1px solid ${active === DROPS.length - 1 ? B.gunmetal : B.smoke}`,
                  color: active === DROPS.length - 1 ? B.gunmetal : B.white,
                  padding: '8px 20px', fontFamily: "'Space Mono'",
                  fontSize: '0.7rem', cursor: active === DROPS.length - 1 ? 'default' : 'pointer',
                  borderRadius: 4, transition: 'all 0.2s',
                }}
              >NEXT &rarr;</button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
