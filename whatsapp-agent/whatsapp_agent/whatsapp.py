import logging
from typing import Any, Dict, List, Optional

import httpx

from . import config

logger = logging.getLogger(__name__)

_BASE_URL = "https://graph.facebook.com/v19.0"
_WA_TEXT_MAX = 4096  # WhatsApp text message character limit


def _headers() -> Dict[str, str]:
    return {
        "Authorization": f"Bearer {config.WHATSAPP_TOKEN}",
        "Content-Type": "application/json",
    }


def _messages_url() -> str:
    return f"{_BASE_URL}/{config.WHATSAPP_PHONE_NUMBER_ID}/messages"


def _truncate(text: str, limit: int = _WA_TEXT_MAX) -> str:
    if len(text) <= limit:
        return text
    return text[: limit - 3] + "..."


async def send_text_message(to: str, body: str) -> bool:
    payload = {
        "messaging_product": "whatsapp",
        "recipient_type": "individual",
        "to": to,
        "type": "text",
        "text": {"preview_url": False, "body": _truncate(body)},
    }
    async with httpx.AsyncClient(timeout=30.0) as client:
        resp = await client.post(_messages_url(), json=payload, headers=_headers())
    if resp.status_code != 200:
        logger.error("WhatsApp send failed %s: %s", resp.status_code, resp.text)
        return False
    return True


async def send_interactive_buttons(
    to: str, body_text: str, buttons: List[Dict[str, str]]
) -> bool:
    """
    buttons: list of {"id": "...", "title": "..."} — max 3, title max 20 chars.
    """
    payload = {
        "messaging_product": "whatsapp",
        "recipient_type": "individual",
        "to": to,
        "type": "interactive",
        "interactive": {
            "type": "button",
            "body": {"text": _truncate(body_text, 1024)},
            "action": {
                "buttons": [
                    {
                        "type": "reply",
                        "reply": {"id": b["id"], "title": b["title"][:20]},
                    }
                    for b in buttons[:3]
                ]
            },
        },
    }
    async with httpx.AsyncClient(timeout=30.0) as client:
        resp = await client.post(_messages_url(), json=payload, headers=_headers())
    if resp.status_code != 200:
        logger.error(
            "WhatsApp button send failed %s: %s", resp.status_code, resp.text
        )
        return False
    return True


async def send_list_message(
    to: str,
    body_text: str,
    button_text: str,
    sections: List[Dict[str, Any]],
) -> bool:
    """
    sections: [{"title": "...", "rows": [{"id": "...", "title": "...", "description": "..."}]}]
    """
    payload = {
        "messaging_product": "whatsapp",
        "recipient_type": "individual",
        "to": to,
        "type": "interactive",
        "interactive": {
            "type": "list",
            "body": {"text": _truncate(body_text, 1024)},
            "action": {"button": button_text[:20], "sections": sections},
        },
    }
    async with httpx.AsyncClient(timeout=30.0) as client:
        resp = await client.post(_messages_url(), json=payload, headers=_headers())
    if resp.status_code != 200:
        logger.error(
            "WhatsApp list send failed %s: %s", resp.status_code, resp.text
        )
        return False
    return True


def extract_message_text(msg: Dict[str, Any]) -> Optional[str]:
    """Return the plain text of any incoming message type, or None if unsupported."""
    msg_type = msg.get("type")
    if msg_type == "text":
        return msg.get("text", {}).get("body", "")
    if msg_type == "interactive":
        interactive = msg.get("interactive", {})
        inter_type = interactive.get("type")
        if inter_type == "button_reply":
            return interactive.get("button_reply", {}).get("title", "")
        if inter_type == "list_reply":
            return interactive.get("list_reply", {}).get("title", "")
    return None


def extract_interactive_id(msg: Dict[str, Any]) -> Optional[str]:
    """Return the reply ID for interactive messages."""
    if msg.get("type") == "interactive":
        interactive = msg.get("interactive", {})
        inter_type = interactive.get("type")
        if inter_type == "button_reply":
            return interactive.get("button_reply", {}).get("id")
        if inter_type == "list_reply":
            return interactive.get("list_reply", {}).get("id")
    return None
