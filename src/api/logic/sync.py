def calculate_delta(client_files, server_files):
    """
    Compara o estado do pendrive com o estado ideal do servidor.
    Detecta renomeações (mesmo hash, caminho diferente) para evitar re-downloads.
    """
    client_by_path = {f["path"]: f for f in client_files}
    server_by_path = {f["path"]: f for f in server_files}
    
    # Mapear arquivos do cliente por hash para busca rápida de renomeações
    # Usamos uma lista para o caso de o cliente ter músicas duplicadas com o mesmo hash
    client_by_hash = {}
    for f in client_files:
        client_by_hash.setdefault(f["hash"], []).append(f)
    
    to_download = []
    to_delete = []
    to_rename = []
    
    # Conjuntos para rastrear quais arquivos do cliente foram "usados" (mantidos ou renomeados)
    used_client_paths = set()
    
    # 1. Processar arquivos que devem estar no servidor
    for path, server_file in server_by_path.items():
        client_file = client_by_path.get(path)
        
        # Caso A: O arquivo já existe no mesmo caminho e com o mesmo hash
        if client_file and client_file["hash"] == server_file["hash"]:
            used_client_paths.add(path)
            continue
            
        # Caso B: O conteúdo existe no cliente, mas em outro caminho (Renomeação)
        # Procuramos nos arquivos do cliente que tenham o mesmo hash
        possible_renames = client_by_hash.get(server_file["hash"], [])
        found_rename = False
        for p_rename in possible_renames:
            # Se esse arquivo do cliente ainda não foi "usado" e não existe no servidor no caminho antigo
            if p_rename["path"] not in used_client_paths and p_rename["path"] not in server_by_path:
                to_rename.append({
                    "old_path": p_rename["path"],
                    "new_path": path
                })
                used_client_paths.add(p_rename["path"])
                found_rename = True
                break
        
        if found_rename:
            continue
            
        # Caso C: O arquivo não existe ou mudou o conteúdo -> Baixar
        to_download.append(server_file)
            
    # 2. Verificar o que sobrou no cliente que não foi usado -> Apagar
    for path in client_by_path.keys():
        if path not in used_client_paths:
            to_delete.append(path)
            
    return {
        "to_download": to_download,
        "to_delete": to_delete,
        "to_rename": to_rename
    }
