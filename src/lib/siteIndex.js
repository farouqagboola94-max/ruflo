import { SOCIAL_LINKS } from '../config'

// Single source of truth for every navigable destination on the site.
// Consumed by the command palette, the navbar and the footer so the three
// can never drift apart. `k` holds extra search keywords that are not in
// the title but are how people actually describe the section.

export const CATEGORIES = {
  essentials:  { label: 'ESSENTIALS',   color: 'amber' },
  community:   { label: 'COMMUNITY',    color: 'neonCyan' },
  play:        { label: 'PLAY',         color: 'neonLime' },
  identity:    { label: 'YOUR IDENTITY',color: 'neonMagenta' },
  culture:     { label: 'CULTURE',      color: 'amberGlow' },
  market:      { label: 'MARKETPLACE',  color: 'neonBlue' },
  create:      { label: 'CREATE',       color: 'electricPurple' },
  brand:       { label: 'THE BRAND',    color: 'smoke' },
}

export const SECTIONS = [
  // ---- Essentials ----------------------------------------------------
  { id: 'tickets',    t: 'Get Tickets',        c: 'essentials', d: 'GENERAL, VIP, VVIP and PHALANX passes',   k: 'buy pay price cost much admission pass entry ticket naira afford cheap' },
  { id: 'schedule',   t: 'Schedule',           c: 'essentials', d: 'Full run of show, 12PM to 10PM',          k: 'time timetable agenda lineup order programme when start begin doors open close hours' },
  { id: 'venue',      t: 'Venue & Directions', c: 'essentials', d: 'Muri Okunola Park, Victoria Island',      k: 'where map location address parking directions vi lagos park muri okunola getting there' },
  { id: 'lineup',     t: 'The Lineup',         c: 'essentials', d: 'Who is on the bill',                      k: 'performers acts stage bill' },
  { id: 'countdown',  t: 'Countdown',          c: 'essentials', d: 'Time left until December 12',             k: 'days clock timer when how long' },
  { id: 'waitlist',   t: 'Early Access',       c: 'essentials', d: 'Get in before general release',           k: 'signup join waitlist presale first list email' },
  { id: 'faq',        t: 'FAQ',                c: 'essentials', d: 'Answers to the common questions',         k: 'help question answer support info' },
  { id: 'contact',    t: 'Contact Us',         c: 'essentials', d: 'Reach the team directly',                 k: 'email message support reach talk enquiry' },
  { id: 'app-promo',  t: "SF'26 App",          c: 'essentials', d: 'The companion app',                       k: 'mobile download install ios android' },

  // ---- Community -----------------------------------------------------
  { id: 'community',      t: 'The Community',        c: 'community', d: 'What we are building together',        k: 'join crew people members belong' },
  { id: 'wall',           t: 'The Community Wall',   c: 'community', d: 'Messages from the community',          k: 'posts board shoutout messages' },
  { id: 'confessional',   t: 'The Confessional',     c: 'community', d: 'Anonymous sneaker hot takes',          k: 'confess secret opinion anonymous unpopular takes' },
  { id: 'culture-index',  t: 'Culture Index',        c: 'community', d: 'Live pulse of the community',          k: 'stats live data dashboard numbers brands cities' },
  { id: 'sole-registry',  t: 'Sole Registry',        c: 'community', d: 'Register your grail for the wall',     k: 'register submit shoe grail exhibit display 200' },
  { id: 'leaderboard',    t: 'Rankings',             c: 'community', d: 'Who is topping the board',             k: 'leaderboard points score top rank compete' },
  { id: 'testimonials',   t: 'Stories',              c: 'community', d: 'Voices from the culture',              k: 'reviews quotes testimonial people said' },
  { id: 'community-intelligence', t: 'Lagos Intelligence', c: 'community', d: 'What the city is telling us',    k: 'insights data trends lagos research' },

  // ---- Play ----------------------------------------------------------
  { id: 'trivia',       t: 'Sneaker Trivia',     c: 'play', d: 'Test what you actually know',        k: 'quiz game questions knowledge play' },
  { id: 'ai-trivia',    t: 'AI Trivia',          c: 'play', d: 'Endless AI-generated questions',     k: 'quiz game ai questions play' },
  { id: 'soledle',      t: 'Soledle',            c: 'play', d: 'Daily sneaker word game',            k: 'wordle puzzle daily game guess' },
  { id: 'memory-match', t: 'Sole Memory',        c: 'play', d: 'Match the pairs',                    k: 'memory game cards match pairs' },
  { id: 'bingo',        t: 'Sneaker Bingo',      c: 'play', d: 'Spot them on the day',               k: 'game card grid spot play' },
  { id: 'spin',         t: 'Spin to Win',        c: 'play', d: 'Take your shot at a prize',          k: 'wheel prize luck win game raffle' },
  { id: 'vote-off',     t: 'Crew Vote-Off',      c: 'play', d: 'Head-to-head, you decide',           k: 'vote versus battle poll choose game' },
  { id: 'mystery',      t: 'Mystery Drop',       c: 'play', d: 'Something is behind the door',       k: 'surprise secret box drop reveal' },
  { id: 'hype',         t: 'Hype Counter',       c: 'play', d: 'Crank the hype up',                  k: 'clicker counter game tap' },
  { id: 'egg-hunt',     t: 'The Great Sole Hunt',c: 'play', d: 'Hidden eggs across the site',        k: 'easter egg hunt find secret hidden collect' },
  { id: 'worth',        t: 'Collection Worth',   c: 'play', d: 'What is your rotation worth?',       k: 'value price estimate calculator collection' },

  // ---- Identity ------------------------------------------------------
  { id: 'dna',             t: 'Sneaker DNA',      c: 'identity', d: 'Decode your sneaker profile',   k: 'quiz profile personality type test who' },
  { id: 'passport',        t: 'Sneaker Passport', c: 'identity', d: 'Your progress across the site', k: 'progress stamps badges profile track' },
  { id: 'style-archetype', t: 'Style Archetype',  c: 'identity', d: 'Which archetype are you?',      k: 'quiz style personality type aesthetic' },
  { id: 'collector-card',  t: 'Collector Card',   c: 'identity', d: 'Your card, shareable',          k: 'card profile share stats generate' },
  { id: 'badge',           t: 'Badge Maker',      c: 'identity', d: 'Build your own badge',          k: 'create badge design custom maker' },
  { id: 'colorizer',       t: 'Shoe Builder',     c: 'identity', d: 'Colour up your own pair',       k: 'customise design colour build shoe create' },
  { id: 'outfit',          t: 'Outfit Matcher',   c: 'identity', d: 'Build the fit around the shoe', k: 'fit clothes style match outfit' },
  { id: 'fit-check',       t: 'Fit Check AI',     c: 'identity', d: 'Get your fit rated',            k: 'rate outfit ai check style score' },

  // ---- Culture -------------------------------------------------------
  { id: 'about',           t: 'About the Fest',    c: 'culture', d: 'What Sneakers Fest is',          k: 'what who info story mission' },
  { id: 'origin',          t: 'The Origin Story',  c: 'culture', d: 'How this started',               k: 'history beginning founder story how' },
  { id: 'fnp',             t: 'Friday Night Protocol', c: 'culture', d: 'Every Friday, online',       k: 'friday weekly online event live protocol' },
  { id: 'highlights',      t: 'The Experience',    c: 'culture', d: 'What the day feels like',        k: 'what happens experience day expect' },
  { id: 'sole-of-lagos',   t: 'The Sole of Lagos', c: 'culture', d: 'This city on foot',              k: 'lagos city culture streets story' },
  { id: 'culture-history', t: 'Art & Culture',     c: 'culture', d: 'Where the culture came from',    k: 'history art heritage roots timeline' },
  { id: 'museum',          t: 'The Museum',        c: 'culture', d: 'Curated pieces of history',      k: 'exhibit archive gallery history rare' },
  { id: 'vault-200',       t: 'Architect Vault',   c: 'culture', d: 'For the deepest heads',          k: 'vault secret locked exclusive 200 architect' },
  { id: 'sneaker-vault',   t: 'Sneaker Vault',     c: 'culture', d: 'The knowledge base',             k: 'knowledge learn encyclopedia reference vault' },
  { id: 'artists',         t: 'Artists',           c: 'culture', d: 'The creatives on the bill',      k: 'creators art performers spotlight' },
  { id: 'timeline',        t: 'Drops Timeline',    c: 'culture', d: 'The releases that mattered',     k: 'releases history drops dates timeline' },
  { id: 'gallery',         t: 'Gallery',           c: 'culture', d: 'Shots from the culture',        k: 'photos images pictures gallery look' },
  { id: 'comics',          t: 'Catalyst Universe', c: 'culture', d: 'The comic side of the world',    k: 'comic story catalyst universe read' },

  // ---- Marketplace ---------------------------------------------------
  { id: 'merch',            t: 'Merch',             c: 'market', d: 'Official Sneakers Fest gear',    k: 'shop buy clothing tshirt hoodie store gear merch wear apparel' },
  { id: 'vendors',          t: 'Become a Vendor',   c: 'market', d: 'Apply for a booth',              k: 'apply sell booth stall business vendor trade seller stand pitch' },
  { id: 'vendor-dashboard', t: 'Vendor Portal',     c: 'market', d: 'Check your application status',  k: 'status login portal application vendor check' },
  { id: 'vendor-matcher',   t: 'Vendor Matcher',    c: 'market', d: 'Find the right seller for you',  k: 'find seller match shop recommend' },
  { id: 'trades',           t: 'Trade Board',       c: 'market', d: 'Swap with the community',        k: 'trade swap exchange sell buy board' },
  { id: 'auction-wall',     t: 'Grail Auction',     c: 'market', d: 'Bid on the rare ones',           k: 'auction bid sell rare grail buy' },
  { id: 'trade-negotiator', t: 'Trade Negotiator',  c: 'market', d: 'Work out a fair swap',           k: 'trade negotiate deal fair value swap' },
  { id: 'price-negotiator', t: 'Price Negotiator',  c: 'market', d: 'Practise haggling',              k: 'price haggle negotiate deal bargain' },
  { id: 'fake-detector',    t: 'Fake Detector',     c: 'market', d: 'Legit check before you pay',     k: 'legit check fake real authentic verify' },
  { id: 'drop-analyzer',    t: 'Drop Analyzer',     c: 'market', d: 'Should you cop or drop?',        k: 'analyse drop cop invest worth resell' },
  { id: 'grail-advisor',    t: 'Grail Advisor',     c: 'market', d: 'Find your next grail',           k: 'recommend advice next buy grail suggest' },
  { id: 'heat-predictor',   t: 'Heat Predictor',    c: 'market', d: 'What is about to pop',           k: 'trend predict hype heat future resell' },
  { id: 'cold-dm',          t: 'Cold DM Generator', c: 'market', d: 'Message a seller properly',      k: 'dm message seller outreach write contact' },

  // ---- Create --------------------------------------------------------
  { id: 'caption-gen',    t: 'Caption Studio',  c: 'create', d: 'Captions for your posts',      k: 'caption instagram write post social generate' },
  { id: 'story-gen',      t: 'Sneaker Stories', c: 'create', d: 'Give your pair a backstory',   k: 'story write generate narrative' },
  { id: 'sneaker-roast',  t: 'Sneaker Roast',   c: 'create', d: 'Get your pair roasted',        k: 'roast joke funny burn insult' },
  { id: 'sneaker-eulogy', t: 'Sneaker Eulogy',  c: 'create', d: 'Send a dead pair off right',   k: 'eulogy funeral retire dead worn out' },
  { id: 'photo-tools',    t: 'Photo Studio',    c: 'create', d: 'Make your shots look right',   k: 'photo edit filter camera picture studio' },

  // ---- Brand ---------------------------------------------------------
  { id: 'stats',         t: 'By the Numbers',   c: 'brand', d: 'The fest at a glance',        k: 'stats numbers figures data' },
  { id: 'press',         t: 'Press',            c: 'brand', d: 'Coverage and media',          k: 'media news article coverage journalist' },
  { id: 'sponsors',      t: 'Sponsors',         c: 'brand', d: 'Who backs the fest',          k: 'partners brands sponsors backers' },
  { id: 'sponsor-tiers', t: 'Partner With Us',  c: 'brand', d: 'Sponsorship packages',        k: 'sponsor partner brand advertise package invest' },
  { id: 'newsletter',    t: 'Newsletter',       c: 'brand', d: 'Get it in your inbox',        k: 'subscribe email updates newsletter signup' },
  { id: 'raffle',        t: 'Raffle',           c: 'brand', d: 'Enter to win',                k: 'win prize enter giveaway competition raffle free stuff' },
  { id: 'catalyst-mcp',  t: 'MCP Tools',        c: 'brand', d: 'The Catalyst tool stack',     k: 'tools ai mcp catalyst tech' },
]

