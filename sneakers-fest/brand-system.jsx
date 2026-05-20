// Sneakers Fest 2026 — Brand System
// Production React implementation: tokens, patterns, logos, and brand artboards.
// All artboard components are named exports; default export renders the full reference sheet.

import React from 'react';

// ─── Tokens ──────────────────────────────────────────────────────────────────

export const SF = {
  ink:   '#0a0a0a',
  bone:  '#f5f1e8',
  paper: '#ebe6d6',
  blaze: '#ff3b0a',
  volt:  '#ffd400',
  smoke: '#1a1a1a',
  ash:   '#7a7775',
  serif: '"Instrument Serif", "Times New Roman", serif',
  sans:  '"Archivo", system-ui, sans-serif',
  mono:  '"JetBrains Mono", ui-monospace, monospace',
};

// ─── Pattern helpers ──────────────────────────────────────────────────────────

export const sfStripes = (a = '#0a0a0a', b = 'transparent', size = 14, angle = 45) =>
  `repeating-linear-gradient(${angle}deg, ${a} 0 ${size / 2}px, ${b} ${size / 2}px ${size}px)`;

export const sfChecker = (a = '#0a0a0a', b = '#f5f1e8', size = 18) =>
  `conic-gradient(${a} 25%, ${b} 0 50%, ${a} 0 75%, ${b} 0) 0 0/${size * 2}px ${size * 2}px`;

export const sfGrid = (color = 'rgba(10,10,10,0.12)', size = 24) => ({
  backgroundImage: [
    `linear-gradient(${color} 1px, transparent 1px)`,
    `linear-gradient(90deg, ${color} 1px, transparent 1px)`,
  ].join(', '),
  backgroundSize: `${size}px ${size}px`,
});

// ─── Primitives ───────────────────────────────────────────────────────────────

export function SFCorner({ color = SF.ink, size = 14, style = {} }) {
  return (
    <svg width={size} height={size} viewBox="0 0 14 14" style={style}>
      <line x1="0" y1="7" x2="14" y2="7" stroke={color} strokeWidth="1" />
      <line x1="7" y1="0" x2="7" y2="14" stroke={color} strokeWidth="1" />
      <circle cx="7" cy="7" r="2.5" fill="none" stroke={color} strokeWidth="1" />
    </svg>
  );
}

export function SFBarcode({ color = SF.ink, height = 28, seed = 'SF26' }) {
  const bars = React.useMemo(() => {
    let h = 0;
    for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) >>> 0;
    return Array.from({ length: 48 }, () => {
      h = (h * 1103515245 + 12345) >>> 0;
      return 1 + (h % 4);
    });
  }, [seed]);
  return (
    <div style={{ display: 'flex', alignItems: 'stretch', gap: 1, height }}>
      {bars.map((w, i) => (
        <div key={i} style={{ width: w, background: i % 2 ? color : 'transparent' }} />
      ))}
    </div>
  );
}

// ─── Logo lockups ─────────────────────────────────────────────────────────────

export function LogoStacked({ scale = 1, color = SF.ink, accent = SF.blaze }) {
  return (
    <div style={{ fontFamily: SF.serif, color, lineHeight: 0.82, textAlign: 'center', fontWeight: 400 }}>
      <div style={{ fontSize: 92 * scale, letterSpacing: '-0.04em', fontStyle: 'italic' }}>Sneakers</div>
      <div style={{ fontSize: 92 * scale, letterSpacing: '-0.04em', marginTop: -8 * scale }}>
        Fest<span style={{ color: accent }}>.</span>
      </div>
      <div style={{
        fontFamily: SF.sans, fontSize: 13 * scale, fontWeight: 700,
        letterSpacing: '0.28em', marginTop: 14 * scale, color,
      }}>
        EST · 2026 · BROOKLYN
      </div>
    </div>
  );
}

export function LogoHorizontal({ scale = 1, color = SF.ink, accent = SF.blaze }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 18 * scale }}>
      <div style={{
        width: 56 * scale, height: 56 * scale, borderRadius: '50%',
        background: color, color: SF.bone,
        display: 'grid', placeItems: 'center',
        fontFamily: SF.serif, fontStyle: 'italic', fontSize: 36 * scale, lineHeight: 1,
      }}>
        <span style={{ marginTop: -2 }}>
          S<span style={{ color: accent }}>f</span>
        </span>
      </div>
      <div style={{ fontFamily: SF.serif, color, fontSize: 44 * scale, letterSpacing: '-0.03em', lineHeight: 0.95 }}>
        Sneakers Fest{' '}
        <span style={{ fontFamily: SF.mono, fontSize: 18 * scale, verticalAlign: 'middle', color: accent }}>'26</span>
      </div>
    </div>
  );
}

