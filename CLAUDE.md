# Claude Code Configuration — Ruflo

> **Ruflo v3.6.27** (2026-05-20) — Stable release with agent federation and comms-first coordination.
> 6,000+ commits, 314 MCP tools, 16 agent roles + custom types, 19 AgentDB controllers, 32 native plugins.
> Packages: `@claude-flow/cli@3.6.27`, `claude-flow@3.6.27`, `ruflo@3.6.27`

## Behavioral Rules (Always Enforced)

- Do what has been asked; nothing more, nothing less
- NEVER create files unless they're absolutely necessary for achieving your goal
- ALWAYS prefer editing an existing file to creating a new one
- NEVER proactively create documentation files (*.md) or README files unless explicitly requested
- NEVER save working files, text/mds, or tests to the root folder
- Never continuously check status after spawning a swarm — wait for results
- ALWAYS read a file before editing it
- NEVER commit secrets, credentials, or .env files

## File Organization

- NEVER save to root folder — use the directories below
- Use `/src` for source code files
- Use `/tests` for test files
- Use `/docs` for documentation and markdown files
- Use `/config` for configuration files
- Use `/scripts` for utility scripts
- Use `/examples` for example code

## Project Architecture

- Follow Domain-Driven Design with bounded contexts
- Keep files under 500 lines
- Use typed interfaces for all public APIs
- Prefer TDD London School (mock-first) for new code
- Use event sourcing for state changes
- Ensure input validation at system boundaries

### Repository Layout

```
ruflo/                        # root (umbrella npm package)
├── v3/                       # V3 monorepo (TypeScript source)
│   ├── @claude-flow/         # scoped packages (see full list below)
│   ├── __tests__/            # integration tests (vitest)
│   ├── agents/               # agent type definitions
│   ├── docs/                 # architecture docs + ADRs
│   ├── goal_ui/              # GOAP goal planner UI (Vite + Supabase)
│   ├── mcp/                  # MCP server entry points
│   ├── plugins/              # plugin implementations
│   ├── scripts/              # build + publish scripts
│   ├── src/                  # shared V3 source
│   ├── swarm.config.ts       # swarm topology defaults
│   └── index.ts              # V3 public API entry
├── ruflo/                    # ruflo sub-package (web UI + thin CLI wrapper)
│   ├── src/ruvocal/          # RuVocal web UI (Docker, multi-model chat)
│   ├── bin/                  # ruflo CLI entry
│   └── docs/adr/             # ruflo-specific ADRs
├── bin/                      # root CLI entry (claude-flow bin)
├── agents/                   # top-level agent definitions
├── plugins/                  # top-level plugin configs
├── .claude/                  # Claude Code project settings
│   ├── settings.json         # hooks, permissions, model config
│   ├── agents/               # custom agent definitions
│   ├── commands/             # slash command definitions
│   ├── helpers/              # hook-handler.cjs, auto-memory-hook.mjs
│   ├── skills/               # skill definitions
│   └── statusline.*          # statusline scripts
├── .agents/                  # agent registry
├── .claude-plugin/           # Claude Code plugin manifest
├── scripts/                  # repo-level utility scripts
├── tests/                    # root-level tests
├── package.json              # root package (claude-flow umbrella)
├── tsconfig.json             # root TypeScript config
└── CLAUDE.md                 # this file
```

### Key Packages (v3/@claude-flow)

| Package | Purpose |
|---------|--------|
| `cli` | CLI entry point (26 commands, 140+ subcommands) |
| `shared` | Shared types and utilities |
| `memory` | AgentDB + HNSW vector search (150x–12,500x faster) |
| `hooks` | 17 hooks + 12 background workers |
| `security` | Input validation, path security, CVE remediation |
| `guidance` | Governance control plane (compile, enforce, prove, evolve) |
| `mcp` | MCP server tools and routing |
| `neural` | SONA, MoE, EWC++, Flash Attention |
| `swarm` | Swarm coordination and topologies |
| `agents` | Agent type registry and lifecycle |
| `embeddings` | Vector embeddings with sql.js, HNSW, hyperbolic support |
| `claims` | Claims-based authorization |
| `performance` | Performance profiling and benchmarking |
| `providers` | Multi-LLM provider abstraction (Claude, GPT, Gemini, Ollama) |
| `plugins` | Plugin system core (manager, discovery, IPFS store) |
| `codex` | Dual-mode Claude + Codex collaboration |
| `integration` | agentic-flow bridge, token optimizer |
| `aidefence` | Prompt injection detection, PII scanning, safety filters |
| `browser` | Playwright browser automation |
| `deployment` | Deployment management and rollback |
| `testing` | Test intelligence and gap analysis |
| `plugin-agent-federation` | Zero-trust cross-machine agent federation |
| `plugin-iot-cognitum` | IoT device management and trust scoring |

