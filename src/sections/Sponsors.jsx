import { useState } from 'react'
import { B } from '../tokens'

const TIERS = [
  {
    tier: 'HEADLINE',
    price: '₦5,000,000+',
    color: B.amber,
    glow: B.amber,
    featured: true,
    perks: [
      'Stage naming rights (e.g. "Nike Main Stage")',
      'Brand logo on all event materials & signage',
      '30-second brand spot during DJ sets',
      '10 VIP tickets + private lounge access',
      'Premium corner booth (6×6m)',
      'Featured on all social platforms',
      'Post-event media recap inclusion',
      'First access to attendee engagement data',
    ],
  },
  {
    tier: 'GOLD',
    price: '₦2,500,000+',
    color: '#FFD700',
    glow: '#FFD700',
    perks: [
      'Logo on main stage backdrop',
      'Brand mention in MC segments',
      '6 VIP tickets',
      'Double booth (6×3m)',
      'Social media feature on 2 platforms',
      'Post-event email blast feature',
    ],
  },
  {
    tier: 'SILVER',
    price: '₦1,000,000+',
    color: B.smoke,
    glow: B.smoke,
    perks: [
      'Logo on website & event programme',
      '4 standard tickets',
      'Standard booth (3×3m)',
      'Social media mention on 1 platform',
    ],
  },
  {
    tier: 'COMMUNITY',
    price: '₦250,000+',
    color: B.neonCyan,
    glow: B.neonCyan,
    perks: [
      'Logo on event website',
      '2 standard tickets',
      'Shared community table space',
      'Tag in post-event wrap-up post',
    ],
  },
]

const STATS = [
  { stat: '3,000+', label: 'EXPECTED ATTENDEES' },
  { stat: '200+', label: 'RARE SNEAKER PAIRS' },
  { stat: '50+', label: 'VENDORS & BRANDS' },
  { stat: '8 HRS', label: 'LIVE COVERAGE' },
]

export default function Sponsors() {
  const [hovered, setHovered] = useState(null)

  return (
    <section
      id="sponsors"
      style={{
        background: B.black,
        padding: '100px 0',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <div style={{ position: 'absolute', top: '15%', left: '-5%', width: 500, height: 500, background: B.amber + '07', borderRadius: '50%', filter: 'blur(100px)', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', bottom: '10%', right: '-5%', width: 400, height: 400, background: B.neonMagenta + '07', borderRadius: '50%', filter: 'blur(80px)', pointerEvents: 'none' }} />

      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 24px' }}>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 64 }}>
          <p style={{ fontFamily: 'Bebas Neue, sans-serif', color: B.amber, fontSize: 14, letterSpacing: 6, marginBottom: 12 }}>PARTNERSHIP OPPORTUNITIES</p>
          <h2 style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: 'clamp(48px, 8vw, 80px)', color: B.white, lineHeight: 1, letterSpacing: 2, marginBottom: 20 }}>BECOME A SPONSOR</h2>
          <p style={{ color: B.smoke, fontSize: 16, maxWidth: 560, margin: '0 auto', lineHeight: 1.7 }}>
            Get your brand in front of 3,000+ sneaker culture enthusiasts, collectors, and tastemakers across West Africa.
          </p>
        </div>

        {/* Stats bar */}
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          background: 'rgba(255,255,255,0.02)',
          border: `1px solid ${B.amber}20`,
          borderRadius: 16,
          marginBottom: 60,
          overflow: 'hidden',
        }}>
          {STATS.map(({ stat, label }, i) => (
            <div key={label} style={{
              flex: '1 1 180px',
              padding: '28px 24px',
              textAlign: 'center',
              borderRight: i < STATS.length - 1 ? `1px solid ${B.amber}15` : 'none',
            }}>
              <div style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: 40, color: B.amber, lineHeight: 1 }}>{stat}</div>
              <div style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: 11, color: B.smoke, letterSpacing: 3, marginTop: 6 }}>{label}</div>
            </div>
          ))}
        </div>

        {/* Tier cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))', gap: 24, marginBottom: 60 }}>
          {TIERS.map(({ tier, price, color, glow, featured, perks }) => (
            <div
              key={tier}
              onMouseEnter={() => setHovered(tier)}
              onMouseLeave={() => setHovered(null)}
              style={{
                background: featured
                  ? `linear-gradient(135deg, ${B.amber}14, ${B.amber}04)`
                  : 'rgba(255,255,255,0.03)',
                border: `1px solid ${color}${hovered === tier || featured ? '55' : '25'}`,
                borderRadius: 20,
                padding: '32px 24px',
                position: 'relative',
                overflow: 'hidden',
                transition: 'transform 0.2s, box-shadow 0.2s',
                transform: hovered === tier ? 'translateY(-6px)' : featured ? 'scale(1.02)' : 'none',
                boxShadow: hovered === tier ? `0 20px 60px ${glow}20` : featured ? `0 8px 30px ${glow}12` : 'none',
                backdropFilter: 'blur(20px) saturate(180%)',
              }}
            >
              {featured && (
                <div style={{
                  position: 'absolute', top: 16, right: 16,
                  background: B.amber, color: B.black,
                  fontFamily: 'Bebas Neue, sans-serif', fontSize: 10, letterSpacing: 2,
                  padding: '4px 10px', borderRadius: 6,
                }}>PREMIUM</div>
              )}
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: `linear-gradient(90deg, ${color}, transparent)`, borderRadius: '20px 20px 0 0' }} />

              <div style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: 13, color, letterSpacing: 4, marginBottom: 8 }}>{tier}</div>
              <div style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: 34, color: B.white, lineHeight: 1, marginBottom: 28 }}>{price}</div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {perks.map(perk => (
                  <div key={perk} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                    <span style={{ color, fontSize: 14, flexShrink: 0, marginTop: 1 }}>✓</span>
                    <span style={{ color: B.smoke, fontSize: 13, lineHeight: 1.5 }}>{perk}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* CTA block */}
        <div style={{
          background: `linear-gradient(135deg, ${B.amber}12, ${B.neonMagenta}07)`,
          border: `1px solid ${B.amber}30`,
          borderRadius: 20,
          padding: '48px',
          textAlign: 'center',
        }}>
          <h3 style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: 'clamp(28px, 4vw, 40px)', color: B.white, letterSpacing: 2, marginBottom: 12 }}>
            READY TO PARTNER WITH US?
          </h3>
          <p style={{ color: B.smoke, fontSize: 15, maxWidth: 480, margin: '0 auto 28px', lineHeight: 1.7 }}>
            Custom packages available. Let's build something that actually moves your brand.
          </p>
          <a
            href="mailto:sponsors@sneakersfest.com?subject=Sponsorship Inquiry — Sneakers Fest '26"
            style={{
              display: 'inline-block',
              padding: '16px 40px',
              background: B.amber,
              color: B.black,
              fontFamily: 'Bebas Neue, sans-serif',
              fontSize: 18,
              letterSpacing: 3,
              borderRadius: 8,
              textDecoration: 'none',
              transition: 'transform 0.2s, box-shadow 0.2s',
            }}
            onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = `0 8px 24px ${B.amber}50` }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none' }}
          >
            GET IN TOUCH →
          </a>
          <p style={{ color: B.smoke + '70', fontSize: 12, marginTop: 16, letterSpacing: 1 }}>
            sponsors@sneakersfest.com · All packages are negotiable
          </p>
        </div>

      </div>
    </section>
  )
}
