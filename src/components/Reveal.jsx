import { useRef, useEffect, useState } from 'react'

// If the observer has not fired by now, show the content anyway. A scroll
// animation must never be the reason a section is invisible.
const FAILSAFE_MS = 1600

const prefersReducedMotion = () =>
  typeof window !== 'undefined' &&
  window.matchMedia?.('(prefers-reduced-motion: reduce)').matches

export default function Reveal({ children, delay = 0 }) {
  const ref = useRef(null)
  // Start visible when we cannot animate meaningfully: no IntersectionObserver,
  // or the reader has asked for reduced motion.
  const [visible, setVisible] = useState(() =>
    typeof window === 'undefined' ||
    typeof IntersectionObserver === 'undefined' ||
    prefersReducedMotion()
  )

  useEffect(() => {
    if (visible) return
    const el = ref.current
    if (!el) return

    const show = () => setVisible(true)

    // threshold 0 — any sliver of the element counts. A ratio-based threshold
    // is unreachable for sections taller than viewport/threshold, which silently
    // pinned the tallest sections at opacity 0 forever.
    const ob = new IntersectionObserver(
      entries => { if (entries.some(e => e.isIntersecting)) show() },
      { threshold: 0, rootMargin: '200px 0px 0px 0px' }
    )
    ob.observe(el)

    // Covers every way the observer can fail to deliver: mounting late from a
    // code-split chunk while already scrolled past, layout shifts, and
    // browser quirks. Cheap insurance against an invisible page.
    const failsafe = setTimeout(show, FAILSAFE_MS)

    return () => { ob.disconnect(); clearTimeout(failsafe) }
  }, [visible])

  return (
    <div
      ref={ref}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0) scale(1)' : 'translateY(28px) scale(0.985)',
        filter: visible ? 'blur(0px)' : 'blur(2px)',
        transition: [
          `opacity 0.75s cubic-bezier(0.22,1,0.36,1) ${delay}ms`,
          `transform 0.75s cubic-bezier(0.22,1,0.36,1) ${delay}ms`,
          `filter 0.55s cubic-bezier(0.22,1,0.36,1) ${delay}ms`,
        ].join(', '),
        willChange: visible ? 'auto' : 'opacity, transform',
      }}
    >
      {children}
    </div>
  )
}
