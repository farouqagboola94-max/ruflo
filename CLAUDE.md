# Claude Code Configuration — Ruflo / claude-flow

> **Ruflo v3.6.27** (2026-05-20) — Stable release with agent federation and comms-first coordination.
> 6,000+ commits, 314 MCP tools, 23 scoped packages, 15-agent swarm, 19 AgentDB controllers, 32 native plugins.
> npm packages: `@claude-flow/cli@3.6.27`, `claude-flow@3.6.27`, `ruflo@3.6.27`

> **For OpenAI Codex users:** Read `AGENTS.md` first — it re-frames all patterns below from the Codex perspective (LEDGER vs EXECUTOR roles).

---

## Behavioral Rules (Always Enforced)

- Do what has been asked; nothing more, nothing less
- NEVER create files unless absolutely necessary for achieving your goal
- ALWAYS prefer editing an existing file to creating a new one
- NEVER proactively create documentation files (*.md) or README files unless explicitly requested
- NEVER save working files, text/mds, or tests to the root folder
- Never continuously check status after spawning a swarm — wait for results
- ALWAYS read a file before editing it
- NEVER commit secrets, credentials, or .env files
- NEVER hardcode API keys (PINATA_API_KEY, PINATA_API_SECRET, PINATA_API_JWT, OPENAI_API_KEY, etc.) — source from .env at runtime

---

## File Organization

- NEVER save to root folder — use the directories below
- `/src` — source code files
- `/tests` — test files
- `/docs` — documentation and markdown files (ADRs go in `docs/adr/`)
- `/config` — configuration files
- `/scripts` — utility scripts
- `/examples` — example code

---

## Project Architecture

- Follow Domain-Driven Design with bounded contexts
- Keep files under 500 lines
- Use typed interfaces for all public APIs
- Prefer TDD London School (mock-first) for new code
- Use event sourcing for state changes
- Ensure input validation at system boundaries

### Repository Layout

```
ruflo/                          # root (umbrella npm package — claude-flow + ruflo bins)
├── v3/                         # V3 monorepo (TypeScript source, pnpm workspace)
│   ├── @claude-flow/           # 23 scoped packages (see complete list below)
│   ├── __tests__/              # integration tests (vitest)
│   ├── agents/                 # agent type definitions
│   ├── docs/                   # architecture docs + ADRs
│   ├── goal_ui/                # GOAP goal planner UI (Vite + Supabase)
│   ├── helpers/                # v3 helper scripts
│   ├── implementation/         # implementation reference docs
│   ├── mcp/                    # MCP server entry points
│   ├── plugins/                # plugin implementations
│   ├── scripts/                # build + publish scripts
│   ├── src/                    # shared V3 source
│   ├── .agentic-flow/          # agentic-flow integration config
│   ├── bunfig.toml             # Bun runtime config
│   ├── swarm.config.ts         # 15-agent swarm topology + role mapping
│   ├── vitest.config.ts        # test runner config
│   ├── tsconfig.json + tsconfig.base.json
│   ├── pnpm-workspace.yaml     # workspace: ['@claude-flow/*']
│   └── index.ts                # V3 public API entry (13KB)
├── ruflo/                      # ruflo sub-package (web UI + thin CLI wrapper)
│   ├── src/ruvocal/            # RuVocal — SvelteKit chat UI fork (multi-model + MCP)
│   │   ├── mcp-bridge/         # per-group MCP JSON-RPC proxy (port 3001)
│   │   └── nginx/              # brand-injecting reverse proxy
│   ├── bin/                    # ruflo CLI entry
│   ├── assets/                 # brand assets
│   ├── docs/adr/               # ruflo-specific ADRs
│   ├── docker-compose.yml      # full stack: mongo + mcp-bridge + nginx + chat-ui
│   ├── rvf.manifest.json       # RVF package manifest (chat-ui-mcp v2.0)
│   ├── .env.example            # env template (all secrets via env vars)
│   └── package.json            # ruflo npm package
├── catalyst-talents/           # Next.js site (Netlify deploy target)
├── sneakers-fest/              # React design system / brand demo
├── bin/                        # root CLI entry (claude-flow bin)
├── agents/                     # top-level agent definitions
├── plugins/                    # top-level plugin configs
├── .claude/                    # Claude Code project settings
│   ├── settings.json           # hooks, permissions, env, agent teams (7KB)
│   ├── agents/                 # custom agent definitions
│   ├── commands/               # slash command definitions (skills source)
│   ├── helpers/
│   │   ├── hook-handler.cjs    # universal hook dispatcher
│   │   ├── auto-memory-hook.mjs  # AgentDB memory import/sync
│   │   └── statusline.cjs      # status line renderer
│   ├── skills/                 # skill definitions
│   ├── statusline.sh (16KB), statusline.mjs (2.4KB), statusline-command.sh (6KB)
│   └── mcp.json                # MCP server config
├── .agents/                    # agent registry
├── .claude-plugin/             # Claude Code plugin manifest
├── .github/workflows/          # 9 CI/CD workflows (see CI section)
├── scripts/                    # repo-level utility scripts
├── tests/                      # root-level tests
├── netlify.toml                # Netlify deploy: catalyst-talents/ → out/
├── package.json                # root (name: claude-flow, version: 3.6.27)
├── tsconfig.json
├── CLAUDE.md                   # this file
└── AGENTS.md                   # Codex-specific guide (21KB)
```