// Actions that are not sections — external links or page behaviour.
// URLs come from the shared config so they stay in step with the footer.
export const ACTIONS = [
  { id: 'act-whatsapp',  t: 'Join the WhatsApp Channel', d: 'Updates straight to your phone', href: SOCIAL_LINKS.whatsapp,         ext: true, k: 'whatsapp chat community group join talk channel' },
  { id: 'act-dm',        t: 'Message the Team',          d: 'Direct WhatsApp to an organiser', href: SOCIAL_LINKS.whatsappContact1, ext: true, k: 'whatsapp dm message contact ask question help talk' },
  { id: 'act-instagram', t: 'Follow on Instagram',       d: '@sneakersfest5555',               href: SOCIAL_LINKS.instagram,        ext: true, k: 'instagram social follow ig' },
  { id: 'act-tiktok',    t: 'Follow on TikTok',          d: '@sneakersfest',                   href: SOCIAL_LINKS.tiktok,           ext: true, k: 'tiktok social follow video' },
  { id: 'act-top',       t: 'Back to Top',               d: 'Return to the hero',              href: '#', k: 'top scroll up home start beginning hero' },
]

// Cheap subsequence fuzzy match — every query char must appear in order.
function subsequence(needle, haystack) {
  let i = 0
  for (let j = 0; j < haystack.length && i < needle.length; j++) {
    if (haystack[j] === needle[i]) i++
  }
  return i === needle.length
}

