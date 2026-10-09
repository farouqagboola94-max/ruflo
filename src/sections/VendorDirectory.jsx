import { useState, useEffect, useCallback, useMemo } from 'react'
import { B } from '../tokens'
import { GrainOverlay, SectionTag } from '../components/Shared'
import {
  useFestivalGamification,
  playFestivalSound,
  dispatchFestivalAction,
  FESTIVAL_ACTIONS,
} from '../framework/festivalFramework'

const API = '/.netlify/functions/vendors-public'

const label = { fontFamily: "'Space Mono', monospace", fontSize: 9, letterSpacing: '0.22em', color: B.smoke }

const ACCENTS = [B.amber, B.neonCyan, B.neonLime, B.neonMagenta, B.neonBlue, B.electricPurple]
// Stable per-category colour so the grid reads as grouped without a legend.
const accentFor = (cat, cats) => ACCENTS[Math.max(0, cats.indexOf(cat)) % ACCENTS.length]

const SAMPLE_INVENTORY = {
  'Sole House Lagos': [
    { id: 'SH-01', item: "Air Jordan 4 Retro 'Bred Reimagined'", condition: 'Deadstock (DS)', price: '₦420,000', size: 'US 10.5' },
    { id: 'SH-02', item: "Yeezy Slide 'Onyx'", condition: 'Deadstock (DS)', price: '₦180,000', size: 'US 11' },
  ],
  'Lagos Kicks Co.': [
    { id: 'LK-01', item: "Custom Air Force 1 'Eyo Festival Edition'", condition: 'Handmade 1-of-1', price: '₦250,000', size: 'US 9.5' },
    { id: 'LK-02', item: "Nike Dunk Low 'Panda Lagos Custom'", condition: 'Customized VNDS', price: '₦210,000', size: 'US 10' },
  ],
  'The Grail Vault': [
    { id: 'GV-01', item: "Nike SB Dunk Low x Ben & Jerry's Chunky Dunky", condition: 'DS with Special Box Tub', price: '₦3,200,000', size: 'US 10.5' },
  ],
  'Afro Kicks Studio': [
    { id: 'AK-01', item: "New Balance 9060 'Rain Cloud'", condition: 'Factory Fresh (DS)', price: '₦290,000', size: 'US 9' },
  ],
}

