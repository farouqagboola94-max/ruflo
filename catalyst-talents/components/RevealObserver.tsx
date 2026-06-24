'use client'
import { useEffect } from 'react'

export default function RevealObserver() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed')
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.08, rootMargin: '0px 0px -40px 0px' }
    )

    // Only animate sections that start below the fold — prevents flicker on above-fold content
    const sections = Array.from(document.querySelectorAll('main section'))
    sections.forEach((el) => {
      const rect = el.getBoundingClientRect()
      if (rect.top > window.innerHeight * 0.88) {
        el.classList.add('reveal')
        observer.observe(el)
      }
    })

    return () => observer.disconnect()
  }, [])

  return null
}
