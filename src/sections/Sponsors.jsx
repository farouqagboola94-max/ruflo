import { useState } from 'react'
import { B } from '../tokens'
import { GrainOverlay, SectionTag } from '../components/Shared'

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
      'Featured across all 6 social platforms',
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

const FNP_TIERS = [
  {
    label: 'FULL SEASON',
    price: '₦500,000+',
    color: B.amber,
    desc: 'Sponsor the entire Friday Night Protocol season. "Powered by [Brand]" on all 20+ weekly sessions across every platform.'
  },
  {
    label: 'SINGLE SESSION',
    price: '₦100,000+',
    color: B.neonCyan,
    desc: 'Own one session type — a Drop Discussion, Challenge, Conversation, or Game night. Your brand, your audience, one Friday.'
  },
  {
    label: 'PRIZE SPONSOR',
    price: '₦50,000+',
    color: B.neonLime,
    desc: 'Fund the prize pool for a weekly challenge or game. Your product or cash prize, your name on the winner announcement.'
  },
]

const STATS = [
  { stat: '1K–2.5K', label: 'YEAR 1 ATTENDEES' },
  { stat: '30–50', label: 'VENDOR SPOTS' },
  { stat: '5,000+', label: 'ONLINE COMMUNITY' },
  { stat: '52', label: 'FRIDAY NIGHTS / YEAR' },
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
      <GrainOverlay />
      <div style={{ position: 'absolute', top: '15%', left: '-5%', width: 500, height: 500, background: B.amber + '07', borderRadius: '50%', filter: 'blur(100px)', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', bottom: '10%', right: '-5%', width: 400, height: 400, background: B.neonMagenta + '07', borderRadius: '50%', filter: 'blur(80px)', pointerEvents: 'none' }} />

      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 24px' }}>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 64 }}>
          <SectionTag label="PARTNERSHIP OPPORTUNITIES" />
          <h2 style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: 'clamp(48px, 8vw, 80px)', color: B.white, lineHeight: 1, letterSpacing: 2, marginBottom: 20 }}>BECOME A SPONSOR</h2>
          <p style={{ color: B.smoke, fontSize: 16, maxWidth: 580, margin: '0 auto', lineHeight: 1.7 }}>
            Get your brand in front of the Lagos sneaker community — 1,000 to 2,500 attendees on event day plus a year-round online community of 5,000+. Physical and digital exposure, every week.
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
              <div style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: 36, color: B.amber, lineHeight: 1 }}>{stat}</div>
              <div style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: 11, color: B.smoke, letterSpacing: 3, marginTop: 6 }}>{label}</div>
            </div>
          ))}
        </div>

        {/* Tier cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))', gap: 24, marginBottom: 72 }}>
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
                    <span style={{ color, fontSize: 14, flexShrink: 0, marginTop: 1 }}>&#10003;</span>
                    <span style={{ color: B.smoke, fontSize: 13, lineHeight: 1.5 }}>{perk}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* FNP Sponsorship */}
        <div style={{ marginBottom: 72 }}>
          <div style={{ marginBottom: 32, display: 'flex', flexDirection: 'column', gap: 8 }}>
            <SectionTag label="FRIDAY NIGHT PROTOCOL" color={B.amber} />
            <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 'clamp(28px, 4vw, 42px)', color: B.white, letterSpacing: 2, lineHeight: 1 }}>SPONSOR THE WEEKLY ENGINE</div>
            <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 14, color: B.smoke, maxWidth: 600, lineHeight: 1.75, marginTop: 4 }}>
              The Friday Night Protocol runs every Friday — 52 weeks a year. A brand can sponsor a single session or the full season, reaching the same audience they'd pay to activate with on event day, week after week, before event day even arrives.
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 16 }}>
            {FNP_TIERS.map((t, i) => (
              <div
                key={i}
                style={{ padding: '24px 22px', background: 'rgba(255,255,255,0.03)', border: `1px solid ${t.color}30`, borderRadius: 12, position: 'relative', overflow: 'hidden', transition: 'all 0.25s' }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = t.color + '70'; e.currentTarget.style.background = t.color + '0a'; e.currentTarget.style.transform = 'translateY(-3px)' }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = t.color + '30'; e.currentTarget.style.background = 'rgba(255,255,255,0.03)'; e.currentTarget.style.transform = 'translateY(0)' }}
              >
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg, ${t.color}, transparent)` }} />
                <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 8, color: t.color, letterSpacing: '0.2em', marginBottom: 8 }}>{t.label}</div>
                <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 28, color: B.white, lineHeight: 1, marginBottom: 12 }}>{t.price}</div>
                <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 13, color: B.smoke, lineHeight: 1.65 }}>{t.desc}</div>
              </div>
            ))}
          </div>
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
            Custom packages available. Year 1 pricing reflects our build phase — early sponsors get founding-partner recognition that scales with the event.
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
            sponsors@sneakersfest.com &middot; All packages are negotiable
          </p>
        </div>

      </div>
    </section>
  )
}
