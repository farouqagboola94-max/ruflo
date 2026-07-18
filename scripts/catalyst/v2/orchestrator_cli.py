#!/usr/bin/env python3
"""
CATALYST OS — CLI
Usage: python cli.py <command> [args]
"""

import sys, json, requests

BASE = "http://localhost:8000"

def status():
    r = requests.get(f"{BASE}/")
    d = r.json()
    print(f"\n⚡ CATALYST OS — {d['status']}")
    print(f"   Operator : {d['operator']}")
    print(f"   Location : {d['location']}")
    print(f"   Time     : {d['timestamp']}")
    print(f"\n   Agents:")
    for k, v in d['agents'].items():
        print(f"   · {k:<20} {v}")
    print(f"\n   Stats:")
    for k, v in d['stats'].items():
        print(f"   · {k:<30} {v}")
    print()

def chat(message: str, agent: str = "general"):
    r = requests.post(f"{BASE}/chat", json={"message": message, "agent": agent})
    d = r.json()
    print(f"\n[{d['agent'].upper()}] {d['timestamp']}")
    print("─" * 60)
    print(d['response'])
    print()

def legal_doc(doc_type: str, matter: str, instructions: str = ""):
    r = requests.post(f"{BASE}/agents/legal-doc", json={
        "doc_type": doc_type,
        "matter": matter,
        "instructions": instructions
    })
    d = r.json()
    print(f"\n[AGENT-001 — CHAMBERS] {d['timestamp']}")
    print(f"Document: {d['doc_type'].upper()} | Matter: {d['matter']}")
    print("─" * 60)
    print(d['document'])
    fname = f"CHAMBERS_{doc_type}_{d['timestamp'][:10]}.txt"
    with open(fname, "w") as f:
        f.write(d['document'])
    print(f"\n✓ Saved to {fname}")

def voice_pipeline(transcript: str, formats: str = "substack,youtube,shorts", topic: str = ""):
    fmt_list = [f.strip() for f in formats.split(",")]
    r = requests.post(f"{BASE}/agents/voice-pipeline", json={
        "transcript": transcript,
        "output_formats": fmt_list,
        "topic": topic
    })
    d = r.json()
    print(f"\n[AGENT-010 — VOICE PIPELINE] {d['timestamp']}")
    print(f"Formats: {', '.join(d['formats_produced'])}")
    print("─" * 60)
    for fmt, content in d['outputs'].items():
        fname = f"TGS_{fmt}_{d['timestamp'][:10]}.txt"
        with open(fname, "w") as f:
            f.write(content)
        print(f"✓ {fmt.upper():<12} → {fname}")
    print()

def inbox(content: str, action: str = "triage"):
    r = requests.post(f"{BASE}/agents/inbox", json={"content": content, "action": action})
    d = r.json()
    print(f"\n[AGENT-003 — INBOX] {d['action'].upper()} | {d['timestamp']}")
    print("─" * 60)
    print(d['result'])
    print()

def registry(category: str = ""):
    url = f"{BASE}/registry" + (f"/category/{category}" if category else "")
    r = requests.get(url)
    d = r.json()
    if category:
        items = d.get("items", [])
        print(f"\n[REGISTRY] {d.get('category', category)} — {len(items)} projects")
        print("─" * 60)
        for item in items:
            status_icon = "✓" if item["status"] == "complete" else "⚡" if item["status"] == "active" else "→"
            print(f"{status_icon} [{item['id']}] {item['name']} [{item['status'].upper()}]")
    else:
        stats = d.get("statistics", {})
        print(f"\n[REGISTRY] Catalyst OS — Full Project Index")
        print("─" * 60)
        for k, v in stats.items():
            print(f"  {k:<35} {v}")
    print()

def help_text():
    print("""
⚡ CATALYST OS CLI

Commands:
  status                           OS health + agent status
  chat "message"                   Talk to the OS brain
  legal-doc <type> "matter"        Generate legal doc (CHAMBERS)
  voice "transcript" [formats]     Voice note → content pipeline
  inbox "content" [action]         Triage/reply/summarize inbox item
  registry [category]              Browse project registry

Examples:
  python cli.py status
  python cli.py chat "What's the TGS word count?"
  python cli.py legal-doc affidavit "Service of process in matter XYZ"
  python cli.py voice "transcript here" substack,youtube
  python cli.py inbox "Client email content" draft_reply
  python cli.py registry ai_agents
""")

COMMANDS = {
    "status": lambda args: status(),
    "chat": lambda args: chat(args[0] if args else "", args[1] if len(args) > 1 else "general"),
    "legal-doc": lambda args: legal_doc(args[0] if args else "affidavit", args[1] if len(args) > 1 else "", args[2] if len(args) > 2 else ""),
    "voice": lambda args: voice_pipeline(args[0] if args else "", args[1] if len(args) > 1 else "substack,youtube,shorts", args[2] if len(args) > 2 else ""),
    "inbox": lambda args: inbox(args[0] if args else "", args[1] if len(args) > 1 else "triage"),
    "registry": lambda args: registry(args[0] if args else ""),
    "help": lambda args: help_text(),
}

if __name__ == "__main__":
    if len(sys.argv) < 2 or sys.argv[1] not in COMMANDS:
        help_text()
        sys.exit(0)
    cmd = sys.argv[1]
    args = sys.argv[2:]
    try:
        COMMANDS[cmd](args)
    except requests.exceptions.ConnectionError:
        print("\n✗ Orchestrator not running. Start it with: boot.sh\n")
    except Exception as e:
        print(f"\n✗ Error: {e}\n")
