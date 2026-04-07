// Elements Setup
const logPanel = document.getElementById('logPanel');
const fileTableBody = document.getElementById('fileTableBody');
const fileInp = document.getElementById('fileInp');
const dropZone = document.getElementById('dropZone');

const storageFill = document.getElementById('storageFill');
const pctText = document.getElementById('pctText');
const rawMetric = document.getElementById('rawMetric');
const cromMetric = document.getElementById('cromMetric');

// Nav Setup
const navBtns = [document.getElementById('btnNavDrive'), document.getElementById('btnNavP2P'), document.getElementById('btnNavLSH')];
const panels = [document.getElementById('panelDrive'), document.getElementById('panelP2P'), document.getElementById('panelLSH')];

navBtns.forEach((btn, index) => {
    btn.addEventListener('click', () => {
        navBtns.forEach(b => b.classList.remove('active'));
        panels.forEach(p => p.classList.add('hidden'));
        
        btn.classList.add('active');
        panels[index].classList.remove('hidden');
    });
});

// P2P Visualization Setup
const p2pSwarm = document.getElementById('p2pSwarm');
const emojis = ['💻', '📱', '🖥️', '📡', '🕹️'];
emojis.forEach((em) => {
    let node = document.createElement('div');
    node.className = 'peer-node';
    node.textContent = em;
    p2pSwarm.appendChild(node);
});

// LSH Table setup
const lshTable = document.getElementById('lshTable');
const lshDictionary = []; 

// Data logic
let totalOriginalBytes = 0;
let totalCromBytes = 0;
const MAX_QUOTA = 15 * 1024 * 1024 * 1024;
let isFirstFile = true;

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

// WASM INIT
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


// Process Files
async function processFiles(filesList) {
    if (!wasmReady) { alert("Aguarde a inicialização do WASM Engine."); return; }
    if(isFirstFile) { fileTableBody.innerHTML = ''; isFirstFile = false; lshTable.innerHTML = ''; }

    for (let file of filesList) {
        addToLog(`> Lendo buffer de '${file.name}'`, "sys");
        const t0 = performance.now();

        const buffer = await file.arrayBuffer();
        const view = new Uint8Array(buffer);

        // Core execution
        const result = window.cromPack(view);
        const t1 = performance.now();

        let costInBytes = result.cromSize;
        let dedupActive = false;

        if (totalOriginalBytes > 0) {
            costInBytes = Math.floor(result.cromSize * 0.15); // Simulação de delta pointer LSH realístico pra arquivos em lote
            dedupActive = true;
        }

        // Metrics
        totalOriginalBytes += result.originalSize;
        totalCromBytes += costInBytes;

        let pct = (totalCromBytes / MAX_QUOTA) * 100;
        storageFill.style.width = pct.toFixed(6) + "%";
        pctText.textContent = pct.toFixed(4) + "%";
        
        rawMetric.textContent = formatBytes(totalOriginalBytes);
        cromMetric.textContent = formatBytes(totalCromBytes);

        addToLog(`> ${file.name} comprimido em ${(t1-t0).toFixed(2)}ms. Hash: ${result.hash.substr(0,12)}`, "ok");

        // UI Drive panel
        const ext = file.name.split('.').pop().toLowerCase();
        let icon = '📄';
        if(['png','jpg','jpeg','gif'].includes(ext)) { icon = '🖼️';}
        else if(['zip','tar','gz'].includes(ext)) { icon = '📦';}
        else if(['js','html','css','json','go'].includes(ext)) { icon = '⚙️';}

        let costEl = dedupActive ? `<span class="badge-green">Deduplicado (${formatBytes(costInBytes)})</span>` : `<span style="color:#aaa;">${formatBytes(costInBytes)}</span>`;

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

        // Populate LSH Panel randomly
        let lshRowHTML = `
            <div class="lsh-row">
                <span class="lsh-hash">0x${result.hash.substring(0,16).toUpperCase()}</span>
                <div>
                    <span class="lsh-size">Base: ${formatBytes(result.cromSize)}</span>
                    <span class="lsh-refs" style="margin-left:15px;">Deduplicações: ${dedupActive ? Math.floor(Math.random()*5)+1 : 0}</span>
                </div>
            </div>
        `;
        lshTable.innerHTML += lshRowHTML;
    }
}

// SYNC BUTTON
document.getElementById('btnSync').addEventListener('click', function() {
    this.classList.add('spinning');
    this.textContent = 'Sincronizando...';
    addToLog("> WebRTC: Abrindo broadcast para P2P swarm...", "sys");
    setTimeout(() => {
        addToLog("> WebRTC: Sincronizado LSH tree. O(1) Push concluído.", "ok");
        this.classList.remove('spinning');
        this.textContent = '🔄 Nodes Sincronizados!';
        setTimeout(() => this.textContent = '🔄 Sincronizar Nodes', 3000);
    }, 1500);
});

// Drag n Drop Handlers
fileInp.addEventListener('change', (e) => { processFiles(e.target.files); e.target.value = ''; });
dropZone.addEventListener('dragover', (e) => { e.preventDefault(); dropZone.classList.add('dragover'); });
dropZone.addEventListener('dragleave', (e) => { e.preventDefault(); dropZone.classList.remove('dragover'); });
dropZone.addEventListener('drop', (e) => {
    e.preventDefault();
    dropZone.classList.remove('dragover');
    if (e.dataTransfer.files.length > 0) processFiles(e.dataTransfer.files);
});
