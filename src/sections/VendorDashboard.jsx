import { useState, useEffect, useRef } from 'react'
import { B } from '../tokens'
import { GrainOverlay, ScanLines, SectionTag, Divider } from '../components/Shared'
import { dispatchFestivalAction, FESTIVAL_ACTIONS, playFestivalSound } from '../framework/festivalFramework'

// Vendor access codes — keyed by code, value is booth profile
const DEMO_VENDORS = {
  'SF26-001': { name: 'Sole House Lagos', booth: 'A-01', zone: 'Zone A — Premium Row', setup: '8:00 AM', category: 'Resell & Deadstock', tables: 2, sqm: 12 },
  'SF26-002': { name: 'Lagos Kicks Co.', booth: 'A-02', zone: 'Zone A — Premium Row', setup: '8:00 AM', category: 'Customs & 1-of-1', tables: 1, sqm: 6 },
  'SF26-003': { name: 'The Grail Vault', booth: 'B-07', zone: 'Zone B — Collector Floor', setup: '8:30 AM', category: 'Vintage & Archive', tables: 3, sqm: 18 },
  'SF26-004': { name: 'Afro Kicks Studio', booth: 'C-12', zone: 'Zone C — General Market', setup: '9:00 AM', category: 'Streetwear', tables: 1, sqm: 6 },
  'DEMO': { name: 'Your Brand Here', booth: 'D-01', zone: 'Zone D — New Entrants', setup: '9:30 AM', category: 'Mixed', tables: 1, sqm: 6 },
}

const RULES = [
  'Set-up must be complete by 11:00 AM — no exceptions.',
  'Each booth must display a printed price list visible to attendees.',
  'All transactions are vendor-managed. No ticket staff handle payments.',
  'Customs and deadstock only — no reprints, no unauthorized replicas.',
  'Breakdowns begin at 9:30 PM. All stands must vacate by 11:00 PM.',
  'ID and vendor pass required for re-entry during the event.',
  'Photography by attendees is permitted unless a vendor opts out.',
  'Food and beverage not permitted inside vendor stands.',
]

const VENDOR_SCHEDULE = [
  { time: '8:00 AM', event: 'Vendor gates open — begin setup', type: 'vendor' },
  { time: '11:00 AM', event: 'Setup deadline. Inspection sweep by event team', type: 'vendor' },
  { time: '12:00 PM', event: 'Doors open to general public', type: 'public' },
  { time: '1:00 PM', event: 'Opening ceremony & hype segment', type: 'public' },
  { time: '2:00 PM', event: 'First raffle draw — vendors eligible for prizes', type: 'vendor' },
  { time: '4:00 PM', event: 'Collector Room VIP session begins', type: 'vip' },
  { time: '6:00 PM', event: 'Peak traffic window — high energy period', type: 'public' },
  { time: '7:30 PM', event: 'Closing performances begin', type: 'public' },
  { time: '9:30 PM', event: 'Vendor breakdown window opens', type: 'vendor' },
  { time: '10:00 PM', event: 'Event closes to public', type: 'public' },
  { time: '11:00 PM', event: 'All vendors must exit premises', type: 'vendor' },
]

const CHECKLIST_ITEMS = [
  'Government-issued ID',
  'Vendor confirmation email / printed pass',
  'Float cash for change',
  'POS / payment device',
  'Printed price list',
  'Booth décor and display fixtures',
  'Product inventory — confirmed and packed',
  'Mobile charger / power bank',
  'Water and personal snacks',
  'Instagram handle for feature tagging',
]

function LoginScreen({ onLogin }) {
  const [code, setCode] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const inputRef = useRef(null)

  function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    setError('')
    setTimeout(() => {
      const c = code.trim().toUpperCase()
      const isMaster = c === 'ADMIN' || c === 'ORGANIZER'
      const vendor = isMaster
        ? { code: 'ADMIN', name: 'Organizers Control Desk', isAdmin: true, booth: 'HQ-01', zone: 'Control Center', setup: '7:00 AM', category: 'Festival Organizer', tables: 4, sqm: 24 }
        : DEMO_VENDORS[c]

      if (vendor) {
        try { localStorage.setItem('sf26_vendor_session', JSON.stringify({ code: c, ts: Date.now() })) } catch {}
        onLogin({ code: c, ...vendor })
      } else {
        setError('Access code not recognised. Try SF26-001 or ADMIN.')
        setLoading(false)
        inputRef.current?.select()
      }
    }, 600)
  }

  return (
    <div style={{ maxWidth: 480, margin: '0 auto', padding: '0 24px' }}>
      <div style={{
        border: `1px solid ${B.amber}40`,
        background: `${B.charcoal}`,
        borderRadius: 16,
        padding: '48px 40px',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute', inset: 0,
          background: `radial-gradient(ellipse at 50% 0%, ${B.amber}08 0%, transparent 65%)`,
          pointerEvents: 'none',
        }} />

        <div style={{
          width: 64, height: 64, borderRadius: '50%',
          border: `2px solid ${B.amber}60`,
          background: `${B.amber}10`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          margin: '0 auto 24px',
          fontSize: 28,
        }}>
          {'[V]'}
        </div>

        <p style={{ fontFamily: 'Orbitron, sans-serif', fontSize: 11, letterSpacing: 4, color: B.amber, marginBottom: 8, textTransform: 'uppercase' }}>
          VENDOR & ORGANIZER PORTAL
        </p>
        <h2 style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: 36, letterSpacing: 2, color: B.white, marginBottom: 8 }}>
          Access Dashboard
        </h2>
        <p style={{ fontSize: 13, color: B.smoke, lineHeight: 1.6, marginBottom: 30 }}>
          Enter your vendor pass code to view booth setup, or login as organizer to review applications.
        </p>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <input aria-label="Vendor ID"
            ref={inputRef}
            type="text"
            placeholder="e.g. SF26-001 or ADMIN"
            value={code}
            onChange={e => setCode(e.target.value)}
            maxLength={12}
            style={{
              background: `${B.gunmetal}`,
              border: `1px solid ${error ? B.neonMagenta : B.amber}40`,
              borderRadius: 10,
              padding: '14px 18px',
              color: B.white,
              fontFamily: 'Space Mono, monospace',
              fontSize: 16,
              letterSpacing: 2,
              textAlign: 'center',
              outline: 'none',
              width: '100%',
              textTransform: 'uppercase',
            }}
            autoFocus
            autoComplete="off"
          />
          {error && (
            <p style={{ fontSize: 12, color: B.neonMagenta, textAlign: 'center' }}>{error}</p>
          )}
          <button
            type="submit"
            disabled={!code.trim() || loading}
            style={{
              background: code.trim() && !loading ? `linear-gradient(135deg, ${B.amber}, ${B.amberDeep})` : B.gunmetal,
              border: 'none',
              borderRadius: 10,
              padding: '14px 24px',
              color: code.trim() && !loading ? B.black : B.smoke,
              fontFamily: 'Bebas Neue, sans-serif',
              fontSize: 18,
              letterSpacing: 2,
              cursor: code.trim() && !loading ? 'pointer' : 'default',
              transition: 'all .25s',
            }}
          >
            {loading ? 'VERIFYING...' : 'ENTER DASHBOARD'}
          </button>
        </form>

        {/* Quick test chips */}
        <div style={{ display: 'flex', gap: 6, justifyContent: 'center', marginTop: 18, flexWrap: 'wrap', alignItems: 'center' }}>
          <span style={{ fontSize: 9, color: B.dim, fontFamily: 'Space Mono, monospace' }}>QUICK PASS:</span>
          {[
            { id: 'SF26-001', label: 'Sole House' },
            { id: 'SF26-002', label: 'Lagos Kicks' },
            { id: 'ADMIN', label: '⚡ Organizer Desk' },
          ].map(c => (
            <button
              key={c.id}
              type="button"
              onClick={() => setCode(c.id)}
              style={{
                background: 'rgba(255,255,255,0.06)', border: `1px solid ${c.id === 'ADMIN' ? B.neonLime + '60' : B.amber + '40'}`,
                borderRadius: 4, padding: '4px 8px', color: c.id === 'ADMIN' ? B.neonLime : B.amber,
                fontFamily: 'Space Mono, monospace', fontSize: 9, cursor: 'pointer',
              }}
            >
              {c.label}
            </button>
          ))}
        </div>

        <p style={{ marginTop: 24, fontSize: 11, color: `${B.smoke}80`, lineHeight: 1.6 }}>
          Need assistance? Email <span style={{ color: B.amber }}>sneakersfest088@gmail.com</span> with your registered brand.
        </p>
      </div>

      <p style={{ textAlign: 'center', marginTop: 16, fontSize: 11, color: `${B.smoke}50`, fontFamily: 'Space Mono, monospace' }}>
        Try code: <span style={{ color: `${B.amber}70` }}>DEMO</span> for a preview
      </p>
    </div>
  )
}