## Concurrency: 1 MESSAGE = ALL RELATED OPERATIONS

- All operations MUST be concurrent/parallel in a single message
- Use Claude Code's Task tool for spawning agents, not just MCP

**Mandatory patterns:**
- ALWAYS batch ALL todos in ONE TodoWrite call (5-10+ minimum)
- ALWAYS spawn ALL agents in ONE message with full instructions via Task tool
- ALWAYS batch ALL file reads/writes/edits in ONE message
- ALWAYS batch ALL terminal operations in ONE Bash message
- ALWAYS batch ALL memory store/retrieve operations in ONE message

---

## Swarm Orchestration

- MUST initialize the swarm using MCP tools when starting complex tasks
- MUST spawn concurrent agents using Claude Code's Task tool
- Never use MCP tools alone for execution — Task tool agents do the actual work

### MCP + Task Tool in SAME Message

- MUST call MCP tools AND Task tool in ONE message for complex work
- Always call MCP first, then IMMEDIATELY call Task tool to spawn agents

### 3-Tier Model Routing (ADR-026)

| Tier | Handler | Latency | Cost | Use Cases |
|------|---------|---------|------|----------|
| **1** | Agent Booster (WASM) | <1ms | $0 | Simple transforms — **Skip LLM entirely** |
| **2** | Haiku | ~500ms | $0.0002 | Simple tasks (<30% complexity) |
| **3** | Sonnet/Opus | 2-5s | $0.003-0.015 | Complex reasoning, architecture, security (>30%) |

- Always check for `[AGENT_BOOSTER_AVAILABLE]` or `[TASK_MODEL_RECOMMENDATION]` before spawning agents
- Use Edit tool directly when `[AGENT_BOOSTER_AVAILABLE]` — intent types: `var-to-const`, `add-types`, `add-error-handling`, `async-await`, `add-logging`, `remove-console`

## Swarm Configuration & Anti-Drift

### Anti-Drift Coding Swarm (PREFERRED DEFAULT)

- ALWAYS use hierarchical topology for coding swarms
- Keep maxAgents at 6-8 for tight coordination
- Use specialized strategy for clear role boundaries
- Use `raft` consensus for hive-mind (leader maintains authoritative state)
- Run frequent checkpoints via `post-task` hooks
- Keep shared memory namespace for all agents
- Keep task cycles short with verification gates

```javascript
mcp__ruv-swarm__swarm_init({
  topology: "hierarchical",
  maxAgents: 8,
  strategy: "specialized"
})
```

## Dual-Mode Collaboration (Claude Code + Codex)

This repository uses **dual-mode orchestration** to run Claude Code (🔵) and OpenAI Codex (🟢) workers in parallel with shared memory coordination.

### Dual-Mode CLI Commands

```bash
npx claude-flow-codex dual run feature --task "Add user authentication with OAuth"
npx claude-flow-codex dual run security --target "./src"
npx claude-flow-codex dual run refactor --target "./src/legacy"
npx claude-flow-codex dual status
npx claude-flow-codex dual templates
```

### Collaboration Templates

| Template | Pipeline |
|----------|----------|
| `feature` | 🔵 Architect → 🟢 Coder → 🔵 Tester → 🟢 Reviewer |
| `security` | 🔵 Analyst → 🟢 Scanner → 🔵 Reporter |
| `refactor` | 🔵 Architect → 🟢 Refactorer → 🔵 Tester |
| `bugfix` | 🔵 Researcher → 🟢 Coder → 🔵 Tester |

### Platform Strengths

| Task Type | Preferred Platform |
|-----------|-------------------|
| Architecture & Design | 🔵 Claude |
| Implementation | 🟢 Codex |
| Security Review | 🔵 Claude |
| Performance Optimization | 🟢 Codex |
| Testing Strategy | 🔵 Claude |
| Refactoring | 🟢 Codex |

