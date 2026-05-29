import json
import logging
import os
from typing import Any, Dict, List

import anthropic

from . import config, database

logger = logging.getLogger(__name__)

_client = anthropic.AsyncAnthropic(api_key=config.ANTHROPIC_API_KEY)

# Per-phone conversation history (in-memory; cleared on restart)
_history: Dict[str, List[Dict[str, Any]]] = {}


def _load_faq() -> str:
    faq_path = os.path.join(os.path.dirname(__file__), "faq.json")
    try:
        with open(faq_path) as f:
            data = json.load(f)
        lines = ["## Frequently Asked Questions"]
        for item in data.get("faqs", []):
            lines.append(f"Q: {item['question']}\nA: {item['answer']}")
        return "\n\n".join(lines)
    except Exception as exc:
        logger.warning("Could not load faq.json: %s", exc)
        return "No FAQ data available."


_FAQ: str = _load_faq()

_SYSTEM_PROMPT = f"""You are Ruflo, a warm, concise WhatsApp business assistant. You help customers:
1. Learn about products/services
2. Book appointments
3. Track orders and inquiries
4. Share their contact details (lead capture)

{_FAQ}

## Guidelines
- Keep replies under 300 characters when possible — this is WhatsApp.
- Greet new users and naturally collect their name, email, and service interest over the first few messages.
- When booking: collect service type, date, time, optional notes — then call save_appointment.
- When you have the customer's name and interest, call save_lead.
- For cancellations, ask for the appointment ID and call cancel_appointment.
- Answer FAQ questions directly. If not in the FAQ, respond helpfully.
"""

_TOOLS: List[Dict[str, Any]] = [
    {
        "name": "save_lead",
        "description": "Save a captured lead once you have the customer's name (email and interest are bonus).",
        "input_schema": {
            "type": "object",
            "properties": {
                "name": {"type": "string", "description": "Customer's full name"},
                "email": {"type": "string", "description": "Customer's email address"},
                "interest": {
                    "type": "string",
                    "description": "Product or service the customer is interested in",
                },
            },
            "required": ["name"],
        },
    },
    {
        "name": "save_appointment",
        "description": "Save a confirmed appointment booking.",
        "input_schema": {
            "type": "object",
            "properties": {
                "service": {"type": "string", "description": "Service being booked"},
                "date": {
                    "type": "string",
                    "description": "Appointment date, e.g. 2025-06-15",
                },
                "time": {
                    "type": "string",
                    "description": "Appointment time, e.g. 2:00 PM",
                },
                "notes": {
                    "type": "string",
                    "description": "Any additional notes (optional)",
                },
            },
            "required": ["service", "date", "time"],
        },
    },
    {
        "name": "cancel_appointment",
        "description": "Cancel an existing appointment by its numeric ID.",
        "input_schema": {
            "type": "object",
            "properties": {
                "appointment_id": {
                    "type": "integer",
                    "description": "The appointment ID to cancel",
                }
            },
            "required": ["appointment_id"],
        },
    },
]


async def _handle_tool(name: str, tool_input: Dict[str, Any], phone: str) -> str:
    if name == "save_lead":
        await database.upsert_lead(
            phone=phone,
            name=tool_input.get("name"),
            email=tool_input.get("email"),
            interest=tool_input.get("interest"),
        )
        return f"Lead saved for {tool_input.get('name', phone)}"

    if name == "save_appointment":
        appt_id = await database.create_appointment(
            lead_phone=phone,
            service=tool_input.get("service"),
            date=tool_input.get("date"),
            time=tool_input.get("time"),
            notes=tool_input.get("notes"),
        )
        return (
            f"Appointment #{appt_id} saved: {tool_input.get('service')} "
            f"on {tool_input.get('date')} at {tool_input.get('time')}"
        )

    if name == "cancel_appointment":
        appt_id = int(tool_input.get("appointment_id", 0))
        success = await database.cancel_appointment(appt_id, phone)
        return (
            f"Appointment #{appt_id} cancelled."
            if success
            else f"Appointment #{appt_id} not found or already cancelled."
        )

    return f"Unknown tool: {name}"


async def chat(phone: str, user_message: str) -> str:
    """Send a user message and return Claude's reply, executing any tool calls."""
    if phone not in _history:
        _history[phone] = []

    _history[phone].append({"role": "user", "content": user_message})

    # Cap history to avoid token overflow
    messages = _history[phone][-20:]

    response = await _client.messages.create(
        model="claude-sonnet-4-6",
        max_tokens=1024,
        system=_SYSTEM_PROMPT,
        tools=_TOOLS,
        messages=messages,
    )

    # Agentic tool-use loop
    while response.stop_reason == "tool_use":
        assistant_content = response.content
        tool_results = []

        for block in assistant_content:
            if block.type == "tool_use":
                result_text = await _handle_tool(block.name, block.input, phone)
                logger.info("Tool %s -> %s", block.name, result_text)
                tool_results.append(
                    {
                        "type": "tool_result",
                        "tool_use_id": block.id,
                        "content": result_text,
                    }
                )

        _history[phone].append({"role": "assistant", "content": assistant_content})
        _history[phone].append({"role": "user", "content": tool_results})

        messages = _history[phone][-20:]
        response = await _client.messages.create(
            model="claude-sonnet-4-6",
            max_tokens=1024,
            system=_SYSTEM_PROMPT,
            tools=_TOOLS,
            messages=messages,
        )

    # Extract final text
    reply = " ".join(
        block.text for block in response.content if hasattr(block, "text")
    ).strip()

    _history[phone].append({"role": "assistant", "content": reply})
    return reply


def clear_history(phone: str) -> None:
    """Remove conversation history for a phone number."""
    _history.pop(phone, None)
