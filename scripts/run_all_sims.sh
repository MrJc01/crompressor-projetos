#!/usr/bin/env bash
# ============================================================================
# Levanta servidor HTTP local para acessar todos os simuladores
# ============================================================================
set -euo pipefail

REPO_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
PORT="${1:-8091}"

echo ""
echo "🚀 Levantando servidor de simuladores na porta ${PORT}..."
echo ""
echo "   Hub Central:    http://localhost:${PORT}/hub/"
echo ""
echo "   Simuladores Web (1 a 11):"
echo "   01 Quantum Circuit:      http://localhost:${PORT}/simuladores/01-quantum-circuit/"
echo "   02 Neural Network:       http://localhost:${PORT}/simuladores/02-neural-network-training/"
echo "   03 Fluid Dynamics:       http://localhost:${PORT}/simuladores/03-fluid-dynamics/"
echo "   04 Retro Game Engine:    http://localhost:${PORT}/simuladores/04-retro-game-engine/"
echo "   05 Protein Folding:      http://localhost:${PORT}/simuladores/05-protein-folding/"
echo "   06 Raytracer GPU:        http://localhost:${PORT}/simuladores/06-raytracer/"
echo "   07 Browser OS:           http://localhost:${PORT}/simuladores/07-browser-os/"
echo "   08 Particle Collider:    http://localhost:${PORT}/simuladores/08-particle-collider/"
echo "   09 Galaxy Sim:           http://localhost:${PORT}/simuladores/09-galaxy-sim/"
echo "   10 Artificial Life:      http://localhost:${PORT}/simuladores/10-artificial-life/"
echo "   11 CROM Engine:          http://localhost:${PORT}/simuladores/11-crom-engine/"
echo ""
echo "   🔥 WebAssembly / Projetos Extremos (12 a 15):"
echo "   12 WASM Core Sandbox:    http://localhost:${PORT}/simuladores/12-crom-wasm-core/"
echo "   13 OPFS Deduplicator:    http://localhost:${PORT}/simuladores/13-wasm-deduplicator/"
echo "   14 Parametric Cloner:    http://localhost:${PORT}/simuladores/14-parametric-cloner/"
echo "   15 P2P Torrent Semântico:http://localhost:${PORT}/simuladores/15-p2p-semantic-torrent/"
echo ""
echo "   Ctrl+C para parar."
echo ""

cd "${REPO_ROOT}"
python3 -m http.server "${PORT}"
