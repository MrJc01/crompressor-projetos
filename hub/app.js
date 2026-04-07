// ============================================================================
// Crompressor Projetos — Hub Central App
// Populates the grid cards and animates the background
// ============================================================================

// --- Data ---
const simulators = [
  {
    num: '01',
    title: 'Quantum Circuit Simulator',
    desc: 'Simulador de circuitos quânticos com 8 qubits, portas Hadamard, CNOT, X, Z, T e visualização da esfera de Bloch em tempo real.',
    icon: '⚛️',
    tags: ['web', 'sim'],
    href: '../simuladores/01-quantum-circuit/index.html',
    accent: '#4466ff'
  },
  {
    num: '02',
    title: 'Neural Network Live Training',
    desc: 'Treinamento ao vivo de rede neural. Visualize pesos, gradientes e loss convergindo em tempo real no canvas.',
    icon: '🧠',
    tags: ['web', 'ai'],
    href: '../simuladores/02-neural-network-training/index.html',
    accent: '#ff44aa'
  },
  {
    num: '03',
    title: '3D Fluid Dynamics',
    desc: 'Simulação de dinâmica de fluidos baseada nas equações de Navier-Stokes. Interaja com o fluido usando o mouse.',
    icon: '🌊',
    tags: ['web', 'gpu', 'sim'],
    href: '../simuladores/03-fluid-dynamics/index.html',
    accent: '#00d4ff'
  },
  {
    num: '04',
    title: 'Retro Game Engine',
    desc: 'Emulador de motor de jogos retro com sprite renderer, tile maps e input handling no browser.',
    icon: '🎮',
    tags: ['web', 'sim'],
    href: '../simuladores/04-retro-game-engine/index.html',
    accent: '#00ff88'
  },
  {
    num: '05',
    title: 'DNA Protein Folding',
    desc: 'Visualizador 3D de estruturas de proteínas e dobramento de DNA. Renderização molecular interativa.',
    icon: '🧬',
    tags: ['web', 'ai', 'sim'],
    href: '../simuladores/05-protein-folding/index.html',
    accent: '#8844ff'
  },
  {
    num: '06',
    title: 'Realtime Raytracer GPU',
    desc: 'Raytracer de tempo real usando WebGL. Reflexões, refrações e iluminação global no navegador.',
    icon: '💎',
    tags: ['web', 'gpu'],
    href: '../simuladores/06-raytracer/index.html',
    accent: '#ff8800'
  },
  {
    num: '07',
    title: 'Browser Operating System',
    desc: 'Sistema operacional completo rodando no browser. Gerenciador de janelas, terminal, file system virtual.',
    icon: '🖥️',
    tags: ['web', 'vfs'],
    href: '../simuladores/07-browser-os/index.html',
    accent: '#4466ff'
  },
  {
    num: '08',
    title: 'Particle Physics Collider',
    desc: 'Simulação de colisão de partículas subatômicas. Visualize quarks, bósons e detecção de eventos.',
    icon: '⚡',
    tags: ['web', 'sim', 'gpu'],
    href: '../simuladores/08-particle-collider/index.html',
    accent: '#ff44aa'
  },
  {
    num: '09',
    title: 'Galaxy N-Body Simulation',
    desc: 'Simulação gravitacional N-Body de galáxias. Milhares de estrelas interagindo gravitacionalmente.',
    icon: '🌌',
    tags: ['web', 'gpu', 'sim'],
    href: '../simuladores/09-galaxy-sim/index.html',
    accent: '#8844ff'
  },
  {
    num: '10',
    title: 'Artificial Life Evolution',
    desc: 'Simulação de vida artificial com evolução genética. Organismos competem, reproduzem e mutam.',
    icon: '🦠',
    tags: ['web', 'ai', 'sim'],
    href: '../simuladores/10-artificial-life/index.html',
    accent: '#00ff88'
  },
  {
    num: '11',
    title: 'CROM LLM Engine',
    desc: 'Motor interativo demonstrando compressão semântica CROM aplicada a tokens de LLM. Codebook visual.',
    icon: '🔮',
    tags: ['web', 'ai', 'vfs'],
    href: '../simuladores/11-crom-engine/index.html',
    accent: '#00d4ff'
  }
];

