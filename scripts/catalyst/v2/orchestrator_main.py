"""
CATALYST OS — Master Orchestration Agent
AGENT-002 | REST API on port 8000
"""

import os, json, pathlib
from datetime import datetime
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv
import anthropic

load_dotenv()

ROOT = pathlib.Path(__file__).parent.parent.parent
REGISTRY_PATH = ROOT / "CATALYST_OS_PROJECT_REGISTRY.json"
CLAUDE_MD_PATH = ROOT / "CLAUDE.md"

def load_context():
    ctx = ""
    if CLAUDE_MD_PATH.exists():
        ctx = CLAUDE_MD_PATH.read_text()
    return ctx

def load_registry():
    if REGISTRY_PATH.exists():
        return json.loads(REGISTRY_PATH.read_text())
    return {}

SYSTEM_CONTEXT = load_context()
client = anthropic.Anthropic(api_key=os.getenv("ANTHROPIC_API_KEY"))

app = FastAPI(title="Catalyst OS Orchestrator", version="2.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── Models ──────────────────────────────────────────────────

class ChatRequest(BaseModel):
    message: str
    agent: str = "general"

class LegalDocRequest(BaseModel):
    doc_type: str           # "affidavit" | "particulars" | "letter"
    matter: str
    parties: dict = {}
    instructions: str = ""

class VoicePipelineRequest(BaseModel):
    transcript: str
    output_formats: list = ["substack", "youtube", "shorts"]
    topic: str = ""

class InboxRequest(BaseModel):
    content: str
    action: str = "triage"  # "triage" | "draft_reply" | "summarize"

# ── Routes ──────────────────────────────────────────────────

@app.get("/")
def status():
    registry = load_registry()
    stats = registry.get("statistics", {})
    return {
        "os": "Catalyst OS",
        "version": "2.0.0",
        "operator": "Oluwatobiloba — The Catalyst",
        "location": "Lagos, Nigeria",
        "status": "OPERATIONAL",
        "timestamp": datetime.now().isoformat(),
        "agents": {
            "orchestrator": "AGENT-002 ✓",
            "legal_doc": "AGENT-001 ✓",
            "voice_pipeline": "AGENT-010 ✓",
            "agentic_inbox": "AGENT-003 ✓",
        },
        "stats": stats,
        "endpoints": [
            "GET  /",
            "GET  /registry",
            "GET  /registry/category/{cat}",
            "POST /chat",
            "POST /agents/legal-doc",
            "POST /agents/voice-pipeline",
            "POST /agents/inbox",
        ]
    }

@app.get("/registry")
def get_registry():
    return load_registry()

@app.get("/registry/category/{category}")
def get_category(category: str):
    reg = load_registry()
    projects = reg.get("projects", {})
    if category not in projects:
        raise HTTPException(404, f"Category '{category}' not found. Available: {list(projects.keys())}")
    return projects[category]

@app.post("/chat")
def chat(req: ChatRequest):
    system = f"""You are the Catalyst OS orchestrator — the central intelligence for Oluwatobiloba (The Catalyst), 
a Lagos-based entrepreneur running Catalyst OS.

Your full operational context:

{SYSTEM_CONTEXT}

Current agent: {req.agent}
Respond in the Catalyst voice: direct, contraction-heavy, no corporate buzzwords. No em-dashes."""

    response = client.messages.create(
        model="claude-opus-4-5",
        max_tokens=2000,
        system=system,
        messages=[{"role": "user", "content": req.message}]
    )
    return {
        "agent": req.agent,
        "response": response.content[0].text,
        "timestamp": datetime.now().isoformat()
    }

@app.post("/agents/legal-doc")
def legal_doc(req: LegalDocRequest):
    """AGENT-001 — Legal Document Agent (Chambers client work)"""
    prompt = f"""Generate a professional Nigerian legal document for Abegbe Agboola Chambers.

Document type: {req.doc_type}
Matter: {req.matter}
Parties: {json.dumps(req.parties, indent=2)}
Additional instructions: {req.instructions}

Format it correctly per Nigerian court standards. Professional, precise, no fluff."""

    response = client.messages.create(
        model="claude-opus-4-5",
        max_tokens=3000,
        system=f"You are a legal document specialist working for Abegbe Agboola Chambers, Ikoyi, Lagos. {SYSTEM_CONTEXT[:500]}",
        messages=[{"role": "user", "content": prompt}]
    )
    return {
        "agent": "AGENT-001",
        "doc_type": req.doc_type,
        "matter": req.matter,
        "document": response.content[0].text,
        "timestamp": datetime.now().isoformat(),
        "code": "CHAMBERS"
    }

@app.post("/agents/voice-pipeline")
def voice_pipeline(req: VoicePipelineRequest):
    """AGENT-010 — Voice Note to Multi-Format Content Pipeline"""
    formats_prompt = "\n".join([
        f"- {f.upper()}: {'800-1200 word Substack post with hook, body, and CTA' if f == 'substack' else '2000-3000 word YouTube script with timestamps' if f == 'youtube' else '60-second short-form script (150 words max, punchy)' if f == 'shorts' else f}"
        for f in req.output_formats
    ])

    prompt = f"""Transform this voice transcript into polished content in the Catalyst voice.

TRANSCRIPT:
{req.transcript}

Topic context: {req.topic or 'Infer from transcript'}

Produce the following formats:
{formats_prompt}

Voice rules: Direct, contraction-heavy, punchy hooks. No em-dashes, no corporate buzzwords, no "imagine this".
Start each format with a label like ## SUBSTACK, ## YOUTUBE, ## SHORTS."""

    response = client.messages.create(
        model="claude-opus-4-5",
        max_tokens=4000,
        system=f"You are the Catalyst OS content pipeline. Transform raw voice notes into polished multi-format content. {SYSTEM_CONTEXT[:600]}",
        messages=[{"role": "user", "content": prompt}]
    )

    raw = response.content[0].text
    outputs = {}
    for fmt in req.output_formats:
        marker = f"## {fmt.upper()}"
        if marker in raw:
            start = raw.index(marker) + len(marker)
            next_markers = [raw.index(f"## {f.upper()}", start) for f in req.output_formats if f != fmt and f"## {f.upper()}" in raw[start:]]
            end = min(next_markers) if next_markers else len(raw)
            outputs[fmt] = raw[start:end].strip()
        else:
            outputs[fmt] = raw

    return {
        "agent": "AGENT-010",
        "topic": req.topic,
        "formats_produced": req.output_formats,
        "outputs": outputs,
        "timestamp": datetime.now().isoformat(),
        "code": "TGS"
    }

@app.post("/agents/inbox")
def inbox(req: InboxRequest):
    """AGENT-003 — Agentic Inbox"""
    action_map = {
        "triage": "Triage this message: categorize it (urgent/normal/low), identify what action is needed, and suggest a 1-line response.",
        "draft_reply": "Draft a direct, professional reply in the Catalyst voice. No fluff.",
        "summarize": "Summarize this in 3 bullet points. Key facts only."
    }
    prompt = f"{action_map.get(req.action, action_map['triage'])}\n\nCONTENT:\n{req.content}"

    response = client.messages.create(
        model="claude-opus-4-5",
        max_tokens=800,
        system=f"You are the Catalyst OS inbox agent. {SYSTEM_CONTEXT[:400]}",
        messages=[{"role": "user", "content": prompt}]
    )
    return {
        "agent": "AGENT-003",
        "action": req.action,
        "result": response.content[0].text,
        "timestamp": datetime.now().isoformat()
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
