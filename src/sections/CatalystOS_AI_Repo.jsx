import { useState, useMemo } from "react";

const tools = [
  // 01 LLM INFERENCE
  { id: 1, cat: "LLM Inference", name: "ollama", stars: "98K", desc: "Run llama, mistral, qwen, gemma locally with one command. GPU acceleration, REST api, openai-compatible endpoints.", github: "github.com/ollama/ollama", tags: ["Infrastructure", "Local AI"], priority: "B" },
  { id: 2, cat: "LLM Inference", name: "llama.cpp", stars: "72K", desc: "LLM inference in pure C++. Runs on CPU, GPU, Apple Silicon. If ollama is the car, llama.cpp is the engine.", github: "github.com/ggml-org/llama.cpp", tags: ["Infrastructure"], priority: "C" },
  { id: 3, cat: "LLM Inference", name: "vllm", stars: "44K", desc: "High-throughput LLM serving for production. Continuous batching, paged attention, openai-compatible api.", github: "github.com/vllm-project/vllm", tags: ["Infrastructure", "Deployment"], priority: "C" },
  { id: 4, cat: "LLM Inference", name: "lm studio", stars: "28K", desc: "Desktop app for running local LLMs. Download from Hugging Face, get an openai-compatible local server. Best for non-developers.", github: "github.com/lmstudio-ai/lmstudio.js", tags: ["Local AI"], priority: "B" },
  { id: 5, cat: "LLM Inference", name: "jan", stars: "26K", desc: "Open-source ChatGPT alternative that runs 100% offline. Clean UI, model management, local api. No data leaves your machine.", github: "github.com/janhq/jan", tags: ["Local AI", "Privacy"], priority: "B" },
  { id: 6, cat: "LLM Inference", name: "text-gen-webui", stars: "42K", desc: "Swiss army knife for local LLMs. Every model format, every backend. Character mode, notebook mode, api mode.", github: "github.com/oobabooga/text-generation-webui", tags: ["Local AI", "Infrastructure"], priority: "C" },
  { id: 7, cat: "LLM Inference", name: "localai", stars: "26K", desc: "Self-hosted OpenAI drop-in replacement. Same api, local models. Swap GPT/Claude without changing a line of code.", github: "github.com/mudler/LocalAI", tags: ["Infrastructure", "Privacy"], priority: "B" },

  // 02 RAG & KNOWLEDGE
  { id: 8, cat: "RAG & Knowledge", name: "langchain", stars: "98K", desc: "Most popular LLM framework. Chains, agents, retrievers, memory. Connects LLMs to any data source or tool.", github: "github.com/langchain-ai/langchain", tags: ["Chambers", "Content", "Agents"], priority: "A" },
  { id: 9, cat: "RAG & Knowledge", name: "llamaindex", stars: "38K", desc: "Data framework for LLM apps. Index PDF, SQL, Notion, Slack — query with natural language. Better than LangChain for pure RAG.", github: "github.com/run-llama/llama_index", tags: ["Chambers", "Legal Pipeline"], priority: "A" },
  { id: 10, cat: "RAG & Knowledge", name: "rag-anything", stars: "12K", desc: "Multimodal RAG. Handles text, tables, images, charts, graphs. 6 lines to set up.", github: "github.com/HKUDS/RAG-Anything", tags: ["Chambers", "Content"], priority: "A" },
  { id: 11, cat: "RAG & Knowledge", name: "chroma", stars: "16K", desc: "Open-source vector database. Store embeddings, search by similarity, filter by metadata. Simplest semantic search setup.", github: "github.com/chroma-core/chroma", tags: ["Infrastructure", "Chambers"], priority: "A" },
  { id: 12, cat: "RAG & Knowledge", name: "weaviate", stars: "12K", desc: "Vector database with built-in ML models. Hybrid search, multi-tenancy, scales to billions of objects.", github: "github.com/weaviate/weaviate", tags: ["Infrastructure"], priority: "B" },
  { id: 13, cat: "RAG & Knowledge", name: "haystack", stars: "18K", desc: "End-to-end NLP framework for RAG pipelines. Modular, production-ready, works with any LLM or vector DB.", github: "github.com/deepset-ai/haystack", tags: ["Chambers", "Legal Pipeline"], priority: "B" },
  { id: 14, cat: "RAG & Knowledge", name: "docling", stars: "22K", desc: "Convert documents to structured markdown for AI. Handles PDFs with tables, figures, formulas. Built by IBM Research.", github: "github.com/DS4SD/docling", tags: ["Chambers", "Legal Pipeline", "NOW"], priority: "A" },

  // 03 AI AGENTS
  { id: 15, cat: "AI Agents", name: "autogen", stars: "40K", desc: "Multi-agent conversation framework by Microsoft. Agents delegate tasks, write and execute code.", github: "github.com/microsoft/autogen", tags: ["Agents", "Automation"], priority: "B" },
  { id: 16, cat: "AI Agents", name: "crewai", stars: "28K", desc: "Orchestrate role-playing AI agents. Define a crew, assign roles, set goals — agents collaborate like a team.", github: "github.com/crewAIInc/crewAI", tags: ["Agents", "CatalystOS Core"], priority: "A" },
  { id: 17, cat: "AI Agents", name: "langgraph", stars: "10K", desc: "Stateful multi-agent workflows as graphs. Handles complex logic, loops, human-in-the-loop.", github: "github.com/langchain-ai/langgraph", tags: ["Agents", "Infrastructure"], priority: "B" },
  { id: 18, cat: "AI Agents", name: "agno", stars: "22K", desc: "Fast multi-modal AI agents. Any LLM, any tool, memory, knowledge, storage. 10x faster than LangChain for simple agents.", github: "github.com/agno-agi/agno", tags: ["Agents", "Content"], priority: "B" },
  { id: 19, cat: "AI Agents", name: "smolagents", stars: "14K", desc: "Minimal agent framework by Hugging Face. Code agents that write and execute Python. 1000 lines total. The anti-LangChain.", github: "github.com/huggingface/smolagents", tags: ["Agents"], priority: "C" },
  { id: 20, cat: "AI Agents", name: "openhands", stars: "48K", desc: "Open-source Devin. AI engineer that writes code, runs tests, fixes bugs, deploys. Works with Claude, GPT-4, local models.", github: "github.com/All-Hands-AI/OpenHands", tags: ["CatalystOS Core", "Automation"], priority: "A" },
  { id: 21, cat: "AI Agents", name: "superagi", stars: "16K", desc: "Self-hosted autonomous agent infrastructure. Agent marketplace, performance telemetry, concurrent agents, graphical UI.", github: "github.com/TransformerOptimus/SuperAGI", tags: ["Infrastructure", "Agents"], priority: "C" },

  // 04 PROMPTS & EVALS
  { id: 29, cat: "Prompts & Evals", name: "dspy", stars: "22K", desc: "Programming — not prompting — LLMs. DSPy optimizes prompts automatically. From Stanford NLP.", github: "github.com/stanfordnlp/dspy", tags: ["Prompt Engineering", "Automation"], priority: "B" },
  { id: 30, cat: "Prompts & Evals", name: "guidance", stars: "20K", desc: "Control LLM output structure with code. Interleave generation with logic, force JSON schemas, constrain outputs.", github: "github.com/guidance-ai/guidance", tags: ["Chambers", "Infrastructure"], priority: "B" },
  { id: 31, cat: "Prompts & Evals", name: "outlines", stars: "11K", desc: "Structured text generation. Force valid JSON, regex patterns, specific formats. Guaranteed output structure.", github: "github.com/dottxt-ai/outlines", tags: ["Chambers", "Infrastructure"], priority: "B" },
  { id: 32, cat: "Prompts & Evals", name: "promptfoo", stars: "6K", desc: "Test and eval your prompts. Run automated tests, compare models, catch regressions. Unit tests for AI.", github: "github.com/promptfoo/promptfoo", tags: ["Prompt Engineering", "QA"], priority: "B" },
  { id: 33, cat: "Prompts & Evals", name: "braintrust", stars: "3K", desc: "Eval framework for LLM apps. Track quality across model versions, prompts, configurations. Because vibes aren't a metric.", github: "github.com/brainlid/langchain", tags: ["Prompt Engineering", "QA"], priority: "C" },
  { id: 34, cat: "Prompts & Evals", name: "instructor", stars: "9K", desc: "Structured outputs via Pydantic. Define a schema, get back a validated Python object. Works with OpenAI, Anthropic, Google.", github: "github.com/instructor-ai/instructor", tags: ["Chambers", "Legal Pipeline", "NOW"], priority: "A" },

  // 05 FINE-TUNING
  { id: 35, cat: "Fine-Tuning", name: "unsloth", stars: "24K", desc: "Fine-tune LLMs 2x faster, 80% less memory. Supports Llama, Mistral, Qwen, Gemma. Runs on a single GPU.", github: "github.com/unslothai/unsloth", tags: ["Fine-Tuning"], priority: "C" },
  { id: 36, cat: "Fine-Tuning", name: "axolotl", stars: "8K", desc: "Streamlined fine-tuning. YAML config, every dataset format, every training technique. The ops layer on top of Hugging Face.", github: "github.com/axolotl-org/axolotl", tags: ["Fine-Tuning"], priority: "C" },
  { id: 37, cat: "Fine-Tuning", name: "llama-factory", stars: "40K", desc: "Fine-tune 100+ LLMs with zero code. Web UI, supports LoRA, QLoRA, full fine-tuning. Most user-friendly tool available.", github: "github.com/hiyouga/LLaMA-Factory", tags: ["Fine-Tuning"], priority: "C" },
  { id: 38, cat: "Fine-Tuning", name: "trl", stars: "12K", desc: "Transformer reinforcement learning. RLHF, DPO, PPO — techniques used to align GPT-4 and Claude. By Hugging Face.", github: "github.com/huggingface/trl", tags: ["Fine-Tuning", "Research"], priority: "C" },
  { id: 39, cat: "Fine-Tuning", name: "torchtune", stars: "5K", desc: "PyTorch-native fine-tuning from Meta. Simple, hackable, well-documented. Reference implementation in pure PyTorch.", github: "github.com/pytorch/torchtune", tags: ["Fine-Tuning"], priority: "C" },
  { id: 40, cat: "Fine-Tuning", name: "mergekit", stars: "4K", desc: "Merge multiple fine-tuned models into one. SLERP, TIES, DARE, linear merge. No GPU needed. Create Frankenstein models that outperform.", github: "github.com/arcee-ai/mergekit", tags: ["Fine-Tuning", "Research"], priority: "C" },

  // 06 TOOLS & CONTEXT
  { id: 41, cat: "Tools & Context", name: "markitdown", stars: "38K", desc: "Convert any file to markdown. PDF, Word, Excel, PowerPoint, images, audio. Clean structured text for your LLM. By Microsoft.", github: "github.com/microsoft/markitdown", tags: ["Chambers", "Content", "NOW"], priority: "A" },
  { id: 42, cat: "Tools & Context", name: "files-to-prompt", stars: "3K", desc: "Turn your entire codebase into one prompt. Respects .gitignore, recursive, filterable. By Simon Willison.", github: "github.com/simonw/files-to-prompt", tags: ["CatalystOS Core"], priority: "B" },
  { id: 43, cat: "Tools & Context", name: "crawl4ai", stars: "30K", desc: "Web scraping for AI. Extracts clean markdown from any URL, handles JS-heavy sites, structured data extraction.", github: "github.com/unclecode/crawl4ai", tags: ["Content", "Research", "NOW"], priority: "A" },
  { id: 44, cat: "Tools & Context", name: "firecrawl", stars: "25K", desc: "Turn any website into LLM-ready data. Full site crawling, structured extraction, clean markdown output.", github: "github.com/mendableai/firecrawl", tags: ["Content", "Research"], priority: "A" },
  { id: 45, cat: "Tools & Context", name: "playwright-mcp", stars: "31K", desc: "Give Claude a real browser. Navigate, click, screenshot, read dynamic content. Analyze any site in 30 seconds.", github: "github.com/microsoft/playwright-mcp", tags: ["Automation", "CatalystOS Core"], priority: "A" },
  { id: 46, cat: "Tools & Context", name: "m-c-p", stars: "11K", desc: "Standard for connecting Claude to external tools. Official Anthropic MCP. Plug in any api, database, service.", github: "github.com/anthropics/model-context-protocol", tags: ["CatalystOS Core", "Infrastructure"], priority: "A" },
  { id: 47, cat: "Tools & Context", name: "mcp-servers", stars: "27K", desc: "Ready-made MCP servers. GitHub, Slack, Notion, databases, browsers, finance. Every integration in one catalog.", github: "github.com/punkpeye/awesome-mcp-servers", tags: ["CatalystOS Core", "Automation"], priority: "A" },

  // 07 DEPLOYMENT
  { id: 49, cat: "Deployment", name: "litellm", stars: "16K", desc: "One api for 100+ LLMs. OpenAI format, works with Claude, GPT, Gemini, local models. Load balancing, fallbacks, cost tracking.", github: "github.com/BerriAI/litellm", tags: ["Infrastructure", "CatalystOS Core"], priority: "A" },
  { id: 50, cat: "Deployment", name: "bentoml", stars: "7K", desc: "Build and deploy AI services. Package models, create APIs, deploy anywhere. From local to production Kubernetes.", github: "github.com/bentoml/BentoML", tags: ["Deployment", "Infrastructure"], priority: "C" },
  { id: 51, cat: "Deployment", name: "ray serve", stars: "34K", desc: "Distributed AI inference at scale. Serve multiple models, autoscale, handle millions of requests. Used by OpenAI.", github: "github.com/ray-project/ray", tags: ["Deployment", "Infrastructure"], priority: "C" },
  { id: 52, cat: "Deployment", name: "triton inference", stars: "8K", desc: "Nvidia's production inference server. Maximum GPU utilization, dynamic batching, multi-model serving.", github: "github.com/triton-inference-server/server", tags: ["Deployment"], priority: "C" },
  { id: 53, cat: "Deployment", name: "lorax", stars: "3K", desc: "Serve hundreds of LoRA fine-tuned models on one GPU. One base model, hundreds of adapters. 10x cost reduction.", github: "github.com/predibase/lorax", tags: ["Fine-Tuning", "Deployment"], priority: "C" },
  { id: 54, cat: "Deployment", name: "supabase", stars: "73K", desc: "Default backend for AI apps. Open-source Firebase on Postgres. Real-time DB, auth, storage, edge functions, vector search.", github: "github.com/supabase/supabase", tags: ["Infrastructure", "CatalystOS Core"], priority: "A" },

  // 08 CLAUDE-SPECIFIC
  { id: 55, cat: "Claude-Specific", name: "superpowers", stars: "160K", desc: "Adds superpowers to Claude Code. Deep code analysis, auto-refactor, project-wide editing. Most popular Claude enhancement.", github: "github.com/obra/superpowers", tags: ["CatalystOS Core", "Claude"], priority: "A" },
  { id: 56, cat: "Claude-Specific", name: "claude-skills", stars: "Official", desc: "Official Anthropic skills framework. SKILL.md patterns that teach Claude to handle documents, automations, workflows.", github: "github.com/anthropics/claude-code-skills", tags: ["CatalystOS Core", "Claude", "NOW"], priority: "A" },
  { id: 57, cat: "Claude-Specific", name: "free-claude", stars: "2K", desc: "Run Claude Code completely free via GitHub Models api. Trending #1 on GitHub. $0 forever.", github: "github.com/Alishahryar1/free-claude-code", tags: ["Claude", "Cost Optimization"], priority: "B" },
  { id: 58, cat: "Claude-Specific", name: "claude-mem", stars: "1K", desc: "Persistent memory for Claude. Auto-captures everything across sessions. Claude remembers who you are and what you're working on.", github: "github.com/thedotmack/claude-mem", tags: ["Claude", "CatalystOS Core"], priority: "B" },

  // 09 DATA PREP
  { id: 59, cat: "Data Prep", name: "unstructured", stars: "10K", desc: "Extract and transform unstructured data for LLMs. PDFs, HTML, Word, images, emails — clean chunks for RAG.", github: "github.com/Unstructured-IO/unstructured", tags: ["Chambers", "Legal Pipeline", "NOW"], priority: "A" },
  { id: 60, cat: "Data Prep", name: "datatrove", stars: "3K", desc: "Large-scale data processing for LLM training by Hugging Face. Deduplication, quality filtering, content classification.", github: "github.com/huggingface/datatrove", tags: ["Research", "Fine-Tuning"], priority: "C" },
  { id: 61, cat: "Data Prep", name: "trafilatura", stars: "3K", desc: "Web content extraction for AI. Strips boilerplate, keeps content, outputs clean text or markdown.", github: "github.com/adbar/trafilatura", tags: ["Content", "Research"], priority: "B" },
  { id: 62, cat: "Data Prep", name: "semchunk", stars: "1K", desc: "Semantic text chunking for RAG. Splits at natural boundaries instead of arbitrary token counts. Better chunks → better answers.", github: "github.com/umarbutler/semchunk", tags: ["Chambers", "Legal Pipeline"], priority: "B" },
  { id: 63, cat: "Data Prep", name: "datachain", stars: "2K", desc: "AI-native dataset management. Version, query, transform multimodal datasets. Images, video, text, embeddings.", github: "github.com/iterative/datachain", tags: ["Research", "Infrastructure"], priority: "C" },

  // 10 VISION & MULTIMODAL
  { id: 64, cat: "Vision & Multimodal", name: "moondream", stars: "10K", desc: "Tiny vision language model. 1.6B parameters. Describe images, answer visual questions, detect objects. Runs on a Raspberry Pi.", github: "github.com/vikhyat/moondream", tags: ["Vision", "Local AI"], priority: "B" },
  { id: 65, cat: "Vision & Multimodal", name: "internvl", stars: "7K", desc: "State-of-the-art open-source vision model. Matches GPT-4V on most benchmarks. Understands images, charts, documents, screenshots.", github: "github.com/OpenGVLab/InternVL", tags: ["Vision", "Chambers"], priority: "B" },
  { id: 66, cat: "Vision & Multimodal", name: "whisper", stars: "74K", desc: "Open-source speech recognition by OpenAI. Transcribes audio in 99 languages. Handles accents, background noise, jargon.", github: "github.com/openai/whisper", tags: ["Content", "Voice Pipeline"], priority: "A" },
  { id: 67, cat: "Vision & Multimodal", name: "fast-whisper", stars: "8K", desc: "Whisper but 10-20x faster. One command, automatic GPU optimization. Transcribe a 2-hour podcast in 2 minutes.", github: "github.com/Vaibhavs10/insanely-fast-whisper", tags: ["Content", "Voice Pipeline", "NOW"], priority: "A" },
  { id: 68, cat: "Vision & Multimodal", name: "diffusion-webui", stars: "143K", desc: "Browser interface for Stable Diffusion. Generate, edit, upscale images from text. Hundreds of extensions, ControlNet, inpainting.", github: "github.com/AUTOMATIC1111/stable-diffusion-webui", tags: ["Vision", "Content", "SneakersFest"], priority: "B" },
];

