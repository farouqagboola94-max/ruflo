import { useState, useEffect } from 'react'
import { B } from '../tokens'

const NAV_LINKS = [
  { label: "ABOUT", href: "#about" },
  { label: "COMMUNITY", href: "#community" },
  { label: "LINEUP", href: "#lineup" },
  { label: "TICKETS", href: "#tickets" },
  { label: "FAQ", href: "#faq" },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <nav style={{
      position: "fixed", top: 0, left: 0, right: 0, zIndex: 1000,
      padding: "0 24px",
      background: scrolled ? `${B.black}F0` : "transparent",
      backdropFilter: scrolled ? "blur(20px)" : "none",
      borderBottom: scrolled ? `1px solid ${B.gunmetal}` : "none",
      transition: "all 0.3s ease",
      height: 60, display: "flex", alignItems: "center",
    }}>
      <a href="#" style={{ textDecoration: "none", flex: 1 }}>
        <div style={{
          fontFamily: "'Orbitron', monospace", fontWeight: 900, fontSize: 14, color: B.amber,
          textShadow: `0 0 10px ${B.amber}40`, letterSpacing: "0.08em",
        }}>
          SNEAKERS FEST
        </div>
        <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 6, color: B.smoke, letterSpacing: "0.3em" }}>
          LAGOS '26
        </div>
      </a>

      <div style={{ display: "flex", gap: 24, alignItems: "center" }}>
        {NAV_LINKS.map(link => (
          <a
            key={link.label}
            href={link.href}
            style={{
              fontFamily: "'Space Mono', monospace", fontSize: 8, color: B.smoke,
              textDecoration: "none", letterSpacing: "0.2em", transition: "color 0.2s",
            }}
            onMouseEnter={e => e.target.style.color = B.amber}
            onMouseLeave={e => e.target.style.color = B.smoke}
          >
            {link.label}
          </a>
        ))}
        <a
          href="#tickets"
          style={{
            padding: "8px 18px",
            background: B.amber, color: B.black,
            fontFamily: "'Space Mono', monospace", fontSize: 8, fontWeight: 700,
            letterSpacing: "0.15em", textDecoration: "none", borderRadius: 2,
            boxShadow: `0 0 15px ${B.amber}20`,
          }}
        >
          GET TICKETS
        </a>
      </div>
    </nav>
  )
}