// Pure filler. Question words (how/what/where/when) are deliberately NOT
// here — they are real keywords on sections like Venue and Origin Story.
const STOP = new Set(['a','an','the','is','are','was','of','for','to','do','does','did',
  'i','my','and','in','on','at','it','me','you','your','be','with','this','that'])

// Destinations people are usually trying to reach; used to break ties so a
// utility never outranks the thing that pays for the festival.
const PRIORITY = { tickets: 12, venue: 10, schedule: 9, waitlist: 8, vendors: 7, merch: 6, faq: 5, contact: 5, lineup: 4 }

/** Best score for a single token against one entry, or -1 for no match. */
function scoreToken(tok, title, desc, keys) {
  if (title === tok)                                     return 100
  if (title.startsWith(tok))                             return 90
  if (title.split(/\s+/).some(w => w.startsWith(tok)))   return 80
  if (title.includes(tok))                               return 70
  if (keys.split(/\s+/).some(w => w === tok))            return 60
  if (keys.split(/\s+/).some(w => w.startsWith(tok)))    return 50
  if (desc.includes(tok))                                return 40
  if (keys.includes(tok))                                return 30
  if (tok.length >= 3 && subsequence(tok, title))        return 20
  return -1
}

/**
 * Rank sections + actions against a query.
 *
 * Single-word queries score directly. Multi-word queries ("how much are
 * tickets") drop stop-words and require every remaining token to match
 * something, scoring on the average so a phrase beats a lucky single hit.
 */
