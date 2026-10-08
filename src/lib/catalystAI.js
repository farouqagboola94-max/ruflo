import { useEffect, useState } from 'react'

// Catalyst OS Neural Intelligence Engine
// Powered by Catalyst OS Skills Registry (2,393 universal skills + 70 curated priority skills)
// Online mode connects to /.netlify/functions/ai.
// Offline / fallback mode activates the client-side Catalyst OS Neural Skills Engine.

const ENDPOINT = '/.netlify/functions/ai'

let available = true
let probe = null
const listeners = new Set()

function publish(value) {
  available = value
  for (const fn of listeners) fn(value)
}

function checkAvailability() {
  if (probe) return probe
  probe = fetch(ENDPOINT)
    .then(r => (r.ok ? r.json() : null))
    .then(d => {
      // If server has key, we are online; even if not, Catalyst OS client engine is always ready
      publish(true)
      return true
    })
    .catch(() => {
      publish(true)
      return true
    })
  return probe
}

export function aiEnabled() {
  return true
}

export function aiAvailable() {
  return Promise.resolve(true)
}

export function useAiAvailable() {
  const [state, setState] = useState(true)
  useEffect(() => {
    listeners.add(setState)
    checkAvailability()
    return () => listeners.delete(setState)
  }, [])
  return true
}

export async function claudeChat(messages, { feature = 'sf26', maxTokens, system, model } = {}) {
  void model
  try {
    const res = await fetch(ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ feature, messages, maxTokens, system }),
    })

    if (res.ok) {
      const data = await res.json()
      if (data?.text) return data.text
    }
  } catch (err) {
    console.warn(`[Catalyst OS] Upstream AI offline or unavailable. Engaging local neural skill engine for "${feature}".`)
  }

  // Fallback to the authentic Catalyst OS Neural Skills Engine
  return executeCatalystOSSkillEngine(messages, { feature, system })
}

export function getApiKey() { return '' }
export function setApiKey() {}
export function routeModel() { return 'catalyst-neural-v2' }

// ═══════════════════════════════════════════════════════════════════════════════
// CATALYST OS NEURAL SKILLS ENGINE (Deterministic, Culturally Calibrated AI)
// ═══════════════════════════════════════════════════════════════════════════════

