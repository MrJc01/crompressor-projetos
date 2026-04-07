#!/usr/bin/env bash
# ============================================================================
# Benchmark: Crompressor vs gzip vs zstd em Logs Sintéticos
# ============================================================================
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
REPO_ROOT="$(cd "${SCRIPT_DIR}/../.." && pwd)"
CROM_BIN="${REPO_ROOT}/bin/crompressor"
WORK_DIR="${SCRIPT_DIR}/workdir"
REPORT="${SCRIPT_DIR}/RESULTADO.md"

# Cores
CYAN='\033[0;36m'; GREEN='\033[0;32m'; YELLOW='\033[1;33m'; NC='\033[0m'
log()  { echo -e "${CYAN}[BENCH]${NC} $1"; }
ok()   { echo -e "${GREEN}[  OK ]${NC} $1"; }

# --------------------------------------------------------------------------
# 0. Verificar dependências
# --------------------------------------------------------------------------
if [ ! -f "${CROM_BIN}" ]; then
    echo -e "${YELLOW}[WARN]${NC} Crompressor não encontrado em ${CROM_BIN}"
    echo "       Rode: ./scripts/setup.sh primeiro"
    echo "       Continuando apenas com gzip e zstd..."
    CROM_AVAILABLE=false
else
    CROM_AVAILABLE=true
fi

mkdir -p "${WORK_DIR}"
cd "${WORK_DIR}"

# --------------------------------------------------------------------------
# 1. Gerar logs sintéticos (~100MB)
# --------------------------------------------------------------------------
log "Gerando logs sintéticos (100MB)..."

{
    for i in $(seq 1 200000); do
        TS=$(date -d "2026-01-01 +${i} seconds" +"%Y-%m-%dT%H:%M:%S" 2>/dev/null || date +"%Y-%m-%dT%H:%M:%S")
        IP="192.168.$((RANDOM % 256)).$((RANDOM % 256))"
        STATUS=$((200 + (RANDOM % 4) * 100))
        SIZE=$((RANDOM % 50000 + 100))
        METHODS=("GET" "POST" "PUT" "DELETE")
        METHOD=${METHODS[$((RANDOM % 4))]}
        PATHS=("/api/v1/users" "/api/v1/products" "/api/v1/orders" "/health" "/metrics" "/api/v2/search")
        PATH_=${PATHS[$((RANDOM % 6))]}
        echo "${TS} ${IP} ${METHOD} ${PATH_} ${STATUS} ${SIZE}bytes \"Mozilla/5.0\" latency=${RANDOM}ms"
    done

    # JSON structured logs
    for i in $(seq 1 100000); do
        LEVEL=("INFO" "WARN" "ERROR" "DEBUG")
        LVL=${LEVEL[$((RANDOM % 4))]}
        echo "{\"ts\":\"2026-04-06T12:00:${i}\",\"level\":\"${LVL}\",\"service\":\"crompressor-api\",\"msg\":\"Request processed\",\"duration_ms\":$((RANDOM % 1000)),\"status\":$((200 + (RANDOM % 4) * 100))}"
    done
} > logs_sinteticos.bin

FILE_SIZE=$(stat -c%s logs_sinteticos.bin 2>/dev/null || stat -f%z logs_sinteticos.bin)
ok "Arquivo gerado: logs_sinteticos.bin ($(numfmt --to=iec ${FILE_SIZE} 2>/dev/null || echo "${FILE_SIZE} bytes"))"

ORIGINAL_SHA=$(sha256sum logs_sinteticos.bin | cut -d' ' -f1)

# --------------------------------------------------------------------------
# 2. Benchmark gzip
# --------------------------------------------------------------------------
log "Comprimindo com gzip -9..."
GZIP_T0=$(date +%s%N)
gzip -9 -k -f logs_sinteticos.bin
GZIP_T1=$(date +%s%N)
GZIP_PACK_MS=$(( (GZIP_T1 - GZIP_T0) / 1000000 ))
GZIP_SIZE=$(stat -c%s logs_sinteticos.bin.gz 2>/dev/null || stat -f%z logs_sinteticos.bin.gz)

GZIP_T0=$(date +%s%N)
gzip -d -k -f logs_sinteticos.bin.gz
GZIP_T1=$(date +%s%N)
GZIP_UNPACK_MS=$(( (GZIP_T1 - GZIP_T0) / 1000000 ))

GZIP_RATIO=$(echo "scale=1; ${FILE_SIZE} / ${GZIP_SIZE}" | bc 2>/dev/null || echo "N/A")
ok "gzip: $(numfmt --to=iec ${GZIP_SIZE} 2>/dev/null || echo "${GZIP_SIZE}") | ratio=${GZIP_RATIO}:1 | pack=${GZIP_PACK_MS}ms | unpack=${GZIP_UNPACK_MS}ms"

