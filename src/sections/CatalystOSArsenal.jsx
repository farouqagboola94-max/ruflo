import { useState, useMemo } from "react";

const TOOLS = [
  // PART 1: AI Coding Agents & IDEs
  { id: 1, name: "Claude Code", category: "AI Coding & IDEs", tag: "CODING", description: "Anthropic's command line coding agent. Reads files, writes code, runs tests, operates directly in your local environment. The gold standard for AI-assisted development when you want full control.", url: "https://docs.anthropic.com/en/docs/claude-code", stars: null, note: "Gold Standard" },
  { id: 2, name: "Cursor", category: "AI Coding & IDEs", tag: "CODING", description: "AI-first code editor built on VS Code. Inline completions, chat with your codebase, multi-file editing. The best editor for developers who want AI integrated into their existing workflow.", url: "https://www.cursor.com", stars: null, note: null },
  { id: 3, name: "Codex CLI", category: "AI Coding & IDEs", tag: "CODING", description: "OpenAI's terminal coding agent. Takes natural language instructions, reads your codebase, writes and executes code. Strong at multi-step implementation tasks.", url: "https://github.com/openai/codex", stars: null, note: null },
  { id: 4, name: "Windsurf", category: "AI Coding & IDEs", tag: "CODING", description: "AI coding IDE by Codeium. Cascade agent for multi-file editing, deep codebase understanding, and flow-state coding. Growing fast.", url: "https://codeium.com/windsurf", stars: null, note: "Growing Fast" },
  { id: 5, name: "Superpowers", category: "AI Coding & IDEs", tag: "CODING", description: "20+ battle-tested Claude Code skills. TDD, debugging, plan-to-execute pipelines. 96,000+ stars on GitHub. If you use Claude Code, install this first.", url: "https://github.com/obra/superpowers", stars: "96K+", note: "Install First" },
  { id: 6, name: "Spec Kit", category: "AI Coding & IDEs", tag: "CODING", description: "Spec-driven development. Write specifications, AI generates code from them. Forces you to think before you build. 50,000+ stars.", url: "https://github.com/github/spec-kit", stars: "50K+", note: null },
  { id: 7, name: "Aider", category: "AI Coding & IDEs", tag: "CODING", description: "AI pair programming in your terminal. Works with any LLM. Strong at working with existing codebases. 30,000+ stars.", url: "https://github.com/paul-gauthier/aider", stars: "30K+", note: null },
  // PART 2: Agent Frameworks
  { id: 8, name: "OpenClaw", category: "Agent Frameworks", tag: "AGENT", description: "Viral open-source AI agent — persistent, multi-channel, self-learning. 210K+ stars. Easiest way to start personal AI agents.", url: "https://github.com/openclaw/openclaw", stars: "210K+", note: "Viral" },
  { id: 9, name: "LangGraph", category: "Agent Frameworks", tag: "AGENT", description: "Multi-agent orchestration as code. Build agents as graphs with branching logic, human-in-the-loop, and persistent state. 26,000+ stars.", url: "https://github.com/langchain-ai/langgraph", stars: "26K+", note: null },
  { id: 10, name: "CrewAI", category: "Agent Frameworks", tag: "AGENT", description: "Multi-agent framework with roles, goals, and backstories. Each agent has a defined persona and responsibility. Good for team-like workflows.", url: "https://github.com/crewAIInc/crewAI", stars: null, note: null },
  { id: 11, name: "AutoGPT", category: "Agent Frameworks", tag: "AGENT", description: "Full autonomous agent platform for long-running tasks. The OG agent framework. Matured significantly since early days.", url: "https://github.com/Significant-Gravitas/AutoGPT", stars: null, note: "The OG" },
  { id: 12, name: "Dify", category: "Agent Frameworks", tag: "AGENT", description: "Open-source LLM app builder. Combines workflows, RAG, agents, and model management in one platform. Good for non-developers building AI apps.", url: "https://github.com/langgenius/dify", stars: null, note: "No-Code Friendly" },
  { id: 13, name: "OWL", category: "Agent Frameworks", tag: "AGENT", description: "Multi-agent cooperation framework. Tops the GAIA benchmark for agent coordination. Cutting edge research turned into usable code.", url: "https://github.com/camel-ai/owl", stars: null, note: "GAIA #1" },
  { id: 14, name: "CopilotKit", category: "Agent Frameworks", tag: "AGENT", description: "Embed AI copilots directly into React applications. Ship AI features in your product, not just your workflow.", url: "https://github.com/CopilotKit/CopilotKit", stars: null, note: null },
  { id: 15, name: "pydantic-ai", category: "Agent Frameworks", tag: "AGENT", description: "Type-safe agent framework built on Pydantic. For Python developers who want structured, validated agent outputs.", url: "https://github.com/pydantic/pydantic-ai", stars: null, note: null },
  // PART 3: MCP Servers & Tools
  { id: 16, name: "Tavily", category: "MCP Servers & Tools", tag: "MCP", description: "Search engine built for AI agents. Not blue links — clean, structured, LLM-ready data. Four tools: search, extract, crawl, map. Connects as remote MCP in one minute.", url: "https://github.com/tavily-ai/tavily-mcp", stars: null, note: "1-Min Setup" },
  { id: 17, name: "Context7", category: "MCP Servers & Tools", tag: "MCP", description: "Injects up-to-date library documentation into your LLM's context. No more hallucinated APIs or deprecated methods. Add 'use context7' to your prompt and it pulls current docs.", url: "https://github.com/upstash/context7", stars: null, note: "Anti-Hallucination" },
  { id: 18, name: "Task Master AI", category: "MCP Servers & Tools", tag: "MCP", description: "Your AI's project manager. Feed it a PRD and it generates structured tasks with dependencies. Claude executes them one by one. Turns chaotic sessions into organized pipelines.", url: "https://github.com/eyaltoledano/claude-task-master", stars: null, note: "Pipeline OS" },
  { id: 19, name: "MCP Playwright", category: "MCP Servers & Tools", tag: "MCP", description: "Browser automation for LLMs. Control a real browser through natural language. Testing, scraping, interaction.", url: "https://github.com/executeautomation/mcp-playwright", stars: null, note: null },
  { id: 20, name: "fastmcp", category: "MCP Servers & Tools", tag: "MCP", description: "Build MCP servers in minimal Python. The fastest way to create custom tool integrations for Claude or any MCP-compatible model.", url: "https://github.com/jlowin/fastmcp", stars: null, note: null },
  { id: 21, name: "markdownify-mcp", category: "MCP Servers & Tools", tag: "MCP", description: "Convert PDFs, images, and audio into Markdown. Feed any document type into your AI workflow.", url: "https://github.com/zcaceres/markdownify-mcp", stars: null, note: "Content Pipeline" },
  { id: 22, name: "MCPHub", category: "MCP Servers & Tools", tag: "MCP", description: "Manage multiple MCP servers via HTTP. One dashboard for all your tool connections.", url: "https://github.com/samanhappy/mcphub", stars: null, note: null },
  // PART 4: Claude Skills
  { id: 23, name: "PDF Processing", category: "Claude Skills", tag: "SKILL", description: "Official Anthropic skill. Read, extract tables, fill forms, merge and split PDFs. The highest-utility skill for knowledge workers.", url: "https://github.com/anthropics/skills/tree/main/skills/pdf", stars: null, note: "Official · Top Utility" },
  { id: 24, name: "Frontend Design", category: "Claude Skills", tag: "SKILL", description: "Official Anthropic skill. Build real design systems, bold typography, production-grade UI. Escape the 'AI slop' aesthetic. 277,000+ installs.", url: "https://github.com/anthropics/skills/tree/main/skills/frontend-design", stars: "277K installs", note: "Official" },
  { id: 25, name: "Skill Creator", category: "Claude Skills", tag: "SKILL", description: "The meta-skill. Describe a workflow in plain English, get a complete SKILL.md back in five minutes. Build new skills without configuration.", url: "https://github.com/anthropics/skills/tree/main/skills/skill-creator", stars: null, note: "Official · Meta" },
  { id: 26, name: "Marketing Skills", category: "Claude Skills", tag: "SKILL", description: "By Corey Haines. 20+ skills covering CRO, copywriting, SEO, email sequences, growth strategy. All marketing skills, in one place.", url: "https://github.com/coreyhaines31/marketingskills", stars: null, note: "20+ Skills" },
  { id: 27, name: "Claude SEO", category: "Claude Skills", tag: "SKILL", description: "Full-site audits, schema validation, keyword analysis. 12 sub-skills covering the complete SEO workflow.", url: "https://github.com/AgriciDaniel/claude-seo", stars: null, note: "12 Sub-Skills" },
  { id: 28, name: "Obsidian Skills", category: "Claude Skills", tag: "SKILL", description: "Built by Obsidian's CEO. Auto-tagging, auto-linking, vault-native operations. If you use Obsidian, this is essential.", url: "https://github.com/kepano/obsidian-skills", stars: null, note: "Essential for Obsidian" },
  { id: 29, name: "Context Optimization", category: "Claude Skills", tag: "SKILL", description: "Reduce token costs and improve KV-cache efficiency. Makes expensive API workflows significantly cheaper. 13,900+ stars.", url: "https://github.com/muratcankoylan/agent-skills-for-context-engineering", stars: "13.9K+", note: "Cost Reducer" },
  { id: 30, name: "Deep Research Skill", category: "Claude Skills", tag: "SKILL", description: "8-phase research with auto-continuation. For when you need Claude to go deep on a topic, not just skim the surface.", url: "https://github.com/199-biotechnologies/claude-deep-research-skill", stars: null, note: "8-Phase" },
  // PART 5: Local AI & Model Running
  { id: 31, name: "Ollama", category: "Local AI & Models", tag: "LOCAL", description: "Run open-source LLMs locally with one terminal command. Supports Llama, Mistral, Gemma, and dozens more. The fastest path from zero to local AI.", url: "https://github.com/ollama/ollama", stars: null, note: "1-Command Setup" },
  { id: 32, name: "Open WebUI", category: "Local AI & Models", tag: "LOCAL", description: "Self-hosted ChatGPT-like interface. Clean, fast, full-featured. Pairs perfectly with Ollama for a private AI setup.", url: "https://github.com/open-webui/open-webui", stars: null, note: "Private Setup" },
  { id: 33, name: "LlamaFile", category: "Local AI & Models", tag: "LOCAL", description: "Package an entire LLM as a single executable file. Zero dependencies. Download and run. Absurdly simple.", url: "https://github.com/Mozilla-Ocho/llamafile", stars: null, note: "Zero Dependencies" },
  { id: 34, name: "Unsloth", category: "Local AI & Models", tag: "LOCAL", description: "Fine-tune models 2x faster with 70% less memory. If you need a custom model trained on your data, start here.", url: "https://github.com/unslothai/unsloth", stars: null, note: "Fine-Tuning" },
  { id: 35, name: "vLLM", category: "Local AI & Models", tag: "LOCAL", description: "High-throughput inference engine. 2 to 4x faster than naive serving. The standard for production deployment of open-source models.", url: "https://github.com/vllm-project/vllm", stars: null, note: "Production" },
  // PART 6: Workflow & Automation
  { id: 36, name: "n8n", category: "Workflow & Automation", tag: "AUTO", description: "Open-source workflow automation with 400+ integrations and AI nodes. Self-hostable. The best visual builder for AI-powered automations.", url: "https://github.com/n8n-io/n8n", stars: null, note: "400+ Integrations" },
  { id: 37, name: "Langflow", category: "Workflow & Automation", tag: "AUTO", description: "Visual drag-and-drop for agent pipelines. 140,000+ stars. Build complex agent workflows without writing code.", url: "https://github.com/langflow-ai/langflow", stars: "140K+", note: "No-Code Agents" },
  { id: 38, name: "Huginn", category: "Workflow & Automation", tag: "AUTO", description: "Self-hosted web agents for monitoring, alerts, and data collection. Privacy-first automation that runs on your server.", url: "https://github.com/huginn/huginn", stars: null, note: "Privacy First" },
  { id: 39, name: "DSPy", category: "Workflow & Automation", tag: "AUTO", description: "Program (not prompt) foundation models. Stanford research framework. For when prompting is not deterministic enough.", url: "https://github.com/stanfordnlp/dspy", stars: null, note: "Stanford" },
  { id: 40, name: "Temporal", category: "Workflow & Automation", tag: "AUTO", description: "Durable workflow engine for long-running processes. When your automation needs to survive crashes, retries, and timeouts.", url: "https://github.com/temporalio/temporal", stars: null, note: "Crash-Proof" },
  // PART 7: Search, Data & RAG
  { id: 41, name: "GPT Researcher", category: "Search, Data & RAG", tag: "DATA", description: "Autonomous research agent that produces compiled reports. Give it a topic, get back a thorough analysis with sources.", url: "https://github.com/assafelovic/gpt-researcher", stars: null, note: "Autonomous Research" },
  { id: 42, name: "Firecrawl", category: "Search, Data & RAG", tag: "DATA", description: "Turn any website into LLM-ready data. Web scraping designed specifically for AI pipelines.", url: "https://github.com/mendableai/firecrawl", stars: null, note: null },
  { id: 43, name: "Vanna AI", category: "Search, Data & RAG", tag: "DATA", description: "Natural language to SQL. Ask questions in English, get database queries back. For anyone who needs data from databases without writing SQL.", url: "https://github.com/vanna-ai/vanna", stars: null, note: "NL to SQL" },
  { id: 44, name: "Instructor", category: "Search, Data & RAG", tag: "DATA", description: "Get structured JSON outputs from any LLM using Pydantic models. Works with OpenAI, Anthropic, Google, and 15+ providers. What production AI engineers actually use.", url: "https://python.useinstructor.com", stars: null, note: "Production Standard" },
  { id: 45, name: "Chroma", category: "Search, Data & RAG", tag: "DATA", description: "Open-source vector database. The simplest way to add semantic search and long-term memory to your AI applications.", url: "https://github.com/chroma-core/chroma", stars: null, note: "Vector DB" },
  { id: 46, name: "dlt", category: "Search, Data & RAG", tag: "DATA", description: "LLM-native data pipelines from 5,000+ sources. Get data from anywhere into your AI workflow.", url: "https://github.com/dlt-hub/dlt", stars: null, note: "5K+ Sources" },
  { id: 47, name: "ExtractThinker", category: "Search, Data & RAG", tag: "DATA", description: "ORM for document intelligence. Extract structured data from any document type.", url: "https://github.com/enoch3712/ExtractThinker", stars: null, note: null },
  // PART 8: API & Infrastructure
  { id: 48, name: "FastAPI", category: "API & Infrastructure", tag: "INFRA", description: "The Python web framework for serving AI applications. Exceptional documentation. Pydantic validation built in.", url: "https://github.com/tiangolo/fastapi", stars: null, note: null },
  { id: 49, name: "Portkey Gateway", category: "API & Infrastructure", tag: "INFRA", description: "Route requests to 250+ LLMs through one API. Switch models without changing code.", url: "https://github.com/Portkey-AI/gateway", stars: null, note: "250+ LLMs" },
  { id: 50, name: "OmniRoute", category: "API & Infrastructure", tag: "INFRA", description: "API proxy for 44+ AI providers. Load balancing, fallbacks, and cost optimization.", url: "https://github.com/diegosouzapw/OmniRoute", stars: null, note: "44+ Providers" },
  { id: 51, name: "lmnr", category: "API & Infrastructure", tag: "INFRA", description: "Trace and evaluate agent behavior. See exactly what your agents are doing and measure whether they are doing it well.", url: "https://github.com/lmnr-ai/lmnr", stars: null, note: "Observability" },
  { id: 52, name: "Codebase Memory MCP", category: "API & Infrastructure", tag: "INFRA", description: "Convert your codebase into a persistent knowledge graph. Claude remembers your entire project structure across sessions.", url: "https://github.com/DeusData/codebase-memory-mcp", stars: null, note: "Persistent Memory" },
  // PART 9: Collections & Learning
  { id: 53, name: "Awesome Claude Skills", category: "Collections & Learning", tag: "LEARN", description: "The best curated skill list. 22,000+ stars. Start here when looking for new skills to install.", url: "https://github.com/travisvn/awesome-claude-skills", stars: "22K+", note: "Start Here" },
  { id: 54, name: "Anthropic Skills Repo", category: "Collections & Learning", tag: "LEARN", description: "Official reference implementations from Anthropic. The gold standard for how skills should be built.", url: "https://github.com/anthropics/skills", stars: null, note: "Official" },
  { id: 55, name: "Awesome Agents", category: "Collections & Learning", tag: "LEARN", description: "100+ open-source agent tools in one curated list.", url: "https://github.com/kyrolabs/awesome-agents", stars: null, note: "100+ Tools" },
  { id: 56, name: "PromptingGuide", category: "Collections & Learning", tag: "LEARN", description: "Comprehensive prompt engineering reference covering every technique from basics to advanced agent prompting.", url: "https://www.promptingguide.ai", stars: null, note: null },
  { id: 57, name: "Anthropic Prompt Eng. Tutorial", category: "Collections & Learning", tag: "LEARN", description: "9 chapters of hands-on exercises with Jupyter notebooks. The best structured way to learn prompting.", url: "https://github.com/anthropics/prompt-eng-interactive-tutorial", stars: null, note: "Official · 9 Chapters" },
  { id: 58, name: "SkillsMP", category: "Collections & Learning", tag: "LEARN", description: "Marketplace with 80,000+ community skills. The largest catalog for discovering Claude skills.", url: "https://skillsmp.com", stars: "80K+ skills", note: "Largest Catalog" },
  { id: 59, name: "MAGI//ARCHIVE", category: "Collections & Learning", tag: "LEARN", description: "Daily feed of fresh AI repos. Stay on top of what is shipping.", url: "https://tom-doerr.github.io/repo_posts/", stars: null, note: "Daily Feed" },
  { id: 60, name: "Anthropic Official Docs", category: "Collections & Learning", tag: "LEARN", description: "Covers the API, prompting best practices, tool use, agents, and everything else. Read this cover to cover before building anything serious.", url: "https://docs.anthropic.com", stars: null, note: "Read This First" },
];

