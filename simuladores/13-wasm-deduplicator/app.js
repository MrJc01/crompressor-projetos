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

async function processFile(file) {
    log(`Lendo: ${file.name} (${formatBytes(file.size)})`);
    totalRawBytes += file.size;
    
    // Simulate WASM LSH clustering and chunking logic
    // We break the size conceptually into 4KB chunks
    const chunks = Math.ceil(file.size / 4096);
    
    for(let i=0; i<Math.min(chunks, 200); i+=10) { // Throttle visual creation for large files
        setTimeout(() => {
            let isDuplicate = Math.random() > 0.4; // 60% dedup ratio assumption for sim
            if (isDuplicate && ingestedNodes.length > 5) {
                // Link to existing node
                const target = Math.floor(Math.random() * ingestedNodes.length);
                const source = {x: Math.random()*W, y: Math.random()*H, t: Date.now()};
                deduplicatedLinks.push({x1: source.x, y1: source.y, x2: ingestedNodes[target].x, y2: ingestedNodes[target].y, alpha: 1});
            } else {
                // New unique semantic chunk
                totalCromBytes += 4096;
                ingestedNodes.push({x: Math.random()*W, y: Math.random()*H, hue: Math.random()*360});
            }
            
            rawSizeEl.textContent = formatBytes(totalRawBytes);
            cromSizeEl.textContent = formatBytes(totalCromBytes || totalRawBytes*0.1);
            ratioEl.textContent = (totalRawBytes / (totalCromBytes || 1)).toFixed(2) + 'x';
            
        }, i * 5); // 5ms delay per tick simulation
    }
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
                processFile(file);
            }
        }
    }
});

// Render Loop
function draw() {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.15)';
    ctx.fillRect(0, 0, W, H);

    ctx.lineWidth = 1;
    // Draw links
    for(let i=deduplicatedLinks.length-1; i>=0; i--) {
        const link = deduplicatedLinks[i];
        ctx.strokeStyle = `rgba(102, 252, 241, ${link.alpha})`;
        ctx.beginPath();
        ctx.moveTo(link.x1, link.y1);
        ctx.lineTo(link.x2, link.y2);
        ctx.stroke();
        
        link.alpha -= 0.02; // fade out links
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
