#!/usr/bin/env bash
#
# CatalystOS Model Router — installer
# Sets up claude-code-router, backs up any existing config, drops ours in.
# Run once:  bash install.sh
#
set -euo pipefail

FORGE="\033[38;5;208m"; OFF="\033[38;5;223m"; DIM="\033[2m"; RST="\033[0m"
say(){ printf "${FORGE}▸${RST} %s\n" "$1"; }
warn(){ printf "${FORGE}!${RST} %s\n" "$1"; }

say "CatalystOS Model Router — install"

# 1. Node check
if ! command -v node >/dev/null 2>&1; then
  warn "Node.js not found. Install Node 18+ first (https://nodejs.org), then rerun."
  exit 1
fi
say "Node $(node --version) found"

# 2. Install Claude Code + the router (idempotent)
say "Installing Claude Code + claude-code-router (global npm)"
npm install -g @anthropic-ai/claude-code >/dev/null 2>&1 || warn "Claude Code install had warnings, continuing"
npm install -g @musistudio/claude-code-router >/dev/null 2>&1 || warn "Router install had warnings, continuing"

# 3. Config dir
CFG_DIR="$HOME/.claude-code-router"
mkdir -p "$CFG_DIR"

# 4. Back up any existing config, then install ours
if [ -f "$CFG_DIR/config.json" ]; then
  STAMP="$(date +%Y%m%d-%H%M%S)"
  cp "$CFG_DIR/config.json" "$CFG_DIR/config.backup.$STAMP.json"
  say "Backed up existing config to config.backup.$STAMP.json"
fi
cp "$(dirname "$0")/config.json" "$CFG_DIR/config.json"
say "Router config installed to $CFG_DIR/config.json"

# 5. Keys reminder
if [ ! -f "$(dirname "$0")/.env" ]; then
  cp "$(dirname "$0")/.env.example" "$(dirname "$0")/.env"
  warn "Created .env — open it and paste your OWN keys, then: source .env"
else
  say ".env already present"
fi

printf "\n${OFF}Done.${RST}\n"
printf "${DIM}Next:${RST}\n"
printf "  1. Edit .env with your keys\n"
printf "  2. source .env\n"
printf "  3. ccr start          ${DIM}# starts the local gateway${RST}\n"
printf "  4. ccr code           ${DIM}# launches Claude Code through the router${RST}\n"
printf "  In-session switch:    ${DIM}/model deepseek,deepseek-chat${RST}\n"
