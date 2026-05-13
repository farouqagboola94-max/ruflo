import { useState } from 'react'
import { B } from '../tokens'
import { SectionTag } from '../components/Shared'

const FAQS = [
  { q: "When and where is Sneakers Fest 2026?", a: "July 18, 2026 at Eko Atlantic, Lagos, Nigeria. Doors open at 12:00 PM and the event runs until 10:00 PM." },
  { q: "What is the minimum age for entry?", a: "Sneakers Fest is open to attendees aged 16 and above. Under-18s must be accompanied by a responsible adult." },
  { q: "Can I bring sneakers to sell?", a: "Yes! Register as a vendor. Limited booths are available on a first-come first-served basis. DM @SNEAKERSFEST or email info@sneakersfest.com to apply." },
  { q: "Is there parking on-site?", a: "Yes. Eko Atlantic has extensive parking facilities. Shuttle services will also run from key drop-off points on Lagos Island and Victoria Island." },
  { q: "Are refunds available?", a: "Tickets are non-refundable. However, you may transfer your ticket to another person up to 48 hours before the event by contacting us directly." },
  { q: "What payment methods are accepted?", a: "We accept debit/credit cards, bank transfer, and USSD payments via Paystack. International cards are fully supported." },
]

export default function FAQ() {
  const [open, setOpen] = useState(null)

  return (
    <section id="faq" style={{
      background: B.void, padding: "100px 24px", position: "relative",
    }}>
      <div style={{ position: "relative", zIndex: 10, maxWidth: 820, margin: "0 auto" }}>
        <div style={{ marginBottom: 52 }}>
          <SectionTag>GOT QUESTIONS?</SectionTag>
          <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "clamp(36px, 5vw, 60px)", color: B.white, lineHeight: 0.9 }}>
            FREQUENTLY<br /><span style={{ color: B.amber }}>ASKED</span>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
          {FAQS.map((item, i) => (
            <div
              key={i}
              style={{
                border: `1px solid ${open === i ? B.amber + "50" : B.gunmetal}`,
                borderRadius: 4, overflow: "hidden", transition: "border-color 0.3s",
              }}
            >
              <button
                onClick={() => setOpen(open === i ? null : i)}
                style={{
                  width: "100%", padding: "18px 20px",
                  background: open === i ? B.charcoal : "transparent",
                  display: "flex", justifyContent: "space-between", alignItems: "center",
                  cursor: "pointer", border: "none", textAlign: "left", transition: "background 0.3s",
                }}
              >
                <span style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 14, color: B.white }}>
                  {item.q}
                </span>
                <span style={{ fontFamily: "'Orbitron', monospace", fontSize: 18, color: B.amber, flexShrink: 0, marginLeft: 16 }}>
                  {open === i ? "−" : "+"}
                </span>
              </button>
              {open === i && (
                <div style={{ padding: "4px 20px 20px", background: B.charcoal }}>
                  <div style={{ width: "100%", height: 1, background: B.gunmetal, marginBottom: 14 }} />
                  <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 13, color: B.smoke, lineHeight: 1.85 }}>
                    {item.a}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        <div style={{ marginTop: 44, padding: "24px 28px", background: B.charcoal, border: `1px solid ${B.gunmetal}`, borderRadius: 4, textAlign: "center" }}>
          <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 8, color: B.smoke, letterSpacing: "0.2em", marginBottom: 10 }}>STILL HAVE QUESTIONS?</div>
          <a href="mailto:info@sneakersfest.com" style={{ fontFamily: "'Syne', sans-serif", fontSize: 15, color: B.amber, textDecoration: "none", fontWeight: 700 }}>
            info@sneakersfest.com
          </a>
        </div>
      </div>
    </section>
  )
}
