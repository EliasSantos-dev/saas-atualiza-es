import { Injectable, Logger } from '@nestjs/common';
import * as youtubedl from 'youtube-dl-exec';
import * as path from 'path';
import * as fs from 'fs';

@Injectable()
export class DownloaderService {
  private readonly logger = new Logger(DownloaderService.name);

  async downloadAudio(url: string, targetDir: string): Promise<string | null> {
    try {
      this.logger.log(`Iniciando download de: ${url}`);
      
      if (!fs.existsSync(targetDir)) {
        fs.mkdirSync(targetDir, { recursive: true });
      }

      // O yt-dlp é extremamente poderoso. Vamos configurar para extrair áudio com a melhor qualidade.
      await youtubedl(url, {
        extractAudio: true,
        audioFormat: 'mp3',
        audioQuality: '0', // Melhor qualidade
        output: path.join(targetDir, '%(title)s.%(ext)s'),
        noCheckCertificates: true,
        noWarnings: true,
        preferFreeFormats: true,
        addMetadata: true,
      });

      // Como o yt-dlp não retorna o caminho exato do arquivo facilmente,
      // vamos buscar o arquivo .mp3 mais recente na pasta de destino.
      const files = fs.readdirSync(targetDir)
        .map(file => ({
          name: file,
          time: fs.statSync(path.join(targetDir, file)).mtime.getTime()
        }))
        .sort((a, b) => b.time - a.time);

      if (files.length > 0) {
        const latestFile = path.join(targetDir, files[0].name);
        this.logger.log(`Download concluído e localizado: ${latestFile}`);
        return latestFile;
      }

      return null;
    } catch (error) {
      this.logger.error(`Erro no download: ${error.message}`);
      return null;
    }
  }
}
