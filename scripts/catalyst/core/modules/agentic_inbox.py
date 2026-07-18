"""
CatalystOS Module: Agentic Inbox
Source: cloudflare/agentic-inbox
Human-in-the-loop task queue — agents pause and request approval before acting
Adapted for CatalystOS by The Catalyst
"""

import datetime
import json
import uuid
import os


INBOX_FILE = os.path.join(os.path.dirname(__file__), "inbox.json")

PRIORITY_LEVELS = {"critical": 1, "high": 2, "medium": 3, "low": 4}


def _load_inbox() -> list:
    if os.path.exists(INBOX_FILE):
        with open(INBOX_FILE) as f:
            try:
                return json.load(f)
            except Exception:
                return []
    return []


def _save_inbox(inbox: list):
    with open(INBOX_FILE, "w") as f:
        json.dump(inbox, f, indent=2)


class AgenticInbox:
    """
    Human-in-the-loop task inbox.
    Agents submit tasks and wait for human approval before executing.
    """

    def submit(self, agent_name: str, task: str, action: str, payload: dict = None,
               priority: str = "medium", requires_approval: bool = True) -> dict:
        """Agent submits a task requesting human approval."""
        task_id = f"TASK-{uuid.uuid4().hex[:8].upper()}"
        item = {
            "id": task_id,
            "agent": agent_name,
            "task": task,
            "action": action,
            "payload": payload or {},
            "priority": priority,
            "priority_rank": PRIORITY_LEVELS.get(priority, 3),
            "requires_approval": requires_approval,
            "status": "PENDING",
            "submitted_at": datetime.datetime.now().isoformat(),
            "resolved_at": None,
            "resolution": None,
            "notes": None,
        }
        inbox = _load_inbox()
        inbox.append(item)
        _save_inbox(inbox)
        print(f"[AgenticInbox] Task submitted: {task_id} | Agent: {agent_name} | Priority: {priority.upper()}")
        return item

    def approve(self, task_id: str, notes: str = "") -> dict:
        """Human approves a pending task."""
        inbox = _load_inbox()
        for item in inbox:
            if item["id"] == task_id:
                item["status"] = "APPROVED"
                item["resolved_at"] = datetime.datetime.now().isoformat()
                item["resolution"] = "APPROVED"
                item["notes"] = notes
                _save_inbox(inbox)
                print(f"[AgenticInbox] ✅ APPROVED: {task_id}")
                return item
        return {"error": f"Task {task_id} not found"}

    def reject(self, task_id: str, reason: str = "") -> dict:
        """Human rejects a pending task."""
        inbox = _load_inbox()
        for item in inbox:
            if item["id"] == task_id:
                item["status"] = "REJECTED"
                item["resolved_at"] = datetime.datetime.now().isoformat()
                item["resolution"] = "REJECTED"
                item["notes"] = reason
                _save_inbox(inbox)
                print(f"[AgenticInbox] ❌ REJECTED: {task_id}")
                return item
        return {"error": f"Task {task_id} not found"}

    def list_pending(self) -> list:
        """List all pending tasks sorted by priority."""
        inbox = _load_inbox()
        pending = [i for i in inbox if i["status"] == "PENDING"]
        return sorted(pending, key=lambda x: x["priority_rank"])

    def list_all(self) -> list:
        return _load_inbox()

    def clear_resolved(self):
        inbox = _load_inbox()
        active = [i for i in inbox if i["status"] == "PENDING"]
        _save_inbox(active)
        print(f"[AgenticInbox] Cleared resolved tasks. {len(active)} pending remain.")

    def render_inbox(self) -> str:
        pending = self.list_pending()
        lines = [
            "╔══════════════════════════════════════════════════════════╗",
            "║          AGENTIC INBOX — CATALYSTOS                      ║",
            f"║  {datetime.datetime.now().strftime('%Y-%m-%d %H:%M')} | {len(pending)} tasks pending           ║",
            "╠══════════════════════════════════════════════════════════╣",
        ]
        if not pending:
            lines.append("║  No pending tasks. All agents are clear.                  ║")
        else:
            for item in pending:
                lines += [
                    f"║  [{item['priority'].upper():8}] {item['id']}                          ║",
                    f"║  Agent: {item['agent']:<20}                            ║",
                    f"║  Task:  {item['task'][:48]:<48}  ║",
                    f"║  Action: {item['action'][:47]:<47} ║",
                    "║  " + "-" * 56 + "  ║",
                ]
        lines.append("╚══════════════════════════════════════════════════════════╝")
        return "\n".join(lines)


# Pre-built CatalystOS agents that use the inbox
class CatalystAgents:

    def __init__(self):
        self.inbox = AgenticInbox()

    def legal_agent(self, task_desc: str, document_type: str, case_notes: str):
        return self.inbox.submit(
            agent_name="LegalAgent",
            task=task_desc,
            action=f"Generate {document_type} for Abegbe Agboola Chambers",
            payload={"document_type": document_type, "case_notes": case_notes[:200]},
            priority="high",
        )

    def content_agent(self, task_desc: str, platform: str, brief: str):
        return self.inbox.submit(
            agent_name="ContentAgent",
            task=task_desc,
            action=f"Publish content to {platform}",
            payload={"platform": platform, "brief": brief[:200]},
            priority="medium",
        )

    def trade_agent(self, ticker: str, action: str, amount_usd: float):
        return self.inbox.submit(
            agent_name="AutoHedgeExecutor",
            task=f"Execute {action} order for {ticker}",
            action=f"{action} ${amount_usd:,.2f} of {ticker}",
            payload={"ticker": ticker, "action": action, "amount": amount_usd},
            priority="critical",
            requires_approval=True,
        )

    def event_agent(self, task_desc: str, vendor: str, commitment_amount: float):
        return self.inbox.submit(
            agent_name="SneakersFestAgent",
            task=task_desc,
            action=f"Commit ₦{commitment_amount:,.0f} to vendor: {vendor}",
            payload={"vendor": vendor, "commitment": commitment_amount},
            priority="high",
        )


if __name__ == "__main__":
    agents = CatalystAgents()
    agents.legal_agent("Draft affidavit for matter 004", "affidavit", "Client alleges breach of contract...")
    agents.content_agent("Post Great Sabotage Part 10", "Substack", "The article is about upstream thinking...")
    agents.trade_agent("AAPL", "BUY", 5000)
    agents.event_agent("Book DJ for Sneakers Fest", "SoundLab Lagos", 250000)
    print(agents.inbox.render_inbox())
