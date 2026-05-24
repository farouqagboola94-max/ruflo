// ============================================================
// Za.allyErrands — Edge Function: dispatch
// Updated: Flutterwave payment link generation
//
// Full flow:
//   1. Insert errand request into Supabase
//   2. Call Flutterwave API → get payment link
//   3. Store tx_ref + link in DB
//   4. Send client a WhatsApp with the payment link
//   5. Ping Make.com with full payload
//
// Deploy:
//   supabase functions deploy dispatch --no-verify-jwt
//
// Secrets required:
//   SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY
//   MAKE_WEBHOOK_URL
//   FLW_SECRET_KEY
//   FLW_WEBHOOK_SECRET
//   WHATSAPP_TOKEN, WHATSAPP_PHONE_NUMBER_ID
//   SITE_URL  (e.g. https://zallyerrands.com)
// ============================================================

import { serve }        from 'https://deno.land/std@0.177.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const CORS = {
  'Access-Control-Allow-Origin':  '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

// Flat base rates by service keyword (NGN)
const RATES: Record<string, number> = {
  grocery:   3500,
  pharmacy:  2500,
  package:   2000,
  food:      1800,
  cleaning:  2800,
  default:   3000,
}

function getAmount(description: string): number {
  const d = description.toLowerCase()
  for (const [key, amount] of Object.entries(RATES)) {
    if (d.includes(key)) return amount
  }
  return RATES.default
}

serve(async (req: Request) => {
  if (req.method === 'OPTIONS') return new Response(null, { headers: CORS })
  if (req.method !== 'POST')   return json({ error: 'Method not allowed' }, 405)

  try {
    const body = await req.json()
    const { name, phone, errand, location, dropoff, email } = body

    if (!name || !phone || !errand || !location) {
      return json({ error: 'Missing required fields: name, phone, errand, location' }, 400)
    }

    const supa = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
    )

    const amount = getAmount(errand)

    // ── 1. Insert into DB ──
    const { data: record, error: dbErr } = await supa
      .from('errand_requests')
      .insert({
        client_name:      name.trim(),
        client_phone:     phone.trim(),
        pickup_address:   location.trim(),
        dropoff_address:  dropoff?.trim() || null,
        item_description: errand.trim(),
        status:           'Pending',
        payment_status:   'Awaiting Payment',
        amount_ngn:       amount,
      })
      .select()
      .single()

    if (dbErr) throw new Error(`DB insert failed: ${dbErr.message}`)

    // ── 2. Generate Flutterwave payment link ──
    const txRef      = `ZA-${record.id.slice(0, 8).toUpperCase()}-${Date.now()}`
    const siteUrl    = Deno.env.get('SITE_URL') ?? 'https://zallyerrands.com'
    const clientEmail = email?.trim() || `${phone.replace(/[^0-9]/g, '')}@clients.zallyerrands.com`

    let paymentLink = ''
    try {
      const flwRes = await fetch('https://api.flutterwave.com/v3/payments', {
        method:  'POST',
        headers: {
          Authorization:  `Bearer ${Deno.env.get('FLW_SECRET_KEY')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          tx_ref:       txRef,
          amount:       amount,
          currency:     'NGN',
          redirect_url: `${siteUrl}/success?tx_ref=${txRef}&id=${record.id}`,
          customer: {
            email:       clientEmail,
            phonenumber: phone.trim(),
            name:        name.trim(),
          },
          customizations: {
            title:       'Za.allyErrands Dispatch Fee',
            description: `Errand: ${errand.slice(0, 80)}`,
            logo:        `${siteUrl}/assets/logo.png`,
          },
        }),
      })
      const flwData = await flwRes.json()
      paymentLink = flwData?.data?.link ?? ''
    } catch (flwErr) {
      console.error('[flutterwave]', flwErr)
      // Non-fatal: log it but continue. Admin can send link manually.
    }

    // ── 3. Store tx_ref + link back to DB ──
    await supa.from('errand_requests').update({
      tx_ref:       txRef,
      payment_link: paymentLink,
    }).eq('id', record.id)

    // ── 4. WhatsApp the client their payment link ──
    const clientMsg = paymentLink
      ? `⚡ *Za.allyErrands*\n\nYour request is logged.\n\n` +
        `*Job:* ${errand.slice(0, 60)}\n` +
        `*Pickup:* ${location}\n` +
        `*Amount:* ₦${amount.toLocaleString()}\n\n` +
        `To lock in your runner and trigger immediate dispatch, ` +
        `complete your payment here:\n${paymentLink}\n\n` +
        `_Payment is secure via Flutterwave. Your ally moves the moment it clears._`
      : `⚡ *Za.allyErrands*\n\nYour request is logged. ` +
        `An ally will contact you shortly on this number to confirm the fee and dispatch.`

    await sendWhatsApp(phone.trim(), clientMsg)

    // ── 5. Ping Make.com for admin + Phalanx notification ──
    const makeUrl = Deno.env.get('MAKE_WEBHOOK_URL')
    if (makeUrl) {
      await fetch(makeUrl, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          event:         'new_request',
          request_id:    record.id,
          tx_ref:        txRef,
          client_name:   name.trim(),
          client_phone:  phone.trim(),
          pickup:        location.trim(),
          dropoff:       dropoff?.trim() ?? 'N/A',
          description:   errand.trim(),
          amount:        amount,
          payment_link:  paymentLink,
          timestamp:     record.created_at,
        }),
      })
    }

    return json({ success: true, request_id: record.id, tx_ref: txRef, amount })

  } catch (err) {
    console.error('[dispatch]', err)
    return json({ error: (err as Error).message }, 500)
  }
})

// ── Helpers ──

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
