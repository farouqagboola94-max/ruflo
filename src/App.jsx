import { B, FONTS } from './tokens'
import { useEffect } from 'react'
import Navbar from './components/Navbar'
import SocialDock from './components/SocialDock'
import AIChat from './components/AIChat'
import BackToTop from './components/BackToTop'
import SplashScreen from './components/SplashScreen'
import Hero from './sections/Hero'
import About from './sections/About'
import Press from './sections/Press'
import Highlights from './sections/Highlights'
import Community from './sections/Community'
import Testimonials from './sections/Testimonials'
import Gallery from './sections/Gallery'
import PhotoTools from './sections/PhotoTools'
import Newsletter from './sections/Newsletter'
import Lineup from './sections/Lineup'
import Schedule from './sections/Schedule'
import Merch from './sections/Merch'
import Tickets from './sections/Tickets'
import VendorReg from './sections/VendorReg'
import FAQ from './sections/FAQ'
import Footer from './sections/Footer'

const SECTION_TITLES = [
  { id: 'about',        title: "About | Sneakers Fest '26" },
  { id: 'press',        title: "Press | Sneakers Fest '26" },
  { id: 'highlights',   title: "Experience | Sneakers Fest '26" },
  { id: 'community',    title: "Community | Sneakers Fest '26" },
  { id: 'testimonials', title: "Stories | Sneakers Fest '26" },
  { id: 'gallery',      title: "Gallery | Sneakers Fest '26" },
  { id: 'lineup',       title: "Lineup | Sneakers Fest '26" },
  { id: 'schedule',     title: "Schedule | Sneakers Fest '26" },
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
      `}</style>
      <SplashScreen />
      <Navbar />
      <SocialDock />
      <AIChat />
      <BackToTop />
      <Hero />
      <About />
      <Press />
      <Highlights />
      <Community />
      <Testimonials />
      <Gallery />
      <PhotoTools />
      <Newsletter />
      <Lineup />
      <Schedule />
      <Merch />
      <Tickets />
      <VendorReg />
      <FAQ />
      <Footer />
    </div>
  )
}
