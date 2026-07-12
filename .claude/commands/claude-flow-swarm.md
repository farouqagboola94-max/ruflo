---
name: claude-flow-swarm
description: Coordinate multi-agent swarms for complex tasks (v3.6.27)
---

# Swarm Coordination — Ruflo v3.6.27

15-agent hierarchical-mesh swarm with Byzantine fault tolerance, work-stealing load balancing, and hive-mind consensus.

## Basic Usage

```bash
npx ruflo@latest swarm init --v3-mode
npx ruflo@latest swarm "your complex task" --strategy <type> [options]
```

---

## Default Topology: Hierarchical-Mesh (15 agents)

Configured in `v3/swarm.config.ts`:

| Setting | Default |
|---------|---------|
| `topology` | `hierarchical-mesh` |
| `maxAgents` | 15 (anti-drift: 6-8 for coding swarms) |
| `loadBalancingStrategy` | `capability-match` |
| `consensus` | `raft` |

### 15-Agent Role Mapping

| Agent | Role | Domain |
|-------|------|--------|
| agent-1 | Queen Coordinator | core — orchestrates all 15 agents |
| agent-2 | Security Architect | security — threat modeling |
| agent-3 | Security Implementer | security — CVE fixes |
| agent-4 | Security Tester | security — TDD security harness |
| agent-5 | Core Architect | core — DDD architecture |
| agent-6 | Core Implementer | core — type system |
| agent-7 | Memory Specialist | core — AgentDB unification |
| agent-8 | Swarm Specialist | core — coordinator merge |
| agent-9 | MCP Specialist | core — tool registration |
| agent-10 | Integration Architect | integration — agentic-flow |
| agent-11 | CLI/Hooks Developer | integration — CLI modernization |
| agent-12 | Neural/Learning Dev | integration — SONA learning |
| agent-13 | TDD Test Engineer | quality — London School TDD |
| agent-14 | Performance Engineer | performance — Flash Attention |
| agent-15 | Release Engineer | deployment — CI/CD pipeline |

---

## Topologies

| Topology | When to Use |
|----------|-------------|
| `hierarchical` | Coding swarms — queen controls workers directly |
| `mesh` | Peer-to-peer, fully connected collaboration |
| `hierarchical-mesh` | Default — hybrid for large task sets |
| `adaptive` | Dynamic based on load |
| `centralized` | Single point, small tasks |

## Consensus Strategies

| Strategy | Algorithm | Fault Tolerance |
|----------|-----------|----------------|
| `raft` | Leader-based | Tolerates f < n/2 failures |
| `byzantine` | BFT | Tolerates f < n/3 malicious |
| `gossip` | Epidemic | Eventually consistent |
| `crdt` | Conflict-free | No coordination needed |
| `quorum` | Configurable | Adjustable threshold |

---

## Swarm Strategies

- **auto** — Automatic based on task analysis
- **development** — Code implementation with review and testing
- **research** — Information gathering and synthesis
- **analysis** — Data processing and pattern identification
- **testing** — Comprehensive QA
- **optimization** — Performance tuning
- **maintenance** — Bug fixes and updates
- **security** — Security auditing (routes to agents 2-4)

---

## Agent Types (60+ available)

**Core:** `coder`, `reviewer`, `tester`, `planner`, `researcher`

**Coordination:** `hierarchical-coordinator`, `mesh-coordinator`, `adaptive-coordinator`, `queen-coordinator`

**Consensus:** `byzantine-coordinator`, `raft-manager`, `gossip-coordinator`, `crdt-synchronizer`, `quorum-manager`

**Specialized:** `security-architect`, `memory-specialist`, `performance-engineer`, `v3-queen-coordinator`

---

## Common Options

```bash
--strategy <type>          # Execution strategy
--topology <type>          # Swarm topology (default: hierarchical)
--max-agents <n>           # Max concurrent agents (default for coding: 6-8)
--background               # Long-running background execution
--monitor                  # Real-time monitoring
--distributed              # Distributed coordination
--review                   # Enable peer review
--testing                  # Include automated testing
--dry-run                  # Preview config without executing
--verbose                  # Detailed logging
```

---

## Examples

### Anti-Drift Coding Swarm (recommended default)

```bash
npx ruflo@latest swarm init --topology hierarchical --max-agents 8 --strategy specialized
```

### Development Swarm with Review

```bash
npx ruflo@latest swarm "Build e-commerce REST API" \
  --strategy development \
  --topology hierarchical \
  --max-agents 8 \
  --monitor \
  --review \
  --testing
```

### Security Audit Swarm

```bash
npx ruflo@latest swarm "Comprehensive security audit" \
  --strategy security \
  --max-agents 6 \
  --review \
  --verbose
```

### Long-Running Research Swarm

```bash
npx ruflo@latest swarm "Analyze AI market trends 2025" \
  --strategy research \
  --background \
  --distributed \
  --max-agents 10
```

### Full Enterprise Swarm

```bash
npx ruflo@latest swarm "Implement secure payment processing" \
  --strategy development \
  --topology hierarchical-mesh \
  --max-agents 15 \
  --parallel \
  --monitor \
  --review \
  --testing \
  --verbose
```

---

## Claude Code + Task Tool Pattern

For in-session swarm orchestration via Task tool (the recommended execution path):

```javascript
// Initialize swarm via MCP
mcp__ruv-swarm__swarm_init({ topology: "hierarchical", maxAgents: 8, strategy: "specialized" })

// Spawn all named agents concurrently in ONE message
Task({ prompt: "Design API. SendMessage design to 'developer'.", subagent_type: "system-architect", name: "architect", run_in_background: true })
Task({ prompt: "Wait for design from 'architect'. Implement. SendMessage to 'tester'.", subagent_type: "coder", name: "developer", run_in_background: true })
Task({ prompt: "Wait for code from 'developer'. Write tests.", subagent_type: "tester", name: "tester", run_in_background: true })

// Kick off the pipeline
SendMessage({ to: "architect", summary: "Start", message: "Design a REST API for user management" })
```

---

## Monitoring and Control

```bash
# Real-time monitoring
npx ruflo@latest status
npx ruflo@latest agent list
npx ruflo@latest agent info <agent-id>

# Memory coordination
npx ruflo@latest memory store "swarm_objective" "Build scalable API" --namespace swarm
npx ruflo@latest memory search -q "swarm_progress" --namespace swarm
npx ruflo@latest memory export swarm-results.json --namespace swarm
```

---

## Key Features

- **Timeout-free execution** — background mode with state persistence
- **Work-stealing load balancing** — dynamic task redistribution
- **Circuit breakers** — retry with exponential backoff
- **Hive-mind consensus** — raft-based leader maintains authoritative state
- **Zero-trust federation** — cross-machine collaboration (ed25519 + mTLS)
- **SONA learning** — patterns stored post-task via `post-task` hook
