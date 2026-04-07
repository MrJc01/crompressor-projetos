const logPanel = document.getElementById('logPanel');
const fileTableBody = document.getElementById('fileTableBody');
const fileInp = document.getElementById('fileInp');
const dropZone = document.getElementById('dropZone');

// Widgets do Storage Sidebar
const storageFill = document.getElementById('storageFill');
const pctText = document.getElementById('pctText');
const rawMetric = document.getElementById('rawMetric');
const cromMetric = document.getElementById('cromMetric');

// Dados Mestre do VFS Local
let totalOriginalBytes = 0;
let totalCromBytes = 0;
const MAX_QUOTA = 15 * 1024 * 1024 * 1024; // 15 GB local storage concept
let isFirstFile = true;

// Utility Utils
function formatBytes(bytes) {
    if (bytes === 0) return '0 B';
    const k = 1024, dm = 2, sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

function addToLog(msg, type="sys") {
    const el = document.createElement('div');
    el.className = `log-line ${type}`;
    el.innerHTML = msg;
    logPanel.appendChild(el);
    logPanel.scrollTop = logPanel.scrollHeight;
}

// ---------------------------------------------------------
// WASM BRIDGE INITIALIZATION
// ---------------------------------------------------------
const go = new Go(); 
let wasmReady = false;

async function initWasm() {
    try {
        const response = await fetch('../12-crom-wasm-core/crompressor.wasm');
        const wasmObj = await WebAssembly.instantiateStreaming(response, go.importObject);
        go.run(wasmObj.instance);
        wasmReady = true;
        addToLog("> Conexão WASM (Go Native): Status OK", "ok");
    } catch (e) {
        addToLog("> ERRO: Falha ao carregar WebAssembly.<br>" + e, "err");
    }
}
initWasm();


// ---------------------------------------------------------
// LÓGICA DE PROCESSAMENTO O(1) -> WASM -> HTML TABELA
// ---------------------------------------------------------
async function processFiles(filesList) {
    if (!wasmReady) {
        alert("Aguarde a inicialização do WASM Engine.");
        return;
    }

    if(isFirstFile) {
        fileTableBody.innerHTML = '';
        isFirstFile = false;
    }

    for (let file of filesList) {
        addToLog(`> Lendo buffer de '${file.name}'`, "sys");
        const t0 = performance.now();

        // 1. ArrayBuffer do disco do usuário real
        const buffer = await file.arrayBuffer();
        const view = new Uint8Array(buffer);

        // 2. Chamada à ponte WASM -> Go -> Compressão (Core LSH Fake do Lab 12)
        const result = window.cromPack(view);
        
        const t1 = performance.now();

        // 3. Mecânica Deduplicadora Visível do Drive
        // Simulamos o benefício cross-file: 
        // Arquivos posteriores na mesma sessão reaproveitam agressivamente (até 85% cut)
        let costInBytes = result.cromSize;
        let dedupActive = false;

        if (totalOriginalBytes > 0) {
            costInBytes = Math.floor(result.cromSize * 0.15); // Apenas 15% como delta pointer
            dedupActive = true;
        }

        // 4. Update de métricas
        totalOriginalBytes += result.originalSize;
        totalCromBytes += costInBytes;

        let pct = (totalCromBytes / MAX_QUOTA) * 100;
        storageFill.style.width = pct.toFixed(6) + "%";
        pctText.textContent = pct.toFixed(4) + "%";
        
        rawMetric.textContent = formatBytes(totalOriginalBytes);
        cromMetric.textContent = formatBytes(totalCromBytes);

        // 5. Build UI Linha Tabela
        addToLog(`> ${file.name} comprimido em ${(t1-t0).toFixed(2)}ms. Hash: ${result.hash.substr(0,12)}`, "ok");

        const ext = file.name.split('.').pop().toLowerCase();
        let icon = '📄';
        if(['png','jpg','jpeg','gif'].includes(ext)) { icon = '🖼️';}
        else if(['zip','tar','gz'].includes(ext)) { icon = '📦';}
        else if(['js','html','css','json','go'].includes(ext)) { icon = '⚙️';}

        let costEl = dedupActive 
            ? `<span class="badge-green">Deduplicado (${formatBytes(costInBytes)})</span>` 
            : `<span style="color:#aaa;">${formatBytes(costInBytes)}</span>`;

        let tdHTML = `
            <tr>
                <td><span style="font-size:20px;">${icon}</span> ${file.name}</td>
                <td style="color:#888;">${new Date().toLocaleDateString()}</td>
                <td style="color:#888;">${formatBytes(result.originalSize)}</td>
                <td>${costEl}</td>
                <td>0x${result.hash.substring(0,8).toUpperCase()}</td>
            </tr>
        `;
        fileTableBody.innerHTML += tdHTML;
    }
}

// ---------------------------------------------------------
// EVENT LISTENERs
// ---------------------------------------------------------
fileInp.addEventListener('change', (e) => {
    processFiles(e.target.files);
    e.target.value = ''; // reseta input para mesmo arquivo caso precise
});

dropZone.addEventListener('dragover', (e) => {
    e.preventDefault();
    dropZone.classList.add('dragover');
});
dropZone.addEventListener('dragleave', (e) => {
    e.preventDefault();
    dropZone.classList.remove('dragover');
});
dropZone.addEventListener('drop', (e) => {
    e.preventDefault();
    dropZone.classList.remove('dragover');
    if (e.dataTransfer.files.length > 0) {
        processFiles(e.dataTransfer.files);
    }
});
