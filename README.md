# 🧬 Crompressor Web Ecosystem & WASM Explorer

<div align="center">

![Crompressor Version](https://img.shields.io/badge/Version-V4.3_Cognitive-9d4edd)
![WASM](https://img.shields.io/badge/Powered_by-WebAssembly-00d2ff)
![Status](https://img.shields.io/badge/Status-Pesquisa_%26_Desenvolvimento-00ff88)

**O "Porto de Entrada" Definitivo para a Compressão Semântica O(1).**
Nenhuma linha de Go precisa ser instalada. Teste o motor no limiar da física direto no seu navegador.
</div>

---

## 📖 A Revolução (The Story)

A compressão mecânica (como WinRAR, ZIP, gzip) bateu no teto. Ela se baseia na **Barreira de Shannon** (probabilidade de frequência de repetição de bytes). Se você tentar comprimir dados massivos de alta entropia, o limite teórico físico impede que você ganhe espaço. 

Mas e se o arquivo não fosse apenas uma sequência "fria" de bytes? E se o compressor fosse um **Cérebro (Multi-Brain)** que, conhecendo a semântica de um conjunto de dados, pudesse trocar Arquivos por "Sementes de Memória" (DNA Tensorial)?

É aqui que entra a engine **Crompressor**. 

Nós reconstruímos a biblioteca nativa pesada escrita em Go pura sob uma arquitetura de banco de dados *Locality-Sensitive Hashing* e *Cosine Similarity* — e depois passamos tudo isso para **WebAssembly (WASM)**.

Este repositório (`crompressor-projetos`) não é apenas um "showcase". É a **Janela de Vidro do Laboratório de P&D**, onde você pode torturar, benchmarkar e testar os limites físicos da memória randômica, computação distribuída, forense e matemática fractal, utilizando nosso motor sem gravar 1MB no seu disco rígido local, tudo hospedado com interface limpa Web.

---

## 🚀 Por onde Começar? (Top Demos)

Se você acabou de chegar, vá direto para o hub mestre `/hub/index.html` ou clique nos Laboratórios recomendados abaixo. **Nós não usamos dados falsos (Mocks).** Cada byte na tela atravessa nossa engine genuína.

### 🥇 1. CROM-IA Cognitive Trainer (Lab 25)
*(A quebra da Barreira de Shannon)*
Demonstração brutal da transição do LSH (Mecânico) para o Codebook Semântico. Jogue pastas de arquivos altamente caóticos (Videoclipes em MP4, imagens). Veja o ZIP mecânico relatar `1.00:1` (0% de ganho), enquanto a CROM-IA estuda seus arquivos e os substitui por **Tokens Semânticos (⌬)**, enviando a compressão para escalas imensas de `1000:1`.
👉 [Acessar Lab 25](./simuladores/25-cognitive-codebook-trainer/index.html)

### 🔬 2. CROM File Forensics (Lab 22)
*(Autópsia Byte-a-Byte)*
Se você tem dúvidas da veracidade da engine, jogue um arquivo PDF ou código fonte aqui. Ele levantará um *Raio-X visual e matemático* calculando Entropia de Shannon no frontend e medindo o impacto do Dicionário CROM nativo. Ideal para testar a heurística "High-Entropy Bypass" do motor.
👉 [Acessar Lab 22](./simuladores/22-crom-file-forensics/index.html)

### 🌌 3. Galaxy N-Body Sim (Lab 09)
*(Estresse Extremo de Frequência)*
Testando acesso FUSE O(1) e processamento contínuo: mil corpos celestes interagindo, e a cada 2 segundos a árvore de Tensores/Framebuffers está sendo engolida pela `cromBridge.compress()` sem que o seu FPS de GPU caia no navegador.
👉 [Acessar Lab 09](./simuladores/09-galaxy-sim/index.html)

### ⚡ 4. Live Codec (Lab 24)
Comprima *keystroke por keystroke*. Enquanto você digita seu texto ou joga uma imagem na tela, o WASM core avalia os deltas e empacota em tempo real com under-5ms overhead.
👉 [Acessar Lab 24](./simuladores/24-live-codec/index.html)

---

## 🛠️ Como Iniciar Localmente (Quick Start)

Rodar este laboratório exige rigorosamente que os arquivos sejam servidos via protocolo HTTP/HTTPS devido às políticas de segurança restritas do navegador sobre execução WebAssembly (`.wasm`).

Para levantar o Ecossistema agora:

**1. Clone o repositório:**
\`\`\`bash
git clone https://github.com/MrJc01/crompressor-projetos.git
cd crompressor-projetos
\`\`\`

**2. Suba um servidor estático local** (Mantenha a porta 8091 recomendada):
*Se tiver Python instalado:*
\`\`\`bash
python3 -m http.server 8091
\`\`\`
*Se tiver Node (npx) instalado:*
\`\`\`bash
npx serve -l 8091
\`\`\`

**3. Acesse o Hub Front Page:**
No seu navegador, abra [http://localhost:8091/hub/index.html](http://localhost:8091/hub/index.html).

---

## 🧩 Como a Arquitetura Funciona? (The Engine)

Por baixo desse acabamento visual (CSS UI), este repositório possui dois pilares inquebráveis:

- **12-crom-wasm-core:** A alma bruta (`crompressor.wasm`). Ela foi compilada diretamente da branch do repositório backend Go original.  
- **A `crom-bridge.js`:** Um protocolo universal (middleware) injetado em cada um dos simuladores. Ela ativa um painel flutuante de SRE-Monitor (Métricas) persistente e orquestra a passagem do Javascript (`Uint8Array`) para o Heap de Memória do Sandbox WebAssembly (`window.cromPack(buffer)`).

Sempre que a interface mostra dados de compressão (seja processamento P2P, simuladores termodinâmicos, dedup, etc), ela **nunca usa escalonamento ou `Math.random` matemático fajuto.** Ela executa a mesma exata criptografia determinística que a CLI FUSE executaria em ambiente Linux.

---

## 🤝 Oportunidades de Contribuição

Achou o projeto ambicioso ou promissor? Este repositório ainda é P&D vivo. Precisamos de cérebros excepcionais para:

- **WASM Memory Profiling:** Analisar o garbage collector entre os Canvas Uints do JS caindo no Go. 
- **WebGL/ThreeJS Wizards:** Modernizar simuladores de Física/Gráficos pesados (Raytracer, Bio-Proteínas) para injetar ainda mais matrizes de entropia severas no Cérebro.
- **Data UX Engineers:** Mapear mais ferramentas SRE, logs visuais, simuladores de trânsito Kubernetes e DB Overhead, convertendo arrays de dados massivos na UI para o motor digerir sob alta pressão FUSE O(1).

Submeta seu PR num experimento e expanda nosso Laboratório!

---

## 🗂️ Tabela Rápida de Módulos P&D

Para detalhes isolados de cada engine gráfica, consulte o `README.md` mergulhados dentro das pastas!

| ID | Laboratório de Pesquisa | Resumo Semântico do que é testado |
|:---|:---|:---|
| 01 | **Quantum Circuit** | Matrizes de Estado Quântico / Entropia Pura |
| 02 | **Neural Network** | Deltas diminutos em Tensores Perceptron |
| 03 | **Fluid Dynamics** | Malhas Iterativas (Navier-Stokes Compressibility) |
| 04 | **Retro Game Engine** | VRAM Grafica (Baixa Entropia Dicionária) |
| 05 | **Protein Folding** | Cadeias Estruturais Biológicas Extensas |
| 06 | **Raytracer** | Mapeamento Pseudoaleatório e Rendering em lote |
| 07 | **Browser OS** | FUSE Engine e Abstração de DOM Nodes |
| 08 | **Particle Collider** | Geração e Chunking Semântico de Telemetria Contínua |
| 09 | **Galaxy Sim** | Arrays Otimizados sob alto estresse de memória (N-Body) |
| 10 | **Artificial Life** | Fractais Célulóides (Teoria Alta Dedup) |
| 11 | **Crom Engine** | Frontend Dashboard Clássico de Gerência Básica |
| 12 | **WASM Core** | Área de Sandbox do Compilador Nativo |
| 13 | **WASM Deduplicator** | Inspeção visual dos Blocos Identificados O(1) Inline |
| 14 | **Parametric Cloner** | Simulação Algoritmica de Metadados Recursivos |
| 15 | **P2P Semantic Torrent** | Distribuição de Codebooks pela camada de Rede Hash |
| 16 | **CROM Diff Viewer** | Avaliação do Output Base16/Hex da Arquitetura CROM |
| 17 | **LLM Pager** | Carregamento (Paging FUSE) para modelos de Linguagem |
| 18 | **CROM Dash Player** | Processamento de buffers pesados de streaming H.264/WebM |
| 19 | **DB Zero Overhead** | Redução JSON/Relacional massiva nas camadas DB |
| 20 | **Fractal Explorer** | Alta Geração Flutuante Recursiva para teste base matemático |
| 21 | **Web Drive** | Gerenciador de Arquivos Simulado para montagens CROM dinâmicas |
| 22 | **File Forensics** | Raio-X byte-a-byte testando limiar de Shannon via drag'n'drop |
| 23 | **Entropy Scanner** | Heatmap visual das matrizes de baixa/alta compressibilidade |
| 24 | **Live Codec** | Análise latencial (under-10ms) teclado a teclado via Wasm |
| 25 | **Cognitive Trainer** | Multibrain LSH. A glória da redução por DNA-Seeds ⌬ |

[**< Back to MrJc01/crompressor Original Engine**](https://github.com/MrJc01/crompressor)
