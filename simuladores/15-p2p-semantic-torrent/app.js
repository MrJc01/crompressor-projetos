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
    sendBtn.style.pointerEvents = 'none';
    addToLog(logA, "Lendo 'filme_1080p.mp4' (1.500.000.000 Bytes)");
    addToLog(logA, "Analisando contra Codebook Local...");
    
    setTimeout(() => {
        addToLog(logA, "1.499.995.000 Bytes já existem no Codebook universal (99.9% match)");
        addToLog(logA, "Gerando Delta e Hash Map...");
        
        setTimeout(() => {
            let transmitSize = 51024; // ~50KB instead of 1.5GB
            addToLog(logA, `Iniciando WebRTC DataChannel (Transmitindo: ${transmitSize} Bytes)`);
            
            // Send packets
            let packets = 0;
            let netInterval = setInterval(() => {
                shootPacket();
                packets++;
                netStat.textContent = (packets * 1024) + " Bytes";
                
                if(packets === 1){
                    addToLog(logB, "Recebendo Stream CROM (WebRTC)...");
                }
                
                if(packets >= 50) {
                    clearInterval(netInterval);
                    addToLog(logA, "Transmissão concluída!");
                    
                    addToLog(logB, "Reconstruindo 'filme_1080p.mp4'...");
                    setTimeout(() => {
                        addToLog(logB, "Consulta local ao Codebook: Sucesso");
                        addToLog(logB, "Filme Remontado O(1) na OPFS (Browser VFS)");
                        addToLog(logB, "<b>✅ Recebimento de 1.5GB com custo de rede de apenas 50KB!</b>");
                    }, 800);
                }
            }, 30);
            
        }, 1000);
    }, 1500);
});
