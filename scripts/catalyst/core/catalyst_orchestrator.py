#!/usr/bin/env python3
"""
CatalystOS Master Orchestrator v2.0
Unified command system integrating all 6 external modules.

Modules:
  01 — AutoHedge        (The-Swarm-Corporation/AutoHedge)
  02 — Vibe Trading     (HKUDS/Vibe-Trading)
  03 — FinceptTerminal  (Fincept-Corporation/FinceptTerminal)
  04 — Agentic Inbox    (cloudflare/agentic-inbox)
  05 — Open-Higgsfield  (Anil-matcha/Open-Higgsfield-AI)
  06 — HeyGen Hyperframes (heygen-com/hyperframes)

Usage:
  python catalyst_orchestrator.py [command] [args]

Commands:
  run-fund      [tickers] [--portfolio N] [--risk conservative|moderate|aggressive]
  vibe-scan     [tickers]
  market        [ticker?]
  inbox         list|approve|reject [task_id]
  render        [prompt] [--style cinematic] [--ratio 16:9] [--duration 10]
  avatar        [script] [--avatar catalyst_pro] [--type substack|event|legal]
  sneakers-pack
  status
  help
"""

import sys
import os
import json
import datetime

# Add modules to path
sys.path.insert(0, os.path.dirname(__file__))

def load_module(name, path, cls):
    """Safe module loader with fallback."""
    try:
        import importlib.util
        spec = importlib.util.spec_from_file_location(name, path)
        mod = importlib.util.module_from_spec(spec)
        spec.loader.exec_module(mod)
        return getattr(mod, cls)()
    except Exception as e:
        print(f"[WARN] Could not load {name}: {e}")
        return None

BASE = os.path.dirname(__file__)

def get_autohedge():
    from modules.autohedge.autohedge import AutoHedge
    return AutoHedge

def get_vibe():
    from modules.vibe_trading.vibe_trading import VibeTradingSystem
    return VibeTradingSystem

def get_fincept():
    from modules.fincept.fincept_terminal import FinceptTerminal
    return FinceptTerminal

def get_inbox():
    from modules.agentic_inbox.agentic_inbox import AgenticInbox
    return AgenticInbox

def get_higgsfield():
    from modules.open_higgsfield.open_higgsfield import OpenHiggsfield
    return OpenHiggsfield

def get_heygen():
    from modules.hyperframes.hyperframes import HeyGenHyperframes
    return HeyGenHyperframes


def cmd_status():
    """Print full OS status."""
    print("=" * 65)
    print("  ⚡ CATALYST OS v2.0 — STATUS REPORT")
    print(f"  {datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S')} WAT — Lagos, Nigeria")
    print("=" * 65)

    modules = [
        ("AutoHedge",         "modules/autohedge/autohedge.py",            "✅"),
        ("Vibe Trading",       "modules/vibe_trading/vibe_trading.py",      "✅"),
        ("FinceptTerminal",    "modules/fincept/fincept_terminal.py",       "✅"),
        ("Agentic Inbox",      "modules/agentic_inbox/agentic_inbox.py",    "✅"),
        ("Open-Higgsfield",    "modules/open_higgsfield/open_higgsfield.py","✅"),
        ("HeyGen Hyperframes", "modules/hyperframes/hyperframes.py",        "✅"),
    ]
    for name, path, status in modules:
        full = os.path.join(BASE, path)
        exists = "✅ ONLINE" if os.path.exists(full) else "❌ MISSING"
        size = f"{os.path.getsize(full)//1024}KB" if os.path.exists(full) else "—"
        print(f"  {name:<22} {exists:<12} {size}")

    print("-" * 65)
    from modules.agentic_inbox.agentic_inbox import AgenticInbox
    inbox = AgenticInbox()
    pending = inbox.list_pending()
    print(f"  Agent Inbox:   {len(pending)} tasks pending approval")
    print(f"  Skills Index:  70 skills across 7 categories")
    print(f"  Legal Panel:   Abegbe Agboola Chambers — ONLINE")
    print("=" * 65)


