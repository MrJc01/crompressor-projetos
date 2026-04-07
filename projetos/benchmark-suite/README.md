# 📈 Benchmark Suite — Suíte de Testes Automatizada

## Objetivo
Suíte completa de benchmarks que testa o Crompressor em **múltiplos cenários** e gera um relatório HTML visual.

## Cenários Testados

| # | Cenário | Tipo de Dado |
|---|---------|-------------|
| 1 | Logs HTTP (200MB) | Texto estruturado |
| 2 | JSON APIs (100MB) | Dados repetitivos |
| 3 | Código-fonte Go (50MB) | Texto com indentação |
| 4 | Dados aleatórios (10MB) | Entropia máxima (bypass) |
| 5 | CSV/TSV (100MB) | Dados tabulares |
| 6 | XML/YAML (50MB) | Markup estruturado |

## Como Rodar

```bash
chmod +x run_suite.sh
./run_suite.sh
```

## Saída
- `report.html` — Relatório visual com gráficos (barras, pizza)
- `results.json` — Dados brutos para processamento
- `results.md` — Tabela markdown

## O Que Mede
- **Ratio de compressão** — tamanho original / comprimido
- **Throughput** — MB/s de pack e unpack
- **Validação Lossless** — SHA-256 bit-a-bit
- **Detecção de Entropia** — bypass automático para dados aleatórios

## Requisitos
- Crompressor CLI compilado
- gzip, zstd (para comparação)
- Python3 (para gerar HTML, opcional)