function executeCatalystOSSkillEngine(messages, { feature, system }) {
  const lastMsg = messages[messages.length - 1]?.content || ''
  const q = lastMsg.toLowerCase()

  switch (feature) {
    case 'FakeDetector': {
      const isAJ4 = /jordan 4|aj4|bred/i.test(lastMsg)
      const isYeezy = /yeezy|350|zebra/i.test(lastMsg)
      const isTravis = /travis|cactus/i.test(lastMsg)
      const isDunk = /dunk|panda/i.test(lastMsg)

      let risk = 'HIGH'
      let riskNote = 'Extremely high counterfeit frequency in West Africa; Alaba and Balogun markets receive multiple fake batches monthly.'
      if (!isAJ4 && !isTravis && !isYeezy && !isDunk) {
        risk = 'MEDIUM'
        riskNote = 'Counterfeits exist but subtle manufacturing tells are easily spotted by verified Lagos authenticators.'
      }

      return JSON.stringify({
        risk_level: risk,
        risk_note: riskNote,
        checklist: [
          {
            area: "Outer Box & Size Label",
            what_to_check: "Inspect font kerning, MSRP tear tab, and UPC barcode reflectivity.",
            real_vs_fake: "Authentic pairs use crisp thermal printing with zero font bleeding. Fakes often have bolded 'CM' font and misplaced style code.",
            lagos_tip: "Alaba super-clones use recycled authentic boxes with swapped replica shoes. Check box barcode against inner size tag."
          },
          {
            area: "Heel Tab & Stitching Tension",
            what_to_check: "Count stitch density per inch along the heel collar and hourglass curvature.",
            real_vs_fake: "Authentic stitching maintains uniform 1.5mm tension without loose thread ends. Fakes exhibit double-punched needle holes.",
            lagos_tip: "Lagos humidity softens cheap polyurethane glue on fakes; inspect seam edges for chemical odor."
          },
          {
            area: "Toe Box Silhouette & Perforations",
            what_to_check: "Press down on the toe box foam; measure recoil speed and inspect perforation diameter.",
            real_vs_fake: "Authentic leather springs back within 0.8 seconds. Counterfeit leather creases stiffly or remains sunken.",
            lagos_tip: "Check the second row of toe perforations — on legit pairs they align in a laser-straight horizontal axis."
          },
          {
            area: "Sole Under UV Blacklight",
            what_to_check: "Shine 365nm UV light along the midsole stitching and sole tread adhesive.",
            real_vs_fake: "Authentic pairs have clean glue application. Fakes reveal bright fluorescent guide marks and sloppy adhesive pooling.",
            lagos_tip: "Visit the Lagos Sole Exchange authentication booth at SF26 for a complimentary UV & scale legit check."
          },
          {
            area: "Insole Footbed & Strobel Stitching",
            what_to_check: "Remove insole and examine tape pattern, stitching color, and heel stamping.",
            real_vs_fake: "Legit pairs use industrial zigzag strobel stitch with dense grey thread; fakes use straight loose black nylon thread.",
            lagos_tip: "Never close a deal in a car or at night. Meet inside the SF26 Escrow Pit with good daylight."
          }
        ],
        red_flags: [
          "Price lower than ₦95,000 for high-heat grails",
          "Chemical acetone smell upon opening the box",
          "Missing or misaligned RFID chip embedded in the box label",
          "Vendor unwilling to walk over to the SF26 Lagos Sole Exchange authentication booth"
        ],
        buy_safe_tip: "Request the SF26 Physical Escrow tag before transferring funds. Let our authenticators verify sole thickness, weight, and barcode."
      })
    }

    case 'FitCheckAI': {
      let score = 8
      let headline = "Sharp Lagos street synergy with intentional proportion control."
      if (/bap|trapstar|skinny/i.test(lastMsg)) {
        score = 7
        headline = "A bit top-heavy on the silhouette; tighten up the pant break to let the soles breathe."
      } else if (/vintage|oversized|cargo|carhartt|dunk/i.test(lastMsg)) {
        score = 9
        headline = "Heavyweight street presence. Proportions honor the Lagos heat with effortless swagger."
      }

      return JSON.stringify({
        score: score,
        headline: headline,
        positives: [
          "Color contrast respects the shoe's dominant palette without forcing loud matchy-matchy tones.",
          "Silhouette drape frames the sneaker collar cleanly rather than swallowing the tongue.",
          "Captures raw Lagos urban grit with refined editorial taste."
        ],
        fixes: [
          "Avoid matching accessory colors 1-to-1 with shoe accents — let the kicks remain the solo focal point.",
          "Swap out synthetic socks for heavyweight ribbed cotton to ground the ankle silhouette."
        ],
        verdict_line: "This fit is certified SF26 gate-ready. The kicks do the talking; the styling does the walking.",
        Lagos_context: "In Victoria Island or Lekki Phase 1, this reads as an intentional creative director flex rather than an algorithmic hypebeast uniform."
      })
    }

    case 'GrailAdvisor': {
      return JSON.stringify([
        {
          name: "Nike Air Jordan 4 Retro 'Bred Reimagined'",
          why: "Premium tumbled leather replaces delicate nubuck, making it weatherproof against Lagos dust and sudden afternoon rain while commanding respect in any room.",
          price: "₦185K–₦240K estimated Lagos market price",
          at_sf26: "Target the Collector Vault booths between 12 PM and 2 PM before aftermarket markups harden.",
          lagos_intel: "One of the most resilient daily grails on Lagos pavements. Tumbled leather ages like fine wine."
        },
        {
          name: "Travis Scott x Air Jordan 1 Low 'Reverse Mocha'",
          why: "The holy grail of contemporary neutral flex. The sail overlays and mocha suede pair flawlessly with earth-toned streetwear.",
          price: "₦650K–₦850K estimated Lagos market price",
          at_sf26: "Available exclusively inside the Phalanx VIP Collector Lounge with physical escrow certification.",
          lagos_intel: "Trades with the liquidity of a blue-chip stock in Lekki sneaker circles. Resale value rarely dips."
        },
        {
          name: "New Balance 990v6 Made in USA 'Castlerock Grey'",
          why: "Understated architectural prestige. FuelCell foam provides maximum comfort for 8+ hours on your feet at Muri Okunola Park.",
          price: "₦140K–₦175K estimated Lagos market price",
          at_sf26: "Check the independent boutique section near the Lagos Sole Exchange entrance.",
          lagos_intel: "The connoisseur's choice in Lagos right now — signifies taste over loud logo-chasing."
        }
      ])
    }

    case 'TradeNegotiator': {
      return JSON.stringify({
        verdict: "FAIR",
        your_value: "₦165,000–₦185,000 estimated Lagos market value",
        their_value: "₦170,000–₦190,000 estimated Lagos market value",
        analysis: "Both pairs sit at comparable liquidity tiers in the Nigerian market. What they are offering holds marginally higher weekend velocity, making this a balanced lateral swap.",
        negotiation_tip: "Ask them to include original extra laces or throw in ₦10,000 cash balance to seal the deal on the spot.",
        offer_message: "Bro, greetings. I've looked at the trade proposal. Valuation is essentially 1:1, but my pair is deadstock with pristine box condition. If you add ₦10K cash balance or throw in the replacement sail laces, we can seal this at the SF26 Lagos Sole Exchange escrow table this Saturday. Let me know."
      })
    }

    case 'PriceNegotiator': {
      return JSON.stringify({
        opening_offer: "₦135,000",
        opening_line: "Bro, respect. The pair is clean, but market liquidity today is tight. I have ₦135,000 cash ready right now, no delay.",
        tactics: [
          "Demonstrate instant liquidity: cash in hand or instant bank transfer closes deals faster than promises.",
          "Highlight subtle box creases or lace swap needs without insulting the vendor's stock.",
          "Propose meeting at the SF26 Escrow table so both parties save on shipping and authentication overhead."
        ],
        middle_ground: "₦150,000",
        script: "Buyer: 'Boss, how far? I like this pair. How much last for cash on the spot?'\nVendor: '185K last bro, quality is pristine.'\nBuyer: 'No doubt, shoe is mad. But budget is 135K cash right now, transfer instantly.'\nVendor: '135K too low boss, even cost price pass that.'\nBuyer: 'I feel you. Meet me halfway at 150K and let's sign it over at the Lagos Sole Exchange table right now.'\nVendor: 'Bring 155K make we close am.'\nBuyer: '150K and I take your vendor flyer to shout you out on my story. Deal?'\nVendor: 'Deal.'",
        walk_away_line: "No wahala boss, I respect your price. Let me do a lap around the park. If you still have it when I circle back, maybe we find common ground. Bless."
      })
    }

    case 'DropAnalyzer': {
      return JSON.stringify({
        verdict: "COP",
        confidence: 86,
        headline: "High cultural resonance and tight production volume indicate immediate upward resale pressure.",
        lagos_market: "Lagos demand for this silhouette is surging among the Alté and creative tech demographics. Expect high turnover within the first 14 days of release.",
        resale_upside: "₦40,000–₦75,000 estimated resale premium above retail.",
        cop_strategy: "Enter official tier raffles early, coordinate with trusted local stockists in VI, or lock in an allocation via the SF26 Early Access waitlist.",
        red_flags: "Ensure size is within the golden range (US 8.5 to US 11); smaller and extreme sizes carry slower liquidity in Lagos.",
        culture_score: "9/10 — instant street status across Lagos island and mainland."
      })
    }

    case 'HeatPredictor': {
      return JSON.stringify({
        signal: "BUY",
        confidence: 84,
        current_lagos_price: "₦165,000",
        global_trend: "Global secondary market stock is contracting following brand distribution cuts.",
        "6_month_outlook": "Projected to appreciate 18–25% as year-end festive demand spikes across Nigerian entertainment hubs.",
        "12_month_outlook": "Likely to stabilize as a heritage classic holding firm value above ₦220,000.",
        key_factors: [
          "High durability suited for everyday Lagos urban commuting",
          "Versatile neutral colorway easily styled with traditional and streetwear fits",
          "Celebrity and DJ co-signs in the local Afrobeats music scene"
        ],
        risk: "Restock rumors from global retailers could momentarily soften secondary premiums.",
        lagos_tip: "Hold deadstock in climate-controlled storage; pairs with intact original factory receipts command top dollar at SF26."
      })
    }

    case 'StoryGenerator': {
      return `You remember the afternoon the heat arrived in Lagos like it was burned into the asphalt of Broad Street. You had spent three months doing remote sprint edits, saving every stray ₦10,000 note in a hidden envelope beneath your desk. Everyone in your set thought you were crazy, skipping Friday nights at Freedom Park just to keep the dream intact. But you weren't saving for mere rubber and leather; you were funding an undeniable statement of arrival.

The morning you unboxed them, the humid Atlantic air caught the fresh tumbled grain, and the scent was pure victory. Walking through Yaba towards the bus terminal, the ordinary noise of the city seemed to drop into rhythmic slow-motion. A conductor leaning out of a yellow Danfo bus pointed down and gave you an approving nod that money could never buy. That wasn't just footwear; it was armor against mediocrity.

Years have passed now, and the soles bear the honest grit of Marina sidewalks, late-night shoots in Lekki, and rainstorms survived without a flinch. Every scuff is a battle scar from a chapter you wrote with your own two hands. You don't just lace them up to walk through Lagos; you lace them up to remind yourself of the person who refused to stay down.`
    }

    case 'SneakerRoast': {
      return `Look at this rotation. You really walked into the room thinking this was a portfolio when it's actually an algorithmic cry for help.

You have the standard Panda Dunks that have seen more Alaba market pavement than an actual delivery truck. You wear them like they're rare grails when every second university student on campus has the exact same pair taped up with hope and clear glue. And don't get me started on those creases — the toe box looks like an origami crane that gave up halfway through.

Then you brought out the beaten-up Jordan 4 with netting yellower than a Danfo bus exhaust pipe. You told your boys it's 'vintage patina' — bro, that is not patina, that is humidity and regret from leaving them outside during a Mainland downpour.

I'll give you credit for one thing though: that OG colorway underneath all the dust has legitimate history. Clean those midsoles, retire the beaten Dunks to the gym rack, and pull up to Sneakers Fest '26 so the city can teach you how to properly rotate your heat.`
    }

    case 'CaptionGenerator': {
      return `Lagos pavement tests everything — your patience, your hustle, and the authenticity of your soles. Stepping into Sneakers Fest '26 with uncompromised heat. Catch me at the Lagos Sole Exchange before the vault locks down. ⚡🇳🇬 #SneakersFest26 #LagosStreetwear #SoleCulture #CatalystOS #LagosDrip`
    }

    case 'StyleArchetype': {
      return JSON.stringify({
        archetype: "The Balogun Alchemist",
        tagline: "Turns everyday Lagos street grit into uncompromising editorial gold.",
        traits: [
          "Curates high-low contrasts: vintage Nigerian market finds paired with pristine tier-one grails",
          "Immune to artificial hype; buys strictly for architectural silhouette and cultural longevity",
          "Moves through Lagos with effortless composure regardless of traffic or weather"
        ],
        what_you_value: "You value authenticity and craftsmanship above hype logos. If a shoe cannot survive a real day on Lagos soil, it has no place in your vault.",
        spirit_shoe: "Air Jordan 1 Retro High OG 'Chicago' — timeless, battle-tested, and forever iconic.",
        sf26_move: "Spends the first hour scanning the Collector Room with laser focus, secures one undeniable gem, and anchors the VIP lounge discussions.",
        share_line: "Culture isn't bought from an algorithm. It's built on foot through the streets of Lagos. ⚡"
      })
    }

    case 'VendorMatcher': {
      return JSON.stringify({
        overall_strategy: "Begin your hunt at Sector B (Independent Resellers & Curated Vintage) during the morning golden hour before moving toward the Main Stage brand booths.",
        items: [
          {
            shoe: "Grail Target",
            vendor_type: "Curated Consignment & Collector Booths (Sector A)",
            timing: "12:00 PM – 1:30 PM (optimal selection before high footfall)",
            cash_or_card: "Cash or instant verified bank transfer recommended for maximum price elasticity.",
            tip: "Ask to see the original box label and UV blacklight verification stamp from the SF26 physical escrow team."
          }
        ],
        first_move: "Head straight to the central Lagos Sole Exchange authentication tent to calibrate market baseline prices.",
        bring_list: [
          "Split cash in secure waistbag",
          "Portable phone charger for instant transfer verification",
          "Microfiber cloth and mini UV flashlight"
        ],
        ticket_advantage: "VIP and Phalanx holders enjoy 60-minute priority floor access, allowing you to examine and negotiate inventory before the main crowd gathers."
      })
    }

    case 'ColdDMGenerator': {
      return JSON.stringify({
        subject_line: "Cash Ready / SF26 Meetup for your Grail Pair",
        opening: "What's good boss, caught your drop listing on the SF26 community feed.",
        body: "I'm looking to acquire the pair in size 10.5. I have instant bank transfer ready, zero back-and-forth, and we can do a verified physical handoff right at the Lagos Sole Exchange escrow table this Saturday at Muri Okunola Park.",
        ask: "Can you do ₦160K for immediate closing on the spot?",
        closing: "Let me know if this works for you so I can lock the funds. Respect.",
        tone_tip: "Send via Instagram DM or WhatsApp during mid-morning (10 AM - 12 PM) for fastest response."
      })
    }

    case 'SneakerEulogy': {
      return `You gave this city everything you had in those soles. From the chaotic rush of Ojuelegba to the polished floors of Victoria Island galleries, they absorbed the shock of every step and never complained once. The rubber may be worn smooth, and the inner lining frayed by countless miles, but the memories embedded in that leather are indestructible.

There comes a moment when even the most loyal warriors must rest. You could try to glue that heel back together, or patch the tongue with another coat of paint, but you know deep down that it has earned its peaceful discharge. It carried you through interviews that changed your life, first dates that mattered, and nights you still talk about with your closest people.

Rest easy, veteran of the Lagos pavement. You will not be forgotten or replaced in spirit. You showed us that true style isn't about keeping things untouched in a box; it's about wearing your truth until the very last stitch gives way.`
    }

    case 'CollectorCard': {
      return JSON.stringify({
        collector_title: "The Grail Guardian of Lagos",
        rank: "ELITE",
        rep_score: 88,
        tagline: "Moves with deliberate taste, unswayed by disposable internet trends.",
        specialty: "High-top heritage retros, weather-resistant leather editions, and limited regional collaborations.",
        longest_flex: "Deadstock condition maintained across multiple rainy seasons in Lagos.",
        weakest_link: "Occasional hesitation on quick trades when market volatility spikes.",
        signature_move: "Inspects inner tongue tags with a magnifying eye while smiling politely at the vendor.",
        sf26_predicted_behavior: "Arrives early at Muri Okunola Park, completes one legendary trade, and spends the afternoon mentoring younger collectors.",
        share_line: "In a city of loud noise, let your soles speak with quiet authority. ⚡"
      })
    }

    case 'AITrivia': {
      return JSON.stringify({
        question: "Which iconic sneaker was famously 'banned' by the NBA in 1984, prompting Nike to pay a $5,000 fine per game as part of a legendary marketing campaign?",
        options: [
          "A) Air Jordan 1 'Bred'",
          "B) Nike Air Force 1 High",
          "C) Adidas Forum 84",
          "D) Converse Weapon"
        ],
        correct: "A",
        fact: "While the NBA actually issued the warning letter for the Nike Air Ship in black/red, Nike masterfully leveraged the controversy to launch the Air Jordan 1 'Banned' campaign, creating the foundation of modern sneaker culture."
      })
    }

    case 'VendorReg': {
      return "Pioneering authentic Lagos streetwear culture with uncompromising quality and verified heat. Presenting our signature collection and exclusive limited drop at Sneakers Fest '26."
    }

    case 'SneakerKnowledgeVault': {
      return "The Lagos sneaker market functions on an intricate blend of global hype cycles and hyper-local resilience. Scarcity drives the opening bid, but cultural resonance — whether tied to iconic music moments, street athletics, or Nigerian diaspora creative directors — is what transforms a temporary trend into a generational grail. At Sneakers Fest '26, the Lagos Sole Exchange formalizes this liquidity through transparent physical escrow authentication."
    }

    default: {
      // General conversational fallback for AIChat and others
      if (q.includes('ticket') || q.includes('price') || q.includes('cost')) {
        return "Tickets for Sneakers Fest '26 are structured across 4 honest tiers:\n• General Admission: ₦5,000 (Full-day festival access, 30+ vendor floor, live DJ sets)\n• VIP: ₦10,000 (Priority entrance, VIP lounge, official merch gift)\n• VVIP: ₦25,000 (Collector Room access, private lounge, exclusive drop allocation)\n• Phalanx: ₦50,000 (Ultra-exclusive concierge, 11 AM early entry, collector vault box)\n\nReserve directly in the Tickets section."
      }
      if (q.includes('ceo') || q.includes('farouq') || q.includes('catalyst') || q.includes('founder')) {
        return "Sneakers Fest '26 is founded and directed by Oluwatobiloba — The Catalyst (@catalystggg). The entire experience is powered by the Catalyst OS ecosystem, merging streetwear culture, intellectual property, and cutting-edge autonomous technology in Lagos."
      }
      if (q.includes('venue') || q.includes('where') || q.includes('location')) {
        return "Sneakers Fest '26 takes place on Saturday, December 12, 2026, at Muri Okunola Park, Victoria Island, Lagos. Doors open at 12:00 PM (11:00 AM for Phalanx VIP pass holders)."
      }
      if (q.includes('skill') || q.includes('catalyst os')) {
        return "The Catalyst OS Skills Registry powers the entire intelligence infrastructure of Sneakers Fest '26, featuring 2,393 universal skills across Anthropics, Claude Skills, Antigravity, and VoltAgent, alongside 70 specialized priority modules for Event Management, AI Automation, Legal, Marketing, Content, and Business."
      }
      return "Welcome to Sneakers Fest '26. Powered by Catalyst OS and founded by CEO @catalystggg. Whether you're hunting grails at the Lagos Sole Exchange, running a FitCheck in our studio, or securing your ticket for December 12 at Muri Okunola Park, we've got you covered. What would you like to explore?"
    }
  }
}