---

## V3 Packages — Complete List (v3/@claude-flow)

All 23 packages live in `v3/@claude-flow/` and are published as `@claude-flow/<name>`.

| Package | Purpose |
|---------|--------|
| `agents` | Agent type registry and lifecycle management |
| `aidefence` | Prompt injection detection, PII scanning (14 types), safety filters |
| `browser` | Playwright headless browser automation |
| `claims` | Claims-based authorization (check, grant, revoke, list) |
| `cli` | CLI entry point — 26 commands, 140+ subcommands; **published to npm** |
| `codex` | Dual-mode Claude + OpenAI Codex collaboration via shared memory |
| `deployment` | Deployment management and rollback automation |
| `embeddings` | 384-dim ONNX (all-MiniLM-L6-v2), sql.js WASM SQLite, HNSW; 75x faster with agentic-flow |
| `guidance` | Governance control plane — compile, enforce, prove, evolve |
| `hooks` | 17 hooks + 12 background workers (self-learning system) |
| `integration` | agentic-flow bridge, token optimizer |
| `mcp` | MCP server tools and routing (314 tools total) |
| `memory` | AgentDB + HNSW vector search (150x–12,500x faster) |
| `neural` | SONA, MoE routing, EWC++, Flash Attention |
| `performance` | Performance profiling, benchmarking, metrics |
| `plugin-agent-federation` | Zero-trust cross-machine agent federation |
| `plugin-iot-cognitum` | IoT device management and trust scoring |
| `plugins` | Plugin system core — manager, discovery, IPFS store |
| `providers` | Multi-LLM provider abstraction (Claude, GPT, Gemini, Ollama) |
| `security` | Input validation, path security, CVE remediation |
| `shared` | Shared types, utilities, base interfaces |
| `swarm` | Swarm coordination and topology strategies |
| `testing` | Test intelligence and coverage gap analysis |

---

## Concurrency: 1 MESSAGE = ALL RELATED OPERATIONS

- All operations MUST be concurrent/parallel in a single message
- Use Claude Code's Task tool for spawning agents — MCP tools only coordinate

**Mandatory patterns:**
- ALWAYS batch ALL todos in ONE TodoWrite call (5-10+ minimum)
- ALWAYS spawn ALL agents in ONE message via Task tool
- ALWAYS batch ALL file reads/writes/edits in ONE message
- ALWAYS batch ALL terminal operations in ONE Bash message
- ALWAYS batch ALL memory store/retrieve operations in ONE message

---

## Swarm Orchestration

- MUST initialize swarm using MCP tools when starting complex tasks
- MUST spawn concurrent agents using Claude Code's Task tool
- Never use MCP tools alone for execution — Task tool agents do the actual work

### MCP + Task Tool in SAME Message

- MUST call MCP tools AND Task tool in ONE message for complex work
- Always call MCP first, then IMMEDIATELY call Task tool to spawn agents

### 3-Tier Model Routing (ADR-026)

| Tier | Handler | Latency | Cost | Use Cases |
|------|---------|---------|------|-----------|
| **1** | Agent Booster (WASM) | <1ms | $0 | Simple transforms — **skip LLM entirely** |
| **2** | Haiku | ~500ms | $0.0002 | Simple tasks (<30% complexity) |
| **3** | Sonnet/Opus | 2-5s | $0.003-0.015 | Complex reasoning, architecture, security (>30%) |

- Always check for `[AGENT_BOOSTER_AVAILABLE]` or `[TASK_MODEL_RECOMMENDATION]` before spawning agents
- Use Edit tool directly when `[AGENT_BOOSTER_AVAILABLE]` — intent types: `var-to-const`, `add-types`, `add-error-handling`, `async-await`, `add-logging`, `remove-console`