---

## Swarm Protocols & Routing

### Auto-Start Swarm Protocol

When the user requests a complex task, **immediately execute this pattern in a SINGLE message:**

```javascript
// STEP 1: Initialize swarm
mcp__ruv-swarm__swarm_init({ topology: "hierarchical", maxAgents: 8, strategy: "specialized" })

// STEP 2: Spawn NAMED agents concurrently
Task({ prompt: "Research requirements. SendMessage to 'architect' when done.", subagent_type: "researcher", name: "researcher", run_in_background: true })
Task({ prompt: "Wait for research. Design implementation. SendMessage to 'coder'.", subagent_type: "system-architect", name: "architect", run_in_background: true })
Task({ prompt: "Wait for design. Implement solution. SendMessage to 'tester'.", subagent_type: "coder", name: "coder", run_in_background: true })
Task({ prompt: "Wait for code. Write tests. SendMessage to 'reviewer'.", subagent_type: "tester", name: "tester", run_in_background: true })
Task({ prompt: "Wait for tests. Review quality and security.", subagent_type: "reviewer", name: "reviewer", run_in_background: true })

// STEP 3: Kick off the pipeline
SendMessage({ to: "researcher", summary: "Start", message: "[task description]" })
```

### Task Complexity Detection

**AUTO-INVOKE SWARM when task involves:**
- Multiple files (3+), new feature implementation, refactoring across modules
- API changes with tests, security-related changes, performance optimization
- Database schema changes

**SKIP SWARM for:**
- Single file edits, simple bug fixes (1-2 lines), documentation updates
- Configuration changes, quick questions/exploration

### Agent Routing Table

| Code | Task | Agents |
|------|------|--------|
| 1 | Bug Fix | coordinator, researcher, coder, tester |
| 3 | Feature | coordinator, architect, coder, tester, reviewer |
| 5 | Refactor | coordinator, architect, coder, reviewer |
| 7 | Performance | coordinator, perf-engineer, coder |
| 9 | Security | coordinator, security-architect, auditor |
| 11 | Memory | coordinator, memory-specialist, perf-engineer |
| 13 | Docs | researcher, api-docs |

**Codes 1-11: hierarchical/specialized. Code 13: mesh/balanced**

## Project Configuration (.claude/settings.json)

```json
{
  "model": "claude-opus-4-7",
  "claudeFlow": {
    "version": "3.6.27",
    "swarm": { "topology": "hierarchical-mesh", "maxAgents": 15 },
    "memory": { "backend": "hybrid", "enableHNSW": true },
    "neural": { "enabled": true },
    "agentTeams": { "enabled": true, "teammateMode": "auto" },
    "daemon": { "autoStart": true }
  }
}
```

### Hooks (auto-configured via settings.json)

| Hook | Trigger | Handler |
|------|---------|--------|
| `PreToolUse[Bash]` | Before every Bash call | `hook-handler.cjs pre-bash` |
| `PostToolUse[Write\|Edit\|MultiEdit]` | After file writes | `hook-handler.cjs post-edit` |
| `UserPromptSubmit` | Every user message | `hook-handler.cjs route` |
| `SessionStart` | Session open | `session-restore` + `auto-memory-hook.mjs import` |
| `SessionEnd` | Session close | `hook-handler.cjs session-end` |
| `Stop` | After Claude stops | `auto-memory-hook.mjs sync` |
| `SubagentStop` | After each subagent | `hook-handler.cjs post-task` |

### Background Workers (daemon auto-starts on session)

`map`, `audit` (1h/critical), `optimize` (30m/high), `consolidate` (2h/low),
`testgaps`, `ultralearn` (1h), `deepdive` (4h), `document` (1h), `refactor`, `benchmark`

## V3 CLI Commands (26 Commands, 140+ Subcommands)

### Core Commands