function BoothCard({ vendor }) {
  const STATUS_KEY = `sf26_vendor_setup_status_${vendor.code}`
  const [setupStatus, setSetupStatus] = useState(() => {
    try { return localStorage.getItem(STATUS_KEY) || 'EN_ROUTE' } catch { return 'EN_ROUTE' }
  })

  const STATUSES = [
    { id: 'EN_ROUTE', label: '🚚 En Route', color: B.amber },
    { id: 'UNLOADING', label: '📦 Unloading', color: B.neonCyan },
    { id: 'INSPECTION', label: '🔍 Inspection Ready', color: '#A855F7' },
    { id: 'BOOTH_LIVE', label: '🟢 Live & Open', color: B.neonLime },
  ]

  const handleStatusChange = (newStatus) => {
    setSetupStatus(newStatus)
    try { localStorage.setItem(STATUS_KEY, newStatus) } catch {}
    dispatchFestivalAction(FESTIVAL_ACTIONS.VENDOR_STATUS_TRANSITION, {
      code: vendor.code,
      name: vendor.name,
      status: newStatus,
      action: `Vendor ${vendor.name} transitioned to ${newStatus}`,
    })
    playFestivalSound(newStatus === 'BOOTH_LIVE' ? 'badge_unlock' : 'zone_click')
  }

  const currentStatusObj = STATUSES.find(s => s.id === setupStatus) || STATUSES[0]

  return (
    <div style={{
      border: `1px solid ${B.amber}35`,
      background: `linear-gradient(135deg, ${B.charcoal} 0%, ${B.gunmetal}80 100%)`,
      borderRadius: 16, padding: 28,
      position: 'relative', overflow: 'hidden',
    }}>
      <div style={{
        position: 'absolute', top: 0, right: 0,
        width: 120, height: 120,
        background: `radial-gradient(circle, ${B.amber}15 0%, transparent 70%)`,
        pointerEvents: 'none',
      }} />
      <p style={{ fontFamily: 'Orbitron, sans-serif', fontSize: 10, letterSpacing: 3, color: B.amber, marginBottom: 12 }}>BOOTH ASSIGNMENT</p>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 16, marginBottom: 20 }}>
        <span style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: 64, letterSpacing: 2, color: B.amber, lineHeight: 1 }}>
          {vendor.booth}
        </span>
        <div>
          <p style={{ fontSize: 15, fontWeight: 600, color: B.white, marginBottom: 2 }}>{vendor.name}</p>
          <p style={{ fontSize: 12, color: B.smoke }}>{vendor.zone}</p>
        </div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(90px, 1fr))', gap: 12 }}>
        {[
          { label: 'SETUP CALL', val: vendor.setup },
          { label: 'TABLES', val: vendor.tables },
          { label: 'SPACE', val: `${vendor.sqm}sqm` },
        ].map(({ label, val }) => (
          <div key={label} style={{
            background: `${B.void}`, borderRadius: 8, padding: '10px 12px',
            border: `1px solid ${B.amber}20`,
          }}>
            <p style={{ fontSize: 9, letterSpacing: 2, color: B.smoke, marginBottom: 4, fontFamily: 'Space Mono, monospace' }}>{label}</p>
            <p style={{ fontSize: 18, fontFamily: 'Bebas Neue, sans-serif', color: B.white, letterSpacing: 1 }}>{val}</p>
          </div>
        ))}
      </div>
      <div style={{
        marginTop: 16, background: `${B.amber}10`, border: `1px solid ${B.amber}25`,
        borderRadius: 8, padding: '10px 14px', display: 'flex', alignItems: 'center', gap: 10,
      }}>
        <span style={{ fontSize: 16 }}>|*|</span>
        <div>
          <p style={{ fontSize: 11, color: B.amberGlow, fontWeight: 600, marginBottom: 2 }}>Category: {vendor.category}</p>
          <p style={{ fontSize: 11, color: B.smoke }}>Doors open 12 PM — Vendor entry from {vendor.setup}</p>
        </div>
      </div>

      {/* Booth Setup Lifecycle Tracker */}
      <div style={{
        marginTop: 20, padding: '16px 20px', borderRadius: 12,
        background: 'rgba(0,0,0,0.3)', border: `1px solid ${currentStatusObj.color}40`,
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12, flexWrap: 'wrap', gap: 8 }}>
          <p style={{ fontFamily: 'Orbitron, sans-serif', fontSize: 10, letterSpacing: 2, color: currentStatusObj.color }}>
            LIVE BOOTH READINESS
          </p>
          <span style={{
            fontFamily: 'Space Mono, monospace', fontSize: 9,
            color: currentStatusObj.color, background: `${currentStatusObj.color}15`,
            border: `1px solid ${currentStatusObj.color}50`, borderRadius: 4, padding: '3px 8px',
            fontWeight: 700,
          }}>
            {currentStatusObj.label.toUpperCase()}
          </span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(110px, 1fr))', gap: 8 }}>
          {STATUSES.map(st => {
            const isCurrent = setupStatus === st.id
            return (
              <button
                key={st.id}
                onClick={() => handleStatusChange(st.id)}
                style={{
                  background: isCurrent ? `${st.color}25` : 'rgba(255,255,255,0.03)',
                  border: `1px solid ${isCurrent ? st.color : 'rgba(255,255,255,0.08)'}`,
                  borderRadius: 6, padding: '8px 10px',
                  color: isCurrent ? B.white : B.smoke,
                  fontFamily: 'Space Mono, monospace', fontSize: 9,
                  cursor: 'pointer', transition: 'all 0.2s', textAlign: 'center',
                }}
              >
                {st.label}
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}

function ProfileTab({ vendor }) {
  const STORAGE_KEY = `sf26_vendor_profile_${vendor.code}`
  const saved = (() => { try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null') } catch { return null } })()

  const [form, setForm] = useState({
    instagram: saved?.instagram || '',
    twitter: saved?.twitter || '',
    website: saved?.website || '',
    bio: saved?.bio || '',
    specials: saved?.specials || '',
    acceptCard: saved?.acceptCard ?? true,
    acceptTransfer: saved?.acceptTransfer ?? true,
    acceptCash: saved?.acceptCash ?? true,
    optOutPhoto: saved?.optOutPhoto ?? false,
  })
  const [saved2, setSaved2] = useState(false)

  function save() {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(form)) } catch {}
    setSaved2(true)
    setTimeout(() => setSaved2(false), 2500)
  }

  const inputStyle = (val) => ({
    background: B.gunmetal,
    border: `1px solid ${B.amber}25`,
    borderRadius: 8, padding: '11px 14px',
    color: B.white, fontSize: 13, width: '100%',
    fontFamily: 'Inter, sans-serif', outline: 'none',
  })

  const checkRow = (label, key) => (
    <label key={key} style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', padding: '8px 0' }}>
      <div
        onClick={() => setForm(f => ({ ...f, [key]: !f[key] }))}
        style={{
          width: 20, height: 20, borderRadius: 4,
          border: `2px solid ${form[key] ? B.amber : B.smoke}50`,
          background: form[key] ? `${B.amber}20` : 'transparent',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          cursor: 'pointer', flexShrink: 0, transition: 'all .2s',
        }}
      >
        {form[key] && <span style={{ color: B.amber, fontSize: 12, lineHeight: 1 }}>v</span>}
      </div>
      <span style={{ fontSize: 13, color: B.white }}>{label}</span>
    </label>
  )

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
      <div>
        <p style={{ fontFamily: 'Orbitron, sans-serif', fontSize: 10, letterSpacing: 3, color: B.amber, marginBottom: 16 }}>STALL PROFILE</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 12 }}>
            {[['@Instagram', 'instagram'], ['X / Twitter', 'twitter']].map(([label, key]) => (
              <div key={key}>
                <p style={{ fontSize: 11, color: B.smoke, marginBottom: 6 }}>{label}</p>
                <input aria-label={label} style={inputStyle(form[key])} value={form[key]} onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))} placeholder={`@handle`} />
              </div>
            ))}
          </div>
          <div>
            <p style={{ fontSize: 11, color: B.smoke, marginBottom: 6 }}>Website / Linktree</p>
            <input aria-label="Website or Linktree" style={inputStyle(form.website)} value={form.website} onChange={e => setForm(f => ({ ...f, website: e.target.value }))} placeholder="https://..." />
          </div>
          <div>
            <p style={{ fontSize: 11, color: B.smoke, marginBottom: 6 }}>Brand bio (max 160 chars)</p>
            <textarea aria-label="Brand bio"
              maxLength={160}
              rows={3}
              value={form.bio}
              onChange={e => setForm(f => ({ ...f, bio: e.target.value }))}
              placeholder="Tell attendees what makes your stall unique..."
              style={{ ...inputStyle(form.bio), resize: 'vertical', lineHeight: 1.5 }}
            />
          </div>
          <div>
            <p style={{ fontSize: 11, color: B.smoke, marginBottom: 6 }}>Day-of specials / deals</p>
            <textarea aria-label="Day-of specials"
              rows={2}
              value={form.specials}
              onChange={e => setForm(f => ({ ...f, specials: e.target.value }))}
              placeholder="e.g. First 10 buyers get a free pin. 10% off bundles..."
              style={{ ...inputStyle(form.specials), resize: 'vertical', lineHeight: 1.5 }}
            />
          </div>
        </div>
      </div>

      <div>
        <p style={{ fontFamily: 'Orbitron, sans-serif', fontSize: 10, letterSpacing: 3, color: B.neonCyan, marginBottom: 12 }}>PAYMENT METHODS ACCEPTED</p>
        <div style={{ border: `1px solid ${B.gunmetal}`, borderRadius: 10, padding: '8px 16px' }}>
          {checkRow('Bank Transfer / USSD', 'acceptTransfer')}
          {checkRow('Card (POS)', 'acceptCard')}
          {checkRow('Cash (Naira)', 'acceptCash')}
        </div>
      </div>

      <div>
        <p style={{ fontFamily: 'Orbitron, sans-serif', fontSize: 10, letterSpacing: 3, color: B.smoke, marginBottom: 12 }}>PREFERENCES</p>
        <div style={{ border: `1px solid ${B.gunmetal}`, borderRadius: 10, padding: '8px 16px' }}>
          {checkRow('Opt out of attendee photography at my stall', 'optOutPhoto')}
        </div>
      </div>

      <button
        onClick={save}
        style={{
          background: saved2 ? `${B.neonLime}20` : `linear-gradient(135deg, ${B.amber}, ${B.amberDeep})`,
          border: saved2 ? `1px solid ${B.neonLime}60` : 'none',
          borderRadius: 10, padding: '13px 24px',
          color: saved2 ? B.neonLime : B.black,
          fontFamily: 'Bebas Neue, sans-serif', fontSize: 17, letterSpacing: 2,
          cursor: 'pointer', transition: 'all .3s', width: '100%',
        }}
      >
        {saved2 ? 'SAVED.' : 'SAVE PROFILE'}
      </button>
    </div>
  )
}

