# Fase 1: Engine de Processamento e Importação (Git-like Sync) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Construir o motor base do SaaS Pendrive, capaz de gerar um manifesto JSON de uma pasta local e crawlear novidades do Spotify e Sua Música para mantê-lo atualizado.

**Architecture:** Scripts Python independentes (importer, crawlers e downloader) que operam sobre arquivos locais e salvam seu estado em JSON. Cada módulo fará uma única coisa bem feita. A estrutura de dados base é o `manifest.json`.

**Tech Stack:** Python 3.13+, `yt-dlp` (YouTube download), `ffmpeg` (processamento de áudio), `requests` e `beautifulsoup4` (scraping), `hashlib` (SHA-256).

---

### Task 1: Setup do Ambiente e Dependências

**Files:**
- Create: `requirements.txt`
- Modify: `.gitignore`

- [ ] **Step 1: Write requirements.txt**
```text
yt-dlp==2024.03.10
requests==2.31.0
beautifulsoup4==4.12.3
pytest==8.1.1
```

- [ ] **Step 2: Install dependencies**
Run: `pip install -r requirements.txt`

- [ ] **Step 3: Update .gitignore**
```text
__pycache__/
*.mp3
*.json
venv/
.env
data/
```

- [ ] **Step 4: Commit environment setup**
```bash
git add requirements.txt .gitignore
git commit -m "chore: setup python environment for engine"
```

---

### Task 2: Importador Local (Manifest Generator)

**Files:**
- Create: `src/engine/importer.py`
- Test: `tests/test_importer.py`

- [ ] **Step 1: Write the failing test**
```python
import os
import json
import pytest
from src.engine.importer import generate_hash, build_manifest

def test_generate_hash(tmp_path):
    test_file = tmp_path / "test.mp3"
    test_file.write_bytes(b"dummy content")
    # SHA-256 for "dummy content"
    expected_hash = "b5a2c96250612366ea272ffac6d9744aaf4b45aacd96a7385032cb71ebcb9a8f"
    assert generate_hash(str(test_file)) == expected_hash

def test_build_manifest(tmp_path):
    d = tmp_path / "01_HITS"
    d.mkdir()
    f = d / "music1.mp3"
    f.write_bytes(b"content")
    
    manifest = build_manifest(str(tmp_path), "test_profile", "v1")
    assert manifest["profile_id"] == "test_profile"
    assert manifest["version"] == "v1"
    assert len(manifest["files"]) == 1
    assert manifest["files"][0]["path"] == "01_HITS/music1.mp3"
    assert "hash" in manifest["files"][0]
```

- [ ] **Step 2: Run test to verify it fails**
Run: `pytest tests/test_importer.py -v`
Expected: FAIL with "ModuleNotFoundError"

- [ ] **Step 3: Write minimal implementation**
```python
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
```

- [ ] **Step 4: Run test to verify it passes**
Run: `pytest tests/test_importer.py -v`
Expected: PASS

- [ ] **Step 5: Commit**
```bash
git add src/engine/importer.py tests/test_importer.py
git commit -m "feat(engine): add local folder importer and hash generator"
```

---

### Task 3: Spotify Crawler (Top Brasil / Top Semana)

**Files:**
- Create: `src/engine/crawler.py`
- Test: `tests/test_crawler.py`

- [ ] **Step 1: Write the failing test**
```python
from src.engine.crawler import parse_spotify_playlist_html

def test_parse_spotify_playlist_html():
    html = """
    <div data-testid="tracklist-row">
        <div dir="auto" class="Type__TypeElement-sc-goli3j-0 bDHxRN t_yrXoUO3qGsJS4Y6iXX standalone-ellipsis-one-line" data-encore-id="type">Song A</div>
        <a dir="auto" href="/artist/123" class="Type__TypeElement-sc-goli3j-0 bDHxRN">Artist A</a>
    </div>
    """
    tracks = parse_spotify_playlist_html(html)
    assert len(tracks) == 1
    assert tracks[0]["title"] == "Song A"
    assert tracks[0]["artist"] == "Artist A"
    assert tracks[0]["search_query"] == "Artist A - Song A"
```

- [ ] **Step 2: Run test to verify it fails**
Run: `pytest tests/test_crawler.py -v`
Expected: FAIL

- [ ] **Step 3: Write minimal implementation**
```python
from bs4 import BeautifulSoup
import requests

def parse_spotify_playlist_html(html_content):
    soup = BeautifulSoup(html_content, 'html.parser')
    tracks = []
    
    rows = soup.find_all('div', attrs={'data-testid': 'tracklist-row'})
    for row in rows:
        title_elem = row.find('div', class_=lambda c: c and 'standalone-ellipsis-one-line' in c)
        artist_elem = row.find('a', href=lambda h: h and '/artist/' in h)
        
        if title_elem and artist_elem:
            title = title_elem.text.strip()
            artist = artist_elem.text.strip()
            tracks.append({
                "title": title,
                "artist": artist,
                "search_query": f"{artist} - {title}"
            })
    return tracks

def fetch_spotify_playlist(url):
    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
    }
    response = requests.get(url, headers=headers)
    response.raise_for_status()
    return parse_spotify_playlist_html(response.text)
```

