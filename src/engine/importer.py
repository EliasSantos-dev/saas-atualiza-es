import os
import hashlib
import json

def generate_hash(filepath):
    sha256_hash = hashlib.sha256()
    with open(filepath, "rb") as f:
        for byte_block in iter(lambda: f.read(4096), b""):
            sha256_hash.update(byte_block)
    return sha256_hash.hexdigest()

def build_manifest(root_dir, profile_id, version):
    manifest = {
        "profile_id": profile_id,
        "version": version,
        "files": []
    }
    
    for dirpath, _, filenames in os.walk(root_dir):
        for filename in filenames:
            if filename.endswith(".mp3"):
                full_path = os.path.join(dirpath, filename)
                rel_path = os.path.relpath(full_path, root_dir)
                # Normalize slashes for JSON
                rel_path = rel_path.replace("\\", "/")
                file_hash = generate_hash(full_path)
                
                manifest["files"].append({
                    "path": rel_path,
                    "hash": file_hash,
                    "size": os.path.getsize(full_path)
                })
                
    return manifest
