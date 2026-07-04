const FROM_ADDR = process.env.FROM_EMAIL     || 'noreply@sneakersfest.ng'
const ORG_EMAIL = process.env.ORGANISER_EMAIL || 'hello@sneakersfest.ng'
const FROM      = `Sneakers Fest '26 <${FROM_ADDR}>`

export async function sendEmail({ to, subject, html }) {
  const key = process.env.RESEND_API_KEY
  if (!key) {
    console.warn('[email] RESEND_API_KEY not set — skipping send')
    return false
  }
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ from: FROM, to: [to], subject, html }),
  })
  if (!res.ok) console.error('[email]', res.status, await res.text())
  return res.ok
}

export const notifyOrg = (subject, html) =>
  sendEmail({ to: ORG_EMAIL, subject, html })

// ─── Shared HTML shell ────────────────────────────────────────────────
const shell = (body) => `<!DOCTYPE html>
<html lang="en"><head><meta charset="UTF-8">
<title>Sneakers Fest '26</title></head>
<body style="margin:0;padding:0;background:#0A0A0A;font-family:Arial,Helvetica,sans-serif;color:#fff;">
<div style="max-width:600px;margin:40px auto;">
  <div style="background:linear-gradient(135deg,#F5A623,#E55C00);padding:36px 32px;text-align:center;border-radius:14px 14px 0 0;">
    <p style="margin:0 0 6px;font-size:40px;">&#x1F45F;</p>
    <h1 style="margin:0;color:#000;font-size:25px;letter-spacing:3px;font-weight:900;">SNEAKERS FEST '26</h1>
    <p style="margin:6px 0 0;color:rgba(0,0,0,.55);font-size:12px;letter-spacing:2px;">THE SOLE EXHIBITION &middot; LAGOS</p>
  </div>
  <div style="background:#111;padding:32px;border-radius:0 0 14px 14px;border:1px solid rgba(245,166,35,.15);border-top:none;">
    ${body}
    <hr style="border:none;border-top:1px solid #1f1f1f;margin:28px 0 20px;">
    <p style="margin:0;color:#444;font-size:12px;line-height:1.6;">
      Sneakers Fest '26 &middot; Dec 12, 2026 &middot; Muri Okunola Park, V/I Lagos<br>
      <a href="mailto:hello@sneakersfest.ng" style="color:#F5A623;text-decoration:none;">hello@sneakersfest.ng</a>
    </p>
  </div>
</div>
</body></html>`

// ─── Email templates ──────────────────────────────────────────────────

