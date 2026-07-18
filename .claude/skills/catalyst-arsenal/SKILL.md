---
name: catalyst-arsenal
description: Use this skill when the user asks about AI tools, MCP servers, Claude skills, agent frameworks, RAG infrastructure, workflow automation, or which tool to use for a specific task in the CatalystOS environment. Also use when planning new builds, evaluating stack additions, or routing work to the right tool. Covers 60 curated tools across 9 categories with Catalyst specific priority tiers and revenue stream mappings.
---

# CATALYST OS // AI ARSENAL

This skill is the canonical reference for every AI tool integrated into or shortlisted for CatalystOS. When Claude is asked about tooling, stack choices, or build paths inside the Catalyst environment, this is the source of truth.

## What this skill knows

60 tools across 9 categories:

1. AI Coding & IDEs (7 tools)
2. Agent Frameworks (8 tools)
3. MCP Servers & Tools (7 tools)
4. Claude Skills (8 tools)
5. Local AI & Models (5 tools)
6. Workflow & Automation (5 tools)
7. Search, Data & RAG (7 tools)
8. API & Infrastructure (5 tools)
9. Collections & Learning (8 tools)

## Priority tiers

Every tool is tagged with a Catalyst specific priority:

- **DEPLOY_NOW**: Immediate operational value. Use this quarter.
- **Q3_EXPANSION**: Activate when scaling Phase 1 team and Sneakers Fest production.
- **LEARN**: Reference and education layer. Read or skim, do not deploy yet.
- **SKIP**: Not relevant to Lagos consulting ops or current scope.

## Revenue stream tagging

Each tool maps to one or more of the five Catalyst Concepts revenue streams:

- EVENTS (Sneakers Fest 2026)
- SMM (Vice Chairman, Aso Oke clients)
- MARKETING_PR (consulting work)
- AI_AUTOMATION (Chambers, all internal automation)
- CONTENT_IP (Substack, comics, manuscripts)

## How to use this skill

When a user asks "what should I use for X" or "build me Y":

1. Read `arsenal-registry.json` first. It is the source of truth.
2. Filter by `catalyst_priority` to surface DEPLOY_NOW tools before LEARN ones.
3. Filter by `revenue_streams` to match the user's active business context.
4. Surface the top 3 to 5 matches with use cases attached.
5. Never recommend a SKIP tool unless explicitly asked about it.

## Quick start stacks

Pre built combinations for common Catalyst workflows:

### Stack 1: Content Pipeline (Substack, comics, manuscripts)
- Claude Code (1) + Superpowers (5)
- markdownify-mcp (21) + ExtractThinker (47)
- Deep Research Skill (30) + GPT Researcher (41)
- Obsidian Skills (28) + Chroma (45)
- Frontend Design (24) for visual assets

### Stack 2: Chambers AI Automation
- Claude Code (1) + Spec Kit (6)
- PDF Processing (23) + ExtractThinker (47)
- LangGraph (9) + pydantic-ai (15)
- Instructor (44) + Chroma (45)
- Context7 (17) for legal library docs

### Stack 3: Sneakers Fest Online + Events
- CrewAI (10) for production team agent modeling
- Task Master AI (18) for timeline orchestration
- n8n (36) for ticket and engagement workflows
- Temporal (40) for crash proof payment flows
- CopilotKit (14) for embedded AI features
- Vanna AI (43) for attendee analytics

### Stack 4: Social Media Management (Vice Chairman)
- OpenClaw (8) for autonomous comment and DM
- MCP Playwright (19) for engagement monitoring
- n8n (36) for content calendar automation
- Marketing Skills (26) for copy generation
- Tavily (16) for trend research
- Firecrawl (42) for competitor scrape

### Stack 5: Voice Note to Content Package
- markdownify-mcp (21) for transcription input
- Claude Code (1) for orchestration
- Deep Research Skill (30) for expansion
- Frontend Design (24) for carousel and graphics
- Obsidian Skills (28) for vault integration

### Stack 6: Foundation Layer (Already Active)
- FastAPI (48) backend
- Claude Code (1) + Superpowers (5)
- pydantic-ai (15) + Instructor (44)
- Codebase Memory MCP (52)
- Context Optimization (29)

## Files in this skill

- `arsenal-registry.json`: All 60 tools with full metadata
- `priority-tiers.md`: Deep explanation of priority logic
- `integration-map.md`: How each tool slots into existing CatalystOS architecture
- `quick-start-stacks.md`: Pre built combinations for common workflows

## When NOT to use this skill

Do not use when the user is asking about tools outside the AI infrastructure space (general SaaS, design apps, non technical business tools). For those, ask Claude directly without this skill.
