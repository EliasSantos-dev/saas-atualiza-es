import os
import asyncio
import json
from motor.motor_asyncio import AsyncIOMotorClient
from src.api.auth import get_password_hash
from src.engine.importer import build_manifest
from datetime import datetime
from dotenv import load_dotenv

load_dotenv()

MONGO_URL = os.getenv("MONGO_URL", "mongodb://localhost:27017")
client = AsyncIOMotorClient(MONGO_URL)
db = client.saas_pendrive

async def seed_admin():
    print("Criando usuário admin...")
    admin_email = "admin@pulsedrive.com"
    admin_username = "admin"
    admin_password = "0912Amor."
    
    # Verifica se já existe
    existing_user = await db.users.find_one({"email": admin_email})
    if existing_user:
        print(f"Usuário {admin_email} já existe.")
    else:
        hashed_password = get_password_hash(admin_password)
        user_data = {
            "username": admin_username,
            "email": admin_email,
            "hashed_password": hashed_password,
            "is_active": True,
            "role": "admin" # Adicionando role para facilitar no futuro
        }
        await db.users.insert_one(user_data)
        print(f"Usuário admin criado com sucesso!")

async def seed_master_snapshot():
    print("Gerando Snapshot Mestre...")
    root_dir = "16gb_atualizacao_marco_2026_vol.01_(Sem_Vinheta)_@kelcds"
    profile_id = "master_profile"
    version = "v1.0.0"
    
    if not os.path.exists(root_dir):
        print(f"Erro: Pasta '{root_dir}' não encontrada!")
        return

    # Tenta buscar configuração customizada no banco
    config = await db.configs.find_one({"profile_id": profile_id})
    
    # Gera o manifesto respeitando as regras do Config (se houver)
    manifest = build_manifest(root_dir, profile_id, version, config_data=config)
    manifest["created_at"] = datetime.now()
    
    # Limpa snapshots antigos com mesmo profile_id e version para evitar duplicatas em testes
    await db.snapshots.delete_many({"profile_id": profile_id, "version": version})
    
    # Insere no MongoDB
    result = await db.snapshots.insert_one(manifest)
    print(f"Snapshot Mestre inserido com ID: {result.inserted_id}")
    print(f"Total de arquivos: {len(manifest['files'])}")
    print(f"Folders com links: {len(manifest['folder_links'])}")

async def main():
    await seed_admin()
    await seed_master_snapshot()
    print("Seed finalizado!")

if __name__ == "__main__":
    asyncio.run(main())
