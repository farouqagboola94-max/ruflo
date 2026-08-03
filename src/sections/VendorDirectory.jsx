import { useState, useEffect, useCallback, useMemo } from 'react'
import { B } from '../tokens'
import { GrainOverlay, SectionTag } from '../components/Shared'

const API = '/.netlify/functions/vendors-public'

const label = { fontFamily: "'Space Mono', monospace", fontSize: 7, letterSpacing: '0.22em', color: B.smoke }

const ACCENTS = [B.amber, B.neonCyan, B.neonLime, B.neonMagenta, B.neonBlue, B.electricPurple]
// Stable per-category colour so the grid reads as grouped without a legend.
const accentFor = (cat, cats) => ACCENTS[Math.max(0, cats.indexOf(cat)) % ACCENTS.length]

function Card({ vendor, accent }) {
  const handle = (vendor.instagram || '').replace(/^@/, '').replace(/^https?:\/\/(www\.)?instagram\.com\//, '')
  return (
    <div className="card-3d" style={{
      display: 'flex', flexDirection: 'column', gap: 10,
      background: B.charcoal, border: `1px solid ${vendor.exclusiveDrop ? accent + '55' : B.gunmetal}`,
      borderRadius: 8, padding: '18px 17px',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 10, alignItems: 'flex-start' }}>
        <div style={{ minWidth: 0 }}>
          <div style={{ fontFamily: "'Orbitron', monospace", fontWeight: 900, fontSize: 15, color: B.white, wordBreak: 'break-word' }}>
            {vendor.business}
          </div>
          <div style={{ ...label, color: accent, marginTop: 5 }}>{vendor.category.toUpperCase()}</div>
        </div>
        {vendor.booth && (
          <span style={{
            flexShrink: 0, padding: '4px 9px', borderRadius: 3, background: B.black,
            border: `1px solid ${B.gunmetal}`, ...label, fontSize: 6.5, color: B.mist,
          }}>{String(vendor.booth).toUpperCase()}</span>
        )}
      </div>

      {vendor.bio && (
        <p style={{ fontFamily: "'Syne', sans-serif", fontSize: 12.5, color: B.smoke, lineHeight: 1.6, margin: 0 }}>
          {vendor.bio}
        </p>
      )}

      {vendor.exclusiveDrop && (
        <div style={{ padding: '9px 11px', borderRadius: 4, background: `${accent}12`, border: `1px solid ${accent}33` }}>
          <div style={{ ...label, fontSize: 6, color: accent, marginBottom: 3 }}>EXCLUSIVE ON THE DAY</div>
          <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 12, color: B.mist }}>{vendor.exclusiveDrop}</div>
        </div>
      )}

      {(handle || vendor.website) && (
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 'auto', paddingTop: 4 }}>
          {handle && (
            <a href={`https://instagram.com/${handle}`} target="_blank" rel="noopener noreferrer"
              style={{ ...label, fontSize: 7, color: B.neonCyan, textDecoration: 'none' }}>@{handle} &#8599;</a>
          )}
          {vendor.website && (
            <a href={vendor.website} target="_blank" rel="noopener noreferrer"
              style={{ ...label, fontSize: 7, color: B.smoke, textDecoration: 'none' }}>WEBSITE &#8599;</a>
          )}
        </div>
      )}
    </div>
  )
}

export default function VendorDirectory() {
  const [data, setData] = useState({ vendors: [], total: 0, categories: [], withExclusive: 0 })
  const [filter, setFilter] = useState('ALL')
  const [state, setState] = useState('loading')

  const load = useCallback(async () => {
    try {
      const r = await fetch(API)
      if (!r.ok) return setState('error')
      setData(await r.json())
      setState('ready')
    } catch { setState('error') }
  }, [])

  useEffect(() => { load() }, [load])

  const shown = useMemo(
    () => (filter === 'ALL' ? data.vendors : data.vendors.filter(v => v.category === filter)),
    [data.vendors, filter]
  )

  return (
    <section id="vendor-directory" style={{ position: 'relative', overflow: 'hidden', background: B.black, padding: '80px 24px' }}>
      <GrainOverlay />
      <div style={{ position: 'relative', zIndex: 10, maxWidth: 1100, margin: '0 auto' }}>
        <SectionTag>WHO IS SELLING</SectionTag>

        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: 14, marginBottom: 34 }}>
          <div style={{ maxWidth: 520 }}>
            <h2 className="reveal-3d" style={{ fontFamily: "'Orbitron', monospace", fontWeight: 900, fontSize: 'clamp(22px, 4vw, 38px)', color: B.white, lineHeight: 1.1 }}>
              THE<span style={{ color: B.amber }}> FLOOR</span>
            </h2>
            <p style={{ fontFamily: "'Syne', sans-serif", fontSize: 14, color: B.smoke, marginTop: 10, lineHeight: 1.7 }}>
              Every confirmed vendor on the floor at Muri Okunola Park. Know who you are coming for
              before you get there.
            </p>
          </div>
          {state === 'ready' && data.total > 0 && (
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontFamily: "'Orbitron', monospace", fontWeight: 900, fontSize: 28, color: B.amber }}>{data.total}</div>
              <div style={{ ...label }}>CONFIRMED</div>
              {data.withExclusive > 0 && (
                <div style={{ ...label, color: B.neonLime, marginTop: 4 }}>{data.withExclusive} WITH EXCLUSIVES</div>
              )}
            </div>
          )}
        </div>

        {state === 'loading' && (
          <div style={{ ...label }}>LOADING THE FLOOR...</div>
        )}

        {state === 'error' && (
          <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 14, color: B.smoke }}>
            Could not load the vendor list. Try again shortly.
          </div>
        )}

        {/* An empty floor is stated plainly rather than dressed up. */}
        {state === 'ready' && data.total === 0 && (
          <div style={{ background: B.charcoal, border: `1px solid ${B.gunmetal}`, borderRadius: 8, padding: '26px 24px' }}>
            <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 14, color: B.mist, lineHeight: 1.7 }}>
              Vendors are still being confirmed. The floor goes up here as each one is approved.
            </div>
            <a href="#vendors" style={{
              display: 'inline-block', marginTop: 16, padding: '11px 22px', borderRadius: 3,
              background: B.amber, color: B.black, textDecoration: 'none',
              fontFamily: "'Space Mono', monospace", fontSize: 9, fontWeight: 700, letterSpacing: '0.18em',
            }}>APPLY TO SELL</a>
          </div>
        )}

        {state === 'ready' && data.total > 0 && (
          <>
            <div style={{ display: 'flex', gap: 7, flexWrap: 'wrap', marginBottom: 22 }}>
              {['ALL', ...data.categories].map(c => (
                <button key={c} onClick={() => setFilter(c)} style={{
                  padding: '7px 13px', borderRadius: 3, cursor: 'pointer',
                  background: filter === c ? B.amber : 'transparent',
                  border: `1px solid ${filter === c ? B.amber : B.gunmetal}`,
                  color: filter === c ? B.black : B.smoke,
                  fontFamily: "'Space Mono', monospace", fontSize: 8, fontWeight: 700, letterSpacing: '0.14em',
                }}>{c.toUpperCase()}</button>
              ))}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(255px, 1fr))', gap: 14 }}>
              {shown.map(v => (
                <Card key={v.id} vendor={v} accent={accentFor(v.category, data.categories)} />
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  )
}
