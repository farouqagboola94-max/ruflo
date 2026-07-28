// POST /.netlify/functions/vendor-apply
// Body: { name|contact, email, phone?, businessName|business, boothType|booth,
//         category?, instagram?, twitter?, website?, deckUrl?, exclusiveDrop?, bio? }
// Stores application in Blobs + sends email to vendor and organiser.

import { createHash } from 'crypto'
import { ok, err, preflight, limitBody } from './lib/cors.js'
import { set, Vendors } from './lib/storage.js'
import { sendEmail, vendorEmail, notifyOrg, esc } from './lib/email.js'

export const handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') return preflight()
  if (event.httpMethod !== 'POST') return err(405, 'Method not allowed')

  const bodyErr = limitBody(event)
  if (bodyErr) return bodyErr

  let body
  try { body = JSON.parse(event.body || '{}') } catch { return err(400, 'Invalid JSON') }

  // Accept both naming conventions (frontend sends name/businessName/boothType)
  const contact      = (body.contact      || body.name         || '').trim()
  const business     = (body.business     || body.businessName || '').trim()
  const booth        = (body.booth        || body.boothType    || '').trim()
  const { email, phone, category, instagram, twitter, website, deckUrl, exclusiveDrop, bio } = body

  if (!business || !contact || !email) return err(400, 'business, contact, and email are required')
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return err(400, 'Invalid email address')
  if (contact.length > 120)  return err(400, 'Contact name too long (max 120)')
  if (business.length > 200) return err(400, 'Business name too long (max 200)')
  if (bio        && bio.length > 1000)          return err(400, 'Bio too long (max 1 000)')
  if (instagram  && instagram.length > 100)     return err(400, 'Instagram handle too long')
  if (twitter    && twitter.length > 100)       return err(400, 'Twitter handle too long')
  if (website    && website.length > 500)       return err(400, 'Website URL too long')
  if (booth      && booth.length > 100)         return err(400, 'Booth type too long')
  if (category   && category.length > 100)      return err(400, 'Category too long')
  if (exclusiveDrop && exclusiveDrop.length > 500) return err(400, 'Exclusive drop description too long')
  if (phone      && phone.length > 30)          return err(400, 'Phone number too long')

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
      `New vendor application: ${esc(business)} (${esc(applicationId)})`,
      `<h3>New Vendor Application</h3><ul>
        <li><strong>Business:</strong> ${esc(business)}</li>
        <li><strong>Contact:</strong> ${esc(contact)}</li>
        <li><strong>Email:</strong> ${esc(email)}</li>
        <li><strong>Category:</strong> ${esc(category || 'N/A')}</li>
        <li><strong>Booth:</strong> ${esc(booth || 'N/A')}</li>
        <li><strong>Instagram:</strong> ${esc(instagram || 'N/A')}</li>
        <li><strong>Twitter:</strong> ${esc(twitter || 'N/A')}</li>
        <li><strong>Website:</strong> ${esc(website || 'N/A')}</li>
        <li><strong>Exclusive Drop:</strong> ${esc(exclusiveDrop || 'N/A')}</li>
        <li><strong>Application ID:</strong> ${esc(applicationId)}</li>
      </ul>${bio ? `<p><strong>Bio:</strong> ${esc(bio)}</p>` : ''}`
    ),
  ])

  return ok({ success: true, applicationId })
}
