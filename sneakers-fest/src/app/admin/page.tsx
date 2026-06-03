'use client'

import { useState, useEffect, useMemo } from 'react'
import { TICKET_TIERS } from '@/data/tickets'

const ADMIN_PIN   = process.env.NEXT_PUBLIC_ADMIN_PIN || 'sf-admin-2026'
const SESSION_KEY = 'sf_admin_session'

// Raffle tickets included per pass by tier
const RAFFLE_PER_TIER: Record<string, number> = { general: 1, vip: 3, vvip: 5, phalanx: 5 }
const GUARANTEED_TIERS = new Set(['vvip', 'phalanx'])

type TicketRecord = {
  ref: string; name: string; email: string; phone: string
  tier: string; tierId: string; quantity: number; total: number; purchasedAt: string
}
type VendorRecord = {
  ref: string; email: string; businessName: string; contactName: string
  phone: string; instagram: string; category: string; tier: string
  tierId: string; size: string; price: number; registeredAt: string
}
type WaitlistRecord = {
  ref: string; tierId: string; tier: string
  name: string; email: string; phone: string; joinedAt: string
}
type DrawRecord = {
  id: string
  prize: string
  winner: { name: string; email: string; tier: string; tierId: string; ref: string; quantity: number }
  drawnAt: string
  claimed: boolean
}

type Tab = 'overview' | 'tickets' | 'vendors' | 'waitlist' | 'raffle'

function exportCSV(filename: string, headers: string[], rows: (string | number)[][]) {
  const escape = (v: string | number) => `"${String(v).replace(/"/g, '""')}"`
  const csv = [headers, ...rows].map(r => r.map(escape).join(',')).join('\n')
  const blob = new Blob([csv], { type: 'text/csv' })
  const url  = URL.createObjectURL(blob)
  const a    = document.createElement('a')
  a.href = url; a.download = filename; a.click()
  URL.revokeObjectURL(url)
}

function fmt(n: number) { return `₦${n.toLocaleString()}` }
function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-NG', {
    day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit',
  })
}

