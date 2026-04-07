const go = new Go(); // Provido por wasm_exec.js
const statusEl = document.getElementById('status');
const inputEl = document.getElementById('input');
const outputEl = document.getElementById('output');
const packBtn = document.getElementById('packBtn');

// Função auxiliar para inicializar
async function initWasm() {
    try {
        const response = await fetch('crompressor.wasm');
        const wasmObj = await WebAssembly.instantiateStreaming(response, go.importObject);
        go.run(wasmObj.instance); // Inicia runtime Go silenciosamente

        statusEl.textContent = 'Status: ✅ WASM Core Inicializado e Pronto!';
        statusEl.style.color = '#00ff88';
        packBtn.disabled = false;
        
        console.log("Crompressor WASM Binding Injetado.");
    } catch (e) {
        statusEl.textContent = 'Status: ❌ Erro ao instanciar WASM: ' + e;
        console.error(e);
    }
}

initWasm();

packBtn.addEventListener('click', () => {
    let rawText = inputEl.value;
    if (!rawText) return;

    // Converte String JSON/Texto para Uint8Array para cruzar a ponte WASM sem vazamento
    const encoder = new TextEncoder();
    const uint8Raw = encoder.encode(rawText);

    const startTime = performance.now();
    
    // CHAMADA GO NATIVA VIA JS BINDING 🚀
    const result = window.cromPack(uint8Raw);
    
    const endTime = performance.now();
    const duration = (endTime - startTime).toFixed(3);

    let hexStr = Array.from(result.data).map(b => b.toString(16).padStart(2, '0')).join(' ');

    const readout = `
⏱ Tempo WASM: ${duration} ms
📦 Tamanho Orig: ${result.originalSize} bytes
🗜 Tamanho CROM: ${result.cromSize} bytes
🔑 SHA-256 Hash: ${result.hash}

(0x) Hex Payload da B-Tree:
${hexStr.slice(0, 500)}${result.cromSize > 250 ? '...' : ''}
    `.trim();

    outputEl.value = readout;
});
