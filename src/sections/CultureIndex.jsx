import { useState, useEffect } from 'react'
import { B } from '../tokens'
import { GrainOverlay, SectionTag } from '../components/Shared'

const BRAND_ACCENT = {
  Nike:          B.white,
  Jordan:        B.neonMagenta,
  Adidas:        B.neonCyan,
  'New Balance': B.neonLime,
  Puma:          B.amber,
  Asics:         '#4169E1',
  Reebok:        '#CF3447',
  Vans:          '#8B0000',
  Converse:      B.smoke,
  Other:         B.gunmetal,
}

const EVENT_MS = new Date('2026-12-12T12:00:00+01:00').getTime()

function daysLeft() {
  return Math.max(0, Math.ceil((EVENT_MS - Date.now()) / 86400000))
}

function StatBox({ label, value, color, sub }) {
  return (
    <div className="card-3d" style={{ flex: '1 1 200px', background: B.charcoal, border: `1px solid ${color}30`, borderRadius: 6, padding: '24px 20px', textAlign: 'center' }}>
      <div style={{ fontFamily: "'Orbitron', monospace", fontSize: 38, fontWeight: 900, color, textShadow: `0 0 20px ${color}40`, lineHeight: 1 }}>{value}</div>
      {sub && <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 7, color: color + '90', letterSpacing: '0.2em', marginTop: 4 }}>{sub}</div>}
      <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 7, color: B.smoke, letterSpacing: '0.22em', marginTop: 8 }}>{label}</div>
    </div>
  )
}

function BrandBar({ name, count, total, color }) {
  const pct = total > 0 ? Math.round((count / total) * 100) : 0
  return (
    <div style={{ marginBottom: 10 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
        <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 8, color, letterSpacing: '0.12em' }}>{name.toUpperCase()}</span>
        <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 8, color: B.smoke }}>{count}</span>
      </div>
      <div style={{ height: 4, background: B.gunmetal, borderRadius: 2, overflow: 'hidden' }}>
        <div style={{ height: '100%', width: `${pct}%`, background: `linear-gradient(90deg, ${color}70, ${color})`, borderRadius: 2, transition: 'width 1s ease' }} />
      </div>
    </div>
  )
}

const EMPTY = { soleCount: 0, waitlistCount: 0, brands: [], topShoes: [], cities: [], recent: [], lastUpdated: null }

