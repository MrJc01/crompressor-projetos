# 📊 Compressão de Logs — Benchmark Crompressor vs gzip vs zstd

## Objetivo
Demonstrar a vantagem do Crompressor em dados **altamente estruturados** (logs) através de benchmark automatizado contra ferramentas tradicionais.

## Como Rodar

```bash
chmod +x run_benchmark.sh
./run_benchmark.sh
```

## O Que Acontece

1. **Gera** 100MB de logs sintéticos (HTTP access logs, syslog, JSON structured)
2. **Treina** um codebook Crompressor com os dados gerados
3. **Comprime** com Crompressor, gzip e zstd
4. **Mede** ratio de compressão, tempo de pack/unpack, uso de memória
5. **Verifica** integridade lossless com SHA-256
6. **Gera** relatório markdown + tabela comparativa

## Resultado Esperado

| Ferramenta | Ratio | Tempo Pack | Tempo Unpack |
|-----------|-------|-----------|-------------|
| gzip -9   | ~5:1  | ~2.5s     | ~0.8s       |
| zstd -19  | ~7:1  | ~3.2s     | ~0.3s       |
| **CROM**  | ~12:1 | ~4.0s     | ~0.1s (VFS) |

> O CROM brilha em dados repetitivos porque o codebook "já memorizou" os padrões (timestamps, headers, stack traces).

## Requisitos
- Crompressor CLI (rode `../scripts/setup.sh` primeiro)
- gzip, zstd (geralmente já instalados)
