'use client'

import { useState, useEffect, useMemo } from 'react'

const ADMIN_PIN = process.env.NEXT_PUBLIC_ADMIN_PIN || 'sf-admin-2026'
const SESSION_KEY = 'sf_admin_session'

type TicketRecord = {
  ref: string; name: string; email: string; phone: string
  tier: string; tierId: string; quantity: number; total: number; purchasedAt: string
}
type VendorRecord = {
  ref: string; email: string; businessName: string; contactName: string
  phone: string; instagram: string; category: string; tier: string
  tierId: string; size: string; price: number; registeredAt: string
}

type Tab = 'overview' | 'tickets' | 'vendors'

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
  return new Date(iso).toLocaleDateString('en-NG', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })
}

export default function AdminPage() {
  const [authed, setAuthed]   = useState(false)
  const [pin, setPin]         = useState('')
  const [error, setError]     = useState('')
  const [tab, setTab]         = useState<Tab>('overview')
  const [tickets, setTickets] = useState<TicketRecord[]>([])
  const [vendors, setVendors] = useState<VendorRecord[]>([])
  const [tSearch, setTSearch] = useState('')
  const [vSearch, setVSearch] = useState('')

  // Check for existing admin session
  useEffect(() => {
    try {
      if (localStorage.getItem(SESSION_KEY) === 'true') setAuthed(true)
    } catch {}
  }, [])

  // Load data once authenticated
  useEffect(() => {
    if (!authed) return
    try {
      setTickets(JSON.parse(localStorage.getItem('sf_tickets') || '[]'))
      setVendors(JSON.parse(localStorage.getItem('sf_vendors')  || '[]'))
    } catch {}
  }, [authed])

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    if (pin === ADMIN_PIN) {
      try { localStorage.setItem(SESSION_KEY, 'true') } catch {}
      setAuthed(true)
    } else {
      setError('Incorrect PIN. Try again.')
      setPin('')
    }
  }

  const logout = () => {
    try { localStorage.removeItem(SESSION_KEY) } catch {}
    setAuthed(false); setPin('')
  }

  // Aggregated stats
  const stats = useMemo(() => {
    const ticketRevenue  = tickets.reduce((s, t) => s + t.total, 0)
    const vendorRevenue  = vendors.reduce((s, v) => s + v.price, 0)
    const totalRevenue   = ticketRevenue + vendorRevenue
    const ticketsSold    = tickets.reduce((s, t) => s + t.quantity, 0)
    const avgTicketValue = tickets.length ? Math.round(ticketRevenue / tickets.length) : 0

    const byTier = tickets.reduce<Record<string, { count: number; qty: number; revenue: number }>>((acc, t) => {
      if (!acc[t.tier]) acc[t.tier] = { count: 0, qty: 0, revenue: 0 }
      acc[t.tier].count++
      acc[t.tier].qty     += t.quantity
      acc[t.tier].revenue += t.total
      return acc
    }, {})

    const byBooth = vendors.reduce<Record<string, { count: number; revenue: number }>>((acc, v) => {
      if (!acc[v.tier]) acc[v.tier] = { count: 0, revenue: 0 }
      acc[v.tier].count++
      acc[v.tier].revenue += v.price
      return acc
    }, {})

    return { ticketRevenue, vendorRevenue, totalRevenue, ticketsSold, avgTicketValue, byTier, byBooth }
  }, [tickets, vendors])

  // Filtered tables
  const filteredTickets = useMemo(() => {
    const q = tSearch.toLowerCase()
    return tickets.filter(t =>
      t.name.toLowerCase().includes(q) ||
      t.email.toLowerCase().includes(q) ||
      t.tier.toLowerCase().includes(q)  ||
      t.ref.toLowerCase().includes(q)
    ).sort((a, b) => b.purchasedAt.localeCompare(a.purchasedAt))
  }, [tickets, tSearch])

  const filteredVendors = useMemo(() => {
    const q = vSearch.toLowerCase()
    return vendors.filter(v =>
      v.businessName.toLowerCase().includes(q) ||
      v.email.toLowerCase().includes(q)        ||
      v.category.toLowerCase().includes(q)     ||
      v.tier.toLowerCase().includes(q)         ||
      v.ref.toLowerCase().includes(q)
    ).sort((a, b) => b.registeredAt.localeCompare(a.registeredAt))
  }, [vendors, vSearch])

  const maxTierRevenue = Math.max(...Object.values(stats.byTier).map(t => t.revenue), 1)
  const maxBoothRevenue = Math.max(...Object.values(stats.byBooth).map(b => b.revenue), 1)

  // ── Login screen ────────────────────────────────────────────────────────────
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
                <input
                  type="password" required autoFocus
                  placeholder="Enter PIN"
                  value={pin} onChange={e => { setPin(e.target.value); setError('') }}
                  className="w-full px-4 py-3 bg-brand-dark border border-white/10 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-brand-orange text-sm tracking-widest"
                />
              </div>
              {error && <p className="text-red-400 text-xs">{error}</p>}
              <button type="submit"
                className="w-full py-3 rounded-xl bg-gradient-to-r from-brand-orange to-brand-amber text-black font-bold hover:opacity-90 transition-opacity">
                Access Dashboard
              </button>
            </form>
          </div>
          <p className="text-center mt-4 text-gray-700 text-xs">
            Set PIN via NEXT_PUBLIC_ADMIN_PIN env var
          </p>
        </div>
      </div>
    )
  }

  // ── Dashboard ───────────────────────────────────────────────────────────────
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

      {/* Header */}
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
      <div className="flex gap-2 mb-8 border-b border-white/10 pb-0">
        {(['overview', 'tickets', 'vendors'] as Tab[]).map(t => (
          <button key={t} onClick={() => setTab(t)}
            className={`px-5 py-2.5 text-sm font-semibold capitalize rounded-t-lg transition-colors border-b-2 ${
              tab === t ? 'text-brand-orange border-brand-orange' : 'text-gray-500 border-transparent hover:text-gray-300'
            }`}>
            {t}
            {t === 'tickets' && tickets.length > 0 && (
              <span className="ml-2 px-1.5 py-0.5 text-xs rounded-full bg-brand-orange/20 text-brand-orange">{tickets.length}</span>
            )}
            {t === 'vendors' && vendors.length > 0 && (
              <span className="ml-2 px-1.5 py-0.5 text-xs rounded-full bg-brand-orange/20 text-brand-orange">{vendors.length}</span>
            )}
          </button>
        ))}
      </div>

      {/* ── OVERVIEW TAB ──────────────────────────────────────────────────── */}
      {tab === 'overview' && (
        <div className="space-y-6">
          {/* Stat cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: 'Total Revenue',      value: fmt(stats.totalRevenue),   sub: 'tickets + booths' },
              { label: 'Tickets Sold',        value: stats.ticketsSold,          sub: `${tickets.length} transactions` },
              { label: 'Vendor Registrations',value: vendors.length,             sub: fmt(stats.vendorRevenue) + ' booth revenue' },
              { label: 'Avg Ticket Value',    value: fmt(stats.avgTicketValue),  sub: 'per transaction' },
            ].map(({ label, value, sub }) => (
              <div key={label} className="bg-brand-gray rounded-2xl p-5 border border-white/5">
                <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">{label}</p>
                <p className="text-3xl font-bold text-white">{value}</p>
                <p className="text-xs text-gray-600 mt-1">{sub}</p>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Ticket revenue by tier */}
            <div className="bg-brand-gray rounded-2xl p-6 border border-white/5">
              <h2 className="font-display text-lg text-white mb-5">TICKET REVENUE BY TIER</h2>
              {Object.keys(stats.byTier).length === 0 ? (
                <p className="text-gray-600 text-sm">No ticket sales yet.</p>
              ) : (
                <div className="space-y-4">
                  {Object.entries(stats.byTier).map(([tier, data]) => (
                    <div key={tier}>
                      <div className="flex justify-between text-sm mb-1.5">
                        <span className="text-gray-300 font-medium">{tier}</span>
                        <span className="text-gray-500">{data.qty} tickets · {fmt(data.revenue)}</span>
                      </div>
                      <div className="h-2 rounded-full bg-brand-dark overflow-hidden">
                        <div className="h-full rounded-full bg-gradient-to-r from-brand-orange to-brand-amber transition-all"
                          style={{ width: `${(data.revenue / maxTierRevenue) * 100}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Booth revenue by tier */}
            <div className="bg-brand-gray rounded-2xl p-6 border border-white/5">
              <h2 className="font-display text-lg text-white mb-5">BOOTH REVENUE BY TYPE</h2>
              {Object.keys(stats.byBooth).length === 0 ? (
                <p className="text-gray-600 text-sm">No vendor registrations yet.</p>
              ) : (
                <div className="space-y-4">
                  {Object.entries(stats.byBooth).map(([tier, data]) => (
                    <div key={tier}>
                      <div className="flex justify-between text-sm mb-1.5">
                        <span className="text-gray-300 font-medium">{tier} Booth</span>
                        <span className="text-gray-500">{data.count} registered · {fmt(data.revenue)}</span>
                      </div>
                      <div className="h-2 rounded-full bg-brand-dark overflow-hidden">
                        <div className="h-full rounded-full bg-gradient-to-r from-yellow-500 to-amber-600 transition-all"
                          style={{ width: `${(data.revenue / maxBoothRevenue) * 100}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Revenue split */}
          <div className="bg-brand-gray rounded-2xl p-6 border border-white/5">
            <h2 className="font-display text-lg text-white mb-4">REVENUE SPLIT</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
              {[
                { label: 'Ticket Sales',    value: fmt(stats.ticketRevenue),  pct: stats.totalRevenue ? Math.round((stats.ticketRevenue / stats.totalRevenue) * 100) : 0, color: 'text-brand-orange' },
                { label: 'Booth Fees',      value: fmt(stats.vendorRevenue),  pct: stats.totalRevenue ? Math.round((stats.vendorRevenue  / stats.totalRevenue) * 100) : 0, color: 'text-brand-amber' },
                { label: 'Combined Total',  value: fmt(stats.totalRevenue),   pct: 100, color: 'text-white' },
              ].map(({ label, value, pct, color }) => (
                <div key={label} className="bg-brand-dark rounded-xl p-4 border border-white/5">
                  <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">{label}</p>
                  <p className={`text-2xl font-bold ${color}`}>{value}</p>
                  <p className="text-xs text-gray-600 mt-0.5">{pct}% of total</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── TICKETS TAB ───────────────────────────────────────────────────── */}
      {tab === 'tickets' && (
        <div>
          <div className="flex flex-wrap items-center justify-between gap-4 mb-5">
            <input
              type="text" placeholder="Search by name, email, tier, or ref…"
              value={tSearch} onChange={e => setTSearch(e.target.value)}
              className="flex-1 min-w-[220px] px-4 py-2.5 bg-brand-gray border border-white/10 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-brand-orange text-sm"
            />
            <button
              onClick={() => exportCSV(
                'sneakers-fest-tickets.csv',
                ['Reference', 'Name', 'Email', 'Phone', 'Tier', 'Quantity', 'Total (₦)', 'Date'],
                filteredTickets.map(t => [t.ref, t.name, t.email, t.phone, t.tier, t.quantity, t.total, fmtDate(t.purchasedAt)])
              )}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-white/10 text-gray-300 text-sm hover:border-brand-orange hover:text-brand-orange transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Export CSV
            </button>
          </div>

          {filteredTickets.length === 0 ? (
            <div className="text-center py-20 text-gray-600">
              {tickets.length === 0 ? 'No ticket sales recorded on this device yet.' : 'No results match your search.'}
            </div>
          ) : (
            <div className="bg-brand-gray rounded-2xl border border-white/5 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-white/10">
                      {['Date', 'Name', 'Email', 'Tier', 'Qty', 'Total', 'Reference'].map(h => (
                        <th key={h} className="text-left px-4 py-3 text-xs text-gray-500 uppercase tracking-wider font-medium">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {filteredTickets.map((t, i) => (
                      <tr key={t.ref} className={`border-b border-white/5 ${
                        i % 2 === 0 ? '' : 'bg-white/[0.02]'
                      } hover:bg-brand-orange/5 transition-colors`}>
                        <td className="px-4 py-3 text-gray-500 text-xs whitespace-nowrap">{fmtDate(t.purchasedAt)}</td>
                        <td className="px-4 py-3 text-white font-medium">{t.name}</td>
                        <td className="px-4 py-3 text-gray-400">{t.email}</td>
                        <td className="px-4 py-3">
                          <span className="px-2 py-0.5 rounded-full text-xs bg-brand-orange/15 text-brand-orange">{t.tier}</span>
                        </td>
                        <td className="px-4 py-3 text-gray-300 text-center">{t.quantity}</td>
                        <td className="px-4 py-3 text-brand-amber font-semibold">{fmt(t.total)}</td>
                        <td className="px-4 py-3 text-gray-600 font-mono text-xs">{t.ref}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="px-4 py-3 border-t border-white/5 flex justify-between text-xs text-gray-600">
                <span>{filteredTickets.length} record{filteredTickets.length !== 1 ? 's' : ''}</span>
                <span>Total: {fmt(filteredTickets.reduce((s, t) => s + t.total, 0))}</span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ── VENDORS TAB ───────────────────────────────────────────────────── */}
      {tab === 'vendors' && (
        <div>
          <div className="flex flex-wrap items-center justify-between gap-4 mb-5">
            <input
              type="text" placeholder="Search by brand, email, category, or ref…"
              value={vSearch} onChange={e => setVSearch(e.target.value)}
              className="flex-1 min-w-[220px] px-4 py-2.5 bg-brand-gray border border-white/10 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-brand-orange text-sm"
            />
            <button
              onClick={() => exportCSV(
                'sneakers-fest-vendors.csv',
                ['Reference', 'Business', 'Contact', 'Email', 'Phone', 'Instagram', 'Category', 'Booth', 'Size', 'Paid (₦)', 'Registered'],
                filteredVendors.map(v => [v.ref, v.businessName, v.contactName, v.email, v.phone, v.instagram, v.category, v.tier, v.size, v.price, fmtDate(v.registeredAt)])
              )}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-white/10 text-gray-300 text-sm hover:border-brand-orange hover:text-brand-orange transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Export CSV
            </button>
          </div>

          {filteredVendors.length === 0 ? (
            <div className="text-center py-20 text-gray-600">
              {vendors.length === 0 ? 'No vendor registrations recorded on this device yet.' : 'No results match your search.'}
            </div>
          ) : (
            <div className="bg-brand-gray rounded-2xl border border-white/5 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-white/10">
                      {['Date', 'Business', 'Contact', 'Category', 'Booth', 'Paid', 'Reference'].map(h => (
                        <th key={h} className="text-left px-4 py-3 text-xs text-gray-500 uppercase tracking-wider font-medium">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {filteredVendors.map((v, i) => (
                      <tr key={v.ref} className={`border-b border-white/5 ${
                        i % 2 === 0 ? '' : 'bg-white/[0.02]'
                      } hover:bg-brand-orange/5 transition-colors`}>
                        <td className="px-4 py-3 text-gray-500 text-xs whitespace-nowrap">{fmtDate(v.registeredAt)}</td>
                        <td className="px-4 py-3">
                          <div className="text-white font-medium">{v.businessName}</div>
                          {v.instagram && <div className="text-gray-600 text-xs">{v.instagram}</div>}
                        </td>
                        <td className="px-4 py-3">
                          <div className="text-gray-300">{v.contactName}</div>
                          <div className="text-gray-600 text-xs">{v.email}</div>
                        </td>
                        <td className="px-4 py-3 text-gray-400 text-xs">{v.category}</td>
                        <td className="px-4 py-3">
                          <span className="px-2 py-0.5 rounded-full text-xs bg-brand-amber/15 text-brand-amber">{v.tier}</span>
                          <div className="text-gray-600 text-xs mt-0.5">{v.size}</div>
                        </td>
                        <td className="px-4 py-3 text-brand-amber font-semibold">{fmt(v.price)}</td>
                        <td className="px-4 py-3 text-gray-600 font-mono text-xs">{v.ref}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="px-4 py-3 border-t border-white/5 flex justify-between text-xs text-gray-600">
                <span>{filteredVendors.length} record{filteredVendors.length !== 1 ? 's' : ''}</span>
                <span>Total: {fmt(filteredVendors.reduce((s, v) => s + v.price, 0))}</span>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
