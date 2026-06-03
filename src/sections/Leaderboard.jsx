import { useState, useEffect, useRef } from 'react'
import { B } from '../tokens'
import { GrainOverlay, SectionTag } from '../components/Shared'

// ── static seed data ───────────────────────────────────────────────────────────
const CITY_SEEDS = [
  { city:'Lagos',         state:'Lagos',   count:847 },
  { city:'Abuja',         state:'FCT',     count:312 },
  { city:'Port Harcourt', state:'Rivers',  count:189 },
  { city:'Ibadan',        state:'Oyo',     count:134 },
  { city:'Kano',          state:'Kano',    count:98  },
  { city:'Enugu',         state:'Enugu',   count:87  },
  { city:'Benin City',    state:'Edo',     count:76  },
  { city:'Warri',         state:'Delta',   count:54  },
  { city:'Aba',           state:'Abia',    count:43  },
  { city:'Kaduna',        state:'Kaduna',  count:38  },
]

const AW = {
  aw1:{ title:'Lagos at Dawn',     start:180000 },
  aw2:{ title:'Sole Supremacy',    start:95000  },
  aw3:{ title:'Neon Void I',       start:320000 },
  aw4:{ title:'The Movement',      start:150000 },
  aw5:{ title:'Alté Altar',        start:500000 },
  aw6:{ title:'Market Day',        start:65000  },
  aw7:{ title:'Dec 12 Prophesy',   start:750000 },
  aw8:{ title:'Grail Keeper',      start:220000 },
}

const TICKER_MSGS = [
  '🔥 Lagos just extended their lead',
  '🎯 A new bid landed on Grail Keeper',
  '📸 A Port Harcourt photo is climbing the heat chart',
  '👟 Yeezy Zebra picked up 4 more WANT votes',
  '🏙️ Abuja is closing the gap on Lagos',
  '💎 Neon Void I just received a bid above ₦400,000',
  '🔥 The gallery wall is heating up fast',
  '🎟️ 14 people entered the Jordan 4 raffle in the last hour',
]

const fmt = n => '₦' + Number(n).toLocaleString('en-NG')

const MEDAL = { 1:'🥇', 2:'🥈', 3:'🥉' }

// ── read localStorage once ─────────────────────────────────────────────────────
function readAll() {
  const get = (k, d) => { try { return JSON.parse(localStorage.getItem(k) || d) } catch { return JSON.parse(d) } }

  const gallery  = get('sf26_gallery', '[]')
  const trades   = get('sf26_trades',  'null') || []
  const bids     = get('sf26_museum_bids', '{}')
  const raffleEntries = get('sf26_raffle_entries', '{}')

  // cities: seeds + raffle entrant cities
  const cityMap = {}
  CITY_SEEDS.forEach(c => { cityMap[c.city] = { ...c } })
  Object.values(raffleEntries).forEach(e => {
    const city = e?.city?.trim()
    if (!city) return
    if (cityMap[city]) cityMap[city].count += 1
    else cityMap[city] = { city, state:'Nigeria', count: 1 }
  })
  const cities = Object.values(cityMap).sort((a, b) => b.count - a.count).slice(0, 10)

  // gallery sorted by heat
  const galleryRanked = [...gallery].sort((a, b) => (b.heat || 0) - (a.heat || 0)).slice(0, 10)

  // trades sorted by wants
  const tradesRanked = [...trades].sort((a, b) => (b.wants || 0) - (a.wants || 0)).slice(0, 10)

  // museum bids
  const museumRanked = Object.entries(bids)
    .filter(([, v]) => v > 0)
    .map(([id, amount]) => ({ id, ...AW[id], amount }))
    .sort((a, b) => b.amount - a.amount)

  // fill museum with unbid artworks at the bottom
  Object.entries(AW).forEach(([id, aw]) => {
    if (!bids[id]) museumRanked.push({ id, ...aw, amount: 0 })
  })

  return { cities, gallery: galleryRanked, trades: tradesRanked, museum: museumRanked }
}

