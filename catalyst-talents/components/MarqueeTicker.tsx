const PHRASE =
  'BELIEVE  ·  STANDARD  ·  CATALYST  ·  LAGOS  ·  WELFARE FIRST  ·  WE ARE CTL  ·  NIGERIA TO THE WORLD  ·  '

export default function MarqueeTicker() {
  return (
    <div
      className="overflow-hidden py-3.5 select-none"
      style={{
        background: '#060606',
        borderTop: '1px solid rgba(212,175,55,0.07)',
        borderBottom: '1px solid rgba(212,175,55,0.07)',
      }}
    >
      <div className="marquee-inner">
        <span className="marquee-text">{PHRASE}</span>
        <span className="marquee-text" aria-hidden="true">{PHRASE}</span>
      </div>
    </div>
  )
}
