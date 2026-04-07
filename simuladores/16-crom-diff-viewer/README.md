# CROM Diff Viewer (Module 16)

## 🎯 Propósito (Vision)
Inspecionar a diferença binária tratada pela compressão.

## ⚙️ Como Funciona (Under the Hood)
Renderiza paineis side-by-side HEX viewer.

## 🔬 Teste e Demonstração CROM (SRE Metrics)
Prova da garantia Lossless Visual (Bit a Bit Verification).

## 💡 Relação com a Arquitetura Core
Este laboratório reflete a regra mestre delineada na arquitetura principal do motor Go Crompressor. Utiliza a biblioteca universal `cromBridge.compress` injetando dados estritos. Ao cruzar os deltas operacionais da UI com o backend WASM, validamos a integridade lossles da matemática, superação LSH e os bypass automáticos para Entropias severas.

🔗 `Voltar ao Hub Principal: ../../README.md`