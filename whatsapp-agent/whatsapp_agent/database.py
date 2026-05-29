import json
import logging
from datetime import datetime
from typing import Any, Dict, List, Optional

import aiosqlite

from . import config

logger = logging.getLogger(__name__)
DB_PATH = config.DATABASE_PATH


async def init_db() -> None:
    async with aiosqlite.connect(DB_PATH) as db:
        await db.execute("""
            CREATE TABLE IF NOT EXISTS leads (
                id         INTEGER PRIMARY KEY AUTOINCREMENT,
                phone      TEXT    UNIQUE NOT NULL,
                name       TEXT,
                email      TEXT,
                interest   TEXT,
                created_at TEXT    NOT NULL DEFAULT (datetime('now'))
            )
        """)
        await db.execute("""
            CREATE TABLE IF NOT EXISTS appointments (
                id         INTEGER PRIMARY KEY AUTOINCREMENT,
                lead_phone TEXT    NOT NULL,
                service    TEXT,
                date       TEXT,
                time       TEXT,
                notes      TEXT,
                status     TEXT    NOT NULL DEFAULT 'confirmed',
                created_at TEXT    NOT NULL DEFAULT (datetime('now'))
            )
        """)
        await db.execute("""
            CREATE TABLE IF NOT EXISTS broadcasts (
                id               INTEGER PRIMARY KEY AUTOINCREMENT,
                message          TEXT    NOT NULL,
                recipients_count INTEGER NOT NULL DEFAULT 0,
                sent_at          TEXT    NOT NULL DEFAULT (datetime('now'))
            )
        """)
        await db.execute("""
            CREATE TABLE IF NOT EXISTS conversation_state (
                phone        TEXT PRIMARY KEY,
                state        TEXT NOT NULL DEFAULT 'new',
                context_json TEXT NOT NULL DEFAULT '{}',
                updated_at   TEXT NOT NULL DEFAULT (datetime('now'))
            )
        """)
        await db.commit()
    logger.info("Database ready at %s", DB_PATH)


async def upsert_lead(
    phone: str,
    name: Optional[str] = None,
    email: Optional[str] = None,
    interest: Optional[str] = None,
) -> None:
    async with aiosqlite.connect(DB_PATH) as db:
        await db.execute(
            """
            INSERT INTO leads (phone, name, email, interest, created_at)
            VALUES (?, ?, ?, ?, ?)
            ON CONFLICT(phone) DO UPDATE SET
                name     = COALESCE(excluded.name,     leads.name),
                email    = COALESCE(excluded.email,    leads.email),
                interest = COALESCE(excluded.interest, leads.interest)
            """,
            (phone, name, email, interest, datetime.utcnow().isoformat()),
        )
        await db.commit()


async def get_lead(phone: str) -> Optional[Dict[str, Any]]:
    async with aiosqlite.connect(DB_PATH) as db:
        db.row_factory = aiosqlite.Row
        async with db.execute(
            "SELECT * FROM leads WHERE phone = ?", (phone,)
        ) as cursor:
            row = await cursor.fetchone()
            return dict(row) if row else None


async def get_all_leads() -> List[Dict[str, Any]]:
    async with aiosqlite.connect(DB_PATH) as db:
        db.row_factory = aiosqlite.Row
        async with db.execute(
            "SELECT * FROM leads ORDER BY created_at DESC"
        ) as cursor:
            rows = await cursor.fetchall()
            return [dict(r) for r in rows]


async def create_appointment(
    lead_phone: str,
    service: Optional[str],
    date: Optional[str],
    time: Optional[str],
    notes: Optional[str],
) -> int:
    async with aiosqlite.connect(DB_PATH) as db:
        cursor = await db.execute(
            """
            INSERT INTO appointments (lead_phone, service, date, time, notes, status, created_at)
            VALUES (?, ?, ?, ?, ?, 'confirmed', ?)
            """,
            (lead_phone, service, date, time, notes, datetime.utcnow().isoformat()),
        )
        await db.commit()
        return cursor.lastrowid  # type: ignore[return-value]


async def cancel_appointment(appointment_id: int, phone: str) -> bool:
    async with aiosqlite.connect(DB_PATH) as db:
        cursor = await db.execute(
            "UPDATE appointments SET status = 'cancelled' WHERE id = ? AND lead_phone = ?",
            (appointment_id, phone),
        )
        await db.commit()
        return cursor.rowcount > 0


async def get_all_appointments() -> List[Dict[str, Any]]:
    async with aiosqlite.connect(DB_PATH) as db:
        db.row_factory = aiosqlite.Row
        async with db.execute(
            "SELECT * FROM appointments ORDER BY created_at DESC"
        ) as cursor:
            rows = await cursor.fetchall()
            return [dict(r) for r in rows]


async def log_broadcast(message: str, recipients_count: int) -> int:
    async with aiosqlite.connect(DB_PATH) as db:
        cursor = await db.execute(
            "INSERT INTO broadcasts (message, recipients_count, sent_at) VALUES (?, ?, ?)",
            (message, recipients_count, datetime.utcnow().isoformat()),
        )
        await db.commit()
        return cursor.lastrowid  # type: ignore[return-value]


async def get_all_broadcasts() -> List[Dict[str, Any]]:
    async with aiosqlite.connect(DB_PATH) as db:
        db.row_factory = aiosqlite.Row
        async with db.execute(
            "SELECT * FROM broadcasts ORDER BY sent_at DESC"
        ) as cursor:
            rows = await cursor.fetchall()
            return [dict(r) for r in rows]


async def get_all_lead_phones() -> List[str]:
    async with aiosqlite.connect(DB_PATH) as db:
        async with db.execute("SELECT phone FROM leads") as cursor:
            rows = await cursor.fetchall()
            return [r[0] for r in rows]


async def get_conversation_state(phone: str) -> Dict[str, Any]:
    async with aiosqlite.connect(DB_PATH) as db:
        db.row_factory = aiosqlite.Row
        async with db.execute(
            "SELECT * FROM conversation_state WHERE phone = ?", (phone,)
        ) as cursor:
            row = await cursor.fetchone()
            if row:
                d = dict(row)
                d["context"] = json.loads(d.get("context_json", "{}"))
                return d
            return {"phone": phone, "state": "new", "context": {}}


async def set_conversation_state(
    phone: str, state: str, context: Dict[str, Any]
) -> None:
    async with aiosqlite.connect(DB_PATH) as db:
        await db.execute(
            """
            INSERT INTO conversation_state (phone, state, context_json, updated_at)
            VALUES (?, ?, ?, ?)
            ON CONFLICT(phone) DO UPDATE SET
                state        = excluded.state,
                context_json = excluded.context_json,
                updated_at   = excluded.updated_at
            """,
            (phone, state, json.dumps(context), datetime.utcnow().isoformat()),
        )
        await db.commit()
