#!/usr/bin/env bash
# ============================================================================
# Crompressor Projetos — Setup Automático
# ============================================================================
# Este script clona o Crompressor (main), compila o binário e valida
# que todas as dependências estão presentes para rodar os projetos.
# ============================================================================
set -euo pipefail

REPO_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
CROM_DIR="${REPO_ROOT}/.crompressor"
BIN_DIR="${REPO_ROOT}/bin"

# Cores
RED='\033[0;31m'
GREEN='\033[0;32m'
CYAN='\033[0;36m'
YELLOW='\033[1;33m'
NC='\033[0m'

log()   { echo -e "${CYAN}[SETUP]${NC} $1"; }
ok()    { echo -e "${GREEN}[  OK ]${NC} $1"; }
warn()  { echo -e "${YELLOW}[WARN ]${NC} $1"; }
fail()  { echo -e "${RED}[FAIL ]${NC} $1"; exit 1; }

echo ""
echo "╔══════════════════════════════════════════════════════════════╗"
echo "║       🧬 Crompressor Projetos — Setup Automático           ║"
echo "╚══════════════════════════════════════════════════════════════╝"
echo ""

# --------------------------------------------------------------------------
# 1. Verificar Go
# --------------------------------------------------------------------------
log "Verificando Go..."
if command -v go &>/dev/null; then
    GO_VERSION=$(go version | grep -oP 'go\d+\.\d+')
    ok "Go encontrado: $(go version)"
else
    warn "Go não encontrado. O binário do crompressor não será compilado."
    warn "Instale Go 1.22+ de https://go.dev/dl/"
    GO_VERSION=""
fi

# --------------------------------------------------------------------------
# 2. Clonar Crompressor (main)
# --------------------------------------------------------------------------
if [ -d "${CROM_DIR}" ]; then
    log "Crompressor já clonado. Atualizando..."
    cd "${CROM_DIR}"
    git pull --ff-only 2>/dev/null || warn "Não foi possível atualizar (offline?)"
    cd "${REPO_ROOT}"
else
    log "Clonando Crompressor (branch main)..."
    git clone --branch main --depth 1 https://github.com/MrJc01/crompressor.git "${CROM_DIR}"
    ok "Clone concluído."
fi

# --------------------------------------------------------------------------
# 3. Compilar binário
# --------------------------------------------------------------------------
if [ -n "${GO_VERSION}" ]; then
    log "Compilando crompressor..."
    cd "${CROM_DIR}"
    mkdir -p "${BIN_DIR}"
    go build -o "${BIN_DIR}/crompressor" ./cmd/crompressor/ 2>&1 || {
        warn "Compilação falhou. Tentando make build..."
        make build 2>&1 && cp -f ./bin/crompressor "${BIN_DIR}/crompressor" || fail "Compilação falhou."
    }
    ok "Binário: ${BIN_DIR}/crompressor"
    cd "${REPO_ROOT}"
else
    warn "Pulando compilação (Go não disponível)."
fi

# --------------------------------------------------------------------------
# 4. Verificar Python (para servidor web local)
# --------------------------------------------------------------------------
log "Verificando Python3..."
if command -v python3 &>/dev/null; then
    ok "Python3 encontrado: $(python3 --version)"
else
    warn "Python3 não encontrado. Servidor web local não disponível."
fi

# --------------------------------------------------------------------------
# 5. Verificar FUSE (para projetos VFS)
# --------------------------------------------------------------------------
log "Verificando FUSE..."
if command -v fusermount &>/dev/null || command -v fusermount3 &>/dev/null; then
    ok "FUSE encontrado."
else
    warn "FUSE não encontrado. Projetos VFS não funcionarão."
    warn "Instale com: sudo apt install fuse3 libfuse3-dev"
fi

# --------------------------------------------------------------------------
# 6. Resumo
# --------------------------------------------------------------------------
echo ""
echo "╔══════════════════════════════════════════════════════════════╗"
echo "║                    ✅ Setup Concluído                       ║"
echo "╠══════════════════════════════════════════════════════════════╣"
echo "║                                                            ║"
echo "║  Simuladores Web:                                         ║"
echo "║    cd ${REPO_ROOT} && python3 -m http.server 8091         ║"
echo "║    Abra: http://localhost:8091/hub/                        ║"
echo "║                                                            ║"
if [ -f "${BIN_DIR}/crompressor" ]; then
echo "║  Crompressor CLI:                                         ║"
echo "║    ${BIN_DIR}/crompressor --help                          ║"
echo "║                                                            ║"
fi
echo "╚══════════════════════════════════════════════════════════════╝"
echo ""