| Command | Subcommands | Description |
|---------|-------------|-------------|
| `init` | 4 | Project initialization with wizard, presets, skills, hooks |
| `agent` | 8 | Agent lifecycle (spawn, list, status, stop, metrics, pool, health, logs) |
| `swarm` | 6 | Multi-agent swarm coordination |
| `memory` | 11 | AgentDB memory with vector search |
| `mcp` | 9 | MCP server management |
| `task` | 6 | Task creation, assignment, lifecycle |
| `session` | 7 | Session state management |
| `config` | 7 | Configuration and provider setup |
| `status` | 3 | System status monitoring |
| `start` | 3 | Service startup |
| `workflow` | 6 | Workflow execution and templates |
| `hooks` | 17 | Self-learning hooks + 12 background workers |
| `hive-mind` | 6 | Queen-led Byzantine fault-tolerant consensus |

### Advanced Commands

| Command | Description |
|---------|-------------|
| `daemon` | Background worker daemon (start, stop, status, trigger, enable) |
| `neural` | Neural pattern training (SONA, MoE, EWC++) |
| `security` | Security scanning (scan, audit, cve, threats, validate, report) |
| `performance` | Performance profiling (benchmark, profile, metrics, optimize) |
| `providers` | AI providers (list, add, remove, test, configure) |
| `plugins` | Plugin management (list, install, uninstall, enable, disable) |
| `deployment` | Deployment management (deploy, rollback, status, environments) |
| `embeddings` | Vector embeddings — 75x faster with agentic-flow |
| `claims` | Claims-based authorization (check, grant, revoke, list) |
| `migrate` | V2→V3 migration with rollback support |
| `doctor` | System diagnostics with health checks |
| `federation` | Zero-trust cross-machine agent federation |

### Quick CLI Examples

```bash
npx ruflo@latest init --wizard
npx ruflo@latest daemon start
npx ruflo@latest agent spawn -t coder --name my-coder
npx ruflo@latest swarm init --v3-mode
npx ruflo@latest memory search -q "authentication patterns"
npx ruflo@latest doctor --fix
npx ruflo@latest security scan --depth full
npx ruflo@latest federation init
```

## Agent Federation — Zero-Trust Cross-Machine Collaboration

Federation lets agents on different machines, orgs, or cloud regions discover, authenticate, and collaborate on tasks securely.

```
Your Agent → [Strip PII] → [Sign ed25519] → [mTLS channel]
                                                    |
Their Agent ← [Block injection] ← [Verify identity] ←┘
                    Audit trail both sides. Trust scores auto-update.
```

### Federation CLI

```bash
npx ruflo@latest federation init          # generate keypair, start federation node
npx ruflo@latest federation join wss://peer.example.com:8443
npx ruflo@latest federation send --to team-b --type task-request --message "..."
npx ruflo@latest federation status

# Plugin install
/plugin install ruflo-federation@ruflo
```

### Trust Scoring Formula
`0.4×success_rate + 0.2×uptime + 0.2×threat_score + 0.2×integrity`

Trust upgrades require history; downgrades are instant. PII is stripped before any data leaves your node (14-type detection pipeline).

## Ruflo Web UI — flo.ruv.io

Self-hostable multi-model AI chat with built-in MCP tool calling.

| Feature | Details |
|---------|---------|
| Models | Qwen 3.6 Max (default), Claude Sonnet 4.6, Haiku 4.5, Gemini 2.5 Pro/Flash, OpenAI via OpenRouter |
| Tools | ~210 MCP tools; parallel execution (4–6+ per turn) |
| Memory | AgentDB + HNSW — persistent across sessions |
| Self-host | `ruflo/src/ruvocal/` — Docker with embedded Mongo, `INCLUDE_DB=true` |
| Architecture | ADR-033: RUVOCAL-WASM-MCP-INTEGRATION |

**Source:** `ruflo/src/ruvocal/` · **Hosted demo:** https://flo.ruv.io/

## Goal Planner UI — goal.ruv.io

GOAP A* planner: plain-English goals → executable agent plans.

- **Source:** `v3/goal_ui/` (Vite + Supabase)
- **Hosted:** https://goal.ruv.io/ · live agents: https://goal.ruv.io/agents
- **Self-host:** `cd v3/goal_ui && npm install && npm run dev`

## Headless Background Instances (claude -p)

```bash
claude -p "Analyze the authentication module for security issues"
claude -p --model haiku "Format this config file"
claude -p --output-format json "List all TODO comments in src/"
claude -p --max-budget-usd 0.50 "Run comprehensive security audit"

# Parallel background execution
claude -p "Analyze src/auth/ for vulnerabilities" &
claude -p "Write tests for src/api/endpoints.ts" &
wait
```

