#!/usr/bin/env bash
# ============================================================
# Za.allyErrands — One-shot deploy script
# Run this on your local machine after filling in credentials.
# Usage: bash deploy.sh
# ============================================================
set -e

# ─── FILL THESE IN ──────────────────────────────────────────
SUPABASE_PROJECT_ID="YOUR_PROJECT_ID"
SUPABASE_ANON_KEY="YOUR_SUPABASE_ANON_KEY"
SUPABASE_SERVICE_ROLE_KEY="YOUR_SERVICE_ROLE_KEY"
FLW_SECRET_KEY="FLWSECK_TEST-xxxxxxxxxxxx"
FLW_WEBHOOK_SECRET="your_custom_secret_hash"
WHATSAPP_TOKEN="EAAxxxxxxxxxxxxxxx"
WHATSAPP_PHONE_NUMBER_ID="1234567890"
MAKE_WEBHOOK_URL="https://hook.eu2.make.com/SCENARIO1_TOKEN"
MAKE_PAID_WEBHOOK_URL="https://hook.eu2.make.com/SCENARIO2_TOKEN"
SITE_URL="https://zallyerrands.com"
ADMIN_PIN="CHANGE_ME"
# ────────────────────────────────────────────────────────────

BOLD="\033[1m"
GREEN="\033[32m"
ORANGE="\033[33m"
RESET="\033[0m"

ok()   { echo -e "${GREEN}✓ $1${RESET}"; }
step() { echo -e "\n${BOLD}${ORANGE}▶ $1${RESET}"; }

validate() {
  if [[ "$1" == YOUR_* ]] || [[ "$1" == FLWSECK_TEST-xxx* ]] || [[ "$1" == EAAxxxxx* ]] || [[ "$1" == "CHANGE_ME" ]]; then
    echo -e "\033[31m✗ ERROR: Fill in $2 before deploying.\033[0m"
    exit 1
  fi
}

# Validate credentials
validate "$SUPABASE_PROJECT_ID"     "SUPABASE_PROJECT_ID"
validate "$SUPABASE_ANON_KEY"       "SUPABASE_ANON_KEY"
validate "$SUPABASE_SERVICE_ROLE_KEY" "SUPABASE_SERVICE_ROLE_KEY"
validate "$FLW_SECRET_KEY"          "FLW_SECRET_KEY"
validate "$ADMIN_PIN"               "ADMIN_PIN"

# ─── 1. Inject credentials into HTML/JS files ───────────────
step "Injecting credentials into frontend files"

FILES_TO_UPDATE=(
  "index.html"
  "admin/index.html"
  "portal/index.html"
  "runner/index.html"
  "success/index.html"
  "script.js"
  "admin/admin.js"
  "portal/portal.js"
  "runner/runner.js"
  "success/success.js"
)

for f in "${FILES_TO_UPDATE[@]}"; do
  sed -i \
    -e "s|YOUR_PROJECT_ID|${SUPABASE_PROJECT_ID}|g" \
    -e "s|YOUR_SUPABASE_ANON_KEY|${SUPABASE_ANON_KEY}|g" \
    "$f"
  ok "$f"
done

# Admin PIN
sed -i "s|const ADMIN_PIN.*=.*'za2026'|const ADMIN_PIN = '${ADMIN_PIN}'|g" admin/admin.js
ok "Admin PIN set"

# triggers.sql
sed -i \
  -e "s|YOUR_PROJECT_ID|${SUPABASE_PROJECT_ID}|g" \
  -e "s|YOUR_SERVICE_ROLE_KEY|${SUPABASE_SERVICE_ROLE_KEY}|g" \
  backend/triggers.sql
ok "triggers.sql"

# ─── 2. Link Supabase project ────────────────────────────────
step "Linking Supabase project"
supabase link --project-ref "$SUPABASE_PROJECT_ID"
ok "Project linked: $SUPABASE_PROJECT_ID"

# ─── 3. Push database migrations ────────────────────────────
step "Pushing database migrations"
supabase db push
ok "Migrations applied"

# ─── 4. Set Edge Function secrets ────────────────────────────
step "Setting Edge Function secrets"
supabase secrets set \
  SUPABASE_URL="https://${SUPABASE_PROJECT_ID}.supabase.co" \
  SUPABASE_SERVICE_ROLE_KEY="$SUPABASE_SERVICE_ROLE_KEY" \
  MAKE_WEBHOOK_URL="$MAKE_WEBHOOK_URL" \
  MAKE_PAID_WEBHOOK_URL="$MAKE_PAID_WEBHOOK_URL" \
  FLW_SECRET_KEY="$FLW_SECRET_KEY" \
  FLW_WEBHOOK_SECRET="$FLW_WEBHOOK_SECRET" \
  WHATSAPP_TOKEN="$WHATSAPP_TOKEN" \
  WHATSAPP_PHONE_NUMBER_ID="$WHATSAPP_PHONE_NUMBER_ID" \
  SITE_URL="$SITE_URL"
ok "Secrets set"

# ─── 5. Deploy Edge Functions ────────────────────────────────
step "Deploying Edge Functions"
supabase functions deploy dispatch     --no-verify-jwt
ok "dispatch deployed"
supabase functions deploy flw-webhook  --no-verify-jwt
ok "flw-webhook deployed"
supabase functions deploy status-notify --no-verify-jwt
ok "status-notify deployed"

# ─── 6. Run triggers.sql ─────────────────────────────────────
step "Setting up database triggers (pg_net)"
supabase db execute --file backend/triggers.sql
ok "DB trigger installed"

# ─── 7. Print summary ────────────────────────────────────────
echo ""
echo -e "${BOLD}═══════════════════════════════════════${RESET}"
echo -e "${GREEN}${BOLD}  Za.allyErrands — DEPLOYED ⚡${RESET}"
echo -e "${BOLD}═══════════════════════════════════════${RESET}"
echo ""
echo "  Edge Functions:"
echo "  dispatch      → https://${SUPABASE_PROJECT_ID}.supabase.co/functions/v1/dispatch"
echo "  flw-webhook   → https://${SUPABASE_PROJECT_ID}.supabase.co/functions/v1/flw-webhook"
echo "  status-notify → https://${SUPABASE_PROJECT_ID}.supabase.co/functions/v1/status-notify"
echo ""
echo "  Next steps:"
echo "  1. Upload allyerrands/ folder to Netlify or Vercel"
echo "  2. Set Flutterwave webhook → flw-webhook URL above"
echo "  3. Import make-request-scenario.json + make-payment-scenario.json into Make.com"
echo "  4. Run a test order"
echo ""
