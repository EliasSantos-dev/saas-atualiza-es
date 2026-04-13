from src.api.logic.sync import calculate_delta

def test_calculate_delta_nothing_to_change():
    client_files = [{"path": "m1.mp3", "hash": "h1", "size": 100}]
    server_files = [{"path": "m1.mp3", "hash": "h1", "size": 100}]
    delta = calculate_delta(client_files, server_files)
    assert len(delta["to_download"]) == 0
    assert len(delta["to_delete"]) == 0

def test_calculate_delta_new_file():
    client_files = []
    server_files = [{"path": "new.mp3", "hash": "h2", "size": 200}]
    delta = calculate_delta(client_files, server_files)
    assert len(delta["to_download"]) == 1
    assert delta["to_download"][0]["path"] == "new.mp3"
    assert len(delta["to_delete"]) == 0

def test_calculate_delta_delete_old_file():
    client_files = [{"path": "old.mp3", "hash": "h0", "size": 50}]
    server_files = []
    delta = calculate_delta(client_files, server_files)
    assert len(delta["to_download"]) == 0
    assert len(delta["to_delete"]) == 1
    assert delta["to_delete"][0] == "old.mp3"

def test_calculate_delta_updated_file():
    # Se o hash mudou, tem que baixar de novo
    client_files = [{"path": "song.mp3", "hash": "h_old", "size": 100}]
    server_files = [{"path": "song.mp3", "hash": "h_new", "size": 100}]
    delta = calculate_delta(client_files, server_files)
    assert len(delta["to_download"]) == 1
    assert delta["to_download"][0]["path"] == "song.mp3"

def test_calculate_delta_rename_file():
    # O hash é o mesmo, mas o caminho mudou
    client_files = [{"path": "01. Musica.mp3", "hash": "hash_top", "size": 100}]
    server_files = [{"path": "05. Musica.mp3", "hash": "hash_top", "size": 100}]
    
    delta = calculate_delta(client_files, server_files)
    
    # Não deve baixar, deve renomear
    assert len(delta["to_download"]) == 0
    assert len(delta["to_delete"]) == 0
    assert len(delta["to_rename"]) == 1
    assert delta["to_rename"][0]["old_path"] == "01. Musica.mp3"
    assert delta["to_rename"][0]["new_path"] == "05. Musica.mp3"
