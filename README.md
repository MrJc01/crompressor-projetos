# 🧬 Crompressor Projetos

> Simuladores, demos e projetos funcionais construídos sobre o **Motor de Compressão Semântica** [Crompressor](https://github.com/MrJc01/crompressor).

---

## ⚡ Quick Start

```bash
# Clone
git clone https://github.com/MrJc01/crompressor-projetos
cd crompressor-projetos

# Setup (clona e compila o Crompressor automaticamente)
chmod +x scripts/*.sh
./scripts/setup.sh

# Abrir Hub de Simuladores 
./scripts/run_all_sims.sh
# → http://localhost:8091/hub/
```

---

## 🌐 Simuladores Web

Simulações interativas rodando **direto no navegador** — zero dependências externas. Cada um é um `index.html` auto-contido.

| # | Simulador | Descrição |
|---|-----------|-----------|
| 01 | [Quantum Circuit](simuladores/01-quantum-circuit/) | Circuitos quânticos com 8 qubits, portas H/CNOT/X/Z/T e esfera de Bloch |
| 02 | [Neural Network Training](simuladores/02-neural-network-training/) | Treinamento ao vivo de rede neural com visualização de pesos e loss |
| 03 | [3D Fluid Dynamics](simuladores/03-fluid-dynamics/) | Navier-Stokes interativo — arraste o mouse para perturbar o fluido |
| 04 | [Retro Game Engine](simuladores/04-retro-game-engine/) | Emulador de motor de jogos retro com sprites e tile maps |
| 05 | [DNA Protein Folding](simuladores/05-protein-folding/) | Visualizador 3D de dobramento de proteínas e estruturas de DNA |
| 06 | [Realtime Raytracer](simuladores/06-raytracer/) | Ray tracing GPU via WebGL com reflexões e iluminação global |
| 07 | [Browser OS](simuladores/07-browser-os/) | Sistema operacional completo no browser com gerenciador de janelas |
| 08 | [Particle Collider](simuladores/08-particle-collider/) | Simulação de colisão de partículas subatômicas |
| 09 | [Galaxy N-Body Sim](simuladores/09-galaxy-sim/) | Simulação gravitacional com milhares de estrelas |
| 10 | [Artificial Life](simuladores/10-artificial-life/) | Vida artificial com evolução genética e mutação |
| 11 | [CROM LLM Engine](simuladores/11-crom-engine/) | Motor CROM interativo para compressão semântica de tokens LLM |

---

## 🛠️ Projetos Práticos

Projetos que utilizam a **CLI/SDK** do Crompressor em cenários reais.

| Projeto | Descrição | Requisitos |
|---------|-----------|------------|
| [Compressão de Logs](projetos/compressao-logs/) | Benchmark: Crompressor vs gzip vs zstd em logs sintéticos | Go, crompressor CLI |
| [Docker VFS](projetos/docker-vfs/) | Cascata FUSE: `.crom` → VFS → OverlayFS → Docker | FUSE, Docker |
| [Minecraft Launcher](projetos/minecraft-launcher/) | Minecraft Zero-RAM via CROM VFS paginado | FUSE, Java |
| [LLM Compressor](projetos/llm-compressor/) | Compressão de modelos GGUF/Safetensors | Go, crompressor CLI |
| [Benchmark Suite](projetos/benchmark-suite/) | Suíte automatizada com relatório HTML | Go, crompressor CLI |

---

## 📁 Estrutura

```
crompressor-projetos/
├── hub/                    # Website Hub Central (abra no browser)
├── simuladores/            # 11 simuladores web standalone
│   ├── 01-quantum-circuit/
│   ├── 02-neural-network-training/
│   ├── ...
│   └── 11-crom-engine/
├── projetos/               # Projetos práticos CLI/Shell
│   ├── compressao-logs/
│   ├── docker-vfs/
│   ├── minecraft-launcher/
│   ├── llm-compressor/
│   └── benchmark-suite/
├── pesquisa/               # Relatórios de P&D (110+ auditorias)
└── scripts/                # Scripts utilitários
    ├── setup.sh            # Setup automático
    └── run_all_sims.sh     # Servidor local de simuladores
```

---

## 🔗 Links

- **Crompressor Main**: [github.com/MrJc01/crompressor](https://github.com/MrJc01/crompressor)
- **Branch Dev (P&D)**: [github.com/MrJc01/crompressor/tree/dev](https://github.com/MrJc01/crompressor/tree/dev)
- **Documentação**: [docs/](https://github.com/MrJc01/crompressor/tree/main/docs)

---

## 📜 Licença

[MIT](https://github.com/MrJc01/crompressor/blob/main/LICENSE) © 2026 MrJc01

> *"Nós não comprimimos dados. Nós indexamos o universo."*