const CATEGORIES = [
  { key: "ALL", label: "ALL 60", color: "#FF6B35" },
  { key: "AI Coding & IDEs", label: "CODING", color: "#00D4FF" },
  { key: "Agent Frameworks", label: "AGENTS", color: "#A855F7" },
  { key: "MCP Servers & Tools", label: "MCP", color: "#22C55E" },
  { key: "Claude Skills", label: "SKILLS", color: "#F59E0B" },
  { key: "Local AI & Models", label: "LOCAL", color: "#EF4444" },
  { key: "Workflow & Automation", label: "AUTO", color: "#06B6D4" },
  { key: "Search, Data & RAG", label: "DATA", color: "#84CC16" },
  { key: "API & Infrastructure", label: "INFRA", color: "#F97316" },
  { key: "Collections & Learning", label: "LEARN", color: "#EC4899" },
];

const TAG_COLORS = {
  CODING: "#00D4FF",
  AGENT: "#A855F7",
  MCP: "#22C55E",
  SKILL: "#F59E0B",
  LOCAL: "#EF4444",
  AUTO: "#06B6D4",
  DATA: "#84CC16",
  INFRA: "#F97316",
  LEARN: "#EC4899",
};

export default function CatalystOSArsenal() {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("ALL");
  const [hoveredId, setHoveredId] = useState(null);

  const filtered = useMemo(() => {
    return TOOLS.filter((t) => {
      const matchCat = activeCategory === "ALL" || t.category === activeCategory;
      const q = search.toLowerCase();
      const matchSearch =
        !q ||
        t.name.toLowerCase().includes(q) ||
        t.description.toLowerCase().includes(q) ||
        t.category.toLowerCase().includes(q);
      return matchCat && matchSearch;
    });
  }, [search, activeCategory]);

  const catColor = (cat) =>
    CATEGORIES.find((c) => c.key === cat)?.color || "#FF6B35";

  return (
    <section id="catalyst-arsenal" style={{ minHeight: "100vh", background: "#080808", color: "#E8E4DC", fontFamily: "'Georgia', 'Times New Roman', serif", padding: "0" }}>
      {/* NOISE OVERLAY */}
      <div style={{ position: "absolute", inset: 0, backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.03'/%3E%3C/svg%3E\")", pointerEvents: "none", zIndex: 0, opacity: 0.4 }} />

      {/* HEADER */}
      <div style={{ position: "relative", zIndex: 1, borderBottom: "1px solid #1a1a1a", padding: "48px 40px 36px", background: "linear-gradient(180deg, #0f0f0f 0%, #080808 100%)" }}>
        <div style={{ fontSize: "10px", letterSpacing: "0.4em", color: "#FF6B35", fontFamily: "'Courier New', monospace", marginBottom: "16px", fontWeight: "bold" }}>
          CATALYST OS // AI ARSENAL // 2026 EDITION
        </div>
        <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", flexWrap: "wrap", gap: "20px" }}>
          <div>
            <h1 style={{ fontSize: "clamp(36px, 6vw, 72px)", fontWeight: "900", letterSpacing: "-0.03em", margin: 0, lineHeight: 0.9, color: "#FFFFFF" }}>
              THE ARSENAL
            </h1>
            <div style={{ fontSize: "clamp(12px, 2vw, 15px)", color: "#555", marginTop: "12px", fontFamily: "'Courier New', monospace", letterSpacing: "0.05em" }}>
              60 weapons. 9 categories. Zero excuses.
            </div>
          </div>
          <div style={{ display: "flex", gap: "32px" }}>
            {[{ n: "60", label: "Tools" }, { n: "9", label: "Categories" }, { n: "∞", label: "Leverage" }].map((s) => (
              <div key={s.label} style={{ textAlign: "right" }}>
                <div style={{ fontSize: "32px", fontWeight: "900", color: "#FF6B35", lineHeight: 1 }}>{s.n}</div>
                <div style={{ fontSize: "10px", letterSpacing: "0.2em", color: "#444", fontFamily: "'Courier New', monospace" }}>{s.label.toUpperCase()}</div>
              </div>
            ))}
          </div>
        </div>
        <div style={{ marginTop: "32px", position: "relative" }}>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search the arsenal..."
            style={{ width: "100%", maxWidth: "480px", padding: "12px 20px 12px 48px", background: "#111", border: "1px solid #222", borderRadius: "2px", color: "#E8E4DC", fontSize: "14px", fontFamily: "'Courier New', monospace", outline: "none", boxSizing: "border-box", letterSpacing: "0.02em" }}
          />
          <span style={{ position: "absolute", left: "18px", top: "50%", transform: "translateY(-50%)", color: "#444", fontSize: "16px" }}>⌖</span>
          {search && (
            <span style={{ marginLeft: "16px", fontSize: "12px", color: "#FF6B35", fontFamily: "'Courier New', monospace" }}>
              {filtered.length} results
            </span>
          )}
        </div>
      </div>

      {/* CATEGORY FILTERS */}
      <div style={{ position: "relative", zIndex: 1, padding: "0 40px", borderBottom: "1px solid #1a1a1a", overflowX: "auto", whiteSpace: "nowrap" }}>
        <div style={{ display: "inline-flex", gap: "0" }}>
          {CATEGORIES.map((cat) => {
            const count = cat.key === "ALL" ? TOOLS.length : TOOLS.filter((t) => t.category === cat.key).length;
            const isActive = activeCategory === cat.key;
            return (
              <button
                key={cat.key}
                onClick={() => setActiveCategory(cat.key)}
                style={{ padding: "16px 20px", background: "transparent", border: "none", borderBottom: isActive ? `2px solid ${cat.color}` : "2px solid transparent", color: isActive ? cat.color : "#444", cursor: "pointer", fontFamily: "'Courier New', monospace", fontSize: "10px", letterSpacing: "0.15em", fontWeight: "bold", transition: "all 0.15s ease", whiteSpace: "nowrap" }}
              >
                {cat.label}
                <span style={{ marginLeft: "6px", fontSize: "9px", opacity: 0.6 }}>{count}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* TOOLS GRID */}
      <div style={{ position: "relative", zIndex: 1, padding: "32px 40px 60px", display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "1px", background: "#111" }}>
        {filtered.map((tool) => {
          const tagColor = TAG_COLORS[tool.tag] || "#FF6B35";
          const isHovered = hoveredId === tool.id;
          return (
            <div
              key={tool.id}
              onMouseEnter={() => setHoveredId(tool.id)}
              onMouseLeave={() => setHoveredId(null)}
              style={{ background: isHovered ? "#141414" : "#0e0e0e", padding: "24px", display: "flex", flexDirection: "column", gap: "12px", transition: "background 0.15s ease", position: "relative", cursor: "default", borderLeft: isHovered ? `2px solid ${tagColor}` : "2px solid transparent" }}
            >
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <span style={{ fontSize: "10px", fontFamily: "'Courier New', monospace", color: "#333", fontWeight: "bold", letterSpacing: "0.05em", minWidth: "24px" }}>
                    {String(tool.id).padStart(2, "0")}
                  </span>
                  <span style={{ fontSize: "8px", letterSpacing: "0.2em", padding: "2px 8px", border: `1px solid ${tagColor}`, color: tagColor, fontFamily: "'Courier New', monospace", fontWeight: "bold" }}>
                    {tool.tag}
                  </span>
                </div>
                {tool.stars && (
                  <span style={{ fontSize: "9px", color: "#F59E0B", fontFamily: "'Courier New', monospace", letterSpacing: "0.05em" }}>★ {tool.stars}</span>
                )}
              </div>
              <div style={{ fontSize: "18px", fontWeight: "700", color: isHovered ? "#FFFFFF" : "#D4CFC7", letterSpacing: "-0.01em", lineHeight: 1.2, transition: "color 0.15s" }}>
                {tool.name}
              </div>
              <div style={{ fontSize: "12px", color: "#555", lineHeight: 1.7, fontFamily: "'Georgia', serif", flexGrow: 1 }}>
                {tool.description}
              </div>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: "4px", paddingTop: "12px", borderTop: "1px solid #1a1a1a" }}>
                {tool.note && (
                  <span style={{ fontSize: "9px", letterSpacing: "0.1em", color: tagColor, fontFamily: "'Courier New', monospace", opacity: 0.8 }}>
                    // {tool.note}
                  </span>
                )}
                <a
                  href={tool.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ fontSize: "10px", color: isHovered ? tagColor : "#333", fontFamily: "'Courier New', monospace", textDecoration: "none", letterSpacing: "0.05em", marginLeft: "auto", transition: "color 0.15s", display: "flex", alignItems: "center", gap: "4px" }}
                >
                  OPEN →
                </a>
              </div>
            </div>
          );
        })}
      </div>

      {/* FOOTER */}
      <div style={{ position: "relative", zIndex: 1, borderTop: "1px solid #1a1a1a", padding: "24px 40px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "12px" }}>
        <span style={{ fontSize: "10px", letterSpacing: "0.2em", color: "#333", fontFamily: "'Courier New', monospace" }}>CATALYST OS · THE METAL DRAGON · 2026</span>
        <span style={{ fontSize: "10px", letterSpacing: "0.1em", color: "#333", fontFamily: "'Courier New', monospace" }}>EFFICIENCY OVER EFFORT · VALUE OVER TIME</span>
      </div>
    </section>
  );
}
