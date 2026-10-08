import { useState } from 'react'
import { B } from '../tokens'
import { GrainOverlay, SectionTag } from '../components/Shared'
import { SOCIAL_LINKS } from '../config'
import Egg from '../components/Egg'

// ── zone data ──────────────────────────────────────────────────────────────────
const ZONES = [
  {
    id: 'stage', short: 'MAIN STAGE', label: 'Main Stage',
    color: B.amber, x:180, y:0, w:440, h:140,
    icon:'🎤', tagline:'Where the culture peaks.',
    desc:'Live DJ sets, sneaker drop auctions, panel discussions with Lagos\' top designers, and the official SF\'26 brand announcements.',
    schedule:['12:00 — Doors open','14:00 — Panel: Future of Lagos Streetwear','18:00 — Main DJ set','21:00 — Headline drop reveal'],
    tags:['MUSIC','PANELS','DROPS'],
    category:'stage', sound:'98 dB · Live DJ', density:'92% Capacity',
  },
  {
    id: 'vip', short: 'VIP', label: 'VIP Lounge',
    color: B.neonMagenta, x:620, y:0, w:180, h:140,
    icon:'💎', tagline:'Exclusive access. No exceptions.',
    desc:'Private sneaker showcase, open bar, complimentary styling consultations, and meet-the-artist moments. VIP ticket required.',
    schedule:['All-day access','Private drop at 20:00'],
    tags:['VIP','EXCLUSIVE','BAR'],
    category:'vip', sound:'68 dB · Velvet Vibe', density:'45% Capacity', fastTrack: true,
  },
  {
    id: 'gallery', short: 'ART GALLERY', label: 'Art Gallery',
    color: B.neonCyan, x:0, y:140, w:180, h:180,
    icon:'🖼️', tagline:'Lagos on canvas.',
    desc:'Curated works from 12 Lagos-based visual artists. Prints available for purchase. All Culture Museum auction pieces on display.',
    schedule:['Open all day','Artist walk-through at 15:00'],
    tags:['ART','CULTURE','PRINTS'],
    category:'art', sound:'62 dB · Curated', density:'55% Capacity',
  },
  {
    id: 'floor', short: 'MAIN FLOOR', label: 'Main Floor',
    color:'#FFFFFF', x:180, y:140, w:440, h:180,
    icon:'👟', tagline:'The epicentre.',
    desc:'30+ curated vendor booths across footwear, streetwear, accessories, and collectibles. The beating heart of Sneakers Fest.',
    schedule:['Open 12:00 — 22:00','Peak crowd: 16:00 — 20:00'],
    tags:['VENDORS','TRADE','BROWSE'],
    category:'vendors', sound:'84 dB · Buzzing', density:'88% Capacity',
  },
  {
    id: 'museum', short: 'MUSEUM', label: 'Culture Museum',
    color: B.neonMagenta, x:620, y:140, w:180, h:180,
    icon:'🏛️', tagline:'Bid for the culture.',
    desc:'8 exclusive digital artworks from Lagos creatives on live auction. Highest bids placed via the website go home with the piece. Closes at event end.',
    schedule:['Viewing all day','Auction closes 21:30'],
    tags:['AUCTION','ART','DIGITAL'],
    category:'vip', sound:'70 dB · Auction Room', density:'60% Capacity',
  },
  {
    id: 'vendor_w', short: 'VENDORS W', label: 'Vendor Hall West',
    color: B.neonLime, x:0, y:320, w:180, h:120,
    icon:'🛍️', tagline:'Verified vendor zone.',
    desc:'West wing vendor hall. Deadstock, rare collabs, custom kicks, and Lagos streetwear labels.',
    schedule:['Open 12:00 — 21:30'],
    tags:['DEADSTOCK','CUSTOMS','STREETWEAR'],
    category:'vendors', sound:'78 dB · Marketplace', density:'75% Capacity',
  },
  {
    id: 'photo', short: 'PHOTO BOOTH', label: 'Photo Booth Alley',
    color: B.neonCyan, x:180, y:320, w:440, h:120,
    icon:'📸', tagline:'Make your moment.',
    desc:'Four themed photo installations inspired by Lagos streetwear decades. Print on-site in 90 seconds. SF\'26 hype card moments guaranteed.',
    schedule:['Open all day','Queue expected 16:00 — 19:00'],
    tags:['PHOTO','PRINT','CONTENT'],
    category:'art', sound:'74 dB · Hype Photos', density:'80% Capacity',
  },
  {
    id: 'care', short: 'SNEAKER CARE', label: 'Sneaker Care Station',
    color: B.amber, x:620, y:320, w:180, h:120,
    icon:'✨', tagline:'Keep your grails fresh.',
    desc:'On-site cleaning, restoration, re-lacing, and sole protection. RESHOEVN8R and Jason Markk professionals on deck all day.',
    schedule:['Open 12:00 — 21:00','Walk-ins only'],
    tags:['CLEANING','CARE','RESTORE'],
    category:'care', sound:'66 dB · Restoration Lab', density:'50% Capacity',
  },
  {
    id: 'food', short: 'FOOD COURT', label: 'Food Court',
    color: B.neonLime, x:0, y:440, w:180, h:120,
    icon:'🍽️', tagline:'Lagos eats, elevated.',
    desc:'Street food meets curated dining. Jollof station, suya grill, cold drinks, and specialty Lagos bites from 8 vendors.',
    schedule:['Open 12:00 — 22:00'],
    tags:['FOOD','DRINKS','VIBES'],
    category:'food', sound:'80 dB · Terrace Vibes', density:'70% Capacity',
  },
  {
    id: 'entrance', short: 'ENTRANCE', label: 'Entrance & Registration',
    color: B.amber, x:180, y:440, w:440, h:120,
    icon:'🎟️', tagline:'Your journey starts here.',
    desc:'Show your QR ticket at the gate. Collect your wristband, festival tote, and event guide. Early bird guests enter from 11:30 AM.',
    schedule:['Early bird entry 11:30 AM','General entry 12:00 PM','Last entry 20:00'],
    tags:['TICKETS','ENTRY','WRISTBAND'],
    category:'entry', sound:'76 dB · Gate Chime', density:'Fast Moving', entry: true,
  },
  {
    id: 'workshop', short: 'WORKSHOP', label: 'Workshop Zone',
    color: B.neonCyan, x:620, y:440, w:180, h:120,
    icon:'🎨', tagline:'Learn the craft.',
    desc:'Sneaker customisation masterclasses, lacing tutorials, and brand activation sessions. Limited seats — claim at the info desk.',
    schedule:['Sessions at 13:00, 15:00, 17:00','Walk-in only'],
    tags:['WORKSHOP','CUSTOM','LEARN'],
    category:'care', sound:'64 dB · Studio Calm', density:'Limited Seats',
  },
]

