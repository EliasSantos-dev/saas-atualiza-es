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

from src.engine.importer import build_manifest
import os

@router.post("/generate-master")
async def generate_master():
    root_dir = "16gb_atualizacao_marco_2026_vol.01_(Sem_Vinheta)_@kelcds"
    profile_id = "master_profile"
    version = f"v1.0.{int(datetime.now().timestamp())}"
    
    if not os.path.exists(root_dir):
        raise HTTPException(status_code=404, detail=f"Pasta '{root_dir}' não encontrada no servidor")

    # Tenta buscar configuração customizada no banco
    config = await db.configs.find_one({"profile_id": profile_id})
    
    # Gera o manifesto respeitando as regras do Config (se houver)
    manifest = build_manifest(root_dir, profile_id, version, config_data=config)
    manifest["created_at"] = datetime.now()
    
    # Insere no MongoDB
    result = await db.snapshots.insert_one(manifest)
    return {
        "id": str(result.inserted_id), 
        "message": "Snapshot Mestre gerado com sucesso",
        "total_files": len(manifest["files"])
    }

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
