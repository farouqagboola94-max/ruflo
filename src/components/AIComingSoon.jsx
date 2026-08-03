import { B } from '../tokens'

/**
 * Shown at the top of a section whose only function needs an AI key that no
 * ordinary visitor has.
 *
 * The previous behaviour was worse than useless: the feature looked live,
 * took your input, and only then told you to paste an Anthropic API key.
 * Saying so up front costs a click and keeps the site honest.
 */
export default function AIComingSoon({ feature }) {
  return (
    <div
      role="status"
      style={{
        display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap',
        margin: '0 0 26px', padding: '13px 16px',
        background: `${B.amber}0D`, border: `1px solid ${B.amber}33`, borderRadius: 6,
      }}
    >
      <span style={{
        flexShrink: 0, padding: '3px 9px', borderRadius: 3, background: B.amber,
        color: B.black, fontFamily: "'Space Mono', monospace",
        fontSize: 7, fontWeight: 700, letterSpacing: '0.2em',
      }}>COMING SOON</span>
      <span style={{ fontFamily: "'Syne', sans-serif", fontSize: 13, color: B.mist, lineHeight: 1.6 }}>
        {feature ? `${feature} is` : 'This is'} still being wired up. Have a look around &mdash; it will be
        live before December 12.
      </span>
    </div>
  )
}
