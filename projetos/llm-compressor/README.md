# 🤖 LLM Compressor — Compressão de Modelos de IA

## Objetivo
Comprimir modelos de linguagem (GGUF/Safetensors) usando um **codebook treinado especificamente em pesos de IA**, explorando a redundância interna de modelos quantizados.

## Lógica

Modelos de ML possuem MUITA redundância:
- Blocos de zeros e near-zeros em camadas de atenção
- Padrões de quantização INT8/FP16 repetitivos entre camadas
- Estruturas de bias e LayerNorm quase idênticas

O Crompressor explora isso com um codebook domain-specific.

## Como Rodar

```bash
chmod +x compress_model.sh
./compress_model.sh [caminho-do-modelo.gguf]
```

### Sem modelo local:
```bash
# Baixa TinyLlama (600MB) para teste
./compress_model.sh --download-tinyllama
```

## Resultado Esperado

```
Original:  tinyllama-1.1b-q4_0.gguf     637MB
Codebook:  llm_weights.cromdb            12MB  (treinamento: ~45s)
Comprimido: tinyllama.crom               ~180MB (ratio ~3.5:1)
Verificação: SHA-256 ✅ MATCH (lossless)
```

## Comparativo
| Método | Ratio | Acesso Random |
|--------|-------|---------------|
| gzip   | ~1.2:1 | ❌ Precisa descomprimir tudo |
| zstd   | ~1.4:1 | ❌ Precisa descomprimir tudo |
| **CROM** | ~3.5:1 | ✅ VFS O(1) — carrega só o bloco pedido |

## Requisitos
- Crompressor CLI
- wget ou curl (para download de modelo)
