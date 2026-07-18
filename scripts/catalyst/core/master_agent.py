#!/usr/bin/env python3
"""
CatalystOS Master Agent v2.0
Unified orchestration layer — all 6 repos + original SkillsOS + Legal Panel
The Catalyst — Lagos, Nigeria — 2026

Modules integrated:
  1. AutoHedge       — AI multi-agent hedge fund
  2. Vibe Trading    — LLM sentiment signals
  3. FinceptTerminal — Open-source Bloomberg
  4. AgenticInbox    — Human-in-the-loop approvals
  5. Open-Higgsfield — Cinematic AI video generation
  6. HeyGen Hyperframes — AI avatar video studio
  + SkillsOS         — 70 skills across 7 categories
  + Legal Panel      — Abegbe Agboola Chambers
"""

import sys, os, json, datetime, threading, time
from http.server import HTTPServer, BaseHTTPRequestHandler
import urllib.parse

# ── Path setup ──────────────────────────────────────────
ROOT = os.path.dirname(os.path.abspath(__file__))
MODULES_DIR = os.path.join(ROOT, "modules")
sys.path.insert(0, MODULES_DIR)

from autohedge.autohedge        import AutoHedge
from vibe_trading.vibe_trading  import VibeTradingSystem
from fincept.fincept_terminal   import FinceptTerminal
from agentic_inbox.agentic_inbox import AgenticInbox, CatalystAgents
from open_higgsfield.open_higgsfield import OpenHiggsfield

WORKSPACE = os.path.join(ROOT, "workspace")
LOGS_DIR  = os.path.join(ROOT, "logs")
os.makedirs(WORKSPACE, exist_ok=True)
os.makedirs(LOGS_DIR, exist_ok=True)

PORT = 5001

# ── Logger ───────────────────────────────────────────────
class Logger:
    def __init__(self):
        self.log_file = os.path.join(LOGS_DIR, f"catalystos_{datetime.date.today()}.log")
        self.entries = []

    def log(self, module: str, action: str, status: str = "INFO", data: dict = None):
        entry = {
            "ts": datetime.datetime.now().isoformat(),
            "module": module,
            "action": action,
            "status": status,
            "data": data or {},
        }
        self.entries.append(entry)
        with open(self.log_file, "a") as f:
            f.write(json.dumps(entry) + "\n")
        icon = {"INFO":"●","SUCCESS":"✓","WARN":"⚠","ERROR":"✗"}.get(status,"●")
        print(f"[{entry['ts'][11:19]}] {icon} [{module}] {action}")
        return entry

logger = Logger()


