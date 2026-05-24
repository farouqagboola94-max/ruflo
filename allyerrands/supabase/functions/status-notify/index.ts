// ============================================================
// Za.allyErrands — Edge Function: status-notify
//
// Called automatically by a Supabase Database Webhook
// whenever a row in errand_requests is UPDATED.
//
// If the status field changed, the correct WhatsApp template
// is sent to the client. Zero manual intervention.
//
// Deploy:
//   supabase functions deploy status-notify --no-verify-jwt
//
// Then set up the Database Webhook in Supabase Dashboard:
//   Table Editor → errand_requests → Database Webhooks
//   Event: UPDATE
//   URL: https://YOUR_PROJECT_ID.supabase.co/functions/v1/status-notify
//   HTTP Method: POST
//   Add header: Authorization: Bearer YOUR_SUPABASE_ANON_KEY
// ============================================================

import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'

const CORS = { 'Access-Control-Allow-Origin': '*' }

// Status → WhatsApp message template
function buildMessage(
  status: string,
  record: Record<string, any>,
  runnerName?: string,
): string | null {
  const name   = record.client_name   ?? 'Client'
  const item   = (record.item_description ?? '').slice(0, 60)
  const pickup = record.pickup_address ?? ''
  const drop   = record.dropoff_address ?? ''
  const eta    = record.estimated_mins  ? `${record.estimated_mins} minutes` : 'shortly'
  const siteUrl = Deno.env.get('SITE_URL') ?? 'https://zallyerrands.com'

  switch (status) {
    case 'Paid':
      return (
        `✅ *Za.allyErrands — Payment Confirmed*\n\n` +
        `₦${Number(record.amount_ngn ?? 0).toLocaleString()} received. ` +
        `Your runner is being assigned right now.\n\n` +
        `*Job:* ${item}\n` +
        `*Pickup:* ${pickup}\n\n` +
        `Track your run: ${siteUrl}/portal`
      )
    case 'Active':
      return (
        `🏃 *Za.allyErrands — Runner Assigned*\n\n` +
        (runnerName ? `*Runner:* ${runnerName}\n` : '') +
        `*Job:* ${item}\n` +
        `*Pickup:* ${pickup}\n` +
        `*ETA to pickup:* ${eta}\n\n` +
        `Track live: ${siteUrl}/portal`
      )
    case 'En Route':
      return (
        `🚦 *Za.allyErrands — En Route*\n\n` +
        `Your ally is on the move.\n\n` +
        `*Item:* ${item}\n` +
        `*From:* ${pickup}\n` +
        (drop ? `*To:* ${drop}\n` : '') +
        `*ETA:* ${eta}\n\n` +
        `Track live: ${siteUrl}/portal`
      )
    case 'Completed':
      return (
        `✅ *Za.allyErrands — Complete*\n\n` +
        `Job done. Your errand has been delivered.\n\n` +
        `*Item:* ${item}\n` +
        `*Ref:* ${record.tx_ref ?? record.id?.slice(0, 8).toUpperCase()}\n\n` +
        `Thank you. Book your next run: ${siteUrl}`
      )
    case 'Cancelled':
      return (
        `❌ *Za.allyErrands — Cancelled*\n\n` +
        `Your request has been cancelled.\n` +
        `*Job:* ${item}\n\n` +
        `If this was a mistake, book again at ${siteUrl}`
      )
    default:
      return null  // No message for other status changes
  }
}

serve(async (req: Request) => {
  if (req.method === 'OPTIONS') return new Response(null, { headers: CORS })

  let payload: any
  try { payload = await req.json() } catch { return json({ error: 'Invalid JSON' }, 400) }

  const { type, record, old_record } = payload

  // Only act on UPDATE events where status actually changed
  if (type !== 'UPDATE') return json({ skipped: 'not an update' })
  if (!record || record.status === old_record?.status) return json({ skipped: 'status unchanged' })

  const phone   = record.client_phone as string
  const status  = record.status as string

  if (!phone) return json({ skipped: 'no client_phone' })

  // Fetch runner name if assigned
  let runnerName: string | undefined
  if (record.runner_id) {
    try {
      const res  = await fetch(
        `${Deno.env.get('SUPABASE_URL')}/rest/v1/runners?id=eq.${record.runner_id}&select=name`,
        { headers: {
          apikey:        Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
          Authorization: `Bearer ${Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')}`,
        }}
      )
      const rows = await res.json()
      runnerName = rows?.[0]?.name
    } catch { /* non-fatal */ }
  }

  const message = buildMessage(status, record, runnerName)
  if (!message) return json({ skipped: `no template for status: ${status}` })

  await sendWhatsApp(phone, message)

  return json({ sent: true, status, to: phone })
})

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...CORS, 'Content-Type': 'application/json' },
  })
}

async function sendWhatsApp(to: string, text: string) {
  const token   = Deno.env.get('WHATSAPP_TOKEN')
  const phoneId = Deno.env.get('WHATSAPP_PHONE_NUMBER_ID')
  if (!token || !phoneId) { console.warn('WhatsApp not configured'); return }
  const normalized = to.replace(/\s/g, '').replace(/^0/, '234').replace(/^\+/, '')
  const res = await fetch(`https://graph.facebook.com/v19.0/${phoneId}/messages`, {
    method:  'POST',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      messaging_product: 'whatsapp',
      to:                normalized,
      type:              'text',
      text:              { body: text },
    }),
  })
  if (!res.ok) console.error('[whatsapp]', await res.text())
}