function Card({ vendor, accent }) {
  const [showVault, setShowVault] = useState(false)
  const [heldItems, setHeldItems] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('sf26_held_items') || '{}')
    } catch {
      return {}
    }
  })
  const { awardXP, unlockBadge } = useFestivalGamification()
  const handle = (vendor.instagram || '').replace(/^@/, '').replace(/^https?:\/\/(www\.)?instagram\.com\//, '')

  const catalog = SAMPLE_INVENTORY[vendor.business] || [
    {
      id: `${(vendor.business || 'VND').replace(/[^a-zA-Z]/g, '').slice(0, 3).toUpperCase()}-01`,
      item: vendor.exclusiveDrop || `${vendor.business} Festival Highlight`,
      condition: 'Deadstock (DS)',
      price: 'Festival Special Price',
      size: 'Assorted US Sizes'
    }
  ]

  const handleHold = (item) => {
    const voucher = `HOLD-${item.id}-${Math.floor(1000 + Math.random() * 9000)}`
    const updated = {
      ...heldItems,
      [item.id]: {
        voucher,
        vendor: vendor.business,
        booth: vendor.booth || 'Floor Area',
        item: item.item,
        price: item.price,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    }
    setHeldItems(updated)
    try {
      localStorage.setItem('sf26_held_items', JSON.stringify(updated))
    } catch {}

    awardXP(50, `Held ${item.item} at ${vendor.business}`)
    unlockBadge('VENDOR_GRAIL_HELD')
    playFestivalSound('zone_click')
    dispatchFestivalAction(FESTIVAL_ACTIONS.ADD_NOTIFICATION, {
      title: 'Grail Reserved for Booth Pickup',
      message: `${item.item} held at Booth ${vendor.booth || 'Floor'}. Voucher: ${voucher}`
    })
  }

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
          <div style={{ ...label, fontSize: 9, color: accent, marginBottom: 3 }}>EXCLUSIVE ON THE DAY</div>
          <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 12, color: B.mist }}>{vendor.exclusiveDrop}</div>
        </div>
      )}

      {/* BOOTH VAULT / STOREFRONT EXPANDER */}
      <div style={{ marginTop: 6, borderTop: `1px dashed ${B.gunmetal}`, paddingTop: 10 }}>
        <button
          onClick={() => {
            setShowVault(!showVault)
            playFestivalSound('zone_click')
          }}
          style={{
            width: '100%',
            padding: '7px 10px',
            background: showVault ? `${accent}20` : 'rgba(255,255,255,0.03)',
            border: `1px solid ${showVault ? accent : B.gunmetal}`,
            borderRadius: 4,
            color: showVault ? B.white : B.smoke,
            ...label,
            fontSize: 8.5,
            fontWeight: 700,
            cursor: 'pointer',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            transition: 'all 0.2s ease'
          }}
        >
          <span>📦 BOOTH VAULT ({catalog.length} ITEMS)</span>
          <span>{showVault ? '▲ HIDE' : '▼ VIEW & HOLD'}</span>
        </button>

        {showVault && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 10 }}>
            {catalog.map(item => {
              const isHeld = !!heldItems[item.id]
              return (
                <div key={item.id} style={{
                  padding: '9px 10px',
                  background: isHeld ? `${B.neonLime}10` : B.black,
                  border: `1px solid ${isHeld ? B.neonLime + '66' : B.gunmetal}`,
                  borderRadius: 5,
                  fontSize: 11
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 6 }}>
                    <div style={{ color: B.white, fontWeight: 700, fontFamily: "'Syne', sans-serif", fontSize: 12 }}>
                      {item.item}
                    </div>
                    <div style={{ color: B.amber, fontFamily: "'Orbitron', monospace", fontWeight: 700, fontSize: 11, whiteSpace: 'nowrap' }}>
                      {item.price}
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: 8, marginTop: 4, ...label, fontSize: 8 }}>
                    <span style={{ color: B.neonCyan }}>{item.size}</span>
                    <span>•</span>
                    <span style={{ color: B.smoke }}>{item.condition}</span>
                  </div>

                  <div style={{ marginTop: 8 }}>
                    {isHeld ? (
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '5px 8px',
                        background: 'rgba(0,0,0,0.5)',
                        border: `1px solid ${B.neonLime}`,
                        borderRadius: 3
                      }}>
                        <span style={{ ...label, fontSize: 8, color: B.neonLime, fontWeight: 700 }}>
                          ✓ HELD: {heldItems[item.id].voucher}
                        </span>
                        <span style={{ ...label, fontSize: 7, color: B.mist }}>
                          BOOTH {vendor.booth || 'FLOOR'}
                        </span>
                      </div>
                    ) : (
                      <button
                        onClick={() => handleHold(item)}
                        style={{
                          width: '100%',
                          padding: '6px 10px',
                          background: B.amber,
                          border: 'none',
                          borderRadius: 3,
                          color: B.black,
                          ...label,
                          fontSize: 8.5,
                          fontWeight: 800,
                          cursor: 'pointer'
                        }}
                      >
                        🤝 HOLD FOR PICKUP (+50 XP)
                      </button>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {(handle || vendor.website) && (
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 'auto', paddingTop: 4 }}>
          {handle && (
            <a href={`https://instagram.com/${handle}`} target="_blank" rel="noopener noreferrer"
              style={{ ...label, fontSize: 9, color: B.neonCyan, textDecoration: 'none' }}>@{handle} &#8599;</a>
          )}
          {vendor.website && (
            <a href={vendor.website} target="_blank" rel="noopener noreferrer"
              style={{ ...label, fontSize: 9, color: B.smoke, textDecoration: 'none' }}>WEBSITE &#8599;</a>
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
