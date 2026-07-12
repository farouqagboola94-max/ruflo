import { useState } from 'react'
import { B } from '../tokens'

const CHAIN = [
  { label: 'THE CATALYST',    shortLabel: 'CATALYST',    icon: '🔱', rank: 1, color: B.amber },
  { label: 'FOUNDING MEMBER', shortLabel: 'FOUNDING',    icon: '👑', rank: 2, color: B.amber },
  { label: 'INNER CIRCLE',    shortLabel: 'INNER',       icon: '💎', rank: 3, color: B.neonCyan },
  { label: 'EARLY ACCESS',    shortLabel: 'EARLY',       icon: '⚡', rank: 4, color: B.neonLime },
  { label: 'WAITLIST',        shortLabel: 'WAITLIST',    icon: '🎯', rank: 5, color: '#888' },
]

const TIER_COLORS = {
  'FOUNDING MEMBER': B.amber,
  'INNER CIRCLE':    B.neonCyan,
  'EARLY ACCESS':    B.neonLime,
  'WAITLIST':        '#888',
}

function getInitials(name) {
  const parts = (name || '').trim().split(/\s+/).filter(Boolean)
  if (parts.length >= 2) return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
  return (name || '?').slice(0, 2).toUpperCase()
}

export default function MemberCard({ name, refCode, position, tier, tierIcon, referralCount, ticket, style }) {
  const [copied, setCopied] = useState(false)

  const tierColor  = TIER_COLORS[tier] || '#888'
  const chainEntry = CHAIN.find(c => c.label === tier) || CHAIN[4]
  const initials   = getInitials(name)
  const shareUrl   = `https://sneakersfest26.com?ref=${refCode}`

  function copy() {
    navigator.clipboard.writeText(shareUrl)
      .then(() => { setCopied(true); setTimeout(() => setCopied(false), 2200) })
      .catch(() => {})
  }

  return (
    <div style={{
      borderRadius: 16,
      padding: 2,
      background: `linear-gradient(135deg, ${tierColor}80 0%, ${tierColor}10 45%, ${tierColor}50 100%)`,
      boxShadow: `0 0 48px ${tierColor}28, 0 24px 64px rgba(0,0,0,0.65)`,
      ...style,
    }}>
      {/* inner card */}
      <div style={{
        borderRadius: 14,
        background: 'linear-gradient(145deg, #0f0f0f 0%, #141414 55%, #0b0b0b 100%)',
        padding: 24,
        position: 'relative',
        overflow: 'hidden',
      }}>

        {/* ambient glow top-right */}
        <div style={{
          position: 'absolute', top: -70, right: -70, width: 220, height: 220,
          borderRadius: '50%',
          background: `radial-gradient(ellipse, ${tierColor}1a 0%, transparent 70%)`,
          filter: 'blur(28px)', pointerEvents: 'none',
        }} />

        {/* watermark */}
        <div style={{
          position: 'absolute', bottom: 12, right: 10,
          fontFamily: "'Bebas Neue'", fontSize: 94, color: `${tierColor}06`,
          lineHeight: 1, pointerEvents: 'none', userSelect: 'none', letterSpacing: '-5px',
        }}>SF26</div>

        {/* ── HEADER ── */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 22, position: 'relative', zIndex: 1 }}>
          <div>
            <div style={{ fontFamily: "'Bebas Neue'", fontSize: 11, color: B.amber, letterSpacing: 4 }}>SNEAKERS FEST '26</div>
            <div style={{ fontFamily: "'Space Mono'", fontSize: 7, color: '#444', letterSpacing: 3, marginTop: 3 }}>THE SOLE EXHIBITION · LAGOS · DEC 12</div>
          </div>
          {/* refCode badge */}
          <div style={{
            background: `${tierColor}18`,
            border: `1px solid ${tierColor}45`,
            borderRadius: 6,
            padding: '5px 11px',
            fontFamily: "'Orbitron'",
            fontSize: 9,
            color: tierColor,
            letterSpacing: 2,
            fontWeight: 700,
            boxShadow: `0 0 12px ${tierColor}20`,
          }}>{refCode}</div>
        </div>

        {/* ── AVATAR + IDENTITY ── */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 22, position: 'relative', zIndex: 1 }}>
          {/* avatar */}
          <div style={{
            width: 66, height: 66, borderRadius: '50%', flexShrink: 0,
            background: `linear-gradient(135deg, ${tierColor}28 0%, ${tierColor}0a 100%)`,
            border: `2px solid ${tierColor}65`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: `0 0 22px ${tierColor}28`,
            position: 'relative',
          }}>
            <span style={{ fontFamily: "'Bebas Neue'", fontSize: 27, color: tierColor, letterSpacing: 1 }}>{initials}</span>
            {/* status dot */}
            <div style={{
              position: 'absolute', bottom: 3, right: 3,
              width: 11, height: 11, borderRadius: '50%',
              background: B.neonLime, border: `2px solid #0f0f0f`,
              boxShadow: `0 0 7px ${B.neonLime}`,
            }} />
          </div>
          {/* name + tier + rank */}
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{
              fontFamily: "'Bebas Neue'", fontSize: 23, color: B.white,
              letterSpacing: '0.05em', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
            }}>{name || 'MEMBER'}</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginTop: 5 }}>
              <span style={{ fontSize: 13 }}>{tierIcon || chainEntry.icon}</span>
              <span style={{ fontFamily: "'Space Mono'", fontSize: 8, color: tierColor, letterSpacing: 2 }}>{tier}</span>
            </div>
            <div style={{ fontFamily: "'Space Mono'", fontSize: 7, color: '#3a3a3a', marginTop: 3, letterSpacing: 1 }}>
              MOVEMENT RANK #{chainEntry.rank} OF 5
            </div>
          </div>
        </div>

        {/* ── STATS ── */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10, marginBottom: 22, position: 'relative', zIndex: 1 }}>
          {[
            { label: 'QUEUE #',    val: `#${(position || 0).toLocaleString()}`, color: tierColor },
            { label: 'REFERRALS', val: String(referralCount ?? 0),              color: B.neonCyan },
            { label: ticket ? 'TIER'  : 'STATUS',
              val:   ticket ? ticket.tier : 'PRE-SALE',
              color: ticket ? B.neonLime : '#555' },
          ].map(s => (
            <div key={s.label} style={{
              background: 'rgba(255,255,255,0.025)',
              border: '1px solid rgba(255,255,255,0.055)',
              borderRadius: 8,
              padding: '11px 8px',
              textAlign: 'center',
            }}>
              <div style={{ fontFamily: "'Orbitron'", fontSize: 14, fontWeight: 900, color: s.color, marginBottom: 4 }}>{s.val}</div>
              <div style={{ fontFamily: "'Space Mono'", fontSize: 7, color: '#444', letterSpacing: 2 }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* ── CHAIN OF COMMAND ── */}
        <div style={{ marginBottom: 20, position: 'relative', zIndex: 1 }}>
          <div style={{ fontFamily: "'Space Mono'", fontSize: 7, color: '#333', letterSpacing: 3, marginBottom: 9, textTransform: 'uppercase' }}>
            Chain of Command
          </div>
          <div style={{ display: 'flex', gap: 4, alignItems: 'center', overflowX: 'auto', paddingBottom: 2 }}>
            {CHAIN.map((c, i) => {
              const isMe    = c.label === tier
              const isAbove = c.rank < chainEntry.rank
              return (
                <div key={c.label} style={{ display: 'flex', alignItems: 'center', gap: 4, flexShrink: 0 }}>
                  <div style={{
                    padding: '4px 8px', borderRadius: 4,
                    background: isMe ? `${c.color}22` : 'transparent',
                    border: `1px solid ${isMe ? c.color + '65' : isAbove ? 'rgba(255,255,255,0.07)' : 'rgba(255,255,255,0.03)'}`,
                    fontFamily: "'Space Mono'",
                    fontSize: isMe ? 7 : 6,
                    color: isMe ? c.color : isAbove ? '#3a3a3a' : '#222',
                    letterSpacing: 1,
                    fontWeight: isMe ? 700 : 400,
                    whiteSpace: 'nowrap',
                    transition: 'all 0.2s',
                  }}>
                    {c.icon} {isMe ? c.label : c.shortLabel}
                  </div>
                  {i < CHAIN.length - 1 && (
                    <span style={{ color: '#1e1e1e', fontSize: 9, flexShrink: 0, userSelect: 'none' }}>›</span>
                  )}
                </div>
              )
            })}
          </div>
        </div>

        {/* ── COPY LINK ── */}
        <button onClick={copy} style={{
          width: '100%',
          padding: '11px 16px',
          background: copied ? `${tierColor}18` : 'rgba(255,255,255,0.03)',
          border: `1px solid ${copied ? tierColor + '55' : 'rgba(255,255,255,0.07)'}`,
          borderRadius: 8,
          color: copied ? tierColor : '#555',
          fontFamily: "'Space Mono'",
          fontSize: '0.6rem',
          letterSpacing: 2,
          cursor: 'pointer',
          transition: 'all 0.2s',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 8,
          position: 'relative',
          zIndex: 1,
        }}>
          <span style={{ fontSize: 11 }}>{copied ? '✓' : '🔗'}</span>
          {copied ? 'REFERRAL LINK COPIED!' : 'COPY YOUR REFERRAL LINK'}
        </button>

        {/* ── FOOTER ── */}
        <div style={{
          marginTop: 14, paddingTop: 12,
          borderTop: '1px solid rgba(255,255,255,0.04)',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          position: 'relative', zIndex: 1,
        }}>
          <div style={{ fontFamily: "'Space Mono'", fontSize: 7, color: '#2a2a2a', letterSpacing: 2 }}>
            VIC. ISLAND · LAGOS
          </div>
          <div style={{ fontFamily: "'Space Mono'", fontSize: 7, color: '#2a2a2a', letterSpacing: 2 }}>
            {ticket ? `${ticket.tier} HOLDER` : 'TICKET PENDING'}
          </div>
        </div>
      </div>
    </div>
  )
}
