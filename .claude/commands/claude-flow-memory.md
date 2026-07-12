---
name: claude-flow-memory
description: AgentDB memory system with HNSW vector search (v3.6.27)
---

# Memory System — Ruflo v3.6.27

**AgentDB** with 384-dim ONNX embeddings (all-MiniLM-L6-v2), sql.js WASM SQLite, and HNSW vector index — 150x–12,500x faster than brute-force search.

---

## Architecture

| Component | Technology | Speed |
|-----------|-----------|-------|
| Vector embeddings | ONNX all-MiniLM-L6-v2 | 384 dims |
| Storage backend | sql.js WASM SQLite | Hybrid |
| Search index | HNSW | 150x–12,500x faster |
| Cross-session sync | Claude Code bridge | Auto on SessionStart |

---

## Basic Operations

```bash
# Store with default namespace
npx ruflo@latest memory store "key" "value"

# Store with specific namespace
npx ruflo@latest memory store "architecture_decisions" "microservices with API gateway" --namespace arch

# Semantic search (HNSW)
npx ruflo@latest memory search -q "authentication patterns"
npx ruflo@latest memory search -q "API design" --namespace arch --limit 10

# Stats
npx ruflo@latest memory stats
npx ruflo@latest memory stats --namespace project
```

---

## Claude Code ↔ AgentDB Bridge

```bash
# Import Claude Code memories into AgentDB (auto-runs on SessionStart)
npx ruflo@latest memory import-claude

# Import all projects
npx ruflo@latest memory import-claude --all-projects

# Bridge health check
npx ruflo@latest memory bridge-status

# Unified semantic search across all namespaces
npx ruflo@latest memory search-unified -q "security vulnerabilities"
```

---

## Export / Import

```bash
# Export all memory
npx ruflo@latest memory export full-backup.json

# Export specific namespace
npx ruflo@latest memory export project-backup.json --namespace project

# Import
npx ruflo@latest memory import backup.json

# Cleanup old entries
npx ruflo@latest memory cleanup --days 30
npx ruflo@latest memory cleanup --namespace temp --days 7
```

---

## Namespaces

| Namespace | Purpose |
|-----------|---------|
| `default` | General storage |
| `agents` | Agent state and config |
| `tasks` | Task results |
| `sessions` | Session history and context |
| `swarm` | Swarm coordination and objectives |
| `project` | Project-specific context |
| `spec` | Requirements and specifications |
| `arch` | Architecture decisions |
| `impl` | Implementation notes |
| `test` | Test results and coverage |
| `debug` | Debug logs and fixes |
| `agent-teams` | Shared namespace for named-agent comms |

---

## Programmatic API

### AgentDB via `@claude-flow/memory`

```typescript
import { AgentDB } from '@claude-flow/memory';
import { createEmbeddings } from '@claude-flow/embeddings';

const db = new AgentDB();

// Store with vector embedding
await db.store({ key: 'auth_pattern', value: 'OAuth2 with PKCE', namespace: 'arch' });

// Semantic search via HNSW
const results = await db.search({ query: 'authentication', limit: 5 });

// Unified search across all namespaces
const all = await db.searchUnified({ query: 'security', limit: 10 });
```

### Memory bridge tools (MCP)

| Tool | Description |
|------|-------------|
| `memory_import_claude` | Import Claude Code memories into AgentDB |
| `memory_bridge_status` | Bridge health check |
| `memory_search_unified` | Semantic search across all namespaces |

---

## Best Practices

### Naming Conventions
- Use descriptive, searchable keys
- Include component prefix for clarity: `auth_`, `api_`, `test_`
- Timestamp time-sensitive data: `perf_results_20260712`

### Organization
- Use namespaces to categorize — `arch` for decisions, `spec` for requirements
- Store related data together, keep values concise
- Use `agent-teams` namespace for cross-agent SendMessage coordination

### Maintenance
- Regular backups: `npx ruflo@latest memory export project-$(date +%Y%m%d).json`
- Clean old data: `npx ruflo@latest memory cleanup --days 30`
- Monitor stats: `npx ruflo@latest memory stats`

### Retention (from `.claude/settings.json`)
- Short-term: 24h
- Long-term: 30d

---

## Examples

### Store SPARC development context

```bash
npx ruflo@latest memory store "spec_auth_requirements" "OAuth2 + JWT with refresh tokens" --namespace spec
npx ruflo@latest memory store "arch_api_design" "RESTful microservices with GraphQL gateway" --namespace arch
npx ruflo@latest memory store "test_coverage_auth" "95% coverage, all edge cases passing" --namespace test
```

### Cross-agent coordination via memory

```bash
# Agent A stores findings
npx ruflo@latest memory store "security_findings" "XSS in /api/render endpoint" --namespace swarm

# Agent B retrieves and continues
npx ruflo@latest memory search -q "security_findings" --namespace swarm
```

### Backup before major work

```bash
npx ruflo@latest memory export pre-refactor-$(date +%Y%m%d).json
```
