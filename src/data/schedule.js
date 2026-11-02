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
      'Dual-Rail Checkout: Instant Card or WhatsApp VIP Bank Transfer',
      'Digital QR pass generation & Apple/Google Wallet sync',
      'Group ticket split codes for Lagos crews'
    ]
  },
  {
    label: 'PHASE 3',
    dates: 'PHASE 1 LOCKED',
    title: 'AMPHITHEATRE ROSTER & GRAIL CELLS',
    color: B.neonMagenta,
    lines: [
      '30 curated vendor booths across Freedom Park, CMS',
      'The Grail Cells (Block A) & Lagos Sole Exchange (LSX) physical escrow',
      '4-Way Amphitheatre DJ Soundclash: Afrobeats vs Alté vs Drill vs Amapiano',
      '1v1 Cobblestone Fit-Check Arena Ringmasters & Cultural Liberation Panel'
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
      'Headline Liberation Set, All-Star Cypher & Golden Vault Awards'
    ]
  },
]

const DAY2 = [
  { time: '12:00', period: 'PM', title: 'DOORS OPEN & TURNSTILES LIVE', desc: 'Freedom Park Broad Street / Hospital Road Colonial Gatehouse opens. Cryptographic QR ticket scanning, RFID wristband credentialing, and full access to the 30+ vendor marketplace.', tag: 'OPEN', color: B.neonLime, stage: 'BROAD ST GATES' },
  { time: '12:30', period: 'PM', title: 'VENDOR PERGOLAS & GRAIL CELLS OPEN', desc: 'Deadstock sneakers, Lagos streetwear brands, Wrought-Iron Food Court, and the Lagos Sole Exchange physical authentication desk inside The Grail Cells (Block A) go live.', tag: 'MARKET', color: B.neonCyan, stage: 'THE GRAIL CELLS' },
  { time: '1:00',  period: 'PM', title: 'RESIDENT SOLE DJS — COURTYARD WARMUP SET', desc: 'Opening soundscape setting the tempo across the park. Afrobeats, Alté, hip-hop, and classic Lagos street anthems reverberating through the brick colonnades.', tag: 'MUSIC', color: B.amber, stage: 'MAIN AMPHITHEATRE' },
  { time: '2:00',  period: 'PM', title: 'CULTURAL LIBERATION PANEL: THE YEAR OF FREEDOM', desc: 'Lagos streetwear founders, archival collectors, and footwear designers unpack African design sovereignty, Grail Cell curation, and the business of West African street culture.', tag: 'CULTURE', color: B.neonCyan, stage: 'MAIN AMPHITHEATRE' },
  { time: '3:00',  period: 'PM', title: '1V1 FIT-CHECK ARENA — RINGMASTER OPENING BATTLES', desc: 'Official Arena Ringmasters summon 32 qualifiers onto the historic cobblestones for head-to-head drip clashes. Real-time crowd decibels + live mobile voting decide who advances.', tag: 'ARENA', color: B.amber, featured: true, stage: 'COBBLESTONE FIT ARENA' },
  { time: '4:00',  period: 'PM', title: 'SOLE CRAFT WORKSHOP ARTISAN SHOWCASE', desc: 'Three master customization benches transform pairs live with Adire indigo immersion, Danfo caution stencils, 10mm rope lace surgery, and laser heel inscriptions.', tag: 'ART', color: B.neonMagenta, stage: 'SOLE CRAFT PERGOLA' },
  { time: '5:00',  period: 'PM', title: 'LIVE GRAIL AUCTION & EXCLUSIVE DROP #1', desc: 'Authenticated 1-of-1 deadstock lots go under the gavel with physical LSX escrow verification inside Cell Block A. VIP, VVIP, and Phalanx pass holders get priority floor paddles.', tag: 'DROP', color: B.neonLime, featured: true, stage: 'THE GRAIL CELLS' },
  { time: '6:00',  period: 'PM', title: 'FIT-CHECK ARENA: MAINLAND VS ISLAND GRAND FINALS', desc: 'The highest-voted outfits clash under the Arena Ringmasters for the Crown of Freedom, ₦500,000 grail prize pool, and Golden Vault trophy.', tag: 'FINALS', color: B.amber, featured: true, stage: 'COBBLESTONE FIT ARENA' },
  { time: '7:00',  period: 'PM', title: 'AMPHITHEATRE 4-WAY DJ SOUNDCLASH', desc: 'Four of Lagos’s heaviest deck architects battle live across 4 rounds: Afrobeats Vanguard vs. Alté Syndicate vs. UK Drill/Grime vs. Amapiano Log Drum inside the brick Amphitheatre.', tag: 'CLASH', color: B.neonMagenta, featured: true, stage: 'MAIN AMPHITHEATRE' },
  { time: '8:00',  period: 'PM', title: 'THE YEAR OF FREEDOM HEADLINE SET & ALL-STAR CYPHER', desc: 'The climax performance of Sneakers Fest \'26 — high-voltage live headline set and surprise Lagos street-pop & hip-hop cypher under the Freedom Park night lights.', tag: 'HEADLINE', color: B.neonMagenta, featured: true, stage: 'MAIN AMPHITHEATRE' },
  { time: '9:30',  period: 'PM', title: 'GOLDEN VAULT & SOLE REGISTRY AWARDS', desc: 'Crowning the Collector of the Year, Soundclash Champion, and Grail Heist winners followed by the closing liberation anthem set.', tag: 'AWARDS', color: B.amber, stage: 'MAIN AMPHITHEATRE' },
  { time: '10:00', period: 'PM', title: 'DOORS CLOSE & FINAL ESCROW HANDOFF', desc: 'Final authenticated pair pickups at The Grail Cells and safe departure via Broad Street / Hospital Road VIP dispatch.', tag: 'CLOSE', color: B.smoke, stage: 'BROAD ST GATES' },
]

// Export DAY1 as alias to DAY2 so any legacy imports remain 100% crash-free
const DAY1 = DAY2

export { PHASES, DAY1, DAY2 }