const TRANSPORT = [
  {
    icon: '🚗',
    title: 'BY CAR',
    desc: 'Exit at Falomo Bridge, enter via Adeola Odeku Street. Paid parking available at nearby malls from ₦1,000/hr. Arrive before 2PM to beat traffic.',
  },
  {
    icon: '🚕',
    title: 'RIDE-HAILING',
    desc: 'Bolt and Uber drop-offs at the main gate on Adeola Odeku. Pre-book your return — demand surges after 9PM. Allow extra wait time.',
  },
  {
    icon: '🚌',
    title: 'BY BUS',
    desc: 'BRT from CMS Terminal to Victoria Island. Alight at VI Terminal then take a short keke or walk to the park. Cheapest option.',
  },
  {
    icon: '🚢',
    title: 'BY BOAT',
    desc: 'Ferry from Five Cowries Terminal, Ikoyi. Scenic 8-minute ride. Last return ferry departs 11:00 PM. Book early at the jetty.',
  },
]

// ── small SVG vendor-dot grid inside main floor ────────────────────────────────
function BoothGrid() {
  const dots = []
  for (let row = 0; row < 4; row++) {
    for (let col = 0; col < 9; col++) {
      dots.push({ x: 213 + col * 46, y: 162 + row * 40 })
    }
  }
  return (
    <>
      {dots.map((d, i) => (
        <rect key={i} x={d.x} y={d.y} width={10} height={10} rx={1}
          fill="rgba(255,255,255,0.06)" stroke="rgba(255,255,255,0.12)" strokeWidth={0.5} />
      ))}
    </>
  )
}

