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
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
    }
    response = requests.get(url, headers=headers)
    response.raise_for_status()
    return parse_spotify_playlist_html(response.text)