## Available Agents (60+ Types)

### Core Development
`coder`, `reviewer`, `tester`, `planner`, `researcher`

### V3 Specialized
`security-architect`, `security-auditor`, `memory-specialist`, `performance-engineer`

### Swarm Coordination
`hierarchical-coordinator`, `mesh-coordinator`, `adaptive-coordinator`,
`collective-intelligence-coordinator`, `swarm-memory-manager`

### Consensus & Distributed
`byzantine-coordinator`, `raft-manager`, `gossip-coordinator`,
`consensus-builder`, `crdt-synchronizer`, `quorum-manager`

### GitHub & Repository
`github-modes`, `pr-manager`, `code-review-swarm`, `issue-tracker`,
`release-manager`, `workflow-automation`, `multi-repo-swarm`

### SPARC Methodology
`sparc-coord`, `sparc-coder`, `specification`, `pseudocode`, `architecture`, `refinement`

## Agent Teams & Comms System

### Core Principle: Named Agents + SendMessage

Every agent MUST have a `name` so it's addressable. Communication happens via `SendMessage`.

```javascript
// Spawn all named agents in ONE message
Task({ prompt: "Design API. SendMessage design to 'developer'.", subagent_type: "system-architect", name: "architect", run_in_background: true })
Task({ prompt: "Wait for design from 'architect'. Implement. SendMessage to 'tester'.", subagent_type: "coder", name: "developer", run_in_background: true })
Task({ prompt: "Wait for code from 'developer'. Write tests.", subagent_type: "tester", name: "tester", run_in_background: true })

// Kick off pipeline
SendMessage({ to: "architect", summary: "Start", message: "Design a REST API for user management..." })
```

### Coordination Patterns

**Pipeline:** `architect → developer → tester → reviewer` (each SendMessage to next)

**Fan-out:** lead spawns parallel agents, collects results via task completions

**Supervisor/Worker:** lead assigns via SendMessage, workers report back

### Rules
1. Always name agents (`name: "role-name"`)
2. Comms over memory — SendMessage for real-time, memory for persistence
3. Tell each agent WHO to message next in their prompt
4. Spawn all at once with `run_in_background: true`
5. Don't poll — wait for task completion notifications
6. Lead synthesizes all results before responding to user

## V3 Hooks System (17 Hooks + 12 Workers)

### Hook Categories

| Category | Hooks |
|----------|-------|
| **Core** | `pre-edit`, `post-edit`, `pre-command`, `post-command`, `pre-task`, `post-task` |
| **Session** | `session-start`, `session-end`, `session-restore`, `notify` |
| **Intelligence** | `route`, `explain`, `pretrain`, `build-agents`, `transfer` |
| **Learning** | `intelligence` (trajectory, pattern-store/search, attention) |
| **Agent Teams** | `teammate-idle`, `task-completed` |

### Essential Hook Commands

```bash
npx ruflo@latest hooks pre-task --description "[task]"
npx ruflo@latest hooks post-task --task-id "[id]" --success true
npx ruflo@latest hooks session-start --session-id "[id]"
npx ruflo@latest hooks route --task "[task]"
npx ruflo@latest hooks worker list
npx ruflo@latest hooks worker dispatch --trigger audit
```

## Intelligence System (RuVector)

- **SONA**: Self-Optimizing Neural Architecture (<0.05ms adaptation)
- **MoE**: Mixture of Experts for specialized routing
- **HNSW**: 150x–12,500x faster pattern search
- **EWC++**: Elastic Weight Consolidation (prevents forgetting)
- **Flash Attention**: 2.49x–7.47x speedup

**4-step pipeline:** RETRIEVE (HNSW) → JUDGE (verdicts) → DISTILL (LoRA) → CONSOLIDATE (EWC++)

## Hive-Mind Consensus

| Topology | Description |
|----------|-------------|
| `hierarchical` | Queen controls workers directly |
| `mesh` | Fully connected peer network |
| `hierarchical-mesh` | Hybrid (recommended) |
| `adaptive` | Dynamic based on load |

