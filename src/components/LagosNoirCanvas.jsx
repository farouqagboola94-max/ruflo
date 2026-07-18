import { useEffect, useRef } from 'react'

// SVG Lagos skyline path (mainland silhouette at night)
const SKYLINE_PATH = `
M0,180 L0,160 L18,160 L18,140 L30,140 L30,120 L38,120 L38,100 L46,100 L46,90
L52,90 L52,80 L56,80 L56,72 L60,72 L60,68 L64,68 L64,72 L68,72 L68,80
L72,80 L72,60 L76,60 L76,55 L78,55 L78,60 L80,60 L80,50 L84,50 L84,60
L88,60 L88,65 L94,65 L94,60 L98,60 L98,40 L100,40 L100,38 L102,38 L102,40
L106,40 L106,65 L112,65 L112,60 L118,60 L118,55 L124,55 L124,60 L130,60
L130,70 L136,70 L136,65 L142,65 L142,50 L144,50 L144,48 L146,48 L146,50
L150,50 L150,70 L160,70 L160,68 L168,68 L168,55 L172,55 L172,50 L174,50
L174,48 L176,48 L176,50 L180,50 L180,55 L184,55 L184,70 L190,70 L190,62
L196,62 L196,58 L200,58 L200,50 L202,50 L202,48 L204,48 L204,50 L208,50
L208,60 L214,60 L214,65 L220,65 L220,55 L224,55 L224,80 L230,80 L230,90
L238,90 L238,85 L246,85 L246,95 L254,95 L254,105 L262,105 L262,110
L270,110 L270,115 L280,115 L280,120 L290,120 L290,125 L300,125 L300,140
L320,140 L320,145 L340,145 L340,160 L360,160 L360,180 Z
`

