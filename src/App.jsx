import { B, FONTS } from './tokens'
import { useEffect, lazy, Suspense } from 'react'
import { AuthProvider } from './lib/auth.jsx'
import CustomCursor from './components/CustomCursor'
import SocialProof from './components/SocialProof'
import Navbar from './components/Navbar'
import SocialDock from './components/SocialDock'
import AIChat from './components/AIChat'
import BackToTop from './components/BackToTop'
import WhatsAppButton from './components/WhatsAppButton'
import ShareButton from './components/ShareButton'
import ScrollProgress from './components/ScrollProgress'
import MobileCTA from './components/MobileCTA'
import SplashScreen from './components/SplashScreen'
import Reveal from './components/Reveal'
import EventTicker from './components/EventTicker'
import StreakToast from './components/StreakToast'
import LevelUpToast from './components/LevelUpToast'
import KonamiCode from './components/KonamiCode'
import ReactivationBanner from './components/ReactivationBanner'
import LiveActivity from './components/LiveActivity'
import CommandPalette from './components/CommandPalette'
import SectionBoundary from './components/SectionBoundary'
import { SECTIONS } from './lib/siteIndex'
import { captureReferral, reconcileReferralCredits } from './lib/referral'
// Above the fold — always eager so first paint is complete.
import Hero from './sections/Hero'
import Stats from './sections/Stats'
import Highlights from './sections/Highlights'
// Everything below the fold is code-split; it loads as the reader travels.
const About               = lazy(() => import('./sections/About'))
const OriginStory         = lazy(() => import('./sections/OriginStory'))
const FridayNightProtocol = lazy(() => import('./sections/FridayNightProtocol'))
const Press               = lazy(() => import('./sections/Press'))
const Sponsors            = lazy(() => import('./sections/Sponsors'))
const SponsorTiers        = lazy(() => import('./sections/SponsorTiers'))
const Community           = lazy(() => import('./sections/Community'))
const Testimonials        = lazy(() => import('./sections/Testimonials'))
const Passport            = lazy(() => import('./sections/Passport'))
const SneakerDNA    = lazy(() => import('./sections/SneakerDNA'))
const SoleOfLagos   = lazy(() => import('./sections/SoleOfLagos'))
const CultureHistory = lazy(() => import('./sections/CultureHistory'))
const CultureMuseum  = lazy(() => import('./sections/CultureMuseum'))
const ArchitectVault = lazy(() => import('./sections/ArchitectVault'))
const SneakerBible   = lazy(() => import('./sections/SneakerBible'))
const CommunityWall  = lazy(() => import('./sections/CommunityWall'))
// Game sections — lazy-loaded to reduce initial bundle
const SneakerTrivia  = lazy(() => import('./sections/SneakerTrivia'))
const MemoryMatch    = lazy(() => import('./sections/MemoryMatch'))
const Soledle        = lazy(() => import('./sections/Soledle'))
const ShoeColorizer  = lazy(() => import('./sections/ShoeColorizer'))
const OutfitMatcher  = lazy(() => import('./sections/OutfitMatcher'))
const HypeCounter    = lazy(() => import('./sections/HypeCounter'))
const SpinWheel      = lazy(() => import('./sections/SpinWheel'))
const CrewVoteOff    = lazy(() => import('./sections/CrewVoteOff'))
const BadgeMaker     = lazy(() => import('./sections/BadgeMaker'))
const MysteryDrop    = lazy(() => import('./sections/MysteryDrop'))
const SneakerWorth   = lazy(() => import('./sections/SneakerWorth'))
const SneakerBingo   = lazy(() => import('./sections/SneakerBingo'))
// Culture & tools — lazy-loaded
const ArtistSpotlight = lazy(() => import('./sections/ArtistSpotlight'))
const DropsTimeline   = lazy(() => import('./sections/DropsTimeline'))
// CatalystOS — AI tools ecosystem
const CatalystOS_AI_Repo      = lazy(() => import('./sections/CatalystOS_AI_Repo'))
const CatalystOS_MCP_Carousel = lazy(() => import('./sections/CatalystOS_MCP_Carousel'))
const CatalystOS_Obsidian     = lazy(() => import('./sections/CatalystOS_Obsidian_Module'))
const CatalystOS_UGC          = lazy(() => import('./sections/CatalystOS_UGC_Engine'))
const CommunityIntelligence   = lazy(() => import('./sections/CommunityIntelligence'))
const SneakerKnowledgeVault   = lazy(() => import('./sections/SneakerKnowledgeVault'))
const GrailAdvisor            = lazy(() => import('./sections/GrailAdvisor'))
const DropAnalyzer            = lazy(() => import('./sections/DropAnalyzer'))
const AITrivia                = lazy(() => import('./sections/AITrivia'))
const TradeNegotiator         = lazy(() => import('./sections/TradeNegotiator'))
const AuctionWall             = lazy(() => import('./sections/AuctionWall'))
const CaptionGenerator        = lazy(() => import('./sections/CaptionGenerator'))
const FitCheckAI              = lazy(() => import('./sections/FitCheckAI'))
const PriceNegotiator         = lazy(() => import('./sections/PriceNegotiator'))
const FakeDetector            = lazy(() => import('./sections/FakeDetector'))
const StyleArchetype          = lazy(() => import('./sections/StyleArchetype'))
const VendorMatcher           = lazy(() => import('./sections/VendorMatcher'))
const StoryGenerator          = lazy(() => import('./sections/StoryGenerator'))
const SneakerRoast            = lazy(() => import('./sections/SneakerRoast'))
const HeatPredictor           = lazy(() => import('./sections/HeatPredictor'))
const ColdDMGenerator         = lazy(() => import('./sections/ColdDMGenerator'))
const SneakerEulogy           = lazy(() => import('./sections/SneakerEulogy'))
const CollectorCard           = lazy(() => import('./sections/CollectorCard'))
const EarlyAccess     = lazy(() => import('./sections/EarlyAccess'))
const Comics          = lazy(() => import('./sections/Comics'))
const Gallery         = lazy(() => import('./sections/Gallery'))
const TradeBoard      = lazy(() => import('./sections/TradeBoard'))
const Leaderboard     = lazy(() => import('./sections/Leaderboard'))
const PhotoTools      = lazy(() => import('./sections/PhotoTools'))
const Newsletter      = lazy(() => import('./sections/Newsletter'))
const Schedule        = lazy(() => import('./sections/Schedule'))
const Venue           = lazy(() => import('./sections/Venue'))
const Merch           = lazy(() => import('./sections/Merch'))
const Raffle          = lazy(() => import('./sections/Raffle'))
const SoleRegistry    = lazy(() => import('./sections/SoleRegistry'))
const CultureIndex    = lazy(() => import('./sections/CultureIndex'))
const Confessional    = lazy(() => import('./sections/Confessional'))
const Crews           = lazy(() => import('./sections/Crews'))
const FridayProtocol  = lazy(() => import('./sections/FridayProtocol'))
const GroupTickets    = lazy(() => import('./sections/GroupTickets'))
const VendorReg       = lazy(() => import('./sections/VendorReg'))
const VendorDashboard = lazy(() => import('./sections/VendorDashboard'))
const AppPromo        = lazy(() => import('./sections/AppPromo'))
const FAQ             = lazy(() => import('./sections/FAQ'))
const Contact         = lazy(() => import('./sections/Contact'))
const EggHuntTracker  = lazy(() => import('./sections/EggHuntTracker'))
// Conversion path + footer stay eager: they must never wait on a chunk.
import Lineup from './sections/Lineup'
import Countdown from './sections/Countdown'
import Tickets from './sections/Tickets'
import Footer from './sections/Footer'

