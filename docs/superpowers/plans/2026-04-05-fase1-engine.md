# Fase 1: Engine de Processamento e Crawler Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Desenvolver o motor core em Python capaz de baixar CDs do Sua Música/YouTube, converter para 320kbps, normalizar o áudio e organizar em pastas.

**Architecture:** Scripts modulares em Python utilizando `yt-dlp` para extração e `ffmpeg` para processamento pesado de áudio. A organização segue um padrão de "Build" local simulando o pendrive de 16GB.

**Tech Stack:** Python 3.13+, yt-dlp, ffmpeg, mutagen (ID3 tags).

---

### Task 1: Setup do Ambiente e Dependências

**Files:**
- Create: `requirements.txt`
- Create: `.gitignore`

- [x] **Step 1: Criar arquivo de requisitos**
```text
yt-dlp
mutagen
requests
beautifulsoup4
```

- [x] **Step 2: Instalar dependências via pip**
Run: `pip install -r requirements.txt`

- [x] **Step 3: Criar .gitignore para evitar lixo no repo**
```text
__pycache__/
*.mp3
*.zip
*.rar
data/
venv/
```

- [x] **Step 4: Commit inicial do ambiente**
```bash
git add requirements.txt .gitignore
git commit -m "chore: setup initial python environment"
```

---

### Task 2: Módulo de Download (Sua Música / YouTube)

**Files:**
- Create: `src/engine/downloader.py`
- Test: `tests/test_downloader.py`

- [ ] **Step 1: Criar teste de download básico**
```python
import os
from src.engine.downloader import download_track

def test_download_sm_track():
    url = "https://www.suamusica.com.br/kelcds/16gb-atualizacao-abril-2026" # Link exemplo
    output_path = "data/cache/test_track.mp3"
    result = download_track(url, output_path)
    assert os.path.exists(output_path)
```

- [ ] **Step 2: Implementar o wrapper do yt-dlp**
```python
import yt_dlp

def download_track(url, output_path):
    ydl_opts = {
        'format': 'bestaudio/best',
        'outtmpl': output_path,
        'quiet': True,
        'no_warnings': True,
    }
    with yt_dlp.YoutubeDL(ydl_opts) as ydl:
        ydl.download([url])
    return output_path
```

- [ ] **Step 3: Rodar teste e validar download no cache**
Run: `pytest tests/test_downloader.py`

---

### Task 3: Processador de Áudio (FFmpeg Wrapper)

**Files:**
- Create: `src/engine/processor.py`
- Test: `tests/test_processor.py`

- [ ] **Step 1: Criar teste de conversão e normalização**
```python
from src.engine.processor import process_audio

def test_process_audio_quality():
    input_file = "data/cache/test_track.mp3"
    output_file = "data/processed/test_track_final.mp3"
    process_audio(input_file, output_file)
    # Aqui checaríamos bitrate se tivéssemos ffprobe
```

- [ ] **Step 2: Implementar processamento com FFmpeg**
```python
import subprocess

def process_audio(input_path, output_path):
    # Comando para 320kbps + Normalização Loudness
    cmd = [
        'ffmpeg', '-y', '-i', input_path,
        '-af', 'loudnorm=I=-14:TP=-1.5:LRA=11',
        '-ab', '320k', '-ar', '44100',
        output_path
    ]
    subprocess.run(cmd, check=True)
```

---

### Task 4: Gerenciador de Tags (ID3)

**Files:**
- Create: `src/engine/tagger.py`

- [ ] **Step 1: Implementar injeção de metadados e capa**
```python
from mutagen.mp3 import MP3
from mutagen.id3 import ID3, TIT2, TPE1, TALB, APIC

def apply_tags(file_path, metadata):
    audio = MP3(file_path, ID3=ID3)
    audio.add_tags()
    audio.tags.add(TIT2(encoding=3, text=metadata['title']))
    audio.tags.add(TPE1(encoding=3, text=metadata['artist']))
    audio.tags.add(TALB(encoding=3, text=metadata['album']))
    # Logica de APIC para imagem aqui...
    audio.save()
```

---

### Task 5: Script de Integração (O Robô)

**Files:**
- Create: `main.py`

- [ ] **Step 1: Criar o fluxo completo de um CD**
```python
from src.engine.downloader import download_track
from src.engine.processor import process_audio
from src.engine.tagger import apply_tags

def build_cd(url, target_folder):
    # 1. Download -> data/cache
    # 2. Process -> data/processed/target_folder
    # 3. Tag -> Meta extraído do Crawler
    pass

if __name__ == "__main__":
    # Teste manual com um link
    pass
```
