# 🐳 Docker VFS Cascade

## Objetivo
Demonstrar a execução de containers Docker **a partir de camadas comprimidas** pelo Crompressor, montadas via FUSE — sem descompactar manualmente.

## Arquitetura

```
┌─────────────────────────────────────────────────┐
│  docker build / docker run                      │
├─────────────────────────────────────────────────┤
│  OverlayFS (merge layer — read/write)           │
├─────────────────────────────────────────────────┤
│  CROM VFS / FUSE Mount (read-only)              │
├─────────────────────────────────────────────────┤
│  arquivo.crom + codebook.cromdb                 │
│  (dados comprimidos no disco)                   │
└─────────────────────────────────────────────────┘
```

## Como Rodar

```bash
chmod +x deploy.sh
sudo ./deploy.sh
```

## Requisitos
- Crompressor CLI compilado
- FUSE3 (`sudo apt install fuse3`)
- Docker
- Root (para montar FUSE)

## O Que Demonstra
- Que o Docker consegue LER e EXECUTAR código de um filesystem 100% virtual
- Que a cascata FUSE não introduz overhead perceptível
- Que a compressão é transparente para a aplicação
