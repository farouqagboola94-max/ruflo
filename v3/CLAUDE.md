# V3 Monorepo — @claude-flow Packages

> Sub-guide for `v3/`. Root `CLAUDE.md` behavioral rules apply here in full — read it first.

---

## Workspace Setup

**Package manager:** pnpm (workspace defined in `pnpm-workspace.yaml`)

```yaml
packages:
  - "@claude-flow/*"
```

```bash
# Install all workspace packages
cd v3
pnpm install

# Build all packages
pnpm run build

# Run all tests
pnpm run test

# Type-check (no emit)
pnpm run typecheck
```

### Per-Package Commands

```bash
# From v3/@claude-flow/<package>
pnpm install && pnpm run build && pnpm test
```

---

## All 23 Packages

All packages live in `v3/@claude-flow/` and publish as `@claude-flow/<name>`.

| Package | Purpose |
|---------|---------|
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

## TypeScript Configuration

**Root workspace config:** `v3/tsconfig.json` extends `v3/tsconfig.base.json`.

Explicit path mappings (for in-repo cross-package imports):

```json
{
  "@claude-flow/security": ["./@claude-flow/security/src"],
  "@claude-flow/memory":   ["./@claude-flow/memory/src"],
  "@claude-flow/integration": ["./@claude-flow/integration/src"],
  "@claude-flow/swarm":    ["./@claude-flow/swarm/src"],
  "@claude-flow/performance": ["./@claude-flow/performance/src"],
  "@claude-flow/cli":      ["./@claude-flow/cli/src"],
  "@claude-flow/neural":   ["./@claude-flow/neural/src"],
  "@claude-flow/testing":  ["./@claude-flow/testing/src"],
  "@claude-flow/deployment": ["./@claude-flow/deployment/src"],
  "@claude-flow/shared":   ["./@claude-flow/shared/src"],
  "@claude-flow/hooks":    ["./@claude-flow/hooks/src"]
}
```

Project references follow the same 11 packages. Remaining 12 packages are imported via their published npm entry points.

---

## Vitest Configuration (`v3/vitest.config.ts`)

**TDD approach:** London School — mock-first, behavior verification over state.

### Test discovery patterns

```
__tests__/**/*.test.ts
__tests__/**/*.spec.ts
@claude-flow/**/__tests__/**/*.test.ts
@claude-flow/**/__tests__/**/*.spec.ts
mcp/__tests__/**/*.test.ts
mcp/__tests__/**/*.spec.ts
```

### Key settings

| Setting | Value |
|---------|-------|
| `environment` | `node` |
| `setupFiles` | `./__tests__/setup.ts` |
| `globals` | `true` |
| `pool` | `threads` (isolate: true) |
| `testTimeout` | 10,000 ms |
| `hookTimeout` | 10,000 ms |
| `mockReset` | `true` |
| `clearMocks` | `true` |
| `restoreMocks` | `true` |

### Coverage

- **Provider:** v8
- **Reporters:** text, json, html, lcov
- **Output:** `./__tests__/coverage/`
- **Includes:** `src/**/*.ts`, `modules/**/*.ts`
- **Excludes:** `*.d.ts`, `*.test.ts`, `*.spec.ts`, `index.ts`, `__tests__/`, `fixtures/`, `mocks/`

### Path aliases (for test imports)

```
@          → ./src
@tests     → ./__tests__
@fixtures  → ./__tests__/fixtures
@helpers   → ./__tests__/helpers
@mocks     → ./__tests__/mocks
@security  → ./modules/security
@memory    → ./modules/memory
@swarm     → ./modules/swarm
@core      → ./modules/core
```

---

## Swarm Configuration

**Config file:** `v3/swarm.config.ts`

Default: **15-agent hierarchical-mesh** topology.

| Setting | Value |
|---------|-------|
| `topology` | `hierarchical-mesh` |
| `maxAgents` | 15 |
| `loadBalancingStrategy` | `capability-match` |
| `consensus` | `raft` |

See root `CLAUDE.md` → **Swarm Configuration** section for the full 15-agent role mapping and development phases.

---

## Directory Structure