// ── single clickable zone rect ──────────────────────────────────────────────────
function ZoneRect({ zone, active, hovered, dimmed, onEnter, onLeave, onClick }) {
  const on  = active?.id === zone.id || hovered === zone.id
  const isWhite = zone.color === '#FFFFFF'
  const opacity = dimmed ? 0.25 : 1
  const fill   = isWhite ? `rgba(255,255,255,${on ? '0.12' : '0.04'})` : `${zone.color}${on ? '25' : '0F'}`
  const stroke = `${zone.color}${on ? 'FF' : '44'}`
  const px = zone.x + 1, py = zone.y + 1, pw = zone.w - 2, ph = zone.h - 2

  return (
    <g onClick={() => onClick(zone)} onMouseEnter={() => onEnter(zone.id)} onMouseLeave={onLeave} style={{ cursor:'pointer', opacity, transition:'opacity 0.25s' }}>
      <rect x={px} y={py} width={pw} height={ph} fill={fill} stroke={stroke} strokeWidth={on ? 2 : 0.8} rx={4} />
      {on && <line x1={px+16} y1={py} x2={px+pw-16} y2={py} stroke={zone.color} strokeWidth={2} opacity={0.9} />}
      <text x={zone.x + zone.w/2} y={zone.y + zone.h/2 - (zone.entry ? 10 : 4)}
        textAnchor="middle" dominantBaseline="middle"
        fontFamily="Orbitron,monospace" fontSize={zone.w < 200 ? 8 : 10}
        fill={on ? zone.color : `${zone.color}99`} letterSpacing={1.5} fontWeight="bold"
        style={{ pointerEvents:'none', userSelect:'none' }}
      >{zone.short}</text>
      {zone.sound && (
        <text x={zone.x + zone.w/2} y={zone.y + zone.h/2 + 10}
          textAnchor="middle" dominantBaseline="middle"
          fontFamily="Space Mono,monospace" fontSize={7}
          fill={on ? '#FFFFFF' : 'rgba(255,255,255,0.4)'} letterSpacing={0.5}
          style={{ pointerEvents:'none', userSelect:'none' }}
        >{zone.sound.split('·')[0].trim()}</text>
      )}
      {zone.entry && (
        <>
          <circle cx={zone.x + zone.w/2} cy={zone.y + zone.h/2 + 20} r={4}
            fill={zone.color} opacity={0.9}>
            <animate attributeName="r" values="4;6;4" dur="1.6s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="0.9;0.4;0.9" dur="1.6s" repeatCount="indefinite" />
          </circle>
          <text x={zone.x + zone.w/2 + 12} y={zone.y + zone.h/2 + 23}
            fontFamily="Space Mono,monospace" fontSize={7} fill={`${zone.color}99`}
            style={{ pointerEvents:'none', userSelect:'none' }}>YOU ARE HERE</text>
        </>
      )}
    </g>
  )
}

