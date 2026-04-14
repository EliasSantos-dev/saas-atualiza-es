import { Injectable, NotFoundException, StreamableFile } from '@nestjs/common';
import { createReadStream, existsSync } from 'fs';
import { join } from 'path';

@Injectable()
export class MediaService {
  private readonly rootDir = join(process.cwd(), '..', '16gb_atualizacao_marco_2026_vol.01_(Sem_Vinheta)_@kelcds');

  getFileStream(filePath: string): StreamableFile {
    const fullPath = join(this.rootDir, filePath);
    
    // Segurança: Impede sair da pasta root
    if (!fullPath.startsWith(this.rootDir)) {
      throw new NotFoundException('Arquivo inválido');
    }

    if (!existsSync(fullPath)) {
      throw new NotFoundException('Arquivo não encontrado no servidor');
    }

    const file = createReadStream(fullPath);
    return new StreamableFile(file);
  }
}
