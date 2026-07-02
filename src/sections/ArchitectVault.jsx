import { useState, useEffect } from 'react'
import { B } from '../tokens'
import { GrainOverlay, SectionTag, ScanLines } from '../components/Shared'
import { useAuth } from '../lib/auth'
import AuthGate from '../components/AuthGate'
import { getPassport, getTier, getLevel, subscribe } from '../lib/passport'

const VAULT_DROPS = [
  {
    code: 'VLT-001',
    name: 'Air Catalyst "Lagos Night"',
    brand: 'NIKE x SF26',
    release: 'DEC 11, 2026',
    qty: '500 PAIRS',
    status: 'VAULT EXCLUSIVE',
    color: '#00F0FF',
  },
  {
    code: 'VLT-002',
    name: 'Forum 84 "Sole of Lagos"',
    brand: 'ADIDAS x SF26',
    release: 'DEC 12, 2026',
    qty: '300 PAIRS',
    status: 'MEMBERS FIRST',
    color: '#F5A623',
  },
  {
    code: 'VLT-003',
    name: 'Afrobeats Pack Vol. 1',
    brand: 'PUMA x SF26',
    release: 'DEC 12, 2026',
    qty: '200 PAIRS',
    status: 'LIMITED 200',
    color: '#B8FF00',
  },
]

const VAULT_PERKS = [
  { icon: '🎟', label: 'Priority Ticket Access', desc: '24-hour early window before the public sale opens' },
  { icon: '🔒', label: 'Private Drop Intel', desc: 'Exclusive release calendar — brands, dates, quantities' },
  { icon: '🏆', label: 'Vault Leaderboard', desc: 'Separate ranking tier with dedicated grand prizes' },
  { icon: '🤝', label: 'Brand Meet & Greet', desc: 'Members-only sessions with brand reps at the event' },
  { icon: '📦', label: 'Gift Bag Upgrade', desc: 'Vault members receive the premium collector edition bag' },
  { icon: '📡', label: 'Private Discord', desc: 'Invite to the SF26 Vault Discord — drops talk, trade leads' },
]

