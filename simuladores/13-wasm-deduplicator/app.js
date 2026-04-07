const dropzone = document.getElementById('dropzone');
const rawSizeEl = document.getElementById('rawSize');
const cromSizeEl = document.getElementById('cromSize');
const ratioEl = document.getElementById('ratio');
const logEl = document.getElementById('log');

const canvas = document.getElementById('visualizer');
const ctx = canvas.getContext('2d');
let W, H;

function resize() {
    W = canvas.width = canvas.parentElement.clientWidth;
    H = canvas.height = canvas.parentElement.clientHeight;
}
window.addEventListener('resize', resize);
resize();

// Visual state
let ingestedNodes = [];
let deduplicatedLinks = [];
let totalRawBytes = 0;
let totalCromBytes = 0;
let hashDictionary = {}; // Hash → node index (dedup real via WASM hash)

// --- WASM Bridge Real ---
let wasmReady = false;

async function initWasm() {
    try {
        // Carrega o runtime Go WASM
        const script = document.createElement('script');
        script.src = '../12-crom-wasm-core/wasm_exec.js';
        document.head.appendChild(script);
        await new Promise((resolve, reject) => { script.onload = resolve; script.onerror = reject; });

        const go = new Go();
        const response = await fetch('../12-crom-wasm-core/crompressor.wasm');
        const wasmObj = await WebAssembly.instantiateStreaming(response, go.importObject);
        go.run(wasmObj.instance);
        wasmReady = true;
        log("✅ WASM Bridge conectada (cromPack disponível)");
    } catch(e) {
        log("⚠️ WASM Fallback: " + e.message);
    }
}
initWasm();

function log(msg) {
    const el = document.createElement('div');
    el.textContent = `[OPFS] ${msg}`;
    logEl.appendChild(el);
    logEl.scrollTop = logEl.scrollHeight;
}

function formatBytes(bytes) {
    if(bytes === 0) return '0 Bytes';
    const k = 1024, dm = 2, sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

// Posicionamento determinístico baseado no hash do chunk
function hashToPosition(hash, index) {
    let x = 0, y = 0;
    for(let i = 0; i < Math.min(hash.length, 8); i++) {
        x += hash.charCodeAt(i);
        y += hash.charCodeAt(hash.length - 1 - i);
    }
    x = (x * 7 + index * 31) % W;
    y = (y * 13 + index * 17) % H;
    return { x, y };
}

async function processFile(file) {
    log(`Lendo: ${file.name} (${formatBytes(file.size)})`);
    totalRawBytes += file.size;

    const buffer = await file.arrayBuffer();
    const view = new Uint8Array(buffer);

    // Processa via WASM real
    if (wasmReady) {
        const t0 = performance.now();
        const result = window.cromPack(view);
        const elapsed = (performance.now() - t0).toFixed(2);

        log(`cromPack() → ${formatBytes(result.cromSize)} em ${elapsed}ms | Hash: ${result.hash.substring(0,12)}`);

        // Dedup determinística real: se o hash já existe, é duplicado
        if (hashDictionary[result.hash] !== undefined) {
            // DUPLICADO REAL — apenas ponteiro (4 bytes)
            const targetIdx = hashDictionary[result.hash];
            const pos = hashToPosition(result.hash, ingestedNodes.length);
            deduplicatedLinks.push({
                x1: pos.x, y1: pos.y,
                x2: ingestedNodes[targetIdx].x, y2: ingestedNodes[targetIdx].y,
                alpha: 1
            });
            totalCromBytes += 4; // Custo de um ponteiro int32
            log(`🔗 Dedup: ${file.name} → Ponteiro B-Tree (4 bytes)`);
        } else {
            // Chunk NOVO — registra no dicionário
            const idx = ingestedNodes.length;
            hashDictionary[result.hash] = idx;
            const pos = hashToPosition(result.hash, idx);
            const hue = (result.hash.charCodeAt(0) * 7 + result.hash.charCodeAt(1) * 13) % 360;
            ingestedNodes.push({ x: pos.x, y: pos.y, hue: hue });
            totalCromBytes += result.cromSize;
            log(`📦 Novo chunk único: ${formatBytes(result.cromSize)}`);
        }
    } else {
        // Fallback sem WASM: mostra tamanho bruto sem fingir compressão
        totalCromBytes += file.size;
        const idx = ingestedNodes.length;
        const pos = hashToPosition(file.name, idx);
        ingestedNodes.push({ x: pos.x, y: pos.y, hue: (idx * 47) % 360 });
        log(`⚠️ Sem WASM: ${file.name} armazenado sem compressão`);
    }

    // Atualiza métricas
    rawSizeEl.textContent = formatBytes(totalRawBytes);
    cromSizeEl.textContent = formatBytes(totalCromBytes);
    ratioEl.textContent = (totalRawBytes / Math.max(totalCromBytes, 1)).toFixed(2) + 'x';
}

// Drops
dropzone.addEventListener('dragover', (e) => {
    e.preventDefault();
    dropzone.classList.add('dragover');
});

dropzone.addEventListener('dragleave', () => {
    dropzone.classList.remove('dragover');
});

dropzone.addEventListener('drop', async (e) => {
    e.preventDefault();
    dropzone.classList.remove('dragover');

    log("Iniciando ingestão LSH...");

    if (e.dataTransfer.items) {
        for (let i = 0; i < e.dataTransfer.items.length; i++) {
            if (e.dataTransfer.items[i].kind === 'file') {
                const file = e.dataTransfer.items[i].getAsFile();
                await processFile(file);
            }
        }
    }
});

// Render Loop
function draw() {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.15)';
    ctx.fillRect(0, 0, W, H);

    ctx.lineWidth = 1;
    // Draw links (dedup connections)
    for(let i=deduplicatedLinks.length-1; i>=0; i--) {
        const link = deduplicatedLinks[i];
        ctx.strokeStyle = `rgba(102, 252, 241, ${link.alpha})`;
        ctx.beginPath();
        ctx.moveTo(link.x1, link.y1);
        ctx.lineTo(link.x2, link.y2);
        ctx.stroke();

        link.alpha -= 0.005; // fade out links slowly
        if(link.alpha <= 0) deduplicatedLinks.splice(i, 1);
    }

    // Draw unique chunk nodes (Codebook)
    ingestedNodes.forEach(node => {
        ctx.beginPath();
        ctx.arc(node.x, node.y, 4, 0, Math.PI*2);
        ctx.fillStyle = `hsl(${node.hue}, 80%, 60%)`;
        ctx.fill();
        ctx.shadowBlur = 10;
        ctx.shadowColor = ctx.fillStyle;
    });
    ctx.shadowBlur = 0;

    requestAnimationFrame(draw);
}

draw();
