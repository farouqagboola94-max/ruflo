// Sneakers Fest 2026 — Applied templates (social, ticket, badge, email, web)
import React from 'react';
import { SF, sfChecker, sfStripes, SFBarcode } from './brand-system.jsx';

// ─── INSTAGRAM POST · 1080x1080 (canvas 540x540) ────────────────────────────
export const TplIGPost = () => (
  <div style={{
    width: '100%', height: '100%', background: SF.bone, color: SF.ink,
    fontFamily: SF.sans, position: 'relative', overflow: 'hidden',
  }}>
    <div style={{ position: 'absolute', inset: 0, background: sfChecker(SF.ink, SF.bone, 14), opacity: 0.16 }} />
    <div style={{ position: 'absolute', top: 0, left: 0, right: 0, background: SF.ink, color: SF.bone, padding: '12px 18px', display: 'flex', justifyContent: 'space-between', fontFamily: SF.mono, fontSize: 10, letterSpacing: '0.25em' }}>
      <span>● LIVE</span><span>SF · 26</span><span>POST · 01</span>
    </div>
    <div style={{ position: 'absolute', top: '34%', left: 20, right: 20, transform: 'translateY(-50%)', textAlign: 'center' }}>
      <div style={{ fontFamily: SF.mono, fontSize: 11, letterSpacing: '0.3em', marginBottom: 12 }}>— NOW BOARDING</div>
      <div style={{ fontFamily: SF.serif, fontSize: 88, lineHeight: 0.85, letterSpacing: '-0.045em' }}>
        Lineup<br/><span style={{ fontStyle: 'italic', color: SF.blaze }}>dropped.</span>
      </div>
    </div>
    <div style={{ position: 'absolute', left: 20, right: 20, bottom: 20 }}>
      <div style={{ background: SF.blaze, color: SF.bone, padding: '10px 14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontFamily: SF.mono, fontSize: 12, letterSpacing: '0.18em', fontWeight: 700 }}>
        <span>SEPT 18—20 · BKLYN</span>
        <span>→ TICKETS</span>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 10, fontFamily: SF.mono, fontSize: 10, letterSpacing: '0.18em' }}>
        <span>@SNEAKERSFEST</span><span>#SF26</span><span>BLDG 77</span>
      </div>
    </div>
  </div>
);

// ─── INSTAGRAM STORY · 1080x1920 (canvas 360x640) ───────────────────────────
export const TplIGStory = () => (
  <div style={{
    width: '100%', height: '100%', background: SF.ink, color: SF.bone,
    fontFamily: SF.sans, position: 'relative', overflow: 'hidden',
  }}>
    <div style={{ position: 'absolute', top: -40, left: -40, right: -40, height: 220, background: SF.volt, transform: 'rotate(-6deg)' }} />
    <div style={{ position: 'absolute', top: 24, left: 20, fontFamily: SF.mono, fontSize: 10, letterSpacing: '0.25em', color: SF.ink, fontWeight: 700 }}>
      SF · 26 / STORY
    </div>
    <div style={{ position: 'absolute', top: 70, left: 20, right: 20, color: SF.ink }}>
      <div style={{ fontFamily: SF.serif, fontSize: 72, lineHeight: 0.85, letterSpacing: '-0.045em' }}>
        Tonight.<br/><span style={{ fontStyle: 'italic' }}>Rare</span><br/>only.
      </div>
    </div>

    <div style={{ position: 'absolute', top: 280, left: 20, right: 20, height: 240, border: `1px solid rgba(245,241,232,0.3)`, backgroundImage: sfStripes('rgba(245,241,232,0.06)', 'transparent', 6, 45), display: 'grid', placeItems: 'center' }}>
      <div style={{ fontFamily: SF.mono, fontSize: 10, color: 'rgba(245,241,232,0.6)', letterSpacing: '0.2em' }}>[ PRODUCT SHOT ]</div>
    </div>

    <div style={{ position: 'absolute', bottom: 90, left: 20, right: 20 }}>
      <div style={{ fontFamily: SF.serif, fontSize: 24, fontStyle: 'italic', lineHeight: 1.2 }}>
        Bldg 77 · Gate C<br/><span style={{ color: SF.volt }}>22:00 → late</span>
      </div>
    </div>

    <div style={{ position: 'absolute', left: 20, right: 20, bottom: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontFamily: SF.mono, fontSize: 10, letterSpacing: '0.2em' }}>
      <span>↑ SWIPE UP</span>
      <div style={{ background: SF.blaze, color: SF.bone, padding: '6px 10px', fontWeight: 700 }}>RSVP</div>
    </div>
  </div>
);

