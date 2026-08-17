export const B = {
  black: "#0A0A0A",
  void: "#111111",
  charcoal: "#1A1A1A",
  gunmetal: "#2A2A2A",
  amber: "#F5A623",
  amberGlow: "#FFD080",
  amberDeep: "#C17D1A",
  neonCyan: "#00F0FF",
  neonMagenta: "#FF2D7B",
  neonLime: "#B8FF00",
  neonBlue: "#0099FF",
  electricPurple: "#9B59FF",
  white: "#F0EDE6",
  smoke: "#8A8A8A",
  mist: "#C8C4BC",

  // Muted text that is still readable.
  //
  // An audit of the rendered page found 642 elements failing WCAG AA contrast,
  // almost all of them hardcoded #333, #444 and #555 on a near-black
  // background. #333 at 7px measured 1.38:1 against a 4.5:1 requirement -
  // functionally invisible, and worse outdoors on a phone.
  //
  // The first attempt at this was #7A7A7A, which passes on pure black but
  // measured 4.05:1 once the audit ran it against the charcoal panels the
  // site actually uses. #878787 measures 4.85:1 on #1A1A1A.
  //
  // Worth knowing for future work: on a background this dark there is really
  // only ONE usable tier of muted grey. Anything meaningfully darker than
  // smoke fails. Hierarchy below this level has to come from size, weight or
  // spacing - not from a darker grey.
  dim: "#878787",
  // Lagos Noir palette
  lagosOcher: "#D4751A",
  danfoYellow: "#FFE033",
  noirBlue: "#0D1B2A",
  wetConcrete: "#1C1A17",
  lagoonTeal: "#0A3040",
  brickRust: "#5C2D0A",
  neonOrange: "#FF6B1A",
  streetHaze: "#2A1F0F",
}

export const FONTS = "@import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Inter:wght@300;400;500;600&family=Orbitron:wght@400;700;900&family=Space+Mono:wght@400;700&family=Syne:wght@400;700;800&display=swap');"
