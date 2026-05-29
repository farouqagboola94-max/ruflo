# Ruflo WhatsApp Business Agent

A production-ready WhatsApp Business Agent powered by **FastAPI** and **Claude AI** (claude-sonnet-4-6). It handles lead capture, appointment booking, FAQ answering, and broadcast notifications — all through WhatsApp.

---

## Features

| Feature | Description |
|---|---|
| **AI Conversations** | Claude AI understands intent and responds naturally |
| **Lead Capture** | Collects name, email, and service interest automatically |
| **Appointment Booking** | Conversational booking flow with SQLite storage |
| **FAQ Answering** | Configurable `faq.json` — no code changes needed |
| **Broadcast Notifications** | Send messages to all leads or specific numbers |
| **Admin Dashboard** | REST endpoints to view leads, appointments, broadcasts |

---

## Prerequisites

1. **Meta Business Account** with a verified app
2. **WhatsApp Business API** access ([Meta for Developers](https://developers.facebook.com/docs/whatsapp))
3. **Anthropic API key** — [console.anthropic.com](https://console.anthropic.com)
4. **Python 3.11+**
5. **ngrok** (for local webhook testing)

---

## Local Setup

### 1. Clone and install

```bash
cd whatsapp-agent
pip install -r requirements.txt
```

### 2. Configure environment

```bash
cp .env.example .env
# Edit .env with your real credentials
```

### 3. Run the server

```bash
uvicorn whatsapp_agent.main:app --reload --port 8000
```

### 4. Expose via ngrok

```bash
ngrok http 8000
```

Copy the HTTPS URL (e.g. `https://abc123.ngrok.io`).

### 5. Configure Meta Webhook

In your [Meta App Dashboard](https://developers.facebook.com/apps):

- **Callback URL**: `https://abc123.ngrok.io/webhook`
- **Verify Token**: matches `WHATSAPP_VERIFY_TOKEN` in your `.env`
- **Subscribed fields**: `messages`

---

## Environment Variables

| Variable | Description |
|---|---|
| `WHATSAPP_TOKEN` | Permanent access token from Meta App Dashboard |
| `WHATSAPP_PHONE_NUMBER_ID` | Phone Number ID from WhatsApp Business settings |
| `WHATSAPP_VERIFY_TOKEN` | Any string — must match what you set in Meta webhook config |
| `ANTHROPIC_API_KEY` | Your Anthropic API key |
| `ADMIN_API_KEY` | Secret key for admin endpoints (generate a strong random string) |
| `DATABASE_URL` | SQLite URL (default: `sqlite:///./whatsapp_agent.db`) |

---

## API Endpoints

### Webhook (Meta)

| Method | Path | Description |
|---|---|---|
| `GET` | `/webhook` | Meta webhook verification |
| `POST` | `/webhook` | Receive incoming WhatsApp messages |

### Broadcast

```http
POST /broadcast
X-API-Key: your-admin-key
Content-Type: application/json

{
  "message": "Hello! We have a special offer for you today.",
  "phone_numbers": ["2348012345678", "2347098765432"]
}
```

To send to **all captured leads**:

```json
{
  "message": "Big sale this weekend!",
  "phone_numbers": ["all"]
}
```

### Admin Dashboard

All admin endpoints require `X-API-Key` header.

```http
GET /admin/leads          # List all captured leads
GET /admin/appointments   # List all appointments
GET /admin/broadcasts     # List all sent broadcasts
```

### Health Check

```http
GET /health
```

---

## Customising the FAQ

Edit `whatsapp_agent/faq.json` to add your real business Q&A:

```json
{
  "faqs": [
    {
      "question": "What services do you offer?",
      "answer": "We offer haircuts, styling, and colouring."
    }
  ]
}
```

Restart the server after editing — the FAQ is loaded once at startup.

---

## Database Schema

SQLite database at `whatsapp_agent.db` with four tables:

```sql
leads              (id, phone, name, email, interest, created_at)
appointments       (id, lead_phone, service, date, time, notes, status, created_at)
broadcasts         (id, message, recipients_count, sent_at)
conversation_state (phone, state, context_json, updated_at)
```

---

## Deployment

### Railway

```bash
railway login
railway init
railway up
```

Set environment variables in the Railway dashboard. The `PORT` variable is set automatically.

### Render

1. Connect your GitHub repo
2. Set **Build Command**: `pip install -r requirements.txt`
3. Set **Start Command**: `uvicorn whatsapp_agent.main:app --host 0.0.0.0 --port $PORT`
4. Add environment variables in the Render dashboard

### Fly.io

```bash
fly launch
fly secrets set WHATSAPP_TOKEN=... ANTHROPIC_API_KEY=... ADMIN_API_KEY=...
fly deploy
```

---

## Architecture

```
WhatsApp User
     │
     ▼
Meta Cloud API ──POST──► /webhook (FastAPI)
                              │
                              ▼
                     claude_agent.chat()
                              │
                    ┌─────────┴──────────┐
                    │                    │
             Claude API            Tool calls
          (claude-sonnet-4-6)    (save_lead / save_appointment /
                    │              cancel_appointment)
                    │                    │
                    └─────────┬──────────┘
                              │
                         SQLite DB
                              │
                              ▼
                    WhatsApp reply sent
```

---

## Notes

- **Conversation history** is stored in-memory — it resets on server restart. For persistence across restarts, migrate `_history` in `claude_agent.py` to use the `conversation_state` table.
- **Rate limits**: Meta's Cloud API has per-number limits. For high-volume broadcasts, add a delay between sends.
- **Message types**: The agent currently handles text, button replies, and list replies. Media messages (images, voice) are silently ignored.
