import React, { useState, useEffect, useRef } from 'react'
import { B, FONTS } from '../tokens'

export default function LagosYouthExperience() {
  // IG Story Pass State
  const [handle, setHandle] = useState('@lagos_grailking')
  const [archetype, setArchetype] = useState('👑 GRAIL COLLECTOR')
  const canvasRef = useRef(null)

  // 3D Sneaker WebGL State
  const threeContainerRef = useRef(null)
  const [isRotating, setIsRotating] = useState(true)
  const [isWireframe, setIsWireframe] = useState(false)
  const [isExploded, setIsExploded] = useState(false)
  const sneakerPartsRef = useRef({})

  // Legit Check Scanner State
  const [scanMode, setScanMode] = useState('uv')
  const [isCalibrating, setIsCalibrating] = useState(false)
  const [verifiedStatus, setVerifiedStatus] = useState('100% VERIFIED GRAIL')

  // Scratch Ticket State
  const scratchCanvasRef = useRef(null)
  const [scratched, setScratched] = useState(false)

  // Audio Context Ref
  const audioCtxRef = useRef(null)

  const getAudioContext = () => {
    if (!audioCtxRef.current) {
      audioCtxRef.current = new (window.AudioContext || window.webkitAudioContext)()
    }
    if (audioCtxRef.current.state === 'suspended') {
      audioCtxRef.current.resume()
    }
    return audioCtxRef.current
  }

  // 1. Synthesized Audio FX
  const playSound = (type) => {
    try {
      const ctx = getAudioContext()
      const now = ctx.currentTime

      if (type === 'nodull') {
        const osc = ctx.createOscillator()
        const gain = ctx.createGain()
        osc.type = 'sawtooth'
        osc.frequency.setValueAtTime(320, now)
        osc.frequency.exponentialRampToValueAtTime(80, now + 0.35)
        gain.gain.setValueAtTime(0.4, now)
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.35)
        osc.connect(gain)
        gain.connect(ctx.destination)
        osc.start(now)
        osc.stop(now + 0.35)
      } else if (type === 'opor') {
        const osc = ctx.createOscillator()
        const gain = ctx.createGain()
        osc.type = 'sine'
        osc.frequency.setValueAtTime(140, now)
        osc.frequency.exponentialRampToValueAtTime(45, now + 0.5)
        gain.gain.setValueAtTime(0.7, now)
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.5)
        osc.connect(gain)
        gain.connect(ctx.destination)
        osc.start(now)
        osc.stop(now + 0.5)
      } else if (type === 'zuzu') {
        [0, 0.1, 0.2].forEach((delay) => {
          const osc = ctx.createOscillator()
          const gain = ctx.createGain()
          osc.type = 'square'
          osc.frequency.setValueAtTime(880, now + delay)
          gain.gain.setValueAtTime(0.15, now + delay)
          gain.gain.exponentialRampToValueAtTime(0.01, now + delay + 0.08)
          osc.connect(gain)
          gain.connect(ctx.destination)
          osc.start(now + delay)
          osc.stop(now + delay + 0.08)
        })
      } else if (type === 'danfo') {
        [320, 390].forEach((freq) => {
          const osc = ctx.createOscillator()
          const gain = ctx.createGain()
          osc.type = 'sawtooth'
          osc.frequency.setValueAtTime(freq, now)
          gain.gain.setValueAtTime(0.2, now)
          gain.gain.exponentialRampToValueAtTime(0.01, now + 0.35)
          osc.connect(gain)
          gain.connect(ctx.destination)
          osc.start(now)
          osc.stop(now + 0.35)
        })
      }
    } catch (e) {
      console.warn('Audio not allowed yet:', e)
    }
  }

  // 2. Render 9:16 Canvas Pass
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    const h = (handle || '@lagos_grailking').toUpperCase()

    // Background gradient
    const grad = ctx.createLinearGradient(0, 0, 0, 640)
    grad.addColorStop(0, '#1C150B')
    grad.addColorStop(0.3, '#0A0A0A')
    grad.addColorStop(0.7, '#0D1B2A')
    grad.addColorStop(1, '#1A0F00')
    ctx.fillStyle = grad
    ctx.fillRect(0, 0, 360, 640)

    // Cyber grid
    ctx.strokeStyle = 'rgba(245, 166, 35, 0.08)'
    ctx.lineWidth = 1
    for (let y = 0; y < 640; y += 32) {
      ctx.beginPath()
      ctx.moveTo(0, y)
      ctx.lineTo(360, y)
      ctx.stroke()
    }

    // Border
    ctx.strokeStyle = 'rgba(255, 224, 51, 0.4)'
    ctx.lineWidth = 2
    ctx.strokeRect(16, 16, 328, 608)

    // Header Tags
    ctx.fillStyle = '#D4751A'
    ctx.font = 'bold 10px monospace'
    ctx.fillText('CATALYST OS · VERIFIED SOLE PASS', 30, 48)

    ctx.fillStyle = '#FFFFFF'
    ctx.font = "900 24px 'Bebas Neue', sans-serif"
    ctx.fillText("SNEAKERS FEST '26", 30, 80)

    ctx.fillStyle = '#FFE033'
    ctx.font = 'bold 13px sans-serif'
    ctx.fillText('THE SOLE EXHIBITION · LAGOS', 30, 102)

    // Inner Card
    ctx.fillStyle = 'rgba(255, 255, 255, 0.04)'
    ctx.fillRect(30, 126, 300, 240)
    ctx.strokeStyle = 'rgba(245, 166, 35, 0.3)'
    ctx.strokeRect(30, 126, 300, 240)

    // Icon circle
    ctx.fillStyle = '#FFE033'
    ctx.beginPath()
    ctx.arc(180, 210, 50, 0, Math.PI * 2)
    ctx.fill()

    ctx.fillStyle = '#0A0A0A'
    ctx.font = 'bold 36px monospace'
    ctx.textAlign = 'center'
    ctx.fillText('SF', 180, 222)
    ctx.textAlign = 'left'

    // Pass details
    ctx.fillStyle = '#A39E93'
    ctx.font = '10px monospace'
    ctx.fillText('PASS HOLDER:', 44, 300)

    ctx.fillStyle = '#00F0FF'
    ctx.font = 'bold 15px monospace'
    ctx.fillText(h, 44, 322)

    ctx.fillStyle = '#A39E93'
    ctx.font = '10px monospace'
    ctx.fillText('ARCHETYPE:', 44, 344)

    ctx.fillStyle = '#B8FF00'
    ctx.font = 'bold 11px monospace'
    ctx.fillText(archetype, 44, 358)

    // Barcode simulated
    ctx.fillStyle = '#FFF'
    ctx.font = 'bold 12px monospace'
    ctx.fillText('DECEMBER 12, 2026', 30, 420)
    ctx.fillStyle = '#8C8578'
    ctx.font = '11px sans-serif'
    ctx.fillText('Muri Okunola Park · Victoria Island, Lagos', 30, 438)

    for (let x = 30; x < 330; x += 4) {
      if (Math.sin(x * 12.3) > -0.2) {
        ctx.fillRect(x, 480, 2, 40)
      }
    }

    ctx.fillStyle = '#FFE033'
    ctx.font = '9px monospace'
    ctx.fillText('SF-26-LAG-994827-CATALYST-PASS', 30, 536)
  }, [handle, archetype])

  // Download pass
  const downloadPass = () => {
    const canvas = canvasRef.current
    if (!canvas) return
    const link = document.createElement('a')
    link.download = `SneakersFest26-Story-Pass.png`
    link.href = canvas.toDataURL('image/png')
    link.click()
  }

  // 3. Three.js Initialization
  useEffect(() => {
    const container = threeContainerRef.current
    if (!container || !window.THREE) return

    const THREE = window.THREE
    const w = container.clientWidth || 600
    const h = 420

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(45, w / h, 0.1, 1000)
    camera.position.set(0, 3, 9)

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setSize(w, h)
    renderer.setPixelRatio(window.devicePixelRatio)
    container.innerHTML = ''
    container.appendChild(renderer.domElement)

    const ambLight = new THREE.AmbientLight(0xffffff, 0.6)
    scene.add(ambLight)

    const goldLight = new THREE.PointLight(0xFFE033, 2.5, 30)
    goldLight.position.set(5, 6, 5)
    scene.add(goldLight)

    const cyanLight = new THREE.PointLight(0x00F0FF, 1.8, 30)
    cyanLight.position.set(-6, -2, -4)
    scene.add(cyanLight)

    const sneakerGroup = new THREE.Group()

    const outsoleMat = new THREE.MeshStandardMaterial({ color: 0xFFE033, roughness: 0.3 })
    const outsoleMesh = new THREE.Mesh(new THREE.BoxGeometry(4.8, 0.6, 2.2), outsoleMat)
    outsoleMesh.position.y = -1
    sneakerGroup.add(outsoleMesh)

    const midsoleMat = new THREE.MeshStandardMaterial({ color: 0x1A1A1A, roughness: 0.6 })
    const midsoleMesh = new THREE.Mesh(new THREE.BoxGeometry(4.6, 0.5, 2.0), midsoleMat)
    midsoleMesh.position.y = -0.4
    sneakerGroup.add(midsoleMesh)

    const upperMat = new THREE.MeshStandardMaterial({ color: 0xD4751A, roughness: 0.4 })
    const upperGeom = new THREE.CylinderGeometry(0.9, 1.2, 3.8, 16)
    upperGeom.rotateZ(Math.PI / 2)
    const upperMesh = new THREE.Mesh(upperGeom, upperMat)
    upperMesh.position.set(0.2, 0.6, 0)
    sneakerGroup.add(upperMesh)

    scene.add(sneakerGroup)
    sneakerPartsRef.current = { outsoleMesh, midsoleMesh, upperMesh, outsoleMat, midsoleMat, upperMat }

    let reqId
    const animate = () => {
      reqId = requestAnimationFrame(animate)
      if (isRotating) sneakerGroup.rotation.y += 0.015
      renderer.render(scene, camera)
    }
    animate()

    return () => {
      cancelAnimationFrame(reqId)
      renderer.dispose()
    }
  }, [isRotating])

  // Wireframe toggle
  useEffect(() => {
    const { outsoleMat, midsoleMat, upperMat } = sneakerPartsRef.current
    if (outsoleMat) outsoleMat.wireframe = isWireframe
    if (midsoleMat) midsoleMat.wireframe = isWireframe
    if (upperMat) upperMat.wireframe = isWireframe
  }, [isWireframe])

  // Exploded Sole toggle
  useEffect(() => {
    const { outsoleMesh, midsoleMesh, upperMesh } = sneakerPartsRef.current
    if (!outsoleMesh) return
    if (isExploded) {
      outsoleMesh.position.y = -2.2
      midsoleMesh.position.y = -0.8
      upperMesh.position.y = 1.4
    } else {
      outsoleMesh.position.y = -1
      midsoleMesh.position.y = -0.4
      upperMesh.position.y = 0.6
    }
  }, [isExploded])

  // 4. Scratch-to-Win Card
  useEffect(() => {
    const canvas = scratchCanvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')

    ctx.fillStyle = '#FFE033'
    ctx.fillRect(0, 0, 320, 150)

    ctx.strokeStyle = '#D4751A'
    ctx.lineWidth = 2
    for (let i = 0; i < 320; i += 20) {
      ctx.beginPath()
      ctx.moveTo(i, 0)
      ctx.lineTo(i + 20, 150)
      ctx.stroke()
    }

    ctx.fillStyle = '#0A0A0A'
    ctx.font = 'bold 14px sans-serif'
    ctx.textAlign = 'center'
    ctx.fillText('⚡ SCRATCH TO UNLOCK VIP REWARD', 160, 80)

    let drawing = false
    let count = 0

    const scratch = (e) => {
      if (!drawing) return
      const rect = canvas.getBoundingClientRect()
      const x = (e.clientX || (e.touches && e.touches[0].clientX)) - rect.left
      const y = (e.clientY || (e.touches && e.touches[0].clientY)) - rect.top

      ctx.globalCompositeOperation = 'destination-out'
      ctx.beginPath()
      ctx.arc(x, y, 22, 0, Math.PI * 2)
      ctx.fill()
      count++
      if (count > 30 && !scratched) {
        setScratched(true)
        if (window.confetti) {
          window.confetti({ particleCount: 80, spread: 70, origin: { y: 0.8 } })
        }
      }
    }

    canvas.onmousedown = () => drawing = true
    canvas.onmouseup = () => drawing = false
    canvas.onmousemove = scratch
    canvas.ontouchstart = () => drawing = true
    canvas.ontouchend = () => drawing = false
    canvas.ontouchmove = scratch
  }, [scratched])

  return (
    <section className="relative py-20 px-4 max-w-7xl mx-auto" id="lagos-youth-experience">
      <div className="lagos-divider mb-16" />

      {/* HEADER */}
      <div className="text-center max-w-3xl mx-auto mb-16">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 font-mono text-xs uppercase tracking-widest mb-4">
          ⚡ Catalyst OS · Lagos Street Culture Engine
        </div>
        <h2 className="font-display text-4xl sm:text-6xl text-white uppercase tracking-tight mb-4">
          Lagos Viral Reel & Grails Suite
        </h2>
        <p className="text-gray-400 text-base sm:text-lg leading-relaxed">
          The unapologetic spirit of Lagos youth culture. Interactive 3D sole telemetry, viral Instagram reels, procedural Afrobeat synthesizers, and instant VIP golden passes.
        </p>
      </div>

      {/* 1. VIRAL REELS GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
        <div className="card-3d rounded-2xl overflow-hidden bg-black/60 border border-white/10 p-2">
          <div className="relative aspect-[9/16] rounded-xl overflow-hidden bg-black">
            <video src="/media/reel1.mp4" autoPlay loop muted playsInline className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-black/30 p-3 flex flex-col justify-between">
              <span className="bg-black/60 backdrop-blur-md px-2 py-1 rounded-full text-xs text-amber-400 font-bold border border-white/10">🔥 @sneakersfest</span>
              <div className="flex justify-between items-center text-xs">
                <span className="text-amber-400 font-mono">142K Plays</span>
                <span className="bg-amber-500 text-black px-2 py-0.5 rounded-full font-bold">LIVE REEL</span>
              </div>
            </div>
          </div>
          <div className="p-3">
            <h4 className="text-white font-bold text-sm mb-1">Festival Anthem '26</h4>
            <p className="text-gray-400 text-xs">Victoria Island asphalt energy.</p>
          </div>
        </div>

        <div className="card-3d rounded-2xl overflow-hidden bg-black/60 border border-white/10 p-2">
          <div className="relative aspect-[9/16] rounded-xl overflow-hidden bg-black">
            <img src="/media/flyer.png" alt="Flyer" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-black/30 p-3 flex flex-col justify-between">
              <span className="bg-black/60 backdrop-blur-md px-2 py-1 rounded-full text-xs text-amber-400 font-bold border border-white/10">⚡ Official Flyer</span>
              <div className="flex justify-between items-center text-xs">
                <span className="text-amber-400 font-mono">Dec 12</span>
                <span className="bg-amber-500 text-black px-2 py-0.5 rounded-full font-bold">LAGOS</span>
              </div>
            </div>
          </div>
          <div className="p-3">
            <h4 className="text-white font-bold text-sm mb-1">200+ Rare Grails</h4>
            <p className="text-gray-400 text-xs">Muri Okunola Park arena.</p>
          </div>
        </div>

        <div className="card-3d rounded-2xl overflow-hidden bg-black/60 border border-white/10 p-2">
          <div className="relative aspect-[9/16] rounded-xl overflow-hidden bg-black">
            <img src="/media/story.png" alt="Gate Pass" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-black/30 p-3 flex flex-col justify-between">
              <span className="bg-black/60 backdrop-blur-md px-2 py-1 rounded-full text-xs text-amber-400 font-bold border border-white/10">🎟️ Gate VIP</span>
              <div className="flex justify-between items-center text-xs">
                <span className="text-amber-400 font-mono">Limited 500</span>
                <span className="bg-amber-500 text-black px-2 py-0.5 rounded-full font-bold">SOVEREIGN</span>
              </div>
            </div>
          </div>
          <div className="p-3">
            <h4 className="text-white font-bold text-sm mb-1">VIP Protocol</h4>
            <p className="text-gray-400 text-xs">Priority authentication queue.</p>
          </div>
        </div>

        <div className="card-3d rounded-2xl overflow-hidden bg-black/60 border border-white/10 p-2">
          <div className="relative aspect-[9/16] rounded-xl overflow-hidden bg-black">
            <img src="/media/hero2.png" alt="Exhibition" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-black/30 p-3 flex flex-col justify-between">
              <span className="bg-black/60 backdrop-blur-md px-2 py-1 rounded-full text-xs text-amber-400 font-bold border border-white/10">👑 The Vault</span>
              <div className="flex justify-between items-center text-xs">
                <span className="text-amber-400 font-mono">Auction Wall</span>
                <span className="bg-amber-500 text-black px-2 py-0.5 rounded-full font-bold">ARCHIVAL</span>
              </div>
            </div>
          </div>
          <div className="p-3">
            <h4 className="text-white font-bold text-sm mb-1">Museum Exhibition</h4>
            <p className="text-gray-400 text-xs">Archival streetwear history.</p>
          </div>
        </div>
      </div>

      {/* 2. 9:16 IG STORY PASS GENERATOR */}
      <div className="glass-noir rounded-3xl border border-amber-500/20 p-8 sm:p-10 mb-16 grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 font-mono text-xs uppercase tracking-widest mb-4">
            🎨 PASS ENGINE
          </div>
          <h3 className="font-display text-3xl sm:text-4xl text-white mb-4">
            Generate Your 9:16 Story Pass
          </h3>
          <p className="text-gray-400 text-sm leading-relaxed mb-6">
            Customise your official collector card, select your street archetype, and export an authentic high-res pass directly for Instagram Stories.
          </p>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-mono text-amber-400 mb-1">YOUR INSTAGRAM HANDLE</label>
              <input
                type="text"
                value={handle}
                onChange={(e) => setHandle(e.target.value)}
                className="w-full bg-black/60 border border-white/10 rounded-xl px-4 py-2.5 text-white font-mono text-sm focus:border-amber-400 outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-mono text-amber-400 mb-1">SNEAKER ARCHETYPE</label>
              <select
                value={archetype}
                onChange={(e) => setArchetype(e.target.value)}
                className="w-full bg-black/60 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:border-amber-400 outline-none"
              >
                <option value="👑 GRAIL COLLECTOR">👑 GRAIL COLLECTOR (Archival Heat)</option>
                <option value="🛹 SKATE / STREET">🛹 SKATE / STREET (SBs Only)</option>
                <option value="🛡️ TECHWEAR PHALANX">🛡️ TECHWEAR PHALANX (GORE-TEX)</option>
                <option value="🏀 RETRO HOOPER">🏀 RETRO HOOPER (OG Jordans)</option>
                <option value="⚡ DANFO RUNNER">⚡ DANFO RUNNER (Pure Energy)</option>
              </select>
            </div>
            <button
              onClick={downloadPass}
              className="w-full mt-2 py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 text-black font-bold text-sm tracking-wider uppercase hover:opacity-95 transition-opacity"
            >
              📥 Download 9:16 Story Pass
            </button>
          </div>
        </div>

        <div className="flex justify-center">
          <canvas ref={canvasRef} width="360" height="640" className="rounded-2xl border border-white/10 shadow-2xl max-w-full h-auto" />
        </div>
      </div>

      {/* 3. 3D WEBGL STUDIO */}
      <div className="glass-noir rounded-3xl border border-amber-500/20 p-6 sm:p-8 mb-16">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 font-mono text-xs uppercase tracking-widest mb-2">
              🌐 WEBGL 3D TELEMETRY
            </div>
            <h3 className="font-display text-2xl sm:text-3xl text-white">
              Parametric Sole Inspection Studio
            </h3>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setIsRotating(!isRotating)}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold border transition-colors ${
                isRotating ? 'bg-amber-400 text-black border-amber-400' : 'text-gray-300 border-white/10'
              }`}
            >
              🔄 Orbit
            </button>
            <button
              onClick={() => setIsWireframe(!isWireframe)}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold border transition-colors ${
                isWireframe ? 'bg-cyan-400 text-black border-cyan-400' : 'text-gray-300 border-white/10'
              }`}
            >
              🕸️ Wireframe
            </button>
            <button
              onClick={() => setIsExploded(!isExploded)}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold border transition-colors ${
                isExploded ? 'bg-pink-500 text-white border-pink-500' : 'text-gray-300 border-white/10'
              }`}
            >
              💥 Exploded Sole
            </button>
          </div>
        </div>
        <div ref={threeContainerRef} className="w-full h-[420px] rounded-2xl bg-black/80 overflow-hidden relative" />
      </div>

      {/* 4. TACTILE AUDIO SOUNDBOARD */}
      <div className="mb-16">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 font-mono text-xs uppercase tracking-widest mb-2">
            🔊 BROWSER SYNTHESIZER
          </div>
          <h3 className="font-display text-2xl sm:text-3xl text-white">
            Lagos Street Soundboard
          </h3>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <button
            onClick={() => playSound('nodull')}
            className="p-5 rounded-2xl bg-black/60 border border-white/10 hover:border-amber-400 text-left transition-all hover:-translate-y-1"
          >
            <div className="text-white font-bold text-sm mb-1">🔥 No Dull Yourself!</div>
            <div className="text-gray-400 text-xs">440Hz punch synth</div>
          </button>
          <button
            onClick={() => playSound('opor')}
            className="p-5 rounded-2xl bg-black/60 border border-white/10 hover:border-amber-400 text-left transition-all hover:-translate-y-1"
          >
            <div className="text-white font-bold text-sm mb-1">⚡ Opor Gan!</div>
            <div className="text-gray-400 text-xs">Sub-bass 808 drop</div>
          </button>
          <button
            onClick={() => playSound('zuzu')}
            className="p-5 rounded-2xl bg-black/60 border border-white/10 hover:border-amber-400 text-left transition-all hover:-translate-y-1"
          >
            <div className="text-white font-bold text-sm mb-1">👀 Who Dey Zuzu?</div>
            <div className="text-gray-400 text-xs">Chirp filter sweep</div>
          </button>
          <button
            onClick={() => playSound('danfo')}
            className="p-5 rounded-2xl bg-black/60 border border-white/10 hover:border-amber-400 text-left transition-all hover:-translate-y-1"
          >
            <div className="text-white font-bold text-sm mb-1">🚐 Oshodi Express!</div>
            <div className="text-gray-400 text-xs">Dual horn acoustic</div>
          </button>
        </div>
      </div>

      {/* 5. SCRATCH-TO-WIN GOLDEN TICKET */}
      <div className="max-w-md mx-auto glass-noir rounded-3xl border border-amber-500/20 p-6 text-center">
        <div className="text-xs font-mono text-amber-400 mb-2">DECEMBER 12 · MURI OKUNOLA</div>
        <h4 className="text-white font-bold text-lg mb-4">Scratch For Secret Discount Voucher</h4>
        <div className="relative w-[320px] h-[150px] mx-auto rounded-xl overflow-hidden mb-4 shadow-xl">
          <div className="absolute inset-0 bg-gradient-to-r from-amber-400 to-orange-500 flex flex-col items-center justify-center text-black font-black">
            <span className="text-xs">UNLOCKED CODE:</span>
            <span className="text-3xl font-mono">LAGOS55VIP</span>
            <span className="text-xs mt-1">₦2,500 OFF ANY FESTIVAL PASS</span>
          </div>
          <canvas ref={scratchCanvasRef} width="320" height="150" className="absolute inset-0 cursor-crosshair touch-none" />
        </div>
        <p className="text-gray-400 text-xs">
          {scratched ? '🎉 Code Unlocked! Use at checkout on Tickets page.' : 'Scratch the card surface to reveal secret code.'}
        </p>
      </div>
    </section>
  )
}
