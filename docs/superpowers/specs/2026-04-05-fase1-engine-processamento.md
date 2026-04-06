# Spec Técnica - Fase 1: Engine de Processamento e Crawler

## 1. Objetivo
Desenvolver o "Coração" do sistema: um conjunto de scripts em Python que automatizam a captura, conversão, tratamento e organização de músicas e CDs completos vindos de fontes externas (Sua Música e YouTube).

## 2. Requisitos Funcionais

### 2.1. Extração (Crawler/Scraper)
*   **Módulo Sua Música:** 
    *   Deve receber a URL de um CD (ex: `suamusica.com.br/artista/cd-nome`).
    *   Extrair o título do CD, nome do artista e a imagem de capa.
    *   Identificar todos os links de download das faixas individuais ou do arquivo .zip completo.
*   **Módulo YouTube:** 
    *   Deve receber a URL de um vídeo ou de uma Playlist completa.
    *   Extrair o áudio na maior qualidade disponível (m4a/opus) antes da conversão.

### 2.2. Processamento de Áudio (O "Padrão Ouro")
Todo arquivo processado deve passar pelo pipeline:
1.  **Conversão:** Usar `ffmpeg` para converter para MP3 com bitrate de **320kbps** e sample rate de **44100Hz**.
2.  **Normalização de Ganho:** Aplicar normalização de pico e loudness (EBU R128) para garantir que o usuário não precise ajustar o volume do rádio entre uma música e outra.
3.  **Trim de Silêncio:** Remover silêncios desnecessários no início e no fim das faixas (comum em ripar do YouTube).

### 2.3. Enriquecimento de Metadados (ID3 Tags)
*   **Tag Titulo:** Nome limpo (ex: "Ficar Por Ficar").
*   **Tag Artista:** Nome do artista principal.
*   **Tag Álbum:** Nome do CD ou da Pasta (ex: "01. HITS - Abril 2026").
*   **Tag Capa:** Inserir a imagem (JPG/PNG) dentro do arquivo MP3 (essencial para multimídias).
*   **Nomenclatura do Arquivo:** `01 - Nome da Musica.mp3`.

## 3. Pilha Tecnológica
*   **Linguagem:** Python 3.10+.
*   **Bibliotecas Core:**
    *   `yt-dlp`: Para lidar com os downloads (suporta Sua Música e YouTube).
    *   `ffmpeg-python`: Interface para o motor de áudio FFMPEG.
    *   `mutagen`: Para manipulação de tags ID3.
    *   `requests` & `BeautifulSoup4`: Para scraping de metadados extras se necessário.

## 4. Estrutura de Pastas Temporária (Local)
O robô trabalhará inicialmente no seu disco rígido:
```
/data/
  /cache/ (Arquivos originais baixados)
  /processed/ (Arquivos MP3 320kbps finais)
    /Profile_Default/
      /01. HITS/
      /02. FORRÓ/
      ...
```

## 5. Critérios de Aceite
1.  O script recebe uma URL e entrega uma pasta com os arquivos MP3 perfeitamente nomeados e tagueados.
2.  O volume das músicas baixadas de fontes diferentes deve soar idêntico ao ouvido humano.
3.  A capa do CD deve aparecer corretamente no Windows Explorer e em players de música comuns.
