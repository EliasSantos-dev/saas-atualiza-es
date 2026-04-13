from fastapi import APIRouter, HTTPException, Depends
from src.api.database import db
from src.api.models.config import ProfileConfig

router = APIRouter(prefix="/config", tags=["config"])

@router.get("/{profile_id}", response_model=ProfileConfig)
async def get_config(profile_id: str):
    config = await db.configs.find_one({"profile_id": profile_id})
    if not config:
        # Retorna um default se não existir
        return ProfileConfig(profile_id=profile_id)
    return config

@router.put("/{profile_id}")
async def update_config(profile_id: str, config: ProfileConfig):
    config_dict = config.model_dump()
    await db.configs.update_one(
        {"profile_id": profile_id},
        {"$set": config_dict},
        upsert=True
    )
    return {"message": "Configuração atualizada com sucesso"}
