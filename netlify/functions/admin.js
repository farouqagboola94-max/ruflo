// GET /.netlify/functions/admin?resource=summary|tickets|pending|waitlist|vendors|newsletter
// Header: Authorization: Bearer <ADMIN_SECRET>
// Protected admin endpoint — returns live data from Netlify Blobs.

import { ok, err, preflight } from './lib/cors.js'
import { requireAdmin } from './lib/auth.js'
import { listAll, Tickets, Waitlist, Vendors, Newsletter, Contacts } from './lib/storage.js'
import { getStore } from '@netlify/blobs'
import { publicGroup } from './lib/group-domain.js'

// Stores added alongside the crew, group and protocol features. Without these
// the organiser cannot see who has paid into a group, who is in a crew, who
// turned up on a Friday, or what is queued for moderation.
const Store = name => getStore({ name, consistency: 'strong' })

async function readAll(storeName, prefix) {
  const store = Store(storeName)
  const list = await store.list().catch(() => ({ blobs: [] }))
  const keys = (list.blobs || [])
    .map(b => b.key)
    .filter(k => (prefix ? k.startsWith(prefix) : !k.startsWith('_')))
  const items = await Promise.all(keys.map(k => store.get(k, { type: 'json' }).catch(() => null)))
  return items.filter(Boolean)
}

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

  if (resource === 'crews') {
    const all = await readAll('sf26-crews', 'crew:')
    return ok({
      crews: all
        .map(c => ({ ...c, memberCount: (c.members || []).length }))
        .sort((a, b) => b.memberCount - a.memberCount),
      total: all.length,
      members: all.reduce((n, c) => n + (c.members || []).length, 0),
    })
  }

  if (resource === 'groups') {
    const now = new Date().toISOString()
    const all = await readAll('sf26-groups', 'group:')
    return ok({
      // Full view for the organiser, including who has paid and who is only
      // holding a slot. Emails stay out: publicGroup is the projection the
      // rest of the system already trusts.
      groups: all
        .map(g => ({
          ...publicGroup(g, now),
          claimed: (g.claims || []).length,
        }))
        .sort((a, b) => String(b.createdAt).localeCompare(String(a.createdAt))),
      total: all.length,
      seatsPaid: all.reduce((n, g) => n + (g.claims || []).filter(c => c.paid).length, 0),
    })
  }

  if (resource === 'fnp') {
    const all = await readAll('sf26-fnp', 'session:')
    return ok({
      sessions: all.sort((a, b) => String(b.sessionId).localeCompare(String(a.sessionId))),
      total: all.length,
      totalCheckIns: all.reduce((n, s) => n + (s.count || 0), 0),
    })
  }

  if (resource === 'confessions') {
    const all = await readAll('sf26-confessions', 'SC26-')
    const sorted = all.sort((a, b) => String(b.submittedAt).localeCompare(String(a.submittedAt)))
    return ok({
      // Pending first: this list exists to be worked through.
      pending:  sorted.filter(c => !c.approved && !c.moderatedAt),
      approved: sorted.filter(c => c.approved),
      rejected: sorted.filter(c => !c.approved && c.moderatedAt),
      total: all.length,
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

  const [crews, groups, fnpSessions, confessions] = await Promise.all([
    readAll('sf26-crews', 'crew:'),
    readAll('sf26-groups', 'group:'),
    readAll('sf26-fnp', 'session:'),
    readAll('sf26-confessions', 'SC26-'),
  ])

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
      crews:            crews.length,
      crewMembers:      crews.reduce((n, c) => n + (c.members || []).length, 0),
      groups:           groups.length,
      groupSeatsPaid:   groups.reduce((n, g) => n + (g.claims || []).filter(c => c.paid).length, 0),
      fnpSessions:      fnpSessions.length,
      fnpCheckIns:      fnpSessions.reduce((n, s) => n + (s.count || 0), 0),
      confessionsPending: confessions.filter(c => !c.approved && !c.moderatedAt).length,
    },
  })
}
