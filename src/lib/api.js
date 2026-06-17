const BACKEND = import.meta.env.VITE_BACKEND_URL || ''

async function apiGet(path, lsKey, fallback = []) {
  if (BACKEND) {
    try {
      const r = await fetch(`${BACKEND}${path}`, { headers: { Accept: 'application/json' } })
      if (r.ok) return r.json()
    } catch {}
  }
  try { return JSON.parse(localStorage.getItem(lsKey) ?? JSON.stringify(fallback)) } catch { return fallback }
}

async function apiPost(path, body, lsKey, maxItems = 200) {
  let serverData = null
  if (BACKEND) {
    try {
      const r = await fetch(`${BACKEND}${path}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
      if (r.ok) serverData = await r.json()
    } catch {}
  }
  try {
    const existing = JSON.parse(localStorage.getItem(lsKey) ?? '[]')
    localStorage.setItem(lsKey, JSON.stringify([body, ...existing].slice(0, maxItems)))
  } catch {}
  return serverData ?? body
}

async function apiPatch(path, id, data, lsKey, idField = 'id') {
  if (BACKEND) {
    try {
      const r = await fetch(`${BACKEND}${path}/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      if (r.ok) return r.json()
    } catch {}
  }
  try {
    const existing = JSON.parse(localStorage.getItem(lsKey) ?? '[]')
    const updated = existing.map(item => item[idField] === id ? { ...item, ...data } : item)
    localStorage.setItem(lsKey, JSON.stringify(updated))
    return updated.find(item => item[idField] === id) ?? { ...data, [idField]: id }
  } catch { return { ...data, [idField]: id } }
}

async function apiDel(path, id, lsKey, idField = 'id') {
  if (BACKEND) {
    try { await fetch(`${BACKEND}${path}/${id}`, { method: 'DELETE' }) } catch {}
  }
  try {
    const existing = JSON.parse(localStorage.getItem(lsKey) ?? '[]')
    localStorage.setItem(lsKey, JSON.stringify(existing.filter(item => item[idField] !== id)))
  } catch {}
}

// CommunityWall posts  (localStorage key: sf26_wall_posts)
export const wallApi = {
  getPosts:   ()         => apiGet('/api/wall', 'sf26_wall_posts', []),
  addPost:    (post)     => apiPost('/api/wall', post, 'sf26_wall_posts'),
  deletePost: (id)       => apiDel('/api/wall', id, 'sf26_wall_posts'),
}

// TradeBoard listings  (localStorage key: sf26_trades)
export const tradesApi = {
  getAll:  ()           => apiGet('/api/trades', 'sf26_trades', []),
  add:     (trade)      => apiPost('/api/trades', trade, 'sf26_trades'),
  update:  (id, data)   => apiPatch('/api/trades', id, data, 'sf26_trades'),
  remove:  (id)         => apiDel('/api/trades', id, 'sf26_trades'),
}

// Leaderboard  (localStorage key: sf26_leaderboard)
export const leaderboardApi = {
  getAll: () => apiGet('/api/leaderboard', 'sf26_leaderboard', []),
  async upsert(entry) {
    if (BACKEND) {
      try {
        const r = await fetch(`${BACKEND}/api/leaderboard`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(entry),
        })
        if (r.ok) return r.json()
      } catch {}
    }
    try {
      const existing = JSON.parse(localStorage.getItem('sf26_leaderboard') ?? '[]')
      const idx = existing.findIndex(e => e.id === entry.id)
      if (idx >= 0) existing[idx] = { ...existing[idx], ...entry }
      else existing.push(entry)
      existing.sort((a, b) => (b.xp ?? 0) - (a.xp ?? 0))
      localStorage.setItem('sf26_leaderboard', JSON.stringify(existing.slice(0, 100)))
      return entry
    } catch { return entry }
  },
}

// Newsletter subscribers  (localStorage key: sf26_subscribers)
export const newsletterApi = {
  subscribe: (data) => apiPost('/api/newsletter', data, 'sf26_subscribers'),
}

// Ticket orders  (localStorage key: sf26_orders)
export const ordersApi = {
  getAll: ()      => apiGet('/api/orders', 'sf26_orders', []),
  add:    (order) => apiPost('/api/orders', order, 'sf26_orders', 50),
}

// Vendor applications  (localStorage key: sf26_vendor_apps)
export const vendorApi = {
  getAll: ()    => apiGet('/api/vendor-applications', 'sf26_vendor_apps', []),
  add:    (app) => apiPost('/api/vendor-applications', app, 'sf26_vendor_apps', 100),
}

// Raffle entries  (localStorage key: sf26_raffle_entries)
export const raffleApi = {
  getAll: ()      => apiGet('/api/raffle', 'sf26_raffle_entries', []),
  enter:  (entry) => apiPost('/api/raffle', entry, 'sf26_raffle_entries'),
}

// Sponsor enquiries  (localStorage key: sf26_sponsor_enquiries)
export const sponsorApi = {
  enquire: (data) => apiPost('/api/sponsor-enquiry', data, 'sf26_sponsor_enquiries'),
}
