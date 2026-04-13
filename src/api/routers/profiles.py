from fastapi import APIRouter, HTTPException
from src.api.database import db
from src.api.models.profile import Profile, ProfileUpdate
from typing import List

router = APIRouter(prefix="/profiles", tags=["profiles"])

@router.get("/", response_model=List[Profile])
async def list_profiles():
    profiles = await db.profiles.find().to_list(None)
    # Converter _id do Mongo para id do Pydantic se necessário
    for p in profiles:
        p['id'] = str(p.get('_id')) if '_id' in p else p.get('id')
    return profiles

@router.patch("/{profile_id}")
async def update_profile(profile_id: str, update: ProfileUpdate):
    """
    Liga ou desliga o Piloto Automático ou atualiza a URL de origem.
    """
    result = await db.profiles.update_one(
        {"id": profile_id},
        {"$set": update.dict(exclude_unset=True)}
    )
    
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Perfil não encontrado")
        
    return {"message": "Perfil atualizado com sucesso"}

@router.post("/")
async def create_profile(profile: Profile):
    await db.profiles.insert_one(profile.dict())
    return {"message": "Perfil criado"}
