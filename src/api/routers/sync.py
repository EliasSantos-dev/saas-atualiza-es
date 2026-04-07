from fastapi import APIRouter, HTTPException
from src.api.database import db
from src.api.logic.sync import calculate_delta

router = APIRouter(prefix="/sync", tags=["sync"])

@router.post("/delta")
async def get_delta(client_manifest: dict):
    """
    Recebe o manifesto atual do pendrive do cliente e retorna
    o Delta (o que baixar e o que apagar) em relação ao servidor.
    """
    profile_id = client_manifest.get("profile_id")
    if not profile_id:
        raise HTTPException(status_code=400, detail="Profile ID não fornecido no manifesto")
    
    # Busca o snapshot mais recente para este perfil
    latest_snapshot = await db.snapshots.find_one(
        {"profile_id": profile_id},
        sort=[("created_at", -1)]
    )
    
    if not latest_snapshot:
        raise HTTPException(status_code=404, detail="Nenhum snapshot encontrado para este perfil")
    
    delta = calculate_delta(client_manifest.get("files", []), latest_snapshot.get("files", []))
    
    return {
        "latest_version": latest_snapshot["version"],
        "delta": delta
    }
