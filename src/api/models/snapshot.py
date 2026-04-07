from pydantic import BaseModel
from typing import List
from datetime import datetime

class FileEntry(BaseModel):
    path: str
    hash: str
    size: int

class Snapshot(BaseModel):
    profile_id: str
    version: str
    created_at: datetime = datetime.now()
    files: List[FileEntry]