export function searchIndex(query, limit = 40) {
  const q = query.trim().toLowerCase()
  const pool = [...SECTIONS, ...ACTIONS]
  if (!q) return pool.map(s => ({ ...s, score: 0 }))

  const raw = q.split(/\s+/).filter(Boolean)
  const meaningful = raw.filter(w => !STOP.has(w))
  // If the query was nothing but stop-words, fall back to the raw words.
  const tokens = meaningful.length ? meaningful : raw

  const scored = []
  for (const s of pool) {
    const title = s.t.toLowerCase()
    const desc  = (s.d || '').toLowerCase()
    const keys  = (s.k || '').toLowerCase()

    // Whole-query match always wins over a token-by-token reading.
    let score = scoreToken(q, title, desc, keys)

    // Re-score per token whenever the token list differs from the raw query,
    // which includes the single-token case left after dropping filler words.
    if (tokens.join(' ') !== q) {
      // Natural language carries words the index will never know ("much").
      // Score on the strongest token, then reward how much of the query the
      // entry actually covered rather than demanding every word land.
      const hits = tokens.map(t => scoreToken(t, title, desc, keys)).filter(v => v >= 30)
      if (hits.length) {
        const coverage = hits.length / tokens.length
        score = Math.max(score, Math.max(...hits) + coverage * 40)
      }
    }

    if (score >= 0) scored.push({ ...s, score: score + (PRIORITY[s.id] || 0) })
  }

  return scored.sort((a, b) => b.score - a.score || a.t.localeCompare(b.t)).slice(0, limit)
}
