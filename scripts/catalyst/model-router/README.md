# CatalystOS Model Router

One interface. Every model. Your keys, your rules, your spend under control.

This is the clean build of what that "comment CODING for free unlimited Claude Code" reel was gesturing at. The reel's version routes your prompts through a stranger's endpoint on a "free unlimited" promise, which usually means a leaked key, a trial abuse scheme, or a repo that harvests the keys you paste in. This build throws all that out and keeps the one real idea underneath: run Claude Code as the cockpit, swap the engine per task, pay only for what the task actually needs.

Built on `claude-code-router` (musistudio, MIT license, open source). It sits between Claude Code and the model providers, translates the requests, and picks a model by job type.

---

## Why this cuts spend

A coding session isn't one workload. Naming a branch, summarizing a diff, compacting old context: throwaway. Planning a refactor: reasoning. Applying a 40 line edit across three files: this is where quality earns its money.

Paying frontier rates for the throwaway work is the leak. This router sends the cheap work to cheap models and saves the strong models for the parts that matter. Reported savings run high, but treat any number you read as a hypothesis until you measure your own cost per finished task. That's the honest position.

---

## The routing map (what runs where)

| Job type      | Model                        | Why |
|---------------|------------------------------|-----|
| `background`  | Gemini 2.5 Flash             | Constant summarize/compact traffic. Cheap or free tier. |
| `default`     | DeepSeek Chat                | Solid everyday coding, very low cost. |
| `think`       | DeepSeek Reasoner            | Reasoning tasks without frontier pricing. |
| `longContext` | Gemini 2.5 Pro               | Big context window for large files. |
| high stakes   | Claude (via `cs strong` / `cs secure`) | The hard edits and anything confidential. |

---

## Setup (five minutes)

You need Node 18 or later.

```bash
bash install.sh          # installs Claude Code + the router, drops config in place
cp .env.example .env     # if the installer didn't already
nano .env                # paste YOUR OWN keys
source .env
ccr start                # starts the local gateway on your machine
ccr code                 # launches Claude Code through the router
```

Switch models mid session from inside Claude Code:

```
/model deepseek,deepseek-chat
/model openrouter,google/gemini-2.5-pro
```

Or use the CatalystOS switch helper (source it once per shell):

```bash
source catalyst-switch
cs cheap        # everything on the cheapest stack
cs balanced     # the default mixed routing
cs strong       # default jumps to Claude for hard work
cs secure       # ALL traffic locked to Anthropic direct
cs status       # show current routing
```

---

## The one rule you don't break: client work stays secure

You do consulting work that touches contracts, affidavits, and material under NDPR. That work must never flow through a third party model endpoint. When you open anything tied to the Chambers engagement or any client file, run:

```bash
cs secure
ccr restart
```

That locks every route to Anthropic direct so nothing passes through an intermediary. Do the confidential session, then `cs balanced` when you're back to your own projects. This isn't optional caution. It's the Value over Time law: one leaked client document costs you the relationship, which costs more than every Naira this router ever saves.

---

## Getting your keys (all your own, all legit)

- **OpenRouter** — one key, every model. https://openrouter.ai/keys
- **DeepSeek** — cheapest default + reasoning. https://platform.deepseek.com
- **Gemini** — real free tier for background/long context. https://aistudio.google.com/apikey
- **Anthropic** — high stakes + secure mode. https://console.anthropic.com

You only need one to start. OpenRouter alone gets you all four families through a single key. Add DeepSeek and Gemini direct later to push cost down further.

---

## Verify before you trust (honesty notes)

I built this against the current docs, but a few things drift fast and you should confirm on your machine:

- **Model slugs change.** `google/gemini-2.5-pro`, `z-ai/glm-4.6`, `deepseek/deepseek-r1` and the rest: check the live list at https://openrouter.ai/models and fix any that 404. The GLM slug in particular I'm not fully certain of, verify it.
- **The desktop version moved to SQLite.** The newer Claude Code Router *desktop app* stores config in a local database and only reads `config.json` once for migration. This build targets the *CLI* (`ccr` via npm), which still uses `config.json`. If you install the desktop tray instead, configure through its UI.
- **Gateway port varies by version.** Docs show `3456` (CLI) and `3458` (newer web UI). Whatever `ccr start` prints is the truth on your box.
- **The field name.** Official docs use `api_base_url`. Some older guides use `api_base`. If a provider won't connect, that mismatch is the first thing to check.
- **"Free" has limits.** Gemini's free tier is real but rate limited. It is not infinite. Nothing frontier is.

Repo, if you want to read the source yourself: https://github.com/musistudio/claude-code-router

---

## Where this lives in CatalystOS

This is a Switchboard module. It plugs into the routing layer you already run: cheap models handle the 80, strong models handle the 20, and `cs secure` carves out the client work that can't touch either. Drop this folder into your CatalystOS repo under `modules/model-router/` and add the dashboard card to your index.
