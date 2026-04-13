import requests
from bs4 import BeautifulSoup
import re

def fetch_palcomp3_profile(profile_url):
    """
    Busca músicas de um perfil no Palco MP3.
    """
    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
    }
    
    try:
        response = requests.get(profile_url, headers=headers)
        response.raise_for_status()
        soup = BeautifulSoup(response.text, 'html.parser')
        
        songs = []
        # O Palco MP3 costuma listar músicas em elementos com classe 'song-item' ou similares
        items = soup.select('.song-item')
        
        for item in items:
            title = item.select_one('.song-name')
            artist = item.select_one('.artist-name')
            link = item.select_one('a')
            
            if title and link:
                songs.append({
                    "title": title.text.strip(),
                    "artist": artist.text.strip() if artist else "Artista Desconhecido",
                    "url": f"https://palcomp3.com.br{link['href']}",
                    "source": "palcomp3"
                })
        return songs
    except Exception as e:
        print(f"Erro ao crawlear Palco MP3: {e}")
        return []
