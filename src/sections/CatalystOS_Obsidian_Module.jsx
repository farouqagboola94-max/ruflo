import { useState, useEffect, useRef } from "react";

const GOLD = "#C9A84C";
const GOLD_DIM = "#7a6328";
const BG = "#0d0d0d";
const PANEL = "#111111";
const BORDER = "#1e1e1e";
const TEXT = "#e8e8e8";
const MUTED = "#4a4a4a";
const GREEN = "#3ddc84";
const RED = "#ff4444";

const SETUPS = [
  {
    id: "vault-mcp",
    num: "01",
    label: "VAULT MCP",
    tag: "MOST POPULAR",
    tagline: "Claude reads every note. Writes new ones. Instantly.",
    desc: "The mcp-obsidian server exposes your entire vault to Claude Code — full-text search, frontmatter, backlinks, tags. No copy-pasting. Claude just knows.",
    features: [
      { title: "Full vault context", body: "BM25 relevance ranking. Returns notes by meaning, not just keyword match. 387 notes indexed in seconds." },
      { title: "Two-way sync", body: "Claude reads existing notes and creates new ones. Updates frontmatter, adds tags, organises into folders automatically." },
    ],
    terminal: [
      { type: "cmd", text: "claude --mcp obsidian" },
      { type: "ok", text: "✓ Connected to vault: ~/CatalystOS" },
      { type: "info", text: "68 repos indexed · 2,847 backlinks" },
      { type: "blank" },
      { type: "prompt", text: "> Find every note tagged #chambers or #legal" },
      { type: "link", text: "• Chambers 60-Day Blueprint.md" },
      { type: "link", text: "• Abegbe Agboola — ICP Notes.md" },
      { type: "link", text: "• Legal Pipeline Architecture.md" },
      { type: "link", text: "• docling + unstructured setup.md" },
      { type: "info", text: "↳ Returned 4 notes · Ranked by BM25" },
      { type: "info", text: "↳ 17 related concepts via backlinks" },
    ],
    install: "npm install -g mcp-obsidian\nclaude --mcp obsidian --vault ~/CatalystOS",
    status: "ACTIVE",
  },
  {
    id: "claude-sidebar",
    num: "02",
    label: "CLAUDE SIDEBAR",
    tag: "NATIVE PLUGIN",
    tagline: "Never leave Obsidian. Claude lives inside it.",
    desc: "Derek Larson's plugin embeds a full Claude Code terminal in Obsidian's sidebar. Watch it read your notes, make edits and create new pages in real time — without switching windows.",
    features: [
      { title: "Embedded terminal", body: "Full Claude Code CLI in the sidebar. Multiple tabs for parallel conversations. Hotkey-activated from anywhere." },
      { title: "Auto-detects MCP", body: "Pairs with Vault MCP automatically. One-click access to your entire knowledge base. No config juggling." },
    ],
    terminal: [
      { type: "note", text: "TGS — Part 10 Draft" },
      { type: "tag", text: "tags: #substack #tgs #writing" },
      { type: "blank" },
      { type: "section", text: "## The Upstream Man Revisited" },
      { type: "body", text: "Draft content here..." },
      { type: "blank" },
      { type: "sidebar", text: "[ Claude Code ]  vault: ~/CatalystOS" },
      { type: "prompt", text: "Pull every unresolved thread from TGS Parts 1-9 into a synthesis doc." },
      { type: "ok", text: "Read TGS Parts 1-9 + 12 daily notes." },
      { type: "link", text: "Found 9 open threads:" },
      { type: "link", text: "• Cup Economics vs Ocean Economics (P3)" },
      { type: "link", text: "• The Saboteur unresolved arc (P6)" },
      { type: "ok", text: "Created: TGS — Open Threads Synthesis.md" },
    ],
    install: "# In Obsidian: Community Plugins → Search 'Claude Code'\n# Install Derek Larson's Claude Code plugin\n# Settings → Claude Code → Set API Key",
    status: "ACTIVE",
  },
  {
    id: "obsidian-skill",
    num: "03",
    label: "OBSIDIAN SKILL",
    tag: "v0.11 · MAR 2026",
    tagline: "Teaches Claude to use Obsidian properly.",
    desc: "The Obsidian Skill routes Claude to the right tool — MCP for search, CLI for daily notes, Git for sync. Preflight checks and setup guidance built in. Claude knows your vault's structure.",
    features: [
      { title: "Tag-aware", body: "Scans all frontmatter tags and inline hashtags with occurrence counts. Suggests the right tag when creating notes." },
      { title: "Active file awareness", body: "Knows which note is open in Obsidian. Operations target the right context automatically — no manual pointing." },
    ],
    terminal: [
      { type: "cmd", text: "claude /obsidian" },
      { type: "ok", text: "✓ Obsidian Skill loaded · v0.11" },
      { type: "info", text: "Preflight: vault ✓ · git ✓ · MCP ✓" },
      { type: "blank" },
      { type: "prompt", text: "> Create daily note for today" },
      { type: "info", text: "and pull yesterday's open tasks" },
      { type: "link", text: "→ Routed: daily_note + tag_scan" },
      { type: "link", text: "→ Active file detected" },
      { type: "link", text: "→ 31 tags · 8 MOCs linked" },
      { type: "blank" },
      { type: "ok", text: "✓ Created: 2026-05-04.md" },
      { type: "info", text: "frontmatter: tags, weather, mood" },
      { type: "info", text: "4 open tasks carried forward" },
      { type: "ok", text: "✓ Git commit: daily note 2026-05-04" },
    ],
    install: "# Add to CLAUDE.md in vault root:\n/obsidian — trigger Obsidian Skill\n# Or add skill file to ~/.claude/skills/",
    status: "ACTIVE",
  },
  {
    id: "knowledge-compiler",
    num: "04",
    label: "KNOWLEDGE COMPILER",
    tag: "19M+ VIEWS · APR 2026",
    tagline: "Every session. Compiled into your vault. Automatically.",
    desc: "Instead of starting fresh each time, Claude compiles raw notes and research into organised wiki pages. Each new source updates 10-15 related notes. Karpathy's method — the knowledge compounds.",
    features: [
      { title: "Wiki-style structure", body: "Markdown with [[backlinks]] connecting concepts. Claude maintains the graph as you add sources." },
      { title: "Compounds over time", body: "Every research session makes the next one sharper. Your vault becomes a personal knowledge engine, not a dump." },
    ],
    terminal: [
      { type: "folder", text: "Areas/" },
      { type: "file", text: "  Content/" },
      { type: "active", text: "  Chambers Pipeline" },
      { type: "file", text: "  Sneakers Fest" },
      { type: "folder", text: "Daily/" },
      { type: "file", text: "  2026-05-04" },
      { type: "file", text: "  2026-05-03" },
      { type: "folder", text: "MOCs/" },
      { type: "file", text: "  Catalyst OS MOC" },
      { type: "blank" },
      { type: "note-title", text: "Chambers Pipeline" },
      { type: "tag", text: "tags: #chambers #legal #ai" },
      { type: "body", text: "Compiled from 4 sources · 12 backlinks" },
      { type: "link", text: "Related: [[docling]] [[llamaindex]]" },
      { type: "link", text: "[[crawl4ai]] [[fast-whisper]]" },
    ],
    install: "# Add to system prompt:\nAfter every research session, compile findings\ninto wiki notes. Update [[backlinks]] for all\nrelated concepts. Flag stale notes for review.",
    status: "ACTIVE",
  },
  {
    id: "git-sync",
    num: "05",
    label: "GIT SYNC + DAILY",
    tag: "ONGOING · APR 2026",
    tagline: "Multi-device. Versioned. Auto-journalled.",
    desc: "Git-backed sync runs quietly in the background. Daily notes auto-populate with calendar events, meeting summaries and tasks pulled from Slack or email. Your vault becomes a living journal.",
    features: [
      { title: "Git version control", body: "Every change versioned. Roll back any edit. Sync across Mac, iPhone, iPad — no Obsidian Sync subscription needed." },
      { title: "Daily auto-journal", body: "Claude generates tomorrow's daily note from today's context. Tasks carried forward, meetings linked, threads tracked." },
    ],
    terminal: [
      { type: "cmd", text: "cd ~/CatalystOS && git status" },
      { type: "info", text: "On branch main" },
      { type: "info", text: "Your branch is up to date with origin/main" },
      { type: "blank" },
      { type: "ok", text: "Changes by Claude (today):" },
      { type: "link", text: "modified:  Daily/2026-05-04.md" },
      { type: "link", text: "new file:  MOCs/Q2 Open Questions.md" },
      { type: "link", text: "modified:  Areas/Chambers Pipeline.md" },
      { type: "link", text: "modified:  Areas/Sneakers Fest 2026.md" },
      { type: "blank" },
      { type: "cmd", text: "git log --oneline -3" },
      { type: "hash", text: "a3f9c1e daily note 2026-05-04" },
      { type: "hash", text: "8d2b44a compile: Chambers pipeline +4" },
      { type: "hash", text: "1e7f9ab weekly review synthesis" },
      { type: "blank" },
      { type: "ok", text: "✓ Auto-pushed · synced across 3 devices" },
    ],
    install: "cd ~/CatalystOS\ngit init && git remote add origin <repo>\n# Add to crontab:\n*/30 * * * * cd ~/CatalystOS && git add -A && git commit -m 'auto-sync' && git push",
    status: "ACTIVE",
  },
];