const projects = [
  {
    num: 'P1',
    title: 'Compressão de Logs',
    desc: 'Benchmark completo: gera logs sintéticos, treina codebook e compara Crompressor vs gzip vs zstd com relatório automático.',
    icon: '📊',
    tags: ['cli', 'sim'],
    href: '../projetos/compressao-logs/',
    accent: '#ff8800'
  },
  {
    num: 'P2',
    title: 'Docker VFS Cascade',
    desc: 'Cascata FUSE de 3 camadas: .crom → CROM VFS → OverlayFS → docker build → docker run.',
    icon: '🐳',
    tags: ['cli', 'vfs'],
    href: '../projetos/docker-vfs/',
    accent: '#4466ff'
  },
  {
    num: 'P3',
    title: 'Minecraft Launcher',
    desc: 'Minecraft Zero-RAM via CROM VFS. O jogo roda sobre sistema de arquivos comprimido paginado.',
    icon: '🎮',
    tags: ['cli', 'vfs'],
    href: '../projetos/minecraft-launcher/',
    accent: '#00ff88'
  },
  {
    num: 'P4',
    title: 'LLM Compressor',
    desc: 'Comprime modelos GGUF/Safetensors usando codebook treinado em pesos de IA. Mede impacto no carregamento.',
    icon: '🤖',
    tags: ['cli', 'ai'],
    href: '../projetos/llm-compressor/',
    accent: '#ff44aa'
  },
  {
    num: 'P5',
    title: 'Benchmark Suite',
    desc: 'Suíte automatizada de benchmarks com relatório HTML. Testa todos os cenários de compressão.',
    icon: '📈',
    tags: ['cli', 'sim'],
    href: '../projetos/benchmark-suite/',
    accent: '#8844ff'
  }
];

// --- Render Cards ---
function createCard(item) {
  const card = document.createElement('a');
  card.className = 'card';
  card.href = item.href;
  card.style.setProperty('--card-accent', item.accent);

  card.innerHTML = `
    <div class="card-header">
      <div class="card-icon" style="background: ${item.accent}15; border-color: ${item.accent}30;">
        ${item.icon}
      </div>
      <div>
        <div class="card-num">${item.num}</div>
        <div class="card-title">${item.title}</div>
      </div>
    </div>
    <div class="card-desc">${item.desc}</div>
    <div class="card-tags">
      ${item.tags.map(t => `<span class="tag ${t}">${t}</span>`).join('')}
    </div>
  `;

  return card;
}

function populateGrid(containerId, items) {
  const grid = document.getElementById(containerId);
  items.forEach(item => grid.appendChild(createCard(item)));
}

populateGrid('sim-grid', simulators);
populateGrid('proj-grid', projects);

// --- Animated Background ---
const canvas = document.getElementById('bg-canvas');
const ctx = canvas.getContext('2d');
let W, H;

function resize() {
  W = canvas.width = window.innerWidth;
  H = canvas.height = window.innerHeight;
}
resize();
window.addEventListener('resize', resize);

// Particle system for background
const bgParticles = [];
const PARTICLE_COUNT = 80;

for (let i = 0; i < PARTICLE_COUNT; i++) {
  bgParticles.push({
    x: Math.random() * W,
    y: Math.random() * H,
    vx: (Math.random() - 0.5) * 0.3,
    vy: (Math.random() - 0.5) * 0.3,
    r: Math.random() * 2 + 0.5,
    hue: 220 + Math.random() * 40,
    alpha: Math.random() * 0.3 + 0.1
  });
}

function drawBackground() {
  ctx.clearRect(0, 0, W, H);

  // Draw connections between close particles
  for (let i = 0; i < bgParticles.length; i++) {
    for (let j = i + 1; j < bgParticles.length; j++) {
      const dx = bgParticles[i].x - bgParticles[j].x;
      const dy = bgParticles[i].y - bgParticles[j].y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < 150) {
        const alpha = (1 - dist / 150) * 0.08;
        ctx.strokeStyle = `rgba(100, 130, 255, ${alpha})`;
        ctx.lineWidth = 0.5;
        ctx.beginPath();
        ctx.moveTo(bgParticles[i].x, bgParticles[i].y);
        ctx.lineTo(bgParticles[j].x, bgParticles[j].y);
        ctx.stroke();
      }
    }
  }

  // Draw and update particles
  bgParticles.forEach(p => {
    p.x += p.vx;
    p.y += p.vy;

    // Wrap around
    if (p.x < 0) p.x = W;
    if (p.x > W) p.x = 0;
    if (p.y < 0) p.y = H;
    if (p.y > H) p.y = 0;

    ctx.beginPath();
    ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
    ctx.fillStyle = `hsla(${p.hue}, 60%, 70%, ${p.alpha})`;
    ctx.fill();
  });

  requestAnimationFrame(drawBackground);
}

drawBackground();
