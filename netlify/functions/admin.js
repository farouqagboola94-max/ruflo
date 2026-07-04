// GET /.netlify/functions/admin?resource=summary|tickets|waitlist|vendors|newsletter
// Header: Authorization: Bearer <ADMIN_SECRET>
// Protected admin endpoint — returns live data from Netlify Blobs.

import { ok, err, preflight } from './lib/cors.js'
import { listAll, Tickets, Waitlist, Vendors, Newsletter } from './lib/storage.js'

export const handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') return preflight()
  if (event.httpMethod !== 'GET') return err(405, 'Method not allowed')

  const adminSecret = process.env.ADMIN_SECRET
  if (!adminSecret || event.headers.authorization !== `Bearer ${adminSecret}`) {
    return err(401, 'Unauthorized — set Authorization: Bearer <ADMIN_SECRET>')
  }

  const resource = event.queryStringParameters?.resource || 'summary'

  if (resource === 'tickets') {
    const all = await listAll(Tickets, 'ticket:')
    return ok({
      tickets: all.sort((a, b) => b.confirmedAt?.localeCompare(a.confirmedAt)),
      total:   all.length,
      checkedIn: all.filter(t => t.checkedIn).length,
    })
  }

  if (resource === 'waitlist') {
    const all = await listAll(Waitlist)
    return ok({ waitlist: all.sort((a, b) => a.position - b.position), total: all.length })
  }

  if (resource === 'vendors') {
    const all = await listAll(Vendors)
    return ok({
      vendors: all.sort((a, b) => b.submittedAt?.localeCompare(a.submittedAt)),
      total:   all.length,
      pending: all.filter(v => v.status === 'pending').length,
    })
  }

  if (resource === 'newsletter') {
    const all = await listAll(Newsletter)
    return ok({ subscribers: all, total: all.length })
  }

  // Default: summary dashboard
  const [tickets, waitlist, vendors, newsletter] = await Promise.all([
    listAll(Tickets, 'ticket:'),
    listAll(Waitlist),
    listAll(Vendors),
    listAll(Newsletter),
  ])

  const revenue = tickets.reduce((sum, t) => sum + (t.amountNGN || 0), 0)
  const tierBreakdown = tickets.reduce((acc, t) => {
    acc[t.tier] = (acc[t.tier] || 0) + 1
    return acc
  }, {})

  return ok({
    summary: {
      ticketsSold:  tickets.length,
      checkedIn:    tickets.filter(t => t.checkedIn).length,
      revenueNGN:   revenue,
      revenueFormatted: `₦${revenue.toLocaleString()}`,
      tierBreakdown,
      waitlistSize: waitlist.length,
      vendorApps:   vendors.length,
      pendingVendors: vendors.filter(v => v.status === 'pending').length,
      subscribers:  newsletter.length,
    },
  })
}