// ─── EMAIL HEADER · 1200x400 (canvas 1000x300) ──────────────────────────────
export const TplEmail = () => (
  <div style={{
    width: '100%', height: '100%', background: SF.bone, color: SF.ink,
    fontFamily: SF.sans, position: 'relative', overflow: 'hidden',
    border: `1px solid rgba(10,10,10,0.1)`,
  }}>
    <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 38, background: '#fff', borderBottom: `1px solid rgba(10,10,10,0.1)`, display: 'flex', alignItems: 'center', padding: '0 14px', gap: 6 }}>
      <div style={{ width: 10, height: 10, borderRadius: 5, background: '#ff5f56' }} />
      <div style={{ width: 10, height: 10, borderRadius: 5, background: '#ffbd2e' }} />
      <div style={{ width: 10, height: 10, borderRadius: 5, background: '#27c93f' }} />
      <div style={{ marginLeft: 14, fontFamily: SF.mono, fontSize: 11, color: SF.ash, letterSpacing: '0.1em' }}>FROM: drops@sneakersfest.co</div>
      <div style={{ marginLeft: 'auto', fontFamily: SF.mono, fontSize: 11, color: SF.ash, letterSpacing: '0.1em' }}>SUBJ: Three days. Lace up.</div>
    </div>

    <div style={{ position: 'absolute', top: 38, left: 0, right: 0, bottom: 0, display: 'grid', gridTemplateColumns: '1.4fr 1fr' }}>
      <div style={{ padding: '24px 28px', position: 'relative' }}>
        <div style={{ fontFamily: SF.mono, fontSize: 10, letterSpacing: '0.25em' }}>NEWSLETTER · ISSUE 014</div>
        <div style={{ fontFamily: SF.serif, fontSize: 64, lineHeight: 0.88, letterSpacing: '-0.04em', marginTop: 12 }}>
          You're in. <span style={{ fontStyle: 'italic', color: SF.blaze }}>Now run.</span>
        </div>
        <div style={{ fontSize: 13, lineHeight: 1.5, marginTop: 14, maxWidth: 360 }}>
          Doors open Sept 18 at 11AM. Your raffle slot lands inside. Don't sleep — the rare ones drop first.
        </div>
        <div style={{ marginTop: 18, display: 'inline-block', background: SF.ink, color: SF.bone, padding: '10px 18px', fontFamily: SF.mono, fontSize: 11, letterSpacing: '0.25em', fontWeight: 700 }}>
          OPEN MY PASS →
        </div>
      </div>
      <div style={{ background: SF.ink, color: SF.bone, padding: '22px 24px', position: 'relative' }}>
        <div style={{ position: 'absolute', inset: 0, background: sfChecker(SF.ink, SF.smoke, 16), opacity: 0.6 }} />
        <div style={{ position: 'relative', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div style={{ fontFamily: SF.mono, fontSize: 10, letterSpacing: '0.25em', color: SF.volt }}>YOUR PASS</div>
          <div>
            <div style={{ fontFamily: SF.serif, fontSize: 36, letterSpacing: '-0.03em', lineHeight: 0.95 }}>3-Day · GA</div>
            <div style={{ fontFamily: SF.mono, fontSize: 11, marginTop: 6, letterSpacing: '0.18em' }}>SF26 · 0184 · AX</div>
          </div>
          <SFBarcode color={SF.bone} height={26} seed="SF26-EM" />
        </div>
      </div>
    </div>
  </div>
);

// ─── TICKET · 800x320 ────────────────────────────────────────────────────────
export const TplTicket = () => (
  <div style={{ width: '100%', height: '100%', background: SF.bone, padding: 16, fontFamily: SF.sans }}>
    <div style={{ width: '100%', height: '100%', background: SF.ink, color: SF.bone, position: 'relative', display: 'grid', gridTemplateColumns: '1fr auto 200px' }}>
      <div style={{ padding: '20px 24px', position: 'relative' }}>
        <div style={{ position: 'absolute', inset: 0, background: sfChecker(SF.ink, SF.smoke, 18), opacity: 0.5 }} />
        <div style={{ position: 'relative' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: SF.mono, fontSize: 10, letterSpacing: '0.25em', color: SF.volt }}>
            <span>SNEAKERS FEST · 26</span>
            <span>ADMIT ONE</span>
          </div>
          <div style={{ fontFamily: SF.serif, fontSize: 56, letterSpacing: '-0.04em', marginTop: 14, lineHeight: 0.9 }}>
            3-Day <span style={{ fontStyle: 'italic', color: SF.blaze }}>Pass</span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 14, marginTop: 22, fontFamily: SF.mono, fontSize: 10, letterSpacing: '0.18em' }}>
            <div>
              <div style={{ color: SF.ash }}>DATE</div>
              <div style={{ marginTop: 2 }}>SEPT 18–20</div>
            </div>
            <div>
              <div style={{ color: SF.ash }}>VENUE</div>
              <div style={{ marginTop: 2 }}>BKLYN NAVY · 77</div>
            </div>
            <div>
              <div style={{ color: SF.ash }}>GATE</div>
              <div style={{ marginTop: 2 }}>C · OPEN 11A</div>
            </div>
          </div>
        </div>
      </div>

      <div style={{ position: 'relative', width: 22, display: 'flex', flexDirection: 'column', justifyContent: 'space-evenly', alignItems: 'center', background: SF.ink }}>
        {Array.from({ length: 14 }).map((_, i) => (
          <div key={i} style={{ width: 6, height: 6, borderRadius: 4, background: SF.bone }} />
        ))}
      </div>

      <div style={{ background: SF.blaze, color: SF.bone, padding: '18px 18px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
        <div style={{ fontFamily: SF.mono, fontSize: 10, letterSpacing: '0.25em' }}>STUB · KEEP</div>
        <div>
          <div style={{ fontFamily: SF.serif, fontSize: 30, letterSpacing: '-0.03em' }}>GA</div>
          <div style={{ fontFamily: SF.mono, fontSize: 11, marginTop: 4, letterSpacing: '0.18em' }}>SF26 · 0184 · AX</div>
        </div>
        <SFBarcode color={SF.bone} height={28} seed="SF26-TK" />
      </div>
    </div>
  </div>
);

// ─── LANYARD BADGE · 320x480 (festival pass) ────────────────────────────────
export const TplBadge = () => (
  <div style={{ width: '100%', height: '100%', background: SF.paper, position: 'relative', padding: 16, fontFamily: SF.sans }}>
    <div style={{ position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)', width: 60, height: 14, background: SF.ink, borderRadius: '0 0 6px 6px' }} />
    <div style={{ position: 'absolute', top: 4, left: '50%', transform: 'translateX(-50%)', width: 16, height: 4, background: SF.bone, borderRadius: 2 }} />

    <div style={{ marginTop: 14, width: '100%', height: 'calc(100% - 18px)', background: SF.bone, color: SF.ink, position: 'relative', overflow: 'hidden', border: `1px solid ${SF.ink}` }}>
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, background: SF.ink, color: SF.bone, padding: '10px 14px', display: 'flex', justifyContent: 'space-between', fontFamily: SF.mono, fontSize: 9, letterSpacing: '0.25em' }}>
        <span>SF · 26</span><span>SEPT 18—20</span>
      </div>

      <div style={{ position: 'absolute', top: 44, left: 14, right: 14 }}>
        <div style={{ fontFamily: SF.mono, fontSize: 9, letterSpacing: '0.25em', color: SF.ash }}>BADGE HOLDER</div>
        <div style={{ fontFamily: SF.serif, fontSize: 32, letterSpacing: '-0.03em', lineHeight: 1, marginTop: 4 }}>
          Marcus<br/><span style={{ fontStyle: 'italic' }}>Okafor</span>
        </div>
        <div style={{ fontFamily: SF.mono, fontSize: 10, letterSpacing: '0.18em', marginTop: 8, color: SF.blaze, fontWeight: 700 }}>VIP · ALL ACCESS</div>
      </div>

      <div style={{ position: 'absolute', top: 170, left: 14, right: 14, height: 130, border: `1px solid ${SF.ink}`, backgroundImage: sfStripes('rgba(10,10,10,0.08)', 'transparent', 6, 45), display: 'grid', placeItems: 'center' }}>
        <div style={{ fontFamily: SF.mono, fontSize: 9, color: SF.ash, letterSpacing: '0.2em' }}>[ PHOTO ]</div>
      </div>

      <div style={{ position: 'absolute', left: 14, right: 14, bottom: 50, fontFamily: SF.mono, fontSize: 9, letterSpacing: '0.18em' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: SF.ash }}>ROLE</span><span>BUYER</span></div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 3 }}><span style={{ color: SF.ash }}>ID</span><span>SF26-0184-AX</span></div>
      </div>

      <div style={{ position: 'absolute', left: 14, right: 14, bottom: 14 }}>
        <SFBarcode color={SF.ink} height={24} seed="SF26-BADGE" />
      </div>
    </div>
  </div>
);