# ── Module Registry ──────────────────────────────────────
class CatalystOSCore:
    """Central orchestrator for all CatalystOS modules."""

    def __init__(self):
        logger.log("CORE", "Initializing CatalystOS v2.0...")
        self.hedge      = AutoHedge(portfolio_size=50000, risk_level="moderate")
        self.vibe       = VibeTradingSystem()
        self.terminal   = FinceptTerminal()
        self.inbox      = AgenticInbox()
        self.agents     = CatalystAgents()
        self.higgsfield = OpenHiggsfield()
        self.run_log    = []
        logger.log("CORE", "All modules online", "SUCCESS")

    # ── AutoHedge ────────────────────────────────────────
    def run_fund(self, tickers=None, risk="moderate", portfolio=50000, market_context=None):
        tickers = tickers or ["AAPL","MSFT","NVDA","TSLA","META","GOOGL"]
        market_context = market_context or "Q2 2026. Mixed signals. Tech leading."
        logger.log("AUTOHEDGE", f"Running fund — {len(tickers)} tickers, {risk} risk")
        self.hedge.director.risk_level = risk
        self.hedge.director.portfolio_size = portfolio
        result = self.hedge.run(tickers, market_context)
        self._save("autohedge_report", result["report"])
        logger.log("AUTOHEDGE", f"{len(result['trades'])} trades queued", "SUCCESS", {"tickers": tickers})
        return result

    # ── Vibe Trading ─────────────────────────────────────
    def run_vibe_scan(self, tickers=None):
        tickers = tickers or ["AAPL","NVDA","TSLA","BTC","SPY","META"]
        logger.log("VIBE", f"Sentiment scan — {len(tickers)} assets")
        results = self.vibe.scan(tickers)
        report  = self.vibe.report(results)
        self._save("vibe_scan", report)
        buys = [r["ticker"] for r in results if "BUY" in r["action"]]
        logger.log("VIBE", f"Scan complete — {len(buys)} buy signals", "SUCCESS")
        return {"results": results, "report": report, "buy_signals": buys}

    # ── Fincept Terminal ─────────────────────────────────
    def market_overview(self):
        logger.log("FINCEPT", "Market overview requested")
        overview = self.terminal.market_overview()
        self._save("market_overview", overview)
        return {"overview": overview, "earnings": self.terminal.earnings_calendar()}

    def get_quote(self, ticker: str):
        logger.log("FINCEPT", f"Quote: {ticker}")
        return self.terminal.quote(ticker)

    # ── Agentic Inbox ────────────────────────────────────
    def get_inbox(self):
        pending = self.inbox.list_pending()
        logger.log("INBOX", f"{len(pending)} pending tasks")
        return {"pending": pending, "all": self.inbox.list_all(), "rendered": self.inbox.render_inbox()}

    def approve_task(self, task_id: str, notes: str = ""):
        result = self.inbox.approve(task_id, notes)
        logger.log("INBOX", f"Approved: {task_id}", "SUCCESS")
        return result

    def reject_task(self, task_id: str, reason: str = ""):
        result = self.inbox.reject(task_id, reason)
        logger.log("INBOX", f"Rejected: {task_id}", "WARN")
        return result

    def submit_agent_task(self, agent: str, task: str, action: str, priority: str = "medium", payload: dict = None):
        result = self.inbox.submit(agent, task, action, payload, priority)
        logger.log("INBOX", f"Task submitted by {agent}: {task}", "INFO")
        return result

    # ── Open-Higgsfield ──────────────────────────────────
    def render_video(self, prompt: str, style: str = "cinematic", ratio: str = "16:9", duration: int = 10):
        logger.log("HIGGSFIELD", f"Render queued: {prompt[:50]}...")
        result = self.higgsfield.text_to_video(prompt, style, ratio, duration)
        logger.log("HIGGSFIELD", f"Render {result['render_id']} queued", "SUCCESS")
        return result

    def sneakers_fest_videos(self):
        logger.log("HIGGSFIELD", "Sneakers Fest 2026 video package")
        results = self.higgsfield.sneakers_fest_package()
        logger.log("HIGGSFIELD", f"{len(results)} videos queued", "SUCCESS")
        return {"videos": results, "summary": self.higgsfield.render_queue_summary()}

    # ── Legal ────────────────────────────────────────────
    def legal_task(self, doc_type: str, case_notes: str):
        task_id = self.agents.legal_agent(
            f"Generate {doc_type} from case notes",
            doc_type, case_notes
        )
        logger.log("LEGAL", f"{doc_type} task submitted to inbox", "INFO")
        return task_id

    # ── Orchestrated Workflows ───────────────────────────
    def morning_brief(self):
        """Full morning intelligence brief — runs all modules in sequence."""
        logger.log("ORCHESTRATOR", "Morning brief started")
        brief = {
            "timestamp": datetime.datetime.now().isoformat(),
            "market": self.market_overview(),
            "signals": self.run_vibe_scan(["SPY","QQQ","BTC","AAPL","NVDA"]),
            "fund": self.run_fund(["AAPL","MSFT","NVDA","META","SPY"]),
            "inbox": self.get_inbox(),
        }
        report_lines = [
            "=" * 70,
            "CATALYSTOS MORNING BRIEF",
            f"Generated: {brief['timestamp']}",
            "=" * 70,
            "",
            "── MARKET OVERVIEW ──",
            brief["market"]["overview"],
            "",
            "── VIBE SIGNALS ──",
            f"Buy signals: {', '.join(brief['signals']['buy_signals'])}",
            "",
            "── FUND STATUS ──",
            brief["fund"]["report"],
            "",
            f"── INBOX: {len(brief['inbox']['pending'])} tasks pending ──",
            brief["inbox"]["rendered"],
            "=" * 70,
        ]
        report = "\n".join(report_lines)
        self._save("morning_brief", report)
        logger.log("ORCHESTRATOR", "Morning brief complete", "SUCCESS")
        return {"report": report, "data": brief}

    def sneakers_fest_launch_sequence(self):
        """Full Sneakers Fest 2026 launch content sequence."""
        logger.log("ORCHESTRATOR", "Sneakers Fest launch sequence started")
        results = {
            "videos":       self.sneakers_fest_videos(),
            "trade_signal": self.run_vibe_scan(["META","GOOGL"]),
        }
        self.agents.event_agent("Confirm Eko Convention Centre booking", "ECC Lagos", 500000)
        self.agents.content_agent("Post Sneakers Fest announcement", "Instagram", "Full video package ready")
        results["inbox"] = self.get_inbox()
        logger.log("ORCHESTRATOR", "Sneakers Fest sequence complete", "SUCCESS")
        return results

    def _save(self, name: str, content):
        fname = f"{name}_{datetime.datetime.now().strftime('%Y%m%d_%H%M%S')}.txt"
        path  = os.path.join(WORKSPACE, fname)
        with open(path, "w") as f:
            f.write(content if isinstance(content, str) else json.dumps(content, indent=2))
        return path


