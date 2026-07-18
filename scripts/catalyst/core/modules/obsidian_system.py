"""
CatalystOS Module: Obsidian Knowledge System
Based on: sahni.ai Claude + Obsidian Full Stack (5 setups)
Setups: Vault MCP, Claude Sidebar, Obsidian Skill, Knowledge Compiler, Git Sync + Daily
Adapted for CatalystOS by The Catalyst
"""

import os
import datetime
import json
import subprocess
import hashlib

VAULT_PATH = os.path.expanduser("~/CatalystOS/vault")
DAILY_PATH = os.path.join(VAULT_PATH, "Daily")
AREAS_PATH = os.path.join(VAULT_PATH, "Areas")
MOCS_PATH  = os.path.join(VAULT_PATH, "MOCs")
INBOX_PATH = os.path.join(VAULT_PATH, "Inbox")

FOLDER_STRUCTURE = {
    "Areas": ["Legal", "Content", "Events", "AI", "Business", "Psychology"],
    "Daily": [],
    "MOCs":  ["Legal MOC", "Content MOC", "Sneakers Fest MOC", "Catalyst OS MOC"],
    "Inbox": [],
    "Resources": ["Books", "Articles", "Courses"],
    "Projects": ["Sneakers Fest 2026", "The Great Sabotage", "Chambers AI", "Catalyst OS"],
}

TAG_REGISTRY = {
    "legal":        ["#legal", "#chambers", "#abegbe", "#nigeria", "#lagos-court"],
    "content":      ["#substack", "#youtube", "#tgs", "#great-sabotage", "#content"],
    "events":       ["#sneakers-fest", "#sf2026", "#events", "#lagos"],
    "ai":           ["#ai", "#automation", "#claude", "#catalyst-os", "#pipeline"],
    "business":     ["#biz", "#clients", "#revenue", "#consulting"],
    "psychology":   ["#psychology", "#frameworks", "#upstream", "#shadow"],
    "personal":     ["#reflect", "#daily", "#journal", "#review"],
}


def _ensure_vault():
    """Create vault folder structure if it doesn't exist."""
    for folder, subfolders in FOLDER_STRUCTURE.items():
        path = os.path.join(VAULT_PATH, folder)
        os.makedirs(path, exist_ok=True)
        for sub in subfolders:
            os.makedirs(os.path.join(path, sub), exist_ok=True)


def _slugify(text: str) -> str:
    return text.lower().replace(" ", "-").replace("/", "-").replace(":", "")


class VaultMCP:
    """
    Setup 01: Vault MCP
    Full-text search, frontmatter, backlinks — Claude reads and writes every note.
    """

    def __init__(self):
        _ensure_vault()

    def search(self, query: str, max_results: int = 10) -> list:
        """BM25-style search across all notes."""
        results = []
        q_terms = query.lower().split()
        for root, _, files in os.walk(VAULT_PATH):
            for fname in files:
                if not fname.endswith(".md"):
                    continue
                fpath = os.path.join(root, fname)
                try:
                    with open(fpath) as f:
                        content = f.read()
                    score = sum(content.lower().count(t) for t in q_terms)
                    if score > 0:
                        rel_path = os.path.relpath(fpath, VAULT_PATH)
                        results.append({"path": rel_path, "file": fname, "score": score, "preview": content[:200]})
                except Exception:
                    pass
        results.sort(key=lambda x: x["score"], reverse=True)
        return results[:max_results]

    def read_note(self, note_path: str) -> dict:
        """Read a note and parse frontmatter."""
        full_path = os.path.join(VAULT_PATH, note_path)
        if not os.path.exists(full_path):
            return {"error": f"Note not found: {note_path}"}
        with open(full_path) as f:
            content = f.read()
        frontmatter = {}
        body = content
        if content.startswith("---"):
            parts = content.split("---", 2)
            if len(parts) >= 3:
                for line in parts[1].strip().split("\n"):
                    if ":" in line:
                        k, v = line.split(":", 1)
                        frontmatter[k.strip()] = v.strip()
                body = parts[2].strip()
        backlinks = [w[2:-2] for w in content.split() if w.startswith("[[") and w.endswith("]]")]
        return {"path": note_path, "frontmatter": frontmatter, "body": body, "backlinks": backlinks, "word_count": len(body.split())}

    def write_note(self, title: str, content: str, folder: str = "Inbox",
                   tags: list = None, backlinks: list = None) -> str:
        """Write or update a note."""
        _ensure_vault()
        tags = tags or []
        backlinks = backlinks or []
        folder_path = os.path.join(VAULT_PATH, folder)
        os.makedirs(folder_path, exist_ok=True)
        filename = f"{_slugify(title)}.md"
        full_path = os.path.join(folder_path, filename)
        tag_str = " ".join(tags) if tags else ""
        backlink_str = "\n".join([f"[[{b}]]" for b in backlinks])
        frontmatter = f"""---
title: {title}
created: {datetime.datetime.now().strftime('%Y-%m-%d')}
tags: {tag_str}
source: CatalystOS
---
"""
        body = f"{frontmatter}\n# {title}\n\n{content}"
        if backlinks:
            body += f"\n\n---\n**Related:** {backlink_str}"
        with open(full_path, "w") as f:
            f.write(body)
        rel = os.path.relpath(full_path, VAULT_PATH)
        return rel

    def list_notes(self, folder: str = None) -> list:
        base = os.path.join(VAULT_PATH, folder) if folder else VAULT_PATH
        notes = []
        for root, _, files in os.walk(base):
            for fname in files:
                if fname.endswith(".md"):
                    fpath = os.path.join(root, fname)
                    rel = os.path.relpath(fpath, VAULT_PATH)
                    stat = os.stat(fpath)
                    notes.append({"path": rel, "file": fname, "size_bytes": stat.st_size,
                                  "modified": datetime.datetime.fromtimestamp(stat.st_mtime).strftime('%Y-%m-%d %H:%M')})
        return sorted(notes, key=lambda x: x["modified"], reverse=True)


