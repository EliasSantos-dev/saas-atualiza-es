import asyncio
import json
from src.api.database import db
from src.api.auth import get_password_hash
from datetime import datetime

async def init_db():
    # 1. Criar usuário de teste
    print("Criando usuário admin...")
    admin_user = {
        "username": "admin",
        "email": "admin@saaspendrive.com",
        "hashed_password": get_password_hash("admin123"),
        "is_active": True
    }
    await db.users.update_one(
        {"username": "admin"},
        {"$set": admin_user},
        upsert=True
    )
    
    # 2. Carregar manifesto de Abril como Snapshot v1.0
    try:
        with open("manifest.json", "r", encoding="utf-8") as f:
            manifest_data = json.load(f)
            
        print(f"Carregando {len(manifest_data['files'])} músicas para o Snapshot v1.0...")
        
        snapshot = {
            "profile_id": manifest_data["profile_id"],
            "version": manifest_data["version"],
            "created_at": datetime.now(),
            "files": manifest_data["files"]
        }
        
        await db.snapshots.update_one(
            {"profile_id": snapshot["profile_id"], "version": snapshot["version"]},
            {"$set": snapshot},
            upsert=True
        )
        print("Sucesso! Banco de dados inicializado.")
        
    except FileNotFoundError:
        print("Erro: manifest.json não encontrado. Rode o script main.py primeiro.")

if __name__ == "__main__":
    asyncio.run(init_db())