export function LogoStamp({ scale = 1, color = SF.ink, accent = SF.blaze, bg = 'transparent' }) {
  const size = 200 * scale;
  return (
    <div style={{ position: 'relative', width: size, height: size, background: bg }}>
      <svg viewBox="0 0 200 200" width={size} height={size} style={{ position: 'absolute', inset: 0 }}>
        <defs>
          <path id="sf-ring" d="M 100,100 m -82,0 a 82,82 0 1,1 164,0 a 82,82 0 1,1 -164,0" />
        </defs>
        <circle cx="100" cy="100" r="96" fill="none" stroke={color} strokeWidth="1" />
        <circle cx="100" cy="100" r="72" fill="none" stroke={color} strokeWidth="1" />
        <text fontFamily={SF.sans} fontSize="11" fontWeight="700" letterSpacing="3.5" fill={color}>
          <textPath href="#sf-ring" startOffset="0">
            SNEAKERS FEST · 2026 · BROOKLYN NAVY YARD · SEPT 18–20 ·
          </textPath>
        </text>
      </svg>
      <div style={{
        position: 'absolute', inset: 0,
        display: 'grid', placeItems: 'center',
        fontFamily: SF.serif, color, textAlign: 'center', lineHeight: 0.9,
      }}>
        <div>
          <div style={{ fontSize: 48 * scale, fontStyle: 'italic', letterSpacing: '-0.04em' }}>SF</div>
          <div style={{
            fontFamily: SF.mono, fontSize: 10 * scale, marginTop: 6 * scale,
            color: accent, letterSpacing: '0.2em', fontWeight: 600,
          }}>VOL · 02</div>
        </div>
      </div>
    </div>
  );
}

// ─── Brand artboards ──────────────────────────────────────────────────────────

export function ABLogo() {
  return (
    <div style={{
      width: '100%', height: '100%', background: SF.bone, position: 'relative',
      display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', alignItems: 'center',
    }}>
      {/* hairline dividers */}
      <div style={{ position: 'absolute', left: '33.33%', top: 24, bottom: 24, width: 1, background: 'rgba(10,10,10,0.12)' }} />
      <div style={{ position: 'absolute', left: '66.66%', top: 24, bottom: 24, width: 1, background: 'rgba(10,10,10,0.12)' }} />
      {/* corner marks */}
      <SFCorner style={{ position: 'absolute', top: 12, left: 12 }} />
      <SFCorner style={{ position: 'absolute', top: 12, right: 12 }} />
      <SFCorner style={{ position: 'absolute', bottom: 12, left: 12 }} />
      <SFCorner style={{ position: 'absolute', bottom: 12, right: 12 }} />
      {/* column labels */}
      <div style={{ position: 'absolute', top: 16, left: 38, fontFamily: SF.mono, fontSize: 10, letterSpacing: '0.2em', color: SF.ash }}>01 · PRIMARY / STACKED</div>
      <div style={{ position: 'absolute', top: 16, left: 'calc(33.33% + 26px)', fontFamily: SF.mono, fontSize: 10, letterSpacing: '0.2em', color: SF.ash }}>02 · HORIZONTAL LOCKUP</div>
      <div style={{ position: 'absolute', top: 16, left: 'calc(66.66% + 26px)', fontFamily: SF.mono, fontSize: 10, letterSpacing: '0.2em', color: SF.ash }}>03 · STAMP / SEAL</div>
      {/* lockups */}
      <div style={{ display: 'grid', placeItems: 'center', padding: 20 }}><LogoStacked scale={0.78} /></div>
      <div style={{ display: 'grid', placeItems: 'center', padding: 20 }}><LogoHorizontal scale={0.85} /></div>
      <div style={{ display: 'grid', placeItems: 'center', padding: 20 }}><LogoStamp scale={0.85} /></div>
    </div>
  );
}

const COLOR_SWATCHES = [
  { name: 'Ink',   hex: '#0a0a0a', oklch: 'oklch(0.13 0 0)',      use: 'Primary type, ground',   bg: SF.ink,   fg: SF.bone },
  { name: 'Bone',  hex: '#f5f1e8', oklch: 'oklch(0.95 0.01 80)',  use: 'Paper / background',     bg: SF.bone,  fg: SF.ink  },
  { name: 'Blaze', hex: '#ff3b0a', oklch: 'oklch(0.66 0.24 30)',  use: 'Hot accent · CTA',       bg: SF.blaze, fg: SF.bone },
  { name: 'Volt',  hex: '#ffd400', oklch: 'oklch(0.88 0.18 95)',  use: 'Highlight · stickers',   bg: SF.volt,  fg: SF.ink  },
  { name: 'Smoke', hex: '#1a1a1a', oklch: 'oklch(0.20 0 0)',      use: 'Secondary ground',       bg: SF.smoke, fg: SF.bone },
  { name: 'Ash',   hex: '#7a7775', oklch: 'oklch(0.55 0.01 80)',  use: 'Captions, meta',         bg: SF.ash,   fg: SF.bone },
];

