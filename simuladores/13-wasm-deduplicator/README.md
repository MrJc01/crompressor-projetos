# WASM Deduplicator (Module 13)

## 🎯 Propósito (Vision)
Visualizador do processo de Deduplicação Local LSH em lote.

## ⚙️ Como Funciona (Under the Hood)
Mostra repetições literais em blocos binários de tamanhos fixos.

## 🔬 Teste e Demonstração CROM (SRE Metrics)
Hash O(1) em memória e integridade de Merkle Tree.

## 💡 Relação com a Arquitetura Core
Este laboratório reflete a regra mestre delineada na arquitetura principal do motor Go Crompressor. Utiliza a biblioteca universal `cromBridge.compress` injetando dados estritos. Ao cruzar os deltas operacionais da UI com o backend WASM, validamos a integridade lossles da matemática, superação LSH e os bypass automáticos para Entropias severas.

🔗 `Voltar ao Hub Principal: ../../README.md`