// Sneakers Fest 2026 — 5 Key Art / Poster directions
// Each poster is 540×810 (2:3 A1 ratio for canvas display)
import React from 'react';
import { SF, sfStripes, sfChecker, sfGrid, SFCorner, SFBarcode } from './brand-system.jsx';

// ─── 01 · EDITORIAL ──────────────────────────────────────────────────────────
export const PosterEditorial = () => (
  <div style={{
    width: '100%', height: '100%', background: SF.bone, color: SF.ink,
    padding: '28px 26px', fontFamily: SF.sans, position: 'relative', overflow: 'hidden',
  }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
      <div style={{ fontFamily: SF.mono, fontSize: 10, letterSpacing: '0.25em' }}>
        VOL · 02 / 2026
      </div>
      <div style={{ fontFamily: SF.mono, fontSize: 10, letterSpacing: '0.25em', textAlign: 'right' }}>
        SEPT 18—20<br/>BROOKLYN NAVY YARD
      </div>
    </div>

    <div style={{ borderTop: `1px solid ${SF.ink}`, marginTop: 14, paddingTop: 14 }}>
      <div style={{ fontFamily: SF.serif, fontSize: 132, letterSpacing: '-0.05em', lineHeight: 0.84 }}>
        <div>Sneakers</div>
        <div style={{ fontStyle: 'italic' }}>Fest<span style={{ color: SF.blaze }}>.</span></div>
      </div>
    </div>

    <div style={{ marginTop: 18, fontFamily: SF.serif, fontSize: 26, fontStyle: 'italic', lineHeight: 1.15, maxWidth: 380, letterSpacing: '-0.02em' }}>
      "The block is the runway. The drop is the show."
    </div>

    <div style={{
      marginTop: 18, height: 220, border: `1px solid ${SF.ink}`,
      backgroundImage: sfStripes('rgba(10,10,10,0.08)', 'transparent', 8, 45),
      position: 'relative',
    }}>
      <div style={{ position: 'absolute', inset: 0, display: 'grid', placeItems: 'center' }}>
        <div style={{ fontFamily: SF.mono, fontSize: 11, color: SF.ash, letterSpacing: '0.2em' }}>
          [ HERO PRODUCT SHOT ]
        </div>
      </div>
      <SFCorner style={{ position: 'absolute', top: 6, left: 6 }} />
      <SFCorner style={{ position: 'absolute', top: 6, right: 6 }} />
      <SFCorner style={{ position: 'absolute', bottom: 6, left: 6 }} />
      <SFCorner style={{ position: 'absolute', bottom: 6, right: 6 }} />
    </div>

    <div style={{
      position: 'absolute', left: 26, right: 26, bottom: 24,
      display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end',
    }}>
      <div style={{ fontSize: 10, letterSpacing: '0.2em', fontWeight: 700, lineHeight: 1.6 }}>
        140+ DROPS<br/>50 ARTISTS<br/>1 RUNWAY
      </div>
      <div style={{ textAlign: 'right' }}>
        <SFBarcode color={SF.ink} height={26} seed="SF26-ED" />
        <div style={{ fontFamily: SF.mono, fontSize: 10, marginTop: 4, letterSpacing: '0.18em' }}>SF26 · 0001 / ED</div>
      </div>
    </div>
  </div>
);

// ─── 02 · CHECKER FLAG ───────────────────────────────────────────────────────
export const PosterChecker = () => (
  <div style={{
    width: '100%', height: '100%', background: SF.bone, position: 'relative', overflow: 'hidden',
    fontFamily: SF.sans, color: SF.ink,
  }}>
    <div style={{ height: '38%', background: sfChecker(SF.ink, SF.bone, 28), position: 'relative' }}>
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, transparent 60%, rgba(245,241,232,0.0) 100%)' }} />
      <div style={{ position: 'absolute', top: 24, left: 0, right: 0, display: 'flex', justifyContent: 'space-between', padding: '0 24px', color: SF.bone }}>
        <span style={{ fontFamily: SF.mono, fontSize: 11, letterSpacing: '0.25em', background: SF.ink, padding: '4px 8px' }}>FINISH LINE / 26</span>
        <span style={{ fontFamily: SF.mono, fontSize: 11, letterSpacing: '0.25em', background: SF.ink, padding: '4px 8px' }}>BKLYN · 09.18–20</span>
      </div>
    </div>

    <div style={{
      position: 'absolute', top: '34%', left: -40, right: -40, height: 92,
      background: SF.blaze, transform: 'rotate(-4deg)', display: 'flex', alignItems: 'center', justifyContent: 'center',
      color: SF.bone, fontFamily: SF.serif, fontSize: 64, letterSpacing: '-0.03em', fontStyle: 'italic', overflow: 'hidden',
    }}>
      Sneakers&nbsp;Fest&nbsp;·&nbsp;<span style={{ fontFamily: SF.mono, fontSize: 30, letterSpacing: '0.1em', fontStyle: 'normal' }}>2026</span>
    </div>

    <div style={{ padding: '110px 26px 26px', position: 'relative' }}>
      <div style={{ fontFamily: SF.serif, fontSize: 80, letterSpacing: '-0.045em', lineHeight: 0.88 }}>
        Race the <span style={{ fontStyle: 'italic' }}>drop.</span>
      </div>
      <div style={{ fontSize: 13, lineHeight: 1.45, marginTop: 14, maxWidth: 360, fontWeight: 500 }}>
        Three days. One hundred forty pairs. Every release is a sprint. Lace up.
      </div>

      <div style={{ display: 'flex', gap: 8, marginTop: 22, flexWrap: 'wrap' }}>
        {['LIMITED 02', 'TRADE FLR', 'NIGHT RUN', 'OPEN GATE'].map((t) => (
          <div key={t} style={{ fontFamily: SF.mono, fontSize: 11, letterSpacing: '0.2em', padding: '6px 10px', border: `1px solid ${SF.ink}`, background: SF.bone }}>
            {t}
          </div>
        ))}
      </div>
    </div>

    <div style={{ position: 'absolute', left: 26, right: 26, bottom: 22, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
      <div style={{ fontFamily: SF.mono, fontSize: 10, letterSpacing: '0.2em' }}>SF26 · 02 / CHECKER</div>
      <SFBarcode color={SF.ink} height={28} seed="SF26-CK" />
    </div>
  </div>
);

// ─── 03 · BLAZE BLOCK ────────────────────────────────────────────────────────
export const PosterBlaze = () => (
  <div style={{
    width: '100%', height: '100%', background: SF.blaze, position: 'relative', overflow: 'hidden',
    fontFamily: SF.sans, color: SF.bone,
  }}>
    <div style={{ position: 'absolute', inset: 0, backgroundImage: `radial-gradient(rgba(10,10,10,0.18) 1px, transparent 1.5px)`, backgroundSize: '10px 10px', opacity: 0.6 }} />

    <div style={{ position: 'absolute', top: 24, left: 24, right: 24, display: 'flex', justifyContent: 'space-between', fontFamily: SF.mono, fontSize: 10, letterSpacing: '0.25em' }}>
      <span>SF · 26</span>
      <span>VOL.02 / 03 OF 05</span>
    </div>

    <div style={{ position: 'absolute', top: 70, left: -30, fontFamily: SF.serif, fontSize: 480, lineHeight: 0.78, letterSpacing: '-0.08em', color: SF.ink, fontStyle: 'italic' }}>
      SF
    </div>
    <div style={{ position: 'absolute', top: 92, right: 24, fontFamily: SF.serif, fontSize: 56, lineHeight: 0.9, letterSpacing: '-0.04em', textAlign: 'right' }}>
      Sneakers<br/>
      <span style={{ fontStyle: 'italic' }}>Fest</span>
    </div>

    <div style={{
      position: 'absolute', bottom: 200, left: -20, right: -20, transform: 'rotate(-2deg)',
      background: SF.ink, color: SF.volt, padding: '14px 20px', display: 'flex', justifyContent: 'space-between',
      fontFamily: SF.mono, fontSize: 14, letterSpacing: '0.25em', fontWeight: 700,
    }}>
      <span>BROOKLYN</span><span>—</span><span>SEPT 18</span><span>—</span><span>SEPT 20</span><span>—</span><span>2026</span>
    </div>

    <div style={{ position: 'absolute', left: 24, right: 24, bottom: 26 }}>
      <div style={{ fontFamily: SF.serif, fontSize: 38, lineHeight: 1, letterSpacing: '-0.03em', fontStyle: 'italic', color: SF.ink }}>
        "Cop. Trade. <span style={{ color: SF.volt }}>Repeat.</span>"
      </div>
      <div style={{ marginTop: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <div style={{ fontFamily: SF.mono, fontSize: 10, letterSpacing: '0.2em', color: SF.ink }}>
          DOORS 11A · LAST CALL 11P<br/>BLDG 77 · NAVY YARD
        </div>
        <SFBarcode color={SF.ink} height={28} seed="SF26-BZ" />
      </div>
    </div>
  </div>
);

// ─── 04 · SPEC SHEET ─────────────────────────────────────────────────────────
export const PosterSpec = () => (
  <div style={{
    width: '100%', height: '100%', background: SF.bone, color: SF.ink,
    fontFamily: SF.sans, position: 'relative', overflow: 'hidden',
    ...sfGrid('rgba(10,10,10,0.1)', 24),
  }}>
    <SFCorner style={{ position: 'absolute', top: 12, left: 12 }} />
    <SFCorner style={{ position: 'absolute', top: 12, right: 12 }} />
    <SFCorner style={{ position: 'absolute', bottom: 12, left: 12 }} />
    <SFCorner style={{ position: 'absolute', bottom: 12, right: 12 }} />

    <div style={{ position: 'absolute', top: 30, left: 30, right: 30, display: 'flex', justifyContent: 'space-between', fontFamily: SF.mono, fontSize: 10, letterSpacing: '0.2em' }}>
      <span>SHEET 04 / 05</span>
      <span>SCALE 1:1</span>
      <span>SF26-SPEC-A1</span>
    </div>

    <div style={{ position: 'absolute', top: 60, left: 30, right: 30 }}>
      <div style={{ fontFamily: SF.serif, fontSize: 96, lineHeight: 0.85, letterSpacing: '-0.05em' }}>
        <div>Sneakers</div>
        <div style={{ fontStyle: 'italic' }}>Fest <span style={{ fontFamily: SF.mono, fontSize: 32, letterSpacing: '0.05em', fontStyle: 'normal', color: SF.blaze, verticalAlign: 'middle' }}>'26</span></div>
      </div>
    </div>

    <div style={{ position: 'absolute', top: 250, left: 30, right: 30, height: 320, border: `1px solid ${SF.ink}` }}>
      <div style={{ position: 'absolute', inset: 16, backgroundImage: sfStripes('rgba(10,10,10,0.08)', 'transparent', 6, 45), display: 'grid', placeItems: 'center' }}>
        <div style={{ fontFamily: SF.mono, fontSize: 11, color: SF.ash, letterSpacing: '0.2em' }}>
          [ TECHNICAL · SNEAKER · ELEVATION ]
        </div>
      </div>
      {[
        { l: 30, t: -18, w: 100, h: 1 },
        { l: 30, t: -18, w: 1, h: 18 },
        { l: 130, t: -18, w: 1, h: 18 },
        { l: -22, t: 30, w: 1, h: 80 },
        { l: -32, t: 30, w: 18, h: 1 },
        { l: -32, t: 110, w: 18, h: 1 },
      ].map((d, i) => (
        <div key={i} style={{ position: 'absolute', left: d.l, top: d.t, width: d.w, height: d.h, background: SF.ink }} />
      ))}
      <div style={{ position: 'absolute', top: -32, left: 60, fontFamily: SF.mono, fontSize: 10 }}>12"</div>
      <div style={{ position: 'absolute', top: 60, left: -44, fontFamily: SF.mono, fontSize: 10, transform: 'rotate(-90deg)' }}>8"</div>

      <div style={{ position: 'absolute', top: 60, right: -100, width: 120 }}>
        <div style={{ width: 90, height: 1, background: SF.ink }} />
        <div style={{ fontFamily: SF.mono, fontSize: 10, letterSpacing: '0.15em', marginTop: 2 }}>① UPPER · MESH</div>
      </div>
      <div style={{ position: 'absolute', top: 140, right: -100, width: 120 }}>
        <div style={{ width: 90, height: 1, background: SF.ink }} />
        <div style={{ fontFamily: SF.mono, fontSize: 10, letterSpacing: '0.15em', marginTop: 2 }}>② MIDSOLE · EVA</div>
      </div>
      <div style={{ position: 'absolute', top: 220, right: -100, width: 120 }}>
        <div style={{ width: 90, height: 1, background: SF.blaze }} />
        <div style={{ fontFamily: SF.mono, fontSize: 10, letterSpacing: '0.15em', marginTop: 2, color: SF.blaze }}>③ ACCENT · BLAZE</div>
      </div>
    </div>

    <div style={{ position: 'absolute', left: 30, right: 30, bottom: 30, border: `1px solid ${SF.ink}`, display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', fontFamily: SF.mono, fontSize: 10, letterSpacing: '0.15em' }}>
      <div style={{ padding: '10px 12px', borderRight: `1px solid ${SF.ink}` }}>
        <div style={{ color: SF.ash, marginBottom: 2 }}>DATE</div>
        <div>09.18–09.20</div>
      </div>
      <div style={{ padding: '10px 12px', borderRight: `1px solid ${SF.ink}` }}>
        <div style={{ color: SF.ash, marginBottom: 2 }}>VENUE</div>
        <div>BKLYN NAVY · 77</div>
      </div>
      <div style={{ padding: '10px 12px' }}>
        <div style={{ color: SF.ash, marginBottom: 2 }}>DRAWN BY</div>
        <div>SF · STUDIO</div>
      </div>
    </div>
  </div>
);

// ─── 05 · NIGHTSHIFT ─────────────────────────────────────────────────────────
export const PosterNightshift = () => (
  <div style={{
    width: '100%', height: '100%', background: SF.ink, color: SF.bone,
    fontFamily: SF.sans, position: 'relative', overflow: 'hidden',
  }}>
    <div style={{ position: 'absolute', inset: 0, ...sfGrid('rgba(245,241,232,0.06)', 28) }} />

    <div style={{
      position: 'absolute', top: 0, bottom: 0, left: '62%', width: 88,
      background: SF.volt, transform: 'skewX(-8deg)', transformOrigin: 'top',
    }} />
    <div style={{
      position: 'absolute', top: 0, bottom: 0, left: '74%', width: 14,
      background: SF.blaze, transform: 'skewX(-8deg)',
    }} />

    <div style={{ position: 'absolute', top: 24, left: 24, right: 24, display: 'flex', justifyContent: 'space-between', fontFamily: SF.mono, fontSize: 10, letterSpacing: '0.25em' }}>
      <span>NIGHTSHIFT 22:00 →</span>
      <span style={{ color: SF.ink, background: SF.volt, padding: '3px 8px' }}>LATE GATES</span>
    </div>

    <div style={{ position: 'absolute', top: 90, left: 24, right: 24 }}>
      <div style={{ fontFamily: SF.mono, fontSize: 11, letterSpacing: '0.25em', marginBottom: 18, color: SF.volt }}>
        — AFTER DARK PROGRAM
      </div>
      <div style={{ fontFamily: SF.serif, fontSize: 124, lineHeight: 0.82, letterSpacing: '-0.05em' }}>
        <div>Sneakers</div>
        <div style={{ fontStyle: 'italic', color: SF.volt }}>Fest.</div>
      </div>
    </div>

    <div style={{
      position: 'absolute', bottom: 200, left: 24, width: 120, height: 120, borderRadius: '50%',
      border: `2px solid ${SF.blaze}`, display: 'grid', placeItems: 'center',
      fontFamily: SF.serif, fontStyle: 'italic', fontSize: 56, color: SF.bone,
      boxShadow: `0 0 0 6px rgba(255,59,10,0.18)`,
    }}>
      05
    </div>

    <div style={{ position: 'absolute', bottom: 100, left: 160, right: 24, fontFamily: SF.serif, fontSize: 28, lineHeight: 1.15, fontStyle: 'italic' }}>
      Doors at sunset. Drops at midnight. <span style={{ color: SF.volt }}>Lace tight.</span>
    </div>

    <div style={{ position: 'absolute', left: 24, right: 24, bottom: 26, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
      <div style={{ fontFamily: SF.mono, fontSize: 10, letterSpacing: '0.2em', lineHeight: 1.6 }}>
        BKLYN NAVY YARD<br/>BLDG 77 · GATE C<br/>SEPT 19 · 22:00–04:00
      </div>
      <SFBarcode color={SF.volt} height={28} seed="SF26-NX" />
    </div>
  </div>
);