---

## Swarm Configuration (v3/swarm.config.ts)

The canonical swarm config is at `v3/swarm.config.ts`. Default: **15-agent hierarchical-mesh**.

### 15-Agent Role Mapping

| Agent ID | Role | Domain | Key Responsibilities |
|----------|------|--------|-----------------------|
| agent-1 | Queen Coordinator | core | Orchestrate all 15 agents, manage GitHub issues/milestones, cross-domain comms |
| agent-2 | Security Architect | security | Threat modeling, security policy, architecture review |
| agent-3 | Security Implementer | security | CVE fixes (CVE-1,2,3), input validation, security code |
| agent-4 | Security Tester | security | TDD security harness, penetration testing, audit verification |
| agent-5 | Core Architect | core | DDD architecture, bounded context definition |
| agent-6 | Core Implementer | core | Type system modernization, config management |
| agent-7 | Memory Specialist | core | AgentDB unification (150x-12500x), hybrid backend |
| agent-8 | Swarm Specialist | core | Single SwarmCoordinator, merge 4 coordination systems |
| agent-9 | MCP Specialist | core | MCP server optimization, tool registration |
| agent-10 | Integration Architect | integration | agentic-flow@alpha integration, service layer design |
| agent-11 | CLI/Hooks Developer | integration | CLI modernization, hooks system, command structure |
| agent-12 | Neural/Learning Dev | integration | SONA learning (<0.05ms), pattern recognition |
| agent-13 | TDD Test Engineer | quality | TDD London School, >90% coverage, mock-first |
| agent-14 | Performance Engineer | performance | Flash Attention (2.49x-7.47x), memory optimization (50-75%) |
| agent-15 | Release Engineer | deployment | CI/CD pipeline, deployment automation, release |

### Development Phases

| Phase | Weeks | Active Domains |
|-------|-------|----------------|
| Foundation | 1-2 | security, core |
| Core Systems | 3-6 | core, quality |
| Integration | 7-10 | integration, quality, performance |
| Optimization & Release | 11-14 | all |

### Anti-Drift Coding Swarm (PREFERRED DEFAULT)

```javascript
mcp__ruv-swarm__swarm_init({
  topology: "hierarchical",
  maxAgents: 8,
  strategy: "specialized"
})
```

- ALWAYS use hierarchical topology for coding swarms
- Keep maxAgents at 6-8 for tight coordination
- Use `raft` consensus for hive-mind (leader maintains authoritative state)
- Run frequent checkpoints via `post-task` hooks

---

## Dual-Mode Collaboration (Claude Code 🔵 + Codex 🟢)

Dual-mode orchestration runs Claude Code (🔵) and OpenAI Codex (🟢) workers in parallel with shared memory via `@claude-flow/codex`.

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

| Task Type | Preferred |
|-----------|----------|
| Architecture & Design | 🔵 Claude |
| Implementation | 🟢 Codex |
| Security Review | 🔵 Claude |
| Performance Optimization | 🟢 Codex |
| Testing Strategy | 🔵 Claude |
| Refactoring | 🟢 Codex |

---

## Auto-Start Swarm Protocol

When the user requests a complex task, **execute this in a SINGLE message:**

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
- Multiple files (3+), new feature, refactoring across modules
- API changes with tests, security changes, performance optimization
- Database schema changes

**SKIP SWARM for:**
- Single file edits, simple bug fixes (1-2 lines), documentation updates, config changes

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

---

## Project Configuration (.claude/settings.json)

Full settings at `.claude/settings.json` (7KB). Key sections:

```json
{
  "model": "claude-opus-4-7",
  "env": {
    "CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS": "1",
    "CLAUDE_FLOW_V3_ENABLED": "true",
    "CLAUDE_FLOW_HOOKS_ENABLED": "true"
  },
  "claudeFlow": {
    "version": "3.6.11",
    "swarm": { "topology": "hierarchical-mesh", "maxAgents": 15 },
    "memory": { "backend": "hybrid", "enableHNSW": true, "memoryGraph": { "enabled": true } },
    "neural": { "enabled": true },
    "agentTeams": {
      "enabled": true, "teammateMode": "auto",
      "coordination": {
        "autoAssignOnIdle": true, "trainPatternsOnComplete": true,
        "notifyLeadOnComplete": true, "sharedMemoryNamespace": "agent-teams"
      }
    },
    "daemon": { "autoStart": true, "workers": ["map","audit","optimize","consolidate","testgaps","ultralearn","deepdive","document","refactor","benchmark"] },
    "learning": { "enabled": true, "autoTrain": true, "retention": { "shortTerm": "24h", "longTerm": "30d" } },
    "security": { "autoScan": true, "scanOnEdit": true, "cveCheck": true, "threatModel": true },
    "adr": { "autoGenerate": true, "directory": "/docs/adr", "template": "madr" }
  },
  "attribution": {
    "commit": "Co-Authored-By: RuFlo <ruv@ruv.net>",
    "pr": "Generated with RuFlo"
  }
}
```

