import { B, FONTS } from './tokens'
import Navbar from './components/Navbar'
import Hero from './sections/Hero'
import About from './sections/About'
import Highlights from './sections/Highlights'
import Lineup from './sections/Lineup'
import Tickets from './sections/Tickets'
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
      `}</style>
      <Navbar />
      <Hero />
      <About />
      <Highlights />
      <Lineup />
      <Tickets />
      <FAQ />
      <Footer />
    </div>
  )
}