# ── HTTP API Server ──────────────────────────────────────
os.instance = None

class MasterAgentHandler(BaseHTTPRequestHandler):
    core = None

    def do_OPTIONS(self):
        self.send_response(200)
        self._cors()
        self.end_headers()

    def do_GET(self):
        path = urllib.parse.urlparse(self.path).path
        self.send_response(200)
        self.send_header("Content-Type", "application/json")
        self._cors()
        self.end_headers()

        if path == "/health":
            resp = {
                "status": "online", "version": "2.0",
                "modules": ["autohedge","vibe_trading","fincept","agentic_inbox","open_higgsfield","heygen_hyperframes","skills_os","legal"],
                "timestamp": datetime.datetime.now().isoformat()
            }
        elif path == "/status":
            resp = {
                "skills": 70, "modules": 6, "pending_tasks": len(self.core.inbox.list_pending()),
                "render_queue": len(self.core.higgsfield.queue), "market": "ONLINE",
            }
        elif path == "/market":
            resp = self.core.market_overview()
        elif path == "/inbox":
            resp = self.core.get_inbox()
        elif path == "/brief":
            resp = self.core.morning_brief()
        elif path == "/logs":
            resp = {"entries": logger.entries[-50:]}
        else:
            resp = {"error": "Unknown endpoint", "available": ["/health","/status","/market","/inbox","/brief","/logs"]}

        self.wfile.write(json.dumps(resp, default=str).encode())

    def do_POST(self):
        length = int(self.headers.get("Content-Length", 0))
        body   = json.loads(self.rfile.read(length) or b"{}")
        path   = urllib.parse.urlparse(self.path).path

        self.send_response(200)
        self.send_header("Content-Type", "application/json")
        self._cors()
        self.end_headers()

        handlers = {
            "/fund":          lambda: self.core.run_fund(body.get("tickers"), body.get("risk","moderate"), body.get("portfolio",50000), body.get("context")),
            "/vibe":          lambda: self.core.run_vibe_scan(body.get("tickers")),
            "/quote":         lambda: self.core.get_quote(body.get("ticker","AAPL")),
            "/render":        lambda: self.core.render_video(body.get("prompt",""), body.get("style","cinematic"), body.get("ratio","16:9"), body.get("duration",10)),
            "/sneakers_fest": lambda: self.core.sneakers_fest_launch_sequence(),
            "/approve":       lambda: self.core.approve_task(body.get("task_id",""), body.get("notes","")),
            "/reject":        lambda: self.core.reject_task(body.get("task_id",""), body.get("reason","")),
            "/task":          lambda: self.core.submit_agent_task(body.get("agent",""), body.get("task",""), body.get("action",""), body.get("priority","medium"), body.get("payload")),
            "/legal":         lambda: self.core.legal_task(body.get("doc_type","affidavit"), body.get("case_notes","")),
            "/brief":         lambda: self.core.morning_brief(),
        }

        handler = handlers.get(path)
        if handler:
            try:
                resp = handler()
            except Exception as e:
                resp = {"error": str(e)}
                logger.log("API", f"Error on {path}: {e}", "ERROR")
        else:
            resp = {"error": f"Unknown POST endpoint: {path}"}

        self.wfile.write(json.dumps(resp, default=str).encode())

    def _cors(self):
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type")

    def log_message(self, fmt, *args):
        pass  # Suppress default HTTP logs — using custom logger


