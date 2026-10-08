import { useEffect, useRef, useState } from 'react'

export default function CountUp({ to, duration = 2200, prefix = '', suffix = '' }) {
  const [val, setVal]   = useState(0)
  const elRef  = useRef(null)
  const done   = useRef(false)

  useEffect(() => {
    const el = elRef.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !done.current) {
          done.current = true
          let start = null
          const step = ts => {
            if (!start) start = ts
            const p      = Math.min((ts - start) / duration, 1)
            const eased  = 1 - Math.pow(1 - p, 4)   // ease-out quart
            setVal(Math.floor(eased * to))
            if (p < 1) requestAnimationFrame(step)
            else setVal(to)
          }
          requestAnimationFrame(step)
        }
      },
      { threshold: 0.5 }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [to, duration])

  return <span ref={elRef}>{prefix}{val.toLocaleString()}{suffix}</span>
}
