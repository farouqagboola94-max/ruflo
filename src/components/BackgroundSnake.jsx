import { useEffect, useRef } from 'react'

const SNAKES = [
  // color, glow, maxWidth, segments, speed(×0.001/ms), amplitude(px), frequency, yFraction, opacity
  { color: '#0088ff', glow: '#0044cc', maxW: 4.5, seg: 90,  speed: 0.80, amp: 85,  freq: 0.013, yFrac: 0.28, alpha: 0.90 },
  { color: '#00bbff', glow: '#0077cc', maxW: 2.0, seg: 70,  speed: 1.15, amp: 50,  freq: 0.021, yFrac: 0.50, alpha: 0.70 },
  { color: '#0033ff', glow: '#0020aa', maxW: 7.0, seg: 100, speed: 0.50, amp: 110, freq: 0.008, yFrac: 0.72, alpha: 0.38 },
  { color: '#00eeff', glow: '#00aacc', maxW: 1.2, seg: 55,  speed: 1.50, amp: 35,  freq: 0.032, yFrac: 0.38, alpha: 0.75 },
  { color: '#0055ff', glow: '#003399', maxW: 3.5, seg: 80,  speed: 0.65, amp: 75,  freq: 0.017, yFrac: 0.62, alpha: 0.55 },
  { color: '#22aaff', glow: '#1166bb', maxW: 5.5, seg: 95,  speed: 0.90, amp: 60,  freq: 0.011, yFrac: 0.14, alpha: 0.62 },
]

function drawSnake(ctx, s, W, H, ts) {
  const yC = H * s.yFrac
  const t  = ts * 0.001 * s.speed

  ctx.save()
  ctx.lineCap = 'round'

  for (let i = 1; i < s.seg; i++) {
    const pct = i / s.seg          // 0 = tail, 1 = head
    const x0  = ((i - 1) / s.seg) * W
    const x1  = (i       / s.seg) * W
    const y0  = yC + s.amp * Math.sin(s.freq * x0 - t)
    const y1  = yC + s.amp * Math.sin(s.freq * x1 - t)
    const w   = s.maxW * pct * pct  // quadratic taper — thinnest at tail

    if (w < 0.15) continue

    ctx.globalAlpha = s.alpha * pct
    ctx.strokeStyle = s.color
    ctx.lineWidth   = w
    ctx.shadowColor = s.glow
    ctx.shadowBlur  = w * 5
    ctx.beginPath()
    ctx.moveTo(x0, y0)
    ctx.lineTo(x1, y1)
    ctx.stroke()
  }

  // bright head dot at the leading edge
  const yH = yC + s.amp * Math.sin(s.freq * W - t)
  ctx.globalAlpha = s.alpha
  ctx.shadowColor = '#ffffff'
  ctx.shadowBlur  = s.maxW * 14
  ctx.fillStyle   = '#aaddff'
  ctx.beginPath()
  ctx.arc(W, yH, s.maxW * 0.8, 0, Math.PI * 2)
  ctx.fill()

  ctx.restore()
}

export default function BackgroundSnake() {
  const ref = useRef(null)

  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    let raf

    function resize() {
      const p = canvas.parentElement
      canvas.width  = p ? p.offsetWidth  : window.innerWidth
      canvas.height = p ? p.offsetHeight : window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize)

    function loop(ts) {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      for (const s of SNAKES) drawSnake(ctx, s, canvas.width, canvas.height, ts)
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
    }
  }, [])

  return (
    <canvas
      ref={ref}
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        display: 'block',
        pointerEvents: 'none',
        zIndex: 0,
      }}
    />
  )
}