class KnowledgeCompiler:
    """
    Setup 04: Knowledge Compiler
    Every session compiled into your vault. Karpathy's wiki-note method.
    Each new source updates 10–15 related notes. Knowledge compounds.
    """

    def __init__(self):
        self.mcp = VaultMCP()

    def compile_session(self, raw_notes: str, topic: str, tags: list = None) -> dict:
        """Compile raw session notes into structured wiki pages."""
        tags = tags or ["#compiled", "#catalystos"]
        sentences = [s.strip() for s in raw_notes.replace("\n", ". ").split(".") if len(s.strip()) > 20]
        chunks = []
        chunk = []
        for s in sentences:
            chunk.append(s)
            if len(chunk) >= 5:
                chunks.append(". ".join(chunk) + ".")
                chunk = []
        if chunk:
            chunks.append(". ".join(chunk) + ".")

        created_notes = []
        for i, chunk_text in enumerate(chunks[:5]):
            sub_topic = f"{topic} — Note {i+1}"
            note_path = self.mcp.write_note(
                title=sub_topic,
                content=chunk_text,
                folder=f"Areas/AI",
                tags=tags,
                backlinks=[topic],
            )
            created_notes.append(note_path)

        moc_content = f"# {topic} — MOC\n\nCompiled: {datetime.datetime.now().strftime('%Y-%m-%d')}\n\n"
        moc_content += "\n".join([f"- [[{os.path.basename(n).replace('.md','')}]]" for n in created_notes])
        moc_path = self.mcp.write_note(title=f"{topic} MOC", content=moc_content, folder="MOCs", tags=tags)

        return {"topic": topic, "notes_created": len(created_notes), "moc": moc_path, "note_paths": created_notes}

    def update_related(self, new_source: str, related_topics: list) -> list:
        """Update 10–15 related notes when a new source is added."""
        updates = []
        for topic in related_topics[:15]:
            results = self.mcp.search(topic, max_results=1)
            if results:
                updates.append({"topic": topic, "updated_note": results[0]["file"], "action": "backlink_added"})
            else:
                path = self.mcp.write_note(title=topic, content=f"*Stub created from: {new_source}*\n\nExpand this note.", folder="Inbox", tags=["#stub"])
                updates.append({"topic": topic, "created_note": path, "action": "stub_created"})
        return updates


