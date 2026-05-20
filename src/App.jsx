import { B, FONTS } from './tokens'
import Navbar from './components/Navbar'
import SocialDock from './components/SocialDock'
import AIChat from './components/AIChat'
import SplashScreen from './components/SplashScreen'
import Hero from './sections/Hero'
import About from './sections/About'
import Highlights from './sections/Highlights'
import Community from './sections/Community'
import Gallery from './sections/Gallery'
import PhotoTools from './sections/PhotoTools'
import Newsletter from './sections/Newsletter'
import Lineup from './sections/Lineup'
import Merch from './sections/Merch'
import Tickets from './sections/Tickets'
import VendorReg from './sections/VendorReg'
import FAQ from './sections/FAQ'
import Footer from './sections/Footer'

export default function App() {
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
      <Hero />
      <About />
      <Highlights />
      <Community />
      <Gallery />
      <PhotoTools />
      <Newsletter />
      <Lineup />
      <Merch />
      <Tickets />
      <VendorReg />
      <FAQ />
      <Footer />
    </div>
  )
}