export function ABColor() {
  return (
    <div style={{ width: '100%', height: '100%', background: SF.bone, padding: 32, fontFamily: SF.sans, position: 'relative' }}>
      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 24 }}>
        <div style={{ fontFamily: SF.serif, fontSize: 36, letterSpacing: '-0.03em' }}>Color</div>
        <div style={{ fontFamily: SF.mono, fontSize: 11, letterSpacing: '0.2em', color: SF.ash }}>SYS / 02</div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
        {COLOR_SWATCHES.map((s) => (
          <div
            key={s.name}
            style={{
              background: s.bg, color: s.fg, padding: 18, height: 180,
              display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
              border: s.name === 'Bone' ? '1px solid rgba(10,10,10,0.1)' : 'none',
            }}
          >
            <div style={{ fontFamily: SF.serif, fontSize: 32, lineHeight: 1, letterSpacing: '-0.02em' }}>{s.name}</div>
            <div>
              <div style={{ fontFamily: SF.mono, fontSize: 11, letterSpacing: '0.08em', opacity: 0.85 }}>{s.hex.toUpperCase()}</div>
              <div style={{ fontFamily: SF.mono, fontSize: 9, letterSpacing: '0.08em', opacity: 0.6, marginTop: 2 }}>{s.oklch}</div>
              <div style={{ fontSize: 10, letterSpacing: '0.18em', textTransform: 'uppercase', marginTop: 10, opacity: 0.8 }}>{s.use}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

const TYPE_SCALE = [14, 18, 24, 32, 48, 64, 88];

export function ABType() {
  return (
    <div style={{ width: '100%', height: '100%', background: SF.bone, padding: 36, fontFamily: SF.sans, position: 'relative' }}>
      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 28 }}>
        <div style={{ fontFamily: SF.serif, fontSize: 36, letterSpacing: '-0.03em' }}>Type</div>
        <div style={{ fontFamily: SF.mono, fontSize: 11, letterSpacing: '0.2em', color: SF.ash }}>SYS / 03</div>
      </div>

      {/* Display row */}
      <div style={{ borderTop: `1px solid ${SF.ink}`, paddingTop: 14, marginBottom: 22 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: SF.mono, fontSize: 10, letterSpacing: '0.2em', color: SF.ash, marginBottom: 8 }}>
          <span>DISPLAY · INSTRUMENT SERIF</span>
          <span>HEROES · POSTERS · HEADERS</span>
        </div>
        <div style={{ fontFamily: SF.serif, fontSize: 88, letterSpacing: '-0.045em', lineHeight: 0.9 }}>
          <span style={{ fontStyle: 'italic' }}>Rare</span> air, only{' '}
          <span style={{ color: SF.blaze }}>here.</span>
        </div>
      </div>

      {/* Sans + Mono row */}
      <div style={{ borderTop: `1px solid ${SF.ink}`, paddingTop: 14, marginBottom: 22, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32 }}>
        <div>
          <div style={{ fontFamily: SF.mono, fontSize: 10, letterSpacing: '0.2em', color: SF.ash, marginBottom: 8 }}>SANS · ARCHIVO</div>
          <div style={{ fontWeight: 800, fontSize: 22, letterSpacing: '-0.01em', textTransform: 'uppercase' }}>Drop · Lineup · Trade</div>
          <div style={{ fontSize: 13, lineHeight: 1.4, marginTop: 6, maxWidth: 340 }}>
            Three days of releases, runs, and rare pairs. Body copy, captions, and UI live in Archivo across 400, 600, and 800.
          </div>
        </div>
        <div>
          <div style={{ fontFamily: SF.mono, fontSize: 10, letterSpacing: '0.2em', color: SF.ash, marginBottom: 8 }}>MONO · JETBRAINS</div>
          <div style={{ fontFamily: SF.mono, fontSize: 13, lineHeight: 1.6 }}>
            SERIAL · SF26-018-AX9<br />
            PRICE · $48.00 USD<br />
            GATE · NAVY YARD · BLDG 77
          </div>
        </div>
      </div>

      {/* Scale row */}
      <div style={{ borderTop: `1px solid ${SF.ink}`, paddingTop: 14 }}>
        <div style={{ fontFamily: SF.mono, fontSize: 10, letterSpacing: '0.2em', color: SF.ash, marginBottom: 10 }}>SCALE</div>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 18, fontFamily: SF.serif, color: SF.ink }}>
          {TYPE_SCALE.map((s) => <span key={s} style={{ fontSize: s }}>{s}</span>)}
        </div>
      </div>
    </div>
  );
}

