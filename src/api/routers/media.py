from fastapi import APIRouter, HTTPException
from fastapi.responses import FileResponse
from src.api.database import db
import os

router = APIRouter(prefix="/media", tags=["media"])

# Pasta onde as músicas processadas (320kbps) estão guardadas no servidor
# No MVP, vamos apontar para a nossa pasta local de teste
MEDIA_ROOT = "16gb_atualizacao_abril_2026_@kelcds"

@router.get("/download/{file_hash}")
async def download_by_hash(file_hash: str):
    """
    Busca uma música no banco pelo hash e entrega o arquivo físico.
    """
    # Procura no último snapshot onde essa música aparece
    snapshot = await db.snapshots.find_one(
        {"files.hash": file_hash}
    )
    
    if not snapshot:
        raise HTTPException(status_code=404, detail="Música não encontrada na biblioteca")
    
    # Encontra o caminho relativo do arquivo no snapshot
    file_entry = next((f for f in snapshot["files"] if f["hash"] == file_hash), None)
    
    if not file_entry:
        raise HTTPException(status_code=404, detail="Erro ao localizar arquivo")
    
    file_path = os.path.join(MEDIA_ROOT, file_entry["path"])
    
    if not os.path.exists(file_path):
        raise HTTPException(status_code=404, detail="Arquivo físico não encontrado no servidor")
    
    return FileResponse(
        path=file_path,
        media_type="audio/mpeg",
        filename=os.path.basename(file_path)
    )