### Hooks (complete — from settings.json)

| Hook | Trigger | Handler |
|------|---------|--------|
| `PreToolUse[Bash]` | Before every Bash call | `hook-handler.cjs pre-bash` |
| `PostToolUse[Write\|Edit\|MultiEdit]` | After file writes | `hook-handler.cjs post-edit` |
| `UserPromptSubmit` | Every user message | `hook-handler.cjs route` |
| `SessionStart` | Session open | `hook-handler.cjs session-restore` + `auto-memory-hook.mjs import` |
| `SessionEnd` | Session close | `hook-handler.cjs session-end` |
| `Stop` | After Claude stops | `auto-memory-hook.mjs sync` |
| `PreCompact[manual]` | Manual /compact | `hook-handler.cjs compact-manual` → `session-end` |
| `PreCompact[auto]` | Auto-compact | `hook-handler.cjs compact-auto` → `session-end` |
| `SubagentStop` | After each subagent | `hook-handler.cjs post-task` |

### Denied Permissions

```
Read(./.env)      # secrets never readable by Claude Code
Read(./.env.*)    # all .env variants blocked
Bash(rm -rf /)    # destructive filesystem ops blocked
```

### Background Workers (daemon, 10 workers)

| Worker | Interval | Priority |
|--------|----------|----------|
| `audit` | 1h | critical |
| `optimize` | 30m | high |
| `document` | 1h | normal |
| `ultralearn` | 1h | normal |
| `deepdive` | 4h | normal |
| `consolidate` | 2h | low |
| `map`, `testgaps`, `refactor`, `benchmark` | on-demand | normal |

---

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

---

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

---

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

- **Pipeline:** `architect → developer → tester → reviewer` (each SendMessage to next)
- **Fan-out:** lead spawns parallel agents, collects results via task completions
- **Supervisor/Worker:** lead assigns via SendMessage, workers report back

### Rules
1. Always name agents (`name: "role-name"`)
2. Comms over memory — SendMessage for real-time, memory for persistence
3. Tell each agent WHO to message next in their prompt
4. Spawn all at once with `run_in_background: true`
5. Don't poll — wait for task completion notifications
6. Lead synthesizes all results before responding to user

---

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

---

## Intelligence System (RuVector)

- **SONA**: Self-Optimizing Neural Architecture (<0.05ms adaptation)
- **MoE**: Mixture of Experts for specialized routing
- **HNSW**: 150x–12,500x faster pattern search
- **EWC++**: Elastic Weight Consolidation (prevents catastrophic forgetting)
- **Flash Attention**: 2.49x–7.47x speedup

**4-step pipeline:** RETRIEVE (HNSW) → JUDGE (verdicts) → DISTILL (LoRA) → CONSOLIDATE (EWC++)

---

## Hive-Mind Consensus

| Topology | Description |
|----------|-------------|
| `hierarchical` | Queen controls workers directly |
| `mesh` | Fully connected peer network |
| `hierarchical-mesh` | Hybrid (recommended default) |
| `adaptive` | Dynamic based on load |

| Strategy | Algorithm |
|----------|----------|
| `byzantine` | BFT (tolerates f < n/3 faulty) |
| `raft` | Leader-based (tolerates f < n/2) |
| `gossip` | Epidemic eventual consistency |
| `crdt` | Conflict-free replicated data types |
| `quorum` | Configurable quorum-based |

---

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

---

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

---

## Agent Federation — Zero-Trust Cross-Machine Collaboration

Federation lets agents on different machines, orgs, or cloud regions discover, authenticate, and collaborate securely.

```
Your Agent → [Strip PII] → [Sign ed25519] → [mTLS channel]
                                                    |
Their Agent ← [Block injection] ← [Verify identity] ←┘
                    Audit trail both sides. Trust scores auto-update.
```