export default function CultureIndex() {
  const [data,  setData]  = useState(EMPTY)
  const [live,  setLive]  = useState(false)
  const [days,  setDays]  = useState(daysLeft())
  const [pulse, setPulse] = useState(true)

  async function fetchData() {
    try {
      const r = await fetch('/.netlify/functions/culture-index')
      if (!r.ok) return
      setData(await r.json())
      setLive(true)
    } catch {}
  }

  useEffect(() => {
    fetchData()
    const poll  = setInterval(fetchData, 60000)
    const tick  = setInterval(() => setDays(daysLeft()), 60000)
    const blink = setInterval(() => setPulse(p => !p), 800)
    return () => { clearInterval(poll); clearInterval(tick); clearInterval(blink) }
  }, [])

  const brandTotal = data.brands.reduce((s, [, n]) => s + n, 0)

  return (
    <section id="culture-index" style={{ position: 'relative', overflow: 'hidden', background: B.black, padding: '80px 24px' }}>
      <GrainOverlay />
      <div style={{ position: 'relative', zIndex: 10, maxWidth: 1100, margin: '0 auto' }}>
        <SectionTag>LIVE INTELLIGENCE</SectionTag>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12, marginBottom: 48 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
              <div style={{
                width: 8, height: 8, borderRadius: '50%',
                background: live ? B.neonLime : B.smoke,
                boxShadow: live ? `0 0 8px ${B.neonLime}` : 'none',
                opacity: pulse ? 1 : 0.25,
                transition: 'opacity 0.3s',
              }} />
              <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 7, color: live ? B.neonLime : B.smoke, letterSpacing: '0.3em' }}>
                {live ? 'LIVE' : 'CONNECTING...'}
              </span>
            </div>
            <h2 className="reveal-3d" style={{ fontFamily: "'Orbitron', monospace", fontWeight: 900, fontSize: 'clamp(22px, 4vw, 38px)', color: B.white, lineHeight: 1.1 }}>
              THE SF'26<br />
              <span style={{ color: B.amber }}>CULTURE INDEX</span>
            </h2>
            <p style={{ fontFamily: "'Syne', sans-serif", fontSize: 14, color: B.smoke, marginTop: 10, maxWidth: 420 }}>
              Real-time pulse of the community. Every grail registered, every seat claimed.
            </p>
          </div>
          {data.lastUpdated && (
            <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 7, color: B.smoke + '60', letterSpacing: '0.15em', textAlign: 'right' }}>
              LAST UPDATE<br />
              {new Date(data.lastUpdated).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </div>
          )}
        </div>

        {/* Big 3 Stats */}
        <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', marginBottom: 40 }}>
          <StatBox label="GRAILS ON THE WALL"    value={data.soleCount}     color={B.amber}        sub="OF 200 SLOTS" />
          <StatBox label="ON THE WAITLIST"        value={data.waitlistCount} color={B.neonCyan}     sub="EARLY ACCESS CLAIMED" />
          <StatBox label="DAYS TO EVENT"          value={days}               color={B.neonMagenta}  sub="DEC 12 — LAGOS" />
        </div>

        {/* Brand + Shoes + Cities row */}
        <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap', marginBottom: 32 }}>

          {/* Brand breakdown */}
          <div className="reveal-3d" style={{ flex: '1 1 260px', background: B.charcoal, border: `1px solid ${B.gunmetal}`, borderRadius: 6, padding: '24px 20px' }}>
            <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 8, color: B.neonCyan, letterSpacing: '0.3em', marginBottom: 20 }}>BRAND BREAKDOWN</div>
            {data.brands.length === 0
              ? <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 12, color: B.smoke }}>Awaiting registrations...</div>
              : data.brands.map(([name, count]) => (
                  <BrandBar key={name} name={name} count={count} total={brandTotal} color={BRAND_ACCENT[name] || B.smoke} />
                ))
            }
          </div>

          {/* Top Grails */}
          <div className="reveal-3d" style={{ flex: '1 1 220px', background: B.charcoal, border: `1px solid ${B.gunmetal}`, borderRadius: 6, padding: '24px 20px' }}>
            <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 8, color: B.amber, letterSpacing: '0.3em', marginBottom: 20 }}>TOP GRAILS</div>
            {data.topShoes.length === 0
              ? <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 12, color: B.smoke }}>Awaiting registrations...</div>
              : data.topShoes.map(([shoe, count], i) => (
                  <div key={shoe} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '8px 0', borderBottom: i < data.topShoes.length - 1 ? `1px solid ${B.gunmetal}` : 'none' }}>
                    <div style={{ width: 24, height: 24, display: 'flex', alignItems: 'center', justifyContent: 'center', background: i === 0 ? B.amber : B.gunmetal, borderRadius: 3, flexShrink: 0 }}>
                      <span style={{ fontFamily: "'Orbitron', monospace", fontSize: 9, fontWeight: 900, color: i === 0 ? B.black : B.smoke }}>#{i + 1}</span>
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 12, color: B.white, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{shoe}</div>
                      <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 7, color: B.smoke }}>{count} {count === 1 ? 'reg' : 'regs'}</div>
                    </div>
                  </div>
                ))
            }
          </div>

          {/* Cities */}
          <div className="reveal-3d" style={{ flex: '1 1 200px', background: B.charcoal, border: `1px solid ${B.gunmetal}`, borderRadius: 6, padding: '24px 20px' }}>
            <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 8, color: B.neonLime, letterSpacing: '0.3em', marginBottom: 20 }}>CITIES REPRESENTING</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {data.cities.length === 0
                ? <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 12, color: B.smoke }}>Map loading...</div>
                : data.cities.map(([city, count], i) => (
                    <div key={city} style={{ padding: '5px 10px', background: B.black, border: `1px solid ${B.neonLime}${i === 0 ? '60' : '22'}`, borderRadius: 3 }}>
                      <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 7, color: i === 0 ? B.neonLime : B.smoke, letterSpacing: '0.1em' }}>
                        {city.toUpperCase()}{count > 1 ? ` x${count}` : ''}
                      </span>
                    </div>
                  ))
              }
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        {data.recent.length > 0 && (
          <div style={{ background: B.charcoal, border: `1px solid ${B.gunmetal}`, borderRadius: 6, padding: '20px 24px', marginBottom: 28 }}>
            <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 8, color: B.neonMagenta, letterSpacing: '0.3em', marginBottom: 16 }}>LATEST REGISTRATIONS</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
              {data.recent.map((r, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '9px 0', borderBottom: i < data.recent.length - 1 ? `1px solid ${B.gunmetal}50` : 'none' }}>
                  <div style={{ width: 6, height: 6, borderRadius: '50%', background: i === 0 ? B.neonLime : B.gunmetal, flexShrink: 0 }} />
                  <span style={{ fontFamily: "'Syne', sans-serif", fontSize: 13, color: B.white, flex: 1, minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{r.shoe}</span>
                  <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 7, color: B.smoke, letterSpacing: '0.1em', flexShrink: 0 }}>{(r.city || '').toUpperCase()}</span>
                  {r.ts && (
                    <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 7, color: B.smoke + '50', letterSpacing: '0.08em', flexShrink: 0 }}>
                      {new Date(r.ts).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Footer note */}
        <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8, fontFamily: "'Space Mono', monospace", fontSize: 7, color: B.smoke + '50', letterSpacing: '0.15em' }}>
          <span>DATA: SF'26 SOLE REGISTRY &amp; WAITLIST</span>
          <span>AUTO-REFRESHES EVERY 60 SECONDS</span>
        </div>
      </div>
    </section>
  )
}
