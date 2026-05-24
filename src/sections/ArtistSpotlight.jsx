import { B } from '../tokens'
import { GrainOverlay, ScanLines, SectionTag } from '../components/Shared'

const ARTISTS = [
  {
    name: 'DJ SPINALL',
    role: 'Headline DJ',
    tag: 'THE GODFATHER',
    bio: 'Nigeria’s most celebrated DJ. 15+ years behind the decks, collaborations with Wizkid, Burna Boy, and Davido. His sets don’t just play music — they build culture.',
    genres: ['Afrobeats', 'House', 'Dancehall'],
    stat1: { label: 'Years Active', value: '15+' },
    stat2: { label: 'Collabs', value: '200+' },
    color: '#F5A623',
    initials: 'DS',
  },
  {
    name: 'SARZ',
    role: 'Live Producer',
    tag: 'THE ARCHITECT',
    bio: 'The producer’s producer. Over 500 records crafted, responsible for the sonic DNA of a generation. When Sarz plays live, you hear the blueprint that built Afropop.',
    genres: ['Afropop', 'R&B', 'Trap'],
    stat1: { label: 'Records Made', value: '500+' },
    stat2: { label: 'Platinum Hits', value: '40+' },
    color: '#00F0FF',
    initials: 'SZ',
  },
  {
    name: 'ODUNSI',
    role: 'Live Performance',
    tag: 'THE ENGINE',
    bio: 'Alt-R&B’s most cinematic voice. Odunsi (The Engine) blends dreamy production with razor-sharp lyricism. His fits are as legendary as his music — a natural for Sneakers Fest.',
    genres: ['Alt-R&B', 'Afropop', 'Soul'],
    stat1: { label: 'Streams (M)', value: '120+' },
    stat2: { label: 'Countries', value: '60+' },
    color: '#FF2D7B',
    initials: 'OD',
  },
]

export default function ArtistSpotlight() {
  return (
    <section id="artists" style={{
      background: B.void,
      padding: '80px 20px',
      position: 'relative',
      overflow: 'hidden',
    }}>
      <GrainOverlay /><ScanLines />
      <div style={{ maxWidth: 960, margin: '0 auto' }}>
        <SectionTag>ARTIST SPOTLIGHT</SectionTag>
        <h2 style={{ fontFamily: "'Bebas Neue'", fontSize: 'clamp(2.5rem,6vw,4rem)', color: B.white, letterSpacing: '0.05em', marginBottom: 8 }}>
          THE ONES ON THE DECKS
        </h2>
        <p style={{ color: B.smoke, fontFamily: "'Space Mono'", fontSize: '0.78rem', marginBottom: 48 }}>
          Three legends. One stage. December 12.
        </p>

        <div style={{
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
                border: `1px solid ${B.gunmetal}`,
                borderTop: `3px solid ${a.color}`,
                position: 'relative',
                overflow: 'hidden',
                transition: 'transform 0.3s, box-shadow 0.3s',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.transform = 'translateY(-6px)'
                e.currentTarget.style.boxShadow = `0 20px 60px rgba(0,0,0,0.5), 0 0 40px ${a.color}20`
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = 'translateY(0)'
                e.currentTarget.style.boxShadow = 'none'
              }}
            >
              {/* Background glow */}
              <div style={{
                position: 'absolute', top: -40, right: -40,
                width: 160, height: 160, borderRadius: '50%',
                background: `radial-gradient(circle, ${a.color}15 0%, transparent 70%)`,
                pointerEvents: 'none',
              }} />

              {/* Avatar */}
              <div style={{
                width: 72, height: 72, borderRadius: '50%',
                background: `${a.color}20`,
                border: `2px solid ${a.color}60`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontFamily: "'Orbitron'", fontSize: '1.2rem', fontWeight: 900,
                color: a.color, marginBottom: 20,
                letterSpacing: '0.1em',
              }}>
                {a.initials}
              </div>

              {/* Tag */}
              <div style={{
                fontFamily: "'Space Mono'", fontSize: '0.58rem',
                letterSpacing: '0.3em', color: a.color, marginBottom: 6,
              }}>{a.tag}</div>

              {/* Name */}
              <h3 style={{
                fontFamily: "'Bebas Neue'", fontSize: '1.8rem',
                color: B.white, letterSpacing: '0.05em', marginBottom: 4,
              }}>{a.name}</h3>

              {/* Role */}
              <div style={{
                fontFamily: "'Space Mono'", fontSize: '0.65rem',
                color: B.smoke, letterSpacing: '0.1em', marginBottom: 16,
              }}>{a.role}</div>

              {/* Divider */}
              <div style={{ height: 1, background: B.gunmetal, marginBottom: 16 }} />

              {/* Bio */}
              <p style={{
                color: B.smoke, fontFamily: "'Syne'",
                fontSize: '0.82rem', lineHeight: 1.7, marginBottom: 20,
              }}>{a.bio}</p>

              {/* Genre tags */}
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 24 }}>
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
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                {[a.stat1, a.stat2].map(s => (
                  <div key={s.label} style={{
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
      </div>
    </section>
  )
}
