---
name: claude-flow-help
description: Show Claude-Flow / Ruflo v3 commands and usage
---

# Ruflo / Claude-Flow v3.6.27

Enterprise AI agent orchestration platform. Three installable packages:
- `npx ruflo@latest` — user-facing CLI (recommended)
- `npx claude-flow@latest` — umbrella package
- `npx @claude-flow/cli@latest` — scoped CLI

After `npx ruflo@latest init`, local alias `./claude-flow` is also available.

---

## All 26 Commands

### Core Development

| Command | Description |
|---------|-------------|
| `init` | Project initialization (wizard, presets, skills, hooks) |
| `agent` | Agent lifecycle (spawn, list, status, stop, metrics, pool, health, logs) |
| `swarm` | Multi-agent swarm coordination |
| `task` | Task creation, assignment, lifecycle |
| `workflow` | Workflow execution and templates |
| `session` | Session state management |

### Intelligence & Memory

| Command | Description |
|---------|-------------|
| `memory` | AgentDB + HNSW vector search (150x–12,500x faster) |
| `hooks` | 17 hooks + 12 background workers (self-learning) |
| `neural` | Neural pattern training (SONA, MoE, EWC++) |
| `embeddings` | Vector embeddings (75x faster with agentic-flow) |

### Infrastructure

| Command | Description |
|---------|-------------|
| `mcp` | MCP server management (314 tools) |
| `config` | Configuration and provider setup |
| `providers` | Multi-LLM provider management (Claude, GPT, Gemini, Ollama) |
| `plugins` | Plugin manager (32 native + 21 npm plugins) |
| `deployment` | Deployment management and rollback |
| `daemon` | Background worker daemon |

### Security & Quality

| Command | Description |
|---------|-------------|
| `security` | Security scanning (scan, audit, cve, threats, validate, report) |
| `claims` | Claims-based authorization (check, grant, revoke, list) |
| `federation` | Zero-trust cross-machine agent federation |
| `performance` | Performance profiling (benchmark, profile, metrics, optimize) |

### System

| Command | Description |
|---------|-------------|
| `status` | System status monitoring |
| `start` | Service startup |
| `hive-mind` | Queen-led Byzantine fault-tolerant consensus |
| `migrate` | V2→V3 migration with rollback support |
| `doctor` | System diagnostics with auto-fix |
| `help` | Show command help |

---

## Quick Start

```bash
# Initialize project
npx ruflo@latest init --wizard

# Start background daemon
npx ruflo@latest daemon start

# Run health checks
npx ruflo@latest doctor --fix
```

---

## Agent Management

```bash
npx ruflo@latest agent spawn -t coder --name my-coder
npx ruflo@latest agent spawn -t researcher --name research-1
npx ruflo@latest agent list
npx ruflo@latest agent status <id>
npx ruflo@latest agent stop <id>
npx ruflo@latest agent metrics
npx ruflo@latest agent pool --size 5
npx ruflo@latest agent health
npx ruflo@latest agent logs <id>
```

---

## Swarm Coordination

Default topology: **hierarchical-mesh**, 15-agent swarm.

```bash
# Initialize swarm (v3 mode)
npx ruflo@latest swarm init --v3-mode

# Start swarm for a task
npx ruflo@latest swarm "Build REST API" --strategy development --monitor

# Long-running background swarm
npx ruflo@latest swarm "Analyze codebase" --background --max-agents 8

# Distributed swarm
npx ruflo@latest swarm "Security audit" --strategy testing --distributed
```

---

## Memory Operations

AgentDB with 384-dim ONNX embeddings and HNSW vector search.

```bash
# Store data
npx ruflo@latest memory store "key" "value" --namespace project

# Semantic search
npx ruflo@latest memory search -q "authentication patterns"

# Import Claude Code memories into AgentDB
npx ruflo@latest memory import-claude

# Export
npx ruflo@latest memory export backup.json --namespace project

# Stats
npx ruflo@latest memory stats
```

---

## Hooks System (17 hooks + 12 workers)

```bash
npx ruflo@latest hooks pre-task --description "Build feature X"
npx ruflo@latest hooks post-task --task-id "abc123" --success true
npx ruflo@latest hooks session-start --session-id "sess-1"
npx ruflo@latest hooks route --task "Implement OAuth2"
npx ruflo@latest hooks worker list
npx ruflo@latest hooks worker dispatch --trigger audit
```

---

## Security

```bash
npx ruflo@latest security scan --depth full
npx ruflo@latest security audit
npx ruflo@latest security cve
npx ruflo@latest security threats
npx ruflo@latest security validate
npx ruflo@latest security report
```

---

## Agent Federation (Zero-Trust)

```bash
npx ruflo@latest federation init           # Generate keypair, start node
npx ruflo@latest federation join wss://peer.example.com:8443
npx ruflo@latest federation send --to team-b --type task-request --message "..."
npx ruflo@latest federation status
```

---

## Dual-Mode Orchestration (Claude + Codex)

```bash
npx claude-flow-codex dual run feature --task "Add OAuth2 authentication"
npx claude-flow-codex dual run security --target "./src"
npx claude-flow-codex dual run refactor --target "./src/legacy"
npx claude-flow-codex dual status
npx claude-flow-codex dual templates
```

---

## SPARC Workflow

```bash
npx ruflo@latest sparc "Implement user authentication"
npx ruflo@latest sparc modes
npx ruflo@latest sparc run architect "API design"
npx ruflo@latest sparc tdd "user session management"
```

---

## Publishing (three packages in order)

```bash
# 1. @claude-flow/cli
cd v3/@claude-flow/cli
npm version 3.6.X --no-git-tag-version && npm run build && npm publish --tag latest

# 2. claude-flow (root)
npm version 3.6.X --no-git-tag-version && npm publish --tag latest

# 3. ruflo
cd ruflo
npm version 3.6.X --no-git-tag-version && npm publish --tag latest
```

---

## Resources

- Repository: https://github.com/ruvnet/ruflo
- Issues: https://github.com/ruvnet/ruflo/issues
- Web UI: https://flo.ruv.io
- Goal Planner: https://goal.ruv.io
- Enterprise: https://ruv.io
