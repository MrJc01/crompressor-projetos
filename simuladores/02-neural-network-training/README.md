# Neural Network Training (Module 02)

## 🎯 Propósito (Vision)
Medir a compressão da evolução dos tensores (Pesos/Weights) durante o Fine-Tuning de IAs.

## ⚙️ Como Funciona (Under the Hood)
Simula o backpropagation no Canvas, extraindo matrizes Float e injetando no CROM.

## 🔬 Teste e Demonstração CROM (SRE Metrics)
Testa o Chunking Semântico para detectar deltas diminutos em Tensores Pós-Treino.

## 💡 Relação com a Arquitetura Core
Este laboratório reflete a regra mestre delineada na arquitetura principal do motor Go Crompressor. Utiliza a biblioteca universal `cromBridge.compress` injetando dados estritos. Ao cruzar os deltas operacionais da UI com o backend WASM, validamos a integridade lossles da matemática, superação LSH e os bypass automáticos para Entropias severas.

🔗 `Voltar ao Hub Principal: ../../README.md`