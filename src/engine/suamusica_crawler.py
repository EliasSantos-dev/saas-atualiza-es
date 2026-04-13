import requests
from bs4 import BeautifulSoup
import json
import re

def fetch_suamusica_profile(profile_url):
    """
    Busca as informações do perfil do Sua Música usando extração de metadados robusta.
    """
    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
    }
    
    try:
        response = requests.get(profile_url, headers=headers)
        response.raise_for_status()
        soup = BeautifulSoup(response.text, 'html.parser')
        
        cds = []
        
        # Técnica Robusta 1: Buscar no JSON estruturado (LD+JSON)
        # O Sua Música costuma colocar a lista de álbuns no HTML como 'box-music'
        # Mas para garantir, vamos buscar todos os links que contenham o padrão de CD
        boxes = soup.find_all('div', class_='box-music')
        
        for box in boxes:
            link_elem = box.find('a', class_='title')
            if link_elem:
                title = link_elem.text.strip()
                url = link_elem['href']
                
                # Garante que a URL é completa
                if url.startswith('/'):
                    url = f"https://www.suamusica.com.br{url}"
                
                cds.append({
                    "title": title,
                    "url": url,
                    "source": "suamusica"
                })
        
        # Se não achou nada por classe, tenta uma busca genérica por links de CD
        if not cds:
            for link in soup.find_all('a', href=re.compile(r'/[^/]+/.+')):
                if 'cd-' in link['href'] or 'album-' in link['href']:
                    cds.append({
                        "title": link.text.strip() or "CD Sem Título",
                        "url": f"https://www.suamusica.com.br{link['href']}" if link['href'].startswith('/') else link['href'],
                        "source": "suamusica"
                    })
                    
        return cds
    except Exception as e:
        print(f"Erro ao crawlear Sua Música: {e}")
        return []

def get_cd_download_link(cd_url):
    """
    Entra na página do CD e tenta encontrar o link direto de download do ZIP.
    """
    headers = {'User-Agent': 'Mozilla/5.0'}
    try:
        res = requests.get(cd_url, headers=headers)
        # O link de download real geralmente é processado via JS, 
        # mas o ID do álbum está no HTML. O yt-dlp consegue lidar com isso melhor.
        return cd_url # Retornamos a URL para o yt-dlp processar
    except:
        return None

if __name__ == "__main__":
    # Teste com o perfil de exemplo
    url = "https://www.suamusica.com.br/kelcds"
    print(f"Buscando CDs em: {url}")
    items = fetch_suamusica_profile(url)
    for item in items[:5]:
        print(f"- {item['title']} -> {item['url']}")
