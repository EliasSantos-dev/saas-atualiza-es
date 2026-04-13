import asyncio
import logging
from apscheduler.schedulers.asyncio import AsyncIOScheduler
from src.api.database import db
from src.engine.orchestrator import sync_from_spotify, sync_from_suamusica
from main import generate_manifest # Reutilizando a lógica de geração de snapshot

# Configuração de Logs
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("PulseDrive-Scheduler")

async def run_auto_updates():
    logger.info("--- Iniciando rotina de auto-update ---")
    
    # Busca perfis com piloto automático ligado
    try:
        profiles = await db.profiles.find({"auto_update": True}).to_list(None)
        
        if not profiles:
            logger.info("Nenhum perfil com auto-update ativo encontrado.")
            return

        for profile in profiles:
            logger.info(f"Processando perfil: {profile['name']} ({profile.get('source_type', 'N/A')})")
            
            target_dir = profile.get('target_dir', f"data/processed/{profile['name']}")
            source_url = profile.get('source_url')
            
            if not source_url:
                logger.warning(f"Perfil {profile['name']} sem URL de origem. Pulando.")
                continue

            # 1. Disparar Crawler/Downloader
            if profile.get('source_type') == 'spotify':
                logger.info(f"Iniciando sync Spotify para {profile['name']}...")
                await asyncio.to_thread(sync_from_spotify, source_url, target_dir)
            elif profile.get('source_type') == 'suamusica':
                logger.info(f"Iniciando sync Sua Música para {profile['name']}...")
                await asyncio.to_thread(sync_from_suamusica, source_url, target_dir)

            # 2. Gerar novo Snapshot (Manifesto)
            logger.info(f"Gerando novo manifesto para {profile['name']}...")
            await asyncio.to_thread(generate_manifest, target_dir)
            
            logger.info(f"Perfil {profile['name']} atualizado com sucesso.")

    except Exception as e:
        logger.error(f"Erro durante a rotina de auto-update: {e}")

if __name__ == "__main__":
    scheduler = AsyncIOScheduler()
    
    # Configurado para rodar a cada 12 horas
    scheduler.add_job(run_auto_updates, 'interval', hours=12)
    
    logger.info("Agendador PulseDrive iniciado. Próxima atualização em 12h.")
    scheduler.start()
    
    try:
        asyncio.get_event_loop().run_forever()
    except (KeyboardInterrupt, SystemExit):
        logger.info("Agendador encerrado.")
