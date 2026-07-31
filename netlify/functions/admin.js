// GET /.netlify/functions/admin?resource=summary|tickets|pending|waitlist|vendors|newsletter
// Header: Authorization: Bearer <ADMIN_SECRET>
// Protected admin endpoint — returns live data from Netlify Blobs.

import { ok, err, preflight } from './lib/cors.js'
import { requireAdmin } from './lib/auth.js'
import { listAll, Tickets, Waitlist, Vendors, Newsletter, Contacts } from './lib/storage.js'

export const handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') return preflight()
  if (event.httpMethod !== 'GET') return err(405, 'Method not allowed')

  const denied = requireAdmin(event)
  if (denied) return denied

  const resource = event.queryStringParameters?.resource || 'summary'

  if (resource === 'tickets') {
    const all = await listAll(Tickets, 'ticket:')
    return ok({
      tickets:   all.sort((a, b) => b.confirmedAt?.localeCompare(a.confirmedAt)),
      total:     all.length,
      checkedIn: all.filter(t => t.checkedIn).length,
    })
  }

  if (resource === 'pending') {
    const all = await listAll(Tickets, 'pending:')
    return ok({
      pending: all.sort((a, b) => b.createdAt?.localeCompare(a.createdAt)),
      total:   all.length,
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

  if (resource === 'contacts') {
    const all = await listAll(Contacts)
    return ok({
      contacts: all.sort((a, b) => b.submittedAt?.localeCompare(a.submittedAt)),
      total:    all.length,
    })
  }

  // Default: summary dashboard
  const [tickets, waitlist, vendors, newsletter, contacts] = await Promise.all([
    listAll(Tickets, 'ticket:'),
    listAll(Waitlist),
    listAll(Vendors),
    listAll(Newsletter),
    listAll(Contacts),
  ])

  const revenue = tickets.reduce((sum, t) => sum + (t.amountNGN || 0), 0)

  const tierBreakdown = tickets.reduce((acc, t) => {
    if (!acc[t.tier]) acc[t.tier] = { count: 0, revenue: 0 }
    acc[t.tier].count   += 1
    acc[t.tier].revenue += t.amountNGN || 0
    return acc
  }, {})

  const pending = await listAll(Tickets, 'pending:')

  return ok({
    summary: {
      ticketsSold:      tickets.length,
      checkedIn:        tickets.filter(t => t.checkedIn).length,
      pendingPayments:  pending.length,
      revenueNGN:       revenue,
      revenueFormatted: `₦${revenue.toLocaleString()}`,
      tierBreakdown,
      waitlistSize:     waitlist.length,
      vendorApps:       vendors.length,
      pendingVendors:   vendors.filter(v => v.status === 'pending').length,
      approvedVendors:  vendors.filter(v => v.status === 'approved').length,
      subscribers:      newsletter.length,
      contactMessages:  contacts.length,
    },
  })
}
