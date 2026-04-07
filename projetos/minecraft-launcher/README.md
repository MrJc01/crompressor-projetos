# 🎮 Minecraft Launcher — Zero-RAM via CROM VFS

## Objetivo
Rodar Minecraft (via TLauncher) **inteiramente sobre um sistema de arquivos virtual** comprimido pelo Crompressor, demonstrando paginação Out-of-Core sem ocupar espaço físico real.

## Arquitetura

```
┌──────────────────────────────────────────┐
│  Minecraft / TLauncher (Java)            │
├──────────────────────────────────────────┤
│  Fuse-OverlayFS (write layer para mods) │
├──────────────────────────────────────────┤
│  SquashFuse (camada read-only)           │
├──────────────────────────────────────────┤
│  Crompressor V24 (.crom + .cromdb)       │
│  → Paginação O(1) sob demanda            │
└──────────────────────────────────────────┘
```

## Como Preparar

```bash
# 1. Primeiro, tenha o Minecraft/TLauncher baixado em ./game/
# 2. Comprima com Crompressor:
crompressor train --input ./game/ --output minecraft.cromdb --size 16384
crompressor pack --input ./game/ --output minecraft.crom --codebook minecraft.cromdb

# 3. Rode o launcher:
chmod +x play.sh
./play.sh
```

## Scripts Incluídos
- `play.sh` — Levanta VFS, monta FUSE, inicia o jogo e faz teardown automático ao fechar
- Adaptado dos scripts originais em `trabalho/minecraft_client/` da branch dev

## Segurança
Ao fechar o Minecraft, o script automaticamente:
- Desmonta FUSE (`fusermount -uz`)
- Limpa zumbis de processo
- Retorna o sistema ao estado limpo

## Requisitos
- Crompressor compilado
- FUSE3 + squashfuse + fuse-overlayfs
- Java 17+
- TLauncher ou Minecraft oficial
