import os
import re
from src.engine.crawler import fetch_spotify_playlist
from src.engine.suamusica_crawler import fetch_suamusica_profile
from src.engine.palcomp3_crawler import fetch_palcomp3_profile
from src.engine.downloader import download_and_process

def sanitize_filename(name):
    return re.sub(r'[\\/*?:"<>|]', "", name).strip()

def process_track_list(tracks, target_dir, force_update=False):
    if not os.path.exists(target_dir):
        os.makedirs(target_dir, exist_ok=True)
    
    success_count = 0
    error_count = 0
    
    for i, track in enumerate(tracks):
        track_number = str(i + 1).zfill(2)
        filename = sanitize_filename(f"{track_number} - {track['artist']} - {track['title']}.mp3")
        final_path = os.path.join(target_dir, filename)
        
        if os.path.exists(final_path) and not force_update:
            continue
            
        print(f"[{i+1}/{len(tracks)}] Processando: {track['search_query']}...")
        
        # PRIORIDADE: Sua Música -> Palco MP3 -> YouTube
        # (Lógica simplificada para download via link direto se encontrado)
        
        try:
            # Tentar YouTube como fonte primária funcional (yt-dlp lida com links diretos)
            print(f"  - Baixando: {track['search_query']}...")
            download_and_process(f"ytsearch:{track['search_query']}", final_path, metadata=track)
            
            success_count += 1
        except Exception as e:
            print(f"  - Erro: {e}")
            error_count += 1
            
    return success_count, error_count

def sync_from_spotify(playlist_url, target_dir):
    tracks = fetch_spotify_playlist(playlist_url)
    return process_track_list(tracks, target_dir)

def sync_from_suamusica(profile_url, target_dir):
    cds = fetch_suamusica_profile(profile_url)
    total_success = 0
    total_error = 0
    
    for cd in cds:
        try:
            print(f"Baixando CD: {cd['title']}")
            download_and_process(cd['url'], os.path.join(target_dir, sanitize_filename(cd['title']) + ".mp3"))
            total_success += 1
        except Exception as e:
            print(f"Erro: {e}")
            total_error += 1
            
    return total_success, total_error