def cmd_run_fund(args):
    """Run AutoHedge fund."""
    tickers = args[0].split(",") if args else ["AAPL","MSFT","NVDA","TSLA","META"]
    portfolio = 50000
    risk = "moderate"
    i = 1
    while i < len(args):
        if args[i] == "--portfolio" and i+1 < len(args):
            portfolio = int(args[i+1]); i += 2
        elif args[i] == "--risk" and i+1 < len(args):
            risk = args[i+1]; i += 2
        else:
            i += 1
    AutoHedge = get_autohedge()
    fund = AutoHedge(portfolio_size=portfolio, risk_level=risk)
    result = fund.run(tickers=tickers, market_context="Q2 2026. Fed holding. Tech earnings strong.")
    print(result["report"])
    print(f"\n✅ {len(result['trades'])} trades queued | {len(result['analyses'])} stocks analyzed")

    # Auto-submit trade tasks to inbox
    if result["trades"]:
        from modules.agentic_inbox.agentic_inbox import AgenticInbox
        inbox = AgenticInbox()
        for t in result["trades"]:
            inbox.submit(
                agent_name="AutoHedgeExecutor",
                task=f"Execute {t['action']} order for {t['ticker']}",
                action=f"{t['action']} ${t['position_usd']:,.2f} of {t['ticker']} @ ${t['price']:,.2f}",
                payload={"ticker":t["ticker"],"action":t["action"],"amount":t["position_usd"]},
                priority="critical",
            )
        print(f"\n📥 {len(result['trades'])} trade orders submitted to Agentic Inbox for approval.")


def cmd_vibe_scan(args):
    """Run Vibe Trading sentiment scan."""
    tickers = args[0].split(",") if args else ["AAPL","NVDA","TSLA","BTC","SPY"]
    VibeTradingSystem = get_vibe()
    system = VibeTradingSystem()
    results = system.scan(tickers)
    print(system.report(results))


def cmd_market(args):
    """Show FinceptTerminal market overview."""
    FinceptTerminal = get_fincept()
    terminal = FinceptTerminal()
    if args:
        quote = terminal.quote(args[0])
        if "error" in quote:
            print(quote["error"])
        else:
            print(f"\n{'='*50}")
            print(f"  {quote['ticker']}  —  FINCEPT TERMINAL")
            print(f"{'='*50}")
            print(f"  Price:     ${quote['price']:>12,.2f}")
            print(f"  Change:    {'+' if quote['change']>0 else ''}{quote['change']:<12.2f}  ({'+' if quote['change_pct']>0 else ''}{quote['change_pct']:.2f}%)")
            print(f"  Volume:    {quote['volume']}")
            print(f"  Mkt Cap:   {quote['mc']}")
            print(f"  P/E:       {quote.get('pe','—')}")
            print(f"  Sector:    {quote['sector']}")
            print(f"  52W High:  ${quote['52w_high']:,.2f}")
            print(f"  52W Low:   ${quote['52w_low']:,.2f}")
            print(f"{'='*50}")
    else:
        print(terminal.market_overview())


def cmd_inbox(args):
    """Manage Agentic Inbox."""
    from modules.agentic_inbox.agentic_inbox import AgenticInbox
    inbox = AgenticInbox()
    action = args[0] if args else "list"

    if action == "list":
        print(inbox.render_inbox())
    elif action == "approve" and len(args) > 1:
        result = inbox.approve(args[1], notes=" ".join(args[2:]) or "Approved via CLI")
        if "error" in result:
            print(f"❌ {result['error']}")
        else:
            print(f"✅ APPROVED: {result['id']} — {result['task']}")
    elif action == "reject" and len(args) > 1:
        result = inbox.reject(args[1], reason=" ".join(args[2:]) or "Rejected via CLI")
        if "error" in result:
            print(f"❌ {result['error']}")
        else:
            print(f"✗ REJECTED: {result['id']} — {result['task']}")
    elif action == "clear":
        inbox.clear_resolved()
    else:
        print("Usage: inbox list|approve [id]|reject [id]|clear")


def cmd_render(args):
    """Queue an Open-Higgsfield video render."""
    prompt = args[0] if args else "Lagos city at golden hour, cinematic wide shot"
    style = "cinematic"; ratio = "16:9"; duration = 10
    i = 1
    while i < len(args):
        if args[i] == "--style" and i+1 < len(args):
            style = args[i+1]; i += 2
        elif args[i] == "--ratio" and i+1 < len(args):
            ratio = args[i+1]; i += 2
        elif args[i] == "--duration" and i+1 < len(args):
            duration = int(args[i+1]); i += 2
        else:
            i += 1
    OpenHiggsfield = get_higgsfield()
    h = OpenHiggsfield()
    r = h.text_to_video(prompt, style=style, aspect_ratio=ratio, duration=duration)
    print(f"\n✅ Render queued: {r['render_id']}")
    print(f"   Prompt:   {r['prompt'][:60]}...")
    print(f"   Style:    {r['style']} | {r['resolution']} | {r['duration_sec']}s @ {r['fps']}fps")
    print(f"   Motion:   {r['motion_type']} | Lighting: {r['lighting']}")
    print(f"   Est. GPU: {r['estimated_gpu_seconds']}s")
    print(f"   Output:   {r['output_path']}")


