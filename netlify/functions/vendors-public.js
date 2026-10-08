// GET /.netlify/functions/vendors-public
//
// The confirmed vendor line-up. Applications are already approved or rejected
// through vendor-status; this is the read side that was missing, so "30+
// vendors" can finally be shown rather than asserted.
//
// Approved records only, and a deliberately narrow projection: a vendor gave
// their email and phone to apply, not to have them published.

import { ok, err, preflight } from './lib/cors.js'
import { listAll, Vendors } from './lib/storage.js'

export const handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') return preflight()
  if (event.httpMethod !== 'GET') return err(405, 'Method not allowed')

  const all = await listAll(Vendors)
  const approved = all.filter(v => v && v.status === 'approved')

  const vendors = approved
    .map(v => ({
      id: v.applicationId,
      business: v.business,
      category: v.category || 'Other',
      booth: v.booth || null,
      instagram: v.instagram || null,
      website: v.website || null,
      // The pitch a vendor wrote for their own listing, trimmed for the grid.
      bio: (v.bio || '').slice(0, 240),
      exclusiveDrop: v.exclusiveDrop || null,
    }))
    .sort((a, b) => a.business.localeCompare(b.business))

  const categories = [...new Set(vendors.map(v => v.category))].sort()

  return ok({
    vendors,
    total: vendors.length,
    categories,
    withExclusive: vendors.filter(v => v.exclusiveDrop).length,
  })
}
