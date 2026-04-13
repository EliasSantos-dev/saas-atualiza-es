import pytest
from unittest.mock import patch, MagicMock
from src.engine.crawler import fetch_spotify_playlist

@patch('src.engine.crawler.get_spotify_client')
def test_fetch_spotify_playlist_success(mock_get_client):
    # Mock do cliente Spotify e da resposta da API
    mock_sp = MagicMock()
    mock_get_client.return_value = mock_sp
    
    mock_sp.playlist_items.return_value = {
        'items': [
            {
                'track': {
                    'name': 'Song Test',
                    'id': '123',
                    'artists': [{'name': 'Artist Test'}],
                    'album': {'images': [{'url': 'http://image.jpg'}]}
                }
            }
        ]
    }
    
    url = "https://open.spotify.com/playlist/37i9dQZEVXbMDoHDwfs2tB"
    tracks = fetch_spotify_playlist(url)
    
    assert len(tracks) == 1
    assert tracks[0]["title"] == "Song Test"
    assert tracks[0]["artist"] == "Artist Test"
    assert tracks[0]["search_query"] == "Artist Test - Song Test"
    assert tracks[0]["spotify_id"] == "123"

@patch('src.engine.crawler.get_spotify_client')
def test_fetch_spotify_playlist_no_client(mock_get_client):
    # Simula erro de configuração (sem chaves no .env)
    mock_get_client.return_value = None
    
    url = "https://some-url"
    tracks = fetch_spotify_playlist(url)
    
    assert tracks == []