def cmd_sneakers_pack(args):
    """Generate full Sneakers Fest 2026 video + avatar package."""
    print("🎪 Generating Sneakers Fest 2026 full media package...\n")

    OpenHiggsfield = get_higgsfield()
    h = OpenHiggsfield()
    renders = h.sneakers_fest_package()
    print(f"🎬 Open-Higgsfield — {len(renders)} video renders queued:")
    for r in renders:
        print(f"   [{r['render_id']}] {r['style']:12} | {r['resolution']:12} | {r['duration_sec']}s")

    print()

    HeyGenHyperframes = get_heygen()
    hg = HeyGenHyperframes()
    hype = hg.sneakers_fest_hype("July 19, 2026", "Eko Convention Centre, Lagos")
    print(f"🎭 HeyGen Avatar — Hype video: {hype['session_id']} | {hype['total_duration_sec']}s")

    from modules.agentic_inbox.agentic_inbox import AgenticInbox
    inbox = AgenticInbox()
    inbox.submit("HiggsFieldRenderer","Render full Sneakers Fest video pack","Start GPU render batch — 5 videos",
                 {"renders":len(renders)}, priority="high")
    inbox.submit("HeyGenStudio","Render avatar hype video",f"Render {hype['session_id']}",
                 {"session":hype['session_id']}, priority="medium")

    print(f"\n📥 2 render jobs submitted to Agentic Inbox for approval.")
    print(f"\n✅ Sneakers Fest 2026 media package complete.")
    print(f"   {len(renders)} video renders + 1 avatar session ready.")


def cmd_avatar(args):
    """Generate HeyGen avatar video."""
    script = args[0] if args else "The Catalyst OS is live. The system is built. The era has begun."
    avatar = "catalyst_pro"; av_type = "script"
    i = 1
    while i < len(args):
        if args[i] == "--avatar" and i+1 < len(args):
            avatar = args[i+1]; i += 2
        elif args[i] == "--type" and i+1 < len(args):
            av_type = args[i+1]; i += 2
        else:
            i += 1
    HeyGenHyperframes = get_heygen()
    hg = HeyGenHyperframes()
    if av_type == "substack":
        result = hg.substack_promo(script, f"Here's what most people miss about {script}.", "Read it on Substack now.")
    elif av_type == "event":
        result = hg.sneakers_fest_hype("July 19, 2026", "Eko Convention Centre, Lagos")
    elif av_type == "legal":
        result = hg.legal_explainer(script, f"Under Nigerian law, {script}. This is important because it affects your rights.")
    else:
        s = hg.create_session(avatar)
        for sent in [x.strip() for x in script.split(".") if x.strip()]:
            s.speak(sent + ".", "neutral")
        result = s.export()
    print(f"\n✅ Avatar session: {result['session_id']}")
    print(f"   Avatar:    {result['avatar']['name']}")
    print(f"   Duration:  {result['total_duration_sec']}s")
    print(f"   Segments:  {result.get('total_segments', len(result.get('segments',[])))}")
    print(f"   Config:    {result.get('config_path','avatar_sessions/')}")


def cmd_help():
    print(__doc__)


COMMANDS = {
    "status":        (cmd_status,        []),
    "run-fund":      (cmd_run_fund,      ["AAPL,MSFT,NVDA"]),
    "vibe-scan":     (cmd_vibe_scan,     ["AAPL,NVDA,BTC"]),
    "market":        (cmd_market,        ["AAPL"]),
    "inbox":         (cmd_inbox,         ["list"]),
    "render":        (cmd_render,        ["Lagos golden hour"]),
    "sneakers-pack": (cmd_sneakers_pack, []),
    "avatar":        (cmd_avatar,        ["The Catalyst OS is live."]),
    "help":          (cmd_help,          []),
}


if __name__ == "__main__":
    if len(sys.argv) < 2 or sys.argv[1] not in COMMANDS:
        cmd_status()
        print("\nRun 'python catalyst_orchestrator.py help' for full command list.")
        sys.exit(0)

    command = sys.argv[1]
    extra_args = sys.argv[2:]
    fn, _ = COMMANDS[command]
    fn(extra_args) if fn != cmd_status else fn()
