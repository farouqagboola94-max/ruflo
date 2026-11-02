// The official Sneakers Fest '26 Run of Show — Saturday, December 12, 2026
// Freedom Park, Old Prison Ground, Broad Street, CMS, Lagos Island (12:00 PM – 10:00 PM WAT)

import { B } from '../tokens.js'

const PHASES = [
  {
    label: 'PHASE 1',
    dates: 'EVERY FRIDAY',
    title: 'FRIDAY NIGHT PROTOCOL (FNP)',
    color: B.neonLime,
    lines: [
      'Weekly live online sessions at 8:00 PM WAT',
      'Sneaker trivia, sole battles & culture debates',
      'Community streak tracking & XP leaderboard',
      'Early drop access for active participants'
    ]
  },
  {
    label: 'PHASE 2',
    dates: 'NOW LIVE',
    title: 'PASS RELEASE & CREW CODES',
    color: B.amber,
    lines: [
      'General (₦5K), VIP (₦10K), VVIP (₦25K) & Phalanx (₦50K)',
      'Digital QR pass generation & Apple/Google Wallet sync',
      'Group ticket split codes for Lagos crews',
      'Early bird allocations moving fast'
    ]
  },
  {
    label: 'PHASE 3',
    dates: 'CURATION',
    title: 'VENDOR & FLOOR ACCREDITATION',
    color: B.neonMagenta,
    lines: [
      '30 curated vendor booths across Freedom Park, CMS',
      'The Grail Cells & Lagos Sole Exchange (LSX) physical escrow registration',
      'Sole Craft Customization Workshop artisan onboarding',
      'Official Phase 1 music & DJ lineup reveal on @s_fest26'
    ]
  },
  {
    label: 'PHASE 4',
    dates: 'DEC 12, 2026',
    title: "SNEAKERS FEST '26 — THE YEAR OF FREEDOM",
    color: B.neonCyan,
    lines: [
      'Freedom Park, Old Prison Ground, CMS, Lagos Island',
      'Doors open 12:00 PM — 10:00 PM WAT',
      'Main Amphitheatre · Cobblestone Fit-Check Arena · The Grail Cells',
      'Headline music performances & West African culture liberation'
    ]
  },
]

const DAY2 = [
  { time: '12:00', period: 'PM', title: 'DOORS OPEN & TURNSTILES LIVE', desc: 'Freedom Park Broad Street / Hospital Road gates open. QR ticket scanning, RFID wristband collection, and full access to the 30+ vendor marketplace.', tag: 'OPEN', color: B.neonLime, stage: 'BROAD ST GATES' },
  { time: '12:30', period: 'PM', title: 'VENDOR PERGOLAS & GRAIL CELLS OPEN', desc: 'Deadstock sneakers, Lagos streetwear brands, food court, and the Lagos Sole Exchange physical authentication desk inside The Grail Cells go live.', tag: 'MARKET', color: B.neonCyan, stage: 'THE GRAIL CELLS' },
  { time: '1:00',  period: 'PM', title: 'RESIDENT SOLE DJS — AFTERNOON SET', desc: 'Opening soundscape setting the tempo across the park. Afrobeats, Alté, hip-hop, and classic street anthems reverberating through the Amphitheatre.', tag: 'MUSIC', color: B.amber, stage: 'MAIN AMPHITHEATRE' },
  { time: '2:00',  period: 'PM', title: 'PANEL: THE YEAR OF FREEDOM & STREET CULTURE', desc: 'Founders, collectors, and designers discuss sneaker commerce, African design liberation, and West African manufacturing identity.', tag: 'CULTURE', color: B.neonCyan, stage: 'MAIN AMPHITHEATRE' },
  { time: '3:00',  period: 'PM', title: '1V1 FIT-CHECK ARENA — OPENING BATTLES', desc: 'Attendees step onto the cobblestones for head-to-head on-foot drip matchups. Real-time crowd voting decides who advances to the finals.', tag: 'ARENA', color: B.amber, featured: true, stage: 'COBBLESTONE FIT ARENA' },
  { time: '4:00',  period: 'PM', title: 'SOLE CRAFT WORKSHOP ARTISAN SHOWCASE', desc: 'On-site customization artisans transform canvas pairs live with Adire indigo dyeing, airbrush stencils, 10mm rope laces, and laser inscriptions.', tag: 'ART', color: B.neonMagenta, stage: 'SOLE CRAFT PERGOLA' },
  { time: '5:00',  period: 'PM', title: 'LIVE GRAIL AUCTION & EXCLUSIVE DROP #1', desc: 'Rare deadstock lots go under the gavel with physical LSX escrow verification. VIP and VVIP pass holders get priority floor access.', tag: 'DROP', color: B.neonLime, featured: true, stage: 'THE GRAIL CELLS' },
  { time: '6:00',  period: 'PM', title: 'FIT-CHECK ARENA: MAINLAND VS ISLAND FINALS', desc: 'The highest-voted outfits clash on the cobblestones for the Crown of Freedom and the ultimate grail prize package.', tag: 'FINALS', color: B.amber, featured: true, stage: 'COBBLESTONE FIT ARENA' },
  { time: '7:00',  period: 'PM', title: '⧡ SPECIAL GUEST SET [PHASE 1 REVEAL SOON]', desc: 'High-energy live showcase bridging music and street fashion in the open-air Amphitheatre. Official artist announcement dropping on @s_fest26.', tag: 'LIVE', color: B.neonMagenta, stage: 'MAIN AMPHITHEATRE' },
  { time: '8:00',  period: 'PM', title: '⧡ HEADLINE PERFORMANCE [PHASE 1 REVEAL SOON]', desc: 'The climax performance of Sneakers Fest \'26 under the Lagos Island night lights.', tag: 'HEADLINE', color: B.neonMagenta, featured: true, stage: 'MAIN AMPHITHEATRE' },
  { time: '9:30',  period: 'PM', title: 'GOLDEN VAULT & SOLE REGISTRY AWARDS', desc: 'Final recognition of top collectors, Grail Heist winners, and closing DJ set.', tag: 'AWARDS', color: B.amber, stage: 'MAIN AMPHITHEATRE' },
  { time: '10:00', period: 'PM', title: 'DOORS CLOSE & FINAL ESCROW HANDOFF', desc: 'Final vendor pickups at The Grail Cells and safe departure from Freedom Park, CMS.', tag: 'CLOSE', color: B.smoke, stage: 'BROAD ST GATES' },
]

// Export DAY1 as alias to DAY2 so any legacy imports remain 100% crash-free
const DAY1 = DAY2

export { PHASES, DAY1, DAY2 }
