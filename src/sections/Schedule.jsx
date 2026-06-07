import { useState } from 'react'
import { B } from '../tokens'
import { GrainOverlay, SectionTag } from '../components/Shared'

const PHASES = [
  { label: 'PHASE 1', dates: 'OCT 9 – DEC 4', title: '10-WEEK STREET CAMPAIGN', color: B.neonLime,
    lines: ['16 handpicked teams · 10-a-side half-pitch', 'Wks 1–4: Surulere · Ikeja · Yaba', 'Wks 5–8: Lekki · Ajah · Victoria Island', 'Week 9: Semi-Finals · Dec 4 neutral ground'] },
  { label: 'PHASE 2', dates: 'DEC 11', title: 'STADIUM FINALS NIGHT', color: B.amber,
    lines: ['Mobolaji Johnson Arena · Onikan', 'Pro-grade astroturf · stadium floodlights', 'Live stream · prize distributions', 'Champions crowned on the floor'] },
  { label: 'PHASE 3', dates: 'DEC 11 MIDNIGHT', title: 'LOGISTICS SHIFT', color: B.neonMagenta,
    lines: ['Za.allyErrands freight fleet mobilises', 'Onikan → Muri Okunola Park overnight', 'Audio · lighting · brand backdrops · generators', 'Phalanx node secures park at midnight'] },
  { label: 'PHASE 4', dates: 'DEC 12', title: 'SNEAKER FEST MAIN EVENT', color: B.neonCyan,
    lines: ['Muri Okunola Park · Victoria Island', '30 vendors · horseshoe perimeter layout', 'Streetwear left flank · food right flank', 'Exhibition football zone next to main stage'] },
]

const DAY1 = [
  { time: '5:00',  period: 'PM', title: 'DOORS OPEN — ONIKAN', desc: 'Mobolaji Johnson Arena gates open. Pro-grade astroturf, stadium floodlights, open ocean breezes.', tag: 'OPEN', color: B.neonLime },
  { time: '5:30',  period: 'PM', title: 'SEMIFINALS RECAP', desc: 'Highlights package from the 10-week street campaign plays on the stadium screens. The road to tonight.', tag: 'BROADCAST', color: B.neonCyan },
  { time: '6:00',  period: 'PM', title: 'QUARTER PROGRAMME', desc: 'Street football finals warm-up. All 16 teams walked in under tunnel-dress codes. Full stadium energy.', tag: 'SPORT', color: B.amber },
  { time: '7:00',  period: 'PM', title: 'THE FINAL MATCH', desc: '10-a-side, no offsides, rolling substitutions. Rolling prize distributions. The whole campaign ends here.', tag: 'FINAL', color: B.amber, featured: true },
  { time: '9:00',  period: 'PM', title: 'CHAMPIONS CEREMONY', desc: 'Live gift prize distributions on the pitch. Money is infinite. Production quality is immaculate.', tag: 'CEREMONY', color: B.neonMagenta },
  { time: '10:00', period: 'PM', title: 'HIGH-DEFINITION LIVE STREAM', desc: 'Full match and ceremony streamed live. Catalyst Codes AI bots clip highlights for UK push.', tag: 'MEDIA', color: B.neonCyan },
]

const DAY2 = [
  { time: '12:00', period: 'PM', title: 'DOORS OPEN', desc: 'Gates open. Vendor floor live. 30 confirmed vendors around the horseshoe perimeter.', tag: 'OPEN', color: B.neonLime },
  { time: '12:30', period: 'PM', title: 'VENDOR FLOOR', desc: 'Streetwear left flank. Food right flank. Rare kicks, customs, and drops all day.', tag: 'ALL ACCESS', color: B.neonCyan },
  { time: '2:00',  period: 'PM', title: 'DJ NEPTUNE', desc: 'Opening set — Afrobeats & Street Pop to warm the crowd.', tag: 'MUSIC', color: B.amber },
  { time: '3:00',  period: 'PM', title: 'CUSTOM ART SHOWCASE', desc: 'On-site artists customise your kicks in real time. Bring your canvas.', tag: 'ART', color: B.neonMagenta },
  { time: '4:00',  period: 'PM', title: 'SARZ — PRODUCER SET', desc: 'Live production showcase. Beats made in real time, right in front of you.', tag: 'MUSIC', color: B.amber },
  { time: '5:00',  period: 'PM', title: 'EXCLUSIVE DROP #1', desc: 'First limited release of the day. VIP ticket holders get priority access.', tag: 'DROP', color: B.neonLime },
  { time: '6:00',  period: 'PM', title: 'FRIDAY CHAMPIONS CROWNED', desc: 'The stadium champions are announced live on the main stage — merging the sports and fashion crowds.', tag: 'CROSSOVER', color: B.amber, featured: true },
  { time: '7:00',  period: 'PM', title: 'EXHIBITION FOOTBALL ZONE', desc: 'Saturday night football exhibition next to the stage. The culture stays on the pitch.', tag: 'SPORT', color: B.neonLime },
  { time: '8:00',  period: 'PM', title: 'DJ SPINALL — HEADLINE', desc: "The main event. Lagos' biggest DJ closes the night with the performance of the year.", tag: 'HEADLINE', color: B.neonMagenta, featured: true },
  { time: '10:00', period: 'PM', title: 'DOORS CLOSE', desc: 'Final vendor rounds. Collect your purchases. See you next year.', tag: 'CLOSE', color: B.smoke },
]

