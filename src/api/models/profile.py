from pydantic import BaseModel
from typing import Optional

class Profile(BaseModel):
    id: str
    name: str
    source_type: str # 'spotify' or 'suamusica'
    source_url: str
    target_dir: str
    auto_update: bool = False

class ProfileUpdate(BaseModel):
    auto_update: Optional[bool] = None
    source_url: Optional[str] = None
