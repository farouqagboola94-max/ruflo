// ============================================================
// Za.allyErrands — Edge Function: flw-webhook
// Receives Flutterwave payment confirmations.
//
// Deploy:
//   supabase functions deploy flw-webhook --no-verify-jwt
//
// In Flutterwave Dashboard → Settings → Webhooks:
//   URL: https://YOUR_PROJECT_ID.supabase.co/functions/v1/flw-webhook
//   Secret hash: same value as FLW_WEBHOOK_SECRET env var
//
// Secrets required:
//   SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY
//   FLW_WEBHOOK_SECRET     (the "Secret Hash" you set in FLW dashboard)
//   FLW_SECRET_KEY         (to verify transactions via API)
//   MAKE_PAID_WEBHOOK_URL  (second Make.com scenario for Phalanx ping)
//   WHATSAPP_TOKEN, WHATSAPP_PHONE_NUMBER_ID
//   SITE_URL
// ============================================================

import { serve }        from 'https://deno.land/std@0.177.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const CORS = { 'Access-Control-Allow-Origin': '*' }

serve(async (req: Request) => {
  if (req.method === 'OPTIONS') return new Response(null, { headers: CORS })

  // ── 1. Verify Flutterwave signature ──
  // Flutterwave sends its secret hash in the "verif-hash" header.
  const signature  = req.headers.get('verif-hash')
  const webhookKey = Deno.env.get('FLW_WEBHOOK_SECRET')
  if (!webhookKey || signature !== webhookKey) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 })
  }

  let event: any
  try { event = await req.json() } catch { return json({ error: 'Invalid JSON' }, 400) }

  // ── 2. Only handle successful charges ──
  if (event.event !== 'charge.completed') return json({ received: true })
  if (event.data?.status !== 'successful') {
    console.warn('[flw-webhook] Non-successful charge:', event.data?.status)
    return json({ received: true })
  }

  const txRef         = event.data?.tx_ref as string
  const flwTxnId      = String(event.data?.id ?? '')
  const amountPaid    = event.data?.amount as number
  const customerName  = event.data?.customer?.name  as string
  const customerPhone = event.data?.customer?.phone_number as string

  if (!txRef) return json({ error: 'Missing tx_ref' }, 400)

  // ── 3. Verify transaction with Flutterwave API (double-check) ──
  try {
    const verifyRes = await fetch(
      `https://api.flutterwave.com/v3/transactions/${flwTxnId}/verify`,
      { headers: { Authorization: `Bearer ${Deno.env.get('FLW_SECRET_KEY')}` } }
    )
    const verifyData = await verifyRes.json()
    if (verifyData.data?.status !== 'successful') {
      console.error('[flw-webhook] Verification failed:', verifyData)
      return json({ error: 'Transaction verification failed' }, 400)
    }
  } catch (vErr) {
    console.error('[flw-webhook] Verify call failed:', vErr)
    // Proceed anyway — signature already matched. Log and continue.
  }

  // ── 4. Update Supabase ──
  const supa = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
  )

  const { data: record, error: updateErr } = await supa
    .from('errand_requests')
    .update({
      status:             'Paid',
      payment_status:     'Paid',
      paid_at:            new Date().toISOString(),
      flw_transaction_id: flwTxnId,
    })
    .eq('tx_ref', txRef)
    .select()
    .single()

  if (updateErr) {
    console.error('[flw-webhook] DB update error:', updateErr)
    return json({ error: updateErr.message }, 500)
  }

  // ── 5. WhatsApp the client: payment confirmed ──
  if (record?.client_phone) {
    await sendWhatsApp(
      record.client_phone,
      `✅ *Za.allyErrands — Payment Confirmed*\n\n` +
      `₦${amountPaid.toLocaleString()} received. Your runner is being dispatched now.\n\n` +
      `*Job:* ${record.item_description?.slice(0, 60)}\n` +
      `*Pickup:* ${record.pickup_address}\n\n` +
      `Track your run live: ${Deno.env.get('SITE_URL')}/portal\n\n` +
      `_Do not reply to this number. Updates will come through automatically._`
    )
  }

  // ── 6. Ping Make.com → Phalanx dispatch alert ──
  const paidUrl = Deno.env.get('MAKE_PAID_WEBHOOK_URL')
  if (paidUrl && record) {
    await fetch(paidUrl, {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        event:         'payment_confirmed',
        request_id:    record.id,
        tx_ref:        txRef,
        client_name:   customerName  ?? record.client_name,
        client_phone:  customerPhone ?? record.client_phone,
        pickup:        record.pickup_address,
        dropoff:       record.dropoff_address ?? 'N/A',
        description:   record.item_description,
        amount:        amountPaid,
        paid_at:       record.paid_at,
      }),
    })
  }

  return json({ success: true })
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
  if (!token || !phoneId) return
  const normalized = to.replace(/\s/g, '').replace(/^0/, '234').replace(/^\+/, '')
  await fetch(`https://graph.facebook.com/v19.0/${phoneId}/messages`, {
    method:  'POST',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      messaging_product: 'whatsapp',
      to:                normalized,
      type:              'text',
      text:              { body: text },
    }),
  })
}
