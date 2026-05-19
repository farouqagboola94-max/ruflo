// ============================================================
// Za.allyErrands — Supabase Edge Function: dispatch
//
// Deploy this with:
//   supabase functions deploy dispatch
//
// Set secrets with:
//   supabase secrets set MAKE_WEBHOOK_URL=https://hook.eu2.make.com/...
//   supabase secrets set WHATSAPP_TOKEN=EAAxxxxx
//   supabase secrets set WHATSAPP_PHONE_NUMBER_ID=123456
// ============================================================

import { serve }        from 'https://deno.land/std@0.177.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const CORS = {
  'Access-Control-Allow-Origin':  '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

serve(async (req: Request) => {
  // Preflight
  if (req.method === 'OPTIONS') return new Response(null, { headers: CORS })
  if (req.method !== 'POST') return json({ error: 'Method not allowed' }, 405)

  try {
    const body = await req.json()
    const { name, phone, errand, location, dropoff } = body

    // ── Validate ──
    if (!name || !phone || !errand || !location) {
      return json({ error: 'Missing required fields: name, phone, errand, location' }, 400)
    }

    // ── Insert into Supabase ──
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
    )

    const { data: record, error: dbError } = await supabase
      .from('errand_requests')
      .insert({
        client_name:      name.trim(),
        client_phone:     phone.trim(),
        pickup_address:   location.trim(),
        dropoff_address:  dropoff?.trim() || null,
        item_description: errand.trim(),
        status:           'Pending',
      })
      .select()
      .single()

    if (dbError) throw new Error(`DB insert failed: ${dbError.message}`)

    // ── Ping Make.com scenario ──
    const makeUrl = Deno.env.get('MAKE_WEBHOOK_URL')
    if (makeUrl) {
      await fetch(makeUrl, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({
          request_id:  record.id,
          client_name: record.client_name,
          client_phone: record.client_phone,
          pickup:       record.pickup_address,
          dropoff:      record.dropoff_address ?? 'N/A',
          description:  record.item_description,
          timestamp:    record.created_at,
        }),
      })
    }

    // ── Immediate WhatsApp confirmation to client ──
    await sendWhatsApp(
      record.client_phone,
      `⚡ *Za.allyErrands* \n\nYour request has been logged.\n\n` +
      `*Job ID:* ${record.id.slice(0, 8).toUpperCase()}\n` +
      `*Pickup:* ${record.pickup_address}\n` +
      `*Item:* ${record.item_description}\n\n` +
      `An ally is reviewing your route and will contact you shortly. ` +
      `Track your run at portal.zallyerrands.com`,
    )

    return json({ success: true, request_id: record.id })

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
  if (!token || !phoneId) return   // skip silently if not configured

  // Normalize Nigerian number to E.164
  const normalized = to.replace(/\s/g, '').replace(/^0/, '234')

  await fetch(
    `https://graph.facebook.com/v19.0/${phoneId}/messages`,
    {
      method:  'POST',
      headers: {
        Authorization:  `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messaging_product: 'whatsapp',
        to:                normalized,
        type:              'text',
        text:              { body: text },
      }),
    },
  )
}
