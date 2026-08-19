import { Component } from 'react'
import { B } from '../tokens'

/**
 * Isolates a group of lazily-loaded sections.
 *
 * Most sections are code-split, so a dropped connection or a stale
 * index.html pointing at chunks from a previous deploy will reject the
 * dynamic import. Without a boundary that rejection unmounts the whole
 * app and the visitor gets a blank page. Here it costs one section.
 */
export default class SectionBoundary extends Component {
  state = { failed: false, isChunkError: false }

  static getDerivedStateFromError(error) {
    const msg = `${error?.name || ''} ${error?.message || ''}`
    // Vite/Rollup surface a missing or unreachable chunk in a few shapes.
    const isChunkError = /Loading chunk|Failed to fetch dynamically imported|Importing a module script failed|dynamically imported module/i.test(msg)
    return { failed: true, isChunkError }
  }

  componentDidCatch(error, info) {
    console.error('[SectionBoundary]', this.props.name || 'section', error, info?.componentStack)
  }

  retry = () => {
    // A stale chunk reference cannot be recovered by re-rendering — the
    // document itself is out of date, so a reload is the honest fix.
    if (this.state.isChunkError) window.location.reload()
    else this.setState({ failed: false, isChunkError: false })
  }

  render() {
    if (!this.state.failed) return this.props.children

    // navigator.onLine reports whether a network interface exists, not whether
    // anything is reachable. Measured: with the server killed outright it
    // still said online. At the gate, with thousands of phones on one tower,
    // it will say the same while nothing loads - so it cannot be what decides
    // the message. The chunk failure is the actual evidence; onLine only
    // sharpens the wording when it happens to be certain.
    const chunkFailed = this.state.isChunkError
    const certainlyOffline = typeof navigator !== 'undefined' && navigator.onLine === false

    // The likeliest reason to be reading this on a dead connection is standing
    // at the gate, so if a pass is saved, hand it over rather than explaining.
    let hasPass = false
    try { hasPass = !!localStorage.getItem('sf26_pass') } catch {}

    const tag = chunkFailed ? (certainlyOffline ? 'OFFLINE' : 'COULD NOT LOAD') : 'SECTION UNAVAILABLE'
    const why = chunkFailed
      ? (certainlyOffline
          ? 'You have no connection, and this part of the page was not saved to your device.'
          : 'This part of the page could not load. Usually that is a weak connection, sometimes an update to the site.')
      : 'Something went wrong loading this part of the page. The rest of the site is fine.'

    return (
      <section style={{ background: B.black, padding: '48px 24px', textAlign: 'center' }}>
        <div style={{
          maxWidth: 460, margin: '0 auto', padding: '28px 24px',
          background: B.charcoal, border: `1px solid ${B.gunmetal}`, borderRadius: 8,
        }}>
          <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 9, color: B.amber, letterSpacing: '0.3em', marginBottom: 10 }}>
            {tag}
          </div>
          <p style={{ fontFamily: "'Syne', sans-serif", fontSize: 14, color: B.mist, lineHeight: 1.7, marginBottom: 18 }}>
            {why}
            {chunkFailed && hasPass && ' Your pass works without a connection.'}
          </p>

          <div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap' }}>
            {chunkFailed && hasPass && (
              <a href="#my-pass" style={{
                display: 'inline-block', textDecoration: 'none',
                padding: '10px 24px', borderRadius: 3,
                background: B.amber, color: B.black,
                fontFamily: "'Space Mono', monospace", fontSize: 9, fontWeight: 700, letterSpacing: '0.18em',
              }}>SHOW MY PASS</a>
            )}
            <button
              onClick={this.retry}
              style={{
                padding: '10px 24px', borderRadius: 3, cursor: 'pointer',
                border: chunkFailed && hasPass ? `1px solid ${B.gunmetal}` : 'none',
                background: chunkFailed && hasPass ? 'transparent' : B.amber,
                color: chunkFailed && hasPass ? B.mist : B.black,
                fontFamily: "'Space Mono', monospace", fontSize: 9, fontWeight: 700, letterSpacing: '0.18em',
              }}
            >{chunkFailed ? 'TRY AGAIN' : 'RETRY'}</button>
          </div>
        </div>
      </section>
    )
  }
}
