import { useState } from 'react'
import { B } from '../tokens'
import { GrainOverlay, ScanLines, SectionTag } from '../components/Shared'
import Egg from '../components/Egg'

const ARTISTS = [
  {
    name: 'THE 4-WAY DJ SOUNDCLASH ARCHITECTS',
    role: 'Main Amphitheatre Deck Generals · 7:00 PM WAT',
    tag: 'PHASE 1 CONFIRMED · 4-DECK CLASH',
    bio: 'Four of Lagos’s premier turntable architects face off inside the Freedom Park brick Amphitheatre across four high-voltage rounds: Afrobeats Vanguard vs. Alté Syndicate vs. UK Drill/Grime vs. Amapiano Log Drum.',
    genres: ['AFROBEATS', 'ALTÉ WAVE', 'DRILL / GRIME', 'AMAPIANO'],
    stat1: { label: 'Sound Systems', value: '4 DECKS' },
    stat2: { label: 'Clash Format', value: '4 ROUNDS' },
    color: '#F5A623',
    initials: '4X',
  },
  {
    name: 'COBBLESTONE ARENA RINGMASTERS',
    role: 'Official 1v1 Fit-Check Hosts & MCs · 3:00 PM & 6:00 PM WAT',
    tag: 'PHASE 1 CONFIRMED · ARENA HOSTS',
    bio: 'Commanding the colonial cobblestone courtyard for the Mainland vs. Island 1v1 Fit-Check Battles. Expect razor-sharp fit critiques, live decibel crowd judging, and the crowning of the ₦500K Crown of Freedom.',
    genres: ['FIT-CHECK ARENA', 'CROWD DECIBEL', 'MAINLAND VS ISLAND'],
    stat1: { label: 'Bracket Size', value: '32 CREWS' },
    stat2: { label: 'Grail Pool', value: '₦500K+' },
    color: '#00F0FF',
    initials: 'MC',
  },
  {
    name: 'CULTURAL LIBERATION PANEL & CYPHER',
    role: 'Founders, Archivists & Headline Set · 2:00 PM & 8:00 PM WAT',
    tag: 'PHASE 1 CONFIRMED · CULTURE & LIVE',
    bio: 'Daytime panel featuring West Africa’s top sneaker boutique founders, Sole Craft customs masters, and archival collectors — followed at 8:00 PM by the Year of Freedom Headline Set and surprise Lagos All-Star Cypher.',
    genres: ['DESIGN SOVEREIGNTY', 'HEADLINE CYPHER', 'SOLE ARCHIVE'],
    stat1: { label: 'Stage Time', value: '2PM & 8PM' },
    stat2: { label: 'Landmark', value: 'AMPHITHEATRE' },
    color: '#FF2D7B',
    initials: 'YF',
  },
]