// Titles are derived from the shared site index so the palette, the nav and
// the document title can never disagree about what a section is called.
const SECTION_TITLES = SECTIONS.map(s => ({ id: s.id, title: `${s.t} | Sneakers Fest '26` }))

export default function App() {
  useEffect(() => {
    captureReferral()
    reconcileReferralCredits()
  }, [])

  useEffect(() => {
    document.title = "Sneakers Fest '26 — The Sole Exhibition, Lagos"
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const found = SECTION_TITLES.find(s => s.id === entry.target.id)
            if (found) document.title = found.title
          }
        })
      },
      { threshold: 0.35 }
    )
    // Most sections are code-split, so they appear in the DOM long after
    // mount. Rescan as the reader scrolls to pick up whatever has arrived.
    const seen = new Set()
    const scan = () => {
      for (const s of SECTION_TITLES) {
        if (seen.has(s.id)) continue
        const el = document.getElementById(s.id)
        if (el) { seen.add(s.id); observer.observe(el) }
      }
    }
    scan()
    let scanTimer
    const onScroll = () => { clearTimeout(scanTimer); scanTimer = setTimeout(scan, 300) }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      clearTimeout(scanTimer)
      window.removeEventListener('scroll', onScroll)
      observer.disconnect()
    }
  }, [])

  // Framework 1: Agentic suspend/resume — save scroll state, restore on return within 30 min
  // Framework 3: RL experience replay — track dwell time per section, persist as interaction memory
  useEffect(() => {
    const SESSION_KEY = 'sf26_session'
    const MEMORY_KEY  = 'sf26_interaction_memory'

    // Restore last scroll position if within the same session window
    try {
      const saved = JSON.parse(localStorage.getItem(SESSION_KEY) || 'null')
      if (saved && Date.now() - saved.ts < 30 * 60 * 1000 && saved.scroll > 400) {
        setTimeout(() => window.scrollTo({ top: saved.scroll, behavior: 'smooth' }), 900)
      }
    } catch {}

    // Throttled session state saver (Framework 1)
    let saveTimer
    const saveSession = () => {
      try { localStorage.setItem(SESSION_KEY, JSON.stringify({ ts: Date.now(), scroll: window.scrollY })) } catch {}
    }
    window.addEventListener('beforeunload', saveSession)

    // RL dwell-time observer (Framework 3)
    let mem = []
    try { mem = JSON.parse(localStorage.getItem(MEMORY_KEY) || '[]') } catch {}
    const dwellStart = {}

    const rlObserver = new IntersectionObserver(entries => {
      const now = Date.now()
      entries.forEach(entry => {
        const id = entry.target.id
        if (entry.isIntersecting) {
          dwellStart[id] = now
        } else if (dwellStart[id]) {
          const ms = now - dwellStart[id]
          delete dwellStart[id]
          if (ms < 700) return
          try {
            const hit = mem.find(m => m.section === id)
            if (hit) { hit.duration += ms; hit.visits = (hit.visits || 1) + 1 }
            else mem.push({ section: id, duration: ms, visits: 1 })
            localStorage.setItem(MEMORY_KEY, JSON.stringify(mem.slice(-20)))
          } catch {}
        }
      })
    }, { threshold: 0.4 })

    // One scroll listener drives both the session save and the rescan for
    // code-split sections that have only just entered the DOM.
    const rlSeen = new Set()
    const scanRL = () => {
      for (const s of SECTION_TITLES) {
        if (rlSeen.has(s.id)) continue
        const el = document.getElementById(s.id)
        if (el) { rlSeen.add(s.id); rlObserver.observe(el) }
      }
    }
    scanRL()

    const onScroll = () => {
      clearTimeout(saveTimer)
      saveTimer = setTimeout(() => { saveSession(); scanRL() }, 500)
    }
    window.addEventListener('scroll', onScroll, { passive: true })

    return () => {
      clearTimeout(saveTimer)
      saveSession()
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('beforeunload', saveSession)
      rlObserver.disconnect()
    }
  }, [])

  return (
    <AuthProvider>
      <div style={{ background: B.black, color: B.white, minHeight: '100vh' }}>
        <style>{FONTS}</style>
        <style>{`
          * { margin: 0; padding: 0; box-sizing: border-box; }
          html { scroll-behavior: smooth; }

          /* Premium scrollbar */
          ::-webkit-scrollbar { width: 3px; }
          ::-webkit-scrollbar-track { background: ${B.black}; }
          ::-webkit-scrollbar-thumb { background: linear-gradient(${B.amber}, ${B.neonCyan}); border-radius: 2px; }

          /* Premium text selection */
          ::selection { background: ${B.amber}28; color: ${B.amberGlow}; }
          ::-moz-selection { background: ${B.amber}28; color: ${B.amberGlow}; }

          /* Custom cursor — hide system cursor on precise pointer devices only.
             Coarse pointers and reduced-motion users keep the native cursor. */
          @media (hover: hover) and (pointer: fine) {
            * { cursor: none !important; }
            input, textarea, select { cursor: text !important; }
            button, a, [role="button"] { cursor: none !important; }
          }
          @media (prefers-reduced-motion: reduce) {
            @media (hover: hover) and (pointer: fine) {
              *, button, a, [role="button"] { cursor: auto !important; }
              input, textarea, select { cursor: text !important; }
            }
          }

          /* Honour the OS "reduce motion" setting across the whole site */
          @media (prefers-reduced-motion: reduce) {
            html { scroll-behavior: auto; }
            *, *::before, *::after {
              animation-duration: 0.001ms !important;
              animation-iteration-count: 1 !important;
              transition-duration: 0.001ms !important;
              scroll-behavior: auto !important;
            }
          }

          /* Skip link — first tab stop, invisible until focused */
          .sf26-skip {
            position: fixed; top: 8px; left: -9999px; z-index: 5000;
            padding: 12px 20px; border-radius: 4px;
            background: ${B.amber}; color: ${B.black};
            font-family: 'Space Mono', monospace; font-size: 11px;
            font-weight: 700; letter-spacing: 0.14em; text-decoration: none;
          }
          .sf26-skip:focus { left: 8px; }

          /* Smooth font rendering */
          body { -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale; }

          /* Focus ring */
          :focus-visible { outline: 2px solid ${B.amber}55; outline-offset: 3px; }

          select option { background: #111; color: #fff; }
          input::placeholder { color: rgba(255,255,255,0.25); }

          /* ---- Keyframes ---- */
          @keyframes pulse       { 0%,100%{opacity:1} 50%{opacity:0.5} }
          @keyframes flicker     { 0%,100%{opacity:1} 92%{opacity:1} 93%{opacity:0.8} 94%{opacity:1} 96%{opacity:0.9} }
          @keyframes fadeUp      { from{opacity:0;transform:translateY(30px)} to{opacity:1;transform:translateY(0)} }
          @keyframes spin        { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
          @keyframes chatSlideIn { from{opacity:0;transform:translateY(20px) scale(0.95)} to{opacity:1;transform:translateY(0) scale(1)} }
          @keyframes slideFromRight { from{opacity:0;transform:translateX(60px)} to{opacity:1;transform:translateX(0)} }
          @keyframes confettiFall  { 0%{transform:translateY(-20px) rotate(0deg);opacity:0.9} 100%{transform:translateY(110vh) rotate(720deg);opacity:0} }
          @keyframes ticketIn      { from{opacity:0;transform:translateY(10px) scale(0.96)} to{opacity:1;transform:translateY(0) scale(1)} }

          /* Premium additions */
          @keyframes shimmer {
            0%   { background-position: 0%   center; }
            100% { background-position: 200% center; }
          }
          @keyframes marqueeScroll {
            from { transform: translateX(0); }
            to   { transform: translateX(-33.333%); }
          }
          @keyframes float {
            0%,100% { transform: translateY(0px); }
            50%     { transform: translateY(-10px); }
          }
          @keyframes borderGlow {
            0%,100% { box-shadow: 0 0 20px ${B.amber}30; }
            50%     { box-shadow: 0 0 40px ${B.amber}55, 0 0 80px ${B.amber}20; }
          }
          @keyframes scanUp {
            from { transform: translateY(100%); }
            to   { transform: translateY(-100%); }
          }
        `}</style>

        <a href="#tickets" className="sf26-skip">SKIP TO TICKETS</a>
        <CommandPalette />
        <CustomCursor />
        <SocialProof />
        <ScrollProgress />
        <SplashScreen />
        <Navbar />
        <SocialDock />
        <AIChat />
        <BackToTop />
        <WhatsAppButton />
        <ShareButton />
        <MobileCTA />
        <StreakToast />
        <LevelUpToast />
        <LiveActivity />
        <ReactivationBanner />
        <KonamiCode />

        <Hero />
        <EventTicker />
        <Stats />

        {/* ACT 1: GET EXCITED — visual, high energy, no reading walls */}
        <Reveal><Highlights /></Reveal>
        <Reveal><Lineup /></Reveal>
        <SectionBoundary><Suspense fallback={null}>
          <Reveal><ArtistSpotlight /></Reveal>
          <Reveal><SneakerTrivia /></Reveal>
          <Reveal><HypeCounter /></Reveal>
          <Reveal><AITrivia /></Reveal>
          <Reveal><SpinWheel /></Reveal>
          <Reveal><FitCheckAI /></Reveal>
        </Suspense></SectionBoundary>

        {/* FIRST CONVERSION PUSH — catch motivated visitors early */}
        <Reveal><Countdown /></Reveal>
        <Reveal><Tickets /></Reveal>
        <SectionBoundary><Suspense fallback={null}>
          <Reveal><GroupTickets /></Reveal>
        </Suspense></SectionBoundary>

        {/* ACT 2: COMMUNITY — social proof and belonging */}
        <SectionBoundary><Suspense fallback={null}>
          <Reveal><Testimonials /></Reveal>
          <Reveal><Community /></Reveal>
          <Reveal><Crews /></Reveal>
          <Reveal><FridayProtocol /></Reveal>
          <Reveal><CommunityWall /></Reveal>
          <Reveal><CommunityIntelligence /></Reveal>
          <Reveal><MemoryMatch /></Reveal>
        </Suspense></SectionBoundary>

        {/* ACT 3: IDENTITY — who are you as a sneakerhead? */}
        <SectionBoundary><Suspense fallback={null}>
          <Reveal><SneakerDNA /></Reveal>
          <Reveal><ShoeColorizer /></Reveal>
          <Reveal><OutfitMatcher /></Reveal>
          <Reveal><StyleArchetype /></Reveal>
          <Reveal><CollectorCard /></Reveal>
          <Reveal><SoleOfLagos /></Reveal>
        </Suspense></SectionBoundary>

        {/* ACT 4: CULTURE — for those who want to go deeper */}
        <SectionBoundary><Suspense fallback={null}>
          <Reveal><CultureHistory /></Reveal>
          <Reveal><Soledle /></Reveal>
          <Reveal><CultureMuseum /></Reveal>
          <Reveal><SneakerBible /></Reveal>
        </Suspense></SectionBoundary>

        {/* ACT 5: DROPS & TRADE — commerce and the marketplace */}
        <SectionBoundary><Suspense fallback={null}>
          <Reveal><DropsTimeline /></Reveal>
          <Reveal><VendorMatcher /></Reveal>
          <Reveal><ColdDMGenerator /></Reveal>
          <Reveal><GrailAdvisor /></Reveal>
          <Reveal><MysteryDrop /></Reveal>
          <Reveal><DropAnalyzer /></Reveal>
          <Reveal><TradeBoard /></Reveal>
          <Reveal><TradeNegotiator /></Reveal>
          <Reveal><AuctionWall /></Reveal>
          <Reveal><FakeDetector /></Reveal>
          <Reveal><PriceNegotiator /></Reveal>
          <Reveal><HeatPredictor /></Reveal>
          <Reveal><SneakerBingo /></Reveal>
          <Reveal><SneakerWorth /></Reveal>
          <Reveal><Merch /></Reveal>
        </Suspense></SectionBoundary>

        {/* ACT 6: CREATE & COMPETE — make content, go head-to-head */}
        <SectionBoundary><Suspense fallback={null}>
          <Reveal><Gallery /></Reveal>
          <Reveal><CaptionGenerator /></Reveal>
          <Reveal><StoryGenerator /></Reveal>
          <Reveal><SneakerRoast /></Reveal>
          <Reveal><SneakerEulogy /></Reveal>
          <Reveal><PhotoTools /></Reveal>
          <Reveal><CrewVoteOff /></Reveal>
          <Reveal><BadgeMaker /></Reveal>
        </Suspense></SectionBoundary>

        {/* ACT 7: ACHIEVEMENT — progression, rankings, prizes */}
        <SectionBoundary><Suspense fallback={null}>
          <Reveal><Passport /></Reveal>
          <Reveal><EggHuntTracker /></Reveal>
          <Reveal><Leaderboard /></Reveal>
          <Reveal><SoleRegistry /></Reveal>
          <Reveal><CultureIndex /></Reveal>
          <Reveal><Confessional /></Reveal>
          <Reveal><Raffle /></Reveal>

          {/* EVENT INFO — for those ready to plan the day */}
          <Reveal><Schedule /></Reveal>
          <Reveal><Venue /></Reveal>

          {/* PARTICIPATION — vendor and access tiers */}
          <Reveal><EarlyAccess /></Reveal>
          <Reveal><VendorReg /></Reveal>
          <Reveal><VendorDashboard /></Reveal>
          <Reveal><AppPromo /></Reveal>
          <Reveal><ArchitectVault /></Reveal>

          {/* BRAND & HISTORY — for those who want the full story */}
          <Reveal><About /></Reveal>
          <Reveal><OriginStory /></Reveal>
          <Reveal><FridayNightProtocol /></Reveal>
          <Reveal><Press /></Reveal>
          <Reveal><Sponsors /></Reveal>
          <Reveal><SponsorTiers /></Reveal>

          {/* ECOSYSTEM */}
          <Reveal><Comics /></Reveal>
          <Reveal><Newsletter /></Reveal>
        </Suspense></SectionBoundary>

        {/* CATALYST OS — AI Tools Ecosystem */}
        <SectionBoundary><Suspense fallback={null}>
          <Reveal><CatalystOS_AI_Repo /></Reveal>
          <Reveal><CatalystOS_MCP_Carousel /></Reveal>
          <Reveal><CatalystOS_Obsidian /></Reveal>
          <Reveal><SneakerKnowledgeVault /></Reveal>
          <Reveal><CatalystOS_UGC /></Reveal>
        </Suspense></SectionBoundary>

        {/* CLOSE */}
        <SectionBoundary><Suspense fallback={null}>
          <Reveal><FAQ /></Reveal>
          <Reveal><Contact /></Reveal>
        </Suspense></SectionBoundary>
        <Reveal><Footer /></Reveal>
      </div>
    </AuthProvider>
  )
}