const CATS = ["All", ...Array.from(new Set(tools.map(t => t.cat)))];
const ALL_TAGS = ["All", "NOW", "Chambers", "Legal Pipeline", "Content", "CatalystOS Core", "Agents", "Infrastructure", "Local AI", "Voice Pipeline", "Fine-Tuning", "Vision", "SneakersFest"];
const PRIORITIES = { A: "DEPLOY NOW", B: "Q3 EXPANSION", C: "FUTURE PHASE" };
const P_COLORS = { A: "#D4AF37", B: "#7FDBCA", C: "#555" };

const catIcons = {
  "LLM Inference": "01",
  "RAG & Knowledge": "02",
  "AI Agents": "03",
  "Prompts & Evals": "04",
  "Fine-Tuning": "05",
  "Tools & Context": "06",
  "Deployment": "07",
  "Claude-Specific": "08",
  "Data Prep": "09",
  "Vision & Multimodal": "10",
};

export default function CatalystOSRepo() {
  const [search, setSearch] = useState("");
  const [cat, setCat] = useState("All");
  const [tag, setTag] = useState("All");
  const [priority, setPriority] = useState("All");
  const [expanded, setExpanded] = useState(null);

  const filtered = useMemo(() => {
    return tools.filter(t => {
      const matchSearch = t.name.toLowerCase().includes(search.toLowerCase()) || t.desc.toLowerCase().includes(search.toLowerCase());
      const matchCat = cat === "All" || t.cat === cat;
      const matchTag = tag === "All" || t.tags.includes(tag);
      const matchPrio = priority === "All" || t.priority === priority;
      return matchSearch && matchCat && matchTag && matchPrio;
    });
  }, [search, cat, tag, priority]);

  const grouped = useMemo(() => {
    const g = {};
    filtered.forEach(t => {
      if (!g[t.cat]) g[t.cat] = [];
      g[t.cat].push(t);
    });
    return g;
  }, [filtered]);

  return (
    <div style={{
      background: "#0A0A0A",
      minHeight: "100vh",
      fontFamily: "'JetBrains Mono', 'Courier New', monospace",
      color: "#E0D5C0",
      padding: "0",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@300;400;500;700&display=swap');
        * { box-sizing: border-box; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: #111; }
        ::-webkit-scrollbar-thumb { background: #D4AF37; }
        .tool-card:hover { background: #161410 !important; border-color: #D4AF37 !important; }
        .tool-card { transition: all 0.15s ease; cursor: pointer; }
        .filter-btn { transition: all 0.15s ease; }
        .filter-btn:hover { border-color: #D4AF37 !important; color: #D4AF37 !important; }
        .tag-pill { font-size: 9px; padding: 2px 6px; border-radius: 2px; border: 1px solid #333; color: #888; }
        .tag-NOW { border-color: #D4AF37 !important; color: #D4AF37 !important; background: rgba(212,175,55,0.08) !important; }
        .tag-Chambers { border-color: #7FDBCA55 !important; color: #7FDBCA !important; }
        .tag-CatalystOS\ Core { border-color: #C87840 !important; color: #C87840 !important; }
        .tag-Legal\ Pipeline { border-color: #A0CCFF55 !important; color: #7EB5F0 !important; }
        .tag-SneakersFest { border-color: #FF6B6B55 !important; color: #FF6B6B !important; }
        .scanline { background: repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.15) 2px, rgba(0,0,0,0.15) 4px); pointer-events: none; }
        input::placeholder { color: #444; }
        input:focus { outline: none; border-color: #D4AF37 !important; }
      `}</style>

      {/* HEADER */}
      <div style={{
        borderBottom: "1px solid #1E1A14",
        padding: "28px 32px 20px",
        background: "linear-gradient(180deg, #0E0C08 0%, #0A0A0A 100%)",
        position: "sticky", top: 0, zIndex: 100,
      }}>
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 16 }}>
          <div>
            <div style={{ fontSize: 10, color: "#D4AF37", letterSpacing: 4, marginBottom: 4, textTransform: "uppercase" }}>
              CATALYST OS // AI REPOSITORY
            </div>
            <div style={{ fontSize: 22, fontWeight: 700, letterSpacing: -0.5, color: "#F5EDD8" }}>
              68 OPEN SOURCE TOOLS
            </div>
            <div style={{ fontSize: 10, color: "#555", marginTop: 3, letterSpacing: 2 }}>
              10 CATEGORIES · MAPPED TO COS OPERATIONS
            </div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: 9, color: "#444", letterSpacing: 2 }}>ACTIVE FILTER</div>
            <div style={{ fontSize: 18, color: "#D4AF37", fontWeight: 700 }}>{filtered.length}</div>
            <div style={{ fontSize: 9, color: "#444" }}>REPOS</div>
          </div>
        </div>

        {/* SEARCH */}
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="// search tools..."
          style={{
            width: "100%", background: "#0E0C08", border: "1px solid #1E1A14",
            color: "#E0D5C0", padding: "8px 14px", fontSize: 12,
            fontFamily: "inherit", marginBottom: 14, letterSpacing: 1,
          }}
        />

        {/* CAT FILTER */}
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 8 }}>
          {CATS.map(c => (
            <button key={c} onClick={() => setCat(c)} className="filter-btn" style={{
              background: cat === c ? "#D4AF3715" : "transparent",
              border: `1px solid ${cat === c ? "#D4AF37" : "#1E1A14"}`,
              color: cat === c ? "#D4AF37" : "#555",
              padding: "4px 10px", fontSize: 9, letterSpacing: 2,
              fontFamily: "inherit", cursor: "pointer", textTransform: "uppercase",
            }}>
              {c === "All" ? "ALL" : `${catIcons[c]} ${c.toUpperCase().slice(0, 8)}`}
            </button>
          ))}
        </div>

        {/* TAG + PRIORITY FILTER */}
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap", alignItems: "center" }}>
          <span style={{ fontSize: 9, color: "#444", letterSpacing: 2 }}>TAG:</span>
          {ALL_TAGS.map(t => (
            <button key={t} onClick={() => setTag(t)} className="filter-btn" style={{
              background: tag === t ? "#D4AF3710" : "transparent",
              border: `1px solid ${tag === t ? "#D4AF37" : "#1E1A14"}`,
              color: tag === t ? "#D4AF37" : "#444",
              padding: "3px 8px", fontSize: 9, letterSpacing: 1,
              fontFamily: "inherit", cursor: "pointer",
            }}>{t}</button>
          ))}
          <span style={{ fontSize: 9, color: "#333", margin: "0 4px" }}>|</span>
          {["All", "A", "B", "C"].map(p => (
            <button key={p} onClick={() => setPriority(p)} className="filter-btn" style={{
              background: priority === p ? "#D4AF3710" : "transparent",
              border: `1px solid ${priority === p ? P_COLORS[p] || "#D4AF37" : "#1E1A14"}`,
              color: priority === p ? (P_COLORS[p] || "#D4AF37") : "#444",
              padding: "3px 8px", fontSize: 9, letterSpacing: 1,
              fontFamily: "inherit", cursor: "pointer",
            }}>{p === "All" ? "ALL PHASES" : PRIORITIES[p]}</button>
          ))}
        </div>
      </div>

      {/* BODY */}
      <div style={{ padding: "24px 32px", maxWidth: 960, margin: "0 auto" }}>
        {Object.entries(grouped).map(([catName, catTools]) => (
          <div key={catName} style={{ marginBottom: 48 }}>
            {/* CATEGORY HEADER */}
            <div style={{
              display: "flex", alignItems: "center", gap: 12, marginBottom: 16,
              paddingBottom: 10, borderBottom: "1px solid #1A1714",
            }}>
              <div style={{
                background: "#D4AF3715", border: "1px solid #D4AF3730",
                color: "#D4AF37", fontSize: 11, fontWeight: 700,
                padding: "4px 10px", letterSpacing: 2,
              }}>{catIcons[catName]}</div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 700, letterSpacing: 3, color: "#F5EDD8" }}>
                  {catName.toUpperCase()}
                </div>
                <div style={{ fontSize: 9, color: "#444", letterSpacing: 1, marginTop: 1 }}>
                  {catTools.length} TOOL{catTools.length > 1 ? "S" : ""}
                </div>
              </div>
            </div>

            {/* TOOLS */}
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {catTools.map(tool => (
                <div
                  key={tool.id}
                  className="tool-card"
                  onClick={() => setExpanded(expanded === tool.id ? null : tool.id)}
                  style={{
                    background: expanded === tool.id ? "#0F0E0A" : "#0C0B09",
                    border: `1px solid ${expanded === tool.id ? "#D4AF3740" : "#161412"}`,
                    padding: "14px 16px",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "flex-start", gap: 14 }}>
                    {/* NUMBER */}
                    <div style={{ fontSize: 10, color: "#333", width: 22, flexShrink: 0, paddingTop: 2, fontWeight: 700 }}>
                      {String(tool.id).padStart(2, "0")}
                    </div>

                    {/* MAIN */}
                    <div style={{ flex: 1 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
                        <span style={{ fontSize: 13, fontWeight: 700, color: "#F5EDD8", letterSpacing: 0.5 }}>
                          {tool.name}
                        </span>
                        <span style={{ fontSize: 10, color: tool.stars === "Official" ? "#7FDBCA" : "#555" }}>
                          ★ {tool.stars}
                        </span>
                        <div style={{
                          fontSize: 8, padding: "1px 6px", letterSpacing: 2,
                          border: `1px solid ${P_COLORS[tool.priority]}30`,
                          color: P_COLORS[tool.priority],
                          background: `${P_COLORS[tool.priority]}08`,
                        }}>
                          {PRIORITIES[tool.priority]}
                        </div>
                      </div>

                      <div style={{ fontSize: 11, color: "#8A7F70", lineHeight: 1.6, marginBottom: 8 }}>
                        {tool.desc}
                      </div>

                      {/* TAGS */}
                      <div style={{ display: "flex", gap: 4, flexWrap: "wrap", marginBottom: expanded === tool.id ? 12 : 0 }}>
                        {tool.tags.map(tg => (
                          <span key={tg} className={`tag-pill tag-${tg}`}>{tg}</span>
                        ))}
                      </div>

                      {/* EXPANDED */}
                      {expanded === tool.id && (
                        <div style={{
                          borderTop: "1px solid #1A1714", paddingTop: 12, marginTop: 4,
                          display: "flex", gap: 20, alignItems: "center",
                        }}>
                          <div style={{ flex: 1 }}>
                            <div style={{ fontSize: 9, color: "#444", letterSpacing: 2, marginBottom: 3 }}>REPOSITORY</div>
                            <div style={{ fontSize: 11, color: "#D4AF37" }}>{tool.github}</div>
                          </div>
                          <div>
                            <a
                              href={`https://${tool.github}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={e => e.stopPropagation()}
                              style={{
                                fontSize: 9, letterSpacing: 2, padding: "6px 14px",
                                border: "1px solid #D4AF3740", color: "#D4AF37",
                                background: "#D4AF3710", textDecoration: "none",
                                display: "inline-block",
                              }}
                            >
                              OPEN REPO →
                            </a>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}

        {filtered.length === 0 && (
          <div style={{ textAlign: "center", color: "#333", padding: 60, fontSize: 11, letterSpacing: 2 }}>
            // NO TOOLS MATCH CURRENT FILTER
          </div>
        )}

        {/* FOOTER */}
        <div style={{
          borderTop: "1px solid #1A1714", marginTop: 40, paddingTop: 20,
          display: "flex", justifyContent: "space-between", alignItems: "center",
        }}>
          <div style={{ fontSize: 9, color: "#333", letterSpacing: 2 }}>
            CATALYST OS // AI REPOSITORY v1.0
          </div>
          <div style={{ fontSize: 9, color: "#333", letterSpacing: 2 }}>
            68 REPOS · 10 CATEGORIES · 2026
          </div>
        </div>
      </div>
    </div>
  );
}