| Strategy | Algorithm |
|----------|----------|
| `byzantine` | BFT (tolerates f < n/3 faulty) |
| `raft` | Leader-based (tolerates f < n/2) |
| `gossip` | Epidemic eventual consistency |
| `crdt` | Conflict-free replicated data types |
| `quorum` | Configurable quorum-based |

## Security (@claude-flow/security + AIDefence)

```typescript
import { InputValidator, PathValidator, SafeExecutor, PasswordHasher, TokenGenerator } from '@claude-flow/security';
```

- `InputValidator` — Zod-based validation at boundaries
- `PathValidator` — Path traversal prevention
- `SafeExecutor` — Command injection protection (SAFE_LANGUAGES whitelist)
- `PasswordHasher` — bcrypt hashing
- `TokenGenerator` — Secure token generation
- `AIDefence` — Prompt injection detection, PII scanning (14 PII types), safety filters

## Claude Code ↔ AgentDB Memory Bridge

| Tool | Description |
|------|-------------|
| `memory_import_claude` | Import Claude Code memories into AgentDB (384-dim ONNX) |
| `memory_bridge_status` | Show bridge health |
| `memory_search_unified` | Semantic search across ALL namespaces |

```bash
# Auto-imports current project memories on SessionStart
# For all projects:
memory_import_claude({ allProjects: true })
memory_search_unified({ query: "authentication security", limit: 5 })
```

## Publishing to npm

### Publishing Rules

**MUST publish ALL THREE packages when publishing CLI changes.**
Publish order: `@claude-flow/cli` first → `claude-flow` → `ruflo`

```bash
# STEP 1: Build and publish CLI
cd v3/@claude-flow/cli
npm version 3.6.X --no-git-tag-version
npm run build
npm publish --tag latest
npm dist-tag add @claude-flow/cli@3.6.X alpha

# STEP 2: Publish claude-flow umbrella (root)
npm version 3.6.X --no-git-tag-version
npm publish --tag latest
npm dist-tag add claude-flow@3.6.X alpha
npm dist-tag add claude-flow@3.6.X v3alpha

# STEP 3: Publish ruflo umbrella
cd ruflo
npm version 3.6.X --no-git-tag-version
npm publish --tag latest
npm dist-tag add ruflo@3.6.X alpha
```

**Verification (run before telling user publishing is complete):**
```bash
npm view @claude-flow/cli dist-tags --json
npm view claude-flow dist-tags --json
npm view ruflo dist-tags --json
# ALL THREE need: latest AND alpha pointing to newest version
```

### All Tags That Must Be Updated

| Package | Tags | User command |
|---------|------|--------------|
| `@claude-flow/cli` | `latest`, `alpha`, `v3alpha` | `npx @claude-flow/cli@latest` |
| `claude-flow` | `latest`, `alpha`, `v3alpha` | `npx claude-flow@latest` |
| `ruflo` | `latest`, `alpha` | `npx ruflo@latest` |

> Since v3.5.0 (2026-02-27), the primary tag is `latest` (not `v3alpha`).
> `ruflo` is the recommended user-facing package — never skip it.

## Plugin Registry Maintenance (IPFS/Pinata)

Registry CID stored in: `v3/@claude-flow/cli/src/plugins/store/discovery.ts`

```bash
# Fetch current registry
curl -s "https://gateway.pinata.cloud/ipfs/$(grep LIVE_REGISTRY_CID v3/@claude-flow/cli/src/plugins/store/discovery.ts | cut -d\"'\" -f2)" > /tmp/registry.json

# Upload updated registry (source credentials from .env)
PINATA_JWT=$(grep '^PINATA_API_JWT=' .env | cut -d'=' -f2-)
curl -X POST "https://api.pinata.cloud/pinning/pinJSONToIPFS" \
  -H "Authorization: Bearer $PINATA_JWT" \
  -H "Content-Type: application/json" \
  -d @/tmp/registry.json
```

**Security:** NEVER hardcode API keys. Source from `.env` at runtime. NEVER commit `.env`.

## Plugin Marketplace (32 native + 21 npm)

```bash
# Claude Code plugin install
/plugin marketplace add ruvnet/ruflo
/plugin install ruflo-core@ruflo
/plugin install ruflo-swarm@ruflo
/plugin install ruflo-federation@ruflo

# Or via CLI
npx ruflo@latest plugins install @claude-flow/plugin-name
```

