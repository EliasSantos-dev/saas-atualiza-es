import { Injectable, Logger } from '@nestjs/common';
import axios from 'axios';
import * as cheerio from 'cheerio';

export interface CrawledItem {
  title: string;
  url: string;
  source: 'suamusica' | 'palcomp3';
  artist?: string;
}

@Injectable()
export class CrawlerService {
  private readonly logger = new Logger(CrawlerService.name);
  private readonly userAgent = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';

  async crawlSuaMusica(profileUrl: string): Promise<CrawledItem[]> {
    try {
      this.logger.log(`Buscando CDs no SuaMusica: ${profileUrl}`);
      
      const { data } = await axios.get(profileUrl, {
        headers: { 'User-Agent': this.userAgent }
      });
      
      const $ = cheerio.load(data);
      const cds: CrawledItem[] = [];

      // Seletor Principal: box-music (usado na versão estável do Python)
      $('.box-music').each((_, el) => {
        const titleElem = $(el).find('a.title');
        const title = titleElem.text().trim();
        let url = titleElem.attr('href');

        if (title && url) {
          if (url.startsWith('/')) {
            url = `https://www.suamusica.com.br${url}`;
          }
          cds.push({ title, url, source: 'suamusica' });
        }
      });

      // Fallback: Busca genérica por links de CD/Álbum (conforme lógica Python)
      if (cds.length === 0) {
        $('a').each((_, el) => {
          const href = $(el).attr('href') || '';
          if (href.includes('/cd-') || href.includes('/album-')) {
            const title = $(el).text().trim() || 'CD Sem Título';
            const url = href.startsWith('/') ? `https://www.suamusica.com.br${href}` : href;
            cds.push({ title, url, source: 'suamusica' });
          }
        });
      }

      this.logger.log(`Encontrados ${cds.length} itens no SuaMusica.`);
      return cds;
    } catch (error) {
      this.logger.error(`Erro no crawl SuaMusica: ${error.message}`);
      return [];
    }
  }

  async crawlPalcoMP3(profileUrl: string): Promise<CrawledItem[]> {
    try {
      this.logger.log(`Buscando músicas no PalcoMP3: ${profileUrl}`);
      
      const { data } = await axios.get(profileUrl, {
        headers: { 'User-Agent': this.userAgent }
      });
      
      const $ = cheerio.load(data);
      const songs: CrawledItem[] = [];

      $('.song-item').each((_, el) => {
        const titleElem = $(el).find('.song-name');
        const artistElem = $(el).find('.artist-name');
        const linkElem = $(el).find('a').first();

        const title = titleElem.text().trim();
        const artist = artistElem.text().trim() || 'Artista Desconhecido';
        let url = linkElem.attr('href');

        if (title && url) {
          if (url.startsWith('/')) {
            url = `https://www.palcomp3.com.br${url}`;
          }
          songs.push({ title, artist, url, source: 'palcomp3' });
        }
      });

      this.logger.log(`Encontrados ${songs.length} itens no PalcoMP3.`);
      return songs;
    } catch (error) {
      this.logger.error(`Erro no crawl PalcoMP3: ${error.message}`);
      return [];
    }
  }
}
