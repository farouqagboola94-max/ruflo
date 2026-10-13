// The official Sneakers Fest '26 Run of Show — Saturday, December 12, 2026
// Muri Okunola Park, Victoria Island, Lagos (12:00 PM – 10:00 PM WAT)

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
      '30 curated vendor booths across Muri Okunola Park',
      'Lagos Sole Exchange (LSX) physical escrow registration',
      'Danfo Custom Sneaker Lab maker bench onboarding',
      'Official Phase 1 music & DJ lineup reveal on @s_fest26'
    ]
  },
  {
    label: 'PHASE 4',
    dates: 'DEC 12, 2026',
    title: "SNEAKERS FEST '26 MAIN EVENT",
    color: B.neonCyan,
    lines: [
      'Muri Okunola Park · Victoria Island, Lagos',
      'Doors open 12:00 PM — 10:00 PM WAT',
      'Live Fit-Check Arena · Grail Auction · LSX Trading Pit',
      'Headline music performances & Lagos culture showcase'
    ]
  },
]

const DAY2 = [
  { time: '12:00', period: 'PM', title: 'DOORS OPEN & TURNSTILES LIVE', desc: 'Muri Okunola Park gates open. QR ticket scanning, wristband collection, and full access to the 30+ vendor marketplace.', tag: 'OPEN', color: B.neonLime, stage: 'MAIN GATES' },
  { time: '12:30', period: 'PM', title: 'VENDOR FLOOR & LSX TRADING PIT OPEN', desc: 'Deadstock sneakers, Lagos streetwear brands, food court, and the Lagos Sole Exchange physical authentication desk go live.', tag: 'MARKET', color: B.neonCyan, stage: 'GRAIL ALLEY' },
  { time: '1:00',  period: 'PM', title: 'RESIDENT SOLE DJS — AFTERNOON SET', desc: 'Opening soundscape setting the tempo across the park. Afrobeats, Alté, hip-hop, and classic street anthems.', tag: 'MUSIC', color: B.amber, stage: 'MAIN STAGE' },
  { time: '2:00',  period: 'PM', title: 'PANEL: THE FUTURE OF LAGOS STREET CULTURE', desc: 'Founders, collectors, and designers discuss sneaker commerce, local manufacturing, and West African design identity.', tag: 'CULTURE', color: B.neonCyan, stage: 'MAIN STAGE' },
  { time: '3:00',  period: 'PM', title: '1V1 FIT-CHECK ARENA — OPENING BATTLES', desc: 'Attendees step into the ring for head-to-head on-foot drip matchups. Real-time crowd voting decides who advances.', tag: 'ARENA', color: B.amber, featured: true, stage: '1V1 ARENA' },
  { time: '4:00',  period: 'PM', title: 'DANFO CUSTOM SNEAKER LAB SHOWCASE', desc: 'On-site customization artisans transform canvas pairs live with Lagos transit stencils, hand-painted motifs, and dye baths.', tag: 'ART', color: B.neonMagenta, stage: 'YOUTH LOUNGE' },
  { time: '5:00',  period: 'PM', title: 'LIVE GRAIL AUCTION & EXCLUSIVE DROP #1', desc: 'Rare deadstock lots go under the gavel with physical LSX escrow verification. VIP and VVIP pass holders get priority floor access.', tag: 'DROP', color: B.neonLime, featured: true, stage: 'GRAIL ALLEY' },
  { time: '6:00',  period: 'PM', title: 'FIT-CHECK ARENA: MAINLAND VS ISLAND FINALS', desc: 'The highest-voted outfits clash in the championship round for the Best Dressed of Lagos crown and grail prize package.', tag: 'FINALS', color: B.amber, featured: true, stage: '1V1 ARENA' },
  { time: '7:00',  period: 'PM', title: '⧡ SPECIAL GUEST SET [PHASE 1 REVEAL SOON]', desc: 'High-energy live showcase bridging music and street fashion. Official artist announcement dropping on @s_fest26.', tag: 'LIVE', color: B.neonMagenta, stage: 'MAIN STAGE' },
  { time: '8:00',  period: 'PM', title: '⧡ HEADLINE PERFORMANCE [PHASE 1 REVEAL SOON]', desc: 'The climax performance of Sneakers Fest \'26 under the Victoria Island night lights.', tag: 'HEADLINE', color: B.neonMagenta, featured: true, stage: 'MAIN STAGE' },
  { time: '9:30',  period: 'PM', title: 'GOLDEN VAULT & SOLE REGISTRY AWARDS', desc: 'Final recognition of top collectors, Grail Heist winners, and closing DJ set.', tag: 'AWARDS', color: B.amber, stage: 'MAIN STAGE' },
  { time: '10:00', period: 'PM', title: 'DOORS CLOSE & FINAL ESCROW HANDOFF', desc: 'Final vendor pickups at Booth 14 and safe departure from Muri Okunola Park.', tag: 'CLOSE', color: B.smoke, stage: 'MAIN GATES' },
]

// Export DAY1 as alias to DAY2 so any legacy imports remain 100% crash-free
const DAY1 = DAY2

export { PHASES, DAY1, DAY2 }
