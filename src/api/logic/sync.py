def calculate_delta(client_files, server_files):
    """
    Compara o estado do pendrive com o estado ideal do servidor.
    Retorna um dicionário com:
    - to_download: lista de objetos {path, hash, size} que precisam ser baixados ou atualizados.
    - to_delete: lista de caminhos (strings) que devem ser removidos do pendrive.
    """
    client_dict = {f["path"]: f for f in client_files}
    server_dict = {f["path"]: f for f in server_files}
    
    to_download = []
    to_delete = []
    
    # 1. Verificar o que baixar/atualizar
    for path, server_file in server_dict.items():
        client_file = client_dict.get(path)
        
        # Se não existe no cliente OU se o hash é diferente
        if not client_file or client_file["hash"] != server_file["hash"]:
            to_download.append(server_file)
            
    # 2. Verificar o que apagar
    for path in client_dict.keys():
        if path not in server_dict:
            to_delete.append(path)
            
    return {
        "to_download": to_download,
        "to_delete": to_delete
    }
