'use client'

import { useState, useEffect, useRef, useCallback } from 'react'

const ADMIN_PIN   = process.env.NEXT_PUBLIC_ADMIN_PIN || 'sf-admin-2026'
const SESSION_KEY = 'sf_gate_session'

type TicketRecord  = { ref: string; name: string; email: string; tier: string; tierId: string; quantity: number }
type CheckinRecord = { ref: string; name: string; email: string; tier: string; tierId: string; quantity: number; checkedInAt: string }
type ScanResult    = { status: 'valid' | 'duplicate' | 'invalid'; ref: string; ticket?: TicketRecord; checkedInAt?: string }

declare global {
  interface Window {
    BarcodeDetector: new (o?: { formats: string[] }) => {
      detect(src: HTMLVideoElement): Promise<{ rawValue: string }[]>
    }
  }
}

const TIER_COLOR: Record<string, string> = {
  general: 'text-gray-300 bg-gray-700/30',
  vip:     'text-orange-400 bg-orange-500/10',
  vvip:    'text-yellow-400 bg-yellow-500/10',
  phalanx: 'text-lime-400 bg-lime-500/10',
}

function fmtTime(iso: string) {
  return new Date(iso).toLocaleTimeString('en-NG', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
}

export default function GatePage() {
  const [authed, setAuthed]       = useState(false)
  const [pin, setPin]             = useState('')
  const [pinError, setPinError]   = useState('')
  const [checkins, setCheckins]   = useState<CheckinRecord[]>([])
  const [result, setResult]       = useState<ScanResult | null>(null)
  const [manualRef, setManualRef] = useState('')
  const [scanning, setScanning]   = useState(false)
  const [cameraMsg, setCameraMsg] = useState('')

  const videoRef    = useRef<HTMLVideoElement>(null)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const lastRef     = useRef<string | null>(null)
  const timerRef    = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    try { if (localStorage.getItem(SESSION_KEY) === 'true') setAuthed(true) } catch {}
  }, [])

  useEffect(() => {
    if (authed) try { setCheckins(JSON.parse(localStorage.getItem('sf_checkins') || '[]')) } catch {}
  }, [authed])

  const showResult = useCallback((r: ScanResult) => {
    setResult(r)
    if (timerRef.current) clearTimeout(timerRef.current)
    timerRef.current = setTimeout(() => setResult(null), 6000)
  }, [])

  const processRef = useCallback((raw: string) => {
    if (raw === lastRef.current) return
    lastRef.current = raw
    setTimeout(() => { lastRef.current = null }, 2000)

    let ref = raw.trim()
    try { const p = JSON.parse(raw); if (p?.ref) ref = p.ref } catch {}
    if (!ref) return

    const tickets: TicketRecord[] = (() => {
      try { return JSON.parse(localStorage.getItem('sf_tickets') || '[]') } catch { return [] }
    })()
    const ticket = tickets.find(t => t.ref === ref)
    if (!ticket) return showResult({ status: 'invalid', ref })

    const stored: CheckinRecord[] = (() => {
      try { return JSON.parse(localStorage.getItem('sf_checkins') || '[]') } catch { return [] }
    })()
    const dup = stored.find(c => c.ref === ref)
    if (dup) return showResult({ status: 'duplicate', ref, ticket, checkedInAt: dup.checkedInAt })

    const rec: CheckinRecord = {
      ref, name: ticket.name, email: ticket.email,
      tier: ticket.tier, tierId: ticket.tierId,
      quantity: ticket.quantity, checkedInAt: new Date().toISOString(),
    }
    const updated = [...stored, rec]
    try { localStorage.setItem('sf_checkins', JSON.stringify(updated)) } catch {}
    setCheckins(updated)
    showResult({ status: 'valid', ref, ticket, checkedInAt: rec.checkedInAt })
  }, [showResult])

  const stopCamera = useCallback(() => {
    if (intervalRef.current) { clearInterval(intervalRef.current); intervalRef.current = null }
    if (videoRef.current?.srcObject) {
      ;(videoRef.current.srcObject as MediaStream).getTracks().forEach(t => t.stop())
      videoRef.current.srcObject = null
    }
    setScanning(false)
  }, [])

  useEffect(() => () => {
    stopCamera()
    if (timerRef.current) clearTimeout(timerRef.current)
  }, [stopCamera])

  const startCamera = async () => {
    setCameraMsg('')
    if (!('BarcodeDetector' in window)) {
      setCameraMsg('QR scanning requires Chrome or Edge. Use manual entry below.')
      return
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: { ideal: 'environment' } } })
      if (videoRef.current) { videoRef.current.srcObject = stream; await videoRef.current.play() }
      setScanning(true)
      const det = new window.BarcodeDetector({ formats: ['qr_code'] })
      intervalRef.current = setInterval(async () => {
        if (!videoRef.current || videoRef.current.readyState < 2) return
        try { const codes = await det.detect(videoRef.current); if (codes[0]) processRef(codes[0].rawValue) } catch {}
      }, 400)
    } catch { setCameraMsg('Camera access denied. Use manual entry below.') }
  }

  const handleManual = (e: React.FormEvent) => {
    e.preventDefault()
    if (!manualRef.trim()) return
    processRef(manualRef.trim())
    setManualRef('')
  }

  const logout = () => {
    try { localStorage.removeItem(SESSION_KEY) } catch {}
    stopCamera()
    setAuthed(false)
  }

  const totalSold = (() => {
    try {
      const t: TicketRecord[] = JSON.parse(localStorage.getItem('sf_tickets') || '[]')
      return t.reduce((s, r) => s + r.quantity, 0)
    } catch { return 0 }
  })()
  const checkedIn     = checkins.reduce((s, c) => s + c.quantity, 0)
  const attendancePct = totalSold > 0 ? Math.round((checkedIn / totalSold) * 100) : 0

  if (!authed) return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="text-4xl mb-3">🎫</div>
          <h1 className="font-display text-3xl text-white mb-1">GATE SCANNER</h1>
          <p className="text-gray-500 text-sm">Sneakers Fest 2026 · Entry Validation</p>
        </div>
        <div className="bg-brand-gray rounded-3xl p-8 border border-white/5">
          <form onSubmit={e => {
            e.preventDefault()
            if (pin === ADMIN_PIN) { try { localStorage.setItem(SESSION_KEY, 'true') } catch {}; setAuthed(true) }
            else { setPinError('Incorrect PIN.'); setPin('') }
          }} className="space-y-4">
            <div>
              <label className="block text-sm text-gray-400 mb-1.5">Admin PIN</label>
              <input type="password" required autoFocus placeholder="Enter PIN"
                value={pin} onChange={e => { setPin(e.target.value); setPinError('') }}
                className="w-full px-4 py-3 bg-brand-dark border border-white/10 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-brand-orange text-sm tracking-widest" />
            </div>
            {pinError && <p className="text-red-400 text-xs">{pinError}</p>}
            <button type="submit" className="w-full py-3 rounded-xl bg-gradient-to-r from-brand-orange to-brand-amber text-black font-bold hover:opacity-90 transition-opacity">
              Enter Gate
            </button>
          </form>
        </div>
      </div>
    </div>
  )

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

      <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
        <div>
          <p className="text-brand-orange text-xs uppercase tracking-wider mb-1">Gate Operations</p>
          <h1 className="font-display text-4xl text-white">GATE SCANNER</h1>
          <p className="text-gray-500 text-sm mt-1">Validate and check in attendees · Dec 12, 2026</p>
        </div>
        <button onClick={logout} className="text-gray-500 text-sm border border-white/10 px-4 py-2 rounded-lg hover:text-gray-300 hover:border-white/20 transition-colors">
          Sign Out
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        {[
          { label: 'Checked In', value: String(checkedIn),  color: checkedIn > 0 ? 'text-green-400' : 'text-gray-500' },
          { label: 'Total Sold', value: String(totalSold),   color: 'text-white' },
          { label: 'Attendance', value: `${attendancePct}%`, color: attendancePct > 0 ? 'text-brand-orange' : 'text-gray-500' },
        ].map(({ label, value, color }) => (
          <div key={label} className="bg-brand-gray rounded-2xl p-4 border border-white/5 text-center">
            <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">{label}</p>
            <p className={`text-3xl font-bold ${color}`}>{value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">

        {/* Camera */}
        <div className="bg-brand-gray rounded-2xl p-6 border border-white/5">
          <h2 className="font-display text-lg text-white mb-4">QR SCANNER</h2>
          <div className="relative rounded-xl overflow-hidden bg-brand-dark mb-4">
            <video ref={videoRef} playsInline muted
              className={`w-full rounded-xl ${scanning ? 'block' : 'hidden'}`}
              style={{ maxHeight: 280 }} />
            {!scanning && (
              <div className="h-40 flex flex-col items-center justify-center gap-2">
                <div className="text-4xl opacity-20">📷</div>
                <p className="text-gray-600 text-sm">Camera inactive</p>
              </div>
            )}
            {scanning && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="relative w-44 h-44">
                  <div className="absolute top-0 left-0    w-8 h-8 border-t-2 border-l-2 border-brand-orange" />
                  <div className="absolute top-0 right-0   w-8 h-8 border-t-2 border-r-2 border-brand-orange" />
                  <div className="absolute bottom-0 left-0  w-8 h-8 border-b-2 border-l-2 border-brand-orange" />
                  <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-brand-orange" />
                  <div className="absolute inset-x-0 top-1/2 h-0.5 bg-brand-orange/40 animate-pulse" />
                </div>
              </div>
            )}
          </div>
          {cameraMsg && (
            <p className="text-amber-400 text-xs bg-amber-500/10 rounded-lg px-3 py-2 mb-3 border border-amber-500/20">{cameraMsg}</p>
          )}
          <button onClick={scanning ? stopCamera : startCamera}
            className={`w-full py-3 rounded-xl font-bold text-sm transition-all ${
              scanning
                ? 'bg-red-500/10 border border-red-500/30 text-red-400 hover:bg-red-500/20'
                : 'bg-gradient-to-r from-brand-orange to-brand-amber text-black hover:opacity-90'
            }`}>
            {scanning ? '⬛ Stop Camera' : '▶ Start Camera Scanner'}
          </button>
          {!scanning && <p className="text-center text-gray-600 text-xs mt-2">Chrome / Edge · camera permission required</p>}
        </div>

        {/* Manual + result */}
        <div className="flex flex-col gap-4">
          <div className="bg-brand-gray rounded-2xl p-6 border border-white/5">
            <h2 className="font-display text-lg text-white mb-1">MANUAL ENTRY</h2>
            <p className="text-gray-500 text-xs mb-4">Paste ticket ref (SF-…) or raw QR content</p>
            <form onSubmit={handleManual} className="flex gap-2">
              <input type="text" placeholder="SF-… or paste QR data"
                value={manualRef} onChange={e => setManualRef(e.target.value)} autoFocus={!scanning}
                className="flex-1 px-4 py-3 bg-brand-dark border border-white/10 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-brand-orange text-sm font-mono" />
              <button type="submit" className="px-5 py-3 rounded-xl bg-brand-orange text-black font-bold text-sm hover:opacity-90 whitespace-nowrap">
                Check In
              </button>
            </form>
          </div>

          {result ? (
            <div className={`rounded-2xl p-5 border flex-1 ${
              result.status === 'valid'     ? 'bg-green-500/10 border-green-500/30'
              : result.status === 'duplicate' ? 'bg-amber-500/10 border-amber-500/30'
              :                                  'bg-red-500/10 border-red-500/30'
            }`}>
              <div className="flex items-start gap-3">
                <div className="text-3xl">
                  {result.status === 'valid' ? '✅' : result.status === 'duplicate' ? '⚠️' : '❌'}
                </div>
                <div className="flex-1 min-w-0">
                  {result.status === 'valid' && result.ticket && (
                    <>
                      <p className="text-green-400 font-bold text-sm uppercase tracking-wide">Access Granted</p>
                      <p className="text-white font-semibold text-lg leading-tight mt-0.5">{result.ticket.name}</p>
                      <p className="text-gray-400 text-sm">{result.ticket.email}</p>
                      <div className="flex items-center gap-2 mt-1.5">
                        <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${TIER_COLOR[result.ticket.tierId] || 'text-gray-300 bg-gray-700/30'}`}>{result.ticket.tier}</span>
                        <span className="text-gray-500 text-xs">× {result.ticket.quantity} pass{result.ticket.quantity !== 1 ? 'es' : ''}</span>
                      </div>
                      {result.checkedInAt && <p className="text-green-500 text-xs mt-1.5">✓ Checked in at {fmtTime(result.checkedInAt)}</p>}
                    </>
                  )}
                  {result.status === 'duplicate' && result.ticket && (
                    <>
                      <p className="text-amber-400 font-bold text-sm uppercase tracking-wide">Already Checked In</p>
                      <p className="text-white font-semibold text-lg leading-tight mt-0.5">{result.ticket.name}</p>
                      <p className="text-gray-400 text-sm">{result.ticket.email}</p>
                      <div className="flex items-center gap-2 mt-1.5">
                        <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${TIER_COLOR[result.ticket.tierId] || 'text-gray-300 bg-gray-700/30'}`}>{result.ticket.tier}</span>
                      </div>
                      {result.checkedInAt && <p className="text-amber-400 text-xs mt-1.5">Originally checked in {fmtTime(result.checkedInAt)}</p>}
                    </>
                  )}
                  {result.status === 'invalid' && (
                    <>
                      <p className="text-red-400 font-bold text-sm uppercase tracking-wide">Invalid Ticket</p>
                      <p className="text-gray-500 text-xs mt-1 font-mono break-all">{result.ref.slice(0, 40)}</p>
                      <p className="text-gray-600 text-xs mt-0.5">Not found in ticket database.</p>
                    </>
                  )}
                </div>
                <button onClick={() => setResult(null)} className="text-gray-600 hover:text-gray-400 text-xl leading-none flex-shrink-0 mt-0.5">×</button>
              </div>
            </div>
          ) : (
            <div className="bg-brand-gray rounded-2xl p-5 border border-white/5 flex items-center justify-center flex-1 min-h-[120px]">
              <div className="text-center">
                <div className="text-3xl opacity-20 mb-2">🔍</div>
                <p className="text-gray-600 text-sm">Waiting for scan or manual entry</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Check-in log */}
      {checkins.length > 0 && (
        <div className="bg-brand-gray rounded-2xl border border-white/5 overflow-hidden">
          <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between">
            <div>
              <h2 className="font-display text-lg text-white">CHECK-IN LOG</h2>
              <p className="text-xs text-gray-500 mt-0.5">{checkins.length} scanned · {checkedIn} total passes</p>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead><tr className="border-b border-white/10">
                {['Time', 'Name', 'Tier', 'Passes', 'Ref'].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-xs text-gray-500 uppercase tracking-wider font-medium">{h}</th>
                ))}
              </tr></thead>
              <tbody>
                {[...checkins].reverse().slice(0, 50).map((c, i) => (
                  <tr key={c.ref} className={`border-b border-white/5 ${i % 2 === 0 ? '' : 'bg-white/[0.02]'} hover:bg-green-500/5 transition-colors`}>
                    <td className="px-4 py-3 text-gray-500 text-xs whitespace-nowrap">{fmtTime(c.checkedInAt)}</td>
                    <td className="px-4 py-3">
                      <div className="text-white font-medium">{c.name}</div>
                      <div className="text-gray-600 text-xs">{c.email}</div>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${TIER_COLOR[c.tierId] || 'text-gray-300 bg-gray-700/30'}`}>{c.tier}</span>
                    </td>
                    <td className="px-4 py-3 text-gray-300 text-center">{c.quantity}</td>
                    <td className="px-4 py-3 text-gray-600 font-mono text-xs">{c.ref}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {checkins.length > 50 && (
            <div className="px-4 py-3 border-t border-white/5 text-center text-xs text-gray-600">
              Showing latest 50 of {checkins.length} check-ins
            </div>
          )}
        </div>
      )}
    </div>
  )
}
