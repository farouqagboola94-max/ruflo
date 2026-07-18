# CATALYST OS // AI ARSENAL

The complete AI tooling layer of CatalystOS. 60 tools, 9 categories, Catalyst specific priority tiers and revenue stream mappings.

## What this is

This is not another list. This is a structured, filtered, opinionated arsenal designed for one operator running five revenue streams out of Lagos.

Every tool has been tagged with:
- A category (where it lives in the stack)
- A Catalyst priority tier (when to deploy)
- A revenue stream map (which business it serves)
- A specific use case (how it slots in)

## File structure

```
catalyst-os-arsenal/
├── README.md                          ← you are here
├── CLAUDE.md                          ← session context file
├── SKILL.md                           ← Claude skill package
├── arsenal-registry.json              ← machine readable, source of truth
├── priority-tiers.md                  ← tier logic explained
├── integration-map.md                 ← how each tool slots into CatalystOS
├── quick-start-stacks.md              ← 8 pre built workflow stacks
└── dashboard/
    ├── catalyst-arsenal.html          ← standalone interactive dashboard
    └── arsenal-registry.json          ← copy for the dashboard
```

## How to use this

### Option 1: Just open the dashboard

```bash
open dashboard/catalyst-arsenal.html
```

That's it. Works in any browser. Filterable, searchable, color coded by category, priority tagged, with use cases.

### Option 2: Load as a Claude skill

Copy the entire `catalyst-os-arsenal` folder into your Claude skill directory. The SKILL.md file makes it discoverable. When Catalyst asks Claude about tools or builds, Claude will read this skill and route correctly.

### Option 3: Pull from JSON

```python
import json
with open('arsenal-registry.json') as f:
    arsenal = json.load(f)

# Get all DEPLOY_NOW tools for events
events_tools = [
    t for t in arsenal['tools']
    if t['catalyst_priority'] == 'DEPLOY_NOW'
    and 'EVENTS' in t['revenue_streams']
]
```

## The priority breakdown

| Tier | Count | Meaning |
|------|-------|---------|
| DEPLOY_NOW | 29 | Use this quarter. Most already integrated. |
| Q3_EXPANSION | 16 | Activate when Phase 1 team is hired. |
| LEARN | 12 | Reference only. Skim quarterly. |
| SKIP | 3 | Out of scope for Lagos consulting ops. |

## The revenue stream map

Every DEPLOY_NOW and Q3_EXPANSION tool is tagged with one or more of these:

- **EVENTS**: Sneakers Fest 2026
- **SMM**: Vice Chairman, Aso Oke clients
- **MARKETING_PR**: Consulting work
- **AI_AUTOMATION**: Chambers, internal automation
- **CONTENT_IP**: Substack, comics, manuscripts

## The 8 quick start stacks

Pre built tool combinations for the most common Catalyst workflows. See `quick-start-stacks.md` for the full breakdown.

1. Content Pipeline (Substack, comics, manuscripts)
2. Chambers AI Automation
3. Sneakers Fest Production
4. Vice Chairman SMM
5. Voice Note to Content Package
6. Foundation Layer (always on)
7. New Skill Build
8. AI Tech VA Onboarding

## Integration rules

Three rules govern what joins this arsenal:

1. **Earned slot**: Every tool maps to a specific architectural position in CatalystOS. No duplicates. Pick one per slot.
2. **Revenue tied**: DEPLOY_NOW tools produce money this quarter. Period.
3. **Tier honesty**: SKIP tools stay out. LEARN tools do not get deployed prematurely. Q3_EXPANSION does not jump the queue.

## Reassessment cadence

- **Q3 2026**: Promote Q3_EXPANSION tools to DEPLOY_NOW as Phase 1 team activates.
- **Q4 2026**: Audit DEPLOY_NOW. Demote anything that did not earn its slot.

## Voice and protocol

This arsenal follows Catalyst's writing rules:
- No hyphens between words
- No em dashes
- Direct, punchy
- Brutally honest about tradeoffs

When Claude references this arsenal in chat:
- Names tool numbers explicitly (e.g. "Use #18 Task Master AI for that")
- Cross references quick start stacks when a build matches
- Flags SKIP tier tools by name if the user asks why something is missing

## Credit

Original 60 tool curation: @divyannshisharma (Instagram).
Catalyst priority tiers, revenue stream mapping, integration logic, and OS layer: built for Oluwatobiloba The Catalyst, 2026.

## Version

v1.0.0 · Compiled 2026-05-26
