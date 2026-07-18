import { useState } from "react";

const files = [
  {
    path: "my-project/CLAUDE.md",
    role: "Flow Director",
    tag: "rules",
    color: "#E8531D",
    desc: "Reads on session start. Sets model, URL, execution order, error handling.",
    lines: [
      "Start URL: higgsfield.ai/create/video",
      "Required Model: Seedance 2.0",
      "Order: prompts → navigator",
      "Video Format: 9:16 vertical social",
      "Batch Size: 9 videos/session",
    ],
  },
  {
    path: ".claude/settings.json",
    role: "MCP Config",
    tag: "browser",
    color: "#C5A028",
    desc: "Activates Playwright browser automation. No manual touch needed.",
    lines: [
      "browser_navigate",
      "browser_click",
      "browser_type",
      "browser_file_upload",
      "browser_snapshot",
    ],
  },
  {
    path: ".claude/skills/seedance-ugc-scriptwriter/SKILL.md",
    role: "UGC Scriptwriter",
    tag: "create",
    color: "#4A9EDB",
    desc: "Generates 9 complete scripts before browser opens. Hook → Problem → Action → Result.",
    lines: [
      "Language: English, real creator tone",
      "Format: [0:00–0:12] timestamps + shots",
      "Style: UGC iPhone, first person",
      "Arc: hook → problem → action → result",
      "Output: all 9 scripts in one batch",
    ],
  },
  {
    path: "my-project/reference/",
    role: "Reference Images",
    tag: "assets",
    color: "#7C4DFF",
    desc: "Auto-glob detects JPG/PNG/WEBP. Uploads via browser_file_upload to all 9 videos.",
    lines: [
      'glob("reference/*.{jpg,jpeg,png,webp}")',
      "Auto-detected before browser opens",
      "Uploaded to vault via browser_file_upload",
      "Attached to all 9 generated videos",
    ],
  },
];

const flow = [
  { step: "01", label: "Read CLAUDE.md", sub: "Loads rules + mandatory order" },
  { step: "02", label: "Invoke Scriptwriter", sub: "9 complete scripts generated" },
  { step: "03", label: "Glob Reference Images", sub: "Detects JPG/PNG/WEBP assets" },
  { step: "04", label: "Navigate to Higgsfield", sub: "Opens + verifies Seedance 2.0" },
  { step: "05", label: "Launch 9 Videos", sub: "Loop: prompt → Generate → next" },
];

