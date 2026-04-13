import subprocess
import sys

def fetch_spotify_playlist(playlist_url):
    """
    Extrai faixas de uma playlist usando yt-dlp e captura logs detalhados de erro.
    """
    try:
        cmd = [
            sys.executable, "-m", "yt_dlp",
            "--flat-playlist",
            "--print", "title",
            playlist_url
        ]
        
        result = subprocess.run(cmd, capture_output=True, text=True, check=True)
        
        tracks = []
        for line in result.stdout.splitlines():
            full_title = line.strip()
            if ' - ' in full_title:
                artist, title = full_title.split(' - ', 1)
            else:
                artist, title = "Desconhecido", full_title
            
            tracks.append({
                "title": title.strip(),
                "artist": artist.strip(),
                "search_query": f"{artist.strip()} - {title.strip()}"
            })
            
        return tracks
        
    except subprocess.CalledProcessError as e:
        # AQUI VEM O ERRO REAL
        print(f"DEBUG: O yt-dlp falhou. Mensagem de erro do sistema: {e.stderr}")
        return []
    except Exception as e:
        print(f"Erro inesperado: {e}")
        return []
