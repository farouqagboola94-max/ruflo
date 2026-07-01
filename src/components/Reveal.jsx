import { useRef, useEffect, useState } from 'react'

export default function Reveal({ children, delay = 0 }) {
  const ref = useRef(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const ob = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); ob.disconnect() } },
      { threshold: 0.07, rootMargin: '0px 0px -40px 0px' }
    )
    ob.observe(el)
    return () => ob.disconnect()
  }, [])

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
        willChange: 'opacity, transform',
      }}
    >
      {children}
    </div>
  )
}
