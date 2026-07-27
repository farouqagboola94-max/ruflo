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
  },
  {
    id: 'vip', short: 'VIP', label: 'VIP Lounge',
    color: B.neonMagenta, x:620, y:0, w:180, h:140,
    icon:'💎', tagline:'Exclusive access. No exceptions.',
    desc:'Private sneaker showcase, open bar, complimentary styling consultations, and meet-the-artist moments. VIP ticket required.',
    schedule:['All-day access','Private drop at 20:00'],
    tags:['VIP','EXCLUSIVE','BAR'],
  },
  {
    id: 'gallery', short: 'ART GALLERY', label: 'Art Gallery',
    color: B.neonCyan, x:0, y:140, w:180, h:180,
    icon:'🖼️', tagline:'Lagos on canvas.',
    desc:'Curated works from 12 Lagos-based visual artists. Prints available for purchase. All Culture Museum auction pieces on display.',
    schedule:['Open all day','Artist walk-through at 15:00'],
    tags:['ART','CULTURE','PRINTS'],
  },
  {
    id: 'floor', short: 'MAIN FLOOR', label: 'Main Floor',
    color:'#FFFFFF', x:180, y:140, w:440, h:180,
    icon:'👟', tagline:'The epicentre.',
    desc:'30+ curated vendor booths across footwear, streetwear, accessories, and collectibles. The beating heart of Sneakers Fest.',
    schedule:['Open 12:00 — 22:00','Peak crowd: 16:00 — 20:00'],
    tags:['VENDORS','TRADE','BROWSE'],
  },
  {
    id: 'museum', short: 'MUSEUM', label: 'Culture Museum',
    color: B.neonMagenta, x:620, y:140, w:180, h:180,
    icon:'🏛️', tagline:'Bid for the culture.',
    desc:'8 exclusive digital artworks from Lagos creatives on live auction. Highest bids placed via the website go home with the piece. Closes at event end.',
    schedule:['Viewing all day','Auction closes 21:30'],
    tags:['AUCTION','ART','DIGITAL'],
  },
  {
    id: 'vendor_w', short: 'VENDORS W', label: 'Vendor Hall West',
    color: B.neonLime, x:0, y:320, w:180, h:120,
    icon:'🛍️', tagline:'Verified vendor zone.',
    desc:'West wing vendor hall. Deadstock, rare collabs, custom kicks, and Lagos streetwear labels.',
    schedule:['Open 12:00 — 21:30'],
    tags:['DEADSTOCK','CUSTOMS','STREETWEAR'],
  },
  {
    id: 'photo', short: 'PHOTO BOOTH', label: 'Photo Booth Alley',
    color: B.neonCyan, x:180, y:320, w:440, h:120,
    icon:'📸', tagline:'Make your moment.',
    desc:'Four themed photo installations inspired by Lagos streetwear decades. Print on-site in 90 seconds. SF\'26 hype card moments guaranteed.',
    schedule:['Open all day','Queue expected 16:00 — 19:00'],
    tags:['PHOTO','PRINT','CONTENT'],
  },
  {
    id: 'care', short: 'SNEAKER CARE', label: 'Sneaker Care Station',
    color: B.amber, x:620, y:320, w:180, h:120,
    icon:'✨', tagline:'Keep your grails fresh.',
    desc:'On-site cleaning, restoration, re-lacing, and sole protection. RESHOEVN8R and Jason Markk professionals on deck all day.',
    schedule:['Open 12:00 — 21:00','Walk-ins only'],
    tags:['CLEANING','CARE','RESTORE'],
  },
  {
    id: 'food', short: 'FOOD COURT', label: 'Food Court',
    color: B.neonLime, x:0, y:440, w:180, h:120,
    icon:'🍽️', tagline:'Lagos eats, elevated.',
    desc:'Street food meets curated dining. Jollof station, suya grill, cold drinks, and specialty Lagos bites from 8 vendors.',
    schedule:['Open 12:00 — 22:00'],
    tags:['FOOD','DRINKS','VIBES'],
  },
  {
    id: 'entrance', short: 'ENTRANCE', label: 'Entrance & Registration',
    color: B.amber, x:180, y:440, w:440, h:120,
    icon:'🎟️', tagline:'Your journey starts here.',
    desc:'Show your QR ticket at the gate. Collect your wristband, festival tote, and event guide. Early bird guests enter from 11:30 AM.',
    schedule:['Early bird entry 11:30 AM','General entry 12:00 PM','Last entry 20:00'],
    tags:['TICKETS','ENTRY','WRISTBAND'],
    entry: true,
  },
  {
    id: 'workshop', short: 'WORKSHOP', label: 'Workshop Zone',
    color: B.neonCyan, x:620, y:440, w:180, h:120,
    icon:'🎨', tagline:'Learn the craft.',
    desc:'Sneaker customisation masterclasses, lacing tutorials, and brand activation sessions. Limited seats — claim at the info desk.',
    schedule:['Sessions at 13:00, 15:00, 17:00','Walk-in only'],
    tags:['WORKSHOP','CUSTOM','LEARN'],
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
function ZoneRect({ zone, active, hovered, onEnter, onLeave, onClick }) {
  const on  = active?.id === zone.id || hovered === zone.id
  const isWhite = zone.color === '#FFFFFF'
  const fill   = isWhite ? `rgba(255,255,255,${on ? '0.09' : '0.04'})` : `${zone.color}${on ? '22' : '0F'}`
  const stroke = `${zone.color}${on ? 'CC' : '44'}`
  const px = zone.x + 1, py = zone.y + 1, pw = zone.w - 2, ph = zone.h - 2

  return (
    <g onClick={() => onClick(zone)} onMouseEnter={() => onEnter(zone.id)} onMouseLeave={onLeave} style={{ cursor:'pointer' }}>
      <rect x={px} y={py} width={pw} height={ph} fill={fill} stroke={stroke} strokeWidth={on ? 1.5 : 0.8} rx={2} />
      {on && <line x1={px+16} y1={py} x2={px+pw-16} y2={py} stroke={zone.color} strokeWidth={1.5} opacity={0.8} />}
      <text x={zone.x + zone.w/2} y={zone.y + zone.h/2 - (zone.entry ? 10 : 0)}
        textAnchor="middle" dominantBaseline="middle"
        fontFamily="Orbitron,monospace" fontSize={zone.w < 200 ? 8 : 10}
        fill={on ? zone.color : `${zone.color}99`} letterSpacing={1.5} fontWeight="bold"
        style={{ pointerEvents:'none', userSelect:'none' }}
      >{zone.short}</text>
      {zone.entry && (
        <>
          <circle cx={zone.x + zone.w/2} cy={zone.y + zone.h/2 + 16} r={4}
            fill={zone.color} opacity={0.9}>
            <animate attributeName="r" values="4;6;4" dur="1.6s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="0.9;0.4;0.9" dur="1.6s" repeatCount="indefinite" />
          </circle>
          <text x={zone.x + zone.w/2 + 12} y={zone.y + zone.h/2 + 19}
            fontFamily="Space Mono,monospace" fontSize={7} fill={`${zone.color}99`}
            style={{ pointerEvents:'none', userSelect:'none' }}>YOU ARE HERE</text>
        </>
      )}
    </g>
  )
}

// ── info panel ─────────────────────────────────────────────────────────────────
function InfoPanel({ zone, onClose }) {
  if (!zone) return (
    <div style={{ textAlign:'center', padding:'36px 0', fontFamily:'Space Mono,monospace', fontSize:11, color:'#333' }}>
      ← tap any zone to explore the floor plan
    </div>
  )
  return (
    <div className="card-3d" style={{ background:'rgba(255,255,255,0.03)', border:`1px solid ${zone.color}35`, borderRadius:12, padding:'24px 28px', position:'relative' }}>
      <div style={{ position:'absolute', top:0, left:20, right:20, height:1, background:`linear-gradient(90deg, transparent, ${zone.color}60, transparent)` }} />
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:14 }}>
        <div style={{ display:'flex', alignItems:'center', gap:12 }}>
          <span style={{ fontSize:24 }}>{zone.icon}</span>
          <div>
            <div style={{ fontFamily:'Bebas Neue,sans-serif', fontSize:24, color:B.white, letterSpacing:2 }}>{zone.label}</div>
            <div style={{ fontFamily:'Syne,sans-serif', fontSize:13, color:zone.color, marginTop:2 }}>{zone.tagline}</div>
          </div>
        </div>
        <button onClick={onClose} style={{ background:'transparent', border:'none', color:'#555', fontFamily:'Space Mono,monospace', fontSize:16, cursor:'pointer', padding:'0 4px' }}>✕</button>
      </div>
      <p style={{ fontFamily:'Syne,sans-serif', fontSize:13, color:'#aaa', lineHeight:1.75, marginBottom:16 }}>{zone.desc}</p>
      <div style={{ display:'flex', gap:16, flexWrap:'wrap' }}>
        <div style={{ flex:'1 1 180px' }}>
          <div style={{ fontFamily:'Space Mono,monospace', fontSize:8, color:'#444', letterSpacing:3, marginBottom:8 }}>SCHEDULE</div>
          {zone.schedule.map(s => (
            <div key={s} style={{ fontFamily:'Space Mono,monospace', fontSize:10, color:'#777', padding:'4px 0', borderBottom:'1px solid rgba(255,255,255,0.04)' }}>{s}</div>
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

// ── main section ───────────────────────────────────────────────────────────────
export default function Venue() {
  const [active,  setActive]  = useState(null)
  const [hovered, setHovered] = useState(null)

  return (
    <section id="venue" style={{ background:B.void, padding:'100px 0', position:'relative', overflow:'hidden' }}>
      <div style={{ position:'absolute', top:'10%', right:'-5%', width:400, height:400, background:`${B.neonCyan}10`, borderRadius:'50%', filter:'blur(80px)', pointerEvents:'none' }} />
      <div style={{ position:'absolute', bottom:'10%', left:'-5%', width:350, height:350, background:`${B.amber}10`, borderRadius:'50%', filter:'blur(80px)', pointerEvents:'none' }} />
      <GrainOverlay />
      <Egg id="egg-085" corner="top-right" />
      <Egg id="egg-086" corner="bottom-left" />

      <div style={{ maxWidth:960, margin:'0 auto', padding:'0 24px', position:'relative', zIndex:10 }}>

        {/* Header */}
        <div style={{ textAlign:'center', marginBottom:52 }}>
          <SectionTag>DEC 12, 2026 · MURI OKUNOLA PARK, V/I</SectionTag>
          <h2 className="reveal-3d text-3d" style={{ fontFamily:"'Bebas Neue', sans-serif", fontSize:'clamp(54px,9vw,100px)', color:B.white, lineHeight:0.88, letterSpacing:2, marginBottom:16 }}>
            EXPLORE<br /><span style={{ color:B.amber }}>THE VENUE</span>
          </h2>
          <p style={{ fontFamily:"'Syne', sans-serif", fontSize:15, color:'#888', maxWidth:460, margin:'0 auto' }}>
            Interactive floor plan — click any zone to see what's happening there.
          </p>
        </div>

        {/* Event details strip */}
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(160px, 1fr))', gap:1, marginBottom:36, border:`1px solid rgba(255,255,255,0.07)`, borderRadius:12, overflow:'hidden' }}>
          {[
            { label:'DATE',    value:'Saturday, December 12',         color:B.amber },
            { label:'DOORS',   value:'12:00 PM — 10:00 PM',           color:B.neonCyan },
            { label:'VENUE',   value:'Muri Okunola Park, V/I',         color:B.neonLime },
            { label:'DAY 1',   value:'Mobolaji Johnson Arena · Dec 11', color:B.neonMagenta },
          ].map(({ label, value, color }) => (
            <div key={label} style={{ padding:'18px 20px', background:'rgba(255,255,255,0.025)' }}>
              <div style={{ fontFamily:'Space Mono,monospace', fontSize:7, color:'#444', letterSpacing:3, marginBottom:6 }}>{label}</div>
              <div style={{ fontFamily:'Bebas Neue,sans-serif', fontSize:16, color, letterSpacing:1, lineHeight:1.3 }}>{value}</div>
            </div>
          ))}
        </div>

        {/* SVG floor map */}
        <div style={{ border:`1px solid rgba(255,255,255,0.08)`, borderRadius:12, overflow:'hidden', marginBottom:16, background:'#080810' }}>
          <svg viewBox="0 0 800 560" width="100%" style={{ display:'block' }} xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(255,255,255,0.03)" strokeWidth="0.5" />
              </pattern>
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
            {ZONES.map(zone => (
              <ZoneRect
                key={zone.id}
                zone={zone}
                active={active}
                hovered={hovered}
                onEnter={setHovered}
                onLeave={() => setHovered(null)}
                onClick={z => setActive(prev => prev?.id === z.id ? null : z)}
              />
            ))}
            <text x="772" y="20" textAnchor="middle" fontFamily="Space Mono,monospace" fontSize={10} fill="rgba(255,255,255,0.2)">N</text>
            <line x1="772" y1="24" x2="772" y2="38" stroke="rgba(255,255,255,0.15)" strokeWidth="1" />
            <polygon points="772,14 769,24 775,24" fill="rgba(255,255,255,0.2)" />
            <text x="22" y="550" fontFamily="Space Mono,monospace" fontSize={7} fill="rgba(255,255,255,0.2)" letterSpacing={1}>EXPECTED LAYOUT — SUBJECT TO CHANGE</text>
          </svg>
        </div>

        {/* Legend */}
        <div style={{ display:'flex', gap:20, flexWrap:'wrap', justifyContent:'center', marginBottom:24 }}>
          {LEGEND.map(({ color, label }) => (
            <div key={label} style={{ display:'flex', alignItems:'center', gap:6 }}>
              <div style={{ width:10, height:10, borderRadius:2, background:`${color}30`, border:`1px solid ${color}80` }} />
              <span style={{ fontFamily:'Space Mono,monospace', fontSize:9, color:'#555' }}>{label}</span>
            </div>
          ))}
        </div>

        {/* Info panel */}
        <InfoPanel zone={active} onClose={() => setActive(null)} />

        {/* CTAs */}
        <div style={{ marginTop:48, textAlign:'center' }}>
          <div style={{ fontFamily:'Space Mono,monospace', fontSize:8, color:'#444', letterSpacing:3, marginBottom:20 }}>TWO NIGHTS. TWO VENUES. ONE MOVEMENT.</div>
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
            <div style={{ fontFamily:'Space Mono,monospace', fontSize:8, color:'#444', letterSpacing:3, marginBottom:18 }}>GETTING THERE</div>
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
                  <p style={{ fontFamily:'Syne,sans-serif', fontSize:13, color:'#777', lineHeight:1.7, margin:0 }}>{desc}</p>
                </div>
              )
            })}
          </div>
        </div>

      </div>
    </section>
  )
}
