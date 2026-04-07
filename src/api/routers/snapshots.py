from fastapi import APIRouter, HTTPException
from src.api.models.snapshot import Snapshot
from src.api.database import db
from datetime import datetime

router = APIRouter(prefix="/snapshots", tags=["snapshots"])

@router.post("/")
async def create_snapshot(snapshot: Snapshot):
    # Converte datetime para string se o driver motor reclamar, 
    # ou deixa o Pydantic tratar no dict()
    snapshot_dict = snapshot.model_dump()
    result = await db.snapshots.insert_one(snapshot_dict)
    return {"id": str(result.inserted_id), "message": "Snapshot criado com sucesso"}

@router.get("/{profile_id}/latest")
async def get_latest_snapshot(profile_id: str):
    snapshot = await db.snapshots.find_one(
        {"profile_id": profile_id},
        sort=[("created_at", -1)]
    )
    if not snapshot:
        raise HTTPException(status_code=404, detail="Nenhum snapshot encontrado para este perfil")
    
    # Remove o _id do MongoDB para retornar como JSON
    snapshot.pop("_id", None)
    return snapshot
