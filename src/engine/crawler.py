import os
import spotipy
from spotipy.oauth2 import SpotifyClientCredentials
from dotenv import load_dotenv

# Carrega as chaves do arquivo .env
load_dotenv()

def get_spotify_client():
    """
    Inicializa o cliente do Spotify usando Client ID e Client Secret.
    """
    client_id = os.getenv("SPOTIPY_CLIENT_ID")
    client_secret = os.getenv("SPOTIPY_CLIENT_SECRET")
    
    if not client_id or not client_secret:
        # Se não houver chaves, retornamos None para que o sistema saiba que está desativado
        return None
        
    auth_manager = SpotifyClientCredentials(client_id=client_id, client_secret=client_secret)
    return spotipy.Spotify(auth_manager=auth_manager)

def fetch_spotify_playlist(playlist_url):
    """
    Busca todas as músicas de uma playlist usando a API Oficial.
    """
    sp = get_spotify_client()
    if not sp:
        print("Erro: Chaves do Spotify não configuradas no .env")
        return []

    try:
        # Extrai o ID da playlist da URL
        playlist_id = playlist_url.split("/")[-1].split("?")[0]
        
        results = sp.playlist_items(playlist_id)
        tracks = []
        
        for item in results['items']:
            track = item['track']
            if track:
                title = track['name']
                artist = track['artists'][0]['name']
                tracks.append({
                    "title": title,
                    "artist": artist,
                    "search_query": f"{artist} - {title}",
                    "spotify_id": track['id'],
                    "cover_url": track['album']['images'][0]['url'] if track['album']['images'] else None
                })
        
        return tracks
    except Exception as e:
        print(f"Erro ao buscar playlist do Spotify: {e}")
        return []

if __name__ == "__main__":
    # Teste rápido (ex: Top 50 Brasil)
    test_url = "https://open.spotify.com/playlist/37i9dQZEVXbMDoHDwfs2tB"
    print(f"Buscando músicas de: {test_url}")
    songs = fetch_spotify_playlist(test_url)
    for s in songs[:5]: # Mostra as 5 primeiras
        print(f"- {s['search_query']}")
