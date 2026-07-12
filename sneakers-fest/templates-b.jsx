// Sneakers Fest 2026 — Applied templates pt.2 (schedule, signage, tee, sponsor, map)
import React from 'react';
import { SF, sfChecker, sfStripes, sfGrid, SFBarcode } from './brand-system.jsx';

// ─── SCHEDULE / LINEUP POSTER · 540x810 ─────────────────────────────────────
export const TplSchedule = () => {
  const days = [
    {
      day: 'FRI 09.18', title: 'Open Gate', items: [
        ['11:00', 'Doors · Gate C', ''],
        ['13:00', 'Footwork Club — Drop 01', 'BLZ'],
        ['15:30', 'Panel · "The Resell Question"', ''],
        ['18:00', 'Pacer Athletics · Runway', ''],
        ['21:00', 'Opening DJ · Sunday Run', 'NEW'],
      ]
    },
    {
      day: 'SAT 09.19', title: 'Trade Floor', items: [
        ['10:00', 'Trade floor opens', ''],
        ['12:00', 'Loops Studio · live cobble', ''],
        ['14:00', 'Archive Sale · Track & Field', 'RARE'],
        ['17:00', 'Concrete Program · keynote', ''],
        ['22:00', 'Nightshift · midnight drops', 'BLZ'],
      ]
    },
    {
      day: 'SUN 09.20', title: 'Last Lap', items: [
        ['09:00', 'Morning run · 5K loop', ''],
        ['12:00', '03 · final drop', 'BLZ'],
        ['14:00', 'Auction · 1-of-1 pairs', 'RARE'],
        ['16:00', 'Closing showcase', ''],
        ['18:00', 'Gates close', ''],
      ]
    },
  ];
  return (
    <div style={{ width: '100%', height: '100%', background: SF.bone, color: SF.ink, fontFamily: SF.sans, padding: '24px 24px', position: 'relative', overflow: 'hidden' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: SF.mono, fontSize: 10, letterSpacing: '0.25em' }}>
        <span>PROGRAM / 06</span><span>3 DAYS · 18 SESSIONS · 140 DROPS</span>
      </div>
      <div style={{ fontFamily: SF.serif, fontSize: 64, lineHeight: 0.88, letterSpacing: '-0.04em', marginTop: 10 }}>
        Schedule <span style={{ fontStyle: 'italic', color: SF.blaze }}>'26</span>
      </div>

      <div style={{ marginTop: 18 }}>
        {days.map((d, i) => (
          <div key={d.day} style={{ marginTop: i === 0 ? 0 : 14 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', borderTop: `1px solid ${SF.ink}`, paddingTop: 6 }}>
              <span style={{ fontFamily: SF.mono, fontSize: 11, letterSpacing: '0.25em', fontWeight: 700 }}>{d.day}</span>
              <span style={{ fontFamily: SF.serif, fontSize: 22, fontStyle: 'italic', letterSpacing: '-0.02em' }}>{d.title}</span>
            </div>
            {d.items.map(([t, label, tag], j) => (
              <div key={j} style={{ display: 'grid', gridTemplateColumns: '54px 1fr 50px', padding: '6px 0', fontSize: 12, borderBottom: `1px solid rgba(10,10,10,0.08)`, alignItems: 'center' }}>
                <span style={{ fontFamily: SF.mono, fontSize: 11, letterSpacing: '0.1em' }}>{t}</span>
                <span style={{ fontWeight: 500 }}>{label}</span>
                <span style={{
                  fontFamily: SF.mono, fontSize: 9, letterSpacing: '0.18em', textAlign: 'right',
                  color: tag === 'BLZ' ? SF.blaze : tag === 'RARE' ? SF.ink : SF.ash,
                  background: tag === 'RARE' ? SF.volt : 'transparent',
                  padding: tag === 'RARE' ? '2px 6px' : '0',
                  justifySelf: 'end',
                }}>{tag}</span>
              </div>
            ))}
          </div>
        ))}
      </div>

      <div style={{ position: 'absolute', left: 24, right: 24, bottom: 18, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <div style={{ fontFamily: SF.mono, fontSize: 9, letterSpacing: '0.2em' }}>BLDG 77 · BKLYN NAVY YARD</div>
        <SFBarcode color={SF.ink} height={22} seed="SF26-SCH" />
      </div>
    </div>
  );
};

// ─── BOOTH / SIGNAGE · 900x600 ──────────────────────────────────────────────
export const TplSignage = () => (
  <div style={{ width: '100%', height: '100%', background: SF.bone, position: 'relative', overflow: 'hidden', fontFamily: SF.sans }}>
    <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 38, background: sfStripes(SF.blaze, SF.ink, 22, 90), display: 'flex', alignItems: 'center', padding: '0 16px', color: SF.bone, fontFamily: SF.mono, fontSize: 12, letterSpacing: '0.25em', fontWeight: 700 }}>
      <span>→ THIS WAY</span>
      <span style={{ marginLeft: 'auto' }}>SF · 26</span>
    </div>

    <div style={{ position: 'absolute', top: 60, left: 32, right: 32 }}>
      <div style={{ fontFamily: SF.mono, fontSize: 12, letterSpacing: '0.25em' }}>BOOTH · 014</div>
      <div style={{ fontFamily: SF.serif, fontSize: 140, lineHeight: 0.85, letterSpacing: '-0.05em', marginTop: 6 }}>
        Trade <span style={{ fontStyle: 'italic', color: SF.blaze }}>Floor</span>
      </div>
      <div style={{ fontFamily: SF.serif, fontSize: 30, fontStyle: 'italic', marginTop: 8, color: SF.ash }}>
        Resoles · raffles · rare pairs.
      </div>
    </div>

    <div style={{ position: 'absolute', bottom: 28, left: 32, display: 'flex', alignItems: 'center', gap: 18 }}>
      <svg width="140" height="80" viewBox="0 0 140 80">
        <path d="M0 40 L100 40 M70 10 L100 40 L70 70" stroke={SF.ink} strokeWidth="8" fill="none" />
      </svg>
      <div>
        <div style={{ fontFamily: SF.mono, fontSize: 14, letterSpacing: '0.25em', fontWeight: 700 }}>30 STEPS</div>
        <div style={{ fontFamily: SF.mono, fontSize: 10, letterSpacing: '0.2em', color: SF.ash, marginTop: 4 }}>GATE C · BLDG 77</div>
      </div>
    </div>

    <div style={{ position: 'absolute', right: 32, bottom: 28, textAlign: 'right' }}>
      <SFBarcode color={SF.ink} height={28} seed="SF26-WAY" />
      <div style={{ fontFamily: SF.mono, fontSize: 10, marginTop: 6, letterSpacing: '0.2em' }}>SF26 · WAY · 014</div>
    </div>
  </div>
);

// ─── T-SHIRT MERCH · 600x680 ────────────────────────────────────────────────
export const TplTee = () => (
  <div style={{ width: '100%', height: '100%', background: SF.paper, fontFamily: SF.sans, position: 'relative', display: 'grid', placeItems: 'center' }}>
    <svg viewBox="0 0 480 540" width="86%" height="86%" style={{ filter: 'drop-shadow(0 8px 24px rgba(0,0,0,0.18))' }}>
      <defs>
        <clipPath id="tee-clip">
          <path d="M120 60 L180 30 Q240 70 300 30 L360 60 L450 110 L410 200 L370 180 L370 510 L110 510 L110 180 L70 200 L30 110 Z" />
        </clipPath>
      </defs>
      <path d="M120 60 L180 30 Q240 70 300 30 L360 60 L450 110 L410 200 L370 180 L370 510 L110 510 L110 180 L70 200 L30 110 Z" fill={SF.ink} />
      <path d="M180 30 Q240 70 300 30 Q280 56 240 60 Q200 56 180 30 Z" fill={SF.smoke} />

      <g clipPath="url(#tee-clip)" fontFamily={SF.serif} fill={SF.bone}>
        <text x="240" y="240" textAnchor="middle" fontSize="72" letterSpacing="-3">SNEAKERS</text>
        <text x="240" y="305" textAnchor="middle" fontSize="72" letterSpacing="-3" fontStyle="italic" fill={SF.blaze}>FEST</text>
        <text x="240" y="345" textAnchor="middle" fontFamily={SF.mono} fontSize="14" letterSpacing="6">— BROOKLYN · 2026 —</text>
        <g transform="translate(180 410)">
          {Array.from({ length: 28 }).map((_, i) => (
            <rect key={i} x={i * 4} y="0" width={i % 2 ? 2 : 1} height="20" fill={SF.bone} />
          ))}
        </g>
        <text x="240" y="450" textAnchor="middle" fontFamily={SF.mono} fontSize="10" letterSpacing="3" fill={SF.bone}>VOL · 02 / SF26-018-AX</text>
      </g>
    </svg>

    <div style={{ position: 'absolute', top: 18, left: 18, fontFamily: SF.mono, fontSize: 10, letterSpacing: '0.25em', color: SF.ink }}>MERCH · 08 · TEE</div>
    <div style={{ position: 'absolute', top: 18, right: 18, fontFamily: SF.mono, fontSize: 10, letterSpacing: '0.25em', color: SF.ink }}>$48.00</div>
    <div style={{ position: 'absolute', bottom: 18, left: 18, right: 18, display: 'flex', justifyContent: 'space-between', fontFamily: SF.mono, fontSize: 10, letterSpacing: '0.2em', color: SF.ash }}>
      <span>HEAVY 14oz · BOXY FIT</span>
      <span>S · M · L · XL · XXL</span>
    </div>
  </div>
);

// ─── SPONSOR / DECK SLIDE · 1200x675 (16:9) ─────────────────────────────────
export const TplSponsorSlide = () => (
  <div style={{ width: '100%', height: '100%', background: SF.bone, color: SF.ink, fontFamily: SF.sans, position: 'relative', overflow: 'hidden' }}>
    <div style={{ position: 'absolute', top: 36, left: 36, right: '45%' }}>
      <div style={{ fontFamily: SF.mono, fontSize: 11, letterSpacing: '0.25em' }}>SPONSORSHIP · DECK / 09</div>
      <div style={{ fontFamily: SF.serif, fontSize: 88, lineHeight: 0.86, letterSpacing: '-0.045em', marginTop: 16 }}>
        Be on the<br/><span style={{ fontStyle: 'italic', color: SF.blaze }}>floor.</span>
      </div>
      <div style={{ fontSize: 14, lineHeight: 1.5, marginTop: 18, maxWidth: 420 }}>
        Three days of culture-defining drops. 40,000 attendees. The Gen-Z buyer in their natural habitat.
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 14, marginTop: 28, maxWidth: 460 }}>
        {[['40k', 'attendees'], ['140', 'drops'], ['62%', 'Gen Z']].map(([n, l]) => (
          <div key={l} style={{ borderTop: `2px solid ${SF.ink}`, paddingTop: 8 }}>
            <div style={{ fontFamily: SF.serif, fontSize: 44, letterSpacing: '-0.03em', lineHeight: 1 }}>{n}</div>
            <div style={{ fontFamily: SF.mono, fontSize: 10, letterSpacing: '0.2em', marginTop: 4, color: SF.ash }}>{l.toUpperCase()}</div>
          </div>
        ))}
      </div>
    </div>

    <div style={{ position: 'absolute', top: 0, right: 0, bottom: 0, width: '40%', background: SF.ink, color: SF.bone, padding: 36, overflow: 'hidden' }}>
      <div style={{ position: 'absolute', inset: 0, background: sfChecker(SF.ink, SF.smoke, 20) }} />
      <div style={{ position: 'relative', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
        <div>
          <div style={{ fontFamily: SF.mono, fontSize: 11, letterSpacing: '0.25em', color: SF.volt }}>TIER · PRESENTING</div>
          <div style={{ fontFamily: SF.serif, fontSize: 56, letterSpacing: '-0.03em', lineHeight: 0.95, marginTop: 14 }}>
            $250<span style={{ fontStyle: 'italic' }}>k</span>
          </div>
        </div>
        <ul style={{ fontFamily: SF.mono, fontSize: 12, letterSpacing: '0.1em', lineHeight: 1.9, listStyle: 'none', padding: 0, margin: 0 }}>
          <li>→ Title billing · all assets</li>
          <li>→ Runway co-brand</li>
          <li>→ 4 activations · 800 sq ft</li>
          <li>→ Custom drop SKU</li>
          <li>→ All-access · 20 passes</li>
        </ul>
        <div style={{ background: SF.blaze, color: SF.bone, padding: '10px 14px', fontFamily: SF.mono, fontSize: 11, letterSpacing: '0.25em', fontWeight: 700, textAlign: 'center' }}>
          BOOK A CALL →
        </div>
      </div>
    </div>

    <div style={{ position: 'absolute', left: 36, bottom: 24, display: 'flex', alignItems: 'center', gap: 18, fontFamily: SF.mono, fontSize: 10, letterSpacing: '0.2em', color: SF.ash }}>
      <span>SNEAKERS FEST · 2026</span>
      <span>·</span>
      <span>sponsorship@sneakersfest.co</span>
    </div>
  </div>
);

// ─── MAP / WAYFINDING · 900x680 ─────────────────────────────────────────────
export const TplMap = () => {
  const pins = [
    { x: 22, y: 28, n: '01', l: 'Gate C · Entry' },
    { x: 46, y: 30, n: '02', l: 'Trade Floor' },
    { x: 70, y: 36, n: '03', l: 'Runway' },
    { x: 32, y: 60, n: '04', l: 'Nightshift Stage' },
    { x: 58, y: 64, n: '05', l: 'Archive Tent' },
    { x: 80, y: 70, n: '06', l: 'Food + Bar' },
  ];
  return (
    <div style={{ width: '100%', height: '100%', background: SF.bone, fontFamily: SF.sans, position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', top: 22, left: 24, right: 24, display: 'flex', justifyContent: 'space-between' }}>
        <div>
          <div style={{ fontFamily: SF.mono, fontSize: 10, letterSpacing: '0.25em' }}>SHEET 11 · WAYFINDING</div>
          <div style={{ fontFamily: SF.serif, fontSize: 48, letterSpacing: '-0.03em', lineHeight: 1, marginTop: 4 }}>
            Site <span style={{ fontStyle: 'italic', color: SF.blaze }}>map</span>
          </div>
        </div>
        <div style={{ textAlign: 'right', fontFamily: SF.mono, fontSize: 10, letterSpacing: '0.18em', lineHeight: 1.6 }}>
          BKLYN NAVY YARD<br/>BLDG 77 · GATE C<br/>SEPT 18—20 · 2026
        </div>
      </div>

      <div style={{ position: 'absolute', top: 110, left: 24, right: 240, bottom: 24, border: `1px solid ${SF.ink}`, ...sfGrid('rgba(10,10,10,0.08)', 22), overflow: 'hidden' }}>
        <div style={{ position: 'absolute', left: '14%', top: '18%', width: '24%', height: '20%', background: SF.ink, opacity: 0.85 }} />
        <div style={{ position: 'absolute', left: '42%', top: '22%', width: '18%', height: '16%', background: SF.ink, opacity: 0.85 }} />
        <div style={{ position: 'absolute', left: '64%', top: '14%', width: '22%', height: '28%', background: SF.ink, opacity: 0.85 }} />
        <div style={{ position: 'absolute', left: '24%', top: '50%', width: '18%', height: '20%', background: SF.ink, opacity: 0.85 }} />
        <div style={{ position: 'absolute', left: '50%', top: '54%', width: '16%', height: '18%', background: SF.ink, opacity: 0.85 }} />
        <div style={{ position: 'absolute', left: '72%', top: '60%', width: '18%', height: '20%', background: SF.blaze, opacity: 0.9 }} />

        <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}>
          <path d="M 8% 90% Q 30% 70%, 50% 80% T 92% 60%" stroke={SF.blaze} strokeWidth="3" fill="none" strokeDasharray="6 4" />
        </svg>

        {pins.map((p) => (
          <div key={p.n} style={{ position: 'absolute', left: `${p.x}%`, top: `${p.y}%`, transform: 'translate(-50%,-50%)' }}>
            <div style={{ width: 30, height: 30, borderRadius: '50%', background: SF.volt, color: SF.ink, display: 'grid', placeItems: 'center', fontFamily: SF.mono, fontSize: 11, fontWeight: 700, letterSpacing: '0.05em', border: `2px solid ${SF.ink}` }}>
              {p.n}
            </div>
          </div>
        ))}

        <div style={{ position: 'absolute', right: 14, top: 14, width: 56, height: 56, borderRadius: '50%', border: `1px solid ${SF.ink}`, display: 'grid', placeItems: 'center', background: SF.bone }}>
          <div style={{ position: 'absolute', top: 4, fontFamily: SF.mono, fontSize: 10, fontWeight: 700 }}>N</div>
          <div style={{ width: 2, height: 32, background: SF.blaze }} />
        </div>
      </div>

      <div style={{ position: 'absolute', right: 24, top: 110, bottom: 24, width: 200, borderLeft: `1px solid ${SF.ink}`, paddingLeft: 16, paddingTop: 4 }}>
        <div style={{ fontFamily: SF.mono, fontSize: 10, letterSpacing: '0.25em' }}>LEGEND</div>
        <div style={{ marginTop: 12 }}>
          {pins.map((p) => (
            <div key={p.n} style={{ display: 'flex', gap: 10, alignItems: 'center', padding: '6px 0', borderBottom: `1px solid rgba(10,10,10,0.08)` }}>
              <div style={{ width: 22, height: 22, borderRadius: '50%', background: SF.volt, color: SF.ink, display: 'grid', placeItems: 'center', fontFamily: SF.mono, fontSize: 9, fontWeight: 700, border: `1.5px solid ${SF.ink}`, flexShrink: 0 }}>{p.n}</div>
              <div style={{ fontFamily: SF.sans, fontSize: 12, fontWeight: 500 }}>{p.l}</div>
            </div>
          ))}
        </div>
        <div style={{ position: 'absolute', bottom: 4, left: 16, right: 0, fontFamily: SF.mono, fontSize: 9, letterSpacing: '0.18em', color: SF.ash }}>
          NOT TO SCALE · SF26-MAP-A
        </div>
      </div>
    </div>
  );
};
