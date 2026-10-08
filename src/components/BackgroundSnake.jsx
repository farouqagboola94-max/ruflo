import { useEffect, useRef } from 'react'

const SNAKES = [
  // Deep background — large, dim, slow
  { color: '#002299', glow: '#001177', maxW: 9.0, seg: 115, speed: 0.38, amp: 140, freq: 0.005, yFrac: 0.62, alpha: 0.22 },
  { color: '#003388', glow: '#001166', maxW: 7.0, seg: 105, speed: 0.52, amp: 112, freq: 0.007, yFrac: 0.28, alpha: 0.28 },
  // Mid depth
  { color: '#0055ff', glow: '#0033cc', maxW: 4.0, seg: 88,  speed: 0.65, amp: 80,  freq: 0.015, yFrac: 0.55, alpha: 0.55 },
  { color: '#0077dd', glow: '#0044aa', maxW: 5.0, seg: 92,  speed: 0.72, amp: 88,  freq: 0.012, yFrac: 0.78, alpha: 0.48 },
  { color: '#0088ff', glow: '#0055cc', maxW: 4.5, seg: 90,  speed: 0.80, amp: 86,  freq: 0.013, yFrac: 0.30, alpha: 0.60 },
  // Close foreground — small, bright, fast
  { color: '#00ccff', glow: '#0099dd', maxW: 2.2, seg: 72,  speed: 1.10, amp: 52,  freq: 0.020, yFrac: 0.50, alpha: 0.72 },
  { color: '#00eeff', glow: '#00bbcc', maxW: 1.4, seg: 58,  speed: 1.50, amp: 36,  freq: 0.032, yFrac: 0.38, alpha: 0.78 },
  { color: '#33bbff', glow: '#1188cc', maxW: 1.8, seg: 65,  speed: 1.28, amp: 30,  freq: 0.027, yFrac: 0.14, alpha: 0.68 },
  // Accent — violet-blue
  { color: '#5544ff', glow: '#3322cc', maxW: 2.8, seg: 78,  speed: 0.88, amp: 60,  freq: 0.018, yFrac: 0.70, alpha: 0.28 },
]

// Module-level particle init (runs once on import)
const PARTICLES = Array.from({ length: 55 }, () => ({
  x:     Math.random(),
  y:     Math.random(),
  vx:    (Math.random() - 0.5) * 0.00014,
  vy:    (Math.random() - 0.5) * 0.00014,
  r:     Math.random() * 1.3 + 0.3,
  alpha: Math.random() * 0.28 + 0.05,
  phase: Math.random() * Math.PI * 2,
}))

function drawSnake(ctx, s, W, H, t) {
  const yC = H * s.yFrac
  ctx.save()
  ctx.lineCap = 'round'
  for (let i = 1; i < s.seg; i++) {
    const pct = i / s.seg
    const x0  = ((i - 1) / s.seg) * W
    const x1  = (i      / s.seg) * W
    const y0  = yC + s.amp * Math.sin(s.freq * x0 - t)
    const y1  = yC + s.amp * Math.sin(s.freq * x1 - t)
    const w   = s.maxW * pct * pct
    if (w < 0.12) continue
    ctx.globalAlpha = s.alpha * pct
    ctx.strokeStyle = s.color
    ctx.lineWidth   = w
    ctx.shadowColor = s.glow
    ctx.shadowBlur  = w * 7
    ctx.beginPath()
    ctx.moveTo(x0, y0)
    ctx.lineTo(x1, y1)
    ctx.stroke()
  }
  // Bright glowing head dot
  const yH = yC + s.amp * Math.sin(s.freq * W - t)
  ctx.globalAlpha = s.alpha
  ctx.shadowColor = '#ffffff'
  ctx.shadowBlur  = s.maxW * 18
  ctx.fillStyle   = '#cce8ff'
  ctx.beginPath()
  ctx.arc(W, yH, s.maxW * 0.75, 0, Math.PI * 2)
  ctx.fill()
  ctx.restore()
}

function drawParticles(ctx, W, H, ts) {
  ctx.save()
  const t = ts * 0.001
  PARTICLES.forEach(p => {
    p.x += p.vx; if (p.x < 0) p.x = 1; if (p.x > 1) p.x = 0
    p.y += p.vy; if (p.y < 0) p.y = 1; if (p.y > 1) p.y = 0
    const pulse = 0.45 + 0.55 * Math.sin(t * 0.7 + p.phase)
    ctx.globalAlpha = p.alpha * pulse
    ctx.fillStyle   = '#0077ff'
    ctx.shadowColor = '#00aaff'
    ctx.shadowBlur  = 5
    ctx.beginPath()
    ctx.arc(p.x * W, p.y * H, p.r, 0, Math.PI * 2)
    ctx.fill()
  })
  ctx.restore()
}

export default function BackgroundSnake() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    const dpr = window.devicePixelRatio || 1

    const resize = () => {
      const W = canvas.offsetWidth
      const H = canvas.offsetHeight
      canvas.width  = W * dpr
      canvas.height = H * dpr
      ctx.scale(dpr, dpr)
    }
    resize()
    window.addEventListener('resize', resize)

    let raf = null
    const draw = ts => {
      const W = canvas.offsetWidth
      const H = canvas.offsetHeight
      ctx.clearRect(0, 0, W, H)

      // Depth fog at bottom edge
      const fog = ctx.createLinearGradient(0, H * 0.65, 0, H)
      fog.addColorStop(0, 'transparent')
      fog.addColorStop(1, 'rgba(8,8,14,0.38)')
      ctx.fillStyle = fog
      ctx.fillRect(0, 0, W, H)

      drawParticles(ctx, W, H, ts)
      SNAKES.forEach(s => drawSnake(ctx, s, W, H, ts * 0.001 * s.speed))
      raf = requestAnimationFrame(draw)
    }
    raf = requestAnimationFrame(draw)

    return () => {
      window.removeEventListener('resize', resize)
      cancelAnimationFrame(raf)
    }
  }, [])

  return (
    <canvas ref={canvasRef} style={{
      position: 'absolute', inset: 0,
      width: '100%', height: '100%',
      zIndex: 0, pointerEvents: 'none',
    }} />
  )
}
