from fastapi import FastAPI
from src.api.routers import auth, snapshots, sync, media

app = FastAPI(title="SaaS Pendrive API")

# Registrar rotas
app.include_router(auth.router)
app.include_router(snapshots.router)
app.include_router(sync.router)
app.include_router(media.router)

@app.get("/health")
async def health():
    return {"status": "ok"}
