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
import { captureReferral, reconcileReferralCredits } from './lib/referral'
import Hero from './sections/Hero'
import Stats from './sections/Stats'
import About from './sections/About'
import OriginStory from './sections/OriginStory'
import FridayNightProtocol from './sections/FridayNightProtocol'
import Press from './sections/Press'
import Sponsors from './sections/Sponsors'
import SponsorTiers from './sections/SponsorTiers'
import Highlights from './sections/Highlights'
import Community from './sections/Community'
import Testimonials from './sections/Testimonials'
import Passport from './sections/Passport'
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
import EarlyAccess from './sections/EarlyAccess'
const Comics      = lazy(() => import('./sections/Comics'))
const Gallery     = lazy(() => import('./sections/Gallery'))
const TradeBoard  = lazy(() => import('./sections/TradeBoard'))
import Leaderboard from './sections/Leaderboard'
const PhotoTools  = lazy(() => import('./sections/PhotoTools'))
import Newsletter from './sections/Newsletter'
import Lineup from './sections/Lineup'
import Schedule from './sections/Schedule'
import Venue from './sections/Venue'
import Merch from './sections/Merch'
import Raffle from './sections/Raffle'
import Countdown from './sections/Countdown'
import Tickets from './sections/Tickets'
import VendorReg from './sections/VendorReg'
import FAQ from './sections/FAQ'
import Contact from './sections/Contact'
import Footer from './sections/Footer'
const EggHuntTracker = lazy(() => import('./sections/EggHuntTracker'))

