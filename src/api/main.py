from fastapi import FastAPI
from src.api.database import db

app = FastAPI(title="SaaS Pendrive API")

@app.get("/health")
async def health():
    return {"status": "ok"}