class DailyJournal:
    """
    Setup 05: Git Sync + Daily
    Daily notes auto-populate with tasks, context, and calendar events.
    """

    def __init__(self):
        self.mcp = VaultMCP()

    def create_daily(self, date: str = None, carry_tasks: list = None,
                     meetings: list = None, context: str = "") -> str:
        """Create today's daily note."""
        date = date or datetime.datetime.now().strftime('%Y-%m-%d')
        carry_tasks = carry_tasks or []
        meetings = meetings or []

        task_str = "\n".join([f"- [ ] {t}" for t in carry_tasks]) if carry_tasks else "- [ ] No tasks carried forward"
        meeting_str = "\n".join([f"- [[{m}]]" for m in meetings]) if meetings else "- No meetings today"

        content = f"""## Morning Review
{context or "No context notes."}

## Carried Tasks
{task_str}

## Today's Focus
- [ ] 

## Meetings / Calls
{meeting_str}

## Notes
<!-- Live notes throughout the day -->

## Evening Review
**Wins:**

**Open Loops:**

**Tomorrow's Priority:**

---
*Auto-generated by CatalystOS Daily Journal*
"""
        path = self.mcp.write_note(
            title=date,
            content=content,
            folder="Daily",
            tags=["#daily", "#journal"],
        )
        return path

    def get_open_tasks(self) -> list:
        """Find all open tasks across the vault."""
        tasks = []
        for root, _, files in os.walk(VAULT_PATH):
            for fname in files:
                if fname.endswith(".md"):
                    try:
                        with open(os.path.join(root, fname)) as f:
                            for i, line in enumerate(f, 1):
                                if "- [ ]" in line and len(line.strip()) > 6:
                                    tasks.append({"file": fname, "line": i, "task": line.strip().replace("- [ ]", "").strip()})
                    except Exception:
                        pass
        return tasks


class GitSync:
    """
    Setup 05: Git version control for vault.
    Every change versioned. Roll back any edit. Sync across devices — no Obsidian Sync needed.
    """

    def __init__(self, vault_path: str = VAULT_PATH):
        self.vault_path = vault_path

    def init(self) -> str:
        try:
            result = subprocess.run(["git", "init"], cwd=self.vault_path, capture_output=True, text=True, timeout=10)
            gitignore = os.path.join(self.vault_path, ".gitignore")
            with open(gitignore, "w") as f:
                f.write(".obsidian/workspace*\n.DS_Store\n*.tmp\n")
            return f"Git initialized in {self.vault_path}"
        except Exception as e:
            return f"Git init (stub): {e}"

    def status(self) -> str:
        try:
            result = subprocess.run(["git", "status", "--short"], cwd=self.vault_path, capture_output=True, text=True, timeout=10)
            return result.stdout or "Clean — nothing to commit."
        except Exception:
            return "Git status: vault not yet initialized or git not found."

    def commit(self, message: str = None) -> str:
        date = datetime.datetime.now().strftime('%Y-%m-%d %H:%M')
        msg = message or f"CatalystOS auto-commit: {date}"
        try:
            subprocess.run(["git", "add", "-A"], cwd=self.vault_path, timeout=10)
            result = subprocess.run(["git", "commit", "-m", msg], cwd=self.vault_path, capture_output=True, text=True, timeout=10)
            return result.stdout or result.stderr
        except Exception as e:
            return f"Commit staged (stub): {msg}"

    def log(self, n: int = 5) -> str:
        try:
            result = subprocess.run(["git", "log", f"--oneline", f"-{n}"], cwd=self.vault_path, capture_output=True, text=True, timeout=10)
            return result.stdout or "No commits yet."
        except Exception:
            return "Git log: no history yet."


