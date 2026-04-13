# Fase 3: Modo Piloto Automático (Auto-Update) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implementar o sistema de atualização programada (Cron/Scheduler) que aciona o motor Crawler para manter os repertórios sempre atualizados sem intervenção manual.

**Architecture:** Um script supervisor (Task Runner) que roda periodicamente, consulta os perfis configurados no MongoDB como `auto_update: true`, e dispara os crawlers do Spotify e Sua Música. Ao finalizar, ele gera um novo Snapshot na API.

**Tech Stack:** Python 3.12+, APScheduler, Motor (MongoDB), Orchestrator (existente).

---

### Task 1: Scheduler de Atualização

**Files:**
- Create: `src/engine/scheduler.py`

- [ ] **Step 1: Implementar o Runner básico com APScheduler**
```python
import asyncio
from apscheduler.schedulers.asyncio import AsyncIOScheduler
from src.api.database import db
from src.engine.orchestrator import sync_from_spotify

async def run_auto_updates():
    print("Iniciando rotina de auto-update...")
    # Busca perfis com auto-update ligado
    profiles = await db.profiles.find({"auto_update": True}).to_list(None)
    
    for profile in profiles:
        print(f"Atualizando perfil: {profile['name']}")
        if profile['source_type'] == 'spotify':
            await asyncio.to_thread(sync_from_spotify, profile['source_url'], profile['target_dir'])
            # Após o download, disparar geração de manifesto (importer)
            # await generate_snapshot(profile['id'])

if __name__ == "__main__":
    scheduler = AsyncIOScheduler()
    # Roda a cada 12 horas
    scheduler.add_job(run_auto_updates, 'interval', hours=12)
    scheduler.start()
    
    try:
        asyncio.get_event_loop().run_forever()
    except (KeyboardInterrupt, SystemExit):
        pass
```

- [ ] **Step 2: Integrar com a geração de Snapshot**
Após o download, o robô deve varrer a pasta, gerar os hashes e atualizar o MongoDB com a nova versão do repertório.

---

### Task 2: Endpoint de Configuração de Auto-Update

**Files:**
- Modify: `src/api/routers/profiles.py`

- [ ] **Step 1: Adicionar campo auto_update ao modelo de Perfil**
- [ ] **Step 2: Criar endpoint para ligar/desligar o piloto automático**