export default function ArtistSpotlight() {
  const [vaultMode, setVaultMode] = useState(false)
  const revealed = !vaultMode

  return (
    <section id="artists" style={{
      background: B.void,
      padding: '80px 20px',
      position: 'relative',
      overflow: 'hidden',
    }}>
      <GrainOverlay />
      <Egg id="egg-061" corner="top-right" />
      <Egg id="egg-062" corner="bottom-left" />
      <ScanLines />
      <style>{`
        @keyframes artistPulse { 0%,100%{opacity:0.5} 50%{opacity:1} }
        @keyframes artistReveal { from{opacity:0;filter:blur(20px)} to{opacity:1;filter:blur(0)} }
      `}</style>

      <div style={{ maxWidth: 960, margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: 16, marginBottom: 32 }}>
          <div>
            <SectionTag>ARTIST & STAGE SPOTLIGHT</SectionTag>
            <h2 className="reveal-3d text-3d" style={{ fontFamily: "'Bebas Neue'", fontSize: 'clamp(2.5rem,6vw,4rem)', color: B.white, letterSpacing: '0.05em', marginBottom: 8 }}>
              THE ONES ON THE DECKS & MIC
            </h2>
            <p className="reveal-3d" style={{ color: B.smoke, fontFamily: "'Space Mono'", fontSize: '0.78rem' }}>
              Phase 1 Amphitheatre & Cobblestone Arena Roster · Freedom Park, CMS · December 12, 2026
            </p>
          </div>
          <button
            type="button"
            onClick={() => setVaultMode(v => !v)}
            style={{
              padding: '8px 14px',
              background: vaultMode ? `${B.amber}20` : 'rgba(255,255,255,0.04)',
              border: `1px solid ${vaultMode ? B.amber : 'rgba(255,255,255,0.12)'}`,
              borderRadius: 6,
              color: vaultMode ? B.amber : B.smoke,
              fontFamily: "'Space Mono', monospace",
              fontSize: 9,
              letterSpacing: '0.12em',
              cursor: 'pointer',
            }}
          >
            {vaultMode ? '🔓 VIEW PHASE 1 ROSTER' : '🔒 PREVIEW PHASE 2 CLASSIFIED VAULT'}
          </button>
        </div>

        <div className="reveal-3d" style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: 24,
        }}>
          {ARTISTS.map((a, i) => (
            <div
              key={i}
              style={{
                background: B.charcoal,
                borderRadius: 12,
                padding: '32px 28px',
                border: `1px solid ${revealed ? B.gunmetal : '#111'}`,
                borderTop: `3px solid ${revealed ? a.color : '#1a1a1a'}`,
                position: 'relative',
                overflow: 'hidden',
                transition: 'transform 0.3s, box-shadow 0.3s',
                animation: revealed ? 'artistReveal 0.6s ease forwards' : 'none',
              }}
              onMouseEnter={e => {
                if (!revealed) return
                e.currentTarget.style.transform = 'translateY(-6px)'
                e.currentTarget.style.boxShadow = `0 20px 60px rgba(0,0,0,0.5), 0 0 40px ${a.color}20`
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = 'translateY(0)'
                e.currentTarget.style.boxShadow = 'none'
              }}
            >
              {/* Background glow — hidden when locked */}
              {revealed && (
                <div style={{
                  position: 'absolute', top: -40, right: -40,
                  width: 160, height: 160, borderRadius: '50%',
                  background: `radial-gradient(circle, ${a.color}15 0%, transparent 70%)`,
                  pointerEvents: 'none',
                }} />
              )}

              {/* Blur overlay when locked */}
              {!revealed && (
                <div style={{
                  position: 'absolute', inset: 0, zIndex: 10,
                  backdropFilter: 'blur(12px) saturate(0.1) brightness(0.4)',
                  WebkitBackdropFilter: 'blur(12px) saturate(0.1) brightness(0.4)',
                  display: 'flex', flexDirection: 'column',
                  alignItems: 'center', justifyContent: 'center',
                  gap: 8, borderRadius: 12,
                }}>
                  <div style={{ fontFamily: "'Orbitron'", fontSize: 28, color: B.amber, fontWeight: 900 }}>⧡</div>
                  <div style={{ fontFamily: "'Space Mono'", fontSize: 9, color: B.white, letterSpacing: '0.2em', textAlign: 'center', padding: '0 16px' }}>
                    PHASE 2 SPECIAL GUEST<br />DROPPING ON @S_FEST26
                  </div>
                </div>
              )}

              {/* Avatar */}
              <div style={{
                width: 72, height: 72, borderRadius: '50%',
                background: `${a.color}20`,
                border: `2px solid ${a.color}60`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontFamily: "'Orbitron'", fontSize: '1.2rem', fontWeight: 900,
                color: a.color, marginBottom: 20,
                letterSpacing: '0.1em',
                filter: revealed ? 'none' : 'blur(4px) saturate(0)',
              }}>
                {a.initials}
              </div>

              {/* Tag */}
              <div style={{
                fontFamily: "'Space Mono'", fontSize: '0.58rem',
                letterSpacing: '0.22em', color: a.color, marginBottom: 6,
                filter: revealed ? 'none' : 'blur(6px)',
                userSelect: revealed ? 'auto' : 'none',
              }}>{a.tag}</div>

              {/* Name */}
              <h3 style={{
                fontFamily: "'Bebas Neue'", fontSize: '1.75rem',
                color: B.white, letterSpacing: '0.05em', marginBottom: 4,
                filter: revealed ? 'none' : 'blur(10px)',
                userSelect: revealed ? 'auto' : 'none',
              }}>{a.name}</h3>

              {/* Role */}
              <div style={{
                fontFamily: "'Space Mono'", fontSize: '0.65rem',
                color: B.smoke, letterSpacing: '0.08em', marginBottom: 16,
                filter: revealed ? 'none' : 'blur(5px)',
              }}>{a.role}</div>

              {/* Divider */}
              <div style={{ height: 1, background: B.gunmetal, marginBottom: 16 }} />

              {/* Bio */}
              <p style={{
                color: B.smoke, fontFamily: "'Syne'",
                fontSize: '0.82rem', lineHeight: 1.7, marginBottom: 20,
                filter: revealed ? 'none' : 'blur(8px)',
                userSelect: revealed ? 'auto' : 'none',
              }}>{a.bio}</p>

              {/* Genre tags */}
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 24, filter: revealed ? 'none' : 'blur(6px)' }}>
                {a.genres.map(g => (
                  <span key={g} style={{
                    background: `${a.color}15`, border: `1px solid ${a.color}40`,
                    borderRadius: 20, padding: '3px 10px',
                    fontFamily: "'Space Mono'", fontSize: '0.58rem',
                    color: a.color, letterSpacing: '0.1em',
                  }}>{g}</span>
                ))}
              </div>

              {/* Stats */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, filter: revealed ? 'none' : 'blur(4px)' }}>
                {[a.stat1, a.stat2].map(s => (
                  <div key={s.label} className="card-3d" style={{
                    background: B.black, borderRadius: 6,
                    padding: '10px 12px', textAlign: 'center',
                  }}>
                    <div style={{ fontFamily: "'Orbitron'", fontSize: '1.05rem', color: a.color, fontWeight: 700 }}>
                      {s.value}
                    </div>
                    <div style={{ fontFamily: "'Space Mono'", fontSize: '0.55rem', color: B.smoke, marginTop: 3, letterSpacing: '0.1em' }}>
                      {s.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
