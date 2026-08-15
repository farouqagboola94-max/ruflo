// The running order, in one place.
//
// Lifted out of Schedule.jsx so the section that displays it and the planner
// that lets you pick from it cannot drift apart. Artist names stay classified
// here exactly as they do on the page.

import { B } from '../tokens.js'

const PHASES = [
  { label: 'PHASE 1', dates: 'OCT 9 – DEC 4', title: '10-WEEK STREET CAMPAIGN', color: B.neonLime,
    lines: ['16 handpicked teams · 10-a-side half-pitch', 'Wks 1–4: Surulere · Ikeja · Yaba', 'Wks 5–8: Lekki · Ajah · Victoria Island', 'Week 9: Semi-Finals · Dec 4 neutral ground'] },
  { label: 'PHASE 2', dates: 'DEC 11', title: 'STADIUM FINALS NIGHT', color: B.amber,
    lines: ['Mobolaji Johnson Arena · Onikan', 'Pro-grade astroturf · stadium floodlights', 'Live stream · prize distributions', 'Champions crowned on the floor'] },
  { label: 'PHASE 3', dates: 'DEC 11 MIDNIGHT', title: 'LOGISTICS SHIFT', color: B.neonMagenta,
    lines: ['Za.allyErrands freight fleet mobilises', 'Onikan → Muri Okunola Park overnight', 'Audio · lighting · brand backdrops · generators', 'Phalanx node secures park at midnight'] },
  { label: 'PHASE 4', dates: 'DEC 12', title: 'SNEAKER FEST MAIN EVENT', color: B.neonCyan,
    lines: ['Muri Okunola Park · Victoria Island', '30+ vendors · horseshoe perimeter layout', 'Streetwear left flank · food right flank', 'Exhibition football zone next to main stage'] },
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
  { time: '12:00', period: 'PM', title: 'DOORS OPEN', desc: 'Gates open. Vendor floor live. 30+ confirmed vendors around the horseshoe perimeter.', tag: 'OPEN', color: B.neonLime },
  { time: '12:30', period: 'PM', title: 'VENDOR FLOOR', desc: 'Streetwear left flank. Food right flank. Rare kicks, customs, and drops all day.', tag: 'ALL ACCESS', color: B.neonCyan },
  { time: '1:00',  period: 'PM', title: '⧡ LIVE ACT — CLASSIFIED', desc: 'A special live performance to open the afternoon. Artist details dropping soon.', tag: 'LIVE', color: B.neonMagenta, featured: true, stage: 'MAIN STAGE' },
  { time: '2:00',  period: 'PM', title: '⧡ DJ SET — CLASSIFIED', desc: 'Opening DJ set to warm the crowd and keep the energy moving all afternoon.', tag: 'MUSIC', color: B.amber, stage: 'MAIN STAGE' },
  { time: '3:00',  period: 'PM', title: 'CUSTOM ART SHOWCASE', desc: 'On-site artists customise your kicks in real time. Bring your canvas pair.', tag: 'ART', color: B.neonMagenta, stage: 'ART ZONE' },
  { time: '4:00',  period: 'PM', title: '⧡ PRODUCER SET — CLASSIFIED', desc: 'Live production showcase. Beats made in real time, right in front of you.', tag: 'MUSIC', color: B.amber, stage: 'MAIN STAGE' },
  { time: '5:00',  period: 'PM', title: 'EXCLUSIVE DROP #1', desc: 'First limited release of the day. VIP ticket holders get priority access.', tag: 'DROP', color: B.neonLime, stage: 'DROP ZONE' },
  { time: '6:00',  period: 'PM', title: 'FRIDAY CHAMPIONS CROWNED', desc: 'The stadium champions are announced live on the main stage — merging the sports and fashion crowds.', tag: 'CROSSOVER', color: B.amber, featured: true, stage: 'MAIN STAGE' },
  { time: '7:00',  period: 'PM', title: 'EXHIBITION FOOTBALL ZONE', desc: 'Saturday night football exhibition next to the stage. The culture stays on the pitch.', tag: 'SPORT', color: B.neonLime, stage: 'SPORT ZONE' },
  { time: '8:00',  period: 'PM', title: '⧡ HEADLINE ACT — CLASSIFIED', desc: 'The main event. A headline act closes the night with the performance of the year.', tag: 'HEADLINE', color: B.neonMagenta, featured: true, stage: 'MAIN STAGE' },
  { time: '10:00', period: 'PM', title: 'DOORS CLOSE', desc: 'Final vendor rounds. Collect your purchases. See you next year.', tag: 'CLOSE', color: B.smoke },
]

export { PHASES, DAY1, DAY2 }