const LSI_BENCHMARKS = [
  { name: 'Travis Scott x AJ1 Low Mocha', price: 1850000, size: 'US 10.5' },
  { name: 'Nike Dunk Low Retro Panda', price: 280000, size: 'US 10' },
  { name: 'Air Jordan 4 Retro Bred Reimagined', price: 720000, size: 'US 11' },
  { name: 'Wales Bonner x adidas Samba Silver', price: 490000, size: 'US 9.5' },
  { name: 'Nike Air Force 1 07 Triple White', price: 165000, size: 'US 10' },
]

function ProductsTab({ vendor }) {
  const STORAGE_KEY = `sf26_vendor_products_${vendor.code}`
  const SALES_KEY = `sf26_vendor_sales_${vendor.code}`
  const load = () => { try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]') } catch { return [] } }
  const loadSales = () => { try { return Number(localStorage.getItem(SALES_KEY) || 0) } catch { return 0 } }
  
  const [products, setProducts] = useState(load)
  const [totalSales, setTotalSales] = useState(loadSales)
  const [form, setForm] = useState({ name: '', size: '', price: '', condition: 'DS', qty: 1, isLsiPegged: false })
  const [adding, setAdding] = useState(false)
  const [checkoutProduct, setCheckoutProduct] = useState(null)
  const [posSuccess, setPosSuccess] = useState(false)

  function addProduct() {
    if (!form.name.trim() || !form.price) return
    const updated = [...products, { ...form, id: Date.now(), price: Number(form.price), qty: Number(form.qty) }]
    setProducts(updated)
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(updated)) } catch {}
    setForm({ name: '', size: '', price: '', condition: 'DS', qty: 1, isLsiPegged: false })
    setAdding(false)
    playFestivalSound('button_click')
  }

  function remove(id) {
    const updated = products.filter(p => p.id !== id)
    setProducts(updated)
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(updated)) } catch {}
  }

  function handleSell(product) {
    if (product.qty <= 0) return
    const updated = products.map(p => {
      if (p.id === product.id) {
        return { ...p, qty: p.qty - 1 }
      }
      return p
    })
    setProducts(updated)
    const newSales = totalSales + Number(product.price)
    setTotalSales(newSales)
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
      localStorage.setItem(SALES_KEY, String(newSales))
    } catch {}
    dispatchFestivalAction('VENDOR_ITEM_SOLD', {
      vendor: vendor.name,
      item: product.name,
      amount: product.price,
    })
    playFestivalSound('badge_unlock')
    setPosSuccess(true)
    setTimeout(() => {
      setPosSuccess(false)
      setCheckoutProduct(null)
    }, 1800)
  }

  const CONDITIONS = ['DS', 'VNDS', '9/10', '8/10', 'WORN']

  const totalValue = products.reduce((acc, p) => acc + (p.price * (p.qty || 1)), 0)
  const totalUnits = products.reduce((acc, p) => acc + (p.qty || 0), 0)
  const lsiPeggedCount = products.filter(p => p.isLsiPegged).length

  const iStyle = {
    background: B.gunmetal, border: `1px solid ${B.amber}20`,
    borderRadius: 8, padding: '10px 12px',
    color: B.white, fontSize: 13, outline: 'none', width: '100%',
    fontFamily: 'Inter, sans-serif',
  }

  return (
    <div>
      {/* Sales & Inventory Metrics Strip */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: 10, marginBottom: 20 }}>
        {[
          { label: 'BOOTH SALES REVENUE', val: `₦${totalSales.toLocaleString('en-NG')}`, color: B.neonLime },
          { label: 'INVENTORY VALUATION', val: `₦${totalValue.toLocaleString('en-NG')}`, color: B.amber },
          { label: 'TOTAL UNITS IN STOCK', val: totalUnits, color: B.white },
          { label: 'LSI PEGGED ASSETS', val: `${lsiPeggedCount} Items`, color: B.neonCyan },
        ].map(m => (
          <div key={m.label} style={{ background: B.void, border: `1px solid rgba(255,255,255,0.08)`, borderRadius: 10, padding: '12px 14px' }}>
            <p style={{ fontFamily: 'Space Mono, monospace', fontSize: 8, color: B.dim, letterSpacing: 1.5, marginBottom: 4 }}>{m.label}</p>
            <p style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: 20, color: m.color, letterSpacing: 1, margin: 0 }}>{m.val}</p>
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, flexWrap: 'wrap', gap: 10 }}>
        <div>
          <p style={{ fontFamily: 'Orbitron, sans-serif', fontSize: 10, letterSpacing: 3, color: B.amber, marginBottom: 4 }}>PRODUCT LISTING</p>
          <p style={{ fontSize: 12, color: B.smoke }}>{products.length} item{products.length !== 1 ? 's' : ''} listed</p>
        </div>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <a
            href="#lagos-sole-index"
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 4,
              color: B.neonLime, fontFamily: 'Space Mono, monospace', fontSize: 9,
              textDecoration: 'none', background: `${B.neonLime}12`, border: `1px solid ${B.neonLime}40`,
              borderRadius: 6, padding: '6px 10px',
            }}
          >
            📈 LSI Index Quotes →
          </a>
          {!adding && (
            <button
              onClick={() => setAdding(true)}
              style={{
                background: `${B.amber}15`, border: `1px solid ${B.amber}40`,
                borderRadius: 8, padding: '8px 16px',
                color: B.amber, fontSize: 13, fontWeight: 600, cursor: 'pointer',
              }}
            >
              + Add Item
            </button>
          )}
        </div>
      </div>

      {adding && (
        <div style={{
          border: `1px solid ${B.amber}30`, borderRadius: 12, padding: 20,
          background: `${B.charcoal}`, marginBottom: 20,
        }}>
          <p style={{ fontSize: 12, color: B.amber, marginBottom: 12, fontFamily: 'Space Mono, monospace', letterSpacing: 1 }}>NEW ITEM</p>

          {/* Quick LSI Pegging Strip */}
          <div style={{ marginBottom: 14, padding: '10px 12px', background: 'rgba(0,0,0,0.3)', borderRadius: 8, border: `1px solid ${B.neonLime}30` }}>
            <span style={{ fontSize: 9, color: B.neonLime, fontFamily: 'Space Mono, monospace', letterSpacing: 1 }}>
              ⚡ PEG TO LAGOS SOLE INDEX (LSI BENCHMARK):
            </span>
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 8 }}>
              {LSI_BENCHMARKS.map(bench => (
                <button
                  key={bench.name}
                  type="button"
                  onClick={() => {
                    setForm({
                      name: bench.name,
                      size: bench.size,
                      price: bench.price,
                      condition: 'DS',
                      qty: 1,
                      isLsiPegged: true,
                    })
                    playFestivalSound('zone_click')
                  }}
                  style={{
                    background: 'rgba(255,255,255,0.04)',
                    border: `1px solid ${B.neonLime}50`,
                    borderRadius: 4, padding: '4px 8px',
                    color: B.neonLime,
                    fontFamily: 'Space Mono, monospace', fontSize: 8, cursor: 'pointer',
                  }}
                >
                  📈 {bench.name.split(' ')[0]} {bench.name.split(' ')[1]} (₦{(bench.price/1000).toFixed(0)}K)
                </button>
              ))}
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <input aria-label="Product name or model" style={iStyle} placeholder="Product name / model" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value, isLsiPegged: false }))} />
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(90px, 1fr))', gap: 10 }}>
              <input aria-label="Size" style={iStyle} placeholder="Size" value={form.size} onChange={e => setForm(f => ({ ...f, size: e.target.value }))} />
              <input aria-label="Price in naira" style={iStyle} placeholder="Price (NGN)" type="number" value={form.price} onChange={e => setForm(f => ({ ...f, price: e.target.value }))} />
              <input aria-label="Quantity" style={iStyle} placeholder="Qty" type="number" min="1" value={form.qty} onChange={e => setForm(f => ({ ...f, qty: e.target.value }))} />
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              {CONDITIONS.map(c => (
                <button
                  key={c}
                  onClick={() => setForm(f => ({ ...f, condition: c }))}
                  style={{
                    flex: 1, padding: '8px 0', borderRadius: 6, cursor: 'pointer', fontSize: 11, fontFamily: 'Space Mono, monospace',
                    border: `1px solid ${form.condition === c ? B.amber : B.gunmetal}`,
                    background: form.condition === c ? `${B.amber}20` : 'transparent',
                    color: form.condition === c ? B.amber : B.smoke,
                    transition: 'all .15s',
                  }}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>
          <div style={{ display: 'flex', gap: 10, marginTop: 14 }}>
            <button onClick={() => setAdding(false)} style={{ flex: 1, padding: '10px', border: `1px solid ${B.smoke}30`, borderRadius: 8, background: 'none', color: B.smoke, cursor: 'pointer', fontSize: 13 }}>Cancel</button>
            <button onClick={addProduct} style={{ flex: 2, padding: '10px', border: 'none', borderRadius: 8, background: `linear-gradient(135deg, ${B.amber}, ${B.amberDeep})`, color: B.black, cursor: 'pointer', fontSize: 14, fontFamily: 'Bebas Neue, sans-serif', letterSpacing: 1 }}>ADD ITEM</button>
          </div>
        </div>
      )}

      {products.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '40px 20px', border: `1px dashed ${B.smoke}30`, borderRadius: 12 }}>
          <p style={{ fontSize: 32, marginBottom: 12 }}>|_|</p>
          <p style={{ color: B.smoke, fontSize: 13 }}>No items listed yet. Add products to prepare your stall inventory.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {products.map(p => (
            <div key={p.id} style={{
              display: 'flex', alignItems: 'center', gap: 12,
              background: B.charcoal, border: `1px solid ${p.qty <= 0 ? 'rgba(239,68,68,0.3)' : B.gunmetal}`,
              borderRadius: 10, padding: '12px 16px', opacity: p.qty <= 0 ? 0.6 : 1, flexWrap: 'wrap',
            }}>
              <div style={{
                width: 36, height: 36, borderRadius: 8, background: `${B.amber}15`,
                border: `1px solid ${B.amber}25`, flexShrink: 0,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 10, color: B.amber, fontFamily: 'Space Mono, monospace',
              }}>
                {p.condition}
              </div>
              <div style={{ flex: '1 1 200px', minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <p style={{ fontSize: 13, fontWeight: 600, color: B.white, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', margin: 0 }}>{p.name}</p>
                  {p.isLsiPegged && (
                    <span style={{
                      fontFamily: 'Orbitron, monospace', fontSize: 7, color: B.neonLime,
                      background: `${B.neonLime}15`, border: `1px solid ${B.neonLime}50`,
                      borderRadius: 3, padding: '1px 5px', flexShrink: 0,
                    }}>
                      LSI PEGGED
                    </span>
                  )}
                  {p.qty <= 0 && (
                    <span style={{
                      fontFamily: 'Orbitron, monospace', fontSize: 7, color: '#EF4444',
                      background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.4)',
                      borderRadius: 3, padding: '1px 5px', flexShrink: 0,
                    }}>
                      SOLD OUT
                    </span>
                  )}
                </div>
                <p style={{ fontSize: 11, color: B.smoke, marginTop: 4, margin: 0 }}>
                  {p.size && `Size ${p.size}  ·  `}Stock: <strong>{p.qty}</strong> left
                </p>
              </div>

              <div style={{ textAlign: 'right', flexShrink: 0, marginRight: 8 }}>
                <p style={{ fontSize: 14, fontFamily: 'Space Mono, monospace', color: B.amberGlow, margin: 0 }}>
                  ₦{Number(p.price).toLocaleString('en-NG')}
                </p>
                <p style={{ fontSize: 9, color: B.smoke, margin: 0 }}>CASH / TRANSFER</p>
              </div>

              {/* Action Buttons: Instant POS Checkout & Quick Sell */}
              <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                <button
                  disabled={p.qty <= 0}
                  onClick={() => {
                    setCheckoutProduct(p)
                    playFestivalSound('button_click')
                  }}
                  style={{
                    background: p.qty > 0 ? `${B.neonLime}15` : 'rgba(255,255,255,0.03)',
                    border: `1px solid ${p.qty > 0 ? B.neonLime + '60' : 'rgba(255,255,255,0.1)'}`,
                    borderRadius: 6, padding: '6px 10px',
                    color: p.qty > 0 ? B.neonLime : B.dim,
                    fontFamily: 'Space Mono, monospace', fontSize: 9, cursor: p.qty > 0 ? 'pointer' : 'default',
                    fontWeight: 700,
                  }}
                >
                  💳 QR CHECKOUT
                </button>

                <button
                  disabled={p.qty <= 0}
                  onClick={() => handleSell(p)}
                  style={{
                    background: p.qty > 0 ? `${B.amber}15` : 'transparent',
                    border: `1px solid ${p.qty > 0 ? B.amber + '50' : 'rgba(255,255,255,0.1)'}`,
                    borderRadius: 6, padding: '6px 10px',
                    color: p.qty > 0 ? B.amber : B.dim,
                    fontFamily: 'Space Mono, monospace', fontSize: 9, cursor: p.qty > 0 ? 'pointer' : 'default',
                  }}
                >
                  [-] 1 SOLD
                </button>

                <button
                  onClick={() => remove(p.id)}
                  style={{
                    background: 'none', border: 'none', color: `${B.neonMagenta}60`,
                    cursor: 'pointer', padding: '4px 6px', fontSize: 13, flexShrink: 0,
                  }}
                >
                  x
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* POS / Cashless QR Payment Modal */}
      {checkoutProduct && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 9999, padding: 20, backdropFilter: 'blur(8px)',
        }}>
          <div style={{
            background: B.charcoal, border: `2px solid ${B.neonLime}`,
            borderRadius: 16, maxWidth: 440, width: '100%', padding: '28px 24px',
            textAlign: 'center', position: 'relative', boxShadow: `0 20px 60px ${B.neonLime}25`,
          }}>
            <button
              onClick={() => setCheckoutProduct(null)}
              style={{ position: 'absolute', top: 14, right: 16, background: 'none', border: 'none', color: B.smoke, fontSize: 18, cursor: 'pointer' }}
            >
              ✕
            </button>

            <span style={{ fontFamily: 'Orbitron, monospace', fontSize: 9, letterSpacing: 2, color: B.neonLime }}>
              SNEAKERS FEST '26 · LIVE POS TERMINAL
            </span>
            <h3 style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: 28, color: B.white, letterSpacing: 1, margin: '8px 0 2px' }}>
              {checkoutProduct.name}
            </h3>
            <p style={{ fontFamily: 'Space Mono, monospace', fontSize: 10, color: B.smoke, marginBottom: 16 }}>
              Size: {checkoutProduct.size || 'Standard'} · Stall: {vendor.booth} ({vendor.name})
            </p>

            <div style={{
              background: '#08080C', border: `1px solid ${B.neonLime}40`,
              borderRadius: 12, padding: '16px', marginBottom: 16,
            }}>
              <p style={{ fontFamily: 'Space Mono, monospace', fontSize: 9, color: B.dim, marginBottom: 4 }}>TOTAL DUE</p>
              <p style={{ fontFamily: 'Orbitron, monospace', fontSize: 26, fontWeight: 900, color: B.neonLime, margin: 0 }}>
                ₦{Number(checkoutProduct.price).toLocaleString('en-NG')}
              </p>
            </div>

            {/* Generated QR Pattern */}
            <div style={{
              background: '#FFF', borderRadius: 12, padding: 16, display: 'inline-block',
              margin: '0 auto 16px', border: `4px solid ${B.neonLime}`,
            }}>
              <svg width="140" height="140" viewBox="0 0 100 100">
                <rect width="100" height="100" fill="#FFF" />
                <rect x="10" y="10" width="25" height="25" fill="#000" />
                <rect x="15" y="15" width="15" height="15" fill="#FFF" />
                <rect x="19" y="19" width="7" height="7" fill="#000" />
                <rect x="65" y="10" width="25" height="25" fill="#000" />
                <rect x="70" y="15" width="15" height="15" fill="#FFF" />
                <rect x="74" y="19" width="7" height="7" fill="#000" />
                <rect x="10" y="65" width="25" height="25" fill="#000" />
                <rect x="15" y="70" width="15" height="15" fill="#FFF" />
                <rect x="19" y="74" width="7" height="7" fill="#000" />
                <rect x="45" y="15" width="10" height="20" fill="#000" />
                <rect x="40" y="45" width="20" height="10" fill="#000" />
                <rect x="65" y="45" width="10" height="20" fill="#000" />
                <rect x="45" y="65" width="20" height="20" fill="#000" />
                <rect x="75" y="75" width="15" height="15" fill="#000" />
              </svg>
            </div>

            <p style={{ fontFamily: 'Space Mono, monospace', fontSize: 9, color: B.smoke, marginBottom: 16, lineHeight: 1.5 }}>
              Scan with Bank App or transfer to:<br />
              <strong style={{ color: B.white }}>Zenith Bank · 101-SF26-ESCROW</strong><br />
              Ref: <span style={{ color: B.amber }}>{vendor.booth}-{checkoutProduct.id}</span>
            </p>

            <button
              onClick={() => handleSell(checkoutProduct)}
              disabled={posSuccess}
              style={{
                width: '100%', padding: '14px', borderRadius: 8,
                background: posSuccess ? B.neonLime : `linear-gradient(135deg, ${B.neonLime}, #16a34a)`,
                border: 'none', color: B.black, fontFamily: 'Bebas Neue, sans-serif',
                fontSize: 18, letterSpacing: 1.5, cursor: 'pointer', transition: 'all 0.2s',
              }}
            >
              {posSuccess ? '✓ PAYMENT CONFIRMED! INVENTORY UPDATED' : '✓ CONFIRM RECEIVED PAYMENT & RECORD SALE'}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

function ScheduleTab() {
  const typeColor = { vendor: B.amber, public: B.neonCyan, vip: B.electricPurple }
  const typeLabel = { vendor: 'VENDOR', public: 'PUBLIC', vip: 'VIP+' }
  return (
    <div>
      <p style={{ fontFamily: 'Orbitron, sans-serif', fontSize: 10, letterSpacing: 3, color: B.amber, marginBottom: 4 }}>DAY-OF SCHEDULE</p>
      <p style={{ fontSize: 12, color: B.smoke, marginBottom: 24 }}>December 12, 2026 — Muri Okunola Park, Victoria Island, Lagos</p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
        {VENDOR_SCHEDULE.map((item, i) => (
          <div key={i} style={{ display: 'flex', gap: 16, paddingBottom: 0 }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0, width: 24 }}>
              <div style={{ width: 10, height: 10, borderRadius: '50%', background: typeColor[item.type], flexShrink: 0, marginTop: 16 }} />
              {i < VENDOR_SCHEDULE.length - 1 && <div style={{ width: 1, flex: 1, background: `${B.gunmetal}`, minHeight: 24, marginTop: 4 }} />}
            </div>
            <div style={{
              flex: 1, padding: '12px 0',
              borderBottom: i < VENDOR_SCHEDULE.length - 1 ? `1px solid ${B.gunmetal}` : 'none',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
                <span style={{ fontSize: 12, fontFamily: 'Space Mono, monospace', color: B.white, fontWeight: 700 }}>{item.time}</span>
                <span style={{
                  fontSize: 8, letterSpacing: 2, fontFamily: 'Orbitron, monospace',
                  color: typeColor[item.type], border: `1px solid ${typeColor[item.type]}40`,
                  padding: '2px 6px', borderRadius: 4,
                }}>{typeLabel[item.type]}</span>
              </div>
              <p style={{ fontSize: 13, color: B.smoke, lineHeight: 1.4 }}>{item.event}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function ChecklistTab() {
  const STORAGE_KEY = 'sf26_vendor_checklist'
  const load = () => { try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}') } catch { return {} } }
  const [checked, setChecked] = useState(load)

  function toggle(item) {
    const updated = { ...checked, [item]: !checked[item] }
    setChecked(updated)
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(updated)) } catch {}
  }

  const done = CHECKLIST_ITEMS.filter(i => checked[i]).length
  const pct = Math.round((done / CHECKLIST_ITEMS.length) * 100)

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 20 }}>
        <div>
          <p style={{ fontFamily: 'Orbitron, sans-serif', fontSize: 10, letterSpacing: 3, color: B.amber, marginBottom: 4 }}>PACK CHECKLIST</p>
          <p style={{ fontSize: 12, color: B.smoke }}>Essentials for event day</p>
        </div>
        <div style={{ textAlign: 'right' }}>
          <p style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: 36, color: pct === 100 ? B.neonLime : B.amber, letterSpacing: 2, lineHeight: 1 }}>{pct}%</p>
          <p style={{ fontSize: 10, color: B.smoke }}>{done}/{CHECKLIST_ITEMS.length} packed</p>
        </div>
      </div>

      <div style={{
        height: 4, background: B.gunmetal, borderRadius: 2, marginBottom: 24, overflow: 'hidden',
      }}>
        <div style={{
          height: '100%', borderRadius: 2, transition: 'width .4s',
          width: `${pct}%`,
          background: pct === 100 ? B.neonLime : `linear-gradient(90deg, ${B.amber}, ${B.amberGlow})`,
        }} />
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        {CHECKLIST_ITEMS.map(item => (
          <div
            key={item}
            onClick={() => toggle(item)}
            style={{
              display: 'flex', alignItems: 'center', gap: 14, padding: '13px 16px',
              background: checked[item] ? `${B.neonLime}08` : B.charcoal,
              border: `1px solid ${checked[item] ? B.neonLime + '25' : B.gunmetal}`,
              borderRadius: 10, cursor: 'pointer', transition: 'all .2s',
            }}
          >
            <div style={{
              width: 22, height: 22, borderRadius: 6, flexShrink: 0,
              border: `2px solid ${checked[item] ? B.neonLime : B.smoke}40`,
              background: checked[item] ? `${B.neonLime}20` : 'transparent',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              transition: 'all .2s',
            }}>
              {checked[item] && <span style={{ color: B.neonLime, fontSize: 12 }}>v</span>}
            </div>
            <span style={{
              fontSize: 13, color: checked[item] ? `${B.smoke}80` : B.white,
              textDecoration: checked[item] ? 'line-through' : 'none',
              transition: 'all .2s',
            }}>{item}</span>
          </div>
        ))}
      </div>

      {pct === 100 && (
        <div style={{
          marginTop: 20, padding: 20, textAlign: 'center',
          background: `${B.neonLime}10`, border: `1px solid ${B.neonLime}30`, borderRadius: 12,
        }}>
          <p style={{ fontSize: 22, fontFamily: 'Bebas Neue, sans-serif', letterSpacing: 2, color: B.neonLime }}>YOU ARE READY.</p>
          <p style={{ fontSize: 12, color: B.smoke, marginTop: 4 }}>See you at Muri Okunola Park, December 12.</p>
        </div>
      )}
    </div>
  )
}

function RulesTab() {
  return (
    <div>
      <p style={{ fontFamily: 'Orbitron, sans-serif', fontSize: 10, letterSpacing: 3, color: B.amber, marginBottom: 20 }}>VENDOR RULES & CODE OF CONDUCT</p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {RULES.map((rule, i) => (
          <div key={i} style={{
            display: 'flex', gap: 14, padding: '14px 18px',
            background: B.charcoal, border: `1px solid ${B.gunmetal}`,
            borderRadius: 10,
          }}>
            <span style={{
              fontFamily: 'Bebas Neue, sans-serif', fontSize: 22, color: B.amber,
              opacity: 0.4, flexShrink: 0, lineHeight: 1, marginTop: 2,
            }}>
              {String(i + 1).padStart(2, '0')}
            </span>
            <p style={{ fontSize: 13, color: B.smoke, lineHeight: 1.6 }}>{rule}</p>
          </div>
        ))}
      </div>
      <div style={{
        marginTop: 20, padding: '16px 20px',
        background: `${B.neonMagenta}08`, border: `1px solid ${B.neonMagenta}25`, borderRadius: 12,
      }}>
        <p style={{ fontSize: 12, color: B.neonMagenta, fontWeight: 600, marginBottom: 4 }}>Violations</p>
        <p style={{ fontSize: 12, color: B.smoke, lineHeight: 1.6 }}>
          Breach of these rules may result in immediate removal from the event without refund. Disputes go to the event director at sneakersfest088@gmail.com.
        </p>
      </div>
    </div>
  )
}

function AdminDeskTab() {
  const [apps, setApps] = useState(() => {
    try {
      const saved = JSON.parse(localStorage.getItem('sf26_vendor_applications') || 'null')
      if (saved && Array.isArray(saved) && saved.length > 0) return saved
    } catch {}
    return [
      { id: 'APP-901', business: 'Sole House Lagos', contact: 'Tunde B.', phone: '+2348012345678', category: 'Resell & Deadstock', tier: 'Standard (₦150,000)', status: 'assigned', boothNumber: 'A-01', submittedAt: '2026-10-06' },
      { id: 'APP-902', business: 'Lagos Kicks Co.', contact: 'Chisom O.', phone: '+2348098765432', category: 'Customs & 1-of-1', tier: 'Double (₦280,000)', status: 'assigned', boothNumber: 'A-02', submittedAt: '2026-10-06' },
      { id: 'APP-903', business: 'The Grail Vault', contact: 'Femi A.', phone: '+2348055551212', category: 'Vintage & Archive', tier: 'Premium Corner (₦420,000)', status: 'approved', boothNumber: '', submittedAt: '2026-10-07' },
      { id: 'APP-904', business: 'Afro Kicks Studio', contact: 'Kemi S.', phone: '+2348033334444', category: 'Streetwear', tier: 'Standard (₦150,000)', status: 'invoiced', boothNumber: '', submittedAt: '2026-10-07' },
      { id: 'APP-905', business: 'Island Heat Lab', contact: 'Emeka C.', phone: '+2348077778888', category: 'Resell & Deadstock', tier: 'Brand Activation (₦750,000+)', status: 'pending', boothNumber: '', submittedAt: '2026-10-08' },
    ]
  })

  const [filter, setFilter] = useState('all')
  const [search, setSearch] = useState('')
  const [assigningId, setAssigningId] = useState(null)
  const [boothInput, setBoothInput] = useState('')

  function save(newApps) {
    setApps(newApps)
    try { localStorage.setItem('sf26_vendor_applications', JSON.stringify(newApps)) } catch {}
  }

  function handleStatus(id, newStatus, extra = {}) {
    const updated = apps.map(a => a.id === id ? { ...a, status: newStatus, ...extra, updatedAt: new Date().toISOString() } : a)
    save(updated)
    dispatchFestivalAction(FESTIVAL_ACTIONS.VENDOR_STATUS_TRANSITION, { status: newStatus, action: `Transitioned ${id} to ${newStatus}` })
    playFestivalSound('zone_click')
  }

  function submitBoothAssignment(id) {
    if (!boothInput.trim()) return
    const booth = boothInput.trim().toUpperCase()
    handleStatus(id, 'assigned', { boothNumber: booth })
    dispatchFestivalAction(FESTIVAL_ACTIONS.VENDOR_BOOTH_ASSIGNED, { booth })
    playFestivalSound('badge_unlock')
    setAssigningId(null)
    setBoothInput('')
  }

  const filtered = apps.filter(a => {
    if (filter !== 'all' && a.status !== filter) return false
    if (search.trim()) {
      const q = search.toLowerCase()
      return a.business.toLowerCase().includes(q) || a.contact.toLowerCase().includes(q) || a.id.toLowerCase().includes(q)
    }
    return true
  })

  const statusColor = {
    pending: B.amber,
    approved: B.neonCyan,
    invoiced: '#A855F7',
    assigned: B.neonLime,
    rejected: '#EF4444',
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, flexWrap: 'wrap', gap: 12 }}>
        <div>
          <p style={{ fontFamily: 'Orbitron, sans-serif', fontSize: 10, letterSpacing: 3, color: B.neonLime, marginBottom: 4 }}>ORGANIZER CONTROL DESK</p>
          <p style={{ fontSize: 12, color: B.smoke }}>Vendor Applications, Status Lifecycles & Booth Allocation</p>
        </div>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search business, contact, ID..."
            style={{ background: 'rgba(0,0,0,0.5)', border: `1px solid ${B.gunmetal}`, borderRadius: 6, padding: '7px 12px', color: B.white, fontFamily: 'Space Mono, monospace', fontSize: 10, outline: 'none' }}
          />
        </div>
      </div>

      {/* Filter tabs */}
      <div style={{ display: 'flex', gap: 6, marginBottom: 20, flexWrap: 'wrap' }}>
        {['all', 'pending', 'approved', 'invoiced', 'assigned'].map(st => (
          <button
            key={st}
            onClick={() => setFilter(st)}
            style={{
              padding: '6px 12px', borderRadius: 6,
              background: filter === st ? 'rgba(255,255,255,0.1)' : 'transparent',
              border: `1px solid ${filter === st ? B.white : B.gunmetal}`,
              color: filter === st ? B.white : B.smoke,
              fontFamily: 'Space Mono, monospace', fontSize: 9, cursor: 'pointer', textTransform: 'uppercase',
            }}
          >
            {st} ({apps.filter(a => st === 'all' || a.status === st).length})
          </button>
        ))}
      </div>

      {/* Application Cards List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {filtered.map(app => {
          const col = statusColor[app.status] || B.smoke
          const waMessage = encodeURIComponent(`Hi ${app.contact}, this is the Sneakers Fest '26 Team! Regarding your vendor application (${app.id} - ${app.business}): your status is currently ${app.status.toUpperCase()}${app.boothNumber ? ` at Booth ${app.boothNumber}` : ''}. Let's finalize your onboarding!`)
          return (
            <div
              key={app.id}
              style={{
                background: B.void, border: `1px solid ${col}35`, borderRadius: 12, padding: '16px 20px',
                position: 'relative', overflow: 'hidden',
              }}
            >
              <div style={{ position: 'absolute', top: 0, left: 16, right: 16, height: 1, background: `linear-gradient(90deg, transparent, ${col}60, transparent)` }} />

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 10, marginBottom: 10 }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: 20, color: B.white, letterSpacing: 1 }}>{app.business}</span>
                    <span style={{ fontFamily: 'Orbitron, monospace', fontSize: 8, color: col, border: `1px solid ${col}50`, borderRadius: 4, padding: '2px 6px' }}>{app.status.toUpperCase()}</span>
                    {app.boothNumber && (
                      <span style={{ fontFamily: 'Orbitron, monospace', fontSize: 8, color: B.neonLime, background: `${B.neonLime}15`, borderRadius: 4, padding: '2px 6px' }}>BOOTH {app.boothNumber}</span>
                    )}
                  </div>
                  <p style={{ fontFamily: 'Space Mono, monospace', fontSize: 10, color: B.smoke, marginTop: 4 }}>
                    Contact: {app.contact} · {app.phone} · Applied: {app.submittedAt}
                  </p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <span style={{ fontFamily: 'Space Mono, monospace', fontSize: 9, color: B.amber }}>{app.tier}</span>
                </div>
              </div>

              {/* Status Action Workflow Bar */}
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center', marginTop: 12, paddingTop: 12, borderTop: `1px solid ${B.gunmetal}` }}>
                {app.status === 'pending' && (
                  <button
                    onClick={() => handleStatus(app.id, 'approved')}
                    style={{ background: `${B.neonCyan}20`, border: `1px solid ${B.neonCyan}`, color: B.neonCyan, borderRadius: 6, padding: '6px 14px', fontFamily: 'Space Mono, monospace', fontSize: 9, cursor: 'pointer', fontWeight: 700 }}
                  >
                    ✓ APPROVE APPLICATION
                  </button>
                )}

                {(app.status === 'approved' || app.status === 'pending') && (
                  <button
                    onClick={() => handleStatus(app.id, 'invoiced', { invoiceUrl: `https://paystack.com/pay/sf26-${app.id.toLowerCase()}` })}
                    style={{ background: '#A855F720', border: '1px solid #A855F7', color: '#A855F7', borderRadius: 6, padding: '6px 14px', fontFamily: 'Space Mono, monospace', fontSize: 9, cursor: 'pointer', fontWeight: 700 }}
                  >
                    📄 ISSUE INVOICE
                  </button>
                )}

                {assigningId === app.id ? (
                  <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                    <input
                      value={boothInput}
                      onChange={e => setBoothInput(e.target.value)}
                      placeholder="e.g. A-03"
                      style={{ width: 80, background: '#111', border: `1px solid ${B.neonLime}`, borderRadius: 4, padding: '5px 8px', color: B.white, fontFamily: 'Space Mono, monospace', fontSize: 10 }}
                    />
                    <button
                      onClick={() => submitBoothAssignment(app.id)}
                      style={{ background: B.neonLime, border: 'none', color: B.black, borderRadius: 4, padding: '6px 12px', fontFamily: 'Space Mono, monospace', fontSize: 9, cursor: 'pointer', fontWeight: 700 }}
                    >
                      SAVE
                    </button>
                    <button
                      onClick={() => setAssigningId(null)}
                      style={{ background: 'transparent', border: '1px solid #333', color: B.smoke, borderRadius: 4, padding: '6px 8px', fontSize: 9, cursor: 'pointer' }}
                    >
                      ✕
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => { setAssigningId(app.id); setBoothInput(app.boothNumber || '') }}
                    style={{ background: `${B.neonLime}20`, border: `1px solid ${B.neonLime}`, color: B.neonLime, borderRadius: 6, padding: '6px 14px', fontFamily: 'Space Mono, monospace', fontSize: 9, cursor: 'pointer', fontWeight: 700 }}
                  >
                    📍 {app.boothNumber ? 'REASSIGN BOOTH' : 'ASSIGN BOOTH'}
                  </button>
                )}

                <a
                  href={`https://wa.me/${app.phone.replace(/[^0-9]/g, '')}?text=${waMessage}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ background: 'rgba(37,211,102,0.12)', border: '1px solid #25D366', color: '#25D366', borderRadius: 6, padding: '6px 14px', fontFamily: 'Space Mono, monospace', fontSize: 9, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 4 }}
                >
                  💬 WHATSAPP VENDOR →
                </a>

                {app.status !== 'rejected' && (
                  <button
                    onClick={() => handleStatus(app.id, 'rejected')}
                    style={{ background: 'transparent', border: '1px solid #555', color: '#888', borderRadius: 6, padding: '6px 12px', fontFamily: 'Space Mono, monospace', fontSize: 9, cursor: 'pointer', marginLeft: 'auto' }}
                  >
                    REJECT
                  </button>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default function VendorDashboard() {
  const [vendor, setVendor] = useState(null)
  const [tab, setTab] = useState('Booth')

  const TABS = vendor?.isAdmin
    ? ['Admin Desk', 'Booth', 'Schedule', 'Products', 'Checklist', 'Rules', 'Profile']
    : ['Booth', 'Schedule', 'Products', 'Checklist', 'Rules', 'Profile', 'Admin Desk']

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem('sf26_vendor_session') || 'null')
      if (saved && Date.now() - saved.ts < 24 * 60 * 60 * 1000) {
        const isMaster = saved.code === 'ADMIN' || saved.code === 'ORGANIZER'
        const profile = isMaster
          ? { code: 'ADMIN', name: 'Organizers Control Desk', isAdmin: true, booth: 'HQ-01', zone: 'Control Center', setup: '7:00 AM', category: 'Festival Organizer', tables: 4, sqm: 24 }
          : DEMO_VENDORS[saved.code]
        if (profile) {
          setVendor({ code: saved.code, ...profile })
          if (profile.isAdmin) setTab('Admin Desk')
        }
      }
    } catch {}
  }, [])

  function logout() {
    try { localStorage.removeItem('sf26_vendor_session') } catch {}
    setVendor(null)
    setTab('Booth')
  }

  return (
    <section id="vendor-dashboard" style={{ padding: '100px 0', background: B.void, position: 'relative', overflow: 'hidden' }}>
      <GrainOverlay />
      <ScanLines />

      <div style={{
        position: 'absolute', top: '10%', left: '50%', transform: 'translateX(-50%)',
        width: '70%', height: 300,
        background: `radial-gradient(ellipse, ${B.amber}06 0%, transparent 65%)`,
        pointerEvents: 'none',
      }} />

      <div style={{ maxWidth: 900, margin: '0 auto', padding: '0 24px', position: 'relative', zIndex: 1 }}>
        <SectionTag>VENDOR PORTAL</SectionTag>

        <div style={{ textAlign: 'center', marginBottom: 60 }}>
          <h2 style={{
            fontFamily: 'Bebas Neue, sans-serif',
            fontSize: 'clamp(44px, 8vw, 80px)',
            letterSpacing: 3,
            color: B.white,
            lineHeight: 0.95,
            marginBottom: 16,
          }}>
            VENDOR<br />
            <span style={{ color: B.amber }}>DASHBOARD</span>
          </h2>
          <p style={{ fontSize: 15, color: B.smoke, maxWidth: 500, margin: '0 auto' }}>
            Your all-in-one event briefing. Booth details, day schedule, product management, and pack checklist.
          </p>
        </div>

        {!vendor ? (
          <LoginScreen onLogin={v => { setVendor(v); if (v.isAdmin) setTab('Admin Desk') }} />
        ) : (
          <div>
            {/* Header bar */}
            <div style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              background: B.charcoal, border: `1px solid ${B.amber}30`,
              borderRadius: 12, padding: '12px 20px', marginBottom: 24, flexWrap: 'wrap', gap: 12,
            }}>
              <div>
                <p style={{ fontSize: 11, color: B.smoke, marginBottom: 2 }}>Logged in as</p>
                <p style={{ fontSize: 14, fontWeight: 600, color: B.white }}>{vendor.name}</p>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
                <a
                  href="#lagos-sole-index"
                  style={{
                    color: B.neonLime, fontFamily: 'Space Mono, monospace', fontSize: 10,
                    textDecoration: 'none', background: `${B.neonLime}15`, border: `1px solid ${B.neonLime}40`,
                    borderRadius: 6, padding: '4px 10px', display: 'inline-flex', alignItems: 'center', gap: 4,
                  }}
                >
                  📈 LSI Market
                </a>
                <a
                  href="#lsx"
                  style={{
                    color: B.amber, fontFamily: 'Space Mono, monospace', fontSize: 10,
                    textDecoration: 'none', background: `${B.amber}15`, border: `1px solid ${B.amber}40`,
                    borderRadius: 6, padding: '4px 10px', display: 'inline-flex', alignItems: 'center', gap: 4,
                  }}
                >
                  🤝 LSX Escrow
                </a>
                <span style={{
                  background: `${B.amber}15`, border: `1px solid ${B.amber}30`,
                  borderRadius: 6, padding: '4px 10px',
                  fontFamily: 'Space Mono, monospace', fontSize: 11, color: B.amber,
                }}>
                  {vendor.code}
                </span>
                <button
                  onClick={logout}
                  style={{
                    background: 'none', border: `1px solid ${B.smoke}30`,
                    borderRadius: 6, padding: '4px 12px',
                    color: B.smoke, fontSize: 12, cursor: 'pointer',
                  }}
                >
                  Logout
                </button>
              </div>
            </div>

            {/* Tabs */}
            <div style={{
              display: 'flex', gap: 4, overflowX: 'auto', paddingBottom: 4, marginBottom: 24,
              scrollbarWidth: 'none',
            }}>
              {TABS.map(t => (
                <button
                  key={t}
                  onClick={() => setTab(t)}
                  style={{
                    flexShrink: 0, padding: '9px 18px', borderRadius: 8, cursor: 'pointer',
                    border: `1px solid ${tab === t ? B.amber + '50' : B.gunmetal}`,
                    background: tab === t ? `${B.amber}15` : 'transparent',
                    color: tab === t ? B.amber : B.smoke,
                    fontFamily: 'Orbitron, sans-serif', fontSize: 10, letterSpacing: 2,
                    transition: 'all .2s',
                  }}
                >
                  {t.toUpperCase()}
                </button>
              ))}
            </div>

            {/* Tab content */}
            <div style={{
              background: B.charcoal, border: `1px solid ${B.gunmetal}`,
              borderRadius: 16, padding: 28,
            }}>
              {tab === 'Admin Desk' && <AdminDeskTab />}
              {tab === 'Booth'      && <BoothCard vendor={vendor} />}
              {tab === 'Schedule'   && <ScheduleTab />}
              {tab === 'Products'   && <ProductsTab vendor={vendor} />}
              {tab === 'Checklist'  && <ChecklistTab />}
              {tab === 'Rules'      && <RulesTab />}
              {tab === 'Profile'    && <ProfileTab vendor={vendor} />}
            </div>

            <p style={{ textAlign: 'center', marginTop: 20, fontSize: 11, color: `${B.smoke}50` }}>
              Questions? sneakersfest088@gmail.com · <span style={{ color: `${B.amber}60` }}>Sneakers Fest '26 · Dec 12, Lagos</span>
            </p>
          </div>
        )}
      </div>
    </section>
  )
}