### Trust Scoring Formula
`0.4×success_rate + 0.2×uptime + 0.2×threat_score + 0.2×integrity`

Trust upgrades require history; downgrades are instant. PII is stripped before any data leaves your node (14-type detection pipeline).

### Federation CLI

```bash
npx ruflo@latest federation init          # generate keypair, start federation node
npx ruflo@latest federation join wss://peer.example.com:8443
npx ruflo@latest federation send --to team-b --type task-request --message "..."
npx ruflo@latest federation status
```

---

## Ruflo Sub-Package (ruflo/)

The `ruflo/` directory is a separate npm package (`name: "ruflo"`) that provides:
- **`src/ruvocal/`** — Self-hostable SvelteKit chat UI (fork of HuggingFace Chat UI)
- **`bin/`** — Thin CLI entry wrapping claude-flow

### RVF Manifest (ruflo/rvf.manifest.json)

Format: `rvf-package v2.0` — `chat-ui-mcp` package deploying white-label AI chat with grouped MCP endpoints.

**Components (docker-compose.yml — 4 services):**

| Service | Port | Description |
|---------|------|-------------|
| `mongodb` | 27017 | MongoDB 7 for conversation persistence |
| `mcp-bridge` | 3001 | Per-group MCP JSON-RPC proxy + multi-provider AI chat proxy |
| `nginx` | 3000 | Reverse proxy — brand injection, CORS, static assets |
| `chat-ui` | internal | RuVocal SvelteKit UI (proxied through nginx) |

**MCP Tool Groups (per-group endpoints at `/mcp/{group}`):**

| Group | Default | Endpoint | Description |
|-------|---------|----------|-------------|
| `core` | on | `/mcp/core` | Built-in guidance, help, utilities |
| `intelligence` | on | `/mcp/intelligence` | Hooks, learning, neural pattern tools |
| `agents` | on | `/mcp/agents` | Agent spawn, swarm, hive-mind, task orchestration |
| `memory` | on | `/mcp/memory` | Memory store/search, embeddings, session |
| `devtools` | on | `/mcp/devtools` | Performance, security, deployment, config, doctor |
| `security` | off | `/mcp/security` | Security scanning, CVE detection, threat analysis |
| `browser` | off | `/mcp/browser` | Headless browser — navigate, click, fill, screenshot |
| `neural` | off | `/mcp/neural` | Neural training, DAA autonomous agents |
| `agentic-flow` | off | `/mcp/agentic-flow` | agentic-flow alpha integration |
| `claude-code` | off | `/mcp/claude-code` | Claude Code CLI tools |
| `gemini` | off | `/mcp/gemini` | Google Gemini native tools |
| `codex` | off | `/mcp/codex` | OpenAI Codex tools |

**Deployment platforms:** Google Cloud Run, Docker Compose, Kubernetes

**Infrastructure targets:** mcp-bridge (512Mi / 1 CPU / 0-5 instances), chat-ui (2Gi / 2 CPU / 1-10 instances)

### Self-Hosting

```bash
cd ruflo
cp .env.example .env   # fill in API keys — never commit .env
docker compose up -d
# UI: http://localhost:3000   MCP Bridge: http://localhost:3001
```

**Brand customization:** `PUBLIC_APP_NAME` and `PUBLIC_APP_DESCRIPTION` env vars, plus `chat-ui/static/chatui/` overlay assets.

**Hosted demo:** https://flo.ruv.io/

---

## Goal Planner UI (v3/goal_ui)

GOAP A* planner: plain-English goals → executable agent plans.

- **Source:** `v3/goal_ui/` (Vite + Supabase)
- **Hosted:** https://goal.ruv.io/ · live agents: https://goal.ruv.io/agents
- **Self-host:** `cd v3/goal_ui && npm install && npm run dev`

---

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

---

## CI/CD Workflows (.github/workflows — 9 workflows)

| Workflow file | Size | Description |
|---------------|------|-------------|
| `ci.yml` | 6KB | Main CI — lint, type-check, test, build on every push/PR |
| `v3-ci.yml` | 3.6KB | V3 monorepo-specific CI (pnpm workspace, vitest) |
| `integration-tests.yml` | 34KB | Extensive integration tests — all subsystems, MCP, swarm, memory |
| `verification-pipeline.yml` | 13KB | Multi-stage verification — security scan, ADR compliance, benchmarks |
| `rollback-manager.yml` | 26KB | Automated rollback pipeline with health checks and recovery |
| `status-badges.yml` | 6KB | Update repo status badges after CI runs |
| `deploy-catalyst.yml` | 800B | Deploy `catalyst-talents/` to Netlify on push to main |
| `pages.yml` | 500B | GitHub Pages deployment for documentation site |
| `validate-marketplace.yml` | 2.2KB | Validate IPFS plugin marketplace registry integrity |

