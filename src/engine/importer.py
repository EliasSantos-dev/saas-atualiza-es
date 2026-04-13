import os
import hashlib
import json

def generate_hash(filepath):
    sha256_hash = hashlib.sha256()
    with open(filepath, "rb") as f:
        for byte_block in iter(lambda: f.read(4096), b""):
            sha256_hash.update(byte_block)
    return sha256_hash.hexdigest()

def build_manifest(root_dir, profile_id, version, config_data=None):
    # Se config_data for fornecido, usamos as regras dele. 
    # Senão, usamos defaults (14GB e links padrão).
    max_size_gb = config_data.get("max_size_gb", 14.0) if config_data else 14.0
    folder_rules = config_data.get("folder_rules", {}) if config_data else {}
    
    max_size_bytes = max_size_gb * 1024 * 1024 * 1024
    current_size = 0
    
    manifest = {
        "profile_id": profile_id,
        "version": version,
        "files": [],
        "folder_links": {}
    }
    
    # 1. Coleta e processa pastas com suas regras
    for folder_name in sorted(os.listdir(root_dir)):
        folder_path = os.path.join(root_dir, folder_name)
        if not os.path.isdir(folder_path):
            continue

        # Regra do link
        rule = folder_rules.get(folder_name, {})
        custom_link = rule.get("link")
        manifest["folder_links"][folder_name] = custom_link or f"https://download.pulsedrive.com/v1/{folder_name.replace(' ', '_')}"

        # Regra de limite de arquivos (ex: max 50 hits)
        max_files = rule.get("max_files")
        
        folder_files = []
        for dirpath, _, filenames in os.walk(folder_path):
            for filename in filenames:
                if filename.endswith(".mp3"):
                    full_path = os.path.join(dirpath, filename)
                    # Adiciona temporariamente para ordenar e limitar
                    folder_files.append({
                        "full_path": full_path,
                        "mtime": os.path.getmtime(full_path)
                    })
        
        # Ordena por data de modificação (mais novos primeiro) ou alfabético
        # Aqui vamos usar mtime descending para os "Hits" mais novos
        folder_files.sort(key=lambda x: x["mtime"], reverse=True)
        
        if max_files:
            folder_files = folder_files[:max_files]
            print(f"Limitando {folder_name} para {max_files} arquivos.")

        # 2. Gera hashes e adiciona ao manifesto (respeitando o limite global de GB)
        for f_info in folder_files:
            full_path = f_info["full_path"]
            file_size = os.path.getsize(full_path)
            
            if current_size + file_size > max_size_bytes:
                print(f"Aviso: Limite Global de {max_size_gb}GB atingido. Parando processamento.")
                return manifest
            
            rel_path = os.path.relpath(full_path, root_dir)
            rel_path = rel_path.replace("\\", "/")
            file_hash = generate_hash(full_path)
            
            manifest["files"].append({
                "path": rel_path,
                "hash": file_hash,
                "size": file_size
            })
            current_size += file_size
                
    return manifest
