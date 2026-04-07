# CROM File Forensics (Module 22)

## 🎯 Propósito (Vision)
Análise forense byte a byte real.

## ⚙️ Como Funciona (Under the Hood)
Recebe File Drop e extrai Uint8Arrays. Calcula Shannon Entropy do lado JS bruto e joga no LSH.

## 🔬 Teste e Demonstração CROM (SRE Metrics)
Testa fisicamente o impacto da Aleatoriedade vs Padrão LSH (Barreira de Shannon).

## 💡 Relação com a Arquitetura Core
Este laboratório reflete a regra mestre delineada na arquitetura principal do motor Go Crompressor. Utiliza a biblioteca universal `cromBridge.compress` injetando dados estritos. Ao cruzar os deltas operacionais da UI com o backend WASM, validamos a integridade lossles da matemática, superação LSH e os bypass automáticos para Entropias severas.

🔗 `Voltar ao Hub Principal: ../../README.md`