function TerminalLine({ line }) {
  const colors = {
    cmd: "#C9A84C",
    ok: "#3ddc84",
    link: "#7ab8f5",
    info: "#888",
    prompt: "#e8e8e8",
    tag: "#bb86fc",
    section: "#C9A84C",
    body: "#999",
    sidebar: "#3ddc84",
    note: "#e8e8e8",
    "note-title": "#C9A84C",
    folder: "#C9A84C",
    file: "#aaa",
    active: "#3ddc84",
    hash: "#bb86fc",
    blank: "transparent",
  };
  if (line.type === "blank") return <div style={{ height: 6 }} />;
  return (
    <div style={{ color: colors[line.type] || "#e8e8e8", fontSize: 11, lineHeight: "1.7", fontFamily: "JetBrains Mono, Fira Code, monospace", whiteSpace: "pre" }}>
      {line.text}
    </div>
  );
}

function SetupCard({ setup, active, onClick }) {
  return (
    <div
      onClick={onClick}
      style={{
        background: active ? "#161616" : PANEL,
        border: `1px solid ${active ? GOLD : BORDER}`,
        borderRadius: 6,
        padding: "14px 16px",
        cursor: "pointer",
        transition: "all 0.2s ease",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {active && (
        <div style={{
          position: "absolute", top: 0, left: 0, right: 0, height: 2,
          background: `linear-gradient(90deg, ${GOLD}, transparent)`,
        }} />
      )}
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
        <span style={{ fontFamily: "JetBrains Mono, monospace", fontSize: 10, color: active ? GOLD : MUTED, fontWeight: 700 }}>
          {setup.num}
        </span>
        <span style={{ fontFamily: "JetBrains Mono, monospace", fontSize: 11, color: active ? GOLD : "#666", fontWeight: 700, letterSpacing: 1 }}>
          {setup.label}
        </span>
        {active && (
          <span style={{ marginLeft: "auto", width: 6, height: 6, borderRadius: "50%", background: GREEN, boxShadow: `0 0 6px ${GREEN}` }} />
        )}
      </div>
      <div style={{ fontSize: 10, color: active ? "#bbb" : MUTED, lineHeight: 1.5, fontFamily: "JetBrains Mono, monospace" }}>
        {setup.tagline}
      </div>
    </div>
  );
}

export default function CatalystOSObsidian() {
  const [active, setActive] = useState(0);
  const [tab, setTab] = useState("terminal");
  const [copied, setCopied] = useState(false);
  const [time, setTime] = useState(new Date());
  const termRef = useRef(null);
  const setup = SETUPS[active];

  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    setTab("terminal");
    setCopied(false);
  }, [active]);

  const handleCopy = () => {
    navigator.clipboard.writeText(setup.install).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div style={{
      background: BG,
      minHeight: "100vh",
      color: TEXT,
      fontFamily: "JetBrains Mono, Fira Code, monospace",
      padding: 0,
    }}>
      {/* TOP BAR */}
      <div style={{
        borderBottom: `1px solid ${BORDER}`,
        padding: "10px 24px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        background: "#0a0a0a",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div style={{ fontSize: 10, color: GOLD, fontWeight: 700, letterSpacing: 2 }}>CATALYST OS</div>
          <div style={{ width: 1, height: 14, background: BORDER }} />
          <div style={{ fontSize: 10, color: MUTED, letterSpacing: 1 }}>OBSIDIAN MODULE</div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <div style={{ fontSize: 9, color: GREEN }}>● VAULT CONNECTED</div>
          <div style={{ fontSize: 9, color: MUTED }}>
            {time.toLocaleTimeString("en-NG", { hour12: false })} WAT
          </div>
        </div>
      </div>

      {/* HERO */}
      <div style={{
        padding: "28px 24px 20px",
        borderBottom: `1px solid ${BORDER}`,
        background: "linear-gradient(180deg, #111 0%, #0d0d0d 100%)",
      }}>
        <div style={{ fontSize: 9, color: GOLD_DIM, letterSpacing: 3, marginBottom: 8 }}>
          CLAUDE + OBSIDIAN · FULL STACK · 5 SETUPS
        </div>
        <div style={{ fontSize: 26, fontWeight: 800, color: "#fff", letterSpacing: -0.5, lineHeight: 1.1, marginBottom: 8 }}>
          Five Setups. One Vault.
        </div>
        <div style={{ fontSize: 11, color: "#666", maxWidth: 520, lineHeight: 1.6 }}>
          The complete Claude + Obsidian stack. Every setup integrated into CatalystOS and configured for the Lagos operating context.
        </div>
        <div style={{ display: "flex", gap: 20, marginTop: 16 }}>
          {[
            { val: "5", label: "SETUPS" },
            { val: "ALL", label: "ACTIVE" },
            { val: "1", label: "VAULT" },
            { val: "∞", label: "COMPOUND" },
          ].map(s => (
            <div key={s.label}>
              <div style={{ fontSize: 18, color: GOLD, fontWeight: 700 }}>{s.val}</div>
              <div style={{ fontSize: 8, color: MUTED, letterSpacing: 1.5 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ display: "flex", height: "calc(100vh - 200px)", minHeight: 600 }}>
        {/* SIDEBAR */}
        <div style={{
          width: 240,
          borderRight: `1px solid ${BORDER}`,
          padding: "16px 12px",
          display: "flex",
          flexDirection: "column",
          gap: 8,
          overflowY: "auto",
          background: "#0a0a0a",
        }}>
          <div style={{ fontSize: 8, color: MUTED, letterSpacing: 2, marginBottom: 4, paddingLeft: 4 }}>SETUPS</div>
          {SETUPS.map((s, i) => (
            <SetupCard
              key={s.id}
              setup={s}
              active={i === active}
              onClick={() => setActive(i)}
            />
          ))}
          <div style={{ marginTop: "auto", paddingTop: 16, borderTop: `1px solid ${BORDER}` }}>
            <div style={{ fontSize: 8, color: MUTED, lineHeight: 1.8 }}>
              <div style={{ color: GREEN }}>● MCP SERVER</div>
              <div>● GIT SYNC</div>
              <div>● SKILL LOADED</div>
            </div>
          </div>
        </div>

        {/* MAIN PANEL */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
          {/* SETUP HEADER */}
          <div style={{
            padding: "18px 24px 16px",
            borderBottom: `1px solid ${BORDER}`,
            background: "#111",
          }}>
            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
              <div>
                <div style={{ fontSize: 9, color: GOLD_DIM, letterSpacing: 2, marginBottom: 6 }}>
                  SETUP {setup.num} / 05 · {setup.tag}
                </div>
                <div style={{ fontSize: 20, fontWeight: 800, color: "#fff", marginBottom: 4 }}>
                  {setup.label.charAt(0) + setup.label.slice(1).toLowerCase().replace(/ mcp/, " MCP").replace(/ \+ /, " + ")}
                </div>
                <div style={{ fontSize: 11, color: GOLD, fontStyle: "italic", marginBottom: 8 }}>
                  {setup.tagline}
                </div>
                <div style={{ fontSize: 10, color: "#666", maxWidth: 520, lineHeight: 1.7 }}>
                  {setup.desc}
                </div>
              </div>
              <div style={{
                background: "#0d0d0d",
                border: `1px solid ${BORDER}`,
                borderRadius: 4,
                padding: "6px 12px",
                fontSize: 9,
                color: GREEN,
                letterSpacing: 1,
              }}>
                ● {setup.status}
              </div>
            </div>

            {/* FEATURE PILLS */}
            <div style={{ display: "flex", gap: 8, marginTop: 14 }}>
              {setup.features.map(f => (
                <div key={f.title} style={{
                  background: "#0d0d0d",
                  border: `1px solid ${BORDER}`,
                  borderRadius: 4,
                  padding: "8px 12px",
                  flex: 1,
                }}>
                  <div style={{ fontSize: 9, color: GOLD, fontWeight: 700, marginBottom: 3, letterSpacing: 0.5 }}>
                    {f.title.toUpperCase()}
                  </div>
                  <div style={{ fontSize: 9, color: "#777", lineHeight: 1.6 }}>{f.body}</div>
                </div>
              ))}
            </div>
          </div>

          {/* TABS */}
          <div style={{
            display: "flex",
            borderBottom: `1px solid ${BORDER}`,
            background: "#0d0d0d",
          }}>
            {["terminal", "install", "config"].map(t => (
              <button
                key={t}
                onClick={() => setTab(t)}
                style={{
                  background: "none",
                  border: "none",
                  borderBottom: tab === t ? `2px solid ${GOLD}` : "2px solid transparent",
                  color: tab === t ? GOLD : MUTED,
                  padding: "10px 20px",
                  fontSize: 9,
                  letterSpacing: 1.5,
                  cursor: "pointer",
                  fontFamily: "JetBrains Mono, monospace",
                  fontWeight: tab === t ? 700 : 400,
                }}
              >
                {t.toUpperCase()}
              </button>
            ))}
          </div>

          {/* TAB CONTENT */}
          <div style={{ flex: 1, overflow: "auto", padding: 20 }}>
            {tab === "terminal" && (
              <div style={{
                background: "#0a0a0a",
                border: `1px solid ${BORDER}`,
                borderRadius: 6,
                overflow: "hidden",
              }}>
                <div style={{
                  padding: "8px 14px",
                  background: "#141414",
                  borderBottom: `1px solid ${BORDER}`,
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                }}>
                  <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#ff5f57" }} />
                  <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#febc2e" }} />
                  <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#28c840" }} />
                  <div style={{ marginLeft: 8, fontSize: 9, color: MUTED }}>
                    CATALYST OS · {setup.label}
                  </div>
                </div>
                <div ref={termRef} style={{ padding: "14px 16px" }}>
                  {setup.terminal.map((line, i) => (
                    <TerminalLine key={i} line={line} />
                  ))}
                  <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 8 }}>
                    <span style={{ color: GOLD, fontSize: 11 }}>›</span>
                    <span style={{
                      display: "inline-block",
                      width: 6, height: 13,
                      background: GOLD,
                      opacity: 0.8,
                      animation: "blink 1.2s step-end infinite",
                    }} />
                  </div>
                </div>
              </div>
            )}

            {tab === "install" && (
              <div>
                <div style={{ fontSize: 9, color: MUTED, marginBottom: 12, letterSpacing: 1 }}>
                  INSTALLATION · SETUP {setup.num}
                </div>
                <div style={{
                  background: "#0a0a0a",
                  border: `1px solid ${BORDER}`,
                  borderRadius: 6,
                  overflow: "hidden",
                  position: "relative",
                }}>
                  <div style={{
                    padding: "8px 14px",
                    background: "#141414",
                    borderBottom: `1px solid ${BORDER}`,
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}>
                    <span style={{ fontSize: 9, color: MUTED }}>bash</span>
                    <button
                      onClick={handleCopy}
                      style={{
                        background: copied ? GREEN + "22" : "none",
                        border: `1px solid ${copied ? GREEN : BORDER}`,
                        color: copied ? GREEN : MUTED,
                        borderRadius: 3,
                        padding: "2px 10px",
                        fontSize: 8,
                        cursor: "pointer",
                        fontFamily: "JetBrains Mono, monospace",
                        transition: "all 0.2s",
                      }}
                    >
                      {copied ? "COPIED" : "COPY"}
                    </button>
                  </div>
                  <pre style={{
                    margin: 0,
                    padding: 16,
                    fontSize: 11,
                    color: "#aaa",
                    fontFamily: "JetBrains Mono, monospace",
                    lineHeight: 1.8,
                    whiteSpace: "pre-wrap",
                  }}>
                    {setup.install}
                  </pre>
                </div>
              </div>
            )}

            {tab === "config" && (
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                <div style={{ fontSize: 9, color: MUTED, letterSpacing: 1 }}>CATALYST OS INTEGRATION CONFIG</div>

                {[
                  { key: "VAULT_PATH", val: "~/CatalystOS", status: "SET" },
                  { key: "GIT_REMOTE", val: "github.com/catalyst/vault", status: "SET" },
                  { key: "MCP_SERVER", val: "mcp-obsidian@latest", status: "SET" },
                  { key: "DAILY_TEMPLATE", val: "Templates/Daily.md", status: "SET" },
                  { key: "AUTO_PUSH", val: "*/30 * * * *", status: "SET" },
                  { key: "ACTIVE_PROJECTS", val: "TGS, SNEAKFEST, CHAMBERS", status: "SET" },
                  { key: "TAG_SCAN", val: "enabled", status: "SET" },
                  { key: "KNOWLEDGE_COMPILE", val: "post-session", status: "SET" },
                ].map(cfg => (
                  <div key={cfg.key} style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "10px 14px",
                    background: "#0a0a0a",
                    border: `1px solid ${BORDER}`,
                    borderRadius: 4,
                  }}>
                    <div>
                      <div style={{ fontSize: 9, color: GOLD, fontWeight: 700, letterSpacing: 0.5 }}>{cfg.key}</div>
                      <div style={{ fontSize: 10, color: "#888", marginTop: 2 }}>{cfg.val}</div>
                    </div>
                    <div style={{ fontSize: 8, color: GREEN }}>● {cfg.status}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* RIGHT PANEL — VAULT STATUS */}
        <div style={{
          width: 200,
          borderLeft: `1px solid ${BORDER}`,
          background: "#0a0a0a",
          padding: 16,
          display: "flex",
          flexDirection: "column",
          gap: 14,
        }}>
          <div style={{ fontSize: 8, color: MUTED, letterSpacing: 2 }}>VAULT STATUS</div>

          {[
            { label: "NOTES", val: "68+", sub: "repos indexed" },
            { label: "BACKLINKS", val: "2.8K", sub: "connections" },
            { label: "TAGS", val: "31", sub: "active" },
            { label: "MOCs", val: "8", sub: "maps" },
          ].map(s => (
            <div key={s.label} style={{
              background: PANEL,
              border: `1px solid ${BORDER}`,
              borderRadius: 4,
              padding: "10px 12px",
            }}>
              <div style={{ fontSize: 8, color: MUTED, letterSpacing: 1, marginBottom: 4 }}>{s.label}</div>
              <div style={{ fontSize: 18, color: GOLD, fontWeight: 700 }}>{s.val}</div>
              <div style={{ fontSize: 8, color: MUTED, marginTop: 2 }}>{s.sub}</div>
            </div>
          ))}

          <div style={{ marginTop: "auto" }}>
            <div style={{ fontSize: 8, color: MUTED, letterSpacing: 1, marginBottom: 8 }}>RECENT COMMITS</div>
            {[
              "daily note 2026-05-04",
              "chambers pipeline +4",
              "weekly synthesis",
            ].map((c, i) => (
              <div key={i} style={{
                fontSize: 8,
                color: "#555",
                padding: "4px 0",
                borderBottom: `1px solid ${BORDER}`,
                lineHeight: 1.5,
              }}>
                <span style={{ color: "#bb86fc", marginRight: 6 }}>
                  {(Math.random() * 0xffffff | 0).toString(16).slice(0, 7)}
                </span>
                {c}
              </div>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;700;800&display=swap');
        @keyframes blink { 50% { opacity: 0; } }
        * { box-sizing: border-box; }
        ::-webkit-scrollbar { width: 4px; background: #0a0a0a; }
        ::-webkit-scrollbar-thumb { background: #222; border-radius: 2px; }
      `}</style>
    </div>
  );
}
