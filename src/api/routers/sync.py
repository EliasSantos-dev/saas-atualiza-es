from fastapi import APIRouter, HTTPException, BackgroundTasks
import os
import json
from src.api.database import db
from src.api.logic.sync import calculate_delta
from src.engine.orchestrator import sync_from_spotify

router = APIRouter(prefix="/sync", tags=["sync"])

@router.post("/start")
async def start_sync(playlist_url: str, target_dir: str = "data/processed/HITS"):
    """
    Dispara o processo de sincronização em background.
    """
    try:
        success, errors = sync_from_spotify(playlist_url, target_dir)
        return {"status": "completed", "success": success, "errors": errors}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/delta")
async def get_delta(client_manifest: dict):
    """
    Recebe o manifesto atual do pendrive do cliente e retorna
    o Delta (o que baixar e o que apagar) em relação ao servidor.
    """
    profile_id = client_manifest.get("profile_id")
    if not profile_id:
        raise HTTPException(status_code=400, detail="Profile ID não fornecido no manifesto")
    
    # Busca o snapshot mais recente para este profile no MongoDB
    latest_snapshot = await db.snapshots.find_one(
        {"profile_id": profile_id},
        sort=[("created_at", -1)]
    )
    
    if not latest_snapshot:
        # Se não achar o profile específico, busca o "master_profile" como fallback
        latest_snapshot = await db.snapshots.find_one(
            {"profile_id": "master_profile"},
            sort=[("created_at", -1)]
        )
        
    if not latest_snapshot:
        raise HTTPException(status_code=404, detail="Nenhum snapshot encontrado no servidor para este perfil ou master")
        
    # Calcula a diferença entre o pendrive do cliente e o servidor
    delta = calculate_delta(client_manifest.get("files", []), latest_snapshot.get("files", []))
    
    # Adiciona links das pastas para o cliente saber de onde baixar se necessário
    folder_links = latest_snapshot.get("folder_links", {})
    
    return {
        "latest_version": latest_snapshot.get("version", "v1.0.0"),
        "delta": delta,
        "folder_links": folder_links
    }
