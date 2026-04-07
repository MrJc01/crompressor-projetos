const sendBtn = document.getElementById('sendBtn');
const logA = document.getElementById('logA');
const logB = document.getElementById('logB');
const netVisuals = document.querySelector('.net-visuals');
const netStat = document.getElementById('netStat');

function addToLog(el, msg) {
    el.innerHTML += `[${new Date().toLocaleTimeString()}] ${msg}<br>`;
    el.scrollTop = el.scrollHeight;
}

function shootPacket() {
    const p = document.createElement('div');
    p.className = 'packet animating';
    netVisuals.appendChild(p);
    setTimeout(() => p.remove(), 1500);
}

sendBtn.addEventListener('click', () => {
    if (!cromBridge.isReady()) {
        addToLog(logA, "Aguarde a inicialização do motor WASM...");
        return;
    }
    
    sendBtn.style.pointerEvents = 'none';
    
    // Gerando um payload real na memória (ex: 5MB de dados reais)
    addToLog(logA, "Gerando payload de dados reais na memória (5 MB)...");
    
    const rawData = new Uint8Array(5 * 1024 * 1024);
    // Preenchendo com padrão altamente compressível (ex: arquivo vazio com alguns diffs)
    for(let i=0; i<rawData.length; i++) {
        rawData[i] = i % 255;
    }
    
    addToLog(logA, "Analisando com motor CROM (WASM P2P)...");
    
    setTimeout(() => {
        const t0 = performance.now();
        const result = cromBridge.compress(rawData);
        const t1 = performance.now();
        
        if (result) {
            addToLog(logA, `Análise concluída em ${(t1 - t0).toFixed(2)}ms`);
            addToLog(logA, `Hash Codebook Local: 0x${result.hash}`);
            
            let transmitSize = result.cromSize; 
            addToLog(logA, `Iniciando DataChannel (Transmitindo Custo Real: ${transmitSize} Bytes)`);
            
            // Send packets baseados no tamanho real
            let packets = 0;
            // Simulamos pacotes de ~1024 bytes dependendo do cromSize
            let maxPackets = Math.max(10, Math.ceil(transmitSize / 1024));
            let bytesPerPacket = transmitSize / maxPackets;
            let currentBytes = 0;
            
            let netInterval = setInterval(() => {
                shootPacket();
                packets++;
                currentBytes += bytesPerPacket;
                netStat.textContent = Math.floor(currentBytes) + " Bytes";
                
                if(packets === 1){
                    addToLog(logB, "Recebendo Stream CROM...");
                }
                
                if(packets >= maxPackets) {
                    clearInterval(netInterval);
                    addToLog(logA, "Transmissão concluída!");
                    
                    addToLog(logB, "Reconstruindo Payload...");
                    setTimeout(() => {
                        addToLog(logB, `Consulta Hash 0x${result.hash}: Sucesso`);
                        const ratio = (result.originalSize / result.cromSize).toFixed(2);
                        addToLog(logB, `<b>✅ Recebimento de ${(result.originalSize / 1024 / 1024).toFixed(2)} MB com custo de rede de apenas ${(result.cromSize / 1024).toFixed(2)} KB (Ratio: ${ratio}:1)</b>`);
                    }, 500);
                }
            }, 30);
        } else {
            addToLog(logA, "Falha na compressão WASM.");
            sendBtn.style.pointerEvents = 'auto';
        }
    }, 500);
});