export default function UGCEngine() {
  const [active, setActive] = useState(0);
  const [tab, setTab] = useState("files");

  return (
    <div style={{
      background: "#0A0A0A",
      minHeight: "100vh",
      fontFamily: "'JetBrains Mono', 'Courier New', monospace",
      color: "#E0E0E0",
      padding: "0",
    }}>
      {/* Header */}
      <div style={{
        borderBottom: "1px solid #1A1A1A",
        padding: "24px 32px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        background: "linear-gradient(90deg, #0F0F0F 0%, #0A0A0A 100%)",
      }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "4px" }}>
            <div style={{
              background: "#E8531D",
              width: "8px", height: "8px", borderRadius: "50%",
              boxShadow: "0 0 8px #E8531D",
            }} />
            <span style={{ color: "#E8531D", fontSize: "10px", letterSpacing: "3px", fontWeight: 700 }}>
              CATALYSTOS MODULE
            </span>
          </div>
          <h1 style={{
            margin: 0,
            fontSize: "22px",
            fontWeight: 700,
            color: "#FFFFFF",
            letterSpacing: "1px",
          }}>
            UGC ENGINE <span style={{ color: "#E8531D" }}>—</span> HIGGSFIELD SEEDANCE 2.0
          </h1>
        </div>
        <div style={{
          background: "#111",
          border: "1px solid #222",
          borderRadius: "6px",
          padding: "8px 16px",
          display: "flex",
          alignItems: "center",
          gap: "8px",
        }}>
          <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#22C55E", boxShadow: "0 0 6px #22C55E" }} />
          <span style={{ fontSize: "11px", color: "#888" }}>INTEGRATED</span>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ padding: "0 32px", borderBottom: "1px solid #1A1A1A", display: "flex", gap: 0 }}>
        {["files", "flow", "system tree"].map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            style={{
              background: "transparent",
              border: "none",
              borderBottom: tab === t ? "2px solid #E8531D" : "2px solid transparent",
              color: tab === t ? "#E8531D" : "#555",
              padding: "14px 20px",
              fontSize: "11px",
              letterSpacing: "2px",
              textTransform: "uppercase",
              cursor: "pointer",
              fontFamily: "inherit",
              transition: "color 0.2s",
            }}
          >
            {t}
          </button>
        ))}
      </div>

      <div style={{ padding: "32px" }}>

        {/* FILES TAB */}
        {tab === "files" && (
          <div style={{ display: "grid", gridTemplateColumns: "220px 1fr", gap: "24px" }}>
            {/* Sidebar */}
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              {files.map((f, i) => (
                <button
                  key={i}
                  onClick={() => setActive(i)}
                  style={{
                    background: active === i ? "#141414" : "transparent",
                    border: active === i ? `1px solid ${f.color}33` : "1px solid #1A1A1A",
                    borderRadius: "8px",
                    padding: "12px 14px",
                    textAlign: "left",
                    cursor: "pointer",
                    transition: "all 0.2s",
                    borderLeft: active === i ? `3px solid ${f.color}` : "3px solid transparent",
                  }}
                >
                  <div style={{ fontSize: "9px", letterSpacing: "2px", color: f.color, marginBottom: "4px" }}>
                    {f.tag.toUpperCase()}
                  </div>
                  <div style={{ fontSize: "11px", color: "#CCC", fontWeight: 600 }}>{f.role}</div>
                </button>
              ))}
            </div>

            {/* Detail */}
            <div style={{
              background: "#0D0D0D",
              border: `1px solid ${files[active].color}22`,
              borderRadius: "12px",
              padding: "28px",
            }}>
              <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "20px" }}>
                <div>
                  <div style={{ fontSize: "10px", letterSpacing: "3px", color: files[active].color, marginBottom: "6px" }}>
                    {files[active].tag.toUpperCase()} / {files[active].role.toUpperCase()}
                  </div>
                  <div style={{
                    fontFamily: "'Courier New', monospace",
                    fontSize: "13px",
                    color: files[active].color,
                    background: "#0A0A0A",
                    border: "1px solid #1A1A1A",
                    borderRadius: "6px",
                    padding: "8px 14px",
                    marginBottom: "12px",
                  }}>
                    {files[active].path}
                  </div>
                  <p style={{ margin: 0, fontSize: "13px", color: "#999", lineHeight: 1.6 }}>
                    {files[active].desc}
                  </p>
                </div>
              </div>

              <div style={{ marginTop: "24px" }}>
                <div style={{ fontSize: "10px", letterSpacing: "2px", color: "#444", marginBottom: "12px" }}>CONTENTS</div>
                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                  {files[active].lines.map((line, i) => (
                    <div key={i} style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "12px",
                      padding: "10px 14px",
                      background: "#111",
                      borderRadius: "6px",
                      border: "1px solid #1A1A1A",
                    }}>
                      <div style={{ width: "4px", height: "4px", borderRadius: "50%", background: files[active].color, flexShrink: 0 }} />
                      <span style={{ fontSize: "12px", color: "#CCC" }}>{line}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* FLOW TAB */}
        {tab === "flow" && (
          <div style={{ maxWidth: "600px" }}>
            <div style={{ marginBottom: "24px" }}>
              <p style={{ fontSize: "12px", color: "#666", margin: 0, lineHeight: 1.7 }}>
                Write the brief. The system executes in strict order — completely automatically.
              </p>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
              {flow.map((f, i) => (
                <div key={i} style={{ display: "flex", alignItems: "stretch", gap: "0" }}>
                  {/* Line */}
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: "40px", flexShrink: 0 }}>
                    <div style={{
                      width: "28px", height: "28px",
                      borderRadius: "50%",
                      background: "#E8531D",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: "9px", fontWeight: 700, color: "#000",
                      zIndex: 1,
                      flexShrink: 0,
                    }}>{f.step}</div>
                    {i < flow.length - 1 && (
                      <div style={{ width: "1px", flex: 1, background: "#1A1A1A", minHeight: "32px" }} />
                    )}
                  </div>
                  {/* Content */}
                  <div style={{
                    background: "#0D0D0D",
                    border: "1px solid #1A1A1A",
                    borderRadius: "8px",
                    padding: "14px 18px",
                    marginBottom: i < flow.length - 1 ? "4px" : "0",
                    flex: 1,
                    marginLeft: "12px",
                  }}>
                    <div style={{ fontSize: "13px", color: "#E0E0E0", fontWeight: 600 }}>{f.label}</div>
                    <div style={{ fontSize: "11px", color: "#555", marginTop: "3px" }}>{f.sub}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* SYSTEM TREE TAB */}
        {tab === "system tree" && (
          <div>
            <div style={{
              background: "#0D0D0D",
              border: "1px solid #1A1A1A",
              borderRadius: "10px",
              padding: "28px",
              fontFamily: "'Courier New', monospace",
              fontSize: "13px",
              maxWidth: "520px",
            }}>
              <div style={{ color: "#E8531D", marginBottom: "16px", fontSize: "11px", letterSpacing: "2px" }}>SYSTEM TREE</div>
              {[
                { indent: 0, text: "project/", color: "#CCC" },
                { indent: 1, text: "my-project/", color: "#4A9EDB" },
                { indent: 2, text: "CLAUDE.md", color: "#E8531D", tag: "→ rules" },
                { indent: 2, text: "reference/", color: "#4A9EDB", tag: "→ images" },
                { indent: 1, text: ".claude/", color: "#C5A028" },
                { indent: 2, text: "settings.json", color: "#C5A028", tag: "→ MCP" },
                { indent: 2, text: "skills/seedance-ugc-scriptwriter/SKILL.md", color: "#7C4DFF", tag: "→ scriptwriter" },
              ].map((line, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
                  <span style={{ color: "#333" }}>{"  ".repeat(line.indent) + (line.indent > 0 ? "├── " : "")}</span>
                  <span style={{ color: line.color }}>{line.text}</span>
                  {line.tag && <span style={{ color: "#444", fontSize: "11px" }}>{line.tag}</span>}
                </div>
              ))}
            </div>
            <div style={{ marginTop: "24px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", maxWidth: "520px" }}>
              {[
                { label: "CLAUDE.md", sub: "directs", color: "#E8531D" },
                { label: "SKILL.md", sub: "creates", color: "#7C4DFF" },
                { label: "settings.json", sub: "MCP executes", color: "#C5A028" },
                { label: "reference/", sub: "feeds assets", color: "#4A9EDB" },
              ].map((c, i) => (
                <div key={i} style={{
                  background: "#0D0D0D",
                  border: `1px solid ${c.color}33`,
                  borderRadius: "8px",
                  padding: "14px",
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                }}>
                  <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: c.color, boxShadow: `0 0 6px ${c.color}`, flexShrink: 0 }} />
                  <div>
                    <div style={{ fontSize: "12px", color: c.color, fontWeight: 600 }}>{c.label}</div>
                    <div style={{ fontSize: "10px", color: "#555" }}>{c.sub}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
