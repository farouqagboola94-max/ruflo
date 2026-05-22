import { B } from '../tokens'

const ITEMS = [
  "SNEAKERS FEST '26",
  'DECEMBER 12 · 2026',
  'EKO ATLANTIC CITY',
  'LAGOS · NIGERIA',
  '200+ RARE PAIRS',
  '50+ VENDORS',
  'DJ SPINALL',
  'SARZ',
  'ODUNSI',
  '3,000+ ATTENDEES',
  'LIVE DROPS',
  'CUSTOM ART',
  'STREET FOOD',
  'GET TICKETS NOW',
]

export default function EventTicker() {
  return (
    <div
      style={{
        background: B.amber,
        overflow: 'hidden',
        whiteSpace: 'nowrap',
        padding: '11px 0',
        position: 'relative',
        zIndex: 5,
      }}
    >
      <style>{`
        @keyframes ticker {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
      <div
        style={{
          display: 'inline-block',
          animation: 'ticker 38s linear infinite',
          willChange: 'transform',
        }}
      >
        {[0, 1].map(n => (
          <span key={n}>
            {ITEMS.map((item, i) => (
              <span key={i} style={{ display: 'inline-block' }}>
                <span
                  style={{
                    fontFamily: 'Bebas Neue, sans-serif',
                    fontSize: 15,
                    color: '#0A0A0A',
                    letterSpacing: 3,
                    padding: '0 20px',
                  }}
                >
                  {item}
                </span>
                <span
                  style={{
                    fontFamily: 'Bebas Neue, sans-serif',
                    fontSize: 12,
                    color: '#0A0A0A60',
                  }}
                >
                  ◆
                </span>
              </span>
            ))}
          </span>
        ))}
      </div>
    </div>
  )
}