// ── info panel ─────────────────────────────────────────────────────────────────
function InfoPanel({ zone, onClose, onSelectRoute }) {
  if (!zone) return (
    <div style={{ textAlign:'center', padding:'36px 0', fontFamily:'Space Mono,monospace', fontSize:11, color: B.dim }}>
      ← tap any zone or select a route above to explore the festival floor plan
    </div>
  )
  return (
    <div className="card-3d" style={{ background:'rgba(255,255,255,0.03)', border:`1px solid ${zone.color}35`, borderRadius:12, padding:'24px 28px', position:'relative' }}>
      <div style={{ position:'absolute', top:0, left:20, right:20, height:1, background:`linear-gradient(90deg, transparent, ${zone.color}60, transparent)` }} />
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:14 }}>
        <div style={{ display:'flex', alignItems:'center', gap:12 }}>
          <span style={{ fontSize:28 }}>{zone.icon}</span>
          <div>
            <div style={{ display:'flex', alignItems:'center', gap:8 }}>
              <span style={{ fontFamily:'Bebas Neue,sans-serif', fontSize:24, color:B.white, letterSpacing:2 }}>{zone.label}</span>
              {zone.fastTrack && (
                <span style={{ fontFamily:'Orbitron,monospace', fontSize:8, color:B.neonMagenta, border:`1px solid ${B.neonMagenta}60`, borderRadius:4, padding:'2px 6px' }}>VIP PRIORITY</span>
              )}
            </div>
            <div style={{ fontFamily:'Syne,sans-serif', fontSize:13, color:zone.color, marginTop:2 }}>{zone.tagline}</div>
          </div>
        </div>
        <button onClick={onClose} style={{ background:'transparent', border:'none', color: B.smoke, fontFamily:'Space Mono,monospace', fontSize:16, cursor:'pointer', padding:'0 4px' }}>✕</button>
      </div>

      {/* Live Sensors Strip */}
      <div style={{ display:'flex', gap:12, flexWrap:'wrap', marginBottom:14, padding:'10px 14px', background:'rgba(255,255,255,0.02)', borderRadius:8, border:'1px solid rgba(255,255,255,0.05)' }}>
        <div style={{ display:'flex', alignItems:'center', gap:6 }}>
          <span style={{ fontSize:12 }}>🔊</span>
          <span style={{ fontFamily:'Space Mono,monospace', fontSize:10, color:B.white }}><strong>Sound:</strong> {zone.sound || '75 dB'}</span>
        </div>
        <div style={{ display:'flex', alignItems:'center', gap:6 }}>
          <span style={{ fontSize:12 }}>👥</span>
          <span style={{ fontFamily:'Space Mono,monospace', fontSize:10, color:B.white }}><strong>Density:</strong> {zone.density || 'Normal'}</span>
        </div>
        <div style={{ display:'flex', alignItems:'center', gap:6 }}>
          <span style={{ fontSize:12 }}>📍</span>
          <span style={{ fontFamily:'Space Mono,monospace', fontSize:10, color:zone.color }}><strong>Zone:</strong> {zone.short}</span>
        </div>
      </div>

      <p style={{ fontFamily:'Syne,sans-serif', fontSize:13, color:'#aaa', lineHeight:1.75, marginBottom:16 }}>{zone.desc}</p>
      <div style={{ display:'flex', gap:16, flexWrap:'wrap' }}>
        <div style={{ flex:'1 1 180px' }}>
          <div style={{ fontFamily:'Space Mono,monospace', fontSize:8, color: B.dim, letterSpacing:3, marginBottom:8 }}>SCHEDULE & TIMELINE</div>
          {zone.schedule.map(s => (
            <div key={s} style={{ fontFamily:'Space Mono,monospace', fontSize:10, color:B.smoke, padding:'4px 0', borderBottom:'1px solid rgba(255,255,255,0.04)' }}>{s}</div>
          ))}
        </div>
        <div style={{ flex:'0 0 auto', alignSelf:'flex-end' }}>
          <div style={{ display:'flex', gap:6, flexWrap:'wrap', justifyContent:'flex-end' }}>
            {zone.tags.map(t => (
              <span key={t} style={{ fontFamily:'Space Mono,monospace', fontSize:8, letterSpacing:2, color:zone.color, border:`1px solid ${zone.color}40`, borderRadius:4, padding:'3px 8px' }}>{t}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

// ── legend ─────────────────────────────────────────────────────────────────────
const LEGEND = [
  { color: B.amber,       label: 'Stage / Entry' },
  { color: B.neonCyan,    label: 'Art / Photo / Workshop' },
  { color: B.neonMagenta, label: 'VIP / Museum' },
  { color: B.neonLime,    label: 'Vendors / Food' },
]

const ROUTES = [
  { id: 'none', label: 'OFF', name: 'No Route', color: '#555', path: null },
  { id: 'grail', label: '🔥 GRAIL DROP RUSH', name: 'Entrance ➔ West Vendors ➔ Main Floor ➔ Stage', color: B.amber, path: 'M 400 480 L 90 380 L 400 230 L 400 70' },
  { id: 'vip', label: '👑 VIP FAST-TRACK', name: 'Entrance ➔ VIP Lounge ➔ Museum ➔ Stage', color: B.neonMagenta, path: 'M 400 480 L 710 70 L 710 230 L 400 70' },
  { id: 'care', label: '✨ CARE & CULTURE', name: 'Entrance ➔ Sneaker Care ➔ Gallery ➔ Workshop', color: B.neonCyan, path: 'M 400 480 L 710 380 L 90 230 L 710 500' },
]

// ── main section ───────────────────────────────────────────────────────────────
export default function Venue() {
  const [active,       setActive]       = useState(null)
  const [hovered,      setHovered]      = useState(null)
  const [viewMode,     setViewMode]     = useState('3d') // '3d' | '2d'
  const [activeRoute,  setActiveRoute]  = useState('none')
  const [activeFilter, setActiveFilter] = useState('all')
  const [searchQuery,  setSearchQuery]  = useState('')

  const routeObj = ROUTES.find(r => r.id === activeRoute)

  const isDimmed = (zone) => {
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      const match = zone.label.toLowerCase().includes(q) ||
                    zone.short.toLowerCase().includes(q) ||
                    zone.desc.toLowerCase().includes(q) ||
                    zone.tags.some(t => t.toLowerCase().includes(q))
      return !match
    }
    if (activeFilter === 'all') return false
    return zone.category !== activeFilter
  }

  return (
    <section id="venue" style={{ background:B.void, padding:'100px 0', position:'relative', overflow:'hidden' }}>
      <div style={{ position:'absolute', top:'10%', right:'-5%', width:400, height:400, background:`${B.neonCyan}10`, borderRadius:'50%', filter:'blur(80px)', pointerEvents:'none' }} />
      <div style={{ position:'absolute', bottom:'10%', left:'-5%', width:350, height:350, background:`${B.amber}10`, borderRadius:'50%', filter:'blur(80px)', pointerEvents:'none' }} />
      <GrainOverlay />
      <Egg id="egg-085" corner="top-right" />
      <Egg id="egg-086" corner="bottom-left" />

      <style>{`
        @keyframes dashMove {
          to { stroke-dashoffset: -40; }
        }
      `}</style>

      <div style={{ maxWidth:960, margin:'0 auto', padding:'0 24px', position:'relative', zIndex:10 }}>

        {/* Header */}
        <div style={{ textAlign:'center', marginBottom:40 }}>
          <SectionTag>DEC 12, 2026 · MURI OKUNOLA PARK, V/I</SectionTag>
          <h2 className="reveal-3d text-3d" style={{ fontFamily:"'Bebas Neue', sans-serif", fontSize:'clamp(54px,9vw,100px)', color:B.white, lineHeight:0.88, letterSpacing:2, marginBottom:16 }}>
            EXPLORE<br /><span style={{ color:B.amber }}>THE VENUE</span>
          </h2>
          <p style={{ fontFamily:"'Syne', sans-serif", fontSize:15, color:'#888', maxWidth:460, margin:'0 auto' }}>
            Interactive 3D floor plan navigator — click any zone, trace arrival routes, or preview live crowd acoustics.
          </p>
        </div>

        {/* Event details strip */}
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(160px, 1fr))', gap:1, marginBottom:28, border:`1px solid rgba(255,255,255,0.07)`, borderRadius:12, overflow:'hidden' }}>
          {[
            { label:'DATE',    value:'Saturday, December 12',         color:B.amber },
            { label:'DOORS',   value:'12:00 PM — 10:00 PM',           color:B.neonCyan },
            { label:'VENUE',   value:'Muri Okunola Park, V/I',         color:B.neonLime },
            { label:'DAY 1',   value:'Mobolaji Johnson Arena · Dec 11', color:B.neonMagenta },
          ].map(({ label, value, color }) => (
            <div key={label} style={{ padding:'18px 20px', background:'rgba(255,255,255,0.025)' }}>
              <div style={{ fontFamily:'Space Mono,monospace', fontSize: 9, color: B.dim, letterSpacing:3, marginBottom:6 }}>{label}</div>
              <div style={{ fontFamily:'Bebas Neue,sans-serif', fontSize:16, color, letterSpacing:1, lineHeight:1.3 }}>{value}</div>
            </div>
          ))}
        </div>

        {/* Navigator Controls: 3D toggle, Category filter, Route selector */}
        <div style={{ display:'flex', flexDirection:'column', gap:14, marginBottom:20, background:'rgba(255,255,255,0.02)', border:'1px solid rgba(255,255,255,0.08)', borderRadius:12, padding:'16px 20px' }}>
          {/* Row 1: Mode + Search */}
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', flexWrap:'wrap', gap:12 }}>
            <div style={{ display:'flex', gap:8, alignItems:'center' }}>
              <span style={{ fontFamily:'Space Mono,monospace', fontSize:9, color:B.dim, letterSpacing:2 }}>VIEW:</span>
              <button
                onClick={() => setViewMode(viewMode === '3d' ? '2d' : '3d')}
                style={{ padding:'6px 14px', borderRadius:20, background: viewMode === '3d' ? `${B.amber}20` : 'transparent', border: `1px solid ${viewMode === '3d' ? B.amber : 'rgba(255,255,255,0.1)'}`, color: viewMode === '3d' ? B.amber : B.smoke, fontFamily:'Orbitron,monospace', fontSize:9, letterSpacing:1, cursor:'pointer' }}
              >
                {viewMode === '3d' ? '🕹️ 3D ISOMETRIC' : '📐 2D BLUEPRINT'}
              </button>
            </div>

            <div style={{ display:'flex', alignItems:'center', gap:8, flex: '1 1 240px', maxWidth:360 }}>
              <span style={{ fontSize:12 }}>🔍</span>
              <input
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search booths, drops, food, care..."
                style={{ width:'100%', background:'rgba(0,0,0,0.4)', border:'1px solid rgba(255,255,255,0.1)', borderRadius:6, padding:'7px 12px', color:B.white, fontFamily:'Space Mono,monospace', fontSize:10, outline:'none' }}
              />
            </div>
          </div>

          {/* Row 2: Category Filters */}
          <div style={{ display:'flex', gap:6, flexWrap:'wrap', alignItems:'center' }}>
            <span style={{ fontFamily:'Space Mono,monospace', fontSize:8, color:B.dim, letterSpacing:1.5, marginRight:4 }}>FILTER:</span>
            {[
              { id:'all', label:'ALL ZONES' },
              { id:'stage', label:'🎤 STAGE' },
              { id:'vendors', label:'🛍️ VENDORS' },
              { id:'vip', label:'💎 VIP' },
              { id:'care', label:'✨ CARE & LAB' },
              { id:'food', label:'🍽️ FOOD' },
            ].map(f => (
              <button
                key={f.id}
                onClick={() => { setActiveFilter(f.id); setSearchQuery('') }}
                style={{ padding:'4px 10px', borderRadius:4, background: activeFilter === f.id ? 'rgba(255,255,255,0.1)' : 'transparent', border:`1px solid ${activeFilter === f.id ? B.white : 'rgba(255,255,255,0.06)'}`, color: activeFilter === f.id ? B.white : B.smoke, fontFamily:'Space Mono,monospace', fontSize:8, letterSpacing:1, cursor:'pointer' }}
              >
                {f.label}
              </button>
            ))}
          </div>

          {/* Row 3: Festival Routes */}
          <div style={{ display:'flex', gap:8, flexWrap:'wrap', alignItems:'center' }}>
            <span style={{ fontFamily:'Space Mono,monospace', fontSize:8, color:B.dim, letterSpacing:1.5, marginRight:4 }}>ROUTE:</span>
            {ROUTES.map(r => (
              <button
                key={r.id}
                onClick={() => setActiveRoute(r.id)}
                style={{ padding:'5px 12px', borderRadius:6, background: activeRoute === r.id ? `${r.color}25` : 'transparent', border:`1px solid ${activeRoute === r.id ? r.color : 'rgba(255,255,255,0.08)'}`, color: activeRoute === r.id ? r.color : B.dim, fontFamily:'Orbitron,monospace', fontSize:8, letterSpacing:1, cursor:'pointer', fontWeight: activeRoute === r.id ? 700 : 400 }}
              >
                {r.label}
              </button>
            ))}
          </div>
        </div>

        {/* SVG floor map with dynamic 3D Perspective container */}
        <div style={{
          perspective: 1200,
          marginBottom: 20,
        }}>
          <div style={{
            border:`1px solid rgba(255,255,255,0.12)`,
            borderRadius:14,
            overflow:'hidden',
            background:'#070710',
            transform: viewMode === '3d' ? 'rotateX(18deg) rotateZ(-1.5deg) scale(0.97)' : 'none',
            transformStyle: 'preserve-3d',
            transition: 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.5s ease',
            boxShadow: viewMode === '3d' ? '0 30px 80px rgba(0,0,0,0.85), 0 0 50px rgba(245,166,35,0.08)' : '0 10px 40px rgba(0,0,0,0.5)',
          }}>
            <svg viewBox="0 0 800 560" width="100%" style={{ display:'block' }} xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(255,255,255,0.03)" strokeWidth="0.5" />
                </pattern>
                <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="3" result="glow" />
                  <feMerge>
                    <feMergeNode in="glow" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>
              <rect width="800" height="560" fill="url(#grid)" />
              <rect x="1" y="1" width="798" height="558" fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth="1" rx="2" />
              <line x1="180" y1="0" x2="180" y2="560" stroke="rgba(255,255,255,0.06)" strokeWidth="1" />
              <line x1="620" y1="0" x2="620" y2="560" stroke="rgba(255,255,255,0.06)" strokeWidth="1" />
              <line x1="0" y1="140" x2="800" y2="140" stroke="rgba(255,255,255,0.06)" strokeWidth="1" />
              <line x1="0" y1="320" x2="800" y2="320" stroke="rgba(255,255,255,0.06)" strokeWidth="1" />
              <line x1="0" y1="440" x2="800" y2="440" stroke="rgba(255,255,255,0.06)" strokeWidth="1" />
              <rect x="1" y="1" width="178" height="138" fill="rgba(255,255,255,0.02)" stroke="rgba(255,255,255,0.06)" strokeWidth="0.8" rx="2" />
              <text x="90" y="70" textAnchor="middle" dominantBaseline="middle" fontFamily="Space Mono,monospace" fontSize={8} fill="rgba(255,255,255,0.2)" letterSpacing={1.5}>PRODUCTION</text>
              <text x="90" y="84" textAnchor="middle" dominantBaseline="middle" fontFamily="Space Mono,monospace" fontSize={7} fill="rgba(255,255,255,0.1)">CREW ONLY</text>
              <BoothGrid />

              {/* Render all zones */}
              {ZONES.map(zone => (
                <ZoneRect
                  key={zone.id}
                  zone={zone}
                  active={active}
                  hovered={hovered}
                  dimmed={isDimmed(zone)}
                  onEnter={setHovered}
                  onLeave={() => setHovered(null)}
                  onClick={z => setActive(prev => prev?.id === z.id ? null : z)}
                />
              ))}

              {/* Render animated route line if selected */}
              {routeObj?.path && (
                <g filter="url(#glow)">
                  <path
                    d={routeObj.path}
                    fill="none"
                    stroke={routeObj.color}
                    strokeWidth={3}
                    strokeDasharray="8 8"
                    style={{ animation: 'dashMove 1.5s linear infinite' }}
                  />
                  <circle cx={400} cy={480} r={6} fill={routeObj.color}>
                    <animate attributeName="r" values="5;8;5" dur="1.2s" repeatCount="indefinite" />
                  </circle>
                </g>
              )}

              <text x="772" y="20" textAnchor="middle" fontFamily="Space Mono,monospace" fontSize={10} fill="rgba(255,255,255,0.2)">N</text>
              <line x1="772" y1="24" x2="772" y2="38" stroke="rgba(255,255,255,0.15)" strokeWidth="1" />
              <polygon points="772,14 769,24 775,24" fill="rgba(255,255,255,0.2)" />
              <text x="22" y="550" fontFamily="Space Mono,monospace" fontSize={7} fill="rgba(255,255,255,0.2)" letterSpacing={1}>
                {routeObj?.path ? `ACTIVE ROUTE: ${routeObj.name.toUpperCase()}` : 'EXPECTED LAYOUT · MURI OKUNOLA PARK, VICTORIA ISLAND'}
              </text>
            </svg>
          </div>
        </div>

        {/* Legend */}
        <div style={{ display:'flex', gap:20, flexWrap:'wrap', justifyContent:'center', marginBottom:24 }}>
          {LEGEND.map(({ color, label }) => (
            <div key={label} style={{ display:'flex', alignItems:'center', gap:6 }}>
              <div style={{ width:10, height:10, borderRadius:2, background:`${color}30`, border:`1px solid ${color}80` }} />
              <span style={{ fontFamily:'Space Mono,monospace', fontSize:9, color: B.smoke }}>{label}</span>
            </div>
          ))}
        </div>

        {/* Info panel */}
        <InfoPanel zone={active} onClose={() => setActive(null)} />

        {/* CTAs */}
        <div style={{ marginTop:48, textAlign:'center' }}>
          <div style={{ fontFamily:'Space Mono,monospace', fontSize:8, color: B.dim, letterSpacing:3, marginBottom:20 }}>TWO NIGHTS. TWO VENUES. ONE MOVEMENT.</div>
          <div style={{ display:'flex', gap:14, justifyContent:'center', flexWrap:'wrap' }}>
            <a href="#tickets"
              style={{ padding:'14px 32px', background:B.amber, color:B.black, fontFamily:'Space Mono,monospace', fontSize:10, fontWeight:700, letterSpacing:'0.15em', textDecoration:'none', borderRadius:4, boxShadow:`0 0 30px ${B.amber}25` }}>
              GET TICKETS →
            </a>
            <a href={SOCIAL_LINKS.whatsapp} target="_blank" rel="noopener noreferrer"
              style={{ padding:'14px 32px', background:'rgba(37,211,102,0.08)', color:'#25D366', fontFamily:'Space Mono,monospace', fontSize:10, letterSpacing:'0.15em', textDecoration:'none', borderRadius:4, border:'1px solid rgba(37,211,102,0.3)' }}>
              JOIN WHATSAPP →
            </a>
          </div>
        </div>

        {/* GETTING THERE */}
        <div style={{ marginTop:80 }}>
          {/* Address pill */}
          <div style={{ textAlign:'center', marginBottom:36 }}>
            <div style={{ fontFamily:'Space Mono,monospace', fontSize:8, color: B.dim, letterSpacing:3, marginBottom:18 }}>GETTING THERE</div>
            <h3 className="reveal-3d" style={{ fontFamily:"'Bebas Neue', sans-serif", fontSize:'clamp(32px,5vw,56px)', color:B.white, letterSpacing:2, lineHeight:0.9, marginBottom:20 }}>
              PLAN YOUR <span style={{ color:B.neonCyan }}>JOURNEY</span>
            </h3>
            <div className="card-3d" style={{
              display:'inline-flex', alignItems:'center', gap:8,
              padding:'8px 20px',
              background:'rgba(255,255,255,0.04)',
              border:`1px solid rgba(255,255,255,0.10)`,
              borderRadius:100,
            }}>
              <span style={{ fontSize:14 }}>📍</span>
              <span style={{ fontFamily:'Space Mono,monospace', fontSize:9, color:'#888', letterSpacing:'0.12em' }}>
                Muri Okunola Park, Adeola Odeku Street, Victoria Island, Lagos State, Nigeria
              </span>
            </div>
          </div>

          {/* Transport cards grid */}
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(200px, 1fr))', gap:16 }}>
            {TRANSPORT.map(({ icon, title, desc }, i) => {
              const accent = [B.amber, B.neonCyan, B.neonLime, B.neonMagenta][i]
              return (
                <div key={title} className="card-3d" style={{
                  background:'rgba(255,255,255,0.025)',
                  border:`1px solid rgba(255,255,255,0.07)`,
                  borderRadius:12,
                  padding:'24px 22px',
                  position:'relative',
                  overflow:'hidden',
                  transition:'border-color 0.2s, background 0.2s',
                }}
                  onMouseEnter={e => {
                    e.currentTarget.style.borderColor = `${accent}40`
                    e.currentTarget.style.background = `${accent}08`
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)'
                    e.currentTarget.style.background = 'rgba(255,255,255,0.025)'
                  }}
                >
                  {/* Top accent line */}
                  <div style={{ position:'absolute', top:0, left:24, right:24, height:1, background:`linear-gradient(90deg,transparent,${accent}60,transparent)` }} />
                  <div style={{ fontSize:28, marginBottom:12 }}>{icon}</div>
                  <div style={{ fontFamily:'Space Mono,monospace', fontSize:9, color:accent, letterSpacing:'0.2em', fontWeight:700, marginBottom:10 }}>{title}</div>
                  <p style={{ fontFamily:'Syne,sans-serif', fontSize:13, color:B.smoke, lineHeight:1.7, margin:0 }}>{desc}</p>
                </div>
              )
            })}
          </div>
        </div>

      </div>
    </section>
  )
}