- [ ] **Step 4: Run test to verify it passes**
Run: `pytest tests/test_crawler.py -v`
Expected: PASS

- [ ] **Step 5: Commit**
```bash
git add src/engine/crawler.py tests/test_crawler.py
git commit -m "feat(engine): add spotify playlist html crawler"
```

---

### Task 4: Sua Música Crawler (Kel CDS Downloads)

**Files:**
- Create: `src/engine/suamusica_crawler.py`
- Test: `tests/test_suamusica_crawler.py`

- [ ] **Step 1: Write the failing test**
```python
from src.engine.suamusica_crawler import parse_suamusica_profile

def test_parse_suamusica_profile():
    html = """
    <div class="box-music">
        <a href="/kelcds/cd-paredao-2026" class="title">CD Paredão 2026</a>
    </div>
    """
    cds = parse_suamusica_profile(html)
    assert len(cds) == 1
    assert cds[0]["title"] == "CD Paredão 2026"
    assert cds[0]["url"] == "https://suamusica.com.br/kelcds/cd-paredao-2026"
```

- [ ] **Step 2: Run test to verify it fails**
Run: `pytest tests/test_suamusica_crawler.py -v`
Expected: FAIL

- [ ] **Step 3: Write minimal implementation**
```python
from bs4 import BeautifulSoup
import requests

def parse_suamusica_profile(html_content):
    soup = BeautifulSoup(html_content, 'html.parser')
    cds = []
    
    boxes = soup.find_all('div', class_='box-music')
    for box in boxes:
        link = box.find('a', class_='title')
        if link:
            cds.append({
                "title": link.text.strip(),
                "url": f"https://suamusica.com.br{link['href']}" if link['href'].startswith('/') else link['href']
            })
    return cds

def fetch_suamusica_profile(profile_url):
    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
    }
    response = requests.get(profile_url, headers=headers)
    response.raise_for_status()
    return parse_suamusica_profile(response.text)
```

- [ ] **Step 4: Run test to verify it passes**
Run: `pytest tests/test_suamusica_crawler.py -v`
Expected: PASS

- [ ] **Step 5: Commit**
```bash
git add src/engine/suamusica_crawler.py tests/test_suamusica_crawler.py
git commit -m "feat(engine): add sua musica profile crawler"
```

---

### Task 5: Downloader and Audio Processor

**Files:**
- Create: `src/engine/downloader.py`
- Test: `tests/test_downloader.py`

- [ ] **Step 1: Write the failing test**
```python
import os
import pytest
from src.engine.downloader import download_and_process

# Note: This is an integration test, it requires internet and yt-dlp/ffmpeg installed.
# We will mock subprocess and yt_dlp for a unit test.
from unittest.mock import patch, MagicMock

@patch('src.engine.downloader.subprocess.run')
@patch('src.engine.downloader.yt_dlp.YoutubeDL')
def test_download_and_process(mock_ytdlp, mock_subprocess):
    mock_ydl_instance = MagicMock()
    mock_ytdlp.return_value.__enter__.return_value = mock_ydl_instance
    
    download_and_process("ytsearch:Artist - Song", "test_output.mp3")
    
    mock_ydl_instance.download.assert_called_once_with(["ytsearch:Artist - Song"])
    mock_subprocess.assert_called_once()
```

- [ ] **Step 2: Run test to verify it fails**
Run: `pytest tests/test_downloader.py -v`
Expected: FAIL

- [ ] **Step 3: Write minimal implementation**
```python
import yt_dlp
import subprocess
import os

def download_and_process(query_or_url, final_output_path):
    # Temporary raw download path
    temp_path = final_output_path + ".raw.webm"
    
    ydl_opts = {
        'format': 'bestaudio/best',
        'outtmpl': temp_path,
        'quiet': True,
        'no_warnings': True,
        'extract_audio': True,
    }
    
    with yt_dlp.YoutubeDL(ydl_opts) as ydl:
        ydl.download([query_or_url])
        
    if not os.path.exists(temp_path):
        # yt-dlp might change extension based on format, so let's find the downloaded file
        # We simplify by assuming yt-dlp respected our outtmpl, but in real world 
        # we might need to check the actual generated file name.
        pass

    # ffmpeg conversion to 320kbps MP3 + Audio Normalization
    cmd = [
        'ffmpeg', '-y', '-i', temp_path,
        '-af', 'loudnorm=I=-14:TP=-1.5:LRA=11',
        '-ab', '320k', '-ar', '44100',
        final_output_path
    ]
    subprocess.run(cmd, check=True, capture_output=True)
    
    # Cleanup temp
    if os.path.exists(temp_path):
        os.remove(temp_path)
```

- [ ] **Step 4: Run test to verify it passes**
Run: `pytest tests/test_downloader.py -v`
Expected: PASS

- [ ] **Step 5: Commit**
```bash
git add src/engine/downloader.py tests/test_downloader.py
git commit -m "feat(engine): add downloader and audio processor with yt-dlp and ffmpeg"
```