// ── rank row ───────────────────────────────────────────────────────────────────
function RankRow({ rank, label, sub, metric, metricSub, color, maxMetric, photo, delay }) {
  const [visible, setVisible] = useState(false)
  useEffect(() => { const t = setTimeout(() => setVisible(true), delay); return () => clearTimeout(t) }, [delay])

  const pct = maxMetric > 0 ? (metric / maxMetric) * 100 : 0
  const isTop = rank <= 3

  return (
    <div style={{ display:'flex', alignItems:'center', gap:12, padding:'12px 0', borderBottom:'1px solid rgba(255,255,255,0.05)', position:'relative', opacity: visible ? 1 : 0, transform: visible ? 'translateY(0)' : 'translateY(12px)', transition:'opacity 0.35s ease, transform 0.35s ease' }}>
      {/* bar bg */}
      <div style={{ position:'absolute', inset:0, background:`${color}08`, width:`${pct}%`, borderRadius:4, pointerEvents:'none', transition:'width 0.6s ease' }} />

      {/* rank badge */}
      <div style={{ width:32, textAlign:'center', flexShrink:0, zIndex:1 }}>
        {isTop
          ? <span style={{ fontSize:18 }}>{MEDAL[rank]}</span>
          : <span style={{ fontFamily:'Orbitron,monospace', fontSize:11, color:'#444', fontWeight:700 }}>#{rank}</span>
        }
      </div>

      {/* photo thumbnail */}
      {photo !== undefined && (
        <div style={{ width:36, height:36, borderRadius:6, overflow:'hidden', flexShrink:0, background:'rgba(255,255,255,0.05)', border:`1px solid rgba(255,255,255,0.08)`, zIndex:1 }}>
          {photo ? <img src={photo} alt="" style={{ width:'100%', height:'100%', objectFit:'cover' }} /> : <div style={{ width:'100%', height:'100%', display:'flex', alignItems:'center', justifyContent:'center', fontFamily:'Bebas Neue,sans-serif', fontSize:10, color:`${color}60` }}>SF</div>}
        </div>
      )}

      {/* label */}
      <div style={{ flex:1, minWidth:0, zIndex:1 }}>
        <div style={{ fontFamily:'Bebas Neue,sans-serif', fontSize:isTop ? 18 : 15, color: isTop ? B.white : '#bbb', letterSpacing:1, whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{label}</div>
        {sub && <div style={{ fontFamily:'Space Mono,monospace', fontSize:8, color:'#555', marginTop:1 }}>{sub}</div>}
      </div>

      {/* metric */}
      <div style={{ textAlign:'right', flexShrink:0, zIndex:1 }}>
        <div style={{ fontFamily:'Orbitron,monospace', fontSize:isTop ? 16 : 13, color: isTop ? color : `${color}99`, fontWeight:700 }}>{metric}</div>
        {metricSub && <div style={{ fontFamily:'Space Mono,monospace', fontSize:7, color:'#444', marginTop:1 }}>{metricSub}</div>}
      </div>
    </div>
  )
}

// ── tabs ───────────────────────────────────────────────────────────────────────
const TABS = [
  { id:'cities',  label:'CITIES',   emoji:'🏙️' },
  { id:'gallery', label:'GALLERY',  emoji:'📸' },
  { id:'traders', label:'TRADERS',  emoji:'👟' },
  { id:'museum',  label:'MUSEUM',   emoji:'🏛️' },
]

// ── main section ───────────────────────────────────────────────────────────────
export default function Leaderboard() {
  const [tab,     setTab]     = useState('cities')
  const [data,    setData]    = useState(null)
  const [ticker,  setTicker]  = useState(0)
  const [tabKey,  setTabKey]  = useState(0)
  const tickRef = useRef(null)

  useEffect(() => {
    setData(readAll())
  }, [])

  useEffect(() => {
    tickRef.current = setInterval(() => setTicker(t => (t + 1) % TICKER_MSGS.length), 4000)
    return () => clearInterval(tickRef.current)
  }, [])

  function switchTab(id) {
    setTab(id)
    setTabKey(k => k + 1)
  }

  if (!data) return null

  const rows = {
    cities: data.cities.map((c, i) => ({
      rank:i+1, label:c.city, sub:c.state,
      metric:c.count.toLocaleString(), metricSub:'RSVPs',
      color:B.amber, maxMetric:data.cities[0]?.count || 1,
      metricRaw:c.count,
    })),
    gallery: data.gallery.length === 0
      ? []
      : data.gallery.map((p, i) => ({
          rank:i+1, label:p.name || 'Anonymous', sub:p.city || '',
          metric:`🔥 ${p.heat || 0}`, metricSub:'heat',
          color:B.neonCyan, maxMetric:data.gallery[0]?.heat || 1,
          metricRaw:p.heat || 0, photo:p.imageData || '',
        })),
    traders: data.trades.length === 0
      ? []
      : data.trades.map((t, i) => ({
          rank:i+1, label:t.name, sub:t.brand + ' · EU ' + t.size,
          metric:`🔥 ${t.wants || 0}`, metricSub:'want this',
          color:B.neonMagenta, maxMetric:data.trades[0]?.wants || 1,
          metricRaw:t.wants || 0,
        })),
    museum: data.museum.map((m, i) => ({
      rank:i+1, label:m.title || m.id, sub:m.amount > 0 ? `${fmt(m.amount - m.start)} above floor` : 'No bid yet',
      metric:m.amount > 0 ? fmt(m.amount) : '—', metricSub:m.amount > 0 ? 'current bid' : 'starting: ' + fmt(m.start),
      color:B.neonLime, maxMetric:data.museum[0]?.amount || 1,
      metricRaw:m.amount,
    })),
  }

  const activeRows  = rows[tab]
  const totalRSVPs  = data.cities.reduce((s, c) => s + c.count, 0)
  const totalHeat   = data.gallery.reduce((s, p) => s + (p.heat || 0), 0)
  const totalWants  = data.trades.reduce((s, t) => s + (t.wants || 0), 0)
  const totalBids   = data.museum.reduce((s, m) => s + (m.amount || 0), 0)

  const summaryVal  = { cities: totalRSVPs.toLocaleString(), gallery: totalHeat || '—', traders: totalWants || '—', museum: totalBids ? fmt(totalBids) : '—' }
  const summaryLbl  = { cities: 'total RSVPs', gallery: 'total heat', traders: 'total wants', museum: 'total bid value' }
  const tabColor    = { cities: B.amber, gallery: B.neonCyan, traders: B.neonMagenta, museum: B.neonLime }
  const emptyMsg    = { gallery:"Community photos will rank here once uploaded.", traders:"Trade listings will rank here once posted.", museum:"Museum bids will rank here once placed.", cities:'' }

  return (
    <section id="leaderboard" style={{ position:'relative', background:`linear-gradient(180deg, ${B.black} 0%, ${B.void} 100%)`, padding:'100px 24px', overflow:'hidden' }}>
      <GrainOverlay />
      <div style={{ position:'absolute', top:'25%', left:'50%', transform:'translate(-50%,-50%)', width:700, height:500, background:`radial-gradient(ellipse, ${B.neonCyan}05 0%, transparent 70%)`, filter:'blur(80px)', pointerEvents:'none' }} />

      <div style={{ position:'relative', zIndex:10, maxWidth:860, margin:'0 auto' }}>

        {/* header */}
        <div style={{ textAlign:'center', marginBottom:40 }}>
          <SectionTag>COMMUNITY RANKINGS</SectionTag>
          <div style={{ fontFamily:"'Bebas Neue', sans-serif", fontSize:'clamp(44px,8vw,80px)', color:B.white, lineHeight:0.88, marginBottom:12 }}>
            WHO'S<br /><span style={{ color:B.neonCyan }}>LEADING THE PACK</span>
          </div>
          {/* live ticker */}
          <div style={{ display:'inline-flex', alignItems:'center', gap:8, padding:'7px 18px', background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.08)', borderRadius:24, marginTop:8 }}>
            <div style={{ width:5, height:5, borderRadius:'50%', background:B.neonLime, boxShadow:`0 0 6px ${B.neonLime}`, animation:'pulse 1.5s infinite' }} />
            <span key={ticker} style={{ fontFamily:'Space Mono,monospace', fontSize:9, color:'#888', animation:'fadeUp 0.4s ease' }}>{TICKER_MSGS[ticker]}</span>
          </div>
        </div>

        {/* tabs */}
        <div style={{ display:'flex', gap:4, marginBottom:28, flexWrap:'wrap' }}>
          {TABS.map(t => {
            const active = tab === t.id
            const c = tabColor[t.id]
            return (
              <button key={t.id} onClick={() => switchTab(t.id)} style={{ flex:'1 1 120px', padding:'12px 8px', background: active ? `${c}18` : 'rgba(255,255,255,0.03)', border:`1px solid ${active ? c+'60' : 'rgba(255,255,255,0.07)'}`, borderRadius:8, cursor:'pointer', transition:'all 0.2s' }}>
                <div style={{ fontSize:18, marginBottom:4 }}>{t.emoji}</div>
                <div style={{ fontFamily:'Orbitron,monospace', fontSize:8, color: active ? c : '#555', letterSpacing:2 }}>{t.label}</div>
              </button>
            )
          })}
        </div>

        {/* summary stat */}
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:20, padding:'14px 20px', background:'rgba(255,255,255,0.02)', border:`1px solid ${tabColor[tab]}20`, borderRadius:10 }}>
          <div style={{ fontFamily:'Orbitron,monospace', fontSize:9, color:'#444', letterSpacing:3 }}>TOTAL {tab.toUpperCase()}</div>
          <div style={{ display:'flex', alignItems:'baseline', gap:8 }}>
            <span style={{ fontFamily:'Orbitron,monospace', fontSize:22, color:tabColor[tab], fontWeight:900 }}>{summaryVal[tab]}</span>
            <span style={{ fontFamily:'Space Mono,monospace', fontSize:9, color:'#444' }}>{summaryLbl[tab]}</span>
          </div>
        </div>

        {/* rows */}
        <div key={tabKey}>
          {activeRows.length === 0 ? (
            <div style={{ textAlign:'center', padding:'60px 0', fontFamily:'Space Mono,monospace', fontSize:11, color:'#333' }}>
              {emptyMsg[tab] || 'No data yet.'}
            </div>
          ) : (
            activeRows.map((row, i) => (
              <RankRow
                key={row.rank}
                {...row}
                maxMetric={activeRows[0]?.metricRaw || 1}
                color={tabColor[tab]}
                photo={tab === 'gallery' ? row.photo : undefined}
                delay={i * 60}
              />
            ))
          )}
        </div>

        <div style={{ textAlign:'center', marginTop:32, fontFamily:'Space Mono,monospace', fontSize:8, color:'#2a2a2a', letterSpacing:2 }}>
          RANKINGS UPDATE IN REAL TIME FROM COMMUNITY ACTIVITY
        </div>
      </div>
    </section>
  )
}