export const ticketEmail = ({ name, ticketId, tier, qty }) => {
  const label = { general:'General Admission', vip:'VIP Access', vvip:'VVIP Access', phalanx:'Phalanx Package' }[tier] || tier.toUpperCase()
  return shell(`
    <h2 style="margin-top:0;color:#F5A623;">Ticket Confirmed &#x2713;</h2>
    <p>Hey <strong>${name}</strong>,</p>
    <p style="color:#ccc;">You're officially locked in. See you on <strong style="color:#fff;">December 12, 2026</strong> at Muri Okunola Park, Victoria Island.</p>
    <table style="width:100%;border-collapse:collapse;background:#0d0d0d;border:1px solid rgba(245,166,35,.15);border-radius:10px;overflow:hidden;margin:20px 0;">
      <tr><td style="padding:11px 16px;color:#777;border-bottom:1px solid #1a1a1a;width:38%;">Ticket ID</td>
          <td style="padding:11px 16px;color:#F5A623;font-family:monospace;font-size:19px;font-weight:bold;letter-spacing:2px;border-bottom:1px solid #1a1a1a;text-align:right;">${ticketId}</td></tr>
      <tr><td style="padding:11px 16px;color:#777;border-bottom:1px solid #1a1a1a;">Name</td>
          <td style="padding:11px 16px;text-align:right;border-bottom:1px solid #1a1a1a;">${name}</td></tr>
      <tr><td style="padding:11px 16px;color:#777;border-bottom:1px solid #1a1a1a;">Tier</td>
          <td style="padding:11px 16px;text-align:right;border-bottom:1px solid #1a1a1a;">${label}</td></tr>
      <tr><td style="padding:11px 16px;color:#777;border-bottom:1px solid #1a1a1a;">Qty</td>
          <td style="padding:11px 16px;text-align:right;border-bottom:1px solid #1a1a1a;">${qty} ticket${qty > 1 ? 's' : ''}</td></tr>
      <tr><td style="padding:11px 16px;color:#777;border-bottom:1px solid #1a1a1a;">Date</td>
          <td style="padding:11px 16px;text-align:right;border-bottom:1px solid #1a1a1a;">December 12, 2026</td></tr>
      <tr><td style="padding:11px 16px;color:#777;">Venue</td>
          <td style="padding:11px 16px;text-align:right;">Muri Okunola Park, V/I Lagos</td></tr>
    </table>
    <div style="border:2px dashed rgba(245,166,35,.35);border-radius:10px;padding:18px;text-align:center;background:#0d0d0d;">
      <p style="margin:0 0 5px;color:#555;font-size:11px;letter-spacing:3px;text-transform:uppercase;">Access Code</p>
      <p style="margin:0;font-family:monospace;font-size:25px;color:#F5A623;letter-spacing:5px;font-weight:bold;">${ticketId}</p>
    </div>
    <p style="color:#666;font-size:13px;margin-top:18px;">Screenshot this email. Show your access code at the entrance on event day.</p>
  `)
}

export const vendorEmail = ({ business, applicationId, contact }) => shell(`
  <h2 style="margin-top:0;color:#F5A623;">Application Received!</h2>
  <p>Hey <strong>${contact}</strong>,</p>
  <p style="color:#ccc;">We've received the vendor application for <strong style="color:#fff;">${business}</strong>. Our team will review it and get back to you within 3&ndash;5 business days.</p>
  <div style="background:#0d0d0d;border:1px solid rgba(245,166,35,.15);border-radius:10px;padding:18px;margin:18px 0;">
    <p style="margin:0 0 5px;color:#555;font-size:12px;text-transform:uppercase;letter-spacing:2px;">Application ID</p>
    <p style="margin:0;font-family:monospace;font-size:20px;color:#F5A623;font-weight:bold;">${applicationId}</p>
  </div>
  <p style="color:#666;font-size:13px;">Keep this ID for reference. Questions? <a href="mailto:vendors@sneakersfest.ng" style="color:#F5A623;">vendors@sneakersfest.ng</a></p>
`)

export const waitlistEmail = ({ name, position }) => shell(`
  <h2 style="margin-top:0;color:#F5A623;">You're on the List &#x1F525;</h2>
  <p>Hey <strong>${name}</strong>,</p>
  <p style="color:#ccc;">You're <strong style="color:#fff;">#${position}</strong> on the Sneakers Fest '26 early access waitlist. We'll email you as soon as tickets go live &mdash; early-bird pricing guaranteed.</p>
  <p style="color:#ccc;">Refer friends to move up the list and unlock exclusive perks.</p>
`)

export const newsletterEmail = ({ name }) => shell(`
  <h2 style="margin-top:0;color:#F5A623;">Subscribed &#x1F525;</h2>
  <p>Hey${name ? ` <strong>${name}</strong>` : ''},</p>
  <p style="color:#ccc;">You're now on the Sneakers Fest '26 newsletter. Expect updates on drops, artists, vendors, and exclusive early-bird offers.</p>
`)

export const contactAutoReply = ({ name }) => shell(`
  <h2 style="margin-top:0;color:#F5A623;">Message Received!</h2>
  <p>Hey <strong>${name}</strong>,</p>
  <p style="color:#ccc;">Thanks for reaching out. We'll get back to you within 24 hours.</p>
`)