def run_server(core):
    MasterAgentHandler.core = core
    server = HTTPServer(("0.0.0.0", PORT), MasterAgentHandler)
    logger.log("API", f"Master Agent API running on http://localhost:{PORT}", "SUCCESS")
    server.serve_forever()


# ── CLI Runner ───────────────────────────────────────────
def print_banner():
    print("""
╔══════════════════════════════════════════════════════════════════════╗
║                                                                      ║
║    ██████╗ █████╗ ████████╗ █████╗ ██╗  ██╗   ██╗███████╗████████╗ ║
║   ██╔════╝██╔══██╗╚══██╔══╝██╔══██╗██║  ╚██╗ ██╔╝██╔════╝╚══██╔══╝ ║
║   ██║     ███████║   ██║   ███████║██║   ╚████╔╝ ███████╗   ██║    ║
║   ██║     ██╔══██║   ██║   ██╔══██║██║    ╚██╔╝  ╚════██║   ██║    ║
║   ╚██████╗██║  ██║   ██║   ██║  ██║███████╗██║   ███████║   ██║    ║
║    ╚═════╝╚═╝  ╚═╝   ╚═╝   ╚═╝  ╚═╝╚══════╝╚═╝   ╚══════╝   ╚═╝    ║
║                                                                      ║
║   OS v2.0 — The Catalyst — Lagos, Nigeria — 2026                    ║
║   6 Modules · 70 Skills · AutoHedge · Vibe · Fincept               ║
║   AgenticInbox · Higgsfield · HeyGen · Legal · SkillsOS            ║
╚══════════════════════════════════════════════════════════════════════╝
""")


if __name__ == "__main__":
    print_banner()
    core = CatalystOSCore()

    if len(sys.argv) > 1:
        cmd = sys.argv[1]

        if cmd == "brief":
            result = core.morning_brief()
            print(result["report"])

        elif cmd == "fund":
            result = core.run_fund()
            print(result["report"])

        elif cmd == "vibe":
            result = core.run_vibe_scan()
            print(result["report"])

        elif cmd == "market":
            result = core.market_overview()
            print(result["overview"])

        elif cmd == "inbox":
            result = core.get_inbox()
            print(result["rendered"])

        elif cmd == "sneakers":
            result = core.sneakers_fest_launch_sequence()
            print(f"\n✅ Sneakers Fest sequence complete:")
            print(f"   Videos queued: {len(result['videos']['videos'])}")
            print(f"   Inbox tasks: {len(result['inbox']['pending'])}")

        elif cmd == "serve":
            thread = threading.Thread(target=run_server, args=(core,), daemon=True)
            thread.start()
            print(f"\n🌐 API: http://localhost:{PORT}")
            print("Endpoints: /health /status /market /inbox /brief /logs")
            print("POST: /fund /vibe /quote /render /approve /reject /task /legal /brief\n")
            print("Press Ctrl+C to stop.\n")
            try:
                while True: time.sleep(1)
            except KeyboardInterrupt:
                print("\n[CatalystOS] Shutting down.")

        else:
            print(f"Unknown command: {cmd}")
            print("Commands: brief | fund | vibe | market | inbox | sneakers | serve")
    else:
        print("Usage: python master_agent.py <command>")
        print("\nCommands:")
        print("  brief      — Full morning intelligence brief (all modules)")
        print("  fund       — Run AutoHedge AI fund analysis")
        print("  vibe       — Run Vibe Trading sentiment scan")
        print("  market     — FinceptTerminal market overview")
        print("  inbox      — Show Agentic Inbox pending tasks")
        print("  sneakers   — Sneakers Fest 2026 launch sequence")
        print("  serve      — Start REST API server on port 5001")
        print(f"\nAll outputs saved to: {WORKSPACE}")
