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

    return (
      <section style={{ background: B.black, padding: '48px 24px', textAlign: 'center' }}>
        <div style={{
          maxWidth: 460, margin: '0 auto', padding: '28px 24px',
          background: B.charcoal, border: `1px solid ${B.gunmetal}`, borderRadius: 8,
        }}>
          <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 8, color: B.amber, letterSpacing: '0.3em', marginBottom: 10 }}>
            SECTION UNAVAILABLE
          </div>
          <p style={{ fontFamily: "'Syne', sans-serif", fontSize: 14, color: B.mist, lineHeight: 1.7, marginBottom: 18 }}>
            {this.state.isChunkError
              ? 'This part of the page could not load. It is usually a dropped connection or an update to the site.'
              : 'Something went wrong loading this part of the page. The rest of the site is fine.'}
          </p>
          <button
            onClick={this.retry}
            style={{
              padding: '10px 24px', borderRadius: 3, border: 'none', cursor: 'pointer',
              background: B.amber, color: B.black,
              fontFamily: "'Space Mono', monospace", fontSize: 9, fontWeight: 700, letterSpacing: '0.18em',
            }}
          >{this.state.isChunkError ? 'RELOAD PAGE' : 'TRY AGAIN'}</button>
        </div>
      </section>
    )
  }
}
