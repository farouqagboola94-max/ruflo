# Za.allyErrands — Complete Setup Guide

This is the exact execution sequence to get the full autonomous dispatch machine live.

---

## Phase 1 — Front-End (Done)

The Lagos Noir website is built. Files:
- `index.html` — Landing page
- `styles.css` — Dark mode, brutalist, hazard orange
- `script.js` — Wired to Supabase Edge Function
- `portal/` — Real-time client dashboard

---

## Phase 2 — Supabase Database

1. Go to [supabase.com](https://supabase.com) and create a new project.
2. Open **SQL Editor** and paste the contents of `backend/schema.sql`. Run it.
3. Go to **Project Settings > API** and copy:
   - `Project URL` → `SUPABASE_URL`
   - `anon public` key → `SUPABASE_ANON_KEY`
   - `service_role secret` key → `SUPABASE_SERVICE_ROLE_KEY`
4. Go to **Realtime** and confirm `errand_requests` is enabled.

---

## Phase 3 — Supabase Edge Function (Dispatch)

```bash
# Install Supabase CLI
npm install -g supabase

# Login
supabase login

# Link to your project
supabase link --project-ref YOUR_PROJECT_ID

# Deploy the dispatch function
supabase functions deploy dispatch --no-verify-jwt

# Set secrets
supabase secrets set MAKE_WEBHOOK_URL=https://hook.eu2.make.com/YOUR_TOKEN
supabase secrets set WHATSAPP_TOKEN=EAAxxxxxxxxx
supabase secrets set WHATSAPP_PHONE_NUMBER_ID=YOUR_PHONE_ID
```

Your dispatch endpoint will be:
```
https://YOUR_PROJECT_ID.supabase.co/functions/v1/dispatch
```

Paste this URL into `script.js` as `CONFIG.dispatchUrl`.

---

## Phase 4 — Make.com Automation

1. Go to [make.com](https://make.com) and create a new scenario.
2. **Import** `backend/make-scenario.json` (three-dot menu > Import blueprint).
3. Replace all `REPLACE_ME` placeholders:
   - Connect your WhatsApp Business account
   - Set your admin phone / group ID
   - Activate the scenario
4. Copy the generated **webhook URL** and set it as `MAKE_WEBHOOK_URL` in Supabase secrets (step above).

---

## Phase 5 — Wire the Front-End

In `index.html`, add these two lines before `<script src="script.js">` so the frontend knows where to send requests:

```html
<script>
  window.ZA_DISPATCH_URL = 'https://YOUR_PROJECT_ID.supabase.co/functions/v1/dispatch';
  window.ZA_ANON_KEY     = 'YOUR_SUPABASE_ANON_KEY';
</script>
```

Do the same in `portal/index.html`:

```html
<script>
  window.ZA_SUPABASE_URL = 'https://YOUR_PROJECT_ID.supabase.co';
  window.ZA_ANON_KEY     = 'YOUR_SUPABASE_ANON_KEY';
</script>
```

---

## Phase 6 — WhatsApp Business API

1. Go to [developers.facebook.com](https://developers.facebook.com)
2. Create an app > Add **WhatsApp** product
3. Under WhatsApp > Getting Started, grab:
   - `Access Token` → `WHATSAPP_TOKEN`
   - `Phone number ID` → `WHATSAPP_PHONE_NUMBER_ID`
4. Add your business number and complete verification.

---

## Phase 7 — Deploy & Test

1. Upload the `allyerrands/` folder to Framer, Netlify, or Vercel.
2. Connect your custom domain (`zallyerrands.com`).
3. **Test run**: submit a real request with your own phone number.
4. Verify:
   - [ ] Row appears in Supabase `errand_requests` table
   - [ ] Admin gets WhatsApp ping via Make.com
   - [ ] Client gets automated WhatsApp confirmation
   - [ ] Portal shows the run in real time

If all four fire, the machine is live. You don't touch it again.
