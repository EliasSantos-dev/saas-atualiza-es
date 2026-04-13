# Finalização do Atualizador Local Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Finalizar o motor de atualização local, implementando o sistema de tags ID3 (incluindo capas) e um orquestrador que automatiza o fluxo de download e organização.

**Architecture:** Módulos Python independentes para cada etapa (Crawling, Download, Tagging) coordenados por um Orquestrador. O orquestrador gerencia a estrutura de pastas final (ex: HITS, FORRÓ).

**Tech Stack:** Python 3.12+, yt-dlp, ffmpeg, mutagen, requests, spotipy.

---

### Task 1: Gerenciador de Tags (ID3)

**Files:**
- Create: `src/engine/tagger.py`
- Test: `tests/test_tagger.py`

- [ ] **Step 1: Escrever teste de tagging (Mockado)**
```python
from unittest.mock import patch, MagicMock
from src.engine.tagger import apply_metadata

@patch('src.engine.tagger.MP3')
@patch('src.engine.tagger.requests.get')
def test_apply_metadata(mock_get, mock_mp3):
    mock_audio = MagicMock()
    mock_mp3.return_value = mock_audio
    
    metadata = {
        "title": "Musica Teste",
        "artist": "Artista Teste",
        "album": "Album Teste",
        "cover_url": "http://example.com/cover.jpg"
    }
    
    mock_get.return_value.content = b"fake_image_data"
    mock_get.return_value.status_code = 200
    
    apply_metadata("test.mp3", metadata)
    
    mock_audio.save.assert_called_once()
```

- [ ] **Step 2: Implementar apply_metadata com Mutagen**
```python
import requests
from mutagen.mp3 import MP3
from mutagen.id3 import ID3, TIT2, TPE1, TALB, APIC, ID3NoHeaderError

def apply_metadata(file_path, metadata):
    try:
        audio = MP3(file_path, ID3=ID3)
    except ID3NoHeaderError:
        audio = MP3(file_path)
        audio.add_tags()
    
    tags = audio.tags
    if tags is None:
        audio.add_tags()
        tags = audio.tags

    if 'title' in metadata:
        tags.add(TIT2(encoding=3, text=metadata['title']))
    if 'artist' in metadata:
        tags.add(TPE1(encoding=3, text=metadata['artist']))
    if 'album' in metadata:
        tags.add(TALB(encoding=3, text=metadata['album']))
    
    if 'cover_url' in metadata and metadata['cover_url']:
        try:
            response = requests.get(metadata['cover_url'], timeout=10)
            if response.status_code == 200:
                tags.add(APIC(
                    encoding=3,
                    mime='image/jpeg',
                    type=3, # 3 is for the album front cover
                    desc=u'Cover',
                    data=response.content
                ))
        except Exception as e:
            print(f"Erro ao baixar capa: {e}")
            
    audio.save()
```

---

### Task 2: Atualizar Downloader para suportar Tags

**Files:**
- Modify: `src/engine/downloader.py`

- [ ] **Step 1: Adicionar parâmetro metadata e chamada ao tagger**
```python
from src.engine.tagger import apply_metadata
# ... dentro de download_and_process(query_or_url, final_output_path, metadata=None) ...
    # Depois do subprocess.run(cmd, ...) bem sucedido:
    if metadata:
        apply_metadata(final_output_path, metadata)
```

---

### Task 3: Criar Orquestrador de Atualização Local

**Files:**
- Create: `src/engine/orchestrator.py`

- [ ] **Step 1: Implementar lógica de atualização de playlist/perfil**
```python
import os
from src.engine.crawler import fetch_spotify_playlist
from src.engine.downloader import download_and_process

def update_from_spotify(playlist_url, target_dir):
    os.makedirs(target_dir, exist_ok=True)
    tracks = fetch_spotify_playlist(playlist_url)
    
    for track in tracks:
        # Ex: "01 - Nome da Musica.mp3"
        filename = f"{track['artist']} - {track['title']}.mp3"
        # Limpa nome de arquivo
        filename = "".join([c for c in filename if c.isalnum() or c in (' ', '-', '.')]).strip()
        final_path = os.path.join(target_dir, filename)
        
        if not os.path.exists(final_path):
            print(f"Baixando: {track['search_query']}...")
            try:
                download_and_process(f"ytsearch:{track['search_query']}", final_path, metadata=track)
            except Exception as e:
                print(f"Erro ao baixar {track['search_query']}: {e}")
        else:
            print(f"Já existe: {filename}")
```

---

### Task 4: Interface CLI em main.py

**Files:**
- Modify: `main.py`

- [ ] **Step 1: Adicionar comandos para atualização local**
```python
import argparse
from src.engine.orchestrator import update_from_spotify

def main():
    parser = argparse.ArgumentParser(description="SaaS Atualiza - Engine de Música")
    subparsers = parser.add_subparsers(dest="command")
    
    # Comando para atualizar de Spotify
    sp_parser = subparsers.add_parser("sync-spotify")
    sp_parser.add_argument("url", help="URL da Playlist do Spotify")
    sp_parser.add_argument("--dir", default="data/processed/HITS", help="Diretório de destino")
    
    # Comando para gerar manifesto (existente)
    mf_parser = subparsers.add_parser("manifest")
    mf_parser.add_argument("--dir", required=True)
    
    args = parser.parse_args()
    
    if args.command == "sync-spotify":
        update_from_spotify(args.url, args.dir)
    elif args.command == "manifest":
        # ... logic de importer ...
        pass
```
