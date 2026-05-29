import logging
from contextlib import asynccontextmanager
from typing import Any, Dict, List

from fastapi import Depends, FastAPI, Header, HTTPException, Request
from fastapi.responses import PlainTextResponse

from . import claude_agent, config, database
from . import whatsapp as wa
from .models import BroadcastRequest

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s %(levelname)s %(name)s: %(message)s",
)
logger = logging.getLogger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI):  # type: ignore[type-arg]
    await database.init_db()
    yield


app = FastAPI(
    title="Ruflo WhatsApp Business Agent",
    description="AI-powered WhatsApp agent for lead capture, appointments, and broadcasts.",
    version="1.0.0",
    lifespan=lifespan,
)


# ── Auth helper ────────────────────────────────────────────────────────────────


def _require_admin(x_api_key: str = Header(..., alias="X-API-Key")) -> None:
    if not config.ADMIN_API_KEY or x_api_key != config.ADMIN_API_KEY:
        raise HTTPException(status_code=401, detail="Invalid or missing API key")


# ── Webhook ────────────────────────────────────────────────────────────────────


@app.get("/webhook", response_class=PlainTextResponse)
async def verify_webhook(request: Request) -> str:
    """Meta webhook verification handshake."""
    params = dict(request.query_params)
    mode = params.get("hub.mode")
    token = params.get("hub.verify_token")
    challenge = params.get("hub.challenge", "")

    if mode == "subscribe" and token == config.WHATSAPP_VERIFY_TOKEN:
        logger.info("Webhook verified successfully")
        return challenge

    raise HTTPException(status_code=403, detail="Webhook verification failed")


@app.post("/webhook")
async def receive_webhook(request: Request) -> Dict[str, Any]:
    """Receive and process incoming WhatsApp messages."""
    try:
        body = await request.json()
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid JSON body")

    if body.get("object") != "whatsapp_business_account":
        return {"status": "ignored"}

    for entry in body.get("entry", []):
        for change in entry.get("changes", []):
            value = change.get("value", {})
            for msg in value.get("messages", []):
                phone: str = msg.get("from", "")
                text = wa.extract_message_text(msg)

                if not phone or text is None:
                    continue

                logger.info("Incoming from %s: %.80s", phone, text)

                try:
                    reply = await claude_agent.chat(phone, text)
                    await wa.send_text_message(phone, reply)
                except Exception as exc:
                    logger.exception("Error handling message from %s: %s", phone, exc)
                    await wa.send_text_message(
                        phone,
                        "Sorry, I'm having a technical issue. Please try again shortly!",
                    )

    return {"status": "ok"}


# ── Broadcast ──────────────────────────────────────────────────────────────────


@app.post("/broadcast", dependencies=[Depends(_require_admin)])
async def broadcast(req: BroadcastRequest) -> Dict[str, Any]:
    """Send a message to a list of phone numbers (or all captured leads)."""
    if req.phone_numbers == ["all"]:
        phones = await database.get_all_lead_phones()
    else:
        phones = req.phone_numbers

    sent = failed = 0
    for phone in phones:
        if await wa.send_text_message(phone, req.message):
            sent += 1
        else:
            failed += 1

    await database.log_broadcast(req.message, sent)
    return {"sent": sent, "failed": failed, "total": len(phones)}


# ── Admin dashboard ────────────────────────────────────────────────────────────


@app.get("/admin/leads", dependencies=[Depends(_require_admin)])
async def admin_leads() -> List[Dict[str, Any]]:
    return await database.get_all_leads()


@app.get("/admin/appointments", dependencies=[Depends(_require_admin)])
async def admin_appointments() -> List[Dict[str, Any]]:
    return await database.get_all_appointments()


@app.get("/admin/broadcasts", dependencies=[Depends(_require_admin)])
async def admin_broadcasts() -> List[Dict[str, Any]]:
    return await database.get_all_broadcasts()


# ── Health ─────────────────────────────────────────────────────────────────────


@app.get("/health")
async def health() -> Dict[str, str]:
    return {"status": "ok", "service": "Ruflo WhatsApp Business Agent"}
