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
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
    }
    response = requests.get(profile_url, headers=headers)
    response.raise_for_status()
    return parse_suamusica_profile(response.text)
