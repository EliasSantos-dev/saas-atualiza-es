import spotipy
from spotipy.oauth2 import SpotifyClientCredentials
from dotenv import load_dotenv
import os

load_dotenv()

def debug_connection():
    client_id = os.getenv("SPOTIPY_CLIENT_ID")
    client_secret = os.getenv("SPOTIPY_CLIENT_SECRET")
    
    if not client_id or not client_secret:
        print("Erro: Credenciais não carregadas no .env")
        return

    print(f"DEBUG: Carregando Spotify com Client ID: {client_id[:5]}...")

    try:
        auth_manager = SpotifyClientCredentials(client_id=client_id, client_secret=client_secret)
        sp = spotipy.Spotify(auth_manager=auth_manager)
        
        # Teste com uma playlist pública famosa
        test_url = "https://open.spotify.com/playlist/37i9dQZEVXbMDoHDwfs2tB"
        results = sp.playlist_items(test_url)
        print("Sucesso! API está funcionando e a conta tem acesso.")
        print(f"Total de músicas encontradas: {len(results['items'])}")
        
    except Exception as e:
        print(f"Erro na API: {str(e)}")

if __name__ == "__main__":
    debug_connection()
