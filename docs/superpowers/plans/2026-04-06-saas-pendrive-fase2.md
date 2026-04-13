# Fase 2: Backend FastAPI & MongoDB Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Desenvolver a API REST do SaaS Pendrive para gerenciar autenticação de usuários, versionamento de perfis musicais (Snapshots) e cálculo de diferença (Delta) para sincronização.

**Architecture:** API assíncrona usando FastAPI conectada ao MongoDB (Motor). A autenticação usa JWT. O sistema de versionamento armazena o estado completo do pendrive em cada "Snapshot", e a API calcula em tempo real o que mudou entre o que o cliente tem e o que o servidor exige.

**Tech Stack:** Python 3.13+, FastAPI, Motor (MongoDB Async), Pydantic, PyJWT, Passlib (bcrypt).

---

### Task 1: Setup do Backend e Conexão MongoDB

**Files:**
- Modify: `requirements.txt`
- Create: `src/api/main.py`
- Create: `src/api/database.py`

- [ ] **Step 1: Update requirements.txt**
```text
fastapi[all]==0.110.0
motor==3.3.2
pyjwt[crypto]==2.8.0
passlib[bcrypt]==1.7.4
python-multipart==0.0.9
```

- [ ] **Step 2: Install dependencies**
Run: `pip install -r requirements.txt`

- [ ] **Step 3: Implement MongoDB connection**
```python
# src/api/database.py
from motor.motor_asyncio import AsyncIOMotorClient
import os

MONGO_URL = os.getenv("MONGO_URL", "mongodb://localhost:27017")
client = AsyncIOMotorClient(MONGO_URL)
db = client.saas_pendrive
```

- [ ] **Step 4: Create basic FastAPI app**
```python
# src/api/main.py
from fastapi import FastAPI
from src.api.database import db

app = FastAPI(title="SaaS Pendrive API")

@app.get("/health")
async def health():
    return {"status": "ok"}
```

- [ ] **Step 5: Commit setup**
```bash
git add requirements.txt src/api/
git commit -m "chore(api): setup fastapi and mongodb connection"
```

---

### Task 2: Autenticação JWT e Usuários

**Files:**
- Create: `src/api/models/user.py`
- Create: `src/api/auth.py`
- Create: `src/api/routers/auth.py`

- [ ] **Step 1: Create User model**
```python
from pydantic import BaseModel, EmailStr
from typing import Optional

class User(BaseModel):
    username: str
    email: EmailStr
    hashed_password: str
    is_active: bool = True

class UserCreate(BaseModel):
    username: str
    email: EmailStr
    password: str
```

- [ ] **Step 2: Implement password hashing and JWT**
```python
from passlib.context import CryptContext
from datetime import datetime, timedelta
import jwt

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
SECRET_KEY = "super-secret-key" # In production, use env var
ALGORITHM = "HS256"

def get_password_hash(password):
    return pwd_context.hash(password)

def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

def create_access_token(data: dict):
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(days=7)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
```

- [ ] **Step 3: Create login endpoint**
```python
# src/api/routers/auth.py
from fastapi import APIRouter, HTTPException, Depends
from src.api.auth import verify_password, create_access_token
from src.api.database import db

router = APIRouter(prefix="/auth", tags=["auth"])

@app.post("/login")
async def login(form_data: OAuth2PasswordRequestForm = Depends()):
    user = await db.users.find_one({"username": form_data.username})
    if not user or not verify_password(form_data.password, user["hashed_password"]):
        raise HTTPException(status_code=400, detail="Incorrect username or password")
    
    access_token = create_access_token(data={"sub": user["username"]})
    return {"access_token": access_token, "token_type": "bearer"}
```

- [ ] **Step 4: Commit auth**
```bash
git add src/api/models/ src/api/auth.py src/api/routers/
git commit -m "feat(api): implement jwt authentication and login"
```

---

### Task 3: Gerenciamento de Snapshots (Manifestos)

**Files:**
- Create: `src/api/models/snapshot.py`
- Create: `src/api/routers/snapshots.py`

- [ ] **Step 1: Create Snapshot model**
```python
from pydantic import BaseModel
from typing import List, Dict

class FileEntry(BaseModel):
    path: str
    hash: str
    size: int

class Snapshot(BaseModel):
    profile_id: str
    version: str
    created_at: str
    files: List[FileEntry]
```

- [ ] **Step 2: Implement snapshot creation endpoint**
```python
@router.post("/")
async def create_snapshot(snapshot: Snapshot):
    await db.snapshots.insert_one(snapshot.dict())
    return {"message": "Snapshot created"}
```

- [ ] **Step 3: Commit snapshots**
```bash
git add src/api/models/snapshot.py src/api/routers/snapshots.py
git commit -m "feat(api): add snapshot management endpoints"
```

---

### Task 4: Algoritmo de Delta Sync

**Files:**
- Create: `src/api/logic/sync.py`
- Test: `tests/test_sync_logic.py`

- [ ] **Step 1: Write test for delta calculation**
```python
from src.api.logic.sync import calculate_delta

def test_calculate_delta():
    client_files = [
        {"path": "keep.mp3", "hash": "h1"},
        {"path": "delete.mp3", "hash": "h2"},
        {"path": "rename_old.mp3", "hash": "h3"}
    ]
    server_files = [
        {"path": "keep.mp3", "hash": "h1"},
        {"path": "new.mp3", "hash": "h4"},
        {"path": "rename_new.mp3", "hash": "h3"}
    ]
    
    delta = calculate_delta(client_files, server_files)
    assert "new.mp3" in delta["to_download"]
    assert "delete.mp3" in delta["to_delete"]
    # Logica de rename pode ser simplificada para delete/download no MVP
```

- [ ] **Step 2: Implement delta logic**
```python
def calculate_delta(client_files, server_files):
    client_dict = {f["path"]: f["hash"] for f in client_files}
    server_dict = {f["path"]: f["hash"] for f in server_files}
    
    to_download = []
    to_delete = []
    
    # Files to download or update
    for path, f_hash in server_dict.items():
        if path not in client_dict or client_dict[path] != f_hash:
            to_download.append(path)
            
    # Files to delete
    for path in client_dict.keys():
        if path not in server_dict:
            to_delete.append(path)
            
    return {"to_download": to_download, "to_delete": to_delete}
```

- [ ] **Step 3: Run tests and commit**
```bash
pytest tests/test_sync_logic.py
git add src/api/logic/sync.py tests/test_sync_logic.py
git commit -m "feat(api): implement delta sync logic"
```

---

### Task 5: Endpoint de Sincronização Final

**Files:**
- Create: `src/api/routers/sync.py`

- [ ] **Step 1: Implement sync endpoint**
```python
@router.post("/delta")
async def get_delta(client_manifest: dict):
    profile_id = client_manifest["profile_id"]
    current_version = client_manifest["version"]
    
    latest_snapshot = await db.snapshots.find_one(
        {"profile_id": profile_id}, 
        sort=[("created_at", -1)]
    )
    
    delta = calculate_delta(client_manifest["files"], latest_snapshot["files"])
    return {
        "latest_version": latest_snapshot["version"],
        "delta": delta
    }
```

- [ ] **Step 2: Register all routers in main.py**
```python
app.include_router(auth.router)
app.include_router(snapshots.router)
app.include_router(sync.router)
```

- [ ] **Step 3: Final commit and test**
```bash
git add src/api/
git commit -m "feat(api): integrate all modules and finalize sync endpoint"
```
