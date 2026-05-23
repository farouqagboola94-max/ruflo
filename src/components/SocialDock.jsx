import { useState } from 'react'
import { B } from '../tokens'
import { SOCIAL_LINKS } from '../config'

const PLATFORMS = [
  { id: 'tiktok',     label: 'TIKTOK',     abbr: 'TK', color: '#69C9D0',     href: SOCIAL_LINKS.tiktok,             tip: 'Challenges & Clips' },
  { id: 'youtube',   label: 'YOUTUBE',    abbr: 'YT', color: B.neonMagenta, href: SOCIAL_LINKS.youtube,            tip: 'Docs & Interviews' },
  { id: 'twitter',   label: 'TWITTER',    abbr: 'X',  color: B.neonCyan,    href: SOCIAL_LINKS.twitter,            tip: '@Catalyst188' },
  { id: 'instagram', label: 'INSTAGRAM',  abbr: 'IG', color: '#E1306C',     href: SOCIAL_LINKS.instagramPersonal,  tip: '@Catalystggg' },
  { id: 'snapchat',  label: 'SNAPCHAT',   abbr: 'SC', color: B.amber,       href: SOCIAL_LINKS.snapchat,           tip: 'Stories & BTS' },
  { id: 'whatsapp',  label: 'WHATSAPP',   abbr: 'WA', color: B.neonLime,    href: SOCIAL_LINKS.whatsapp,           tip: 'Join Community' },
]

export default function SocialDock() {
  const [hovered, setHovered] = useState(null)

  return (
    <div style={{ position: 'fixed', right: 16, top: '50%', transform: 'translateY(-50%)', zIndex: 999, display: 'flex', flexDirection: 'column', gap: 6 }}>
      {PLATFORMS.map(p => (
        <a
          key={p.id}
          href={p.href}
          target="_blank"
          rel="noopener noreferrer"
          style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}
          onMouseEnter={() => setHovered(p.id)}
          onMouseLeave={() => setHovered(null)}
        >
          {/* Tooltip */}
          <div style={{ marginRight: 8, opacity: hovered === p.id ? 1 : 0, transform: hovered === p.id ? 'translateX(0)' : 'translateX(6px)', transition: 'all 0.22s ease', pointerEvents: 'none' }}>
            <div style={{ padding: '4px 10px', background: B.charcoal, border: `1px solid ${p.color}50`, borderRadius: 3, display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
              <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 7, fontWeight: 700, color: p.color, letterSpacing: '0.15em', whiteSpace: 'nowrap' }}>{p.label}</span>
              <span style={{ fontFamily: "'Syne', sans-serif", fontSize: 9, color: B.smoke, whiteSpace: 'nowrap' }}>{p.tip}</span>
            </div>
          </div>
          {/* Icon */}
          <div style={{ width: 42, height: 42, display: 'flex', alignItems: 'center', justifyContent: 'center', background: hovered === p.id ? p.color + '22' : B.charcoal, border: `1px solid ${hovered === p.id ? p.color + '90' : p.color + '35'}`, borderRadius: 4, transition: 'all 0.22s ease', boxShadow: hovered === p.id ? `0 0 16px ${p.color}25` : 'none', flexShrink: 0 }}>
            <span style={{ fontFamily: "'Orbitron', monospace", fontSize: p.abbr === 'X' ? 13 : 9, fontWeight: 900, color: p.color, letterSpacing: p.abbr === 'X' ? 0 : '0.05em' }}>{p.abbr}</span>
          </div>
        </a>
      ))}
      <div style={{ position: 'absolute', top: '50%', right: 20, width: 1, height: '130%', transform: 'translateY(-50%)', background: `linear-gradient(${B.neonMagenta}00, ${B.amber}20, ${B.neonLime}00)`, zIndex: -1, pointerEvents: 'none' }} />
    </div>
  )
}