export default function AdminPage() {
  const [authed, setAuthed]                   = useState(false)
  const [pin, setPin]                         = useState('')
  const [error, setError]                     = useState('')
  const [tab, setTab]                         = useState<Tab>('overview')
  const [tickets, setTickets]                 = useState<TicketRecord[]>([])
  const [vendors, setVendors]                 = useState<VendorRecord[]>([])
  const [waitlist, setWaitlist]               = useState<WaitlistRecord[]>([])
  const [draws, setDraws]                     = useState<DrawRecord[]>([])
  const [guaranteedClaims, setGuaranteedClaims] = useState<string[]>([])
  const [currentWinner, setCurrentWinner]     = useState<DrawRecord | null>(null)
  const [prizeName, setPrizeName]             = useState('')
  const [tSearch, setTSearch]                 = useState('')
  const [vSearch, setVSearch]                 = useState('')
  const [wSearch, setWSearch]                 = useState('')

  useEffect(() => {
    try { if (localStorage.getItem(SESSION_KEY) === 'true') setAuthed(true) } catch {}
  }, [])

  useEffect(() => {
    if (!authed) return
    try {
      setTickets(JSON.parse(localStorage.getItem('sf_tickets')          || '[]'))
      setVendors(JSON.parse(localStorage.getItem('sf_vendors')          || '[]'))
      setWaitlist(JSON.parse(localStorage.getItem('sf_waitlist')        || '[]'))
      setDraws(JSON.parse(localStorage.getItem('sf_raffle_draws')       || '[]'))
      setGuaranteedClaims(JSON.parse(localStorage.getItem('sf_guaranteed_claims') || '[]'))
    } catch {}
  }, [authed])

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    if (pin === ADMIN_PIN) {
      try { localStorage.setItem(SESSION_KEY, 'true') } catch {}
      setAuthed(true)
    } else { setError('Incorrect PIN. Try again.'); setPin('') }
  }
  const logout = () => {
    try { localStorage.removeItem(SESSION_KEY) } catch {}
    setAuthed(false); setPin('')
  }

  // ── Stats ───────────────────────────────────────────────────────────────
  const stats = useMemo(() => {
    const ticketRevenue  = tickets.reduce((s, t) => s + t.total, 0)
    const vendorRevenue  = vendors.reduce((s, v) => s + v.price, 0)
    const totalRevenue   = ticketRevenue + vendorRevenue
    const ticketsSold    = tickets.reduce((s, t) => s + t.quantity, 0)
    const avgTicketValue = tickets.length ? Math.round(ticketRevenue / tickets.length) : 0
    const byTier = tickets.reduce<Record<string, { count: number; qty: number; revenue: number }>>((acc, t) => {
      if (!acc[t.tier]) acc[t.tier] = { count: 0, qty: 0, revenue: 0 }
      acc[t.tier].count++; acc[t.tier].qty += t.quantity; acc[t.tier].revenue += t.total
      return acc
    }, {})
    const byBooth = vendors.reduce<Record<string, { count: number; revenue: number }>>((acc, v) => {
      if (!acc[v.tier]) acc[v.tier] = { count: 0, revenue: 0 }
      acc[v.tier].count++; acc[v.tier].revenue += v.price
      return acc
    }, {})
    const soldByTierId = tickets.reduce<Record<string, number>>((acc, t) => {
      acc[t.tierId] = (acc[t.tierId] || 0) + t.quantity; return acc
    }, {})
    const wByTier = waitlist.reduce<Record<string, number>>((acc, w) => {
      acc[w.tier] = (acc[w.tier] || 0) + 1; return acc
    }, {})
    return { ticketRevenue, vendorRevenue, totalRevenue, ticketsSold, avgTicketValue, byTier, byBooth, soldByTierId, wByTier }
  }, [tickets, vendors, waitlist])

  // ── Raffle ───────────────────────────────────────────────────────────────
  // Flat pool: one slot per raffle ticket (rafflePerTier × quantity per purchase)
  const rafflePool = useMemo(() => {
    const pool: TicketRecord[] = []
    tickets.forEach(t => {
      const slots = (RAFFLE_PER_TIER[t.tierId] || 1) * t.quantity
      for (let i = 0; i < slots; i++) pool.push(t)
    })
    return pool
  }, [tickets])

  const poolStatsByTier = useMemo(() => {
    const m: Record<string, number> = {}
    tickets.forEach(t => {
      const slots = (RAFFLE_PER_TIER[t.tierId] || 1) * t.quantity
      m[t.tier] = (m[t.tier] || 0) + slots
    })
    return m
  }, [tickets])

  const wonRefs         = useMemo(() => new Set(draws.map(d => d.winner.ref)), [draws])
  const eligiblePool    = useMemo(() => rafflePool.filter(t => !wonRefs.has(t.ref)), [rafflePool, wonRefs])
  const guaranteedList  = useMemo(() => tickets.filter(t => GUARANTEED_TIERS.has(t.tierId)), [tickets])

  const performDraw = (baseDraws: DrawRecord[]) => {
    const usedRefs = new Set(baseDraws.map(d => d.winner.ref))
    const pool = rafflePool.filter(t => !usedRefs.has(t.ref))
    if (pool.length === 0) return
    const winner = pool[Math.floor(Math.random() * pool.length)]
    const newDraw: DrawRecord = {
      id: `DRAW-${Date.now()}`,
      prize: prizeName.trim() || 'Raffle Prize',
      winner: { name: winner.name, email: winner.email, tier: winner.tier, tierId: winner.tierId, ref: winner.ref, quantity: winner.quantity },
      drawnAt: new Date().toISOString(),
      claimed: false,
    }
    const updated = [...baseDraws, newDraw]
    setDraws(updated); setCurrentWinner(newDraw)
    try { localStorage.setItem('sf_raffle_draws', JSON.stringify(updated)) } catch {}
  }

  const drawWinner = () => performDraw(draws)

  const redraw = () => {
    if (!currentWinner) return
    const trimmed = draws.filter(d => d.id !== currentWinner.id)
    setDraws(trimmed); setCurrentWinner(null)
    try { localStorage.setItem('sf_raffle_draws', JSON.stringify(trimmed)) } catch {}
    performDraw(trimmed)
  }

  const toggleClaim = (drawId: string) => {
    const updated = draws.map(d => d.id === drawId ? { ...d, claimed: !d.claimed } : d)
    setDraws(updated)
    if (currentWinner?.id === drawId) setCurrentWinner(w => w ? { ...w, claimed: !w.claimed } : null)
    try { localStorage.setItem('sf_raffle_draws', JSON.stringify(updated)) } catch {}
  }

  const toggleGuaranteedClaim = (ref: string) => {
    const updated = guaranteedClaims.includes(ref)
      ? guaranteedClaims.filter(r => r !== ref)
      : [...guaranteedClaims, ref]
    setGuaranteedClaims(updated)
    try { localStorage.setItem('sf_guaranteed_claims', JSON.stringify(updated)) } catch {}
  }

  // ── Filtered tables ──────────────────────────────────────────────────────
  const filteredTickets = useMemo(() => {
    const q = tSearch.toLowerCase()
    return tickets.filter(t =>
      t.name.toLowerCase().includes(q) || t.email.toLowerCase().includes(q) ||
      t.tier.toLowerCase().includes(q) || t.ref.toLowerCase().includes(q)
    ).sort((a, b) => b.purchasedAt.localeCompare(a.purchasedAt))
  }, [tickets, tSearch])

  const filteredVendors = useMemo(() => {
    const q = vSearch.toLowerCase()
    return vendors.filter(v =>
      v.businessName.toLowerCase().includes(q) || v.email.toLowerCase().includes(q) ||
      v.category.toLowerCase().includes(q) || v.tier.toLowerCase().includes(q) || v.ref.toLowerCase().includes(q)
    ).sort((a, b) => b.registeredAt.localeCompare(a.registeredAt))
  }, [vendors, vSearch])

  const waitlistWithPos = useMemo(() => {
    const sorted = [...waitlist].sort((a, b) => a.joinedAt.localeCompare(b.joinedAt))
    const tc: Record<string, number> = {}
    return sorted.map(w => { tc[w.tierId] = (tc[w.tierId] || 0) + 1; return { ...w, position: tc[w.tierId] } })
  }, [waitlist])

  const filteredWaitlist = useMemo(() => {
    const q = wSearch.toLowerCase()
    return waitlistWithPos.filter(w =>
      w.name.toLowerCase().includes(q) || w.email.toLowerCase().includes(q) ||
      w.tier.toLowerCase().includes(q) || w.ref.toLowerCase().includes(q)
    )
  }, [waitlistWithPos, wSearch])

  const maxTierRevenue  = Math.max(...Object.values(stats.byTier).map(t => t.revenue), 1)
  const maxBoothRevenue = Math.max(...Object.values(stats.byBooth).map(b => b.revenue), 1)
  const totalPool       = rafflePool.length
  const eligibleCount   = eligiblePool.length

  // ── Login ───────────────────────────────────────────────────────────
  if (!authed) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="w-full max-w-sm">
          <div className="text-center mb-8">
            <div className="text-3xl mb-3">🔐</div>
            <h1 className="font-display text-3xl text-white mb-1">ADMIN</h1>
            <p className="text-gray-500 text-sm">Sneakers Fest 2026 · Operations</p>
          </div>
          <div className="bg-brand-gray rounded-3xl p-8 border border-white/5">
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-sm text-gray-400 mb-1.5">Admin PIN</label>
                <input type="password" required autoFocus placeholder="Enter PIN"
                  value={pin} onChange={e => { setPin(e.target.value); setError('') }}
                  className="w-full px-4 py-3 bg-brand-dark border border-white/10 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-brand-orange text-sm tracking-widest" />
              </div>
              {error && <p className="text-red-400 text-xs">{error}</p>}
              <button type="submit"
                className="w-full py-3 rounded-xl bg-gradient-to-r from-brand-orange to-brand-amber text-black font-bold hover:opacity-90 transition-opacity">
                Access Dashboard
              </button>
            </form>
          </div>
          <p className="text-center mt-4 text-gray-700 text-xs">Set PIN via NEXT_PUBLIC_ADMIN_PIN env var</p>
        </div>
      </div>
    )
  }

  // ── Dashboard ───────────────────────────────────────────────────────────
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

      <div className="flex items-center justify-between mb-10 flex-wrap gap-4">
        <div>
          <p className="text-brand-orange text-xs uppercase tracking-wider mb-1">Admin Dashboard</p>
          <h1 className="font-display text-4xl text-white">SNEAKERS FEST 2026</h1>
          <p className="text-gray-500 text-sm mt-1">Dec 12–13 · Lagos · All times live from this device</p>
        </div>
        <button onClick={logout}
          className="text-gray-500 text-sm border border-white/10 px-4 py-2 rounded-lg hover:text-gray-300 hover:border-white/20 transition-colors">
          Sign Out
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-8 border-b border-white/10 overflow-x-auto">
        {(['overview', 'tickets', 'vendors', 'waitlist', 'raffle'] as Tab[]).map(t => (
          <button key={t} onClick={() => setTab(t)}
            className={`px-4 py-2.5 text-sm font-semibold capitalize rounded-t-lg transition-colors border-b-2 whitespace-nowrap ${
              tab === t ? 'text-brand-orange border-brand-orange' : 'text-gray-500 border-transparent hover:text-gray-300'
            }`}>
            {t}
            {t === 'tickets'  && tickets.length  > 0 && <span className="ml-1.5 px-1.5 py-0.5 text-xs rounded-full bg-brand-orange/20 text-brand-orange">{tickets.length}</span>}
            {t === 'vendors'  && vendors.length  > 0 && <span className="ml-1.5 px-1.5 py-0.5 text-xs rounded-full bg-brand-orange/20 text-brand-orange">{vendors.length}</span>}
            {t === 'waitlist' && waitlist.length > 0 && <span className="ml-1.5 px-1.5 py-0.5 text-xs rounded-full bg-red-500/20 text-red-400">{waitlist.length}</span>}
            {t === 'raffle'   && draws.length    > 0 && <span className="ml-1.5 px-1.5 py-0.5 text-xs rounded-full bg-yellow-500/20 text-yellow-400">{draws.length}</span>}
          </button>
        ))}
      </div>

      {/* ── OVERVIEW ─────────────────────────────────────────────── */}
      {tab === 'overview' && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: 'Total Revenue',       value: fmt(stats.totalRevenue),  sub: 'tickets + booths' },
              { label: 'Tickets Sold',        value: stats.ticketsSold,         sub: `${tickets.length} transactions` },
              { label: 'Vendor Registrations',value: vendors.length,            sub: fmt(stats.vendorRevenue) + ' booth revenue' },
              { label: 'Avg Ticket Value',    value: fmt(stats.avgTicketValue), sub: 'per transaction' },
            ].map(({ label, value, sub }) => (
              <div key={label} className="bg-brand-gray rounded-2xl p-5 border border-white/5">
                <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">{label}</p>
                <p className="text-3xl font-bold text-white">{value}</p>
                <p className="text-xs text-gray-600 mt-1">{sub}</p>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-brand-gray rounded-2xl p-6 border border-white/5">
              <h2 className="font-display text-lg text-white mb-5">TICKET REVENUE BY TIER</h2>
              {Object.keys(stats.byTier).length === 0
                ? <p className="text-gray-600 text-sm">No ticket sales yet.</p>
                : <div className="space-y-4">
                    {Object.entries(stats.byTier).map(([tier, data]) => (
                      <div key={tier}>
                        <div className="flex justify-between text-sm mb-1.5">
                          <span className="text-gray-300 font-medium">{tier}</span>
                          <span className="text-gray-500">{data.qty} tickets · {fmt(data.revenue)}</span>
                        </div>
                        <div className="h-2 rounded-full bg-brand-dark overflow-hidden">
                          <div className="h-full rounded-full bg-gradient-to-r from-brand-orange to-brand-amber"
                            style={{ width: `${(data.revenue / maxTierRevenue) * 100}%` }} />
                        </div>
                      </div>
                    ))}
                  </div>
              }
            </div>
            <div className="bg-brand-gray rounded-2xl p-6 border border-white/5">
              <h2 className="font-display text-lg text-white mb-5">BOOTH REVENUE BY TYPE</h2>
              {Object.keys(stats.byBooth).length === 0
                ? <p className="text-gray-600 text-sm">No vendor registrations yet.</p>
                : <div className="space-y-4">
                    {Object.entries(stats.byBooth).map(([tier, data]) => (
                      <div key={tier}>
                        <div className="flex justify-between text-sm mb-1.5">
                          <span className="text-gray-300 font-medium">{tier} Booth</span>
                          <span className="text-gray-500">{data.count} registered · {fmt(data.revenue)}</span>
                        </div>
                        <div className="h-2 rounded-full bg-brand-dark overflow-hidden">
                          <div className="h-full rounded-full bg-gradient-to-r from-yellow-500 to-amber-600"
                            style={{ width: `${(data.revenue / maxBoothRevenue) * 100}%` }} />
                        </div>
                      </div>
                    ))}
                  </div>
              }
            </div>
          </div>

          <div className="bg-brand-gray rounded-2xl p-6 border border-white/5">
            <h2 className="font-display text-lg text-white mb-5">TICKET INVENTORY</h2>
            <div className="space-y-5">
              {TICKET_TIERS.map(t => {
                const sold = stats.soldByTierId[t.id] || 0
                const cap  = t.capacity || 0
                const rem  = Math.max(0, cap - sold)
                const pct  = cap ? Math.min(100, Math.round((sold / cap) * 100)) : 0
                const so   = rem === 0 && cap > 0
                const low  = !so && rem > 0 && rem <= 20
                return (
                  <div key={t.id}>
                    <div className="flex justify-between items-center text-sm mb-2">
                      <span className="text-gray-300 font-medium flex items-center gap-2">
                        {t.name}
                        {so  && <span className="text-xs px-2 py-0.5 rounded-full bg-red-500/20 text-red-400">SOLD OUT</span>}
                        {low && <span className="text-xs px-2 py-0.5 rounded-full bg-orange-500/20 text-orange-400">Low stock</span>}
                      </span>
                      <span className="text-gray-600 text-xs tabular-nums">
                        {sold} sold · <span className={so ? 'text-red-400' : low ? 'text-orange-400' : 'text-gray-400'}>{rem} left</span> · cap {cap}
                      </span>
                    </div>
                    <div className="h-2 rounded-full bg-brand-dark overflow-hidden">
                      <div className={`h-full rounded-full transition-all ${
                        so ? 'bg-red-500' : pct >= 80 ? 'bg-orange-500' : 'bg-gradient-to-r from-brand-orange to-brand-amber'
                      }`} style={{ width: `${Math.max(pct > 0 ? 2 : 0, pct)}%` }} />
                    </div>
                    <p className={`text-right text-xs mt-1 ${so ? 'text-red-400' : pct >= 80 ? 'text-orange-400' : 'text-gray-600'}`}>{pct}% filled</p>
                  </div>
                )
              })}
            </div>
          </div>

          <div className="bg-brand-gray rounded-2xl p-6 border border-white/5">
            <h2 className="font-display text-lg text-white mb-4">REVENUE SPLIT</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
              {[
                { label: 'Ticket Sales',   value: fmt(stats.ticketRevenue), pct: stats.totalRevenue ? Math.round((stats.ticketRevenue / stats.totalRevenue) * 100) : 0, color: 'text-brand-orange' },
                { label: 'Booth Fees',     value: fmt(stats.vendorRevenue), pct: stats.totalRevenue ? Math.round((stats.vendorRevenue  / stats.totalRevenue) * 100) : 0, color: 'text-brand-amber' },
                { label: 'Combined Total', value: fmt(stats.totalRevenue),  pct: 100, color: 'text-white' },
              ].map(({ label, value, pct, color }) => (
                <div key={label} className="bg-brand-dark rounded-xl p-4 border border-white/5">
                  <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">{label}</p>
                  <p className={`text-2xl font-bold ${color}`}>{value}</p>
                  <p className="text-xs text-gray-600 mt-0.5">{pct}% of total</p>
                </div>
              ))}
            </div>
          </div>

          {waitlist.length > 0 && (
            <div className="bg-brand-gray rounded-2xl p-6 border border-red-500/10">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-2 h-2 rounded-full bg-red-400" />
                <h2 className="font-display text-lg text-white">WAITLIST ACTIVITY</h2>
                <span className="ml-auto text-xs text-gray-500">{waitlist.length} total</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {Object.entries(stats.wByTier).map(([tier, count]) => (
                  <div key={tier} className="bg-brand-dark rounded-xl p-4 border border-red-500/10 text-center">
                    <p className="text-xs text-gray-500 uppercase mb-1">{tier}</p>
                    <p className="text-2xl font-bold text-red-400">{count}</p>
                    <p className="text-xs text-gray-600">waiting</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ── TICKETS ────────────────────────────────────────────────── */}
      {tab === 'tickets' && (
        <div>
          <div className="flex flex-wrap items-center justify-between gap-4 mb-5">
            <input type="text" placeholder="Search by name, email, tier, or ref…"
              value={tSearch} onChange={e => setTSearch(e.target.value)}
              className="flex-1 min-w-[220px] px-4 py-2.5 bg-brand-gray border border-white/10 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-brand-orange text-sm" />
            <button onClick={() => exportCSV('sneakers-fest-tickets.csv',
              ['Reference','Name','Email','Phone','Tier','Quantity','Total (NGN)','Date'],
              filteredTickets.map(t => [t.ref,t.name,t.email,t.phone,t.tier,t.quantity,t.total,fmtDate(t.purchasedAt)]))}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-white/10 text-gray-300 text-sm hover:border-brand-orange hover:text-brand-orange transition-colors">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
              Export CSV
            </button>
          </div>
          {filteredTickets.length === 0
            ? <div className="text-center py-20 text-gray-600">{tickets.length === 0 ? 'No ticket sales recorded yet.' : 'No results.'}</div>
            : <div className="bg-brand-gray rounded-2xl border border-white/5 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead><tr className="border-b border-white/10">
                      {['Date','Name','Email','Tier','Qty','Total','Reference'].map(h => (
                        <th key={h} className="text-left px-4 py-3 text-xs text-gray-500 uppercase tracking-wider font-medium">{h}</th>
                      ))}
                    </tr></thead>
                    <tbody>
                      {filteredTickets.map((t, i) => (
                        <tr key={t.ref} className={`border-b border-white/5 ${i%2===0?'':'bg-white/[0.02]'} hover:bg-brand-orange/5 transition-colors`}>
                          <td className="px-4 py-3 text-gray-500 text-xs whitespace-nowrap">{fmtDate(t.purchasedAt)}</td>
                          <td className="px-4 py-3 text-white font-medium">{t.name}</td>
                          <td className="px-4 py-3 text-gray-400">{t.email}</td>
                          <td className="px-4 py-3"><span className="px-2 py-0.5 rounded-full text-xs bg-brand-orange/15 text-brand-orange">{t.tier}</span></td>
                          <td className="px-4 py-3 text-gray-300 text-center">{t.quantity}</td>
                          <td className="px-4 py-3 text-brand-amber font-semibold">{fmt(t.total)}</td>
                          <td className="px-4 py-3 text-gray-600 font-mono text-xs">{t.ref}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="px-4 py-3 border-t border-white/5 flex justify-between text-xs text-gray-600">
                  <span>{filteredTickets.length} records</span>
                  <span>Total: {fmt(filteredTickets.reduce((s,t) => s+t.total, 0))}</span>
                </div>
              </div>
          }
        </div>
      )}

      {/* ── VENDORS ────────────────────────────────────────────────── */}
      {tab === 'vendors' && (
        <div>
          <div className="flex flex-wrap items-center justify-between gap-4 mb-5">
            <input type="text" placeholder="Search by brand, email, category, or ref…"
              value={vSearch} onChange={e => setVSearch(e.target.value)}
              className="flex-1 min-w-[220px] px-4 py-2.5 bg-brand-gray border border-white/10 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-brand-orange text-sm" />
            <button onClick={() => exportCSV('sneakers-fest-vendors.csv',
              ['Reference','Business','Contact','Email','Phone','Instagram','Category','Booth','Size','Paid (NGN)','Registered'],
              filteredVendors.map(v => [v.ref,v.businessName,v.contactName,v.email,v.phone,v.instagram,v.category,v.tier,v.size,v.price,fmtDate(v.registeredAt)]))}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-white/10 text-gray-300 text-sm hover:border-brand-orange hover:text-brand-orange transition-colors">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
              Export CSV
            </button>
          </div>
          {filteredVendors.length === 0
            ? <div className="text-center py-20 text-gray-600">{vendors.length === 0 ? 'No vendor registrations yet.' : 'No results.'}</div>
            : <div className="bg-brand-gray rounded-2xl border border-white/5 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead><tr className="border-b border-white/10">
                      {['Date','Business','Contact','Category','Booth','Paid','Reference'].map(h => (
                        <th key={h} className="text-left px-4 py-3 text-xs text-gray-500 uppercase tracking-wider font-medium">{h}</th>
                      ))}
                    </tr></thead>
                    <tbody>
                      {filteredVendors.map((v, i) => (
                        <tr key={v.ref} className={`border-b border-white/5 ${i%2===0?'':'bg-white/[0.02]'} hover:bg-brand-orange/5 transition-colors`}>
                          <td className="px-4 py-3 text-gray-500 text-xs whitespace-nowrap">{fmtDate(v.registeredAt)}</td>
                          <td className="px-4 py-3"><div className="text-white font-medium">{v.businessName}</div>{v.instagram && <div className="text-gray-600 text-xs">{v.instagram}</div>}</td>
                          <td className="px-4 py-3"><div className="text-gray-300">{v.contactName}</div><div className="text-gray-600 text-xs">{v.email}</div></td>
                          <td className="px-4 py-3 text-gray-400 text-xs">{v.category}</td>
                          <td className="px-4 py-3"><span className="px-2 py-0.5 rounded-full text-xs bg-brand-amber/15 text-brand-amber">{v.tier}</span><div className="text-gray-600 text-xs mt-0.5">{v.size}</div></td>
                          <td className="px-4 py-3 text-brand-amber font-semibold">{fmt(v.price)}</td>
                          <td className="px-4 py-3 text-gray-600 font-mono text-xs">{v.ref}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="px-4 py-3 border-t border-white/5 flex justify-between text-xs text-gray-600">
                  <span>{filteredVendors.length} records</span>
                  <span>Total: {fmt(filteredVendors.reduce((s,v) => s+v.price, 0))}</span>
                </div>
              </div>
          }
        </div>
      )}

      {/* ── WAITLIST ────────────────────────────────────────────────── */}
      {tab === 'waitlist' && (
        <div>
          <div className="flex flex-wrap items-center justify-between gap-4 mb-5">
            <input type="text" placeholder="Search by name, email, tier, or ref…"
              value={wSearch} onChange={e => setWSearch(e.target.value)}
              className="flex-1 min-w-[220px] px-4 py-2.5 bg-brand-gray border border-white/10 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-brand-orange text-sm" />
            <button onClick={() => exportCSV('sneakers-fest-waitlist.csv',
              ['Reference','Name','Email','Phone','Tier','Position','Joined'],
              filteredWaitlist.map(w => [w.ref,w.name,w.email,w.phone||'',w.tier,w.position,fmtDate(w.joinedAt)]))}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-white/10 text-gray-300 text-sm hover:border-red-400 hover:text-red-400 transition-colors">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
              Export CSV
            </button>
          </div>
          {filteredWaitlist.length === 0
            ? <div className="text-center py-20"><p className="text-gray-600">{waitlist.length === 0 ? 'No waitlist sign-ups yet.' : 'No results.'}</p></div>
            : <div className="bg-brand-gray rounded-2xl border border-red-500/10 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead><tr className="border-b border-white/10">
                      {['Date Joined','Name','Email','Phone','Tier','Position','Reference'].map(h => (
                        <th key={h} className="text-left px-4 py-3 text-xs text-gray-500 uppercase tracking-wider font-medium">{h}</th>
                      ))}
                    </tr></thead>
                    <tbody>
                      {filteredWaitlist.map((w, i) => (
                        <tr key={w.ref} className={`border-b border-white/5 ${i%2===0?'':'bg-white/[0.02]'} hover:bg-red-500/5 transition-colors`}>
                          <td className="px-4 py-3 text-gray-500 text-xs whitespace-nowrap">{fmtDate(w.joinedAt)}</td>
                          <td className="px-4 py-3 text-white font-medium">{w.name}</td>
                          <td className="px-4 py-3 text-gray-400">{w.email}</td>
                          <td className="px-4 py-3 text-gray-500">{w.phone || <span className="text-gray-700">—</span>}</td>
                          <td className="px-4 py-3"><span className="px-2 py-0.5 rounded-full text-xs bg-red-500/15 text-red-400">{w.tier}</span></td>
                          <td className="px-4 py-3"><span className="text-white font-bold">#{w.position}</span></td>
                          <td className="px-4 py-3 text-gray-600 font-mono text-xs">{w.ref}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="px-4 py-3 border-t border-white/5 flex justify-between text-xs text-gray-600">
                  <span>{filteredWaitlist.length} entries</span>
                  <span>Across {Object.keys(stats.wByTier).length} tier{Object.keys(stats.wByTier).length !== 1 ? 's' : ''}</span>
                </div>
              </div>
          }
        </div>
      )}

      {/* ── RAFFLE ────────────────────────────────────────────────── */}
      {tab === 'raffle' && (
        <div className="space-y-6">

          {/* Pool stats */}
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
            {TICKET_TIERS.map(t => {
              const entries = poolStatsByTier[t.name] || 0
              return (
                <div key={t.id} className="bg-brand-gray rounded-2xl p-5 border border-white/5">
                  <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">{t.name}</p>
                  <p className="text-3xl font-bold text-white">{entries}</p>
                  <p className="text-xs text-gray-600 mt-1">{RAFFLE_PER_TIER[t.id]}x per pass</p>
                </div>
              )
            })}
            <div className="bg-brand-gray rounded-2xl p-5 border border-yellow-500/20">
              <p className="text-xs text-yellow-500 uppercase tracking-wider mb-1">Total Pool</p>
              <p className="text-3xl font-bold text-white">{totalPool}</p>
              <p className="text-xs text-gray-600 mt-1">{eligibleCount} still eligible</p>
            </div>
          </div>

          {/* Draw controls + winner card */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

            {/* Controls */}
            <div className="bg-brand-gray rounded-2xl p-6 border border-white/5">
              <h2 className="font-display text-lg text-white mb-1">DRAW A WINNER</h2>
              <p className="text-gray-500 text-sm mb-5">
                Pool is weighted — VIP has 3× the chance of General, VVIP and Phalanx 5×.
                Each attendee can win once.
              </p>
              <div className="mb-4">
                <label className="block text-xs text-gray-500 uppercase tracking-wider mb-1.5">Prize Name (optional)</label>
                <input type="text" placeholder="e.g. Jordan 1 Retro High OG"
                  value={prizeName} onChange={e => setPrizeName(e.target.value)}
                  className="w-full px-4 py-3 bg-brand-dark border border-white/10 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-yellow-500 text-sm" />
              </div>
              {eligibleCount === 0 && totalPool > 0 && (
                <p className="text-yellow-400 text-sm mb-4">
                  All attendees have won a prize. Reset draws to start over.
                </p>
              )}
              {totalPool === 0 && (
                <p className="text-gray-600 text-sm mb-4">No ticket sales yet — pool is empty.</p>
              )}
              <button
                onClick={drawWinner}
                disabled={eligibleCount === 0}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-yellow-500 to-amber-500 text-black font-bold text-lg hover:opacity-90 disabled:opacity-30 disabled:cursor-not-allowed transition-opacity">
                \u{1F3B2} Draw Winner
              </button>
              {draws.length > 0 && (
                <button
                  onClick={() => exportCSV('sneakers-fest-raffle-draws.csv',
                    ['Draw #','Prize','Winner','Email','Tier','Ref','Date','Claimed'],
                    [...draws].reverse().map((d, i) => [draws.length - i, d.prize, d.winner.name, d.winner.email, d.winner.tier, d.winner.ref, fmtDate(d.drawnAt), d.claimed ? 'Yes' : 'No']))}
                  className="w-full mt-3 py-2.5 rounded-xl border border-white/10 text-gray-400 text-sm hover:border-yellow-500/40 hover:text-yellow-400 transition-colors">
                  Export Draw History CSV
                </button>
              )}
            </div>

            {/* Winner card */}
            {currentWinner ? (
              <div className={`rounded-2xl p-6 border ${
                currentWinner.claimed
                  ? 'bg-brand-gray border-white/10'
                  : 'bg-brand-gray border-yellow-500/40 shadow-lg shadow-yellow-500/10'
              }`}>
                <div className="text-4xl mb-3">🏆</div>
                <p className="text-xs text-yellow-500 uppercase tracking-wider mb-1">Winner — {currentWinner.prize}</p>
                <h3 className="font-display text-2xl text-white mb-1">{currentWinner.winner.name.toUpperCase()}</h3>
                <p className="text-gray-400 text-sm mb-1">{currentWinner.winner.email}</p>
                <div className="flex items-center gap-2 mb-4">
                  <span className="px-2 py-0.5 rounded-full text-xs bg-yellow-500/20 text-yellow-400">{currentWinner.winner.tier}</span>
                  <span className="text-gray-600 text-xs">
                    {RAFFLE_PER_TIER[currentWinner.winner.tierId] * currentWinner.winner.quantity} raffle ticket{RAFFLE_PER_TIER[currentWinner.winner.tierId] * currentWinner.winner.quantity !== 1 ? 's' : ''}
                  </span>
                </div>
                <p className="text-gray-700 font-mono text-xs mb-5">{currentWinner.winner.ref}</p>
                <div className="flex gap-3 flex-wrap">
                  <button
                    onClick={() => toggleClaim(currentWinner.id)}
                    className={`flex-1 py-2.5 rounded-xl font-semibold text-sm transition-all ${
                      currentWinner.claimed
                        ? 'bg-green-500/20 border border-green-500/40 text-green-400'
                        : 'bg-yellow-500/10 border border-yellow-500/30 text-yellow-400 hover:bg-yellow-500/20'
                    }`}>
                    {currentWinner.claimed ? '✓ Prize Claimed' : 'Mark Claimed'}
                  </button>
                  <button
                    onClick={redraw}
                    disabled={eligibleCount === 0}
                    className="flex-1 py-2.5 rounded-xl border border-white/10 text-gray-400 text-sm hover:border-white/20 hover:text-gray-300 transition-colors disabled:opacity-30">
                    Redraw
                  </button>
                </div>
              </div>
            ) : (
              <div className="bg-brand-gray rounded-2xl p-6 border border-white/5 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-4xl mb-3 opacity-30">🎰</div>
                  <p className="text-gray-600 text-sm">Draw a winner to see the result here.</p>
                </div>
              </div>
            )}
          </div>

          {/* Draw history */}
          {draws.length > 0 && (
            <div className="bg-brand-gray rounded-2xl border border-white/5 overflow-hidden">
              <div className="px-6 py-4 border-b border-white/10">
                <h2 className="font-display text-lg text-white">DRAW HISTORY</h2>
                <p className="text-xs text-gray-500 mt-0.5">{draws.length} draw{draws.length !== 1 ? 's' : ''} · {draws.filter(d => d.claimed).length} claimed</p>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead><tr className="border-b border-white/10">
                    {['#','Prize','Winner','Tier','Raffle Tickets','Date','Status'].map(h => (
                      <th key={h} className="text-left px-4 py-3 text-xs text-gray-500 uppercase tracking-wider font-medium">{h}</th>
                    ))}
                  </tr></thead>
                  <tbody>
                    {[...draws].reverse().map((d, i) => (
                      <tr key={d.id} className={`border-b border-white/5 ${i%2===0?'':'bg-white/[0.02]'} hover:bg-yellow-500/5 transition-colors`}>
                        <td className="px-4 py-3 text-yellow-500 font-bold">#{draws.length - i}</td>
                        <td className="px-4 py-3 text-white font-medium">{d.prize}</td>
                        <td className="px-4 py-3">
                          <div className="text-gray-200">{d.winner.name}</div>
                          <div className="text-gray-600 text-xs">{d.winner.email}</div>
                        </td>
                        <td className="px-4 py-3"><span className="px-2 py-0.5 rounded-full text-xs bg-yellow-500/15 text-yellow-400">{d.winner.tier}</span></td>
                        <td className="px-4 py-3 text-gray-400 text-center">
                          {RAFFLE_PER_TIER[d.winner.tierId] * d.winner.quantity}
                        </td>
                        <td className="px-4 py-3 text-gray-500 text-xs whitespace-nowrap">{fmtDate(d.drawnAt)}</td>
                        <td className="px-4 py-3">
                          <button
                            onClick={() => toggleClaim(d.id)}
                            className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${
                              d.claimed
                                ? 'bg-green-500/20 text-green-400 hover:bg-green-500/30'
                                : 'bg-white/5 text-gray-500 hover:bg-white/10 hover:text-gray-300'
                            }`}>
                            {d.claimed ? '✓ Claimed' : 'Mark Claimed'}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Guaranteed prizes */}
          {guaranteedList.length > 0 && (
            <div className="bg-brand-gray rounded-2xl border border-white/5 overflow-hidden">
              <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between">
                <div>
                  <h2 className="font-display text-lg text-white">GUARANTEED PRIZES</h2>
                  <p className="text-xs text-gray-500 mt-0.5">VVIP and Phalanx attendees receive a guaranteed prize regardless of raffle outcome.</p>
                </div>
                <span className="text-xs text-gray-500">
                  {guaranteedClaims.length} / {guaranteedList.length} claimed
                </span>
              </div>
              <div className="divide-y divide-white/5">
                {guaranteedList.map(t => {
                  const claimed = guaranteedClaims.includes(t.ref)
                  return (
                    <div key={t.ref} className={`flex items-center justify-between px-6 py-4 ${
                      claimed ? 'opacity-50' : 'hover:bg-white/[0.02]'
                    } transition-opacity`}>
                      <div>
                        <p className="text-white font-medium">{t.name}</p>
                        <p className="text-gray-500 text-xs">{t.email} · <span className="text-yellow-400">{t.tier}</span> × {t.quantity}</p>
                        <p className="text-gray-700 font-mono text-xs mt-0.5">{t.ref}</p>
                      </div>
                      <button
                        onClick={() => toggleGuaranteedClaim(t.ref)}
                        className={`ml-4 px-4 py-2 rounded-xl text-sm font-semibold transition-all flex-shrink-0 ${
                          claimed
                            ? 'bg-green-500/20 border border-green-500/30 text-green-400'
                            : 'border border-white/10 text-gray-400 hover:border-yellow-500/30 hover:text-yellow-400'
                        }`}>
                        {claimed ? '✓ Claimed' : 'Mark Claimed'}
                      </button>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {totalPool === 0 && (
            <div className="text-center py-20">
              <p className="text-gray-600">No ticket sales yet — the raffle pool is empty.</p>
              <p className="text-gray-700 text-xs mt-2">Raffle entries are generated automatically from ticket purchases.</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
