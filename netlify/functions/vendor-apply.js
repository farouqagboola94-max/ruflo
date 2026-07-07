// POST /.netlify/functions/vendor-apply
// Body: { name|contact, email, phone?, businessName|business, boothType|booth,
//         category?, instagram?, twitter?, website?, deckUrl?, exclusiveDrop?, bio? }
// Stores application in Blobs + sends email to vendor and organiser.

import { createHash } from 'crypto'
import { ok, err, preflight } from './lib/cors.js'
import { set, Vendors } from './lib/storage.js'
import { sendEmail, vendorEmail, notifyOrg } from './lib/email.js'

export const handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') return preflight()
  if (event.httpMethod !== 'POST') return err(405, 'Method not allowed')

  let body
  try { body = JSON.parse(event.body || '{}') } catch { return err(400, 'Invalid JSON') }

  // Accept both naming conventions (frontend sends name/businessName/boothType)
  const contact      = (body.contact      || body.name         || '').trim()
  const business     = (body.business     || body.businessName || '').trim()
  const booth        = (body.booth        || body.boothType    || '').trim()
  const { email, phone, category, instagram, twitter, website, deckUrl, exclusiveDrop, bio } = body

  if (!business || !contact || !email) return err(400, 'business, contact, and email are required')
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return err(400, 'Invalid email address')
  if (business.length > 200 || (bio && bio.length > 1000)) return err(400, 'Input too long')

  const applicationId = 'VDR-' +
    createHash('sha256').update(email.toLowerCase() + business).digest('hex').slice(0, 8).toUpperCase()

  const record = {
    applicationId,
    status:        'pending',
    business,
    contact,
    email:         email.toLowerCase().trim(),
    phone:         (phone         || '').trim(),
    category:      (category      || '').trim(),
    booth,
    instagram:     (instagram     || '').trim(),
    twitter:       (twitter       || '').trim(),
    website:       (website       || '').trim(),
    deckUrl:       (deckUrl       || '').trim(),
    exclusiveDrop: (exclusiveDrop || '').trim(),
    bio:           (bio           || '').trim(),
    submittedAt:   new Date().toISOString(),
  }

  await set(Vendors, applicationId, record)

  await Promise.all([
    sendEmail({
      to: email,
      subject: `Sneakers Fest '26 — Vendor Application Received (${applicationId})`,
      html: vendorEmail({ business, applicationId, contact }),
    }),
    notifyOrg(
      `New vendor application: ${business} (${applicationId})`,
      `<h3>New Vendor Application</h3><ul>
        <li><strong>Business:</strong> ${business}</li>
        <li><strong>Contact:</strong> ${contact}</li>
        <li><strong>Email:</strong> ${email}</li>
        <li><strong>Category:</strong> ${category || 'N/A'}</li>
        <li><strong>Booth:</strong> ${booth || 'N/A'}</li>
        <li><strong>Instagram:</strong> ${instagram || 'N/A'}</li>
        <li><strong>Twitter:</strong> ${twitter || 'N/A'}</li>
        <li><strong>Website:</strong> ${website || 'N/A'}</li>
        <li><strong>Exclusive Drop:</strong> ${exclusiveDrop || 'N/A'}</li>
        <li><strong>Application ID:</strong> ${applicationId}</li>
      </ul>${bio ? `<p><strong>Bio:</strong> ${bio}</p>` : ''}`
    ),
  ])

  return ok({ success: true, applicationId })
}