### Running CI Locally

```bash
cd v3
pnpm install
pnpm run build         # build all @claude-flow packages
pnpm run test          # vitest
pnpm run typecheck     # tsc --noEmit

# Root level
npm test
npm run build
```

---

## Netlify Deployment (netlify.toml)

```toml
[build]
  base    = "catalyst-talents"
  command = "npm run build"
  publish = "out"

[build.environment]
  NODE_VERSION = "20"
```

- Source: `catalyst-talents/` (Next.js)
- Triggered by: `.github/workflows/deploy-catalyst.yml` on push to `main`
- Also triggered manually via Netlify dashboard

---

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

---

## Plugin Registry Maintenance (IPFS/Pinata)

Registry CID stored in: `v3/@claude-flow/cli/src/plugins/store/discovery.ts`

```bash
# Fetch current registry
curl -s "https://gateway.pinata.cloud/ipfs/$(grep LIVE_REGISTRY_CID v3/@claude-flow/cli/src/plugins/store/discovery.ts | cut -d\"'\" -f2)" > /tmp/registry.json

# Upload updated registry (ALWAYS source credentials from .env — NEVER hardcode)
PINATA_JWT=$(grep '^PINATA_API_JWT=' .env | cut -d'=' -f2-)
curl -X POST "https://api.pinata.cloud/pinning/pinJSONToIPFS" \
  -H "Authorization: Bearer $PINATA_JWT" \
  -H "Content-Type: application/json" \
  -d @/tmp/registry.json
```

**Security:** NEVER hardcode PINATA_API_KEY, PINATA_API_SECRET, or PINATA_API_JWT. Source from `.env` at runtime. NEVER commit `.env`.

---

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

---

## Environment Variables

```bash
# Core config
CLAUDE_FLOW_CONFIG=./claude-flow.config.json
CLAUDE_FLOW_LOG_LEVEL=info

# Provider API Keys (NEVER commit)
ANTHROPIC_API_KEY=sk-ant-...
OPENAI_API_KEY=sk-...
GOOGLE_API_KEY=...
OPENROUTER_API_KEY=...

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

# RuVocal / Chat UI
MONGODB_URL=mongodb://localhost:27017
MONGODB_DB_NAME=chat-db
PUBLIC_APP_NAME=RuFlo
BRAND_DESCRIPTION=Enterprise AI Agent Orchestration Platform

# MCP Tool Group toggles (for docker-compose)
MCP_GROUP_INTELLIGENCE=true
MCP_GROUP_AGENTS=true
MCP_GROUP_MEMORY=true
MCP_GROUP_DEVTOOLS=true
MCP_GROUP_SECURITY=false
MCP_GROUP_BROWSER=false
MCP_GROUP_NEURAL=false

# Feature flags (set by settings.json)
CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS=1
CLAUDE_FLOW_V3_ENABLED=true
CLAUDE_FLOW_HOOKS_ENABLED=true
```

---

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

---

## Doctor Health Checks

```bash
npx ruflo@latest doctor --fix
```

Checks: Node.js 20+, npm 9+, git, config file, daemon status, memory DB, API keys, MCP servers, disk space, TypeScript, agentic-flow bridge.

---

## Claude Code vs MCP Tools

### Claude Code Handles ALL EXECUTION
- **Task tool**: Spawn and run agents concurrently
- File operations (Read, Write, Edit, MultiEdit, Glob, Grep)
- Code generation, Bash commands, git operations
- TodoWrite and task management

### MCP Tools ONLY COORDINATE
- Swarm initialization (topology setup)
- Agent type definitions and task orchestration
- Memory management and neural features
- Performance tracking

> Keep MCP for coordination strategy — use Claude Code's Task tool for real execution.

---

## V3 Performance Targets

| Metric | Target | Status |
|--------|--------|--------|
| HNSW Search | 150x–12,500x faster | **Implemented** |
| Memory Reduction | 50-75% (Int8 quantization) | **Implemented** |
| MCP Response | <100ms | **Achieved** |
| CLI Startup | <500ms | **Achieved** |
| Flash Attention | 2.49x–7.47x speedup | In progress |
| SONA Adaptation | <0.05ms | In progress |

---

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
