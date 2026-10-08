import { B } from '../tokens'
import { GrainOverlay, SectionTag } from '../components/Shared'
import Egg from '../components/Egg'

// This section used to carry four five-star reviews from named people -
// "the best sneaker event I've ever attended", "got a grail at the vendor
// floor", "the headliner closed the night perfectly" - written in the past
// tense about a festival that has not happened yet. It also invented a
// "helpful" count for each one and a live "23 people reading reviews right
// now" ticker.
//
// There is nothing honest to put in their place until December 12, so the
// section says that and holds the space. Real quotes go in QUOTES once you
// have them, with permission from the people who said them.

const QUOTES = []

const EVENT = 'December 12, 2026'

export default function Testimonials() {
  return (
    <section id="testimonials" style={{ position: 'relative', overflow: 'hidden', background: B.void, padding: '100px 24px' }}>
      <GrainOverlay />
      <Egg id="egg-021" corner="top-right" />
      <Egg id="egg-022" corner="bottom-left" />
      <div style={{ position: 'absolute', top: '30%', right: '-5%', width: 350, height: 350, background: `radial-gradient(circle, ${B.amber}08 0%, transparent 70%)`, filter: 'blur(70px)', pointerEvents: 'none' }} />

      <div style={{ position: 'relative', zIndex: 10, maxWidth: 720, margin: '0 auto', textAlign: 'center' }}>
        <SectionTag>COMMUNITY VOICES</SectionTag>

        <div className="reveal-3d text-3d" style={{
          fontFamily: "'Bebas Neue', sans-serif", fontSize: 'clamp(40px, 6vw, 68px)',
          color: B.white, lineHeight: 0.9, margin: '10px 0 20px',
        }}>
          NOBODY HAS<br /><span style={{ color: B.amber }}>BEEN YET</span>
        </div>

        {QUOTES.length === 0 ? (
          <>
            <p style={{ fontFamily: "'Syne', sans-serif", fontSize: '1rem', color: B.smoke, lineHeight: 1.8, marginBottom: 28 }}>
              The first Sneakers Fest is on {EVENT}. Anyone claiming to have been
              is lying, so there is nothing to quote here yet.
            </p>
            <p style={{ fontFamily: "'Space Mono', monospace", fontSize: '0.72rem', color: B.smoke, letterSpacing: 1, lineHeight: 2 }}>
              COME ON THE DAY. TELL US AFTERWARDS.<br />
              THIS SPACE IS FOR WHAT YOU SAY THEN.
            </p>
          </>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20, textAlign: 'left' }}>
            {QUOTES.map((q, i) => (
              <div key={i} className="card-3d" style={{
                padding: 28, background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.08)', borderRadius: 14,
              }}>
                <p style={{ fontFamily: "'Syne', sans-serif", fontSize: '0.9rem', color: B.mist, lineHeight: 1.7, marginBottom: 14 }}>
                  {q.quote}
                </p>
                <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 9, color: B.amber, letterSpacing: 2 }}>
                  {q.name}
                </div>
                {q.role && (
                  <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 8, color: B.smoke, letterSpacing: 1, marginTop: 3 }}>
                    {q.role}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