function Timeline({ items }) {
  return (
    <div style={{ position:'relative' }}>
      <div style={{ position:'absolute', left:86, top:0, bottom:0, width:1, background:`linear-gradient(${B.amber}00, ${B.gunmetal}80, ${B.amber}40, ${B.gunmetal}80, ${B.amber}00)` }} />
      <div style={{ display:'flex', flexDirection:'column' }}>
        {items.map((item, i) => (
          <div key={i} style={{ display:'flex', alignItems:'flex-start', marginBottom: i < items.length - 1 ? 8 : 0 }}>
            <div style={{ width:86, flexShrink:0, paddingTop:18, paddingRight:18, textAlign:'right' }}>
              <div style={{ fontFamily:"'Orbitron',monospace", fontSize:11, fontWeight:700, color:item.featured ? item.color : item.tag==='CLOSE' ? '#333' : B.smoke, lineHeight:1.2, textShadow:item.featured ? `0 0 12px ${item.color}50` : 'none' }}>{item.time}</div>
              <div style={{ fontFamily:"'Space Mono',monospace", fontSize:7, color:'#333', letterSpacing:'0.1em' }}>{item.period}</div>
            </div>
            <div style={{ flexShrink:0, paddingTop:22, display:'flex', alignItems:'center', justifyContent:'center', width:12 }}>
              <div style={{ width:11, height:11, borderRadius:'50%', background:item.featured ? item.color : item.tag==='CLOSE' ? B.gunmetal : B.charcoal, border:`2px solid ${item.featured ? item.color : item.tag==='CLOSE' ? B.gunmetal : item.color+'60'}`, boxShadow:item.featured ? `0 0 18px ${item.color}80` : 'none', flexShrink:0 }} />
            </div>
            <div
              style={{ flex:1, marginLeft:16, padding:'14px 18px', background:item.featured ? `${item.color}08` : 'rgba(255,255,255,0.025)', border:`1px solid ${item.featured ? item.color+'45' : B.gunmetal}`, borderRadius:8, position:'relative', overflow:'hidden' }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = item.color+'70'; e.currentTarget.style.background = `${item.color}0e` }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = item.featured ? item.color+'45' : B.gunmetal; e.currentTarget.style.background = item.featured ? `${item.color}08` : 'rgba(255,255,255,0.025)' }}
            >
              {item.featured && <div style={{ position:'absolute', left:0, top:0, bottom:0, width:3, background:item.color, boxShadow:`0 0 12px ${item.color}` }} />}
              <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:5, flexWrap:'wrap' }}>
                <div style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:18, color:item.tag==='CLOSE' ? B.smoke : B.white, letterSpacing:'0.04em', lineHeight:1 }}>{item.title}</div>
                <span style={{ padding:'2px 7px', background:item.color+'18', border:`1px solid ${item.color}40`, borderRadius:2, fontFamily:"'Space Mono',monospace", fontSize:7, color:item.color, letterSpacing:'0.12em', whiteSpace:'nowrap' }}>{item.tag}</span>
              </div>
              <div style={{ fontFamily:"'Syne',sans-serif", fontSize:12, color:B.smoke, lineHeight:1.6 }}>{item.desc}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default function Schedule() {
  const [day, setDay] = useState(2)

  return (
    <section id="schedule" style={{ position:'relative', overflow:'hidden', background:B.void, padding:'100px 24px' }}>
      <GrainOverlay />
      <div style={{ position:'absolute', top:'20%', right:'-5%', width:360, height:360, background:`radial-gradient(circle, ${B.neonMagenta}07 0%, transparent 70%)`, filter:'blur(70px)', pointerEvents:'none' }} />
      <div style={{ position:'absolute', bottom:'20%', left:'-5%', width:320, height:320, background:`radial-gradient(circle, ${B.amber}07 0%, transparent 70%)`, filter:'blur(70px)', pointerEvents:'none' }} />

      <div style={{ position:'relative', zIndex:10, maxWidth:820, margin:'0 auto' }}>

        {/* Campaign phases strip */}
        <div style={{ marginBottom:56 }}>
          <div style={{ textAlign:'center', marginBottom:32 }}>
            <SectionTag>THE PHALANX FRAMEWORK</SectionTag>
            <div style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:'clamp(36px,5vw,60px)', color:B.white, lineHeight:0.9 }}>
              4 PHASES. 1 MOVEMENT.
            </div>
            <div style={{ fontFamily:"'Space Mono',sans-serif", fontSize:12, color:B.smoke, marginTop:10 }}>Oct 9, 2026 → Dec 12, 2026 · Za.allyErrands · The Phalanx · The Catalyst Codes</div>
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(180px, 1fr))', gap:12 }}>
            {PHASES.map((ph, i) => (
              <div key={i} style={{ background:'rgba(255,255,255,0.025)', border:`1px solid ${ph.color}30`, borderTop:`2px solid ${ph.color}`, borderRadius:8, padding:'18px 16px' }}>
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:8 }}>
                  <div style={{ fontFamily:"'Space Mono',monospace", fontSize:7, color:ph.color, letterSpacing:2 }}>{ph.label}</div>
                  <div style={{ fontFamily:"'Orbitron',monospace", fontSize:7, color:'#444', letterSpacing:1 }}>{ph.dates}</div>
                </div>
                <div style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:14, color:B.white, letterSpacing:'0.05em', marginBottom:10 }}>{ph.title}</div>
                {ph.lines.map((l, j) => (
                  <div key={j} style={{ fontFamily:"'Space Mono',monospace", fontSize:7, color:'#555', lineHeight:1.9, borderLeft:`1px solid ${ph.color}25`, paddingLeft:8 }}>{l}</div>
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* Day selector */}
        <div style={{ textAlign:'center', marginBottom:40 }}>
          <SectionTag>{day === 1 ? 'DECEMBER 11, 2026' : 'DECEMBER 12, 2026'}</SectionTag>
          <div style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:'clamp(40px,6vw,68px)', color:B.white, lineHeight:0.9 }}>
            EVENT<br /><span style={{ color:B.amber }}>SCHEDULE</span>
          </div>
          <div style={{ display:'flex', gap:10, justifyContent:'center', marginTop:20 }}>
            {[
              { d:1, label:'DEC 11 · STADIUM FINALS', venue:'Mobolaji Johnson Arena, Onikan' },
              { d:2, label:'DEC 12 · SNEAKER FEST', venue:'Muri Okunola Park, V/I' },
            ].map(({ d, label, venue }) => (
              <button key={d} onClick={() => setDay(d)} style={{ padding:'10px 20px', background:day===d ? `${B.amber}15` : 'transparent', border:`1px solid ${day===d ? B.amber : B.gunmetal}`, borderRadius:6, cursor:'pointer', textAlign:'left' }}>
                <div style={{ fontFamily:"'Space Mono',monospace", fontSize:8, color:day===d ? B.amber : B.smoke, letterSpacing:2, marginBottom:3 }}>{label}</div>
                <div style={{ fontFamily:"'Syne',sans-serif", fontSize:11, color:day===d ? B.white : '#444' }}>{venue}</div>
              </button>
            ))}
          </div>
        </div>

        <Timeline items={day === 1 ? DAY1 : DAY2} />

        <div style={{ marginTop:36, padding:'20px 24px', background:B.charcoal, border:`1px solid ${B.gunmetal}`, borderRadius:8, display:'flex', justifyContent:'space-between', alignItems:'center', flexWrap:'wrap', gap:12 }}>
          <div style={{ fontFamily:"'Space Mono',monospace", fontSize:8, color:B.smoke, letterSpacing:'0.15em', lineHeight:1.7 }}>
            SCHEDULE SUBJECT TO CHANGE<br />
            <span style={{ color:'#333' }}>FOLLOW @SNEAKERSFEST FOR LIVE UPDATES</span>
          </div>
          <a href="#tickets" style={{ padding:'10px 20px', background:B.amber, color:B.black, fontFamily:"'Space Mono',monospace", fontSize:8, fontWeight:700, letterSpacing:'0.15em', textDecoration:'none', borderRadius:2, whiteSpace:'nowrap' }}>SECURE YOUR SPOT →</a>
        </div>
      </div>
    </section>
  )
}