```
v3/
├── @claude-flow/           # 23 scoped packages (pnpm workspace)
├── __tests__/              # Integration tests (vitest)
│   ├── setup.ts            # Global test setup
│   ├── coverage/           # Coverage reports (gitignored)
│   ├── fixtures/           # Shared test fixtures
│   ├── helpers/            # Test helper utilities
│   └── mocks/              # Shared mock objects
├── agents/                 # Agent type definitions
├── docs/                   # Architecture docs + ADRs
│   └── adr/                # Architecture Decision Records (MADR format)
├── goal_ui/                # GOAP goal planner UI (Vite + Supabase)
├── helpers/                # v3 helper scripts
├── implementation/         # Implementation reference docs
├── mcp/                    # MCP server entry points
├── plugins/                # Plugin implementations
├── scripts/                # Build + publish scripts
├── src/                    # Shared V3 source
├── .agentic-flow/          # agentic-flow integration config
├── bunfig.toml             # Bun runtime config
├── swarm.config.ts         # 15-agent swarm topology + role mapping
├── vitest.config.ts        # Test runner config
├── tsconfig.json           # Workspace tsconfig (extends tsconfig.base.json)
├── tsconfig.base.json      # Shared compiler options
├── pnpm-workspace.yaml     # workspace: ['@claude-flow/*']
└── index.ts                # V3 public API entry
```

---

## Security Module

```typescript
import {
  InputValidator,
  PathValidator,
  SafeExecutor,
  PasswordHasher,
  TokenGenerator,
} from '@claude-flow/security';
```

| Export | Purpose |
|--------|---------|
| `InputValidator` | Zod-based validation at system boundaries |
| `PathValidator` | Path traversal prevention |
| `SafeExecutor` | Command injection protection (SAFE_LANGUAGES whitelist) |
| `PasswordHasher` | bcrypt hashing |
| `TokenGenerator` | Secure token generation |

`@claude-flow/aidefence` adds: prompt injection detection, PII scanning (14 types), safety filters.

---

## Memory Module

```typescript
import { AgentDB } from '@claude-flow/memory';
import { createEmbeddings } from '@claude-flow/embeddings';
```

- **AgentDB:** Vector database with 384-dim ONNX embeddings (all-MiniLM-L6-v2), sql.js WASM SQLite
- **HNSW index:** 150x–12,500x faster search vs. brute-force
- **Hybrid backend:** in-memory + persistent storage
- **AgentDB controllers:** 19 total

### Memory bridge (Claude Code ↔ AgentDB)

| Tool | Description |
|------|-------------|
| `memory_import_claude` | Import Claude Code memories into AgentDB |
| `memory_bridge_status` | Bridge health check |
| `memory_search_unified` | Semantic search across all namespaces |

---

## Neural Module

```typescript
import { SONA, MoERouter, FlashAttention } from '@claude-flow/neural';
```

4-step learning pipeline: **RETRIEVE** (HNSW) → **JUDGE** (verdicts) → **DISTILL** (LoRA) → **CONSOLIDATE** (EWC++)

| Component | Performance |
|-----------|-------------|
| SONA (self-optimizing) | <0.05ms adaptation |
| MoE routing | 8 experts |
| Flash Attention | 2.49x–7.47x speedup |
| EWC++ | Prevents catastrophic forgetting |

---

## Code Quality Rules

- Files under 500 lines — split by functionality when approaching limit
- No hardcoded secrets — source from `.env` at runtime
- Input validation at all system boundaries (use `InputValidator`)
- Typed interfaces for all public APIs — prefer explicit return types on exports
- TDD London School (mock-first) for new code — use `@mocks` alias
- Event sourcing for state changes
- No `any` — prefer `unknown` + type guards
- Cross-package imports: use TypeScript path aliases in tests; installed packages in production code

---

## ADR Compliance

ADRs live in `v3/docs/adr/` (MADR format). Current ADRs referenced in code:

| ADR | Subject |
|-----|---------|
| ADR-001 | agentic-flow@alpha integration |
| ADR-006 | Unified Memory Service |
| ADR-009 | Hybrid Memory Backend |
| ADR-026 | 3-tier model routing (WASM → Haiku → Sonnet/Opus) |

When making architectural changes that affect public APIs, bounded contexts, or consensus protocols, create a new ADR first.

---

## Performance Targets

| Metric | Target | Status |
|--------|--------|--------|
| HNSW Search | 150x–12,500x faster | **Implemented** |
| Memory Reduction | 50-75% (Int8 quantization) | **Implemented** |
| MCP Response | <100ms | **Achieved** |
| CLI Startup | <500ms | **Achieved** |
| Flash Attention | 2.49x–7.47x speedup | In progress |
| SONA Adaptation | <0.05ms | In progress |

---

## Publishing (CLI changes require all three packages)

See root `CLAUDE.md` → **Publishing to npm** for the full three-step publish sequence:
`@claude-flow/cli` → `claude-flow` → `ruflo`

Current version: **3.6.27**
