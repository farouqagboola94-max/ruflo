import { B } from '../tokens'

/**
 * Indicates Catalyst OS Neural Engine status for AI features.
 */
export default function AIComingSoon({ feature }) {
  return (
    <div
      role="status"
      style={{
        display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap',
        margin: '0 0 26px', padding: '12px 16px',
        background: 'rgba(192, 132, 252, 0.08)', border: '1px solid rgba(192, 132, 252, 0.3)', borderRadius: 6,
      }}
    >
      <span style={{
        flexShrink: 0, padding: '3px 9px', borderRadius: 3, background: 'linear-gradient(135deg, #C084FC, #FF6B35)',
        color: '#000', fontFamily: "'Space Mono', monospace",
        fontSize: 9, fontWeight: 700, letterSpacing: '0.2em',
      }}>CATALYST OS ACTIVE</span>
      <span style={{ fontFamily: "'Syne', sans-serif", fontSize: 13, color: B.mist, lineHeight: 1.6 }}>
        {feature ? `${feature}` : 'This engine'} is powered by the <strong>Catalyst OS Neural Skills Architecture</strong>. Ready to test & explore.
      </span>
    </div>
  )
}