### Plugin Categories

| Category | Key Plugins |
|----------|------------|
| Core & Orchestration | `ruflo-core`, `ruflo-swarm`, `ruflo-autopilot`, `ruflo-federation` |
| Memory & Knowledge | `ruflo-agentdb`, `ruflo-rag-memory`, `ruflo-ruvector`, `ruflo-knowledge-graph` |
| Intelligence | `ruflo-intelligence`, `ruflo-daa`, `ruflo-ruvllm`, `ruflo-goals` |
| Code Quality | `ruflo-testgen`, `ruflo-browser`, `ruflo-jujutsu`, `ruflo-docs` |
| Security | `ruflo-security-audit`, `ruflo-aidefence` |
| Architecture | `ruflo-adr`, `ruflo-ddd`, `ruflo-sparc` |
| DevOps | `ruflo-migrations`, `ruflo-observability`, `ruflo-cost-tracker` |
| Domain-Specific | `ruflo-iot-cognitum`, `ruflo-neural-trader`, `ruflo-market-data` |

## Environment Variables

```bash
# Core config
CLAUDE_FLOW_CONFIG=./claude-flow.config.json
CLAUDE_FLOW_LOG_LEVEL=info

# Provider API Keys (NEVER commit)
ANTHROPIC_API_KEY=sk-ant-...
OPENAI_API_KEY=sk-...
GOOGLE_API_KEY=...

# MCP Server
CLAUDE_FLOW_MCP_PORT=3000
CLAUDE_FLOW_MCP_TRANSPORT=stdio

# Memory
CLAUDE_FLOW_MEMORY_BACKEND=hybrid
CLAUDE_FLOW_MEMORY_PATH=./data/memory

# Plugin registry (NEVER commit values)
PINATA_API_KEY=
PINATA_API_SECRET=
PINATA_API_JWT=

# Feature flags (set by settings.json)
CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS=1
CLAUDE_FLOW_V3_ENABLED=true
CLAUDE_FLOW_HOOKS_ENABLED=true
```

## Doctor Health Checks

```bash
npx ruflo@latest doctor --fix
```

Checks: Node.js 20+, npm 9+, git, config file, daemon status, memory DB, API keys, MCP servers, disk space, TypeScript, agentic-flow bridge.

## Quick Setup

```bash
# Add as MCP server in Claude Code
claude mcp add ruflo -- npx -y ruflo@latest mcp start

# Or one-line install
curl -fsSL https://cdn.jsdelivr.net/gh/ruvnet/ruflo@main/scripts/install.sh | bash

# Start daemon
npx ruflo@latest daemon start

# Run doctor
npx ruflo@latest doctor --fix
```

## Claude Code vs MCP Tools

### Claude Code Handles ALL EXECUTION:
- **Task tool**: Spawn and run agents concurrently
- File operations (Read, Write, Edit, MultiEdit, Glob, Grep)
- Code generation, Bash commands, git operations
- TodoWrite and task management

### MCP Tools ONLY COORDINATE:
- Swarm initialization (topology setup)
- Agent type definitions and task orchestration
- Memory management and neural features
- Performance tracking

> Keep MCP for coordination strategy — use Claude Code's Task tool for real execution.

## V3 Performance Targets

| Metric | Target | Status |
|--------|--------|--------|
| HNSW Search | 150x–12,500x faster | **Implemented** |
| Memory Reduction | 50-75% (Int8 quantization) | **Implemented** |
| MCP Response | <100ms | **Achieved** |
| CLI Startup | <500ms | **Achieved** |
| Flash Attention | 2.49x–7.47x speedup | In progress |
| SONA Adaptation | <0.05ms | In progress |

## Support

| Resource | Link |
|----------|------|
| Documentation | [User Guide](docs/USERGUIDE.md) |
| Issues | [GitHub Issues](https://github.com/ruvnet/claude-flow/issues) |
| Enterprise | [ruv.io](https://ruv.io) |
| Web UI | [flo.ruv.io](https://flo.ruv.io) |
| Goal Planner | [goal.ruv.io](https://goal.ruv.io) |
| Community | [Agentics Foundation Discord](https://discord.com/invite/dfxmpwkG2D) |

---

> **Remember: Claude Flow coordinates, Claude Code creates!**