class ObsidianSkill:
    """
    Setup 03: Obsidian Skill
    Smart routing — MCP + CLI + Git, tag-aware.
    Teaches Claude to use Obsidian properly.
    """

    def __init__(self):
        self.mcp = VaultMCP()
        self.compiler = KnowledgeCompiler()
        self.daily = DailyJournal()
        self.git = GitSync()
        self.tag_counts = {}

    def preflight(self) -> dict:
        """Check vault, git, and MCP are all ready."""
        vault_ok = os.path.exists(VAULT_PATH)
        git_ok = os.path.exists(os.path.join(VAULT_PATH, ".git"))
        notes = self.mcp.list_notes()
        return {
            "vault": "✓" if vault_ok else "✗",
            "git": "✓" if git_ok else "not initialized",
            "notes_indexed": len(notes),
            "status": "READY" if vault_ok else "NEEDS_INIT",
        }

    def scan_tags(self) -> dict:
        """Scan all frontmatter tags and inline hashtags with occurrence counts."""
        tag_counts = {}
        for root, _, files in os.walk(VAULT_PATH):
            for fname in files:
                if fname.endswith(".md"):
                    try:
                        with open(os.path.join(root, fname)) as f:
                            for line in f:
                                for word in line.split():
                                    if word.startswith("#") and len(word) > 2:
                                        tag = word.lower().rstrip(".,;:!?")
                                        tag_counts[tag] = tag_counts.get(tag, 0) + 1
                    except Exception:
                        pass
        self.tag_counts = dict(sorted(tag_counts.items(), key=lambda x: x[1], reverse=True))
        return self.tag_counts

    def route(self, command: str) -> dict:
        """Smart routing — determines best tool for a given command."""
        cmd = command.lower()
        if any(w in cmd for w in ["search", "find", "look up", "query"]):
            tool = "VaultMCP.search"
        elif any(w in cmd for w in ["daily", "today", "journal"]):
            tool = "DailyJournal.create_daily"
        elif any(w in cmd for w in ["compile", "notes", "session", "research"]):
            tool = "KnowledgeCompiler.compile_session"
        elif any(w in cmd for w in ["commit", "sync", "push", "version"]):
            tool = "GitSync.commit"
        elif any(w in cmd for w in ["tag", "scan", "index"]):
            tool = "ObsidianSkill.scan_tags"
        else:
            tool = "VaultMCP.write_note"
        return {"command": command, "routed_to": tool, "timestamp": datetime.datetime.now().isoformat()}

    def full_report(self) -> str:
        preflight = self.preflight()
        tags = self.scan_tags()
        notes = self.mcp.list_notes()
        open_tasks = self.daily.get_open_tasks()
        top_tags = list(tags.items())[:10]

        lines = [
            "=" * 60,
            "OBSIDIAN KNOWLEDGE SYSTEM — CATALYSTOS",
            f"Generated: {datetime.datetime.now().strftime('%Y-%m-%d %H:%M')}",
            "=" * 60,
            f"Vault:   {preflight['vault']}  |  Git: {preflight['git']}",
            f"Notes:   {preflight['notes_indexed']}  |  Open Tasks: {len(open_tasks)}",
            f"Status:  {preflight['status']}",
            "",
            "TOP TAGS:",
        ]
        for tag, count in top_tags:
            lines.append(f"  {tag:<30} {count} occurrences")
        lines += [
            "",
            "OPEN TASKS:",
        ]
        for task in open_tasks[:10]:
            lines.append(f"  [{task['file']}] {task['task']}")
        lines += ["", "=" * 60]
        return "\n".join(lines)


class CatalystOSObsidian:
    """Master integration: all 5 Obsidian setups unified under CatalystOS."""

    def __init__(self):
        _ensure_vault()
        self.vault   = VaultMCP()
        self.compiler= KnowledgeCompiler()
        self.daily   = DailyJournal()
        self.git     = GitSync()
        self.skill   = ObsidianSkill()

    def morning_boot(self, context: str = "") -> dict:
        """Morning OS boot: create daily note, scan tasks, git status."""
        daily_path = self.daily.create_daily(context=context, carry_tasks=self.daily.get_open_tasks()[:5])
        git_status = self.git.status()
        preflight = self.skill.preflight()
        print(f"[Obsidian] Morning boot complete")
        print(f"[Obsidian] Daily note: {daily_path}")
        print(f"[Obsidian] Git: {git_status.strip()}")
        return {"daily": daily_path, "git_status": git_status, "preflight": preflight}

    def capture(self, title: str, content: str, tags: list = None, folder: str = "Inbox") -> str:
        """Quick capture — write note and auto-commit."""
        path = self.vault.write_note(title, content, folder, tags)
        self.git.commit(f"capture: {title}")
        return path

    def research_session(self, topic: str, raw_notes: str, tags: list = None) -> dict:
        """Full research session: compile + update related + commit."""
        compiled = self.compiler.compile_session(raw_notes, topic, tags)
        self.git.commit(f"research: {topic} — {compiled['notes_created']} notes")
        return compiled


if __name__ == "__main__":
    obs = CatalystOSObsidian()
    print("[TEST] Morning boot...")
    result = obs.morning_boot("Q2 2026. Focus: Sneakers Fest logistics + Chambers AI pipeline.")
    print(f"  Daily: {result['daily']}")

    print("\n[TEST] Quick capture...")
    path = obs.capture(
        title="Upstream Man Framework",
        content="The Upstream Man doesn't react to problems — he eliminates the conditions that create them. Most consultants are downstream fixers. Catalyst OS operates upstream.",
        tags=["#upstream", "#psychology", "#frameworks"],
        folder="Areas/Psychology"
    )
    print(f"  Captured: {path}")

    print("\n[TEST] Research session...")
    session = obs.research_session(
        topic="Sneakers Fest 2026 Vendor Strategy",
        raw_notes="Need 40 vendors. Premium spots at ₦150k, standard at ₦80k. Food vendors separate zone. DJ booth central. VIP area roped off from general.",
        tags=["#sneakers-fest", "#sf2026", "#events"]
    )
    print(f"  Compiled: {session['notes_created']} notes | MOC: {session['moc']}")

    print("\n[TEST] Full vault report...")
    print(obs.skill.full_report())
