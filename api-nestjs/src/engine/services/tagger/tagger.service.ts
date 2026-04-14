import { Injectable, Logger } from '@nestjs/common';
import * as NodeID3 from 'node-id3';
import axios from 'axios';

@Injectable()
export class TaggerService {
  private readonly logger = new Logger(TaggerService.name);

  async setTags(filePath: string, tags: NodeID3.Tags): Promise<boolean> {
    try {
      this.logger.log(`Aplicando tags ID3 em: ${filePath}`);
      const success = NodeID3.write(tags, filePath);
      if (success instanceof Error) {
        throw success;
      }
      return !!success;
    } catch (error) {
      this.logger.error(`Erro ao aplicar tags: ${error.message}`);
      return false;
    }
  }

  async downloadAndSetCover(filePath: string, imageUrl: string): Promise<boolean> {
    try {
      this.logger.log(`Baixando capa do álbum: ${imageUrl}`);
      const response = await axios.get(imageUrl, { responseType: 'arraybuffer' });
      const imageBuffer = Buffer.from(response.data, 'binary');

      const tags = {
        image: {
          mime: response.headers['content-type'] || 'image/jpeg',
          type: { id: 3, name: 'front cover' },
          description: 'Capa do Álbum',
          imageBuffer: imageBuffer,
        },
      };

      this.logger.log(`Aplicando capa em: ${filePath}`);
      const success = NodeID3.update(tags, filePath);
      return !!success;
    } catch (error) {
      this.logger.error(`Erro ao baixar/aplicar capa: ${error.message}`);
      return false;
    }
  }

  async readTags(filePath: string): Promise<NodeID3.Tags | null> {
    try {
      return NodeID3.read(filePath);
    } catch (error) {
      this.logger.error(`Erro ao ler tags: ${error.message}`);
      return null;
    }
  }
}
