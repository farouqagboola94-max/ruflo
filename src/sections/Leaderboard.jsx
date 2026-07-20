import { useState, useEffect, useRef } from 'react'
import { B } from '../tokens'
import { GrainOverlay, SectionTag } from '../components/Shared'
import Egg from '../components/Egg'
import { getPassport, getTier, getLevel, XP_VALUES, GRAND_PRIZE_RANK } from '../lib/passport'

// ── static seed data ──────────────────────────────────────────────────────────
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

// simulated rank deltas for city seeds (positive = climbed, negative = dropped)
const CITY_DELTAS = {
  'Lagos': 0, 'Abuja': 1, 'Port Harcourt': -1, 'Ibadan': 2,
  'Kano': -1, 'Enugu': 1, 'Benin City': 0, 'Warri': -1,
  'Aba': 3, 'Kaduna': -2,
}

const AW = {
  aw1:{ title:'Lagos at Dawn',    start:180000 },
  aw2:{ title:'Sole Supremacy',   start:95000  },
  aw3:{ title:'Neon Void I',      start:320000 },
  aw4:{ title:'The Movement',     start:150000 },
  aw5:{ title:'Alté Altar',       start:500000 },
  aw6:{ title:'Market Day',       start:65000  },
  aw7:{ title:'Dec 12 Prophesy',  start:750000 },
  aw8:{ title:'Grail Keeper',     start:220000 },
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

const COLLECTOR_SEEDS = [
  { id:'c1',  name:'Tunde B.',  city:'Lagos',  pts:1240, delta:2,  badges:'🔥 STREAK 7 · 🥇 TOP BIDDER'     },
  { id:'c2',  name:'Chisom O.', city:'Abuja',  pts:980,  delta:0,  badges:'📸 GALLERY ACE · 🎯 RAFFLE KING' },
  { id:'c3',  name:'Adaeze N.', city:'PH',     pts:875,  delta:-1, badges:'👟 TRADE GOD'                     },
  { id:'c4',  name:'Emeka C.',  city:'Enugu',  pts:720,  delta:3,  badges:'🔥 STREAK 3'                      },
  { id:'c5',  name:'Zara I.',   city:'Lagos',  pts:645,  delta:1,  badges:''                                  },
  { id:'c6',  name:'Femi A.',   city:'Ibadan', pts:520,  delta:-2, badges:'📸 GALLERY ACE'                   },
  { id:'c7',  name:'Ngozi E.',  city:'Benin',  pts:415,  delta:0,  badges:'🎯 RAFFLE KING'                   },
  { id:'c8',  name:'Dayo M.',   city:'Kano',   pts:380,  delta:1,  badges:'🔥 STREAK 3'                      },
  { id:'c9',  name:'Kemi S.',   city:'Lagos',  pts:295,  delta:0,  badges:''                                  },
  { id:'c10', name:'Bola T.',   city:'Abuja',  pts:210,  delta:-1, badges:''                                  },
]

function getWeeklyReset() {
  const now = new Date()
  const daysUntilMon = (8 - now.getDay()) % 7 || 7
  const reset = new Date(now); reset.setDate(now.getDate() + daysUntilMon); reset.setHours(0,0,0,0)
  const diff = reset - now
  return `${Math.floor(diff/86400000)}d ${Math.floor((diff%86400000)/3600000)}h`
}

const fmt = n => '₦' + Number(n).toLocaleString('en-NG')
const MEDAL = { 1:'🥇', 2:'🥈', 3:'🥉' }

const SHOW_OPTIONS = [
  { label:'TOP 3',  value:3  },
  { label:'TOP 5',  value:5  },
  { label:'TOP 10', value:10 },
  { label:'ALL',    value:99 },
]

// ── read localStorage once ──────────────────────────────────────────────────────
function readAll() {
  const get = (k, d) => { try { return JSON.parse(localStorage.getItem(k) || d) } catch { return JSON.parse(d) } }

  const gallery        = get('sf26_gallery',       '[]')
  const trades         = get('sf26_trades',         'null') || []
  const bids           = get('sf26_museum_bids',    '{}')
  const raffleEntries  = get('sf26_raffle_entries', '{}')

  const cityMap = {}
  CITY_SEEDS.forEach(c => { cityMap[c.city] = { ...c } })
  Object.values(raffleEntries).forEach(e => {
    const city = e?.city?.trim()
    if (!city) return
    if (cityMap[city]) cityMap[city].count += 1
    else cityMap[city] = { city, state:'Nigeria', count:1 }
  })
  const cities = Object.values(cityMap).sort((a, b) => b.count - a.count).slice(0, 10)

  const galleryRanked = [...gallery].sort((a, b) => (b.heat || 0) - (a.heat || 0)).slice(0, 10)
  const tradesRanked  = [...trades].sort((a, b) => (b.wants || 0) - (a.wants || 0)).slice(0, 10)

  const museumRanked = Object.entries(bids)
    .filter(([, v]) => v > 0)
    .map(([id, amount]) => ({ id, ...AW[id], amount }))
    .sort((a, b) => b.amount - a.amount)
  Object.entries(AW).forEach(([id, aw]) => {
    if (!bids[id]) museumRanked.push({ id, ...aw, amount:0 })
  })

  return { cities, gallery:galleryRanked, trades:tradesRanked, museum:museumRanked }
}

// ── delta badge ────────────────────────────────────────────────────────────────
function DeltaBadge({ delta }) {
  if (delta === null || delta === undefined) return null
  if (delta === 0) return (
    <span style={{ fontFamily:'Space Mono,monospace', fontSize:8, color:'#333', letterSpacing:0 }}>—</span>
  )
  const up   = delta > 0
  const color = up ? B.neonLime : B.neonMagenta
  return (
    <span style={{ display:'inline-flex', alignItems:'center', gap:2, fontFamily:'Orbitron,monospace', fontSize:8, color, fontWeight:700 }}>
      {up ? '▲' : '▼'}{Math.abs(delta)}
    </span>
  )
}

// ── rank row ───────────────────────────────────────────────────────────────────
function RankRow({ rank, label, sub, metric, metricSub, color, maxMetric, metricRaw, photo, delay, delta, grandPrize }) {
  const [visible, setVisible] = useState(false)
  useEffect(() => { const t = setTimeout(() => setVisible(true), delay); return () => clearTimeout(t) }, [delay])

  const pct   = maxMetric > 0 ? (metricRaw / maxMetric) * 100 : 0
  const isTop = rank <= 3
  const highlightColor = isTop ? color : (grandPrize ? B.amber : null)

  return (
    <div style={{
      display:'flex', alignItems:'center', gap:12, padding:'13px 0',
      borderBottom:'1px solid rgba(255,255,255,0.05)',
      borderLeft: highlightColor ? `2px solid ${highlightColor}` : '2px solid transparent',
      paddingLeft: highlightColor ? 10 : 0,
      position:'relative',
      opacity:visible ? 1 : 0,
      transform:visible ? 'translateY(0)' : 'translateY(14px)',
      transition:'opacity 0.35s ease, transform 0.35s ease',
      boxShadow: isTop ? `inset 0 0 32px ${color}06` : 'none',
    }}>
      {/* bar bg */}
      <div style={{ position:'absolute', inset:0, background:`${color}07`, width:`${pct}%`, borderRadius:4, pointerEvents:'none', transition:'width 0.7s ease' }} />

      {/* rank badge */}
      <div style={{ width:36, textAlign:'center', flexShrink:0, zIndex:1 }}>
        {isTop
          ? <span style={{ fontSize:20, filter: rank === 1 ? `drop-shadow(0 0 6px ${color})` : 'none' }}>{MEDAL[rank]}</span>
          : grandPrize
            ? <span style={{ fontFamily:'Orbitron,monospace', fontSize:9, color:B.amber, fontWeight:700 }}>🏆{rank}</span>
            : <span style={{ fontFamily:'Orbitron,monospace', fontSize:11, color:'#444', fontWeight:700 }}>#{rank}</span>
        }
      </div>

      {/* photo thumbnail */}
      {photo !== undefined && (
        <div style={{ width:38, height:38, borderRadius:7, overflow:'hidden', flexShrink:0, background:'rgba(255,255,255,0.05)', border:`1px solid rgba(255,255,255,0.08)`, zIndex:1 }}>
          {photo
            ? <img src={photo} alt="" style={{ width:'100%', height:'100%', objectFit:'cover' }} />
            : <div style={{ width:'100%', height:'100%', display:'flex', alignItems:'center', justifyContent:'center', fontFamily:'Bebas Neue,sans-serif', fontSize:10, color:`${color}60` }}>SF</div>
          }
        </div>
      )}

      {/* label */}
      <div style={{ flex:1, minWidth:0, zIndex:1 }}>
        <div style={{ fontFamily:'Bebas Neue,sans-serif', fontSize:isTop ? 19 : 15, color:isTop ? B.white : '#bbb', letterSpacing:1, whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{label}</div>
        {sub && <div style={{ fontFamily:'Space Mono,monospace', fontSize:8, color:'#555', marginTop:1 }}>{sub}</div>}
      </div>

      {/* delta */}
      <div style={{ width:28, textAlign:'center', flexShrink:0, zIndex:1 }}>
        <DeltaBadge delta={delta} />
      </div>

      {/* metric */}
      <div style={{ textAlign:'right', flexShrink:0, zIndex:1 }}>
        <div style={{ fontFamily:'Orbitron,monospace', fontSize:isTop ? 16 : 13, color:isTop ? color : `${color}90`, fontWeight:700 }}>{metric}</div>
        {metricSub && <div style={{ fontFamily:'Space Mono,monospace', fontSize:7, color:'#444', marginTop:1 }}>{metricSub}</div>}
      </div>
    </div>
  )
}

// ── tabs ──────────────────────────────────────────────────────────────────────
const TABS = [
  { id:'collectors', label:'COLLECTORS', emoji:'👑' },
  { id:'cities',     label:'CITIES',     emoji:'🏙️' },
  { id:'gallery',    label:'GALLERY',    emoji:'📸' },
  { id:'traders',    label:'TRADERS',    emoji:'👟' },
  { id:'museum',     label:'MUSEUM',     emoji:'🏛️' },
]

// ── main section ────────────────────────────────────────────────────────────────
export default function Leaderboard() {
  const [tab,            setTab]            = useState('cities')
  const [data,           setData]           = useState(null)
  const [ticker,         setTicker]         = useState(0)
  const [tabKey,         setTabKey]         = useState(0)
  const [showCount,      setShowCount]      = useState(10)
  const [copied,         setCopied]         = useState(false)
  const [liveBoard,      setLiveBoard]      = useState([])
  const [liveBoardReady, setLiveBoardReady] = useState(false)
  const tickRef = useRef(null)

  useEffect(() => { setData(readAll()) }, [])

  useEffect(() => {
    fetch('/.netlify/functions/leaderboard?limit=10')
      .then(r => r.ok ? r.json() : null)
      .then(d => {
        if (d?.leaderboard?.length) {
          setLiveBoard(d.leaderboard)
          setLiveBoardReady(true)
        }
      })
      .catch(() => {})
  }, [])

  useEffect(() => {
    tickRef.current = setInterval(() => setTicker(t => (t + 1) % TICKER_MSGS.length), 4000)
    return () => clearInterval(tickRef.current)
  }, [])

  function switchTab(id) {
    setTab(id)
    setTabKey(k => k + 1)
  }

  function handleShare(rows) {
    const top3 = rows.slice(0, 3).map((r, i) => `${MEDAL[i+1] || '#'+(i+1)} ${r.label} · ${r.metric}`).join('\n')
    const text = `🏆 Sneakers Fest '26 — ${tab.toUpperCase()} RANKINGS\n\n${top3}\n\nsneakersfest.com`
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2200)
    }).catch(() => {})
  }

  if (!data) return null

  const tabColor = { collectors:'#C084FC', cities:B.amber, gallery:B.neonCyan, traders:B.neonMagenta, museum:B.neonLime }

  const collectorRows = liveBoardReady
    ? liveBoard.map((c, i) => ({
        rank:i+1, label:c.name, sub:`${c.tierIcon || ''} ${c.tier} · #${c.position}`,
        metric:`${c.referralCount} REFS`, metricSub:'referrals',
        color:'#C084FC', metricRaw:c.referralCount, delta:null,
        grandPrize: i < GRAND_PRIZE_RANK,
      }))
    : COLLECTOR_SEEDS.map((c, i) => ({
        rank:i+1, label:c.name, sub:c.city + (c.badges ? ' · ' + c.badges : ''),
        metric:`${c.pts.toLocaleString()} PTS`, metricSub:'points',
        color:'#C084FC', metricRaw:c.pts, delta:c.delta,
        grandPrize: i < GRAND_PRIZE_RANK,
      }))

  const buildRows = {
    collectors: collectorRows,
    cities: data.cities.map((c, i) => ({
      rank:i+1, label:c.city, sub:c.state,
      metric:c.count.toLocaleString(), metricSub:'RSVPs',
      color:B.amber, metricRaw:c.count,
      delta: CITY_DELTAS[c.city] ?? null,
    })),
    gallery: data.gallery.map((p, i) => ({
      rank:i+1, label:p.name || 'Anonymous', sub:p.city || '',
      metric:`🔥 ${p.heat || 0}`, metricSub:'heat',
      color:B.neonCyan, metricRaw:p.heat || 0, photo:p.imageData || '',
      delta: null,
    })),
    traders: data.trades.map((t, i) => ({
      rank:i+1, label:t.name, sub:t.brand + ' · EU ' + t.size,
      metric:`🔥 ${t.wants || 0}`, metricSub:'want this',
      color:B.neonMagenta, metricRaw:t.wants || 0,
      delta: null,
    })),
    museum: data.museum.map((m, i) => ({
      rank:i+1, label:m.title || m.id,
      sub:m.amount > 0 ? `${fmt(m.amount - m.start)} above floor` : 'No bid yet',
      metric:m.amount > 0 ? fmt(m.amount) : '—',
      metricSub:m.amount > 0 ? 'current bid' : 'floor: ' + fmt(m.start),
      color:B.neonLime, metricRaw:m.amount,
      delta: null,
    })),
  }

  const allRows    = buildRows[tab]
  const activeRows = allRows.slice(0, showCount)
  const maxMetric  = allRows[0]?.metricRaw || 1

  const totalRSVPs = data.cities.reduce((s, c) => s + c.count, 0)
  const totalHeat  = data.gallery.reduce((s, p) => s + (p.heat || 0), 0)
  const totalWants = data.trades.reduce((s, t) => s + (t.wants || 0), 0)
  const totalBids  = data.museum.reduce((s, m) => s + (m.amount || 0), 0)

  const collectorsSum = liveBoardReady
    ? liveBoard.reduce((s, c) => s + c.referralCount, 0).toLocaleString() + ' refs'
    : COLLECTOR_SEEDS.reduce((s, c) => s + c.pts, 0).toLocaleString()
  const summaryVal = { collectors:collectorsSum, cities:totalRSVPs.toLocaleString(), gallery:totalHeat || '—', traders:totalWants || '—', museum:totalBids ? fmt(totalBids) : '—' }
  const summaryLbl = { collectors: liveBoardReady ? 'total referrals' : 'total pts banked', cities:'total RSVPs', gallery:'total heat', traders:'total wants', museum:'total bid value' }
  const emptyMsg   = { collectors:'Collectors rank here as community activity accumulates.', gallery:'Community photos will rank here once uploaded.', traders:'Trade listings will rank here once posted.', museum:'Museum bids will rank here once placed.', cities:'' }

  const accent = tabColor[tab]

  return (
    <section id="leaderboard" style={{ position:'relative', background:`linear-gradient(180deg, ${B.black} 0%, ${B.void} 100%)`, padding:'100px 24px', overflow:'hidden' }}>
      <GrainOverlay />
      <Egg id="egg-073" corner="top-right" />
      <Egg id="egg-074" corner="bottom-left" />
      <div style={{ position:'absolute', top:'25%', left:'50%', transform:'translate(-50%,-50%)', width:700, height:500, background:`radial-gradient(ellipse, ${B.neonCyan}05 0%, transparent 70%)`, filter:'blur(80px)', pointerEvents:'none' }} />

      <div style={{ position:'relative', zIndex:10, maxWidth:860, margin:'0 auto' }}>

        {/* header */}
        <div style={{ textAlign:'center', marginBottom:24 }}>
          <SectionTag>COMMUNITY RANKINGS</SectionTag>
          <div className="reveal-3d text-3d" style={{ fontFamily:"'Bebas Neue', sans-serif", fontSize:'clamp(44px,8vw,80px)', color:B.white, lineHeight:0.88, marginBottom:12 }}>
            WHO'S<br /><span style={{ color:B.neonCyan }}>LEADING THE PACK</span>
          </div>
          {/* live ticker */}
          <div style={{ display:'inline-flex', alignItems:'center', gap:8, padding:'7px 18px', background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.08)', borderRadius:24, marginTop:8 }}>
            <div style={{ width:5, height:5, borderRadius:'50%', background:B.neonLime, boxShadow:`0 0 6px ${B.neonLime}`, animation:'pulse 1.5s infinite' }} />
            <span key={ticker} style={{ fontFamily:'Space Mono,monospace', fontSize:9, color:'#888', animation:'fadeUp 0.4s ease' }}>{TICKER_MSGS[ticker]}</span>
          </div>
        </div>

        {/* grand prize banner */}
        <div className="card-3d" style={{ textAlign:'center', marginBottom:28, padding:'12px 18px', background:`${B.amber}10`, border:`1px solid ${B.amber}30`, borderRadius:10 }}>
          <span style={{ fontFamily:'Space Mono,monospace', fontSize:10, color:B.amber, letterSpacing:1 }}>
            🏆 THE TOP {GRAND_PRIZE_RANK} HIGHEST-XP COLLECTORS WIN GRAND PRIZES AT THE EVENT — EVERY GAME, BID, AND POST MOVES YOU UP
          </span>
        </div>

        {/* category tabs */}
        <div style={{ display:'flex', gap:4, marginBottom:28, flexWrap:'wrap' }}>
          {TABS.map(t => {
            const active = tab === t.id
            const c = tabColor[t.id]
            return (
              <button key={t.id} onClick={() => switchTab(t.id)} style={{ flex:'1 1 120px', padding:'12px 8px', background:active ? `${c}18` : 'rgba(255,255,255,0.03)', border:`1px solid ${active ? c+'60' : 'rgba(255,255,255,0.07)'}`, borderRadius:8, cursor:'pointer', transition:'all 0.2s' }}>
                <div style={{ fontSize:18, marginBottom:4 }}>{t.emoji}</div>
                <div style={{ fontFamily:'Orbitron,monospace', fontSize:8, color:active ? c : '#555', letterSpacing:2 }}>{t.label}</div>
              </button>
            )
          })}
        </div>

        {/* summary + filter row */}
        <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:20, flexWrap:'wrap' }}>
          <div className="card-3d" style={{ flex:1, minWidth:180, padding:'12px 18px', background:'rgba(255,255,255,0.02)', border:`1px solid ${accent}20`, borderRadius:10, display:'flex', justifyContent:'space-between', alignItems:'center' }}>
            <div style={{ fontFamily:'Orbitron,monospace', fontSize:9, color:'#444', letterSpacing:3 }}>TOTAL</div>
            <div style={{ display:'flex', alignItems:'baseline', gap:8 }}>
              <span style={{ fontFamily:'Orbitron,monospace', fontSize:20, color:accent, fontWeight:900 }}>{summaryVal[tab]}</span>
              <span style={{ fontFamily:'Space Mono,monospace', fontSize:9, color:'#444' }}>{summaryLbl[tab]}</span>
            </div>
          </div>
          {/* weekly reset */}
          <div style={{ padding:'8px 12px', background:'rgba(255,255,255,0.02)', border:'1px solid rgba(255,255,255,0.06)', borderRadius:6, flexShrink:0 }}>
            <div style={{ fontFamily:'Space Mono,monospace', fontSize:6, color:'#333', letterSpacing:2 }}>RESETS IN</div>
            <div style={{ fontFamily:'Orbitron,monospace', fontSize:10, color:'#555', fontWeight:700 }}>{getWeeklyReset()}</div>
          </div>
          {/* count filter pills */}
          <div style={{ display:'flex', gap:4 }}>
            {SHOW_OPTIONS.map(opt => {
              const active = showCount === opt.value
              return (
                <button key={opt.value} onClick={() => setShowCount(opt.value)}
                  style={{ padding:'8px 12px', background:active ? `${accent}20` : 'rgba(255,255,255,0.03)', border:`1px solid ${active ? accent+'60' : 'rgba(255,255,255,0.07)'}`, borderRadius:6, cursor:'pointer', fontFamily:'Orbitron,monospace', fontSize:8, color:active ? accent : '#444', letterSpacing:1.5, transition:'all 0.18s', whiteSpace:'nowrap' }}>
                  {opt.label}
                </button>
              )
            })}
          </div>
        </div>

        {/* column header */}
        <div style={{ display:'flex', alignItems:'center', gap:12, padding:'0 0 8px', borderBottom:`1px solid ${accent}20`, marginBottom:4 }}>
          <div style={{ width:36, flexShrink:0 }} />
          {tab === 'gallery' && <div style={{ width:38, flexShrink:0 }} />}
          <div style={{ flex:1, fontFamily:'Space Mono,monospace', fontSize:8, color:'#333', letterSpacing:2 }}>NAME</div>
          <div style={{ width:28, textAlign:'center', fontFamily:'Space Mono,monospace', fontSize:8, color:'#333', letterSpacing:1 }}>MOVE</div>
          <div style={{ textAlign:'right', fontFamily:'Space Mono,monospace', fontSize:8, color:'#333', letterSpacing:2 }}>SCORE</div>
        </div>

        {/* rows */}
        <div key={tabKey}>
          {allRows.length === 0 ? (
            <div style={{ textAlign:'center', padding:'60px 0', fontFamily:'Space Mono,monospace', fontSize:11, color:'#333' }}>
              {emptyMsg[tab] || 'No data yet.'}
            </div>
          ) : (
            activeRows.map((row, i) => (
              <RankRow
                key={row.rank}
                {...row}
                maxMetric={maxMetric}
                color={accent}
                photo={tab === 'gallery' ? row.photo : undefined}
                delay={i * 55}
              />
            ))
          )}
        </div>

        {/* show-more hint */}
        {allRows.length > showCount && (
          <div style={{ textAlign:'center', marginTop:16 }}>
            <button onClick={() => setShowCount(99)}
              style={{ padding:'8px 24px', background:'rgba(255,255,255,0.03)', border:`1px solid ${accent}30`, borderRadius:20, cursor:'pointer', fontFamily:'Space Mono,monospace', fontSize:9, color:'#555', letterSpacing:1, transition:'all 0.2s' }}
              onMouseEnter={e => { e.currentTarget.style.color = accent; e.currentTarget.style.borderColor = accent+'60' }}
              onMouseLeave={e => { e.currentTarget.style.color = '#555'; e.currentTarget.style.borderColor = accent+'30' }}>
              SHOW ALL {allRows.length} →
            </button>
          </div>
        )}

        {/* share button */}
        {allRows.length > 0 && (
          <div style={{ textAlign:'center', marginTop:32 }}>
            <button onClick={() => handleShare(allRows)}
              style={{ display:'inline-flex', alignItems:'center', gap:10, padding:'12px 28px', background:copied ? `${accent}20` : 'rgba(255,255,255,0.03)', border:`1px solid ${copied ? accent+'60' : 'rgba(255,255,255,0.1)'}`, borderRadius:10, cursor:'pointer', fontFamily:'Orbitron,monospace', fontSize:9, color:copied ? accent : '#555', letterSpacing:2, transition:'all 0.25s' }}
              onMouseEnter={e => { if (!copied) { e.currentTarget.style.color = accent; e.currentTarget.style.borderColor = accent+'50' } }}
              onMouseLeave={e => { if (!copied) { e.currentTarget.style.color = '#555'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)' } }}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 12v8a2 2 0 002 2h12a2 2 0 002-2v-8M16 6l-4-4-4 4M12 2v13"/>
              </svg>
              {copied ? 'COPIED TO CLIPBOARD ✓' : `SHARE ${tab.toUpperCase()} RANKINGS`}
            </button>
          </div>
        )}

        {/* MY RANK panel */}
        {(() => {
          try {
            const entries = JSON.parse(localStorage.getItem('sf26_raffle_entries') || '{}')
            const myName  = Object.values(entries)[0]?.name
            const rafflePts = Object.values(entries).reduce((s,e) => s + (e.packCount||1)*XP_VALUES.quickTask, 0)
            const galleryItems = JSON.parse(localStorage.getItem('sf26_gallery') || '[]')
            const galPts = galleryItems.length * XP_VALUES.contribution
            const bidsObj = JSON.parse(localStorage.getItem('sf26_museum_bids') || '{}')
            const bidPts = Object.values(bidsObj).filter(b => b > 0).length * XP_VALUES.bigCommitment
            const { xp: total } = getPassport()
            const tier = getTier(total)
            const level = getLevel(total)
            if (!total && !myName) return null
            const rank = COLLECTOR_SEEDS.filter(c => c.pts > total).length + 1
            const inGrandPrizeZone = rank <= GRAND_PRIZE_RANK
            const spotsAway = rank - GRAND_PRIZE_RANK
            return (
              <div className="card-3d" style={{ marginTop:28, padding:'20px 24px', background: inGrandPrizeZone ? `${B.amber}08` : 'rgba(255,255,255,0.02)', border:`1px solid ${inGrandPrizeZone ? B.amber+'40' : '#C084FC20'}`, borderRadius:12 }}>
                <div style={{ fontFamily:'Orbitron,monospace', fontSize:8, color:'#444', letterSpacing:3, marginBottom:12 }}>
                  MY RANK · <span style={{ color:tier.color }}>{tier.name}</span> · <span style={{ color:B.neonLime }}>LV {level.level}</span>
                </div>
                <div style={{ display:'flex', alignItems:'center', gap:16, flexWrap:'wrap' }}>
                  <div style={{ display:'flex', alignItems:'baseline', gap:6 }}>
                    <span style={{ fontFamily:'Orbitron,monospace', fontSize:32, color:'#C084FC', fontWeight:900 }}>#{rank}</span>
                    <span style={{ fontFamily:'Space Mono,monospace', fontSize:8, color:'#444' }}>of {COLLECTOR_SEEDS.length + 1}</span>
                  </div>
                  <div style={{ flex:1, minWidth:120 }}>
                    {myName && <div style={{ fontFamily:'Bebas Neue,sans-serif', fontSize:18, color:B.white, letterSpacing:1 }}>{myName}</div>}
                    <div style={{ fontFamily:'Orbitron,monospace', fontSize:14, color:'#C084FC', fontWeight:700 }}>{total.toLocaleString()} PTS</div>
                  </div>
                  <div style={{ display:'flex', gap:12, flexWrap:'wrap' }}>
                    {rafflePts > 0 && <div style={{ textAlign:'center' }}><div style={{ fontFamily:'Orbitron,monospace', fontSize:11, color:B.amber }}>{rafflePts}</div><div style={{ fontFamily:'Space Mono,monospace', fontSize:6, color:'#444' }}>RAFFLE</div></div>}
                    {galPts > 0 && <div style={{ textAlign:'center' }}><div style={{ fontFamily:'Orbitron,monospace', fontSize:11, color:B.neonCyan }}>{galPts}</div><div style={{ fontFamily:'Space Mono,monospace', fontSize:6, color:'#444' }}>GALLERY</div></div>}
                    {bidPts > 0 && <div style={{ textAlign:'center' }}><div style={{ fontFamily:'Orbitron,monospace', fontSize:11, color:B.neonLime }}>{bidPts}</div><div style={{ fontFamily:'Space Mono,monospace', fontSize:6, color:'#444' }}>BIDS</div></div>}
                  </div>
                </div>
                <div style={{ fontFamily:'Space Mono,monospace', fontSize:9, color: inGrandPrizeZone ? B.amber : '#666', letterSpacing:1, marginTop:14 }}>
                  {inGrandPrizeZone
                    ? `🏆 YOU'RE IN THE GRAND PRIZE ZONE — TOP ${GRAND_PRIZE_RANK} XP EARNERS WIN AT THE EVENT`
                    : `${spotsAway} spot${spotsAway === 1 ? '' : 's'} from the Grand Prize Zone (top ${GRAND_PRIZE_RANK})`}
                </div>
                <div style={{ fontFamily:'Space Mono,monospace', fontSize:7, color:'#2a2a2a', letterSpacing:1, marginTop:8 }}>XP SOURCED FROM YOUR SNEAKER PASSPORT · SEE FULL BREAKDOWN IN THE PASSPORT SECTION</div>
              </div>
            )
          } catch { return null }
        })()}

        <div style={{ textAlign:'center', marginTop:24, fontFamily:'Space Mono,monospace', fontSize:8, color:'#2a2a2a', letterSpacing:2 }}>
          RANKINGS UPDATE IN REAL TIME FROM COMMUNITY ACTIVITY
        </div>
      </div>
    </section>
  )
}
