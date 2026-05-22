import { B, FONTS } from './tokens'
import { useEffect } from 'react'
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
import KonamiCode from './components/KonamiCode'
import Hero from './sections/Hero'
import About from './sections/About'
import Press from './sections/Press'
import Sponsors from './sections/Sponsors'
import Highlights from './sections/Highlights'
import Community from './sections/Community'
import Testimonials from './sections/Testimonials'
import SneakerDNA from './sections/SneakerDNA'
import CommunityWall from './sections/CommunityWall'
import SneakerTrivia from './sections/SneakerTrivia'
import ShoeColorizer from './sections/ShoeColorizer'
import HypeCounter from './sections/HypeCounter'
import SpinWheel from './sections/SpinWheel'
import BadgeMaker from './sections/BadgeMaker'
import MysteryDrop from './sections/MysteryDrop'
import SneakerWorth from './sections/SneakerWorth'
import ArtistSpotlight from './sections/ArtistSpotlight'
import DropsTimeline from './sections/DropsTimeline'
import EarlyAccess from './sections/EarlyAccess'
import Comics from './sections/Comics'
import Gallery from './sections/Gallery'
import PhotoTools from './sections/PhotoTools'
import SubstackSection from './sections/SubstackSection'
import Newsletter from './sections/Newsletter'
import Lineup from './sections/Lineup'
import Schedule from './sections/Schedule'
import Venue from './sections/Venue'
import Merch from './sections/Merch'
import Tickets from './sections/Tickets'
import VendorReg from './sections/VendorReg'
import FAQ from './sections/FAQ'
import Footer from './sections/Footer'

const SECTION_TITLES = [
  { id: 'about',        title: "About | Sneakers Fest '26" },
  { id: 'press',        title: "Press | Sneakers Fest '26" },
  { id: 'sponsors',     title: "Sponsors | Sneakers Fest '26" },
  { id: 'highlights',   title: "Experience | Sneakers Fest '26" },
  { id: 'community',    title: "Community | Sneakers Fest '26" },
  { id: 'testimonials', title: "Stories | Sneakers Fest '26" },
  { id: 'dna',          title: "Sneaker DNA | Sneakers Fest '26" },
  { id: 'wall',         title: "The Wall | Sneakers Fest '26" },
  { id: 'trivia',       title: "Trivia | Sneakers Fest '26" },
  { id: 'colorizer',    title: "Shoe Builder | Sneakers Fest '26" },
  { id: 'hype',         title: "Hype | Sneakers Fest '26" },
  { id: 'spin',         title: "Spin to Win | Sneakers Fest '26" },
  { id: 'badge',        title: "Badge Maker | Sneakers Fest '26" },
  { id: 'mystery',      title: "Mystery Drop | Sneakers Fest '26" },
  { id: 'worth',        title: "Collection Worth | Sneakers Fest '26" },
  { id: 'artists',      title: "Artists | Sneakers Fest '26" },
  { id: 'timeline',     title: "Drops Timeline | Sneakers Fest '26" },
  { id: 'waitlist',     title: "Early Access | Sneakers Fest '26" },
  { id: 'comics',       title: "Catalyst Universe | Sneakers Fest '26" },
  { id: 'gallery',      title: "Gallery | Sneakers Fest '26" },
  { id: 'substack',     title: "Substack | Sneakers Fest '26" },
  { id: 'lineup',       title: "Lineup | Sneakers Fest '26" },
  { id: 'schedule',     title: "Schedule | Sneakers Fest '26" },
  { id: 'venue',        title: "Venue | Sneakers Fest '26" },
  { id: 'merch',        title: "Merch | Sneakers Fest '26" },
  { id: 'tickets',      title: "Tickets | Sneakers Fest '26" },
  { id: 'vendors',      title: "Vendors | Sneakers Fest '26" },
  { id: 'faq',          title: "FAQ | Sneakers Fest '26" },
]

export default function App() {
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
    <div style={{ background: B.black, color: B.white, minHeight: '100vh' }}>
      <style>{FONTS}</style>
      <style>{`
        * { margin: 0; padding: 0; box-sizing: border-box; }
        html { scroll-behavior: smooth; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: ${B.void}; }
        ::-webkit-scrollbar-thumb { background: ${B.amber}60; border-radius: 2px; }
        @keyframes pulse { 0%,100% { opacity: 1; } 50% { opacity: 0.5; } }
        @keyframes flicker { 0%,100% { opacity: 1; } 92% { opacity: 1; } 93% { opacity: 0.8; } 94% { opacity: 1; } 96% { opacity: 0.9; } }
        @keyframes fadeUp { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes chatSlideIn { from { opacity: 0; transform: translateY(20px) scale(0.95); } to { opacity: 1; transform: translateY(0) scale(1); } }
        select option { background: #111; color: #fff; }
        input::placeholder { color: rgba(255,255,255,0.25); }
      `}</style>

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
      <KonamiCode />

      <Hero />
      <EventTicker />

      <Reveal><About /></Reveal>
      <Reveal><Press /></Reveal>
      <Reveal><Sponsors /></Reveal>
      <Reveal><Highlights /></Reveal>
      <Reveal><Community /></Reveal>
      <Reveal><Testimonials /></Reveal>
      <Reveal><SneakerDNA /></Reveal>
      <Reveal><CommunityWall /></Reveal>
      <Reveal><SneakerTrivia /></Reveal>
      <Reveal><ShoeColorizer /></Reveal>
      <Reveal><HypeCounter /></Reveal>
      <Reveal><SpinWheel /></Reveal>
      <Reveal><BadgeMaker /></Reveal>
      <Reveal><MysteryDrop /></Reveal>
      <Reveal><SneakerWorth /></Reveal>
      <Reveal><ArtistSpotlight /></Reveal>
      <Reveal><DropsTimeline /></Reveal>
      <Reveal><EarlyAccess /></Reveal>
      <Reveal><Comics /></Reveal>
      <Reveal><Gallery /></Reveal>
      <Reveal><PhotoTools /></Reveal>
      <Reveal><SubstackSection /></Reveal>
      <Reveal><Newsletter /></Reveal>
      <Reveal><Lineup /></Reveal>
      <Reveal><Schedule /></Reveal>
      <Reveal><Venue /></Reveal>
      <Reveal><Merch /></Reveal>
      <Reveal><Tickets /></Reveal>
      <Reveal><VendorReg /></Reveal>
      <Reveal><FAQ /></Reveal>
      <Reveal><Footer /></Reveal>
    </div>
  )
}
