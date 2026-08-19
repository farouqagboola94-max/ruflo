import { useState, useEffect, useRef } from 'react'

/**
 * Holds a group of lazily-imported sections out of the DOM until the reader
 * gets near them.
 *
 * Every section on this page is already `lazy()`, but React starts a dynamic
 * import the moment the component renders - and App renders all of them on
 * mount. The result was 61 chunks fetched before the visitor had scrolled a
 * single pixel: 1.3 MB of JavaScript, 416 kB over the wire, for a page most
 * people never reach the bottom of. Code splitting without deferred mounting
 * splits the files but not the download.
 *
 * The placeholder reserves height so the groups stay spread down the page.
 * Without it every placeholder would collapse to nothing, they would all sit
 * within one screen of each other, and everything would mount at once again.
 *
 * Mounting happens a screen and a half early, so real content replaces the
 * placeholder while it is still below the fold. Content growing or shrinking
 * *below* the viewport does not move the reader; only changes above them do.
 */

// Rough height of one section. Only used to space the placeholders out, so it
// wants to be the right order of magnitude, not exact.
const SECTION_PX = 700

let mounted = false
const waiting = new Set()

/**
 * Put every deferred section into the DOM at once.
 *
 * Anchor links, the command palette and the browser's own find-in-page all
 * work by looking for something that is already on the page. A section that
 * has not mounted cannot be found or scrolled to, so anything that navigates
 * by id has to call this first.
 */
export function mountAll() {
  if (mounted) return
  mounted = true
  for (const reveal of waiting) reveal()
  waiting.clear()
}

export function isMountedAll() {
  return mounted
}

export default function Defer({ sections = 1, children }) {
  const [show, setShow] = useState(mounted)
  const ref = useRef(null)

  useEffect(() => {
    if (show) return
    const reveal = () => setShow(true)

    // Older browsers without IntersectionObserver get the whole page, which
    // is exactly what they got before this component existed.
    if (mounted || typeof IntersectionObserver === 'undefined') {
      reveal()
      return
    }

    waiting.add(reveal)
    const io = new IntersectionObserver(
      entries => { if (entries.some(e => e.isIntersecting)) reveal() },
      { rootMargin: '1500px 0px' },
    )
    if (ref.current) io.observe(ref.current)

    return () => { io.disconnect(); waiting.delete(reveal) }
  }, [show])

  if (show) return children

  return <div ref={ref} aria-hidden="true" style={{ minHeight: sections * SECTION_PX }} />
}

/**
 * Scroll to a section by id, mounting the page first if it is not there yet.
 *
 * Every route into a section goes through here: the navbar and footer anchors
 * (via the delegated handler in App), the mobile dock, and the command
 * palette.
 *
 * Releasing the page is not the same as having it. Each section still has a
 * chunk to fetch and Suspense renders nothing until it lands, so the target
 * can be seconds away rather than a frame away - a short retry gives up long
 * before the chunk arrives. Worse, every section that lands ABOVE the target
 * pushes it further down, so a scroll that was correct when it started is
 * wrong by the time it finishes. Both were real: a navbar click used to find
 * nothing at all, and a deep link used to land 2242px past its section.
 *
 * So: keep looking until the element exists, and keep re-aiming until its
 * position in the document stops moving.
 */
export function goToSection(id) {
  if (!id || id === 'hero') {
    window.scrollTo({ top: 0, behavior: 'smooth' })
    return
  }
  mountAll()

  const deadline = Date.now() + 8000
  let lastTop = null
  let stable = 0

  const tick = () => {
    const el = document.getElementById(id)
    if (el) {
      // Position in the document, not the viewport, so an in-flight smooth
      // scroll does not read as the target moving.
      const top = Math.round(el.getBoundingClientRect().top + window.scrollY)
      if (top === lastTop) {
        if (++stable >= 3) return
      } else {
        stable = 0
        lastTop = top
        el.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }
    }
    if (Date.now() < deadline) setTimeout(tick, 120)
  }
  tick()
}
