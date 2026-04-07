const canvas = document.getElementById('c');
const ctx = canvas.getContext('2d');
const offsetSlider = document.getElementById('offsetSlider');
const paletteSlider = document.getElementById('paletteSlider');
const valG = document.getElementById('valG');
const valP = document.getElementById('valP');
const chunkCount = document.getElementById('chunkCount');

let W = 600, H = 600;
canvas.width = W; canvas.height = H;

// Simulação de Codebook de Imagem (Fractal noise / Glitch base)
let originalData = ctx.createImageData(W, H);

function generateBasePattern() {
    for(let y=0; y<H; y++) {
        for(let x=0; x<W; x++) {
            let i = (y * W + x) * 4;
            let val = Math.sin(x*0.05) * Math.cos(y*0.05) * 128 + 128; // Tonalidade base
            originalData.data[i] = val;
            originalData.data[i+1] = val * 0.5;
            originalData.data[i+2] = val * 1.2;
            originalData.data[i+3] = 255;
        }
    }
}
generateBasePattern();

function renderParametric() {
    const offset = parseInt(offsetSlider.value);
    const hueOffset = parseInt(paletteSlider.value);
    
    let renderData = ctx.createImageData(W, H);
    let chunksModified = 0;
    
    // A simulação "WASM/CROM" substitui blocos (chunks) baseados nas IDs offsettadas
    const chunkSize = 20; // Blocos de 20x20
    
    for(let cy=0; cy<H; cy+=chunkSize) {
        for(let cx=0; cx<W; cx+=chunkSize) {
            
            // Simula lookup da ID de Chunk no Codebook
            let chunkIdLocal = (cy * W + cx) ^ offset; 
            
            if(offset !== 0 && (chunkIdLocal % 7 === 0 || chunkIdLocal % 13 === 0)) chunksModified++;
            
            for(let y=0; y<chunkSize; y++) {
                for(let x=0; x<chunkSize; x++) {
                    if (cy+y>=H || cx+x>=W) continue;
                    
                    let srcY = cy+y;
                    let srcX = cx+x;
                    
                    // Se o Glitch ativa, pega os dados de outro quadrante da ID "fake" mapeada
                    if(offset !== 0 && chunkIdLocal % 5 === 0) {
                        srcX = (cx + x + offset) % W;
                        srcY = (cy + y + Math.abs(offset)) % H;
                    }
                    if(srcX < 0) srcX += W;
                    if(srcY < 0) srcY += H;

                    let si = (srcY * W + srcX) * 4;
                    let di = ((cy+y) * W + (cx+x)) * 4;
                    
                    renderData.data[di] = (originalData.data[si] + hueOffset) % 255; // R
                    renderData.data[di+1] = originalData.data[si+1];                 // G
                    renderData.data[di+2] = (originalData.data[si+2] - hueOffset/2) % 255; // B
                    if(renderData.data[di+2]<0) renderData.data[di+2] *= -1;
                    renderData.data[di+3] = 255; // A
                }
            }
        }
    }
    
    ctx.putImageData(renderData, 0, 0);
    chunkCount.textContent = chunksModified;
}

offsetSlider.addEventListener('input', (e) => {
    valG.textContent = e.target.value;
    renderParametric();
});

paletteSlider.addEventListener('input', (e) => {
    valP.textContent = e.target.value;
    renderParametric();
});

document.getElementById('renderBtn').addEventListener('click', () => {
    // Simula a escrita de um arquivo .crom
    alert("Arquivo exportado paramétrico.crom gerado! Tamanho: 2.1KB (A imagem matriz de 4MB nunca foi alterada).");
});

// Init
renderParametric();