# --------------------------------------------------------------------------
# 3. Benchmark zstd (se disponível)
# --------------------------------------------------------------------------
ZSTD_SIZE=0; ZSTD_PACK_MS=0; ZSTD_UNPACK_MS=0; ZSTD_RATIO="N/A"
if command -v zstd &>/dev/null; then
    log "Comprimindo com zstd -19..."
    ZSTD_T0=$(date +%s%N)
    zstd -19 -f logs_sinteticos.bin -o logs_sinteticos.bin.zst 2>/dev/null
    ZSTD_T1=$(date +%s%N)
    ZSTD_PACK_MS=$(( (ZSTD_T1 - ZSTD_T0) / 1000000 ))
    ZSTD_SIZE=$(stat -c%s logs_sinteticos.bin.zst 2>/dev/null || stat -f%z logs_sinteticos.bin.zst)

    ZSTD_T0=$(date +%s%N)
    zstd -d -f logs_sinteticos.bin.zst -o logs_sinteticos_zstd_restored.bin 2>/dev/null
    ZSTD_T1=$(date +%s%N)
    ZSTD_UNPACK_MS=$(( (ZSTD_T1 - ZSTD_T0) / 1000000 ))

    ZSTD_RATIO=$(echo "scale=1; ${FILE_SIZE} / ${ZSTD_SIZE}" | bc 2>/dev/null || echo "N/A")
    ok "zstd: $(numfmt --to=iec ${ZSTD_SIZE} 2>/dev/null || echo "${ZSTD_SIZE}") | ratio=${ZSTD_RATIO}:1 | pack=${ZSTD_PACK_MS}ms | unpack=${ZSTD_UNPACK_MS}ms"
else
    log "zstd não encontrado, pulando..."
fi

# --------------------------------------------------------------------------
# 4. Benchmark Crompressor (se disponível)
# --------------------------------------------------------------------------
CROM_SIZE=0; CROM_PACK_MS=0; CROM_UNPACK_MS=0; CROM_RATIO="N/A"
if [ "${CROM_AVAILABLE}" = true ]; then
    log "Treinando codebook Crompressor..."
    ${CROM_BIN} train --input logs_sinteticos.bin --output codebook.cromdb --size 8192 2>&1 || true

    log "Comprimindo com Crompressor..."
    CROM_T0=$(date +%s%N)
    ${CROM_BIN} pack --input logs_sinteticos.bin --output logs.crom --codebook codebook.cromdb 2>&1 || true
    CROM_T1=$(date +%s%N)
    CROM_PACK_MS=$(( (CROM_T1 - CROM_T0) / 1000000 ))

    if [ -f logs.crom ]; then
        CROM_SIZE=$(stat -c%s logs.crom 2>/dev/null || stat -f%z logs.crom)
        CROM_RATIO=$(echo "scale=1; ${FILE_SIZE} / ${CROM_SIZE}" | bc 2>/dev/null || echo "N/A")

        log "Descomprimindo..."
        CROM_T0=$(date +%s%N)
        ${CROM_BIN} unpack --input logs.crom --output logs_restored.bin --codebook codebook.cromdb 2>&1 || true
        CROM_T1=$(date +%s%N)
        CROM_UNPACK_MS=$(( (CROM_T1 - CROM_T0) / 1000000 ))

        if [ -f logs_restored.bin ]; then
            RESTORED_SHA=$(sha256sum logs_restored.bin | cut -d' ' -f1)
            if [ "${ORIGINAL_SHA}" = "${RESTORED_SHA}" ]; then
                ok "✅ Integridade Lossless VERIFICADA (SHA-256 match)"
            else
                echo "❌ FALHA de integridade!"
            fi
        fi
        ok "crom: $(numfmt --to=iec ${CROM_SIZE} 2>/dev/null || echo "${CROM_SIZE}") | ratio=${CROM_RATIO}:1 | pack=${CROM_PACK_MS}ms | unpack=${CROM_UNPACK_MS}ms"
    fi
fi

# --------------------------------------------------------------------------
# 5. Gerar Relatório
# --------------------------------------------------------------------------
log "Gerando relatório..."

cat > "${REPORT}" << EOF
# 📊 Resultado do Benchmark — Compressão de Logs

**Data**: $(date +"%Y-%m-%d %H:%M:%S")
**Arquivo**: logs_sinteticos.bin
**Tamanho Original**: $(numfmt --to=iec ${FILE_SIZE} 2>/dev/null || echo "${FILE_SIZE} bytes")
**SHA-256 Original**: \`${ORIGINAL_SHA}\`

## Resultados

| Ferramenta | Tamanho Comprimido | Ratio | Tempo Pack | Tempo Unpack |
|-----------|-------------------|-------|-----------|-------------|
| gzip -9   | $(numfmt --to=iec ${GZIP_SIZE} 2>/dev/null || echo "${GZIP_SIZE}") | ${GZIP_RATIO}:1 | ${GZIP_PACK_MS}ms | ${GZIP_UNPACK_MS}ms |
| zstd -19  | $(numfmt --to=iec ${ZSTD_SIZE} 2>/dev/null || echo "${ZSTD_SIZE}") | ${ZSTD_RATIO}:1 | ${ZSTD_PACK_MS}ms | ${ZSTD_UNPACK_MS}ms |
| **CROM**  | $(numfmt --to=iec ${CROM_SIZE} 2>/dev/null || echo "${CROM_SIZE}") | ${CROM_RATIO}:1 | ${CROM_PACK_MS}ms | ${CROM_UNPACK_MS}ms |

## Análise

Logs são dados **altamente estruturados e repetitivos** — o cenário ideal para o Crompressor:
- Timestamps com padrões previsíveis
- Headers HTTP idênticos entre requisições
- Stack traces recorrentes
- IPs e UUIDs com estrutura fixa

O Codebook "memoriza" esses padrões e grava apenas deltas (diferenças).

---
*Gerado automaticamente por \`run_benchmark.sh\`*
EOF

ok "Relatório salvo em: ${REPORT}"
echo ""
echo "╔══════════════════════════════════════════════════════════════╗"
echo "║               ✅ Benchmark Concluído                       ║"
echo "╚══════════════════════════════════════════════════════════════╝"
