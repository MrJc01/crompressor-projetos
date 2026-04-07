/**
 * CROM Bridge Universal — Módulo compartilhado para todos os simuladores.
 * Carrega o WASM Core, cria o painel flutuante de stats reais,
 * e expõe a API `cromBridge.compress(data)` para qualquer simulador usar.
 */
(function() {
    'use strict';

    const WASM_EXEC_PATH = '../12-crom-wasm-core/wasm_exec.js';
    const WASM_BIN_PATH  = '../12-crom-wasm-core/crompressor.wasm';

    // State
    let wasmReady = false;
    let totalOriginal = 0;
    let totalCompressed = 0;
    let compressCount = 0;
    let lastHash = '—';
    let lastMs = 0;

    // --- Load WASM Runtime ---
    function loadScript(src) {
        return new Promise((resolve, reject) => {
            if (document.querySelector(`script[src="${src}"]`)) { resolve(); return; }
            const s = document.createElement('script');
            s.src = src;
            s.onload = resolve;
            s.onerror = reject;
            document.head.appendChild(s);
        });
    }

    async function initWasm() {
        try {
            await loadScript(WASM_EXEC_PATH);
            const go = new Go();
            const response = await fetch(WASM_BIN_PATH);
            const wasmObj = await WebAssembly.instantiateStreaming(response, go.importObject);
            go.run(wasmObj.instance);
            wasmReady = true;
            updatePanel();
            return true;
        } catch(e) {
            console.warn('[CROM Bridge] WASM init failed:', e.message);
            return false;
        }
    }

    // --- Floating Stats Panel ---
    function createPanel() {
        const panel = document.createElement('div');
        panel.id = 'crom-bridge-panel';
        panel.innerHTML = `
            <div class="cbp-header">
                <span class="cbp-dot"></span> CROM WASM Engine
                <span class="cbp-toggle" title="Minimizar">—</span>
            </div>
            <div class="cbp-body">
                <div class="cbp-row"><span class="cbp-lbl">Status</span><span class="cbp-val" id="cbp-status">Carregando...</span></div>
                <div class="cbp-row"><span class="cbp-lbl">Operações</span><span class="cbp-val" id="cbp-ops">0</span></div>
                <div class="cbp-row"><span class="cbp-lbl">Raw Total</span><span class="cbp-val" id="cbp-raw">0 B</span></div>
                <div class="cbp-row"><span class="cbp-lbl">CROM Total</span><span class="cbp-val" id="cbp-crom">0 B</span></div>
                <div class="cbp-row"><span class="cbp-lbl">Ratio</span><span class="cbp-val" id="cbp-ratio">—</span></div>
                <div class="cbp-row"><span class="cbp-lbl">Último Hash</span><span class="cbp-val cbp-hash" id="cbp-hash">—</span></div>
                <div class="cbp-row"><span class="cbp-lbl">Latência</span><span class="cbp-val" id="cbp-ms">— ms</span></div>
                <div class="cbp-bar-bg"><div class="cbp-bar-fill" id="cbp-bar"></div></div>
            </div>
        `;

        const style = document.createElement('style');
        style.textContent = `
            #crom-bridge-panel {
                position: fixed; bottom: 15px; right: 15px; z-index: 99999;
                width: 260px; background: rgba(8,10,18,0.92); backdrop-filter: blur(12px);
                border: 1px solid rgba(0,210,255,0.25); border-radius: 12px;
                font-family: 'JetBrains Mono', 'Fira Code', monospace; font-size: 11px;
                color: #c0c8d8; box-shadow: 0 8px 32px rgba(0,0,0,0.6);
                overflow: hidden; transition: all 0.3s;
            }
            #crom-bridge-panel.minimized .cbp-body { display: none; }
            #crom-bridge-panel.minimized { width: 180px; }
            .cbp-header {
                background: rgba(0,210,255,0.08); padding: 8px 12px;
                display: flex; align-items: center; gap: 6px;
                font-weight: bold; font-size: 10px; text-transform: uppercase;
                letter-spacing: 0.5px; color: #00d2ff; cursor: move;
                border-bottom: 1px solid rgba(0,210,255,0.15);
                user-select: none;
            }
            .cbp-dot {
                width: 6px; height: 6px; border-radius: 50%;
                background: #ff3366; display: inline-block;
                animation: cbp-pulse 1.5s infinite;
            }
            #crom-bridge-panel.ready .cbp-dot { background: #00ff88; animation: none; }
            @keyframes cbp-pulse { 0%,100%{opacity:1} 50%{opacity:0.3} }
            .cbp-toggle { margin-left: auto; cursor: pointer; font-size: 14px; color: #888; }
            .cbp-body { padding: 10px 12px; display: flex; flex-direction: column; gap: 5px; }
            .cbp-row { display: flex; justify-content: space-between; }
            .cbp-lbl { color: #667; font-size: 10px; }
            .cbp-val { color: #fff; font-weight: bold; font-size: 10px; }
            .cbp-hash { color: #00d2ff; font-size: 9px; max-width: 120px; overflow: hidden; text-overflow: ellipsis; }
            .cbp-bar-bg { height: 3px; background: #1a1c2b; border-radius: 2px; margin-top: 6px; overflow: hidden; }
            .cbp-bar-fill { height: 100%; background: linear-gradient(90deg, #00d2ff, #00ff88); width: 0%; transition: width 0.3s; border-radius: 2px; }
            @media (max-width: 600px) {
                #crom-bridge-panel { width: 200px; bottom: 8px; right: 8px; font-size: 10px; }
            }
        `;
        document.head.appendChild(style);
        document.body.appendChild(panel);

        // Toggle minimize
        panel.querySelector('.cbp-toggle').addEventListener('click', () => {
            panel.classList.toggle('minimized');
        });

        // Draggable
        let drag = false, ox, oy;
        const hdr = panel.querySelector('.cbp-header');
        hdr.addEventListener('mousedown', (e) => { drag = true; ox = e.clientX - panel.offsetLeft; oy = e.clientY - panel.offsetTop; });
        document.addEventListener('mousemove', (e) => { if(drag) { panel.style.left = (e.clientX - ox) + 'px'; panel.style.top = (e.clientY - oy) + 'px'; panel.style.right = 'auto'; panel.style.bottom = 'auto'; } });
        document.addEventListener('mouseup', () => { drag = false; });
    }

    function formatBytes(bytes) {
        if (bytes === 0) return '0 B';
        const k = 1024, sizes = ['B', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    function updatePanel() {
        const panel = document.getElementById('crom-bridge-panel');
        if (!panel) return;

        const statusEl = document.getElementById('cbp-status');
        if (wasmReady) {
            panel.classList.add('ready');
            statusEl.textContent = '● Online';
            statusEl.style.color = '#00ff88';
        } else {
            statusEl.textContent = '○ Offline';
            statusEl.style.color = '#ff3366';
        }

        document.getElementById('cbp-ops').textContent = compressCount;
        document.getElementById('cbp-raw').textContent = formatBytes(totalOriginal);
        document.getElementById('cbp-crom').textContent = formatBytes(totalCompressed);
        document.getElementById('cbp-hash').textContent = lastHash;
        document.getElementById('cbp-ms').textContent = lastMs.toFixed(2) + ' ms';

        const ratio = totalOriginal > 0 && totalCompressed > 0
            ? (totalOriginal / totalCompressed).toFixed(2) + ':1'
            : '—';
        document.getElementById('cbp-ratio').textContent = ratio;

        const pct = totalOriginal > 0 ? Math.min((totalCompressed / totalOriginal) * 100, 100) : 0;
        document.getElementById('cbp-bar').style.width = pct + '%';
    }

    // --- Public API ---
    function compress(data) {
        if (!wasmReady) return null;

        let uint8;
        if (typeof data === 'string') {
            uint8 = new TextEncoder().encode(data);
        } else if (data instanceof ArrayBuffer) {
            uint8 = new Uint8Array(data);
        } else if (data instanceof Uint8Array) {
            uint8 = data;
        } else if (data instanceof Float32Array || data instanceof Float64Array || data instanceof Int32Array) {
            uint8 = new Uint8Array(data.buffer);
        } else {
            uint8 = new TextEncoder().encode(JSON.stringify(data));
        }

        const t0 = performance.now();
        const result = window.cromPack(uint8);
        const t1 = performance.now();

        totalOriginal += result.originalSize;
        totalCompressed += result.cromSize;
        compressCount++;
        lastHash = result.hash ? result.hash.substring(0, 16) : '—';
        lastMs = t1 - t0;

        updatePanel();
        return result;
    }

    function isReady() { return wasmReady; }
    function getStats() {
        return { totalOriginal, totalCompressed, compressCount, lastHash, lastMs, wasmReady };
    }

    // --- Bootstrap ---
    window.cromBridge = { compress, isReady, getStats, init: initWasm };

    document.addEventListener('DOMContentLoaded', () => {
        createPanel();
        initWasm();
    });

})();
