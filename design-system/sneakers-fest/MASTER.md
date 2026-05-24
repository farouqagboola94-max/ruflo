# Sneakers Fest '26 — Design System (MASTER)

Generated via UI/UX Pro Max skill v2.5.0  
Project: Sneakers Fest | Lagos Noir × Cyberpunk | Online Community + Physical Event

---

## Pattern
**Community/Forum Landing + Event/Conference Landing**  
Show active community (member count, posts today). Hero with date/location/countdown. Speakers/lineup grid. Register CTA sticky.

---

## Style
**Cyberpunk UI + Dark Mode OLED + Glassmorphism accents**
- Keywords: Neon, dark mode, HUD, sci-fi, glitch, dystopian, futuristic, tech noir, Lagos street
- Performance: Moderate (backdrop-filter cost) — use sparingly on key sections
- Accessibility: Ensure WCAG AA (4.5:1 minimum on all text)

---

## Colour Palette

| Token | Hex | Use |
|-------|-----|-----|
| `--black` | `#0A0A0A` | Page background |
| `--void` | `#111111` | Section alternates |
| `--charcoal` | `#1A1A1A` | Card backgrounds |
| `--gunmetal` | `#2A2A2A` | Borders, dividers |
| `--amber` | `#F5A623` | Primary CTA, headings, glow |
| `--neon-cyan` | `#00F0FF` | Secondary accent, links |
| `--neon-magenta` | `#FF2D7B` | Tertiary accent, lineup |
| `--neon-lime` | `#B8FF00` | Live/active indicators, WhatsApp |
| `--white` | `#F0EDE6` | Body text |
| `--smoke` | `#8A8A8A` | Secondary text |

---

## Typography

| Role | Font | Weight | Use |
|------|------|--------|-----|
| Display | Bebas Neue | 400 | Hero title, section headings |
| Brand | Orbitron | 700–900 | Logo, countdown, prices |
| Mono | Space Mono | 400–700 | Labels, tags, eyebrow text |
| Body | Syne | 400–700 | Descriptions, body copy |

---

## Glassmorphism Tokens

```css
--glass-bg:          rgba(255,255,255,0.05);
--glass-bg-featured: rgba(255,255,255,0.09);
--glass-blur:        blur(20px) saturate(180%);
--glass-border:      rgba(255,255,255,0.10);
--glass-sheen:       linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
--glass-shadow:      0 8px 32px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.10);
```

**Rule:** Glassmorphism requires coloured blobs behind cards. Always pair glass surfaces with radial-gradient blobs (blur: 60–70px) in the section background.

---

## Key Effects

| Effect | Spec |
|--------|------|
| Glow text | `text-shadow: 0 0 20px colour60, 0 0 50px colour30` |
| Scanlines | `repeating-linear-gradient` overlay, opacity 0.04–0.06 |
| Grain | SVG fractal noise, opacity 0.5, mix-blend-mode overlay |
| Glitch | CSS animation: skew + opacity, 0.3s |
| Neon dot pulse | `animation: pulse 1.5–2s infinite`, boxShadow glow |
| Hover lift | `transform: translateY(-4–5px)`, 0.3s ease |

---

## CTA Rules (from Event/Conference pattern)

- Register/Tickets CTA: **sticky in navbar + after hero + in pricing**
- Community CTA: after every section (Join Community)
- Urgency: countdown on hero, "Early bird" on tickets
- Social proof: community stat strip (10K+ members, 6 platforms, LIVE)

---

## UX Checklist (UI/UX Pro Max)

- [ ] `cursor: pointer` on ALL clickable elements
- [ ] Hover states with 150–300ms transitions
- [ ] Min touch target 44×44px (buttons, nav links)
- [ ] Text contrast 4.5:1 minimum (check amber on dark)
- [ ] Focus states visible for keyboard nav
- [ ] `prefers-reduced-motion` respected
- [ ] Responsive at 375px, 768px, 1024px, 1440px
- [ ] No emoji as icons — use text abbreviations (TK, YT, X, IG, SC, WA)
- [ ] Glassmorphism: verify backdrop-filter fallback for unsupported browsers

---

## Anti-Patterns to Avoid

- No confusing registration flow
- No missing countdown
- No white backgrounds
- No low-contrast text (light grey on dark grey)
- No glass without coloured background blob
- No layout shift on countdown tick

---

*Generated: Sneakers Fest session | UI/UX Pro Max v2.5.0*