const SECTION_TITLES = [
  { id: 'about',          title: "About | Sneakers Fest '26" },
  { id: 'origin',         title: "The Origin | Sneakers Fest '26" },
  { id: 'fnp',            title: "Friday Night Protocol | Sneakers Fest '26" },
  { id: 'press',          title: "Press | Sneakers Fest '26" },
  { id: 'sponsors',       title: "Sponsors | Sneakers Fest '26" },
  { id: 'sponsor-tiers',  title: "Partner With Us | Sneakers Fest '26" },
  { id: 'highlights',     title: "Experience | Sneakers Fest '26" },
  { id: 'community',      title: "Community | Sneakers Fest '26" },
  { id: 'testimonials',   title: "Stories | Sneakers Fest '26" },
  { id: 'passport',       title: "Sneaker Passport | Sneakers Fest '26" },
  { id: 'dna',            title: "Sneaker DNA | Sneakers Fest '26" },
  { id: 'sole-of-lagos',  title: "The Sole of Lagos | Sneakers Fest '26" },
  { id: 'culture-history',title: "Art & Culture | Sneakers Fest '26" },
  { id: 'museum',         title: "The Museum | Sneakers Fest '26" },
  { id: 'vault-200',      title: "Architect Vault | Sneakers Fest '26" },
  { id: 'wall',           title: "The Wall | Sneakers Fest '26" },
  { id: 'trivia',         title: "Trivia | Sneakers Fest '26" },
  { id: 'memory-match',   title: "Sole Memory | Sneakers Fest '26" },
  { id: 'soledle',        title: "Soledle | Sneakers Fest '26" },
  { id: 'colorizer',      title: "Shoe Builder | Sneakers Fest '26" },
  { id: 'outfit',         title: "Outfit Matcher | Sneakers Fest '26" },
  { id: 'hype',           title: "Hype | Sneakers Fest '26" },
  { id: 'spin',           title: "Spin to Win | Sneakers Fest '26" },
  { id: 'vote-off',       title: "Crew Vote-Off | Sneakers Fest '26" },
  { id: 'badge',          title: "Badge Maker | Sneakers Fest '26" },
  { id: 'mystery',        title: "Mystery Drop | Sneakers Fest '26" },
  { id: 'worth',          title: "Collection Worth | Sneakers Fest '26" },
  { id: 'bingo',          title: "Sneaker Bingo | Sneakers Fest '26" },
  { id: 'artists',        title: "Artists | Sneakers Fest '26" },
  { id: 'timeline',       title: "Drops Timeline | Sneakers Fest '26" },
  { id: 'waitlist',       title: "Early Access | Sneakers Fest '26" },
  { id: 'comics',         title: "Catalyst Universe | Sneakers Fest '26" },
  { id: 'gallery',        title: "Gallery | Sneakers Fest '26" },
  { id: 'trades',         title: "Trade Board | Sneakers Fest '26" },
  { id: 'leaderboard',    title: "Rankings | Sneakers Fest '26" },
  { id: 'egg-hunt',       title: "The Great Sole Hunt | Sneakers Fest '26" },
  { id: 'photo-tools',    title: "Photo Studio | Sneakers Fest '26" },
  { id: 'lineup',         title: "Lineup | Sneakers Fest '26" },
  { id: 'schedule',       title: "Schedule | Sneakers Fest '26" },
  { id: 'venue',          title: "Venue | Sneakers Fest '26" },
  { id: 'merch',          title: "Merch | Sneakers Fest '26" },
  { id: 'raffle',         title: "Raffle | Sneakers Fest '26" },
  { id: 'countdown',      title: "Countdown | Sneakers Fest '26" },
  { id: 'tickets',        title: "Tickets | Sneakers Fest '26" },
  { id: 'vendors',        title: "Vendors | Sneakers Fest '26" },
  { id: 'faq',            title: "FAQ | Sneakers Fest '26" },
  { id: 'contact',        title: "Contact | Sneakers Fest '26" },
]

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
    SECTION_TITLES.forEach(s => {
      const el = document.getElementById(s.id)
      if (el) observer.observe(el)
    })
    return () => observer.disconnect()
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

          /* Custom cursor — hide system cursor on pointer devices */
          @media (hover: hover) {
            * { cursor: none !important; }
            input, textarea { cursor: text !important; }
          }

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
        <KonamiCode />

        <Hero />
        <EventTicker />
        <Stats />

        <Reveal><About /></Reveal>
        <Reveal><OriginStory /></Reveal>
        <Reveal><FridayNightProtocol /></Reveal>
        <Reveal><Press /></Reveal>
        <Reveal><Sponsors /></Reveal>
        <Reveal><SponsorTiers /></Reveal>
        <Reveal><Highlights /></Reveal>
        <Reveal><Community /></Reveal>
        <Reveal><Testimonials /></Reveal>
        <Reveal><Passport /></Reveal>
        <Suspense fallback={null}>
          <Reveal><SneakerDNA /></Reveal>
          <Reveal><SoleOfLagos /></Reveal>
          <Reveal><CultureHistory /></Reveal>
          <Reveal><CultureMuseum /></Reveal>
          <Reveal><ArchitectVault /></Reveal>
          <Reveal><SneakerBible /></Reveal>
          <Reveal><CommunityWall /></Reveal>
          <Reveal><SneakerTrivia /></Reveal>
          <Reveal><MemoryMatch /></Reveal>
          <Reveal><Soledle /></Reveal>
          <Reveal><ShoeColorizer /></Reveal>
          <Reveal><OutfitMatcher /></Reveal>
          <Reveal><HypeCounter /></Reveal>
          <Reveal><SpinWheel /></Reveal>
          <Reveal><CrewVoteOff /></Reveal>
          <Reveal><BadgeMaker /></Reveal>
          <Reveal><MysteryDrop /></Reveal>
          <Reveal><SneakerWorth /></Reveal>
          <Reveal><SneakerBingo /></Reveal>
          <Reveal><ArtistSpotlight /></Reveal>
          <Reveal><DropsTimeline /></Reveal>
        </Suspense>
        <Reveal><EarlyAccess /></Reveal>
        <Suspense fallback={null}>
          <Reveal><Comics /></Reveal>
          <Reveal><Gallery /></Reveal>
          <Reveal><TradeBoard /></Reveal>
        </Suspense>
        <Reveal><Leaderboard /></Reveal>
        <Suspense fallback={null}>
          <Reveal><EggHuntTracker /></Reveal>
          <Reveal><PhotoTools /></Reveal>
        </Suspense>
        <Reveal><Newsletter /></Reveal>
        <Reveal><Lineup /></Reveal>
        <Reveal><Schedule /></Reveal>
        <Reveal><Venue /></Reveal>
        <Reveal><Merch /></Reveal>
        <Reveal><Raffle /></Reveal>
        <Reveal><Countdown /></Reveal>
        <Reveal><Tickets /></Reveal>
        <Reveal><VendorReg /></Reveal>
        <Reveal><FAQ /></Reveal>
        <Reveal><Contact /></Reveal>
        <Reveal><Footer /></Reveal>
      </div>
    </AuthProvider>
  )
}
