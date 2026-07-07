// POST /.netlify/functions/vendor-status
// Header: Authorization: Bearer <ADMIN_SECRET>
// Body: { applicationId, action: 'approve' | 'reject', notes? }
// Updates a vendor application status and notifies the vendor.

import { ok, err, preflight } from './lib/cors.js'
import { get, set, Vendors } from './lib/storage.js'
import { sendEmail } from './lib/email.js'

const esc = (s) =>
  String(s || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')

export const handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') return preflight()
  if (event.httpMethod !== 'POST') return err(405, 'Method not allowed')

  const adminSecret = process.env.ADMIN_SECRET
  if (!adminSecret || event.headers.authorization !== `Bearer ${adminSecret}`) {
    return err(401, 'Unauthorized — set Authorization: Bearer <ADMIN_SECRET>')
  }

  let body
  try { body = JSON.parse(event.body || '{}') } catch { return err(400, 'Invalid JSON') }

  const { applicationId, action, notes } = body
  if (!applicationId) return err(400, 'applicationId is required')
  if (action !== 'approve' && action !== 'reject') return err(400, "action must be 'approve' or 'reject'")

  const vendor = await get(Vendors, applicationId)
  if (!vendor) return err(404, `No vendor application found for ID: ${applicationId}`)

  const updatedAt = new Date().toISOString()
  const updated = {
    ...vendor,
    status:    action === 'approve' ? 'approved' : 'rejected',
    notes:     (notes || '').trim(),
    updatedAt,
  }

  await set(Vendors, applicationId, updated)

  if (vendor.email) {
    const subject = action === 'approve'
      ? `Sneakers Fest '26 — Vendor Application Approved! (${applicationId})`
      : `Sneakers Fest '26 — Vendor Application Update (${applicationId})`

    const html = action === 'approve'
      ? `<div style="font-family:'Syne',sans-serif;max-width:600px;margin:0 auto;background:#0a0a0a;color:#e8e8e8;padding:40px 32px;border-radius:12px;border:1px solid #1a1a1a">
          <div style="font-family:'Bebas Neue',sans-serif;font-size:32px;color:#F5A623;letter-spacing:3px;margin-bottom:4px">SNEAKERS FEST '26</div>
          <div style="font-size:11px;color:#444;letter-spacing:4px;margin-bottom:32px;font-family:'Space Mono',monospace">THE SOLE EXHIBITION · LAGOS</div>
          <h2 style="color:#7CFF6B;font-size:22px;margin-bottom:16px">🎉 Your Application is Approved!</h2>
          <p>Hi ${esc(vendor.contact)},</p>
          <p>Congratulations — <strong>${esc(vendor.business)}</strong> has been approved as a vendor for Sneakers Fest '26!</p>
          ${notes ? `<div style="background:#7CFF6B18;border-left:3px solid #7CFF6B;padding:12px 16px;border-radius:4px;margin:20px 0"><p style="color:#7CFF6B;font-size:13px;margin:0">${esc(notes)}</p></div>` : ''}
          <p>Our team will reach out with booth assignment details and setup instructions closer to the event.</p>
          <p style="font-family:'Space Mono',monospace;font-size:11px;color:#555">Application ID: ${esc(applicationId)} · Dec 12, 2026 · Victoria Island, Lagos</p>
        </div>`
      : `<div style="font-family:'Syne',sans-serif;max-width:600px;margin:0 auto;background:#0a0a0a;color:#e8e8e8;padding:40px 32px;border-radius:12px;border:1px solid #1a1a1a">
          <div style="font-family:'Bebas Neue',sans-serif;font-size:32px;color:#F5A623;letter-spacing:3px;margin-bottom:4px">SNEAKERS FEST '26</div>
          <div style="font-size:11px;color:#444;letter-spacing:4px;margin-bottom:32px;font-family:'Space Mono',monospace">THE SOLE EXHIBITION · LAGOS</div>
          <h2 style="color:#e8e8e8;font-size:22px;margin-bottom:16px">Vendor Application Update</h2>
          <p>Hi ${esc(vendor.contact)},</p>
          <p>Thank you for applying to be a vendor at Sneakers Fest '26. After careful review, we're unable to accommodate <strong>${esc(vendor.business)}</strong> at this time.</p>
          ${notes ? `<div style="background:#ffffff08;border-left:3px solid #555;padding:12px 16px;border-radius:4px;margin:20px 0"><p style="color:#aaa;font-size:13px;margin:0">${esc(notes)}</p></div>` : ''}
          <p>We appreciate your interest and hope to welcome you at a future event.</p>
          <p style="font-family:'Space Mono',monospace;font-size:11px;color:#555">Application ID: ${esc(applicationId)}</p>
        </div>`

    await sendEmail({ to: vendor.email, subject, html })
  }

  console.log(`[vendor-status] ${applicationId} → ${updated.status}`)
  return ok({ success: true, applicationId, status: updated.status })
}
