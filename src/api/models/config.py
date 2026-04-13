from pydantic import BaseModel
from typing import Dict, Optional

class FolderRule(BaseModel):
    max_files: Optional[int] = None
    link: Optional[str] = None

class ProfileConfig(BaseModel):
    profile_id: str
    max_size_gb: float = 14.0
    folder_rules: Dict[str, FolderRule] = {}