export default function LagosNoirCanvas({ style }) {
  const canvasRef = useRef(null)
  const frameRef = useRef(null)
  const particlesRef = useRef([])
  const bokeRef = useRef([])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    let W = canvas.parentElement.offsetWidth || window.innerWidth
    let H = canvas.parentElement.offsetHeight || window.innerHeight
    canvas.width  = W
    canvas.height = H

    const resize = () => {
      W = canvas.parentElement.offsetWidth || window.innerWidth
      H = canvas.parentElement.offsetHeight || window.innerHeight
      canvas.width  = W
      canvas.height = H
      initParticles()
      initBokeh()
    }
    window.addEventListener('resize', resize)

    // Rain particles
    function initParticles() {
      particlesRef.current = Array.from({ length: 220 }, () => ({
        x: Math.random() * W,
        y: Math.random() * H,
        len: 8 + Math.random() * 22,
        speed: 6 + Math.random() * 10,
        alpha: 0.04 + Math.random() * 0.14,
        angle: 0.12 + Math.random() * 0.08,
      }))
    }

    // Distant bokeh lights (danfo headlights, building windows)
    function initBokeh() {
      bokeRef.current = Array.from({ length: 60 }, () => ({
        x: Math.random() * W,
        y: H * 0.15 + Math.random() * H * 0.6,
        r: 1 + Math.random() * 5,
        alpha: 0.06 + Math.random() * 0.25,
        speed: 0.2 + Math.random() * 0.7,
        dir: Math.random() > 0.5 ? 1 : -1,
        color: Math.random() > 0.7
          ? `255,230,51`   // danfo yellow
          : Math.random() > 0.5
            ? `245,166,35` // amber
            : `0,240,255`, // cyan
        pulse: Math.random() * Math.PI * 2,
      }))
    }

    initParticles()
    initBokeh()

    // Pre-render skyline silhouette
    const skylineCanvas = document.createElement('canvas')
    skylineCanvas.width  = W
    skylineCanvas.height = 220
    const skyCtx = skylineCanvas.getContext('2d')
    const scaleX = W / 360
    skyCtx.save()
    skyCtx.scale(scaleX, 1)
    const path = new Path2D(SKYLINE_PATH)
    skyCtx.fillStyle = '#0A0906'
    skyCtx.fill(path)
    // Window lights
    const windowDots = [
      [75,53],[99,42],[143,52],[173,53],[201,52],[174,62],
      [203,62],[82,62],[108,65],[162,72],[229,82],[244,88],
    ]
    skyCtx.fillStyle = '#D4751A'
    windowDots.forEach(([x,y]) => {
      skyCtx.globalAlpha = 0.5 + Math.random() * 0.4
      skyCtx.fillRect(x, y, 1.5, 1.5)
    })
    skyCtx.restore()

    let t = 0

    function draw() {
      t++
      ctx.clearRect(0, 0, W, H)

      // Base atmosphere: deep Lagos night gradient
      const grad = ctx.createLinearGradient(0, 0, 0, H)
      grad.addColorStop(0,   'rgba(10,9,8,0)')
      grad.addColorStop(0.4, 'rgba(13,15,22,0.3)')
      grad.addColorStop(0.75,'rgba(15,10,5,0.5)')
      grad.addColorStop(1,   'rgba(8,6,4,0.7)')
      ctx.fillStyle = grad
      ctx.fillRect(0, 0, W, H)

      // Distant glow pools — street lamps on the mainland
      const glowPool = (x, y, r, color) => {
        const g = ctx.createRadialGradient(x, y, 0, x, y, r)
        g.addColorStop(0,   color)
        g.addColorStop(0.4, color.replace(/[\d.]+\)$/, '0.06)'))
        g.addColorStop(1,   'transparent')
        ctx.fillStyle = g
        ctx.fillRect(x - r, y - r, r * 2, r * 2)
      }
      glowPool(W * 0.18, H * 0.78, 180, 'rgba(212,117,26,0.12)')
      glowPool(W * 0.52, H * 0.82, 220, 'rgba(245,166,35,0.08)')
      glowPool(W * 0.81, H * 0.75, 160, 'rgba(212,117,26,0.10)')
      glowPool(W * 0.35, H * 0.88, 260, 'rgba(255,230,51,0.06)')

      // Bokeh lights
      bokeRef.current.forEach(b => {
        b.pulse += 0.018
        b.x += b.speed * b.dir * 0.4
        if (b.x > W + 20) b.x = -20
        if (b.x < -20)    b.x = W + 20
        const alpha = b.alpha * (0.6 + 0.4 * Math.sin(b.pulse))
        const g = ctx.createRadialGradient(b.x, b.y, 0, b.x, b.y, b.r * 3)
        g.addColorStop(0,   `rgba(${b.color},${alpha})`)
        g.addColorStop(0.5, `rgba(${b.color},${alpha * 0.3})`)
        g.addColorStop(1,   'transparent')
        ctx.fillStyle = g
        ctx.beginPath()
        ctx.arc(b.x, b.y, b.r * 3, 0, Math.PI * 2)
        ctx.fill()
      })

      // Skyline silhouette at bottom third
      const skyY = H - 210
      ctx.drawImage(skylineCanvas, 0, skyY, W, 210)

      // Wet-pavement reflection below skyline
      ctx.save()
      ctx.translate(0, H - 5)
      ctx.scale(1, -0.18)
      ctx.globalAlpha = 0.12
      ctx.drawImage(skylineCanvas, 0, -(210), W, 210)
      ctx.restore()

      // Rain streaks
      ctx.save()
      particlesRef.current.forEach(p => {
        p.y += p.speed
        p.x += p.speed * p.angle
        if (p.y > H + p.len) { p.y = -p.len; p.x = Math.random() * W }
        if (p.x > W + 10)    { p.x = -10 }
        ctx.globalAlpha = p.alpha
        ctx.strokeStyle = '#a8c8d8'
        ctx.lineWidth   = 0.6
        ctx.beginPath()
        ctx.moveTo(p.x, p.y)
        ctx.lineTo(p.x + p.len * p.angle, p.y + p.len)
        ctx.stroke()
      })
      ctx.restore()

      // Neon light shaft from upper-right (arena sign glow)
      const shaftGrad = ctx.createLinearGradient(W * 0.72, 0, W * 0.55, H * 0.6)
      shaftGrad.addColorStop(0, 'rgba(245,166,35,0.07)')
      shaftGrad.addColorStop(1, 'transparent')
      ctx.globalAlpha = 1
      ctx.fillStyle = shaftGrad
      ctx.beginPath()
      ctx.moveTo(W * 0.72, 0)
      ctx.lineTo(W * 0.85, 0)
      ctx.lineTo(W * 0.60, H * 0.6)
      ctx.lineTo(W * 0.52, H * 0.6)
      ctx.closePath()
      ctx.fill()

      // Top fog veil
      const fogGrad = ctx.createLinearGradient(0, 0, 0, H * 0.35)
      fogGrad.addColorStop(0, 'rgba(10,12,18,0.55)')
      fogGrad.addColorStop(1, 'transparent')
      ctx.fillStyle = fogGrad
      ctx.fillRect(0, 0, W, H * 0.35)

      frameRef.current = requestAnimationFrame(draw)
    }

    frameRef.current = requestAnimationFrame(draw)
    return () => {
      cancelAnimationFrame(frameRef.current)
      window.removeEventListener('resize', resize)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'absolute', inset: 0, width: '100%', height: '100%',
        pointerEvents: 'none', zIndex: 1,
        ...style,
      }}
    />
  )
}