// ─── WEB HERO · 1200x680 ────────────────────────────────────────────────────
export const TplWebHero = () => (
  <div style={{ width: '100%', height: '100%', background: SF.bone, fontFamily: SF.sans, position: 'relative', overflow: 'hidden' }}>
    <div style={{ position: 'absolute', top: 0, left: 0, right: 0, padding: '18px 32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: `1px solid rgba(10,10,10,0.1)`, background: SF.bone, zIndex: 2 }}>
      <div style={{ fontFamily: SF.serif, fontSize: 22, letterSpacing: '-0.02em' }}>
        Sneakers Fest <span style={{ fontFamily: SF.mono, fontSize: 12, color: SF.blaze }}>'26</span>
      </div>
      <div style={{ display: 'flex', gap: 28, fontFamily: SF.mono, fontSize: 11, letterSpacing: '0.2em' }}>
        <span>LINEUP</span><span>DROPS</span><span>MAP</span><span>FAQ</span>
      </div>
      <div style={{ background: SF.ink, color: SF.bone, padding: '8px 16px', fontFamily: SF.mono, fontSize: 11, letterSpacing: '0.2em', fontWeight: 700 }}>
        GET PASS →
      </div>
    </div>

    <div style={{ position: 'absolute', top: 60, left: 32, right: 32, display: 'flex', justifyContent: 'space-between', fontFamily: SF.mono, fontSize: 10, letterSpacing: '0.25em', color: SF.ash, paddingTop: 16 }}>
      <span>VOL · 02 / 2026</span>
      <span>3 DAYS · 140 DROPS · 1 RUNWAY</span>
      <span>BROOKLYN NAVY YARD</span>
    </div>

    <div style={{ position: 'absolute', top: 130, left: 32, right: 32 }}>
      <div style={{ fontFamily: SF.serif, fontSize: 188, lineHeight: 0.82, letterSpacing: '-0.05em', color: SF.ink }}>
        <div>Sneakers</div>
        <div style={{ fontStyle: 'italic' }}>Fest<span style={{ color: SF.blaze }}>.</span></div>
      </div>
    </div>

    <div style={{ position: 'absolute', top: 130, right: 32, width: 280, height: 320, background: SF.ink, color: SF.bone, padding: 16, overflow: 'hidden' }}>
      <div style={{ position: 'absolute', inset: 0, background: sfChecker(SF.ink, SF.smoke, 16) }} />
      <div style={{ position: 'relative', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
        <div style={{ fontFamily: SF.mono, fontSize: 10, letterSpacing: '0.25em', color: SF.volt }}>LIVE COUNTDOWN</div>
        <div>
          <div style={{ fontFamily: SF.serif, fontSize: 70, lineHeight: 0.9, letterSpacing: '-0.03em' }}>
            <span style={{ color: SF.volt }}>121</span><span style={{ fontSize: 22, color: SF.ash }}>d</span>
          </div>
          <div style={{ fontFamily: SF.mono, fontSize: 11, letterSpacing: '0.2em', marginTop: 6 }}>UNTIL GATES OPEN</div>
        </div>
        <div style={{ background: SF.blaze, padding: '10px 12px', fontFamily: SF.mono, fontSize: 11, letterSpacing: '0.2em', fontWeight: 700, textAlign: 'center' }}>
          RESERVE PASS →
        </div>
      </div>
    </div>

    <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, background: SF.ink, color: SF.bone, padding: '14px 32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontFamily: SF.mono, fontSize: 11, letterSpacing: '0.25em' }}>
      <span style={{ color: SF.volt }}>● TICKETS LIVE</span>
      <span>FOOTWORK CLUB · PACER · SUNDAY RUN · LOOPS STUDIO · CONCRETE PRGM · TRACK ARCHIVE</span>
      <span>SF26 · 09.18—09.20</span>
    </div>
  </div>
);