const PATTERN_CARDS = [
  { name: 'Lace · diagonal',       style: (sf) => ({ backgroundImage: sfStripes(sf.ink, sf.bone, 18, 45) }) },
  { name: 'Tread · vertical',      style: (sf) => ({ backgroundImage: sfStripes(sf.ink, sf.bone, 10, 90) }) },
  { name: 'Finish · checker',      style: (sf) => ({ background: sfChecker(sf.ink, sf.bone, 22) }) },
  { name: 'Spec · grid',           style: (sf) => ({ background: sf.bone, ...sfGrid('rgba(10,10,10,0.18)', 22) }) },
  { name: 'Caution · blaze stripe',style: (sf) => ({ backgroundImage: sfStripes(sf.blaze, sf.ink, 16, 45) }) },
  { name: 'Volt halftone',         style: (sf) => ({ background: sf.volt, backgroundImage: `radial-gradient(${sf.ink} 1.5px, transparent 1.8px)`, backgroundSize: '12px 12px' }) },
];

export function ABPatterns() {
  return (
    <div style={{ width: '100%', height: '100%', background: SF.bone, padding: 32, fontFamily: SF.sans, position: 'relative' }}>
      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 22 }}>
        <div style={{ fontFamily: SF.serif, fontSize: 36, letterSpacing: '-0.03em' }}>Pattern library</div>
        <div style={{ fontFamily: SF.mono, fontSize: 11, letterSpacing: '0.2em', color: SF.ash }}>SYS / 04</div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14 }}>
        {PATTERN_CARDS.map((c) => (
          <div key={c.name}>
            <div style={{ height: 150, ...c.style(SF), border: `1px solid ${SF.ink}` }} />
            <div style={{ fontFamily: SF.mono, fontSize: 10, letterSpacing: '0.15em', marginTop: 6, color: SF.ink, textTransform: 'uppercase' }}>
              {c.name}
            </div>
          </div>
        ))}
      </div>
      <div style={{ display: 'flex', gap: 12, marginTop: 18, alignItems: 'center' }}>
        <div style={{ flex: 1 }}><SFBarcode color={SF.ink} height={36} seed="SF26-PATTERN" /></div>
        <div style={{ fontFamily: SF.mono, fontSize: 11, letterSpacing: '0.18em', color: SF.ink }}>SF26 · 0184 · AX</div>
      </div>
    </div>
  );
}

// ─── Default export — full brand reference sheet ──────────────────────────────

export default function BrandSystem() {
  const section = (label, sysId, height, Component) => (
    <div style={{ marginBottom: 64 }}>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 16, marginBottom: 16 }}>
        <div style={{ fontFamily: SF.serif, fontSize: 22, letterSpacing: '-0.02em', color: SF.ink }}>{label}</div>
        <div style={{ fontFamily: SF.mono, fontSize: 10, letterSpacing: '0.22em', color: SF.ash }}>{sysId}</div>
      </div>
      <div style={{ height, border: `1px solid rgba(10,10,10,0.1)`, overflow: 'hidden' }}>
        <Component />
      </div>
    </div>
  );

  return (
    <div style={{ background: SF.paper, minHeight: '100vh', padding: '48px 40px', fontFamily: SF.sans }}>
      {/* masthead */}
      <div style={{ marginBottom: 56, borderBottom: `1px solid ${SF.ink}`, paddingBottom: 24 }}>
        <LogoHorizontal scale={0.7} />
        <div style={{ fontFamily: SF.mono, fontSize: 10, letterSpacing: '0.25em', color: SF.ash, marginTop: 14 }}>
          BRAND REFERENCE · VOL 02 · BROOKLYN NAVY YARD · SEPT 18–20 2026
        </div>
      </div>
      {section('Logo lockups', 'SYS / 01', 280, ABLogo)}
      {section('Color', 'SYS / 02', 360, ABColor)}
      {section('Type', 'SYS / 03', 420, ABType)}
      {section('Pattern library', 'SYS / 04', 360, ABPatterns)}
    </div>
  );
}
