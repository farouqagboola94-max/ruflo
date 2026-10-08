import { useState, useEffect } from 'react'
import { B } from '../tokens'
import { GrainOverlay, ScanLines, SectionTag } from '../components/Shared'
import Egg from '../components/Egg'

const ARTISTS = [
  {
    name: '⧡ CLASSIFIED',
    role: 'Headline Act',
    tag: '⧡ CLASSIFIED',
    bio: 'Identity locked. This act will be announced closer to the event. Loyalty unlocks the reveal.',
    genres: ['⧡ CLASSIFIED', '⧡ CLASSIFIED', '⧡ CLASSIFIED'],
    stat1: { label: 'Years Active', value: '??+' },
    stat2: { label: 'Collabs', value: '???+' },
    color: '#F5A623',
    initials: '?',
  },
  {
    name: '⧡ CLASSIFIED',
    role: 'Live Producer',
    tag: '⧡ CLASSIFIED',
    bio: 'Identity locked. This act will be announced closer to the event. Loyalty unlocks the reveal.',
    genres: ['⧡ CLASSIFIED', '⧡ CLASSIFIED', '⧡ CLASSIFIED'],
    stat1: { label: 'Records Made', value: '???+' },
    stat2: { label: 'Platinum Hits', value: '??+' },
    color: '#00F0FF',
    initials: '?',
  },
  {
    name: '⧡ CLASSIFIED',
    role: 'Live Performance',
    tag: '⧡ CLASSIFIED',
    bio: 'Identity locked. This act will be announced closer to the event. Loyalty unlocks the reveal.',
    genres: ['⧡ CLASSIFIED', '⧡ CLASSIFIED', '⧡ CLASSIFIED'],
    stat1: { label: 'Streams (M)', value: '???+' },
    stat2: { label: 'Countries', value: '??+' },
    color: '#FF2D7B',
    initials: '?',
  },
]

const REVEAL_DAYS = 60

function recordVisitAndCheck() {
  try {
    const now = Date.now()
    const first = localStorage.getItem('sf26_first_visit')
    if (!first) {
      localStorage.setItem('sf26_first_visit', String(now))
      return { revealed: false, daysActive: 0 }
    }
    const daysActive = Math.floor((now - Number(first)) / 86400000)

    // Track last visit for streak (visit counts if last visit was a different calendar day)
    const lastVisit = localStorage.getItem('sf26_last_visit')
    const todayKey = new Date().toDateString()
    if (lastVisit !== todayKey) {
      const streak = Number(localStorage.getItem('sf26_visit_streak') || 0) + 1
      localStorage.setItem('sf26_visit_streak', String(streak))
      localStorage.setItem('sf26_last_visit', todayKey)
    }

    return { revealed: daysActive >= REVEAL_DAYS, daysActive }
  } catch {
    return { revealed: false, daysActive: 0 }
  }
}

export default function ArtistSpotlight() {
  const [revealed, setRevealed] = useState(false)
  const [daysActive, setDaysActive] = useState(0)

  useEffect(() => {
    const { revealed: r, daysActive: d } = recordVisitAndCheck()
    setRevealed(r)
    setDaysActive(d)
  }, [])

  const daysLeft = Math.max(0, REVEAL_DAYS - daysActive)

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
        <SectionTag>ARTIST SPOTLIGHT</SectionTag>
        <h2 className="reveal-3d text-3d" style={{ fontFamily: "'Bebas Neue'", fontSize: 'clamp(2.5rem,6vw,4rem)', color: B.white, letterSpacing: '0.05em', marginBottom: 8 }}>
          THE ONES ON THE DECKS
        </h2>
        <p className="reveal-3d" style={{ color: B.smoke, fontFamily: "'Space Mono'", fontSize: '0.78rem', marginBottom: revealed ? 48 : 24 }}>
          Three legends. One stage. December 12.
        </p>

        {!revealed && (
          <div className="reveal-3d" style={{
            background: '#0a0a0a', border: '1px solid #1a1a1a',
            padding: '14px 20px', marginBottom: 36,
            display: 'flex', alignItems: 'center', gap: 12,
          }}>
            <div style={{ fontFamily: "'Orbitron'", fontSize: 11, color: B.amber, fontWeight: 900, letterSpacing: '0.1em', animation: 'artistPulse 2s infinite' }}>⬡ CLASSIFIED</div>
            <div style={{ fontFamily: "'Space Mono'", fontSize: 9, color: B.smoke, flex: 1 }}>
              Full lineup is locked for loyal community members.
              {daysLeft > 0
                ? ` Come back in ${daysLeft} more day${daysLeft !== 1 ? 's' : ''} to unlock.`
                : ` You're almost there — return soon to reveal.`}
            </div>
          </div>
        )}

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
                  <div style={{ fontFamily: "'Orbitron'", fontSize: 28, color: '#222', fontWeight: 900 }}>?</div>
                  <div style={{ fontFamily: "'Space Mono'", fontSize: 9, color: B.dim, letterSpacing: '0.25em', textAlign: 'center', padding: '0 16px' }}>
                    CLASSIFIED<br />LOYAL FANS ONLY
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
                letterSpacing: '0.3em', color: a.color, marginBottom: 6,
                filter: revealed ? 'none' : 'blur(6px)',
                userSelect: revealed ? 'auto' : 'none',
              }}>{a.tag}</div>

              {/* Name */}
              <h3 style={{
                fontFamily: "'Bebas Neue'", fontSize: '1.8rem',
                color: B.white, letterSpacing: '0.05em', marginBottom: 4,
                filter: revealed ? 'none' : 'blur(10px)',
                userSelect: revealed ? 'auto' : 'none',
              }}>{a.name}</h3>

              {/* Role */}
              <div style={{
                fontFamily: "'Space Mono'", fontSize: '0.65rem',
                color: B.smoke, letterSpacing: '0.1em', marginBottom: 16,
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
                    <div style={{ fontFamily: "'Orbitron'", fontSize: '1.1rem', color: a.color, fontWeight: 700 }}>
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

        {!revealed && (
          <p className="reveal-3d" style={{
            fontFamily: "'Space Mono'", fontSize: 8, color: B.dim,
            textAlign: 'center', marginTop: 24, letterSpacing: '0.15em',
          }}>
            RETURN REGULARLY · LOYALTY UNLOCKS THE LINEUP · {daysLeft} DAY{daysLeft !== 1 ? 'S' : ''} REMAINING
          </p>
        )}
      </div>
    </section>
  )
}
