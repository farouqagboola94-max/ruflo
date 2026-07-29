// POST /.netlify/functions/sole-submit
// Body: { displayName, city, shoe, brand, colorway?, size?, story }
// Returns: { success, submissionId, slotNumber, totalRegistered }

import { ok, err, preflight, limitBody } from './lib/cors.js'
import { esc, sendEmail }                from './lib/email.js'
import { getStore }                      from '@netlify/blobs'

const Registry = () => getStore({ name: 'sf26-sole-registry', consistency: 'strong' })

const BRANDS = ['Nike','Jordan','Adidas','New Balance','Puma','Asics','Reebok','Vans','Converse','Other']

export const handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') return preflight()
  if (event.httpMethod !== 'POST') return err(405, 'Method not allowed')

  const bodyErr = limitBody(event, 4096)
  if (bodyErr) return bodyErr

  let body
  try { body = JSON.parse(event.body || '{}') } catch { return err(400, 'Invalid JSON') }

  const { displayName, city, shoe, brand, colorway, size, story, email } = body

  if (!shoe  || typeof shoe  !== 'string') return err(400, 'shoe is required')
  if (!brand || typeof brand !== 'string') return err(400, 'brand is required')
  if (!city  || typeof city  !== 'string') return err(400, 'city is required')
  if (!story || typeof story !== 'string') return err(400, 'story is required')

  if (shoe.length > 80)                          return err(400, 'Shoe name too long (max 80)')
  if (brand.length > 50)                         return err(400, 'Brand too long (max 50)')
  if (city.length > 60)                          return err(400, 'City too long (max 60)')
  if (story.length > 200)                        return err(400, 'Story too long (max 200)')
  if (displayName && displayName.length > 40)    return err(400, 'Display name too long (max 40)')
  if (colorway   && colorway.length > 60)        return err(400, 'Colorway too long (max 60)')
  if (size       && size.length > 10)            return err(400, 'Size too long')
  if (email      && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return err(400, 'Invalid email')

  if (!BRANDS.includes(brand)) return err(400, 'Invalid brand')

  const store       = Registry()
  const counterKey  = '_count'
  const countData   = await store.get(counterKey, { type:'json' }).catch(() => null)
  const slotNumber  = (countData?.count ?? 0) + 1

  const submissionId = `SR26-${String(slotNumber).padStart(4, '0')}`

  const record = {
    submissionId,
    slotNumber,
    displayName: (displayName || 'Anonymous').trim(),
    city:        city.trim(),
    shoe:        shoe.trim(),
    brand:       brand.trim(),
    colorway:    (colorway || '').trim(),
    size:        (size     || '').trim(),
    story:       story.trim(),
    registeredAt: new Date().toISOString(),
  }

  await store.setJSON(submissionId, record)
  await store.setJSON(counterKey, { count: slotNumber, updatedAt: new Date().toISOString() })

  ;(async () => {
    try {
      const statsKey = '_stats'
      const s        = await store.get(statsKey, { type: 'json' }).catch(() => ({}))
      const brands   = s.brands   || {}
      const cities   = s.cities   || {}
      const topShoes = s.topShoes || {}
      const recent   = s.recent   || []
      brands[record.brand]               = (brands[record.brand]               || 0) + 1
      cities[record.city]                = (cities[record.city]                || 0) + 1
      topShoes[record.shoe.slice(0, 40)] = (topShoes[record.shoe.slice(0, 40)] || 0) + 1
      const newRecent = [
        { display: record.displayName, city: record.city, shoe: record.shoe.slice(0, 40), ts: record.registeredAt },
        ...recent,
      ].slice(0, 5)
      await store.setJSON(statsKey, { brands, cities, topShoes, count: slotNumber, recent: newRecent, lastUpdated: new Date().toISOString() })
    } catch (e) {
      console.error('[sole-submit] stats error', e)
    }
  })()

  if (email) {
    const name = record.displayName
    sendEmail({
      to: email,
      subject: `Sole Pass ${submissionId} — You're on the SF'26 Wall!`,
      html: `<div style="background:#0A0A0A;font-family:Arial,sans-serif;color:#fff;padding:40px 24px;max-width:600px;margin:0 auto;">
        <div style="background:linear-gradient(135deg,#F5A623,#E55C00);padding:28px;text-align:center;border-radius:12px 12px 0 0;">
          <p style="margin:0 0 4px;font-size:32px;">&#x1F45F;</p>
          <h1 style="margin:0;color:#000;font-size:20px;letter-spacing:3px;font-weight:900;">SOLE PASS</h1>
          <p style="margin:4px 0 0;color:rgba(0,0,0,.6);font-size:10px;letter-spacing:2px;">SNEAKERS FEST '26 &middot; SOLE REGISTRY</p>
        </div>
        <div style="background:#111;border:1px solid rgba(245,166,35,.15);border-top:none;border-radius:0 0 12px 12px;padding:28px;">
          <p style="margin:0 0 4px;font-family:monospace;font-size:22px;color:#F5A623;font-weight:bold;letter-spacing:4px;">${esc(submissionId)}</p>
          <p style="margin:0 0 16px;color:#555;font-size:10px;letter-spacing:2px;">WALL SLOT #${slotNumber} OF 200</p>
          <table style="width:100%;border-collapse:collapse;background:#0d0d0d;border:1px solid rgba(245,166,35,.1);border-radius:8px;overflow:hidden;margin-bottom:16px;">
            <tr><td style="padding:10px 14px;color:#666;font-size:12px;">Grail</td><td style="padding:10px 14px;font-weight:bold;font-size:13px;text-align:right;">${esc(record.shoe)}</td></tr>
            <tr style="border-top:1px solid #1a1a1a;"><td style="padding:10px 14px;color:#666;font-size:12px;">Brand</td><td style="padding:10px 14px;text-align:right;font-size:12px;">${esc(record.brand)}</td></tr>
            <tr style="border-top:1px solid #1a1a1a;"><td style="padding:10px 14px;color:#666;font-size:12px;">City</td><td style="padding:10px 14px;text-align:right;font-size:12px;">${esc(record.city)}</td></tr>
          </table>
          <p style="margin:0 0 4px;color:#444;font-size:11px;font-style:italic;">"${esc(record.story)}"</p>
          <p style="margin:16px 0 0;color:#444;font-size:11px;line-height:1.6;">Show this pass at the event to claim your name on the physical Sole Registry wall. Dec 12, 2026 &middot; Muri Okunola Park, V/I Lagos.</p>
        </div>
      </div>`,
    }).catch(e => console.error('[sole-submit] email error', e))
  }

  return ok({ success: true, submissionId, slotNumber, totalRegistered: slotNumber })
}
