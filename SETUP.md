# Sneakers Fest — AI Stack Setup

All 6 AI tools running locally in 5 minutes.

## Requirements

- Docker + Docker Compose
- 8GB RAM minimum (16GB recommended)
- 20GB free disk space

## Start Everything

```bash
# Clone the repo
git clone https://github.com/farouqagboola94-max/ruflo.git
cd ruflo

# Start all services
docker compose up -d

# Pull an LLM (do this once, ~2GB download)
docker exec sneakers-ollama ollama pull llama3.2
```

## Service URLs

| Service | URL | Credentials |
|---------|-----|-------------|
| **Sneakers Fest Website** | http://localhost:5173 | — |
| **AI Backend** (rembg + Whisper) | http://localhost:8000 | — |
| **Ollama** (LLM API) | http://localhost:11434 | — |
| **Open WebUI** (Chat UI) | http://localhost:3000 | Create on first visit |
| **Listmonk** (Newsletter) | http://localhost:9000 | admin / sneakersfest2026 |
| **Activepieces** (Automation) | http://localhost:8080 | Create on first visit |
| **AnythingLLM** (RAG Chatbot) | http://localhost:3001 | Create on first visit |

## Start the React Website

```bash
npm install
npm run dev
# Open http://localhost:5173
```

## Setup Listmonk Newsletter

1. Open http://localhost:9000/admin
2. Login: `admin` / `sneakersfest2026`
3. Go to **Lists** → **New List** → name it "Sneakers Fest Community"
4. Copy the **UUID** from the list
5. Add to `.env.local`:
   ```
   VITE_LISTMONK_LIST_UUID=paste-uuid-here
   ```
6. Restart the dev server

## Setup Activepieces Automations

1. Open http://localhost:8080
2. Create an account
3. **Recommended flows to build:**
   - New Listmonk subscriber → Send welcome DM on Instagram
   - New ticket purchase → Post to WhatsApp community
   - Weekly → Auto-post event countdown to all platforms
   - New community member → Add to Listmonk list

## Setup AnythingLLM (RAG Chatbot)

1. Open http://localhost:3001
2. Create workspace: "Sneakers Fest"
3. Set LLM: Ollama → llama3.2
4. Upload documents: FAQ, lineup info, ticket details
5. Embed the chatbot on your site using the embed code

## AI Chat Widget (Ollama)

The floating chat button (bottom-left) connects to Ollama automatically once it's running. It's pre-configured with Sneakers Fest context.

## Photo Tools

The Creator Studio section on the website sends files to the backend:
- **BG Remover**: Upload any sneaker photo → get PNG with transparent background
- **Transcriber**: Upload interview audio/video → get text transcript

Both work automatically once `docker compose up -d` is running.

## Stop Everything

```bash
docker compose down
```

## Production Deployment

For production, you'll need a VPS (Hetzner CX21 = ~€5/month works for CPU inference):

```bash
# On your VPS:
git clone https://github.com/farouqagboola94-max/ruflo.git
cd ruflo
docker compose up -d
```

Then update `.env.local` with your VPS IP/domain.
