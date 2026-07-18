#!/bin/bash
# ============================================================
# CATALYST OS — SETUP SCRIPT
# Run once. Builds the entire OS on your machine.
# Usage: bash catalyst_setup.sh
# ============================================================

set -e

ORANGE='\033[0;33m'
GREEN='\033[0;32m'
RED='\033[0;31m'
GRAY='\033[0;37m'
NC='\033[0m'

OS_ROOT="$HOME/CatalystOS"

echo ""
echo -e "${ORANGE}⚡  CATALYST OS — SETUP v2.0.0${NC}"
echo -e "${GRAY}    Operator : Oluwatobiloba — The Catalyst${NC}"
echo -e "${GRAY}    Location : Lagos, Nigeria${NC}"
echo -e "${GRAY}    Target   : $OS_ROOT${NC}"
echo ""

# ── 1. DIRECTORY STRUCTURE ──────────────────────────────────
echo -e "${ORANGE}[1/6] Building directory structure...${NC}"
mkdir -p "$OS_ROOT"/{agents/{orchestrator,legal-doc,voice-pipeline,modules},dashboard,content,chambers,sneakfest,scripts}
echo -e "${GREEN}      ✓ Directories created${NC}"

# ── 2. COPY CONTEXT FILES ───────────────────────────────────
echo -e "${ORANGE}[2/6] Installing context files...${NC}"

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

if [ -f "$SCRIPT_DIR/CLAUDE.md" ]; then
    cp "$SCRIPT_DIR/CLAUDE.md" "$OS_ROOT/CLAUDE.md"
    echo -e "${GREEN}      ✓ CLAUDE.md installed${NC}"
else
    echo -e "${RED}      ✗ CLAUDE.md not found. Download from Claude chat first.${NC}"
fi

if [ -f "$SCRIPT_DIR/CATALYST_OS_PROJECT_REGISTRY.json" ]; then
    cp "$SCRIPT_DIR/CATALYST_OS_PROJECT_REGISTRY.json" "$OS_ROOT/CATALYST_OS_PROJECT_REGISTRY.json"
    echo -e "${GREEN}      ✓ Project registry installed${NC}"
else
    echo -e "${GRAY}      ~ Registry not found, skipping${NC}"
fi

# Copy orchestrator files
cp "$SCRIPT_DIR/agents/orchestrator/main.py" "$OS_ROOT/agents/orchestrator/main.py"
cp "$SCRIPT_DIR/agents/orchestrator/cli.py" "$OS_ROOT/agents/orchestrator/cli.py"
cp "$SCRIPT_DIR/agents/orchestrator/requirements.txt" "$OS_ROOT/agents/orchestrator/requirements.txt"
echo -e "${GREEN}      ✓ Agent files installed${NC}"

# ── 3. PYTHON ENV ───────────────────────────────────────────
echo -e "${ORANGE}[3/6] Setting up Python environment...${NC}"
cd "$OS_ROOT/agents/orchestrator"
python3 -m venv venv
source venv/bin/activate
pip install -q -r requirements.txt
deactivate
echo -e "${GREEN}      ✓ Python venv + deps installed${NC}"

# ── 4. REACT DASHBOARD ──────────────────────────────────────
echo -e "${ORANGE}[4/6] Scaffolding React dashboard...${NC}"
cd "$OS_ROOT/dashboard"
if [ ! -f "package.json" ]; then
    npm create vite@latest . -- --template react --yes 2>/dev/null || true
    npm install 2>/dev/null
    npm install -D tailwindcss postcss autoprefixer 2>/dev/null
    npx tailwindcss init -p 2>/dev/null || true
    echo -e "${GREEN}      ✓ React + Vite + Tailwind installed${NC}"
else
    echo -e "${GRAY}      ~ Dashboard already exists, skipping${NC}"
fi

# ── 5. ENV FILE ─────────────────────────────────────────────
echo -e "${ORANGE}[5/6] Creating .env file...${NC}"
cd "$OS_ROOT"
if [ ! -f ".env" ]; then
    cat > .env << 'ENVEOF'
ANTHROPIC_API_KEY=your_api_key_here
OS_ROOT=/Users/yourname/CatalystOS
PORT_ORCHESTRATOR=8000
PORT_DASHBOARD=5173
ENVEOF
    echo -e "${GREEN}      ✓ .env created — add your ANTHROPIC_API_KEY${NC}"
else
    echo -e "${GRAY}      ~ .env already exists, skipping${NC}"
fi

# ── 6. BOOT SCRIPT ──────────────────────────────────────────
echo -e "${ORANGE}[6/6] Writing boot.sh...${NC}"
cat > "$OS_ROOT/boot.sh" << 'BOOTEOF'
#!/bin/bash
# CATALYST OS — Daily Boot Script
ORANGE='\033[0;33m'
GREEN='\033[0;32m'
GRAY='\033[0;37m'
NC='\033[0m'

OS_ROOT="$HOME/CatalystOS"
cd "$OS_ROOT"

# Load env
set -a; source .env; set +a

echo ""
echo -e "${ORANGE}⚡  CATALYST OS BOOTING...${NC}"
echo ""

# Kill any existing processes on the ports
lsof -ti:8000 | xargs kill -9 2>/dev/null || true
lsof -ti:5173 | xargs kill -9 2>/dev/null || true

# Boot orchestrator
echo -e "${GRAY}    Starting orchestrator...${NC}"
cd "$OS_ROOT/agents/orchestrator"
source venv/bin/activate
nohup uvicorn main:app --host 0.0.0.0 --port 8000 --reload > "$OS_ROOT/logs/orchestrator.log" 2>&1 &
deactivate

# Boot dashboard
echo -e "${GRAY}    Starting dashboard...${NC}"
cd "$OS_ROOT/dashboard"
nohup npm run dev > "$OS_ROOT/logs/dashboard.log" 2>&1 &

sleep 2
echo ""
echo -e "${GREEN}  ✓  Orchestrator  →  http://localhost:8000${NC}"
echo -e "${GREEN}  ✓  Dashboard     →  http://localhost:5173${NC}"
echo -e "${GREEN}  ✓  Claude Code   →  cd ~/CatalystOS && claude${NC}"
echo ""
echo -e "${GRAY}  Logs: ~/CatalystOS/logs/${NC}"
echo -e "${GRAY}  CLI:  cd ~/CatalystOS/agents/orchestrator && python cli.py status${NC}"
echo ""
BOOTEOF

chmod +x "$OS_ROOT/boot.sh"
mkdir -p "$OS_ROOT/logs"
echo -e "${GREEN}      ✓ boot.sh ready${NC}"

# ── DONE ────────────────────────────────────────────────────
echo ""
echo -e "${ORANGE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${GREEN}  CATALYST OS INSTALLED → $OS_ROOT${NC}"
echo -e "${ORANGE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""
echo -e "  ${ORANGE}NEXT STEPS:${NC}"
echo -e "  ${GRAY}1. Add your API key:${NC}"
echo -e "     nano $OS_ROOT/.env"
echo -e "     ${GRAY}→ Set ANTHROPIC_API_KEY=sk-ant-...${NC}"
echo ""
echo -e "  ${GRAY}2. Boot the OS:${NC}"
echo -e "     $OS_ROOT/boot.sh"
echo ""
echo -e "  ${GRAY}3. Open Claude Code with full context:${NC}"
echo -e "     cd $OS_ROOT && claude"
echo ""
echo -e "  ${GRAY}4. Check CLI:${NC}"
echo -e "     cd $OS_ROOT/agents/orchestrator"
echo -e "     source venv/bin/activate"
echo -e "     python cli.py status"
echo ""