function VaultContent() {
  const { user, logout } = useAuth()
  const [passport, setPassport] = useState(() => getPassport())

  useEffect(() => {
    const unsub = subscribe(setPassport)
    return unsub
  }, [])

  const tier = getTier(passport.xp)
  const level = getLevel(passport.xp)
  const displayName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Vault Member'

  return (
    <div>
      <div style={{
        background: `linear-gradient(135deg, #1A1A1A 0%, #111111 100%)`,
        border: `1px solid ${tier.color}50`,
        borderRadius: 16,
        padding: '24px 28px',
        marginBottom: 36,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: 16,
        boxShadow: `0 0 40px ${tier.color}10, inset 0 1px 0 ${tier.color}20`,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
          <div style={{
            width: 52, height: 52, borderRadius: '50%',
            background: `${tier.color}18`,
            border: `2px solid ${tier.color}60`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontFamily: "'Bebas Neue', sans-serif", fontSize: '1.4rem', color: tier.color,
            flexShrink: 0,
          }}>
            {displayName.charAt(0).toUpperCase()}
          </div>
          <div>
            <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '1.5rem', color: '#F0EDE6', letterSpacing: '0.04em' }}>{displayName}</div>
            <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap', marginTop: 2 }}>
              <span style={{
                fontFamily: "'Orbitron', monospace", fontSize: '0.56rem', fontWeight: 700,
                color: tier.color, background: `${tier.color}18`,
                border: `1px solid ${tier.color}40`, borderRadius: 20, padding: '3px 10px',
              }}>{tier.name}</span>
              <span style={{ fontFamily: "'Space Mono', monospace", fontSize: '0.58rem', color: '#8A8A8A' }}>
                LV {level.level} · {passport.xp.toLocaleString()} XP
              </span>
            </div>
          </div>
        </div>
        <button
          onClick={logout}
          style={{
            background: 'transparent',
            border: '1px solid #2A2A2A',
            borderRadius: 6,
            padding: '8px 16px',
            cursor: 'pointer',
            fontFamily: "'Space Mono', monospace",
            fontSize: '0.6rem',
            color: '#8A8A8A',
            letterSpacing: '0.1em',
            transition: 'border-color 0.2s, color 0.2s',
          }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = '#FF2D7B'; e.currentTarget.style.color = '#FF2D7B' }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = '#2A2A2A'; e.currentTarget.style.color = '#8A8A8A' }}
        >SIGN OUT</button>
      </div>

      <div style={{ marginBottom: 40 }}>
        <div style={{ fontFamily: "'Space Mono', monospace", fontSize: '0.6rem', letterSpacing: '0.22em', color: '#555', marginBottom: 16 }}>
          EXCLUSIVE DROPS INTEL — VAULT MEMBERS ONLY
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(230px, 1fr))', gap: 14 }}>
          {VAULT_DROPS.map(drop => (
            <div key={drop.code} style={{
              background: '#1A1A1A',
              border: `1px solid ${drop.color}28`,
              borderRadius: 12,
              padding: '20px 18px',
              position: 'relative',
              overflow: 'hidden',
            }}>
              <div style={{
                position: 'absolute', top: 0, left: 0, right: 0, height: 2,
                background: `linear-gradient(90deg, ${drop.color}, transparent)`,
              }} />
              <div style={{ fontFamily: "'Space Mono', monospace", fontSize: '0.52rem', color: '#444', letterSpacing: '0.15em', marginBottom: 10 }}>{drop.code}</div>
              <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '1.15rem', color: '#F0EDE6', letterSpacing: '0.04em', marginBottom: 4, lineHeight: 1.1 }}>{drop.name}</div>
              <div style={{ fontFamily: "'Space Mono', monospace", fontSize: '0.58rem', color: '#8A8A8A', marginBottom: 14 }}>{drop.brand}</div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8 }}>
                <div>
                  <div style={{ fontFamily: "'Orbitron', monospace", fontSize: '0.58rem', color: drop.color, fontWeight: 700 }}>{drop.release}</div>
                  <div style={{ fontFamily: "'Space Mono', monospace", fontSize: '0.5rem', color: '#555', marginTop: 2 }}>{drop.qty}</div>
                </div>
                <span style={{
                  fontFamily: "'Space Mono', monospace", fontSize: '0.5rem',
                  color: drop.color, background: `${drop.color}12`,
                  border: `1px solid ${drop.color}30`, borderRadius: 20, padding: '3px 9px', whiteSpace: 'nowrap',
                }}>{drop.status}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div>
        <div style={{ fontFamily: "'Space Mono', monospace", fontSize: '0.6rem', letterSpacing: '0.22em', color: '#555', marginBottom: 16 }}>
          VAULT MEMBER PERKS
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: 12 }}>
          {VAULT_PERKS.map(perk => (
            <div key={perk.label} style={{
              background: 'rgba(245,166,35,0.04)',
              border: '1px solid rgba(245,166,35,0.18)',
              borderRadius: 10,
              padding: '16px 18px',
              display: 'flex',
              gap: 14,
              alignItems: 'flex-start',
            }}>
              <span style={{ fontSize: '1.3rem', flexShrink: 0, marginTop: 2 }}>{perk.icon}</span>
              <div>
                <div style={{ fontFamily: "'Syne', sans-serif", fontSize: '0.8rem', fontWeight: 700, color: '#F0EDE6', marginBottom: 4 }}>{perk.label}</div>
                <div style={{ fontFamily: "'Space Mono', monospace", fontSize: '0.58rem', color: '#8A8A8A', lineHeight: 1.5 }}>{perk.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default function ArchitectVault() {
  return (
    <section id="vault-200" style={{ background: '#0A0A0A', padding: '80px 20px', position: 'relative', overflow: 'hidden' }}>
      <GrainOverlay />
      <ScanLines />
      <div style={{
        position: 'absolute', top: '15%', left: '50%', transform: 'translateX(-50%)',
        width: 700, height: 500,
        background: 'radial-gradient(ellipse, rgba(245,166,35,0.07) 0%, transparent 70%)',
        filter: 'blur(60px)', pointerEvents: 'none',
      }} />
      <div style={{ maxWidth: 860, margin: '0 auto', position: 'relative' }}>
        <SectionTag color="#F5A623">ARCHITECT VAULT</SectionTag>
        <h2 style={{
          fontFamily: "'Bebas Neue', sans-serif",
          fontSize: 'clamp(2.8rem, 7vw, 5rem)',
          color: '#F0EDE6',
          letterSpacing: '0.04em',
          lineHeight: 1,
          marginBottom: 12,
        }}>
          THE ARCHITECT<br /><span style={{ color: '#F5A623' }}>VAULT</span>
        </h2>
        <p style={{
          fontFamily: "'Space Mono', monospace",
          fontSize: '0.78rem',
          color: '#8A8A8A',
          maxWidth: 480,
          marginBottom: 40,
          lineHeight: 1.7,
        }}>
          A members-only inner sanctum. Exclusive drops intel, priority access, and perks reserved for the registered faithful.
        </p>
        <AuthGate
          title="THE VAULT IS LOCKED"
          message="Create a free account or sign in to access exclusive drops intel, vault perks, and your full Sneaker Passport."
        >
          <VaultContent />
        </AuthGate>
      </div>
    </section>
  )
}
